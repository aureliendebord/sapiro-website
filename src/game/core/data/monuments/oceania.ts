// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import type { MonumentInput } from "@/types";

export const oceaniaMonuments: MonumentInput[] = [
  { id: "opera-de-sydney", name: "Opéra de Sydney", country: "Australie", city: "Sydney", continent: "oceania", category: "civil", subCategory: "opera", year: "1959-1973", architect: "Jørn Utzon", unesco: true },
  { id: "harbour-bridge-sydney", name: "Harbour Bridge", country: "Australie", city: "Sydney", continent: "oceania", category: "civil", subCategory: "bridge", year: "1924-1932" },
  { id: "uluru", name: "Uluru (Ayers Rock)", country: "Australie", city: "Territoire du Nord", continent: "oceania", category: "natural", subCategory: "rock_formation", unesco: true },
  { id: "douze-apotres", name: "Douze Apôtres", country: "Australie", city: "Victoria", continent: "oceania", category: "natural", subCategory: "rock_formation" },
  { id: "parliament-house-canberra", name: "Parlement d'Australie", country: "Australie", city: "Canberra", continent: "oceania", category: "civil", subCategory: "town_hall", year: 1988, architect: "Romaldo Giurgola" },
  { id: "australian-war-memorial", name: "Mémorial de Guerre Australien", country: "Australie", city: "Canberra", continent: "oceania", category: "monument", subCategory: "memorial", year: 1941 },
  { id: "shrine-of-remembrance-melbourne", name: "Sanctuaire du Souvenir", country: "Australie", city: "Melbourne", continent: "oceania", category: "monument", subCategory: "memorial", year: 1934 },
  { id: "queen-victoria-building-sydney", name: "Queen Victoria Building", country: "Australie", city: "Sydney", continent: "oceania", category: "civil", subCategory: "town_hall", year: 1898 },
  { id: "skytower-auckland", name: "Sky Tower", country: "Nouvelle-Zélande", city: "Auckland", continent: "oceania", category: "tower", subCategory: "observation_tower", year: 1997 },
  { id: "beehive-wellington", name: "La Ruche (Parlement de Wellington)", country: "Nouvelle-Zélande", city: "Wellington", continent: "oceania", category: "civil", subCategory: "town_hall", year: 1981, architect: "Basil Spence" },
  { id: "christ-church-cathedral-christchurch", name: "Cathédrale de Christchurch", country: "Nouvelle-Zélande", city: "Christchurch", continent: "oceania", category: "religious", subCategory: "cathedral", year: "1864-1904" },
  { id: "waitangi-treaty-grounds", name: "Site du Traité de Waitangi", country: "Nouvelle-Zélande", city: "Bay of Islands", continent: "oceania", category: "monument", subCategory: "memorial", year: 1840 },
  { id: "eden-park-auckland", name: "Eden Park", country: "Nouvelle-Zélande", city: "Auckland", continent: "oceania", category: "civil", subCategory: "stadium", year: 1900 },
  { id: "nan-madol", name: "Nan Madol", country: "Micronésie", city: "Pohnpei", continent: "oceania", category: "ancient", subCategory: "ancient_city", year: "1100-1628", unesco: true },
  { id: "fiji-parliament-suva", name: "Parlement des Fidji", country: "Fidji", city: "Suva", continent: "oceania", category: "civil", subCategory: "town_hall", year: 1992 },
  { id: "sacred-heart-cathedral-suva", name: "Cathédrale du Sacré-Cœur de Suva", country: "Fidji", city: "Suva", continent: "oceania", category: "religious", subCategory: "cathedral", year: 1902 },
  { id: "robert-louis-stevenson-museum-apia", name: "Musée Robert Louis Stevenson", country: "Samoa", city: "Apia", continent: "oceania", category: "civil", subCategory: "museum", year: 1891 },
  { id: "notre-dame-cathedrale-papeete", name: "Cathédrale Notre-Dame de Papeete", country: "Polynésie française", city: "Papeete", continent: "oceania", category: "religious", subCategory: "cathedral", year: 1875 },
  { id: "port-arthur-tasmania", name: "Pénitencier de Port Arthur", country: "Australie", city: "Tasmanie", continent: "oceania", category: "civil", subCategory: "museum", year: "1833-1877", unesco: true },
  { id: "st-patricks-cathedral-melbourne", name: "Cathédrale Saint-Patrick de Melbourne", country: "Australie", city: "Melbourne", continent: "oceania", category: "religious", subCategory: "cathedral", year: "1858-1939" },
];
