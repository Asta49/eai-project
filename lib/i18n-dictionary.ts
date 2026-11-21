import { Locale } from '@/i18n';

export interface AppDictionary {
  nav: {
    home: string;
    log: string;
    ask: string;
    care: string;
    profile: string;
  };
  navbar: {
    welcome: string;
    notifications: string;
    unreadCount: string;
    patternWatchTitle: string;
    patternWatchConfidence: string;
    patternWatchDesc: string;
    addQuestionsBtn: string;
    bookTestBtn: string;
    ovulationNotif: string;
    ovulationSub: string;
    energyNotif: string;
    energySub: string;
    smartCartNotif: string;
    smartCartSub: string;
    medsNotif: string;
    medsSub: string;
  };
  home: {
    periodTitle: string;
    day18: string;
    conceptionChance: string;
    conceptionValue: string;
    irregularCycleNote: string;
    ovulationTitle: string;
    ovulationPred: string;
    fertileWindow: string;
    tapHeartHint: string;
    forecastTitle: string;
    highConfidence: string;
    forecastText: string;
    speakingNotice: string;
    viewOutlook: string;
    hideOutlook: string;
    fromLogs: string;
    safetyGuideline: string;
    monthName: string;
    viewCalendar: string;
    daysOfWeek: string[];
    yourMood: string;
    loggedToast: string;
    addMood: string;
    moodSad: string;
    moodBad: string;
    moodHappy: string;
    articlesTitle: string;
    seeAll: string;
    weeklyRecapTitle: string;
    weeklyRecapSub: string;
    duration75s: string;
    play: string;
    pause: string;
    textTranscript: string;
    hideTranscript: string;
    recapTranscriptText: string;
    moodBooster: string;
    smartSwaps: string;
    spreadHappiness: string;
    activeTrials: string;
    medsChecklistTitle: string;
    careTeamPrescribed: string;
    thyronormName: string;
    thyronormDesc: string;
    metforminName: string;
    metforminDesc: string;
    takenLabel: string;
    dueLabel: string;
    eveningLabel: string;
    scanPrescriptionBtn: string;
    toolsTitle: string;
    oneTapAccess: string;
    toolFoodTitle: string;
    toolFoodSub: string;
    toolLabsTitle: string;
    toolLabsSub: string;
    toolTrialsTitle: string;
    toolTrialsSub: string;
    toolCartTitle: string;
    toolCartSub: string;
    toolWorkoutsTitle: string;
    toolWorkoutsSub: string;
    toolFastingTitle: string;
    toolFastingSub: string;
  };
  care: {
    headerTitle: string;
    headerSub: string;
    tabTeam: string;
    tabDoctors: string;
    tabEmergency: string;
    tabSummary: string;
    tabScreening: string;
    tabDoctorView: string;
    locationLabel: string;
    allLocations: string;
    changeLocation: string;
    aiMatchBadge: string;
    aiMatchTitle: string;
    aiMatchScore: string;
    aiMatchWhyTitle: string;
    aiMatchReason1: string;
    aiMatchReason2: string;
    aiMatchReason3: string;
    bookAiDocBtn: string;
    doctorListTitle: string;
    doctorListSub: string;
    expYears: string;
    reviewsCount: string;
    feeLabel: string;
    nextSlotLabel: string;
    bookConsultBtn: string;
    emergencyBannerTitle: string;
    emergencyBannerSub: string;
    startEmergencyVoiceBtn: string;
    emergencyModalTitle: string;
    emergencyModalSub: string;
    listeningIndic: string;
    tapToSpeak: string;
    chiefComplaintsTitle: string;
    triageLevelLabel: string;
    criticalLevel: string;
    call112Btn: string;
    bestSuitedDocTitle: string;
    hospital247: string;
    callErDeskBtn: string;
    sampleEmergencyPhrase: string;
  };
  checkin: {
    headerPhase: string;
    headerTitle: string;
    headerSub: string;
    quickTap: string;
    voiceNote: string;
    moodLabel: string;
    feelingsLabel: string;
    energyLabel: string;
    cravingsLabel: string;
    symptomsLabel: string;
    saveLog: string;
    logSaved: string;
    speakIndicPrompt: string;
  };
  ask: {
    headerTitle: string;
    headerSub: string;
    disclaimer: string;
    tabChat: string;
    tabFamily: string;
    tabExplainer: string;
    tabMyths: string;
    tabLabs: string;
    inputPlaceholder: string;
    source: string;
    askDoctor: string;
    sendBtn: string;
  };
  food: {
    headerTitle: string;
    headerSub: string;
    tabDaily: string;
    tabFasting: string;
    planWeek: string;
    thaliPhotoBtn: string;
    logMealBtn: string;
    calories: string;
    carbs: string;
    protein: string;
    fiber: string;
    toleranceSuits: string;
    toleranceCaution: string;
    recentMeals: string;
  };
  profile: {
    headerTitle: string;
    headerSub: string;
    tabProfile: string;
    tabCalibration: string;
    tabCart: string;
    tabPrivacy: string;
    lifeStageLabel: string;
    languageHeading: string;
    devicesHeading: string;
    dpdpBadge: string;
  };
}

