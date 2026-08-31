// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import { useTranslation } from "react-i18next";

import type { EntityType } from "@/types";
import { getLocalizedEntry } from "@/lib/content/locales";

// Le schéma des entrées et la résolution vivent dans `lib/content/locales.ts`
// (module pur, partagé avec le moteur et le web) — ré-exportés ici pour les
// écrans qui les importaient déjà depuis ce fichier.
export type { LocalizedEntityEntry, LocalizedEntityJson } from "@/lib/content/locales";
export { getLocalizedEntry };

/**
 * Hook qui résout les descriptions (fun facts) d'une entité dans la langue
 * courante (fallback FR). Sans entityId au montage — utile quand on veut
 * résoudre plusieurs IDs dans un même composant (ex: DidYouKnow qui dispatch
 * par type).
 */
export function useGetEntityDescriptions() {
  const { i18n } = useTranslation();

  const getDescriptions = (entityType: EntityType, entityId: string): string[] => {
    const entry = getLocalizedEntry(entityType, entityId, i18n.language || "fr");
    return entry?.descriptions ?? [];
  };

  return { getDescriptions };
}
