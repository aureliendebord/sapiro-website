// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Catalogue des badges — données pures, partagées app ↔ web.
 *
 * Extrait de `stores/gameStore.ts` pour que le site web affiche la même
 * collection sans la recopier. Volontairement limité aux DÉFINITIONS : la
 * logique de déblocage reste dans le store de l'app, où elle est liée à l'état
 * persisté des joueurs en production.
 *
 * Les libellés affichés viennent des locales (`badges.json`) ; les `name` et
 * `description` ci-dessous sont les valeurs de repli françaises.
 */
import type { Badge } from "@/types";

export const BADGE_DEFINITIONS: Omit<Badge, "unlockedAt">[] = [
  {
    id: "first_game",
    name: "Premier pas",
    description: "Terminer 1 quiz",
    icon: "👶",
    category: "achievement",
    condition: { type: "games_played", value: 1 },
  },
  {
    id: "perfect",
    name: "Sans faute",
    description: "10/10 sur un quiz",
    icon: "⭐",
    category: "achievement",
    condition: { type: "perfect_score", value: 10 },
  },
  {
    id: "survivor_15",
    name: "Survivant",
    description: "15 questions en survie",
    icon: "💪",
    category: "achievement",
    condition: { type: "survival_streak", value: 15 },
  },
  {
    id: "survivor_25",
    name: "Survivant Elite",
    description: "25 questions en survie",
    icon: "🦸",
    category: "achievement",
    condition: { type: "survival_streak", value: 25 },
  },
  {
    id: "survivor_complete",
    name: "Le Survivant",
    description: "Tous les drapeaux en survie",
    icon: "👑",
    category: "achievement",
    condition: { type: "survival_complete", value: 1 },
  },
  {
    id: "survivor_perfect",
    name: "Le Survivant Parfait",
    description: "Tous les drapeaux sans perdre une vie",
    icon: "🥇",
    category: "achievement",
    condition: { type: "survival_perfect", value: 1 },
  },
  {
    id: "streak_7",
    name: "Assidu",
    description: "7 jours d'affilée",
    icon: "🔥",
    category: "streak",
    condition: { type: "daily_streak", value: 7 },
  },
  {
    id: "streak_30",
    name: "Dévoué",
    description: "30 jours d'affilée",
    icon: "💎",
    category: "streak",
    condition: { type: "daily_streak", value: 30 },
  },
  {
    id: "europe_master",
    name: "Européen",
    description: "90% de réussite en Europe",
    icon: "🇪🇺",
    category: "mastery",
    condition: { type: "continent_mastery", value: 90, continent: "Europe" },
  },
  {
    id: "africa_master",
    name: "Africain",
    description: "90% de réussite en Afrique",
    icon: "🌍",
    category: "mastery",
    condition: { type: "continent_mastery", value: 90, continent: "Africa" },
  },
  {
    id: "asia_master",
    name: "Asiatique",
    description: "90% de réussite en Asie",
    icon: "🌏",
    category: "mastery",
    condition: { type: "continent_mastery", value: 90, continent: "Asia" },
  },
  {
    id: "collector_10",
    name: "Collectionneur",
    description: "Obtenir 10 badges",
    icon: "🎖️",
    category: "achievement",
    condition: { type: "badge_count", value: 10 },
  },
  // Daily Challenge Streak Badges
  {
    id: "daily_3",
    name: "Jeune pousse",
    description: "3 jours de défi",
    icon: "🌱",
    category: "streak",
    condition: { type: "daily_challenge_streak", value: 3 },
  },
  {
    id: "daily_7",
    name: "En feu",
    description: "7 jours de défi",
    icon: "🔥",
    category: "streak",
    condition: { type: "daily_challenge_streak", value: 7 },
  },
  {
    id: "daily_14",
    name: "Électrique",
    description: "14 jours de défi",
    icon: "⚡",
    category: "streak",
    condition: { type: "daily_challenge_streak", value: 14 },
  },
  {
    id: "daily_30",
    name: "Diamant",
    description: "30 jours de défi",
    icon: "💎",
    category: "streak",
    condition: { type: "daily_challenge_streak", value: 30 },
  },
  {
    id: "daily_60",
    name: "Champion",
    description: "60 jours de défi",
    icon: "🏆",
    category: "streak",
    condition: { type: "daily_challenge_streak", value: 60 },
  },
  {
    id: "daily_100",
    name: "Royal",
    description: "100 jours de défi",
    icon: "👑",
    category: "streak",
    condition: { type: "daily_challenge_streak", value: 100 },
  },
  {
    id: "daily_200",
    name: "Légendaire",
    description: "200 jours de défi",
    icon: "🦁",
    category: "streak",
    condition: { type: "daily_challenge_streak", value: 200 },
  },
  {
    id: "daily_365",
    name: "Annuel",
    description: "365 jours de défi",
    icon: "🌟",
    category: "streak",
    condition: { type: "daily_challenge_streak", value: 365 },
  },
  {
    id: "daily_500",
    name: "Astronaute",
    description: "500 jours de défi",
    icon: "🚀",
    category: "streak",
    condition: { type: "daily_challenge_streak", value: 500 },
  },
  {
    id: "daily_1000",
    name: "Immortel",
    description: "1000 jours de défi",
    icon: "🏅",
    category: "streak",
    condition: { type: "daily_challenge_streak", value: 1000 },
  },
  // Daily Challenge Perfect Badge
  {
    id: "daily_perfect",
    name: "Défi parfait",
    description: "10/10 sur un défi du jour",
    icon: "💯",
    category: "achievement",
    condition: { type: "daily_challenge_perfect", value: 10 },
  },
];
