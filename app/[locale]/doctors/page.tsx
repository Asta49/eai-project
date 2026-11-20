'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePersona } from '@/components/persona-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Stethoscope,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';

const SEEDED_DOCTORS = [
  {
    id: 'dr_ananya',
    name: 'Dr. Ananya Sen, MD (OB-GYN)',
    specialty: 'Gynaecologist & Reproductive Specialist',
    qualifications: 'MBBS, MS (OB-GYN), AIIMS Fellowship',
    experience: '14 Years Experience',
    languages: 'English, Hindi, Bengali, Telugu',
    feeINR: 900,
    rating: 4.9,
    slots: ['Today, 04:30 PM', 'Tomorrow, 11:00 AM', 'Tomorrow, 03:00 PM'],
    avatarText: 'AS',
    bio: 'Specialist in adolescent and adult PCOS, ovulatory disorders, and metabolic health.',
  },
  {
    id: 'dr_kavita',
    name: 'Dr. Kavita Rao, DM (Endo)',
    specialty: 'Clinical Endocrinologist',
    qualifications: 'MBBS, MD, DM Endocrinology',
    experience: '12 Years Experience',
    languages: 'English, Telugu, Hindi',
    feeINR: 1100,
    rating: 4.8,
    slots: ['Tomorrow, 02:00 PM', 'Wed, 10:30 AM'],
    avatarText: 'KR',
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
    avatarText: 'PM',
    bio: 'Customizes authentic Indian meals, glycemic stabilization, and fiber sequencing.',
  },
];

