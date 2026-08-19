// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Version web de `hooks/useEntityDescriptions.ts` de l'app.
 *
 * L'app importe 11 langues de JSON d'entités en statique (~13 Mo). Le site
 * n'en sert que 3, et les charge à la demande : le bundle initial ne porte
 * que la langue de la page. L'API publique (`getLocalizedEntry`) est
 * identique à celle de l'app — `useLocalizedEntity.ts` est copié verbatim et
 * consomme ce module par import relatif.
 *
 * Différence assumée : la résolution est asynchrone au premier appel pour une
 * langue donnée. `preloadEntityLocales(lang)` doit être awaité avant de
 * générer des questions (fait au boot du jeu) ; ensuite tout est synchrone.
 */
import type { EntityType } from "@/types";

export interface LocalizedEntityEntry {
  descriptions?: string[];
  name?: string;
  fullName?: string;
  birthCity?: string;
  professions?: string[];
  knownFor?: string;
  city?: string;
  architect?: string;
  capital?: string;
  headquarters?: string;
  prefecture?: string;
  title?: string;
  artist?: string;
  artistFullName?: string;
  museum?: string;
  museumCity?: string;
  description?: string;
}

export type LocalizedEntityJson = Record<string, LocalizedEntityEntry>;

type LangCode = string;

/** Types d'entités et fichier de locale correspondant. */
const FILE_BY_ENTITY_TYPE: Partial<Record<EntityType, string>> = {
  figure: "figures",
  animal: "animals",
  monument: "monuments",
  country: "countries",
  empire: "empires",
  organization: "organizations",
  region: "regions-fr",
  artwork: "artworks",
};

const SUPPORTED_LANGS = ["fr", "en", "es"] as const;

/** Cache des JSON chargés : `${lang}/${file}` -> contenu. */
const loaded = new Map<string, LocalizedEntityJson>();

/**
 * Import dynamique explicite (et non `import(\`…/${lang}/${file}.json\`)`) :
 * Vite a besoin de chemins statiquement analysables pour produire les chunks.
 */
const LOADERS: Record<string, () => Promise<{ default: LocalizedEntityJson }>> = {
  "fr/figures": () => import("@/locales/fr/figures.json"),
  "fr/animals": () => import("@/locales/fr/animals.json"),
  "fr/monuments": () => import("@/locales/fr/monuments.json"),
  "fr/countries": () => import("@/locales/fr/countries.json"),
  "fr/empires": () => import("@/locales/fr/empires.json"),
  "fr/organizations": () => import("@/locales/fr/organizations.json"),
  "fr/regions-fr": () => import("@/locales/fr/regions-fr.json"),
  "fr/artworks": () => import("@/locales/fr/artworks.json"),
  "en/figures": () => import("@/locales/en/figures.json"),
  "en/animals": () => import("@/locales/en/animals.json"),
  "en/monuments": () => import("@/locales/en/monuments.json"),
  "en/countries": () => import("@/locales/en/countries.json"),
  "en/empires": () => import("@/locales/en/empires.json"),
  "en/organizations": () => import("@/locales/en/organizations.json"),
  "en/regions-fr": () => import("@/locales/en/regions-fr.json"),
  "en/artworks": () => import("@/locales/en/artworks.json"),
  "es/figures": () => import("@/locales/es/figures.json"),
  "es/animals": () => import("@/locales/es/animals.json"),
  "es/monuments": () => import("@/locales/es/monuments.json"),
  "es/countries": () => import("@/locales/es/countries.json"),
  "es/empires": () => import("@/locales/es/empires.json"),
  "es/organizations": () => import("@/locales/es/organizations.json"),
  "es/regions-fr": () => import("@/locales/es/regions-fr.json"),
  "es/artworks": () => import("@/locales/es/artworks.json"),
};

function normalizeLang(lang: string): string {
  const base = (lang || "fr").split("-")[0];
  return (SUPPORTED_LANGS as readonly string[]).includes(base) ? base : "fr";
}

/**
 * Charge les locales d'entités (+ le fallback FR). À appeler AVANT toute
 * génération de question.
 *
 * `types` restreint le chargement aux familles réellement jouées : une partie
 * sur les pays n'a pas besoin des 436 Ko d'œuvres d'art. Sans argument, tout
 * est chargé (modes Mixte et Révision, où les entités sont hétérogènes).
 */
export async function preloadEntityLocales(
  lang: string,
  types?: EntityType[],
): Promise<void> {
  const target = normalizeLang(lang);
  const langs = target === "fr" ? ["fr"] : [target, "fr"];
  const files = types
    ? [...new Set(types.map((type) => FILE_BY_ENTITY_TYPE[type]).filter(Boolean))]
    : Object.values(FILE_BY_ENTITY_TYPE);
  const keys = langs.flatMap((l) => files.map((file) => `${l}/${file}`));

  await Promise.all(
    keys.map(async (key) => {
      if (loaded.has(key)) return;
      const loader = LOADERS[key];
      if (!loader) return;
      const mod = await loader();
      loaded.set(key, mod.default);
    }),
  );
}

/**
 * Récupère l'entrée localisée d'une entité. Fallback FR si absent, `null` si
 * l'entité n'existe pas dans les locales. Synchrone : suppose
 * `preloadEntityLocales` déjà résolu pour la langue courante.
 */
export function getLocalizedEntry(
  entityType: EntityType,
  entityId: string,
  lang: string,
): LocalizedEntityEntry | null {
  const file = FILE_BY_ENTITY_TYPE[entityType];
  if (!file) return null;

  const fr = loaded.get(`fr/${file}`);
  const inLang = loaded.get(`${normalizeLang(lang)}/${file}`) || fr;
  if (!inLang && !fr) return null;

  return inLang?.[entityId] ?? fr?.[entityId] ?? null;
}

export type { LangCode };
