/**
 * Liens vers les stores, centralisés.
 *
 * Attribution des installs sans script analytics :
 * - Play Store : le paramètre `referrer` (UTM encodé) remonte dans
 *   Play Console > Acquisition d'utilisateurs, par campagne.
 * - App Store : App Store Connect attribue automatiquement les vues
 *   produit venant du web au referrer sapiro.app (App Analytics > Sources).
 */
export const APP_STORE_URL = 'https://apps.apple.com/app/sapiro/id6757706883';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.sapiro.app';

export type StoreCampaign = 'download-section' | 'blog-cta' | 'sticky-cta';

export function playStoreUrl(campaign: StoreCampaign): string {
  const referrer = encodeURIComponent(
    `utm_source=sapiro.app&utm_medium=website&utm_campaign=${campaign}`
  );
  return `${PLAY_STORE_URL}&referrer=${referrer}`;
}
