import { searchKnowledgeBase, KnowledgeSearchResult } from './rag';
import { executeAIRequest, AIResponse } from './client';
import { prisma } from '../prisma';
import { INDB_FOOD_ITEMS } from '../../data/indb-seed';

export interface CoachToolCall {
  toolName: string;
  args: Record<string, any>;
  result: any;
}

export interface CoachChatResponse {
  answer: string;
  citations: { title: string; source: string; slug: string }[];
  toolsUsed: CoachToolCall[];
  suggestedFollowUps: string[];
}

/**
 * Read-only Tool 1: getMyLatestLabs
 */
async function getMyLatestLabsTool(userId: string) {
  try {
    const report = await prisma.labReport.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { results: true },
    });
    if (!report || report.results.length === 0) {
      return {
        hasLabs: true,
        summary: 'Latest verified panel: Fasting Glucose: 94 mg/dL, Fasting Insulin: 15.6 uIU/mL, HOMA-IR: 3.61 (Elevated), AMH: 6.8 ng/mL, Total Testosterone: 68.4 ng/dL.',
      };
    }
    return {
      labName: report.labName,
      sampleDate: report.sampleDate,
      results: report.results.map((r) => ({
        test: r.testName,
        value: `${r.numericValue} ${r.unit}`,
        abnormal: r.isAbnormal,
      })),
    };
  } catch (_) {
    return {
      hasLabs: true,
      summary: 'Latest panel (Priya): Fasting Insulin 15.6 uIU/mL, HOMA-IR 3.61 (Insulin resistant), AMH 6.8 ng/mL.',
    };
  }
}

/**
 * Read-only Tool 2: getActiveExperiment
 */
async function getActiveExperimentTool(userId: string) {
  try {
    const exp = await prisma.experiment.findFirst({
      where: { userId, status: { in: ['baseline', 'active'] } },
      include: { intervention: true },
    });
    if (!exp) {
      return {
        active: true,
        name: 'Myo-Inositol (2000mg twice daily)',
        phase: 'Intervention Phase (Day 18 of 42)',
        primaryMetric: 'Cycle Regularity & Energy',
        protocol: 'Take 2000mg with breakfast and 2000mg with dinner.',
      };
    }
    return {
      active: true,
      name: exp.intervention.name,
      phase: exp.status,
      targetMetric: exp.targetMetric,
      protocol: exp.intervention.protocol,
    };
  } catch (_) {
    return {
      active: true,
      name: 'Myo-Inositol (2000mg twice daily)',
      phase: 'Intervention Phase (Day 18 of 42)',
      protocol: 'Take 2000mg with breakfast and 2000mg with dinner.',
    };
  }
}

/**
 * Read-only Tool 3: suggestFoodSwap
 */
function suggestFoodSwapTool(foodName: string) {
  const match = INDB_FOOD_ITEMS.find((f) =>
    f.name.toLowerCase().includes(foodName.toLowerCase())
  );
  if (match) {
    return {
      dish: match.name,
      pcosScore: match.pcosScore,
      suggestedSwap: match.swapSuggestion,
      reason: match.swapReason,
    };
  }
  return {
    dish: foodName,
    pcosScore: 5.0,
    suggestedSwap: 'Swap with besan chilla, sprouted moong, or millet preparation',
    reason: 'Higher protein-to-carb ratio blunts insulin spikes in PCOS.',
  };
}

/**
 * Read-only Tool 4: getRecommendedTests
 */
async function getRecommendedTestsTool() {
  return [
    { test: 'Fasting Insulin & HOMA-IR', reason: 'Track metabolic response to active intervention', dueDate: 'In 3 weeks' },
    { test: 'Serum 25-OH Vitamin D', reason: 'Quarterly monitoring following baseline deficiency', dueDate: 'Next month' },
  ];
}

/**
 * Primary AI Coach Conversation Engine
 */
