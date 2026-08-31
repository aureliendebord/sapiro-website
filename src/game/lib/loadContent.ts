/**
 * Chargeur de contenu serveur — pendant web de `lib/content/store.ts` de l'app.
 *
 * C'est le SEUL module que le web écrit pour le contenu : l'app télécharge dans
 * le système de fichiers (expo-file-system), le site fetch et pousse dans le
 * même état mémoire pur (`core/lib/content/state.ts`). Tout le reste — sélection
 * des fichiers, hydratation des URLs, validation du catalogue, ordre de repli
 * des traductions — est du code synchronisé depuis l'app, jamais réécrit ici.
 *
 * Règles reprises de l'app :
 *  - le contenu ne s'applique qu'AVANT la première question (le chargement est
 *    attendu au boot, borné par `timeoutMs`) — jamais de bascule sous une
 *    session ; passé le délai, les requêtes sont annulées et rien n'est posé ;
 *  - tout échec retombe en silence sur le seed bundlé : le pire cas est « pas
 *    de nouveauté », jamais un jeu cassé ;
 *  - datasets et catalogue sont tout-ou-rien. Un mélange seed/serveur ferait
 *    diverger le Défi du jour du mobile, qui lui vérifie chaque fichier.
 *    Les locales, elles, sont au mieux : une traduction manquante retombe sur
 *    la locale bundlée, ce que `getLocalizedEntry` sait déjà faire.
 *
 * Les fichiers `v/{N}/…` sont immuables → `force-cache` ; seul le manifest est
 * revalidé. Au premier passage le réseau perd souvent la course et on joue sur
 * le seed ; aux visites suivantes le cache HTTP rend l'application immédiate.
 */
import {
  CONTENT_BASE_URL,
  SUPPORTED_SCHEMA_VERSION,
  selectContentFiles,
  validateManifest,
} from "@/lib/content/manifest";
import { DATASET_FILES, hydrateDatasetEntry, type DatasetFile } from "@/lib/content/datasets";
import { validateRemoteCatalog, type RemoteCatalog } from "@/lib/content/catalogSchema";
import {
  setLocaleOverrides,
  setRemoteContent,
  type LocaleJson,
  type LocaleOverrides,
} from "@/lib/content/state";
import type { AnyFlagEntity } from "@/types";

const DATA_RE = /^data\/([a-z-]+)\.json$/;
const LOCALE_RE = /^locales\/([a-z]{2})\/([a-z-]+)\.json$/;

const isDatasetFile = (name: string): name is DatasetFile =>
  (DATASET_FILES as readonly string[]).includes(name);

function hydrate(file: DatasetFile, raw: unknown): AnyFlagEntity[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const entries = raw as AnyFlagEntity[];
  if (entries.some((e) => !e?.id)) return null;
  // OBLIGATOIRE : les JSON ne portent pas les URLs d'images (le cache-buster
  // `?v=` est piloté par le code, pas par le contenu).
  return entries.map((e) => hydrateDatasetEntry(file, e));
}

/**
 * Vérifie et applique le contenu serveur pour une langue. À awaiter au montage
 * du jeu ; ne throw jamais.
 *
 * @returns la version de contenu appliquée, ou `null` si on reste sur le seed.
 */
export async function loadContent(lang: string, timeoutMs = 1500): Promise<number | null> {
  if (typeof window === "undefined") return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const { signal } = controller;

  try {
    const manifestRes = await fetch(`${CONTENT_BASE_URL}/manifest.json`, {
      cache: "no-store",
      signal,
    });
    if (!manifestRes.ok) return null;

    const manifest = validateManifest(await manifestRes.json());
    if (!manifest) return null;
    // Contenu au format d'une future release : on reste sur le nôtre.
    if (manifest.schemaVersion > SUPPORTED_SCHEMA_VERSION) return null;

    // Mêmes fichiers que le mobile : datasets + catalogue + locales (langue
    // demandée + fr, fallback de getLocalizedEntry). Piloté par le manifest,
    // donc une famille ajoutée côté serveur arrive sans déploiement du site.
    const base = `${CONTENT_BASE_URL}/v/${manifest.contentVersion}`;
    const loaded = await Promise.all(
      selectContentFiles(manifest, lang).map(async (rel) => {
        const res = await fetch(`${base}/${rel}`, { cache: "force-cache", signal });
        return { rel, json: res.ok ? ((await res.json()) as unknown) : null };
      }),
    );

    const datasets: Partial<Record<DatasetFile, AnyFlagEntity[]>> = {};
    const locales: LocaleOverrides = {};
    let catalog: RemoteCatalog | null = null;
    let broken = false;

    for (const { rel, json } of loaded) {
      const data = DATA_RE.exec(rel);
      if (data && isDatasetFile(data[1])) {
        const pool = json === null ? null : hydrate(data[1], json);
        if (!pool) broken = true;
        else datasets[data[1]] = pool;
        continue;
      }
      if (rel === "catalog.json") {
        catalog = json === null ? null : validateRemoteCatalog(json);
        if (!catalog) broken = true;
        continue;
      }
      const loc = LOCALE_RE.exec(rel);
      // La langue rangée est celle du FICHIER, jamais celle demandée : le
      // fallback fr est téléchargé avec la langue cible et doit rester sous fr.
      if (loc && json !== null && isDatasetFile(loc[2])) {
        (locales[loc[2]] ??= {})[loc[1]] = json as LocaleJson;
      }
    }

    // Un seul fichier de jeu manquant ou illisible → on ne pose rien.
    if (broken) return null;
    // Course perdue : la partie a pu démarrer sur le seed, on n'y touche plus.
    if (signal.aborted) return null;

    setRemoteContent(datasets, catalog);
    setLocaleOverrides(locales);
    return manifest.contentVersion;
  } catch {
    // Réseau, CORS, JSON invalide, abandon : seed bundlé, silencieux.
    return null;
  } finally {
    clearTimeout(timer);
  }
}
