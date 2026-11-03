// astro/src/pages/og/[collection]/[slug].png.ts
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgImage } from '../../../utils/og-image';

export const getStaticPaths: GetStaticPaths = async () => {
  const [blogPosts, notes] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('notes', ({ data }) => !data.draft),
  ]);

  return [
    ...blogPosts.map((post) => ({
      params: {
        collection: 'blog',
        slug: post.data.slug ?? post.id.replace(/\.mdx?$/, ''),
      },
      props: { title: post.data.title },
    })),
    ...notes.map((note) => ({
      params: {
        collection: 'notes',
        slug: note.id.replace(/\.mdx?$/, ''),
      },
      props: { title: note.data.title },
    })),
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props.title as string);
  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
