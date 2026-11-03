// astro/astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://joshrnoll.com',
  trailingSlash: 'always',
  redirects: {
    '/homelab/hardware': '/archives/homelab/hardware/',
    '/homelab/architecture': '/archives/homelab/architecture/',
  },
  build: {
    format: 'directory',  // /slug/ → /slug/index.html
  },
});
