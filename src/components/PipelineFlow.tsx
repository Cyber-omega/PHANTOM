import React from 'react';
import {
  Camera,
  Cpu,
  Layers,
  Activity,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Eye,
  Database,
} from 'lucide-react';
import { AnalysisResponse } from '../types';

interface PipelineFlowProps {
  analysis: AnalysisResponse | null;
  activeView: string;
  onChangeView: (view: any) => void;
  isAnalyzing: boolean;
  theme?: 'light' | 'dark';
}

export function PipelineFlow({
  analysis,
  activeView,
  onChangeView,
  isAnalyzing,
  theme = 'light',
}: PipelineFlowProps) {
  if (!analysis) return null;

  const risk = analysis.bayesianArbiter.posteriorRisk;
  const isQuarantine = risk >= 0.8;
  const isSuspicious = risk >= 0.3 && risk < 0.8;
  const isLight = theme === 'light';

  return (
    <div
      className={`border rounded-2xl p-4 transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200/90 shadow-sm text-slate-900'
          : 'bg-[#211640]/90 border-[#602A77]/70 shadow-2xl text-[#F8F4ED] backdrop-blur-md'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider">
            Real-Time Processing Graph: Viewport to Arbiter Pipeline
          </h2>
        </div>
        <div
          className={`flex items-center gap-3 text-[11px] font-mono ${
            isLight ? 'text-slate-500' : 'text-[#EDB9BD]/80'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Tab Capture Stream
          </span>
          <span className={isLight ? 'text-slate-300' : 'text-[#602A77]'}>|</span>
          <span>Engine: E2E ~18ms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-center relative">
        {/* Step 0: Historical Database Query */}
        <div
          onClick={() => onChangeView('history')}
          className={`cursor-pointer group relative p-3 rounded-xl border transition-all ${
            activeView === 'history'
              ? isLight
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-800'
                : 'bg-[#602A77] border-[#EDB9BD] text-[#F8F4ED]'
              : analysis.historicalMatch?.hasMatch
              ? isLight
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-[#AA4488]/20 border-[#AA4488] text-[#F8F4ED]'
              : isLight
              ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
              : 'bg-[#0C0C1F]/80 border-[#602A77]/50 hover:border-[#602A77] text-[#F8F4ED]'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span
              className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                activeView === 'history'
                  ? 'bg-white/20 text-white'
                  : isLight
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-[#211640] text-[#EDB9BD]'
              }`}
            >
              STAGE 0
            </span>
            <Database className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-semibold text-xs">Threat DB Query</p>
          <p className={`text-[11px] mt-0.5 ${activeView === 'history' ? 'opacity-90' : isLight ? 'text-slate-500' : 'text-[#EDB9BD]/80'}`}>
            Pre-arbiter historical lookup
          </p>
          <div
            className={`mt-2 text-[10px] font-mono flex items-center justify-between border-t pt-1.5 ${
              activeView === 'history'
                ? 'border-white/20'
                : isLight
                ? 'border-slate-200'
                : 'border-[#602A77]/40'
            }`}
          >
            <span>{analysis.historicalMatch?.hasMatch ? 'Precedent Found' : 'Clean'}</span>
            <span className={analysis.historicalMatch?.hasMatch ? 'text-rose-600 font-bold' : ''}>
              {analysis.historicalMatch?.hasMatch ? 'CORRELATED' : '0 matches'}
            </span>
          </div>
        </div>

        {/* Step 1: Browser Viewport Capture */}
        <div
          onClick={() => onChangeView('viewport')}
          className={`cursor-pointer group relative p-3 rounded-xl border transition-all ${
            activeView === 'viewport'
              ? isLight
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-800'
                : 'bg-[#602A77] border-[#EDB9BD] text-[#F8F4ED]'
              : isLight
              ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
              : 'bg-[#0C0C1F]/80 border-[#602A77]/50 hover:border-[#602A77] text-[#F8F4ED]'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span
              className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                activeView === 'viewport'
                  ? 'bg-white/20 text-white'
                  : isLight
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-[#211640] text-[#EDB9BD]'
              }`}
            >
              STAGE 1
            </span>
            <Camera className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-semibold text-xs">Viewport &amp; DOM</p>
          <p className={`text-[11px] mt-0.5 ${activeView === 'viewport' ? 'opacity-90' : isLight ? 'text-slate-500' : 'text-[#EDB9BD]/80'}`}>
            Screenshot &amp; DOM tree
          </p>
          <div
            className={`mt-2 text-[10px] font-mono flex items-center justify-between border-t pt-1.5 ${
              activeView === 'viewport' ? 'border-white/20' : isLight ? 'border-slate-200' : 'border-[#602A77]/40'
            }`}
          >
            <span>Latency: 4.2ms</span>
            <span className="opacity-80">1080p Canvas</span>
          </div>
        </div>

        {/* Step 2: Vision Pipeline */}
        <div
          onClick={() => onChangeView('vision')}
          className={`cursor-pointer group relative p-3 rounded-xl border transition-all ${
            activeView === 'vision'
              ? isLight
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-800'
                : 'bg-[#602A77] border-[#EDB9BD] text-[#F8F4ED]'
              : isLight
              ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
              : 'bg-[#0C0C1F]/80 border-[#602A77]/50 hover:border-[#602A77] text-[#F8F4ED]'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span
              className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                activeView === 'vision'
                  ? 'bg-white/20 text-white'
                  : isLight
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-[#211640] text-[#EDB9BD]'
              }`}
            >
              STAGE 2
            </span>
            <Cpu className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-semibold text-xs">Vision Pipeline</p>
          <p className={`text-[11px] mt-0.5 ${activeView === 'vision' ? 'opacity-90' : isLight ? 'text-slate-500' : 'text-[#EDB9BD]/80'}`}>
            YOLOv8-Nano + CLIP
          </p>
          <div
            className={`mt-2 text-[10px] font-mono flex items-center justify-between border-t pt-1.5 ${
              activeView === 'vision' ? 'border-white/20' : isLight ? 'border-slate-200' : 'border-[#602A77]/40'
            }`}
          >
            <span>{analysis.claimedBrand.name}</span>
            <span className="font-bold">{(analysis.vision.claimedBrandVisualConfidence * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Step 3: Semantic & Origin */}
        <div
          onClick={() => onChangeView('telemetry')}
          className={`cursor-pointer group relative p-3 rounded-xl border transition-all ${
            activeView === 'telemetry'
              ? isLight
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-800'
                : 'bg-[#602A77] border-[#EDB9BD] text-[#F8F4ED]'
              : isLight
              ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
              : 'bg-[#0C0C1F]/80 border-[#602A77]/50 hover:border-[#602A77] text-[#F8F4ED]'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span
              className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                activeView === 'telemetry'
                  ? 'bg-white/20 text-white'
                  : isLight
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-[#211640] text-[#EDB9BD]'
              }`}
            >
              STAGE 3
            </span>
            <Layers className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-semibold text-xs">Semantic &amp; Origin</p>
          <p className={`text-[11px] mt-0.5 ${activeView === 'telemetry' ? 'opacity-90' : isLight ? 'text-slate-500' : 'text-[#EDB9BD]/80'}`}>
            Levenshtein &amp; WHOIS
          </p>
          <div
            className={`mt-2 text-[10px] font-mono flex items-center justify-between border-t pt-1.5 ${
              activeView === 'telemetry' ? 'border-white/20' : isLight ? 'border-slate-200' : 'border-[#602A77]/40'
            }`}
          >
            <span>Age: {analysis.telemetry.domainAgeDays}d</span>
            <span className={analysis.isCanonical ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
              {analysis.isCanonical ? 'Canonical' : 'Rogue'}
            </span>
          </div>
        </div>

        {/* Step 4: Bayesian Arbiter */}
        <div
          onClick={() => onChangeView('bayesian')}
          className={`cursor-pointer group relative p-3 rounded-xl border transition-all ${
            activeView === 'bayesian'
              ? isLight
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-800'
                : 'bg-[#602A77] border-[#EDB9BD] text-[#F8F4ED]'
              : isLight
              ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
              : 'bg-[#0C0C1F]/80 border-[#602A77]/50 hover:border-[#602A77] text-[#F8F4ED]'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span
              className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                activeView === 'bayesian'
                  ? 'bg-white/20 text-white'
                  : isLight
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-[#211640] text-[#EDB9BD]'
              }`}
            >
              STAGE 4
            </span>
            <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-semibold text-xs">Bayesian Arbiter</p>
          <p className={`text-[11px] mt-0.5 ${activeView === 'bayesian' ? 'opacity-90' : isLight ? 'text-slate-500' : 'text-[#EDB9BD]/80'}`}>
            Cross-entropy matrix
          </p>
          <div
            className={`mt-2 text-[10px] font-mono flex items-center justify-between border-t pt-1.5 ${
              activeView === 'bayesian' ? 'border-white/20' : isLight ? 'border-slate-200' : 'border-[#602A77]/40'
            }`}
          >
            <span>Prior: 5.0%</span>
            <span className="font-bold">Post: {(risk * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Step 5: Active Defense */}
        <div
          onClick={() => onChangeView(isQuarantine ? 'honeypot' : 'viewport')}
          className={`cursor-pointer group relative p-3 rounded-xl border transition-all ${
            isQuarantine
              ? isLight
                ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-sm'
                : 'bg-[#AA4488]/30 border-[#AA4488] text-[#F8F4ED]'
              : isSuspicious
              ? isLight
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-[#602A77]/40 border-[#602A77] text-[#F8F4ED]'
              : isLight
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-[#211640] border-[#602A77] text-[#F8F4ED]'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span
              className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                isQuarantine
                  ? 'bg-rose-600 text-white'
                  : isSuspicious
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              DECISION
            </span>
            {isQuarantine ? (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            ) : isSuspicious ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            )}
          </div>
          <p className="font-semibold text-xs">
            {isQuarantine ? 'Honeypot Decoy' : isSuspicious ? 'Caution' : 'Approved'}
          </p>
          <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}`}>
            {isQuarantine ? 'Canary trap armed' : isSuspicious ? 'Elevated risk' : 'Zero discrepancy'}
          </p>
          <div
            className={`mt-2 text-[10px] font-mono flex items-center justify-between border-t pt-1.5 ${
              isLight ? 'border-black/10' : 'border-[#602A77]/40'
            }`}
          >
            <span>Action:</span>
            <span className="font-bold underline">
              {isQuarantine ? 'FIRE DECOY' : isSuspicious ? 'WARN USER' : 'ALLOW'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
