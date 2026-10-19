import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Shield, ArrowRight, AlertTriangle, Sparkles, Zap,
  Loader2, Check
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import type { MutationApplication, MutationStatus } from '../types';

export default function OfficerPage() {
  const navigate = useNavigate();
  const {
    allApplications, updateApplicationStatus, currentRole, setRole,
    runLiveOfficerAudit, geminiOfficerAudits, isAiLoading, language, resetGeminiApiKey
  } = useAppStore();

  const isBn = language === 'bn';

  const [selectedId, setSelectedId] = useState<string>(allApplications[0]?.id || 'DEMO-MUT-2026-0001');
  const [decisionOption, setDecisionOption] = useState<string>('Need clarification');
  const [decisionNote, setDecisionNote] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [aiAuditError, setAiAuditError] = useState<string | null>(null);

  const selectedApp: MutationApplication | undefined =
    allApplications.find(a => a.id === selectedId) || allApplications[0];

  const currentAudit = selectedApp ? geminiOfficerAudits[selectedApp.id] : undefined;

  const handleRunAiAudit = async () => {
    if (!selectedApp) return;
    setAiAuditError(null);
    try {
      await runLiveOfficerAudit(selectedApp.id);
      setToastMsg(isBn ? 'Gemini Flash এআই দিয়ে কেস অডিট সফলভাবে সম্পন্ন হয়েছে!' : 'Gemini Flash AI case audit complete!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      setAiAuditError(err?.message || 'Gemini AI কেস অডিট সম্পন্ন করা যায়নি।');
    }
  };

  const handleApplyAiRecommendation = () => {
    if (!currentAudit) return;

    if (currentAudit.suggestedAction === 'clarification_required') {
      setDecisionOption('Need clarification');
    } else if (currentAudit.suggestedAction === 'field_verification_requested') {
      setDecisionOption('Field verification');
    } else if (currentAudit.suggestedAction === 'approved') {
      setDecisionOption('Demo approved');
    } else {
      setDecisionOption('Under review');
    }

    setDecisionNote(currentAudit.officerNoteDraftBn);
    setToastMsg(isBn ? 'এআই সুপারিশ ও আদেশের নোট ফর্মে পূরণ করা হয়েছে!' : 'AI recommendation & draft note applied!');
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleDecisionSave = () => {
    if (!selectedApp) return;

    let targetStatus: MutationStatus = 'under_verification';
    if (decisionOption === 'Need clarification') targetStatus = 'clarification_required';
    else if (decisionOption === 'Field verification') targetStatus = 'field_verification_requested';
    else if (decisionOption === 'Under review') targetStatus = 'officer_review';
    else if (decisionOption === 'Demo approved') targetStatus = 'approved';

    updateApplicationStatus(
      selectedApp.id,
      targetStatus,
      decisionNote || `${decisionOption} - কর্মকর্তা কর্তৃক সংরক্ষিত নোট`,
      'তাহমিনা আক্তার (এসি ল্যান্ড, সাভার)'
    );

    setToastMsg(isBn ? 'সিদ্ধান্ত সফলভাবে সংরক্ষণ ও আপডেট হয়েছে।' : 'Decision successfully recorded.');
    setTimeout(() => setToastMsg(''), 3500);
  };

  const stats = {
    total: allApplications.length || 12,
    needsCheck: allApplications.filter(a => a.status === 'clarification_required' || a.status === 'field_verification_requested').length || 4,
    underReview: allApplications.filter(a => a.status === 'officer_review' || a.status === 'under_verification').length || 6,
  };

  return (
    <div>
      {/* Workspace Heading */}
      <div className="workspace-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="workspace-symbol">
            <Users size={22} />
          </div>
          <div>
            <h1 className="title">{isBn ? 'সহকারী কমিশনার (ভূমি) অফিস — কেস অডিট' : 'AC Land Officer Dashboard'}</h1>
            <p className="desc" style={{ margin: 0 }}>
              {isBn
                ? 'জেমিনাই এআই কেস অডিটর দিয়ে নামজারি আবেদনের ঝুঁকি ও দলিলের সত্যতা স্বয়ংক্রিয়ভাবে যাচাই করুন।'
                : 'Smart AC Land case review powered by Google Gemini Flash AI audit assistant.'}
            </p>
          </div>
        </div>
        <span className="workspace-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} color="var(--green)" />
          {isBn ? 'এআই কেস অডিটর' : 'AI Case Auditor'}
        </span>
      </div>

      {currentRole !== 'officer' && (
        <div className="hintbox" style={{ marginBottom: 20, background: '#fff9e6', borderColor: '#f2dc9b' }}>
          <AlertTriangle size={18} color="var(--amber)" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: 10 }}>
            <span>{isBn ? 'আপনি বর্তমানে নাগরিক মোডে আছেন। কর্মকর্তা সুবিধা পুরোপুরি সক্রিয় করতে মোড পরিবর্তন করুন।' : 'You are currently in Citizen mode. Switch to Officer mode for full access.'}</span>
            <button className="btn btn-sm secondary" onClick={() => setRole('officer')}>
              <Shield size={13} /> {isBn ? 'কর্মকর্তা মোডে যান' : 'Switch to Officer Mode'}
            </button>
          </div>
        </div>
      )}

      {/* 3 Stat Cards */}
      <div className="grid three">
        <div className="card stat">
          <span className="subtle">{isBn ? 'মোট আবেদন' : 'Total Applications'}</span>
          <div className="number">{stats.total < 10 ? `0${stats.total}` : stats.total}</div>
          <p>{isBn ? 'চলতি মাসের তালিকা' : 'Active Registry'}</p>
        </div>
        <div className="card stat">
          <span className="subtle">{isBn ? 'যাচাই ও ব্যাখ্যা প্রয়োজন' : 'Action Required'}</span>
          <div className="number">{stats.needsCheck < 10 ? `0${stats.needsCheck}` : stats.needsCheck}</div>
          <p>{isBn ? 'অসামঞ্জস্য বা নথি সমস্যা' : 'Discrepancy / Missing Docs'}</p>
        </div>
        <div className="card stat">
          <span className="subtle">{isBn ? 'পর্যালোচনাধীন' : 'Under Review'}</span>
          <div className="number">{stats.underReview < 10 ? `0${stats.underReview}` : stats.underReview}</div>
          <p>{isBn ? 'এআই অডিট সম্পন্ন' : 'AI Screened'}</p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card pad" style={{ marginTop: 20 }}>
        <div className="panel-head">
          <div>
            <h2>{isBn ? 'নামজারি আবেদন তালিকা' : 'Mutation Case Queue'}</h2>
            <small style={{ color: 'var(--muted)' }}>
              {isBn ? 'যেকোনো আবেদনে ক্লিক করে জেমিনাই এআই দিয়ে তাৎক্ষণিক কেস অডিট করুন' : 'Click any application to inspect and run Gemini AI case audit'}
            </small>
          </div>
          <span className="pill" style={{ background: '#e9f6ef', color: '#10553f' }}>
            ⚡ GEMINI FLASH READY
          </span>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>{isBn ? 'আবেদন নম্বর' : 'App ID'}</th>
                <th>{isBn ? 'দাগ ও খতিয়ান' : 'Plot / Khatian'}</th>
                <th>{isBn ? 'আবেদনকারী (গ্রহীতা)' : 'Applicant'}</th>
                <th>{isBn ? 'বিক্রেতা' : 'Seller'}</th>
                <th>{isBn ? 'জমির পরিমাণ' : 'Area'}</th>
                <th>{isBn ? 'অবস্থা' : 'Status'}</th>
                <th>{isBn ? 'এআই অডিট' : 'AI Audit'}</th>
              </tr>
            </thead>
            <tbody>
              {allApplications.slice(0, 6).map(app => {
                const isSelected = selectedApp?.id === app.id;
                const audit = geminiOfficerAudits[app.id];
                return (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedId(app.id)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? 'var(--mint)' : undefined,
                    }}
                  >
                    <td>
                      <strong>{app.id}</strong>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{app.deedNumber}</div>
                    </td>
                    <td>দাগ {app.dagNumber} • {app.khatianNumber}</td>
                    <td>{app.applicantNameBn || app.applicantName}</td>
                    <td>{app.grantorName || 'রহিম উদ্দিন'}</td>
                    <td>{app.transferArea} {isBn ? 'শতক' : 'Dec'}</td>
                    <td>
                      <span className={`pill ${app.status === 'approved' ? '' : app.status === 'rejected' ? 'red' : 'warn'}`}>
                        {app.status === 'approved' ? 'অনুমোদিত' : app.status === 'rejected' ? 'নামঞ্জুর' : 'পর্যালোচনাধীন'}
                      </span>
                    </td>
                    <td>
                      {audit ? (
                        <span
                          className={`pill ${audit.riskLevel === 'CRITICAL' ? 'red' : audit.riskLevel === 'HIGH' ? 'warn' : ''}`}
                          style={{ fontSize: 10, padding: '2px 8px' }}
                        >
                          {audit.riskLevel === 'CRITICAL' ? '🚨 বন্ধক/ঝুঁকি' : audit.riskLevel === 'HIGH' ? '⚠️ অমিল' : '✓ নিরাপদ'}
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>যাচাই করুন</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── GEMINI FLASH AI OFFICER CASE AUDITOR PANEL ── */}
      {selectedApp && (
        <div
          className="card pad"
          style={{
            marginTop: 20,
            background: 'linear-gradient(135deg, #ffffff 0%, #f4fbf7 100%)',
            border: '1.5px solid #a3dcbe',
            boxShadow: '0 6px 24px rgba(23, 107, 86, 0.08)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 14
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#176b56',
                  color: '#fff'
                }}
              >
                <Sparkles size={16} />
              </span>
              <div>
                <h2 style={{ margin: 0, fontSize: 16, color: 'var(--deep)', fontWeight: 700 }}>
                  {isBn ? 'Gemini 1.5 Flash AI স্মার্ট কেস অডিটর' : 'Gemini 1.5 Flash AI Case Auditor'}
                </h2>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {isBn
                    ? `আবেদন: ${selectedApp.id} (দলিল নং: ${selectedApp.deedNumber})`
                    : `Case: ${selectedApp.id} (Deed: ${selectedApp.deedNumber})`}
                </div>
              </div>
            </div>

            <button
              className="btn sm"
              disabled={isAiLoading}
              onClick={handleRunAiAudit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'linear-gradient(135deg, #176b56 0%, #10553f 100%)'
              }}
            >
              {isAiLoading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>{isBn ? 'এআই অডিট করছে...' : 'Auditing Case...'}</span>
                </>
              ) : (
                <>
                  <Zap size={13} />
                  <span>
                    {currentAudit
                      ? (isBn ? 'পুনরায় এআই অডিট চালান' : 'Re-Run AI Audit')
                      : (isBn ? '⚡ এআই দিয়ে এই আবেদনটি যাচাই করুন' : '⚡ Audit Case with Gemini Flash')}
                  </span>
                </>
              )}
            </button>
          </div>

          {aiAuditError && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: '#fff0f0',
                border: '1px solid #fca5a5',
                color: '#b13f43',
                fontSize: 12,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8
              }}
            >
              <div>⚠ {aiAuditError}</div>
              <button
                className="btn sm"
                style={{
                  background: '#b13f43',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 11,
                  padding: '4px 10px'
                }}
                onClick={() => {
                  resetGeminiApiKey();
                  setAiAuditError(null);
                  handleRunAiAudit();
                }}
              >
                ⚡ {isBn ? '১-ক্লিকে রি-কানেক্ট ও পুনরায় চালান' : '1-Click Reconnect & Retry'}
              </button>
            </div>
          )}

          {currentAudit ? (
            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: currentAudit.riskLevel === 'CRITICAL' ? '#fff5f5' : '#ffffff',
                border: currentAudit.riskLevel === 'CRITICAL' ? '1.5px solid #f87171' : '1px solid var(--line)',
                marginTop: 10
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 700,
                      background: currentAudit.riskLevel === 'CRITICAL' ? '#ef4444' : currentAudit.riskLevel === 'HIGH' ? '#f59e0b' : '#10b981',
                      color: '#fff'
                    }}
                  >
                    ঝুঁকি: {currentAudit.riskLevel}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--deep)' }}>
                    এআই প্রস্তাবিত পদক্ষেপ: {currentAudit.suggestedActionBn}
                  </span>
                </div>

                <button
                  className="btn sm secondary"
                  onClick={handleApplyAiRecommendation}
                  style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                >
                  <Check size={13} />
                  <span>{isBn ? 'এআই সুপারিশ ও নোট গ্রহণ করুন' : 'Apply AI Recommendation'}</span>
                </button>
              </div>

              <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 10 }}>
                <strong>{isBn ? 'আইনি ব্যাখ্যা:' : 'Legal Reasoning:'}</strong> {currentAudit.reasoningBn}
              </div>

              {currentAudit.keyFindings.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--deep)', marginBottom: 4 }}>
                    {isBn ? 'মূল অনুসন্ধানসমূহ (Key Findings):' : 'Key Findings:'}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--muted)' }}>
                    {currentAudit.keyFindings.map((kf, i) => (
                      <li key={i}>{kf}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: '#f8faf9',
                  border: '1px solid var(--line)',
                  fontSize: 12
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--deep)', marginBottom: 4 }}>
                  {isBn ? 'এআই প্রস্তুতকৃত খসড়া আদেশ (Draft Order Sheet Note):' : 'Draft Order Sheet Entry:'}
                </div>
                <div style={{ fontFamily: 'monospace', color: 'var(--ink)', fontSize: 12, lineHeight: 1.5 }}>
                  "{currentAudit.officerNoteDraftBn}"
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', padding: '12px 0' }}>
              {isBn
                ? 'উপরের "⚡ এআই দিয়ে এই আবেদনটি যাচাই করুন" বাটনে ক্লিক করলে Gemini Flash স্বয়ংক্রিয়ভাবে ব্যাংক বন্ধক, দ্বৈত বিক্রয় ও খতিয়ান অডিট করবে।'
                : 'Click the button above to run real-time Gemini Flash AI case screening.'}
            </div>
          )}
        </div>
      )}

      {/* Decision and Timeline 2-column Grid */}
      <div className="grid two" style={{ marginTop: 20 }}>
        {/* Left: Decision actions */}
        <div className="card pad">
          <h2 style={{ marginTop: 0, fontSize: 17, color: 'var(--deep)' }}>
            {selectedApp?.id || 'DEMO-MUT-001'} {isBn ? 'এর বিষয়ে কর্মকর্তার চূড়ান্ত সিদ্ধান্ত' : 'Officer Order'}
          </h2>

          <div style={{ margin: '14px 0' }}>
            <label className="status-option">
              <input
                type="radio"
                name="officerDecision"
                value="Need clarification"
                checked={decisionOption === 'Need clarification'}
                onChange={e => setDecisionOption(e.target.value)}
              />
              {isBn ? 'অতিরিক্ত তথ্য ও নথি চাই (Clarification Required)' : 'Need Clarification / NOC'}
            </label>

            <label className="status-option">
              <input
                type="radio"
                name="officerDecision"
                value="Field verification"
                checked={decisionOption === 'Field verification'}
                onChange={e => setDecisionOption(e.target.value)}
              />
              {isBn ? 'মাঠ পর্যায়ে তদন্ত (Field Verification)' : 'Field Verification'}
            </label>

            <label className="status-option">
              <input
                type="radio"
                name="officerDecision"
                value="Under review"
                checked={decisionOption === 'Under review'}
                onChange={e => setDecisionOption(e.target.value)}
              />
              {isBn ? 'পর্যালোচনাধীন রাখুন (Under Review)' : 'Keep Under Review'}
            </label>

            <label className="status-option">
              <input
                type="radio"
                name="officerDecision"
                value="Demo approved"
                checked={decisionOption === 'Demo approved'}
                onChange={e => setDecisionOption(e.target.value)}
              />
              {isBn ? 'অনুমোদন প্রদান করুন (Approve Mutation)' : 'Approve Mutation'}
            </label>
          </div>

          <div className="field" style={{ marginBottom: 16 }}>
            <label htmlFor="decisionNote">{isBn ? 'মন্তব্য বা আদেশের কারণ' : 'Official Order Note'}</label>
            <input
              id="decisionNote"
              placeholder={isBn ? 'আদেশের কারণ লিখুন বা এআই সুপারিশ গ্রহণ করুন...' : 'Enter decision rationale...'}
              value={decisionNote}
              onChange={e => setDecisionNote(e.target.value)}
            />
          </div>

          <div className="btn-row">
            <button className="btn" onClick={handleDecisionSave}>
              {isBn ? 'আদেশ সংরক্ষণ করুন' : 'Save Officer Order'}
            </button>
          </div>

          {toastMsg && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--mint)', color: 'var(--green)', borderRadius: 8, fontSize: 12 }}>
              ✓ {toastMsg}
            </div>
          )}
        </div>

        {/* Right: Timeline */}
        <div className="card pad">
          <h2 style={{ marginTop: 0, fontSize: 17, color: 'var(--deep)' }}>
            {isBn ? 'আবেদনের অগ্রগতি ও ট্র্যাকিং' : 'Mutation Workflow Timeline'}
          </h2>

          <div className="timeline">
            <div className="stage passed">{isBn ? 'দাখিল' : 'Submitted'}</div>
            <div className="stage passed">{isBn ? 'এআই যাচাই' : 'AI Verified'}</div>
            <div className={`stage ${selectedApp?.status === 'approved' ? 'passed' : ''}`}>{isBn ? 'কর্মকর্তার আদেশ' : 'Officer Order'}</div>
            <div className={`stage ${selectedApp?.status === 'approved' ? 'passed' : ''}`}>{isBn ? 'সম্পন্ন' : 'Completed'}</div>
          </div>

          <p className="subtle" style={{ fontSize: 12, margin: '14px 0 20px' }}>
            {isBn ? 'বর্তমান অবস্থা:' : 'Current Status:'}{' '}
            <strong>
              {selectedApp?.status === 'approved'
                ? (isBn ? 'অনুমোদিত' : 'Approved')
                : (isBn ? 'কর্মকর্তার পর্যালোচনার জন্য প্রস্তুত' : 'Ready for Officer Review')}
            </strong>
          </p>

          <button className="btn secondary sm" onClick={() => navigate(`/track/${selectedApp?.id || ''}`)}>
            {isBn ? 'চূড়ান্ত রিপোর্ট দেখুন →' : 'View Full Case Report →'} <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
