/**
 * @file CheckpointStats.tsx
 * @description Advanced CSS/SVG dashboard component rendering high-tech live stats, scanning throughput timelines, and checkpoint guard distributions.
 */

import React from 'react';
import { TurnstileGate } from '../types';
import { Activity, Shield, Users, Server } from 'lucide-react';

interface CheckpointStatsProps {
  gates: TurnstileGate[];
}

export default function CheckpointStats({ gates }: CheckpointStatsProps) {
  
  /**
   * Safe percentage calculator.
   */
  const getOccupancyPercentage = (gate: TurnstileGate) => {
    return Math.min(Math.round((gate.occupancy / gate.capacity) * 100), 100);
  };

  /**
   * Fake Matchday Hourly Timeline Scans data.
   * Represents throughput peaks at different intervals.
   */
  const timelineScans = [
    { hour: '14:00', scans: 450, label: 'Gates Open' },
    { hour: '15:00', scans: 1450, label: 'Early Arrival' },
    { hour: '16:00', scans: 3100, label: 'Peak Surge' },
    { hour: '17:00', scans: 620, label: 'Kickoff Normal' },
    { hour: '18:00', scans: 310, label: 'Mid-Match Slump' },
    { hour: '19:00', scans: 4600, label: 'Exodus Flush' }
  ];

  // Derive maximum scans to normalize heights
  const maxScansValue = 5000;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col h-full" id="checkpoint-stats-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Stadium Access Analytics</h2>
          <p className="text-xs text-slate-500 font-mono">TICKET_INTEGRATION: CORE_REST_API</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded text-[11px] font-mono border border-slate-800/80 text-cyan-400">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>REALTIME_PIPELINE: ACTIVE</span>
        </div>
      </div>

      {/* Grid Layout of Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
        
        {/* Left Side: Throughput Timeline Chart */}
        <div className="bg-slate-950/50 rounded-lg border border-slate-850 p-4 flex flex-col">
          <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Turnstile Scanning Peak History (Hourly)
          </h3>

          {/* Interactive CSS bars representing high precision historical timeline */}
          <div className="flex-1 flex gap-3 items-end justify-between min-h-[160px] pb-2 pt-4 px-1 border-b border-slate-800">
            {timelineScans.map((data, index) => {
              const barHeightPct = (data.scans / maxScansValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                  
                  {/* Tooltip Hover Overlay */}
                  <div className="absolute bottom-full mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 p-1.5 rounded border border-slate-700 text-[10px] text-white font-mono text-center z-1 z-30 shadow-lg pointer-events-none min-w-[70px]">
                    <p className="text-[9px] text-cyan-400 font-bold">{data.label}</p>
                    <p className="font-bold">{data.scans.toLocaleString()} scans</p>
                  </div>

                  {/* Active Bar */}
                  <div className="w-full bg-slate-900 border border-slate-800 rounded-t overflow-hidden relative flex items-end min-h-[10px] h-full">
                    {/* Filling level indicator */}
                    <div
                      style={{ height: `${barHeightPct}%` }}
                      className={`w-full rounded-t transition-all duration-700 ${
                        data.scans > 3000
                          ? 'bg-gradient-to-t from-red-600 to-rose-400'
                          : data.scans > 1000
                          ? 'bg-gradient-to-t from-cyan-600 to-cyan-400'
                          : 'bg-gradient-to-t from-slate-700 to-slate-500'
                      }`}
                    ></div>
                  </div>

                  {/* X Axis labels */}
                  <span className="text-[9px] font-mono text-slate-400 mt-2 font-bold">{data.hour}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-2">
            <span>START_HOUR: 14:00</span>
            <span>END_HOUR: 20:00</span>
          </div>
        </div>

        {/* Right Side: Gate Checkpoint Capacities */}
        <div className="bg-slate-950/50 rounded-lg border border-slate-850 p-4 flex flex-col">
          <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Checkpoint Flow Efficiency & Capacity
          </h3>

          <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[180px] pr-1">
            {gates.map((g) => {
              const pct = getOccupancyPercentage(g);
              const colorClass = 
                g.status === 'congested' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' :
                g.status === 'emergency_redirect' ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' :
                pct > 65 ? 'bg-amber-500' : 'bg-emerald-500';

              return (
                <div key={g.id} className="text-xs">
                  {/* Gate labels and values */}
                  <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                    <span className="text-slate-300 font-bold">{g.name}</span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>Rate: <b className="text-slate-200">{g.flowRate} p/m</b></span>
                      <span>Scan: <b className="text-slate-200">{g.scanSpeed}s</b></span>
                      <span className="font-bold text-slate-200">{g.occupancy.toLocaleString()} / {g.capacity.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Capacity Bar Container */}
                  <div className="h-2 w-full bg-slate-900 border border-slate-800/80 rounded overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded transition-all duration-500 ${colorClass}`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Sub-Header Tactical Cards */}
      <div className="grid grid-cols-3 gap-3 mt-4 border-t border-slate-800/80 pt-4">
        <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="font-mono text-[9px]">
            <p className="text-slate-400 uppercase tracking-widest font-bold">Guards Allocated</p>
            <p className="text-slate-200 font-semibold">{gates.reduce((acc, current) => acc + current.activeGuards, 0)} Active</p>
          </div>
        </div>
        
        <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60 flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="font-mono text-[9px]">
            <p className="text-slate-400 uppercase tracking-widest font-bold">Total Checked</p>
            <p className="text-slate-200 font-semibold">{gates.reduce((acc, current) => acc + current.occupancy, 0).toLocaleString()} Spectators</p>
          </div>
        </div>

        <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60 flex items-center gap-2">
          <Server className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="font-mono text-[9px]">
            <p className="text-slate-400 uppercase tracking-widest font-bold">API Sync Latency</p>
            <p className="text-slate-200 font-semibold">14 ms (EXCELLENT)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
