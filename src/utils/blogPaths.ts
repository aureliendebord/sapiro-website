import { getCollection } from 'astro:content';
import type { Lang } from '../i18n';
import { LANGS } from '../i18n';

/**
 * Chemins statiques des articles d'une langue, avec les slugs de leurs
 * traductions (appariées par translationKey). Une traduction absente ou
 * canonicalisée ailleurs sort de la grappe hreflang. Partagé par les quatre
 * routes `[slug].astro` : l'allemand ne traduit qu'une partie des articles.
 */
export async function blogStaticPaths(lang: Lang) {
  const allPosts = await getCollection('blog');

  return allPosts
    .filter((p) => p.data.lang === lang)
    .map((post) => {
      const key = post.data.translationKey;
      const translationSlugs: Partial<Record<Lang, string>> = {};
      for (const l of LANGS) {
        if (l === lang) {
          translationSlugs[l] = post.data.urlSlug;
          continue;
        }
        const other = allPosts.find((p) => p.data.lang === l && p.data.translationKey === key);
        if (other && !other.data.canonicalTo) translationSlugs[l] = other.data.urlSlug;
      }
      return { params: { slug: post.data.urlSlug }, props: { post, translationSlugs } };
    });
}
