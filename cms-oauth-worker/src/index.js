// GitHub OAuth proxy for Decap CMS.
//
// Decap opens GET /auth in a popup. The Worker sends the browser to GitHub,
// GitHub returns to GET /callback with a code, and the Worker trades the code
// for a token using the client secret. The callback page hands the token to
// the Decap window with the postMessage handshake Decap expects:
//
//   popup  -> opener  "authorizing:github"            (any origin; no token)
//   opener -> popup   "authorizing:github"            (reveals the opener's origin)
//   popup  -> opener  "authorization:github:success:{...}"  (only to ALLOWED_ORIGINS)
//
// Environment:
//   GITHUB_CLIENT_ID      secret, from the GitHub OAuth App
//   GITHUB_CLIENT_SECRET  secret, from the GitHub OAuth App
//   ALLOWED_ORIGINS       var, comma-separated origins allowed to receive a token

const STATE_COOKIE = 'decap_oauth_state';
const SCOPES = new Set(['public_repo', 'repo']);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });
    if (url.pathname === '/auth') return startAuth(url, env);
    if (url.pathname === '/callback') return finishAuth(request, url, env);
    return new Response('Not found', { status: 404 });
  },
};

function startAuth(url, env) {
  const provider = url.searchParams.get('provider') ?? 'github';
  if (provider !== 'github') return new Response('Unsupported provider', { status: 400 });
  if (!env.GITHUB_CLIENT_ID) return new Response('GITHUB_CLIENT_ID is not set', { status: 500 });

  const requested = url.searchParams.get('scope') ?? '';
  const scope = SCOPES.has(requested) ? requested : 'public_repo';
  const state = randomHex(16);

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authorize.searchParams.set('redirect_uri', `${url.origin}/callback`);
  authorize.searchParams.set('scope', scope);
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/callback; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
      'Cache-Control': 'no-store',
    },
  });
}

async function finishAuth(request, url, env) {
  const allowed = parseOrigins(env.ALLOWED_ORIGINS);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expected = readCookie(request.headers.get('Cookie'), STATE_COOKIE);

  if (url.searchParams.has('error')) {
    return callbackPage('error', { message: url.searchParams.get('error_description') ?? url.searchParams.get('error') }, allowed);
  }
  if (!code || !state || !expected || state !== expected) {
    return callbackPage('error', { message: 'OAuth state did not match. Close this window and try again.' }, allowed);
  }

  let body;
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'decap-cms-oauth-worker' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/callback`,
      }),
    });
    body = await response.json();
  } catch {
    return callbackPage('error', { message: 'Could not reach GitHub to exchange the code.' }, allowed);
  }

  if (!body.access_token) {
    return callbackPage('error', { message: body.error_description ?? body.error ?? 'GitHub returned no token.' }, allowed);
  }
  return callbackPage('success', { token: body.access_token, provider: 'github' }, allowed);
}

function callbackPage(status, payload, allowedOrigins) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  // JSON.stringify output is a valid JS literal. Escaping "<" keeps it from closing the script tag.
  const literal = (value) => JSON.stringify(value).replace(/</g, '\\u003c');
  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Signing in</title></head>
<body>
<p>Finishing sign-in. This window closes on its own.</p>
<script>
(function () {
  var allowed = ${literal(allowedOrigins)};
  var message = ${literal(message)};
  function receive(event) {
    if (allowed.indexOf(event.origin) === -1) return;
    window.removeEventListener('message', receive);
    window.opener.postMessage(message, event.origin);
  }
  if (!window.opener) {
    document.body.textContent = 'Open this page from the CMS login button.';
    return;
  }
  window.addEventListener('message', receive);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      // Clear the one-time state cookie.
      'Set-Cookie': `${STATE_COOKIE}=; Path=/callback; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}

function parseOrigins(value) {
  return (value ?? '').split(',').map((origin) => origin.trim()).filter(Boolean);
}

function readCookie(header, name) {
  for (const part of (header ?? '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return null;
}

function randomHex(bytes) {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
