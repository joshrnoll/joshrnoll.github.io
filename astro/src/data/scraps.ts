type Paper = 'yellow' | 'pink' | 'blue' | 'ruled' | 'ink';
type Ink = 'black' | 'blue' | 'red' | 'green';

export interface Scrap {
  id: string;
  text: string;
  paper: Paper;
  ink?: Ink;
  crossedOut?: boolean;
  target?: `post-${string}` | `project-${string}`;
}

// Josh's real scraps. The homepage wall and the Scrapyard show the same four.
// A target must name a card on the homepage, so only Homelab as code links out.
// It goes last so it lands in the column beside its card and the arrow crosses no notes.
export const scrapyardScraps: Scrap[] = [
  {
    id: 'spurstack',
    text: 'Spurstack\nIssue agents that open their own PRs. A prototype I walked away from.',
    paper: 'pink',
    ink: 'red',
    crossedOut: true,
  },
  {
    id: 'codesplainer',
    text: 'Codesplainer\nA Neovim chat for reading code, not writing it. Parked when I left the terminal for agents.',
    paper: 'ruled',
  },
  {
    id: 'clearminder',
    text: "ClearMinder\nA GTD app I documented and haven't built yet. I really want to.",
    paper: 'yellow',
    ink: 'blue',
  },
  {
    id: 'homelab-as-code',
    text: 'Homelab as code\nGitOps for the lab. Flux works. Most of the roadmap does not.',
    paper: 'blue',
    ink: 'green',
    target: 'project-homelab-as-code',
  },
];

export const wallScraps: Scrap[] = scrapyardScraps;
