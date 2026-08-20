/**
 * Pictogrammes de l'interface — retour, fermer, cadenas, compte.
 *
 * Distincts des illustrations `<Icon>` : une illustration détourée sur fond
 * crème dans un bouton « fermer » serait visuellement fausse. Ici, du trait
 * en `currentColor` qui prend la couleur du contexte.
 */
export type GlyphName =
  | "back"
  | "close"
  | "lock"
  | "account"
  | "signin"
  | "chevron"
  | "sound-on"
  | "sound-off"
  | "ticket";

interface GlyphProps {
  name: GlyphName;
  size?: number;
  /** Libellé accessible. Absent = pictogramme décoratif. */
  label?: string;
  className?: string;
}

/** Tracés sur une grille 24×24, trait 2, extrémités arrondies. */
const PATHS: Record<GlyphName, React.ReactNode> = {
  back: <path d="M15 19l-7-7 7-7" />,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  chevron: <path d="M9 5l7 7-7 7" />,
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2.5" />
      <path d="M8 10V7a4 4 0 018 0v3" />
    </>
  ),
  account: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
    </>
  ),
  signin: (
    <>
      <path d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4" />
      <path d="M10 16l4-4-4-4M14 12H3" />
    </>
  ),
  "sound-on": (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M17 8.5a5 5 0 010 7" />
    </>
  ),
  // 🎟️ n'a pas d'illustration côté app (elle y est aussi rendue en emoji) :
  // un pictogramme au trait tient mieux dans un compteur.
  ticket: (
    <>
      <path d="M3 9V7a1 1 0 011-1h16a1 1 0 011 1v2a2.5 2.5 0 000 5v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a2.5 2.5 0 000-5z" />
      <path d="M14 7v10" strokeDasharray="2 2.5" />
    </>
  ),
  "sound-off": (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M17 9.5l4 5M21 9.5l-4 5" />
    </>
  ),
};

export function Glyph({ name, size = 24, label, className }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`sapiro-glyph ${className ?? ""}`.trim()}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {PATHS[name]}
    </svg>
  );
}
