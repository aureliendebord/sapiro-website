import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  getPlans,
  isBillingConfigured,
  openCustomerPortal,
  purchasePlan,
  identifyUser,
  PurchaseCancelledError,
  yearlyAnchor,
  type SubscriptionPlan,
} from "@game/lib/purchases";
import { isSignedIn } from "@game/lib/auth";
import { capture } from "@game/lib/analytics";
import { getLanguage, t } from "@game/lib/i18n";
import { Icon } from "./ui/Icon";
import { appStoreUrl, playStoreUrl } from "../../data/appLinks";

interface Props {
  user: User | null;
  /** Emplacement d'origine (funnel PostHog, comme `source` sur mobile). */
  source: string;
  onClose: () => void;
  onPurchased: () => void;
  /** Ouvre la modale de compte — après l'achat, ou pour retrouver un
   *  abonnement déjà pris. L'achat lui-même n'exige PAS de compte. */
  onNeedAccount: () => void;
}

/**
 * Écran d'abonnement — port de `app/subscription.tsx` de l'app.
 *
 * Structure reprise telle quelle parce qu'elle est le fruit de plusieurs
 * itérations mesurées : hero illustré, pastille de preuve chiffrée, exactement
 * trois bénéfices (au-delà, plus personne ne lit), offres avec ancrage, et un
 * CTA épinglé qui annonce le prix débité. Pas de croix : la seule sortie est
 * « Non merci », sous le bouton — un choix explicite plutôt qu'un réflexe.
 *
 * Trois écarts assumés avec le mobile, imposés par le web :
 *  - « Restaurer mes achats » n'a pas de sens en Web Billing (l'entitlement
 *    suit l'uid) : remplacé par « J'ai déjà un abonnement » → connexion ;
 *  - la résiliation passe par le portail RevenueCat, pas par l'App Store ;
 *  - l'essai n'est annoncé que si l'offering web en expose réellement un.
 */
