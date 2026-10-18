import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, FileCheck, Map, ShieldCheck, FileText, Users, Award, Lock } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'হোমপেজ', icon: <Home size={18} /> },
  { path: '/upload', label: 'দলিল আপলোড', icon: <Upload size={18} /> },
  { path: '/review', label: 'AI তথ্য যাচাই', icon: <FileCheck size={18} /> },
  { path: '/identify', label: 'জমির নকশা', icon: <Map size={18} /> },
  { path: '/verify', label: 'যাচাইয়ের ফলাফল', icon: <ShieldCheck size={18} /> },
  { path: '/apply', label: 'নামজারি আবেদন', icon: <FileText size={18} /> },
  { path: '/officer', label: 'অফিসার ড্যাশবোর্ড', icon: <Users size={18} /> },
  { path: '/track', label: 'চূড়ান্ত রিপোর্ট', icon: <Award size={18} /> },
];

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar no-print">
      <Link to="/" className="brand">
        <div className="brandmark">
          <ShieldCheck size={26} />
        </div>
        <div>
          <strong>ভূপ্রহরী AI</strong>
          <small>BhuProhori • Smart e-Mutation</small>
        </div>
      </Link>

      <div className="navcaption">আপনার ভূমিসেবা</div>

      <nav className="nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-btn ${active ? 'active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="side-note">
        <Lock size={16} />
        <strong>আপনার তথ্য, আপনার নিয়ন্ত্রণে</strong>
        এই ডিজাইনের সব ব্যক্তি, দলিল, খতিয়ান, দাগ ও নামজারি তথ্য সম্পূর্ণ কাল্পনিক। সরকারি সিস্টেমের সঙ্গে কোনো সংযোগ নেই।
      </div>
    </aside>
  );
}
