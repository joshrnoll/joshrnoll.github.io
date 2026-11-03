// astro/src/pages/search-index.json.ts
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const index = posts.map(post => ({
    slug: post.data.slug ?? post.id.replace(/\.mdx?$/, ''),
    title: post.data.title,
    description: post.data.description ?? '',
    tags: post.data.tags,
    date: post.data.date.toISOString(),
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
