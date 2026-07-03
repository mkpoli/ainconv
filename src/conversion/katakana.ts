/**
 * This is a TypeScript port of the original Lua (Scribunto) module by User:Mkpoli (same individual as this projects' author) and User:BrassSnail, with modifications to comply the common Ainu kanaization conventions
 * The original Lua module is available under the CC BY-SA 3.0 license
 * https://ja.wiktionary.org/w/index.php?title=%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB:ain-kana-conv&oldid=1814571
 */

import { separate } from "../syllable";

// const AINU_LATN_WORD_PATTERN = /([a-zA-Z\p’'\-=∅ø]+)/;

import { ACCENT_CONVERSION_TABLE, clean, convertFromLatin } from "./latin";

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
	// tt: "ッ",
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

/**
 * Options controlling how romanized Ainu is rendered into Katakana. Each flag,
 * when `true`, keeps a compact kana instead of spelling it out; all default to
 * `false` (the spelled-out form). Mirrors the shared catalog in ainconv-tests
 * (`options.schema.json`).
 */
export interface KanaConversionOptions {
	/** Keep ヰ (wi) instead of spelling it out as ウィ. */
	useWi?: boolean;
	/** Keep ヱ (we) instead of spelling it out as ウェ. */
	useWe?: boolean;
	/** Keep ヲ (wo) instead of spelling it out as ウォ. */
	useWo?: boolean;
	/** Keep the small ィ for the -y coda instead of イ. */
	useSmallI?: boolean;
	/** Keep the small ゥ for the -w coda instead of ウ. */
	useSmallU?: boolean;
	/** Keep ㇴ for the -n coda instead of ン. */
	useSmallN?: boolean;
}

/** Gemination normalization, always applied (not user-configurable). */
export const GEMINATION_TABLE = {
	ㇷ゚パ: "ッパ",
	ㇷ゚ピ: "ッピ",
	ㇷ゚ペ: "ッペ",
	ㇷ゚プ: "ップ",
	ㇷ゚ポ: "ッポ",
	ㇰカ: "ッカ",
	ㇰキ: "ッキ",
	ㇰケ: "ッケ",
	ㇰク: "ック",
	ㇰコ: "ッコ",
} as const;

const HALF_WIDTH_KATAKANA_TABLE = {
	// ア行
	ｱ: "ァ",
	ｲ: "ィ",
	ｳ: "ゥ",
	ｴ: "ェ",
	ｵ: "ォ",

	// カ行
	ｸ: "ㇰ",
	ｹ: "ヶ",

	// サ行
	ｼ: "ㇱ",
	ｽ: "ㇲ",

	// タ行
	ﾄ: "ㇳ",
	ﾀ: "ㇴ",

	// ナ行
	ﾇ: "ㇴ",

	// ハ行
	ﾊ: "ㇵ",
	ﾋ: "ㇶ",
	ﾌ: "ㇷ",
	ﾍ: "ㇸ",
	ﾎ: "ㇹ",

	// パ行
	ﾌﾟ: "ㇷ゚",

	// マ行
	ﾑ: "ㇺ",

	// ヤ行
	ﾔ: "ャ",
	ﾕ: "ュ",
	ﾖ: "ョ",

	// ラ行
	ﾗ: "ㇻ",
	ﾘ: "ㇼ",
	ﾙ: "ㇽ",
	ﾚ: "ㇾ",
	ﾛ: "ㇿ",

	// ワ行
	ﾜ: "ヮ",
	ｦ: "𛅦",

	// 撥音
	ﾝ: "𛅧",

	// There is no half-width version of ヱ (we) and ヰ (wi)
} as const;

const HIRAGANA_TO_KATAKANA_TABLE = {
	あ: "ア",
	い: "イ",
	う: "ウ",
	ゔ: "ヴ",
	え: "エ",
	お: "オ",
	か: "カ",
	き: "キ",
	く: "ク",
	け: "ケ",
	こ: "コ",
	が: "ガ",
	ぎ: "ギ",
	ぐ: "グ",
	げ: "ゲ",
	ご: "ゴ",
	さ: "サ",
	し: "シ",
	す: "ス",
	せ: "セ",
	そ: "ソ",
	ざ: "ザ",
	じ: "ジ",
	ず: "ズ",
	ぜ: "ゼ",
	ぞ: "ゾ",
	た: "タ",
	ち: "チ",
	つ: "ツ",
	て: "テ",
	と: "ト",
	だ: "ダ",
	ぢ: "ヂ",
	づ: "ヅ",
	で: "デ",
	ど: "ド",
	な: "ナ",
	に: "ニ",
	ぬ: "ヌ",
	ね: "ネ",
	の: "ノ",
	は: "ハ",
	ひ: "ヒ",
	ふ: "フ",
	へ: "ヘ",
	ほ: "ホ",
	ば: "バ",
	び: "ビ",
	ぶ: "ブ",
	べ: "ベ",
	ぼ: "ボ",
	ぱ: "パ",
	ぴ: "ピ",
	ぷ: "プ",
	ぺ: "ペ",
	ぽ: "ポ",
	ま: "マ",
	み: "ミ",
	む: "ム",
	め: "メ",
	も: "モ",
	や: "ヤ",
	ゆ: "ユ",
	よ: "ヨ",
	ら: "ラ",
	り: "リ",
	る: "ル",
	れ: "レ",
	ろ: "ロ",
	わ: "ワ",
	ゐ: "ヰ",
	ゑ: "ヱ",
	を: "ヲ",
	ん: "ン",
	っ: "ッ",
	ゃ: "ャ",
	ゅ: "ュ",
	ょ: "ョ",
	ぁ: "ァ",
	ぃ: "ィ",
	ぅ: "ゥ",
	ぇ: "ェ",
	ぉ: "ォ",
	ゎ: "ヮ",
	𛅐: "𛅤",
	𛅑: "𛅥",
	𛅒: "𛅦",
} as const;

