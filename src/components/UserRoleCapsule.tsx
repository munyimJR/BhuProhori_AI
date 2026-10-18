import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, User, LogIn, LogOut, ChevronDown, Sparkles,
  ArrowRight, CheckCircle2, UserCheck, ShieldCheck
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { TRANSLATIONS } from '../utils/translations';

export default function UserRoleCapsule() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    currentRole, setRole, language,
    isAuthenticated, currentUser, login, logout
  } = useAppStore();

  const isBn = language === 'bn';
  const isOfficer = currentRole === 'officer';

  // Close dropdown on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const roleText = isOfficer
    ? TRANSLATIONS.topbar.officerRole[language]
    : TRANSLATIONS.topbar.citizenRole[language];

  const displayName = currentUser
    ? (isBn ? currentUser.nameBn : currentUser.name)
    : (isBn ? 'সাইন ইন' : 'Sign In');

  const avatarInitial = currentUser
    ? currentUser.avatarLetter
    : (isOfficer ? 'O' : 'D');

  // Handle switching role
  const handleSwitchRole = (targetRole: 'citizen' | 'officer') => {
    setRole(targetRole);
    setIsOpen(false);
    // User request: when switching to citizen to officer also redirect to officer sign in page
    navigate(`/signin?role=${targetRole}`);
  };

  // 1-Click Demo Logins from dropdown
  const handleQuickLogin = (role: 'citizen' | 'officer') => {
    login(role);
    setIsOpen(false);
    navigate(role === 'officer' ? '/officer' : '/upload');
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleGoToSignIn = () => {
    setIsOpen(false);
    navigate(`/signin?role=${currentRole}`);
  };

  return (
    <div className="user-capsule-wrap" ref={containerRef}>
      {/* ── Single Consolidated Capsule Trigger ── */}
      <button
        type="button"
        className={`user-capsule-btn ${isAuthenticated ? 'logged-in' : 'guest'} ${isOfficer ? 'is-officer' : 'is-citizen'}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={isBn ? 'ইউজার প্রোফাইল ও রোল সেটিংস' : 'User Profile & Role Settings'}
      >
        {/* Pulsing Demo Dot */}
        <span className="capsule-live-dot" title={isBn ? 'ইন্টার‌্যাক্টিভ ডেমো সক্রিয়' : 'Interactive Demo Active'} />

        {/* Role Icon */}
        <span className="capsule-role-icon">
          {isOfficer ? <Shield size={14} /> : <User size={14} />}
        </span>

        {/* Role & Name Text */}
        <div className="capsule-text-group">
          <span className="capsule-role-badge">{roleText}</span>
          <span className="capsule-sep">•</span>
          <span className="capsule-name">{displayName}</span>
        </div>

        {/* Mini Avatar Circle */}
        <span className="capsule-avatar-circle">{avatarInitial}</span>

        {/* Dropdown Chevron */}
        <span className={`capsule-chevron ${isOpen ? 'rotated' : ''}`}>
          <ChevronDown size={13} />
        </span>
      </button>

      {/* ── Floating Dropdown Menu ── */}
      {isOpen && (
        <div className="capsule-dropdown-menu" role="menu">
          {/* Header Banner: Demo status */}
          <div className="dropdown-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              <strong>{isBn ? 'ইন্টার‌্যাক্টিভ ডেমো পরিবেশ' : 'Interactive Demo Environment'}</strong>
            </div>
            <span className="dropdown-banner-tag">LANDTECH 2026</span>
          </div>

          {/* Current Persona Card */}
          <div className="dropdown-profile-box">
            <div className="dropdown-avatar-large">
              {avatarInitial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="dropdown-user-name">
                {currentUser
                  ? (isBn ? currentUser.nameBn : currentUser.name)
                  : (isBn ? 'গেস্ট ব্রাউজিং (সাইন ইন নেই)' : 'Guest Mode (Not Signed In)')}
              </div>
              <div className="dropdown-user-sub">
                {currentUser
                  ? (currentUser.role === 'officer'
                      ? (isBn ? 'সহকারী কমিশনার (ভূমি) • সাভার সার্কেল' : 'Assistant Commissioner (Land) • Savar')
                      : (isBn ? 'নাগরিক আবেদনকারী' : 'Citizen Land Applicant'))
                  : (isBn ? 'সম্পূর্ণ সুবিধার জন্য সাইন ইন করুন' : 'Sign in to access all capabilities')}
              </div>
              {currentUser?.nid && (
                <div className="dropdown-id-pill">
                  {currentUser.role === 'officer' ? 'Gov ID: ' : 'NID: '}
                  {currentUser.nid}
                </div>
              )}
            </div>
          </div>

          <div className="dropdown-divider" />

          {/* Quick Role Switch Action */}
          <div className="dropdown-section-title">
            {isBn ? 'ভূমিকা পরিবর্তন (Switch Role)' : 'Switch User Role'}
          </div>

          <div className="dropdown-role-switch-row">
            <button
              type="button"
              className={`dropdown-role-pill ${!isOfficer ? 'active' : ''}`}
              onClick={() => handleSwitchRole('citizen')}
            >
              <User size={13} />
              <span>{isBn ? 'নাগরিক মোড' : 'Citizen'}</span>
              {!isOfficer && <CheckCircle2 size={12} className="check-icon" />}
            </button>

            <button
              type="button"
              className={`dropdown-role-pill ${isOfficer ? 'active' : ''}`}
              onClick={() => handleSwitchRole('officer')}
            >
              <Shield size={13} />
              <span>{isBn ? 'কর্মকর্তা মোড' : 'Officer'}</span>
              {isOfficer && <CheckCircle2 size={12} className="check-icon" />}
            </button>
          </div>

          <div className="dropdown-divider" />

          {/* 1-Click Showcase Demo Logins for Evaluators */}
          <div className="dropdown-section-title" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Sparkles size={12} color="#aa761e" />
            <span>{isBn ? '১-ক্লিক শোকেস ডেমো লগইন' : '1-Click Showcase Logins'}</span>
          </div>

          <div className="dropdown-action-list">
            <button
              type="button"
              className="dropdown-menu-item demo-item"
              onClick={() => handleQuickLogin('citizen')}
            >
              <UserCheck size={14} color="#176b56" />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '12px' }}>
                  {isBn ? 'ডেমো নাগরিক (মো. রফিকুল ইসলাম)' : 'Demo Citizen (Md. Rafiqul)'}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--muted)' }}>
                  {isBn ? 'দলিল আপলোড ও আবেদন প্রবাহ' : 'Deed upload & mutation apply'}
                </div>
              </div>
              <ArrowRight size={13} color="var(--muted)" />
            </button>

            <button
              type="button"
              className="dropdown-menu-item demo-item"
              onClick={() => handleQuickLogin('officer')}
            >
              <ShieldCheck size={14} color="#17334c" />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '12px' }}>
                  {isBn ? 'ডেমো কর্মকর্তা (তাহমিনা আক্তার, এসি ল্যান্ড)' : 'Demo Officer (Tahmina Akhter, AC Land)'}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--muted)' }}>
                  {isBn ? 'কেস পর্যালোচনা ও চূড়ান্ত অনুমোদন' : 'Case review & mutation approval'}
                </div>
              </div>
              <ArrowRight size={13} color="var(--muted)" />
            </button>
          </div>

          <div className="dropdown-divider" />

          {/* Primary Footer Actions: Sign In page / Sign Out */}
          <div className="dropdown-footer-actions">
            <button
              type="button"
              className="dropdown-menu-item auth-action"
              onClick={handleGoToSignIn}
            >
              <LogIn size={14} />
              <span>{isBn ? 'সাইন ইন / সাইন আপ পেজ' : 'Go to Sign In / Sign Up Page'}</span>
            </button>

            {isAuthenticated && (
              <button
                type="button"
                className="dropdown-menu-item logout-action"
                onClick={handleLogout}
              >
                <LogOut size={14} />
                <span>{isBn ? 'লগ আউট (Sign Out)' : 'Sign Out'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
