# Set up the CMS at joshrnoll.com/admin

Decap CMS lets you write and publish posts from a browser, including a phone. The admin page is `astro/public/admin/`, which the site build copies to `/admin/`. Decap commits posts to this repository through the GitHub API. Signing in goes through a small Cloudflare Worker in `cms-oauth-worker/` that holds the GitHub OAuth client secret.

```text
phone or laptop
  joshrnoll.com/admin/          Decap CMS (astro/public/admin/)
    "Login with GitHub" popup
      Worker /auth              redirects to GitHub
      GitHub                    you approve the OAuth App
      Worker /callback          trades the code for a token
    Decap gets the token        commits to joshrnoll/joshrnoll.github.io
main branch push                GitHub Pages workflow rebuilds the site
```

The Worker is named `cms-oauth`, so it serves at `https://cms-oauth.joshrnoll.workers.dev`, and `base_url` in `config.yml` points there. Until the Worker is deployed under that name (step 1) and has its client ID and secret (steps 2 and 3), **Login with GitHub** fails.

## Do these once

Each step creates something outside this repository, so each one needs your approval. Cloudflare steps also need Chuck, who owns the Cloudflare account and DNS.

1. Deploy the Worker on a free `workers.dev` subdomain.

   ```sh
   cd cms-oauth-worker
   npx wrangler login
   npx wrangler deploy
   ```

   Wrangler prints the Worker URL, for example `https://cms-oauth.<account>.workers.dev`. Use that URL in the next steps. If the account has no `workers.dev` subdomain yet, Wrangler asks you to pick one.

2. Create a GitHub OAuth App at <https://github.com/settings/applications/new>.

   | Field | Value |
   | --- | --- |
   | Application name | `joshrnoll.com CMS` |
   | Homepage URL | `https://joshrnoll.com` |
   | Authorization callback URL | `https://cms-oauth.<account>.workers.dev/callback` |
   | Enable Device Flow | Off |

   After you register the app, click **Generate a new client secret**. Copy the client ID and the secret.

3. Store both values as Worker secrets. Each command prompts for the value, so the value never lands in your shell history.

   ```sh
   npx wrangler secret put GITHUB_CLIENT_ID
   npx wrangler secret put GITHUB_CLIENT_SECRET
   ```

4. Done: `backend.base_url` in `astro/public/admin/config.yml` is `https://cms-oauth.joshrnoll.workers.dev`. If the Worker URL changes, update it there with no trailing slash. It goes live on joshrnoll.com when this branch merges to `main` and the Pages workflow deploys.

5. Open <https://joshrnoll.com/admin/>, click **Login with GitHub**, and approve the app. On a phone, add the page to the home screen.

## Optional

- **Custom domain for the Worker.** To use a URL such as `https://cms-auth.joshrnoll.com`, Chuck adds a Workers custom domain in Cloudflare. Then change the OAuth App callback URL and `base_url` to the new host. The `workers.dev` URL works without this.
- **Local testing against GitHub.** Add `http://localhost:4321` to `ALLOWED_ORIGINS` in `cms-oauth-worker/wrangler.toml` and redeploy. Then run `npm run dev` in `astro/` and open `http://localhost:4321/admin/index.html`. The dev server does not map `/admin/` to the folder index, but the production build does.
- **Local testing without GitHub.** From the repository root, run `npx decap-server`, then open the admin page on `localhost`. Decap reads and writes the files in your checkout. This mode saves straight to files and skips the draft workflow.

## How writing works

- **Articles** save to `astro/src/content/blog/<slug>.md` and publish at `/<slug>/`.
- **Notes** save to `astro/src/content/notes/<slug>.md` and publish at `/notes/<slug>/`.
- Images you insert in a post go to `astro/public/<slug>/` for articles and `astro/public/notes/<slug>/` for notes. Images uploaded from the **Media** tab go to `astro/public/uploads/`.
- Decap names the slug from the title. Editing an older post whose title differs from its file name puts new images under the slugified title, not the file name. The links still work.
- The editorial workflow is on. **Save** commits to a `cms/<collection>/<slug>` branch and opens a pull request, so drafts never rebuild the site. **Publish** merges that pull request into `main`, which starts the Pages build.
- **Hide from the site** sets `draft: true`. A published post with it on stays out of the build.

## How page text works

Four more collections edit page content instead of posts. Each one is a single YAML file in `astro/src/content/site/`, checked by a schema in `astro/src/content.config.ts`. A value the schema rejects fails the build, so the Pages workflow stops before it deploys a broken page.

| CMS collection | File | What it holds |
| --- | --- | --- |
| **Homepage** | `home.yaml` | Tagline, the handwritten hero lines, whiteboard headings and link text, and the About me text |
| **Scrapyard** | `scraps.yaml` | Scrapyard page text, the homepage wall scraps, and the Scrapyard page scraps |
| **Homelab** | `homelab.yaml` | Page title, diagram link text, and the text sections |
| **Projects** | `projects.yaml` | The Projects page list, in page order, and which projects the homepage wall features |

- About me paragraphs and Homelab section bodies are Markdown. Blank lines separate paragraphs. Smart quotes are off, so `'` stays straight.
- The hero animation timing is set in CSS for the current line lengths. Much longer lines still write and erase, but the marker moves faster per letter.
- A wall scrap's **Arrow to** must name a card on the wall: `post-<slug>` for one of the 3 latest posts, or `project-<id>` for a featured project. An arrow to anything else is dropped.
- A project's **Link anchor** is its id. Featured picks and scrap arrows (`project-<id>`) use it, so renaming it drops the project from both until you pick it again.
- Saving one of these files rewrites the whole YAML file in Decap's style. The values stay the same.
