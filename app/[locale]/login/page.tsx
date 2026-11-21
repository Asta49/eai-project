'use client';

import React from 'react';
import { useRouter } from '@/navigation';
import { usePersona, PersonaType } from '@/components/persona-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { User, Stethoscope, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { currentPersona, setPersonaType, allPersonas } = usePersona();

  const handleSelect = (type: PersonaType, route: string) => {
    setPersonaType(type);
    router.push(route);
  };

  const getPersonaIcon = (type: PersonaType) => {
    switch (type) {
      case 'patient':
        return <User className="h-5 w-5 text-rose-600 dark:text-rose-400" />;
      case 'doctor':
        return <Stethoscope className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>NO LOGIN REQUIRED</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Choose Your Persona
        </h1>
        <p className="mt-2 text-xs text-slate-500 sm:text-sm">
          Authentication has been removed. Simply select a user role below or switch anytime from the top navigation bar.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Preloaded Evaluation Personas</CardTitle>
          <CardDescription>
            Click any persona to enter directly with all clinical records loaded.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {allPersonas.map((p) => {
            const isSelected = p.type === currentPersona.type;
            return (
              <button
                key={p.type}
                type="button"
                onClick={() => handleSelect(p.type, p.defaultRoute)}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-300 bg-indigo-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                    {getPersonaIcon(p.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {p.name}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.badgeClass}`}
                      >
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-normal">
                      {p.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
