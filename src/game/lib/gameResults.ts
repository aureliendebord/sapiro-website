/**
 * Enregistrement des parties dans `game_results` — pendant web de
 * `lib/leaderboard.ts` de l'app.
 *
 * Même table, mêmes colonnes, même idempotence par `(user_id, client_id)` :
 * une partie jouée sur le web et une partie jouée sur mobile sont
 * indistinguables en base, ce qui rend le classement et le comptage
 * de parties par jour cohérents entre les deux plateformes.
 *
 * L'insertion est best-effort : sans session ou hors-ligne, la partie part en
 * file d'attente locale et sera renvoyée au prochain démarrage. Une partie ne
 * doit jamais être perdue parce que le réseau a hoqueté.
 */
import { getSupabase } from "@game/lib/supabase";
import type { SessionResult } from "@game/lib/quizSession";

const QUEUE_KEY = "sapiro-web-pending-results";
/** Au-delà, on jette les plus anciennes : la file est un filet, pas une archive. */
const QUEUE_LIMIT = 50;

interface PendingResult {
  client_id: string;
  mode: string;
  journey: string | null;
  theme: string | null;
  score: number;
  total_questions: number;
  xp_earned: number;
  duration: number;
  played_at: string;
}

function readQueue(): PendingResult[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as PendingResult[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(items: PendingResult[]): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items.slice(-QUEUE_LIMIT)));
  } catch {
    // Quota localStorage plein : tant pis pour la file, la partie est jouée.
  }
}

function toRow(result: SessionResult): PendingResult {
  return {
    client_id: crypto.randomUUID(),
    mode: result.mode,
    journey: result.journeyId ?? null,
    theme: result.theme ?? null,
    score: result.score,
    total_questions: result.totalQuestions,
    xp_earned: result.xp.totalXP,
    duration: result.durationSeconds,
    played_at: new Date().toISOString(),
  };
}

/**
 * La table n'accepte que `classic|survival|daily` (contrainte CHECK de la
 * migration 0003). La révision est une relecture du deck local, pas une partie
 * classée : on ne la remonte pas.
 */
function isSyncableMode(mode: string): boolean {
  return mode === "classic" || mode === "survival" || mode === "daily";
}

async function insertRows(rows: PendingResult[]): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id;
  if (!userId) return false;

  const { error } = await supabase
    .from("game_results")
    .upsert(
      rows.map((row) => ({ ...row, user_id: userId })),
      // Rejouer la file après un envoi partiel ne doit pas créer de doublon.
      { onConflict: "user_id,client_id", ignoreDuplicates: true },
    );

  return !error;
}

/** Enregistre une partie ; met en file d'attente si l'envoi échoue. */
export async function recordGameResult(result: SessionResult): Promise<void> {
  if (!isSyncableMode(result.mode)) return;

  const row = toRow(result);
  const sent = await insertRows([row]).catch(() => false);
  if (!sent) writeQueue([...readQueue(), row]);
}

/**
 * Vide la file d'attente. À appeler au démarrage du jeu et après une
 * connexion : les parties jouées en anonyme suivent le compte.
 */
export async function flushPendingResults(): Promise<void> {
  const queue = readQueue();
  if (!queue.length) return;

  const sent = await insertRows(queue).catch(() => false);
  if (sent) writeQueue([]);
}
