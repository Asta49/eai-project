'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Locale } from '@/i18n';
import { getDictionary } from '@/lib/i18n-dictionary';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import type { ExtractedFoodLog } from '@/lib/ai/food-extractor';
import { INDB_FOOD_ITEMS, INDBFoodItem } from '@/data/indb-seed';
import {
  Utensils,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Camera,
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const CATEGORIES = ['All', 'Breakfast', 'Roti & Breads', 'Dals & Curries', 'Snacks', 'Beverages'];

export default function FoodPage() {
  const t = useTranslations('food');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const dict = getDictionary(locale);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [naturalTextLog, setNaturalTextLog] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedMeal, setExtractedMeal] = useState<ExtractedFoodLog | null>(null);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // F1. Thali Photo Logging state
  const [thaliModalOpen, setThaliModalOpen] = useState<boolean>(false);
  const [thaliLoggedSuccess, setThaliLoggedSuccess] = useState<boolean>(false);

  // F2. Fasting planner tab state
  const [foodViewMode, setFoodViewMode] = useState<'daily' | 'fasting'>('daily');

  // F3. Regional & Budget meal plan state
  const [mealPlanOpen, setMealPlanOpen] = useState<boolean>(false);
  const [cuisineRegion, setCuisineRegion] = useState<'telugu' | 'north' | 'tamil'>('telugu');
  const [budgetMode, setBudgetMode] = useState<boolean>(true);
  const [familyScale, setFamilyScale] = useState<boolean>(true);

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
    const matchesCat =
      selectedCategory === 'All' ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    if (!matchesCat) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.nameHindi && item.nameHindi.toLowerCase().includes(q))
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

  const handleAddDirect = (dish: INDBFoodItem) => {
    setLoggedMeals([
      {
        mealType: 'snack',
        time: 'Just now',
        dish: dish.name,
        calories: dish.calories,
        carbs: dish.carbs,
        protein: dish.protein,
        fiber: dish.fiber,
        pcosScore: dish.pcosScore,
        swap: dish.swapReason || 'Logged from INDB databank',
      },
      ...loggedMeals,
    ]);
    setAddedNotice(`Added "${dish.name}" to today's log`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Banner in Forest Green */}
      <div className="rounded-4xl bg-forest p-6 text-white text-center shadow-soft relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-3 py-1 text-xs font-semibold text-sage-light">
            <Utensils className="w-3.5 h-3.5 text-sage" />
            Indian Nutrient Databank (INDB)
          </span>

          {/* F3. Plan My Week Header Button */}
          <button
            type="button"
            onClick={() => setMealPlanOpen(true)}
            className="rounded-full bg-white/20 hover:bg-white/30 text-white px-3 py-1 text-xs font-bold transition shadow-xs"
          >
            🗓️ {dict.food.planWeek}
          </button>
        </div>

        <h1 className="mt-2 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {dict.food.headerTitle}
        </h1>
        <p className="mt-1 text-xs text-sage-light max-w-md mx-auto">
          {dict.food.headerSub}
        </p>

        {/* View Switcher: Daily Foods vs Fasting Days */}
        <div className="mt-4 inline-flex rounded-full bg-black/20 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFoodViewMode('daily')}
            className={`rounded-full px-4 py-1.5 transition ${
              foodViewMode === 'daily' ? 'bg-white text-forest font-bold shadow-xs' : 'text-white'
            }`}
          >
            {dict.food.tabDaily}
          </button>
          <button
            type="button"
            onClick={() => setFoodViewMode('fasting')}
            className={`rounded-full px-4 py-1.5 transition ${
              foodViewMode === 'fasting' ? 'bg-white text-forest font-bold shadow-xs' : 'text-white'
            }`}
          >
            {dict.food.tabFasting}
          </button>
        </div>
      </div>

      {/* F2. Seasonal Fasting Banner */}
      <div className="p-3.5 rounded-3xl bg-pastel-yellow/40 border border-amber-200/80 flex items-center justify-between text-xs text-amber-950">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌙</span>
          <div>
            <span className="font-bold">Seasonal Fasting: Navratri &amp; Ekadashi Vrat swaps available.</span>
            <span className="block text-[11px] text-amber-800">Prevent glucose spikes during traditional fasts.</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setFoodViewMode('fasting')}
          className="text-xs font-bold text-amber-900 underline hover:text-amber-950 shrink-0"
        >
          View Swaps →
        </button>
      </div>

      {/* F2. FASTING DAYS VIEW */}
      {foodViewMode === 'fasting' && (
        <div className="space-y-4 animate-in fade-in">
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card space-y-3">
            <h3 className="font-heading text-base font-bold text-slate-900">
              Vrat &amp; Fasting Nutrition for PCOS &amp; Thyroid
            </h3>
            <p className="text-xs text-slate-500">
              Traditional fasting foods often cause rapid insulin spikes. Here are evidence-grounded Indian swaps:
            </p>

            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Sabudana Vada / Khichdi Swap</span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                    High GI (85)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  <strong>Better Swap:</strong> Kuttu (Buckwheat) or Rajgira (Amaranth) cheela cooked in minimal A2 ghee. Slows glucose absorption and preserves thyroid metabolism.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Fried Potato Chips Swap</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    High Saturated Fat
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  <strong>Better Swap:</strong> Dry roasted Phool Makhana with sendha namak and roasted peanuts. High magnesium helps prevent luteal evening headaches.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Ramzan Suhoor &amp; Iftar Strategy</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Steady Energy
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Break fast with 1 date and cucumber/buttermilk before warm moong soup. Avoid opening fast with sherbet or sugary fried pakoras to prevent reactive hypoglycemia.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Natural Language Voice/Text Log Card */}
      <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Quick Log Meal (Text / Voice)
          </span>
          <span className="text-[10px] text-forest font-semibold">
            INDB AI Matching
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={naturalTextLog}
            onChange={(e) => setNaturalTextLog(e.target.value)}
            placeholder="e.g. 2 roti, dal tadka, aloo gobi, buttermilk..."
            className="flex-1 rounded-full border border-slate-200 bg-[#F4F6F2] px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-forest focus:outline-none"
          />
          <Button
            type="button"
            variant="forest"
            size="sm"
            onClick={handleQuickExtract}
            disabled={isExtracting || !naturalTextLog.trim()}
            className="text-xs px-4"
          >
            {isExtracting ? 'Analyzing...' : 'Log'}
          </Button>
        </div>

        {/* Extracted Meal Review */}
        {extractedMeal && (
          <div className="rounded-3xl border border-emerald-200 bg-pastel-mint/60 p-4 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pastel-mintText font-heading">
                Meal Analysis • PCOS Score: {extractedMeal.overallPcosScore} / 10
              </span>
              <span className="text-[10px] text-slate-500">{extractedMeal.dishes.length} Dishes Identified</span>
            </div>

            <div className="space-y-1.5">
              {extractedMeal.dishes.map((dish, i) => (
                <div key={i} className="flex items-center justify-between bg-white/80 p-2.5 rounded-2xl text-xs border border-emerald-100">
                  <div>
                    <span className="font-bold text-slate-900">{dish.dishName}</span>
                    <span className="text-slate-500 ml-1.5">({dish.calories} kcal)</span>
                    {dish.suggestedSwap && (
                      <div className="text-[11px] text-amber-700 mt-0.5">
                        Swap: {dish.suggestedSwap}
                      </div>
                    )}
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    dish.pcosScore >= 7 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {dish.pcosScore}/10
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Added Notification */}
      {addedNotice && (
        <div className="rounded-3xl bg-pastel-mint p-3 text-xs font-semibold text-pastel-mintText flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Today's Logged Meals */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-heading text-base font-bold text-slate-900">
            Today&apos;s Nutrition Summary
          </h2>
          <span className="text-xs text-slate-500 font-medium">640 kcal • 29.5g Protein</span>
        </div>

        <div className="space-y-2.5">
          {loggedMeals.map((meal, index) => (
            <Card key={index} className="rounded-3xl p-4 border-slate-200/80 bg-white shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {meal.mealType} • {meal.time}
                    </span>
                    <span className="rounded-full bg-pastel-mint px-2 py-0.2 text-[9px] font-bold text-pastel-mintText">
                      Score: {meal.pcosScore}/10
                    </span>
                  </div>
                  <h4 className="font-heading text-sm font-bold text-slate-900 mt-0.5">
                    {meal.dish}
                  </h4>
                </div>
                <div className="text-right text-xs font-bold text-slate-700">
                  {meal.calories} kcal
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>Carbs: <strong className="text-slate-800">{meal.carbs}g</strong></span>
                <span>Protein: <strong className="text-forest font-bold">{meal.protein}g</strong></span>
                <span>Fiber: <strong className="text-forest font-bold">{meal.fiber}g</strong></span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 150+ INDB Food Database Search & Category Filter */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-heading text-base font-bold text-slate-900">
            INDB Food Databank &amp; PCOS Smart Swaps
          </h2>
          <span className="text-xs text-slate-500">{filteredFoods.length} dishes</span>
        </div>

        {/* Pill Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Indian dishes (Roti, Poha, Dal, Paneer, Idli)..."
            className="w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-forest focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-forest text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Food Items List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredFoods.slice(0, 12).map((item) => {
            const isFriendly = item.pcosScore >= 7;
            return (
              <Card key={item.name} className="rounded-3xl p-4 border-slate-200/80 bg-white shadow-card flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-heading text-sm font-bold text-slate-900">
                        {item.name}
                      </h4>
                      {item.nameHindi && (
                        <span className="text-[11px] text-slate-400">{item.nameHindi}</span>
                      )}
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      isFriendly ? 'bg-pastel-mint text-pastel-mintText' : 'bg-pastel-peach text-pastel-peachText'
                    }`}>
                      {item.pcosScore}/10
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500 flex gap-2.5">
                    <span>{item.calories} kcal</span>
                    <span>•</span>
                    <span>P: {item.protein}g</span>
                    <span>•</span>
                    <span>F: {item.fiber}g</span>
                    <span>•</span>
                    <span>C: {item.carbs}g</span>
                  </div>

                  {item.swapSuggestion && (
                    <div className="mt-2.5 p-2 rounded-2xl bg-pastel-yellow/60 border border-amber-200/60 text-[11px] text-amber-900">
                      <span className="font-bold">Smart Swap:</span> {item.swapSuggestion}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{item.category}</span>
                  <button
                    type="button"
                    onClick={() => handleAddDirect(item)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Log Dish
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* F1. THALI PHOTO LOGGING FLOATING ACTION BUTTON (FAB) */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          type="button"
          onClick={() => setThaliModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-brand-pink text-white px-4 py-3 shadow-xl shadow-rose-300 hover:scale-105 active:scale-95 transition font-heading font-bold text-xs"
          title="Snap your Thali for AI meal breakdown"
        >
          <Camera className="w-5 h-5 animate-pulse" />
          <span>Snap Thali</span>
        </button>
      </div>

      {/* F1. THALI SCANNER MODAL */}
      {thaliModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-3 animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-4xl p-5 shadow-2xl border border-rose-100 z-10 space-y-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🥗</span>
                <span className="font-heading text-base font-bold text-slate-900">
                  Thali Photo Recognition
                </span>
              </div>
              <button
                type="button"
                onClick={() => setThaliModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Viewfinder with Segmentation Boxes */}
            <div className="relative rounded-3xl bg-slate-900 h-44 flex flex-col items-center justify-center text-white overflow-hidden border-2 border-dashed border-rose-300/80 p-3">
              <div className="grid grid-cols-2 gap-2 w-full h-full text-[10px]">
                <div className="border border-emerald-400 bg-emerald-950/40 rounded-xl p-1.5 flex flex-col justify-between">
                  <span className="font-bold text-emerald-300">1. Foxtail Millet (150g)</span>
                  <span className="text-emerald-400 font-semibold">Low GI Carb</span>
                </div>
                <div className="border border-indigo-400 bg-indigo-950/40 rounded-xl p-1.5 flex flex-col justify-between">
                  <span className="font-bold text-indigo-300">2. Palak Paneer (1 Katori)</span>
                  <span className="text-indigo-400 font-semibold">Protein &amp; Calcium</span>
                </div>
                <div className="border border-amber-400 bg-amber-950/40 rounded-xl p-1.5 flex flex-col justify-between">
                  <span className="font-bold text-amber-300">3. Moong Dal Tadka (1 Katori)</span>
                  <span className="text-amber-400 font-semibold">Fiber &amp; Bioactives</span>
                </div>
                <div className="border border-teal-400 bg-teal-950/40 rounded-xl p-1.5 flex flex-col justify-between">
                  <span className="font-bold text-teal-300">4. Cucumber Salad (50g)</span>
                  <span className="text-teal-400 font-semibold">Fiber First Starter</span>
                </div>
              </div>
            </div>

            {/* Glycemic Load & Tolerance Prediction */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950">Estimated Glycemic Load:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                  12 (Low / Optimal)
                </span>
              </div>
              <div className="text-[11px] text-slate-600">
                <strong>Tolerance Verdict:</strong> Suits You. Fiber-first sequencing prevents postprandial glucose spike.
              </div>
            </div>

            <Button
              variant="pink"
              className="w-full text-xs font-bold py-2.5"
              onClick={() => {
                setLoggedMeals([
                  {
                    mealType: 'dinner',
                    time: 'Just now',
                    dish: 'Thali: Foxtail Millet + Palak Paneer + Moong Dal + Salad',
                    calories: 460,
                    carbs: 42,
                    protein: 21,
                    fiber: 9.8,
                    pcosScore: 9.4,
                    swap: 'Thali photo validated by INDB engine',
                  },
                  ...loggedMeals,
                ]);
                setThaliModalOpen(false);
                setThaliLoggedSuccess(true);
                setTimeout(() => setThaliLoggedSuccess(false), 3500);
              }}
            >
              Confirm &amp; Log Thali
            </Button>
          </div>
        </div>
      )}

      {/* F3. REGIONAL & BUDGET MEAL PLAN MODAL */}
      {mealPlanOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-3 animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-4xl p-5 shadow-2xl border border-rose-100 z-10 space-y-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🗓️</span>
                <span className="font-heading text-base font-bold text-slate-900">
                  Regional &amp; Budget Meal Planner
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMealPlanOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Region Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Select Cuisine Region:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'telugu', label: 'Telugu / Deccan' },
                  { id: 'north', label: 'North Indian' },
                  { id: 'tamil', label: 'Tamil / Kerala' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCuisineRegion(c.id as any)}
                    className={`p-2 rounded-xl text-xs font-semibold border transition text-center ${
                      cuisineRegion === c.id
                        ? 'bg-forest text-white border-forest'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles: Budget & Family */}
            <div className="space-y-2 text-xs pt-1 border-t border-slate-100">
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Budget Mode (Under ₹80/meal)</div>
                  <div className="text-[10px] text-slate-500">Focuses on local millets, seasonal greens, and eggs</div>
                </div>
                <button
                  type="button"
                  onClick={() => setBudgetMode(!budgetMode)}
                  className={`w-9 h-5 rounded-full p-0.5 transition flex items-center ${
                    budgetMode ? 'bg-forest justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Cook for Family (No Separate Cooking)</div>
                  <div className="text-[10px] text-slate-500">Base family gravies with easy personal protein swaps</div>
                </div>
                <button
                  type="button"
                  onClick={() => setFamilyScale(!familyScale)}
                  className={`w-9 h-5 rounded-full p-0.5 transition flex items-center ${
                    familyScale ? 'bg-forest justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>
            </div>

            {/* Sample Day Preview */}
            <div className="p-3 rounded-2xl bg-forest/5 border border-forest/20 text-xs text-slate-800 space-y-1">
              <div className="font-bold text-forest">Tomorrow's Planned Menu:</div>
              <div className="text-[11px]">• <strong>Breakfast:</strong> Pesarattu (Green Gram Dosa) + Ginger Chutney (12g protein)</div>
              <div className="text-[11px]">• <strong>Lunch:</strong> Jowar Roti + Palak Pappu + Curd (Cooked for family)</div>
              <div className="text-[11px]">• <strong>Snack:</strong> Roasted Chana + Buttermilk (Under ₹15)</div>
            </div>

            <Button
              variant="forest"
              className="w-full text-xs font-bold py-2.5"
              onClick={() => setMealPlanOpen(false)}
            >
              Save Weekly Meal Schedule
            </Button>
          </div>
        </div>
      )}

      {thaliLoggedSuccess && (
        <div className="fixed bottom-24 left-4 right-4 z-50 p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Thali logged to today's nutrition record!</span>
        </div>
      )}

      <DisclaimerBanner type="wellness" />
    </div>
  );
}
