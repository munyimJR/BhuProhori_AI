// Core Types for BhuProhori AI

export type SurveyType = 'BS' | 'SA' | 'CS' | 'RS' | 'BRS';
export type DocumentStatus = 'uploading' | 'processing' | 'ready' | 'error';
export type FieldSource = 'ocr' | 'manual' | 'demo' | 'computed';
export type VerificationSeverity = 'info' | 'warning' | 'error' | 'critical';
export type MutationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_verification' 
  | 'officer_review' 
  | 'clarification_required'
  | 'additional_evidence_submitted'
  | 'field_verification_requested'
  | 'hearing_scheduled'
  | 'approved' 
  | 'rejected';

export type UserRole = 'citizen' | 'officer' | 'admin';

export interface District {
  id: string;
  name: string;
  nameBn: string;
}

export interface Upazila {
  id: string;
  districtId: string;
  name: string;
  nameBn: string;
}

export interface Mouza {
  id: string;
  upazilaId: string;
  name: string;
  nameBn: string;
  jlNumber: string;
}

export interface ParcelGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][];
  centroid?: [number, number];
}

export interface Owner {
  id: string;
  name: string;
  nameBn: string;
  fatherName?: string;
  address?: string;
  isFictional: boolean;
}

export interface OwnershipInterest {
  id: string;
  parcelId: string;
  ownerId: string;
  owner?: Owner;
  khatianNumber: string;
  shareNumerator: number;
  shareDenominator: number;
  acquisitionDate?: string;
  acquisitionDeedId?: string;
}

export interface Parcel {
  id: string;
  mouzaId: string;
  dagNumber: string;
  surveyType: SurveyType;
  area: number;
  areaUnit: 'decimal' | 'katha' | 'bigha';
  currentKhatian: string;
  geometry?: ParcelGeometry;
  ownershipInterests: OwnershipInterest[];
  mouza?: Mouza;
  upazila?: Upazila;
  district?: District;
}

export interface UploadedDocument {
  id: string;
  filename: string;
  fileType: 'pdf' | 'jpg' | 'jpeg' | 'png';
  fileSize: number;
  uploadedAt: string;
  status: DocumentStatus;
  previewUrl?: string;
  source: 'upload' | 'demo';
  demoScenario?: number;
}

export interface ExtractedField {
  fieldName: string;
  fieldNameBn: string;
  value: string;
  normalizedValue?: string;
  userCorrectedValue?: string;
  source: FieldSource;
  confidence?: number;
  isVerified: boolean;
  hasWarning?: boolean;
  warningMessage?: string;
}

export interface DeedExtraction {
  id: string;
  documentId: string;
  extractedAt: string;
  fields: {
    deedNumber: ExtractedField;
    registrationDate: ExtractedField;
    registryOffice: ExtractedField;
    district: ExtractedField;
    upazila: ExtractedField;
    mouza: ExtractedField;
    jlNumber: ExtractedField;
    surveyType: ExtractedField;
    khatianNumber: ExtractedField;
    dagNumber: ExtractedField;
    landArea: ExtractedField;
    grantor: ExtractedField;
    grantee: ExtractedField;
  };
}

export interface RegisteredDeed {
  id: string;
  deedNumber: string;
  registrationDate: string;
  registryOffice: string;
  grantorName: string;
  granteeName: string;
  transferArea: number;
  transferAreaUnit: string;
  parcelIds: string[];
  dagNumbers: string[];
  mouzaId: string;
  surveyType: SurveyType;
  khatianNumber: string;
  isDemo: boolean;
}

export interface VerificationRule {
  code: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
}

export interface VerificationFinding {
  id: string;
  applicationId: string;
  ruleCode: string;
  rule?: VerificationRule;
  severity: VerificationSeverity;
  titleBn: string;
  descriptionBn: string;
  affectedFields: string[];
  sourceReferences: string[];
  recommendedActionBn: string;
  requiresHumanReview: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export type VerificationCategory = 
  | 'no_inconsistency'
  | 'clarification_required'
  | 'review_required'
  | 'insufficient_evidence';

export interface VerificationResult {
  applicationId: string;
  runAt: string;
  category: VerificationCategory;
  findings: VerificationFinding[];
  passedRules: string[];
  overallScore: number;
}

export interface StatusHistoryEntry {
  id: string;
  applicationId: string;
  fromStatus?: MutationStatus;
  toStatus: MutationStatus;
  changedAt: string;
  changedBy: string;
  changedByRole: UserRole;
  notes?: string;
}

export interface SupportingDocument {
  id: string;
  applicationId: string;
  documentType: string;
  documentTypeBn: string;
  filename: string;
  uploadedAt: string;
  isRequired: boolean;
  isProvided: boolean;
}

export interface MutationApplication {
  id: string;
  status: MutationStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  applicantName: string;
  applicantNameBn: string;
  applicantPhone: string;
  applicantAddress: string;
  parcelId?: string;
  parcel?: Parcel;
  dagNumber: string;
  khatianNumber: string;
  mouzaId: string;
  mouza?: Mouza;
  surveyType: SurveyType;
  transferArea: number;
  transferAreaUnit: string;
  documentId?: string;
  deedNumber: string;
  registrationDate: string;
  registryOffice: string;
  grantorName: string;
  supportingDocuments: SupportingDocument[];
  verificationResult?: VerificationResult;
  statusHistory: StatusHistoryEntry[];
  officerNotes?: string;
  officerDecisionReason?: string;
  assignedOfficerId?: string;
  isDemo: boolean;
}

export interface ApplicationState {
  currentStep: number;
  document?: UploadedDocument;
  extraction?: DeedExtraction;
  selectedParcel?: Parcel;
  verificationResult?: VerificationResult;
  application?: MutationApplication;
}

export interface User {
  id: string;
  name: string;
  nameBn: string;
  role: UserRole;
  email?: string;
}

export interface ParcelMatchResult {
  parcel: Parcel;
  confidence: number;
  matchedFields: string[];
  unmatchedFields: string[];
  isAmbiguous: boolean;
}

export type DemoScenario = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
