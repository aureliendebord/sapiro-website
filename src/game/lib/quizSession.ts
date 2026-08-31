/**
 * Machine à états d'une partie — orchestre le cœur synchronisé pour le web.
 *
 * Toute la génération de questions et le calcul d'XP viennent de `@/domain`,
 * donc d'exactement le même code que l'app : mêmes questions, mêmes options,
 * mêmes bonus. Ce module ne fait qu'enchaîner les questions et tenir le score.
 *
 * Deux familles de parties :
 * - classic/survival : questions générées à la volée depuis le pool du parcours.
 * - daily/review : playlist construite d'avance, comme sur mobile —
 *   le Défi du jour est seedé par la date (même quiz pour tout le monde,
 *   même thème que l'app), la révision rejoue chaque entité ratée avec les
 *   distracteurs de SA famille (`buildReviewQuestions`).
 */
import type { AnyFlagEntity, DailyChallengeTheme, EntityType, ReviewItem } from "@/types";
import {
  generateQuestions,
  generateSingleQuestion,
  type QuizQuestion,
} from "@/domain/quiz/questionGenerator";
import {
  getDailyChallengePool,
  getEntityPool,
  getFullPool,
} from "@/domain/quiz/entityPool";
import { buildReviewQuestions } from "@/domain/quiz/reviewQuestions";
import { buildMixedQuestions } from "@/domain/quiz/mixedQuestions";
import { calculateXP, type XPBreakdown } from "@/domain/quiz/scoring";
import {
  CLASSIC_QUESTION_COUNT,
  DAILY_CHALLENGE_QUESTIONS,
  OPTIONS_COUNT,
  SURVIVAL_LIVES,
} from "@/domain/quiz/constants";
import { getJourneyById } from "@/domain/journeys/catalog";
import {
  MIXED_QUESTIONS,
  isMixedBlockId,
  questionsFor,
  stageOfMixedBlock,
} from "@/domain/journeys/path";
import { makeStageMixPool } from "@/domain/journeys/stageMixPool";
import { getDailySeed, getDailyTheme } from "@/utils/dailyChallenge";

export type QuizMode = "classic" | "survival" | "daily" | "review";

/**
 * Question ratée, avec le TYPE de question raté — la révision doit reposer la
 * même question (une capitale ratée revient en capitale, pas en « quel
 * pays ? »), comme le deck de l'app (`ReviewItem.type`, clé `${id}:${type}`).
 */
export interface MissedQuestion {
  entity: AnyFlagEntity;
  questionType: "name" | "secondary";
}

export interface SessionConfig {
  mode: QuizMode;
  journeyId?: string;
  entityType: EntityType;
  language: string;
  /** Deck imposé (mode révision) : entités ratées AVEC leur type de question. */
  reviewItems?: MissedQuestion[];
  /**
   * Bloc du sentier Aventure joué, si c'en est un. Le nombre de questions et
   * la nature mixte du bloc en sont DÉRIVÉS (questionsFor, isMixedBlockId) :
   * un seul champ, aucune combinaison contradictoire possible.
   */
  pathBlockId?: string;
}

export interface SessionState {
  config: SessionConfig;
  question: QuizQuestion | null;
  questionIndex: number;
  /** `null` en survie : le nombre de questions n'est pas borné. */
  totalQuestions: number | null;
  /** Questions pré-construites (daily, révision) ; `null` = génération à la volée. */
  playlist: QuizQuestion[] | null;
  /** Catégorie du thème du jour (colonne `theme` de game_results). */
  dailyTheme: string | null;
  score: number;
  lives: number;
  /** Vrai/faux par question déjà répondue — alimente la barre segmentée. */
  answers: boolean[];
  misses: MissedQuestion[];
  startedAt: number;
  finished: boolean;
  /** Vrai si le pool de survie a été entièrement épuisé. */
  survivalComplete: boolean;
  /**
   * File de repasse (blocs thématiques du sentier) : les questions ratées
   * sont re-servies après la dernière, jusqu'à réussite. C'est cette
   * mécanique qui JUSTIFIE que blockCleared valide toujours un bloc
   * thématique — l'importer sans elle laissait un 0/10 « réussir ».
   * NOTE : réimplémentation web de la mécanique de app/quiz/[mode].tsx
   * (enfermée dans l'écran RN) ; l'extraction domain/quiz/retryQueue reste
   * la cible pour n'avoir qu'une implémentation.
   */
  retryQueue: RetryEntry[];
  /** Vrai pendant la phase de repasse (le score ne bouge plus). */
  retrying: boolean;
}

/**
 * Entrée de la file de repasse : la question et le nombre de mauvaises options
 * grisées. 1re erreur → 1 option grisée ; erreur en repasse → 2 (plafond),
 * comme l'app (`app/quiz/[mode].tsx`, commit 3814bee) : on resserre le choix
 * pour faciliter l'apprentissage, sans jamais donner la réponse.
 */
export interface RetryEntry {
  q: QuizQuestion;
  grays: number;
}

