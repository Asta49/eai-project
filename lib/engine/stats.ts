import {
  DailyObservation,
  ExperimentResult,
  PriorDistribution,
  Verdict,
} from './types';

/**
 * Standard Normal Cumulative Distribution Function Phi(z)
 * Uses high-precision Hart/Abramowitz-Stegun rational approximation
 */
export function normalCdf(z: number): number {
  if (isNaN(z)) return 0.5;
  if (z < -8.0) return 0.0;
  if (z > 8.0) return 1.0;

  // Abramowitz and Stegun 7.1.26
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z) / Math.SQRT2;

  const t = 1.0 / (1.0 + p * absZ);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ);

  return 0.5 * (1.0 + sign * y);
}

/**
 * Solves OLS regression using normal equations (X^T X)^{-1} X^T Y
 * Model: y = beta_0 + delta * isIntervention + gamma_follicular * isFollicular + gamma_luteal * isLuteal
 * Baseline menstrual phase is the reference category.
 */
export function fitCycleAdjustedOLS(observations: DailyObservation[]): {
  deltaHat: number;
  seDelta: number;
  residuals: number[];
  rSquared: number;
} {
  const n = observations.length;
  if (n < 4) {
    throw new Error('Insufficient observations for regression analysis (minimum 4 days required)');
  }

  // Construct design matrix X and target vector Y
  const k = 4;
  const X: number[][] = [];
  const Y: number[] = [];

  for (const obs of observations) {
    const isIntervention = obs.phase === 'intervention' ? 1 : 0;
    const isFollicular = obs.cyclePhase === 'follicular' ? 1 : 0;
    const isLuteal = obs.cyclePhase === 'luteal' ? 1 : 0;
    X.push([1, isIntervention, isFollicular, isLuteal]);
    Y.push(obs.value);
  }

  // Compute X^T X (k x k matrix)
  const XtX: number[][] = Array.from({ length: k }, () => Array(k).fill(0));
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      let sum = 0;
      for (let r = 0; r < n; r++) {
        sum += X[r][i] * X[r][j];
      }
      XtX[i][j] = sum;
    }
  }

  // Compute X^T Y (k x 1 vector)
  const XtY: number[] = Array(k).fill(0);
  for (let i = 0; i < k; i++) {
    let sum = 0;
    for (let r = 0; r < n; r++) {
      sum += X[r][i] * Y[r];
    }
    XtY[i] = sum;
  }

  // Invert matrix XtX
  const invXtX = invertMatrix(XtX);

  // Compute Beta = (X^T X)^{-1} X^T Y
  const beta: number[] = Array(k).fill(0);
  for (let i = 0; i < k; i++) {
    let sum = 0;
    for (let j = 0; j < k; j++) {
      sum += invXtX[i][j] * XtY[j];
    }
    beta[i] = sum;
  }

  // Compute residuals e = Y - X * beta
  const residuals: number[] = [];
  let sse = 0;
  let totalSumY = 0;
  for (let r = 0; r < n; r++) {
    let pred = 0;
    for (let i = 0; i < k; i++) {
      pred += X[r][i] * beta[i];
    }
    const e = Y[r] - pred;
    residuals.push(e);
    sse += e * e;
    totalSumY += Y[r];
  }

  const yMean = totalSumY / n;
  let sst = 0;
  for (let r = 0; r < n; r++) {
    sst += (Y[r] - yMean) * (Y[r] - yMean);
  }

  const df = Math.max(1, n - k);
  const sigmaSquared = sse / df;
  const rSquared = sst > 0 ? Math.max(0, 1 - sse / sst) : 0;

  const varDelta = Math.max(1e-8, sigmaSquared * invXtX[1][1]);
  const seDelta = Math.sqrt(varDelta);

  return {
    deltaHat: beta[1],
    seDelta,
    residuals,
    rSquared,
  };
}

/**
 * Estimates lag-1 autocorrelation rho from residuals
 * Centers residuals around mean, clamps rho between -0.85 and 0.85
 */
export function estimateAutocorrelationRho(residuals: number[]): number {
  const n = residuals.length;
  if (n < 3) return 0;

  const mean = residuals.reduce((a, b) => a + b, 0) / n;
  let numerator = 0;
  let denominator = 0;

  for (let t = 1; t < n; t++) {
    numerator += (residuals[t] - mean) * (residuals[t - 1] - mean);
  }
  for (let t = 0; t < n; t++) {
    denominator += (residuals[t] - mean) * (residuals[t] - mean);
  }

  if (denominator === 0) return 0;
  const rawRho = numerator / denominator;
  return Math.max(-0.85, Math.min(0.85, rawRho));
}

/**
 * Inverts a square matrix using Gauss-Jordan elimination with partial pivoting
 */
