// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Accesseur des pools d'entités : version serveur si une mise à jour de
 * contenu est active, sinon le seed bundlé dans le build (data/*.ts).
 * C'est LE point de passage du moteur de quiz vers les datasets — le pendant
 * généralisé de `lib/content/artworks.ts` (phase 1).
 */
import { countries } from "@/data/countries";
import { frenchRegions } from "@/data/regions-fr";
import { historicalEmpires } from "@/data/empires";
import { internationalOrgs } from "@/data/organizations";
import { historicalFigures } from "@/data/historicalFigures";
import { getAvailableArtworks } from "@/data/artworks";
import { allAnimals } from "@/data/animals";
import { getAvailableMonuments } from "@/data/monuments";
import type { AnyFlagEntity, EntityType } from "@/types";

import { FILE_BY_ENTITY_TYPE } from "./datasets";
import { readRemoteDataset } from "./state";

const SEEDS: Record<EntityType, () => AnyFlagEntity[]> = {
  country: () => countries,
  region: () => frenchRegions,
  empire: () => historicalEmpires,
  organization: () => internationalOrgs,
  figure: () => historicalFigures,
  artwork: () => getAvailableArtworks(),
  animal: () => allAnimals,
  monument: () => getAvailableMonuments(),
};

export function getDatasetPool(entityType: EntityType): AnyFlagEntity[] {
  return readRemoteDataset(FILE_BY_ENTITY_TYPE[entityType]) ?? SEEDS[entityType]();
}
