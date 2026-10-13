/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { PipelineFlow } from './components/PipelineFlow';
import { BrowserViewport } from './components/BrowserViewport';
import { VisionInspector } from './components/VisionInspector';
import { TelemetryInspector } from './components/TelemetryInspector';
import { BayesianArbiterView } from './components/BayesianArbiterView';
import { HoneypotDefenseCenter } from './components/HoneypotDefenseCenter';
import { HistoricalDatabaseView } from './components/HistoricalDatabaseView';
import { GeminiAuditModal } from './components/GeminiAuditModal';
import { ExportReportModal } from './components/ExportReportModal';
import { SCENARIO_PRESETS } from './data/scenarios';
import { ScenarioPreset, AnalysisResponse, InterceptEvent } from './types';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentScenario, setCurrentScenario] = useState<ScenarioPreset>(SCENARIO_PRESETS[0]);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [activeView, setActiveView] = useState<
    'viewport' | 'vision' | 'telemetry' | 'bayesian' | 'honeypot' | 'history'
  >('viewport');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [interceptFeed, setInterceptFeed] = useState<InterceptEvent[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch Honeypot Intercept Feed
  const fetchInterceptFeed = useCallback(async () => {
    try {
      const res = await fetch('/api/honeypot/feed');
      if (res.ok) {
        const data = await res.json();
        setInterceptFeed(data.feed || []);
      }
    } catch {
      // Fallback in-memory feed handled smoothly
    }
  }, []);

  // Run full analysis on current target
  const runAnalysis = useCallback(async (scenario: ScenarioPreset, customUrl?: string) => {
    setIsAnalyzing(true);
    try {
      const targetUrl = customUrl || scenario.url;
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          claimedBrandId: scenario.claimedBrandId,
        }),
      });
      if (res.ok) {
        const data: AnalysisResponse = await res.json();
        setAnalysis(data);
      }
    } catch (err) {
      console.error('Failed to analyze scenario:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Trigger analysis when scenario changes
  useEffect(() => {
    runAnalysis(currentScenario);
    fetchInterceptFeed();
  }, [currentScenario, runAnalysis, fetchInterceptFeed]);

  // Handle Scenario Switch
  const handleSelectScenario = (scenario: ScenarioPreset) => {
    setCurrentScenario(scenario);
  };

  // Handle Custom URL Scan Submission
  const handleCustomUrlSubmit = (url: string) => {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    // Infer brand or maintain current
    const customScenario: ScenarioPreset = {
      ...currentScenario,
      url: cleanUrl,
      id: `custom-${Date.now()}`,
      name: `Custom Target (${cleanUrl.replace(/^https?:\/\//, '').split('/')[0]})`,
    };
    setCurrentScenario(customScenario);
    runAnalysis(customScenario, cleanUrl);
    setToastMessage(`Scanning custom target: ${cleanUrl}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle selecting a threat from Historical DB to inspect in Viewport
  const handleSelectThreatToInspect = (threatDomain: string) => {
    const fullUrl = `https://${threatDomain}/login`;
    handleCustomUrlSubmit(fullUrl);
    setActiveView('viewport');
  };

  // Handle Honeypot Trap Transmit
  const handleFireHoneypotTrap = async (payload: Record<string, string>, canaryToken: string) => {
    try {
      const res = await fetch('/api/honeypot/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetDomain: analysis?.host || currentScenario.url.replace(/^https?:\/\//, ''),
          claimedBrand: currentScenario.mockPage.brandName,
          capturedPayload: payload,
          canaryToken,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.intercept) {
          setInterceptFeed((prev) => [data.intercept, ...prev]);
        }
        setToastMessage(`Canary trap fired! Attacker C2 poisoned with tracking token ${canaryToken}`);
        setTimeout(() => setToastMessage(null), 5000);
      }
    } catch {
      // Local fallback
      const fallbackEvent: InterceptEvent = {
        id: `hp-intercept-${Date.now()}`,
        timestamp: new Date().toISOString(),
        targetDomain: analysis?.host || 'phish-threat.internal',
        claimedBrand: currentScenario.mockPage.brandName,
        attackerMethod: 'POST /v1/auth/capture',
        capturedPayload: payload,
        canaryToken,
        responseInjected: 'HTTP 302 Poisoned Canary Accepted -> Malicious Botnet diverted',
        attackerIp: '194.26.29.112 (Bulletproof RU)',
      };
      setInterceptFeed((prev) => [fallbackEvent, ...prev]);
      setToastMessage(`Canary trap fired! Attacker C2 poisoned with tracking token ${canaryToken}`);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const riskScore = analysis?.bayesianArbiter.posteriorRisk ?? currentScenario.expectedRisk;
  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-200 ${
        isLight
          ? 'bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white'
          : 'bg-[#0C0C1F] text-[#F8F4ED] selection:bg-[#AA4488] selection:text-[#F8F4ED]'
      }`}
    >
      {/* Ambient Background Aura */}
      {isLight ? (
        <>
          <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[140px] pointer-events-none" />
          <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[140px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#602A77]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#AA4488]/10 rounded-full blur-[140px] pointer-events-none" />
        </>
      )}

      {/* Top Navbar */}
      <Navbar
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        onOpenGeminiAudit={() => setIsGeminiModalOpen(true)}
        onOpenExportReport={() => setIsExportModalOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        interceptCount={interceptFeed.length}
        activeView={activeView}
        onChangeView={setActiveView}
        isAnalyzing={isAnalyzing}
        onTriggerReanalysis={() => runAnalysis(currentScenario)}
        riskScore={riskScore}
        hasHistoricalMatch={Boolean(analysis?.historicalMatch?.hasMatch)}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-300 text-xs font-mono border ${
            isLight
              ? 'bg-white border-slate-300 text-slate-900 shadow-slate-200'
              : 'bg-[#211640] border-[#AA4488] text-[#F8F4ED]'
          }`}
        >
          <CheckCircle2
            className={`w-4 h-4 shrink-0 ${isLight ? 'text-emerald-600' : 'text-[#EDB9BD]'}`}
          />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
        {/* Pipeline Architecture Flow Banner */}
        <PipelineFlow
          analysis={analysis}
          activeView={activeView}
          onChangeView={setActiveView}
          isAnalyzing={isAnalyzing}
          theme={theme}
        />

        {/* View Switcher Container */}
        <div className="transition-all duration-200">
          {activeView === 'viewport' && (
            <BrowserViewport
              scenario={currentScenario}
              analysis={analysis}
              onFireHoneypotTrap={handleFireHoneypotTrap}
              onOpenGeminiAudit={() => setIsGeminiModalOpen(true)}
              onExportPdf={() => setIsExportModalOpen(true)}
              isAnalyzing={isAnalyzing}
              onReload={() => runAnalysis(currentScenario)}
              onCustomUrlSubmit={handleCustomUrlSubmit}
              theme={theme}
            />
          )}

          {activeView === 'history' && (
            <HistoricalDatabaseView
              currentMatch={analysis?.historicalMatch ?? null}
              onSelectThreatToInspect={handleSelectThreatToInspect}
              theme={theme}
            />
          )}

          {activeView === 'vision' && (
            <VisionInspector analysis={analysis} theme={theme} />
          )}

          {activeView === 'telemetry' && (
            <TelemetryInspector
              analysis={analysis}
              theme={theme}
              onExportPdf={() => setIsExportModalOpen(true)}
            />
          )}

          {activeView === 'bayesian' && (
            <BayesianArbiterView
              analysis={analysis}
              theme={theme}
              onExportPdf={() => setIsExportModalOpen(true)}
            />
          )}

          {activeView === 'honeypot' && (
            <HoneypotDefenseCenter
              analysis={analysis}
              interceptFeed={interceptFeed}
              onFireTrap={handleFireHoneypotTrap}
              onRefreshFeed={fetchInterceptFeed}
              theme={theme}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-4 text-center text-xs font-mono relative z-10 transition-colors duration-200 ${
          isLight
            ? 'border-slate-200 bg-white/90 text-slate-500'
            : 'border-[#211640] bg-[#0C0C1F] text-[#EDB9BD]/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>PHANTOM AI Browser Security Engine · Bayesian Discrepancy Arbiter</span>
            <span className="opacity-40">·</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                isLight
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-[#211640] text-[#EDB9BD] border border-[#602A77]'
              }`}
            >
              Made by Ciphersquad
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                isLight ? 'bg-slate-100 text-slate-700' : 'bg-[#211640] text-[#EDB9BD]'
              }`}
            >
              Mode: {isLight ? 'Light Mode Active' : 'Dark Mode Active'}
            </span>
            <span>·</span>
            <span>YOLOv8-Nano + TLS/WHOIS Telemetry + Active Honeypot Defense</span>
          </div>
        </div>
      </footer>

      {/* Gemini Deep Audit Modal */}
      <GeminiAuditModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        analysis={analysis}
        theme={theme}
      />

      {/* Structured Forensic PDF Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        analysis={analysis}
        scenario={currentScenario}
        theme={theme}
      />
    </div>
  );
}
