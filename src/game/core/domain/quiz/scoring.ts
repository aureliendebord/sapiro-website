// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import {
  XP_PER_CORRECT,
  PERFECT_BONUS,
  PERFECT_BONUS_MIN_QUESTIONS,
  SURVIVAL_BONUS,
  SURVIVAL_BONUS_MIN_SCORE,
  SURVIVAL_COMPLETE_BONUS,
  SURVIVAL_PERFECT_BONUS,
  DAILY_STREAK_BONUS,
  DAILY_STREAK_BONUS_MIN,
  DAILY_PERFECT_BONUS,
} from "./constants";

export interface XPBreakdown {
  baseXP: number;
  perfectBonus: number;
  survivalBonus: number;
  survivalCompleteBonus: number;
  survivalPerfectBonus: number;
  dailyStreakBonus: number;
  dailyPerfectBonus: number;
  totalXP: number;
}

export interface ScoreInput {
  score: number;
  total: number;
  mode: string;
  /** true si le pool survie est entierement epuise */
  isSurvivalComplete?: boolean;
  /** true si survie complete sans perdre de vie */
  isSurvivalPerfect?: boolean;
  /** streak du daily challenge AVANT cette partie */
  previousDailyStreak?: number;
}

/**
 * Calcule le detail de l'XP gagne pour une partie.
 * Fonction pure, testable sans UI.
 */
export function calculateXP(input: ScoreInput): XPBreakdown {
  const { score, total, mode, isSurvivalComplete, isSurvivalPerfect, previousDailyStreak } = input;

  const isSurvival = mode === "survival";
  const isDaily = mode === "daily";
  const isPerfectScore = score === total && total >= PERFECT_BONUS_MIN_QUESTIONS;
  const isDailyPerfect = isDaily && score === total;

  const baseXP = score * XP_PER_CORRECT;
  const perfectBonus = isPerfectScore ? PERFECT_BONUS : 0;
  const survivalBonus = isSurvival && score >= SURVIVAL_BONUS_MIN_SCORE ? SURVIVAL_BONUS : 0;
  const survivalCompleteBonus = isSurvivalComplete ? SURVIVAL_COMPLETE_BONUS : 0;
  const survivalPerfectBonus = isSurvivalPerfect ? SURVIVAL_PERFECT_BONUS : 0;
  const dailyStreakBonus =
    isDaily && (previousDailyStreak ?? 0) >= DAILY_STREAK_BONUS_MIN ? DAILY_STREAK_BONUS : 0;
  const dailyPerfectBonus = isDailyPerfect ? DAILY_PERFECT_BONUS : 0;

  return {
    baseXP,
    perfectBonus,
    survivalBonus,
    survivalCompleteBonus,
    survivalPerfectBonus,
    dailyStreakBonus,
    dailyPerfectBonus,
    totalXP:
      baseXP +
      perfectBonus +
      survivalBonus +
      survivalCompleteBonus +
      survivalPerfectBonus +
      dailyStreakBonus +
      dailyPerfectBonus,
  };
}
