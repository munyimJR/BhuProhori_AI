import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, FileText, CheckCircle, Loader2
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import type { UploadedDocument } from '../types';
import paddyImage from '../assets/paddy-green-to-gold.png';

export default function UploadPage() {
  const navigate = useNavigate();
  const { setDocument, loadDemoScenario, setStep } = useAppStore();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (f: File) => {
    setSelectedFileName(f.name);
    setUploading(true);

    // Simulate OCR processing time
    await new Promise(r => setTimeout(r, 1500));

    const ext = f.name.split('.').pop()?.toLowerCase() as UploadedDocument['fileType'];
    const doc: UploadedDocument = {
      id: `doc-upload-${Date.now()}`,
      filename: f.name,
      fileType: ext || 'pdf',
      fileSize: f.size,
      uploadedAt: new Date().toISOString(),
      status: 'ready',
      previewUrl: URL.createObjectURL(f),
      source: 'upload',
    };
    setDocument(doc);
    setUploading(false);
    setStep(2);
    navigate('/review');
  }, [setDocument, setStep, navigate]);

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

  const handleLoadSample = (scenario = 1) => {
    loadDemoScenario(scenario);
    setStep(2);
    navigate('/review');
  };

  return (
    <div>
      {/* Workspace Heading */}
      <div className="workspace-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="workspace-symbol">
            <Upload size={22} />
          </div>
          <div>
            <h1 className="title">দলিল আপলোড করুন</h1>
            <p className="desc" style={{ margin: 0 }}>
              কাগজের তথ্য হাতে না লিখে, একটি দলিল দিয়ে শুরু করুন।
            </p>
          </div>
        </div>
        <span className="workspace-label">দলিল থেকে শুরু</span>
      </div>

      {/* Stepper */}
      <div className="steps">
        <span className="step current">
          <span className="num">1</span> দলিল
        </span>
        <span className="sep"></span>
        <span className="step">
          <span className="num">2</span> তথ্য যাচাই
        </span>
        <span className="sep"></span>
        <span className="step">
          <span className="num">3</span> আবেদন
        </span>
      </div>

      {/* Main 2-column Grid */}
      <div className="grid two">
        {/* Left Column: Upload Box */}
        <div className="card pad">
          <div className="panel-head">
            <div>
              <h2>আপনার দলিল দিন</h2>
              <p>এই ডিজাইন পরীক্ষার জন্য আপলোডটি শুধুই UI ডেমো।</p>
            </div>
          </div>

          <div
            className={`upload-box ${dragActive ? 'drag-active' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <div className="upload-format">
              <span>PDF</span>
              <span>JPG</span>
              <span>PNG</span>
            </div>

            <div className="up-icon">
              {uploading ? (
                <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto', display: 'block' }} />
              ) : (
                <FileText size={36} style={{ margin: '0 auto', display: 'block' }} />
              )}
            </div>

            <h2>
              একটি দলিল।<br />
              আবেদনের প্রথম ধাপ।
            </h2>
            <p>JPG, PNG বা PDF • কোনো ফাইল সার্ভারে পাঠানো হয় না</p>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              hidden
              onChange={handleFileChange}
            />

            <button
              className="btn secondary"
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? 'প্রসেসিং হচ্ছে...' : 'ফাইল বাছাই করুন'}
            </button>

            <div className="hint" style={{ marginTop: 14 }}>
              {selectedFileName ? `নির্বাচিত: ${selectedFileName}` : 'কোনো ফাইল নির্বাচন করা হয়নি'}
            </div>
          </div>

          <div className="btn-row" style={{ justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>হাতে দলিল নেই?</span>
            <button className="btn" type="button" onClick={() => handleLoadSample(1)}>
              নমুনা দলিল ব্যবহার করুন →
            </button>
          </div>

          <div className="hintbox">
            <CheckCircle size={16} />
            <div>
              ডেমোতে একটি কাল্পনিক দলিল থেকে পূর্বনির্ধারিত তথ্য দেখানো হবে। আপলোড করা ফাইলে প্রকৃত OCR বা AI বিশ্লেষণ করা হচ্ছে না।
            </div>
          </div>
        </div>

        {/* Right Column: Paddy Photo & Extraction Checklist */}
        <div className="card pad">
          <figure className="paddy-panel-photo">
            <img
              src={paddyImage}
              alt="সবুজ ধান ও পাকা সোনালি ধানের কল্পিত দৃশ্য"
              loading="lazy"
              width="1536"
              height="1024"
            />
            <figcaption>মাটির সঙ্গে সম্পর্ক, তথ্যের সঙ্গে আস্থা।</figcaption>
          </figure>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
            <div className="workspace-symbol" style={{ width: 38, height: 38 }}>
              <FileText size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', color: 'var(--deep)', margin: '0 0 4px' }}>
                দলিলের তথ্য,<br />গুছিয়ে এক জায়গায়।
              </h2>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '12px' }}>
                নমুনা দলিল দিয়ে নিচের তথ্যগুলো পর্যালোচনা করতে পারবেন।
              </p>
            </div>
          </div>

          <div className="check">
            <span className="badge-dot">✓</span>
            <div>
              <strong>দলিল নম্বর ও তারিখ</strong>
              <small>Deed number & registration date</small>
            </div>
          </div>

          <div className="check">
            <span className="badge-dot">✓</span>
            <div>
              <strong>মৌজা, খতিয়ান ও দাগ</strong>
              <small>Land identifiers</small>
            </div>
          </div>

          <div className="check">
            <span className="badge-dot">✓</span>
            <div>
              <strong>বিক্রেতা, ক্রেতা ও জমির পরিমাণ</strong>
              <small>Transaction details</small>
            </div>
          </div>

          <div className="check">
            <span className="badge-dot warning">!</span>
            <div>
              <strong>ভুল ও অসম্পূর্ণ তথ্য শনাক্তকরণ</strong>
              <small>Items needing human confirmation</small>
            </div>
          </div>

          {/* Quick Scenario Picker */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--deep)', marginBottom: 8 }}>
              অন্য কোনো নমুনা পরীক্ষা করতে চান?
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { id: 1, label: 'স্বাভাবিক (৫ শতক)' },
                { id: 6, label: 'বেশি পরিমাণ (১০ শতক)' },
                { id: 3, label: 'বন্ধকী জমি' },
                { id: 5, label: 'খাস জমি' },
              ].map(sc => (
                <button
                  key={sc.id}
                  className="btn secondary sm"
                  onClick={() => handleLoadSample(sc.id)}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
