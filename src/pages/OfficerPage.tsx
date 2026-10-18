import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Search, Filter, CheckCircle, Clock, AlertTriangle,
  XCircle, ChevronRight, User, FileText, Shield, MapPin, Download, Star
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import type { MutationApplication, MutationStatus } from '../types';

const STATUS_INFO: Record<MutationStatus, { label: string; color: string }> = {
  draft: { label: 'খসড়া', color: 'var(--gray-400)' },
  submitted: { label: 'জমা হয়েছে', color: '#0369A1' },
  under_verification: { label: 'যাচাই চলছে', color: '#7C3AED' },
  officer_review: { label: 'কর্মকর্তার পর্যালোচনায়', color: 'var(--gold)' },
  clarification_required: { label: 'স্পষ্টীকরণ প্রয়োজন', color: '#D97706' },
  additional_evidence_submitted: { label: 'প্রমাণ জমা', color: '#0369A1' },
  field_verification_requested: { label: 'মাঠ যাচাই', color: 'var(--navy)' },
  hearing_scheduled: { label: 'শুনানি নির্ধারিত', color: 'var(--navy)' },
  approved: { label: 'অনুমোদিত', color: 'var(--green)' },
  rejected: { label: 'নামঞ্জুর', color: 'var(--red)' },
};

const NEXT_ACTIONS: Partial<Record<MutationStatus, MutationStatus[]>> = {
  submitted: ['under_verification'],
  under_verification: ['officer_review', 'clarification_required'],
  officer_review: ['approved', 'rejected', 'clarification_required', 'field_verification_requested', 'hearing_scheduled'],
  additional_evidence_submitted: ['officer_review'],
  field_verification_requested: ['officer_review'],
  hearing_scheduled: ['officer_review'],
};

const ACTION_LABELS: Partial<Record<MutationStatus, string>> = {
  under_verification: 'যাচাইয়ে পাঠান',
  officer_review: 'পর্যালোচনায় পাঠান',
  clarification_required: 'স্পষ্টীকরণ চাওয়া',
  field_verification_requested: 'মাঠ যাচাই চাওয়া',
  hearing_scheduled: 'শুনানি নির্ধারণ',
  approved: 'অনুমোদন করুন',
  rejected: 'নামঞ্জুর করুন',
};

