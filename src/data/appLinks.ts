import type { Lang } from '../i18n';

/**
 * Liens vers les stores, centralisés.
 *
 * App Store : toujours passer par appStoreUrl(lang) — l'URL sans code pays
 * (apps.apple.com/app/...) fait parfois planter la page web d'Apple
 * (« An Error Occurred »). Le code pays ne concerne que la page web ;
 * sur iOS le store natif s'ouvre sur le storefront de l'appareil.
 *
 * Attribution des installs sans script analytics :
 * - Play Store : le paramètre `referrer` (UTM encodé) remonte dans
 *   Play Console > Acquisition d'utilisateurs, par campagne.
 * - App Store : App Store Connect attribue automatiquement les vues
 *   produit venant du web au referrer sapiro.app (App Analytics > Sources).
 */
export const APP_STORE_ID = '6757706883';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.sapiro.app';

const APP_STORE_STOREFRONT: Record<Lang, string> = {
  fr: 'fr',
  en: 'us',
  es: 'es',
};

export type StoreCampaign = 'download-section' | 'blog-cta' | 'sticky-cta' | 'inline-banner';

export function appStoreUrl(lang: Lang): string {
  return `https://apps.apple.com/${APP_STORE_STOREFRONT[lang]}/app/sapiro/id${APP_STORE_ID}`;
}

export function playStoreUrl(campaign: StoreCampaign, lang: Lang): string {
  const referrer = encodeURIComponent(
    `utm_source=sapiro.app&utm_medium=website&utm_campaign=${campaign}`
  );
  return `${PLAY_STORE_URL}&hl=${lang}&referrer=${referrer}`;
}
