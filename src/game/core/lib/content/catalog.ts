// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Version web de `lib/content/catalog.ts` de l'app : catalogue de jeu
 * (journeys + thèmes du Défi du jour) — contenu serveur si chargé, sinon le
 * seed bundlé. Même signature que l'app pour les fichiers synchronisés
 * (domain/journeys/catalog.ts, utils/dailyChallenge.ts).
 */
import { JOURNEY_CATALOG, type JourneyDefinition } from "@/domain/journeys/catalog";
import { DAILY_CHALLENGE_THEMES } from "@/data/dailyChallengeThemes";
import type { DailyChallengeTheme } from "@/types";

import { getWebRemoteCatalog, markServed } from "./webContent";

export function getJourneysCatalog(): JourneyDefinition[] {
  markServed();
  return getWebRemoteCatalog()?.journeys ?? JOURNEY_CATALOG;
}

/** Même liste que le mobile pour une version de contenu donnée → même défi. */
export function getDailyThemes(): DailyChallengeTheme[] {
  markServed();
  return getWebRemoteCatalog()?.dailyThemes ?? DAILY_CHALLENGE_THEMES;
}
