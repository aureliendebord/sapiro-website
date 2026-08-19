// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Question Generator
 *
 * Source de verite unique pour la generation de questions.
 * Extrait de app/quiz/[mode].tsx pour etre testable sans UI.
 *
 * Localisation : depuis la Phase 0 i18n, `generateQuestions` et
 * `generateSingleQuestion` acceptent un paramètre `language` et résolvent
 * les entités via `resolveLocalizedEntity` avant de produire les
 * `correctAnswer` et `options`. Sans param ou avec "fr", comportement
 * identique au pré-Phase 0 (toutes les valeurs en français).
 */
import { shuffleArray, shuffleWithSeed, seededRandom } from "@/utils/shuffle";

import type {
  AnyFlagEntity,
  EntityType,
  Country,
  FrenchRegion,
  HistoricalEmpire,
  InternationalOrg,
  HistoricalFigure,
  Artwork,
  Animal,
  Monument,
} from "@/types";

import { resolveLocalizedEntity } from "@/hooks/useLocalizedEntity";
import { OPTIONS_COUNT } from "./constants";

// ============================================
// Types
// ============================================

export type QuizQuestionType = "name" | "secondary";

/**
 * Pour une figure historique, précise QUEL champ la valeur "secondary" désigne.
 * Une figure a plusieurs valeurs secondaires possibles (nationalité, pays de
 * naissance, ville de naissance) qui partagent le type "secondary" mais lisent
 * des champs différents — d'où ce sélecteur. Sans effet sur les autres types
 * d'entités, qui ont une seule valeur secondaire naturelle (capitale, titre…).
 */
export type FigureSecondaryField = "nationality" | "birthCountry" | "birthCity";

export interface QuizQuestion {
  id: number;
  entity: AnyFlagEntity;
  correctAnswer: string;
  options: string[];
  type: QuizQuestionType;
}

// ============================================
// Helpers
// ============================================

/**
 * Retourne la valeur secondaire d'une entite (capitale, prefecture, siege, nationalite, titre).
 * Pour une figure, `secondaryField` choisit le champ lu (nationalité par défaut).
 */
export function getSecondaryValue(
  entity: AnyFlagEntity,
  secondaryField: FigureSecondaryField = "nationality",
): string {
  switch (entity.type) {
    case "country":
      return (entity as Country).capital;
    case "region":
      return (entity as FrenchRegion).prefecture;
    case "empire":
      return (entity as HistoricalEmpire).capital;
    case "organization":
      return (entity as InternationalOrg).headquarters;
    case "figure": {
      const figure = entity as HistoricalFigure;
      if (secondaryField === "birthCountry") return figure.birthCountry;
      if (secondaryField === "birthCity") return figure.birthCity;
      return figure.nationality;
    }
    case "artwork":
      return (entity as Artwork).title;
    case "animal":
      return (entity as Animal).name;
    case "monument":
      return (entity as Monument).country;
    default:
      return "";
  }
}

/**
 * Retourne l'URL de l'image d'une entité selon son type (portrait pour les
 * figures, imageUrl pour œuvres/animaux/monuments, "" pour les entités à drapeau).
 * Centralise la résolution « où est l'image ? » — évite les casts `as X` dispersés
 * dans les écrans. Le narrowing par `entity.type` rend les casts inutiles.
 */
export function getEntityImageUrl(entity: AnyFlagEntity): string {
  switch (entity.type) {
    case "figure":
      return entity.portraitUrl;
    case "artwork":
    case "animal":
    case "monument":
      return entity.imageUrl;
    default:
      return "";
  }
}

/**
 * Retourne la bonne reponse pour une question donnee.
 * Pour les artworks : "name" = artiste, "secondary" = titre (via getSecondaryValue).
 */
function getCorrectAnswer(
  entity: AnyFlagEntity,
  type: QuizQuestionType,
  secondaryField: FigureSecondaryField = "nationality",
): string {
  if (entity.type === "artwork") {
    return type === "name" ? (entity as Artwork).artist : (entity as Artwork).title;
  }
  return type === "name" ? entity.name : getSecondaryValue(entity, secondaryField);
}

