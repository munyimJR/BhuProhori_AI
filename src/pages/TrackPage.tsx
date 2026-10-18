import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Award, Printer, Home, CheckCircle, Search } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import paddyImage from '../assets/paddy-green-to-gold.png';

export default function TrackPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { allApplications, currentApplication, verificationResult, extraction } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Priority: URL id -> store currentApplication -> first in allApplications
  const app =
    (id ? allApplications.find(a => a.id === id) : null) ||
    currentApplication ||
    allApplications[0];

  const handlePrint = () => {
    window.print();
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
            src={paddyImage}
            alt="সবুজ থেকে সোনালি ধানক্ষেতের কল্পিত দৃশ্য"
            width="1536"
            height="1024"
            style={{ height: 110 }}
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
