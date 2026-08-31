/**
 * Confettis de fin de partie — équivalent du `Confetti` maison de l'app.
 *
 * Écrit à la main plutôt qu'ajouté en dépendance : quelques dizaines de
 * rectangles animés sur un canvas, c'est moins de code que la ligne
 * d'installation, et ça évite d'alourdir le bundle du jeu pour trois secondes
 * d'animation.
 *
 * Joués quel que soit `prefers-reduced-motion`, comme le reste des animations
 * du jeu : le réglage système est souvent actif sans intention, et il privait
 * la fin de partie de sa seule récompense visuelle.
 */
const COLORS = ["#FF5E3A", "#F4B740", "#2B8F5E", "#6C7FE0", "#B74F7A"];

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
}

export function celebrate(durationMs = 2200): void {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "60",
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  // Deux gerbes parties des coins bas, comme un canon de chaque côté.
  const pieces: Piece[] = Array.from({ length: 90 }, (_, i) => {
    const fromLeft = i % 2 === 0;
    return {
      x: fromLeft ? 0 : width,
      y: height * 0.75,
      vx: (fromLeft ? 1 : -1) * (5 + Math.random() * 7),
      vy: -(9 + Math.random() * 7),
      size: 6 + Math.random() * 6,
      color: COLORS[i % COLORS.length],
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
    };
  });

  const start = performance.now();
  let frame = 0;

  const tick = (now: number) => {
    const elapsed = now - start;
    if (elapsed > durationMs) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, width, height);
    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.32; // gravité
      p.vx *= 0.99; // frottement de l'air
      p.rotation += p.spin;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      // Disparition progressive sur le dernier tiers.
      ctx.globalAlpha = Math.max(0, 1 - elapsed / durationMs);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }

    frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);

  // Filet de sécurité : si l'onglet passe en arrière-plan, rAF s'arrête et le
  // canvas resterait sur la page au retour.
  window.setTimeout(() => {
    cancelAnimationFrame(frame);
    canvas.remove();
  }, durationMs + 500);
}