export function PaywallModal({ user, source, onClose, onPurchased, onNeedAccount }: Props) {
  const [plans, setPlans] = useState<SubscriptionPlan[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Après l'achat, la modale devient l'écran de handoff web → app : c'est le
  // moment où l'utilisateur est le plus motivé pour installer l'app mobile.
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    capture("paywall_viewed", { source });
  }, [source]);

  useEffect(() => {
    if (!isBillingConfigured()) {
      setPlans([]);
      capture("paywall_offer_unavailable", { source, reason: "not_configured" });
      return;
    }
    let cancelled = false;
    void getPlans()
      .then((list) => {
        if (cancelled) return;
        setPlans(list);
        // L'annuel est le meilleur rapport : présélectionné, comme l'app.
        setSelected(list.find((p) => p.period === "yearly")?.id ?? list[0]?.id ?? null);
        capture(list.length ? "paywall_offer_shown" : "paywall_offer_unavailable", {
          source,
          plans: list.length,
        });
      })
      .catch((e) => {
        if (cancelled) return;
        setPlans([]);
        setError(e instanceof Error ? e.message : String(e));
        capture("paywall_offer_unavailable", { source, reason: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [source]);

  const anchor = useMemo(
    () => (plans ? yearlyAnchor(plans, getLanguage()) : null),
    [plans],
  );

  const current = plans?.find((p) => p.id === selected) ?? null;
  const trialDays = current?.trialDays ?? 0;

  const handleSubscribe = async () => {
    if (!current) return;

    setBusy(true);
    setError(null);
    capture("paywall_cta_clicked", {
      source,
      plan: current.period,
      trial_days: trialDays,
      signed_in: isSignedIn(user),
    });
    try {
      // On achète avec l'identité de la session courante, anonyme comprise :
      // demander un compte AVANT de payer coûtait une étape entière au moment
      // le plus fragile du tunnel. L'identité anonyme est aliasée sur le compte
      // à sa création (cf. `identifyUser`), l'abonnement suit donc jusqu'à
      // l'app mobile — l'écran de fin réclame ce compte tout de suite après.
      if (user) await identifyUser(user.id, Boolean(user.is_anonymous));
      await purchasePlan(current, isSignedIn(user) ? (user.email ?? undefined) : undefined);
      capture("purchase_completed", { source, plan: current.period });
      onPurchased();
      setPurchased(true);
    } catch (e) {
      if (e instanceof PurchaseCancelledError) {
        capture("purchase_cancelled", { source, plan: current.period });
      } else {
        const message = e instanceof Error ? e.message : String(e);
        capture("purchase_failed", { source, plan: current.period, message });
        setError(message);
      }
    } finally {
      setBusy(false);
    }
  };

  const dismiss = () => {
    capture("paywall_dismissed", { source });
    onClose();
  };

  // Écran de handoff web → app, affiché à la place du paywall après l'achat :
  // c'est le moment où l'utilisateur est le plus motivé pour installer l'app.
  if (purchased) {
    const lang = getLanguage();
    const storeClick = (store: "app_store" | "play_store") =>
      capture("post_purchase_store_click", { source, store });
    // L'achat a pu se faire sans compte : sans compte, l'abonnement ne vaut
    // que sur ce navigateur. C'est donc ici, et pas avant le paiement, qu'on
    // le réclame — l'utilisateur vient de payer, il a toutes les raisons de
    // finir l'étape.
    const needsAccount = !isSignedIn(user);
    return (
      <div
        className="game-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("web.paywall.successTitle")}
      >
        <div className="game-modal__panel">
          <h2 className="game-modal__title">{t("web.paywall.successTitle")}</h2>
          <p className="game-modal__sub">
            {needsAccount ? t("web.paywall.successSubNoAccount") : t("web.paywall.successSub")}
          </p>

          {needsAccount && (
            <button
              type="button"
              className="game-btn game-btn--block"
              onClick={() => {
                capture("post_purchase_account_cta", { source });
                onNeedAccount();
              }}
            >
              {t("web.paywall.successAccount")}
            </button>
          )}

          <div className="paywall-stores">
            <a
              className={`game-btn game-btn--block ${needsAccount ? "game-btn--ghost" : ""}`}
              href={appStoreUrl(lang)}
              target="_blank"
              rel="noopener"
              onClick={() => storeClick("app_store")}
            >
              {t("web.paywall.successIos")}
            </a>
            <a
              className={`game-btn game-btn--block ${needsAccount ? "game-btn--ghost" : ""}`}
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
    <div className="paywall" role="dialog" aria-modal="true" aria-label={t("web.paywall.title")}>
      <div className="paywall__panel">
        <header className="paywall__hero">
          <img src="/images/game/paywall-hero.webp" alt="" className="paywall__hero-img" />

          <div className="paywall__hero-content">
            <span className="paywall__proof">
              <Icon emoji="✅" size={18} radius={6} />
              {t("web.paywall.proof")}
            </span>

            <h2 className="paywall__title">
              {trialDays > 0 ? t("web.paywall.titleTrial", { days: trialDays }) : t("web.paywall.title")}
            </h2>
            <p className="paywall__sub">{t("web.paywall.sub")}</p>

            {/* Exactement trois lignes : au-delà, plus personne ne lit. */}
            <ul className="paywall__features">
              <li>{t("web.paywall.f1")}</li>
              <li>{t("web.paywall.f2")}</li>
              <li>{t("web.paywall.f3")}</li>
            </ul>
          </div>
        </header>

        <div className="paywall__sheet">
          {plans === null && <p className="game-modal__sub">{t("web.paywall.loading")}</p>}

          {plans?.length === 0 && (
            <p className="game-modal__notice">{t("web.paywall.unavailable")}</p>
          )}

          {plans && plans.length > 0 && (
            <>
              <div className="paywall-plans">
                {plans.map((plan) => {
                  const isYearly = plan.period === "yearly";
                  const on = selected === plan.id;
                  return (
                    <button
                      type="button"
                      key={plan.id}
                      className={`plan ${on ? "plan--on" : ""}`}
                      onClick={() => {
                        setSelected(plan.id);
                        capture("plan_selected", { source, plan: plan.period });
                      }}
                      disabled={busy}
                    >
                      {isYearly && <span className="plan__badge">{t("web.paywall.popular")}</span>}

                      <span className="plan__left">
                        <span className="plan__name">
                          {isYearly ? t("web.paywall.yearly") : t("web.paywall.monthly")}
                        </span>
                        {plan.trialDays > 0 && (
                          <span className="plan__savings">
                            {t("web.paywall.trialThen", {
                              days: plan.trialDays,
                              price: plan.priceString,
                            })}
                          </span>
                        )}
                        {isYearly && anchor && (
                          <span className="plan__anchor">
                            {t("web.paywall.anchor", {
                              perMonth: anchor.perMonth,
                              percent: anchor.discountPercent,
                            })}
                          </span>
                        )}
                      </span>

                      <span className="plan__price">{plan.priceString}</span>
                    </button>
                  );
                })}
              </div>

              {error && <p className="game-modal__error">{error}</p>}

              <button
                type="button"
                className="paywall__restore"
                onClick={() => {
                  capture("paywall_needs_account", { source, signed_in: isSignedIn(user) });
                  if (isSignedIn(user)) void openCustomerPortal();
                  else onNeedAccount();
                }}
              >
                {t("web.paywall.alreadySubscribed")}
              </button>

              <p className="paywall__legal">{t("web.paywall.legal")}</p>
            </>
          )}
        </div>

        {plans && plans.length > 0 && (
          <footer className="paywall__footer">
            <button
              type="button"
              className="paywall__cta"
              onClick={() => void handleSubscribe()}
              disabled={busy || !current}
            >
              <span className="paywall__cta-label">
                {busy
                  ? t("web.paywall.wait")
                  : trialDays > 0
                    ? t("web.paywall.ctaTrial", { days: trialDays })
                    : t("web.paywall.cta")}
              </span>
              {/* Le prix débité doit être visible sur le bouton, pas caché
                  dans les mentions légales. */}
              {current && (
                <span className="paywall__cta-price">
                  {trialDays > 0
                    ? t("web.paywall.thenPrice", { price: current.priceString })
                    : current.priceString}
                </span>
              )}
            </button>

            <button type="button" className="paywall__dismiss" onClick={dismiss}>
              {t("web.paywall.noThanks")}
            </button>
          </footer>
        )}

        {(plans === null || plans.length === 0) && (
          <footer className="paywall__footer">
            <button type="button" className="paywall__dismiss" onClick={dismiss}>
              {t("web.paywall.noThanks")}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
