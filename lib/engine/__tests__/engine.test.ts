import { describe, it, expect } from 'vitest';
import {
  normalCdf,
  fitCycleAdjustedOLS,
  estimateAutocorrelationRho,
  analyzeExperiment,
} from '../stats';
import {
  getPrior,
  updatePriorWithEmpiricalBayes,
  SEED_POPULATION_PRIORS,
} from '../priors';
import { evaluateInterventionSafety, filterSafeInterventions } from '../safety';
import { recommendNextExperiments } from '../recommender';
import { estimatePhenotype } from '../phenotype';
import { runNetworkEffectSimulation } from '../simulation';
import { scheduleDiagnosticTests } from '../test-scheduler';
import {
  CandidateIntervention,
  DailyObservation,
  UserHealthContext,
} from '../types';

describe('Deterministic Stats Engine: Normal CDF & OLS', () => {
  it('computes standard normal CDF accurately', () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 4);
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 3);
    expect(normalCdf(-1.96)).toBeCloseTo(0.025, 3);
    expect(normalCdf(2.576)).toBeCloseTo(0.995, 3);
  });

  it('adjusts for menstrual cycle phases in OLS regression', () => {
    const observations: DailyObservation[] = [];

    // 14 days baseline
    for (let day = 1; day <= 14; day++) {
      const cyclePhase = day <= 5 ? 'menstrual' : day <= 12 ? 'follicular' : 'luteal';
      const cycleOffset = cyclePhase === 'luteal' ? -0.8 : 0;
      observations.push({
        dayIndex: day,
        date: `2026-01-${String(day).padStart(2, '0')}`,
        phase: 'baseline',
        cyclePhase,
        value: 3.0 + cycleOffset + (day % 2 === 0 ? 0.1 : -0.1),
        adhered: true,
      });
    }

    // 28 days intervention
    for (let day = 15; day <= 42; day++) {
      const cycleDay = (day % 28) + 1;
      const cyclePhase = cycleDay <= 5 ? 'menstrual' : cycleDay <= 14 ? 'follicular' : 'luteal';
      const cycleOffset = cyclePhase === 'luteal' ? -0.8 : 0;
      observations.push({
        dayIndex: day,
        date: `2026-02-${String(day - 14).padStart(2, '0')}`,
        phase: 'intervention',
        cyclePhase,
        value: 4.5 + cycleOffset + (day % 2 === 0 ? 0.1 : -0.1), // true delta = 1.5
        adhered: true,
      });
    }

    const ols = fitCycleAdjustedOLS(observations);
    expect(ols.deltaHat).toBeCloseTo(1.5, 1);
    expect(ols.seDelta).toBeGreaterThan(0);
    expect(ols.residuals.length).toBe(observations.length);
  });

  it('inflates standard error when positive autocorrelation is present', () => {
    // Generate an AR(1) series with positive autocorrelation rho ~ 0.7
    const residuals: number[] = [0.2];
    for (let i = 1; i < 40; i++) {
      const prev = residuals[i - 1];
      residuals.push(0.7 * prev + 0.05 * Math.sin(i));
    }

    const rho = estimateAutocorrelationRho(residuals);
    expect(rho).toBeGreaterThan(0.3);
    const inflation = Math.sqrt((1 + rho) / (1 - rho));
    expect(inflation).toBeGreaterThan(1.3);
  });
});

