// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Mixed Questions Builder (thématique « Mixte »)
 *
 * Produit des quiz mélangeant les 5 thématiques (pays, personnages, œuvres,
 * animaux, monuments). Réutilise les générateurs existants :
 *  - `generateQuestions` (entièrement seedable) pour les quiz à 10 questions
 *    (défi du jour seedé par date, quiz classique aléatoire), 2 questions par
 *    thématique dans un ordre final mélangé ;
 *  - `generateSingleQuestion` (comme le mode révision) pour la survie, sur un
 *    pool hétérogène : chaque question tire ses distracteurs du MÊME type que
 *    l'entité posée.
 *
 * La couche domaine ne connaît ni les assets (drapeaux) ni le mode démo : les
 * filtres correspondants sont injectés par l'écran via `PoolPreparer`.
 */
import type { AnyFlagEntity, EntityType } from "@/types";
import { shuffleArray, shuffleWithSeed } from "@/utils/shuffle";

import { getEntityById, getFullPool } from "./entityPool";
import {
  generateQuestions,
  generateSingleQuestion,
  type QuizQuestion,
  type QuizQuestionType,
} from "./questionGenerator";

// Un type d'entité par thématique (ordre canonique). Le mode Mixte assemble un
// quiz à partir de ces 5 catalogues.
export const MIX_ENTITY_TYPES: EntityType[] = [
  "country",
  "figure",
  "artwork",
  "animal",
  "monument",
];

/**
 * Prépare un pool avant tirage (filtre démo + drapeaux disponibles côté pays).
 * Injecté par l'écran pour garder `domain/` indépendant de `assets/` et `lib/`.
 */
export type PoolPreparer = (pool: AnyFlagEntity[], type: EntityType) => AnyFlagEntity[];

const IDENTITY: PoolPreparer = (pool) => pool;

/**
 * Type de question forcé par entité : identification ("name") pour
 * figures/œuvres/animaux ; libre (nom ou secondaire) pour pays/monuments.
 * Miroir exact de la logique par défaut de `generateSingleQuestion`.
 */
function forceTypeFor(type: EntityType): "name" | undefined {
  return type === "figure" || type === "artwork" || type === "animal" ? "name" : undefined;
}

/**
 * Quiz mixte à `count` questions (10), équilibré : `count / 5` questions par
 * thématique, puis ordre final mélangé.
 *
 * @param seed - défini → tirage déterministe (défi du jour, même quiz mondial) ;
 *   undefined → tirage aléatoire (quiz classique rejouable).
 */
export function buildMixedQuestions(
  count: number,
  seed: number | undefined,
  language: string,
  prepare: PoolPreparer = IDENTITY,
): QuizQuestion[] {
  const perType = Math.max(1, Math.round(count / MIX_ENTITY_TYPES.length));
  const all: QuizQuestion[] = [];

  MIX_ENTITY_TYPES.forEach((type, i) => {
    const full = getFullPool(type);
    const pool = prepare(full, type);
    if (pool.length === 0) return;
    // Sels distincts par type pour que chaque thématique ait sa propre
    // sélection déterministe, sans corréler les 5 tirages entre eux.
    const qs = generateQuestions(
      pool,
      perType,
      4,
      seed !== undefined ? seed + i * 1000003 : undefined,
      forceTypeFor(type),
      full,
      language,
    );
    all.push(...qs);
  });

  const ordered = seed !== undefined ? shuffleWithSeed(all, seed + 7919) : shuffleArray(all);
  // Ré-attribue des ids séquentiels stables (keys de rendu / transitions).
  return ordered.slice(0, count).map((q, id) => ({ ...q, id }));
}

/** Pool de survie mixte : concaténation des 5 pools complets préparés. */
export function getMixedSurvivalPool(prepare: PoolPreparer = IDENTITY): AnyFlagEntity[] {
  const out: AnyFlagEntity[] = [];
  for (const type of MIX_ENTITY_TYPES) {
    out.push(...prepare(getFullPool(type), type));
  }
  return out;
}

/**
 * Clé stable d'une entité dans un pool hétérogène : "type:id". Les ids ne sont
 * pas garantis uniques entre catalogues → on préfixe par le type pour la
 * sauvegarde/reprise de survie mixte.
 */
export function mixedEntityKey(e: AnyFlagEntity): string {
  return `${e.type}:${e.id}`;
}

/** Inverse de `mixedEntityKey` : retrouve l'entité (ou undefined si disparue). */
export function entityFromMixedKey(key: string): AnyFlagEntity | undefined {
  const idx = key.indexOf(":");
  if (idx === -1) return undefined;
  const type = key.slice(0, idx) as EntityType;
  const id = key.slice(idx + 1);
  return getEntityById(type, id);
}

