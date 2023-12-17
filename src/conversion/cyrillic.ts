const LATN_2_CYRL_TABLE: Record<string, string> = {
  a: 'а',
  i: 'и',
  u: 'у',
  e: 'э',
  o: 'о',
  k: 'к',
  s: 'с',
  t: 'т',
  c: 'ц',
  h: 'х',
  m: 'м',
  n: 'н',
  p: 'п',
  r: 'р',
  w: 'в',
  yu: 'ю',
  ya: 'я',
  yo: 'ё',
  ye: 'е',
  // yi: 'и',
  y: 'й',
  // x: 'х',
  "'": 'ъ',
};

/**
 * Convert Latin script to Cyrillic script
 *
 * Proposals
 * * https://note.com/qvarie/n/n5f935a37b354
 *
 * @param input
 * @returns
 */
export function convertLatnToCyrl(latn: string): string {
  let result = latn;

  // Convert multi-character sequences first
  const multiCharKeys = [
    'yu',
    'ya',
    'yo',
    'ye',
    //'yi'
  ];
  for (const key of multiCharKeys) {
    const cyrl = LATN_2_CYRL_TABLE[key];
    const cyrlUppercase = cyrl.toUpperCase();
    const regex = new RegExp(key, 'g');
    const regexUppercase = new RegExp(key.toUpperCase(), 'g');
    result = result.replace(regex, cyrl);
    result = result.replace(regexUppercase, cyrlUppercase);
  }

  // Convert the remaining characters
  for (const [latn, cyrl] of Object.entries(LATN_2_CYRL_TABLE)) {
    if (!multiCharKeys.includes(latn)) {
      const cyrlUppercase = cyrl.toUpperCase();
      const regex = new RegExp(latn, 'g');
      const regexUppercase = new RegExp(latn.toUpperCase(), 'g');
      result = result.replace(regex, cyrl);
      result = result.replace(regexUppercase, cyrlUppercase);
    }
  }

  return result.replace('’', '');
}

export function convertCyrlToLatn(cyrl: string): string {
  let result = cyrl
    .replace('ъ', "'")
    // йV -> й’V
    .replace(/й([аеиоуэюя])/g, 'й’$1');

  // Assuming CYRL_2_LATN_TABLE is the reverse of LATN_2_CYRL_TABLE
  const CYRL_2_LATN_TABLE = Object.fromEntries(Object.entries(LATN_2_CYRL_TABLE).map(([key, value]) => [value, key]));
  // Convert multi-character sequences first
  const multiCharKeys = Object.keys(CYRL_2_LATN_TABLE).filter((key) => key.length > 1);
  for (const key of multiCharKeys) {
    const latn = CYRL_2_LATN_TABLE[key];
    const latnUppercase = latn.toUpperCase();
    const regex = new RegExp(key, 'g');
    const regexUppercase = new RegExp(key.toUpperCase(), 'g');
    result = result.replace(regex, latn);
    result = result.replace(regexUppercase, latnUppercase);
  }

  // Convert the remaining characters
  for (const [cyrl, latn] of Object.entries(CYRL_2_LATN_TABLE)) {
    if (!multiCharKeys.includes(cyrl)) {
      const latnUppercase = latn.toUpperCase();
      const regex = new RegExp(cyrl, 'g');
      const regexUppercase = new RegExp(cyrl.toUpperCase(), 'g');
      result = result.replace(regex, latn);
      result = result.replace(regexUppercase, latnUppercase);
    }
  }

  return result.replace('yi', 'i');
}

// export function convertCyrlToLatn(cyrl: string) {
//   let result = cyrl;

//   // Convert multi-character sequences first
//   const multiCharKeys = ['ю', 'я', 'ё', 'е', 'и'];
//   for (const key of multiCharKeys) {
//     const latn = LATN_2_CYRL_TABLE[key];
//     const latnUppercase = latn.toUpperCase();
//     const regex = new RegExp(key, 'g');
//     const regexUppercase = new RegExp(key.toUpperCase(), 'g');
//     result = result.replace(regex, latn);
//     result = result.replace(regexUppercase, latnUppercase);
//   }

//   // Convert the remaining characters
//   for (const [latn, cyrl] of Object.entries(LATN_2_CYRL_TABLE)) {
//     if (!multiCharKeys.includes(latn)) {
//       const latnUppercase = latn.toUpperCase();
//       const regex = new RegExp(cyrl, 'g');
//       const regexUppercase = new RegExp(cyrl.toUpperCase(), 'g');
//       result = result.replace(regex, latn);
//       result = result.replace(regexUppercase, latnUppercase);
//     }
//   }

//   return result;
// }