/**
 * Options grisées de la question de repasse courante : toujours les MÊMES
 * mauvaises options (ordre figé des options), la 2e s'ajoute à la 1re.
 */
export function grayedOptions(state: SessionState): Set<string> {
  const entry = state.retrying ? state.retryQueue[0] : undefined;
  if (!entry) return new Set();
  return new Set(
    entry.q.options.filter((o) => o !== entry.q.correctAnswer).slice(0, entry.grays),
  );
}

function resolvePool(config: SessionConfig): { pool: AnyFlagEntity[]; fullPool: AnyFlagEntity[] } {
  const fullPool = getFullPool(config.entityType);
  const pool = getEntityPool(config.journeyId, config.entityType);
  return { pool, fullPool };
}

/**
 * Défi du jour : même thème, même seed et même générateur que l'app
 * (`app/quiz/[mode].tsx`) — tous les joueurs, web comme mobile, jouent le
 * même quiz ce jour-là.
 */
export function buildDailyPlaylist(
  language: string,
  // Exporté et paramétré par la date pour `scripts/parity-daily.mjs` : la
  // parité doit exercer CE code (thème, seed, choix name/secondary), pas une
  // copie qui resterait verte quand ce fichier évolue.
  date: Date = new Date(),
): {
  questions: QuizQuestion[];
  theme: DailyChallengeTheme;
} {
  const theme = getDailyTheme(date);
  const seed = getDailySeed(date);
  const pool = getDailyChallengePool(theme);

  const isSecondary =
    theme.questionType === "capital" ||
    theme.questionType === "artwork_name" ||
    theme.questionType === "figure_birth_country" ||
    theme.questionType === "figure_nationality";
  const secondaryField =
    theme.questionType === "figure_birth_country" ? "birthCountry" : "nationality";

  const questions = generateQuestions(
    pool,
    DAILY_CHALLENGE_QUESTIONS,
    OPTIONS_COUNT,
    seed,
    isSecondary ? "secondary" : "name",
    getFullPool(theme.entityType),
    language,
    secondaryField,
  );

  return { questions, theme };
}

/**
 * Révision : une question par entité ratée, avec les distracteurs de la
 * famille de CETTE entité (le deck est hétérogène). Réutilise le builder
 * de l'app tel quel.
 */
function buildReviewPlaylist(deck: MissedQuestion[], language: string): QuizQuestion[] {
  const items: ReviewItem[] = deck.map(({ entity, questionType }) => ({
    entityId: entity.id,
    entityType: entity.type,
    // Le type raté est conservé : une capitale ratée revient en capitale.
    type: questionType,
  })) as ReviewItem[];

  return buildReviewQuestions(items, language).slice(0, CLASSIC_QUESTION_COUNT);
}

export function startSession(config: SessionConfig): SessionState {
  let playlist: QuizQuestion[] | null = null;
  let dailyTheme: string | null = null;

  if (config.mode === "daily") {
    const daily = buildDailyPlaylist(config.language);
    playlist = daily.questions;
    dailyTheme = daily.theme.themeCategory;
  } else if (config.mode === "review") {
    playlist = buildReviewPlaylist(config.reviewItems ?? [], config.language);
  } else if (config.pathBlockId && isMixedBlockId(config.pathBlockId)) {
    // Grand mélange de fin d'étape : une RÉVISION des 5 parcours de l'étape,
    // pas un tirage dans tout le catalogue — même restriction que l'app
    // (makeStageMixPool, partagé via domain/).
    playlist = buildMixedQuestions(
      MIXED_QUESTIONS,
      undefined,
      config.language,
      makeStageMixPool(stageOfMixedBlock(config.pathBlockId)),
    );
  }

  let question: QuizQuestion | null;
  let totalQuestions: number | null;

  if (playlist) {
    question = playlist[0] ?? null;
    totalQuestions = playlist.length;
  } else {
    const { pool, fullPool } = resolvePool(config);
    question = generateSingleQuestion(
      pool,
      fullPool,
      null,
      config.entityType,
      undefined,
      config.language,
    );
    totalQuestions =
      config.mode === "survival"
        ? null
        : config.pathBlockId
          ? questionsFor(config.pathBlockId)
          : CLASSIC_QUESTION_COUNT;
  }

  return {
    config,
    question,
    questionIndex: 0,
    totalQuestions,
    playlist,
    dailyTheme,
    score: 0,
    lives: config.mode === "survival" ? SURVIVAL_LIVES : Infinity,
    answers: [],
    misses: [],
    startedAt: Date.now(),
    finished: question === null,
    survivalComplete: false,
    retryQueue: [],
    retrying: false,
  };
}

/** La repasse ne concerne que les blocs THÉMATIQUES du sentier. */
function hasRetry(config: SessionConfig): boolean {
  return Boolean(config.pathBlockId && !isMixedBlockId(config.pathBlockId));
}

export interface AnswerOutcome {
  state: SessionState;
  correct: boolean;
}

