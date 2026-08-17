import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import template from '../data/llms-template.txt?raw';

export const prerender = true;

// Sections du bloc blog, dans l'ordre d'affichage. Les catégories sont
// verrouillées par le z.enum de content.config.ts : une catégorie inconnue
// casse le build au lieu de disparaître silencieusement de la liste.
const SECTIONS: [string, string][] = [
  ['apps', 'Apps'],
  ['art', 'Art & visual culture'],
  ['comparatifs', 'App comparisons'],
  ['concours', 'Exams & study guides'],
  ['culture-generale', 'General knowledge'],
  ['drapeaux', 'Flags'],
  ['education', 'Education'],
  ['famille', 'Family & kids learning'],
  ['formats-quiz', 'Quiz formats'],
  ['geographie', 'Geography'],
  ['histoire', 'History'],
  ['monuments', 'Monuments'],
  ['nature', 'Nature & wildlife'],
  ['voyage', 'Travel & geography curiosity'],
];

const LANGS: { code: 'fr' | 'en' | 'es'; label: string; prefix: string }[] = [
  { code: 'fr', label: 'French', prefix: '/blog/' },
  { code: 'en', label: 'English', prefix: '/en/blog/' },
  { code: 'es', label: 'Spanish', prefix: '/es/blog/' },
];

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');

  const blocks = LANGS.map((lang) => {
    const lines = [`## Blog articles (${lang.label})`, ''];
    for (const [category, label] of SECTIONS) {
      const inSection = posts
        .filter((p) => p.data.lang === lang.code && p.data.category === category)
        .sort((a, b) => a.data.title.localeCompare(b.data.title, lang.code));
      if (!inSection.length) continue;
      lines.push(`### ${label}`, '');
      for (const p of inSection) {
        lines.push(`- [${p.data.title}](https://sapiro.app${lang.prefix}${p.data.urlSlug}/): ${p.data.description}`);
      }
      lines.push('');
    }
    return lines.join('\n');
  });

  const body = template.replace('%%BLOG%%', blocks.join('\n'));
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
