import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  deleteAccount,
  isSignedIn,
  resetPassword,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  signUpWithEmail,
} from "@game/lib/auth";
import { t } from "@game/lib/i18n";

type Tab = "signin" | "signup" | "forgot";

interface Props {
  user: User | null;
  onClose: () => void;
  /** Arrivée par le lien de suppression de compte (`?delete-account`). */
  deleteIntent?: boolean;
}

/** Messages Supabase traduits — un code d'erreur brut n'aide personne. */
function humanError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/already registered|email_exists|already been registered/i.test(message)) {
    return t("web.account.errorExists");
  }
  if (/invalid login credentials/i.test(message)) {
    return t("web.account.errorCredentials");
  }
  if (/password should be at least/i.test(message)) {
    return t("web.account.errorPassword");
  }
  if (/rate limit|too many/i.test(message)) {
    return t("web.account.errorRateLimit");
  }
  return message;
}

export function AccountModal({ user, onClose, deleteIntent = false }: Props) {
  const [tab, setTab] = useState<Tab>(deleteIntent ? "signin" : "signup");
  const [confirmDelete, setConfirmDelete] = useState(deleteIntent);
  const [deleted, setDeleted] = useState(false);
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
      // Venu pour supprimer son compte : après connexion, on reste sur la fenêtre.
      else if (!deleteIntent) onClose();
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  };

  // Hors de `run` : en cas de succès, la fenêtre reste ouverte sur la confirmation.
  const confirmAndDelete = async () => {
    setBusy(true);
    setError(null);
    try {
      await deleteAccount();
      setDeleted(true);
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
      aria-label={signedIn ? t("web.account.title") : t("web.home.signIn")}
    >
      <div className="game-modal__panel">
        <button
          type="button"
          className="game-icon-btn game-modal__close"
          onClick={onClose}
          aria-label={t("web.account.close")}
        >
          ✕
        </button>

        {deleted ? (
          <>
            <h2 className="game-modal__title">{t("web.account.deleteDone")}</h2>
            <button
              type="button"
              className="game-btn game-btn--block"
              // Rechargement : les stores en mémoire repartent de zéro, comme le stockage.
              onClick={() => window.location.reload()}
            >
              {t("web.account.close")}
            </button>
          </>
        ) : signedIn && confirmDelete ? (
          <>
            <h2 className="game-modal__title">{t("web.account.deleteTitle")}</h2>
            <p className="game-modal__sub">{user?.email}</p>
            <p className="game-modal__sub">{t("web.account.deleteWarn")}</p>
            <p className="game-modal__sub">{t("web.account.deleteSub")}</p>
            {error && <p className="game-modal__error">{error}</p>}
            <button
              type="button"
              className="game-btn game-btn--danger game-btn--block"
              onClick={() => void confirmAndDelete()}
              disabled={busy}
            >
              {busy ? t("web.account.wait") : t("web.account.deleteConfirm")}
            </button>
            <div className="game-modal__links">
              <button type="button" onClick={() => setConfirmDelete(false)} disabled={busy}>
                {t("web.account.deleteCancel")}
              </button>
            </div>
          </>
        ) : signedIn ? (
          <>
            <h2 className="game-modal__title">{t("web.account.title")}</h2>
            <p className="game-modal__sub">{user?.email}</p>
            <p className="game-modal__sub">{t("web.account.synced")}</p>
            <button
              type="button"
              className="game-btn game-btn--ghost game-btn--block"
              onClick={() => void run(signOut)}
              disabled={busy}
            >
              {t("web.account.signOut")}
            </button>
            <div className="game-modal__links">
              <button type="button" onClick={() => setConfirmDelete(true)} disabled={busy}>
                {t("web.account.deleteLink")}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="game-modal__title">
              {tab === "forgot"
                ? t("web.account.forgotTitle")
                : deleteIntent
                  ? t("web.account.deleteLink")
                  : t("web.account.saveTitle")}
            </h2>
            <p className="game-modal__sub">
              {tab === "forgot"
                ? t("web.account.forgotSub")
                : deleteIntent
                  ? t("web.account.deleteNeedSignIn")
                  : t("web.account.saveSub")}
            </p>

            {tab !== "forgot" && (
              <>
                <button
                  type="button"
                  className="game-btn game-btn--ghost game-btn--block"
                  onClick={() => void run(signInWithGoogle, t("web.account.googleRedirect"))}
                  disabled={busy}
                >
                  {t("web.account.google")}
                </button>
                <div className="game-modal__sep">{t("web.account.or")}</div>
              </>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (tab === "forgot") {
                  void run(() => resetPassword(email), t("web.account.forgotSent"));
                } else if (tab === "signup") {
                  void run(() => signUpWithEmail(email, password));
                } else {
                  void run(() => signInWithEmail(email, password));
                }
              }}
            >
              <label className="game-field">
                <span>{t("web.account.email")}</span>
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
                  <span>{t("web.account.password")}</span>
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
                  ? t("web.account.wait")
                  : tab === "signup"
                    ? t("web.account.signUp")
                    : tab === "signin"
                      ? t("web.account.signIn")
                      : t("web.account.sendLink")}
              </button>
            </form>

            <div className="game-modal__links">
              {tab !== "signup" && (
                <button type="button" onClick={() => setTab("signup")}>
                  {t("web.account.signUpLink")}
                </button>
              )}
              {tab !== "signin" && (
                <button type="button" onClick={() => setTab("signin")}>
                  {t("web.account.signInLink")}
                </button>
              )}
              {tab === "signin" && (
                <button type="button" onClick={() => setTab("forgot")}>
                  {t("web.account.forgotLink")}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
