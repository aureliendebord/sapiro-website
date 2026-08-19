// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
// Thématiques de l'application
export type ThemeType = "geography" | "history" | "art" | "nature" | "monument";

// Thématique élargie à « Mixte » (mix) : toutes les questions mélangées.
// `ThemeType` reste pur (5 valeurs) pour tout ce qui décrit du CONTENU (entités,
// parcours, sous-thèmes du défi, mapping entité↔thème). `AppTheme` sert à
// l'état/navigation/résultats (thème courant, GameResult, survie, classement) :
// une partie mixte n'a pas d'entityType unique, mais elle produit bien un thème.
export type AppTheme = ThemeType | "mix";

// Types d'entités
export type EntityType =
  | "country"
  | "region"
  | "empire"
  | "organization"
  | "figure"
  | "artwork"
  | "animal"
  | "monument";

// Catégories de personnages historiques
export type FigureCategory =
  | "political" // Leaders, présidents, rois
  | "scientist" // Scientifiques, inventeurs
  | "artist" // Peintres, sculpteurs, musiciens, cinéastes
  | "writer" // Écrivains, poètes, philosophes
  | "military" // Généraux, conquérants
  | "explorer" // Explorateurs, navigateurs
  | "athlete" // Sportifs célèbres
  | "entrepreneur"; // Industriels, innovateurs

// Époques historiques (pour personnages)
export type FigureEra =
  | "ancient" // -3000 à 500
  | "medieval" // 500 à 1500
  | "renaissance" // 1400 à 1600
  | "modern" // 1600 à 1900
  | "contemporary"; // 1900 à aujourd'hui

// Continents pour personnages
export type FigureContinent =
  | "europe"
  | "north_america"
  | "south_america"
  | "asia"
  | "africa"
  | "oceania";

// Genre pour personnages (pour QCM cohérents)
export type FigureGender = "male" | "female";

// ============================================
// TYPES POUR LES ŒUVRES D'ART
// ============================================

// Mouvements artistiques
export type ArtMovement =
  | "medieval" // 950-1450 (Roman, Gothique, Byzantin)
  | "renaissance" // 1400-1600
  | "mannerism" // 1520-1600
  | "baroque" // 1600-1750
  | "rococo" // 1700-1800
  | "neoclassicism" // 1750-1850
  | "romanticism" // 1800-1850
  | "realism" // 1840-1880
  | "impressionism" // 1860-1890
  | "post_impressionism" // 1880-1910
  | "symbolism" // 1880-1910
  | "art_nouveau" // 1890-1910
  | "expressionism" // 1905-1930
  | "fauvism" // 1905-1910
  | "cubism" // 1907-1920
  | "futurism" // 1909-1944
  | "dadaism" // 1916-1924
  | "surrealism" // 1924-1966
  | "abstract" // 1910-présent
  | "pop_art" // 1950-1970
  | "contemporary" // 1970-présent
  | "northern_renaissance" // 1430-1580 (Flamand, Allemand)
  | "dutch_golden_age"; // 1600-1700

// Type de médium artistique
export type ArtMedium = "painting" | "sculpture" | "fresco";

// Classes d'animaux
export type AnimalClass =
  | "mammal" // Mammifères
  | "bird" // Oiseaux
  | "reptile" // Reptiles
  | "amphibian" // Amphibiens
  | "fish" // Poissons
  | "insect" // Insectes
  | "arachnid" // Arachnides
  | "crustacean" // Crustacés
  | "mollusk"; // Mollusques

// Interface de base commune pour toutes les entités avec drapeaux
export interface FlagEntity {
  id: string;
  name: string;
  type: EntityType;
  flagPath: string; // Chemin vers le SVG (ex: "countries/fr")
  tags: string[];
}

// User Profile
export interface UserProfile {
  pseudo: string;
  avatar: string; // emoji
  // (Déprécié) Ancien badge Pro emoji. Plus affiché : le statut Sapiro+ est
  // désormais signalé par la bannière de carte. Champ conservé pour la compat
  // des profils existants (ignoré à l'affichage).
  proBadge?: string;
  createdAt: string;
}

