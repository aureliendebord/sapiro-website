import fr from './fr.json';
import en from './en.json';
import es from './es.json';
import de from './de.json';

export const languages = {
  fr,
  en,
  es,
  de
} as const;

export type Lang = keyof typeof languages;

/**
 * Langues où le site est complet. L'allemand n'en couvre qu'un sous-ensemble :
 * pas de pages concours, famille, comparatifs, et un blog réduit. Une table
 * `PartialLangMap` exige donc fr/en/es mais laisse `de` optionnel — chaque
 * consommateur doit gérer son absence (lien vers l'accueil, hreflang omis…).
 */
export type FullLang = Exclude<Lang, 'de'>;
export type PartialLangMap<T> = Record<FullLang, T> & Partial<Record<Lang, T>>;

/** Ordre d'affichage des langues (sélecteurs, hreflang, sitemap). */
export const LANGS: Lang[] = ['fr', 'en', 'es', 'de'];

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return 'fr';
}

export function getTranslations(lang: Lang) {
  return languages[lang];
}

export function getLocalePath(path: string, lang: Lang): string {
  // Ensure trailing slash for all paths (SEO: avoid 308 redirects)
  const normalizedPath = path.endsWith('/') || path.includes('#') || path === '/' ? path : `${path}/`;
  if (lang === 'fr') return normalizedPath;
  return `/${lang}${normalizedPath}`;
}

/** Locale BCP 47 pour les dates et nombres. */
export const dateLocales: Record<Lang, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE'
};

export const localeNames: Record<Lang, string> = {
  fr: 'Francais',
  en: 'English',
  es: 'Espanol',
  de: 'Deutsch'
};

export const localeFlags: Record<Lang, string> = {
  fr: 'FR',
  en: 'EN',
  es: 'ES',
  de: 'DE'
};
