/**
 * This is a TypeScript port of the original Lua (Scribunto) module by User:Mkpoli (same individual as this projects' author) and User:BrassSnail, with modifications to comply the common Ainu kanaization conventions
 * The original Lua module is available under the CC BY-SA 3.0 license
 * https://ja.wiktionary.org/w/index.php?title=%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB:ain-kana-conv&oldid=1814571
 */

import { separate } from "../syllable";

// const AINU_LATN_WORD_PATTERN = /([a-zA-Z\p’'\-=∅ø]+)/;

import { ACCENT_CONVERSION_TABLE, clean } from "./latin";

const CONVERSION_TABLE = {
	a: "ア",
	i: "イ",
	u: "ウ",
	e: "エ",
	o: "オ",
	"'a": "ア",
	"'i": "イ",
	"'u": "ウ",
	"'e": "エ",
	"'o": "オ",
	ka: "カ",
	ki: "キ",
	ku: "ク",
	ke: "ケ",
	ko: "コ",
	sa: "サ",
	si: "シ",
	su: "ス",
	se: "セ",
	so: "ソ",
	ta: "タ",
	tu: "ト゚",
	te: "テ",
	to: "ト",
	ca: "チャ",
	ci: "チ",
	cu: "チュ",
	ce: "チェ",
	co: "チョ",
	CA: "サ゚",
	CU: "ス゚",
	CE: "セ゚",
	CO: "ソ゚",
	na: "ナ",
	ni: "ニ",
	nu: "ヌ",
	ne: "ネ",
	no: "ノ",
	ha: "ハ",
	hi: "ヒ",
	hu: "フ",
	he: "ヘ",
	ho: "ホ",
	pa: "パ",
	pi: "ピ",
	pu: "プ",
	pe: "ペ",
	po: "ポ",
	ma: "マ",
	mi: "ミ",
	mu: "ム",
	me: "メ",
	mo: "モ",
	ya: "ヤ",
	yi: "イ",
	yu: "ユ",
	ye: "イェ",
	yo: "ヨ",
	ra: "ラ",
	ri: "リ",
	ru: "ル",
	re: "レ",
	ro: "ロ",
	wa: "ワ",
	wi: "ヰ",
	we: "ヱ",
	wo: "ヲ",
	nn: "ン",
	tt: "ッ",
} as const;

const CODA_CONS = {
	w: "ゥ",
	y: "ィ",
	m: "ㇺ",
	n: "ㇴ",
	N: "𛅧",
	s: "ㇱ",
	S: "ㇲ",
	p: "ㇷ゚",
	t: "ッ",
	T: "ㇳ",
	k: "ㇰ",
} as const;
// const CODA_VARA: Record<string, Record<string, string>> = {
//   "r": {
//     "a": "ㇻ", "i": "ㇼ", "u": "ㇽ", "e": "ㇾ", "o": "ㇿ"
//   },
//   "h": {
//     "a": "ㇵ", "i": "ㇶ", "u": "ㇷ", "e": "ㇸ", "o": "ㇹ"
//   },
//   "x": {
//     "a": "ㇵ", "i": "ㇶ", "u": "ㇷ", "e": "ㇸ", "o": "ㇹ"
//   }
// };

const CODA_VARA = {
	r: {
		a: "ㇻ",
		i: "ㇼ",
		u: "ㇽ",
		e: "ㇾ",
		o: "ㇿ",
	},
	h: {
		a: "ㇵ",
		i: "ㇶ",
		u: "ㇷ",
		e: "ㇸ",
		o: "ㇹ",
	},
	x: {
		a: "ㇵ",
		i: "ㇶ",
		u: "ㇷ",
		e: "ㇸ",
		o: "ㇹ",
	},
} as const;

const VARIANT_TABLE = {
	// "ト゚": ["ツ゚", "トゥ"],
	ㇴ: ["ン"],
	ヱ: ["ウェ"],
	ヰ: ["ウィ"],
	ヲ: ["ウォ"],
	ㇷ゚パ: ["ッパ"],
	ㇷ゚ピ: ["ッピ"],
	ㇷ゚ペ: ["ッペ"],
	ㇷ゚プ: ["ップ"],
	ㇷ゚ポ: ["ッポ"],
	ㇰカ: ["ッカ"],
	ㇰキ: ["ッキ"],
	ㇰケ: ["ッケ"],
	ㇰク: ["ック"],
	ㇰコ: ["ッコ"],
	ィ: ["イ"],
	ゥ: ["ウ"],
	// ㇻ: ['ㇽ'],
	// ㇼ: ['ㇽ'],
	// ㇾ: ['ㇽ'],
	// ㇿ: ['ㇽ'],
} as const;

// const applyVariants = (
// 	result: string,
// 	variantKeys: string[],
// 	index: number,
// ): string[] => {
// 	if (index > variantKeys.length) {
// 		return [result];
// 	}

// 	const original = variantKeys[index];
// 	const variations = VARIANT_TABLE[original]!;
// 	const allResults = [
// 		result,
// 		...variations.map((variation) => result.replace(original, variation)),
// 	];

// 	let finalResults: string[] = [];
// 	allResults.forEach((res) => {
// 		finalResults = [
// 			...finalResults,
// 			...applyVariants(res, variantKeys, index + 1),
// 		];
// 	});

// 	return finalResults;
// };

// const generateVariants = (target: string): string[] => {
//   const variantKeys = Object.keys(VARIANT_TABLE).filter(original => target.includes(original));
//   return applyVariants(target, variantKeys, 0);
// }

