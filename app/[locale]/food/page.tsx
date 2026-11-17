'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import type { ExtractedFoodLog } from '@/lib/ai/food-extractor';
import { INDB_FOOD_ITEMS, INDBFoodItem } from '@/data/indb-seed';
import {
  Utensils,
  Search,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Camera,
  Leaf,
  RefreshCw,
} from 'lucide-react';

export default function FoodPage() {
  const t = useTranslations('food');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'en' | 'hi' | 'te' | 'ta';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [naturalTextLog, setNaturalTextLog] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedMeal, setExtractedMeal] = useState<ExtractedFoodLog | null>(null);
  const [loggedMeals, setLoggedMeals] = useState<any[]>([
    {
      mealType: 'breakfast',
      time: '08:30 AM',
      dish: 'Besan Chilla (2 pieces) with Mint Chutney',
      calories: 220,
      carbs: 26,
      protein: 11,
      fiber: 6.5,
      pcosScore: 9.0,
      swap: 'Optimal choice: high fiber-to-carb ratio (0.25)',
    },
    {
      mealType: 'lunch',
      time: '01:15 PM',
      dish: 'Foxtail Millet (Kangni) + Moong Dal + Palak Paneer',
      calories: 420,
      carbs: 45,
      protein: 18.5,
      fiber: 10.2,
      pcosScore: 9.2,
      swap: 'Excellent millet baseline swap from white rice',
    },
  ]);

  const filteredFoods = INDB_FOOD_ITEMS.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.nameHindi && item.nameHindi.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleQuickExtract = async () => {
    if (!naturalTextLog.trim()) return;
    setIsExtracting(true);
    try {
      const response = await fetch('/api/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: naturalTextLog, locale }),
      });
      const res = await response.json();
      if (res.data) {
        setExtractedMeal(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCommitLoggedMeal = () => {
    if (!extractedMeal) return;
    const newItems = extractedMeal.dishes.map((d) => ({
      mealType: extractedMeal.mealType,
      time: 'Just now',
      dish: `${d.dishName} (${d.portion} ${d.servingUnit})`,
      calories: d.calories,
      carbs: d.carbs,
      protein: d.protein,
      fiber: d.fiber,
      pcosScore: d.pcosScore,
      swap: d.suggestedSwap,
    }));
    setLoggedMeals([...newItems, ...loggedMeals]);
    setExtractedMeal(null);
    setNaturalTextLog('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      {/* Title */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              {t('title')}
            </h1>
            <Badge variant="pcos" className="text-[10px]">
              INDB VERIFIED (150+ DISHES)
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-300">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Main Grid: Food Logger & Search Table */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Quick Text / Voice Log + Extracted Confirmation */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-rose-100 shadow-sm dark:border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-rose-600" />
                <CardTitle className="text-base">{t('quickText')}</CardTitle>
              </div>
              <CardDescription>
                Type or speak in Hindi, Telugu, or English.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                rows={3}
                value={naturalTextLog}
                onChange={(e) => setNaturalTextLog(e.target.value)}
                placeholder={t('quickTextPlaceholder')}
                className="w-full rounded-xl border border-input bg-background p-3 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              />

              <div className="flex items-center justify-between">
                {/* Photo Upload trigger */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNaturalTextLog('2 roti, 1 katori dal tadka, aloo gobi')}
                  className="gap-1.5 text-xs"
                >
                  <Camera className="h-3.5 w-3.5 text-slate-500" />
                  Try Photo / Text
                </Button>

                <Button
                  variant="pcos"
                  size="sm"
                  disabled={!naturalTextLog.trim() || isExtracting}
                  onClick={handleQuickExtract}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isExtracting ? tCommon('loading') : 'Calculate Macros'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Extracted Meal Confirmation */}
          {extractedMeal && (
            <Card className="border-teal-200 bg-teal-50/20 shadow-sm dark:border-teal-900/60 dark:bg-teal-950/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="teal">Calculated Meal Breakdown</Badge>
                  <span className="text-xs font-bold text-teal-800 dark:text-teal-300">
                    PCOS Score: {extractedMeal.overallPcosScore} / 10
                  </span>
                </div>
                <CardTitle className="text-sm">Review &amp; Commit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="rounded-lg bg-white p-2 dark:bg-slate-800">
                    <span className="text-slate-400">Calories</span>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {extractedMeal.totalCalories}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-2 dark:bg-slate-800">
                    <span className="text-slate-400">Carbs</span>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {extractedMeal.totalCarbs}g
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-2 dark:bg-slate-800">
                    <span className="text-slate-400">Protein</span>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {extractedMeal.totalProtein}g
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-2 dark:bg-slate-800">
                    <span className="text-slate-400">Fiber</span>
                    <div className="font-bold text-teal-600">
                      {extractedMeal.totalFiber}g
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {extractedMeal.dishes.map((dish, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-slate-850"
                    >
                      <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                        <span>{dish.dishName}</span>
                        <span className="text-rose-600 font-bold">{dish.pcosScore}/10</span>
                      </div>
                      {dish.suggestedSwap && (
                        <div className="mt-1.5 flex items-start gap-1 text-[11px] text-teal-700 dark:text-teal-300">
                          <RefreshCw className="h-3 w-3 shrink-0 mt-0.5" />
                          <span>Swap: {dish.suggestedSwap}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="teal"
                  size="sm"
                  onClick={handleCommitLoggedMeal}
                  className="w-full gap-1.5 text-xs"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Save Meal to Daily Diary
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Today's Logged Meals History */}
          <Card className="border-slate-200 shadow-xs dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Today&apos;s Nutrition Diary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loggedMeals.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {m.dish}
                    </span>
                    <Badge variant="pcos" className="text-[10px]">
                      Score: {m.pcosScore}
                    </Badge>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {m.calories} kcal • {m.carbs}g Carbs • {m.protein}g Protein • {m.fiber}g Fiber
                  </div>
                  <div className="mt-1.5 text-[10px] text-teal-600 dark:text-teal-400">
                    {m.swap}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Searchable Indian Nutrient Databank (INDB) Catalog (2 Cols) */}
        <div className="space-y-4 lg:col-span-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Indian Nutrient Databank (e.g. roti, dal, poha, chilla, makhana, chai)..."
              className="pl-9"
            />
          </div>

          {/* Dishes Table */}
          <div className="space-y-3">
            {filteredFoods.slice(0, 10).map((dish) => (
              <Card
                key={dish.name}
                className="border-slate-200 shadow-2xs transition-all hover:border-slate-300 dark:border-slate-800"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm dark:text-white">
                          {dish.name}
                        </span>
                        {dish.nameHindi && (
                          <span className="text-xs text-slate-400">({dish.nameHindi})</span>
                        )}
                        <Badge variant="outline" className="text-[10px]">
                          {dish.category}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-slate-500">
                        <span>Serving: {dish.servingUnit}</span>
                        <span>Calories: {dish.calories} kcal</span>
                        <span>Carbs: {dish.carbs}g</span>
                        <span>Protein: {dish.protein}g</span>
                        <span>Fiber: {dish.fiber}g</span>
                        <span>GI: ~{dish.glycemicIndexEstimate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          PCOS Score
                        </div>
                        <div
                          className={`text-lg font-extrabold ${
                            dish.pcosScore >= 8
                              ? 'text-emerald-600'
                              : dish.pcosScore >= 5
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {dish.pcosScore} / 10
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Smart Indian Swap Box */}
                  <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs dark:bg-slate-900">
                    <div className="flex items-center gap-1.5 font-semibold text-teal-800 dark:text-teal-300">
                      <Leaf className="h-3.5 w-3.5 text-teal-600" />
                      <span>Smart PCOS Swap: {dish.swapSuggestion}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">{dish.swapReason}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-8">
        <DisclaimerBanner type="wellness" />
      </div>
    </div>
  );
}
