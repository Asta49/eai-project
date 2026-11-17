'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import type { VerdictExplanation } from '@/lib/ai/verdict-explainer';
import { recommendNextExperiments } from '@/lib/engine/recommender';
import { SEED_POPULATION_PRIORS } from '@/lib/engine/priors';
import { CandidateIntervention, ExperimentResult } from '@/lib/engine/types';
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Lock,
} from 'lucide-react';

const CANDIDATE_LIBRARY: CandidateIntervention[] = [
  {
    id: '1',
    code: 'low_gi_diet',
    name: 'Low-GI Indian Diet',
    category: 'diet',
    protocol: 'Replace white rice/maida with pulses, millets (Kangni/Jowar), and besan chilla.',
    baselineDays: 14,
    interventionDays: 28,
    primaryMetric: 'Energy & Cravings',
    secondaryMetrics: ['Bloating'],
    mcid: 0.5,
    monthlyCostINR: 200,
    contraindications: [],
    requiresDoctorApproval: false,
    evidenceLevel: 'high',
    description: 'Stabilizes postprandial glucose excursions and improves insulin sensitivity.',
  },
  {
    id: '2',
    code: 'daily_walk',
    name: '30-min Daily Brisk Walk',
    category: 'exercise',
    protocol: '30 minutes of continuous walking, ideally 15 minutes post-lunch or dinner.',
    baselineDays: 14,
    interventionDays: 28,
    primaryMetric: 'Energy & Mood',
    secondaryMetrics: ['Sleep'],
    mcid: 0.5,
    monthlyCostINR: 0,
    contraindications: [],
    requiresDoctorApproval: false,
    evidenceLevel: 'high',
    description: 'Non-insulin mediated glucose clearance in peripheral muscle.',
  },
  {
    id: '3',
    code: 'myo_inositol',
    name: 'Myo-Inositol (2000mg BID)',
    category: 'supplement',
    protocol: '2000mg with breakfast and 2000mg with dinner in water.',
    baselineDays: 14,
    interventionDays: 42,
    primaryMetric: 'Cycle Regularity',
    secondaryMetrics: ['Energy', 'Cravings'],
    mcid: 0.8,
    monthlyCostINR: 1200,
    contraindications: ['severe_kidney_disease'],
    requiresDoctorApproval: true,
    evidenceLevel: 'high',
    description: 'Restores ovarian inositol depletion and promotes follicular maturation.',
  },
  {
    id: '4',
    code: 'strength_training',
    name: 'Progressive Resistance Training (3×/week)',
    category: 'exercise',
    protocol: 'Full-body resistance exercises targeting large muscle groups 3 times weekly.',
    baselineDays: 14,
    interventionDays: 42,
    primaryMetric: 'Energy & Strength',
    secondaryMetrics: ['Body composition'],
    mcid: 0.8,
    monthlyCostINR: 0,
    contraindications: ['acute_joint_injury'],
    requiresDoctorApproval: false,
    evidenceLevel: 'high',
    description: 'Builds metabolic glucose sink and elevates basal metabolic rate.',
  },
  {
    id: '5',
    code: 'cut_sugary_chai',
    name: 'Cut Sugary Chai (Zero Liquid Sucrose)',
    category: 'diet',
    protocol: 'Replace sweetened chai with green tea or spiced unsweetened black tea.',
    baselineDays: 14,
    interventionDays: 21,
    primaryMetric: 'Carb Cravings',
    secondaryMetrics: ['Energy'],
    mcid: 0.6,
    monthlyCostINR: 0,
    contraindications: [],
    requiresDoctorApproval: false,
    evidenceLevel: 'high',
    description: 'Eliminates acute glucose surges that stimulate ovarian theca androgens.',
  },
  {
    id: '6',
    code: 'spearmint_tea',
    name: 'Organic Spearmint Tea (2 cups daily)',
    category: 'supplement',
    protocol: 'Steep dried spearmint in boiling water for 10 minutes twice daily.',
    baselineDays: 14,
    interventionDays: 30,
    primaryMetric: 'Acne & Hirsutism',
    secondaryMetrics: ['Mood'],
    mcid: 0.5,
    monthlyCostINR: 400,
    contraindications: ['pregnancy'],
    requiresDoctorApproval: false,
    evidenceLevel: 'moderate',
    description: 'Natural anti-androgen clinically proven to reduce free testosterone.',
  },
];

