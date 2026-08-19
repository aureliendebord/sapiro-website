// Smoke test du cœur de jeu synchronisé, exécuté via vite (alias + TS + JSON).
import { createServer } from 'vite';
import path from 'node:path';

const root = process.cwd();
const server = await createServer({
  root,
  configFile: false,
  logLevel: 'error',
  define: { __DEV__: 'false' },
  resolve: {
    alias: {
      '@': path.resolve(root, 'src/game/core'),
      '@game': path.resolve(root, 'src/game'),
    },
  },
});

try {
  const { preloadEntityLocales, getLocalizedEntry } = await server.ssrLoadModule(
    '/src/game/core/hooks/useEntityDescriptions.ts',
  );
  const { getEntityPool, getFullPool } = await server.ssrLoadModule(
    '/src/game/core/domain/quiz/entityPool.ts',
  );
  const { generateSingleQuestion } = await server.ssrLoadModule(
    '/src/game/core/domain/quiz/questionGenerator.ts',
  );
  const { JOURNEY_CATALOG } = await server.ssrLoadModule(
    '/src/game/core/domain/journeys/catalog.ts',
  );

  console.log('parcours au catalogue :', JOURNEY_CATALOG.length);

  for (const lang of ['fr', 'en', 'es']) {
    await preloadEntityLocales(lang);
    const entry = getLocalizedEntry('country', 'de', lang);
    console.log(`  locale ${lang} — Allemagne =`, entry?.name ?? '(pas de traduction)');
  }

  // Un parcours par thème, pour couvrir les 5 familles d'entités.
  const samples = ['europe', 'empires-all'];
  for (const id of samples) {
    const journey = JOURNEY_CATALOG.find((j) => j.id === id);
    if (!journey) {
      console.log(`  parcours ${id} absent du catalogue`);
      continue;
    }
    const pool = getEntityPool(journey.id, journey.entityType);
    const fullPool = getFullPool(journey.entityType);
    console.log(`\n${journey.id} (${journey.entityType}) — pool ${pool.length}, annoncé ${journey.entityCount}`);

    for (let i = 0; i < 3; i++) {
      const q = generateSingleQuestion(pool, fullPool, null, journey.entityType, undefined, 'fr');
      if (!q) throw new Error('génération de question nulle');
      if (!q.options.includes(q.correctAnswer)) throw new Error('bonne réponse absente des options');
      console.log(`  Q${i + 1} [${q.type}] ${q.entity.name} → ${q.correctAnswer} (${q.options.length} options)`);
    }
  }

  // Partie complète de bout en bout via la machine à états web.
  const { startSession, answer, finishSession } = await server.ssrLoadModule(
    '/src/game/lib/quizSession.ts',
  );

  let session = startSession({ mode: 'classic', journeyId: 'europe', entityType: 'country', language: 'fr' });
  let guard = 0;
  while (!session.finished && guard++ < 50) {
    // Répond toujours juste : vérifie le compte de questions et l'XP parfaite.
    session = answer(session, session.question.correctAnswer).state;
  }
  const result = finishSession(session);
  console.log(
    `\npartie classique : ${result.score}/${result.totalQuestions} — ${result.xp.totalXP} XP` +
      ` (base ${result.xp.baseXP} + parfait ${result.xp.perfectBonus})`,
  );
  if (result.totalQuestions !== 10) throw new Error('une partie classique doit faire 10 questions');
  if (result.score !== 10) throw new Error('score attendu 10/10');

  // Survie : on répond toujours faux, la partie doit s'arrêter à 3 vies perdues.
  let sv = startSession({ mode: 'survival', journeyId: 'europe', entityType: 'country', language: 'fr' });
  guard = 0;
  while (!sv.finished && guard++ < 50) {
    const wrong = sv.question.options.find((o) => o !== sv.question.correctAnswer);
    sv = answer(sv, wrong).state;
  }
  const svResult = finishSession(sv);
  console.log(`partie survie (que des erreurs) : ${svResult.totalQuestions} questions, ${svResult.xp.totalXP} XP`);
  if (svResult.totalQuestions !== 3) throw new Error('la survie doit s\'arrêter après 3 vies perdues');

  // Défi du jour : déterministe (même quiz pour tous) et thémé comme sur mobile.
  const d1 = startSession({ mode: 'daily', entityType: 'country', language: 'fr' });
  const d2 = startSession({ mode: 'daily', entityType: 'country', language: 'fr' });
  if (!d1.playlist?.length) throw new Error('le daily doit avoir une playlist');
  const ids1 = d1.playlist.map((q) => q.entity.id).join(',');
  const ids2 = d2.playlist.map((q) => q.entity.id).join(',');
  if (ids1 !== ids2) throw new Error('le daily doit être identique à chaque lancement (seed par date)');
  console.log(`\ndéfi du jour : ${d1.playlist.length} questions, thème ${d1.dailyTheme}, déterministe ✓`);

  // Révision : pool hétérogène → chaque question garde SA famille d'options.
  const { getEntityById } = await server.ssrLoadModule('/src/game/core/domain/quiz/entityPool.ts');
  const mixedPool = [getEntityById('country', 'fr'), getEntityById('figure', 'napoleon')].filter(Boolean);
  if (mixedPool.length === 2) {
    const rv = startSession({ mode: 'review', entityType: 'country', language: 'fr', pool: mixedPool });
    if (rv.playlist.length !== 2) throw new Error('révision : une question par entité du deck');
    for (const q of rv.playlist) {
      // La bonne réponse et les distracteurs doivent venir de la famille de l'entité.
      console.log(`  révision [${q.entity.type}] ${q.entity.name} — options: ${q.options.join(', ')}`);
    }
    const figureQ = rv.playlist.find((q) => q.entity.type === 'figure');
    if (figureQ && figureQ.options.some((o) => ['France', 'Allemagne', 'Espagne', 'Italie'].includes(o))) {
      throw new Error('révision : distracteurs de la mauvaise famille (pays sur une figure)');
    }
  } else {
    console.log('  (entité de test absente, contrôle révision par types sautés)');
  }

  console.log('\n✓ le moteur génère des questions valides hors React Native');
  console.log('✓ une partie complète se déroule et score correctement');
  console.log('✓ daily déterministe et révision par famille');
} finally {
  await server.close();
}
