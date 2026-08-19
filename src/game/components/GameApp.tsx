import { useCallback, useEffect, useMemo, useState } from "react";
import type { AnyFlagEntity, EntityType } from "@/types";
import type { JourneyDefinition } from "@/domain/journeys/catalog";
import { getEntityById } from "@/domain/quiz/entityPool";
import { HomeScreen, type HomeAction } from "./HomeScreen";
import { JourneysScreen } from "./JourneysScreen";
import { QuizScreen } from "./QuizScreen";
import { ResultScreen } from "./ResultScreen";
import { loadLanguage, type GameLang } from "@game/lib/i18n";
import { preloadEntityLocales } from "@/hooks/useEntityDescriptions";
import { useTicketStore, useTicketBalance } from "@game/store/ticketStore";
import { useGameStore } from "@game/store/gameStore";
import { recordGameResult } from "@game/lib/gameResults";
import type { SessionConfig, SessionResult } from "@game/lib/quizSession";
import "@game/styles/game.css";

type Screen =
  | { name: "home" }
  | { name: "journeys" }
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
  const catalogOpen = useTicketStore((s) => s.isCatalogOpen());

  const xp = useGameStore((s) => s.xp);
  const review = useGameStore((s) => s.review);
  const lastDailyKey = useGameStore((s) => s.lastDailyKey);
  const recordGame = useGameStore((s) => s.recordGame);
  const addMiss = useGameStore((s) => s.addMiss);
  const clearMiss = useGameStore((s) => s.clearMiss);
  const markDailyDone = useGameStore((s) => s.markDailyDone);

  // TODO(phase 3) : statut réel depuis RevenueCat Web Billing + premium_overrides.
  const isPremium = false;
  const isSignedIn = false;

  const dailyDone = lastDailyKey === todayKey();

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

  const startQuiz = useCallback(
    async (config: SessionConfig, costsTicket: boolean) => {
      if (costsTicket && !isPremium && !consumeTicket()) {
        // Plus de tickets : l'accueil porte déjà l'invitation à s'abonner.
        setScreen({ name: "home" });
        return;
      }

      // Bloquant : sans les locales, les questions sortiraient en français.
      // En révision, le pool est hétérogène → on charge toutes les familles.
      setPreparing(true);
      await preloadEntityLocales(lang, config.pool ? undefined : [config.entityType]);
      setPreparing(false);

      setScreen({ name: "quiz", config });
    },
    [consumeTicket, isPremium, lang],
  );

  const handleAction = useCallback(
    (action: HomeAction) => {
      if (action === "journeys") return setScreen({ name: "journeys" });

      if (action === "review") {
        const pool = review
          .map((entry) => getEntityById(entry.entityType, entry.entityId))
          .filter((entity): entity is AnyFlagEntity => entity != null);
        if (!pool.length) return;
        return startQuiz({ mode: "review", entityType: pool[0].type, language: lang, pool }, true);
      }

      const mode = action === "daily" ? "daily" : action === "survival" ? "survival" : "classic";
      startQuiz({ mode, entityType: "country", language: lang }, mode !== "daily");
    },
    [review, lang, startQuiz],
  );

  const handlePickJourney = useCallback(
    (journey: JourneyDefinition) => {
      startQuiz(
        {
          mode: "classic",
          journeyId: journey.id,
          entityType: journey.entityType as EntityType,
          language: lang,
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

      void recordGameResult(result);
      setScreen({ name: "result", result, config });
    },
    [recordGame, addMiss, clearMiss, review, markDailyDone, earnDailyBonus],
  );

  /** Quitter sans avoir répondu ne doit rien coûter (comme sur mobile). */
  const handleQuit = useCallback(
    (answered: number, costsTicket: boolean) => {
      if (answered === 0 && costsTicket && !isPremium) refundTicket();
      setScreen({ name: "home" });
    },
    [refundTicket, isPremium],
  );

  const handleSubscribe = useCallback(() => {
    // TODO(phase 3) : ouvrir le checkout RevenueCat Web Billing.
    window.alert("L'abonnement en ligne arrive très bientôt.");
  }, []);

  const handleAccount = useCallback(() => {
    // TODO(phase 2) : modale de connexion Google / email.
    window.alert("La connexion arrive très bientôt.");
  }, []);

  const body = useMemo(() => {
    if (!ready) return <div className="game-loading">Chargement du jeu…</div>;
    if (preparing) return <div className="game-loading">Préparation de la partie…</div>;

    switch (screen.name) {
      case "home":
        return (
          <HomeScreen
            xp={xp}
            ticketsLeft={tickets}
            isPremium={isPremium}
            isSignedIn={isSignedIn}
            reviewCount={review.length}
            dailyDone={dailyDone}
            onAction={handleAction}
            onAccount={handleAccount}
            onSubscribe={handleSubscribe}
          />
        );

      case "journeys":
        return (
          <JourneysScreen
            isPremium={isPremium}
            catalogOpen={catalogOpen}
            onPick={handlePickJourney}
            onLocked={handleSubscribe}
            onBack={() => setScreen({ name: "home" })}
          />
        );

      case "quiz": {
        const costsTicket = screen.config.mode !== "daily";
        return (
          <QuizScreen
            key={`${screen.config.mode}-${screen.config.journeyId ?? "random"}`}
            config={screen.config}
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
            onReplay={() => startQuiz(screen.config, screen.config.mode !== "daily")}
            onHome={() => setScreen({ name: "home" })}
            onSubscribe={handleSubscribe}
          />
        );
    }
  }, [
    ready,
    preparing,
    screen,
    xp,
    tickets,
    isPremium,
    isSignedIn,
    review.length,
    dailyDone,
    catalogOpen,
    lang,
    handleAction,
    handleAccount,
    handleSubscribe,
    handlePickJourney,
    handleFinish,
    handleQuit,
    startQuiz,
  ]);

  return (
    <div className="sapiro-game">
      <div className="game-frame">{body}</div>
    </div>
  );
}
