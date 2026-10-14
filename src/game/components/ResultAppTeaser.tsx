import { useEffect, useState } from "react";
import { capture } from "@game/lib/analytics";
import { getLanguage, t } from "@game/lib/i18n";
import { mobileStore } from "@game/lib/device";
import { appQrUrl, appStoreUrl, playStoreUrl } from "../../data/appLinks";

/**
 * Encart discret sous le résultat de chaque partie : l'app existe.
 *
 * Avant, l'app n'apparaissait qu'au quota épuisé, que 20 % des joueurs
 * atteignent : 80 % repartaient sans l'avoir vue (mesuré du 01/09 au
 * 14/10/2026). Sous les boutons, pour ne pas voler le « Rejouer ».
 * Téléphone : lien vers le store de l'appareil. Ordinateur : QR code vers /app/.
 */
export function ResultAppTeaser() {
  const lang = getLanguage();
  const store = mobileStore();
  const device = store ?? "desktop";

  useEffect(() => {
    capture("result_app_cta_viewed", { store: device });
  }, [device]);

  const [qrSvg, setQrSvg] = useState<string | null>(null);
  useEffect(() => {
    if (store) return;
    let cancelled = false;
    void import("qrcode")
      .then((QRCode) =>
        QRCode.toString(appQrUrl("result-desktop"), {
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
        // QR facultatif : sans lui, l'encart ne s'affiche pas.
      });
    return () => {
      cancelled = true;
    };
  }, [store]);

  if (store) {
    return (
      <a
        className="result-app"
        href={store === "app_store" ? appStoreUrl(lang) : playStoreUrl("result-mobile", lang)}
        target="_blank"
        rel="noopener"
        data-umami-event="store-click"
        data-umami-event-store={store === "app_store" ? "app-store" : "play-store"}
        data-umami-event-campaign="result-mobile"
        onClick={() => capture("result_app_cta_clicked", { store })}
      >
        <img src="/images/icon-180.png" alt="" className="result-app__icon" />
        <span className="result-app__txt">
          <strong>{t("web.resultApp.title")}</strong>
          <span>{t("web.resultApp.sub")}</span>
        </span>
        <span className="result-app__cta">{t("web.resultApp.cta")}</span>
      </a>
    );
  }

  if (!qrSvg) return null;
  return (
    <div className="result-app">
      <span className="result-app__qr" dangerouslySetInnerHTML={{ __html: qrSvg }} />
      <span className="result-app__txt">
        <strong>{t("web.resultApp.title")}</strong>
        <span>{t("web.resultApp.scan")}</span>
      </span>
    </div>
  );
}
