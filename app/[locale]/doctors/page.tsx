'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import type { PreConsultSummary } from '@/lib/ai/doctor-summary';
import {
  UserCheck,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Lock,
  FileText,
  Video,
  ShieldCheck,
  ArrowRight,
  Stethoscope,
} from 'lucide-react';

const SEEDED_DOCTORS = [
  {
    id: 'dr_ananya',
    name: 'Dr. Ananya Sen, MD (OB-GYN)',
    specialty: 'Gynaecologist & Reproductive Specialist',
    qualifications: 'MBBS, MS (OB-GYN), Fellowship in Reproductive Medicine (AIIMS)',
    experience: '14 Years Experience',
    languages: 'English, Hindi, Bengali, Telugu',
    feeINR: 900,
    rating: 4.9,
    slots: ['Today, 04:30 PM', 'Tomorrow, 11:00 AM', 'Tomorrow, 03:00 PM'],
    bio: 'Specialist in adolescent and adult PCOS, ovulatory disorders, and metabolic health.',
  },
  {
    id: 'dr_kavita',
    name: 'Dr. Kavita Rao, DM (Endocrinology)',
    specialty: 'Clinical Endocrinologist',
    qualifications: 'MBBS, MD, DM Endocrinology',
    experience: '12 Years Experience',
    languages: 'English, Telugu, Hindi',
    feeINR: 1100,
    rating: 4.8,
    slots: ['Tomorrow, 02:00 PM', 'Wed, 10:30 AM'],
    bio: 'Focuses on severe insulin resistance, metabolic syndrome, and thyroid/adrenal hormone balance.',
  },
  {
    id: 'pooja_diet',
    name: 'Pooja Makhija, MSc',
    specialty: 'Senior Clinical Dietitian',
    qualifications: 'MSc Clinical Nutrition, Certified PCOS Dietitian',
    experience: '9 Years Experience',
    languages: 'English, Hindi, Gujarati',
    feeINR: 750,
    rating: 4.9,
    slots: ['Today, 06:00 PM', 'Tomorrow, 05:00 PM'],
    bio: 'Customizes authentic Indian meals, glycemic stabilization, and fiber sequencing.',
  },
];