function invertMatrix(matrix: number[][]): number[][] {
  const n = matrix.length;
  const aug: number[][] = matrix.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  ]);

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(aug[r][i]) > Math.abs(aug[maxRow][i])) {
        maxRow = r;
      }
    }

    if (Math.abs(aug[maxRow][i]) < 1e-12) {
      aug[i][i] += 1e-4;
    } else if (maxRow !== i) {
      const temp = aug[i];
      aug[i] = aug[maxRow];
      aug[maxRow] = temp;
    }

    const pivot = aug[i][i];
    for (let c = 0; c < 2 * n; c++) {
      aug[i][c] /= pivot;
    }

    for (let r = 0; r < n; r++) {
      if (r !== i) {
        const factor = aug[r][i];
        for (let c = 0; c < 2 * n; c++) {
          aug[r][c] -= factor * aug[i][c];
        }
      }
    }
  }

  return aug.map((row) => row.slice(n));
}

/**
 * Deterministic Bayesian Conjugate Normal-Normal Update and Verdict Computation
 */
export function analyzeExperiment(
  observations: DailyObservation[],
  prior: PriorDistribution,
  mcid: number,
  beneficialDirection: 'higher' | 'lower' = 'higher'
): ExperimentResult {
  if (observations.length < 5) {
    throw new Error('A minimum of 5 daily check-in observations is required to evaluate an experiment.');
  }

  // 1. Unadjusted raw effect
  const baselineObs = observations.filter((o) => o.phase === 'baseline');
  const interventionObs = observations.filter((o) => o.phase === 'intervention');

  if (baselineObs.length === 0 || interventionObs.length === 0) {
    throw new Error('Both baseline and intervention phase observations must be present.');
  }

  const baselineMean =
    baselineObs.reduce((s, o) => s + o.value, 0) / baselineObs.length;
  const interventionMean =
    interventionObs.reduce((s, o) => s + o.value, 0) / interventionObs.length;
  const rawEffect = interventionMean - baselineMean;

  // 2. Cycle-phase adjusted OLS regression
  const ols = fitCycleAdjustedOLS(observations);
  const deltaHat = ols.deltaHat;
  let seAdj = ols.seDelta;

  // 3. Autocorrelation AR(1) inflation: sqrt((1 + rho) / (1 - rho))
  const rho = estimateAutocorrelationRho(ols.residuals);
  const autoCorrFactor = Math.sqrt((1 + rho) / (1 - rho));
  seAdj *= autoCorrFactor;

  // 4. Adherence weighting
  const adheredCount = interventionObs.filter((o) => o.adhered).length;
  const adherenceRate = adheredCount / interventionObs.length;

  if (adherenceRate < 0.7) {
    const effectiveAdherence = Math.max(0.2, adherenceRate);
    seAdj *= 1 / Math.sqrt(effectiveAdherence);
  }

  const sampleVariance = seAdj * seAdj;

  // 5. Normal-Normal conjugate Bayesian update
  const tau0Sq = Math.max(1e-4, prior.variance);
  const mu0 = prior.mean;

  const precisionPrior = 1 / tau0Sq;
  const precisionLikelihood = 1 / sampleVariance;
  const precisionPosterior = precisionPrior + precisionLikelihood;

  const posteriorVariance = 1 / precisionPosterior;
  const posteriorMean =
    (mu0 * precisionPrior + deltaHat * precisionLikelihood) / precisionPosterior;
  const posteriorStd = Math.sqrt(posteriorVariance);

  // 6. Probability of clinical benefit > MCID
  let probBeneficial: number;
  if (beneficialDirection === 'higher') {
    const z = (mcid - posteriorMean) / posteriorStd;
    probBeneficial = 1 - normalCdf(z);
  } else {
    const z = (-mcid - posteriorMean) / posteriorStd;
    probBeneficial = normalCdf(z);
  }

  // 7. 90% Credible Interval [5th percentile, 95th percentile]
  const z90 = 1.644853;
  const credibleInterval90: [number, number] = [
    posteriorMean - z90 * posteriorStd,
    posteriorMean + z90 * posteriorStd,
  ];

  // 8. Verdict Decision Rules
  let verdict: Verdict;
  if (probBeneficial >= 0.8) {
    verdict = 'LIKELY_WORKED';
  } else if (probBeneficial <= 0.2) {
    verdict = 'LIKELY_DID_NOT_WORK';
  } else {
    verdict = 'INCONCLUSIVE';
  }

  return {
    effectEstimate: Number(deltaHat.toFixed(4)),
    standardError: Number(seAdj.toFixed(4)),
    rawEffect: Number(rawEffect.toFixed(4)),
    cyclePhaseAdjusted: true,
    autocorrelationRho: Number(rho.toFixed(4)),
    adherenceRate: Number(adherenceRate.toFixed(4)),
    priorMean: Number(mu0.toFixed(4)),
    priorVariance: Number(tau0Sq.toFixed(4)),
    posteriorMean: Number(posteriorMean.toFixed(4)),
    posteriorVariance: Number(posteriorVariance.toFixed(4)),
    probBeneficial: Number(probBeneficial.toFixed(4)),
    credibleInterval90: [
      Number(credibleInterval90[0].toFixed(4)),
      Number(credibleInterval90[1].toFixed(4)),
    ],
    verdict,
    beneficialDirection,
    mcid,
  };
}
