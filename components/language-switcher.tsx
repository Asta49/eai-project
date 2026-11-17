'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { locales, localeNames, Locale } from '@/i18n';
import { Languages } from 'lucide-react';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value as Locale;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      <Languages className="h-4 w-4 text-slate-500" />
      <select
        value={currentLocale}
        onChange={handleLanguageChange}
        aria-label="Select Language"
        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}
