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
 * UNE seule exception au copier-coller, générée depuis `scripts/templates/` :
 *  - `lib/content/locales.ts` : l'app importe 11 langues de JSON en statique
 *    (~13 Mo). Le web n'en sert que 3 (fr/en/es), chargées à la demande. Même
 *    API publique et surtout MÊME ordre de repli que l'app.
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
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const CHECK_ONLY = process.argv.includes('--check');

const APP = process.env.SAPIRO_APP_PATH || path.join(os.homedir(), 'Projets/sapiro');
const SITE = path.resolve(import.meta.dirname, '..');
const CORE = path.join(SITE, 'src/game/core');
const FLAGS_OUT = path.join(SITE, 'public/flags');
const MANIFEST = path.join(CORE, '.sync-manifest.json');
// Empreinte du Défi du jour issue de l'app (scripts/parity-daily.mjs) : posée
// dans core/ mais pas produite par cette passe — à ne pas traiter en orphelin.
const PARITY = path.join(CORE, '.daily-parity.json');

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
  { from: 'hooks/useEntityDescriptions.ts', to: 'hooks/useEntityDescriptions.ts' },
  // Contenu serveur — tous ces modules sont PURS côté app (aucun import React
  // Native, cf. `__tests__/domain/purity.test.ts`), donc copiés verbatim. Le
  // web n'a plus d'adaptateur à maintenir ici : `state.ts` est le point
  // d'injection, et `src/game/lib/loadContent.ts` (code web) y écrit ce que
  // `lib/content/store.ts` y écrit côté mobile depuis le disque.
  { from: 'lib/content/datasets.ts', to: 'lib/content/datasets.ts' },
  { from: 'lib/content/catalogSchema.ts', to: 'lib/content/catalogSchema.ts' },
  { from: 'lib/content/state.ts', to: 'lib/content/state.ts' },
  { from: 'lib/content/manifest.ts', to: 'lib/content/manifest.ts' },
  { from: 'lib/content/localize.ts', to: 'lib/content/localize.ts' },
  { from: 'lib/content/entities.ts', to: 'lib/content/entities.ts' },
  { from: 'lib/content/catalog.ts', to: 'lib/content/catalog.ts' },
  { from: 'lib/content/artworks.ts', to: 'lib/content/artworks.ts' },
];

/** Locales : seulement les 3 langues du site, et seulement les JSON utiles. */
const LOCALE_LANGS = ['fr', 'en', 'es'];
const LOCALE_FILES = [
  'animals.json', 'artworks.json', 'countries.json', 'empires.json',
  'figures.json', 'game.json', 'monuments.json', 'organizations.json',
  'regions-fr.json', 'themes.json', 'common.json', 'levels.json',
  'badges.json', 'profile.json',
];

/** Drapeaux SVG : import statique dans l'app, fichiers servis en web. */
const FLAG_DIRS = ['countries', 'empires', 'organizations', 'regions-fr'];

/**
 * Icônes illustrées : toute la DA de l'app en dépend (modes, thèmes, parcours,
 * badges, ligues). Servies en fichiers statiques depuis `public/`, jamais
 * bundlées — 123 fichiers, ~1,6 Mo. `_raw/` (sources PNG, 75 Mo) est ignoré.
 */
const ICONS_SRC = path.join(APP, 'assets/images/icons');
const ICONS_OUT = path.join(SITE, 'public/images/icons');

/**
 * Images hors du dossier icons/ : [chemin app, chemin sous public/, largeur max].
 * La mascotte est l'icône d'app en 1024² (1,1 Mo) pour un rendu à 84 px :
 * on la réduit, sinon chaque visiteur télécharge 1 Mo pour un pingouin.
 */
const EXTRA_IMAGES = [
  ['assets/images/paywall-hero.webp', 'images/game/paywall-hero.webp', null],
  ['assets/images/icon.png', 'images/game/penguin.png', 256],
];

/** Avatars du profil (43 fichiers, ~450 Ko). */
const AVATARS_SRC = path.join(APP, 'assets/images/avatars');
const AVATARS_OUT = path.join(SITE, 'public/images/avatars');

