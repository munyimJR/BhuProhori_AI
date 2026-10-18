import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, FileCheck, Map, ShieldCheck, FileText, Users, Award, Lock, X } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { TRANSLATIONS } from '../utils/translations';

interface NavConfig {
  path: string;
  key: 'home' | 'upload' | 'review' | 'identify' | 'verify' | 'apply' | 'officer' | 'track';
  icon: React.ReactNode;
}

const NAV_CONFIGS: NavConfig[] = [
  { path: '/', key: 'home', icon: <Home size={18} /> },
  { path: '/upload', key: 'upload', icon: <Upload size={18} /> },
  { path: '/review', key: 'review', icon: <FileCheck size={18} /> },
  { path: '/identify', key: 'identify', icon: <Map size={18} /> },
  { path: '/verify', key: 'verify', icon: <ShieldCheck size={18} /> },
  { path: '/apply', key: 'apply', icon: <FileText size={18} /> },
  { path: '/officer', key: 'officer', icon: <Users size={18} /> },
  { path: '/track', key: 'track', icon: <Award size={18} /> },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { language } = useAppStore();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar no-print ${isOpen ? 'mobile-open' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" className="brand" onClick={handleLinkClick}>
          <div className="brandmark">
            <ShieldCheck size={26} />
          </div>
          <div>
            <strong>ভূপ্রহরী AI</strong>
            <small>{TRANSLATIONS.nav.brandSub[language]}</small>
          </div>
        </Link>

        {onClose && (
          <button
            type="button"
            className="mobile-close-btn"
            onClick={onClose}
            aria-label={language === 'bn' ? 'মেনু বন্ধ করুন' : 'Close menu'}
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="navcaption">{TRANSLATIONS.nav.servicesCaption[language]}</div>

      <nav className="nav" aria-label="Main navigation">
        {NAV_CONFIGS.map((item) => {
          const active = isActive(item.path);
          const label = TRANSLATIONS.nav[item.key][language];
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-btn ${active ? 'active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={handleLinkClick}
            >
              <span className="nav-icon">{item.icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="side-note">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Lock size={14} color="#79d6b0" />
          <strong style={{ margin: 0 }}>{TRANSLATIONS.nav.securityTitle[language]}</strong>
        </div>
        {TRANSLATIONS.nav.securityDesc[language]}
      </div>
    </aside>
  );
}
