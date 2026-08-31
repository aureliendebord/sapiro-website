#!/usr/bin/env node
/**
 * Preuve que le site et l'app posent EXACTEMENT les mêmes questions.
 *
 * Le Défi du jour est déterministe : `getDailySeed(date)` dérive un seed de la
 * date, et tout le tirage (sélection des entités, distracteurs, ordre des
 * options) en découle. À contenu égal et moteur égal, l'app et le site
 * produisent donc le même quiz, dans le même ordre — c'est la seule
 * vérification qui teste la chaîne entière plutôt qu'un fichier copié.
 *
 * Deux usages :
 *   node scripts/parity-daily.mjs           # compare site ↔ app, écrit la référence
 *   node scripts/parity-daily.mjs --check   # compare le site à la référence commitée
 *
 * Le mode par défaut a besoin du repo de l'app (comme `sync:game`) et met à
 * jour `src/game/core/.daily-parity.json`. Le mode `--check` ne lit que le
 * site : c'est lui qui tourne en CI, où le repo de l'app est absent — il
 * échoue si le cœur du site ne reproduit plus l'empreinte issue de l'app.
 *
 * Empreinte calculée sur le SEED bundlé (pas de réseau) : elle bouge donc à
 * chaque `sync:game` qui touche au contenu ou au moteur. C'est voulu — la
 * relire est la façon de voir ce qu'un resync change pour les joueurs.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createServer } from 'vite';

const CHECK_ONLY = process.argv.includes('--check');

const SITE = path.resolve(import.meta.dirname, '..');
const APP = process.env.SAPIRO_APP_PATH || path.join(os.homedir(), 'Projets/sapiro');
const REFERENCE = path.join(SITE, 'src/game/core/.daily-parity.json');

/** Dates figées, réparties pour tomber sur des thèmes et familles différents. */
const DATES = ['2026-01-15', '2026-03-02', '2026-06-21', '2026-09-01', '2026-12-25'];
const LANGS = ['fr', 'en'];

/**
 * Date LOCALE à midi : `getDailySeed` lit la date avec getFullYear/getDate
 * (heure locale). Une date UTC basculerait d'un jour selon le fuseau du runner
 * et ferait diverger l'empreinte de la référence commitée.
 */
function localNoon(dateIso) {
  const [y, m, d] = dateIso.split('-').map(Number);
  return new Date(y, m - 1, d, 12);
}

/**
 * Un serveur vite par repo : c'est lui qui résout l'alias `@/`, compile le TS
 * et neutralise `__DEV__` (absent hors Metro — sans ça `data/historicalFigures`
 * plante à l'import).
 */
async function engineFor(root, coreDir) {
  const server = await createServer({
    root,
    configFile: false,
    logLevel: 'error',
    define: { __DEV__: 'false' },
    resolve: {
      alias: {
        '@': path.resolve(root, coreDir),
        '@game': path.resolve(root, 'src/game'),
      },
    },
  });
  const load = (rel) => server.ssrLoadModule(`/${path.posix.join(coreDir, rel)}`);

  const [daily, mixed, constants, locales] = await Promise.all([
    load('utils/dailyChallenge.ts'),
    load('domain/quiz/mixedQuestions.ts'),
    load('domain/quiz/constants.ts'),
    load('lib/content/locales.ts'),
  ]);

  // Côté site uniquement : la machine à états web. C'est ELLE qu'on certifie —
  // la parité doit exercer le code que les joueurs traversent, pas une copie.
  const quizSession =
    root === SITE ? await server.ssrLoadModule('/src/game/lib/quizSession.ts') : null;

  return { server, daily, mixed, constants, locales, quizSession };
}

/**
 * Rejoue le Défi du jour d'une date et en fait une empreinte textuelle.
 * Côté site, via `buildDailyPlaylist` (le chemin joueur réel) ; côté app, en
 * reconstruisant le daily mobile — toute divergence entre les deux échoue ici.
 */
