export interface PlatformDoctor {
  id: string;
  name: string;
  qualifications: string;
  role: string;
  subSpecialty: string;
  hospital: string;
  city: 'Hyderabad' | 'Bengaluru' | 'Mumbai' | 'Delhi NCR' | 'Chennai';
  area: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  consultationFee: number;
  nextSlot: string;
  avatarText: string;
  avatarBg: string;
  languages: string[];
  matchScore: number;
  isAiMatch?: boolean;
  matchReasons?: string[];
  teleconsultAvailable: boolean;
}

export const CITIES = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Chennai'] as const;
export type CityName = (typeof CITIES)[number];

export const DOCTORS_DATABASE: PlatformDoctor[] = [
  // HYDERABAD
  {
    id: 'doc-hyd-1',
    name: 'Dr. Ananya Sen',
    qualifications: 'MD, DGO, FRCOG (UK)',
    role: 'Senior Gynecologist & Reproductive Endocrinologist',
    subSpecialty: 'PCOS Rotterdam Phenotypes, Insulin Resistance & Recurrent Loss',
    hospital: 'Apollo Health City',
    city: 'Hyderabad',
    area: 'Banjara Hills & Jubilee Hills',
    rating: 4.95,
    reviewCount: 382,
    experienceYears: 16,
    consultationFee: 850,
    nextSlot: 'Today, 04:30 PM',
    avatarText: 'AS',
    avatarBg: 'bg-rose-600',
    languages: ['Telugu', 'Hindi', 'English'],
    matchScore: 98,
    isAiMatch: true,
    matchReasons: [
      'Top specialist in Hyderabad for Phenotype B metabolic PCOS with insulin resistance (HOMA-IR > 3.0)',
      '92% clinical cycle regularity outcome rate using combined Metformin and low-GI nutritional sequencing',
      'Clinical consensus lead for FOGSI and International PCOS Guidelines 2023 panel',
    ],
    teleconsultAvailable: true,
  },
  {
    id: 'doc-hyd-2',
    name: 'Dr. Ramesh Gupta',
    qualifications: 'MD, DM (Endocrinology - AIIMS)',
    role: 'Consultant Endocrinologist & Diabetologist',
    subSpecialty: 'Thyroiditis, Hashimoto’s, HOMA-IR & Adrenal Hyperandrogenism',
    hospital: 'Yashoda Hospitals',
    city: 'Hyderabad',
    area: 'Somajiguda & Secunderabad',
    rating: 4.88,
    reviewCount: 294,
    experienceYears: 19,
    consultationFee: 900,
    nextSlot: 'Tomorrow, 10:00 AM',
    avatarText: 'RG',
    avatarBg: 'bg-indigo-600',
    languages: ['Hindi', 'Telugu', 'English'],
    matchScore: 94,
    matchReasons: [
      'Specialized management of subclinical hypothyroidism with target TSH 1.5–2.5 for ovulatory optimization',
      'Extensive published protocols on Metformin tolerance and vitamin co-factors',
    ],
    teleconsultAvailable: true,
  },
  {
    id: 'doc-hyd-3',
    name: 'Dr. Swapna Yendru',
    qualifications: 'MS (OBG), Fellowship in Gynaec Laparoscopy',
    role: 'Consultant Obstetrician & Laparoscopic Surgeon',
    subSpecialty: 'Endometriosis Excision, Pelvic Pain & Ovarian Cysts',
    hospital: 'Fernandez Hospital',
    city: 'Hyderabad',
    area: 'Hyderguda & Bogulkunta',
    rating: 4.91,
    reviewCount: 215,
    experienceYears: 14,
    consultationFee: 800,
    nextSlot: 'Friday, 02:00 PM',
    avatarText: 'SY',
    avatarBg: 'bg-teal-600',
    languages: ['Telugu', 'English', 'Hindi'],
    matchScore: 89,
    matchReasons: [
      'Gold-standard pelvic pain and endometriosis diagnostic expertise',
      'Conservative ovarian cyst preservation protocols',
    ],
    teleconsultAvailable: false,
  },
  {
    id: 'doc-hyd-4',
    name: 'Sneha Nair',
    qualifications: 'MSc (Clinical Nutrition), RD, CDE',
    role: 'Chief Clinical Hormonal Dietitian',
    subSpecialty: 'Indian High-Fiber Millet Diets & Gut Microbiome Restoration',
    hospital: 'Care Hospitals',
    city: 'Hyderabad',
    area: 'Banjara Hills',
    rating: 4.85,
    reviewCount: 178,
    experienceYears: 11,
    consultationFee: 650,
    nextSlot: 'Today, 06:15 PM',
    avatarText: 'SN',
    avatarBg: 'bg-emerald-600',
    languages: ['Telugu', 'Hindi', 'Tamil', 'English'],
    matchScore: 92,
    matchReasons: [
      'Designed the INDB Indian low-GI recipe swaps adapted for South Indian households',
      'Food intolerance and elimination trial monitoring (A1 dairy & gluten sensitivity)',
    ],
    teleconsultAvailable: true,
  },

  // BENGALURU
  {
    id: 'doc-blr-1',
    name: 'Dr. Nandita Rao',
    qualifications: 'MD, MRCOG (London), Fellowship in Reproductive Medicine',
    role: 'Lead Reproductive Gynecologist & Fertility Specialist',
    subSpecialty: 'PCOS Ovulation Induction, AMH Recalibration & Luteal Support',
    hospital: 'Manipal Hospital',
    city: 'Bengaluru',
    area: 'Old Airport Road & Indiranagar',
    rating: 4.94,
    reviewCount: 341,
    experienceYears: 17,
    consultationFee: 950,
    nextSlot: 'Today, 05:00 PM',
    avatarText: 'NR',
    avatarBg: 'bg-purple-600',
    languages: ['Kannada', 'English', 'Hindi', 'Telugu'],
    matchScore: 96,
    isAiMatch: true,
    matchReasons: [
      'Expert in metabolic PCOS and low-ovarian-trauma protocols',
      'Consistent top ratings for patient empathy and zero unnecessary surgeries',
    ],
    teleconsultAvailable: true,
  },
  {
    id: 'doc-blr-2',
    name: 'Dr. Vikramaditya Hegde',
    qualifications: 'MD, DM (Endocrinology - PGI Chandigarh)',
    role: 'Senior Consultant Endocrinologist',
    subSpecialty: 'Insulin Resistance Syndromes & Metabolic Dysregulation',
    hospital: 'Aster CMI Hospital',
    city: 'Bengaluru',
    area: 'Hebbal & Sahakara Nagar',
    rating: 4.87,
    reviewCount: 220,
    experienceYears: 15,
    consultationFee: 900,
    nextSlot: 'Tomorrow, 11:30 AM',
    avatarText: 'VH',
    avatarBg: 'bg-blue-600',
    languages: ['Kannada', 'English', 'Hindi'],
    matchScore: 91,
    teleconsultAvailable: true,
  },

  // MUMBAI
  {
    id: 'doc-mum-1',
    name: 'Dr. Shilpa Kulkarni',
    qualifications: 'MD, FCPS, Diploma in Gynecological Endoscopy (Germany)',
    role: 'Consultant Obstetrician & Gynecologist',
    subSpecialty: 'Perimenopause, PCOS & High-Risk Reproductive Care',
    hospital: 'Hinduja Healthcare Surgical',
    city: 'Mumbai',
    area: 'Khar West & Bandra',
    rating: 4.96,
    reviewCount: 412,
    experienceYears: 21,
    consultationFee: 1200,
    nextSlot: 'Tomorrow, 03:00 PM',
    avatarText: 'SK',
    avatarBg: 'bg-rose-700',
    languages: ['Marathi', 'Hindi', 'English'],
    matchScore: 95,
    isAiMatch: true,
    matchReasons: [
      'Leading Mumbai specialist for evidence-based hormonal stabilization',
      'Focus on lifestyle integration before medical escalations',
    ],
    teleconsultAvailable: true,
  },
  {
    id: 'doc-mum-2',
    name: 'Dr. Farhan Merchant',
    qualifications: 'MD, DM (Endocrinology - KEM Hospital)',
    role: 'Consultant Endocrinologist',
    subSpecialty: 'PCOS Metabolic Profiling & Thyroid Optimization',
    hospital: 'Lilavati Hospital & Research Centre',
    city: 'Mumbai',
    area: 'Bandra West',
    rating: 4.89,
    reviewCount: 310,
    experienceYears: 18,
    consultationFee: 1100,
    nextSlot: 'Thursday, 11:00 AM',
    avatarText: 'FM',
    avatarBg: 'bg-slate-700',
    languages: ['Hindi', 'Gujarati', 'English', 'Marathi'],
    matchScore: 90,
    teleconsultAvailable: true,
  },

  // DELHI NCR
  {
    id: 'doc-del-1',
    name: 'Dr. Shweta Kapoor',
    qualifications: 'MD, FICOG, Advanced Endoscopy (France)',
    role: 'Director - Women’s Health & Reproductive Clinic',
    subSpecialty: 'Adolescent & Adult PCOS, Pelvic Pain & Fertility',
    hospital: 'Max Super Speciality Hospital',
    city: 'Delhi NCR',
    area: 'Saket & South Extension',
    rating: 4.93,
    reviewCount: 460,
    experienceYears: 20,
    consultationFee: 1000,
    nextSlot: 'Today, 06:00 PM',
    avatarText: 'SK',
    avatarBg: 'bg-pink-700',
    languages: ['Hindi', 'English', 'Punjabi'],
    matchScore: 97,
    isAiMatch: true,
    matchReasons: [
      'Renowned for holistic metabolic protocols aligning with FOGSI recommendations',
      'Recognized expert in HOMA-IR and weight-neutral clinical guidance',
    ],
    teleconsultAvailable: true,
  },

  // CHENNAI
  {
    id: 'doc-chn-1',
    name: 'Dr. Meenakshi Sundaram',
    qualifications: 'MD, DGO, FRCOG (London)',
    role: 'Senior Consultant Obstetrician & Gynecologist',
    subSpecialty: 'PCOS Phenotype Management, Endocrine Gynaecology',
    hospital: 'Apollo Women’s Hospital',
    city: 'Chennai',
    area: 'Thousand Lights & Alwarpet',
    rating: 4.95,
    reviewCount: 388,
    experienceYears: 22,
    consultationFee: 850,
    nextSlot: 'Tomorrow, 04:00 PM',
    avatarText: 'MS',
    avatarBg: 'bg-purple-700',
    languages: ['Tamil', 'English', 'Telugu'],
    matchScore: 96,
    isAiMatch: true,
    matchReasons: [
      'Top clinical reputation in Tamil Nadu for conservative PCOS management',
      'Expert in South Indian dietary swaps for glycemic stability',
    ],
    teleconsultAvailable: true,
  },
];

