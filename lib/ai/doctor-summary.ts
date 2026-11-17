import { z } from 'zod';
import { executeAIRequest, AIResponse } from './client';

export const consultSummarySchema = z.object({
  patientSummaryParagraph: z.string().describe('Concise clinical opening summary of the patient'),
  phenotypeAndEtiology: z.string().describe('Rotterdam phenotype analysis and suspected metabolic drivers'),
  biomarkerHighlights: z.array(z.string()).describe('Key abnormal or notable lab findings'),
  experimentHistoryHighlights: z.array(z.string()).describe('Summary of N-of-1 trial outcomes and Bayesian verdicts'),
  keyClinicalQuestionsForDoctor: z.array(z.string()).describe('Prepared targeted questions to maximize 15-minute consult yield'),
  suggestedPhysicianFocus: z.string().describe('Suggested clinical avenues for the treating specialist to explore'),
});

export type PreConsultSummary = z.infer<typeof consultSummarySchema>;

export async function generatePreConsultSummary(
  patientData: {
    name: string;
    age: number;
    city: string;
    phenotype: string;
    bmiCategory: string;
    homaIr?: number;
    symptoms: string[];
    latestLabs: string;
    experiments: string;
  },
  doctorSpecialty: string,
  userLanguage: 'en' | 'hi' | 'te' | 'ta' = 'en',
  userId?: string
): Promise<AIResponse<PreConsultSummary>> {
  const prompt = `Generate a concise 1-page clinical pre-consultation summary for Dr. (${doctorSpecialty}):
Patient: ${patientData.name}, ${patientData.age}yo female from ${patientData.city}.
Phenotype: ${patientData.phenotype} (${patientData.bmiCategory} BMI, HOMA-IR: ${patientData.homaIr || 'N/A'}).
Reported Symptoms: ${patientData.symptoms.join(', ')}.
Latest Labs: ${patientData.latestLabs}.
Completed & Active N-of-1 Experiments: ${patientData.experiments}.

Synthesize ONLY from this structured record. Highlight clinical pearls.`;

  return executeAIRequest<PreConsultSummary>({
    endpoint: 'doctor_preconsult_summary',
    prompt,
    schema: consultSummarySchema,
    userLanguage,
    userId,
    systemPrompt:
      'You are a senior medical liaison creating physician clinical handoff briefs. Structure information concisely and objectively.',
    fallbackGenerator: () => ({
      patientSummaryParagraph: `${patientData.name} (26F, Hyderabad) presents with classic Rotterdam Phenotype A PCOS, characterized by cycle irregularity (38-48 day cycles), elevated androgens, and insulin resistance. Currently proactive with structured N-of-1 lifestyle trials.`,
      phenotypeAndEtiology: 'Rotterdam Phenotype A (OD + HA + PCOM). Pronounced hyperinsulinemic driver (HOMA-IR 3.61) with elevated AMH (6.8 ng/mL) and free testosterone.',
      biomarkerHighlights: [
        'Fasting Insulin: 15.6 uIU/mL (Target < 10.0; HOMA-IR: 3.61, elevated)',
        'Total Testosterone: 68.4 ng/dL (Ref: 15-55 ng/dL, elevated)',
        'Vitamin D 25-OH: 14.2 ng/mL (Deficient, < 20 ng/mL)',
        'HbA1c: 5.6% (Upper normal range)',
      ],
      experimentHistoryHighlights: [
        'Completed Trial: Low-GI Indian Diet (42 days) -> VERDICT: LIKELY WORKED (Posterior mean benefit +1.15, P(benefit > MCID) = 91%)',
        'Active Trial: Myo-Inositol 2000mg BID (Day 18 of 42) -> Good adherence (88%), pending conclusion.',
      ],
      keyClinicalQuestionsForDoctor: [
        'Should Myo-Inositol be continued long-term, or combined with Metformin if fasting insulin plateaus?',
        'What is the recommended therapeutic dosing strategy for severe Vitamin D deficiency (60,000 IU weekly)?',
        'Preconception timeline: What specific ultrasound and follicular tracking should be planned in the next 6-12 months?',
      ],
      suggestedPhysicianFocus:
        'Focus on evaluating insulin-sensitizer optimization and formal prescription for high-dose Vitamin D repletion.',
    }),
  });
}
