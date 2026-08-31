import { BRAND, modeColor } from "@game/design/tokens";
import { t } from "@game/lib/i18n";
import { Icon } from "./ui/Icon";
import { Glyph } from "./ui/Glyph";

export type HomeAction = "classic" | "survival" | "daily" | "journeys";

interface ModeRow {
  action: HomeAction;
  /** Emoji source — résolu en illustration par `<Icon>`. Mêmes visuels que l'app. */
  icon: string;
  nameKey: string;
  descKey: string;
  /** Clé de couleur dans MODE_COLOR — sert au liseré de relief. */
  color: string;
  costsTicket: boolean;
}

/**
 * Les quatre modes, en une ligne chacun, dans l'ordre de l'accueil mobile.
 *
 * Le bento de la V2 (blocs de couleur pleine, carte héros sur deux colonnes)
 * donnait quatre hiérarchies concurrentes : on ne savait plus par où entrer.
 * L'app empile des lignes identiques — illustration, titre, une phrase — et
 * c'est ça qui se lit d'un coup d'œil. On reprend la même grammaire
 * (`ModeTileHorizontal` / `AdventureCard`), relief 3D compris.
 *
 * Les emojis sont ceux de l'app (`THEME_EMOJI` / `MODE_ICONS`) : ils désignent
 * des illustrations synchronisées, pas des caractères à afficher.
 */
const ROWS: ModeRow[] = [
  // La ligne NAVIGUE vers le sentier (le ticket se consomme au lancement d'un
  // bloc) : elle reste cliquable même à quota épuisé.
  { action: "journeys", icon: "🧭", nameKey: "journeys", descKey: "journeysDesc", color: "classic", costsTicket: false },
  { action: "daily", icon: "📅", nameKey: "daily", descKey: "dailyDesc", color: "daily", costsTicket: false },
  { action: "classic", icon: "🎮", nameKey: "classic", descKey: "classicDesc", color: "classic", costsTicket: true },
  { action: "survival", icon: "❤️", nameKey: "survival", descKey: "survivalDesc", color: "survival", costsTicket: true },
];

interface Props {
  ticketsLeft: number;
  isPremium: boolean;
  dailyDone: boolean;
  onAction: (action: HomeAction) => void;
}

export function HomeScreen({ ticketsLeft, isPremium, dailyDone, onAction }: Props) {
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

      <div className="mode-list">
        {ROWS.map((row) => {
          const colors = modeColor(row.color);
          const disabled = (row.action === "daily" && dailyDone) || (row.costsTicket && outOfTickets);
          // Aventure ouvre le sentier : elle porte la couleur de marque et une
          // face teintée, comme la carte de tête de l'app. Les autres lignes
          // restent blanches — une seule entrée dominante.
          const hero = row.action === "journeys";

          const desc =
            row.action === "daily" && dailyDone
              ? t("web.home.dailyDone")
              : t(`web.home.${row.descKey}`);

          return (
            <button
              type="button"
              key={row.action}
              className={`mode-row ${hero ? "mode-row--hero" : ""}`}
              disabled={disabled}
              onClick={() => onAction(row.action)}
              style={
                {
                  "--row-edge": hero ? BRAND.primary : colors.primary,
                  "--row-face": hero ? BRAND.tint : "var(--surface)",
                  "--row-ink": hero ? BRAND.tintDeep : "var(--ink)",
                } as React.CSSProperties
              }
            >
              <Icon emoji={row.icon} size={64} eager className="mode-row__icon" />

              <span className="mode-row__body">
                <span className="mode-row__head">
                  <span className="mode-row__name">{t(`web.home.${row.nameKey}`)}</span>
                  {/* Le Défi du jour ne coûte pas de partie : c'est son
                      argument. Sur la ligne du titre et non en colonne à part,
                      sinon il vole la largeur au sous-titre. */}
                  {row.action === "daily" && !dailyDone && (
                    <span className="mode-row__badge">{t("web.home.dailyFree")}</span>
                  )}
                </span>
                <span className="mode-row__desc">{desc}</span>
              </span>

              <Glyph name="chevron" size={20} className="mode-row__chevron" />
            </button>
          );
        })}
      </div>
    </>
  );
}
