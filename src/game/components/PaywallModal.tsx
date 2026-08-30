import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  getPlans,
  isBillingConfigured,
  purchasePlan,
  PurchaseCancelledError,
  type SubscriptionPlan,
} from "@game/lib/purchases";
import { isSignedIn } from "@game/lib/auth";
import { capture } from "@game/lib/analytics";
import { getLanguage, t } from "@game/lib/i18n";
import { appStoreUrl, playStoreUrl } from "../../data/appLinks";

interface Props {
  user: User | null;
  /** Emplacement d'origine (funnel PostHog, comme `source` sur mobile). */
  source: string;
  onClose: () => void;
  onPurchased: () => void;
  /** Ouvre la modale de compte : s'abonner suppose un compte identifiable. */
  onNeedAccount: () => void;
}

export function PaywallModal({ user, source, onClose, onPurchased, onNeedAccount }: Props) {
  const [plans, setPlans] = useState<SubscriptionPlan[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Après l'achat, la modale devient l'écran de handoff web → app : c'est le
  // moment où l'utilisateur est le plus motivé pour installer l'app mobile.
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    capture("paywall_shown", { source });
  }, [source]);

  useEffect(() => {
    if (!isBillingConfigured()) {
      setPlans([]);
      return;
    }
    let cancelled = false;
    void getPlans()
      .then((list) => {
        if (cancelled) return;
        setPlans(list);
        // L'annuel est le meilleur rapport : on le présélectionne, comme l'app.
        setSelected(list.find((p) => p.period === "yearly")?.id ?? list[0]?.id ?? null);
      })
      .catch((e) => {
        if (!cancelled) {
          setPlans([]);
          setError(e instanceof Error ? e.message : String(e));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubscribe = async () => {
    const plan = plans?.find((p) => p.id === selected);
    if (!plan) return;

    // Sans compte, l'abonnement ne suivrait pas l'utilisateur sur mobile —
    // c'est précisément ce qu'il vient acheter.
    if (!isSignedIn(user)) {
      capture("paywall_needs_account", { source, plan: plan.period });
      onNeedAccount();
      return;
    }

    setBusy(true);
    setError(null);
    capture("purchase_started", { source, plan: plan.period });
    try {
      await purchasePlan(plan, user?.email ?? undefined);
      capture("purchase_completed", { source, plan: plan.period });
      onPurchased();
      setPurchased(true);
    } catch (e) {
      if (e instanceof PurchaseCancelledError) {
        capture("purchase_cancelled", { source, plan: plan.period });
      } else {
        const message = e instanceof Error ? e.message : String(e);
        capture("purchase_failed", { source, plan: plan.period, message });
        setError(message);
      }
    } finally {
      setBusy(false);
    }
  };

  if (purchased) {
    const lang = getLanguage();
    const storeClick = (store: "app_store" | "play_store") =>
      capture("post_purchase_store_click", { source, store });
    return (
      <div
        className="game-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("web.paywall.successTitle")}
      >
        <div className="game-modal__panel">
          <h2 className="game-modal__title">{t("web.paywall.successTitle")}</h2>
          <p className="game-modal__sub">{t("web.paywall.successSub")}</p>

          <div className="paywall-stores">
            <a
              className="game-btn game-btn--block"
              href={appStoreUrl(lang)}
              target="_blank"
              rel="noopener"
              onClick={() => storeClick("app_store")}
            >
              {t("web.paywall.successIos")}
            </a>
            <a
              className="game-btn game-btn--block"
              href={playStoreUrl("post-purchase", lang)}
              target="_blank"
              rel="noopener"
              onClick={() => storeClick("play_store")}
            >
              {t("web.paywall.successAndroid")}
            </a>
          </div>

          <button type="button" className="game-btn game-btn--ghost game-btn--block" onClick={onClose}>
            {t("web.paywall.successContinue")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-modal" role="dialog" aria-modal="true" aria-label={t("web.paywall.title")}>
      <div className="game-modal__panel">
        <button
          type="button"
          className="game-icon-btn game-modal__close"
          onClick={onClose}
          aria-label={t("web.account.close")}
        >
          ✕
        </button>

        <h2 className="game-modal__title">{t("web.paywall.title")}</h2>
        <p className="game-modal__sub">{t("web.paywall.sub")}</p>

        <ul className="paywall-features">
          <li>{t("web.paywall.f1")}</li>
          <li>{t("web.paywall.f2")}</li>
          <li>{t("web.paywall.f3")}</li>
        </ul>

        {plans === null && <p className="game-modal__sub">{t("web.paywall.loading")}</p>}

        {plans?.length === 0 && (
          <p className="game-modal__notice">{t("web.paywall.unavailable")}</p>
        )}

        {plans && plans.length > 0 && (
          <>
            <div className="paywall-plans">
              {plans.map((plan) => (
                <button
                  type="button"
                  key={plan.id}
                  className={`paywall-plan ${selected === plan.id ? "paywall-plan--on" : ""}`}
                  onClick={() => setSelected(plan.id)}
                  disabled={busy}
                >
                  <span className="paywall-plan__name">
                    {plan.period === "yearly" ? t("web.paywall.yearly") : t("web.paywall.monthly")}
                  </span>
                  <span className="paywall-plan__price">{plan.priceString}</span>
                </button>
              ))}
            </div>

            {error && <p className="game-modal__error">{error}</p>}

            <button
              type="button"
              className="game-btn game-btn--block"
              onClick={() => void handleSubscribe()}
              disabled={busy || !selected}
            >
              {busy ? t("web.paywall.wait") : t("web.paywall.cta")}
            </button>

            <p className="paywall-legal">{t("web.paywall.legal")}</p>
          </>
        )}
      </div>
    </div>
  );
}
