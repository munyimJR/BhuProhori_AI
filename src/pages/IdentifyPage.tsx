import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, Info, Loader2, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import useAppStore from '../store/useAppStore';
import { PARCELS } from '../data/demoData';
import type { Parcel, ParcelMatchResult } from '../types';

// Helper to recenter map
function MapFocus({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom, { animate: true }); }, [center, zoom, map]);
  return null;
}

function matchParcels(extraction: ReturnType<typeof useAppStore.getState>['extraction']): ParcelMatchResult[] {
  if (!extraction) return [];
  const fields = extraction.fields;
  const getVal = (k: keyof typeof fields) => (fields[k]?.userCorrectedValue ?? fields[k]?.value ?? '').trim();

  const dag = getVal('dagNumber');
  const khatian = getVal('khatianNumber');
  const mouza = getVal('mouza');
  const survey = getVal('surveyType');
  const jl = getVal('jlNumber');

  return PARCELS.map(p => {
    const matchedFields: string[] = [];
    const unmatchedFields: string[] = [];

    if (dag && p.dagNumber === dag) matchedFields.push('দাগ নম্বর');
    else if (dag) unmatchedFields.push(`দাগ নম্বর (দলিল: ${dag}, রেকর্ড: ${p.dagNumber})`);

    if (khatian && p.currentKhatian === khatian) matchedFields.push('খতিয়ান নম্বর');
    else if (khatian) unmatchedFields.push('খতিয়ান নম্বর');

    if (mouza && p.mouza?.nameBn === mouza) matchedFields.push('মৌজা');
    else if (mouza) unmatchedFields.push('মৌজা');

    if (survey && p.surveyType === survey) matchedFields.push('জরিপের ধরন');
    else if (survey) unmatchedFields.push('জরিপের ধরন');

    if (jl && p.mouza?.jlNumber === jl) matchedFields.push('জে.এল. নম্বর');

    const score = matchedFields.length / Math.max(unmatchedFields.length + matchedFields.length, 1);
    return { parcel: p, confidence: score, matchedFields, unmatchedFields, isAmbiguous: score < 0.6 };
  })
    .filter(r => r.confidence > 0.3)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}

