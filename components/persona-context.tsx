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
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
    avatarText: 'PS',
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
    badgeClass: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800',
    avatarText: 'AS',
    description: 'Specialist • Reviewing patient clinical summaries & approving trial protocols',
    defaultRoute: '/doctors',
  },
  admin: {
    id: 'course_admin',
    type: 'admin',
    name: 'Prof. / Course Admin',
    roleTitle: 'IIM-A Economics of AI',
    badge: 'Faculty / Admin',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    avatarText: 'EA',
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

  // Hydrate from localStorage on client mount
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
    // Fallback if rendered outside provider
    return {
      currentPersona: PERSONAS.patient,
      setPersonaType: () => {},
      allPersonas: Object.values(PERSONAS),
    };
  }
  return context;
}
