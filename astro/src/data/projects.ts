interface Link {
  label: string;
  href: string;
  external?: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  links: Link[];
}

export const projects: Project[] = [
  {
    id: 'black-relay',
    title: 'Black Relay',
    description: 'An IOT data platform built in a 100 day engineering sprint organized by Arrowhead Research.',
    stack: ['MongoDB', 'MQTT', 'Express', 'React', 'Node', 'Docker'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Black-Relay/web-app', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/posts/arrowhead-research_black-relay-activity-7396365923583971328-s-q-?utm_source=share&utm_medium=member_desktop&rcm=ACoAADQ4hdQB1l090rq_JdRTVJdZ1AtdRdGiRe8', external: true },
      { label: 'Website', href: 'https://softunlocked.com', external: true },
    ],
  },
  {
    id: 'convoy-connect',
    title: 'Convoy Connect',
    description: 'Galvanize Software Development Immersive (SDI) Cohort 31 Capstone Project. An app designed to streamline the vehicle dispatch process.',
    stack: ['Postgres', 'Express', 'React', 'Node', 'Knex', 'Docker'],
    links: [
      { label: 'GitHub', href: 'https://github.com/joshrnoll/convoy-connect', external: true },
    ],
  },
  {
    id: 'pi-teach',
    title: 'pi-teach',
    description: 'A Pi extension that turns an agent session into an interactive HTML classroom you can interrupt.',
    stack: ['TypeScript', 'Node', 'HTML'],
    links: [
      { label: 'GitHub', href: 'https://github.com/joshrnoll/pi-teach', external: true },
    ],
  },
  {
    id: 'tailscale-in-my-homelab',
    title: 'Tailscale in my Homelab',
    description: 'How I actually use Tailscale at home, written up so other people can copy it.',
    stack: ['Tailscale', 'Ansible', 'Docker'],
    links: [
      { label: 'GitHub', href: 'https://github.com/joshrnoll/tailscale-info', external: true },
    ],
  },
  {
    id: 'homelab-as-code',
    title: 'Homelab-as-Code',
    description: 'Migrating my homelab to Kubernetes using GitOps.',
    stack: ['Kubernetes', 'Flux', 'Longhorn', 'GitOps'],
    links: [
      { label: 'GitHub', href: 'https://github.com/joshrnoll/homelab-as-code', external: true },
    ],
  },
  {
    id: 'homelab-ansible-galaxy-collection',
    title: 'Homelab Ansible Galaxy Collection',
    description: 'An Ansible Galaxy collection for automating my homelab.',
    stack: ['Ansible', 'Linux', 'Bash'],
    links: [
      { label: 'GitHub', href: 'https://github.com/joshrnoll/ansible-collection-homelab', external: true },
    ],
  },
  {
    id: 'homelab-ansible-playbook',
    title: 'Homelab Ansible Playbook',
    description: 'An Ansible playbook that uses the roles from joshrnoll.homelab.',
    stack: ['Ansible', 'Linux', 'Bash'],
    links: [
      { label: 'GitHub', href: 'https://github.com/joshrnoll/ansible-playbook-homelab', external: true },
    ],
  },
  {
    id: 'traefik-automation-playbook',
    title: 'Traefik Automation Playbook',
    description: 'An automation playbook for installing Traefik and traefik-kop on Tailscale.',
    stack: ['Ansible', 'Linux', 'Bash'],
    links: [
      { label: 'GitHub', href: 'https://github.com/joshrnoll/ansible-playbook-traefik-tailscale', external: true },
    ],
  },
  {
    id: 'bastogne-automation-tool',
    title: 'Bastogne Automation Tool',
    description: 'A custom PowerShell module for automating user creation and compliance checking.',
    stack: ['PowerShell', 'Active Directory', 'Automation'],
    links: [
      { label: 'GitHub', href: 'https://github.com/joshrnoll/BAT', external: true },
    ],
  },
];
