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

Until you finish the steps below, `/admin/` loads but **Login with GitHub** fails, because `base_url` in `config.yml` is a placeholder.

## Do these once

Each step creates something outside this repository, so each one needs your approval. Cloudflare steps also need Chuck, who owns the Cloudflare account and DNS.

1. Deploy the Worker on a free `workers.dev` subdomain.

   ```sh
   cd cms-oauth-worker
   npx wrangler login
   npx wrangler deploy
   ```

   Wrangler prints the Worker URL, for example `https://joshrnoll-cms-oauth.<account>.workers.dev`. Use that URL in the next steps. If the account has no `workers.dev` subdomain yet, Wrangler asks you to pick one.

2. Create a GitHub OAuth App at <https://github.com/settings/applications/new>.

   | Field | Value |
   | --- | --- |
   | Application name | `joshrnoll.com CMS` |
   | Homepage URL | `https://joshrnoll.com` |
   | Authorization callback URL | `https://joshrnoll-cms-oauth.<account>.workers.dev/callback` |
   | Enable Device Flow | Off |

   After you register the app, click **Generate a new client secret**. Copy the client ID and the secret.

3. Store both values as Worker secrets. Each command prompts for the value, so the value never lands in your shell history.

   ```sh
   npx wrangler secret put GITHUB_CLIENT_ID
   npx wrangler secret put GITHUB_CLIENT_SECRET
   ```

4. In `astro/public/admin/config.yml`, set `backend.base_url` to the Worker URL with no trailing slash:

   ```diff
   -  base_url: https://joshrnoll-cms-oauth.REPLACE-ME.workers.dev
   +  base_url: https://joshrnoll-cms-oauth.<account>.workers.dev
   ```

   Merge that change to `main`. The Pages workflow deploys it.

5. Open <https://joshrnoll.com/admin/>, click **Login with GitHub**, and approve the app. On a phone, add the page to the home screen.

## Optional

- **Custom domain for the Worker.** To use a URL such as `https://cms-auth.joshrnoll.com`, Chuck adds a Workers custom domain in Cloudflare. Then change the OAuth App callback URL and `base_url` to the new host. The `workers.dev` URL works without this.
- **Local testing against GitHub.** Add `http://localhost:4321` to `ALLOWED_ORIGINS` in `cms-oauth-worker/wrangler.toml` and redeploy. Then run `npm run dev` in `astro/` and open `http://localhost:4321/admin/index.html`. The dev server does not map `/admin/` to the folder index, but the production build does.
- **Local testing without GitHub.** From the repository root, run `npx decap-server`, then open the admin page on `localhost`. Decap reads and writes the files in your checkout. This mode saves straight to files and skips the draft workflow.

## How writing works

- **Long reads** save to `astro/src/content/blog/<slug>.md` and publish at `/<slug>/`.
- **Notes** save to `astro/src/content/notes/<slug>.md` and publish at `/notes/<slug>/`.
- Images you insert in a post go to `astro/public/<slug>/` for long reads and `astro/public/notes/<slug>/` for notes. Images uploaded from the **Media** tab go to `astro/public/uploads/`.
- Decap names the slug from the title. Editing an older post whose title differs from its file name puts new images under the slugified title, not the file name. The links still work.
- The editorial workflow is on. **Save** commits to a `cms/<collection>/<slug>` branch and opens a pull request, so drafts never rebuild the site. **Publish** merges that pull request into `main`, which starts the Pages build.
- **Hide from the site** sets `draft: true`. A published post with it on stays out of the build.

## Hook point for a publishing pipeline

The CMS writes commits in fixed shapes, so a later pipeline (for example a Temporal workflow) can find them without parsing post content:

| Event | What lands in git |
| --- | --- |
| Save a draft | Commit `cms(<collection>): create <slug>` or `cms(<collection>): update <slug>` on branch `cms/<collection>/<slug>` |
| Upload media | Commit `cms(media): upload <path>` |
| Publish | Merge commit on `main` titled `Merge pull request #<n> from joshrnoll/cms/<collection>/<slug>`, body `Automatically generated. Merged on Decap CMS.` |

A pipeline can start on the `Deploy to GitHub Pages` workflow run for that merge commit, map the changed file to its URL (`blog/<slug>.md` to `/<slug>/`, `notes/<slug>.md` to `/notes/<slug>/`), wait for the URL to return 200, then queue social posts. The commit message templates are in `backend.commit_messages` in `config.yml`. Change them there and in the pipeline together.
