// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Progression du sentier Aventure — règles pures.
 *
 * Extrait de `stores/pathStore.ts`, qui mêlait ces règles à zustand, à
 * AsyncStorage et à PostHog. Le raisonnement (quelle étape est ouverte, quel
 * bloc est jouable, lequel vient ensuite) ne dépend d'aucune plateforme : il
 * vit ici pour que l'app ET le site web partagent le même code, chacun avec sa
 * propre persistance.
 *
 * Le store RN et le store web ne gardent donc que le stockage et la
 * télémétrie ; toute la logique passe par ce module.
 */
import {
  ALL_BLOCKS,
  STAGE_COUNT,
  allBlocksOfStage,
  isMixedBlockId,
  mixedBlockId,
  stageBlocks,
  stageOfBlock,
} from "./path";

export interface BlockProgress {
  cleared: boolean;
  attempts: number;
  failures: number;
}

export type BlockMap = Record<string, BlockProgress>;

const cleared = (blocks: BlockMap, id: string): boolean => blocks[id]?.cleared ?? false;

/** Les 5 blocs thematiques d'une etape sont-ils tous reussis ? */
export function computeStageCleared(blocks: BlockMap, stage: number): boolean {
  const thematic = stageBlocks(stage);
  return thematic.length > 0 && thematic.every((id) => cleared(blocks, id));
}

/**
 * Etapes ouvertes. L'etape N+1 s'ouvre uniquement quand le bloc mixte de N est
 * reussi — et ce mixte exige lui-meme ses 5 blocs, donc aucun raccourci.
 */
export function computeUnlockedStages(blocks: BlockMap): number {
  let unlocked = 1;
  while (unlocked < STAGE_COUNT && cleared(blocks, mixedBlockId(unlocked - 1))) {
    unlocked += 1;
  }
  return unlocked;
}

/**
 * Un bloc est-il jouable ? Il faut que son etape soit ouverte, et — pour le
 * bloc mixte — que les 5 blocs thematiques de l'etape soient reussis.
 */
export function isBlockUnlocked(blocks: BlockMap, blockId: string): boolean {
  const stage = stageOfBlock(blockId);
  if (stage < 0 || stage >= computeUnlockedStages(blocks)) return false;
  if (isMixedBlockId(blockId)) return computeStageCleared(blocks, stage);
  return true;
}

/**
 * Prochain bloc a jouer : le premier non reussi parmi les etapes ouvertes.
 * `null` quand tout le sentier est termine.
 */
export function nextBlockId(blocks: BlockMap): string | null {
  const unlocked = computeUnlockedStages(blocks);
  for (let stage = 0; stage < unlocked; stage += 1) {
    for (const id of allBlocksOfStage(stage)) {
      if (!cleared(blocks, id) && isBlockUnlocked(blocks, id)) return id;
    }
  }
  return null;
}

export function clearedCount(blocks: BlockMap): number {
  return ALL_BLOCKS.filter((id) => cleared(blocks, id)).length;
}

/** Etat d'un noeud du sentier, tel que l'UI doit le rendre. */
export type NodeStatus = "done" | "current" | "open" | "closed" | "locked";

export function nodeStatus(blocks: BlockMap, blockId: string, current: string | null): NodeStatus {
  if (cleared(blocks, blockId)) return "done";
  if (blockId === current) return "current";
  if (isBlockUnlocked(blocks, blockId)) return "open";
  // Etape ouverte mais bloc pas encore atteint (ou mixte en attente de ses 5).
  const stage = stageOfBlock(blockId);
  return stage >= 0 && stage < computeUnlockedStages(blocks) ? "closed" : "locked";
}

export interface BlockResult {
  blockId: string;
  score: number;
  total: number;
}

export interface BlockOutcome {
  blocks: BlockMap;
  failed: boolean;
  /** Le bloc mixte de l'etape vient-il de s'ouvrir ? */
  mixedUnlocked: boolean;
  /** Index de l'etape qui vient de s'ouvrir, sinon null. */
  unlockedStage: number | null;
}

/**
 * Applique le resultat d'un bloc et dit ce qui vient de changer.
 *
 * `isCleared` est fourni par l'appelant (via `blockCleared` de `path.ts`) pour
 * garder ce module independant du bareme.
 */
export function applyBlockResult(
  blocks: BlockMap,
  result: BlockResult,
  isCleared: boolean,
): BlockOutcome {
  const stage = stageOfBlock(result.blockId);
  const before = blocks[result.blockId] ?? { cleared: false, attempts: 0, failures: 0 };

  const next: BlockMap = {
    ...blocks,
    [result.blockId]: {
      // Une reussite ne se perd pas : un bloc deja valide reste valide meme
      // si le joueur le rejoue moins bien.
      cleared: before.cleared || isCleared,
      attempts: before.attempts + 1,
      failures: before.failures + (isCleared ? 0 : 1),
    },
  };

  const mixedWasOpen = stage >= 0 && computeStageCleared(blocks, stage);
  const mixedUnlocked = stage >= 0 && !mixedWasOpen && computeStageCleared(next, stage);

  const stagesBefore = computeUnlockedStages(blocks);
  const stagesAfter = computeUnlockedStages(next);

  return {
    blocks: next,
    failed: !isCleared,
    mixedUnlocked,
    unlockedStage: stagesAfter > stagesBefore ? stagesAfter - 1 : null,
  };
}
