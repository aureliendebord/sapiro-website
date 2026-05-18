import type { Lang } from '../i18n';

export interface Cluster {
  /** Identifiant interne du cluster */
  key: string;
  /** Categories d'articles rattachees a ce cluster */
  categories: string[];
  /** Slug de la page pilier par langue */
  pillarSlug: Record<Lang, string>;
  /** Libelle affiche par langue */
  label: Record<Lang, string>;
  /** Courte description par langue (pour les cartes du hub) */
  tagline: Record<Lang, string>;
  /** Emoji d'illustration */
  icon: string;
}

export const clusters: Cluster[] = [
  {
    key: 'geographie',
    categories: ['geographie', 'drapeaux', 'voyage', 'culture-generale'],
    pillarSlug: { fr: '/geographie/', en: '/en/geography/', es: '/es/geografia/' },
    label: { fr: 'Géographie', en: 'Geography', es: 'Geografía' },
    tagline: {
      fr: '197 pays, drapeaux, capitales et curiosités du monde.',
      en: '197 countries, flags, capitals and world curiosities.',
      es: '197 países, banderas, capitales y curiosidades del mundo.',
    },
    icon: '🌍',
  },
  {
    key: 'histoire',
    categories: ['histoire'],
    pillarSlug: { fr: '/histoire/', en: '/en/history/', es: '/es/historia/' },
    label: { fr: 'Histoire', en: 'History', es: 'Historia' },
    tagline: {
      fr: 'Personnages, batailles et grandes périodes du monde.',
      en: 'Figures, battles and the major periods of the world.',
      es: 'Personajes, batallas y grandes periodos del mundo.',
    },
    icon: '🏛️',
  },
  {
    key: 'art',
    categories: ['art'],
    pillarSlug: { fr: '/art/', en: '/en/art/', es: '/es/arte/' },
    label: { fr: 'Art', en: 'Art', es: 'Arte' },
    tagline: {
      fr: 'Tableaux, peintres, mouvements et musées du monde.',
      en: 'Paintings, painters, movements and world museums.',
      es: 'Cuadros, pintores, movimientos y museos del mundo.',
    },
    icon: '🎨',
  },
  {
    key: 'nature',
    categories: ['nature'],
    pillarSlug: { fr: '/nature/', en: '/en/nature/', es: '/es/naturaleza/' },
    label: { fr: 'Nature', en: 'Nature', es: 'Naturaleza' },
    tagline: {
      fr: '600 espèces animales, conservation et biodiversité.',
      en: '600 animal species, conservation and biodiversity.',
      es: '600 especies animales, conservación y biodiversidad.',
    },
    icon: '🦁',
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
    pillarSlug: { fr: '/quiz/', en: '/en/quiz/', es: '/es/quiz/' },
    label: { fr: 'Quiz', en: 'Quizzes', es: 'Quizzes' },
    tagline: {
      fr: 'Tous les formats de quiz pour apprendre et animer.',
      en: 'Every quiz format to learn and to host games.',
      es: 'Todos los formatos de quiz para aprender y animar.',
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

/** Retourne le cluster auquel appartient une categorie d'article. */
export function getClusterForCategory(category: string): Cluster | undefined {
  return clusters.find((c) => c.categories.includes(category));
}
