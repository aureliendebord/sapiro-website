// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Pool du bloc mixte de fin d'étape — la restriction aux 5 parcours de l'étape.
 *
 * Extrait de `app/quiz/[mode].tsx` : le grand mélange est une RÉVISION de ce
 * qu'on vient d'apprendre, pas un tirage dans tout le catalogue. Sans cette
 * restriction, l'examen d'étape (le seul bloc qui peut échouer) porterait sur
 * des entités jamais étudiées — c'est précisément le bug qu'avait le site web
 * avant l'extraction.
 *
 * La couche domaine ne connaît ni les assets ni le mode démo : les filtres de
 * plateforme (drapeaux disponibles, démo) sont composés via `base`.
 */
import type { PoolPreparer } from "@/domain/quiz/mixedQuestions";
import { getEntityPool } from "@/domain/quiz/entityPool";
import { getJourneyById } from "./catalog";
import { stageBlocks } from "./path";

const IDENTITY: PoolPreparer = (pool) => pool;

/**
 * Restreint chaque type d'entité aux entités des 5 parcours de l'étape, après
 * application du filtre `base` de la plateforme. Chaque type n'a qu'un
 * parcours par étape, donc l'intersection est directe.
 */
export function makeStageMixPool(stage: number, base: PoolPreparer = IDENTITY): PoolPreparer {
  const byType = new Map(
    stageBlocks(stage).map((id) => {
      const journey = getJourneyById(id)!;
      return [
        journey.entityType,
        new Set(getEntityPool(id, journey.entityType).map((e) => e.id)),
      ];
    }),
  );

  return (pool, type) => {
    const allowed = byType.get(type);
    const prepared = base(pool, type);
    return allowed ? prepared.filter((e) => allowed.has(e.id)) : prepared;
  };
}
