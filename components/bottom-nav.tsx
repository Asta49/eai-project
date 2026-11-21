'use client';

import React, { useState } from 'react';
import { Link, usePathname, useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import {
  Home,
  FlaskConical,
  Plus,
  Utensils,
  Bot,
  X,
  CalendarCheck,
  FileSpreadsheet,
  Stethoscope,
  LineChart,
  Sparkles,
} from 'lucide-react';

export function BottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  const quickActions = [
    {
      title: '10-Second Daily Check-in',
      desc: 'Log energy, mood, symptoms, and pain level',
      icon: CalendarCheck,
      color: 'bg-pastel-peach text-pastel-peachText',
      href: '/checkin',
    },
    {
      title: 'Log Meal & Check Tolerance',
      desc: '150+ INDB dishes, personal tolerance & smart swaps',
      icon: Utensils,
      color: 'bg-pastel-purple text-pastel-purpleText',
      href: '/food',
    },
    {
      title: 'Smart Cart Agent',
      desc: 'Live Zepto/Blinkit cart review & healthier picks',
      icon: Sparkles,
      color: 'bg-pastel-yellow text-pastel-yellowText',
      href: '/cart',
    },
    {
      title: 'Ask Ritu: Trusted Info',
      desc: 'Personal AI chat, doctor advice explainer, myth checker',
      icon: Bot,
      color: 'bg-pastel-mint text-pastel-mintText',
      href: '/ask',
    },
    {
      title: 'Care Team & Visit Summary',
      desc: '1-page clinical brief, doctor review & screening calendar',
      icon: Stethoscope,
      color: 'bg-pastel-blue text-pastel-blueText',
      href: '/care',
    },
  ];

  const isTodayActive = pathname.includes('/today') || pathname.includes('/dashboard');
  const isAskActive = pathname.includes('/ask') || pathname.includes('/coach');
  const isCareActive = pathname.includes('/care') || pathname.includes('/doctors');
  const isProfileActive = pathname.includes('/profile') || pathname.includes('/settings');

  return (
    <>
      {/* Floating Bottom Nav Container */}
      <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-between w-full max-w-md bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-float rounded-full px-4 py-2.5">
          {/* Tab 1: Today */}
          <Link
            href="/today"
            className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[11px] font-semibold transition-colors ${
              isTodayActive ? 'text-forest font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                isTodayActive ? 'bg-sage-light text-forest' : ''
              }`}
            >
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px]">Today</span>
          </Link>

          {/* Tab 2: Ask */}
          <Link
            href="/ask"
            className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[11px] font-semibold transition-colors ${
              isAskActive ? 'text-forest font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                isAskActive ? 'bg-sage-light text-forest' : ''
              }`}
            >
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-[10px]">Ask</span>
          </Link>

          {/* Center Elevated Floating Action Button */}
          <div className="relative -mt-6">
            <button
              type="button"
              onClick={() => setQuickActionOpen(!quickActionOpen)}
              className="flex items-center justify-center w-13 h-13 rounded-full bg-forest text-white shadow-lg shadow-forest/30 border-4 border-[#F4F6F2] hover:scale-105 active:scale-95 transition-transform"
              aria-label="Quick Action"
            >
              {quickActionOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Plus className="w-6 h-6 stroke-[2.5]" />
              )}
            </button>
          </div>

          {/* Tab 3: Care */}
          <Link
            href="/care"
            className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[11px] font-semibold transition-colors ${
              isCareActive ? 'text-forest font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                isCareActive ? 'bg-sage-light text-forest' : ''
              }`}
            >
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-[10px]">Care</span>
          </Link>

          {/* Tab 4: Profile */}
          <Link
            href="/profile"
            className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[11px] font-semibold transition-colors ${
              isProfileActive ? 'text-forest font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                isProfileActive ? 'bg-sage-light text-forest' : ''
              }`}
            >
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-[10px]">Profile</span>
          </Link>
        </nav>
      </div>

      {/* Quick Action Bottom Sheet Modal */}
      {quickActionOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setQuickActionOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-4xl p-6 shadow-2xl border border-slate-100 z-10 mb-16 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Quick Action
                  </h4>
                  <p className="text-xs text-slate-500">
                    Fast intake for your daily PCOS personal trial
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickActionOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.href}
                    type="button"
                    onClick={() => {
                      setQuickActionOpen(false);
                      router.push(action.href);
                    }}
                    className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-all text-left"
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl ${action.color} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 font-heading">
                        {action.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {action.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
