// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import { DAILY_STREAK_MILESTONES } from "@/data/dailyChallengeThemes";
import { getDailyThemes } from "@/lib/content/catalog";
import type { DailyChallengeTheme, ThemeType } from "@/types";

// Re-export shuffle utilities for convenience
export { shuffleWithSeed, seededRandom } from "./shuffle";

/**
 * Génère un seed déterministe basé sur la date.
 * Le même jour produira toujours le même seed, garantissant
 * que tous les utilisateurs voient le même thème.
 *
 * @param date - La date pour laquelle générer le seed (défaut: aujourd'hui)
 * @returns Un nombre entier positif utilisable comme seed
 */
export function getDailySeed(date: Date = new Date()): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Combine la date en un nombre unique YYYYMMDD
  const dateNumber = year * 10000 + month * 100 + day;

  // Fonction de hash simple (variante de splitmix32) pour mélanger les bits
  let hash = dateNumber;
  hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
  hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
  hash = (hash >> 16) ^ hash;

  return Math.abs(hash);
}

/**
 * Retourne le thème du jour basé sur un calcul déterministe.
 * Le même jour retournera toujours le même thème.
 *
 * @param date - La date pour laquelle obtenir le thème (défaut: aujourd'hui)
 * @param themeCategory - Catégorie optionnelle pour filtrer les thèmes ('geography', 'history' ou 'art')
 * @returns Le thème du jour
 */
export function getDailyTheme(
  date: Date = new Date(),
  themeCategory?: ThemeType,
): DailyChallengeTheme {
  const seed = getDailySeed(date);
  // Catalogue ACTIF (serveur ou seed) : même liste → même thème pour tous.
  const allThemes = getDailyThemes();

  // Filtrer les thèmes par catégorie si spécifié
  const themes = themeCategory
    ? allThemes.filter((t) => t.themeCategory === themeCategory)
    : allThemes;

  // S'assurer qu'il y a des thèmes disponibles
  if (themes.length === 0) {
    // Fallback sur tous les thèmes si aucun ne correspond
    const themeIndex = seed % allThemes.length;
    return allThemes[themeIndex];
  }

  const themeIndex = seed % themes.length;
  const selectedTheme = themes[themeIndex];

  // Vérification de cohérence : s'assurer que le thème retourné
  // correspond bien à la catégorie demandée (protection contre les bugs de filtrage)
  if (themeCategory && selectedTheme.themeCategory !== themeCategory) {
    // En cas d'incohérence, forcer le premier thème de la bonne catégorie
    const fallback = allThemes.find((t) => t.themeCategory === themeCategory);
    if (fallback) return fallback;
  }

  return selectedTheme;
}

/**
 * Formate une date en chaîne YYYY-MM-DD pour comparaison et stockage.
 *
 * Utilise la date LOCALE (et non UTC) — cohérent avec `getDailySeed` (qui
 * choisit le thème du jour via getFullYear/getMonth/getDate locaux) et avec le
 * streak de jeu général (`updateDailyStreak` côté store). Auparavant cette
 * fonction renvoyait la date UTC (toISOString), ce qui décalait le défi du jour
 * et le streak d'une journée pour les fuseaux à l'ouest de UTC (Amériques,
 * DOM-TOM) jouant en soirée.
 *
 * @param date - La date à formater (défaut: aujourd'hui)
 * @returns La date au format YYYY-MM-DD (heure locale)
 */
export function formatDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Vérifie si le défi du jour est disponible (non encore complété aujourd'hui).
 *
 * @param lastDailyChallengeDate - La dernière date de complétion (format YYYY-MM-DD ou null)
 * @returns true si le défi est disponible, false sinon
 */
export function isDailyChallengeAvailable(lastDailyChallengeDate: string | null): boolean {
  if (!lastDailyChallengeDate) {
    return true; // Premier défi
  }

  const today = formatDateKey(new Date());
  return lastDailyChallengeDate !== today;
}

/**
 * Calcule le nouveau streak après complétion d'un défi.
 *
 * @param currentStreak - Le streak actuel
 * @param lastDailyChallengeDate - La dernière date de complétion
 * @returns Le nouveau streak (incrémenté ou reset à 1)
 */
export function calculateNewStreak(
  currentStreak: number,
  lastDailyChallengeDate: string | null,
): number {
  const today = formatDateKey(new Date());

  // Premier défi
  if (!lastDailyChallengeDate) {
    return 1;
  }

  // Déjà fait aujourd'hui (ne devrait pas arriver)
  if (lastDailyChallengeDate === today) {
    return currentStreak;
  }

  // Vérifier si c'est le jour suivant
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  if (lastDailyChallengeDate === yesterdayKey) {
    // Jour consécutif : incrémenter le streak
    return currentStreak + 1;
  }

  // Plus d'un jour passé : reset le streak
  return 1;
}

/**
 * Trouve le prochain palier de streak à atteindre.
 *
 * @param currentStreak - Le streak actuel
 * @returns Le prochain palier ou null si tous atteints
 */
export function getNextMilestone(currentStreak: number): number | null {
  for (const milestone of DAILY_STREAK_MILESTONES) {
    if (milestone > currentStreak) {
      return milestone;
    }
  }
  return null; // Tous les paliers atteints
}

/**
 * Calcule la progression vers le prochain palier en pourcentage.
 *
 * @param currentStreak - Le streak actuel
 * @returns Un objet avec le pourcentage et le prochain palier
 */
export function getStreakProgress(currentStreak: number): {
  percent: number;
  nextMilestone: number | null;
  previousMilestone: number;
} {
  const nextMilestone = getNextMilestone(currentStreak);

  if (!nextMilestone) {
    return {
      percent: 100,
      nextMilestone: null,
      previousMilestone: DAILY_STREAK_MILESTONES[DAILY_STREAK_MILESTONES.length - 1],
    };
  }

  // Trouver le palier précédent
  let previousMilestone = 0;
  for (const milestone of DAILY_STREAK_MILESTONES) {
    if (milestone >= nextMilestone) break;
    if (milestone <= currentStreak) {
      previousMilestone = milestone;
    }
  }

  const progressInRange = currentStreak - previousMilestone;
  const rangeSize = nextMilestone - previousMilestone;
  const percent = Math.round((progressInRange / rangeSize) * 100);

  return {
    percent,
    nextMilestone,
    previousMilestone,
  };
}

/**
 * Retourne le nombre de jours restants jusqu'au prochain palier.
 *
 * @param currentStreak - Le streak actuel
 * @returns Le nombre de jours ou null si tous atteints
 */
export function getDaysToNextMilestone(currentStreak: number): number | null {
  const nextMilestone = getNextMilestone(currentStreak);
  if (!nextMilestone) return null;
  return nextMilestone - currentStreak;
}
