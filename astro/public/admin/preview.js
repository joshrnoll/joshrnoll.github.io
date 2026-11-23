// Decap CMS preview templates. Each one imitates the page its collection
// builds, using the site's own CSS from /admin/preview.css (built from
// src/pages/admin/preview.css.ts). Decap supplies the globals CMS, h
// (React.createElement), and createClass. Fields can be empty while typing,
// so every template reads them through the helpers below.
(() => {
  const { CMS, h, createClass } = window;

  CMS.registerPreviewStyle('/admin/preview.css');

  // ---- Helpers

  const toJS = (value) => (value && typeof value.toJS === 'function' ? value.toJS() : value);
  const read = (entry, ...path) => toJS(entry.getIn(['data', ...path]));
  const str = (value) => (value == null ? '' : String(value));
  const list = (value) => {
    if (Array.isArray(value)) return value.filter((item) => item != null && item !== '');
    // A list widget can briefly hold the raw comma-separated text.
    if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
    return [];
  };
  // Same rule as src/pages/homelab/index.astro.
  const slugify = (text) => str(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  // Posts are built on UTC machines, so their dates are UTC days.
  const formatDate = (value) => {
    const date = value ? new Date(value) : undefined;
    if (!date || Number.isNaN(date.valueOf())) return '';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  };
  // Renders a Markdown field nested in an object or list item, such as
  // about.body or sections[i].body. widgetsFor() would be the usual call, but
  // in decap-cms 3.17.3 it throws on file collections (no fieldsMetaData).
  const nestedMarkdown = ({ fields, entry, widgetFor }, path, name) => {
    const parent = fields.find((field) => field.get('name') === path[0]);
    const nested = parent && parent.get('fields');
    const value = entry.getIn(['data', ...path]);
    return nested && value && value.get ? widgetFor(name, nested, value) : null;
  };

  const note = (label, value, red) =>
    h('span', { key: label, className: red ? 'cms-note is-red' : 'cms-note' }, h('b', null, label), value || null);
  const empty = (label) => h('span', { className: 'cms-empty' }, label);

  const svg = (className, viewBox, paths, extra) =>
    h('svg', { className, viewBox, 'aria-hidden': 'true', ...extra },
      paths.map((d, index) => (typeof d === 'string' ? h('path', { key: index, d, pathLength: 1 }) : h('path', { key: index, pathLength: 1, ...d }))));

  // The site's dark mode roughens marker strokes with this filter (src/layouts/BaseLayout.astro).
  const chalkFilter = h('svg', { width: 0, height: 0, style: { position: 'absolute' }, 'aria-hidden': 'true' },
    h('defs', null,
      h('filter', { id: 'chalk-grain', x: '-10%', y: '-20%', width: '120%', height: '140%' },
        h('feTurbulence', { type: 'fractalNoise', baseFrequency: '.68', numOctaves: '3', stitchTiles: 'stitch', result: 'grain' }),
        h('feColorMatrix', { in: 'grain', type: 'matrix', values: '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 3.3 -.86', result: 'chalk' }),
        h('feComposite', { in: 'SourceGraphic', in2: 'chalk', operator: 'in' }))));

  // Port of src/lib/taped-photos.ts: frames each content image as a taped print.
  function tapePhotos(root) {
    const doc = root.ownerDocument;
    for (const image of root.querySelectorAll(':is(.prose, .projects) img')) {
      const source = image.getAttribute('src');
      if (!source || image.closest('.taped-photo')) continue;

      const photo = doc.createElement('span');
      photo.className = 'taped-photo';
      let hash = 2166136261;
      for (const character of source) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619) >>> 0;
      const angle = (hash % 2 ? -1 : 1) * (0.55 + ((hash >>> 1) % 11) / 10);
      photo.style.setProperty('--photo-tilt', `${angle.toFixed(2)}deg`);
      photo.classList.toggle('taped-photo-double', (hash >>> 5) % 3 !== 0);

      const alignment = (image.style.cssFloat || image.getAttribute('align') || '').toLowerCase();
      if (alignment === 'left' || alignment === 'right') photo.dataset.align = alignment;
      const height = Number(image.getAttribute('height'));
      if (height > 0) photo.style.setProperty('--photo-height', `${height}px`);

      const media = image.closest('picture') || image;
      const container = media.parentElement;
      if (!container) continue;
      photo.classList.toggle('taped-photo-alone', Array.from(container.childNodes).every((child) =>
        child === media || child.nodeType === 8 || (child.nodeType === 3 && !child.textContent.trim())));

      const print = doc.createElement('span');
      print.className = 'taped-print';
      media.replaceWith(photo);
      print.append(media);
      photo.append(print);
      const figure = photo.closest('figure');
      if (figure && figure.querySelector(':scope > figcaption')) figure.classList.add('taped-figure');
    }
  }

  // Wraps every template: the site's <main>, the chalk filter, the visitor's
  // saved light/dark choice, and taped photos that follow Markdown edits.
  const Page = createClass({
    componentDidMount() {
      const doc = this.root.ownerDocument;
      try {
        const theme = doc.defaultView.localStorage.getItem('board-theme');
        if (theme === 'light' || theme === 'dark') doc.documentElement.dataset.theme = theme;
      } catch {
        // Follow the system theme when storage is unavailable.
      }
      tapePhotos(this.root);
      this.observer = new doc.defaultView.MutationObserver(() => tapePhotos(this.root));
      this.observer.observe(this.root, { childList: true, subtree: true });
    },
    componentWillUnmount() {
      if (this.observer) this.observer.disconnect();
    },
    render() {
      return h('div', { className: `cms-preview ${this.props.className}`, ref: (element) => { this.root = element; } },
        chalkFilter,
        h('main', null, this.props.children));
    },
  });

  // ---- Articles and Notes (src/layouts/BlogPostLayout.astro)

  function PostPreview({ entry, widgetFor }) {
    const title = str(read(entry, 'title'));
    const date = read(entry, 'date');
    const tags = list(read(entry, 'tags'));
    const description = str(read(entry, 'description')).trim();
    const notes = [
      read(entry, 'draft') && note('Draft', 'Hidden from the site.', true),
      description && note('Description', description),
      entry.get('collection') === 'blog' && read(entry, 'toc') && note('Table of contents', 'Shown beside the post on wide screens.'),
    ].filter(Boolean);

    return h(Page, { className: 'cms-post' },
      h('div', { className: 'post-layout container' },
        h('article', { className: 'post-content' },
          h('header', { className: 'post-header' },
            h('a', { className: 'back-link', href: '/posts/' }, h('span', { 'aria-hidden': 'true' }, '←'), ' All posts'),
            h('h1', { className: 'page-title post-title' }, title || empty('Untitled')),
            svg('title-underline chalk-stroke', '0 0 153 17', [
              'M3 12 C20 8 25 7.4 39 7.6 C59 7.9 72 3.4 101 4.6 Q127 4.7 149 3',
              'M16 14 Q36 11 61 11.5 C74 11.8 106 7.7 130 8.3',
            ], { fill: 'none' }),
            h('div', { className: 'post-meta' },
              h('time', null, formatDate(date) || empty('No date')),
              tags.length > 0 && h('div', { className: 'post-tags' },
                tags.map((tag) => h('span', { key: tag, className: 'tag-badge' }, tag)))),
            notes.length > 0 && h('div', { className: 'cms-notes' }, notes)),
          h('div', { className: 'prose' }, widgetFor('body')))));
  }

  // ---- Homepage (src/pages/index.astro, HeroHandwriting.astro)

  function HomePreview(props) {
    const { entry } = props;
    const hero = read(entry, 'hero') || {};
    const wall = read(entry, 'wall') || {};
    const about = read(entry, 'about') || {};
    const aboutBody = nestedMarkdown(props, ['about'], 'body');

    const group = (heading, link, placeholder) =>
      h('section', { className: 'shipped-group' },
        h('div', { className: 'group-heading' }, h('h3', null, str(heading)), h('a', { href: '#' }, str(link))),
        h('ul', null, h('li', { className: 'shipped-card is-placeholder' },
          h('a', null, h('span', { className: 'project-description' }, placeholder)))));

    return h(Page, { className: 'cms-home' },
      h('div', { className: 'container wall' },
        h('header', { className: 'wall-intro' },
          h('h1', null, str(read(entry, 'tagline')), h('span', { className: 'title-dot' }, '.')),
          h('div', { className: 'handwriting' },
            h('p', { className: 'handwriting-name' }, str(hero.name)),
            h('p', null,
              h('span', { className: 'first-line', title: 'Written, then erased' },
                h('span', null, str(hero.erasedFrom)),
                svg('chalk-stroke', '0 0 48 21', ['M2 12Q18 6 44 10M34 3l11 7-10 7M8 13q19-4 29-2']),
                h('span', null, str(hero.erasedTo))),
              h('span', { className: 'final-line' },
                h('span', null, str(hero.finalFirst)),
                h('span', null, str(hero.finalSecond)))))),

        h('div', { className: 'whiteboard' },
          h('div', null,
            h('p', { className: 'rough-heading' },
              h('span', null, str(wall.scratchHeading)),
              svg('chalk-stroke', '0 0 190 20', ['M3 13Q39 6 94 7t91 1M19 16Q91 8 158 12'], { preserveAspectRatio: 'none' })),
            h('p', null, note('Scraps', 'Edit them in the Scrapyard collection.'))),
          h('section', { className: 'shipped' },
            h('h2', null, str(wall.shippedHeading), h('span', null, '.')),
            group(wall.postsHeading, wall.postsLink, 'Your three latest posts go here.'),
            group(wall.projectsHeading, wall.projectsLink, 'Featured projects go here. Pick them in Projects.'))),

        h('section', { className: 'about' },
          h('div', { className: 'about-photo' },
            h('span', { className: 'about-tape', 'aria-hidden': 'true' }),
            h('img', {
              src: 'https://www.gravatar.com/avatar/d5377efce60675699a15b47511b8b451?s=400&d=mp',
              alt: str(about.photoAlt), width: 200, height: 200,
            })),
          h('div', { className: 'about-text' },
            h('h2', null, str(about.heading)),
            aboutBody || empty('No paragraphs yet.'),
            h('a', { className: 'resume-link', href: '/resume/' },
              str(about.resumeLink),
              svg('chalk-stroke', '0 0 70 26', ['M3 17Q25 10 44 12T65 13', 'M55 4Q60 6 66 13q-8 2-13 9', { className: 'resume-echo', d: 'M9 18q25-7 44-4' }]))))));
  }

  // ---- Scrapyard (src/pages/scrapyard/index.astro, BoardScrap.astro)

  const ringPaths = [
    'M164 12C122 1 63 6 30 21 9 30 0 44 9 65c10 25 53 39 105 40 57 1 115-16 120-48 4-21-19-38-46-46-17-5-24-5-35-5',
    { className: 'dry-ink', d: 'M149 9C78 2 20 20 12 44 2 78 60 103 126 102c49-1 100-20 105-44 6-24-24-39-73-47' },
  ];
  const strikePaths = ['M17 61Q77 58 123 49T221 39', { className: 'dry-ink', d: 'M29 69Q81 65 141 53T228 41' }];

  function Scrap({ scrap, onWall }) {
    const lines = str(scrap.text).split('\n');
    const target = onWall && scrap.target ? str(scrap.target) : '';
    const paper = ['yellow', 'pink', 'blue', 'ruled', 'ink'].includes(scrap.paper) ? scrap.paper : 'yellow';
    return h('div', { className: `scrap paper-${paper} ink-${scrap.ink || 'black'}`, 'data-thread': target || undefined },
      h('span', { className: 'scrap-text' },
        str(scrap.text).trim()
          ? lines.map((line, index) => h('span', { key: index, className: 'scrap-line' }, line || ' '))
          : empty('Empty scrap')),
      target && svg('scrap-mark ring chalk-stroke', '0 0 240 112', ringPaths, { preserveAspectRatio: 'none' }),
      target && h('span', { className: 'scrap-target' }, `→ ${target}`),
      scrap.crossedOut && svg('scrap-mark strike chalk-stroke', '0 0 240 112', strikePaths, { preserveAspectRatio: 'none' }));
  }

  function ScrapsPreview({ entry }) {
    const page = read(entry, 'page') || {};
    const wall = (read(entry, 'wall') || []).filter(Boolean);
    const yard = (read(entry, 'yard') || []).filter(Boolean);

    return h(Page, { className: 'cms-scraps' },
      h('div', { className: 'container yard' },
        h('header', { className: 'yard-header' },
          h('h1', null, str(page.title), h('span', null, '.')),
          h('p', null, str(page.subtitle)),
          str(page.draftNote).trim() && h('p', { className: 'draft-note' }, page.draftNote)),
        h('ul', { className: 'yard-scraps' },
          yard.length
            ? yard.map((scrap, index) => h('li', { key: index }, h(Scrap, { scrap })))
            : h('li', null, empty('No Scrapyard scraps yet.'))),

        h('h2', { className: 'cms-section-label' }, 'Homepage wall scraps'),
        h('div', { className: 'whiteboard' },
          h('div', { className: 'scrap-grid' },
            wall.length
              ? wall.map((scrap, index) => h('div', { key: index, className: 'scrap-slot' }, h(Scrap, { scrap, onWall: true })))
              : empty('No homepage scraps yet.')))));
  }

  // ---- Homelab (src/pages/homelab/index.astro)

  function HomelabPreview(props) {
    const { entry } = props;
    const diagram = read(entry, 'diagram') || {};
    // Keep empty items, so each index still matches the entry for nestedMarkdown.
    const sections = read(entry, 'sections') || [];

    return h(Page, { className: 'cms-homelab' },
      h('div', { className: 'container post-layout' },
        h('article', { className: 'post-content' },
          h('header', { className: 'post-header' }, h('h1', { className: 'page-title' }, str(read(entry, 'title')))),
          h('div', { className: 'prose' },
            h('h2', { id: 'diagram' }, str(diagram.heading), h('span', { className: 'cms-anchor' }, '#diagram')),
            h('iframe', { src: '/homelab-diagram/viewer.html', title: str(diagram.frameTitle), loading: 'lazy' }),
            h('p', null,
              h('a', { href: '/homelab-diagram/viewer.html' }, str(diagram.fullScreenLink)),
              ' · ',
              h('a', { href: '/homelab-diagram/homelab-diagram.svg' }, str(diagram.rawSvgLink))),
            sections.map((section, index) => {
              const data = section || {};
              const id = str(data.id) || slugify(data.heading);
              return h('section', { key: index },
                h(data.level === 'h2' ? 'h2' : 'h3', { id: id || undefined },
                  str(data.heading) || empty('Untitled section'),
                  id && h('span', { className: 'cms-anchor' }, `#${id}`)),
                nestedMarkdown(props, ['sections', index], 'body'));
            })))));
  }

  // ---- Projects (src/pages/projects/index.astro, featured cards from src/pages/index.astro)

  function ProjectsPreview({ entry }) {
    const projects = (read(entry, 'projects') || []).filter(Boolean);
    const featured = list(read(entry, 'featured'));

    return h(Page, { className: 'cms-projects' },
      h('div', { className: 'container projects' },
        h('section', { className: 'shipped featured' },
          h('h2', { className: 'cms-section-label' }, 'Featured on the homepage'),
          featured.length
            ? h('ul', null, featured.map((id) => {
                const project = projects.find((item) => item.id === id);
                return project
                  ? h('li', { key: id, className: 'shipped-card' },
                      h('a', { href: `#${id}` },
                        h('span', { className: 'card-title' }, str(project.title)),
                        h('span', { className: 'project-description' }, str(project.description)),
                        h('span', { className: 'card-arrow', 'aria-hidden': 'true' }, '↗')))
                  : h('li', { key: id }, note('Skipped', `No project has the anchor "${id}".`, true));
              }))
            : empty('None. The homepage shows no projects.')),

        h('h2', { className: 'cms-section-label' }, 'Projects page'),
        h('h1', { className: 'page-title' }, 'Projects'),
        h('ul', { className: 'project-list' },
          projects.map((project, index) => h('li', { key: index, className: 'project-card', id: project.id || undefined },
            h('h2', null, str(project.title) || empty('Untitled project'),
              project.id && h('span', { className: 'cms-anchor' }, `#${project.id}`)),
            h('p', null, str(project.description)),
            h('ul', { className: 'project-stack', 'aria-label': 'Technologies' },
              list(project.stack).map((tech, i) => h('li', { key: i }, tech))),
            h('div', { className: 'project-links' },
              list(project.links).map((link, i) => h('a', {
                key: i,
                href: str(link.href),
                target: link.external ? '_blank' : undefined,
                rel: link.external ? 'noopener noreferrer' : undefined,
              }, str(link.label), ' ', h('span', { 'aria-hidden': 'true' }, '↗')))))))));
  }

  CMS.registerPreviewTemplate('blog', PostPreview);
  CMS.registerPreviewTemplate('notes', PostPreview);
  // File collections register by file name. Each holds one file of the same name.
  CMS.registerPreviewTemplate('home', HomePreview);
  CMS.registerPreviewTemplate('scraps', ScrapsPreview);
  CMS.registerPreviewTemplate('homelab', HomelabPreview);
  CMS.registerPreviewTemplate('projects', ProjectsPreview);
})();
