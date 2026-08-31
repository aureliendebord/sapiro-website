// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Accesseur du catalogue de jeu (journeys + thèmes du Défi du jour) :
 * version serveur si une mise à jour de contenu est active, sinon le seed
 * bundlé. Pendant de `entities.ts` pour la phase 3.
 *
 * Les fichiers SYNCHRONISÉS vers le jeu web (domain/, utils/) passent par ce
 * module — jamais par le store directement (expo-file-system) : le site web
 * fournit son propre shim de ce fichier, comme pour `artworks.ts`.
 */
import { JOURNEY_CATALOG, type JourneyDefinition } from "@/domain/journeys/catalog";
import { DAILY_CHALLENGE_THEMES } from "@/data/dailyChallengeThemes";
import type { DailyChallengeTheme } from "@/types";

import { readRemoteCatalog } from "./state";

export function getJourneysCatalog(): JourneyDefinition[] {
  return readRemoteCatalog()?.journeys ?? JOURNEY_CATALOG;
}

/**
 * Thèmes du Défi du jour. Le thème est choisi par `seed % length` : web et
 * mobile jouent le même défi tant qu'ils voient la même version de contenu
 * (une version en retard d'un boot peut diverger un jour, comme entre deux
 * releases store — assumé).
 */
export function getDailyThemes(): DailyChallengeTheme[] {
  return readRemoteCatalog()?.dailyThemes ?? DAILY_CHALLENGE_THEMES;
}
