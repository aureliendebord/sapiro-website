import { modeColor } from "@game/design/tokens";
import { t } from "@game/lib/i18n";
import { Icon } from "./ui/Icon";

export type HomeAction = "classic" | "survival" | "daily" | "review" | "journeys";

interface ModeCard {
  action: HomeAction;
  /** Emoji source — résolu en illustration par `<Icon>`. Mêmes visuels que l'app. */
  icon: string;
  nameKey: string;
  descKey: string;
  /** Contrat du mode, épinglé en bas de carte. */
  metaKey: string;
  /** Clé de couleur dans MODE_COLOR. */
  color: string;
  costsTicket: boolean;
}

/**
 * Les cinq modes, dans l'ordre de l'accueil mobile. Les emojis sont ceux de
 * l'app (`THEME_EMOJI` / `MODE_ICONS`) : ils désignent des illustrations
 * synchronisées, pas des caractères à afficher.
 */
const CARDS: ModeCard[] = [
  // La carte NAVIGUE vers le sentier (le ticket se consomme au lancement d'un
  // bloc) : elle reste cliquable même à quota épuisé.
  { action: "journeys", icon: "🧭", nameKey: "journeys", descKey: "journeysDesc", metaKey: "journeysMeta", color: "classic", costsTicket: false },
  { action: "daily", icon: "📅", nameKey: "daily", descKey: "dailyDesc", metaKey: "dailyMeta", color: "daily", costsTicket: false },
  { action: "classic", icon: "🎮", nameKey: "classic", descKey: "classicDesc", metaKey: "classicMeta", color: "classic", costsTicket: true },
  { action: "survival", icon: "❤️", nameKey: "survival", descKey: "survivalDesc", metaKey: "survivalMeta", color: "survival", costsTicket: true },
  { action: "review", icon: "🎓", nameKey: "review", descKey: "reviewDesc", metaKey: "reviewMeta", color: "review", costsTicket: true },
];

interface Props {
  ticketsLeft: number;
  isPremium: boolean;
  reviewCount: number;
  dailyDone: boolean;
  onAction: (action: HomeAction) => void;
}

export function HomeScreen({ ticketsLeft, isPremium, reviewCount, dailyDone, onAction }: Props) {
  const outOfTickets = !isPremium && ticketsLeft <= 0;

  return (
    <>
      <div className="home-head">
        <div>
          <h1 className="home-title">{t("web.home.title")}</h1>
          <p className="home-sub">{t("web.home.subtitle")}</p>
        </div>
      </div>

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
              className={`mode-card mode-card--${card.action}`}
              disabled={disabled}
              onClick={() => onAction(card.action)}
              style={
                {
                  "--card-accent": colors.primary,
                  "--card-accent-deep": colors.tintDeep,
                  "--card-on-accent": colors.onPrimary,
                } as React.CSSProperties
              }
            >
              {/* Le Défi du jour ne coûte pas de partie : c'est son argument. */}
              {card.action === "daily" && !dailyDone && (
                <span className="mode-card__badge">{t("web.home.dailyFree")}</span>
              )}

              <Icon
                emoji={card.icon}
                size={card.action === "journeys" ? 96 : 56}
                eager
                className="mode-card__icon"
              />
              <span className="mode-card__name">{t(`web.home.${card.nameKey}`)}</span>
              <span className="mode-card__desc">{desc}</span>
              <span className="mode-card__meta">{t(`web.home.${card.metaKey}`)}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
