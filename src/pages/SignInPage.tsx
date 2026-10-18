import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  LogIn, UserCheck, Shield, Sparkles, CheckCircle, ArrowRight,
  User, Building2, Lock, Phone, CreditCard, AlertCircle
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { TRANSLATIONS } from '../utils/translations';
import { DISTRICTS } from '../data/demoData';

interface SignInPageProps {
  isSignUpInitial?: boolean;
}

export default function SignInPage({ isSignUpInitial = false }: SignInPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setRole, language, login, isAuthenticated, currentUser, logout } = useAppStore();

  const isBn = language === 'bn';
  const tAuth = TRANSLATIONS.auth;

  // Determine active role tab from URL param or store
  const roleParam = searchParams.get('role');
  const [activeRole, setActiveRole] = useState<'citizen' | 'officer'>(
    roleParam === 'officer' ? 'officer' : 'citizen'
  );

  // Sign In vs Sign Up mode
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(
    isSignUpInitial ? 'signup' : 'signin'
  );

  // Form states
  const [identifier, setIdentifier] = useState('19882692510000123');
  const [password, setPassword] = useState('demo1234');
  const [govId, setGovId] = useState('AC-LAND-SAVAR-04');
  const [designation, setDesignation] = useState('ac_land');
  const [fullName, setFullName] = useState('মোঃ রফিকুল ইসলাম');
  const [phone, setPhone] = useState('01711-234567');
  const [selectedDistrict, setSelectedDistrict] = useState('dist-01');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync role tab when URL param changes
  useEffect(() => {
    if (roleParam === 'officer' || roleParam === 'citizen') {
      setActiveRole(roleParam);
    }
  }, [roleParam]);

  const handleRoleTabChange = (role: 'citizen' | 'officer') => {
    setActiveRole(role);
    setRole(role);
    setSearchParams({ role });
    if (role === 'officer') {
      setGovId('AC-LAND-SAVAR-04');
    } else {
      setIdentifier('19882692510000123');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1-Click Demo Citizen Login
  const handleDemoCitizenLogin = () => {
    login('citizen');
    showToast(isBn ? 'সফলভাবে নাগরিক হিসেবে লগইন সম্পন্ন হয়েছে!' : 'Logged in successfully as Demo Citizen!');
    setTimeout(() => {
      navigate('/upload');
    }, 600);
  };

  // 1-Click Demo Officer Login
  const handleDemoOfficerLogin = () => {
    login('officer');
    showToast(isBn ? 'সফলভাবে সহকারী কমিশনার (ভূমি) হিসেবে লগইন সম্পন্ন হয়েছে!' : 'Logged in successfully as AC Land Officer!');
    setTimeout(() => {
      navigate('/officer');
    }, 600);
  };

  // Form submission (Simulated login / register)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === 'officer') {
      login('officer', {
        nid: govId,
        designation: designation === 'ac_land' ? 'সহকারী কমিশনার (ভূমি)' : 'কানুনগো / রাজস্ব কর্মকর্তা',
      });
      showToast(isBn ? 'কর্মকর্তা পোর্টালে স্বাগতম!' : 'Welcome to the Officer Portal!');
      setTimeout(() => navigate('/officer'), 600);
    } else {
      login('citizen', {
        name: fullName || 'Demo Citizen',
        nameBn: fullName || 'ডেমো নাগরিক',
        nid: identifier,
        phone: phone,
      });
      showToast(isBn ? 'নাগরিক পোর্টালে স্বাগতম!' : 'Welcome to the Citizen Portal!');
      setTimeout(() => navigate('/upload'), 600);
    }
  };

  return (
    <div className="signin-page-wrap">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="signin-toast" role="alert">
          <CheckCircle size={18} color="#176b56" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Workspace Heading */}
      <div className="workspace-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="workspace-symbol">
            <LogIn size={22} />
          </div>
          <div>
            <h1 className="title">
              {isBn ? 'সাইন ইন ও একাউন্ট পোর্টাল' : 'Sign In & Portal Access'}
            </h1>
            <p className="desc" style={{ margin: 0 }}>
              {isBn
                ? 'নাগরিক এবং ভূমি প্রশাসন কর্মকর্তা — ১-ক্লিক ডেমো এক্সেস'
                : 'Citizen & Land Administration Officer — 1-Click Showcase Demo'}
            </p>
          </div>
        </div>
        <span className="workspace-label">
          {activeRole === 'officer'
            ? (isBn ? 'কর্মকর্তা ডোমেইন' : 'Officer Domain')
            : (isBn ? 'নাগরিক ডোমেইন' : 'Citizen Domain')}
        </span>
      </div>

      {/* Current Logged In Notification Banner (if already logged in) */}
      {isAuthenticated && currentUser && (
        <div className="auth-status-alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="auth-avatar-mini">{currentUser.avatarLetter}</span>
            <div>
              <strong>
                {isBn ? 'বর্তমানে সাইন ইন রয়েছেন:' : 'Currently signed in as:'}{' '}
                {isBn ? currentUser.nameBn : currentUser.name}
              </strong>
              <small style={{ display: 'block', color: 'var(--muted)', marginTop: 2 }}>
                {currentUser.role === 'officer'
                  ? (isBn ? 'সহকারী কমিশনার (ভূমি) • সাভার সার্কেল' : 'Assistant Commissioner (Land) • Savar Circle')
                  : (isBn ? 'নাগরিক আবেদনকারী • এনআইডি: ১৯৮৮২৬৯২৫১০০০০০১২৩' : 'Citizen Applicant • NID: 19882692510000123')}
              </small>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-sm secondary"
              onClick={() => navigate(currentUser.role === 'officer' ? '/officer' : '/')}
            >
              {isBn ? 'ড্যাশবোর্ডে যান' : 'Go to Dashboard'} <ArrowRight size={13} />
            </button>
            <button
              type="button"
              className="btn btn-sm ghost"
              onClick={logout}
            >
              {isBn ? 'লগ আউট' : 'Sign Out'}
            </button>
          </div>
        </div>
      )}

      {/* ── HIGHLIGHTED SHOWCASE DEMO FAST-TRACK SECTION ─────────── */}
      <section className="showcase-demo-hero">
        <div className="showcase-demo-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="showcase-glow-icon">
              <Sparkles size={18} />
            </span>
            <h2 className="showcase-title">{tAuth.showcaseTitle[language]}</h2>
          </div>
          <span className="showcase-badge">LANDTECH 2026 HACKATHON</span>
        </div>

        <p className="showcase-desc">{tAuth.showcaseSub[language]}</p>

        <div className="showcase-grid">
          {/* Card 1: 1-Click Citizen Demo Login */}
          <div
            className={`showcase-persona-card ${activeRole === 'citizen' ? 'selected' : ''}`}
            onClick={handleDemoCitizenLogin}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDemoCitizenLogin(); }}
          >
            <div className="persona-top">
              <div className="persona-badge-tag citizen">
                <User size={13} />
                <span>{isBn ? 'নাগরিক আবেদনকারী' : 'Citizen Applicant'}</span>
              </div>
              <span className="instant-pill">{isBn ? '১-ক্লিক' : 'Instant'}</span>
            </div>

            <div className="persona-identity">
              <h3>{tAuth.demoCitizenSubtitle[language]}</h3>
              <p className="persona-meta">{tAuth.demoCitizenDetails[language]}</p>
            </div>

            <ul className="persona-capabilities">
              <li>✓ {isBn ? 'দলিল আপলোড ও AI ডেটা পর্যালোচনা' : 'Deed upload & AI data review'}</li>
              <li>✓ {isBn ? 'মৌজা নকশায় ইন্টারেক্টিভ দাগ চিহ্নিতকরণ' : 'Cadastral GIS parcel identification'}</li>
              <li>✓ {isBn ? 'অনলাইন ই-নামজারি আবেদন প্রস্তুত ও ট্র্যাকিং' : 'e-Mutation application filing & audit'}</li>
            </ul>

            <button
              type="button"
              className="btn showcase-btn citizen-action"
              onClick={(e) => {
                e.stopPropagation();
                handleDemoCitizenLogin();
              }}
            >
              <UserCheck size={16} />
              <span>{tAuth.demoCitizenTitle[language]}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Card 2: 1-Click Officer Demo Login */}
          <div
            className={`showcase-persona-card officer-card ${activeRole === 'officer' ? 'selected' : ''}`}
            onClick={handleDemoOfficerLogin}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDemoOfficerLogin(); }}
          >
            <div className="persona-top">
              <div className="persona-badge-tag officer">
                <Building2 size={13} />
                <span>{isBn ? 'ভূমি রাজস্ব প্রশাসন' : 'Land Revenue Admin'}</span>
              </div>
              <span className="instant-pill officer-pill">{isBn ? '১-ক্লিক' : 'Instant'}</span>
            </div>

            <div className="persona-identity">
              <h3>{tAuth.demoOfficerSubtitle[language]}</h3>
              <p className="persona-meta">{tAuth.demoOfficerDetails[language]}</p>
            </div>

            <ul className="persona-capabilities">
              <li>✓ {isBn ? 'নামজারি আবেদন যাচাই ও এআই অডিট লগ' : 'Officer case inbox & AI risk engine'}</li>
              <li>✓ {isBn ? 'শুনানি শিডিউল, আপত্তি ও কৈফিয়ত তলব' : 'Hearing schedule, clarificaton & notes'}</li>
              <li>✓ {isBn ? 'খতিয়ান সৃজন ও ডিজিটাল চূড়ান্ত অনুমোদন' : 'Simulated mutation approval workflow'}</li>
            </ul>

            <button
              type="button"
              className="btn showcase-btn officer-action"
              onClick={(e) => {
                e.stopPropagation();
                handleDemoOfficerLogin();
              }}
            >
              <Shield size={16} />
              <span>{tAuth.demoOfficerTitle[language]}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ── STANDARD AUTHENTICATION FORM CARD ─────────────────────── */}
      <div className="card pad signin-form-card">
        {/* Role Segmented Tabs (Citizen vs Officer) */}
        <div className="auth-role-tabs">
          <button
            type="button"
            className={`role-tab-btn ${activeRole === 'citizen' ? 'active' : ''}`}
            onClick={() => handleRoleTabChange('citizen')}
          >
            <User size={16} />
            <span>{tAuth.citizenTab[language]}</span>
          </button>

          <button
            type="button"
            className={`role-tab-btn ${activeRole === 'officer' ? 'active' : ''}`}
            onClick={() => handleRoleTabChange('officer')}
          >
            <Building2 size={16} />
            <span>{tAuth.officerTab[language]}</span>
          </button>
        </div>

        {/* Sub-Tabs: Sign In vs Sign Up */}
        <div className="auth-sub-nav">
          <button
            type="button"
            className={`sub-nav-btn ${authMode === 'signin' ? 'active' : ''}`}
            onClick={() => setAuthMode('signin')}
          >
            {tAuth.signInTab[language]}
          </button>
          <button
            type="button"
            className={`sub-nav-btn ${authMode === 'signup' ? 'active' : ''}`}
            onClick={() => setAuthMode('signup')}
          >
            {tAuth.signUpTab[language]}
          </button>
        </div>

        {/* Form Header */}
        <div className="panel-head" style={{ marginBottom: 16 }}>
          <div>
            <h2>
              {activeRole === 'citizen'
                ? (authMode === 'signin' ? tAuth.citizenSignInHead[language] : tAuth.signUpTab[language])
                : (authMode === 'signin' ? tAuth.officerSignInHead[language] : isBn ? 'কর্মকর্তা অনুমোদন অনুরোধ' : 'Officer Registration Request')}
            </h2>
            <p>
              {activeRole === 'citizen'
                ? tAuth.citizenSignInDesc[language]
                : tAuth.officerSignInDesc[language]}
            </p>
          </div>
          <span className="pill">
            {activeRole === 'officer' ? (isBn ? 'অফিসিয়াল' : 'Gov Portal') : (isBn ? 'নাগরিক' : 'Citizen')}
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit}>
          {authMode === 'signup' && (
            <div className="field" style={{ marginBottom: 14 }}>
              <label htmlFor="authFullName">{tAuth.fullName[language]}</label>
              <input
                id="authFullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isBn ? 'মোঃ রফিকুল ইসলাম' : 'Md. Rafiqul Islam'}
                required
              />
            </div>
          )}

          {activeRole === 'citizen' ? (
            <>
              <div className="field" style={{ marginBottom: 14 }}>
                <label htmlFor="authIdentifier">
                  <CreditCard size={14} style={{ display: 'inline', marginRight: 4 }} />
                  {tAuth.nidOrPhone[language]}
                </label>
                <input
                  id="authIdentifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="19882692510000123 / 01711234567"
                  required
                />
              </div>

              {authMode === 'signup' && (
                <div className="fieldgrid" style={{ marginBottom: 14 }}>
                  <div className="field">
                    <label htmlFor="authPhone">
                      <Phone size={14} style={{ display: 'inline', marginRight: 4 }} />
                      {isBn ? 'মোবাইল নম্বর' : 'Mobile Number'}
                    </label>
                    <input
                      id="authPhone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01711234567"
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="authDistrict">{tAuth.district[language]}</label>
                    <select
                      id="authDistrict"
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                    >
                      {DISTRICTS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {isBn ? d.nameBn : d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Officer Fields */
            <>
              <div className="fieldgrid" style={{ marginBottom: 14 }}>
                <div className="field">
                  <label htmlFor="authGovId">
                    <Building2 size={14} style={{ display: 'inline', marginRight: 4 }} />
                    {tAuth.govId[language]}
                  </label>
                  <input
                    id="authGovId"
                    type="text"
                    value={govId}
                    onChange={(e) => setGovId(e.target.value)}
                    placeholder="AC-LAND-SAVAR-04"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="authDesignation">{tAuth.designation[language]}</label>
                  <select
                    id="authDesignation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  >
                    <option value="ac_land">{tAuth.acLand[language]}</option>
                    <option value="kanungo">{tAuth.kanungo[language]}</option>
                    <option value="surveyor">{tAuth.surveyor[language]}</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="field" style={{ marginBottom: 14 }}>
            <label htmlFor="authPassword">
              <Lock size={14} style={{ display: 'inline', marginRight: 4 }} />
              {tAuth.password[language]}
            </label>
            <input
              id="authPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {authMode === 'signup' && (
            <div className="field" style={{ marginBottom: 14 }}>
              <label htmlFor="authConfirmPassword">{tAuth.confirmPassword[language]}</label>
              <input
                id="authConfirmPassword"
                type="password"
                defaultValue="demo1234"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, fontSize: '13px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', margin: 0 }}>
              <input type="checkbox" defaultChecked />
              <span>{tAuth.rememberMe[language]}</span>
            </label>
            <span style={{ color: 'var(--green)', cursor: 'pointer' }}>
              {tAuth.forgotPassword[language]}
            </span>
          </div>

          <button
            type="submit"
            className="btn full"
            style={{ width: '100%', justifyContent: 'center', padding: '12px 18px', fontSize: '15px' }}
          >
            {authMode === 'signin' ? tAuth.submitSignIn[language] : tAuth.submitSignUp[language]}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Switch mode footer */}
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }}>
          {authMode === 'signin' ? (
            <>
              <span>{tAuth.noAccountPrompt[language]} </span>
              <button
                type="button"
                className="inline-link-btn"
                onClick={() => setAuthMode('signup')}
              >
                {tAuth.createAccountLink[language]}
              </button>
            </>
          ) : (
            <>
              <span>{tAuth.hasAccountPrompt[language]} </span>
              <button
                type="button"
                className="inline-link-btn"
                onClick={() => setAuthMode('signin')}
              >
                {tAuth.signInLink[language]}
              </button>
            </>
          )}
        </div>

        {/* Hackathon Sandbox Notice */}
        <div className="hintbox" style={{ marginTop: 18 }}>
          <AlertCircle size={16} color="var(--green)" />
          <div>{tAuth.demoNotice[language]}</div>
        </div>
      </div>
    </div>
  );
}
