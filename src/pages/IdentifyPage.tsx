import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Map as MapIcon, ArrowRight, ChevronLeft, CheckCircle, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import useAppStore from '../store/useAppStore';
import { PARCELS } from '../data/demoData';
import type { Parcel } from '../types';

function MapFocus({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export default function IdentifyPage() {
  const navigate = useNavigate();
  const { extraction, setSelectedParcel, selectedParcel, setStep } = useAppStore();
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.83, 90.38]);
  const [mapZoom, setMapZoom] = useState(14);

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
            <h1 className="title">জমিটি শনাক্ত করুন</h1>
            <p className="desc" style={{ margin: 0 }}>
              সাধারণ ব্যবহারকারীকে নকশায় জমি খুঁজতে হবে না—দলিলের তথ্য থেকে সম্ভাব্য প্লট দেখানো হবে।
            </p>
          </div>
        </div>
        <span className="workspace-label">জমির পরিচিতি</span>
      </div>

      {/* Map Split Layout */}
      <div className="split map-split">
        {/* Left: Leaflet GIS Map */}
        <div className="card pad">
          <div className="panel-head">
            <div>
              <h2>জমির অবস্থান ও নকশা</h2>
              <p>এটি কাল্পনিক জমির নকশা; সরকারি প্লট ডেটা নয়।</p>
            </div>
            <span className="pill">DEMO GEOJSON</span>
          </div>

          <div className="map-legend">
            <span>
              <i className="legend-selected"></i> নির্বাচিত দাগ
            </span>
            <span>
              <i style={{ width: 12, height: 12, background: '#dce8e2', border: '1px solid #79b69e', borderRadius: 3, display: 'inline-block' }}></i> নমুনা সীমানা
            </span>
            <span>RS · ডেমো মৌজা</span>
          </div>

          <div className="map-wrap" style={{ height: 'clamp(280px, 45vh, 400px)' }}>
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
                        <strong>দাগ নম্বর: {p.dagNumber}</strong>
                        <div>খতিয়ান: {p.currentKhatian}</div>
                        <div>জমির পরিমাণ: {p.area} শতাংশ</div>
                      </div>
                    </Popup>
                  </Polygon>
                );
              })}
            </MapContainer>
          </div>

          <div className="map-caption" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, fontSize: 11, color: 'var(--muted)' }}>
            <span>নমুনা দাগে ক্লিক করে বিস্তারিত দেখুন</span>
            <a
              href="https://map.land.gov.bd/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              সরকারি ভূমি নকশা <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Right: Matched Parcel Details */}
        <div className="card pad">
          <div className="panel-head">
            <div>
              <h2>সম্ভাব্য জমি পাওয়া গেছে</h2>
              <p>দলিলের সঙ্গে মিলিয়ে দেখুন</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green)', fontWeight: 700, fontSize: 13 }}>
              <MapPin size={18} />
              <span>নির্বাচিত জমির বিবরণ</span>
            </div>
            <span className={`pill ${isMatch ? '' : 'warn'}`}>
              {isMatch ? 'নমুনা মিল' : 'ম্যানুয়াল নির্বাচন'}
            </span>
          </div>

          <div className="info-list">
            <div className="info-line">
              <span>দাগ নম্বর</span>
              <span>{activeParcel?.dagNumber || '১২৫'}</span>
            </div>
            <div className="info-line">
              <span>মৌজা</span>
              <span>{activeParcel?.mouza?.nameBn || 'ডেমো মৌজা'}</span>
            </div>
            <div className="info-line">
              <span>জরিপ</span>
              <span>{activeParcel?.surveyType || 'RS'}</span>
            </div>
            <div className="info-line">
              <span>রেকর্ডকৃত প্লটের পরিমাণ</span>
              <span>{activeParcel?.area || 20} শতাংশ</span>
            </div>
            <div className="info-line">
              <span>খতিয়ান</span>
              <span>{activeParcel?.currentKhatian || '২৫৬'}</span>
            </div>
            <div className="info-line">
              <span>রেকর্ডকৃত মালিক</span>
              <span>{activeParcel?.ownershipInterests?.[0]?.owner?.nameBn || 'মোঃ রহিম উদ্দিন'}</span>
            </div>
          </div>

          <div className="hintbox" style={{ marginTop: 20 }}>
            <CheckCircle size={16} />
            <div>
              নকশার চিত্রটি শুধু জমি শনাক্ত করার সহায়ক। এটি নিজে মালিকানা প্রমাণ করে না।
            </div>
          </div>

          <div className="btn-row" style={{ marginTop: 24 }}>
            <button className="btn" onClick={handleProceed} style={{ width: '100%' }}>
              যাচাইয়ের ফলাফল দেখুন → <ArrowRight size={14} />
            </button>
            <button className="btn secondary sm" onClick={() => navigate('/review')} style={{ width: '100%' }}>
              <ChevronLeft size={14} /> তথ্য পর্যালোচনায় ফিরুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
