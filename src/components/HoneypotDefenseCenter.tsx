import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  Radio,
  Fingerprint,
  Terminal,
  Activity,
  Globe,
  Clock,
  Key,
  Copy,
  Check,
  Send,
  AlertOctagon,
  RefreshCw,
} from 'lucide-react';
import { AnalysisResponse, InterceptEvent } from '../types';

interface HoneypotDefenseCenterProps {
  analysis: AnalysisResponse | null;
  interceptFeed: InterceptEvent[];
  onFireTrap: (payload: Record<string, string>, canaryToken: string) => void;
  onRefreshFeed: () => void;
  theme?: 'light' | 'dark';
}

export function HoneypotDefenseCenter({
  analysis,
  interceptFeed,
  onFireTrap,
  onRefreshFeed,
  theme = 'light',
}: HoneypotDefenseCenterProps) {
  const [copiedToken, setCopiedToken] = useState(false);
  const [customUsername, setCustomUsername] = useState('canary.corp.infiltrator99@outlook.com');
  const [customPassword, setCustomPassword] = useState('Canary#P0ison!2026_Tr4p');

  const honey = analysis?.honeypot;
  const canaryToken = honey?.canaryTrackingToken || 'CANARY-PHANTOM-ACTIVE';
  const isLight = theme === 'light';

  const copyToken = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleManualDispatch = () => {
    onFireTrap(
      {
        email: customUsername,
        password: customPassword,
        token: canaryToken,
      },
      canaryToken
    );
  };

  return (
    <div className={`space-y-6 transition-colors duration-200 ${isLight ? 'text-slate-900' : 'text-[#F8F4ED]'}`}>
      {/* Honeypot Status Banner */}
      <div
        className={`border rounded-2xl p-6 relative overflow-hidden transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-sm'
            : 'bg-[#211640]/90 border-[#602A77]/70 shadow-2xl backdrop-blur-md'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-[#0C0C1F] text-[#EDB9BD] border-[#602A77]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                ACTIVE CYBER DECEPTION ENGINE
              </span>
              <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                Poison-and-Trace Protocol
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              PHANTOM Honeypot Decoy UI &amp; Canary Defense Center
            </h2>
            <p className={`text-xs mt-1 max-w-xl leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}`}>
              When phishing risk exceeds 0.80, PHANTOM automatically neutralizes the attack vector by substituting genuine user inputs with seeded canary credentials, tracking the threat actor's exfiltration infrastructure.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`p-4 rounded-xl text-center font-mono border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]'
              }`}
            >
              <span className={`text-[10px] uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                Active Traps Deployed
              </span>
              <span className="text-3xl font-extrabold">
                {interceptFeed.length}
              </span>
            </div>
            <div
              className={`p-4 rounded-xl text-center font-mono border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]'
              }`}
            >
              <span className={`text-[10px] uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                Threat Actor Diversion
              </span>
              <span className="text-3xl font-extrabold text-emerald-600">
                100%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Decoy Canary Generator & Manual Dispatch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Canary Token Parameters */}
        <div
          className={`border rounded-2xl p-5 space-y-4 transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200/90 shadow-sm'
              : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
          }`}
        >
          <div className={`flex items-center justify-between pb-3 border-b text-xs ${isLight ? 'border-slate-100' : 'border-[#602A77]/50'}`}>
            <h4 className="font-mono font-bold uppercase tracking-wider flex items-center gap-2">
              <Key className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
              Synthetic Poison Credentials &amp; Tracking Beacon
            </h4>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
              High-Entropy Trap
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div
              className={`p-3.5 rounded-xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}>Canary Tracking Beacon:</span>
                <button
                  onClick={() => copyToken(canaryToken)}
                  className={`text-[10px] flex items-center gap-1 cursor-pointer font-bold ${
                    isLight ? 'text-indigo-600 hover:text-indigo-800' : 'text-[#EDB9BD] hover:text-[#F8F4ED]'
                  }`}
                >
                  {copiedToken ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy Beacon ID
                    </>
                  )}
                </button>
              </div>
              <code className="block p-2 rounded bg-indigo-50/70 border border-indigo-200 text-indigo-700 font-bold break-all">
                {canaryToken}
              </code>
            </div>

            <div
              className={`p-3.5 rounded-xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}>Honeypot Decoy Strategy:</span>
                <span className="font-bold text-purple-700">Canary-Seeded Form Injection</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}>C2 Attacker Trap Response:</span>
                <span className="font-bold text-rose-600">Delayed Decoy MFA Tarpit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}>Targeted Threat Actor:</span>
                <span>{analysis?.host || 'External C2 Infrastructure'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Manual Canary Dispatch Simulator */}
        <div
          className={`border rounded-2xl p-5 space-y-4 transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200/90 shadow-sm'
              : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
          }`}
        >
          <div className={`flex items-center justify-between pb-3 border-b text-xs ${isLight ? 'border-slate-100' : 'border-[#602A77]/50'}`}>
            <h4 className="font-mono font-bold uppercase tracking-wider flex items-center gap-2">
              <Send className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
              Simulate Active Canary Trap Dispatch
            </h4>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
              C2 Poisoning Trigger
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-[#EDB9BD]'}`}>
                Synthetic Decoy Identity:
              </label>
              <input
                type="text"
                value={customUsername}
                onChange={(e) => setCustomUsername(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                    : 'bg-[#0C0C1F] border-[#602A77] text-[#F8F4ED] focus:border-[#EDB9BD]'
                }`}
              />
            </div>

            <div>
              <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-[#EDB9BD]'}`}>
                Poisoned Password:
              </label>
              <input
                type="text"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                    : 'bg-[#0C0C1F] border-[#602A77] text-[#F8F4ED] focus:border-[#EDB9BD]'
                }`}
              />
            </div>

            <button
              onClick={handleManualDispatch}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
              Transmit Poisoned Canary to Attacker C2
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Intercept Feed */}
      <div
        className={`border rounded-2xl p-5 space-y-4 transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-sm'
            : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
        }`}
      >
        <div className={`flex items-center justify-between pb-3 border-b text-xs ${isLight ? 'border-slate-100' : 'border-[#602A77]/50'}`}>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-600 animate-pulse" />
            <h3 className="font-mono font-bold uppercase tracking-wider">
              Live SOC Intercept Feed: Exfiltration Tarpit Log
            </h3>
          </div>
          <button
            onClick={onRefreshFeed}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                : 'bg-[#0C0C1F] hover:bg-[#602A77] text-[#EDB9BD] border-[#602A77]'
            }`}
            title="Refresh Intercept Feed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {interceptFeed.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500">
            No live intercept events recorded yet. Click "Transmit Poisoned Canary" or trigger a trap in the Viewport to observe telemetry!
          </div>
        ) : (
          <div className="space-y-2.5">
            {interceptFeed.map((event) => (
              <div
                key={event.id}
                className={`p-3.5 rounded-xl border text-xs font-mono transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-[#0C0C1F] border-[#602A77]/60'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-[#602A77]/40 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold">{event.targetDomain}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold border border-purple-200">
                      {event.claimedBrand}
                    </span>
                  </div>
                  <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Attacker Method:</span>
                    <code className="text-rose-600 font-bold">{event.attackerMethod}</code>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Canary Token:</span>
                    <code className="text-indigo-600 font-bold">{event.canaryToken}</code>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Attacker Node IP:</span>
                    <span className="font-bold">{event.attackerIp}</span>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                  {event.responseInjected}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
