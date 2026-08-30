import { useEffect } from "react";
import type { SessionResult } from "@game/lib/quizSession";
import { accentVars } from "@game/design/tokens";
import { t } from "@game/lib/i18n";
import { Icon } from "./ui/Icon";
import { Glyph } from "./ui/Glyph";
import { celebrate } from "@game/lib/celebrate";
import { play } from "@game/lib/sounds";

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

  // Célébration à l'arrivée, comme sur mobile — mais seulement quand il y a
  // quelque chose à célébrer : des confettis sur un 2/10 sonnent faux.
  useEffect(() => {
    if (ratio >= 0.7) {
      celebrate();
      play("victory");
    } else {
      play("level_up");
    }
    // Une seule fois par résultat : les dépendances sont figées au montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ ...accentVars(result.mode), display: "contents" } as React.CSSProperties}>
      <div className="result-screen">
        <Icon emoji={medalFor(ratio)} size={72} eager style={{ margin: "0 auto" }} />

        <p className="result-score">
          {result.score}/{result.totalQuestions}
        </p>
        <p className="result-label">{commentFor(ratio, result.mode)}</p>

        <span className="result-xp">+{result.xp.totalXP} XP</span>

        {bonusLines(result).length > 0 && (
          <ul className="result-bonuses">
            {bonusLines(result).map(({ key, xp }) => (
              <li key={key}>
                <span>{t(`web.result.${key}`)}</span>
                <strong>+{xp} XP</strong>
              </li>
            ))}
          </ul>
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
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    marginLeft: 8,
                    fontWeight: 700,
                    opacity: 0.9,
                  }}
                >
                  · {ticketsLeft} <Glyph name="ticket" size={16} />
                </span>
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

/**
 * Détail des bonus obtenus. Le calcul vient de `calculateXP` du cœur
 * synchronisé : on ne fait qu'afficher ce qu'il a déjà décidé.
 */
function bonusLines(result: SessionResult): { key: string; xp: number }[] {
  const { xp } = result;
  return [
    { key: "bonusPerfect", xp: xp.perfectBonus },
    { key: "bonusSurvival", xp: xp.survivalBonus },
    { key: "bonusSurvivalComplete", xp: xp.survivalCompleteBonus },
    { key: "bonusSurvivalPerfect", xp: xp.survivalPerfectBonus },
    { key: "bonusDailyStreak", xp: xp.dailyStreakBonus },
    { key: "bonusDailyPerfect", xp: xp.dailyPerfectBonus },
  ].filter((line) => line.xp > 0);
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
