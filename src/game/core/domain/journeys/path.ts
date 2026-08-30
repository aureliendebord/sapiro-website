// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Parcours linéaire (P1 du mode Aventure) — cf. docs/SPEC_MODE_AVENTURE.md
 *
 * Vocabulaire (attention, il a changé) :
 *  - un **bloc** = une partie sur un parcours du catalogue (10 questions) ;
 *  - une **étape** = 5 blocs thématiques (un par univers) + 1 **bloc mixte**
 *    de clôture à 20 questions, tirées uniquement des 5 parcours de l'étape.
 *
 * Progression : les 5 blocs thématiques d'une étape ouvrent son bloc mixte,
 * et le bloc mixte ouvre l'étape suivante. Le mixte n'est jamais un raccourci
 * — impossible de sauter les blocs pour enchaîner les étapes.
 *
 * La difficulté monte **à l'intérieur de chaque thème** d'une étape à l'autre
 * (mammifères → oiseaux → reptiles → poissons → insectes → arachnides). Elle ne
 * s'égalise pas entre thèmes : mesuré sur 180 j de parties, l'art (60 % de
 * précision) et les monuments (55 %) restent plus durs que la géographie (77 %)
 * et la nature (78 %). C'est assumé — chaque étape offre les 5 univers, le
 * joueur choisit son ordre à l'intérieur.
 */
import { getJourneyById } from "./catalog";
import type { EntityType, ThemeType } from "@/types";

// ============================================
// Constantes
// ============================================

/** Ordre canonique des univers dans une étape (même ordre que MIX_ENTITY_TYPES). */
export const THEME_ORDER: readonly ThemeType[] = [
  "geography",
  "history",
  "art",
  "nature",
  "monument",
];

/** Questions d'un bloc thématique, puis du bloc mixte de clôture. */
export const BLOCK_QUESTIONS = 10;
export const MIXED_QUESTIONS = 20;

/**
 * Erreurs tolérées sur le bloc MIXTE uniquement (décision 2026-08-15, sur les
 * données de la première semaine : 87 % d'échec au mélange, 2 joueurs sur 92
 * au-delà de l'étape 1). Les blocs thématiques n'échouent plus jamais : les
 * erreurs sont repassées en fin de bloc jusqu'à réussite (mécanique Duolingo,
 * cf. l'écran quiz) — le mélange reste le seul examen, donc le seul verrou
 * anti-speedrun du chemin.
 */
export const MIXED_MAX_MISTAKES = 5;

// ============================================
// Les étapes
// ============================================

/**
 * 6 étapes × 5 blocs. Chaque colonne suit l'ordre de THEME_ORDER, et chaque
 * ligne d'un même univers va du plus abordable au plus pointu. Les rangs de
 * géographie et d'histoire suivent la précision réellement mesurée en partie
 * (PostHog `game_completed`, 180 j) ; les autres suivent la logique du domaine,
 * faute de volume suffisant.
 */
export const PATH_STAGES: readonly (readonly string[])[] = [
  // Étape 1 — les grands ensembles familiers
  ["europe", "figures-political", "art-impressionism", "animals-mammal", "monuments-europe"],
  // Étape 2
  ["asia", "figures-contemporary", "art-renaissance", "animals-bird", "monuments-north-america"],
  // Étape 3
  ["americas", "figures-scientist", "art-baroque", "animals-reptile", "monuments-asia"],
  // Étape 4
  ["oceania", "figures-artist", "art-louvre", "animals-fish", "monuments-religious"],
  // Étape 5
  ["africa", "figures-medieval", "art-expressionism", "animals-insect", "monuments-ancient"],
  // Étape 6 — les sélections pointues
  ["islands", "figures-ancient", "art-cubism", "animals-arachnid", "monuments-cathedrals"],
  // Étape 7 — on ouvre d'autres angles : critères de pays, métiers, techniques
  ["big", "figures-athlete", "art-post-impressionism", "animals-amphibian", "monuments-palace"],
  // Étape 8
  ["landlocked", "figures-military", "art-romanticism", "animals-crustacean", "monuments-tower"],
  // Étape 9 — le bout du chemin
  ["micro", "figures-writer", "art-sculpture", "animals-mollusk", "monuments-bridges"],
];

export const STAGE_COUNT = PATH_STAGES.length;
export const BLOCKS_PER_STAGE = THEME_ORDER.length;

// ============================================
// Dosage de la difficulte : les premieres etapes en « nom seul »
// ============================================

