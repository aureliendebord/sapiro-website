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
import { calculateNewStreak, formatDateKey } from "@/utils/dailyChallenge";

export interface ReviewEntry {
  entityId: string;
  entityType: EntityType;
  /**
   * Type de question raté — la révision repose la MÊME question. Une entité
   * ratée sur le nom ET sur la capitale fait deux entrées distinctes, comme
   * le deck de l'app (clé `${entityId}:${type}`).
   */
  type: "name" | "secondary";
  /** Nombre d'échecs consécutifs — pilote la priorité de révision. */
  misses: number;
  lastMissedAt: number;
}

/** Clé d'identité d'une entrée de révision — même convention que l'app. */
function reviewKey(entityId: string, type: ReviewEntry["type"]): string {
  return `${entityId}:${type}`;
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

  /**
   * Statistiques — mêmes champs que `UserStats` de l'app (`stores/gameStore.ts`).
   * Elles conditionnent le bonus de série du Défi du jour, les badges, le profil
   * et le nudge de création de compte : sans elles, tout ce qui suit est aveugle.
   */
  correctAnswers: number;
  totalAnswers: number;
  bestSurvivalStreak: number;
  /** Série du Défi du jour, en jours consécutifs. */
  dailyStreak: number;
  /** Jours de JEU consécutifs, tous modes — la métrique des badges « Assidu ». */
  playStreak: number;
  lastPlayedDate: string | null;

  recordGame: (record: LocalGameRecord) => void;
  addMiss: (entityId: string, entityType: EntityType, type: ReviewEntry["type"]) => void;
  clearMiss: (entityId: string, type: ReviewEntry["type"]) => void;
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
      correctAnswers: 0,
      totalAnswers: 0,
      bestSurvivalStreak: 0,
      dailyStreak: 0,
      playStreak: 0,
      lastPlayedDate: null,

      recordGame: (record) =>
        set((s) => ({
          // Série de jours de jeu : même règle calendaire que le Défi
          // (calculateNewStreak, synchronisé), appliquée à toute partie.
          playStreak: calculateNewStreak(s.playStreak, s.lastPlayedDate),
          lastPlayedDate: formatDateKey(new Date()),
          xp: s.xp + record.xpEarned,
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

      addMiss: (entityId, entityType, type) =>
        set((s) => {
          const key = reviewKey(entityId, type);
          const existing = s.review.find((r) => reviewKey(r.entityId, r.type) === key);
          const entry: ReviewEntry = existing
            ? { ...existing, misses: existing.misses + 1, lastMissedAt: Date.now() }
            : { entityId, entityType, type, misses: 1, lastMissedAt: Date.now() };
          return {
            review: [entry, ...s.review.filter((r) => reviewKey(r.entityId, r.type) !== key)],
          };
        }),

      clearMiss: (entityId, type) =>
        set((s) => ({
          review: s.review.filter((r) => reviewKey(r.entityId, r.type) !== reviewKey(entityId, type)),
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
          xp: 0,
          gamesPlayed: 0,
          history: [],
          review: [],
          completedJourneys: [],
          lastDailyKey: null,
          correctAnswers: 0,
          totalAnswers: 0,
          bestSurvivalStreak: 0,
          dailyStreak: 0,
          playStreak: 0,
          lastPlayedDate: null,
        }),
    }),
    {
      name: "sapiro-web-game",
      version: 4,
      // Les états persistés en v1 n'ont pas les statistiques : on les crée à
      // zéro plutôt que de laisser `undefined` se propager dans les calculs.
      migrate: (persisted, version) => {
        const state = persisted as GameState;
        if (version >= 4) return state;
        return {
          ...state,
          ...(version < 2
            ? { correctAnswers: 0, totalAnswers: 0, bestSurvivalStreak: 0, dailyStreak: 0 }
            : {}),
          ...(version < 3 ? { playStreak: 0, lastPlayedDate: null } : {}),
          // v4 : le deck de révision gagne le type de question raté. Les
          // entrées existantes ne le connaissent pas → "name" (comportement
          // d'avant), le deck se requalifie au fil des parties.
          review: (state.review ?? []).map((r) => ({ ...r, type: r.type ?? "name" })),
        };
      },
    },
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

/**
 * Part du niveau courant déjà parcourue, en % (0-100). LA formule unique des
 * barres d'XP : les paliers sont non linéaires (100 → 4000 XP), toute
 * arithmétique locale du style `xp % 100` est fausse dès le niveau 2.
 */
export function levelProgress(xp: number): number {
  const level = levelFromXp(xp);
  if (level >= LEVEL_THRESHOLDS.length) return 100;
  const floor = LEVEL_THRESHOLDS[level - 1];
  const ceil = LEVEL_THRESHOLDS[level];
  return Math.max(0, Math.min(100, Math.round(((xp - floor) / (ceil - floor)) * 100)));
}
