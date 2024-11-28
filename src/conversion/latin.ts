export const VOWELS = "aiueoáíúéó";
// ['p', 't', 'c', 'k', 'm', 'n', 's', 'h', 'w', 'r', 'y', "'"];
export const CONSONANTS = "ptckmnshwry’";
export const ACCENT_CONVERSION_TABLE: Record<string, string> = {
	á: "a",
	í: "i",
	ú: "u",
	é: "e",
	ó: "o",
};
/**
 * Clean text by removing all non-Latin characters and normalizing
 * @param text text with Latin alphabet
 * @returns cleaned text
 */

export function clean(text: string) {
	return text.replace(/[-=.,]/gu, "").normalize("NFKC");
}

export const MATCH_LATIN_WORD =
	/([\p{Script_Extensions=Latin}'’\-=]+(?: p\b)?)/u;

export function convertFromLatin(
	latn: string,
	convertWord: (word: string) => string,
) {
	return latn
		.split(MATCH_LATIN_WORD)
		.map((w) =>
			MATCH_LATIN_WORD.test(w) ? convertWord(w.replace(" ", "")) : w,
		)
		.join("");
}