/**
 * Une question de survie mixte : choisit une entité du pool hétérogène (en
 * évitant la dernière posée), puis génère la question avec des distracteurs du
 * même type — même schéma que le mode révision.
 *
 * @param avoidEntityKey - clé "type:id" de la dernière entité posée, ou null.
 */
export function generateMixedSingleQuestion(
  pool: AnyFlagEntity[],
  avoidEntityKey: string | null,
  language: string,
  prepare: PoolPreparer = IDENTITY,
): QuizQuestion | null {
  if (pool.length === 0) return null;

  let candidates = pool;
  if (avoidEntityKey && pool.length > 1) {
    candidates = pool.filter((e) => mixedEntityKey(e) !== avoidEntityKey);
    if (candidates.length === 0) candidates = pool;
  }
  const entity = candidates[Math.floor(Math.random() * candidates.length)];

  return generateSingleQuestion(
    [entity],
    prepare(getFullPool(entity.type), entity.type),
    null,
    entity.type,
    forceTypeFor(entity.type),
    language,
  );
}

// ============================================
// Survie : pool d'items (entité + type de question)
// ============================================

/**
 * Un item de survie : une entité + le type de question qui lui est attaché.
 * Un pays donne DEUX items (nom du pays + capitale) pour être posé deux fois ;
 * les autres entités donnent un seul item. `forcedType` undefined = le
 * générateur choisit (nom/secondaire) au moment de la génération.
 */
export type SurvivalEntry = { entity: AnyFlagEntity; forcedType?: QuizQuestionType };

/**
 * Clé stable d'un item de survie : "type:id:forcedType". Distingue les deux
 * items d'un même pays (…:name vs …:secondary) et reste unique entre catalogues
 * (préfixe type). Sérialisable dans `SurvivalSession.remainingIds` (string[]).
 */
export function survivalEntryKey(entry: SurvivalEntry): string {
  return `${entry.entity.type}:${entry.entity.id}:${entry.forcedType ?? "auto"}`;
}

/**
 * Étend un pool d'entités en pool d'items de survie.
 * - `forced` défini (mode explicite, ex. « Quiz Drapeau ») → 1 item/entité de ce
 *   type, PAS de doublement ;
 * - sinon, un pays → 2 items (nom + capitale) : chaque drapeau est posé deux fois ;
 * - sinon → 1 item avec le type forcé naturel (`forceTypeFor`), comportement
 *   inchangé pour figures/œuvres/animaux/monuments.
 *
 * Fonctionne pour un pool mono-thème (survie géo) comme hétérogène (survie Mixte).
 */
export function expandSurvivalPool(
  pool: AnyFlagEntity[],
  forced?: QuizQuestionType,
): SurvivalEntry[] {
  const out: SurvivalEntry[] = [];
  for (const entity of pool) {
    if (forced) {
      out.push({ entity, forcedType: forced });
    } else if (entity.type === "country") {
      out.push({ entity, forcedType: "name" });
      out.push({ entity, forcedType: "secondary" });
    } else {
      out.push({ entity, forcedType: forceTypeFor(entity.type) });
    }
  }
  return out;
}

/**
 * Tire un item au hasard en évitant le MÊME drapeau (`entity.id`) que le
 * précédent — évite pays-puis-capitale du même drapeau d'affilée. Repli sur tout
 * le pool si le filtre ne laisse rien (dernier drapeau restant à deux items).
 */
export function pickSurvivalEntry(
  pool: SurvivalEntry[],
  avoidEntityId: string | null,
): SurvivalEntry | null {
  if (pool.length === 0) return null;
  let candidates = pool;
  if (avoidEntityId && pool.length > 1) {
    const filtered = pool.filter((e) => e.entity.id !== avoidEntityId);
    if (filtered.length > 0) candidates = filtered;
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Génère la question d'un item de survie. Distracteurs du MÊME type que
 * l'entité : mono-thème → `monoFullPool` (le pool du thème) ; Mixte → pool complet
 * préparé du type de l'entité. Le `forcedType` de l'item fixe pays vs capitale.
 */
export function generateSurvivalQuestionForEntry(
  entry: SurvivalEntry,
  isMix: boolean,
  monoFullPool: AnyFlagEntity[],
  language: string,
  prepare: PoolPreparer = IDENTITY,
): QuizQuestion | null {
  const fullPool = isMix
    ? prepare(getFullPool(entry.entity.type), entry.entity.type)
    : monoFullPool;
  return generateSingleQuestion(
    [entry.entity],
    fullPool,
    null,
    entry.entity.type,
    entry.forcedType,
    language,
  );
}
