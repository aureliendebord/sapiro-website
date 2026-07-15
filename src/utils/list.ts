export interface ListItem {
  position: number;
  name: string;
}

/** Retire le markdown inline (**gras**, *italique*, [texte](url)) d'un titre. */
function stripInline(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .trim();
}

/**
 * Extrait les items d'un listicle : les H2 numerotes (## 1. Titre, ## 2) Titre...).
 * Renvoie [] si moins de 3 items (pas un listicle -> pas de schema ItemList).
 */
export function extractListFromMarkdown(body: string): ListItem[] {
  const items: ListItem[] = [];
  for (const line of body.split('\n')) {
    const m = line.match(/^##\s+(\d+)[.)]\s+(.+)$/);
    if (m) {
      items.push({ position: parseInt(m[1], 10), name: stripInline(m[2]) });
    }
  }
  // Positions strictement croissantes a partir de 1 (evite les faux positifs).
  const ordered = items.every((it, i) => it.position === i + 1);
  if (items.length < 3 || !ordered) return [];
  return items;
}
