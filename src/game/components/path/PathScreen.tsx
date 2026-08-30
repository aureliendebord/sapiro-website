import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  PATH_STAGES,
  STAGE_COUNT,
  allBlocksOfStage,
  isMixedBlockId,
  questionsFor,
} from "@/domain/journeys/path";
import { getJourneyById } from "@/domain/journeys/catalog";
import { usePathStore } from "@game/store/pathStore";
import {
  clearedCount,
  computeUnlockedStages,
  nextBlockId,
  nodeStatus,
} from "@/domain/journeys/pathProgress";
import { themeColor } from "@game/design/tokens";
import { t } from "@game/lib/i18n";
import { Icon } from "../ui/Icon";
import { Glyph } from "../ui/Glyph";

/** Géométrie du sentier — mêmes valeurs que `PathSection.tsx` de l'app. */
const STEP = 168;
const STAGE_GAP = 72;
const NODE = 120;
const NODE_MIXED = 136;

interface Props {
  isPremium: boolean;
  onPlay: (blockId: string) => void;
  onLocked: (blockId: string, reason: string) => void;
}

interface Node {
  blockId: string;
  x: number;
  y: number;
  size: number;
  /** Bannière d'étape à dessiner juste au-dessus de ce nœud. */
  stageBanner: number | null;
}

/**
 * Le sentier Aventure : 9 étapes de 6 blocs (5 thématiques + un mixte de
 * clôture), reliées par un chemin qui serpente du bas vers le haut.
 *
 * Remplace l'ancien catalogue de 88 parcours, retiré de l'app en août au
 * profit de ce parcours guidé — le web montrait encore un écran que le produit
 * n'a plus.
 *
 * Le tracé reprend la géométrie exacte du mobile (pas vertical, amplitude,
 * respiration entre étapes) pour que les deux plateformes racontent la même
 * progression. Reanimated devient ici des animations CSS.
 */
export function PathScreen({ isPremium, onPlay, onLocked }: Props) {
  // Un seul abonnement réactif (blocks) ; états et bloc courant sont dérivés
  // UNE fois par rendu via le domaine — statusOf refaisait le calcul du bloc
  // courant pour chacun des 54 nœuds.
  const blocks = usePathStore((s) => s.blocks);
  const currentBlock = useMemo(() => nextBlockId(blocks), [blocks]);
  const clearedTotal = useMemo(() => clearedCount(blocks), [blocks]);
  const unlockedStages = useMemo(() => computeUnlockedStages(blocks), [blocks]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState(420);

  // Le tracé dépend de la largeur : on la mesure avant peinture pour éviter
  // que le chemin saute au premier rendu.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const { nodes, height, path } = useMemo(() => buildTrail(width), [width]);

  // On arrive sur le nœud à jouer, pas en haut de la carte. Sans animation au
  // premier rendu : un défilement fluide depuis le sommet serait du bruit.
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center" });
  }, [currentBlock]);

  return (
    <>
      <div className="game-topbar">
        <div>
          <h1 className="path-title">{t("path.title")}</h1>
          <p className="path-sub">{t("path.headerSubtitle")}</p>
        </div>
        <span className="game-pill">
          <Glyph name="chevron" size={14} />
          {t("web.path.cleared", { done: clearedTotal, total: STAGE_COUNT * 6 })}
        </span>
      </div>

      <div className="path-wrap" ref={wrapRef}>
        {/* Les nœuds sont positionnés en absolu : sans cette toile de hauteur
            explicite, le conteneur s'effondrerait et rien ne défilerait. */}
        <div className="path-canvas" style={{ height }}>
        <svg
          className="path-trail"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden="true"
        >
          <path
            d={path}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity={0.38}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray="1 13"
          />
        </svg>

        {nodes.map((node) => {
          const status = nodeStatus(blocks, node.blockId, currentBlock);
          const journey = getJourneyById(node.blockId);
          const mixed = isMixedBlockId(node.blockId);
          const colors = themeColor(journey?.theme);
          // `journeys.items.<id>` = titre localisé des locales synchronisées ;
          // repli sur le titre FR du catalogue si la clé manque.
          const localized = t(`journeys.items.${node.blockId}`);
          const label = mixed
            ? t("path.mixedTitle")
            : localized !== `journeys.items.${node.blockId}`
              ? localized
              : (journey?.title ?? node.blockId);

          return (
            <div
              key={node.blockId}
              className="path-node-slot"
              style={{ left: node.x - node.size / 2, top: node.y - node.size / 2 }}
            >
              {node.stageBanner !== null && (
                <span
                  className={`path-stage ${
                    node.stageBanner < unlockedStages ? "" : "path-stage--locked"
                  }`}
                >
                  {t("path.stage", { stage: node.stageBanner + 1 })}
                </span>
              )}

              {status === "current" && <span className="path-turn">{t("path.yourTurn")}</span>}

              <button
                type="button"
                ref={status === "current" ? currentRef : undefined}
                className={`path-node path-node--${status} ${mixed ? "path-node--mixed" : ""}`}
                style={
                  {
                    width: node.size,
                    height: node.size,
                    "--node-accent": colors.primary,
                    "--node-tint": colors.tint,
                  } as React.CSSProperties
                }
                aria-label={`${label} — ${t(`web.path.status.${status}`)}`}
                onClick={() => {
                  if (status === "locked" || status === "closed") {
                    onLocked(node.blockId, reasonFor(node.blockId, status));
                    return;
                  }
                  onPlay(node.blockId);
                }}
              >
                <Icon emoji={journey?.icon ?? "🧭"} size={node.size - 44} />
                <span className="path-node__label">{label}</span>
                <span className="path-node__count">
                  {t("web.path.questions", { count: questionsFor(node.blockId) })}
                </span>
                {status === "done" && <span className="path-node__check" aria-hidden="true">✓</span>}
              </button>
            </div>
          );
        })}
        </div>
      </div>
    </>
  );
}

