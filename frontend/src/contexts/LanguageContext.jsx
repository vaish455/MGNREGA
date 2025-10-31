import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Header
    headerTitle: "Our Voice, Our Rights",
    headerSubtitle: "MGNREGA Portal",
    headerStats: "12.15 Crore people benefited in 2025",
    
    // Welcome Section
    welcomeTitle: "MGNREGA Yojana - District Report",
    welcomeDescription: "View MGNREGA scheme information for your district",
    
    // Location Detector
    detectLocation: "Detect My Location",
    detectingLocation: "Detecting your location...",
    locationDetected: "Location detected",
    skip: "Skip",
    enterManually: "Enter Manually",
    
    // District Selector
    selectState: "Select State",
    selectDistrict: "Select District",
    viewData: "View Data",
    selectStateFirst: "Please select a state first",
    
    // Dashboard
    changeDistrict: "Change District",
    financialYear: "Financial Year",
    month: "Month",
    keyStatistics: "Key Statistics",
    loadingData: "Loading data...",
    errorLoading: "Error loading data",
    tryAgain: "Try Again",
    noDataAvailable: "No data available for this district",
    chooseAnother: "Choose Another District",
    
    // Data Cards
    householdsWorked: "Households Who Got Work",
    householdsWorkedDesc: "Number of families who received work under MGNREGA",
    individualsWorked: "Total People Who Worked",
    individualsWorkedDesc: "Number of individuals who worked this month",
    avgWagePerDay: "Average Wage Per Day",
    avgWagePerDayDesc: "Average daily wage for one day of work",
    avgEmploymentDays: "Average Days of Employment",
    avgEmploymentDaysDesc: "Average working days provided per family",
    families100Days: "Families Completing 100 Days",
    families100DaysDesc: "Families who completed 100 days of employment",
    totalExpenditure: "Total Expenditure",
    totalExpenditureDesc: "Total money spent this month",
    
    womenParticipation: "Women Participation",
    womenPersonDays: "Person-days by Women",
    womenPersonDaysDesc: "Total working days by women",
    womenParticipationRate: "Women's participation",
    
    scstParticipation: "SC/ST Participation",
    scWorkers: "SC Workers",
    scWorkersDesc: "Number of Scheduled Caste workers",
    stWorkers: "ST Workers",
    stWorkersDesc: "Number of Scheduled Tribe workers",
    
    worksProgress: "Works Progress",
    completedWorks: "Completed Works",
    completedWorksDesc: "Number of works completed",
    ongoingWorks: "Ongoing Works",
    ongoingWorksDesc: "Number of works in progress",
    totalWorksStarted: "Total Works Started",
    totalWorksStartedDesc: "Total number of works initiated",
    
    comparisonWithState: "Comparison with State",
    
    jobCardsActiveWorkers: "Job Cards & Active Workers",
    totalJobCardsIssued: "Total Job Cards Issued",
    totalJobCardsIssuedDesc: "Total job cards issued",
    activeJobCards: "Active Job Cards",
    activeJobCardsDesc: "Job cards currently active",
    activeWorkers: "Active Workers",
    activeWorkersDesc: "People actively working",
    
    whyImportant: "Why Is This Information Important?",
    importance1: "It shows you how the MGNREGA scheme is performing in your district",
    importance2: "You can see how many people are getting work and what wages they receive",
    importance3: "This brings transparency and makes the government accountable",
    
    lastUpdated: "Last Updated",
    dataNotAvailable: "Data not available",
    days: "days",
    
    // Comparison
    comparison: "Comparison",
    districtVsState: "Your District vs State Average",
    yourDistrict: "Your District",
    stateAverage: "State Average",
    
    // Explainer Box
    whatIsMGNREGA: "What is MGNREGA?",
    mgnregaDesc1: "MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) guarantees 100 days of wage employment in a financial year to rural households.",
    mgnregaDesc2: "This scheme aims to enhance livelihood security by providing at least 100 days of guaranteed wage employment in a financial year to every rural household.",
    yourRights: "Your Rights",
    right1: "Right to demand work within 15 days",
    right2: "Right to unemployment allowance if work not provided",
    right3: "Right to work within 5km radius of your village",
    right4: "Right to facilities like drinking water and shade",
    
    // Footer
    dataSource: "Data source: Ministry of Rural Development, Government of India",
    
    // Language
    language: "Language",
    english: "English",
    hindi: "हिन्दी",
    
    // Welcome Page
    heroTag: "Empowering Rural India",
    getStarted: "Get Started",
    
    // Impact Statistics
    impactTitle: "MGNREGA Impact Across India",
    stat100Days: "100",
    stat100DaysLabel: "Days of Guaranteed Work",
    statCroresPaid: "₹2.7L Cr",
    statCroresPaidLabel: "Total Budget (2024-25)",
    statActiveJobCards: "14.2 Cr",
    statActiveJobCardsLabel: "Active Job Cards",
    statWomenBeneficiaries: "56%",
    statWomenBeneficiariesLabel: "Women Beneficiaries",
    
    // Features
    featuresTitle: "Why Use This Portal?",
    featuresSubtitle: "Empowering citizens with transparent and accessible MGNREGA data",
    featureTransparency: "Complete Transparency",
    featureTransparencyDesc: "View real-time MGNREGA data for any district in India. Track wages, employment days, and scheme implementation.",
    featureRealtime: "Real-Time Updates",
    featureRealtimeDesc: "Get the latest data synced from government sources. Stay informed about scheme performance and benefits.",
    featureCommunity: "Community Empowerment",
    featureCommunityDesc: "Understand your rights and entitlements. Hold local authorities accountable for proper implementation.",
    featureEducation: "Easy to Understand",
    featureEducationDesc: "Complex data made simple with visual charts and explanations in your language. No technical knowledge required.",
    
    // How It Works
    howItWorksTitle: "How It Works",
    howItWorksSubtitle: "Access MGNREGA data in three simple steps",
    step1Title: "Choose Your Location",
    step1Desc: "Select your state and district or use auto-detection to find your location instantly.",
    step2Title: "View Dashboard",
    step2Desc: "See comprehensive data about employment, wages, workers, and ongoing works in your district.",
    step3Title: "Compare & Analyze",
    step3Desc: "Compare your district with others and state averages to understand performance better.",
    
    // Call to Action
    ctaTitle: "Ready to Explore MGNREGA Data?",
    ctaDescription: "Start by selecting your district to see how MGNREGA is performing in your area.",
  },
  hi: {
    // Header
    headerTitle: "हमारी आवाज, हमारे अधिकार",
    headerSubtitle: "मनरेगा पोर्टल",
    headerStats: "12.15 करोड़ लोगों ने 2025 में लाभ उठाया",
    
    // Welcome Section
    welcomeTitle: "मनरेगा योजना - जिला रिपोर्ट",
    welcomeDescription: "अपने जिले में मनरेगा योजना की जानकारी देखें",
    
    // Location Detector
    detectLocation: "मेरा स्थान पहचानें",
    detectingLocation: "आपका स्थान पहचाना जा रहा है...",
    locationDetected: "स्थान पहचाना गया",
    skip: "छोड़ें",
    enterManually: "मैन्युअल रूप से दर्ज करें",
    
    // District Selector
    selectState: "राज्य चुनें",
    selectDistrict: "जिला चुनें",
    viewData: "डेटा देखें",
    selectStateFirst: "कृपया पहले राज्य चुनें",
    
    // Dashboard
    changeDistrict: "जिला बदलें",
    financialYear: "वित्तीय वर्ष",
    month: "महीना",
    keyStatistics: "मुख्य आंकड़े",
    loadingData: "डेटा लोड हो रहा है...",
    errorLoading: "डेटा लोड करने में त्रुटि",
    tryAgain: "पुनः प्रयास करें",
    noDataAvailable: "इस जिले के लिए कोई डेटा उपलब्ध नहीं है",
    chooseAnother: "दूसरा जिला चुनें",
    
    // Data Cards
    householdsWorked: "परिवार जिन्हें काम मिला",
    householdsWorkedDesc: "मनरेगा के तहत काम पाने वाले परिवारों की संख्या",
    individualsWorked: "कुल लोग जिन्होंने काम किया",
    individualsWorkedDesc: "इस महीने काम करने वाले व्यक्तियों की संख्या",
    avgWagePerDay: "औसत वेतन प्रति दिन",
    avgWagePerDayDesc: "एक दिन के काम के लिए औसत वेतन",
    avgEmploymentDays: "औसत रोजगार के दिन",
    avgEmploymentDaysDesc: "प्रति परिवार औसत काम के दिन",
    families100Days: "100 दिन पूरे करने वाले परिवार",
    families100DaysDesc: "जिन परिवारों ने 100 दिन का रोजगार पूरा किया",
    totalExpenditure: "कुल खर्च",
    totalExpenditureDesc: "इस महीने कुल खर्च",
    
    womenParticipation: "महिला भागीदारी",
    womenPersonDays: "महिलाओं द्वारा काम के दिन",
    womenPersonDaysDesc: "महिलाओं द्वारा कितने दिन काम किया गया",
    womenParticipationRate: "महिलाओं की भागीदारी",
    
    scstParticipation: "SC/ST भागीदारी",
    scWorkers: "SC श्रमिक",
    scWorkersDesc: "अनुसूचित जाति के श्रमिकों की संख्या",
    stWorkers: "ST श्रमिक",
    stWorkersDesc: "अनुसूचित जनजाति के श्रमिकों की संख्या",
    
    worksProgress: "कार्य प्रगति",
    completedWorks: "पूर्ण कार्य",
    completedWorksDesc: "पूर्ण किए गए कार्यों की संख्या",
    ongoingWorks: "चालू कार्य",
    ongoingWorksDesc: "प्रगति में कार्यों की संख्या",
    totalWorksStarted: "कुल कार्य शुरू किए गए",
    totalWorksStartedDesc: "शुरू किए गए कुल कार्यों की संख्या",
    
    comparisonWithState: "राज्य से तुलना",
    
    jobCardsActiveWorkers: "जॉब कार्ड और सक्रिय कार्यकर्ता",
    totalJobCardsIssued: "कुल जॉब कार्ड",
    totalJobCardsIssuedDesc: "जारी किए गए कुल जॉब कार्ड",
    activeJobCards: "सक्रिय जॉब कार्ड",
    activeJobCardsDesc: "वर्तमान में सक्रिय जॉब कार्ड",
    activeWorkers: "सक्रिय कार्यकर्ता",
    activeWorkersDesc: "सक्रिय रूप से काम कर रहे लोग",
    
    whyImportant: "यह जानकारी क्यों महत्वपूर्ण है?",
    importance1: "यह आपको बताता है कि आपके जिले में मनरेगा योजना कैसे काम कर रही है",
    importance2: "आप देख सकते हैं कि कितने लोगों को काम मिल रहा है और कितना वेतन मिल रहा है",
    importance3: "यह पारदर्शिता लाता है और सरकार को जवाबदेह बनाता है",
    
    lastUpdated: "अंतिम अपडेट",
    dataNotAvailable: "डेटा उपलब्ध नहीं है",
    days: "दिन",
    
    // Comparison
    comparison: "तुलना",
    districtVsState: "आपका जिला बनाम राज्य औसत",
    yourDistrict: "आपका जिला",
    stateAverage: "राज्य औसत",
    
    // Explainer Box
    whatIsMGNREGA: "मनरेगा क्या है?",
    mgnregaDesc1: "मनरेगा (महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम) ग्रामीण परिवारों को एक वित्तीय वर्ष में 100 दिनों के मजदूरी रोजगार की गारंटी देता है।",
    mgnregaDesc2: "इस योजना का उद्देश्य प्रत्येक ग्रामीण परिवार को एक वित्तीय वर्ष में कम से कम 100 दिनों के गारंटीशुदा मजदूरी रोजगार प्रदान करके आजीविका सुरक्षा बढ़ाना है।",
    yourRights: "आपके अधिकार",
    right1: "15 दिनों के भीतर काम की मांग करने का अधिकार",
    right2: "काम न मिलने पर बेरोजगारी भत्ता का अधिकार",
    right3: "अपने गांव के 5 किमी दायरे में काम करने का अधिकार",
    right4: "पीने का पानी और छाया जैसी सुविधाओं का अधिकार",
    
    // Footer
    dataSource: "डेटा स्रोत: ग्रामीण विकास मंत्रालय, भारत सरकार",
    
    // Language
    language: "भाषा",
    english: "English",
    hindi: "हिन्दी",
    
    // Welcome Page
    heroTag: "ग्रामीण भारत को सशक्त बनाना",
    getStarted: "शुरू करें",
    
    // Impact Statistics
    impactTitle: "पूरे भारत में मनरेगा का प्रभाव",
    stat100Days: "100",
    stat100DaysLabel: "गारंटीशुदा काम के दिन",
    statCroresPaid: "₹2.7 लाख करोड़",
    statCroresPaidLabel: "कुल बजट (2024-25)",
    statActiveJobCards: "14.2 करोड़",
    statActiveJobCardsLabel: "सक्रिय जॉब कार्ड",
    statWomenBeneficiaries: "56%",
    statWomenBeneficiariesLabel: "महिला लाभार्थी",
    
    // Features
    featuresTitle: "इस पोर्टल का उपयोग क्यों करें?",
    featuresSubtitle: "पारदर्शी और सुलभ मनरेगा डेटा के साथ नागरिकों को सशक्त बनाना",
    featureTransparency: "पूर्ण पारदर्शिता",
    featureTransparencyDesc: "भारत के किसी भी जिले के लिए वास्तविक समय का मनरेगा डेटा देखें। मजदूरी, रोजगार के दिनों और योजना के कार्यान्वयन को ट्रैक करें।",
    featureRealtime: "रियल-टाइम अपडेट",
    featureRealtimeDesc: "सरकारी स्रोतों से समन्वयित नवीनतम डेटा प्राप्त करें। योजना के प्रदर्शन और लाभों के बारे में सूचित रहें।",
    featureCommunity: "समुदाय सशक्तिकरण",
    featureCommunityDesc: "अपने अधिकारों और हकों को समझें। उचित कार्यान्वयन के लिए स्थानीय अधिकारियों को जवाबदेह बनाएं।",
    featureEducation: "समझने में आसान",
    featureEducationDesc: "जटिल डेटा को आपकी भाषा में दृश्य चार्ट और स्पष्टीकरण के साथ सरल बनाया गया। किसी तकनीकी ज्ञान की आवश्यकता नहीं।",
    
    // How It Works
    howItWorksTitle: "यह कैसे काम करता है",
    howItWorksSubtitle: "तीन सरल चरणों में मनरेगा डेटा तक पहुंचें",
    step1Title: "अपना स्थान चुनें",
    step1Desc: "अपना राज्य और जिला चुनें या तुरंत अपना स्थान खोजने के लिए ऑटो-डिटेक्शन का उपयोग करें।",
    step2Title: "डैशबोर्ड देखें",
    step2Desc: "अपने जिले में रोजगार, मजदूरी, श्रमिकों और चल रहे कार्यों के बारे में व्यापक डेटा देखें।",
    step3Title: "तुलना करें और विश्लेषण करें",
    step3Desc: "प्रदर्शन को बेहतर ढंग से समझने के लिए अपने जिले की तुलना अन्य जिलों और राज्य औसत से करें।",
    
    // Call to Action
    ctaTitle: "मनरेगा डेटा का पता लगाने के लिए तैयार हैं?",
    ctaDescription: "यह देखने के लिए अपना जिला चुनकर शुरू करें कि आपके क्षेत्र में मनरेगा कैसा प्रदर्शन कर रहा है।",
  }
};

export const LanguageProvider = ({ children }) => {
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('mgnrega-language');
    return savedLanguage || 'en';
  });

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = (lang) => {
    console.log('Switching language to:', lang);
    setLanguage(lang);
    localStorage.setItem('mgnrega-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
