import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import type { AnyFlagEntity, EntityType } from "@/types";
import { getJourneyById } from "@/domain/journeys/catalog";
import { isMixedBlockId } from "@/domain/journeys/path";
import { usePathStore } from "@game/store/pathStore";
import { getEntityById } from "@/domain/quiz/entityPool";
import { getDailyTheme } from "@/utils/dailyChallenge";
import { warmGameSounds } from "@game/lib/sounds";
import { HomeScreen, type HomeAction } from "./HomeScreen";
import { PathScreen } from "./path/PathScreen";
import { LeaderboardScreen } from "./leaderboard/LeaderboardScreen";
import { ProfileScreen } from "./profile/ProfileScreen";
import { QuizScreen } from "./QuizScreen";
import { ResultScreen } from "./ResultScreen";
import { loadLanguage, t, type GameLang } from "@game/lib/i18n";
import { preloadEntityLocales } from "@/hooks/useEntityDescriptions";
import { useTicketStore, useTicketBalance } from "@game/store/ticketStore";
import { useGameStore } from "@game/store/gameStore";
import { recordGameResult, flushPendingResults } from "@game/lib/gameResults";
import type { SessionConfig, SessionResult } from "@game/lib/quizSession";
import { GameRail } from "./GameRail";
import { GameAside } from "./GameAside";
import { AccountModal } from "./AccountModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { completePendingMerge, ensureSession, onAuthChange } from "@game/lib/auth";
import { fetchPremiumStatus } from "@game/lib/purchases";
import { capture, identifyAnalytics } from "@game/lib/analytics";
import type { User } from "@supabase/supabase-js";
import "@game/styles/game.css";

// Le paywall embarque le SDK RevenueCat (~1 Mo dist) : chargé seulement à
// l'ouverture, pas au premier paint du jeu.
const PaywallModal = lazy(() =>
  import("./PaywallModal").then((m) => ({ default: m.PaywallModal })),
);

type Screen =
  | { name: "home" }
  | { name: "journeys" }
  | { name: "board" }
  | { name: "profile" }
  | { name: "quiz"; config: SessionConfig }
  // `config` est conservé pour que « Rejouer » relance exactement la même
  // partie (même parcours, même type d'entité) sans le redéduire du résultat.
  | { name: "result"; result: SessionResult; config: SessionConfig };

interface Props {
  lang: GameLang;
}

