import { useNavigate } from 'react-router-dom';
import { FileCheck, ChevronLeft, ArrowRight, CheckCircle } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function ReviewPage() {
  const navigate = useNavigate();
  const { extraction, updateExtractionField, setStep, loadDemoScenario } = useAppStore();

  if (!extraction) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--deep)' }}>কোনো দলিল পাওয়া যায়নি</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
          একটি দলিল আপলোড করুন অথবা নমুনা দলিল নির্বাচন করে শুরু করুন।
        </p>
        <button className="btn" onClick={() => { loadDemoScenario(1); }}>
          নমুনা দলিল লোড করুন
        </button>
      </div>
    );
  }

  const f = extraction.fields;
  const getVal = (k: keyof typeof f) => f[k]?.userCorrectedValue ?? f[k]?.value ?? '';

  const handleProceed = () => {
    setStep(3);
    navigate('/identify');
  };

  return (
    <div>
      {/* Workspace Heading */}
      <div className="workspace-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="workspace-symbol">
            <FileCheck size={22} />
          </div>
          <div>
            <h1 className="title">দলিল থেকে পাওয়া তথ্য যাচাই করুন</h1>
            <p className="desc" style={{ margin: 0 }}>
              বাম পাশে নমুনা দলিল, ডানে সম্পাদনাযোগ্য তথ্য। ভুল থাকলে সংশোধন করুন।
            </p>
          </div>
        </div>
        <span className="workspace-label">তথ্য নিশ্চিতকরণ</span>
      </div>

      {/* Stepper */}
      <div className="steps">
        <span className="step">
          <span className="num">✓</span> দলিল
        </span>
        <span className="sep"></span>
        <span className="step current">
          <span className="num">2</span> তথ্য যাচাই
        </span>
        <span className="sep"></span>
        <span className="step">
          <span className="num">3</span> আবেদন
        </span>
      </div>

      {/* Split layout */}
      <div className="split">
        {/* Left: Simulated Deed Paper */}
        <div className="card pad">
          <div className="panel-head">
            <h2>মূল দলিল (ডেমো)</h2>
            <span className="pill">SAMPLE ONLY</span>
          </div>

          <div className="document-toolbar">
            <span>{getVal('deedNumber') || 'DEMO-2026-001'}</span>
            <span>নমুনা · ১ পৃষ্ঠা</span>
          </div>

          <div className="doc-preview">
            <div className="paper">
              <div className="document-ribbon">শুধুমাত্র নমুনা</div>
              <span className="seal">{getVal('surveyType') || 'RS'}</span>
              <h4>নমুনা জমি হস্তান্তর দলিল</h4>
              <small>NOT A REAL LEGAL DOCUMENT</small>

              <div className="faux-text">
                দলিল নম্বর: <b>{getVal('deedNumber')}</b><br />
                রেজিস্ট্রি তারিখ: <b>{getVal('registrationDate')}</b><br />
                রেজিস্ট্রি অফিস: <b>{getVal('registryOffice')}</b><br />
                মৌজা: <b>{getVal('mouza')}</b><br />
                জরিপ: <b>{getVal('surveyType')}</b><br />
                খতিয়ান: <b>{getVal('khatianNumber')}</b><br />
                দাগ: <b>{getVal('dagNumber')}</b><br />
                জমির পরিমাণ: <b>{getVal('landArea')}</b><br />
                দাতা: <b>{getVal('grantor')}</b><br />
                গ্রহীতা: <b>{getVal('grantee')}</b>
                <div className="line"></div>
                <div className="line mid"></div>
                <div className="line small"></div>
              </div>

              <small style={{ display: 'block', marginTop: 16 }}>
                কাল্পনিক তথ্য • Only for the hackathon
              </small>
            </div>
          </div>
        </div>

        {/* Right: Editable Extraction Fields */}
        <div className="card pad">
          <div className="panel-head">
            <div>
              <h2>পূরণ করা তথ্য</h2>
              <p>ডেমো এক্সট্রাকশন • বাস্তব AI সংযুক্ত নয়</p>
            </div>
            <span className="pill">সংশোধনযোগ্য</span>
          </div>

          <div className="fieldgrid">
            <div className="field">
              <label htmlFor="fDeed">
                দলিল নম্বর <span className="confidence">Sample</span>
              </label>
              <input
                id="fDeed"
                value={getVal('deedNumber')}
                onChange={e => updateExtractionField('deedNumber', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="fSurvey">জরিপের ধরন</label>
              <select
                id="fSurvey"
                value={getVal('surveyType')}
                onChange={e => updateExtractionField('surveyType', e.target.value)}
              >
                <option value="RS">RS</option>
                <option value="CS">CS</option>
                <option value="SA">SA</option>
                <option value="BS">BS</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="fMouza">মৌজা</label>
              <input
                id="fMouza"
                value={getVal('mouza')}
                onChange={e => updateExtractionField('mouza', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="fKhatian">খতিয়ান নম্বর</label>
              <input
                id="fKhatian"
                value={getVal('khatianNumber')}
                onChange={e => updateExtractionField('khatianNumber', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="fDag">দাগ নম্বর</label>
              <input
                id="fDag"
                value={getVal('dagNumber')}
                onChange={e => updateExtractionField('dagNumber', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="fArea">বিক্রিত জমির পরিমাণ (শতাংশ)</label>
              <input
                id="fArea"
                type="text"
                value={getVal('landArea')}
                onChange={e => updateExtractionField('landArea', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="fSeller">বিক্রেতা / দাতা</label>
              <input
                id="fSeller"
                value={getVal('grantor')}
                onChange={e => updateExtractionField('grantor', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="fBuyer">ক্রেতা / গ্রহীতা</label>
              <input
                id="fBuyer"
                value={getVal('grantee')}
                onChange={e => updateExtractionField('grantee', e.target.value)}
              />
            </div>
          </div>

          <div className="hintbox">
            <CheckCircle size={16} />
            <div>
              বাস্তব সংস্করণে AI শনাক্ত করা প্রতিটি তথ্য ব্যবহারকারীকে নিশ্চিত করতে হবে।
            </div>
          </div>

          <div className="btn-row">
            <button className="btn" onClick={handleProceed}>
              তথ্য নিশ্চিত করুন → জমি দেখুন <ArrowRight size={14} />
            </button>
            <button className="btn secondary" onClick={() => navigate('/upload')}>
              <ChevronLeft size={14} /> পেছনে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
