import { useNavigate } from 'react-router-dom';
import { FileCheck, ChevronLeft, ArrowRight, CheckCircle } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function ReviewPage() {
  const navigate = useNavigate();
  const { extraction, updateExtractionField, setStep, loadDemoScenario, language } = useAppStore();
  const isBn = language === 'bn';

  if (!extraction) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--deep)' }}>
          {isBn ? 'কোনো দলিল পাওয়া যায়নি' : 'No Deed Document Found'}
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
          {isBn
            ? 'একটি দলিল আপলোড করুন অথবা নমুনা দলিল নির্বাচন করে শুরু করুন।'
            : 'Upload a deed document or select a demo scenario to begin.'}
        </p>
        <button className="btn" onClick={() => { loadDemoScenario(1); }}>
          {isBn ? 'নমুনা দলিল লোড করুন' : 'Load Demo Deed'}
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
            <h1 className="title">
              {isBn ? 'দলিল থেকে পাওয়া তথ্য যাচাই করুন' : 'Verify Extracted Deed Data'}
            </h1>
            <p className="desc" style={{ margin: 0 }}>
              {isBn
                ? 'বাম পাশে নমুনা দলিল, ডানে সম্পাদনাযোগ্য তথ্য। ভুল থাকলে সংশোধন করুন।'
                : 'Sample deed on left, editable extracted data on right. Edit if needed.'}
            </p>
          </div>
        </div>
        <span className="workspace-label">
          {isBn ? 'তথ্য নিশ্চিতকরণ' : 'Data Confirmation'}
        </span>
      </div>

      {/* Stepper */}
      <div className="steps">
        <span className="step">
          <span className="num">✓</span> {isBn ? 'দলিল' : 'Deed'}
        </span>
        <span className="sep"></span>
        <span className="step current">
          <span className="num">2</span> {isBn ? 'তথ্য যাচাই' : 'Verify Data'}
        </span>
        <span className="sep"></span>
        <span className="step">
          <span className="num">3</span> {isBn ? 'আবেদন' : 'Application'}
        </span>
      </div>

      {/* Split layout */}
      <div className="split">
        {/* Left: Simulated Deed Paper */}
        <div className="card pad">
          <div className="panel-head">
            <h2>{isBn ? 'মূল দলিল (ডেমো)' : 'Original Deed (Demo)'}</h2>
            <span className="pill">SAMPLE ONLY</span>
          </div>

          <div className="document-toolbar">
            <span>{getVal('deedNumber') || 'DEMO-2026-001'}</span>
            <span>{isBn ? 'নমুনা · ১ পৃষ্ঠা' : 'Sample · 1 Page'}</span>
          </div>

          <div className="doc-preview">
            <div className="paper">
              <div className="document-ribbon">{isBn ? 'শুধুমাত্র নমুনা' : 'DEMO SAMPLE'}</div>
              <span className="seal">{getVal('surveyType') || 'RS'}</span>
              <h4>{isBn ? 'নমুনা জমি হস্তান্তর দলিল' : 'Land Conveyance Deed'}</h4>
              <small>NOT A REAL LEGAL DOCUMENT</small>

              <div className="faux-text">
                {isBn ? 'দলিল নম্বর' : 'Deed No'}: <b>{getVal('deedNumber')}</b><br />
                {isBn ? 'রেজিস্ট্রি তারিখ' : 'Reg Date'}: <b>{getVal('registrationDate')}</b><br />
                {isBn ? 'রেজিস্ট্রি অফিস' : 'Sub-Registry'}: <b>{getVal('registryOffice')}</b><br />
                {isBn ? 'মৌজা' : 'Mouza'}: <b>{getVal('mouza')}</b><br />
                {isBn ? 'জরিপ' : 'Survey'}: <b>{getVal('surveyType')}</b><br />
                {isBn ? 'খতিয়ান' : 'Khatian'}: <b>{getVal('khatianNumber')}</b><br />
                {isBn ? 'দাগ' : 'Dag / Plot'}: <b>{getVal('dagNumber')}</b><br />
                {isBn ? 'জমির পরিমাণ' : 'Land Area'}: <b>{getVal('landArea')}</b><br />
                {isBn ? 'দাতা' : 'Grantor / Seller'}: <b>{getVal('grantor')}</b><br />
                {isBn ? 'গ্রহীতা' : 'Grantee / Buyer'}: <b>{getVal('grantee')}</b>
                <div className="line"></div>
                <div className="line mid"></div>
                <div className="line small"></div>
              </div>

              <small style={{ display: 'block', marginTop: 16 }}>
                {isBn ? 'কাল্পনিক তথ্য • Only for the hackathon' : 'Fictional demo data • Hackathon prototype'}
              </small>
            </div>
          </div>
        </div>

        {/* Right: Editable Extraction Fields */}
        <div className="card pad">
          <div className="panel-head">
            <div>
              <h2>{isBn ? 'পূরণ করা তথ্য' : 'Extracted Entities'}</h2>
              <p>{isBn ? 'ডেমো এক্সট্রাকশন • বাস্তব AI সংযুক্ত নয়' : 'Demo Extraction • Sandboxed mock AI'}</p>
            </div>
            <span className="pill">{isBn ? 'সংশোধনযোগ্য' : 'Editable'}</span>
          </div>

          <div className="fieldgrid">
            <div className="field">
              <label htmlFor="fDeed">
                {isBn ? 'দলিল নম্বর' : 'Deed Number'} <span className="confidence">Sample</span>
              </label>
              <input
                id="fDeed"
                value={getVal('deedNumber')}
                onChange={e => updateExtractionField('deedNumber', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="fSurvey">{isBn ? 'জরিপের ধরন' : 'Survey Type'}</label>
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
              <label htmlFor="fMouza">{isBn ? 'মৌজা' : 'Mouza'}</label>
              <input
                id="fMouza"
                value={getVal('mouza')}
                onChange={e => updateExtractionField('mouza', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="fKhatian">{isBn ? 'খতিয়ান নম্বর' : 'Khatian Number'}</label>
              <input
                id="fKhatian"
                value={getVal('khatianNumber')}
                onChange={e => updateExtractionField('khatianNumber', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="fDag">{isBn ? 'দাগ নম্বর' : 'Plot / Dag Number'}</label>
              <input
                id="fDag"
                value={getVal('dagNumber')}
                onChange={e => updateExtractionField('dagNumber', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="fArea">{isBn ? 'বিক্রিত জমির পরিমাণ (শতাংশ)' : 'Transferred Area (Decimals)'}</label>
              <input
                id="fArea"
                type="text"
                value={getVal('landArea')}
                onChange={e => updateExtractionField('landArea', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="fSeller">{isBn ? 'বিক্রেতা / দাতা' : 'Seller / Grantor'}</label>
              <input
                id="fSeller"
                value={getVal('grantor')}
                onChange={e => updateExtractionField('grantor', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="fBuyer">{isBn ? 'ক্রেতা / গ্রহীতা' : 'Buyer / Grantee'}</label>
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
              {isBn
                ? 'বাস্তব সংস্করণে AI শনাক্ত করা প্রতিটি তথ্য ব্যবহারকারীকে নিশ্চিত করতে হবে।'
                : 'In production, citizens review and confirm each extracted entity before proceeding.'}
            </div>
          </div>

          <div className="btn-row">
            <button className="btn" onClick={handleProceed}>
              {isBn ? 'তথ্য নিশ্চিত করুন → জমি দেখুন' : 'Confirm Data → View Land Map'} <ArrowRight size={14} />
            </button>
            <button className="btn secondary" onClick={() => navigate('/upload')}>
              <ChevronLeft size={14} /> {isBn ? 'পেছনে যান' : 'Back'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