// User Stats
export interface UserStats {
  totalXP: number;
  level: number;
  gamesPlayed: number;
  correctAnswers: number;
  totalAnswers: number;
  bestSurvivalStreak: number;
  currentDailyStreak: number;
  lastPlayedDate: string | null;
  // Daily Challenge specific stats
  dailyChallengeStreak: number;
  // Date du DERNIER défi du jour complété (tous thèmes confondus). Sert au
  // calcul du streak (engagement quotidien, indépendant du thème).
  lastDailyChallengeDate: string | null;
  // Date du dernier défi complété POUR CHAQUE thème. Utilisé pour afficher
  // "Fait aujourd'hui" sur le thème en cours uniquement — un défi en
  // géographie ne marque pas le défi en histoire comme fait.
  lastDailyChallengeByTheme?: Partial<Record<AppTheme, string>>;
  bestDailyChallengeScore: number;
}

// Badge
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "achievement" | "streak" | "mastery";
  condition: BadgeCondition;
  unlockedAt?: string;
}

export interface BadgeCondition {
  type:
    | "games_played"
    | "perfect_score"
    | "survival_streak"
    | "survival_complete"
    | "survival_perfect"
    | "daily_streak"
    | "continent_mastery"
    | "badge_count"
    | "daily_challenge_streak"
    | "daily_challenge_perfect";
  value: number;
  continent?: string;
}

// Game Mode type
export type GameMode = "classic" | "survival" | "daily" | "review";

// Game Result
export interface GameResult {
  id: string;
  mode: GameMode;
  journey?: string;
  // theme : sert au classement filtré par discipline. Optionnel pour rétrocompat
  // avec les game_results 1.6.0 qui n'avaient pas encore cette info. "mix" pour
  // les parties jouées en thématique Mixte.
  theme?: AppTheme;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  playedAt: string;
  duration: number; // seconds
}

// Partie survie sauvegardée (« enregistrer et continuer plus tard »).
// Une seule par utilisateur (le dernier save écrase). La progression est portée
// par `remainingIds` = le pool dynamique restant : les entités déjà réussies en
// sont retirées, donc elles ne réapparaissent jamais à la reprise.
export interface SurvivalSession {
  entityType: EntityType;
  journey: string;
  journeyTitle: string;
  questionType: string;
  theme: AppTheme;
  // IDs des entités pas encore correctement répondues (= pool à reprendre).
  // En mode Mixte, préfixées "type:id" (les ids ne sont pas uniques inter-pools).
  remainingIds: string[];
  totalQuestions: number;
  score: number;
  lives: number;
  elapsedSeconds: number;
  updatedAt: string; // ISO — arbitre le merge cloud (le plus récent gagne)
}

// Leaderboard
export type LeaderboardMetric = "xp" | "survival";
export type LeaderboardPeriod = "all" | "month" | "week";
// "all" = tous thèmes confondus ; les autres correspondent à AppTheme (mix inclus).
export type LeaderboardTheme = "all" | AppTheme;

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  pseudo: string;
  avatar: string;
  // Présent uniquement pour les abonnés Sapiro+ (peut être null/undefined).
  pro_badge?: string | null;
  value: number;
  is_me: boolean;
}

export interface MyRank {
  rank: number;
  value: number;
  total_players: number;
}

// Leagues (classement hebdomadaire façon Duolingo)
export type LeagueZone = "promote" | "stay" | "relegate";

// Une ligne de la standing de poule. Étend LeaderboardEntry (value = XP de la
// semaine) avec la zone de promotion/relégation calculée serveur.
export interface LeagueStandingEntry extends LeaderboardEntry {
  zone: LeagueZone;
}

// Résultat agrégé de get_my_league : ma poule de la semaine + sa standing live.
export interface MyLeague {
  season: number;
  endsAt: string; // ISO — fin de la semaine (clôture)
  tier: number; // 0=étoile … 4=galaxie
  pool: number;
  entries: LeagueStandingEntry[];
}

// Issue de la rotation de fin de semaine (écran de résultat).
export type LeagueOutcome = "promote" | "stay" | "relegate" | "dropped";

// Dernier résultat de ligue de l'appelant (get_latest_league_result).
export interface LeagueResult {
  endedSeason: number;
  fromTier: number;
  toTier: number | null; // null si sorti de l'échelle (dropped)
  outcome: LeagueOutcome;
  rank: number;
  poolSize: number;
  weeklyXp: number;
  endsAt: string; // ISO — clôture de la semaine concernée
}

// Une entrée du « mur des records » survie (top 10 par thème).
export interface SurvivalRecord {
  theme: AppTheme;
  rank: number;
  user_id: string;
  pseudo: string;
  avatar: string;
  pro_badge?: string | null;
  value: number;
}

