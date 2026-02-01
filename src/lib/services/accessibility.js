// Accessibility conversion utilities

export function calculateReadingLevel(text) {
  // Flesch-Kincaid Grade Level approximation
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const words = text.split(/\s+/).filter(w => w);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
  const avgSyllablesPerWord = syllables / Math.max(words.length, 1);
  
  const gradeLevel = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
  
  return {
    gradeLevel: Math.max(0, Math.min(18, Math.round(gradeLevel))),
    wordCount: words.length,
    sentenceCount: sentences.length,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
  };
}

function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  const vowels = 'aeiouy';
  let count = 0;
  let prevIsVowel = false;
  
  for (const char of word) {
    const isVowel = vowels.includes(char);
    if (isVowel && !prevIsVowel) count++;
    prevIsVowel = isVowel;
  }
  
  // Adjust for silent e
  if (word.endsWith('e')) count--;
  
  return Math.max(1, count);
}

export function addAriaAnnotations(html) {
  // Add ARIA landmarks and labels
  let annotated = html;
  
  // Add roles to common elements
  annotated = annotated.replace(/<nav/gi, '<nav role="navigation"');
  annotated = annotated.replace(/<main/gi, '<main role="main"');
  annotated = annotated.replace(/<aside/gi, '<aside role="complementary"');
  annotated = annotated.replace(/<header/gi, '<header role="banner"');
  annotated = annotated.replace(/<footer/gi, '<footer role="contentinfo"');
  
  return annotated;
}

export function generateTableOfContents(html) {
  const headings = [];
  const regex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      text: match[2].replace(/<[^>]*>/g, '').trim(),
    });
  }
  
  return headings;
}

export function convertToPlainText(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<h[1-6][^>]*>/gi, '\n\n## ')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function checkAccessibility(html) {
  const issues = [];
  
  // Check for images without alt
  if (/<img(?![^>]*alt=)[^>]*>/i.test(html)) {
    issues.push({ type: 'error', message: 'Images missing alt text' });
  }
  
  // Check for empty links
  if (/<a[^>]*>\s*<\/a>/i.test(html)) {
    issues.push({ type: 'error', message: 'Empty links found' });
  }
  
  // Check heading hierarchy
  const headings = html.match(/<h[1-6]/gi) || [];
  let prevLevel = 0;
  for (const h of headings) {
    const level = parseInt(h[2]);
    if (level > prevLevel + 1 && prevLevel !== 0) {
      issues.push({ type: 'warning', message: `Heading level skipped from h${prevLevel} to h${level}` });
    }
    prevLevel = level;
  }
  
  // Check color contrast (simplified)
  if (/color:\s*#[0-9a-f]{3,6}/i.test(html)) {
    issues.push({ type: 'info', message: 'Review color contrast for accessibility' });
  }
  
  return issues;
}