describe('Deterministic Stats Engine: Recovery of Known True Effect', () => {
  it('correctly recovers a known effective treatment (delta = 1.2, MCID = 0.5) with LIKELY_WORKED verdict', () => {
    const observations: DailyObservation[] = [];
    const trueBaseline = 2.5;
    const trueDelta = 1.2;

    // 14 days baseline
    for (let d = 1; d <= 14; d++) {
      const cyclePhase = d <= 5 ? 'menstrual' : 'follicular';
      observations.push({
        dayIndex: d,
        date: `2026-03-${String(d).padStart(2, '0')}`,
        phase: 'baseline',
        cyclePhase,
        value: trueBaseline + 0.15 * Math.sin(d),
        adhered: true,
      });
    }

    // 28 days intervention with 90% adherence
    for (let d = 15; d <= 42; d++) {
      const cyclePhase = d <= 22 ? 'follicular' : 'luteal';
      observations.push({
        dayIndex: d,
        date: `2026-04-${String(d - 14).padStart(2, '0')}`,
        phase: 'intervention',
        cyclePhase,
        value: trueBaseline + trueDelta + 0.15 * Math.cos(d),
        adhered: d % 10 !== 0,
      });
    }

    const prior = getPrior('myo_inositol', 'Phenotype_A');
    const result = analyzeExperiment(observations, prior, 0.5, 'higher');

    expect(result.effectEstimate).toBeCloseTo(1.2, 1);
    expect(result.probBeneficial).toBeGreaterThanOrEqual(0.8);
    expect(result.verdict).toBe('LIKELY_WORKED');
    expect(result.credibleInterval90[0]).toBeLessThan(result.posteriorMean);
    expect(result.credibleInterval90[1]).toBeGreaterThan(result.posteriorMean);
  });

  it('correctly returns LIKELY_DID_NOT_WORK when an intervention produces no benefit', () => {
    const observations: DailyObservation[] = [];

    // 14 days baseline (energy = 3.5)
    for (let d = 1; d <= 14; d++) {
      observations.push({
        dayIndex: d,
        date: `2026-05-${String(d).padStart(2, '0')}`,
        phase: 'baseline',
        cyclePhase: 'follicular',
        value: 3.5 + 0.05 * Math.sin(d),
        adhered: true,
      });
    }

    // 28 days intervention with slight deterioration (energy = 3.1, MCID = 0.5)
    for (let d = 15; d <= 42; d++) {
      observations.push({
        dayIndex: d,
        date: `2026-06-${String(d - 14).padStart(2, '0')}`,
        phase: 'intervention',
        cyclePhase: 'luteal',
        value: 3.1 + 0.05 * Math.cos(d),
        adhered: true,
      });
    }

    const prior = {
      interventionCode: 'seed_cycling',
      phenotype: 'ALL',
      mean: 0.0,
      variance: 0.15,
      sampleSize: 30,
      source: 'Empirical prior',
    };

    const result = analyzeExperiment(observations, prior, 0.5, 'higher');
    expect(result.probBeneficial).toBeLessThanOrEqual(0.2);
    expect(result.verdict).toBe('LIKELY_DID_NOT_WORK');
  });

  it('widens standard error when adherence is below 70%', () => {
    const createObs = (adherenceRatio: number) => {
      const obs: DailyObservation[] = [];
      for (let d = 1; d <= 14; d++) {
        obs.push({
          dayIndex: d,
          date: `2026-07-${d}`,
          phase: 'baseline',
          cyclePhase: 'follicular',
          value: 3.0,
          adhered: true,
        });
      }
      for (let d = 15; d <= 42; d++) {
        const adhered = (d - 14) <= Math.round(28 * adherenceRatio);
        obs.push({
          dayIndex: d,
          date: `2026-08-${d - 14}`,
          phase: 'intervention',
          cyclePhase: 'luteal',
          value: 4.0,
          adhered,
        });
      }
      return obs;
    };

    const prior = getPrior('low_gi_diet', 'ALL');
    const highAdherenceResult = analyzeExperiment(createObs(0.9), prior, 0.5);
    const lowAdherenceResult = analyzeExperiment(createObs(0.4), prior, 0.5);

    expect(lowAdherenceResult.standardError).toBeGreaterThan(
      highAdherenceResult.standardError
    );
  });
});

