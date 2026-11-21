'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import {
  Stethoscope,
  Share2,
  Calendar,
  FileText,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Lock,
  ChevronRight,
  Sparkles,
  Download,
  AlertCircle,
  Plus,
  Sliders,
  Send,
  Eye,
} from 'lucide-react';

interface Specialist {
  id: string;
  name: string;
  role: string;
  hospital: string;
  avatar: string;
  sharing: {
    labs: boolean;
    food: boolean;
    symptoms: boolean;
    workouts: boolean;
    meds: boolean;
  };
}

export default function CarePage() {
  const t = useTranslations('doctors');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  // Active view: Patient Care Team vs Doctor-Side View
  const [activeTab, setActiveTab] = useState<'team' | 'summary' | 'screening' | 'doctorView'>('team');

  // Care team members with granular sharing permissions
  const [specialists, setSpecialists] = useState<Specialist[]>([
    {
      id: 's1',
      name: 'Dr. Ananya Sen, MD',
      role: 'Gynecologist & PCOS Lead',
      hospital: 'Apollo Health City, Hyderabad',
      avatar: 'AS',
      sharing: { labs: true, food: true, symptoms: true, workouts: true, meds: true },
    },
    {
      id: 's2',
      name: 'Dr. Ramesh Gupta, MD',
      role: 'Endocrinologist',
      hospital: 'Yashoda Hospitals, Somajiguda',
      avatar: 'RG',
      sharing: { labs: true, food: true, symptoms: false, workouts: false, meds: true },
    },
    {
      id: 's3',
      name: 'Sneha Nair, RD',
      role: 'Clinical Dietitian (Hormonal Health)',
      hospital: 'Care Hospitals, Banjara Hills',
      avatar: 'SN',
      sharing: { labs: true, food: true, symptoms: false, workouts: true, meds: false },
    },
    {
      id: 's4',
      name: 'Priya Rao, PT',
      role: 'Women’s Physiotherapist & Trainer',
      hospital: 'ActivePelvis Studio, Hyderabad',
      avatar: 'PR',
      sharing: { labs: false, food: false, symptoms: true, workouts: true, meds: false },
    },
  ]);

  // Doctor portal states
  const [approvedTrial, setApprovedTrial] = useState<boolean>(false);
  const [newRuleInput, setNewRuleInput] = useState<string>('');
  const [doctorRules, setDoctorRules] = useState<string[]>([
    'Avoid Gluten & High Glycemic Carbs (Maida)',
    'Keep Fasting Insulin target < 10 µIU/mL',
    'Report immediately if cycle exceeds 50 days',
  ]);

  // Visit summary sharing state
  const [summaryShared, setSummaryShared] = useState<boolean>(false);

  const togglePermission = (specialistId: string, field: keyof Specialist['sharing']) => {
    setSpecialists(
      specialists.map((s) => {
        if (s.id === specialistId) {
          return {
            ...s,
            sharing: {
              ...s.sharing,
              [field]: !s.sharing[field],
            },
          };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      {/* Header */}
      <div className="rounded-4xl bg-forest p-6 text-white shadow-soft relative overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-forest-light px-2.5 py-0.5 text-[10px] font-bold text-sage-light flex items-center gap-1">
            <Stethoscope className="w-3 h-3 text-sage" />
            Care Team Coordination
          </span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-200">
            Granular DPDP Sharing
          </span>
        </div>

        <h1 className="mt-2 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Care: Coordinating Your Doctors
        </h1>
        <p className="mt-1 text-xs text-sage-light max-w-md">
          Connect your gynecologist, endocrinologist, dietician, and trainer with tailored sharing permissions.
        </p>

        {/* View Switcher Tabs */}
        <div className="mt-5 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'team', label: '🩺 Care Team & Sharing' },
            { id: 'summary', label: '📄 1-Page Visit Summary' },
            { id: 'screening', label: '🗓️ Screening Calendar' },
            { id: 'doctorView', label: '👩‍⚕️ Doctor-Side View' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-white text-forest shadow-xs font-bold'
                  : 'bg-forest-light/60 text-sage-light hover:bg-forest-light'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: CARE TEAM & PERMISSIONS */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          {/* Automatic Routing Banner */}
          <div className="rounded-3xl bg-[#F4F6F2] border border-slate-200/80 p-4 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-forest text-xs mb-1">
              <Share2 className="w-4 h-4 text-sage" />
              <span>Automatic Clinical Routing</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              When new lab results are scanned, Ritu automatically routes thyroid &amp; glucose values to <strong>Dr. Gupta</strong> and lipid panels to <strong>Dietician Sneha</strong>. When Dr. Sen adds a dietary instruction, it routes automatically to your dietician’s meal planner.
            </p>
          </div>

          {/* Specialist Cards */}
          <div className="space-y-3">
            {specialists.map((s) => (
              <Card key={s.id} className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-forest text-white flex items-center justify-center font-heading font-bold text-sm shrink-0">
                      {s.avatar}
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-slate-900">
                        {s.name}
                      </h3>
                      <div className="text-xs text-forest font-semibold">{s.role}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{s.hospital}</div>
                    </div>
                  </div>

                  <span className="rounded-full bg-pastel-mint px-2.5 py-1 text-[10px] font-bold text-pastel-mintText shrink-0">
                    Connected
                  </span>
                </div>

                {/* Granular Sharing Toggles */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center justify-between">
                    <span>Data Shared with this Specialist:</span>
                    <span className="text-[10px] text-slate-400 font-normal">Tap to toggle access</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: 'labs', label: '🧪 Labs' },
                      { key: 'food', label: '🥗 Food & Tolerance' },
                      { key: 'symptoms', label: '⚡ Symptoms' },
                      { key: 'workouts', label: '🏃 Workouts' },
                      { key: 'meds', label: '💊 Medicines' },
                    ].map((item) => {
                      const isAllowed = s.sharing[item.key as keyof Specialist['sharing']];
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => togglePermission(s.id, item.key as any)}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                            isAllowed
                              ? 'bg-forest text-white'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {isAllowed ? `✓ ${item.label}` : `✕ ${item.label}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Next Review: 20 Dec 2026</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('summary')}
                    className="text-xs font-bold text-forest hover:underline flex items-center gap-1"
                  >
                    <span>View Shared Brief</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* AI Booking Agent Card */}
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-pastel-yellow px-2.5 py-0.5 text-[10px] font-bold text-pastel-yellowText">
                <Sparkles className="w-3 h-3" /> AI Booking Agent
              </span>
              <span className="text-xs text-slate-500">Only books on confirmation</span>
            </div>

            <h3 className="font-heading text-base font-bold text-slate-900 mt-2">
              Book Doctor Visit or Home Lab Sample Collection
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ritu shortlists verified gynecologists and schedules certified phlebotomists (Tata 1mg / Apollo Diagnostics) at your doorstep.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                className="p-3 rounded-2xl border border-slate-200 bg-[#F4F6F2] hover:bg-slate-100 transition text-left flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Dr. Ananya Sen (OB/GYN)</div>
                  <div className="text-[10px] text-slate-500">Slot: Friday, 28 Nov · 04:30 PM</div>
                </div>
                <span className="rounded-full bg-forest text-white text-[10px] font-bold px-2.5 py-1">
                  Book Slot
                </span>
              </button>

              <button
                type="button"
                className="p-3 rounded-2xl border border-slate-200 bg-[#F4F6F2] hover:bg-slate-100 transition text-left flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Home Blood Sample Collection</div>
                  <div className="text-[10px] text-slate-500">Tata 1mg · Fasting Glucose &amp; TSH</div>
                </div>
                <span className="rounded-full bg-forest text-white text-[10px] font-bold px-2.5 py-1">
                  Book Home Visit
                </span>
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* VIEW 2: 1-PAGE VISIT SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          <Card className="rounded-4xl p-5 sm:p-6 border-slate-200/80 bg-white shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-pastel-mint px-2.5 py-0.5 text-[10px] font-bold text-pastel-mintText">
                  📄 Clinical 1-Page Pre-Consult Brief
                </span>
                <h2 className="font-heading text-xl font-bold text-slate-900 mt-1">
                  Visit Summary for Dr. Ananya Sen
                </h2>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="forest"
                  size="sm"
                  onClick={() => {
                    setSummaryShared(true);
                    setTimeout(() => setSummaryShared(false), 3000);
                  }}
                  className="rounded-full text-xs"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  {summaryShared ? 'Shared!' : 'Share with Doctor'}
                </Button>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-3xl bg-[#F4F6F2] border border-slate-200/70 space-y-4 text-xs">
              {/* Patient Header */}
              <div className="border-b border-slate-200 pb-3 flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900 text-sm">Priya Sharma, 26F</span>
                  <span className="text-slate-500 text-xs ml-2">Hyderabad · Rotterdam Phenotype B</span>
                </div>
                <span className="text-[11px] text-slate-400">Date: 21 Nov 2026</span>
              </div>

              {/* Grid 1: Cycle & Vitals */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-white rounded-2xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Current Cycle</div>
                  <div className="font-heading font-bold text-forest text-sm">Day 18 of 42</div>
                </div>
                <div className="p-2.5 bg-white rounded-2xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">HOMA-IR Index</div>
                  <div className="font-heading font-bold text-coral text-sm">3.61 (High)</div>
                </div>
                <div className="p-2.5 bg-white rounded-2xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Med Adherence</div>
                  <div className="font-heading font-bold text-forest text-sm">93% (28 Days)</div>
                </div>
                <div className="p-2.5 bg-white rounded-2xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Active Trial</div>
                  <div className="font-heading font-bold text-forest text-xs mt-0.5">30m Brisk Walk</div>
                </div>
              </div>

              {/* Section 1: Food Tolerance Findings */}
              <div>
                <span className="font-bold text-slate-900 block mb-1">1. Food Tolerance Spectrum (Learned Insights):</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  • <strong>Fermented Millets (Ragi/Jowar):</strong> High tolerance (0 bloating in 14 meals).<br />
                  • <strong>Chana / Chickpeas:</strong> Tolerated in portions &le; 1 katori.<br />
                  • <strong>A1 Dairy / Buffalo Milk:</strong> Low tolerance (provoked severe bloating in 5 of 6 meals). Recommendation: Discuss dairy elimination trial.
                </p>
              </div>

              {/* Section 2: Completed Trial Verdict */}
              <div>
                <span className="font-bold text-slate-900 block mb-1">2. Completed N-of-1 Personal Science Trial:</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  • <strong>Low-GI Indian Diet (42 Days):</strong> Cycle-adjusted OLS effect &delta; = +0.98 pts. Bayesian posterior probability of benefit &gt; MCID is <strong>91%</strong> (Likely Worked).
                </p>
              </div>

              {/* Section 3: Questions for the Visit */}
              <div>
                <span className="font-bold text-slate-900 block mb-1">3. Questions Prepared for Dr. Sen:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-700">
                  <li>Given persistent cycle prolongation (42 days), should we adjust Metformin dosing?</li>
                  <li>Can we approve the proposed A1 Dairy elimination trial to resolve bloating?</li>
                  <li>Should we schedule a pelvic ultrasound review in February?</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* VIEW 3: SCREENING CALENDAR */}
      {activeTab === 'screening' && (
        <div className="space-y-4">
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-pastel-blue px-2.5 py-0.5 text-[10px] font-bold text-pastel-blueText">
                🗓️ Preventive Screening Calendar
              </span>
              <span className="text-xs text-slate-500">Based on Age 26 &amp; Family History</span>
            </div>

            <div className="mt-3">
              <h2 className="font-heading text-lg font-bold text-slate-900">
                Tailored Screening &amp; Preventive Checks
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically scheduled based on reported family history (Maternal Thyroid, Paternal Diabetes).
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {[
                {
                  title: 'Pelvic Ultrasound (TVS / Follicular Scan)',
                  frequency: 'Annual Review',
                  dueDate: 'Feb 2027',
                  reason: 'Assess ovarian volume & antral follicle count per Rotterdam criteria',
                  status: 'Scheduled',
                  badgeColor: 'bg-emerald-100 text-emerald-800',
                },
                {
                  title: 'Thyroid Function Panel (TSH, FT4, Anti-TPO)',
                  frequency: 'Every 6 Months',
                  dueDate: 'Dec 2026 (Due in 2 weeks)',
                  reason: 'Family history of maternal hypothyroidism + baseline TSH 3.8',
                  status: 'Upcoming',
                  badgeColor: 'bg-amber-100 text-amber-800',
                },
                {
                  title: 'HbA1c & Fasting Insulin Panel',
                  frequency: 'Quarterly',
                  dueDate: 'Dec 2026',
                  reason: 'Track HOMA-IR response to Metformin and low-GI intervention',
                  status: 'Upcoming',
                  badgeColor: 'bg-amber-100 text-amber-800',
                },
                {
                  title: 'Cervical Cancer Screening (Pap Smear)',
                  frequency: 'Every 3 Years',
                  dueDate: 'Completed Jan 2025 (Next: 2028)',
                  reason: 'Routine ACOG / FOGSI guidelines for women aged 21–65',
                  status: 'Normal',
                  badgeColor: 'bg-slate-100 text-slate-700',
                },
                {
                  title: 'Clinical Breast Examination',
                  frequency: 'Annual Preventive',
                  dueDate: 'March 2027',
                  reason: 'Routine preventive wellness baseline',
                  status: 'Planned',
                  badgeColor: 'bg-slate-100 text-slate-700',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-3xl border border-slate-200 bg-[#F4F6F2] flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.reason}</div>
                    <div className="text-[10px] text-forest font-semibold mt-1">
                      Due: {item.dueDate} • {item.frequency}
                    </div>
                  </div>

                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shrink-0 ${item.badgeColor}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* VIEW 4: DOCTOR-SIDE VIEW */}
      {activeTab === 'doctorView' && (
        <div className="space-y-4">
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-pastel-mint px-2.5 py-0.5 text-[10px] font-bold text-pastel-mintText">
                👩‍⚕️ Specialist Portal Mode: Dr. Ananya Sen
              </span>
              <span className="text-xs text-slate-500">Patient: Priya Sharma (26F)</span>
            </div>

            <h3 className="font-heading text-lg font-bold text-slate-900 mt-2">
              Review AI Suggestions &amp; Set Fixed Clinical Rules
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The AI never overrides you. Review suggestions generated from patient data and approve them into clinical rules.
            </p>

            {/* AI Suggestion Awaiting Approval */}
            <div className="mt-4 p-4 rounded-3xl bg-pastel-peach/40 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-amber-900">
                  AI Suggestion Awaiting Your Approval
                </span>
                <span className="text-[10px] text-amber-700 font-semibold">Confidence: 83%</span>
              </div>

              <div className="mt-2 text-xs font-bold text-slate-900">
                &ldquo;Bloating after A1 dairy in 5 of 6 logged meals — initiate a 21-day dairy elimination trial?&rdquo;
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Data shows recurrent postprandial distress after paneer and buffalo milk. Ritu has staged a 21-day trial with alternative calcium sources (ragi, sesame seeds).
              </p>

              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  variant="forest"
                  size="sm"
                  onClick={() => setApprovedTrial(true)}
                  className="rounded-full text-xs"
                >
                  {approvedTrial ? '✓ Approved by Dr. Sen' : 'Approve Trial Protocol'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                >
                  Edit Protocol
                </Button>
              </div>
            </div>

            {/* Current Fixed Clinical Limits */}
            <div className="mt-5">
              <div className="text-xs font-bold text-slate-800 mb-2">
                Your Fixed Rules for Priya (AI Never Relaxes These):
              </div>
              <div className="space-y-1.5">
                {doctorRules.map((rule, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-2xl bg-[#F4F6F2] border border-slate-200 text-xs text-slate-800 flex items-center justify-between"
                  >
                    <span>🔒 {rule}</span>
                    <span className="text-[10px] text-forest font-bold">Active Limit</span>
                  </div>
                ))}
              </div>

              {/* Add New Rule */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newRuleInput}
                  onChange={(e) => setNewRuleInput(e.target.value)}
                  placeholder="Add a new fixed rule (e.g. 'Limit coffee to 1 cup/day')..."
                  className="flex-1 rounded-full border border-slate-200 bg-[#F4F6F2] px-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-forest"
                />
                <Button
                  type="button"
                  variant="forest"
                  size="sm"
                  onClick={() => {
                    if (newRuleInput) {
                      setDoctorRules([...doctorRules, newRuleInput]);
                      setNewRuleInput('');
                    }
                  }}
                  className="rounded-full text-xs"
                >
                  Add Rule
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <DisclaimerBanner type="wellness" />
    </div>
  );
}
