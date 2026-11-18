'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePersona, PersonaType } from './persona-context';
import { useRouter, usePathname } from '@/navigation';
import {
  User,
  Stethoscope,
  ShieldCheck,
  ChevronDown,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function PersonaSwitcher() {
  const { currentPersona, setPersonaType, allPersonas } = usePersona();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPersonaIcon = (type: PersonaType) => {
    switch (type) {
      case 'patient':
        return <User className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />;
      case 'doctor':
        return <Stethoscope className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />;
      case 'admin':
        return <ShieldCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />;
    }
  };

  const handleSelect = (type: PersonaType, defaultRoute: string) => {
    setPersonaType(type);
    setIsOpen(false);
    // If user switches to doctor, and isn't on doctor page, offer or auto-navigate if desired
    if (type === 'doctor' && !pathname.includes('/doctors')) {
      router.push('/doctors');
    } else if (type === 'admin' && !pathname.includes('/admin')) {
      router.push('/admin');
    } else if (type === 'patient' && (pathname.includes('/doctors') || pathname.includes('/admin'))) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-2.5 py-1.5 text-left text-xs font-medium shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
        title="Switch user role without logging in"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {getPersonaIcon(currentPersona.type)}
        </div>
        <div className="hidden sm:block">
          <div className="font-semibold text-slate-800 dark:text-slate-200">
            {currentPersona.name.split(',')[0]}
          </div>
          <div className="text-[10px] text-slate-500">{currentPersona.badge}</div>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-2 px-2.5 pt-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <Sparkles className="h-3 w-3 text-rose-500" />
              Switch Persona (No Login Needed)
            </div>
            <p className="text-[11px] text-slate-500">
              Switch user role directly to evaluate different perspectives:
            </p>
          </div>

          <div className="space-y-1">
            {allPersonas.map((p) => {
              const isSelected = p.type === currentPersona.type;
              return (
                <button
                  key={p.type}
                  type="button"
                  onClick={() => handleSelect(p.type, p.defaultRoute)}
                  className={`flex w-full items-start justify-between rounded-xl p-2.5 text-left transition-all ${
                    isSelected
                      ? 'border border-rose-200 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                      {getPersonaIcon(p.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {p.name}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9px] font-semibold border ${p.badgeClass}`}
                        >
                          {p.badge}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-tight text-slate-500">
                        {p.description}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="mt-1 h-4 w-4 shrink-0 text-rose-600" />}
                </button>
              );
            })}
          </div>

          <div className="mt-2 border-t border-slate-100 pt-2 text-center text-[10px] text-slate-400 dark:border-slate-900">
            Authentication is completely disabled for this evaluation demo.
          </div>
        </div>
      )}
    </div>
  );
}
