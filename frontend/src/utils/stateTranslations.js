import { smartTranslate } from './transliterate';

// State name translations from English to Hindi
export const stateTranslations = {
  "Andhra Pradesh": "आंध्र प्रदेश",
  "Arunachal Pradesh": "अरुणाचल प्रदेश",
  "Assam": "असम",
  "Bihar": "बिहार",
  "Chhattisgarh": "छत्तीसगढ़",
  "Goa": "गोवा",
  "Gujarat": "गुजरात",
  "Haryana": "हरियाणा",
  "Himachal Pradesh": "हिमाचल प्रदेश",
  "Jharkhand": "झारखंड",
  "Karnataka": "कर्नाटक",
  "Kerala": "केरल",
  "Madhya Pradesh": "मध्य प्रदेश",
  "Maharashtra": "महाराष्ट्र",
  "Manipur": "मणिपुर",
  "Meghalaya": "मेघालय",
  "Mizoram": "मिजोरम",
  "Nagaland": "नागालैंड",
  "Odisha": "ओडिशा",
  "Punjab": "पंजाब",
  "Rajasthan": "राजस्थान",
  "Sikkim": "सिक्किम",
  "Tamil Nadu": "तमिलनाडु",
  "Telangana": "तेलंगाना",
  "Tripura": "त्रिपुरा",
  "Uttar Pradesh": "उत्तर प्रदेश",
  "Uttarakhand": "उत्तराखंड",
  "West Bengal": "पश्चिम बंगाल",
  "Andaman and Nicobar Islands": "अंडमान और निकोबार द्वीप समूह",
  "Chandigarh": "चंडीगढ़",
  "Dadra and Nagar Haveli and Daman and Diu": "दादरा और नगर हवेली और दमन और दीव",
  "Delhi": "दिल्ली",
  "Jammu and Kashmir": "जम्मू और कश्मीर",
  "Ladakh": "लद्दाख",
  "Lakshadweep": "लक्षद्वीप",
  "Puducherry": "पुदुच्चेरी"
};

// Common district name translations (comprehensive list)
export const districtTranslations = {
  // Directional words
  "North": "उत्तर",
  "South": "दक्षिण",
  "East": "पूर्व",
  "West": "पश्चिम",
  "Central": "मध्य",
  "Upper": "ऊपरी",
  "Lower": "निचला",
  "District": "जिला",
  
  // Some example districts (this would need to be comprehensive)
  "Mumbai": "मुंबई",
  "Delhi": "दिल्ली",
  "Bangalore": "बेंगलुरु",
  "Chennai": "चेन्नई",
  "Kolkata": "कोलकाता",
  "Hyderabad": "हैदराबाद",
  "Pune": "पुणे",
  "Ahmedabad": "अहमदाबाद",
  "Jaipur": "जयपुर",
  "Lucknow": "लखनऊ",
  "Kanpur": "कानपुर",
  "Nagpur": "नागपुर",
  "Indore": "इंदौर",
  "Thane": "ठाणे",
  "Bhopal": "भोपाल",
  "Visakhapatnam": "विशाखापत्तनम",
  "Pimpri-Chinchwad": "पिंपरी-चिंचवड",
  "Patna": "पटना",
  "Vadodara": "वडोदरा",
  "Ghaziabad": "गाजियाबाद",
  "Ludhiana": "लुधियाना",
  "Agra": "आगरा",
  "Nashik": "नासिक",
  "Faridabad": "फरीदाबाद",
  "Meerut": "मेरठ",
  "Rajkot": "राजकोट",
  "Varanasi": "वाराणसी",
  "Srinagar": "श्रीनगर",
  "Amritsar": "अमृतसर",
  "Allahabad": "इलाहाबाद",
  "Ranchi": "रांची",
  "Howrah": "हावड़ा",
  "Coimbatore": "कोयंबटूर",
  "Jodhpur": "जोधपुर",
  "Raipur": "रायपुर",
  "Kota": "कोटा",
  "Guwahati": "गुवाहाटी",
  "Chandigarh": "चंडीगढ़",
  "Mysore": "मैसूर",
  "Bareilly": "बरेली",
  "Gurgaon": "गुड़गांव",
  "Aligarh": "अलीगढ़",
  "Jalandhar": "जालंधर",
  "Bhubaneswar": "भुवनेश्वर",
  "Salem": "सेलम",
  "Mira-Bhayandar": "मीरा-भाईंदर",
  "Warangal": "वारंगल",
  "Thiruvananthapuram": "तिरुवनंतपुरम",
  "Guntur": "गुंटूर",
  "Bhiwandi": "भिवंडी",
  "Saharanpur": "सहारनपुर",
  "Gorakhpur": "गोरखपुर",
  "Bikaner": "बीकानेर",
  "Amravati": "अमरावती",
  "Noida": "नोएडा",
  "Jamshedpur": "जमशेदपुर",
  "Bhilai": "भिलाई",
  "Cuttack": "कटक",
  "Firozabad": "फिरोजाबाद",
  "Kochi": "कोच्चि",
  "Nellore": "नेल्लोर",
  "Bhavnagar": "भावनगर",
  "Dehradun": "देहरादून",
  "Durgapur": "दुर्गापुर",
  "Asansol": "आसनसोल",
  "Rourkela": "राउरकेला",
  "Nanded": "नांदेड़",
  "Kolhapur": "कोल्हापुर",
  "Ajmer": "अजमेर",
  "Akola": "अकोला",
  "Gulbarga": "गुलबर्गा",
  "Jamnagar": "जामनगर",
  "Ujjain": "उज्जैन",
  "Loni": "लोनी",
  "Siliguri": "सिलीगुड़ी",
  "Jhansi": "झांसी",
  "Ulhasnagar": "उल्हासनगर",
  "Jammu": "जम्मू",
  "Sangli-Miraj & Kupwad": "सांगली-मिरज और कुपवाड",
  "Mangalore": "मंगलुरु",
  "Erode": "इरोड",
  "Belgaum": "बेलगाम",
  "Ambattur": "अंबत्तूर",
  "Tirunelveli": "तिरुनेलवेली",
  "Malegaon": "मालेगांव",
  "Gaya": "गया",
  "Jalgaon": "जलगांव",
  "Udaipur": "उदयपुर",
  "Maheshtala": "महेशताला"
};

/**
 * Returns the state name in English (no translation)
 * @param {string} stateName - The state name in English
 * @param {string} language - The current language ('en' or 'hi') - ignored, kept for compatibility
 * @returns {string} - State name in English
 */
export const translateStateName = (stateName, language) => {
  // Always return English name regardless of language
  return stateName;
};

/**
 * Returns the district name in English (no translation)
 * @param {string} districtName - The district name in English
 * @param {string} language - The current language ('en' or 'hi') - ignored, kept for compatibility
 * @returns {string} - District name in English
 */
export const translateDistrictName = (districtName, language) => {
  // Always return English name regardless of language
  return districtName;
};
