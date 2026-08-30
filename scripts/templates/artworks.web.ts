/**
 * Version web de `lib/content/artworks.ts` de l'app.
 *
 * L'app charge le pool artworks depuis le ContentStore (téléchargement de
 * données à chaud, expo-file-system) avec le seed bundlé en secours. Le web
 * n'a pas de ContentStore : chaque déploiement du site embarque le seed à
 * jour — la « mise à jour de contenu » du web, c'est le déploiement.
 */
import { getAvailableArtworks } from "@/data/artworks";
import type { Artwork } from "@/types";

export function getArtworksPool(): Artwork[] {
  return getAvailableArtworks();
}
