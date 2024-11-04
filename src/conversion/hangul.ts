import { separate } from "../syllable";
import { ACCENT_CONVERSION_TABLE, VOWELS, clean } from "./latin";

const LATN_2_HANG_TABLE: Record<string, string> = {
	a: "ㅏ",
	i: "ㅣ",
	u: "ㅜ",
	e: "ㅓ",
	o: "ㅗ",
	m: "ㅁ",
	n: "ㄴ",
	p: "ㅂ",
	t: "ㄷ",
	k: "ㄱ",
	"’": "ㅇ",
	c: "ㅈ",
	s: "ㅅ",
	h: "ㅎ",
	r: "ㄹ",
	w: "ㅱ",
	y: "ㅣ",
};

const HANG_VOWEL_COMBINATION_TABLE: Record<string, string> = {
	ㅣㅏㅣ: "ㅒ", // yay
	ㅣㅓㅣ: "ㅖ", // yey
	ㅏㅣ: "ㅐ", // ay
	ㅓㅣ: "ㅔ", // ey
	ㅜㅣ: "ㅟ", // uy
	ㅗㅣ: "ㅚ", // oy
	ㅣㅏ: "ㅑ", // ya
	ㅣㅓ: "ㅕ", // ye
	ㅣㅜ: "ㅠ", // yu
	ㅣㅗ: "ㅛ", // yo
	// ㅣㅣ: 'ㅣ', // yi
	// ㅣㅐ: 'ㅒ', // yay
	// ㅣㅔ: 'ㅖ', // yey
};

const HANG_ALTERNATIVE_W: Record<string, string> = {
	ㅘ: "ㅱㅏ", // wa
	ㅝ: "ㅱㅓ", // we
	// wo does not exist because u + o is invalid (o)
};

const INITIALS: Record<string, number> = {
	ㄱ: 0,
	ㄴ: 2,
	ㄷ: 3,
	ㄹ: 5,
	ㅁ: 6,
	ㅂ: 7,
	ㅅ: 9,
	ㅇ: 11,
	ㅈ: 12,
	ㅍ: 17,
	ㅎ: 18,
};

// Record of medial vowels (jungseong)
const MEDIALS: Record<string, number> = {
	ㅏ: 0,
	ㅐ: 1,
	ㅑ: 2,
	ㅒ: 3,
	ㅓ: 4,
	ㅔ: 5,
	ㅕ: 6,
	ㅖ: 7,
	ㅗ: 8,
	ㅘ: 9,
	ㅚ: 11,
	ㅛ: 12,
	ㅜ: 13,
	ㅝ: 14,
	ㅟ: 16,
	ㅠ: 17,
	ㅣ: 20,
};

// Record of final consonants (jongseong)
const FINALS: Record<string, number> = {
	"": 0,
	ㄱ: 1,
	ㄴ: 4,
	ㄷ: 7,
	ㄹ: 8,
	ㅁ: 16,
	ㅂ: 17,
	ㅅ: 19,
	ㅈ: 22,
	ㅍ: 26,
	ㅎ: 27,
};

const JAMO_INITIALS: Record<string, string> = {
	"": "",
	ㅱ: "ᄝ",
	ㄱ: "ᄀ",
	ㄴ: "ᄂ",
	ㄷ: "ᄃ",
	ㄹ: "ᄅ",
	ㅁ: "ᄆ",
	ㅂ: "ᄇ",
	ㅅ: "ᄉ",
	ㅇ: "ᄋ",
	ㅈ: "ᄌ",
	ㅎ: "ᄒ",
};

const JAMO_MEDIALS: Record<string, string> = {
	ㅏ: "ᅡ",
	ㅓ: "ᅥ",
	ㅗ: "ᅩ",
	ㅜ: "ᅮ",
	ㅣ: "ᅵ",
};

