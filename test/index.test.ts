import { expect, test } from "bun:test";
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
} from "../src/convert";
import { convert, detect } from "../src/index";
import { separate } from "../src/syllable";

import ROBUSTNESS from "./cases/robustness.json";
import TEST_CASES from "./cases/test_cases.json";

function removeSpaceBetweenP(str: string) {
	return str.match(/ p\b/) ? str.replace(" p", "p") : str;
}

test("Script Detection", () => {
	expect(detect("aynu")).toBe("Latn");
	expect(detect("アイヌ")).toBe("Kana");
	expect(detect("айну")).toBe("Cyrl");
	expect(detect("애누")).toBe("Hang");
	expect(detect("Aynuイタㇰ")).toBe("Mixed");
	expect(detect("愛努")).toBe("Unknown");
});

test("Syllable Separation", () => {
	expect(separate("aynu")).toEqual(["ay", "nu"]);
	expect(separate("itak")).toEqual(["i", "tak"]);
	expect(separate("aynuitak")).toEqual(["ay", "nu", "i", "tak"]);
	expect(separate("sinep")).toEqual(["si", "nep"]);
	expect(separate("ruunpe")).toEqual(["ru", "un", "pe"]);
	expect(separate("pekanke")).toEqual(["pe", "kan", "ke"]);
	expect(separate("eramuskare")).toEqual(["e", "ra", "mus", "ka", "re"]);
	expect(separate("hioy'oy")).toEqual(["hi", "oy", "oy"]);
	expect(separate("irankarapte")).toEqual(["i", "ran", "ka", "rap", "te"]);
	expect(separate("iyayiraykere")).toEqual([
		"i",
		"ya",
		"yi",
		"ray",
		"ke",
		"re",
	]);
	expect(separate("keyaykosiramsuypa")).toEqual([
		"ke",
		"yay",
		"ko",
		"si",
		"ram",
		"suy",
		"pa",
	]);
});

test("Script Conversion (Latn -> Kana)", () => {
	for (const testCase of TEST_CASES) {
		const { latn, kana } = testCase;
		// console.log('LATN = ', latn);
		// console.log('KANA = ', kana);
		// console.log('-> KANA = ', convertLatnToKana(latn));
		expect(convertLatnToKana(latn)).toBe(
			kana.replace("ㇰカ", "ッカ"), // TODO: A=kor itak for now
		);
	}
});

test("Script Conversion (Latn -> Cyrl)", () => {
	for (const testCase of TEST_CASES) {
		const { latn, cyrl } = testCase;

		const converted = convertLatnToCyrl(removeSpaceBetweenP(latn));
		const expected = cyrl.replace("=", "");
		expect(converted).toBe(expected);
	}
});

test("Script Conversion (Cyrl -> Latn)", () => {
	for (const testCase of TEST_CASES) {
		const { latn, cyrl } = testCase;
		// console.log('CYRL = ', cyrl);
		// console.log('LATN = ', latn);
		// console.log('-> LATN = ', convertCyrlToLatn(cyrl));
		const converted = convertCyrlToLatn(cyrl);
		const expected = removeSpaceBetweenP(latn);
		expect(converted).toBe(expected);
	}
});

test("Script Conversion (Latn -> Hang)", () => {
	for (const testCase of TEST_CASES) {
		const { latn, hang } = testCase;
		const converted = convertLatnToHang(latn);
		const expected = hang;
		if (converted !== expected) {
			console.log(`"${latn}" -> "${converted}" (expecting "${hang}")`);
		}
		expect(converted).toBe(expected);
	}
});

function removeAccents(str: string) {
	return str
		.replace("á", "a")
		.replace("é", "e")
		.replace("í", "i")
		.replace("ó", "o")
		.replace("ú", "u")
		.replace("́", "");
}

test("Script Conversion (Hang -> Latn)", () => {
	for (const testCase of TEST_CASES) {
		const { latn, hang } = testCase;
		const converted = convertHangToLatn(hang);
		const expected = removeSpaceBetweenP(
			removeAccents(latn.toLowerCase()).replace("=", ""),
		);
		if (converted !== expected) {
			console.log(`"${hang}" -> "${converted}" (expecting "${expected}")`);
		}
		expect(converted).toBe(expected);
	}

	for (const testCase of ROBUSTNESS.filter((t) => t.from === "Hang")) {
		const { Hang, Latn } = testCase;
		expect(convertHangToLatn(Hang)).toBe(Latn);
	}
});

