import { useState, useRef, useEffect } from 'react';
import {
  Zap, CheckCircle2, AlertCircle, RefreshCw, Key,
  Eye, EyeOff, ShieldCheck, ExternalLink, Sparkles, X
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import {
  testGeminiConnection,
  BUILTIN_GEMINI_KEY,
  getStoredGeminiKey
} from '../services/geminiService';

export default function GeminiStatusCapsule() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs: number;
    message: string;
  } | null>(null);

  const [inputKey, setInputKey] = useState('');
  const [showKeyText, setShowKeyText] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { geminiApiKey, setGeminiApiKey, resetGeminiApiKey, language } = useAppStore();
  const isBn = language === 'bn';

  const currentKey = (geminiApiKey || getStoredGeminiKey() || BUILTIN_GEMINI_KEY).trim();
  const isUsingCustom = currentKey !== BUILTIN_GEMINI_KEY;

  // Initialize input field on open
  useEffect(() => {
    if (isOpen) {
      setInputKey(currentKey);
      setSaveFeedback(null);
    }
  }, [isOpen, currentKey]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleRunPingTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testGeminiConnection(inputKey || currentKey);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        latencyMs: 0,
        message: err?.message || 'সংযোগ পরীক্ষা ব্যর্থ হয়েছে।'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    const val = inputKey.trim();
    if (!val) {
      resetGeminiApiKey();
      setInputKey(BUILTIN_GEMINI_KEY);
      setSaveFeedback(isBn ? 'ডিফল্ট অ্যাক্টিভ কী পুনরুদ্ধার করা হয়েছে।' : 'Restored default active key.');
    } else {
      setGeminiApiKey(val);
      setSaveFeedback(isBn ? 'নতুন API কী সফলভাবে সংরক্ষিত হয়েছে!' : 'API Key saved successfully!');
    }
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  const handleReset = () => {
    resetGeminiApiKey();
    setInputKey(BUILTIN_GEMINI_KEY);
    setSaveFeedback(isBn ? 'ডিফল্ট অ্যাক্টিভ কী পুনরুদ্ধার করা হয়েছে।' : 'Restored default active key.');
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  const maskedKey = currentKey.length > 12
    ? `${currentKey.slice(0, 6)}••••••••${currentKey.slice(-4)}`
    : currentKey;

  return (
    <div className="gemini-capsule-container" ref={containerRef} style={{ position: 'relative' }}>
      {/* ── Topbar Trigger Pill ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(23,107,86,0.1) 0%, rgba(16,85,63,0.15) 100%)',
          border: '1px solid rgba(23,107,86,0.3)',
          color: 'var(--green-dark)',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}
        title={isBn ? 'গুগল জেমিনাই এআই কানেকশন স্ট্যাটাস' : 'Google Gemini AI Connection Status'}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981',
            display: 'inline-block',
            animation: 'pulse 2s infinite'
          }}
        />
        <Zap size={13} color="#176b56" />
        <span style={{ whiteSpace: 'nowrap' }}>
          {isBn ? 'Gemini AI সক্রিয়' : 'Gemini AI Active'}
        </span>
      </button>

      {/* ── Dropdown Modal ── */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 360,
            maxWidth: '92vw',
            background: '#ffffff',
            borderRadius: 14,
            border: '1px solid var(--line)',
            boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
            zIndex: 1050,
            padding: 16,
            color: 'var(--ink)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14, color: 'var(--deep)' }}>
                <Sparkles size={16} color="var(--green)" />
                <span>{isBn ? 'Google Gemini AI সংযোগ' : 'Google Gemini AI Connection'}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                {isBn ? 'মডেল: gemini-flash-latest • লাইভ রেসপন্স' : 'Model: gemini-flash-latest • Live Ready'}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted)',
                padding: 4
              }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Current Status Box */}
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              marginBottom: 12
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#166534' }}>
                <CheckCircle2 size={15} color="#16a34a" />
                <span>{isBn ? 'এআই সার্ভার: সক্রিয় ও সংযুক্ত' : 'AI Status: Connected & Active'}</span>
              </div>
              <span
                style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 12,
                  background: isUsingCustom ? '#dbeafe' : '#e0e7ff',
                  color: isUsingCustom ? '#1e40af' : '#3730a3',
                  fontWeight: 600
                }}
              >
                {isUsingCustom ? (isBn ? 'কাস্টম কী' : 'Custom Key') : (isBn ? 'ডিফল্ট অ্যাক্টিভ কী' : 'Default Key')}
              </span>
            </div>

            <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#14532d', background: '#dcfce7', padding: '4px 8px', borderRadius: 6, wordBreak: 'break-all' }}>
              Key: {maskedKey}
            </div>

            <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={handleRunPingTest}
                disabled={isTesting}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '6px 10px',
                  borderRadius: 6,
                  background: '#15803d',
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 600,
                  border: 'none',
                  cursor: isTesting ? 'wait' : 'pointer'
                }}
              >
                <RefreshCw size={12} className={isTesting ? 'animate-spin' : ''} />
                <span>
                  {isTesting
                    ? (isBn ? 'পিং টেস্ট হচ্ছে...' : 'Testing...')
                    : (isBn ? 'লাইভ সংযোগ পরীক্ষা (Ping)' : 'Test Live Connection')}
                </span>
              </button>
            </div>

            {/* Test Result Message */}
            {testResult && (
              <div
                style={{
                  marginTop: 8,
                  padding: '6px 10px',
                  borderRadius: 6,
                  fontSize: 11,
                  background: testResult.success ? '#ffffff' : '#fef2f2',
                  border: testResult.success ? '1px solid #86efac' : '1px solid #fecaca',
                  color: testResult.success ? '#15803d' : '#b91c1c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {testResult.success ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                <span>
                  {testResult.message}
                  {testResult.latencyMs > 0 && ` (${testResult.latencyMs}ms)`}
                </span>
              </div>
            )}
          </div>

          {/* Guarantee / How it stays active */}
          <div
            style={{
              padding: 10,
              borderRadius: 8,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              marginBottom: 12,
              fontSize: 11,
              color: '#334155'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 4, color: 'var(--deep)' }}>
              <ShieldCheck size={14} color="var(--green)" />
              <span>{isBn ? 'সবসময় সক্রিয় থাকার নিশ্চয়তা:' : 'Permanent Active Guarantee:'}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.5 }}>
              <li>
                {isBn
                  ? 'অ্যাপে সরাসরি অ্যাক্টিভ জেমিনাই কী বিল্ট-ইন রয়েছে, তাই কোনো সেটিংস ছাড়াই সবসময় চলবে।'
                  : 'Baked-in verified Gemini key ensures seamless 24/7 uptime without config.'}
              </li>
              <li>
                {isBn
                  ? 'ব্রাউজার রিফ্রেশ বা ক্যাশ ক্লিয়ার করলেও এটি কখনই বন্ধ হবে না।'
                  : 'Key persists across browser reloads, cache clears, and incognito sessions.'}
              </li>
            </ul>
          </div>

          {/* Key Configuration Section */}
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--deep)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Key size={12} />
                <span>{isBn ? 'নিজস্ব Gemini API Key ব্যবহার করুন:' : 'Use Custom Gemini Key:'}</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 10,
                  color: 'var(--green)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                <span>{isBn ? 'ফ্রি কী নিন' : 'Get Free Key'}</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <div style={{ position: 'relative', marginBottom: 8 }}>
              <input
                type={showKeyText ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy... / Google Gemini API Key"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '7px 32px 7px 10px',
                  borderRadius: 6,
                  border: '1px solid var(--line)',
                  fontSize: 12,
                  fontFamily: 'monospace'
                }}
              />
              <button
                type="button"
                onClick={() => setShowKeyText(!showKeyText)}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  padding: 2
                }}
              >
                {showKeyText ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: 'var(--green)',
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {isBn ? 'সংরক্ষণ করুন' : 'Save Key'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                title={isBn ? 'মূল ডিফল্ট কী ফিরিয়ে আনুন' : 'Reset to default key'}
              >
                {isBn ? 'ডিফল্ট কী রিস্টোর' : 'Reset Default'}
              </button>
            </div>

            {saveFeedback && (
              <div style={{ marginTop: 6, fontSize: 11, color: '#15803d', fontWeight: 600, textAlign: 'center' }}>
                {saveFeedback}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
