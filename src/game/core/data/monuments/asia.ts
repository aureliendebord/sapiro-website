// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import type { MonumentInput } from "@/types";

export const asiaMonuments: MonumentInput[] = [
  // India
  { id: "taj-mahal", name: "Taj Mahal", country: "Inde", city: "Agra", continent: "asia", category: "funerary", subCategory: "mausoleum", year: "1632-1653", unesco: true },
  { id: "cite-interdite", name: "Cité Interdite", country: "Chine", city: "Pékin", continent: "asia", category: "palace", subCategory: "palace", year: "1406-1420", unesco: true },
  { id: "grande-muraille-de-chine", name: "Grande Muraille de Chine", country: "Chine", city: "Badaling", continent: "asia", category: "fortification", subCategory: "city_wall", year: "VIIe siècle av. J.-C. – XVIIe siècle", unesco: true },
  { id: "qutb-minar", name: "Qutb Minar", country: "Inde", city: "Delhi", continent: "asia", category: "tower", subCategory: "minaret", year: "1193", unesco: true },
  { id: "hawa-mahal", name: "Hawa Mahal", country: "Inde", city: "Jaipur", continent: "asia", category: "palace", subCategory: "palace", year: 1799 },
  { id: "fort-rouge", name: "Fort Rouge", country: "Inde", city: "Delhi", continent: "asia", category: "fortification", subCategory: "fortress", year: "1639-1648", unesco: true },
  { id: "temple-or-amritsar", name: "Temple d'Or", country: "Inde", city: "Amritsar", continent: "asia", category: "religious", subCategory: "temple", year: "1588-1604" },
  { id: "khajuraho", name: "Temples de Khajuraho", country: "Inde", city: "Khajuraho", continent: "asia", category: "religious", subCategory: "temple", year: "XIIe siècle", unesco: true },
  { id: "stupa-sanchi", name: "Grand Stupa de Sanchi", country: "Inde", city: "Sanchi", continent: "asia", category: "religious", subCategory: "temple", year: "IIIe siècle av. J.-C.", unesco: true },
  { id: "hampi", name: "Ruines de Hampi", country: "Inde", city: "Hampi", continent: "asia", category: "ancient", subCategory: "ancient_city", year: "XIVe-XVIe siècle", unesco: true },
  { id: "mysore-palace", name: "Palais de Mysore", country: "Inde", city: "Mysore", continent: "asia", category: "palace", subCategory: "palace", year: 1912 },

  // China
  { id: "temple-du-ciel", name: "Temple du Ciel", country: "Chine", city: "Pékin", continent: "asia", category: "religious", subCategory: "temple", year: "1406-1420", unesco: true },
  { id: "armee-terracotta", name: "Armée de terre cuite", country: "Chine", city: "Xi'an", continent: "asia", category: "ancient", subCategory: "archaeological_site", year: "IIIe siècle av. J.-C.", unesco: true },
  { id: "bouddha-leshan", name: "Grand Bouddha de Leshan", country: "Chine", city: "Leshan", continent: "asia", category: "monument", subCategory: "statue", year: "VIIIe siècle", unesco: true },
  { id: "palais-d-ete", name: "Palais d'Été", country: "Chine", city: "Pékin", continent: "asia", category: "palace", subCategory: "palace", year: 1750, unesco: true },
  { id: "tour-shanghai", name: "Tour de Shanghai", country: "Chine", city: "Shanghai", continent: "asia", category: "tower", subCategory: "skyscraper", year: 2015 },
  { id: "tour-perle-orient", name: "Tour de la Perle d'Orient", country: "Chine", city: "Shanghai", continent: "asia", category: "tower", subCategory: "observation_tower", year: 1994 },
  { id: "potala-palace", name: "Palais du Potala", country: "Chine", city: "Lhassa", continent: "asia", category: "palace", subCategory: "palace", year: "637-1694", unesco: true },
  { id: "pagode-wild-goose", name: "Grande Pagode de l'Oie Sauvage", country: "Chine", city: "Xi'an", continent: "asia", category: "religious", subCategory: "pagoda", year: 652, unesco: true },
  { id: "mont-wudang", name: "Temples du Mont Wudang", country: "Chine", city: "Wudang", continent: "asia", category: "religious", subCategory: "temple", year: "XIVe siècle", unesco: true },
  { id: "cite-pingyao", name: "Vieille Ville de Pingyao", country: "Chine", city: "Pingyao", continent: "asia", category: "fortification", subCategory: "city_wall", year: "XVIIe siècle", unesco: true },

  // Japan
  { id: "mont-fuji", name: "Mont Fuji", country: "Japon", city: "Fujinomiya", continent: "asia", category: "natural", subCategory: "volcano", unesco: true },
  { id: "torii-miyajima", name: "Torii de Miyajima", country: "Japon", city: "Miyajima", continent: "asia", category: "religious", subCategory: "shrine", year: "593", unesco: true },
  { id: "temple-kinkakuji", name: "Kinkaku-ji (Pavillon d'Or)", country: "Japon", city: "Kyoto", continent: "asia", category: "religious", subCategory: "temple", year: 1397, unesco: true },
  { id: "temple-sensoji", name: "Temple Senso-ji", country: "Japon", city: "Tokyo", continent: "asia", category: "religious", subCategory: "temple", year: 645 },
  { id: "chateau-himeji", name: "Château d'Himeji", country: "Japon", city: "Himeji", continent: "asia", category: "fortification", subCategory: "castle", year: 1601, unesco: true },
  { id: "sanctuaire-fushimi-inari", name: "Sanctuaire Fushimi Inari", country: "Japon", city: "Kyoto", continent: "asia", category: "religious", subCategory: "shrine", year: 711 },
  { id: "temple-ginkakuji", name: "Ginkaku-ji (Pavillon d'Argent)", country: "Japon", city: "Kyoto", continent: "asia", category: "religious", subCategory: "temple", year: 1482, unesco: true },
  { id: "tour-tokyo", name: "Tour de Tokyo", country: "Japon", city: "Tokyo", continent: "asia", category: "tower", subCategory: "observation_tower", year: 1958 },
  { id: "tokyo-skytree", name: "Tokyo Skytree", country: "Japon", city: "Tokyo", continent: "asia", category: "tower", subCategory: "observation_tower", year: 2012 },
  { id: "nara-daibutsu", name: "Grand Bouddha de Nara", country: "Japon", city: "Nara", continent: "asia", category: "religious", subCategory: "temple", year: 745, unesco: true },
  { id: "chateau-osaka", name: "Château d'Osaka", country: "Japon", city: "Osaka", continent: "asia", category: "fortification", subCategory: "castle", year: 1583 },

  // Southeast Asia — Cambodia
  { id: "angkor-vat", name: "Angkor Vat", country: "Cambodge", city: "Siem Reap", continent: "asia", category: "religious", subCategory: "temple", year: "1113-1150", unesco: true },
  { id: "bayon", name: "Temple Bayon", country: "Cambodge", city: "Siem Reap", continent: "asia", category: "religious", subCategory: "temple", year: "fin XIIe siècle", unesco: true },
  { id: "ta-prohm", name: "Ta Prohm", country: "Cambodge", city: "Siem Reap", continent: "asia", category: "ancient", subCategory: "ancient_temple", year: 1186, unesco: true },

  // Thailand
  { id: "wat-phra-kaew", name: "Wat Phra Kaew", country: "Thaïlande", city: "Bangkok", continent: "asia", category: "religious", subCategory: "temple", year: 1784 },
  { id: "wat-arun", name: "Wat Arun", country: "Thaïlande", city: "Bangkok", continent: "asia", category: "religious", subCategory: "pagoda", year: "XVIIe siècle" },
  { id: "bouddha-couche-wat-pho", name: "Grand Bouddha Couché de Wat Pho", country: "Thaïlande", city: "Bangkok", continent: "asia", category: "religious", subCategory: "temple", year: 1832 },
  { id: "ayutthaya", name: "Ruines d'Ayutthaya", country: "Thaïlande", city: "Ayutthaya", continent: "asia", category: "ancient", subCategory: "ancient_city", year: "XIVe-XVIIIe siècle", unesco: true },
  { id: "phimai", name: "Temple de Phimai", country: "Thaïlande", city: "Phimai", continent: "asia", category: "religious", subCategory: "temple", year: "XIe-XIIe siècle" },

  // Vietnam
  { id: "bai-dinh", name: "Pagode de Bai Dinh", country: "Viêt Nam", city: "Ninh Binh", continent: "asia", category: "religious", subCategory: "pagoda", year: 2010 },
  { id: "hue-citadelle", name: "Citadelle de Hué", country: "Viêt Nam", city: "Hué", continent: "asia", category: "fortification", subCategory: "citadel", year: "1804-1833", unesco: true },
  { id: "my-son", name: "Sanctuaire de My Son", country: "Viêt Nam", city: "Duy Xuyen", continent: "asia", category: "religious", subCategory: "temple", year: "IVe-XIIIe siècle", unesco: true },
  { id: "hoi-an", name: "Vieille Ville de Hoi An", country: "Viêt Nam", city: "Hoi An", continent: "asia", category: "ancient", subCategory: "ancient_city", year: "XVe-XIXe siècle", unesco: true },

  // Indonesia
  { id: "borobudur", name: "Borobudur", country: "Indonésie", city: "Magelang", continent: "asia", category: "religious", subCategory: "temple", year: "VIIIe-IXe siècle", unesco: true },
  { id: "prambanan", name: "Temple de Prambanan", country: "Indonésie", city: "Yogyakarta", continent: "asia", category: "religious", subCategory: "temple", year: "IXe siècle", unesco: true },

  // Myanmar
  { id: "shwedagon", name: "Pagode Shwedagon", country: "Myanmar", city: "Rangoun", continent: "asia", category: "religious", subCategory: "pagoda", year: "Ve-VIe siècle" },
  { id: "bagan", name: "Temples de Bagan", country: "Myanmar", city: "Bagan", continent: "asia", category: "religious", subCategory: "temple", year: "IXe-XIIIe siècle", unesco: true },

  // Malaysia
  { id: "tour-kl", name: "Tour de Kuala Lumpur", country: "Malaisie", city: "Kuala Lumpur", continent: "asia", category: "tower", subCategory: "observation_tower", year: 1996 },

  // Singapore
  { id: "marina-bay-sands", name: "Marina Bay Sands", country: "Singapour", city: "Singapour", continent: "asia", category: "civil", subCategory: "museum", year: 2010, architect: "Moshe Safdie" },
  { id: "merlion", name: "Merlion", country: "Singapour", city: "Singapour", continent: "asia", category: "monument", subCategory: "statue", year: 1972 },

  // Philippines
  { id: "chocolate-hills", name: "Collines de Chocolat", country: "Philippines", city: "Bohol", continent: "asia", category: "natural", subCategory: "rock_formation" },

  // South Korea
  { id: "gyeongbokgung", name: "Palais Gyeongbokgung", country: "Corée du Sud", city: "Séoul", continent: "asia", category: "palace", subCategory: "palace", year: 1395 },
  { id: "bulguksa", name: "Temple Bulguksa", country: "Corée du Sud", city: "Gyeongju", continent: "asia", category: "religious", subCategory: "temple", year: 528, unesco: true },
  { id: "suwon-hwaseong", name: "Forteresse de Hwaseong", country: "Corée du Sud", city: "Suwon", continent: "asia", category: "fortification", subCategory: "fortress", year: "1794-1796", unesco: true },
  { id: "haeinsa", name: "Temple Haeinsa", country: "Corée du Sud", city: "Hapcheon", continent: "asia", category: "religious", subCategory: "monastery", year: 802, unesco: true },
  { id: "changdeokgung", name: "Palais Changdeokgung", country: "Corée du Sud", city: "Séoul", continent: "asia", category: "palace", subCategory: "palace", year: 1405, unesco: true },

  // Nepal
  { id: "boudhanath", name: "Stupa de Boudhanath", country: "Népal", city: "Katmandou", continent: "asia", category: "religious", subCategory: "temple", year: "Ve siècle", unesco: true },
  { id: "pashupatinath", name: "Temple de Pashupatinath", country: "Népal", city: "Katmandou", continent: "asia", category: "religious", subCategory: "temple", year: "VIIe siècle", unesco: true },
  { id: "swayambhunath", name: "Stupa de Swayambhunath", country: "Népal", city: "Katmandou", continent: "asia", category: "religious", subCategory: "temple", year: "Ve siècle", unesco: true },

  // Sri Lanka
  { id: "sigiriya", name: "Rocher de Sigiriya", country: "Sri Lanka", city: "Sigiriya", continent: "asia", category: "ancient", subCategory: "archaeological_site", year: "Ve siècle", unesco: true },
  { id: "temple-dent-kandy", name: "Temple de la Dent Sacrée", country: "Sri Lanka", city: "Kandy", continent: "asia", category: "religious", subCategory: "temple", year: "XVIIe siècle", unesco: true },

  // Pakistan
  { id: "mohenjo-daro", name: "Mohenjo-daro", country: "Pakistan", city: "Larkana", continent: "asia", category: "ancient", subCategory: "ancient_city", year: "XXVIe siècle av. J.-C.", unesco: true },
  { id: "badshahi-mosque", name: "Mosquée Badshahi", country: "Pakistan", city: "Lahore", continent: "asia", category: "religious", subCategory: "mosque", year: "1671-1673" },
  { id: "lahore-fort", name: "Fort de Lahore", country: "Pakistan", city: "Lahore", continent: "asia", category: "fortification", subCategory: "citadel", year: "XVIe siècle", unesco: true },

  // Turkey (Middle East)
  { id: "sainte-sophie", name: "Sainte-Sophie", country: "Turquie", city: "Istanbul", continent: "asia", category: "religious", subCategory: "mosque", year: "532-537", architect: "Isidore de Milet & Anthémius de Tralles", unesco: true },
  { id: "mosquee-bleue", name: "Mosquée Bleue", country: "Turquie", city: "Istanbul", continent: "asia", category: "religious", subCategory: "mosque", year: "1609-1616", architect: "Sedefkar Mehmed Agha" },
  { id: "ephese", name: "Ruines d'Éphèse", country: "Turquie", city: "Selçuk", continent: "asia", category: "ancient", subCategory: "ancient_city", year: "IVe siècle av. J.-C.", unesco: true },
  { id: "cappadoce", name: "Cheminées de fées de Cappadoce", country: "Turquie", city: "Göreme", continent: "asia", category: "natural", subCategory: "rock_formation", unesco: true },
  { id: "topkapi", name: "Palais de Topkapi", country: "Turquie", city: "Istanbul", continent: "asia", category: "palace", subCategory: "palace", year: "1459-1465", unesco: true },

  // Iran
  { id: "mosquee-imam-isfahan", name: "Mosquée de l'Imam d'Ispahan", country: "Iran", city: "Ispahan", continent: "asia", category: "religious", subCategory: "mosque", year: "1611-1629", unesco: true },
  { id: "place-naqsh-e-jahan", name: "Place Naqsh-e Jahan", country: "Iran", city: "Ispahan", continent: "asia", category: "civil", subCategory: "town_hall", year: "1598-1629", unesco: true },
  { id: "tchogha-zanbil", name: "Tchogha Zanbil", country: "Iran", city: "Shush", continent: "asia", category: "ancient", subCategory: "ancient_temple", year: "1250 av. J.-C.", unesco: true },
  { id: "pasargades", name: "Pasargades", country: "Iran", city: "Pasargades", continent: "asia", category: "ancient", subCategory: "ancient_city", year: "VIe siècle av. J.-C.", unesco: true },

  // Jordan
  { id: "petra", name: "Pétra", country: "Jordanie", city: "Wadi Musa", continent: "asia", category: "ancient", subCategory: "ancient_city", year: "IVe siècle av. J.-C.", unesco: true },

  // Israel
  { id: "dome-rocher", name: "Dôme du Rocher", country: "Israël", city: "Jérusalem", continent: "asia", category: "religious", subCategory: "mosque", year: "688-692" },
  { id: "mur-lamentation", name: "Mur des Lamentations", country: "Israël", city: "Jérusalem", continent: "asia", category: "religious", subCategory: "synagogue", year: "37-4 av. J.-C." },
  { id: "yad-vashem", name: "Yad Vashem", country: "Israël", city: "Jérusalem", continent: "asia", category: "monument", subCategory: "memorial", year: 1953 },

  // Saudi Arabia
  { id: "masjid-al-haram", name: "Masjid al-Haram", country: "Arabie Saoudite", city: "La Mecque", continent: "asia", category: "religious", subCategory: "mosque", year: "631" },
  { id: "hegra", name: "Hégra (Madain Salih)", country: "Arabie Saoudite", city: "Al-Ula", continent: "asia", category: "ancient", subCategory: "necropolis", year: "Ier siècle av. J.-C.", unesco: true },

  // UAE
  { id: "burj-khalifa", name: "Burj Khalifa", country: "Émirats arabes unis", city: "Dubaï", continent: "asia", category: "tower", subCategory: "skyscraper", year: 2010, architect: "Adrian Smith" },
  { id: "burj-al-arab", name: "Burj Al Arab", country: "Émirats arabes unis", city: "Dubaï", continent: "asia", category: "civil", subCategory: "museum", year: 1999, architect: "Tom Wright" },
  { id: "mosquee-cheikh-zayed", name: "Mosquée Cheikh Zayed", country: "Émirats arabes unis", city: "Abu Dhabi", continent: "asia", category: "religious", subCategory: "mosque", year: 2007 },
  { id: "palm-jumeirah", name: "Palm Jumeirah", country: "Émirats arabes unis", city: "Dubaï", continent: "asia", category: "civil", subCategory: "bridge", year: 2006 },
  { id: "museum-future", name: "Musée du Futur", country: "Émirats arabes unis", city: "Dubaï", continent: "asia", category: "civil", subCategory: "museum", year: 2022 },

  // Iraq
  { id: "ziggurat-ur", name: "Ziggurat d'Ur", country: "Irak", city: "Nassiriya", continent: "asia", category: "ancient", subCategory: "ancient_temple", year: "2100 av. J.-C." },
  { id: "ctesiphon", name: "Arc de Ctésiphon", country: "Irak", city: "Ctésiphon", continent: "asia", category: "ancient", subCategory: "arch", year: "IIIe-VIe siècle" },

  // Lebanon
  { id: "baalbek", name: "Baalbek", country: "Liban", city: "Baalbek", continent: "asia", category: "ancient", subCategory: "ancient_temple", year: "IIe-IIIe siècle", unesco: true },

  // Oman
  { id: "fort-bahla", name: "Fort de Bahla", country: "Oman", city: "Bahla", continent: "asia", category: "fortification", subCategory: "fortress", year: "XVIIe siècle", unesco: true },

  // Central Asia
  { id: "registan-samarkand", name: "Registan de Samarkand", country: "Ouzbékistan", city: "Samarkand", continent: "asia", category: "religious", subCategory: "mosque", year: "1370-1660", unesco: true },
  { id: "mausolee-tamerlan", name: "Mausolée de Tamerlan (Gur-e-Amir)", country: "Ouzbékistan", city: "Samarkand", continent: "asia", category: "funerary", subCategory: "mausoleum", year: "1403-1404", unesco: true },
  { id: "kalon-minaret", name: "Minaret Kalon", country: "Ouzbékistan", city: "Boukhara", continent: "asia", category: "tower", subCategory: "minaret", year: 1127, unesco: true },

  // Mongolia
  { id: "erdene-zuu", name: "Monastère Erdene Zuu", country: "Mongolie", city: "Kharkhorin", continent: "asia", category: "religious", subCategory: "monastery", year: 1586, unesco: true },

  // Hong Kong
  { id: "tian-tan-buddha", name: "Grand Bouddha de Tian Tan", country: "Chine", city: "Hong Kong", continent: "asia", category: "monument", subCategory: "statue", year: 1993 },

  // Taiwan
  { id: "taipei-101", name: "Taipei 101", country: "Taïwan", city: "Taipei", continent: "asia", category: "tower", subCategory: "skyscraper", year: 2004 },

  // Macao
  { id: "ruines-saint-paul-macao", name: "Ruines de Saint-Paul de Macao", country: "Chine", city: "Macao", continent: "asia", category: "ancient", subCategory: "archaeological_site", year: "1602-1640", unesco: true },

  // Bangladesh
  { id: "mosquee-baitul-mukarram", name: "Mosquée Baitul Mukarram", country: "Bangladesh", city: "Dhaka", continent: "asia", category: "religious", subCategory: "mosque", year: 1968 },
  { id: "shat-gombuj-mosque", name: "Mosquée des Soixante Dômes", country: "Bangladesh", city: "Bagerhat", continent: "asia", category: "religious", subCategory: "mosque", year: "XVe siècle", unesco: true },

  // Bhutan
  { id: "tigers-nest", name: "Monastère du Nid du Tigre (Paro Taktsang)", country: "Bhoutan", city: "Paro", continent: "asia", category: "religious", subCategory: "monastery", year: 1692 },

  // Afghanistan
  { id: "minaret-djam", name: "Minaret de Djam", country: "Afghanistan", city: "Djam", continent: "asia", category: "tower", subCategory: "minaret", year: "XIIe siècle", unesco: true },

  // Laos
  { id: "pha-that-luang", name: "Pha That Luang", country: "Laos", city: "Vientiane", continent: "asia", category: "religious", subCategory: "pagoda", year: "XVIe siècle" },
  { id: "vat-xiengthong", name: "Vat Xieng Thong", country: "Laos", city: "Luang Prabang", continent: "asia", category: "religious", subCategory: "temple", year: 1560, unesco: true },

  // Kazakhstan
  { id: "mausolee-khoja-ahmed-yasawi", name: "Mausolée de Khoja Ahmed Yasawi", country: "Kazakhstan", city: "Turkestan", continent: "asia", category: "funerary", subCategory: "mausoleum", year: "1389-1405", unesco: true },

  // North Korea
  { id: "juche-tower", name: "Tour du Juche", country: "Corée du Nord", city: "Pyongyang", continent: "asia", category: "tower", subCategory: "observation_tower", year: 1982 },

  // Syria
  { id: "krak-des-chevaliers", name: "Krak des Chevaliers", country: "Syrie", city: "Al-Hosn", continent: "asia", category: "fortification", subCategory: "fortress", year: "XIe-XIIIe siècle", unesco: true },
  { id: "palmyre", name: "Palmyre", country: "Syrie", city: "Palmyre", continent: "asia", category: "ancient", subCategory: "ancient_city", year: "Ier-IIIe siècle", unesco: true },

  // China (additional)
  { id: "longmen", name: "Grottes de Longmen", country: "Chine", city: "Luoyang", continent: "asia", category: "religious", subCategory: "temple", year: "VIe siècle", unesco: true },
  { id: "mogao", name: "Grottes de Mogao", country: "Chine", city: "Dunhuang", continent: "asia", category: "religious", subCategory: "temple", year: "IVe siècle", unesco: true },
  { id: "tian-anmen", name: "Place Tian'anmen", country: "Chine", city: "Pékin", continent: "asia", category: "monument", subCategory: "arch", year: 1651 },
  { id: "pont-luding", name: "Pont de Luding", country: "Chine", city: "Luding", continent: "asia", category: "civil", subCategory: "bridge", year: 1706 },
];
