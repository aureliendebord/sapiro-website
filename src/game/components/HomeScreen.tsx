import { modeColor } from "@game/design/tokens";
import { levelFromXp } from "@game/store/gameStore";

export type HomeAction = "classic" | "survival" | "daily" | "review" | "journeys";

interface ModeCard {
  action: HomeAction;
  icon: string;
  name: string;
  desc: string;
  /** Clé de couleur dans MODE_COLOR (les parcours reprennent le classique). */
  color: string;
  /** Une partie de ce mode consomme un ticket. */
  costsTicket: boolean;
}

const CARDS: ModeCard[] = [
  {
    action: "journeys",
    icon: "🗺️",
    name: "Parcours",
    desc: "88 parcours, du continent au musée",
    color: "classic",
    costsTicket: true,
  },
  {
    action: "daily",
    icon: "📅",
    name: "Défi du jour",
    desc: "10 questions, sans consommer de partie",
    color: "daily",
    costsTicket: false,
  },
  {
    action: "classic",
    icon: "🎯",
    name: "Classique",
    desc: "10 questions tirées au hasard",
    color: "classic",
    costsTicket: true,
  },
  {
    action: "survival",
    icon: "❤️",
    name: "Survie",
    desc: "3 vies, jusqu'où iras-tu ?",
    color: "survival",
    costsTicket: true,
  },
  {
    action: "review",
    icon: "🔁",
    name: "Révision",
    desc: "Rejoue ce que tu as raté",
    color: "review",
    costsTicket: true,
  },
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
          ⭐ Niveau {levelFromXp(xp)}
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
          aria-label={isSignedIn ? "Mon compte" : "Se connecter"}
        >
          {isSignedIn ? "👤" : "🔑"}
        </button>
      </div>

      <h1 className="home-title">Sapiro</h1>
      <p className="home-sub">Apprends en jouant : géographie, histoire, art, nature, monuments.</p>

      {outOfTickets && (
        <div className="game-notice">
          Plus de parties aujourd'hui. Le Défi du jour reste jouable, et l'illimité t'attend.
        </div>
      )}

      <div className="mode-grid">
        {CARDS.map((card) => {
          const colors = modeColor(card.color);
          const disabled =
            (card.action === "review" && reviewCount === 0) ||
            (card.action === "daily" && dailyDone) ||
            (card.costsTicket && outOfTickets);

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
                <span className="mode-card__name">{card.name}</span>
                <br />
                <span className="mode-card__desc">
                  {card.action === "review" && reviewCount > 0
                    ? `${reviewCount} à revoir`
                    : card.action === "daily" && dailyDone
                      ? "Déjà relevé aujourd'hui, à demain"
                      : card.desc}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
