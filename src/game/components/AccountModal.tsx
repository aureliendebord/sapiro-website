import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  isSignedIn,
  resetPassword,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  signUpWithEmail,
} from "@game/lib/auth";

type Tab = "signin" | "signup" | "forgot";

interface Props {
  user: User | null;
  onClose: () => void;
}

/** Messages Supabase traduits — un code d'erreur brut n'aide personne. */
function humanError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/already registered|email_exists|already been registered/i.test(message)) {
    return "Cette adresse a déjà un compte. Connecte-toi plutôt.";
  }
  if (/invalid login credentials/i.test(message)) {
    return "Adresse ou mot de passe incorrect.";
  }
  if (/password should be at least/i.test(message)) {
    return "Le mot de passe doit faire au moins 6 caractères.";
  }
  if (/rate limit|too many/i.test(message)) {
    return "Trop de tentatives. Réessaie dans quelques minutes.";
  }
  return message;
}

export function AccountModal({ user, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const signedIn = isSignedIn(user);

  const run = async (action: () => Promise<unknown>, successNotice?: string) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await action();
      if (successNotice) setNotice(successNotice);
      else onClose();
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="game-modal"
      role="dialog"
      aria-modal="true"
      aria-label={signedIn ? "Mon compte" : "Connexion"}
    >
      <div className="game-modal__panel">
        <button
          type="button"
          className="game-icon-btn game-modal__close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>

        {signedIn ? (
          <>
            <h2 className="game-modal__title">Mon compte</h2>
            <p className="game-modal__sub">{user?.email}</p>
            <p className="game-modal__sub">
              Ta progression est sauvegardée et suit ton compte sur l'app mobile.
            </p>
            <button
              type="button"
              className="game-btn game-btn--ghost game-btn--block"
              onClick={() => void run(signOut)}
              disabled={busy}
            >
              Se déconnecter
            </button>
          </>
        ) : (
          <>
            <h2 className="game-modal__title">
              {tab === "forgot" ? "Mot de passe oublié" : "Sauvegarde ta progression"}
            </h2>
            <p className="game-modal__sub">
              {tab === "forgot"
                ? "On t'envoie un lien pour choisir un nouveau mot de passe."
                : "Un compte te permet de retrouver ta progression sur mobile, et inversement."}
            </p>

            {tab !== "forgot" && (
              <>
                <button
                  type="button"
                  className="game-btn game-btn--ghost game-btn--block"
                  onClick={() => void run(signInWithGoogle, "Redirection vers Google…")}
                  disabled={busy}
                >
                  Continuer avec Google
                </button>
                <div className="game-modal__sep">ou</div>
              </>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (tab === "forgot") {
                  void run(
                    () => resetPassword(email),
                    "Si un compte existe, le lien est parti. Pense aux indésirables.",
                  );
                } else if (tab === "signup") {
                  void run(() => signUpWithEmail(email, password));
                } else {
                  void run(() => signInWithEmail(email, password));
                }
              }}
            >
              <label className="game-field">
                <span>Adresse email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={busy}
                />
              </label>

              {tab !== "forgot" && (
                <label className="game-field">
                  <span>Mot de passe</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={tab === "signup" ? "new-password" : "current-password"}
                    disabled={busy}
                  />
                </label>
              )}

              {error && <p className="game-modal__error">{error}</p>}
              {notice && <p className="game-modal__notice">{notice}</p>}

              <button type="submit" className="game-btn game-btn--block" disabled={busy}>
                {busy
                  ? "Un instant…"
                  : tab === "signup"
                    ? "Créer mon compte"
                    : tab === "signin"
                      ? "Se connecter"
                      : "Envoyer le lien"}
              </button>
            </form>

            <div className="game-modal__links">
              {tab !== "signup" && (
                <button type="button" onClick={() => setTab("signup")}>
                  Créer un compte
                </button>
              )}
              {tab !== "signin" && (
                <button type="button" onClick={() => setTab("signin")}>
                  J'ai déjà un compte
                </button>
              )}
              {tab === "signin" && (
                <button type="button" onClick={() => setTab("forgot")}>
                  Mot de passe oublié
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
