import { describe, expect, it } from 'vitest';
import { inkTitle, OG_HEIGHT, OG_WIDTH, renderOgImage, titleSize } from './og-image';

describe('inkTitle', () => {
  it('adds a green period to a title without closing punctuation', () => {
    expect(inkTitle('Building things, writing it down')).toEqual({
      words: ['Building', 'things,', 'writing', 'it', 'down'],
      mark: '.',
    });
  });

  it('keeps a closing question mark as the green mark', () => {
    expect(inkTitle('What is SSL?')).toEqual({ words: ['What', 'is', 'SSL'], mark: '?' });
  });
});

describe('titleSize', () => {
  it('shrinks the title as it gets longer', () => {
    expect(titleSize('kubectl')).toBeGreaterThan(titleSize('What is SSL and how does it work?'));
    expect(titleSize('What is SSL and how does it work?')).toBeGreaterThan(
      titleSize('Ansible for Infrastructure: Lessons Learned in My Homelab Automation Efforts'),
    );
  });
});

describe('renderOgImage', () => {
  it('renders a 1200x630 PNG', async () => {
    const png = await renderOgImage({ title: 'Hello', scribble: 'Josh Noll: test', note: 'May 2, 2024' });
    const view = new DataView(png.buffer, png.byteOffset);
    expect([...png.slice(1, 4)].map(code => String.fromCharCode(code)).join('')).toBe('PNG');
    expect([view.getUint32(16), view.getUint32(20)]).toEqual([OG_WIDTH, OG_HEIGHT]);
  });
});
