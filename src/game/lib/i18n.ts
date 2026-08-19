/**
 * Traductions de l'interface de jeu.
 *
 * Les textes viennent des locales synchronisées depuis l'app (`game.json`,
 * `common.json`, `levels.json`) : mêmes libellés de question et mêmes termes
 * que sur mobile. La langue est imposée par la route Astro (/jouer, /en/play,
 * /es/jugar), pas détectée — le SEO du site pilote déjà la langue de la page.
 *
 * Volontairement minimal : pas de react-i18next côté web. Le jeu ne change
 * jamais de langue en cours de session, un module d'état simple suffit.
 */

export type GameLang = "fr" | "en" | "es";

type Dict = Record<string, unknown>;

const BUNDLES: Record<GameLang, () => Promise<Dict[]>> = {
  fr: async () => [
    (await import("@/locales/fr/game.json")).default,
    (await import("@/locales/fr/common.json")).default,
    (await import("@/locales/fr/levels.json")).default,
  ],
  en: async () => [
    (await import("@/locales/en/game.json")).default,
    (await import("@/locales/en/common.json")).default,
    (await import("@/locales/en/levels.json")).default,
  ],
  es: async () => [
    (await import("@/locales/es/game.json")).default,
    (await import("@/locales/es/common.json")).default,
    (await import("@/locales/es/levels.json")).default,
  ],
};

/**
 * Textes propres à l'interface web (accueil, modales compte/abonnement…),
 * absents des locales de l'app. Fusionnés sous la clé `web.*`. Les libellés
 * qui existent déjà dans les locales synchronisées (questions, themeSelect,
 * actions communes) ne sont PAS dupliqués ici : `t()` les sert directement.
 */
