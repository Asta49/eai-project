'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import {
  User,
  Settings,
  ShieldCheck,
  Lock,
  Sparkles,
  Sliders,
  ShoppingCart,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info,
  Layers,
  Heart,
  Scale,
  Activity,
  FileText,
} from 'lucide-react';

export default function ProfilePage() {
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  // Active view: Profile Baseline vs Calibration Engine vs Smart Cart vs DPDP Privacy
  const [activeTab, setActiveTab] = useState<'profile' | 'calibration' | 'cart' | 'privacy'>('profile');

  // Smart Cart state
  const [smartCartEnabled, setSmartCartEnabled] = useState<boolean>(true);
  const [cartHelpLevel, setCartHelpLevel] = useState<'suggest' | 'swap' | 'autobuild'>('swap');
  const [linkedApps, setLinkedApps] = useState({
    zepto: true,
    blinkit: false,
    instamart: false,
  });

  // DPDP Consent toggles
  const [consentCore, setConsentCore] = useState<boolean>(true);
  const [consentDoctor, setConsentDoctor] = useState<boolean>(true);
  const [consentResearch, setConsentResearch] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Calibration conflict resolution test
  const [resolvedConflict, setResolvedConflict] = useState<boolean>(false);

  const handleExportData = () => {
    const healthRecord = {
      user: 'Priya Sharma',
      age: 26,
      city: 'Hyderabad',
      conditions: ['PCOS (Rotterdam B)', 'Hypothyroidism'],
      familyHistory: ['Diabetes (Paternal)', 'Thyroid (Maternal)'],
      latestLabs: {
        homaIr: 3.61,
        fastingInsulin: 16,
        freeTestosterone: 42,
        tsh: 3.8,
      },
      doctorRules: [
        'Avoid Gluten & High Glycemic Carbs',
        'Fasting Insulin Target < 10',
      ],
      learnedTolerances: {
        fermentedMillets: 'Suits You',
        chickpeas: 'Small Portions',
        a1Dairy: 'Low Tolerance',
      },
      exportTimestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(healthRecord, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ritu_health_record_${Date.now()}.json`;
    a.click();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      {/* Header */}
      <div className="rounded-4xl bg-gradient-to-br from-[#FF7A9A] via-[#F04D7E] to-[#E3386C] p-6 text-white shadow-lg shadow-rose-200/50 relative overflow-hidden">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white">
          <User className="w-3 h-3 text-white" />
          Health Profile &amp; Settings
        </span>

        <h1 className="mt-2 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Priya Sharma
        </h1>
        <p className="mt-1 text-xs text-rose-100 max-w-md">
          26F, Hyderabad • PCOS (Rotterdam B) &amp; Hypothyroidism • Care Team Connected.
        </p>

        {/* Navigation Tabs */}
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'profile', label: '👤 Profile' },
            { id: 'calibration', label: '⚖️ Calibration' },
            { id: 'cart', label: '🛒 Smart Cart' },
            { id: 'privacy', label: '🔒 Privacy & Export' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-white text-brand-pink shadow-xs font-bold'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: HEALTH BASELINE PROFILE */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          <Card className="rounded-4xl p-5 sm:p-6 border-rose-100/80 bg-white shadow-card">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              Personal Health Baseline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuously calibrated through daily check-ins and verified lab uploads.
            </p>

            <div className="mt-4 space-y-3">
              {/* Question 1: Conditions */}
              <div className="p-3.5 rounded-2xl bg-[#F4F6F2] border border-slate-200/70 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  1. Conditions (Diagnosed / Suspected)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-forest text-white text-[11px] font-bold px-3 py-1">
                    PCOS (Rotterdam Phenotype B) — Clinically Diagnosed
                  </span>
                  <span className="rounded-full bg-forest text-white text-[11px] font-bold px-3 py-1">
                    Hypothyroidism — Clinically Diagnosed
                  </span>
                  <span className="rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1">
                    Endometriosis — Suspected (Pelvic Pain)
                  </span>
                </div>
              </div>

              {/* Question 2: Cycle Pattern */}
              <div className="p-3.5 rounded-2xl bg-[#F4F6F2] border border-slate-200/70 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  2. Cycle Pattern
                </span>
                <div className="text-xs font-bold text-slate-900">
                  Irregular / Oligomenorrhea (35–45 day intervals)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Last period: 03 Nov 2026 • Current: Day 18 (Luteal Phase)
                </div>
              </div>

              {/* Question 3: Main Symptoms */}
              <div className="p-3.5 rounded-2xl bg-[#F4F6F2] border border-slate-200/70 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  3. Primary Symptoms Affecting You
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-pastel-peach text-pastel-peachText text-[11px] font-semibold px-2.5 py-0.5">
                    🍬 Sugar Cravings
                  </span>
                  <span className="rounded-full bg-pastel-peach text-pastel-peachText text-[11px] font-semibold px-2.5 py-0.5">
                    🥱 Afternoon Fatigue
                  </span>
                  <span className="rounded-full bg-pastel-peach text-pastel-peachText text-[11px] font-semibold px-2.5 py-0.5">
                    ✨ Chin Hormonal Acne
                  </span>
                  <span className="rounded-full bg-pastel-peach text-pastel-peachText text-[11px] font-semibold px-2.5 py-0.5">
                    💨 Post-Meal Bloating
                  </span>
                </div>
              </div>

              {/* Question 4: Diet & Regional Cuisine */}
              <div className="p-3.5 rounded-2xl bg-[#F4F6F2] border border-slate-200/70 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  4. Diet Type &amp; Regional Cuisine
                </span>
                <div className="text-xs font-bold text-slate-900">
                  Vegetarian • South Indian &amp; North Indian
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Staples: Ragi, Jowar, Besan, Moong dal, Paneer, Rice, Vegetables
                </div>
              </div>

              {/* Question 5: Activity Level */}
              <div className="p-3.5 rounded-2xl bg-[#F4F6F2] border border-slate-200/70 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  5. Activity Level
                </span>
                <div className="text-xs font-bold text-slate-900">
                  Light to Moderate (Daily 30-min brisk walk + 2x weekly bodyweight strength)
                </div>
              </div>

              {/* Question 6: Family History */}
              <div className="p-3.5 rounded-2xl bg-[#F4F6F2] border border-slate-200/70 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  6. Family Medical History (Used for Screening Reminders)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-pastel-blue text-pastel-blueText text-[11px] font-semibold px-2.5 py-0.5">
                    Paternal Type 2 Diabetes (Father)
                  </span>
                  <span className="rounded-full bg-pastel-blue text-pastel-blueText text-[11px] font-semibold px-2.5 py-0.5">
                    Maternal Hypothyroidism (Mother)
                  </span>
                  <span className="rounded-full bg-pastel-blue text-pastel-blueText text-[11px] font-semibold px-2.5 py-0.5">
                    Ischemic Heart Disease (Paternal Grandfather)
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: CALIBRATION ENGINE (HOW RITU PERSONALISES) */}
      {activeTab === 'calibration' && (
        <div className="space-y-4">
          <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-forest text-white px-2.5 py-0.5 text-[10px] font-bold">
                ⚖️ Calibration Engine
              </span>
              <span className="text-xs text-slate-500 font-semibold">Doctor Rules vs. AI Learning</span>
            </div>

            <h2 className="font-heading text-lg font-bold text-slate-900 mt-2">
              How Ritu Personalises
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The doctor’s rule always wins. The AI fine-tunes within those limits and suggests trials for doctor approval.
            </p>

            {/* Side-by-Side: Doctor Rules vs Learned Insights */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Left Column: Doctor's Fixed Limits */}
              <div className="p-4 rounded-3xl bg-forest-light/30 border border-forest/20">
                <div className="flex items-center gap-1.5 mb-2">
                  <Lock className="w-4 h-4 text-forest" />
                  <span className="font-heading font-bold text-xs text-forest uppercase tracking-wider">
                    Doctor&apos;s Rules (Fixed Limits)
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mb-3">
                  AI never overrides or relaxes these instructions.
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-2xl bg-white border border-slate-200">
                    <span className="rounded-full bg-forest text-white text-[9px] font-bold px-2 py-0.5">
                      Doctor&apos;s rule
                    </span>
                    <div className="font-bold text-slate-900 mt-1">Avoid Gluten &amp; Maida</div>
                    <div className="text-[10px] text-slate-500">Dr. Ananya Sen (OB/GYN)</div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white border border-slate-200">
                    <span className="rounded-full bg-forest text-white text-[9px] font-bold px-2 py-0.5">
                      Doctor&apos;s rule
                    </span>
                    <div className="font-bold text-slate-900 mt-1">Thyronorm 25mcg on Empty Stomach</div>
                    <div className="text-[10px] text-slate-500">Dr. Ramesh Gupta (Endo)</div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white border border-slate-200">
                    <span className="rounded-full bg-forest text-white text-[9px] font-bold px-2 py-0.5">
                      Doctor&apos;s rule
                    </span>
                    <div className="font-bold text-slate-900 mt-1">Fasting Insulin Target &lt; 10 µIU/mL</div>
                    <div className="text-[10px] text-slate-500">Clinical goal set Oct 2026</div>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Learned Insights */}
              <div className="p-4 rounded-3xl bg-pastel-purple/30 border border-purple-200">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  <span className="font-heading font-bold text-xs text-purple-900 uppercase tracking-wider">
                    Learned from You (Fine-Tuning)
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mb-3">
                  Fine-tuned inside doctor limits based on your logs.
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-2xl bg-white border border-slate-200">
                    <span className="rounded-full bg-pastel-purple text-pastel-purpleText text-[9px] font-bold px-2 py-0.5">
                      Learned: 42 logs
                    </span>
                    <div className="font-bold text-slate-900 mt-1">Fermented Millets produce 0 bloating</div>
                    <div className="text-[10px] text-slate-500">Post-meal check-in confidence: 94%</div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white border border-slate-200">
                    <span className="rounded-full bg-pastel-purple text-pastel-purpleText text-[9px] font-bold px-2 py-0.5">
                      Learned: 28 days
                    </span>
                    <div className="font-bold text-slate-900 mt-1">Morning walks lower evening cravings by 40%</div>
                    <div className="text-[10px] text-slate-500">Pearson r = -0.62 correlation</div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white border border-slate-200">
                    <span className="rounded-full bg-pastel-yellow text-pastel-yellowText text-[9px] font-bold px-2 py-0.5">
                      Still learning: 6 days
                    </span>
                    <div className="font-bold text-slate-900 mt-1">Spearmint tea impact on hirsutism</div>
                    <div className="text-[10px] text-slate-500">Needs 14 days baseline before verdict</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conflict Alert Banner */}
            <div className="mt-4 p-4 rounded-3xl bg-pastel-yellow/60 border border-amber-300 text-xs text-amber-950">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  Clinical Advice Conflict Alert
                </span>
                <span className="text-[10px] font-bold bg-amber-200 px-2 py-0.5 rounded-full">
                  Doctor Rule Wins
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed">
                Dietician suggested 16-hour intermittent fasting, but Endocrinologist Dr. Gupta instructed regular morning food with Metformin to prevent gastric irritation. <strong>Ritu automatically prioritized Dr. Gupta&apos;s rule.</strong>
              </p>
            </div>

            {/* AI Suggestion Awaiting Approval */}
            <div className="mt-4 p-4 rounded-3xl bg-[#F4F6F2] border border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">AI Suggestion Awaiting Doctor Approval:</span>
                <span className="text-[10px] text-forest font-bold bg-sage-light px-2 py-0.5 rounded-full">
                  Sent to Dr. Sen
                </span>
              </div>
              <p className="text-slate-600 text-[11px] mt-1">
                &ldquo;Bloating after A1 dairy in 5 of 6 logged meals — initiate a 21-day dairy elimination trial?&rdquo;
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: SMART CART AGENT */}
      {activeTab === 'cart' && (
        <div className="space-y-4">
          <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-pastel-yellow px-2.5 py-0.5 text-[10px] font-bold text-pastel-yellowText">
                <ShoppingCart className="w-3 h-3" /> Smart Cart Agent (With Permission)
              </span>
              <span className="text-xs text-slate-500 font-semibold">Private &amp; Opt-In</span>
            </div>

            <h2 className="font-heading text-lg font-bold text-slate-900 mt-2">
              Automated Grocery Health Swaps
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Allow Ritu to inspect your Zepto, Blinkit, or Instamart cart and suggest healthier Indian swaps aligned with Dr. Sen’s rules.
            </p>

            {/* Master Permission Toggle */}
            <div className="mt-4 p-4 rounded-3xl bg-[#F4F6F2] border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Allow Ritu to view your grocery carts
                </div>
                <div className="text-[11px] text-slate-500">
                  Never orders or charges without your explicit confirmation.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSmartCartEnabled(!smartCartEnabled)}
                className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                  smartCartEnabled ? 'bg-forest justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {smartCartEnabled && (
              <div className="mt-4 space-y-4">
                {/* 3 Help Levels */}
                <div>
                  <div className="text-xs font-bold text-slate-800 mb-2">Select Help Level:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      {
                        id: 'suggest',
                        title: '1. Suggest Only',
                        desc: 'Shows recommendations. You make any changes yourself.',
                      },
                      {
                        id: 'swap',
                        title: '2. Swap with Approval',
                        desc: 'Ritu asks before replacing each flagged item.',
                      },
                      {
                        id: 'autobuild',
                        title: '3. Auto-Build',
                        desc: 'Ritu drafts a weekly healthy basket for your review.',
                      },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setCartHelpLevel(lvl.id as any)}
                        className={`p-3 rounded-2xl border text-left transition ${
                          cartHelpLevel === lvl.id
                            ? 'border-forest bg-sage-light/40 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">{lvl.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{lvl.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Shopping Simulation / Phone Notification Preview */}
                <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-soft">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>LIVE NOTIFICATION PREVIEW</span>
                    <span>Zepto · Just now</span>
                  </div>
                  <div className="text-xs font-bold text-sage-light">
                    &ldquo;This may not suit your insulin resistance: Haldiram Aloo Bhujia&rdquo;
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Contains refined palm oil and trans fats. Swap with <strong>Roasted Foxnuts (Makhana) with rock salt</strong> from the same store?
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="forest" size="sm" className="rounded-full text-[11px] py-1 bg-forest hover:bg-forest/90">
                      Yes, Swap Pick
                    </Button>
                    <button type="button" className="text-[11px] text-slate-400 hover:text-white px-2">
                      Dismiss
                    </button>
                  </div>
                </div>

                {/* Transparency & Safety Guarantee */}
                <div className="p-3.5 rounded-2xl bg-pastel-mint/30 border border-emerald-200 text-xs text-emerald-950">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Ritu Smart Cart Safety Guarantee</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 mt-0.5">
                    • Ritu never pays or places an order without your final &quot;Yes, order&quot; confirmation.<br />
                    • Your grocery history is never sold to FMCG brands or food advertisers.<br />
                    • Pause, unlink, or delete your cart history in one tap.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 4: DPDP PRIVACY & DATA EXPORT */}
      {activeTab === 'privacy' && (
        <div className="space-y-4">
          <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              India DPDP Act 2023 Consent &amp; Privacy
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Granular consent by default. You control exactly who sees what.
            </p>

            <div className="mt-4 space-y-3">
              {/* Toggle 1: Core App */}
              <div className="p-3.5 rounded-2xl bg-[#F4F6F2] border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Core Health Analytics</div>
                  <div className="text-[11px] text-slate-500">Required to compute cycles, HOMA-IR &amp; N-of-1 trial statistics</div>
                </div>
                <button
                  type="button"
                  onClick={() => setConsentCore(!consentCore)}
                  className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                    consentCore ? 'bg-forest justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white" />
                </button>
              </div>

              {/* Toggle 2: Doctor Sharing */}
              <div className="p-3.5 rounded-2xl bg-[#F4F6F2] border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Share with Care Team Specialists</div>
                  <div className="text-[11px] text-slate-500">Allows Dr. Sen &amp; Dr. Gupta to review visit summaries before consults</div>
                </div>
                <button
                  type="button"
                  onClick={() => setConsentDoctor(!consentDoctor)}
                  className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                    consentDoctor ? 'bg-forest justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white" />
                </button>
              </div>

              {/* Toggle 3: Anonymized Research */}
              <div className="p-3.5 rounded-2xl bg-[#F4F6F2] border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Anonymized Population Priors Research</div>
                  <div className="text-[11px] text-slate-500">Contributes de-identified N-of-1 outcomes to improve Indian PCOS prior distributions</div>
                </div>
                <button
                  type="button"
                  onClick={() => setConsentResearch(!consentResearch)}
                  className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                    consentResearch ? 'bg-forest justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white" />
                </button>
              </div>
            </div>

            {/* Data Portability (Download JSON) */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Export All Medical Records</div>
                <div className="text-[11px] text-slate-500">Download complete structured JSON of your cycles, labs &amp; trials</div>
              </div>
              <Button
                type="button"
                variant="forest"
                size="sm"
                onClick={handleExportData}
                className="rounded-full text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                {downloadSuccess ? 'Downloaded!' : 'Export (JSON)'}
              </Button>
            </div>

            {/* Delete Account */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-coral">Delete Account &amp; Medical Data</div>
                <div className="text-[11px] text-slate-400">Permanently erase all profile and check-in records</div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => alert('Account erasure requested. All medical records de-indexed.')}
                className="rounded-full text-xs text-coral hover:bg-rose-50 border-coral/30"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}

      <DisclaimerBanner type="wellness" />
    </div>
  );
}