/**
 * Convert Latin script to Katakana script.
 *
 * The original Lua module is available under the CC BY-SA 3.0 license
 * https://ja.wiktionary.org/w/index.php?title=%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB:ain-kana-conv&oldid=1814571
 *
 * @param latn The Latin script string to convert.
 * @returns The Katakana script string.
 */
export function convertLatnToKana(latn: string): string {
	const cleanedLatn = clean(latn).toLowerCase();

	const syllables = separate(cleanedLatn);
	let result = syllables
		.map((syllable, index): string => {
			const nextChar = syllables[index + 1];
			if (syllable.length === 0) {
				return "";
			}

			let remains = syllable;
			let coda = "";

			const lastChar = syllable[syllable.length - 1];

			// console.log(lastChar);

			function isCodaCons(char: string): char is keyof typeof CODA_CONS {
				return char in CODA_CONS;
			}

			function isCodaVara(char: string): char is keyof typeof CODA_VARA {
				return char in CODA_VARA;
			}

			function isSecondLastChar(
				char: string,
			): char is keyof (typeof CODA_VARA)[keyof typeof CODA_VARA] {
				return char in CODA_VARA[lastChar as keyof typeof CODA_VARA];
			}

			if (isCodaCons(lastChar)) {
				// Ends with a coda consonant with no variants
				remains = remains.slice(0, -1);
				coda = CODA_CONS[lastChar];
				if (lastChar === "n" && nextChar) {
					coda = CONVERSION_TABLE.nn;
				}
			} else if (isCodaVara(lastChar)) {
				remains = remains.slice(0, -1);
				const secondLastChar = syllable[syllable.length - 2];
				if (!isSecondLastChar(secondLastChar)) {
					throw new Error(`invalid coda variant: ‘${syllable}’`);
				}
				coda = CODA_VARA[lastChar][secondLastChar];
			}

			// console.log(`remains = "${remains}", coda = "${coda}"`);

			// let accentedFlag = false;
			const nucleus = remains[remains.length - 1];

			if (nucleus in ACCENT_CONVERSION_TABLE) {
				// accentedFlag = true;
				remains = remains.slice(0, -1) + ACCENT_CONVERSION_TABLE[nucleus];
			}

			if (remains.startsWith("’")) {
				remains = remains.slice(1);
			}

			function isNucleus(char: string): char is keyof typeof CONVERSION_TABLE {
				return char in CONVERSION_TABLE;
			}

			if (isNucleus(remains)) {
				remains = CONVERSION_TABLE[remains];
			} else {
				const lowerRemains = remains.toLowerCase();
				if (isNucleus(lowerRemains)) {
					remains = CONVERSION_TABLE[lowerRemains];
				} else {
					throw new Error(`cannot find katakana for CV pair: ‘${remains}’`);
				}
			}

			const converted = remains + coda;

			// if (accentedFlag) {
			//   converted = `<u style='text-decoration:overline;'>${converted}</u>`;
			// }
			return converted;
		})
		.join("");

	// Postprocess
	for (const [variant, replacement] of Object.entries(VARIANT_TABLE)) {
		result = result.replaceAll(variant, replacement[0]);
	}

	return result;
	// TODO: Make configurable
}

const DIAGRAPHS: Record<string, string> = {
	ウェ: "we",
	ウィ: "wi",
	ウォ: "wo",
	トゥ: "tu",
	イェ: "ye",
	エイ: "ey",
	オイ: "oy",
	ウイ: "uy",
};

/**
 * Convert Katakana script to Latin script.
 * @param kana The Katakana string to convert.
 * @returns The Latin string.
 */
export function convertKanaToLatn(kana: string): string {
	// console.log(new RegExp(`${Object.keys(DIAGRAPHS).join('|')}|(\\p{Script_Extensions=Katakana}\u309a?)`, 'u'));
	return (
		kana
			.split(
				new RegExp(
					`(${Object.keys(DIAGRAPHS).join("|")}|\\p{Script_Extensions=Katakana}\u309a?)`,
					"u",
				),
			)
			// .split(/(\\p{Script_Extensions=Katakana}\u309a?)
			.filter(Boolean)
			.map((char) => {
				let result = char;
				if (result === "ン") return "n";
				if (result in DIAGRAPHS) return DIAGRAPHS[result];
				for (const [key, value] of Object.entries(CONVERSION_TABLE)) {
					result = result.replace(value, key);
				}
				// console.log(char);
				for (const [key, value] of Object.entries(CODA_CONS)) {
					result = result.replace(value, key);
				}
				for (const [key, value] of Object.entries(CODA_VARA)) {
					for (const [, value2] of Object.entries(value)) {
						result = result.replace(value2, key);
					}
				}
				for (const [key, value] of [
					["ェ", "e"],
					["ァ", "a"],
					["ィ", "i"],
					["ゥ", "u"],
					["ォ", "o"],
				]) {
					result = result.replace(key, value);
				}
				return result;
			})
			.join("’")
			.replace(/(?<![^aieou])’/g, "") // If the previous character is not a vowel, remove the apostrophe\
			// If the next character is not a vowel, remove the apostrophe
			.replace(/’(?![aieou])/g, "")
		// .replace(/(?=[^aieou])’(?<=[^aieou])/g, '')
	);
	// .replace(/([aueo])i/, '$1y')
	// .replace(/([aieo])u/, '$1w')
	// .replace(/u([aieo])/, 'w$1')
	// .replace(/i([aueo])/, 'y$1');
	// for (const [variant, replacement] of Object.entries(VARIANT_TABLE)) {
	//   kana = kana.replace(variant, replacement[0]);
	// }
	// return kana;
}