export const DICTIONARIES: Record<Locale, AppDictionary> = {
  en: {
    nav: {
      home: 'Home',
      log: 'Log',
      ask: 'Ask',
      care: 'Care',
      profile: 'Profile',
    },
    navbar: {
      welcome: 'Welcome',
      notifications: 'Notification',
      unreadCount: '3 New',
      patternWatchTitle: 'Ritu noticed • Pattern Watch',
      patternWatchConfidence: 'High Confidence',
      patternWatchDesc: 'Your last 3 cycles were 38, 41 and 45 days. Long gaps are worth raising with Dr. Sen.',
      addQuestionsBtn: '+ Add to visit questions',
      bookTestBtn: 'Book test',
      ovulationNotif: 'Ovulation Prediction Day!',
      ovulationSub: 'High chance of fertile window',
      energyNotif: 'Today is Your Day',
      energySub: 'Energy rising. Take 30 mins for gentle movement',
      smartCartNotif: 'Smart Cart Swap Ready',
      smartCartSub: 'Zepto: Slurrp Farm Millet Noodles suggested',
      medsNotif: 'Medicine Reminder',
      medsSub: 'Thyronorm taken • Metformin due with dinner',
    },
    home: {
      periodTitle: 'Period:',
      day18: 'Day 18',
      conceptionChance: 'Estimated Conception Chance:',
      conceptionValue: 'Low (8–15%)',
      irregularCycleNote: "Can't predict exactly with irregular cycles",
      ovulationTitle: 'Prediction:',
      ovulationPred: 'Ovulation',
      fertileWindow: 'High chance of fertile window',
      tapHeartHint: 'Tap heart to switch view (Period / Ovulation)',
      forecastTitle: "Today's Forecast",
      highConfidence: 'High Confidence',
      forecastText: 'Day 18. In your last 4 cycles, energy dipped and sugar cravings rose around now. Keep a roasted chana snack handy after 4 pm.',
      speakingNotice: 'Ritu is reading aloud in English (Indian accent)',
      viewOutlook: 'View 3-day outlook',
      hideOutlook: 'Hide 3-day outlook',
      fromLogs: 'From your personal logs',
      safetyGuideline: 'Guideline safety: If pain rises above 7/10, seek emergency medical care (112).',
      monthName: 'November 2026',
      viewCalendar: 'View Calendar',
      daysOfWeek: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      yourMood: 'Your Mood',
      loggedToast: '✓ Logged!',
      addMood: 'Add Mood',
      moodSad: 'Sad',
      moodBad: 'Badmood',
      moodHappy: 'Happy',
      articlesTitle: 'Article',
      seeAll: 'See all',
      weeklyRecapTitle: 'Weekly Audio Recap',
      weeklyRecapSub: 'Sunday log summary',
      duration75s: '75 sec',
      play: 'Play ▶',
      pause: 'Pause ⏸',
      textTranscript: 'Text',
      hideTranscript: 'Hide',
      recapTranscriptText: '"Here is your week, Priya: You logged 6 of 7 days. Your energy was highest on Tuesday after the Besan Chilla breakfast. Metformin adherence was 100%. Two mild cramps were recorded around ovulation. Sleep averaged 7.2 hours."',
      moodBooster: 'Mood Booster',
      smartSwaps: 'Smart swaps →',
      spreadHappiness: 'Spread Happiness',
      activeTrials: 'Active trials →',
      medsChecklistTitle: 'Daily Medicine Checklist',
      careTeamPrescribed: 'Prescribed by Care Team',
      thyronormName: 'Thyronorm 25mcg',
      thyronormDesc: 'Empty stomach • 30m before tea • Dr. Ramesh Gupta',
      metforminName: 'Metformin 500mg',
      metforminDesc: 'With dinner • Dr. Ananya Sen',
      takenLabel: 'Taken ✓',
      dueLabel: 'Due',
      eveningLabel: 'Evening',
      scanPrescriptionBtn: '+ Scan prescription',
      toolsTitle: 'Care Tools & Services',
      oneTapAccess: '1-Tap Access',
      toolFoodTitle: 'Food & You',
      toolFoodSub: 'Tolerances & Thali',
      toolLabsTitle: 'Lab Records',
      toolLabsSub: 'OCR & Trends',
      toolTrialsTitle: 'N-of-1 Trials',
      toolTrialsSub: 'Personal tests',
      toolCartTitle: 'Smart Cart',
      toolCartSub: 'Zepto & Blinkit',
      toolWorkoutsTitle: 'Workouts',
      toolWorkoutsSub: 'PCOS & Thyroid',
      toolFastingTitle: 'Fasting Days',
      toolFastingSub: 'Navratri & Ekadashi',
    },
    care: {
      headerTitle: 'Doctor & Care Team',
      headerSub: 'Consult verified gynecologists, endocrinologists, and specialists with tailored sharing permissions.',
      tabTeam: '🩺 Connected Team',
      tabDoctors: '🏥 Find Doctors by City',
      tabEmergency: '🚨 Emergency Voice Triage',
      tabSummary: '📄 Visit Summary',
      tabScreening: '🗓️ Screenings & Schemes',
      tabDoctorView: '👩‍⚕️ Doctor Portal',
      locationLabel: 'Location / City:',
      allLocations: 'All Cities',
      changeLocation: 'Change Location',
      aiMatchBadge: 'AI Matchmaker (98% Compatibility)',
      aiMatchTitle: 'AI Matched Doctor for Priya',
      aiMatchScore: '98% Clinical Compatibility Match',
      aiMatchWhyTitle: 'Why Ritu Matched This Specialist:',
      aiMatchReason1: 'Specialist in Rotterdam Phenotype B (Metabolic PCOS with insulin resistance)',
      aiMatchReason2: 'Demonstrated 92% cycle regulation success rate in patients with HOMA-IR > 3.0',
      aiMatchReason3: 'Practices in Hyderabad (Banjara Hills) • Fluent in Telugu, Hindi & English',
      bookAiDocBtn: 'Book AI Matched Consultation',
      doctorListTitle: 'Verified Specialists on Platform',
      doctorListSub: 'Filter by city, view verified patient ratings, and book immediate consults.',
      expYears: 'yrs experience',
      reviewsCount: 'patient reviews',
      feeLabel: 'Consultation Fee',
      nextSlotLabel: 'Next Slot:',
      bookConsultBtn: 'Book Consultation',
      emergencyBannerTitle: 'Medical Emergency? Describe by Voice (24/7)',
      emergencyBannerSub: 'Speak your urgent symptoms in Hindi, Telugu, Tamil or English. Ritu extracts chief complaints and alerts the best suited emergency hospital and on-call gynecologist.',
      startEmergencyVoiceBtn: '🚨 Start Emergency Voice Triage',
      emergencyModalTitle: 'Emergency Voice Triage & Doctor Dispatch',
      emergencyModalSub: 'Immediate AI clinical triaging for acute pelvic pain, hemorrhage, or fainting.',
      listeningIndic: 'Listening in Indic Voice... Describe your emergency symptoms now',
      tapToSpeak: 'Tap microphone to speak or click sample emergency',
      chiefComplaintsTitle: 'Extracted Chief Complaints (Clinical Assessment):',
      triageLevelLabel: 'Triage Urgency Level:',
      criticalLevel: '🔴 CRITICAL EMERGENCY (Immediate ER Required)',
      call112Btn: '📞 Call Ambulance (112)',
      bestSuitedDocTitle: 'Best Suited On-Call Emergency Gynecologist & Facility:',
      hospital247: '24/7 Emergency OB/GYN Wing • Fully Equipped OT',
      callErDeskBtn: '🚨 Call Hospital Emergency Desk',
      sampleEmergencyPhrase: '"Sudden severe lower abdominal pain with vomiting and dizziness"',
    },
    checkin: {
      headerPhase: 'Day 18 Daily Log • Luteal Phase',
      headerTitle: 'How are you feeling today?',
      headerSub: 'Log your mood, symptoms, and flow to update your cycle predictions.',
      quickTap: 'Quick Tap',
      voiceNote: 'Voice Note',
      moodLabel: '1. Overall Mood',
      feelingsLabel: 'Specific feelings (Tap to tag):',
      energyLabel: '2. Energy Level',
      cravingsLabel: '3. Sugar & Carb Cravings',
      symptomsLabel: '4. Symptoms & Daily Habits',
      saveLog: "Save Today's Check-in",
      logSaved: '✓ Check-in Logged Successfully!',
      speakIndicPrompt: 'Speak in Hindi, Telugu, Tamil, or English',
    },
    ask: {
      headerTitle: 'Clinical AI Health Coach',
      headerSub: 'Ask any questions regarding PCOS, thyroid, period pain, medications, or dietary guidance grounded in guidelines.',
      disclaimer: 'Grounded in ICMR-NIN & FOGSI Guidelines. Always consult your doctor before changing medications.',
      tabChat: '💬 Health Chat',
      tabFamily: '👨‍👩‍👧 Explain to Family',
      tabExplainer: '💡 Doctor Advice Explainer',
      tabMyths: '🔍 Myth Checker',
      tabLabs: '🧪 Lab Interpreter',
      inputPlaceholder: 'Ask about your symptoms, lab reports, foods...',
      source: 'Source:',
      askDoctor: 'Questions for your doctor:',
      sendBtn: 'Ask Ritu',
    },
    food: {
      headerTitle: 'Food & You',
      headerSub: 'Log Indian meals by text, voice, or thali photo. Learn personal tolerances and view doctor restrictions.',
      tabDaily: 'Daily Food Log',
      tabFasting: 'Fasting Days',
      planWeek: 'Plan My Week',
      thaliPhotoBtn: 'Thali Photo',
      logMealBtn: 'Log Meal',
      calories: 'Calories',
      carbs: 'Carbs',
      protein: 'Protein',
      fiber: 'Fiber',
      toleranceSuits: 'Suits You',
      toleranceCaution: 'Small Portions',
      recentMeals: 'Recent Meals Today',
    },
    profile: {
      headerTitle: 'Health Baseline & Preferences',
      headerSub: 'Manage your diagnosed conditions, life-stage mode, vernacular language, and DPDP privacy settings.',
      tabProfile: 'Health Profile',
      tabCalibration: 'AI Calibration',
      tabCart: 'Smart Cart',
      tabPrivacy: 'DPDP Privacy',
      lifeStageLabel: 'Life-Stage Mode',
      languageHeading: 'App Language & Voice Accent',
      devicesHeading: 'Connected Wearables & Devices',
      dpdpBadge: 'DPDP Act 2023 Compliant',
    },
  },

  hi: {
    nav: {
      home: 'होम',
      log: 'लॉग',
      ask: 'पूछें',
      care: 'केयर',
      profile: 'प्रोफ़ाइल',
    },
    navbar: {
      welcome: 'नमस्ते',
      notifications: 'सूचनाएं',
      unreadCount: '3 नई',
      patternWatchTitle: 'ऋतु ने ध्यान दिया • पैटर्न वॉच',
      patternWatchConfidence: 'उच्च सटीकता',
      patternWatchDesc: 'आपके पिछले 3 मासिक धर्म 38, 41 और 45 दिनों के रहे। लंबे अंतर पर डॉ. सेन से परामर्श लेना उपयोगी है।',
      addQuestionsBtn: '+ विज़िट प्रश्नों में जोड़ें',
      bookTestBtn: 'टेस्ट बुक करें',
      ovulationNotif: 'ओव्यूलेशन अनुमानित दिवस!',
      ovulationSub: 'गर्भधारण की अधिक संभावना वाला समय',
      energyNotif: 'आज आपका दिन है',
      energySub: 'ऊर्जा बढ़ रही है। 30 मिनट हल्की चहलकदमी करें',
      smartCartNotif: 'स्मार्ट कार्ट विकल्प तैयार',
      smartCartSub: 'Zepto: स्लर्प फार्म मिलेट नूडल्स की सिफारिश',
      medsNotif: 'दवा अनुस्मारक',
      medsSub: 'थायरोनॉर्म ली गई • मेटफ़ॉर्मिन रात के भोजन के साथ',
    },
    home: {
      periodTitle: 'मासिक धर्म:',
      day18: '18वां दिन',
      conceptionChance: 'गर्भधारण की अनुमानित संभावना:',
      conceptionValue: 'कम (8–15%)',
      irregularCycleNote: 'अनियमित चक्रों में सटीक गणना संभव नहीं',
      ovulationTitle: 'अनुमान:',
      ovulationPred: 'ओव्यूलेशन',
      fertileWindow: 'उर्वर समय की उच्च संभावना',
      tapHeartHint: 'व्यू बदलने के लिए दिल पर टैप करें (पीरियड / ओव्यूलेशन)',
      forecastTitle: 'आज का पूर्वानुमान',
      highConfidence: 'उच्च सटीकता',
      forecastText: '18वां दिन। आपके पिछले 4 चक्रों में, इस समय ऊर्जा कम हुई थी और मीठे की लालसा बढ़ी थी। शाम 4 बजे के बाद भुने चने का नाश्ता तैयार रखें।',
      speakingNotice: 'ऋतु हिंदी भाषा में पढ़कर सुना रही है',
      viewOutlook: '3-दिवसीय पूर्वानुमान देखें',
      hideOutlook: 'पूर्वानुमान छिपाएं',
      fromLogs: 'आपके व्यक्तिगत लॉग्स से',
      safetyGuideline: 'सुरक्षा निर्देश: यदि दर्द 7/10 से अधिक हो, तो तुरंत आपातकालीन चिकित्सा सहायता (112) लें।',
      monthName: 'नवंबर 2026',
      viewCalendar: 'कैलेंडर देखें',
      daysOfWeek: ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'],
      yourMood: 'आपका मूड',
      loggedToast: '✓ दर्ज किया गया!',
      addMood: 'मूड जोड़ें',
      moodSad: 'उदास',
      moodBad: 'खराब मूड',
      moodHappy: 'खुश',
      articlesTitle: 'स्वास्थ्य लेख',
      seeAll: 'सभी देखें',
      weeklyRecapTitle: 'साप्ताहिक ऑडियो रीकैप',
      weeklyRecapSub: 'रविवार का साप्ताहिक सारांश',
      duration75s: '75 सेकंड',
      play: 'सुनें ▶',
      pause: 'रोकें ⏸',
      textTranscript: 'टेक्स्ट',
      hideTranscript: 'छिपाएं',
      recapTranscriptText: '"प्रिया, यह आपका इस सप्ताह का सारांश है: आपने 7 में से 6 दिन लॉग किया। मंगलवार को बेसन चीला नाश्ते के बाद आपकी ऊर्जा सबसे अधिक थी। मेटफ़ॉर्मिन का पालन 100% रहा। ओव्यूलेशन के आसपास 2 हल्के ऐंठन दर्ज किए गए। नींद औसतन 7.2 घंटे रही।"',
      moodBooster: 'मूड बूस्टर',
      smartSwaps: 'स्वस्थ विकल्प →',
      spreadHappiness: 'खुशियां फैलाएं',
      activeTrials: 'सक्रिय परीक्षण →',
      medsChecklistTitle: 'दैनिक दवा चेकलिस्ट',
      careTeamPrescribed: 'केयर टीम द्वारा निर्धारित',
      thyronormName: 'थायरोनॉर्म 25mcg',
      thyronormDesc: 'खाली पेट • चाय से 30 मिनट पहले • डॉ. रमेश गुप्ता',
      metforminName: 'मेटफ़ॉर्मिन 500mg',
      metforminDesc: 'रात के भोजन के साथ • डॉ. अनन्या सेन',
      takenLabel: 'ली गई ✓',
      dueLabel: 'बाकी',
      eveningLabel: 'शाम',
      scanPrescriptionBtn: '+ नुस्खा (प्रिस्क्रिप्शन) स्कैन करें',
      toolsTitle: 'स्वास्थ्य टूल्स और सेवाएं',
      oneTapAccess: '1-टैप पहुंच',
      toolFoodTitle: 'भोजन और आप',
      toolFoodSub: 'सहनशीलता और थाली',
      toolLabsTitle: 'लैब रिकॉर्ड्स',
      toolLabsSub: 'OCR एवं रुझान',
      toolTrialsTitle: 'N-of-1 परीक्षण',
      toolTrialsSub: 'व्यक्तिगत परीक्षण',
      toolCartTitle: 'स्मार्ट कार्ट',
      toolCartSub: 'Zepto और Blinkit',
      toolWorkoutsTitle: 'व्यायाम',
      toolWorkoutsSub: 'PCOS और थायरॉयड',
      toolFastingTitle: 'व्रत और उपवास',
      toolFastingSub: 'नवरात्रि और एकादशी',
    },
    care: {
      headerTitle: 'डॉक्टर और केयर टीम',
      headerSub: 'सत्यापित स्त्री रोग विशेषज्ञों, एंडोक्रिनोलॉजिस्ट और पोषण विशेषज्ञों से सुगम परामर्श लें।',
      tabTeam: '🩺 जुड़ी हुई टीम',
      tabDoctors: '🏥 शहर अनुसार डॉक्टर खोजें',
      tabEmergency: '🚨 आपातकालीन वॉइस ट्रायज',
      tabSummary: '📄 विज़िट सारांश',
      tabScreening: '🗓️ जांच और सरकारी योजनाएं',
      tabDoctorView: '👩‍⚕️ डॉक्टर पोर्टल',
      locationLabel: 'स्थान / शहर:',
      allLocations: 'सभी शहर',
      changeLocation: 'शहर बदलें',
      aiMatchBadge: 'AI मैचमेकर (98% अनुकूलता)',
      aiMatchTitle: 'प्रिया के लिए AI द्वारा चुना गया सर्वश्रेष्ठ डॉक्टर',
      aiMatchScore: '98% क्लिनिकल अनुकूलता मैच',
      aiMatchWhyTitle: 'ऋतु ने यह विशेषज्ञ क्यों चुना:',
      aiMatchReason1: 'रॉटरडैम फेनोटाइप बी (इंसुलिन प्रतिरोधक PCOS) में विशेषज्ञता',
      aiMatchReason2: 'HOMA-IR > 3.0 वाले मरीजों में 92% चक्र नियमन सफलता दर',
      aiMatchReason3: 'हैदराबाद (बंजारा हिल्स) में कार्यरत • तेलुगु, हिंदी और अंग्रेजी में सहज',
      bookAiDocBtn: 'AI अनुशंसित डॉक्टर से परामर्श बुक करें',
      doctorListTitle: 'प्लेटफॉर्म पर सत्यापित डॉक्टर',
      doctorListSub: 'शहर के अनुसार खोजें, मरीजों की रेटिंग देखें और तुरंत परामर्श बुक करें।',
      expYears: 'वर्षों का अनुभव',
      reviewsCount: 'मरीजों की समीक्षाएं',
      feeLabel: 'परामर्श शुल्क',
      nextSlotLabel: 'उपलब्ध समय:',
      bookConsultBtn: 'परामर्श बुक करें',
      emergencyBannerTitle: 'चिकित्सा आपातकाल? बोलकर बताएं (24/7)',
      emergencyBannerSub: 'हिंदी, तेलुगु, तमिल या अंग्रेजी में अपने लक्षण बताएं। ऋतु तुरंत मुख्य शिकायतों को पहचान कर नजदीकी आपातकालीन अस्पताल और ऑन-ड्यूटी डॉक्टर से जोड़ती है।',
      startEmergencyVoiceBtn: '🚨 आपातकालीन वॉइस ट्रायज शुरू करें',
      emergencyModalTitle: 'आपातकालीन वॉइस ट्रायज एवं डॉक्टर सहायता',
      emergencyModalSub: 'अत्यधिक पेल्विक दर्द, रक्तस्राव या चक्कर आने पर तत्काल क्लिनिकल मूल्यांकन।',
      listeningIndic: 'सुन रहे हैं... अपने आपातकालीन लक्षण अभी बताएं',
      tapToSpeak: 'बोलने के लिए माइक दबाएं या नमूना वाक्य चुनें',
      chiefComplaintsTitle: 'पहचानी गई मुख्य शिकायतें (क्लिनिकल मूल्यांकन):',
      triageLevelLabel: 'गंभीरता का स्तर:',
      criticalLevel: '🔴 गंभीर आपातकाल (तुरंत अस्पताल ER जाएं)',
      call112Btn: '📞 एम्बुलेंस बुलाएं (112)',
      bestSuitedDocTitle: 'सर्वश्रेष्ठ ऑन-ड्यूटी आपातकालीन स्त्री रोग विशेषज्ञ व अस्पताल:',
      hospital247: '24/7 आपातकालीन महिला वार्ड • सुसज्जित ऑपरेशन थिएटर',
      callErDeskBtn: '🚨 अस्पताल आपातकालीन डेस्क पर कॉल करें',
      sampleEmergencyPhrase: '"अचानक पेट के निचले हिस्से में बहुत तेज दर्द उठा है, उल्टी जैसा लग रहा है और चक्कर आ रहे हैं"',
    },
    checkin: {
      headerPhase: '18वां दिन दैनिक लॉग • ल्यूटियल चरण',
      headerTitle: 'आज आप कैसा महसूस कर रही हैं?',
      headerSub: 'अपने चक्र पूर्वानुमानों को अपडेट करने के लिए मूड, लक्षण और फ्लो दर्ज करें।',
      quickTap: 'त्वरित टैप',
      voiceNote: 'आवाज़ से बताएं',
      moodLabel: '1. समग्र मूड',
      feelingsLabel: 'विशिष्ट भावनाएं (टैप करें):',
      energyLabel: '2. ऊर्जा का स्तर',
      cravingsLabel: '3. मीठे और कार्ब्स की लालसा',
      symptomsLabel: '4. लक्षण एवं दैनिक आदतें',
      saveLog: 'आज का चेक-इन सहेजें',
      logSaved: '✓ चेक-इन सफलतापूर्वक दर्ज हुआ!',
      speakIndicPrompt: 'हिंदी, तेलुगु, तमिल या अंग्रेजी में बोलें',
    },
    ask: {
      headerTitle: 'क्लिनिकल AI स्वास्थ्य साथी',
      headerSub: 'PCOS, थायरॉयड, दर्द, दवाइयों या आहार संबंधी कोई भी प्रश्न पूछें। दिशानिर्देशों पर आधारित उत्तर।',
      disclaimer: 'ICMR-NIN और FOGSI दिशानिर्देशों पर आधारित। दवाएं बदलने से पहले हमेशा डॉक्टर से परामर्श लें।',
      tabChat: '💬 स्वास्थ्य चैट',
      tabFamily: '👨‍👩‍👧 परिवार को समझाएं',
      tabExplainer: '💡 डॉक्टर सलाह व्याख्याकार',
      tabMyths: '🔍 भ्रांति निवारक',
      tabLabs: '🧪 लैब रिपोर्ट विश्लेषक',
      inputPlaceholder: 'अपने लक्षण, लैब रिपोर्ट या खानपान के बारे में पूछें...',
      source: 'स्रोत:',
      askDoctor: 'डॉक्टर से पूछने योग्य प्रश्न:',
      sendBtn: 'ऋतु से पूछें',
    },
    food: {
      headerTitle: 'भोजन और आप',
      headerSub: 'बोलकर, लिखकर या थाली की फोटो से भारतीय भोजन दर्ज करें। व्यक्तिगत सहनशीलता जानें।',
      tabDaily: 'दैनिक भोजन डायरी',
      tabFasting: 'व्रत और उपवास',
      planWeek: 'सप्ताह की योजना बनाएं',
      thaliPhotoBtn: 'थाली फोटो',
      logMealBtn: 'भोजन दर्ज करें',
      calories: 'कैलोरी',
      carbs: 'कार्ब्स',
      protein: 'प्रोटीन',
      fiber: 'फाइबर',
      toleranceSuits: 'अनुकूल है',
      toleranceCaution: 'सीमित मात्रा',
      recentMeals: 'आज का हालिया भोजन',
    },
    profile: {
      headerTitle: 'स्वास्थ्य आधारभूत रेखा और प्राथमिकताएं',
      headerSub: 'अपनी स्वास्थ्य स्थितियां, जीवन-अवस्था मोड, भाषा और DPDP गोपनीयता सेटिंग्स प्रबंधित करें।',
      tabProfile: 'स्वास्थ्य प्रोफ़ाइल',
      tabCalibration: 'AI अंशांकन',
      tabCart: 'स्मार्ट कार्ट',
      tabPrivacy: 'DPDP गोपनीयता',
      lifeStageLabel: 'जीवन-अवस्था मोड',
      languageHeading: 'ऐप भाषा एवं वॉइस एक्सेंट',
      devicesHeading: 'जुड़े हुए उपकरण एवं वियरेबल्स',
      dpdpBadge: 'DPDP अधिनियम 2023 अनुपालन',
    },
  },

  te: {
    nav: {
      home: 'హోమ్',
      log: 'లాగ్',
      ask: 'అడగండి',
      care: 'కేర్',
      profile: 'ప్రొఫైల్',
    },
    navbar: {
      welcome: 'స్వాగతం',
      notifications: 'నోటిఫికేషన్లు',
      unreadCount: '3 కొత్తవి',
      patternWatchTitle: 'ఋతు గమనించింది • ప్యాటర్న్ వాచ్',
      patternWatchConfidence: 'అధిక ఖచ్చితత్వం',
      patternWatchDesc: 'మీ గత 3 పీరియడ్స్ 38, 41 మరియు 45 రోజులు ఉన్నాయి. ఇంత ఎక్కువ గ్యాప్ గురించి డాక్టర్ సేన్‌తో చర్చించడం మంచిది.',
      addQuestionsBtn: '+ సందర్శన ప్రశ్నలకు జోడించండి',
      bookTestBtn: 'పరీక్ష బుక్ చేయండి',
      ovulationNotif: 'అండం విడుదలయ్యే రోజు (Ovulation)!',
      ovulationSub: 'గర్భధారణకు అనుకూలమైన సమయం',
      energyNotif: 'ఈరోజు మీ రోజు',
      energySub: 'శక్తి పెరుగుతోంది. 30 నిమిషాల నడక చేయండి',
      smartCartNotif: 'స్మార్ట్ కార్ట్ ఎంపిక సిద్ధం',
      smartCartSub: 'Zepto: స్లర్ప్ ఫార్మ్ మిల్లెట్ నూడుల్స్ సూచించబడింది',
      medsNotif: 'మందుల రిమైండర్',
      medsSub: 'థైరోనార్మ్ వేసుకున్నారు • డిన్నర్‌తో మెట్‌ఫార్మిన్ ఉంది',
    },
    home: {
      periodTitle: 'పీరియడ్:',
      day18: '18వ రోజు',
      conceptionChance: 'గర్భధారణ అంచనా అవకాశం:',
      conceptionValue: 'తక్కువ (8–15%)',
      irregularCycleNote: 'సక్రమంగా లేని సైకిల్స్‌లో ఖచ్చితంగా చెప్పలేము',
      ovulationTitle: 'అంచనా:',
      ovulationPred: 'అండం విడుదల (Ovulation)',
      fertileWindow: 'ఫెర్టైల్ విండో ఉండే అధిక అవకాశం',
      tapHeartHint: 'వీక్షణ మార్చడానికి గుండెపై నొక్కండి (పీరియడ్ / ఓవ్యులేషన్)',
      forecastTitle: 'ఈరోజు సూచన',
      highConfidence: 'అధిక ఖచ్చితత్వం',
      forecastText: '18వ రోజు. గత 4 సైకిల్స్‌లో, ఈ సమయంలో శక్తి తగ్గి తీపి తినాలనే కోరిక పెరిగింది. సాయంత్రం 4 గంటల తర్వాత వేయించిన శనగల స్నాక్ దగ్గర ఉంచుకోండి.',
      speakingNotice: 'ఋతు తెలుగులో చదివి వినిపిస్తోంది',
      viewOutlook: '3 రోజుల దృక్పథాన్ని చూడండి',
      hideOutlook: 'దృక్పథాన్ని దాచండి',
      fromLogs: 'మీ వ్యక్తిగత రికార్డుల నుండి',
      safetyGuideline: 'భద్రతా సూచన: నొప్పి 7/10 కంటే ఎక్కువ ఉంటే, వెంటనే అత్యవసర వైద్య సహాయం (112) పొందండి.',
      monthName: 'నవంబర్ 2026',
      viewCalendar: 'క్యాలెండర్ చూడండి',
      daysOfWeek: ['ఆ', 'సో', 'మం', 'బు', 'గు', 'శు', 'శ'],
      yourMood: 'మీ మూడ్',
      loggedToast: '✓ నమోదైంది!',
      addMood: 'మూడ్ జోడించండి',
      moodSad: 'బాధగా ఉంది',
      moodBad: 'చిరాకుగా ఉంది',
      moodHappy: 'సంతోషంగా ఉంది',
      articlesTitle: 'ఆరోగ్య సమాచారం',
      seeAll: 'అన్నీ చూడండి',
      weeklyRecapTitle: 'వారపు ఆడియో రీక్యాప్',
      weeklyRecapSub: 'ఆదివారం వారపు సారాంశం',
      duration75s: '75 సెకన్లు',
      play: 'వినండి ▶',
      pause: 'ఆపండి ⏸',
      textTranscript: 'వచనం',
      hideTranscript: 'దాచండి',
      recapTranscriptText: '"ప్రియా, ఈ వారం మీ సారాంశం: మీరు 7 రోజులలో 6 రోజులు నమోదు చేశారు. మంగళవారం బేసన్ చిల్లా అల్పాహారం తర్వాత మీ శక్తి అత్యధికంగా ఉంది. మెట్‌ఫార్మిన్ క్రమం తప్పకుండా 100% తీసుకున్నారు. నిద్ర సగటున 7.2 గంటలు నమోదైంది."',
      moodBooster: 'మూడ్ బూస్టర్',
      smartSwaps: 'మంచి ప్రత్యామ్నాయాలు →',
      spreadHappiness: 'ఉత్సాహంగా ఉండండి',
      activeTrials: 'ప్రస్తుత ట్రయల్స్ →',
      medsChecklistTitle: 'రోజువారీ మందుల జాబితా',
      careTeamPrescribed: 'వైద్యుల బృందం సూచించినవి',
      thyronormName: 'థైరోనార్మ్ 25mcg',
      thyronormDesc: 'ఖాళీ కడుపుతో • టీ తాగడానికి 30 నిమిషాల ముందు',
      metforminName: 'మెట్‌ఫార్మిన్ 500mg',
      metforminDesc: 'రాత్రి భోజనంతో • డాక్టర్ అనన్య సేన్',
      takenLabel: 'వేసుకున్నారు ✓',
      dueLabel: 'బాకీ ఉంది',
      eveningLabel: 'సాయంత్రం',
      scanPrescriptionBtn: '+ ప్రిస్క్రిప్షన్ స్కాన్ చేయండి',
      toolsTitle: 'సంరక్షణ సాధనాలు & సేవలు',
      oneTapAccess: 'ఒక్క ట్యాప్‌తో సులభంగా',
      toolFoodTitle: 'ఆహారం మరియు మీరు',
      toolFoodSub: 'సహించే గుణం & థాలీ',
      toolLabsTitle: 'ల్యాబ్ రికార్డులు',
      toolLabsSub: 'OCR మరియు మార్పులు',
      toolTrialsTitle: 'N-of-1 ట్రయల్స్',
      toolTrialsSub: 'వ్యక్తిగత పరీక్షలు',
      toolCartTitle: 'స్మార్ట్ కార్ట్',
      toolCartSub: 'Zepto & Blinkit',
      toolWorkoutsTitle: 'వ్యాయామాలు',
      toolWorkoutsSub: 'PCOS & థైరాయిడ్',
      toolFastingTitle: 'ఉపవాస దినాలు',
      toolFastingSub: 'నవరాత్రి & ఏకాదశి',
    },
    care: {
      headerTitle: 'వైద్యులు & సంరక్షణ బృందం',
      headerSub: 'ధృవీకరించబడిన గైనకాలజిస్టులు, ఎండోక్రినాలజిస్టులు మరియు పోషకాహార నిపుణులతో సులభంగా సంప్రదించండి.',
      tabTeam: '🩺 అనుసంధానించబడిన బృందం',
      tabDoctors: '🏥 నగరం వారీగా వైద్యులు',
      tabEmergency: '🚨 అత్యవసర వాయిస్ ట్రయాజ్ (SOS)',
      tabSummary: '📄 సంప్రదింపు సారాంశం',
      tabScreening: '🗓️ స్క్రీనింగ్‌లు & ప్రభుత్వ పథకాలు',
      tabDoctorView: '👩‍⚕️ డాక్టర్ పోర్టల్',
      locationLabel: 'ప్రాంతం / నగరం:',
      allLocations: 'అన్ని నగరాలు',
      changeLocation: 'నగరం మార్చండి',
      aiMatchBadge: 'AI మ్యాచ్‌మేకర్ (98% అనుకూలత)',
      aiMatchTitle: 'ప్రియా కోసం AI ఎంపిక చేసిన ఉత్తమ వైద్యురాలు',
      aiMatchScore: '98% క్లినికల్ అనుకూలత మ్యాచ్',
      aiMatchWhyTitle: 'ఋతు ఈ స్పెషలిస్ట్‌ను ఎందుకు ఎంచుకుంది:',
      aiMatchReason1: 'రోటర్‌డ్యామ్ ఫినోటైప్ B (ఇన్సులిన్ రెసిస్టెన్స్ PCOS) లో నిపుణురాలు',
      aiMatchReason2: 'HOMA-IR > 3.0 ఉన్న రోగులలో 92% పీరియడ్స్ క్రమబద్ధీకరణ విజయ రేటు',
      aiMatchReason3: 'హైదరాబాద్ (బంజారా హిల్స్) లో క్లినిక్ • తెలుగు, హిందీ, ఇంగ్లీష్ మాట్లాడగలరు',
      bookAiDocBtn: 'AI సరిపోల్చిన వైద్యురాలితో అపాయింట్‌మెంట్ బుక్ చేయండి',
      doctorListTitle: 'ప్లాట్‌ఫారమ్‌లో ధృవీకరించబడిన వైద్యులు',
      doctorListSub: 'నగరం వారీగా చూడండి, రోగుల రేటింగ్‌లు పరిశీలించండి మరియు వెంటనే బుక్ చేయండి.',
      expYears: 'సంవత్సరాల అనుభవం',
      reviewsCount: 'రోగుల సమీక్షలు',
      feeLabel: 'ఫీజు',
      nextSlotLabel: 'తదుపరి సమయం:',
      bookConsultBtn: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
      emergencyBannerTitle: 'వైద్య అత్యవసర పరిస్థితా? వాయిస్ ద్వారా చెప్పండి (24/7)',
      emergencyBannerSub: 'తెలుగు, హిందీ, తమిళం లేదా ఇంగ్లీషులో మీ అత్యవసర లక్షణాలను మాట్లాడండి. ఋతు వెంటనే ప్రధాన సమస్యలను గుర్తించి అత్యవసర ఆసుపత్రికి మరియు ఆన్-డ్యూటీ వైద్యుడికి కనెక్ట్ చేస్తుంది.',
      startEmergencyVoiceBtn: '🚨 అత్యవసర వాయిస్ ట్రయాజ్ ప్రారంభించండి',
      emergencyModalTitle: 'అత్యవసర వాయిస్ ట్రయాజ్ & డాక్టర్ సహాయం',
      emergencyModalSub: 'తీవ్రమైన కడుపు నొప్పి, అధిక రక్తస్రావం లేదా మైకం వచ్చినప్పుడు తక్షణ వైద్య అంచనా.',
      listeningIndic: 'వింటోంది... మీ అత్యవసర లక్షణాలను ఇప్పుడు స్పష్టంగా చెప్పండి',
      tapToSpeak: 'మాట్లాడటానికి మైక్ నొక్కండి లేదా నమూనా వాక్యాన్ని ఎంచుకోండి',
      chiefComplaintsTitle: 'గుర్తించబడిన ప్రధాన సమస్యలు (Chief Complaints):',
      triageLevelLabel: 'తీవ్రత స్థాయి:',
      criticalLevel: '🔴 తీవ్రమైన అత్యవసరం (వెంటనే ఆసుపత్రి ER కి వెళ్లండి)',
      call112Btn: '📞 అంబులెన్స్ పిలవండి (112)',
      bestSuitedDocTitle: 'అత్యంత అనువైన ఆన్-డ్యూటీ అత్యవసర వైద్యురాలు & ఆసుపత్రి:',
      hospital247: '24/7 అత్యవసర మహిళా విభాగం • పూర్తి ఆపరేషన్ థియేటర్ సదుపాయం',
      callErDeskBtn: '🚨 ఆసుపత్రి ఎమర్జెన్సీ డెస్క్‌కు కాల్ చేయండి',
      sampleEmergencyPhrase: '"అకస్మాత్తుగా పొత్తికడుపులో విపరీతమైన నొప్పి వస్తోంది, వాంతి వచ్చేలా ఉంది, కళ్ళు తిరుగుతున్నాయి"',
    },
    checkin: {
      headerPhase: '18వ రోజు డైలీ లాగ్ • లూటియల్ దశ',
      headerTitle: 'ఈరోజు మీరు ఎలా భావిస్తున్నారు?',
      headerSub: 'మీ సైకిల్ అంచనాలను అప్‌డేట్ చేయడానికి మూడ్, లక్షణాలు మరియు బ్లీడింగ్ నమోదు చేయండి.',
      quickTap: 'త్వరిత ట్యాప్',
      voiceNote: 'వాయిస్ నోట్',
      moodLabel: '1. మొత్తం మూడ్',
      feelingsLabel: 'నిర్దిష్ట భావాలు (ట్యాప్ చేయండి):',
      energyLabel: '2. శక్తి స్థాయి',
      cravingsLabel: '3. స్వీట్స్ మరియు కార్బ్స్ కోరికలు',
      symptomsLabel: '4. లక్షణాలు & అలవాట్లు',
      saveLog: 'ఈరోజు చెక్-ఇన్ సేవ్ చేయండి',
      logSaved: '✓ విజయవంతంగా నమోదైంది!',
      speakIndicPrompt: 'తెలుగు, హిందీ, తమిళం లేదా ఇంగ్లీషులో మాట్లాడండి',
    },
    ask: {
      headerTitle: 'క్లినికల్ AI హెల్త్ కోచ్',
      headerSub: 'PCOS, థైరాయిడ్, పీరియడ్ నొప్పి, మందులు లేదా ఆహారం గురించి ఏవైనా సందేహాలు అడగండి.',
      disclaimer: 'ICMR-NIN & FOGSI మార్గదర్శకాల ఆధారంగా రూపొందించబడింది. మందులు మార్చే ముందు వైద్యుడిని సంప్రదించండి.',
      tabChat: '💬 హెల్త్ చాట్',
      tabFamily: '👨‍👩‍👧 కుటుంబానికి వివరించండి',
      tabExplainer: '💡 డాక్టర్ సలహా వివరణ',
      tabMyths: '🔍 అపోహల నివారణ',
      tabLabs: '🧪 ల్యాబ్ విశ్లేషణ',
      inputPlaceholder: 'మీ లక్షణాలు, ల్యాబ్ రిపోర్టులు లేదా ఆహారం గురించి అడగండి...',
      source: 'మూలం:',
      askDoctor: 'డాక్టర్‌ను అడగవలసిన ప్రశ్నలు:',
      sendBtn: 'ఋతును అడగండి',
    },
    food: {
      headerTitle: 'ఆహారం మరియు మీరు',
      headerSub: 'మాటల ద్వారా, రాసి లేదా థాలీ ఫోటో ద్వారా భోజనాన్ని రికార్డ్ చేయండి. మీ శరీరానికి ఏది సరిపడుతుందో తెలుసుకోండి.',
      tabDaily: 'రోజువారీ భోజన లాగ్',
      tabFasting: 'ఉపవాస దినాలు',
      planWeek: 'వారపు ప్రణాళిక',
      thaliPhotoBtn: 'థాలీ ఫోటో',
      logMealBtn: 'భోజనం నమోదు చేయండి',
      calories: 'క్యాలరీలు',
      carbs: 'కార్బ్స్',
      protein: 'ప్రోటీన్',
      fiber: 'పీచు పదార్థం',
      toleranceSuits: 'మీకు సరిపడుతుంది',
      toleranceCaution: 'తక్కువ పరిమాణంలో',
      recentMeals: 'ఈరోజు తిన్న భోజనం',
    },
    profile: {
      headerTitle: 'ఆరోగ్య బేస్‌లైన్ & ప్రాధాన్యతలు',
      headerSub: 'మీ ఆరోగ్య పరిస్థితులు, జీవిత దశ మోడ్, భాష మరియు DPDP గోప్యతా సెట్టింగ్‌లను నిర్వహించండి.',
      tabProfile: 'ఆరోగ్య ప్రొఫైల్',
      tabCalibration: 'AI కాలిబ్రేషన్',
      tabCart: 'స్మార్ట్ కార్ట్',
      tabPrivacy: 'DPDP గోప్యత',
      lifeStageLabel: 'జీవిత దశ మోడ్',
      languageHeading: 'యాప్ భాష & వాయిస్ యాస',
      devicesHeading: 'కనెక్ట్ చేసిన పరికరాలు',
      dpdpBadge: 'DPDP చట్టం 2023 అనుగుణంగా ఉంది',
    },
  },

  ta: {
    nav: {
      home: 'முகப்பு',
      log: 'பதிவு',
      ask: 'கேளுங்கள்',
      care: 'பராமரிப்பு',
      profile: 'சுயவிவரம்',
    },
    navbar: {
      welcome: 'வணக்கம்',
      notifications: 'அறிவிப்புகள்',
      unreadCount: '3 புதியவை',
      patternWatchTitle: 'ரிது கவனித்தது • பேட்டர்ன் வாட்ச்',
      patternWatchConfidence: 'அதிக துல்லியம்',
      patternWatchDesc: 'உங்கள் கடந்த 3 மாதவிடாய்கள் 38, 41 மற்றும் 45 நாட்கள் இருந்தன. இந்த இடைவெளியை டாக்டர் சென்னுடன் விவாதிக்கவும்.',
      addQuestionsBtn: '+ கேள்விகளில் சேர்க்கவும்',
      bookTestBtn: 'பரிசோதனை பதிவு செய்',
      ovulationNotif: 'கருமுட்டை வெளியாகும் நாள் (Ovulation)!',
      ovulationSub: 'கருத்தரிக்கும் வாய்ப்பு அதிகம் உள்ள நேரம்',
      energyNotif: 'இன்று உங்கள் நாள்',
      energySub: 'ஆற்றல் கூடுகிறது. 30 நிமிடம் நடைப்பயிற்சி செய்யுங்கள்',
      smartCartNotif: 'ஸ்மார்ட் கார்ட் தேர்வு தயார்',
      smartCartSub: 'Zepto: ஸ்லர்ப் ஃபார்ம் மில்லெட் நூடுல்ஸ் பரிந்துரை',
      medsNotif: 'மருந்து நினைவூட்டல்',
      medsSub: 'தைரோநார்ம் எடுக்கப்பட்டது • இரவு உணவோடு மெட்ஃபோர்மின்',
    },
    home: {
      periodTitle: 'மாதவிடாய்:',
      day18: 'நாள் 18',
      conceptionChance: 'கருத்தரிப்பு வாய்ப்பு:',
      conceptionValue: 'குறைவு (8–15%)',
      irregularCycleNote: 'ஒழுங்கற்ற சுழற்சியில் துல்லியமாகக் கணிக்க முடியாது',
      ovulationTitle: 'கணிப்பு:',
      ovulationPred: 'கருமுட்டை வெளியீடு',
      fertileWindow: 'கருத்தரிப்பு வாய்ப்பு அதிகம்',
      tapHeartHint: 'காட்சியை மாற்ற இதயத்தைத் தட்டவும் (மாதவிடாய் / கருமுட்டை)',
      forecastTitle: 'இன்றைய முன்னறிவிப்பு',
      highConfidence: 'அதிக துல்லியம்',
      forecastText: 'நாள் 18. உங்கள் கடந்த 4 சுழற்சிகளில், இந்த நேரத்தில் ஆற்றல் குறைந்து இனிப்பு ஆசை அதிகரித்தது. மாலை 4 மணிக்கு மேல் வறுத்த கொண்டைக்கடலை சிற்றுண்டியை அருகில் வையுங்கள்.',
      speakingNotice: 'ரிது தமிழில் வாசித்து காண்பிக்கிறது',
      viewOutlook: '3-நாள் கண்ணோட்டத்தைப் பார்க்கவும்',
      hideOutlook: 'கண்ணோட்டத்தை மறைக்கவும்',
      fromLogs: 'உங்கள் தனிப்பட்ட பதிவுகளிலிருந்து',
      safetyGuideline: 'பாதுகாப்பு அறிவுரை: வலி 7/10க்கு மேல் இருந்தால், உடனடியாக அவசர மருத்துவ உதவியை (112) அணுகவும்.',
      monthName: 'நவம்பர் 2026',
      viewCalendar: 'நாட்காட்டியைப் பார்',
      daysOfWeek: ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச'],
      yourMood: 'உங்கள் மனநிலை',
      loggedToast: '✓ பதிவானது!',
      addMood: 'மனநிலை சேர்',
      moodSad: 'வருத்தம்',
      moodBad: 'சோர்வு',
      moodHappy: 'மகிழ்ச்சி',
      articlesTitle: 'ஆரோக்கியக் கட்டுரைகள்',
      seeAll: 'அனைத்தும் பார்',
      weeklyRecapTitle: 'வாராந்திர ஆடியோ சுருக்கம்',
      weeklyRecapSub: 'ஞாயிறு வாராந்திர சுருக்கம்',
      duration75s: '75 விநாடிகள்',
      play: 'கேளுங்கள் ▶',
      pause: 'நிறுத்து ⏸',
      textTranscript: 'உரை',
      hideTranscript: 'மறைக்க',
      recapTranscriptText: '"பிரியா, இந்த வாரத்தின் சுருக்கம்: நீங்கள் 7 நாட்களில் 6 நாட்கள் பதிவு செய்துள்ளீர்கள். செவ்வாய்க்கிழமை கடலைமாவு தோசை காலை உணவுக்குப் பிறகு உங்கள் ஆற்றல் அதிகமாக இருந்தது. மெட்ஃபோர்மின் மருந்து உட்கொள்ளல் 100% இருந்தது. கருமுட்டை வெளியீட்டின் போது 2 லேசான வலிகள் பதிவாகின."',
      moodBooster: 'மனநிலை ஊக்கி',
      smartSwaps: 'ஆரோக்கிய மாற்றங்கள் →',
      spreadHappiness: 'மகிழ்ச்சி பரப்புங்கள்',
      activeTrials: 'செயலில் உள்ள சோதனைகள் →',
      medsChecklistTitle: 'தினசரி மருந்து பட்டியல்',
      careTeamPrescribed: 'மருத்துவக் குழு பரிந்துரைத்தது',
      thyronormName: 'தைரோநார்ம் 25mcg',
      thyronormDesc: 'வெறும் வயிற்றில் • டீ குடிப்பதற்கு 30 நிமிடம் முன்',
      metforminName: 'மெட்ஃபோர்மின் 500mg',
      metforminDesc: 'இரவு உணவோடு • டாக்டர் அனன்யா சென்',
      takenLabel: 'எடுக்கப்பட்டது ✓',
      dueLabel: 'பாக்கி',
      eveningLabel: 'மாலை',
      scanPrescriptionBtn: '+ மருந்துச்சீட்டை ஸ்கேன் செய்க',
      toolsTitle: 'பராமரிப்பு கருவிகள் & சேவைகள்',
      oneTapAccess: '1-தட்டுதல் அணுகல்',
      toolFoodTitle: 'உணவும் நீங்களும்',
      toolFoodSub: 'சகிப்புத்தன்மை & தாளி',
      toolLabsTitle: 'பரிசோதனை பதிவுகள்',
      toolLabsSub: 'OCR & மாற்றங்கள்',
      toolTrialsTitle: 'N-of-1 சோதனைகள்',
      toolTrialsSub: 'தனிப்பயன் சோதனைகள்',
      toolCartTitle: 'ஸ்மார்ட் கார்ட்',
      toolCartSub: 'Zepto & Blinkit',
      toolWorkoutsTitle: 'உடற்பயிற்சி',
      toolWorkoutsSub: 'PCOS & தைராய்டு',
      toolFastingTitle: 'விரத நாட்கள்',
      toolFastingSub: 'நவராத்திரி & ஏகாதசி',
    },
    care: {
      headerTitle: 'மருத்துவர் & பராமரிப்புக் குழு',
      headerSub: 'சான்றளிக்கப்பட்ட மகளிர் நல மருத்துவர்கள், நாளமில்லா சுரப்பி நிபுணர்கள் மற்றும் ஊட்டச்சத்து நிபுணர்களை அணுகவும்.',
      tabTeam: '🩺 இணைக்கப்பட்ட குழு',
      tabDoctors: '🏥 நகரம் வாரியாக மருத்துவர்கள்',
      tabEmergency: '🚨 அவசர குரல் பரிசோதனை (SOS)',
      tabSummary: '📄 வருகை சுருக்கம்',
      tabScreening: '🗓️ பரிசோதனைகள் & அரசு திட்டங்கள்',
      tabDoctorView: '👩‍⚕️ மருத்துவர் தளம்',
      locationLabel: 'இடம் / நகரம்:',
      allLocations: 'அனைத்து நகரங்கள்',
      changeLocation: 'நகரத்தை மாற்றவும்',
      aiMatchBadge: 'AI பொருத்தம் (98% துல்லியம்)',
      aiMatchTitle: 'பிரியாவுக்காக AI தேர்ந்தெடுத்த சிறந்த மருத்துவர்',
      aiMatchScore: '98% மருத்துவ பொருத்தப் புள்ளி',
      aiMatchWhyTitle: 'ரிது இந்த மருத்துவரை ஏன் தேர்ந்தெடுத்தது:',
      aiMatchReason1: 'ரோட்டர்டாம் பினோடைப் பி (இன்சுலின் எதிர்ப்பு பிசிஓஎஸ்) நிபுணர்',
      aiMatchReason2: 'HOMA-IR > 3.0 உள்ள நோயாளிகளுக்கு 92% மாதவிடாய் சீராக்கல் வெற்றி விகிதம்',
      aiMatchReason3: 'ஹைதராபாத் (பஞ்சாரா ஹில்ஸ்) கிளினிக் • தெலுங்கு, இந்தி & ஆங்கிலத்தில் பேசக்கூடியவர்',
      bookAiDocBtn: 'AI பரிந்துரைத்த மருத்துவரிடம் முன்பதிவு செய்',
      doctorListTitle: 'சான்றளிக்கப்பட்ட சிறந்த மருத்துவர்கள்',
      doctorListSub: 'நகரம் வாரியாக தேடவும், நோயாளிகளின் மதிப்பீடுகளைப் பார்க்கவும், உடனடியாக முன்பதிவு செய்யவும்.',
      expYears: 'ஆண்டுகள் அனுபவம்',
      reviewsCount: 'நோயாளி மதிப்புரைகள்',
      feeLabel: 'ஆலோசனை கட்டணம்',
      nextSlotLabel: 'அடுத்த நேரம்:',
      bookConsultBtn: 'முன்பதிவு செய்க',
      emergencyBannerTitle: 'மருத்துவ அவசரநிலையா? குரல் மூலம் சொல்லுங்கள் (24/7)',
      emergencyBannerSub: 'தமிழ், தெலுங்கு, இந்தி அல்லது ஆங்கிலத்தில் உங்கள் அவசர அறிகுறிகளைப் பேசுங்கள். ரிது முக்கிய அறிகுறிகளைப் பிரித்தெடுத்து அவசர மருத்துவமனை மற்றும் மருத்துவரை உடனடியாக இணைக்கிறது.',
      startEmergencyVoiceBtn: '🚨 அவசர குரல் பரிசோதனையைத் தொடங்கு',
      emergencyModalTitle: 'அவசர குரல் பரிசோதனை & மருத்துவர் உதவி',
      emergencyModalSub: 'கடுமையான வயிற்று வலி, இரத்தப்போக்கு அல்லது மயக்கம் ஏற்பட்டால் உடனடி மதிப்பீடு.',
      listeningIndic: 'கேட்கிறது... உங்கள் அவசர அறிகுறிகளை இப்போது கூறுங்கள்',
      tapToSpeak: 'பேச மைக்கை அழுத்தவும் அல்லது மாதிரி வாக்கியத்தைத் தொடவும்',
      chiefComplaintsTitle: 'கண்டறியப்பட்ட முக்கிய புகார்கள் (Chief Complaints):',
      triageLevelLabel: 'அவசர நிலை:',
      criticalLevel: '🔴 தீவிர அவசரநிலை (உடனடியாக மருத்துவமனைக்குச் செல்லவும்)',
      call112Btn: '📞 ஆம்புலன்ஸ் அழைக்கவும் (112)',
      bestSuitedDocTitle: 'மிகவும் பொருத்தமான அவசர மகளிர் நல மருத்துவர் & மருத்துவமனை:',
      hospital247: '24/7 அவசர மகளிர் பிரிவு • அறுவை சிகிச்சை அரங்கு தயார் நிலை',
      callErDeskBtn: '🚨 மருத்துவமனை அவசர பிரிவை அழைக்கவும்',
      sampleEmergencyPhrase: '"திடீரென அடிவயிற்றில் தாங்க முடியாத கடுமையான வலி ஏற்பட்டுள்ளது, தலை சுற்றுகிறது, வாந்தி வருவது போல் உள்ளது"',
    },
    checkin: {
      headerPhase: 'நாள் 18 தினசரி பதிவு • லூட்டீயல் நிலை',
      headerTitle: 'இன்று நீங்கள் எப்படி உணர்கிறீர்கள்?',
      headerSub: 'உங்கள் சுழற்சி கணிப்புகளைப் புதுப்பிக்க உங்கள் மனநிலை, அறிகுறிகள் மற்றும் போக்கை பதிவு செய்யவும்.',
      quickTap: 'விரைவு தட்டுதல்',
      voiceNote: 'குரல் பதிவு',
      moodLabel: '1. ஒட்டுமொத்த மனநிலை',
      feelingsLabel: 'குறிப்பிட்ட உணர்வுகள் (தொட்டு தேர்வு செய்க):',
      energyLabel: '2. ஆற்றல் நிலை',
      cravingsLabel: '3. இனிப்பு & மாவுச்சத்து ஆசைகள்',
      symptomsLabel: '4. அறிகுறிகள் & தினசரி பழக்கங்கள்',
      saveLog: 'இன்றைய பதிவை சேமிக்கவும்',
      logSaved: '✓ பதிவு வெற்றிகரமாக சேமிக்கப்பட்டது!',
      speakIndicPrompt: 'தமிழ், தெலுங்கு, இந்தி அல்லது ஆங்கிலத்தில் பேசவும்',
    },
    ask: {
      headerTitle: 'மருத்துவ AI சுகாதார வழிகாட்டி',
      headerSub: 'PCOS, தைராய்டு, மாதவிடாய் வலி, மருந்துகள் அல்லது உணவு முறை குறித்த எந்த கேள்விகளையும் கேட்கவும்.',
      disclaimer: 'ICMR-NIN & FOGSI வழிகாட்டுதல்களின் அடிப்படையில் உருவாக்கப்பட்டது. மருந்துகளை மாற்றுவதற்கு முன் எப்போதும் மருத்துவரை அணுகவும்.',
      tabChat: '💬 நலம் அரட்டை',
      tabFamily: '👨‍👩‍👧 குடும்பத்திற்கு விளக்குங்கள்',
      tabExplainer: '💡 மருத்துவர் அறிவுரை விளக்கம்',
      tabMyths: '🔍 வதந்திகள் சரிபார்ப்பு',
      tabLabs: '🧪 பரிசோதனை முடிவுகள் விளக்கம்',
      inputPlaceholder: 'உங்கள் அறிகுறிகள், பரிசோதனை முடிவுகள், உணவுகள் பற்றி கேளுங்கள்...',
      source: 'ஆதாரம்:',
      askDoctor: 'மருத்துவரிடம் கேட்க வேண்டிய கேள்விகள்:',
      sendBtn: 'ரிதுவிடம் கேளுங்கள்',
    },
    food: {
      headerTitle: 'உணவும் நீங்களும்',
      headerSub: 'பேசி, எழுதி அல்லது தாளி புகைப்படத்தை பதிவேற்றி இந்திய உணவை பதிவு செய்யுங்கள்.',
      tabDaily: 'தினசரி உணவு பதிவு',
      tabFasting: 'விரத நாட்கள்',
      planWeek: 'வாராந்திர திட்டம்',
      thaliPhotoBtn: 'தாளி புகைப்படம்',
      logMealBtn: 'உணவை பதிவு செய்',
      calories: 'கலோரிகள்',
      carbs: 'கார்போஹைட்ரேட்',
      protein: 'புரதம்',
      fiber: 'நார்ச்சத்து',
      toleranceSuits: 'உடலுக்கு ஏற்றது',
      toleranceCaution: 'குறைந்த அளவு',
      recentMeals: 'இன்றைய உணவுகள்',
    },
    profile: {
      headerTitle: 'சுகாதார விவரம் & விருப்பத்தேர்வுகள்',
      headerSub: 'உங்கள் சுகாதார நிலைமைகள், வாழ்க்கை நிலை முறை, மொழி மற்றும் DPDP தனியுரிமை அமைப்புகளை நிர்வகிக்கவும்.',
      tabProfile: 'சுயவிவரம்',
      tabCalibration: 'AI அளவீடு',
      tabCart: 'ஸ்மார்ட் கார்ட்',
      tabPrivacy: 'DPDP தனியுரிமை',
      lifeStageLabel: 'வாழ்க்கை நிலை முறை',
      languageHeading: 'பயன்பாட்டு மொழி & குரல் உச்சரிப்பு',
      devicesHeading: 'இணைக்கப்பட்ட சாதனங்கள்',
      dpdpBadge: 'DPDP சட்டம் 2023 இணக்கமானது',
    },
  },
};

export function getDictionary(locale: Locale): AppDictionary {
  return DICTIONARIES[locale] || DICTIONARIES.en;
}
