'use client';

import React, { useState } from 'react';
import { Link, usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './language-switcher';
import { PersonaSwitcher } from './persona-switcher';
import { usePersona } from './persona-context';
import {
  Bell,
  X,
  Heart,
  Sparkles,
  ChevronRight,
  Smile,
  Calendar,
  CheckCircle2,
  ShoppingCart,
  Menu,
} from 'lucide-react';

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { currentPersona } = usePersona();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const notifications = [
    {
      id: 'n1',
      title: 'Ovulation Prediction Day!',
      subtitle: 'High chance of ovulation & fertility window',
      icon: Heart,
      iconColor: 'bg-brand-purpleLight text-brand-purple',
      time: 'Just now',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Today is Your Day',
      subtitle: 'Energy is rising. Take 30 mins for gentle movement',
      icon: Smile,
      iconColor: 'bg-pastel-peach text-brand-pink',
      time: '2h ago',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Smart Cart Swap Ready',
      subtitle: 'Zepto: Slurrp Farm Millet Noodles suggested',
      icon: ShoppingCart,
      iconColor: 'bg-pastel-yellow text-amber-800',
      time: '4h ago',
      unread: false,
    },
    {
      id: 'n4',
      title: 'Medicine Reminder',
      subtitle: 'Thyronorm 25mcg taken • Metformin due with dinner',
      icon: CheckCircle2,
      iconColor: 'bg-pastel-mint text-emerald-700',
      time: '6h ago',
      unread: false,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFF6F8]/95 backdrop-blur-md border-b border-rose-100/60">
        <div className="mx-auto max-w-md sm:max-w-lg px-3.5 sm:px-4 py-2.5">
          <div className="flex items-center justify-between">
            {/* Left: User Welcome as seen in reference s1.png & s2.png */}
            <Link href="/today" className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-slate-400 leading-none">
                  Welcome
                </span>
                <span className="font-heading text-base font-bold text-slate-900 tracking-tight">
                  {currentPersona.name}
                </span>
              </div>
            </Link>

            {/* Right: Controls & Notification Bell */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <PersonaSwitcher />
              <LanguageSwitcher />

              {/* Notification Bell with Badge (s1.png) */}
              <button
                type="button"
                onClick={() => setNotificationsOpen(true)}
                className="relative flex w-9 h-9 items-center justify-center rounded-full bg-white border border-rose-200/70 text-slate-700 hover:bg-rose-50/50 shadow-xs transition"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-700" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Drawer matching right side of reference s1.png */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-3 animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setNotificationsOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-4xl p-5 shadow-2xl border border-rose-100 z-10 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg font-bold text-slate-900">
                  Notification
                </span>
                <span className="rounded-full bg-brand-pinkLight px-2 py-0.5 text-[10px] font-bold text-brand-pink">
                  2 New
                </span>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications list matching s1.png */}
            <div className="mt-3 space-y-2.5 max-h-[380px] overflow-y-auto">
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      n.unread
                        ? 'bg-rose-50/40 border-rose-200/80'
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${n.iconColor}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-snug">
                          {n.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                          {n.subtitle}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
