// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import { seededRandom } from "@/utils/shuffle";

// ============================================================
// Difficulté du bot (pur, testable). Le bot n'a pas de niveau fixe : on vise
// un taux de victoire qui dépend des trophées du joueur, puis on tire le niveau
// du bot autour de ce qui donne ce taux, face au niveau RÉCENT du joueur.
//
//   lancement  10 premiers duels   70 %  bots très variés
//   débutant   0-200 trophées      60 %  bots très variés
//   confirmé   200-900             53 %  variété moyenne
//   expert     900+                50 %  variété faible (bots forts)
//
// Garde-fou (hors lancement) : sur les 10 derniers duels, un écart de plus de
// 15 points à la cible décale la cible de 10 points dans l'autre sens — pas de
// longues séries de défaites, pas de promenade non plus.
// Seuls les bots sont réglés : les fantômes sont de vrais joueurs.
// ============================================================

export const DUEL_QUESTIONS = 10;
export const KICKOFF_DUELS = 10;
/** Niveau supposé d'un joueur sans historique (part de bonnes réponses). */
export const DEFAULT_SKILL = 0.6;
/** Poids de la dernière partie dans l'estimation du niveau (≈ 5 derniers duels). */
const SKILL_WEIGHT = 0.3;
const GUARD_WINDOW = 10;
const GUARD_MIN_GAMES = 5;
const GUARD_GAP = 0.15;
const GUARD_SHIFT = 0.1;
const BOT_MIN = 0.15;
const BOT_MAX = 0.97;

export type DifficultyBand = "kickoff" | "beginner" | "confirmed" | "expert";

export function difficultyBand(trophies: number, duelsPlayed: number): DifficultyBand {
  if (duelsPlayed < KICKOFF_DUELS) return "kickoff";
  if (trophies < 200) return "beginner";
  if (trophies < 900) return "confirmed";
  return "expert";
}

const BAND_TARGET: Record<DifficultyBand, number> = { kickoff: 0.7, beginner: 0.6, confirmed: 0.53, expert: 0.5 };
/** Écart-type du niveau du bot autour du niveau visé. */
const BAND_SPREAD: Record<DifficultyBand, number> = { kickoff: 0.15, beginner: 0.15, confirmed: 0.08, expert: 0.04 };

/** Nouvelle estimation du niveau après une partie (moyenne mobile exponentielle). */
export function updateSkill(skill: number, correct: number, total: number): number {
  if (total <= 0) return skill;
  return skill + SKILL_WEIGHT * (correct / total - skill);
}

/** Loi binomiale : P(X = k) pour k = 0..n. */
function binomial(n: number, p: number): number[] {
  const out: number[] = [];
  let c = 1;
  for (let k = 0; k <= n; k++) {
    out.push(c * p ** k * (1 - p) ** (n - k));
    c = (c * (n - k)) / (k + 1);
  }
  return out;
}

/** Probabilité que le joueur (niveau p) batte STRICTEMENT le bot (niveau b) sur n questions. */
export function winProbability(p: number, b: number, n = DUEL_QUESTIONS): number {
  const me = binomial(n, p);
  const bot = binomial(n, b);
  let win = 0;
  let botBelow = 0; // P(bot < k), cumulée au fil de k
  for (let k = 0; k <= n; k++) {
    win += me[k] * botBelow;
    botBelow += bot[k];
  }
  return win;
}

/** Niveau du bot qui donne `target` de victoires face à un joueur de niveau p (dichotomie). */
export function botLevelFor(p: number, target: number, n = DUEL_QUESTIONS): number {
  let lo = BOT_MIN;
  let hi = BOT_MAX;
  // winProbability décroît quand le bot monte.
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (winProbability(p, mid, n) > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Cible de victoire, garde-fou compris. `recent` = 1 victoire, 0 sinon, du plus ancien au plus récent. */
export function targetWinRate(band: DifficultyBand, recent: number[]): number {
  const base = BAND_TARGET[band];
  if (band === "kickoff") return base;
  const window = recent.slice(-GUARD_WINDOW);
  if (window.length < GUARD_MIN_GAMES) return base;
  const rate = window.reduce((a, b) => a + b, 0) / window.length;
  if (rate < base - GUARD_GAP) return Math.min(0.9, base + GUARD_SHIFT);
  if (rate > base + GUARD_GAP) return Math.max(0.2, base - GUARD_SHIFT);
  return base;
}

export interface BotDifficulty {
  band: DifficultyBand;
  target: number;
  /** Part de bonnes réponses du bot. */
  accuracy: number;
}

/** Niveau du bot pour ce duel. Déterministe pour une graine donnée. */
export function pickBotDifficulty(params: {
  trophies: number;
  duelsPlayed: number;
  skill: number;
  recent: number[];
  seed: number;
}): BotDifficulty {
  const band = difficultyBand(params.trophies, params.duelsPlayed);
  const target = targetWinRate(band, params.recent);
  const center = botLevelFor(params.skill, target);
  // Bruit gaussien (Box-Muller) : un bot plus fort ou plus faible que prévu.
  const random = seededRandom(params.seed ^ 0x5bd1e995);
  const u = Math.max(1e-9, random());
  const noise = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
  const accuracy = Math.min(BOT_MAX, Math.max(BOT_MIN, center + noise * BAND_SPREAD[band]));
  return { band, target, accuracy };
}
