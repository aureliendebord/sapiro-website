/**
 * Authentification du jeu web — Google (redirect OAuth) et email/mot de passe.
 *
 * Le point délicat est le même que sur mobile (cf. `lib/auth.ts` de l'app et la
 * migration 0019) : se connecter depuis une session anonyme ne « promeut » pas
 * cette session, Supabase renvoie l'utilisateur de l'identité cible, donc un
 * uid différent. Les parties, l'abonnement et la ligue de l'ancien uid seraient
 * orphelins. On rapatrie donc les données via l'edge function
 * `merge-anonymous-account`, exactement comme le mobile.
 *
 * Deux chemins, deux comportements :
 *  - `signUpWithEmail` sur session anonyme → `updateUser` : l'uid ne change
 *    PAS, aucun merge nécessaire. C'est le chemin nominal du web.
 *  - `signInWithEmail` / `signInWithGoogle` → l'uid change, merge requis.
 *
 * Google passant par un redirect complet, le jeton anonyme ne survit pas en
 * mémoire : il est mis de côté dans localStorage avant le départ et repris au
 * retour par `completePendingMerge`.
 */
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase } from "@game/lib/supabase";
import { flushPendingResults } from "@game/lib/gameResults";
import { capture, identifyAnalytics } from "@game/lib/analytics";

const PENDING_MERGE_KEY = "sapiro-web-pending-merge";
/** Un aller-retour OAuth dure moins d'une minute ; au-delà, le jeton anonyme
 *  a expiré (1 h) ou l'utilisateur a abandonné. */
const PENDING_MERGE_TTL_MS = 30 * 60 * 1000;

interface PendingMerge {
  oldUid: string;
  oldAccessToken: string;
  storedAt: number;
}

export class AuthUnavailableError extends Error {
  constructor() {
    super("Le service de comptes n'est pas configuré.");
    this.name = "AuthUnavailableError";
  }
}

function requireSupabase() {
  const supabase = getSupabase();
  if (!supabase) throw new AuthUnavailableError();
  return supabase;
}

/** Session anonyme au premier lancement : on joue sans compte, la progression
 *  est déjà rattachée à un utilisateur pour pouvoir la récupérer ensuite. */
export async function ensureSession(): Promise<Session | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;

  const { data: anon, error } = await supabase.auth.signInAnonymously();
  if (error) {
    // Non bloquant : le jeu reste jouable en local sans session.
    console.warn("[sapiro] session anonyme indisponible", error.message);
    return null;
  }
  return anon.session;
}

async function readAnonymousSession(): Promise<PendingMerge | null> {
  const supabase = requireSupabase();
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session?.user?.is_anonymous) return null;
  return {
    oldUid: session.user.id,
    oldAccessToken: session.access_token,
    storedAt: Date.now(),
  };
}

/**
 * Rapatrie les données de l'ancien compte anonyme. Ne jette jamais : un merge
 * raté ne doit pas déconnecter un utilisateur qui vient de s'authentifier.
 */
async function mergeAnonymousInto(pending: PendingMerge, newUid: string | null): Promise<boolean | null> {
  if (!newUid || newUid === pending.oldUid) return null;

  try {
    const supabase = requireSupabase();
    const { error } = await supabase.functions.invoke("merge-anonymous-account", {
      body: { old_access_token: pending.oldAccessToken },
    });
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn("[sapiro] fusion du compte anonyme échouée", e);
    return false;
  }
}

/**
 * Même événement que le mobile (`lib/auth.ts` de l'app) : `merged: false` est
 * le signal d'alerte d'une progression orpheline — il DOIT être visible dans
 * PostHog, pas seulement en console.
 */
function captureAccountLinked(
  provider: "google" | "email",
  wasAnonymous: boolean,
  uidChanged: boolean,
  merged: boolean | null,
): void {
  capture("account_linked", {
    provider,
    source: "web_game",
    was_anonymous: wasAnonymous,
    linked_in_place: wasAnonymous && !uidChanged,
    uid_changed: uidChanged,
    merged,
  });
}

/** Connexion Google : redirect, donc on met le jeton anonyme de côté. */
export async function signInWithGoogle(): Promise<void> {
  const supabase = requireSupabase();

  const pending = await readAnonymousSession();
  if (pending) {
    localStorage.setItem(PENDING_MERGE_KEY, JSON.stringify(pending));
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.href },
  });
  if (error) {
    localStorage.removeItem(PENDING_MERGE_KEY);
    throw error;
  }
}

/**
 * À appeler au démarrage : si on revient d'un redirect OAuth et que l'uid a
 * changé, la fusion se fait ici.
 */
export async function completePendingMerge(): Promise<void> {
  const raw = localStorage.getItem(PENDING_MERGE_KEY);
  if (!raw) return;
  localStorage.removeItem(PENDING_MERGE_KEY);

  let pending: PendingMerge;
  try {
    pending = JSON.parse(raw) as PendingMerge;
  } catch {
    return;
  }
  if (Date.now() - pending.storedAt > PENDING_MERGE_TTL_MS) return;

  const supabase = requireSupabase();
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  // Toujours anonyme : le retour OAuth a échoué, il n'y a rien à fusionner.
  if (!user || user.is_anonymous) return;

  identifyAnalytics(user.id);
  const merged = await mergeAnonymousInto(pending, user.id);
  captureAccountLinked("google", true, user.id !== pending.oldUid, merged);
  await flushPendingResults();
}

/**
 * Création de compte depuis une session anonyme : `updateUser` promeut la
 * session sur place. L'uid, et donc toute la progression, est conservé.
 */
export async function signUpWithEmail(email: string, password: string): Promise<User | null> {
  const supabase = requireSupabase();
  const { data } = await supabase.auth.getSession();

  if (data.session?.user?.is_anonymous) {
    const { data: updated, error } = await supabase.auth.updateUser({ email, password });
    if (error) throw error;
    captureAccountLinked("email", true, false, null);
    await flushPendingResults();
    return updated.user;
  }

  // Pas de session anonyme (session expirée, cookies effacés) : inscription
  // classique. Rien à fusionner, il n'y a pas de progression serveur à sauver.
  const { data: signed, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  captureAccountLinked("email", false, false, null);
  await flushPendingResults();
  return signed.user;
}

/** Connexion à un compte existant : l'uid change, donc fusion si anonyme. */
export async function signInWithEmail(email: string, password: string): Promise<User | null> {
  const supabase = requireSupabase();
  const pending = await readAnonymousSession();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const merged = pending ? await mergeAnonymousInto(pending, data.user?.id ?? null) : null;
  captureAccountLinked(
    "email",
    pending !== null,
    Boolean(pending && data.user && data.user.id !== pending.oldUid),
    merged,
  );
  await flushPendingResults();
  return data.user;
}

export async function resetPassword(email: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${window.location.pathname}?reset=1`,
  });
  if (error) throw error;
}

/** Applique le nouveau mot de passe (session de récupération active). */
export async function updatePassword(password: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const supabase = requireSupabase();
  await supabase.auth.signOut();
  // On repart d'une session anonyme : le jeu reste jouable, quota compris.
  await ensureSession();
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => data.subscription.unsubscribe();
}

/** Un utilisateur anonyme n'est pas « connecté » du point de vue de l'UI. */
export function isSignedIn(user: User | null): boolean {
  return Boolean(user && !user.is_anonymous);
}
