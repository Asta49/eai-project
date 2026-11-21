'use client';

import React, { useState } from 'react';
import { Link, usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './language-switcher';
import { PersonaSwitcher } from './persona-switcher';
import {
  Sparkles,
  Calendar,
  Bell,
  Settings,
  Activity,
  CalendarCheck,
  FlaskConical,
  FileSpreadsheet,
  Utensils,
  Bot,
  UserCheck,
  LineChart,
  Menu,
  X,
} from 'lucide-react';

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Formatted date matching mobile UI kit: e.g. "Friday, 20 Nov 2026"
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date());

  const navLinks = [
    { href: '/today', label: 'Today', icon: Activity },
    { href: '/ask', label: 'Ask', icon: Bot },
    { href: '/care', label: 'Care', icon: UserCheck },
    { href: '/profile', label: 'Profile', icon: Settings },
    { href: '/experiments', label: 'Trials', icon: FlaskConical },
    { href: '/food', label: 'Food & You', icon: Utensils },
    { href: '/cart', label: 'Smart Cart', icon: CalendarCheck },
    { href: '/admin', label: 'IIM-A Moat', icon: LineChart },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F4F6F2]/90 backdrop-blur-md border-b border-slate-200/50">
      <div className="mx-auto max-w-5xl px-4 py-2 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          {/* Brand & Date (as seen in s1.jpeg, s4.avif) */}
          <div className="flex items-center gap-2.5">
            <Link href="/today" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-forest text-white shadow-sm">
                <Sparkles className="h-4 w-4 text-sage" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-base tracking-tight text-slate-900">
                    Ritu
                  </span>
                  <span className="rounded-full bg-pastel-mint px-2 py-0.2 text-[9px] font-bold text-pastel-mintText">
                    Companion
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-body">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Direct Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href) || (item.href === '/today' && pathname.startsWith('/dashboard')) || (item.href === '/ask' && pathname.startsWith('/coach')) || (item.href === '/care' && pathname.startsWith('/doctors')) || (item.href === '/profile' && pathname.startsWith('/settings'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-forest text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Persona Switcher, Language Switcher, Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <PersonaSwitcher />
            <LanguageSwitcher />

            <Link
              href="/profile"
              className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 transition"
              title="Profile & Privacy"
            >
              <Settings className="w-4 h-4 text-slate-600" />
            </Link>

            {/* Mobile Drawer Toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex w-8 h-8 items-center justify-center rounded-full bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50"
              aria-label="Toggle All Pages Menu"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="lg:hidden mt-2 p-3 bg-white rounded-3xl border border-slate-200/80 shadow-lg animate-in slide-in-from-top-2">
            <div className="grid grid-cols-3 gap-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl text-center text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-forest text-white font-bold'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[11px]">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
