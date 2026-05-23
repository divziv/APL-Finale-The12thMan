/**
 * @file AnalyticsCharts.tsx
 * @description Highly visual, elegant custom SVG charts mapping hourly scans, gate capacities, average scan speeds, and safety thresholds.
 */

import React, { useState } from 'react';
import { TurnstileGate } from '../types';
import { BarChart3, TrendingUp, Cpu, Flame, Clock, RefreshCw } from 'lucide-react';

interface AnalyticsChartsProps {
  gates: TurnstileGate[];
}

export default function AnalyticsCharts({ gates }: AnalyticsChartsProps) {
  // Safe mock hourly scans data
  const [hourlyScans, setHourlyScans] = useState([
    { hour: '01:00 PM', value: 2400, label: 'Early Checkins' },
    { hour: '02:00 PM', value: 4300, label: 'Lawn gates open' },
    { hour: '03:00 PM', value: 8500, label: 'Warmups start' },
    { hour: '04:00 PM', value: 14200, label: 'Peak rush' },
    { hour: '05:00 PM', value: 19800, label: 'Match kickoff countdown' },
  ]);

  const [activeHourIndex, setActiveHourIndex] = useState<number | null>(4);

  // Derive highest flow rate gate
  const peakGate = [...gates].sort((a, b) => b.flowRate - a.flowRate)[0] || gates[0];

  // Derive total stadium throughput capacity and current entry progress
  const totalOccupancy = gates.reduce((sum, g) => sum + g.occupancy, 0);
  const totalCapacity = gates.reduce((sum, g) => sum + g.capacity, 0);
  const capacityPercent = Math.round((totalOccupancy / totalCapacity) * 100);

  // Simple trigger to mock refresh stats
  const [lastRefreshed, setLastRefreshed] = useState<string>('05:15:00 AM');
  const handleSimulateRefresh = () => {
    const now = new Date();
    setLastRefreshed(now.toLocaleTimeString('en-US', { hour12: true }));
  };

  /**
   * Helper values to plot custom SVG path coordinates easily
   */
  const svgWidth = 500;
  const svgHeight = 180;
  const padding = 25;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;
  const maxScanValue = 22000;

  // Render SVG coordinate points
  const points = hourlyScans.map((data, index) => {
    const x = padding + (index * chartWidth) / (hourlyScans.length - 1);
    const y = svgHeight - padding - (data.value * chartHeight) / maxScanValue;
    return { x, y, ...data };
  });

  // Compose path string
  const pathData = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');

  // Compose area path string
  const areaData = `${pathData} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-6" id="analytics-deck">
      
      {/* 1. Header with dynamic triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-cyan-400" />
            <span>Operational Crowdflow Analytics Board</span>
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">METRIC_STREAM_SYNC: STANDBY</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[10px]">
          <span className="text-slate-500">Last Sync: {lastRefreshed}</span>
          <button
            id="btn-sync-stats"
            onClick={handleSimulateRefresh}
            className="p-1 px-2 border border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-400 hover:text-slate-200 transition-colors rounded flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reload Stream</span>
          </button>
        </div>
      </div>

      {/* 2. Top-Level Summary Analytics Grid cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-855 font-mono">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Aggregate Fill Rate</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-slate-200">{capacityPercent}%</span>
            <span className="text-[10px] text-slate-400 font-sans">of {totalCapacity.toLocaleString()} limit</span>
          </div>
          <div className="w-full bg-slate-850 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-cyan-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-855 font-mono">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Velocity Peak</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-amber-400">{peakGate.flowRate} / min</span>
            <span className="text-[10px] text-slate-400 font-sans">at {peakGate.name.split(' ')[0]}</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2 font-sans truncate">Handles bottleneck diversion capacity.</p>
        </div>

        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-855 font-mono">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Avg Ticket Process Speed</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-emerald-400">
              {(gates.reduce((sum, g) => sum + g.scanSpeed, 0) / gates.length).toFixed(2)}s
            </span>
            <span className="text-[10px] text-slate-400 font-sans">target &lt; 2s</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2 font-sans">Reader hardware response speeds are normal.</p>
        </div>

        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-855 font-mono">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Security Deployment</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-teal-400">
              {gates.reduce((sum, g) => sum + g.activeGuards, 0)} Active
            </span>
            <span className="text-[10px] text-slate-400 font-sans">stationed units</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2 font-sans">Ready for emergency redeployments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 3. Hourly Intake Scans Line Chart (Custom High-Poly SVG) */}
        <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Hourly Attendance Intake Trend (Scans)</span>
            </h3>
            <span className="text-[9px] bg-cyan-950/60 border border-cyan-800 px-1.5 py-0.5 rounded font-mono text-cyan-400 uppercase">
              Live Feed Chart
            </span>
          </div>

          <div className="flex-1 relative flex items-center justify-center pt-2">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none overflow-visible">
              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#1e293b" strokeDasharray="3 3" />
              <line x1={padding} y1={padding + chartHeight / 2} x2={svgWidth - padding} y2={padding + chartHeight / 2} stroke="#1e293b" strokeDasharray="3 3" />
              <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#334155" />

              {/* Chart Line Path */}
              <path d={areaData} fill="url(#line-area-gradient)" opacity="0.15" />
              <path d={pathData} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data Interactive Dots */}
              {points.map((p, index) => {
                const isActive = activeHourIndex === index;
                return (
                  <g key={index} className="cursor-pointer" onClick={() => setActiveHourIndex(index)}>
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r={isActive ? "7" : "4.5"} 
                      fill={isActive ? "#22d3ee" : "#0f172a"} 
                      stroke="#22d3ee" 
                      strokeWidth="2" 
                      className="transition-all duration-200 hover:r-7"
                    />
                    {isActive && (
                      <circle cx={p.x} cy={p.y} r="12" fill="none" stroke="#22d3ee" strokeWidth="1" className="animate-ping" />
                    )}
                  </g>
                );
              })}

              {/* Axis labels */}
              {points.map((p, index) => (
                <text 
                  key={`label-${index}`}
                  x={p.x} 
                  y={svgHeight - 10} 
                  fill="#64748b" 
                  fontSize="8" 
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {p.hour.split(' ')[0]}
                </text>
              ))}

              {/* Tooltip gradients */}
              <defs>
                <linearGradient id="line-area-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Static HUD Floating Card for Selected Hour detail */}
            {activeHourIndex !== null && (
              <div className="absolute top-10 right-4 bg-slate-950 border border-slate-800 p-2 text-[10px] font-mono text-slate-400 rounded shadow-md z-10 flex flex-col gap-0.5">
                <p className="font-bold text-slate-200 uppercase">{hourlyScans[activeHourIndex].label}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>Hour: {hourlyScans[activeHourIndex].hour}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-slate-200">Scans: <b>{hourlyScans[activeHourIndex].value.toLocaleString()}</b></span>
                </div>
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-500 italic text-center font-sans">
            💡 Click timeline coordinates on the graph above to view exact hourly ingress counts and ticketing trends.
          </p>
        </div>

        {/* 4. Gate Capacities & Scanning Speed Matrix (Comparing current loads to Safe Capacities) */}
        <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3">
          <h3 className="text-xs font-bold font-mono tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Access Point Capacity Utilization Matrix</span>
          </h3>

          <div className="flex flex-col gap-3.5 pt-1">
            {gates.map((g) => {
              const capPercent = Math.round((g.occupancy / g.capacity) * 100);
              const barColor = 
                g.status === 'congested' ? 'bg-red-500' :
                g.status === 'emergency_redirect' ? 'bg-cyan-500' :
                g.status === 'closed' ? 'bg-rose-700' : 'bg-emerald-500';

              return (
                <div key={g.id} className="text-[10px] font-mono">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-bold text-slate-300">{g.name}</span>
                    <span>
                      {g.occupancy.toLocaleString()} / {g.capacity.toLocaleString()} spectators ({capPercent}%)
                    </span>
                  </div>
                  
                  {/* Outer hollow bar */}
                  <div className="w-full h-2.5 bg-slate-900 border border-slate-800 rounded overflow-hidden relative">
                    <div 
                      className={`h-full rounded-sm transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(capPercent, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
