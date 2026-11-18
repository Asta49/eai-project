'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePersona } from '@/components/persona-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/language-switcher';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import {
  Settings as SettingsIcon,
  Download,
  Trash2,
  ShieldCheck,
  Bell,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { currentPersona, setPersonaType, allPersonas } = usePersona();

  // DPDP Consent state
  const [consentCore, setConsentCore] = useState(true);
  const [consentDoctor, setConsentDoctor] = useState(true);
  const [consentResearch, setConsentResearch] = useState(true);
  const [consentSaved, setConsentSaved] = useState(false);

  // Notifications state
  const [dailyCheckinReminder, setDailyCheckinReminder] = useState(true);
  const [retestAlerts, setRetestAlerts] = useState(true);

  // Delete account state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);

  const handleSaveConsent = () => {
    setConsentSaved(true);
    setTimeout(() => setConsentSaved(false), 3000);
  };

  const handleExportDataJson = () => {
    // Generate comprehensive JSON payload of Priya Sharma's health data
    const exportPayload = {
      exportTimestamp: new Date().toISOString(),
      patient: {
        name: 'Priya Sharma',
        age: 26,
        city: 'Hyderabad',
        diagnosisStatus: 'diagnosed',
        estimatedPhenotype: 'Phenotype_A',
        bmiCategory: 'overweight',
        homaIr: 3.61,
      },
      consents: {
        core_app: { granted: consentCore, timestamp: '2025-12-19T10:00:00Z' },
        doctor_sharing: { granted: consentDoctor, timestamp: '2025-12-19T10:00:00Z' },
        anonymised_research: { granted: consentResearch, timestamp: '2025-12-19T10:00:00Z' },
      },
      completedExperiments: [
        {
          code: 'low_gi_diet',
          name: 'Low-GI Indian Diet',
          durationDays: 42,
          effectEstimate: 1.15,
          standardError: 0.32,
          probBenefit: 0.91,
          verdict: 'LIKELY_WORKED',
        },
      ],
      activeExperiments: [
        {
          code: 'myo_inositol',
          name: 'Myo-Inositol',
          currentDay: 18,
          totalDays: 42,
          adherenceRate: 0.88,
        },
      ],
      latestBiomarkers: [
        { test: 'Fasting Plasma Glucose', value: 94.0, unit: 'mg/dL' },
        { test: 'Fasting Serum Insulin', value: 15.6, unit: 'microIU/mL' },
        { test: 'HOMA-IR', value: 3.61, unit: 'ratio' },
        { test: 'Total Testosterone', value: 68.4, unit: 'ng/dL' },
        { test: 'AMH', value: 6.8, unit: 'ng/mL' },
        { test: 'Vitamin D 25-OH', value: 14.2, unit: 'ng/mL' },
      ],
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pcos_health_record_priya_sharma_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    setAccountDeleted(true);
    setDeleteConfirmOpen(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {t('title')}
        </h1>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-300">
          {t('subtitle')}
        </p>
      </div>

      {/* Active Persona Switcher Card */}
      <Card className="mb-6 border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Active Profile & User Persona</CardTitle>
              <CardDescription>
                Switch roles without any login credentials to evaluate different workflows.
              </CardDescription>
            </div>
            <span className={`rounded-lg px-2.5 py-1 text-xs font-bold border ${currentPersona.badgeClass}`}>
              Active: {currentPersona.badge}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {allPersonas.map((p) => {
              const isSelected = p.type === currentPersona.type;
              return (
                <button
                  key={p.type}
                  type="button"
                  onClick={() => setPersonaType(p.type)}
                  className={`flex flex-col justify-between rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-rose-300 bg-rose-50/80 shadow-sm dark:border-rose-800 dark:bg-rose-950/40'
                      : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${p.badgeClass}`}>
                      {p.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-snug">{p.description}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {accountDeleted ? (
        <Card className="border-red-200 bg-red-50 p-6 text-center text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          <Trash2 className="mx-auto h-10 w-10 text-red-600" />
          <h3 className="mt-3 text-lg font-bold">Account Successfully Erased</h3>
          <p className="mt-1 text-xs">
            Under DPDP guidelines, all personal identifiable records, check-in histories, and lab documents have been purged from our database.
          </p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setAccountDeleted(false)}>
              Reset Demo Session
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Language & Locale */}
          <Card className="border-slate-200 shadow-xs dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('languagePref')}</CardTitle>
              <CardDescription>
                Changes all UI labels, navigation buttons, and AI coaching responses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Select your preferred language:
                </span>
                <LanguageSwitcher />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Notifications */}
          <Card className="border-slate-200 shadow-xs dark:border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-purple-600" />
                <CardTitle className="text-base">{t('notifications')}</CardTitle>
              </div>
              <CardDescription>
                Mock alerts for daily 30-second check-ins and quarterly diagnostic tests.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-100 p-3 text-xs dark:border-slate-800">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Daily Check-in Reminder (08:30 PM)
                  </span>
                  <p className="text-slate-500 text-[11px]">Keeps your N-of-1 trial adherence above 80%</p>
                </div>
                <input
                  type="checkbox"
                  checked={dailyCheckinReminder}
                  onChange={(e) => setDailyCheckinReminder(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-rose-600"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-100 p-3 text-xs dark:border-slate-800">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Biomarker Retest Alerts
                  </span>
                  <p className="text-slate-500 text-[11px]">Notifies you when scheduled tests are due</p>
                </div>
                <input
                  type="checkbox"
                  checked={retestAlerts}
                  onChange={(e) => setRetestAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-rose-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: DPDP Consent Controls */}
          <Card className="border-slate-200 shadow-xs dark:border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
                  <ShieldCheck className="h-5 w-5" />
                  <CardTitle className="text-base">{t('consentSettings')}</CardTitle>
                </div>
                <Badge variant="teal">DPDP COMPLIANT</Badge>
              </div>
              <CardDescription>
                You have the legal right under India&apos;s DPDP Act to grant or revoke consent anytime.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between rounded-lg border border-slate-100 p-3 text-xs dark:border-slate-800">
                <div className="pr-4">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Core App Analytics &amp; Personal Science
                  </span>
                  <p className="text-slate-500 text-[11px]">
                    Required to compute your Bayesian N-of-1 verdicts and track symptoms.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consentCore}
                  onChange={(e) => setConsentCore(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-rose-600"
                />
              </div>

              <div className="flex items-start justify-between rounded-lg border border-slate-100 p-3 text-xs dark:border-slate-800">
                <div className="pr-4">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Doctor Pre-Consult Profile Sharing
                  </span>
                  <p className="text-slate-500 text-[11px]">
                    Enables treating doctors to review your Rotterdam phenotype and trial history.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consentDoctor}
                  onChange={(e) => setConsentDoctor(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-rose-600"
                />
              </div>

              <div className="flex items-start justify-between rounded-lg border border-slate-100 p-3 text-xs dark:border-slate-800">
                <div className="pr-4">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Anonymized Population Research Pool
                  </span>
                  <p className="text-slate-500 text-[11px]">
                    Contributes aggregated, de-identified statistics to refine empirical Bayes priors.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consentResearch}
                  onChange={(e) => setConsentResearch(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-rose-600"
                />
              </div>

              {consentSaved && (
                <div className="text-xs font-semibold text-emerald-600">
                  ✓ Consent preferences updated and timestamped.
                </div>
              )}

              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={handleSaveConsent} className="text-xs">
                  Save Consent Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Data Portability (Export JSON) */}
          <Card className="border-slate-200 shadow-xs dark:border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-teal-600" />
                <CardTitle className="text-base">{t('exportTitle')}</CardTitle>
              </div>
              <CardDescription>{t('exportDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportDataJson}
                className="gap-2 text-xs"
              >
                <Download className="h-4 w-4" />
                {t('downloadJson')}
              </Button>
            </CardContent>
          </Card>

          {/* Section 5: Danger Zone (Delete Account) */}
          <Card className="border-red-200 bg-red-50/20 shadow-xs dark:border-red-950 dark:bg-red-950/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <CardTitle className="text-base">{t('dangerZone')}</CardTitle>
              </div>
              <CardDescription className="text-red-600/80 dark:text-red-400/80">
                {t('deleteDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deleteConfirmOpen ? (
                <div className="space-y-3 rounded-lg border border-red-300 bg-white p-3 text-xs dark:border-red-900 dark:bg-slate-900">
                  <p className="font-semibold text-red-700 dark:text-red-300">
                    Are you sure? This action is permanent and cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="destructive" size="sm" onClick={handleDeleteAccount} className="text-xs">
                      Yes, Permanently Delete My Account
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteConfirmOpen(false)} className="text-xs">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="gap-2 text-xs"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('deleteButton')}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="mt-8">
        <DisclaimerBanner type="wellness" />
      </div>
    </div>
  );
}
