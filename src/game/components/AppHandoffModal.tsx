import { useEffect, useState } from "react";
import { capture } from "@game/lib/analytics";
import { getLanguage, t } from "@game/lib/i18n";
import type { MobileStore } from "@game/lib/device";
import { appQrUrl, appStoreUrl, playStoreUrl } from "../../data/appLinks";

interface Props {
  /** Store du téléphone qui joue, ou `null` sur ordinateur (QR code). */
  store: MobileStore | null;
  /** Emplacement d'origine, même vocabulaire que le paywall (`quota_reached`…). */
  source: string;
  onClose: () => void;
  /** Bascule vers le paywall web, laissé en second choix. */
  onSubscribeHere: () => void;
}

/**
 * Sortie des parties gratuites : l'app plutôt que l'abonnement web.
 *
 * Mesuré du 04 au 16/09/2026 : 0 clic d'abonnement sur le paywall web, alors
 * que l'app transforme 43 % de ses essais en abonnés. Sur téléphone, un seul
 * bouton vers le store de l'appareil : une page « choisis ton store » coûte un
 * clic de plus au moment le plus fragile. Sur ordinateur, un QR code vers
 * /app/, qui envoie le téléphone qui le scanne vers son store. L'abonnement web
 * reste accessible, en lien secondaire.
 */
export function AppHandoffModal({ store, source, onClose, onSubscribeHere }: Props) {
  const lang = getLanguage();
  const device = store ?? "desktop";

  useEffect(() => {
    capture("app_handoff_viewed", { source, store: device });
  }, [source, device]);

  // Ordinateur : QR généré à l'ouverture, bibliothèque chargée à la demande.
  const [qrSvg, setQrSvg] = useState<string | null>(null);
  useEffect(() => {
    if (store) return;
    let cancelled = false;
    void import("qrcode")
      .then((QRCode) =>
        QRCode.toString(appQrUrl("quota-desktop"), {
          type: "svg",
          margin: 0,
          errorCorrectionLevel: "M",
          color: { dark: "#1a1816", light: "#ffffff" },
        }),
      )
      .then((svg) => {
        if (!cancelled) setQrSvg(svg);
      })
      .catch(() => {
        // Sans QR, l'abonnement web et « Plus tard » restent disponibles.
      });
    return () => {
      cancelled = true;
    };
  }, [store]);

  return (
    <div className="game-modal" role="dialog" aria-modal="true" aria-label={t("web.handoff.title")}>
      <div className="game-modal__panel handoff">
        <img src="/images/game/paywall-hero.webp" alt="" className="handoff__hero" />
        <h2 className="game-modal__title">{t("web.handoff.title")}</h2>
        <p className="game-modal__sub">{t(store ? "web.handoff.sub" : "web.handoff.subDesktop")}</p>

        {store ? (
          /* `data-umami-event*` : Umami et l'écouteur PostHog des liens stores
             lisent la campagne sur le lien lui-même. */
          <a
            className="game-btn game-btn--block"
            href={store === "app_store" ? appStoreUrl(lang, "quota-mobile") : playStoreUrl("quota-mobile", lang)}
            target="_blank"
            rel="noopener"
            data-umami-event="store-click"
            data-umami-event-store={store === "app_store" ? "app-store" : "play-store"}
            data-umami-event-campaign="quota-mobile"
            onClick={() => capture("app_handoff_store_click", { source, store })}
          >
            {store === "app_store" ? t("web.handoff.ctaIos") : t("web.handoff.ctaAndroid")}
          </a>
        ) : (
          qrSvg && (
            <div className="handoff__qr">
              <span className="handoff__qr-code" dangerouslySetInnerHTML={{ __html: qrSvg }} />
              <span className="handoff__qr-txt">{t("web.handoff.scan")}</span>
            </div>
          )
        )}

        <button
          type="button"
          className="handoff__subscribe"
          onClick={() => {
            capture("app_handoff_subscribe_web", { source, store: device });
            onSubscribeHere();
          }}
        >
          {t("web.handoff.subscribeHere")}
        </button>

        <button
          type="button"
          className="game-btn game-btn--ghost game-btn--block"
          onClick={() => {
            capture("app_handoff_dismissed", { source, store: device });
            onClose();
          }}
        >
          {t("web.handoff.later")}
        </button>
      </div>
    </div>
  );
}
