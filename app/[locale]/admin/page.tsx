'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  const simResults = runNetworkEffectSimulation(
    syntheticUserCount,
    subscriptionPrice,
    inputTokenPriceINR,
    outputTokenPriceINR
  );

  const funnelData = [
    { stage: '1. Signups', count: 200, percent: 100 },
    { stage: '2. Profile', count: 184, percent: 92 },
    { stage: '3. 1st Trial', count: 150, percent: 75 },
    { stage: '4. Verdict', count: 85, percent: 42.5 },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header in Forest Green */}
      <div className="rounded-4xl bg-forest p-6 text-white text-center shadow-soft relative overflow-hidden">
        <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-3 py-1 text-xs font-semibold text-sage-light">
          <Sparkles className="w-3.5 h-3.5 text-sage" />
          IIM Ahmedabad • Economics of AI Capstone
        </span>
        <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Data Network Effect &amp; Unit Economics
        </h1>
        <p className="mt-1 text-xs text-sage-light max-w-md mx-auto">
          Demonstrating our proprietary defensive moat: Hierarchical Empirical Bayes population priors vs flat unpooled priors.
        </p>
      </div>

      {/* Interactive Simulation Slider Card */}
      <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Interactive Simulation Model
            </span>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Patient Network Cohort Scale: {syntheticUserCount.toLocaleString()} Users
            </h3>
          </div>
          <span className="rounded-full bg-pastel-mint px-3 py-1 text-xs font-bold text-pastel-mintText">
            {simResults.summaryHighlight.daysSavedPercent}% Days Saved
          </span>
        </div>

        <div>
          <input
            type="range"
            min={50}
            max={5000}
            step={50}
            value={syntheticUserCount}
            onChange={(e) => setSyntheticUserCount(Number(e.target.value))}
            className="w-full accent-forest cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
            <span>50 Users (Cold Start)</span>
            <span>2,500 Users</span>
            <span>5,000 Users (Scaled Network)</span>
          </div>
        </div>

        {/* 3 Metric Pillars */}
        <div className="grid grid-cols-3 gap-2 rounded-3xl bg-[#F4F6F2] p-3 text-center">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Flat Prior Days</div>
            <div className="font-heading text-base font-extrabold text-slate-700">38 Days</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Pooled Prior Days</div>
            <div className="font-heading text-base font-extrabold text-forest">
              {simResults.cohortCurve[simResults.cohortCurve.length - 1].pooledPriorDaysToVerdict} Days
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Gross Margin</div>
            <div className="font-heading text-base font-extrabold text-forest">
              {simResults.unitEconomics.grossMarginPercent.toFixed(0)}%
            </div>
          </div>
        </div>
      </Card>

      {/* Graph 1: Time to Confident Verdict (Days Saved) */}
      <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-3">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">
            Graph 1: Days to Confident Verdict vs Patient Cohort Scale
          </h3>
          <p className="text-xs text-slate-500">
            Empirical Bayes partial pooling shrinks variance, reducing trial duration from 38d down to 14d.
          </p>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simResults.cohortCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="userCount" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[10, 45]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="flatPriorDaysToVerdict" name="Flat Prior (No Moat)" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="pooledPriorDaysToVerdict" name="Hierarchical Empirical Bayes (Our Moat)" stroke="#223F36" strokeWidth={3} dot={{ r: 3, fill: '#223F36' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            <span className="text-slate-600">Flat Unpooled Prior</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-forest" />
            <span className="text-forest font-bold">Empirical Bayes Population Prior</span>
          </div>
        </div>
      </Card>

      {/* Graph 2: Verdict Accuracy Gain */}
      <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-3">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">
            Graph 2: Bayesian Statistical Accuracy (%)
          </h3>
          <p className="text-xs text-slate-500">
            Higher precision reduces false negatives and prevents abandoning effective lifestyle habits.
          </p>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simResults.cohortCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="userCount" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[60, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="flatPriorAccuracyPercent" name="Flat Prior Accuracy %" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="pooledPriorAccuracyPercent" name="Empirical Bayes Accuracy %" stroke="#EE7A64" strokeWidth={3} dot={{ r: 3, fill: '#EE7A64' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Unit Economics Breakdown Card */}
      <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="font-heading text-base font-bold text-slate-900">
            AI Unit Economics &amp; Margin Profile
          </h3>
          <span className="rounded-full bg-pastel-mint px-2.5 py-0.5 text-[10px] font-bold text-pastel-mintText">
            Gross Margin: {simResults.unitEconomics.grossMarginPercent.toFixed(1)}%
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between p-2 rounded-2xl bg-[#F4F6F2]">
            <span className="text-slate-600">Monthly AI Cost / User (Tokens):</span>
            <span className="font-bold text-forest">₹{simResults.unitEconomics.monthlyAiCostPerUserINR.toFixed(2)}</span>
          </div>
          <div className="flex justify-between p-2 rounded-2xl bg-[#F4F6F2]">
            <span className="text-slate-600">Monthly Subscription Price:</span>
            <span className="font-bold text-forest">₹{subscriptionPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between p-2 rounded-2xl bg-[#F4F6F2]">
            <span className="text-slate-600">Annual LTV per Subscribed Patient:</span>
            <span className="font-bold text-forest">₹{simResults.unitEconomics.annualLtvINR.toFixed(0)}</span>
          </div>
          <div className="flex justify-between p-2 rounded-2xl bg-[#F4F6F2]">
            <span className="text-slate-600">Estimated CAC &amp; LTV/CAC Ratio:</span>
            <span className="font-bold text-forest">{simResults.unitEconomics.ltvToCacRatio.toFixed(1)}x LTV/CAC</span>
          </div>
        </div>
      </Card>

      {/* Aggregate User Funnel */}
      <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-3">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">
            Seeded Patient Conversion Funnel (200 Users)
          </h3>
          <p className="text-xs text-slate-500">
            Synthetic patient cohort demonstrating progression from onboarding to Bayesian trial verdict.
          </p>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis dataKey="stage" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#334155' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#223F36" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <DisclaimerBanner type="wellness" />
    </div>
  );
}