/**
 * Retourne la valeur d'un candidat pour les options de reponse.
 * Meme logique que getCorrectAnswer — factorise pour les wrong options.
 */
function getCandidateValue(
  entity: AnyFlagEntity,
  type: QuizQuestionType,
  secondaryField: FigureSecondaryField = "nationality",
): string {
  return getCorrectAnswer(entity, type, secondaryField);
}

/**
 * Vrai si l'entité ne doit pas apparaître dans une question de NATIONALITÉ
 * (ni comme cible, ni comme distracteur) : figures dont la nationalité renvoie
 * à une entité disparue (Empire romain, URSS, Yougoslavie…), marquées via
 * `excludeFromNationalityQuiz`. Cf. data/historicalFigures.ts +
 * data/codes/nationalities.ts.
 */
function isExcludedFromNationality(entity: AnyFlagEntity): boolean {
  return (
    entity.type === "figure" &&
    (entity as HistoricalFigure).excludeFromNationalityQuiz === true
  );
}

// ============================================
// Generation de questions (mode batch)
// ============================================

/**
 * Genere un lot de questions a partir d'un pool d'entites.
 *
 * @param entityPool - Pool d'entites disponibles
 * @param count - Nombre de questions a generer
 * @param optionsCount - Nombre d'options par question (defaut: 4)
 * @param seed - Seed pour generation deterministe (daily challenge)
 * @param forceQuestionType - Forcer un type de question ("name" ou "secondary")
 * @param fallbackPool - Pool de secours pour completer les options quand le pool filtre est trop petit
 * @param language - Code langue (fr/en/it/…). Toutes les entités sont résolues
 *   dans cette langue avant génération. Default "fr" préserve l'ancien
 *   comportement pour tout call site qui n'a pas encore migré.
 * @param secondaryField - Pour les figures : champ visé par une question
 *   "secondary" (nationalité par défaut, ou pays/ville de naissance).
 */
export function generateQuestions(
  entityPool: AnyFlagEntity[],
  count: number,
  optionsCount: number = OPTIONS_COUNT,
  seed?: number,
  forceQuestionType?: QuizQuestionType,
  fallbackPool?: AnyFlagEntity[],
  language: string = "fr",
  secondaryField: FigureSecondaryField = "nationality",
  preserveOrder: boolean = false,
): QuizQuestion[] {
  // Résout toutes les entités du pool dans la langue courante. On résout
  // l'ensemble du pool (et pas juste les `selected`) car `collectWrongOptions`
  // pioche dans tout le pool — les options doivent être dans la même langue
  // que la bonne réponse pour éviter des QCM cassés (ex: 1 réponse en italien
  // + 3 options en français).
  let localizedPool = entityPool.map((e) => resolveLocalizedEntity(e, language));
  const localizedFallback = fallbackPool?.map((e) => resolveLocalizedEntity(e, language));

  // Question de nationalité : on retire du tirage les figures dont la
  // nationalité renvoie à une entité disparue (sinon la bonne réponse serait
  // « Romain »/« Soviétique »). Uniquement quand toutes les questions portent
  // sur la nationalité (forceQuestionType "secondary" + champ nationality).
  if (forceQuestionType === "secondary" && secondaryField === "nationality") {
    localizedPool = localizedPool.filter((e) => !isExcludedFromNationality(e));
  }

  const random = seed !== undefined ? seededRandom(seed) : () => Math.random();
  // preserveOrder : on garde l'ordre du pool tel quel (quiz d'intro scripté
  // facile→difficile). Sinon, mélange classique (graine ou aléatoire).
  const shuffled = preserveOrder
    ? localizedPool
    : seed !== undefined
      ? shuffleWithSeed(localizedPool, seed)
      : shuffleArray(localizedPool);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((entity, index) => {
    const type: QuizQuestionType = forceQuestionType
      ? forceQuestionType
      : random() > 0.5
        ? "name"
        : "secondary";

    const correctAnswer = getCorrectAnswer(entity, type, secondaryField);
    const wrongOptions = collectWrongOptions(
      entity,
      type,
      localizedPool,
      correctAnswer,
      optionsCount - 1,
      seed !== undefined ? seed + index * 1000 : undefined,
      localizedFallback,
      secondaryField,
    );

    const optionsArray = [correctAnswer, ...wrongOptions];
    const options =
      seed !== undefined
        ? shuffleWithSeed(optionsArray, seed + index)
        : shuffleArray(optionsArray);

    return { id: index, entity, correctAnswer, options, type };
  });
}

