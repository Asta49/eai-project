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
  Volume2,
  Camera,
  X,
  Play,
  Pause,
  AlertTriangle,
  FileText,
  ShieldCheck,
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

  // H1. Forecast state
  const [forecastExpanded, setForecastExpanded] = useState<boolean>(false);
  const [isSpeakingForecast, setIsSpeakingForecast] = useState<boolean>(false);

  // H3. Audio recap state
  const [audioRecapPlaying, setAudioRecapPlaying] = useState<boolean>(false);
  const [audioTranscriptOpen, setAudioTranscriptOpen] = useState<boolean>(false);

  // H4. Prescription scan state
  const [prescriptionScanOpen, setPrescriptionScanOpen] = useState<boolean>(false);
  const [prescriptionSaved, setPrescriptionSaved] = useState<boolean>(false);

  // Workouts modal
  const [workoutsModalOpen, setWorkoutsModalOpen] = useState<boolean>(false);

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
    <div className="space-y-4 sm:space-y-5 pb-6">
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

          {/* Heart Content with Softened Evidence-Based Estimates */}
          <div className="pt-2 flex flex-col items-center justify-center">
            {heartMode === 'period' ? (
              <>
                <span className="text-xs font-semibold text-rose-100 uppercase tracking-wider">
                  Period:
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight mt-0.5">
                  Day 18
                </h2>
                <div className="mt-1 text-[10px] font-medium text-rose-100">
                  Estimated Conception Chance:
                </div>
                <div className="font-heading text-sm font-bold">Low (8–15%)</div>
                <div className="text-[9px] text-rose-200/90 leading-none mt-0.5">
                  Can't predict exactly with irregular cycles
                </div>
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

      {/* H1. TODAY'S FORECAST (Soft sky-blue #EEF2FF card with 3-day expandable outlook & read-aloud) */}
      <div className="bg-[#EEF2FF] border border-blue-200/80 rounded-3xl p-4 shadow-xs transition">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-900 font-heading">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Today’s Forecast</span>
              <span className="text-[9px] font-semibold bg-blue-100/90 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                High Confidence
              </span>
            </div>
            <p className="text-xs text-blue-950 leading-relaxed font-medium">
              Day 18. In your last 4 cycles, energy dipped and sugar cravings rose around now. Keep a roasted chana snack handy after 4 pm.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSpeakingForecast(!isSpeakingForecast)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition shrink-0 ${
              isSpeakingForecast
                ? 'bg-blue-600 text-white animate-pulse'
                : 'bg-white text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
            title="Read forecast aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {isSpeakingForecast && (
          <div className="mt-2 px-2.5 py-1.5 rounded-xl bg-blue-100 text-blue-900 text-[11px] flex items-center gap-2 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>Ritu is reading aloud in English (Indian accent)</span>
          </div>
        )}

        {/* 3-day Outlook Accordion Toggle */}
        <div className="mt-2.5 pt-2 border-t border-blue-200/60 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setForecastExpanded(!forecastExpanded)}
            className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            <span>{forecastExpanded ? 'Hide 3-day outlook' : 'View 3-day outlook'}</span>
            <ChevronRight className={`w-3 h-3 transition-transform ${forecastExpanded ? 'rotate-90' : ''}`} />
          </button>
          <span className="text-[10px] text-blue-600/70">From your personal logs</span>
        </div>

        {forecastExpanded && (
          <div className="mt-3 space-y-2 pt-1 border-t border-blue-200/50 text-xs text-blue-950 animate-in fade-in">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-2xl bg-white/90 border border-blue-100 shadow-xs">
                <div className="font-bold text-slate-800 text-[11px]">Today (Day 18)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Energy: Low</div>
                <div className="text-[10px] text-amber-600 font-medium">Cravings: High</div>
                <span className="inline-block mt-1 text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 rounded">High Conf.</span>
              </div>
              <div className="p-2 rounded-2xl bg-white/90 border border-blue-100 shadow-xs">
                <div className="font-bold text-slate-800 text-[11px]">Day 19</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Energy: Rising</div>
                <div className="text-[10px] text-slate-500">Cramps: None</div>
                <span className="inline-block mt-1 text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 rounded">High Conf.</span>
              </div>
              <div className="p-2 rounded-2xl bg-white/90 border border-blue-100 shadow-xs">
                <div className="font-bold text-slate-800 text-[11px]">Day 20</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Energy: Steady</div>
                <div className="text-[10px] text-slate-500">Cravings: Low</div>
                <span className="inline-block mt-1 text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 rounded">Medium Conf.</span>
              </div>
            </div>
            <div className="text-[10px] text-blue-800/80 italic mt-1 text-center">
              Guideline safety: If pain rises above 7/10, seek emergency medical care (112).
            </div>
          </div>
        )}
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
          {/* Card 1: H3. Weekly Audio Recap (Sunday Card with Audio & Transcript) */}
          <div className="flex flex-col justify-between p-3 rounded-2xl bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] border border-blue-200/90 shadow-xs h-32 relative">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base">🎙️</span>
                <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                  75 sec
                </span>
              </div>
              <div className="font-heading font-bold text-xs text-blue-950 mt-1 leading-snug">
                Weekly Audio Recap
              </div>
              <p className="text-[9px] text-blue-700 line-clamp-1 mt-0.5">
                Sunday log summary
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 mt-1">
              <button
                type="button"
                onClick={() => setAudioRecapPlaying(!audioRecapPlaying)}
                className="flex items-center gap-1 rounded-xl bg-blue-600 text-white px-2 py-1 text-[10px] font-bold hover:bg-blue-700 shadow-xs transition"
              >
                {audioRecapPlaying ? 'Pause ⏸' : 'Play ▶'}
              </button>
              <button
                type="button"
                onClick={() => setAudioTranscriptOpen(!audioTranscriptOpen)}
                className="text-[9px] text-blue-700 underline font-semibold"
              >
                {audioTranscriptOpen ? 'Hide' : 'Text'}
              </button>
            </div>
          </div>

          {/* Card 2: Mood Booster */}
          <Link
            href="/food"
            className="flex flex-col justify-between p-3 rounded-2xl bg-[#FFE8EF] border border-rose-100/80 hover:scale-[1.02] transition shadow-xs h-32"
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

          {/* Card 3: Spread Happiness (Typo Fixed!) */}
          <Link
            href="/experiments"
            className="flex flex-col justify-between p-3 rounded-2xl bg-[#E8F8F5] border border-emerald-100/80 hover:scale-[1.02] transition shadow-xs h-32"
          >
            <div>
              <span className="text-lg">✨</span>
              <div className="font-heading font-bold text-xs text-emerald-950 mt-1 leading-snug">
                Spread Happiness
              </div>
            </div>
            <span className="text-[9px] text-emerald-700 font-semibold">
              Active trials →
            </span>
          </Link>
        </div>

        {/* Weekly Audio Recap Transcript Drawer */}
        {audioTranscriptOpen && (
          <div className="mt-2.5 p-3 rounded-2xl bg-white border border-blue-100 text-xs text-slate-700 shadow-xs animate-in fade-in space-y-1">
            <div className="font-bold text-blue-900 text-[11px] flex items-center justify-between">
              <span>Recap Transcript (Nov 15–21, 2026)</span>
              <span className="text-slate-400 text-[10px]">Read by Ritu</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              "Here is your week, Priya: You logged 6 of 7 days. Your energy was highest on Tuesday after the Besan Chilla breakfast. Metformin adherence was 100%. Two mild cramps were recorded around ovulation. Sleep averaged 7.2 hours."
            </p>
          </div>
        )}
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
                  Empty stomach • 30m before tea • Dr. Ramesh Gupta
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

        {/* H4. Prescription Scan + Smart Timing Row */}
        <button
          type="button"
          onClick={() => setPrescriptionScanOpen(true)}
          className="w-full mt-2 py-2.5 px-3 rounded-2xl border border-dashed border-brand-pink text-brand-pink bg-rose-50/50 hover:bg-rose-100/60 font-bold text-xs flex items-center justify-center gap-2 transition"
        >
          <Camera className="w-4 h-4" />
          <span>+ Scan prescription</span>
        </button>

        {prescriptionSaved && (
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Prescription parsed! Smart timing rules applied.</span>
          </div>
        )}
      </div>

      {/* 6. 2×3 TOOLS GRID FOR DIRECT 1-TAP REACHABILITY */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2.5">
          <h3 className="font-heading text-sm font-bold text-slate-900">
            Care Tools & Services
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">1-Tap Access</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Tool 1: Food & Tolerance */}
          <Link
            href="/food"
            className="p-3 rounded-2xl bg-white border border-rose-100 shadow-xs hover:border-brand-pink transition flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-brand-pink flex items-center justify-center text-lg shrink-0">
              🥗
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Food & You</div>
              <div className="text-[10px] text-slate-500">Tolerances & Thali</div>
            </div>
          </Link>

          {/* Tool 2: Labs & OCR */}
          <Link
            href="/labs"
            className="p-3 rounded-2xl bg-white border border-rose-100 shadow-xs hover:border-brand-purple transition flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-brand-purple flex items-center justify-center text-lg shrink-0">
              🧪
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Lab Records</div>
              <div className="text-[10px] text-slate-500">OCR & Trends</div>
            </div>
          </Link>

          {/* Tool 3: Trials */}
          <Link
            href="/experiments"
            className="p-3 rounded-2xl bg-white border border-rose-100 shadow-xs hover:border-emerald-400 transition flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              🔬
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">N-of-1 Trials</div>
              <div className="text-[10px] text-slate-500">Personal tests</div>
            </div>
          </Link>

          {/* Tool 4: Smart Cart */}
          <Link
            href="/cart"
            className="p-3 rounded-2xl bg-white border border-rose-100 shadow-xs hover:border-amber-400 transition flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg shrink-0">
              🛒
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Smart Cart</div>
              <div className="text-[10px] text-slate-500">Zepto & Blinkit</div>
            </div>
          </Link>

          {/* Tool 5: Workouts */}
          <button
            type="button"
            onClick={() => setWorkoutsModalOpen(true)}
            className="p-3 rounded-2xl bg-white border border-rose-100 shadow-xs hover:border-brand-pink transition flex items-center gap-2.5 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-lg shrink-0">
              🏃‍♀️
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Workouts</div>
              <div className="text-[10px] text-slate-500">PCOS & Thyroid</div>
            </div>
          </button>

          {/* Tool 6: Fasting Planner */}
          <Link
            href="/food"
            className="p-3 rounded-2xl bg-white border border-rose-100 shadow-xs hover:border-purple-400 transition flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center text-lg shrink-0">
              🌙
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Fasting Days</div>
              <div className="text-[10px] text-slate-500">Navratri & Ekadashi</div>
            </div>
          </Link>
        </div>
      </div>

      {/* H4. PRESCRIPTION SCANNER MODAL */}
      {prescriptionScanOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-3 animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-4xl p-5 shadow-2xl border border-rose-100 z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-brand-pink" />
                <span className="font-heading text-base font-bold text-slate-900">
                  Prescription Scanner & Smart Timing
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPrescriptionScanOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated OCR viewfinder */}
            <div className="relative rounded-2xl bg-slate-900 p-4 text-center text-white space-y-2 border-2 border-dashed border-rose-300">
              <div className="text-xs font-semibold text-rose-200">
                📄 Dr. Sen's RX Slip Detected
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 text-[11px] text-left text-slate-200 space-y-1">
                <div>• Tab. Thyronorm 25mcg (1-0-0) AC</div>
                <div>• Tab. Metformin 500mg SR (0-0-1) PC</div>
                <div>• Cap. Shelcal-HD (1-0-0) PC</div>
              </div>
            </div>

            {/* Smart Timing AI Rules */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800 font-heading">
                Smart Timing Recommendations:
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Interaction Protection</span>
                </div>
                <div>
                  • <strong>Thyronorm:</strong> Empty stomach, wait 30 mins before tea or coffee.
                </div>
                <div>
                  • <strong>Calcium & Iron:</strong> Separate by at least 4 hours to avoid inhibiting absorption.
                </div>
              </div>
            </div>

            <Button
              variant="pink"
              className="w-full text-xs font-bold py-2.5"
              onClick={() => {
                setPrescriptionSaved(true);
                setPrescriptionScanOpen(false);
                setTimeout(() => setPrescriptionSaved(false), 3500);
              }}
            >
              Confirm & Add to Daily Schedule
            </Button>
          </div>
        </div>
      )}

      {/* WORKOUTS MODAL */}
      {workoutsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-3 animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-4xl p-5 shadow-2xl border border-rose-100 z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏃‍♀️</span>
                <span className="font-heading text-base font-bold text-slate-900">
                  Targeted Movement Plan
                </span>
              </div>
              <button
                type="button"
                onClick={() => setWorkoutsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed">
              Based on International PCOS Guidelines: 150 mins/week moderate activity + 2 days resistance training.
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Luteal Phase Gentle Yoga</div>
                  <div className="text-[10px] text-slate-500">20 mins • Low cortisol • Home room-friendly</div>
                </div>
                <Button size="sm" variant="pink" className="text-[10px] h-7 px-2.5">
                  Start
                </Button>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">PCOS Resistance Training</div>
                  <div className="text-[10px] text-slate-500">25 mins • Glutes & Core • Enhances insulin sensitivity</div>
                </div>
                <Button size="sm" variant="purple" className="text-[10px] h-7 px-2.5">
                  Start
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full text-xs font-semibold py-2"
              onClick={() => setWorkoutsModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
