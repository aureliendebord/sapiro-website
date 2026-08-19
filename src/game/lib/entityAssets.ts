/**
 * Résolution des visuels d'entités pour le web.
 *
 * L'app importe les ~290 drapeaux SVG en statique (`assets/flags/index.ts`,
 * via react-native-svg-transformer). Sur le web, `npm run sync:game` les copie
 * dans `public/flags/` et on les sert par URL — pas de bundle de 2,8 Mo.
 *
 * Les autres visuels (portraits, œuvres, animaux, monuments) viennent du même
 * CDN que l'app, via `getEntityImageUrl` du cœur synchronisé : mêmes images,
 * mêmes sources, mêmes versions de cache.
 */
import type { AnyFlagEntity } from "@/types";
import { getEntityImageUrl } from "@/domain/quiz/questionGenerator";

/** Types d'entités rendus par une photo CDN plutôt qu'un drapeau SVG. */
const IMAGE_TYPES = new Set(["figure", "artwork", "animal", "monument"]);

export function isImageEntity(entity: AnyFlagEntity): boolean {
  return IMAGE_TYPES.has(entity.type);
}

/** URL du drapeau SVG servi depuis `public/flags/`. */
export function flagUrl(flagPath: string | undefined): string | null {
  if (!flagPath) return null;
  return `/flags/${flagPath}.svg`;
}

/**
 * Visuel principal de la question : photo CDN pour les entités illustrées,
 * drapeau SVG sinon. `null` si l'entité n'a aucun visuel exploitable.
 */
export function entityVisualUrl(entity: AnyFlagEntity): string | null {
  if (isImageEntity(entity)) return getEntityImageUrl(entity) || null;
  return flagUrl(entity.flagPath);
}
