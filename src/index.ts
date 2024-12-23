import {
	convertCyrlToHang,
	convertCyrlToKana,
	convertCyrlToLatn,
	convertHangToCyrl,
	convertHangToKana,
	convertHangToLatn,
	convertKanaToCyrl,
	convertKanaToHang,
	convertKanaToLatn,
	convertLatnToCyrl,
	convertLatnToHang,
	convertLatnToKana,
} from "./convert";
import { separate } from "./syllable";

export type Script = "Kana" | "Latn" | "Cyrl" | "Hang";

/**
 * Detects the script type of a given Ainu language string.
 *
 * This function categorizes the script into one of several types based on the characters present in the string.
 * It supports Latin, Cyrillic, Katakana, and Hangul scripts, and can also identify mixed or unknown scripts.
 *
 * @param {string} text - The text string to be analyzed for script type.
 * @returns {('Kana' | 'Cyrl' | 'Hang' | 'Latn' | 'Mixed' | 'Unknown')} - The detected script type:
 *           'Kana' for Katakana, 'Cyrl' for Cyrillic, 'Hang' for Hangul, 'Latn' for Latin,
 *           'Mixed' if multiple scripts are detected (excluding Hangul),
 *           or 'Unknown' if no script is detected.
 */
export function detect(text: string): Script | "Mixed" | "Unknown" {
	const hasLatin = /\p{Script_Extensions=Latin}/u.test(text);
	const hasCyrillic = /\p{Script_Extensions=Cyrillic}/u.test(text);
	const hasKana = /\p{Script_Extensions=Katakana}/u.test(text);
	const hasHangul = /\p{Script_Extensions=Hangul}/u.test(text);

	if ([hasLatin, hasCyrillic, hasKana].filter(Boolean).length > 1) {
		return "Mixed";
	}

	if (hasKana) {
		return "Kana";
	}
	if (hasCyrillic) {
		return "Cyrl";
	}
	if (hasHangul) {
		return "Hang";
	}
	if (hasLatin) {
		return "Latn";
	}

	return "Unknown";
}

// function convertSentence(sentence: string, converter: (word: string) => string): string {
//   const words = sentence.split(/(\s+)/);
//   return words.map(converter).join(' ');
// }

function selectWordConverter(
	from: Script | "Unknown" | "Mixed",
	to: Script | undefined,
): (word: string) => string {
	if (from === "Mixed") {
		throw new Error("Cannot convert mixed script currently");
	}

	if (from === "Unknown") {
		throw new Error("Cannot convert unknown script");
	}

	const target =
		to ??
		(
			{
				Latn: "Kana",
				Kana: "Latn",
				Cyrl: "Latn",
				Hang: "Latn",
				Mixed: "Latn",
				Unknown: "Latn",
			} as const
		)[from];

	if (from === "Latn" && target === "Kana") {
		return convertLatnToKana;
	}

	if (from === "Latn" && target === "Cyrl") {
		return convertLatnToCyrl;
	}

	if (from === "Latn" && target === "Hang") {
		return convertLatnToHang;
	}

	if (from === "Kana" && target === "Latn") {
		return convertKanaToLatn;
	}

	if (from === "Kana" && target === "Cyrl") {
		return convertKanaToCyrl;
	}

	if (from === "Kana" && target === "Hang") {
		return convertKanaToHang;
	}

	if (from === "Cyrl" && target === "Latn") {
		return convertCyrlToLatn;
	}

	if (from === "Cyrl" && target === "Kana") {
		return convertCyrlToKana;
	}

	if (from === "Cyrl" && target === "Hang") {
		return convertCyrlToHang;
	}

	if (from === "Hang" && target === "Latn") {
		return convertHangToLatn;
	}

	if (from === "Hang" && target === "Kana") {
		return convertHangToKana;
	}

	if (from === "Hang" && target === "Cyrl") {
		return convertHangToCyrl;
	}

	return (word: string) => word;
}

/**
 * Converts a string of Ainu word from one script to another. If the `from` script is not specified, it will be detected automatically. If the `to` script is not specified, it will be decided based on the `from` script, that is, all scripts except Latin will be converted to Latin, and Latin will be converted to Katakana. If `from` is equal to `to`, the original string will be returned.
 *
 * Mixed script is not supported yet. If the `from` script is `Mixed`, an error will be thrown for now.
 *
 * @param {string} text - The text string to be converted.
 * @param {('Kana' | 'Latn' | 'Cyrl' | 'Hang' | 'Mixed')} [from] - The script to convert from.
 * @param {('Kana' | 'Latn' | 'Cyrl' | 'Hang')} [to] - The script to convert to.
 */
export function convert(
	text: string,
	from: Script | undefined | "Mixed" = undefined,
	to: Script | undefined = undefined,
) {
	return selectWordConverter(from ?? detect(text), to)(text);
}

export {
	convertHangToLatn,
	convertLatnToHang,
	convertLatnToCyrl,
	convertCyrlToLatn,
	convertLatnToKana,
	convertKanaToLatn,
	convertKanaToCyrl,
	convertCyrlToKana,
	convertHangToCyrl,
	convertCyrlToHang,
	convertHangToKana,
	convertKanaToHang,
	separate,
};
