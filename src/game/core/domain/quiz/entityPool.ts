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
import { getDatasetPool } from "@/lib/content/entities";
import { getJourneyById } from "@/domain/journeys";

import type {
  AnyFlagEntity,
  EntityType,
  JourneyFilter,
  DailyChallengeTheme,
  Animal,
  Artwork,
  Country,
  FrenchRegion,
  HistoricalEmpire,
  HistoricalFigure,
  InternationalOrg,
  Monument,
} from "@/types";

// ============================================
// Moteur generique de filtrage
// ============================================

/**
 * Applique un filtre metier a un type d'entite.
 * Utilise par getEntityPool (journeys) et getDailyChallengePool (defi quotidien).
 */
/**
 * Tous les pools de base viennent de `getDatasetPool` (contenu serveur si une
 * mise à jour est active, sinon le seed bundlé) : c'est ce qui fait qu'une
 * correction de données publiée sur le CDN vaut pour TOUS les modes de jeu.
 * Les filtres reprennent tels quels les helpers historiques de `data/*.ts`,
 * appliqués au dataset ACTIF au lieu de l'import statique.
 */
function getPoolByFilter(entityType: EntityType, filter: JourneyFilter): AnyFlagEntity[] {
  // Countries
  if (entityType === "country" || !entityType) {
    const pool = getDatasetPool("country") as Country[];
    if (filter.continent) return pool.filter((c) => c.continent === filter.continent);
    if (filter.tags?.length) return pool.filter((c) => c.tags.includes(filter.tags![0]));
    if (filter.minPopulation) return pool.filter((c) => c.population >= filter.minPopulation!);
    if (filter.maxArea) return pool.filter((c) => c.area < filter.maxArea!);
    return pool;
  }

  // French Regions
  if (entityType === "region") {
    const pool = getDatasetPool("region") as FrenchRegion[];
    if (filter.isOverseas !== undefined)
      return pool.filter((r) => r.isOverseas === filter.isOverseas);
    return pool;
  }

  // Historical Empires
  if (entityType === "empire") {
    const pool = getDatasetPool("empire") as HistoricalEmpire[];
    if (filter.era) return pool.filter((e) => e.era === filter.era);
    return pool;
  }

  // International Organizations
  if (entityType === "organization") {
    const pool = getDatasetPool("organization") as InternationalOrg[];
    if (filter.orgCategory) return pool.filter((o) => o.category === filter.orgCategory);
    return pool;
  }

  // Historical Figures
  if (entityType === "figure") {
    const pool = getDatasetPool("figure") as HistoricalFigure[];
    if (filter.figureCategory) return pool.filter((f) => f.category === filter.figureCategory);
    if (filter.figureEra) return pool.filter((f) => f.era === filter.figureEra);
    if (filter.figureContinent) return pool.filter((f) => f.continent === filter.figureContinent);
    return pool;
  }

  // Artworks
  if (entityType === "artwork") {
    let pool: AnyFlagEntity[] = getDatasetPool("artwork");
    if (filter.artMovement)
      pool = pool.filter((a) => (a as Artwork).movement === filter.artMovement);
    if (filter.artMedium) pool = pool.filter((a) => (a as Artwork).medium === filter.artMedium);
    if (filter.artMuseum)
      pool = pool.filter((a) =>
        ((a as Artwork).museum ?? "").toLowerCase().includes(filter.artMuseum!.toLowerCase()),
      );
    return pool;
  }

  // Animals
  if (entityType === "animal") {
    const pool = getDatasetPool("animal") as Animal[];
    if (filter.animalClass) return pool.filter((a) => a.animalClass === filter.animalClass);
    if (filter.animalFamily) return pool.filter((a) => a.family === filter.animalFamily);
    if (filter.animalFamilies)
      return pool.filter((a) => filter.animalFamilies!.includes(a.family));
    return pool;
  }

  // Monuments
  if (entityType === "monument") {
    const pool = getDatasetPool("monument") as Monument[];
    if (filter.monumentContinent)
      return pool.filter((m) => m.continent === filter.monumentContinent);
    if (filter.monumentCategory) return pool.filter((m) => m.category === filter.monumentCategory);
    if (filter.monumentSubCategory)
      return pool.filter((m) => m.subCategory === filter.monumentSubCategory);
    return pool;
  }

  return getDatasetPool("country");
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
export function getEntityById(entityType: EntityType, id: string): AnyFlagEntity | undefined {
  return getFullPool(entityType).find((entity) => entity.id === id);
}
