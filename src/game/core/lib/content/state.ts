// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * État mémoire du contenu serveur — module PUR (aucune dépendance React
 * Native). Le store (expo-file-system) ÉCRIT ici à l'activation ; les
 * accesseurs lus par le moteur de jeu (`entities.ts`, `catalog.ts`,
 * `locales.ts`) LISENT ici. C'est ce qui permet aux scripts Node
 * (compile-content) et au jeu web d'importer le moteur sans tirer React
 * Native.
 */
import type { AnyFlagEntity } from "@/types";
import type { DatasetFile } from "./datasets";
import type { RemoteCatalog } from "./catalogSchema";

/** Entrée de locale d'entité (forme des fichiers `locales/{lang}/{file}.json`). */
export type LocaleEntry = Record<string, unknown>;
export type LocaleJson = Record<string, LocaleEntry>;
/** localeOverrides[file][lang] — surcouches de traduction téléchargées. */
export type LocaleOverrides = Partial<Record<DatasetFile, Record<string, LocaleJson>>>;

let remoteDatasets: Partial<Record<DatasetFile, AnyFlagEntity[]>> = {};
let remoteCatalog: RemoteCatalog | null = null;
let localeOverrides: LocaleOverrides = {};
// Incrémenté à CHAQUE mutation du contenu actif. Les caches de résolution
// (cf. `localize.ts`) l'intègrent à leur clé : sans ça, une locale arrivant en
// cours de session (changement de langue) ne serait jamais prise en compte.
let generation = 0;

export function setRemoteContent(
  datasets: Partial<Record<DatasetFile, AnyFlagEntity[]>>,
  catalog: RemoteCatalog | null,
): void {
  remoteDatasets = datasets;
  remoteCatalog = catalog;
  generation++;
}

/** Version de l'état du contenu — clé d'invalidation des caches dérivés. */
export function contentGeneration(): number {
  return generation;
}

export function readRemoteDataset(file: DatasetFile): AnyFlagEntity[] | null {
  return remoteDatasets[file] ?? null;
}

export function readRemoteCatalog(): RemoteCatalog | null {
  return remoteCatalog;
}

export function hasRemoteContent(): boolean {
  return Object.keys(remoteDatasets).length > 0 || remoteCatalog !== null;
}

/** Remplace toutes les surcouches de locales (activation au boot). */
export function setLocaleOverrides(overrides: LocaleOverrides): void {
  localeOverrides = overrides;
  generation++;
}

/**
 * Pose une seule surcouche (changement de langue en cours de session). La
 * langue est celle du FICHIER, jamais celle demandée : le fallback `fr` est
 * téléchargé avec la langue cible et doit rester rangé sous `fr`.
 */
export function setLocaleOverride(file: DatasetFile, lang: string, json: LocaleJson): void {
  (localeOverrides[file] ??= {})[lang] = json;
  generation++;
}

export function readLocaleOverride(file: DatasetFile, lang: string): LocaleJson | null {
  return localeOverrides[file]?.[lang] ?? null;
}

export function hasLocaleOverride(file: DatasetFile, lang: string): boolean {
  return localeOverrides[file]?.[lang] !== undefined;
}
