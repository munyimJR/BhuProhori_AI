// Application Store — manages the full mutation workflow state
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Language, UploadedDocument, DeedExtraction, Parcel, ExtractedField,
  MutationApplication, MutationStatus, VerificationResult, StatusHistoryEntry,
  UserProfile, GeminiFraudAudit
} from '../types';
import { buildDemoExtraction, PARCELS, MOUZAS, DEMO_APPLICATIONS } from '../data/demoData';
import { runVerification, runVerificationForScenario } from '../services/verificationEngine';
import { getStoredGeminiKey, saveGeminiKey, runGeminiAnalysis, convertToAppExtraction } from '../services/geminiService';

export const DEMO_CITIZEN_PROFILE: UserProfile = {
  id: 'usr-citizen-demo',
  name: 'Md. Rafiqul Islam',
  nameBn: 'মোঃ রফিকুল ইসলাম',
  role: 'citizen',
  phone: '01711-234567',
  nid: '19882692510000123',
  avatarLetter: 'R',
};

export const DEMO_OFFICER_PROFILE: UserProfile = {
  id: 'usr-officer-demo',
  name: 'Tahmina Akhter (AC Land)',
  nameBn: 'তাহমিনা আক্তার (এসি ল্যান্ড)',
  role: 'officer',
  designation: 'সহকারী কমিশনার (ভূমি) / Assistant Commissioner (Land)',
  office: 'সাভার উপজেলা রাজস্ব সার্কেল, ঢাকা',
  nid: 'AC-LAND-SAVAR-04',
  avatarLetter: 'T',
};

interface AppStore {
  // Current journey state
  currentStep: number;
  document: UploadedDocument | null;
  extraction: DeedExtraction | null;
  selectedParcel: Parcel | null;
  verificationResult: VerificationResult | null;
  currentApplication: MutationApplication | null;
  currentScenario: number;

  // All applications (demo database)
  allApplications: MutationApplication[];

  // Auth & Settings
  currentRole: 'citizen' | 'officer';
  language: Language;
  isAuthenticated: boolean;
  currentUser: UserProfile | null;

  // AI & Gemini Live Engine
  geminiApiKey: string;
  aiAuditResult: GeminiFraudAudit | null;
  isAiLoading: boolean;
  aiError: string | null;
  lastAiInputText: string;

  // Actions
  setGeminiApiKey: (key: string) => void;
  setAiAuditResult: (audit: GeminiFraudAudit | null) => void;
  runLiveGeminiExtraction: (text?: string, base64?: string, mimeType?: string) => Promise<void>;
  setStep: (step: number) => void;
  setDocument: (doc: UploadedDocument) => void;
  loadDemoScenario: (scenario: number) => void;
  setExtraction: (extraction: DeedExtraction) => void;
  updateExtractionField: (fieldName: string, value: string) => void;
  setSelectedParcel: (parcel: Parcel) => void;
  runVerificationCheck: () => void;
  createApplication: (data: Partial<MutationApplication>) => MutationApplication;
  submitApplication: (id: string) => void;
  updateApplicationStatus: (id: string, status: MutationStatus, notes?: string, actorName?: string) => void;
  getApplication: (id: string) => MutationApplication | undefined;
  resetJourney: () => void;
  setRole: (role: 'citizen' | 'officer') => void;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  login: (role: 'citizen' | 'officer', customUser?: Partial<UserProfile>) => void;
  logout: () => void;
}

let appCounter = 5;
function genAppId() { return `DEMO-MUT-2026-${String(++appCounter).padStart(4, '0')}`; }

