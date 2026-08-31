import type { Lang } from '../i18n';

/**
 * Liens vers les stores, centralisés.
 *
 * App Store : toujours passer par appStoreUrl(lang). Le slug DOIT être le slug
 * canonique émis par Apple (sapiro-general-knowledge-quiz) : un slug arbitraire
 * comme « sapiro » fait planter l'App Store natif (« An Error Occurred »), même
 * si la page web redirige. Le code pays ne concerne que la page web ; sur iOS
 * le store natif s'ouvre sur le storefront de l'appareil.
 *
 * Attribution des installs sans script analytics :
 * - Play Store : le paramètre `referrer` (UTM encodé) remonte dans
 *   Play Console > Acquisition d'utilisateurs, par campagne.
 * - App Store : App Store Connect attribue automatiquement les vues
 *   produit venant du web au referrer sapiro.app (App Analytics > Sources).
 */
export const APP_STORE_ID = '6757706883';
export const APP_STORE_SLUG = 'sapiro-general-knowledge-quiz';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.sapiro.app';

const APP_STORE_STOREFRONT: Record<Lang, string> = {
  fr: 'fr',
  en: 'us',
  es: 'es',
};

export type StoreCampaign =
  | 'download-section'
  | 'blog-cta'
  | 'sticky-cta'
  | 'inline-banner'
  | 'post-purchase'
  /** Bloc posé juste sous le jeu, avant le contenu SEO. */
  | 'game-below';

export function appStoreUrl(lang: Lang): string {
  return `https://apps.apple.com/${APP_STORE_STOREFRONT[lang]}/app/${APP_STORE_SLUG}/id${APP_STORE_ID}`;
}

export function playStoreUrl(campaign: StoreCampaign, lang: Lang): string {
  const referrer = encodeURIComponent(
    `utm_source=sapiro.app&utm_medium=website&utm_campaign=${campaign}`
  );
  return `${PLAY_STORE_URL}&hl=${lang}&referrer=${referrer}`;
}

/**
 * Lien vers le jeu jouable en ligne (`/jouer/`, `/en/play/`, `/es/jugar/`).
 *
 * Contrairement aux liens store, la destination est interne : l'`utm_campaign`
 * sert ici à mesurer quels emplacements du site amènent réellement à jouer,
 * pas à attribuer une install.
 */
export type PlayCampaign =
  | 'hero'
  | 'nav'
  | 'demo-quiz-end'
  | 'blog-cta'
  | 'sticky-cta'
  | 'inline-banner'
  | 'download-section';

const PLAY_PATH: Record<Lang, string> = {
  fr: '/jouer/',
  en: '/en/play/',
  es: '/es/jugar/',
};

export function playGameUrl(campaign: PlayCampaign, lang: Lang): string {
  return `${PLAY_PATH[lang]}?utm_source=sapiro.app&utm_medium=website&utm_campaign=${campaign}`;
}
