/**
 * Abonnement web via RevenueCat Web Billing (Stripe en dessous).
 *
 * Le choix structurant : on utilise le MÊME projet RevenueCat que l'app mobile,
 * avec le même entitlement « Sapiro Pro » et le même `appUserId` (l'uid
 * Supabase). Conséquence directe : un achat web donne le premium sur mobile et
 * un abonné App Store est premium sur le web, sans aucun code de
 * synchronisation. Le webhook `revenuecat-webhook` de l'app reçoit les
 * événements web comme les autres (`store: RC_BILLING`) et alimente la même
 * table `subscriptions`.
 *
 * Le statut premium lu par l'UI vient d'ici (SDK, source de vérité), plus la
 * table `premium_overrides` pour les accès accordés à la main — même règle que
 * `stores/subscriptionStore.ts` de l'app.
 *
 * Le SDK (~1 Mo dist) est chargé par import() dynamique : il ne doit pas peser
 * sur le premier paint du jeu alors qu'une minorité de visiteurs ouvre le
 * paywall. Toutes les fonctions publiques sont async, l'appelant ne voit rien.
 */
import type { CustomerInfo, Package, Purchases } from "@revenuecat/purchases-js";
import { getSupabase } from "@game/lib/supabase";

const API_KEY = import.meta.env.PUBLIC_RC_WEB_API_KEY;

/** Identique à l'app (`stores/subscriptionStore.ts`). */
const ENTITLEMENT_ID = "Sapiro Pro";

type SDK = typeof import("@revenuecat/purchases-js");

let sdkPromise: Promise<SDK> | null = null;
let configuredFor: string | null = null;

function loadSdk(): Promise<SDK> {
  sdkPromise ??= import("@revenuecat/purchases-js");
  return sdkPromise;
}

/**
 * Aperçu du paywall sans backend : `?preview=paywall`, développement seulement.
 * Permet de relire la mise en page (badge, ancrage, essai, CTA) avant que les
 * produits Web Billing existent côté RevenueCat.
 */
function isPaywallPreview(): boolean {
  return (
    import.meta.env.DEV &&
    typeof location !== "undefined" &&
    new URLSearchParams(location.search).get("preview") === "paywall"
  );
}

export function isBillingConfigured(): boolean {
  return Boolean(API_KEY) || isPaywallPreview();
}

/**
 * Associe le SDK à l'utilisateur courant et ATTEND que le changement soit
 * effectif : c'est l'`appUserId` qui porte l'entitlement d'une plateforme à
 * l'autre, et un `getCustomerInfo` parti avant la fin d'un `changeUser`
 * répondrait pour l'ancien utilisateur (abonné affiché gratuit).
 */
export async function identifyUser(uid: string): Promise<Purchases | null> {
  if (!API_KEY) return null;

  const { Purchases } = await loadSdk();

  if (configuredFor === null) {
    configuredFor = uid;
    return Purchases.configure({ apiKey: API_KEY, appUserId: uid });
  }

  const purchases = Purchases.getSharedInstance();
  if (configuredFor !== uid) {
    configuredFor = uid;
    await purchases.changeUser(uid);
  }
  return purchases;
}

export interface SubscriptionPlan {
  /** Identifiant de package RevenueCat, à repasser à `purchasePlan`. */
  id: string;
  /** Prix déjà formaté et localisé par RevenueCat — jamais codé en dur. */
  priceString: string;
  period: "monthly" | "yearly" | "unknown";
  /** Prix brut, pour calculer l'ancrage mensuel de l'offre annuelle. */
  amountMicros: number;
  currency: string;
  /** Jours d'essai gratuit, 0 si l'offering web n'en propose pas. */
  trialDays: number;
  rcPackage: Package;
}

function periodOf(pkg: Package): SubscriptionPlan["period"] {
  const id = pkg.identifier.toLowerCase();
  if (id.includes("annual") || id.includes("year")) return "yearly";
  if (id.includes("month")) return "monthly";
  return "unknown";
}

/**
 * Durée de l'essai gratuit en jours. Web Billing expose la phase d'essai en
 * ISO 8601 (P7D, P1W, P1M) : on la normalise pour pouvoir écrire « 7 jours »
 * dans le CTA, comme sur mobile. Zéro si l'offering n'accorde pas d'essai —
 * dans ce cas le paywall ne doit PAS en promettre un.
 */
function trialDaysOf(pkg: Package): number {
  const phase = pkg.webBillingProduct.freeTrialPhase;
  const period = phase?.period;
  if (!period) return 0;

  const perUnit: Record<string, number> = { day: 1, week: 7, month: 30, year: 365 };
  return period.number * (perUnit[period.unit] ?? 0);
}

/**
 * Offres disponibles. Les prix viennent de RevenueCat (devise selon le pays du
 * visiteur) : aucun montant n'est écrit dans le code du site.
 */
