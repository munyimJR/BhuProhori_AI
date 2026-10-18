import { Globe } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import type { Language } from '../types';

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { language, setLanguage, toggleLanguage } = useAppStore();

  const handleSelect = (lang: Language) => {
    if (language !== lang) {
      setLanguage(lang);
    }
  };

  return (
    <div
      className={`lang-switch-wrap ${className}`}
      title={language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
    >
      <div
        className="lang-toggle-control"
        role="group"
        aria-label="Language toggle (বাংলা / English)"
      >
        <span className="lang-globe-icon" aria-hidden="true">
          <Globe size={13} />
        </span>

        {/* The slider switch with Bangla and English */}
        <div
          className={`lang-track ${language === 'en' ? 'is-en' : 'is-bn'}`}
          onClick={toggleLanguage}
          role="switch"
          aria-checked={language === 'en'}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleLanguage();
            }
          }}
          title={language === 'bn' ? 'বাংলা সক্রিয় — ইংরেজিতে ক্লিক করুন' : 'English active — click for Bangla'}
        >
          <button
            type="button"
            className={`lang-segment ${language === 'bn' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect('bn');
            }}
            aria-label="বাংলা ভাষা"
          >
            বাং
          </button>

          <button
            type="button"
            className={`lang-segment ${language === 'en' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect('en');
            }}
            aria-label="English language"
          >
            EN
          </button>

          {/* Sliding highlight pill */}
          <span className="lang-slider-pill" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
