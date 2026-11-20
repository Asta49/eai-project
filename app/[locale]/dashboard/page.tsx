'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { usePersona } from '@/components/persona-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Activity,
  Calendar,
  FlaskConical,
  FileSpreadsheet,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  Utensils,
  CalendarCheck,
  Stethoscope,
  Heart,
  Smile,
  CheckCircle2,
} from 'lucide-react';

const SAMPLE_7_DAY_TREND = [
  { day: 'Mon', energy: 3, mood: 3, cravings: 4 },
  { day: 'Tue', energy: 4, mood: 3, cravings: 3 },
  { day: 'Wed', energy: 4, mood: 4, cravings: 2 },
  { day: 'Thu', energy: 3, mood: 3, cravings: 3 },
  { day: 'Fri', energy: 5, mood: 4, cravings: 2 },
  { day: 'Sat', energy: 4, mood: 5, cravings: 1 },
  { day: 'Sun', energy: 5, mood: 4, cravings: 2 },
];

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { currentPersona } = usePersona();

  const userName = currentPersona.name;
  const [activeTab, setActiveTab] = useState<'trends' | 'biomarkers'>('trends');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Role Banner if Doctor or Admin Mode */}
      {currentPersona.type === 'doctor' && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-pastel-mint p-3 text-xs text-pastel-mintText shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold">🩺 Doctor Review Mode:</span>
            <span>Viewing Priya Sharma&apos;s trial data as {currentPersona.name}.</span>
          </div>
          <Link href="/doctors">
            <Button size="sm" variant="forest" className="h-7 text-xs px-3">
              Doctor Portal →
            </Button>
          </Link>
        </div>
      )}

      {currentPersona.type === 'admin' && (
        <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-pastel-blue p-3 text-xs text-pastel-blueText shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold">📊 Faculty Evaluation Mode:</span>
            <span>Viewing as IIM-A Course Evaluator.</span>
          </div>
          <Link href="/admin">
            <Button size="sm" variant="forest" className="h-7 text-xs px-3">
              Economics Moat →
            </Button>
          </Link>
        </div>
      )}

      {/* Signature Forest Green Header Card (Matching reference s1.jpeg, s2.avif, s4.avif) */}
      <div className="relative overflow-hidden rounded-4xl bg-forest p-5 sm:p-6 text-white shadow-soft">
        {/* Subtle background decorative shapes */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-forest-light/40 blur-2xl" />
        <div className="pointer-events-none absolute right-8 bottom-0 h-32 w-32 rounded-full bg-sage/10 blur-xl" />

        <div className="relative z-10 space-y-4">
          {/* Top Row: Date & Notification indicator */}
          <div className="flex items-center justify-between text-xs text-sage-light">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5 text-sage" />
              <span>Saturday, 20 Nov 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-2.5 py-0.5 text-[10px] font-semibold text-sage-light">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Demo
              </span>
            </div>
          </div>

          {/* Profile & Greeting Row */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-sage bg-sage-light font-heading text-lg font-bold text-forest shadow-md">
                {currentPersona.avatarText}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[9px] text-white">
                ✓
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl truncate">
                Hi, {userName.split(' ')[0]}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-sage-light">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Heart className="h-3 w-3 text-coral fill-coral" />
                  <span>88% Adherence</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-medium">
                  <Smile className="h-3 w-3 text-amber-300" />
                  <span>Ovulatory</span>
                </span>
                <span>•</span>
                <span className="rounded-full bg-sage/20 px-2 py-0.2 text-[10px] text-sage-light font-semibold">
                  Phenotype B
                </span>
              </div>
            </div>
          </div>

          {/* Nested Quote / Daily Insight Card from s1.jpeg */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-xs p-3 text-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-forest uppercase tracking-wider text-[10px]">
                Quote / Daily Insight
              </span>
              <span className="text-[10px] text-slate-400">Dr. Ananya Sen</span>
            </div>
            <p className="mt-1 text-xs text-slate-700 italic font-body leading-relaxed">
              &ldquo;Small, consistent lifestyle changes compound into long-term hormonal balance.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Overview 2x2 Colorful Pastel Cards Grid (Matching reference s1.jpeg, s2.avif) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-heading text-base font-bold text-slate-900">
            Overview
          </h2>
          <span className="text-xs text-slate-500 font-medium">Tap to open</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Module 1: Daily Check-in (Peach) */}
          <Link
            href="/checkin"
            className="group relative flex flex-col justify-between rounded-3xl bg-pastel-peach p-4 text-pastel-peachText shadow-card touch-card hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-pastel-peachText shadow-xs">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <ChevronRight className="h-4 w-4 text-pastel-peachText/60 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-4">
              <div className="font-heading text-sm font-bold leading-tight">
                Daily Check-in
              </div>
              <div className="text-[11px] text-pastel-peachText/80 mt-0.5">
                Energy, Mood & Flow
              </div>
            </div>
          </Link>

          {/* Module 2: N-of-1 Trials (Sky Blue) */}
          <Link
            href="/experiments"
            className="group relative flex flex-col justify-between rounded-3xl bg-pastel-blue p-4 text-pastel-blueText shadow-card touch-card hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-pastel-blueText shadow-xs">
                <FlaskConical className="h-5 w-5" />
              </div>
              <ChevronRight className="h-4 w-4 text-pastel-blueText/60 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-4">
              <div className="font-heading text-sm font-bold leading-tight">
                N-of-1 Trials
              </div>
              <div className="text-[11px] text-pastel-blueText/80 mt-0.5">
                Brisk Walk • Day 18/42
              </div>
            </div>
          </Link>

          {/* Module 3: Food Tracker (Lavender) */}
          <Link
            href="/food"
            className="group relative flex flex-col justify-between rounded-3xl bg-pastel-purple p-4 text-pastel-purpleText shadow-card touch-card hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-pastel-purpleText shadow-xs">
                <Utensils className="h-5 w-5" />
              </div>
              <ChevronRight className="h-4 w-4 text-pastel-purpleText/60 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-4">
              <div className="font-heading text-sm font-bold leading-tight">
                Indian Food
              </div>
              <div className="text-[11px] text-pastel-purpleText/80 mt-0.5">
                150+ INDB Dishes & Swaps
              </div>
            </div>
          </Link>

          {/* Module 4: Diagnostic Labs (Mint) */}
          <Link
            href="/labs"
            className="group relative flex flex-col justify-between rounded-3xl bg-pastel-mint p-4 text-pastel-mintText shadow-card touch-card hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-pastel-mintText shadow-xs">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <ChevronRight className="h-4 w-4 text-pastel-mintText/60 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-4">
              <div className="font-heading text-sm font-bold leading-tight">
                Lab Biomarkers
              </div>
              <div className="text-[11px] text-pastel-mintText/80 mt-0.5">
                HOMA-IR 3.61 • HbA1c 5.6%
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Vitals & Biomarkers Metrics (Matching reference s1.jpeg & s4.avif) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Insulin Resistance & HOMA-IR Card (s1.jpeg big stat card) */}
        <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Metabolic Health
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-pastel-peach px-2.5 py-0.5 text-[10px] font-bold text-pastel-peachText">
              Elevated (&gt;2.5)
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-4xl font-extrabold text-slate-900">
              3.61
            </span>
            <span className="text-sm font-medium text-slate-500">
              HOMA-IR
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-600">
            Fasting Insulin: 15.6 µIU/mL • Fasting Glucose: 94 mg/dL
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Target for ovulation: &lt; 2.0</span>
            <Link href="/labs" className="font-semibold text-forest hover:underline">
              View Labs →
            </Link>
          </div>
        </Card>

        {/* Cycle Phase & Timeline Card */}
        <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Menstrual Cycle
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-pastel-mint px-2.5 py-0.5 text-[10px] font-bold text-pastel-mintText">
              Mid-Follicular
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-4xl font-extrabold text-slate-900">
              Day 18
            </span>
            <span className="text-sm font-medium text-slate-500">
              of 42 days
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-600">
            Next period expected in ~24 days • Luteal phase starts in 4 days
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Estimated Ovulatory PCOS</span>
            <Link href="/checkin" className="font-semibold text-forest hover:underline">
              Log Period →
            </Link>
          </div>
        </Card>
      </div>

      {/* Active N-of-1 Personal Experiment Highlight Card */}
      <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="forest">Active N-of-1 Experiment</Badge>
            <span className="text-xs text-slate-500 font-medium">Day 18 of 42</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-pastel-mint px-3 py-1 text-xs font-bold text-pastel-mintText">
            ✓ Doctor Approved
          </span>
        </div>

        <div className="mt-3">
          <h3 className="font-heading text-xl font-bold text-slate-900">
            Morning 30-min brisk walk
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Primary Metric: Energy &amp; Post-Meal Glucose • Protocol: 30-min walk after morning breakfast
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-600">Trial Phase Progress</span>
            <span className="font-bold text-forest">42% completed (18/42 days)</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[42%] rounded-full bg-forest transition-all" />
          </div>
        </div>

        {/* 3 Metrics Mini Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-[#F4F6F2] p-3 text-center">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Adherence</div>
            <div className="mt-0.5 text-base font-extrabold text-forest font-heading">88%</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Days Left</div>
            <div className="mt-0.5 text-base font-extrabold text-forest font-heading">24 Days</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Bayesian Delta</div>
            <div className="mt-0.5 text-base font-extrabold text-forest font-heading">+0.9 pts</div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Generative AI has no write access to verdicts.
          </span>
          <Link href="/experiments">
            <Button size="sm" variant="forest" className="h-8 text-xs px-3">
              View Bayesian Details →
            </Button>
          </Link>
        </div>
      </Card>

      {/* 7-Day Symptom Trend Wave Chart (Matching reference s1.jpeg) */}
      <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900">
              7-Day Symptom Trends
            </h3>
            <p className="text-xs text-slate-500">
              Tracking energy, mood, and carbohydrate cravings
            </p>
          </div>
          <div className="flex gap-1 rounded-full bg-[#F4F6F2] p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('trends')}
              className={`rounded-full px-3 py-1 transition-all ${
                activeTab === 'trends' ? 'bg-forest text-white' : 'text-slate-600'
              }`}
            >
              Trends
            </button>
            <button
              onClick={() => setActiveTab('biomarkers')}
              className={`rounded-full px-3 py-1 transition-all ${
                activeTab === 'biomarkers' ? 'bg-forest text-white' : 'text-slate-600'
              }`}
            >
              Vitals
            </button>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SAMPLE_7_DAY_TREND} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  fontSize: '12px',
                }}
              />
              <Line type="natural" dataKey="energy" name="Energy (1-5)" stroke="#223F36" strokeWidth={3} dot={{ r: 4, fill: '#223F36' }} />
              <Line type="natural" dataKey="mood" name="Mood (1-5)" stroke="#9DBC98" strokeWidth={3} dot={{ r: 4, fill: '#9DBC98' }} />
              <Line type="natural" dataKey="cravings" name="Cravings (1-5)" stroke="#EE7A64" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3, fill: '#EE7A64' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-forest" />
            <span className="text-slate-600 font-medium">Energy (1-5)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sage" />
            <span className="text-slate-600 font-medium">Mood (1-5)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-coral" />
            <span className="text-slate-600 font-medium">Cravings (1-5)</span>
          </div>
        </div>
      </Card>

      {/* Therapist & Specialist Service Card (Matching reference s4.avif & s2.avif) */}
      <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Specialist Service
            </span>
            <h3 className="font-heading text-lg font-bold text-slate-900">
              Consultation &amp; Pre-Consult Brief
            </h3>
          </div>
          <Link href="/doctors" className="text-xs font-semibold text-forest hover:underline">
            View All →
          </Link>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-3xl bg-[#F4F6F2] border border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-forest text-white font-bold font-heading text-sm">
              AS
            </div>
            <div>
              <div className="font-heading text-sm font-bold text-slate-900">
                Dr. Ananya Sen, MD (OB-GYN)
              </div>
              <div className="text-[11px] text-slate-500">
                Today, 04:30 PM • Video Consultation
              </div>
            </div>
          </div>
          <span className="rounded-full bg-pastel-mint px-2.5 py-0.5 text-[10px] font-bold text-pastel-mintText">
            Confirmed
          </span>
        </div>

        <div className="mt-3 flex gap-2">
          <Link href="/doctors" className="flex-1">
            <Button variant="forest" size="sm" className="w-full text-xs">
              View AI Pre-Consult Summary
            </Button>
          </Link>
          <Link href="/doctors">
            <Button variant="outline" size="sm" className="text-xs">
              Manage
            </Button>
          </Link>
        </div>
      </Card>

      {/* Mandatory Clinical Disclaimer Banner */}
      <DisclaimerBanner type="wellness" />
    </div>
  );
}
