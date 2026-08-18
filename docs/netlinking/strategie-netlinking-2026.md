# Stratégie netlinking SAPIRO — août 2026 → février 2027

**Objectif** : 10 backlinks éditoriaux dofollow en 6 mois, zéro lien acheté.
**Contexte** : DR 0, 429 domaines référents dont 98 % nofollow, les 8 dofollow sont du spam.
Les pages plafonnent en position 4-8 sur des requêtes à fort volume : l'autorité est le
goulot, pas le contenu. Audit du 17/08/2026 (voir mémoire projet `seo-plafond-backlinks-dr0`).

**Arguments transversaux** (à adapter par cible, jamais en template) :
- App 100 % gratuite, **zéro pub, zéro compte, zéro donnée collectée** — profil rarissime,
  vérifiable sur [sapiro.app/privacy](https://sapiro.app/privacy).
- 2000+ questions : géographie (197 pays), histoire, art, nature.
- Site + blog complets en **FR/EN/ES** (~310 articles factuels : capitales, drapeaux,
  plus petits pays…).
- Concurrents listés partout (Trivia Crack, Duel Quiz, Kahoot, Seterra) : freemium,
  pubs agressives, ou devenus payants (Seterra sous GeoGuessr) — différenciation objective.

---

## ⚠️ Limite de vérification dofollow (à lire avant tout envoi)

La session d'analyse tournait derrière un proxy réseau qui bloque tout accès HTTP direct
aux sites externes. **Le statut dofollow n'a donc pas pu être vérifié techniquement** ;
il est indiqué ci-dessous d'après des sources SEO concordantes 2025-2026 quand elles
existent, sinon « à tester ». Chaque fiche donne une **URL de test** : avant de contacter
une cible, lancer depuis votre machine :

```bash
./docs/netlinking/check-dofollow.sh "<URL de test>" [filtre ex. "play.google"]
```

Si les liens sortants vers les apps listées portent `rel="nofollow"`/`sponsored`,
rétrograder la cible (colonne `dofollow_verifie` du CSV → `non`) et ne pas y investir
d'effort d'outreach.

## Action préalable : preuve Exodus Privacy

Avant le premier email aux cibles privacy/parentalité, générer le rapport Exodus
(gratuit, ~10 min) : <https://reports.exodus-privacy.eu.org/en/analysis/submit/> avec
l'URL Play Store (`com.sapiro.app`). Objectif : **0 tracker**. L'URL du rapport devient
la pièce jointe standard des pitchs « sans données » — c'est une preuve tierce vérifiable,
bien plus forte qu'une autodéclaration. (Domaine bloqué depuis la session d'analyse,
non vérifié : si un rapport existe déjà, le récupérer simplement.)

---

## Top 10 — premières actions (score = autorité × probabilité ÷ effort)

