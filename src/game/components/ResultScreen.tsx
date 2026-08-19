import type { SessionResult } from "@game/lib/quizSession";
import { modeColor } from "@game/design/tokens";

interface Props {
  result: SessionResult;
  /** Solde de tickets après la partie — pilote l'invitation à s'abonner. */
  ticketsLeft: number;
  isPremium: boolean;
  onReplay: () => void;
  onHome: () => void;
  onSubscribe: () => void;
}

export function ResultScreen({
  result,
  ticketsLeft,
  isPremium,
  onReplay,
  onHome,
  onSubscribe,
}: Props) {
  const accent = modeColor(result.mode);
  const ratio = result.totalQuestions > 0 ? result.score / result.totalQuestions : 0;
  const outOfTickets = !isPremium && ticketsLeft <= 0;

  return (
    <div
      style={
        {
          "--accent": accent.primary,
          "--on-accent": accent.onPrimary,
          "--accent-tint": accent.tint,
          "--accent-deep": accent.tintDeep,
          display: "contents",
        } as React.CSSProperties
      }
    >
      <div className="result-screen">
        <span style={{ fontSize: 56 }}>{medalFor(ratio)}</span>

        <p className="result-score">
          {result.score}/{result.totalQuestions}
        </p>
        <p className="result-label">{commentFor(ratio, result.mode)}</p>

        <span className="result-xp">+{result.xp.totalXP} XP</span>

        {result.xp.perfectBonus > 0 && (
          <p className="result-label">Sans faute : +{result.xp.perfectBonus} XP de bonus</p>
        )}

        <div className="result-actions">
          {outOfTickets ? (
            <>
              <p className="game-notice">
                Tu as utilisé tes parties du jour. Reviens demain, ou passe en illimité.
              </p>
              <button type="button" className="game-btn game-btn--block" onClick={onSubscribe}>
                Jouer sans limite
              </button>
            </>
          ) : (
            <button type="button" className="game-btn game-btn--block" onClick={onReplay}>
              Rejouer
              {!isPremium && ticketsLeft > 0 && (
                <span style={{ fontWeight: 700, opacity: 0.85 }}> · {ticketsLeft} 🎟️</span>
              )}
            </button>
          )}

          <button
            type="button"
            className="game-btn game-btn--ghost game-btn--block"
            onClick={onHome}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}

/** Médaille selon la réussite — même palier que l'écran de résultat de l'app. */
function medalFor(ratio: number): string {
  if (ratio === 1) return "🏆";
  if (ratio >= 0.7) return "🥇";
  if (ratio >= 0.5) return "🥈";
  return "🥉";
}

function commentFor(ratio: number, mode: string): string {
  if (mode === "survival") return "Partie de survie terminée";
  if (ratio === 1) return "Parfait, rien à redire";
  if (ratio >= 0.7) return "Bien joué";
  if (ratio >= 0.5) return "Ça se joue de peu";
  return "Il y a de la marge de progression";
}