/** Sons du jeu (6 fichiers, ~220 Ko). */
const SOUNDS_SRC = path.join(APP, 'assets/sounds');
const SOUNDS_OUT = path.join(SITE, 'public/sounds');

/** Modules générés (table emoji→icône, index des drapeaux). */
const DESIGN_OUT = path.join(SITE, 'src/game/design');

const written = [];
const drift = [];

function ensureDir(dir) {
  if (!CHECK_ONLY) fs.mkdirSync(dir, { recursive: true });
}

/** Écrit un fichier texte OU binaire (icônes) en surveillant la dérive. */
function writeOut(dest, content) {
  const buf = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
  const rel = path.relative(SITE, dest);
  if (fs.existsSync(dest) && fs.readFileSync(dest).equals(buf)) {
    written.push(rel);
    return;
  }
  if (CHECK_ONLY) {
    drift.push(rel);
    // Le fichier a dérivé mais il EXISTE des deux côtés : le compter dans
    // `written`, sinon pruneOrphans le re-signalerait en « (orphelin) ».
    written.push(rel);
    return;
  }
  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, buf);
  written.push(rel);
}

/** Un asset supprimé côté app ne doit pas survivre côté site. */
function pruneStale(dir, keep, ext) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(ext) || keep.has(file)) continue;
    const full = path.join(dir, file);
    if (CHECK_ONLY) drift.push(`${path.relative(SITE, full)} (orphelin)`);
    else fs.unlinkSync(full);
  }
}

/**
 * Supprime de `core/` tout fichier que cette passe n'a pas (ré)écrit. Sans ça
 * un module retiré côté app — ou un adaptateur web devenu inutile — survit
 * indéfiniment et continue d'être importé : c'est exactement ce qui a laissé
 * traîner l'ancien shim `webContent.ts` après le passage à `state.ts`.
 */
function pruneOrphans() {
  const keep = new Set(written);
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        if (!CHECK_ONLY && fs.readdirSync(full).length === 0) fs.rmdirSync(full);
        continue;
      }
      const rel = path.relative(SITE, full);
      if (full === MANIFEST || full === PARITY || keep.has(rel)) continue;
      if (CHECK_ONLY) drift.push(`${rel} (orphelin)`);
      else fs.unlinkSync(full);
    }
  };
  walk(CORE);
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
  const index = [];
  for (const dir of FLAG_DIRS) {
    const src = path.join(APP, 'assets/flags', dir);
    if (!fs.existsSync(src)) throw new Error(`Drapeaux introuvables : ${src}`);
    for (const file of fs.readdirSync(src)) {
      if (!file.endsWith('.svg')) continue;
      writeOut(path.join(FLAGS_OUT, dir, file), fs.readFileSync(path.join(src, file), 'utf8'));
      index.push(`${dir}/${file.slice(0, -4)}`);
    }
  }

  // Équivalent web de `hasFlag()` de l'app : savoir si un drapeau existe AVANT
  // de tenter de l'afficher (le composant Icon retombe sur l'emoji sinon).
  writeOut(
    path.join(DESIGN_OUT, 'flags.generated.ts'),
    HEADER +
      `\n/** Drapeaux disponibles dans public/flags/ (chemin sans extension). */\n` +
      `export const FLAG_FILES: ReadonlySet<string> = new Set([\n` +
      index.sort().map((p) => `  ${JSON.stringify(p)},`).join('\n') +
      `\n]);\n`,
  );
}

/**
 * Réduit une image à `maxWidth` via `sips` (natif macOS). Ce script ne tourne
 * que sur une machine qui a le repo de l'app en local, donc la dépendance est
 * sans conséquence pour la CI. Sans `sips`, on copie l'original plutôt que
 * d'échouer — mieux vaut une image lourde qu'une synchro cassée.
 */
function resized(src, maxWidth) {
  const tmp = path.join(os.tmpdir(), `sapiro-sync-${path.basename(src)}`);
  try {
    execFileSync('sips', ['-Z', String(maxWidth), src, '--out', tmp], { stdio: 'ignore' });
    const buf = fs.readFileSync(tmp);
    fs.unlinkSync(tmp);
    return buf;
  } catch {
    console.warn(`  ! redimensionnement impossible (${path.basename(src)}), copie de l'original`);
    return fs.readFileSync(src);
  }
}

