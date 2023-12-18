import { test, expect } from 'bun:test';
import { convert, detect } from '../src/index';
import {
  convertLatnToKana,
  convertLatnToCyrl,
  convertLatnToHang,
  convertHangToLatn,
  convertCyrlToLatn,
  convertKanaToCyrl,
  convertKanaToHang,
  convertHangToKana,
  convertCyrlToHang,
  convertHangToCyrl,
  convertCyrlToKana,
  convertKanaToLatn,
} from '../src/convert';
import { separate } from '../src/syllable';

test('Script Detection', () => {
  expect(detect('aynu')).toBe('Latn');
  expect(detect('アイヌ')).toBe('Kana');
  expect(detect('айну')).toBe('Cyrl');
  expect(detect('애누')).toBe('Hang');
  expect(detect('Aynuイタㇰ')).toBe('Mixed');
  expect(detect('愛努')).toBe('Unknown');
});

test('Syllable Separation', () => {
  expect(separate('aynu')).toEqual(['ay', 'nu']);
  expect(separate('itak')).toEqual(['i', 'tak']);
  expect(separate('aynuitak')).toEqual(['ay', 'nu', 'i', 'tak']);
  expect(separate('sinep')).toEqual(['si', 'nep']);
  expect(separate('ruunpe')).toEqual(['ru', 'un', 'pe']);
  expect(separate('pekanke')).toEqual(['pe', 'kan', 'ke']);
  expect(separate('eramuskare')).toEqual(['e', 'ra', 'mus', 'ka', 're']);
  expect(separate("hioy'oy")).toEqual(['hi', 'oy', 'oy']);
  expect(separate('irankarapte')).toEqual(['i', 'ran', 'ka', 'rap', 'te']);
  expect(separate('iyayiraykere')).toEqual(['i', 'ya', 'yi', 'ray', 'ke', 're']);
  expect(separate('keyaykosiramsuypa')).toEqual(['ke', 'yay', 'ko', 'si', 'ram', 'suy', 'pa']);
});

const TEST_CASES = [
  ['aynu', ['ay', 'nu'], 'アイヌ', 'айну', '애누', 'ainu'],
  ['itak', ['i', 'tak'], 'イタㇰ', 'итак', '이닥', 'itak'],
  ['aynuitak', ['ay', 'nu', 'i', 'tak'], 'アイヌイタㇰ', 'айнуитак', '애누이닥', 'ainuitak'],
  ['sinep', ['si', 'nep'], 'シネㇷ゚', 'синэп', '시넙', 'sinep'],
  ['ruunpe', ['ru', 'un', 'pe'], 'ルウンペ', 'руунпэ', '루운버', 'ruunpe'],
  ['wenkur', ['we', 'n', 'kur'], 'ウェンクㇽ', 'вэнкур', '펀굴', 'wenkur'],
  ['pekanke', ['pe', 'kan', 'ke'], 'ペカンケ', 'пэканкэ', '버간거', 'pekanke'],
  ['eramuskare', ['e', 'ra', 'mus', 'ka', 're'], 'エラムㇱカレ', 'эрамускарэ', '어라뭇가러', 'eramuskare'],
  ['hioy’oy', ['hi', 'oy', 'oy'], 'ヒオイオイ', 'хиойой', '히외외', 'hioy’oy'],
  ['irankarapte', ['i', 'ran', 'ka', 'rap', 'te'], 'イランカラㇷ゚テ', 'иранкараптэ', '이란가랍더', 'irankarapte'],
  ['iyairaykere', ['i', 'ya', 'yi', 'ray', 'ke', 're'], 'イヤイライケレ', 'ияирайкэрэ', '이야이래거러', 'iyairaikere'],
  ['yayrayke', ['yay', 'ray', 'ke'], 'ヤイライケ', 'яйрайкэ', '얘래거', 'yairaike'],
  [
    'keyaykosiramsuypa',
    ['ke', 'yay', 'ko', 'si', 'ram', 'suy', 'pa'],
    'ケヤイコシラㇺスイパ',
    'кэяйкосирамсуйпа',
    '거얘고시람쉬바',
    'keyaikosiramsuipa',
  ],
  [
    'Ieonnekunnep',
    ['i', 'e', 'on', 'ne', 'kun', 'nep'],
    'イエオンネクンネㇷ゚',
    'иэоннэкуннэп',
    '이어온너군넙',
    'ieonnekunnep',
  ],
] as const;

test('Script Conversion (Latn -> Kana)', () => {
  for (const testCase of TEST_CASES) {
    const latn = testCase[0];
    const kana = testCase[2];
    // console.log('LATN = ', latn);
    // console.log('KANA = ', kana);
    // console.log('-> KANA = ', convertLatnToKana(latn));
    expect(convertLatnToKana(latn)).toBe(kana);
  }
});