const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      document: null,
      extraction: null,
      selectedParcel: null,
      verificationResult: null,
      currentApplication: null,
      currentScenario: 1,
      allApplications: DEMO_APPLICATIONS,
      currentRole: 'citizen',
      language: 'bn',
      isAuthenticated: false,
      currentUser: null,

      // Gemini AI Engine
      geminiApiKey: getStoredGeminiKey(),
      aiAuditResult: null,
      isAiLoading: false,
      aiError: null,
      lastAiInputText: '',

      setGeminiApiKey: (key) => {
        saveGeminiKey(key);
        set({ geminiApiKey: key });
      },

      setAiAuditResult: (audit) => set({ aiAuditResult: audit }),

      runLiveGeminiExtraction: async (text, base64, mimeType) => {
        const { geminiApiKey } = get();
        set({ isAiLoading: true, aiError: null });
        try {
          const result = await runGeminiAnalysis({
            text,
            base64Image: base64,
            mimeType,
            apiKey: geminiApiKey,
          });
          const docId = `gemini-doc-${Date.now()}`;
          const extraction = convertToAppExtraction(result, docId);

          const doc: UploadedDocument = {
            id: docId,
            filename: result.deedNumber ? `দলিল_${result.deedNumber}.txt` : 'লাইভ_AI_বিশ্লেষিত_দলিল.txt',
            fileType: 'pdf',
            fileSize: (text?.length || 500) * 2,
            uploadedAt: new Date().toISOString(),
            status: 'ready',
            source: 'upload',
          };

          set({
            extraction,
            aiAuditResult: result.fraudAudit,
            isAiLoading: false,
            document: doc,
            lastAiInputText: text || '',
          });
        } catch (err: any) {
          set({
            isAiLoading: false,
            aiError: err?.message || 'Gemini API কল করতে ব্যর্থ হয়েছে।',
          });
          throw err;
        }
      },

      setStep: (step) => set({ currentStep: step }),

      setDocument: (doc) => set({ document: doc, extraction: null, selectedParcel: null, verificationResult: null }),

      loadDemoScenario: (scenario) => {
        const docId = `demo-doc-s${scenario}-${Date.now()}`;
        const doc: UploadedDocument = {
          id: docId,
          filename: `নমুনা_দলিল_পরিস্থিতি_${scenario}.pdf`,
          fileType: 'pdf',
          fileSize: 245000 + scenario * 12000,
          uploadedAt: new Date().toISOString(),
          status: 'ready',
          source: 'demo',
          demoScenario: scenario,
        };
        const extraction = buildDemoExtraction(scenario, docId);
        set({ document: doc, extraction, currentStep: 2, currentScenario: scenario, selectedParcel: null, verificationResult: null, currentApplication: null });
      },

      setExtraction: (extraction) => set({ extraction }),

      updateExtractionField: (fieldName, value) => {
        const { extraction } = get();
        if (!extraction) return;
        set({
          extraction: {
            ...extraction,
            fields: {
              ...extraction.fields,
              [fieldName]: {
                ...(extraction.fields as Record<string, ExtractedField>)[fieldName],
                userCorrectedValue: value,
                source: 'manual',
              },
            },
          },
        });
      },

      setSelectedParcel: (parcel) => set({ selectedParcel: parcel }),

      runVerificationCheck: () => {
        const { currentApplication, currentScenario } = get();
        let result: VerificationResult;
        if (currentApplication) {
          result = runVerification(currentApplication);
        } else {
          result = runVerificationForScenario(currentScenario, genAppId());
        }
        set({ verificationResult: result });
      },

      createApplication: (data) => {
        const { extraction, selectedParcel } = get();
        const id = genAppId();

        const getFieldValue = (fieldName: keyof DeedExtraction['fields']) => {
          if (!extraction) return '';
          const field = extraction.fields[fieldName];
          return field?.userCorrectedValue ?? field?.value ?? '';
        };

        const parcel = selectedParcel ?? PARCELS.find(p => p.dagNumber === getFieldValue('dagNumber'));

        const historyEntry: StatusHistoryEntry = {
          id: `sh-new-${Date.now()}`,
          applicationId: id,
          toStatus: 'draft',
          changedAt: new Date().toISOString(),
          changedBy: data.applicantNameBn ?? 'আবেদনকারী',
          changedByRole: 'citizen',
        };

        const app: MutationApplication = {
          id,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          applicantName: data.applicantName ?? '',
          applicantNameBn: data.applicantNameBn ?? '',
          applicantPhone: data.applicantPhone ?? '',
          applicantAddress: data.applicantAddress ?? '',
          parcelId: parcel?.id,
          parcel,
          dagNumber: data.dagNumber ?? getFieldValue('dagNumber'),
          khatianNumber: data.khatianNumber ?? getFieldValue('khatianNumber'),
          mouzaId: parcel?.mouzaId ?? '',
          mouza: parcel?.mouza ?? MOUZAS.find(m => m.nameBn === getFieldValue('mouza')),
          surveyType: (data.surveyType ?? getFieldValue('surveyType') ?? 'BS') as MutationApplication['surveyType'],
          transferArea: data.transferArea ?? (parseFloat(getFieldValue('landArea').replace(/[^\d.]/g, '')) || 0),
          transferAreaUnit: 'decimal',
          deedNumber: data.deedNumber ?? getFieldValue('deedNumber'),
          registrationDate: data.registrationDate ?? getFieldValue('registrationDate'),
          registryOffice: data.registryOffice ?? getFieldValue('registryOffice'),
          grantorName: data.grantorName ?? getFieldValue('grantor'),
          supportingDocuments: data.supportingDocuments ?? [
            { id: `sd-${id}-1`, applicationId: id, documentType: 'deed', documentTypeBn: 'দলিল (মূল কপি)', filename: extraction?.documentId ? 'uploaded_deed.pdf' : '', uploadedAt: new Date().toISOString(), isRequired: true, isProvided: !!extraction },
            { id: `sd-${id}-2`, applicationId: id, documentType: 'khatian', documentTypeBn: 'খতিয়ানের সত্যায়িত কপি', filename: '', uploadedAt: '', isRequired: true, isProvided: false },
            { id: `sd-${id}-3`, applicationId: id, documentType: 'tax_receipt', documentTypeBn: 'ভূমি উন্নয়ন করের রসিদ', filename: '', uploadedAt: '', isRequired: true, isProvided: false },
            { id: `sd-${id}-4`, applicationId: id, documentType: 'nid', documentTypeBn: 'জাতীয় পরিচয়পত্র (NID)', filename: '', uploadedAt: '', isRequired: false, isProvided: false },
          ],
          statusHistory: [historyEntry],
          isDemo: true,
        };

        // Run verification
        const verificationResult = runVerification(app);
        const appWithVerification = { ...app, verificationResult };

        set(state => ({
          currentApplication: appWithVerification,
          verificationResult,
          allApplications: [...state.allApplications, appWithVerification],
          currentStep: 6,
        }));

        return appWithVerification;
      },

      submitApplication: (id) => {
        const { allApplications } = get();
        const app = allApplications.find(a => a.id === id);
        if (!app) return;

        const historyEntry: StatusHistoryEntry = {
          id: `sh-${Date.now()}`,
          applicationId: id,
          fromStatus: 'draft',
          toStatus: 'submitted',
          changedAt: new Date().toISOString(),
          changedBy: app.applicantNameBn,
          changedByRole: 'citizen',
          notes: 'আবেদন জমা দেওয়া হয়েছে।',
        };

        const verificationEntry: StatusHistoryEntry = {
          id: `sh-${Date.now() + 1}`,
          applicationId: id,
          fromStatus: 'submitted',
          toStatus: 'under_verification',
          changedAt: new Date(Date.now() + 2000).toISOString(),
          changedBy: 'সিস্টেম (স্বয়ংক্রিয়)',
          changedByRole: 'admin',
          notes: 'স্বয়ংক্রিয় যাচাই প্রক্রিয়া শুরু হয়েছে।',
        };

        const updated = {
          ...app,
          status: 'under_verification' as MutationStatus,
          submittedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          statusHistory: [...app.statusHistory, historyEntry, verificationEntry],
        };

        set(state => ({
          currentApplication: updated,
          allApplications: state.allApplications.map(a => a.id === id ? updated : a),
          currentStep: 7,
        }));
      },

      updateApplicationStatus: (id, status, notes, actorName) => {
        const { allApplications, currentRole } = get();
        const app = allApplications.find(a => a.id === id);
        if (!app) return;

        const historyEntry: StatusHistoryEntry = {
          id: `sh-${Date.now()}`,
          applicationId: id,
          fromStatus: app.status,
          toStatus: status,
          changedAt: new Date().toISOString(),
          changedBy: actorName ?? (currentRole === 'officer' ? 'কর্মকর্তা (নমুনা)' : 'আবেদনকারী'),
          changedByRole: currentRole,
          notes,
        };

        const updated = {
          ...app,
          status,
          updatedAt: new Date().toISOString(),
          officerNotes: currentRole === 'officer' ? (notes ?? app.officerNotes) : app.officerNotes,
          officerDecisionReason: ['approved', 'rejected'].includes(status) ? notes : app.officerDecisionReason,
          statusHistory: [...app.statusHistory, historyEntry],
        };

        set(state => ({
          currentApplication: state.currentApplication?.id === id ? updated : state.currentApplication,
          allApplications: state.allApplications.map(a => a.id === id ? updated : a),
        }));
      },

      getApplication: (id) => get().allApplications.find(a => a.id === id),

      resetJourney: () => set({
        currentStep: 0,
        document: null,
        extraction: null,
        selectedParcel: null,
        verificationResult: null,
        currentApplication: null,
        currentScenario: 1,
      }),

      setRole: (role) => set({ currentRole: role }),
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => set((state) => ({ language: state.language === 'bn' ? 'en' : 'bn' })),

      login: (role, customUser) => {
        const base = role === 'officer' ? DEMO_OFFICER_PROFILE : DEMO_CITIZEN_PROFILE;
        const user: UserProfile = { ...base, ...customUser, role };
        set({
          isAuthenticated: true,
          currentRole: role,
          currentUser: user,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
          currentRole: 'citizen',
        });
      },
    }),
    {
      name: 'bhuprohori-store',
      partialize: (state) => ({
        allApplications: state.allApplications,
        currentRole: state.currentRole,
        language: state.language,
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        geminiApiKey: state.geminiApiKey,
        aiAuditResult: state.aiAuditResult,
      }),
    }
  )
);

export default useAppStore;
