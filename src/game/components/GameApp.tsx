import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import type { EntityType } from "@/types";
import { getJourneyById } from "@/domain/journeys/catalog";
import { isMixedBlockId } from "@/domain/journeys/path";
import { usePathStore } from "@game/store/pathStore";
import { warmGameSounds } from "@game/lib/sounds";
import { loadContent } from "@game/lib/loadContent";
import { HomeScreen, type HomeAction } from "./HomeScreen";
import { PathScreen } from "./path/PathScreen";
import { LeaderboardScreen } from "./leaderboard/LeaderboardScreen";
import { ProfileScreen } from "./profile/ProfileScreen";
import { QuizScreen } from "./QuizScreen";
import { ResultScreen } from "./ResultScreen";
import { loadLanguage, t, type GameLang } from "@game/lib/i18n";
import { preloadEntityLocales } from "@/lib/content/locales";
import { useTicketStore, useTicketBalance } from "@game/store/ticketStore";
import { useGameStore } from "@game/store/gameStore";
import { recordGameResult, flushPendingResults } from "@game/lib/gameResults";
import type { SessionConfig, SessionResult } from "@game/lib/quizSession";
import { GameBottomNav } from "./GameBottomNav";
import { levelFromXp } from "@game/store/gameStore";
import { Icon } from "./ui/Icon";
import { Glyph } from "./ui/Glyph";
import { AccountModal } from "./AccountModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { completePendingMerge, ensureSession, isSignedIn, onAuthChange } from "@game/lib/auth";
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
  const lastDailyKey = useGameStore((s) => s.lastDailyKey);
  const dailyStreak = useGameStore((s) => s.dailyStreak);
  const recordGame = useGameStore((s) => s.recordGame);
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

  // Le SDK RevenueCat suit l'identité Supabase, session anonyme comprise :
  // c'est ce qui fait qu'un abonnement pris ici vaut sur mobile, et qu'un achat
  // fait avant la création du compte n'est pas perdu.
  const refreshPremium = useCallback(async (uid: string | undefined, anonymous: boolean) => {
    if (!uid) return setIsPremium(false);
    const status = await fetchPremiumStatus(uid, anonymous);
    // Statut inconnu (incident réseau) : on garde l'état courant plutôt que
    // de rétrograder un abonné en gratuit.
    if (status !== null) setIsPremium(status);
  }, []);

  const uid = user?.id;
  const uidIsAnonymous = Boolean(user?.is_anonymous);
  useEffect(() => {
    // Dépendre de l'identité, pas de l'objet `user` : Supabase en émet un
    // nouveau à chaque rafraîchissement de jeton, ce qui relancerait l'appel
    // RevenueCat pour rien.
    void refreshPremium(uid, uidIsAnonymous);
  }, [uid, uidIsAnonymous, refreshPremium]);

  // Seuls les textes d'interface sont chargés au démarrage. Les locales
  // d'entités (jusqu'à 1,3 Mo pour une langue) sont chargées au lancement
  // d'une partie, et seulement pour la famille jouée.
  useEffect(() => {
    let cancelled = false;
    // Contenu serveur (même source que l'app) : datasets, catalogue ET
    // surcouches de traduction, attendus au boot et bornés en interne — au
    // premier passage le seed gagne, ensuite le cache HTTP rend l'application
    // quasi instantanée. Jamais de bascule après le boot.
    void Promise.all([loadLanguage(lang), loadContent(lang)]).then(() => {
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
        config.mode === "daily" ||
        Boolean(config.reviewItems) ||
        Boolean(config.pathBlockId && isMixedBlockId(config.pathBlockId));
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

      if (action === "daily") {
        // Garde en profondeur : la carte est déjà désactivée, mais rien ne doit
        // permettre une 2e partie daily (elle crédite un ticket bonus et écrit
        // dans le classement partagé avec le mobile).
        if (dailyDone) return;
        // Défi MIXTE (le même que le mobile) : l'entityType est inerte, la
        // playlist couvre les 5 familles.
        return void startQuiz({ mode: "daily", entityType: "country", language: lang }, false);
      }

      const mode = action === "survival" ? "survival" : "classic";
      void startQuiz({ mode, entityType: "country", language: lang }, true);
    },
    [lang, startQuiz, dailyDone],
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
    [recordGame, markDailyDone, earnDailyBonus, recordPathResult],
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

  // Pendant une question, la barre de navigation s'efface : rien ne doit
  // distraire du quiz — c'est tout l'intérêt du plateau central unique.
  const focusMode = screen.name === "quiz";

  return (
    <div className="sapiro-game">
      <div className="game-shell">
        <div className="game-board">
          {/* La navigation ouvre le plateau : c'est la carte du jeu, elle passe
              donc avant le compte du joueur (niveau, parties) et avant le
              contenu de l'écran. Flottante et posée en bas, elle recouvrait le
              jeu sans appartenir à rien. */}
          {!focusMode && (
            <GameBottomNav
              user={user}
              current={
                screen.name === "journeys" || screen.name === "board" || screen.name === "profile"
                  ? screen.name
                  : "home"
              }
              onNavigate={(section) => setScreen({ name: section } as Screen)}
              onAccount={() => setAccountOpen(true)}
            />
          )}

          {screen.name === "home" && (
            <div className="game-statusbar">
              <span className="game-pill">
                <Icon emoji="⭐" size={18} /> {t("web.home.level", { level: levelFromXp(xp) })}
              </span>
              {isPremium ? (
                <>
                  <span className="game-pill">
                    <Icon emoji="👑" size={18} /> Pro
                  </span>
                  {/* Abonné sans compte : l'abonnement ne vaut que sur ce
                      navigateur tant qu'il n'est pas rattaché à un compte. Le
                      rappel reste affiché jusqu'à ce que ce soit fait — c'est
                      la seule étape qui sépare l'achat de l'app mobile. */}
                  {!isSignedIn(user) && (
                    <button
                      type="button"
                      className="game-statusbar__cta"
                      onClick={() => {
                        capture("link_subscription_cta", { source: "home_statusbar" });
                        setAccountOpen(true);
                      }}
                    >
                      {t("web.home.linkSubscription")}
                    </button>
                  )}
                </>
              ) : (
                <>
                  <span className="game-pill">
                    <Glyph name="ticket" size={18} /> {tickets}
                  </span>
                  <button
                    type="button"
                    className="game-statusbar__cta"
                    onClick={() => openPaywall("home_statusbar")}
                  >
                    {t("web.home.unlimited")}
                  </button>
                </>
              )}
            </div>
          )}
          {body}

        </div>
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
            // La modale reste ouverte : elle affiche l'écran « installe l'app »
            // (handoff web → app), et se ferme via son propre bouton.
            onPurchased={() => {
              void refreshPremium(uid, uidIsAnonymous);
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
