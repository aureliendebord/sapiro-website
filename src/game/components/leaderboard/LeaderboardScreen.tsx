import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  fetchLeaderboard,
  fetchMyRank,
  fetchSurvivalRecords,
  type LeaderboardRow,
  type MyRank,
} from "@game/lib/leaderboard";
import { isSignedIn } from "@game/lib/auth";
import { t } from "@game/lib/i18n";
import { Icon } from "../ui/Icon";

type Tab = "week" | "all" | "records";

interface Props {
  user: User | null;
  onSignIn: () => void;
}

/**
 * Classement — la preuve que le jeu est vivant.
 *
 * Les mêmes RPC que l'app, donc la même table : un joueur web et un joueur
 * mobile sont côte à côte. C'est aussi le meilleur argument de création de
 * compte, d'où la carte de connexion en tête pour les anonymes : ils voient le
 * classement mais n'y figurent pas tant qu'ils n'ont pas de compte.
 */
export function LeaderboardScreen({ user, onSignIn }: Props) {
  const [tab, setTab] = useState<Tab>("week");
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);
  const [mine, setMine] = useState<MyRank | null>(null);

  useEffect(() => {
    let cancelled = false;
    setRows(null);

    void (async () => {
      const list =
        tab === "records"
          ? await fetchSurvivalRecords()
          : await fetchLeaderboard("xp", tab === "week" ? "week" : "all", { limit: 50 });
      if (cancelled) return;
      setRows(list);

      // Le rang personnel n'a de sens qu'au classement XP.
      setMine(tab === "records" ? null : await fetchMyRank("xp", tab === "week" ? "week" : "all"));
    })();

    return () => {
      cancelled = true;
    };
  }, [tab]);

  const signedIn = isSignedIn(user);

  return (
    <>
      <div className="game-topbar">
        <div>
          <h1 className="path-title">{t("web.board.title")}</h1>
          <p className="path-sub">{t("web.board.sub")}</p>
        </div>
      </div>

      <div className="board-tabs" role="tablist">
        {(["week", "all", "records"] as Tab[]).map((key) => (
          <button
            type="button"
            key={key}
            role="tab"
            aria-selected={tab === key}
            className={`board-tab ${tab === key ? "board-tab--on" : ""}`}
            onClick={() => setTab(key)}
          >
            {t(`web.board.tab.${key}`)}
          </button>
        ))}
      </div>

      {!signedIn && (
        <div className="board-nudge">
          <p>{t("web.board.anonymous")}</p>
          <button type="button" className="game-btn" onClick={onSignIn}>
            {t("web.account.signUpLink")}
          </button>
        </div>
      )}

      {signedIn && mine && (
        <p className="board-mine">
          {mine.rank
            ? t("web.board.yourRank", { rank: mine.rank, value: mine.value })
            : t("web.board.noRank")}
        </p>
      )}

      {rows === null && <div className="game-loading">{t("web.board.loading")}</div>}

      {rows?.length === 0 && <p className="game-modal__sub">{t("web.board.empty")}</p>}

      {rows && rows.length > 0 && (
        <ol className="board-list">
          {rows.map((row) => (
            <li key={row.user_id} className={`board-row ${row.is_me ? "board-row--me" : ""}`}>
              <span className={`board-rank ${row.rank <= 3 ? "board-rank--top" : ""}`}>
                {row.rank}
              </span>
              <Icon emoji={row.avatar || "👤"} size={32} className="board-avatar" />
              <span className="board-name">
                {row.pseudo}
                {row.pro_badge && <Icon emoji="👑" size={15} className="board-pro" />}
              </span>
              <span className="board-value">
                {tab === "records"
                  ? t("web.board.streak", { count: row.value })
                  : t("web.board.xp", { count: row.value })}
              </span>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
