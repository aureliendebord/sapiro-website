import { useCallback, useEffect, useMemo, useState } from "react";
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
import { modeColor } from "@game/design/tokens";

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

  const accent = modeColor(config.mode);
  const question = session.question;

  const handlePick = useCallback(
    (choice: string) => {
      if (picked !== null) return;
      setPicked(choice);

      window.setTimeout(() => {
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
      if (e.key === "Escape") return onQuit(session.questionIndex);
      const index = Number(e.key) - 1;
      if (question && index >= 0 && index < question.options.length) {
        handlePick(question.options[index]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question, handlePick, onQuit, session.questionIndex]);

  const progress = useMemo(() => {
    if (session.totalQuestions === null) return null;
    return Math.round((session.questionIndex / session.totalQuestions) * 100);
  }, [session.questionIndex, session.totalQuestions]);

  if (!question) {
    return <div className="game-loading">Chargement de la partie…</div>;
  }

  const visual = entityVisualUrl(question.entity);

  return (
    <div
      style={
        {
          "--accent": accent.primary,
          "--on-accent": accent.onPrimary,
          "--accent-tint": accent.tint,
          "--accent-deep": accent.tintDeep,
          display: "contents",
        } as React.CSSProperties
      }
    >
      <div className="game-topbar">
        <button
          type="button"
          className="game-icon-btn"
          onClick={() => onQuit(session.questionIndex)}
          aria-label="Quitter la partie"
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
            aria-label="Progression de la partie"
          >
            <div className="quiz-progress__bar" style={{ width: `${progress}%` }} />
          </div>
        ) : (
          <span className="game-pill">{session.questionIndex} bonnes réponses</span>
        )}

        {config.mode === "survival" ? (
          <span className="quiz-lives" aria-label={`${session.lives} vies restantes`}>
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
          {question.options.map((option, i) => (
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
