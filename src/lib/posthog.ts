/**
 * Client PostHog du site (pages marketing + jeu web).
 *
 * Remplace le POST maison sur /capture : celui-ci envoyait les événements
 * métier mais rien du contexte d'arrivée. Résultat, les visiteurs web étaient
 * comptés sans qu'on sache d'où ils venaient. posthog-js attache
 * automatiquement `$referrer`, `$current_url` et les `utm_*` à chaque event,
 * et émet les `$pageview` — y compris sur les pages du site, pas seulement
 * sur /jouer.
 *
 * Clé publique (déjà embarquée dans les binaires mobiles), surchargeable par
 * variable d'environnement.
 */
import posthog from "posthog-js";

const API_KEY =
  import.meta.env.PUBLIC_POSTHOG_KEY ?? "phc_NGufvhzHB3uncrdEjmqliH5lrXGt8Yj9O2lJtoVmvH2";
const HOST = import.meta.env.PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

let started = false;

/** Idempotent : appelé par le layout, et défensivement par le jeu. */
export function initAnalytics(): void {
  if (started || typeof window === "undefined" || !API_KEY) return;
  started = true;

  posthog.init(API_KEY, {
    api_host: HOST,
    // RGPD : ni cookie (donc pas de bandeau de consentement à ajouter), ni
    // session replay — même posture que l'app mobile.
    persistence: "localStorage",
    disable_session_recording: true,
    // Le `$pageview` est émis explicitement ci-dessous plutôt que laissé à
    // l'auto-capture : selon la version du SDK et la config distante, celle-ci
    // ne se déclenche pas toujours (constaté sur 1.425). Le site est
    // multi-pages, donc un init = un chargement = un pageview.
    capture_pageview: false,
    capture_pageleave: true,
    // Volontairement coupé : l'app mobile génère déjà ~785k $autocapture par
    // mois. Ce qui manquait c'était l'attribution, pas le clic anonyme.
    autocapture: false,
  });

  // `platform: "web"` sur TOUS les events, `$pageview` compris : les
  // requêtes et dashboards existants filtrent là-dessus.
  posthog.register({ platform: "web" });

  posthog.capture("$pageview");

  trackStoreClicks();
}

/**
 * Clic vers un store, mesuré en un seul point.
 *
 * C'est le maillon qui manquait pour répondre à « est-ce que le site amène
 * des installs ? » : jusqu'ici le site envoyait des `$pageview` et le jeu ses
 * events de partie, mais rien entre le visiteur et la fiche store — donc
 * aucun moyen de relier le trafic web aux téléchargements.
 *
 * Écouteur délégué plutôt qu'un `onClick` par bouton : les liens stores sont
 * déjà centralisés (`data/appLinks.ts`) et posés dans six composants, et
 * l'autocapture est coupée (le mobile sature déjà `$autocapture`). Un seul
 * écouteur couvre les liens actuels ET ceux qu'on ajoutera, sans rien oublier.
 *
 * La campagne provient de l'attribut déjà présent sur les liens
 * (`data-umami-event-campaign`) ; à défaut, du `referrer` du lien Play. Les
 * liens App Store n'ont aucun paramètre exploitable côté Apple : c'est
 * précisément l'emplacement mesuré ici qui donne l'information.
 */
function storeFromHref(href: string): "app_store" | "play_store" | null {
  try {
    const { hostname } = new URL(href, window.location.href);
    if (hostname.endsWith("apps.apple.com") || hostname.endsWith("itunes.apple.com")) {
      return "app_store";
    }
    if (hostname.endsWith("play.google.com")) return "play_store";
  } catch {
    // href relatif exotique ou vide : ce n'est pas un lien store.
  }
  return null;
}

function campaignFor(link: HTMLAnchorElement, store: string): string {
  const explicit =
    link.dataset.storeCampaign ??
    link.getAttribute("data-umami-event-campaign") ??
    undefined;
  if (explicit) return explicit;

  if (store === "play_store") {
    try {
      const referrer = new URL(link.href).searchParams.get("referrer");
      const campaign = referrer && new URLSearchParams(referrer).get("utm_campaign");
      if (campaign) return campaign;
    } catch {
      // Lien Play sans referrer : on retombe sur "unknown".
    }
  }
  return "unknown";
}

function trackStoreClicks(): void {
  document.addEventListener(
    "click",
    (event) => {
      const link = (event.target as Element | null)?.closest?.("a[href]") as
        | HTMLAnchorElement
        | null;
      if (!link) return;

      const store = storeFromHref(link.getAttribute("href") ?? "");
      if (!store) return;

      posthog.capture("store_cta_clicked", {
        store,
        campaign: campaignFor(link, store),
        page: window.location.pathname,
        lang: document.documentElement.lang || null,
      });
    },
    // Capture : l'event part avant qu'un handler applicatif n'arrête la
    // propagation. Les liens stores ouvrent un nouvel onglet, la page reste
    // vivante le temps de l'envoi.
    true,
  );
}

export { posthog };
