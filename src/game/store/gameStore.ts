/**
 * État de jeu du joueur web — pendant allégé de `stores/gameStore.ts` de l'app.
 *
 * Porte ce dont le jeu web a besoin : XP et niveau, historique local des
 * parties, deck de révision (questions ratées), parcours terminés. Les données
 * lourdes de l'app (badges, ligues, session de survie sauvegardée) restent hors
 * périmètre de la V1 web.
 *
 * La synchronisation cloud passe par `lib/gameResults.ts` : ce store est l'état
 * local, `game_results` est la source de vérité partagée avec le mobile.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EntityType } from "@/types";

export interface ReviewEntry {
  entityId: string;
  entityType: EntityType;
  /** Nombre d'échecs consécutifs — pilote la priorité de révision. */
  misses: number;
  lastMissedAt: number;
}

export interface LocalGameRecord {
  id: string;
  mode: string;
  journey?: string;
  theme?: string;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  duration: number;
  playedAt: number;
}

interface GameState {
  xp: number;
  gamesPlayed: number;
  history: LocalGameRecord[];
  review: ReviewEntry[];
  completedJourneys: string[];
  lastDailyKey: string | null;

  recordGame: (record: LocalGameRecord) => void;
  addMiss: (entityId: string, entityType: EntityType) => void;
  clearMiss: (entityId: string) => void;
  markDailyDone: (dayKey: string) => void;
  reset: () => void;
}

/** Historique local plafonné : au-delà, l'intérêt est analytique et vit en base. */
const HISTORY_LIMIT = 100;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      gamesPlayed: 0,
      history: [],
      review: [],
      completedJourneys: [],
      lastDailyKey: null,

      recordGame: (record) =>
        set((s) => ({
          xp: s.xp + record.xpEarned,
          gamesPlayed: s.gamesPlayed + 1,
          history: [record, ...s.history].slice(0, HISTORY_LIMIT),
          completedJourneys:
            record.journey && !s.completedJourneys.includes(record.journey)
              ? [...s.completedJourneys, record.journey]
              : s.completedJourneys,
        })),

      addMiss: (entityId, entityType) =>
        set((s) => {
          const existing = s.review.find((r) => r.entityId === entityId);
          const entry: ReviewEntry = existing
            ? { ...existing, misses: existing.misses + 1, lastMissedAt: Date.now() }
            : { entityId, entityType, misses: 1, lastMissedAt: Date.now() };
          return {
            review: [entry, ...s.review.filter((r) => r.entityId !== entityId)],
          };
        }),

      clearMiss: (entityId) =>
        set((s) => ({ review: s.review.filter((r) => r.entityId !== entityId) })),

      markDailyDone: (dayKey) => set({ lastDailyKey: dayKey }),

      reset: () =>
        set({
          xp: 0,
          gamesPlayed: 0,
          history: [],
          review: [],
          completedJourneys: [],
          lastDailyKey: null,
        }),
    }),
    { name: "sapiro-web-game", version: 1 },
  ),
);

/**
 * Paliers de niveau — identiques à `LEVELS` de `stores/gameStore.ts` de l'app.
 * Les noms affichés viennent des locales (`levels.json`), pas d'ici.
 */
export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000] as const;

/** Numéro de niveau (1-10) pour un total d'XP — miroir de `levelForXP`. */
export function levelFromXp(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return level;
}

/** XP restant avant le niveau suivant, `null` au niveau maximum. */
export function xpToNextLevel(xp: number): number | null {
  const next = LEVEL_THRESHOLDS.find((threshold) => xp < threshold);
  return next === undefined ? null : next - xp;
}
