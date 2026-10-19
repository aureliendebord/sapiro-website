import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://sapiro.app';

// Langues du site, dans l'ordre d'emission des hreflang. L'allemand ne couvre
// qu'une partie du site : une grappe peut donc etre incomplete.
const LANGS = ['fr', 'en', 'es', 'de'];

// Correspondance des pages a slug fixe/traduit (miroir de src/i18n/routes.ts),
// utilisee pour generer les annotations hreflang du sitemap. On ne peut PAS
// se reposer sur l'option i18n du plugin : elle apparie par substitution de
// prefixe (/art/ -> /es/art/), ce qui est faux ici (slugs traduits : /es/arte/).
// Une langue absente = page inexistante dans cette langue (pas de `de` pour
// concours, famille, comparatifs, pricing).
const FIXED_ROUTES = [
  { fr: '/', en: '/en/', es: '/es/', de: '/de/' },
  { fr: '/art/', en: '/en/art/', es: '/es/arte/', de: '/de/kunst/' },
  { fr: '/histoire/', en: '/en/history/', es: '/es/historia/', de: '/de/geschichte/' },
  { fr: '/geographie/', en: '/en/geography/', es: '/es/geografia/', de: '/de/geografie/' },
  { fr: '/nature/', en: '/en/nature/', es: '/es/naturaleza/', de: '/de/natur/' },
  { fr: '/monuments/', en: '/en/monuments/', es: '/es/monumentos/', de: '/de/monumente/' },
  { fr: '/concours/', en: '/en/exams/', es: '/es/oposiciones/' },
  { fr: '/famille/', en: '/en/family/', es: '/es/familia/' },
  { fr: '/comparatifs/', en: '/en/comparisons/', es: '/es/comparativas/' },
  { fr: '/pricing/', en: '/en/pricing/', es: '/es/pricing/' },
  { fr: '/privacy/', en: '/en/privacy/', es: '/es/privacy/', de: '/de/privacy/' },
  { fr: '/terms/', en: '/en/terms/', es: '/es/terms/', de: '/de/terms/' },
  { fr: '/faq/', en: '/en/faq/', es: '/es/faq/', de: '/de/faq/' },
  { fr: '/quiz/', en: '/en/quiz/', es: '/es/quiz/', de: '/de/quiz/' },
  { fr: '/jouer/', en: '/en/play/', es: '/es/jugar/', de: '/de/spielen/' },
  { fr: '/blog/', en: '/en/blog/', es: '/es/blog/', de: '/de/blog/' },
  { fr: '/about/', en: '/en/about/', es: '/es/about/', de: '/de/about/' },
  { fr: '/credits/', en: '/en/credits/', es: '/es/credits/', de: '/de/credits/' },
  { fr: '/widget/', en: '/en/widget/', es: '/es/widget/', de: '/de/widget/' },
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

const blogPath = (lang, slug) => (lang === 'fr' ? `/blog/${slug}/` : `/${lang}/blog/${slug}/`);

// Scan des articles : alternates hreflang (par translationKey) + lastmod (par URL).
function buildBlogData() {
  const base = './src/content/blog';
  const byKey = {};
  const lastmodByUrl = {};
  // URLs canonicalisees vers une autre page : exclues du sitemap et des
  // grappes hreflang (voir le champ canonicalTo du frontmatter).
  const canonicalized = new Set();
  for (const lang of LANGS) {
    const dir = path.join(base, lang);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const fm = readFrontmatter(path.join(dir, file));
      if (!fm.urlSlug || !fm.translationKey) continue;
      const url = `${SITE}${blogPath(lang, fm.urlSlug)}`;
      if (fm.canonicalTo) {
        canonicalized.add(url);
        continue;
      }
      (byKey[fm.translationKey] ||= {})[lang] = fm.urlSlug;
      const raw = fm.lastModified || fm.date;
      if (raw) {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) lastmodByUrl[url] = d.toISOString();
      }
    }
  }
  return { byKey, lastmodByUrl, canonicalized };
}

const { byKey: BLOG_BY_KEY, lastmodByUrl: BLOG_LASTMOD, canonicalized: BLOG_CANONICALIZED } = buildBlogData();

// Map URL absolue -> liens alternates (hreflang des langues presentes + x-default).
// `paths` : { fr?, en?, es?, de? } -> chemin. Une grappe d'une seule page n'a
// pas d'alternate. x-default = francais, sinon la premiere langue presente
// (grappe amputee de sa version FR, canonicalisee ailleurs). Doit rester
// aligne sur BlogPost.astro et Layout.astro, qui appliquent la meme regle.
const ALTERNATES = new Map();
function registerAlternates(paths) {
  const present = LANGS.filter((l) => paths[l]);
  if (present.length < 2) return;
  const links = present.map((l) => ({ lang: l, url: `${SITE}${paths[l]}` }));
  links.push({ lang: 'x-default', url: `${SITE}${paths[present[0]]}` });
  for (const l of present) ALTERNATES.set(`${SITE}${paths[l]}`, links);
}
for (const r of FIXED_ROUTES) registerAlternates(r);
for (const slugs of Object.values(BLOG_BY_KEY)) {
  registerAlternates(Object.fromEntries(Object.entries(slugs).map(([l, slug]) => [l, blogPath(l, slug)])));
}

export default defineConfig({
  site: SITE,
  adapter: cloudflare(),
  vite: {
    define: {
      // `__DEV__` est un global React Native. Le cœur de jeu synchronisé s'en
      // sert pour des avertissements de données (data/historicalFigures.ts) ;
      // c'est le seul RN-isme du code copié.
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    },
    resolve: {
      alias: {
        // Miroir des paths tsconfig : le cœur de jeu synchronisé depuis l'app
        // mobile importe en `@/…`, le code web du jeu en `@game/…`.
        '@': path.resolve('./src/game/core'),
        '@game': path.resolve('./src/game'),
      },
    },
  },
  integrations: [react(), sitemap({
    customPages: [
      `${SITE}/credits/`,
      `${SITE}/en/credits/`,
      `${SITE}/es/credits/`,
      `${SITE}/de/credits/`,
    ],
    // Une page qui pointe son canonical ailleurs ne doit pas figurer au
    // sitemap : l'y laisser contredit le signal qu'on vient d'emettre.
    // /embed/* : pages nues servies en iframe chez des tiers, en noindex.
    filter: (page) => !BLOG_CANONICALIZED.has(page) && !page.includes('/embed/') && !page.endsWith('sapiro.app/app/'),
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
    locales: LANGS,
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
