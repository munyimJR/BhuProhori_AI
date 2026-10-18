// Synthetic Demo Data for BhuProhori AI
// All data is completely fictional — for demonstration only

import type {
  District, Upazila, Mouza, Parcel, Owner, OwnershipInterest,
  RegisteredDeed, MutationApplication, DeedExtraction
} from '../types';

// ─── Administrative Locations ────────────────────────────────────────────────

export const DISTRICTS: District[] = [
  { id: 'dist-01', name: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 'dist-02', name: 'Gazipur', nameBn: 'গাজীপুর' },
  { id: 'dist-03', name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ' },
  { id: 'dist-04', name: 'Manikganj', nameBn: 'মানিকগঞ্জ' },
];

export const UPAZILAS: Upazila[] = [
  { id: 'upz-01', districtId: 'dist-01', name: 'Savar', nameBn: 'সাভার' },
  { id: 'upz-02', districtId: 'dist-01', name: 'Keraniganj', nameBn: 'কেরানীগঞ্জ' },
  { id: 'upz-03', districtId: 'dist-02', name: 'Gazipur Sadar', nameBn: 'গাজীপুর সদর' },
  { id: 'upz-04', districtId: 'dist-03', name: 'Narayanganj Sadar', nameBn: 'নারায়ণগঞ্জ সদর' },
  { id: 'upz-05', districtId: 'dist-04', name: 'Manikganj Sadar', nameBn: 'মানিকগঞ্জ সদর' },
];

export const MOUZAS: Mouza[] = [
  { id: 'mzd-01', upazilaId: 'upz-01', name: 'Ashulia', nameBn: 'আশুলিয়া', jlNumber: '১২৩' },
  { id: 'mzd-02', upazilaId: 'upz-01', name: 'Pathalia', nameBn: 'পাথালিয়া', jlNumber: '১৪৭' },
  { id: 'mzd-03', upazilaId: 'upz-02', name: 'Zinzira', nameBn: 'জিঞ্জিরা', jlNumber: '০৮৯' },
  { id: 'mzd-04', upazilaId: 'upz-03', name: 'Tongi', nameBn: 'টঙ্গী', jlNumber: '২০৫' },
  { id: 'mzd-05', upazilaId: 'upz-04', name: 'Fatullah', nameBn: 'ফতুল্লা', jlNumber: '১৬৮' },
  { id: 'mzd-06', upazilaId: 'upz-05', name: 'Shibalaya', nameBn: 'শিবালয়', jlNumber: '০৩৪' },
  { id: 'mzd-07', upazilaId: 'upz-01', name: 'Bhadulia', nameBn: 'ভাদুলিয়া', jlNumber: '১৫৬' },
  { id: 'mzd-08', upazilaId: 'upz-03', name: 'Pubail', nameBn: 'পুবাইল', jlNumber: '১১২' },
];

// ─── Fictional Owners ─────────────────────────────────────────────────────────

export const OWNERS: Owner[] = [
  { id: 'own-01', name: 'Rahim Uddin', nameBn: 'রহিম উদ্দিন', fatherName: 'আব্দুল করিম', address: 'গ্রাম: পাথালিয়া, উপজেলা: সাভার', isFictional: true },
  { id: 'own-02', name: 'Fatema Begum', nameBn: 'ফাতেমা বেগম', fatherName: 'জহির উদ্দিন', address: 'গ্রাম: আশুলিয়া, উপজেলা: সাভার', isFictional: true },
  { id: 'own-03', name: 'Kamal Hossain', nameBn: 'কামাল হোসেন', fatherName: 'ফজলুল হক', address: 'গ্রাম: জিঞ্জিরা, উপজেলা: কেরানীগঞ্জ', isFictional: true },
  { id: 'own-04', name: 'Salma Akter', nameBn: 'সালমা আক্তার', fatherName: 'নজরুল ইসলাম', address: 'গ্রাম: টঙ্গী, উপজেলা: গাজীপুর সদর', isFictional: true },
  { id: 'own-05', name: 'Jabbar Sheikh', nameBn: 'জব্বার শেখ', fatherName: 'মোতালেব শেখ', address: 'গ্রাম: ফতুল্লা, উপজেলা: নারায়ণগঞ্জ সদর', isFictional: true },
  { id: 'own-06', name: 'Nurul Islam', nameBn: 'নুরুল ইসলাম', fatherName: 'আমির হোসেন', address: 'গ্রাম: শিবালয়, উপজেলা: মানিকগঞ্জ সদর', isFictional: true },
  { id: 'own-07', name: 'Roshida Khanam', nameBn: 'রোশিদা খানম', fatherName: 'সিরাজুল ইসলাম', address: 'গ্রাম: পাথালিয়া, উপজেলা: সাভার', isFictional: true },
  { id: 'own-08', name: 'Abul Kalam', nameBn: 'আবুল কালাম', fatherName: 'রহিম বক্স', address: 'গ্রাম: ভাদুলিয়া, উপজেলা: সাভার', isFictional: true },
  { id: 'own-09', name: 'Taslima Nasrin', nameBn: 'তাসলিমা নাসরিন', fatherName: 'করিম মিয়া', address: 'গ্রাম: পুবাইল, উপজেলা: গাজীপুর সদর', isFictional: true },
  { id: 'own-10', name: 'Sirajul Haq', nameBn: 'সিরাজুল হক', fatherName: 'ওয়াজেদ আলী', address: 'গ্রাম: আশুলিয়া, উপজেলা: সাভার', isFictional: true },
  { id: 'own-11', name: 'Moriam Begum', nameBn: 'মরিয়ম বেগম', fatherName: 'ইসমাইল হোসেন', address: 'গ্রাম: জিঞ্জিরা, উপজেলা: কেরানীগঞ্জ', isFictional: true },
  { id: 'own-12', name: 'Hasan Ali', nameBn: 'হাসান আলী', fatherName: 'সফিকুল ইসলাম', address: 'গ্রাম: টঙ্গী, উপজেলা: গাজীপুর সদর', isFictional: true },
];

// ─── Land Parcels (fictional) ─────────────────────────────────────────────────

export const OWNERSHIP_INTERESTS: OwnershipInterest[] = [
  { id: 'oi-01', parcelId: 'prc-01', ownerId: 'own-01', owner: OWNERS[0], khatianNumber: 'খ-০১২', shareNumerator: 1, shareDenominator: 1, acquisitionDate: '২০১০-০৩-১৫' },
  { id: 'oi-02', parcelId: 'prc-02', ownerId: 'own-02', owner: OWNERS[1], khatianNumber: 'খ-০৪৫', shareNumerator: 1, shareDenominator: 2, acquisitionDate: '২০১৫-০৭-২২' },
  { id: 'oi-03', parcelId: 'prc-02', ownerId: 'own-03', owner: OWNERS[2], khatianNumber: 'খ-০৪৫', shareNumerator: 1, shareDenominator: 2, acquisitionDate: '২০১৫-০৭-২২' },
  { id: 'oi-04', parcelId: 'prc-03', ownerId: 'own-04', owner: OWNERS[3], khatianNumber: 'খ-০৭৮', shareNumerator: 2, shareDenominator: 3, acquisitionDate: '২০১২-১১-০৫' },
  { id: 'oi-05', parcelId: 'prc-03', ownerId: 'own-05', owner: OWNERS[4], khatianNumber: 'খ-০৭৮', shareNumerator: 1, shareDenominator: 3, acquisitionDate: '২০১২-১১-০৫' },
  { id: 'oi-06', parcelId: 'prc-04', ownerId: 'own-06', owner: OWNERS[5], khatianNumber: 'খ-১১৩', shareNumerator: 1, shareDenominator: 1, acquisitionDate: '২০০৮-০৬-১৮' },
  { id: 'oi-07', parcelId: 'prc-05', ownerId: 'own-07', owner: OWNERS[6], khatianNumber: 'খ-০৩৩', shareNumerator: 1, shareDenominator: 1, acquisitionDate: '২০১৮-০৪-০৩' },
  { id: 'oi-08', parcelId: 'prc-06', ownerId: 'own-08', owner: OWNERS[7], khatianNumber: 'খ-২২১', shareNumerator: 3, shareDenominator: 4, acquisitionDate: '২০১৩-০৯-২৭' },
  { id: 'oi-09', parcelId: 'prc-06', ownerId: 'own-09', owner: OWNERS[8], khatianNumber: 'খ-২২১', shareNumerator: 1, shareDenominator: 4, acquisitionDate: '২০১৩-০৯-২৭' },
  { id: 'oi-10', parcelId: 'prc-07', ownerId: 'own-10', owner: OWNERS[9], khatianNumber: 'খ-১৫৬', shareNumerator: 1, shareDenominator: 1, acquisitionDate: '২০২০-০১-১১' },
  { id: 'oi-11', parcelId: 'prc-08', ownerId: 'own-11', owner: OWNERS[10], khatianNumber: 'খ-০৯৮', shareNumerator: 1, shareDenominator: 2, acquisitionDate: '২০১৭-০৫-১৪' },
  { id: 'oi-12', parcelId: 'prc-08', ownerId: 'own-12', owner: OWNERS[11], khatianNumber: 'খ-০৯৮', shareNumerator: 1, shareDenominator: 2, acquisitionDate: '২০১৭-০৫-১৪' },
];

export const PARCELS: Parcel[] = [
  {
    id: 'prc-01',
    mouzaId: 'mzd-02',
    dagNumber: '৪৫৬',
    surveyType: 'BS',
    area: 33,
    areaUnit: 'decimal',
    currentKhatian: 'খ-০১২',
    ownershipInterests: OWNERSHIP_INTERESTS.filter(o => o.parcelId === 'prc-01'),
    mouza: MOUZAS[1],
    upazila: UPAZILAS[0],
    district: DISTRICTS[0],
    geometry: {
      type: 'Polygon',
      coordinates: [[[90.2481, 23.8543],[90.2495, 23.8543],[90.2495, 23.8531],[90.2481, 23.8531],[90.2481, 23.8543]]],
      centroid: [23.8537, 90.2488],
    },
  },
  {
    id: 'prc-02',
    mouzaId: 'mzd-01',
    dagNumber: '২৩৪',
    surveyType: 'BS',
    area: 50,
    areaUnit: 'decimal',
    currentKhatian: 'খ-০৪৫',
    ownershipInterests: OWNERSHIP_INTERESTS.filter(o => o.parcelId === 'prc-02'),
    mouza: MOUZAS[0],
    upazila: UPAZILAS[0],
    district: DISTRICTS[0],
    geometry: {
      type: 'Polygon',
      coordinates: [[[90.3612, 23.9012],[90.3628, 23.9012],[90.3628, 23.8998],[90.3612, 23.8998],[90.3612, 23.9012]]],
      centroid: [23.9005, 90.3620],
    },
  },
  {
    id: 'prc-03',
    mouzaId: 'mzd-03',
    dagNumber: '৭৮৯',
    surveyType: 'SA',
    area: 75,
    areaUnit: 'decimal',
    currentKhatian: 'খ-০৭৮',
    ownershipInterests: OWNERSHIP_INTERESTS.filter(o => o.parcelId === 'prc-03'),
    mouza: MOUZAS[2],
    upazila: UPAZILAS[1],
    district: DISTRICTS[0],
    geometry: {
      type: 'Polygon',
      coordinates: [[[90.4234, 23.7145],[90.4252, 23.7145],[90.4252, 23.7128],[90.4234, 23.7128],[90.4234, 23.7145]]],
      centroid: [23.7136, 90.4243],
    },
  },
  {
    id: 'prc-04',
    mouzaId: 'mzd-06',
    dagNumber: '১১২',
    surveyType: 'RS',
    area: 120,
    areaUnit: 'decimal',
    currentKhatian: 'খ-১১৩',
    ownershipInterests: OWNERSHIP_INTERESTS.filter(o => o.parcelId === 'prc-04'),
    mouza: MOUZAS[5],
    upazila: UPAZILAS[4],
    district: DISTRICTS[3],
    geometry: {
      type: 'Polygon',
      coordinates: [[[89.9843, 23.7312],[89.9867, 23.7312],[89.9867, 23.7291],[89.9843, 23.7291],[89.9843, 23.7312]]],
      centroid: [23.7302, 89.9855],
    },
  },
  {
    id: 'prc-05',
    mouzaId: 'mzd-02',
    dagNumber: '৩৩১',
    surveyType: 'BS',
    area: 20,
    areaUnit: 'decimal',
    currentKhatian: 'খ-০৩৩',
    ownershipInterests: OWNERSHIP_INTERESTS.filter(o => o.parcelId === 'prc-05'),
    mouza: MOUZAS[1],
    upazila: UPAZILAS[0],
    district: DISTRICTS[0],
    geometry: {
      type: 'Polygon',
      coordinates: [[[90.2511, 23.8561],[90.2524, 23.8561],[90.2524, 23.8549],[90.2511, 23.8549],[90.2511, 23.8561]]],
      centroid: [23.8555, 90.2518],
    },
  },
  {
    id: 'prc-06',
    mouzaId: 'mzd-07',
    dagNumber: '৬৬৭',
    surveyType: 'BS',
    area: 60,
    areaUnit: 'decimal',
    currentKhatian: 'খ-২২১',
    ownershipInterests: OWNERSHIP_INTERESTS.filter(o => o.parcelId === 'prc-06'),
    mouza: MOUZAS[6],
    upazila: UPAZILAS[0],
    district: DISTRICTS[0],
    geometry: {
      type: 'Polygon',
      coordinates: [[[90.2634, 23.8701],[90.2649, 23.8701],[90.2649, 23.8688],[90.2634, 23.8688],[90.2634, 23.8701]]],
      centroid: [23.8695, 90.2642],
    },
  },
  {
    id: 'prc-07',
    mouzaId: 'mzd-01',
    dagNumber: '৮৮৮',
    surveyType: 'BS',
    area: 40,
    areaUnit: 'decimal',
    currentKhatian: 'খ-১৫৬',
    ownershipInterests: OWNERSHIP_INTERESTS.filter(o => o.parcelId === 'prc-07'),
    mouza: MOUZAS[0],
    upazila: UPAZILAS[0],
    district: DISTRICTS[0],
    geometry: {
      type: 'Polygon',
      coordinates: [[[90.3589, 23.8945],[90.3604, 23.8945],[90.3604, 23.8932],[90.3589, 23.8932],[90.3589, 23.8945]]],
      centroid: [23.8938, 90.3597],
    },
  },
  {
    id: 'prc-08',
    mouzaId: 'mzd-08',
    dagNumber: '৪৪৩',
    surveyType: 'SA',
    area: 90,
    areaUnit: 'decimal',
    currentKhatian: 'খ-০৯৮',
    ownershipInterests: OWNERSHIP_INTERESTS.filter(o => o.parcelId === 'prc-08'),
    mouza: MOUZAS[7],
    upazila: UPAZILAS[2],
    district: DISTRICTS[1],
    geometry: {
      type: 'Polygon',
      coordinates: [[[90.4521, 24.0234],[90.4539, 24.0234],[90.4539, 24.0218],[90.4521, 24.0218],[90.4521, 24.0234]]],
      centroid: [24.0226, 90.4530],
    },
  },
];

// ─── Demo Deed Scenarios ──────────────────────────────────────────────────────

export const DEMO_DEEDS: RegisteredDeed[] = [
  // Scenario 1: Valid sale
  {
    id: 'deed-s1', deedNumber: 'দলিল-২০২৬-০০১', registrationDate: '২০২৬-০১-১৫',
    registryOffice: 'সাব-রেজিস্ট্রি অফিস, সাভার', grantorName: 'রহিম উদ্দিন', granteeName: 'মোহাম্মদ ইউসুফ',
    transferArea: 33, transferAreaUnit: 'decimal', parcelIds: ['prc-01'], dagNumbers: ['৪৫৬'],
    mouzaId: 'mzd-02', surveyType: 'BS', khatianNumber: 'খ-০১২', isDemo: true,
  },
  // Scenario 2: Area discrepancy (deed says 80, parcel is 50)
  {
    id: 'deed-s2', deedNumber: 'দলিল-২০২৬-০০২', registrationDate: '২০২৬-০২-০৩',
    registryOffice: 'সাব-রেজিস্ট্রি অফিস, সাভার', grantorName: 'ফাতেমা বেগম', granteeName: 'আমিনা খাতুন',
    transferArea: 80, transferAreaUnit: 'decimal', parcelIds: ['prc-02'], dagNumbers: ['২৩৪'],
    mouzaId: 'mzd-01', surveyType: 'BS', khatianNumber: 'খ-০৪৫', isDemo: true,
  },
  // Scenario 3: Wrong dag number (deed says ৭৯০, actual is ৭৮৯)
  {
    id: 'deed-s3', deedNumber: 'দলিল-২০২৬-০০৩', registrationDate: '২০২৬-০৩-২২',
    registryOffice: 'সাব-রেজিস্ট্রি অফিস, কেরানীগঞ্জ', grantorName: 'সালমা আক্তার', granteeName: 'করিম মোল্লা',
    transferArea: 50, transferAreaUnit: 'decimal', parcelIds: ['prc-03'], dagNumbers: ['৭৯০'],
    mouzaId: 'mzd-03', surveyType: 'SA', khatianNumber: 'খ-০৭৮', isDemo: true,
  },
  // Scenario 4: Missing documents
  {
    id: 'deed-s4', deedNumber: 'দলিল-২০২৬-০০৪', registrationDate: '২০২৬-০৪-১০',
    registryOffice: 'সাব-রেজিস্ট্রি অফিস, মানিকগঞ্জ সদর', grantorName: 'নুরুল ইসলাম', granteeName: 'রফিক উদ্দিন',
    transferArea: 120, transferAreaUnit: 'decimal', parcelIds: ['prc-04'], dagNumbers: ['১১২'],
    mouzaId: 'mzd-06', surveyType: 'RS', khatianNumber: 'খ-১১৩', isDemo: true,
  },
];

// ─── Demo Extractions (simulated AI output) ───────────────────────────────────

export function buildDemoExtraction(scenario: number, documentId: string): DeedExtraction {
  const baseFields = {
    registrationDate: { fieldName: 'registrationDate', fieldNameBn: 'দলিল নিবন্ধনের তারিখ', value: '', source: 'demo' as const, confidence: 0.95, isVerified: false },
    registryOffice: { fieldName: 'registryOffice', fieldNameBn: 'রেজিস্ট্রি অফিস', value: '', source: 'demo' as const, confidence: 0.92, isVerified: false },
    district: { fieldName: 'district', fieldNameBn: 'জেলা', value: '', source: 'demo' as const, confidence: 0.97, isVerified: false },
    upazila: { fieldName: 'upazila', fieldNameBn: 'উপজেলা', value: '', source: 'demo' as const, confidence: 0.96, isVerified: false },
    mouza: { fieldName: 'mouza', fieldNameBn: 'মৌজা', value: '', source: 'demo' as const, confidence: 0.93, isVerified: false },
    jlNumber: { fieldName: 'jlNumber', fieldNameBn: 'জে.এল. নম্বর', value: '', source: 'demo' as const, confidence: 0.90, isVerified: false },
    surveyType: { fieldName: 'surveyType', fieldNameBn: 'জরিপের ধরন', value: '', source: 'demo' as const, confidence: 0.88, isVerified: false },
    khatianNumber: { fieldName: 'khatianNumber', fieldNameBn: 'খতিয়ান নম্বর', value: '', source: 'demo' as const, confidence: 0.91, isVerified: false },
    dagNumber: { fieldName: 'dagNumber', fieldNameBn: 'দাগ নম্বর', value: '', source: 'demo' as const, confidence: 0.94, isVerified: false },
    landArea: { fieldName: 'landArea', fieldNameBn: 'জমির পরিমাণ', value: '', source: 'demo' as const, confidence: 0.89, isVerified: false },
    grantor: { fieldName: 'grantor', fieldNameBn: 'দাতা', value: '', source: 'demo' as const, confidence: 0.93, isVerified: false },
    grantee: { fieldName: 'grantee', fieldNameBn: 'গ্রহীতা', value: '', source: 'demo' as const, confidence: 0.92, isVerified: false },
    deedNumber: { fieldName: 'deedNumber', fieldNameBn: 'দলিল নম্বর', value: '', source: 'demo' as const, confidence: 0.96, isVerified: false },
  };

  const scenarios: Record<number, DeedExtraction['fields']> = {
    1: {
      deedNumber: { ...baseFields.deedNumber, value: 'দলিল-২০২৬-০০১' },
      registrationDate: { ...baseFields.registrationDate, value: '১৫ জানুয়ারি ২০২৬' },
      registryOffice: { ...baseFields.registryOffice, value: 'সাব-রেজিস্ট্রি অফিস, সাভার' },
      district: { ...baseFields.district, value: 'ঢাকা' },
      upazila: { ...baseFields.upazila, value: 'সাভার' },
      mouza: { ...baseFields.mouza, value: 'পাথালিয়া' },
      jlNumber: { ...baseFields.jlNumber, value: '১৪৭' },
      surveyType: { ...baseFields.surveyType, value: 'BS' },
      khatianNumber: { ...baseFields.khatianNumber, value: 'খ-০১২' },
      dagNumber: { ...baseFields.dagNumber, value: '৪৫৬' },
      landArea: { ...baseFields.landArea, value: '৩৩ শতাংশ' },
      grantor: { ...baseFields.grantor, value: 'রহিম উদ্দিন, পিতা: আব্দুল করিম' },
      grantee: { ...baseFields.grantee, value: 'মোহাম্মদ ইউসুফ, পিতা: আলী হোসেন' },
    },
    2: {
      deedNumber: { ...baseFields.deedNumber, value: 'দলিল-২০২৬-০০২' },
      registrationDate: { ...baseFields.registrationDate, value: '৩ ফেব্রুয়ারি ২০২৬' },
      registryOffice: { ...baseFields.registryOffice, value: 'সাব-রেজিস্ট্রি অফিস, সাভার' },
      district: { ...baseFields.district, value: 'ঢাকা' },
      upazila: { ...baseFields.upazila, value: 'সাভার' },
      mouza: { ...baseFields.mouza, value: 'আশুলিয়া' },
      jlNumber: { ...baseFields.jlNumber, value: '১২৩' },
      surveyType: { ...baseFields.surveyType, value: 'BS' },
      khatianNumber: { ...baseFields.khatianNumber, value: 'খ-০৪৫' },
      dagNumber: { ...baseFields.dagNumber, value: '২৩৪' },
      landArea: { ...baseFields.landArea, value: '৮০ শতাংশ', hasWarning: true, warningMessage: 'দলিলে উল্লেখিত পরিমাণ নথিভুক্ত পরিমাণের চেয়ে বেশি মনে হচ্ছে' },
      grantor: { ...baseFields.grantor, value: 'ফাতেমা বেগম, পিতা: জহির উদ্দিন' },
      grantee: { ...baseFields.grantee, value: 'আমিনা খাতুন, পিতা: করিম মিয়া' },
    },
    3: {
      deedNumber: { ...baseFields.deedNumber, value: 'দলিল-২০২৬-০০৩' },
      registrationDate: { ...baseFields.registrationDate, value: '২২ মার্চ ২০২৬' },
      registryOffice: { ...baseFields.registryOffice, value: 'সাব-রেজিস্ট্রি অফিস, কেরানীগঞ্জ' },
      district: { ...baseFields.district, value: 'ঢাকা' },
      upazila: { ...baseFields.upazila, value: 'কেরানীগঞ্জ' },
      mouza: { ...baseFields.mouza, value: 'জিঞ্জিরা' },
      jlNumber: { ...baseFields.jlNumber, value: '০৮৯' },
      surveyType: { ...baseFields.surveyType, value: 'SA' },
      khatianNumber: { ...baseFields.khatianNumber, value: 'খ-০৭৮' },
      dagNumber: { ...baseFields.dagNumber, value: '৭৯০', hasWarning: true, warningMessage: 'এই দাগ নম্বর রেকর্ডে পাওয়া যাচ্ছে না' },
      landArea: { ...baseFields.landArea, value: '৫০ শতাংশ' },
      grantor: { ...baseFields.grantor, value: 'সালমা আক্তার, পিতা: নজরুল ইসলাম' },
      grantee: { ...baseFields.grantee, value: 'করিম মোল্লা, পিতা: আব্দুর রহমান' },
    },
    4: {
      deedNumber: { ...baseFields.deedNumber, value: 'দলিল-২০২৬-০০৪' },
      registrationDate: { ...baseFields.registrationDate, value: '১০ এপ্রিল ২০২৬' },
      registryOffice: { ...baseFields.registryOffice, value: 'সাব-রেজিস্ট্রি অফিস, মানিকগঞ্জ সদর' },
      district: { ...baseFields.district, value: 'মানিকগঞ্জ' },
      upazila: { ...baseFields.upazila, value: 'মানিকগঞ্জ সদর' },
      mouza: { ...baseFields.mouza, value: 'শিবালয়' },
      jlNumber: { ...baseFields.jlNumber, value: '০৩৪' },
      surveyType: { ...baseFields.surveyType, value: 'RS' },
      khatianNumber: { ...baseFields.khatianNumber, value: 'খ-১১৩' },
      dagNumber: { ...baseFields.dagNumber, value: '১১২' },
      landArea: { ...baseFields.landArea, value: '১২০ শতাংশ' },
      grantor: { ...baseFields.grantor, value: 'নুরুল ইসলাম, পিতা: আমির হোসেন' },
      grantee: { ...baseFields.grantee, value: 'রফিক উদ্দিন, পিতা: সাইদুর রহমান' },
    },
  };

  return {
    id: `ext-s${scenario}-${Date.now()}`,
    documentId,
    extractedAt: new Date().toISOString(),
    fields: scenarios[scenario] || scenarios[1],
  };
}

// ─── Demo Applications ────────────────────────────────────────────────────────

export const DEMO_APPLICATIONS: MutationApplication[] = [
  {
    id: 'DEMO-MUT-2026-0001',
    status: 'approved',
    createdAt: '2026-01-16T09:00:00Z',
    updatedAt: '2026-02-10T14:30:00Z',
    submittedAt: '2026-01-16T10:00:00Z',
    applicantName: 'Mohammad Yusuf',
    applicantNameBn: 'মোহাম্মদ ইউসুফ',
    applicantPhone: '+৮৮০-XXXX-XXXXX (নমুনা)',
    applicantAddress: 'গ্রাম: পাথালিয়া, উপজেলা: সাভার, জেলা: ঢাকা',
    parcelId: 'prc-01',
    parcel: PARCELS[0],
    dagNumber: '৪৫৬',
    khatianNumber: 'খ-০১২',
    mouzaId: 'mzd-02',
    mouza: MOUZAS[1],
    surveyType: 'BS',
    transferArea: 33,
    transferAreaUnit: 'decimal',
    deedNumber: 'দলিল-২০২৬-০০১',
    registrationDate: '২০২৬-০১-১৫',
    registryOffice: 'সাব-রেজিস্ট্রি অফিস, সাভার',
    grantorName: 'রহিম উদ্দিন',
    supportingDocuments: [
      { id: 'sd-01', applicationId: 'DEMO-MUT-2026-0001', documentType: 'deed', documentTypeBn: 'দলিল', filename: 'deed_s1.pdf', uploadedAt: '2026-01-16T09:00:00Z', isRequired: true, isProvided: true },
      { id: 'sd-02', applicationId: 'DEMO-MUT-2026-0001', documentType: 'khatian', documentTypeBn: 'খতিয়ান', filename: 'khatian_012.pdf', uploadedAt: '2026-01-16T09:00:00Z', isRequired: true, isProvided: true },
      { id: 'sd-03', applicationId: 'DEMO-MUT-2026-0001', documentType: 'tax_receipt', documentTypeBn: 'খাজনার রসিদ', filename: 'tax_receipt.pdf', uploadedAt: '2026-01-16T09:00:00Z', isRequired: true, isProvided: true },
    ],
    statusHistory: [
      { id: 'sh-01', applicationId: 'DEMO-MUT-2026-0001', toStatus: 'draft', changedAt: '2026-01-16T09:00:00Z', changedBy: 'মোহাম্মদ ইউসুফ', changedByRole: 'citizen' },
      { id: 'sh-02', applicationId: 'DEMO-MUT-2026-0001', fromStatus: 'draft', toStatus: 'submitted', changedAt: '2026-01-16T10:00:00Z', changedBy: 'মোহাম্মদ ইউসুফ', changedByRole: 'citizen' },
      { id: 'sh-03', applicationId: 'DEMO-MUT-2026-0001', fromStatus: 'submitted', toStatus: 'under_verification', changedAt: '2026-01-17T09:00:00Z', changedBy: 'সিস্টেম', changedByRole: 'admin' },
      { id: 'sh-04', applicationId: 'DEMO-MUT-2026-0001', fromStatus: 'under_verification', toStatus: 'officer_review', changedAt: '2026-01-20T11:00:00Z', changedBy: 'কর্মকর্তা মোঃ কামাল হোসেন', changedByRole: 'officer' },
      { id: 'sh-05', applicationId: 'DEMO-MUT-2026-0001', fromStatus: 'officer_review', toStatus: 'approved', changedAt: '2026-02-10T14:30:00Z', changedBy: 'কর্মকর্তা মোঃ কামাল হোসেন', changedByRole: 'officer', notes: 'সকল তথ্য সঠিক পাওয়া গেছে। আবেদন অনুমোদন করা হলো।' },
    ],
    officerNotes: 'দলিল ও জমির তথ্য যাচাই করা হয়েছে। কোনো অসামঞ্জস্য পাওয়া যায়নি।',
    isDemo: true,
  },
  {
    id: 'DEMO-MUT-2026-0002',
    status: 'clarification_required',
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-02-12T15:00:00Z',
    submittedAt: '2026-02-05T11:00:00Z',
    applicantName: 'Amina Khatun',
    applicantNameBn: 'আমিনা খাতুন',
    applicantPhone: '+৮৮০-XXXX-XXXXX (নমুনা)',
    applicantAddress: 'গ্রাম: আশুলিয়া, উপজেলা: সাভার, জেলা: ঢাকা',
    parcelId: 'prc-02',
    parcel: PARCELS[1],
    dagNumber: '২৩৪',
    khatianNumber: 'খ-০৪৫',
    mouzaId: 'mzd-01',
    mouza: MOUZAS[0],
    surveyType: 'BS',
    transferArea: 80,
    transferAreaUnit: 'decimal',
    deedNumber: 'দলিল-২০২৬-০০২',
    registrationDate: '২০২৬-০২-০৩',
    registryOffice: 'সাব-রেজিস্ট্রি অফিস, সাভার',
    grantorName: 'ফাতেমা বেগম',
    supportingDocuments: [
      { id: 'sd-04', applicationId: 'DEMO-MUT-2026-0002', documentType: 'deed', documentTypeBn: 'দলিল', filename: 'deed_s2.pdf', uploadedAt: '2026-02-05T10:00:00Z', isRequired: true, isProvided: true },
      { id: 'sd-05', applicationId: 'DEMO-MUT-2026-0002', documentType: 'khatian', documentTypeBn: 'খতিয়ান', filename: 'khatian_045.pdf', uploadedAt: '2026-02-05T10:00:00Z', isRequired: true, isProvided: true },
      { id: 'sd-06', applicationId: 'DEMO-MUT-2026-0002', documentType: 'tax_receipt', documentTypeBn: 'খাজনার রসিদ', filename: '', uploadedAt: '', isRequired: true, isProvided: false },
    ],
    statusHistory: [
      { id: 'sh-06', applicationId: 'DEMO-MUT-2026-0002', toStatus: 'draft', changedAt: '2026-02-05T10:00:00Z', changedBy: 'আমিনা খাতুন', changedByRole: 'citizen' },
      { id: 'sh-07', applicationId: 'DEMO-MUT-2026-0002', fromStatus: 'draft', toStatus: 'submitted', changedAt: '2026-02-05T11:00:00Z', changedBy: 'আমিনা খাতুন', changedByRole: 'citizen' },
      { id: 'sh-08', applicationId: 'DEMO-MUT-2026-0002', fromStatus: 'submitted', toStatus: 'under_verification', changedAt: '2026-02-06T09:00:00Z', changedBy: 'সিস্টেম', changedByRole: 'admin' },
      { id: 'sh-09', applicationId: 'DEMO-MUT-2026-0002', fromStatus: 'under_verification', toStatus: 'clarification_required', changedAt: '2026-02-12T15:00:00Z', changedBy: 'কর্মকর্তা মোঃ কামাল হোসেন', changedByRole: 'officer', notes: 'দলিলে উল্লেখিত জমির পরিমাণ (৮০ শতাংশ) রেকর্ডে নথিভুক্ত পরিমাণের (৫০ শতাংশ) বেশি। সঠিক তথ্য দিয়ে আবেদন সংশোধন করুন।' },
    ],
    officerNotes: 'জমির পরিমাণে অসামঞ্জস্য পাওয়া গেছে। আবেদনকারীকে সঠিক দলিল জমা দিতে হবে।',
    isDemo: true,
  },
  {
    id: 'DEMO-MUT-2026-0003',
    status: 'officer_review',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-05T12:00:00Z',
    submittedAt: '2026-03-01T09:00:00Z',
    applicantName: 'Karim Molla',
    applicantNameBn: 'করিম মোল্লা',
    applicantPhone: '+৮৮০-XXXX-XXXXX (নমুনা)',
    applicantAddress: 'গ্রাম: জিঞ্জিরা, উপজেলা: কেরানীগঞ্জ, জেলা: ঢাকা',
    parcelId: 'prc-03',
    parcel: PARCELS[2],
    dagNumber: '৭৮৯',
    khatianNumber: 'খ-০৭৮',
    mouzaId: 'mzd-03',
    mouza: MOUZAS[2],
    surveyType: 'SA',
    transferArea: 50,
    transferAreaUnit: 'decimal',
    deedNumber: 'দলিল-২০২৬-০০৩',
    registrationDate: '২০২৬-০৩-২২',
    registryOffice: 'সাব-রেজিস্ট্রি অফিস, কেরানীগঞ্জ',
    grantorName: 'সালমা আক্তার',
    supportingDocuments: [
      { id: 'sd-07', applicationId: 'DEMO-MUT-2026-0003', documentType: 'deed', documentTypeBn: 'দলিল', filename: 'deed_s3.pdf', uploadedAt: '2026-03-01T08:00:00Z', isRequired: true, isProvided: true },
      { id: 'sd-08', applicationId: 'DEMO-MUT-2026-0003', documentType: 'khatian', documentTypeBn: 'খতিয়ান', filename: 'khatian_078.pdf', uploadedAt: '2026-03-01T08:00:00Z', isRequired: true, isProvided: true },
      { id: 'sd-09', applicationId: 'DEMO-MUT-2026-0003', documentType: 'tax_receipt', documentTypeBn: 'খাজনার রসিদ', filename: 'tax_003.pdf', uploadedAt: '2026-03-01T08:00:00Z', isRequired: true, isProvided: true },
    ],
    statusHistory: [
      { id: 'sh-10', applicationId: 'DEMO-MUT-2026-0003', toStatus: 'draft', changedAt: '2026-03-01T08:00:00Z', changedBy: 'করিম মোল্লা', changedByRole: 'citizen' },
      { id: 'sh-11', applicationId: 'DEMO-MUT-2026-0003', fromStatus: 'draft', toStatus: 'submitted', changedAt: '2026-03-01T09:00:00Z', changedBy: 'করিম মোল্লা', changedByRole: 'citizen' },
      { id: 'sh-12', applicationId: 'DEMO-MUT-2026-0003', fromStatus: 'submitted', toStatus: 'under_verification', changedAt: '2026-03-02T09:00:00Z', changedBy: 'সিস্টেম', changedByRole: 'admin' },
      { id: 'sh-13', applicationId: 'DEMO-MUT-2026-0003', fromStatus: 'under_verification', toStatus: 'officer_review', changedAt: '2026-03-05T12:00:00Z', changedBy: 'কর্মকর্তা মোঃ কামাল হোসেন', changedByRole: 'officer' },
    ],
    isDemo: true,
  },
];

// ─── Demo Users ───────────────────────────────────────────────────────────────

export const DEMO_USERS = {
  citizen: { id: 'user-01', name: 'Mohammad Yusuf', nameBn: 'মোহাম্মদ ইউসুফ', role: 'citizen' as const, email: 'citizen@demo.local' },
  officer: { id: 'user-02', name: 'Md. Kamal Hossain', nameBn: 'মোঃ কামাল হোসেন', role: 'officer' as const, email: 'officer@demo.local' },
};

// ─── Verification Rules ────────────────────────────────────────────────────────

export const VERIFICATION_RULES = {
  R01: { code: 'R01', name: 'Ownership Share Validation', nameBn: 'মালিকানার অংশ যাচাই', description: 'Checks seller share covers transfer area', descriptionBn: 'বিক্রেতার রেকর্ডকৃত অংশ হস্তান্তর পরিমাণ সমর্থন করে কিনা যাচাই করা হয়' },
  R02: { code: 'R02', name: 'Deed vs Parcel Mismatch', nameBn: 'দলিল ও দাগের অমিল', description: 'Compares deed fields with parcel record', descriptionBn: 'দলিলের তথ্য ও জমির রেকর্ডের মধ্যে অমিল খোঁজা হয়' },
  R03: { code: 'R03', name: 'Duplicate Application', nameBn: 'একই দলিলে পুনরায় আবেদন', description: 'Finds duplicate mutation requests', descriptionBn: 'একই নিবন্ধিত হস্তান্তরের জন্য সম্ভাব্য পুনরায় আবেদন খোঁজা হয়' },
  R04: { code: 'R04', name: 'Registration vs Mutation Discrepancy', nameBn: 'নিবন্ধন ও নামজারির অমিল', description: 'Identifies inconsistent fields', descriptionBn: 'নিবন্ধিত দলিল ও নামজারি আবেদনের মধ্যে অসঙ্গতি চিহ্নিত করা হয়' },
  R05: { code: 'R05', name: 'Missing Supporting Documents', nameBn: 'প্রয়োজনীয় কাগজপত্র অনুপস্থিত', description: 'Flags missing required evidence', descriptionBn: 'আবেদনের জন্য প্রয়োজনীয় কিন্তু অনুপস্থিত কাগজপত্র চিহ্নিত করা হয়' },
  R06: { code: 'R06', name: 'Unresolved Parcel Identification', nameBn: 'দাগ চিহ্নিতকরণ অনিশ্চিত', description: 'Requires human confirmation for ambiguous matches', descriptionBn: 'একাধিক সম্ভাব্য দাগ পাওয়া গেলে মানব যাচাই প্রয়োজন' },
  R07: { code: 'R07', name: 'Parcel Boundary Inconsistency', nameBn: 'জমির সীমানায় অসঙ্গতি', description: 'Identifies meaningful spatial overlaps', descriptionBn: 'যখন যথেষ্ট জ্যামিতিক তথ্য থাকে, তখন সীমানার অসঙ্গতি চিহ্নিত করা হয়' },
};
