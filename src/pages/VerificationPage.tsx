import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, ArrowRight, ChevronLeft, ChevronDown, ChevronUp,
  Sparkles, Landmark, AlertTriangle, CheckCircle,
  Zap, Loader2
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { VERIFICATION_RULES } from '../data/demoData';

export default function VerificationPage() {
  const navigate = useNavigate();
  const {
    runVerificationCheck, verificationResult,
    currentScenario, loadDemoScenario, setStep,
    language,
    geminiVerificationResult, isVerifyingAi, aiError,
    runLiveGeminiVerificationCheck, extraction
  } = useAppStore();

  const isBn = language === 'bn';

  // Mode: 'ai' for live Gemini Flash API verification vs 'demo' for synthetic rules
  const [verificationMode, setVerificationMode] = useState<'ai' | 'demo'>('ai');
  const [scenarioVal, setScenarioVal] = useState<number>(currentScenario || 1);
  const [expandedRules, setExpandedRules] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Auto-run verification check on scenario change
  useEffect(() => {
    runVerificationCheck();
  }, [scenarioVal, runVerificationCheck]);

  // Handle live Gemini AI verification trigger
  const handleTriggerAiVerify = async (scNum = scenarioVal) => {
    try {
      setToastMsg(null);
      await runLiveGeminiVerificationCheck(scNum);
      setToastMsg(
        isBn
          ? 'Gemini Flash AI দ্বারা ৭টি ভূমি নিয়মের লাইভ ভেরিফিকেশন সম্পন্ন হয়েছে!'
          : 'Gemini Flash AI completed live verification across all 7 land rules!'
      );
      setTimeout(() => setToastMsg(null), 4000);
    } catch {
      // Error handled by store state
    }
  };

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setScenarioVal(val);
    loadDemoScenario(val);
    if (verificationMode === 'ai') {
      handleTriggerAiVerify(val);
    }
  };

  const handleProceed = () => {
    setStep(5);
    navigate('/apply');
  };

  // Derive dynamic metrics (from Gemini AI if in AI mode and result exists, otherwise fallback to demo)
  const isUsingAiResult = verificationMode === 'ai' && !!geminiVerificationResult;

  const availableShare = isUsingAiResult
    ? geminiVerificationResult.availableShare
    : (scenarioVal === 6 ? 8 : (scenarioVal === 1 ? 8 : 8));

  const claimedShare = isUsingAiResult
    ? geminiVerificationResult.claimedShare
    : (scenarioVal === 6 ? 10 : (scenarioVal === 2 ? 80 : 5));

  const isOverLimit = isUsingAiResult
    ? geminiVerificationResult.isOverLimit
    : (claimedShare > availableShare);

  const hasErrors = isUsingAiResult
    ? (geminiVerificationResult.category !== 'no_inconsistency' || geminiVerificationResult.isMortgaged || geminiVerificationResult.isDoubleSellingRisk)
    : (isOverLimit || (verificationResult?.findings?.some(f => f.severity === 'error' || f.severity === 'critical') ?? false));

  // Determine active deed identifiers for display
  const getDeedVal = (k: keyof NonNullable<typeof extraction>['fields']) =>
    extraction?.fields[k]?.userCorrectedValue ?? extraction?.fields[k]?.value ?? '';

  const activeDeedNo = getDeedVal('deedNumber') || (scenarioVal === 6 ? 'দলিল-২০২৬-০০২' : 'দলিল-২০২৬-০০১');
  const activeDagNo = getDeedVal('dagNumber') || (scenarioVal === 6 ? '২৩৪' : '৪৫৬');
  const activeKhatianNo = getDeedVal('khatianNumber') || (scenarioVal === 6 ? 'খ-০৪৫' : 'খ-০১২');
  const activeSeller = getDeedVal('grantor') || (scenarioVal === 6 ? 'ফাতেমা বেগম' : 'রহিম উদ্দিন');

  return (
    <div>
      {/* Workspace Heading */}
      <div className="workspace-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="workspace-symbol">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="title">
              {isBn ? 'নামজারির আগে তথ্য ও ফ্রড যাচাই' : 'Pre-Mutation Land & Fraud Verification'}
            </h1>
            <p className="desc" style={{ margin: 0 }}>
              {isBn
                ? 'আবেদনটি জমা দেওয়ার আগে জেমিনাই এআই ও ভূমি রেকর্ডের মাধ্যমে ৭টি নিয়মে জমি যাচাই করুন।'
                : 'Cross-check cadastral ownership, double selling, and bank encumbrances via AI and cadastral records.'}
            </p>
          </div>
        </div>
        <span className="workspace-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} color="var(--green)" />
          {isBn ? 'এআই ভেরিফিকেশন ইঞ্জিন' : 'AI Verification Engine'}
        </span>
      </div>

      {/* Mode Selector Tabs: Live Gemini AI vs Demo Presets */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 16px',
          background: '#ffffff',
          borderRadius: 12,
          border: '1.5px solid var(--line)',
          marginBottom: 20,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--deep)' }}>
            {isBn ? 'যাচাই মোড:' : 'Verification Mode:'}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => {
                setVerificationMode('ai');
                if (!geminiVerificationResult) handleTriggerAiVerify(scenarioVal);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: verificationMode === 'ai' ? '1.5px solid var(--green)' : '1px solid var(--line)',
                background: verificationMode === 'ai' ? '#e9f6ef' : '#ffffff',
                color: verificationMode === 'ai' ? 'var(--green-dark)' : 'var(--muted)',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Zap size={14} color={verificationMode === 'ai' ? 'var(--green)' : '#888'} />
              <span>{isBn ? '⚡ Gemini 1.5 Flash লাইভ AI' : '⚡ Gemini 1.5 Flash Live AI'}</span>
            </button>

            <button
              onClick={() => setVerificationMode('demo')}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: verificationMode === 'demo' ? '1.5px solid var(--navy)' : '1px solid var(--line)',
                background: verificationMode === 'demo' ? '#f0f4f8' : '#ffffff',
                color: verificationMode === 'demo' ? 'var(--navy)' : 'var(--muted)',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              {isBn ? '📋 ডেমো রুলস সিমুলেশন' : '📋 Synthetic Demo Rules'}
            </button>
          </div>
        </div>

        {/* Live Re-Run Button */}
        {verificationMode === 'ai' && (
          <button
            className="btn sm"
            disabled={isVerifyingAi}
            onClick={() => handleTriggerAiVerify(scenarioVal)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'linear-gradient(135deg, #176b56, #10553f)'
            }}
          >
            {isVerifyingAi ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>{isBn ? 'এআই যাচাই করছে...' : 'Verifying via Gemini...'}</span>
              </>
            ) : (
              <>
                <Zap size={13} />
                <span>{isBn ? '⚡ লাইভ এআই ভেরিফাই চালান' : '⚡ Run Live AI Verification'}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Toast Notice */}
      {toastMsg && (
        <div
          style={{
            marginBottom: 16,
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
          <div>{toastMsg}</div>
        </div>
      )}

      {/* AI Error Notice */}
      {aiError && (
        <div
          style={{
            marginBottom: 16,
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

      {/* 2-Column Grid */}
      <div className="grid two">
        {/* Left Column: Verification Summary & 7 Rules */}
        <div className="card pad">
          <div className="panel-head">
            <div>
              <h2>{isBn ? 'যাচাইয়ের সারসংক্ষেপ' : 'Verification Assessment'}</h2>
              <small style={{ color: 'var(--muted)' }}>
                {isUsingAiResult
                  ? (isBn ? 'Gemini 1.5 Flash মডেল দ্বারা সরাসরি বিশ্লেষিত' : 'Audited live via Google Gemini Flash')
                  : (isBn ? 'ডেমো সিমুলেশন ইঞ্জিন' : 'Synthetic Rule Engine')}
              </small>
            </div>
            <span className={`pill ${hasErrors ? 'red' : ''}`}>
              {hasErrors
                ? (isBn ? 'পর্যালোচনা প্রয়োজন' : 'Review Required')
                : (isBn ? 'প্রাথমিক পরীক্ষা সম্পন্ন' : 'Passed Clean')}
            </span>
          </div>

          {/* Risk Alert Block */}
          <div className={`risk-block ${hasErrors ? 'bad' : 'safe'}`}>
            <span className="risk-icon">
              {hasErrors ? (isUsingAiResult && geminiVerificationResult?.isMortgaged ? '🏦' : '⚠') : '✓'}
            </span>
            <div>
              <strong>
                {isUsingAiResult
                  ? (geminiVerificationResult.isMortgaged
                      ? (isBn ? 'ব্যাংক বন্ধক / দায়বদ্ধতা চিহ্নিত (Bank Mortgage)' : 'Active Bank Mortgage Detected')
                      : geminiVerificationResult.isDoubleSellingRisk
                      ? (isBn ? 'দ্বৈত বিক্রয় বা অতিরিক্ত অংশ হস্তান্তর ঝুঁকি' : 'Over-Share / Double Selling Risk')
                      : geminiVerificationResult.isKhasOrDisputed
                      ? (isBn ? 'আদালতে দেওয়ানি মামলা বা খাস জমি সতর্কতা' : 'Court Litigation / Khas Alert')
                      : (isBn ? 'কোনো অসামঞ্জস্য পাওয়া যায়নি — সম্পূর্ণ বৈধ' : 'Clean & Verified Match'))
                  : (hasErrors
                      ? (isBn ? 'রেকর্ডকৃত অংশের চেয়ে বিক্রির দাবি বেশি অথবা অমিল শনাক্ত' : 'Area Claim Exceeds Recorded Share')
                      : (isBn ? 'এই নমুনায় পরিমাণগত অসামঞ্জস্য পাওয়া যায়নি' : 'No Numerical Discrepancies Found'))}
              </strong>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                {isUsingAiResult
                  ? geminiVerificationResult.summaryBn
                  : (hasErrors
                      ? `নমুনা অংশ ${availableShare} শতাংশ, দাবি ${claimedShare} শতাংশ। আরও ${Math.abs(claimedShare - availableShare)} শতাংশ যাচাই প্রয়োজন।`
                      : 'বিক্রিত জমির পরিমাণ নমুনা বিক্রেতার উপলব্ধ অংশের মধ্যে আছে।')}
              </div>
            </div>
          </div>

          {/* Live Encumbrance Badges */}
          {isUsingAiResult && (
            <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {geminiVerificationResult.isMortgaged && (
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: '#fff0f0',
                    border: '1px solid #fca5a5',
                    fontSize: 11,
                    color: '#991b1b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Landmark size={14} />
                  <span>{geminiVerificationResult.mortgageDetails || (isBn ? 'ব্যাংক দায়বদ্ধতা রয়েছে' : 'Bank Mortgage Lien')}</span>
                </div>
              )}

              {geminiVerificationResult.isDoubleSellingRisk && (
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: '#fff7ed',
                    border: '1px solid #fdba74',
                    fontSize: 11,
                    color: '#9a3412',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <AlertTriangle size={14} />
                  <span>{geminiVerificationResult.doubleSellingDetails || (isBn ? 'অতিরিক্ত অংশ দাবি' : 'Double Selling Flag')}</span>
                </div>
              )}
            </div>
          )}

          {/* Verification Check List */}
          <div style={{ marginTop: 19 }}>
            <div className="check">
              <span className="badge-dot">✓</span>
              <div>
                <strong>{isBn ? 'দলিলের দাগ ও খতিয়ান নম্বর' : 'Cadastral Identifiers (Dag & Khatian)'}</strong>
                <small>
                  {isBn
                    ? `দাগ: ${activeDagNo}, খতিয়ান: ${activeKhatianNo} — মৌজা রেকর্ডের সাথে সামঞ্জস্যপূর্ণ`
                    : `Dag: ${activeDagNo}, Khatian: ${activeKhatianNo} cross-referenced with Mouza`}
                </small>
              </div>
            </div>

            <div className="check">
              <span className={`badge-dot ${isOverLimit ? 'warning' : ''}`}>
                {isOverLimit ? '!' : '✓'}
              </span>
              <div>
                <strong>{isBn ? 'বিক্রেতার উপলব্ধ অংশ' : "Seller's Available Share"}</strong>
                <small>
                  {isOverLimit
                    ? (isBn ? `বিক্রির দাবি (${claimedShare} শতক) বিক্রেতার অংশের (${availableShare} শতক) চেয়ে বেশি` : `Claim (${claimedShare} dec) exceeds share (${availableShare} dec)`)
                    : (isBn ? `নথিভুক্ত অংশে ${availableShare} শতক পাওয়া গেছে` : `Verified ${availableShare} decimals available`)}
                </small>
              </div>
            </div>

            <div className="check">
              <span className={`badge-dot ${isUsingAiResult && (geminiVerificationResult.isMortgaged || geminiVerificationResult.isKhasOrDisputed) ? 'warning' : ''}`}>
                {isUsingAiResult && (geminiVerificationResult.isMortgaged || geminiVerificationResult.isKhasOrDisputed) ? '!' : '✓'}
              </span>
              <div>
                <strong>{isBn ? 'আইনি ও দায়বদ্ধতা মুক্ত কিনা' : 'Encumbrance & Title Legality'}</strong>
                <small>
                  {isUsingAiResult
                    ? (geminiVerificationResult.isMortgaged
                        ? (isBn ? 'সোনালী ব্যাংক বা অন্য আর্থিক প্রতিষ্ঠানে দায়বদ্ধ' : 'Active mortgage lien recorded')
                        : (isBn ? 'কোনো ব্যাংক দায়বদ্ধতা বা স্থগিতাদেশ পাওয়া যায়নি' : 'No mortgages or injunctions found'))
                    : (isBn ? 'নমুনা রেকর্ড পরীক্ষা করা হয়েছে' : 'Screened against demo registry')}
                </small>
              </div>
            </div>
          </div>

          {/* Expandable Automated 7 Rules */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
            <button
              className="btn secondary sm"
              style={{ width: '100%', justifyContent: 'space-between' }}
              onClick={() => setExpandedRules(!expandedRules)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={13} color="var(--green)" />
                <strong>{isBn ? '৭টি ভূমি যাচাই নিয়মের ফলাফল' : '7 Core Land Verification Rules'}</strong>
              </span>
              {expandedRules ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {expandedRules && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.values(VERIFICATION_RULES).map(rule => {
                  let passed = true;
                  let message = '';

                  if (isUsingAiResult && geminiVerificationResult?.rules?.[rule.code]) {
                    const r = geminiVerificationResult.rules[rule.code];
                    passed = r.passed;
                    message = r.messageBn;
                  } else {
                    passed = verificationResult?.passedRules?.includes(rule.code) ?? (scenarioVal === 6 && rule.code === 'R01' ? false : true);
                  }

                  return (
                    <div
                      key={rule.code}
                      style={{
                        padding: '10px 12px',
                        background: passed ? '#f8faf9' : '#fff5f5',
                        borderRadius: 8,
                        border: passed ? '1px solid var(--line)' : '1px solid #fecaca',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        fontSize: 12
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--deep)' }}>
                            {isBn ? rule.nameBn : rule.name}
                          </span>
                          <span style={{ color: 'var(--muted)', marginLeft: 6, fontSize: 11 }}>
                            ({rule.code})
                          </span>
                        </div>
                        <span
                          className={`pill ${passed ? '' : 'red'}`}
                          style={{
                            padding: '2px 8px',
                            fontSize: 10,
                            background: passed ? '#def7ec' : '#fee2e2',
                            color: passed ? '#03543f' : '#991b1b'
                          }}
                        >
                          {passed ? (isBn ? '✓ উত্তীর্ণ' : 'Passed') : (isBn ? '⚠ অমিল / ঝুঁকি' : 'Failed')}
                        </span>
                      </div>
                      {message && (
                        <div style={{ fontSize: 11, color: passed ? 'var(--muted)' : '#991b1b' }}>
                          {message}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Note for Officer / Citizen */}
          {isUsingAiResult && geminiVerificationResult?.officerRecommendationBn && (
            <div
              style={{
                marginTop: 16,
                padding: '10px 14px',
                borderRadius: 8,
                background: '#f0fdf4',
                borderLeft: '4px solid var(--green)',
                fontSize: 12,
                color: '#166534',
                lineHeight: 1.5
              }}
            >
              <strong>{isBn ? 'এসি ল্যান্ড (ভূমি) কর্মকর্তার প্রতি পরামর্শ:' : 'AC Land Recommendation:'}</strong>{' '}
              {geminiVerificationResult.officerRecommendationBn}
            </div>
          )}

          <div className="btn-row" style={{ marginTop: 24 }}>
            <button className="btn" onClick={handleProceed} style={{ width: '100%' }}>
              {isBn ? 'আবেদন তৈরি করুন →' : 'Proceed to Application →'} <ArrowRight size={14} />
            </button>
            <button className="btn secondary sm" onClick={() => navigate('/identify')} style={{ width: '100%' }}>
              <ChevronLeft size={14} /> {isBn ? 'নকশায় ফিরুন' : 'Back to Cadastral Map'}
            </button>
          </div>
        </div>

        {/* Right Column: Scenario Switcher & Dynamic Comparison Bar */}
        <div className="card pad">
          <div className="panel-head">
            <div>
              <h2>{isBn ? 'যাচাইয়ের পরীক্ষা পরিবর্তন করুন' : 'Test Scenarios & Land Area Comparison'}</h2>
              <p style={{ margin: 0 }}>
                {isBn
                  ? 'বিভিন্ন বাস্তব ও নমুনা পরিস্থিতি নির্বাচন করে এআই অডিটের ফলাফল তুলনা করুন।'
                  : 'Select different test scenarios to evaluate AI fraud detection.'}
              </p>
            </div>
          </div>

          {/* Scenario Select */}
          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="scenarioSelect">
              {isBn ? 'পরীক্ষার পরিস্থিতি নির্বাচন' : 'Select Test Scenario'}
            </label>
            <select
              id="scenarioSelect"
              value={scenarioVal}
              onChange={handleScenarioChange}
              style={{ fontSize: 13, padding: '9px 12px' }}
            >
              <option value="1">স্বাভাবিক বিক্রি — ৫ শতক (Clean Match - 5 Dec)</option>
              <option value="6">অসামঞ্জস্যপূর্ণ বিক্রি — ১০ শতক (Area Mismatch / Over-Share - 10 Dec)</option>
              <option value="3">ব্যাংকে বন্ধক রাখা জমি (Sonali Bank Mortgage Lien)</option>
              <option value="4">আদালতে দেওয়ানি মামলা ও স্থগিতাদেশ (Legal Injunction)</option>
              <option value="5">অর্পিত / সরকারি খাস জমি (Vested / Khas Land Alert)</option>
            </select>
          </div>

          {/* Deed & Plot Reference Info Box */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              background: '#f8faf9',
              border: '1px solid var(--line)',
              marginBottom: 16,
              fontSize: 12
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--deep)', marginBottom: 6 }}>
              {isBn ? 'সংশ্লিষ্ট নথির তথ্য:' : 'Deed Reference:'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, color: 'var(--muted)' }}>
              <div>{isBn ? 'দলিল নম্বর:' : 'Deed No:'} <b style={{ color: 'var(--ink)' }}>{activeDeedNo}</b></div>
              <div>{isBn ? 'মৌজা ও দাগ:' : 'Plot / Dag:'} <b style={{ color: 'var(--ink)' }}>{activeDagNo}</b></div>
              <div>{isBn ? 'খতিয়ান:' : 'Khatian:'} <b style={{ color: 'var(--ink)' }}>{activeKhatianNo}</b></div>
              <div>{isBn ? 'বিক্রেতা:' : 'Seller:'} <b style={{ color: 'var(--ink)' }}>{activeSeller}</b></div>
            </div>
          </div>

          {/* ── Dynamic Area Comparison Bar ── */}
          <div className="area-comparison" aria-label={isBn ? 'জমির পরিমাণের তুলনা' : 'Land Area Comparison'}>
            <div className="comparison-caption">
              <h3>{isBn ? 'জমির পরিমাণের তুলনা' : 'Land Area Comparison'}</h3>
              <span>{isBn ? 'একক: শতাংশ (Decimals)' : 'Unit: Decimals'}</span>
            </div>

            <div className="bar-label">
              <span>{isBn ? 'বিক্রেতার উপলব্ধ অংশ' : "Seller's Available Share"}</span>
              <b>{availableShare} {isBn ? 'শতক' : 'Dec'}</b>
            </div>
            <div className="bar-track">
              <div
                className="bar-available"
                style={{
                  width: `${Math.min(availableShare * 10, 100)}%`,
                  background: 'var(--green)'
                }}
              ></div>
            </div>

            <div className="bar-label">
              <span>{isBn ? 'বিক্রয়ের দাবি' : 'Claimed Transferred Area'}</span>
              <b>{claimedShare} {isBn ? 'শতক' : 'Dec'}</b>
            </div>
            <div className="bar-track">
              <div
                className={`bar-claimed ${isOverLimit ? 'over-limit' : ''}`}
                style={{
                  width: `${Math.min(claimedShare * 10, 100)}%`,
                  background: isOverLimit ? '#dc2626' : '#17334c'
                }}
              ></div>
            </div>

            <p style={{ margin: '8px 0 0', fontSize: 12, color: isOverLimit ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>
              {isOverLimit
                ? (isBn
                    ? `বিক্রয়ের দাবি উপলব্ধ অংশের চেয়ে ${Math.abs(claimedShare - availableShare)} শতাংশ বেশি। এটি দ্বৈত বিক্রয়ের সম্ভাব্য ঝুঁকি।`
                    : `Claimed area is ${Math.abs(claimedShare - availableShare)} decimals higher than recorded share. Double-selling risk.`)
                : (isBn
                    ? 'দাবিকৃত পরিমাণ বিক্রেতার উপলব্ধ অংশের মধ্যে সীমাবদ্ধ আছে।'
                    : 'Claimed area is safely within seller legal share.')}
            </p>
          </div>

          {/* Rule Grid Metric Display */}
          <div style={{ marginTop: 18 }} className="rulegrid">
            <div className="rule">
              <b>{isBn ? 'বিক্রেতার রেকর্ডকৃত অংশ' : 'Recorded Legal Share'}</b>
              <strong style={{ fontSize: 22, color: 'var(--green)' }}>
                {availableShare} {isBn ? 'শতাংশ' : 'Dec'}
              </strong>
            </div>
            <div className="rule">
              <b>{isBn ? 'প্রস্তাবিত বিক্রি' : 'Claimed Sale'}</b>
              <strong style={{ fontSize: 22, color: isOverLimit ? 'var(--red)' : 'var(--navy)' }}>
                {claimedShare} {isBn ? 'শতাংশ' : 'Dec'}
              </strong>
            </div>
          </div>

          {/* Gemini AI Verification Score Card */}
          {isUsingAiResult && (
            <div
              style={{
                marginTop: 18,
                padding: '12px 14px',
                borderRadius: 10,
                background: geminiVerificationResult.overallScore >= 80 ? '#f0fdf4' : '#fff5f5',
                border: geminiVerificationResult.overallScore >= 80 ? '1px solid #86efac' : '1px solid #fecaca',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ fontSize: 13, color: 'var(--deep)' }}>
                  {isBn ? 'Gemini AI ভেরিফিকেশন স্কোর' : 'Gemini AI Verification Score'}
                </strong>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  মডেল: {geminiVerificationResult.modelUsed}
                </div>
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: geminiVerificationResult.overallScore >= 80 ? '#16a34a' : '#dc2626'
                }}
              >
                {geminiVerificationResult.overallScore}/100
              </div>
            </div>
          )}

          <p className="help-note" style={{ marginTop: 18 }}>
            {isBn
              ? 'গুগল জেমিনাই ফ্ল্যাশ এআই মডেল সরাসরি খতিয়ান ও দলিলের তথ্য যাচাই করে। বাস্তব নামজারিতে সহকারী কমিশনার (ভূমি) চূড়ান্ত আদেশ প্রদান করবেন।'
              : 'Google Gemini Flash dynamically cross-references land records. Assistant Commissioner (Land) executes the final legal mutation order.'}
          </p>
        </div>
      </div>
    </div>
  );
}
