// astro/astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://joshrnoll.com',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: { shikiConfig: { theme: 'github-dark-high-contrast' } },
  vite: {
    server: { allowedHosts: ['hermes.mink-pirate.ts.net'] },
  },
  redirects: {
    '/blog/': { status: 301, destination: '/posts/' },
    '/notes/': { status: 301, destination: '/posts/' },
    '/homelab/hardware': '/archives/homelab/hardware/',
    '/homelab/architecture': '/archives/homelab/architecture/',
  },
  build: {
    format: 'directory',  // /slug/ → /slug/index.html
  },
});
