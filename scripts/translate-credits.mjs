// Traduit /credits/index.html (FR, genere par le repo sapiro/app) vers EN et ES.
// A relancer apres chaque mise a jour du fichier source FR :
//   node scripts/translate-credits.mjs
//
// Strategie : on traduit uniquement le "chrome" (titre, intro, footer, labels
// repetitifs). Les noms des 1883 entites (animaux, oeuvres, monuments,
// drapeaux) restent en FR car ils viennent du dataset Wikimedia de l'app.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, '..', 'public');
const SRC = resolve(PUBLIC_DIR, 'credits', 'index.html');

const translations = {
  en: {
    htmlLang: 'en',
    title: 'Sapiro — Image credits',
    metaDescription:
      'Detailed credits and licenses for the images used in the Sapiro app. All images come from Wikimedia Commons and are credited individually.',
    ogDescription:
      'Full attribution for the Wikimedia Commons images used in the Sapiro app.',
    ogUrl: 'https://sapiro.app/en/credits/',
    h1: 'Image credits',
    lede: `All images used in Sapiro come from <strong>Wikimedia Commons</strong>
        and are released under free licenses (CC-BY, CC-BY-SA, or public domain).
        Each image is credited individually below, with its author, license,
        and a link to the original Wikimedia page.`,
    metaCount: (n, date) => `${n} credited images · Last updated: ${date}`,
    tocHeading: 'Categories',
    sections: {
      animaux: { id: 'animals', label: 'Animals' },
      '-uvres-d-art': { id: 'artworks', label: 'Artworks' },
      monuments: { id: 'monuments', label: 'Monuments' },
      drapeaux: { id: 'flags', label: 'Flags' },
    },
    sectionTitleFallback: {
      Animaux: 'Animals',
      "Œuvres d'art": 'Artworks',
      'Œuvres d&#39;art': 'Artworks',
      Monuments: 'Monuments',
      Drapeaux: 'Flags',
    },
    unknownAuthor: 'Unknown author',
    undocumentedLicense: 'Undocumented license',
    footerClaim:
      "Have a concern about an image? Contact us at <a href=\"mailto:bonjour@agencedebord.com\">bonjour@agencedebord.com</a>.",
    privacyLabel: 'Privacy',
    termsLabel: 'Terms',
    privacyHref: 'https://sapiro.app/en/privacy/',
    termsHref: 'https://sapiro.app/en/terms/',
  },
  es: {
    htmlLang: 'es',
    title: 'Sapiro — Créditos de imágenes',
    metaDescription:
      'Créditos y licencias detallados de las imágenes utilizadas en la app Sapiro. Todas las imágenes provienen de Wikimedia Commons y están acreditadas individualmente.',
    ogDescription:
      'Atribución completa de las imágenes de Wikimedia Commons utilizadas en la app Sapiro.',
    ogUrl: 'https://sapiro.app/es/credits/',
    h1: 'Créditos de imágenes',
    lede: `Todas las imágenes utilizadas en Sapiro provienen de <strong>Wikimedia Commons</strong>
        y se publican bajo licencias libres (CC-BY, CC-BY-SA o dominio público).
        Cada imagen está acreditada individualmente a continuación, con su autor,
        su licencia y un enlace a la página original de Wikimedia.`,
    metaCount: (n, date) => `${n} imágenes acreditadas · Última actualización: ${date}`,
    tocHeading: 'Categorías',
    sections: {
      animaux: { id: 'animales', label: 'Animales' },
      '-uvres-d-art': { id: 'obras-de-arte', label: 'Obras de arte' },
      monuments: { id: 'monumentos', label: 'Monumentos' },
      drapeaux: { id: 'banderas', label: 'Banderas' },
    },
    sectionTitleFallback: {
      Animaux: 'Animales',
      "Œuvres d'art": 'Obras de arte',
      'Œuvres d&#39;art': 'Obras de arte',
      Monuments: 'Monumentos',
      Drapeaux: 'Banderas',
    },
    unknownAuthor: 'Autor desconocido',
    undocumentedLicense: 'Licencia no documentada',
    footerClaim:
      "¿Tienes un reclamo sobre una imagen? Contáctanos en <a href=\"mailto:bonjour@agencedebord.com\">bonjour@agencedebord.com</a>.",
    privacyLabel: 'Privacidad',
    termsLabel: 'Términos',
    privacyHref: 'https://sapiro.app/es/privacy/',
    termsHref: 'https://sapiro.app/es/terms/',
  },
};

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function translate(src, t) {
  let out = src;

  // <html lang="fr"> -> <html lang="en"|"es">
  out = out.replace(/<html lang="fr">/, `<html lang="${t.htmlLang}">`);

  // <title>
  out = out.replace(
    /<title>Sapiro — Crédits des images<\/title>/,
    `<title>${t.title}</title>`
  );

  // meta description
  out = out.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${t.metaDescription}">`
  );

  // og:title
  out = out.replace(
    /<meta property="og:title" content="Sapiro — Crédits des images">/,
    `<meta property="og:title" content="${t.title}">`
  );

  // og:description
  out = out.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${t.ogDescription}">`
  );

  // og:url
  out = out.replace(
    /<meta property="og:url" content="https:\/\/sapiro\.app\/credits\/">/,
    `<meta property="og:url" content="${t.ogUrl}">`
  );

  // h1
  out = out.replace(
    /<h1>Crédits des images<\/h1>/,
    `<h1>${t.h1}</h1>`
  );

  // lede paragraph (multi-line)
  out = out.replace(
    /<p class="lede">[\s\S]*?<\/p>/,
    `<p class="lede">\n        ${t.lede}\n      </p>`
  );

  // meta count + date
  out = out.replace(
    /<p class="meta">\s*(\d+) images créditées · Dernière mise à jour : ([\d-]+)\s*<\/p>/,
    (_, n, date) => `<p class="meta">\n        ${t.metaCount(n, date)}\n      </p>`
  );

  // TOC heading
  out = out.replace(/<h3>Catégories<\/h3>/, `<h3>${t.tocHeading}</h3>`);

  // TOC items + section anchors + h2 titles
  // The TOC items look like: <a href="#animaux">Animaux<span class="toc-count">N</span></a>
  // Section anchors:         <section class="section" id="animaux">
  //                          <h2>Animaux <span class="count">(N)</span></h2>
  for (const [frId, { id, label }] of Object.entries(t.sections)) {
    const frIdRe = escapeRegex(frId);
    // TOC <a href="#frId">FrLabel<span...>N</span></a>
    out = out.replace(
      new RegExp(`<a href="#${frIdRe}">([^<]+)<span class="toc-count">(\\d+)</span></a>`, 'g'),
      `<a href="#${id}">${label}<span class="toc-count">$2</span></a>`
    );
    // <section ... id="frId">
    out = out.replace(
      new RegExp(`<section class="section" id="${frIdRe}">`, 'g'),
      `<section class="section" id="${id}">`
    );
  }

  // h2 titles (independent of id)
  for (const [frLabel, enLabel] of Object.entries(t.sectionTitleFallback)) {
    const re = new RegExp(
      `<h2>${escapeRegex(frLabel)} <span class="count">\\((\\d+)\\)</span></h2>`,
      'g'
    );
    out = out.replace(re, `<h2>${enLabel} <span class="count">($1)</span></h2>`);
  }

  // Repeated labels
  out = out.replaceAll('Auteur inconnu', t.unknownAuthor);
  out = out.replaceAll('Licence non documentée', t.undocumentedLicense);

  // Footer claim paragraph
  out = out.replace(
    /<p>\s*Une image fait l'objet d'une réclamation \?\s*Contactez-nous à <a href="mailto:bonjour@agencedebord\.com">bonjour@agencedebord\.com<\/a>\.\s*<\/p>/,
    `<p>\n        ${t.footerClaim}\n      </p>`
  );

  // Footer links: Confidentialité / Conditions
  out = out.replace(
    /<a href="https:\/\/sapiro\.app\/privacy\/">Confidentialité<\/a>/,
    `<a href="${t.privacyHref}">${t.privacyLabel}</a>`
  );
  out = out.replace(
    /<a href="https:\/\/sapiro\.app\/terms\/">Conditions<\/a>/,
    `<a href="${t.termsHref}">${t.termsLabel}</a>`
  );

  return out;
}

function ensureDir(p) {
  mkdirSync(dirname(p), { recursive: true });
}

function main() {
  const src = readFileSync(SRC, 'utf8');
  console.log(`[translate-credits] source: ${SRC} (${src.length} chars)`);

  for (const lang of Object.keys(translations)) {
    const t = translations[lang];
    const out = translate(src, t);
    const dest = resolve(PUBLIC_DIR, lang, 'credits', 'index.html');
    ensureDir(dest);
    writeFileSync(dest, out, 'utf8');
    console.log(`[translate-credits] wrote ${lang}: ${dest} (${out.length} chars)`);

    // Sanity: count credit cards
    const matches = out.match(/class="credit-title"/g) || [];
    console.log(`[translate-credits]   credit cards: ${matches.length}`);
  }
}

main();