const WEB_STRINGS: Record<GameLang, Dict> = {
  fr: {
    home: {
      subtitle: "Apprends en jouant : géographie, histoire, art, nature, monuments.",
      quotaNotice:
        "Plus de parties aujourd'hui. Le Défi du jour reste jouable, et l'illimité t'attend.",
      level: "Niveau {{level}}",
      account: "Mon compte",
      signIn: "Se connecter",
      journeys: "Parcours",
      journeysDesc: "88 parcours, du continent au musée",
      daily: "Défi du jour",
      dailyDesc: "10 questions, sans consommer de partie",
      dailyDone: "Déjà relevé aujourd'hui, à demain",
      classic: "Classique",
      classicDesc: "10 questions tirées au hasard",
      survival: "Survie",
      survivalDesc: "3 vies, jusqu'où iras-tu ?",
      review: "Révision",
      reviewDesc: "Rejoue ce que tu as raté",
      reviewCount: "{{count}} à revoir",
    },
    quiz: {
      loading: "Chargement de la partie…",
      preparing: "Préparation de la partie…",
      loadingGame: "Chargement du jeu…",
      quit: "Quitter la partie",
      progress: "Progression de la partie",
      goodAnswers: "{{count}} bonnes réponses",
      livesLeft: "{{count}} vies restantes",
    },
    result: {
      survivalDone: "Partie de survie terminée",
      perfect: "Parfait, rien à redire",
      great: "Bien joué",
      close: "Ça se joue de peu",
      keepGoing: "Il y a de la marge de progression",
      perfectBonus: "Sans faute : +{{xp}} XP de bonus",
      outOfTickets: "Tu as utilisé tes parties du jour. Reviens demain, ou passe en illimité.",
      subscribe: "Jouer sans limite",
      replay: "Rejouer",
      home: "Retour à l'accueil",
    },
    journeys: { title: "Parcours", back: "Retour", elements: "{{count}} éléments" },
    account: {
      close: "Fermer",
      title: "Mon compte",
      synced: "Ta progression est sauvegardée et suit ton compte sur l'app mobile.",
      signOut: "Se déconnecter",
      saveTitle: "Sauvegarde ta progression",
      forgotTitle: "Mot de passe oublié",
      forgotSub: "On t'envoie un lien pour choisir un nouveau mot de passe.",
      saveSub: "Un compte te permet de retrouver ta progression sur mobile, et inversement.",
      google: "Continuer avec Google",
      googleRedirect: "Redirection vers Google…",
      or: "ou",
      email: "Adresse email",
      password: "Mot de passe",
      forgotSent: "Si un compte existe, le lien est parti. Pense aux indésirables.",
      wait: "Un instant…",
      signUp: "Créer mon compte",
      signIn: "Se connecter",
      sendLink: "Envoyer le lien",
      signUpLink: "Créer un compte",
      signInLink: "J'ai déjà un compte",
      forgotLink: "Mot de passe oublié",
      errorExists: "Cette adresse a déjà un compte. Connecte-toi plutôt.",
      errorCredentials: "Adresse ou mot de passe incorrect.",
      errorPassword: "Le mot de passe doit faire au moins 6 caractères.",
      errorRateLimit: "Trop de tentatives. Réessaie dans quelques minutes.",
    },
    reset: {
      title: "Nouveau mot de passe",
      sub: "Choisis ton nouveau mot de passe pour cette adresse.",
      newPassword: "Nouveau mot de passe",
      submit: "Changer le mot de passe",
      done: "Mot de passe changé. Tu es connecté.",
      invalid:
        "Ce lien de réinitialisation a expiré ou a déjà été utilisé. Redemande un lien depuis « Mot de passe oublié ».",
    },
    paywall: {
      title: "Joue sans limite",
      sub: "Ton abonnement vaut aussi sur l'app mobile, avec le même compte.",
      f1: "Parties illimitées, tous les jours",
      f2: "Reprendre une partie de survie en cours",
      f3: "Soutenir le développement de Sapiro",
      loading: "Chargement des offres…",
      unavailable:
        "L'abonnement en ligne n'est pas encore ouvert. En attendant, l'app mobile propose déjà l'illimité.",
      yearly: "Annuel",
      monthly: "Mensuel",
      cta: "S'abonner",
      wait: "Un instant…",
      legal: "Résiliable à tout moment depuis ton compte.",
    },
  },
  en: {
    home: {
      subtitle: "Learn by playing: geography, history, art, nature, monuments.",
      quotaNotice:
        "No games left today. The Daily Challenge is still playable, and unlimited is waiting.",
      level: "Level {{level}}",
      account: "My account",
      signIn: "Sign in",
      journeys: "Journeys",
      journeysDesc: "88 journeys, from continents to museums",
      daily: "Daily Challenge",
      dailyDesc: "10 questions, doesn't use up a game",
      dailyDone: "Done for today, see you tomorrow",
      classic: "Classic",
      classicDesc: "10 random questions",
      survival: "Survival",
      survivalDesc: "3 lives, how far can you go?",
      review: "Review",
      reviewDesc: "Replay what you missed",
      reviewCount: "{{count}} to review",
    },
    quiz: {
      loading: "Loading the game…",
      preparing: "Preparing your game…",
      loadingGame: "Loading…",
      quit: "Quit the game",
      progress: "Game progress",
      goodAnswers: "{{count}} correct answers",
      livesLeft: "{{count}} lives left",
    },
    result: {
      survivalDone: "Survival run over",
      perfect: "Perfect, nothing to add",
      great: "Well played",
      close: "So close",
      keepGoing: "Room to improve",
      perfectBonus: "Flawless: +{{xp}} bonus XP",
      outOfTickets: "You've used today's games. Come back tomorrow, or go unlimited.",
      subscribe: "Play unlimited",
      replay: "Play again",
      home: "Back to home",
    },
    journeys: { title: "Journeys", back: "Back", elements: "{{count}} items" },
    account: {
      close: "Close",
      title: "My account",
      synced: "Your progress is saved and follows your account on the mobile app.",
      signOut: "Sign out",
      saveTitle: "Save your progress",
      forgotTitle: "Forgot password",
      forgotSub: "We'll send you a link to choose a new password.",
      saveSub: "An account lets you pick up your progress on mobile, and vice versa.",
      google: "Continue with Google",
      googleRedirect: "Redirecting to Google…",
      or: "or",
      email: "Email address",
      password: "Password",
      forgotSent: "If an account exists, the link is on its way. Check your spam folder.",
      wait: "One moment…",
      signUp: "Create my account",
      signIn: "Sign in",
      sendLink: "Send the link",
      signUpLink: "Create an account",
      signInLink: "I already have an account",
      forgotLink: "Forgot password",
      errorExists: "This address already has an account. Sign in instead.",
      errorCredentials: "Wrong email or password.",
      errorPassword: "Password must be at least 6 characters.",
      errorRateLimit: "Too many attempts. Try again in a few minutes.",
    },
    reset: {
      title: "New password",
      sub: "Choose a new password for this address.",
      newPassword: "New password",
      submit: "Change password",
      done: "Password changed. You're signed in.",
      invalid:
        "This reset link has expired or was already used. Request a new one from “Forgot password”.",
    },
    paywall: {
      title: "Play without limits",
      sub: "Your subscription also works on the mobile app, with the same account.",
      f1: "Unlimited games, every day",
      f2: "Resume a survival run in progress",
      f3: "Support Sapiro's development",
      loading: "Loading plans…",
      unavailable:
        "Online subscription isn't open yet. Meanwhile, the mobile app already offers unlimited.",
      yearly: "Yearly",
      monthly: "Monthly",
      cta: "Subscribe",
      wait: "One moment…",
      legal: "Cancel anytime from your account.",
    },
  },
  es: {
    home: {
      subtitle: "Aprende jugando: geografía, historia, arte, naturaleza, monumentos.",
      quotaNotice:
        "No te quedan partidas hoy. El Desafío del día sigue jugable, y el ilimitado te espera.",
      level: "Nivel {{level}}",
      account: "Mi cuenta",
      signIn: "Iniciar sesión",
      journeys: "Recorridos",
      journeysDesc: "88 recorridos, del continente al museo",
      daily: "Desafío del día",
      dailyDesc: "10 preguntas, sin gastar partida",
      dailyDone: "Ya completado hoy, hasta mañana",
      classic: "Clásico",
      classicDesc: "10 preguntas al azar",
      survival: "Supervivencia",
      survivalDesc: "3 vidas, ¿hasta dónde llegarás?",
      review: "Repaso",
      reviewDesc: "Vuelve a jugar lo que fallaste",
      reviewCount: "{{count}} por repasar",
    },
    quiz: {
      loading: "Cargando la partida…",
      preparing: "Preparando la partida…",
      loadingGame: "Cargando…",
      quit: "Salir de la partida",
      progress: "Progreso de la partida",
      goodAnswers: "{{count}} respuestas correctas",
      livesLeft: "{{count}} vidas restantes",
    },
    result: {
      survivalDone: "Partida de supervivencia terminada",
      perfect: "Perfecto, nada que decir",
      great: "Bien jugado",
      close: "Por muy poco",
      keepGoing: "Hay margen de mejora",
      perfectBonus: "Sin fallos: +{{xp}} XP extra",
      outOfTickets: "Has usado tus partidas de hoy. Vuelve mañana, o pásate al ilimitado.",
      subscribe: "Jugar sin límite",
      replay: "Jugar otra vez",
      home: "Volver al inicio",
    },
    journeys: { title: "Recorridos", back: "Atrás", elements: "{{count}} elementos" },
    account: {
      close: "Cerrar",
      title: "Mi cuenta",
      synced: "Tu progreso está guardado y sigue tu cuenta en la app móvil.",
      signOut: "Cerrar sesión",
      saveTitle: "Guarda tu progreso",
      forgotTitle: "Contraseña olvidada",
      forgotSub: "Te enviamos un enlace para elegir una nueva contraseña.",
      saveSub: "Una cuenta te permite recuperar tu progreso en el móvil, y al revés.",
      google: "Continuar con Google",
      googleRedirect: "Redirigiendo a Google…",
      or: "o",
      email: "Dirección de email",
      password: "Contraseña",
      forgotSent: "Si existe una cuenta, el enlace va en camino. Revisa el correo no deseado.",
      wait: "Un momento…",
      signUp: "Crear mi cuenta",
      signIn: "Iniciar sesión",
      sendLink: "Enviar el enlace",
      signUpLink: "Crear una cuenta",
      signInLink: "Ya tengo una cuenta",
      forgotLink: "Contraseña olvidada",
      errorExists: "Esta dirección ya tiene una cuenta. Inicia sesión.",
      errorCredentials: "Email o contraseña incorrectos.",
      errorPassword: "La contraseña debe tener al menos 6 caracteres.",
      errorRateLimit: "Demasiados intentos. Vuelve a intentarlo en unos minutos.",
    },
    reset: {
      title: "Nueva contraseña",
      sub: "Elige tu nueva contraseña para esta dirección.",
      newPassword: "Nueva contraseña",
      submit: "Cambiar la contraseña",
      done: "Contraseña cambiada. Ya estás conectado.",
      invalid:
        "Este enlace de restablecimiento ha caducado o ya se usó. Pide uno nuevo desde «Contraseña olvidada».",
    },
    paywall: {
      title: "Juega sin límite",
      sub: "Tu suscripción también vale en la app móvil, con la misma cuenta.",
      f1: "Partidas ilimitadas, todos los días",
      f2: "Retomar una partida de supervivencia",
      f3: "Apoyar el desarrollo de Sapiro",
      loading: "Cargando las ofertas…",
      unavailable:
        "La suscripción online aún no está abierta. Mientras tanto, la app móvil ya ofrece el ilimitado.",
      yearly: "Anual",
      monthly: "Mensual",
      cta: "Suscribirse",
      wait: "Un momento…",
      legal: "Cancelable en cualquier momento desde tu cuenta.",
    },
  },
};

let current: GameLang = "fr";
let dict: Dict = {};

export async function loadLanguage(lang: GameLang): Promise<void> {
  const bundles = await BUNDLES[lang]();
  current = lang;
  // Les fichiers ont des racines disjointes (questions, modes, levels…),
  // un merge de surface suffit — les textes web sous `web.*`.
  dict = Object.assign({}, ...bundles, { web: WEB_STRINGS[lang] });
}

export function getLanguage(): GameLang {
  return current;
}

/**
 * Résout une clé pointée (`questions.whatCountry`). Retourne la clé elle-même
 * si absente : un libellé manquant doit se voir, pas casser la partie.
 */
export function t(key: string, vars?: Record<string, string | number>): string {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Dict)) {
      return (acc as Dict)[part];
    }
    return undefined;
  }, dict);

  if (typeof value !== "string") return key;
  if (!vars) return value;

  return value.replace(/\{\{(\w+)\}\}/g, (_, name: string) =>
    name in vars ? String(vars[name]) : `{{${name}}}`,
  );
}
