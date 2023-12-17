import { convertLatnToKana, convertKanaToLatn } from './conversion/katakana';
import { convertLatnToCyrl, convertCyrlToLatn } from './conversion/cyrillic';
import { convertHangToLatn, convertLatnToHang } from './conversion/hangul';

export {
  convertHangToLatn,
  convertLatnToHang,
  convertLatnToCyrl,
  convertCyrlToLatn,
  convertLatnToKana,
  convertKanaToLatn,
};

/**
 * Convert from Kana script to Cyrillic script.
 * @param kana The Kana string to convert.
 * @returns The Cyrillic string.
 */
export function convertKanaToCyrl(kana: string): string {
  return convertLatnToCyrl(convertKanaToLatn(kana));
}

/**
 * Convert from Cyrillic script to Kana script.
 * @param cyrl The Cyrillic string to convert.
 * @returns The Kana string.
 */
export function convertCyrlToKana(cyrl: string): string {
  return convertLatnToKana(convertCyrlToLatn(cyrl));
}

/**
 * Convert from Hangul script to Cyrillic script.
 * @param hang The Hangul string to convert.
 * @returns The Cyrillic string.
 */
export function convertHangToCyrl(hang: string): string {
  return convertLatnToCyrl(convertHangToLatn(hang));
}

/**
 * Convert from Cyrillic script to Hangul script.
 * @param cyrl The Cyrillic string to convert.
 * @returns The Hangul string.
 */
export function convertCyrlToHang(cyrl: string): string {
  return convertLatnToHang(convertCyrlToLatn(cyrl));
}

/**
 * Convert from Hangul script to Kana script.
 * @param hang The Hangul string to convert.
 * @returns The Kana string.
 */
export function convertHangToKana(hang: string): string {
  return convertLatnToKana(convertHangToLatn(hang));
}

/**
 * Convert from Kana script to Hangul script.
 * @param kana The Kana string to convert.
 * @returns The Hangul string.
 */
export function convertKanaToHang(kana: string): string {
  return convertLatnToHang(convertKanaToLatn(kana));
}
