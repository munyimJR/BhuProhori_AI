import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Image, X, CheckCircle, AlertTriangle, Loader2, ChevronRight, Star } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import type { UploadedDocument } from '../types';

const DEMO_SCENARIOS = [
  { n: 1, title: 'পরিস্থিতি ১: সঠিক দলিল', desc: 'সব তথ্য মিলে যায়, অনুমোদন প্রবাহ', badge: 'badge-green', badgeText: '✓ বৈধ' },
  { n: 2, title: 'পরিস্থিতি ২: পরিমাণে অমিল', desc: 'দলিলে বেশি পরিমাণ — R01 ত্রুটি', badge: 'badge-red', badgeText: '✕ ত্রুটি' },
  { n: 3, title: 'পরিস্থিতি ৩: ভুল দাগ নম্বর', desc: 'দাগ নম্বর রেকর্ডে নেই — R02 সতর্কতা', badge: 'badge-gold', badgeText: '⚠ সতর্কতা' },
  { n: 4, title: 'পরিস্থিতি ৪: কাগজপত্র নেই', desc: 'প্রয়োজনীয় নথি অনুপস্থিত — R05', badge: 'badge-gold', badgeText: '⚠ সতর্কতা' },
];

export default function UploadPage() {
  const navigate = useNavigate();
  const { setDocument, loadDemoScenario, setStep } = useAppStore();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (f: File) => {
    setError('');
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(f.type)) { setError('শুধুমাত্র PDF, JPG, JPEG এবং PNG ফাইল সমর্থিত।'); return; }
    if (f.size > 10 * 1024 * 1024) { setError('ফাইলের আকার সর্বোচ্চ ১০ MB হতে পারে।'); return; }

    setFile(f);
    const url = URL.createObjectURL(f);
    setFileUrl(url);
    setUploading(true);

    // Simulate upload + OCR processing
    await new Promise(r => setTimeout(r, 2000));

    const ext = f.name.split('.').pop()?.toLowerCase() as UploadedDocument['fileType'];
    const doc: UploadedDocument = {
      id: `doc-upload-${Date.now()}`,
      filename: f.name,
      fileType: ext || 'pdf',
      fileSize: f.size,
      uploadedAt: new Date().toISOString(),
      status: 'ready',
      previewUrl: url,
      source: 'upload',
    };
    setDocument(doc);
    setUploading(false);
  }, [setDocument]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, [processFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleContinue = () => { setStep(2); navigate('/review'); };
  const handleDemo = (n: number) => { loadDemoScenario(n); navigate('/review'); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--page-bg)', padding: '2rem 0' }}>
      <div className="container-sm">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="demo-banner" style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
            <Star size={12} />নমুনা প্রদর্শনী
          </div>
          <h1 style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '1.875rem', marginBottom: '0.5rem' }}>
            দলিল আপলোড করুন
          </h1>
          <p style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif' }}>
            আপনার জমির দলিলের ছবি বা PDF আপলোড করুন। AI স্বয়ংক্রিয়ভাবে তথ্য বের করবে।
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem' }}>
          {/* Upload area */}
          <div>
            <div
              className={`upload-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => !file && fileRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              {uploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <Loader2 size={40} color="var(--green)" className="animate-spin" />
                  <div style={{ fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--green)', fontWeight: 600 }}>দলিল প্রক্রিয়া করা হচ্ছে...</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)', fontFamily: 'Hind Siliguri, sans-serif' }}>AI তথ্য পড়ছে, অনুগ্রহ করে অপেক্ষা করুন</div>
                </div>
              ) : file ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle size={48} color="var(--green)" />
                  <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, color: 'var(--green)', fontSize: '1.125rem' }}>
                    দলিল প্রস্তুত!
                  </div>
                  <div style={{ fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                    {file.name} ({(file.size / 1024).toFixed(0)} KB)
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" onClick={e => { e.stopPropagation(); handleContinue(); }}>
                      এগিয়ে যান <ChevronRight size={16} />
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setFile(null); setFileUrl(''); }}>
                      <X size={14} />বাদ দিন
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={32} color="var(--green)" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.375rem' }}>
                      ফাইল টেনে আনুন বা ক্লিক করুন
                    </div>
                    <div style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>
                      PDF, JPG, JPEG, PNG সমর্থিত · সর্বোচ্চ ১০ MB
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: 'var(--gray-400)' }}><FileText size={12} />PDF</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: 'var(--gray-400)' }}><Image size={12} />JPG/PNG</span>
                  </div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} style={{ display: 'none' }} />

            {error && (
              <div className="alert alert-red" style={{ marginTop: '0.75rem' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Preview */}
            {fileUrl && !uploading && (
              <div className="card" style={{ marginTop: '1rem' }}>
                <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.875rem' }}>
                  দলিল পূর্বদর্শন
                </div>
                <div className="card-body" style={{ padding: '0.75rem' }}>
                  {file?.type === 'application/pdf' ? (
                    <iframe src={fileUrl} title="Document preview" style={{ width: '100%', height: 400, border: 'none', borderRadius: 8 }} />
                  ) : (
                    <img src={fileUrl} alt="Document" style={{ width: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 8 }} />
                  )}
                </div>
              </div>
            )}

            <div className="alert alert-navy" style={{ marginTop: '1rem' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.85rem' }}>
                <strong>OCR সীমাবদ্ধতা:</strong> বাংলা হস্তলিখিত OCR পরীক্ষামূলক। তথ্য পড়তে ব্যর্থ হলে আপনি নিজে সংশোধন করতে পারবেন। প্রদর্শনীর জন্য নমুনা দলিল ব্যবহার করুন।
              </div>
            </div>
          </div>

          {/* Demo panel */}
          <div>
            <div className="card">
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={14} color="var(--gold)" />
                <span style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}>নমুনা দলিল ব্যবহার করুন</span>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '0.25rem' }}>
                  OCR ছাড়াই সিস্টেম পরীক্ষা করুন — সব তথ্য কাল্পনিক
                </p>
                {DEMO_SCENARIOS.map(s => (
                  <div key={s.n} style={{ border: '1px solid var(--gray-100)', borderRadius: 10, padding: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    onClick={() => handleDemo(s.n)}
                    onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--green)')}
                    onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--gray-100)')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.875rem' }}>{s.title}</span>
                      <span className={`badge ${s.badge}`} style={{ fontSize: '0.7rem' }}>{s.badgeText}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif' }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
              <div className="card-body">
                <h4 style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem', marginBottom: '0.625rem' }}>কী কী তথ্য বের হবে?</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {['দলিল নম্বর', 'নিবন্ধনের তারিখ', 'মৌজা ও জে.এল. নম্বর', 'দাগ নম্বর', 'খতিয়ান নম্বর', 'জমির পরিমাণ', 'দাতা ও গ্রহীতার নাম'].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--gray-600)', fontFamily: 'Hind Siliguri, sans-serif' }}>
                      <CheckCircle size={12} color="var(--green)" />{f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
