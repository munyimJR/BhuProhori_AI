import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, CheckCircle, Clock, AlertTriangle, XCircle, ChevronRight, Download, FileText } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import type { MutationApplication, MutationStatus } from '../types';

const STATUS_INFO: Record<MutationStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: 'খসড়া', color: 'var(--gray-400)', icon: <Clock size={14} /> },
  submitted: { label: 'আবেদন জমা হয়েছে', color: '#0369A1', icon: <CheckCircle size={14} /> },
  under_verification: { label: 'যাচাই চলছে', color: '#7C3AED', icon: <Clock size={14} /> },
  officer_review: { label: 'কর্মকর্তার পর্যালোচনাধীন', color: 'var(--gold)', icon: <AlertTriangle size={14} /> },
  clarification_required: { label: 'অতিরিক্ত তথ্য প্রয়োজন', color: '#D97706', icon: <AlertTriangle size={14} /> },
  additional_evidence_submitted: { label: 'অতিরিক্ত প্রমাণ জমা হয়েছে', color: '#0369A1', icon: <CheckCircle size={14} /> },
  field_verification_requested: { label: 'মাঠ যাচাই চাওয়া হয়েছে', color: 'var(--navy)', icon: <Search size={14} /> },
  hearing_scheduled: { label: 'শুনানির তারিখ নির্ধারিত', color: 'var(--navy)', icon: <Clock size={14} /> },
  approved: { label: 'আবেদন অনুমোদিত', color: 'var(--green)', icon: <CheckCircle size={14} /> },
  rejected: { label: 'আবেদন নামঞ্জুর হয়েছে', color: 'var(--red)', icon: <XCircle size={14} /> },
};

function ApplicationCard({ app }: { app: MutationApplication }) {
  const navigate = useNavigate();
  const si = STATUS_INFO[app.status];
  return (
    <div className="card" style={{ cursor: 'pointer', marginBottom: '0.875rem' }} onClick={() => navigate(`/track/${app.id}`)}>
      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
              {app.id}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif' }}>
              আবেদনকারী: {app.applicantNameBn} · দাগ: {app.dagNumber}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, color: si.color }}>
              {si.icon}{si.label}
            </span>
            <ChevronRight size={14} color="var(--gray-300)" />
          </div>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--gray-400)', fontFamily: 'Hind Siliguri, sans-serif' }}>
          {new Date(app.updatedAt).toLocaleDateString('bn-BD')} · {app.mouza?.nameBn} · {app.transferArea} শতাংশ
        </div>
      </div>
    </div>
  );
}

