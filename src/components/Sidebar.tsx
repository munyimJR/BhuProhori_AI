import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, FileCheck, Map, ShieldCheck, FileText, Users, Award, Lock, X, Sparkles } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { TRANSLATIONS } from '../utils/translations';

interface NavConfig {
  path: string;
  key: 'home' | 'upload' | 'review' | 'identify' | 'verify' | 'apply' | 'officer' | 'track';
  icon: React.ReactNode;
  badge?: { text: string; type: 'live' | 'ai' | 'pro' };
}

const NAV_CONFIGS: NavConfig[] = [
  { path: '/', key: 'home', icon: <Home size={17} /> },
  { path: '/upload', key: 'upload', icon: <Upload size={17} /> },
  { path: '/review', key: 'review', icon: <FileCheck size={17} /> },
  { path: '/identify', key: 'identify', icon: <Map size={17} />, badge: { text: 'LIVE GIS', type: 'live' } },
  { path: '/verify', key: 'verify', icon: <ShieldCheck size={17} />, badge: { text: 'AI AUDIT', type: 'ai' } },
  { path: '/apply', key: 'apply', icon: <FileText size={17} /> },
  { path: '/officer', key: 'officer', icon: <Users size={17} />, badge: { text: 'AC LAND', type: 'pro' } },
  { path: '/track', key: 'track', icon: <Award size={17} /> },
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
            <ShieldCheck size={24} />
          </div>
          <div className="brand-text-wrap">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <strong>ভূপ্রহরী AI</strong>
              <span className="brand-pill">2026</span>
            </div>
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
              <span className="nav-label-text">{label}</span>
              {item.badge && (
                <span className={`nav-micro-badge badge-${item.badge.type}`}>
                  {item.badge.text}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="side-note">
        <div className="side-note-header">
          <div className="side-note-icon">
            <Lock size={12} />
          </div>
          <strong>{TRANSLATIONS.nav.securityTitle[language]}</strong>
        </div>
        <p className="side-note-desc">
          {TRANSLATIONS.nav.securityDesc[language]}
        </p>
        <div className="side-note-footer">
          <Sparkles size={11} color="#6ee7b7" />
          <span>Client-Side Privacy Demo</span>
        </div>
      </div>
    </aside>
  );
}
