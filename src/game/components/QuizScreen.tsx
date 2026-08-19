import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AnyFlagEntity } from "@/types";
import { getQuestionPrompt } from "@game/lib/questionPrompt";
import { entityVisualUrl, isImageEntity } from "@game/lib/entityAssets";
import {
  answer as answerSession,
  finishSession,
  startSession,
  type SessionConfig,
  type SessionResult,
  type SessionState,
} from "@game/lib/quizSession";
import { accentVars } from "@game/design/tokens";
import { t } from "@game/lib/i18n";

/** Délai d'affichage du feedback avant la question suivante (ms). */
const FEEDBACK_MS = 900;

interface Props {
  config: SessionConfig;
  onFinish: (result: SessionResult, answered: number) => void;
  onQuit: (answered: number) => void;
}

export function QuizScreen({ config, onFinish, onQuit }: Props) {
  const [session, setSession] = useState<SessionState>(() => startSession(config));
  const [picked, setPicked] = useState<string | null>(null);
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

      feedbackTimer.current = window.setTimeout(() => {
        feedbackTimer.current = null;
        const { state } = answerSession(session, choice);
        setPicked(null);
        setSession(state);
        if (state.finished) {
          onFinish(finishSession(state), state.questionIndex);
        }
      }, FEEDBACK_MS);
    },
    [picked, session, onFinish],
  );

  // Clavier : 1-4 pour répondre, Échap pour quitter. Le jeu est jouable au
  // clavier sur desktop, où la souris pour 10 questions est vite pénible.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onQuit(answeredCount);
      const index = Number(e.key) - 1;
      if (question && index >= 0 && index < question.options.length) {
        handlePick(question.options[index]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question, handlePick, onQuit, answeredCount]);

  const progress = useMemo(() => {
    if (session.totalQuestions === null) return null;
    return Math.round((session.questionIndex / session.totalQuestions) * 100);
  }, [session.questionIndex, session.totalQuestions]);

  if (!question) {
    return <div className="game-loading">{t("web.quiz.loading")}</div>;
  }

  const visual = entityVisualUrl(question.entity);

  return (
    <div style={{ ...accentVars(config.mode), display: "contents" } as React.CSSProperties}>
      <div className="game-topbar">
        <button
          type="button"
          className="game-icon-btn"
          onClick={() => onQuit(answeredCount)}
          aria-label={t("web.quiz.quit")}
        >
          ←
        </button>

        {progress !== null ? (
          <div
            className="quiz-progress"
            role="progressbar"
            aria-valuenow={session.questionIndex}
            aria-valuemin={0}
            aria-valuemax={session.totalQuestions ?? undefined}
            aria-label={t("web.quiz.progress")}
          >
            <div className="quiz-progress__bar" style={{ width: `${progress}%` }} />
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
            {"❤️".repeat(Math.max(0, session.lives))}
          </span>
        ) : (
          <span className="game-pill">
            {session.questionIndex + 1}/{session.totalQuestions}
          </span>
        )}
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

        <div className="quiz-options">
          {question.options.map((option) => (
            <button
              type="button"
              key={option}
              className={`quiz-option ${optionState(option, question.correctAnswer, picked)}`}
              onClick={() => handlePick(option)}
              disabled={picked !== null}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
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
      <span style={{ fontSize: 64 }}>{entity.type === "figure" ? "👤" : "🗺️"}</span>
    </div>
  );
}
