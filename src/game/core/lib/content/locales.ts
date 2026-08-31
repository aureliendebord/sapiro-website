// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Version web de `lib/content/locales.ts` de l'app — SEULE divergence assumée
 * du cœur synchronisé.
 *
 * L'app importe 11 langues de JSON d'entités en statique (~13 Mo, acceptable
 * dans un binaire). Le site n'en sert que 3 et les charge à la demande : le
 * bundle initial ne porte aucune locale d'entité, et une partie sur les pays
 * ne télécharge pas les 436 Ko d'œuvres d'art.
 *
 * Tout le reste est identique à l'app, volontairement :
 *  - même API publique (`getLocalizedEntry`), donc `hooks/useEntityDescriptions.ts`,
 *    `lib/content/localize.ts` et `domain/` sont copiés verbatim ;
 *  - même ORDRE DE REPLI champ par champ (voir plus bas). C'est le point
 *    sensible : la version naïve faisait basculer en français des joueurs dont
 *    la langue existait ;
 *  - mêmes surcouches distantes, lues dans `state.ts` — ce que l'ancien shim
 *    `webContent.ts` ne savait pas faire.
 *
 * Différence de contrat : la résolution est asynchrone au PREMIER appel pour
 * une langue. `preloadEntityLocales(lang, types)` doit être awaité avant de
 * générer des questions (fait au lancement d'une partie) ; ensuite tout est
 * synchrone, comme dans l'app.
 */
import type { EntityType } from "@/types";
import { readLocaleOverride } from "./state";
import { DATASET_FILES, FILE_BY_ENTITY_TYPE, type DatasetFile } from "./datasets";

export interface LocalizedEntityEntry {
  descriptions?: string[];
  name?: string;
  fullName?: string;
  birthCity?: string;
  professions?: string[];
  knownFor?: string;
  // Monument
  city?: string;
  architect?: string;
  // Pays/Empire/Organisation/Région
  capital?: string;
  headquarters?: string;
  prefecture?: string;
  // Œuvre
  title?: string;
  artist?: string;
  artistFullName?: string;
  museum?: string;
  museumCity?: string;
  description?: string;
}

export type LocalizedEntityJson = Record<string, LocalizedEntityEntry>;

type LangCode = string;

/** Les 3 langues du site (l'app en sert 11). */
const SUPPORTED_LANGS = ["fr", "en", "es"] as const;

/** Locales bundlées déjà chargées : `${lang}/${file}` -> contenu. */
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

export function normalizeLang(lang: string): string {
  const base = (lang || "fr").split("-")[0];
  return (SUPPORTED_LANGS as readonly string[]).includes(base) ? base : "fr";
}

/** Familles d'entités concernées par une liste de types (défaut : toutes). */
function filesFor(types?: EntityType[]): DatasetFile[] {
  if (!types) return [...DATASET_FILES];
  return [...new Set(types.map((type) => FILE_BY_ENTITY_TYPE[type]))];
}

/**
 * Charge les locales bundlées d'entités (+ le fallback FR). À appeler AVANT
 * toute génération de question.
 *
 * `types` restreint le chargement aux familles réellement jouées. Sans
 * argument, tout est chargé (modes Mixte et Révision, entités hétérogènes).
 */
export async function preloadEntityLocales(lang: string, types?: EntityType[]): Promise<void> {
  const target = normalizeLang(lang);
  const langs = target === "fr" ? ["fr"] : [target, "fr"];
  const keys = langs.flatMap((l) => filesFor(types).map((file) => `${l}/${file}`));

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
 * Récupère l'entrée localisée d'une entité, `null` si l'entité est inconnue.
 *
 * Ordre de repli, champ par champ : distant(langue) → bundlé(langue) →
 * distant(fr) → bundlé(fr). IDENTIQUE à l'app. Une entrée distante ne doit PAS
 * court-circuiter la traduction bundlée de la langue demandée, sinon une
 * locale distante fr présente ferait basculer en français un joueur dont la
 * langue est pourtant servie.
 */
export function getLocalizedEntry(
  entityType: EntityType,
  entityId: string,
  lang: string,
): LocalizedEntityEntry | null {
  const file = FILE_BY_ENTITY_TYPE[entityType];
  // La langue distante est celle DEMANDÉE (le manifest sert `locales/{lang}/`),
  // la langue bundlée est normalisée aux 3 du site.
  const bundledLang = normalizeLang(lang);

  const candidates: (LocalizedEntityEntry | undefined)[] = [
    readLocaleOverride(file, lang)?.[entityId] as LocalizedEntityEntry | undefined,
    loaded.get(`${bundledLang}/${file}`)?.[entityId],
    readLocaleOverride(file, "fr")?.[entityId] as LocalizedEntityEntry | undefined,
    loaded.get(`fr/${file}`)?.[entityId],
  ];

  const present = candidates.filter((c): c is LocalizedEntityEntry => Boolean(c));
  if (present.length === 0) return null;
  // Fusion : le premier candidat gagne champ par champ, les suivants comblent
  // les trous (une entrée distante partielle ne doit pas effacer le reste).
  return Object.assign({}, ...[...present].reverse()) as LocalizedEntityEntry;
}

export type { LangCode };
