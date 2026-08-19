import { modeColor } from "@game/design/tokens";
import { levelFromXp } from "@game/store/gameStore";
import { t } from "@game/lib/i18n";

export type HomeAction = "classic" | "survival" | "daily" | "review" | "journeys";

interface ModeCard {
  action: HomeAction;
  icon: string;
  /** Clés dans `web.home.*` (nom, description). */
  nameKey: string;
  descKey: string;
  /** Clé de couleur dans MODE_COLOR (les parcours reprennent le classique). */
  color: string;
  /** Une partie de ce mode consomme un ticket. */
  costsTicket: boolean;
}

const CARDS: ModeCard[] = [
  { action: "journeys", icon: "🗺️", nameKey: "journeys", descKey: "journeysDesc", color: "classic", costsTicket: true },
  { action: "daily", icon: "📅", nameKey: "daily", descKey: "dailyDesc", color: "daily", costsTicket: false },
  { action: "classic", icon: "🎯", nameKey: "classic", descKey: "classicDesc", color: "classic", costsTicket: true },
  { action: "survival", icon: "❤️", nameKey: "survival", descKey: "survivalDesc", color: "survival", costsTicket: true },
  { action: "review", icon: "🔁", nameKey: "review", descKey: "reviewDesc", color: "review", costsTicket: true },
];

interface Props {
  xp: number;
  ticketsLeft: number;
  isPremium: boolean;
  isSignedIn: boolean;
  /** Nombre d'entités dans le deck de révision (0 = mode indisponible). */
  reviewCount: number;
  dailyDone: boolean;
  onAction: (action: HomeAction) => void;
  onAccount: () => void;
  onSubscribe: () => void;
}

export function HomeScreen({
  xp,
  ticketsLeft,
  isPremium,
  isSignedIn,
  reviewCount,
  dailyDone,
  onAction,
  onAccount,
  onSubscribe,
}: Props) {
  const outOfTickets = !isPremium && ticketsLeft <= 0;

  return (
    <>
      <div className="game-topbar">
        <span className="game-pill" title={`${xp} XP`}>
          ⭐ {t("web.home.level", { level: levelFromXp(xp) })}
        </span>

        {isPremium ? (
          <span className="game-pill">👑 Pro</span>
        ) : (
          <button type="button" className="game-pill" onClick={onSubscribe}>
            🎟️ {ticketsLeft}
          </button>
        )}

        <button
          type="button"
          className="game-icon-btn"
          onClick={onAccount}
          aria-label={isSignedIn ? t("web.home.account") : t("web.home.signIn")}
        >
          {isSignedIn ? "👤" : "🔑"}
        </button>
      </div>

      <h1 className="home-title">Sapiro</h1>
      <p className="home-sub">{t("web.home.subtitle")}</p>

      {outOfTickets && <div className="game-notice">{t("web.home.quotaNotice")}</div>}

      <div className="mode-grid">
        {CARDS.map((card) => {
          const colors = modeColor(card.color);
          const disabled =
            (card.action === "review" && reviewCount === 0) ||
            (card.action === "daily" && dailyDone) ||
            (card.costsTicket && outOfTickets);

          const desc =
            card.action === "review" && reviewCount > 0
              ? t("web.home.reviewCount", { count: reviewCount })
              : card.action === "daily" && dailyDone
                ? t("web.home.dailyDone")
                : t(`web.home.${card.descKey}`);

          return (
            <button
              type="button"
              key={card.action}
              className="mode-card"
              disabled={disabled}
              onClick={() => onAction(card.action)}
              style={
                {
                  "--card-accent": colors.primary,
                  "--card-tint": colors.tint,
                } as React.CSSProperties
              }
            >
              <span className="mode-card__icon">{card.icon}</span>
              <span>
                <span className="mode-card__name">{t(`web.home.${card.nameKey}`)}</span>
                <br />
                <span className="mode-card__desc">{desc}</span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
