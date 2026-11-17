/**
 * Type definitions for the Deterministic N-of-1 Experiment Engine
 * Generative AI has NO write access to these types or functions.
 */

export type CyclePhase = 'menstrual' | 'follicular' | 'luteal';

export type ExperimentPhase = 'baseline' | 'intervention';

export interface DailyObservation {
  dayIndex: number;
  date: string; // YYYY-MM-DD
  phase: ExperimentPhase;
  cyclePhase: CyclePhase;
  value: number; // primary outcome metric score
  adhered: boolean;
}

export type Verdict = 'LIKELY_WORKED' | 'LIKELY_DID_NOT_WORK' | 'INCONCLUSIVE';

export interface PriorDistribution {
  interventionCode: string;
  phenotype: string;
  mean: number; // mu_0
  variance: number; // tau_0^2
  sampleSize: number; // N historical trials
  source: string;
}

export interface ExperimentResult {
  effectEstimate: number; // delta hat
  standardError: number; // SE after autocorrelation & adherence adjustment
  rawEffect: number; // unadjusted delta
  cyclePhaseAdjusted: boolean;
  autocorrelationRho: number;
  adherenceRate: number; // 0.0 to 1.0
  priorMean: number;
  priorVariance: number;
  posteriorMean: number;
  posteriorVariance: number;
  probBeneficial: number; // P(benefit > MCID) in the beneficial direction
  credibleInterval90: [number, number]; // 90% credible interval [low, high]
  verdict: Verdict;
  beneficialDirection: 'higher' | 'lower';
  mcid: number;
}

export interface CandidateIntervention {
  id: string;
  code: string;
  name: string;
  category: 'diet' | 'supplement' | 'exercise' | 'sleep';
  protocol: string;
  baselineDays: number;
  interventionDays: number;
  primaryMetric: string;
  secondaryMetrics: string[];
  mcid: number;
  monthlyCostINR: number;
  contraindications: string[];
  requiresDoctorApproval: boolean;
  evidenceLevel: 'high' | 'moderate' | 'low';
  description: string;
}

export interface UserHealthContext {
  userId: string;
  phenotype: string; // Phenotype_A, Phenotype_B, Phenotype_C, Phenotype_D, None
  symptoms: string[];
  currentMedicines: string[];
  monthlyBudgetINR: number;
  isPregnant: boolean;
  completedInterventionCodes: string[];
}
