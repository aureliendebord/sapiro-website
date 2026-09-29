// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
// ============================================================
// Duel — points et trophées (pur, testable). Cf. docs/SPEC_DUEL.md §3.
// ============================================================

/** Durée d'une question en duel (ms). Au-delà : pas répondu. */
export const DUEL_QUESTION_MS = 10_000;

/**
 * Score d'une réponse : 1 si juste ET dans le temps, 0 sinon. Le duel se joue
 * au nombre de bonnes réponses (7 – 5), pas à la vitesse : simple à lire.
 */
export function answerScore(correct: boolean, ms: number): number {
  return correct && ms <= DUEL_QUESTION_MS ? 1 : 0;
}

/**
 * Attente après ta réponse avant de voir celle de l'adversaire : il répond à
 * son propre rythme. S'il n'a pas répondu dans le temps, on attend la fin du
 * chrono. 0 s'il avait déjà répondu.
 */
export function opponentWaitMs(
  opponent: { i: number | null; ms: number } | undefined,
  myMs: number,
): number {
  const answeredInTime = !!opponent && opponent.i !== null && opponent.ms <= DUEL_QUESTION_MS;
  const opponentAt = answeredInTime ? opponent.ms : DUEL_QUESTION_MS;
  return Math.max(0, opponentAt - myMs);
}

export type DuelOutcome = "win" | "loss" | "draw";

export function duelOutcome(myPoints: number, ghostPoints: number): DuelOutcome {
  if (myPoints > ghostPoints) return "win";
  if (myPoints < ghostPoints) return "loss";
  return "draw";
}

// Trophées : miroir exact de record_duel_result (SQL). Le serveur fait foi ;
// le client s'en sert pour afficher sans attendre le réseau.
export const TROPHY_GATES = [0, 200, 500, 900, 1400, 2000] as const;
const PROVISIONAL_GAMES = 20;

export function arenaIndex(trophies: number): number {
  let idx = 0;
  TROPHY_GATES.forEach((g, i) => {
    if (trophies >= g) idx = i;
  });
  return idx;
}

export function trophyDelta(
  outcome: DuelOutcome,
  before: number,
  gamesBefore: number,
): { delta: number; after: number; gateCrossed: boolean } {
  let raw = outcome === "win" ? 30 : outcome === "loss" ? -30 : 0;
  if (raw < 0 && gamesBefore < PROVISIONAL_GAMES) raw = 0;
  const gate = TROPHY_GATES[arenaIndex(before)];
  const after = Math.max(gate, before + raw);
  return { delta: after - before, after, gateCrossed: arenaIndex(after) > arenaIndex(before) };
}
