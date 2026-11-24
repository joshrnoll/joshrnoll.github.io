// astro/src/pages/og/[version]/[...card].png.ts
import type { APIRoute, GetStaticPaths } from 'astro';
import { getOgCards, OG_VERSION } from '../../../lib/og-cards';
import { renderOgImage, type OgCard } from '../../../utils/og-image';

export const getStaticPaths: GetStaticPaths = async () =>
  (await getOgCards()).map(({ name, card }) => ({
    params: { version: OG_VERSION, card: name },
    props: { card },
  }));

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props.card as OgCard);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
