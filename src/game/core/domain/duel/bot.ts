// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import { seededRandom } from "@/utils/shuffle";
import type { AnswerRec, QuestionSpec } from "./questionSpec";

// ============================================================
// Bot : adversaire de secours quand le stock de fantômes est vide. Son niveau
// (part de bonnes réponses) est choisi par domain/duel/difficulty.ts. Un bot
// fort répond vite (1,5-3 s), un bot faible hésite (4-7 s) : la vitesse ne
// compte pas au score mais donne de la vraisemblance ; une question sur cinq,
// il hésite en plus (+1,5-3,5 s), pour qu'on l'attende parfois même en jouant
// vite. Déterministe pour une
// graine donnée (rejouable).
// ============================================================

export const BOT_ACCURACY = 0.7;

/** Délai de réponse médian (ms) pour un niveau donné : 5,5 s à 30 %, 2,25 s à 95 %. */
function medianMs(accuracy: number): number {
  const t = Math.min(1, Math.max(0, (accuracy - 0.3) / 0.65));
  return 5500 - t * 3250;
}

export function botAnswers(specs: QuestionSpec[], seed: number, accuracy = BOT_ACCURACY): AnswerRec[] {
  const random = seededRandom(seed);
  const median = medianMs(accuracy);
  return specs.map((spec) => {
    const ok = random() < accuracy;
    const base = median + (random() - 0.5) * 2500;
    const hesitation = random() < 0.2 ? 1500 + random() * 2000 : 0;
    const ms = Math.round(Math.min(9000, Math.max(1200, base + hesitation)));
    if (ok) return { i: spec.c, ok: true, ms };
    // Mauvaise réponse : une option autre que la bonne.
    const wrong = spec.o.map((_, i) => i).filter((i) => i !== spec.c);
    const i = wrong[Math.floor(random() * wrong.length)] ?? null;
    return { i, ok: false, ms };
  });
}
