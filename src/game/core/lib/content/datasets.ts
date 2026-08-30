// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Registre des familles servies par le contenu serveur.
 *
 * Une famille = un fichier `data/<file>.json` + ses locales
 * `locales/<lang>/<file>.json` sur le CDN. Le nom de fichier est LE nom
 * canonique partagé par la compilation (scripts/compile-content.ts), le
 * téléchargement (manifest/store) et les accesseurs (entities.ts) — une seule
 * table à faire évoluer quand une famille apparaît.
 *
 * Les URLs d'images ne voyagent jamais dans le JSON : elles sont recalculées
 * à l'hydratation pour que le cache-buster `?v=` reste piloté par le code.
 */
import { getAnimalUrl, getArtworkUrl, getMonumentUrl, getPortraitUrl } from "@/config/cdn";
import type { AnyFlagEntity, Animal, Artwork, EntityType, HistoricalFigure, Monument } from "@/types";

export const DATASET_FILES = [
  "countries",
  "regions-fr",
  "empires",
  "organizations",
  "figures",
  "artworks",
  "animals",
  "monuments",
] as const;

export type DatasetFile = (typeof DATASET_FILES)[number];

export const FILE_BY_ENTITY_TYPE: Record<EntityType, DatasetFile> = {
  country: "countries",
  region: "regions-fr",
  empire: "empires",
  organization: "organizations",
  figure: "figures",
  artwork: "artworks",
  animal: "animals",
  monument: "monuments",
};

/** Recalcule les champs d'URL retirés à la compilation (voir compile-content). */
export function hydrateDatasetEntry(file: DatasetFile, entry: AnyFlagEntity): AnyFlagEntity {
  switch (file) {
    case "artworks": {
      const a = entry as Artwork;
      return { ...a, imageUrl: getArtworkUrl(a.movement, a.id) };
    }
    case "figures": {
      const f = entry as HistoricalFigure;
      return { ...f, portraitUrl: getPortraitUrl(f.category, f.id) };
    }
    case "animals": {
      const a = entry as Animal;
      return { ...a, imageUrl: getAnimalUrl(a.animalClass, a.id) };
    }
    case "monuments": {
      const m = entry as Monument;
      return { ...m, imageUrl: getMonumentUrl(m.category, m.id) };
    }
    default:
      return entry;
  }
}
