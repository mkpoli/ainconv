import { CONSONANTS, VOWELS } from "./conversion/latin";

/**
 * Separate a string into syllables.
 * @param latn The romanized string to be separated.
 * @returns An array of syllables.
 */
export function separate(latn: string): string[] {
	const syllableMap: { [index: number]: number } = {};
	let syllableCount = 1;

	for (const [i, char] of [...latn].entries()) {
		if (VOWELS.includes(char)) {
			if (i > 0 && CONSONANTS.includes(latn[i - 1])) {
				syllableMap[i - 1] = syllableCount;
			}
			syllableMap[i] = syllableCount;
			syllableCount++;
		}
	}

	// Fill codas
	for (let i = 0; i < latn.length; i++) {
		if (syllableMap[i] === undefined) {
			syllableMap[i] = syllableMap[i - 1];
		}
	}

	// Group and extract syllables
	const syllables: string[] = [];
	let currentGroupId = 1;
	let head = 0;

	for (let i = 0; i < latn.length; i++) {
		if (syllableMap[i] !== currentGroupId) {
			currentGroupId = syllableMap[i];
			syllables.push(latn.slice(head, i));
			head = i;
		}
	}

	syllables.push(latn.slice(head));

	return syllables.map((syllable) => syllable.replace("'", ""));
}
