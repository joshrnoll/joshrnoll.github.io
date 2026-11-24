// astro/src/utils/og-image.ts
// Renders the 1200x630 link-preview card: a whiteboard with the page title in
// heavy ink ending in a green period, Josh's handwriting above it, and the
// marker tray along the bottom.
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import path from 'node:path';

export interface OgCard {
  /** Big ink line, like the homepage tagline. */
  title: string;
  /** Handwritten line above the title, such as "Josh Noll: blog post". */
  scribble: string;
  /** Optional handwritten note under the title, such as a date. */
  note?: string;
}

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Same values as the light theme in global.css and MarkerTray.astro.
const ink = {
  board: '#f8f9f5',
  fg: '#202a28',
  comment: '#53615d',
  blue: '#2058a6',
  green: '#23634c',
  red: '#ad3e45',
  black: '#33403b',
};

// Reason: import.meta.url resolves to the compiled dist/ path during build,
// so we use process.cwd() which always points to the astro/ project root.
const root = process.cwd();
const font = (file: string) => readFileSync(path.join(root, file));
const fonts = [
  { name: 'Inter', data: font('node_modules/@fontsource/inter/files/inter-latin-800-normal.woff'), weight: 800 as const },
  { name: 'Josh Noll Hand', data: font('src/assets/fonts/josh-noll-hand.ttf'), weight: 700 as const },
  // Fills in any glyph Josh's handwriting does not have, as on the site.
  { name: 'Kalam', data: font('node_modules/@fontsource/kalam/files/kalam-latin-700-normal.woff'), weight: 700 as const },
];

type Node = { type: string; props: Record<string, unknown> & { style?: Record<string, unknown>; children?: unknown } };
const el = (type: string, style: Record<string, unknown>, children?: unknown, props: Record<string, unknown> = {}): Node =>
  ({ type, props: { ...props, style, children } });

/** Title size steps down with length so long titles still fit in three lines. */
export function titleSize(title: string): number {
  const length = title.length;
  if (length <= 24) return 96;
  if (length <= 44) return 80;
  if (length <= 70) return 66;
  return 56;
}

/**
 * Splits a title into its words and the closing mark that gets the green ink.
 * A title that already ends in . ! or ? keeps that mark; any other title gets a period.
 */
export function inkTitle(title: string): { words: string[]; mark: string } {
  const text = title.trim().replace(/\s+/g, ' ');
  const end = text.match(/[.!?]$/);
  const body = end ? text.slice(0, -1) : text;
  return { words: body.split(' '), mark: end ? end[0] : '.' };
}

const underline = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 153 17" fill="none" stroke="${ink.blue}" stroke-linecap="round">` +
  '<path stroke-width="3" d="M3 12 C20 8 25 7.4 39 7.6 C59 7.9 72 3.4 101 4.6 Q127 4.7 149 3"/>' +
  '<path stroke-width="1.6" opacity=".58" d="M16 14 Q36 11 61 11.5 C74 11.8 106 7.7 130 8.3"/></svg>',
)}`;

function marker(cap: string, rotate: number): Node {
  return el('div', {
    display: 'flex',
    width: '118px',
    height: '16px',
    borderRadius: '4px 7px 6px 3px',
    background: `linear-gradient(90deg, ${cap} 0%, ${cap} 11%, #f6f7f0 11%, #f6f7f0 72%, ${cap} 72%)`,
    boxShadow: 'inset 0 -3px 3px #16252139, 0 3px 3px #26352c48',
    transform: `rotate(${rotate}deg)`,
  });
}

function tray(): Node {
  return el('div', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    padding: '0 64px',
    borderTop: '2px solid #bac2bd',
    background: 'linear-gradient(180deg, #c3ccc5, #eef0eb 30%, #e2e7e1 73%, #b2beb6 74%, #d9dfd9)',
  }, [
    el('div', { display: 'flex', alignItems: 'center', gap: '22px' }, [
      marker(ink.black, 0),
      marker(ink.blue, -2),
      marker(ink.red, 1),
      marker(ink.green, -1),
    ]),
    el('div', {
      display: 'flex',
      width: '72px',
      height: '24px',
      border: '2px solid #172520',
      borderBottom: '6px solid #818b83',
      borderRadius: '6px',
      background: 'repeating-linear-gradient(95deg, #26342f 0px, #26342f 3px, #2e3b35 3px, #2e3b35 5px)',
      transform: 'rotate(4deg)',
    }),
  ]);
}

function cardTree(card: OgCard): Node {
  const size = titleSize(card.title);
  const { words, mark } = inkTitle(card.title);
  const last = words.length - 1;
  const hand = { fontFamily: 'Josh Noll Hand, Kalam', fontWeight: 700 };

  const title = el('div', {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: `${Math.round(size * 0.24)}px`,
    maxWidth: '1040px',
    color: ink.fg,
    fontFamily: 'Inter',
    fontWeight: 800,
    fontSize: `${size}px`,
    lineHeight: 1.06,
    letterSpacing: '-0.05em',
  }, words.map((word, index) => index === last
    ? el('div', { display: 'flex' }, [word, el('span', { color: ink.green }, mark)])
    : el('div', { display: 'flex' }, word)));

  return el('div', {
    width: `${OG_WIDTH}px`,
    height: `${OG_HEIGHT}px`,
    display: 'flex',
    flexDirection: 'column',
    background: '#a9b1ab',
    padding: '14px 14px 0',
  }, [
    // Whiteboard surface inside a thin aluminium frame.
    el('div', {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      padding: '0 72px',
      borderRadius: '6px 6px 0 0',
      background: `radial-gradient(ellipse at 22% 12%, #ffffff 0%, ${ink.board} 46%, #eef0ea 100%)`,
      boxShadow: 'inset 0 0 0 2px #d7ded7, inset 0 2px 10px #202a2818',
    }, [
      el('div', { ...hand, display: 'flex', color: ink.blue, fontSize: '50px', lineHeight: 1.1, marginBottom: '22px' }, card.scribble),
      title,
      el('img', { width: '200px', height: '22px', marginTop: '20px' }, undefined, { src: underline, width: 200, height: 22 }),
      card.note
        ? el('div', { ...hand, display: 'flex', color: ink.comment, fontSize: '38px', marginTop: '14px' }, card.note)
        : el('div', { display: 'flex' }),
      el('div', { ...hand, position: 'absolute', right: '64px', bottom: '30px', display: 'flex', color: ink.green, fontSize: '36px' }, 'joshrnoll.com'),
    ]),
    tray(),
  ]);
}

export async function renderOgImage(card: OgCard): Promise<Uint8Array> {
  // satori's types expect a React element; this plain object has the same shape.
  const svg = await satori(cardTree(card) as Parameters<typeof satori>[0], {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts,
  });
  return new Resvg(svg).render().asPng();
}
