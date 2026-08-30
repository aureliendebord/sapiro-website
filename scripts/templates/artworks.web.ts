/**
 * Version web de `lib/content/artworks.ts` de l'app — le ContentStore, adapté
 * au navigateur.
 *
 * L'app télécharge le pool artworks depuis `cdn.sapiro.app/content/`
 * (expo-file-system, activation au boot suivant). Le web applique la même
 * source avec les moyens du navigateur : le manifest est vérifié au chargement
 * de la page, le pool distant remplace le seed bundlé SEULEMENT s'il arrive
 * avant la première partie — jamais de bascule sous une session, même règle
 * que l'app. Tout échec (CORS, réseau, schéma inconnu) retombe en silence sur
 * le seed : le pire cas est « pas de nouveauté », jamais un jeu cassé.
 *
 * Limite assumée : les surcouches de locales distantes ne sont pas appliquées
 * (le pipeline de locales web charge les JSON bundlés) — une œuvre ajoutée
 * côté serveur garde son nom canonique jusqu'au déploiement suivant du site.
 */
import { getAvailableArtworks } from "@/data/artworks";
import { getArtworkUrl } from "@/config/cdn";
import type { Artwork } from "@/types";

const CONTENT_BASE_URL = "https://cdn.sapiro.app/content";
const SUPPORTED_SCHEMA_VERSION = 1;

let remote: Artwork[] | null = null;
/** Vrai dès que le pool a été servi une fois : plus aucune bascule ensuite. */
let served = false;

export function getArtworksPool(): Artwork[] {
  served = true;
  return remote ?? getAvailableArtworks();
}

/**
 * Vérifie le contenu serveur en tâche de fond. À appeler une fois au montage
 * du jeu ; ne throw jamais.
 */
export function initWebContent(): void {
  if (typeof window === "undefined") return;
  void (async () => {
    try {
      const manifestRes = await fetch(`${CONTENT_BASE_URL}/manifest.json`, { cache: "no-store" });
      if (!manifestRes.ok) return;
      const manifest = (await manifestRes.json()) as {
        contentVersion?: number;
        schemaVersion?: number;
        files?: Record<string, unknown>;
      };
      if (
        manifest.schemaVersion !== SUPPORTED_SCHEMA_VERSION ||
        typeof manifest.contentVersion !== "number" ||
        !manifest.files?.["data/artworks.json"]
      ) {
        return;
      }

      const res = await fetch(
        `${CONTENT_BASE_URL}/v/${manifest.contentVersion}/data/artworks.json`,
      );
      if (!res.ok) return;
      const data = (await res.json()) as Artwork[];
      if (!Array.isArray(data) || data.length === 0) return;

      // `imageUrl` est retirée à la compilation (le cache-buster reste piloté
      // par le code) : on la recalcule, comme `hydrateArtworks` côté app.
      if (!served) {
        remote = data.map((a) => ({ ...a, imageUrl: getArtworkUrl(a.movement, a.id) }));
      }
    } catch {
      // Seed bundlé — silencieux, comme l'app.
    }
  })();
}
