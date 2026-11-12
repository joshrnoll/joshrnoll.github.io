const BEATS = {
  startMs: 200,
  keyMs: 200,
  afterGgMs: 60,
  afterGMs: 100,
  beforeTypeMs: 80,
  ciwMs: 200,
  insertMs: 120,
  afterTypeMs: 160,
  afterPasteMs: 600,
  afterEndGgMs: 120,
  previewMs: 400,
  fadeMs: 250,
};

const PACE_MS = {
  heading: 25,
  body: 14,
};

const JITTER_MS = 10;

export type IntroCue = {
  row: HTMLElement;
  text: HTMLElement;
  value: string;
  /** ciw holds longer than a plain insert. */
  motion: 'change-word' | 'insert';
  pace: 'heading' | 'body';
  /** Written in one step before the characters, such as "## ". */
  prefix?: string;
};

export type IntroScript = {
  /** Scroll parent for the cursor line. */
  content: HTMLElement;
  /** First buffer line. gg returns here. */
  top: HTMLElement;
  /** Line G jumps to before typing starts. */
  bottom: HTMLElement;
  cues: IntroCue[];
  /** Rows appended in one step after the typed lines. Omit when there is nothing to paste. */
  paste?: HTMLElement[];
  /** Element that fades out before reveal. */
  fade: HTMLElement;
  beforeReturn?: () => void;
  reveal: () => void;
  /** Key, pointer, focus, or this button skips straight to reveal. */
  cancel?: { button?: HTMLElement | null };
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function activate(content: HTMLElement, row: HTMLElement): void {
  content.querySelectorAll('.nvim-line.active').forEach((el) => el.classList.remove('active'));
  row.classList.add('active');
  const pad = parseFloat(getComputedStyle(content).paddingBottom) || 0;
  const top = row.offsetTop + row.offsetHeight + pad - content.clientHeight;
  if (top > content.scrollTop) content.scrollTop = top;
}

async function typeInto(text: HTMLElement, value: string, pace: IntroCue['pace'], cancelled: () => boolean): Promise<void> {
  const step = PACE_MS[pace];
  for (const ch of value) {
    if (cancelled()) return;
    text.textContent = (text.textContent ?? '') + ch;
    await sleep(step + Math.random() * JITTER_MS);
  }
}

export function playNvimIntro(script: IntroScript): Promise<void> {
  let revealed = false;
  const cancelled = () => revealed;

  const revealNow = () => {
    if (revealed) return;
    revealed = true;
    script.reveal();
  };

  if (script.cancel) {
    const stop = () => revealNow();
    document.addEventListener('keydown', stop, { once: true });
    document.addEventListener('pointerdown', stop, { once: true });
    document.addEventListener('focusin', stop);
    script.cancel.button?.addEventListener('click', stop);
  }

  return run(script, cancelled, revealNow);
}

async function run(script: IntroScript, cancelled: () => boolean, revealNow: () => void): Promise<void> {
  await sleep(BEATS.startMs);
  if (cancelled()) return;

  activate(script.content, script.top);
  await sleep(BEATS.keyMs);
  await sleep(BEATS.afterGgMs);
  await sleep(BEATS.keyMs);
  if (cancelled()) return;
  activate(script.content, script.bottom);
  await sleep(BEATS.afterGMs);

  for (const cue of script.cues) {
    if (cancelled()) return;
    activate(script.content, cue.row);
    await sleep(BEATS.beforeTypeMs);
    await sleep(cue.motion === 'change-word' ? BEATS.ciwMs : BEATS.insertMs);
    if (cue.prefix) cue.text.textContent = cue.prefix;
    await typeInto(cue.text, cue.value, cue.pace, cancelled);
    await sleep(BEATS.afterTypeMs);
  }
  if (cancelled()) return;

  const pasted = script.paste ?? [];
  if (pasted.length > 0) {
    await sleep(BEATS.keyMs);
    if (cancelled()) return;
    const frag = document.createDocumentFragment();
    pasted.forEach((row) => frag.appendChild(row));
    script.content.appendChild(frag);
    activate(script.content, pasted[0]);
    await sleep(BEATS.afterPasteMs);
    if (cancelled()) return;
  }

  script.content.scrollTop = 0;
  activate(script.content, script.top);
  script.beforeReturn?.();
  await sleep(BEATS.keyMs);
  await sleep(BEATS.afterEndGgMs);
  await sleep(BEATS.previewMs);
  if (cancelled()) return;

  script.fade.classList.add('fading-out');
  await sleep(BEATS.fadeMs);
  revealNow();
}
