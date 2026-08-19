// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
/**
 * Utilitaires de mélange aléatoire
 * Basés sur l'algorithme Fisher-Yates (Knuth shuffle)
 */

/**
 * Mélange un tableau de manière uniformément aléatoire
 * Algorithme Fisher-Yates - O(n) temps, O(n) espace
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Générateur de nombres pseudo-aléatoires déterministe (Mulberry32)
 * Retourne toujours la même séquence pour un seed donné
 */
export function seededRandom(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Mélange un tableau de manière déterministe avec un seed
 * Utile pour les défis quotidiens où tout le monde doit avoir le même ordre
 */
export function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const random = seededRandom(seed);
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
