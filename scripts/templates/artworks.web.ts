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
