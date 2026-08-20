/**
 * Lecture du classement — mêmes RPC que l'app (`lib/leaderboard.ts`).
 *
 * Le classement est partagé entre les deux plateformes : un joueur web apparaît
 * dans la même table qu'un joueur mobile, avec l'XP des parties enregistrées
 * dans `game_results`. C'est aussi le meilleur argument de création de compte —
 * un anonyme voit le classement mais n'y figure pas.
 *
 * Les RPC sont `security definer` et accordées à `anon` : elles répondent donc
 * dès la session anonyme, sans exiger de compte.
 */
import { getSupabase } from "@game/lib/supabase";

export type LeaderboardMetric = "xp" | "survival";
export type LeaderboardPeriod = "all" | "month" | "week";

export interface LeaderboardRow {
  rank: number;
  user_id: string;
  pseudo: string;
  avatar: string;
  pro_badge: string | null;
  skin_id: string | null;
  value: number;
  is_me: boolean;
}

export interface MyRank {
  rank: number | null;
  value: number;
}

export interface LeagueInfo {
  season: number;
  tier: number;
  pool: number;
  ends_at: string;
  members: LeaderboardRow[];
  my_rank: number | null;
  pool_size: number;
}

/**
 * Top du classement. `theme` filtre par univers ('all' par défaut) — même
 * whitelist que l'app, validée côté serveur.
 */
export async function fetchLeaderboard(
  metric: LeaderboardMetric,
  period: LeaderboardPeriod,
  opts: { limit?: number; offset?: number; theme?: string } = {},
): Promise<LeaderboardRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("get_leaderboard", {
    metric,
    period,
    max_rows: opts.limit ?? 50,
    row_offset: opts.offset ?? 0,
    theme: opts.theme ?? "all",
  });

  if (error) {
    console.warn("[sapiro] classement indisponible", error.message);
    return [];
  }
  return (data ?? []) as LeaderboardRow[];
}

/** Rang du joueur courant, `null` s'il n'a encore aucune partie enregistrée. */
export async function fetchMyRank(
  metric: LeaderboardMetric,
  period: LeaderboardPeriod,
  theme = "all",
): Promise<MyRank | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("get_my_rank", { metric, period, theme });
  if (error || !data?.length) return null;

  const row = data[0] as { rank: number | null; value: number };
  return { rank: row.rank, value: row.value };
}

/** Records de survie, tous joueurs confondus. */
export async function fetchSurvivalRecords(): Promise<LeaderboardRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("get_survival_records_global");
  if (error) {
    console.warn("[sapiro] records indisponibles", error.message);
    return [];
  }
  return (data ?? []) as LeaderboardRow[];
}

/**
 * Ligue de la semaine : la poule du joueur, son rang et la date de clôture.
 * `null` tant qu'il n'est affecté à aucune poule (aucune partie jouée).
 */
export async function fetchMyLeague(): Promise<LeagueInfo | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("get_my_league");
  if (error || !data) return null;

  // La RPC renvoie un objet unique (ou une ligne selon la version).
  const league = Array.isArray(data) ? data[0] : data;
  return (league as LeagueInfo) ?? null;
}
