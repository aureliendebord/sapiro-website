import { EMOJI_TO_ICON } from "@game/design/icons.generated";
import { FLAG_FILES } from "@game/design/flags.generated";

/**
 * Icône illustrée Sapiro — port web de `components/ui/Icon.tsx` de l'app.
 *
 * Les données du jeu (parcours, thèmes, badges) stockent un emoji ; l'app le
 * remplace par une illustration cohérente avec sa DA. Même chaîne de repli ici :
 * illustration → drapeau SVG → emoji natif. Il n'y a jamais de trou visuel.
 *
 * Les `.webp` sont servis depuis `public/images/icons/` (synchronisés depuis
 * l'app par `npm run sync:game`) : rien n'entre dans le bundle JS.
 */
interface IconProps {
  /** Emoji source, tel que stocké dans les données (`journey.icon`, badge…). */
  emoji: string;
  /** Côté en pixels (largeur = hauteur). */
  size?: number;
  /** Rayon des coins. Par défaut 22 % du côté, comme l'app (look « icône d'app »). */
  radius?: number;
  /** Force l'emoji natif — pour les mini-icônes au fil du texte. */
  inline?: boolean;
  /** Libellé accessible. Absent = icône décorative. */
  label?: string;
  /** Icône au-dessus du pli (cartes de mode) : évite le chargement paresseux. */
  eager?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Indicateurs régionaux Unicode → code ISO alpha-2 → fichier de `public/flags/`.
 * 🇪🇺 n'est pas un pays : son drapeau vit avec les organisations, d'où les deux
 * dossiers testés (même logique que l'app).
 */
function flagPathFromEmoji(emoji: string): string | null {
  const code = Array.from(emoji)
    .map((ch) => ch.codePointAt(0) ?? 0)
    .filter((cp) => cp >= 0x1f1e6 && cp <= 0x1f1ff)
    .map((cp) => String.fromCharCode(cp - 0x1f1e6 + 97))
    .join("");
  if (code.length !== 2) return null;
  return [`countries/${code}`, `organizations/${code}`].find((p) => FLAG_FILES.has(p)) ?? null;
}

export function Icon({
  emoji,
  size = 24,
  radius,
  inline = false,
  label,
  eager = false,
  className,
  style,
}: IconProps) {
  const slug = inline ? undefined : EMOJI_TO_ICON[emoji];
  const flag = inline || slug ? null : flagPathFromEmoji(emoji);

  if (slug || flag) {
    return (
      <img
        src={slug ? `/images/icons/${slug}.webp` : `/flags/${flag}.svg`}
        width={size}
        height={size}
        alt={label ?? ""}
        aria-hidden={label ? undefined : true}
        draggable={false}
        decoding="async"
        loading={eager ? "eager" : "lazy"}
        className={`sapiro-ico ${className ?? ""}`.trim()}
        style={{ borderRadius: radius ?? Math.round(size * 0.22), ...style }}
      />
    );
  }

  return (
    <span
      className={`sapiro-ico sapiro-ico--emoji ${className ?? ""}`.trim()}
      style={{ fontSize: size, ...style }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {emoji}
    </span>
  );
}
