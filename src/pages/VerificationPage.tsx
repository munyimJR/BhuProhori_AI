import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Shield, AlertTriangle, CheckCircle, XCircle, Info, Loader2 } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import type { VerificationFinding, VerificationSeverity } from '../types';

function SeverityIcon({ severity }: { severity: VerificationSeverity }) {
  if (severity === 'critical') return <XCircle size={16} color="var(--red)" />;
  if (severity === 'error') return <AlertTriangle size={16} color="#E55722" />;
  if (severity === 'warning') return <AlertTriangle size={16} color="var(--gold)" />;
  return <Info size={16} color="#0EA5E9" />;
}

function categoryLabel(cat: string) {
  switch (cat) {
    case 'no_inconsistency': return { label: 'কোনো অসামঞ্জস্য পাওয়া যায়নি', color: 'var(--green)', bg: 'var(--mint)', icon: <CheckCircle size={18} /> };
    case 'clarification_required': return { label: 'স্পষ্টীকরণ প্রয়োজন', color: 'var(--gold)', bg: 'var(--gold-bg)', icon: <AlertTriangle size={18} /> };
    case 'review_required': return { label: 'পর্যালোচনা প্রয়োজন', color: 'var(--red)', bg: 'var(--red-bg)', icon: <XCircle size={18} /> };
    case 'insufficient_evidence': return { label: 'পর্যাপ্ত তথ্য নেই', color: '#7C3AED', bg: '#F3E8FF', icon: <Info size={18} /> };
    default: return { label: '', color: '', bg: '', icon: null };
  }
}

