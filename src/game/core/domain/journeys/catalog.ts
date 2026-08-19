// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Catalogue des journeys — source de verite unique.
 *
 * Chaque journey porte ses metadonnees ET son filtre metier.
 * domain/quiz/entityPool.ts execute ces filtres sans logique propre.
 */
import type { EntityType, ThemeType, JourneyFilter } from "@/types";

// ============================================
// Types
// ============================================

export type JourneyCategory =
  | "continent"
  | "thematic"
  | "history"
  | "organizations"
  | "figures-category"
  | "figures-era"
  | "figures-continent"
  | "art-movement"
  | "art-museum"
  | "art-sculpture"
  | "animals-class"
  | "animals-family"
  | "monuments-continent"
  | "monuments-type"
  | "monuments-subtype";

export interface JourneyDefinition {
  id: string;
  title: string;
  icon: string;
  entityCount: number;
  category: JourneyCategory;
  entityType: EntityType;
  theme: ThemeType;
  filter: JourneyFilter;
}

// ============================================
// Catalogue complet (88 journeys)
// ============================================

export const JOURNEY_CATALOG: JourneyDefinition[] = [
  // ============ GEOGRAPHIE ============
  // Continents (FREE)
  { id: "europe", title: "Europe", icon: "\u{1F1EA}\u{1F1FA}", entityCount: 44, category: "continent", entityType: "country", theme: "geography", filter: { continent: "Europe" } },
  { id: "asia", title: "Asie", icon: "\u{1F30F}", entityCount: 48, category: "continent", entityType: "country", theme: "geography", filter: { continent: "Asia" } },
  { id: "africa", title: "Afrique", icon: "\u{1F30D}", entityCount: 54, category: "continent", entityType: "country", theme: "geography", filter: { continent: "Africa" } },
  { id: "americas", title: "Am\u00E9riques", icon: "\u{1F30E}", entityCount: 35, category: "continent", entityType: "country", theme: "geography", filter: { continent: "Americas" } },
  { id: "oceania", title: "Oc\u00E9anie", icon: "\u{1F3DD}\uFE0F", entityCount: 14, category: "continent", entityType: "country", theme: "geography", filter: { continent: "Oceania" } },
  // Thematiques pays (PREMIUM)
  { id: "islands", title: "Pays insulaires", icon: "\u{1F3D6}\uFE0F", entityCount: 47, category: "thematic", entityType: "country", theme: "geography", filter: { tags: ["island"] } },
  { id: "landlocked", title: "Sans acc\u00E8s \u00E0 la mer", icon: "\u{1F3D4}\uFE0F", entityCount: 44, category: "thematic", entityType: "country", theme: "geography", filter: { tags: ["landlocked"] } },
  { id: "stars", title: "Drapeaux avec \u00E9toiles", icon: "\u2B50", entityCount: 72, category: "thematic", entityType: "country", theme: "geography", filter: { tags: ["stars"] } },
  { id: "big", title: "Pays de +50M habitants", icon: "\u{1F465}", entityCount: 28, category: "thematic", entityType: "country", theme: "geography", filter: { minPopulation: 50000000 } },
  { id: "micro", title: "Micro-\u00C9tats", icon: "🛖", entityCount: 12, category: "thematic", entityType: "country", theme: "geography", filter: { maxArea: 1000 } },
  // Empires historiques (PREMIUM)
  { id: "empires-all", title: "Tous les empires", icon: "\u{1F451}", entityCount: 29, category: "history", entityType: "empire", theme: "geography", filter: {} },
  { id: "empires-ancient", title: "Empires antiques", icon: "\u{1F3DB}\uFE0F", entityCount: 10, category: "history", entityType: "empire", theme: "geography", filter: { era: "ancient" } },
  { id: "empires-medieval", title: "Empires m\u00E9di\u00E9vaux", icon: "\u2694\uFE0F", entityCount: 10, category: "history", entityType: "empire", theme: "geography", filter: { era: "medieval" } },
  // Organisations internationales (PREMIUM)
  { id: "orgs-all", title: "Toutes les organisations", icon: "\u{1F310}", entityCount: 39, category: "organizations", entityType: "organization", theme: "geography", filter: {} },
  { id: "orgs-political", title: "Organisations politiques", icon: "\u{1F3DB}\uFE0F", entityCount: 9, category: "organizations", entityType: "organization", theme: "geography", filter: { orgCategory: "political" } },
  { id: "orgs-economic", title: "Organisations \u00E9conomiques", icon: "\u{1F4B0}", entityCount: 10, category: "organizations", entityType: "organization", theme: "geography", filter: { orgCategory: "economic" } },
  { id: "orgs-sports", title: "Organisations sportives", icon: "\u26BD", entityCount: 10, category: "organizations", entityType: "organization", theme: "geography", filter: { orgCategory: "sports" } },
  { id: "orgs-humanitarian", title: "Organisations humanitaires", icon: "\u2764\uFE0F", entityCount: 10, category: "organizations", entityType: "organization", theme: "geography", filter: { orgCategory: "humanitarian" } },

  // ============ HISTOIRE ============
  // Par categorie de personnages
  { id: "figures-political", title: "Leaders politiques", icon: "\u{1F3DB}\uFE0F", entityCount: 85, category: "figures-category", entityType: "figure", theme: "history", filter: { figureCategory: "political" } },
  { id: "figures-scientist", title: "Scientifiques", icon: "\u{1F52C}", entityCount: 55, category: "figures-category", entityType: "figure", theme: "history", filter: { figureCategory: "scientist" } },
  { id: "figures-artist", title: "Artistes", icon: "\u{1F3A8}", entityCount: 45, category: "figures-category", entityType: "figure", theme: "history", filter: { figureCategory: "artist" } },
  { id: "figures-writer", title: "\u00C9crivains & Philosophes", icon: "\u{1F4DA}", entityCount: 40, category: "figures-category", entityType: "figure", theme: "history", filter: { figureCategory: "writer" } },
  { id: "figures-military", title: "Militaires", icon: "\u2694\uFE0F", entityCount: 35, category: "figures-category", entityType: "figure", theme: "history", filter: { figureCategory: "military" } },
  { id: "figures-explorer", title: "Explorateurs", icon: "\u{1F9ED}", entityCount: 25, category: "figures-category", entityType: "figure", theme: "history", filter: { figureCategory: "explorer" } },
  { id: "figures-athlete", title: "Sportifs", icon: "\u{1F3C5}", entityCount: 40, category: "figures-category", entityType: "figure", theme: "history", filter: { figureCategory: "athlete" } },
  { id: "figures-entrepreneur", title: "Entrepreneurs", icon: "\u{1F4BC}", entityCount: 30, category: "figures-category", entityType: "figure", theme: "history", filter: { figureCategory: "entrepreneur" } },
  // Par epoque (PREMIUM)
  { id: "figures-ancient", title: "Antiquit\u00E9", icon: "🕰️", entityCount: 35, category: "figures-era", entityType: "figure", theme: "history", filter: { figureEra: "ancient" } },
  { id: "figures-medieval", title: "Moyen \u00C2ge", icon: "\u{1F3F0}", entityCount: 30, category: "figures-era", entityType: "figure", theme: "history", filter: { figureEra: "medieval" } },
  { id: "figures-renaissance", title: "Renaissance", icon: "\u{1F3AD}", entityCount: 25, category: "figures-era", entityType: "figure", theme: "history", filter: { figureEra: "renaissance" } },
  { id: "figures-modern", title: "\u00C9poque moderne", icon: "\u2699\uFE0F", entityCount: 80, category: "figures-era", entityType: "figure", theme: "history", filter: { figureEra: "modern" } },
  { id: "figures-contemporary", title: "Contemporain", icon: "📻", entityCount: 180, category: "figures-era", entityType: "figure", theme: "history", filter: { figureEra: "contemporary" } },
  // Par continent
  { id: "figures-europe", title: "C\u00E9l\u00E9brit\u00E9s d'Europe", icon: "🎻", entityCount: 150, category: "figures-continent", entityType: "figure", theme: "history", filter: { figureContinent: "europe" } },
  { id: "figures-north-america", title: "C\u00E9l\u00E9brit\u00E9s d'Am\u00E9rique du Nord", icon: "\u{1F5FD}", entityCount: 65, category: "figures-continent", entityType: "figure", theme: "history", filter: { figureContinent: "north_america" } },
  { id: "figures-south-america", title: "C\u00E9l\u00E9brit\u00E9s d'Am\u00E9rique du Sud", icon: "\u{1F334}", entityCount: 40, category: "figures-continent", entityType: "figure", theme: "history", filter: { figureContinent: "south_america" } },
  { id: "figures-asia", title: "C\u00E9l\u00E9brit\u00E9s d'Asie", icon: "\u{1F3EF}", entityCount: 45, category: "figures-continent", entityType: "figure", theme: "history", filter: { figureContinent: "asia" } },
  { id: "figures-africa", title: "C\u00E9l\u00E9brit\u00E9s d'Afrique", icon: "\u{1F30D}", entityCount: 40, category: "figures-continent", entityType: "figure", theme: "history", filter: { figureContinent: "africa" } },

  // ============ ART ============
  // Par mouvement artistique
  { id: "art-medieval", title: "Moyen \u00C2ge", icon: "\u{1F3F0}", entityCount: 30, category: "art-movement", entityType: "artwork", theme: "art", filter: { artMovement: "medieval" } },
  { id: "art-renaissance", title: "Renaissance", icon: "🪞", entityCount: 20, category: "art-movement", entityType: "artwork", theme: "art", filter: { artMovement: "renaissance" } },
  { id: "art-impressionism", title: "Impressionnisme", icon: "🌅", entityCount: 20, category: "art-movement", entityType: "artwork", theme: "art", filter: { artMovement: "impressionism" } },
  { id: "art-baroque", title: "Baroque", icon: "⛲", entityCount: 20, category: "art-movement", entityType: "artwork", theme: "art", filter: { artMovement: "baroque" } },
  { id: "art-post-impressionism", title: "Post-impressionnisme", icon: "\u{1F33B}", entityCount: 20, category: "art-movement", entityType: "artwork", theme: "art", filter: { artMovement: "post_impressionism" } },
  { id: "art-romanticism", title: "Romantisme", icon: "\u{1F30A}", entityCount: 15, category: "art-movement", entityType: "artwork", theme: "art", filter: { artMovement: "romanticism" } },
  { id: "art-surrealism", title: "Surr\u00E9alisme", icon: "\u{1F441}\uFE0F", entityCount: 15, category: "art-movement", entityType: "artwork", theme: "art", filter: { artMovement: "surrealism" } },
  { id: "art-neoclassicism", title: "N\u00E9oclassicisme", icon: "\u{1F3FA}", entityCount: 12, category: "art-movement", entityType: "artwork", theme: "art", filter: { artMovement: "neoclassicism" } },
  { id: "art-cubism", title: "Cubisme", icon: "🧩", entityCount: 12, category: "art-movement", entityType: "artwork", theme: "art", filter: { artMovement: "cubism" } },
  { id: "art-expressionism", title: "Expressionnisme", icon: "🌀", entityCount: 12, category: "art-movement", entityType: "artwork", theme: "art", filter: { artMovement: "expressionism" } },
  // Sculpture (PREMIUM)
  { id: "art-sculpture", title: "Sculpture", icon: "\u{1F5FF}", entityCount: 15, category: "art-sculpture", entityType: "artwork", theme: "art", filter: { artMedium: "sculpture" } },
  // Par grand musee (PREMIUM)
  { id: "art-louvre", title: "Mus\u00E9e du Louvre", icon: "🔺", entityCount: 15, category: "art-museum", entityType: "artwork", theme: "art", filter: { artMuseum: "louvre" } },
  { id: "art-orsay", title: "Mus\u00E9e d'Orsay", icon: "\u{1F3A8}", entityCount: 12, category: "art-museum", entityType: "artwork", theme: "art", filter: { artMuseum: "orsay" } },
  { id: "art-moma", title: "MoMA", icon: "\u{1F5FD}", entityCount: 10, category: "art-museum", entityType: "artwork", theme: "art", filter: { artMuseum: "moma" } },
  { id: "art-prado", title: "Mus\u00E9e du Prado", icon: "\u{1F1EA}\u{1F1F8}", entityCount: 10, category: "art-museum", entityType: "artwork", theme: "art", filter: { artMuseum: "prado" } },
  { id: "art-uffizi", title: "Galerie des Offices", icon: "\u{1F1EE}\u{1F1F9}", entityCount: 10, category: "art-museum", entityType: "artwork", theme: "art", filter: { artMuseum: "offices" } },

  // ============ NATURE ============
  // Par classe d'animaux
  { id: "animals-mammal", title: "Mammif\u00E8res", icon: "\u{1F981}", entityCount: 180, category: "animals-class", entityType: "animal", theme: "nature", filter: { animalClass: "mammal" } },
  { id: "animals-bird", title: "Oiseaux", icon: "\u{1F985}", entityCount: 120, category: "animals-class", entityType: "animal", theme: "nature", filter: { animalClass: "bird" } },
  { id: "animals-reptile", title: "Reptiles", icon: "\u{1F98E}", entityCount: 60, category: "animals-class", entityType: "animal", theme: "nature", filter: { animalClass: "reptile" } },
  { id: "animals-fish", title: "Poissons", icon: "\u{1F420}", entityCount: 70, category: "animals-class", entityType: "animal", theme: "nature", filter: { animalClass: "fish" } },
  { id: "animals-insect", title: "Insectes", icon: "\u{1F98B}", entityCount: 70, category: "animals-class", entityType: "animal", theme: "nature", filter: { animalClass: "insect" } },
  { id: "animals-amphibian", title: "Amphibiens", icon: "\u{1F438}", entityCount: 30, category: "animals-class", entityType: "animal", theme: "nature", filter: { animalClass: "amphibian" } },
  { id: "animals-crustacean", title: "Crustac\u00E9s", icon: "\u{1F980}", entityCount: 25, category: "animals-class", entityType: "animal", theme: "nature", filter: { animalClass: "crustacean" } },
  { id: "animals-mollusk", title: "Mollusques", icon: "\u{1F419}", entityCount: 24, category: "animals-class", entityType: "animal", theme: "nature", filter: { animalClass: "mollusk" } },
  { id: "animals-arachnid", title: "Arachnides", icon: "\u{1F577}\uFE0F", entityCount: 20, category: "animals-class", entityType: "animal", theme: "nature", filter: { animalClass: "arachnid" } },
  // Par famille (PREMIUM)
  { id: "animals-felidae", title: "Les f\u00E9lins", icon: "\u{1F431}", entityCount: 15, category: "animals-family", entityType: "animal", theme: "nature", filter: { animalFamily: "Felidae" } },
  { id: "animals-canidae", title: "Les canid\u00E9s", icon: "\u{1F43A}", entityCount: 9, category: "animals-family", entityType: "animal", theme: "nature", filter: { animalFamily: "Canidae" } },
  { id: "animals-ursidae", title: "Les ursid\u00E9s", icon: "\u{1F43B}", entityCount: 7, category: "animals-family", entityType: "animal", theme: "nature", filter: { animalFamily: "Ursidae" } },
  { id: "animals-cetacea", title: "Baleines & Dauphins", icon: "\u{1F40B}", entityCount: 12, category: "animals-family", entityType: "animal", theme: "nature", filter: { animalFamilies: ["Balaenopteridae", "Balaenidae", "Physeteridae", "Delphinidae", "Monodontidae", "Phocoenidae"] } },
  { id: "animals-accipitridae", title: "Les rapaces", icon: "\u{1F985}", entityCount: 11, category: "animals-family", entityType: "animal", theme: "nature", filter: { animalFamilies: ["Accipitridae", "Falconidae"] } },
  { id: "animals-psittacidae", title: "Les perroquets", icon: "\u{1F99C}", entityCount: 4, category: "animals-family", entityType: "animal", theme: "nature", filter: { animalFamily: "Psittacidae" } },

  // ============ MONUMENTS ============
  // Par continent (FREE)
  { id: "monuments-europe", title: "Monuments d'Europe", icon: "🧱", entityCount: 161, category: "monuments-continent", entityType: "monument", theme: "monument", filter: { monumentContinent: "europe" } },
  { id: "monuments-asia", title: "Monuments d'Asie", icon: "⛩️", entityCount: 110, category: "monuments-continent", entityType: "monument", theme: "monument", filter: { monumentContinent: "asia" } },
  { id: "monuments-africa", title: "Monuments d'Afrique", icon: "🌍", entityCount: 59, category: "monuments-continent", entityType: "monument", theme: "monument", filter: { monumentContinent: "africa" } },
  { id: "monuments-north-america", title: "Monuments d'Amérique du Nord", icon: "🗽", entityCount: 73, category: "monuments-continent", entityType: "monument", theme: "monument", filter: { monumentContinent: "north_america" } },
  { id: "monuments-south-america", title: "Monuments d'Amérique du Sud", icon: "⛰️", entityCount: 37, category: "monuments-continent", entityType: "monument", theme: "monument", filter: { monumentContinent: "south_america" } },
  { id: "monuments-oceania", title: "Monuments d'Océanie", icon: "🏝️", entityCount: 20, category: "monuments-continent", entityType: "monument", theme: "monument", filter: { monumentContinent: "oceania" } },
  // Par type (PREMIUM)
  { id: "monuments-religious", title: "Édifices religieux", icon: "🛐", entityCount: 126, category: "monuments-type", entityType: "monument", theme: "monument", filter: { monumentCategory: "religious" } },
  { id: "monuments-civil", title: "Édifices civils & culturels", icon: "🏛️", entityCount: 79, category: "monuments-type", entityType: "monument", theme: "monument", filter: { monumentCategory: "civil" } },
  { id: "monuments-ancient", title: "Sites antiques", icon: "🏺", entityCount: 77, category: "monuments-type", entityType: "monument", theme: "monument", filter: { monumentCategory: "ancient" } },
  { id: "monuments-palace", title: "Palais & châteaux", icon: "👑", entityCount: 46, category: "monuments-type", entityType: "monument", theme: "monument", filter: { monumentCategory: "palace" } },
  { id: "monuments-fortification", title: "Forteresses & remparts", icon: "🏯", entityCount: 42, category: "monuments-type", entityType: "monument", theme: "monument", filter: { monumentCategory: "fortification" } },
  { id: "monuments-commemorative", title: "Monuments commémoratifs", icon: "🗿", entityCount: 37, category: "monuments-type", entityType: "monument", theme: "monument", filter: { monumentCategory: "monument" } },
  { id: "monuments-tower", title: "Tours & gratte-ciels", icon: "🗼", entityCount: 30, category: "monuments-type", entityType: "monument", theme: "monument", filter: { monumentCategory: "tower" } },
  { id: "monuments-natural", title: "Sites naturels", icon: "🏞️", entityCount: 13, category: "monuments-type", entityType: "monument", theme: "monument", filter: { monumentCategory: "natural" } },
  { id: "monuments-funerary", title: "Monuments funéraires", icon: "🪦", entityCount: 10, category: "monuments-type", entityType: "monument", theme: "monument", filter: { monumentCategory: "funerary" } },
  // Par sous-type (PREMIUM)
  { id: "monuments-cathedrals", title: "Cathédrales du monde", icon: "⛪", entityCount: 42, category: "monuments-subtype", entityType: "monument", theme: "monument", filter: { monumentSubCategory: "cathedral" } },
  { id: "monuments-temples", title: "Temples du monde", icon: "🛕", entityCount: 27, category: "monuments-subtype", entityType: "monument", theme: "monument", filter: { monumentSubCategory: "temple" } },
  { id: "monuments-museums", title: "Grands musées", icon: "🖼️", entityCount: 22, category: "monuments-subtype", entityType: "monument", theme: "monument", filter: { monumentSubCategory: "museum" } },
  { id: "monuments-castles", title: "Châteaux", icon: "🏰", entityCount: 21, category: "monuments-subtype", entityType: "monument", theme: "monument", filter: { monumentSubCategory: "castle" } },
  { id: "monuments-mosques", title: "Mosquées", icon: "🕌", entityCount: 19, category: "monuments-subtype", entityType: "monument", theme: "monument", filter: { monumentSubCategory: "mosque" } },
  { id: "monuments-bridges", title: "Ponts emblématiques", icon: "🌉", entityCount: 14, category: "monuments-subtype", entityType: "monument", theme: "monument", filter: { monumentSubCategory: "bridge" } },
];

// ============================================
// Helpers
// ============================================

/** Filtrer les journeys par categorie */
export function getJourneysByCategory(category: JourneyCategory): JourneyDefinition[] {
  return JOURNEY_CATALOG.filter((j) => j.category === category);
}

/** Filtrer les journeys par theme */
export function getJourneysByTheme(theme: ThemeType): JourneyDefinition[] {
  return JOURNEY_CATALOG.filter((j) => j.theme === theme);
}

/** Trouver un journey par ID */
export function getJourneyById(id: string): JourneyDefinition | undefined {
  return JOURNEY_CATALOG.find((j) => j.id === id);
}
