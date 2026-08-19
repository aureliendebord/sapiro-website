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

interface Props {
  user: User | null;
  onClose: () => void;
  onPurchased: () => void;
  /** Ouvre la modale de compte : s'abonner suppose un compte identifiable. */
  onNeedAccount: () => void;
}

/** Ce que débloque l'abonnement — mêmes trois promesses que l'app. */
const FEATURES = [
  "Parties illimitées, tous les jours",
  "Reprendre une partie de survie en cours",
  "Soutenir le développement de Sapiro",
];

export function PaywallModal({ user, onClose, onPurchased, onNeedAccount }: Props) {
  const [plans, setPlans] = useState<SubscriptionPlan[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      onNeedAccount();
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await purchasePlan(plan, user?.email ?? undefined);
      onPurchased();
    } catch (e) {
      if (!(e instanceof PurchaseCancelledError)) {
        setError(e instanceof Error ? e.message : String(e));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="game-modal" role="dialog" aria-modal="true" aria-label="Abonnement">
      <div className="game-modal__panel">
        <button
          type="button"
          className="game-icon-btn game-modal__close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>

        <h2 className="game-modal__title">Joue sans limite</h2>
        <p className="game-modal__sub">
          Ton abonnement vaut aussi sur l'app mobile, avec le même compte.
        </p>

        <ul className="paywall-features">
          {FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        {plans === null && <p className="game-modal__sub">Chargement des offres…</p>}

        {plans?.length === 0 && (
          <p className="game-modal__notice">
            L'abonnement en ligne n'est pas encore ouvert. En attendant, l'app mobile
            propose déjà l'illimité.
          </p>
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
                    {plan.period === "yearly" ? "Annuel" : "Mensuel"}
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
              {busy ? "Un instant…" : "S'abonner"}
            </button>

            <p className="paywall-legal">
              Résiliable à tout moment depuis ton compte.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