test('Script Conversion (Latn -> Cyrl)', () => {
  for (const testCase of TEST_CASES) {
    const latn = testCase[0];
    const cyrl = testCase[3];
    // console.log('LATN = ', latn);
    // console.log('CYRL = ', cyrl);
    // console.log('-> CYRL = ', convertLatnToCyrl(latn));
    expect(convertLatnToCyrl(latn)).toBe(cyrl);
  }
});

test('Script Conversion (Cyrl -> Latn)', () => {
  for (const testCase of TEST_CASES) {
    const latn = testCase[0];
    const cyrl = testCase[3];
    // console.log('CYRL = ', cyrl);
    // console.log('LATN = ', latn);
    // console.log('-> LATN = ', convertCyrlToLatn(cyrl));
    expect(convertCyrlToLatn(cyrl)).toBe(latn.toLowerCase());
  }
});

test('Script Conversion (Latn -> Hang)', () => {
  for (const testCase of TEST_CASES) {
    const latn = testCase[0];
    const hang = testCase[4];
    console.log(latn);
    console.log(hang);
    console.log(convertLatnToHang(latn));
    expect(convertLatnToHang(latn)).toBe(hang);
  }
});

test('Script Conversion (Hang -> Latn)', () => {
  for (const testCase of TEST_CASES) {
    const latn = testCase[0];
    const hang = testCase[4];
    // console.log(hang);
    // console.log(latn);
    // console.log(convertHangToLatn(hang));
    expect(convertHangToLatn(hang)).toBe(latn.toLowerCase());
  }
});

test('Script Conversion (Cyrillic -> Kana)', () => {
  for (const testCase of TEST_CASES) {
    const kana = testCase[2];
    const cyrl = testCase[3];
    // console.log(cyrl);
    // console.log(kana);
    // console.log(convertCyrlToKana(cyrl));
    expect(convertCyrlToKana(cyrl)).toBe(kana);
  }
});

test('Script Conversion (Hangul -> Cyrillic)', () => {
  for (const testCase of TEST_CASES) {
    const hang = testCase[4];
    const cyrl = testCase[3];
    // console.log(hang);
    // console.log(cyrl);
    // console.log(convertHangToCyrl(hang));
    expect(convertHangToCyrl(hang)).toBe(cyrl);
  }
});

test('Script Conversion (Cyrillic -> Hangul)', () => {
  for (const testCase of TEST_CASES) {
    const hang = testCase[4];
    const cyrl = testCase[3];
    // console.log(cyrl);
    // console.log(hang);
    // console.log(convertCyrlToHang(cyrl));
    expect(convertCyrlToHang(cyrl)).toBe(hang);
  }
});

test('Script Conversion (Hangul -> Kana)', () => {
  for (const testCase of TEST_CASES) {
    const kana = testCase[2];
    const hang = testCase[4];
    // console.log(hang);
    // console.log(kana);
    // console.log(convertHangToKana(hang));
    expect(convertHangToKana(hang)).toBe(kana);
  }
});

// Lossy conversion

test('Script Conversion (Kana -> Latn)', () => {
  for (const testCase of TEST_CASES) {
    const kana = testCase[2];
    const latnLossy = testCase[5];
    // console.log('KANA = ', kana);
    // console.log('LATN = ', latnLossy);
    // console.log('-> LATN = ', convertKanaToLatn(kana));
    expect(convertKanaToLatn(kana)).toBe(latnLossy.toLowerCase());
  }
});

test('Script Conversion (Kana -> Cyrillic)', () => {
  for (const testCase of TEST_CASES) {
    const kana = testCase[2];
    const latnLossy = testCase[5];
    const cyrlLossy = convertLatnToCyrl(latnLossy);
    // console.log(kana);
    // console.log(cyrl);
    // console.log(convertKanaToCyrl(kana));
    expect(convertKanaToCyrl(kana)).toBe(cyrlLossy);
  }
});

test('Script Conversion (Kana -> Hangul)', () => {
  for (const testCase of TEST_CASES) {
    const kana = testCase[2];
    const latnLossy = testCase[5];
    const hangLossy = convertLatnToHang(latnLossy);
    // console.log(kana);
    // console.log(hang);
    // console.log(convertKanaToHang(kana));
    expect(convertKanaToHang(kana)).toBe(hangLossy);
  }
});

// expect(convertLatnToKana('aynu')).toBe('アイヌ');test('Script Conversion (Hangul -> Cyrillic)', () => {

// expect(convertLatnToCyrl('aynu')).toBe('айну');
// expect(convertLatnToHang('aynu')).toBe('애누');

test('Automatic Conversion (Latn -> Kana)', () => {
  expect(convert('irankarapte', 'Latn', 'Kana')).toBe('イランカラㇷ゚テ');
  expect(convert('イランカラㇷ゚テ', 'Kana')).toBe('irankarapte');
  expect(convert('irankarapte', 'Latn')).toBe('イランカラㇷ゚テ');
  expect(convert('イランカラㇷ゚テ', undefined, 'Latn')).toBe('irankarapte');
});
