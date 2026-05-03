import { Romanize } from "hangul-romanize";
import { pinyin as getPinyin } from "pinyin-pro";
import * as wanakana from "wanakana";

export type PhoneticLanguage = "ja" | "zh" | "ko" | "yue" | "auto";

export async function getPhonetic(text: string, lang: PhoneticLanguage = "auto"): Promise<string> {
	if (!text.trim()) return "";

	let detectedLang = lang;
	if (lang === "auto") {
		detectedLang = detectLanguage(text);
	}

	try {
		switch (detectedLang) {
			case "ja":
			case "zh":
			case "ko":
			case "yue": {
				try {
					// 1. Try Google Transliteration API (Dedicated transliteration endpoint)
					const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${detectedLang}&tl=en&dt=rm&q=${encodeURIComponent(text)}`;
					const response = await fetch(url);
					const data = await response.json();
					
					// Transliteration is at data[0][x][3]
					if (data?.[0]) {
						return data[0].map((s: unknown[]) => (s as string[])?.[3] || "").join("");
					}
				} catch (e) {
					console.warn(`${detectedLang} API failed, falling back to local libs`, e);
				}
				
				// 2. Local Fallback
				if (detectedLang === "ja") return wanakana.toRomaji(text);
				if (detectedLang === "zh") return getPinyin(text, { toneType: "none" });
				if (detectedLang === "ko") return Romanize.from(text);
				return "";
			}
			default:
				return "";
		}
	} catch (e) {
		console.error("Phonetic conversion failed", e);
		return "";
	}
}

export async function getPhoneticSyllables(textOrArray: string | string[], lang: PhoneticLanguage = "auto"): Promise<string[]> {
	const originalCapsules = typeof textOrArray === "string" ? textOrArray.split("").filter(c => !/^\s*$/.test(c)) : textOrArray;
	if (originalCapsules.length === 0) return [];
	
	const fullLineText = originalCapsules.join("").replace(/\s+/g, "");
	let detectedLang = lang;
	if (lang === "auto") {
		detectedLang = detectLanguage(fullLineText);
	}

	// 1. Get the ROOT transliteration for the FULL line (captures compound readings like 'Jujutsu')
	const rawLinePhonetic = await getPhonetic(fullLineText, detectedLang);
	const normalizedLinePhonetic = rawLinePhonetic.toLowerCase().replace(/\s+/g, "")
		.replace(/ā/g, "aa").replace(/ī/g, "ii").replace(/ū/g, "uu")
		.replace(/ē/g, "ee").replace(/ō/g, "ou")
		.replace(/[^a-z]/g, "");
	
	// 2. Split master into mora (syllables) — used as fallback for ambiguous chars
	const masterSyllables = normalizedLinePhonetic
		.replace(/([aeiouy])([aeiouy])/gi, "$1 $2")
		.match(/([^aeiouy ]*[aeiouy]{1}([nm](?![aeiouy]))?|[^aeiouy ]+)/gi) || [normalizedLinePhonetic];

	// 3. Fetch individual phonetics per capsule; store them directly for use as results.
	//    Also compute syllable-count weights for the master-distribution fallback.
	const charWeights: number[] = [];
	const capPhonetics: string[] = [];
	for (const cap of originalCapsules) {
		const capText = cap.trim().replace(/\s+/g, "");
		if (capText.length === 0) {
			charWeights.push(0);
			capPhonetics.push("");
			continue;
		}
		const rawCapPhonetic = await getPhonetic(capText, detectedLang);
		const capPhonetic = rawCapPhonetic.toLowerCase().replace(/\s+/g, "")
			.replace(/ā/g, "aa").replace(/ī/g, "ii").replace(/ū/g, "uu")
			.replace(/ē/g, "ee").replace(/ō/g, "ou")
			.replace(/[^a-z]/g, "");
		capPhonetics.push(capPhonetic);
			
		const capSyllables = capPhonetic
			.replace(/([aeiouy])([aeiouy])/gi, "$1 $2")
			.match(/([^aeiouy ]*[aeiouy]{1}([nm](?![aeiouy]))?|[^aeiouy ]+)/gi) || ["a"];
		charWeights.push(capSyllables.length);
	}

	const totalWeight = charWeights.reduce((a, b) => a + b, 0);
	const results: string[] = [];
	let syllableIndex = 0;

	for (let i = 0; i < originalCapsules.length; i++) {
		if (charWeights[i] === 0) {
			results.push(originalCapsules[i]);
			continue;
		}

		// Prefer the directly-fetched individual phonetic — it is already correct for
		// simple kana (の → "no") and avoids syllable-distribution rounding errors.
		// Only fall back to master-distribution slicing when the individual fetch was empty.
		if (capPhonetics[i]) {
			// Still advance syllableIndex so the master pointer stays in sync for any
			// subsequent capsules that do need the fallback path.
			let charSyllableCount = Math.round((charWeights[i] / totalWeight) * masterSyllables.length);
			if (i === originalCapsules.length - 1 || totalWeight === 0) {
				charSyllableCount = masterSyllables.length - syllableIndex;
			}
			charSyllableCount = Math.max(1, charSyllableCount);
			if (i < originalCapsules.length - 1) {
				const remainingWeight = charWeights.slice(i + 1).reduce((a, b) => a + b, 0);
				if (remainingWeight > 0) {
					charSyllableCount = Math.min(charSyllableCount, masterSyllables.length - syllableIndex - 1);
				}
			}
			syllableIndex += charSyllableCount;
			results.push(capPhonetics[i]);
			continue;
		}

		// Fallback: distribute from the master line phonetic
		let charSyllableCount = Math.round((charWeights[i] / totalWeight) * masterSyllables.length);
		if (i === originalCapsules.length - 1 || totalWeight === 0) {
			charSyllableCount = masterSyllables.length - syllableIndex;
		}
		
		charSyllableCount = Math.max(1, charSyllableCount);
		if (i < originalCapsules.length - 1) {
			const remainingWeight = charWeights.slice(i + 1).reduce((a, b) => a + b, 0);
			if (remainingWeight > 0) {
				charSyllableCount = Math.min(charSyllableCount, masterSyllables.length - syllableIndex - 1);
			}
		}

		const charSyllables = masterSyllables.slice(syllableIndex, syllableIndex + charSyllableCount);
		syllableIndex += charSyllableCount;
		results.push(charSyllables.join("").trim());
	}

	return results;
}

function detectLanguage(text: string): PhoneticLanguage {
	// Japanese: Contains Hiragana or Katakana
	if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return "ja";
	
	// Korean: Contains Hangul
	if (/[\uAC00-\uD7AF]/.test(text)) return "ko";
	
	// Chinese: Contains Hanzi (and we assume it's Chinese if no Japanese indicators found)
	if (/[\u4E00-\u9FA5]/.test(text)) return "zh";
	
	return "auto";
}
