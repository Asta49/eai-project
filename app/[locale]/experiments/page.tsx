'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Lock,
  ChevronDown,
  ChevronUp,
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
    name: 'Resistance / Strength Training 3x/week',
    category: 'exercise',
    protocol: '3 sessions of 30-40 min compound lifts or bodyweight squats, lunges, push-ups.',
    baselineDays: 14,
    interventionDays: 35,
    primaryMetric: 'Energy & Insulin Sensitivity',
    secondaryMetrics: ['Waist-to-hip ratio'],
    mcid: 0.6,
    monthlyCostINR: 0,
    contraindications: [],
    requiresDoctorApproval: false,
    evidenceLevel: 'high',
    description: 'Increases GLUT4 transporter expression independent of insulin.',
  },
  {
    id: '5',
    code: 'spearmint_tea',
    name: 'Organic Spearmint Tea (2 cups/day)',
    category: 'diet',
    protocol: '1 cup mid-morning, 1 cup late afternoon. Brew loose leaf 10 mins.',
    baselineDays: 14,
    interventionDays: 42,
    primaryMetric: 'Hirsutism & Facial Hair Growth',
    secondaryMetrics: ['Acne'],
    mcid: 0.4,
    monthlyCostINR: 400,
    contraindications: ['pregnancy'],
    requiresDoctorApproval: false,
    evidenceLevel: 'moderate',
    description: 'Anti-androgenic flavonoid properties reducing free testosterone.',
  },
  {
    id: '6',
    code: 'early_dinner_8pm',
    name: 'Early Dinner by 8:00 PM (14h Fasting)',
    category: 'sleep',
    protocol: 'Complete all caloric intake by 8:00 PM. Water/herbal tea only until 10:00 AM breakfast.',
    baselineDays: 14,
    interventionDays: 28,
    primaryMetric: 'Fasting Glucose & Morning Energy',
    secondaryMetrics: ['Bloating', 'Sleep quality'],
    mcid: 0.5,
    monthlyCostINR: 0,
    contraindications: ['history_of_eating_disorders'],
    requiresDoctorApproval: false,
    evidenceLevel: 'moderate',
    description: 'Circadian insulin sensitivity alignment and nocturnal hepatic glucose rest.',
  },
];