| # | Cible | Type | Action | Pourquoi en premier |
|---|-------|------|--------|---------------------|
| 1 | **AlternativeTo** | Annuaire | Créer la fiche via [manage/new](https://alternativeto.net/manage/new/) | DR ~85, gratuit, acceptation quasi certaine, dofollow rapporté par plusieurs sources SEO 2026. Tags « Ad-free », « No Tracking », alternative à Trivia Crack/Kahoot |
| 2 | **SaaSHub** | Annuaire | [saashub.com/submit](https://www.saashub.com/submit) | DR ~79, gratuit, dofollow rapporté, fiches reprises par l'écosystème « alternatives to X » |
| 3 | **edshelf** | Annuaire édu | [edshelf.com/add-tool](https://edshelf.com/add-tool) | Soumission ouverte gratuite, annuaire connu des profs US, collections d'enseignants = visibilité en cascade |
| 4 | **Les Clionautes** | Assoc profs HG (FR) | Email n°1 (voir `emails-outreach.md`) | Fit maximal : leur page [quiz géographie](https://college.clionautes.org/reviser-des-notions-de-geographie-avec-un-quiz.html) (maj 08/2025) liste déjà des quiz externes |
| 5 | **Spatial Post** | Listicle géo (EN) | Email n°2 | Blog mono-auteur GIS, contact direct (admin@spatialpost.com), SAPIRO absent de son « 9 Best Apps To Learn Geography » |
| 6 | **Web del Maestro CMF** | Média profs LatAm (ES) | Email n°3 | Sans but lucratif, article « mejores apps geografía 2025 » à compléter, audience LatAm massive |
| 7 | **Geek Junior** | Presse ados/CDI (FR) | Email (angle dans la fiche) | Publie des articles dédiés à des apps de quiz de petits éditeurs (Cultureo, HistoQuizz) ; redaction@geekjunior.fr |
| 8 | **Outils Tice** | Blog profs (FR) | Email court à F. Navamuel | Ligne éditoriale = exactement gratuit/sans compte/sans données ; teste vite |
| 9 | **Ayuda para maestros** | Blog prof (ES) | Email à manuvelasco@hotmail.es | Billets quotidiens de recommandation d'apps, Blogger (liens directs), 126k abonnés |
| 10 | **HT Pratique** | Listicles (FR) | Email à contact@htpratique.com | 2 pages d'un coup (appli géo + culture G), app française = affinité |

En parallèle, semaine 1-2 : **EdTech Impact** (listing de base gratuit) et **appPicker**
(inscription développeur gratuite) — formulaires sans rédaction.

---

## Liste complète par catégorie

Colonnes : **A** autorité estimée /5 · **P** probabilité /5 · **E** effort /5 (1 = facile) ·
**Score** = A×P÷E. DR = estimations de notoriété, non mesurées depuis la session.

### 1. Annuaires & reviews d'apps (EN/international)

| Cible | Soumission / contact | Dofollow | A | P | E | Score | Angle spécifique |
|---|---|---|---|---|---|---|---|
| AlternativeTo | [manage/new](https://alternativeto.net/manage/new/) (compte gratuit) | Rapporté dofollow (sources SEO ; test : fiche Seterra `/software/seterra/about/`) | 5 | 5 | 1 | 25 | Alternative à Trivia Crack/QuizUp/Kahoot ; tags Ad-free, No Tracking, No registration |
| SaaSHub | [saashub.com/submit](https://www.saashub.com/submit) | Rapporté dofollow (test : `/kahoot-alternatives`) | 4 | 5 | 1 | 20 | Fiche « Sapiro — alternatives & reviews », requêtes « Trivia Crack alternative without ads » |
| edshelf | [edshelf.com/add-tool](https://edshelf.com/add-tool) | À tester (fiche `/tool/kahoot/`) | 3 | 5 | 1 | 15 | Catégories trivia/social studies/geography ; filtre pricing = free |
| appPicker | [Inscription dev](https://www.apppicker.com/users/registerdev) | À tester (une review récente) | 3 | 4 | 2 | 6 | App indé iOS premium sans pub — leur cible éditoriale exacte |
| EdTech Impact | [list-your-product](https://edtechimpact.com/list-your-product/) — rester sur le tier gratuit | À tester (fiche produit, lien « Visit website ») | 3 | 4 | 2 | 6 | Conformité vie privée = critère de leur grille (écoles UK, safeguarding) |
| Educational App Store | [developer/contact-us](https://www.educationalappstore.com/developer/contact-us) — **clarifier d'abord si une fiche gratuite existe** (la « certification » est un programme commercial) | À tester | 4 | 3 | 2 | 6 | Grille privacy + programmes scolaires ; aussi leur listicle « Best Geography Apps » où SAPIRO manque |
| Educators Technology | [Contact](https://www.educatorstechnology.com/contact) — éditorial only, **refuser le sponsored** | À tester | 4 | 2 | 2 | 4 | Mise à jour de ses roundups « best geography/trivia apps for students » |
| Teachers With Apps | jayne@teacherswithapps.com (conditions à confirmer) | À tester | 2 | 3 | 2 | 3 | Test en classe K-8, accès + one-pager pédagogique |
| Common Sense Media | Pas de canal dev — suggestion via contact général | Fiches pointent vers les stores, lien site improbable | 5 | 1 | 3 | 1.7 | Long shot. Valeur = badge de crédibilité, pas backlink. « Genuinely free » coche toute leur grille |

Écartés : **AppAdvice** (fermé 01/2026), **Product Hunt** (nofollow confirmé),
**Common Sense Education** (reviews suspendues 02/2026), **Class Tech Tips** (modèle sponsorisé).

### 2. Presse edtech & profs FR

| Cible | Contact | Dofollow | A | P | E | Score | Angle spécifique |
|---|---|---|---|---|---|---|---|
| Les Clionautes | [Formulaire](https://www.clionautes.org/contactez-vous) | À tester (page [quiz géo Clio Collège](https://college.clionautes.org/reviser-des-notions-de-geographie-avec-un-quiz.html)) | 3 | 5 | 2 | 7.5 | Ajout à leur page de quiz de révision géo existante ; 197 pays vérifiés, zéro compte élève = zéro souci RGPD |
| Outils Tice | Formulaire outilstice.com / Substack (Fidel Navamuel) | À tester (test d'outil récent) | 3.5 | 4 | 1 | 14 | Mail court : « gratuit, sans compte, testable en 2 min » — pile sa ligne. Exclure toute offre payante |
| Geek Junior | redaction@geekjunior.fr · [contact](https://www.geekjunior.fr/geek-junior-contact-et-informations/) | À tester (article [Cultureo](https://www.geekjunior.fr/cultureo-application-art-histoire-33989/)) | 3 | 4 | 1 | 12 | Article dédié type Cultureo/HistoQuizz ; angle ados + CDI, pas de compte = fort pour un média jeunesse |
| Café pédagogique | redaction@cafepedagogique.net · [Publier dans le Café](https://www.cafepedagogique.net/publier-dans-le-cafe/) | À tester | 4.5 | 3 | 2 | 6.75 | Brève « ressource révision » (pas un article promo) ; protection des données élèves |
| Ludomag | redaction@ludomag.com · [contacter la rédaction](https://www.ludomag.com/contacter-la-redaction/) | À tester | 3 | 4 | 2 | 6 | CP éditorialisé : le modèle « gratuit ET sans pub ET sans données » comme sujet en soi |
| École branchée | info@ecolebranchee.com · [Soumettez un article](https://ecolebranchee.com/a-propos/soumettez-un-article/) | À tester ([Édubrèves](https://ecolebranchee.com/les-edubreves-edition-du-17-juin-2025/)) | 3 | 4 | 2 | 6 | Édubrèves ; angle Québec : loi 25, app FR/EN/ES pour classes multilingues |
| Thot Cursus | Formulaire cursus.edu (éviter la page annonceurs, payante) | À tester | 4 | 3 | 2 | 6 | Répertoire « solutions libres et gratuites » ; FLE/formation adultes FR-EN-ES |
| Educavox | [Devenez rédacteurs](https://www.educavox.fr/devenez-redacteurs) (gratuit, comité éditorial) | À tester | 3 | 5 | 3 | 5 | Contribution signée non promotionnelle (« réviser les repères géographiques avec des outils gratuits ») où SAPIRO est cité parmi les ressources |
| Géoconfluences (ENS Lyon) | [Contact](http://geoconfluences.ens-lyon.fr/a-propos/contact) (J.-B. Bouron) | À tester (brèves d'actualités) | 5 | 2 | 3 | 3.3 | Gros lot (ens-lyon.fr). Pitcher la **rigueur des données**, pas l'app : signalement en brève « ressource gratuite repères géographiques » |
| Tice Education | [Contact](https://www.tice-education.fr/nous-ecrire/contact) | À tester — vigilance, le site vend du publi-rédactionnel | 2.5 | 2 | 1 | 5 | Signalement de ressource gratuite uniquement ; décliner tout renvoi vers l'offre payante |

Écartés/veille : **DeclicKids** (dormant depuis ~2017), **Doc pour docs** (irrégulier, 2e vague).

### 3. Sites profs & edtech ES

| Cible | Contact | Dofollow | A | P | E | Score | Angle spécifique |
|---|---|---|---|---|---|---|---|
| Ayuda para maestros | manuvelasco@hotmail.es | À tester (Blogger, signal favorable — billets du label Apps educativas) | 3 | 4 | 1 | 12 | Billet court « repaso de geografía y cultura general » ; app + blog ES natifs |
| Web del Maestro CMF | admin@webdelmaestrocmf.com | À tester (article [mejores apps geografía 2025](https://webdelmaestrocmf.com/portal/las-mejores-apps-para-aprender-geografia/)) | 3 | 4 | 1 | 12 | Ajout à leur article géo 2025 (liste déjà StudyGe, Seterra) ; gratuit sans pub = clé en LatAm |
| Profe Recursos | contacto@proferecursos.com | À tester (risque nofollow, cofondateur marketing) | 2 | 3.5 | 1 | 7 | Complément numérique gratuit aux fiches Primaria (banderas, capitales) |
| Orientación Andújar | [Contacto](https://www.orientacionandujar.es/contacto/) (« sugerencias » explicites) | À tester | 3.5 | 3.5 | 2 | 6.1 | Gamification/repaso Ciencias Sociales ; sans pub = critère qu'ils citent pour les familles |
| Educación 3.0 | [Contacto](https://www.educaciontrespuntocero.com/contacto/) | À tester (article « apps tipo Trivial ») | 4.5 | 2.5 | 2 | 5.6 | Màj de leurs listes « apps tipo Trivial » / « apps para aprender geografía » ; version ES native complète, rare |
| Educapeques | [Participa](https://www.educapeques.com/informacion/participa) | À tester avant pitch (risque nofollow sur contributions) | 3 | 4 | 3 | 4 | Article invité « juegos de preguntas para aprender geografía en familia » |
| aulaPlaneta | Formulaire corporate | À tester | 4 | 1.5 | 2 | 3 | Second rideau. « Recursos TIC para gamificar el repaso » — complément, pas concurrent |

Écartés : Tiching (blog à l'arrêt), Eduteka (institutionnel fermé), Mundo Primaria (commercial), Yo Profesor (activité douteuse).

### 4. Parentalité & privacy

| Cible | Contact | Dofollow | A | P | E | Score | Angle spécifique |
|---|---|---|---|---|---|---|---|
| gHacks | [ghacks.net/contact](https://www.ghacks.net/contact/) | À tester | 4 | 3 | 2 | 6 | Ils ont eux-mêmes retiré toute pub (02/2026) : angle « une app quiz vraiment gratuite, sans pub ni tracker » + rapport Exodus en accroche (lectorat qui connaît) |
| Children & Media Australia | [Contact](https://childrenandmedia.org.au/accm/contact-us) — suggestions d'apps explicitement invitées | À tester ; **lien direct incertain** (fiches → stores) | 4 | 3 | 2 | 6 | Leur grille évalue la collecte de données : SAPIRO coche tout. Valeur aussi en citation d'autorité |
| App-enfant.fr | [Formulaire](https://app-enfant.fr/contactez-nous/) — vérifier l'activité récente d'abord | À tester (fiche `/application/`) | 3 | 3 | 2 | 4.5 | Catégories 10 ans et + ; quiz parent-enfant, conforme à leurs critères sécurité |
| La Souris Grise | [Contact](https://souris-grise.fr/contact/) | À tester | 3 | 3 | 2 | 4.5 | Cible 8-12 ans : volet géographie/nature ; sécurité + qualité éditoriale |
| Mothers Always Right | molly@mothersalwaysright.com | À tester ; **risque de demande payante** → exclure si payant | 3 | 2 | 2 | 3 | Ajout à son listicle « [No Ads, No Upsells](https://www.mothersalwaysright.com/10-best-free-apps-for-kids-that-parents-actually-trust-no-ads-no-upsells/) » — critères mot pour mot |

Écartés : **Good Play Guide** (soumission payante confirmée), Smart Apps for Kids (inactif),
PrivacyTools/awesome-privacy (pas de catégorie quiz, GitHub nofollow).

### 5. Listicles « meilleures apps » où SAPIRO manque

SAPIRO n'apparaît aujourd'hui sur **aucune** page tierce (vérifié par recherche) — toutes vierges.

| Page | Langue | Contact | Dofollow | A | P | E | Score | Angle |
|---|---|---|---|---|---|---|---|---|
| [Spatial Post — 9 Best Apps To Learn Geography](https://www.spatialpost.com/apps-to-learn-geography/) | EN | admin@spatialpost.com | À tester | 2.5 | 4 | 1 | 10 | Profil GIS → angle « données 197 pays vérifiées » |
| [HT Pratique — applis géographie](https://htpratique.com/applications-geographie/) + [culture générale](https://htpratique.com/applications-culture-generale/) | FR | contact@htpratique.com | À tester | 2.5 | 4 | 1 | 10 | 1 email, 2 insertions ; app française ; vs Duel Quiz/QuizUp pleins de pubs |
| [EarthGuessr — Best Geography Apps 2026](https://www.earthguessr.com/blog/best-geography-apps-iphone-android-2026) | EN | Page contact du site | À tester | 2 | 4 | 1 | 8 | Complète leur liste (quiz structuré multi-thèmes) sans concurrencer leur jeu d'exploration |
| [Le Tout Pile — top 7 quiz 2026](https://letoutpile.com/articles/appli-culture-generale/) (maj 07/2026) | FR | letoutpile@gmail.com | À tester | 2 | 3 | 1 | 6 | « Seule app du classement gratuite ET sans pub ET sans données » ; se positionner en complément (solo) de leur jeu apéro |
| [Watercooler Trivia — Best Quizzing Apps](https://www.watercoolertrivia.com/blog/best-quizzing-apps) | EN | Formulaire site | À tester | 3 | 3 | 2 | 4.5 | Case manquante « solo, long terme, sans compte » vs Kahoot (animateur requis) |
| [digiSchool — top 10 applis culture G](https://www.digischool.fr/articles/culture-generale/top-10-des-applis-pour-booster-sa-culture-generale/) | FR | Formulaire partenariats | À tester | 4.5 | 2 | 2 | 4.5 | Grosse autorité, proba faible : zéro friction (pas d'inscription) pour lycéens/concours |
| [Coformación](https://coformacion.com/estas-son-las-7-mejores-aplicaciones-para-aprender-geografia/) + [Enséñame de Ciencia](https://ensedeciencia.com/2024/04/17/las-7-mejores-apps-gratuitas-para-aprender-geografia-que-no-puedes-dejar-pasar/) | ES | Pages contact | À tester | 2.5 | 3 | 2 | 3.75 | Localisation ES native vs apps mal traduites ; Seterra devenu payant (argument daté vérifiable) |

Réserve : rigorousthemes.com, mobilemarketingreads.com, smashingapps.com, fredzone.org, androidayuda.com.

### 6. Communautés (nofollow — valeur : visibilité, installs, AI Overviews, liens indirects)

Les liens Reddit/forums sont nofollow : ces actions ne comptent **pas** dans l'objectif
des 10 dofollow, mais alimentent la découverte par des blogueurs qui, eux, lieront.

| Communauté | Règles | Approche |
|---|---|---|
| [Show HN](https://news.ycombinator.com/showhn.html) | Produit testable, compte perso, pas de boost de votes | « Show HN: Sapiro – general-knowledge quiz app, no ads, no data collection » — angle privacy + données vérifiées, être présent pour répondre |
| r/geography (~1,5 M) | Autopromo sèche mal vue — vérifier la sidebar | Partager du contenu (anecdote issue des données 197 pays), mentionner l'app en commentaire si demandée |
| r/geographygames, r/geoguessr | Petit mais dédié / vérifier règle jeux tiers | Post honnête « I built… », divulguer être le dev |
| r/AndroidApps, r/iosapps, r/SideProject | Flairs/jours dev — vérifier sidebar | Divulguer systématiquement ; les threads « best free quiz app » sont repris par les réponses IA |
| Neoprofs | Charte : ressource pédagogique tolérée, pub intrusive supprimée | Transparence totale, sections ressources HG ; valeur = adoption par des profs qui listent ensuite l'app sur leurs blogs (souvent dofollow) |

---

## Séquencement sur 6 mois

- **Semaines 1-2** — Annuaires sans rédaction : AlternativeTo, SaaSHub, edshelf, EdTech
  Impact, appPicker. Générer le rapport Exodus. Lancer les tests dofollow
  (`check-dofollow.sh`) sur les 15 URLs de test prioritaires.
- **Semaines 3-6** — Vague outreach n°1 (emails 1-3 : Clionautes, Spatial Post, Web del
  Maestro CMF) puis Geek Junior, Outils Tice, Ayuda para maestros, HT Pratique,
  EarthGuessr, Le Tout Pile. Relance unique à J+10.
- **Mois 2-3** — Vague n°2 : Ludomag, École branchée, Café pédagogique, Orientación
  Andújar, Educación 3.0, gHacks, CMA, Watercooler Trivia. Contribution Educavox
  (article de fond signé). Show HN quand la fiche AlternativeTo et le rapport Exodus
  sont en ligne (le post les cite).
- **Mois 4-5** — Dossier soigné Géoconfluences (rigueur données). Thot Cursus,
  Educapeques (article invité), digiSchool. Communautés Reddit au fil de l'eau.
- **Mois 6** — Bilan Ahrefs/GSC : liens obtenus, positions sur les requêtes plafond
  (« smallest country in the world »…), 2e passe sur les cibles restées muettes avec un
  angle différent, jamais le même message.

**Règles de conduite** : jamais deux emails identiques ; une seule relance par cible ;
refuser systématiquement toute proposition payante (sponsored, certification, publi-
rédactionnel) ; ne jamais proposer d'échange de liens ; noter chaque interaction dans
`suivi-netlinking.csv`.
