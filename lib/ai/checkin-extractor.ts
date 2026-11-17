import { z } from 'zod';
import { executeAIRequest, AIResponse } from './client';

export const checkInExtractionSchema = z.object({
  energy: z.number().min(1).max(5).describe('Energy score 1 (exhausted) to 5 (energized)'),
  mood: z.number().min(1).max(5).describe('Mood score 1 (very low/anxious) to 5 (calm/happy)'),
  cravings: z.number().min(1).max(5).describe('Sugar/carb cravings 1 (none) to 5 (overwhelming)'),
  acne: z.number().min(0).max(3).describe('Acne breakouts 0 (clear) to 3 (severe inflammatory)'),
  bloating: z.number().min(0).max(3).describe('Bloating 0 (none) to 3 (painful/distended)'),
  periodToday: z.boolean().describe('Whether menstrual bleeding occurred today'),
  periodFlow: z.enum(['none', 'spotting', 'light', 'medium', 'heavy']).default('none'),
  adherenceToExperiment: z.boolean().describe('Whether the active experiment protocol was adhered to today'),
  summary: z.string().describe('Short 1-sentence summary in the user language'),
  notes: z.string().optional().describe('Extracted user personal observations'),
});

export type ExtractedCheckInData = z.infer<typeof checkInExtractionSchema>;

export async function extractCheckInFromText(
  text: string,
  userLanguage: 'en' | 'hi' | 'te' | 'ta' = 'en',
  userId?: string
): Promise<AIResponse<ExtractedCheckInData>> {
  return executeAIRequest<ExtractedCheckInData>({
    endpoint: 'checkin_extract',
    prompt: `Analyze this woman's PCOS daily check-in message: "${text}" and extract all health metrics strictly into the structured format.`,
    schema: checkInExtractionSchema,
    userLanguage,
    userId,
    systemPrompt:
      'You are a sensitive medical NLP extractor for South Asian women managing PCOS. Extract numerical symptom scores and cycle details from English, Hindi, Telugu, or Tamil text.',
    fallbackGenerator: (prompt: string, locale: string) => {
      const lower = prompt.toLowerCase();
      // Intelligent rule-based parsing for offline demo
      const hasThakaan = lower.includes('thakaan') || lower.includes('tired') || lower.includes('fatigue') || lower.includes('neerasam') || lower.includes('sorvu');
      const hasCravings = lower.includes('meetha') || lower.includes('sugar') || lower.includes('cravings') || lower.includes('sweet');
      const hasPeriod = lower.includes('period aaya') || lower.includes('bleeding') || lower.includes('periods started');
      const hasNoPeriod = lower.includes('period nahi') || lower.includes('no period') || lower.includes('period raledu');
      const hasWalk = lower.includes('walk') || lower.includes('exercise') || lower.includes('diet') || lower.includes('complete');

      const energy = hasThakaan ? 2 : 4;
      const cravings = hasCravings ? 4 : 2;
      const periodToday = hasPeriod && !hasNoPeriod;
      const adherence = hasWalk || lower.includes('done') || lower.includes('kiya');

      let summary = 'Daily check-in logged successfully.';
      if (locale === 'hi') summary = 'दैनिक चेक-इन सफलतापूर्वक दर्ज किया गया।';
      else if (locale === 'te') summary = 'రోజువారీ వివరాలు విజయవంతంగా నమోదు చేయబడ్డాయి.';
      else if (locale === 'ta') summary = 'தினசரி விவரங்கள் வெற்றிகரமாகப் பதிவு செய்யப்பட்டன.';

      return {
        energy,
        mood: 3,
        cravings,
        acne: 1,
        bloating: 1,
        periodToday,
        periodFlow: periodToday ? 'medium' : 'none',
        adherenceToExperiment: adherence,
        summary,
        notes: text,
      };
    },
  });
}