// Country (étend FlagEntity)
export interface Country extends FlagEntity {
  type: "country";
  code: string; // ISO 3166-1 alpha-2
  capital: string;
  continent: string;
  region: string;
  population: number;
  area: number;
}

// Région française
export interface FrenchRegion extends FlagEntity {
  type: "region";
  regionCode: string; // Code INSEE
  prefecture: string; // Capitale régionale
  population: number;
  area: number;
  isOverseas: boolean; // DOM-TOM
}

// Empire historique
export interface HistoricalEmpire extends FlagEntity {
  type: "empire";
  peakYear: number; // Année d'apogée
  startYear: number;
  endYear: number;
  capital: string;
  peakArea: number; // Superficie max en km²
  era: "ancient" | "medieval" | "modern";
}

// Organisation internationale
export interface InternationalOrg extends FlagEntity {
  type: "organization";
  acronym: string; // ONU, UE, OTAN
  foundedYear: number;
  headquarters: string;
  memberCount: number;
  category: "political" | "economic" | "sports" | "humanitarian";
}

// Personnage historique célèbre
export interface HistoricalFigure extends FlagEntity {
  type: "figure";

  // Identité
  fullName: string; // Nom complet
  birthYear: number; // Année de naissance (négatif pour BCE)
  deathYear: number | null; // null si vivant
  gender: FigureGender; // Genre (pour QCM cohérents)

  // Lieu de naissance
  birthCountry: string; // Pays de naissance
  birthCity: string; // Ville de naissance

  // Classification
  nationality: string; // Nationalité principale
  continent: FigureContinent; // Continent pour parcours
  category: FigureCategory;
  era: FigureEra;
  professions: string[]; // Ex: ["Physicien", "Mathématicien"]

  // Quiz exclusions
  excludeFromNationalityQuiz?: boolean; // Exclure des questions de nationalité (ex: empires disparus)

  // Contexte
  knownFor: string; // Réalisation principale (courte)

  // Image (CDN)
  portraitUrl: string; // URL CDN complète
  imageSource: string; // URL Wikipedia pour attribution
  imageLicense: string; // Type de licence (CC-BY, Public Domain, etc.)
}

// Œuvre d'art
export interface Artwork extends FlagEntity {
  type: "artwork";

  // Œuvre
  title: string; // Titre original
  titleEn?: string; // Titre anglais si différent
  year: number | string; // Année ou période "1503-1519"
  medium: ArtMedium;
  movement: ArtMovement;

  // Artiste
  artist: string; // Nom court (ex: "Van Gogh")
  artistFullName: string; // Nom complet
  artistNationality: string; // Nationalité de l'artiste

  // Localisation actuelle
  museum: string; // Nom du musée
  museumCity: string; // Ville du musée
  museumCountry: string; // Pays du musée

  // Contexte
  description: string; // Courte description/anecdote

  // Image (CDN)
  imageUrl: string; // URL CDN complète
  imageSource: string; // URL Wikimedia Commons pour attribution
  imageLicense: string; // Type de licence (CC-BY, Public Domain, etc.)
}

// Animal
export interface Animal extends FlagEntity {
  type: "animal";

  // Classification
  animalClass: AnimalClass; // Classe (mammifère, oiseau, etc.)
  order: string; // Ordre taxonomique (latin)
  family: string; // Famille taxonomique (latin)

  // Identité
  scientificName: string; // Nom scientifique (latin)
  conservationStatus: string; // Statut UICN (LC, NT, VU, EN, CR, EW, EX)

  // Image (CDN)
  imageUrl: string; // URL CDN complète
  imageSource: string; // URL Wikimedia Commons pour attribution
  imageLicense: string; // Type de licence
}

// ============================================
// TYPES POUR LES MONUMENTS
// ============================================

// Continents pour monuments
export type MonumentContinent =
  | "europe"
  | "north_america"
  | "south_america"
  | "asia"
  | "africa"
  | "oceania";

// Type de monument (axe principal des parcours)
export type MonumentCategory =
  | "religious" // Édifices religieux
  | "palace" // Palais & châteaux
  | "fortification" // Forteresses & remparts
  | "funerary" // Monuments funéraires
  | "ancient" // Sites antiques & archéologiques
  | "civil" // Édifices civils & culturels
  | "monument" // Monuments commémoratifs
  | "tower" // Tours & gratte-ciels
  | "natural"; // Sites naturels