function ApplicationDetail({ app }: { app: MutationApplication }) {
  const { submitApplication, updateApplicationStatus } = useAppStore();
  const si = STATUS_INFO[app.status];
  const [clarNote, setClarNote] = useState('');

  const generateReport = () => {
    const content = `
ভূপ্রহরী AI — নামজারি যাচাই প্রতিবেদন
======================================
SAMPLE / DEMONSTRATION ONLY — NOT A GOVERNMENT DOCUMENT
নমুনা প্রতিবেদন — সরকারি নথি নয়

আবেদন নম্বর: ${app.id}
প্রতিবেদন তৈরির তারিখ: ${new Date().toLocaleDateString('bn-BD')}

আবেদনকারী: ${app.applicantNameBn}
দলিল নম্বর: ${app.deedNumber}
দাগ নম্বর: ${app.dagNumber}
মৌজা: ${app.mouza?.nameBn ?? '—'}
জরিপের ধরন: ${app.surveyType}
হস্তান্তর পরিমাণ: ${app.transferArea} শতাংশ
বর্তমান অবস্থা: ${si.label}

যাচাই ফলাফল:
${app.verificationResult?.findings.map(f => `[${f.ruleCode}] ${f.titleBn}: ${f.descriptionBn}`).join('\n') ?? 'কোনো যাচাই রেকর্ড নেই'}

অবস্থার ইতিহাস:
${app.statusHistory.map(h => `${new Date(h.changedAt).toLocaleString('bn-BD')} — ${h.toStatus} — ${h.changedBy}`).join('\n')}

======================================
এটি একটি নমুনা প্রতিবেদন। সরকারি নথি নয়।
সকল তথ্য কাল্পনিক — LandTech Innovation Hackathon 2026
    `;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${app.id}_report.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Status banner */}
      <div style={{ background: si.color + '15', border: `2px solid ${si.color}`, borderRadius: 16, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
        <span style={{ color: si.color }}>{si.icon}</span>
        <div>
          <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: si.color }}>{si.label}</div>
          <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
            আবেদন নম্বর: <strong>{app.id}</strong>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={generateReport}>
          <Download size={14} />প্রতিবেদন
        </button>
      </div>

      {/* Timeline */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}>
          <Clock size={14} style={{ display: 'inline', marginRight: 6 }} />আবেদনের ইতিহাস
        </div>
        <div className="card-body">
          <div className="timeline">
            {app.statusHistory.map((h, i) => {
              const hsi = STATUS_INFO[h.toStatus];
              return (
                <div key={h.id} className="timeline-item">
                  <div className={`timeline-dot ${i === app.statusHistory.length - 1 ? (h.toStatus === 'approved' ? 'done' : h.toStatus === 'rejected' ? 'error' : 'active') : 'done'}`} />
                  <div>
                    <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: hsi?.color }}>
                      {hsi?.label ?? h.toStatus}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif' }}>
                      {new Date(h.changedAt).toLocaleString('bn-BD')} · {h.changedBy}
                    </div>
                    {h.notes && (
                      <div style={{ marginTop: '0.25rem', padding: '0.375rem 0.625rem', background: 'var(--gray-50)', borderRadius: 6, fontSize: '0.8125rem', fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--gray-600)' }}>
                        {h.notes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}>
          <FileText size={14} style={{ display: 'inline', marginRight: 6 }} />আবেদনের বিবরণ
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { label: 'আবেদনকারী', val: app.applicantNameBn },
              { label: 'দলিল নম্বর', val: app.deedNumber },
              { label: 'দাগ নম্বর', val: app.dagNumber },
              { label: 'খতিয়ান নম্বর', val: app.khatianNumber },
              { label: 'মৌজা', val: app.mouza?.nameBn },
              { label: 'জরিপ', val: app.surveyType },
              { label: 'হস্তান্তর পরিমাণ', val: `${app.transferArea} শতাংশ` },
              { label: 'দাতার নাম', val: app.grantorName },
            ].map((row, i) => (
              <div key={i} style={{ background: 'var(--gray-50)', padding: '0.625rem', borderRadius: 8 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontFamily: 'Hind Siliguri, sans-serif' }}>{row.label}</div>
                <div style={{ fontWeight: 600, fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>{row.val || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification findings */}
      {app.verificationResult && app.verificationResult.findings.length > 0 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}>
            <AlertTriangle size={14} color="var(--gold)" style={{ display: 'inline', marginRight: 6 }} />
            যাচাই সমস্যাসমূহ
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {app.verificationResult.findings.map(f => (
              <div key={f.id} className={`severity-${f.severity}`} style={{ borderRadius: 8, padding: '0.75rem' }}>
                <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>[{f.ruleCode}] {f.titleBn}</div>
                <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.8125rem', color: 'var(--gray-600)' }}>{f.descriptionBn}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Draft actions */}
      {app.status === 'draft' && (
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={() => submitApplication(app.id)}>
            <CheckCircle size={16} />আবেদন জমা দিন
          </button>
        </div>
      )}

      {/* Clarification */}
      {app.status === 'clarification_required' && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}>স্পষ্টীকরণ জমা দিন</div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">অতিরিক্ত তথ্য বা ব্যাখ্যা</label>
              <textarea className="form-textarea" value={clarNote} onChange={e => setClarNote(e.target.value)} placeholder="আপনার স্পষ্টীকরণ লিখুন..." />
            </div>
            <button className="btn btn-primary" style={{ marginTop: '0.75rem' }} disabled={!clarNote.trim()}
              onClick={() => updateApplicationStatus(app.id, 'additional_evidence_submitted', clarNote, app.applicantNameBn)}>
              স্পষ্টীকরণ জমা দিন
            </button>
          </div>
        </div>
      )}

      <div className="demo-banner" style={{ marginTop: '1rem' }}>
        SAMPLE / DEMONSTRATION ONLY — নমুনা প্রতিবেদন — সরকারি নথি নয়
      </div>
    </div>
  );
}

export default function TrackPage() {
  const { id } = useParams<{ id?: string }>();
  const { allApplications, getApplication } = useAppStore();
  const [searchId, setSearchId] = useState(id ?? '');
  const [searched, setSearched] = useState(!!id);
  const foundApp = searched ? getApplication(searchId.trim().toUpperCase()) : null;

  const handleSearch = () => setSearched(true);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--page-bg)', padding: '2rem 0' }}>
      <div className="container-sm">
        <h1 style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '1.75rem', marginBottom: '0.5rem' }}>আবেদনের অবস্থা দেখুন</h1>
        <p style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '1.5rem' }}>আবেদন নম্বর দিয়ে আপনার নামজারি আবেদনের বর্তমান অবস্থা জানুন</p>

        {/* Search */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                className="form-input"
                value={searchId}
                onChange={e => { setSearchId(e.target.value); setSearched(false); }}
                placeholder="আবেদন নম্বর লিখুন (যেমন: DEMO-MUT-2026-0001)"
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn btn-primary" onClick={handleSearch}>
                <Search size={16} />খুঁজুন
              </button>
            </div>
            {searched && !foundApp && (
              <div className="alert alert-gold" style={{ marginTop: '0.75rem' }}>
                <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>
                  কোনো আবেদন পাওয়া যায়নি। নিচে নমুনা আবেদনগুলো দেখুন।
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Found application */}
        {searched && foundApp && <ApplicationDetail app={foundApp} />}

        {/* All applications */}
        {!searched || !foundApp ? (
          <div>
            <h2 style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '1.125rem', marginBottom: '1rem' }}>সকল নমুনা আবেদন</h2>
            {allApplications.map(app => <ApplicationCard key={app.id} app={app} />)}
          </div>
        ) : null}
      </div>
    </div>
  );
}
