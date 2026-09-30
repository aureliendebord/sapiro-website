/**
 * Profils officiels de SAPIRO — source unique pour le footer et le `sameAs`
 * du schema Organization. Les deux divergeaient (deux pages Facebook
 * différentes), or `sameAs` sert justement à dire à Google et aux IA quels
 * profils sont la même entité : une URL fausse y fait plus de mal que pas
 * d'URL du tout.
 *
 * Pour ajouter une fiche (Product Hunt, AlternativeTo, Wikidata…) : une ligne
 * dans `DIRECTORY_PROFILES`, elle part dans le `sameAs` des trois accueils.
 */
import { APP_STORE_ID, APP_STORE_SLUG, PLAY_STORE_URL } from './appLinks';

export const SOCIAL_PROFILES = {
  instagram: 'https://www.instagram.com/sapiro_en',
  tiktok: 'https://www.tiktok.com/@sapiro_en',
  facebook: 'https://www.facebook.com/profile.php?id=61591072345953',
  youtube: 'https://www.youtube.com/@sapiroapp',
} as const;

/** Fiches d'annuaires et bases de connaissances (URLs exactes uniquement). */
export const DIRECTORY_PROFILES: string[] = [];

export const SAME_AS: string[] = [
  `https://apps.apple.com/app/${APP_STORE_SLUG}/id${APP_STORE_ID}`,
  PLAY_STORE_URL,
  ...Object.values(SOCIAL_PROFILES),
  ...DIRECTORY_PROFILES,
];

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SAPIRO',
  url: 'https://sapiro.app',
  logo: 'https://sapiro.app/images/icon-1024.png',
  sameAs: SAME_AS,
  parentOrganization: {
    '@type': 'Organization',
    name: 'AGENCE DEBORD EURL',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9 rue des Colonnes',
      postalCode: '75002',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
  },
};

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SAPIRO',
  url: 'https://sapiro.app',
  inLanguage: ['fr', 'en', 'es'],
};
