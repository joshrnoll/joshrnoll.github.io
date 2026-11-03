// astro/src/pages/og/default.png.ts
import type { APIRoute } from 'astro';
import { renderOgImage } from '../../utils/og-image';

export const GET: APIRoute = async () => {
  const png = await renderOgImage('joshrnoll.com');
  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