/**
 * Nombre d'étapes de début de chemin où géographie et histoire ne demandent
 * QUE le nom de l'entité : le pays derrière le drapeau, le nom de la
 * personnalité derrière le portrait. Jamais la valeur secondaire (capitale,
 * nationalité), qui est une deuxième connaissance à apprendre par-dessus la
 * première et double la difficulté d'un bloc censé accueillir le joueur.
 * Au-delà, les blocs reprennent le mélange nom / valeur secondaire.
 */
export const NAME_ONLY_STAGES = 3;

/**
 * Types d'entités posées en « nom seul » à cette étape (vide au-delà). Note :
 * le bloc mixte pose DÉJÀ toujours les figures par leur nom (cf. `forceTypeFor`
 * dans mixedQuestions) — `figure` ici ne change que le bloc thématique.
 */
export function nameOnlyEntityTypes(stage: number): EntityType[] {
  return stage >= 0 && stage < NAME_ONLY_STAGES ? ["country", "figure"] : [];
}

/**
 * Ce bloc thématique du chemin ne doit-il poser que le nom de l'entité ?
 * Faux hors chemin, pour un bloc mixte (cf. `nameOnlyEntityTypes`, appliqué
 * type par type) ou pour un univers non concerné (art, nature, monuments).
 */
export function isNameOnlyBlock(blockId: string): boolean {
  if (isMixedBlockId(blockId)) return false;
  const journey = getJourneyById(blockId);
  if (!journey) return false;
  return nameOnlyEntityTypes(stageOfBlock(blockId)).includes(journey.entityType);
}

// ============================================
// Blocs mixtes
// ============================================

const MIXED_PREFIX = "mix-stage-";

/** Id du bloc mixte d'une étape. Ce n'est pas un parcours du catalogue. */
export function mixedBlockId(stage: number): string {
  return `${MIXED_PREFIX}${stage + 1}`;
}

export function isMixedBlockId(id: string): boolean {
  return id.startsWith(MIXED_PREFIX);
}

/** Étape d'un bloc mixte, -1 si l'id n'en est pas un. */
export function stageOfMixedBlock(id: string): number {
  if (!isMixedBlockId(id)) return -1;
  const n = Number.parseInt(id.slice(MIXED_PREFIX.length), 10);
  return Number.isFinite(n) && n >= 1 && n <= STAGE_COUNT ? n - 1 : -1;
}

// ============================================
// Helpers
// ============================================

/** Les 5 blocs thématiques d'une étape (vide hors bornes). */
export function stageBlocks(stage: number): string[] {
  if (stage < 0 || stage >= STAGE_COUNT) return [];
  return [...PATH_STAGES[stage]];
}

/** Les 6 blocs d'une étape : les 5 thématiques puis le mixte. */
export function allBlocksOfStage(stage: number): string[] {
  const blocks = stageBlocks(stage);
  return blocks.length ? [...blocks, mixedBlockId(stage)] : [];
}

/** Étape contenant ce bloc (thématique ou mixte), -1 si hors parcours. */
export function stageOfBlock(id: string): number {
  if (isMixedBlockId(id)) return stageOfMixedBlock(id);
  return PATH_STAGES.findIndex((blocks) => blocks.includes(id));
}

/** Ce parcours (ou bloc mixte) fait-il partie du chemin ? */
export function isPathBlock(id: string): boolean {
  return stageOfBlock(id) !== -1;
}

/** Tous les blocs du chemin, dans l'ordre de parcours. */
export const ALL_BLOCKS: readonly string[] = Array.from({ length: STAGE_COUNT }, (_, i) =>
  allBlocksOfStage(i),
).flat();

/** Nombre de questions d'un bloc. */
export function questionsFor(id: string): number {
  return isMixedBlockId(id) ? MIXED_QUESTIONS : BLOCK_QUESTIONS;
}

/**
 * Un résultat valide-t-il le bloc ? Thématique : toujours (la repasse de fin de
 * bloc garantit que chaque question finit juste). Mixte : au plus
 * MIXED_MAX_MISTAKES erreurs.
 */
export function blockCleared(blockId: string, score: number, total: number): boolean {
  if (!isMixedBlockId(blockId)) return true;
  return Math.max(0, total - score) <= MIXED_MAX_MISTAKES;
}

/** Blocs thématiques pointant vers un parcours inexistant (garde-fou de test). */
export function unknownPathBlocks(): string[] {
  return PATH_STAGES.flat().filter((id) => getJourneyById(id) === undefined);
}
