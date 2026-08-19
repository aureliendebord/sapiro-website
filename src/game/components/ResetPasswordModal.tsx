import { useState } from "react";
import { updatePassword } from "@game/lib/auth";
import { t } from "@game/lib/i18n";

interface Props {
  onClose: () => void;
}

/**
 * Récepteur du lien « mot de passe oublié ».
 *
 * Le mail de réinitialisation (émis par le web ET par l'app mobile) redirige
 * vers la page du jeu avec `?reset=1` ; `detectSessionInUrl` a déjà ouvert la
 * session de récupération quand cette modale s'affiche. Sans elle, le lien
 * connectait silencieusement l'utilisateur sans jamais lui demander de nouveau
 * mot de passe — la récupération de compte était impossible.
 */
export function ResetPasswordModal({ onClose }: Props) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await updatePassword(password);
      setDone(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // Session de récupération absente ou expirée : le lien est à usage
      // unique, il faut en redemander un.
      setError(/session|auth|expired|token/i.test(message) ? t("web.reset.invalid") : message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="game-modal" role="dialog" aria-modal="true" aria-label={t("web.reset.title")}>
      <div className="game-modal__panel">
        <button
          type="button"
          className="game-icon-btn game-modal__close"
          onClick={onClose}
          aria-label={t("web.account.close")}
        >
          ✕
        </button>

        <h2 className="game-modal__title">{t("web.reset.title")}</h2>

        {done ? (
          <>
            <p className="game-modal__notice">{t("web.reset.done")}</p>
            <button type="button" className="game-btn game-btn--block" onClick={onClose}>
              {t("web.account.close")}
            </button>
          </>
        ) : (
          <>
            <p className="game-modal__sub">{t("web.reset.sub")}</p>
            <form onSubmit={(e) => void handleSubmit(e)}>
              <label className="game-field">
                <span>{t("web.reset.newPassword")}</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  disabled={busy}
                />
              </label>

              {error && <p className="game-modal__error">{error}</p>}

              <button type="submit" className="game-btn game-btn--block" disabled={busy}>
                {busy ? t("web.account.wait") : t("web.reset.submit")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
