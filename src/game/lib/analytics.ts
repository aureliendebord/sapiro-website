/**
 * Télémétrie PostHog du jeu web — mêmes événements que l'app mobile
 * (`ticket_consumed`, `quota_reached`, `account_linked`, funnel paywall…)
 * pour pouvoir comparer les deux plateformes dans les mêmes dashboards.
 *
 * L'envoi passe par posthog-js (cf. `src/lib/posthog.ts`), initialisé pour
 * tout le site par le layout. L'implémentation maison (POST sur /capture)
 * envoyait bien les événements métier mais aucun contexte d'arrivée :
 * impossible de savoir d'où venaient les joueurs. Le SDK attache `$referrer`,
 * `$current_url` et les `utm_*` à chaque event.
 *
 * `distinct_id` = uid Supabase (anonyme ou non) : c'est le même identifiant
 * que `posthog.identify` côté mobile, donc un joueur web+mobile est UNE
 * personne dans PostHog, pas deux.
 */
import { initAnalytics, posthog } from "../../lib/posthog";

/** Dernier uid transmis, pour ne pas ré-identifier à chaque event d'auth. */
let currentUid: string | null = null;

export function identifyAnalytics(uid: string | null): void {
  // `null` = session pas encore prête (le jeu ouvre une session anonyme au
  // démarrage). Ce n'est pas une déconnexion : cf. `resetAnalytics`.
  if (!uid || uid === currentUid) return;
  currentUid = uid;
  initAnalytics();
  posthog.identify(uid);
}

/**
 * Déconnexion : le jeu repart sur une nouvelle session anonyme, donc un
 * nouvel uid. Sans reset, posthog-js rattacherait ce nouvel uid à la personne
 * précédente — deux joueurs sur le même navigateur n'en feraient qu'un.
 */
export function resetAnalytics(): void {
  currentUid = null;
  initAnalytics();
  posthog.reset();
}

/** Envoi fire-and-forget : l'analytics ne doit jamais ralentir ni casser le jeu. */
export function capture(event: string, properties: Record<string, unknown> = {}): void {
  try {
    initAnalytics();
    posthog.capture(event, properties);
  } catch {
    // Bloqueur de pub, réseau coupé : tant pis, jamais d'erreur visible.
  }
}
