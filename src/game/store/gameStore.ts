/**
 * État de jeu du joueur web — pendant allégé de `stores/gameStore.ts` de l'app.
 *
 * Porte ce dont le jeu web a besoin : statistiques, série du Défi du jour,
 * historique local des parties, parcours terminés. L'XP, les niveaux, les
 * badges et le classement ont quitté l'app en 2.1.0 (place aux duels) : ils ont
 * quitté le web avec elle.
 *
 * La synchronisation cloud passe par `lib/gameResults.ts` : ce store est l'état
 * local, `game_results` est la source de vérité partagée avec le mobile.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { calculateNewStreak } from "@/utils/dailyChallenge";

export interface LocalGameRecord {
  id: string;
  mode: string;
  journey?: string;
  theme?: string;
  score: number;
  totalQuestions: number;
  duration: number;
  playedAt: number;
}

interface GameState {
  gamesPlayed: number;
  history: LocalGameRecord[];
  completedJourneys: string[];
  lastDailyKey: string | null;

  /**
   * Statistiques — mêmes champs que `UserStats` de l'app (`stores/gameStore.ts`).
   * Elles alimentent le profil et la série du Défi du jour.
   */
  correctAnswers: number;
  totalAnswers: number;
  bestSurvivalStreak: number;
  /** Série du Défi du jour, en jours consécutifs. */
  dailyStreak: number;

  recordGame: (record: LocalGameRecord) => void;
  markDailyDone: (dayKey: string) => void;
  reset: () => void;
}

/** Historique local plafonné : au-delà, l'intérêt est analytique et vit en base. */
const HISTORY_LIMIT = 100;

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      gamesPlayed: 0,
      history: [],
      completedJourneys: [],
      lastDailyKey: null,
      correctAnswers: 0,
      totalAnswers: 0,
      bestSurvivalStreak: 0,
      dailyStreak: 0,

      recordGame: (record) =>
        set((s) => ({
          gamesPlayed: s.gamesPlayed + 1,
          history: [record, ...s.history].slice(0, HISTORY_LIMIT),
          correctAnswers: s.correctAnswers + record.score,
          totalAnswers: s.totalAnswers + record.totalQuestions,
          // En survie, le score EST le nombre de questions enchaînées.
          bestSurvivalStreak:
            record.mode === "survival"
              ? Math.max(s.bestSurvivalStreak, record.score)
              : s.bestSurvivalStreak,
          completedJourneys:
            record.journey && !s.completedJourneys.includes(record.journey)
              ? [...s.completedJourneys, record.journey]
              : s.completedJourneys,
        })),

      /**
       * Défi du jour terminé : la série avance d'un jour si le précédent était
       * hier, repart à 1 sinon. Règle calculée par `calculateNewStreak` du
       * cœur synchronisé — la même que sur mobile.
       */
      markDailyDone: (dayKey) =>
        set((s) => ({
          lastDailyKey: dayKey,
          dailyStreak: calculateNewStreak(s.dailyStreak, s.lastDailyKey),
        })),

      reset: () =>
        set({
          gamesPlayed: 0,
          history: [],
          completedJourneys: [],
          lastDailyKey: null,
          correctAnswers: 0,
          totalAnswers: 0,
          bestSurvivalStreak: 0,
          dailyStreak: 0,
        }),
    }),
    {
      name: "sapiro-web-game",
      version: 5,
      // Les états persistés en v1 n'ont pas les statistiques : on les crée à
      // zéro plutôt que de laisser `undefined` se propager dans les calculs.
      migrate: (persisted, version) => {
        let state = (persisted ?? {}) as Record<string, unknown>;
        if (version < 2) {
          state = { ...state, correctAnswers: 0, totalAnswers: 0, bestSurvivalStreak: 0, dailyStreak: 0 };
        }
        // Le mode Révision a été retiré du jeu web : le champ `review` des
        // états persistés n'est plus lu (ignoré, pas purgé).
        if (version < 5) {
          // v5 : plus d'XP ni de niveaux, comme l'app 2.1.0 (sa migration
          // persist v3) ; la série de jours de jeu ne servait qu'aux badges.
          const { xp: _xp, playStreak: _ps, lastPlayedDate: _lp, ...rest } = state;
          state = rest;
        }
        return state as unknown as GameState;
      },
    },
  ),
);
