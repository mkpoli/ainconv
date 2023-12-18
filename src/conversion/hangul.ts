import { ACCENT_CONVERSION_TABLE, VOWELS, clean } from './latin';
import { separate } from '../syllable';

const LATN_2_HANG_TABLE: Record<string, string> = {
  a: 'ㅏ',
  i: 'ㅣ',
  u: 'ㅜ',
  e: 'ㅓ',
  o: 'ㅗ',
  m: 'ㅁ',
  n: 'ㄴ',
  p: 'ㅂ',
  t: 'ㄷ',
  k: 'ㄱ',
  '’': 'ㅇ',
  c: 'ㅈ',
  s: 'ㅅ',
  h: 'ㅎ',
  r: 'ㄹ',
  w: 'ㅍ',
  // TODO: w: 'ㅸ',
  y: 'ㅣ',
};

const HANG_VOWEL_COMBINATION_TABLE: Record<string, string> = {
  ㅣㅏㅣ: 'ㅒ', // yay
  ㅣㅓㅣ: 'ㅖ', // yey
  ㅏㅣ: 'ㅐ', // ay
  ㅓㅣ: 'ㅔ', // ey
  ㅜㅣ: 'ㅟ', // uy
  ㅗㅣ: 'ㅚ', // oy
  ㅣㅏ: 'ㅑ', // ya
  ㅣㅓ: 'ㅕ', // ye
  ㅣㅜ: 'ㅠ', // yu
  ㅣㅗ: 'ㅛ', // yo
  // ㅣㅣ: 'ㅣ', // yi
  // ㅣㅐ: 'ㅒ', // yay
  // ㅣㅔ: 'ㅖ', // yey
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
  ㅟ: 16,
  ㅠ: 17,
  ㅣ: 20,
};

// Record of final consonants (jongseong)
const FINALS: Record<string, number> = {
  '': 0,
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
  latn = clean(latn).toLowerCase();

  if (latn.length === 0) {
    return '';
  }

  // TODO: Separate by word boundaries

  // Separate by syllables
  let syllables = separate(latn);
  // console.log('syllables', syllables);

  for (const [accented, unaccented] of Object.entries(ACCENT_CONVERSION_TABLE)) {
    syllables = syllables.map((syllable) => syllable.replace(accented, unaccented));
  }

  const convertedSyllables = syllables
    .map((syllable) => {
      if (VOWELS.includes(syllable[0]) || syllable[0] === 'y') {
        syllable = '’' + syllable;
      }
      // if (syllable.charAt(-1) === 'y') {
      //   syllable = LATN_2_HANG_TABLE[syllable.slice(0, -1)] + 'ㅣ';
      return [...syllable].map((char) => LATN_2_HANG_TABLE[char]).join('');
    })
    .map((syllable) => {
      // console.log('syllable', syllable);
      for (const [key, value] of Object.entries(HANG_VOWEL_COMBINATION_TABLE)) {
        syllable = syllable.replace(key, value);
      }
      // Convert vowel combinations
      return syllable.replace(/ㅣㅣ/g, 'ㅣ');
    });

  // console.log('convertedSyllables', convertedSyllables);

  const hangulCharacters = convertedSyllables.map((syllable) => {
    // Record of initial consonants (choseong)

    // Split the input into individual characters
    const chars = Array.from(syllable);
    if (chars.length < 2 || chars.length > 3) {
      throw new Error('Invalid input: Hangul syllables must consist of 2 or 3 characters.');
    }

    // Find the indices of initial, medial, (and final) components
    const initialIndex = INITIALS[chars[0]];
    const medialIndex = MEDIALS[chars[1]];
    const finalIndex = chars.length === 3 ? FINALS[chars[2]] : 0;

    if (initialIndex === undefined || medialIndex === undefined || finalIndex === undefined) {
      throw new Error(`Invalid input: Characters must be valid Hangul components. ${chars}`);
    }

    return String.fromCharCode(0xac00 + (initialIndex * 21 + medialIndex) * 28 + finalIndex);
  });

  return hangulCharacters.join('');
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
  // Helper function to decompose a Hangul character
  const decomposeHangul = (char: string) => {
    const code = char.charCodeAt(0) - 0xac00;
    const finalIndex = code % 28;
    const medialIndex = ((code - finalIndex) / 28) % 21;
    const initialIndex = ((code - finalIndex) / 28 - medialIndex) / 21;
    return [initialIndex, medialIndex, finalIndex];
  };

  // Reverse lookup tables
  const reverseInitials = Object.fromEntries(Object.entries(INITIALS).map(([k, v]) => [v, k]));
  const reverseMedials = Object.fromEntries(Object.entries(MEDIALS).map(([k, v]) => [v, k]));
  const reverseFinals = Object.fromEntries(Object.entries(FINALS).map(([k, v]) => [v, k]));

  const decomposed = Array.from(hang)
    .map((char) => {
      // console.log('char', char);
      // Decompose Hangul character
      const [initialIndex, medialIndex, finalIndex] = decomposeHangul(char);

      // Map decomposed indices to Latin characters
      const initial = reverseInitials[initialIndex] || '';
      const medial = reverseMedials[medialIndex] || '';
      const final = reverseFinals[finalIndex] || '';

      return initial + medial + final;
    })
    .map((hangul) => {
      // console.log('hangulB', hangul);
      for (const [key, value] of Object.entries(HANG_VOWEL_COMBINATION_TABLE)) {
        hangul = hangul.replace(value, key);
      }
      // console.log('hangulA', hangul);
      return hangul;
    });

  // console.log('decomposed', decomposed);

  const latin = decomposed
    .map((hangul) => {
      for (const [key, value] of Object.entries(LATN_2_HANG_TABLE)) {
        hangul = hangul.replace(value, key);
      }
      return hangul;
    })
    .map((latn) => {
      // console.log('latn:', latn);

      // ’iV -> yV
      latn = latn.replace(/’i(?=[aeiou])/, 'y');
      // console.log('’iV->yV :', latn);
      // Vi -> Vy
      latn = latn.replace(/(?<=[aeiou])i/, 'y');
      // console.log('Vi->Vy :', latn);
      return latn;
    });

  // console.log('latin', latin);
  return latin.join('').replace(/(?<![^aieou])’/g, '');
}
