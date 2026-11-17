import { PrismaClient, Role, ExperimentStatus, VerdictType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SEED_POPULATION_PRIORS } from '../lib/engine/priors';
import { INDB_FOOD_ITEMS } from '../data/indb-seed';
import { loadAllKnowledgeArticles } from '../lib/ai/rag';
import { encrypt } from '../lib/crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for PCOS Health Research Assistant...');

  // 1. Seed Interventions Library (12 clinical interventions)
  console.log('📦 Seeding Intervention Library (12 items)...');
  const interventionsData = [
    {
      code: 'low_gi_diet',
      name: 'Low-GI Indian Diet',
      category: 'diet',
      protocol: 'Replace polished white rice and maida with whole millets, legumes, and high-fiber roti.',
      baselineDays: 14,
      interventionDays: 28,
      primaryMetric: 'energy',
      secondaryMetrics: ['cravings', 'bloating'],
      mcid: 0.5,
      monthlyCostINR: 200,
      contraindications: [],
      requiresDoctorApproval: false,
      evidenceLevel: 'high',
      description: 'Stabilizes postprandial glucose surges and improves insulin sensitivity.',
    },
    {
      code: 'daily_walk',
      name: '30-min Daily Brisk Walk',
      category: 'exercise',
      protocol: 'Complete 30 minutes of continuous brisk walking, preferably 15-20 minutes post-meal.',
      baselineDays: 14,
      interventionDays: 28,
      primaryMetric: 'energy',
      secondaryMetrics: ['mood'],
      mcid: 0.5,
      monthlyCostINR: 0,
      contraindications: [],
      requiresDoctorApproval: false,
      evidenceLevel: 'high',
      description: 'Enhances peripheral glucose clearance in skeletal muscle via non-insulin pathways.',
    },
    {
      code: 'strength_training',
      name: 'Progressive Resistance Training (3×/week)',
      category: 'exercise',
      protocol: 'Perform full-body compound resistance training 3 days per week with rest days between.',
      baselineDays: 14,
      interventionDays: 42,
      primaryMetric: 'energy',
      secondaryMetrics: ['mood', 'cycle_regularity'],
      mcid: 0.8,
      monthlyCostINR: 0,
      contraindications: ['acute_joint_injury', 'pregnancy_unsupervised'],
      requiresDoctorApproval: false,
      evidenceLevel: 'high',
      description: 'Builds metabolic glucose sink and increases resting metabolic rate.',
    },
    {
      code: 'myo_inositol',
      name: 'Myo-Inositol (2000mg BID)',
      category: 'supplement',
      protocol: 'Take 2000mg with breakfast and 2000mg with dinner in water.',
      baselineDays: 14,
      interventionDays: 42,
      primaryMetric: 'cycle_regularity',
      secondaryMetrics: ['energy', 'cravings'],
      mcid: 0.8,
      monthlyCostINR: 1200,
      contraindications: ['severe_renal_impairment'],
      requiresDoctorApproval: true,
      evidenceLevel: 'high',
      description: 'Restores ovarian inositol depletion, promotes follicular maturation and reduces insulin.',
    },
    {
      code: 'vitamin_d',
      name: 'Vitamin D3 Repletion (Only if Deficient)',
      category: 'supplement',
      protocol: 'Weekly oral cholecalciferol 60,000 IU for 8 weeks followed by monthly maintenance.',
      baselineDays: 14,
      interventionDays: 42,
      primaryMetric: 'energy',
      secondaryMetrics: ['mood'],
      mcid: 0.6,
      monthlyCostINR: 350,
      contraindications: ['hypercalcemia'],
      requiresDoctorApproval: true,
      evidenceLevel: 'high',
      description: 'Corrects widespread deficiency, crucial for steroidogenesis and insulin receptor expression.',
    },
    {
      code: 'early_dinner',
      name: 'Early Dinner by 8:00 PM (Circadian Alignment)',
      category: 'diet',
      protocol: 'Finish your final meal of the day by 8:00 PM, allowing 12-14 hours of overnight fasting.',
      baselineDays: 14,
      interventionDays: 28,
      primaryMetric: 'bloating',
      secondaryMetrics: ['energy'],
      mcid: 0.5,
      monthlyCostINR: 0,
      contraindications: ['type_1_diabetes_hypoglycemia'],
      requiresDoctorApproval: false,
      evidenceLevel: 'moderate',
      description: 'Prevents late-night insulin spikes and enhances nocturnal growth hormone secretion.',
    },
    {
      code: 'cut_sugary_chai',
      name: 'Cut Sugary Chai (Zero Liquid Sucrose)',
      category: 'diet',
      protocol: 'Switch from sweetened milky tea to unsweetened spiced tea, green tea, or black coffee.',
      baselineDays: 14,
      interventionDays: 21,
      primaryMetric: 'cravings',
      secondaryMetrics: ['energy', 'bloating'],
      mcid: 0.6,
      monthlyCostINR: 0,
      contraindications: [],
      requiresDoctorApproval: false,
      evidenceLevel: 'high',
      description: 'Removes rapidly absorbed liquid sucrose that triggers direct ovarian theca androgen release.',
    },
    {
      code: 'sleep_hygiene',
      name: 'Consistent Sleep by 11:00 PM (8 Hours)',
      category: 'sleep',
      protocol: 'In bed with lights off by 11:00 PM; avoid digital screens 60 minutes prior.',
      baselineDays: 14,
      interventionDays: 28,
      primaryMetric: 'energy',
      secondaryMetrics: ['mood', 'cravings'],
      mcid: 0.6,
      monthlyCostINR: 0,
      contraindications: [],
      requiresDoctorApproval: false,
      evidenceLevel: 'moderate',
      description: 'Lowers evening cortisol and prevents ghrelin-mediated carbohydrate binging.',
    },
    {
      code: 'spearmint_tea',
      name: 'Organic Spearmint Tea (2 cups daily)',
      category: 'supplement',
      protocol: 'Steep 1 tsp dried spearmint leaves in hot water for 10 minutes twice daily.',
      baselineDays: 14,
      interventionDays: 30,
      primaryMetric: 'acne',
      secondaryMetrics: ['hirsutism'],
      mcid: 0.5,
      monthlyCostINR: 400,
      contraindications: ['pregnancy'],
      requiresDoctorApproval: false,
      evidenceLevel: 'moderate',
      description: 'Natural anti-androgen shown in RCTs to reduce circulating free testosterone.',
    },
    {
      code: 'protein_breakfast',
      name: 'Protein-First Breakfast (≥ 20g Protein)',
      category: 'diet',
      protocol: 'Consume eggs, paneer, tofu, or besan chilla before carbohydrates at breakfast.',
      baselineDays: 14,
      interventionDays: 28,
      primaryMetric: 'cravings',
      secondaryMetrics: ['energy'],
      mcid: 0.6,
      monthlyCostINR: 300,
      contraindications: [],
      requiresDoctorApproval: false,
      evidenceLevel: 'high',
      description: 'Stimulates GLP-1 and peptide YY, sustaining satiety and blunting glucose excursion.',
    },
    {
      code: 'reduced_refined_carbs',
      name: 'Cut Refined Carbs & Bakery Maida',
      category: 'diet',
      protocol: 'Zero white bread, biscuits, rusks, or bakery snacks; replace with nuts and roasted seeds.',
      baselineDays: 14,
      interventionDays: 28,
      primaryMetric: 'bloating',
      secondaryMetrics: ['energy', 'cravings'],
      mcid: 0.5,
      monthlyCostINR: 0,
      contraindications: [],
      requiresDoctorApproval: false,
      evidenceLevel: 'high',
      description: 'Lowers intestinal permeability and reduces chronic low-grade systemic inflammation.',
    },
    {
      code: 'seed_cycling',
      name: 'Seed Cycling (Flax, Pumpkin, Sesame, Sunflower)',
      category: 'diet',
      protocol: '1 tbsp ground flax & pumpkin in follicular phase; 1 tbsp sesame & sunflower in luteal phase.',
      baselineDays: 14,
      interventionDays: 42,
      primaryMetric: 'cycle_regularity',
      secondaryMetrics: ['acne'],
      mcid: 0.5,
      monthlyCostINR: 750,
      contraindications: [],
      requiresDoctorApproval: false,
      evidenceLevel: 'low',
      description: 'Popular holistic practice; tested honestly by the Bayesian engine without bias.',
    },
  ];

  for (const item of interventionsData) {
    await prisma.intervention.upsert({
      where: { code: item.code },
      update: item,
      create: item,
    });
  }

  // 2. Seed Population Priors
  console.log('📈 Seeding Population Priors (Hierarchical Empirical Bayes table)...');
  for (const prior of SEED_POPULATION_PRIORS) {
    await prisma.populationPrior.upsert({
      where: {
        interventionCode_phenotype: {
          interventionCode: prior.interventionCode,
          phenotype: prior.phenotype,
        },
      },
      update: {
        priorMean: prior.mean,
        priorStd: Math.sqrt(prior.variance),
        sampleSize: prior.sampleSize,
        source: prior.source,
      },
      create: {
        interventionCode: prior.interventionCode,
        phenotype: prior.phenotype,
        priorMean: prior.mean,
        priorStd: Math.sqrt(prior.variance),
        sampleSize: prior.sampleSize,
        source: prior.source,
      },
    });
  }

  // 3. Seed Partner Diagnostic Labs
  console.log('🔬 Seeding Partner Diagnostic Labs...');
  const labsData = [
    {
      slug: 'thyrocare',
      name: 'Thyrocare Technologies',
      city: 'Hyderabad, Mumbai, Delhi, Bengaluru, Chennai',
      address: 'Central Processing Unit, D-37/1, TTC MIDC, Turbhe',
      rating: 4.8,
      homeCollectionAvailable: true,
      turnaroundHours: 24,
      priceINR: 1299,
      partnerDiscountPercent: 25,
      testCatalog: ['fasting_glucose', 'fasting_insulin', 'hba1c', 'tsh', 'total_testosterone', 'vitamin_d', 'amh'],
    },
    {
      slug: 'lal-pathlabs',
      name: 'Dr Lal PathLabs',
      city: 'Delhi NCR, Jaipur, Lucknow, Ahmedabad, Kolkata',
      address: 'National Reference Lab, Sector 18, Block E, Rohini',
      rating: 4.9,
      homeCollectionAvailable: true,
      turnaroundHours: 20,
      priceINR: 1450,
      partnerDiscountPercent: 20,
      testCatalog: ['fasting_glucose', 'fasting_insulin', 'lh', 'fsh', 'amh', 'prolactin', 'vitamin_d', 'vitamin_b12'],
    },
    {
      slug: 'metropolis',
      name: 'Metropolis Healthcare',
      city: 'Mumbai, Pune, Bengaluru, Chennai, Surat',
      address: 'Commercial Building 1A, Kohinoor Mall, Vidyavihar',
      rating: 4.7,
      homeCollectionAvailable: true,
      turnaroundHours: 24,
      priceINR: 1399,
      partnerDiscountPercent: 20,
      testCatalog: ['fasting_glucose', 'fasting_insulin', 'lipid_panel', 'ferritin', 'hemoglobin', 'tsh'],
    },
  ];

  for (const lab of labsData) {
    await prisma.lab.upsert({
      where: { slug: lab.slug },
      update: lab,
      create: lab,
    });
  }

  // 4. Seed Verified Doctors
  console.log('🩺 Seeding Verified PCOS Specialists...');
  const demoDoctorUser = await prisma.user.upsert({
    where: { email: 'dr.ananya@pcoscare.in' },
    update: { role: Role.DOCTOR },
    create: {
      email: 'dr.ananya@pcoscare.in',
      name: 'Dr. Ananya Sen, MD (OB-GYN)',
      passwordHash: await bcrypt.hash('demo123', 10),
      role: Role.DOCTOR,
      language: 'en',
    },
  });

  await prisma.doctor.upsert({
    where: { userId: demoDoctorUser.id },
    update: {},
    create: {
      userId: demoDoctorUser.id,
      fullName: 'Dr. Ananya Sen',
      specialty: 'Gynaecologist & Reproductive Endocrinologist',
      qualifications: 'MBBS, MS (OB-GYN), Fellowship in Reproductive Medicine (AIIMS)',
      experienceYears: 14,
      languages: ['English', 'Hindi', 'Bengali', 'Telugu'],
      feeINR: 900,
      bio: 'Senior consultant specializing in adolescent and adult PCOS, insulin sensitisation therapies, and ovulation induction.',
    },
  });

  // Additional specialist profiles
  const specialistUsers = [
    {
      email: 'dr.kavita@pcoscare.in',
      name: 'Dr. Kavita Rao, DM (Endocrinology)',
      specialty: 'Endocrinologist',
      qualifications: 'MBBS, MD, DM Endocrinology',
      experienceYears: 12,
      languages: ['English', 'Telugu', 'Hindi'],
      feeINR: 1100,
      bio: 'Expert in South Asian insulin resistance, metabolic syndrome, and thyroid-adrenal PCOS overlaps.',
    },
    {
      email: 'pooja.diet@pcoscare.in',
      name: 'Pooja Makhija, MSc (Clinical Nutrition)',
      specialty: 'Clinical Dietitian',
      qualifications: 'MSc Clinical Nutrition, Certified PCOS Educator',
      experienceYears: 9,
      languages: ['English', 'Hindi', 'Gujarati'],
      feeINR: 750,
      bio: 'Customizes regional Indian diets (rotis, pulses, millets) to balance blood glucose without unsustainable restrictions.',
    },
  ];

  for (const s of specialistUsers) {
    const u = await prisma.user.upsert({
      where: { email: s.email },
      update: { role: Role.DOCTOR },
      create: {
        email: s.email,
        name: s.name,
        passwordHash: await bcrypt.hash('demo123', 10),
        role: Role.DOCTOR,
        language: 'en',
      },
    });

    await prisma.doctor.upsert({
      where: { userId: u.id },
      update: {},
      create: {
        userId: u.id,
        fullName: s.name,
        specialty: s.specialty,
        qualifications: s.qualifications,
        experienceYears: s.experienceYears,
        languages: s.languages,
        feeINR: s.feeINR,
        bio: s.bio,
      },
    });
  }

  // 5. Seed Core Demo Patient: Priya Sharma (26, Hyderabad)
  console.log('👤 Seeding Primary Demo Persona: Priya Sharma (26, Hyderabad)...');
  const priyaUser = await prisma.user.upsert({
    where: { email: 'priya@demo.pcos' },
    update: {
      name: 'Priya Sharma',
      language: 'te', // Telugu default persona
    },
    create: {
      email: 'priya@demo.pcos',
      name: 'Priya Sharma',
      passwordHash: await bcrypt.hash('demo123', 10),
      role: Role.USER,
      language: 'te',
    },
  });

  // Consents (DPDP standards)
  await prisma.consent.upsert({
    where: { userId_purpose: { userId: priyaUser.id, purpose: 'core_app' } },
    update: { granted: true },
    create: { userId: priyaUser.id, purpose: 'core_app', granted: true },
  });
  await prisma.consent.upsert({
    where: { userId_purpose: { userId: priyaUser.id, purpose: 'doctor_sharing' } },
    update: { granted: true },
    create: { userId: priyaUser.id, purpose: 'doctor_sharing', granted: true },
  });
  await prisma.consent.upsert({
    where: { userId_purpose: { userId: priyaUser.id, purpose: 'anonymised_research' } },
    update: { granted: true },
    create: { userId: priyaUser.id, purpose: 'anonymised_research', granted: true },
  });

  // Health Profile
  await prisma.profile.upsert({
    where: { userId: priyaUser.id },
    update: {
      age: 26,
      cityTier: 'tier1',
      heightCm: 161,
      weightKg: 67.5,
      waistCircumferenceCm: 84,
      diagnosisStatus: 'diagnosed',
      symptoms: ['symptom_irregular_periods', 'symptom_cravings', 'symptom_weight_gain', 'symptom_acne'],
      typicalCycleLength: 42,
      lastPeriodDate: new Date('2026-01-28'),
      dietType: 'vegetarian',
      activityLevel: 'light',
      sleepHours: 6.8,
      currentMedicines: ['Multivitamin', 'Folic Acid'],
      monthlyBudget: 2500,
      estimatedPhenotype: 'Phenotype_A',
      phenotypeConfidence: 0.92,
      phenotypeReasoning: 'Classic Rotterdam Phenotype A: Oligomenorrhea (42-day cycle), elevated free testosterone, and bilateral PCO morphology on ultrasound.',
      insulinResistanceFlag: true,
      homaIrScore: 3.61,
      bmiCategory: 'overweight',
    },
    create: {
      userId: priyaUser.id,
      age: 26,
      cityTier: 'tier1',
      heightCm: 161,
      weightKg: 67.5,
      waistCircumferenceCm: 84,
      diagnosisStatus: 'diagnosed',
      symptoms: ['symptom_irregular_periods', 'symptom_cravings', 'symptom_weight_gain', 'symptom_acne'],
      typicalCycleLength: 42,
      lastPeriodDate: new Date('2026-01-28'),
      dietType: 'vegetarian',
      activityLevel: 'light',
      sleepHours: 6.8,
      currentMedicines: ['Multivitamin', 'Folic Acid'],
      monthlyBudget: 2500,
      estimatedPhenotype: 'Phenotype_A',
      phenotypeConfidence: 0.92,
      phenotypeReasoning: 'Classic Rotterdam Phenotype A: Oligomenorrhea (42-day cycle), elevated free testosterone, and bilateral PCO morphology on ultrasound.',
      insulinResistanceFlag: true,
      homaIrScore: 3.61,
      bmiCategory: 'overweight',
    },
  });

  // Seed 60 Days of Realistic Daily Check-ins for Priya
  console.log('📅 Seeding 60 days of daily check-ins for Priya...');
  await prisma.checkIn.deleteMany({ where: { userId: priyaUser.id } });

  const checkInsToCreate = [];
  const baseDate = new Date('2025-12-19');

  for (let i = 0; i < 60; i++) {
    const curDate = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000);
    // Cycle phase simulation (42 day cycle)
    const cycleDay = (i % 42) + 1;
    let cyclePhase = 'follicular';
    let isPeriod = false;
    let periodFlow = 'none';

    if (cycleDay <= 5) {
      cyclePhase = 'menstrual';
      isPeriod = true;
      periodFlow = cycleDay <= 3 ? 'medium' : 'light';
    } else if (cycleDay > 28) {
      cyclePhase = 'luteal';
    }

    // Trial 1: Days 0-41 (Low GI Diet) -> Shows clear improvement in energy (from 2.8 to 4.2)
    // Trial 2: Days 42-59 (Myo Inositol) -> Active
    let energy = 3;
    let cravings = 4;
    let acne = 2;
    let bloating = 2;
    let adhered = true;

    if (i < 14) {
      // Baseline 1
      energy = 2 + (i % 3 === 0 ? 1 : 0);
      cravings = 4;
      bloating = 2;
      adhered = false;
    } else if (i < 42) {
      // Intervention 1 (Low GI Diet)
      energy = 4 + (i % 4 === 0 ? 0 : 1) - (cyclePhase === 'luteal' ? 1 : 0);
      cravings = 2;
      bloating = 1;
      adhered = i % 8 !== 0; // 87% adherence
    } else {
      // Active Trial 2 (Myo-Inositol)
      energy = 4;
      cravings = 2;
      acne = 1;
      adhered = true;
    }

    checkInsToCreate.push({
      userId: priyaUser.id,
      date: curDate,
      energy: Math.min(5, Math.max(1, energy)),
      mood: Math.min(5, Math.max(1, energy + (i % 2 === 0 ? 0 : 1))),
      cravings: Math.min(5, Math.max(1, cravings)),
      acne: Math.min(3, Math.max(0, acne)),
      bloating: Math.min(3, Math.max(0, bloating)),
      periodToday: isPeriod,
      periodFlow,
      adherenceToExperiment: adhered,
      notesEncrypted: encrypt(i % 5 === 0 ? 'Felt active throughout the day, had moong dal chilla for breakfast.' : null),
      cyclePhase,
    });
  }

  await prisma.checkIn.createMany({ data: checkInsToCreate });

  // Seed Priya's 2 Lab Reports
  console.log('🩸 Seeding Priya\'s 2 Verified Lab Reports...');
  await prisma.labReport.deleteMany({ where: { userId: priyaUser.id } });

  const report1 = await prisma.labReport.create({
    data: {
      userId: priyaUser.id,
      labName: 'Thyrocare Laboratories',
      sampleDate: new Date('2025-12-15'),
      status: 'verified',
      results: {
        create: [
          { testName: 'Fasting Plasma Glucose', canonicalName: 'fasting_glucose', numericValue: 94.0, unit: 'mg/dL', referenceRange: '70-99', isAbnormal: false },
          { testName: 'Fasting Serum Insulin', canonicalName: 'fasting_insulin', numericValue: 15.6, unit: 'microIU/mL', referenceRange: '2.6-24.9', isAbnormal: true },
          { testName: 'HbA1c', canonicalName: 'hba1c', numericValue: 5.6, unit: '%', referenceRange: '4.0-5.6', isAbnormal: false },
          { testName: 'HOMA-IR Index', canonicalName: 'homa_ir', numericValue: 3.61, unit: 'ratio', referenceRange: '< 2.5', isAbnormal: true },
          { testName: 'Total Testosterone', canonicalName: 'total_testosterone', numericValue: 68.4, unit: 'ng/dL', referenceRange: '15-55', isAbnormal: true },
          { testName: 'Anti-Mullerian Hormone (AMH)', canonicalName: 'amh', numericValue: 6.8, unit: 'ng/mL', referenceRange: '1.0-4.0', isAbnormal: true },
          { testName: '25-OH Vitamin D Total', canonicalName: 'vitamin_d', numericValue: 14.2, unit: 'ng/mL', referenceRange: '30-100', isAbnormal: true },
        ],
      },
    },
  });

  const report2 = await prisma.labReport.create({
    data: {
      userId: priyaUser.id,
      labName: 'Thyrocare Laboratories',
      sampleDate: new Date('2026-01-30'),
      status: 'verified',
      results: {
        create: [
          { testName: 'Fasting Plasma Glucose', canonicalName: 'fasting_glucose', numericValue: 88.0, unit: 'mg/dL', referenceRange: '70-99', isAbnormal: false },
          { testName: 'Fasting Serum Insulin', canonicalName: 'fasting_insulin', numericValue: 12.8, unit: 'microIU/mL', referenceRange: '2.6-24.9', isAbnormal: true },
          { testName: 'HOMA-IR Index', canonicalName: 'homa_ir', numericValue: 2.78, unit: 'ratio', referenceRange: '< 2.5', isAbnormal: true },
          { testName: 'Total Testosterone', canonicalName: 'total_testosterone', numericValue: 58.0, unit: 'ng/dL', referenceRange: '15-55', isAbnormal: true },
        ],
      },
    },
  });

  // Seed Priya's 1 Completed Experiment (Low-GI Diet: LIKELY WORKED) + 1 Active Experiment (Myo-Inositol)
  console.log('🧪 Seeding Priya\'s Completed and Active Experiments...');
  await prisma.experiment.deleteMany({ where: { userId: priyaUser.id } });

  const lowGiIntervention = await prisma.intervention.findUniqueOrThrow({ where: { code: 'low_gi_diet' } });
  const inositolIntervention = await prisma.intervention.findUniqueOrThrow({ where: { code: 'myo_inositol' } });

  const completedExp = await prisma.experiment.create({
    data: {
      userId: priyaUser.id,
      interventionId: lowGiIntervention.id,
      status: ExperimentStatus.completed,
      startDate: new Date('2025-12-20'),
      baselineEndDate: new Date('2026-01-03'),
      interventionEndDate: new Date('2026-01-31'),
      designType: 'AB',
      targetMetric: 'energy',
      notes: 'Completed 42 days of low-GI Indian nutrition swaps (Besan chilla, Kangni millet, Dalia).',
    },
  });

  await prisma.experimentResult.create({
    data: {
      experimentId: completedExp.id,
      effectEstimate: 1.15,
      standardError: 0.32,
      rawEffect: 1.30,
      cyclePhaseAdjusted: true,
      autocorrelationRho: 0.18,
      adherenceRate: 0.88,
      priorMean: 1.15,
      priorVariance: 0.16,
      posteriorMean: 1.15,
      posteriorVariance: 0.08,
      probBeneficial: 0.91,
      credibleIntervalLow: 0.68,
      credibleIntervalHigh: 1.62,
      verdict: VerdictType.LIKELY_WORKED,
      verdictExplanation:
        'The Bayesian engine calculated a 91% probability that the Low-GI Indian Diet produced a genuine clinical improvement in energy levels, adjusting for cycle phase fluctuations.',
    },
  });

  const activeExp = await prisma.experiment.create({
    data: {
      userId: priyaUser.id,
      interventionId: inositolIntervention.id,
      status: ExperimentStatus.active,
      startDate: new Date('2026-01-31'),
      baselineEndDate: new Date('2026-02-14'),
      interventionEndDate: new Date('2026-03-14'),
      designType: 'AB',
      targetMetric: 'cycle_regularity',
      doctorApprovalStatus: 'approved',
      doctorApprovedById: demoDoctorUser.id,
      notes: 'Currently in Intervention Phase Day 18 of 42. Approved by Dr. Ananya Sen.',
    },
  });

  // Seed 200 Synthetic Users for Aggregates and Admin Funnel
  console.log('👥 Generating 200 synthetic users for aggregate dashboard & funnel...');
  const syntheticUsersData = [];
  for (let s = 1; s <= 200; s++) {
    const isCompleted = s <= 85;
    const isStarted = s <= 150;
    syntheticUsersData.push({
      email: `synthetic_patient_${s}@pcos-study.org`,
      name: `Participant #${1000 + s}`,
      passwordHash: 'dummy_hash',
      role: Role.USER,
      language: s % 4 === 0 ? 'te' : s % 3 === 0 ? 'hi' : s % 5 === 0 ? 'ta' : 'en',
    });
  }
  // create in batch
  await prisma.user.createMany({ data: syntheticUsersData, skipDuplicates: true });

  // Seed Knowledge Base Chunks into Database
  console.log('📚 Ingesting Markdown Knowledge Base articles into database...');
  const articles = loadAllKnowledgeArticles();
  for (const art of articles) {
    await prisma.knowledgeChunk.upsert({
      where: { slug: art.slug },
      update: {
        title: art.title,
        category: art.category,
        source: art.source,
        content: art.content,
        tags: art.tags,
      },
      create: {
        title: art.title,
        category: art.category,
        slug: art.slug,
        source: art.source,
        content: art.content,
        tags: art.tags,
      },
    });
  }

  // Seed INDB Food Table
  console.log('🍛 Seeding Indian Nutrient Databank (INDB) dishes...');
  for (const food of INDB_FOOD_ITEMS) {
    await prisma.food.create({
      data: {
        name: food.name,
        nameHindi: food.nameHindi,
        category: food.category,
        servingUnit: food.servingUnit,
        servingSizeGrams: food.servingSizeGrams,
        calories: food.calories,
        carbs: food.carbs,
        protein: food.protein,
        fat: food.fat,
        fiber: food.fiber,
        glycemicIndexEstimate: food.glycemicIndexEstimate,
        pcosScore: food.pcosScore,
        swapSuggestion: food.swapSuggestion,
        swapReason: food.swapReason,
        isIndb: true,
      },
    });
  }

  console.log('✨ Seed database completed successfully! Ready for demo.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding encountered an error:', e.message);
    process.exit(0);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
