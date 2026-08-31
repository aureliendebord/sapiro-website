// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Contenu serveur — logique pure du manifest (validation, sélection de
 * fichiers, gating de version). Aucune dépendance React Native : ce module
 * est testable en Jest sans mock.
 *
 * Voir docs/SPEC_CONTENU_SERVEUR.md pour l'architecture complète.
 */

/**
 * Version du format des entrées que CETTE version de l'app sait lire.
 * Un manifest avec un `schemaVersion` supérieur est ignoré : le contenu au
 * nouveau format attend la release qui saura le lire, l'app reste sur son
 * contenu actuel (installé ou seed bundlé).
 */
export const SUPPORTED_SCHEMA_VERSION = 1;

export const CONTENT_BASE_URL = "https://cdn.sapiro.app/content";

export type ManifestFileInfo = {
  /** md5 hex du fichier — vérifié après téléchargement via FileSystem.getInfoAsync */
  md5: string;
  bytes: number;
};

export type ContentManifest = {
  /** Version ACTIVE du contenu — source de vérité, pas un maximum (permet le rollback). */
  contentVersion: number;
  schemaVersion: number;
  minAppVersion?: { ios?: string; android?: string };
  /** Chemins relatifs à content/v/{contentVersion}/ */
  files: Record<string, ManifestFileInfo>;
};

/** Valide la forme d'un manifest téléchargé. Retourne null si inutilisable. */
export function validateManifest(raw: unknown): ContentManifest | null {
  if (!raw || typeof raw !== "object") return null;
  const m = raw as Record<string, unknown>;
  if (typeof m.contentVersion !== "number" || !Number.isInteger(m.contentVersion)) return null;
  if (typeof m.schemaVersion !== "number") return null;
  if (!m.files || typeof m.files !== "object") return null;
  for (const info of Object.values(m.files as Record<string, unknown>)) {
    if (!info || typeof info !== "object") return null;
    const f = info as Record<string, unknown>;
    if (typeof f.md5 !== "string" || typeof f.bytes !== "number") return null;
  }
  return raw as ContentManifest;
}

// Même sémantique que compareVersions de useAppUpdate ("1.4.2" → -1|0|1).
export function compareAppVersions(a: string, b: string): number {
  const parse = (v: string) => v.split(".").map((p) => parseInt(p, 10) || 0);
  const pa = parse(a);
  const pb = parse(b);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da > db) return 1;
    if (da < db) return -1;
  }
  return 0;
}

/**
 * Fichiers à télécharger pour une langue donnée : tous les datasets + le
 * catalogue + les locales de la langue + les locales fr (fallback de
 * getLocalizedEntry) — ≈ 2-3 Mo au lieu des 11 langues complètes. Piloté par
 * le MANIFEST (tout `data/*` et `locales/{fr,lang}/*` qu'il annonce) : une
 * famille ajoutée côté serveur est téléchargée sans release, et un vieux
 * manifest phase 1 (artworks seul) reste servi tel quel.
 */
export function selectContentFiles(manifest: ContentManifest, lang: string): string[] {
  const wanted: string[] = [];
  for (const relPath of Object.keys(manifest.files)) {
    if (relPath.startsWith("data/") || relPath === "catalog.json") {
      wanted.push(relPath);
      continue;
    }
    if (relPath.startsWith("locales/fr/") || relPath.startsWith(`locales/${lang}/`)) {
      wanted.push(relPath);
    }
  }
  return wanted;
}

/**
 * Décide si le manifest doit déclencher une installation.
 * `installedVersion` = version déjà téléchargée sur ce device (null = seed).
 */
export function isUpdateApplicable(
  manifest: ContentManifest,
  opts: {
    platform: "ios" | "android" | string;
    appVersion: string | null;
    installedVersion: number | null;
  },
): boolean {
  if (manifest.schemaVersion > SUPPORTED_SCHEMA_VERSION) return false;

  const min =
    opts.platform === "ios" ? manifest.minAppVersion?.ios : manifest.minAppVersion?.android;
  if (min && opts.appVersion && compareAppVersions(opts.appVersion, min) < 0) return false;

  // Le manifest désigne la version active : différente = on s'aligne
  // (montée de version comme rollback). Égale = rien à faire.
  return manifest.contentVersion !== (opts.installedVersion ?? -1);
}
