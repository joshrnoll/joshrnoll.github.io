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

// First-draft copy and example connections. Replace these with actual scraps.
export const wallScraps: Scrap[] = [
  { id: 'agent-handoff', text: 'What goes in a good agent handoff?', paper: 'yellow' },
  {
    id: 'ai-native',
    text: 'Am I still the engineer if the agent wrote it?',
    paper: 'ink',
    ink: 'blue',
    target: 'post-impostor-syndrome-of-the-ai-native-engineer',
  },
  { id: 'rebuild', text: 'Can I rebuild the lab from a blank disk?', paper: 'ruled' },
  { id: 'dashboard', text: 'one dashboard\nfor everything', paper: 'pink', ink: 'red', crossedOut: true },
  { id: 'someday', text: 'someday?\na field guide to things I broke', paper: 'ink', ink: 'green' },
  {
    id: 'gitops',
    text: 'What if Git ran the lab?',
    paper: 'blue',
    ink: 'green',
    target: 'project-homelab-as-code',
  },
];

export const scrapyardScraps: Scrap[] = [
  { id: 'agent-receipts', text: 'Agent handoff receipts\nWhat changed, what failed, what needs a human?', paper: 'yellow' },
  { id: 'second-lab', text: 'A homelab to monitor the homelab', paper: 'pink', ink: 'red', crossedOut: true },
  { id: 'small-breakages', text: 'A field guide to small breakages\nOne mistake and one fix per entry.', paper: 'blue' },
  { id: 'recovery-drill', text: 'Pull the plug on a spare box. Time the recovery.', paper: 'ruled' },
  { id: 'packet-tour', text: 'someday?\nFollow one packet across the whole lab.', paper: 'ink', ink: 'green' },
];
