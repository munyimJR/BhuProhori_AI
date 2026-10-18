import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Award, Printer, Home, CheckCircle, Search, Sparkles, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import statusAuditReportImg from '../assets/Status & Audit Report.png';

export default function TrackPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    allApplications,
    currentApplication,
    verificationResult,
    extraction,
    geminiVerificationResult,
    runLiveGeminiVerificationCheck,
    isVerifyingAi,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [localAiRunning, setLocalAiRunning] = useState(false);

  // Priority: URL id -> store currentApplication -> first in allApplications
  const app =
    (id ? allApplications.find(a => a.id === id) : null) ||
    currentApplication ||
    allApplications[0];

  const handlePrint = () => {
    window.print();
  };

  const handleRunAiForReport = async () => {
    setLocalAiRunning(true);
    try {
      const scenarioNum = (app as unknown as { scenarioNumber?: number })?.scenarioNumber || 1;
      await runLiveGeminiVerificationCheck(
        scenarioNum,
        `Track report live verification for deed: ${app?.deedNumber || 'DEMO-2026-001'}, dag: ${app?.dagNumber || '125'}`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLocalAiRunning(false);
    }
  };

  const getFieldValue = (fieldName: keyof NonNullable<typeof extraction>['fields']) => {
    if (!extraction) return '';
    const field = extraction.fields[fieldName];
    return field?.userCorrectedValue ?? field?.value ?? '';
  };

  const buyerName = app?.applicantNameBn || app?.applicantName || getFieldValue('grantee') || 'Demo Buyer B';
  const deedNo = app?.deedNumber || getFieldValue('deedNumber') || 'DEMO-2026-001';
  const mouzaName = app?.mouza?.nameBn || getFieldValue('mouza') || 'ডেমো মৌজা';
  const dagNo = app?.dagNumber || getFieldValue('dagNumber') || '125';
  const areaVal = app?.transferArea || 5;
  const statusLabel = app?.status === 'approved' ? 'অনুমোদিত' : 'প্রাথমিক যাচাই সম্পন্ন';

  const aiLoading = isVerifyingAi || localAiRunning;

  return (
    <div>
      {/* Workspace Heading */}
      <div className="workspace-heading no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="workspace-symbol">
            <Award size={22} />
          </div>
          <div>
            <h1 className="title">নামজারি যাচাই ও আবেদনের রিপোর্ট</h1>
            <p className="desc" style={{ margin: 0 }}>
              ভূপ্রহরী AI আপনার আবেদন, নথি এবং যাচাইয়ের সারসংক্ষেপ এক জায়গায় দেখায়।
            </p>
          </div>
        </div>
        <span className="workspace-label">আবেদনের সারসংক্ষেপ</span>
      </div>

      {/* Quick Search Bar (no-print) */}
      <div className="no-print" style={{ marginBottom: 20, display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            placeholder="আবেদন আইডি বা দাগ নম্বর দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              border: '1px solid var(--line)',
              borderRadius: 10,
              fontSize: 13,
            }}
          />
          <Search size={16} color="var(--muted)" style={{ position: 'absolute', left: 12, top: 12 }} />
        </div>

        {allApplications.length > 1 && (
          <select
            style={{
              padding: '9px 12px',
              border: '1px solid var(--line)',
              borderRadius: 10,
              fontSize: 13,
              background: 'white',
            }}
            onChange={e => navigate(`/track/${e.target.value}`)}
            value={app?.id}
          >
            {allApplications.map(a => (
              <option key={a.id} value={a.id}>
                {a.id} ({a.applicantNameBn || a.applicantName})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Report Document Card (Print Area) */}
      <div className="card pad" id="printArea">
        {/* Landscape photo banner */}
        <figure className="paddy-panel-photo" style={{ marginBottom: 18 }}>
          <img
            src={statusAuditReportImg}
            alt="নামজারি যাচাই ও আবেদনের অডিট রিপোর্ট"
            width="1536"
            height="1024"
            style={{ height: 130, objectFit: 'cover' }}
          />
        </figure>

        {/* Certificate banner */}
        <div className="report-head">
          <div className="report-watermark">
            BHUPROHORI AI • DEMONSTRATION REPORT
          </div>
          <h2>ভূমি নামজারি যাচাই রিপোর্ট</h2>
          <p>Demo Application ID: {app?.id || 'DEMO-MUT-001'}</p>
        </div>

        {/* 2-Column Details */}
        <div className="grid two" style={{ marginTop: 20 }}>
          {/* Left: Application details */}
          <div>
            <h3 style={{ fontSize: 15, color: 'var(--deep)', marginBottom: 12 }}>আবেদনের বিবরণ</h3>
            <div className="info-list">
              <div className="info-line">
                <span>আবেদনকারী</span>
                <span>{buyerName}</span>
              </div>
              <div className="info-line">
                <span>দলিল নম্বর</span>
                <span>{deedNo}</span>
              </div>
              <div className="info-line">
                <span>মৌজা</span>
                <span>{mouzaName}</span>
              </div>
              <div className="info-line">
                <span>দাগ নম্বর</span>
                <span>{dagNo}</span>
              </div>
              <div className="info-line">
                <span>আবেদিত জমি</span>
                <span>{areaVal} শতাংশ</span>
              </div>
            </div>
          </div>

          {/* Right: Verification & status */}
          <div>
            <h3 style={{ fontSize: 15, color: 'var(--deep)', marginBottom: 12 }}>যাচাই ও অগ্রগতি</h3>
            <div className="risk-block safe">
              <span className="risk-icon">✓</span>
              <div>
                <strong>নমুনা পরিমাণগত যাচাই সম্পন্ন</strong>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  {(verificationResult?.findings?.length ?? 0) > 0
                    ? 'যাচাই নিয়মে সতর্কতা শনাক্ত হয়েছে, তবে প্রাথমিক সারসংক্ষেপ সংরক্ষিত।'
                    : 'প্রাথমিক ডেমো যাচাইয়ে কোনো মারাত্মক পরিমাণগত অসামঞ্জস্য পাওয়া যায়নি।'}
                </div>
              </div>
            </div>

            <div className="hintbox" style={{ marginTop: 16 }}>
              <CheckCircle size={16} />
              <div>
                আবেদনের বর্তমান অবস্থা: <strong>{statusLabel}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Gemini 1.5 Flash AI Verification Seal & Audit Section */}
        <div style={{
          marginTop: 24,
          padding: 16,
          background: geminiVerificationResult?.isOverLimit || geminiVerificationResult?.isMortgaged || geminiVerificationResult?.isDoubleSellingRisk
            ? 'linear-gradient(135deg, rgba(254, 242, 242, 0.95), rgba(255, 237, 213, 0.8))'
            : 'linear-gradient(135deg, rgba(236, 253, 245, 0.95), rgba(240, 253, 250, 0.8))',
          borderRadius: 14,
          border: geminiVerificationResult?.isOverLimit || geminiVerificationResult?.isMortgaged || geminiVerificationResult?.isDoubleSellingRisk
            ? '1.5px solid #f87171'
            : '1.5px solid #34d399',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: geminiVerificationResult?.isOverLimit || geminiVerificationResult?.isMortgaged
                  ? '#ef4444'
                  : '#059669',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <Sparkles size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--deep)' }}>
                    Gemini 1.5 Flash এআই অডিট সিল
                  </h4>
                  <span style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontWeight: 600,
                    background: geminiVerificationResult?.isOverLimit || geminiVerificationResult?.isMortgaged || geminiVerificationResult?.isDoubleSellingRisk
                      ? '#fee2e2'
                      : '#d1fae5',
                    color: geminiVerificationResult?.isOverLimit || geminiVerificationResult?.isMortgaged || geminiVerificationResult?.isDoubleSellingRisk
                      ? '#b91c1c'
                      : '#065f46',
                  }}>
                    {geminiVerificationResult
                      ? (geminiVerificationResult.isOverLimit || geminiVerificationResult.isMortgaged || geminiVerificationResult.isDoubleSellingRisk
                          ? 'উচ্চ ঝুঁকি শনাক্ত'
                          : 'স্বচ্ছ ও নিরাপদ')
                      : 'লাইভ যাচাইয়ের জন্য প্রস্তুত'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  ডিজিটাল দলিল স্ক্যান, ব্যাংকিং বন্ধক ও খতিয়ান হিস্যা স্বয়ংক্রিয় যাচাই
                </div>
              </div>
            </div>

            <button
              className="no-print btn-secondary"
              onClick={handleRunAiForReport}
              disabled={aiLoading}
              style={{
                fontSize: 12,
                padding: '6px 14px',
                borderRadius: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'white',
                cursor: aiLoading ? 'not-allowed' : 'pointer',
                border: '1px solid var(--line)'
              }}
            >
              <RefreshCw size={14} className={aiLoading ? 'spin' : ''} />
              {aiLoading ? 'Gemini AI বিশ্লেষণ চলছে...' : (geminiVerificationResult ? 'পুনরায় AI অডিট করুন' : '⚡ লাইভ AI অডিট সিল তৈরি করুন')}
            </button>
          </div>

          {geminiVerificationResult ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, fontSize: 12 }}>
              <div style={{ background: 'white', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ color: 'var(--muted)', marginBottom: 2 }}>ব্যাংক বন্ধক / লিয়েন</div>
                <strong style={{ color: geminiVerificationResult.isMortgaged ? '#dc2626' : '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {geminiVerificationResult.isMortgaged ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                  {geminiVerificationResult.isMortgaged ? 'সতর্কতা: বন্ধকি দায় পাওয়া গেছে' : 'কোনো ব্যাংক দায় বা বন্ধক নেই'}
                </strong>
              </div>
              <div style={{ background: 'white', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ color: 'var(--muted)', marginBottom: 2 }}>মালিকানা অংশ ও বিক্রয় সীমা</div>
                <strong style={{ color: geminiVerificationResult.isOverLimit ? '#dc2626' : '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {geminiVerificationResult.isOverLimit ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                  {geminiVerificationResult.isOverLimit ? 'অতিরিক্ত জমি দাবি / অমিল' : 'খতিয়ানের প্রাপ্য সীমার ভেতর বৈধ'}
                </strong>
              </div>
              <div style={{ background: 'white', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ color: 'var(--muted)', marginBottom: 2 }}>দ্বৈত বিক্রয় ঝুঁকি</div>
                <strong style={{ color: geminiVerificationResult.isDoubleSellingRisk ? '#dc2626' : '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {geminiVerificationResult.isDoubleSellingRisk ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                  {geminiVerificationResult.isDoubleSellingRisk ? 'সম্ভাব্য দ্বৈত রেজিস্ট্রি ঝুঁকি' : 'কোনো দ্বৈত দলিল পাওয়া যায়নি'}
                </strong>
              </div>
              <div style={{ gridColumn: '1 / -1', background: 'white', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ color: 'var(--muted)', marginBottom: 4 }}>Gemini 1.5 Flash অডিট সারসংক্ষেপ:</div>
                <div style={{ lineHeight: 1.5, color: 'var(--deep)' }}>{geminiVerificationResult.summaryBn}</div>
                {geminiVerificationResult.officerRecommendationBn && (
                  <div style={{ marginTop: 6, fontSize: 11, color: '#4b5563', fontStyle: 'italic' }}>
                    <strong>এসি ল্যান্ডের জন্য AI সুপারিশ:</strong> {geminiVerificationResult.officerRecommendationBn}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--muted)', background: 'white', padding: 12, borderRadius: 8, border: '1px dashed var(--line)' }}>
              এই আবেদনের জন্য Gemini 1.5 Flash লাইভ অডিট এখনও সম্পন্ন হয়নি। উপরের বাটনে ক্লিক করে সরাসরি গুগল জেমিনি এআই দিয়ে ব্যাংক দায়, দ্বৈত বিক্রয় ও খতিয়ান হিস্যা যাচাই করুন।
            </div>
          )}
        </div>

        {/* Timeline representation */}
        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
          <h4 style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>কার্যক্রমের সময়রেখা</h4>
          <div className="timeline">
            <div className="stage passed">দলিল দাখিল</div>
            <div className="stage passed">স্বয়ংক্রিয় যাচাই</div>
            <div className={`stage ${app?.status === 'approved' ? 'passed' : ''}`}>কর্মকর্তার পর্যালোচনা</div>
            <div className={`stage ${app?.status === 'approved' ? 'passed' : ''}`}>অনুমোদন / নিষ্পত্তি</div>
          </div>
        </div>

        {/* Legal / Prototype Disclaimer */}
        <div className="help-note" style={{ marginTop: 22 }}>
          <strong>শুধুমাত্র হ্যাকাথন ডেমো</strong>
          <br />
          এই রিপোর্ট সরকারি দলিল, মালিকানা সনদ বা অনুমোদিত নামজারি নয়। এতে কাল্পনিক ব্যক্তিগত ও ভূমি তথ্য ব্যবহৃত হয়েছে।
        </div>
      </div>

      {/* Action Buttons */}
      <div className="btn-row no-print" style={{ marginTop: 22 }}>
        <button className="btn" onClick={handlePrint}>
          <Printer size={15} /> রিপোর্ট প্রিন্ট / PDF
        </button>

        <button className="btn secondary" onClick={() => navigate('/')}>
          <Home size={15} /> হোমে ফিরুন
        </button>
      </div>
    </div>
  );
}
