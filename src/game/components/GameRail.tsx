import type { User } from "@supabase/supabase-js";
import { levelFromXp, xpToNextLevel } from "@game/store/gameStore";
import { isSignedIn } from "@game/lib/auth";
import { t } from "@game/lib/i18n";
import { Icon } from "./ui/Icon";
import { Glyph } from "./ui/Glyph";

export type RailSection = "home" | "journeys" | "board";

interface Props {
  xp: number;
  ticketsLeft: number;
  isPremium: boolean;
  user: User | null;
  current: RailSection;
  onNavigate: (section: RailSection) => void;
  onAccount: () => void;
  onSubscribe: () => void;
}

/**
 * Colonne d'identité et de navigation du jeu.
 *
 * Recueille ce que la V1 entassait dans une barre supérieure de 460 px : niveau,
 * progression d'XP, solde de parties, accès au compte. Sur desktop elle est
 * collante, sur mobile elle devient une barre horizontale défilante.
 */
export function GameRail({
  xp,
  ticketsLeft,
  isPremium,
  user,
  current,
  onNavigate,
  onAccount,
  onSubscribe,
}: Props) {
  const level = levelFromXp(xp);
  const remaining = xpToNextLevel(xp);
  // Part du niveau déjà parcourue, pour la barre de progression.
  const progress = remaining === null ? 100 : Math.max(0, Math.min(100, 100 - (remaining / 100) * 10));

  return (
    <div className="game-rail__card">
      <div className="game-rail__identity">
        <Icon emoji="⭐" size={40} eager />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="game-rail__level">{t("web.home.level", { level })}</div>
          <div className="game-rail__xp">
            {remaining === null ? `${xp} XP` : t("web.home.xpToNext", { xp: remaining })}
          </div>
          <div className="game-rail__bar">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <nav className="game-rail__nav" aria-label={t("web.home.nav")}>
        <button
          type="button"
          className="game-nav-item"
          aria-current={current === "home" ? "page" : undefined}
          onClick={() => onNavigate("home")}
        >
          <Icon emoji="🎮" size={22} />
          {t("web.home.classic")}
        </button>

        <button
          type="button"
          className="game-nav-item"
          aria-current={current === "journeys" ? "page" : undefined}
          onClick={() => onNavigate("journeys")}
        >
          <Icon emoji="🧭" size={22} />
          {t("web.home.journeys")}
        </button>

        <button
          type="button"
          className="game-nav-item"
          aria-current={current === "board" ? "page" : undefined}
          onClick={() => onNavigate("board")}
        >
          <Icon emoji="🏆" size={22} />
          {t("web.board.title")}
        </button>

        <button type="button" className="game-nav-item" onClick={onAccount}>
          <Glyph name={isSignedIn(user) ? "account" : "signin"} size={22} />
          {isSignedIn(user) ? t("web.home.account") : t("web.home.signIn")}
        </button>
      </nav>

      <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--rule-light)" }}>
        {isPremium ? (
          <span className="game-pill">
            <Icon emoji="👑" size={18} /> Pro
          </span>
        ) : (
          <>
            <div className="game-stat-row">
              <span>{t("web.home.tickets")}</span>
              <span
                className="game-stat-row__value"
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <Glyph name="ticket" size={18} />
                {ticketsLeft}
              </span>
            </div>
            <button
              type="button"
              className="game-btn game-btn--block"
              style={{ marginTop: 10, padding: "11px 18px", fontSize: 14 }}
              onClick={onSubscribe}
            >
              {t("web.home.unlimited")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
