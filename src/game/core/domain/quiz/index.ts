// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
// Domain Quiz — point d'entree unique
export {
  generateQuestions,
  generateSingleQuestion,
  getSecondaryValue,
  getEntityImageUrl,
  type QuizQuestion,
  type QuizQuestionType,
  type FigureSecondaryField,
} from "./questionGenerator";

export { getEntityPool, getDailyChallengePool, getFullPool, getEntityById } from "./entityPool";

export { buildReviewQuestions } from "./reviewQuestions";

export {
  buildMixedQuestions,
  getMixedSurvivalPool,
  generateMixedSingleQuestion,
  mixedEntityKey,
  entityFromMixedKey,
  expandSurvivalPool,
  pickSurvivalEntry,
  generateSurvivalQuestionForEntry,
  survivalEntryKey,
  MIX_ENTITY_TYPES,
  type PoolPreparer,
  type SurvivalEntry,
} from "./mixedQuestions";

export { calculateXP, type XPBreakdown, type ScoreInput } from "./scoring";

export {
  CLASSIC_QUESTION_COUNT,
  DAILY_CHALLENGE_QUESTIONS,
  OPTIONS_COUNT,
  SURVIVAL_LIVES,
  QUIZ_MODE_COLORS,
  RESULT_MODE_COLORS,
  type ModeColorScheme,
} from "./constants";
