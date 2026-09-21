/**
 * Partage du Défi du jour — la boucle « bats mon score ».
 *
 * Le défi est le même pour tout le monde (seed par date, parité app↔web
 * vérifiée en CI) : c'est le seul mode où comparer deux scores a un sens.
 * Le lien partagé ramène sur le jeu avec le score à battre en paramètre ;
 * aucun backend, le score annoncé est déclaratif (comme une grille Wordle).
 */
import { PLAY_PATH } from "../../data/appLinks";
import { t, type GameLang } from "./i18n";

const SITE = "https://sapiro.app";

export interface Challenge {
  /** Jour du défi partagé, au format de `todayKey()` : YYYY-MM-DD. */
  dayKey: string;
  score: number;
  total: number;
}

export function challengeUrl(lang: GameLang, challenge: Challenge): string {
  const params = new URLSearchParams({
    defi: challenge.dayKey.replaceAll("-", ""),
    s: String(challenge.score),
    t: String(challenge.total),
    utm_source: "share",
    utm_medium: "social",
    utm_campaign: "daily-share",
  });
  return `${SITE}${PLAY_PATH[lang]}?${params.toString()}`;
}

/**
 * Lit un lien de défi dans l'URL courante. Tout est validé : ces paramètres
 * sont écrits par n'importe qui, et ils finissent affichés à l'écran.
 */
export function readChallenge(search: string): Challenge | null {
  const params = new URLSearchParams(search);
  const day = params.get("defi");
  if (!day || !/^\d{8}$/.test(day)) return null;

  const score = Number(params.get("s"));
  const total = Number(params.get("t"));
  if (!Number.isInteger(score) || !Number.isInteger(total)) return null;
  if (total < 1 || total > 50 || score < 0 || score > total) return null;

  return {
    dayKey: `${day.slice(0, 4)}-${day.slice(4, 6)}-${day.slice(6, 8)}`,
    score,
    total,
  };
}

/** Grille de résultat façon Wordle : lisible sans ouvrir le lien, sans spoiler. */
export function shareText(lang: GameLang, challenge: Challenge, answers: boolean[]): string {
  const [year, month, day] = challenge.dayKey.split("-");
  const date = lang === "en" ? `${month}/${day}/${year}` : `${day}/${month}/${year}`;
  const grid = answers.map((ok) => (ok ? "🟩" : "🟥")).join("");
  return [
    t("web.share.title", { date, score: challenge.score, total: challenge.total }),
    grid,
    t("web.share.beatMe"),
  ]
    .filter(Boolean)
    .join("\n");
}

export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

/**
 * Feuille de partage native sur téléphone (là où le lien part en message),
 * presse-papiers ailleurs : sur ordinateur, `navigator.share` ouvre une
 * fenêtre système que personne n'utilise.
 */
export async function shareChallenge(text: string, url: string, preferNative: boolean): Promise<ShareOutcome> {
  if (preferNative && typeof navigator.share === "function") {
    try {
      await navigator.share({ text, url });
      return "shared";
    } catch (error) {
      // Feuille refermée sans partager : ce n'est pas une erreur.
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
      // Sinon (permission, contexte non sécurisé) : repli presse-papiers.
    }
  }
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return "copied";
  } catch {
    return "failed";
  }
}
