import { getCollection } from 'astro:content';

export type WritingCollection = 'blog' | 'notes';

export async function getWriting(collection?: WritingCollection) {
  const kinds: WritingCollection[] = collection ? [collection] : ['blog', 'notes'];
  const entries = (await Promise.all(kinds.map(kind => getCollection(kind, ({ data }) => !data.draft)))).flat();

  return entries.map(entry => {
    const slug = (entry.collection === 'blog' ? entry.data.slug : undefined) ?? entry.id.replace(/\.mdx?$/, '');
    return {
      ...entry.data,
      collection: entry.collection,
      href: entry.collection === 'notes' ? `/notes/${slug}/` : `/${slug}/`,
    };
  }).sort((first, second) => second.date.valueOf() - first.date.valueOf());
}
