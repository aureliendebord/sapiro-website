import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lastModified: z.coerce.date().optional(),
    lang: z.enum(['fr', 'en', 'es']),
    urlSlug: z.string(),
    translationKey: z.string(),
    // Enum verrouillé : une nouvelle catégorie doit aussi être ajoutée aux
    // SECTIONS de src/pages/llms.txt.ts, sinon ses articles n'y figurent pas.
    category: z.enum(['apps', 'art', 'comparatifs', 'concours', 'culture-generale', 'drapeaux', 'education', 'famille', 'formats-quiz', 'geographie', 'histoire', 'monuments', 'nature', 'voyage']),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageCredit: z.string().optional(),
    author: z.string().default('SAPIRO'),
    readingTime: z.number().optional(),
    faqItems: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

export const collections = { blog };
