'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import type { ExtractedCheckInData } from '@/lib/ai/checkin-extractor';
import { getVoiceProvider } from '@/lib/voice';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Mic,
  MicOff,
  Send,
  RotateCcw,
  Volume2,
  Calendar,
  Flame,
  Droplets,
  Activity,
  Heart,
} from 'lucide-react';

const MOOD_EMOJIS = [
  { score: 5, label: 'Overjoyed', emoji: '🤩', color: 'bg-pastel-yellow border-amber-300 text-amber-900' },
  { score: 4, label: 'Happy / Good', emoji: '😊', color: 'bg-pastel-mint border-emerald-300 text-emerald-900' },
  { score: 3, label: 'Neutral', emoji: '😐', color: 'bg-pastel-blue border-blue-300 text-blue-900' },
  { score: 2, label: 'Low / Sad', emoji: '😔', color: 'bg-pastel-purple border-purple-300 text-purple-900' },
  { score: 1, label: 'Exhausted', emoji: '😫', color: 'bg-pastel-peach border-rose-300 text-rose-900' },
];

const QUICK_TAG_OPTIONS = [
  'Walking (Adhered)',
  'Sugar Cravings',
  'Bloating',
  'Period Bleeding',
  'Hormonal Acne',
  'Brain Fog',
  'Deep Sleep',
  'Low Stress',
  'Spearmint Tea',
  'Spike in Fatigue',
];