const NON_COMBINING_MODIFIERS = {
	゜: "゚",
	゛: "゛",
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
export function convertLatnToKana(
	latn: string,
	options: KanaConversionOptions = {},
): string {
	function convertWord(word: string): string {
		const cleanedLatn = clean(word).toLowerCase();

		if (cleanedLatn === "p") {
			return "ㇷ゚";
		}

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

				function isNucleus(
					char: string,
				): char is keyof typeof CONVERSION_TABLE {
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

		// Postprocess: always normalize gemination, then expand each compact kana
		// to its spelled-out form unless the caller opted to keep it. Smalls run
		// before the w-series so the spelled-out ウィ/ウェ/ウォ digraphs keep their
		// small kana.
		for (const [compact, replacement] of Object.entries(GEMINATION_TABLE)) {
			result = result.replaceAll(compact, replacement);
		}
		if (!options.useSmallI) result = result.replaceAll("ィ", "イ");
		if (!options.useSmallU) result = result.replaceAll("ゥ", "ウ");
		if (!options.useSmallN) result = result.replaceAll("ㇴ", "ン");
		if (!options.useWe) result = result.replaceAll("ヱ", "ウェ");
		if (!options.useWi) result = result.replaceAll("ヰ", "ウィ");
		if (!options.useWo) result = result.replaceAll("ヲ", "ウォ");

		return result;
	}

	return convertFromLatin(latn, convertWord);
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

const SMALL_KATAKANA_CHARS =
	Object.values(CODA_CONS).join("") +
	Object.values(CODA_VARA)
		.map((v) => Object.values(v).join(""))
		.join("");

/**
 * Convert Katakana script to Latin script.
 * @param kana The Katakana string to convert.
 * @returns The Latin string.
 */
export function convertKanaToLatn(kana: string): string {
	function convertWord(word: string): string {
		return (
			word
				.replaceAll(
					new RegExp(`${Object.keys(NON_COMBINING_MODIFIERS).join("|")}`, "gu"),
					(char) =>
						NON_COMBINING_MODIFIERS[
							char as keyof typeof NON_COMBINING_MODIFIERS
						],
				)
				// normalize combining diacritical marks
				.normalize("NFC")
				.replaceAll(
					new RegExp(
						`${Object.keys(HIRAGANA_TO_KATAKANA_TABLE).join("|")}`,
						"gu",
					),
					(char) =>
						HIRAGANA_TO_KATAKANA_TABLE[
							char as keyof typeof HIRAGANA_TO_KATAKANA_TABLE
						],
				)
				.split(
					new RegExp(
						`(${Object.keys(DIAGRAPHS).join("|")}|\\p{Script_Extensions=Katakana}\u309a?)(?![${
							SMALL_KATAKANA_CHARS
						}])`,
						"u",
					),
				)
				.map((char) => {
					if (char in HALF_WIDTH_KATAKANA_TABLE) {
						return HALF_WIDTH_KATAKANA_TABLE[
							char as keyof typeof HALF_WIDTH_KATAKANA_TABLE
						];
					}
					return char;
				})
				// .split(/(\\p{Script_Extensions=Katakana}\u309a?)
				.filter(Boolean)
				.map((char) => {
					let result = char;
					if (result === "ン" || result === "ﾝ") return "n";
					if (result in DIAGRAPHS) return DIAGRAPHS[result];
					for (const [key, value] of Object.entries(CONVERSION_TABLE)) {
						result = result.replace(value, key);
					}
					// console.log(char);
					for (const [key, value] of Object.entries(CODA_CONS)) {
						result = result.replace(value, key.toLowerCase());
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
				.replace(/(?<![^aieou])’/g, "") // If the previous character is not a consonant, remove the apostrophe\
				.replace(/’(?![aieou])/g, "") // If the next character is not a vowel, remove the apostrophe
			// .replace(/(?=[^aieou])’(?<=[^aieou])/g, '')
		);
	}

	const REGEX =
		/([\p{Script_Extensions=Katakana}\p{Script_Extensions=Hiragana}'’＝]+)/u;
	return kana
		.split(REGEX)
		.map((w) => (REGEX.test(w) ? convertWord(w) : w))
		.join("");
	// .replace(/([aueo])i/, '$1y')
	// .replace(/([aieo])u/, '$1w')
	// .replace(/u([aieo])/, 'w$1')
	// .replace(/i([aueo])/, 'y$1');
	// for (const [variant, replacement] of Object.entries(VARIANT_TABLE)) {
	//   kana = kana.replace(variant, replacement[0]);
	// }
	// return kana;
}
