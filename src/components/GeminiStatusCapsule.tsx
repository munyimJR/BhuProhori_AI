import { useState, useRef, useEffect } from 'react';
import {
  Zap, CheckCircle2, AlertCircle, RefreshCw, Key,
  Eye, EyeOff, ExternalLink, X, ShieldCheck
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import {
  testGeminiConnection,
  BUILTIN_GEMINI_KEY,
  getStoredGeminiKey,
  GEMINI_AVAILABLE_MODELS,
  getStoredGeminiModel,
  saveGeminiModel
} from '../services/geminiService';

export default function GeminiStatusCapsule() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    model: string;
    latencyMs: number;
    message: string;
  } | null>(null);

  const [inputKey, setInputKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>(getStoredGeminiModel());
  const [showKeyText, setShowKeyText] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { geminiApiKey, setGeminiApiKey, resetGeminiApiKey, language } = useAppStore();
  const isBn = language === 'bn';

  const currentKey = (geminiApiKey || getStoredGeminiKey() || BUILTIN_GEMINI_KEY).trim();
  const isUsingCustom = currentKey !== BUILTIN_GEMINI_KEY;

  // Sync state on open
  useEffect(() => {
    if (isOpen) {
      setInputKey(currentKey);
      setSelectedModel(getStoredGeminiModel());
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

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    saveGeminiModel(modelId);
    setSaveFeedback(isBn ? 'মডেল সংরক্ষিত' : 'Model saved');
    setTimeout(() => setSaveFeedback(null), 2500);
  };

  const handleRunPingTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testGeminiConnection(inputKey || currentKey, selectedModel);
      setTestResult(res);
      if (res.model && res.model !== selectedModel) {
        setSelectedModel(res.model);
        saveGeminiModel(res.model);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        model: selectedModel,
        latencyMs: 0,
        message: err?.message || 'সংযোগ ব্যর্থ'
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
      setSaveFeedback(isBn ? 'ডিফল্ট কী সক্রিয়' : 'Default key restored');
    } else {
      setGeminiApiKey(val);
      setSaveFeedback(isBn ? 'কী সংরক্ষিত হয়েছে' : 'Key saved');
    }
    setTimeout(() => setSaveFeedback(null), 2500);
  };

  const handleReset = () => {
    resetGeminiApiKey();
    setInputKey(BUILTIN_GEMINI_KEY);
    setSelectedModel('gemini-flash-lite-latest');
    saveGeminiModel('gemini-flash-lite-latest');
    setSaveFeedback(isBn ? 'ডিফল্ট রিস্টোর সম্পন্ন' : 'Restored default');
    setTimeout(() => setSaveFeedback(null), 2500);
  };

  const maskedKey = currentKey.length > 10
    ? `${currentKey.slice(0, 5)}•••${currentKey.slice(-4)}`
    : currentKey;

  const activeModelObj = GEMINI_AVAILABLE_MODELS.find(m => m.id === selectedModel) || GEMINI_AVAILABLE_MODELS[0];

  return (
    <div className="gemini-capsule-container" ref={containerRef} style={{ position: 'relative' }}>
      {/* ── Topbar Trigger Pill ── */}
      <button
        type="button"
        className="gemini-status-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={isBn ? `Gemini AI স্ট্যাটাস (${activeModelObj.name})` : `Gemini AI Status (${activeModelObj.nameEn})`}
      >
        <span className="gemini-status-dot" />
        <Zap size={12} color="#176b56" className="gemini-status-icon" />
        <span className="gemini-label-full">
          {isBn ? 'Gemini AI সক্রিয়' : 'Gemini AI Active'}
        </span>
        <span className="gemini-label-short">AI</span>
      </button>

      {/* ── Compact Minimal Dropdown ── */}
      {isOpen && (
        <div className="gemini-status-dropdown">
          {/* Compact Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, color: 'var(--deep)' }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981',
                  display: 'inline-block'
                }}
              />
              <span>Google Gemini AI</span>
              <span
                style={{
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 8,
                  background: isUsingCustom ? '#dbeafe' : '#e6f4ea',
                  color: isUsingCustom ? '#1d4ed8' : '#137333',
                  fontWeight: 600
                }}
              >
                {isUsingCustom ? 'Custom' : 'Active'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted)',
                padding: 2,
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          {/* Model Selector & Live Ping Inline */}
          <div
            style={{
              padding: 9,
              borderRadius: 8,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              marginBottom: 8
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#475569' }}>
                {isBn ? 'মডেল (Model):' : 'Model:'}
              </span>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748b' }}>
                {maskedKey}
              </span>
            </div>

            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              style={{
                width: '100%',
                padding: '5px 8px',
                borderRadius: 5,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: 11,
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: 6
              }}
            >
              <option value="gemini-flash-lite-latest">⚡ Flash Lite (আনলিমিটেড কোটা - সেরা)</option>
              <option value="gemini-3.5-flash-lite">🚀 3.5 Flash Lite (উচ্চ নির্ভুলতা)</option>
              <option value="gemini-3-flash-preview">🧠 3 Flash Preview (উন্নত)</option>
              <option value="gemini-flash-latest">🌐 Flash Latest (অটো-ফেলওভার)</option>
            </select>

            {/* Test Ping Button & Inline Result */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                onClick={handleRunPingTest}
                disabled={isTesting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 9px',
                  borderRadius: 5,
                  background: '#15803d',
                  color: '#ffffff',
                  fontSize: 10.5,
                  fontWeight: 600,
                  border: 'none',
                  cursor: isTesting ? 'wait' : 'pointer',
                  flexShrink: 0
                }}
              >
                <RefreshCw size={11} className={isTesting ? 'animate-spin' : ''} />
                <span>{isTesting ? (isBn ? 'টেস্টিং...' : 'Testing...') : (isBn ? 'পিং টেস্ট' : 'Ping Test')}</span>
              </button>

              <div style={{ fontSize: 10, color: testResult?.success ? '#15803d' : (testResult ? '#b91c1c' : '#64748b'), display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {testResult ? (
                  <>
                    {testResult.success ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    <span>{testResult.success ? `সফল (${testResult.latencyMs}ms)` : 'ব্যর্থ'}</span>
                  </>
                ) : (
                  <span>{isBn ? 'সবসময় সক্রিয় ও সংযুক্ত' : '24/7 Connected'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Single-line Micro Protection Badge */}
          <div
            style={{
              padding: '5px 8px',
              borderRadius: 6,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              fontSize: 10,
              color: '#1d4ed8',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginBottom: 8
            }}
          >
            <ShieldCheck size={12} color="#2563eb" style={{ flexShrink: 0 }} />
            <span style={{ lineHeight: 1.3 }}>
              {isBn
                ? 'স্মার্ট অটো-ফেলওভার সক্রিয় • ৫০৩ স্পাইক ও ৫ RPM রেট-লিমিট মুক্ত'
                : 'Smart failover active • Protected against 503 spikes & rate limits'}
            </span>
          </div>

          {/* Compact Custom Key Input Row */}
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <label style={{ fontSize: 10.5, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Key size={11} />
                <span>{isBn ? 'কাস্টম API Key:' : 'Custom Key:'}</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 9.5,
                  color: 'var(--green)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                <span>{isBn ? 'ফ্রি কী নিন' : 'Get Key'}</span>
                <ExternalLink size={9} />
              </a>
            </div>

            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type={showKeyText ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSy... / Google Key"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '5px 24px 5px 7px',
                    borderRadius: 5,
                    border: '1px solid var(--line)',
                    fontSize: 11,
                    fontFamily: 'monospace'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowKeyText(!showKeyText)}
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    padding: 1
                  }}
                >
                  {showKeyText ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSave}
                style={{
                  padding: '5px 9px',
                  borderRadius: 5,
                  background: 'var(--green)',
                  color: '#ffffff',
                  fontSize: 10.5,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {isBn ? 'সংরক্ষণ' : 'Save'}
              </button>

              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: '5px 7px',
                  borderRadius: 5,
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  fontSize: 10.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                title={isBn ? 'ডিফল্ট রিস্টোর' : 'Reset'}
              >
                {isBn ? 'রিস্টোর' : 'Reset'}
              </button>
            </div>

            {saveFeedback && (
              <div style={{ marginTop: 4, fontSize: 10, color: '#15803d', fontWeight: 600, textAlign: 'center' }}>
                {saveFeedback}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