export interface EmergencyHospitalTriage {
  id: string;
  name: string;
  wing: string;
  city: string;
  area: string;
  distanceKm: number;
  driveTimeMins: number;
  phone: string;
  onDutyGynecologist: string;
  onDutyQualifications: string;
  has247OperatingRoom: boolean;
  hasBloodBank: boolean;
  emergencyNumber: string;
}

export const EMERGENCY_FACILITIES: Record<string, EmergencyHospitalTriage> = {
  Hyderabad: {
    id: 'er-hyd',
    name: 'Apollo Cradle & Children’s Hospital',
    wing: '24/7 Emergency Obstetrics & Gynecological Triage',
    city: 'Hyderabad',
    area: 'Road No. 2, Jubilee Hills',
    distanceKm: 3.2,
    driveTimeMins: 11,
    phone: '+91 40 2360 7777',
    onDutyGynecologist: 'Dr. Meera Nambiar, MD, DNB',
    onDutyQualifications: 'Senior Consultant Emergency Gynecologist & Laparoscopic Surgeon',
    has247OperatingRoom: true,
    hasBloodBank: true,
    emergencyNumber: '112',
  },
  Bengaluru: {
    id: 'er-blr',
    name: 'Cloudnine Hospital ER',
    wing: '24/7 Acute Women’s Care & Triage Unit',
    city: 'Bengaluru',
    area: 'Old Airport Road, Indiranagar',
    distanceKm: 4.1,
    driveTimeMins: 14,
    phone: '+91 80 4020 2222',
    onDutyGynecologist: 'Dr. Archana Rao, MS (OBG)',
    onDutyQualifications: 'On-Call Emergency Gynecological Specialist',
    has247OperatingRoom: true,
    hasBloodBank: true,
    emergencyNumber: '112',
  },
  Mumbai: {
    id: 'er-mum',
    name: 'Hinduja Healthcare Surgical',
    wing: '24/7 Emergency Wing (Level 1 Trauma & OB/GYN)',
    city: 'Mumbai',
    area: '11th Road, Khar West',
    distanceKm: 2.8,
    driveTimeMins: 9,
    phone: '+91 22 4510 8100',
    onDutyGynecologist: 'Dr. Rashmi Mehta, MD, FCPS',
    onDutyQualifications: 'Emergency Gynecologist On-Duty',
    has247OperatingRoom: true,
    hasBloodBank: true,
    emergencyNumber: '112',
  },
  'Delhi NCR': {
    id: 'er-del',
    name: 'Max Super Speciality Hospital',
    wing: '24/7 Emergency OB/GYN Care & Resuscitation Center',
    city: 'Delhi NCR',
    area: 'Press Enclave Road, Saket',
    distanceKm: 5.0,
    driveTimeMins: 15,
    phone: '+91 11 2651 5050',
    onDutyGynecologist: 'Dr. Shalini Aggarwal, MD (OBG)',
    onDutyQualifications: 'Head of Emergency Gynecological Services',
    has247OperatingRoom: true,
    hasBloodBank: true,
    emergencyNumber: '112',
  },
  Chennai: {
    id: 'er-chn',
    name: 'Apollo Women’s Hospital',
    wing: '24/7 Women’s Emergency & Acute Pelvic Care Wing',
    city: 'Chennai',
    area: 'Greams Road, Thousand Lights',
    distanceKm: 3.5,
    driveTimeMins: 12,
    phone: '+91 44 2829 0200',
    onDutyGynecologist: 'Dr. K. Jayashree, MD, DGO',
    onDutyQualifications: 'Emergency OB/GYN Senior Consultant',
    has247OperatingRoom: true,
    hasBloodBank: true,
    emergencyNumber: '112',
  },
};
