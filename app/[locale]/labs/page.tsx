'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  // OCR Extraction Review State
  const [isProcessingOcr, setIsProcessingOcr] = useState<boolean>(false);
  const [extractedReport, setExtractedReport] = useState<ExtractedLabReport | null>(null);
  const [selectedSample, setSelectedSample] = useState<string>('sample1');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Booking Flow State
  const [selectedLab, setSelectedLab] = useState<string>('thyrocare');
  const [bookingDate, setBookingDate] = useState<string>('2026-03-02');
  const [timeSlot, setTimeSlot] = useState<string>('07:30 AM - 08:30 AM (Fasting)');
  const [patientAddress, setPatientAddress] = useState<string>('Flat 402, Green Meadows, Banjara Hills, Hyderabad');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  // Scheduled Test Rules
  const scheduledTests = scheduleDiagnosticTests({
    hasBaselineLabsInLast6Months: true,
    isInsulinResistant: true,
    activeExperimentCode: 'Myo-Inositol',
    activeExperimentDaysRemaining: 24,
    hasVitaminDDeficiency: true,
  });

  const handleRunSampleOcr = async (sampleId: string) => {
    setSelectedSample(sampleId);
    setIsProcessingOcr(true);
    setSaveSuccess(false);
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

  const handleConfirmAndSaveResults = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
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
              VISION OCR &amp; NORMALIZATION
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-300">
            {t('subtitle')}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab('upload')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-rose-700 shadow-xs dark:bg-slate-900 dark:text-rose-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            Upload &amp; AI Extraction
          </button>
          <button
            onClick={() => setActiveTab('book')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'book'
                ? 'bg-white text-rose-700 shadow-xs dark:bg-slate-900 dark:text-rose-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            Book Partner Lab (₹)
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'schedule'
                ? 'bg-white text-rose-700 shadow-xs dark:bg-slate-900 dark:text-rose-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            Retest Schedule
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 shadow-xs dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Verified Lab Values Saved to Profile!</span> HOMA-IR has been recalculated, and your doctor pre-consult brief is automatically synchronized.
          </div>
        </div>
      )}

      {/* Tab 1: Upload & Extraction Review */}
      {activeTab === 'upload' && (
        <div className="mt-6 space-y-6">
          {/* Sample Picker (For Live 3-Minute Presentation Demo) */}
          <Card className="border-rose-100 shadow-sm dark:border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rose-600" />
                <CardTitle className="text-base">{t('demoSamples')}</CardTitle>
              </div>
              <CardDescription>
                Test the vision AI extraction with these preloaded diagnostic reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => handleRunSampleOcr('sample1')}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    selectedSample === 'sample1'
                      ? 'border-rose-300 bg-rose-50/70 shadow-xs dark:border-rose-800 dark:bg-rose-950/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {t('sampleReport1')}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Fasting Glucose, Fasting Insulin, HOMA-IR, HbA1c
                  </p>
                  <div className="mt-2 text-[10px] text-rose-600 font-semibold">
                    Thyrocare Technologies
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRunSampleOcr('sample2_hormone')}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    selectedSample.includes('sample2')
                      ? 'border-rose-300 bg-rose-50/70 shadow-xs dark:border-rose-800 dark:bg-rose-950/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {t('sampleReport2')}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    AMH, Total Testosterone, LH, FSH, Prolactin
                  </p>
                  <div className="mt-2 text-[10px] text-blue-600 font-semibold">
                    Dr Lal PathLabs
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRunSampleOcr('sample3_thyroid')}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    selectedSample.includes('sample3')
                      ? 'border-rose-300 bg-rose-50/70 shadow-xs dark:border-rose-800 dark:bg-rose-950/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {t('sampleReport3')}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    TSH, Vitamin D3, B12, Ferritin, Hemoglobin
                  </p>
                  <div className="mt-2 text-[10px] text-teal-600 font-semibold">
                    Metropolis Healthcare
                  </div>
                </button>
              </div>

              {/* Upload Dropzone */}
              <div className="mt-4 rounded-xl border-2 border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                <h4 className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  Drag &amp; drop a blood report PDF or camera photo
                </h4>
                <p className="mt-1 text-[11px] text-slate-400">
                  Accepts PDF, JPG, PNG up to 10MB • AES-256-GCM encrypted in transit
                </p>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRunSampleOcr('sample1')}
                    className="text-xs"
                  >
                    Select File from Device
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Extraction Review Table (Human in the Loop) */}
          {extractedReport && (
            <Card className="border-teal-200 shadow-sm dark:border-teal-900/60">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    <CardTitle className="text-base">{t('reviewTitle')}</CardTitle>
                  </div>
                  <Badge variant="teal">Extraction Complete (Zod Validated)</Badge>
                </div>
                <CardDescription>
                  Lab: <span className="font-semibold text-slate-800 dark:text-slate-200">{extractedReport.labName}</span> • Sample Date: {extractedReport.sampleDate}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        <th className="py-2.5 px-3">Test Name</th>
                        <th className="py-2.5 px-3">Canonical ID</th>
                        <th className="py-2.5 px-3">Observed Value</th>
                        <th className="py-2.5 px-3">Reference Range</th>
                        <th className="py-2.5 px-3">Confidence</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {extractedReport.results.map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                            {r.testName}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                            {r.canonicalName}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {r.value} {r.unit}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">
                            {r.referenceRange || 'N/A'}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {Math.round(r.confidence * 100)}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <Badge variant={r.isAbnormal ? 'destructive' : 'success'} className="text-[10px]">
                              {r.isAbnormal ? 'Abnormal' : 'Normal'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    Review completed. Confirm to commit to clinical database.
                  </span>
                  <Button variant="teal" size="sm" onClick={handleConfirmAndSaveResults} className="gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4" />
                    {t('saveResults')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tab 2: Book Partner Lab (Mock Flow) */}
      {activeTab === 'book' && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PARTNER_LABS.map((lab) => (
              <Card
                key={lab.id}
                className={`flex flex-col justify-between border transition-all ${
                  selectedLab === lab.id
                    ? 'border-rose-400 bg-rose-50/20 shadow-md dark:border-rose-800 dark:bg-rose-950/20'
                    : 'border-slate-200 shadow-xs hover:border-slate-300 dark:border-slate-800'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="pcos">{lab.discount}</Badge>
                    <span className="text-xs text-slate-500 font-semibold">★ {lab.rating}</span>
                  </div>
                  <CardTitle className="text-base">{lab.name}</CardTitle>
                  <CardDescription className="text-xs">{lab.city}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    <span className="font-semibold">Featured Panel: </span>
                    {lab.popularTest}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Home className="h-3.5 w-3.5 text-teal-600" /> Free Home Collection
                    </span>
                    <span className="text-slate-500">TAT: {lab.turnaround}</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      ₹{lab.priceINR}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{lab.originalPrice}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  <Button
                    variant={selectedLab === lab.id ? 'pcos' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedLab(lab.id);
                      setBookingConfirmed(false);
                    }}
                    className="w-full text-xs"
                  >
                    {selectedLab === lab.id ? 'Selected Lab' : 'Select This Lab'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Booking Confirmation Box */}
          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Schedule Home Blood Collection</CardTitle>
              <CardDescription>A certified phlebotomist visits your doorstep at the chosen fasting slot.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="bDate">Collection Date</Label>
                  <Input
                    id="bDate"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="bSlot">Preferred Time Slot (12h Fasting)</Label>
                  <select
                    id="bSlot"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="06:30 AM - 07:30 AM">06:30 AM - 07:30 AM (Fasting)</option>
                    <option value="07:30 AM - 08:30 AM">07:30 AM - 08:30 AM (Fasting)</option>
                    <option value="08:30 AM - 09:30 AM">08:30 AM - 09:30 AM (Fasting)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="bAddress">Collection Address</Label>
                  <Input
                    id="bAddress"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              {bookingConfirmed ? (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span className="font-bold text-sm">Booking Confirmed! (Demo Booking Ref: #THY-9021)</span>
                    </div>
                    {/* Simulated Results Button for Demo Presentation */}
                    <Button
                      variant="teal"
                      size="sm"
                      onClick={() => handleRunSampleOcr('sample1')}
                      className="gap-1.5 text-xs font-bold"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Simulate Results
                    </Button>
                  </div>
                  <p className="mt-1.5 text-xs text-emerald-800 dark:text-emerald-300">
                    Phlebotomist assigned for {bookingDate} at {timeSlot}. Click &quot;Simulate Results&quot; to test instant OCR ingestion into your health profile.
                  </p>
                </div>
              ) : (
                <div className="flex justify-end pt-2">
                  <Button variant="pcos" onClick={() => setBookingConfirmed(true)} className="gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm Booking (Demo Payment ₹1,299)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Retest Schedule */}
      {activeTab === 'schedule' && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <span className="font-bold">Deterministic Clinical Rule Schedule:</span> Recommendations are calculated based on your Rotterdam Phenotype, previous abnormal lab intervals, and active N-of-1 trial endpoints.
          </div>

          <div className="space-y-3">
            {scheduledTests.map((tItem, idx) => (
              <Card key={idx} className="border-slate-200 shadow-2xs dark:border-slate-800">
                <CardContent className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {tItem.testName}
                      </span>
                      <Badge variant={tItem.urgency === 'urgent' ? 'destructive' : 'outline'} className="text-[10px]">
                        Due in {tItem.dueWithinDays} Days
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{tItem.reason}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      ₹{tItem.estimatedCostINR}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('book')} className="text-xs">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="mt-8">
        <DisclaimerBanner type="wellness" />
      </div>
    </div>
  );
}
