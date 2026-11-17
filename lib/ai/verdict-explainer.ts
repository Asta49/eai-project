import { z } from 'zod';
import { executeAIRequest, AIResponse } from './client';
import { ExperimentResult } from '../engine/types';

export const verdictExplanationSchema = z.object({
  headline: z.string().describe('Clear, empowering headline summarizing the verdict in the chosen language'),
  plainExplanation: z.string().describe('2-3 sentences explaining the statistical effect without technical jargon'),
  probabilityInsight: z.string().describe('Explanation of the Bayesian confidence percentage'),
  nextStepRecommendation: z.string().describe('Actionable clinical next step recommended based strictly on the verdict'),
});

export type VerdictExplanation = z.infer<typeof verdictExplanationSchema>;

/**
 * Explains a pre-computed deterministic ExperimentResult
 * IMPORTANT: This function receives a READ-ONLY ExperimentResult.
 * It has NO WRITE PERMISSIONS to modify the verdict, effectEstimate, or probabilities.
 */
export async function explainExperimentResult(
  result: Readonly<ExperimentResult>,
  interventionName: string,
  userLanguage: 'en' | 'hi' | 'te' | 'ta' = 'en',
  userId?: string
): Promise<AIResponse<VerdictExplanation>> {
  const probPercent = Math.round(result.probBeneficial * 100);

  const prompt = `Explain this completed personal N-of-1 trial verdict for ${interventionName}:
- Deterministic Verdict: ${result.verdict}
- Probability of Benefit > MCID: ${probPercent}%
- Effect Estimate: ${result.effectEstimate} (MCID: ${result.mcid})
- 90% Credible Interval: [${result.credibleInterval90[0]}, ${result.credibleInterval90[1]}]
- Cycle Phase Adjusted: ${result.cyclePhaseAdjusted}
- Adherence Rate: ${Math.round(result.adherenceRate * 100)}%

Translate and explain this result warmly and clearly in language: ${userLanguage}. Do not change the verdict.`;

  return executeAIRequest<VerdictExplanation>({
    endpoint: 'verdict_explain',
    prompt,
    schema: verdictExplanationSchema,
    userLanguage,
    userId,
    systemPrompt:
      'You are an empathetic PCOS clinical communicator. Explain Bayesian statistical verdicts in simple, accessible language without altering the numerical conclusions.',
    fallbackGenerator: (_, locale) => {
      if (result.verdict === 'LIKELY_WORKED') {
        if (locale === 'hi') {
          return {
            headline: `${interventionName}: आपके शरीर के लिए असरदार रहा!`,
            plainExplanation: `सांख्यिकीय विश्लेषण से पता चलता है कि इस उपाय ने आपके प्राथमिक लक्षण में स्पष्ट सुधार किया है, भले ही आपके मासिक धर्म चक्र के विभिन्न चरणों को ध्यान में रखा गया हो।`,
            probabilityInsight: `बायेसियन मॉडल के अनुसार, आपके शरीर में वास्तविक सुधार होने की ${probPercent}% संभावना है।`,
            nextStepRecommendation: `इस आदत को अपने लंबे समय के रूटीन में जारी रखें और अपने डॉक्टर से परामर्श करें।`,
          };
        }
        if (locale === 'te') {
          return {
            headline: `${interventionName}: మీ శరీరానికి బాగా పనిచేసింది!`,
            plainExplanation: `పీరియడ్ సైకిల్ మార్పులను పరిగణనలోకి తీసుకున్నప్పటికీ, ఈ ప్రయోగం మీ ఆరోగ్య కొలమానాల్లో స్పష్టమైన మెరుగుదలను చూపించింది.`,
            probabilityInsight: `ఈ ప్రయోగం మీకు ప్రయోజనం కలిగించే సంభావ్యత ${probPercent}% గా గణాంక ఇంజిన్ లెక్కించింది.`,
            nextStepRecommendation: `ఈ ఆరోగ్యకరమైన అలవాటును కొనసాగించండి మరియు తదుపరి ప్రయోగాన్ని పరిశీలించండి.`,
          };
        }
        if (locale === 'ta') {
          return {
            headline: `${interventionName}: உங்கள் உடலுக்கு நல்ல பலனளித்தது!`,
            plainExplanation: `மாதவிடாய் சுழற்சி மாற்றங்களை சரிசெய்த பிறகும், இந்த சோதனை உங்கள் ஆரோக்கியத்தில் குறிப்பிடத்தக்க முன்னேற்றத்தைக் காட்டியுள்ளது.`,
            probabilityInsight: `புள்ளிவிவரப்படி இது பலனளிக்கும் நிகழ்தகவு ${probPercent}% ஆகும்.`,
            nextStepRecommendation: `இதை உங்கள் தினசரி பழக்கமாகத் தொடரலாம். அடுத்த பரிசோதனையைத் தொடங்கவும்.`,
          };
        }
        return {
          headline: `${interventionName} likely worked for your body!`,
          plainExplanation: `After adjusting for normal cycle fluctuations and daily variations, the data shows a meaningful improvement beyond the clinical threshold.`,
          probabilityInsight: `The Bayesian engine calculated a ${probPercent}% probability that this intervention produced a genuine clinical benefit for you.`,
          nextStepRecommendation: `Consider integrating this into your sustained lifestyle and sharing this brief with your doctor.`,
        };
      }

      if (result.verdict === 'LIKELY_DID_NOT_WORK') {
        if (locale === 'hi') {
          return {
            headline: `${interventionName}: आपके लिए प्रभावी नहीं रहा`,
            plainExplanation: `डेटा से पता चलता है कि इस हस्तक्षेप से आपके लक्षणों में कोई महत्वपूर्ण सुधार नहीं हुआ।`,
            probabilityInsight: `लाभ की संभावना केवल ${probPercent}% है, जो स्पष्ट करती है कि यह आपके शरीर के लिए उपयुक्त नहीं था।`,
            nextStepRecommendation: `इस उपाय को बंद करने पर विचार करें और अपनी अनुशंसित सूची से दूसरा N-of-1 परीक्षण चुनें।`,
          };
        }
        if (locale === 'te') {
          return {
            headline: `${interventionName}: మీకు సరిపడలేదు`,
            plainExplanation: `ఈ ప్రయోగం వల్ల మీ లక్షణాలలో ఆశించిన మార్పు రాలేదని డేటా స్పష్టం చేస్తోంది.`,
            probabilityInsight: `ప్రయోజన సంభావ్యత ${probPercent}% మాత్రమే ఉంది.`,
            nextStepRecommendation: `దీనిని ఆపివేసి, రికమెండర్ సూచించిన మరొక కొత్త ప్రయోగాన్ని ప్రారంభించండి.`,
          };
        }
        return {
          headline: `${interventionName} likely didn't work for you`,
          plainExplanation: `The data indicates that your primary metric did not achieve the minimum clinically important difference during this trial period.`,
          probabilityInsight: `The probability of meaningful benefit was only ${probPercent}%, indicating this specific intervention is not optimal for your phenotype.`,
          nextStepRecommendation: `Do not worry—PCOS is highly individual. Discontinue this trial and test another candidate from your recommender.`,
        };
      }

      // Inconclusive
      return {
        headline: `${interventionName}: परिणाम अभी स्पष्ट नहीं हैं`,
        plainExplanation: `डेटा में कुछ सकारात्मक संकेत मिले हैं, लेकिन सांख्यिकीय निश्चितता तक पहुँचने के लिए पर्याप्त दिन नहीं थे या नियमितता 70% से कम थी।`,
        probabilityInsight: `लाभ की संभावना ${probPercent}% है (80% से कम, 20% से अधिक)।`,
        nextStepRecommendation: `यदि आप चाहें तो इस प्रयोग को 2 और हफ़्तों के लिए बढ़ा सकती हैं, या दूसरा उपाय आज़मा सकती हैं।`,
      };
    },
  });
}
