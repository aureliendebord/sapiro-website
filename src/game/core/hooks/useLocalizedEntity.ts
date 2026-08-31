// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import type { AnyFlagEntity } from "@/types";
import { resolveLocalizedEntity, type LangCode } from "@/lib/content/localize";

/**
 * Hook de résolution d'une entité dans la langue courante.
 *
 * La logique vit dans `lib/content/localize.ts` (module pur, partagé avec le
 * moteur, les scripts Node et le web) — ce fichier n'est que l'adaptateur
 * React qui y branche la langue active d'i18n.
 */
export function useLocalizedEntity<E extends AnyFlagEntity>(entity: E): E {
  const { i18n } = useTranslation();

  return useMemo(() => {
    return resolveLocalizedEntity(entity, i18n.language || "fr");
  }, [entity, i18n.language]);
}

// Ré-exports de compatibilité pour les call sites historiques.
export { resolveLocalizedEntity };
export type { LangCode };