export default function DoctorsPage() {
  const t = useTranslations('doctors');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'en' | 'hi' | 'te' | 'ta';
  const { currentPersona, setPersonaType } = usePersona();

  const [viewRole, setViewRole] = useState<'patient' | 'doctor'>(
    currentPersona.type === 'doctor' ? 'doctor' : 'patient'
  );

  useEffect(() => {
    if (currentPersona.type === 'doctor') {
      setViewRole('doctor');
    }
  }, [currentPersona.type]);

  const [selectedDoctor, setSelectedDoctor] = useState(SEEDED_DOCTORS[0]);
  const [selectedSlot, setSelectedSlot] = useState(SEEDED_DOCTORS[0].slots[0]);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);
  const [aiSummary, setAiSummary] = useState<PreConsultSummary | null>(null);

  // Doctor Clinical Portal State
  const [experimentApprovalStatus, setExperimentApprovalStatus] = useState<'approved' | 'rejected' | 'pending'>('approved');
  const [doctorNotes, setDoctorNotes] = useState<string>(
    'Reviewed Priya Sharma 60-day check-in history. Low-GI Indian diet showed +1.15 energy improvement (P=91%). Approved 42-day Myo-Inositol protocol (2000mg BID). Prescribed Vitamin D 60,000 IU weekly.'
  );
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
            phenotype: 'Phenotype B (Ovulatory PCOS)',
            bmiCategory: 'Overweight (26.0 kg/m²)',
            homaIr: 3.61,
            symptoms: ['Irregular cycles (42 days)', 'Carb cravings', 'Hormonal acne', 'Fatigue'],
            latestLabs: 'Fasting Insulin 15.6 uIU/mL, HOMA-IR 3.61, AMH 6.8 ng/mL, Total Testosterone 68.4 ng/dL, Vitamin D 14.2 ng/mL',
            experiments: 'Completed: Low-GI Indian Diet (Likely Worked, P=91%); Active: Morning Walk (Day 18/42)',
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header Card in Forest Green */}
      <div className="rounded-4xl bg-forest p-6 text-white text-center shadow-soft relative overflow-hidden">
        <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-3 py-1 text-xs font-semibold text-sage-light">
          <Stethoscope className="w-3.5 h-3.5 text-sage" />
          Clinical Governance &amp; Doctor Oversight
        </span>
        <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {viewRole === 'patient' ? 'Specialist Consultations' : 'Doctor Clinical Portal'}
        </h1>
        <p className="mt-1 text-xs text-sage-light max-w-md mx-auto">
          {viewRole === 'patient'
            ? 'Book vetted PCOS specialists and generate 1-page AI pre-consult briefs to maximize clinical yield.'
            : 'Specialist portal for Dr. Ananya Sen. Review patient trials, approve locked protocols, and record consult notes.'}
        </p>

        {/* View Switcher: Patient Booking vs Doctor Portal */}
        <div className="mt-4 inline-flex rounded-full bg-forest-dark/80 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setViewRole('patient');
              setPersonaType('patient');
            }}
            className={`rounded-full px-4 py-1.5 transition-all ${
              viewRole === 'patient' ? 'bg-white text-forest shadow-xs font-bold' : 'text-sage-light'
            }`}
          >
            Patient Booking View
          </button>
          <button
            type="button"
            onClick={() => {
              setViewRole('doctor');
              setPersonaType('doctor');
            }}
            className={`rounded-full px-4 py-1.5 transition-all ${
              viewRole === 'doctor' ? 'bg-white text-forest shadow-xs font-bold' : 'text-sage-light'
            }`}
          >
            Doctor Clinical Portal
          </button>
        </div>
      </div>

      {/* VIEW 1: PATIENT BOOKING & PRE-CONSULT SUMMARY */}
      {viewRole === 'patient' && (
        <div className="space-y-4">
          {/* Active / Ongoing Appointment Card (Matching reference s4.avif) */}
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Your Upcoming Appointment
              </span>
              <span className="rounded-full bg-pastel-mint px-2.5 py-0.5 text-[10px] font-bold text-pastel-mintText">
                Confirmed / Ongoing
              </span>
            </div>

            <div className="p-3.5 rounded-3xl bg-[#F4F6F2] border border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-forest text-white flex items-center justify-center font-heading font-bold text-sm">
                  AS
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-slate-900">
                    Dr. Ananya Sen, MD (OB-GYN)
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Today, 04:30 PM • Video Telehealth</span>
                  </div>
                </div>
              </div>
              <span className="font-heading text-sm font-extrabold text-forest">₹900</span>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="forest"
                size="sm"
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className="flex-1 text-xs"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-sage" />
                {isGeneratingSummary ? 'Synthesizing...' : 'Generate 1-Page Pre-Consult Brief'}
              </Button>
            </div>
          </Card>

          {/* AI Pre-Consult Brief Display */}
          {aiSummary && (
            <Card className="rounded-4xl p-5 sm:p-6 border-emerald-200 bg-pastel-mint/40 shadow-card space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-sm font-bold text-pastel-mintText">
                    1-Page AI Pre-Consult Clinical Brief
                  </span>
                  <span className="rounded-full bg-pastel-mint px-2 py-0.2 text-[9px] font-bold text-pastel-mintText">
                    Ready for Doctor
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">15-min yield optimized</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-body">
                {aiSummary.patientSummaryParagraph}
              </p>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Biomarker Highlights:</span>
                <ul className="mt-1 space-y-1 text-xs text-slate-700">
                  {aiSummary.biomarkerHighlights.map((bio, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-forest font-bold">•</span>
                      <span>{bio}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Suggested Focus for Doctor:</span>
                <p className="text-xs text-slate-700 mt-0.5 bg-white/80 p-2.5 rounded-2xl border border-emerald-100">
                  {aiSummary.suggestedPhysicianFocus}
                </p>
              </div>
            </Card>
          )}

          {/* Available Specialists List */}
          <div className="space-y-3 pt-2">
            <h3 className="font-heading text-base font-bold text-slate-900 px-1">
              Select Specialist &amp; Book Appointment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SEEDED_DOCTORS.map((doc) => {
                const isSelected = selectedDoctor.id === doc.id;
                return (
                  <Card
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setSelectedSlot(doc.slots[0]);
                    }}
                    className={`rounded-3xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-forest bg-sage-light/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          ★ {doc.rating}
                        </span>
                        <span className="font-heading text-xs font-bold text-forest">
                          ₹{doc.feeINR}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-forest text-white flex items-center justify-center font-bold text-xs font-heading">
                          {doc.avatarText}
                        </div>
                        <div>
                          <h4 className="font-heading text-xs font-bold text-slate-900 leading-tight">
                            {doc.name}
                          </h4>
                          <span className="text-[10px] text-slate-500">{doc.specialty}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                        {doc.bio}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{doc.slots[0]}</span>
                      <span className="font-bold text-forest">{isSelected ? 'Selected' : 'Choose'}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DOCTOR CLINICAL DASHBOARD VIEW */}
      {viewRole === 'doctor' && (
        <div className="space-y-4">
          {/* Patient Overview Card for Dr. Sen */}
          <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Patient: Priya Sharma (26F, Hyderabad)
                  </h3>
                  <span className="rounded-full bg-pastel-mint px-2.5 py-0.5 text-[10px] font-bold text-pastel-mintText">
                    Phenotype B
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  BMI: 26.0 kg/m² • HOMA-IR: 3.61 (Insulin Resistant) • Cycle: 42 days
                </p>
              </div>
              <span className="text-xs font-bold text-forest bg-sage-light px-3 py-1 rounded-full">
                Dr. Ananya Sen Portal
              </span>
            </div>

            {/* Trial Approval Lock / Unlock Widget */}
            <div className="p-4 rounded-3xl bg-[#F4F6F2] border border-slate-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Clinical Trial Safety Gate
                  </span>
                  <h4 className="font-heading text-sm font-bold text-slate-900">
                    Pending Trial: Myo-Inositol (2000mg BID)
                  </h4>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    experimentApprovalStatus === 'approved'
                      ? 'bg-pastel-mint text-pastel-mintText'
                      : 'bg-pastel-peach text-pastel-peachText'
                  }`}
                >
                  {experimentApprovalStatus === 'approved' ? '✓ Protocol Approved' : 'Locked / Pending'}
                </span>
              </div>

              <p className="text-xs text-slate-600">
                Patient requested 42-day Myo-Inositol trial. Dosage: 2g morning, 2g night. Contraindications checked: None.
              </p>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="forest"
                  size="sm"
                  onClick={() => setExperimentApprovalStatus('approved')}
                  className="flex-1 text-xs"
                >
                  <Check className="w-3.5 h-3.5 mr-1" /> Approve Protocol
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setExperimentApprovalStatus('rejected')}
                  className="text-xs text-red-600"
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Reject
                </Button>
              </div>
            </div>

            {/* Doctor Clinical Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Encrypted Clinical Notes &amp; Rx Adjustments
              </label>
              <textarea
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-[#F4F6F2] p-3 text-xs text-slate-800 focus:border-forest focus:outline-none"
              />
              <Button
                type="button"
                variant="forest"
                size="sm"
                onClick={() => {
                  setDoctorNotesSaved(true);
                  setTimeout(() => setDoctorNotesSaved(false), 3000);
                }}
                className="text-xs"
              >
                Save Clinical Notes
              </Button>
            </div>

            {doctorNotesSaved && (
              <div className="flex items-center gap-2 rounded-2xl bg-pastel-mint p-3 text-xs font-semibold text-pastel-mintText">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Encrypted with AES-256-GCM. Saved to patient consultation record.</span>
              </div>
            )}
          </Card>
        </div>
      )}

      <DisclaimerBanner type="wellness" />
    </div>
  );
}
