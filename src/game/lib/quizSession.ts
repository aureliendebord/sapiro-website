/**
 * Machine à états d'une partie — orchestre le cœur synchronisé pour le web.
 *
 * Toute la génération de questions et le calcul d'XP viennent de `@/domain`,
 * donc d'exactement le même code que l'app : mêmes questions, mêmes options,
 * mêmes bonus. Ce module ne fait qu'enchaîner les questions et tenir le score.
 */
import type { AnyFlagEntity, EntityType } from "@/types";
import {
  generateSingleQuestion,
  type QuizQuestion,
} from "@/domain/quiz/questionGenerator";
import { getEntityPool, getFullPool } from "@/domain/quiz/entityPool";
import { calculateXP, type XPBreakdown } from "@/domain/quiz/scoring";
import {
  CLASSIC_QUESTION_COUNT,
  DAILY_CHALLENGE_QUESTIONS,
  SURVIVAL_LIVES,
} from "@/domain/quiz/constants";
import { getJourneyById } from "@/domain/journeys/catalog";

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
  score: number;
  lives: number;
  misses: AnyFlagEntity[];
  startedAt: number;
  finished: boolean;
  /** Vrai si le pool de survie a été entièrement épuisé. */
  survivalComplete: boolean;
}

/** Nombre de questions d'une partie, `null` pour la survie (illimitée). */
function questionCountFor(mode: QuizMode): number | null {
  if (mode === "survival") return null;
  if (mode === "daily") return DAILY_CHALLENGE_QUESTIONS;
  return CLASSIC_QUESTION_COUNT;
}

function resolvePool(config: SessionConfig): { pool: AnyFlagEntity[]; fullPool: AnyFlagEntity[] } {
  const fullPool = getFullPool(config.entityType);
  const pool = config.pool?.length
    ? config.pool
    : getEntityPool(config.journeyId, config.entityType);
  return { pool, fullPool };
}

export function startSession(config: SessionConfig): SessionState {
  const { pool, fullPool } = resolvePool(config);
  const question = generateSingleQuestion(
    pool,
    fullPool,
    null,
    config.entityType,
    undefined,
    config.language,
  );

  return {
    config,
    question,
    questionIndex: 0,
    totalQuestions: questionCountFor(config.mode),
    score: 0,
    lives: config.mode === "survival" ? SURVIVAL_LIVES : Infinity,
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
  const misses = correct ? state.misses : [...state.misses, missedEntity];
  const questionIndex = state.questionIndex + 1;

  const outOfLives = lives <= 0;
  const reachedEnd =
    state.totalQuestions !== null && questionIndex >= state.totalQuestions;

  if (outOfLives || reachedEnd) {
    return {
      state: { ...state, score, lives, misses, questionIndex, question: null, finished: true },
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
    state: { ...state, score, lives, misses, questionIndex, question: next },
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
    state.config.mode === "survival" ? state.questionIndex : state.totalQuestions ?? state.questionIndex;

  const xp = calculateXP({
    score: state.score,
    total: totalQuestions,
    mode: state.config.mode,
    isSurvivalComplete: state.survivalComplete,
    isSurvivalPerfect: state.survivalComplete && state.lives === SURVIVAL_LIVES,
    previousDailyStreak: opts.previousDailyStreak,
  });

  return {
    mode: state.config.mode,
    journeyId: state.config.journeyId,
    theme: state.config.journeyId ? getJourneyById(state.config.journeyId)?.theme : undefined,
    score: state.score,
    totalQuestions,
    durationSeconds: Math.max(0, Math.round((Date.now() - state.startedAt) / 1000)),
    xp,
    misses: state.misses,
  };
}
