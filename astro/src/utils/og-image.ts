// astro/src/utils/og-image.ts
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import path from 'path';

// Reason: import.meta.url resolves to the compiled dist/ path during build,
// so we use process.cwd() which always points to the astro/ project root.
const fontPath = path.join(process.cwd(), 'src/assets/fonts/JetBrainsMono-Regular.ttf');
const fontData = readFileSync(fontPath);

export async function renderOgImage(title: string): Promise<Buffer> {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          background: '#1a1b26',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'JetBrains Mono',
          position: 'relative',
        },
        children: [
          // Left accent bar
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: '0px',
                top: '80px',
                bottom: '80px',
                width: '5px',
                background: '#7aa2f7',
                borderRadius: '0 3px 3px 0',
              },
            },
          },
          // Top spacer
          { type: 'div', props: { children: '' } },
          // Title
          {
            type: 'div',
            props: {
              style: {
                color: '#c0caf5',
                fontSize: '56px',
                fontWeight: 700,
                lineHeight: 1.2,
                maxWidth: '900px',
              },
              children: title,
            },
          },
          // Footer
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'flex-end',
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    color: '#7aa2f7',
                    fontSize: '28px',
                  },
                  children: 'joshrnoll.com',
                },
              },
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'JetBrains Mono', data: fontData, weight: 400 }],
    }
  );

  return Buffer.from(new Resvg(svg).render().asPng());
}
