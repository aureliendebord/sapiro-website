import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['fr', 'en', 'es']),
    urlSlug: z.string(),
    category: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    author: z.string().default('SAPIRO'),
    readingTime: z.number().optional(),
  }),
});

export const collections = { blog };