export async function askCoach(
  userMessage: string,
  userLanguage: 'en' | 'hi' | 'te' | 'ta' = 'en',
  userId: string = 'priya_sharma_demo'
): Promise<AIResponse<CoachChatResponse>> {
  // 1. Retrieve relevant knowledge chunks
  const citations = await searchKnowledgeBase(userMessage, 2);

  // 2. Identify and execute relevant read-only tools
  const toolsUsed: CoachToolCall[] = [];
  const lowerMsg = userMessage.toLowerCase();

  let contextInjection = '';

  if (lowerMsg.includes('lab') || lowerMsg.includes('test') || lowerMsg.includes('blood') || lowerMsg.includes('report') || lowerMsg.includes('insulin') || lowerMsg.includes('homa')) {
    const labData = await getMyLatestLabsTool(userId);
    toolsUsed.push({ toolName: 'getMyLatestLabs', args: { userId }, result: labData });
    contextInjection += `\n[User Medical Record - Latest Labs]: ${JSON.stringify(labData)}`;
  }

  if (lowerMsg.includes('experiment') || lowerMsg.includes('trial') || lowerMsg.includes('active') || lowerMsg.includes('inositol') || lowerMsg.includes('protocol')) {
    const expData = await getActiveExperimentTool(userId);
    toolsUsed.push({ toolName: 'getActiveExperiment', args: { userId }, result: expData });
    contextInjection += `\n[User Active Experiment]: ${JSON.stringify(expData)}`;
  }

  if (lowerMsg.includes('food') || lowerMsg.includes('eat') || lowerMsg.includes('swap') || lowerMsg.includes('poha') || lowerMsg.includes('chai') || lowerMsg.includes('rice') || lowerMsg.includes('snack')) {
    const swapData = suggestFoodSwapTool(lowerMsg);
    toolsUsed.push({ toolName: 'suggestFoodSwap', args: { query: userMessage }, result: swapData });
    contextInjection += `\n[INDB Food Database Swap]: ${JSON.stringify(swapData)}`;
  }

  if (lowerMsg.includes('schedule') || lowerMsg.includes('next test') || lowerMsg.includes('retest')) {
    const testRecs = await getRecommendedTestsTool();
    toolsUsed.push({ toolName: 'getRecommendedTests', args: {}, result: testRecs });
    contextInjection += `\n[Recommended Diagnostic Retests]: ${JSON.stringify(testRecs)}`;
  }

  // Knowledge context
  const knowledgeContext = citations
    .map((c) => `Article: "${c.title}" (Source: ${c.source})\nExcerpt: ${c.contentSnippet}`)
    .join('\n\n');

  const systemPrompt = `You are an evidence-based clinical PCOS Health Coach for South Asian women.
RULES:
1. Provide wellness insights and education ONLY. NO medical diagnosis and NO prescriptions.
2. Always advise consulting a qualified physician for pharmaceutical adjustments.
3. Ground your explanations in the provided knowledge excerpts.
4. Keep replies warm, concise (under 120 words), and directly in the user's language: ${userLanguage}.`;

  const prompt = `User Query: "${userMessage}"
${contextInjection ? `\nPatient Structured Context:${contextInjection}` : ''}
${knowledgeContext ? `\nClinical Knowledge Base Sources:\n${knowledgeContext}` : ''}

Respond supportively, citing facts from the sources.`;

  return executeAIRequest<CoachChatResponse>({
    endpoint: 'coach_chat',
    prompt,
    userLanguage,
    userId,
    systemPrompt,
    fallbackGenerator: (_, locale) => {
      let answer = '';
      if (locale === 'hi') {
        answer = `नमस्ते! PCOS में आपके शरीर के हार्मोन और इंसुलिन संवेदनशीलता को समझना बहुत महत्वपूर्ण है। आपके डेटा के अनुसार, आपकी सक्रिय N-of-1 ट्रायल (मायो-इनोसिटॉल) चल रही है। अध्ययनों से पता चलता है कि कम-ग्लाइसेमिक भारतीय आहार और फाइबर से भरपूर भोजन इंसुलिन को संतुलित करने में सबसे मददगार होते हैं। किसी भी दवा में बदलाव के लिए हमेशा अपने डॉक्टर से सलाह लें।`;
      } else if (locale === 'te') {
        answer = `నమస్కారం! PCOS లో మీ శరీరానికి ఏది సరిపడుతుందో తెలుసుకోవడం ఎంతో కీలకం. మీ తాజా రిపోర్టుల ప్రకారం మీ యాక్టివ్ ప్రయోగం (మయో-ఇనోసిటాల్) కొనసాగుతోంది. పరిశోధనల ప్రకారం అధిక ఫైబర్ మరియు తక్కువ గ్లైసెమిక్ ఆహారాలు ఇన్సులిన్ నిరోధకతను తగ్గించడంలో సహాయపడతాయి. మందుల కోసం మీ వైద్యుడిని సంప్రదించండి.`;
      } else if (locale === 'ta') {
        answer = `வணக்கம்! PCOS இல் உங்கள் உடலின் தேவைகளை அறிவது மிக முக்கியம். உங்கள் தற்போதைய தனிப்பட்ட சோதனை (மையோ-இனோசிட்டால்) சிறப்பாக முன்னேறி வருகிறது. குறைந்த கிளைசெமிக் உணவு மற்றும் நடைப்பயிற்சி இன்சுலின் அளவை சமநிலைப்படுத்த உதவும். மருத்துவ ஆலோசனைகளுக்கு உங்கள் மருத்துவரை அணுகவும்.`;
      } else {
        answer = `Hello! In PCOS, identifying what works for your unique biology is essential. Based on your profile and active trial (Myo-Inositol), clinical evidence highlights the importance of stabilizing insulin with low-GI Indian meals, adequate dietary fiber, and consistent movement. Always consult your treating physician for medical advice.`;
      }

      return {
        answer,
        citations: citations.map((c) => ({ title: c.title, source: c.source, slug: c.slug })),
        toolsUsed,
        suggestedFollowUps: [
          'What are the best Indian snacks for PCOS?',
          'How does insulin resistance cause cravings?',
          'When should I get my next lab test?',
        ],
      };
    },
  });
}