describe('Empirical Bayes Prior Updates & Network Effect', () => {
  it('shrinks prior variance and updates mean as more patient trials complete', () => {
    const prior = getPrior('low_gi_diet', 'Phenotype_A');
    const initialSampleSize = prior.sampleSize;

    // Simulate 20 completed trials in this cell
    const completedTrials = Array.from({ length: 20 }, (_, i) => ({
      effectEstimate: 1.25 + 0.1 * Math.sin(i),
      standardError: 0.35,
    }));

    const updated = updatePriorWithEmpiricalBayes(prior, completedTrials);

    expect(updated.sampleSize).toBe(initialSampleSize + 20);
    expect(updated.mean).toBeGreaterThan(1.1);
    expect(updated.variance).toBeLessThanOrEqual(prior.variance);
  });
});

describe('Safety Filter Engine', () => {
  const sampleLibrary: CandidateIntervention[] = [
    {
      id: '1',
      code: 'spearmint_tea',
      name: 'Spearmint Tea',
      category: 'supplement',
      protocol: 'Drink 2 cups daily',
      baselineDays: 14,
      interventionDays: 28,
      primaryMetric: 'acne',
      secondaryMetrics: ['hirsutism'],
      mcid: 0.5,
      monthlyCostINR: 350,
      contraindications: ['pregnancy'],
      requiresDoctorApproval: false,
      evidenceLevel: 'moderate',
      description: 'Anti-androgenic herbal tea',
    },
    {
      id: '2',
      code: 'myo_inositol',
      name: 'Myo-Inositol',
      category: 'supplement',
      protocol: '2000mg twice daily',
      baselineDays: 14,
      interventionDays: 42,
      primaryMetric: 'cycle_regularity',
      secondaryMetrics: ['energy'],
      mcid: 0.8,
      monthlyCostINR: 1200,
      contraindications: ['severe_kidney_disease'],
      requiresDoctorApproval: true,
      evidenceLevel: 'high',
      description: 'Insulin-sensitizing inositol',
    },
    {
      id: '3',
      code: 'daily_walk',
      name: '30-min Daily Walk',
      category: 'exercise',
      protocol: 'Brisk walking daily',
      baselineDays: 14,
      interventionDays: 28,
      primaryMetric: 'energy',
      secondaryMetrics: ['mood'],
      mcid: 0.5,
      monthlyCostINR: 0,
      contraindications: [],
      requiresDoctorApproval: false,
      evidenceLevel: 'high',
      description: 'Low-impact aerobic baseline',
    },
  ];

  it('blocks contraindicated interventions during pregnancy', () => {
    const context: UserHealthContext = {
      userId: 'test_user_pregnant',
      phenotype: 'Phenotype_A',
      symptoms: ['acne'],
      currentMedicines: [],
      monthlyBudgetINR: 2000,
      isPregnant: true,
      completedInterventionCodes: [],
    };

    const safety = evaluateInterventionSafety(sampleLibrary[0], context);
    expect(safety.isSafe).toBe(false);
    expect(safety.reasonsBlocked.length).toBeGreaterThan(0);
  });

  it('flags interventions that require doctor approval', () => {
    const context: UserHealthContext = {
      userId: 'test_user_normal',
      phenotype: 'Phenotype_A',
      symptoms: ['irregular_periods'],
      currentMedicines: [],
      monthlyBudgetINR: 2000,
      isPregnant: false,
      completedInterventionCodes: [],
    };

    const safety = evaluateInterventionSafety(sampleLibrary[1], context, false);
    expect(safety.requiresDoctorUnlock).toBe(true);

    const safetyApproved = evaluateInterventionSafety(sampleLibrary[1], context, true);
    expect(safetyApproved.requiresDoctorUnlock).toBe(false);
  });

  it('filters interventions exceeding the monthly budget', () => {
    const context: UserHealthContext = {
      userId: 'test_user_budget',
      phenotype: 'Phenotype_B',
      symptoms: [],
      currentMedicines: [],
      monthlyBudgetINR: 500,
      isPregnant: false,
      completedInterventionCodes: [],
    };

    const result = filterSafeInterventions(sampleLibrary, context);
    expect(result.contraindicated.some((c) => c.intervention.code === 'myo_inositol')).toBe(true);
  });
});

