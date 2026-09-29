// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
// ============================================================
// Pays de l'adversaire de secours (bot) : tirage pondéré qui reflète la base
// réelle des joueurs (installs mobiles sur 90 jours, PostHog, 26/09/2026).
//
// Trois paliers :
//  - cœur : les 9 marchés principaux, poids individuels (FR abaissé de 44 % à
//    36 % pour ne pas rendre les adversaires monotones ; CH et AT ramenés à leur
//    niveau hors campagne Play AT+CH coupée le 06/09) ;
//  - second cercle : 15 pays à ~1 % chacun, tirés uniformément ;
//  - reste du monde : n'importe quel autre code ISO disposant d'un drapeau.
//
// Effet miroir : avant le tirage global, une chance sur quatre que le bot ait
// le pays du joueur — on croise plus souvent ses compatriotes.
// ============================================================

/** Poids en points sur 100 (le total des trois paliers vaut 100). */
export const CORE_COUNTRIES: readonly (readonly [string, number])[] = [
  ["FR", 36],
  ["ES", 7],
  ["GB", 6],
  ["US", 6],
  ["DE", 5],
  ["IT", 4],
  ["CH", 4],
  ["BE", 2],
  ["AT", 2],
];

export const SECOND_CIRCLE_COUNTRIES = [
  "IN", "MX", "DZ", "MA", "CI", "NL", "CA", "BR", "CO", "CL", "AR", "TR", "PT", "SN", "AU",
] as const;

/** Codes ISO alpha-2 des 197 drapeaux disponibles dans assets/flags/countries. */
export const ALL_FLAG_COUNTRIES = [
  "AD", "AE", "AF", "AG", "AL", "AM", "AO", "AR", "AT", "AU", "AZ", "BA", "BB", "BD", "BE", "BF",
  "BG", "BH", "BI", "BJ", "BN", "BO", "BR", "BS", "BT", "BW", "BY", "BZ", "CA", "CD", "CF", "CG",
  "CH", "CI", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO",
  "DZ", "EC", "EE", "EG", "ER", "ES", "ET", "FI", "FJ", "FM", "FR", "GA", "GB", "GD", "GE", "GH",
  "GM", "GN", "GQ", "GR", "GT", "GW", "GY", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IN", "IQ",
  "IR", "IS", "IT", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KZ",
  "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MG",
  "MH", "MK", "ML", "MM", "MN", "MR", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NE", "NG",
  "NI", "NL", "NO", "NP", "NR", "NZ", "OM", "PA", "PE", "PG", "PH", "PK", "PL", "PS", "PT", "PW",
  "PY", "QA", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SI", "SK", "SL", "SM",
  "SN", "SO", "SR", "SS", "ST", "SV", "SY", "SZ", "TD", "TG", "TH", "TJ", "TL", "TM", "TN", "TO",
  "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "US", "UY", "UZ", "VA", "VC", "VE", "VN", "VU", "WS",
  "XK", "YE", "ZA", "ZM", "ZW",
] as const;

const CORE_TOTAL = CORE_COUNTRIES.reduce((s, [, w]) => s + w, 0); // 72
const SECOND_CIRCLE_WEIGHT = 20;
const REST_OF_WORLD_WEIGHT = 8;
const TOTAL = CORE_TOTAL + SECOND_CIRCLE_WEIGHT + REST_OF_WORLD_WEIGHT; // 100

const MIRROR_PROBABILITY = 0.25;

/** Pays sans App Store ni Google Play : un adversaire de là-bas n'est pas crédible. */
const NOT_DISTRIBUTED = ["KP", "IR", "SY", "CU"] as const;

/** Régions du device sans drapeau propre, rattachées au pays dont elles dépendent (effet miroir). */
const REGION_TO_COUNTRY: Record<string, string> = {
  RE: "FR", GP: "FR", MQ: "FR", GF: "FR", YT: "FR", NC: "FR", PF: "FR", PM: "FR", BL: "FR", MF: "FR", WF: "FR",
  PR: "US", GU: "US", VI: "US", AS: "US", MP: "US",
  HK: "CN", MO: "CN",
  GI: "GB", IM: "GB", JE: "GB", GG: "GB", BM: "GB", KY: "GB", VG: "GB",
  AW: "NL", CW: "NL", SX: "NL",
  GL: "DK", FO: "DK",
  AX: "FI",
};

const REST_OF_WORLD = ALL_FLAG_COUNTRIES.filter(
  (c) =>
    !(NOT_DISTRIBUTED as readonly string[]).includes(c) &&
    !CORE_COUNTRIES.some(([code]) => code === c) &&
    !(SECOND_CIRCLE_COUNTRIES as readonly string[]).includes(c),
);

const pick = <T,>(list: readonly T[], rnd: () => number): T => list[Math.floor(rnd() * list.length)];

/**
 * Code ISO du pays du bot. `mine` = région du device du joueur (peut être
 * absente ou hors catalogue de drapeaux : l'effet miroir est alors ignoré ;
 * une région d'outre-mer est rattachée à son pays, ex. RE → FR).
 * `rnd` injectable pour les tests.
 */
export function pickBotCountry(mine?: string | null, rnd: () => number = Math.random): string {
  const raw = mine?.toUpperCase();
  const me = raw ? (REGION_TO_COUNTRY[raw] ?? raw) : undefined;
  if (me && (ALL_FLAG_COUNTRIES as readonly string[]).includes(me) && rnd() < MIRROR_PROBABILITY) {
    return me;
  }
  let r = rnd() * TOTAL;
  for (const [code, weight] of CORE_COUNTRIES) {
    if (r < weight) return code;
    r -= weight;
  }
  if (r < SECOND_CIRCLE_WEIGHT) return pick(SECOND_CIRCLE_COUNTRIES, rnd);
  return pick(REST_OF_WORLD, rnd);
}
