// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import type { AnyFlagEntity, EntityType } from "@/types";
import { getEntityById } from "@/domain/quiz/entityPool";
import {
  getCorrectAnswer,
  type FigureSecondaryField,
  type QuizQuestion,
  type QuizQuestionType,
} from "@/domain/quiz/questionGenerator";
import { resolveLocalizedEntity } from "@/lib/content/localize";

// ============================================================
// Spec de question : une question sans texte, uniquement des ids d'entités.
// C'est ce qui rend un fantôme rejouable dans les 11 langues et tolérant aux
// mises à jour du contenu (une entité disparue → question sautée).
// Cf. docs/SPEC_DUEL.md §2.
// ============================================================

export interface QuestionSpec {
  /** entity id de la cible */
  e: string;
  t: EntityType;
  q: QuizQuestionType;
  /** figures : champ visé par une question « secondary » */
  f?: FigureSecondaryField;
  /** entity ids des options, DANS L'ORDRE AFFICHÉ */
  o: string[];
  /** index de la bonne réponse dans `o` */
  c: number;
}

export interface AnswerRec {
  /** index choisi dans `o`, null = pas répondu */
  i: number | null;
  ok: boolean;
  /** délai depuis l'affichage de la question */
  ms: number;
}

/**
 * Spec d'une question générée. `optionEntityIds` est posé par le générateur ;
 * une question qui ne l'a pas (ancien appelant, pool sans ids) n'est pas
 * enregistrable → null, la partie n'alimente pas le stock.
 */
export function toSpec(q: QuizQuestion, secondaryField?: FigureSecondaryField): QuestionSpec | null {
  const ids = q.optionEntityIds;
  if (!ids || ids.length !== q.options.length) return null;
  const c = q.options.indexOf(q.correctAnswer);
  if (c < 0) return null;
  // Le champ porté par la question fait foi (un fantôme rejoué puis
  // réenregistré garde « pays de naissance ») ; le paramètre est un repli.
  const field = q.secondaryField ?? secondaryField;
  return {
    e: q.entity.id,
    t: q.entity.type,
    q: q.type,
    ...(q.entity.type === "figure" && q.type === "secondary" && field ? { f: field } : {}),
    o: ids,
    c,
  };
}

/**
 * Reconstruit une question jouable dans `language` depuis son spec.
 * null si une entité manque du catalogue courant.
 */
export function questionFromSpec(spec: QuestionSpec, id: number, language: string): QuizQuestion | null {
  if (
    !spec ||
    typeof spec.e !== "string" ||
    !Array.isArray(spec.o) ||
    typeof spec.c !== "number" ||
    spec.c < 0 ||
    spec.c >= spec.o.length
  ) {
    return null;
  }
  const target = getEntityById(spec.t, spec.e);
  if (!target) return null;
  const optionEntities: AnyFlagEntity[] = [];
  for (const oid of spec.o) {
    const ent = getEntityById(spec.t, oid);
    if (!ent) return null;
    optionEntities.push(ent);
  }
  const field = spec.f ?? "nationality";
  const localizedTarget = resolveLocalizedEntity(target, language);
  const options = optionEntities.map((ent) =>
    getCorrectAnswer(resolveLocalizedEntity(ent, language), spec.q, field),
  );
  // Deux ids qui donnent le même texte dans cette langue rendraient le QCM
  // ambigu : on renonce à cette question plutôt que d'afficher deux fois la même réponse.
  if (new Set(options).size !== options.length) return null;
  return {
    id,
    entity: localizedTarget,
    correctAnswer: options[spec.c],
    options,
    type: spec.q,
    optionEntityIds: spec.o,
    ...(spec.f ? { secondaryField: spec.f } : {}),
  };
}

/** Rejoue une liste de specs ; renvoie les questions valides et les index sautés. */
export function questionsFromSpecs(
  specs: QuestionSpec[],
  language: string,
): { questions: QuizQuestion[]; skipped: number[] } {
  const questions: QuizQuestion[] = [];
  const skipped: number[] = [];
  specs.forEach((spec, i) => {
    const q = questionFromSpec(spec, questions.length, language);
    if (q) questions.push(q);
    else skipped.push(i);
  });
  return { questions, skipped };
}