// Sous-type de monument (axe fin, obligatoire)
export type MonumentSubCategory =
  // religious
  | "cathedral"
  | "church"
  | "basilica"
  | "mosque"
  | "temple"
  | "synagogue"
  | "monastery"
  | "pagoda"
  | "shrine"
  // palace
  | "palace"
  | "castle"
  | "residence"
  // fortification
  | "fortress"
  | "citadel"
  | "city_wall"
  | "fortified_gate"
  // funerary
  | "pyramid"
  | "mausoleum"
  | "tomb"
  | "necropolis"
  // ancient
  | "ancient_city"
  | "amphitheatre"
  | "ancient_temple"
  | "aqueduct"
  | "archaeological_site"
  | "megalith"
  // civil
  | "museum"
  | "opera"
  | "theatre"
  | "library"
  | "station"
  | "bridge"
  | "town_hall"
  | "stadium"
  | "lighthouse"
  // monument
  | "statue"
  | "arch"
  | "obelisk"
  | "column"
  | "memorial"
  | "fountain"
  // tower
  | "observation_tower"
  | "clock_tower"
  | "bell_tower"
  | "minaret"
  | "skyscraper"
  // natural
  | "mountain"
  | "volcano"
  | "waterfall"
  | "canyon"
  | "cave"
  | "rock_formation"
  | "glacier"
  | "reef"
  | "lake"
  | "island"
  | "desert";

// Monument célèbre
export interface Monument extends FlagEntity {
  type: "monument";

  // Localisation
  country: string; // Pays (en français)
  city: string; // Ville
  continent: MonumentContinent;

  // Classification
  category: MonumentCategory; // Type principal
  subCategory: MonumentSubCategory; // Sous-type

  // Contexte
  year?: number | string; // Année/période de construction (absente pour les sites naturels)
  architect?: string; // Architecte ou bâtisseur (si connu)
  unesco?: boolean; // Inscrit au patrimoine mondial de l'UNESCO

  // Image (CDN)
  imageUrl: string; // URL CDN complète
  imageSource: string; // URL Wikimedia Commons pour attribution
  imageLicense: string; // Type de licence
}

// Données brutes d'un monument (les champs dérivés sont ajoutés par createMonument)
export interface MonumentInput {
  id: string;
  name: string;
  country: string;
  city: string;
  continent: MonumentContinent;
  category: MonumentCategory;
  subCategory: MonumentSubCategory;
  year?: number | string;
  architect?: string;
  unesco?: boolean;
}

// Union de toutes les entités
export type AnyFlagEntity =
  | Country
  | FrenchRegion
  | HistoricalEmpire
  | InternationalOrg
  | HistoricalFigure
  | Artwork
  | Animal
  | Monument;

// Types de questions pour Géographie
export type GeoQuestionType =
  | "name"
  | "capital"
  | "continent"
  | "population"
  | "year"
  | "headquarters";

// Types de questions pour Histoire (personnages)
export type FigureQuestionType =
  | "figure_name" // Qui est ce personnage ?
  | "figure_nationality" // Quelle est sa nationalité ?
  | "figure_birth_country" // Dans quel pays est-il né ?
  | "figure_birth_city" // Dans quelle ville est-il né ?
  | "figure_era" // À quelle époque a-t-il vécu ?
  | "figure_profession"; // Quelle était sa profession ?

// Types de questions pour Art (œuvres)
export type ArtQuestionType =
  | "artwork_artist" // Qui a créé cette œuvre ?
  | "artwork_name"; // Quel est le nom de cette œuvre ?

// Types de questions pour Nature (animaux)
export type AnimalQuestionType = "animal_name"; // Quel est cet animal ?

// Types de questions pour Monuments
export type MonumentQuestionType =
  | "monument_name" // Quel est ce monument ?
  | "monument_country"; // Dans quel pays se trouve ce monument ?

// Union de tous les types de questions
export type QuestionType =
  | GeoQuestionType
  | FigureQuestionType
  | ArtQuestionType
  | AnimalQuestionType
  | MonumentQuestionType;

// Question (généralisée pour toutes les entités)
export interface Question {
  id: string;
  entity: AnyFlagEntity;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
}

