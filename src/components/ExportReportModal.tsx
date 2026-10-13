import React, { useState } from 'react';
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Check,
  Eye,
  Sliders,
  Calendar,
  Globe,
  Lock,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { AnalysisResponse, ScenarioPreset } from '../types';
import { downloadAnalysisPdfReport, PdfExportOptions } from '../utils/pdfExport';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResponse | null;
  scenario?: ScenarioPreset;
  theme: 'light' | 'dark';
}

export function ExportReportModal({
  isOpen,
  onClose,
  analysis,
  scenario,
  theme,
}: ExportReportModalProps) {
  const [includeBayesian, setIncludeBayesian] = useState(true);
  const [includeTelemetry, setIncludeTelemetry] = useState(true);
  const [includeVision, setIncludeVision] = useState(true);
  const [includeHistorical, setIncludeHistorical] = useState(true);
  const [includeHoneypot, setIncludeHoneypot] = useState(true);
  const [analystNotes, setAnalystNotes] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [hasExported, setHasExported] = useState(false);

  if (!isOpen || !analysis) return null;

  const isLight = theme === 'light';
  const risk = analysis.bayesianArbiter.posteriorRisk;
  const isHighRisk = risk >= 0.8;
  const isSuspicious = risk >= 0.3 && risk < 0.8;

  const handleExport = () => {
    setIsExporting(true);
    try {
      const options: PdfExportOptions = {
        includeBayesianEvidence: includeBayesian,
        includeTelemetry: includeTelemetry,
        includeVision: includeVision,
        includeHistoricalMatch: includeHistorical,
        includeHoneypot: includeHoneypot,
        analystNotes,
      };
      downloadAnalysisPdfReport(analysis, scenario, options);
      setHasExported(true);
      setTimeout(() => setHasExported(false), 4000);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden transition-all duration-200 ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-[#0C0C1F] border-[#602A77] text-[#F8F4ED]'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            isLight
              ? 'bg-slate-50/80 border-slate-200'
              : 'bg-[#211640]/60 border-[#602A77]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl shadow-md ${
                isLight
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gradient-to-br from-[#AA4488] to-[#602A77] text-[#F8F4ED]'
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">
                  Export Structured Forensic PDF Report
                </h2>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                    isHighRisk
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : isSuspicious
                      ? 'bg-amber-100 text-amber-700 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  }`}
                >
                  {isHighRisk ? 'Critical Threat' : isSuspicious ? 'Caution' : 'Benign Verified'}
                </span>
              </div>
              <p
                className={`text-xs ${
                  isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'
                }`}
              >
                Comprehensive document compiling Bayesian probabilities, deep telemetry, YOLOv8 vision, and honeypot records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight
                ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                : 'hover:bg-[#602A77] text-[#EDB9BD]/70 hover:text-[#F8F4ED]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target & Risk Overview Preview Card */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#211640]/40 border-[#602A77]/60'
            }`}
          >
            <div className="space-y-1">
              <span className={`text-[11px] font-mono uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                Forensic Subject
              </span>
              <div className="font-mono text-sm font-bold flex items-center gap-1.5 truncate">
                <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="truncate">{analysis.host}</span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>Claimed: <strong>{analysis.claimedBrand.name}</strong></span>
                <span>•</span>
                <span className={analysis.isCanonical ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                  {analysis.isCanonical ? 'Official Domain' : 'Spoofed Domain'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`px-4 py-2 rounded-xl text-center border font-mono ${
                  isHighRisk
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : isSuspicious
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
              >
                <div className="text-[10px] uppercase font-semibold">Posterior Risk</div>
                <div className="text-xl font-bold">{(risk * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Section Selection Toggles */}
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              Configure Report Sections &amp; Data Fields
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Bayesian Risk Matrix */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  includeBayesian
                    ? isLight
                      ? 'bg-indigo-50/50 border-indigo-200 text-slate-900'
                      : 'bg-[#602A77]/30 border-[#AA4488] text-[#F8F4ED]'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-500 opacity-60'
                    : 'bg-[#211640]/30 border-[#602A77]/40 text-[#EDB9BD]/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={includeBayesian}
                  onChange={(e) => setIncludeBayesian(e.target.checked)}
                  className="mt-1 rounded accent-indigo-600"
                />
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Bayesian Arbiter Decomposition
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#EDB9BD]/70 mt-0.5">
                    Includes {analysis.bayesianArbiter.evidenceFactors.length} evidence factors, weights, priors, and mathematical risk bounds
                  </p>
                </div>
              </label>

              {/* Infrastructure Telemetry */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  includeTelemetry
                    ? isLight
                      ? 'bg-indigo-50/50 border-indigo-200 text-slate-900'
                      : 'bg-[#602A77]/30 border-[#AA4488] text-[#F8F4ED]'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-500 opacity-60'
                    : 'bg-[#211640]/30 border-[#602A77]/40 text-[#EDB9BD]/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={includeTelemetry}
                  onChange={(e) => setIncludeTelemetry(e.target.checked)}
                  className="mt-1 rounded accent-indigo-600"
                />
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    Deep Infrastructure &amp; Origin Telemetry
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#EDB9BD]/70 mt-0.5">
                    Domain age ({analysis.telemetry.domainAgeDays}d), ASN, TLS issuer, Free DV flag, and cross-origin sinks
                  </p>
                </div>
              </label>

              {/* YOLOv8 Vision Forensics */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  includeVision
                    ? isLight
                      ? 'bg-indigo-50/50 border-indigo-200 text-slate-900'
                      : 'bg-[#602A77]/30 border-[#AA4488] text-[#F8F4ED]'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-500 opacity-60'
                    : 'bg-[#211640]/30 border-[#602A77]/40 text-[#EDB9BD]/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={includeVision}
                  onChange={(e) => setIncludeVision(e.target.checked)}
                  className="mt-1 rounded accent-indigo-600"
                />
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-500" />
                    Computer Vision &amp; pHash Bounding Boxes
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#EDB9BD]/70 mt-0.5">
                    YOLOv8 detected elements ({analysis.vision?.detectedObjects.length || 0}), bounding coordinates, and perceptual hash distances
                  </p>
                </div>
              </label>

              {/* Threat Intelligence / Historical Match */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  includeHistorical
                    ? isLight
                      ? 'bg-indigo-50/50 border-indigo-200 text-slate-900'
                      : 'bg-[#602A77]/30 border-[#AA4488] text-[#F8F4ED]'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-500 opacity-60'
                    : 'bg-[#211640]/30 border-[#602A77]/40 text-[#EDB9BD]/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={includeHistorical}
                  onChange={(e) => setIncludeHistorical(e.target.checked)}
                  className="mt-1 rounded accent-indigo-600"
                />
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-pink-500" />
                    Threat Intelligence Precedent Correlation
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#EDB9BD]/70 mt-0.5">
                    {analysis.historicalMatch?.hasMatch
                      ? `Correlated with Historical Threat #${analysis.historicalMatch.matchedEntry?.id}`
                      : 'Zero-day novelty evaluation & DB query logs'}
                  </p>
                </div>
              </label>

              {/* Honeypot Decoy Countermeasures */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all sm:col-span-2 ${
                  includeHoneypot
                    ? isLight
                      ? 'bg-indigo-50/50 border-indigo-200 text-slate-900'
                      : 'bg-[#602A77]/30 border-[#AA4488] text-[#F8F4ED]'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-500 opacity-60'
                    : 'bg-[#211640]/30 border-[#602A77]/40 text-[#EDB9BD]/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={includeHoneypot}
                  onChange={(e) => setIncludeHoneypot(e.target.checked)}
                  className="mt-1 rounded accent-indigo-600"
                />
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                    Active Honeypot &amp; Canary Decoy Telemetry
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#EDB9BD]/70 mt-0.5">
                    {analysis.honeypot
                      ? `Includes canary token ${analysis.honeypot.canaryTrackingToken}, synthetic credential persona, and C2 exfiltration tripwires`
                      : 'Honeypot baseline records and response policies'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Analyst Notes / Investigation Context */}
          <div>
            <label className="text-xs font-bold font-mono uppercase tracking-wider mb-2 block">
              Analyst Notes &amp; Case Incident Remarks (Optional)
            </label>
            <textarea
              value={analystNotes}
              onChange={(e) => setAnalystNotes(e.target.value)}
              placeholder="e.g. Incident confirmed by SOC team during high-volume spear-phishing campaign. Domain suspended via abuse desk."
              rows={2}
              maxLength={240}
              className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:ring-2 ${
                isLight
                  ? 'bg-white border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 text-slate-900'
                  : 'bg-[#211640] border-[#602A77] focus:border-[#EDB9BD] text-[#F8F4ED]'
              }`}
            />
            <div className="text-[10px] text-slate-400 text-right mt-1 font-mono">
              {analystNotes.length}/240 characters
            </div>
          </div>

          {/* PDF Format Guarantee */}
          <div
            className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
              isLight
                ? 'bg-slate-100/70 border-slate-200 text-slate-600'
                : 'bg-[#211640]/60 border-[#602A77]/60 text-[#EDB9BD]/80'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Generates a high-resolution, vector-rendered A4 document complete with forensic evidence tables, cryptographic headers, and SOC playbook recommendations.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3 ${
            isLight
              ? 'bg-slate-50 border-slate-200'
              : 'bg-[#211640]/60 border-[#602A77]'
          }`}
        >
          <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
            <span className="font-semibold text-indigo-600 dark:text-[#EDB9BD]">Made by Ciphersquad</span>
            {hasExported && (
              <>
                <span className="opacity-40">·</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Download started! File saved to your computer.
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                isLight
                  ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'border-[#602A77] text-[#EDB9BD] hover:bg-[#602A77]/50'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                isLight
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                  : 'bg-gradient-to-r from-[#AA4488] to-[#602A77] hover:brightness-110 text-[#F8F4ED] shadow-[#602A77]/40'
              } disabled:opacity-50`}
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
