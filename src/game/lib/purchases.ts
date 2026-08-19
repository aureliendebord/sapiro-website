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

export function isBillingConfigured(): boolean {
  return Boolean(API_KEY);
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
  rcPackage: Package;
}

function periodOf(pkg: Package): SubscriptionPlan["period"] {
  const id = pkg.identifier.toLowerCase();
  if (id.includes("annual") || id.includes("year")) return "yearly";
  if (id.includes("month")) return "monthly";
  return "unknown";
}

/**
 * Offres disponibles. Les prix viennent de RevenueCat (devise selon le pays du
 * visiteur) : aucun montant n'est écrit dans le code du site.
 */
export async function getPlans(): Promise<SubscriptionPlan[]> {
  if (!API_KEY) return [];

  const { Purchases } = await loadSdk();
  const offerings = await Purchases.getSharedInstance().getOfferings();
  const packages = offerings.current?.availablePackages ?? [];

  return packages.map((pkg) => ({
    id: pkg.identifier,
    priceString: pkg.webBillingProduct.currentPrice.formattedPrice,
    period: periodOf(pkg),
    rcPackage: pkg,
  }));
}

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
 * `premium_overrides`. Même règle que l'app — un override ne doit pas être
 * annulé par une erreur réseau, d'où le `?? false` seulement sur l'absence
 * de ligne, jamais sur l'échec de la requête.
 */
export async function fetchPremiumStatus(uid: string): Promise<boolean> {
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

  const supabase = getSupabase();
  if (!supabase) return false;

  const { data } = await supabase
    .from("premium_overrides")
    .select("user_id")
    .eq("user_id", uid)
    .maybeSingle();

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
