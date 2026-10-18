import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, ArrowRight, AlertTriangle } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import type { MutationApplication, MutationStatus } from '../types';

export default function OfficerPage() {
  const navigate = useNavigate();
  const { allApplications, updateApplicationStatus, currentRole, setRole } = useAppStore();

  const [selectedId, setSelectedId] = useState<string>(allApplications[0]?.id || 'MUT-2026-001');
  const [decisionOption, setDecisionOption] = useState<string>('Need clarification');
  const [decisionNote, setDecisionNote] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const selectedApp: MutationApplication | undefined =
    allApplications.find(a => a.id === selectedId) || allApplications[0];

  const handleDecisionSave = () => {
    if (!selectedApp) return;

    let targetStatus: MutationStatus = 'under_verification';
    if (decisionOption === 'Need clarification') targetStatus = 'clarification_required';
    else if (decisionOption === 'Field verification') targetStatus = 'field_verification_requested';
    else if (decisionOption === 'Under review') targetStatus = 'officer_review';
    else if (decisionOption === 'Demo approved') targetStatus = 'approved';

    updateApplicationStatus(
      selectedApp.id,
      targetStatus,
      decisionNote || `${decisionOption} - কর্মকর্তা কর্তৃক সংরক্ষিত নোট`,
      'কর্মকর্তা মোঃ কামাল হোসেন (নমুনা)'
    );

    setToastMsg('সিমুলেটেড সিদ্ধান্ত সংরক্ষণ হয়েছে। এটি সরকারি অনুমোদন নয়।');
    setTimeout(() => setToastMsg(''), 3500);
  };

  const stats = {
    total: allApplications.length || 12,
    needsCheck: allApplications.filter(a => a.status === 'clarification_required' || a.status === 'field_verification_requested').length || 4,
    underReview: allApplications.filter(a => a.status === 'officer_review' || a.status === 'under_verification').length || 6,
  };

  return (
    <div>
      {/* Workspace Heading */}
      <div className="workspace-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="workspace-symbol">
            <Users size={22} />
          </div>
          <div>
            <h1 className="title">ভূমি কর্মকর্তার ড্যাশবোর্ড</h1>
            <p className="desc" style={{ margin: 0 }}>
              এটি সরকারি অফিসার অ্যাকাউন্ট নয়—শুধু অনুমোদন প্রক্রিয়ার ডেমো।
            </p>
          </div>
        </div>
        <span className="workspace-label">পর্যালোচনার কর্মক্ষেত্র</span>
      </div>

      {currentRole !== 'officer' && (
        <div className="hintbox" style={{ marginBottom: 20, background: '#fff9e6', borderColor: '#f2dc9b' }}>
          <AlertTriangle size={18} color="var(--amber)" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>আপনি বর্তমানে নাগরিক মোডে আছেন। কর্মকর্তা সুবিধা পুরোপুরি সক্রিয় করতে মোড পরিবর্তন করুন।</span>
            <button className="btn btn-sm secondary" onClick={() => setRole('officer')}>
              <Shield size={13} /> কর্মকর্তা মোডে যান
            </button>
          </div>
        </div>
      )}

      {/* 3 Stat Cards */}
      <div className="grid three">
        <div className="card stat">
          <span className="subtle">মোট নমুনা আবেদন</span>
          <div className="number">{stats.total < 10 ? `0${stats.total}` : stats.total}</div>
          <p>এ মাসের ডেমো তথ্য</p>
        </div>
        <div className="card stat">
          <span className="subtle">যাচাই প্রয়োজন</span>
          <div className="number">{stats.needsCheck < 10 ? `0${stats.needsCheck}` : stats.needsCheck}</div>
          <p>অসামঞ্জস্য বা নথি সমস্যা</p>
        </div>
        <div className="card stat">
          <span className="subtle">পর্যালোচনাধীন</span>
          <div className="number">{stats.underReview < 10 ? `0${stats.underReview}` : stats.underReview}</div>
          <p>সিমুলেটেড কর্মপ্রবাহ</p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card pad" style={{ marginTop: 20 }}>
        <div className="panel-head">
          <h2>আবেদন পর্যালোচনা</h2>
          <span className="pill">OFFICER DEMO</span>
        </div>

        <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 10px' }}>
          যেকোনো আবেদনে ক্লিক করে নিচে তার বিস্তারিত সিদ্ধান্ত নিন →
        </p>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>আবেদন</th>
                <th>দাগ</th>
                <th>আবেদনকারী</th>
                <th>পরিমাণ</th>
                <th>অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {allApplications.slice(0, 6).map(app => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedId(app.id)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? 'var(--mint)' : undefined,
                    }}
                  >
                    <td>
                      <strong>{app.id}</strong>
                    </td>
                    <td>{app.dagNumber}</td>
                    <td>{app.applicantNameBn || app.applicantName}</td>
                    <td>{app.transferArea} শতাংশ</td>
                    <td>
                      <span className={`pill ${app.status === 'approved' ? '' : app.status === 'rejected' ? 'red' : 'warn'}`}>
                        {app.status === 'approved' ? 'অনুমোদিত' : app.status === 'rejected' ? 'নামঞ্জুর' : 'পর্যালোচনাধীন'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision and Timeline 2-column Grid */}
      <div className="grid two" style={{ marginTop: 20 }}>
        {/* Left: Decision actions */}
        <div className="card pad">
          <h2 style={{ marginTop: 0, fontSize: 17, color: 'var(--deep)' }}>
            {selectedApp?.id || 'DEMO-MUT-001'} এর বিষয়ে সিদ্ধান্ত
          </h2>

          <div style={{ margin: '14px 0' }}>
            <label className="status-option">
              <input
                type="radio"
                name="officerDecision"
                value="Need clarification"
                checked={decisionOption === 'Need clarification'}
                onChange={e => setDecisionOption(e.target.value)}
              />
              অতিরিক্ত তথ্য চাই (Clarification)
            </label>

            <label className="status-option">
              <input
                type="radio"
                name="officerDecision"
                value="Field verification"
                checked={decisionOption === 'Field verification'}
                onChange={e => setDecisionOption(e.target.value)}
              />
              মাঠ পর্যায়ে যাচাই (Field Verification)
            </label>

            <label className="status-option">
              <input
                type="radio"
                name="officerDecision"
                value="Under review"
                checked={decisionOption === 'Under review'}
                onChange={e => setDecisionOption(e.target.value)}
              />
              পর্যালোচনাধীন রাখুন (Under Review)
            </label>

            <label className="status-option">
              <input
                type="radio"
                name="officerDecision"
                value="Demo approved"
                checked={decisionOption === 'Demo approved'}
                onChange={e => setDecisionOption(e.target.value)}
              />
              নমুনা অনুমোদন দেখান (Approve)
            </label>
          </div>

          <div className="field" style={{ marginBottom: 16 }}>
            <label htmlFor="decisionNote">মন্তব্য বা সিদ্ধান্তের কারণ</label>
            <input
              id="decisionNote"
              placeholder="সিদ্ধান্তের কারণ লিখুন..."
              value={decisionNote}
              onChange={e => setDecisionNote(e.target.value)}
            />
          </div>

          <div className="btn-row">
            <button className="btn" onClick={handleDecisionSave}>
              সিদ্ধান্ত সংরক্ষণ করুন
            </button>
          </div>

          {toastMsg && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--mint)', color: 'var(--green)', borderRadius: 8, fontSize: 12 }}>
              ✓ {toastMsg}
            </div>
          )}
        </div>

        {/* Right: Timeline */}
        <div className="card pad">
          <h2 style={{ marginTop: 0, fontSize: 17, color: 'var(--deep)' }}>আবেদনের অগ্রগতি</h2>

          <div className="timeline">
            <div className="stage passed">দাখিল</div>
            <div className="stage passed">প্রাথমিক যাচাই</div>
            <div className={`stage ${selectedApp?.status === 'approved' ? 'passed' : ''}`}>কর্মকর্তার সিদ্ধান্ত</div>
            <div className={`stage ${selectedApp?.status === 'approved' ? 'passed' : ''}`}>সম্পন্ন</div>
          </div>

          <p className="subtle" style={{ fontSize: 12, margin: '14px 0 20px' }}>
            বর্তমান অবস্থা: <strong>{selectedApp?.status === 'approved' ? 'অনুমোদিত' : 'কর্মকর্তার পর্যালোচনার জন্য প্রস্তুত'}</strong>
          </p>

          <button className="btn secondary sm" onClick={() => navigate('/track')}>
            চূড়ান্ত রিপোর্ট দেখুন → <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
