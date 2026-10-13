import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Bot,
  Terminal,
  Radio,
  Sparkles,
  Database,
  Sun,
  Moon,
  FileText,
} from 'lucide-react';
import { ScenarioPreset } from '../types';
import { SCENARIO_PRESETS } from '../data/scenarios';

interface NavbarProps {
  currentScenario: ScenarioPreset;
  onSelectScenario: (scenario: ScenarioPreset) => void;
  onOpenGeminiAudit: () => void;
  onOpenExportReport?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  interceptCount: number;
  activeView: 'viewport' | 'vision' | 'telemetry' | 'bayesian' | 'honeypot' | 'history';
  onChangeView: (view: 'viewport' | 'vision' | 'telemetry' | 'bayesian' | 'honeypot' | 'history') => void;
  isAnalyzing: boolean;
  onTriggerReanalysis: () => void;
  riskScore: number;
  hasHistoricalMatch?: boolean;
}

export function Navbar({
  currentScenario,
  onSelectScenario,
  onOpenGeminiAudit,
  onOpenExportReport,
  theme,
  onToggleTheme,
  interceptCount,
  activeView,
  onChangeView,
  isAnalyzing,
  onTriggerReanalysis,
  riskScore,
  hasHistoricalMatch,
}: NavbarProps) {
  const isHighRisk = riskScore >= 0.8;
  const isSuspicious = riskScore >= 0.3 && riskScore < 0.8;
  const isLight = theme === 'light';

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-200 ${
        isLight
          ? 'bg-white/95 border-b border-slate-200/80 text-slate-900 shadow-sm'
          : 'bg-[#0C0C1F]/95 border-b border-[#211640] text-[#F8F4ED] shadow-2xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3">
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl shadow-md ring-1 transition-all ${
                isLight
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white ring-indigo-200'
                  : 'bg-gradient-to-br from-[#AA4488] via-[#602A77] to-[#211640] text-[#F8F4ED] ring-[#EDB9BD]/30 shadow-[#602A77]/40'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
              <div
                className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse ring-2 ${
                  isLight ? 'bg-emerald-500 ring-white' : 'bg-[#EDB9BD] ring-[#0C0C1F]'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  style={{ fontFamily: 'Georgia', fontStyle: 'italic', borderColor: '#080808' }}
                  className={`font-extrabold tracking-wider text-lg ${
                    isLight ? 'text-slate-900' : 'text-[#F8F4ED]'
                  }`}
                >
                  PHANTOM
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold border uppercase ${
                    isLight
                      ? 'bg-slate-100 text-slate-600 border-slate-300'
                      : 'bg-[#211640] text-[#EDB9BD] border-[#602A77]'
                  }`}
                >
                  v2.4 Nano
                </span>
              </div>
              <p
                className={`text-[11px] font-mono hidden sm:block ${
                  isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'
                }`}
              >
                AI Browser Security &amp; Bayesian Discrepancy Arbiter
              </p>
            </div>
          </div>

          {/* Quick Scenario Switcher */}
          <div
            className={`hidden lg:flex items-center gap-1.5 p-1 rounded-xl border ${
              isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-[#211640]/80 border-[#602A77]/60'
            }`}
          >
            <span
              className={`text-[11px] px-2 font-mono flex items-center gap-1 ${
                isLight ? 'text-slate-500' : 'text-[#EDB9BD]'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-500" /> Attack:
            </span>
            <div className="flex items-center gap-1 max-w-md overflow-x-auto">
              {SCENARIO_PRESETS.map((scenario) => {
                const isSelected = scenario.id === currentScenario.id;
                const isBenign = scenario.category === 'Authentic Benchmark';

                let buttonClass = '';
                if (isLight) {
                  buttonClass = isSelected
                    ? isBenign
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60';
                } else {
                  buttonClass = isSelected
                    ? isBenign
                      ? 'bg-[#602A77]/80 text-[#F8F4ED] border border-[#EDB9BD]/50 shadow-sm'
                      : 'bg-[#AA4488]/80 text-[#F8F4ED] border border-[#EDB9BD]/60 shadow-sm'
                    : 'text-[#EDB9BD]/70 hover:text-[#F8F4ED] hover:bg-[#0C0C1F]/60';
                }

                return (
                  <button
                    key={scenario.id}
                    onClick={() => onSelectScenario(scenario)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${buttonClass}`}
                    title={scenario.description}
                  >
                    {scenario.mockPage.brandName}
                    <span
                      className={`ml-1 text-[9px] px-1 py-0.2 rounded font-mono ${
                        isLight
                          ? isSelected
                            ? 'bg-black/20 text-white'
                            : 'bg-slate-200 text-slate-700'
                          : isBenign
                          ? 'bg-[#211640] text-[#EDB9BD]'
                          : 'bg-[#0C0C1F] text-[#EDB9BD]'
                      }`}
                    >
                      {isBenign ? 'Legit' : 'Phish'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions & Status */}
          <div className="flex items-center gap-2">
            {/* Live Risk Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold shadow-inner ${
                isHighRisk
                  ? isLight
                    ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                    : 'bg-[#AA4488]/25 border-[#AA4488] text-[#EDB9BD] animate-pulse'
                  : isSuspicious
                  ? isLight
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-[#602A77]/35 border-[#602A77] text-[#EDB9BD]'
                  : isLight
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-[#211640] border-[#602A77]/70 text-[#F8F4ED]'
              }`}
            >
              {isHighRisk ? (
                <ShieldAlert className="w-3.5 h-3.5" />
              ) : isSuspicious ? (
                <Activity className="w-3.5 h-3.5" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
              <span>Risk: {(riskScore * 100).toFixed(0)}%</span>
            </div>

            {/* Theme Toggle Button (Light Mode / Dark Mode) */}
            <button
              onClick={onToggleTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border shadow-sm transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  : 'bg-[#211640] hover:bg-[#602A77]/70 text-[#EDB9BD] border-[#602A77]'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>

            {/* Gemini Deep Audit Trigger */}
            <button
              onClick={onOpenGeminiAudit}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shadow-md transition-all cursor-pointer ${
                isLight
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-100'
                  : 'bg-gradient-to-r from-[#AA4488] to-[#602A77] hover:brightness-110 text-[#F8F4ED] shadow-[#602A77]/40'
              }`}
              title="Launch Gemini Multimodal Zero-Day Audit"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Deep Audit</span>
            </button>

            {/* Export Structured PDF Report */}
            {onOpenExportReport && (
              <button
                onClick={onOpenExportReport}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border shadow-sm transition-all cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                    : 'bg-[#211640] hover:bg-[#602A77] text-[#F8F4ED] border-[#602A77]'
                }`}
                title="Export current analysis data, Bayesian scores & telemetry as structured PDF"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            )}

            {/* Honeypot Tripwire Counter */}
            <button
              onClick={() => onChangeView('honeypot')}
              className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                activeView === 'honeypot'
                  ? isLight
                    ? 'bg-purple-100 border-purple-400 text-purple-900 font-bold'
                    : 'bg-[#602A77] border-[#EDB9BD] text-[#F8F4ED]'
                  : isLight
                  ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  : 'bg-[#211640] border-[#602A77]/60 text-[#EDB9BD]/80 hover:border-[#602A77]'
              }`}
              title="View Honeypot Cyber-Deception Feed"
            >
              <Radio className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
              <span className="hidden sm:inline">Honeypot:</span>
              <span
                className={`px-1.5 py-0.2 rounded font-bold ${
                  isLight ? 'bg-purple-200 text-purple-900' : 'bg-[#0C0C1F] text-[#F8F4ED]'
                }`}
              >
                {interceptCount}
              </span>
            </button>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <div
          className={`flex items-center justify-between border-t py-2 overflow-x-auto text-xs ${
            isLight ? 'border-slate-200' : 'border-[#211640]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {[
              { id: 'viewport', label: 'Browser Viewport', icon: Terminal },
              { id: 'history', label: 'Historical Threat DB', icon: Database, alert: hasHistoricalMatch },
              { id: 'vision', label: 'Vision Pipeline', icon: Bot },
              { id: 'telemetry', label: 'Semantic & Origin', icon: Activity },
              { id: 'bayesian', label: 'Bayesian Arbiter', icon: Zap },
              { id: 'honeypot', label: 'Honeypot Decoy UI', icon: ShieldAlert },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;

              let tabClass = '';
              if (isLight) {
                tabClass = isActive
                  ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
              } else {
                tabClass = isActive
                  ? 'bg-[#602A77] text-[#F8F4ED] shadow-sm ring-1 ring-[#EDB9BD]/50'
                  : 'text-[#EDB9BD]/70 hover:text-[#F8F4ED] hover:bg-[#211640]/50';
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeView(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${tabClass}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.alert && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                  {tab.id === 'viewport' && isHighRisk && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          <div
            className={`hidden md:flex items-center gap-2 text-[11px] font-mono ${
              isLight ? 'text-slate-500' : 'text-[#EDB9BD]/80'
            }`}
          >
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Pipeline: 18ms latency
            </span>
            <button
              onClick={onTriggerReanalysis}
              disabled={isAnalyzing}
              className={`text-xs px-2 py-1 rounded border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  : 'bg-[#211640] hover:bg-[#602A77] text-[#F8F4ED] border-[#602A77]/60'
              }`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Rescan Viewport'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