export default function OfficerPage() {
  const navigate = useNavigate();
  const { allApplications, updateApplicationStatus, currentRole } = useAppStore();
  const [selected, setSelected] = useState<MutationApplication | null>(null);
  const [filter, setFilter] = useState<'all' | MutationStatus>('all');
  const [searchQ, setSearchQ] = useState('');
  const [decisionNote, setDecisionNote] = useState('');

  if (currentRole !== 'officer') {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <Shield size={48} color="var(--gray-300)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '0.5rem' }}>অনুমোদিত নয়</h2>
        <p style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '1.5rem' }}>
          কর্মকর্তা ড্যাশবোর্ড ব্যবহার করতে কর্মকর্তা মোডে প্রবেশ করুন।
        </p>
        <button className="btn btn-navy" onClick={() => { useAppStore.getState().setRole('officer'); }}>
          <Shield size={16} />কর্মকর্তা মোডে প্রবেশ করুন
        </button>
      </div>
    );
  }

  const apps = allApplications.filter(a => {
    const matchesFilter = filter === 'all' || a.status === filter;
    const matchesSearch = !searchQ || a.id.includes(searchQ.toUpperCase()) || a.applicantNameBn.includes(searchQ) || a.dagNumber.includes(searchQ);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: allApplications.length,
    pending: allApplications.filter(a => ['submitted', 'under_verification'].includes(a.status)).length,
    review: allApplications.filter(a => a.status === 'officer_review').length,
    clarification: allApplications.filter(a => a.status === 'clarification_required').length,
    approved: allApplications.filter(a => a.status === 'approved').length,
    rejected: allApplications.filter(a => a.status === 'rejected').length,
  };

  const handleAction = (status: MutationStatus) => {
    if (!selected) return;
    if (['approved', 'rejected', 'clarification_required'].includes(status) && !decisionNote.trim()) {
      alert('এই সিদ্ধান্তের জন্য কারণ লেখা আবশ্যক।');
      return;
    }
    updateApplicationStatus(selected.id, status, decisionNote, 'কর্মকর্তা মোঃ কামাল হোসেন (নমুনা)');
    setDecisionNote('');
    const updated = useAppStore.getState().getApplication(selected.id);
    if (updated) setSelected(updated);
  };

  const generateReport = (app: MutationApplication) => {
    const content = `
ভূপ্রহরী AI — কর্মকর্তা পর্যালোচনা প্রতিবেদন
=============================================
SAMPLE / DEMONSTRATION ONLY — NOT A GOVERNMENT DOCUMENT
নমুনা প্রতিবেদন — সরকারি নথি নয়

আবেদন নম্বর: ${app.id}
বর্তমান অবস্থা: ${STATUS_INFO[app.status].label}
আবেদনকারী: ${app.applicantNameBn}
দলিল নম্বর: ${app.deedNumber}
দাগ নম্বর: ${app.dagNumber}
হস্তান্তর পরিমাণ: ${app.transferArea} শতাংশ

অফিসার নোট: ${app.officerNotes ?? 'নেই'}
সিদ্ধান্তের কারণ: ${app.officerDecisionReason ?? 'নেই'}

যাচাই ফলাফল:
${app.verificationResult?.findings.map(f => `[${f.ruleCode}] ${f.severity.toUpperCase()}: ${f.titleBn}`).join('\n') ?? 'কোনো রেকর্ড নেই'}

=============================================
LandTech Innovation Hackathon 2026 — নমুনা
    `;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `officer_report_${app.id}.txt`; a.click();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--page-bg)' }}>
      {/* Officer header */}
      <div style={{ background: 'var(--navy)', padding: '1.25rem 0', marginBottom: '1.5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>কর্মকর্তা ড্যাশবোর্ড</div>
              <h1 style={{ color: 'white', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '1.375rem', margin: 0 }}>
                <LayoutDashboard size={18} style={{ display: 'inline', marginRight: 8 }} />
                নামজারি আবেদন ব্যবস্থাপনা
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="badge badge-demo"><Star size={10} />নমুনা কর্মকর্তা: মোঃ কামাল হোসেন</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'মোট আবেদন', val: stats.total, color: 'var(--navy)', icon: <FileText size={16} /> },
            { label: 'অপেক্ষমান', val: stats.pending, color: '#7C3AED', icon: <Clock size={16} /> },
            { label: 'পর্যালোচনায়', val: stats.review, color: 'var(--gold)', icon: <AlertTriangle size={16} /> },
            { label: 'স্পষ্টীকরণ', val: stats.clarification, color: '#D97706', icon: <AlertTriangle size={16} /> },
            { label: 'অনুমোদিত', val: stats.approved, color: 'var(--green)', icon: <CheckCircle size={16} /> },
            { label: 'নামঞ্জুর', val: stats.rejected, color: 'var(--red)', icon: <XCircle size={16} /> },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.375rem', color: s.color }}>
                {s.icon}
                <span style={{ fontSize: '0.75rem', fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--gray-500)' }}>{s.label}</span>
              </div>
              <div className="stat-number" style={{ color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
          {/* Application list */}
          <div>
            {/* Search & Filter */}
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-body" style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input className="form-input" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="আবেদন নম্বর, নাম বা দাগ খুঁজুন..." style={{ paddingLeft: 32 }} />
                </div>
                <select className="form-select" value={filter} onChange={e => setFilter(e.target.value as typeof filter)} style={{ width: 180 }}>
                  <option value="all">সব অবস্থা</option>
                  {Object.entries(STATUS_INFO).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>

            {apps.length === 0 ? (
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
                  <Filter size={32} color="var(--gray-300)" style={{ margin: '0 auto 0.75rem' }} />
                  <div style={{ fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--gray-400)' }}>কোনো আবেদন পাওয়া যায়নি</div>
                </div>
              </div>
            ) : (
              apps.map(app => {
                const si = STATUS_INFO[app.status];
                const isSelected = selected?.id === app.id;
                const hasFindings = (app.verificationResult?.findings.length ?? 0) > 0;
                return (
                  <div
                    key={app.id}
                    className="card"
                    style={{ marginBottom: '0.75rem', cursor: 'pointer', border: isSelected ? '2px solid var(--green)' : undefined }}
                    onClick={() => setSelected(isSelected ? null : app)}
                  >
                    <div className="card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, marginBottom: '0.125rem' }}>{app.id}</div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif' }}>
                            {app.applicantNameBn} · দাগ {app.dagNumber} · {app.transferArea} শতাংশ
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                          {hasFindings && <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}><AlertTriangle size={9} />{app.verificationResult!.findings.length}</span>}
                          <span className="badge" style={{ background: si.color + '15', color: si.color, fontSize: '0.75rem' }}>{si.label}</span>
                          <ChevronRight size={14} color="var(--gray-300)" />
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontFamily: 'Hind Siliguri, sans-serif', marginTop: '0.25rem' }}>
                        {new Date(app.updatedAt).toLocaleDateString('bn-BD')} · {app.mouza?.nameBn ?? '—'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="animate-slide-in">
              <div className="card" style={{ position: 'sticky', top: 80 }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '0.9375rem' }}>
                    {selected.id}
                  </span>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => generateReport(selected)}><Download size={12} /></button>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/track/${selected.id}`)}><ChevronRight size={12} /></button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
                  </div>
                </div>
                <div className="card-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                  {/* Applicant */}
                  <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User size={18} color="var(--green)" />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700 }}>{selected.applicantNameBn}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif' }}>{selected.applicantPhone}</div>
                    </div>
                  </div>

                  {/* Key info */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                    {[
                      { label: 'দলিল', val: selected.deedNumber },
                      { label: 'দাগ', val: selected.dagNumber },
                      { label: 'মৌজা', val: selected.mouza?.nameBn },
                      { label: 'পরিমাণ', val: `${selected.transferArea} শতাংশ` },
                      { label: 'জরিপ', val: selected.surveyType },
                      { label: 'দাতা', val: selected.grantorName },
                    ].map((r, i) => (
                      <div key={i} style={{ background: 'var(--gray-50)', padding: '0.5rem', borderRadius: 6 }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', fontFamily: 'Hind Siliguri, sans-serif' }}>{r.label}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.8125rem', fontFamily: 'Hind Siliguri, sans-serif' }}>{r.val || '—'}</div>
                      </div>
                    ))}
                  </div>

                  {/* Parcel location */}
                  {selected.parcel?.geometry?.centroid && (
                    <div style={{ background: 'var(--mint)', borderRadius: 8, padding: '0.625rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <MapPin size={14} color="var(--green)" />
                      <span style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.8rem', color: 'var(--green)' }}>
                        দাগ মানচিত্রে চিহ্নিত আছে · {selected.parcel.geometry.centroid[0].toFixed(4)}°N, {selected.parcel.geometry.centroid[1].toFixed(4)}°E
                      </span>
                    </div>
                  )}

                  {/* Verification findings */}
                  {selected.verificationResult && selected.verificationResult.findings.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        <AlertTriangle size={12} color="var(--gold)" style={{ display: 'inline', marginRight: 4 }} />
                        যাচাই সমস্যা ({selected.verificationResult.findings.length}টি)
                      </div>
                      {selected.verificationResult.findings.map(f => (
                        <div key={f.id} className={`severity-${f.severity}`} style={{ borderRadius: 6, padding: '0.5rem 0.625rem', marginBottom: '0.375rem' }}>
                          <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.8rem' }}>[{f.ruleCode}] {f.titleBn}</div>
                          <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.75rem', color: 'var(--gray-600)' }}>{f.descriptionBn}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Status history */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>অবস্থার ইতিহাস</div>
                    <div className="timeline">
                      {selected.statusHistory.slice(-4).map((h, i) => {
                        const hsi = STATUS_INFO[h.toStatus];
                        return (
                          <div key={h.id} className="timeline-item">
                            <div className={`timeline-dot ${i === Math.min(selected.statusHistory.length, 4) - 1 ? 'active' : 'done'}`} />
                            <div>
                              <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: hsi?.color }}>{hsi?.label}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', fontFamily: 'Hind Siliguri, sans-serif' }}>{h.changedBy}</div>
                              {h.notes && <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', fontFamily: 'Hind Siliguri, sans-serif', marginTop: '0.125rem' }}>{h.notes}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Officer actions */}
                  {NEXT_ACTIONS[selected.status] && (
                    <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '1rem' }}>
                      <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.625rem' }}>
                        <Shield size={12} style={{ display: 'inline', marginRight: 4 }} />কর্মকর্তার সিদ্ধান্ত (নমুনা)
                      </div>
                      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>পর্যালোচনার নোট / সিদ্ধান্তের কারণ</label>
                        <textarea className="form-textarea" value={decisionNote} onChange={e => setDecisionNote(e.target.value)} rows={3} placeholder="সিদ্ধান্তের কারণ বা পর্যালোচনার মন্তব্য লিখুন..." style={{ fontSize: '0.85rem' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {NEXT_ACTIONS[selected.status]?.map(action => (
                          <button
                            key={action}
                            className={`btn btn-sm ${action === 'approved' ? 'btn-primary' : action === 'rejected' ? 'btn-danger' : 'btn-secondary'}`}
                            onClick={() => handleAction(action)}
                          >
                            {action === 'approved' && <CheckCircle size={12} />}
                            {action === 'rejected' && <XCircle size={12} />}
                            {ACTION_LABELS[action] ?? action}
                          </button>
                        ))}
                      </div>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--gray-400)', fontFamily: 'Hind Siliguri, sans-serif' }}>
                        অনুমোদন/নামঞ্জুর করতে কারণ লেখা আবশ্যক
                      </div>
                    </div>
                  )}

                  <div className="demo-banner" style={{ marginTop: '0.75rem', fontSize: '0.7rem' }}>
                    SAMPLE — নমুনা কর্মকর্তা সিদ্ধান্ত — সরকারি নয়
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
