import { createMarkdownProcessor } from '@astrojs/markdown-remark';

// Renders Markdown copy from the CMS data files in src/content/site/.
// Smart quotes are off so apostrophes match the hand-written HTML this replaced.
const processor = createMarkdownProcessor({ smartypants: false, syntaxHighlight: false });

export async function renderMarkdown(source: string): Promise<string> {
  return (await (await processor).render(source)).code;
}
