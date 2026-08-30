// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Validation du catalogue distant (catalog.json) — forward-compat.
 *
 * Le catalogue serveur peut être produit par une version du repo plus récente
 * que l'app installée : une journey ou un thème qui utilise un filtre ou un
 * type d'entité que CETTE app ne connaît pas est ignoré silencieusement
 * (spec §2 : « un filtre inconnu dans le JSON → journey ignorée »). Un
 * catalogue qui ne laisse rien passer est considéré inutilisable → seed.
 */
import type { DailyChallengeTheme, EntityType } from "@/types";
import type { JourneyDefinition } from "@/domain/journeys/catalog";

export interface RemoteCatalog {
  journeys: JourneyDefinition[];
  dailyThemes: DailyChallengeTheme[];
}

const KNOWN_ENTITY_TYPES: ReadonlySet<string> = new Set([
  "country",
  "region",
  "empire",
  "organization",
  "figure",
  "artwork",
  "animal",
  "monument",
] satisfies EntityType[]);

/** Clés de filtre que le moteur (`getPoolByFilter`) sait exécuter. */
const KNOWN_FILTER_KEYS: ReadonlySet<string> = new Set([
  "continent",
  "tags",
  "minPopulation",
  "maxPopulation",
  "maxArea",
  "isOverseas",
  "era",
  "orgCategory",
  "figureCategory",
  "figureEra",
  "figureContinent",
  "artMovement",
  "artMedium",
  "artMuseum",
  "animalClass",
  "animalFamily",
  "animalFamilies",
  "monumentContinent",
  "monumentCategory",
  "monumentSubCategory",
]);

function isExecutable(entry: {
  id?: unknown;
  entityType?: unknown;
  filter?: unknown;
}): boolean {
  if (typeof entry.id !== "string" || !entry.id) return false;
  if (!KNOWN_ENTITY_TYPES.has(String(entry.entityType))) return false;
  if (entry.filter === undefined) return true;
  if (typeof entry.filter !== "object" || entry.filter === null) return false;
  return Object.keys(entry.filter).every((key) => KNOWN_FILTER_KEYS.has(key));
}

/**
 * Valide et filtre un catalog.json téléchargé. Retourne null si le contenu
 * est inutilisable (forme inattendue, ou plus rien après filtrage).
 */
export function validateRemoteCatalog(raw: unknown): RemoteCatalog | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { journeys, dailyThemes } = raw as { journeys?: unknown; dailyThemes?: unknown };
  if (!Array.isArray(journeys) || !Array.isArray(dailyThemes)) return null;

  const validJourneys = journeys.filter((j) => isExecutable(j as JourneyDefinition));
  const validThemes = dailyThemes.filter((t) => isExecutable(t as DailyChallengeTheme));
  if (validJourneys.length === 0 || validThemes.length === 0) return null;

  return {
    journeys: validJourneys as JourneyDefinition[],
    dailyThemes: validThemes as DailyChallengeTheme[],
  };
}
