export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Extrait les paires question/reponse de la section FAQ d'un contenu Markdown.
 * Cherche un H2 contenant "frequentes", "asked questions" ou "frecuentes",
 * puis parse les H3 suivants comme questions et le texte qui suit comme reponses.
 */
export function extractFaqFromMarkdown(body: string): FaqItem[] {
  const lines = body.split('\n');
  const items: FaqItem[] = [];

  // Trouver le debut de la section FAQ
  let faqStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^## .*(frequentes|asked questions|frecuentes|FAQ)/i.test(lines[i])) {
      faqStart = i + 1;
      break;
    }
  }

  if (faqStart === -1) return items;

  let currentQuestion = '';
  let currentAnswer: string[] = [];

  for (let i = faqStart; i < lines.length; i++) {
    const line = lines[i];

    // Nouveau H2 = fin de la section FAQ
    if (/^## /.test(line)) {
      if (currentQuestion && currentAnswer.length) {
        items.push({
          question: currentQuestion,
          answer: currentAnswer.join(' ').trim(),
        });
      }
      break;
    }

    // Nouveau H3 = nouvelle question
    if (/^### /.test(line)) {
      if (currentQuestion && currentAnswer.length) {
        items.push({
          question: currentQuestion,
          answer: currentAnswer.join(' ').trim(),
        });
      }
      currentQuestion = line.replace(/^### /, '');
      currentAnswer = [];
      continue;
    }

    // Ligne de contenu
    const trimmed = line.trim();
    if (trimmed && currentQuestion) {
      currentAnswer.push(trimmed);
    }
  }

  // Derniere question si le fichier se termine sans nouveau H2
  if (currentQuestion && currentAnswer.length) {
    items.push({
      question: currentQuestion,
      answer: currentAnswer.join(' ').trim(),
    });
  }

  return items;
}
