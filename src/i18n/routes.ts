import type { Lang, PartialLangMap } from './index';
import { LANGS } from './index';

export type RouteKey =
  | 'home'
  | 'art'
  | 'history'
  | 'geography'
  | 'nature'
  | 'monuments'
  | 'exams'
  | 'family'
  | 'comparisons'
  | 'privacy'
  | 'terms'
  | 'faq'
  | 'quiz'
  | 'play'
  | 'blog'
  | 'about'
  | 'credits'
  | 'widget';

// `de` est optionnel : concours, famille et comparatifs n'existent pas en
// allemand. Miroir à garder aligné : FIXED_ROUTES dans astro.config.mjs.
export const routes: Record<RouteKey, PartialLangMap<string>> = {
  home: { fr: '/', en: '/en/', es: '/es/', de: '/de/' },
  art: { fr: '/art/', en: '/en/art/', es: '/es/arte/', de: '/de/kunst/' },
  history: { fr: '/histoire/', en: '/en/history/', es: '/es/historia/', de: '/de/geschichte/' },
  geography: { fr: '/geographie/', en: '/en/geography/', es: '/es/geografia/', de: '/de/geografie/' },
  nature: { fr: '/nature/', en: '/en/nature/', es: '/es/naturaleza/', de: '/de/natur/' },
  monuments: { fr: '/monuments/', en: '/en/monuments/', es: '/es/monumentos/', de: '/de/monumente/' },
  exams: { fr: '/concours/', en: '/en/exams/', es: '/es/oposiciones/' },
  family: { fr: '/famille/', en: '/en/family/', es: '/es/familia/' },
  comparisons: { fr: '/comparatifs/', en: '/en/comparisons/', es: '/es/comparativas/' },
  privacy: { fr: '/privacy/', en: '/en/privacy/', es: '/es/privacy/', de: '/de/privacy/' },
  terms: { fr: '/terms/', en: '/en/terms/', es: '/es/terms/', de: '/de/terms/' },
  faq: { fr: '/faq/', en: '/en/faq/', es: '/es/faq/', de: '/de/faq/' },
  quiz: { fr: '/quiz/', en: '/en/quiz/', es: '/es/quiz/', de: '/de/quiz/' },
  play: { fr: '/jouer/', en: '/en/play/', es: '/es/jugar/', de: '/de/spielen/' },
  blog: { fr: '/blog/', en: '/en/blog/', es: '/es/blog/', de: '/de/blog/' },
  about: { fr: '/about/', en: '/en/about/', es: '/es/about/', de: '/de/about/' },
  credits: { fr: '/credits/', en: '/en/credits/', es: '/es/credits/', de: '/de/credits/' },
  widget: { fr: '/widget/', en: '/en/widget/', es: '/es/widget/', de: '/de/widget/' },
};

const PATH_TO_KEY = new Map<string, RouteKey>();
for (const [key, langs] of Object.entries(routes) as [RouteKey, PartialLangMap<string>][]) {
  for (const path of Object.values(langs)) {
    if (path) PATH_TO_KEY.set(path, key);
  }
}

export function getRouteKey(pathname: string): RouteKey | null {
  const normalized = pathname.endsWith('/') || pathname === '/' ? pathname : `${pathname}/`;
  return PATH_TO_KEY.get(normalized) ?? null;
}

/** URL de la page dans `lang`, ou `undefined` si elle n'existe pas dans cette langue. */
export function getRouteUrl(key: RouteKey, lang: Lang): string | undefined {
  return routes[key][lang];
}

/**
 * Versions linguistiques existantes de la page courante (langues absentes
 * omises), ou null si la page n'est pas dans la table.
 */
export function getHreflangUrls(pathname: string): Array<{ lang: Lang; path: string }> | null {
  const key = getRouteKey(pathname);
  if (!key) return null;
  const map = routes[key];
  return LANGS.flatMap((l) => (map[l] ? [{ lang: l, path: map[l]! }] : []));
}
