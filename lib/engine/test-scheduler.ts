export interface TestRecommendationRuleInput {
  hasBaselineLabsInLast6Months: boolean;
  isInsulinResistant: boolean;
  activeExperimentCode?: string;
  activeExperimentDaysRemaining?: number;
  lastHba1cDate?: string;
  hasVitaminDDeficiency: boolean;
  vitaminDSupplementationStartDate?: string;
}

export interface ScheduledTestRecommendation {
  testName: string;
  canonicalName: string;
  reason: string;
  urgency: 'routine' | 'recommended' | 'urgent';
  estimatedCostINR: number;
  dueWithinDays: number;
}

/**
 * Deterministic Test Scheduling Engine (Strictly rules-based, no LLM)
 */
export function scheduleDiagnosticTests(
  input: TestRecommendationRuleInput
): ScheduledTestRecommendation[] {
  const recommendations: ScheduledTestRecommendation[] = [];

  // Rule 1: Baseline panel required if no recent lab work in past 6 months
  if (!input.hasBaselineLabsInLast6Months) {
    recommendations.push({
      testName: 'Complete PCOS Diagnostic Panel (Metabolic + Hormonal)',
      canonicalName: 'baseline_pcos_panel',
      reason: 'No comprehensive panel on record in the last 6 months. Required to establish clinical baseline.',
      urgency: 'recommended',
      estimatedCostINR: 1499,
      dueWithinDays: 7,
    });
  }

  // Rule 2: Insulin resistance monitoring (HbA1c & Fasting Insulin every 3-6 months)
  if (input.isInsulinResistant) {
    recommendations.push({
      testName: 'Fasting Serum Insulin & HOMA-IR Evaluation',
      canonicalName: 'fasting_insulin',
      reason: 'Regular quarterly monitoring to assess peripheral insulin receptor sensitivity.',
      urgency: 'recommended',
      estimatedCostINR: 650,
      dueWithinDays: 21,
    });
  }

  // Rule 3: Experiment completion biomarker endpoint
  if (
    input.activeExperimentCode &&
    input.activeExperimentDaysRemaining !== undefined &&
    input.activeExperimentDaysRemaining <= 14
  ) {
    recommendations.push({
      testName: 'Post-Trial Biomarker Assessment',
      canonicalName: 'trial_endpoint_retest',
      reason: `Timed to conclude alongside your active trial (${input.activeExperimentCode}) to measure objective metabolic response.`,
      urgency: 'recommended',
      estimatedCostINR: 850,
      dueWithinDays: input.activeExperimentDaysRemaining,
    });
  }

  // Rule 4: Vitamin D retest 3 months after starting supplementation
  if (input.hasVitaminDDeficiency) {
    recommendations.push({
      testName: 'Serum 25-OH Vitamin D Total',
      canonicalName: 'vitamin_d',
      reason: 'Follow-up test 3 months post-supplementation to verify target levels (40–60 ng/mL) without toxicity.',
      urgency: 'routine',
      estimatedCostINR: 750,
      dueWithinDays: 45,
    });
  }

  return recommendations;
}
