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
  Heart,
  Calendar,
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
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Welcome Card in Forest Green (s1.jpeg style) */}
      <div className="relative overflow-hidden rounded-4xl bg-forest p-6 sm:p-8 text-white text-center shadow-soft">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-forest-light/40 blur-2xl" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-32 w-32 rounded-full bg-sage/10 blur-xl" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest-light px-3.5 py-1 text-xs font-semibold text-sage-light">
            <Sparkles className="h-3.5 w-3.5 text-sage" />
            <span>IIM Ahmedabad • Economics of AI Capstone Project</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            A personal research assistant for{' '}
            <span className="text-sage">your PCOS</span>
          </h1>

          <p className="mx-auto max-w-lg text-xs sm:text-sm text-sage-light font-body leading-relaxed">
            PCOS is different for every woman. We don’t guess or rely on generic internet advice.
            Our Bayesian statistics engine runs personal N-of-1 trials to figure out what works for{' '}
            <span className="font-semibold text-white">your unique body</span>.
          </p>

          {/* Quick Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            <Link href="/dashboard">
              <Button size="lg" variant="sage" className="gap-2 text-xs sm:text-sm font-bold shadow-md">
                <Activity className="h-4 w-4" />
                Open Live Demo Dashboard (Priya, 26)
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button size="lg" variant="outline" className="gap-2 text-xs sm:text-sm font-bold bg-white/90">
                Start Patient Onboarding
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="lg" variant="outlineForest" className="gap-2 text-xs sm:text-sm font-bold text-white border-white/80 hover:bg-white hover:text-forest">
                <LineChart className="h-4 w-4" />
                Course Moat Simulation
              </Button>
            </Link>
          </div>

          {/* Golden Rule Notice */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-sage-light font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-sage" />
            <span>Deterministic Bayesian Engine: Generative AI never determines whether a trial worked.</span>
          </div>
        </div>
      </div>

      {/* 5 Core Pillars Grid in Soft Pastel Colors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-heading text-base font-bold text-slate-900">
            5 Core Pillars of the Platform
          </h2>
          <span className="text-xs text-slate-500 font-medium">Mobile Architecture</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Pillar 1: Bayesian Stats Engine */}
          <Card className="rounded-3xl p-5 border-slate-200/80 bg-white shadow-card">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pastel-blue text-pastel-blueText">
                <FlaskConical className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  N-of-1 Bayesian Engine
                </h3>
                <p className="mt-1 text-xs text-slate-500 font-body leading-relaxed">
                  Deterministic normal-normal conjugate update adjusted for cycle phases (menstrual, follicular, luteal) and autocorrelation.
                </p>
                <div className="mt-3">
                  <Link href="/experiments" className="text-xs font-bold text-forest hover:underline">
                    View Trial Library →
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Pillar 2: Vision Lab OCR */}
          <Card className="rounded-3xl p-5 border-slate-200/80 bg-white shadow-card">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pastel-mint text-pastel-mintText">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  Lab OCR &amp; Standard Biomarkers
                </h3>
                <p className="mt-1 text-xs text-slate-500 font-body leading-relaxed">
                  Vision model extracts test reports into 15 canonical biomarkers (Fasting Insulin, HOMA-IR, Free Testosterone, AMH, Vitamin D).
                </p>
                <div className="mt-3">
                  <Link href="/labs" className="text-xs font-bold text-forest hover:underline">
                    Explore Diagnostic Labs →
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Pillar 3: INDB Indian Food Bank */}
          <Card className="rounded-3xl p-5 border-slate-200/80 bg-white shadow-card">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pastel-purple text-pastel-purpleText">
                <Utensils className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  Indian Nutrient Databank (INDB)
                </h3>
                <p className="mt-1 text-xs text-slate-500 font-body leading-relaxed">
                  150+ regional Indian dishes with glycemic load and PCOS-friendliness scoring. Suggests practical swaps (e.g., Poha → Besan Chilla).
                </p>
                <div className="mt-3">
                  <Link href="/food" className="text-xs font-bold text-forest hover:underline">
                    Browse 150+ Foods →
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Pillar 4: Indic Languages & Voice */}
          <Card className="rounded-3xl p-5 border-slate-200/80 bg-white shadow-card">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pastel-peach text-pastel-peachText">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  4 Indic Languages &amp; Voice AI
                </h3>
                <p className="mt-1 text-xs text-slate-500 font-body leading-relaxed">
                  English, हिंदी, తెలుగు, தமிழ். Web Speech API with pluggable Sarvam/Bhashini voice adapters and automatic 112 emergency routing.
                </p>
                <div className="mt-3">
                  <Link href="/coach" className="text-xs font-bold text-forest hover:underline">
                    Try AI Coach →
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
