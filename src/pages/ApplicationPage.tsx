import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import paddyImage from '../assets/paddy-green-to-gold.png';

export default function ApplicationPage() {
  const navigate = useNavigate();
  const {
    extraction, selectedParcel, createApplication
  } = useAppStore();

  const [submitting, setSubmitting] = useState(false);

  const getFieldValue = (fieldName: keyof NonNullable<typeof extraction>['fields']) => {
    if (!extraction) return '';
    const field = extraction.fields[fieldName];
    return field?.userCorrectedValue ?? field?.value ?? '';
  };

  const [applicantName, setApplicantName] = useState(getFieldValue('grantee') || 'Demo Buyer B');
  const [applicantPhone, setApplicantPhone] = useState('01711-000000');
  const [deedNumber, setDeedNumber] = useState(getFieldValue('deedNumber') || 'DEMO-2026-001');
  const [dagNumber, setDagNumber] = useState(selectedParcel?.dagNumber || getFieldValue('dagNumber') || '125');
  const [khatianNumber, setKhatianNumber] = useState(selectedParcel?.currentKhatian || getFieldValue('khatianNumber') || '256');
  const [transferArea, setTransferArea] = useState<number>(
    parseFloat(getFieldValue('landArea').replace(/[^\d.]/g, '')) || selectedParcel?.area || 5
  );
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      createApplication({
        applicantName,
        applicantNameBn: applicantName,
        applicantPhone,
        applicantAddress: 'ঢাকা, বাংলাদেশ',
        dagNumber,
        khatianNumber,
        transferArea,
        deedNumber,
      });

      setSubmitting(false);
      navigate('/track');
    }, 1200);
  };

  return (
    <div>
      {/* Workspace Heading */}
      <div className="workspace-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="workspace-symbol">
            <FileText size={22} />
          </div>
          <div>
            <h1 className="title">নামজারির আবেদন প্রস্তুত</h1>
            <p className="desc" style={{ margin: 0 }}>
              আগের ধাপে যাচাইকৃত বা নিশ্চিত করা তথ্য দিয়ে আবেদন ফরমের নমুনা পূরণ করা হয়েছে।
            </p>
          </div>
        </div>
        <span className="workspace-label">আবেদনের প্রস্তুতি</span>
      </div>

      {/* Stepper */}
      <div className="steps">
        <span className="step">
          <span className="num">✓</span> দলিল
        </span>
        <span className="sep"></span>
        <span className="step">
          <span className="num">✓</span> তথ্য যাচাই
        </span>
        <span className="sep"></span>
        <span className="step current">
          <span className="num">3</span> আবেদন
        </span>
      </div>

      {/* 2-Column Grid */}
      <div className="grid two">
        {/* Left: Applicant Information Form */}
        <div className="card pad">
          <div className="panel-head">
            <h2>আবেদনকারীর তথ্য</h2>
            <span className="pill">প্রি-ফিল্ড ডেমো</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="fieldgrid">
              <div className="field full">
                <label htmlFor="applicant">আবেদনকারীর নাম</label>
                <input
                  id="applicant"
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="applicantPhone">মোবাইল নম্বর</label>
                <input
                  id="applicantPhone"
                  value={applicantPhone}
                  onChange={e => setApplicantPhone(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="appDeed">দলিল নম্বর</label>
                <input
                  id="appDeed"
                  value={deedNumber}
                  onChange={e => setDeedNumber(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="appDag">দাগ নম্বর</label>
                <input
                  id="appDag"
                  value={dagNumber}
                  onChange={e => setDagNumber(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="appKhatian">খতিয়ান</label>
                <input
                  id="appKhatian"
                  value={khatianNumber}
                  onChange={e => setKhatianNumber(e.target.value)}
                  required
                />
              </div>

              <div className="field full">
                <label htmlFor="appArea">আবেদিত জমি (শতাংশ)</label>
                <input
                  id="appArea"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={transferArea}
                  onChange={e => setTransferArea(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="field full">
                <label htmlFor="appNotes">অতিরিক্ত মন্তব্য (ঐচ্ছিক)</label>
                <textarea
                  id="appNotes"
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="কিছু জানাতে চাইলে লিখুন..."
                ></textarea>
              </div>
            </div>

            <div className="btn-row" style={{ marginTop: 22 }}>
              <button className="btn" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> আবেদন জমা হচ্ছে...
                  </>
                ) : (
                  <>
                    ডেমো আবেদন জমা দিন → <ArrowRight size={14} />
                  </>
                )}
              </button>

              <button
                className="btn secondary"
                type="button"
                onClick={() => navigate('/review')}
              >
                তথ্য পরিবর্তন
              </button>
            </div>
          </form>
        </div>

        {/* Right: Review Card & Reassurance */}
        <div className="card pad">
          <figure className="paddy-panel-photo">
            <img
              src={paddyImage}
              alt="সোনালি ধানের কল্পিত দৃশ্য"
              loading="lazy"
              width="1536"
              height="1024"
            />
          </figure>

          <div className="panel-head" style={{ marginTop: 12 }}>
            <div>
              <h2>জমা দেওয়ার আগে,<br />একবার মিলিয়ে নিন।</h2>
            </div>
            <span className="pill warn">সরকারি জমা নয়</span>
          </div>

          <div className="check">
            <span className="badge-dot">✓</span>
            <div>
              <strong>জমির পরিচিতি পূরণ</strong>
              <small>মৌজা, দাগ, খতিয়ান স্বয়ংক্রিয়ভাবে সংযুক্ত</small>
            </div>
          </div>

          <div className="check">
            <span className="badge-dot">✓</span>
            <div>
              <strong>দলিলের তথ্য যোগ করা হয়েছে</strong>
              <small>ডেমো দলিল নম্বর ও বিক্রয় বিবরণ প্রস্তুত</small>
            </div>
          </div>

          <div className="check">
            <span className="badge-dot warning">!</span>
            <div>
              <strong>সহায়ক নথির সরকারি যাচাই বাকি</strong>
              <small>প্রকৃত দলিল যাচাই বা সরকারি সার্ভারের সাথে সংযোগ নেই</small>
            </div>
          </div>

          <div className="hintbox" style={{ marginTop: 20 }}>
            <CheckCircle size={16} />
            <div>
              এই অ্যাপ থেকে বাস্তব নামজারির আবেদন জমা হয় না। সব তথ্য শুধু ব্রাউজারের এই ডেমোতে ব্যবহৃত।
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
