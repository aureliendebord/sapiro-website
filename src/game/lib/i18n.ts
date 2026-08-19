/**
 * Traductions de l'interface de jeu.
 *
 * Les textes viennent des locales synchronisées depuis l'app (`game.json`,
 * `common.json`, `levels.json`) : mêmes libellés de question et mêmes termes
 * que sur mobile. La langue est imposée par la route Astro (/jouer, /en/play,
 * /es/jugar), pas détectée — le SEO du site pilote déjà la langue de la page.
 *
 * Volontairement minimal : pas de react-i18next côté web. Le jeu ne change
 * jamais de langue en cours de session, un module d'état simple suffit.
 */

export type GameLang = "fr" | "en" | "es";

type Dict = Record<string, unknown>;

const BUNDLES: Record<GameLang, () => Promise<Dict[]>> = {
  fr: async () => [
    (await import("@/locales/fr/game.json")).default,
    (await import("@/locales/fr/common.json")).default,
    (await import("@/locales/fr/levels.json")).default,
  ],
  en: async () => [
    (await import("@/locales/en/game.json")).default,
    (await import("@/locales/en/common.json")).default,
    (await import("@/locales/en/levels.json")).default,
  ],
  es: async () => [
    (await import("@/locales/es/game.json")).default,
    (await import("@/locales/es/common.json")).default,
    (await import("@/locales/es/levels.json")).default,
  ],
};

let current: GameLang = "fr";
let dict: Dict = {};

export async function loadLanguage(lang: GameLang): Promise<void> {
  const bundles = await BUNDLES[lang]();
  current = lang;
  // Les fichiers ont des racines disjointes (questions, modes, levels…),
  // un merge de surface suffit.
  dict = Object.assign({}, ...bundles);
}

export function getLanguage(): GameLang {
  return current;
}

/**
 * Résout une clé pointée (`questions.whatCountry`). Retourne la clé elle-même
 * si absente : un libellé manquant doit se voir, pas casser la partie.
 */
export function t(key: string, vars?: Record<string, string | number>): string {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Dict)) {
      return (acc as Dict)[part];
    }
    return undefined;
  }, dict);

  if (typeof value !== "string") return key;
  if (!vars) return value;

  return value.replace(/\{\{(\w+)\}\}/g, (_, name: string) =>
    name in vars ? String(vars[name]) : `{{${name}}}`,
  );
}
