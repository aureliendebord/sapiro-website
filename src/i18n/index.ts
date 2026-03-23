import fr from './fr.json';
import en from './en.json';
import es from './es.json';

export const languages = {
  fr,
  en,
  es
} as const;

export type Lang = keyof typeof languages;

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

export const localeNames: Record<Lang, string> = {
  fr: 'Francais',
  en: 'English',
  es: 'Espanol'
};

export const localeFlags: Record<Lang, string> = {
  fr: 'FR',
  en: 'EN',
  es: 'ES'
};
