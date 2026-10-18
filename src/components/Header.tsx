import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, FileText, Search, LayoutDashboard, Home, Shield, AlertTriangle } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole, setRole } = useAppStore();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="site-header no-print">
      <div className="site-header-inner">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-decoration-none" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #176B56, #17334C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Map size={20} color="white" />
          </div>
          <div>
            <div className="logo-text">ভূপ্রহরী AI</div>
            <div className="logo-tagline">দলিল দিন, জমি খুঁজে নিন</div>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Link to="/" className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}>
            <Home size={14} style={{ display: 'inline', marginRight: 4 }} />হোম
          </Link>
          <Link to="/upload" className={`nav-link ${isActive('/upload') ? 'active' : ''}`}>
            <FileText size={14} style={{ display: 'inline', marginRight: 4 }} />দলিল আপলোড
          </Link>
          <Link to="/track" className={`nav-link ${isActive('/track') ? 'active' : ''}`}>
            <Search size={14} style={{ display: 'inline', marginRight: 4 }} />অবস্থা দেখুন
          </Link>
          <Link to="/officer" className={`nav-link ${isActive('/officer') ? 'active' : ''}`}>
            <LayoutDashboard size={14} style={{ display: 'inline', marginRight: 4 }} />কর্মকর্তা
          </Link>
        </nav>

        {/* Role switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="demo-banner" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
            <AlertTriangle size={12} />নমুনা
          </div>
          <button
            className={`btn btn-sm ${currentRole === 'officer' ? 'btn-navy' : 'btn-secondary'}`}
            onClick={() => { setRole(currentRole === 'officer' ? 'citizen' : 'officer'); navigate(currentRole === 'officer' ? '/' : '/officer'); }}
          >
            <Shield size={14} />
            {currentRole === 'officer' ? 'নাগরিক মোড' : 'কর্মকর্তা মোড'}
          </button>
        </div>
      </div>
    </header>
  );
}
