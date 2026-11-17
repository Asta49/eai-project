'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import { Lock, User, Stethoscope, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('priya@demo.pcos');
  const [password, setPassword] = useState('demo123');

  const handleQuickLogin = (userEmail: string, destination: string = '/dashboard') => {
    setEmail(userEmail);
    // Simulate instantaneous client auth for 3-minute demo
    if (typeof window !== 'undefined') {
      localStorage.setItem('pcos_demo_auth_user', userEmail);
    }
    router.push(destination);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="text-center mb-6">
        <Badge variant="pcos" className="mb-2">DEMO ACCESS</Badge>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign In to PCOS Research Assistant
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Select one of the preloaded demo personas for instantaneous access.
        </p>
      </div>

      <Card className="border-rose-100 shadow-sm dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">One-Click Demo Personas</CardTitle>
          <CardDescription>No credentials needed for evaluation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <button
            type="button"
            onClick={() => handleQuickLogin('priya@demo.pcos', '/dashboard')}
            className="flex w-full items-center justify-between rounded-xl border border-rose-200 bg-rose-50/50 p-3.5 text-left transition-all hover:bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Priya Sharma (Patient)
                </div>
                <div className="text-[11px] text-slate-500">
                  26F, Hyderabad • Phenotype A • Active N-of-1 Trial
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-rose-600" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('dr.ananya@pcoscare.in', '/doctors')}
            className="flex w-full items-center justify-between rounded-xl border border-teal-200 bg-teal-50/50 p-3.5 text-left transition-all hover:bg-teal-50 dark:border-teal-900/60 dark:bg-teal-950/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Dr. Ananya Sen, MD (OB-GYN)
                </div>
                <div className="text-[11px] text-slate-500">
                  Specialist • Pre-consult summaries &amp; Trial approvals
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-teal-600" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('admin@eai.iima.ac.in', '/admin')}
            className="flex w-full items-center justify-between rounded-xl border border-purple-200 bg-purple-50/50 p-3.5 text-left transition-all hover:bg-purple-50 dark:border-purple-900/60 dark:bg-purple-950/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Admin / Course Evaluator
                </div>
                <div className="text-[11px] text-slate-500">
                  Network effect simulation &amp; Unit economics panel
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-purple-600" />
          </button>
        </CardContent>
      </Card>

      <div className="mt-6">
        <DisclaimerBanner type="wellness" />
      </div>
    </div>
  );
}