export async function getPlans(): Promise<SubscriptionPlan[]> {
  if (isPaywallPreview()) return PREVIEW_PLANS;
  if (!API_KEY) return [];

  const { Purchases } = await loadSdk();
  const offerings = await Purchases.getSharedInstance().getOfferings();
  const packages = offerings.current?.availablePackages ?? [];

  return packages.map((pkg) => {
    const price = pkg.webBillingProduct.currentPrice;
    return {
      id: pkg.identifier,
      priceString: price.formattedPrice,
      period: periodOf(pkg),
      amountMicros: price.amountMicros,
      currency: price.currency,
      trialDays: trialDaysOf(pkg),
      rcPackage: pkg,
    };
  });
}

/**
 * Ancrage de l'offre annuelle : « soit X/mois · −N % ». Calculé depuis les
 * prix réels renvoyés par RevenueCat, jamais depuis des montants écrits en
 * dur — c'est la règle de l'app, et une promo côté dashboard doit se refléter
 * ici sans redéploiement.
 *
 * `null` s'il n'y a pas les deux offres à comparer.
 */
export function yearlyAnchor(
  plans: SubscriptionPlan[],
  lang: string,
): { perMonth: string; discountPercent: number } | null {
  const yearly = plans.find((p) => p.period === "yearly");
  const monthly = plans.find((p) => p.period === "monthly");
  if (!yearly || !monthly || monthly.amountMicros <= 0) return null;

  const yearlyPerMonthMicros = yearly.amountMicros / 12;
  const discount = 1 - yearlyPerMonthMicros / monthly.amountMicros;
  if (discount <= 0) return null;

  const perMonth = new Intl.NumberFormat(lang, {
    style: "currency",
    currency: yearly.currency,
  }).format(yearlyPerMonthMicros / 1_000_000);

  return { perMonth, discountPercent: Math.round(discount * 100) };
}

/** Offres factices d'aperçu — développement uniquement (cf. `isPaywallPreview`). */
const PREVIEW_PLANS: SubscriptionPlan[] = [
  {
    id: "$rc_annual",
    priceString: "39,99 €",
    period: "yearly",
    amountMicros: 39_990_000,
    currency: "EUR",
    trialDays: 7,
    rcPackage: null as unknown as Package,
  },
  {
    id: "$rc_monthly",
    priceString: "6,99 €",
    period: "monthly",
    amountMicros: 6_990_000,
    currency: "EUR",
    trialDays: 7,
    rcPackage: null as unknown as Package,
  },
];

export class PurchaseCancelledError extends Error {
  constructor() {
    super("Achat annulé");
    this.name = "PurchaseCancelledError";
  }
}

/**
 * Ouvre le tunnel de paiement RevenueCat. `customerEmail` évite de redemander
 * l'adresse à quelqu'un déjà connecté.
 */
export async function purchasePlan(
  plan: SubscriptionPlan,
  customerEmail?: string,
): Promise<CustomerInfo> {
  if (!API_KEY) throw new Error("Le paiement en ligne n'est pas configuré.");

  const { Purchases, PurchasesError, ErrorCode } = await loadSdk();
  try {
    const { customerInfo } = await Purchases.getSharedInstance().purchase({
      rcPackage: plan.rcPackage,
      customerEmail,
    });
    return customerInfo;
  } catch (e) {
    if (e instanceof PurchasesError && e.errorCode === ErrorCode.UserCancelledError) {
      throw new PurchaseCancelledError();
    }
    throw e;
  }
}

export function hasEntitlement(info: CustomerInfo | null): boolean {
  return Boolean(info?.entitlements.active[ENTITLEMENT_ID]);
}

/**
 * Statut premium : entitlement RevenueCat OU accès accordé à la main dans
 * `premium_overrides`. Même règle que l'app.
 *
 * Retourne `null` quand le statut est INCONNU (erreur réseau/RLS sur la
 * requête d'override) : l'appelant garde alors l'état courant au lieu de
 * rétrograder quelqu'un en « gratuit » sur un incident réseau.
 */
export async function fetchPremiumStatus(uid: string): Promise<boolean | null> {
  let entitled = false;

  if (API_KEY) {
    try {
      await identifyUser(uid);
      const { Purchases } = await loadSdk();
      const info = await Purchases.getSharedInstance().getCustomerInfo();
      entitled = hasEntitlement(info);
    } catch (e) {
      console.warn("[sapiro] statut d'abonnement indisponible", e);
    }
  }
  if (entitled) return true;

  const supabase = await getSupabase();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("premium_overrides")
    .select("user_id")
    .eq("user_id", uid)
    .maybeSingle();

  if (error) {
    console.warn("[sapiro] premium_overrides inaccessible", error.message);
    return null;
  }
  return Boolean(data);
}

/**
 * Portail client RevenueCat : changement de moyen de paiement et résiliation.
 * Rien à construire de notre côté.
 */
export async function openCustomerPortal(): Promise<boolean> {
  if (!API_KEY) return false;

  const { Purchases } = await loadSdk();
  const info = await Purchases.getSharedInstance().getCustomerInfo();
  const url = info.managementURL;
  if (!url) return false;

  window.open(url, "_blank", "noopener");
  return true;
}
