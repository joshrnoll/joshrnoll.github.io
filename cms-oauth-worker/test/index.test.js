import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

const env = {
  GITHUB_CLIENT_ID: 'test-client-id',
  GITHUB_CLIENT_SECRET: 'test-client-secret',
  ALLOWED_ORIGINS: 'https://joshrnoll.com, http://localhost:4321',
};
const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

const get = (path, headers = {}) =>
  worker.fetch(new Request(`https://cms-oauth.example.workers.dev${path}`, { headers }), env);

async function startAndGetState(query = '?provider=github&scope=public_repo') {
  const response = await get(`/auth${query}`);
  const location = new URL(response.headers.get('Location'));
  const cookie = response.headers.get('Set-Cookie').split(';')[0];
  return { response, location, cookie, state: location.searchParams.get('state') };
}

test('/auth redirects to GitHub with the callback URL, scope, and a state cookie', async () => {
  const { response, location, cookie, state } = await startAndGetState();
  assert.equal(response.status, 302);
  assert.equal(location.origin + location.pathname, 'https://github.com/login/oauth/authorize');
  assert.equal(location.searchParams.get('client_id'), 'test-client-id');
  assert.equal(location.searchParams.get('redirect_uri'), 'https://cms-oauth.example.workers.dev/callback');
  assert.equal(location.searchParams.get('scope'), 'public_repo');
  assert.match(state, /^[0-9a-f]{32}$/);
  assert.equal(cookie, `decap_oauth_state=${state}`);
});

test('/auth falls back to public_repo for an unknown scope', async () => {
  const { location } = await startAndGetState('?provider=github&scope=admin:org');
  assert.equal(location.searchParams.get('scope'), 'public_repo');
});

test('/auth rejects other providers', async () => {
  const response = await get('/auth?provider=gitlab');
  assert.equal(response.status, 400);
});

test('/callback with a matching state exchanges the code and posts the token to allowed origins only', async () => {
  const { cookie, state } = await startAndGetState();
  let sent;
  globalThis.fetch = async (url, init) => {
    sent = { url, body: JSON.parse(init.body) };
    return new Response(JSON.stringify({ access_token: 'gho_test' }), { headers: { 'Content-Type': 'application/json' } });
  };

  const response = await get(`/callback?code=abc&state=${state}`, { Cookie: cookie });
  const html = await response.text();

  assert.equal(sent.url, 'https://github.com/login/oauth/access_token');
  assert.deepEqual(sent.body, {
    client_id: 'test-client-id',
    client_secret: 'test-client-secret',
    code: 'abc',
    redirect_uri: 'https://cms-oauth.example.workers.dev/callback',
  });
  assert.ok(html.includes('authorization:github:success:{\\"token\\":\\"gho_test\\",\\"provider\\":\\"github\\"}'));
  assert.ok(html.includes('["https://joshrnoll.com","http://localhost:4321"]'));
  assert.ok(!html.includes('test-client-secret'));
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('/callback without the state cookie returns an error and never calls GitHub', async () => {
  const { state } = await startAndGetState();
  globalThis.fetch = async () => assert.fail('fetch should not run');
  const html = await (await get(`/callback?code=abc&state=${state}`)).text();
  assert.ok(html.includes('authorization:github:error:'));
  assert.ok(html.includes('state did not match'));
});

test('/callback reports a GitHub error without a token', async () => {
  const { cookie, state } = await startAndGetState();
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ error: 'bad_verification_code', error_description: 'The code passed is incorrect or expired.' }));
  const html = await (await get(`/callback?code=old&state=${state}`, { Cookie: cookie })).text();
  assert.ok(html.includes('authorization:github:error:'));
  assert.ok(html.includes('incorrect or expired'));
});

test('a message cannot close the callback script tag', async () => {
  const { cookie, state } = await startAndGetState();
  globalThis.fetch = async () => new Response(JSON.stringify({ error: '</script><script>alert(1)</script>' }));
  const html = await (await get(`/callback?code=x&state=${state}`, { Cookie: cookie })).text();
  assert.equal(html.match(/<\/script>/g).length, 1);
});

test('other paths and methods are rejected', async () => {
  assert.equal((await get('/')).status, 404);
  const post = await worker.fetch(new Request('https://cms-oauth.example.workers.dev/auth', { method: 'POST' }), env);
  assert.equal(post.status, 405);
});
