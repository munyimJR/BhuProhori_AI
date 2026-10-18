// Verification Engine — deterministic rules-based checking
import type {
  MutationApplication, VerificationResult, VerificationFinding,
  VerificationCategory, VerificationSeverity
} from '../types';
import { PARCELS, DEMO_APPLICATIONS, VERIFICATION_RULES, DEMO_DEEDS } from '../data/demoData';

let findingCounter = 0;
function makeId() { return `vf-${++findingCounter}-${Date.now()}`; }

function finding(
  applicationId: string,
  ruleCode: string,
  severity: VerificationSeverity,
  titleBn: string,
  descriptionBn: string,
  affectedFields: string[],
  sourceReferences: string[],
  recommendedActionBn: string,
  requiresHumanReview: boolean,
): VerificationFinding {
  return {
    id: makeId(),
    applicationId,
    ruleCode,
    rule: VERIFICATION_RULES[ruleCode as keyof typeof VERIFICATION_RULES],
    severity,
    titleBn,
    descriptionBn,
    affectedFields,
    sourceReferences,
    recommendedActionBn,
    requiresHumanReview,
  };
}

export function runVerification(app: MutationApplication): VerificationResult {
  const findings: VerificationFinding[] = [];
  const passedRules: string[] = [];

  const parcel = app.parcel ?? PARCELS.find(p => p.id === app.parcelId);
  const registeredDeed = DEMO_DEEDS.find(d => d.deedNumber === app.deedNumber);

  // ── R01: Ownership Share Validation ─────────────────────────────────────────
  if (parcel) {
    const grantor = parcel.ownershipInterests.find(oi =>
      oi.owner?.nameBn.includes(app.grantorName.slice(0, 3)) ||
      app.grantorName.includes(oi.owner?.nameBn.slice(0, 3) ?? '')
    );
    if (grantor) {
      const maxTransferableArea = parcel.area * (grantor.shareNumerator / grantor.shareDenominator);
      if (app.transferArea > maxTransferableArea * 1.02) {
        findings.push(finding(
          app.id, 'R01', 'critical',
          'মালিকানার অংশের সীমা অতিক্রম',
          `দলিলে উল্লেখিত হস্তান্তরের পরিমাণ (${app.transferArea} শতাংশ) বিক্রেতার রেকর্ডকৃত সর্বোচ্চ হস্তান্তরযোগ্য পরিমাণ (${maxTransferableArea.toFixed(2)} শতাংশ) এর চেয়ে বেশি।`,
          ['transferArea', 'grantorName'],
          [`দাগ: ${parcel.dagNumber}`, `মালিক: ${grantor.owner?.nameBn}`],
          'সঠিক হস্তান্তর পরিমাণ নিশ্চিত করুন এবং মূল দলিল পুনরায় যাচাই করুন।',
          true,
        ));
      } else {
        passedRules.push('R01');
      }
    } else {
      passedRules.push('R01');
    }
  } else {
    passedRules.push('R01');
  }

  // ── R02: Deed vs Parcel Mismatch ─────────────────────────────────────────────
  if (parcel) {
    const areaMismatch = Math.abs(app.transferArea - parcel.area) > parcel.area * 0.05;
    const dagMismatch = app.dagNumber !== parcel.dagNumber;
    const khatianMismatch = app.khatianNumber !== parcel.currentKhatian;
    const surveyMismatch = app.surveyType !== parcel.surveyType;

    if (dagMismatch) {
      findings.push(finding(
        app.id, 'R02', 'error',
        'দাগ নম্বর অমিল',
        `আবেদনে উল্লেখিত দাগ নম্বর (${app.dagNumber}) রেকর্ডে নথিভুক্ত দাগ নম্বর (${parcel.dagNumber}) এর সাথে মিলছে না।`,
        ['dagNumber'],
        [`পার্সেল রেকর্ড: ${parcel.id}`],
        'সঠিক দাগ নম্বর নিশ্চিত করুন। প্রয়োজনে মূল দলিল পরীক্ষা করুন।',
        true,
      ));
    } else if (areaMismatch || khatianMismatch || surveyMismatch) {
      const issues = [];
      if (areaMismatch) issues.push(`জমির পরিমাণ: দলিলে ${app.transferArea} শতাংশ, রেকর্ডে ${parcel.area} শতাংশ`);
      if (khatianMismatch) issues.push(`খতিয়ান: দলিলে ${app.khatianNumber}, রেকর্ডে ${parcel.currentKhatian}`);
      if (surveyMismatch) issues.push(`জরিপের ধরন: দলিলে ${app.surveyType}, রেকর্ডে ${parcel.surveyType}`);
      findings.push(finding(
        app.id, 'R02', 'warning',
        'দলিল ও জমির রেকর্ডে অমিল',
        `দলিল ও নথিভুক্ত জমির তথ্যে নিচের পার্থক্য পাওয়া গেছে: ${issues.join('; ')}।`,
        ['transferArea', 'khatianNumber', 'surveyType'].filter((_, i) => [areaMismatch, khatianMismatch, surveyMismatch][i]),
        [`পার্সেল রেকর্ড: ${parcel.id}`],
        'তথ্যের অসামঞ্জস্য পর্যালোচনা করুন। প্রয়োজনে মূল নথি ও ভূমি রেকর্ড যাচাই করুন।',
        true,
      ));
    } else {
      passedRules.push('R02');
    }
  } else {
    passedRules.push('R02');
  }

  // ── R03: Duplicate Application ───────────────────────────────────────────────
  const duplicates = DEMO_APPLICATIONS.filter(a =>
    a.id !== app.id &&
    a.deedNumber === app.deedNumber &&
    ['submitted', 'under_verification', 'officer_review', 'approved'].includes(a.status)
  );
  if (duplicates.length > 0) {
    findings.push(finding(
      app.id, 'R03', 'warning',
      'একই দলিলে আগের আবেদন বিদ্যমান',
      `এই দলিল নম্বর (${app.deedNumber}) ব্যবহার করে আগে ${duplicates.length}টি আবেদন পাওয়া গেছে: ${duplicates.map(d => d.id).join(', ')}।`,
      ['deedNumber'],
      duplicates.map(d => `আবেদন: ${d.id}`),
      'নিশ্চিত করুন যে এটি একটি নতুন হস্তান্তর। আগের আবেদনের অবস্থা যাচাই করুন।',
      true,
    ));
  } else {
    passedRules.push('R03');
  }

  // ── R04: Registration vs Mutation Discrepancy ────────────────────────────────
  if (registeredDeed) {
    const areaDiff = Math.abs(registeredDeed.transferArea - app.transferArea);
    if (areaDiff > registeredDeed.transferArea * 0.02) {
      findings.push(finding(
        app.id, 'R04', 'error',
        'নিবন্ধিত দলিল ও নামজারি আবেদনে অমিল',
        `নিবন্ধিত দলিলে জমির পরিমাণ ${registeredDeed.transferArea} শতাংশ, কিন্তু নামজারি আবেদনে ${app.transferArea} শতাংশ উল্লেখ করা হয়েছে।`,
        ['transferArea'],
        [`নিবন্ধিত দলিল: ${registeredDeed.deedNumber}`],
        'নামজারি আবেদনে সঠিক জমির পরিমাণ (${registeredDeed.transferArea} শতাংশ) ব্যবহার করুন।',
        false,
      ));
    } else {
      passedRules.push('R04');
    }
  } else {
    passedRules.push('R04');
  }

  // ── R05: Missing Supporting Documents ───────────────────────────────────────
  const requiredDocs = app.supportingDocuments.filter(d => d.isRequired);
  const missingDocs = requiredDocs.filter(d => !d.isProvided);
  if (missingDocs.length > 0) {
    findings.push(finding(
      app.id, 'R05', 'warning',
      'প্রয়োজনীয় কাগজপত্র অনুপস্থিত',
      `নিচের ${missingDocs.length}টি প্রয়োজনীয় কাগজপত্র জমা দেওয়া হয়নি: ${missingDocs.map(d => d.documentTypeBn).join(', ')}।`,
      ['supportingDocuments'],
      missingDocs.map(d => `প্রয়োজনীয়: ${d.documentTypeBn}`),
      `অনুপস্থিত কাগজপত্র জমা দিন: ${missingDocs.map(d => d.documentTypeBn).join(', ')}।`,
      false,
    ));
  } else {
    passedRules.push('R05');
  }

  // ── R06: Unresolved Parcel Identification ────────────────────────────────────
  if (!app.parcelId) {
    findings.push(finding(
      app.id, 'R06', 'error',
      'জমি চিহ্নিতকরণ নিশ্চিত হয়নি',
      'আবেদনের সাথে কোনো নির্দিষ্ট দাগ যুক্ত করা হয়নি। জমি চিহ্নিত না করে নামজারি আবেদন প্রক্রিয়া করা সম্ভব নয়।',
      ['dagNumber', 'khatianNumber'],
      [],
      'সংশ্লিষ্ট জমির দাগ নিশ্চিত করুন এবং আবেদনের সাথে যুক্ত করুন।',
      true,
    ));
  } else {
    passedRules.push('R06');
  }

  // ── R07: Parcel Boundary (simplified check) ──────────────────────────────────
  passedRules.push('R07'); // Passes by default in demo

  // ── Calculate category ────────────────────────────────────────────────────────
  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const errorCount = findings.filter(f => f.severity === 'error').length;
  const warningCount = findings.filter(f => f.severity === 'warning').length;

  let category: VerificationCategory;
  if (criticalCount > 0 || errorCount > 1) {
    category = 'review_required';
  } else if (errorCount > 0 || warningCount > 1) {
    category = 'clarification_required';
  } else if (warningCount > 0) {
    category = 'clarification_required';
  } else if (!app.parcelId) {
    category = 'insufficient_evidence';
  } else {
    category = 'no_inconsistency';
  }

  const totalRules = Object.keys(VERIFICATION_RULES).length;
  const overallScore = Math.round((passedRules.length / totalRules) * 100);

  return {
    applicationId: app.id,
    runAt: new Date().toISOString(),
    category,
    findings,
    passedRules,
    overallScore,
  };
}

