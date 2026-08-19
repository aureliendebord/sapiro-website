// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
// ============================================
// Constantes du jeu — source de verite unique
// ============================================

/** Nombre de questions en mode classique / capital */
export const CLASSIC_QUESTION_COUNT = 10;

/** Nombre de questions pour le defi du jour */
export const DAILY_CHALLENGE_QUESTIONS = 10;

/** Nombre d'options par question (QCM) */
export const OPTIONS_COUNT = 4;

/** Nombre de vies en mode survie */
export const SURVIVAL_LIVES = 3;

// ============================================
// XP et scoring
// ============================================

/** XP par bonne reponse */
export const XP_PER_CORRECT = 10;

/** Bonus score parfait (si score === total ET total >= seuil) */
export const PERFECT_BONUS = 20;
export const PERFECT_BONUS_MIN_QUESTIONS = 10;

/** Bonus survie (score >= seuil) */
export const SURVIVAL_BONUS = 30;
export const SURVIVAL_BONUS_MIN_SCORE = 10;

/** Bonus survie complete (tout le pool epuise) */
export const SURVIVAL_COMPLETE_BONUS = 100;

/** Bonus survie parfaite (complete sans perdre de vie) */
export const SURVIVAL_PERFECT_BONUS = 200;

/** Bonus streak daily (streak >= seuil) */
export const DAILY_STREAK_BONUS = 10;
export const DAILY_STREAK_BONUS_MIN = 7;

/** Bonus defi quotidien parfait */
export const DAILY_PERFECT_BONUS = 20;

// ============================================
// Couleurs par mode de jeu
// ============================================

export type ModeColorScheme = {
  gradient: [string, string, string];
  primary: string;
  light: string;
  background: string;
  buttonColor?: string;
};

/** Couleurs du quiz screen — canvas crème, accent mode saturé */
export const QUIZ_MODE_COLORS: Record<string, ModeColorScheme> = {
  classic: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#FF5E3A",
    light: "#FFE4DB",
    background: "#FFE4DB",
    buttonColor: "#FF5E3A",
  },
  capital: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#F4B740",
    light: "#FDEBC3",
    background: "#FDEBC3",
    buttonColor: "#F4B740",
  },
  survival: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#E5435A",
    light: "#FBDDE2",
    background: "#FBDDE2",
    buttonColor: "#E5435A",
  },
  daily: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#4C9A6B",
    light: "#DDEDDF",
    background: "#DDEDDF",
    buttonColor: "#4C9A6B",
  },
  review: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#7C5CE0",
    light: "#E7E0FA",
    background: "#E7E0FA",
    buttonColor: "#7C5CE0",
  },
};

/** Couleurs du result screen (alignées sur QUIZ_MODE_COLORS) */
export const RESULT_MODE_COLORS: Record<
  string,
  { gradient: [string, string, string]; primary: string; light: string; background: string }
> = {
  classic: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#FF5E3A",
    light: "#FFE4DB",
    background: "#FFE4DB",
  },
  capital: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#F4B740",
    light: "#FDEBC3",
    background: "#FDEBC3",
  },
  survival: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#E5435A",
    light: "#FBDDE2",
    background: "#FBDDE2",
  },
  daily: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#4C9A6B",
    light: "#DDEDDF",
    background: "#DDEDDF",
  },
  review: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#7C5CE0",
    light: "#E7E0FA",
    background: "#E7E0FA",
  },
};