// Priya's Completed Trial Result (Deterministic Bayesian output)
const COMPLETED_TRIAL_RESULT: ExperimentResult = {
  effectEstimate: 1.15,
  standardError: 0.32,
  rawEffect: 1.30,
  cyclePhaseAdjusted: true,
  autocorrelationRho: 0.18,
  adherenceRate: 0.88,
  priorMean: 1.15,
  priorVariance: 0.16,
  posteriorMean: 1.15,
  posteriorVariance: 0.08,
  probBeneficial: 0.91,
  credibleInterval90: [0.68, 1.62],
  verdict: 'LIKELY_WORKED',
  beneficialDirection: 'higher',
  mcid: 0.5,
};

export default function ExperimentsPage() {
  const t = useTranslations('experiments');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'en' | 'hi' | 'te' | 'ta';

  const [activeTab, setActiveTab] = useState<'current' | 'recommender' | 'library'>('current');
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<VerdictExplanation | null>(null);

  // Thompson Sampling Top-3 Recommendations
  const recommendations = recommendNextExperiments(
    CANDIDATE_LIBRARY,
    {
      userId: 'priya_sharma_demo',
      phenotype: 'Phenotype_A',
      symptoms: ['symptom_irregular_periods', 'symptom_cravings', 'symptom_acne'],
      currentMedicines: [],
      monthlyBudgetINR: 2500,
      isPregnant: false,
      completedInterventionCodes: ['low_gi_diet'],
    },
    SEED_POPULATION_PRIORS,
    { seed: 2026 }
  );

  const handleExplainVerdict = async () => {
    setIsExplaining(true);
    try {
      const response = await fetch('/api/verdict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          result: COMPLETED_TRIAL_RESULT,
          interventionName: 'Low-GI Indian Diet',
          locale,
        }),
      });
      const res = await response.json();
      if (res.data) {
        setAiExplanation(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExplaining(false);
    }
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
              DETERMINISTIC STATS ENGINE
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-300">
            {t('subtitle')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab('current')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'current'
                ? 'bg-white text-rose-700 shadow-xs dark:bg-slate-900 dark:text-rose-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            Active &amp; Completed Trials
          </button>
          <button
            onClick={() => setActiveTab('recommender')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'recommender'
                ? 'bg-white text-rose-700 shadow-xs dark:bg-slate-900 dark:text-rose-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            AI Recommender (Thompson Sampling)
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'library'
                ? 'bg-white text-rose-700 shadow-xs dark:bg-slate-900 dark:text-rose-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            Browse Library (12)
          </button>
        </div>
      </div>

      {/* Tab 1: Active Trial & Completed Trial with Verdict Explanation */}
      {activeTab === 'current' && (
        <div className="mt-6 space-y-6">
          {/* Active Trial Progress */}
          <Card className="border-rose-200 shadow-sm dark:border-rose-900/60">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="pcos">ACTIVE TRIAL (N-OF-1)</Badge>
                  <span className="text-xs text-slate-500">Day 18 of 42</span>
                </div>
                <Badge variant="success">Doctor Approved • Dr. Ananya Sen</Badge>
              </div>
              <CardTitle className="text-xl">Myo-Inositol (2000mg BID)</CardTitle>
              <CardDescription>
                Testing effect on cycle regularity and sustained energy levels in Rotterdam Phenotype A
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Phases */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Phase 1: Baseline Period
                    </span>
                    <Badge variant="success" className="text-[10px]">COMPLETED</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    14 Days of baseline observation established prior to supplement initiation.
                  </p>
                </div>

                <div className="rounded-xl border border-rose-300 bg-rose-50/50 p-3.5 dark:border-rose-900 dark:bg-rose-950/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                      Phase 2: Active Intervention
                    </span>
                    <Badge variant="pcos" className="text-[10px]">IN PROGRESS</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    Day 18 of 28 planned intervention days (Adherence: 88%).
                  </p>
                </div>
              </div>

              {/* Notice */}
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-100 p-2.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
                <span>
                  The Bayesian stats engine runs daily. Final verdict will unlock on Day 42 without any LLM alteration.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Completed Trial Card (The Core Demo Proof Point) */}
          <Card className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50/20 shadow-sm dark:border-emerald-950 dark:from-slate-900 dark:to-emerald-950/10">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="success">COMPLETED EXPERIMENT VERDICT</Badge>
                  <span className="text-xs text-slate-500">Concluded Jan 31, 2026</span>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  LIKELY WORKED FOR YOU (P = 91%)
                </div>
              </div>
              <CardTitle className="text-xl">Low-GI Indian Diet (42 Days AB Trial)</CardTitle>
              <CardDescription>
                Primary Outcome: Energy Level (1-5 Scale) • MCID Threshold: 0.5 points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Statistical Proof Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-[11px] text-slate-500">Effect Estimate (δ̂)</div>
                  <div className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    +1.15 pts
                  </div>
                  <div className="text-[10px] text-slate-400">OLS Phase Coeff</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-[11px] text-slate-500">Standard Error (SE)</div>
                  <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    0.32
                  </div>
                  <div className="text-[10px] text-slate-400">AR(1) Adjusted</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-[11px] text-slate-500">90% Credible Interval</div>
                  <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                    [0.68, 1.62]
                  </div>
                  <div className="text-[10px] text-emerald-600">Strictly &gt; MCID (0.5)</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-[11px] text-slate-500">P(Benefit &gt; MCID)</div>
                  <div className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    91.0%
                  </div>
                  <div className="text-[10px] text-slate-400">≥ 80% Threshold Met</div>
                </div>
              </div>

              {/* Statistical Rigor Badges */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Cycle Phase Adjusted: Yes (Menstrual vs Follicular vs Luteal)
                </span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Autocorrelation (ρ): 0.18 (Adjusted)
                </span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Protocol Adherence: 88%
                </span>
              </div>

              {/* AI Explanation Accordion/Box */}
              <div className="pt-2">
                {!aiExplanation ? (
                  <Button
                    variant="outline"
                    onClick={handleExplainVerdict}
                    disabled={isExplaining}
                    className="gap-2 text-xs font-semibold"
                  >
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    {isExplaining ? tCommon('loading') : t('explainWithAI')}
                  </Button>
                ) : (
                  <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900 dark:bg-purple-950/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-300">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span>{aiExplanation.headline}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-700 leading-relaxed dark:text-slate-300">
                      {aiExplanation.plainExplanation}
                    </p>
                    <p className="mt-1.5 text-xs text-purple-800 dark:text-purple-300 font-medium">
                      {aiExplanation.probabilityInsight}
                    </p>
                    <div className="mt-3 rounded-lg bg-white p-2.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        Recommended Next Step:{' '}
                      </span>
                      {aiExplanation.nextStepRecommendation}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: AI Recommender (Thompson Sampling) */}
      {activeTab === 'recommender' && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50/50 p-5 dark:border-purple-900 dark:from-slate-900 dark:to-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('recommenderTitle')}
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed dark:text-slate-300">
              Draws random samples from population priors $N(\mu_0, \tau_0^2)$, divides by clinical MCID, applies a cost penalty relative to your monthly budget, and adds a novelty exploration bonus.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {recommendations.map((rec, index) => (
              <Card
                key={rec.intervention.code}
                className="flex flex-col justify-between border-slate-200 shadow-sm transition-all hover:shadow-md dark:border-slate-800"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={index === 0 ? 'pcos' : 'outline'}>
                      Rank #{index + 1}
                    </Badge>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Score: {rec.totalScore}
                    </span>
                  </div>
                  <CardTitle className="text-base">{rec.intervention.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {rec.intervention.protocol}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Est. Monthly Cost:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      ₹{rec.intervention.monthlyCostINR}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Primary Target:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {rec.intervention.primaryMetric}
                    </span>
                  </div>
                  <div className="mt-2 rounded-lg bg-slate-50 p-2 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {rec.reason}
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  {rec.intervention.requiresDoctorApproval ? (
                    <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                      <Lock className="h-3.5 w-3.5 text-amber-600" />
                      Request Doctor Approval
                    </Button>
                  ) : (
                    <Button variant="pcos" size="sm" className="w-full gap-1.5 text-xs">
                      <FlaskConical className="h-3.5 w-3.5" />
                      {t('startTrial')}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Complete Intervention Library */}
      {activeTab === 'library' && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CANDIDATE_LIBRARY.map((item) => (
            <Card key={item.code} className="border-slate-200 shadow-xs dark:border-slate-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {item.category}
                  </Badge>
                  {item.requiresDoctorApproval ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                      <Lock className="h-3 w-3" /> Doctor Approval
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-600 font-semibold">Self-Initiated</span>
                  )}
                </div>
                <CardTitle className="text-base">{item.name}</CardTitle>
                <CardDescription className="text-xs">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1.5 text-xs text-slate-500">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Protocol: </span>
                  {item.protocol}
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Duration: </span>
                  {item.baselineDays}d baseline + {item.interventionDays}d active
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Cost: </span>
                  ₹{item.monthlyCostINR}/month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="mt-8">
        <DisclaimerBanner type="wellness" />
      </div>
    </div>
  );
}
