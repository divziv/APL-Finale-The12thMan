/**
 * @file StadiumCCTV.tsx
 * @description Renders visual representations of live Stadium security cameras with AI bounding boxes, scanning filters, and state alerts.
 */

import React, { useState, useEffect } from 'react';
import { SecurityCamera } from '../types';
import { Video, VideoOff, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface StadiumCCTVProps {
  cameras: SecurityCamera[];
  onToggleHighlight: (camId: string) => void;
  activeThreatId: string | null;
}

export default function StadiumCCTV({ cameras, onToggleHighlight, activeThreatId }: StadiumCCTVProps) {
  const [selectedCamId, setSelectedCamId] = useState<string>('cam1');
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [noiseSeed, setNoiseSeed] = useState<number>(0);

  // Periodic visual fuzz generation to mimic radio transmission
  useEffect(() => {
    const timer = setInterval(() => {
      setNoiseSeed(prev => (prev + 1) % 100);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const selectedCam = cameras.find(c => c.id === selectedCamId) || cameras[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col h-full" id="stadium-cctv-container">
      {/* Container Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">AI-Analytics Camera Feed</h2>
          <p className="text-xs text-slate-500 font-mono">MODEL_CORE: YOLO-v11_CROWD_EVAC</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScanning(!isScanning)}
            className={`px-2.5 py-1 text-[10px] font-mono rounded border flex items-center gap-1.5 transition-all duration-300 ${
              isScanning
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800/80'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
            AI_VISION: {isScanning ? 'SCANNING' : 'PAUSED'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-[300px]">
        {/* Main CCTV Feed (Large View) */}
        <div className="lg:col-span-2 relative aspect-video bg-black rounded-lg border border-slate-950 overflow-hidden flex flex-col group shadow-lg">
          {/* Scanning Scanline filter */}
          {isScanning && (
            <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-30 select-none z-10"></div>
          )}

          {/* Dynamic Laser Scanning Line */}
          {isScanning && (
            <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] top-0 animate-scanning z-10 pointer-events-none"></div>
          )}

          {/* Glitch interference bar */}
          {isScanning && noiseSeed % 12 === 0 && (
            <div className="absolute inset-x-0 h-4 bg-emerald-500/20 top-1/3 blur-xs z-10 pointer-events-none"></div>
          )}

          {/* Live CCTV Rendering Simulation inside SVG/Canvas bounds */}
          <div className="relative flex-1 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
            
            {/* Draw a grid-layout resembling stadium structure with camera indicators */}
            <svg viewBox="0 0 400 225" className="w-full h-full text-slate-800 opacity-60">
              <line x1="0" y1="112" x2="400" y2="112" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="200" y1="0" x2="200" y2="225" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
              <circle cx="200" cy="112" r="80" fill="none" stroke="#334155" strokeWidth="1" />
              <circle cx="200" cy="112" r="30" fill="none" stroke="#1e293b" strokeWidth="1" />

              {/* Dynamic Crowd Points (simulate head tracking dots) */}
              {Array.from({ length: Math.min(selectedCam.peopleCount / 2, 45) }).map((_, i) => {
                const angle = (i * 137.5) * (Math.PI / 180);
                const r = 10 + Math.sqrt(i) * 11;
                const x = 200 + r * Math.cos(angle);
                const y = 112 + r * Math.sin(angle);
                
                // If threat active, highlight central dots
                const isPartiallyCongested = selectedCam.status === 'alert' || selectedCam.id === activeThreatId;
                const color = isPartiallyCongested && r > 25 && r < 75 ? '#ef4444' : '#10b981';

                return (
                  <g key={i}>
                    {/* Glowing coordinate point */}
                    <circle cx={x} cy={y} r="2.5" fill={color} fillOpacity="0.8" />
                    {/* Bounding boxes around localized sub-surges */}
                    {isPartiallyCongested && i % 6 === 0 && (
                      <rect
                        x={x - 8}
                        y={y - 8}
                        width="16"
                        height="16"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1"
                        strokeDasharray="2 1"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Simulated Live Overlay Textures */}
            <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-300 drop-shadow flex flex-col gap-0.5 z-20">
              <p className="flex items-center gap-1 font-bold text-red-500">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                LIVE CCTV // {selectedCam.id.toUpperCase()}_FEED
              </p>
              <p>LOC: {selectedCam.location.toUpperCase()}</p>
              <p>SENSORS: CAPACITANCE_RADAR_Y</p>
            </div>

            <div className="absolute top-3 right-4 text-[10px] font-mono text-slate-300 drop-shadow text-right z-20">
              <p>DATE: 2026-05-23</p>
              <p className="tabular-nums">TIME: 05:12:{noiseSeed * 2 < 10 ? '0' + noiseSeed * 2 : noiseSeed * 2} AM</p>
              <p className="text-emerald-400">FPS: 30.00 (STABLE)</p>
            </div>

            {/* AI Core Overlaid Tag */}
            <div className="absolute bottom-3 left-3 bg-slate-950/90 text-cyan-400 font-mono text-[10px] px-2.5 py-1 rounded border border-cyan-800/60 flex items-center gap-1.5 z-20">
              <Eye className="w-3.5 h-3.5" />
              <span>AI_CV_TAGS: <span className="text-white font-semibold">{selectedCam.aiLabel}</span></span>
            </div>

            {/* Alert state highlight frame */}
            {(selectedCam.status === 'alert' || selectedCam.id === activeThreatId) && (
              <div className="absolute inset-0 border-2 border-red-500 animate-[pulse_1s_infinite] pointer-events-none z-20 flex items-center justify-center bg-red-950/10">
                <div className="bg-red-600 text-white font-bold font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-sm shadow-lg border border-red-400">
                  CRITICAL SURGE / OBJECT THREAT TRIGGERED
                </div>
              </div>
            )}
          </div>

          {/* Quick HUD controls */}
          <div className="bg-slate-950 px-4 py-2 text-xs flex items-center justify-between border-t border-slate-900 border-none font-mono">
            <span className="text-slate-500">ZOOM: OPTICAL_1.5X</span>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">EST_VOLUME: <b className="text-slate-200">{selectedCam.peopleCount}</b> fans detected</span>
              <button
                onClick={() => onToggleHighlight(selectedCam.id)}
                className={`py-0.5 px-2 text-[10px] rounded border transition-colors ${
                  selectedCam.highlightThreat
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {selectedCam.highlightThreat ? 'Unhighlight Zone' : 'Force Cordon Alert'}
              </button>
            </div>
          </div>
        </div>

        {/* Cam List Sidebar Selector */}
        <div className="bg-slate-950/60 rounded-lg border border-slate-800/80 p-3 h-full max-h-[350px] overflow-y-auto flex flex-col gap-2 relative">
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1 font-mono">Channel Matrix Selector</p>
          {cameras.map(c => {
            const isSelected = selectedCamId === c.id;
            const hasAlert = c.status === 'alert' || c.id === activeThreatId;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCamId(c.id)}
                className={`w-full text-left p-2 rounded-md border flex items-center justify-between transition-all duration-200 font-mono ${
                  isSelected
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Video className={`w-3.5 h-3.5 ${hasAlert ? 'text-rose-500' : isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-300 font-semibold">{c.location}</span>
                    <span className="text-[9px] text-slate-500">{c.peopleCount} detected</span>
                  </div>
                </div>

                {hasAlert ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                ) : c.status === 'online' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
