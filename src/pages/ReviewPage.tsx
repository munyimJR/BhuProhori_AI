import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, AlertTriangle, CheckCircle, Edit3, Info, FileText } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import type { DeedExtraction } from '../types';

const FIELD_ORDER: Array<keyof DeedExtraction['fields']> = [
  'deedNumber', 'registrationDate', 'registryOffice', 'district', 'upazila',
  'mouza', 'jlNumber', 'surveyType', 'khatianNumber', 'dagNumber', 'landArea', 'grantor', 'grantee',
];

const SURVEY_OPTIONS = ['BS', 'SA', 'CS', 'RS', 'BRS'];

function ConfidenceDot({ confidence }: { confidence?: number }) {
  const c = confidence ?? 0;
  const color = c >= 0.9 ? 'var(--green)' : c >= 0.7 ? 'var(--gold)' : 'var(--red)';
  return (
    <span title={`Confidence: ${Math.round(c * 100)}%`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {Math.round(c * 100)}%
    </span>
  );
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const { extraction, document, updateExtractionField, setStep, currentScenario } = useAppStore();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());

  if (!extraction) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
        <h2 style={{ fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '0.5rem' }}>কোনো দলিল পাওয়া যায়নি</h2>
        <p style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '1.5rem' }}>প্রথমে একটি দলিল আপলোড করুন বা নমুনা দলিল নির্বাচন করুন।</p>
        <button className="btn btn-primary" onClick={() => navigate('/upload')}>দলিল আপলোড করুন</button>
      </div>
    );
  }

  const warnings = FIELD_ORDER.filter(k => extraction.fields[k]?.hasWarning);

  const handleConfirmField = (fieldName: string) => {
    setConfirmed(prev => new Set(prev).add(fieldName));
    setEditingField(null);
  };

  const handleProceed = () => { setStep(3); navigate('/identify'); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--page-bg)', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/upload')}>
                <ChevronLeft size={14} />পেছনে
              </button>
              <span style={{ color: 'var(--gray-300)' }}>›</span>
              <span style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem', color: 'var(--gray-500)' }}>AI ফিল্ড পর্যালোচনা</span>
            </div>
            <h1 style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '1.625rem' }}>তথ্য যাচাই ও সংশোধন</h1>
            <p style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>
              AI পড়া তথ্য যাচাই করুন। প্রয়োজনে সংশোধন করুন।
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {document?.source === 'demo' && (
              <span className="badge badge-demo">নমুনা পরিস্থিতি #{currentScenario}</span>
            )}
            {warnings.length > 0 && (
              <span className="badge badge-gold">
                <AlertTriangle size={10} />{warnings.length}টি সতর্কতা
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
          {/* Left: Document preview */}
          <div>
            <div className="card" style={{ position: 'sticky', top: 80 }}>
              <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.875rem' }}>
                <FileText size={14} style={{ display: 'inline', marginRight: 6 }} />
                আপলোডকৃত দলিল
              </div>
              <div className="card-body" style={{ padding: '0.75rem' }}>
                {document?.previewUrl ? (
                  document.fileType === 'pdf' ? (
                    <iframe src={document.previewUrl} title="Deed" style={{ width: '100%', height: 420, border: 'none', borderRadius: 8 }} />
                  ) : (
                    <img src={document.previewUrl} alt="Deed" style={{ width: '100%', maxHeight: 420, objectFit: 'contain', borderRadius: 8 }} />
                  )
                ) : (
                  <div style={{ height: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', borderRadius: 8, gap: '0.75rem' }}>
                    <FileText size={48} color="var(--gray-300)" />
                    <div style={{ fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--gray-400)', fontSize: '0.875rem', textAlign: 'center' }}>
                      {document?.filename ?? 'নমুনা দলিল'}<br />
                      <span style={{ fontSize: '0.75rem' }}>পূর্বদর্শন পাওয়া যাচ্ছে না</span>
                    </div>
                  </div>
                )}
                <div className="demo-banner" style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>
                  নমুনা/প্রদর্শনী — সরকারি নথি নয়
                </div>
              </div>
            </div>
          </div>

          {/* Right: Fields */}
          <div>
            {warnings.length > 0 && (
              <div className="alert alert-gold" style={{ marginBottom: '1rem' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <div style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                  <strong>{warnings.length}টি ক্ষেত্রে সতর্কতা পাওয়া গেছে।</strong> লাল/হলুদ চিহ্নিত ক্ষেত্রগুলো পর্যালোচনা করুন।
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '0.9375rem' }}>
                  AI-পড়া তথ্য
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-green"><CheckCircle size={10} />{confirmed.size} নিশ্চিত</span>
                  {warnings.length > 0 && <span className="badge badge-gold"><AlertTriangle size={10} />{warnings.length} সতর্কতা</span>}
                </div>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {FIELD_ORDER.map(fieldKey => {
                    const field = extraction.fields[fieldKey];
                    if (!field) return null;
                    const isConfirmed = confirmed.has(fieldKey);
                    const isEditing = editingField === fieldKey;
                    const displayValue = field.userCorrectedValue ?? field.value;

                    return (
                      <div key={fieldKey} style={{
                        padding: '0.875rem',
                        borderRadius: 10,
                        border: `1.5px solid ${field.hasWarning ? 'var(--gold)' : isConfirmed ? 'var(--green)' : 'var(--gray-100)'}`,
                        background: field.hasWarning ? 'var(--gold-bg)' : isConfirmed ? 'var(--mint)' : 'var(--white)',
                        transition: 'all 0.2s',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                          <label className="form-label" style={{ margin: 0, fontSize: '0.75rem' }}>{field.fieldNameBn}</label>
                          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                            {field.confidence !== undefined && <ConfidenceDot confidence={field.confidence} />}
                            <span className={`badge ${field.source === 'demo' ? 'badge-blue' : field.source === 'manual' ? 'badge-navy' : 'badge-gray'}`} style={{ fontSize: '0.65rem' }}>
                              {field.source === 'demo' ? 'নমুনা' : field.source === 'manual' ? 'সংশোধিত' : 'OCR'}
                            </span>
                          </div>
                        </div>

                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '0.375rem' }}>
                            {fieldKey === 'surveyType' ? (
                              <select
                                className="form-select"
                                defaultValue={displayValue}
                                onChange={e => updateExtractionField(fieldKey, e.target.value)}
                                style={{ fontSize: '0.875rem', padding: '0.375rem 0.5rem' }}
                              >
                                {SURVEY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                              </select>
                            ) : (
                              <input
                                className="form-input"
                                defaultValue={displayValue}
                                onChange={e => updateExtractionField(fieldKey, e.target.value)}
                                style={{ fontSize: '0.875rem', padding: '0.375rem 0.5rem' }}
                                autoFocus
                              />
                            )}
                            <button className="btn btn-primary btn-sm" onClick={() => handleConfirmField(fieldKey)}>✓</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{
                              fontFamily: 'Hind Siliguri, sans-serif',
                              fontSize: '0.9375rem',
                              fontWeight: 600,
                              color: field.hasWarning ? 'var(--gold)' : 'var(--dark)',
                              flex: 1,
                              wordBreak: 'break-word',
                            }}>
                              {displayValue || <em style={{ color: 'var(--gray-400)', fontWeight: 400 }}>পাওয়া যায়নি</em>}
                            </span>
                            <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                              <button className="btn btn-ghost btn-sm" style={{ padding: '0.2rem 0.4rem' }} onClick={() => setEditingField(fieldKey)} title="সংশোধন করুন">
                                <Edit3 size={12} />
                              </button>
                              <button className="btn btn-sm" onClick={() => handleConfirmField(fieldKey)} style={{ padding: '0.2rem 0.4rem', background: isConfirmed ? 'var(--mint)' : 'var(--gray-100)', color: isConfirmed ? 'var(--green)' : 'var(--gray-500)', border: 'none' }} title="নিশ্চিত করুন">
                                <CheckCircle size={12} />
                              </button>
                            </div>
                          </div>
                        )}

                        {field.hasWarning && !isEditing && (
                          <div style={{ marginTop: '0.375rem', display: 'flex', gap: '0.25rem', alignItems: 'flex-start' }}>
                            <AlertTriangle size={11} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontFamily: 'Hind Siliguri, sans-serif' }}>{field.warningMessage}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Info box */}
            <div className="alert alert-blue" style={{ marginTop: '1rem' }}>
              <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.85rem' }}>
                <strong>গুরুত্বপূর্ণ:</strong> এই তথ্য স্বয়ংক্রিয়ভাবে পড়া হয়েছে এবং প্রাথমিক পর্যায়ে রয়েছে। চূড়ান্ত মালিকানার প্রমাণ হিসেবে গণ্য করা যাবে না। তথ্য নিশ্চিত করুন এবং এগিয়ে যান।
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <button className="btn btn-ghost" onClick={() => navigate('/upload')}>
                <ChevronLeft size={16} />পেছনে
              </button>
              <button className="btn btn-primary btn-lg" onClick={handleProceed}>
                তথ্য নিশ্চিত করে এগিয়ে যান <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
