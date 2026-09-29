/**
 * Tokens de design du jeu web — miroir de `constants/design.ts` de l'app.
 *
 * Non synchronisé : le fichier de l'app importe `react-native-reanimated`
 * (courbes d'easing) et ses ombres sont au format RN. Les valeurs de couleur,
 * de rayon et de typo sont en revanche identiques, volontairement — l'app est
 * la source de vérité de la DA. Toute divergence ici est un bug.
 */

export const NEUTRAL = {
  canvas: "#FBF4EB",
  canvasDim: "#F3EADA",
  canvasDeep: "#1A1816",
  surface: "#FFFFFF",
  ink: "#1A1816",
  inkMid: "#6E665C",
  inkFaint: "#B6ADA1",
  ruleLight: "#E8DFCD",
  rule: "#D5C9B1",
} as const;

export const FEEDBACK = {
  correct: "#2B8F5E",
  correctSoft: "#D9EDE2",
  correctInk: "#12472E",
  wrong: "#D14836",
  wrongSoft: "#F7DDD7",
  wrongInk: "#771F14",
} as const;

export const BRAND = {
  primary: "#FF5E3A",
  onPrimary: "#FFFFFF",
  tint: "#FFE4DB",
  tintDeep: "#B13818",
} as const;

export type ColorScheme = {
  primary: string;
  onPrimary: string;
  tint: string;
  tintDeep: string;
};

/** Une couleur dominante par rubrique (thème de contenu). */
export const THEMES: Record<string, ColorScheme> = {
  mix: { primary: "#2E9AA8", onPrimary: "#FFFFFF", tint: "#DCEFF2", tintDeep: "#155E68" },
  geography: { primary: "#FF5E3A", onPrimary: "#FFFFFF", tint: "#FFE4DB", tintDeep: "#B13818" },
  history: { primary: "#B74F7A", onPrimary: "#FFFFFF", tint: "#F7E2EB", tintDeep: "#73284F" },
  art: { primary: "#6C7FE0", onPrimary: "#FFFFFF", tint: "#E7EBFA", tintDeep: "#3D4D9E" },
  nature: { primary: "#4C9A6B", onPrimary: "#FFFFFF", tint: "#DDEDDF", tintDeep: "#275E3E" },
  monument: { primary: "#C0883C", onPrimary: "#FFFFFF", tint: "#F4E7CE", tintDeep: "#6E4A16" },
};

/** Accent par mode de jeu. */
export const MODE_COLOR: Record<string, ColorScheme> = {
  classic: { primary: "#FF5E3A", onPrimary: "#FFFFFF", tint: "#FFE4DB", tintDeep: "#B13818" },
  survival: { primary: "#E5435A", onPrimary: "#FFFFFF", tint: "#FBDDE2", tintDeep: "#9A1B30" },
  // Défi du jour : orange de marque (DA V3 de l'app — le vert détonnait).
  daily: { primary: "#FF5E3A", onPrimary: "#FFFFFF", tint: "#FFE4DB", tintDeep: "#B13818" },
  review: { primary: "#7C5CE0", onPrimary: "#FFFFFF", tint: "#E7E0FA", tintDeep: "#4A35A0" },
  // Duel : l'orange de la marque, c'est LE mode de l'app 2.1.0.
  duel: { primary: "#FF5E3A", onPrimary: "#FFFFFF", tint: "#FFE4DB", tintDeep: "#B13818" },
};

/**
 * Typographie DA V3 : Nunito pour le texte, Baloo 2 ExtraBold pour les
 * chiffres et les mots qui claquent (score, verdict) — jamais une phrase.
 */
export const FONTS = {
  text: '"Nunito", system-ui, sans-serif',
  display: '"Baloo 2", "Nunito", system-ui, sans-serif',
} as const;

/** DA V3 — fond crème, encre chaude, verre (miroir de `V3` de l'app). */
export const V3 = {
  /** Dégradé du fond crème, du haut vers le bas. */
  cream: ["#FFFDFA", "#FBF1E8", "#F6DCCB"] as const,
  /** Voile crème posé sur l'illustration de fond (accueil). */
  veil: "rgba(255,253,250,0.25)",
  ink: "#2A1A14",
  inkSoft: "rgba(42,26,20,0.6)",
  glass: ["rgba(255,255,255,0.55)", "rgba(255,255,255,0.25)", "rgba(255,255,255,0.4)"] as const,
  glassEdge: "rgba(255,255,255,0.9)",
  /** Bouton 3D orange : face (haut → bas) + socle. */
  button: { face: ["#FF8A5B", "#FF5E3A", "#E9401F"] as const, base: "#C9441F" },
  /** Ombre chaude et floue (teinte brune) sous le verre et les objets illustrés. */
  warmShadow: "0 10px 18px rgb(120 50 20 / 16%)",
} as const;

export const RADIUS = {
  sm: 10,
  md: 18,
  lg: 28,
  xl: 36,
  pill: 999,
} as const;

export function themeColor(theme: string | undefined): ColorScheme {
  return THEMES[theme ?? "geography"] ?? THEMES.geography;
}

export function modeColor(mode: string): ColorScheme {
  return MODE_COLOR[mode] ?? MODE_COLOR.classic;
}

/**
 * Variables CSS d'accent d'un mode, à poser en style inline sur le conteneur
 * d'un écran. Une seule définition pour tous les écrans : ajouter une variable
 * ici la propage partout.
 */
export function accentVars(mode: string): Record<string, string> {
  const accent = modeColor(mode);
  return {
    "--accent": accent.primary,
    "--on-accent": accent.onPrimary,
    "--accent-tint": accent.tint,
    "--accent-deep": accent.tintDeep,
  };
}