// ============================================
// Generation d'une question unique (mode survie)
// ============================================

/**
 * Genere une seule question depuis un pool dynamique.
 * Utilise en mode survie ou le pool diminue a chaque bonne reponse.
 *
 * @param pool - Entites restantes (pool dynamique)
 * @param fullPool - Pool complet (pour les mauvaises options)
 * @param avoidEntityId - ID de la derniere entite posee (eviter repetition)
 * @param entityType - Type d'entite
 * @param forceQuestionType - Type de question force
 * @param language - Code langue (default "fr"). Résout les entités sources
 *   et de fallback avant la génération.
 * @param secondaryField - Pour les figures : champ visé par une question "secondary".
 */
export function generateSingleQuestion(
  pool: AnyFlagEntity[],
  fullPool: AnyFlagEntity[],
  avoidEntityId: string | null,
  entityType: EntityType,
  forceQuestionType?: QuizQuestionType,
  language: string = "fr",
  secondaryField: FigureSecondaryField = "nationality",
): QuizQuestion | null {
  if (pool.length === 0) return null;

  // Choisir une entite aleatoire en evitant la derniere posee
  let candidates = pool;
  if (avoidEntityId && pool.length > 1) {
    candidates = pool.filter((e) => e.id !== avoidEntityId);
  }
  const rawEntity = candidates[Math.floor(Math.random() * candidates.length)];
  const entity = resolveLocalizedEntity(rawEntity, language);

  // On localise le full pool une seule fois — utilisé pour les wrong options
  const localizedFullPool = fullPool.map((e) => resolveLocalizedEntity(e, language));

  // Determiner le type de question
  const forceType =
    forceQuestionType ??
    (entityType === "figure" || entityType === "artwork" || entityType === "animal" ? "name" : undefined);

  const type: QuizQuestionType = forceType
    ? forceType
    : Math.random() > 0.5
      ? "name"
      : "secondary";

  const correctAnswer = getCorrectAnswer(entity, type, secondaryField);
  const wrongOptions = collectWrongOptions(
    entity,
    type,
    localizedFullPool,
    correctAnswer,
    3,
    undefined,
    undefined,
    secondaryField,
  );
  const options = shuffleArray([correctAnswer, ...wrongOptions]);

  return { id: 0, entity, correctAnswer, options, type };
}

// ============================================
// Helpers internes
// ============================================

/**
 * Ordonne les candidats d'un monument par proximité, pour des distracteurs cohérents :
 * 1. même sous-type, 2. même type, 3. le reste.
 * Tri stable → l'ordre aléatoire est préservé à l'intérieur de chaque niveau, donc
 * le sous-type prime ; s'il n'a pas assez de monuments, on complète avec la catégorie.
 * Renvoie la liste inchangée pour les autres types d'entités.
 */
function prioritizeMonumentCandidates(
  candidates: AnyFlagEntity[],
  entity: AnyFlagEntity,
): AnyFlagEntity[] {
  if (entity.type !== "monument") return candidates;
  const target = entity as Monument;
  const tier = (e: AnyFlagEntity): number => {
    if (e.type !== "monument") return 3;
    const m = e as Monument;
    if (m.subCategory === target.subCategory) return 0;
    if (m.category === target.category) return 1;
    return 2;
  };
  return [...candidates].sort((a, b) => tier(a) - tier(b));
}

/**
 * Collecte les mauvaises options en evitant les doublons.
 * Si le pool filtre ne fournit pas assez d'options, complete avec le fallbackPool.
 */
