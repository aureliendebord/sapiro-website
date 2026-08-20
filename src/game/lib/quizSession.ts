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
import { calculateXP, type XPBreakdown } from "@/domain/quiz/scoring";
import {
  CLASSIC_QUESTION_COUNT,
  DAILY_CHALLENGE_QUESTIONS,
  OPTIONS_COUNT,
  SURVIVAL_LIVES,
} from "@/domain/quiz/constants";
import { getJourneyById } from "@/domain/journeys/catalog";
import { getDailySeed, getDailyTheme } from "@/utils/dailyChallenge";

export type QuizMode = "classic" | "survival" | "daily" | "review";

export interface SessionConfig {
  mode: QuizMode;
  journeyId?: string;
  entityType: EntityType;
  language: string;
  /** Pool imposé (mode révision : les entités ratées). */
  pool?: AnyFlagEntity[];
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
  misses: AnyFlagEntity[];
  startedAt: number;
  finished: boolean;
  /** Vrai si le pool de survie a été entièrement épuisé. */
  survivalComplete: boolean;
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
function buildDailyPlaylist(language: string): {
  questions: QuizQuestion[];
  theme: DailyChallengeTheme;
} {
  const theme = getDailyTheme();
  const seed = getDailySeed();
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
function buildReviewPlaylist(pool: AnyFlagEntity[], language: string): QuizQuestion[] {
  const items: ReviewItem[] = pool.map((entity) => ({
    entityId: entity.id,
    entityType: entity.type,
    type: "name",
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
    playlist = buildReviewPlaylist(config.pool ?? [], config.language);
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
    totalQuestions = config.mode === "survival" ? null : CLASSIC_QUESTION_COUNT;
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
  };
}

export interface AnswerOutcome {
  state: SessionState;
  correct: boolean;
}

/** Enregistre une réponse et prépare la question suivante si la partie continue. */
export function answer(state: SessionState, choice: string): AnswerOutcome {
  if (state.finished || !state.question) return { state, correct: false };

  const correct = choice === state.question.correctAnswer;
  const missedEntity = state.question.entity;

  const score = state.score + (correct ? 1 : 0);
  const lives = correct ? state.lives : state.lives - 1;
  const answers = [...state.answers, correct];
  const misses = correct ? state.misses : [...state.misses, missedEntity];
  const questionIndex = state.questionIndex + 1;

  const outOfLives = lives <= 0;
  const reachedEnd =
    state.totalQuestions !== null && questionIndex >= state.totalQuestions;

  if (outOfLives || reachedEnd) {
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
      },
      correct,
    };
  }

  // Playlist (daily, révision) : la question suivante est déjà construite.
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
    state: { ...state, score, lives, answers, misses, questionIndex, question: next },
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
  misses: AnyFlagEntity[];
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

  const journeyTheme = state.config.journeyId
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
