import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

export const collections = { blog, notes };
