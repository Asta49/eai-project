/**
 * Deterministic Rotterdam Phenotype Estimator & Metabolic Risk Engine
 * Rules-based implementation based on 2023 International Evidence-based PCOS Guidelines.
 */

export interface PhenotypeInput {
  hasIrregularCycles: boolean; // Cycle length > 35 days or irregular periods
  typicalCycleLengthDays?: number;
  hasHyperandrogenismSymptoms: boolean; // Hirsutism, acne, hair thinning
  hasHighAndrogensLab?: boolean; // Total / Free Testosterone > reference
  hasPcomUltrasound?: boolean; // PCO morphology on ultrasound
  highAmhLab?: boolean; // AMH > 3.5 ng/mL (established surrogate)
  fastingGlucoseMgDl?: number;
  fastingInsulinMicroUml?: number;
  heightCm: number;
  weightKg: number;
  symptomsList?: string[];
}

export interface PhenotypeAssessment {
  phenotype: 'Phenotype_A' | 'Phenotype_B' | 'Phenotype_C' | 'Phenotype_D' | 'Unconfirmed';
  phenotypeName: string;
  description: string;
  criteriaMet: {
    ovulatoryDysfunction: boolean;
    hyperandrogenism: boolean;
    polycysticMorphology: boolean;
  };
  confidence: number;
  bmi: number;
  bmiCategory: 'lean' | 'normal' | 'overweight' | 'obese';
  homaIr?: number;
  insulinResistanceFlag: boolean;
  insulinResistanceReason: string;
  disclaimer: string;
}

export function estimatePhenotype(input: PhenotypeInput): PhenotypeAssessment {
  // 1. Ovulatory Dysfunction (OD)
  const od =
    input.hasIrregularCycles ||
    (input.typicalCycleLengthDays !== undefined &&
      (input.typicalCycleLengthDays > 35 || input.typicalCycleLengthDays < 21));

  // 2. Hyperandrogenism (HA) - Clinical or Biochemical
  const ha =
    input.hasHyperandrogenismSymptoms || Boolean(input.hasHighAndrogensLab);

  // 3. Polycystic Ovarian Morphology (PCOM)
  const pcom =
    Boolean(input.hasPcomUltrasound) || Boolean(input.highAmhLab);

  // Determine Rotterdam Phenotype (A, B, C, D)
  let phenotype: PhenotypeAssessment['phenotype'] = 'Unconfirmed';
  let phenotypeName = 'Unconfirmed Phenotype';
  let description =
    'Reported symptoms do not currently meet at least two of the three Rotterdam criteria. Further diagnostic evaluation recommended.';
  let confidence = 0.7;

  if (od && ha && pcom) {
    phenotype = 'Phenotype_A';
    phenotypeName = 'Phenotype A (Classic / Complete PCOS)';
    description =
      'Presents with all three Rotterdam features: irregular cycles, hyperandrogenism, and polycystic ovarian morphology. High risk for metabolic dysregulation and insulin resistance.';
    confidence = 0.95;
  } else if (od && ha && !pcom) {
    phenotype = 'Phenotype_B';
    phenotypeName = 'Phenotype B (Classic / Non-PCO Morphology)';
    description =
      'Features irregular cycles and hyperandrogenism without ultrasound PCO morphology. Frequently associated with metabolic and endocrine shifts.';
    confidence = 0.88;
  } else if (!od && ha && pcom) {
    phenotype = 'Phenotype_C';
    phenotypeName = 'Phenotype C (Ovulatory PCOS)';
    description =
      'Regular menstrual cycles with evidence of hyperandrogenism and polycystic ovarian morphology. Often presents with dermatological symptoms (acne, hirsutism).';
    confidence = 0.85;
  } else if (od && !ha && pcom) {
    phenotype = 'Phenotype_D';
    phenotypeName = 'Phenotype D (Non-Hyperandrogenic PCOS)';
    description =
      'Irregular cycles and polycystic ovarian morphology without clinical or biochemical androgen excess. Generally lower metabolic risk.';
    confidence = 0.82;
  } else if (od && ha) {
    // If morphology is unknown/not tested, defaults to high probability of classic Phenotype A/B
    phenotype = 'Phenotype_A';
    phenotypeName = 'Likely Phenotype A / B (Classic PCOS)';
    description =
      'Meets clinical criteria for ovulatory irregularity and androgen excess. Confirmation of ovarian morphology via pelvic ultrasound recommended.';
    confidence = 0.8;
  }

  // 4. Calculate BMI with Asian Cut-offs
  const heightM = input.heightCm / 100;
  const bmi =
    heightM > 0 ? Number((input.weightKg / (heightM * heightM)).toFixed(1)) : 22.0;

  let bmiCategory: PhenotypeAssessment['bmiCategory'] = 'normal';
  if (bmi < 18.5) {
    bmiCategory = 'lean';
  } else if (bmi < 23.0) {
    bmiCategory = 'normal';
  } else if (bmi < 27.5) {
    bmiCategory = 'overweight'; // Asian cut-off: >= 23
  } else {
    bmiCategory = 'obese'; // Asian cut-off: >= 27.5
  }

  // 5. Insulin Resistance (HOMA-IR calculation)
  let homaIr: number | undefined;
  let insulinResistanceFlag = false;
  let insulinResistanceReason = '';

  if (
    input.fastingGlucoseMgDl !== undefined &&
    input.fastingInsulinMicroUml !== undefined
  ) {
    // HOMA-IR = (Glucose in mg/dL * Insulin in microIU/mL) / 405
    homaIr = Number(
      (
        (input.fastingGlucoseMgDl * input.fastingInsulinMicroUml) /
        405
      ).toFixed(2)
    );

    if (homaIr > 2.5) {
      insulinResistanceFlag = true;
      insulinResistanceReason = `Lab verified: HOMA-IR of ${homaIr} exceeds the clinical threshold (> 2.5).`;
    } else {
      insulinResistanceReason = `Lab verified: HOMA-IR of ${homaIr} is within the normal insulin sensitivity range.`;
    }
  } else {
    // Symptom-based heuristic
    const symptoms = input.symptomsList || [];
    const hasMetabolicSymptoms =
      symptoms.includes('symptom_weight_gain') ||
      symptoms.includes('symptom_cravings') ||
      bmi >= 23;

    if (hasMetabolicSymptoms) {
      insulinResistanceFlag = true;
      insulinResistanceReason =
        'Estimated risk: Presenting with difficulty losing weight, carbohydrate cravings, or Asian overweight BMI threshold (>= 23). Fasting insulin test recommended.';
    } else {
      insulinResistanceReason =
        'No overt metabolic flags detected. Fasting insulin lab test recommended to confirm.';
    }
  }

  return {
    phenotype,
    phenotypeName,
    description,
    criteriaMet: {
      ovulatoryDysfunction: od,
      hyperandrogenism: ha,
      polycysticMorphology: pcom,
    },
    confidence,
    bmi,
    bmiCategory,
    homaIr,
    insulinResistanceFlag,
    insulinResistanceReason,
    disclaimer:
      'Estimated algorithmically based on reported symptoms and laboratory findings. Confirm with your treating physician.',
  };
}
