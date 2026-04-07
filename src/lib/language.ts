import { useState, useCallback, useContext, createContext, type ReactNode, createElement } from 'react';

export type Lang = 'en' | 'hi';

const translations = {
  en: {
    // App
    appName: 'FightBack',
    tagline: 'They have an algorithm. You have FightBack.',
    langToggle: 'हिंदी',
    // Home
    heroTitle: 'You got cheated.\nNow fight back.',
    heroSub: 'Pick what happened to you.',
    card1Title: 'My account got deactivated',
    card1Desc: 'Generate legal appeal letters to send today',
    card2Title: "I think I'm being underpaid",
    card2Desc: 'Check if your pay is fair and below minimum wage',
    card3Title: 'I had an accident or was harassed',
    card3Desc: 'Create an FIR-ready incident report instantly',
    card4Title: 'I need to register on E-SHRAM',
    card4Desc: 'Step-by-step guide to get your worker card',
    card5Title: 'What are my rights in my state?',
    card5Desc: 'Get a plain-language rights card for your state',
    urgent: 'URGENT',
    workersHelped: '47,000+ workers helped',
    // Footer
    footerTagline: 'FightBack is free. Always.',
    footerDisclaimer: 'FightBack provides general legal information, not formal legal advice.',
    footerRights: 'Know Your Rights',
    footerAbout: 'About',
    footerContact: 'Contact',
    // Nav
    navHome: 'Home',
    navDeactivated: 'Deactivated',
    navWages: 'Fair Pay',
    navRights: 'Rights',
    navChat: 'ChatBot',
    // Tool 1
    tool1Title: 'Deactivation Appeal Generator',
    tool1Sub: "We'll build your legal letters in 2 minutes.",
    step: 'Step',
    of: 'of',
    q1: 'Which platform deactivated you?',
    q2: 'When were you deactivated?',
    q3: 'Did they give you a reason?',
    q3yes: 'Yes',
    q3no: 'No',
    q3reason: 'What reason did they give?',
    q4: 'How many months did you work for them?',
    q6mobile: 'What is your registered mobile number?',
    q6mobileSub: 'The phone number linked to your account on the platform.',
    q7agentId: 'What is your Partner / Delivery Agent ID?',
    q7agentIdHelper: 'Find this in your app under Profile or Account. It usually starts with letters like DL-, ZP-, SW- followed by numbers.',
    q7agentIdPlaceholder: 'e.g. DL-1234567',
    q8vehicle: 'What is your vehicle number?',
    q8vehicleSub: 'Optional — skip if not applicable to your work.',
    q8vehiclePlaceholder: 'e.g. MH12AB1234',
    q5name: 'Your full name',
    q5city: 'Your city',
    next: 'Next',
    back: 'Back',
    generate: 'Generate My Letters',
    generating: 'Building your legal letters...',
    letterA: 'Letter A — Platform Grievance Officer',
    letterB: 'Letter B — State Labour Commissioner',
    letterC: 'Letter C — National Consumer Helpline',
    copy: 'Copy',
    copied: 'Copied!',
    whatsapp: 'WhatsApp',
    lettersCTA: 'These letters are legally grounded. Send all three today.',
    startOver: 'Start Over',
    // Tool 2
    tool2Title: 'Fair Pay Calculator',
    tool2Sub: 'Find out if you are being underpaid.',
    platform: 'Platform',
    state: 'Your State',
    hoursWorked: 'Hours worked this week',
    ordersCompleted: 'Orders / rides completed',
    moneyReceived: 'Total money received (₹)',
    calculate: 'Calculate My Wages',
    calculating: 'Calculating...',
    underpaidAlert: 'YOU ARE BEING UNDERPAID',
    aboveMinWage: "You're above minimum wage this week",
    generateComplaint: 'Generate Wage Complaint Letter',
    disclaimer: 'This is an estimate. Actual legal advice requires a lawyer.',
    // Tool 3
    tool3Title: 'Incident Report Generator',
    tool3Sub: 'Create an official report in minutes.',
    emergencyBanner: 'For emergencies call 112',
    accidentTab: 'I had an accident',
    harassTab: 'I was harassed',
    incidentDate: 'Date of incident',
    incidentLocation: 'Location',
    whatHappened: 'What happened? (describe in detail)',
    injuries: 'Injuries sustained',
    policeCalled: 'Was police called?',
    harassDesc: 'Describe the harassment',
    harassBy: 'Harassment by',
    client: 'Client / Customer',
    company: 'Company / Platform',
    safetyImpact: 'How did this affect your safety?',
    generateReport: 'Generate Report',
    reportFIR: 'Incident Report (FIR Format)',
    reportPlatform: 'Platform Complaint Letter',
    // Tool 4
    tool4Title: 'E-SHRAM Registration Guide',
    tool4Sub: 'Get your worker card and ₹5 lakh health cover.',
    step1Title: 'Open the E-SHRAM portal',
    step1Desc: 'Visit eshram.gov.in on your phone browser. It works on any smartphone.',
    step2Title: 'Click "Register on e-Shram"',
    step2Desc: 'Look for the big blue button on the homepage. Tap it to start registration.',
    step3Title: 'Enter Aadhaar & mobile number',
    step3Desc: 'You need your 12-digit Aadhaar number and the mobile number linked to it.',
    step4Title: 'Verify the OTP',
    step4Desc: 'An OTP will be sent to your Aadhaar-linked mobile. Enter it to verify your identity.',
    step5Title: 'Fill in your work details',
    step5Desc: 'Select your occupation (delivery worker, driver, etc.) and enter your bank account details.',
    step6Title: 'Download your e-Shram card',
    step6Desc: 'Your UAN (Universal Account Number) card will be generated. Download and save it.',
    eshramBenefit: '🏥 Ayushman Bharat Health Cover: ₹5 lakh/year for you and your family — FREE with E-SHRAM registration.',
    registerNow: 'Register Now on E-SHRAM',
    // Tool 5
    tool5Title: 'State Rights Card',
    tool5Sub: 'Know your rights where you work.',
    selectState: 'Select your state',
    getRightsCard: 'Get My Rights Card',
    gettingRights: 'Fetching your rights...',
    yourRightsCard: 'Your Rights Card',
    shareRights: 'Share via WhatsApp',
    // Chatbot
    chatTitle: 'FightBack AI',
    chatSub: 'Your legal assistant. Ask anything.',
    chatPlaceholder: 'Type your question...',
    chatSend: 'Send',
    chatPrompt1: 'My account was banned',
    chatPrompt2: 'Am I being paid fairly?',
    chatPrompt3: 'What is E-SHRAM?',
    chatPrompt4: 'I had an accident during delivery',
    chatThinking: 'Thinking...',
    // Platforms
    platforms: ['Zomato', 'Swiggy', 'Blinkit', 'Uber', 'Ola', 'Urban Company', 'Rapido', 'Zepto', 'Flipkart Minutes', 'BigBasket', 'Jio Instamart', 'Dunzo', "Domino's", 'Other'],
  },
  hi: {
    // App
    appName: 'FightBack',
    tagline: 'उनके पास एल्गोरिदम है। आपके पास FightBack है।',
    langToggle: 'EN',
    // Home
    heroTitle: 'आपके साथ धोखा हुआ।\nअब लड़ो।',
    heroSub: 'बताइए क्या हुआ आपके साथ।',
    card1Title: 'मेरा अकाउंट बंद कर दिया गया',
    card1Desc: 'आज ही भेजने के लिए कानूनी अपील पत्र बनाएं',
    card2Title: 'मुझे कम पैसे मिल रहे हैं',
    card2Desc: 'जांचें कि आपका वेतन उचित है या न्यूनतम वेतन से कम है',
    card3Title: 'मेरा एक्सीडेंट हुआ या उत्पीड़न हुआ',
    card3Desc: 'तुरंत FIR के लिए घटना रिपोर्ट बनाएं',
    card4Title: 'मुझे E-SHRAM पर रजिस्टर करना है',
    card4Desc: 'अपना श्रमिक कार्ड पाने के लिए चरण-दर-चरण गाइड',
    card5Title: 'मेरे राज्य में मेरे क्या अधिकार हैं?',
    card5Desc: 'अपने राज्य के लिए सरल भाषा में अधिकार कार्ड पाएं',
    urgent: 'अत्यावश्यक',
    workersHelped: '47,000+ श्रमिकों की मदद की',
    // Footer
    footerTagline: 'FightBack मुफ़्त है। हमेशा।',
    footerDisclaimer: 'FightBack सामान्य कानूनी जानकारी देता है, औपचारिक कानूनी सलाह नहीं।',
    footerRights: 'अपने अधिकार जानें',
    footerAbout: 'हमारे बारे में',
    footerContact: 'संपर्क',
    // Nav
    navHome: 'होम',
    navDeactivated: 'निष्क्रिय',
    navWages: 'उचित वेतन',
    navRights: 'अधिकार',
    navChat: 'चैटबॉट',
    // Tool 1
    tool1Title: 'निष्क्रियता अपील जनरेटर',
    tool1Sub: 'हम 2 मिनट में आपके कानूनी पत्र तैयार करेंगे।',
    step: 'चरण',
    of: 'में से',
    q1: 'किस प्लेटफॉर्म ने आपको निष्क्रिय किया?',
    q2: 'आपको कब निष्क्रिय किया गया?',
    q3: 'क्या उन्होंने कोई कारण बताया?',
    q3yes: 'हाँ',
    q3no: 'नहीं',
    q3reason: 'उन्होंने क्या कारण बताया?',
    q4: 'आपने उनके लिए कितने महीने काम किया?',
    q6mobile: 'आपका रजिस्टर्ड मोबाइल नंबर क्या है?',
    q6mobileSub: 'वह फोन नंबर जो प्लेटफॉर्म पर आपके अकाउंट से जुड़ा है।',
    q7agentId: 'आपका पार्टनर / डिलीवरी एजेंट ID क्या है?',
    q7agentIdHelper: 'यह आपके ऐप में Profile या Account सेक्शन में मिलेगा। यह आमतौर पर DL-, ZP-, SW- जैसे अक्षरों से शुरू होता है।',
    q7agentIdPlaceholder: 'जैसे DL-1234567',
    q8vehicle: 'आपका वाहन नंबर क्या है?',
    q8vehicleSub: 'वैकल्पिक — अगर लागू नहीं है तो छोड़ें।',
    q8vehiclePlaceholder: 'जैसे MH12AB1234',
    q5name: 'आपका पूरा नाम',
    q5city: 'आपका शहर',
    next: 'आगे',
    back: 'पीछे',
    generate: 'मेरे पत्र बनाएं',
    generating: 'आपके कानूनी पत्र बन रहे हैं...',
    letterA: 'पत्र A — प्लेटफॉर्म शिकायत अधिकारी',
    letterB: 'पत्र B — राज्य श्रम आयुक्त',
    letterC: 'पत्र C — राष्ट्रीय उपभोक्ता हेल्पलाइन',
    copy: 'कॉपी करें',
    copied: 'कॉपी हो गया!',
    whatsapp: 'व्हाट्सएप',
    lettersCTA: 'ये पत्र कानूनी रूप से आधारित हैं। आज ही तीनों भेजें।',
    startOver: 'फिर से शुरू करें',
    // Tool 2
    tool2Title: 'उचित वेतन कैलकुलेटर',
    tool2Sub: 'जानें कि आपको कम वेतन मिल रहा है या नहीं।',
    platform: 'प्लेटफॉर्म',
    state: 'आपका राज्य',
    hoursWorked: 'इस सप्ताह काम के घंटे',
    ordersCompleted: 'ऑर्डर / राइड पूरे किए',
    moneyReceived: 'कुल पैसे मिले (₹)',
    calculate: 'मेरा वेतन जांचें',
    calculating: 'गणना हो रही है...',
    underpaidAlert: 'आपको कम वेतन मिल रहा है',
    aboveMinWage: 'आप इस सप्ताह न्यूनतम वेतन से ऊपर हैं',
    generateComplaint: 'वेतन शिकायत पत्र बनाएं',
    disclaimer: 'यह एक अनुमान है। वास्तविक कानूनी सलाह के लिए वकील से मिलें।',
    // Tool 3
    tool3Title: 'घटना रिपोर्ट जनरेटर',
    tool3Sub: 'मिनटों में आधिकारिक रिपोर्ट बनाएं।',
    emergencyBanner: 'आपातकाल में 112 पर कॉल करें',
    accidentTab: 'मेरा एक्सीडेंट हुआ',
    harassTab: 'मेरा उत्पीड़न हुआ',
    incidentDate: 'घटना की तारीख',
    incidentLocation: 'स्थान',
    whatHappened: 'क्या हुआ? (विस्तार से बताएं)',
    injuries: 'चोटें',
    policeCalled: 'क्या पुलिस बुलाई गई?',
    harassDesc: 'उत्पीड़न का विवरण',
    harassBy: 'किसने उत्पीड़न किया',
    client: 'ग्राहक',
    company: 'कंपनी / प्लेटफॉर्म',
    safetyImpact: 'इससे आपकी सुरक्षा कैसे प्रभावित हुई?',
    generateReport: 'रिपोर्ट बनाएं',
    reportFIR: 'घटना रिपोर्ट (FIR प्रारूप)',
    reportPlatform: 'प्लेटफॉर्म शिकायत पत्र',
    // Tool 4
    tool4Title: 'E-SHRAM रजिस्ट्रेशन गाइड',
    tool4Sub: 'अपना श्रमिक कार्ड और ₹5 लाख स्वास्थ्य कवर पाएं।',
    step1Title: 'E-SHRAM पोर्टल खोलें',
    step1Desc: 'अपने फोन के ब्राउज़र में eshram.gov.in खोलें। यह किसी भी स्मार्टफोन पर काम करता है।',
    step2Title: '"Register on e-Shram" पर क्लिक करें',
    step2Desc: 'होमपेज पर बड़े नीले बटन को देखें। रजिस्ट्रेशन शुरू करने के लिए टैप करें।',
    step3Title: 'आधार और मोबाइल नंबर डालें',
    step3Desc: 'आपको अपना 12 अंकों का आधार नंबर और उससे जुड़ा मोबाइल नंबर चाहिए।',
    step4Title: 'OTP सत्यापित करें',
    step4Desc: 'आपके आधार से जुड़े मोबाइल पर OTP आएगा। अपनी पहचान सत्यापित करने के लिए इसे दर्ज करें।',
    step5Title: 'अपने काम की जानकारी भरें',
    step5Desc: 'अपना पेशा चुनें (डिलीवरी वर्कर, ड्राइवर आदि) और अपने बैंक खाते की जानकारी दर्ज करें।',
    step6Title: 'E-SHRAM कार्ड डाउनलोड करें',
    step6Desc: 'आपका UAN (यूनिवर्सल अकाउंट नंबर) कार्ड बन जाएगा। इसे डाउनलोड करके सेव करें।',
    eshramBenefit: '🏥 आयुष्मान भारत स्वास्थ्य कवर: आप और आपके परिवार के लिए ₹5 लाख/वर्ष — E-SHRAM रजिस्ट्रेशन के साथ मुफ़्त।',
    registerNow: 'E-SHRAM पर अभी रजिस्टर करें',
    // Tool 5
    tool5Title: 'राज्य अधिकार कार्ड',
    tool5Sub: 'जानें आप जहाँ काम करते हैं वहाँ आपके क्या अधिकार हैं।',
    selectState: 'अपना राज्य चुनें',
    getRightsCard: 'मेरा अधिकार कार्ड पाएं',
    gettingRights: 'आपके अधिकार लाए जा रहे हैं...',
    yourRightsCard: 'आपका अधिकार कार्ड',
    shareRights: 'व्हाट्सएप पर शेयर करें',
    // Chatbot
    chatTitle: 'FightBack AI',
    chatSub: 'आपका कानूनी सहायक। कुछ भी पूछें।',
    chatPlaceholder: 'अपना सवाल लिखें...',
    chatSend: 'भेजें',
    chatPrompt1: 'मेरा अकाउंट बैन हो गया',
    chatPrompt2: 'क्या मुझे उचित वेतन मिल रहा है?',
    chatPrompt3: 'E-SHRAM क्या है?',
    chatPrompt4: 'डिलीवरी के दौरान एक्सीडेंट हुआ',
    chatThinking: 'सोच रहा हूँ...',
    // Platforms
    platforms: ['Zomato', 'Swiggy', 'Blinkit', 'Uber', 'Ola', 'Urban Company', 'Rapido', 'Zepto', 'Flipkart Minutes', 'BigBasket', 'Jio Instamart', 'Dunzo', "Domino's", 'अन्य'],
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

// ── Context ──────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
  tArr: (key: TranslationKey) => string[];
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return (localStorage.getItem('fightback_lang') as Lang) || 'en';
    } catch {
      return 'en';
    }
  });

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'hi' : 'en';
      try { localStorage.setItem('fightback_lang', next); } catch {}
      return next;
    });
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    const val = translations[lang][key];
    if (Array.isArray(val)) return val.join(',');
    return val as string;
  }, [lang]);

  const tArr = useCallback((key: TranslationKey): string[] => {
    const val = translations[lang][key];
    if (Array.isArray(val)) return val as string[];
    return [val as string];
  }, [lang]);

  return createElement(LanguageContext.Provider, { value: { lang, toggleLang, t, tArr } }, children);
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
