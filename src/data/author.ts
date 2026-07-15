/**
 * Auteur/éditeur du contenu SAPIRO. Centralisé pour le schema Person (E-E-A-T)
 * et le byline des articles.
 */
export const AUTHOR = {
  name: 'Aurélien Debord',
  jobTitle: 'Founder, Agence Debord',
  url: 'https://sapiro.app/about/',
  sameAs: [
    'https://www.linkedin.com/in/aureliendebord/',
  ],
} as const;

/** Objet schema.org Person prêt à sérialiser (author des articles). */
export const authorPersonSchema = {
  '@type': 'Person',
  name: AUTHOR.name,
  url: AUTHOR.url,
  jobTitle: AUTHOR.jobTitle,
  sameAs: [...AUTHOR.sameAs],
};