describe('Thompson Sampling Recommender', () => {
  it('generates reproducible top-3 recommendations with fixed seed', () => {
    const library: CandidateIntervention[] = [
      {
        id: '1',
        code: 'low_gi_diet',
        name: 'Low-GI Indian Diet',
        category: 'diet',
        protocol: 'Swap high-GI foods for pulses, millets, whole grains',
        baselineDays: 14,
        interventionDays: 28,
        primaryMetric: 'energy',
        secondaryMetrics: ['cravings'],
        mcid: 0.5,
        monthlyCostINR: 200,
        contraindications: [],
        requiresDoctorApproval: false,
        evidenceLevel: 'high',
        description: 'Balances postprandial glucose',
      },
      {
        id: '2',
        code: 'daily_walk',
        name: '30-min Daily Walk',
        category: 'exercise',
        protocol: 'Walk at moderate pace',
        baselineDays: 14,
        interventionDays: 28,
        primaryMetric: 'energy',
        secondaryMetrics: ['mood'],
        mcid: 0.5,
        monthlyCostINR: 0,
        contraindications: [],
        requiresDoctorApproval: false,
        evidenceLevel: 'high',
        description: 'Aerobic activity',
      },
      {
        id: '3',
        code: 'cut_sugary_chai',
        name: 'Cut Sugary Chai',
        category: 'diet',
        protocol: 'Replace sweetened chai with unsweetened or green tea',
        baselineDays: 14,
        interventionDays: 21,
        primaryMetric: 'cravings',
        secondaryMetrics: ['energy'],
        mcid: 0.5,
        monthlyCostINR: 0,
        contraindications: [],
        requiresDoctorApproval: false,
        evidenceLevel: 'high',
        description: 'Liquid sugar removal',
      },
      {
        id: '4',
        code: 'seed_cycling',
        name: 'Seed Cycling',
        category: 'diet',
        protocol: 'Flax & pumpkin seeds daily',
        baselineDays: 14,
        interventionDays: 28,
        primaryMetric: 'cycle_regularity',
        secondaryMetrics: [],
        mcid: 0.5,
        monthlyCostINR: 800,
        contraindications: [],
        requiresDoctorApproval: false,
        evidenceLevel: 'low',
        description: 'Unverified holistic approach',
      },
    ];

    const context: UserHealthContext = {
      userId: 'priya_test',
      phenotype: 'Phenotype_A',
      symptoms: ['irregular_periods', 'cravings'],
      currentMedicines: [],
      monthlyBudgetINR: 2500,
      isPregnant: false,
      completedInterventionCodes: [],
    };

    const recs1 = recommendNextExperiments(library, context, SEED_POPULATION_PRIORS, { seed: 100 });
    const recs2 = recommendNextExperiments(library, context, SEED_POPULATION_PRIORS, { seed: 100 });

    expect(recs1.length).toBe(3);
    expect(recs1[0].intervention.code).toBe(recs2[0].intervention.code);
    expect(recs1[0].totalScore).toBe(recs2[0].totalScore);
    expect(recs1.map((r) => r.intervention.code)).not.toContain('seed_cycling');
  });
});

