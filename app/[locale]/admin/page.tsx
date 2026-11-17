'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import { runNetworkEffectSimulation } from '@/lib/engine/simulation';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import {
  LineChart as LineChartIcon,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Coins,
  Users,
  Clock,
  CheckCircle2,
  Sliders,
  DollarSign,
} from 'lucide-react';

export default function AdminEconomicsPage() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');

  // Interactive Simulation Controls
  const [syntheticUserCount, setSyntheticUserCount] = useState<number>(2000);
  const [subscriptionPrice, setSubscriptionPrice] = useState<number>(299);
  const [inputTokenPriceINR, setInputTokenPriceINR] = useState<number>(12.5);
  const [outputTokenPriceINR, setOutputTokenPriceINR] = useState<number>(50.0);

  // Run simulation model
  const simResults = runNetworkEffectSimulation(
    syntheticUserCount,
    subscriptionPrice,
    inputTokenPriceINR,
    outputTokenPriceINR
  );

  // Aggregate Funnel Data (From 200 synthetic users in database)
  const funnelData = [
    { stage: '1. App Signups', count: 200, percent: 100 },
    { stage: '2. Profile Complete', count: 184, percent: 92 },
    { stage: '3. 1st Trial Started', count: 150, percent: 75 },
    { stage: '4. Trial Completed (Verdict)', count: 85, percent: 42.5 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      {/* Course Header Banner */}
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 p-6 dark:border-purple-900/60 dark:from-slate-900 dark:via-purple-950/30 dark:to-slate-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>IIM AHMEDABAD • ECONOMICS OF AI CAPSTONE</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              The Data Network Effect &amp; Unit Economics Moat
            </h1>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-300">
              Demonstrating why a generalized LLM without proprietary hierarchical trial priors cannot replicate this clinical advantage.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              Estimated Gross Margin
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {simResults.unitEconomics.grossMarginPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: DATA NETWORK EFFECT SIMULATION */}
      <div className="mt-8 space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('simulationTitle')}
            </h2>
            <p className="text-xs text-slate-500">{t('simulationDesc')}</p>
          </div>

          {/* User Count Slider */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <Sliders className="h-4 w-4 text-purple-600" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Cohort Scale (N):
              </span>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={syntheticUserCount}
                onChange={(e) => setSyntheticUserCount(Number(e.target.value))}
                className="w-32 accent-purple-600"
              />
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                {syntheticUserCount}
              </span>
            </div>
          </div>
        </div>

        {/* Highlight Callout Box: The Presentation Talking Point */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-purple-200 bg-purple-50/40 shadow-xs dark:border-purple-900 dark:bg-purple-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-purple-800 dark:text-purple-300">
                <span>Time-to-Verdict Reduction</span>
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <div className="mt-2 text-2xl font-black text-purple-900 dark:text-purple-100">
                -{simResults.summaryHighlight.daysSavedPercent}% Days
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Drops from 38.5 days down to 14.0 days as empirical Bayes priors concentrate.
              </p>
            </CardContent>
          </Card>

          <Card className="border-teal-200 bg-teal-50/40 shadow-xs dark:border-teal-900 dark:bg-teal-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-teal-800 dark:text-teal-300">
                <span>Verdict Accuracy Gain</span>
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
              </div>
              <div className="mt-2 text-2xl font-black text-teal-900 dark:text-teal-100">
                +{simResults.summaryHighlight.accuracyGainPercent}% Accuracy
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Diagnostic accuracy rises from 72.0% to 96.5% via partial pooling across identical Rotterdam phenotypes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-rose-200 bg-rose-50/40 shadow-xs dark:border-rose-900 dark:bg-rose-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-800 dark:text-rose-300">
                <span>LTV / CAC Ratio</span>
                <TrendingUp className="h-4 w-4 text-rose-600" />
              </div>
              <div className="mt-2 text-2xl font-black text-rose-900 dark:text-rose-100">
                {simResults.unitEconomics.ltvToCacRatio}x
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Annual LTV of ₹{simResults.unitEconomics.annualLtvINR} against ₹{simResults.unitEconomics.cacEstimateINR} Indian digital health CAC.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid: Graph A (Days to Verdict) & Graph B (Accuracy %) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Chart 1: Days to Confident Verdict */}
          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Graph 1: Days to Confident Verdict vs. Cohort Scale
              </CardTitle>
              <CardDescription>
                Lower is better. Demonstrates trial speed acceleration from network scale.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simResults.cohortCurve}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="userCount"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickFormatter={(v) => `${v} users`}
                    />
                    <YAxis
                      domain={[10, 45]}
                      stroke="#94a3b8"
                      fontSize={11}
                      unit="d"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line
                      type="monotone"
                      dataKey="flatPriorDaysToVerdict"
                      stroke="#94a3b8"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      name="Flat Unpooled Prior (Competitor / Zero Data)"
                    />
                    <Line
                      type="monotone"
                      dataKey="pooledPriorDaysToVerdict"
                      stroke="#9333ea"
                      strokeWidth={3}
                      name="Our Hierarchical Empirical Bayes Prior"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Chart 2: Diagnostic Verdict Accuracy */}
          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Graph 2: % Correct Verdicts vs. Cohort Scale
              </CardTitle>
              <CardDescription>
                Higher is better. Measures true efficacy recovery against noise.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simResults.cohortCurve}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="userCount"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickFormatter={(v) => `${v} users`}
                    />
                    <YAxis
                      domain={[60, 100]}
                      stroke="#94a3b8"
                      fontSize={11}
                      unit="%"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line
                      type="monotone"
                      dataKey="flatPriorAccuracyPercent"
                      stroke="#94a3b8"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      name="Flat Unpooled Prior (72.0%)"
                    />
                    <Line
                      type="monotone"
                      dataKey="pooledPriorAccuracyPercent"
                      stroke="#0d9488"
                      strokeWidth={3}
                      name="Our Hierarchical Empirical Bayes Prior (96.5%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Narrative Moat Explanation Card */}
        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 text-xs text-purple-900 leading-relaxed dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-200">
          <span className="font-bold">Economic Insight for Course Presentation:</span>{' '}
          {simResults.summaryHighlight.networkMoatDescription}
        </div>
      </div>

      {/* SECTION 2: UNIT ECONOMICS & PRICING PANEL */}
      <div className="mt-10 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('unitEconomicsTitle')}
          </h2>
          <p className="text-xs text-slate-500">
            Token-level telemetry, inference cost in ₹, and gross margin breakdown.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Card className="border-slate-200 shadow-xs dark:border-slate-800">
            <CardContent className="p-4">
              <span className="text-[11px] text-slate-500">Tokens / Active User / Month</span>
              <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {simResults.unitEconomics.totalTokensPerUserMonth.toLocaleString()}
              </div>
              <p className="mt-0.5 text-[10px] text-slate-400">
                17,000 In • 4,300 Out (Zod structured)
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-xs dark:border-slate-800">
            <CardContent className="p-4">
              <span className="text-[11px] text-slate-500">AI Cost / User / Month</span>
              <div className="mt-1 text-xl font-bold text-rose-600">
                ₹{simResults.unitEconomics.monthlyAiCostPerUserINR}
              </div>
              <p className="mt-0.5 text-[10px] text-slate-400">
                At ₹12.5 / 1M In &amp; ₹50 / 1M Out
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-xs dark:border-slate-800">
            <CardContent className="p-4">
              <span className="text-[11px] text-slate-500">Subscription Price</span>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-sm font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={subscriptionPrice}
                  onChange={(e) => setSubscriptionPrice(Number(e.target.value))}
                  className="w-20 rounded border border-slate-300 p-1 text-lg font-bold text-slate-900 dark:bg-slate-800 dark:text-white"
                />
                <span className="text-xs text-slate-400">/ mo</span>
              </div>
              <p className="mt-0.5 text-[10px] text-slate-400">Configurable tier</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-emerald-50/40 shadow-xs dark:border-slate-800 dark:bg-emerald-950/20">
            <CardContent className="p-4">
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
                Resulting Gross Margin
              </span>
              <div className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-400">
                {simResults.unitEconomics.grossMarginPercent}%
              </div>
              <p className="mt-0.5 text-[10px] text-slate-400">Software-like profitability</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 3: AGGREGATE PATIENT CONVERSION FUNNEL */}
      <div className="mt-10 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('funnelTitle')}
          </h2>
          <p className="text-xs text-slate-500">
            Observed conversion across 200 synthetic cohorts in the database.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
          <CardContent className="p-6">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} domain={[0, 200]} />
                  <YAxis type="category" dataKey="stage" stroke="#94a3b8" fontSize={12} width={170} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#be123c" radius={[0, 6, 6, 0]} name="Patients" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-8">
        <DisclaimerBanner type="wellness" />
      </div>
    </div>
  );
}
