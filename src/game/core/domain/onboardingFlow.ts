// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import type { AboutMe, AgeRange, Gender, Motivation, WeeklyGoal } from "@/types";

/**
 * Onboarding v2 : questionnaire avant le quiz d'intro (inspiré de Vocabulary et
 * Français sans fautes). Logique pure, testée : l'écran ne fait que l'afficher.
 *
 * Règle : chaque question change quelque chose que le joueur voit ensuite
 * (prénom dans les textes, bénéfice selon la motivation, objectif sur l'accueil,
 * heure du rappel). Âge et genre servent à connaître la cible ; le genre accorde
 * aussi quelques messages (contexte i18next).
 */

/** Version de l'onboarding, en super-propriété PostHog (cohortes avant/après). */
export const ONBOARDING_VERSION = 2;

// Pas d'écran « chiffres » après l'objectif (un volume mensuel calculé fait
// peur au lieu de rassurer) ni de fausse démo : le bénéfice se montre avec le
// vrai « Le saviez-vous » du jeu, juste après la motivation.
export const ABOUT_STEPS = [
  "welcome",
  "firstName",
  "ageRange",
  "gender",
  "motivation",
  "motivationBenefit",
  "weeklyGoal",
  "ready",
] as const;

export type AboutStepId = (typeof ABOUT_STEPS)[number];

/** Questions qu'on peut passer (« Ignorer ») : toutes, les écrans bénéfice non. */
const SKIPPABLE: ReadonlySet<AboutStepId> = new Set([
  "firstName",
  "ageRange",
  "gender",
  "motivation",
  "weeklyGoal",
]);

export function isSkippableStep(step: AboutStepId): boolean {
  return SKIPPABLE.has(step);
}

// Liste d'âge dès 13 ans : pas de tranche « moins de 13 ans » (règlement
// Familles / RGPD enfant), comme Vocabulary.
export const AGE_RANGES: AgeRange[] = [
  "13_17",
  "18_24",
  "25_34",
  "35_44",
  "45_54",
  "55_plus",
  "undisclosed",
];
export const GENDERS: Gender[] = ["female", "male", "other", "undisclosed"];
export const MOTIVATIONS: Motivation[] = ["shine", "lifelong", "kids", "challenge"];
export const WEEKLY_GOALS: WeeklyGoal[] = [3, 5, 7];
export const DEFAULT_WEEKLY_GOAL: WeeklyGoal = 5;

export const REMINDER_HOURS = [8, 12, 19, 21] as const;
export const DEFAULT_REMINDER_HOUR = 19;

/** Heure du rappel dans le format de la langue (« 19:00 », « 7:00 PM »). */
export function formatReminderHour(hour: number, locale: string): string {
  try {
    return new Date(2000, 0, 1, hour).toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return `${hour}:00`;
  }
}

/** Longueur maximale du prénom saisi. */
export const FIRST_NAME_MAX = 30;

/**
 * Œuvre montrée dans le « Le saviez-vous » de démonstration : hors de la
 * playlist d'intro (pas de spoiler), avec des anecdotes dans les 11 langues.
 */
export const DEMO_DID_YOU_KNOW = { type: "artwork", id: "great-wave" } as const;

/** Prénom nettoyé (espaces, longueur) ; undefined si vide. */
export function cleanFirstName(raw: string): string | undefined {
  const name = raw.replace(/\s+/g, " ").trim().slice(0, FIRST_NAME_MAX).trim();
  return name.length > 0 ? name : undefined;
}

/**
 * Contexte i18next pour accorder un message (`t(key, { context })`). Hors
 * femme/homme, on garde la formulation neutre (clé de base).
 */
export function genderContext(gender?: Gender): "female" | "male" | undefined {
  return gender === "female" || gender === "male" ? gender : undefined;
}

/**
 * Person properties PostHog. Le prénom n'y figure JAMAIS (donnée personnelle
 * sans intérêt analytique) : seulement le fait qu'il ait été donné.
 */
export function aboutMePersonProperties(about: AboutMe) {
  return {
    age_range: about.ageRange ?? null,
    gender: about.gender ?? null,
    motivation: about.motivation ?? null,
    weekly_goal: about.weeklyGoal ?? null,
    reminder_hour: about.reminderHour ?? null,
    has_first_name: Boolean(about.firstName),
  };
}
