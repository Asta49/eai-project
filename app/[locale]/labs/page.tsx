'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import type { ExtractedLabReport } from '@/lib/ai/lab-extractor';
import { scheduleDiagnosticTests } from '@/lib/engine/test-scheduler';
import {
  FileSpreadsheet,
  Upload,
  Sparkles,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Calendar,
  AlertCircle,
  Eye,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';

const PARTNER_LABS = [
  {
    id: 'thyrocare',
    name: 'Thyrocare Laboratories',
    city: 'Hyderabad, Mumbai, Delhi, Bengaluru, Chennai',
    rating: 4.8,
    homeCollection: true,
    turnaround: '24 Hours',
    priceINR: 1299,
    originalPrice: 1799,
    discount: '25% OFF',
    popularTest: 'PCOS Comprehensive Metabolic Panel (Fasting Insulin + HOMA-IR + AMH)',
  },
  {
    id: 'lal_pathlabs',
    name: 'Dr Lal PathLabs',
    city: 'Delhi NCR, Jaipur, Lucknow, Ahmedabad, Kolkata',
    rating: 4.9,
    homeCollection: true,
    turnaround: '20 Hours',
    priceINR: 1450,
    originalPrice: 1850,
    discount: '20% OFF',
    popularTest: 'Reproductive Hormone Day 3 Profile (LH, FSH, Free Testosterone)',
  },
  {
    id: 'metropolis',
    name: 'Metropolis Healthcare',
    city: 'Mumbai, Pune, Bengaluru, Chennai, Surat',
    rating: 4.7,
    homeCollection: true,
    turnaround: '24 Hours',
    priceINR: 1399,
    originalPrice: 1750,
    discount: '20% OFF',
    popularTest: 'Complete Micronutrient & Thyroid Panel (Vit D, B12, TSH, Ferritin)',
  },
];

export default function LabsPage() {
  const t = useTranslations('labs');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'en' | 'hi' | 'te' | 'ta';

  const [activeTab, setActiveTab] = useState<'upload' | 'book' | 'schedule'>('upload');
  const [isProcessingOcr, setIsProcessingOcr] = useState<boolean>(false);
  const [extractedReport, setExtractedReport] = useState<ExtractedLabReport | null>(null);
  const [selectedSample, setSelectedSample] = useState<string>('sample1');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Booking Flow State
  const [selectedLab, setSelectedLab] = useState<string>('thyrocare');
  const [bookedSuccess, setBookedSuccess] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('Flat 402, Banjara Hills Road No. 12, Hyderabad - 500034');
  const [slot, setSlot] = useState<string>('Tomorrow, 07:30 AM (Fasting Sample)');

  // Deterministic Scheduled Tests
  const scheduledTests = scheduleDiagnosticTests({
    hasBaselineLabsInLast6Months: false,
    isInsulinResistant: true,
    activeExperimentCode: 'myo_inositol',
    activeExperimentDaysRemaining: 24,
    hasVitaminDDeficiency: true,
  });

  const handleRunOcr = async (sampleId: string) => {
    setSelectedSample(sampleId);
    setIsProcessingOcr(true);
    try {
      const response = await fetch('/api/labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleId, locale }),
      });
      const res = await response.json();
      if (res.data) {
        setExtractedReport(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingOcr(false);
    }
  };

  const handleSimulateResults = () => {
    handleRunOcr('sample1');
    setBookedSuccess(false);
    setActiveTab('upload');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Card in Forest Green */}
      <div className="rounded-4xl bg-forest p-6 text-white text-center shadow-soft relative overflow-hidden">
        <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-3 py-1 text-xs font-semibold text-sage-light">
          <FileSpreadsheet className="w-3.5 h-3.5 text-sage" />
          Vision OCR &amp; Diagnostic Integrations
        </span>
        <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Lab Reports &amp; Biomarkers
        </h1>
        <p className="mt-1 text-xs text-sage-light max-w-md mx-auto">
          Extract unstructured blood test PDFs/photos with Zod validation, book partner labs with home collection, and track insulin sensitivity.
        </p>

        {/* Tab Switcher */}
        <div className="mt-4 inline-flex rounded-full bg-forest-dark/80 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`rounded-full px-4 py-1.5 transition-all ${
              activeTab === 'upload' ? 'bg-white text-forest shadow-xs font-bold' : 'text-sage-light'
            }`}
          >
            Vision OCR Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('book')}
            className={`rounded-full px-4 py-1.5 transition-all ${
              activeTab === 'book' ? 'bg-white text-forest shadow-xs font-bold' : 'text-sage-light'
            }`}
          >
            Book Partner Lab
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`rounded-full px-4 py-1.5 transition-all ${
              activeTab === 'schedule' ? 'bg-white text-forest shadow-xs font-bold' : 'text-sage-light'
            }`}
          >
            Test Schedule
          </button>
        </div>
      </div>

      {/* Tab 1: Vision OCR Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          {/* Sample Selectors Card */}
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1-Click Demo Report Samples
              </span>
              <span className="text-[10px] text-forest font-semibold">
                No upload needed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRunOcr('sample1')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedSample === 'sample1'
                    ? 'border-forest bg-sage-light/70 shadow-xs'
                    : 'border-slate-200 bg-[#F4F6F2] hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold font-heading text-slate-900">
                  Sample 1: Metabolic Panel
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Fasting Glucose, Insulin &amp; HOMA-IR
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRunOcr('sample2')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedSample === 'sample2'
                    ? 'border-forest bg-sage-light/70 shadow-xs'
                    : 'border-slate-200 bg-[#F4F6F2] hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold font-heading text-slate-900">
                  Sample 2: Hormone Panel
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  LH, FSH, Testosterone &amp; AMH
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRunOcr('sample3')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedSample === 'sample3'
                    ? 'border-forest bg-sage-light/70 shadow-xs'
                    : 'border-slate-200 bg-[#F4F6F2] hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold font-heading text-slate-900">
                  Sample 3: Micronutrients
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Vitamin D 25-OH &amp; TSH
                </div>
              </button>
            </div>
          </Card>

          {/* Loading Indicator */}
          {isProcessingOcr && (
            <Card className="rounded-4xl p-6 border-slate-200/80 bg-white shadow-card text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-forest border-t-transparent" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Running Vision AI OCR &amp; Canonical Normalization...
              </h3>
              <p className="text-xs text-slate-500">
                Validating units and extracting reference ranges with Zod schema.
              </p>
            </Card>
          )}

          {/* Extracted Biomarkers Review Card */}
          {extractedReport && !isProcessingOcr && (
            <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-base font-bold text-slate-900">
                      {extractedReport.labName}
                    </span>
                    <span className="rounded-full bg-pastel-mint px-2 py-0.2 text-[9px] font-bold text-pastel-mintText">
                      Verified
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Sample Date: {extractedReport.sampleDate}</span>
                </div>
                <Button
                  type="button"
                  variant="forest"
                  size="sm"
                  onClick={() => {
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                  }}
                  className="text-xs"
                >
                  Save to Health Profile
                </Button>
              </div>

              {/* Biomarkers Grid */}
              <div className="space-y-2.5">
                {extractedReport.results.map((res, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F6F2] border border-slate-200/60"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading text-xs font-bold text-slate-900">
                          {res.testName}
                        </span>
                        {res.isAbnormal && (
                          <span className="rounded-full bg-pastel-peach px-2 py-0.2 text-[9px] font-bold text-pastel-peachText">
                            Out of Range
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Ref: {res.referenceRange || 'Standard adult'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-heading text-sm font-extrabold text-forest">
                        {res.value} {res.unit}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        Confidence: {(res.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {saveSuccess && (
            <div className="flex items-center gap-2 rounded-3xl bg-pastel-mint p-4 text-xs font-semibold text-pastel-mintText shadow-md">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Biomarkers added to your health profile! Phenotype estimates updated.</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Book Partner Lab */}
      {activeTab === 'book' && (
        <div className="space-y-4">
          <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-4">
            <div>
              <h2 className="font-heading text-base font-bold text-slate-900">
                Partner Diagnostic Labs (Home Phlebotomy Collection)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Certified NABL accredited partner labs with cold-chain sample handling.
              </p>
            </div>

            <div className="space-y-3">
              {PARTNER_LABS.map((lab) => {
                const isSelected = selectedLab === lab.id;
                return (
                  <div
                    key={lab.id}
                    onClick={() => setSelectedLab(lab.id)}
                    className={`p-4 rounded-3xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-forest bg-sage-light/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading text-sm font-bold text-slate-900">
                            {lab.name}
                          </h4>
                          <span className="rounded-full bg-pastel-peach px-2 py-0.2 text-[9px] font-bold text-pastel-peachText">
                            {lab.discount}
                          </span>
                        </div>
                        <p className="text-xs text-forest font-semibold mt-1">
                          {lab.popularTest}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {lab.city} • Turnaround: {lab.turnaround}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-forest font-heading">
                          ₹{lab.priceINR}
                        </div>
                        <div className="text-[10px] text-slate-400 line-through">
                          ₹{lab.originalPrice}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Address & Slot */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Home Collection Address:
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-[#F4F6F2] p-2.5 text-xs text-slate-800 focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Scheduled Fasting Slot:
                </label>
                <input
                  type="text"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-[#F4F6F2] p-2.5 text-xs text-slate-800 focus:border-forest focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="forest"
              size="lg"
              onClick={() => setBookedSuccess(true)}
              className="w-full text-sm font-bold shadow-md"
            >
              Confirm Phlebotomist Home Booking (₹1,299)
            </Button>

            {bookedSuccess && (
              <div className="p-4 rounded-3xl bg-pastel-mint border border-emerald-200 text-xs text-pastel-mintText space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sample Collection Booked for Tomorrow 07:30 AM!</span>
                </div>
                <p>Thyrocare phlebotomist assigned (OTP will be sent via SMS).</p>
                <Button
                  type="button"
                  variant="forest"
                  size="sm"
                  onClick={handleSimulateResults}
                  className="w-full text-xs"
                >
                  Simulate Lab Results Arrival (Instant Demo OCR)
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab 3: Deterministic Test Schedule */}
      {activeTab === 'schedule' && (
        <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-3">
          <div>
            <h2 className="font-heading text-base font-bold text-slate-900">
              Deterministic Test Scheduling Engine
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly rules-based scheduling computed from your cycle day, phenotype, and active trial endpoints.
            </p>
          </div>

          <div className="space-y-2.5">
            {scheduledTests.map((test, index) => (
              <div
                key={index}
                className="p-3.5 rounded-3xl border border-slate-200/70 bg-[#F4F6F2] flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xs font-bold text-slate-900">
                      {test.testName}
                    </span>
                    <span className="rounded-full bg-pastel-blue px-2 py-0.2 text-[9px] font-bold text-pastel-blueText">
                      Due in {test.dueWithinDays}d
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {test.reason}
                  </p>
                </div>
                <span className="font-heading text-xs font-bold text-forest shrink-0">
                  ₹{test.estimatedCostINR}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <DisclaimerBanner type="wellness" />
    </div>
  );
}
