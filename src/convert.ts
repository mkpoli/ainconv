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

export function convertKanaToCyrl(kana: string): string {
  return convertLatnToCyrl(convertKanaToLatn(kana));
}

export function convertCyrlToKana(cyrl: string): string {
  return convertLatnToKana(convertCyrlToLatn(cyrl));
}

export function convertHangToCyrl(hang: string): string {
  return convertLatnToCyrl(convertHangToLatn(hang));
}

export function convertCyrlToHang(cyrl: string): string {
  return convertLatnToHang(convertCyrlToLatn(cyrl));
}

export function convertHangToKana(hang: string): string {
  return convertLatnToKana(convertHangToLatn(hang));
}

export function convertKanaToHang(kana: string): string {
  return convertLatnToHang(convertKanaToLatn(kana));
}
