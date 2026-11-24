// astro/src/lib/og-cards.ts
// Every link-preview card the site builds, keyed by the page URL it belongs to.
import { getEntry } from 'astro:content';
import type { OgCard } from '../utils/og-image';
import { getWriting } from './writing';

// Bump when the card design changes. The image URLs change with it, so iMessage,
// LinkedIn, X and Slack fetch the new card instead of serving a cached old one.
const VERSION = 'v2';
const HOME = '/';

/** `/notes/kubectl/` → `notes/kubectl`; the homepage is `home`. */
const cardName = (page: string) => page.replace(/^\/|\/$/g, '') || 'home';

/** Path of the card image for a page URL, served by `src/pages/og/[version]/[...card].png.ts`. */
export const ogImagePath = (page: string) => `/og/${VERSION}/${cardName(page)}.png`;

const date = (value: Date) => value.toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
});

async function buildCards(): Promise<Map<string, OgCard>> {
  const [home, homelab, scraps, writing] = await Promise.all([
    getEntry('home', 'home'),
    getEntry('homelab', 'homelab'),
    getEntry('scraps', 'scraps'),
    getWriting(),
  ]);
  const scribble = (what: string) => `Josh Noll: ${what}`;
  const hero = home!.data.hero;

  const cards = new Map<string, OgCard>([
    [HOME, { title: home!.data.tagline, scribble: hero.name, note: `${hero.finalFirst} ${hero.finalSecond}` }],
    ['/homelab/', { title: homelab!.data.title, scribble: scribble('homelab') }],
    ['/projects/', { title: 'Projects', scribble: scribble('things I built') }],
    ['/scrapyard/', { title: scraps!.data.page.title, scribble: scribble('loose ends') }],
    ['/posts/', { title: 'Posts', scribble: scribble('articles and notes') }],
    ['/resume/', { title: 'Resume', scribble: scribble('infantryman to infrastructure engineer') }],
  ]);
  for (const post of writing) {
    cards.set(post.href, {
      title: post.title,
      scribble: scribble(post.collection === 'notes' ? 'notes' : 'blog post'),
      note: date(post.date),
    });
  }
  return cards;
}

/** Every card to render, with the image path it is served at. */
export async function getOgCards(): Promise<{ name: string; card: OgCard }[]> {
  return [...(await buildCards())].map(([page, card]) => ({ name: cardName(page), card }));
}

/** Image path for a page. Pages without their own card share the homepage card. */
export async function ogImageFor(page: string): Promise<string> {
  return ogImagePath((await buildCards()).has(page) ? page : HOME);
}

export const OG_VERSION = VERSION;
