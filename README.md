# ainconv - Ainu language script converter

![npm](https://img.shields.io/npm/v/ainconv)
![GitHub issues](https://img.shields.io/github/issues/mkpoli/ainconv)
![npm](https://img.shields.io/npm/dw/ainconv)
![GitHub](https://img.shields.io/github/license/mkpoli/ainconv)

## Overview
This npm package provides a comprehensive set of functions for converting text between different writing systems of the [Ainu language](https://en.wikipedia.org/wiki/Ainu_language).

Currently, Latin (Romanization), Katakana, Cyrillic and Hangul scripts are supported. We are also planning to convert between different romanization systems and Katakana variants. Currently only the more adopted version of Latin script and lossy Katakana script are supported. 

Sentence conversion is planned to be supported in the future. For now, only well-formed single word is accepted. The converted string are always in lower case.

### Important Note
Conversion between Latin, Cyrillic and Hangul script are lossless, however, conversion between Katakana and other scripts are lossy. This means that converting from Katakana to other scripts and then back to Katakana may not give the original string and the result may be ambiguous or even incorrect.

This is because the Katakana script used broadly for the Ainu language is intrinsically ambiguous. For example, it does not distinguish between *tow* and *tu* (both *トゥ*), *iw* and *i.u* (both *イウ*), *ay* and *ai* (both *アイ*), etc. Some alternative Katakana scripts are proposed to solve this problem, but none of them are widely adopted. We are planning to support some of these alternative scripts in the future.

## Installation
Install the package using npm (or bun, yarn, pnpm, etc.)
```bash
npm install ainconv
```

## Usage
### Word Conversion
```javascript
import { convert } from 'ainconv';

console.log(convert('イランカラㇷ゚テ', 'Kana', 'Latn')); // 'irankarapte'
console.log(convert('irankarapte', 'Latn', 'Kana')); // 'イランカラㇷ゚テ'
console.log(convert('иранкараптэ', 'Cyrl', 'Latn')); // 'irankarapte'
console.log(convert('irankarapte', 'Latn', 'Cyrl')); // 'иранкараптэ'
console.log(convert('이란가랍더', 'Hang', 'Latn')); // 'irankarapte'
console.log(convert('irankarapte', 'Latn', 'Hang')); // '이란가랍더'

// or use the alternative api

import {
    convertLatnToKana,
    convertKanaToCyrl,
    // ...
} from 'ainconv/convert';
convertLatnToKana('aynukotan'); // 'アイヌコタン'
convertKanaToCyrl('アイヌコタン'); // аинукотан
```

### Extra Functionality

#### Script Detection
Detect the script of a given string.
```javascript
import { detect } from 'ainconv';

console.log(detect('aynu')); // 'Latn'
console.log(detect('アイヌ')); // 'Kana'
console.log(detect('айну')); // 'Cyrl'
console.log(detect('애누')); // 'Hang'
```

#### Syllable Splitting
```javascript
import { separate } from 'ainconv/syllable';

console.log(separate('eyaykosiramsuypa')); // [ 'e', 'yay', 'ko', 'si', 'ram', 'suy', 'pa' ]
```

## Development
We use [bun](https://bun.sh/) as the build tool.

### Build
```bash
bun run build
```

### Test
```bash
bun test
```

## License
[MIT License](LICENSE) (c) 2023 mkpoli
