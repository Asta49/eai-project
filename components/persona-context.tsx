'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type PersonaType = 'patient' | 'doctor' | 'admin';

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
    roleTitle: 'PCOS Patient',
    badge: 'Patient',
    badgeClass: 'bg-pastel-peach text-pastel-peachText border border-amber-200/60',
    avatarText: 'PS',
    avatarBg: 'bg-pastel-peach text-pastel-peachText',
    description: '26F, Hyderabad • Rotterdam Phenotype B • Active N-of-1 Walking Trial',
    defaultRoute: '/dashboard',
    stats: {
      age: 26,
      city: 'Hyderabad',
      phenotype: 'Phenotype B (Ovulatory PCOS)',
      homaIr: 3.61,
      activeTrial: 'Morning 30-min brisk walk (Day 18 of 42)',
    },
  },
  doctor: {
    id: 'dr_ananya_sen',
    type: 'doctor',
    name: 'Dr. Ananya Sen, MD',
    roleTitle: 'Gynecologist & Endocrinologist',
    badge: 'Doctor',
    badgeClass: 'bg-pastel-mint text-pastel-mintText border border-emerald-200/60',
    avatarText: 'AS',
    avatarBg: 'bg-pastel-mint text-pastel-mintText',
    description: 'Specialist • Reviewing patient clinical summaries & approving trial protocols',
    defaultRoute: '/doctors',
  },
  admin: {
    id: 'course_admin',
    type: 'admin',
    name: 'Prof. / Course Admin',
    roleTitle: 'IIM-A Economics of AI',
    badge: 'Faculty / Admin',
    badgeClass: 'bg-pastel-blue text-pastel-blueText border border-blue-200/60',
    avatarText: 'EA',
    avatarBg: 'bg-pastel-blue text-pastel-blueText',
    description: 'Course Evaluator • Inspecting Empirical Bayes simulation & unit economics',
    defaultRoute: '/admin',
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
      }
    } catch (_) {}
  }, []);

  const setPersonaType = (type: PersonaType) => {
    setPersonaTypeState(type);
    try {
      localStorage.setItem('pcos_active_persona_type', type);
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
