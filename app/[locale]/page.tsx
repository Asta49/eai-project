import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  Lock,
  BookOpen,
  CheckCircle2,
  ShoppingCart,
  Sliders,
  ChevronRight,
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
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* Hero Welcome Card in Forest Green */}
      <div className="relative overflow-hidden rounded-4xl bg-forest p-6 sm:p-8 text-white text-center shadow-soft">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-forest-light/40 blur-2xl" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-32 w-32 rounded-full bg-sage/10 blur-xl" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest-light px-3.5 py-1 text-xs font-semibold text-sage-light">
            <Sparkles className="h-3.5 w-3.5 text-sage" />
            <span>Ritu • Private Health Companion</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            A private health companion for{' '}
            <span className="text-sage">your hormonal health</span>
          </h1>

          <p className="mx-auto max-w-lg text-xs sm:text-sm text-sage-light font-body leading-relaxed">
            For women navigating PCOS/PCOD, thyroid problems, endometriosis, anaemia, irregular periods, pregnancy &amp; postpartum, and menopause.
          </p>

          {/* 3 Core Rules */}
          <div className="my-4 p-3.5 rounded-3xl bg-forest-light/50 border border-sage/20 max-w-md mx-auto text-left space-y-1.5 text-xs text-sage-light">
            <div className="flex items-center gap-2 text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-sage" />
              <span>Three Non-Negotiable Rules:</span>
            </div>
            <div>• <strong>The doctor decides; AI fine-tunes.</strong> AI never overrides doctor prescriptions.</div>
            <div>• <strong>Every answer shows its source.</strong> No diagnosis, no medicine dose changes.</div>
            <div>• <strong>Private by default.</strong> You choose what each person and app can see.</div>
          </div>

          {/* Quick Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            <Link href="/today">
              <Button size="lg" variant="sage" className="gap-2 text-xs sm:text-sm font-bold shadow-md">
                <Activity className="h-4 w-4" />
                Launch Ritu (Priya Sharma Demo)
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button size="lg" variant="outline" className="gap-2 text-xs sm:text-sm font-bold bg-white/90">
                5-Question Onboarding
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="lg" variant="outlineForest" className="gap-2 text-xs sm:text-sm font-bold text-white border-white/80 hover:bg-white hover:text-forest">
                <LineChart className="h-4 w-4" />
                IIM-A Moat Simulation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Core Tabs Architecture Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-heading text-base font-bold text-slate-900">
            Structure: Three Tabs (Ask · Today · Care) + Profile
          </h2>
          <span className="text-xs text-slate-500 font-medium">Simple 1-Tap Navigation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Tab 1: Today */}
          <Link href="/today" className="block group">
            <Card className="rounded-3xl p-5 border-slate-200/80 bg-white shadow-card hover:border-forest transition h-full flex flex-col justify-between">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pastel-peach text-pastel-peachText mb-3">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-forest transition">
                  1. Today (Daily Management)
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  10-second check-in, cycle tracking with long-cycle alerts, medicine reminders, personal food tolerance tags, and condition-adjusted workouts.
                </p>
              </div>
              <div className="mt-3 text-xs font-bold text-forest flex items-center gap-1">
                <span>Open Today</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Card>
          </Link>

          {/* Tab 2: Ask */}
          <Link href="/ask" className="block group">
            <Card className="rounded-3xl p-5 border-slate-200/80 bg-white shadow-card hover:border-forest transition h-full flex flex-col justify-between">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pastel-mint text-pastel-mintText mb-3">
                  <Bot className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-forest transition">
                  2. Ask (Trusted Information)
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Personal AI grounded in guidelines (ICMR, FOGSI, WHO), doctor advice explainer, WhatsApp myth checker, and plain lab translations.
                </p>
              </div>
              <div className="mt-3 text-xs font-bold text-forest flex items-center gap-1">
                <span>Ask Ritu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Card>
          </Link>

          {/* Tab 3: Care */}
          <Link href="/care" className="block group">
            <Card className="rounded-3xl p-5 border-slate-200/80 bg-white shadow-card hover:border-forest transition h-full flex flex-col justify-between">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pastel-blue text-pastel-blueText mb-3">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-forest transition">
                  3. Care (Doctor Coordination)
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Care team sharing permissions per data type, automatic routing, simulated AI booking agent, 1-page visit summary, and screening calendar.
                </p>
              </div>
              <div className="mt-3 text-xs font-bold text-forest flex items-center gap-1">
                <span>View Care Team</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Profile, Calibration & Smart Cart Spotlight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/profile" className="block group">
          <Card className="rounded-3xl p-5 border-slate-200/80 bg-white shadow-card hover:border-forest transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pastel-purple text-pastel-purpleText flex items-center justify-center shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-slate-900 group-hover:text-forest">
                  Calibration Engine (&quot;How Ritu Personalises&quot;)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Side-by-side view of Doctor Rules (fixed limits) vs AI Learned Insights, with conflict resolution.
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/cart" className="block group">
          <Card className="rounded-3xl p-5 border-slate-200/80 bg-white shadow-card hover:border-forest transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pastel-yellow text-pastel-yellowText flex items-center justify-center shrink-0">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-slate-900 group-hover:text-forest">
                  Smart Cart Agent (Zepto / Blinkit)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Permission-based grocery checks, 3 help levels, live swap notifications, zero brand ads.
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
