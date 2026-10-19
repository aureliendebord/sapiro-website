import type { Lang, PartialLangMap } from '../i18n';

export interface Cluster {
  /** Identifiant interne du cluster */
  key: string;
  /** Categories d'articles rattachees a ce cluster */
  categories: string[];
  /** Slug de la page pilier par langue (`de` absent : pas de page pilier allemande) */
  pillarSlug: PartialLangMap<string>;
  /** Libelle affiche par langue */
  label: PartialLangMap<string>;
  /** Courte description par langue (pour les cartes du hub) */
  tagline: PartialLangMap<string>;
  /** Emoji d'illustration */
  icon: string;
}

export const clusters: Cluster[] = [
  {
    key: 'geographie',
    categories: ['geographie', 'drapeaux', 'voyage', 'culture-generale'],
    pillarSlug: { fr: '/geographie/', en: '/en/geography/', es: '/es/geografia/', de: '/de/geografie/' },
    label: { fr: 'Géographie', en: 'Geography', es: 'Geografía', de: 'Geografie' },
    tagline: {
      fr: '197 pays, drapeaux, capitales et curiosités du monde.',
      en: '197 countries, flags, capitals and world curiosities.',
      es: '197 países, banderas, capitales y curiosidades del mundo.',
      de: '197 Länder, Flaggen, Hauptstädte und Kuriositäten der Welt.',
    },
    icon: '🌍',
  },
  {
    key: 'histoire',
    categories: ['histoire'],
    pillarSlug: { fr: '/histoire/', en: '/en/history/', es: '/es/historia/', de: '/de/geschichte/' },
    label: { fr: 'Histoire', en: 'History', es: 'Historia', de: 'Geschichte' },
    tagline: {
      fr: 'Personnages, batailles et grandes périodes du monde.',
      en: 'Figures, battles and the major periods of the world.',
      es: 'Personajes, batallas y grandes periodos del mundo.',
      de: 'Persönlichkeiten, Schlachten und die großen Epochen der Welt.',
    },
    icon: '🏛️',
  },
  {
    key: 'art',
    categories: ['art'],
    pillarSlug: { fr: '/art/', en: '/en/art/', es: '/es/arte/', de: '/de/kunst/' },
    label: { fr: 'Art', en: 'Art', es: 'Arte', de: 'Kunst' },
    tagline: {
      fr: 'Tableaux, peintres, mouvements et musées du monde.',
      en: 'Paintings, painters, movements and world museums.',
      es: 'Cuadros, pintores, movimientos y museos del mundo.',
      de: 'Gemälde, Maler, Kunstrichtungen und Museen der Welt.',
    },
    icon: '🎨',
  },
  {
    key: 'nature',
    categories: ['nature'],
    pillarSlug: { fr: '/nature/', en: '/en/nature/', es: '/es/naturaleza/', de: '/de/natur/' },
    label: { fr: 'Nature', en: 'Nature', es: 'Naturaleza', de: 'Natur' },
    tagline: {
      fr: '600 espèces animales, conservation et biodiversité.',
      en: '600 animal species, conservation and biodiversity.',
      es: '600 especies animales, conservación y biodiversidad.',
      de: '600 Tierarten, Artenschutz und Biodiversität.',
    },
    icon: '🦁',
  },
  {
    key: 'monuments',
    categories: ['monuments'],
    pillarSlug: { fr: '/monuments/', en: '/en/monuments/', es: '/es/monumentos/', de: '/de/monumente/' },
    label: { fr: 'Monuments', en: 'Monuments', es: 'Monumentos', de: 'Monumente' },
    tagline: {
      fr: 'Merveilles du monde, sites UNESCO et monuments à reconnaître.',
      en: 'Wonders of the world, UNESCO sites and monuments to recognise.',
      es: 'Maravillas del mundo, sitios UNESCO y monumentos para reconocer.',
      de: 'Weltwunder, UNESCO-Stätten und Bauwerke zum Erkennen.',
    },
    icon: '🗽',
  },
  {
    key: 'concours',
    categories: ['concours', 'education'],
    pillarSlug: { fr: '/concours/', en: '/en/exams/', es: '/es/oposiciones/' },
    label: { fr: 'Concours', en: 'Exams', es: 'Oposiciones' },
    tagline: {
      fr: 'Réviser la culture générale pour les concours et examens.',
      en: 'Reviewing general knowledge for exams and tests.',
      es: 'Repasar la cultura general para oposiciones y exámenes.',
    },
    icon: '🎓',
  },
  {
    key: 'famille',
    categories: ['famille'],
    pillarSlug: { fr: '/famille/', en: '/en/family/', es: '/es/familia/' },
    label: { fr: 'Famille', en: 'Family', es: 'Familia' },
    tagline: {
      fr: 'Apprendre en famille, méthodes et activités par âge.',
      en: 'Family learning, age-by-age methods and activities.',
      es: 'Aprender en familia, métodos y actividades por edad.',
    },
    icon: '👨‍👩‍👧',
  },
  {
    key: 'quiz',
    categories: ['formats-quiz'],
    pillarSlug: { fr: '/quiz/', en: '/en/quiz/', es: '/es/quiz/', de: '/de/quiz/' },
    label: { fr: 'Quiz', en: 'Quizzes', es: 'Quizzes', de: 'Quiz' },
    tagline: {
      fr: 'Tous les formats de quiz pour apprendre et animer.',
      en: 'Every quiz format to learn and to host games.',
      es: 'Todos los formatos de quiz para aprender y animar.',
      de: 'Alle Quizformate zum Lernen und zum Spielen mit anderen.',
    },
    icon: '❓',
  },
  {
    key: 'comparatifs',
    categories: ['comparatifs', 'apps'],
    pillarSlug: { fr: '/comparatifs/', en: '/en/comparisons/', es: '/es/comparativas/' },
    label: { fr: 'Comparatifs', en: 'Comparisons', es: 'Comparativas' },
    tagline: {
      fr: 'SAPIRO face aux autres apps de quiz et d’apprentissage.',
      en: 'SAPIRO against other quiz and learning apps.',
      es: 'SAPIRO frente a otras apps de quiz y aprendizaje.',
    },
    icon: '⚖️',
  },
];

/** Clusters qui ont une page pilier dans `lang` (l'allemand n'en a qu'une partie). */
export function clustersFor(lang: Lang): Cluster[] {
  return clusters.filter((c) => c.pillarSlug[lang] && c.label[lang]);
}

/** Retourne le cluster auquel appartient une categorie d'article. */
export function getClusterForCategory(category: string): Cluster | undefined {
  return clusters.find((c) => c.categories.includes(category));
}
