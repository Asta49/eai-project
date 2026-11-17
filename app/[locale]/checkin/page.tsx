'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import type { ExtractedCheckInData } from '@/lib/ai/checkin-extractor';
import { getVoiceProvider } from '@/lib/voice';
import {
  CalendarCheck,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  RotateCcw,
} from 'lucide-react';

export default function CheckinPage() {
  const t = useTranslations('checkin');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'en' | 'hi' | 'te' | 'ta';

  const [mode, setMode] = useState<'form' | 'chat'>('form');

  // Form values
  const [energy, setEnergy] = useState<number>(4);
  const [mood, setMood] = useState<number>(4);
  const [cravings, setCravings] = useState<number>(2);
  const [acne, setAcne] = useState<number>(1);
  const [bloating, setBloating] = useState<number>(1);
  const [periodToday, setPeriodToday] = useState<boolean>(false);
  const [periodFlow, setPeriodFlow] = useState<string>('none');
  const [adherence, setAdherence] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');

  // Chat / Voice extraction state
  const [naturalInput, setNaturalInput] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [stopListeningFn, setStopListeningFn] = useState<(() => void) | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedReview, setExtractedReview] = useState<ExtractedCheckInData | null>(null);
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Web Speech recognition handler
  const handleToggleVoice = () => {
    if (isListening) {
      if (stopListeningFn) stopListeningFn();
      setIsListening(false);
      setStopListeningFn(null);
    } else {
      const voice = getVoiceProvider();
      const stop = voice.startListening(
        locale,
        (result) => {
          setNaturalInput(result.transcript);
        },
        (error) => {
          console.warn('Voice error:', error);
          setIsListening(false);
        }
      );
      setStopListeningFn(() => stop);
      setIsListening(true);
    }
  };

  const handleExtractFromText = async () => {
    if (!naturalInput.trim()) return;
    setIsExtracting(true);
    setEmergencyAlert(null);
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: naturalInput, locale }),
      });
      const res = await response.json();
      if (res.redFlag?.hasRedFlag) {
        setEmergencyAlert(res.redFlag.emergencyMessageLocale);
      } else if (res.data) {
        setExtractedReview(res.data);
        // Pre-fill form values from extraction
        setEnergy(res.data.energy);
        setMood(res.data.mood);
        setCravings(res.data.cravings);
        setAcne(res.data.acne);
        setBloating(res.data.bloating);
        setPeriodToday(res.data.periodToday);
        setPeriodFlow(res.data.periodFlow);
        setAdherence(res.data.adherenceToExperiment);
        if (res.data.notes) setNotes(res.data.notes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveCheckin = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setExtractedReview(null);
    }, 3000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Title */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300">
          <CalendarCheck className="h-3.5 w-3.5" />
          <span>Active Experiment Check-in • Day 18</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {t('title')}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t('subtitle')}</p>

        {/* Mode Toggle */}
        <div className="mx-auto mt-4 inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setMode('form')}
            className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
              mode === 'form'
                ? 'bg-white text-rose-700 shadow-xs dark:bg-slate-900 dark:text-rose-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Quick Form Mode (30s)
          </button>
          <button
            onClick={() => setMode('chat')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
              mode === 'chat'
                ? 'bg-white text-rose-700 shadow-xs dark:bg-slate-900 dark:text-rose-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Chat / Voice Mode
          </button>
        </div>
      </div>

      {/* Emergency Alert if triggered */}
      {emergencyAlert && (
        <div className="mb-6">
          <DisclaimerBanner type="emergency" customMessage={emergencyAlert} />
        </div>
      )}

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 shadow-xs dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Check-in Saved Successfully!</span> The deterministic Bayesian engine has updated your active experiment likelihood.
          </div>
        </div>
      )}

      {/* Mode 1: Quick Form */}
      {mode === 'form' && (
        <Card className="border-rose-100 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base">Daily Symptom &amp; Protocol Log</CardTitle>
            <CardDescription>
              Feeds directly into the OLS cycle-adjusted model
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Metric 1: Energy (1-5) */}
            <div>
              <div className="flex justify-between text-xs font-medium">
                <Label>{t('energy')}</Label>
                <span className="font-bold text-rose-600">{energy} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="mt-2 w-full accent-rose-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1 - Exhausted</span>
                <span>3 - Moderate</span>
                <span>5 - High Energy</span>
              </div>
            </div>

            {/* Metric 2: Mood (1-5) */}
            <div>
              <div className="flex justify-between text-xs font-medium">
                <Label>{t('mood')}</Label>
                <span className="font-bold text-rose-600">{mood} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="mt-2 w-full accent-rose-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1 - Low / Anxious</span>
                <span>3 - Neutral</span>
                <span>5 - Calm / Joyful</span>
              </div>
            </div>

            {/* Metric 3: Sugar Cravings (1-5) */}
            <div>
              <div className="flex justify-between text-xs font-medium">
                <Label>{t('cravings')}</Label>
                <span className="font-bold text-amber-600">{cravings} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={cravings}
                onChange={(e) => setCravings(Number(e.target.value))}
                className="mt-2 w-full accent-amber-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1 - None</span>
                <span>3 - Mild</span>
                <span>5 - Intense Cravings</span>
              </div>
            </div>

            {/* Metric 4 & 5: Acne & Bloating (0-3) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('acne')} (0-3)</Label>
                <select
                  value={acne}
                  onChange={(e) => setAcne(Number(e.target.value))}
                  className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value={0}>0 - Clear Skin</option>
                  <option value={1}>1 - Mild / Few spots</option>
                  <option value={2}>2 - Moderate Breakout</option>
                  <option value={3}>3 - Severe Inflammatory</option>
                </select>
              </div>

              <div>
                <Label>{t('bloating')} (0-3)</Label>
                <select
                  value={bloating}
                  onChange={(e) => setBloating(Number(e.target.value))}
                  className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value={0}>0 - No Bloating</option>
                  <option value={1}>1 - Mild Distension</option>
                  <option value={2}>2 - Moderate Discomfort</option>
                  <option value={3}>3 - Severe / Tight</option>
                </select>
              </div>
            </div>

            {/* Menstrual Period Section */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-bold">{t('periodToday')}</Label>
                  <p className="text-[11px] text-slate-500">
                    Crucial for OLS cycle phase regression adjustment
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPeriodToday(true);
                      if (periodFlow === 'none') setPeriodFlow('medium');
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      periodToday
                        ? 'bg-rose-600 text-white'
                        : 'border bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {tCommon('yes')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPeriodToday(false);
                      setPeriodFlow('none');
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      !periodToday
                        ? 'bg-slate-800 text-white'
                        : 'border bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {tCommon('no')}
                  </button>
                </div>
              </div>

              {periodToday && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <Label className="text-xs">{t('periodFlow')}</Label>
                  <div className="mt-1.5 flex gap-2">
                    {['spotting', 'light', 'medium', 'heavy'].map((flow) => (
                      <button
                        key={flow}
                        type="button"
                        onClick={() => setPeriodFlow(flow)}
                        className={`rounded-md px-2.5 py-1 text-xs capitalize ${
                          periodFlow === flow
                            ? 'bg-rose-600 text-white'
                            : 'border bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {flow}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Adherence to Active Experiment */}
            <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/60 dark:bg-rose-950/20">
              <div>
                <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                  {t('adherence')}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Active Trial: Myo-Inositol (2000mg BID morning &amp; evening)
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdherence(true)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold ${
                    adherence
                      ? 'bg-emerald-600 text-white'
                      : 'border bg-white text-slate-700 dark:bg-slate-800'
                  }`}
                >
                  {tCommon('yes')}
                </button>
                <button
                  type="button"
                  onClick={() => setAdherence(false)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold ${
                    !adherence
                      ? 'bg-amber-600 text-white'
                      : 'border bg-white text-slate-700 dark:bg-slate-800'
                  }`}
                >
                  {tCommon('no')}
                </button>
              </div>
            </div>

            {/* Encrypted Notes */}
            <div>
              <Label htmlFor="notes">{t('notes')}</Label>
              <Input
                id="notes"
                placeholder="e.g., Felt very steady energy today, walked 30 min in evening..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="pcos" size="lg" onClick={handleSaveCheckin} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {t('saveCheckin')}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Mode 2: Chat & Voice Extraction Mode */}
      {mode === 'chat' && (
        <div className="space-y-6">
          <Card className="border-rose-100 shadow-sm dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base">{t('voicePrompt')}</CardTitle>
              <CardDescription>
                Speak or type in Hindi, Telugu, Tamil, or English. The AI parses structured numbers for your verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <textarea
                  rows={4}
                  value={naturalInput}
                  onChange={(e) => setNaturalInput(e.target.value)}
                  placeholder={t('voicePlaceholder')}
                  className="w-full rounded-xl border border-input bg-background p-3.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={isListening ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={handleToggleVoice}
                    className="gap-2 text-xs"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-4 w-4 animate-pulse" />
                        {t('stopVoice')}
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 text-rose-600" />
                        {t('startVoice')}
                      </>
                    )}
                  </Button>
                  {isListening && (
                    <span className="text-xs text-rose-600 animate-pulse font-medium">
                      {t('listening')}
                    </span>
                  )}
                </div>

                <Button
                  variant="pcos"
                  size="sm"
                  disabled={!naturalInput.trim() || isExtracting}
                  onClick={handleExtractFromText}
                  className="gap-2 text-xs"
                >
                  <Sparkles className="h-4 w-4" />
                  {isExtracting ? tCommon('loading') : t('aiExtract')}
                </Button>
              </div>

              {/* Sample natural sentences for quick testing */}
              <div className="mt-2 text-xs text-slate-500">
                <span className="font-semibold">Quick test phrases:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <button
                    onClick={() =>
                      setNaturalInput(
                        'Aaj bahut thakaan thi, meetha khane ka mann tha, period nahi aaya, walk 30 mins kiya'
                      )
                    }
                    className="rounded bg-slate-100 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  >
                    Hindi: Thakaan + Cravings + Walk
                  </button>
                  <button
                    onClick={() =>
                      setNaturalInput(
                        'ఈరోజు చాలా నీరసంగా ఉంది, పీరియడ్ రాలేదు, వ్యాయామం పూర్తి చేసాను'
                      )
                    }
                    className="rounded bg-slate-100 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  >
                    Telugu: Neerasam + Walk
                  </button>
                  <button
                    onClick={() =>
                      setNaturalInput(
                        'High energy today, adhered to inositol protocol, no cravings, no period'
                      )
                    }
                    className="rounded bg-slate-100 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  >
                    English: High Energy + Inositol Adherence
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Confirmation Screen (Mandatory before saving) */}
          {extractedReview && (
            <Card className="border-teal-200 bg-teal-50/30 shadow-sm dark:border-teal-900/60 dark:bg-teal-950/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300">
                  <CheckCircle2 className="h-5 w-5" />
                  <CardTitle className="text-base">{t('extractedReviewTitle')}</CardTitle>
                </div>
                <CardDescription>
                  {extractedReview.summary}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                  <div className="rounded-lg bg-white p-2.5 shadow-2xs dark:bg-slate-800">
                    <span className="text-slate-500">Energy:</span>
                    <span className="ml-1.5 font-bold text-slate-900 dark:text-white">
                      {extractedReview.energy} / 5
                    </span>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 shadow-2xs dark:bg-slate-800">
                    <span className="text-slate-500">Cravings:</span>
                    <span className="ml-1.5 font-bold text-slate-900 dark:text-white">
                      {extractedReview.cravings} / 5
                    </span>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 shadow-2xs dark:bg-slate-800">
                    <span className="text-slate-500">Period:</span>
                    <span className="ml-1.5 font-bold text-slate-900 dark:text-white">
                      {extractedReview.periodToday ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 shadow-2xs dark:bg-slate-800">
                    <span className="text-slate-500">Adhered:</span>
                    <span className="ml-1.5 font-bold text-emerald-600">
                      {extractedReview.adherenceToExperiment ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    Values verified. Ready to record in health timeline.
                  </span>
                  <Button variant="teal" size="sm" onClick={handleSaveCheckin} className="gap-1.5 text-xs">
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm &amp; Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Footer Medical Disclaimer */}
      <div className="mt-8">
        <DisclaimerBanner type="wellness" />
      </div>
    </div>
  );
}
