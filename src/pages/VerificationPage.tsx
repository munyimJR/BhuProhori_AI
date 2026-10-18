import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ChevronLeft, ChevronDown, ChevronUp, Sparkles, Landmark, AlertTriangle } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { VERIFICATION_RULES } from '../data/demoData';

export default function VerificationPage() {
  const navigate = useNavigate();
  const {
    runVerificationCheck, verificationResult,
    currentScenario, loadDemoScenario, setStep,
    aiAuditResult, language
  } = useAppStore();
  const isBn = language === 'bn';

  const [scenarioVal, setScenarioVal] = useState<number>(currentScenario || 1);
  const [expandedRules, setExpandedRules] = useState(false);

  useEffect(() => {
    runVerificationCheck();
  }, [scenarioVal, runVerificationCheck]);

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setScenarioVal(val);
    loadDemoScenario(val);
  };

  const handleProceed = () => {
    setStep(5);
    navigate('/apply');
  };

  const availableShare = 8;
  const claimedShare = scenarioVal === 6 ? 10 : 5;
  const isOverLimit = claimedShare > availableShare;
  const hasErrors = isOverLimit || (verificationResult?.findings?.some(f => f.severity === 'error' || f.severity === 'critical') ?? false);

  return (
    <div>
      {/* Workspace Heading */}
      <div className="workspace-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="workspace-symbol">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="title">নামজারির আগে তথ্য যাচাই</h1>
            <p className="desc" style={{ margin: 0 }}>
              আবেদনটি জমা দেওয়ার আগে গুরুত্বপূর্ণ তথ্য মিলিয়ে দেখুন।
            </p>
          </div>
        </div>
        <span className="workspace-label">পরিমাণগত পরীক্ষা</span>
      </div>

      {/* 2-Column Grid */}
      <div className="grid two">
        {/* Left Column: Verification Summary */}
        <div className="card pad">
          <div className="panel-head">
            <h2>যাচাইয়ের সারসংক্ষেপ</h2>
            <span className={`pill ${hasErrors ? 'red' : ''}`}>
              {hasErrors ? 'পর্যালোচনা প্রয়োজন' : 'প্রাথমিক পরীক্ষা সম্পন্ন'}
            </span>
          </div>

          <div className={`risk-block ${hasErrors ? 'bad' : 'safe'}`}>
            <span className="risk-icon">{hasErrors ? '⚠' : '✓'}</span>
            <div>
              <strong>
                {hasErrors
                  ? 'রেকর্ডকৃত অংশের চেয়ে বিক্রির দাবি বেশি অথবা অমিল শনাক্ত'
                  : 'এই নমুনায় পরিমাণগত অসামঞ্জস্য পাওয়া যায়নি'}
              </strong>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                {hasErrors
                  ? `নমুনা অংশ ${availableShare} শতাংশ, দাবি ${claimedShare} শতাংশ। আরও ${Math.abs(claimedShare - availableShare)} শতাংশ যাচাই প্রয়োজন।`
                  : 'বিক্রিত জমির পরিমাণ নমুনা বিক্রেতার উপলব্ধ অংশের মধ্যে আছে।'}
              </div>
            </div>
          </div>

          {aiAuditResult && (
            <div
              style={{
                marginTop: 14,
                padding: '12px 14px',
                borderRadius: 10,
                background: aiAuditResult.riskLevel === 'CRITICAL' ? '#fff5f5' : '#f0fdf4',
                border: aiAuditResult.riskLevel === 'CRITICAL' ? '1.5px solid #f87171' : '1.5px solid #86efac',
                fontSize: 13
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 4, color: aiAuditResult.riskLevel === 'CRITICAL' ? '#991b1b' : '#166534' }}>
                <Sparkles size={15} />
                <span>{isBn ? 'Gemini 1.5 Flash লাইভ AI ফ্রড অডিট:' : 'Gemini 1.5 Flash AI Fraud Audit:'}</span>
                <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 8, background: aiAuditResult.riskLevel === 'CRITICAL' ? '#ef4444' : '#10b981', color: '#fff' }}>
                  {aiAuditResult.riskLevel}
                </span>
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.5, color: '#374151' }}>
                {aiAuditResult.summaryBn}
              </div>
              {aiAuditResult.isMortgaged && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, color: '#dc2626', fontWeight: 700, fontSize: 12 }}>
                  <Landmark size={14} />
                  <span>{isBn ? 'ব্যাংক বন্ধকী জমি শনাক্ত' : 'Bank Mortgage Lien Detected'}</span>
                </div>
              )}
              {aiAuditResult.isDoubleSellingRisk && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, color: '#dc2626', fontWeight: 700, fontSize: 12 }}>
                  <AlertTriangle size={14} />
                  <span>{isBn ? 'দ্বৈত বিক্রয় বা অতিরিক্ত অংশ দাবি' : 'Double Selling / Over-Share Claim'}</span>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 19 }}>
            <div className="check">
              <span className="badge-dot">✓</span>
              <div>
                <strong>দলিলের দাগ ও খতিয়ান নম্বর</strong>
                <small>আপনার নিশ্চিত করা তথ্য ডেমো রেকর্ডের সঙ্গে তুলনা করা হয়েছে</small>
              </div>
            </div>

            <div className="check">
              <span className={`badge-dot ${isOverLimit ? 'warning' : ''}`}>
                {isOverLimit ? '!' : '✓'}
              </span>
              <div>
                <strong>বিক্রেতার উপলব্ধ অংশ</strong>
                <small>
                  {isOverLimit
                    ? 'বিক্রির দাবির পরিমাণ নমুনা অংশের বেশি'
                    : `নমুনা রেকর্ডে ${availableShare} শতাংশ পাওয়া গেছে`}
                </small>
              </div>
            </div>

            <div className="check">
              <span className="badge-dot warning">!</span>
              <div>
                <strong>মূল দলিলের সত্যতা</strong>
                <small>কেবল নমুনা ব্যবহার করা হয়েছে; প্রকৃত নিবন্ধন যাচাই করা হয়নি</small>
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
              <span>৭টি স্বয়ংক্রিয় যাচাই নিয়মের ফলাফল (৭টি নিয়ম)</span>
              {expandedRules ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {expandedRules && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.values(VERIFICATION_RULES).map(rule => {
                  const passed = verificationResult?.passedRules?.includes(rule.code) ?? true;
                  return (
                    <div
                      key={rule.code}
                      style={{
                        padding: '8px 12px',
                        background: '#f8faf9',
                        borderRadius: 8,
                        border: '1px solid var(--line)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 12
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--deep)' }}>{rule.nameBn}</span>
                        <span style={{ color: 'var(--muted)', marginLeft: 6, fontSize: 11 }}>({rule.code})</span>
                      </div>
                      <span className={`pill ${passed ? '' : 'warn'}`} style={{ padding: '2px 8px', fontSize: 10 }}>
                        {passed ? 'উত্তীর্ণ' : 'সতর্কতা'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="btn-row" style={{ marginTop: 24 }}>
            <button className="btn" onClick={handleProceed} style={{ width: '100%' }}>
              আবেদন তৈরি করুন → <ArrowRight size={14} />
            </button>
            <button className="btn secondary sm" onClick={() => navigate('/identify')} style={{ width: '100%' }}>
              <ChevronLeft size={14} /> নকশায় ফিরুন
            </button>
          </div>
        </div>

        {/* Right Column: Scenario Switcher & Comparison Bar */}
        <div className="card pad">
          <div className="panel-head">
            <div>
              <h2>যাচাইয়ের পরীক্ষা পরিবর্তন করুন</h2>
              <p>নিচের দুটি পরিস্থিতি দেখিয়ে বিচারকদের কাছে ফলাফল তুলনা করুন।</p>
            </div>
          </div>

          <div className="field">
            <label htmlFor="scenarioSelect">ডেমো পরিস্থিতি</label>
            <select
              id="scenarioSelect"
              value={scenarioVal}
              onChange={handleScenarioChange}
            >
              <option value="1">স্বাভাবিক বিক্রি — ৫ শতাংশ (Clean Match)</option>
              <option value="6">অসামঞ্জস্যপূর্ণ বিক্রি — ১০ শতাংশ (Area Mismatch)</option>
              <option value="3">ব্যাংকে বন্ধক রাখা জমি (Mortgage Warning)</option>
              <option value="4">আদালতে স্থগিতাদেশ (Legal Injunction)</option>
              <option value="5">অর্পিত / খাস সরকারি জমি (Khas Alert)</option>
            </select>
          </div>

          <div className="area-comparison" aria-label="নমুনা জমির পরিমাণের তুলনা">
            <div className="comparison-caption">
              <h3>জমির পরিমাণের তুলনা</h3>
              <span>একক: শতাংশ</span>
            </div>

            <div className="bar-label">
              <span>বিক্রেতার উপলব্ধ অংশ</span>
              <b>{availableShare}</b>
            </div>
            <div className="bar-track">
              <div className="bar-available" style={{ width: '80%' }}></div>
            </div>

            <div className="bar-label">
              <span>বিক্রয়ের দাবি</span>
              <b>{claimedShare}</b>
            </div>
            <div className="bar-track">
              <div
                className={`bar-claimed ${isOverLimit ? 'over-limit' : ''}`}
                style={{ width: `${Math.min(claimedShare * 10, 100)}%` }}
              ></div>
            </div>

            <p style={{ margin: '6px 0 0', fontSize: 12, color: isOverLimit ? 'var(--red)' : 'var(--green)' }}>
              {isOverLimit
                ? `বিক্রয়ের দাবি উপলব্ধ অংশের চেয়ে ${claimedShare - availableShare} শতাংশ বেশি।`
                : 'দাবিকৃত পরিমাণ উপলব্ধ অংশের মধ্যে আছে।'}
            </p>
          </div>

          <div style={{ marginTop: 18 }} className="rulegrid">
            <div className="rule">
              <b>বিক্রেতার নমুনা অংশ</b>
              <strong style={{ fontSize: 24, color: 'var(--green)' }}>
                {availableShare} শতাংশ
              </strong>
            </div>
            <div className="rule">
              <b>প্রস্তাবিত বিক্রি</b>
              <strong style={{ fontSize: 24, color: isOverLimit ? 'var(--red)' : 'var(--navy)' }}>
                {claimedShare} শতাংশ
              </strong>
            </div>
          </div>

          <p className="help-note">
            প্রকৃত ভূমি আইনে জটিল মালিকানা, উত্তরাধিকার, নিবন্ধন ও বিবাদের বিষয় আছে। এটি শুধু একটি সহজ পরীক্ষামূলক নিয়ম।
          </p>
        </div>
      </div>
    </div>
  );
}
