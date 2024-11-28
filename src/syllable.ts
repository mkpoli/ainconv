import { CONSONANTS, VOWELS } from "./conversion/latin";

/**
 * Separate a string into syllables.
 * @param latn The romanized string to be separated.
 * @returns An array of syllables.
 */
export function separate(latn: string): string[] {
	if (!latn) return [];

	const syllableMap: { [index: number]: number } = {};
	let syllableCount = 1;

	const cleanedLatn = latn.toLowerCase();

	for (const [i, char] of [...cleanedLatn].entries()) {
		if (VOWELS.includes(char)) {
			if (i > 0 && CONSONANTS.includes(cleanedLatn[i - 1])) {
				syllableMap[i - 1] = syllableCount;
			}
			syllableMap[i] = syllableCount;
			syllableCount++;
		}
	}

	// Fill codas
	for (let i = 0; i < cleanedLatn.length; i++) {
		if (syllableMap[i] === undefined) {
			syllableMap[i] = syllableMap[i - 1];
		}
	}

	// Group and extract syllables
	const syllables: string[] = [];
	let currentGroupId = 1;
	let head = 0;

	for (let i = 0; i < cleanedLatn.length; i++) {
		if (syllableMap[i] !== currentGroupId) {
			currentGroupId = syllableMap[i];
			syllables.push(cleanedLatn.slice(head, i));
			head = i;
		}
	}

	syllables.push(cleanedLatn.slice(head));

	return syllables
		.map((syllable) =>
			syllable
				.replace(/['’= ]/g, "")
				.replace(/^yi/, "i")
				.replace(/^wu/, "u"),
		)
		.filter(Boolean);
}
