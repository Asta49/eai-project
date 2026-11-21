'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { estimatePhenotype } from '@/lib/engine/phenotype';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Heart,
  Activity,
  Calendar,
} from 'lucide-react';

export default function OnboardingPage() {
  const t = useTranslations('onboarding');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Consent states (DPDP compliant)
  const [consentCore, setConsentCore] = useState(true);
  const [consentDoctor, setConsentDoctor] = useState(true);
  const [consentResearch, setConsentResearch] = useState(true);

  // Profile Baseline
  const [age, setAge] = useState(26);
  const [heightCm, setHeightCm] = useState(161);
  const [weightKg, setWeightKg] = useState(67.5);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Irregular cycles',
    'Sugar cravings',
    'Acne breakouts',
    'Weight resistance',
  ]);
  const [typicalCycleLength, setTypicalCycleLength] = useState(42);
  const [dietType, setDietType] = useState('vegetarian');

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const phenotypeResult = estimatePhenotype({
    hasIrregularCycles: true,
    typicalCycleLengthDays: typicalCycleLength,
    hasHyperandrogenismSymptoms: true,
    hasPcomUltrasound: false,
    heightCm,
    weightKg,
    fastingGlucoseMgDl: 94,
    fastingInsulinMicroUml: 15.6,
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-lg mx-auto">
      {/* Header Banner in Forest Green */}
      <div className="rounded-4xl bg-forest p-6 text-white text-center shadow-soft relative overflow-hidden">
        <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-3 py-1 text-xs font-semibold text-sage-light">
          <Sparkles className="w-3.5 h-3.5 text-sage" />
          Step {step} of {totalSteps}
        </span>
        <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight text-white">
          {step === 1 && 'DPDP Privacy & Consent'}
          {step === 2 && 'Body Metrics & Baseline'}
          {step === 3 && 'Symptom Spectrum & Cycle'}
          {step === 4 && 'Your Phenotype Estimate'}
        </h1>
        <p className="mt-1 text-xs text-sage-light">
          {step === 1 && 'Compliant with India’s Digital Personal Data Protection Act 2023.'}
          {step === 2 && 'Setting your clinical baseline for personal N-of-1 science.'}
          {step === 3 && 'Tailoring your Bayesian statistics prior distributions.'}
          {step === 4 && 'Estimated from Rotterdam consensus guidelines.'}
        </p>

        {/* Progress Bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-forest-dark/80">
          <div
            className="h-full bg-sage transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: DPDP CONSENT */}
      {step === 1 && (
        <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-4">
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F4F6F2] flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900 block font-heading">Core App &amp; Personal Science</span>
                <span className="text-slate-500 text-[11px]">Enables Bayesian cycle adjustment and N-of-1 trial calculations.</span>
              </div>
              <input
                type="checkbox"
                checked={consentCore}
                onChange={(e) => setConsentCore(e.target.checked)}
                className="h-4 w-4 accent-forest rounded cursor-pointer mt-0.5"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F4F6F2] flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900 block font-heading">Doctor Handoff Brief</span>
                <span className="text-slate-500 text-[11px]">Generate 1-page summaries for consultations and protocol approvals.</span>
              </div>
              <input
                type="checkbox"
                checked={consentDoctor}
                onChange={(e) => setConsentDoctor(e.target.checked)}
                className="h-4 w-4 accent-forest rounded cursor-pointer mt-0.5"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F4F6F2] flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900 block font-heading">Empirical Bayes Research Pooling</span>
                <span className="text-slate-500 text-[11px]">Anonymized trial variance updates population priors for your phenotype.</span>
              </div>
              <input
                type="checkbox"
                checked={consentResearch}
                onChange={(e) => setConsentResearch(e.target.checked)}
                className="h-4 w-4 accent-forest rounded cursor-pointer mt-0.5"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="forest"
            size="lg"
            onClick={() => setStep(2)}
            className="w-full text-sm font-bold shadow-md"
          >
            Agree &amp; Continue →
          </Button>
        </Card>
      )}

      {/* STEP 2: BODY METRICS */}
      {step === 2 && (
        <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Age (Years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-2xl border border-slate-200 bg-[#F4F6F2] p-3 text-xs text-slate-800 focus:border-forest focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-[#F4F6F2] p-3 text-xs text-slate-800 focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-[#F4F6F2] p-3 text-xs text-slate-800 focus:border-forest focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Dietary Pattern</label>
              <div className="grid grid-cols-3 gap-2">
                {['vegetarian', 'non-vegetarian', 'eggetarian'].map((diet) => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => setDietType(diet)}
                    className={`py-2 px-1 rounded-2xl text-[11px] font-semibold capitalize border transition-all ${
                      dietType === diet
                        ? 'border-forest bg-sage-light text-forest font-bold'
                        : 'border-slate-200 bg-[#F4F6F2] text-slate-600'
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
              ← Back
            </Button>
            <Button type="button" variant="forest" onClick={() => setStep(3)} className="flex-1">
              Next Step →
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: SYMPTOMS & CYCLE */}
      {step === 3 && (
        <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Select Current Symptoms (Tap to toggle)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Irregular cycles',
                'Sugar cravings',
                'Acne breakouts',
                'Weight resistance',
                'Hair thinning',
                'Hirsutism / Facial hair',
                'Fatigue / Energy crashes',
                'Mood fluctuations',
              ].map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-forest text-white shadow-xs'
                        : 'bg-[#F4F6F2] text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Typical Menstrual Cycle Length (Days)
            </label>
            <input
              type="number"
              value={typicalCycleLength}
              onChange={(e) => setTypicalCycleLength(Number(e.target.value))}
              className="w-full rounded-2xl border border-slate-200 bg-[#F4F6F2] p-3 text-xs text-slate-800 focus:border-forest focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
              ← Back
            </Button>
            <Button type="button" variant="forest" onClick={() => setStep(4)} className="flex-1">
              Generate Phenotype →
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: PHENOTYPE PREVIEW */}
      {step === 4 && (
        <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-4 text-center">
          <div className="w-14 h-14 rounded-full bg-pastel-mint text-forest flex items-center justify-center mx-auto font-heading text-xl font-bold">
            B
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Rotterdam Phenotype Estimate
            </span>
            <h3 className="font-heading text-xl font-bold text-slate-900 mt-1">
              Phenotype B: Ovulatory PCOS
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ovulatory dysfunction + clinical hyperandrogenism (HOMA-IR: 3.61 insulin resistance driver).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F4F6F2] text-left text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Asian BMI:</span>
              <span className="font-bold text-forest">26.0 kg/m² (Overweight threshold)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">HOMA-IR Status:</span>
              <span className="font-bold text-coral">3.61 (Insulin resistant)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Recommended 1st Trial:</span>
              <span className="font-bold text-forest">Morning 30-min brisk walk</span>
            </div>
          </div>

          <Button
            type="button"
            variant="forest"
            size="lg"
            onClick={() => router.push('/today')}
            className="w-full text-sm font-bold shadow-lg"
          >
            Launch Ritu Companion →
          </Button>
        </Card>
      )}
    </div>
  );
}