export default function ExperimentsPage() {
  const t = useTranslations('experiments');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'en' | 'hi' | 'te' | 'ta';

  const [explaining, setExplaining] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<VerdictExplanation | null>(null);
  const [showMathDetails, setShowMathDetails] = useState<boolean>(false);

  // Completed Low-GI Indian Diet trial result
  const completedTrialResult: ExperimentResult = {
    effectEstimate: 1.15,
    standardError: 0.40,
    rawEffect: 1.10,
    cyclePhaseAdjusted: true,
    autocorrelationRho: 0.22,
    adherenceRate: 0.93,
    priorMean: 0.65,
    priorVariance: 0.20,
    posteriorMean: 0.98,
    posteriorVariance: 0.08,
    probBeneficial: 0.91,
    credibleInterval90: [0.52, 1.44],
    verdict: 'LIKELY_WORKED',
    beneficialDirection: 'higher',
    mcid: 0.5,
  };

  const recommendations = recommendNextExperiments(
    CANDIDATE_LIBRARY,
    {
      userId: 'priya_sharma_demo',
      phenotype: 'Phenotype_A',
      symptoms: ['irregular_periods', 'cravings', 'fatigue'],
      currentMedicines: [],
      monthlyBudgetINR: 2000,
      isPregnant: false,
      completedInterventionCodes: ['low_gi_diet'],
    },
    SEED_POPULATION_PRIORS,
    { seed: 42 }
  );

  const handleExplainVerdict = async () => {
    setExplaining(true);
    try {
      const response = await fetch('/api/verdict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          result: completedTrialResult,
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
      setExplaining(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Card in Forest Green */}
      <div className="rounded-4xl bg-forest p-6 text-white text-center shadow-soft relative overflow-hidden">
        <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-3 py-1 text-xs font-semibold text-sage-light">
          <FlaskConical className="w-3.5 h-3.5 text-sage" />
          Deterministic Statistics Engine
        </span>
        <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          N-of-1 Personal Science
        </h1>
        <p className="mt-1 text-xs text-sage-light max-w-md mx-auto">
          We test one intervention at a time with cycle-adjusted Bayesian statistics. Generative AI never determines whether a trial worked.
        </p>
      </div>

      {/* Active Trial Card */}
      <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1 text-xs font-bold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active N-of-1 Trial
          </span>
          <span className="rounded-full bg-pastel-mint px-3 py-1 text-xs font-bold text-pastel-mintText">
            Day 18 of 42
          </span>
        </div>

        <div className="mt-3">
          <h2 className="font-heading text-xl font-bold text-slate-900">
            Morning 30-min brisk walk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Primary Outcome: Daily Energy &amp; Postprandial Glucose
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600">Intervention Phase</span>
            <span className="text-forest">42% completed (18/42 days)</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[42%] rounded-full bg-forest" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-[#F4F6F2] p-3 text-center">
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">Adherence</div>
            <div className="font-heading text-base font-extrabold text-forest">88%</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">Days Left</div>
            <div className="font-heading text-base font-extrabold text-forest">24 Days</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">Current Delta</div>
            <div className="font-heading text-base font-extrabold text-forest">+0.9 pts</div>
          </div>
        </div>
      </Card>

      {/* Completed Experiment with Bayesian Verdict Card */}
      <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="sage">Completed Trial</Badge>
          <span className="inline-flex items-center gap-1 rounded-full bg-pastel-mint px-3 py-1 text-xs font-bold text-pastel-mintText">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Likely worked for you
          </span>
        </div>

        <div className="mt-3">
          <h2 className="font-heading text-xl font-bold text-slate-900">
            Low-GI Indian Diet (42 Days)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Replaced refined carbs with millets, pulses &amp; protein-first sequencing.
          </p>
        </div>

        {/* Statistical Summary Grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-2xl bg-[#F4F6F2] p-3 text-center">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Posterior Mean</div>
            <div className="font-heading text-base font-extrabold text-forest">+0.98 pts</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">P(Benefit &gt; MCID)</div>
            <div className="font-heading text-base font-extrabold text-forest">91%</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">90% Credible Int.</div>
            <div className="font-heading text-xs font-bold text-forest mt-1">[+0.52, +1.44]</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Adherence</div>
            <div className="font-heading text-base font-extrabold text-forest">93%</div>
          </div>
        </div>

        {/* Explain Verdict Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-between items-center">
          <Button
            type="button"
            variant="forest"
            size="sm"
            onClick={handleExplainVerdict}
            disabled={explaining}
            className="text-xs gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-sage" />
            {explaining ? 'Translating math...' : 'Explain Verdict with AI'}
          </Button>

          <button
            type="button"
            onClick={() => setShowMathDetails(!showMathDetails)}
            className="text-xs font-semibold text-slate-500 hover:text-forest flex items-center gap-1"
          >
            <span>{showMathDetails ? 'Hide OLS Formula' : 'Show Statistical Details'}</span>
            {showMathDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* AI Explanation Drawer */}
        {aiExplanation && (
          <div className="mt-4 rounded-3xl border border-emerald-200 bg-pastel-mint/60 p-4 space-y-2 animate-in fade-in">
            <h4 className="font-heading font-bold text-sm text-pastel-mintText">
              {aiExplanation.headline}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-body">
              {aiExplanation.plainExplanation}
            </p>
            <div className="text-xs text-forest font-semibold">
              Confidence Insight: {aiExplanation.probabilityInsight}
            </div>
            <div className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-2xl border border-emerald-100">
              <span className="font-bold">Next Recommended Step:</span> {aiExplanation.nextStepRecommendation}
            </div>
          </div>
        )}

        {/* Mathematical Formulation Drawer */}
        {showMathDetails && (
          <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-600 space-y-1.5 font-mono">
            <div className="font-bold text-slate-900 font-sans">Deterministic Formulation:</div>
            <div>• Model: y ~ phase + cyclePhase (OLS Menstrual/Follicular/Luteal)</div>
            <div>• Lag-1 Autocorrelation ρ: 0.22 → SE Inflated by 1.25x</div>
            <div>• Conjugate Normal Update: N(0.65, 0.45²) + Trial → N(0.98, 0.28²)</div>
            <div>• Decision Boundary: P(Benefit &gt; 0.50) = 91% ≥ 80% Threshold</div>
          </div>
        )}
      </Card>

      {/* Next Recommendations (Thompson Sampling) */}
      <div className="space-y-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-slate-900">
            Next Experiment Recommendations (Thompson Sampling)
          </h2>
          <p className="text-xs text-slate-500">
            Algorithmically ranked by expected effect, budget compatibility, and novelty.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {recommendations.map((rec, idx) => (
            <Card key={rec.intervention.code} className="rounded-3xl p-4 border-slate-200/80 bg-white shadow-card">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-pastel-blue px-2.5 py-0.5 text-[10px] font-bold text-pastel-blueText">
                  Rank #{idx + 1} • Expected Gain: +{(rec.sampledEffect).toFixed(2)} pts
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {rec.intervention.monthlyCostINR === 0 ? 'Free' : `₹${rec.intervention.monthlyCostINR}/mo`}
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-heading text-base font-bold text-slate-900">
                  {rec.intervention.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {rec.intervention.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Duration: {rec.intervention.interventionDays} days</span>
                <span className="text-forest font-semibold">
                  {rec.intervention.requiresDoctorApproval ? '🔒 Requires Doctor Lock' : 'Ready to Start'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <DisclaimerBanner type="wellness" />
    </div>
  );
}