export default function DoctorsPage() {
  const t = useTranslations('doctors');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'en' | 'hi' | 'te' | 'ta';

  // Toggle between Patient Booking view and Doctor Clinical Portal view
  const [viewRole, setViewRole] = useState<'patient' | 'doctor'>('patient');

  // Booking Flow State
  const [selectedDoctor, setSelectedDoctor] = useState(SEEDED_DOCTORS[0]);
  const [selectedSlot, setSelectedSlot] = useState(SEEDED_DOCTORS[0].slots[0]);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);
  const [aiSummary, setAiSummary] = useState<PreConsultSummary | null>(null);

  // Doctor Portal State
  const [experimentApprovalStatus, setExperimentApprovalStatus] = useState<'approved' | 'rejected' | 'pending'>('approved');
  const [doctorNotes, setDoctorNotes] = useState<string>('Reviewed 60-day check-in history. Low-GI Indian diet showed significant energy improvement. Approved 42-day Myo-Inositol trial. Advised Vitamin D 60,000 IU weekly.');
  const [doctorNotesSaved, setDoctorNotesSaved] = useState<boolean>(false);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const response = await fetch('/api/doctors/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientData: {
            name: 'Priya Sharma',
            age: 26,
            city: 'Hyderabad',
            phenotype: 'Phenotype A (Classic / Complete)',
            bmiCategory: 'Overweight (26.0 kg/m²)',
            homaIr: 3.61,
            symptoms: ['Irregular cycles (42 days)', 'Carb cravings', 'Hormonal acne', 'Weight gain'],
            latestLabs: 'Fasting Insulin 15.6 uIU/mL, HOMA-IR 3.61, AMH 6.8 ng/mL, Total Testosterone 68.4 ng/dL, Vitamin D 14.2 ng/mL',
            experiments: 'Completed: Low-GI Indian Diet (Likely Worked, P=91%); Active: Myo-Inositol (Day 18/42)',
          },
          doctorSpecialty: selectedDoctor.specialty,
          locale,
        }),
      });
      const res = await response.json();
      if (res.data) {
        setAiSummary(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      {/* Title & Role Switcher */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              {viewRole === 'patient' ? t('title') : t('doctorDashboardTitle')}
            </h1>
            <Badge variant="pcos" className="text-[10px]">
              {viewRole === 'patient' ? 'PATIENT PORTAL' : 'SPECIALIST CLINICAL VIEW'}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-300">
            {viewRole === 'patient' ? t('subtitle') : 'Audit logged. Specialists can review patient history, approve trials, and record notes.'}
          </p>
        </div>

        {/* Role Toggle for Presentation */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setViewRole('patient')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              viewRole === 'patient'
                ? 'bg-white text-rose-700 shadow-xs dark:bg-slate-900 dark:text-rose-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            Patient Booking View
          </button>
          <button
            onClick={() => setViewRole('doctor')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              viewRole === 'doctor'
                ? 'bg-white text-rose-700 shadow-xs dark:bg-slate-900 dark:text-rose-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5" />
            Doctor Dashboard View
          </button>
        </div>
      </div>

      {/* VIEW 1: PATIENT BOOKING & AI PRE-CONSULT SUMMARY */}
      {viewRole === 'patient' && (
        <div className="mt-6 space-y-6">
          {/* Doctor Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {SEEDED_DOCTORS.map((doc) => {
              const isSelected = selectedDoctor.id === doc.id;
              return (
                <Card
                  key={doc.id}
                  className={`flex flex-col justify-between border transition-all ${
                    isSelected
                      ? 'border-rose-400 bg-rose-50/20 shadow-md dark:border-rose-800 dark:bg-rose-950/20'
                      : 'border-slate-200 shadow-xs hover:border-slate-300 dark:border-slate-800'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">★ {doc.rating} (Verified)</span>
                      <span className="text-xs font-bold text-rose-600">₹{doc.feeINR} / consult</span>
                    </div>
                    <CardTitle className="text-base">{doc.name}</CardTitle>
                    <CardDescription className="text-xs">{doc.specialty}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2 text-xs">
                    <div className="text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Languages: </span>
                      {doc.languages}
                    </div>
                    <div className="text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Experience: </span>
                      {doc.experience}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {doc.bio}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <Button
                      variant={isSelected ? 'pcos' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setSelectedSlot(doc.slots[0]);
                        setBookingConfirmed(false);
                      }}
                      className="w-full text-xs"
                    >
                      {isSelected ? 'Selected Specialist' : 'Select Specialist'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Slot Selection & Booking Confirmation */}
          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Book Video Consultation with {selectedDoctor.name}
              </CardTitle>
              <CardDescription>
                Fee: ₹{selectedDoctor.feeINR} • 15-minute 1-on-1 clinical session with AI pre-consult brief
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Select Available Slot</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedDoctor.slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        selectedSlot === slot
                          ? 'bg-rose-600 text-white font-bold'
                          : 'border bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {bookingConfirmed ? (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span className="font-bold text-sm">Appointment Confirmed! (Ref: #CONSULT-7821)</span>
                    </div>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Demo Video Call Link: https://meet.pcoscare.in/room/priya-dr-ananya (Placeholder for presentation demo)');
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
                    >
                      <Video className="h-3.5 w-3.5" /> Join Video Room
                    </a>
                  </div>
                  <p className="mt-1.5 text-xs text-emerald-800 dark:text-emerald-300">
                    Slot: {selectedSlot} with {selectedDoctor.name}. The specialist has been provided your AI Pre-Consult Brief.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary}
                    className="gap-2 text-xs"
                  >
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    {isGeneratingSummary ? tCommon('loading') : 'Generate AI Pre-Consult Brief'}
                  </Button>

                  <Button
                    variant="pcos"
                    onClick={() => setBookingConfirmed(true)}
                    className="gap-2 text-xs font-semibold"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm Appointment (Demo Pay ₹{selectedDoctor.feeINR})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Pre-Consult Brief Modal / Accordion */}
          {aiSummary && (
            <Card className="border-purple-200 bg-purple-50/20 shadow-sm dark:border-purple-900 dark:bg-purple-950/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300">
                    <FileText className="h-5 w-5" />
                    <CardTitle className="text-base">AI Pre-Consult Brief (For Doctor Review)</CardTitle>
                  </div>
                  <Badge variant="pcos">1-Page Doctor Brief</Badge>
                </div>
                <CardDescription>
                  Synthesized directly from Priya&apos;s structured Rotterdam profile, 60-day check-ins, and lab reports.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="rounded-lg bg-white p-3.5 shadow-2xs dark:bg-slate-900">
                  <h4 className="font-bold text-slate-900 dark:text-white">Patient Clinical Overview</h4>
                  <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {aiSummary.patientSummaryParagraph}
                  </p>
                </div>

                <div className="rounded-lg bg-white p-3.5 shadow-2xs dark:bg-slate-900">
                  <h4 className="font-bold text-slate-900 dark:text-white">Rotterdam Phenotype &amp; Metabolic Driver</h4>
                  <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {aiSummary.phenotypeAndEtiology}
                  </p>
                </div>

                <div className="rounded-lg bg-white p-3.5 shadow-2xs dark:bg-slate-900">
                  <h4 className="font-bold text-slate-900 dark:text-white">Key Diagnostic Biomarkers</h4>
                  <ul className="mt-1.5 list-disc space-y-1 pl-4 text-slate-600 dark:text-slate-300">
                    {aiSummary.biomarkerHighlights.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-white p-3.5 shadow-2xs dark:bg-slate-900">
                  <h4 className="font-bold text-slate-900 dark:text-white">Personal N-of-1 Experiment History</h4>
                  <ul className="mt-1.5 list-disc space-y-1 pl-4 text-slate-600 dark:text-slate-300">
                    {aiSummary.experimentHistoryHighlights.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-white p-3.5 shadow-2xs dark:bg-slate-900">
                  <h4 className="font-bold text-slate-900 dark:text-white">Patient&apos;s Prepared Questions for Doctor</h4>
                  <ul className="mt-1.5 list-disc space-y-1 pl-4 text-purple-700 dark:text-purple-300">
                    {aiSummary.keyClinicalQuestionsForDoctor.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* VIEW 2: DOCTOR CLINICAL DASHBOARD (Role: DOCTOR) */}
      {viewRole === 'doctor' && (
        <div className="mt-6 space-y-6">
          {/* Audit Log Banner */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <ShieldCheck className="h-4 w-4 text-teal-600" />
            <span>
              DPDP Audit Active: Viewing record of Priya Sharma (ID: priya_sharma_demo). Access logged under Dr. Ananya Sen.
            </span>
          </div>

          {/* Pending Experiment Approval Box */}
          <Card className="border-amber-200 bg-amber-50/20 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="warning">EXPERIMENT APPROVAL REQUEST</Badge>
                <span className="text-xs text-slate-500">Patient: Priya Sharma (26F)</span>
              </div>
              <CardTitle className="text-base">
                Myo-Inositol (2000mg BID) Trial Authorization
              </CardTitle>
              <CardDescription>
                Requires physician oversight due to concurrent Metformin screening and dosage verification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-xs">
                <p className="text-slate-700 dark:text-slate-300">
                  Patient requested a 42-day N-of-1 trial testing ovulatory regularity and insulin reduction with 40:1 Myo to D-Chiro Inositol.
                </p>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Approval Decision:</span>
                  <div className="flex gap-2">
                    <Button
                      variant={experimentApprovalStatus === 'approved' ? 'pcos' : 'outline'}
                      size="sm"
                      onClick={() => setExperimentApprovalStatus('approved')}
                      className="text-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Approve Trial
                    </Button>
                    <Button
                      variant={experimentApprovalStatus === 'rejected' ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => setExperimentApprovalStatus('rejected')}
                      className="text-xs"
                    >
                      Deny Trial
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Handoff Notes (Encrypted at Rest) */}
          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Doctor Consultation Notes</CardTitle>
                <span className="text-xs text-slate-400">Encrypted with AES-256-GCM at rest</span>
              </div>
              <CardDescription>
                Recorded in patient timeline and synchronized with her health profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                rows={4}
                value={doctorNotes}
                onChange={(e) => {
                  setDoctorNotes(e.target.value);
                  setDoctorNotesSaved(false);
                }}
                className="w-full rounded-xl border border-input bg-background p-3 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              />

              <div className="flex items-center justify-between">
                {doctorNotesSaved ? (
                  <span className="text-xs font-semibold text-emerald-600">
                    ✓ Clinical notes encrypted and saved to medical record.
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Unsaved changes</span>
                )}

                <Button
                  variant="pcos"
                  size="sm"
                  onClick={() => setDoctorNotesSaved(true)}
                  className="gap-1.5 text-xs"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Encrypt &amp; Save Notes
                </Button>
              </div>
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
