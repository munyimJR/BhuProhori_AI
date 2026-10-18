import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, Upload, FileText, User, MapPin, FileCheck, Loader2 } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import type { SurveyType } from '../types';

const STEPS = ['আবেদনকারী', 'জমির তথ্য', 'দলিল তথ্য', 'কাগজপত্র', 'পর্যালোচনা'];

type FormData = {
  applicantNameBn: string;
  applicantPhone: string;
  applicantAddress: string;
  dagNumber: string;
  khatianNumber: string;
  surveyType: SurveyType;
  transferArea: number;
  deedNumber: string;
  registrationDate: string;
  registryOffice: string;
  grantorName: string;
};

export default function ApplicationPage() {
  const navigate = useNavigate();
  const { extraction, selectedParcel, verificationResult, createApplication } = useAppStore();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [docUploaded, setDocUploaded] = useState({ khatian: false, taxReceipt: false });

  const fields = extraction?.fields;
  const getVal = (k: keyof NonNullable<typeof fields>) => fields?.[k]?.userCorrectedValue ?? fields?.[k]?.value ?? '';

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      dagNumber: getVal('dagNumber') || selectedParcel?.dagNumber || '',
      khatianNumber: getVal('khatianNumber') || selectedParcel?.currentKhatian || '',
      surveyType: (getVal('surveyType') as SurveyType) || selectedParcel?.surveyType || 'BS',
      transferArea: parseFloat(getVal('landArea').replace(/[^\d.]/g, '')) || selectedParcel?.area || 0,
      deedNumber: getVal('deedNumber') || '',
      registrationDate: getVal('registrationDate') || '',
      registryOffice: getVal('registryOffice') || '',
      grantorName: getVal('grantor') || '',
    },
  });

  const values = watch();
  const hasFindings = (verificationResult?.findings.length ?? 0) > 0;

  const onSubmit = async (data: FormData) => {
    if (step < STEPS.length - 1) { setStep(s => s + 1); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    const app = createApplication({ ...data, applicantName: data.applicantNameBn });
    setSubmitting(false);
    navigate(`/track/${app.id}`);
  };

  const stepIcons = [<User size={16} />, <MapPin size={16} />, <FileText size={16} />, <Upload size={16} />, <FileCheck size={16} />];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--page-bg)', padding: '2rem 0' }}>
      <div className="container-sm">
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/verification')}><ChevronLeft size={14} />পেছনে</button>
          </div>
          <h1 style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '1.625rem' }}>নামজারির আবেদন</h1>
          <p style={{ color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>
            তথ্য স্বয়ংক্রিয়ভাবে পূরণ হয়েছে। প্রয়োজনে সংশোধন করুন।
          </p>
        </div>

        {/* Progress */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body" style={{ padding: '1rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: i < step ? 'var(--mint)' : i === step ? 'var(--green)' : 'var(--gray-100)',
                      color: i < step ? 'var(--green)' : i === step ? 'white' : 'var(--gray-400)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.875rem',
                      border: i === step ? '2px solid var(--green)' : '2px solid transparent',
                    }}>
                      {i < step ? <CheckCircle size={16} /> : stepIcons[i]}
                    </div>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'Hind Siliguri, sans-serif', color: i === step ? 'var(--green)' : 'var(--gray-400)', fontWeight: i === step ? 700 : 400, whiteSpace: 'nowrap' }}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: i < step ? 'var(--green)' : 'var(--gray-200)', margin: '0 0.5rem', marginBottom: '1.25rem' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Warnings */}
        {hasFindings && (
          <div className="alert alert-gold" style={{ marginBottom: '1rem' }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>
              <strong>সতর্কতা:</strong> যাচাইয়ে {verificationResult!.findings.length}টি সমস্যা পাওয়া গেছে। তথ্যগুলো পর্যালোচনা করুন।
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 0: Applicant */}
          {step === 0 && (
            <div className="card animate-fade-in">
              <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700 }}>
                <User size={14} style={{ display: 'inline', marginRight: 6 }} />আবেদনকারীর তথ্য
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="alert alert-blue" style={{ padding: '0.625rem 0.875rem' }}>
                  <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                  <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.8rem' }}>
                    নমুনা প্রদর্শনীর জন্য — বাস্তব NID বা ব্যক্তিগত তথ্য ব্যবহার করবেন না
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">আবেদনকারীর নাম (বাংলায়) *</label>
                  <input className="form-input" {...register('applicantNameBn', { required: 'নাম লিখুন' })} placeholder="যেমন: মোহাম্মদ ইউসুফ" />
                  {errors.applicantNameBn && <span className="form-error">{errors.applicantNameBn.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">যোগাযোগ নম্বর (নমুনা) *</label>
                  <input className="form-input" {...register('applicantPhone', { required: 'নম্বর লিখুন' })} placeholder="+৮৮০-XXXX-XXXXX (নমুনা)" />
                  {errors.applicantPhone && <span className="form-error">{errors.applicantPhone.message}</span>}
                  <span className="form-hint">বাস্তব ফোন নম্বর ব্যবহার করবেন না — শুধু নমুনা</span>
                </div>
                <div className="form-group">
                  <label className="form-label">ঠিকানা *</label>
                  <textarea className="form-textarea" {...register('applicantAddress', { required: 'ঠিকানা লিখুন' })} placeholder="গ্রাম, উপজেলা, জেলা" rows={3} />
                  {errors.applicantAddress && <span className="form-error">{errors.applicantAddress.message}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Land */}
          {step === 1 && (
            <div className="card animate-fade-in">
              <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700 }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: 6 }} />জমির তথ্য
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedParcel && (
                  <div className="alert alert-green" style={{ padding: '0.625rem 0.875rem' }}>
                    <CheckCircle size={14} style={{ flexShrink: 0 }} />
                    <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.8rem' }}>
                      নির্বাচিত দাগ: {selectedParcel.dagNumber} — {selectedParcel.mouza?.nameBn} — {selectedParcel.area} শতাংশ
                    </div>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">দাগ নম্বর *</label>
                    <input className="form-input" {...register('dagNumber', { required: 'দাগ নম্বর লিখুন' })} />
                    {errors.dagNumber && <span className="form-error">{errors.dagNumber.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">খতিয়ান নম্বর *</label>
                    <input className="form-input" {...register('khatianNumber', { required: 'খতিয়ান নম্বর লিখুন' })} />
                    {errors.khatianNumber && <span className="form-error">{errors.khatianNumber.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">জরিপের ধরন *</label>
                    <select className="form-select" {...register('surveyType')}>
                      {['BS', 'SA', 'CS', 'RS', 'BRS'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">হস্তান্তর পরিমাণ (শতাংশ) *</label>
                    <input type="number" step="0.01" className="form-input" {...register('transferArea', { required: 'পরিমাণ লিখুন', min: { value: 0.01, message: 'পরিমাণ ০ এর বেশি হতে হবে' } })} />
                    {errors.transferArea && <span className="form-error">{errors.transferArea.message}</span>}
                  </div>
                </div>
                {selectedParcel && parseFloat(String(values.transferArea)) > selectedParcel.area && (
                  <div className="alert alert-red">
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                    <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.8rem' }}>
                      হস্তান্তর পরিমাণ ({values.transferArea} শতাংশ) নথিভুক্ত দাগের পরিমাণ ({selectedParcel.area} শতাংশ) এর চেয়ে বেশি!
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Deed */}
          {step === 2 && (
            <div className="card animate-fade-in">
              <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700 }}>
                <FileText size={14} style={{ display: 'inline', marginRight: 6 }} />দলিলের তথ্য
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">দলিল নম্বর *</label>
                    <input className="form-input" {...register('deedNumber', { required: 'দলিল নম্বর লিখুন' })} />
                    {errors.deedNumber && <span className="form-error">{errors.deedNumber.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">নিবন্ধনের তারিখ *</label>
                    <input className="form-input" {...register('registrationDate', { required: 'তারিখ লিখুন' })} />
                    {errors.registrationDate && <span className="form-error">{errors.registrationDate.message}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">রেজিস্ট্রি অফিস *</label>
                  <input className="form-input" {...register('registryOffice', { required: 'রেজিস্ট্রি অফিস লিখুন' })} />
                  {errors.registryOffice && <span className="form-error">{errors.registryOffice.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">দাতার নাম (বিক্রেতা) *</label>
                  <input className="form-input" {...register('grantorName', { required: 'দাতার নাম লিখুন' })} />
                  {errors.grantorName && <span className="form-error">{errors.grantorName.message}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <div className="card animate-fade-in">
              <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700 }}>
                <Upload size={14} style={{ display: 'inline', marginRight: 6 }} />প্রয়োজনীয় কাগজপত্র
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {[
                  { key: 'deed', label: 'দলিল (মূল কপি)', required: true, provided: true, desc: 'আপলোডকৃত দলিল' },
                  { key: 'khatian', label: 'খতিয়ানের সত্যায়িত কপি', required: true, provided: docUploaded.khatian, desc: 'সংশ্লিষ্ট খতিয়ানের সত্যায়িত অনুলিপি' },
                  { key: 'taxReceipt', label: 'ভূমি উন্নয়ন করের রসিদ', required: true, provided: docUploaded.taxReceipt, desc: 'সর্বশেষ খাজনার রসিদ' },
                  { key: 'nid', label: 'জাতীয় পরিচয়পত্র (ঐচ্ছিক)', required: false, provided: false, desc: 'নমুনা প্রদর্শনীতে বাস্তব NID ব্যবহার করবেন না' },
                ].map(doc => (
                  <div key={doc.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', border: `1.5px solid ${doc.provided ? 'var(--green)' : doc.required ? 'var(--gold)' : 'var(--gray-200)'}`, borderRadius: 10, background: doc.provided ? 'var(--mint)' : doc.required ? 'var(--gold-bg)' : 'white' }}>
                    <div>
                      <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.9rem' }}>
                        {doc.label}
                        {doc.required && <span style={{ color: 'var(--red)', marginLeft: 4 }}>*</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontFamily: 'Hind Siliguri, sans-serif' }}>{doc.desc}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {doc.provided ? (
                        <span className="badge badge-green"><CheckCircle size={10} />প্রদান করা হয়েছে</span>
                      ) : (
                        <>
                          <span className="badge badge-gold"><AlertTriangle size={10} />অনুপস্থিত</span>
                          {(doc.key === 'khatian' || doc.key === 'taxReceipt') && (
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setDocUploaded(prev => ({ ...prev, [doc.key]: true }))}>
                              <Upload size={12} />নমুনা আপলোড
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div className="alert alert-navy">
                  <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                  <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.8rem' }}>
                    নমুনা প্রদর্শনী — বাস্তব প্রয়োগে প্রকৃত নথি প্রয়োজন হবে। সকল আপলোড শুধুমাত্র পরীক্ষামূলক।
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="animate-fade-in">
              <div className="card" style={{ marginBottom: '1rem' }}>
                <div className="card-header" style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 700 }}>
                  <FileCheck size={14} style={{ display: 'inline', marginRight: 6 }} />আবেদন পর্যালোচনা
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { label: 'আবেদনকারীর নাম', val: values.applicantNameBn },
                    { label: 'যোগাযোগ', val: values.applicantPhone },
                    { label: 'দাগ নম্বর', val: values.dagNumber },
                    { label: 'খতিয়ান নম্বর', val: values.khatianNumber },
                    { label: 'জরিপের ধরন', val: values.surveyType },
                    { label: 'হস্তান্তর পরিমাণ', val: `${values.transferArea} শতাংশ` },
                    { label: 'দলিল নম্বর', val: values.deedNumber },
                    { label: 'নিবন্ধনের তারিখ', val: values.registrationDate },
                    { label: 'রেজিস্ট্রি অফিস', val: values.registryOffice },
                    { label: 'দাতার নাম', val: values.grantorName },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                      <span style={{ fontFamily: 'Hind Siliguri, sans-serif', color: 'var(--gray-500)', fontSize: '0.875rem' }}>{row.label}</span>
                      <span style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: 600, fontSize: '0.875rem' }}>{row.val || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="demo-banner" style={{ marginBottom: '1rem' }}>
                <AlertTriangle size={12} />
                SAMPLE / DEMONSTRATION ONLY — নমুনা প্রতিবেদন — সরকারি নথি নয়
              </div>
              {hasFindings && (
                <div className="alert alert-gold" style={{ marginBottom: '1rem' }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                  <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>
                    <strong>মনে রাখুন:</strong> আবেদনে কিছু সমস্যা চিহ্নিত হয়েছে। জমা দিলে কর্মকর্তা পর্যালোচনা করবেন।
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => step === 0 ? navigate('/verification') : setStep(s => s - 1)}>
              <ChevronLeft size={16} />পেছনে
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" />জমা দেওয়া হচ্ছে...</>
              ) : step < STEPS.length - 1 ? (
                <>পরের ধাপ <ChevronRight size={18} /></>
              ) : (
                <>আবেদন জমা দিন <ChevronRight size={18} /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
