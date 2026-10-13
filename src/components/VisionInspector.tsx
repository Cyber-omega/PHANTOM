import React from 'react';
import {
  Cpu,
  Crosshair,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize2,
  Scan,
} from 'lucide-react';
import { AnalysisResponse } from '../types';
import { BrandLogo } from './BrandLogos';

interface VisionInspectorProps {
  analysis: AnalysisResponse | null;
  theme?: 'light' | 'dark';
}

export function VisionInspector({ analysis, theme = 'light' }: VisionInspectorProps) {
  if (!analysis) return null;

  const { vision, claimedBrand } = analysis;
  const isLight = theme === 'light';

  return (
    <div className={`space-y-6 transition-colors duration-200 ${isLight ? 'text-slate-900' : 'text-[#F8F4ED]'}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`border rounded-xl p-4 transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200/90 shadow-sm'
              : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span
              className={`font-mono uppercase tracking-wider text-[10px] ${
                isLight ? 'text-slate-500 font-semibold' : 'text-[#EDB9BD]/80'
              }`}
            >
              Model Pipeline
            </span>
            <Cpu className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
          </div>
          <p className="text-sm font-bold">YOLOv8-Nano + CLIP</p>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}`}>
            Optimized lightweight computer vision detector running at edge (3.2ms)
          </p>
          <div
            className={`mt-3 flex items-center gap-2 text-[11px] font-mono ${
              isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full animate-pulse ${isLight ? 'bg-indigo-600' : 'bg-[#EDB9BD]'}`} />
            Inference: 640x640 Input Tensor
          </div>
        </div>

        <div
          className={`border rounded-xl p-4 transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200/90 shadow-sm'
              : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span
              className={`font-mono uppercase tracking-wider text-[10px] ${
                isLight ? 'text-slate-500 font-semibold' : 'text-[#EDB9BD]/80'
              }`}
            >
              Claimed Brand Identity
            </span>
            <div className="w-5 h-5">
              <BrandLogo icon={claimedBrand.name} className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-bold">{claimedBrand.name}</p>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}`}>
            Visual vector similarity match: <span className="font-bold">{vision.visualSimilarityMatch}</span>
          </p>
          <div
            className={`mt-3 text-[11px] font-mono ${
              isLight ? 'text-slate-500' : 'text-[#EDB9BD]/80'
            }`}
          >
            Perceptual Hash Distance: <span className="font-semibold">{vision.perceptualHashDistance}</span> (Hamming metric)
          </div>
        </div>

        <div
          className={`border rounded-xl p-4 transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200/90 shadow-sm'
              : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span
              className={`font-mono uppercase tracking-wider text-[10px] ${
                isLight ? 'text-slate-500 font-semibold' : 'text-[#EDB9BD]/80'
              }`}
            >
              Detected Objects
            </span>
            <Crosshair className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
          </div>
          <p className="text-sm font-bold">
            {vision.detectedObjects.length} Interactive Elements
          </p>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-[#EDB9BD]/80'}`}>
            High-risk credential fields localized in DOM viewport
          </p>
          <div
            className={`mt-3 text-[11px] font-mono font-semibold ${
              isLight ? 'text-emerald-600' : 'text-[#EDB9BD]'
            }`}
          >
            Confidence Mean: 95.5%
          </div>
        </div>
      </div>

      {/* Visual Comparison Grid */}
      <div
        className={`border rounded-2xl p-5 transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-sm'
            : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
        }`}
      >
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 mb-4">
          <Scan className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
          Perceptual Vector Matching: Viewport vs Known Brand Signature
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Viewport Captured Elements */}
          <div
            className={`rounded-xl p-4 border transition-colors ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
            }`}
          >
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold">Captured Viewport Element</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                  isLight
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-[#211640] text-[#EDB9BD] border-[#602A77]'
                }`}
              >
                LIVE CAPTURE
              </span>
            </div>
            <div
              className={`h-44 rounded-lg flex flex-col items-center justify-center p-4 border border-dashed relative overflow-hidden ${
                isLight ? 'bg-white border-slate-300' : 'bg-[#211640] border-[#602A77]'
              }`}
            >
              <BrandLogo icon={claimedBrand.name} className="w-16 h-16 drop-shadow-md mb-2" />
              <span className="text-xs font-bold">{claimedBrand.name} Vector Logo</span>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/80'}`}>
                Found in Viewport at [X: 42%, Y: 22%]
              </span>

              <div
                className={`absolute inset-4 border rounded pointer-events-none flex items-start justify-between p-1 ${
                  isLight ? 'border-rose-400' : 'border-[#AA4488]/80'
                }`}
              >
                <span className="text-[9px] font-mono bg-rose-600 text-white px-1 rounded font-bold">
                  badge_detect: 0.95
                </span>
              </div>
            </div>
          </div>

          {/* Right: Golden Ground Truth Benchmark */}
          <div
            className={`rounded-xl p-4 border transition-colors ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C0C1F] border-[#602A77]/60'
            }`}
          >
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold">Registered Brand Knowledge Base</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                  isLight
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-[#602A77] text-[#F8F4ED] border-[#EDB9BD]/40'
                }`}
              >
                GOLDEN SIGNATURE
              </span>
            </div>
            <div
              className={`h-44 rounded-lg flex flex-col items-center justify-center p-4 border border-dashed relative overflow-hidden ${
                isLight ? 'bg-white border-slate-300' : 'bg-[#211640] border-[#602A77]'
              }`}
            >
              <BrandLogo icon={claimedBrand.name} className="w-16 h-16 drop-shadow-md mb-2 opacity-90" />
              <span className="text-xs font-bold">{claimedBrand.name} Official Asset</span>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/80'}`}>
                Canonical Domains: {claimedBrand.canonicalDomains.join(', ')}
              </span>

              <div
                className={`absolute inset-4 border rounded pointer-events-none flex items-start justify-between p-1 ${
                  isLight ? 'border-emerald-400' : 'border-[#EDB9BD]/60'
                }`}
              >
                <span className="text-[9px] font-mono bg-emerald-600 text-white px-1 rounded font-bold">
                  cosine_sim: 0.984
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Localized Object Bounding Box Table */}
      <div
        className={`border rounded-2xl p-5 transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-sm'
            : 'bg-[#211640]/90 border-[#602A77]/70 shadow-xl'
        }`}
      >
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 mb-4">
          <Layers className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`} />
          YOLOv8-Nano Localized Objects &amp; Risk Classification
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr
                className={`border-b ${
                  isLight ? 'border-slate-200 text-slate-500' : 'border-[#602A77]/60 text-[#EDB9BD]/80'
                }`}
              >
                <th className="pb-2.5">Object Class</th>
                <th className="pb-2.5">Label</th>
                <th className="pb-2.5">Confidence</th>
                <th className="pb-2.5">Bounding Box (X, Y, W, H)</th>
                <th className="pb-2.5">Security Classification</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-[#602A77]/40'}`}>
              {vision.detectedObjects.map((obj) => (
                <tr
                  key={obj.id}
                  className={`transition-colors ${
                    isLight ? 'hover:bg-slate-50' : 'hover:bg-[#0C0C1F]/40'
                  }`}
                >
                  <td className={`py-2.5 font-bold ${isLight ? 'text-indigo-600' : 'text-[#EDB9BD]'}`}>
                    {obj.class}
                  </td>
                  <td className="py-2.5 font-medium">{obj.label}</td>
                  <td className="py-2.5">
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold border ${
                        isLight
                          ? 'bg-slate-100 text-slate-800 border-slate-200'
                          : 'bg-[#0C0C1F] text-[#EDB9BD] border-[#602A77]'
                      }`}
                    >
                      {(obj.confidence * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className={`py-2.5 ${isLight ? 'text-slate-500' : 'text-[#EDB9BD]/80'}`}>
                    [{obj.bbox.x}%, {obj.bbox.y}%, {obj.bbox.width}%, {obj.bbox.height}%]
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        obj.risk === 'critical_target'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : obj.risk === 'high_target'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : obj.risk === 'impersonated_badge'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {obj.risk.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
