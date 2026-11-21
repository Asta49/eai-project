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
      className={`flex items-center gap-2 rounded-2xl border border-rose-100/70 bg-rose-50/40 px-3 py-1.5 text-[10px] text-slate-500 ${className}`}
    >
      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand-pink" />
      <span>{customMessage || t('disclaimer')}</span>
    </div>
  );
}
