// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import type { MonumentInput } from "@/types";

export const southAmericaMonuments: MonumentInput[] = [
  // Peru — Inca & Ancient
  { id: "machu-picchu", name: "Machu Picchu", country: "Pérou", city: "Cuzco", continent: "south_america", category: "ancient", subCategory: "ancient_city", year: 1450, unesco: true },
  { id: "coricancha", name: "Coricancha", country: "Pérou", city: "Cuzco", continent: "south_america", category: "ancient", subCategory: "ancient_temple", year: 1438 },
  { id: "sacsayhuaman", name: "Sacsayhuamán", country: "Pérou", city: "Cuzco", continent: "south_america", category: "fortification", subCategory: "citadel", year: 1438, unesco: true },
  { id: "lignes-de-nazca", name: "Lignes de Nazca", country: "Pérou", city: "Nazca", continent: "south_america", category: "ancient", subCategory: "archaeological_site", year: "300 av. J.-C. – 800 ap. J.-C.", unesco: true },
  { id: "chan-chan", name: "Chan Chan", country: "Pérou", city: "Trujillo", continent: "south_america", category: "ancient", subCategory: "ancient_city", year: 900, unesco: true },
  { id: "huaca-del-sol", name: "Huaca del Sol", country: "Pérou", city: "Trujillo", continent: "south_america", category: "ancient", subCategory: "pyramid", year: 100 },
  { id: "cathedrale-de-lima", name: "Cathédrale de Lima", country: "Pérou", city: "Lima", continent: "south_america", category: "religious", subCategory: "cathedral", year: 1649 },

  // Brazil
  { id: "christ-redempteur", name: "Christ Rédempteur", country: "Brésil", city: "Rio de Janeiro", continent: "south_america", category: "monument", subCategory: "statue", year: 1931, architect: "Paul Landowski" },
  { id: "pain-de-sucre", name: "Rocher du Pain de Sucre", country: "Brésil", city: "Rio de Janeiro", continent: "south_america", category: "natural", subCategory: "mountain" },
  { id: "cathedrale-metropolitaine-rio", name: "Cathédrale métropolitaine de Rio", country: "Brésil", city: "Rio de Janeiro", continent: "south_america", category: "religious", subCategory: "cathedral", year: 1979, architect: "Edgar de Oliveira da Fonseca" },
  { id: "theatre-amazonas", name: "Théâtre Amazonas", country: "Brésil", city: "Manaus", continent: "south_america", category: "civil", subCategory: "opera", year: 1896 },
  { id: "inhotim", name: "Institut Inhotim", country: "Brésil", city: "Brumadinho", continent: "south_america", category: "civil", subCategory: "museum", year: 2006 },
  { id: "pelourinho-salvador", name: "Pelourinho", country: "Brésil", city: "Salvador", continent: "south_america", category: "ancient", subCategory: "ancient_city", year: "XVIIe siècle", unesco: true },
  { id: "ponte-juscelino-kubitschek", name: "Pont Juscelino Kubitschek", country: "Brésil", city: "Brasília", continent: "south_america", category: "civil", subCategory: "bridge", year: 2002, architect: "Alexandre Chan" },

  // Argentina
  { id: "obelisque-buenos-aires", name: "Obélisque de Buenos Aires", country: "Argentine", city: "Buenos Aires", continent: "south_america", category: "monument", subCategory: "obelisk", year: 1936, architect: "Alberto Prebisch" },
  { id: "casa-rosada", name: "Casa Rosada", country: "Argentine", city: "Buenos Aires", continent: "south_america", category: "palace", subCategory: "palace", year: 1898 },
  { id: "theatre-colon-buenos-aires", name: "Théâtre Colón", country: "Argentine", city: "Buenos Aires", continent: "south_america", category: "civil", subCategory: "opera", year: 1908 },
  { id: "cathedrale-metropolitaine-ba", name: "Cathédrale métropolitaine de Buenos Aires", country: "Argentine", city: "Buenos Aires", continent: "south_america", category: "religious", subCategory: "cathedral", year: 1827 },
  { id: "perito-moreno", name: "Glacier Perito Moreno", country: "Argentine", city: "El Calafate", continent: "south_america", category: "natural", subCategory: "glacier", unesco: true },
  { id: "iguazu-falls-argentina", name: "Chutes d'Iguaçu (côté argentin)", country: "Argentine", city: "Puerto Iguazú", continent: "south_america", category: "natural", subCategory: "waterfall", unesco: true },

  // Chile
  { id: "moai-ile-de-paques", name: "Moaï de l'île de Pâques", country: "Chili", city: "Île de Pâques", continent: "south_america", category: "ancient", subCategory: "megalith", year: "1250–1500", unesco: true },
  { id: "gran-torre-santiago", name: "Gran Torre Santiago", country: "Chili", city: "Santiago", continent: "south_america", category: "tower", subCategory: "skyscraper", year: 2013, architect: "César Pelli" },
  { id: "palacio-de-la-moneda", name: "Palais de La Moneda", country: "Chili", city: "Santiago", continent: "south_america", category: "palace", subCategory: "palace", year: 1805, architect: "Joaquín Toesca" },
  { id: "fort-valdivia", name: "Forts coloniaux de Valdivia", country: "Chili", city: "Valdivia", continent: "south_america", category: "fortification", subCategory: "fortress", year: "XVIIe siècle", unesco: true },

  // Colombia
  { id: "ciudad-perdida", name: "Cité Perdue (Ciudad Perdida)", country: "Colombie", city: "Santa Marta", continent: "south_america", category: "ancient", subCategory: "ancient_city", year: 800 },
  { id: "cathedrale-de-sel-zipaquira", name: "Cathédrale de Sel de Zipaquirá", country: "Colombie", city: "Zipaquirá", continent: "south_america", category: "religious", subCategory: "cathedral", year: 1995 },
  { id: "fort-san-felipe-carthagene", name: "Fort San Felipe de Barajas", country: "Colombie", city: "Carthagène", continent: "south_america", category: "fortification", subCategory: "fortress", year: 1657, unesco: true },
  { id: "murailles-de-carthagene", name: "Murailles de Carthagène", country: "Colombie", city: "Carthagène", continent: "south_america", category: "fortification", subCategory: "city_wall", year: 1688, unesco: true },

  // Bolivia
  { id: "tiwanaku", name: "Tiwanaku", country: "Bolivie", city: "Tiwanaku", continent: "south_america", category: "ancient", subCategory: "ancient_city", year: "500–900", unesco: true },
  { id: "porte-du-soleil", name: "Porte du Soleil", country: "Bolivie", city: "Tiwanaku", continent: "south_america", category: "ancient", subCategory: "megalith", year: 700, unesco: true },
  { id: "cerro-rico-potosi", name: "Cerro Rico de Potosí", country: "Bolivie", city: "Potosí", continent: "south_america", category: "natural", subCategory: "mountain", unesco: true },

  // Ecuador
  { id: "mitad-del-mundo", name: "Monument de la Mitad del Mundo", country: "Équateur", city: "Quito", continent: "south_america", category: "monument", subCategory: "memorial", year: 1982 },
  { id: "cathedrale-metropolitaine-quito", name: "Cathédrale métropolitaine de Quito", country: "Équateur", city: "Quito", continent: "south_america", category: "religious", subCategory: "cathedral", year: 1565, unesco: true },
  { id: "eglise-de-la-compagnie-de-jesus-quito", name: "Église de la Compagnie de Jésus", country: "Équateur", city: "Quito", continent: "south_america", category: "religious", subCategory: "church", year: 1765, unesco: true },

  // Venezuela
  { id: "angel-falls", name: "Chute Angel (Salto Ángel)", country: "Venezuela", city: "Canaima", continent: "south_america", category: "natural", subCategory: "waterfall", unesco: true },

  // Uruguay
  { id: "teatro-solis", name: "Théâtre Solís", country: "Uruguay", city: "Montevideo", continent: "south_america", category: "civil", subCategory: "opera", year: 1856 },

  // Paraguay
  { id: "ruines-jesuites-trinidad", name: "Ruines jésuites de Trinidad", country: "Paraguay", city: "Encarnación", continent: "south_america", category: "ancient", subCategory: "archaeological_site", year: 1706, unesco: true },
];
