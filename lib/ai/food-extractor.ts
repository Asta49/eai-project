import { z } from 'zod';
import { executeAIRequest, AIResponse } from './client';
import { INDB_FOOD_ITEMS, INDBFoodItem } from '../../data/indb-seed';

export const foodItemExtractionSchema = z.object({
  dishName: z.string().describe('Identified Indian dish name'),
  portion: z.number().default(1.0).describe('Portion multiplier (e.g. 2 for 2 rotis, 1 for 1 katori)'),
  servingUnit: z.string().default('serving').describe('Unit of portion (e.g., roti, katori, plate)'),
  calories: z.number().describe('Estimated total calories'),
  carbs: z.number().describe('Carbohydrates in grams'),
  protein: z.number().describe('Protein in grams'),
  fat: z.number().describe('Fat in grams'),
  fiber: z.number().describe('Dietary fiber in grams'),
  pcosScore: z.number().min(1).max(10).describe('PCOS Friendliness score from 1 to 10'),
  suggestedSwap: z.string().optional().describe('Evidence-based healthier Indian swap'),
  swapReason: z.string().optional().describe('Clinical reason for the suggested swap'),
});

export const foodLogExtractionSchema = z.object({
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).default('lunch'),
  dishes: z.array(foodItemExtractionSchema),
  totalCalories: z.number(),
  totalCarbs: z.number(),
  totalProtein: z.number(),
  totalFat: z.number(),
  totalFiber: z.number(),
  overallPcosScore: z.number(),
});

export type ExtractedFoodLog = z.infer<typeof foodLogExtractionSchema>;

export async function extractFoodFromTextOrImage(
  input: string,
  userLanguage: 'en' | 'hi' | 'te' | 'ta' = 'en',
  userId?: string
): Promise<AIResponse<ExtractedFoodLog>> {
  return executeAIRequest<ExtractedFoodLog>({
    endpoint: 'food_extract',
    prompt: `Analyze this Indian meal log: "${input}". Identify each dish, estimate portions, match nutritional breakdown from the Indian Nutrient Databank (INDB), and calculate PCOS friendliness scores.`,
    schema: foodLogExtractionSchema,
    userLanguage,
    userId,
    systemPrompt:
      'You are a specialized South Asian clinical dietitian AI assistant specializing in PCOS nutrition, glycemic load, and traditional Indian cuisines.',
    fallbackGenerator: (text: string) => {
      const lower = text.toLowerCase();
      const matchedDishes: z.infer<typeof foodItemExtractionSchema>[] = [];

      // Check against INDB items
      for (const item of INDB_FOOD_ITEMS) {
        const itemLower = item.name.toLowerCase();
        const hindiLower = item.nameHindi.toLowerCase();
        if (
          lower.includes(itemLower.split(' ')[0]) ||
          (item.nameHindi && lower.includes(hindiLower)) ||
          (item.name.includes('Roti') && (lower.includes('roti') || lower.includes('chapati'))) ||
          (item.name.includes('Poha') && lower.includes('poha')) ||
          (item.name.includes('Chilla') && (lower.includes('chilla') || lower.includes('cheela'))) ||
          (item.name.includes('Dal') && (lower.includes('dal') || lower.includes('daal'))) ||
          (item.name.includes('Aloo Gobi') && (lower.includes('gobi') || lower.includes('aloo'))) ||
          (item.name.includes('Chai') && (lower.includes('chai') || lower.includes('tea')))
        ) {
          // Check for portion counts (e.g. "2 roti", "3 puris")
          let portion = 1.0;
          if (lower.includes('2') || lower.includes('do ') || lower.includes('two')) portion = 2.0;
          if (lower.includes('3') || lower.includes('teen') || lower.includes('three')) portion = 3.0;

          matchedDishes.push({
            dishName: item.name,
            portion,
            servingUnit: item.servingUnit,
            calories: Math.round(item.calories * portion),
            carbs: Math.round(item.carbs * portion),
            protein: Math.round(item.protein * portion * 10) / 10,
            fat: Math.round(item.fat * portion * 10) / 10,
            fiber: Math.round(item.fiber * portion * 10) / 10,
            pcosScore: item.pcosScore,
            suggestedSwap: item.swapSuggestion,
            swapReason: item.swapReason,
          });
        }
      }

      // If no fuzzy matches, provide default Indian plate (Roti + Dal + Sabzi)
      if (matchedDishes.length === 0) {
        matchedDishes.push(
          {
            dishName: 'Whole Wheat Roti (Phulka)',
            portion: 2.0,
            servingUnit: '2 rotis (70g)',
            calories: 170,
            carbs: 34,
            protein: 6.0,
            fat: 1.0,
            fiber: 4.8,
            pcosScore: 7.0,
            suggestedSwap: 'Mix wheat with sattu or ragi flour (1:1)',
            swapReason: 'Adds protein and soluble fiber to reduce glucose spike.',
          },
          {
            dishName: 'Yellow Moong Dal (Tadka)',
            portion: 1.0,
            servingUnit: '1 katori (180g)',
            calories: 160,
            carbs: 22,
            protein: 9.5,
            fat: 4.0,
            fiber: 5.2,
            pcosScore: 8.7,
            suggestedSwap: 'Add spinach or methi leaves',
            swapReason: 'Lentils provide essential folate and inositol for insulin sensitivity.',
          }
        );
      }

      const totalCalories = matchedDishes.reduce((s, d) => s + d.calories, 0);
      const totalCarbs = matchedDishes.reduce((s, d) => s + d.carbs, 0);
      const totalProtein = matchedDishes.reduce((s, d) => s + d.protein, 0);
      const totalFat = matchedDishes.reduce((s, d) => s + d.fat, 0);
      const totalFiber = matchedDishes.reduce((s, d) => s + d.fiber, 0);
      const avgScore = Number(
        (matchedDishes.reduce((s, d) => s + d.pcosScore, 0) / matchedDishes.length).toFixed(1)
      );

      return {
        mealType: 'lunch',
        dishes: matchedDishes,
        totalCalories,
        totalCarbs,
        totalProtein,
        totalFat,
        totalFiber,
        overallPcosScore: avgScore,
      };
    },
  });
}
