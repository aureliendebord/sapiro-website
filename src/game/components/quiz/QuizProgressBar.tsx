/**
 * Barre de progression continue du quiz — portage de `QuizProgressBar`
 * (`components/quiz/QuizHeader.tsx` de l'app, commit « barre de progression
 * continue avec étincelles au bord »).
 *
 * Une seule barre pill qui se remplit à chaque réponse, sans découpage par
 * question : le détail juste/raté n'y figure plus — le feedback est déjà donné
 * question par question. Trois étincelles de la couleur du mode jaillissent du
 * bord qui avance pour donner le sens du mouvement.
 */

/** Décalage, taille et retard de chaque étincelle (px / ms), comme dans l'app. */
const SPARKS = [
  { dx: 13, dy: -9, size: 4, delay: 0 },
  { dx: 17, dy: 3, size: 3, delay: 67 },
  { dx: 10, dy: 8, size: 3, delay: 123 },
];

interface Props {
  /** Réponses données, feedback en cours compris. */
  answered: number;
  total: number;
  label: string;
}

export function QuizProgressBar({ answered, total, label }: Props) {
  const ratio = total > 0 ? Math.min(answered / total, 1) : 0;
  const pct = `${ratio * 100}%`;

  return (
    <div
      className="quiz-progress"
      role="progressbar"
      aria-valuenow={Math.min(answered, total)}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={label}
    >
      <div className="quiz-progress__track">
        <div className="quiz-progress__fill" style={{ width: pct }} />
      </div>
      {/* Étincelles : hors du track (qui masque son débordement) pour pouvoir
          déborder du bord. Remontées à chaque réponse (`key`) — c'est ce qui
          rejoue l'animation ; aucune au démarrage, la barre n'a pas bougé. */}
      {answered > 0 && (
        <div key={answered} className="quiz-progress__head" style={{ left: pct }} aria-hidden="true">
          {SPARKS.map((spark, i) => (
            <span
              key={i}
              className="quiz-progress__spark"
              style={
                {
                  width: `${spark.size}px`,
                  height: `${spark.size}px`,
                  animationDelay: `${spark.delay}ms`,
                  "--spark-dx": `${spark.dx}px`,
                  "--spark-dy": `${spark.dy}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
