import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import logoImg from '../assets/logo.png';

export default function Footer() {
  const { language } = useAppStore();
  const isBn = language === 'bn';

  return (
    <footer className="app-footer no-print">
      <div className="app-footer-inner">
        {/* Brand & Tagline */}
        <div className="app-footer-brand">
          <Link to="/" className="app-footer-logo-link">
            <img src={logoImg} alt="ভূপ্রহরী AI" className="app-footer-logo-img" />
            <span className="app-footer-title">
              {isBn ? 'ভূপ্রহরী AI' : 'BhuProhori AI'}
            </span>
          </Link>
          <span className="app-footer-dot">•</span>
          <span className="app-footer-tagline">
            {isBn ? 'স্মার্ট ই-নামজারি ও ক্যাডাস্ট্রাল ভেরিফিকেশন' : 'Smart e-Mutation & Cadastral Verification'}
          </span>
        </div>

        {/* Minimal Nav Links */}
        <nav className="app-footer-nav" aria-label="Footer navigation">
          <Link to="/">{isBn ? 'হোম' : 'Home'}</Link>
          <Link to="/upload">{isBn ? 'দলিল আপলোড' : 'Deed Upload'}</Link>
          <Link to="/verify">{isBn ? 'এআই যাচাই' : 'AI Verification'}</Link>
          <Link to="/identify">{isBn ? 'জমির নকশা' : 'GIS Map'}</Link>
          <Link to="/track">{isBn ? 'রিপোর্ট' : 'Report'}</Link>
        </nav>

        {/* Status Pill & Copyright */}
        <div className="app-footer-meta">
          <div className="app-footer-status">
            <span className="app-footer-live-dot" />
            <Sparkles size={12} color="var(--green)" />
            <span>{isBn ? 'Gemini 1.5 Flash সক্রিয়' : 'Gemini 1.5 Flash Active'}</span>
          </div>

          <span className="app-footer-dot">•</span>

          <span className="app-footer-copy">
            © {isBn ? '২০২৬' : '2026'} {isBn ? 'ভূপ্রহরী AI' : 'BhuProhori AI'}
          </span>

          <span className="app-footer-badge">
            <ShieldCheck size={11} />
            {isBn ? 'ল্যান্ডটেক ২০২৬' : 'LandTech 2026'}
          </span>
        </div>
      </div>
    </footer>
  );
}
