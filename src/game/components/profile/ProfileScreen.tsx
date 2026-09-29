import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useGameStore } from "@game/store/gameStore";
import { usePathStore } from "@game/store/pathStore";
import { isSignedIn } from "@game/lib/auth";
import { openCustomerPortal } from "@game/lib/purchases";
import { capture } from "@game/lib/analytics";
import { t } from "@game/lib/i18n";
import { Icon } from "../ui/Icon";

interface Props {
  user: User | null;
  isPremium: boolean;
  onAccount: () => void;
  onSubscribe: () => void;
}

/**
 * Profil — ce que le joueur a accumulé : la grille de statistiques, comme
 * l'app 2.1.0 (plus de niveau ni de badges, retirés de l'app).
 */
export function ProfileScreen({ user, isPremium, onAccount, onSubscribe }: Props) {
  // Le profil est le seul endroit où un abonné revient : c'est donc ici que
  // vivent le changement de moyen de paiement et la résiliation, promis par les
  // mentions du paywall. Sans ça, un abonné n'avait aucune sortie dans le jeu.
  const [portalNotice, setPortalNotice] = useState<string | null>(null);
  const gamesPlayed = useGameStore((s) => s.gamesPlayed);
  const correctAnswers = useGameStore((s) => s.correctAnswers);
  const totalAnswers = useGameStore((s) => s.totalAnswers);
  const bestSurvival = useGameStore((s) => s.bestSurvivalStreak);
  const dailyStreak = useGameStore((s) => s.dailyStreak);
  const pathCleared = usePathStore((s) => s.cleared());

  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  return (
    <>
      <div className="game-topbar">
        <div>
          <h1 className="path-title">{t("web.profile.title")}</h1>
          <p className="path-sub">
            {isSignedIn(user) ? user?.email : t("web.profile.anonymous")}
          </p>
        </div>
        {!isSignedIn(user) && (
          <button type="button" className="game-btn" onClick={onAccount}>
            {t("web.account.signUpLink")}
          </button>
        )}
      </div>

      <section className="profile-card">
        <div className="profile-stats">
          <Stat icon="🎮" label={t("web.home.statGames")} value={gamesPlayed} />
          <Stat icon="✅" label={t("web.profile.accuracy")} value={`${accuracy} %`} />
          <Stat icon="❤️" label={t("web.profile.bestSurvival")} value={bestSurvival} />
          <Stat icon="🔥" label={t("web.profile.streak")} value={dailyStreak} />
          <Stat icon="🧭" label={t("web.profile.pathBlocks")} value={`${pathCleared}/54`} />
        </div>

        {!isPremium ? (
          <button
            type="button"
            className="game-btn game-btn--block"
            style={{ marginTop: 16 }}
            onClick={onSubscribe}
          >
            {t("web.home.unlimited")}
          </button>
        ) : (
          <>
            <button
              type="button"
              className="game-btn game-btn--ghost game-btn--block"
              style={{ marginTop: 16 }}
              onClick={() => {
                capture("manage_subscription_clicked", { source: "profile" });
                setPortalNotice(null);
                void openCustomerPortal()
                  .then((opened) => {
                    if (!opened) setPortalNotice(t("web.profile.manageUnavailable"));
                  })
                  .catch(() => setPortalNotice(t("web.profile.manageUnavailable")));
              }}
            >
              {t("web.profile.manage")}
            </button>
            {portalNotice && <p className="game-modal__notice">{portalNotice}</p>}
          </>
        )}
      </section>

    </>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="profile-stat">
      <Icon emoji={icon} size={22} />
      <span className="profile-stat__value">{value}</span>
      <span className="profile-stat__label">{label}</span>
    </div>
  );
}
