import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck, ChevronLeft, ArrowRight, CheckCircle, Sparkles,
  AlertTriangle, ShieldAlert, ShieldCheck, Key, Zap,
  Landmark, HelpCircle, Loader2, Info
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { GEMINI_SAMPLE_PRESETS, getStoredGeminiKey } from '../services/geminiService';

export default function ReviewPage() {
  const navigate = useNavigate();
  const {
    extraction, updateExtractionField, setStep, loadDemoScenario, language,
    geminiApiKey, setGeminiApiKey, aiAuditResult, isAiLoading, aiError,
    runLiveGeminiExtraction
  } = useAppStore();

  const isBn = language === 'bn';

  // Local state for Gemini AI interaction
  const [selectedPresetId, setSelectedPresetId] = useState<string>('mortgage');
  const [deedInputText, setDeedInputText] = useState<string>(GEMINI_SAMPLE_PRESETS[0].text);
  const [isPromptExpanded, setIsPromptExpanded] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [tempApiKey, setTempApiKey] = useState<string>(geminiApiKey || getStoredGeminiKey());
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = GEMINI_SAMPLE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setDeedInputText(preset.text);
    }
  };

  const handleRunAi = async () => {
    try {
      setSuccessToast(null);
      await runLiveGeminiExtraction(deedInputText);
      setSuccessToast(
        isBn
          ? 'Gemini Flash AI দ্বারা দলিল সফলভাবে বিশ্লেষণ ও ফ্রড অডিট সম্পন্ন হয়েছে!'
          : 'Gemini Flash AI successfully extracted deed data and audited fraud/mortgage risks!'
      );
      setTimeout(() => setSuccessToast(null), 5000);
    } catch {
      // Error handled by store state
    }
  };

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      setGeminiApiKey(tempApiKey.trim());
      setShowKeyModal(false);
      setSuccessToast(isBn ? 'API কি সফলভাবে সংরক্ষিত হয়েছে!' : 'API Key successfully updated!');
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const handleProceed = () => {
    setStep(3);
    navigate('/identify');
  };

  const f = extraction?.fields;
  const getVal = (k: keyof NonNullable<typeof f>) => f?.[k]?.userCorrectedValue ?? f?.[k]?.value ?? '';

  return (
    <div>
      {/* Workspace Heading */}
      <div className="workspace-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="workspace-symbol">
            <FileCheck size={22} />
          </div>
          <div>
            <h1 className="title">
              {isBn ? 'দলিল তথ্য ও AI ফ্রড অডিট (Gemini Flash)' : 'Deed Data & AI Fraud Audit (Gemini Flash)'}
            </h1>
            <p className="desc" style={{ margin: 0 }}>
              {isBn
                ? 'গুগল জেমিনাই ফ্ল্যাশ এআই দিয়ে দলিলের স্বয়ংক্রিয় তথ্য সংগ্রহ, দ্বৈত বিক্রয় ও ব্যাংক বন্ধক পরীক্ষা।'
                : 'Automated entity extraction, double selling check, and bank mortgage detection via Google Gemini Flash AI.'}
            </p>
          </div>
        </div>
        <span className="workspace-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} color="var(--green)" />
          {isBn ? 'রিয়েল-টাইম এআই ভেরিফিকেশন' : 'Real-time AI Verification'}
        </span>
      </div>

      {/* Stepper */}
      <div className="steps">
        <span className="step">
          <span className="num">✓</span> {isBn ? 'দলিল' : 'Deed'}
        </span>
        <span className="sep"></span>
        <span className="step current">
          <span className="num">2</span> {isBn ? 'তথ্য ও ফ্রড যাচাই' : 'Verify & Audit'}
        </span>
        <span className="sep"></span>
        <span className="step">
          <span className="num">3</span> {isBn ? 'আবেদন' : 'Application'}
        </span>
      </div>

      {/* ── LIVE GEMINI FLASH AI INTERACTIVE CONSOLE ── */}
      <div
        className="card pad"
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #ffffff 0%, #f3faf6 100%)',
          border: '1.5px solid #a3dcbe',
          boxShadow: '0 8px 30px rgba(23, 107, 86, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Top Accent Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #176b56, #2bb68a, #ffb300, #176b56)'
          }}
        />

        {/* Console Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#176b56',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(23, 107, 86, 0.25)'
              }}
            >
              <Sparkles size={18} />
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ margin: 0, fontSize: 18, color: 'var(--deep)', fontWeight: 700 }}>
                  {isBn ? 'Gemini 1.5 Flash লাইভ AI ইঞ্জিন' : 'Gemini 1.5 Flash Live AI Engine'}
                </h2>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: '#def7ec',
                    color: '#03543f',
                    border: '1px solid #bcdecb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0e9f6e' }} />
                  {isBn ? 'সরাসরি এপিআই সংযুক্ত' : 'Live API Active'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>
                {isBn
                  ? 'মডেল: gemini-flash-latest • বাংলা দলিল থেকে তথ্য ও ঝুঁকি বিশ্লেষণ'
                  : 'Model: gemini-flash-latest • Native Bengali deed extraction and risk analysis'}
              </p>
            </div>
          </div>

          {/* Key Management Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="btn secondary sm"
              onClick={() => setShowKeyModal(!showKeyModal)}
              style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Key size={13} />
              <span>{isBn ? 'API Key কনফিগ' : 'API Key Config'}</span>
              <span style={{ fontFamily: 'monospace', opacity: 0.7 }}>
                ({(geminiApiKey || getStoredGeminiKey()).slice(0, 5)}...{(geminiApiKey || getStoredGeminiKey()).slice(-5)})
              </span>
            </button>
          </div>
        </div>

        {/* API Key Modal / Collapsible Input */}
        {showKeyModal && (
          <div
            style={{
              padding: 14,
              background: '#ffffff',
              borderRadius: 10,
              border: '1px solid var(--line)',
              marginBottom: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong style={{ fontSize: 13, color: 'var(--deep)' }}>
                {isBn ? 'Google Gemini API Key পরিবর্তন বা পরীক্ষা' : 'Custom Google Gemini API Key'}
              </strong>
              <small style={{ color: 'var(--muted)' }}>
                {isBn ? 'ব্রাউজারে এনক্রিপ্টেড থাকে' : 'Stored locally in browser'}
              </small>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                type="text"
                value={tempApiKey}
                onChange={e => setTempApiKey(e.target.value)}
                placeholder="AQ.Ab8RN6LlRZM5gQ9tT9MRVorGRk..."
                style={{ flex: 1, minWidth: 260, padding: '7px 12px', fontSize: 13 }}
              />
              <button className="btn sm" onClick={handleSaveApiKey}>
                {isBn ? 'সংরক্ষণ করুন' : 'Save Key'}
              </button>
              <button
                className="btn secondary sm"
                onClick={() => {
                  setTempApiKey(getStoredGeminiKey());
                }}
              >
                {isBn ? 'ডিফল্ট কী বসান' : 'Reset Default'}
              </button>
            </div>
          </div>
        )}

        {/* Preset Selector Chips */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--deep)', marginBottom: 8 }}>
            {isBn ? '১ ক্লিকে এআই পরীক্ষার নমুনা পরিস্থিতি বাছাই করুন:' : 'Select an instant AI test scenario:'}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {GEMINI_SAMPLE_PRESETS.map(preset => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 20,
                    border: isSelected ? '1.5px solid var(--green)' : '1px solid var(--line)',
                    background: isSelected ? '#e6f5ef' : '#ffffff',
                    color: isSelected ? 'var(--green-dark)' : 'var(--ink)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(23,107,86,0.15)' : 'none'
                  }}
                >
                  <span>{isBn ? preset.titleBn : preset.titleEn}</span>
                  {isSelected && <span style={{ fontSize: 10, opacity: 0.8 }}>●</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt / Deed Input Text Box */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6
            }}
          >
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--deep)' }}>
              {isBn ? 'বিশ্লেষণের জন্য দলিলের বিবরণ / টেক্সট:' : 'Deed Text to be processed by Gemini Flash:'}
            </label>
            <button
              className="btn secondary sm"
              style={{ padding: '2px 8px', fontSize: 11 }}
              onClick={() => setIsPromptExpanded(!isPromptExpanded)}
            >
              {isPromptExpanded
                ? (isBn ? 'ছোট করুন ▲' : 'Collapse ▲')
                : (isBn ? 'সম্পাদনা বা বড় করুন ▼' : 'Edit / Expand ▼')}
            </button>
          </div>
          <textarea
            value={deedInputText}
            onChange={e => setDeedInputText(e.target.value)}
            rows={isPromptExpanded ? 6 : 3}
            style={{
              width: '100%',
              padding: 10,
              fontSize: 13,
              borderRadius: 8,
              border: '1px solid var(--line)',
              background: '#ffffff',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              resize: 'vertical'
            }}
            placeholder={
              isBn
                ? 'দলিল থেকে পাওয়া টেক্সট এখানে লিখুন বা পেস্ট করুন...'
                : 'Paste deed text or OCR transcript here...'
            }
          />
        </div>

        {/* Action Button & Loader */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            className="btn"
            disabled={isAiLoading || !deedInputText.trim()}
            onClick={handleRunAi}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #176b56 0%, #10553f 100%)',
              boxShadow: '0 4px 14px rgba(23,107,86,0.35)'
            }}
          >
            {isAiLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{isBn ? 'Gemini AI বিশ্লেষণ করছে...' : 'Gemini AI Analyzing...'}</span>
              </>
            ) : (
              <>
                <Zap size={16} />
                <span>
                  {isBn
                    ? '⚡ রান করুন: Gemini AI রিয়েল এক্সট্রাকশন ও ফ্রড চেক'
                    : '⚡ Run Gemini Live AI Extraction & Fraud Audit'}
                </span>
              </>
            )}
          </button>

          <span style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Info size={14} />
            {isBn
              ? 'বাস্তব গুগল জেমিনাই ফ্ল্যাশ এপিআই দিয়ে ব্যাংক বন্ধক, দ্বৈত বিক্রয় ও জমির তথ্য তাৎক্ষণিক চিহ্নিত হয়।'
              : 'Live Google Gemini Flash analyzes bank mortgages, double selling risks, and legal encumbrances.'}
          </span>
        </div>

        {/* Error Notification */}
        {aiError && (
          <div
            style={{
              marginTop: 14,
              padding: '10px 14px',
              borderRadius: 8,
              background: '#fff0f0',
              border: '1px solid #f8b4b4',
              color: '#b13f43',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <AlertTriangle size={16} />
            <div>
              <strong>{isBn ? 'Gemini API ত্রুটি:' : 'Gemini API Error:'}</strong> {aiError}
            </div>
          </div>
        )}

        {/* Success Toast */}
        {successToast && (
          <div
            style={{
              marginTop: 14,
              padding: '10px 14px',
              borderRadius: 8,
              background: '#edfdf5',
              border: '1px solid #99e6bc',
              color: '#0e7040',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <CheckCircle size={16} />
            <div>{successToast}</div>
          </div>
        )}

        {/* ── LIVE AI AUDIT FINDINGS CARD ── */}
        {aiAuditResult && (
          <div
            style={{
              marginTop: 18,
              padding: 16,
              borderRadius: 12,
              background:
                aiAuditResult.riskLevel === 'CRITICAL'
                  ? 'linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)'
                  : aiAuditResult.riskLevel === 'HIGH'
                  ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
                  : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              border:
                aiAuditResult.riskLevel === 'CRITICAL'
                  ? '1.5px solid #f87171'
                  : aiAuditResult.riskLevel === 'HIGH'
                  ? '1.5px solid #fbbf24'
                  : '1.5px solid #86efac',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}
          >
            {/* Finding Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 10
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {aiAuditResult.riskLevel === 'CRITICAL' || aiAuditResult.riskLevel === 'HIGH' ? (
                  <ShieldAlert size={20} color="#dc2626" />
                ) : (
                  <ShieldCheck size={20} color="#16a34a" />
                )}
                <strong
                  style={{
                    fontSize: 15,
                    color:
                      aiAuditResult.riskLevel === 'CRITICAL'
                        ? '#991b1b'
                        : aiAuditResult.riskLevel === 'HIGH'
                        ? '#92400e'
                        : '#166534'
                  }}
                >
                  {isBn
                    ? `AI ফ্রড ও ঝুঁকি মূল্যায়ন: ${
                        aiAuditResult.riskLevel === 'CRITICAL'
                          ? '🚨 চরম ঝুঁকি শনাক্ত (Critical Alert)'
                          : aiAuditResult.riskLevel === 'HIGH'
                          ? '⚠️ উচ্চ ঝুঁকি (High Risk)'
                          : '✓ নির্ভেজাল ও ঝুঁকিমুক্ত (Clean)'
                      }`
                    : `AI Fraud & Risk Assessment: ${aiAuditResult.riskLevel}`}
                </strong>
              </div>

              <span
                style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 14,
                  fontWeight: 700,
                  background:
                    aiAuditResult.riskLevel === 'CRITICAL'
                      ? '#ef4444'
                      : aiAuditResult.riskLevel === 'HIGH'
                      ? '#f59e0b'
                      : '#10b981',
                  color: '#ffffff'
                }}
              >
                LEVEL: {aiAuditResult.riskLevel}
              </span>
            </div>

            {/* Finding Flags */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 10,
                marginBottom: 12
              }}
            >
              {/* Mortgage Check */}
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(0,0,0,0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
                  <Landmark size={14} color={aiAuditResult.isMortgaged ? '#dc2626' : '#16a34a'} />
                  <span>{isBn ? 'ব্যাংক বন্ধক / দায়বদ্ধতা:' : 'Bank Mortgage Status:'}</span>
                  <span style={{ color: aiAuditResult.isMortgaged ? '#dc2626' : '#16a34a' }}>
                    {aiAuditResult.isMortgaged
                      ? (isBn ? '🚨 বন্ধক পাওয়া গেছে' : 'Mortgage Found')
                      : (isBn ? '✓ কোনো বন্ধক নেই' : 'No Lien')}
                  </span>
                </div>
                {aiAuditResult.mortgageDetails && (
                  <div style={{ fontSize: 11, color: '#991b1b', marginTop: 4 }}>
                    {aiAuditResult.mortgageDetails}
                  </div>
                )}
              </div>

              {/* Double Selling Check */}
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(0,0,0,0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
                  <AlertTriangle size={14} color={aiAuditResult.isDoubleSellingRisk ? '#dc2626' : '#16a34a'} />
                  <span>{isBn ? 'দ্বৈত বিক্রয় / অংশ অসামঞ্জস্য:' : 'Double Selling / Over-Share:'}</span>
                  <span style={{ color: aiAuditResult.isDoubleSellingRisk ? '#dc2626' : '#16a34a' }}>
                    {aiAuditResult.isDoubleSellingRisk
                      ? (isBn ? '⚠️ অসঙ্গতি শনাক্ত' : 'Discrepancy Detected')
                      : (isBn ? '✓ সঠিক অংশ' : 'Valid Share')}
                  </span>
                </div>
                {aiAuditResult.doubleSellingDetails && (
                  <div style={{ fontSize: 11, color: '#991b1b', marginTop: 4 }}>
                    {aiAuditResult.doubleSellingDetails}
                  </div>
                )}
              </div>

              {/* Court / Khas Check */}
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(0,0,0,0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
                  <HelpCircle size={14} color={aiAuditResult.isKhasOrDisputed ? '#dc2626' : '#16a34a'} />
                  <span>{isBn ? 'আদালতের মামলা / খাস জমি:' : 'Court Injunction / Khas:'}</span>
                  <span style={{ color: aiAuditResult.isKhasOrDisputed ? '#dc2626' : '#16a34a' }}>
                    {aiAuditResult.isKhasOrDisputed
                      ? (isBn ? '⚖️ মামলা / স্থগিতাদেশ' : 'Litigation / Stay Order')
                      : (isBn ? '✓ মুক্ত' : 'Clean')}
                  </span>
                </div>
                {aiAuditResult.khasOrDisputedDetails && (
                  <div style={{ fontSize: 11, color: '#92400e', marginTop: 4 }}>
                    {aiAuditResult.khasOrDisputedDetails}
                  </div>
                )}
              </div>
            </div>

            {/* Summary & Recommendation */}
            <div style={{ fontSize: 13, lineHeight: 1.6, color: '#1f2937', marginBottom: 8 }}>
              <strong>{isBn ? 'এআই অডিট বিশ্লেষণ:' : 'AI Audit Summary:'}</strong> {aiAuditResult.summaryBn}
            </div>

            <div
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.85)',
                borderLeft: '4px solid #176b56',
                fontSize: 12,
                color: '#111827'
              }}
            >
              <strong>{isBn ? 'এসি ল্যান্ড (ভূমি) কর্মকর্তার করণীয়:' : 'Action for AC Land Officer:'}</strong>{' '}
              {aiAuditResult.recommendationBn}
            </div>
          </div>
        )}
      </div>

      {/* ── MAIN REVIEW SPLIT VIEW ── */}
      {!extraction ? (
        <div className="card pad" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--deep)' }}>
            {isBn ? 'দলিলের তথ্য লোড করা হয়নি' : 'No Deed Loaded Yet'}
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
            {isBn
              ? 'উপরের "Gemini AI রিয়েল এক্সট্রাকশন ও ফ্রড চেক" বাটনে ক্লিক করুন অথবা একটি প্রাক-নির্ধারিত ডেমো দলিল লোড করুন।'
              : 'Click the "Run Gemini Live AI Extraction" button above or load a pre-configured demo deed.'}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn" onClick={handleRunAi} disabled={isAiLoading}>
              <Zap size={14} /> {isBn ? '⚡ Gemini AI দিয়ে শুরু করুন' : '⚡ Start with Gemini AI'}
            </button>
            <button className="btn secondary" onClick={() => loadDemoScenario(1)}>
              {isBn ? 'নমুনা দলিল লোড করুন' : 'Load Demo Deed'}
            </button>
          </div>
        </div>
      ) : (
        <div className="split">
          {/* Left: Simulated Deed Paper */}
          <div className="card pad">
            <div className="panel-head">
              <h2>{isBn ? 'মূল দলিল পর্যালোচনা' : 'Deed Document Review'}</h2>
              <span className="pill" style={{ background: '#e9f6ef', color: '#10553f' }}>
                {aiAuditResult ? '⚡ GEMINI FLASH AI' : 'DEMO READY'}
              </span>
            </div>

            <div className="document-toolbar">
              <span>{getVal('deedNumber') || 'দলিল-২০২৬-০০১'}</span>
              <span>{isBn ? 'যাচাইকৃত খসড়া · ১ পৃষ্ঠা' : 'Verified · 1 Page'}</span>
            </div>

            <div className="doc-preview">
              <div className="paper">
                <div className="document-ribbon" style={{ background: '#176b56' }}>
                  {aiAuditResult ? 'GEMINI AI PARSED' : 'DEMO SAMPLE'}
                </div>
                <span className="seal">{getVal('surveyType') || 'RS'}</span>
                <h4>{isBn ? 'জমি হস্তান্তর সাফ-কবলা দলিল' : 'Land Conveyance Deed'}</h4>
                <small>{isBn ? 'বাংলাদেশ ভূমি রেজিস্ট্রেশন' : 'Bangladesh Land Registration'}</small>

                <div className="faux-text">
                  {isBn ? 'দলিল নম্বর' : 'Deed No'}: <b>{getVal('deedNumber')}</b><br />
                  {isBn ? 'রেজিস্ট্রি তারিখ' : 'Reg Date'}: <b>{getVal('registrationDate')}</b><br />
                  {isBn ? 'রেজিস্ট্রি অফিস' : 'Sub-Registry'}: <b>{getVal('registryOffice')}</b><br />
                  {isBn ? 'মৌজা' : 'Mouza'}: <b>{getVal('mouza')}</b><br />
                  {isBn ? 'জরিপ' : 'Survey'}: <b>{getVal('surveyType')}</b><br />
                  {isBn ? 'খতিয়ান' : 'Khatian'}: <b>{getVal('khatianNumber')}</b><br />
                  {isBn ? 'দাগ নম্বর' : 'Dag / Plot'}: <b>{getVal('dagNumber')}</b><br />
                  {isBn ? 'জমির পরিমাণ' : 'Land Area'}: <b>{getVal('landArea')}</b><br />
                  {isBn ? 'দাতা / বিক্রেতা' : 'Grantor / Seller'}: <b>{getVal('grantor')}</b><br />
                  {isBn ? 'গ্রহীতা / ক্রেতা' : 'Grantee / Buyer'}: <b>{getVal('grantee')}</b>
                  <div className="line"></div>
                  <div className="line mid"></div>
                  <div className="line small"></div>
                </div>

                {/* Encumbrance Note inside Deed Paper */}
                {aiAuditResult?.isMortgaged && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: '8px 10px',
                      background: '#fff0f0',
                      border: '1px dashed #dc2626',
                      borderRadius: 6,
                      fontSize: 11,
                      color: '#991b1b'
                    }}
                  >
                    ⚠️ <b>{isBn ? 'এআই সতর্কতা:' : 'AI Notice:'}</b> {aiAuditResult.mortgageDetails}
                  </div>
                )}

                <small style={{ display: 'block', marginTop: 14 }}>
                  {isBn
                    ? 'গুগল জেমিনাই ফ্ল্যাশ এআই মডেল দ্বারা সরাসরি এক্সট্রাক্টকৃত'
                    : 'Extracted live via Google Gemini Flash Multimodal AI'}
                </small>
              </div>
            </div>
          </div>

          {/* Right: Editable Extraction Fields */}
          <div className="card pad">
            <div className="panel-head">
              <div>
                <h2>{isBn ? 'সম্পাদনাযোগ্য দলিলের তথ্য' : 'Editable Deed Fields'}</h2>
                <p>
                  {aiAuditResult
                    ? (isBn ? 'Gemini 1.5 Flash দ্বারা পূরণকৃত • ভুল থাকলে সম্পাদনা করুন' : 'Extracted by Gemini Flash • Editable if needed')
                    : (isBn ? 'নমুনা এআই এক্সট্রাকশন • সম্পাদনাযোগ্য' : 'Simulated AI Extraction')}
                </p>
              </div>
              <span className="pill">{isBn ? 'সংশোধনযোগ্য' : 'Editable'}</span>
            </div>

            <div className="fieldgrid">
              <div className="field">
                <label htmlFor="fDeed">
                  {isBn ? 'দলিল নম্বর' : 'Deed Number'}{' '}
                  <span className="confidence" style={{ background: '#def7ec', color: '#03543f' }}>
                    AI 98%
                  </span>
                </label>
                <input
                  id="fDeed"
                  value={getVal('deedNumber')}
                  onChange={e => updateExtractionField('deedNumber', e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="fSurvey">{isBn ? 'জরিপের ধরন' : 'Survey Type'}</label>
                <select
                  id="fSurvey"
                  value={getVal('surveyType')}
                  onChange={e => updateExtractionField('surveyType', e.target.value)}
                >
                  <option value="RS">RS</option>
                  <option value="CS">CS</option>
                  <option value="SA">SA</option>
                  <option value="BS">BS</option>
                  <option value="আরএস">আরএস (RS)</option>
                  <option value="বিএস">বিএস (BS)</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="fMouza">{isBn ? 'মৌজা' : 'Mouza'}</label>
                <input
                  id="fMouza"
                  value={getVal('mouza')}
                  onChange={e => updateExtractionField('mouza', e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="fKhatian">{isBn ? 'খতিয়ান নম্বর' : 'Khatian Number'}</label>
                <input
                  id="fKhatian"
                  value={getVal('khatianNumber')}
                  onChange={e => updateExtractionField('khatianNumber', e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="fDag">{isBn ? 'দাগ নম্বর' : 'Plot / Dag Number'}</label>
                <input
                  id="fDag"
                  value={getVal('dagNumber')}
                  onChange={e => updateExtractionField('dagNumber', e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="fArea">
                  {isBn ? 'বিক্রিত জমির পরিমাণ (শতাংশ)' : 'Transferred Area (Decimals)'}
                  {aiAuditResult?.isDoubleSellingRisk && (
                    <span style={{ color: '#dc2626', marginLeft: 6, fontSize: 11 }}>⚠ অতিরিক্ত অংশ</span>
                  )}
                </label>
                <input
                  id="fArea"
                  type="text"
                  value={getVal('landArea')}
                  onChange={e => updateExtractionField('landArea', e.target.value)}
                  style={{
                    borderColor: aiAuditResult?.isDoubleSellingRisk ? '#f87171' : undefined
                  }}
                />
              </div>

              <div className="field">
                <label htmlFor="fSeller">
                  {isBn ? 'বিক্রেতা / দাতা' : 'Seller / Grantor'}
                  {aiAuditResult?.isMortgaged && (
                    <span style={{ color: '#dc2626', marginLeft: 6, fontSize: 11 }}>🏦 ব্যাংক দায়বদ্ধ</span>
                  )}
                </label>
                <input
                  id="fSeller"
                  value={getVal('grantor')}
                  onChange={e => updateExtractionField('grantor', e.target.value)}
                  style={{
                    borderColor: aiAuditResult?.isMortgaged ? '#f87171' : undefined
                  }}
                />
              </div>

              <div className="field">
                <label htmlFor="fBuyer">{isBn ? 'ক্রেতা / গ্রহীতা' : 'Buyer / Grantee'}</label>
                <input
                  id="fBuyer"
                  value={getVal('grantee')}
                  onChange={e => updateExtractionField('grantee', e.target.value)}
                />
              </div>
            </div>

            <div className="hintbox">
              <CheckCircle size={16} />
              <div>
                {isBn
                  ? 'গুগল জেমিনাই ফ্ল্যাশ এআই মডেল বাংলা দলিল থেকে দাগ, খতিয়ান, ক্রেতা-বিক্রেতা ও বন্ধকের তথ্য স্বয়ংক্রিয়ভাবে শনাক্ত করেছে।'
                  : 'Google Gemini Flash automatically extracted land identifiers, parties, and encumbrance flags from the deed.'}
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={handleProceed}>
                {isBn ? 'তথ্য নিশ্চিত করুন → নকশায় জমি দেখুন' : 'Confirm Data → View Land Map'} <ArrowRight size={14} />
              </button>
              <button className="btn secondary" onClick={() => navigate('/upload')}>
                <ChevronLeft size={14} /> {isBn ? 'পেছনে যান' : 'Back'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
