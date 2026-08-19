/**
 * Quota quotidien de parties — port web de `stores/ticketStore.ts` de l'app.
 *
 * Mêmes règles : 3 parties par jour, +1 au Défi du jour, rollover à minuit
 * heure locale, remboursement d'une partie quittée sans réponse, illimité pour
 * les abonnés. Le kill-switch distant (`/app-version.json`, bloc `tickets`) est
 * honoré comme sur mobile : il pilote les deux plateformes d'un seul endroit.
 *
 * Simplifications assumées côté web : pas de cohorte legacy (aucun historique
 * d'utilisateur web à migrer) et pas de notification de recharge (pas de push).
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DEFAULT_DAILY_QUOTA = 3;
export const DEFAULT_DAILY_BONUS = 1;

/** Clé de jour local (YYYY-MM-DD), comme `formatDateKey` de l'app. */
function localDayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface TicketState {
  remoteEnabled: boolean;
  dailyQuota: number;
  dailyBonus: number;
  day: string;
  used: number;
  bonusEarned: boolean;
  streakBonus: number;

  refreshRemoteConfig: () => Promise<void>;
  /** Consomme 1 ticket. `false` si le solde est à 0 (partie refusée). */
  consume: () => boolean;
  /** Rend le ticket d'une partie quittée sans aucune réponse. */
  refund: () => void;
  earnDailyBonus: () => void;
  getBalance: () => number;
  isCatalogOpen: () => boolean;
}

type BalanceInput = Pick<
  TicketState,
  "day" | "used" | "bonusEarned" | "streakBonus" | "dailyQuota" | "dailyBonus"
>;

/**
 * Solde calculable sans mutation (pour les sélecteurs React) : un `day` périmé
 * vaut « journée neuve », donc quota plein.
 */
export const computeBalance = (s: BalanceInput): number => {
  if (s.day !== localDayKey()) return s.dailyQuota;
  const earned = s.dailyQuota + (s.bonusEarned ? s.dailyBonus : 0) + s.streakBonus;
  return Math.max(0, earned - s.used);
};

export const useTicketStore = create<TicketState>()(
  persist(
    (set, get) => ({
      remoteEnabled: true,
      dailyQuota: DEFAULT_DAILY_QUOTA,
      dailyBonus: DEFAULT_DAILY_BONUS,
      day: localDayKey(),
      used: 0,
      bonusEarned: false,
      streakBonus: 0,

      refreshRemoteConfig: async () => {
        try {
          const res = await fetch("/app-version.json", { cache: "no-cache" });
          if (!res.ok) return;
          const cfg = (await res.json())?.tickets;
          if (!cfg) return;
          set({
            remoteEnabled: cfg.enabled !== false,
            // Mêmes bornes que l'app : un mauvais chiffre distant ne peut pas
            // rendre le jeu injouable ni le quota absurde.
            dailyQuota: Math.min(20, Math.max(1, cfg.dailyQuota ?? DEFAULT_DAILY_QUOTA)),
            dailyBonus: Math.min(5, Math.max(0, cfg.dailyBonus ?? DEFAULT_DAILY_BONUS)),
          });
        } catch {
          // Hors-ligne ou config absente : on garde les valeurs par défaut.
        }
      },

      consume: () => {
        if (get().day !== localDayKey()) {
          set({ day: localDayKey(), used: 0, bonusEarned: false, streakBonus: 0 });
        }
        if (computeBalance(get()) <= 0) return false;
        set({ used: get().used + 1 });
        return true;
      },

      refund: () => {
        // Rollover entre-temps : le compteur est déjà reparti de zéro.
        if (get().day !== localDayKey() || get().used <= 0) return;
        set({ used: get().used - 1 });
      },

      earnDailyBonus: () => {
        if (!get().remoteEnabled) return;
        if (get().day !== localDayKey()) {
          set({ day: localDayKey(), used: 0, bonusEarned: false, streakBonus: 0 });
        }
        if (get().bonusEarned || get().dailyBonus <= 0) return;
        set({ bonusEarned: true });
      },

      getBalance: () => computeBalance(get()),

      isCatalogOpen: () => get().remoteEnabled,
    }),
    {
      name: "sapiro-web-tickets",
      version: 1,
      partialize: (s) => ({
        remoteEnabled: s.remoteEnabled,
        dailyQuota: s.dailyQuota,
        dailyBonus: s.dailyBonus,
        day: s.day,
        used: s.used,
        bonusEarned: s.bonusEarned,
        streakBonus: s.streakBonus,
      }),
    },
  ),
);

/** Sélecteur réactif du solde (recalcule au rollover sans mutation). */
export function useTicketBalance(): number {
  return useTicketStore((s) => computeBalance(s));
}
