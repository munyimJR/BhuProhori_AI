import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Menu } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import LanguageToggle from './LanguageToggle';
import { TRANSLATIONS } from '../utils/translations';

interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

export default function Topbar({ onToggleMobileMenu }: TopbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole, setRole, language } = useAppStore();

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
    navigate(nextRole === 'officer' ? '/officer' : '/');
  };

  const roleLabel = currentRole === 'officer'
    ? TRANSLATIONS.topbar.officerRole[language]
    : TRANSLATIONS.topbar.citizenRole[language];

  const demoLabel = TRANSLATIONS.topbar.interactiveDemo[language];
  const userTooltip = `${TRANSLATIONS.topbar.userTooltip[language]}${roleLabel}`;

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

        <button
          className={`btn btn-sm ${currentRole === 'officer' ? 'secondary' : 'ghost'}`}
          onClick={handleRoleToggle}
          title={TRANSLATIONS.topbar.switchRoleTip[language]}
          style={{ gap: 6 }}
        >
          <Shield size={14} />
          <span className="role-btn-label">{roleLabel}</span>
        </button>

        <span className="pill demo-pill">
          <i className="pulse-dot"></i>
          {demoLabel}
        </span>

        <span
          className="avatar"
          title={userTooltip}
          onClick={handleRoleToggle}
        >
          {currentRole === 'officer' ? 'O' : 'D'}
        </span>
      </div>
    </header>
  );
}
