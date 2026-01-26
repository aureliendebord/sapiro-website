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
  if (lang === 'fr') return path;
  return `/${lang}${path}`;
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
