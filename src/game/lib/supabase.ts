/**
 * Client Supabase du jeu web — même projet que l'app mobile.
 *
 * Différences assumées avec `lib/supabase.ts` de l'app :
 *  - `detectSessionInUrl: true` : le retour de redirect OAuth (Google) et le
 *    lien de réinitialisation de mot de passe arrivent par l'URL sur le web.
 *  - stockage localStorage (par défaut côté navigateur) au lieu d'AsyncStorage.
 *
 * Le client est créé paresseusement : le jeu doit rester jouable même si les
 * variables d'environnement manquent (build de preview, développement local
 * sans backend). Dans ce cas, tout ce qui touche au compte est simplement
 * indisponible — le quiz, lui, tourne en local.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = import.meta.env.PUBLIC_SUPABASE_URL;
const ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;

  if (!URL || !ANON_KEY) {
    console.warn(
      "[sapiro] PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY absents : " +
        "le jeu tourne sans compte ni synchronisation.",
    );
    client = null;
    return client;
  }

  client = createClient(URL, ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });

  return client;
}

export function isBackendConfigured(): boolean {
  return Boolean(URL && ANON_KEY);
}
