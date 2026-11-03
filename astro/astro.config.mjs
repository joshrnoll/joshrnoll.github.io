// astro/astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://joshrnoll.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',  // /slug/ → /slug/index.html (required for Azure Blob static hosting)
  },
});
