// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import type { MonumentInput } from "@/types";

export const europeMonuments: MonumentInput[] = [
  // ── France ──────────────────────────────────────────────────────────────────
  { id: "tour-eiffel", name: "Tour Eiffel", country: "France", city: "Paris", continent: "europe", category: "tower", subCategory: "observation_tower", year: "1887-1889", architect: "Gustave Eiffel", unesco: true },
  { id: "notre-dame-paris", name: "Cathédrale Notre-Dame de Paris", country: "France", city: "Paris", continent: "europe", category: "religious", subCategory: "cathedral", year: "1163-1345", unesco: true },
  { id: "chateau-versailles", name: "Château de Versailles", country: "France", city: "Versailles", continent: "europe", category: "palace", subCategory: "palace", year: "1661-1710", architect: "Jules Hardouin-Mansart", unesco: true },
  { id: "louvre", name: "Musée du Louvre", country: "France", city: "Paris", continent: "europe", category: "civil", subCategory: "museum", year: 1793, architect: "Pierre Lescot" },
  { id: "arc-de-triomphe", name: "Arc de Triomphe", country: "France", city: "Paris", continent: "europe", category: "monument", subCategory: "arch", year: "1806-1836", architect: "Jean Chalgrin" },
  { id: "mont-saint-michel", name: "Mont-Saint-Michel", country: "France", city: "Mont-Saint-Michel", continent: "europe", category: "religious", subCategory: "monastery", year: "VIIIe siècle", unesco: true },
  { id: "sacre-coeur", name: "Basilique du Sacré-Cœur", country: "France", city: "Paris", continent: "europe", category: "religious", subCategory: "basilica", year: "1875-1914", architect: "Paul Abadie" },
  { id: "pont-du-gard", name: "Pont du Gard", country: "France", city: "Nîmes", continent: "europe", category: "ancient", subCategory: "aqueduct", year: "Ier siècle", unesco: true },
  { id: "palais-des-papes", name: "Palais des Papes", country: "France", city: "Avignon", continent: "europe", category: "palace", subCategory: "palace", year: "1335-1364", unesco: true },
  { id: "cite-de-carcassonne", name: "Cité de Carcassonne", country: "France", city: "Carcassonne", continent: "europe", category: "fortification", subCategory: "city_wall", year: "XIIe siècle", unesco: true },
  { id: "chateau-chantilly", name: "Château de Chantilly", country: "France", city: "Chantilly", continent: "europe", category: "palace", subCategory: "castle", year: "XVIe siècle" },
  { id: "opera-garnier", name: "Opéra Garnier", country: "France", city: "Paris", continent: "europe", category: "civil", subCategory: "opera", year: "1861-1875", architect: "Charles Garnier" },

  // ── Italie ──────────────────────────────────────────────────────────────────
  { id: "colisee", name: "Colisée", country: "Italie", city: "Rome", continent: "europe", category: "ancient", subCategory: "amphitheatre", year: "70-80", unesco: true },
  { id: "saint-pierre-rome", name: "Basilique Saint-Pierre", country: "Italie", city: "Vatican", continent: "europe", category: "religious", subCategory: "basilica", year: "1506-1626", architect: "Michelangelo" },
  { id: "pantheon-rome", name: "Panthéon de Rome", country: "Italie", city: "Rome", continent: "europe", category: "ancient", subCategory: "ancient_temple", year: "118-125", unesco: true },
  { id: "tour-de-pise", name: "Tour de Pise", country: "Italie", city: "Pise", continent: "europe", category: "tower", subCategory: "bell_tower", year: "1173-1372", architect: "Bonanno Pisano", unesco: true },
  { id: "palais-des-doges", name: "Palais des Doges", country: "Italie", city: "Venise", continent: "europe", category: "palace", subCategory: "palace", year: "XIVe siècle", unesco: true },
  { id: "duomo-florence", name: "Dôme de Florence", country: "Italie", city: "Florence", continent: "europe", category: "religious", subCategory: "cathedral", year: "1296-1436", architect: "Filippo Brunelleschi", unesco: true },
  { id: "chateau-saint-ange", name: "Château Saint-Ange", country: "Italie", city: "Rome", continent: "europe", category: "fortification", subCategory: "fortress", year: "123-139", unesco: true },
  { id: "forum-romain", name: "Forum Romain", country: "Italie", city: "Rome", continent: "europe", category: "ancient", subCategory: "archaeological_site", year: "VIe siècle av. J.-C.", unesco: true },
  { id: "trevi", name: "Fontaine de Trevi", country: "Italie", city: "Rome", continent: "europe", category: "monument", subCategory: "fountain", year: "1732-1762", architect: "Nicola Salvi" },
  { id: "milan-duomo", name: "Cathédrale de Milan", country: "Italie", city: "Milan", continent: "europe", category: "religious", subCategory: "cathedral", year: "1386-1965" },
  { id: "pompei", name: "Pompéi", country: "Italie", city: "Pompéi", continent: "europe", category: "ancient", subCategory: "archaeological_site", year: "VIIe siècle av. J.-C.", unesco: true },
  { id: "pont-du-rialto", name: "Pont du Rialto", country: "Italie", city: "Venise", continent: "europe", category: "civil", subCategory: "bridge", year: "1588-1591", architect: "Antonio da Ponte", unesco: true },
  { id: "basilique-saint-marc", name: "Basilique Saint-Marc", country: "Italie", city: "Venise", continent: "europe", category: "religious", subCategory: "basilica", year: "1063-1617", unesco: true },
  { id: "scala-milan", name: "La Scala", country: "Italie", city: "Milan", continent: "europe", category: "civil", subCategory: "opera", year: "1776-1778", architect: "Giuseppe Piermarini" },
  { id: "arc-constantin", name: "Arc de Constantin", country: "Italie", city: "Rome", continent: "europe", category: "monument", subCategory: "arch", year: 315 },

  // ── Royaume-Uni ─────────────────────────────────────────────────────────────
  { id: "big-ben", name: "Big Ben", country: "Royaume-Uni", city: "Londres", continent: "europe", category: "tower", subCategory: "clock_tower", year: "1844-1859", architect: "Charles Barry" },
  { id: "tower-bridge", name: "Tower Bridge", country: "Royaume-Uni", city: "Londres", continent: "europe", category: "civil", subCategory: "bridge", year: "1886-1894", architect: "Horace Jones" },
  { id: "stonehenge", name: "Stonehenge", country: "Royaume-Uni", city: "Salisbury", continent: "europe", category: "ancient", subCategory: "megalith", year: "-3000", unesco: true },
  { id: "buckingham-palace", name: "Palais de Buckingham", country: "Royaume-Uni", city: "Londres", continent: "europe", category: "palace", subCategory: "palace", year: "1703-1705" },
  { id: "tour-de-londres", name: "Tour de Londres", country: "Royaume-Uni", city: "Londres", continent: "europe", category: "fortification", subCategory: "fortress", year: "1078-1285", unesco: true },
  { id: "westminster-abbaye", name: "Abbaye de Westminster", country: "Royaume-Uni", city: "Londres", continent: "europe", category: "religious", subCategory: "monastery", year: "960-1517", architect: "Henry de Reyns", unesco: true },
  { id: "windsor-castle", name: "Château de Windsor", country: "Royaume-Uni", city: "Windsor", continent: "europe", category: "palace", subCategory: "castle", year: "1070-1086" },
  { id: "edinburgh-castle", name: "Château d'Édimbourg", country: "Royaume-Uni", city: "Édimbourg", continent: "europe", category: "fortification", subCategory: "fortress", year: "XIIe siècle", unesco: true },
  { id: "oxford-bodleian", name: "Bibliothèque Bodléienne", country: "Royaume-Uni", city: "Oxford", continent: "europe", category: "civil", subCategory: "library", year: "1602" },
  { id: "st-pauls-cathedral", name: "Cathédrale Saint-Paul", country: "Royaume-Uni", city: "Londres", continent: "europe", category: "religious", subCategory: "cathedral", year: "1675-1710", architect: "Christopher Wren" },

  // ── Espagne ──────────────────────────────────────────────────────────────────
  { id: "sagrada-familia", name: "Sagrada Família", country: "Espagne", city: "Barcelone", continent: "europe", category: "religious", subCategory: "cathedral", year: "1882-", architect: "Antoni Gaudí", unesco: true },
  { id: "alhambra", name: "Alhambra", country: "Espagne", city: "Grenade", continent: "europe", category: "palace", subCategory: "palace", year: "1238-1358", unesco: true },
  { id: "palais-royal-madrid", name: "Palais Royal de Madrid", country: "Espagne", city: "Madrid", continent: "europe", category: "palace", subCategory: "palace", year: "1738-1764", architect: "Filippo Juvara" },
  { id: "cathedrale-seville", name: "Cathédrale de Séville", country: "Espagne", city: "Séville", continent: "europe", category: "religious", subCategory: "cathedral", year: "1402-1507", unesco: true },
  { id: "parc-guell", name: "Parc Güell", country: "Espagne", city: "Barcelone", continent: "europe", category: "monument", subCategory: "memorial", year: "1900-1914", architect: "Antoni Gaudí", unesco: true },
  { id: "alcazar-seville", name: "Alcázar de Séville", country: "Espagne", city: "Séville", continent: "europe", category: "palace", subCategory: "palace", year: "XIe siècle", unesco: true },
  { id: "plaza-espana-seville", name: "Plaza de España", country: "Espagne", city: "Séville", continent: "europe", category: "civil", subCategory: "town_hall", year: "1929", architect: "Aníbal González" },
  { id: "burgos-cathedrale", name: "Cathédrale de Burgos", country: "Espagne", city: "Burgos", continent: "europe", category: "religious", subCategory: "cathedral", year: "1221-1567", unesco: true },

  // ── Grèce ───────────────────────────────────────────────────────────────────
  { id: "acropole-athenes", name: "Acropole d'Athènes", country: "Grèce", city: "Athènes", continent: "europe", category: "ancient", subCategory: "archaeological_site", year: "-447", unesco: true },
  { id: "parthenon", name: "Parthénon", country: "Grèce", city: "Athènes", continent: "europe", category: "ancient", subCategory: "ancient_temple", year: "-447 à -432", architect: "Ictinos et Callicratès", unesco: true },
  { id: "temple-zeus-olympia", name: "Temple de Zeus (Olympie)", country: "Grèce", city: "Olympie", continent: "europe", category: "ancient", subCategory: "ancient_temple", year: "-470 à -456", unesco: true },
  { id: "palais-cnossos", name: "Palais de Cnossos", country: "Grèce", city: "Héraklion", continent: "europe", category: "ancient", subCategory: "archaeological_site", year: "-1900 à -1400" },
  { id: "meteores", name: "Météores", country: "Grèce", city: "Kalambaka", continent: "europe", category: "religious", subCategory: "monastery", year: "XIVe siècle", unesco: true },
  { id: "epidaure", name: "Théâtre d'Épidaure", country: "Grèce", city: "Épidaure", continent: "europe", category: "ancient", subCategory: "amphitheatre", year: "-340", architect: "Polyclète le Jeune", unesco: true },

  // ── Allemagne ───────────────────────────────────────────────────────────────
  { id: "chateau-neuschwanstein", name: "Château de Neuschwanstein", country: "Allemagne", city: "Füssen", continent: "europe", category: "palace", subCategory: "castle", year: "1869-1886", architect: "Eduard Riedel" },
  { id: "porte-de-brandebourg", name: "Porte de Brandebourg", country: "Allemagne", city: "Berlin", continent: "europe", category: "monument", subCategory: "arch", year: "1788-1791", architect: "Carl Gotthard Langhans" },
  { id: "cathedrale-cologne", name: "Cathédrale de Cologne", country: "Allemagne", city: "Cologne", continent: "europe", category: "religious", subCategory: "cathedral", year: "1248-1880", unesco: true },
  { id: "chateau-heidelberg", name: "Château de Heidelberg", country: "Allemagne", city: "Heidelberg", continent: "europe", category: "palace", subCategory: "castle", year: "XIIIe siècle" },
  { id: "memorial-holocaust-berlin", name: "Mémorial de l'Holocauste", country: "Allemagne", city: "Berlin", continent: "europe", category: "monument", subCategory: "memorial", year: 2005, architect: "Peter Eisenman" },
  { id: "palais-sans-souci", name: "Palais de Sans-Souci", country: "Allemagne", city: "Potsdam", continent: "europe", category: "palace", subCategory: "palace", year: "1745-1747", architect: "Georg Wenzeslaus von Knobelsdorff", unesco: true },
  { id: "pont-regensburg", name: "Pont de Pierre de Ratisbonne", country: "Allemagne", city: "Ratisbonne", continent: "europe", category: "civil", subCategory: "bridge", year: "1135-1146", unesco: true },

  // ── Autriche ────────────────────────────────────────────────────────────────
  { id: "stephansdom-vienne", name: "Cathédrale Saint-Étienne de Vienne", country: "Autriche", city: "Vienne", continent: "europe", category: "religious", subCategory: "cathedral", year: "1137-1579", unesco: true },
  { id: "schonbrunn", name: "Château de Schönbrunn", country: "Autriche", city: "Vienne", continent: "europe", category: "palace", subCategory: "palace", year: "1696-1749", architect: "Johann Bernhard Fischer von Erlach", unesco: true },
  { id: "belvedere-vienne", name: "Palais du Belvédère", country: "Autriche", city: "Vienne", continent: "europe", category: "palace", subCategory: "palace", year: "1714-1723", architect: "Johann Lukas von Hildebrandt", unesco: true },
  { id: "hofburg-vienne", name: "Palais de la Hofburg", country: "Autriche", city: "Vienne", continent: "europe", category: "palace", subCategory: "palace", year: "XIIIe siècle", unesco: true },

  // ── Portugal ─────────────────────────────────────────────────────────────────
  { id: "tour-belem", name: "Tour de Belém", country: "Portugal", city: "Lisbonne", continent: "europe", category: "fortification", subCategory: "fortress", year: "1516-1521", architect: "Francisco de Arruda", unesco: true },
  { id: "mosteiro-jeronimos", name: "Monastère des Hiéronymites", country: "Portugal", city: "Lisbonne", continent: "europe", category: "religious", subCategory: "monastery", year: "1501-1601", architect: "Diogo de Boitaca", unesco: true },
  { id: "palais-pena", name: "Palais de Pena", country: "Portugal", city: "Sintra", continent: "europe", category: "palace", subCategory: "palace", year: "1842-1854", architect: "Baron von Eschwege", unesco: true },
  { id: "cathedrale-porto", name: "Cathédrale de Porto", country: "Portugal", city: "Porto", continent: "europe", category: "religious", subCategory: "cathedral", year: "XIIe siècle", unesco: true },

  // ── Pays-Bas ─────────────────────────────────────────────────────────────────
  { id: "rijksmuseum-amsterdam", name: "Rijksmuseum", country: "Pays-Bas", city: "Amsterdam", continent: "europe", category: "civil", subCategory: "museum", year: "1885", architect: "Pierre Cuypers" },
  { id: "moulin-kinderdijk", name: "Moulins de Kinderdijk", country: "Pays-Bas", city: "Kinderdijk", continent: "europe", category: "civil", subCategory: "station", year: "XVIIIe siècle", unesco: true },
  { id: "palais-royal-amsterdam", name: "Palais Royal d'Amsterdam", country: "Pays-Bas", city: "Amsterdam", continent: "europe", category: "palace", subCategory: "palace", year: "1648-1665", architect: "Jacob van Campen" },

  // ── Belgique ──────────────────────────────────────────────────────────────────
  { id: "grand-place-bruxelles", name: "Grand-Place de Bruxelles", country: "Belgique", city: "Bruxelles", continent: "europe", category: "civil", subCategory: "town_hall", year: "XVIIe siècle", unesco: true },
  { id: "beffroi-bruges", name: "Beffroi de Bruges", country: "Belgique", city: "Bruges", continent: "europe", category: "tower", subCategory: "bell_tower", year: "1240-1482", unesco: true },
  { id: "cathedrale-anvers", name: "Cathédrale Notre-Dame d'Anvers", country: "Belgique", city: "Anvers", continent: "europe", category: "religious", subCategory: "cathedral", year: "1352-1521", unesco: true },
  { id: "atomium", name: "Atomium", country: "Belgique", city: "Bruxelles", continent: "europe", category: "tower", subCategory: "observation_tower", year: 1958, architect: "André Waterkeyn" },

  // ── Suisse ────────────────────────────────────────────────────────────────────
  { id: "chateau-chillon", name: "Château de Chillon", country: "Suisse", city: "Montreux", continent: "europe", category: "palace", subCategory: "castle", year: "XIe siècle" },
  { id: "cathedrale-berne", name: "Cathédrale de Berne", country: "Suisse", city: "Berne", continent: "europe", category: "religious", subCategory: "cathedral", year: "1421-1893", unesco: true },

  // ── République tchèque ────────────────────────────────────────────────────────
  { id: "chateau-prague", name: "Château de Prague", country: "République tchèque", city: "Prague", continent: "europe", category: "palace", subCategory: "castle", year: "IXe siècle", unesco: true },
  { id: "pont-charles-prague", name: "Pont Charles", country: "République tchèque", city: "Prague", continent: "europe", category: "civil", subCategory: "bridge", year: "1357-1402", architect: "Peter Parler", unesco: true },
  { id: "cathedrale-saint-guy", name: "Cathédrale Saint-Guy", country: "République tchèque", city: "Prague", continent: "europe", category: "religious", subCategory: "cathedral", year: "1344-1929", architect: "Matthieu d'Arras", unesco: true },
  { id: "horloge-astronomique-prague", name: "Horloge Astronomique de Prague", country: "République tchèque", city: "Prague", continent: "europe", category: "tower", subCategory: "clock_tower", year: 1410 },

  // ── Hongrie ───────────────────────────────────────────────────────────────────
  { id: "parlement-budapest", name: "Parlement de Budapest", country: "Hongrie", city: "Budapest", continent: "europe", category: "civil", subCategory: "town_hall", year: "1885-1904", architect: "Imre Steindl", unesco: true },
  { id: "bastion-pecheurs-budapest", name: "Bastion des Pêcheurs", country: "Hongrie", city: "Budapest", continent: "europe", category: "monument", subCategory: "memorial", year: "1895-1902", architect: "Frigyes Schulek", unesco: true },
  { id: "matyas-temple-budapest", name: "Église Matthias", country: "Hongrie", city: "Budapest", continent: "europe", category: "religious", subCategory: "church", year: "1255-1470", unesco: true },

  // ── Pologne ───────────────────────────────────────────────────────────────────
  { id: "chateau-wawel", name: "Château du Wawel", country: "Pologne", city: "Cracovie", continent: "europe", category: "palace", subCategory: "castle", year: "XIe siècle", unesco: true },
  { id: "vieille-ville-varsovie", name: "Vieille Ville de Varsovie", country: "Pologne", city: "Varsovie", continent: "europe", category: "civil", subCategory: "town_hall", year: "XIVe siècle", unesco: true },
  { id: "chateau-malbork", name: "Château de Malbork", country: "Pologne", city: "Malbork", continent: "europe", category: "fortification", subCategory: "castle", year: "1274-1406", unesco: true },

  // ── Russie ───────────────────────────────────────────────────────────────────
  { id: "saint-basile-moscou", name: "Cathédrale Saint-Basile", country: "Russie", city: "Moscou", continent: "europe", category: "religious", subCategory: "cathedral", year: "1555-1561", architect: "Barma et Postnik Yakovlev", unesco: true },
  { id: "kremlin-moscou", name: "Kremlin de Moscou", country: "Russie", city: "Moscou", continent: "europe", category: "fortification", subCategory: "citadel", year: "1482-1495", unesco: true },
  { id: "ermitage-saint-petersbourg", name: "Ermitage", country: "Russie", city: "Saint-Pétersbourg", continent: "europe", category: "civil", subCategory: "museum", year: "1754-1762", architect: "Bartolomeo Rastrelli", unesco: true },
  { id: "peterhof", name: "Palais de Peterhof", country: "Russie", city: "Peterhof", continent: "europe", category: "palace", subCategory: "palace", year: "1714-1725", architect: "Jean-Baptiste Le Blond", unesco: true },
  { id: "cathedrale-saint-isaac", name: "Cathédrale Saint-Isaac", country: "Russie", city: "Saint-Pétersbourg", continent: "europe", category: "religious", subCategory: "cathedral", year: "1818-1858", architect: "Auguste de Montferrand" },

  // ── Scandinave ───────────────────────────────────────────────────────────────
  { id: "cathedrale-nidaros", name: "Cathédrale de Nidaros", country: "Norvège", city: "Trondheim", continent: "europe", category: "religious", subCategory: "cathedral", year: "1070-1300" },
  { id: "palais-drottningholm", name: "Palais de Drottningholm", country: "Suède", city: "Stockholm", continent: "europe", category: "palace", subCategory: "palace", year: "1662-1756", architect: "Nicodemus Tessin l'Ancien", unesco: true },
  { id: "cathedrale-lund", name: "Cathédrale de Lund", country: "Suède", city: "Lund", continent: "europe", category: "religious", subCategory: "cathedral", year: "1085-1145" },
  { id: "chapelle-temppeliaukio", name: "Chapelle de la Roche", country: "Finlande", city: "Helsinki", continent: "europe", category: "religious", subCategory: "church", year: "1969", architect: "Timo et Tuomo Suomalainen" },
  { id: "roskilde-cathedrale", name: "Cathédrale de Roskilde", country: "Danemark", city: "Roskilde", continent: "europe", category: "religious", subCategory: "cathedral", year: "1170-1280", architect: "Absalon", unesco: true },

  // ── Suisse / Autriche / Liechtenstein ────────────────────────────────────────
  { id: "palais-liechtenstein", name: "Château de Vaduz", country: "Liechtenstein", city: "Vaduz", continent: "europe", category: "palace", subCategory: "castle", year: "XIe siècle" },

  // ── Croatie ───────────────────────────────────────────────────────────────────
  { id: "palais-diocletien", name: "Palais de Dioclétien", country: "Croatie", city: "Split", continent: "europe", category: "ancient", subCategory: "archaeological_site", year: "295-305", architect: "Dioclétien", unesco: true },
  { id: "murs-dubrovnik", name: "Remparts de Dubrovnik", country: "Croatie", city: "Dubrovnik", continent: "europe", category: "fortification", subCategory: "city_wall", year: "XIIIe siècle", unesco: true },
  { id: "cathedrale-sibenik", name: "Cathédrale de Šibenik", country: "Croatie", city: "Šibenik", continent: "europe", category: "religious", subCategory: "cathedral", year: "1431-1535", architect: "Juraj Dalmatinac", unesco: true },

  // ── Slovaquie / Slovénie ─────────────────────────────────────────────────────
  { id: "chateau-bratislava", name: "Château de Bratislava", country: "Slovaquie", city: "Bratislava", continent: "europe", category: "palace", subCategory: "castle", year: "IXe siècle" },
  { id: "chateau-bled", name: "Château de Bled", country: "Slovénie", city: "Bled", continent: "europe", category: "palace", subCategory: "castle", year: "XIe siècle" },

  // ── Balkans ───────────────────────────────────────────────────────────────────
  { id: "vieux-pont-mostar", name: "Vieux Pont de Mostar", country: "Bosnie-Herzégovine", city: "Mostar", continent: "europe", category: "civil", subCategory: "bridge", year: "1557-1566", architect: "Mimar Hayruddin", unesco: true },
  { id: "kotor-vieux", name: "Vieille Ville de Kotor", country: "Monténégro", city: "Kotor", continent: "europe", category: "fortification", subCategory: "city_wall", year: "VIe siècle", unesco: true },
  { id: "cathedrale-sofia", name: "Cathédrale Alexandre Nevski", country: "Bulgarie", city: "Sofia", continent: "europe", category: "religious", subCategory: "cathedral", year: "1882-1912", architect: "Alexander Pomerantsev" },
  { id: "monastere-rila", name: "Monastère de Rila", country: "Bulgarie", city: "Rila", continent: "europe", category: "religious", subCategory: "monastery", year: "Xe siècle", unesco: true },

  // ── Grèce – compléments ──────────────────────────────────────────────────────
  { id: "delphi", name: "Sanctuaire de Delphes", country: "Grèce", city: "Delphes", continent: "europe", category: "ancient", subCategory: "archaeological_site", year: "-1400 à -390", unesco: true },
  { id: "thessalonique-arche", name: "Arc de Galère", country: "Grèce", city: "Thessalonique", continent: "europe", category: "monument", subCategory: "arch", year: "298-305", unesco: true },

  // ── Irlande ───────────────────────────────────────────────────────────────────
  { id: "newgrange", name: "Newgrange", country: "Irlande", city: "Brú na Bóinne", continent: "europe", category: "funerary", subCategory: "tomb", year: "-3200", unesco: true },
  { id: "rock-of-cashel", name: "Rocher de Cashel", country: "Irlande", city: "Cashel", continent: "europe", category: "religious", subCategory: "church", year: "XIIe siècle" },
  { id: "cliffs-of-moher-tower", name: "Tour de O'Brien", country: "Irlande", city: "Moher", continent: "europe", category: "tower", subCategory: "observation_tower", year: 1835 },

  // ── Roumanie ──────────────────────────────────────────────────────────────────
  { id: "chateau-bran", name: "Château de Bran", country: "Roumanie", city: "Bran", continent: "europe", category: "fortification", subCategory: "castle", year: "1377-1382" },
  { id: "parlement-bucarest", name: "Palais du Parlement", country: "Roumanie", city: "Bucarest", continent: "europe", category: "civil", subCategory: "town_hall", year: "1984-1997", architect: "Anca Petrescu" },
  { id: "monastere-voronet", name: "Monastère de Voroneț", country: "Roumanie", city: "Voroneț", continent: "europe", category: "religious", subCategory: "monastery", year: "1488", architect: "Étienne le Grand", unesco: true },

  // ── Malte ─────────────────────────────────────────────────────────────────────
  { id: "temples-tarxien", name: "Temples de Tarxien", country: "Malte", city: "Tarxien", continent: "europe", category: "ancient", subCategory: "megalith", year: "-3600", unesco: true },
  { id: "fort-saint-ange", name: "Fort Saint-Ange", country: "Malte", city: "La Valette", continent: "europe", category: "fortification", subCategory: "fortress", year: "1530-1800" },

  // ── Islande ───────────────────────────────────────────────────────────────────
  { id: "hallgrimskirkja", name: "Hallgrímskirkja", country: "Islande", city: "Reykjavik", continent: "europe", category: "religious", subCategory: "church", year: "1945-1986", architect: "Guðjón Samúelsson" },

  // ── Serbie ────────────────────────────────────────────────────────────────────
  { id: "saint-sava-belgrade", name: "Cathédrale Saint-Sava", country: "Serbie", city: "Belgrade", continent: "europe", category: "religious", subCategory: "cathedral", year: "1935-" },

  // ── Macédoine du Nord ─────────────────────────────────────────────────────────
  { id: "ohrid-sainte-sophie", name: "Église Sainte-Sophie d'Ohrid", country: "Macédoine du Nord", city: "Ohrid", continent: "europe", category: "religious", subCategory: "church", year: "XIe siècle", architect: "Léon d'Ohrid", unesco: true },

  // ── Espagne – compléments ────────────────────────────────────────────────────
  { id: "aqueduct-segovia", name: "Aqueduc de Ségovie", country: "Espagne", city: "Ségovie", continent: "europe", category: "ancient", subCategory: "aqueduct", year: "Ier-IIe siècle", unesco: true },
  { id: "mezquita-cordoue", name: "Mosquée-Cathédrale de Cordoue", country: "Espagne", city: "Cordoue", continent: "europe", category: "religious", subCategory: "mosque", year: "784-987", architect: "Abd al-Rahman Ier", unesco: true },
  { id: "casa-batllo", name: "Casa Batlló", country: "Espagne", city: "Barcelone", continent: "europe", category: "civil", subCategory: "museum", year: "1904-1906", architect: "Antoni Gaudí", unesco: true },
  { id: "gaudi-casa-mila", name: "Casa Milà (La Pedrera)", country: "Espagne", city: "Barcelone", continent: "europe", category: "civil", subCategory: "museum", year: "1906-1912", architect: "Antoni Gaudí", unesco: true },
  { id: "palau-musica-catalana", name: "Palau de la Música Catalana", country: "Espagne", city: "Barcelone", continent: "europe", category: "civil", subCategory: "opera", year: "1905-1908", architect: "Lluís Domènech i Montaner", unesco: true },
  { id: "alcazar-tolede", name: "Alcázar de Tolède", country: "Espagne", city: "Tolède", continent: "europe", category: "fortification", subCategory: "fortress", year: "IIIe siècle" },

  // ── France – compléments ─────────────────────────────────────────────────────
  { id: "chateau-chambord", name: "Château de Chambord", country: "France", city: "Chambord", continent: "europe", category: "palace", subCategory: "castle", year: "1519-1547", architect: "Domenico da Cortona", unesco: true },
  { id: "amphitheatre-nimes", name: "Arènes de Nîmes", country: "France", city: "Nîmes", continent: "europe", category: "ancient", subCategory: "amphitheatre", year: "Ier siècle" },
  { id: "theatre-orange", name: "Théâtre Antique d'Orange", country: "France", city: "Orange", continent: "europe", category: "ancient", subCategory: "amphitheatre", year: "Ier siècle", unesco: true },
  { id: "sainte-chapelle", name: "Sainte-Chapelle", country: "France", city: "Paris", continent: "europe", category: "religious", subCategory: "church", year: "1239-1248", architect: "Pierre de Montreuil" },
  { id: "chartres-cathedrale", name: "Cathédrale de Chartres", country: "France", city: "Chartres", continent: "europe", category: "religious", subCategory: "cathedral", year: "1194-1220", unesco: true },
  { id: "chateau-amboise", name: "Château d'Amboise", country: "France", city: "Amboise", continent: "europe", category: "palace", subCategory: "castle", year: "1491-1498", architect: "Guillaume Senault", unesco: true },
  { id: "invalides-paris", name: "Hôtel des Invalides", country: "France", city: "Paris", continent: "europe", category: "monument", subCategory: "mausoleum", year: "1671-1676", architect: "Libéral Bruant" },
  { id: "catacombes-paris", name: "Catacombes de Paris", country: "France", city: "Paris", continent: "europe", category: "funerary", subCategory: "tomb", year: "1786" },
  { id: "fontaine-de-vaucluse", name: "Fontaine de Vaucluse", country: "France", city: "Fontaine-de-Vaucluse", continent: "europe", category: "natural", subCategory: "cave" },
  { id: "abbaye-cluny", name: "Abbaye de Cluny", country: "France", city: "Cluny", continent: "europe", category: "religious", subCategory: "monastery", year: "910-1130", architect: "Hugues de Semur" },
  { id: "tour-saint-jacques", name: "Tour Saint-Jacques", country: "France", city: "Paris", continent: "europe", category: "tower", subCategory: "bell_tower", year: "1509-1523" },
  { id: "chateau-chenonceau", name: "Château de Chenonceau", country: "France", city: "Chenonceaux", continent: "europe", category: "palace", subCategory: "castle", year: "1513-1559", architect: "Thomas Bohier", unesco: true },

  // ── Italie – compléments ─────────────────────────────────────────────────────
  { id: "teatro-olimpico-vicenza", name: "Théâtre Olympique de Vicence", country: "Italie", city: "Vicence", continent: "europe", category: "civil", subCategory: "theatre", year: "1580-1585", architect: "Andrea Palladio", unesco: true },
  { id: "castel-del-monte", name: "Castel del Monte", country: "Italie", city: "Andria", continent: "europe", category: "fortification", subCategory: "castle", year: "1240-1250", architect: "Frédéric II", unesco: true },
  { id: "palerme-cathedrale", name: "Cathédrale de Palerme", country: "Italie", city: "Palerme", continent: "europe", category: "religious", subCategory: "cathedral", year: "1185", architect: "Offamil", unesco: true },
  { id: "uffizi-florence", name: "Galerie des Offices", country: "Italie", city: "Florence", continent: "europe", category: "civil", subCategory: "museum", year: "1560-1581", architect: "Giorgio Vasari" },
  { id: "capella-sistine", name: "Chapelle Sixtine", country: "Italie", city: "Vatican", continent: "europe", category: "religious", subCategory: "church", year: "1473-1481", architect: "Giovannino de' Dolci" },
  { id: "arc-titus-rome", name: "Arc de Titus", country: "Italie", city: "Rome", continent: "europe", category: "monument", subCategory: "arch", year: 82 },
  { id: "valle-dei-templi", name: "Vallée des Temples", country: "Italie", city: "Agrigente", continent: "europe", category: "ancient", subCategory: "ancient_temple", year: "-500 à -430", unesco: true },
  { id: "cathedrale-florence", name: "Baptistère de Florence", country: "Italie", city: "Florence", continent: "europe", category: "religious", subCategory: "church", year: "XIe siècle", architect: "Arnolfo di Cambio", unesco: true },

  // ── Albanie / Kosovo ─────────────────────────────────────────────────────────
  { id: "chateau-kruje", name: "Château de Krujë", country: "Albanie", city: "Krujë", continent: "europe", category: "fortification", subCategory: "fortress", year: "Ve siècle" },

  // ── Grèce / Turquie – suppléments ────────────────────────────────────────────
  { id: "corinthe-antique", name: "Acrocorinthe", country: "Grèce", city: "Corinthe", continent: "europe", category: "fortification", subCategory: "citadel", year: "VIIe siècle av. J.-C." },

  // ── Finlande ──────────────────────────────────────────────────────────────────
  { id: "forteresse-suomenlinna", name: "Forteresse de Suomenlinna", country: "Finlande", city: "Helsinki", continent: "europe", category: "fortification", subCategory: "fortress", year: "1748-1808", architect: "Augustin Ehrensvärd", unesco: true },
  { id: "cathedrale-helsinki", name: "Cathédrale d'Helsinki", country: "Finlande", city: "Helsinki", continent: "europe", category: "religious", subCategory: "cathedral", year: "1818-1852", architect: "Carl Ludwig Engel" },

  // ── Lettonie / Estonie / Lituanie ─────────────────────────────────────────────
  { id: "maison-tetes-noires-riga", name: "Maison des Têtes-Noires", country: "Lettonie", city: "Riga", continent: "europe", category: "civil", subCategory: "town_hall", year: "1334", unesco: true },
  { id: "cathedrale-tallinn", name: "Cathédrale Saint-Alexandre-Nevski de Tallinn", country: "Estonie", city: "Tallinn", continent: "europe", category: "religious", subCategory: "cathedral", year: "1894-1900", architect: "Mikhail Preobrazhensky", unesco: true },
  { id: "chateau-trakai", name: "Château de Trakai", country: "Lituanie", city: "Trakai", continent: "europe", category: "palace", subCategory: "castle", year: "XIVe siècle" },

  // ── Azerbaïdjan (frontière Europe-Asie) ───────────────────────────────────────
  { id: "tour-de-la-vierge-bakou", name: "Tour de la Vierge", country: "Azerbaïdjan", city: "Bakou", continent: "europe", category: "tower", subCategory: "observation_tower", year: "XIIe siècle", unesco: true },

  // ── Ukraine ───────────────────────────────────────────────────────────────────
  { id: "cathedrale-sainte-sophie-kiev", name: "Cathédrale Sainte-Sophie de Kiev", country: "Ukraine", city: "Kiev", continent: "europe", category: "religious", subCategory: "cathedral", year: "1011-1018", architect: "Yaroslav le Sage", unesco: true },
  { id: "monastere-petchersk", name: "Monastère des Grottes de Kiev", country: "Ukraine", city: "Kiev", continent: "europe", category: "religious", subCategory: "monastery", year: "1051", architect: "Antoine des Grottes", unesco: true },


  // ── Gibraltar / Monaco ────────────────────────────────────────────────────────
  { id: "rocher-de-gibraltar", name: "Rocher de Gibraltar", country: "Gibraltar", city: "Gibraltar", continent: "europe", category: "fortification", subCategory: "fortress", year: "711" },

  // ── Andorre ───────────────────────────────────────────────────────────────────
  { id: "eglise-sant-esteve", name: "Église Sant Esteve", country: "Andorre", city: "Andorre-la-Vieille", continent: "europe", category: "religious", subCategory: "church", year: "XIe siècle" },

  // ── Arménie (frontière Europe-Asie) ──────────────────────────────────────────
  { id: "monastere-geghard", name: "Monastère de Geghard", country: "Arménie", city: "Garni", continent: "europe", category: "religious", subCategory: "monastery", year: "IVe siècle", architect: "Kostandin Prosh Khaghbakian", unesco: true },

  // ── Géorgie (frontière Europe-Asie) ──────────────────────────────────────────
  { id: "eglise-sameba-tbilisi", name: "Cathédrale de la Sainte-Trinité de Tbilissi", country: "Géorgie", city: "Tbilissi", continent: "europe", category: "religious", subCategory: "cathedral", year: "1995-2004", architect: "Arčil Mindiašvili" },

  // ── Macédoine – complément ────────────────────────────────────────────────────
  { id: "skopje-forteresse", name: "Forteresse de Kale", country: "Macédoine du Nord", city: "Skopje", continent: "europe", category: "fortification", subCategory: "citadel", year: "VIe siècle", architect: "Justinien Ier" },

  // ── Albanie ───────────────────────────────────────────────────────────────────
  { id: "butrint", name: "Butrint", country: "Albanie", city: "Sarandë", continent: "europe", category: "ancient", subCategory: "ancient_city", year: "-VII siècle", unesco: true },

  // ── Luxembourg ───────────────────────────────────────────────────────────────
  { id: "vieux-luxembourg", name: "Vieille Ville de Luxembourg", country: "Luxembourg", city: "Luxembourg", continent: "europe", category: "fortification", subCategory: "citadel", year: "963-963", architect: "Sigefroid", unesco: true },
];
