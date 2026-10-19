import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import LanguageToggle from './LanguageToggle';
import UserRoleCapsule from './UserRoleCapsule';
import GeminiStatusCapsule from './GeminiStatusCapsule';
import { TRANSLATIONS } from '../utils/translations';

interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

export default function Topbar({ onToggleMobileMenu }: TopbarProps) {
  const location = useLocation();
  const { language } = useAppStore();

  const pagesMap = TRANSLATIONS.topbar.pages as Record<string, { title: { bn: string; en: string }; subtitle: { bn: string; en: string } }>;
  const currentPath = Object.keys(pagesMap).find(p => p === location.pathname) || '/';
  const pageInfo = pagesMap[currentPath] || {
    title: TRANSLATIONS.topbar.defaultTitle,
    subtitle: TRANSLATIONS.topbar.defaultSubtitle
  };

  const titleText = pageInfo.title[language] || pageInfo.title.bn;
  const subtitleText = pageInfo.subtitle[language] || pageInfo.subtitle.bn;

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
        <div className="topbar-title-wrap">
          <strong className="top-text">{titleText}</strong>
          <div className="tiny subtle">{subtitleText}</div>
        </div>
      </div>

      <div className="right-tools">
        {/* Real-time Gemini Flash AI connection status pill & modal */}
        <GeminiStatusCapsule />

        {/* Bilingual Bangla/English toggle switch */}
        <LanguageToggle />

        {/* Consolidated User Profile, Role Switcher, Sign In & Demo Capsule */}
        <UserRoleCapsule />
      </div>
    </header>
  );
}
