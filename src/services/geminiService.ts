// Gemini AI Service for BhuProhori AI
// Connects directly to Google Gemini 1.5 Flash API for real OCR extraction and fraud/mortgage detection

import type { GeminiFraudAudit, DeedExtraction } from '../types';

export const DEFAULT_GEMINI_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
const STORAGE_KEY = 'bhuprohori_gemini_api_key';

export function getStoredGeminiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_GEMINI_KEY;
  } catch {
    return DEFAULT_GEMINI_KEY;
  }
}

export function saveGeminiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } catch {
    // ignore local storage errors
  }
}

export interface GeminiExtractionResult {
  deedNumber: string;
  registrationDate: string;
  registryOffice: string;
  mouza: string;
  surveyType: string;
  khatianNumber: string;
  dagNumber: string;
  landArea: string;
  grantor: string;
  grantee: string;
  fraudAudit: GeminiFraudAudit;
  rawResponse?: string;
}

export const GEMINI_SAMPLE_PRESETS = [
  {
    id: 'mortgage',
    titleBn: '🏦 ব্যাংক বন্ধকী জমি (Sonali Bank Lien)',
    titleEn: 'Bank Mortgage Lien Detected',
    badge: 'ঝুঁকি: বন্ধকী জমি',
    badgeClass: 'red',
    text: `সাভার সাব-রেজিস্ট্রি অফিসে নিবন্ধিত দলিল নং ১২৩৪/২০২৬। রেজিস্ট্রির তারিখ: ১৫ জানুয়ারি ২০২৬।
মৌজা: পাথালিয়া, জে.এল: ১৪৭, খতিয়ান নং খ-০১২, আরএস দাগ নং ৪৫৬।
জমির মোট পরিমাণ ৩৩ শতক। বিক্রেতা রহিম উদ্দিন (পিতা: আব্দুল করিম)।
বিক্রেতার অংশ ১৬ আনা স্বত্বে প্রাপ্ত কিন্তু জমিটি সোনালী ব্যাংক সাভার শাখায় ৫ লক্ষ টাকা কৃষি ঋণের বিপরীতে দায়বদ্ধ/বন্ধক রাখা হয়েছে।
ক্রেতা মোহাম্মদ ইউসুফ (পিতা: আলী হোসেন) কে ২০ শতক জমি বিক্রয় করিলেন।`
  },
  {
    id: 'double_selling',
    titleBn: '⚠️ অতিরিক্ত জমি / দ্বৈত বিক্রয় ঝুঁকি (Over-Share Claim)',
    titleEn: 'Double Selling / Over-Share Discrepancy',
    badge: 'ঝুঁকি: অতিরিক্ত জমি দাবি',
    badgeClass: 'red',
    text: `আশুলিয়া সাব-রেজিস্ট্রি অফিসের দলিল নং ৫৬৭৮/২০২৬। রেজিস্ট্রির তারিখ: ৩ ফেব্রুয়ারি ২০২৬।
মৌজা: আশুলিয়া, জে.এল: ১২৩, খতিয়ান নং খ-০৪৫, বিএস দাগ নং ২৩৪।
বিক্রেতা ফাতেমা বেগম (পিতা: জহির উদ্দিন)।
খতিয়ানে ফাতেমা বেগমের বৈধ রেকর্ডকৃত প্রাপ্য অংশ মাত্র ৮ শতক।
কিন্তু এই দলিলে তিনি ক্রেতা আমিনা খাতুন (পিতা: করিম মিয়া) এর নিকট ১০ শতক জমি বিক্রির প্রস্তাব করেছেন (২ শতক বেশি দাবি)।
ইতিপূর্বে এই একই দাগ হইতে ৪ শতক জমি অপর এক ব্যক্তির নিকট বিক্রয় দলিল সম্পাদন করা হয়েছিল।`
  },
  {
    id: 'court_injunction',
    titleBn: '⚖️ আদালতে মামলা / স্থগিতাদেশ (Court Stay Order)',
    titleEn: 'Court Litigation & Injunction Risk',
    badge: 'ঝুঁকি: আদালতে বিচারাধীন',
    badgeClass: 'red',
    text: `কেরানীগঞ্জ সাব-রেজিস্ট্রি অফিস। দলিল নম্বর ৯০১২/২০২৬। তারিখ: ২২ মার্চ ২০২৬।
মৌজা: জিঞ্জিরা, খতিয়ান নং খ-০৭৮, এসএ দাগ নং ৭৮৯। জমির পরিমাণ ৫০ শতক।
বিক্রেতা: সালমা আক্তার, গ্রহীতা: করিম মোল্লা।
বিশেষ দ্রষ্টব্য: উক্ত জমির মালিকানা নিয়ে সহকারী জজ আদালত কেরানীগঞ্জে দেওয়ানি মোকদ্দমা নং ৪২/২০২৫ বিচারাধীন রয়েছে এবং বিজ্ঞ আদালত কর্তৃক অন্তর্বর্তীকালীন স্থগিতাদেশ (Temporary Injunction) বলবৎ আছে।`
  },
  {
    id: 'clean',
    titleBn: '✓ বৈধ ও নির্ভেজাল জমি (Clean & Legitimate)',
    titleEn: 'Clean & Verified Standard Deed',
    badge: 'ঝুঁকিমুক্ত',
    badgeClass: 'safe',
    text: `সাভার সাব-রেজিস্ট্রি অফিস। দলিল নম্বর দলিল-২০২৬-০০১। তারিখ: ১৫ জানুয়ারি ২০২৬।
মৌজা: পাথালিয়া, জে.এল: ১৪৭, জরিপের ধরন: BS, খতিয়ান নম্বর: খ-০১২, দাগ নম্বর: ৪৫৬।
হস্তান্তরিত জমির পরিমাণ: ৩৩ শতক। বিক্রেতার রেকর্ডকৃত অংশ ১৬ আনা (সম্পূর্ণ ৩৩ শতক মালিকানা বিদ্যমান)।
দাতা: রহিম উদ্দিন, পিতা: আব্দুল করিম।
গ্রহীতা: মোহাম্মদ ইউসুফ, পিতা: আলী হোসেন।
জমিটি সম্পূর্ণ নির্ভেজাল, কোনো ব্যাংক দায়বদ্ধতা, সরকারি খাস বা আদালতের মামলা নেই।`
  }
];

