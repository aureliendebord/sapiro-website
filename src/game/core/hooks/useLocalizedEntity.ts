// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import type { AnyFlagEntity } from "@/types";
import { getLocalizedEntry } from "./useEntityDescriptions";
import {
  COUNTRY_CODES,
  FR_NAME_TO_COUNTRY_CODE,
  type LangCode,
} from "@/data/codes/countries";
import {
  NATIONALITY_CODES,
  FR_NAME_TO_NATIONALITY_CODE,
} from "@/data/codes/nationalities";
import {
  CAPITAL_CODES,
  FR_NAME_TO_CAPITAL_CODE,
} from "@/data/codes/capitals";

/**
 * Résout une valeur FR vers sa traduction si elle correspond à un code
 * connu (pays, capitale, nationalité). Sinon retourne la valeur d'origine.
 * Utilisé par `resolveLocalizedEntity` pour traiter les champs qui sont
 * encore en chaîne FR brute dans `data/*.ts` (en attendant la migration
 * vers codes ISO en Phase 8 cleanup).
 */
function pickLang(entry: Record<string, unknown>, lang: string, fallback: string): string {
  const v = entry[lang];
  return typeof v === "string" && v ? v : fallback;
}

function resolveCountryName(value: string, lang: string): string {
  const code = FR_NAME_TO_COUNTRY_CODE[value];
  if (!code) return value;
  const entry = COUNTRY_CODES[code];
  if (!entry) return value;
  return pickLang(entry as unknown as Record<string, unknown>, lang, entry.fr || value);
}

function resolveCapitalName(value: string, lang: string): string {
  const code = FR_NAME_TO_CAPITAL_CODE[value];
  if (!code) return value;
  const entry = CAPITAL_CODES[code];
  if (!entry) return value;
  return pickLang(entry as unknown as Record<string, unknown>, lang, entry.fr || value);
}

function resolveNationalityName(value: string, lang: string): string {
  const code = FR_NAME_TO_NATIONALITY_CODE[value];
  if (!code) return value;
  const entry = NATIONALITY_CODES[code];
  if (!entry) return value;
  return pickLang(entry as unknown as Record<string, unknown>, lang, entry.fr || value);
}

/**
 * Hook de résolution d'une entité dans la langue courante.
 *
 * Prend une entité brute issue de `data/*.ts` (où les champs textuels sont
 * encore en français) et retourne une copie avec les champs résolus dans
 * la langue active. Les champs non présents dans `locales/{lang}/{entity}.json`
 * retombent sur leur valeur FR d'origine — l'app n'est donc jamais cassée
 * pendant la migration progressive Phase 0 → Phase 7.
 *
 * Champs résolus aujourd'hui :
 * - `name`, `fullName`, `birthCity`, `professions`, `knownFor` (figures)
 * - `name` (animals)
 * - `name`, `city`, `architect` (monuments)
 * - `name`, `capital` (countries, empires)
 * - `name`, `headquarters` (organizations)
 * - `name`, `prefecture` (regions-fr)
 * - `title`, `artist`, `artistFullName`, `museum`, `museumCity`,
 *   `description` (artworks)
 *
 * Champs qui restent codés (birthCountry, nationality, museumCountry,
 * artistNationality, monument.country) seront résolus via les dictionnaires
 * `data/codes/{countries,nationalities}.ts` ajoutés dans Phase 0b — pour
 * l'instant ils gardent leur valeur FR brute.
 *
 * @example
 * const figure = useLocalizedEntity(rawFigure);
 * // figure.name = "Leonardo da Vinci" si lang === "it"
 * // figure.name = "Léonard de Vinci" sinon (fallback FR)
 */
export function useLocalizedEntity<E extends AnyFlagEntity>(entity: E): E {
  const { i18n } = useTranslation();

  return useMemo(() => {
    return resolveLocalizedEntity(entity, i18n.language || "fr");
  }, [entity, i18n.language]);
}

