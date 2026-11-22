# cms-oauth-worker

A Cloudflare Worker that signs Decap CMS users in with GitHub for `joshrnoll.com/admin/`. It holds the GitHub OAuth App client secret so the browser never sees it. To deploy it and create the OAuth App, follow [docs/cms-setup.md](../docs/cms-setup.md).

## Routes

| Route | What it does |
| --- | --- |
| `GET /auth?provider=github&scope=<scope>` | Sets a one-time `state` cookie and redirects to GitHub's authorize page. Accepts `public_repo` or `repo` and falls back to `public_repo`. |
| `GET /callback?code=<code>&state=<state>` | Checks `state` against the cookie, trades the code for a token, and returns a page that hands the token to the Decap window. |

The callback page uses the postMessage handshake that Decap's GitHub backend expects. It sends the token only to an origin listed in `ALLOWED_ORIGINS`:

```text
popup  -> opener  "authorizing:github"                       target "*", no token
opener -> popup   "authorizing:github"                       reveals the opener origin
popup  -> opener  "authorization:github:success:{token,...}"  only if that origin is allowed
```

## Configuration

| Name | Kind | Value |
| --- | --- | --- |
| `GITHUB_CLIENT_ID` | Secret | Client ID of the GitHub OAuth App |
| `GITHUB_CLIENT_SECRET` | Secret | Client secret of the GitHub OAuth App |
| `ALLOWED_ORIGINS` | Var in `wrangler.toml` | Comma-separated origins allowed to receive a token. Default `https://joshrnoll.com`. |

Set secrets with `npx wrangler secret put <NAME>`. For `npx wrangler dev`, put them in a `.dev.vars` file, which `.gitignore` excludes. Never commit either value.

## Test

```sh
npm test
```

The tests call the Worker's `fetch` handler in Node 22 with GitHub's token endpoint stubbed. They need no Cloudflare account and no network.
