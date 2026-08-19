// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import type { MonumentInput } from "@/types";

export const northAmericaMonuments: MonumentInput[] = [
  // ─── ÉTATS-UNIS ───────────────────────────────────────────────────────────
  { id: "statue-de-la-liberte", name: "Statue de la Liberté", country: "États-Unis", city: "New York", continent: "north_america", category: "monument", subCategory: "statue", year: 1886, architect: "Frédéric Auguste Bartholdi", unesco: true },
  { id: "empire-state-building", name: "Empire State Building", country: "États-Unis", city: "New York", continent: "north_america", category: "tower", subCategory: "skyscraper", year: 1931 },
  { id: "chrysler-building", name: "Chrysler Building", country: "États-Unis", city: "New York", continent: "north_america", category: "tower", subCategory: "skyscraper", year: 1930, architect: "William Van Alen" },
  { id: "pont-brooklyn", name: "Pont de Brooklyn", country: "États-Unis", city: "New York", continent: "north_america", category: "civil", subCategory: "bridge", year: 1883, architect: "John Roebling" },
  { id: "maison-blanche", name: "Maison-Blanche", country: "États-Unis", city: "Washington D.C.", continent: "north_america", category: "palace", subCategory: "residence", year: 1800, architect: "James Hoban" },
  { id: "capitole-etats-unis", name: "Capitole des États-Unis", country: "États-Unis", city: "Washington D.C.", continent: "north_america", category: "civil", subCategory: "town_hall", year: 1800 },
  { id: "monument-washington", name: "Monument de Washington", country: "États-Unis", city: "Washington D.C.", continent: "north_america", category: "monument", subCategory: "obelisk", year: 1884 },
  { id: "memorial-lincoln", name: "Mémorial Lincoln", country: "États-Unis", city: "Washington D.C.", continent: "north_america", category: "monument", subCategory: "memorial", year: 1922, architect: "Henry Bacon" },
  { id: "memorial-vietnam", name: "Mémorial des Vétérans du Vietnam", country: "États-Unis", city: "Washington D.C.", continent: "north_america", category: "monument", subCategory: "memorial", year: 1982, architect: "Maya Lin" },
  { id: "mount-rushmore", name: "Mont Rushmore", country: "États-Unis", city: "Keystone", continent: "north_america", category: "monument", subCategory: "statue", year: 1941 },
  { id: "golden-gate-bridge", name: "Pont du Golden Gate", country: "États-Unis", city: "San Francisco", continent: "north_america", category: "civil", subCategory: "bridge", year: 1937, architect: "Joseph Strauss" },
  { id: "alcatraz", name: "Prison d'Alcatraz", country: "États-Unis", city: "San Francisco", continent: "north_america", category: "fortification", subCategory: "fortress", year: 1934 },
  { id: "hollywood-sign", name: "Hollywood Sign", country: "États-Unis", city: "Los Angeles", continent: "north_america", category: "monument", subCategory: "memorial", year: 1923 },
  { id: "willis-tower", name: "Willis Tower", country: "États-Unis", city: "Chicago", continent: "north_america", category: "tower", subCategory: "skyscraper", year: 1973 },
  { id: "national-mall", name: "National Mall", country: "États-Unis", city: "Washington D.C.", continent: "north_america", category: "monument", subCategory: "memorial", year: 1965 },
  { id: "space-needle", name: "Space Needle", country: "États-Unis", city: "Seattle", continent: "north_america", category: "tower", subCategory: "observation_tower", year: 1962 },
  { id: "gateway-arch", name: "Gateway Arch", country: "États-Unis", city: "Saint-Louis", continent: "north_america", category: "monument", subCategory: "arch", year: 1965, architect: "Eero Saarinen" },
  { id: "hoover-dam", name: "Barrage Hoover", country: "États-Unis", city: "Boulder City", continent: "north_america", category: "civil", subCategory: "bridge", year: 1936 },
  { id: "grand-canyon-skywalk", name: "Skywalk du Grand Canyon", country: "États-Unis", city: "Supai", continent: "north_america", category: "civil", subCategory: "bridge", year: 2007 },
  { id: "independence-hall", name: "Independence Hall", country: "États-Unis", city: "Philadelphie", continent: "north_america", category: "civil", subCategory: "town_hall", year: 1753, unesco: true },
  { id: "notre-dame-new-orleans", name: "Cathédrale Saint-Louis de La Nouvelle-Orléans", country: "États-Unis", city: "Nouvelle-Orléans", continent: "north_america", category: "religious", subCategory: "cathedral", year: 1794 },
  { id: "grace-cathedral-sf", name: "Cathédrale Grace", country: "États-Unis", city: "San Francisco", continent: "north_america", category: "religious", subCategory: "cathedral", year: 1964 },
  { id: "flatiron-building", name: "Flatiron Building", country: "États-Unis", city: "New York", continent: "north_america", category: "tower", subCategory: "skyscraper", year: 1902, architect: "Daniel Burnham" },
  { id: "met-museum", name: "Metropolitan Museum of Art", country: "États-Unis", city: "New York", continent: "north_america", category: "civil", subCategory: "museum", year: 1880 },
  { id: "pentagon", name: "Le Pentagone", country: "États-Unis", city: "Arlington", continent: "north_america", category: "civil", subCategory: "town_hall", year: 1943 },
  { id: "liberty-bell", name: "Cloche de la Liberté", country: "États-Unis", city: "Philadelphie", continent: "north_america", category: "monument", subCategory: "memorial", year: 1753 },
  { id: "boston-old-state-house", name: "Old State House de Boston", country: "États-Unis", city: "Boston", continent: "north_america", category: "civil", subCategory: "town_hall", year: 1713 },
  { id: "times-square", name: "Times Square", country: "États-Unis", city: "New York", continent: "north_america", category: "civil", subCategory: "theatre", year: 1904 },
  { id: "rockefeller-center", name: "Rockefeller Center", country: "États-Unis", city: "New York", continent: "north_america", category: "civil", subCategory: "theatre", year: 1933 },
  { id: "us-supreme-court", name: "Cour Suprême des États-Unis", country: "États-Unis", city: "Washington D.C.", continent: "north_america", category: "civil", subCategory: "town_hall", year: 1935, architect: "Cass Gilbert" },

  // ─── CANADA ───────────────────────────────────────────────────────────────
  { id: "chateau-frontenac", name: "Château Frontenac", country: "Canada", city: "Québec", continent: "north_america", category: "palace", subCategory: "castle", year: 1893, architect: "Bruce Price" },
  { id: "tour-cn", name: "Tour CN", country: "Canada", city: "Toronto", continent: "north_america", category: "tower", subCategory: "observation_tower", year: 1976 },
  { id: "parliament-canada", name: "Parlement du Canada", country: "Canada", city: "Ottawa", continent: "north_america", category: "civil", subCategory: "town_hall", year: 1866 },
  { id: "notre-dame-montreal", name: "Basilique Notre-Dame de Montréal", country: "Canada", city: "Montréal", continent: "north_america", category: "religious", subCategory: "basilica", year: 1829, architect: "James O'Donnell" },
  { id: "vieux-port-montreal", name: "Vieux-Port de Montréal", country: "Canada", city: "Montréal", continent: "north_america", category: "civil", subCategory: "museum", year: 1611 },
  { id: "banff-chateau-lake-louise", name: "Château Lake Louise", country: "Canada", city: "Banff", continent: "north_america", category: "palace", subCategory: "residence", year: 1890 },
  { id: "rideau-canal", name: "Canal Rideau", country: "Canada", city: "Ottawa", continent: "north_america", category: "civil", subCategory: "bridge", year: 1832, unesco: true },
  { id: "vieux-quebec-fortifications", name: "Fortifications de Québec", country: "Canada", city: "Québec", continent: "north_america", category: "fortification", subCategory: "city_wall", year: 1608, unesco: true },

  // ─── MEXIQUE ──────────────────────────────────────────────────────────────
  { id: "chichen-itza", name: "Chichén Itzá", country: "Mexique", city: "Yucatán", continent: "north_america", category: "ancient", subCategory: "pyramid", year: "VIIe-XIIIe siècle", unesco: true },
  { id: "teotihuacan", name: "Teotihuacán", country: "Mexique", city: "État de Mexico", continent: "north_america", category: "ancient", subCategory: "pyramid", year: "IIe siècle av. J.-C.", unesco: true },
  { id: "palacio-bellas-artes", name: "Palais des Beaux-Arts", country: "Mexique", city: "Mexico", continent: "north_america", category: "civil", subCategory: "opera", year: 1934 },
  { id: "catedral-metropolitana-mexico", name: "Cathédrale métropolitaine de Mexico", country: "Mexique", city: "Mexico", continent: "north_america", category: "religious", subCategory: "cathedral", year: 1813 },
  { id: "zocalo-mexico", name: "Zócalo de Mexico", country: "Mexique", city: "Mexico", continent: "north_america", category: "civil", subCategory: "town_hall", year: 1524, unesco: true },
  { id: "palenque", name: "Palenque", country: "Mexique", city: "Chiapas", continent: "north_america", category: "ancient", subCategory: "ancient_city", year: "Ve-IXe siècle", unesco: true },
  { id: "monte-alban", name: "Monte Albán", country: "Mexique", city: "Oaxaca", continent: "north_america", category: "ancient", subCategory: "ancient_city", year: "500 av. J.-C.", unesco: true },
  { id: "uxmal", name: "Uxmal", country: "Mexique", city: "Yucatán", continent: "north_america", category: "ancient", subCategory: "pyramid", year: "VIe-Xe siècle", unesco: true },
  { id: "tulum", name: "Tulum", country: "Mexique", city: "Quintana Roo", continent: "north_america", category: "ancient", subCategory: "ancient_city", year: "XIIIe-XVe siècle" },
  { id: "pyramide-cholula", name: "Grande Pyramide de Cholula", country: "Mexique", city: "Cholula", continent: "north_america", category: "ancient", subCategory: "pyramid", year: "IIIe siècle av. J.-C." },
  { id: "castillo-chapultepec", name: "Château de Chapultepec", country: "Mexique", city: "Mexico", continent: "north_america", category: "palace", subCategory: "castle", year: 1785 },

  // ─── AMÉRIQUE CENTRALE ────────────────────────────────────────────────────
  { id: "tikal", name: "Tikal", country: "Guatemala", city: "Petén", continent: "north_america", category: "ancient", subCategory: "pyramid", year: "IVe-IXe siècle", unesco: true },
  { id: "copan", name: "Copán", country: "Honduras", city: "Copán Ruinas", continent: "north_america", category: "ancient", subCategory: "ancient_city", year: "Ve-IXe siècle", unesco: true },
  { id: "antigua-guatemala", name: "Antigua Guatemala", country: "Guatemala", city: "Antigua", continent: "north_america", category: "civil", subCategory: "town_hall", year: 1543, unesco: true },
  { id: "fort-san-lorenzo", name: "Fortifications de la côte caraïbe", country: "Panama", city: "Portobelo", continent: "north_america", category: "fortification", subCategory: "fortress", year: 1597, unesco: true },
  { id: "cathedral-antigua", name: "Cathédrale de Santiago d'Antigua", country: "Guatemala", city: "Antigua", continent: "north_america", category: "religious", subCategory: "cathedral", year: 1680 },
  { id: "teatro-nacional-costa-rica", name: "Théâtre National de Costa Rica", country: "Costa Rica", city: "San José", continent: "north_america", category: "civil", subCategory: "opera", year: 1897 },
  { id: "cahal-pech", name: "Cahal Pech", country: "Belize", city: "San Ignacio", continent: "north_america", category: "ancient", subCategory: "ancient_city", year: "IIe-IXe siècle" },
  { id: "xunantunich", name: "Xunantunich", country: "Belize", city: "Cayo", continent: "north_america", category: "ancient", subCategory: "pyramid", year: "VIIe-Xe siècle" },

  // ─── CARAÏBES ─────────────────────────────────────────────────────────────
  { id: "catedral-havana", name: "Cathédrale de La Havane", country: "Cuba", city: "La Havane", continent: "north_america", category: "religious", subCategory: "cathedral", year: 1777, unesco: true },
  { id: "vieille-havane", name: "Vieille Havane", country: "Cuba", city: "La Havane", continent: "north_america", category: "civil", subCategory: "town_hall", year: 1519, unesco: true },
  { id: "fort-christophe-haiti", name: "Citadelle Laferrière", country: "Haïti", city: "Milot", continent: "north_america", category: "fortification", subCategory: "citadel", year: 1820, unesco: true },
  { id: "vieille-ville-san-juan", name: "Vieille ville de San Juan", country: "Porto Rico", city: "San Juan", continent: "north_america", category: "civil", subCategory: "town_hall", year: 1521, unesco: true },
  { id: "catedral-santo-domingo", name: "Cathédrale de Santa María la Menor", country: "République dominicaine", city: "Saint-Domingue", continent: "north_america", category: "religious", subCategory: "cathedral", year: 1541, unesco: true },
  { id: "alcazar-colon", name: "Alcázar de Colón", country: "République dominicaine", city: "Saint-Domingue", continent: "north_america", category: "palace", subCategory: "residence", year: 1510, unesco: true },

  // ─── MONUMENTS ADDITIONNELS USA ───────────────────────────────────────────
  { id: "temple-salt-lake-city", name: "Temple de Salt Lake City", country: "États-Unis", city: "Salt Lake City", continent: "north_america", category: "religious", subCategory: "temple", year: 1893 },
  { id: "water-tower-chicago", name: "Water Tower de Chicago", country: "États-Unis", city: "Chicago", continent: "north_america", category: "tower", subCategory: "observation_tower", year: 1869 },
  { id: "musee-air-espace-washington", name: "Musée National de l'Air et de l'Espace", country: "États-Unis", city: "Washington D.C.", continent: "north_america", category: "civil", subCategory: "museum", year: 1976 },
  { id: "harvard-university", name: "Université Harvard", country: "États-Unis", city: "Cambridge", continent: "north_america", category: "civil", subCategory: "library", year: 1636 },
  { id: "pentagon-memorial", name: "Mémorial du Pentagone", country: "États-Unis", city: "Arlington", continent: "north_america", category: "monument", subCategory: "memorial", year: 2008 },
  { id: "musee-de-young-san-francisco", name: "Musée de Young de San Francisco", country: "États-Unis", city: "San Francisco", continent: "north_america", category: "civil", subCategory: "museum", year: 2005, architect: "Herzog & de Meuron" },
  { id: "san-francisco-city-hall", name: "Hôtel de Ville de San Francisco", country: "États-Unis", city: "San Francisco", continent: "north_america", category: "civil", subCategory: "town_hall", year: 1915 },
  { id: "universite-notre-dame", name: "Université Notre-Dame", country: "États-Unis", city: "South Bend", continent: "north_america", category: "religious", subCategory: "church", year: 1879 },
  { id: "fremont-street", name: "Experience Fremont Street", country: "États-Unis", city: "Las Vegas", continent: "north_america", category: "civil", subCategory: "theatre", year: 1995 },
  { id: "memphis-pyramid", name: "Pyramide de Memphis", country: "États-Unis", city: "Memphis", continent: "north_america", category: "civil", subCategory: "stadium", year: 1991 },
];
