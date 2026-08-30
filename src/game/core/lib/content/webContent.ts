// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Version web du ContentStore de l'app (`lib/content/store.ts`), adaptée au
 * navigateur : pas de disque, le cache HTTP fait office de stockage (les
 * fichiers `v/{N}/…` sont immuables → `force-cache`, le manifest est toujours
 * revalidé). Tout échec (CORS, réseau, schéma inconnu) retombe en silence sur
 * le seed bundlé : le pire cas est « pas de nouveauté », jamais un jeu cassé.
 *
 * Même règle d'activation que l'app : le contenu distant ne s'applique que
 * s'il arrive AVANT la première lecture d'un pool — jamais de bascule sous
 * une session. Le jeu attend ce chargement au boot (borné par un timeout) :
 * au premier passage le réseau perd la course et on joue sur le seed, aux
 * visites suivantes le cache HTTP rend l'application quasi instantanée.
 *
 * Limite assumée : les surcouches de locales distantes ne sont pas appliquées
 * (le pipeline de locales web charge les JSON bundlés) — une entité ajoutée
 * côté serveur garde son nom canonique jusqu'au déploiement suivant du site.
 */
import type { AnyFlagEntity } from "@/types";
import { DATASET_FILES, hydrateDatasetEntry, type DatasetFile } from "./datasets";
import { validateRemoteCatalog, type RemoteCatalog } from "./catalogSchema";

const CONTENT_BASE_URL = "https://cdn.sapiro.app/content";
const SUPPORTED_SCHEMA_VERSION = 1;

let remoteDatasets: Partial<Record<DatasetFile, AnyFlagEntity[]>> = {};
let remoteCatalog: RemoteCatalog | null = null;
/** Vrai dès qu'un pool ou le catalogue a été servi : plus aucune bascule. */
let served = false;

export function markServed(): void {
  served = true;
}

export function getWebRemoteDataset(file: DatasetFile): AnyFlagEntity[] | null {
  return remoteDatasets[file] ?? null;
}

export function getWebRemoteCatalog(): RemoteCatalog | null {
  return remoteCatalog;
}

function hydrate(file: DatasetFile, raw: unknown): AnyFlagEntity[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const entries = raw as AnyFlagEntity[];
  if (entries.some((e) => !e.id)) return null;
  return entries.map((e) => hydrateDatasetEntry(file, e));
}

/**
 * Vérifie et charge le contenu serveur. À attendre (borné) au montage du jeu ;
 * ne throw jamais. Résout quand le contenu est appliqué ou abandonné.
 */
export async function initWebContent(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const manifestRes = await fetch(`${CONTENT_BASE_URL}/manifest.json`, { cache: "no-store" });
    if (!manifestRes.ok) return;
    const manifest = (await manifestRes.json()) as {
      contentVersion?: number;
      schemaVersion?: number;
      files?: Record<string, unknown>;
    };
    if (
      typeof manifest.contentVersion !== "number" ||
      typeof manifest.schemaVersion !== "number" ||
      manifest.schemaVersion > SUPPORTED_SCHEMA_VERSION ||
      !manifest.files
    ) {
      return;
    }

    const base = `${CONTENT_BASE_URL}/v/${manifest.contentVersion}`;
    const fetchJson = async (relPath: string): Promise<unknown | null> => {
      if (!manifest.files?.[relPath]) return null;
      const res = await fetch(`${base}/${relPath}`, { cache: "force-cache" });
      return res.ok ? ((await res.json()) as unknown) : null;
    };

    const datasetEntries = await Promise.all(
      DATASET_FILES.map(async (file) => [file, await fetchJson(`data/${file}.json`)] as const),
    );
    const rawCatalog = await fetchJson("catalog.json");

    // Application atomique, et seulement si rien n'a encore été servi.
    if (served) return;
    const datasets: typeof remoteDatasets = {};
    for (const [file, raw] of datasetEntries) {
      const pool = raw === null ? null : hydrate(file, raw);
      if (pool) datasets[file] = pool;
    }
    remoteDatasets = datasets;
    remoteCatalog = rawCatalog === null ? null : validateRemoteCatalog(rawCatalog);
  } catch {
    // Seed bundlé — silencieux, comme l'app.
  }
}
