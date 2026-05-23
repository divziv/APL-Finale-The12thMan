/**
 * @file StadiumControlMap.tsx
 * @description Interactive SVG-based Stadium Blueprint displaying crowd densities, checkpoints, and incident zones.
 */

import React, { useState } from 'react';
import { TurnstileGate, TriageCase } from '../types';
import { MapPin, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface StadiumControlMapProps {
  gates: TurnstileGate[];
  activeThreatId: string | null;
  mapOverlayType: 'heatmap_gate4' | 'heatmap_security_c' | 'heatmap_exodus' | 'normal';
  onSelectGate: (gateId: string) => void;
  selectedGateId: string | null;
  triageCases?: TriageCase[];
  isDrillAlarmActive?: boolean;
}

export default function StadiumControlMap({
  gates,
  activeThreatId,
  mapOverlayType,
  onSelectGate,
  selectedGateId,
  triageCases = [],
  isDrillAlarmActive = false,
}: StadiumControlMapProps) {

  /**
   * Helper to derive gate coordinate positions within a normalized 500x500 box.
   */
  const getGateCoordinates = (id: string): { x: number; y: number; labelPos: 'top' | 'right' | 'bottom' | 'left' } => {
    switch (id) {
      case 'g1': return { x: 250, y: 40, labelPos: 'top' }; // North
      case 'g2': return { x: 440, y: 170, labelPos: 'right' }; // East
      case 'g3': return { x: 440, y: 330, labelPos: 'right' }; // VIP
      case 'g4': return { x: 250, y: 460, labelPos: 'bottom' }; // South
      case 'g5': return { x: 60, y: 330, labelPos: 'left' }; // West
      case 'g6': return { x: 60, y: 170, labelPos: 'left' }; // South-East (mapped west-south-east)
      default: return { x: 250, y: 250, labelPos: 'top' };
    }
  };

  const [isPulsePaused, setIsPulsePaused] = useState(false);
  const selectedGate = gates.find(g => g.id === selectedGateId);

  /**
   * Translates status into premium visual indicator rings.
   */
  const getGateStatusColor = (status: TurnstileGate['status']) => {
    switch (status) {
      case 'optimal': return 'fill-emerald-500 stroke-emerald-400';
      case 'moderate': return 'fill-amber-500 stroke-amber-400';
      case 'congested': return 'fill-red-500 stroke-red-400 animate-pulse';
      case 'emergency_redirect': return 'fill-cyan-500 stroke-cyan-400 animate-pulse';
      case 'closed': return 'fill-rose-700 stroke-rose-500';
      default: return 'fill-slate-500 stroke-slate-400';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[500px]" id="stadium-control-map-container">
      {/* Dynamic inline styles for premium pulse modulations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-increase-anim {
          0% { r: 6px; opacity: 1; stroke-width: 2.5; }
          100% { r: var(--impact-r, 80px); opacity: 0; stroke-width: 1; }
        }
        @keyframes pulse-decrease-anim {
          0% { r: var(--impact-r, 80px); opacity: 0; stroke-width: 1; }
          100% { r: 6px; opacity: 1; stroke-width: 2.5; }
        }
        @keyframes pulse-stable-anim {
          0%, 100% { opacity: 0.4; r: calc(var(--impact-r, 80px) * 0.9); }
          50% { opacity: 0.85; r: calc(var(--impact-r, 80px) * 1.05); }
        }
        @keyframes rotation-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .pulse-increasing-style {
          transform-origin: center;
          animation: pulse-increase-anim 2.8s infinite linear;
        }
        .pulse-decreasing-style {
          transform-origin: center;
          animation: pulse-decrease-anim 2.8s infinite linear;
        }
        .pulse-stable-style {
          transform-origin: center;
          animation: pulse-stable-anim 2s infinite ease-in-out;
        }
        .drill-radar-sweep {
          transform-origin: 250px 250px;
          animation: rotation-sweep 12s infinite linear;
        }
      ` }} />

      {/* Map Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Live Operations Core Map</h2>
          <p className="text-xs text-slate-500 font-mono">STADIUM_GRID_RESOLUTION: 50M_SENSORS</p>
        </div>
        
        {/* Map Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-400">Optimal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span className="text-slate-400">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block"></span>
            <span className="text-slate-400">Congested</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse inline-block"></span>
            <span className="text-slate-400">Redirecting</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-950/40 rounded-lg p-2 border border-slate-950">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full max-w-[450px] max-h-[450px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Tactical grid background elements */}
          <defs>
            <pattern id="grid-pattern" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
            {/* Heat glow gradients */}
            <radialGradient id="glow-gate4" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
              <stop offset="40%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glow-concourse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glow-exodus" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="45%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid backfill */}
          <rect width="100%" height="100%" fill="url(#grid-pattern)" rx="8" />

          {/* Dynamic Crowd Heatmaps based on Scenario overlays */}
          {mapOverlayType === 'heatmap_gate4' && (
            <g>
              {/* Gate 4 local heat bloom */}
              <circle cx="250" cy="410" r="85" fill="url(#glow-gate4)" />
              <circle cx="250" cy="430" r="45" fill="url(#glow-gate4)" className="animate-pulse" />
              {/* Concourse leak to Gate 6 */}
              <path d="M 250,410 Q 150,420 60,330" fill="none" stroke="#f59e0b" strokeWidth="24" strokeLinecap="round" strokeOpacity="0.15" />
            </g>
          )}

          {mapOverlayType === 'heatmap_security_c' && (
            <g>
              {/* Cordon Zone around CCTV Cam 6 (Sector C Concourse) */}
              <circle cx="340" cy="110" r="70" fill="url(#glow-concourse)" opacity="0.65" />
              <circle cx="340" cy="110" r="25" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
              <text x="340" y="90" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">CORDON_SECTOR_C</text>
            </g>
          )}

          {mapOverlayType === 'heatmap_exodus' && (
            <g>
              {/* Massive outflow spreading out to transport grids (Gates 1, 4 exit lines) */}
              <circle cx="250" cy="250" r="140" fill="url(#glow-exodus)" opacity="0.6" />
              <path d="M 250,250 L 250,55" fill="none" stroke="#22c55e" strokeWidth="18" strokeDasharray="5 5" className="animate-[dash_10s_linear_infinite]" opacity="0.4" />
              <path d="M 250,250 L 415,250" fill="none" stroke="#22c55e" strokeWidth="18" strokeDasharray="5 5" className="animate-[dash_10s_linear_infinite]" opacity="0.4" />
              <path d="M 250,250 L 250,425" fill="none" stroke="#22c55e" strokeWidth="18" strokeDasharray="5 5" className="animate-[dash_10s_linear_infinite]" opacity="0.4" />
            </g>
          )}

          {/* Outermost Stadium Perimeter Ring */}
          <circle cx="250" cy="250" r="215" fill="none" stroke="#334155" strokeWidth="3" />
          {/* Concourse Mid Ring */}
          <circle cx="250" cy="250" r="170" fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle cx="250" cy="250" r="170" fill="none" stroke="#334155" strokeWidth="2" />

          {/* Seat Rings Layout */}
          <ellipse cx="250" cy="250" rx="130" ry="110" fill="#0f172a" stroke="#475569" strokeWidth="3" />
          <ellipse cx="250" cy="250" rx="95" ry="75" fill="#020617" stroke="#334155" strokeWidth="2" />

          {/* Cricket Pitch Center Ring */}
          <ellipse cx="250" cy="250" rx="35" ry="25" fill="#14532d" stroke="#10b981" strokeWidth="1.5" />
          {/* Core Pitch Center Square */}
          <rect x="238" y="235" width="24" height="30" fill="#ca8a04" fillOpacity="0.4" stroke="#eab308" strokeWidth="1" />

          {/* Radial Seating Stands Dividers */}
          <line x1="250" y1="120" x2="250" y2="40" stroke="#334155" strokeWidth="2" />
          <line x1="120" y1="250" x2="40" y2="250" stroke="#334155" strokeWidth="2" />
          <line x1="380" y1="250" x2="460" y2="250" stroke="#334155" strokeWidth="2" />
          <line x1="158" y1="158" x2="100" y2="100" stroke="#334155" strokeWidth="2" />
          <line x1="342" y1="158" x2="400" y2="100" stroke="#334155" strokeWidth="2" />
          <line x1="158" y1="342" x2="100" y2="400" stroke="#334155" strokeWidth="2" />
          <line x1="342" y1="342" x2="400" y2="400" stroke="#334155" strokeWidth="2" />

          {/* Stands Seat Block Alphabetic Labels */}
          <text x="250" y="105" fill="#94a3b8" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STAND A (N)</text>
          <text x="375" y="200" fill="#94a3b8" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STAND B (E)</text>
          <text x="350" y="320" fill="#94a3b8" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STAND C (SE)</text>
          <text x="250" y="380" fill="#94a3b8" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STAND D (S)</text>
          <text x="140" y="325" fill="#94a3b8" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STAND E (SW)</text>
          <text x="125" y="200" fill="#94a3b8" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STAND F (W)</text>

          {/* Dynamic Active Triage Case Alerts with Increasing/Decreasing Pulse Rings */}
          {triageCases.map((c) => {
            if (c.status === 'green') return null;
            const coords = getGateCoordinates(c.gateId);
            const color = c.status === 'red' ? '#f43f5e' : '#f59e0b'; // red or yellow status representation
            const pulseClass = c.pulseDirection === 'increasing' ? 'pulse-increasing-style' : c.pulseDirection === 'decreasing' ? 'pulse-decreasing-style' : 'pulse-stable-style';
            const radiusPx = Math.max(15, c.impactAreaMeters / 2.5); // Convert meters into SVG coordinates

            return (
              <g key={`triage-case-pulse-${c.id}`} id={`triage-pulse-${c.id}`}>
                {/* Visual progression alert core pulse indicators */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  style={{ '--impact-r': `${radiusPx}px` } as React.CSSProperties}
                  className={`${pulseClass} ${isPulsePaused ? '[animation-play-state:paused]' : ''}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="2.5"
                  opacity="0.8"
                />
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={radiusPx}
                  fill={color}
                  fillOpacity="0.04"
                  stroke={color}
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
              </g>
            );
          })}

          {/* Drill Evacuation Alarm Overlay (Rotating radar vectors and sweeps) */}
          {isDrillAlarmActive && (
            <g id="drill-evacuation-map-overlay" className="pointer-events-none">
              {/* Concentric drill sweep rings */}
              <circle cx="250" cy="250" r="215" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.35" />
              <circle cx="250" cy="250" r="150" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" opacity="0.25" />
              <circle cx="250" cy="250" r="80" fill="none" stroke="#ef4444" strokeWidth="0.5" opacity="0.15" />
              
              {/* Rotating tactical sweep wedge */}
              <line
                x1="250"
                y1="250"
                x2="250"
                y2="30"
                stroke="#f43f5e"
                strokeWidth="2.5"
                opacity="0.5"
                className="drill-radar-sweep"
              />
              <circle cx="250" cy="250" r="10" fill="#f43f5e" fillOpacity="0.2" stroke="#f43f5e" strokeWidth="1" className="animate-ping" />
            </g>
          )}

          {/* Active Redirection Paths (Animated Arrows) */}
          {gates.map(g => {
            if (g.status === 'emergency_redirect' && g.redirectionTarget) {
              const startCoords = getGateCoordinates(g.id);
              const targetCoords = getGateCoordinates(g.redirectionTarget);
              return (
                <g key={`redirect-${g.id}`}>
                  {/* Dynamic path arrow */}
                  <path
                    d={`M ${startCoords.x},${startCoords.y} Q 250,250 ${targetCoords.x},${targetCoords.y}`}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    className="animate-[dash_6s_linear_infinite]"
                  />
                  {/* Glowing core indicator */}
                  <circle cx={targetCoords.x} cy={targetCoords.y} r="18" fill="none" stroke="#06b6d4" strokeWidth="1" className="animate-ping" />
                </g>
              );
            }
            return null;
          })}

          {/* Interactive Gate nodes */}
          {gates.map((g) => {
            const coords = getGateCoordinates(g.id);
            const isSelected = selectedGateId === g.id;
            const isTargetThreat = activeThreatId === g.id;

            return (
              <g
                key={g.id}
                className="cursor-pointer group"
                onClick={() => onSelectGate(g.id)}
                id={`map-node-${g.id}`}
              >
                {/* Visual pulse for gate threat blockages */}
                {isTargetThreat && (
                  <circle cx={coords.x} cy={coords.y} r="32" fill="#ef4444" fillOpacity="0.25" className="animate-ping" />
                )}

                {/* Connection outer ring */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isSelected ? "17" : "13"}
                  fill="#020617"
                  stroke={isSelected ? "#38bdf8" : "#475569"}
                  strokeWidth="2.5"
                  className={`transition-all duration-300 ${isSelected ? 'animate-pulse' : ''}`}
                />

                <foreignObject x={coords.x - 10} y={coords.y - 30} width="20" height="20">
                  <MapPin className={`w-5 h-5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                </foreignObject>

                {/* Gate status indicator dot */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="7"
                  className={`${getGateStatusColor(g.status)} transition-all duration-300`}
                />

                {/* Redirection indicator icon */}
                {g.status === 'emergency_redirect' && (
                  <circle cx={coords.x} cy={coords.y} r="3" fill="#020617" className="animate-pulse" />
                )}

                {/* SVG Text Labels placed dynamically away from boundary circle */}
                <text
                  x={coords.x}
                  y={coords.labelPos === 'top' ? coords.y - 22 : coords.labelPos === 'bottom' ? coords.y + 24 : coords.y + 4}
                  dx={coords.labelPos === 'left' ? -22 : coords.labelPos === 'right' ? 22 : 0}
                  fill={isSelected ? "#38bdf8" : "#94a3b8"}
                  fontSize="10"
                  fontWeight={isSelected ? "bold" : "normal"}
                  fontFamily="monospace"
                  textAnchor={coords.labelPos === 'left' ? "end" : coords.labelPos === 'right' ? "start" : "middle"}
                  className="transition-colors duration-200 select-none bg-slate-950 px-1 rounded"
                >
                  {g.name.split(' ')[0] + ' ' + g.name.split(' ')[1]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Live HUD Floating Labels */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 py-1.5 px-3 rounded border border-slate-800 text-[10px] text-slate-400 font-mono flex flex-col gap-0.5">
          <p className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYS_TELEMETRY: ONLINE
          </p>
          <p>OUTFLOW_COORDINATES: DYNAMIC_GPS</p>
          <p>METRO_SHUTTLES: SYNCED</p>
        </div>

        {/* Critical Alarm overlay banner */}
        {activeThreatId && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-rose-950/95 border border-rose-500 text-rose-300 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-semibold animate-bounce tracking-wide">
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>AI CORE DETECTED ZONE SURGE IN Sector C/Gate 4!</span>
            <button 
              onClick={() => setIsPulsePaused(!isPulsePaused)}
              className="ml-2 px-2 py-0.5 bg-rose-900 border border-rose-700 rounded text-[10px] hover:bg-rose-800"
            >
              {isPulsePaused ? '▶ Play' : '⏸ Pause'}
            </button>
          </div>
        )}

        {selectedGate && (
          <div className="absolute top-3 right-3 bg-slate-900 border border-cyan-800 p-3 rounded-lg shadow-xl text-xs font-mono w-[200px] z-10 animate-fadeIn">
            <h4 className="text-cyan-400 font-bold mb-1 border-b border-cyan-900 pb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Zone Info: {selectedGate.id.toUpperCase()}
            </h4>
            <div className="flex flex-col gap-1 text-slate-300 mt-2">
              <p>Capacity: <span className="font-bold text-white">{selectedGate.occupancy} / {selectedGate.capacity}</span></p>
              <p>Flow Rate: <span className="font-bold text-amber-400">{selectedGate.flowRate}/min</span></p>
              <p className="mt-1 border-t border-slate-800 pt-1 text-[10px]">
                Impact Radius: <span className="text-emerald-400 font-bold">{Math.round((selectedGate.occupancy / selectedGate.capacity) * 100)}m</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>💡 Click any <b>Gate Node</b> around the ring to view full checkpoint throughput and direct emergency rerouting manually.</span>
      </div>
    </div>
  );
}
