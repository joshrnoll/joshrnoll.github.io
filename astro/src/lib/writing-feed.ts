import { getWriting, type WritingCollection } from './writing';

const xmlEscape: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
const escape = (value: string) => value.replace(/[&<>"']/g, character => xmlEscape[character]);

export async function writingFeed(site: URL, pathname: string, collection?: WritingCollection) {
  const posts = await getWriting(collection);
  const title = collection === 'notes' ? 'Josh Noll - Notes' : collection === 'blog' ? 'Josh Noll - Blog' : 'Josh Noll - Posts';
  const link = (path: string) => escape(new URL(path, site).href);
  const items = posts.map(post => {
    const url = link(post.href);
    return `<item><title>${escape(post.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${post.date.toUTCString()}</pubDate><description>${escape(post.description ?? '')}</description></item>`;
  }).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${link('/posts/')}</link>
    <description>Software, homelabbing and life.</description>
    <atom:link href="${link(pathname)}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