/** Enregistre une réponse et prépare la question suivante si la partie continue. */
export function answer(state: SessionState, choice: string): AnswerOutcome {
  if (state.finished || !state.question) return { state, correct: false };

  const correct = choice === state.question.correctAnswer;
  const miss: MissedQuestion = {
    entity: state.question.entity,
    questionType: state.question.type,
  };

  const score = state.score + (correct ? 1 : 0);
  const lives = correct ? state.lives : state.lives - 1;
  const answers = [...state.answers, correct];
  const misses = correct ? state.misses : [...state.misses, miss];
  const questionIndex = state.questionIndex + 1;

  // Phase de repasse : les ratés reviennent jusqu'à réussite. Le score, la
  // barre ET le deck de révision sont figés (première passe seulement) — on
  // apprend, on ne re-note pas (même règle que l'app : pas de double comptage).
  // Une erreur en repasse grise une 2e mauvaise option (plafond), comme l'app.
  if (state.retrying) {
    const current = state.retryQueue[0];
    const retryQueue = correct
      ? state.retryQueue.slice(1)
      : [...state.retryQueue.slice(1), { q: current.q, grays: Math.min(current.grays + 1, 2) }];
    return {
      state: {
        ...state,
        retryQueue,
        question: retryQueue[0]?.q ?? null,
        finished: retryQueue.length === 0,
      },
      correct,
    };
  }

  const retryQueue = !correct && hasRetry(state.config)
    ? [...state.retryQueue, { q: state.question, grays: 1 }]
    : state.retryQueue;

  const outOfLives = lives <= 0;
  const reachedEnd =
    state.totalQuestions !== null && questionIndex >= state.totalQuestions;

  if (outOfLives || reachedEnd) {
    // Fin de la première passe d'un bloc thématique avec des erreurs : la
    // repasse démarre au lieu de terminer la partie.
    if (reachedEnd && retryQueue.length > 0) {
      return {
        state: {
          ...state,
          score,
          lives,
          answers,
          misses,
          questionIndex,
          retryQueue,
          retrying: true,
          question: retryQueue[0].q,
        },
        correct,
      };
    }
    return {
      state: {
        ...state,
        score,
        lives,
        answers,
        misses,
        questionIndex,
        retryQueue,
        question: null,
        finished: true,
      },
      correct,
    };
  }

  // Playlist (daily, révision, mixte) : la question suivante est déjà construite.
  if (state.playlist) {
    const next = state.playlist[questionIndex] ?? null;
    return {
      state: {
        ...state,
        score,
        lives,
        answers,
        misses,
        questionIndex,
        retryQueue,
        question: next,
        finished: next === null,
      },
      correct,
    };
  }

  const { pool, fullPool } = resolvePool(state.config);
  const next = generateSingleQuestion(
    pool,
    fullPool,
    state.question.entity.id,
    state.config.entityType,
    undefined,
    state.config.language,
  );

  // Pool épuisé en survie : la partie s'arrête, mais c'est une victoire
  // (bonus « survie complète »), pas une défaite.
  if (!next) {
    return {
      state: {
        ...state,
        score,
        lives,
        answers,
        misses,
        questionIndex,
        question: null,
        finished: true,
        survivalComplete: state.config.mode === "survival",
      },
      correct,
    };
  }

  return {
    state: { ...state, score, lives, answers, misses, questionIndex, retryQueue, question: next },
    correct,
  };
}

export interface SessionResult {
  mode: QuizMode;
  journeyId?: string;
  theme?: string;
  score: number;
  totalQuestions: number;
  durationSeconds: number;
  xp: XPBreakdown;
  misses: MissedQuestion[];
}

/** Résultat final : score, durée et XP détaillée (mêmes bonus que l'app). */
export function finishSession(
  state: SessionState,
  opts: { previousDailyStreak?: number } = {},
): SessionResult {
  const totalQuestions =
    state.config.mode === "survival"
      ? state.questionIndex
      : state.totalQuestions ?? state.questionIndex;

  const xp = calculateXP({
    score: state.score,
    total: totalQuestions,
    mode: state.config.mode,
    isSurvivalComplete: state.survivalComplete,
    isSurvivalPerfect: state.survivalComplete && state.lives === SURVIVAL_LIVES,
    previousDailyStreak: opts.previousDailyStreak,
  });

  // Un bloc mixte n'a pas de parcours au catalogue : son thème est « mix »,
  // comme sur mobile — sinon ses parties sont invisibles dans le classement
  // par thème.
  const journeyTheme =
    state.config.pathBlockId && isMixedBlockId(state.config.pathBlockId)
      ? "mix"
      : state.config.journeyId
        ? getJourneyById(state.config.journeyId)?.theme
        : undefined;

  return {
    mode: state.config.mode,
    journeyId: state.config.journeyId,
    theme: state.dailyTheme ?? journeyTheme,
    score: state.score,
    totalQuestions,
    durationSeconds: Math.max(0, Math.round((Date.now() - state.startedAt) / 1000)),
    xp,
    misses: state.misses,
  };
}
