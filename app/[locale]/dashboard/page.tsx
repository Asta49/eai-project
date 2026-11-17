'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
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
  Legend,
} from 'recharts';
import {
  Activity,
  Calendar,
  FlaskConical,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
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

  const [userName] = useState('Priya Sharma');
  const [activeTab, setActiveTab] = useState<'trends' | 'biomarkers'>('trends');

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      {/* Top Banner: Greeting & Profile Quick Summary */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              {t('greeting')}, {userName}
            </h1>
            <Badge variant="pcos" className="text-[10px]">
              DEMO PERSONA
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            26 Years • Hyderabad • Rotterdam Phenotype A • Active N-of-1 Trial Day 18
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/checkin">
            <Button variant="pcos" className="gap-2 shadow-sm">
              <Activity className="h-4 w-4" />
              {t('logToday')}
            </Button>
          </Link>
          <Link href="/labs">
            <Button variant="outline" className="gap-2">
              <FileSpreadsheet className="h-4 w-4 text-teal-600" />
              {t('bookTest')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Phenotype Card */}
        <Card className="border-rose-100 bg-gradient-to-br from-white to-rose-50/40 shadow-xs dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                Rotterdam Phenotype
              </span>
              <Sparkles className="h-4 w-4 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              Phenotype A
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Classic / Complete (OD + HA + PCOM)
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
              <AlertTriangle className="h-3 w-3 text-amber-500" />
              <span>{t('phenotypeDisclaimer')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Insulin Resistance Risk */}
        <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/40 shadow-xs dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                Insulin Resistance
              </span>
              <Activity className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              HOMA-IR: 3.61
            </div>
            <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-300">
              Elevated Risk (&gt; 2.5 Clinical Cut-off)
            </p>
            <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-500">
              <span>Fasting Insulin: 15.6 µIU/mL</span>
            </div>
          </CardContent>
        </Card>

        {/* Asian BMI Category */}
        <Card className="border-teal-100 bg-gradient-to-br from-white to-teal-50/40 shadow-xs dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                Asian BMI Standard
              </span>
              <TrendingUp className="h-4 w-4 text-teal-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              26.0 kg/m²
            </div>
            <p className="mt-1 text-[11px] text-teal-700 dark:text-teal-300">
              Overweight Threshold (≥ 23.0 kg/m²)
            </p>
            <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-500">
              <span>Weight: 67.5 kg • Height: 161 cm</span>
            </div>
          </CardContent>
        </Card>

        {/* Menstrual Cycle Day */}
        <Card className="border-purple-100 bg-gradient-to-br from-white to-purple-50/40 shadow-xs dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                {t('cycleDay')}
              </span>
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              Day 18 / 42
            </div>
            <p className="mt-1 text-[11px] text-purple-700 dark:text-purple-300">
              Current Phase: Mid-Follicular
            </p>
            <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-500">
              <Clock className="h-3 w-3" />
              <span>Next period est: ~24 days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Active Experiment + Charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Active N-of-1 Experiment Card & Completed Result (2 Cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Active Trial Card */}
          <Card className="border-rose-200 shadow-sm dark:border-rose-900/60">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="pcos">ACTIVE N-OF-1 TRIAL</Badge>
                  <span className="text-xs text-slate-500">Day 18 of 42</span>
                </div>
                <Badge variant="success">Doctor Approved</Badge>
              </div>
              <CardTitle className="text-xl">Myo-Inositol (2000mg BID)</CardTitle>
              <CardDescription>
                Primary Outcome: Cycle Regularity &amp; Energy • Protocol: 2000mg morning, 2000mg evening
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600 dark:text-slate-300">
                    Intervention Phase Progress
                  </span>
                  <span className="text-rose-600 font-bold">42% completed</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full w-[42%] bg-gradient-to-r from-rose-500 to-rose-600" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-3 text-center text-xs dark:bg-slate-900">
                <div>
                  <div className="text-slate-500">Adherence</div>
                  <div className="mt-0.5 text-base font-bold text-slate-900 dark:text-white">
                    88%
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Days Remaining</div>
                  <div className="mt-0.5 text-base font-bold text-slate-900 dark:text-white">
                    24 Days
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Current Trend</div>
                  <div className="mt-0.5 text-base font-bold text-emerald-600">
                    +0.9 pts
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Deterministic verdict will compute automatically upon completion.
                </span>
                <Link href="/experiments">
                  <Button variant="link" size="sm" className="gap-1 p-0 text-xs">
                    View Trial Details <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Chart Section: 7-Day Symptom Trend */}
          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{t('recentCheckins')}</CardTitle>
                  <CardDescription>
                    Tracking daily energy, mood, and carbohydrate cravings
                  </CardDescription>
                </div>
                <div className="flex gap-1 text-xs">
                  <button
                    onClick={() => setActiveTab('trends')}
                    className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                      activeTab === 'trends'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Trends
                  </button>
                  <button
                    onClick={() => setActiveTab('biomarkers')}
                    className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                      activeTab === 'biomarkers'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Labs
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === 'trends' ? (
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={SAMPLE_7_DAY_TREND}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                      <YAxis domain={[1, 5]} stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line
                        type="monotone"
                        dataKey="energy"
                        stroke="#e11d48"
                        strokeWidth={2.5}
                        name="Energy (1-5)"
                      />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="#0d9488"
                        strokeWidth={2}
                        name="Mood (1-5)"
                      />
                      <Line
                        type="monotone"
                        dataKey="cravings"
                        stroke="#d97706"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        name="Cravings (1-5)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="space-y-3 py-2">
                  {[
                    { test: 'Fasting Plasma Glucose', val: '94 mg/dL', ref: '70-99', status: 'Normal' },
                    { test: 'Fasting Serum Insulin', val: '15.6 µIU/mL', ref: '2.6-24.9', status: 'Elevated (Target < 10)' },
                    { test: 'HOMA-IR Index', val: '3.61', ref: '< 2.5', status: 'High Insulin Resistance' },
                    { test: 'Total Testosterone', val: '68.4 ng/dL', ref: '15-55', status: 'Elevated' },
                    { test: 'AMH', val: '6.8 ng/mL', ref: '1.0-4.0', status: 'PCO Pattern' },
                    { test: '25-OH Vitamin D', val: '14.2 ng/mL', ref: '> 30.0', status: 'Deficient' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-900/40"
                    >
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.test}
                        </span>
                        <span className="ml-2 text-slate-400">Ref: {item.ref}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.val}
                        </span>
                        <Badge
                          variant={item.status === 'Normal' ? 'success' : 'destructive'}
                          className="text-[10px]"
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Completed Trial Summary + Quick Links */}
        <div className="space-y-6">
          {/* Completed Trial Verdict Highlight */}
          <Card className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40 shadow-sm dark:border-emerald-950 dark:from-slate-900 dark:to-emerald-950/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="success">COMPLETED TRIAL VERDICT</Badge>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <CardTitle className="text-base">Low-GI Indian Diet</CardTitle>
              <CardDescription>Concluded Jan 31, 2026 (42 Days)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-emerald-200 bg-white p-3 dark:border-emerald-900 dark:bg-slate-800">
                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  Bayesian Verdict: LIKELY WORKED
                </div>
                <div className="mt-1 text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                  91% Probability
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  P(Benefit &gt; MCID) = 91% • Effect: +1.15 pts (90% CI: [0.68, 1.62])
                </p>
              </div>

              <Link href="/experiments" className="block">
                <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                  <span>Explain in Telugu / Hindi</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recommended Next Tests */}
          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('recommendedActions')}</CardTitle>
              <CardDescription>Deterministic clinical test schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="font-semibold text-slate-900 dark:text-white">
                  Fasting Serum Insulin &amp; HOMA-IR
                </div>
                <p className="mt-0.5 text-slate-500">
                  Quarterly monitoring due in 3 weeks to measure metabolic response.
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">₹650</span>
                  <Link href="/labs">
                    <Button size="sm" variant="teal" className="h-7 text-xs">
                      Book Home Test
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="font-semibold text-slate-900 dark:text-white">
                  Specialist Consultation
                </div>
                <p className="mt-0.5 text-slate-500">
                  Dr. Ananya Sen (OB-GYN) • AI 1-page summary generated.
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">₹900</span>
                  <Link href="/doctors">
                    <Button size="sm" variant="pcos" className="h-7 text-xs">
                      View Doctor Brief
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Voice / Coach Card */}
          <Card className="border-purple-100 bg-gradient-to-br from-purple-50/50 to-white shadow-sm dark:border-purple-950 dark:from-slate-900 dark:to-slate-950">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Ask AI Health Coach
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Voice in Telugu, Hindi, Tamil &amp; English
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <Link href="/coach">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Ask a Question Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Medical Disclaimer */}
      <div className="mt-8">
        <DisclaimerBanner type="wellness" />
      </div>
    </div>
  );
}
