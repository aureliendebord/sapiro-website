// ⚠️  FICHIER SYNCHRONISÉ — NE PAS ÉDITER À LA MAIN.
// Source : repo de l'app mobile Sapiro. Régénérer avec `npm run sync:game`.
// Toute correction doit être faite dans l'app puis re-synchronisée.
import type { LangCode, LocalizedString } from "./countries";

export type NationalityCode = string;

/**
 * Dictionnaire des nationalités dans les 11 langues supportées.
 * Convention : forme féminine en FR (et autres langues genrées) — exemple
 * "Italienne" (FR), "Italian" (EN), "Italiana" (IT/ES), "Italiana" (PT).
 * Pour les nationalités liées à des entités politiques disparues, on les
 * marque historical: true pour les exclure des quiz de nationalité.
 */
export interface NationalityEntry extends LocalizedString {
  /** Si true, exclure des quiz de nationalité (entité politique disparue) */
  historical?: boolean;
}

export const NATIONALITY_CODES: Record<NationalityCode, NationalityEntry> = {
  // ─── A ───────────────────────────────────────────────────────────────────
  algerian: { fr: "Algérienne", en: "Algerian", es: "Argelina", de: "Algerisch", it: "Algerina", pt: "Argelina", nl: "Algerijns", ru: "Алжирка", ar: "جزائرية", zh: "阿尔及利亚人", hi: "अल्जीरियाई" },
  andalusian: { fr: "Andalouse", en: "Andalusi", es: "Andalusí", de: "Andalusisch", it: "Andalusa", pt: "Andalusi", nl: "Andalusisch", ru: "Андалуска", ar: "أندلسية", zh: "安达卢斯人", hi: "अंदलुसी", historical: true },
  angolan: { fr: "Angolaise", en: "Angolan", es: "Angoleña", de: "Angolanisch", it: "Angolana", pt: "Angolana", nl: "Angolees", ru: "Анголка", ar: "أنغولية", zh: "安哥拉人", hi: "अंगोलाई" },
  german: { fr: "Allemande", en: "German", es: "Alemana", de: "Deutsch", it: "Tedesca", pt: "Alemã", nl: "Duits", ru: "Немка", ar: "ألمانية", zh: "德国人", hi: "जर्मन" },
  american: { fr: "Américaine", en: "American", es: "Estadounidense", de: "Amerikanisch", it: "Americana", pt: "Americana", nl: "Amerikaans", ru: "Американка", ar: "أمريكية", zh: "美国人", hi: "अमेरिकी" },
  amerindian: { fr: "Amérindienne", en: "Amerindian", es: "Amerindia", de: "Indianisch", it: "Amerinda", pt: "Ameríndia", nl: "Indiaans", ru: "Индианка", ar: "هندية أمريكية", zh: "美洲原住民", hi: "अमेरिंडियन", historical: true },
  english: { fr: "Anglaise", en: "English", es: "Inglesa", de: "Englisch", it: "Inglese", pt: "Inglesa", nl: "Engels", ru: "Англичанка", ar: "إنجليزية", zh: "英格兰人", hi: "अंग्रेज़", historical: true },
  arab: { fr: "Arabe", en: "Arab", es: "Árabe", de: "Arabisch", it: "Araba", pt: "Árabe", nl: "Arabisch", ru: "Арабка", ar: "عربية", zh: "阿拉伯人", hi: "अरब", historical: true },
  argentine: { fr: "Argentine", en: "Argentine", es: "Argentina", de: "Argentinisch", it: "Argentina", pt: "Argentina", nl: "Argentijns", ru: "Аргентинка", ar: "أرجنتينية", zh: "阿根廷人", hi: "अर्जेंटीनी" },
  australian: { fr: "Australienne", en: "Australian", es: "Australiana", de: "Australisch", it: "Australiana", pt: "Australiana", nl: "Australisch", ru: "Австралийка", ar: "أسترالية", zh: "澳大利亚人", hi: "ऑस्ट्रेलियाई" },
  "austro-hungarian": { fr: "Austro-hongroise", en: "Austro-Hungarian", es: "Austrohúngara", de: "Österreichisch-Ungarisch", it: "Austro-ungarica", pt: "Austro-húngara", nl: "Oostenrijks-Hongaars", ru: "Австро-венгерка", ar: "نمساوية مجرية", zh: "奥匈帝国人", hi: "ऑस्ट्रो-हंगेरियन", historical: true },
  austrian: { fr: "Autrichienne", en: "Austrian", es: "Austriaca", de: "Österreichisch", it: "Austriaca", pt: "Austríaca", nl: "Oostenrijks", ru: "Австрийка", ar: "نمساوية", zh: "奥地利人", hi: "ऑस्ट्रियाई" },
  aztec: { fr: "Aztèque", en: "Aztec", es: "Azteca", de: "Aztekisch", it: "Azteca", pt: "Asteca", nl: "Azteeks", ru: "Ацтекка", ar: "أزتيكية", zh: "阿兹特克人", hi: "एज़्टेक", historical: true },

  // ─── B ───────────────────────────────────────────────────────────────────
  barbadian: { fr: "Barbadienne", en: "Barbadian", es: "Barbadense", de: "Barbadisch", it: "Barbadiana", pt: "Barbadiana", nl: "Barbadiaans", ru: "Барбадоска", ar: "بربادوسية", zh: "巴巴多斯人", hi: "बारबाडियन" },
  belgian: { fr: "Belge", en: "Belgian", es: "Belga", de: "Belgisch", it: "Belga", pt: "Belga", nl: "Belgisch", ru: "Бельгийка", ar: "بلجيكية", zh: "比利时人", hi: "बेल्जियाई" },
  burmese: { fr: "Birmane", en: "Burmese", es: "Birmana", de: "Birmanisch", it: "Birmana", pt: "Birmanesa", nl: "Birmaans", ru: "Бирманка", ar: "بورمية", zh: "缅甸人", hi: "बर्मी" },
  british: { fr: "Britannique", en: "British", es: "Británica", de: "Britisch", it: "Britannica", pt: "Britânica", nl: "Brits", ru: "Британка", ar: "بريطانية", zh: "英国人", hi: "ब्रिटिश" },
  brazilian: { fr: "Brésilienne", en: "Brazilian", es: "Brasileña", de: "Brasilianisch", it: "Brasiliana", pt: "Brasileira", nl: "Braziliaans", ru: "Бразильянка", ar: "برازيلية", zh: "巴西人", hi: "ब्राज़ीलियाई" },
  burkinabe: { fr: "Burkinabè", en: "Burkinabé", es: "Burkinesa", de: "Burkinisch", it: "Burkinabè", pt: "Burquinense", nl: "Burkinees", ru: "Буркинийка", ar: "بوركينية", zh: "布基纳法索人", hi: "बुर्किनाबे" },
  beninese: { fr: "Béninoise", en: "Beninese", es: "Beninesa", de: "Beninisch", it: "Beninese", pt: "Beninense", nl: "Benins", ru: "Бенинка", ar: "بنينية", zh: "贝宁人", hi: "बेनिनी" },
  byzantine: { fr: "Byzantine", en: "Byzantine", es: "Bizantina", de: "Byzantinisch", it: "Bizantina", pt: "Bizantina", nl: "Byzantijns", ru: "Византийка", ar: "بيزنطية", zh: "拜占庭人", hi: "बीजान्टिन", historical: true },

  // ─── C ───────────────────────────────────────────────────────────────────
  cameroonian: { fr: "Camerounaise", en: "Cameroonian", es: "Camerunesa", de: "Kamerunisch", it: "Camerunese", pt: "Camaronesa", nl: "Kameroens", ru: "Камерунка", ar: "كاميرونية", zh: "喀麦隆人", hi: "कैमरूनी" },
  canadian: { fr: "Canadienne", en: "Canadian", es: "Canadiense", de: "Kanadisch", it: "Canadese", pt: "Canadense", nl: "Canadees", ru: "Канадка", ar: "كندية", zh: "加拿大人", hi: "कनाडाई" },
  "cape-verdean": { fr: "Cap-verdienne", en: "Cape Verdean", es: "Caboverdiana", de: "Kapverdisch", it: "Capoverdiana", pt: "Cabo-verdiana", nl: "Kaapverdisch", ru: "Кабо-вердинка", ar: "رأس أخضرية", zh: "佛得角人", hi: "केप वर्डियन" },
  carthaginian: { fr: "Carthaginoise", en: "Carthaginian", es: "Cartaginesa", de: "Karthagisch", it: "Cartaginese", pt: "Cartaginesa", nl: "Carthaags", ru: "Карфагенянка", ar: "قرطاجية", zh: "迦太基人", hi: "कार्थागिनियन", historical: true },
  chilean: { fr: "Chilienne", en: "Chilean", es: "Chilena", de: "Chilenisch", it: "Cilena", pt: "Chilena", nl: "Chileens", ru: "Чилийка", ar: "تشيلية", zh: "智利人", hi: "चिली" },
  chinese: { fr: "Chinoise", en: "Chinese", es: "China", de: "Chinesisch", it: "Cinese", pt: "Chinesa", nl: "Chinees", ru: "Китаянка", ar: "صينية", zh: "中国人", hi: "चीनी" },
  colombian: { fr: "Colombienne", en: "Colombian", es: "Colombiana", de: "Kolumbianisch", it: "Colombiana", pt: "Colombiana", nl: "Colombiaans", ru: "Колумбийка", ar: "كولومبية", zh: "哥伦比亚人", hi: "कोलंबियाई" },
  congolese: { fr: "Congolaise", en: "Congolese", es: "Congoleña", de: "Kongolesisch", it: "Congolese", pt: "Congolesa", nl: "Congolees", ru: "Конголезка", ar: "كونغولية", zh: "刚果人", hi: "कांगोली" },
  korean: { fr: "Coréenne", en: "Korean", es: "Coreana", de: "Koreanisch", it: "Coreana", pt: "Coreana", nl: "Koreaans", ru: "Кореянка", ar: "كورية", zh: "朝鲜人", hi: "कोरियाई", historical: true },
  cuban: { fr: "Cubaine", en: "Cuban", es: "Cubana", de: "Kubanisch", it: "Cubana", pt: "Cubana", nl: "Cubaans", ru: "Кубинка", ar: "كوبية", zh: "古巴人", hi: "क्यूबाई" },
  czech: { fr: "Tchèque", en: "Czech", es: "Checa", de: "Tschechisch", it: "Ceca", pt: "Tcheca", nl: "Tsjechisch", ru: "Чешка", ar: "تشيكية", zh: "捷克人", hi: "चेक" },

  // ─── D ───────────────────────────────────────────────────────────────────
  danish: { fr: "Danoise", en: "Danish", es: "Danesa", de: "Dänisch", it: "Danese", pt: "Dinamarquesa", nl: "Deens", ru: "Датчанка", ar: "دنماركية", zh: "丹麦人", hi: "डेनिश" },

  // ─── E ───────────────────────────────────────────────────────────────────
  spanish: { fr: "Espagnole", en: "Spanish", es: "Española", de: "Spanisch", it: "Spagnola", pt: "Espanhola", nl: "Spaans", ru: "Испанка", ar: "إسبانية", zh: "西班牙人", hi: "स्पेनी" },

  // ─── F ───────────────────────────────────────────────────────────────────
  flemish: { fr: "Flamande", en: "Flemish", es: "Flamenca", de: "Flämisch", it: "Fiamminga", pt: "Flamenga", nl: "Vlaams", ru: "Фламандка", ar: "فلمنكية", zh: "佛兰德人", hi: "फ्लेमिश", historical: true },
  "franco-american": { fr: "Franco-américaine", en: "Franco-American", es: "Francoamericana", de: "Französisch-Amerikanisch", it: "Franco-americana", pt: "Franco-americana", nl: "Frans-Amerikaans", ru: "Франко-американка", ar: "فرنسية أمريكية", zh: "法裔美国人", hi: "फ्रांसीसी-अमेरिकी" },
  "franco-polish": { fr: "Franco-polonaise", en: "Franco-Polish", es: "Francopolaca", de: "Französisch-Polnisch", it: "Franco-polacca", pt: "Franco-polonesa", nl: "Frans-Pools", ru: "Франко-полька", ar: "فرنسية بولندية", zh: "法裔波兰人", hi: "फ्रांसीसी-पोलिश" },
  frankish: { fr: "Franque", en: "Frankish", es: "Franca", de: "Fränkisch", it: "Franca", pt: "Franca", nl: "Frankisch", ru: "Франка", ar: "فرنجية", zh: "法兰克人", hi: "फ्रैंकिश", historical: true },
  french: { fr: "Française", en: "French", es: "Francesa", de: "Französisch", it: "Francese", pt: "Francesa", nl: "Frans", ru: "Француженка", ar: "فرنسية", zh: "法国人", hi: "फ़्रांसीसी" },

  // ─── G ───────────────────────────────────────────────────────────────────
  gabonese: { fr: "Gabonaise", en: "Gabonese", es: "Gabonesa", de: "Gabunisch", it: "Gabonese", pt: "Gabonesa", nl: "Gabonees", ru: "Габонка", ar: "غابونية", zh: "加蓬人", hi: "गैबोनी" },
  ghanaian: { fr: "Ghanéenne", en: "Ghanaian", es: "Ghanesa", de: "Ghanaisch", it: "Ghanese", pt: "Ganesa", nl: "Ghanees", ru: "Ганка", ar: "غانية", zh: "加纳人", hi: "घानावासी" },
  greek: { fr: "Grecque", en: "Greek", es: "Griega", de: "Griechisch", it: "Greca", pt: "Grega", nl: "Grieks", ru: "Гречанка", ar: "يونانية", zh: "希腊人", hi: "यूनानी" },
  guinean: { fr: "Guinéenne", en: "Guinean", es: "Guineana", de: "Guineisch", it: "Guineana", pt: "Guineense", nl: "Guinees", ru: "Гвинейка", ar: "غينية", zh: "几内亚人", hi: "गिनीयाई" },
  genoese: { fr: "Génoise", en: "Genoese", es: "Genovesa", de: "Genuesisch", it: "Genovese", pt: "Genovesa", nl: "Genuees", ru: "Генуэзка", ar: "جنوية", zh: "热那亚人", hi: "जेनोइस", historical: true },

  // ─── H ───────────────────────────────────────────────────────────────────
  haitian: { fr: "Haïtienne", en: "Haitian", es: "Haitiana", de: "Haitianisch", it: "Haitiana", pt: "Haitiana", nl: "Haïtiaans", ru: "Гаитянка", ar: "هايتية", zh: "海地人", hi: "हैतियाई" },
  hawaiian: { fr: "Hawaïenne", en: "Hawaiian", es: "Hawaiana", de: "Hawaiianisch", it: "Hawaiana", pt: "Havaiana", nl: "Hawaïaans", ru: "Гавайка", ar: "هاوايية", zh: "夏威夷人", hi: "हवाईयन", historical: true },
  hunnic: { fr: "Hunnique", en: "Hunnic", es: "Huna", de: "Hunnisch", it: "Unna", pt: "Huna", nl: "Hunnisch", ru: "Гуннка", ar: "هونية", zh: "匈人", hi: "हूण", historical: true },

  // ─── I ───────────────────────────────────────────────────────────────────
  inca: { fr: "Inca", en: "Inca", es: "Inca", de: "Inka", it: "Inca", pt: "Inca", nl: "Inca", ru: "Инка", ar: "إنكا", zh: "印加人", hi: "इंका", historical: true },
  indian: { fr: "Indienne", en: "Indian", es: "India", de: "Indisch", it: "Indiana", pt: "Indiana", nl: "Indiaas", ru: "Индианка", ar: "هندية", zh: "印度人", hi: "भारतीय" },
  "iraqi-british": { fr: "Irako-britannique", en: "Iraqi-British", es: "Iraquí-británica", de: "Irakisch-Britisch", it: "Irachena-britannica", pt: "Iraquiano-britânica", nl: "Iraaks-Brits", ru: "Иракско-британка", ar: "عراقية بريطانية", zh: "伊拉克裔英国人", hi: "इराकी-ब्रिटिश" },
  iranian: { fr: "Iranienne", en: "Iranian", es: "Iraní", de: "Iranisch", it: "Iraniana", pt: "Iraniana", nl: "Iraans", ru: "Иранка", ar: "إيرانية", zh: "伊朗人", hi: "ईरानी" },
  irish: { fr: "Irlandaise", en: "Irish", es: "Irlandesa", de: "Irisch", it: "Irlandese", pt: "Irlandesa", nl: "Iers", ru: "Ирландка", ar: "أيرلندية", zh: "爱尔兰人", hi: "आयरिश" },
  icelandic: { fr: "Islandaise", en: "Icelandic", es: "Islandesa", de: "Isländisch", it: "Islandese", pt: "Islandesa", nl: "IJslands", ru: "Исландка", ar: "آيسلندية", zh: "冰岛人", hi: "आइसलैंडिक" },
  israeli: { fr: "Israélienne", en: "Israeli", es: "Israelí", de: "Israelisch", it: "Israeliana", pt: "Israelense", nl: "Israëlisch", ru: "Израильтянка", ar: "إسرائيلية", zh: "以色列人", hi: "इज़राइली" },
  italian: { fr: "Italienne", en: "Italian", es: "Italiana", de: "Italienisch", it: "Italiana", pt: "Italiana", nl: "Italiaans", ru: "Итальянка", ar: "إيطالية", zh: "意大利人", hi: "इतालवी" },
  ivorian: { fr: "Ivoirienne", en: "Ivorian", es: "Marfileña", de: "Ivorisch", it: "Ivoriana", pt: "Marfinense", nl: "Ivoriaans", ru: "Ивуарийка", ar: "إيفوارية", zh: "科特迪瓦人", hi: "आइवरी" },

  // ─── J ───────────────────────────────────────────────────────────────────
  jamaican: { fr: "Jamaïcaine", en: "Jamaican", es: "Jamaicana", de: "Jamaikanisch", it: "Giamaicana", pt: "Jamaicana", nl: "Jamaicaans", ru: "Ямайка", ar: "جامايكية", zh: "牙买加人", hi: "जमैकन" },
  japanese: { fr: "Japonaise", en: "Japanese", es: "Japonesa", de: "Japanisch", it: "Giapponese", pt: "Japonesa", nl: "Japans", ru: "Японка", ar: "يابانية", zh: "日本人", hi: "जापानी" },

  // ─── K ───────────────────────────────────────────────────────────────────
  kurdish: { fr: "Kurde", en: "Kurdish", es: "Kurda", de: "Kurdisch", it: "Curda", pt: "Curda", nl: "Koerdisch", ru: "Курдка", ar: "كردية", zh: "库尔德人", hi: "कुर्द", historical: true },
  kenyan: { fr: "Kényane", en: "Kenyan", es: "Keniana", de: "Kenianisch", it: "Keniota", pt: "Queniana", nl: "Keniaans", ru: "Кенийка", ar: "كينية", zh: "肯尼亚人", hi: "केन्याई" },

  // ─── L ───────────────────────────────────────────────────────────────────
  liberian: { fr: "Libérienne", en: "Liberian", es: "Liberiana", de: "Liberianisch", it: "Liberiana", pt: "Liberiana", nl: "Liberiaans", ru: "Либерийка", ar: "ليبيرية", zh: "利比里亚人", hi: "लाइबेरियाई" },

  // ─── M ───────────────────────────────────────────────────────────────────
  macedonian: { fr: "Macédonienne", en: "Macedonian", es: "Macedonia", de: "Mazedonisch", it: "Macedone", pt: "Macedônia", nl: "Macedonisch", ru: "Македонянка", ar: "مقدونية", zh: "马其顿人", hi: "मैसेडोनियाई", historical: true },
  malian: { fr: "Malienne", en: "Malian", es: "Maliense", de: "Malisch", it: "Maliana", pt: "Malinesa", nl: "Malinees", ru: "Малийка", ar: "مالية", zh: "马里人", hi: "मालियन" },
  moroccan: { fr: "Marocaine", en: "Moroccan", es: "Marroquí", de: "Marokkanisch", it: "Marocchina", pt: "Marroquina", nl: "Marokkaans", ru: "Марокканка", ar: "مغربية", zh: "摩洛哥人", hi: "मोरक्कन" },
  mexican: { fr: "Mexicaine", en: "Mexican", es: "Mexicana", de: "Mexikanisch", it: "Messicana", pt: "Mexicana", nl: "Mexicaans", ru: "Мексиканка", ar: "مكسيكية", zh: "墨西哥人", hi: "मेक्सिकन" },
  mongolian: { fr: "Mongole", en: "Mongolian", es: "Mongola", de: "Mongolisch", it: "Mongola", pt: "Mongol", nl: "Mongools", ru: "Монголка", ar: "منغولية", zh: "蒙古人", hi: "मंगोलियाई" },
  mozambican: { fr: "Mozambicaine", en: "Mozambican", es: "Mozambiqueña", de: "Mosambikanisch", it: "Mozambicana", pt: "Moçambicana", nl: "Mozambikaans", ru: "Мозамбиканка", ar: "موزمبيقية", zh: "莫桑比克人", hi: "मोज़ाम्बिकन" },

  // ─── N ───────────────────────────────────────────────────────────────────
  nigerian: { fr: "Nigériane", en: "Nigerian", es: "Nigeriana", de: "Nigerianisch", it: "Nigeriana", pt: "Nigeriana", nl: "Nigeriaans", ru: "Нигерийка", ar: "نيجيرية", zh: "尼日利亚人", hi: "नाइजीरियाई" },
  norman: { fr: "Normande", en: "Norman", es: "Normanda", de: "Normannisch", it: "Normanna", pt: "Normanda", nl: "Normandisch", ru: "Норманнка", ar: "نورماندية", zh: "诺曼人", hi: "नॉर्मन", historical: true },
  norwegian: { fr: "Norvégienne", en: "Norwegian", es: "Noruega", de: "Norwegisch", it: "Norvegese", pt: "Norueguesa", nl: "Noors", ru: "Норвежка", ar: "نرويجية", zh: "挪威人", hi: "नार्वेजियन" },
  nepalese: { fr: "Népalaise", en: "Nepalese", es: "Nepalí", de: "Nepalesisch", it: "Nepalese", pt: "Nepalesa", nl: "Nepalees", ru: "Непалка", ar: "نيبالية", zh: "尼泊尔人", hi: "नेपाली" },
  dutch: { fr: "Néerlandaise", en: "Dutch", es: "Neerlandesa", de: "Niederländisch", it: "Olandese", pt: "Neerlandesa", nl: "Nederlands", ru: "Голландка", ar: "هولندية", zh: "荷兰人", hi: "डच" },
  "new-zealander": { fr: "Néo-zélandaise", en: "New Zealander", es: "Neozelandesa", de: "Neuseeländisch", it: "Neozelandese", pt: "Neozelandesa", nl: "Nieuw-Zeelands", ru: "Новозеландка", ar: "نيوزيلندية", zh: "新西兰人", hi: "न्यूज़ीलैंडी" },

  // ─── O ───────────────────────────────────────────────────────────────────
  ottoman: { fr: "Ottomane", en: "Ottoman", es: "Otomana", de: "Osmanisch", it: "Ottomana", pt: "Otomana", nl: "Ottomaans", ru: "Османка", ar: "عثمانية", zh: "奥斯曼人", hi: "ओटोमन", historical: true },

  // ─── P ───────────────────────────────────────────────────────────────────
  pakistani: { fr: "Pakistanaise", en: "Pakistani", es: "Pakistaní", de: "Pakistanisch", it: "Pakistana", pt: "Paquistanesa", nl: "Pakistaans", ru: "Пакистанка", ar: "باكستانية", zh: "巴基斯坦人", hi: "पाकिस्तानी" },
  persian: { fr: "Perse", en: "Persian", es: "Persa", de: "Persisch", it: "Persiana", pt: "Persa", nl: "Perzisch", ru: "Персиянка", ar: "فارسية", zh: "波斯人", hi: "फ़ारसी", historical: true },
  philippine: { fr: "Philippine", en: "Filipino", es: "Filipina", de: "Philippinisch", it: "Filippina", pt: "Filipina", nl: "Filipijns", ru: "Филиппинка", ar: "فلبينية", zh: "菲律宾人", hi: "फिलिपिनो" },
  polish: { fr: "Polonaise", en: "Polish", es: "Polaca", de: "Polnisch", it: "Polacca", pt: "Polonesa", nl: "Pools", ru: "Полька", ar: "بولندية", zh: "波兰人", hi: "पोलिश" },
  prussian: { fr: "Prussienne", en: "Prussian", es: "Prusiana", de: "Preußisch", it: "Prussiana", pt: "Prussiana", nl: "Pruisisch", ru: "Пруссачка", ar: "بروسية", zh: "普鲁士人", hi: "प्रशियाई", historical: true },
  portuguese: { fr: "Portugaise", en: "Portuguese", es: "Portuguesa", de: "Portugiesisch", it: "Portoghese", pt: "Portuguesa", nl: "Portugees", ru: "Португалка", ar: "برتغالية", zh: "葡萄牙人", hi: "पुर्तगाली" },
  peruvian: { fr: "Péruvienne", en: "Peruvian", es: "Peruana", de: "Peruanisch", it: "Peruviana", pt: "Peruana", nl: "Peruaans", ru: "Перуанка", ar: "بيروفية", zh: "秘鲁人", hi: "पेरूवियन" },

  // ─── R ───────────────────────────────────────────────────────────────────
  roman: { fr: "Romaine", en: "Roman", es: "Romana", de: "Römisch", it: "Romana", pt: "Romana", nl: "Romeins", ru: "Римлянка", ar: "رومانية", zh: "罗马人", hi: "रोमन", historical: true },
  romanian: { fr: "Roumaine", en: "Romanian", es: "Rumana", de: "Rumänisch", it: "Rumena", pt: "Romena", nl: "Roemeens", ru: "Румынка", ar: "رومانية", zh: "罗马尼亚人", hi: "रोमानियाई" },
  russian: { fr: "Russe", en: "Russian", es: "Rusa", de: "Russisch", it: "Russa", pt: "Russa", nl: "Russisch", ru: "Русская", ar: "روسية", zh: "俄罗斯人", hi: "रूसी" },

  // ─── S ───────────────────────────────────────────────────────────────────
  serbian: { fr: "Serbe", en: "Serbian", es: "Serbia", de: "Serbisch", it: "Serba", pt: "Sérvia", nl: "Servisch", ru: "Сербка", ar: "صربية", zh: "塞尔维亚人", hi: "सर्बियाई" },
  singaporean: { fr: "Singapourienne", en: "Singaporean", es: "Singapurense", de: "Singapurisch", it: "Singaporiana", pt: "Singapurense", nl: "Singaporees", ru: "Сингапурка", ar: "سنغافورية", zh: "新加坡人", hi: "सिंगापुरी" },
  sudanese: { fr: "Soudanaise", en: "Sudanese", es: "Sudanesa", de: "Sudanesisch", it: "Sudanese", pt: "Sudanesa", nl: "Soedanees", ru: "Суданка", ar: "سودانية", zh: "苏丹人", hi: "सूडानी" },
  soviet: { fr: "Soviétique", en: "Soviet", es: "Soviética", de: "Sowjetisch", it: "Sovietica", pt: "Soviética", nl: "Sovjet", ru: "Советская", ar: "سوفيتية", zh: "苏联人", hi: "सोवियत", historical: true },
  "south-african": { fr: "Sud-africaine", en: "South African", es: "Sudafricana", de: "Südafrikanisch", it: "Sudafricana", pt: "Sul-africana", nl: "Zuid-Afrikaans", ru: "Южноафриканка", ar: "جنوب أفريقية", zh: "南非人", hi: "दक्षिण अफ़्रीकी" },
  "south-korean": { fr: "Sud-coréenne", en: "South Korean", es: "Surcoreana", de: "Südkoreanisch", it: "Sudcoreana", pt: "Sul-coreana", nl: "Zuid-Koreaans", ru: "Южнокореянка", ar: "كورية جنوبية", zh: "韩国人", hi: "दक्षिण कोरियाई" },
  swiss: { fr: "Suisse", en: "Swiss", es: "Suiza", de: "Schweizerisch", it: "Svizzera", pt: "Suíça", nl: "Zwitsers", ru: "Швейцарка", ar: "سويسرية", zh: "瑞士人", hi: "स्विस" },
  swedish: { fr: "Suédoise", en: "Swedish", es: "Sueca", de: "Schwedisch", it: "Svedese", pt: "Sueca", nl: "Zweeds", ru: "Шведка", ar: "سويدية", zh: "瑞典人", hi: "स्वीडिश" },
  senegalese: { fr: "Sénégalaise", en: "Senegalese", es: "Senegalesa", de: "Senegalesisch", it: "Senegalese", pt: "Senegalesa", nl: "Senegalees", ru: "Сенегалка", ar: "سنغالية", zh: "塞内加尔人", hi: "सेनेगली" },

  // ─── T ───────────────────────────────────────────────────────────────────
  tanzanian: { fr: "Tanzanienne", en: "Tanzanian", es: "Tanzana", de: "Tansanisch", it: "Tanzaniana", pt: "Tanzaniana", nl: "Tanzaniaans", ru: "Танзанийка", ar: "تنزانية", zh: "坦桑尼亚人", hi: "तंज़ानियाई" },
  taiwanese: { fr: "Taïwanaise", en: "Taiwanese", es: "Taiwanesa", de: "Taiwanisch", it: "Taiwanese", pt: "Taiwanesa", nl: "Taiwanees", ru: "Тайванька", ar: "تايوانية", zh: "台湾人", hi: "ताइवानी" },
  tibetan: { fr: "Tibétaine", en: "Tibetan", es: "Tibetana", de: "Tibetisch", it: "Tibetana", pt: "Tibetana", nl: "Tibetaans", ru: "Тибетка", ar: "تبتية", zh: "藏族人", hi: "तिब्बती" },
  timurid: { fr: "Timouride", en: "Timurid", es: "Timúrida", de: "Timuridisch", it: "Timuride", pt: "Timúrida", nl: "Timoeridisch", ru: "Тимуридка", ar: "تيمورية", zh: "帖木儿人", hi: "तैमूरी", historical: true },

  // ─── V ───────────────────────────────────────────────────────────────────
  vietnamese: { fr: "Vietnamienne", en: "Vietnamese", es: "Vietnamita", de: "Vietnamesisch", it: "Vietnamita", pt: "Vietnamita", nl: "Vietnamees", ru: "Вьетнамка", ar: "فيتنامية", zh: "越南人", hi: "वियतनामी" },
  venetian: { fr: "Vénitienne", en: "Venetian", es: "Veneciana", de: "Venezianisch", it: "Veneziana", pt: "Veneziana", nl: "Venetiaans", ru: "Венецианка", ar: "بندقية", zh: "威尼斯人", hi: "वेनिसियन", historical: true },
  venezuelan: { fr: "Vénézuélienne", en: "Venezuelan", es: "Venezolana", de: "Venezolanisch", it: "Venezuelana", pt: "Venezuelana", nl: "Venezolaans", ru: "Венесуэлка", ar: "فنزويلية", zh: "委内瑞拉人", hi: "वेनेज़ुएलाई" },

  // ─── Y ───────────────────────────────────────────────────────────────────
  yugoslav: { fr: "Yougoslave", en: "Yugoslav", es: "Yugoslava", de: "Jugoslawisch", it: "Iugoslava", pt: "Iugoslava", nl: "Joegoslavisch", ru: "Югославка", ar: "يوغوسلافية", zh: "南斯拉夫人", hi: "यूगोस्लाव", historical: true },

  // ─── Z ───────────────────────────────────────────────────────────────────
  zimbabwean: { fr: "Zimbabwéenne", en: "Zimbabwean", es: "Zimbabuense", de: "Simbabwisch", it: "Zimbabwiana", pt: "Zimbabuana", nl: "Zimbabwaans", ru: "Зимбабвийка", ar: "زيمبابوية", zh: "津巴布韦人", hi: "ज़िम्बाब्वे" },
  zulu: { fr: "Zouloue", en: "Zulu", es: "Zulú", de: "Zulu", it: "Zulù", pt: "Zulu", nl: "Zoeloe", ru: "Зулуска", ar: "زولوية", zh: "祖鲁人", hi: "ज़ुलू", historical: true },

  // ─── É ───────────────────────────────────────────────────────────────────
  scottish: { fr: "Écossaise", en: "Scottish", es: "Escocesa", de: "Schottisch", it: "Scozzese", pt: "Escocesa", nl: "Schots", ru: "Шотландка", ar: "اسكتلندية", zh: "苏格兰人", hi: "स्कॉटिश", historical: true },
  egyptian: { fr: "Égyptienne", en: "Egyptian", es: "Egipcia", de: "Ägyptisch", it: "Egiziana", pt: "Egípcia", nl: "Egyptisch", ru: "Египтянка", ar: "مصرية", zh: "埃及人", hi: "मिस्री" },
  ethiopian: { fr: "Éthiopienne", en: "Ethiopian", es: "Etíope", de: "Äthiopisch", it: "Etiope", pt: "Etíope", nl: "Ethiopisch", ru: "Эфиопка", ar: "إثيوبية", zh: "埃塞俄比亚人", hi: "इथियोपियाई" },
};

/**
 * Récupère le nom d'une nationalité dans une langue donnée.
 */
export function getNationalityName(code: NationalityCode, lang: LangCode): string {
  const entry = NATIONALITY_CODES[code];
  if (!entry) return code;
  return (entry[lang] as string | undefined) || entry.fr;
}

/**
 * Set des codes de nationalités historiques (entités disparues).
 * Utilisé pour excludeFromNationalityQuiz dans data/historicalFigures.ts.
 */
export const HISTORICAL_NATIONALITY_CODES: Set<NationalityCode> = new Set(
  Object.entries(NATIONALITY_CODES)
    .filter(([_, entry]) => entry.historical)
    .map(([code]) => code),
);

/**
 * Map inverse : nom FR → code (pour migration des données existantes).
 */
export const FR_NAME_TO_NATIONALITY_CODE: Record<string, NationalityCode> = (() => {
  const map: Record<string, NationalityCode> = {};
  for (const [code, entry] of Object.entries(NATIONALITY_CODES)) {
    map[entry.fr] = code;
  }
  return map;
})();
