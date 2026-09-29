// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import type { GameResult } from "@/types";

/** Lundi 00:00 (heure locale) de la semaine qui contient `now`. */
export function startOfWeek(now: Date = new Date()): Date {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

/**
 * Parties terminées depuis lundi, pour l'objectif hebdo choisi à l'onboarding.
 * Le mode révision n'entre pas dans l'historique, donc ne compte pas ; le défi
 * du jour et le quiz d'intro comptent.
 */
export function quizzesThisWeek(
  history: Pick<GameResult, "playedAt">[],
  now: Date = new Date(),
): number {
  const from = startOfWeek(now).getTime();
  const to = now.getTime();
  return history.filter((game) => {
    const at = Date.parse(game.playedAt);
    return Number.isFinite(at) && at >= from && at <= to;
  }).length;
}
