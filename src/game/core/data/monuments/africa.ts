// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import type { MonumentInput } from "@/types";

export const africaMonuments: MonumentInput[] = [
  // Egypt — Ancient & Funerary
  { id: "pyramides-de-gizeh", name: "Pyramides de Gizeh", country: "Égypte", city: "Gizeh", continent: "africa", category: "funerary", subCategory: "pyramid", year: -2560, unesco: true },
  { id: "sphinx-de-gizeh", name: "Grand Sphinx de Gizeh", country: "Égypte", city: "Gizeh", continent: "africa", category: "ancient", subCategory: "archaeological_site", year: -2500, unesco: true },
  { id: "pyramide-de-khafre", name: "Pyramide de Khafré", country: "Égypte", city: "Gizeh", continent: "africa", category: "funerary", subCategory: "pyramid", year: -2530, unesco: true },
  { id: "temple-de-louxor", name: "Temple de Louxor", country: "Égypte", city: "Louxor", continent: "africa", category: "ancient", subCategory: "ancient_temple", year: -1400, unesco: true },
  { id: "temple-d-abou-simbel", name: "Temple d'Abou Simbel", country: "Égypte", city: "Abou Simbel", continent: "africa", category: "ancient", subCategory: "ancient_temple", year: -1264, architect: "Ramesses II", unesco: true },
  { id: "temple-de-philae", name: "Temple de Philae", country: "Égypte", city: "Assouan", continent: "africa", category: "ancient", subCategory: "ancient_temple", year: -280, unesco: true },
  { id: "temple-d-hatchepsout", name: "Temple d'Hatchepsout", country: "Égypte", city: "Louxor", continent: "africa", category: "ancient", subCategory: "ancient_temple", year: -1479, unesco: true },
  { id: "obelisque-de-louxor", name: "Obélisque de Louxor", country: "Égypte", city: "Louxor", continent: "africa", category: "monument", subCategory: "obelisk", year: -1279 },
  { id: "mosquee-mohammed-ali", name: "Mosquée Mohammed Ali", country: "Égypte", city: "Le Caire", continent: "africa", category: "religious", subCategory: "mosque", year: 1857 },
  { id: "pyramides-de-meroe", name: "Pyramides de Méroé", country: "Soudan", city: "Méroé", continent: "africa", category: "funerary", subCategory: "pyramid", year: -270, unesco: true },
  // Morocco
  { id: "koutoubia-marrakech", name: "Mosquée Koutoubia", country: "Maroc", city: "Marrakech", continent: "africa", category: "religious", subCategory: "mosque", year: 1158, unesco: true },
  { id: "hassan-tour", name: "Tour Hassan", country: "Maroc", city: "Rabat", continent: "africa", category: "tower", subCategory: "minaret", year: 1195, unesco: true },
  { id: "mausolee-mohammed-v", name: "Mausolée Mohammed V", country: "Maroc", city: "Rabat", continent: "africa", category: "funerary", subCategory: "mausoleum", year: 1971 },
  { id: "kasbah-ait-ben-haddou", name: "Ksar d'Aït-Ben-Haddou", country: "Maroc", city: "Aït-Ben-Haddou", continent: "africa", category: "fortification", subCategory: "citadel", year: "XVIIe siècle", unesco: true },
  { id: "mosquee-hassan-ii", name: "Mosquée Hassan II", country: "Maroc", city: "Casablanca", continent: "africa", category: "religious", subCategory: "mosque", year: 1993, architect: "Michel Pinseau" },
  { id: "medina-de-fes", name: "Médina de Fès", country: "Maroc", city: "Fès", continent: "africa", category: "ancient", subCategory: "ancient_city", year: "IXe siècle", unesco: true },
  { id: "bab-mansour", name: "Bab Mansour", country: "Maroc", city: "Meknès", continent: "africa", category: "fortification", subCategory: "fortified_gate", year: 1732, unesco: true },
  // Tunisia
  { id: "amphitheatre-el-jem", name: "Amphithéâtre d'El Jem", country: "Tunisie", city: "El Jem", continent: "africa", category: "ancient", subCategory: "amphitheatre", year: 238, unesco: true },
  { id: "ruines-de-carthage", name: "Ruines de Carthage", country: "Tunisie", city: "Carthage", continent: "africa", category: "ancient", subCategory: "ancient_city", year: -814, unesco: true },
  { id: "grande-mosquee-de-kairouan", name: "Grande Mosquée de Kairouan", country: "Tunisie", city: "Kairouan", continent: "africa", category: "religious", subCategory: "mosque", year: 670, unesco: true },
  // Algeria
  { id: "djemila-ruines", name: "Ruines de Djémila", country: "Algérie", city: "Djémila", continent: "africa", category: "ancient", subCategory: "ancient_city", year: "Ier siècle", unesco: true },
  { id: "casbah-d-alger", name: "Casbah d'Alger", country: "Algérie", city: "Alger", continent: "africa", category: "fortification", subCategory: "citadel", year: "XVIe siècle", unesco: true },
  // Libya
  { id: "leptis-magna", name: "Leptis Magna", country: "Libye", city: "Al-Khums", continent: "africa", category: "ancient", subCategory: "ancient_city", year: -7, unesco: true },
  // Ethiopia
  { id: "eglise-saint-georges-lalibela", name: "Église Saint-Georges de Lalibela", country: "Éthiopie", city: "Lalibela", continent: "africa", category: "religious", subCategory: "church", year: 1200, unesco: true },
  { id: "obelisque-d-axoum", name: "Obélisque d'Axoum", country: "Éthiopie", city: "Axoum", continent: "africa", category: "monument", subCategory: "obelisk", year: 400, unesco: true },
  // Mali
  { id: "grande-mosquee-de-djenne", name: "Grande Mosquée de Djenné", country: "Mali", city: "Djenné", continent: "africa", category: "religious", subCategory: "mosque", year: 1907, unesco: true },
  { id: "mosquee-djingareyber-tombouctou", name: "Mosquée Djingareyber", country: "Mali", city: "Tombouctou", continent: "africa", category: "religious", subCategory: "mosque", year: 1327, architect: "Abou Ishaq es-Saheli", unesco: true },
  { id: "falaises-de-bandiagara", name: "Falaises de Bandiagara", country: "Mali", city: "Bandiagara", continent: "africa", category: "ancient", subCategory: "archaeological_site", year: "XIe siècle", unesco: true },
  // Senegal
  { id: "monument-de-la-renaissance-africaine", name: "Monument de la Renaissance africaine", country: "Sénégal", city: "Dakar", continent: "africa", category: "monument", subCategory: "statue", year: 2010, architect: "Pierre Goudiaby" },
  { id: "ile-de-goree", name: "Île de Gorée — Maison des esclaves", country: "Sénégal", city: "Dakar", continent: "africa", category: "civil", subCategory: "museum", year: 1776, unesco: true },
  // Tanzania
  { id: "kilimanjaro-uhuru-peak", name: "Kilimandjaro", country: "Tanzanie", city: "Moshi", continent: "africa", category: "natural", subCategory: "mountain" },
  // Kenya
  { id: "fort-jesus-mombasa", name: "Fort Jésus de Mombasa", country: "Kenya", city: "Mombasa", continent: "africa", category: "fortification", subCategory: "fortress", year: 1593, architect: "Giovanni Battista Cairati", unesco: true },
  // South Africa
  { id: "cap-de-bonne-esperance", name: "Cap de Bonne-Espérance — Phare", country: "Afrique du Sud", city: "Le Cap", continent: "africa", category: "civil", subCategory: "lighthouse", year: 1860 },
  { id: "musee-de-l-apartheid", name: "Musée de l'Apartheid", country: "Afrique du Sud", city: "Johannesburg", continent: "africa", category: "civil", subCategory: "museum", year: 2001 },
  { id: "union-buildings-pretoria", name: "Union Buildings", country: "Afrique du Sud", city: "Pretoria", continent: "africa", category: "civil", subCategory: "town_hall", year: 1913, architect: "Herbert Baker" },
  { id: "robben-island", name: "Prison de Robben Island", country: "Afrique du Sud", city: "Le Cap", continent: "africa", category: "civil", subCategory: "museum", year: 1964, unesco: true },
  // Zimbabwe
  { id: "grand-zimbabwe", name: "Grand Zimbabwe", country: "Zimbabwe", city: "Masvingo", continent: "africa", category: "ancient", subCategory: "ancient_city", year: 1100, unesco: true },
  // Benin
  { id: "palais-royaux-d-abomey", name: "Palais royaux d'Abomey", country: "Bénin", city: "Abomey", continent: "africa", category: "palace", subCategory: "palace", year: 1625, unesco: true },
  // Ghana
  { id: "forts-du-ghana-cape-coast", name: "Château de Cape Coast", country: "Ghana", city: "Cape Coast", continent: "africa", category: "fortification", subCategory: "fortress", year: 1653, unesco: true },
  // Ivory Coast
  { id: "basilique-yamoussoukro", name: "Basilique Notre-Dame de la Paix", country: "Côte d'Ivoire", city: "Yamoussoukro", continent: "africa", category: "religious", subCategory: "basilica", year: 1989, architect: "Pierre Fakhoury" },
  // Nigeria
  { id: "olumo-rock-abeokuta", name: "Rocher Olumo", country: "Nigeria", city: "Abeokuta", continent: "africa", category: "natural", subCategory: "rock_formation" },
  // Uganda
  { id: "tombeaux-des-rois-buganda", name: "Tombeaux des rois du Buganda", country: "Ouganda", city: "Kasubi", continent: "africa", category: "funerary", subCategory: "tomb", year: 1881, unesco: true },
  // Rwanda
  { id: "memorial-genocide-kigali", name: "Mémorial du Génocide de Kigali", country: "Rwanda", city: "Kigali", continent: "africa", category: "monument", subCategory: "memorial", year: 2004 },
  // Madagascar
  { id: "palais-de-la-reine-antananarivo", name: "Palais de la Reine", country: "Madagascar", city: "Antananarivo", continent: "africa", category: "palace", subCategory: "residence", year: 1839 },
  // Cameroon
  { id: "musee-national-de-yaounde", name: "Musée national du Cameroun", country: "Cameroun", city: "Yaoundé", continent: "africa", category: "civil", subCategory: "museum", year: 1989 },
  // Sudan (additional)
  { id: "temple-de-soleb", name: "Temple de Soleb", country: "Soudan", city: "Soleb", continent: "africa", category: "ancient", subCategory: "ancient_temple", year: -1400 },
  // Egypt (additional)
  { id: "temple-de-kom-ombo", name: "Temple de Kom Ombo", country: "Égypte", city: "Kom Ombo", continent: "africa", category: "ancient", subCategory: "ancient_temple", year: -180 },
  { id: "temple-d-edfou", name: "Temple d'Edfou", country: "Égypte", city: "Edfou", continent: "africa", category: "ancient", subCategory: "ancient_temple", year: -237 },
  { id: "temple-de-medinet-habou", name: "Temple de Médinet Habou", country: "Égypte", city: "Louxor", continent: "africa", category: "ancient", subCategory: "ancient_temple", year: -1184 },
  { id: "colosses-de-memnon", name: "Colosses de Memnon", country: "Égypte", city: "Louxor", continent: "africa", category: "monument", subCategory: "statue", year: -1350 },
  { id: "mosquee-ibn-tulun", name: "Mosquée Ibn Tulun", country: "Égypte", city: "Le Caire", continent: "africa", category: "religious", subCategory: "mosque", year: 879 },
  { id: "mosquee-al-azhar", name: "Mosquée Al-Azhar", country: "Égypte", city: "Le Caire", continent: "africa", category: "religious", subCategory: "mosque", year: 972 },
  { id: "phare-d-alexandrie", name: "Phare d'Alexandrie (Fort Qaitbay)", country: "Égypte", city: "Alexandrie", continent: "africa", category: "civil", subCategory: "lighthouse", year: 1477 },
  // Morocco (additional)
  { id: "jardins-majorelle-marrakech", name: "Jardin Majorelle", country: "Maroc", city: "Marrakech", continent: "africa", category: "civil", subCategory: "museum", year: 1931, architect: "Jacques Majorelle" },
  { id: "volubilis-ruines", name: "Ruines de Volubilis", country: "Maroc", city: "Meknès", continent: "africa", category: "ancient", subCategory: "ancient_city", year: "IIIe siècle", unesco: true },
  // Tunisia (additional)
  { id: "medina-de-tunis", name: "Médina de Tunis", country: "Tunisie", city: "Tunis", continent: "africa", category: "ancient", subCategory: "ancient_city", year: "IXe siècle", unesco: true },
  // Ethiopia (additional)
  { id: "monastere-de-debre-damo", name: "Monastère de Debre Damo", country: "Éthiopie", city: "Adwa", continent: "africa", category: "religious", subCategory: "monastery", year: 600, unesco: true },
  // South Africa (additional)
  { id: "voortrekker-monument", name: "Monument Voortrekker", country: "Afrique du Sud", city: "Pretoria", continent: "africa", category: "monument", subCategory: "memorial", year: 1949 },
  // Egypt (final)
  { id: "musee-egyptien-du-caire", name: "Musée égyptien du Caire", country: "Égypte", city: "Le Caire", continent: "africa", category: "civil", subCategory: "museum", year: 1902, architect: "Marcel Dourgnon" },
];
