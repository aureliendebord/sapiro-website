// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Entity Pool Service
 *
 * Moteur d'execution generique pour la selection des pools d'entites.
 * Les filtres sont definis dans domain/journeys/catalog.ts (source de verite unique).
 * Ce module se contente d'appliquer ces filtres aux donnees.
 */
import { countries, getCountriesByContinent, getCountriesByTag, getCountriesByPopulation } from "@/data/countries";
import { frenchRegions, getRegionsByOverseas } from "@/data/regions-fr";
import { historicalEmpires, getEmpiresByEra } from "@/data/empires";
import { internationalOrgs, getOrgsByCategory } from "@/data/organizations";
import {
  historicalFigures,
  getFiguresByCategory,
  getFiguresByEra,
  getFiguresByContinent,
} from "@/data/historicalFigures";
import { getAvailableArtworks } from "@/data/artworks";
import { allAnimals, getAnimalsByClass, getAnimalsByFamily, getAnimalsByFamilies } from "@/data/animals";
import {
  getAvailableMonuments,
  getMonumentsByContinent,
  getMonumentsByCategory,
  getMonumentsBySubCategory,
} from "@/data/monuments";
import { getJourneyById } from "@/domain/journeys";

import type { AnyFlagEntity, EntityType, JourneyFilter, DailyChallengeTheme, Artwork } from "@/types";

// ============================================
// Moteur generique de filtrage
// ============================================

/**
 * Applique un filtre metier a un type d'entite.
 * Utilise par getEntityPool (journeys) et getDailyChallengePool (defi quotidien).
 */
function getPoolByFilter(entityType: EntityType, filter: JourneyFilter): AnyFlagEntity[] {
  // Countries
  if (entityType === "country" || !entityType) {
    if (filter.continent) return getCountriesByContinent(filter.continent);
    if (filter.tags?.length) return getCountriesByTag(filter.tags[0]);
    if (filter.minPopulation) return getCountriesByPopulation(filter.minPopulation);
    if (filter.maxArea) return countries.filter((c) => c.area < filter.maxArea!);
    return countries;
  }

  // French Regions
  if (entityType === "region") {
    if (filter.isOverseas !== undefined) return getRegionsByOverseas(filter.isOverseas);
    return frenchRegions;
  }

  // Historical Empires
  if (entityType === "empire") {
    if (filter.era) return getEmpiresByEra(filter.era);
    return historicalEmpires;
  }

  // International Organizations
  if (entityType === "organization") {
    if (filter.orgCategory) return getOrgsByCategory(filter.orgCategory);
    return internationalOrgs;
  }

  // Historical Figures
  if (entityType === "figure") {
    if (filter.figureCategory) return getFiguresByCategory(filter.figureCategory);
    if (filter.figureEra) return getFiguresByEra(filter.figureEra);
    if (filter.figureContinent) return getFiguresByContinent(filter.figureContinent);
    return historicalFigures;
  }

  // Artworks
  if (entityType === "artwork") {
    let pool: AnyFlagEntity[] = getAvailableArtworks();
    if (filter.artMovement)
      pool = pool.filter((a) => (a as Artwork).movement === filter.artMovement);
    if (filter.artMedium) pool = pool.filter((a) => (a as Artwork).medium === filter.artMedium);
    if (filter.artMuseum)
      pool = pool.filter((a) =>
        (a as Artwork).museum.toLowerCase().includes(filter.artMuseum!.toLowerCase()),
      );
    return pool;
  }

  // Animals
  if (entityType === "animal") {
    if (filter.animalClass) return getAnimalsByClass(filter.animalClass);
    if (filter.animalFamily) return getAnimalsByFamily(filter.animalFamily);
    if (filter.animalFamilies) return getAnimalsByFamilies(filter.animalFamilies);
    return allAnimals;
  }

  // Monuments
  if (entityType === "monument") {
    if (filter.monumentContinent) return getMonumentsByContinent(filter.monumentContinent);
    if (filter.monumentCategory) return getMonumentsByCategory(filter.monumentCategory);
    if (filter.monumentSubCategory) return getMonumentsBySubCategory(filter.monumentSubCategory);
    return getAvailableMonuments();
  }

  return countries;
}

// ============================================
// getEntityPool — journey-based
// ============================================

/**
 * Retourne le pool d'entites pour un journey donne.
 * Lookup le filtre depuis le catalogue, puis delegue a getPoolByFilter.
 */
export function getEntityPool(
  journeyId: string | undefined,
  entityType: EntityType,
): AnyFlagEntity[] {
  const journey = journeyId ? getJourneyById(journeyId) : undefined;
  const filter = journey?.filter ?? {};

  return getPoolByFilter(entityType, filter);
}

// ============================================
// getDailyChallengePool — theme-based
// ============================================

/**
 * Retourne le pool d'entites pour un theme du defi quotidien.
 * Le theme porte deja son filtre, on delegue directement.
 */
export function getDailyChallengePool(theme: DailyChallengeTheme): AnyFlagEntity[] {
  return getPoolByFilter(theme.entityType, theme.filter);
}

// ============================================
// getFullPool — pool complet sans filtre
// ============================================

/**
 * Retourne le pool complet d'un type d'entite, sans filtre.
 * Utile comme fallback pour les mauvaises options quand le pool filtre est trop petit.
 */
export function getFullPool(entityType: EntityType): AnyFlagEntity[] {
  return getPoolByFilter(entityType, {});
}

// ============================================
// getEntityById — lookup unitaire dans le pool complet
// ============================================

/**
 * Retourne une entite par son id dans le pool complet de son type.
 * Utilise par le mode revision pour retrouver une entite ratee a partir de
 * son id stocke dans le deck. Renvoie `undefined` si l'entite a disparu du
 * catalogue (entree obsolete dans le deck).
 */
export function getEntityById(
  entityType: EntityType,
  id: string,
): AnyFlagEntity | undefined {
  return getFullPool(entityType).find((entity) => entity.id === id);
}
