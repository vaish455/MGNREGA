/**
 * Transliteration map from English to Devanagari (Hindi script)
 * This provides phonetic conversion for place names
 */
const transliterationMap = {
  // Vowels
  'a': 'अ', 'aa': 'आ', 'i': 'इ', 'ii': 'ई', 'u': 'उ', 'uu': 'ऊ',
  'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ',
  
  // Consonants
  'ka': 'का', 'kha': 'खा', 'ga': 'गा', 'gha': 'घा', 'nga': 'ङा',
  'cha': 'चा', 'chha': 'छा', 'ja': 'जा', 'jha': 'झा', 'nya': 'ञा',
  'ta': 'टा', 'tha': 'ठा', 'da': 'डा', 'dha': 'ढा', 'na': 'णा',
  'ta': 'ता', 'tha': 'था', 'da': 'दा', 'dha': 'धा', 'na': 'ना',
  'pa': 'पा', 'pha': 'फा', 'ba': 'बा', 'bha': 'भा', 'ma': 'मा',
  'ya': 'या', 'ra': 'रा', 'la': 'ला', 'va': 'वा', 'wa': 'वा',
  'sha': 'शा', 'shha': 'षा', 'sa': 'सा', 'ha': 'हा',
  
  // Single consonants (basic)
  'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ',
  'ch': 'च', 'chh': 'छ', 'j': 'ज', 'jh': 'झ',
  't': 'ट', 'th': 'ठ', 'd': 'ड', 'dh': 'ढ',
  'p': 'प', 'ph': 'फ', 'b': 'ब', 'bh': 'भ',
  'm': 'म', 'y': 'य', 'r': 'र', 'l': 'ल',
  'v': 'व', 'w': 'व', 'sh': 'श', 's': 'स', 'h': 'ह',
  'n': 'न', 'f': 'फ', 'z': 'ज',
};

/**
 * Simple phonetic transliteration from English to Hindi
 * This is a basic implementation for place names
 */
export const transliterateToHindi = (text) => {
  if (!text) return text;
  
  // Convert to lowercase for matching
  let result = text.toLowerCase();
  
  // Common English to Hindi phonetic patterns for place names
  const patterns = [
    // Special combinations (check these first)
    ['nagar', 'नगर'],
    ['pur', 'पुर'],
    ['pura', 'पुरा'],
    ['bad', 'बाद'],
    ['abad', 'आबाद'],
    ['garh', 'गढ़'],
    ['ganj', 'गंज'],
    ['khand', 'खंड'],
    ['town', 'टाउन'],
    ['city', 'सिटी'],
    
    // Vowel combinations
    ['aa', 'आ'],
    ['ee', 'ई'],
    ['oo', 'ऊ'],
    ['ai', 'ऐ'],
    ['au', 'औ'],
    ['ou', 'ौ'],
    
    // Consonant combinations (two letters)
    ['kh', 'ख'],
    ['gh', 'घ'],
    ['ch', 'च'],
    ['chh', 'छ'],
    ['jh', 'झ'],
    ['th', 'थ'],
    ['dh', 'ध'],
    ['ph', 'फ'],
    ['bh', 'भ'],
    ['sh', 'श'],
    ['ng', 'ंग'],
    ['nk', 'ंक'],
    
    // Single letters (vowels)
    ['a', 'ा'],
    ['i', 'ि'],
    ['u', 'ु'],
    ['e', 'े'],
    ['o', 'ो'],
    
    // Single letters (consonants)
    ['k', 'क'],
    ['g', 'ग'],
    ['c', 'क'],
    ['j', 'ज'],
    ['t', 'ट'],
    ['d', 'ड'],
    ['n', 'न'],
    ['p', 'प'],
    ['b', 'ब'],
    ['m', 'म'],
    ['y', 'य'],
    ['r', 'र'],
    ['l', 'ल'],
    ['v', 'व'],
    ['w', 'व'],
    ['s', 'स'],
    ['h', 'ह'],
    ['f', 'फ'],
    ['z', 'ज़'],
    ['x', 'क्स'],
  ];
  
  // Apply patterns
  for (const [eng, hindi] of patterns) {
    const regex = new RegExp(eng, 'gi');
    result = result.replace(regex, hindi);
  }
  
  // Capitalize first letter if original was capitalized
  if (text[0] === text[0].toUpperCase()) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  
  return result;
};

/**
 * Enhanced translation that uses predefined translations when available,
 * and falls back to transliteration
 */
export const smartTranslate = (text, translations, language) => {
  if (language !== 'hi') return text;
  if (!text) return text;
  
  // First check if we have a manual translation
  if (translations[text]) {
    return translations[text];
  }
  
  // Otherwise, use phonetic transliteration
  return transliterateToHindi(text);
};
