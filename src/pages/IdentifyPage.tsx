import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Map as MapIcon, ArrowRight, ChevronLeft, CheckCircle,
  ExternalLink, RotateCw, Landmark, Layers, Sparkles, Maximize2, Minimize2
} from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import useAppStore from '../store/useAppStore';
import { PARCELS } from '../data/demoData';
import type { Parcel } from '../types';
import { TRANSLATIONS, t } from '../utils/translations';

function MapFocus({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export default function IdentifyPage() {
  const navigate = useNavigate();
  const { extraction, setSelectedParcel, selectedParcel, setStep, language } = useAppStore();
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.83, 90.38]);
  const [mapZoom, setMapZoom] = useState(14);

  // Dual-mode state: 'gov' (https://map.land.gov.bd) or 'ai' (Leaflet CAD GIS)
  const [mapMode, setMapMode] = useState<'gov' | 'ai'>('gov');
  const [iframeKey, setIframeKey] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getFieldValue = (k: keyof NonNullable<typeof extraction>['fields']) =>
    extraction?.fields[k]?.userCorrectedValue ?? extraction?.fields[k]?.value ?? '';

  useEffect(() => {
    if (extraction) {
      const dag = getFieldValue('dagNumber');
      const match = PARCELS.find(p => p.dagNumber === dag) || PARCELS[0];
      if (match) {
        setSelectedParcel(match);
        if (match.geometry?.centroid) {
          setMapCenter(match.geometry.centroid);
          setMapZoom(16);
        }
      }
    }
  }, [extraction]);

  const handleSelectParcel = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    if (parcel.geometry?.centroid) {
      setMapCenter(parcel.geometry.centroid);
      setMapZoom(16);
    }
  };

  const handleProceed = () => {
    setStep(4);
    navigate('/verify');
  };

  const activeParcel = selectedParcel || PARCELS[0];
  const dagVal = getFieldValue('dagNumber');
  const isMatch = activeParcel?.dagNumber === dagVal;

  return (
    <div>
      {/* Workspace Heading */}
      <div className="workspace-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="workspace-symbol">
            <MapIcon size={22} />
          </div>
          <div>
            <h1 className="title">{t(TRANSLATIONS.gisMap.pageTitle, language)}</h1>
            <p className="desc" style={{ margin: 0 }}>
              {t(TRANSLATIONS.gisMap.pageSubtitle, language)}
            </p>
          </div>
        </div>
        <span className="workspace-label">{t(TRANSLATIONS.gisMap.badge, language)}</span>
      </div>

      {/* Map Split Layout */}
      <div className="split map-split">
        {/* Left: Dual Mode GIS Map Card */}
        <div className="card pad">
          {/* Dual-Mode Selector Tabs */}
          <div className="map-view-switcher" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mapMode === 'gov'}
              className={`map-view-tab ${mapMode === 'gov' ? 'active' : ''}`}
              onClick={() => setMapMode('gov')}
            >
              <Landmark size={14} />
              <span>{t(TRANSLATIONS.gisMap.tabGovMap, language)}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mapMode === 'ai'}
              className={`map-view-tab ${mapMode === 'ai' ? 'active' : ''}`}
              onClick={() => setMapMode('ai')}
            >
              <Layers size={14} />
              <span>{t(TRANSLATIONS.gisMap.tabAiParcel, language)}</span>
            </button>
          </div>

          {/* ── Mode 1: Live Government Land Map (map.land.gov.bd) ── */}
          {mapMode === 'gov' ? (
            <div>
              <div className="panel-head">
                <div>
                  <h2>{t(TRANSLATIONS.gisMap.govMapTitle, language)}</h2>
                  <p>{t(TRANSLATIONS.gisMap.govMapSub, language)}</p>
                </div>
                <span className="pill" style={{ background: '#eaf6ef', color: '#176b56' }}>
                  <span className="capsule-live-dot" style={{ width: 6, height: 6 }} />
                  {t(TRANSLATIONS.gisMap.liveBadge, language)}
                </span>
              </div>

              {/* Embedded Gov Map Frame */}
              <div className="gov-map-container">
                <div className="gov-map-toolbar">
                  <div className="gov-map-toolbar-left">
                    <span className="gov-domain-badge">https://map.land.gov.bd</span>
                  </div>
                  <div className="gov-map-toolbar-right">
                    <button
                      type="button"
                      className="gov-tool-btn"
                      onClick={() => setIframeKey(k => k + 1)}
                      title={t(TRANSLATIONS.gisMap.reload, language)}
                    >
                      <RotateCw size={12} />
                      <span>{t(TRANSLATIONS.gisMap.reload, language)}</span>
                    </button>
                    <button
                      type="button"
                      className="gov-tool-btn"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                      {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                      <span>{isFullscreen ? (language === 'bn' ? 'ছোট পর্দা' : 'Exit') : (language === 'bn' ? 'বড় পর্দা' : 'Fullscreen')}</span>
                    </button>
                    <a
                      href="https://map.land.gov.bd/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gov-tool-btn"
                    >
                      <span>{t(TRANSLATIONS.gisMap.openNewTab, language)}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                <div className={`gov-iframe-wrapper ${isFullscreen ? 'is-fullscreen' : ''}`}>
                  {isFullscreen && (
                    <button
                      type="button"
                      className="gov-fullscreen-close-btn"
                      onClick={() => setIsFullscreen(false)}
                    >
                      <Minimize2 size={14} />
                      <span>{language === 'bn' ? 'পূর্ণ পর্দা বন্ধ করুন' : 'Exit Fullscreen'}</span>
                    </button>
                  )}
                  <iframe
                    key={iframeKey}
                    src="https://map.land.gov.bd/"
                    title="ভূমি নকশা - বাংলাদেশ সরকার (Ministry of Land, Bangladesh)"
                    className="gov-map-frame"
                    allow="geolocation; fullscreen"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Search Tip Guidance Callout */}
              <div className="gov-map-guide-hint">
                <Sparkles size={14} color="#176b56" style={{ flexShrink: 0 }} />
                <span>{t(TRANSLATIONS.gisMap.searchTip, language)}</span>
              </div>
            </div>
          ) : (
            /* ── Mode 2: AI Parcel Sync (CAD GeoJSON Vector Map) ── */
            <div>
              <div className="panel-head">
                <div>
                  <h2>{t(TRANSLATIONS.gisMap.aiMapTitle, language)}</h2>
                  <p>{t(TRANSLATIONS.gisMap.aiMapSub, language)}</p>
                </div>
                <span className="pill">AI VECTOR GEOJSON</span>
              </div>

              <div className="map-legend">
                <span>
                  <i className="legend-selected"></i> {t(TRANSLATIONS.gisMap.selectedDag, language)}
                </span>
                <span>
                  <i style={{ width: 12, height: 12, background: '#dce8e2', border: '1px solid #79b69e', borderRadius: 3, display: 'inline-block' }}></i> {t(TRANSLATIONS.gisMap.sampleBoundary, language)}
                </span>
                <span>{t(TRANSLATIONS.gisMap.mouzaLabel, language)}</span>
              </div>

              <div className="map-wrap" style={{ height: 'clamp(320px, 50vh, 440px)' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ width: '100%', height: '100%' }}
                  scrollWheelZoom={false}
                >
                  <MapFocus center={mapCenter} zoom={mapZoom} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {PARCELS.map(p => {
                    if (!p.geometry?.coordinates) return null;
                    const isSelected = activeParcel?.id === p.id;
                    return (
                      <Polygon
                        key={p.id}
                        positions={p.geometry.coordinates as unknown as [number, number][]}
                        pathOptions={{
                          color: isSelected ? '#1b725c' : '#577b6c',
                          weight: isSelected ? 4 : 2,
                          fillColor: isSelected ? '#68b49c' : '#afd9bc',
                          fillOpacity: isSelected ? 0.8 : 0.45,
                        }}
                        eventHandlers={{
                          click: () => handleSelectParcel(p),
                        }}
                      >
                        <Popup>
                          <div style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            <strong>{t(TRANSLATIONS.gisMap.dagNo, language)}: {p.dagNumber}</strong>
                            <div>{t(TRANSLATIONS.gisMap.khatian, language)}: {p.currentKhatian}</div>
                            <div>{t(TRANSLATIONS.gisMap.recordedArea, language)}: {p.area} {t(TRANSLATIONS.gisMap.decimals, language)}</div>
                          </div>
                        </Popup>
                      </Polygon>
                    );
                  })}
                </MapContainer>
              </div>

              <div className="map-caption" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, fontSize: 11, color: 'var(--muted)' }}>
                <span>{t(TRANSLATIONS.gisMap.clickDagHint, language)}</span>
                <button
                  type="button"
                  onClick={() => setMapMode('gov')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--green)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600, padding: 0 }}
                >
                  {t(TRANSLATIONS.gisMap.tabGovMap, language)} ➔
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Matched Parcel Details */}
        <div className="card pad">
          <div className="panel-head">
            <div>
              <h2>{t(TRANSLATIONS.gisMap.matchedTitle, language)}</h2>
              <p>{t(TRANSLATIONS.gisMap.matchedSub, language)}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green)', fontWeight: 700, fontSize: 13 }}>
              <MapPin size={18} />
              <span>{t(TRANSLATIONS.gisMap.parcelDetails, language)}</span>
            </div>
            <span className={`pill ${isMatch ? '' : 'warn'}`}>
              {isMatch ? t(TRANSLATIONS.gisMap.sampleMatch, language) : t(TRANSLATIONS.gisMap.manualSelect, language)}
            </span>
          </div>

          <div className="info-list">
            <div className="info-line">
              <span>{t(TRANSLATIONS.gisMap.dagNo, language)}</span>
              <span>{activeParcel?.dagNumber || '১২৫'}</span>
            </div>
            <div className="info-line">
              <span>{t(TRANSLATIONS.gisMap.mouza, language)}</span>
              <span>{activeParcel?.mouza ? (language === 'bn' ? activeParcel.mouza.nameBn : activeParcel.mouza.name) : (language === 'bn' ? 'ডেমো মৌজা' : 'Demo Mouza')}</span>
            </div>
            <div className="info-line">
              <span>{t(TRANSLATIONS.gisMap.survey, language)}</span>
              <span>{activeParcel?.surveyType || 'RS'}</span>
            </div>
            <div className="info-line">
              <span>{t(TRANSLATIONS.gisMap.recordedArea, language)}</span>
              <span>{activeParcel?.area || 20} {t(TRANSLATIONS.gisMap.decimals, language)}</span>
            </div>
            <div className="info-line">
              <span>{t(TRANSLATIONS.gisMap.khatian, language)}</span>
              <span>{activeParcel?.currentKhatian || '২৫৬'}</span>
            </div>
            <div className="info-line">
              <span>{t(TRANSLATIONS.gisMap.recordedOwner, language)}</span>
              <span>
                {activeParcel?.ownershipInterests?.[0]?.owner
                  ? (language === 'bn' ? activeParcel.ownershipInterests[0].owner.nameBn : activeParcel.ownershipInterests[0].owner.name)
                  : (language === 'bn' ? 'মোঃ রহিম উদ্দিন' : 'Md. Rahim Uddin')}
              </span>
            </div>
          </div>

          <div className="hintbox" style={{ marginTop: 20 }}>
            <CheckCircle size={16} />
            <div>
              {t(TRANSLATIONS.gisMap.disclaimer, language)}
            </div>
          </div>

          <div className="btn-row" style={{ marginTop: 24 }}>
            <button className="btn" onClick={handleProceed} style={{ width: '100%' }}>
              {t(TRANSLATIONS.gisMap.proceedVerify, language)} <ArrowRight size={14} />
            </button>
            <button className="btn secondary sm" onClick={() => navigate('/review')} style={{ width: '100%' }}>
              <ChevronLeft size={14} /> {t(TRANSLATIONS.gisMap.backReview, language)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