/** Clé de jour local — même découpage que le quota et le Défi du jour. */
function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function GameApp({ lang }: Props) {
  const [ready, setReady] = useState(false);
  /** Chargement des locales d'entités entre le clic et la 1re question. */
  const [preparing, setPreparing] = useState(false);
  const [screen, setScreen] = useState<Screen>({ name: "home" });

  const tickets = useTicketBalance();
  const consumeTicket = useTicketStore((s) => s.consume);
  const refundTicket = useTicketStore((s) => s.refund);
  const earnDailyBonus = useTicketStore((s) => s.earnDailyBonus);
  const refreshRemoteConfig = useTicketStore((s) => s.refreshRemoteConfig);

  const xp = useGameStore((s) => s.xp);
  const gamesPlayed = useGameStore((s) => s.gamesPlayed);
  const review = useGameStore((s) => s.review);
  const lastDailyKey = useGameStore((s) => s.lastDailyKey);
  const dailyStreak = useGameStore((s) => s.dailyStreak);
  const recordGame = useGameStore((s) => s.recordGame);
  const addMiss = useGameStore((s) => s.addMiss);
  const clearMiss = useGameStore((s) => s.clearMiss);
  const markDailyDone = useGameStore((s) => s.markDailyDone);
  const recordPathResult = usePathStore((s) => s.recordResult);

  const [user, setUser] = useState<User | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [paywallSource, setPaywallSource] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  /** Message expliquant pourquoi un bloc du sentier est fermé. */
  const [dialog, setDialog] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  const dailyDone = lastDailyKey === todayKey();

  // Session anonyme au démarrage (la progression est rattachée à un compte dès
  // la 1re partie), reprise d'une éventuelle fusion post-redirect Google, puis
  // envoi des parties restées en file d'attente.
  useEffect(() => {
    const unsubscribe = onAuthChange((nextUser) => {
      identifyAnalytics(nextUser?.id ?? null);
      setUser(nextUser);
    });
    void (async () => {
      await completePendingMerge();
      const session = await ensureSession();
      identifyAnalytics(session?.user?.id ?? null);
      setUser(session?.user ?? null);
      await flushPendingResults();
    })();

    // Retour du lien « mot de passe oublié » : la session de récupération est
    // déjà ouverte (detectSessionInUrl), il reste à demander le nouveau mot de
    // passe. Le paramètre est consommé pour qu'un rechargement ne rouvre rien.
    const params = new URLSearchParams(window.location.search);
    if (params.has("reset")) {
      setResetOpen(true);
      params.delete("reset");
      const query = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : ""));
    }

    return unsubscribe;
  }, []);

  // Le SDK RevenueCat suit l'uid Supabase : c'est ce qui fait qu'un abonnement
  // pris ici vaut sur mobile, et inversement.
  const refreshPremium = useCallback(async (uid: string | undefined) => {
    if (!uid) return setIsPremium(false);
    const status = await fetchPremiumStatus(uid);
    // Statut inconnu (incident réseau) : on garde l'état courant plutôt que
    // de rétrograder un abonné en gratuit.
    if (status !== null) setIsPremium(status);
  }, []);

  useEffect(() => {
    void refreshPremium(user?.id);
  }, [user?.id, refreshPremium]);

  // Seuls les textes d'interface sont chargés au démarrage. Les locales
  // d'entités (jusqu'à 1,3 Mo pour une langue) sont chargées au lancement
  // d'une partie, et seulement pour la famille jouée.
  useEffect(() => {
    let cancelled = false;
    void loadLanguage(lang).then(() => {
      if (!cancelled) setReady(true);
    });
    void refreshRemoteConfig();
    return () => {
      cancelled = true;
    };
  }, [lang, refreshRemoteConfig]);

  const openPaywall = useCallback((source: string) => {
    setPaywallSource(source);
  }, []);

  const startQuiz = useCallback(
    async (config: SessionConfig, costsTicket: boolean) => {
      // Geste utilisateur : le bon moment pour amorcer les sons de la partie.
      warmGameSounds();
      if (costsTicket && !isPremium) {
        if (!consumeTicket()) {
          // Plus de tickets : même funnel que l'app (quota_reached → paywall).
          capture("quota_reached", { mode: config.mode, journey: config.journeyId ?? "" });
          openPaywall("quota_reached");
          setScreen({ name: "home" });
          return;
        }
        capture("ticket_consumed", {
          mode: config.mode,
          journey: config.journeyId ?? "",
          balance_after: useTicketStore.getState().getBalance(),
        });
      }

      // Bloquant : sans les locales, les questions sortiraient en français.
      // Révision et grand mélange servent les 5 familles → tout charger.
      const heterogeneous =
        Boolean(config.pool) || Boolean(config.pathBlockId && isMixedBlockId(config.pathBlockId));
      setPreparing(true);
      try {
        await preloadEntityLocales(lang, heterogeneous ? undefined : [config.entityType]);
      } catch {
        // Locales inaccessibles (réseau) : la partie ne peut pas se jouer
        // proprement — on rend le ticket au lieu de le perdre en silence.
        if (costsTicket && !isPremium) refundTicket();
        setDialog(t("web.quiz.loadFailed"));
        return;
      } finally {
        setPreparing(false);
      }

      setScreen({ name: "quiz", config });
    },
    [consumeTicket, refundTicket, isPremium, lang, openPaywall],
  );

  const handleAction = useCallback(
    (action: HomeAction) => {
      if (action === "journeys") return setScreen({ name: "journeys" });

      if (action === "review") {
        const pool = review
          .map((entry) => getEntityById(entry.entityType, entry.entityId))
          .filter((entity): entity is AnyFlagEntity => entity != null);
        if (!pool.length) return;
        return void startQuiz(
          { mode: "review", entityType: pool[0].type, language: lang, pool },
          true,
        );
      }

      if (action === "daily") {
        // Garde en profondeur : la carte est déjà désactivée, mais rien ne doit
        // permettre une 2e partie daily (elle crédite un ticket bonus et écrit
        // dans le classement partagé avec le mobile).
        if (dailyDone) return;
        const theme = getDailyTheme();
        return void startQuiz(
          { mode: "daily", entityType: theme.entityType as EntityType, language: lang },
          false,
        );
      }

      const mode = action === "survival" ? "survival" : "classic";
      void startQuiz({ mode, entityType: "country", language: lang }, true);
    },
    [review, lang, startQuiz, dailyDone],
  );

  /** Lance un bloc du sentier — la session dérive tout de pathBlockId. */
  const handlePlayBlock = useCallback(
    (blockId: string) => {
      const journey = getJourneyById(blockId);
      void startQuiz(
        {
          mode: "classic",
          journeyId: blockId,
          entityType: (journey?.entityType ?? "country") as EntityType,
          language: lang,
          pathBlockId: blockId,
        },
        true,
      );
    },
    [lang, startQuiz],
  );

  const handleFinish = useCallback(
    (result: SessionResult, config: SessionConfig) => {
      recordGame({
        id: crypto.randomUUID(),
        mode: result.mode,
        journey: result.journeyId,
        theme: result.theme,
        score: result.score,
        totalQuestions: result.totalQuestions,
        xpEarned: result.xp.totalXP,
        duration: result.durationSeconds,
        playedAt: Date.now(),
      });

      // Deck de révision : les ratés entrent, les entités enfin réussies sortent.
      for (const entity of result.misses) addMiss(entity.id, entity.type);
      if (result.mode === "review") {
        const missed = new Set(result.misses.map((e) => e.id));
        for (const entry of review) {
          if (!missed.has(entry.entityId)) clearMiss(entry.entityId);
        }
      }

      if (result.mode === "daily") {
        markDailyDone(todayKey());
        earnDailyBonus();
      }

      if (config.pathBlockId) {
        recordPathResult({
          blockId: config.pathBlockId,
          score: result.score,
          total: result.totalQuestions,
        });
      }

      capture("game_finished", {
        mode: result.mode,
        journey: result.journeyId ?? "",
        score: result.score,
        total: result.totalQuestions,
        xp: result.xp.totalXP,
      });
      void recordGameResult(result);
      setScreen({ name: "result", result, config });
    },
    [recordGame, addMiss, clearMiss, review, markDailyDone, earnDailyBonus, recordPathResult],
  );

  /** Quitter sans avoir répondu ne doit rien coûter (comme sur mobile). */
  const handleQuit = useCallback(
    (answered: number, costsTicket: boolean) => {
      if (answered === 0 && costsTicket && !isPremium) {
        refundTicket();
        capture("ticket_refunded", { balance_after: useTicketStore.getState().getBalance() });
      }
      setScreen({ name: "home" });
    },
    [refundTicket, isPremium],
  );

  const body = useMemo(() => {
    if (!ready) return <div className="game-loading">…</div>;
    if (preparing) return <div className="game-loading">{t("web.quiz.preparing")}</div>;

    switch (screen.name) {
      case "home":
        return (
          <HomeScreen
            ticketsLeft={tickets}
            isPremium={isPremium}
            reviewCount={review.length}
            dailyDone={dailyDone}
            onAction={handleAction}
          />
        );

      case "board":
        return <LeaderboardScreen user={user} onSignIn={() => setAccountOpen(true)} />;

      case "profile":
        return (
          <ProfileScreen
            user={user}
            isPremium={isPremium}
            onAccount={() => setAccountOpen(true)}
            onSubscribe={() => openPaywall("profile")}
          />
        );

      case "journeys":
        return (
          <PathScreen
            isPremium={isPremium}
            onPlay={handlePlayBlock}
            onLocked={(_, reason) => setDialog(reason)}
          />
        );

      case "quiz": {
        const costsTicket = screen.config.mode !== "daily";
        return (
          <QuizScreen
            key={`${screen.config.mode}-${screen.config.journeyId ?? "random"}`}
            config={screen.config}
            previousDailyStreak={dailyStreak}
            onFinish={(result) => handleFinish(result, screen.config)}
            onQuit={(answered) => handleQuit(answered, costsTicket)}
          />
        );
      }

      case "result":
        return (
          <ResultScreen
            result={screen.result}
            ticketsLeft={tickets}
            isPremium={isPremium}
            canReplay={screen.config.mode !== "daily"}
            onReplay={() => void startQuiz(screen.config, true)}
            onHome={() => setScreen({ name: "home" })}
            onSubscribe={() => openPaywall("quiz_result")}
          />
        );
    }
  }, [
    ready,
    preparing,
    screen,
    tickets,
    isPremium,
    review.length,
    dailyDone,
    dailyStreak,
    handleAction,
    handlePlayBlock,
    user,
    handleFinish,
    handleQuit,
    startQuiz,
    openPaywall,
  ]);

  // Pendant une question, les colonnes latérales s'effacent : le plateau seul.
  const focusMode = screen.name === "quiz";

  return (
    <div className="sapiro-game">
      <div className={`game-shell ${focusMode ? "game-shell--focus" : ""}`}>
        {!focusMode && (
          <aside className="game-rail">
            <GameRail
              xp={xp}
              ticketsLeft={tickets}
              isPremium={isPremium}
              user={user}
              current={
                screen.name === "journeys" || screen.name === "board" || screen.name === "profile"
                  ? screen.name
                  : "home"
              }
              onNavigate={(section) => setScreen({ name: section } as Screen)}
              onAccount={() => setAccountOpen(true)}
              onSubscribe={() => openPaywall("rail")}
            />
          </aside>
        )}

        <div className="game-board">{body}</div>

        {!focusMode && (
          <aside className="game-aside">
            <GameAside screen={screen.name} gamesPlayed={gamesPlayed} />
          </aside>
        )}
      </div>

      {dialog && (
        <div className="game-modal" role="dialog" aria-modal="true">
          <div className="game-modal__panel" style={{ textAlign: "center" }}>
            <p className="game-modal__sub" style={{ marginBottom: 18 }}>
              {dialog}
            </p>
            <button
              type="button"
              className="game-btn game-btn--block"
              onClick={() => setDialog(null)}
              autoFocus
            >
              {t("web.account.close")}
            </button>
          </div>
        </div>
      )}

      {accountOpen && <AccountModal user={user} onClose={() => setAccountOpen(false)} />}
      {resetOpen && <ResetPasswordModal onClose={() => setResetOpen(false)} />}
      {paywallSource !== null && (
        <Suspense fallback={null}>
          <PaywallModal
            user={user}
            source={paywallSource}
            onClose={() => setPaywallSource(null)}
            onPurchased={() => {
              setPaywallSource(null);
              void refreshPremium(user?.id);
            }}
            onNeedAccount={() => {
              setPaywallSource(null);
              setAccountOpen(true);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
