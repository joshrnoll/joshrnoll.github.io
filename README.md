# Josh Noll's website

The Astro website lives in `astro/` at the repository root; `resume/` contains the resume and `homelab-diagram/` contains the current diagram and viewer.

Build the complete site with `bash scripts/build-site.sh`. Set `SKIP_RESUME_BUILD=1` to use the committed resume output for a quick build. The output is in `astro/dist/`.

GitHub Pages deploys from `main` using `.github/workflows/pages.yml`.
