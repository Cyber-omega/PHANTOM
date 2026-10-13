import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Crosshair,
  Sparkles,
  Bug,
  Terminal,
  Zap,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  FileText,
} from 'lucide-react';
import { AnalysisResponse, ScenarioPreset } from '../types';
import { BrandLogo } from './BrandLogos';

interface BrowserViewportProps {
  scenario: ScenarioPreset;
  analysis: AnalysisResponse | null;
  onFireHoneypotTrap: (payload: Record<string, string>, canaryToken: string) => void;
  onOpenGeminiAudit: () => void;
  onExportPdf?: () => void;
  isAnalyzing: boolean;
  onReload: () => void;
  onCustomUrlSubmit?: (url: string) => void;
  theme?: 'light' | 'dark';
}

export function BrowserViewport({
  scenario,
  analysis,
  onFireHoneypotTrap,
  onOpenGeminiAudit,
  onExportPdf,
  isAnalyzing,
  onReload,
  onCustomUrlSubmit,
  theme = 'light',
}: BrowserViewportProps) {
  const [viewportMode, setViewportMode] = useState<
    'normal' | 'yolo_bboxes' | 'quarantine_overlay' | 'honeypot_decoy'
  >('normal');
  const [showCertPopup, setShowCertPopup] = useState(false);
  const [urlInput, setUrlInput] = useState(() => analysis?.host || scenario.url.replace(/^https?:\/\//, ''));
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    scenario.mockPage.fields.forEach((f) => {
      initial[f.id] = f.defaultValue || '';
    });
    return initial;
  });
  const [isTrapInjected, setIsTrapInjected] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const isLight = theme === 'light';

  // Sync formData and urlInput when scenario or analysis changes
  React.useEffect(() => {
    const nextData: Record<string, string> = {};
    scenario.mockPage.fields.forEach((f) => {
      nextData[f.id] = f.defaultValue || '';
    });
    setFormData(nextData);
    setIsTrapInjected(false);
    setUrlInput(analysis?.host || scenario.url.replace(/^https?:\/\//, ''));

    if (analysis && analysis.bayesianArbiter.posteriorRisk >= 0.8) {
      setViewportMode('quarantine_overlay');
    } else {
      setViewportMode('normal');
    }
  }, [scenario.id, analysis?.host, analysis?.bayesianArbiter.posteriorRisk]);

  const risk = analysis ? analysis.bayesianArbiter.posteriorRisk : scenario.expectedRisk;
  const isHighRisk = risk >= 0.8;
  const isSuspicious = risk >= 0.3 && risk < 0.8;

  const handleInputChange = (fieldId: string, val: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: val }));
  };

  const handleInjectCanary = () => {
    if (!analysis?.honeypot) return;
    const honey = analysis.honeypot;
    const injected: Record<string, string> = {};
    scenario.mockPage.fields.forEach((f) => {
      if (f.id.includes('pass') || f.id.includes('pwd')) {
        injected[f.id] = honey.decoyIdentity.password;
      } else if (f.id.includes('email') || f.id.includes('user') || f.id.includes('login')) {
        injected[f.id] = honey.decoyIdentity.username;
      } else if (f.id.includes('seed')) {
        injected[f.id] = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon canary';
      } else {
        injected[f.id] = honey.decoyIdentity.fullName;
      }
    });
    setFormData(injected);
    setIsTrapInjected(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const token = analysis?.honeypot?.canaryTrackingToken || `CANARY-${Date.now()}`;
    onFireHoneypotTrap(formData, token);
  };

  const handleUrlFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCustomUrlSubmit && urlInput.trim()) {
      onCustomUrlSubmit(urlInput.trim());
    }
  };

  const copyCanaryToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div
      className={`border rounded-2xl shadow-xl overflow-hidden flex flex-col transition-colors duration-200 ${
        isLight
          ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-slate-200/50'
          : 'bg-[#211640] border-[#602A77]/80 text-[#F8F4ED] shadow-2xl'
      }`}
    >
      {/* Browser Chrome Header */}
      <div
        className={`px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b ${
          isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-[#0C0C1F] border-[#211640]'
        }`}
      >
        {/* Window controls and nav buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600/40" />
            <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/40" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600/40" />
          </div>
          <div className={`flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-[#EDB9BD]/70'}`}>
            <button className="p-1 hover:text-slate-900 rounded disabled:opacity-40 cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 hover:text-slate-900 rounded disabled:opacity-40 cursor-pointer">
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onReload}
              className={`p-1 hover:text-slate-900 rounded cursor-pointer ${
                isAnalyzing ? 'animate-spin text-indigo-600' : ''
              }`}
              title="Reload viewport & re-run security scanner"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Address Bar Form */}
        <form onSubmit={handleUrlFormSubmit} className="flex-1 min-w-[280px] max-w-xl relative">
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-mono shadow-inner border focus-within:ring-2 ${
              isLight
                ? 'bg-white border-slate-300 focus-within:ring-indigo-100 focus-within:border-indigo-600 text-slate-900'
                : 'bg-[#211640] border-[#602A77] focus-within:border-[#EDB9BD] text-[#F8F4ED]'
            }`}
          >
            <button
              type="button"
              onClick={() => setShowCertPopup(!showCertPopup)}
              className="flex items-center gap-1 focus:outline-none hover:opacity-80 transition-opacity cursor-pointer"
              title="Click to view TLS Certificate & Origin Telemetry"
            >
              {isHighRisk ? (
                <Unlock className="w-3.5 h-3.5 text-rose-600" />
              ) : isSuspicious ? (
                <Lock className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </button>

            <span className={isLight ? 'text-slate-400 select-none' : 'text-[#EDB9BD]/60 select-none'}>
              https://
            </span>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter custom target URL to scan..."
              className={`bg-transparent font-semibold focus:outline-none flex-1 truncate ${
                isHighRisk
                  ? 'text-rose-600'
                  : isSuspicious
                  ? 'text-amber-600'
                  : isLight
                  ? 'text-slate-900'
                  : 'text-[#F8F4ED]'
              }`}
            />

            {/* Homoglyph alert badge in URL bar */}
            {analysis?.lexical.homoglyphs.hasHomoglyphs && (
              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                Homoglyph
              </span>
            )}

            {/* Historical Precedent Match badge in URL bar */}
            {analysis?.historicalMatch?.hasMatch && analysis.historicalMatch.matchedEntry && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  isLight
                    ? 'bg-purple-100 text-purple-800 border border-purple-300'
                    : 'bg-[#602A77] text-[#F8F4ED] border border-[#EDB9BD]/50'
                }`}
                title={analysis.historicalMatch.correlationBasis}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>DB: {analysis.historicalMatch.matchedEntry.id}</span>
              </span>
            )}

            {/* Quick status text */}
            <span
              className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                isHighRisk
                  ? 'bg-rose-100 text-rose-700 border border-rose-300'
                  : isSuspicious
                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
              }`}
            >
              {isHighRisk ? 'PHISH' : isSuspicious ? 'CAUTION' : 'BENIGN'}
            </span>
          </div>

          {/* Certificate & Telemetry Popup */}
          {showCertPopup && analysis && (
            <div
              className={`absolute left-0 top-full mt-2 w-80 rounded-xl shadow-2xl p-3.5 z-50 text-xs border ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-800'
                  : 'bg-[#0C0C1F] border-[#602A77] text-[#F8F4ED]'
              }`}
            >
              <div
                className={`flex items-center justify-between pb-2 border-b ${
                  isLight ? 'border-slate-200' : 'border-[#211640]'
                }`}
              >
                <span className="font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" /> Connection Security
                </span>
                <button
                  type="button"
                  onClick={() => setShowCertPopup(false)}
                  className="hover:opacity-75 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="mt-2 space-y-2 text-[11px] font-mono">
                <div>
                  <span className={isLight ? 'text-slate-500 block' : 'text-[#EDB9BD]/70 block'}>
                    Certificate Issuer:
                  </span>
                  <span className="font-semibold">{analysis.telemetry.tlsIssuer}</span>
                </div>
                <div>
                  <span className={isLight ? 'text-slate-500 block' : 'text-[#EDB9BD]/70 block'}>
                    Certificate Class:
                  </span>
                  <span
                    className={
                      analysis.telemetry.isFreeDV ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'
                    }
                  >
                    {analysis.telemetry.isFreeDV ? 'Free Automated DV' : 'Corporate Extended Validation (EV)'}
                  </span>
                </div>
                <div>
                  <span className={isLight ? 'text-slate-500 block' : 'text-[#EDB9BD]/70 block'}>
                    Domain Age:
                  </span>
                  <span
                    className={
                      analysis.telemetry.domainAgeDays < 14 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'
                    }
                  >
                    {analysis.telemetry.domainAgeDays} days old
                  </span>
                </div>
                <div>
                  <span className={isLight ? 'text-slate-500 block' : 'text-[#EDB9BD]/70 block'}>
                    Hosting Network (ASN):
                  </span>
                  <span>{analysis.telemetry.asn}</span>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Viewport Overlay Controls */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border text-xs ${
            isLight ? 'bg-white border-slate-300' : 'bg-[#211640] border-[#602A77]/60'
          }`}
        >
          <button
            onClick={() => setViewportMode('normal')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              viewportMode === 'normal'
                ? isLight
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-[#602A77] text-[#F8F4ED] shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-[#EDB9BD]/70 hover:text-[#F8F4ED]'
            }`}
          >
            Raw View
          </button>
          <button
            onClick={() => setViewportMode('yolo_bboxes')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all cursor-pointer ${
              viewportMode === 'yolo_bboxes'
                ? isLight
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[#602A77] text-[#F8F4ED] shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-[#EDB9BD]/70 hover:text-[#F8F4ED]'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>YOLOv8</span>
          </button>
          {isHighRisk && (
            <>
              <button
                onClick={() => setViewportMode('quarantine_overlay')}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all cursor-pointer ${
                  viewportMode === 'quarantine_overlay'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-[#EDB9BD]/70 hover:text-[#F8F4ED]'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Quarantine</span>
              </button>
              <button
                onClick={() => setViewportMode('honeypot_decoy')}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all cursor-pointer ${
                  viewportMode === 'honeypot_decoy'
                    ? isLight
                      ? 'bg-purple-700 text-white shadow-sm'
                      : 'bg-[#602A77] text-[#F8F4ED] shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-[#EDB9BD]/70 hover:text-[#F8F4ED]'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Honeypot</span>
              </button>
            </>
          )}

          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all border border-dashed cursor-pointer ${
                isLight
                  ? 'border-indigo-300 text-indigo-700 hover:bg-indigo-50 bg-indigo-50/50'
                  : 'border-[#AA4488]/80 text-[#EDB9BD] hover:bg-[#602A77]/50 bg-[#211640]/50'
              }`}
              title="Export structured forensic report as PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Report PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport Content Area */}
      <div
        className={`relative min-h-[520px] flex items-center justify-center p-6 overflow-hidden transition-colors ${
          isLight ? 'bg-slate-200/50' : 'bg-[#0C0C1F]'
        }`}
      >
        {/* Webpage Simulation Card */}
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 text-slate-800 transition-all">
          {/* Brand Vector & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm mb-3">
              <BrandLogo icon={scenario.mockPage.logoIcon} className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {scenario.mockPage.headline}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {scenario.mockPage.subheadline}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitForm} className="space-y-4">
            {scenario.mockPage.fields.map((field) => (
              <div key={field.id} className="relative">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  disabled={viewportMode === 'quarantine_overlay'}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                    isTrapInjected
                      ? 'border-purple-500 bg-purple-50 text-purple-950 ring-purple-100'
                      : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 bg-white text-slate-900'
                  }`}
                  required
                />
                {isTrapInjected && (
                  <span className="absolute right-2.5 top-8 text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-600 text-white font-bold">
                    CANARY POISONED
                  </span>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={viewportMode === 'quarantine_overlay'}
              style={{
                backgroundColor: scenario.mockPage.primaryColor || '#003087',
              }}
              className="w-full py-3 rounded-lg text-white font-semibold text-sm shadow-md hover:brightness-110 active:brightness-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {scenario.mockPage.buttonText}
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-400">
                Protected by identity verification protocol
              </span>
            </div>
          </form>

          {scenario.mockPage.exfiltrationNote && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[10px] text-slate-500 font-mono">
              <Bug className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>
                <strong>Action Sink:</strong> {scenario.mockPage.formAction}
              </span>
            </div>
          )}
        </div>

        {/* OVERLAY 1: YOLOv8-NANO BOUNDING BOXES */}
        {viewportMode === 'yolo_bboxes' && analysis && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] p-6 flex items-center justify-center pointer-events-none">
            <div className="relative w-full max-w-md h-[460px] border-2 border-dashed border-indigo-400/60 rounded-2xl">
              <div className="absolute top-[3%] left-[32%] w-[36%] h-[16%] border-2 border-indigo-500 bg-indigo-500/20 rounded flex flex-col justify-between p-1">
                <span className="self-start text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-indigo-600 text-white">
                  brand_badge: {analysis.claimedBrand.name} [0.95]
                </span>
                <span className="self-end text-[8px] font-mono text-indigo-200">
                  Cosine: 0.984
                </span>
              </div>

              <div className="absolute top-[36%] left-[6%] w-[88%] h-[14%] border-2 border-amber-500 bg-amber-500/20 rounded flex flex-col justify-between p-1">
                <span className="self-start text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-amber-600 text-white">
                  form_input: credential_id [0.96]
                </span>
                <span className="self-end text-[8px] font-mono text-amber-200">
                  High Sensitivity
                </span>
              </div>

              <div className="absolute top-[52%] left-[6%] w-[88%] h-[14%] border-2 border-rose-500 bg-rose-500/20 rounded flex flex-col justify-between p-1">
                <span className="self-start text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-rose-600 text-white">
                  form_input: secret_key [0.98]
                </span>
                <span className="self-end text-[8px] font-mono text-rose-200">
                  Credential Sink
                </span>
              </div>

              <div className="absolute top-[69%] left-[6%] w-[88%] h-[12%] border-2 border-cyan-500 bg-cyan-500/20 rounded flex flex-col justify-between p-1">
                <span className="self-start text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-cyan-600 text-white">
                  action_button: exfil_trigger [0.93]
                </span>
                <span className="self-end text-[8px] font-mono text-cyan-200">
                  External Destination
                </span>
              </div>

              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 border border-slate-700 p-2 rounded-lg text-white text-xs flex items-center justify-between pointer-events-auto shadow-xl">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-[11px]">
                    <strong>YOLOv8-Nano:</strong> 4 objects localized · Brand: {analysis.claimedBrand.name}
                  </span>
                </div>
                <button
                  onClick={() => setViewportMode('normal')}
                  className="text-[10px] text-cyan-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OVERLAY 2: QUARANTINE SANDBOX UI */}
        {viewportMode === 'quarantine_overlay' && analysis && isHighRisk && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md p-6 flex flex-col items-center justify-center z-20">
            <div
              className={`max-w-lg w-full rounded-2xl p-6 shadow-2xl border-2 border-rose-600 animate-in fade-in zoom-in-95 duration-200 ${
                isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
              }`}
            >
              <div className="flex items-center gap-3 border-b border-rose-200 pb-4 mb-4">
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 border border-rose-300 animate-bounce">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-600 text-white uppercase tracking-wider">
                    PHANTOM ACTIVE QUARANTINE
                  </span>
                  <h3 className="text-lg font-bold mt-1">
                    Deceptive Brand Impersonation Quarantined
                  </h3>
                  <p className="text-xs text-rose-600 font-mono">
                    Bayesian Risk Score: {(analysis.bayesianArbiter.posteriorRisk * 100).toFixed(1)}% (Threshold: 80%)
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {analysis.historicalMatch?.hasMatch && analysis.historicalMatch.matchedEntry && (
                  <div className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${isLight ? 'bg-purple-50 border-purple-200 text-purple-950' : 'bg-purple-950/60 border-purple-700 text-purple-200'}`}>
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">
                        Historical Precedent Matched ({analysis.historicalMatch.matchedEntry.id})
                      </span>
                      <p className="text-[11px] mt-0.5 opacity-90">
                        Matches confirmed campaign <strong>{analysis.historicalMatch.matchedEntry.attackCampaign}</strong> detected on {analysis.historicalMatch.matchedEntry.dateOfDetectionFormatted}.
                      </p>
                    </div>
                  </div>
                )}

                <div className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Visual Brand vs Origin Discrepancy</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Page claims to be <strong>{analysis.claimedBrand.name}</strong>, but domain is <code className="font-mono bg-slate-200 px-1 rounded">{analysis.host}</code>.
                    </p>
                  </div>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Telemetry Anomalies</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Domain Age: <strong>{analysis.telemetry.domainAgeDays} days</strong> · TLS: Free Automated DV · Exfiltration endpoint unverified.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200">
                <button
                  onClick={() => setViewportMode('honeypot_decoy')}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Deploy Honeypot Decoy UI
                </button>

                <button
                  onClick={onOpenGeminiAudit}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  AI Deep Audit
                </button>

                <button
                  onClick={() => setViewportMode('normal')}
                  className="py-2 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Bypass
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OVERLAY 3: ACTIVE HONEYPOT DECOY UI */}
        {viewportMode === 'honeypot_decoy' && analysis && analysis.honeypot && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md p-6 flex flex-col items-center justify-center z-20">
            <div
              className={`max-w-lg w-full rounded-2xl p-6 shadow-2xl border-2 border-purple-500 animate-in fade-in zoom-in-95 duration-200 ${
                isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
              }`}
            >
              <div className="flex items-center justify-between border-b border-purple-200 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700 border border-purple-300">
                    <Zap className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-600 text-white uppercase tracking-wider">
                      PHANTOM CYBER DECEPTION
                    </span>
                    <h3 className="text-base font-bold mt-0.5">
                      Active Honeypot Decoy &amp; Canary Trap
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setViewportMode('normal')}
                  className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Rather than alerting the attacker to take down their server, PHANTOM safely engages by deploying a synthetic persona. Submissions poison their database, tie up automated harvesting bots, and plant canary tripwires that trigger SOC alerts if leaked.
              </p>

              <div className={`rounded-xl p-3 border space-y-2 text-xs font-mono mb-4 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Canary Token:</span>
                  <div className="flex items-center gap-1 font-bold text-purple-700">
                    <span>{analysis.honeypot.canaryTrackingToken}</span>
                    <button
                      onClick={() => copyCanaryToken(analysis.honeypot!.canaryTrackingToken)}
                      className="p-1 hover:opacity-80 cursor-pointer"
                      title="Copy Token"
                    >
                      {copiedToken ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Synthetic Email:</span>
                  <span>{analysis.honeypot.decoyIdentity.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Poisoned Password:</span>
                  <span>{analysis.honeypot.decoyIdentity.password}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Deception Response:</span>
                  <span className="font-bold text-amber-600">Fake 302 + 45s Delay MFA Trap</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleInjectCanary();
                    setViewportMode('normal');
                  }}
                  className="flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Auto-Fill Canary Credentials
                </button>
                <button
                  onClick={() => {
                    handleInjectCanary();
                    const token = analysis.honeypot!.canaryTrackingToken;
                    onFireHoneypotTrap(
                      {
                        username: analysis.honeypot!.decoyIdentity.username,
                        password: analysis.honeypot!.decoyIdentity.password,
                        canaryToken: token,
                      },
                      token
                    );
                    setViewportMode('normal');
                  }}
                  className="py-2.5 px-3 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  Transmit to C2
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Viewport Footer Bar */}
      <div
        className={`px-4 py-2.5 flex items-center justify-between text-xs border-t ${
          isLight ? 'bg-slate-200/60 border-slate-300 text-slate-600' : 'bg-[#0C0C1F] border-[#211640] text-[#EDB9BD]/80'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] opacity-75">
            Viewport: 1080x720 Canvas · Chrome Sandbox isolated
          </span>
          <span className="font-mono text-[11px] opacity-40">·</span>
          <span className="font-mono text-[11px] font-semibold text-indigo-600 dark:text-[#EDB9BD]">
            Made by Ciphersquad
          </span>
          {isTrapInjected && (
            <span className="font-mono text-[11px] flex items-center gap-1 font-semibold text-purple-600">
              <Zap className="w-3 h-3 text-amber-500" />
              Canary Credentials Injected in Memory
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewportMode('yolo_bboxes')}
            className="hover:opacity-80 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5 text-indigo-500" />
            Inspect BBoxes
          </button>
          <span>|</span>
          <button
            onClick={onOpenGeminiAudit}
            className="hover:opacity-80 transition-colors flex items-center gap-1 text-indigo-600 font-medium cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Zero-Day Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
