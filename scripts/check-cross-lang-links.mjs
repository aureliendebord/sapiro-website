#!/usr/bin/env node
// Vérifie que les articles markdown EN/ES ne contiennent pas de liens internes
// pointant vers des slugs FR sous /en/blog/ ou /es/blog/.
//
// Le moindre lien zombie crée une URL servie en 200 OK qui ressemble à du
// duplicate content pour Googlebot. Voir commit 687c25e pour le contexte.
//
// Usage : node scripts/check-cross-lang-links.mjs
// Sortie : code 0 si propre, 1 si liens cassés trouvés.

import { readdir, readFile } from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'blog');
const LANGS = ['fr', 'en', 'es'];

async function listSlugs(lang) {
  const files = await readdir(join(ROOT, lang));
  return new Set(files.filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')));
}

async function main() {
  const slugs = {};
  for (const lang of LANGS) slugs[lang] = await listSlugs(lang);

  const issues = [];

  for (const lang of ['en', 'es']) {
    const dir = join(ROOT, lang);
    const files = await readdir(dir);
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const path = join(dir, file);
      const content = await readFile(path, 'utf8');

      const re = new RegExp(`\\(/${lang}/blog/([a-z0-9-]+)/?\\)`, 'g');
      for (const match of content.matchAll(re)) {
        const slug = match[1];
        if (!slugs[lang].has(slug)) {
          issues.push({ file: `${lang}/${file}`, brokenLink: `/${lang}/blog/${slug}`, slug });
        }
      }
    }
  }

  if (issues.length === 0) {
    console.log('check-cross-lang-links: OK (no broken cross-lang links)');
    process.exit(0);
  }

  console.error(`check-cross-lang-links: FAIL — ${issues.length} broken links\n`);
  for (const i of issues) {
    console.error(`  ${i.file} -> ${i.brokenLink}`);
  }
  console.error(
    '\nFix: replace each FR slug with the matching EN/ES slug in the markdown.\n' +
      'Use the translationKey frontmatter to find the right target.\n',
  );
  process.exit(1);
}

main().catch((err) => {
  console.error('check-cross-lang-links: unexpected error');
  console.error(err);
  process.exit(2);
});
