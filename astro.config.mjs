import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://sapiro.app';

// Correspondance des pages a slug fixe/traduit (miroir de src/i18n/routes.ts),
// utilisee pour generer les annotations hreflang du sitemap. On ne peut PAS
// se reposer sur l'option i18n du plugin : elle apparie par substitution de
// prefixe (/art/ -> /es/art/), ce qui est faux ici (slugs traduits : /es/arte/).
const FIXED_ROUTES = [
  { fr: '/', en: '/en/', es: '/es/' },
  { fr: '/art/', en: '/en/art/', es: '/es/arte/' },
  { fr: '/histoire/', en: '/en/history/', es: '/es/historia/' },
  { fr: '/geographie/', en: '/en/geography/', es: '/es/geografia/' },
  { fr: '/nature/', en: '/en/nature/', es: '/es/naturaleza/' },
  { fr: '/concours/', en: '/en/exams/', es: '/es/oposiciones/' },
  { fr: '/famille/', en: '/en/family/', es: '/es/familia/' },
  { fr: '/comparatifs/', en: '/en/comparisons/', es: '/es/comparativas/' },
  { fr: '/pricing/', en: '/en/pricing/', es: '/es/pricing/' },
  { fr: '/privacy/', en: '/en/privacy/', es: '/es/privacy/' },
  { fr: '/terms/', en: '/en/terms/', es: '/es/terms/' },
  { fr: '/faq/', en: '/en/faq/', es: '/es/faq/' },
  { fr: '/quiz/', en: '/en/quiz/', es: '/es/quiz/' },
  { fr: '/blog/', en: '/en/blog/', es: '/es/blog/' },
  { fr: '/credits/', en: '/en/credits/', es: '/es/credits/' },
];

// Lecture minimale du frontmatter YAML d'un fichier markdown.
function readFrontmatter(file) {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return fm;
}

// Scan des articles : alternates hreflang (par translationKey) + lastmod (par URL).
function buildBlogData() {
  const base = './src/content/blog';
  const byKey = {};
  const lastmodByUrl = {};
  for (const lang of ['fr', 'en', 'es']) {
    const dir = path.join(base, lang);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const fm = readFrontmatter(path.join(dir, file));
      if (!fm.urlSlug || !fm.translationKey) continue;
      const url = lang === 'fr'
        ? `${SITE}/blog/${fm.urlSlug}/`
        : `${SITE}/${lang}/blog/${fm.urlSlug}/`;
      (byKey[fm.translationKey] ||= {})[lang] = fm.urlSlug;
      const raw = fm.lastModified || fm.date;
      if (raw) {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) lastmodByUrl[url] = d.toISOString();
      }
    }
  }
  return { byKey, lastmodByUrl };
}

const { byKey: BLOG_BY_KEY, lastmodByUrl: BLOG_LASTMOD } = buildBlogData();

// Map URL absolue -> liens alternates (hreflang fr/en/es + x-default).
const ALTERNATES = new Map();
function registerAlternates(fr, en, es) {
  const links = [
    { lang: 'fr', url: `${SITE}${fr}` },
    { lang: 'en', url: `${SITE}${en}` },
    { lang: 'es', url: `${SITE}${es}` },
    { lang: 'x-default', url: `${SITE}${fr}` },
  ];
  for (const p of [fr, en, es]) ALTERNATES.set(`${SITE}${p}`, links);
}
for (const r of FIXED_ROUTES) registerAlternates(r.fr, r.en, r.es);
for (const slugs of Object.values(BLOG_BY_KEY)) {
  if (slugs.fr && slugs.en && slugs.es) {
    registerAlternates(`/blog/${slugs.fr}/`, `/en/blog/${slugs.en}/`, `/es/blog/${slugs.es}/`);
  }
}

export default defineConfig({
  site: SITE,
  adapter: cloudflare(),
  integrations: [sitemap({
    customPages: [
      `${SITE}/credits/`,
      `${SITE}/en/credits/`,
      `${SITE}/es/credits/`,
    ],
    // hreflang corrects (slugs traduits) + lastmod reel par article.
    serialize(item) {
      const links = ALTERNATES.get(item.url);
      if (links) item.links = links;
      const lastmod = BLOG_LASTMOD[item.url];
      if (lastmod) item.lastmod = lastmod;
      return item;
    },
  })],
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
