// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Accesseur du pool artworks — conservé pour compat de la phase 1, délègue
 * à l'accesseur généralisé (`lib/content/entities.ts`).
 */
import type { Artwork } from "@/types";

import { getDatasetPool } from "./entities";

export function getArtworksPool(): Artwork[] {
  return getDatasetPool("artwork") as Artwork[];
}
