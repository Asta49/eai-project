'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { DisclaimerBanner } from './disclaimer-banner';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  const t = useTranslations('common');

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50/70 py-6 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-4">
          <DisclaimerBanner type="wellness" />
        </div>

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              Ritu • Private Health Companion
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-forest">
              <ShieldCheck className="h-3.5 w-3.5 text-sage" /> DPDP Compliant • The doctor decides; AI fine-tunes
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Designed for Hormonal &amp; Lifestyle Health</span>
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span>• IIM-A Economics of AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
