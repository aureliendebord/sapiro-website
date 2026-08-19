import { useMemo } from "react";
import { JOURNEY_CATALOG, type JourneyDefinition } from "@/domain/journeys/catalog";
import { themeColor } from "@game/design/tokens";

/**
 * Le catalogue web reprend le gating par catégorie de l'app
 * (`FREE_CATEGORIES` dans `stores/subscriptionStore.ts`) : un parcours ajouté
 * dans l'app se classe automatiquement du bon côté ici aussi.
 */
const FREE_CATEGORIES = new Set([
  "continent",
  "figures-category",
  "art-movement",
  "animals-class",
  "monuments-continent",
]);

const THEME_LABELS: Record<string, string> = {
  geography: "Géographie",
  history: "Histoire",
  art: "Art",
  nature: "Nature",
  monument: "Monuments",
};

interface Props {
  isPremium: boolean;
  /** Catalogue entièrement ouvert (kill-switch distant du modèle tickets). */
  catalogOpen: boolean;
  onPick: (journey: JourneyDefinition) => void;
  onLocked: (journey: JourneyDefinition) => void;
  onBack: () => void;
}

export function JourneysScreen({ isPremium, catalogOpen, onPick, onLocked, onBack }: Props) {
  const byTheme = useMemo(() => {
    const groups = new Map<string, JourneyDefinition[]>();
    for (const journey of JOURNEY_CATALOG) {
      const list = groups.get(journey.theme) ?? [];
      list.push(journey);
      groups.set(journey.theme, list);
    }
    return groups;
  }, []);

  const isUnlocked = (journey: JourneyDefinition) =>
    isPremium || catalogOpen || FREE_CATEGORIES.has(journey.category);

  return (
    <>
      <div className="game-topbar">
        <button type="button" className="game-icon-btn" onClick={onBack} aria-label="Retour">
          ←
        </button>
        <strong style={{ fontSize: 17 }}>Parcours</strong>
        <span style={{ width: 38 }} />
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>
        {[...byTheme.entries()].map(([theme, journeys]) => (
          <section className="journey-section" key={theme}>
            <h2 className="journey-section__title">{THEME_LABELS[theme] ?? theme}</h2>
            <div className="journey-grid">
              {journeys.map((journey) => {
                const unlocked = isUnlocked(journey);
                const colors = themeColor(journey.theme);
                return (
                  <button
                    type="button"
                    key={journey.id}
                    className={`journey-card ${unlocked ? "" : "journey-card--locked"}`}
                    style={{ "--accent": colors.primary } as React.CSSProperties}
                    onClick={() => (unlocked ? onPick(journey) : onLocked(journey))}
                  >
                    <span className="journey-card__icon">{unlocked ? journey.icon : "🔒"}</span>
                    <span className="journey-card__title">{journey.title}</span>
                    <span className="journey-card__meta">{journey.entityCount} éléments</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
