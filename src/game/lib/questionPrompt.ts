/**
 * Libellé d'une question — port de `getQuestionText` de `app/quiz/[mode].tsx`.
 *
 * Les textes eux-mêmes viennent des locales synchronisées (`game.json`,
 * section `questions`) : traduire ici serait une divergence avec l'app. Seul
 * l'aiguillage type d'entité → clé est reproduit.
 */
import type { AnyFlagEntity, Artwork } from "@/types";
import type { QuizQuestion } from "@/domain/quiz/questionGenerator";
import { t } from "@game/lib/i18n";

/** Les œuvres se déclinent par medium : on ne « peint » pas une sculpture. */
function artworkKey(entity: AnyFlagEntity, kind: "artist" | "name"): string {
  const medium = (entity as Artwork).medium;
  const suffix = kind === "artist" ? "Artist" : "Name";
  if (medium === "sculpture") return `whatSculpture${suffix}`;
  if (medium === "fresco") return `whatFresco${suffix}`;
  return `whatPainting${suffix}`;
}

/**
 * Clé de libellé pour une question. En révision et en Mixte, les entités sont
 * hétérogènes : le libellé suit le type de l'entité courante.
 */
function promptKey(question: QuizQuestion): string {
  const type = question.entity.type;

  if (question.type === "name") {
    switch (type) {
      case "country":
        return "whatCountry";
      case "region":
        return "whatRegion";
      case "empire":
        return "whatEmpire";
      case "organization":
        return "whatOrganization";
      case "figure":
        return "whatFigure";
      case "artwork":
        return artworkKey(question.entity, "artist");
      case "animal":
        return "whatAnimal";
      case "monument":
        return "whatMonument";
      default:
        return "whatCountry";
    }
  }

  switch (type) {
    case "country":
      return "whatCapital";
    case "region":
      return "whatPrefecture";
    case "empire":
      return "whatFormerCapital";
    case "organization":
      return "whatHeadquarters";
    case "figure":
      return "whatFigureNationality";
    case "artwork":
      return artworkKey(question.entity, "name");
    case "animal":
      return "whatAnimal";
    case "monument":
      return "whatMonumentCountry";
    default:
      return "whatCapital";
  }
}

export function getQuestionPrompt(question: QuizQuestion): string {
  return t(`questions.${promptKey(question)}`);
}
