'use client';

import React, { useState } from 'react';
import { Link, usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './language-switcher';
import { PersonaSwitcher } from './persona-switcher';
import {
  Activity,
  CalendarCheck,
  FlaskConical,
  FileSpreadsheet,
  Utensils,
  Bot,
  UserCheck,
  LineChart,
  Settings,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export function Navbar() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: t('dashboard'), icon: Activity },
    { href: '/checkin', label: t('checkin'), icon: CalendarCheck },
    { href: '/experiments', label: t('experiments'), icon: FlaskConical },
    { href: '/labs', label: t('labs'), icon: FileSpreadsheet },
    { href: '/food', label: t('food'), icon: Utensils },
    { href: '/coach', label: t('coach'), icon: Bot },
    { href: '/doctors', label: t('doctors'), icon: UserCheck },
    { href: '/admin', label: t('admin'), icon: LineChart },
    { href: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-rose-100 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                {tCommon('appName')}
              </span>
              <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                IIMA DEMO
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-500 sm:block">
              {tCommon('tagline')}
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 font-semibold dark:bg-rose-950/60 dark:text-rose-300'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <PersonaSwitcher />
          <LanguageSwitcher />

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-rose-100 bg-white px-4 py-3 lg:hidden dark:border-slate-800 dark:bg-slate-950">
          <nav className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg p-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-rose-50 text-rose-700 font-semibold dark:bg-rose-950/60 dark:text-rose-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4 text-rose-500" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
