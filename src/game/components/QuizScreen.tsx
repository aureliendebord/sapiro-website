import { useCallback, useEffect, useRef, useState } from "react";
import type { AnyFlagEntity } from "@/types";
import { getQuestionPrompt } from "@game/lib/questionPrompt";
import { entityVisualUrl, isImageEntity } from "@game/lib/entityAssets";
import {
  answer as answerSession,
  finishSession,
  grayedOptions,
  startSession,
  type SessionConfig,
  type SessionResult,
  type SessionState,
} from "@game/lib/quizSession";
import { accentVars } from "@game/design/tokens";
import { t } from "@game/lib/i18n";
import { Icon } from "./ui/Icon";
import { Glyph } from "./ui/Glyph";
import { getMuted, play, setMuted } from "@game/lib/sounds";
import { DidYouKnow, hasFacts } from "./quiz/DidYouKnow";

/** Délai d'affichage du feedback avant la question suivante (ms). */
const FEEDBACK_MS = 900;

interface Props {
  config: SessionConfig;
  /**
   * Série du Défi du jour AVANT cette partie : `calculateXP` en a besoin pour
   * accorder le bonus de série. Sans elle, le bonus n'était jamais versé.
   */
  previousDailyStreak: number;
  onFinish: (result: SessionResult, answered: number) => void;
  onQuit: (answered: number) => void;
}

