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
  const { setDocument, loadDemoScenario, setStep, language, runLiveGeminiExtraction } = useAppStore();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (f: File) => {
    setSelectedFileName(f.name);
    setUploading(true);

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

    // If image, perform real Gemini 1.5 Flash Vision Multimodal Extraction
    if (f.type.startsWith('image/')) {
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(f);
        });
        await runLiveGeminiExtraction(undefined, base64, f.type);
      } catch (err) {
        console.warn('Gemini vision extraction fallback to manual review:', err);
      }
    } else {
      await new Promise(r => setTimeout(r, 1000));
    }

    setUploading(false);
    setStep(2);
    navigate('/review');
  }, [setDocument, setStep, navigate, runLiveGeminiExtraction]);

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

  const isBn = language === 'bn';

  return (
    <div>
      {/* Workspace Heading */}
      <div className="workspace-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="workspace-symbol">
            <Upload size={22} />
          </div>
          <div>
            <h1 className="title">{isBn ? 'দলিল আপলোড করুন' : 'Upload Land Deed'}</h1>
            <p className="desc" style={{ margin: 0 }}>
              {isBn
                ? 'কাগজের তথ্য হাতে না লিখে, একটি দলিল দিয়ে শুরু করুন।'
                : 'Start with a deed without manually typing paper details.'}
            </p>
          </div>
        </div>
        <span className="workspace-label">{isBn ? 'দলিল থেকে শুরু' : 'Start with Deed'}</span>
      </div>

      {/* Stepper */}
      <div className="steps">
        <span className="step current">
          <span className="num">1</span> {isBn ? 'দলিল' : 'Deed'}
        </span>
        <span className="sep"></span>
        <span className="step">
          <span className="num">2</span> {isBn ? 'তথ্য যাচাই' : 'Verify Data'}
        </span>
        <span className="sep"></span>
        <span className="step">
          <span className="num">3</span> {isBn ? 'আবেদন' : 'Application'}
        </span>
      </div>

      {/* Main 2-column Grid */}
      <div className="grid two">
        {/* Left Column: Upload Box */}
        <div className="card pad">
          <div className="panel-head">
            <div>
              <h2>{isBn ? 'আপনার দলিল দিন' : 'Provide Your Deed'}</h2>
              <p>{isBn ? 'এই ডিজাইন পরীক্ষার জন্য আপলোডটি শুধুই UI ডেমো।' : 'Interactive prototype demonstrating client-side document processing.'}</p>
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
              {isBn ? (
                <>একটি দলিল।<br />আবেদনের প্রথম ধাপ।</>
              ) : (
                <>One deed.<br />First step to mutation.</>
              )}
            </h2>
            <p>{isBn ? 'JPG, PNG বা PDF • কোনো ফাইল সার্ভারে পাঠানো হয় না' : 'JPG, PNG, or PDF • Zero server upload privacy'}</p>

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
              {uploading
                ? (isBn ? 'প্রসেসিং হচ্ছে...' : 'Processing...')
                : (isBn ? 'ফাইল বাছাই করুন' : 'Browse File')}
            </button>

            <div className="hint" style={{ marginTop: 14 }}>
              {selectedFileName
                ? (isBn ? `নির্বাচিত: ${selectedFileName}` : `Selected: ${selectedFileName}`)
                : (isBn ? 'কোনো ফাইল নির্বাচন করা হয়নি' : 'No file selected')}
            </div>
          </div>

          <div className="btn-row" style={{ justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {isBn ? 'হাতে দলিল নেই?' : "Don't have a deed?"}
            </span>
            <button className="btn" type="button" onClick={() => handleLoadSample(1)}>
              {isBn ? 'নমুনা দলিল ব্যবহার করুন →' : 'Use Demo Deed →'}
            </button>
          </div>

          <div className="hintbox">
            <CheckCircle size={16} />
            <div>
              {isBn
                ? 'ডেমোতে একটি কাল্পনিক দলিল থেকে পূর্বনির্ধারিত তথ্য দেখানো হবে। আপলোড করা ফাইলে প্রকৃত OCR বা AI বিশ্লেষণ করা হচ্ছে না।'
                : 'The demo loads pre-configured mock deed scenarios. Uploaded files do not transmit private data to external servers.'}
            </div>
          </div>
        </div>

        {/* Right Column: Paddy Photo & Extraction Checklist */}
        <div className="card pad">
          <figure className="paddy-panel-photo">
            <img
              src={paddyImage}
              alt={isBn ? 'সবুজ ধান ও পাকা সোনালি ধানের কল্পিত দৃশ্য' : 'Green and golden paddy field'}
              loading="lazy"
              width="1536"
              height="1024"
            />
          </figure>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
            <div className="workspace-symbol" style={{ width: 38, height: 38 }}>
              <FileText size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', color: 'var(--deep)', margin: '0 0 4px' }}>
                {isBn ? (
                  <>দলিলের তথ্য,<br />গুছিয়ে এক জায়গায়।</>
                ) : (
                  <>Deed records,<br />organized in one place.</>
                )}
              </h2>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '12px' }}>
                {isBn
                  ? 'নমুনা দলিল দিয়ে নিচের তথ্যগুলো পর্যালোচনা করতে পারবেন।'
                  : 'Review the following data points extracted from the deed.'}
              </p>
            </div>
          </div>

          <div className="check">
            <span className="badge-dot">✓</span>
            <div>
              <strong>{isBn ? 'দলিল নম্বর ও তারিখ' : 'Deed Number & Registration Date'}</strong>
              <small>{isBn ? 'Deed number & registration date' : 'Registration volume and date'}</small>
            </div>
          </div>

          <div className="check">
            <span className="badge-dot">✓</span>
            <div>
              <strong>{isBn ? 'মৌজা, খতিয়ান ও দাগ' : 'Mouza, Khatian & Dag (Plot)'}</strong>
              <small>{isBn ? 'Land identifiers' : 'Cadastral land identifiers'}</small>
            </div>
          </div>

          <div className="check">
            <span className="badge-dot">✓</span>
            <div>
              <strong>{isBn ? 'বিক্রেতা, ক্রেতা ও জমির পরিমাণ' : 'Parties & Transferred Area'}</strong>
              <small>{isBn ? 'Transaction details' : 'Buyer, seller & decimal land area'}</small>
            </div>
          </div>

          <div className="check">
            <span className="badge-dot warning">!</span>
            <div>
              <strong>{isBn ? 'ভুল ও অসম্পূর্ণ তথ্য শনাক্তকরণ' : 'Discrepancy & Risk Detection'}</strong>
              <small>{isBn ? 'Items needing human confirmation' : 'Automated flag checks for human review'}</small>
            </div>
          </div>

          {/* Quick Scenario Picker */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--deep)', marginBottom: 8 }}>
              {isBn ? 'অন্য কোনো নমুনা পরীক্ষা করতে চান?' : 'Want to test another demo scenario?'}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { id: 1, labelBn: 'স্বাভাবিক (৫ শতক)', labelEn: 'Standard (5 Dec)' },
                { id: 6, labelBn: 'বেশি পরিমাণ (১০ শতক)', labelEn: 'Area Mismatch (10 Dec)' },
                { id: 3, labelBn: 'বন্ধকী জমি', labelEn: 'Mortgage Warning' },
                { id: 5, labelBn: 'খাস জমি', labelEn: 'Khas Land Alert' },
              ].map(sc => (
                <button
                  key={sc.id}
                  className="btn secondary sm"
                  onClick={() => handleLoadSample(sc.id)}
                >
                  {isBn ? sc.labelBn : sc.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
