// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Review Questions Builder (Phase 2 — mode revision)
 *
 * Regenere des `QuizQuestion` a partir des `ReviewItem` captures en Phase 1
 * (reponses fausses). Pour chaque item on retrouve l'entite via son id, puis on
 * reutilise le generateur existant (`generateSingleQuestion`) pour produire la
 * question + ses distracteurs, en forcant le type d'origine de l'erreur.
 *
 * Les items dont l'entite a disparu du catalogue sont ignores (skip).
 */
import type { ReviewItem } from "@/types";

import { getEntityById, getFullPool } from "./entityPool";
import { generateSingleQuestion, type QuizQuestion } from "./questionGenerator";

/**
 * Construit la playlist de questions du mode revision.
 *
 * @param items - Items du deck a rejouer (deja filtres/tries par l'appelant)
 * @param language - Code langue pour la localisation des entites et options
 *
 * `secondaryField` est laisse a sa valeur par defaut ("nationality") : la Phase 1
 * ne stocke pas le champ secondaire exact, c'est un compromis assume.
 */
export function buildReviewQuestions(
  items: ReviewItem[],
  language: string,
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  for (const item of items) {
    const entity = getEntityById(item.entityType, item.entityId);
    // Entite disparue du catalogue → on saute cet item.
    if (!entity) continue;

    // Pool = l'entite cible seule ; fullPool = catalogue complet pour les
    // distracteurs. `item.type` ("name" | "secondary") est exactement le
    // QuizQuestionType attendu par le generateur, on le force tel quel.
    const question = generateSingleQuestion(
      [entity],
      getFullPool(item.entityType),
      null,
      item.entityType,
      item.type,
      language,
    );

    if (question) {
      // generateSingleQuestion renvoie toujours id: 0 ; on reattribue un id
      // sequentiel stable pour les keys de rendu et la transition de carte.
      questions.push({ ...question, id: questions.length });
    }
  }

  return questions;
}