/** Illustrations, images de jeu, avatars et sons — servis depuis public/. */
function syncAssets() {
  if (!fs.existsSync(ICONS_SRC)) throw new Error(`Icônes introuvables : ${ICONS_SRC}`);

  const icons = fs.readdirSync(ICONS_SRC).filter((f) => f.endsWith('.webp'));
  for (const file of icons) {
    writeOut(path.join(ICONS_OUT, file), fs.readFileSync(path.join(ICONS_SRC, file)));
  }
  pruneStale(ICONS_OUT, new Set(icons), '.webp');

  for (const [from, to, maxWidth] of EXTRA_IMAGES) {
    const src = path.join(APP, from);
    if (!fs.existsSync(src)) throw new Error(`Image introuvable : ${src}`);
    writeOut(path.join(SITE, 'public', to), maxWidth ? resized(src, maxWidth) : fs.readFileSync(src));
  }

  for (const [src, out, ext] of [
    [AVATARS_SRC, AVATARS_OUT, '.webp'],
    [SOUNDS_SRC, SOUNDS_OUT, '.mp3'],
  ]) {
    if (!fs.existsSync(src)) continue;
    const files = fs.readdirSync(src).filter((f) => f.endsWith(ext));
    for (const file of files) {
      writeOut(path.join(out, file), fs.readFileSync(path.join(src, file)));
    }
    pruneStale(out, new Set(files), ext);
  }

  return new Set(icons.map((f) => f.slice(0, -5)));
}

/**
 * Table emoji → slug d'icône, générée depuis LA source de vérité de l'app
 * (`scripts/icons.manifest.mjs`, le même fichier qui génère `constants/icons.ts`).
 *
 * On ne porte pas `constants/icons.ts` : il contient des `require()` Metro,
 * inexploitables côté web. Le manifeste, lui, est du JS ESM pur.
 */
async function syncIconMap(availableSlugs) {
  const manifestPath = path.join(APP, 'scripts/icons.manifest.mjs');
  let ICON_MANIFEST;
  try {
    ({ ICON_MANIFEST } = await import(pathToFileURL(manifestPath).href));
  } catch (err) {
    throw new Error(
      `Le manifeste d'icônes de l'app n'est plus importable depuis Node ` +
        `(${manifestPath}) : ${err.message}`,
    );
  }

  const entries = ICON_MANIFEST.flatMap((entry) =>
    (Array.isArray(entry.emoji) ? entry.emoji : [entry.emoji]).map((emoji) => [emoji, entry.slug]),
  )
    // Un slug sans fichier .webp ferait un visuel manquant : on le laisse
    // retomber sur l'emoji natif plutôt que de casser l'affichage.
    .filter(([, slug]) => availableSlugs.has(slug))
    // Tri : sans lui, un réordonnancement amont ferait clignoter `--check`.
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

  writeOut(
    path.join(DESIGN_OUT, 'icons.generated.ts'),
    HEADER +
      `\n/** Emoji → slug. Fichier servi depuis /images/icons/<slug>.webp. */\n` +
      `export const EMOJI_TO_ICON: Record<string, string> = {\n` +
      entries.map(([e, s]) => `  ${JSON.stringify(e)}: ${JSON.stringify(s)},`).join('\n') +
      `\n};\n`,
  );
}

/** Génère les adaptateurs web depuis `scripts/templates/`. */
function syncTemplates() {
  // Dossier cible de chaque template dans core/ (par défaut : hooks/).
  const TEMPLATE_DIRS = {
    'locales.web.ts': 'lib/content',
  };
  const dir = path.join(SITE, 'scripts/templates');
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.ts')) continue;
    // `locales.web.ts` -> `lib/content/locales.ts`
    const target = file.replace(/\.web\.ts$/, '.ts');
    const sub = TEMPLATE_DIRS[file] ?? 'hooks';
    writeOut(path.join(CORE, sub, target), HEADER + fs.readFileSync(path.join(dir, file), 'utf8'));
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
  pruneOrphans();
  await syncIconMap(syncAssets());

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
