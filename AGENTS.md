# AGENTS.md / CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and other AI agents when working with code in this repository.

## Project Overview

This is a personal website being migrated from Hugo to **Astro**. The active site lives in `astro/`. The `hugo-archive/` directory is the legacy site — do not modify it.

## Commands

All commands should be run from the `astro/` directory.

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Build production site to ./dist/
npm run preview   # Preview production build locally
npm run test      # Run vitest tests (vitest run)
```

To create a new blog post, use the helper script from the repo root:

```bash
./new-post.sh
```

## Architecture

### Tech Stack

- **Astro 6.1.1** — static site generator with file-based routing
- **TypeScript** (strict mode) — all source files are type-checked
- **Vitest** — testing framework
- **Fuse.js** — client-side search (generates `search-index.json` at build time)

### Content Collections

Content is managed via Astro's content collections, configured in `astro/src/content.config.ts`:

- **blog** — markdown posts in `src/content/blog/`, schema-validated with Zod (title, date, draft, author, tags, description, toc, image, slug)
- **notes** — markdown snippets in `src/content/notes/`, lighter schema (title, date, draft, tags, description)

Draft posts (`draft: true` in frontmatter) are excluded from production builds.

### Key Directories

| Path                    | Purpose                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `astro/src/pages/`      | File-based routing — each `.astro` file is a route                                    |
| `astro/src/components/` | Reusable UI components (NavBar, BlogCard, SearchBar, TagBadge, TypingAnimation, etc.) |
| `astro/src/layouts/`    | Page templates: `BaseLayout` and `BlogPostLayout`                                     |
| `astro/src/styles/`     | `global.css` and `prose.css` (markdown content styling)                               |
| `astro/src/utils/`      | Utility functions; `tags.ts` has unit tests in `tags.test.ts`                         |
| `astro/public/`         | Static assets copied as-is to output                                                  |

### Build & Deployment

- **Output format**: `directory` — routes build to `/slug/index.html` (required for Azure Blob Storage static hosting)
- **Trailing slashes**: always enabled (configured in `astro.config.mjs`)
- **Deployment**: GitHub Actions pushes `dist/` to Azure Blob Storage using a `endpoint_sas_url` repository secret

### Site URL

`https://joshrnoll.com`
