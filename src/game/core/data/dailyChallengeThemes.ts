// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import type { DailyChallengeTheme } from "@/types";

/**
 * Définition des thèmes quotidiens pour le Défi du jour
 *
 * Ces thèmes sont sélectionnés de façon déterministe basé sur la date.
 * Chaque jour, un thème différent est présenté aux utilisateurs.
 */
export const DAILY_CHALLENGE_THEMES: DailyChallengeTheme[] = [
  // ===============================
  // GÉOGRAPHIE - PAYS PAR CONTINENT
  // ===============================
  {
    id: "europe",
    name: "Drapeaux d'Europe",
    icon: "🇪🇺",
    themeCategory: "geography",
    entityType: "country",
    filter: { continent: "Europe" },
  },
  {
    id: "asia",
    name: "Drapeaux d'Asie",
    icon: "🌏",
    themeCategory: "geography",
    entityType: "country",
    filter: { continent: "Asia" },
  },
  {
    id: "africa",
    name: "Drapeaux d'Afrique",
    icon: "🌍",
    themeCategory: "geography",
    entityType: "country",
    filter: { continent: "Africa" },
  },
  {
    id: "americas",
    name: "Drapeaux des Amériques",
    icon: "🌎",
    themeCategory: "geography",
    entityType: "country",
    filter: { continent: "Americas" },
  },
  {
    id: "oceania",
    name: "Drapeaux d'Océanie",
    icon: "🏝️",
    themeCategory: "geography",
    entityType: "country",
    filter: { continent: "Oceania" },
  },

  // ===============================
  // GÉOGRAPHIE - PAYS THÉMATIQUES
  // ===============================
  {
    id: "islands",
    name: "Pays insulaires",
    icon: "🏖️",
    themeCategory: "geography",
    entityType: "country",
    filter: { tags: ["island"] },
  },
  {
    id: "landlocked",
    name: "Pays enclavés",
    icon: "🏔️",
    themeCategory: "geography",
    entityType: "country",
    filter: { tags: ["landlocked"] },
  },
  {
    id: "stars",
    name: "Drapeaux étoilés",
    icon: "⭐",
    themeCategory: "geography",
    entityType: "country",
    filter: { tags: ["stars"] },
  },
  {
    id: "capitals-europe",
    name: "Capitales d'Europe",
    icon: "🏛️",
    themeCategory: "geography",
    entityType: "country",
    filter: { continent: "Europe" },
    questionType: "capital",
  },
  {
    id: "capitals-asia",
    name: "Capitales d'Asie",
    icon: "🏯",
    themeCategory: "geography",
    entityType: "country",
    filter: { continent: "Asia" },
    questionType: "capital",
  },
  {
    id: "capitals-africa",
    name: "Capitales d'Afrique",
    icon: "🦁",
    themeCategory: "geography",
    entityType: "country",
    filter: { continent: "Africa" },
    questionType: "capital",
  },
  {
    id: "capitals-americas",
    name: "Capitales des Amériques",
    icon: "🗽",
    themeCategory: "geography",
    entityType: "country",
    filter: { continent: "Americas" },
    questionType: "capital",
  },
  {
    id: "world-tour",
    name: "Tour du monde",
    icon: "✈️",
    themeCategory: "geography",
    entityType: "country",
    filter: {},
  },

  // ===============================
  // HISTOIRE - PAR CATÉGORIE
  // ===============================
  {
    id: "figures-political",
    name: "Leaders politiques",
    icon: "🏛️",
    themeCategory: "history",
    entityType: "figure",
    filter: { figureCategory: "political" },
  },
  {
    id: "figures-scientist",
    name: "Scientifiques célèbres",
    icon: "🔬",
    themeCategory: "history",
    entityType: "figure",
    filter: { figureCategory: "scientist" },
  },
  {
    id: "figures-artist",
    name: "Artistes célèbres",
    icon: "🎨",
    themeCategory: "history",
    entityType: "figure",
    filter: { figureCategory: "artist" },
  },
  {
    id: "figures-writer",
    name: "Écrivains & Philosophes",
    icon: "📚",
    themeCategory: "history",
    entityType: "figure",
    filter: { figureCategory: "writer" },
  },
  {
    id: "figures-military",
    name: "Grands militaires",
    icon: "⚔️",
    themeCategory: "history",
    entityType: "figure",
    filter: { figureCategory: "military" },
  },
  {
    id: "figures-athlete",
    name: "Sportifs légendaires",
    icon: "🏅",
    themeCategory: "history",
    entityType: "figure",
    filter: { figureCategory: "athlete" },
  },

  // ===============================
  // HISTOIRE - PAR ÉPOQUE
  // ===============================
  {
    id: "figures-ancient",
    name: "Figures de l'Antiquité",
    icon: "🏺",
    themeCategory: "history",
    entityType: "figure",
    filter: { figureEra: "ancient" },
  },
  {
    id: "figures-medieval",
    name: "Figures du Moyen Âge",
    icon: "🏰",
    themeCategory: "history",
    entityType: "figure",
    filter: { figureEra: "medieval" },
  },
  {
    id: "figures-modern",
    name: "Figures modernes",
    icon: "⚙️",
    themeCategory: "history",
    entityType: "figure",
    filter: { figureEra: "modern" },
  },
  {
    id: "figures-contemporary",
    name: "Figures contemporaines",
    icon: "📱",
    themeCategory: "history",
    entityType: "figure",
    filter: { figureEra: "contemporary" },
  },

  // ===============================
  // HISTOIRE - PAR CONTINENT
  // ===============================
  {
    id: "figures-europe",
    name: "Célébrités d'Europe",
    icon: "🇪🇺",
    themeCategory: "history",
    entityType: "figure",
    filter: { figureContinent: "europe" },
  },
  {
    id: "figures-north-america",
    name: "Célébrités d'Amérique du Nord",
    icon: "🗽",
    themeCategory: "history",
    entityType: "figure",
    filter: { figureContinent: "north_america" },
  },
  {
    id: "figures-asia",
    name: "Célébrités d'Asie",
    icon: "🏯",
    themeCategory: "history",
    entityType: "figure",
    filter: { figureContinent: "asia" },
  },
  {
    id: "figures-africa",
    name: "Célébrités d'Afrique",
    icon: "🌍",
    themeCategory: "history",
    entityType: "figure",
    filter: { figureContinent: "africa" },
  },

  // ===============================
  // HISTOIRE - THÈMES SPÉCIAUX
  // ===============================
  {
    id: "figures-birth-country",
    name: "Pays de naissance",
    icon: "🌐",
    themeCategory: "history",
    entityType: "figure",
    filter: {},
    questionType: "figure_birth_country",
  },
  {
    id: "figures-nationality",
    name: "Nationalités célèbres",
    icon: "🎭",
    themeCategory: "history",
    entityType: "figure",
    filter: {},
    questionType: "figure_nationality",
  },

  // ===============================
  // ART - THÈMES GÉNÉRAUX
  // (Pas de filtre par mouvement pour garantir un pool suffisant de 10 questions)
  // ===============================
  {
    id: "art-paintings",
    name: "Peintures célèbres",
    icon: "🖌️",
    themeCategory: "art",
    entityType: "artwork",
    filter: { artMedium: "painting" },
  },
  {
    id: "art-sculptures",
    name: "Sculptures célèbres",
    icon: "🗿",
    themeCategory: "art",
    entityType: "artwork",
    filter: { artMedium: "sculpture" },
  },

  // ===============================
  // ART - THÈMES SPÉCIAUX
  // ===============================
  {
    id: "art-who-painted",
    name: "Qui a peint ?",
    icon: "🧑‍🎨",
    themeCategory: "art",
    entityType: "artwork",
    filter: {},
    questionType: "artwork_artist",
  },
  {
    id: "art-name-artwork",
    name: "Reconnaître l'œuvre",
    icon: "🔍",
    themeCategory: "art",
    entityType: "artwork",
    filter: {},
    questionType: "artwork_name",
  },
  {
    id: "art-tour",
    name: "Tour des musées",
    icon: "🏛️",
    themeCategory: "art",
    entityType: "artwork",
    filter: {},
  },

  // ===============================
  // NATURE - ANIMAUX
  // ===============================
  {
    id: "animals-all",
    name: "Tous les animaux",
    icon: "🌍",
    themeCategory: "nature",
    entityType: "animal",
    filter: {},
  },
  {
    id: "animals-mammal",
    name: "Mammifères",
    icon: "🦁",
    themeCategory: "nature",
    entityType: "animal",
    filter: { animalClass: "mammal" },
  },
  {
    id: "animals-bird",
    name: "Oiseaux",
    icon: "🦅",
    themeCategory: "nature",
    entityType: "animal",
    filter: { animalClass: "bird" },
  },
  {
    id: "animals-reptile",
    name: "Reptiles",
    icon: "🦎",
    themeCategory: "nature",
    entityType: "animal",
    filter: { animalClass: "reptile" },
  },
  {
    id: "animals-fish",
    name: "Poissons",
    icon: "🐟",
    themeCategory: "nature",
    entityType: "animal",
    filter: { animalClass: "fish" },
  },
  {
    id: "animals-insect",
    name: "Insectes",
    icon: "🦋",
    themeCategory: "nature",
    entityType: "animal",
    filter: { animalClass: "insect" },
  },

  // ===============================
  // MONUMENTS
  // ===============================
  {
    id: "monuments-all",
    name: "Tous les monuments",
    icon: "🏛️",
    themeCategory: "monument",
    entityType: "monument",
    filter: {},
  },
  {
    id: "monuments-europe",
    name: "Monuments d'Europe",
    icon: "🇪🇺",
    themeCategory: "monument",
    entityType: "monument",
    filter: { monumentContinent: "europe" },
  },
  {
    id: "monuments-asia",
    name: "Monuments d'Asie",
    icon: "🌏",
    themeCategory: "monument",
    entityType: "monument",
    filter: { monumentContinent: "asia" },
  },
  {
    id: "monuments-religious",
    name: "Édifices religieux",
    icon: "🛐",
    themeCategory: "monument",
    entityType: "monument",
    filter: { monumentCategory: "religious" },
  },
  {
    id: "monuments-ancient",
    name: "Sites antiques",
    icon: "🏺",
    themeCategory: "monument",
    entityType: "monument",
    filter: { monumentCategory: "ancient" },
  },
  {
    id: "monuments-tower",
    name: "Tours & gratte-ciels",
    icon: "🗼",
    themeCategory: "monument",
    entityType: "monument",
    filter: { monumentCategory: "tower" },
  },
];

/**
 * Nombre de thèmes disponibles
 */
export const THEMES_COUNT = DAILY_CHALLENGE_THEMES.length;

/**
 * Paliers de streak pour les badges du défi du jour
 */
export const DAILY_STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 200, 365, 500, 1000] as const;

/**
 * Configuration des badges de streak du défi du jour
 */
export const DAILY_STREAK_BADGES = [
  { milestone: 3, id: "daily_3", name: "Jeune pousse", icon: "🌱" },
  { milestone: 7, id: "daily_7", name: "En feu", icon: "🔥" },
  { milestone: 14, id: "daily_14", name: "Électrique", icon: "⚡" },
  { milestone: 30, id: "daily_30", name: "Diamant", icon: "💎" },
  { milestone: 60, id: "daily_60", name: "Champion", icon: "🏆" },
  { milestone: 100, id: "daily_100", name: "Royal", icon: "👑" },
  { milestone: 200, id: "daily_200", name: "Légendaire", icon: "🦁" },
  { milestone: 365, id: "daily_365", name: "Annuel", icon: "🌟" },
  { milestone: 500, id: "daily_500", name: "Astronaute", icon: "🚀" },
  { milestone: 1000, id: "daily_1000", name: "Immortel", icon: "🏅" },
] as const;
