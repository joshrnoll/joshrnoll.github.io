// Shared timing for the homepage and resume Neovim intros.
// heading/body are per character. Beats are the pauses around those keystrokes.
// The resume sequence uses every beat; the homepage uses the same lengths.
export const INTRO_TYPING = {
  headingMs: 25,
  bodyMs: 14,
  jitterMs: 10,
};

export const INTRO_BEATS = {
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
