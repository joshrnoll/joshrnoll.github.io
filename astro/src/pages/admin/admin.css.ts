import type { APIRoute } from 'astro';
// Whiteboard Wall theme for the Decap CMS admin chrome. Vite resolves the
// font imports to /_astro/ files. Served at /admin/admin.css.
import adminCss from '../../styles/cms-admin.css?inline';

export const GET: APIRoute = () =>
  new Response(adminCss, { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
