'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
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
  const locale = useLocale() as 'en' | 'hi' | 'te' | 'ta';

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [naturalTextLog, setNaturalTextLog] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedMeal, setExtractedMeal] = useState<ExtractedFoodLog | null>(null);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

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
        <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-3 py-1 text-xs font-semibold text-sage-light">
          <Utensils className="w-3.5 h-3.5 text-sage" />
          Indian Nutrient Databank (INDB)
        </span>
        <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          PCOS Nutrition &amp; Glycemic Tracker
        </h1>
        <p className="mt-1 text-xs text-sage-light max-w-md mx-auto">
          Tailored for Indian kitchens. Scores dishes by fiber-to-carb ratio, glycemic impact, and provides smart swaps.
        </p>
      </div>

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

      <DisclaimerBanner type="wellness" />
    </div>
  );
}
