# Jeu web Sapiro

Le jeu complet, jouable dans le navigateur sur `/jouer/`, `/en/play/`, `/es/jugar/`.

## Ce qui est copié et ce qui est écrit ici

`src/game/core/` est **synchronisé depuis le repo de l'app mobile** — ne jamais
l'éditer à la main. Toute correction de gameplay, de question ou de donnée se
fait dans l'app puis se propage :

```bash
npm run sync:game     # copie domain/, data/, types, locales fr/en/es, drapeaux
npm run check:game    # échoue si le cœur a dérivé (utile en CI)
npm run smoke:game    # joue une partie complète en Node, sans navigateur
```

La sortie est commitée : la CI du site n'a pas accès au repo de l'app. Le script
lit `~/Projets/sapiro` par défaut, surchargeable avec `SAPIRO_APP_PATH`.

Le reste de `src/game/` est du code web écrit ici : l'interface React, l'état
local (quota, XP, révision), l'auth et le paiement. L'UI est donc maintenue à
deux endroits (React Native pour l'app, React pour le web) — c'est assumé ; ce
qui compte, la logique de jeu, ne l'est pas.

Une seule exception au copier-coller : `core/hooks/useEntityDescriptions.ts` est
généré depuis `scripts/templates/useEntityDescriptions.web.ts`. L'app importe 11
langues de JSON en statique (~13 Mo) ; le web en sert 3, chargées à la demande
et par famille d'entités jouée.

## Variables d'environnement

Sans elles, le jeu reste **jouable** : seuls le compte et l'abonnement sont
indisponibles (message explicite, aucune erreur silencieuse).

| Variable | Rôle |
|---|---|
| `PUBLIC_SUPABASE_URL` | Projet Supabase (le même que l'app mobile) |
| `PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme du projet |
| `PUBLIC_RC_WEB_API_KEY` | Clé RevenueCat Web Billing (`rcb_…`) — phase paiement |

À déclarer dans `.env` en local et dans le build GitHub Actions pour la prod.

## Configuration backend nécessaire

Côté Supabase self-hosted (GoTrue), pour que l'auth web fonctionne :

- **Google** : provider activé avec le client id web existant ; ajouter
  `https://<supabase>/auth/v1/callback` aux redirect URIs Google Cloud Console
  et `https://sapiro.app` aux origines JS autorisées.
- `GOTRUE_SITE_URL=https://sapiro.app` et `GOTRUE_URI_ALLOW_LIST` incluant
  `https://sapiro.app/*` et `sapiro://*`.
- **SMTP** configuré (réinitialisation de mot de passe).
- `GOTRUE_MAILER_AUTOCONFIRM=true` — création de compte sans vérification
  d'email, choix produit assumé pour ne pas freiner l'inscription.

Côté R2 : autoriser `https://sapiro.app` en CORS sur `cdn.sapiro.app` (portraits,
œuvres, animaux, monuments). Les drapeaux, eux, sont servis par le site.

## Comptes et fusion de progression

On joue d'abord, on crée un compte ensuite. Une session **anonyme** Supabase est
ouverte au premier lancement pour que la progression soit rattachable.

Le piège, identique à celui du mobile (voir la migration `0019_merge_anonymous`
de l'app) : se connecter depuis une session anonyme ne promeut pas cette session,
Supabase renvoie l'utilisateur de l'identité cible, donc un **uid différent** —
et les parties de l'ancien uid deviennent orphelines. D'où :

- **Créer un compte email depuis une session anonyme** → `updateUser` : l'uid est
  conservé, aucune fusion. C'est le chemin nominal.
- **Se connecter** (Google ou email existant) → l'uid change, on appelle l'edge
  function `merge-anonymous-account` de l'app, sans la modifier.

Google passant par un redirect complet, le jeton anonyme est mis de côté dans
localStorage avant le départ et repris au retour (`completePendingMerge`).
