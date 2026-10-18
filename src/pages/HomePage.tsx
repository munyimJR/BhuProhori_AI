import { useNavigate } from 'react-router-dom';
import {
  Upload, Map, Award, ArrowRight, ArrowUpRight, Lock, Layers,
  MapPin, Shield, CheckCircle, AlertTriangle, FileText, ChevronRight
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { TRANSLATIONS } from '../utils/translations';
import paddyImage from '../assets/paddy-green-to-gold.png';

export default function HomePage() {
  const navigate = useNavigate();
  const { loadDemoScenario, resetJourney, language } = useAppStore();
  const tHome = TRANSLATIONS.home;

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
        </div>

        <div className="hero-side">
          <img
            className="paddy-hero-image"
            src={paddyImage}
            alt={tHome.photoCredit[language]}
            width="1536"
            height="1024"
          />
          <span className="photo-credit">{tHome.photoCredit[language]}</span>
          <span className="map-demo-label">
            <Layers size={14} />
            {tHome.growthLabel[language]}
          </span>

          <div className="plot-preview">
            <div className="plot-preview-top">
              <span className="plot-symbol">
                <MapPin size={16} />
              </span>
              <div>
                <strong>{tHome.plotPreviewTitle[language]}</strong>
                <small style={{ color: 'var(--muted)', display: 'block', fontSize: '10px' }}>
                  {tHome.plotPreviewSub[language]}
                </small>
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
            </div>
            <button className="plot-link" onClick={() => navigate('/identify')}>
              {tHome.viewSampleMap[language]} <ArrowRight size={12} />
            </button>
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
