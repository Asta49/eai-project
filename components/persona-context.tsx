'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type PersonaType = 'patient' | 'doctor';

export interface Persona {
  id: string;
  type: PersonaType;
  name: string;
  roleTitle: string;
  badge: string;
  badgeClass: string;
  avatarText: string;
  avatarBg: string;
  description: string;
  defaultRoute: string;
  stats?: {
    age?: number;
    city?: string;
    phenotype?: string;
    homaIr?: number;
    activeTrial?: string;
  };
}

export const PERSONAS: Record<PersonaType, Persona> = {
  patient: {
    id: 'priya_sharma',
    type: 'patient',
    name: 'Priya Sharma',
    roleTitle: 'Ritu User',
    badge: 'Patient',
    badgeClass: 'bg-pastel-peach text-pastel-peachText border border-amber-200/60',
    avatarText: 'PS',
    avatarBg: 'bg-rose-600 text-white',
    description: '26F, Hyderabad • PCOS (Rotterdam B) & Hypothyroid • Care Team Connected',
    defaultRoute: '/today',
    stats: {
      age: 26,
      city: 'Hyderabad',
      phenotype: 'PCOS (Rotterdam B) + Hypothyroidism',
      homaIr: 3.61,
      activeTrial: 'Morning 30-min brisk walk (Day 18 of 42)',
    },
  },
  doctor: {
    id: 'dr_ananya_sen',
    type: 'doctor',
    name: 'Dr. Ananya Sen, MD',
    roleTitle: 'Gynecologist & Care Team Lead',
    badge: 'Doctor',
    badgeClass: 'bg-pastel-mint text-pastel-mintText border border-emerald-200/60',
    avatarText: 'AS',
    avatarBg: 'bg-indigo-600 text-white',
    description: 'Lead Gynecologist • 24 AI Features, Pre-Consult Briefs, Scribe, Rules & ABHA',
    defaultRoute: '/doctor',
  },
};

interface PersonaContextValue {
  currentPersona: Persona;
  setPersonaType: (type: PersonaType) => void;
  allPersonas: Persona[];
}

const PersonaContext = createContext<PersonaContextValue | undefined>(undefined);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [personaType, setPersonaTypeState] = useState<PersonaType>('patient');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pcos_active_persona_type') as PersonaType;
      if (saved && PERSONAS[saved]) {
        setPersonaTypeState(saved);
      } else {
        setPersonaTypeState('patient');
      }
    } catch (_) {
      setPersonaTypeState('patient');
    }
  }, []);

  const setPersonaType = (type: PersonaType) => {
    const valid = PERSONAS[type] ? type : 'patient';
    setPersonaTypeState(valid);
    try {
      localStorage.setItem('pcos_active_persona_type', valid);
    } catch (_) {}
  };

  const currentPersona = PERSONAS[personaType] || PERSONAS.patient;
  const allPersonas = Object.values(PERSONAS);

  return (
    <PersonaContext.Provider value={{ currentPersona, setPersonaType, allPersonas }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (!context) {
    return {
      currentPersona: PERSONAS.patient,
      setPersonaType: () => {},
      allPersonas: Object.values(PERSONAS),
    };
  }
  return context;
}
