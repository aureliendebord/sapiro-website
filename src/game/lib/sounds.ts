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

/** Crée le lecteur d'UN son, à la demande — pas de rafale de 5 téléchargements. */
function player(name: SoundName): HTMLAudioElement {
  let audio = players.get(name);
  if (!audio) {
    audio = new Audio(FILES[name]);
    audio.preload = "auto";
    audio.volume = 0.55;
    players.set(name, audio);
  }
  return audio;
}

/**
 * Amorce les sons d'une partie PENDANT un geste utilisateur (le clic sur la
 * carte de mode) : sans ça, le premier « correct » partait en téléchargement
 * au moment où il devait sonner. victory/level_up attendront la fin de partie.
 */
export function warmGameSounds(): void {
  if (unlocked || isMuted()) return;
  unlocked = true;
  for (const name of ["correct", "incorrect", "tap"] as SoundName[]) player(name);
}

export function play(name: SoundName): void {
  if (isMuted()) return;

  const audio = player(name);
  try {
    audio.currentTime = 0;
    // Le navigateur peut refuser (onglet en arrière-plan, geste trop ancien) :
    // le son est un agrément, jamais une condition de jeu.
    void audio.play().catch(() => {});
  } catch {
    /* ignoré */
  }
}
