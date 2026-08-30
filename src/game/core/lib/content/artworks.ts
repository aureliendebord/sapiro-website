// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Version web de `lib/content/artworks.ts` de l'app — compat phase 1,
 * délègue à l'accesseur généralisé. L'initialisation du contenu serveur vit
 * dans `webContent.ts` (initWebContent).
 */
import type { Artwork } from "@/types";

import { getDatasetPool } from "./entities";

export function getArtworksPool(): Artwork[] {
  return getDatasetPool("artwork") as Artwork[];
}

export { initWebContent } from "./webContent";
