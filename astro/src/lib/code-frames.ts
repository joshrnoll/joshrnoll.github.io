const systemTheme = matchMedia('(prefers-color-scheme: dark)');
const svgNamespace = 'http://www.w3.org/2000/svg';
let stopObserving: (() => void) | undefined;

export async function mountCodeFrames() {
  if (!document.querySelector('.prose pre')) return;

  const { default: rough } = await import('roughjs');
  stopObserving?.();
  const blocks = document.querySelectorAll<HTMLPreElement>('.prose pre');
  const root = document.documentElement;

  function draw(block: HTMLPreElement) {
    const width = block.clientWidth;
    const height = block.clientHeight;
    if (width < 16 || height < 16) return;

    const chalk = root.dataset.theme ? root.dataset.theme === 'dark' : systemTheme.matches;
    const svg = document.createElementNS(svgNamespace, 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const frame = rough.svg(svg).rectangle(5, 5, width - 10, height - 10, {
      seed: 4391,
      stroke: chalk ? '#e8dbb2' : '#a8cff5',
      strokeWidth: chalk ? 1.15 : 1.4,
      roughness: chalk ? 1.55 : 1.15,
      bowing: 0.55,
    });
    // The frame lives in the viewport background, outside the scrollable code.
    svg.append(frame);
    const markup = new XMLSerializer().serializeToString(svg);
    block.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(markup)}")`;
  }

  const redraw = () => blocks.forEach(draw);
  const resize = new ResizeObserver(entries => {
    for (const { target } of entries) draw(target as HTMLPreElement);
  });
  blocks.forEach(block => resize.observe(block));

  const theme = new MutationObserver(redraw);
  theme.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  systemTheme.addEventListener('change', redraw);
  document.fonts.addEventListener('loadingdone', redraw);

  stopObserving = () => {
    resize.disconnect();
    theme.disconnect();
    systemTheme.removeEventListener('change', redraw);
    document.fonts.removeEventListener('loadingdone', redraw);
  };
}

document.addEventListener('astro:before-swap', () => {
  stopObserving?.();
  stopObserving = undefined;
});
