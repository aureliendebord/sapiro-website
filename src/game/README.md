# Jeu web Sapiro

Le jeu complet, jouable dans le navigateur sur `/jouer/`, `/en/play/`, `/es/jugar/`.

## Ce qui est copié et ce qui est écrit ici

`src/game/core/` est **synchronisé depuis le repo de l'app mobile** — ne jamais
l'éditer à la main. Toute correction de gameplay, de question ou de donnée se
fait dans l'app puis se propage :

```bash
npm run sync:game      # copie domain/, lib/content/, data/, types, locales fr/en/es, drapeaux
npm run check:game     # échoue si le cœur a dérivé (CI)
npm run smoke:game     # joue une partie complète en Node, sans navigateur (CI)
npm run parity:game    # rejoue le Défi du jour DANS LES DEUX REPOS et compare
npm run check:parity   # rejoue le Défi du jour ici et compare à la référence (CI)
```

La sortie est commitée : la CI du site n'a pas accès au repo de l'app. Le script
lit `~/Projets/sapiro` par défaut, surchargeable avec `SAPIRO_APP_PATH`.

Le reste de `src/game/` est du code web écrit ici : l'interface React, l'état
local (quota, XP, révision), l'auth et le paiement. L'UI est donc maintenue à
deux endroits (React Native pour l'app, React pour le web) — c'est assumé ; ce
qui compte, la logique de jeu, ne l'est pas.

### Un seul nœud de vérité, à deux étages

| Étage | Source unique | Arrivée côté site |
|---|---|---|
| **Logique** (tirage, distracteurs, scoring, parcours) | `domain/` + `lib/content/` de l'app | copiés verbatim dans `core/` |
| **Contenu** (entités, traductions, catalogue) | `cdn.sapiro.app/content/` | `src/game/lib/loadContent.ts` |

Le site ne réimplémente **ni l'un ni l'autre**. `core/lib/content/state.ts` est
le point d'injection commun : côté mobile c'est `lib/content/store.ts` qui y
écrit depuis le disque, ici c'est `loadContent.ts` qui y écrit depuis le CDN.
Les accesseurs lus par le moteur (`entities.ts`, `catalog.ts`, `locales.ts`,
`localize.ts`) sont les mêmes fichiers des deux côtés.

Conséquence : **ne jamais dupliquer un filtre de pool, une règle de repli de
traduction ou une liste de thèmes côté web** — c'est exactement la divergence
que ce montage supprime. Et ne jamais importer `lib/content/store.ts`, qui tire
`expo-file-system` et PostHog.

### La seule divergence assumée

`core/lib/content/locales.ts` est généré depuis
`scripts/templates/locales.web.ts`. L'app importe 11 langues de JSON en statique
(~13 Mo) ; le site en sert 3, chargées à la demande et par famille d'entités
jouée. L'API publique et **l'ordre de repli** (distant(langue) → bundlé(langue)
→ distant(fr) → bundlé(fr)) sont identiques à l'app — c'est ce qui évite de
faire basculer en français un joueur dont la langue existe.

### Contenu serveur au boot

`loadContent(lang)` est attendu au montage du jeu, borné à 1,5 s. Règles
reprises de l'app :

- **jamais de bascule sous une session** : passé le délai, les requêtes sont
  annulées et rien n'est appliqué ;
- **datasets et catalogue sont tout-ou-rien** — un mélange seed/serveur ferait
  diverger le Défi du jour du mobile ;
- **tout échec est silencieux** et retombe sur le seed bundlé : le pire cas est
  « pas de nouveauté », jamais un jeu cassé.

Contrairement au mobile, le site ne stocke rien : les fichiers `v/{N}/…` sont
immuables, le cache HTTP fait office de disque. Au premier passage le seed gagne
souvent la course ; aux visites suivantes l'application est immédiate.

### Preuve que web et mobile posent les mêmes questions

Le Défi du jour est déterministe (seed dérivé de la date). `npm run parity:game`
charge le moteur **des deux repos**, rejoue 5 dates × 2 langues et compare
question par question, options comprises ; la référence est écrite dans
`core/.daily-parity.json`. La CI, elle, n'a que le site : `check:parity` vérifie
qu'il reproduit toujours cette empreinte. Si elle bouge après un resync,
la relire est la façon de voir ce que ce resync change pour les joueurs.

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

Côté R2 : autoriser `https://sapiro.app` en CORS sur `cdn.sapiro.app` — pour les
images (portraits, œuvres, animaux, monuments) **et pour `content/`**, que le
site lit en fetch. Sans ce CORS le jeu tourne, mais sur le seed bundlé
uniquement : aucune mise à jour de contenu n'arrive et l'échec est silencieux
par conception. Les drapeaux, eux, sont servis par le site.

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