export function QuizScreen({ config, previousDailyStreak, onFinish, onQuit }: Props) {
  const [session, setSession] = useState<SessionState>(() => startSession(config));
  const [picked, setPicked] = useState<string | null>(null);
  const [muted, setMutedState] = useState(() => getMuted());
  /** Anecdote en attente : la question suivante ne vient qu'après « Continuer ». */
  const [fact, setFact] = useState<{ entity: AnyFlagEntity; next: () => void } | null>(null);
  // Le timeout de feedback doit mourir avec l'écran : sans ça, quitter pendant
  // la fenêtre de 900 ms laisse un onFinish tardif rouvrir l'écran de résultat.
  const feedbackTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current);
    };
  }, []);

  const question = session.question;

  // Réponses données, feedback en cours compris : quitter pendant les 900 ms
  // d'affichage NE doit PAS passer pour une partie vierge (remboursement indu).
  const answeredCount = session.questionIndex + (picked !== null ? 1 : 0);

  const handlePick = useCallback(
    (choice: string) => {
      if (picked !== null) return;
      setPicked(choice);
      play(choice === session.question?.correctAnswer ? "correct" : "incorrect");

      const answered = session.question;

      feedbackTimer.current = window.setTimeout(() => {
        feedbackTimer.current = null;
        const { state } = answerSession(session, choice);

        const advance = () => {
          setFact(null);
          setPicked(null);
          setSession(state);
          if (state.finished) {
            onFinish(finishSession(state, { previousDailyStreak }), state.questionIndex);
          }
        };

        // L'anecdote s'intercale seulement s'il y a quelque chose à raconter :
        // une carte vide vaut moins qu'un enchaînement direct.
        if (answered && hasFacts(answered.entity, config.language)) {
          setFact({ entity: answered.entity, next: advance });
        } else {
          advance();
        }
      }, FEEDBACK_MS);
    },
    [picked, session, onFinish, previousDailyStreak, config.language],
  );

  // Clavier : 1-4 pour répondre, Échap pour quitter. Le jeu est jouable au
  // clavier sur desktop, où la souris pour 10 questions est vite pénible.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onQuit(answeredCount);
      const index = Number(e.key) - 1;
      if (question && index >= 0 && index < question.options.length) {
        // Une option grisée par la repasse n'est pas jouable, clavier compris.
        if (grayedOptions(session).has(question.options[index])) return;
        handlePick(question.options[index]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question, handlePick, onQuit, answeredCount]);

  if (!question) {
    return <div className="game-loading">{t("web.quiz.loading")}</div>;
  }

  const visual = entityVisualUrl(question.entity);

  // Repasse : les mauvaises options déjà écartées sont grisées (1 à la 1re
  // erreur, 2 au plafond) — on resserre le choix pour apprendre, comme l'app.
  const grayed = grayedOptions(session);

  // Question secondaire (capitale, siège, nationalité…) : le nom de l'entité
  // est affiché pour ne pas poser une double énigme — deviner le pays PUIS sa
  // capitale. Même règle que l'app ; le titre d'une œuvre ou le nom d'un
  // animal EST la réponse, donc jamais affiché pour ces familles.
  const showsEntityName =
    question.type === "secondary" &&
    question.entity.type !== "artwork" &&
    question.entity.type !== "animal";

  return (
    <div style={{ ...accentVars(config.mode), display: "contents" } as React.CSSProperties}>
      <div className="game-topbar">
        <button
          type="button"
          className="game-icon-btn"
          onClick={() => onQuit(answeredCount)}
          aria-label={t("web.quiz.quit")}
        >
          <Glyph name="back" size={22} />
        </button>

        {session.totalQuestions !== null ? (
          <div
            className="quiz-segments"
            role="progressbar"
            aria-valuenow={session.questionIndex}
            aria-valuemin={0}
            aria-valuemax={session.totalQuestions}
            aria-label={t("web.quiz.progress")}
          >
            {Array.from({ length: session.totalQuestions }, (_, i) => (
              <span key={i} className={`quiz-segment ${segmentState(i, session, picked)}`} />
            ))}
          </div>
        ) : (
          <span className="game-pill">
            {t("web.quiz.goodAnswers", { count: session.questionIndex })}
          </span>
        )}

        {config.mode === "survival" ? (
          <span
            className="quiz-lives"
            aria-label={t("web.quiz.livesLeft", { count: session.lives })}
          >
            {Array.from({ length: Math.max(0, session.lives) }, (_, i) => (
              <Icon key={i} emoji="❤️" size={20} />
            ))}
          </span>
        ) : session.retrying ? (
          // Phase de repasse : plus de compteur (il afficherait 11/10), on
          // annonce ce qui se passe — on corrige ses erreurs.
          <span className="game-pill">{t("web.quiz.retry")}</span>
        ) : (
          <span className="game-pill">
            {session.questionIndex + 1}/{session.totalQuestions}
          </span>
        )}

        <button
          type="button"
          className="game-icon-btn"
          aria-pressed={!muted}
          aria-label={t(muted ? "web.quiz.soundOff" : "web.quiz.soundOn")}
          onClick={() => {
            const next = !muted;
            setMuted(next);
            setMutedState(next);
            if (!next) play("tap");
          }}
        >
          <Glyph name={muted ? "sound-off" : "sound-on"} size={20} />
        </button>
      </div>

      <div className="quiz-stage">
        <p className="quiz-prompt">{getQuestionPrompt(question)}</p>

        <div className={`quiz-visual ${isImageEntity(question.entity) ? "" : "quiz-visual--flag"}`}>
          {visual ? (
            <img src={visual} alt="" key={question.entity.id} loading="eager" />
          ) : (
            <EntityFallback entity={question.entity} />
          )}
        </div>

        {showsEntityName && <p className="quiz-entity-name">{question.entity.name}</p>}

        {fact && (
          <DidYouKnow entity={fact.entity} lang={config.language} onContinue={fact.next} />
        )}

        <div className="quiz-options">
          {question.options.map((option) => {
            const dimmed = grayed.has(option);
            return (
              <button
                type="button"
                key={option}
                className={`quiz-option ${optionState(option, question.correctAnswer, picked)} ${dimmed ? "quiz-option--dimmed" : ""}`}
                onClick={() => handlePick(option)}
                disabled={picked !== null || dimmed}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * État d'un segment de la barre de progression : réussi, raté, en cours, à
 * venir. Reproduit la lecture instantanée du header de l'app — on voit d'un
 * coup d'œil où on en est ET comment on s'en sort.
 */
function segmentState(index: number, session: SessionState, picked: string | null): string {
  if (index < session.questionIndex) {
    return session.answers[index] ? "quiz-segment--ok" : "quiz-segment--ko";
  }
  if (index === session.questionIndex) {
    return picked === null ? "quiz-segment--current" : "quiz-segment--current";
  }
  return "";
}

/**
 * Classe de feedback d'une option : rien tant que le joueur n'a pas répondu,
 * puis la bonne réponse en vert et le mauvais choix en rouge.
 */
function optionState(option: string, correct: string, picked: string | null): string {
  if (picked === null) return "";
  if (option === correct) return "quiz-option--correct";
  if (option === picked) return "quiz-option--wrong";
  return "";
}

/** Repli quand l'entité n'a pas de visuel (aucun drapeau, image CDN absente). */
function EntityFallback({ entity }: { entity: AnyFlagEntity }) {
  return (
    <div className="game-empty" aria-hidden="true">
      <Icon emoji={entity.type === "figure" ? "👤" : "🗺️"} size={64} />
    </div>
  );
}