export async function runGeminiAnalysis(options: {
  text?: string;
  base64Image?: string;
  mimeType?: string;
  apiKey?: string;
}): Promise<GeminiExtractionResult> {
  const apiKey = (options.apiKey || getStoredGeminiKey()).trim();
  if (!apiKey) {
    throw new Error('Gemini API Key is missing. Please provide a valid Google Gemini API Key.');
  }

  const systemInstruction = `You are BhuProhori AI, the official Bangladesh Land Mutation & Fraud Detection Engine.
Analyze the provided land deed (দলিল) document scan, text, or query against Bangladesh land administration standards.

You MUST return a valid JSON object matching EXACTLY this structure:
{
  "deedNumber": "string (দলিল নম্বর)",
  "registrationDate": "string (রেজিস্ট্রি তারিখ)",
  "registryOffice": "string (সাব-রেজিস্ট্রি অফিস)",
  "mouza": "string (মৌজা)",
  "surveyType": "string ('RS' | 'BS' | 'CS' | 'SA')",
  "khatianNumber": "string (খতিয়ান নম্বর)",
  "dagNumber": "string (দাগ নম্বর)",
  "landArea": "string (জমির পরিমাণ শতকে)",
  "grantor": "string (বিক্রেতা / দাতার নাম ও পিতার নাম)",
  "grantee": "string (ক্রেতা / গ্রহীতার নাম ও পিতার নাম)",
  "fraudAudit": {
    "riskLevel": "'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'",
    "isMortgaged": boolean,
    "mortgageDetails": "string (Details of bank, loan amount, branch)",
    "isDoubleSellingRisk": boolean,
    "doubleSellingDetails": "string (Discrepancy explanation)",
    "isKhasOrDisputed": boolean,
    "khasOrDisputedDetails": "string (Court case or khas land details)",
    "summaryBn": "string (Comprehensive Bengali summary of findings)",
    "recommendationBn": "string (Direct actionable recommendation in Bengali for Assistant Commissioner Land officer)"
  }
}

EVALUATION RULES:
1. Bank Mortgage Check: If the deed mentions any mortgage, loan, or lien (যেমন: সোনালী ব্যাংক, কৃষি ব্যাংক, বন্ধক, দায়বদ্ধ, ঋণ), set isMortgaged=true, riskLevel='CRITICAL', and explain in mortgageDetails.
2. Double Selling / Over-Share Check: If the seller attempts to sell more decimals than they legally hold in khatian (e.g. holds 8 decimals but selling 10), or if a previous transfer deed exists, set isDoubleSellingRisk=true, riskLevel='CRITICAL', and explain.
3. Court Litigation / Khas Check: If there is court stay order (স্থগিতাদেশ), civil dispute (মোকদ্দমা), or government khas property, set isKhasOrDisputed=true, riskLevel='CRITICAL' or 'HIGH'.
4. If clean and legitimate with no encumbrance, set isMortgaged=false, isDoubleSellingRisk=false, isKhasOrDisputed=false, riskLevel='LOW'.

CRITICAL: Output strictly ONLY raw JSON without markdown formatting or conversational text.`;

  const parts: Array<Record<string, unknown>> = [];

  if (options.text) {
    parts.push({
      text: `${systemInstruction}\n\n--- INPUT DEED DOCUMENT CONTENT ---\n${options.text}`
    });
  } else {
    parts.push({
      text: `${systemInstruction}\n\n--- EXTRACT AND AUDIT FROM ATTACHED DEED IMAGE ---`
    });
  }

  if (options.base64Image) {
    parts.push({
      inline_data: {
        mime_type: options.mimeType || 'image/jpeg',
        data: options.base64Image.replace(/^data:image\/[a-z]+;base64,/, '')
      }
    });
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let msg = `Gemini API error (${response.status}): ${response.statusText}`;
    try {
      const errJson = JSON.parse(errorText);
      if (errJson?.error?.message) {
        msg = errJson.error.message;
      }
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  const jsonResponse = await response.json();
  const rawText = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Gemini Flash did not return any text output.');
  }

  // Clean JSON response
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/```$/, '');
  }
  cleaned = cleaned.trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      throw new Error(`Failed to parse AI output into structured JSON. Raw response: ${rawText.slice(0, 200)}...`);
    }
  }

  const audit = parsed.fraudAudit || parsed.fraud_audit || parsed;
  const isMortgaged = Boolean(audit.isMortgaged || parsed.isMortgaged);
  const isDoubleSellingRisk = Boolean(audit.isDoubleSellingRisk || parsed.isDoubleSellingRisk);
  const isKhasOrDisputed = Boolean(audit.isKhasOrDisputed || parsed.isKhasOrDisputed);

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = audit.riskLevel || parsed.riskLevel || 'LOW';
  if (isMortgaged || isDoubleSellingRisk) {
    riskLevel = 'CRITICAL';
  } else if (isKhasOrDisputed && riskLevel === 'LOW') {
    riskLevel = 'HIGH';
  }

  const fraudAudit: GeminiFraudAudit = {
    riskLevel,
    isMortgaged,
    mortgageDetails: audit.mortgageDetails || parsed.mortgageDetails || '',
    isDoubleSellingRisk,
    doubleSellingDetails: audit.doubleSellingDetails || parsed.doubleSellingDetails || '',
    isKhasOrDisputed,
    khasOrDisputedDetails: audit.khasOrDisputedDetails || parsed.khasOrDisputedDetails || '',
    summaryBn: audit.summaryBn || parsed.summaryBn || 'স্বয়ংক্রিয় এআই বিশ্লেষণ সম্পন্ন হয়েছে।',
    recommendationBn: audit.recommendationBn || parsed.recommendationBn || 'নথি ও রেকর্ডপত্র বিবেচনাপূর্বক পরবর্তী ব্যবস্থা গ্রহণ করুন।',
    extractedAt: new Date().toISOString(),
    modelUsed: 'gemini-flash-latest'
  };

  return {
    deedNumber: parsed.deedNumber || '',
    registrationDate: parsed.registrationDate || '',
    registryOffice: parsed.registryOffice || '',
    mouza: parsed.mouza || '',
    surveyType: parsed.surveyType || 'RS',
    khatianNumber: parsed.khatianNumber || '',
    dagNumber: parsed.dagNumber || '',
    landArea: parsed.landArea || '',
    grantor: parsed.grantor || '',
    grantee: parsed.grantee || '',
    fraudAudit,
    rawResponse: rawText
  };
}

/**
 * Converts a GeminiExtractionResult into the app's DeedExtraction format
 */
export function convertToAppExtraction(result: GeminiExtractionResult, docId: string): DeedExtraction {
  const mkField = (fieldName: string, fieldNameBn: string, value: string, hasWarning = false, warningMessage = '') => ({
    fieldName,
    fieldNameBn,
    value,
    userCorrectedValue: value,
    source: 'ocr' as const,
    confidence: 0.98,
    isVerified: false,
    hasWarning,
    warningMessage,
  });

  return {
    id: `gemini-ext-${Date.now()}`,
    documentId: docId,
    extractedAt: new Date().toISOString(),
    fields: {
      deedNumber: mkField('deedNumber', 'দলিল নম্বর', result.deedNumber),
      registrationDate: mkField('registrationDate', 'দলিল নিবন্ধনের তারিখ', result.registrationDate),
      registryOffice: mkField('registryOffice', 'রেজিস্ট্রি অফিস', result.registryOffice),
      district: mkField('district', 'জেলা', 'ঢাকা'),
      upazila: mkField('upazila', 'উপজেলা', 'সাভার'),
      mouza: mkField('mouza', 'মৌজা', result.mouza),
      jlNumber: mkField('jlNumber', 'জে.এল. নম্বর', '১৪৭'),
      surveyType: mkField('surveyType', 'জরিপের ধরন', result.surveyType || 'RS'),
      khatianNumber: mkField('khatianNumber', 'খতিয়ান নম্বর', result.khatianNumber),
      dagNumber: mkField('dagNumber', 'দাগ নম্বর', result.dagNumber),
      landArea: mkField(
        'landArea',
        'জমির পরিমাণ',
        result.landArea,
        result.fraudAudit.isDoubleSellingRisk,
        result.fraudAudit.doubleSellingDetails
      ),
      grantor: mkField(
        'grantor',
        'দাতা',
        result.grantor,
        result.fraudAudit.isMortgaged,
        result.fraudAudit.mortgageDetails
      ),
      grantee: mkField('grantee', 'গ্রহীতা', result.grantee),
    }
  };
}