// Item du deck de révision : une réponse fausse capturée pour être rejouée
// (système type Leitner). box = palier de maîtrise.
export interface ReviewItem {
  entityId: string;
  entityType: EntityType;
  // Vocabulaire interne du moteur de quiz ("name" | "secondary"), miroir de
  // QuizQuestionType (domain/quiz) — littéral ici pour éviter un cycle d'import
  // types ↔ domain.
  type: "name" | "secondary";
  theme: ThemeType;
  box: number; // Leitner : 0 = à revoir … 2 = maîtrisé (sortira du deck en Phase 2)
  wrongCount: number;
  addedAt: string; // ISO
  lastSeenAt: string; // ISO
}

// Journey (étendu pour supporter tous les types d'entités)
export interface Journey {
  id: string;
  title: string;
  icon: string;
  category:
    | "continent"
    | "thematic"
    | "regions"
    | "history"
    | "organizations"
    | "figures"
    | "art-movement"
    | "art-museum"
    | "art-era"
    | "animals-class"
    | "animals-family"
    | "monuments-continent"
    | "monuments-type"
    | "monuments-subtype";
  entityType: EntityType;
  entityCount: number;
  filter: JourneyFilter;
  questionType?: QuestionType; // Type de question forcé (ex: figure_birth_country)
}

export interface JourneyFilter {
  continent?: string;
  tags?: string[];
  minPopulation?: number;
  maxPopulation?: number;
  maxArea?: number;
  isOverseas?: boolean; // Pour régions FR
  era?: "ancient" | "medieval" | "modern"; // Pour empires
  orgCategory?: "political" | "economic" | "sports" | "humanitarian"; // Pour organisations
  // Filtres pour personnages historiques
  figureCategory?: FigureCategory; // Catégorie de personnage
  figureEra?: FigureEra; // Époque du personnage
  figureContinent?: FigureContinent; // Continent de naissance
  // Filtres pour œuvres d'art
  artMovement?: ArtMovement; // Mouvement artistique
  artMedium?: ArtMedium; // Type de médium (peinture, sculpture)
  artMuseum?: string; // Musée spécifique
  // Filtres pour animaux
  animalClass?: AnimalClass;
  animalFamily?: string;
  animalFamilies?: string[]; // Pour journeys multi-familles (cetacea, accipitridae)
  // Filtres pour monuments
  monumentContinent?: MonumentContinent;
  monumentCategory?: MonumentCategory;
  monumentSubCategory?: MonumentSubCategory;
}

// Daily Challenge Theme
export interface DailyChallengeTheme {
  id: string;
  name: string;
  icon: string;
  themeCategory: ThemeType; // 'geography', 'history' ou 'art'
  entityType: EntityType;
  filter: DailyChallengeFilter;
  questionType?: QuestionType; // Type de question (défaut: 'name' ou 'figure_name')
}

// Daily Challenge Filter (similaire à JourneyFilter mais simplifié)
export interface DailyChallengeFilter {
  continent?: string;
  tags?: string[];
  isOverseas?: boolean;
  era?: "ancient" | "medieval" | "modern";
  orgCategory?: "political" | "economic" | "sports" | "humanitarian";
  // Filtres pour personnages historiques
  figureCategory?: FigureCategory;
  figureEra?: FigureEra;
  figureContinent?: FigureContinent;
  // Filtres pour œuvres d'art
  artMovement?: ArtMovement;
  artMedium?: ArtMedium;
  artMuseum?: string;
  // Filtres pour animaux
  animalClass?: AnimalClass;
  animalFamily?: string;
  animalFamilies?: string[]; // Pour journeys multi-familles (cetacea, accipitridae)
  // Filtres pour monuments
  monumentContinent?: MonumentContinent;
  monumentCategory?: MonumentCategory;
  monumentSubCategory?: MonumentSubCategory;
}

// Daily Challenge State
export interface DailyChallengeState {
  date: string; // YYYY-MM-DD
  theme: DailyChallengeTheme;
  seed: number;
  completed: boolean;
  score: number | null;
}

// Quiz State
export interface QuizState {
  mode: "classic" | "survival";
  journey?: Journey;
  questions: Question[];
  currentIndex: number;
  score: number;
  lives: number;
  startTime: number;
  answers: Answer[];
}

export interface Answer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // milliseconds
}

// Level
export interface Level {
  level: number;
  name: string;
  xpRequired: number;
}

// App State
export interface AppState {
  isOnboarded: boolean;
  profile: UserProfile | null;
  stats: UserStats;
  badges: Badge[];
  gameHistory: GameResult[];
}
