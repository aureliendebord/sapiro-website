/**
 * Cadre polaroid du visuel de question, et son feedback de bonne réponse.
 *
 * Portage de `components/animated/SuccessGradientFrame.tsx` de l'app : au lieu
 * d'un simple contour vert, tout le fond du cadre (l'espace blanc autour de
 * l'image) devient UNE seule surface dorée animée — un dégradé chaud sur lequel
 * une lumière claire tourne en balayant toute la zone —, avec des étincelles
 * qui scintillent autour du cadre. L'image, posée par-dessus, ne bouge pas.
 */

/** Étincelles autour du cadre : positions fixes, éclosions décalées en boucle. */
const SPARKLES = [
  { top: "-16px", left: "12%", size: 16, delay: 0, char: "✦" },
  { top: "16%", right: "-18px", size: 13, delay: 150, char: "✦" },
  { bottom: "14%", right: "-15px", size: 17, delay: 300, char: "✧" },
  { bottom: "-18px", left: "28%", size: 13, delay: 450, char: "✦" },
  { top: "42%", left: "-18px", size: 15, delay: 600, char: "✧" },
  { top: "-13px", right: "20%", size: 12, delay: 750, char: "✦" },
] as const;

interface Props {
  /** true pendant le feedback de bonne réponse : allume la surface dorée. */
  active: boolean;
  children: React.ReactNode;
}

export function SuccessGradientFrame({ active, children }: Props) {
  return (
    <div className={`quiz-frame ${active ? "quiz-frame--success" : ""}`}>
      {active && (
        <>
          <div className="quiz-frame__gold" aria-hidden="true">
            <span className="quiz-frame__comet" />
          </div>
          {SPARKLES.map((sparkle, i) => {
            const { size, delay, char, ...position } = sparkle;
            return (
              <span
                key={i}
                aria-hidden="true"
                className="quiz-frame__sparkle"
                style={{ ...position, fontSize: `${size}px`, animationDelay: `${delay}ms` }}
              >
                {char}
              </span>
            );
          })}
        </>
      )}
      {children}
    </div>
  );
}