async function fingerprint(engine, dateIso, lang) {
  // Le web charge ses locales à la demande ; l'app les a en statique.
  if (typeof engine.locales.preloadEntityLocales === 'function') {
    await engine.locales.preloadEntityLocales(lang);
  }

  const date = localNoon(dateIso);
  let questions;

  if (engine.quizSession) {
    // Site : le vrai chemin joueur (quizSession.buildDailyPlaylist).
    ({ questions } = engine.quizSession.buildDailyPlaylist(lang, date));
  } else {
    // App : reconstruction du défi MIXTE mobile (écran quiz, thème « Mixte »,
    // le défaut) — buildMixedQuestions seedé par la date, pays filtrés par
    // drapeau disponible comme le `prepareMixPool` de l'écran. Les drapeaux du
    // site étant synchronisés depuis l'app, FLAG_FILES est le même ensemble
    // que le `hasFlag` mobile.
    const prepare = (pool, type) =>
      type === 'country' ? pool.filter((e) => flagFiles.has(e.flagPath)) : pool;
    questions = engine.mixed.buildMixedQuestions(
      engine.constants.DAILY_CHALLENGE_QUESTIONS,
      engine.daily.getDailySeed(date),
      lang,
      prepare,
    );
  }

  if (questions.length !== engine.constants.DAILY_CHALLENGE_QUESTIONS) {
    throw new Error(`${dateIso}/${lang} : ${questions.length} questions générées`);
  }

  return [
    'theme=mix',
    ...questions.map(
      (q) => `${q.entity.id}|${q.type}|${q.correctAnswer}|${q.options.join('>')}`,
    ),
  ].join('\n');
}

async function fingerprintAll(engine) {
  const out = {};
  for (const dateIso of DATES) {
    for (const lang of LANGS) {
      out[`${dateIso}/${lang}`] = await fingerprint(engine, dateIso, lang);
    }
  }
  return out;
}

function diff(expected, actual) {
  const keys = [...new Set([...Object.keys(expected), ...Object.keys(actual)])].sort();
  return keys.filter((k) => expected[k] !== actual[k]);
}

const site = await engineFor(SITE, 'src/game/core');
const { FLAG_FILES: flagFiles } = await site.server.ssrLoadModule('/src/game/design/flags.generated.ts');
let failed = false;

try {
  const siteFp = await fingerprintAll(site);

  if (CHECK_ONLY) {
    if (!fs.existsSync(REFERENCE)) {
      throw new Error(
        `Référence absente (${path.relative(SITE, REFERENCE)}). ` +
          `Lancer : npm run parity:game`,
      );
    }
    const expected = JSON.parse(fs.readFileSync(REFERENCE, 'utf8')).fingerprints;
    const changed = diff(expected, siteFp);
    if (changed.length) {
      console.error(`✗ Le Défi du jour du site ne correspond plus à l'app :`);
      for (const key of changed) console.error(`  - ${key}`);
      console.error(`\nSi le contenu ou le moteur a bougé volontairement :`);
      console.error(`  npm run sync:game && npm run parity:game`);
      failed = true;
    } else {
      console.log(`✓ Défi du jour identique à l'app sur ${Object.keys(siteFp).length} empreintes`);
    }
  } else {
    if (!fs.existsSync(APP)) {
      throw new Error(
        `Repo de l'app introuvable (${APP}). Définir SAPIRO_APP_PATH, ` +
          `ou lancer en --check pour comparer à la référence commitée.`,
      );
    }
    const app = await engineFor(APP, '.');
    try {
      const appFp = await fingerprintAll(app);
      const changed = diff(appFp, siteFp);
      if (changed.length) {
        console.error(`✗ Le site et l'app posent des questions différentes :`);
        for (const key of changed) {
          console.error(`\n— ${key}`);
          const a = appFp[key].split('\n');
          const s = siteFp[key].split('\n');
          for (let i = 0; i < Math.max(a.length, s.length); i++) {
            if (a[i] !== s[i]) console.error(`  app  : ${a[i]}\n  site : ${s[i]}`);
          }
        }
        console.error(`\nUn resync est probablement en retard : npm run sync:game`);
        failed = true;
      } else {
        fs.writeFileSync(
          REFERENCE,
          JSON.stringify({ dates: DATES, langs: LANGS, fingerprints: appFp }, null, 2) + '\n',
        );
        console.log(
          `✓ Site et app identiques sur ${Object.keys(appFp).length} défis ` +
            `(${DATES.length} dates × ${LANGS.length} langues)`,
        );
        console.log(`  référence écrite : ${path.relative(SITE, REFERENCE)}`);
      }
    } finally {
      await app.server.close();
    }
  }
} catch (err) {
  console.error(`✗ ${err.message}`);
  failed = true;
} finally {
  await site.server.close();
}

process.exit(failed ? 1 : 0);
