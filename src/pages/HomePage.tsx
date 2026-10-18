import { useNavigate } from 'react-router-dom';
import {
  Upload, Map, Award, ArrowRight, ArrowUpRight, Lock, Layers,
  MapPin, Shield, CheckCircle, AlertTriangle, FileText, ChevronRight
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import paddyImage from '../assets/paddy-green-to-gold.png';

export default function HomePage() {
  const navigate = useNavigate();
  const { loadDemoScenario, resetJourney } = useAppStore();

  const handleStartUpload = () => {
    resetJourney();
    navigate('/upload');
  };

  const handleStartDemo = (scenario = 1) => {
    loadDemoScenario(scenario);
    navigate('/review');
  };

  return (
    <div>
      {/* Welcome line */}
      <div className="welcome-line">
        <span>ভূমির তথ্য থেকে আবেদনের প্রস্তুতি</span>
        <span className="welcome-meta">LANDTECH INNOVATION · 2026</span>
      </div>

      {/* Hero Card */}
      <div className="hero card">
        <div className="hero-copy">
          <h1>
            জমির নামজারি,<br />
            এবার <span>আরও সহজ।</span>
          </h1>
          <p>
            আপনার দলিল আপলোড করুন। প্রয়োজনীয় তথ্য যাচাই করুন। সহজেই নামজারির আবেদন প্রস্তুত করুন।
          </p>

          <div className="btn-row">
            <button className="btn" onClick={handleStartUpload}>
              দলিল দিয়ে শুরু করুন <ArrowRight size={16} />
            </button>
            <button className="hero-link" onClick={() => handleStartDemo(1)}>
              নমুনা দিয়ে দেখুন <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="hero-assurance">
            <Lock size={14} color="#176b56" />
            <span>কোনো ফাইল সার্ভারে পাঠানো হয় না · শুধুমাত্র ডেমো</span>
          </div>
        </div>

        <div className="hero-side">
          <img
            className="paddy-hero-image"
            src={paddyImage}
            alt="সবুজ থেকে সোনালি হয়ে ওঠা ধানক্ষেতের কল্পিত দৃশ্য"
            width="1536"
            height="1024"
          />
          <span className="photo-credit">AI-নির্মিত ধানক্ষেতের দৃশ্য</span>
          <span className="map-demo-label">
            <Layers size={14} />
            সবুজ থেকে সোনালি
          </span>

          <div className="plot-preview">
            <div className="plot-preview-top">
              <span className="plot-symbol">
                <MapPin size={16} />
              </span>
              <div>
                <strong>আপনার জমির পরিচিতি</strong>
                <small style={{ color: 'var(--muted)', display: 'block', fontSize: '10px' }}>ডেমো মৌজা · আরএস জরিপ</small>
              </div>
              <span className="sample-tag">নমুনা</span>
            </div>
            <div className="plot-preview-data">
              <div><small>দাগ নম্বর</small><b>১২৫</b></div>
              <div><small>খতিয়ান</small><b>২৫৬</b></div>
              <div><small>জমির পরিমাণ</small><b>২০ <em>শতাংশ</em></b></div>
            </div>
            <button className="plot-link" onClick={() => navigate('/identify')}>
              নমুনা নকশা দেখুন <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Action / Services grid */}
      <div className="section-heading">
        <h2 className="section-title">আপনি কী করতে চান?</h2>
        <span>আপনার প্রয়োজন অনুযায়ী শুরু করুন</span>
      </div>

      <div className="grid three services">
        <div className="service featured" onClick={handleStartUpload} role="button" tabIndex={0}>
          <div className="service-top">
            <span className="bubble">
              <Upload size={22} />
            </span>
            <span className="service-arrow">
              <ArrowUpRight size={18} />
            </span>
          </div>
          <h3>দলিল আপলোড করুন</h3>
          <p>ছবি বা PDF দিয়ে শুরু করুন। নমুনা তথ্য থেকে আবেদনের ধাপগুলো দেখুন।</p>
          <span className="service-foot">
            শুরু করার সহজ উপায় <ArrowRight size={14} />
          </span>
        </div>

        <div className="service" onClick={() => navigate('/identify')} role="button" tabIndex={0}>
          <div className="service-top">
            <span className="bubble">
              <Map size={22} />
            </span>
            <span className="service-arrow">
              <ArrowUpRight size={18} />
            </span>
          </div>
          <h3>জমির তথ্য দেখুন</h3>
          <p>নমুনা দাগ, খতিয়ান ও মৌজা নকশায় জমির পরিচিতি মিলিয়ে নিন।</p>
          <span className="service-foot">
            নমুনা নকশা খুলুন <ArrowRight size={14} />
          </span>
        </div>

        <div className="service" onClick={() => navigate('/track')} role="button" tabIndex={0}>
          <div className="service-top">
            <span className="bubble">
              <Award size={22} />
            </span>
            <span className="service-arrow">
              <ArrowUpRight size={18} />
            </span>
          </div>
          <h3>আবেদনের অবস্থা দেখুন</h3>
          <p>ডেমো আবেদনের অগ্রগতি ও যাচাইয়ের সারসংক্ষেপ এক জায়গায় দেখুন।</p>
          <span className="service-foot">
            ডেমো রিপোর্ট দেখুন <ArrowRight size={14} />
          </span>
        </div>
      </div>

      {/* Growth story banner */}
      <div className="growth-story">
        <div>
          <strong>
            <span className="growth-dot"></span>
            সবুজে শুরু। সোনালিতে প্রস্তুতি।
          </strong>
          <p>ধানের বেড়ে ওঠার রঙে, দলিল থেকে আবেদনের পথ।</p>
        </div>
        <div className="growth-colors" aria-label="সবুজ থেকে সোনালি রঙের ধাপ">
          <span>শুরু</span>
          <span>যাচাই</span>
          <span>প্রস্তুতি</span>
        </div>
      </div>

      {/* How it works */}
      <div className="how-it-works">
        <div className="how-intro">
          <h2>
            দলিল থেকে আবেদন।<br />
            <span>সহজ তিনটি ধাপে।</span>
          </h2>
          <p>প্রতিটি ধাপে তথ্য দেখুন, বুঝুন ও নিশ্চিত করুন।</p>
        </div>
        <ol className="journey">
          <li>
            <span className="journey-number">০১</span>
            <div>
              <h3>দলিল দিন</h3>
              <p>ছবি, PDF অথবা নমুনা দলিল বেছে নিন।</p>
            </div>
          </li>
          <li>
            <span className="journey-number">০২</span>
            <div>
              <h3>তথ্য যাচাই করুন</h3>
              <p>দলিলের তথ্য ও জমির পরিচিতি মিলিয়ে নিন।</p>
            </div>
          </li>
          <li>
            <span className="journey-number">০৩</span>
            <div>
              <h3>আবেদন প্রস্তুত করুন</h3>
              <p>তথ্য নিশ্চিত করে ডেমো আবেদন তৈরি করুন।</p>
            </div>
          </li>
        </ol>
      </div>

      {/* Interactive Hackathon Scenarios Picker */}
      <div style={{ marginTop: '2.5rem' }}>
        <div className="section-heading">
          <h2 className="section-title">হ্যাকাথন মূল্যায়ন পরিস্থিতি (৮টি নমুনা কেস)</h2>
          <span>যেকোনো একটি নির্বাচন করে সরাসরি AI ও GIS ফলাফল পরীক্ষা করুন</span>
        </div>

        <div className="grid two">
          {[
            { id: 1, title: '১. সম্পূর্ণ সঠিক দলিল ও রেকর্ড (Clean Match)', desc: 'সব তথ্য মিলে যায়, কোনো বিবাদ নেই, পূর্ণ অধিকার বিদ্যমান।', icon: <CheckCircle size={18} color="var(--green)" /> },
            { id: 2, title: '২. একাধিক মালিক ও অংশ বিক্রয় (Multiple Owners)', desc: 'খতিয়ানে একাধিক শরিক, নির্দিষ্ট অংশের বৈধ সীমানা যাচাই।', icon: <AlertTriangle size={18} color="var(--amber)" /> },
            { id: 3, title: '৩. ব্যাংকে বন্ধক রাখা জমি (Mortgage Warning)', desc: 'জমিটির উপর রাষ্ট্রায়ত্ত ব্যাংকের লিয়েন/বন্ধক বিদ্যমান।', icon: <AlertTriangle size={18} color="var(--amber)" /> },
            { id: 4, title: '৪. আদালতে মামলা ও স্থগিতাদেশ (Legal Injunction)', desc: 'জমিটির উপর দেওয়ানি আদালতের নিষেধাজ্ঞা বিদ্যমান।', icon: <AlertTriangle size={18} color="var(--red)" /> },
            { id: 5, title: '৫. অর্পিত / খাস সরকারি জমি (Khas Land Alert)', desc: 'সরকারি ১নং খাস খতিয়ানভুক্ত জমি বিক্রির চেষ্টা শনাক্ত।', icon: <Shield size={18} color="var(--red)" /> },
            { id: 6, title: '৬. জমির পরিমাণের অসামঞ্জস্য (Area Mismatch)', desc: 'দলিলে ১০ শতাংশ দাবি, কিন্তু বিক্রেতার রেকর্ডে আছে ৮ শতাংশ।', icon: <AlertTriangle size={18} color="var(--amber)" /> },
            { id: 7, title: '৭. সাব-রেজিস্ট্রার অফিসের তথ্যে অমিল', desc: 'দলিল নম্বর সাব-রেজিস্ট্রি আর্কাইভের মূল বহির সাথে অমিল।', icon: <FileText size={18} color="var(--red)" /> },
            { id: 8, title: '৮. জলাশয় / শ্রেণি পরিবর্তন সতর্কতা', desc: 'জমির শ্রেণি জলাশয়/নদীগর্ভ, ভরাট ও মিউটেশন আইনত সীমাবদ্ধ।', icon: <AlertTriangle size={18} color="var(--amber)" /> },
          ].map(s => (
            <div
              key={s.id}
              className="card pad"
              style={{ cursor: 'pointer', transition: 'all 0.2s', display: 'flex', gap: 14, alignItems: 'flex-start' }}
              onClick={() => handleStartDemo(s.id)}
              role="button"
              tabIndex={0}
            >
              <div style={{ marginTop: 2 }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--deep)', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
              <ChevronRight size={16} color="var(--muted)" style={{ marginTop: 4 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Demo Disclosure */}
      <div className="demo-disclosure">
        <Shield size={24} />
        <p>
          <strong>স্বচ্ছতা থেকেই আস্থা।</strong> এটি একটি হ্যাকাথন প্রোটোটাইপ। সব রেকর্ড কাল্পনিক; কোনো সরকারি সিস্টেমে আবেদন জমা হয় না।
        </p>
      </div>
    </div>
  );
}
