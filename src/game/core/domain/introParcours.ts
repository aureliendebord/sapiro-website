// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import type { AppTheme, ThemeType } from "@/types";

/**
 * Bilan du mini parcours d'intro : ce que le joueur a réussi dans chacun des
 * cinq univers, et le thème de départ qu'on en déduit.
 *
 * Le bilan transite par un paramètre de navigation (le quiz et le résultat sont
 * deux écrans distincts), d'où la sérialisation en texte : « geography:2/2,art:1/2,… ».
 * Le format porte son propre libellé — un univers qui disparaîtrait de la
 * playlist disparaît simplement du bilan, sans décaler les autres.
 */
export interface SegmentScore {
  theme: ThemeType;
  score: number;
  total: number;
}

const THEMES: ThemeType[] = ["geography", "history", "art", "nature", "monument"];

export function parseSegmentScores(param?: string): SegmentScore[] {
  if (!param) return [];
  return param
    .split(",")
    .map((chunk) => {
      const [theme, ratio] = chunk.split(":");
      const [score, total] = (ratio ?? "").split("/").map((n) => Number.parseInt(n, 10));
      if (!THEMES.includes(theme as ThemeType)) return null;
      if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0) return null;
      return { theme: theme as ThemeType, score, total };
    })
    .filter((s): s is SegmentScore => s !== null);
}

/**
 * Thème de départ retenu : l'univers le mieux réussi.
 *
 * Deux garde-fous. Un ex æquo à trois univers ou plus (dont le cas « tout
 * juste » et le cas « tout faux ») ne désigne personne : on démarre en Mixte,
 * le seul thème qui ne referme aucune porte. Un ex æquo à deux se tranche par
 * l'ordre du parcours — arbitraire, mais stable et sans écran de plus.
 */
export function pickStartTheme(scores: SegmentScore[]): AppTheme {
  if (scores.length === 0) return "mix";
  const best = Math.max(...scores.map((s) => s.score));
  const tied = scores.filter((s) => s.score === best);
  if (tied.length >= 3) return "mix";
  return tied[0].theme;
}
