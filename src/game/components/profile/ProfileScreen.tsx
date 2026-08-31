import { useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import {
  BADGE_DEFINITIONS,
  isBadgeConditionMet,
  type BadgeEvalInput,
} from "@/domain/progress/badges";
import { useGameStore, levelFromXp, levelProgress, xpToNextLevel } from "@game/store/gameStore";
import { usePathStore } from "@game/store/pathStore";
import { isSignedIn } from "@game/lib/auth";
import { t } from "@game/lib/i18n";
import { Icon } from "../ui/Icon";

interface Props {
  user: User | null;
  isPremium: boolean;
  onAccount: () => void;
  onSubscribe: () => void;
}

/**
 * Profil — ce que le joueur a accumulé.
 *
 * Les badges viennent du catalogue synchronisé depuis l'app : mêmes 23 badges,
 * mêmes icônes. Leur déblocage, lui, reste calculé côté mobile ; ici on montre
 * ceux que la progression web a déjà atteints, à partir des mêmes seuils.
 * C'est volontairement en lecture seule — la logique d'attribution est liée à
 * l'état persisté des joueurs en production, on n'en fait pas une copie.
 */
export function ProfileScreen({ user, isPremium, onAccount, onSubscribe }: Props) {
  const xp = useGameStore((s) => s.xp);
  const gamesPlayed = useGameStore((s) => s.gamesPlayed);
  const correctAnswers = useGameStore((s) => s.correctAnswers);
  const totalAnswers = useGameStore((s) => s.totalAnswers);
  const bestSurvival = useGameStore((s) => s.bestSurvivalStreak);
  const dailyStreak = useGameStore((s) => s.dailyStreak);
  const playStreak = useGameStore((s) => s.playStreak);
  const history = useGameStore((s) => s.history);
  const pathCleared = usePathStore((s) => s.cleared());

  const level = levelFromXp(xp);
  const remaining = xpToNextLevel(xp);
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  /**
   * Badges atteints — évalués par isBadgeConditionMet, LA règle partagée avec
   * l'app (domain/progress/badges.ts) : plus de copie locale qui diverge.
   * `badge_count` dépend des autres : deux passes suffisent (pas de badge
   * badge_count en cascade dans le catalogue).
   */
  const unlocked = useMemo(() => {
    const input: BadgeEvalInput = {
      gamesPlayed,
      bestSurvivalStreak: bestSurvival,
      currentDailyStreak: playStreak,
      dailyChallengeStreak: dailyStreak,
      unlockedCount: 0,
      history,
    };
    const first = new Set(
      BADGE_DEFINITIONS.filter((b) => isBadgeConditionMet(b.condition, input)).map((b) => b.id),
    );
    const second = new Set(
      BADGE_DEFINITIONS.filter((b) =>
        isBadgeConditionMet(b.condition, { ...input, unlockedCount: first.size }),
      ).map((b) => b.id),
    );
    return second;
  }, [gamesPlayed, bestSurvival, dailyStreak, playStreak, history]);

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
        <div className="profile-level">
          <Icon emoji="⭐" size={48} eager />
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ fontSize: 18 }}>{t("web.home.level", { level })}</strong>
            <p className="game-rail__xp" style={{ margin: "2px 0 6px" }}>
              {remaining === null ? `${xp} XP` : t("web.home.xpToNext", { xp: remaining })}
            </p>
            <div className="game-rail__bar">
              <span style={{ width: `${levelProgress(xp)}%` }} />
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <Stat icon="🎮" label={t("web.home.statGames")} value={gamesPlayed} />
          <Stat icon="✅" label={t("web.profile.accuracy")} value={`${accuracy} %`} />
          <Stat icon="❤️" label={t("web.profile.bestSurvival")} value={bestSurvival} />
          <Stat icon="🔥" label={t("web.profile.streak")} value={dailyStreak} />
          <Stat icon="🧭" label={t("web.profile.pathBlocks")} value={`${pathCleared}/54`} />
        </div>

        {!isPremium && (
          <button
            type="button"
            className="game-btn game-btn--block"
            style={{ marginTop: 16 }}
            onClick={onSubscribe}
          >
            {t("web.home.unlimited")}
          </button>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 className="journey-section__title">
          {t("web.profile.badges", { done: unlocked.size, total: BADGE_DEFINITIONS.length })}
        </h2>

        <div className="badge-grid">
          {BADGE_DEFINITIONS.map((badge) => {
            const on = unlocked.has(badge.id);
            return (
              <div key={badge.id} className={`badge-card ${on ? "badge-card--on" : ""}`}>
                <Icon emoji={badge.icon} size={48} />
                <span className="badge-card__name">{t(`badges.items.${badge.id}.name`)}</span>
                <span className="badge-card__desc">
                  {t(`badges.items.${badge.id}.description`)}
                </span>
              </div>
            );
          })}
        </div>
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
