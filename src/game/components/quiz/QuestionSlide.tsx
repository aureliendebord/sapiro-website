import { useEffect, useRef, useState } from "react";

/** Durée du glissement, alignée sur `QuestionSlide` de l'app (280 ms). */
const SLIDE_MS = 280;

interface Props {
  transitionKey: string;
  children: React.ReactNode;
}

type Pane = { key: string; node: React.ReactNode };

/**
 * Transition entre deux questions, façon pager : le contenu sortant glisse
 * vers la gauche pendant que le suivant arrive depuis la droite. Portage du
 * composant homonyme de l'app (`components/animated/QuestionSlide.tsx`).
 *
 * Le pane sortant est l'élément du rendu précédent, conservé le temps de
 * quitter l'écran — il garde donc ses couleurs de feedback pendant la sortie.
 */
export function QuestionSlide({ transitionKey, children }: Props) {
  const [outgoing, setOutgoing] = useState<Pane | null>(null);
  const lastRef = useRef<Pane>({ key: transitionKey, node: children });

  // Capture pendant le rendu (pattern « derived state ») : au moment où la clé
  // change, lastRef porte encore l'élément de la question précédente.
  if (lastRef.current.key !== transitionKey) {
    setOutgoing(lastRef.current);
  }
  lastRef.current = { key: transitionKey, node: children };

  // Retrait au chronomètre, pas sur `animationend` : en `prefers-reduced-motion`
  // l'animation est coupée et l'évènement ne partirait jamais — le pane sortant
  // resterait collé par-dessus la question suivante.
  useEffect(() => {
    if (!outgoing) return;
    const timer = window.setTimeout(() => setOutgoing(null), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [outgoing]);

  return (
    <div className="quiz-slide">
      <div
        key={transitionKey}
        className={`quiz-slide__pane ${outgoing ? "quiz-slide__pane--in" : ""}`}
      >
        {children}
      </div>
      {outgoing && (
        <div key={outgoing.key} className="quiz-slide__pane quiz-slide__pane--out" aria-hidden="true">
          {outgoing.node}
        </div>
      )}
    </div>
  );
}
