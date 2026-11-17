'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/language-switcher';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import { estimatePhenotype } from '@/lib/engine/phenotype';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Heart,
  Activity,
  AlertCircle,
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
  const [cityTier, setCityTier] = useState('tier1');
  const [heightCm, setHeightCm] = useState(161);
  const [weightKg, setWeightKg] = useState(67.5);
  const [waistCm, setWaistCm] = useState(84);
  const [diagnosisStatus, setDiagnosisStatus] = useState('diagnosed');

  // Symptoms
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'symptom_irregular_periods',
    'symptom_cravings',
    'symptom_weight_gain',
    'symptom_acne',
  ]);
  const [typicalCycleLength, setTypicalCycleLength] = useState(42);
  const [lastPeriodDate, setLastPeriodDate] = useState('2026-01-28');

  // Lifestyle
  const [dietType, setDietType] = useState('vegetarian');
  const [activityLevel, setActivityLevel] = useState('light');
  const [sleepHours, setSleepHours] = useState(7);
  const [monthlyBudget, setMonthlyBudget] = useState(2500);

  // Phenotype estimation preview
  const phenotypePreview = estimatePhenotype({
    hasIrregularCycles: selectedSymptoms.includes('symptom_irregular_periods') || typicalCycleLength > 35,
    typicalCycleLengthDays: typicalCycleLength,
    hasHyperandrogenismSymptoms:
      selectedSymptoms.includes('symptom_acne') ||
      selectedSymptoms.includes('symptom_hirsutism') ||
      selectedSymptoms.includes('symptom_hair_fall'),
    hasPcomUltrasound: true, // Typical in clinical diagnosis
    heightCm,
    weightKg,
    symptomsList: selectedSymptoms,
  });

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleFinishOnboarding = () => {
    // Save in localStorage for demo state persistence across client views
    const userProfile = {
      age,
      cityTier,
      heightCm,
      weightKg,
      waistCm,
      diagnosisStatus,
      symptoms: selectedSymptoms,
      typicalCycleLength,
      lastPeriodDate,
      dietType,
      activityLevel,
      sleepHours,
      monthlyBudget,
      phenotype: phenotypePreview.phenotype,
      phenotypeName: phenotypePreview.phenotypeName,
      bmi: phenotypePreview.bmi,
      bmiCategory: phenotypePreview.bmiCategory,
      insulinResistanceFlag: phenotypePreview.insulinResistanceFlag,
      consents: { core: consentCore, doctor: consentDoctor, research: consentResearch },
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('pcos_user_profile', JSON.stringify(userProfile));
    }
    router.push('/dashboard');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Patient Setup • Step {step} of {totalSteps}</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {t('title')}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {t('subtitle')}
        </p>

        {/* Progress bar */}
        <div className="mx-auto mt-4 h-1.5 max-w-xs overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full bg-rose-600 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: DPDP Consent & Language */}
      {step === 1 && (
        <Card className="border-rose-100 shadow-sm dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
                <ShieldCheck className="h-5 w-5" />
                <CardTitle>{t('dpdpTitle')}</CardTitle>
              </div>
              <LanguageSwitcher />
            </div>
            <CardDescription>{t('dpdpSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentCore"
                  checked={consentCore}
                  onChange={(e) => setConsentCore(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <label htmlFor="consentCore" className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t('consentCore')}
                  </label>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Stores age, cycle dates, daily symptom logs, and lab results in an encrypted format.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentDoctor"
                  checked={consentDoctor}
                  onChange={(e) => setConsentDoctor(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <label htmlFor="consentDoctor" className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t('consentDoctor')}
                  </label>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Allows treating doctors to review your pre-consult brief and approve clinical trials.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentResearch"
                  checked={consentResearch}
                  onChange={(e) => setConsentResearch(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <label htmlFor="consentResearch" className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t('consentResearch')}
                  </label>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Aggregates de-identified trial effect sizes to improve empirical Bayes priors for all Indian women.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic">
              {t('consentNotice')}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="pcos"
              disabled={!consentCore}
              onClick={() => setStep(2)}
              className="gap-2"
            >
              {tCommon('next')} <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Health Baseline & Body Measurements */}
      {step === 2 && (
        <Card className="border-rose-100 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>{t('stepProfile')}</CardTitle>
            <CardDescription>Establishes your baseline anthropometrics and diagnosis history.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="age">{t('age')}</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="cityTier">{t('cityTier')}</Label>
                <select
                  id="cityTier"
                  value={cityTier}
                  onChange={(e) => setCityTier(e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="tier1">{t('tier1')}</option>
                  <option value="tier2">{t('tier2')}</option>
                  <option value="tier3">{t('tier3')}</option>
                </select>
              </div>

              <div>
                <Label htmlFor="height">{t('height')}</Label>
                <Input
                  id="height"
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="weight">{t('weight')}</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="waist">{t('waist')}</Label>
                <Input
                  id="waist"
                  type="number"
                  value={waistCm}
                  onChange={(e) => setWaistCm(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="diagStatus">{t('diagnosisStatus')}</Label>
                <select
                  id="diagStatus"
                  value={diagnosisStatus}
                  onChange={(e) => setDiagnosisStatus(e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="diagnosed">{t('diagnosed')}</option>
                  <option value="suspected">{t('suspected')}</option>
                  <option value="not_sure">{t('notSure')}</option>
                </select>
              </div>
            </div>

            {/* Calculated BMI Badge */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-900">
              <span className="text-slate-600 dark:text-slate-400">
                Calculated BMI (Asian Cut-offs):
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {phenotypePreview.bmi} kg/m² ({phenotypePreview.bmiCategory.toUpperCase()})
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> {tCommon('back')}
            </Button>
            <Button variant="pcos" onClick={() => setStep(3)} className="gap-2">
              {tCommon('next')} <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Symptoms & Menstrual History */}
      {step === 3 && (
        <Card className="border-rose-100 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>{t('stepSymptoms')}</CardTitle>
            <CardDescription>{t('symptomsTitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Symptoms Grid */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {[
                { key: 'symptom_irregular_periods', label: t('symptom_irregular_periods') },
                { key: 'symptom_weight_gain', label: t('symptom_weight_gain') },
                { key: 'symptom_acne', label: t('symptom_acne') },
                { key: 'symptom_hair_fall', label: t('symptom_hair_fall') },
                { key: 'symptom_hirsutism', label: t('symptom_hirsutism') },
                { key: 'symptom_mood_swings', label: t('symptom_mood_swings') },
                { key: 'symptom_cravings', label: t('symptom_cravings') },
                { key: 'symptom_bloating', label: t('symptom_bloating') },
                { key: 'symptom_fertility', label: t('symptom_fertility') },
              ].map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.key);
                return (
                  <button
                    key={sym.key}
                    type="button"
                    onClick={() => toggleSymptom(sym.key)}
                    className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-rose-300 bg-rose-50 text-rose-900 shadow-sm dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    <span>{sym.label}</span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-rose-600" />}
                  </button>
                );
              })}
            </div>

            {/* Cycle History */}
            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              <div>
                <Label htmlFor="cycleLength">{t('typicalCycleLength')}</Label>
                <Input
                  id="cycleLength"
                  type="number"
                  value={typicalCycleLength}
                  onChange={(e) => setTypicalCycleLength(Number(e.target.value))}
                  className="mt-1.5"
                />
                <span className="text-[11px] text-slate-500">Normal range is 24 to 35 days</span>
              </div>

              <div>
                <Label htmlFor="lastPeriod">{t('lastPeriodDate')}</Label>
                <Input
                  id="lastPeriod"
                  type="date"
                  value={lastPeriodDate}
                  onChange={(e) => setLastPeriodDate(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> {tCommon('back')}
            </Button>
            <Button variant="pcos" onClick={() => setStep(4)} className="gap-2">
              {tCommon('next')} <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 4: Lifestyle, Budget & Phenotype Result Preview */}
      {step === 4 && (
        <Card className="border-rose-100 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>{t('stepLifestyle')}</CardTitle>
            <CardDescription>Tailors Indian diet suggestions and trial cost safety constraints.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="diet">{t('dietType')}</Label>
                <select
                  id="diet"
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="vegetarian">{t('diet_vegetarian')}</option>
                  <option value="non_vegetarian">{t('diet_non_vegetarian')}</option>
                  <option value="eggetarian">{t('diet_eggetarian')}</option>
                  <option value="vegan">{t('diet_vegan')}</option>
                </select>
              </div>

              <div>
                <Label htmlFor="activity">{t('activityLevel')}</Label>
                <select
                  id="activity"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="sedentary">{t('activity_sedentary')}</option>
                  <option value="light">{t('activity_light')}</option>
                  <option value="moderate">{t('activity_moderate')}</option>
                  <option value="active">{t('activity_active')}</option>
                </select>
              </div>

              <div>
                <Label htmlFor="sleep">{t('sleepHours')}</Label>
                <Input
                  id="sleep"
                  type="number"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="budget">{t('monthlyBudget')}</Label>
                <Input
                  id="budget"
                  type="number"
                  step="100"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="mt-1.5"
                />
                <span className="text-[11px] text-slate-500">
                  Used by the safety engine to filter candidate trials
                </span>
              </div>
            </div>

            {/* Estimated Rotterdam Phenotype Box */}
            <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50/50 p-5 dark:border-rose-900/60 dark:from-slate-900 dark:to-rose-950/20">
              <div className="flex items-center justify-between">
                <Badge variant="pcos">DETERMINISTIC PHENOTYPE ESTIMATE</Badge>
                <span className="text-xs text-slate-500">Confidence: {Math.round(phenotypePreview.confidence * 100)}%</span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                {phenotypePreview.phenotypeName}
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed dark:text-slate-300">
                {phenotypePreview.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md bg-white px-2 py-1 font-medium text-slate-700 shadow-xs dark:bg-slate-800 dark:text-slate-300">
                  Insulin Resistance: {phenotypePreview.insulinResistanceFlag ? 'Elevated Risk' : 'Normal Range'}
                </span>
                <span className="rounded-md bg-white px-2 py-1 font-medium text-slate-700 shadow-xs dark:bg-slate-800 dark:text-slate-300">
                  BMI: {phenotypePreview.bmi} ({phenotypePreview.bmiCategory})
                </span>
              </div>

              <div className="mt-3 flex items-start gap-1.5 text-[11px] text-rose-700 dark:text-rose-300">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{phenotypePreview.disclaimer}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> {tCommon('back')}
            </Button>
            <Button variant="pcos" size="lg" onClick={handleFinishOnboarding} className="gap-2">
              <Heart className="h-4 w-4" /> {t('finishOnboarding')}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Footer Disclaimer */}
      <div className="mt-6">
        <DisclaimerBanner type="wellness" />
      </div>
    </div>
  );
}
