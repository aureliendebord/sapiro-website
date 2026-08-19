// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import type { ThemeType } from "@/types";

/**
 * Couleurs par theme — source de verite unique.
 * Utilise par journeys.tsx ET index.tsx.
 */
export const THEME_COLORS: Record<
  ThemeType,
  {
    gradient: [string, string, string];
    accent: string;
    accentLight: string;
  }
> = {
  geography: {
    gradient: ["#FF8533", "#FF6B00", "#E55F00"],
    accent: "#FF6B00",
    accentLight: "#FFF5EB",
  },
  history: {
    gradient: ["#9B2D5B", "#8B2252", "#7A1D47"],
    accent: "#8B2252",
    accentLight: "#F9E8EF",
  },
  art: {
    gradient: ["#6B5B95", "#5B4B85", "#4B3B75"],
    accent: "#6B5B95",
    accentLight: "#F3F0F7",
  },
  nature: {
    gradient: ["#2D8B4E", "#237A3F", "#1A6930"],
    accent: "#2D8B4E",
    accentLight: "#E8F5E9",
  },
  monument: {
    gradient: ["#D29B4F", "#C0883C", "#A0702C"],
    accent: "#C0883C",
    accentLight: "#F4E7CE",
  },
};

/** Raccourci : gradients uniquement (pour index.tsx) */
export const THEME_GRADIENTS: Record<ThemeType, [string, string, string]> = {
  geography: THEME_COLORS.geography.gradient,
  history: THEME_COLORS.history.gradient,
  art: THEME_COLORS.art.gradient,
  nature: THEME_COLORS.nature.gradient,
  monument: THEME_COLORS.monument.gradient,
};