function collectWrongOptions(
  entity: AnyFlagEntity,
  type: QuizQuestionType,
  pool: AnyFlagEntity[],
  correctAnswer: string,
  count: number,
  seed?: number,
  fallbackPool?: AnyFlagEntity[],
  secondaryField: FigureSecondaryField = "nationality",
): string[] {
  const wrongOptions: string[] = [];
  const usedValues = new Set<string>([correctAnswer]);

  let candidates = seed !== undefined ? shuffleWithSeed(pool, seed) : shuffleArray([...pool]);

  // Pour les figures historiques avec question "name", filtrer par genre
  if (entity.type === "figure" && type === "name") {
    const figureEntity = entity as HistoricalFigure;
    candidates = candidates.filter(
      (e) => e.type === "figure" && (e as HistoricalFigure).gender === figureEntity.gender,
    );
  }

  // Pour les animaux avec question "name", filtrer par classe (mammifère, poisson, oiseau...)
  // pour éviter de mélanger les catégories (ex: "Napoléon" le poisson dans une question
  // sur les mammifères).
  if (entity.type === "animal" && type === "name") {
    const animalEntity = entity as Animal;
    candidates = candidates.filter(
      (e) => e.type === "animal" && (e as Animal).animalClass === animalEntity.animalClass,
    );
  }

  // Question de nationalité : exclure les nationalités d'entités disparues des distracteurs.
  if (type === "secondary" && secondaryField === "nationality") {
    candidates = candidates.filter((e) => !isExcludedFromNationality(e));
  }

  // Pour les monuments : prioriser les distracteurs du même sous-type, puis du même type
  candidates = prioritizeMonumentCandidates(candidates, entity);

  for (const e of candidates) {
    if (wrongOptions.length >= count) break;
    if (e.id === entity.id) continue;

    const value = getCandidateValue(e, type, secondaryField);
    if (!usedValues.has(value)) {
      wrongOptions.push(value);
      usedValues.add(value);
    }
  }

  // Si pas assez d'options trouvees et qu'un fallback pool est disponible, completer.
  // On déclenche le fallback dès qu'il MANQUE des options (et pas seulement quand
  // le fallback est plus grand que le pool) : un pool filtré peut contenir beaucoup
  // d'entités mais peu de VALEURS uniques (ex: beaucoup d'œuvres du même artiste),
  // auquel cas il faut piocher ailleurs même à taille de pool égale.
  if (wrongOptions.length < count && fallbackPool && fallbackPool.length > 0) {
    let fallbackCandidates = seed !== undefined
      ? shuffleWithSeed(fallbackPool, seed + 999)
      : shuffleArray([...fallbackPool]);

    // Meme filtre par genre pour les figures historiques
    if (entity.type === "figure" && type === "name") {
      const figureEntity = entity as HistoricalFigure;
      fallbackCandidates = fallbackCandidates.filter(
        (e) => e.type === "figure" && (e as HistoricalFigure).gender === figureEntity.gender,
      );
    }

    // Meme filtre par classe pour les animaux
    if (entity.type === "animal" && type === "name") {
      const animalEntity = entity as Animal;
      fallbackCandidates = fallbackCandidates.filter(
        (e) => e.type === "animal" && (e as Animal).animalClass === animalEntity.animalClass,
      );
    }

    // Meme exclusion nationalité pour les distracteurs de secours
    if (type === "secondary" && secondaryField === "nationality") {
      fallbackCandidates = fallbackCandidates.filter((e) => !isExcludedFromNationality(e));
    }

    // Meme priorisation sous-type / type pour les monuments
    fallbackCandidates = prioritizeMonumentCandidates(fallbackCandidates, entity);

    for (const e of fallbackCandidates) {
      if (wrongOptions.length >= count) break;
      if (e.id === entity.id) continue;

      const value = getCandidateValue(e, type, secondaryField);
      if (!usedValues.has(value)) {
        wrongOptions.push(value);
        usedValues.add(value);
      }
    }
  }

  return wrongOptions;
}