/**
 * Version impérative de `useLocalizedEntity` — utile dans les loops ou
 * dans les pipelines de génération de questions où on a besoin de
 * résoudre N entités selon la langue passée explicitement.
 *
 * À utiliser conjointement avec `useTranslation` ou en passant la
 * langue active depuis le contexte i18n.
 */
export function resolveLocalizedEntity<E extends AnyFlagEntity>(entity: E, lang: string): E {
  const cached = localizedCache.get(entity);
  if (cached && cached.lang === lang) return cached.value as E;
  const value = computeLocalizedEntity(entity, lang);
  localizedCache.set(entity, { lang, value });
  return value;
}

// Cache de résolution : la localisation est pure (entité source immuable des
// catalogues data/*.ts + locales importées statiquement). Le mode Mixte résout
// les 5 pools complets (~2700 entités, ×2 avec le fallback) à chaque partie —
// sans cache, tout est recloné/re-résolu à chaque lancement de quiz.
// WeakMap sur l'entité source ; un changement de langue invalide via `lang`.
const localizedCache = new WeakMap<AnyFlagEntity, { lang: string; value: AnyFlagEntity }>();

function computeLocalizedEntity<E extends AnyFlagEntity>(entity: E, lang: string): E {
  const entry = getLocalizedEntry(entity.type, entity.id, lang);

  // On clone pour ne pas muter l'objet source partagé entre toutes les langues
  const localized: AnyFlagEntity = { ...entity };

  // Champ commun (FlagEntity)
  if (entry?.name) localized.name = entry.name;

  // Champs spécifiques selon le type — TypeScript narrowing via switch
  switch (localized.type) {
    case "figure": {
      const figure = localized;
      if (entry?.fullName) figure.fullName = entry.fullName;
      if (entry?.birthCity) figure.birthCity = entry.birthCity;
      if (entry?.professions) figure.professions = entry.professions;
      if (entry?.knownFor) figure.knownFor = entry.knownFor;
      // Champs codes : résolus depuis data/codes/* via mapping FR (les
      // strings FR brutes de `data/historicalFigures.ts` sont matchées
      // contre FR_NAME_TO_COUNTRY_CODE / FR_NAME_TO_NATIONALITY_CODE).
      figure.birthCountry = resolveCountryName(figure.birthCountry, lang);
      figure.nationality = resolveNationalityName(figure.nationality, lang);
      break;
    }
    case "monument": {
      const monument = localized;
      if (entry?.city) monument.city = entry.city;
      if (entry?.architect) monument.architect = entry.architect;
      // country reste en FR dans data/monuments/*.ts — on résout au passage
      monument.country = resolveCountryName(monument.country, lang);
      break;
    }
    case "country": {
      const country = localized;
      if (entry?.capital) country.capital = entry.capital;
      break;
    }
    case "empire": {
      const empire = localized;
      if (entry?.capital) empire.capital = entry.capital;
      break;
    }
    case "organization": {
      const org = localized;
      if (entry?.headquarters) org.headquarters = entry.headquarters;
      break;
    }
    case "region": {
      const region = localized;
      if (entry?.prefecture) region.prefecture = entry.prefecture;
      break;
    }
    case "artwork": {
      const artwork = localized;
      if (entry?.title) artwork.title = entry.title;
      if (entry?.artist) artwork.artist = entry.artist;
      if (entry?.artistFullName) artwork.artistFullName = entry.artistFullName;
      if (entry?.museum) artwork.museum = entry.museum;
      if (entry?.museumCity) artwork.museumCity = entry.museumCity;
      if (entry?.description) artwork.description = entry.description;
      // Champs codes
      artwork.artistNationality = resolveNationalityName(artwork.artistNationality, lang);
      artwork.museumCountry = resolveCountryName(artwork.museumCountry, lang);
      break;
    }
    case "animal":
      // `name` déjà géré au-dessus, rien de plus pour l'instant
      break;
  }

  return localized as E;
}

// Ré-export du type LangCode pour les consommateurs
export type { LangCode };
