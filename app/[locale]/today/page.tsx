'use client';

import React, { useState } from 'react';
import { Link, useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar as CalendarIcon,
  Heart,
  Edit3,
  Plus,
  CheckCircle2,
  ChevronRight,
  Smile,
  Pill,
  Sparkles,
  Utensils,
  BookOpen,
  ArrowRight,
  Clock,
  Activity,
  Flame,
} from 'lucide-react';

export default function TodayPage() {
  const router = useRouter();

  // Heart mode: 'period' (Pink heart) vs 'ovulation' (Periwinkle heart)
  const [heartMode, setHeartMode] = useState<'period' | 'ovulation'>('period');

  // Selected date in weekly strip
  const [selectedDay, setSelectedDay] = useState<number>(18);

  // Selected mood
  const [activeMood, setActiveMood] = useState<string>('happy');
  const [moodSuccess, setMoodSuccess] = useState<boolean>(false);

  // Quick medicines
  const [medsTaken, setMedsTaken] = useState<Record<string, boolean>>({
    thyronorm: true,
    metformin: false,
  });

  const weekDays = [
    { date: 15, day: 'S', isPeriod: false },
    { date: 16, day: 'M', isPeriod: false },
    { date: 17, day: 'T', isPeriod: false },
    { date: 18, day: 'W', isPeriod: true }, // Today
    { date: 19, day: 'T', isPeriod: false },
    { date: 20, day: 'F', isPeriod: false },
    { date: 21, day: 'S', isPeriod: false },
  ];

  const handleSelectMood = (moodId: string) => {
    setActiveMood(moodId);
    setMoodSuccess(true);
    setTimeout(() => setMoodSuccess(false), 2000);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* 1. HERO HEART WIDGET (Exact match to reference s1.png & s2.png) */}
      <div className="relative flex flex-col items-center justify-center pt-2">
        {/* Floating decorative mini hearts */}
        <span className="absolute left-8 top-12 text-rose-300 text-lg animate-pulse">
          ♥
        </span>
        <span className="absolute right-10 bottom-6 text-pink-300 text-sm animate-bounce">
          ♥
        </span>

        {/* Central Heart Card with toggle between Period & Ovulation */}
        <div
          onClick={() => setHeartMode(heartMode === 'period' ? 'ovulation' : 'period')}
          className={`relative w-64 h-60 sm:w-72 sm:h-64 rounded-full flex flex-col items-center justify-center p-6 text-white text-center shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
            heartMode === 'period'
              ? 'bg-gradient-to-br from-[#FF7A9A] via-[#F04D7E] to-[#E3386C] shadow-rose-300/50'
              : 'bg-gradient-to-br from-[#8E93F8] via-[#6C70EB] to-[#555AD4] shadow-indigo-300/50'
          }`}
          style={{
            clipPath:
              'path("M130,35 C130,35 110,0 65,0 C25,0 0,35 0,75 C0,135 75,190 130,225 C185,190 260,135 260,75 C260,35 235,0 195,0 C150,0 130,35 130,35 Z")',
          }}
        >
          {/* Top-Right Floating Edit / Log Button */}
          <Link
            href="/checkin"
            onClick={(e) => e.stopPropagation()}
            className="absolute right-6 top-8 w-8 h-8 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 shadow-xs transition"
            title="Log period / symptoms"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </Link>

          {/* Heart Content */}
          <div className="pt-2 flex flex-col items-center justify-center">
            {heartMode === 'period' ? (
              <>
                <span className="text-xs font-semibold text-rose-100 uppercase tracking-wider">
                  Period:
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight mt-0.5">
                  Day 18
                </h2>
                <div className="mt-1 text-[11px] font-medium text-rose-100">
                  Possible Pregnancy:
                </div>
                <div className="font-heading text-lg font-bold">12.4%</div>
              </>
            ) : (
              <>
                <span className="text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                  Prediction:
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
                  Ovulation
                </h2>
                <div className="mt-1 text-[11px] font-medium text-indigo-100 max-w-[140px] leading-tight">
                  High chance of fertile window
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tap to Toggle Hint */}
        <div className="mt-2 text-[11px] text-slate-400 font-medium">
          Tap heart to switch view (Period / Ovulation)
        </div>
      </div>

      {/* 2. WEEKLY CALENDAR STRIP (Exact match to reference s1.png & s2.png) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-rose-100/60">
        <div className="flex items-center justify-between px-1 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 font-heading">
            <CalendarIcon className="w-3.5 h-3.5 text-brand-pink" />
            <span>November 2026</span>
          </div>
          <Link
            href="/checkin"
            className="text-[11px] font-semibold text-brand-purple hover:underline"
          >
            View Calendar
          </Link>
        </div>

        {/* Row of 7 Days */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekDays.map((item) => {
            const isSelected = item.date === selectedDay;
            return (
              <button
                key={item.date}
                type="button"
                onClick={() => setSelectedDay(item.date)}
                className="flex flex-col items-center justify-center py-1 transition-all"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-brand-pink text-white shadow-md shadow-brand-pink/30 scale-105'
                      : item.isPeriod
                      ? 'border border-dashed border-brand-pink bg-rose-50/70 text-brand-pink'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.date}
                </div>
                <span
                  className={`text-[10px] font-semibold mt-1 ${
                    isSelected ? 'text-brand-pink font-bold' : 'text-slate-400'
                  }`}
                >
                  {item.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. YOUR MOOD ROW (Exact match to reference s1.png & s2.png) */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2.5">
          <h3 className="font-heading text-sm font-bold text-slate-900">
            Your Mood
          </h3>
          {moodSuccess && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ✓ Logged!
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {/* ➕ Add Mood Card */}
          <Link
            href="/checkin"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-brand-purpleLight border border-indigo-100 hover:bg-indigo-100/70 transition shadow-xs"
          >
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-brand-purple shadow-xs mb-1">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-brand-purple mt-0.5">
              Add Mood
            </span>
          </Link>

          {/* 😭 Sad */}
          <button
            type="button"
            onClick={() => handleSelectMood('sad')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition shadow-xs ${
              activeMood === 'sad'
                ? 'bg-rose-100 border-brand-pink scale-105'
                : 'bg-rose-50/70 border-rose-100 hover:bg-rose-100/50'
            }`}
          >
            <span className="text-2xl mb-1">😭</span>
            <span className="text-[10px] font-semibold text-slate-700">Sad</span>
          </button>

          {/* 😫 Badmood */}
          <button
            type="button"
            onClick={() => handleSelectMood('badmood')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition shadow-xs ${
              activeMood === 'badmood'
                ? 'bg-teal-100 border-teal-400 scale-105'
                : 'bg-teal-50/70 border-teal-100 hover:bg-teal-100/50'
            }`}
          >
            <span className="text-2xl mb-1">😫</span>
            <span className="text-[10px] font-semibold text-slate-700">Badmood</span>
          </button>

          {/* 😍 Happy */}
          <button
            type="button"
            onClick={() => handleSelectMood('happy')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition shadow-xs ${
              activeMood === 'happy'
                ? 'bg-amber-100 border-amber-400 scale-105'
                : 'bg-amber-50/70 border-amber-100 hover:bg-amber-100/50'
            }`}
          >
            <span className="text-2xl mb-1">😍</span>
            <span className="text-[10px] font-semibold text-slate-700">Happy</span>
          </button>
        </div>
      </div>

      {/* 4. HEALTH GUIDANCE & ARTICLES (Exact match to reference s1.png & s2.png) */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2.5">
          <h3 className="font-heading text-sm font-bold text-slate-900">
            Article
          </h3>
          <Link
            href="/ask"
            className="text-[11px] font-semibold text-brand-purple hover:underline flex items-center gap-0.5"
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Card 1: Daily Woman */}
          <Link
            href="/food"
            className="flex flex-col justify-between p-3 rounded-2xl bg-[#EEF2FF] border border-blue-100/80 hover:scale-[1.02] transition shadow-xs h-28"
          >
            <div>
              <span className="text-lg">🧘‍♀️</span>
              <div className="font-heading font-bold text-xs text-blue-950 mt-1 leading-snug">
                Daily Woman
              </div>
            </div>
            <span className="text-[9px] text-blue-600 font-semibold">
              Hormone balance →
            </span>
          </Link>

          {/* Card 2: Mood Booster */}
          <Link
            href="/food"
            className="flex flex-col justify-between p-3 rounded-2xl bg-[#FFE8EF] border border-rose-100/80 hover:scale-[1.02] transition shadow-xs h-28"
          >
            <div>
              <span className="text-lg">🥗</span>
              <div className="font-heading font-bold text-xs text-rose-950 mt-1 leading-snug">
                Mood Booster
              </div>
            </div>
            <span className="text-[9px] text-rose-600 font-semibold">
              Smart swaps →
            </span>
          </Link>

          {/* Card 3: Spread Happiness */}
          <Link
            href="/experiments"
            className="flex flex-col justify-between p-3 rounded-2xl bg-[#E8F8F5] border border-emerald-100/80 hover:scale-[1.02] transition shadow-xs h-28"
          >
            <div>
              <span className="text-lg">✨</span>
              <div className="font-heading font-bold text-xs text-emerald-950 mt-1 leading-snug">
                Spread Happines
              </div>
            </div>
            <span className="text-[9px] text-emerald-700 font-semibold">
              Active trials →
            </span>
          </Link>
        </div>
      </div>

      {/* 5. TODAY'S DAILY PROTOCOL (Medicines & Doctor Care) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-rose-100/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-heading text-xs font-bold text-slate-900">
            <Pill className="w-3.5 h-3.5 text-brand-pink" />
            <span>Daily Medicine Checklist</span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">
            Prescribed by Care Team
          </span>
        </div>

        <div className="space-y-2">
          {/* Thyronorm */}
          <div
            onClick={() =>
              setMedsTaken({ ...medsTaken, thyronorm: !medsTaken.thyronorm })
            }
            className={`p-2.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
              medsTaken.thyronorm
                ? 'bg-rose-50/50 border-rose-200'
                : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                  medsTaken.thyronorm
                    ? 'bg-brand-pink text-white'
                    : 'border border-slate-300 bg-white'
                }`}
              >
                {medsTaken.thyronorm && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Thyronorm 25mcg
                </div>
                <div className="text-[10px] text-slate-500">
                  Empty stomach • Dr. Ramesh Gupta
                </div>
              </div>
            </div>
            <span className="text-[10px] text-rose-600 font-bold">
              {medsTaken.thyronorm ? 'Taken ✓' : 'Due'}
            </span>
          </div>

          {/* Metformin */}
          <div
            onClick={() =>
              setMedsTaken({ ...medsTaken, metformin: !medsTaken.metformin })
            }
            className={`p-2.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
              medsTaken.metformin
                ? 'bg-rose-50/50 border-rose-200'
                : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                  medsTaken.metformin
                    ? 'bg-brand-pink text-white'
                    : 'border border-slate-300 bg-white'
                }`}
              >
                {medsTaken.metformin && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Metformin 500mg
                </div>
                <div className="text-[10px] text-slate-500">
                  With dinner • Dr. Ananya Sen
                </div>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">
              {medsTaken.metformin ? 'Taken ✓' : 'Evening'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
