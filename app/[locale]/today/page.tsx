'use client';

import React, { useState } from 'react';
import { Link } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import {
  Calendar,
  Sparkles,
  Heart,
  Activity,
  Flame,
  CheckCircle2,
  AlertCircle,
  Plus,
  Utensils,
  Dumbbell,
  Pill,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Info,
  ShoppingCart,
  Smile,
  Meh,
  Frown,
  Zap,
  TrendingUp,
  Share2,
  Lock,
} from 'lucide-react';

export default function TodayPage() {
  const t = useTranslations('common');
  const locale = useLocale();

  // 10-second check-in state
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [painLevel, setPainLevel] = useState<number>(1);
  const [selectedMood, setSelectedMood] = useState<string>('good');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['cravings']);
  const [adherenceChecked, setAdherenceChecked] = useState<boolean>(true);
  const [checkinSaved, setCheckinSaved] = useState<boolean>(false);

  // Medicine checklist
  const [meds, setMeds] = useState([
    {
      id: 'm1',
      name: 'Metformin 500mg',
      instruction: 'With breakfast',
      prescriber: 'Dr. Ananya Sen (Gyn)',
      taken: true,
      refillDays: 18,
    },
    {
      id: 'm2',
      name: 'Thyronorm 25mcg',
      instruction: 'Empty stomach (Morning)',
      prescriber: 'Dr. Ramesh Gupta (Endo)',
      taken: true,
      refillDays: 4,
    },
    {
      id: 'm3',
      name: 'Myo-Inositol 2000mg',
      instruction: 'With dinner · Trial Day 18',
      prescriber: 'Approved N-of-1 Protocol',
      taken: false,
      refillDays: 24,
    },
  ]);

  // Food tolerance state
  const [postMealCheck, setPostMealCheck] = useState<string | null>('No bloating');

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleSaveCheckin = () => {
    setCheckinSaved(true);
    setTimeout(() => setCheckinSaved(false), 3000);
  };

  const toggleMed = (id: string) => {
    setMeds(meds.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m)));
  };

  const moods = [
    { id: 'overjoyed', label: 'Great', emoji: '🤩' },
    { id: 'good', label: 'Good', emoji: '😊' },
    { id: 'neutral', label: 'Okay', emoji: '😐' },
    { id: 'down', label: 'Low', emoji: '😔' },
    { id: 'exhausted', label: 'Tired', emoji: '😫' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      {/* 3 Core Rules Banner */}
      <div className="rounded-3xl bg-forest-light/60 border border-forest/10 p-3.5 sm:p-4 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-forest text-xs mb-1">
          <ShieldCheck className="w-4 h-4 text-sage" />
          <span>The Ritu Clinical Promise</span>
        </div>
        <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
          • <strong>The doctor decides; AI fine-tunes.</strong> AI never overrides doctor prescriptions.<br />
          • <strong>Every answer shows its source.</strong> No diagnosis & no changes to medicine doses.<br />
          • <strong>Private by default.</strong> You choose what each person and app can see.
        </p>
      </div>

      {/* Greeting Header Card */}
      <div className="rounded-4xl bg-forest p-6 text-white shadow-soft relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Hi, Priya
              </h1>
              <span className="rounded-full bg-forest-light px-2.5 py-0.5 text-[10px] font-bold text-sage-light">
                Day 18 · Luteal Phase
              </span>
            </div>
            <p className="mt-1 text-xs text-sage-light max-w-sm">
              Your progesterone is elevated today. A restorative pace with steady protein keeps insulin stable.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-forest-light/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-white">
            <Calendar className="w-3.5 h-3.5 text-sage" />
            <span>Cycle Day 18 of 42</span>
          </div>
        </div>

        {/* Micro condition badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-forest-light px-2.5 py-0.5 text-[10px] font-semibold text-sage-light">
            PCOS (Rotterdam B)
          </span>
          <span className="rounded-full bg-forest-light px-2.5 py-0.5 text-[10px] font-semibold text-sage-light">
            Hypothyroidism
          </span>
          <span className="rounded-full bg-pastel-mint/20 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-200">
            Care Team Connected (2 Doctors)
          </span>
        </div>
      </div>

      {/* Nudge Cards: Pending Advice & Smart Cart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Nudge 1: Smart Cart Flag */}
        <Link href="/cart" className="block">
          <Card className="rounded-3xl p-4 border-amber-200/80 bg-pastel-yellow/40 hover:bg-pastel-yellow/60 transition shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                  Smart Cart Nudge
                </span>
                <span className="text-[10px] text-amber-700 font-semibold">Zepto linked</span>
              </div>
              <p className="text-xs text-slate-800 mt-1 font-medium">
                1 item flagged: Maida instant noodles clashes with Dr. Sen’s low-GI rule.
              </p>
              <div className="mt-1 text-[11px] text-amber-800 font-bold flex items-center gap-1">
                <span>View healthier swaps</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </Card>
        </Link>

        {/* Nudge 2: Pending Doctor Advice */}
        <Link href="/care" className="block">
          <Card className="rounded-3xl p-4 border-blue-200/80 bg-pastel-blue/40 hover:bg-pastel-blue/60 transition shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0 text-blue-800">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">
                  Pending Doctor Advice
                </span>
                <span className="text-[10px] text-blue-700 font-semibold">Due next week</span>
              </div>
              <p className="text-xs text-slate-800 mt-1 font-medium">
                Dr. Gupta scheduled Vitamin D3 &amp; TSH repeat test for Dec 2026.
              </p>
              <div className="mt-1 text-[11px] text-blue-800 font-bold flex items-center gap-1">
                <span>Book home sample collection</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* 10-Second Daily Check-in */}
      <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-pastel-peach px-2.5 py-0.5 text-[10px] font-bold text-pastel-peachText">
              ⚡ 10-Second Check-in
            </span>
            <h2 className="font-heading text-lg font-bold text-slate-900 mt-1">
              How is your body feeling right now?
            </h2>
          </div>
          {checkinSaved && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full animate-bounce">
              ✓ Logged!
            </span>
          )}
        </div>

        {/* Mood Emojis */}
        <div className="mt-4">
          <div className="text-xs font-semibold text-slate-600 mb-2">Mood</div>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMood(m.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                  selectedMood === m.id
                    ? 'border-forest bg-sage-light/60 scale-105 shadow-xs'
                    : 'border-slate-200 bg-[#F4F6F2] hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[10px] font-semibold text-slate-700 mt-1">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Energy & Pain Sliders */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Energy Level</span>
              <span className="text-forest font-bold">{energyLevel} / 5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full accent-forest cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>1 (Drained)</span>
              <span>5 (High Energy)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Pelvic / Cramp Pain</span>
              <span className="text-coral font-bold">{painLevel} / 10</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className="w-full accent-coral cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>0 (None)</span>
              <span>10 (Severe)</span>
            </div>
          </div>
        </div>

        {/* Symptoms Chips */}
        <div className="mt-4">
          <div className="text-xs font-semibold text-slate-600 mb-2">Noticeable Symptoms Today</div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'cravings', label: '🍬 Sugar Cravings' },
              { id: 'bloating', label: '💨 Bloating' },
              { id: 'acne', label: '✨ Acne Flare' },
              { id: 'fatigue', label: '🥱 Afternoon Fatigue' },
              { id: 'period', label: '🩸 Period Started' },
              { id: 'hairfall', label: '💇‍♀️ Hair Shedding' },
            ].map((s) => {
              const active = selectedSymptoms.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSymptom(s.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? 'bg-forest text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Adherence to active trial */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800">
              Active Trial: 30-min brisk walk
            </div>
            <div className="text-[11px] text-slate-500">
              Did you complete your 30 minutes today?
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAdherenceChecked(!adherenceChecked)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              adherenceChecked
                ? 'bg-pastel-mint text-pastel-mintText border border-emerald-300'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {adherenceChecked ? '✓ Completed' : 'Not yet'}
          </button>
        </div>

        <div className="mt-4">
          <Button
            type="button"
            variant="forest"
            size="sm"
            onClick={handleSaveCheckin}
            className="w-full rounded-full py-2.5 text-xs font-bold"
          >
            Save 10-Second Check-in
          </Button>
        </div>
      </Card>

      {/* Cycle Tracking & Prolonged Alert */}
      <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-pastel-purple px-2.5 py-0.5 text-[10px] font-bold text-pastel-purpleText">
            Cycle &amp; Ovulation
          </span>
          <span className="text-xs text-slate-500">Predicted Next: <strong>Dec 14</strong></span>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <div className="font-heading text-xl font-bold text-slate-900">
              Day 18 of Current Cycle
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Luteal Phase · Est. 24 days until next period
            </div>
          </div>
          <span className="text-xs font-bold text-forest bg-sage-light px-2.5 py-1 rounded-full">
            No Period Today
          </span>
        </div>

        {/* Prolonged cycle alert */}
        <div className="mt-3.5 p-3 rounded-2xl bg-pastel-peach/50 border border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-950">
          <AlertCircle className="w-4 h-4 text-coral shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Long Cycle Alert:</span> Your last 2 cycles averaged 42 days (longer than the standard 28–35 day interval). This pattern has been logged in your 1-page visit summary for Dr. Ananya Sen.
          </div>
        </div>
      </Card>

      {/* Medicines & Supplements */}
      <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-pastel-mint px-2.5 py-0.5 text-[10px] font-bold text-pastel-mintText">
            <Pill className="w-3 h-3" /> Medicines &amp; Supplements
          </span>
          <span className="text-[11px] font-bold text-forest flex items-center gap-1">
            <Share2 className="w-3 h-3" /> Shared with Doctors
          </span>
        </div>

        <div className="mt-3 space-y-2.5">
          {meds.map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                m.taken ? 'bg-sage-light/30 border-emerald-200' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleMed(m.id)}
                  className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center transition ${
                    m.taken ? 'bg-forest text-white' : 'border border-slate-300 bg-white'
                  }`}
                >
                  {m.taken && <CheckCircle2 className="w-4 h-4" />}
                </button>
                <div>
                  <div className="text-xs font-bold text-slate-900">{m.name}</div>
                  <div className="text-[11px] text-slate-500">{m.instruction}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Prescribed by: <strong className="text-slate-600">{m.prescriber}</strong>
                  </div>
                </div>
              </div>

              {m.refillDays <= 5 ? (
                <span className="rounded-full bg-coral/10 text-coral text-[10px] font-bold px-2 py-0.5 border border-coral/20">
                  Refill in {m.refillDays}d
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">
                  {m.refillDays}d left
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Food & You: Personal Tolerance & Doctor Overrides */}
      <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-pastel-purple px-2.5 py-0.5 text-[10px] font-bold text-pastel-purpleText">
            <Utensils className="w-3 h-3" /> Food &amp; You
          </span>
          <Link href="/food" className="text-xs font-bold text-forest hover:underline flex items-center gap-0.5">
            150+ INDB Dishes <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Doctor Rule Override Banner */}
        <div className="mt-3 p-3 rounded-2xl bg-forest-light/60 border border-forest/15 text-xs text-forest">
          <div className="flex items-center gap-1.5 font-bold mb-0.5">
            <Lock className="w-3.5 h-3.5 text-sage" />
            <span>Doctor Restriction Rule (Fixed Limit)</span>
          </div>
          <p className="text-[11px] text-slate-600">
            <strong>Dr. Sen: Avoid Gluten &amp; Maida.</strong> This clinical restriction overrides any AI tolerance scoring.
          </p>
        </div>

        {/* Personal Tolerance Spectrum */}
        <div className="mt-4">
          <div className="text-xs font-bold text-slate-800 mb-2">
            Your Food Group Tolerance (Learned from 42 logs)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-2xl bg-pastel-mint/40 border border-emerald-200">
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[9px] font-bold">
                🟢 Suits You
              </span>
              <div className="text-xs font-bold text-slate-900 mt-1">Fermented Millets (Ragi/Jowar)</div>
              <div className="text-[10px] text-slate-500">Stable energy, 0 bloating</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-pastel-yellow/50 border border-amber-200">
              <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[9px] font-bold">
                🟡 Small Portions
              </span>
              <div className="text-xs font-bold text-slate-900 mt-1">Chana / Chickpeas</div>
              <div className="text-[10px] text-slate-500">Fine up to 1 katori</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-pastel-peach/50 border border-rose-200">
              <span className="rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[9px] font-bold">
                🔴 Low Tolerance
              </span>
              <div className="text-xs font-bold text-slate-900 mt-1">A1 Dairy / Buffalo Milk</div>
              <div className="text-[10px] text-slate-500">Bloating in 5 of 6 meals</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-pastel-blue/40 border border-blue-200">
              <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-[9px] font-bold">
                🟣 Still Learning
              </span>
              <div className="text-xs font-bold text-slate-900 mt-1">Spearmint Tea</div>
              <div className="text-[10px] text-slate-500">6 days logged (need 14)</div>
            </div>
          </div>
        </div>

        {/* Post-Meal 2-Hour Check-in */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-800">
            Post-Meal Check: How did you feel 2–3 hours after Breakfast?
          </div>
          <div className="text-[11px] text-slate-500 mb-2">
            Dish: Besan Chilla with mint chutney
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['No bloating', 'Mild bloating', 'Heavy / Distended', 'Sustained Energy'].map((resp) => (
              <button
                key={resp}
                type="button"
                onClick={() => setPostMealCheck(resp)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  postMealCheck === resp
                    ? 'bg-forest text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {resp}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Workouts Adjusted for Condition & Cycle */}
      <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-pastel-blue px-2.5 py-0.5 text-[10px] font-bold text-pastel-blueText">
            <Dumbbell className="w-3 h-3" /> Workouts Plan
          </span>
          <span className="text-xs font-bold text-forest">90 / 150 min this week</span>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Moderate Activity Target (ICMR Guidelines)</span>
            <span>60% completed</span>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-forest rounded-full w-[60%]" />
          </div>
        </div>

        {/* Condition & Daily cycle adjustment */}
        <div className="mt-3 p-3 rounded-2xl bg-[#F4F6F2] text-xs">
          <div className="font-bold text-slate-900">Today’s Cycle-Adjusted Recommendation:</div>
          <p className="text-slate-600 text-[11px] mt-0.5">
            Because you are in your <strong>Luteal Phase (Day 18)</strong> with mild pelvic cramp (1/10), choose low-impact strength or steady walking. Avoid high-stress HIIT to prevent cortisol-insulin spikes.
          </p>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">20-Min Home Strength</div>
              <div className="text-[10px] text-slate-500">Bodyweight squats, wall sits, glute bridges</div>
            </div>
            <span className="rounded-full bg-pastel-mint text-pastel-mintText text-[10px] font-bold px-2.5 py-1">
              Recommended
            </span>
          </div>

          <div className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">15-Min Pelvic Mobility</div>
              <div className="text-[10px] text-slate-500">PCOS &amp; pelvic tension release</div>
            </div>
            <span className="rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1">
              Restorative
            </span>
          </div>
        </div>
      </Card>

      <DisclaimerBanner type="wellness" />
    </div>
  );
}