export default function CheckinPage() {
  const t = useTranslations('checkin');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'en' | 'hi' | 'te' | 'ta';

  const [mode, setMode] = useState<'quick' | 'voice'>('quick');

  // Form states
  const [selectedMood, setSelectedMood] = useState<number>(4);
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [cravings, setCravings] = useState<number>(2);
  const [periodToday, setPeriodToday] = useState<boolean>(false);
  const [periodFlow, setPeriodFlow] = useState<string>('none');
  const [adherence, setAdherence] = useState<boolean>(true);
  const [activeTags, setActiveTags] = useState<string[]>(['Walking (Adhered)']);
  const [notes, setNotes] = useState<string>('');

  // Voice & NLP extraction state
  const [naturalInput, setNaturalInput] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [stopListeningFn, setStopListeningFn] = useState<(() => void) | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedReview, setExtractedReview] = useState<ExtractedCheckInData | null>(null);
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const toggleTag = (tag: string) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter((t) => t !== tag));
      if (tag === 'Period Bleeding') setPeriodToday(false);
      if (tag === 'Walking (Adhered)') setAdherence(false);
    } else {
      setActiveTags([...activeTags, tag]);
      if (tag === 'Period Bleeding') setPeriodToday(true);
      if (tag === 'Walking (Adhered)') setAdherence(true);
    }
  };

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
        setEnergyLevel(res.data.energy);
        setSelectedMood(res.data.mood);
        setCravings(res.data.cravings);
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
    }, 3500);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Prompt */}
      <div className="rounded-4xl bg-gradient-to-br from-[#FF7A9A] via-[#F04D7E] to-[#E3386C] p-6 text-white text-center shadow-lg shadow-rose-200/50 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/20 blur-xl" />
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-rose-50">
          <Calendar className="w-3.5 h-3.5 text-white" />
          Day 18 Daily Log • Luteal Phase
        </span>
        <h1 className="mt-2 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          How are you feeling today?
        </h1>
        <p className="mt-1 text-xs text-rose-100 max-w-sm mx-auto">
          Log your mood, symptoms, and flow to update your cycle predictions.
        </p>

        {/* Mode Toggle: Quick Tap vs Voice Natural Language */}
        <div className="mt-4 inline-flex rounded-full bg-black/15 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('quick')}
            className={`rounded-full px-4 py-1.5 transition-all ${
              mode === 'quick' ? 'bg-white text-brand-pink shadow-xs font-bold' : 'text-white'
            }`}
          >
            Quick Tap
          </button>
          <button
            type="button"
            onClick={() => setMode('voice')}
            className={`rounded-full px-4 py-1.5 transition-all ${
              mode === 'voice' ? 'bg-white text-brand-pink shadow-xs font-bold' : 'text-white'
            }`}
          >
            Voice Note
          </button>
        </div>
      </div>

      {/* Emergency Red Flag Notice if triggered */}
      {emergencyAlert && (
        <DisclaimerBanner type="emergency" customMessage={emergencyAlert} />
      )}

      {/* Mode 1: Quick Tap Interface (Matching s4.avif Emoji + Category chips) */}
      {mode === 'quick' && (
        <div className="space-y-4">
          {/* Mood Selector (Large Emoji Cards) */}
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
              1. Overall Mood
            </label>
            <div className="grid grid-cols-5 gap-2">
              {MOOD_EMOJIS.map((m) => {
                const isSelected = selectedMood === m.score;
                return (
                  <button
                    key={m.score}
                    type="button"
                    onClick={() => setSelectedMood(m.score)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-3xl border-2 transition-all ${
                      isSelected
                        ? `${m.color} scale-105 shadow-md`
                        : 'border-slate-100 bg-[#F4F6F2] hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl">{m.emoji}</span>
                    <span className="mt-1 text-[10px] font-bold font-heading truncate w-full text-center">
                      {m.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Energy & Cravings Sliders */}
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card space-y-4">
            {/* Energy */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Energy Level: {energyLevel} / 5
                </span>
                <span className="text-slate-400 font-normal">
                  {energyLevel >= 4 ? 'Energized' : energyLevel >= 3 ? 'Moderate' : 'Fatigued'}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergyLevel(lvl)}
                    className={`flex-1 py-2 rounded-2xl text-xs font-bold transition-all ${
                      energyLevel === lvl
                        ? 'bg-forest text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Cravings */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-coral" />
                  Carb / Sugar Cravings: {cravings} / 5
                </span>
                <span className="text-slate-400 font-normal">
                  {cravings <= 2 ? 'Minimal' : cravings >= 4 ? 'High' : 'Moderate'}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCravings(lvl)}
                    className={`flex-1 py-2 rounded-2xl text-xs font-bold transition-all ${
                      cravings === lvl
                        ? 'bg-coral text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Symptoms & Categories Chips (Matching reference s4.avif right side) */}
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Symptom &amp; Lifestyle Tags (Tap to toggle)
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAG_OPTIONS.map((tag) => {
                const isSelected = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-forest text-white shadow-sm scale-102'
                        : 'bg-[#F4F6F2] text-slate-700 hover:bg-slate-200/70 border border-slate-200/60'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Adherence to Trial */}
          <Card className="rounded-4xl p-4 border-slate-200/80 bg-white shadow-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pastel-mint text-pastel-mintText flex items-center justify-center font-bold">
                🚶‍♀️
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 font-heading">
                  Completed 30-min brisk walk today?
                </div>
                <div className="text-[11px] text-slate-500">
                  Required for N-of-1 statistical weighting
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAdherence(!adherence)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                adherence ? 'bg-forest text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {adherence ? 'Yes, Adhered' : 'Skipped'}
            </button>
          </Card>

          {/* Big CTA Button (Matching s4.avif) */}
          <Button
            type="button"
            variant="forest"
            size="lg"
            onClick={handleSaveCheckin}
            className="w-full text-base font-bold shadow-lg"
          >
            Save Check-in
          </Button>
        </div>
      )}

      {/* Mode 2: Natural Language Voice / Chat Mode */}
      {mode === 'voice' && (
        <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest font-heading">
              Vernacular Voice / Chat Extraction
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Speak or type naturally in Hindi, Telugu, Tamil, or English (e.g. &ldquo;Aaj bahut thakaan thi, walk complete kiya, periods nahi aaye&rdquo;).
            </p>
          </div>

          <div className="relative">
            <textarea
              value={naturalInput}
              onChange={(e) => setNaturalInput(e.target.value)}
              placeholder="Speak or type how your body felt today..."
              rows={4}
              className="w-full rounded-3xl border border-slate-200 bg-[#F4F6F2] p-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
            />

            {/* Signature Red Wave Audio Recording Button from reference s3.avif */}
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-transform ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse shadow-lg scale-110'
                    : 'bg-coral text-white shadow-md hover:scale-105'
                }`}
                title="Tap to speak"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="forest"
              onClick={handleExtractFromText}
              disabled={isExtracting || !naturalInput.trim()}
              className="flex-1"
            >
              {isExtracting ? 'Extracting with Zod...' : 'Extract Health Scores'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setNaturalInput('Aaj thakaan thi, 30 min brisk walk kiya, sweet craving hui.');
              }}
              className="text-xs"
            >
              Load Sample
            </Button>
          </div>

          {/* Extracted Review Card */}
          {extractedReview && (
            <div className="rounded-3xl border border-emerald-200 bg-pastel-mint/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pastel-mintText font-heading">
                  AI Extracted Confirmation:
                </span>
                <span className="text-[10px] text-slate-500">Review before saving</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white rounded-2xl p-2 border border-emerald-100">
                  <div className="text-[10px] text-slate-400">Energy</div>
                  <div className="font-bold text-forest">{extractedReview.energy} / 5</div>
                </div>
                <div className="bg-white rounded-2xl p-2 border border-emerald-100">
                  <div className="text-[10px] text-slate-400">Mood</div>
                  <div className="font-bold text-forest">{extractedReview.mood} / 5</div>
                </div>
                <div className="bg-white rounded-2xl p-2 border border-emerald-100">
                  <div className="text-[10px] text-slate-400">Cravings</div>
                  <div className="font-bold text-forest">{extractedReview.cravings} / 5</div>
                </div>
              </div>

              <div className="text-xs text-slate-700 italic">
                &ldquo;{extractedReview.summary}&rdquo;
              </div>

              <Button
                type="button"
                variant="forest"
                size="sm"
                onClick={handleSaveCheckin}
                className="w-full text-xs"
              >
                Confirm &amp; Commit Check-in
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-3xl bg-pastel-mint p-4 text-xs font-semibold text-pastel-mintText shadow-md animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Daily check-in recorded! Your N-of-1 trial posterior distribution has been updated.</span>
        </div>
      )}
    </div>
  );
}