test("Script Conversion (Cyrl -> Kana)", () => {
	for (const testCase of TEST_CASES) {
		const { kana, cyrl } = testCase;
		const converted = convertCyrlToKana(cyrl);
		const expected = kana.replace("ㇰカ", "ッカ");
		if (converted !== expected) {
			console.log(`"${cyrl}" -> "${converted}" (expecting "${kana}")`);
		}
		expect(converted).toBe(expected);
	}
});

test("Script Conversion (Hang -> Cyrl)", () => {
	for (const testCase of TEST_CASES) {
		const { hang, cyrl } = testCase;
		const converted = convertHangToCyrl(hang);
		const expected = removeAccents(cyrl.toLowerCase()).replace("=", "");
		if (converted !== expected) {
			console.log(`"${hang}" -> "${converted}" (expecting "${expected}")`);
		}
		expect(converted).toBe(expected);
	}

	for (const testCase of ROBUSTNESS.filter((t) => t.from === "Hang")) {
		const { Hang, Cyrl } = testCase;
		expect(convertHangToCyrl(Hang)).toBe(Cyrl);
	}
});

test("Script Conversion (Cyrl -> Hang)", () => {
	for (const testCase of TEST_CASES) {
		const { hang, cyrl } = testCase;
		// console.log(cyrl);
		// console.log(hang);
		// console.log(convertCyrlToHang(cyrl));
		expect(convertCyrlToHang(cyrl)).toBe(hang);
	}
});

test("Script Conversion (Hang -> Kana)", () => {
	for (const testCase of TEST_CASES) {
		const { kana, hang } = testCase;
		const converted = convertHangToKana(hang);
		const expected = kana.replace("ㇰカ", "ッカ");
		if (converted !== expected) {
			console.log(`"${hang}" -> "${converted}" (expecting "${expected}")`);
		}
		expect(converted).toBe(expected);
	}

	for (const testCase of ROBUSTNESS.filter((t) => t.from === "Hang")) {
		const { Hang, Kana } = testCase;
		expect(convertHangToKana(Hang)).toBe(Kana.replace("ㇰカ", "ッカ"));
	}
});

// Lossy conversion

test("Script Conversion (Kana -> Latn)", () => {
	for (const testCase of TEST_CASES) {
		const { kana, latnLossy } = testCase;
		// console.log('KANA = ', kana);
		// console.log('LATN = ', latnLossy);
		// console.log('-> LATN = ', convertKanaToLatn(kana));
		expect(convertKanaToLatn(kana)).toBe(latnLossy.toLowerCase());
	}

	for (const testCase of ROBUSTNESS.filter((t) => t.from === "Kana")) {
		const { Kana, Latn } = testCase;
		expect(convertKanaToLatn(Kana)).toBe(Latn.toLowerCase());
	}
});

test("Script Conversion (Kana -> Cyrl)", () => {
	for (const testCase of TEST_CASES) {
		const { kana, latnLossy } = testCase;
		const converted = convertKanaToCyrl(kana);
		const expected = convertLatnToCyrl(removeSpaceBetweenP(latnLossy));
		if (converted !== expected) {
			console.log(`"${kana}" -> "${converted}" (expecting "${expected}")`);
		}
		expect(converted).toBe(expected);
	}

	for (const testCase of ROBUSTNESS.filter((t) => t.from === "Kana")) {
		const { Kana, Cyrl } = testCase;
		expect(convertKanaToCyrl(Kana)).toBe(Cyrl);
	}
});

test("Script Conversion (Kana -> Hang)", () => {
	for (const testCase of TEST_CASES) {
		const { kana, latnLossy } = testCase;
		const hangLossy = convertLatnToHang(latnLossy);
		// console.log(kana);
		// console.log(hang);
		// console.log(convertKanaToHang(kana));
		expect(convertKanaToHang(kana)).toBe(hangLossy);
	}

	for (const testCase of ROBUSTNESS.filter((t) => t.from === "Kana")) {
		const { Kana, Hang } = testCase;
		expect(convertKanaToHang(Kana)).toBe(Hang);
	}
});

