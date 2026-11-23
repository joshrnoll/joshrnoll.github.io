import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import type { ZodType } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    author: z.string().default('Josh Noll'),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    toc: z.boolean().default(false),
    // Retained for schema compatibility — NOT rendered as a featured image anywhere
    image: z.string().optional(),
    // Explicit slug override for 2 legacy posts; if absent, filename is used
    slug: z.string().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
  }),
});

// Page copy edited in Decap CMS. Each collection holds one YAML file in
// src/content/site/, read with getEntry('<collection>', '<collection>').
const site = (name: string) => glob({ pattern: `${name}.yaml`, base: './src/content/site' });
// Decap writes an emptied optional field as "" or null. Treat both as unset.
const optional = <T extends ZodType>(schema: T) =>
  z.preprocess(value => (value === '' || value === null ? undefined : value), schema.optional());

const home = defineCollection({
  loader: site('home'),
  schema: z.object({
    pageTitle: z.string(),
    tagline: z.string(),
    hero: z.object({
      name: z.string(),
      erasedFrom: z.string(),
      erasedTo: z.string(),
      finalFirst: z.string(),
      finalSecond: z.string(),
    }),
    wall: z.object({
      scratchHeading: z.string(),
      shippedHeading: z.string(),
      postsHeading: z.string(),
      postsLink: z.string(),
      projectsHeading: z.string(),
      projectsLink: z.string(),
    }),
    about: z.object({
      heading: z.string(),
      photoAlt: z.string(),
      // Markdown. Blank lines separate paragraphs.
      body: z.string(),
      resumeLink: z.string(),
    }),
  }),
});

export const scrapSchema = z.object({
  // A newline starts a new line on the scrap.
  text: z.string().min(1),
  paper: z.enum(['yellow', 'pink', 'blue', 'ruled', 'ink']),
  ink: optional(z.enum(['black', 'blue', 'red', 'green'])),
  crossedOut: optional(z.boolean()),
  // Homepage wall only: draws an arrow to the post or project card with this id.
  target: optional(z.string().regex(/^(post|project)-[a-z0-9-]+$/)),
});

const scraps = defineCollection({
  loader: site('scraps'),
  schema: z.object({
    page: z.object({
      title: z.string(),
      description: z.string(),
      subtitle: z.string(),
      draftNote: optional(z.string()),
    }),
    wall: z.array(scrapSchema).default([]),
    yard: z.array(scrapSchema).default([]),
  }),
});

const homelab = defineCollection({
  loader: site('homelab'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    diagram: z.object({
      heading: z.string(),
      frameTitle: z.string(),
      fullScreenLink: z.string(),
      rawSvgLink: z.string(),
    }),
    sections: z.array(z.object({
      heading: z.string(),
      // Anchor for links such as /homelab/#what-counts. Derived from the heading when unset.
      id: optional(z.string().regex(/^[a-z0-9-]+$/)),
      level: z.enum(['h2', 'h3']),
      // Markdown.
      body: z.string(),
    })),
  }),
});

const projects = defineCollection({
  loader: site('projects'),
  schema: z.object({
    // Project ids shown on the homepage wall, in order. Unknown ids are skipped.
    featured: z.array(z.string()).default([]),
    projects: z.array(z.object({
      // Anchor on /projects/ and the name used by featured and scrap arrows.
      id: z.string().regex(/^[a-z0-9-]+$/),
      title: z.string(),
      description: z.string(),
      stack: z.array(z.string()).default([]),
      links: z.array(z.object({
        label: z.string(),
        href: z.string(),
        external: optional(z.boolean()),
      })).default([]),
    })),
  }),
});

export const collections = { blog, notes, home, scraps, homelab, projects };