export function runVerificationForScenario(scenarioNumber: number, applicationId: string): VerificationResult {
  const scenario1App: MutationApplication = {
    id: applicationId,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    applicantName: 'Mohammad Yusuf',
    applicantNameBn: 'মোহাম্মদ ইউসুফ',
    applicantPhone: '',
    applicantAddress: '',
    parcelId: 'prc-01',
    parcel: PARCELS[0],
    dagNumber: '৪৫৬',
    khatianNumber: 'খ-০১২',
    mouzaId: 'mzd-02',
    surveyType: 'BS',
    transferArea: 33,
    transferAreaUnit: 'decimal',
    deedNumber: 'দলিল-২০২৬-০০১',
    registrationDate: '২০২৬-০১-১৫',
    registryOffice: 'সাব-রেজিস্ট্রি অফিস, সাভার',
    grantorName: 'রহিম উদ্দিন',
    supportingDocuments: [
      { id: 'sd-t1', applicationId, documentType: 'deed', documentTypeBn: 'দলিল', filename: 'deed.pdf', uploadedAt: new Date().toISOString(), isRequired: true, isProvided: true },
      { id: 'sd-t2', applicationId, documentType: 'khatian', documentTypeBn: 'খতিয়ান', filename: 'khatian.pdf', uploadedAt: new Date().toISOString(), isRequired: true, isProvided: true },
      { id: 'sd-t3', applicationId, documentType: 'tax_receipt', documentTypeBn: 'খাজনার রসিদ', filename: 'tax.pdf', uploadedAt: new Date().toISOString(), isRequired: true, isProvided: true },
    ],
    statusHistory: [],
    isDemo: true,
  };

  const scenarios: Record<number, MutationApplication> = {
    1: scenario1App,
    2: {
      ...scenario1App, id: applicationId, dagNumber: '২৩৪', parcelId: 'prc-02',
      parcel: PARCELS[1], transferArea: 80, khatianNumber: 'খ-০৪৫', mouzaId: 'mzd-01',
      deedNumber: 'দলিল-২০২৬-০০২', grantorName: 'ফাতেমা বেগম',
      supportingDocuments: [
        { id: 'sd-t4', applicationId, documentType: 'deed', documentTypeBn: 'দলিল', filename: 'deed.pdf', uploadedAt: new Date().toISOString(), isRequired: true, isProvided: true },
        { id: 'sd-t5', applicationId, documentType: 'khatian', documentTypeBn: 'খতিয়ান', filename: 'khatian.pdf', uploadedAt: new Date().toISOString(), isRequired: true, isProvided: true },
        { id: 'sd-t6', applicationId, documentType: 'tax_receipt', documentTypeBn: 'খাজনার রসিদ', filename: '', uploadedAt: '', isRequired: true, isProvided: false },
      ],
    },
    3: {
      ...scenario1App, id: applicationId, dagNumber: '৭৯০', parcelId: 'prc-03',
      parcel: { ...PARCELS[2], dagNumber: '৭৮৯' }, transferArea: 50, khatianNumber: 'খ-০৭৮', mouzaId: 'mzd-03',
      surveyType: 'SA', deedNumber: 'দলিল-২০২৬-০০৩', grantorName: 'সালমা আক্তার',
    },
    4: {
      ...scenario1App, id: applicationId, dagNumber: '১১২', parcelId: 'prc-04',
      parcel: PARCELS[3], transferArea: 120, khatianNumber: 'খ-১১৩', mouzaId: 'mzd-06',
      surveyType: 'RS', deedNumber: 'দলিল-২০২৬-০০৪', grantorName: 'নুরুল ইসলাম',
      supportingDocuments: [
        { id: 'sd-t7', applicationId, documentType: 'deed', documentTypeBn: 'দলিল', filename: 'deed.pdf', uploadedAt: new Date().toISOString(), isRequired: true, isProvided: true },
        { id: 'sd-t8', applicationId, documentType: 'khatian', documentTypeBn: 'খতিয়ান', filename: '', uploadedAt: '', isRequired: true, isProvided: false },
        { id: 'sd-t9', applicationId, documentType: 'tax_receipt', documentTypeBn: 'খাজনার রসিদ', filename: '', uploadedAt: '', isRequired: true, isProvided: false },
        { id: 'sd-t10', applicationId, documentType: 'inheritance_doc', documentTypeBn: 'উত্তরাধিকার দলিল', filename: '', uploadedAt: '', isRequired: true, isProvided: false },
      ],
    },
  };

  const appToVerify = scenarios[scenarioNumber] ?? scenario1App;
  return runVerification(appToVerify);
}
