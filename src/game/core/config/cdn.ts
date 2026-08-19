// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Configuration CDN pour les assets distants (portraits, œuvres, animaux, monuments).
 *
 * Pour configurer Cloudflare R2 :
 * 1. Créer un compte Cloudflare (gratuit)
 * 2. Aller dans R2 > Create bucket > "sapiro-assets"
 * 3. Settings > Public access > Allow public access
 * 4. Custom domain > cdn.sapiro.app (ou utiliser le domaine R2 fourni)
 * 5. Upload les portraits dans /portraits/{category}/{id}.jpg
 */

// Base URL du CDN - À remplacer par votre URL R2 ou domaine custom
export const CDN_BASE_URL = "https://cdn.sapiro.app";

/**
 * Version des images de monuments. À incrémenter après un re-téléchargement
 * d'images : le cache CDN Cloudflare est immuable (1 an) ; changer le `?v=`
 * crée une nouvelle clé de cache et force le rafraîchissement sans purge manuelle.
 */
export const MONUMENT_IMAGE_VERSION = 7;

/**
 * Version des images d'œuvres d'art. Bumper après un re-téléchargement pour
 * forcer les appareils ayant déjà l'ancienne image en cache (expo-image cache
 * par URL) à recharger : changer le `?v=` crée une nouvelle clé de cache.
 */
export const ARTWORK_IMAGE_VERSION = 1;

/**
 * Fabrique les helpers d'une famille d'assets (portraits, artworks, …) :
 * - getUrl(category, id) → URL `{base}/{category}/{id}.jpg` (+ `?v=` si versionné)
 * - isValid(url)         → URL bien formée pour cette famille
 * - getFallback()        → URL de l'image de repli `{base}/fallback.jpg`
 *
 * Remplace 4 triplets de fonctions quasi identiques (portraits / artworks /
 * animals / monuments) qui ne différaient que par le segment d'URL.
 */
function makeAssetHelpers(segment: string, opts: { version?: number } = {}) {
  const base = `${CDN_BASE_URL}/${segment}`;
  const fallbackUrl = `${base}/fallback.jpg`;
  return {
    base,
    fallbackUrl,
    getUrl: (category: string, id: string): string => {
      const url = `${base}/${category}/${id}.jpg`;
      return opts.version != null ? `${url}?v=${opts.version}` : url;
    },
    isValid: (url: string): boolean => url.startsWith(base) && url.endsWith(".jpg"),
    getFallback: (): string => fallbackUrl,
  };
}

const portraits = makeAssetHelpers("portraits");
const artworks = makeAssetHelpers("artworks", { version: ARTWORK_IMAGE_VERSION });
const animals = makeAssetHelpers("animals");
const monuments = makeAssetHelpers("monuments", { version: MONUMENT_IMAGE_VERSION });

// URLs des assets (conservé pour compat — dérivé des helpers ci-dessus)
export const CDN_URLS = {
  portraits: portraits.base,
  artworks: artworks.base,
  fallback: portraits.fallbackUrl,
  artworkFallback: artworks.fallbackUrl,
  animals: animals.base,
  animalFallback: animals.fallbackUrl,
  monuments: monuments.base,
  monumentFallback: monuments.fallbackUrl,
} as const;

// ── Portraits (personnages historiques) ────────────────────────────────────
export const getPortraitUrl = portraits.getUrl;
export const isValidPortraitUrl = portraits.isValid;
export const getFallbackPortraitUrl = portraits.getFallback;

// ── Œuvres d'art ────────────────────────────────────────────────────────────
export const getArtworkUrl = artworks.getUrl;
export const isValidArtworkUrl = artworks.isValid;
export const getFallbackArtworkUrl = artworks.getFallback;

// ── Animaux ─────────────────────────────────────────────────────────────────
export const getAnimalUrl = animals.getUrl;
export const isValidAnimalUrl = animals.isValid;
export const getFallbackAnimalUrl = animals.getFallback;

// ── Monuments (URL versionnée via MONUMENT_IMAGE_VERSION) ────────────────────
export const getMonumentUrl = monuments.getUrl;
export const isValidMonumentUrl = monuments.isValid;
export const getFallbackMonumentUrl = monuments.getFallback;

// Catégories de portraits disponibles
export const PORTRAIT_CATEGORIES = [
  "political",
  "scientist",
  "artist",
  "writer",
  "military",
  "explorer",
  "athlete",
  "entrepreneur",
] as const;

// Mouvements artistiques pour les œuvres d'art
export const ARTWORK_MOVEMENTS = [
  "medieval",
  "renaissance",
  "mannerism",
  "baroque",
  "rococo",
  "neoclassicism",
  "romanticism",
  "realism",
  "impressionism",
  "post_impressionism",
  "symbolism",
  "art_nouveau",
  "expressionism",
  "fauvism",
  "cubism",
  "futurism",
  "dadaism",
  "surrealism",
  "abstract",
  "pop_art",
  "contemporary",
  "northern_renaissance",
  "dutch_golden_age",
] as const;

// Classes d'animaux pour le CDN
export const ANIMAL_CLASSES = [
  "mammal",
  "bird",
  "reptile",
  "amphibian",
  "fish",
  "insect",
  "arachnid",
  "crustacean",
  "mollusk",
] as const;

// Catégories de monuments pour le CDN
export const MONUMENT_CATEGORIES = [
  "religious",
  "palace",
  "fortification",
  "funerary",
  "ancient",
  "civil",
  "monument",
  "tower",
  "natural",
] as const;

// Configuration du cache expo-image
export const IMAGE_CACHE_CONFIG = {
  // Politique de cache : stockage sur disque pour persistence
  cachePolicy: "disk" as const,
  // Durée de transition pour l'affichage (ms)
  transition: 200,
  // Placeholder blurhash pendant le chargement
  placeholder: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
};
