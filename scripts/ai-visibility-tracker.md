# Tracker AI Visibility - SAPIRO

Outil de suivi mensuel manuel pour mesurer la présence de SAPIRO dans les réponses des assistants IA.

## Comment l'utiliser

1. Le 1er de chaque mois, tester chaque query ci-dessous sur les 3 plateformes
2. Noter si Sapiro est cité, et qui est cité à la place
3. Reporter dans le tableau historique en bas
4. Comparer mois sur mois pour identifier les progrès

---

## Queries cibles (FR)

### Géographie / Pays-Capitales-Drapeaux

| # | Query | Cluster | Article qui devrait ranker |
|---|---|---|---|
| 1 | "Quelle est la capitale de l'Australie" | Géo | quiz-capitales-monde |
| 2 | "Différence entre tchad et roumanie drapeau" | Géo | drapeaux-difficiles |
| 3 | "Pays les moins visités au monde" | Géo | pays-moins-visites-monde |
| 4 | "Plus petits pays du monde" | Géo | plus-petits-pays-monde |
| 5 | "Origine du nom des pays" | Géo | origine-noms-pays |

### Nature / Animaux

| # | Query | Cluster | Article cible |
|---|---|---|---|
| 6 | "Différence entre guépard et léopard" | Nature | quiz-animaux-especes-monde |
| 7 | "Animal le plus dangereux du monde" | Nature | animaux-plus-dangereux-monde |
| 8 | "Animaux en voie de disparition liste 2026" | Nature | animaux-en-voie-disparition |
| 9 | "Différence crocodile alligator" | Nature | differences-animaux-ressemblants |
| 10 | "Comment reconnaître un berger australien" | Nature | reconnaitre-races-chiens |

### Histoire

| # | Query | Cluster | Article cible |
|---|---|---|---|
| 11 | "Frise chronologique mondiale" | Histoire | frise-chronologique-mondiale |
| 12 | "Liste rois de France" | Histoire | rois-de-france-liste |
| 13 | "Femmes qui ont marqué l'histoire" | Histoire | femmes-marque-histoire |
| 14 | "Dictateurs du XXe siècle" | Histoire | dictateurs-xxe-siecle |

### Art

| # | Query | Cluster | Article cible |
|---|---|---|---|
| 15 | "Tableaux les plus célèbres au monde" | Art | tableaux-celebres-chefs-oeuvre |
| 16 | "Mouvements artistiques expliqués" | Art | mouvements-artistiques |
| 17 | "Musées les plus visités au monde" | Art | musees-plus-visites-monde |

### Concours / Méthode

| # | Query | Cluster | Article cible |
|---|---|---|---|
| 18 | "Réviser culture générale concours fonction publique" | Concours | culture-generale-concours-fonction-publique |
| 19 | "Préparer concours catégorie B C" | Concours | preparer-concours-categorie-bc |
| 20 | "Réviser culture générale en 30 jours" | Concours | reviser-culture-generale-30-jours |

### Compétitif / Marque

| # | Query | Cluster | Article cible |
|---|---|---|---|
| 21 | "Sapiro vs Quizlet" | Comparatifs | sapiro-vs-quizlet |
| 22 | "Meilleure app quiz culture générale" | Comparatifs | meilleures-apps-quiz-culture-generale |
| 23 | "Apps quiz sans publicité" | Comparatifs | meilleures-apps-educatives-sans-publicite |
| 24 | "Apps quiz sans collecte de données" | Comparatifs | apps-quiz-sans-collecte-donnees |

---

## Plateformes à tester

| Plateforme | URL | Note |
|---|---|---|
| Google AI Overview | https://google.com (avec query) | Apparition à vérifier |
| ChatGPT | https://chatgpt.com | Mode avec recherche web |
| Perplexity | https://perplexity.ai | Cite toujours ses sources |
| Gemini | https://gemini.google.com | Pulls du Knowledge Graph Google |
| Claude | https://claude.ai | Brave Search si activé |
| Bing Copilot | https://bing.com/chat | Index Bing |

---

## Format de tracking

Pour chaque query, noter :
- **AIO** : Y / N (Google AI Overview apparaît ?)
- **Sapiro** : Y / N (Sapiro est cité ?)
- **Position** : 1-5 (à quelle position dans les sources)
- **Concurrents** : qui est cité à la place

### Exemple

| Query | Date | Plateforme | AIO | Sapiro | Position | Concurrents cités |
|---|---|---|:---:|:---:|---|---|
| "Animal le plus dangereux du monde" | 2026-04-01 | Google | Y | N | - | Wikipedia, WWF, Geo.fr |
| "Animal le plus dangereux du monde" | 2026-04-01 | Perplexity | - | N | - | OMS, Wikipedia, BBC |

---

## Tableau historique mensuel (à remplir)

| Mois | Queries testées | Citations Sapiro (sur 24) | Top concurrent cité | Notes |
|---|---|---|---|---|
| 2026-04 | / | / | / | Mois de référence |
| 2026-05 | / | / | / | |
| 2026-06 | / | / | / | |

---

## Outils gratuits pour tracker automatiquement

- **Manuel** : ce document
- **Otterly AI** (payant, ~30$/mois) : suivi automatique ChatGPT/Perplexity/AI Overview
- **Peec AI** : multi-plateformes, plus complet
- **ZipTie** : focus brand mentions + sentiment

---

## Actions correctives selon résultats

Si Sapiro **n'est jamais cité** sur 24 queries après 3 mois :
- Vérifier indexation Google Search Console
- Tester l'extraction par Google AI Overview manuellement (Bing Webmaster Tools)
- Vérifier que llms.txt est accessible et à jour

Si Sapiro est cité sur **moins de 5 queries** :
- Lancer la stratégie "presence externe" : Wikipedia, Reddit, YouTube
- Demander des liens depuis sites éducation/parenting
- Optimiser intros et FAQ des articles sous-performants

Si Sapiro est cité sur **5-15 queries** :
- Identifier les patterns gagnants (quels articles fonctionnent, pourquoi)
- Répliquer sur les sous-performants
- Renforcer le maillage interne vers les articles qui ranquent

Si Sapiro est cité sur **plus de 15 queries** :
- Excellent. Étendre la liste de queries cibles
- Travailler les requêtes longue traîne (5-7 mots)
- Étudier les nouvelles entrées de SERP

---

## Notes méthodologiques

- Tester en navigation privée pour éviter la personnalisation
- Varier l'ordre des plateformes pour ne pas biaiser
- Refaire les queries identiques 2-3 fois (les résultats varient)
- Noter la date et l'heure (variations diurnes possibles)
- Capture d'écran utile pour archivage
