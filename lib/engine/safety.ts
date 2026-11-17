import { CandidateIntervention, UserHealthContext } from './types';

export interface SafetyCheckResult {
  isSafe: boolean;
  reasonsBlocked: string[];
  requiresDoctorUnlock: boolean;
}

/**
 * Evaluates whether an intervention is safe and appropriate for a patient's context.
 */
export function evaluateInterventionSafety(
  intervention: CandidateIntervention,
  context: UserHealthContext,
  doctorApproved: boolean = false
): SafetyCheckResult {
  const reasonsBlocked: string[] = [];

  // 1. Pregnancy Safety Gate
  if (context.isPregnant) {
    if (intervention.code === 'spearmint_tea') {
      reasonsBlocked.push(
        'Spearmint tea is contraindicated during pregnancy due to potential emmenagogue effects.'
      );
    }
    if (intervention.code === 'strength_training') {
      reasonsBlocked.push(
        'High-intensity strength training requires obstetrician clearance during pregnancy.'
      );
    }
  }

  // 2. Budget constraint check
  if (
    context.monthlyBudgetINR > 0 &&
    intervention.monthlyCostINR > context.monthlyBudgetINR
  ) {
    reasonsBlocked.push(
      `Estimated cost (₹${intervention.monthlyCostINR}/mo) exceeds your configured health budget (₹${context.monthlyBudgetINR}/mo).`
    );
  }

  // 3. Drug-supplement interaction checks
  const medListLower = context.currentMedicines.map((m) => m.toLowerCase());

  if (intervention.code === 'myo_inositol') {
    // Check if already on Metformin
    const onMetformin = medListLower.some(
      (m) => m.includes('metformin') || m.includes('glycomet')
    );
    if (onMetformin && !doctorApproved) {
      reasonsBlocked.push(
        'Concurrent Metformin and high-dose Inositol can cause hypoglycemia; requires specialist supervision.'
      );
    }
  }

  if (intervention.code === 'vitamin_d') {
    // Only recommended if deficiency was flagged or under guidance
    if (!doctorApproved) {
      // Locked pending doctor approval
    }
  }

  // 4. Contraindication match against patient reported symptoms or conditions
  for (const contra of intervention.contraindications) {
    const contraLower = contra.toLowerCase();
    for (const symptom of context.symptoms) {
      if (contraLower.includes(symptom.toLowerCase())) {
        reasonsBlocked.push(`Contraindicated with reported symptom: ${symptom}`);
      }
    }
  }

  // 5. Doctor approval gate
  const requiresDoctorUnlock =
    intervention.requiresDoctorApproval && !doctorApproved;

  const isSafe = reasonsBlocked.length === 0;

  return {
    isSafe,
    reasonsBlocked,
    requiresDoctorUnlock,
  };
}

/**
 * Filters an entire intervention library to safe candidates
 */
export function filterSafeInterventions(
  library: CandidateIntervention[],
  context: UserHealthContext,
  approvedCodes: Set<string> = new Set()
): {
  safe: CandidateIntervention[];
  lockedAwaitingDoctor: CandidateIntervention[];
  contraindicated: { intervention: CandidateIntervention; reasons: string[] }[];
} {
  const safe: CandidateIntervention[] = [];
  const lockedAwaitingDoctor: CandidateIntervention[] = [];
  const contraindicated: {
    intervention: CandidateIntervention;
    reasons: string[];
  }[] = [];

  for (const item of library) {
    const isApproved = approvedCodes.has(item.code);
    const safety = evaluateInterventionSafety(item, context, isApproved);

    if (!safety.isSafe) {
      contraindicated.push({
        intervention: item,
        reasons: safety.reasonsBlocked,
      });
    } else if (safety.requiresDoctorUnlock) {
      lockedAwaitingDoctor.push(item);
    } else {
      safe.push(item);
    }
  }

  return { safe, lockedAwaitingDoctor, contraindicated };
}