// expect(convertLatnToKana('aynu')).toBe('アイヌ');test('Script Conversion (Hang -> Cyrl)', () => {

// expect(convertLatnToCyrl('aynu')).toBe('айну');
// expect(convertLatnToHang('aynu')).toBe('애누');

test("Automatic Conversion (Latn -> Kana)", () => {
	expect(convert("irankarapte", "Latn", "Kana")).toBe("イランカラㇷ゚テ");
	expect(convert("イランカラㇷ゚テ", "Kana")).toBe("irankarapte");
	expect(convert("irankarapte", "Latn")).toBe("イランカラㇷ゚テ");
	expect(convert("イランカラㇷ゚テ", undefined, "Latn")).toBe("irankarapte");
});

const LETTER_CASING_TEST_CASES = [
	{
		latn: "Aynu",
		cyrl: "Айну",
		kana: "アイヌ",
		hang: "애누",
		latnLossy: "ainu",
	},
	{
		latn: "Ieonnekunnep",
		cyrl: "Иэоннэкуннэп",
		kana: "イエオンネクンネㇷ゚",
		hang: "이어온너군넙",
		latnLossy: "ieonnekunnep",
	},
] as const;

test("Keep Letter Casing (Latn <-> Cyrl)", () => {
	for (const testCase of LETTER_CASING_TEST_CASES) {
		expect(convert(testCase.latn, "Latn", "Cyrl")).toBe(testCase.cyrl);
		expect(convert(testCase.cyrl, "Cyrl", "Latn")).toBe(testCase.latn);
		expect(convert(testCase.latn, "Latn", "Kana")).toBe(testCase.kana);
		expect(convert(testCase.kana, "Kana", "Latn")).toBe(testCase.latnLossy);
		expect(convert(testCase.latn, "Latn", "Hang")).toBe(testCase.hang);
		expect(convert(testCase.hang, "Hang", "Latn")).toBe(
			testCase.latn.toLowerCase(),
		);
	}
});

