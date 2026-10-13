import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Calculator,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { AnalysisResponse } from '../types';

interface BayesianArbiterViewProps {
  analysis: AnalysisResponse | null;
  theme?: 'light' | 'dark';
  onExportPdf?: () => void;
}

export function BayesianArbiterView({ analysis, theme = 'light', onExportPdf }: BayesianArbiterViewProps) {
  if (!analysis) return null;

  const { bayesianArbiter, claimedBrand, isCanonical, host } = analysis;
  const isLight = theme === 'light';

  // Interactive What-If simulation state
  const [simVisualClaim, setSimVisualClaim] = useState(0.95);
  const [simCanonical, setSimCanonical] = useState(isCanonical);
  const [simDomainAgeDays, setSimDomainAgeDays] = useState(analysis.telemetry.domainAgeDays);
  const [simFreeDV, setSimFreeDV] = useState(analysis.telemetry.isFreeDV);
  const [simExfilAction, setSimExfilAction] = useState(analysis.telemetry.externalExfilAction);

  // Compute simulated posterior
  const computeSimulatedPosterior = () => {
    let odds = 0.05 / 0.95; // Prior odds 5%

    if (simVisualClaim > 0.7) {
      if (simCanonical) {
        odds *= 0.02;
      } else {
        odds *= 18.5;
      }
    }

    if (!simCanonical) {
      odds *= 7.5; // Typosquatting / discrepancy
    }

    if (simDomainAgeDays < 14) {
      odds *= 6.2;
    } else if (simDomainAgeDays < 90) {
      odds *= 2.4;
    } else if (simDomainAgeDays > 365 * 3) {
      odds *= 0.3;
    }

    if (!simCanonical && simFreeDV) {
      odds *= 3.8;
    }

    if (simExfilAction && !simCanonical) {
      odds *= 9.0;
    }

    const posterior = odds / (1 + odds);
    return Math.max(0.005, Math.min(0.999, posterior));
  };

  const simRisk = computeSimulatedPosterior();

  return (
    <div className={`space-y-6 transition-colors duration-200 ${isLight ? 'text-slate-900' : 'text-[#F8F4ED]'}`}>
      {/* Arbiter Hero Gauge & Decision Header */}
      <div
        className={`border rounded-2xl p-6 transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-sm'
            : 'bg-[#211640]/90 border-[#602A77]/70 shadow-2xl backdrop-blur-md'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                  isLight
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-[#0C0C1F] text-[#EDB9BD] border-[#602A77]'
                }`}
              >
                BAYESIAN INFERENCE MATRIX
              </span>
              <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                P(Phish | E₀, E₁, E₂, E₃, E₄, E₅)
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Bayesian Discrepancy Arbiter Decision Engine
            </h2>
            <p className={`text-xs mt-1 max-w-xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}`}>
              Combines multi-modal visual observations with independent domain heuristics via Bayes' Rule to prevent false positives while catching evasive zero-day attacks.
            </p>
          </div>

          {/* Posterior Gauge Score */}
          <div
            className={`flex items-center gap-4 p-4 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-[#0C0C1F] border-[#602A77]'
            }`}
          >
            <div className="text-center">
              <span
                className={`text-[10px] font-mono uppercase tracking-wider block ${
                  isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'
                }`}
              >
                Posterior Risk
              </span>
              <span
                className={`text-4xl font-extrabold font-mono tracking-tight ${
                  bayesianArbiter.posteriorRisk >= 0.8
                    ? 'text-rose-600'
                    : bayesianArbiter.posteriorRisk >= 0.3
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {(bayesianArbiter.posteriorRisk * 100).toFixed(1)}%
              </span>
            </div>

            <div className={`h-12 w-px ${isLight ? 'bg-slate-200' : 'bg-[#602A77]/60'}`} />

            <div>
              <span
                className={`text-[10px] font-mono uppercase tracking-wider block ${
                  isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'
                }`}
              >
                Arbiter Decision
              </span>
              <span
                className={`text-xs font-bold font-mono px-2.5 py-1 rounded inline-block mt-1 ${
                  bayesianArbiter.decision === 'QUARANTINE_HONEYPOT'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : bayesianArbiter.decision === 'SUSPICIOUS'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {bayesianArbiter.decision === 'QUARANTINE_HONEYPOT'
                  ? 'FIRE HONEYPOT DECOY (>=0.80)'
                  : bayesianArbiter.decision === 'SUSPICIOUS'
                  ? 'SUSPICIOUS / STEP-UP (0.30 - 0.79)'
                  : 'ALLOW ORIGIN (<0.30)'}
              </span>
            </div>

            {onExportPdf && (
              <>
                <div className={`h-12 w-px hidden sm:block ${isLight ? 'bg-slate-200' : 'bg-[#602A77]/60'}`} />
                <button
                  onClick={onExportPdf}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border shadow-sm transition-all cursor-pointer ${
                    isLight
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700 shadow-indigo-100'
                      : 'bg-gradient-to-r from-[#AA4488] to-[#602A77] hover:brightness-110 text-[#F8F4ED] border-[#EDB9BD]/30 shadow-[#602A77]/40'
                  }`}
                  title="Export Bayesian risk factors & telemetry data as structured PDF report"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Risk Threshold Meter */}
        <div className={`mt-6 pt-5 border-t ${isLight ? 'border-slate-100' : 'border-[#602A77]/50'}`}>
          <div
            className={`flex items-center justify-between text-xs font-mono mb-2 ${
              isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'
            }`}
          >
            <span>0.00 (Benign)</span>
            <span className="text-amber-600 font-bold">Threshold 0.30 (Suspicious)</span>
            <span className="text-rose-600 font-bold">Threshold 0.80 (Quarantine / Honeypot)</span>
            <span>1.00 (Phish)</span>
          </div>
          <div
            className={`w-full h-3 rounded-full overflow-hidden relative border ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#0C0C1F] border-[#602A77]'
            }`}
          >
            <div className="absolute inset-0 flex">
              <div className={`w-[30%] ${isLight ? 'bg-emerald-100' : 'bg-[#211640]'}`} />
              <div className={`w-[50%] ${isLight ? 'bg-amber-100' : 'bg-[#602A77]/60'}`} />
              <div className={`w-[20%] ${isLight ? 'bg-rose-200' : 'bg-[#AA4488]/80'}`} />
            </div>
            <div
              className={`absolute top-0 bottom-0 w-2.5 shadow-lg transition-all duration-500 rounded-full ${
                isLight ? 'bg-slate-900' : 'bg-[#F8F4ED]'
              }`}
              style={{ left: `calc(${bayesianArbiter.posteriorRisk * 100}% - 5px)` }}
            />
          </div>
        </div>
      </div>

      {/* Mathematical Breakdown & Evidence Nodes */}
      <div
        className={`border rounded-2xl p-5 transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-sm'
            : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
        }`}
      >
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 mb-4">
          <Calculator className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
          Evidence Node Decomposition &amp; Likelihood Ratios
        </h3>

        {/* Historical Database Precedent Callout */}
        {analysis.historicalMatch?.hasMatch && analysis.historicalMatch.matchedEntry && (
          <div
            className={`mb-4 p-3.5 rounded-xl border text-xs font-mono flex items-start gap-3 ${
              isLight
                ? 'bg-purple-50/70 border-purple-300 text-purple-950'
                : 'bg-[#0C0C1F] border-[#AA4488] text-[#F8F4ED]'
            }`}
          >
            <span
              className={`px-2 py-0.5 rounded font-bold shrink-0 ${
                isLight ? 'bg-purple-700 text-white' : 'bg-[#AA4488] text-[#F8F4ED]'
              }`}
            >
              HISTORICAL DB
            </span>
            <div className="space-y-1">
              <span className="font-bold block">
                Historical Precedent Informed Prior &amp; Evidence ({analysis.historicalMatch.matchedEntry.id})
              </span>
              <p className={`text-[11px] font-sans leading-relaxed ${isLight ? 'text-purple-900' : 'text-[#EDB9BD]'}`}>
                {analysis.historicalMatch.correlationBasis}
              </p>
              <div className={`text-[10px] font-mono pt-1 ${isLight ? 'text-purple-700' : 'text-[#EDB9BD]'}`}>
                Prior boosted by +{(analysis.historicalMatch.impactOnBayesianRisk.priorBoost * 100).toFixed(0)}% · Evidence likelihood multiplier: ×{analysis.historicalMatch.impactOnBayesianRisk.likelihoodRatioMultiplier}.0
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {bayesianArbiter.evidenceFactors.map((factor, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-3.5 border flex flex-wrap items-center justify-between gap-3 text-xs transition-colors ${
                isLight
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-[#0C0C1F] border-[#602A77]/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                    isLight
                      ? 'bg-white text-slate-700 border-slate-300'
                      : 'bg-[#211640] text-[#EDB9BD] border-[#602A77]'
                  }`}
                >
                  E_{idx + 1}
                </span>
                <div>
                  <h4 className="font-semibold">{factor.name}</h4>
                  <p
                    className={`text-[11px] mt-0.5 font-sans leading-relaxed ${
                      isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'
                    }`}
                  >
                    {factor.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono">
                <div className="text-right">
                  <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/60'}`}>
                    Likelihood Ratio (LR)
                  </span>
                  <span
                    className={`font-bold ${
                      factor.weight > 1
                        ? 'text-rose-600'
                        : isLight
                        ? 'text-emerald-600'
                        : 'text-[#EDB9BD]'
                    }`}
                  >
                    {factor.weight > 1 ? `×${factor.weight.toFixed(1)}` : `×${factor.weight.toFixed(2)}`}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    factor.impact.includes('Malicious')
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {factor.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive "What-If" Bayesian Simulator */}
      <div
        className={`border rounded-2xl p-5 transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-sm'
            : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
        }`}
      >
        <div className={`flex items-center justify-between pb-3 border-b mb-4 ${isLight ? 'border-slate-100' : 'border-[#602A77]/50'}`}>
          <div className="flex items-center gap-2">
            <Sliders className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
              Interactive "What-If" Sensitivity Simulator
            </h3>
          </div>
          <span
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
              isLight
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-[#602A77] text-[#F8F4ED] border-[#EDB9BD]/30'
            }`}
          >
            Simulated Risk: {(simRisk * 100).toFixed(1)}%
          </span>
        </div>

        <p className={`text-xs mb-5 leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}`}>
          Test hypothesis variables: Notice how the Bayesian Arbiter automatically prevents false positives if the domain is canonical, even if the page has high visual similarity and sensitive password inputs!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
          {/* Toggle Canonical */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
            }`}
          >
            <div>
              <span className="font-semibold block">Domain Canonical Status</span>
              <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                Matches {claimedBrand.name}'s authorized domain registry
              </span>
            </div>
            <button
              onClick={() => setSimCanonical(!simCanonical)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                simCanonical
                  ? isLight
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[#602A77] text-[#F8F4ED] border border-[#EDB9BD]/40'
                  : isLight
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-[#AA4488] text-[#F8F4ED]'
              }`}
            >
              {simCanonical ? 'CANONICAL' : 'FOREIGN DOMAIN'}
            </button>
          </div>

          {/* Domain Age Slider */}
          <div
            className={`p-3.5 rounded-xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold">Simulated Domain Age</span>
              <span className={`font-bold ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`}>
                {simDomainAgeDays} days
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="3650"
              value={simDomainAgeDays}
              onChange={(e) => setSimDomainAgeDays(Number(e.target.value))}
              className={`w-full cursor-pointer ${isLight ? 'accent-indigo-600' : 'accent-[#AA4488]'}`}
            />
            <div className={`flex justify-between text-[10px] mt-1 ${isLight ? 'text-slate-400' : 'text-[#EDB9BD]/60'}`}>
              <span>1 day (Fresh)</span>
              <span>1 yr</span>
              <span>10 yrs (Established)</span>
            </div>
          </div>

          {/* Free DV TLS Toggle */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
            }`}
          >
            <div>
              <span className="font-semibold block">TLS Certificate Tier</span>
              <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                Let's Encrypt / ZeroSSL DV vs Corporate EV
              </span>
            </div>
            <button
              onClick={() => setSimFreeDV(!simFreeDV)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                simFreeDV
                  ? isLight
                    ? 'bg-rose-600 text-white'
                    : 'bg-[#AA4488] text-[#F8F4ED]'
                  : isLight
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#602A77] text-[#F8F4ED] border border-[#EDB9BD]/40'
              }`}
            >
              {simFreeDV ? 'FREE DV CERT' : 'CORPORATE EV CERT'}
            </button>
          </div>

          {/* External Exfil Action Toggle */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
            }`}
          >
            <div>
              <span className="font-semibold block">Cross-Origin Form Sink</span>
              <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                Form sends creds to foreign endpoint / Telegram API
              </span>
            </div>
            <button
              onClick={() => setSimExfilAction(!simExfilAction)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                simExfilAction
                  ? isLight
                    ? 'bg-rose-600 text-white'
                    : 'bg-[#AA4488] text-[#F8F4ED]'
                  : isLight
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-[#211640] text-[#EDB9BD] border border-[#602A77]'
              }`}
            >
              {simExfilAction ? 'EXFIL SINK ACTIVE' : 'LOCAL SUBMISSION'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
