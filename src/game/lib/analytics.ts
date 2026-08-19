/**
 * Télémétrie PostHog du jeu web — mêmes événements que l'app mobile
 * (`ticket_consumed`, `quota_reached`, `account_linked`, funnel paywall…)
 * pour pouvoir comparer les deux plateformes dans les mêmes dashboards.
 *
 * Volontairement sans SDK : un POST sur l'endpoint /capture suffit pour de
 * l'event tracking, et ça ne coûte rien au bundle. La clé est celle de l'app
 * (clé publique, déjà embarquée dans les binaires mobiles), surchargeable par
 * variable d'environnement.
 *
 * `distinct_id` = uid Supabase quand une session existe : c'est le même
 * identifiant que `posthog.identify` côté mobile, donc un joueur web+mobile
 * est UNE personne dans PostHog, pas deux.
 */
const API_KEY =
  import.meta.env.PUBLIC_POSTHOG_KEY ?? "phc_NGufvhzHB3uncrdEjmqliH5lrXGt8Yj9O2lJtoVmvH2";
const HOST = import.meta.env.PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

const ANON_ID_KEY = "sapiro-web-analytics-id";

/** Uid Supabase courant, posé par le jeu dès que la session existe. */
let distinctId: string | null = null;

export function identifyAnalytics(uid: string | null): void {
  distinctId = uid;
}

function fallbackId(): string {
  try {
    let id = localStorage.getItem(ANON_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch {
    return "web-anonymous";
  }
}

/** Envoi fire-and-forget : l'analytics ne doit jamais ralentir ni casser le jeu. */
export function capture(event: string, properties: Record<string, unknown> = {}): void {
  if (!API_KEY) return;

  const body = JSON.stringify({
    api_key: API_KEY,
    event,
    distinct_id: distinctId ?? fallbackId(),
    properties: { platform: "web", ...properties },
    timestamp: new Date().toISOString(),
  });

  try {
    // sendBeacon survit aux navigations (clic vers le store, redirect OAuth).
    if (navigator.sendBeacon?.(`${HOST}/capture/`, body)) return;
    void fetch(`${HOST}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Bloqueur de pub, réseau coupé : tant pis, jamais d'erreur visible.
  }
}
