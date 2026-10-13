import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Bot,
  X,
  RefreshCw,
} from 'lucide-react';
import { AnalysisResponse } from '../types';

interface GeminiAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResponse | null;
  theme?: 'light' | 'dark';
}

export function GeminiAuditModal({
  isOpen,
  onClose,
  analysis,
  theme = 'light',
}: GeminiAuditModalProps) {
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !analysis) return null;
  const isLight = theme === 'light';

  const runGeminiAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/deep-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: analysis.url,
          claimedBrand: analysis.claimedBrand.name,
          telemetry: analysis.telemetry,
          riskScore: analysis.bayesianArbiter.posteriorRisk,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAuditResult(data);
      } else {
        setError(data.error || 'Failed to complete AI audit');
      }
    } catch (err: any) {
      setError(err.message || 'Network error while contacting AI engine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className={`border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#211640] border-[#602A77] text-[#F8F4ED]'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F]/80 border-[#602A77]/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                  isLight
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-[#0C0C1F] text-[#EDB9BD] border-[#602A77]'
                }`}
              >
                MULTIMODAL AI AGENT
              </span>
              <h3 className="text-base font-bold mt-0.5">
                Gemini Multimodal Zero-Day Threat Audit
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-[#EDB9BD]/70 hover:text-[#F8F4ED] hover:bg-[#0C0C1F]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 flex-1 font-sans">
          {/* Target Info Header */}
          <div
            className={`p-3.5 rounded-xl border text-xs font-mono flex flex-wrap items-center justify-between gap-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
            }`}
          >
            <div>
              <span className={`block text-[11px] ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>Audit Target:</span>
              <span className="font-bold">{analysis.host}</span>
            </div>
            <div>
              <span className={`block text-[11px] ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>Claimed Identity:</span>
              <span className="font-bold text-indigo-600">{analysis.claimedBrand.name}</span>
            </div>
            <div>
              <span className={`block text-[11px] ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>Prior Posterior:</span>
              <span className="font-bold text-rose-600">
                {(analysis.bayesianArbiter.posteriorRisk * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {!auditResult && !loading && (
            <div className="text-center py-8 space-y-4">
              <Bot className={`w-12 h-12 mx-auto ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
              <p className={`text-xs max-w-md mx-auto leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}`}>
                Request an in-depth adversarial audit from Gemini. The multimodal model evaluates visual rendering traits, homoglyph character spoofing, and exfiltration pathways.
              </p>
              <button
                onClick={runGeminiAudit}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Execute Gemini Deep Audit
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12 space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-500">
                Synthesizing visual and semantic evidence via Gemini model...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-xs">
              <p className="font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> Audit Notice
              </p>
              <p className="mt-1 text-[11px]">{error}</p>
            </div>
          )}

          {auditResult && (
            <div className="space-y-4 animate-in fade-in duration-300 text-xs">
              {/* Rating badge */}
              <div
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
                }`}
              >
                <span className="font-mono text-slate-500">AI Threat Rating:</span>
                <span
                  className={`px-3 py-1 rounded font-mono font-bold uppercase tracking-wider text-xs ${
                    auditResult.analysis.threatRating === 'CRITICAL_ZERO_DAY'
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {auditResult.analysis.threatRating || 'HIGH_PHISH'}
                </span>
              </div>

              {/* Summary */}
              <div
                className={`p-4 rounded-xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-wider block font-bold text-slate-500">
                  Executive Threat Summary
                </span>
                <p className="leading-relaxed text-xs">
                  {auditResult.analysis.summary}
                </p>
              </div>

              {/* Adversarial Tactics */}
              {auditResult.analysis.adversarialTactics && (
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider block font-bold text-slate-500">
                    Identified Deception &amp; Evasion Tactics
                  </span>
                  <ul className="space-y-1.5 text-xs">
                    {auditResult.analysis.adversarialTactics.map((tactic: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{tactic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Honeypot Feasibility */}
              {auditResult.analysis.honeypotFeasibility && (
                <div
                  className={`p-4 rounded-xl border space-y-1 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider block font-bold text-slate-500">
                    Honeypot Diversion Appraisal
                  </span>
                  <p className="text-xs">
                    {auditResult.analysis.honeypotFeasibility}
                  </p>
                </div>
              )}

              {/* Mitigation Recommendation */}
              {auditResult.analysis.mitigationRecommendation && (
                <div
                  className={`p-4 rounded-xl border space-y-1 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider block font-bold text-slate-500">
                    Recommended Security Enforcement
                  </span>
                  <p className="text-xs font-semibold text-indigo-700">
                    {auditResult.analysis.mitigationRecommendation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between text-xs font-mono ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-[#0C0C1F]/80 border-[#602A77]/60 text-[#EDB9BD]/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>Engine: Multimodal AI Forensic Audit</span>
            <span className="opacity-40">·</span>
            <span className="font-semibold text-indigo-600 dark:text-[#EDB9BD]">Made by Ciphersquad</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
