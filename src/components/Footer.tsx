import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Code2, X, Mail, ExternalLink } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import logoImg from '../assets/logo.png';
import munyimImg from '../assets/developers/photo_2026-01-15_12-37-18.jpg';
import ronyImg from '../assets/developers/photo_2026-07-03_08-25-44.jpg';

// SVG Icons for GitHub and LinkedIn
function GithubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.78v8.37H6.46v-8.37M7.85 6.43a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
    </svg>
  );
}

interface Developer {
  name: string;
  roleBn: string;
  roleEn: string;
  image: string;
  email: string;
  linkedin: string;
  github: string;
  githubDisplay: string;
  linkedinDisplay: string;
}

const DEVELOPERS: Developer[] = [
  {
    name: 'Muntasir Munyim Polash',
    roleBn: 'ফুল-স্ট্যাক ও এআই ইঞ্জিনিয়ার',
    roleEn: 'Full-Stack & AI Engineer',
    image: munyimImg,
    email: 'muntasirpolash@gmail.com',
    linkedin: 'https://www.linkedin.com/in/munyimjr',
    github: 'https://github.com/munyimJR',
    githubDisplay: 'munyimJR',
    linkedinDisplay: 'in/munyimjr',
  },
  {
    name: 'Rony Roy',
    roleBn: 'সফটওয়্যার ডেভেলপার ও সিস্টেম আর্কিটেক্ট',
    roleEn: 'Software Developer & System Architect',
    image: ronyImg,
    email: 'ronyroy@gmail.com',
    linkedin: 'https://www.linkedin.com/in/rony-roy-0b03b143a/',
    github: 'https://github.com/rony',
    githubDisplay: 'rony',
    linkedinDisplay: 'in/rony-roy',
  },
];

export default function Footer() {
  const { language } = useAppStore();
  const isBn = language === 'bn';
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDevModalOpen(false);
    };
    if (isDevModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isDevModalOpen]);

  return (
    <>
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

          {/* Developer Info Button, Status Pill & Copyright */}
          <div className="app-footer-meta">
            {/* Developer Info Button */}
            <button
              type="button"
              className="app-footer-dev-btn"
              onClick={() => setIsDevModalOpen(true)}
              aria-label={isBn ? 'ডেভেলপার পরিচিতি' : 'Developer Information'}
            >
              <Code2 size={13} />
              <span>{isBn ? 'ডেভেলপার তথ্য' : 'Developer Info'}</span>
            </button>

            <span className="app-footer-dot">•</span>

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

      {/* Developer Information Modal */}
      {isDevModalOpen && (
        <div
          className="app-dev-modal-backdrop"
          onClick={() => setIsDevModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dev-modal-title"
        >
          <div
            className="app-dev-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="app-dev-modal-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="app-dev-modal-symbol">
                  <Code2 size={20} />
                </div>
                <div>
                  <h2 id="dev-modal-title" style={{ margin: 0, fontSize: 18, color: 'var(--deep)' }}>
                    {isBn ? 'প্রজেক্ট ডেভেলপার পরিচিতি' : 'Project Developer Team'}
                  </h2>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--muted)' }}>
                    {isBn
                      ? 'ভূপ্রহরী AI — সিস্টেম ডিজাইন, ফুল-স্ট্যাক ও মেশিন লার্নিং আর্কিটেক্ট'
                      : 'BhuProhori AI — Engineering & System Architecture Team'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="app-dev-close-btn"
                onClick={() => setIsDevModalOpen(false)}
                aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Developers Grid */}
            <div className="app-dev-grid">
              {DEVELOPERS.map((dev, idx) => (
                <div key={idx} className="app-dev-card">
                  {/* Photo with Glow Frame */}
                  <div className="app-dev-avatar-wrap">
                    <img
                      src={dev.image}
                      alt={dev.name}
                      className="app-dev-avatar-img"
                    />
                    <span className="app-dev-role-badge">
                      {isBn ? dev.roleBn : dev.roleEn}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="app-dev-name">{dev.name}</h3>

                  {/* Contact Links */}
                  <div className="app-dev-links">
                    {/* Email */}
                    <a
                      href={`mailto:${dev.email}`}
                      className="app-dev-link-btn email"
                      title={dev.email}
                    >
                      <Mail size={14} />
                      <span className="app-dev-link-text">{dev.email}</span>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={dev.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="app-dev-link-btn linkedin"
                      title={`LinkedIn: ${dev.linkedin}`}
                    >
                      <LinkedinIcon size={14} />
                      <span className="app-dev-link-text">{dev.linkedinDisplay}</span>
                      <ExternalLink size={12} className="link-arrow" />
                    </a>

                    {/* GitHub */}
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="app-dev-link-btn github"
                      title={`GitHub: ${dev.github}`}
                    >
                      <GithubIcon size={14} />
                      <span className="app-dev-link-text">@{dev.githubDisplay}</span>
                      <ExternalLink size={12} className="link-arrow" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer Note */}
            <div className="app-dev-modal-foot">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--muted)' }}>
                <Sparkles size={13} color="var(--green)" />
                <span>
                  {isBn
                    ? 'ল্যান্ডটেক ইনোভেশন হ্যাকাথন ২০২৬-এর জন্য নির্মিত স্মার্ট ভূমি সমাধান।'
                    : 'Crafted for LandTech Innovation Hackathon 2026.'}
                </span>
              </div>

              <button
                type="button"
                className="btn secondary"
                style={{ padding: '6px 14px', fontSize: 12 }}
                onClick={() => setIsDevModalOpen(false)}
              >
                {isBn ? 'ঠিক আছে' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
