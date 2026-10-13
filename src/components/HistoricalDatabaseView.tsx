import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Plus,
  Trash2,
  ShieldAlert,
  Calendar,
  Layers,
  Fingerprint,
  FileCode,
  Tag,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Sliders,
  Copy,
  Check,
  Zap,
  Globe,
  Radio,
  Server,
  ArrowRight,
} from 'lucide-react';
import { HistoricalThreatEntry, HistoricalMatchResult } from '../types';
import { BrandLogo } from './BrandLogos';

interface HistoricalDatabaseViewProps {
  onSelectThreatToInspect?: (domain: string) => void;
  currentMatch: HistoricalMatchResult | null;
  theme?: 'light' | 'dark';
}

export function HistoricalDatabaseView({
  onSelectThreatToInspect,
  currentMatch,
  theme = 'light',
}: HistoricalDatabaseViewProps) {
  const [threats, setThreats] = useState<HistoricalThreatEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedPhash, setCopiedPhash] = useState<string | null>(null);

  // New Threat Form State
  const [newDomain, setNewDomain] = useState('');
  const [newBrand, setNewBrand] = useState('PayPal');
  const [newCampaign, setNewCampaign] = useState('');
  const [newSeverity, setNewSeverity] = useState<'CRITICAL' | 'HIGH' | 'ELEVATED'>('CRITICAL');
  const [newNotes, setNewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLight = theme === 'light';

  // Fetch threats from server
  const fetchThreats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/threats/history');
      if (res.ok) {
        const data = await res.json();
        setThreats(data.threats || []);
      }
    } catch (err) {
      console.error('Failed to fetch historical threats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, []);

  const handleCopyPhash = (phash: string) => {
    navigator.clipboard.writeText(phash);
    setCopiedPhash(phash);
    setTimeout(() => setCopiedPhash(null), 2000);
  };

  // Filtered threats
  const filteredThreats = threats.filter((threat) => {
    const matchesSearch =
      threat.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.claimedBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.attackCampaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.visualFingerprint.phash.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand =
      selectedBrand === 'ALL' ||
      threat.targetBrandId.toLowerCase() === selectedBrand.toLowerCase();

    const matchesSeverity =
      selectedSeverity === 'ALL' || threat.threatSeverity === selectedSeverity;

    return matchesSearch && matchesBrand && matchesSeverity;
  });

  const handleAddThreat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/threats/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: newDomain,
          claimedBrand: newBrand,
          targetBrandId: newBrand.toLowerCase().replace(/\s+/g, '-'),
          attackCampaign: newCampaign || `${newBrand.toUpperCase()}-TARGETED-KIT-2026`,
          threatSeverity: newSeverity,
          notes: newNotes || 'Security analyst added confirmed phishing signature.',
        }),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setNewDomain('');
        setNewCampaign('');
        setNewNotes('');
        await fetchThreats();
      }
    } catch (err) {
      console.error('Failed to create threat record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteThreat = async (id: string) => {
    if (!confirm(`Remove threat record ${id} from historical database?`)) return;
    try {
      const res = await fetch(`/api/threats/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setThreats((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete threat:', err);
    }
  };

  return (
    <div className={`space-y-6 transition-colors duration-200 ${isLight ? 'text-slate-900' : 'text-[#F8F4ED]'}`}>
      {/* Hero Header */}
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
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-[#0C0C1F] text-[#EDB9BD] border-[#602A77]'
                }`}
              >
                <Database className={`w-3 h-3 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
                HISTORICAL THREAT INTELLIGENCE REPOSITORY
              </span>
              <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                Visual &amp; Semantic Precedent Engine
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Confirmed Phishing &amp; Brand-Impersonation Database
            </h2>
            <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}`}>
              Maintains persistent records of previously analyzed and confirmed phishing attacks with 64-bit perceptual visual fingerprints (pHash), layout signatures, semantic lexical features, ASN provenance, and detection timestamps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`p-3.5 rounded-xl text-center font-mono border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]'
              }`}
            >
              <span className={`text-[10px] uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                Total Confirmed Threats
              </span>
              <span className="text-2xl font-extrabold">
                {threats.length}
              </span>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Confirmed Threat
            </button>
          </div>
        </div>
      </div>

      {/* Active Candidate Match Correlation Banner */}
      {currentMatch && currentMatch.hasMatch && currentMatch.matchedEntry && (
        <div
          className={`border-2 rounded-2xl p-5 shadow-sm animate-in fade-in duration-300 ${
            isLight
              ? 'bg-rose-50/80 border-rose-300 text-rose-950'
              : 'bg-[#211640] border-[#AA4488] text-[#F8F4ED]'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl border shrink-0 ${
                  isLight
                    ? 'bg-white text-rose-600 border-rose-300'
                    : 'bg-[#0C0C1F] text-[#AA4488] border-[#AA4488]'
                }`}
              >
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-600 text-white uppercase tracking-wider">
                  ACTIVE PRECEDENT MATCH DETECTED IN HISTORICAL DB
                </span>
                <h3 className="text-base font-bold mt-1">
                  Correlates with {currentMatch.matchedEntry.id} ({currentMatch.matchedEntry.attackCampaign})
                </h3>
                <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isLight ? 'text-rose-900' : 'text-[#EDB9BD]'}`}>
                  {currentMatch.correlationBasis}
                </p>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl text-xs font-mono border ${
                isLight ? 'bg-white border-rose-200 text-rose-900' : 'bg-[#0C0C1F] border-[#602A77]'
              }`}
            >
              <span className="block text-[10px] text-slate-500">Bayesian Risk Impact:</span>
              <span className="font-bold text-sm text-rose-700">
                Prior Boost: +{(currentMatch.impactOnBayesianRisk.priorBoost * 100).toFixed(0)}% · LR: ×{currentMatch.impactOnBayesianRisk.likelihoodRatioMultiplier}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div
        className={`border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-sm'
            : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
        }`}
      >
        <div className="relative flex-1 min-w-[260px]">
          <Search className={`w-4 h-4 absolute left-3 top-3 ${isLight ? 'text-slate-400' : 'text-[#EDB9BD]/60'}`} />
          <input
            type="text"
            placeholder="Search by domain, brand, campaign, pHash, or record ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs font-mono focus:outline-none transition-colors ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white'
                : 'bg-[#0C0C1F] border-[#602A77] text-[#F8F4ED] placeholder:text-[#EDB9BD]/40 focus:border-[#EDB9BD]'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className={`border rounded-xl px-3 py-2 text-xs font-mono cursor-pointer focus:outline-none ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500'
                : 'bg-[#0C0C1F] border-[#602A77] text-[#EDB9BD] focus:border-[#EDB9BD]'
            }`}
          >
            <option value="ALL">All Claimed Brands</option>
            <option value="paypal">PayPal</option>
            <option value="okta">Okta SSO</option>
            <option value="microsoft">Microsoft 365</option>
            <option value="chase">Chase Bank</option>
            <option value="coinbase">Coinbase</option>
            <option value="apple">Apple</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className={`border rounded-xl px-3 py-2 text-xs font-mono cursor-pointer focus:outline-none ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500'
                : 'bg-[#0C0C1F] border-[#602A77] text-[#EDB9BD] focus:border-[#EDB9BD]'
            }`}
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="ELEVATED">Elevated</option>
          </select>

          <button
            onClick={fetchThreats}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                : 'bg-[#0C0C1F] hover:bg-[#602A77]/40 text-[#EDB9BD] border-[#602A77]'
            }`}
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Threats List */}
      <div className="space-y-4">
        {loading ? (
          <div
            className={`p-12 text-center border rounded-2xl ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#211640]/50 border-[#602A77]/50'
            }`}
          >
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-600" />
            <p className="text-xs font-mono text-slate-500">Querying historical threat intelligence database...</p>
          </div>
        ) : filteredThreats.length === 0 ? (
          <div
            className={`p-12 text-center border rounded-2xl ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#211640]/50 border-[#602A77]/50'
            }`}
          >
            <Database className="w-10 h-10 mx-auto mb-3 text-slate-400" />
            <p className="text-sm font-semibold">No historical threat signatures matched your query.</p>
            <p className="text-xs text-slate-500 mt-1 font-mono">Try adjusting filters or add a new threat record.</p>
          </div>
        ) : (
          filteredThreats.map((threat) => {
            const isCritical = threat.threatSeverity === 'CRITICAL';
            const isHigh = threat.threatSeverity === 'HIGH';

            return (
              <div
                key={threat.id}
                className={`border rounded-2xl p-5 transition-all duration-200 ${
                  isLight
                    ? 'bg-white border-slate-200/90 shadow-sm hover:border-slate-300'
                    : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl hover:border-[#EDB9BD]/50'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#602A77]/50">
                  <div className="flex items-center gap-3">
                    <BrandLogo icon={threat.claimedBrand} className="w-5 h-5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-sm tracking-tight">
                          {threat.domain}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                            isCritical
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : isHigh
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-purple-100 text-purple-800 border-purple-200'
                          }`}
                        >
                          {threat.threatSeverity}
                        </span>
                      </div>
                      <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/70'}`}>
                        Impersonating: <strong className={isLight ? 'text-slate-900' : 'text-[#F8F4ED]'}>{threat.claimedBrand}</strong> · Campaign: {threat.attackCampaign}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {onSelectThreatToInspect && (
                      <button
                        onClick={() => onSelectThreatToInspect(threat.domain)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                          isLight
                            ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200'
                            : 'bg-[#0C0C1F] hover:bg-[#602A77] text-[#EDB9BD] border-[#602A77]'
                        }`}
                        title="Simulate analysis of this target in Viewport"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Inspect in Viewport
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteThreat(threat.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isLight
                          ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-slate-200'
                          : 'text-[#EDB9BD]/60 hover:text-rose-400 hover:bg-[#0C0C1F] border-[#602A77]/60'
                      }`}
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Technical telemetry breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs font-mono">
                  {/* Visual Fingerprint */}
                  <div
                    className={`p-3 rounded-xl border space-y-2 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-[#EDB9BD]'}`}>
                        <Fingerprint className="w-3.5 h-3.5 text-indigo-600" /> Visual pHash
                      </span>
                      <button
                        onClick={() => handleCopyPhash(threat.visualFingerprint.phash)}
                        className={`text-[10px] flex items-center gap-1 cursor-pointer ${
                          isLight ? 'text-slate-500 hover:text-slate-900' : 'text-[#EDB9BD]/70 hover:text-[#F8F4ED]'
                        }`}
                      >
                        {copiedPhash === threat.visualFingerprint.phash ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <code className="block text-[11px] font-bold text-indigo-600 break-all">
                      0x{threat.visualFingerprint.phash}
                    </code>
                    <div className="text-[10px] text-slate-500">
                      Layout: {threat.visualFingerprint.layoutSignature}
                    </div>
                  </div>

                  {/* Semantic & Origin */}
                  <div
                    className={`p-3 rounded-xl border space-y-1.5 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Levenshtein Edit Dist:</span>
                      <span className="font-bold text-rose-600">{threat.semanticFeatures.lexicalLevenshtein} chars</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Origin Hosting ASN:</span>
                      <span className="font-semibold truncate max-w-[140px]" title={threat.semanticFeatures.asn}>
                        {threat.semanticFeatures.asn}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">TLS Issuer:</span>
                      <span className="truncate max-w-[140px]" title={threat.semanticFeatures.tlsIssuer}>
                        {threat.semanticFeatures.tlsIssuer}
                      </span>
                    </div>
                  </div>

                  {/* Detection Date & Evasion */}
                  <div
                    className={`p-3 rounded-xl border space-y-1.5 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Detection Date:</span>
                      <span className="font-semibold">{threat.dateOfDetectionFormatted}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Harvested Fields:</span>
                      <span className="text-amber-700 font-bold">{threat.semanticFeatures.harvestedFields.join(', ')}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">C2 Exfil Sink Route:</span>
                      <code className="text-rose-600 font-bold">{threat.semanticFeatures.c2ExfilRoute}</code>
                    </div>
                  </div>
                </div>

                {/* Notes and frequency footer */}
                <div
                  className={`mt-3 pt-3 border-t flex flex-wrap items-center justify-between text-[11px] ${
                    isLight ? 'border-slate-100 text-slate-600' : 'border-[#602A77]/40 text-[#EDB9BD]/80'
                  }`}
                >
                  <p className="font-sans leading-relaxed">
                    <strong className={`font-mono ${isLight ? 'text-slate-900' : 'text-[#F8F4ED]'}`}>Forensic Notes:</strong> {threat.notes}
                  </p>
                  <span className="font-mono font-semibold shrink-0">
                    Times Correlated: {threat.timesSeen}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add Confirmed Threat */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`border rounded-2xl max-w-lg w-full p-6 shadow-2xl transition-colors ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#211640] border-[#602A77] text-[#F8F4ED]'
            }`}
          >
            <h3 className="text-base font-bold mb-1 flex items-center gap-2">
              <Plus className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
              Register Confirmed Phishing Site to Database
            </h3>
            <p className={`text-xs mb-4 leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}`}>
              Add a verified phishing domain, claimed brand, and campaign telemetry into the historical database. New web scans will immediately correlate against this record.
            </p>

            <form onSubmit={handleAddThreat} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-[#EDB9BD]'}`}>
                  Malicious Domain / Hostname:
                </label>
                <input
                  type="text"
                  placeholder="e.g. wellsfargo-online-alert.cc"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                      : 'bg-[#0C0C1F] border-[#602A77] text-[#F8F4ED] focus:border-[#EDB9BD]'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-[#EDB9BD]'}`}>
                    Claimed Impersonated Brand:
                  </label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                        : 'bg-[#0C0C1F] border-[#602A77] text-[#F8F4ED] focus:border-[#EDB9BD]'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-[#EDB9BD]'}`}>
                    Severity Rating:
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none cursor-pointer ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                        : 'bg-[#0C0C1F] border-[#602A77] text-[#F8F4ED] focus:border-[#EDB9BD]'
                    }`}
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="ELEVATED">ELEVATED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-[#EDB9BD]'}`}>
                  Attack Campaign Identifier:
                </label>
                <input
                  type="text"
                  placeholder="e.g. UNC-CLUSTER-WELLS-2026"
                  value={newCampaign}
                  onChange={(e) => setNewCampaign(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                      : 'bg-[#0C0C1F] border-[#602A77] text-[#F8F4ED] focus:border-[#EDB9BD]'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-[#EDB9BD]'}`}>
                  Forensic Analysis Notes:
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe harvested fields, evasion methods, or reverse proxy behaviors..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                      : 'bg-[#0C0C1F] border-[#602A77] text-[#F8F4ED] focus:border-[#EDB9BD]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-[#602A77]/60">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2 rounded-lg cursor-pointer ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-[#0C0C1F] hover:bg-[#602A77]/40 text-[#EDB9BD]'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-md"
                >
                  {isSubmitting ? 'Registering...' : 'Save to Historical Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
