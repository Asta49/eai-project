/**
 * Multilingual Red-Flag Emergency Triage Detector
 * Scans user input for critical acute medical conditions:
 * - Heavy acute hemorrhaging / bleeding
 * - Severe acute pelvic / abdominal pain
 * - Chest pain / heart palpitations
 * - Syncope / fainting / loss of consciousness
 * - Suicidal ideation / severe mental distress
 * - Acute pregnancy complications
 */

export interface RedFlagDetection {
  hasRedFlag: boolean;
  category?: 'bleeding' | 'pelvic_pain' | 'chest_pain' | 'fainting' | 'suicidal' | 'pregnancy';
  emergencyMessageEn: string;
  emergencyMessageLocale: string;
  triggerPhrase?: string;
}

const RED_FLAG_PATTERNS = [
  // Heavy bleeding
  {
    category: 'bleeding' as const,
    regex: /(heavy bleeding|bleeding through pad|soaking a pad|blood clots|bahut zyada bleeding|raktasravam|ratham|athiga rathapokku|bleeding profusely)/i,
    en: 'Heavy abnormal bleeding detected. Please seek emergency medical care immediately.',
    hi: 'अत्यधिक रक्तस्राव का संकेत मिला है। कृपया तुरंत आपातकालीन चिकित्सा सहायता (112) लें।',
    te: 'తీవ్రమైన రక్తస్రావం గుర్తించబడింది. దయచేసి వెంటనే అత్యవసర వైద్య సంరక్షణ (112) పొందండి.',
    ta: 'அதிக இரத்தப்போக்கு கண்டறியப்பட்டுள்ளது. உடனடியாக அவசர மருத்துவ உதவியை (112) அணுகவும்.',
  },
  // Severe pelvic or abdominal pain
  {
    category: 'pelvic_pain' as const,
    regex: /(severe pelvic pain|unbearable pain|sharp abdominal pain|ovary torsion|ruptured cyst|tez dard|bahut dard|asahiya noppi|theevira vali)/i,
    en: 'Severe acute pelvic/abdominal pain detected. This may indicate a ruptured cyst or acute complication. Seek immediate medical attention.',
    hi: 'तेज पेल्विक या पेट दर्द का संकेत मिला है। कृपया तुरंत डॉक्टर से मिलें या अस्पताल जाएं।',
    te: 'తీవ్రమైన కడుపు నొప్పి గుర్తించబడింది. తక్షణమే ఆసుపత్రికి వెళ్లండి.',
    ta: 'கடுமையான வயிற்று அல்லது இடுப்பு வலி கண்டறியப்பட்டுள்ளது. உடனே மருத்துவமனைக்குச் செல்லவும்.',
  },
  // Chest pain / shortness of breath
  {
    category: 'chest_pain' as const,
    regex: /(chest pain|difficulty breathing|shortness of breath|seene mein dard|saans lene mein takleef|chhati noppi|nenju vali)/i,
    en: 'Chest pain or acute breathing difficulty detected. Call National Emergency 112 immediately.',
    hi: 'सीने में दर्द या सांस लेने में तकलीफ। तुरंत 112 पर कॉल करें।',
    te: 'ఛాతీ నొప్పి లేదా శ్వాస తీసుకోవడంలో ఇబ్బంది. వెంటనే 112 కి కాల్ చేయండి.',
    ta: 'நெஞ்சு வலி அல்லது மூச்சுத்திணறல். உடனடியாக 112 ஐ அழைக்கவும்.',
  },
  // Fainting / syncope
  {
    category: 'fainting' as const,
    regex: /(fainted|fainting|blacked out|loss of consciousness|behoshi|chakkar aakar gir|moorchha|mayakkam)/i,
    en: 'Loss of consciousness or fainting requires prompt clinical evaluation.',
    hi: 'बेहोशी या चक्कर आकर गिरना। तत्काल चिकित्सीय जांच आवश्यक है।',
    te: 'మూర్ఛ లేదా స్పృహ తప్పడం. వెంటనే వైద్యుడిని సంప్రదించండి.',
    ta: 'மயக்கம் அல்லது நினைவிழப்பு. உடனடியாக மருத்துவரை அணுகவும்.',
  },
  // Suicidal ideation
  {
    category: 'suicidal' as const,
    regex: /(suicide|kill myself|want to die|end my life|mar jaana chahti|aatmhatya|chachi povali|tharkolai)/i,
    en: 'If you are feeling overwhelmed, please know help is available. Call Tele-MANAS (14416) or Kiran (1800-599-0019) 24/7.',
    hi: 'यदि आप मानसिक संकट में हैं, तो कृपया राष्ट्रीय मानसिक स्वास्थ्य हेल्पलाइन Tele-MANAS (14416) या 112 पर तुरंत संपर्क करें।',
    te: 'మీరు ఒత్తిడిలో ఉంటే వెంటనే సహాయం పొందండి. టెలి-మానస్ (14416) లేదా 112 కి కాల్ చేయండి.',
    ta: 'உடனடி மனநல ஆலோசனைக்கு Tele-MANAS (14416) அல்லது 112 ஐ அழைக்கவும்.',
  },
  // Pregnancy emergency
  {
    category: 'pregnancy' as const,
    regex: /(miscarriage|ectopic|pregnant.*bleeding|pregnancy.*cramping|garbhavastha.*dard)/i,
    en: 'Acute pregnancy complications detected. Seek immediate obstetric emergency care.',
    hi: 'गर्भावस्था संबंधी जटिलता के संकेत। तुरंत आपातकालीन प्रसूति सहायता लें।',
    te: 'గర్భధారణ సమస్యలు గుర్తించబడ్డాయి. వెంటనే ఆసుపత్రికి వెళ్లండి.',
    ta: 'கர்ப்பகால சிக்கல்கள் கண்டறியப்பட்டுள்ளன. உடனே அவசர சிகிச்சை பிரிவுக்குச் செல்லவும்.',
  },
];

export function detectRedFlags(
  input: string,
  locale: string = 'en'
): RedFlagDetection {
  if (!input) {
    return {
      hasRedFlag: false,
      emergencyMessageEn: '',
      emergencyMessageLocale: '',
    };
  }

  const clean = input.toLowerCase();

  for (const item of RED_FLAG_PATTERNS) {
    if (item.regex.test(clean)) {
      let localizedMsg = item.en;
      if (locale === 'hi') localizedMsg = item.hi;
      else if (locale === 'te') localizedMsg = item.te;
      else if (locale === 'ta') localizedMsg = item.ta;

      return {
        hasRedFlag: true,
        category: item.category,
        emergencyMessageEn: item.en,
        emergencyMessageLocale: localizedMsg,
        triggerPhrase: input,
      };
    }
  }

  return {
    hasRedFlag: false,
    emergencyMessageEn: '',
    emergencyMessageLocale: '',
  };
}
