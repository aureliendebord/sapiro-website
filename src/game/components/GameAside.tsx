import { t } from "@game/lib/i18n";
import { Icon } from "./ui/Icon";

interface Props {
  /** Écran affiché au centre — le panneau s'y adapte. */
  screen: "home" | "journeys" | "board" | "profile" | "quiz" | "result";
  gamesPlayed: number;
}

/**
 * Panneau latéral contextuel (desktop).
 *
 * Sur un écran large, la colonne centrale seule laisse deux vides. Plutôt que
 * d'étirer le plateau, on y met ce que le joueur consulte sans agir : sa
 * progression sur l'accueil, les raccourcis clavier pendant une partie — des
 * raccourcis implémentés depuis la V1 mais que rien n'annonçait.
 */
export function GameAside({ screen, gamesPlayed }: Props) {
  if (screen === "quiz") {
    return (
      <div className="game-aside__card">
        <h2 className="game-aside__title">{t("web.home.shortcuts")}</h2>
        <div className="game-stat-row">
          <span>{t("web.home.shortcutAnswer")}</span>
          <span>
            <kbd className="game-kbd">1</kbd> <kbd className="game-kbd">2</kbd>{" "}
            <kbd className="game-kbd">3</kbd> <kbd className="game-kbd">4</kbd>
          </span>
        </div>
        <div className="game-stat-row">
          <span>{t("web.home.shortcutQuit")}</span>
          <span>
            <kbd className="game-kbd">Esc</kbd>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="game-aside__card">
      <h2 className="game-aside__title">{t("web.home.statsTitle")}</h2>
      <div className="game-stat-row">
        <span>
          <Icon emoji="🎮" size={18} style={{ display: "inline-block", verticalAlign: "-3px", marginRight: 6 }} />
          {t("web.home.statGames")}
        </span>
        <span className="game-stat-row__value">{gamesPlayed}</span>
      </div>
    </div>
  );
}
