import { CandidateIntervention, PriorDistribution, UserHealthContext } from './types';
import { getPrior, SEED_POPULATION_PRIORS } from './priors';
import { filterSafeInterventions } from './safety';

export interface RecommendationScore {
  intervention: CandidateIntervention;
  sampledEffect: number;
  effectToMcidRatio: number;
  costPenalty: number;
  noveltyBonus: number;
  totalScore: number;
  reason: string;
}

/**
 * Seedable PRNG (Mulberry32) for reproducible Thompson Sampling in tests and demos
 */
export function createRNG(seed: number = 42): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Box-Muller transform to sample from standard normal N(0, 1) using custom RNG
 */
export function sampleStandardNormal(rng: () => number): number {
  let u1 = rng();
  let u2 = rng();
  // Avoid u1 = 0
  while (u1 <= 1e-15) {
    u1 = rng();
  }
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

/**
 * Sample from N(mean, variance)
 */
export function sampleNormal(
  mean: number,
  variance: number,
  rng: () => number
): number {
  const std = Math.sqrt(Math.max(1e-4, variance));
  return mean + std * sampleStandardNormal(rng);
}

/**
 * Thompson Sampling Recommender for Next Experiment Selection
 *
 * Formula:
 * Score = (sampled_effect / MCID) - lambda * (monthlyCost / budget) + noveltyBonus
 */
export function recommendNextExperiments(
  library: CandidateIntervention[],
  context: UserHealthContext,
  priors: PriorDistribution[] = SEED_POPULATION_PRIORS,
  options: {
    topK?: number;
    seed?: number;
    costPenaltyLambda?: number;
    noveltyBonusAmount?: number;
    approvedCodes?: Set<string>;
  } = {}
): RecommendationScore[] {
  const topK = options.topK ?? 3;
  const rng = createRNG(options.seed ?? 1337);
  const lambda = options.costPenaltyLambda ?? 0.35;
  const noveltyBonus = options.noveltyBonusAmount ?? 0.25;
  const approvedCodes = options.approvedCodes ?? new Set<string>();

  // 1. Safety filtering
  const { safe, lockedAwaitingDoctor } = filterSafeInterventions(
    library,
    context,
    approvedCodes
  );

  // Consider all safe interventions + interventions that could be proposed for doctor approval
  const candidates = [...safe, ...lockedAwaitingDoctor];

  const scores: RecommendationScore[] = [];

  for (const candidate of candidates) {
    // Retrieve prior for patient's phenotype
    const prior = getPrior(candidate.code, context.phenotype, priors);

    // Draw Thompson sample from N(mu_0, tau_0^2)
    const sampledEffect = sampleNormal(prior.mean, prior.variance, rng);

    // Normalised effect ratio
    const effectToMcidRatio = sampledEffect / Math.max(0.1, candidate.mcid);

    // Cost penalty: lambda * (cost / budget)
    const budget = Math.max(500, context.monthlyBudgetINR);
    const costRatio = candidate.monthlyCostINR / budget;
    const costPenalty = lambda * Math.min(2.0, costRatio);

    // Novelty bonus for uncompleted interventions
    const alreadyCompleted = context.completedInterventionCodes.includes(
      candidate.code
    );
    const bonus = alreadyCompleted ? 0 : noveltyBonus;

    const totalScore = effectToMcidRatio - costPenalty + bonus;

    // Build plain clinical reason
    let reason = '';
    if (candidate.code === 'low_gi_diet' && context.phenotype === 'Phenotype_A') {
      reason =
        'High probability of reducing insulin resistance and stabilizing energy in Rotterdam Phenotype A.';
    } else if (candidate.code === 'myo_inositol') {
      reason =
        'Strong clinical prior for restoring cycle regularity and ovulatory function.';
    } else if (candidate.code === 'strength_training') {
      reason =
        'Improves peripheral glucose uptake and basal metabolic rate with zero supplement cost.';
    } else if (candidate.code === 'spearmint_tea') {
      reason =
        'Targeted mild anti-androgenic effect for hirsutism and hormonal acne.';
    } else if (candidate.code === 'daily_walk') {
      reason =
        'Lowest barrier to entry, zero financial cost, highly consistent baseline stabilizer.';
    } else {
      reason = `Matches your phenotype with an estimated ${(sampledEffect).toFixed(1)}x improvement over baseline.`;
    }

    scores.push({
      intervention: candidate,
      sampledEffect: Number(sampledEffect.toFixed(3)),
      effectToMcidRatio: Number(effectToMcidRatio.toFixed(3)),
      costPenalty: Number(costPenalty.toFixed(3)),
      noveltyBonus: Number(bonus.toFixed(3)),
      totalScore: Number(totalScore.toFixed(3)),
      reason,
    });
  }

  // Rank by total score descending
  scores.sort((a, b) => b.totalScore - a.totalScore);

  return scores.slice(0, topK);
}
