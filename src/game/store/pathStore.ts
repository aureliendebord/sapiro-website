/**
 * Progression du sentier Aventure — persistance web.
 *
 * Toutes les règles (étapes ouvertes, bloc jouable, bloc suivant, effet d'un
 * résultat) viennent de `domain/journeys/pathProgress.ts`, synchronisé depuis
 * l'app : le web et le mobile appliquent exactement le même sentier. Ce store
 * ne fait que garder l'état entre deux visites.
 *
 * Comme sur mobile, la progression est LOCALE : elle ne suit pas encore le
 * compte. C'est une limite connue des deux plateformes, pas un oubli du web.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { blockCleared } from "@/domain/journeys/path";
import {
  applyBlockResult,
  clearedCount,
  type BlockMap,
  type BlockOutcome,
} from "@/domain/journeys/pathProgress";

interface PathState {
  blocks: BlockMap;

  /** Enregistre le résultat d'un bloc et retourne ce qui vient de s'ouvrir. */
  recordResult: (p: { blockId: string; score: number; total: number }) => BlockOutcome;
  cleared: () => number;
  reset: () => void;
}

export const usePathStore = create<PathState>()(
  persist(
    (set, get) => ({
      blocks: {},

      recordResult: ({ blockId, score, total }) => {
        // Le barème vient du cœur : un bloc thématique se valide autrement
        // qu'un bloc mixte, et cette règle ne doit exister qu'à un endroit.
        const outcome = applyBlockResult(
          get().blocks,
          { blockId, score, total },
          blockCleared(blockId, score, total),
        );
        set({ blocks: outcome.blocks });
        return outcome;
      },

      cleared: () => clearedCount(get().blocks),
      reset: () => set({ blocks: {} }),
    }),
    { name: "sapiro-web-path", version: 1 },
  ),
);
