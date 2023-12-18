export const VOWELS = 'aiueoáíúéó';
// ['p', 't', 'c', 'k', 'm', 'n', 's', 'h', 'w', 'r', 'y', "'"];
export const CONSONANTS = 'ptckmnshwry’';

/**
 * Clean text by removing all non-Latin characters and normalizing
 * @param text text with Latin alphabet
 * @returns cleaned text
 */

export function clean(text: string) {
  return text
    .replace(/[-=.,]/gu, '')
    .normalize('NFKC')
    .toLowerCase();
}
