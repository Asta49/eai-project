import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  FlaskConical,
  Activity,
  FileSpreadsheet,
  Utensils,
  Bot,
  UserCheck,
  ShieldCheck,
  LineChart,
  ArrowRight,
} from 'lucide-react';

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('onboarding');
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>IIM Ahmedabad • Economics of AI Capstone Project</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          A personal research assistant for{' '}
          <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            your PCOS
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
          PCOS is different for every woman. We don’t guess or rely on generic internet advice.
          Our Bayesian statistics engine runs personal N-of-1 trials to figure out what works for{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-100">your body</span>.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button size="lg" variant="pcos" className="gap-2 text-sm sm:text-base">
              <Activity className="h-5 w-5" />
              Open Live Demo Dashboard (Priya, 26)
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button size="lg" variant="outline" className="gap-2 text-sm sm:text-base">
              Start New Patient Onboarding
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/admin">
            <Button size="lg" variant="secondary" className="gap-2 text-sm sm:text-base">
              <LineChart className="h-4 w-4 text-purple-600" />
              Course Moat & Economics Simulation
            </Button>
          </Link>
        </div>

        {/* Demo Quick Notice */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          <span>DPDP Compliant • Deterministic Bayesian Engine (No LLM hallucinations on verdicts)</span>
        </div>
      </div>

      {/* 5 Core Pillars Grid */}
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-rose-100 bg-gradient-to-b from-white to-rose-50/30 shadow-sm hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/50">
          <CardContent className="p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              <FlaskConical className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              N-of-1 Bayesian Statistics Engine
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed dark:text-slate-300">
              Deterministic normal-normal conjugate update adjusted for cycle phases (menstrual, follicular, luteal) and autocorrelation. The LLM has zero write access to trial verdicts.
            </p>
            <div className="mt-4">
              <Link href="/experiments" className="text-xs font-semibold text-rose-600 hover:underline">
                Explore Trial Library →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-100 bg-gradient-to-b from-white to-teal-50/30 shadow-sm hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/50">
          <CardContent className="p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              Lab OCR & Standard Biomarkers
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed dark:text-slate-300">
              Vision model extracts lab reports into 15 canonical biomarkers (Fasting Insulin, HOMA-IR, Free Testosterone, AMH, Vitamin D) with human-in-the-loop review.
            </p>
            <div className="mt-4">
              <Link href="/labs" className="text-xs font-semibold text-teal-600 hover:underline">
                View Lab Extraction →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100 bg-gradient-to-b from-white to-amber-50/30 shadow-sm hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/50">
          <CardContent className="p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Utensils className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              Indian Nutrient Databank (INDB)
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed dark:text-slate-300">
              150+ regional Indian dishes with glycemic load and PCOS-friendliness scoring. Suggests practical swaps (e.g., Poha → Besan Chilla, Sugary Chai → Cardamom Green Tea).
            </p>
            <div className="mt-4">
              <Link href="/food" className="text-xs font-semibold text-amber-700 hover:underline">
                Track Food Log →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100 bg-gradient-to-b from-white to-purple-50/30 shadow-sm hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/50">
          <CardContent className="p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              AI Coach & Indic Voice Support
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed dark:text-slate-300">
              RAG over curated clinical PCOS guidelines in Hindi, Telugu, Tamil & English. Browser Web Speech STT/TTS with pluggable Sarvam/Bhashini voice architecture.
            </p>
            <div className="mt-4">
              <Link href="/coach" className="text-xs font-semibold text-purple-600 hover:underline">
                Chat with AI Coach →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-gradient-to-b from-white to-blue-50/30 shadow-sm hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/50">
          <CardContent className="p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              Doctor Consult & AI Briefs
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed dark:text-slate-300">
              Doctors receive an AI pre-consult brief synthesizing Rotterdam phenotype, cycle history, and past trial results. Doctors approve or reject restricted supplements.
            </p>
            <div className="mt-4">
              <Link href="/doctors" className="text-xs font-semibold text-blue-600 hover:underline">
                Doctor Portal →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-gradient-to-b from-white to-emerald-50/30 shadow-sm hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/50">
          <CardContent className="p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <LineChart className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              Data Network Effect & Unit Economics
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed dark:text-slate-300">
              Interactive simulation proving that hierarchical empirical Bayes priors shorten time-to-verdict from 38 days to 14 days, creating a defensible competitive moat.
            </p>
            <div className="mt-4">
              <Link href="/admin" className="text-xs font-semibold text-emerald-600 hover:underline">
                View Moat Simulation →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seeded Persona Quick Banner */}
      <div className="mt-10 rounded-2xl border border-rose-200 bg-rose-50/60 p-6 text-center sm:text-left dark:border-rose-900/60 dark:bg-rose-950/30">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <Badge variant="pcos" className="mb-2">DEMO PERSONA READY</Badge>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Priya Sharma (26, Hyderabad, Telugu & English)
            </h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Preloaded with 60 days of check-ins, 2 lab reports, 1 completed trial (Low-GI Diet: LIKELY WORKED), and 1 active trial (Myo-Inositol).
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="pcos" size="sm" className="whitespace-nowrap">
              Launch Priya’s Experience
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
