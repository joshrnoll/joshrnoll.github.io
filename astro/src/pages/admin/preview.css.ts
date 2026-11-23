import type { APIRoute } from 'astro';
// The site's own stylesheets, so the Decap CMS preview pane uses the real fonts,
// colors, and post styles. Vite resolves their font imports to /_astro/ files.
import globalCss from '../../styles/global.css?inline';
import proseCss from '../../styles/prose.css?inline';
import tapedPhotosCss from '../../styles/taped-photos.css?inline';
import previewCss from '../../styles/cms-preview.css?inline';

// Served at /admin/preview.css and loaded by public/admin/preview.js.
export const GET: APIRoute = () =>
  new Response([globalCss, proseCss, tapedPhotosCss, previewCss].join('\n'), {
    headers: { 'Content-Type': 'text/css; charset=utf-8' },
  });