test('Special Case (with "=")', () => {
	const CASE = {
		latn: "a=hunar",
		syllables: ["a", "hu", "nar"],
		kana: "アフナㇻ",
		cyrl: "ахунар",
		hang: "아후날",
		latnLossy: "ahunar",
	} as const;
	[
		{ latn: "", syllables: [], kana: "", cyrl: "", hang: "", latnLossy: "" },
		{
			latn: "aynu",
			syllables: ["ay", "nu"],
			kana: "アイヌ",
			cyrl: "айну",
			hang: "애누",
			latnLossy: "ainu",
		},
		{
			latn: "itak",
			syllables: ["i", "tak"],
			kana: "イタㇰ",
			cyrl: "итак",
			hang: "이닥",
			latnLossy: "itak",
		},
		{
			latn: "aynuitak",
			syllables: ["ay", "nu", "i", "tak"],
			kana: "アイヌイタㇰ",
			cyrl: "айнуитак",
			hang: "애누이닥",
			latnLossy: "ainuitak",
		},
		{
			latn: "sinep",
			syllables: ["si", "nep"],
			kana: "シネㇷ゚",
			cyrl: "синэп",
			hang: "시넙",
			latnLossy: "sinep",
		},
		{
			latn: "ruunpe",
			syllables: ["ru", "un", "pe"],
			kana: "ルウンペ",
			cyrl: "руунпэ",
			hang: "루운버",
			latnLossy: "ruunpe",
		},
		{
			latn: "wenkur",
			syllables: ["we", "n", "kur"],
			kana: "ウェンクㇽ",
			cyrl: "вэнкур",
			hang: "펀굴",
			latnLossy: "wenkur",
		},
		{
			latn: "pekanke",
			syllables: ["pe", "kan", "ke"],
			kana: "ペカンケ",
			cyrl: "пэканкэ",
			hang: "버간거",
			latnLossy: "pekanke",
		},
		{
			latn: "eramuskare",
			syllables: ["e", "ra", "mus", "ka", "re"],
			kana: "エラムㇱカレ",
			cyrl: "эрамускарэ",
			hang: "어라뭇가러",
			latnLossy: "eramuskare",
		},
		{
			latn: "hioy’oy",
			syllables: ["hi", "oy", "oy"],
			kana: "ヒオイオイ",
			cyrl: "хиойой",
			hang: "히외외",
			latnLossy: "hioy’oy",
		},
		{
			latn: "irankarapte",
			syllables: ["i", "ran", "ka", "rap", "te"],
			kana: "イランカラㇷ゚テ",
			cyrl: "иранкараптэ",
			hang: "이란가랍더",
			latnLossy: "irankarapte",
		},
		{
			latn: "iyairaykere",
			syllables: ["i", "ya", "yi", "ray", "ke", "re"],
			kana: "イヤイライケレ",
			cyrl: "ияирайкэрэ",
			hang: "이야이래거러",
			latnLossy: "iyairaikere",
		},
		{
			latn: "yayrayke",
			syllables: ["yay", "ray", "ke"],
			kana: "ヤイライケ",
			cyrl: "яйрайкэ",
			hang: "얘래거",
			latnLossy: "yairaike",
		},
		{
			latn: "keyaykosiramsuypa",
			syllables: ["ke", "yay", "ko", "si", "ram", "suy", "pa"],
			kana: "ケヤイコシラㇺスイパ",
			cyrl: "кэяйкосирамсуйпа",
			hang: "거얘고시람쉬바",
			latnLossy: "keyaikosiramsuipa",
		},
	];

	console.log("LATN = ", CASE.latn);
	console.log("KANA = ", CASE.kana);
	console.log("-> KANA = ", convert(CASE.latn, "Latn", "Kana"));
	expect(convert(CASE.latn, "Latn", "Kana")).toBe(CASE.kana);
	expect(convert(CASE.latn, "Latn", "Cyrl")).toBe(CASE.cyrl);
	expect(convert(CASE.latn, "Latn", "Hang")).toBe(CASE.hang);
	expect(convert(CASE.kana, "Kana", "Latn")).toBe(CASE.latnLossy);
	expect(convert(CASE.cyrl, "Cyrl", "Latn")).toBe(CASE.latnLossy);
	expect(convert(CASE.hang, "Hang", "Latn")).toBe(CASE.latnLossy);
	expect(convert(CASE.kana, "Kana", "Latn")).toBe(CASE.latnLossy);
	expect(convert(CASE.kana, "Kana", "Cyrl")).toBe(CASE.cyrl);
	expect(convert(CASE.kana, "Kana", "Hang")).toBe(CASE.hang);
	expect(convert(CASE.cyrl, "Cyrl", "Latn")).toBe(CASE.latnLossy);
	expect(convert(CASE.cyrl, "Cyrl", "Kana")).toBe(CASE.kana);
	expect(convert(CASE.cyrl, "Cyrl", "Hang")).toBe(CASE.hang);
});

test("Accent Conversion", () => {
	const CASE = {
		latn: "símontek",
		kana: "シモンテㇰ",
		cyrl: "си́монтэк",
		hang: "시몬덕",
		latnLossy: "simontek",
		cyrlLossy: "симонтэк",
	} as const;

	console.log("LATN = ", CASE.latn);
	console.log("KANA = ", CASE.kana);
	console.log("-> KANA = ", convert(CASE.latn, "Latn", "Kana"));
	expect(convert(CASE.latn, "Latn", "Cyrl")).toBe(CASE.cyrl);
	expect(convert(CASE.cyrl, "Cyrl", "Latn")).toBe(CASE.latn);
	expect(convert(CASE.latn, "Latn", "Kana")).toBe(CASE.kana);
	expect(convert(CASE.cyrl, "Cyrl", "Latn")).toBe(CASE.latn);
	expect(convert(CASE.latn, "Latn", "Hang")).toBe(CASE.hang);
	expect(convert(CASE.kana, "Kana", "Latn")).toBe(CASE.latnLossy);
	expect(convert(CASE.hang, "Hang", "Latn")).toBe(CASE.latnLossy);
	expect(convert(CASE.kana, "Kana", "Latn")).toBe(CASE.latnLossy);
	expect(convert(CASE.kana, "Kana", "Cyrl")).toBe(CASE.cyrlLossy);
	expect(convert(CASE.kana, "Kana", "Hang")).toBe(CASE.hang);
	expect(convert(CASE.cyrl, "Cyrl", "Kana")).toBe(CASE.kana);
	expect(convert(CASE.cyrl, "Cyrl", "Hang")).toBe(CASE.hang);
});
