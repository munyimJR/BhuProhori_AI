import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Map, Award, ArrowRight, ArrowUpRight, Lock, Layers,
  MapPin, Shield, CheckCircle, AlertTriangle, FileText, ChevronRight,
  ChevronLeft
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { TRANSLATIONS } from '../utils/translations';
import slide1 from '../assets/slide_image_1.jpg';
import slide2 from '../assets/slide_image_2.jpg';
import slide3 from '../assets/slide_image_3.jpg';
import slide4 from '../assets/slide_image_4.jpg';
import paddyImage from '../assets/paddy-green-to-gold.png';

const HERO_SLIDES = [
  {
    src: slide1,
    title: { bn: 'ড্রোন জিআইএস পার্সেল ভিউ', en: 'Drone GIS Parcel View' },
    credit: { bn: 'আকাশ থেকে ফসলি জমির দাগ ও সীমানা', en: 'Aerial cadastral plots & agricultural boundaries' },
  },
  {
    src: slide3,
    title: { bn: 'প্রকৃত মৌজা নকশা (কুমিল্লা সদর)', en: 'Official Mouza Map (Cumilla)' },
    credit: { bn: 'জে.এল ২৩৭ সিট নকশা রেকর্ড', en: 'J.L 237 Cadastral Sheet Record' },
  },
  {
    src: slide2,
    title: { bn: 'স্যাটেলাইট গ্রিড ও খতিয়ান বণ্টন', en: 'Satellite Grid & Parcel Division' },
    credit: { bn: 'কৃষি পার্সেল ও খতিয়ান বণ্টন', en: 'Cadastral land boundaries & divisions' },
  },
  {
    src: slide4,
    title: { bn: 'ঢাকা জেলা মৌজা নকশা সিট', en: 'Dhaka Cadastral Mouza Sheet' },
    credit: { bn: 'ভূমি রেকর্ড ও জরিপ অধিদপ্তর', en: 'Department of Land Records & Survey' },
  },
  {
    src: paddyImage,
    title: { bn: 'মাটি ও ফসলি জমি', en: 'Soil & Agricultural Land' },
    credit: { bn: 'সবুজ থেকে সোনালি ধানক্ষেত', en: 'Lush green to golden harvest' },
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { loadDemoScenario, resetJourney, language } = useAppStore();
  const tHome = TRANSLATIONS.home;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleStartUpload = () => {
    resetJourney();
    navigate('/upload');
  };

  const handleStartDemo = (scenario = 1) => {
    loadDemoScenario(scenario);
    navigate('/review');
  };

  const scenarioIcons: Record<number, React.ReactNode> = {
    1: <CheckCircle size={18} color="var(--green)" />,
    2: <AlertTriangle size={18} color="var(--amber)" />,
    3: <AlertTriangle size={18} color="var(--amber)" />,
    4: <AlertTriangle size={18} color="var(--red)" />,
    5: <Shield size={18} color="var(--red)" />,
    6: <AlertTriangle size={18} color="var(--amber)" />,
    7: <FileText size={18} color="var(--red)" />,
    8: <AlertTriangle size={18} color="var(--amber)" />,
  };

  return (
    <div>
      {/* Welcome line */}
      <div className="welcome-line">
        <span>{tHome.welcomeLine[language]}</span>
        <span className="welcome-meta">{tHome.hackathonTag}</span>
      </div>

      {/* Hero Card */}
      <div className="hero card">
        <div className="hero-copy">
          <h1>
            {tHome.heroH1Pre[language]}<br />
            <span>{tHome.heroH1Bold[language]}</span>
          </h1>
          <p>
            {tHome.heroDesc[language]}
          </p>

          <div className="btn-row">
            <button className="btn" onClick={handleStartUpload}>
              {tHome.startWithDeed[language]} <ArrowRight size={16} />
            </button>
            <button className="hero-link" onClick={() => handleStartDemo(1)}>
              {tHome.trySample[language]} <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="hero-assurance">
            <Lock size={14} color="#176b56" />
            <span>{tHome.noServerNote[language]}</span>
          </div>

          <div className="hero-plot-preview-bar">
            <div className="plot-preview-top">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="plot-symbol">
                  <MapPin size={14} />
                </span>
                <div>
                  <strong>{tHome.plotPreviewTitle[language]}</strong>
                  <span style={{ color: 'var(--muted)', marginLeft: 6, fontSize: '11px' }}>
                    ({tHome.plotPreviewSub[language]})
                  </span>
                </div>
              </div>
              <span className="sample-tag">{language === 'bn' ? 'নমুনা' : 'Sample'}</span>
            </div>
            <div className="plot-preview-data">
              <div><small>{tHome.dagNo[language]}</small><b>{language === 'bn' ? '১২৫' : '125'}</b></div>
              <div><small>{tHome.khatianNo[language]}</small><b>{language === 'bn' ? '২৫৬' : '256'}</b></div>
              <div>
                <small>{tHome.landArea[language]}</small>
                <b>{language === 'bn' ? '২০' : '20'} <em>{tHome.decimalUnit[language]}</em></b>
              </div>
              <button type="button" className="plot-link" onClick={() => navigate('/identify')}>
                {tHome.viewSampleMap[language]} <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        <div
          className="hero-side hero-slider-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide-item ${index === currentSlide ? 'active' : ''}`}
            >
              <img
                className="paddy-hero-image"
                src={slide.src}
                alt={slide.title[language]}
                width="1536"
                height="1024"
              />
            </div>
          ))}

          {/* Dynamic slide badges */}
          <span className="photo-credit">
            {HERO_SLIDES[currentSlide].credit[language]}
          </span>
          <span className="map-demo-label">
            <Layers size={14} />
            {HERO_SLIDES[currentSlide].title[language]}
          </span>

          {/* Previous / Next slide buttons */}
          <button
            type="button"
            className="slider-arrow prev"
            onClick={handlePrevSlide}
            aria-label={language === 'bn' ? 'পূর্ববর্তী ছবি' : 'Previous slide'}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="slider-arrow next"
            onClick={handleNextSlide}
            aria-label={language === 'bn' ? 'পরবর্তী ছবি' : 'Next slide'}
          >
            <ChevronRight size={16} />
          </button>

          {/* Slider pagination dots & counter */}
          <div className="slider-controls">
            <div className="slider-dots">
              {HERO_SLIDES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  className={`slider-dot ${dotIdx === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(dotIdx)}
                  aria-label={`Slide ${dotIdx + 1}`}
                />
              ))}
            </div>
            <span className="slider-counter">
              {language === 'bn'
                ? `${['১', '২', '৩', '৪', '৫'][currentSlide]} / ৫`
                : `${currentSlide + 1} / ${HERO_SLIDES.length}`}
            </span>
          </div>
        </div>
      </div>

      {/* Action / Services grid */}
      <div className="section-heading">
        <h2 className="section-title">{tHome.sectionTitle[language]}</h2>
        <span>{tHome.sectionSub[language]}</span>
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
          <h3>{tHome.service1Title[language]}</h3>
          <p>{tHome.service1Desc[language]}</p>
          <span className="service-foot">
            {tHome.service1Action[language]} <ArrowRight size={14} />
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
          <h3>{tHome.service2Title[language]}</h3>
          <p>{tHome.service2Desc[language]}</p>
          <span className="service-foot">
            {tHome.service2Action[language]} <ArrowRight size={14} />
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
          <h3>{tHome.service3Title[language]}</h3>
          <p>{tHome.service3Desc[language]}</p>
          <span className="service-foot">
            {tHome.service3Action[language]} <ArrowRight size={14} />
          </span>
        </div>
      </div>

      {/* Growth story banner */}
      <div className="growth-story">
        <div>
          <strong>
            <span className="growth-dot"></span>
            {tHome.storyTitle[language]}
          </strong>
          <p>{tHome.storyDesc[language]}</p>
        </div>
        <div className="growth-colors" aria-label="সবুজ থেকে সোনালি রঙের ধাপ">
          <span>{tHome.storyStep1[language]}</span>
          <span>{tHome.storyStep2[language]}</span>
          <span>{tHome.storyStep3[language]}</span>
        </div>
      </div>

      {/* How it works */}
      <div className="how-it-works">
        <div className="how-intro">
          <h2>
            {tHome.howTitlePre[language]}<br />
            <span>{tHome.howTitleBold[language]}</span>
          </h2>
          <p>{tHome.howSub[language]}</p>
        </div>
        <ol className="journey">
          <li>
            <span className="journey-number">{language === 'bn' ? '০১' : '01'}</span>
            <div>
              <h3>{tHome.step1Title[language]}</h3>
              <p>{tHome.step1Desc[language]}</p>
            </div>
          </li>
          <li>
            <span className="journey-number">{language === 'bn' ? '০২' : '02'}</span>
            <div>
              <h3>{tHome.step2Title[language]}</h3>
              <p>{tHome.step2Desc[language]}</p>
            </div>
          </li>
          <li>
            <span className="journey-number">{language === 'bn' ? '০৩' : '03'}</span>
            <div>
              <h3>{tHome.step3Title[language]}</h3>
              <p>{tHome.step3Desc[language]}</p>
            </div>
          </li>
        </ol>
      </div>

      {/* Interactive Hackathon Scenarios Picker */}
      <div style={{ marginTop: '2.5rem' }}>
        <div className="section-heading">
          <h2 className="section-title">{tHome.scenariosTitle[language]}</h2>
          <span>{tHome.scenariosSub[language]}</span>
        </div>

        <div className="grid two">
          {tHome.scenarios.map(s => (
            <div
              key={s.id}
              className="card pad"
              style={{ cursor: 'pointer', transition: 'all 0.2s', display: 'flex', gap: 14, alignItems: 'flex-start' }}
              onClick={() => handleStartDemo(s.id)}
              role="button"
              tabIndex={0}
            >
              <div style={{ marginTop: 2 }}>{scenarioIcons[s.id]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--deep)', marginBottom: 4 }}>
                  {s.title[language]}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {s.desc[language]}
                </div>
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
          <strong>{tHome.transparencyTitle[language]}</strong> {tHome.transparencyDesc[language]}
        </p>
      </div>
    </div>
  );
}
