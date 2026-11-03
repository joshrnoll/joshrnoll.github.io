// astro/src/pages/notes-search-index.json.ts
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  const index = notes.map(note => ({
    slug: note.id.replace(/\.mdx?$/, ''),
    title: note.data.title,
    description: note.data.description ?? '',
    tags: note.data.tags,
    date: note.data.date.toISOString(),
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
