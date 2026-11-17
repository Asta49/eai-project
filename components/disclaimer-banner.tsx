'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck, PhoneCall } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DisclaimerBannerProps {
  type?: 'wellness' | 'emergency';
  customMessage?: string;
  className?: string;
}

export function DisclaimerBanner({
  type = 'wellness',
  customMessage,
  className = '',
}: DisclaimerBannerProps) {
  const t = useTranslations('common');

  if (type === 'emergency') {
    return (
      <div
        role="alert"
        className={`rounded-xl border border-red-300 bg-red-50 p-4 text-red-900 shadow-sm dark:border-red-900 dark:bg-red-950/60 dark:text-red-200 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-red-100 p-2 text-red-700 dark:bg-red-900 dark:text-red-300">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-red-800 dark:text-red-200">
              URGENT MEDICAL ATTENTION REQUIRED (112)
            </h4>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {customMessage || t('emergencyWarning')}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <a
                href="tel:112"
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-red-700"
              >
                <PhoneCall className="h-3.5 w-3.5" /> Call National Emergency (112)
              </a>
              <span className="text-xs text-red-600 dark:text-red-400">
                AI assistance has been paused for safety.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 ${className}`}
    >
      <ShieldCheck className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
      <span>{customMessage || t('disclaimer')}</span>
    </div>
  );
}
