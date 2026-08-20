/**
 * Sons du jeu — mêmes fichiers que l'app (`assets/sounds/`, synchronisés dans
 * `public/sounds/`).
 *
 * Deux contraintes propres au navigateur :
 *  - l'autoplay est bloqué tant que l'utilisateur n'a pas interagi avec la
 *    page ; on prépare donc les éléments audio au premier geste, pas avant ;
 *  - un même son peut être redemandé avant la fin du précédent (deux bonnes
 *    réponses rapides) : on remet la lecture à zéro plutôt que de l'ignorer.
 *
 * Le réglage est persistant, comme le toggle son de l'app.
 */
export type SoundName = "correct" | "incorrect" | "victory" | "level_up" | "tap";

const FILES: Record<SoundName, string> = {
  correct: "/sounds/correct.mp3",
  incorrect: "/sounds/incorrect.mp3",
  victory: "/sounds/victory.mp3",
  level_up: "/sounds/level_up.mp3",
  tap: "/sounds/tap.mp3",
};

const MUTED_KEY = "sapiro-web-muted";

const players = new Map<SoundName, HTMLAudioElement>();
let unlocked = false;

function isMuted(): boolean {
  try {
    return localStorage.getItem(MUTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean): void {
  try {
    localStorage.setItem(MUTED_KEY, muted ? "1" : "0");
  } catch {
    // Navigation privée : le réglage ne survivra pas à la session, tant pis.
  }
}

export function getMuted(): boolean {
  return isMuted();
}

/**
 * Crée les lecteurs au premier geste de l'utilisateur. Appelé par `play()`,
 * donc toujours dans le contexte d'un clic ou d'une touche : le navigateur
 * autorise la lecture à partir de là.
 */
function unlock(): void {
  if (unlocked) return;
  unlocked = true;
  for (const [name, src] of Object.entries(FILES) as [SoundName, string][]) {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = 0.55;
    players.set(name, audio);
  }
}

export function play(name: SoundName): void {
  if (isMuted()) return;
  unlock();

  const audio = players.get(name);
  if (!audio) return;
  try {
    audio.currentTime = 0;
    // Le navigateur peut refuser (onglet en arrière-plan, geste trop ancien) :
    // le son est un agrément, jamais une condition de jeu.
    void audio.play().catch(() => {});
  } catch {
    /* ignoré */
  }
}
