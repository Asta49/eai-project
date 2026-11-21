'use client';

import React from 'react';
import { Link, usePathname } from '@/navigation';
import {
  Home,
  Calendar,
  Stethoscope,
  User,
  MessageCircle,
} from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const isHomeActive = pathname === '/' || pathname.includes('/today') || pathname.includes('/dashboard');
  const isLogActive = pathname.includes('/checkin') || pathname.includes('/food') || pathname.includes('/labs');
  const isAskActive = pathname.includes('/ask') || pathname.includes('/coach');
  const isCareActive = pathname.includes('/care') || pathname.includes('/doctors');
  const isProfileActive = pathname.includes('/profile') || pathname.includes('/settings') || pathname.includes('/cart');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100/70 shadow-lg py-2">
      <nav className="mx-auto flex max-w-md items-center justify-around px-4">
        {/* Tab 1: Home / Cycle */}
        <Link
          href="/today"
          className={`flex flex-col items-center justify-center transition-all ${
            isHomeActive ? 'text-brand-purple' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="Home Cycle"
        >
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
              isHomeActive
                ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/30 scale-105'
                : 'bg-transparent'
            }`}
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Home</span>
        </Link>

        {/* Tab 2: Calendar & Daily Log */}
        <Link
          href="/checkin"
          className={`flex flex-col items-center justify-center transition-all ${
            isLogActive ? 'text-brand-purple' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="Calendar and Log"
        >
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
              isLogActive
                ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/30 scale-105'
                : 'bg-transparent'
            }`}
          >
            <Calendar className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Log</span>
        </Link>

        {/* Tab 3: Ask Ritu */}
        <Link
          href="/ask"
          className={`flex flex-col items-center justify-center transition-all ${
            isAskActive ? 'text-brand-purple' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="Ask Ritu"
        >
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
              isAskActive
                ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/30 scale-105'
                : 'bg-transparent'
            }`}
          >
            <MessageCircle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Ask</span>
        </Link>

        {/* Tab 4: Care / Consult */}
        <Link
          href="/care"
          className={`flex flex-col items-center justify-center transition-all ${
            isCareActive ? 'text-brand-purple' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="Care and Doctor"
        >
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
              isCareActive
                ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/30 scale-105'
                : 'bg-transparent'
            }`}
          >
            <Stethoscope className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Care</span>
        </Link>

        {/* Tab 5: Profile */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center transition-all ${
            isProfileActive ? 'text-brand-purple' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="Profile and Settings"
        >
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
              isProfileActive
                ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/30 scale-105'
                : 'bg-transparent'
            }`}
          >
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
