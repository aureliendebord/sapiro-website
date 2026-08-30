import type { User } from "@supabase/supabase-js";
import { isSignedIn } from "@game/lib/auth";
import { t } from "@game/lib/i18n";
import { Icon } from "./ui/Icon";
import { Glyph } from "./ui/Glyph";

export type NavSection = "home" | "journeys" | "board" | "profile";

interface Props {
  user: User | null;
  current: NavSection;
  onNavigate: (section: NavSection) => void;
  onAccount: () => void;
}

/**
 * Barre de navigation flottante en bas de l'écran — le pendant web de la tab
 * bar de l'app (`app/(tabs)/_layout.tsx`). Remplace la colonne latérale : le
 * jeu occupe tout l'espace central, la navigation reste sous le pouce comme
 * sur mobile. Masquée pendant une question (rien ne doit distraire du quiz).
 */
export function GameBottomNav({ user, current, onNavigate, onAccount }: Props) {
  const tabs: Array<{ section: NavSection; emoji: string; label: string }> = [
    { section: "home", emoji: "🎮", label: t("web.nav.home") },
    { section: "journeys", emoji: "🧭", label: t("web.nav.journeys") },
    { section: "board", emoji: "🏆", label: t("web.nav.board") },
    { section: "profile", emoji: "🏵️", label: t("web.nav.profile") },
  ];

  return (
    <nav className="game-bottomnav" aria-label={t("web.home.nav")}>
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.section}
          className="game-bottomnav__item"
          aria-current={current === tab.section ? "page" : undefined}
          onClick={() => onNavigate(tab.section)}
        >
          <Icon emoji={tab.emoji} size={24} />
          <span>{tab.label}</span>
        </button>
      ))}

      <button type="button" className="game-bottomnav__item" onClick={onAccount}>
        <Glyph name={isSignedIn(user) ? "account" : "signin"} size={24} />
        <span>{isSignedIn(user) ? t("web.nav.account") : t("web.nav.signIn")}</span>
      </button>
    </nav>
  );
}
