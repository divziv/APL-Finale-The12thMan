/**
 * @file TrafficAndIncidents.tsx
 * @description Advanced security console segment displaying high-tech Traffic Flow Analysis and an active Incident Response Feed.
 */

import React from 'react';
import { TurnstileGate, CommandLog } from '../types';
import { AlertCircle, ShieldAlert, CheckCircle2, TrendingUp, Users, ArrowUpRight, Zap, PlaySquare } from 'lucide-react';

interface TrafficAndIncidentsProps {
  gates: TurnstileGate[];
  logs: CommandLog[];
  onToggleResolve: (logId: string) => void;
  onQuickBypass: (fromId: string, toId: string) => void;
  onAddCustomIncident: (type: 'warning' | 'critical', source: 'SECURITY' | 'SYSTEM', message: string) => void;
}

export default function TrafficAndIncidents({
  gates,
  logs,
  onToggleResolve,
  onQuickBypass,
  onAddCustomIncident,
}: TrafficAndIncidentsProps) {
  
  // Calculate analytics metrics
  const activeIncidentsCount = logs.filter(l => !l.resolved && (l.type === 'critical' || l.type === 'warning')).length;
  
  // High-latency blocks
  const highLatencyGates = gates.filter(g => g.scanSpeed > 2.2);

  // Quick emergency triggers
  const quickThreatScenarios = [
    { title: 'Bag Blockage Gate 4', type: 'warning' as const, source: 'SECURITY' as const, msg: 'Suspected bag scanner crash in Gate 4. Crowd backing up!' },
    { title: 'Guard Shortage Gate 2', type: 'warning' as const, source: 'SYSTEM' as const, msg: 'Heavy ticket flow surges at East concourse. Insufficient queue guards.' },
    { title: 'Siren Drills Evac', type: 'critical' as const, source: 'SECURITY' as const, msg: 'Operator manual safety siren alert launched.' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="traffic-incidents-section">
      
      {/* Box A: Traffic Analysis and Gate Velocity */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col justify-between" id="traffic-analysis-card">
        <div>
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-800/80">
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
                Crowd Traffic & Gate Velocity Analysis
              </h3>
              <p className="text-xs text-slate-500 font-mono">FLOW_CONGESTION_LEVELS_2M_INTERVALS</p>
            </div>
            <div className="flex items-center gap-1 bg-cyan-950/80 border border-cyan-800 text-cyan-400 px-2 py-0.5 rounded font-mono text-[10px]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>FLOW_ALGORITHM_V4</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
            AI monitoring utilizes camera feeds and digital readers to assess ticket validation lag.
            A processing speed above <b>2.2s</b> indicates queue bottlenecks.
          </p>

          {/* List of gate statistics with customized velocity badges */}
          <div className="flex flex-col gap-3">
            {gates.map((g) => {
              const lagStatus = 
                g.status === 'congested' || g.scanSpeed >= 2.8 ? 'CRITICAL_LAG' :
                g.scanSpeed >= 2.0 ? 'MODERATE_DELAY' : 'OPTIMAL_SPEED';
              
              const badgeStyle = 
                lagStatus === 'CRITICAL_LAG' ? 'bg-red-950/70 text-red-400 border-red-900' :
                lagStatus === 'MODERATE_DELAY' ? 'bg-amber-950/70 text-amber-400 border-amber-900' :
                'bg-emerald-950/70 text-emerald-400 border-emerald-900';

              return (
                <div key={g.id} className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${
                      lagStatus === 'CRITICAL_LAG' ? 'bg-red-500 animate-pulse' :
                      lagStatus === 'MODERATE_DELAY' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <div>
                      <p className="font-bold text-slate-200">{g.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">OCCUPANCY: {g.occupancy.toLocaleString()} / {g.capacity.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col md:flex-row items-end md:items-center gap-2">
                    <div className="text-[10px]">
                      <p className="text-slate-400 font-bold">{g.flowRate} p/m</p>
                      <p className="text-slate-500 text-[9px] mt-0.5">{g.scanSpeed}s avg</p>
                    </div>
                    
                    <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${badgeStyle}`}>
                      {lagStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick redirect dispatcher helpers */}
        {highLatencyGates.length > 0 && (
          <div className="bg-indigo-950/30 border border-indigo-900/60 p-3.5 rounded-lg mt-4 font-sans flex items-start gap-3">
            <Zap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs">
              <p className="font-semibold text-indigo-200 uppercase tracking-wide font-mono text-[10px]">Automated Dynamic Bypass suggestion</p>
              <p className="text-slate-350 mt-1">
                Detected bottlenecks at <b>{highLatencyGates.map(h => h.name.split(' ')[0] + ' ' + h.name.split(' ')[1]).join(', ')}</b>.
                Click below to instantly deploy redirection indicators to adjacent standby Gates:
              </p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => onQuickBypass('g4', 'g6')}
                  className="px-3 py-1.5 bg-indigo-800 hover:bg-indigo-700 font-bold text-white font-mono rounded text-[9px] cursor-pointer transition-colors"
                >
                  Divert G4 ➔ G6 (South)
                </button>
                <button
                  onClick={() => onQuickBypass('g2', 'g1')}
                  className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 font-bold text-indigo-300 font-mono rounded border border-indigo-805 text-[9px] cursor-pointer transition-colors"
                >
                  Divert G2 ➔ G1 (North-East)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Box B: Incident Response Feed & Active Alerts */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col justify-between" id="incident-response-feed-card">
        <div>
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-800/80">
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Active Incident Response Feed</span>
              </h3>
              <p className="text-xs text-slate-500 font-mono">STAFF_RESPONDERS_CHANNELS: ENGAGED</p>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold bg-rose-950/65 border border-rose-900 text-rose-400 px-2 py-0.5 rounded">
              <span>{activeIncidentsCount} ACTIVE SEC ALERTS</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
            Security personnel is connected to these active logs in real-time. Operators should audit the queue and toggle resolution status when dispatchers confirm clear on-site metrics.
          </p>

          {/* List of active alerts */}
          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[220px] pr-1">
            {logs.filter(l => !l.resolved && (l.type === 'critical' || l.type === 'warning')).length === 0 ? (
              <div className="text-center py-10 bg-slate-950/20 border border-slate-850 rounded-lg flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <p className="text-xs text-slate-500 font-mono">All reported security sectors are reporting safe parameters.</p>
              </div>
            ) : (
              logs.filter(l => !l.resolved && (l.type === 'critical' || l.type === 'warning')).map((l) => (
                <div
                  key={l.id}
                  className={`p-3 rounded-lg border font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 bg-red-950/20 border-red-900/50 text-red-100`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold uppercase bg-red-950 border border-red-900 text-red-400 px-1.5 py-0.2 rounded text-[8px]">
                        {l.source}
                      </span>
                      <span className="text-slate-510 text-[9px]">{l.timestamp}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-200 mt-1">{l.message}</p>
                  </div>

                  <button
                    onClick={() => onToggleResolve(l.id)}
                    className="self-start md:self-center bg-emerald-700 hover:bg-emerald-600 font-extrabold text-slate-950 px-2.5 py-1 text-[9px] rounded uppercase cursor-pointer shrink-0 transition-colors"
                  >
                    Resolve Alert
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Trigger drills quick launchers */}
        <div className="border-t border-slate-800/80 pt-4 mt-3 bg-slate-950/40 p-3 rounded-lg border border-slate-850">
          <span className="text-[10px] text-slate-400 font-mono tracking-widest font-extrabold uppercase block mb-2.5">
            Manual Operator Trigger Drills
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {quickThreatScenarios.map((sc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onAddCustomIncident(sc.type, sc.source, sc.msg)}
                className="py-2 bg-slate-900 hover:bg-slate-800 hover:text-white text-[10px] font-bold text-slate-350 rounded border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer text-left px-2 flex flex-col justify-between h-14"
              >
                <span className="truncate block font-mono font-semibold text-rose-300">{sc.title}</span>
                <span className="text-[8px] text-slate-500 font-normal truncate block">{sc.msg}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
