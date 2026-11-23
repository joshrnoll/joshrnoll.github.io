const contentImages = 'main :is(.prose, .projects) img';

export function mountTapedPhotos() {
  for (const image of document.querySelectorAll<HTMLImageElement>(contentImages)) {
    const source = image.getAttribute('src');
    if (!source || image.closest('.taped-photo')) continue;

    const photo = document.createElement('span');
    photo.className = 'taped-photo';

    let hash = 2166136261;
    for (const character of source) {
      hash = Math.imul(hash ^ character.charCodeAt(0), 16777619) >>> 0;
    }
    const angle = (hash % 2 ? -1 : 1) * (0.55 + ((hash >>> 1) % 11) / 10);
    photo.style.setProperty('--photo-tilt', `${angle.toFixed(2)}deg`);
    photo.classList.toggle('taped-photo-double', (hash >>> 5) % 3 !== 0);

    const alignment = (image.style.cssFloat || image.getAttribute('align'))?.toLowerCase();
    if (alignment === 'left' || alignment === 'right') photo.dataset.align = alignment;

    // Keep the width of responsive <picture> sources and legacy image size hints.
    const height = Number(image.getAttribute('height'));
    if (height > 0) photo.style.setProperty('--photo-height', `${height}px`);

    const media = image.closest('picture') ?? image;
    const container = media.parentElement;
    if (!container) continue;
    photo.classList.toggle('taped-photo-alone', Array.from(container.childNodes).every(child =>
      child === media || child.nodeType === Node.COMMENT_NODE ||
      (child.nodeType === Node.TEXT_NODE && !child.textContent?.trim()),
    ));

    const print = document.createElement('span');
    print.className = 'taped-print';
    media.replaceWith(photo);
    print.append(media);
    photo.append(print);

    const figure = photo.closest('figure');
    if (figure?.querySelector(':scope > figcaption')) {
      figure.classList.add('taped-figure');
    }
  }
}
