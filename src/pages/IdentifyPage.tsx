import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, ArrowRight, ChevronLeft, CheckCircle,
  ExternalLink, Sparkles, Layers, RotateCw, ShieldCheck, Compass, Check,
  Copy, Globe, Maximize2, Minimize2
} from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from 'react-leaflet';
import useAppStore from '../store/useAppStore';
import { DISTRICTS, UPAZILAS, MOUZAS, PARCELS } from '../data/demoData';
import type { Parcel } from '../types';
import { TRANSLATIONS, t } from '../utils/translations';

// Helper to reliably convert GeoJSON coordinates [[lng, lat]] to Leaflet [[lat, lng]]
function toLeafletPositions(coords: unknown): [number, number][] {
  if (!coords || !Array.isArray(coords)) return [];
  const ring = Array.isArray(coords[0]) && Array.isArray(coords[0][0]) ? coords[0] : coords;
  return ring.map((pt: any) => {
    if (!Array.isArray(pt) || pt.length < 2) return [23.85, 90.25];
    if (pt[0] > pt[1]) {
      return [pt[1], pt[0]];
    }
    return [pt[0], pt[1]];
  });
}

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
  const isBn = language === 'bn';

  // GIS View Mode: 'liveGov' (100% functional live national portal) vs 'aiOverlay' (vector cadastre)
  const [gisMode, setGisMode] = useState<'liveGov' | 'aiOverlay'>('liveGov');

  // Live Iframe controls
  const [iframeKey, setIframeKey] = useState(1);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLiveFullscreen, setIsLiveFullscreen] = useState(false);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);

  // Cascading Administrative Location Filters for AI Overlay mode
  const [selectedDivision, setSelectedDivision] = useState('ঢাকা');
  const [selectedDistrictId, setSelectedDistrictId] = useState('dist-01'); // Dhaka
  const [selectedUpazilaId, setSelectedUpazilaId] = useState('upz-01'); // Savar
  const [selectedMouzaId, setSelectedMouzaId] = useState('mzd-02'); // Pathalia
  const [searchDag, setSearchDag] = useState('৪৫৬');

  // Basemap style for AI Overlay: 'street' vs 'satellite'
  const [basemap, setBasemap] = useState<'street' | 'satellite'>('street');

  // Map viewport
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.8537, 90.2488]);
  const [mapZoom, setMapZoom] = useState(16);

  const getFieldValue = (k: keyof NonNullable<typeof extraction>['fields']) =>
    extraction?.fields[k]?.userCorrectedValue ?? extraction?.fields[k]?.value ?? '';

  // Synchronize with uploaded deed data on load
  const syncWithDeed = () => {
    const deedDag = getFieldValue('dagNumber') || '৪৫৬';
    setSearchDag(deedDag);

    const match = PARCELS.find(p => p.dagNumber === deedDag) || PARCELS[0];
    if (match) {
      setSelectedParcel(match);
      if (match.mouzaId) setSelectedMouzaId(match.mouzaId);
      if (match.upazila?.id) setSelectedUpazilaId(match.upazila.id);
      if (match.district?.id) setSelectedDistrictId(match.district.id);
      if (match.geometry?.centroid) {
        setMapCenter(match.geometry.centroid);
        setMapZoom(17);
      }
    }
  };

  useEffect(() => {
    syncWithDeed();
  }, [extraction]);

  const handleSelectParcel = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setSearchDag(parcel.dagNumber);
    if (parcel.mouzaId) setSelectedMouzaId(parcel.mouzaId);
    if (parcel.upazila?.id) setSelectedUpazilaId(parcel.upazila.id);
    if (parcel.geometry?.centroid) {
      setMapCenter(parcel.geometry.centroid);
      setMapZoom(17);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const filteredUpazilas = UPAZILAS.filter(u => u.districtId === selectedDistrictId);
  const filteredMouzas = MOUZAS.filter(m => m.upazilaId === selectedUpazilaId);
  const activeMouzaParcels = PARCELS.filter(p => p.mouzaId === selectedMouzaId);
  const displayParcels = activeMouzaParcels.length > 0 ? activeMouzaParcels : PARCELS;

  const handleSearch = () => {
    const found = PARCELS.find(p => p.dagNumber === searchDag && p.mouzaId === selectedMouzaId)
      || PARCELS.find(p => p.dagNumber === searchDag)
      || displayParcels[0];

    if (found) {
      setSelectedParcel(found);
      if (found.geometry?.centroid) {
        setMapCenter(found.geometry.centroid);
        setMapZoom(17);
      }
    }
  };

  const handleProceed = () => {
    setStep(4);
    navigate('/verify');
  };

  const activeParcel = selectedParcel || PARCELS[0];
  const deedDagVal = getFieldValue('dagNumber') || '৪৫৬';
  const isMatch = activeParcel?.dagNumber === deedDagVal;

  return (
    <div className="native-gis-page">
      {/* ── Page Header ── */}
      <div className="workspace-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="workspace-symbol">
            <Compass size={22} />
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

      {/* ── Mode Switcher: Live National Portal vs AI Vector Cadastre ── */}
      <div className="gis-main-mode-switcher">
        <button
          type="button"
          className={`gis-main-mode-tab ${gisMode === 'liveGov' ? 'active' : ''}`}
          onClick={() => setGisMode('liveGov')}
        >
          <Globe size={15} />
          <span>{t(TRANSLATIONS.gisMap.tabLiveGov, language)}</span>
          <span className="live-pulse-badge">LIVE 64 DISTRICTS</span>
        </button>

        <button
          type="button"
          className={`gis-main-mode-tab ${gisMode === 'aiOverlay' ? 'active' : ''}`}
          onClick={() => setGisMode('aiOverlay')}
        >
          <Layers size={15} />
          <span>{t(TRANSLATIONS.gisMap.tabAiOverlay, language)}</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MODE 1: 100% REAL LIVE NATIONAL PORTAL (map.land.gov.bd)
          Full-width, full-height, completely functional
         ══════════════════════════════════════════════════════════ */}
      {gisMode === 'liveGov' ? (
        <div className="live-gov-full-section">
          {/* Top Control Bar */}
          <div className="live-gov-control-bar">
            <div className="live-gov-status-group">
              <span className="capsule-live-dot" />
              <strong style={{ fontSize: '12.5px', color: '#176b56' }}>
                {t(TRANSLATIONS.gisMap.livePortalConnected, language)}
              </strong>
            </div>

            {/* Quick Deed Info Helper Chips */}
            <div className="live-gov-deed-chips">
              <div
                className="deed-quick-chip"
                onClick={() => copyToClipboard(deedDagVal, 'dag')}
                title={isBn ? 'ক্লিক করে দাগ নম্বর কপি করুন' : 'Click to copy Dag Number'}
              >
                <span>{isBn ? 'দলিলের দাগ:' : 'Deed Plot:'} <strong>{deedDagVal}</strong></span>
                <Copy size={11} />
                {copiedField === 'dag' && <span className="copied-bubble">{isBn ? 'কপি হয়েছে!' : 'Copied!'}</span>}
              </div>

              <div
                className="deed-quick-chip"
                onClick={() => copyToClipboard('পাথালিয়া', 'mouza')}
                title={isBn ? 'ক্লিক করে মৌজা কপি করুন' : 'Click to copy Mouza'}
              >
                <span>{isBn ? 'মৌজা:' : 'Mouza:'} <strong>{isBn ? 'পাথালিয়া (১৪৭)' : 'Pathalia (147)'}</strong></span>
                <Copy size={11} />
                {copiedField === 'mouza' && <span className="copied-bubble">{isBn ? 'কপি হয়েছে!' : 'Copied!'}</span>}
              </div>

              <div className="deed-quick-chip static">
                <span>{isBn ? 'সাভার, ঢাকা' : 'Savar, Dhaka'}</span>
              </div>
            </div>

            {/* Action Tools */}
            <div className="live-gov-actions">
              <button
                type="button"
                className="gis-action-btn"
                onClick={() => setIframeKey(k => k + 1)}
                title={isBn ? 'পোর্টাল রিফ্রেশ করুন' : 'Reload Portal'}
              >
                <RotateCw size={12} />
                <span>{isBn ? 'রিফ্রেশ' : 'Reload'}</span>
              </button>
              <button
                type="button"
                className="gis-action-btn"
                onClick={() => setIsLiveFullscreen(!isLiveFullscreen)}
                title={isLiveFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isLiveFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                <span>{isLiveFullscreen ? (isBn ? 'ছোট পর্দা' : 'Exit') : (isBn ? 'বড় পর্দা' : 'Fullscreen')}</span>
              </button>
              <a
                href="https://map.land.gov.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="gis-action-btn"
              >
                <span>{isBn ? 'নতুন উইন্ডো' : 'Open External'}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Full-Width Expansive Live Iframe Container */}
          <div className={`live-gov-canvas-container ${isLiveFullscreen ? 'is-fullscreen-canvas' : ''}`}>
            {isLiveFullscreen && (
              <button
                type="button"
                className="gov-fullscreen-close-btn"
                onClick={() => setIsLiveFullscreen(false)}
              >
                <Minimize2 size={14} />
                <span>{isBn ? 'পূর্ণ পর্দা বন্ধ করুন' : 'Exit Fullscreen'}</span>
              </button>
            )}

            <iframe
              key={iframeKey}
              src="https://map.land.gov.bd/"
              title="ভূমি নকশা — ভূমি মন্ত্রণালয়, বাংলাদেশ সরকার"
              className="live-gov-full-frame"
              allow="geolocation; fullscreen"
              loading="lazy"
            />

            {/* Floating Smart Deed Inspector Card */}
            <div className={`floating-deed-card ${isCardCollapsed ? 'collapsed' : ''}`}>
              <div className="floating-card-header" onClick={() => setIsCardCollapsed(!isCardCollapsed)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Sparkles size={14} color="#176b56" />
                  <strong>{t(TRANSLATIONS.gisMap.floatingCardTitle, language)}</strong>
                </div>
                <button type="button" className="collapse-btn">
                  {isCardCollapsed ? '▲' : '▼'}
                </button>
              </div>

              {!isCardCollapsed && (
                <div className="floating-card-body">
                  <div className="floating-spec-grid">
                    <div className="floating-spec-item">
                      <span className="spec-lbl">{isBn ? 'দাগ নম্বর' : 'Dag No'}</span>
                      <strong className="spec-val highlight">{deedDagVal}</strong>
                    </div>
                    <div className="floating-spec-item">
                      <span className="spec-lbl">{isBn ? 'মৌজা' : 'Mouza'}</span>
                      <strong className="spec-val">{isBn ? 'পাথালিয়া (১৪৭)' : 'Pathalia (147)'}</strong>
                    </div>
                    <div className="floating-spec-item">
                      <span className="spec-lbl">{isBn ? 'খতিয়ান' : 'Khatian'}</span>
                      <strong className="spec-val">খ-০১২</strong>
                    </div>
                    <div className="floating-spec-item">
                      <span className="spec-lbl">{isBn ? 'পরিমাণ' : 'Area'}</span>
                      <strong className="spec-val">৩৩ {isBn ? 'শতাংশ' : 'Dec'}</strong>
                    </div>
                  </div>

                  <div className="floating-match-pill">
                    <CheckCircle size={13} color="#176b56" />
                    <span>{isBn ? 'দলিলের তথ্য সম্পূর্ণ প্রস্তুত' : 'Deed records ready'}</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm floating-proceed-btn"
                    onClick={handleProceed}
                  >
                    <span>{t(TRANSLATIONS.gisMap.proceedVerify, language)}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Guidance Banner & Bottom Navigation */}
          <div className="live-gov-bottom-bar">
            <div className="live-gov-hint-text">
              <Sparkles size={14} color="#176b56" style={{ flexShrink: 0 }} />
              <span>{t(TRANSLATIONS.gisMap.searchHintBanner, language)}</span>
            </div>

            <div className="live-gov-bottom-nav">
              <button
                type="button"
                className="btn secondary sm"
                onClick={() => navigate('/review')}
              >
                <ChevronLeft size={14} />
                <span>{t(TRANSLATIONS.gisMap.backReview, language)}</span>
              </button>
              <button
                type="button"
                className="btn sm"
                onClick={handleProceed}
              >
                <span>{t(TRANSLATIONS.gisMap.proceedVerify, language)}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════
            MODE 2: AI PARCEL SYNC & HIGH-RES SATELLITE CADASTRE
            Leaflet Vector Boundaries, Centroid Pin, Comparison
           ══════════════════════════════════════════════════════════ */
        <div>
          {/* Native Cadastral GIS Administrative Filter Bar */}
          <div className="gis-filter-card">
            <div className="gis-filter-title-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span className="capsule-live-dot" />
                <strong style={{ fontSize: '13px', color: 'var(--deep)' }}>
                  {isBn ? 'প্রশাসনিক মৌজা ও দাগ অনুসন্ধান' : 'Administrative Cadastral Locator'}
                </strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  className="gis-action-btn sync-btn"
                  onClick={syncWithDeed}
                  title={t(TRANSLATIONS.gisMap.syncDeedBtn, language)}
                >
                  <Sparkles size={12} color="#176b56" />
                  <span>{t(TRANSLATIONS.gisMap.syncDeedBtn, language)}</span>
                </button>
                <button
                  type="button"
                  className="gis-action-btn"
                  onClick={() => {
                    setSelectedDistrictId('dist-01');
                    setSelectedUpazilaId('upz-01');
                    setSelectedMouzaId('mzd-02');
                    setMapCenter([23.8537, 90.2488]);
                    setMapZoom(16);
                  }}
                  title={t(TRANSLATIONS.gisMap.resetBtn, language)}
                >
                  <RotateCw size={12} />
                  <span>{t(TRANSLATIONS.gisMap.resetBtn, language)}</span>
                </button>
              </div>
            </div>

            <div className="gis-cascading-grid">
              {/* Division */}
              <div className="gis-input-group">
                <label>{t(TRANSLATIONS.gisMap.division, language)}</label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="gis-select"
                >
                  <option value="ঢাকা">{isBn ? 'ঢাকা' : 'Dhaka'}</option>
                  <option value="চট্টগ্রাম">{isBn ? 'চট্টগ্রাম' : 'Chattogram'}</option>
                  <option value="রাজশাহী">{isBn ? 'রাজশাহী' : 'Rajshahi'}</option>
                  <option value="খুলনা">{isBn ? 'খুলনা' : 'Khulna'}</option>
                  <option value="বরিশাল">{isBn ? 'বরিশাল' : 'Barishal'}</option>
                  <option value="সিলেট">{isBn ? 'সিলেট' : 'Sylhet'}</option>
                </select>
              </div>

              {/* District */}
              <div className="gis-input-group">
                <label>{t(TRANSLATIONS.gisMap.district, language)}</label>
                <select
                  value={selectedDistrictId}
                  onChange={(e) => {
                    setSelectedDistrictId(e.target.value);
                    const subUpzs = UPAZILAS.filter(u => u.districtId === e.target.value);
                    if (subUpzs.length > 0) setSelectedUpazilaId(subUpzs[0].id);
                  }}
                  className="gis-select"
                >
                  {DISTRICTS.map(d => (
                    <option key={d.id} value={d.id}>
                      {isBn ? d.nameBn : d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upazila */}
              <div className="gis-input-group">
                <label>{t(TRANSLATIONS.gisMap.upazila, language)}</label>
                <select
                  value={selectedUpazilaId}
                  onChange={(e) => {
                    setSelectedUpazilaId(e.target.value);
                    const subMouzas = MOUZAS.filter(m => m.upazilaId === e.target.value);
                    if (subMouzas.length > 0) setSelectedMouzaId(subMouzas[0].id);
                  }}
                  className="gis-select"
                >
                  {filteredUpazilas.map(u => (
                    <option key={u.id} value={u.id}>
                      {isBn ? u.nameBn : u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mouza */}
              <div className="gis-input-group">
                <label>{t(TRANSLATIONS.gisMap.mouza, language)}</label>
                <select
                  value={selectedMouzaId}
                  onChange={(e) => setSelectedMouzaId(e.target.value)}
                  className="gis-select"
                >
                  {filteredMouzas.map(m => (
                    <option key={m.id} value={m.id}>
                      {isBn ? m.nameBn : m.name} (JL: {m.jlNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dag Number */}
              <div className="gis-input-group">
                <label>{t(TRANSLATIONS.gisMap.dag, language)}</label>
                <input
                  type="text"
                  value={searchDag}
                  onChange={(e) => setSearchDag(e.target.value)}
                  className="gis-input"
                  placeholder="e.g. ৪৫৬"
                />
              </div>

              {/* Search Action */}
              <div className="gis-input-group action-cell">
                <button
                  type="button"
                  className="btn btn-sm gis-search-btn"
                  onClick={handleSearch}
                >
                  {t(TRANSLATIONS.gisMap.searchBtn, language)}
                </button>
              </div>
            </div>
          </div>

          {/* Main Map Split Layout */}
          <div className="split map-split" style={{ marginTop: 18 }}>
            {/* Left: Native GIS Map Canvas Card */}
            <div className="card pad" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="gis-map-top-bar">
                <div className="gis-legend-badges">
                  <span className="gis-legend-item active-plot">
                    <i className="legend-box" style={{ background: '#10b981', borderColor: '#064e3b' }} />
                    <span>{t(TRANSLATIONS.gisMap.legendSelected, language)} ({activeParcel?.dagNumber})</span>
                  </span>
                  <span className="gis-legend-item">
                    <i className="legend-box" style={{ background: '#dceee5', borderColor: '#79b69e' }} />
                    <span>{t(TRANSLATIONS.gisMap.legendAdjacent, language)}</span>
                  </span>
                  <span className="gis-mouza-tag">
                    {isBn ? 'পাথালিয়া মৌজা · আরএস জরিপ' : 'Pathalia Mouza · RS Cadastre'}
                  </span>
                </div>

                {/* Basemap Switcher */}
                <div className="basemap-pill-switcher">
                  <button
                    type="button"
                    className={`basemap-tab ${basemap === 'street' ? 'active' : ''}`}
                    onClick={() => setBasemap('street')}
                    title={t(TRANSLATIONS.gisMap.basemapStreet, language)}
                  >
                    <Layers size={13} />
                    <span>{t(TRANSLATIONS.gisMap.basemapStreet, language)}</span>
                  </button>
                  <button
                    type="button"
                    className={`basemap-tab ${basemap === 'satellite' ? 'active' : ''}`}
                    onClick={() => setBasemap('satellite')}
                    title={t(TRANSLATIONS.gisMap.basemapSatellite, language)}
                  >
                    <Compass size={13} />
                    <span>{t(TRANSLATIONS.gisMap.basemapSatellite, language)}</span>
                  </button>
                </div>
              </div>

              {/* Leaflet Interactive GIS Canvas */}
              <div className="map-wrap" style={{ height: 'clamp(420px, 60vh, 560px)', position: 'relative' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ width: '100%', height: '100%' }}
                  scrollWheelZoom={true}
                >
                  <MapFocus center={mapCenter} zoom={mapZoom} />

                  {basemap === 'street' ? (
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  ) : (
                    <TileLayer
                      attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      maxZoom={19}
                    />
                  )}

                  {displayParcels.map(p => {
                    if (!p.geometry?.coordinates) return null;
                    const isSelected = activeParcel?.id === p.id;
                    const positions = toLeafletPositions(p.geometry.coordinates);

                    return (
                      <Polygon
                        key={p.id}
                        positions={positions}
                        pathOptions={{
                          color: isSelected ? '#10b981' : (basemap === 'satellite' ? '#ffffff' : '#3d6c5b'),
                          weight: isSelected ? 4 : 2,
                          fillColor: isSelected ? '#10b981' : (basemap === 'satellite' ? '#10b981' : '#afd9bc'),
                          fillOpacity: isSelected ? 0.65 : (basemap === 'satellite' ? 0.25 : 0.4),
                          dashArray: isSelected ? undefined : '3, 4'
                        }}
                        eventHandlers={{
                          click: () => handleSelectParcel(p),
                        }}
                      >
                        <Tooltip permanent direction="center" className="cadastral-dag-label">
                          <span>{p.dagNumber}</span>
                        </Tooltip>
                      </Polygon>
                    );
                  })}
                </MapContainer>

                <div className="gis-map-overlay-badge">
                  <span>{isBn ? 'দাগে ক্লিক করে প্লট নির্বাচন করুন' : 'Click any plot polygon to inspect'}</span>
                </div>
              </div>

              <div className="gis-portal-footer-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={14} color="#176b56" />
                  <span style={{ fontSize: '11.5px', color: '#276553', fontWeight: 600 }}>
                    {t(TRANSLATIONS.gisMap.govStandardPill, language)}
                  </span>
                </div>
                <a
                  href="https://map.land.gov.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gis-gov-external-link"
                >
                  <span>{t(TRANSLATIONS.gisMap.openOfficialPortal, language)}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Right: Matched Parcel Specifications & Deed Verification */}
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
                  <span style={{ fontSize: '15px', color: 'var(--green)' }}>
                    {activeParcel?.dagNumber || '৪৫৬'}
                  </span>
                </div>
                <div className="info-line">
                  <span>{t(TRANSLATIONS.gisMap.mouza, language)}</span>
                  <span>
                    {activeParcel?.mouza
                      ? (isBn ? activeParcel.mouza.nameBn : activeParcel.mouza.name)
                      : (isBn ? 'পাথালিয়া' : 'Pathalia')} (JL: {activeParcel?.mouza?.jlNumber || '১৪৭'})
                  </span>
                </div>
                <div className="info-line">
                  <span>{t(TRANSLATIONS.gisMap.survey, language)}</span>
                  <span>{activeParcel?.surveyType || 'BS'}</span>
                </div>
                <div className="info-line">
                  <span>{t(TRANSLATIONS.gisMap.plotClass, language)}</span>
                  <span className="gis-class-pill">
                    {t(TRANSLATIONS.gisMap.plotClassVal, language)}
                  </span>
                </div>
                <div className="info-line">
                  <span>{t(TRANSLATIONS.gisMap.recordedArea, language)}</span>
                  <span style={{ fontWeight: 800 }}>
                    {activeParcel?.area || 33} {t(TRANSLATIONS.gisMap.decimals, language)}
                  </span>
                </div>
                <div className="info-line">
                  <span>{t(TRANSLATIONS.gisMap.khatian, language)}</span>
                  <span>{activeParcel?.currentKhatian || 'খ-০১২'}</span>
                </div>
                <div className="info-line">
                  <span>{t(TRANSLATIONS.gisMap.recordedOwner, language)}</span>
                  <span>
                    {activeParcel?.ownershipInterests?.[0]?.owner
                      ? (isBn ? activeParcel.ownershipInterests[0].owner.nameBn : activeParcel.ownershipInterests[0].owner.name)
                      : (isBn ? 'মোঃ রহিম উদ্দিন' : 'Md. Rahim Uddin')}
                  </span>
                </div>
                <div className="info-line">
                  <span>{t(TRANSLATIONS.gisMap.coordinates, language)}</span>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#557268' }}>
                    {activeParcel?.geometry?.centroid
                      ? `${activeParcel.geometry.centroid[0].toFixed(4)}° N, ${activeParcel.geometry.centroid[1].toFixed(4)}° E`
                      : '23.8537° N, 90.2488° E'}
                  </span>
                </div>
              </div>

              <div className="gis-conflict-assurance">
                <Check size={14} color="#176b56" />
                <span>{t(TRANSLATIONS.gisMap.noBoundaryDispute, language)}</span>
              </div>

              <div className="hintbox" style={{ marginTop: 14 }}>
                <CheckCircle size={16} />
                <div>
                  {t(TRANSLATIONS.gisMap.disclaimer, language)}
                </div>
              </div>

              <div className="btn-row" style={{ marginTop: 22 }}>
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
      )}
    </div>
  );
}
