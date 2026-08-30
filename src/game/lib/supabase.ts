/**
 * Client Supabase du jeu web — même projet que l'app mobile.
 *
 * Différences assumées avec `lib/supabase.ts` de l'app :
 *  - `detectSessionInUrl: true` : le retour de redirect OAuth (Google) et le
 *    lien de réinitialisation de mot de passe arrivent par l'URL sur le web.
 *  - stockage localStorage (par défaut côté navigateur) au lieu d'AsyncStorage.
 *
 * supabase-js pèse ~55 Ko gzip : il est chargé par import() dynamique pour ne
 * pas peser sur le premier paint (même raison que le SDK RevenueCat). Tous les
 * appelants sont déjà asynchrones, la signature async ne coûte rien.
 *
 * Le client est créé paresseusement : le jeu doit rester jouable même si les
 * variables d'environnement manquent — dans ce cas, tout ce qui touche au
 * compte est simplement indisponible.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

const URL = import.meta.env.PUBLIC_SUPABASE_URL;
const ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

let clientPromise: Promise<SupabaseClient | null> | undefined;

export function getSupabase(): Promise<SupabaseClient | null> {
  clientPromise ??= (async () => {
    if (!URL || !ANON_KEY) {
      console.warn(
        "[sapiro] PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY absents : " +
          "le jeu tourne sans compte ni synchronisation.",
      );
      return null;
    }

    const { createClient } = await import("@supabase/supabase-js");
    return createClient(URL, ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
  })();

  return clientPromise;
}

export function isBackendConfigured(): boolean {
  return Boolean(URL && ANON_KEY);
}
