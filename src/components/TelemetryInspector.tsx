import React from 'react';
import {
  Globe,
  Lock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Network,
  FileText,
} from 'lucide-react';
import { AnalysisResponse } from '../types';

interface TelemetryInspectorProps {
  analysis: AnalysisResponse | null;
  theme?: 'light' | 'dark';
  onExportPdf?: () => void;
}

export function TelemetryInspector({ analysis, theme = 'light', onExportPdf }: TelemetryInspectorProps) {
  if (!analysis) return null;

  const { lexical, telemetry, claimedBrand, isCanonical, host } = analysis;
  const isLight = theme === 'light';

  return (
    <div className={`space-y-6 transition-colors duration-200 ${isLight ? 'text-slate-900' : 'text-[#F8F4ED]'}`}>
      {/* Top Summary Banner */}
      <div
        className={`border rounded-2xl p-5 transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-sm'
            : 'bg-[#211640]/90 border-[#602A77]/70 shadow-2xl backdrop-blur-md'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl border ${
                isCanonical
                  ? isLight
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-[#0C0C1F] border-[#602A77] text-[#EDB9BD]'
                  : isLight
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-[#AA4488]/30 border-[#AA4488] text-[#EDB9BD]'
              }`}
            >
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
                  isLight ? 'text-slate-500' : 'text-[#EDB9BD]/80'
                }`}
              >
                Origin Telemetry Status
              </span>
              <h3 className="text-base font-bold flex items-center gap-2">
                <code>{host}</code>
                {isCanonical ? (
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono font-bold border ${
                      isLight
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-[#602A77] text-[#F8F4ED] border-[#EDB9BD]/40'
                    }`}
                  >
                    CANONICAL AUTHORIZED
                  </span>
                ) : (
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono font-bold border ${
                      isLight
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-[#AA4488] text-[#F8F4ED] border-rose-400'
                    }`}
                  >
                    UNAUTHORIZED FOREIGN ORIGIN
                  </span>
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div
              className={`px-3 py-2 rounded-lg border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/70'
              }`}
            >
              <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                Claimed Brand:
              </span>
              <span className="font-bold">{claimedBrand.name}</span>
            </div>
            <div
              className={`px-3 py-2 rounded-lg border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/70'
              }`}
            >
              <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                Levenshtein Dist:
              </span>
              <span className={`font-bold ${isLight ? 'text-rose-600' : 'text-[#EDB9BD]'}`}>
                {lexical.rawDistance} steps ({lexical.normalizedDistance})
              </span>
            </div>

            {onExportPdf && (
              <button
                onClick={onExportPdf}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border shadow-sm transition-all cursor-pointer ${
                  isLight
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700 shadow-indigo-100'
                    : 'bg-gradient-to-r from-[#AA4488] to-[#602A77] hover:brightness-110 text-[#F8F4ED] border-[#EDB9BD]/30 shadow-[#602A77]/40'
                }`}
                title="Export telemetry and Bayesian analysis as structured PDF"
              >
                <FileText className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Telemetry Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Domain Lexical & Homoglyph Engine */}
        <div
          className={`border rounded-2xl p-5 space-y-4 transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200/90 shadow-sm'
              : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-3 border-b text-xs ${
              isLight ? 'border-slate-100' : 'border-[#602A77]/50'
            }`}
          >
            <h4 className="font-mono font-bold uppercase tracking-wider flex items-center gap-2">
              <FileCode className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
              Domain Lexical &amp; Homoglyph Engine
            </h4>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
              Levenshtein Matrix
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div
              className={`p-3 rounded-xl border font-mono ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
              }`}
            >
              <div
                className={`flex items-center justify-between text-[11px] mb-1 ${
                  isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'
                }`}
              >
                <span>Evaluated Hostname:</span>
                <span className="font-bold">{host}</span>
              </div>
              <div
                className={`flex items-center justify-between text-[11px] mb-1 ${
                  isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'
                }`}
              >
                <span>Closest Canonical:</span>
                <span className={`font-bold ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`}>
                  {lexical.closestCanonical}
                </span>
              </div>
              <div
                className={`flex items-center justify-between text-[11px] ${
                  isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'
                }`}
              >
                <span>Normalized Edit Distance:</span>
                <span className="font-bold">{lexical.normalizedDistance}</span>
              </div>
            </div>

            {/* Homoglyph alert box */}
            {lexical.homoglyphs.hasHomoglyphs ? (
              <div
                className={`border rounded-xl p-3 ${
                  isLight
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-[#AA4488]/25 border-[#AA4488] text-[#F8F4ED]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertTriangle className={`w-4 h-4 ${isLight ? 'text-rose-600' : 'text-[#AA4488]'}`} />
                  Homoglyph / Punycode Attack Detected!
                </div>
                <p className={`text-[11px] leading-relaxed ${isLight ? 'text-rose-700' : 'text-[#EDB9BD]'}`}>
                  Attacker substituted Latin letters with visually identical Cyrillic / Unicode characters to bypass lexical filters.
                </p>
                <div
                  className={`mt-2 text-[10px] font-mono p-2 rounded border ${
                    isLight ? 'bg-white border-rose-200' : 'bg-[#0C0C1F] border-[#602A77]'
                  }`}
                >
                  {lexical.homoglyphs.details.map((d, i) => (
                    <div key={i}>• {d}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2 text-[11px] ${
                  isLight
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
                    : 'bg-[#0C0C1F] border-[#602A77]/60 text-[#EDB9BD]'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-[#EDB9BD]'}`} />
                <span>No Cyrillic/Unicode confusable homoglyphs detected in string.</span>
              </div>
            )}
          </div>
        </div>

        {/* Module 2: WHOIS & Domain Age Telemetry */}
        <div
          className={`border rounded-2xl p-5 space-y-4 transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200/90 shadow-sm'
              : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-3 border-b text-xs ${
              isLight ? 'border-slate-100' : 'border-[#602A77]/50'
            }`}
          >
            <h4 className="font-mono font-bold uppercase tracking-wider flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
              WHOIS Origin &amp; Age Telemetry
            </h4>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
              RDAP Lookup
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div
              className={`p-3 rounded-xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}>Domain Age:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    telemetry.domainAgeDays < 14
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {telemetry.domainAgeDays} Days Old
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}>Authorized Minimum Age:</span>
                <span className="font-bold">&gt; {claimedBrand.minAgeYears} Years</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}>Registrar:</span>
                <span>{telemetry.registrar}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}>Country of Record:</span>
                <span>{telemetry.country}</span>
              </div>
            </div>

            <p
              className={`text-[11px] leading-relaxed font-sans ${
                isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'
              }`}
            >
              {telemetry.domainAgeDays < 14
                ? 'High-risk disposable infrastructure: 92% of targeted phishing campaigns operate on domains registered less than 14 days prior.'
                : 'Established registration history consistent with long-term legitimate infrastructure.'}
            </p>
          </div>
        </div>

        {/* Module 3: TLS Certificate & Trust Chain */}
        <div
          className={`border rounded-2xl p-5 space-y-4 transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200/90 shadow-sm'
              : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-3 border-b text-xs ${
              isLight ? 'border-slate-100' : 'border-[#602A77]/50'
            }`}
          >
            <h4 className="font-mono font-bold uppercase tracking-wider flex items-center gap-2">
              <Lock className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
              TLS Certificate &amp; Trust Hierarchy
            </h4>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
              X.509 Chain
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div
              className={`p-3 rounded-xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
              }`}
            >
              <div>
                <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                  Certificate Authority (Issuer):
                </span>
                <span className="font-bold">{telemetry.tlsIssuer}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className={isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}>Validation Tier:</span>
                <span
                  className={
                    telemetry.isFreeDV
                      ? 'text-rose-600 font-bold'
                      : 'text-emerald-600 font-bold'
                  }
                >
                  {telemetry.isFreeDV ? 'Free Automated DV (Let\'s Encrypt / ZeroSSL)' : 'Corporate EV / OV'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}>Certificate Validity:</span>
                <span>{telemetry.tlsCertValidDays} Days Remaining</span>
              </div>
            </div>

            <div
              className={`text-[11px] leading-relaxed font-sans ${
                isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'
              }`}
            >
              {telemetry.isFreeDV ? (
                <span className={isLight ? 'text-amber-800' : 'text-[#EDB9BD]'}>
                  Note: Enterprise banking and SSO identity providers ({claimedBrand.name}) never utilize free Automated DV certificates for their canonical login portals.
                </span>
              ) : (
                <span className={isLight ? 'text-emerald-800' : 'text-[#EDB9BD]'}>
                  Valid corporate enterprise certificate matches registered organization.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Module 4: ASN & Autonomous System Routing */}
        <div
          className={`border rounded-2xl p-5 space-y-4 transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200/90 shadow-sm'
              : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-3 border-b text-xs ${
              isLight ? 'border-slate-100' : 'border-[#602A77]/50'
            }`}
          >
            <h4 className="font-mono font-bold uppercase tracking-wider flex items-center gap-2">
              <Network className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
              BGP Routing &amp; Hosting ASN
            </h4>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
              BGP Origin
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div
              className={`p-3 rounded-xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
              }`}
            >
              <div>
                <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                  Active Hosting ASN:
                </span>
                <span className="font-bold">{telemetry.asn}</span>
              </div>
              <div>
                <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                  Expected Brand ASN:
                </span>
                <span className={`font-bold ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`}>
                  {claimedBrand.primaryAsn}
                </span>
              </div>
            </div>

            <div
              className={`text-[11px] font-sans ${isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}`}
            >
              Routing topology analysis confirms whether BGP prefixes originate from authorized corporate datacenters or bulletproof hosting providers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
