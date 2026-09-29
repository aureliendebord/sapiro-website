// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
// ============================================
// Constantes du jeu — source de verite unique
// ============================================

/** Nombre de questions en mode classique */
export const CLASSIC_QUESTION_COUNT = 10;

/** Nombre de questions pour le defi du jour */
export const DAILY_CHALLENGE_QUESTIONS = 10;

/** Nombre d'options par question (QCM) */
export const OPTIONS_COUNT = 4;

/** Nombre de vies en mode survie */
export const SURVIVAL_LIVES = 3;

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
  survival: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#E5435A",
    light: "#FBDDE2",
    background: "#FBDDE2",
    buttonColor: "#E5435A",
  },
  // Défi du jour : orange de marque (DA V3, 24/09).
  daily: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#FF5E3A",
    light: "#FFE4DB",
    background: "#FFE4DB",
    buttonColor: "#FF5E3A",
  },
  duel: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#FF5E3A",
    light: "#FFE4DB",
    background: "#FFE4DB",
    buttonColor: "#FF5E3A",
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
  survival: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#E5435A",
    light: "#FBDDE2",
    background: "#FBDDE2",
  },
  daily: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#FF5E3A",
    light: "#FFE4DB",
    background: "#FFE4DB",
  },
  duel: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#FF5E3A",
    light: "#FFE4DB",
    background: "#FFE4DB",
  },
  review: {
    gradient: ["#FBF4EB", "#FBF4EB", "#FBF4EB"],
    primary: "#7C5CE0",
    light: "#E7E0FA",
    background: "#E7E0FA",
  },
};
