import { useEffect } from "react";
import { capture } from "@game/lib/analytics";
import { getLanguage, t } from "@game/lib/i18n";
import type { MobileStore } from "@game/lib/device";
import { appStoreUrl, playStoreUrl } from "../../data/appLinks";

interface Props {
  store: MobileStore;
  /** Emplacement d'origine, même vocabulaire que le paywall (`quota_reached`…). */
  source: string;
  onClose: () => void;
  /** Bascule vers le paywall web, laissé en second choix. */
  onSubscribeHere: () => void;
}

/**
 * Sortie mobile des parties gratuites : l'app plutôt que l'abonnement web.
 *
 * Mesuré du 04 au 16/09/2026 : 0 clic d'abonnement sur le paywall web, alors
 * que l'app transforme 43 % de ses essais en abonnés. Un seul bouton, vers le
 * store de l'appareil : une page « choisis ton store » coûte un clic de plus
 * au moment le plus fragile. L'abonnement web reste accessible, en lien
 * secondaire.
 */
export function AppHandoffModal({ store, source, onClose, onSubscribeHere }: Props) {
  const lang = getLanguage();

  useEffect(() => {
    capture("app_handoff_viewed", { source, store });
  }, [source, store]);

  const href = store === "app_store" ? appStoreUrl(lang) : playStoreUrl("quota-mobile", lang);

  return (
    <div className="game-modal" role="dialog" aria-modal="true" aria-label={t("web.handoff.title")}>
      <div className="game-modal__panel handoff">
        <img src="/images/game/paywall-hero.webp" alt="" className="handoff__hero" />
        <h2 className="game-modal__title">{t("web.handoff.title")}</h2>
        <p className="game-modal__sub">{t("web.handoff.sub")}</p>

        {/* `data-umami-event*` : Umami et l'écouteur PostHog des liens stores
            lisent la campagne sur le lien lui-même. */}
        <a
          className="game-btn game-btn--block"
          href={href}
          target="_blank"
          rel="noopener"
          data-umami-event="store-click"
          data-umami-event-store={store === "app_store" ? "app-store" : "play-store"}
          data-umami-event-campaign="quota-mobile"
          onClick={() => capture("app_handoff_store_click", { source, store })}
        >
          {store === "app_store" ? t("web.handoff.ctaIos") : t("web.handoff.ctaAndroid")}
        </a>

        <button
          type="button"
          className="handoff__subscribe"
          onClick={() => {
            capture("app_handoff_subscribe_web", { source, store });
            onSubscribeHere();
          }}
        >
          {t("web.handoff.subscribeHere")}
        </button>

        <button
          type="button"
          className="game-btn game-btn--ghost game-btn--block"
          onClick={() => {
            capture("app_handoff_dismissed", { source, store });
            onClose();
          }}
        >
          {t("web.handoff.later")}
        </button>
      </div>
    </div>
  );
}
