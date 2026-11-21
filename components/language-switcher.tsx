'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { locales, localeNames, Locale } from '@/i18n';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value as Locale;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className={`relative inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-white shadow-xs hover:bg-white/15 transition ${className}`}>
      <Globe className="h-3.5 w-3.5 text-rose-200" />
      <select
        value={currentLocale}
        onChange={handleLanguageChange}
        aria-label="Select Language"
        className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-1"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc} className="bg-slate-900 text-white">
            {loc === 'en' ? 'EN' : loc === 'hi' ? 'HI' : loc === 'te' ? 'TE' : 'TA'} • {localeNames[loc].split(' ')[0]}
          </option>
        ))}
      </select>
    </div>
  );
}
