'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePersona } from '@/components/persona-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
  User,
  Heart,
  Sparkles,
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
    const exportPayload = {
      exportTimestamp: new Date().toISOString(),
      patient: {
        name: 'Priya Sharma',
        age: 26,
        city: 'Hyderabad',
        diagnosisStatus: 'diagnosed',
        estimatedPhenotype: 'Phenotype_B',
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
          code: 'morning_walk',
          name: 'Morning 30-min brisk walk',
          day: 18,
          totalDays: 42,
          adherence: 0.88,
        },
      ],
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `priya_sharma_pcos_health_record_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header in Forest Green */}
      <div className="rounded-4xl bg-forest p-6 text-white text-center shadow-soft relative overflow-hidden">
        <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-3 py-1 text-xs font-semibold text-sage-light">
          <SettingsIcon className="w-3.5 h-3.5 text-sage" />
          Settings &amp; Data Governance
        </span>
        <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Profile &amp; DPDP Consent
        </h1>
        <p className="mt-1 text-xs text-sage-light max-w-md mx-auto">
          Manage your active role, download your encrypted health record, and control data privacy toggles under India&apos;s DPDP Act 2023.
        </p>
      </div>

      {/* Active Persona Switcher Card */}
      <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Active Evaluation Persona
            </h3>
            <p className="text-xs text-slate-500">
              Switch roles directly without credentials to evaluate different workflows:
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${currentPersona.badgeClass}`}>
            Active: {currentPersona.badge}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {allPersonas.map((p) => {
            const isSelected = p.type === currentPersona.type;
            return (
              <button
                key={p.type}
                type="button"
                onClick={() => setPersonaType(p.type)}
                className={`flex flex-col justify-between rounded-3xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? 'border-forest bg-sage-light/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xs font-bold text-slate-900">{p.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${p.badgeClass}`}>
                    {p.badge}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500 leading-snug">{p.description}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* DPDP 2023 Granular Consent Toggles Card */}
      <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-forest" />
            <h3 className="font-heading text-base font-bold text-slate-900">
              DPDP Act 2023 Consent Management
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            You maintain 100% data ownership. Toggle granular permissions anytime:
          </p>
        </div>

        <div className="space-y-3">
          {/* Toggle 1 */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F6F2]">
            <div>
              <div className="text-xs font-bold text-slate-900 font-heading">1. Core App &amp; N-of-1 Bayesian Computation</div>
              <div className="text-[11px] text-slate-500">Calculate cycle adjustments and personal treatment effect estimates</div>
            </div>
            <input
              type="checkbox"
              checked={consentCore}
              onChange={(e) => setConsentCore(e.target.checked)}
              className="h-4 w-4 accent-forest rounded cursor-pointer"
            />
          </div>

          {/* Toggle 2 */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F6F2]">
            <div>
              <div className="text-xs font-bold text-slate-900 font-heading">2. Doctor Clinical Handoff Sharing</div>
              <div className="text-[11px] text-slate-500">Allow Dr. Ananya Sen to review 1-page pre-consult summaries &amp; approve trials</div>
            </div>
            <input
              type="checkbox"
              checked={consentDoctor}
              onChange={(e) => setConsentDoctor(e.target.checked)}
              className="h-4 w-4 accent-forest rounded cursor-pointer"
            />
          </div>

          {/* Toggle 3 */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F6F2]">
            <div>
              <div className="text-xs font-bold text-slate-900 font-heading">3. De-Identified Research Pooling (Empirical Bayes)</div>
              <div className="text-[11px] text-slate-500">Contribute anonymized trial variances to update population priors for your phenotype</div>
            </div>
            <input
              type="checkbox"
              checked={consentResearch}
              onChange={(e) => setConsentResearch(e.target.checked)}
              className="h-4 w-4 accent-forest rounded cursor-pointer"
            />
          </div>
        </div>

        <Button
          type="button"
          variant="forest"
          size="sm"
          onClick={handleSaveConsent}
          className="text-xs"
        >
          Save Consent Preferences
        </Button>

        {consentSaved && (
          <div className="flex items-center gap-2 rounded-2xl bg-pastel-mint p-3 text-xs font-semibold text-pastel-mintText">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Consent preferences securely timestamped under DPDP rules.</span>
          </div>
        )}
      </Card>

      {/* Data Export Card */}
      <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-3">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">
            Export My Health Record (JSON)
          </h3>
          <p className="text-xs text-slate-500">
            Download your complete history (60 days check-ins, lab values, and Bayesian results) in portable JSON format.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExportDataJson}
          className="text-xs gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Download JSON Health Record
        </Button>
      </Card>

      <DisclaimerBanner type="wellness" />
    </div>
  );
}
