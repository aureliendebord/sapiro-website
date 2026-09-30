import { t } from "@game/lib/i18n";
import { Icon } from "./ui/Icon";
import { Glyph } from "./ui/Glyph";
import { mobileStore } from "@game/lib/device";
import type { Challenge } from "@game/lib/share";

export type HomeAction = "classic" | "survival" | "daily" | "journeys";

interface ModeRow {
  action: HomeAction;
  /** Emoji source — résolu en illustration par `<Icon>`. Mêmes visuels que l'app. */
  icon: string;
  nameKey: string;
  descKey: string;
  costsTicket: boolean;
}

/**
 * Les quatre modes, en une ligne chacun, dans l'ordre de l'accueil mobile.
 *
 * Le bento de la V2 (blocs de couleur pleine, carte héros sur deux colonnes)
 * donnait quatre hiérarchies concurrentes : on ne savait plus par où entrer.
 * L'app empile des lignes identiques — illustration, titre, une phrase — et
 * c'est ça qui se lit d'un coup d'œil. On reprend la même grammaire : les
 * panneaux de verre de l'accueil V3 (`Glass` + `PanelRow`).
 *
 * Les emojis sont ceux de l'app (`THEME_EMOJI` / `MODE_ICONS`) : ils désignent
 * des illustrations synchronisées, pas des caractères à afficher.
 */
const ROWS: ModeRow[] = [
  // La ligne NAVIGUE vers le sentier (le ticket se consomme au lancement d'un
  // bloc) : elle reste cliquable même à quota épuisé.
  { action: "journeys", icon: "🧭", nameKey: "journeys", descKey: "journeysDesc", costsTicket: false },
  { action: "daily", icon: "📅", nameKey: "daily", descKey: "dailyDesc", costsTicket: false },
  { action: "classic", icon: "🔀", nameKey: "classic", descKey: "classicDesc", costsTicket: true },
  { action: "survival", icon: "❤️", nameKey: "survival", descKey: "survivalDesc", costsTicket: true },
];

interface Props {
  ticketsLeft: number;
  isPremium: boolean;
  dailyDone: boolean;
  /** Lien « bats mon score » par lequel le joueur est arrivé. */
  challenge?: Challenge | null;
  challengeIsToday?: boolean;
  onAction: (action: HomeAction) => void;
  /** Quota épuisé sur téléphone : ouvre la sortie vers l'app. */
  onContinueInApp: () => void;
}

export function HomeScreen({
  ticketsLeft,
  isPremium,
  dailyDone,
  challenge,
  challengeIsToday,
  onAction,
  onContinueInApp,
}: Props) {
  const outOfTickets = !isPremium && ticketsLeft <= 0;
  const onPhone = mobileStore() !== null;

  // Pas de titre ni de sous-titre au-dessus des modes : le header du site dit
  // déjà « Sapiro », et le <h1> de la page vit dans le bloc rendu au build
  // (`GameSeoIntro`) — celui-là était monté côté client, donc invisible pour
  // Google, et il coûtait 93px de hauteur avant la première carte.
  return (
    <>
      {/* Arrivée par un lien de défi : le bandeau passe avant tout le reste,
          c'est pour ça que le joueur est là. Le Défi reste lancé par un clic
          (pas d'auto-démarrage) : les sons exigent un geste utilisateur. */}
      {challenge && (
        <div className="game-notice">
          {t(
            !challengeIsToday
              ? "web.share.bannerPast"
              : dailyDone
                ? "web.share.bannerDone"
                : "web.share.bannerToday",
            { score: challenge.score, total: challenge.total },
          )}
          {!dailyDone && (
            <button
              type="button"
              className="game-btn game-btn--block"
              style={{ marginTop: 10 }}
              onClick={() => onAction("daily")}
            >
              {t("web.share.bannerPlay")}
            </button>
          )}
        </div>
      )}

      {outOfTickets && !onPhone && <div className="game-notice">{t("web.home.quotaNotice")}</div>}
      {/* Sur téléphone, les modes à ticket sont grisés : sans ce bouton,
          l'accueil n'offrait aucune sortie vers l'app une fois le quota vidé. */}
      {outOfTickets && onPhone && (
        <div className="game-notice">
          {t("web.result.outOfTicketsMobile")}
          <button
            type="button"
            className="game-btn game-btn--block"
            style={{ marginTop: 10 }}
            onClick={onContinueInApp}
          >
            {t("web.result.continueInApp")}
          </button>
        </div>
      )}

      <div className="mode-list">
        {ROWS.map((row) => {
          const disabled = (row.action === "daily" && dailyDone) || (row.costsTicket && outOfTickets);
          // Aventure ouvre le sentier : seule ligne qui navigue (chevron).
          const hero = row.action === "journeys";

          const desc =
            row.action === "daily" && dailyDone
              ? t("web.home.dailyDone")
              : t(`web.home.${row.descKey}`);

          return (
            <button
              type="button"
              key={row.action}
              className="mode-row"
              disabled={disabled}
              onClick={() => onAction(row.action)}
            >
              <Icon emoji={row.icon} size={56} eager className="mode-row__icon" />

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

              {/* Chevron sur la seule ligne qui NAVIGUE (le sentier) : les
                  autres lancent une partie, et l'app n'en met pas non plus. */}
              {hero && <Glyph name="chevron" size={20} className="mode-row__chevron" />}
            </button>
          );
        })}
      </div>
    </>
  );
}
