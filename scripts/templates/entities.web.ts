/**
 * Version web de `lib/content/entities.ts` de l'app : accesseur des pools
 * d'entités — contenu serveur si chargé (webContent), sinon le seed bundlé.
 * Même signature que l'app, pour que les fichiers synchronisés (entityPool)
 * s'importent tels quels.
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
import { getWebRemoteDataset, markServed } from "./webContent";

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
  markServed();
  return getWebRemoteDataset(FILE_BY_ENTITY_TYPE[entityType]) ?? SEEDS[entityType]();
}
