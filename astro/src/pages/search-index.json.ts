// astro/src/pages/search-index.json.ts
import type { APIRoute } from 'astro';
import { getWriting } from '../lib/writing';

export const GET: APIRoute = async () => {
  const index = (await getWriting()).map(post => ({
    href: post.href,
    title: post.title,
    description: post.description ?? '',
    tags: post.tags,
    kind: post.collection === 'notes' ? 'note' : 'article',
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
