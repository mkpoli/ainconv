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
} from './convert';

export type Script = 'Kana' | 'Latn' | 'Cyrl' | 'Hang';

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
export function detect(text: string): Script | 'Mixed' | 'Unknown' {
  const hasLatin = /\p{Script_Extensions=Latin}/u.test(text);
  const hasCyrillic = /\p{Script_Extensions=Cyrillic}/u.test(text);
  const hasKana = /\p{Script_Extensions=Katakana}/u.test(text);
  const hasHangul = /\p{Script_Extensions=Hangul}/u.test(text);

  if ([hasLatin, hasCyrillic, hasKana].filter(Boolean).length > 1) {
    return 'Mixed';
  } else if (hasKana) {
    return 'Kana';
  } else if (hasCyrillic) {
    return 'Cyrl';
  } else if (hasHangul) {
    return 'Hang';
  } else if (hasLatin) {
    return 'Latn';
  } else {
    return 'Unknown';
  }
}

export function convert(
  text: string,
  from: Script | undefined | 'Mixed' = undefined,
  to: Script | undefined = undefined
) {
  if (!from) {
    const detected = detect(text);
    if (detected === 'Mixed' && to === undefined) {
      throw new Error('Cannot convert mixed script without specifying target script');
    }
    if (detected === 'Unknown') {
      throw new Error('Cannot convert unknown script');
    }
    from = detected;
  }

  if (!to) {
    to = (
      {
        Latn: 'Kana',
        Kana: 'Latn',
        Cyrl: 'Latn',
        Hang: 'Latn',
        Mixed: 'Latn',
      } as const
    )[from];
  }

  if (from === to) {
    return text;
  }

  if (from === 'Mixed') {
    throw new Error('Cannot convert mixed script currently');
  }

  const convertFunc = (
    {
      Latn: {
        Kana: convertLatnToKana,
        Cyrl: convertLatnToCyrl,
        Hang: convertLatnToHang,
      },
      Kana: {
        Latn: convertKanaToLatn,
        Cyrl: convertKanaToCyrl,
        Hang: convertKanaToHang,
      },
      Cyrl: {
        Latn: convertCyrlToLatn,
        Kana: convertCyrlToKana,
        Hang: convertCyrlToHang,
      },
      Hang: {
        Latn: convertHangToLatn,
        Kana: convertHangToKana,
        Cyrl: convertHangToCyrl,
      },
    } as const
  )[from][to]!;

  // const words = latn.toLowerCase().split(AINU_LATN_WORD_PATTERN).filter(Boolean);
  // const convertedWords = words.map((word) => {
  //   if (word.match(AINU_LATN_WORD_PATTERN)) {
  //     try {
  //       return convertWord(word);
  //     } catch (e) {
  //       console.error(e);
  //       return word;
  //     }
  //   } else {
  //     return word;
  //   }
  // });

  return text
    .split(/\s+/)
    .map((word) => convertFunc(word))
    .join(' ');
}
