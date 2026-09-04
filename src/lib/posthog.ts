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
}

export { posthog };
