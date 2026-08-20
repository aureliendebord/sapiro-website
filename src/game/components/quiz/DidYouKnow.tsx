import type { AnyFlagEntity, Artwork } from "@/types";
import { getLocalizedEntry } from "@/hooks/useEntityDescriptions";
import { resolveLocalizedEntity } from "@/hooks/useLocalizedEntity";
import { entityVisualUrl, isImageEntity } from "@game/lib/entityAssets";
import { t } from "@game/lib/i18n";

interface Props {
  entity: AnyFlagEntity;
  lang: string;
  onContinue: () => void;
}

/**
 * « Le savais-tu ? » — l'écran qui suit chaque réponse sur une entité
 * illustrée (personnage, œuvre, animal, monument).
 *
 * C'est la contrepartie pédagogique du quiz : sans lui, Sapiro n'est qu'un
 * QCM. Les anecdotes viennent des locales synchronisées depuis l'app, donc
 * les mêmes textes que sur mobile, dans la langue de la page.
 */
export function DidYouKnow({ entity: rawEntity, lang, onContinue }: Props) {
  const entity = resolveLocalizedEntity(rawEntity, lang);
  const entry = getLocalizedEntry(entity.type, entity.id, lang);

  // Repli sur la description de l'œuvre quand les locales n'ont pas
  // d'anecdote — même règle que l'app.
  const facts =
    entry?.descriptions?.length
      ? entry.descriptions
      : entity.type === "artwork" && (entity as Artwork).description
        ? [(entity as Artwork).description as string]
        : [];

  const visual = entityVisualUrl(entity);

  return (
    <div className="dyk" role="dialog" aria-modal="true" aria-label={t("didYouKnow.title")}>
      <div className="dyk__panel">
        {visual && (
          <img
            src={visual}
            alt=""
            className={`dyk__visual ${isImageEntity(entity) ? "" : "dyk__visual--flag"}`}
          />
        )}

        <p className="dyk__kicker">{t("didYouKnow.title")}</p>
        <h2 className="dyk__name">{entity.name}</h2>

        {entity.type === "artwork" && (entity as Artwork).artist && (
          <p className="dyk__meta">{(entity as Artwork).artist}</p>
        )}

        <ul className="dyk__facts">
          {facts.map((fact, i) => (
            <li key={i}>{fact}</li>
          ))}
        </ul>

        <button type="button" className="game-btn game-btn--block" onClick={onContinue} autoFocus>
          {t("didYouKnow.continue")}
        </button>
      </div>
    </div>
  );
}

/**
 * Y a-t-il quelque chose à raconter sur cette entité ? Appelé AVANT d'afficher
 * l'écran : sans anecdote, on enchaîne directement plutôt que de montrer une
 * carte vide (l'app fait pareil via `shouldAutoSkip`).
 */
export function hasFacts(entity: AnyFlagEntity, lang: string): boolean {
  if (!isImageEntity(entity)) return false;
  const entry = getLocalizedEntry(entity.type, entity.id, lang);
  if (entry?.descriptions?.length) return true;
  return entity.type === "artwork" && Boolean((entity as Artwork).description);
}
