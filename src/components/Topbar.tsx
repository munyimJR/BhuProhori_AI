import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Menu, LogIn, LogOut } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import LanguageToggle from './LanguageToggle';
import { TRANSLATIONS } from '../utils/translations';

interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

export default function Topbar({ onToggleMobileMenu }: TopbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole, setRole, language, isAuthenticated, currentUser, logout } = useAppStore();

  const pagesMap = TRANSLATIONS.topbar.pages as Record<string, { title: { bn: string; en: string }; subtitle: { bn: string; en: string } }>;
  const currentPath = Object.keys(pagesMap).find(p => p === location.pathname) || '/';
  const pageInfo = pagesMap[currentPath] || {
    title: TRANSLATIONS.topbar.defaultTitle,
    subtitle: TRANSLATIONS.topbar.defaultSubtitle
  };

  const titleText = pageInfo.title[language] || pageInfo.title.bn;
  const subtitleText = pageInfo.subtitle[language] || pageInfo.subtitle.bn;

  const handleRoleToggle = () => {
    const nextRole = currentRole === 'officer' ? 'citizen' : 'officer';
    setRole(nextRole);
    // Explicit user request: "when swithing to citizen to officer also redirect me to officer sign in or sign up page"
    navigate(`/signin?role=${nextRole}`);
  };

  const roleLabel = currentRole === 'officer'
    ? TRANSLATIONS.topbar.officerRole[language]
    : TRANSLATIONS.topbar.citizenRole[language];

  const demoLabel = TRANSLATIONS.topbar.interactiveDemo[language];
  const userTooltip = currentUser
    ? `${language === 'bn' ? currentUser.nameBn : currentUser.name} (${roleLabel})`
    : `${TRANSLATIONS.topbar.userTooltip[language]}${roleLabel}`;

  return (
    <header className="topbar no-print">
      <div className="topbar-left">
        {onToggleMobileMenu && (
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            aria-label={language === 'bn' ? 'মেনু খুলুন' : 'Open menu'}
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <strong className="top-text">{titleText}</strong>
          <div className="tiny subtle">{subtitleText}</div>
        </div>
      </div>

      <div className="right-tools">
        {/* Bilingual Bangla/English toggle switch */}
        <LanguageToggle />

        {/* Role toggle button: Citizen <-> Officer */}
        <button
          className={`btn btn-sm ${currentRole === 'officer' ? 'secondary' : 'ghost'}`}
          onClick={handleRoleToggle}
          title={TRANSLATIONS.topbar.switchRoleTip[language]}
          style={{ gap: 6 }}
        >
          <Shield size={14} />
          <span className="role-btn-label">{roleLabel}</span>
        </button>

        {/* Sign In button OR Logged-in User Profile Badge */}
        {isAuthenticated && currentUser ? (
          <div className="user-profile-badge" title={userTooltip}>
            <span className="user-name-label">
              {language === 'bn' ? currentUser.nameBn : currentUser.name}
            </span>
            <button
              type="button"
              className="btn-signout"
              onClick={() => {
                logout();
                navigate('/');
              }}
              title={TRANSLATIONS.topbar.signOutBtn[language]}
              aria-label={TRANSLATIONS.topbar.signOutBtn[language]}
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-sm btn-signin"
            onClick={() => navigate(`/signin?role=${currentRole}`)}
            title={TRANSLATIONS.topbar.signInBtn[language]}
            style={{ gap: 6 }}
          >
            <LogIn size={14} />
            <span className="signin-btn-label">{TRANSLATIONS.topbar.signInBtn[language]}</span>
          </button>
        )}

        <span className="pill demo-pill">
          <i className="pulse-dot"></i>
          {demoLabel}
        </span>

        <span
          className="avatar"
          title={userTooltip}
          onClick={() => navigate(`/signin?role=${currentRole}`)}
        >
          {currentUser ? currentUser.avatarLetter : (currentRole === 'officer' ? 'O' : 'D')}
        </span>
      </div>
    </header>
  );
}