/** Message expliquant POURQUOI le nœud est fermé — jamais un refus muet. */
function reasonFor(blockId: string, status: string): string {
  if (status === "locked") return t("path.stageLockedBody");
  return isMixedBlockId(blockId) ? t("path.mixedLockedBody") : t("path.blockLockedBody");
}

/**
 * Construit les positions des 54 nœuds et le tracé qui les relie.
 * `x = centre + amplitude·sin(i·1.05)` : la même sinusoïde que l'app.
 */
function buildTrail(width: number): { nodes: Node[]; height: number; path: string } {
  const amp = Math.min(72, width / 2 - NODE_MIXED / 2 - 12);
  const nodes: Node[] = [];
  let y = NODE_MIXED / 2 + 40;
  let i = 0;

  for (let stage = 0; stage < STAGE_COUNT; stage += 1) {
    // Respiration supplémentaire à chaque frontière d'étape.
    if (stage > 0) y += STAGE_GAP;

    for (const blockId of allBlocksOfStage(stage)) {
      const mixed = isMixedBlockId(blockId);
      nodes.push({
        blockId,
        x: width / 2 + amp * Math.sin(i * 1.05),
        y,
        size: mixed ? NODE_MIXED : NODE,
        stageBanner: blockId === PATH_STAGES[stage]?.[0] ? stage : null,
      });
      y += STEP;
      i += 1;
    }
  }

  // Courbes quadratiques enchaînées : le chemin passe par chaque nœud sans
  // casser d'angle.
  const path = nodes
    .map((node, index) => {
      if (index === 0) return `M ${node.x} ${node.y}`;
      const prev = nodes[index - 1];
      const midY = (prev.y + node.y) / 2;
      return `Q ${prev.x} ${midY} ${node.x} ${node.y}`;
    })
    .join(" ");

  return { nodes, height: y - STEP + NODE_MIXED / 2 + 40, path };
}
