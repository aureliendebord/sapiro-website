#!/usr/bin/env node
/**
 * Synchronise le cœur de jeu depuis le repo de l'app mobile (~/Projets/sapiro)
 * vers `src/game/core/` (+ les drapeaux SVG vers `public/flags/`).
 *
 * POURQUOI : le jeu web réécrit l'UI en React, mais doit servir EXACTEMENT les
 * mêmes questions, parcours et sources que l'app. La logique (`domain/`) et les
 * données (`data/`, `locales/`) sont donc copiées, jamais réécrites. La sortie
 * est commitée : la CI du site n'a pas accès au repo de l'app.
 *
 * Deux exceptions au copier-coller, générées depuis `scripts/templates/` :
 *  - `hooks/useEntityDescriptions.ts` : l'app importe 11 langues de JSON en
 *    statique (~13 Mo). Le web n'en sert que 3 (fr/en/es).
 *
 * Usage :
 *   node scripts/sync-game-core.mjs            # synchronise
 *   node scripts/sync-game-core.mjs --check    # échoue si le core a dérivé
 *   SAPIRO_APP_PATH=/chemin/vers/sapiro node scripts/sync-game-core.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

const CHECK_ONLY = process.argv.includes('--check');

const APP = process.env.SAPIRO_APP_PATH || path.join(os.homedir(), 'Projets/sapiro');
const SITE = path.resolve(import.meta.dirname, '..');
const CORE = path.join(SITE, 'src/game/core');
const FLAGS_OUT = path.join(SITE, 'public/flags');
const MANIFEST = path.join(CORE, '.sync-manifest.json');

const HEADER = `// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec \`npm run sync:game\`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
`;

/** Fichiers/dossiers copiés verbatim (chemin relatif identique des deux côtés). */
const COPY = [
  { from: 'domain', to: 'domain', ext: '.ts' },
  { from: 'data', to: 'data', ext: '.ts' },
  { from: 'types/index.ts', to: 'types/index.ts' },
  { from: 'config/cdn.ts', to: 'config/cdn.ts' },
  { from: 'utils/shuffle.ts', to: 'utils/shuffle.ts' },
  // Défi du jour : seed déterministe par date + thème du jour — indispensable
  // pour que le daily web soit LE MÊME quiz que sur mobile.
  { from: 'utils/dailyChallenge.ts', to: 'utils/dailyChallenge.ts' },
  { from: 'hooks/useLocalizedEntity.ts', to: 'hooks/useLocalizedEntity.ts' },
];

/** Locales : seulement les 3 langues du site, et seulement les JSON utiles. */
const LOCALE_LANGS = ['fr', 'en', 'es'];
const LOCALE_FILES = [
  'animals.json', 'artworks.json', 'countries.json', 'empires.json',
  'figures.json', 'game.json', 'monuments.json', 'organizations.json',
  'regions-fr.json', 'themes.json', 'common.json', 'levels.json',
];

/** Drapeaux SVG : import statique dans l'app, fichiers servis en web. */
const FLAG_DIRS = ['countries', 'empires', 'organizations', 'regions-fr'];

const written = [];
const drift = [];

function ensureDir(dir) {
  if (!CHECK_ONLY) fs.mkdirSync(dir, { recursive: true });
}

function writeOut(dest, content) {
  const rel = path.relative(SITE, dest);
  if (fs.existsSync(dest) && fs.readFileSync(dest, 'utf8') === content) {
    written.push(rel);
    return;
  }
  if (CHECK_ONLY) {
    drift.push(rel);
    return;
  }
  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, content);
  written.push(rel);
}

/** Copie un fichier TS en préfixant l'en-tête d'avertissement. */
function copyTs(src, dest) {
  writeOut(dest, HEADER + fs.readFileSync(src, 'utf8'));
}

function walkTs(dir, ext) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkTs(full, ext));
    else if (entry.name.endsWith(ext)) out.push(full);
  }
  return out;
}

function syncCode() {
  for (const item of COPY) {
    const src = path.join(APP, item.from);
    if (!fs.existsSync(src)) throw new Error(`Source introuvable : ${src}`);

    if (item.ext) {
      for (const file of walkTs(src, item.ext)) {
        const rel = path.relative(src, file);
        copyTs(file, path.join(CORE, item.to, rel));
      }
    } else {
      copyTs(src, path.join(CORE, item.to));
    }
  }
}

function syncLocales() {
  for (const lang of LOCALE_LANGS) {
    const dir = path.join(APP, 'locales', lang);
    if (!fs.existsSync(dir)) throw new Error(`Locale introuvable : ${dir}`);
    for (const file of LOCALE_FILES) {
      const src = path.join(dir, file);
      if (!fs.existsSync(src)) continue;
      // JSON : pas d'en-tête possible, on copie tel quel (minifié pour le poids).
      const json = JSON.parse(fs.readFileSync(src, 'utf8'));
      writeOut(path.join(CORE, 'locales', lang, file), JSON.stringify(json));
    }
  }
}

function syncFlags() {
  for (const dir of FLAG_DIRS) {
    const src = path.join(APP, 'assets/flags', dir);
    if (!fs.existsSync(src)) throw new Error(`Drapeaux introuvables : ${src}`);
    for (const file of fs.readdirSync(src)) {
      if (!file.endsWith('.svg')) continue;
      writeOut(path.join(FLAGS_OUT, dir, file), fs.readFileSync(path.join(src, file), 'utf8'));
    }
  }
}

/** Génère les adaptateurs web depuis `scripts/templates/`. */
function syncTemplates() {
  const dir = path.join(SITE, 'scripts/templates');
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.ts')) continue;
    // `useEntityDescriptions.web.ts` -> `hooks/useEntityDescriptions.ts`
    const target = file.replace(/\.web\.ts$/, '.ts');
    writeOut(path.join(CORE, 'hooks', target), HEADER + fs.readFileSync(path.join(dir, file), 'utf8'));
  }
}

function writeManifest() {
  const hash = crypto.createHash('sha256');
  for (const rel of written.sort()) {
    hash.update(rel);
    hash.update(fs.readFileSync(path.join(SITE, rel)));
  }
  const manifest = {
    generatedFrom: APP,
    files: written.length,
    sha256: hash.digest('hex'),
  };
  const content = JSON.stringify(manifest, null, 2) + '\n';
  if (!CHECK_ONLY) fs.writeFileSync(MANIFEST, content);
  return manifest;
}

try {
  syncCode();
  syncLocales();
  syncFlags();
  syncTemplates();

  if (CHECK_ONLY && drift.length) {
    console.error(`✗ Le cœur de jeu a dérivé (${drift.length} fichier(s)) :`);
    for (const f of drift.slice(0, 20)) console.error(`  - ${f}`);
    if (drift.length > 20) console.error(`  … et ${drift.length - 20} autres`);
    console.error('\nLancer : npm run sync:game');
    process.exit(1);
  }

  const manifest = writeManifest();
  console.log(`✓ Cœur de jeu ${CHECK_ONLY ? 'à jour' : 'synchronisé'} : ${manifest.files} fichiers`);
  console.log(`  source : ${APP}`);
} catch (err) {
  console.error(`✗ ${err.message}`);
  if (!fs.existsSync(APP)) {
    console.error(`\nLe repo de l'app est introuvable. Définir SAPIRO_APP_PATH si besoin.`);
    console.error(`La sortie synchronisée est commitée : ce script n'est nécessaire`);
    console.error(`que pour propager une évolution du jeu depuis l'app.`);
  }
  process.exit(1);
}
