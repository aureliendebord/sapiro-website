/**
 * Store natif de l'appareil qui joue, ou `null` sur ordinateur.
 *
 * Sert à choisir la sortie une fois les parties gratuites épuisées : sur
 * téléphone, l'app convertit bien mieux que l'abonnement web (essai natif,
 * un tap) ; sur ordinateur, l'app ne s'installe pas, le paywall web reste.
 *
 * iPadOS se déclare « Macintosh » depuis iPadOS 13 : seul l'écran tactile le
 * distingue d'un Mac.
 */
export type MobileStore = "app_store" | "play_store";

export function mobileStore(): MobileStore | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "play_store";
  if (/iPhone|iPad|iPod/i.test(ua)) return "app_store";
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "app_store";
  return null;
}
