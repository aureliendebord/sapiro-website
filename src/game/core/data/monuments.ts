// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import type {
  Monument,
  MonumentInput,
  MonumentCategory,
  MonumentSubCategory,
  MonumentContinent,
} from "@/types";
import { getMonumentUrl } from "@/config/cdn";

import { europeMonuments } from "./monuments/europe";
import { asiaMonuments } from "./monuments/asia";
import { africaMonuments } from "./monuments/africa";
import { northAmericaMonuments } from "./monuments/north-america";
import { southAmericaMonuments } from "./monuments/south-america";
import { oceaniaMonuments } from "./monuments/oceania";

/**
 * Base de données des monuments célèbres
 * ~494 monuments répartis par continent, type et sous-type.
 *
 * Données brutes : data/monuments/{continent}.ts
 * Fun facts (multilingues) : locales/{lang}/monuments.json
 * Images : CDN Cloudflare R2 (/monuments/{category}/{id}.jpg)
 */

// Helper : transforme un MonumentInput en Monument complet (champs dérivés).
// Toutes les images sont sourcées depuis Wikimedia Commons via
// scripts/fetch-monuments-wikimedia.js (cf. docs/IMAGE_CREDITS.md).
// La licence par défaut CC-BY-SA est la plus restrictive de Wikimedia ; les
// images en Public Domain ou CC-BY restent compatibles avec cette mention.
function createMonument(input: MonumentInput): Monument {
  return {
    ...input,
    type: "monument",
    flagPath: "",
    tags: [input.category, input.subCategory],
    imageUrl: getMonumentUrl(input.category, input.id),
    imageSource: "Wikimedia Commons",
    imageLicense: "CC-BY-SA",
  };
}

const monumentInputs: MonumentInput[] = [
  ...europeMonuments,
  ...asiaMonuments,
  ...africaMonuments,
  ...northAmericaMonuments,
  ...southAmericaMonuments,
  ...oceaniaMonuments,
];

// ============================================
// EXPORTS
// ============================================

export const allMonuments: Monument[] = monumentInputs.map(createMonument);

// Fonctions de filtrage
export function getMonumentsByContinent(continent: MonumentContinent): Monument[] {
  return allMonuments.filter((m) => m.continent === continent);
}

export function getMonumentsByCategory(category: MonumentCategory): Monument[] {
  return allMonuments.filter((m) => m.category === category);
}

export function getMonumentsBySubCategory(subCategory: MonumentSubCategory): Monument[] {
  return allMonuments.filter((m) => m.subCategory === subCategory);
}

export function getMonumentById(id: string): Monument | undefined {
  return allMonuments.find((m) => m.id === id);
}

// Tous les monuments ont leur image sur le CDN (pour le quiz)
export function getAvailableMonuments(): Monument[] {
  return allMonuments;
}