export default function IdentifyPage() {
  const navigate = useNavigate();
  const { extraction, setSelectedParcel, selectedParcel, setStep } = useAppStore();
  const [matches, setMatches] = useState<ParcelMatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.8, 90.35]);
  const [mapZoom, setMapZoom] = useState(11);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const results = matchParcels(extraction);
      setMatches(results);
      setLoading(false);
      if (results.length > 0 && results[0].confidence > 0.7) {
        const top = results[0].parcel;
        setSelectedParcel(top);
        if (top.geometry?.centroid) {
          setMapCenter(top.geometry.centroid);
          setMapZoom(15);
        }
      }
    }, 1800);
  }, [extraction]);

  const handleSelectParcel = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    if (parcel.geometry?.centroid) {
      setMapCenter(parcel.geometry.centroid);
      setMapZoom(16);
    }
  };

  const handleProceed = () => { setStep(4); navigate('/verification'); };

  if (!extraction) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>প্রথমে দলিল আপলোড করুন</h2>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/upload')}>আপলোড পেজে যান</button>
      </div>
    );
  }

  const fields = extraction.fields;
  const getVal = (k: keyof typeof fields) => fields[k]?.userCorrectedValue ?? fields[k]?.value ?? '';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--page-bg)', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/review')}><ChevronLeft size={14} />পেছনে</button>
            </div>
            <h1 style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '1.625rem' }}>জমি চিহ্নিতকরণ ও মানচিত্র</h1>
            <p style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>
              দলিলের তথ্য মিলিয়ে নমুনা জমির দাগ খোঁজা হচ্ছে
            </p>
          </div>
          <div className="demo-banner">
            <AlertTriangle size={12} />কাল্পনিক নমুনা দাগ — সরকারি ক্যাডাস্ট্রাল ডেটা নয়
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem' }}>
          {/* Left: Matches */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Extracted key fields */}
            <div className="card">
              <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}>
                দলিল থেকে পড়া তথ্য
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {[
                  { label: 'জেলা', val: getVal('district') },
                  { label: 'উপজেলা', val: getVal('upazila') },
                  { label: 'মৌজা', val: getVal('mouza') },
                  { label: 'জে.এল. নম্বর', val: getVal('jlNumber') },
                  { label: 'জরিপের ধরন', val: getVal('surveyType') },
                  { label: 'দাগ নম্বর', val: getVal('dagNumber') },
                  { label: 'খতিয়ান নম্বর', val: getVal('khatianNumber') },
                  { label: 'জমির পরিমাণ', val: getVal('landArea') },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif' }}>{row.label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--dark)' }}>{row.val || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Match results */}
            <div className="card">
              <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}>
                {loading ? 'মিলানো হচ্ছে...' : `${matches.length}টি সম্ভাব্য দাগ পাওয়া গেছে`}
              </div>
              <div className="card-body" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem', justifyContent: 'center' }}>
                    <Loader2 size={20} color="var(--green)" className="animate-spin" />
                    <span style={{ fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--gray-500)' }}>দাগ মিলানো হচ্ছে...</span>
                  </div>
                ) : matches.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--gray-400)' }}>কোনো মিল পাওয়া যায়নি</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', fontFamily: 'Hind Siliguri, sans-serif', marginTop: '0.25rem' }}>তথ্য সংশোধন করে পুনরায় চেষ্টা করুন</div>
                  </div>
                ) : (
                  matches.map(match => (
                    <div
                      key={match.parcel.id}
                      className={`parcel-card ${selectedParcel?.id === match.parcel.id ? 'selected' : ''}`}
                      onClick={() => handleSelectParcel(match.parcel)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                        <span style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '0.9375rem' }}>
                          দাগ: {match.parcel.dagNumber}
                        </span>
                        <span className={`badge ${match.confidence >= 0.8 ? 'badge-green' : match.confidence >= 0.5 ? 'badge-gold' : 'badge-red'}`}>
                          {Math.round(match.confidence * 100)}% মিল
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '0.5rem' }}>
                        মৌজা: {match.parcel.mouza?.nameBn} · {match.parcel.surveyType} জরিপ · {match.parcel.area} শতাংশ
                      </div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--gray-500)' }}>
                        মালিক: {match.parcel.ownershipInterests[0]?.owner?.nameBn ?? 'অজানা'}
                      </div>
                      {match.unmatchedFields.length > 0 && (
                        <div style={{ marginTop: '0.375rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {match.unmatchedFields.map((f, i) => (
                            <span key={i} className="badge badge-gold" style={{ fontSize: '0.65rem' }}>⚠ {f}</span>
                          ))}
                        </div>
                      )}
                      {match.matchedFields.map((f, i) => (
                        <span key={i} className="badge badge-green" style={{ fontSize: '0.65rem', marginRight: 2, marginTop: 2 }}>✓ {f}</span>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>

            {selectedParcel && (
              <div className="alert alert-green">
                <CheckCircle size={16} style={{ flexShrink: 0 }} />
                <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>
                  দাগ {selectedParcel.dagNumber} নির্বাচিত হয়েছে। নিচে মানচিত্রে দেখুন এবং নিশ্চিত করুন।
                </div>
              </div>
            )}
          </div>

          {/* Right: Map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />নমুনা ভূমি মানচিত্র
                </span>
                <a href="https://map.land.gov.bd/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                  <ExternalLink size={12} />সরকারি মানচিত্র
                </a>
              </div>
              <div className="map-container" style={{ height: 480 }}>
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapFocus center={mapCenter} zoom={mapZoom} />

                  {PARCELS.filter(p => p.geometry).map(parcel => (
                    <Polygon
                      key={parcel.id}
                      positions={parcel.geometry!.coordinates[0].map(c => [c[1], c[0]] as [number, number])}
                      pathOptions={{
                        color: selectedParcel?.id === parcel.id ? '#176B56' : '#17334C',
                        fillColor: selectedParcel?.id === parcel.id ? '#176B56' : '#17334C',
                        fillOpacity: selectedParcel?.id === parcel.id ? 0.45 : 0.15,
                        weight: selectedParcel?.id === parcel.id ? 3 : 1.5,
                      }}
                      eventHandlers={{ click: () => handleSelectParcel(parcel) }}
                    >
                      <Popup>
                        <div style={{ fontFamily: 'Hind Siliguri, sans-serif', minWidth: 180 }}>
                          <div style={{ fontWeight: 700, marginBottom: 4 }}>দাগ: {parcel.dagNumber}</div>
                          <div style={{ fontSize: '0.8125rem', color: '#555', marginBottom: 2 }}>মৌজা: {parcel.mouza?.nameBn}</div>
                          <div style={{ fontSize: '0.8125rem', color: '#555', marginBottom: 2 }}>জরিপ: {parcel.surveyType} · পরিমাণ: {parcel.area} শতাংশ</div>
                          <div style={{ fontSize: '0.8125rem', color: '#555', marginBottom: 2 }}>খতিয়ান: {parcel.currentKhatian}</div>
                          <div style={{ fontSize: '0.8125rem', color: '#555' }}>মালিক: {parcel.ownershipInterests[0]?.owner?.nameBn}</div>
                          <div style={{ marginTop: 6, padding: '2px 6px', background: '#FFF3CD', borderRadius: 4, fontSize: '0.7rem', color: '#7C4500' }}>নমুনা/কাল্পনিক</div>
                        </div>
                      </Popup>
                    </Polygon>
                  ))}
                </MapContainer>
              </div>
              <div className="card-body" style={{ padding: '0.75rem' }}>
                <div className="alert alert-navy" style={{ padding: '0.625rem 0.875rem' }}>
                  <Info size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.8rem' }}>
                    এই মানচিত্রে দেখানো পলিগনগুলো সম্পূর্ণ কাল্পনিক। সরকারি ক্যাডাস্ট্রাল ডেটা ব্যবহার করতে অনুমোদিত API সংযোগ প্রয়োজন।
                    <a href="https://map.land.gov.bd/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--navy)', marginLeft: 4 }}>
                      সরকারি মানচিত্র দেখুন ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Parcel detail */}
            {selectedParcel && (
              <div className="card animate-fade-in">
                <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}>
                  <CheckCircle size={14} color="var(--green)" style={{ display: 'inline', marginRight: 6 }} />
                  নির্বাচিত দাগের তথ্য
                </div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    {[
                      { label: 'দাগ নম্বর', val: selectedParcel.dagNumber },
                      { label: 'জরিপের ধরন', val: selectedParcel.surveyType },
                      { label: 'জমির পরিমাণ', val: `${selectedParcel.area} শতাংশ` },
                      { label: 'মৌজা', val: selectedParcel.mouza?.nameBn },
                      { label: 'খতিয়ান', val: selectedParcel.currentKhatian },
                      { label: 'উপজেলা', val: selectedParcel.upazila?.nameBn },
                    ].map((row, i) => (
                      <div key={i} style={{ background: 'var(--gray-50)', padding: '0.625rem', borderRadius: 8 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontFamily: 'Hind Siliguri, sans-serif', marginBottom: '0.125rem' }}>{row.label}</div>
                        <div style={{ fontWeight: 700, fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.9375rem' }}>{row.val || '—'}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '0.875rem' }}>
                    <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--gray-600)' }}>মালিকানার তথ্য (নমুনা)</div>
                    {selectedParcel.ownershipInterests.map(oi => (
                      <div key={oi.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--gray-100)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>
                        <span>{oi.owner?.nameBn}</span>
                        <span style={{ color: 'var(--gray-500)' }}>{oi.shareNumerator}/{oi.shareDenominator} অংশ</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-ghost" onClick={() => navigate('/review')}><ChevronLeft size={16} />পেছনে</button>
              <button className="btn btn-primary btn-lg" onClick={handleProceed} disabled={!selectedParcel}>
                যাচাই করুন <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