describe('Phenotype & Metabolic Estimator', () => {
  it('correctly classifies Phenotype A (all 3 Rotterdam features)', () => {
    const assessment = estimatePhenotype({
      hasIrregularCycles: true,
      typicalCycleLengthDays: 45,
      hasHyperandrogenismSymptoms: true,
      hasPcomUltrasound: true,
      heightCm: 160,
      weightKg: 68,
      fastingGlucoseMgDl: 95,
      fastingInsulinMicroUml: 14.5,
    });

    expect(assessment.phenotype).toBe('Phenotype_A');
    expect(assessment.bmiCategory).toBe('overweight');
    expect(assessment.insulinResistanceFlag).toBe(true);
    expect(assessment.homaIr).toBeCloseTo(3.4, 1);
  });

  it('correctly classifies Phenotype C (ovulatory with hyperandrogenism + PCOM)', () => {
    const assessment = estimatePhenotype({
      hasIrregularCycles: false,
      typicalCycleLengthDays: 29,
      hasHyperandrogenismSymptoms: true,
      hasPcomUltrasound: true,
      heightCm: 165,
      weightKg: 55,
    });

    expect(assessment.phenotype).toBe('Phenotype_C');
    expect(assessment.criteriaMet.ovulatoryDysfunction).toBe(false);
    expect(assessment.criteriaMet.hyperandrogenism).toBe(true);
    expect(assessment.criteriaMet.polycysticMorphology).toBe(true);
    expect(assessment.bmiCategory).toBe('normal');
  });

  it('correctly classifies Phenotype B and Phenotype D', () => {
    // Phenotype B: Ovulatory dysfunction + hyperandrogenism, normal ultrasound
    const b = estimatePhenotype({
      hasIrregularCycles: true,
      typicalCycleLengthDays: 45,
      hasHyperandrogenismSymptoms: true,
      hasPcomUltrasound: false,
      heightCm: 162,
      weightKg: 62,
    });
    expect(b.phenotype).toBe('Phenotype_B');

    // Phenotype D: Ovulatory dysfunction + PCOM, no hyperandrogenism
    const d = estimatePhenotype({
      hasIrregularCycles: true,
      typicalCycleLengthDays: 40,
      hasHyperandrogenismSymptoms: false,
      hasPcomUltrasound: true,
      heightCm: 158,
      weightKg: 50,
    });
    expect(d.phenotype).toBe('Phenotype_D');
  });
});

describe('Diagnostic Test Scheduler (Deterministic Rules)', () => {
  it('schedules baseline panel when no labs in past 6 months', () => {
    const tests = scheduleDiagnosticTests({
      hasBaselineLabsInLast6Months: false,
      isInsulinResistant: true,
      hasVitaminDDeficiency: true,
      activeExperimentCode: 'low_gi_diet',
      activeExperimentDaysRemaining: 5,
    });

    const canonicals = tests.map((t) => t.canonicalName);
    expect(canonicals).toContain('baseline_pcos_panel');
    expect(canonicals).toContain('fasting_insulin');
    expect(canonicals).toContain('trial_endpoint_retest');
    expect(canonicals).toContain('vitamin_d');
  });

  it('schedules minimal routine tests when healthy baseline exists', () => {
    const tests = scheduleDiagnosticTests({
      hasBaselineLabsInLast6Months: true,
      isInsulinResistant: false,
      hasVitaminDDeficiency: false,
    });

    expect(tests.length).toBe(0);
  });
});

describe('Economics of AI & Network Moat Simulation', () => {
  it('simulates empirical Bayes variance shrinkage and days saved over flat priors', () => {
    const results = runNetworkEffectSimulation(2000, 299, 12.5, 50.0);

    expect(results.cohortCurve.length).toBe(6);
    const lastCohort = results.cohortCurve[results.cohortCurve.length - 1];
    
    // As patient cohort grows to 2000, pooled prior days to verdict shrinks significantly below flat prior
    expect(lastCohort.pooledPriorDaysToVerdict).toBeLessThan(lastCohort.flatPriorDaysToVerdict);
    expect(lastCohort.pooledPriorAccuracyPercent).toBeGreaterThan(lastCohort.flatPriorAccuracyPercent);
    expect(results.summaryHighlight.daysSavedPercent).toBeGreaterThan(30);

    // Unit economics verification
    expect(results.unitEconomics.grossMarginPercent).toBeGreaterThan(90);
    expect(results.unitEconomics.ltvToCacRatio).toBeGreaterThan(3);
    expect(results.unitEconomics.monthlyAiCostPerUserINR).toBeLessThan(15);
  });
});
