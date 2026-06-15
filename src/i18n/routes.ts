import type { Lang } from './index';

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
  | 'pricing'
  | 'privacy'
  | 'terms'
  | 'faq'
  | 'quiz'
  | 'blog'
  | 'credits';

export const routes: Record<RouteKey, Record<Lang, string>> = {
  home: { fr: '/', en: '/en/', es: '/es/' },
  art: { fr: '/art/', en: '/en/art/', es: '/es/arte/' },
  history: { fr: '/histoire/', en: '/en/history/', es: '/es/historia/' },
  geography: { fr: '/geographie/', en: '/en/geography/', es: '/es/geografia/' },
  nature: { fr: '/nature/', en: '/en/nature/', es: '/es/naturaleza/' },
  monuments: { fr: '/monuments/', en: '/en/monuments/', es: '/es/monumentos/' },
  exams: { fr: '/concours/', en: '/en/exams/', es: '/es/oposiciones/' },
  family: { fr: '/famille/', en: '/en/family/', es: '/es/familia/' },
  comparisons: { fr: '/comparatifs/', en: '/en/comparisons/', es: '/es/comparativas/' },
  pricing: { fr: '/pricing/', en: '/en/pricing/', es: '/es/pricing/' },
  privacy: { fr: '/privacy/', en: '/en/privacy/', es: '/es/privacy/' },
  terms: { fr: '/terms/', en: '/en/terms/', es: '/es/terms/' },
  faq: { fr: '/faq/', en: '/en/faq/', es: '/es/faq/' },
  quiz: { fr: '/quiz/', en: '/en/quiz/', es: '/es/quiz/' },
  blog: { fr: '/blog/', en: '/en/blog/', es: '/es/blog/' },
  credits: { fr: '/credits/', en: '/en/credits/', es: '/es/credits/' },
};

const PATH_TO_KEY = new Map<string, RouteKey>();
for (const [key, langs] of Object.entries(routes) as [RouteKey, Record<Lang, string>][]) {
  for (const path of Object.values(langs)) {
    PATH_TO_KEY.set(path, key);
  }
}

export function getRouteKey(pathname: string): RouteKey | null {
  const normalized = pathname.endsWith('/') || pathname === '/' ? pathname : `${pathname}/`;
  return PATH_TO_KEY.get(normalized) ?? null;
}

export function getRouteUrl(key: RouteKey, lang: Lang): string {
  return routes[key][lang];
}

export function getHreflangUrls(pathname: string): Record<Lang, string> | null {
  const key = getRouteKey(pathname);
  if (!key) return null;
  return routes[key];
}
