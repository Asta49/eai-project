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
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              IIM Ahmedabad • Economics of AI Course Project
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
              <ShieldCheck className="h-3.5 w-3.5" /> DPDP Compliant Architecture
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Designed for Indian Women with PCOS</span>
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span>• N-of-1 Personal Science</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
