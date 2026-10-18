import { useNavigate } from 'react-router-dom';
import {
  Upload, Search, Eye, ChevronRight, CheckCircle, AlertTriangle,
  Map, Shield, FileCheck, Zap, ArrowRight, Star, Clock, Users
} from 'lucide-react';
import useAppStore from '../store/useAppStore';

const STEPS = [
  { icon: <Upload size={20} />, label: 'দলিল দিন', desc: 'আপলোড বা নমুনা নির্বাচন' },
  { icon: <Zap size={20} />, label: 'তথ্য যাচাই', desc: 'AI-সহায়তায় তথ্য পূরণ' },
  { icon: <FileCheck size={20} />, label: 'আবেদন প্রস্তুত', desc: 'স্বয়ংক্রিয় নামজারি আবেদন' },
];

const STATS = [
  { value: '৩০+', label: 'নমুনা জমির দাগ' },
  { value: '৭টি', label: 'যাচাই নিয়ম' },
  { value: '৮টি', label: 'পরিস্থিতি পরীক্ষা' },
  { value: '১০০%', label: 'নমুনা ডেটা' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { loadDemoScenario, resetJourney } = useAppStore();

  const handleUpload = () => { resetJourney(); navigate('/upload'); };
  const handleSearch = () => navigate('/track?mode=search');
  const handleTrack = () => navigate('/track');
  const handleDemo = (scenario: number) => { loadDemoScenario(scenario); navigate('/review'); };

  return (
    <div>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="demo-banner" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
            <Star size={12} />
            LandTech Innovation Hackathon 2026 — প্রদর্শনী সংস্করণ (নমুনা ডেটা)
          </div>
          <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '1rem', maxWidth: 700, lineHeight: 1.2 }}>
            জমির নামজারি,<br />
            <span style={{ color: '#7EDFC5' }}>এবার আরও সহজ।</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', maxWidth: 560, marginBottom: '2.5rem', fontFamily: 'Hind Siliguri, sans-serif', lineHeight: 1.7 }}>
            আপনার দলিল আপলোড করুন। প্রয়োজনীয় তথ্য যাচাই করুন।<br />সহজেই নামজারির আবেদন প্রস্তুত করুন।
          </p>

          {/* Steps */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', padding: '0.625rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)' }}>
                  <div style={{ color: '#7EDFC5' }}>{s.icon}</div>
                  <div>
                    <div style={{ color: 'white', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem', fontWeight: 700 }}>{s.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontFamily: 'Hind Siliguri, sans-serif' }}>{s.desc}</div>
                  </div>
                </div>
                {i < STEPS.length - 1 && <ArrowRight size={16} color="rgba(255,255,255,0.4)" />}
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <button className="btn btn-xl" onClick={handleUpload} style={{ background: 'white', color: 'var(--green)', fontWeight: 700, marginRight: '0.75rem' }}>
            <Upload size={20} />দলিল আপলোড করুন
          </button>
          <button className="btn btn-xl btn-secondary" onClick={() => handleDemo(1)} style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', background: 'rgba(255,255,255,0.1)' }}>
            নমুনা দেখুন
          </button>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--navy)', padding: '1.25rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0.5rem' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7EDFC5', fontFamily: 'Hind Siliguri, sans-serif' }}>{s.value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'Hind Siliguri, sans-serif' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>আপনার সেবা বেছে নিন</h2>
            <p style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif' }}>তিনটি সহজ পথে নামজারির কাজ শুরু করুন</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Option A */}
            <div className="service-card recommended animate-fade-in" onClick={handleUpload} role="button" tabIndex={0}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)' }}>
                  <Upload size={24} />
                </div>
                <span className="badge badge-green">প্রস্তাবিত</span>
              </div>
              <h3 style={{ fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '0.5rem', fontSize: '1.25rem' }}>দলিল আপলোড করুন</h3>
              <p style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                দলিলের ছবি বা PDF আপলোড করুন। AI স্বয়ংক্রিয়ভাবে তথ্য পড়বে এবং নামজারির আবেদন প্রস্তুত করবে।
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--green)', fontWeight: 600, fontFamily: 'Hind Siliguri, sans-serif' }}>
                শুরু করুন <ChevronRight size={16} />
              </div>
            </div>

            {/* Option B */}
            <div className="service-card animate-fade-in" onClick={handleSearch} role="button" tabIndex={0} style={{ animationDelay: '0.1s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369A1' }}>
                  <Search size={24} />
                </div>
              </div>
              <h3 style={{ fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '0.5rem', fontSize: '1.25rem' }}>দাগ বা খতিয়ান দিয়ে খুঁজুন</h3>
              <p style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                যদি দলিল আপলোড না করতে পারেন, দাগ নম্বর ও মৌজার তথ্য দিয়ে জমি খুঁজুন।
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#0369A1', fontWeight: 600, fontFamily: 'Hind Siliguri, sans-serif' }}>
                খুঁজুন <ChevronRight size={16} />
              </div>
            </div>

            {/* Option C */}
            <div className="service-card animate-fade-in" onClick={handleTrack} role="button" tabIndex={0} style={{ animationDelay: '0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}>
                  <Eye size={24} />
                </div>
              </div>
              <h3 style={{ fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '0.5rem', fontSize: '1.25rem' }}>আবেদনের অবস্থা দেখুন</h3>
              <p style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                আবেদন নম্বর দিয়ে আপনার নামজারি আবেদনের বর্তমান অবস্থা জানুন।
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#7C3AED', fontWeight: 600, fontFamily: 'Hind Siliguri, sans-serif' }}>
                দেখুন <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Scenarios */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="demo-banner" style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>নমুনা পরিস্থিতি</div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>নমুনা দলিল ব্যবহার করুন</h2>
            <p style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif' }}>বিভিন্ন পরিস্থিতি পরীক্ষা করুন — সব তথ্য কাল্পনিক</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {[
              { n: 1, label: 'পরিস্থিতি ১: সঠিক আবেদন', desc: 'সব তথ্য মিলে যায়, সফল অনুমোদন প্রবাহ', color: 'var(--green)', badge: 'badge-green', badgeText: 'বৈধ' },
              { n: 2, label: 'পরিস্থিতি ২: জমির পরিমাণে অমিল', desc: 'দলিলে বেশি পরিমাণ উল্লেখ — R01 নিয়ম লঙ্ঘন', color: 'var(--red)', badge: 'badge-red', badgeText: 'ত্রুটি' },
              { n: 3, label: 'পরিস্থিতি ৩: ভুল দাগ নম্বর', desc: 'দলিলে ভুল দাগ — R02 নিয়ম সক্রিয়', color: 'var(--gold)', badge: 'badge-gold', badgeText: 'সতর্কতা' },
              { n: 4, label: 'পরিস্থিতি ৪: কাগজপত্র অনুপস্থিত', desc: 'প্রয়োজনীয় নথি না থাকায় R05 সক্রিয়', color: 'var(--gold)', badge: 'badge-gold', badgeText: 'সতর্কতা' },
            ].map(s => (
              <div key={s.n} className="card" style={{ cursor: 'pointer' }} onClick={() => handleDemo(s.n)}>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className={`badge ${s.badge}`}>{s.badgeText}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontFamily: 'Hind Siliguri, sans-serif' }}>নমুনা #{s.n}</span>
                  </div>
                  <h4 style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.9375rem', marginBottom: '0.375rem' }}>{s.label}</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '0.875rem' }}>{s.desc}</p>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleDemo(s.n)} style={{ width: '100%' }}>
                    এই নমুনা ব্যবহার করুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>কীভাবে কাজ করে?</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { icon: <Upload size={18} />, title: 'দলিল দিন', desc: 'PDF বা ছবি আপলোড করুন, অথবা নমুনা দলিল নির্বাচন করুন' },
                  { icon: <Zap size={18} />, title: 'AI তথ্য পড়বে', desc: 'AI স্বয়ংক্রিয়ভাবে দাগ, খতিয়ান, পরিমাণ ও মালিকের নাম বের করবে' },
                  { icon: <Map size={18} />, title: 'জমি চিহ্নিত হবে', desc: 'তথ্য মিলিয়ে সঠিক দাগটি মানচিত্রে দেখাবে' },
                  { icon: <Shield size={18} />, title: 'যাচাই হবে', desc: 'স্বয়ংক্রিয় নিয়মে ত্রুটি ও অসঙ্গতি চিহ্নিত হবে' },
                  { icon: <FileCheck size={18} />, title: 'আবেদন প্রস্তুত', desc: 'নামজারির আবেদন স্বয়ংক্রিয়ভাবে পূরণ হবে — আপনি শুধু নিশ্চিত করবেন' },
                  { icon: <CheckCircle size={18} />, title: 'কর্মকর্তা সিদ্ধান্ত নেবেন', desc: 'AI শুধু প্রস্তুতি করে — চূড়ান্ত সিদ্ধান্ত দক্ষ কর্মকর্তা নেন' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)', flexShrink: 0 }}>
                      {s.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, marginBottom: '0.125rem' }}>{s.title}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif' }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="card" style={{ border: '2px solid var(--green-faint)' }}>
                <div className="card-body" style={{ padding: '2rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏛️</div>
                    <h3 style={{ fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--green)' }}>AI করে প্রস্তুতি</h3>
                    <p style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>নাগরিক নিশ্চিত করেন · কর্মকর্তা সিদ্ধান্ত নেন</p>
                  </div>
                  <div className="alert alert-gold">
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <strong>গুরুত্বপূর্ণ:</strong> এটি একটি নমুনা প্রদর্শনী সিস্টেম। সকল তথ্য কাল্পনিক। এই সিস্টেম সরকারি ভূমি অফিসের সাথে সংযুক্ত নয়।
                    </div>
                  </div>
                  <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {[
                      { icon: <Clock size={14} />, text: 'কাগজপত্র কমে যায়' },
                      { icon: <CheckCircle size={14} />, text: 'স্বয়ংক্রিয় ত্রুটি শনাক্তকরণ' },
                      { icon: <Users size={14} />, text: 'কর্মকর্তার দক্ষতা বাড়ে' },
                      { icon: <Map size={14} />, text: 'জমির মানচিত্র দেখুন' },
                    ].map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-600)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--green)' }}>{f.icon}</span>
                        {f.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.7)', padding: '2rem 0', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: 'white', fontWeight: 700 }}>ভূপ্রহরী AI</span> — LandTech Innovation Hackathon 2026 প্রদর্শনী প্রকল্প
          </p>
          <p>সকল তথ্য সম্পূর্ণ কাল্পনিক। সরকারি নথি বা অনুমোদন নয়।</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
            Built with React, TypeScript, Leaflet, Zustand • Open-source dependencies acknowledged
          </p>
        </div>
      </footer>
    </div>
  );
}
