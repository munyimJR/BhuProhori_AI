import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Menu } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'হোমপেজ', subtitle: 'দলিল থেকে নামজারি — সহজ ৩ ধাপে' },
  '/upload': { title: 'দলিল আপলোড', subtitle: 'কাগজের তথ্য হাতে না লিখে, একটি দলিল দিয়ে শুরু করুন' },
  '/review': { title: 'AI তথ্য যাচাই', subtitle: 'বাম পাশে নমুনা দলিল, ডানে সম্পাদনাযোগ্য তথ্য' },
  '/identify': { title: 'জমির নকশা', subtitle: 'সাধারণ ব্যবহারকারীকে নকশায় জমি খুঁজতে হবে না' },
  '/verify': { title: 'যাচাইয়ের ফলাফল', subtitle: 'নামজারির আগে জমির পরিমাণ ও অধিকারের সত্যতা পরীক্ষা' },
  '/apply': { title: 'নামজারি আবেদন', subtitle: 'আগের ধাপে নিশ্চিত করা তথ্য দিয়ে আবেদন প্রস্তুত' },
  '/officer': { title: 'অফিসার ড্যাশবোর্ড', subtitle: 'অনুমোদন ও পর্যালোচনা কর্মপ্রবাহের নমুনা' },
  '/track': { title: 'চূড়ান্ত রিপোর্ট', subtitle: 'আবেদন, নথি এবং যাচাইয়ের সারসংক্ষেপ এক জায়গায়' },
};

interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

export default function Topbar({ onToggleMobileMenu }: TopbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole, setRole } = useAppStore();

  const currentPath = Object.keys(TITLES).find(p => p === location.pathname) || '/';
  const info = TITLES[currentPath] || { title: 'ভূপ্রহরী AI', subtitle: 'স্মার্ট নামজারি প্ল্যাটফর্ম' };

  const handleRoleToggle = () => {
    const nextRole = currentRole === 'officer' ? 'citizen' : 'officer';
    setRole(nextRole);
    navigate(nextRole === 'officer' ? '/officer' : '/');
  };

  return (
    <header className="topbar no-print">
      <div className="topbar-left">
        {onToggleMobileMenu && (
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            aria-label="মেনু খুলুন"
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <strong className="top-text">{info.title}</strong>
          <div className="tiny subtle">{info.subtitle}</div>
        </div>
      </div>

      <div className="right-tools">
        <button
          className={`btn btn-sm ${currentRole === 'officer' ? 'secondary' : 'ghost'}`}
          onClick={handleRoleToggle}
          title="মোড পরিবর্তন করুন"
          style={{ gap: 6 }}
        >
          <Shield size={14} />
          <span className="role-btn-label">{currentRole === 'officer' ? 'কর্মকর্তা' : 'নাগরিক'}</span>
        </button>

        <span className="pill demo-pill">
          <i className="pulse-dot"></i>
          ইন্টার‌্যাক্টিভ ডেমো
        </span>

        <span
          className="avatar"
          title={`বর্তমান ইউজার: ${currentRole === 'officer' ? 'কর্মকর্তা' : 'নাগরিক'}`}
          onClick={handleRoleToggle}
        >
          {currentRole === 'officer' ? 'O' : 'D'}
        </span>
      </div>
    </header>
  );
}
