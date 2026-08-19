import type { SessionResult } from "@game/lib/quizSession";
import { accentVars } from "@game/design/tokens";
import { t } from "@game/lib/i18n";

interface Props {
  result: SessionResult;
  /** Solde de tickets après la partie — pilote l'invitation à s'abonner. */
  ticketsLeft: number;
  isPremium: boolean;
  /** Le Défi du jour ne se rejoue pas : une seule partie par jour, comme l'app. */
  canReplay: boolean;
  onReplay: () => void;
  onHome: () => void;
  onSubscribe: () => void;
}

export function ResultScreen({
  result,
  ticketsLeft,
  isPremium,
  canReplay,
  onReplay,
  onHome,
  onSubscribe,
}: Props) {
  const ratio = result.totalQuestions > 0 ? result.score / result.totalQuestions : 0;
  const outOfTickets = !isPremium && ticketsLeft <= 0;

  return (
    <div style={{ ...accentVars(result.mode), display: "contents" } as React.CSSProperties}>
      <div className="result-screen">
        <span style={{ fontSize: 56 }}>{medalFor(ratio)}</span>

        <p className="result-score">
          {result.score}/{result.totalQuestions}
        </p>
        <p className="result-label">{commentFor(ratio, result.mode)}</p>

        <span className="result-xp">+{result.xp.totalXP} XP</span>

        {result.xp.perfectBonus > 0 && (
          <p className="result-label">
            {t("web.result.perfectBonus", { xp: result.xp.perfectBonus })}
          </p>
        )}

        <div className="result-actions">
          {canReplay && outOfTickets ? (
            <>
              <p className="game-notice">{t("web.result.outOfTickets")}</p>
              <button type="button" className="game-btn game-btn--block" onClick={onSubscribe}>
                {t("web.result.subscribe")}
              </button>
            </>
          ) : canReplay ? (
            <button type="button" className="game-btn game-btn--block" onClick={onReplay}>
              {t("web.result.replay")}
              {!isPremium && ticketsLeft > 0 && (
                <span style={{ fontWeight: 700, opacity: 0.85 }}> · {ticketsLeft} 🎟️</span>
              )}
            </button>
          ) : null}

          <button
            type="button"
            className="game-btn game-btn--ghost game-btn--block"
            onClick={onHome}
          >
            {t("web.result.home")}
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
  if (mode === "survival") return t("web.result.survivalDone");
  if (ratio === 1) return t("web.result.perfect");
  if (ratio >= 0.7) return t("web.result.great");
  if (ratio >= 0.5) return t("web.result.close");
  return t("web.result.keepGoing");
}