function FindingCard({ finding }: { finding: VerificationFinding }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`severity-${finding.severity}`} style={{ borderRadius: 10, padding: '0.875rem 1rem', marginBottom: '0.625rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start', flex: 1 }}>
          <SeverityIcon severity={finding.severity} />
          <div>
            <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
              {finding.titleBn}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', fontFamily: 'Hind Siliguri, sans-serif' }}>
              {finding.descriptionBn}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
          <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>{finding.ruleCode}</span>
          <button className="btn btn-ghost btn-sm" style={{ padding: '0.2rem 0.4rem' }} onClick={() => setExpanded(!expanded)}>
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>
      {expanded && (
        <div style={{ marginTop: '0.75rem', paddingTop: '0.625rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '0.125rem' }}>প্রভাবিত ক্ষেত্র</div>
              {finding.affectedFields.map(f => <span key={f} className="badge badge-gray" style={{ fontSize: '0.65rem', marginRight: 2 }}>{f}</span>)}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '0.125rem' }}>সূত্র রেফারেন্স</div>
              {finding.sourceReferences.map(r => <div key={r} style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif' }}>{r}</div>)}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 6, padding: '0.5rem 0.625rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '0.125rem' }}>পরামর্শ</div>
            <div style={{ fontSize: '0.8125rem', fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--dark)' }}>{finding.recommendedActionBn}</div>
          </div>
          {finding.requiresHumanReview && (
            <div style={{ marginTop: '0.375rem', display: 'flex', gap: '0.25rem', alignItems: 'center', fontSize: '0.75rem', color: 'var(--navy)', fontFamily: 'Hind Siliguri, sans-serif' }}>
              <Shield size={11} />মানব পর্যালোচনা প্রয়োজন
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function VerificationPage() {
  const navigate = useNavigate();
  const { extraction, selectedParcel, runVerificationCheck, verificationResult, currentScenario } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      runVerificationCheck();
      setLoading(false);
    }, 2000);
  }, []);

  if (!extraction) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>প্রথমে দলিল আপলোড করুন</h2>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/upload')}>আপলোড পেজে যান</button>
      </div>
    );
  }

  const catInfo = verificationResult ? categoryLabel(verificationResult.category) : null;
  const findings = verificationResult?.findings ?? [];
  const criticalFindings = findings.filter(f => f.severity === 'critical');
  const errorFindings = findings.filter(f => f.severity === 'error');
  const warningFindings = findings.filter(f => f.severity === 'warning');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--page-bg)', padding: '2rem 0' }}>
      <div className="container-sm">
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/identify')}><ChevronLeft size={14} />পেছনে</button>
          </div>
          <h1 style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '1.625rem' }}>স্মার্ট যাচাই ফলাফল</h1>
          <p style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>
            নমুনা পরিস্থিতি #{currentScenario} — স্বয়ংক্রিয় নিয়ম-ভিত্তিক যাচাই
          </p>
        </div>

        {loading ? (
          <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 size={40} color="var(--green)" className="animate-spin" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--gray-500)', fontSize: '1rem' }}>
              যাচাই নিয়ম প্রয়োগ করা হচ্ছে...
            </div>
            <div style={{ fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--gray-400)', fontSize: '0.875rem', marginTop: '0.375rem' }}>
              R01 থেকে R07 পর্যন্ত ৭টি নিয়ম পরীক্ষা করা হচ্ছে
            </div>
          </div>
        ) : (
          <>
            {/* Overall result */}
            {catInfo && verificationResult && (
              <div style={{ background: catInfo.bg, border: `2px solid ${catInfo.color}`, borderRadius: 16, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ color: catInfo.color, flexShrink: 0 }}>{catInfo.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: catInfo.color, marginBottom: '0.125rem' }}>
                    {catInfo.label}
                  </div>
                  <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    {verificationResult.passedRules.length}টি নিয়ম পাস · {findings.length}টি সমস্যা চিহ্নিত · স্কোর: {verificationResult.overallScore}/100
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                  {criticalFindings.length > 0 && <span className="badge badge-red"><XCircle size={10} />{criticalFindings.length} জটিল</span>}
                  {errorFindings.length > 0 && <span className="badge badge-red">{errorFindings.length} ত্রুটি</span>}
                  {warningFindings.length > 0 && <span className="badge badge-gold">{warningFindings.length} সতর্কতা</span>}
                </div>
              </div>
            )}

            {/* Score bar */}
            {verificationResult && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.875rem' }}>যাচাই স্কোর</span>
                    <span style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: verificationResult.overallScore >= 80 ? 'var(--green)' : verificationResult.overallScore >= 50 ? 'var(--gold)' : 'var(--red)' }}>
                      {verificationResult.overallScore}/100
                    </span>
                  </div>
                  <div className="confidence-bar" style={{ height: 8 }}>
                    <div className="confidence-fill" style={{ width: `${verificationResult.overallScore}%` }} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    {verificationResult.passedRules.map(r => (
                      <span key={r} className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                        <CheckCircle size={9} />{r} পাস
                      </span>
                    ))}
                    {findings.map(f => (
                      <span key={f.id} className="badge badge-red" style={{ fontSize: '0.7rem' }}>
                        <XCircle size={9} />{f.ruleCode} ব্যর্থ
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Findings */}
            {findings.length > 0 && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700 }}>
                  <AlertTriangle size={14} style={{ display: 'inline', marginRight: 6 }} color="var(--gold)" />
                  চিহ্নিত সমস্যাসমূহ
                </div>
                <div className="card-body">
                  {findings.map(f => <FindingCard key={f.id} finding={f} />)}
                </div>
              </div>
            )}

            {/* Selected parcel summary */}
            {selectedParcel && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}>
                  <CheckCircle size={14} color="var(--green)" style={{ display: 'inline', marginRight: 6 }} />
                  নির্বাচিত দাগের তথ্য
                </div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                    {[
                      { label: 'দাগ নম্বর', val: selectedParcel.dagNumber },
                      { label: 'মৌজা', val: selectedParcel.mouza?.nameBn },
                      { label: 'জরিপ', val: selectedParcel.surveyType },
                      { label: 'পরিমাণ', val: `${selectedParcel.area} শতাংশ` },
                      { label: 'খতিয়ান', val: selectedParcel.currentKhatian },
                      { label: 'জেলা', val: selectedParcel.district?.nameBn },
                    ].map((row, i) => (
                      <div key={i} style={{ background: 'var(--gray-50)', padding: '0.625rem', borderRadius: 8 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontFamily: 'Hind Siliguri, sans-serif' }}>{row.label}</div>
                        <div style={{ fontWeight: 700, fontFamily: 'Hind Siliguri, sans-serif' }}>{row.val || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="alert alert-navy" style={{ marginBottom: '1.5rem' }}>
              <Shield size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.85rem' }}>
                <strong>গুরুত্বপূর্ণ:</strong> এই যাচাই ফলাফল শুধুমাত্র নমুনা ডেটার ভিত্তিতে স্বয়ংক্রিয়ভাবে তৈরি। AI কোনো আইনি বৈধতা নিশ্চিত করতে পারে না। চূড়ান্ত সিদ্ধান্ত একজন অনুমোদিত কর্মকর্তা নেবেন।
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-ghost" onClick={() => navigate('/identify')}><ChevronLeft size={16} />পেছনে</button>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/apply')}>
                নামজারি আবেদন করুন <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