const JAMO_FINALS: Record<string, string> = {
	"": "",
	ㄱ: "ᆨ",
	ㄴ: "ᆫ",
	ㄷ: "ᆮ",
	ㄹ: "ᆯ",
	ㅁ: "ᆷ",
	ㅂ: "ᆸ",
	ㅅ: "ᆺ",
	ㅈ: "ᆽ",
	ㅎ: "ᇂ",
	ㅱ: "ᇢ",
};

function toComposedHangul(
	initial: string,
	medial: string,
	final: string,
): string {
	const combiningInitial = JAMO_INITIALS[initial];
	const combiningMedial = JAMO_MEDIALS[medial];
	const combiningFinal = JAMO_FINALS[final];

	return combiningInitial + combiningMedial + combiningFinal;
}

/**
 * Convert Latin script to Hangul script.
 *
 * Proposals
 * * https://reuni.hatenadiary.org/entry/20061029/1162102845
 * * https://youtu.be/D-Hrf1lY1Fg
 * * https://twitter.com/Morojenium/status/1433764893753167875
 *
 * @param input
 * @returns
 */
export function convertLatnToHang(latn: string): string {
	function convertWord(word: string): string {
		const cleanedLatn = clean(word).toLowerCase();

		if (cleanedLatn.length === 0) {
			return "";
		}

		// TODO: Separate by word boundaries

		// Separate by syllables
		let syllables = separate(cleanedLatn);

		// console.log({ syllables });

		for (const [accented, unaccented] of Object.entries(
			ACCENT_CONVERSION_TABLE,
		)) {
			syllables = syllables.map((syllable) =>
				syllable.replace(accented, unaccented),
			);
		}

		const convertedSyllables = syllables
			.map((syllable) => {
				let result = syllable;

				if (VOWELS.includes(syllable[0]) || syllable[0] === "y") {
					result = `’${syllable}`; // TODO: use straight apostrophe
				}
				// if (syllable.charAt(-1) === 'y') {
				//   syllable = LATN_2_HANG_TABLE[syllable.slice(0, -1)] + 'ㅣ';
				return [...result].map((char) => LATN_2_HANG_TABLE[char]).join("");
			})
			.map((syllable) => {
				let result = syllable;

				// console.log('syllable', syllable);
				for (const [key, value] of Object.entries(
					HANG_VOWEL_COMBINATION_TABLE,
				)) {
					result = result.replace(key, value);
				}
				// Convert vowel combinations
				return result.replace(/ㅣㅣ/g, "ㅣ");
			});

		// console.log({ convertedSyllables });

		const hangulCharacters = convertedSyllables.map((syllable) => {
			// Record of initial consonants (choseong)

			// Split the input into individual characters
			const chars = Array.from(syllable);
			if (chars.length < 2 || chars.length > 3) {
				throw new Error(
					"Invalid input: Hangul syllables must consist of 2 or 3 characters.",
				);
			}

			if (chars.includes("ㅱ")) {
				return toComposedHangul(chars[0], chars[1], chars[2] ?? "");
			}

			// Find the indices of initial, medial, (and final) components
			const initialIndex = INITIALS[chars[0]];
			const medialIndex = MEDIALS[chars[1]];
			const finalIndex = chars.length === 3 ? FINALS[chars[2]] : 0;

			if (
				initialIndex === undefined ||
				medialIndex === undefined ||
				finalIndex === undefined
			) {
				throw new Error(
					`Invalid input: Characters must be valid Hangul components. ${chars}`,
				);
			}

			return String.fromCharCode(
				0xac00 + (initialIndex * 21 + medialIndex) * 28 + finalIndex,
			);
		});

		// console.log({ hangulCharacters });

		return hangulCharacters.join("");
	}

	const REGEX = /([\p{Script_Extensions=Latin}'’\-=]+)/u;
	return latn
		.split(REGEX)
		.map((w) => (REGEX.test(w) ? convertWord(w) : w))
		.join("");
}

/**
 * Convert Latin script to Hangul script.
 *
 * Proposals
 * * https://reuni.hatenadiary.org/entry/20061029/1162102845
 * * https://youtu.be/D-Hrf1lY1Fg
 * * https://twitter.com/Morojenium/status/1433764893753167875
 *
 * @param input
 * @returns
 */
export function convertHangToLatn(hang: string): string {
	function convertWord(word: string): string {
		// Helper function to decompose a Hangul character
		const decomposeHangul = (char: string) => {
			const code = char.charCodeAt(0) - 0xac00;
			const finalIndex = code % 28;
			const medialIndex = ((code - finalIndex) / 28) % 21;
			const initialIndex = ((code - finalIndex) / 28 - medialIndex) / 21;
			return [initialIndex, medialIndex, finalIndex];
		};

		// Reverse lookup tables
		const reverseInitials = Object.fromEntries(
			Object.entries(INITIALS).map(([k, v]) => [v, k]),
		);
		const reverseMedials = Object.fromEntries(
			Object.entries(MEDIALS).map(([k, v]) => [v, k]),
		);
		const reverseFinals = Object.fromEntries(
			Object.entries(FINALS).map(([k, v]) => [v, k]),
		);

		const reverseJamoInitials = Object.fromEntries(
			Object.entries(JAMO_INITIALS).map(([k, v]) => [v, k]),
		);
		const reverseJamoMedials = Object.fromEntries(
			Object.entries(JAMO_MEDIALS).map(([k, v]) => [v, k]),
		);
		const reverseJamoFinals = Object.fromEntries(
			Object.entries(JAMO_FINALS).map(([k, v]) => [v, k]),
		);

		// split hangul jamo group and hangul character
		const clusters = word.split(/([ᄀ-ᇿ]+|[가-힯])/).filter(Boolean);

		const decomposed = clusters.map((char) => {
			// console.log("char", char);
			// Decompose Hangul character

			if (/[가-힯]/.test(char)) {
				const [initialIndex, medialIndex, finalIndex] = decomposeHangul(char);
				// console.log({ initialIndex, medialIndex, finalIndex });

				// Map decomposed indices to Latin characters
				const initial = reverseInitials[initialIndex] || "";
				const medial = reverseMedials[medialIndex] || "";
				const final = reverseFinals[finalIndex] || "";

				let result = initial + medial + final;

				for (const [combined, individual] of Object.entries(
					HANG_ALTERNATIVE_W,
				)) {
					result = result.replace(combined, individual);
				}

				// console.log('hangulB', hangul);
				for (const [individual, combined] of Object.entries(
					HANG_VOWEL_COMBINATION_TABLE,
				)) {
					result = result.replace(combined, individual);
				}
				// console.log('hangulA', hangul);

				return result;
			}

			let initial = "";
			let medial = "";
			let final = "";

			for (const c of [...char]) {
				if (reverseJamoInitials[c]) {
					initial = reverseJamoInitials[c];
				} else if (reverseJamoMedials[c]) {
					medial = reverseJamoMedials[c];
				} else if (reverseJamoFinals[c]) {
					final = reverseJamoFinals[c];
				}
			}

			return initial + medial + final;
		});

		const latin = decomposed
			.map((hangul) => {
				let result = hangul;

				for (const [key, value] of Object.entries(LATN_2_HANG_TABLE)) {
					result = result.replace(value, key);
				}
				return result;
			})
			.map((latn) => {
				let result = latn;
				// console.log('latn:', latn);

				// ’iV -> yV
				result = result.replace(/’i(?=[aeiou])/, "y");
				// console.log('’iV->yV :', result);
				// Vi -> Vy
				result = result.replace(/(?<=[aeiou])i/, "y");
				// console.log('Vi->Vy :', result);
				return result;
			});

		// console.log('latin', latin);
		return latin.join("").replace(/(?<![^aieou])’/g, "");
	}

	const REGEX = /([\p{Script_Extensions=Hangul}]+)/u;
	return hang
		.split(REGEX)
		.map((w) => (REGEX.test(w) ? convertWord(w) : w))
		.join("");
}
