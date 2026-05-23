/**
 * @file StadiumTriageOperations.tsx
 * @description Operational Triage Core displaying real-time match statistics, live triage queue, route deflections, and drill alarm triggers.
 */

import React, { useState } from 'react';
import { TriageCase, TurnstileGate, CricketMatch, CommandLog } from '../types';
import {
  Activity,
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Volume2,
  Users,
  Compass,
  Trophy,
  Shuffle,
  ActivityIcon,
  Sparkles,
  Layers,
  Flame,
  Radio,
  Sliders,
  ShieldAlert
} from 'lucide-react';

interface StadiumTriageOperationsProps {
  gates: TurnstileGate[];
  match: CricketMatch;
  triageCases: TriageCase[];
  onUpdateTriageCase: (caseId: string, updatedFields: Partial<TriageCase>) => void;
  onClearAllResolved: () => void;
  onTriggerDeflection: (fromGateId: string, toGateId: string) => void;
  onTriggerDrillAlarm: () => void;
  onResetTriageToBaseline: () => void;
  speakText: (text: string) => void;
}

export default function StadiumTriageOperations({
  gates,
  match,
  triageCases,
  onUpdateTriageCase,
  onClearAllResolved,
  onTriggerDeflection,
  onTriggerDrillAlarm,
  onResetTriageToBaseline,
  speakText,
}: StadiumTriageOperationsProps) {
  // Local state for manually setting route deflection parameters
  const [deflectFrom, setDeflectFrom] = useState<string>('g4');
  const [deflectTo, setDeflectTo] = useState<string>('g6');
  const [deflectPercentage, setDeflectPercentage] = useState<number>(60);

  // Local state for inspecting selected triage case's pulse configuration
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(
    triageCases.length > 0 ? triageCases[0].id : null
  );

  // Select first case if none selected
  const activeSelectedCase = triageCases.find(c => c.id === selectedCaseId) || triageCases[0];

  const handleUpdateImpactRadius = (caseId: string, value: number) => {
    onUpdateTriageCase(caseId, { impactAreaMeters: value });
  };

  const handleTogglePulseDirection = (caseId: string, current: 'increasing' | 'decreasing' | 'stable') => {
    const next: 'increasing' | 'decreasing' | 'stable' = 
      current === 'increasing' ? 'decreasing' : 'increasing';
    onUpdateTriageCase(caseId, { pulseDirection: next });
    speakText(`Pulse direction changed to ${next} for ${triageCases.find(c => c.id === caseId)?.title}`);
  };

  const handleAcknowledge = (caseId: string) => {
    const orig = triageCases.find(c => c.id === caseId);
    if (!orig) return;
    
    // Red -> Yellow progression
    onUpdateTriageCase(caseId, {
      status: 'yellow',
      description: 'Mitigation initiated. Redirect dynamic signage displays active and auxiliary guards deployed.',
      actionTaken: 'Operator initiated immediate dynamic bypass deflection and dispatched ground rangers.',
    });

    // Also impact the gate status in simulation
    if (orig.gateId) {
      onTriggerDeflection(orig.gateId, 'g6'); // Default alternate Gate 6
    }

    speakText(`Alert acknowledged. Sector ${orig.gateId.toUpperCase()} set to dynamic deflection path. Level 2 responders deployed.`);
  };

  const handleClearCaseResult = (caseId: string) => {
    const orig = triageCases.find(c => c.id === caseId);
    if (!orig) return;

    // Yellow -> Green progression
    onUpdateTriageCase(caseId, {
      status: 'green',
      description: 'Surge fully cleared and spectator ingress returned to optimal parameters.',
      actionTaken: 'Completed site clearance. Returned gate controllers to baseline optimal flow rate.',
    });

    speakText(`Sector clear. Gate ${orig.gateId.toUpperCase()} security clearance complete and operating at green.`);
  };

  // Aggregated status calculations for the triage dashboard overview
  const totalActive = triageCases.filter(c => c.status !== 'green').length;
  const totalCritical = triageCases.filter(c => c.status === 'red').length;
  const totalRerouted = triageCases.filter(c => c.status === 'yellow').length;
  const totalResolvedCount = triageCases.filter(c => c.status === 'green').length;

  const getStatusBadgeClass = (status: TriageCase['status']) => {
    switch (status) {
      case 'red': return 'bg-rose-950/70 border-rose-500/80 text-rose-350 animate-pulse';
      case 'yellow': return 'bg-amber-950/70 border-amber-500 text-amber-300';
      case 'green': return 'bg-emerald-950/50 border-emerald-900 text-emerald-400';
      default: return 'bg-slate-900 border-slate-800 text-slate-450';
    }
  };

  const getSeverityBadgeClass = (severity: TriageCase['severity']) => {
    switch (severity) {
      case 'critical': return 'text-rose-450 bg-rose-950/50 border-rose-900/60 font-bold';
      case 'alert': return 'text-amber-450 bg-amber-950/40 border-amber-800/40 font-semibold';
      case 'info': return 'text-cyan-400 bg-cyan-950/30 border-cyan-850/40';
      default: return 'text-slate-400 bg-slate-950 border-slate-800';
    }
  };

  // Simple dispatcher for manual route deflections panel
  const handleExecuteDeflect = (e: React.FormEvent) => {
    e.preventDefault();
    if (deflectFrom === deflectTo) return;
    onTriggerDeflection(deflectFrom, deflectTo);
    speakText(`Deflected ${deflectPercentage} percent of inbound flow from Gate ${deflectFrom.toUpperCase()} to ${deflectTo.toUpperCase()}.`);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="triage-operations-viewport">

      {/* LEFT COLUMN: Triage Core overview & Live Queue (8 cols) */}
      <div className="xl:col-span-8 flex flex-col gap-6">
        
        {/* Row A: Dynamic Triage Dashboard Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="triage-dashboard-stats-grid">
          
          <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between shadow-lg relative overflow-hidden">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-450 font-mono font-bold uppercase tracking-wider">Unresolved Threats</span>
              <span className="text-2xl font-black text-rose-500 mt-1 font-mono">{totalActive}</span>
              <span className="text-[9px] text-rose-400 mt-1.5 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
                Needs Attention
              </span>
            </div>
            <AlertOctagon className="w-10 h-10 text-rose-950 stroke-rose-900 shrink-0" />
          </div>

          <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between shadow-lg relative overflow-hidden">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-450 font-mono font-bold uppercase tracking-wider">Critical surges</span>
              <span className="text-2xl font-black text-red-500 mt-1 font-mono">{totalCritical}</span>
              <span className="text-[9px] text-slate-500 mt-1.5 font-mono">Status: RED INDICATOR</span>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-950/80 stroke-red-900 shrink-0" />
          </div>

          <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between shadow-lg relative overflow-hidden">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-450 font-mono font-bold uppercase tracking-wider">Managed & Diverted</span>
              <span className="text-2xl font-black text-amber-450 mt-1 font-mono">{totalRerouted}</span>
              <span className="text-[9px] text-amber-500 mt-1.5 font-mono">Status: YELLOW STAGE</span>
            </div>
            <Shuffle className="w-10 h-10 text-amber-950/80 stroke-amber-900 shrink-0" />
          </div>

          <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between shadow-lg relative overflow-hidden">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-450 font-mono font-bold uppercase tracking-wider">Cleared & Optimal</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 font-mono">{totalResolvedCount}</span>
              <span className="text-[9px] text-emerald-400 mt-1.5 font-mono">Status: GREEN SECURE</span>
            </div>
            <CheckCircle2 className="w-10 h-10 text-emerald-950 stroke-emerald-900 shrink-0" />
          </div>

        </div>

        {/* Row B: Interactive Live Triage Queue panel */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col flex-1 min-h-[440px]" id="triage-queue-section">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse inline-block"></span>
                <span className="text-xs font-mono font-extrabold text-cyan-450 uppercase tracking-widest">Interactive Command Roster</span>
              </div>
              <h2 className="text-sm font-semibold text-slate-350 uppercase mt-0.5">Spectator Overflow & Safety Triage Queue</h2>
            </div>
            
            <div className="flex items-center gap-2.5 font-mono">
              <button
                onClick={onClearAllResolved}
                className="px-2.5 py-1.5 border border-slate-800 text-[10px] text-slate-400 hover:text-rose-455 hover:border-rose-950/80 rounded transition-all bg-slate-950/40"
                aria-label="Flush resolved completed triage cases"
              >
                Flush Green Cases
              </button>
              
              <button
                onClick={onResetTriageToBaseline}
                className="px-2.5 py-1.5 border border-slate-800 text-[10px] text-slate-300 hover:bg-slate-850 rounded transition-all"
                title="Restore default queue alerts"
              >
                Reset Default Queue
              </button>
            </div>
          </div>

          {/* Interactive alert listings */}
          <div className="flex-1 overflow-y-auto max-h-[380px] flex flex-col gap-3 pr-1">
            {triageCases.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-lg text-slate-550 font-mono text-xs">
                <CheckCircle2 className="w-8 h-8 text-slate-700 mb-2" />
                <span>ALL SECTORS FULLY TRIAGED & SECURED</span>
              </div>
            ) : (
              triageCases.map((c) => {
                const isSelected = selectedCaseId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col md:flex-row justify-between gap-4 relative group ${
                      isSelected ? 'bg-slate-850/80 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.1)]' : 'bg-slate-950/45 border-slate-850 hover:bg-slate-950/80 hover:border-slate-800'
                    }`}
                  >
                    
                    {/* Visual Progression Color ring container */}
                    <div className="flex gap-3 items-start flex-1 min-w-0">
                      
                      <div className="mt-1 shrink-0 flex items-center justify-center">
                        {c.status === 'red' && (
                          <div className="relative flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border border-slate-950"></span>
                          </div>
                        )}
                        {c.status === 'yellow' && (
                          <div className="relative flex h-3.5 w-3.5">
                            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-slate-950"></span>
                          </div>
                        )}
                        {c.status === 'green' && (
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 fill-emerald-950/20" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1 text-[11px] font-mono">
                          <span className={`px-1.5 py-0.2 rounded border text-[9px] uppercase font-bold ${getSeverityBadgeClass(c.severity)}`}>
                            {c.severity.toUpperCase()}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded border text-[9px] uppercase font-semibold ${getStatusBadgeClass(c.status)}`}>
                            {c.status === 'red' ? '🔴 Red: Awaiting Triage' : c.status === 'yellow' ? '🟡 Yellow: Rerouted/In Progress' : '🟢 Green: Cleared/Optimal'}
                          </span>
                          <span className="text-slate-500 font-medium">| {c.timestamp}</span>
                          <span className="text-cyan-400 font-bold ml-auto shrink-0 uppercase">{c.gateId ? gates.find(g => g.id === c.gateId)?.name.split(' (')[0] : 'STADIUM PLAZA'}</span>
                        </div>

                        <h3 className="text-xs font-bold text-slate-200 group-hover:text-cyan-350 transition-colors">{c.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">{c.description}</p>
                        
                        {c.actionTaken && (
                          <div className="mt-2 text-[10px] font-mono text-teal-400 bg-teal-950/30 border border-teal-900/40 p-1.5 rounded flex items-center gap-1.5">
                            <span className="font-extrabold uppercase shrink-0 text-emerald-500">[RESOLUTION DIARY]:</span>
                            <span className="text-slate-300 truncate">{c.actionTaken}</span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Operational Triage Toggles (Dynamic Red -> Yellow -> Green Actions) */}
                    <div className="flex items-center gap-2 md:self-center shrink-0 font-mono text-[10px]">
                      
                      {c.status === 'red' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAcknowledge(c.id); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-300 font-extrabold hover:text-white rounded cursor-pointer transition-all uppercase text-[10px]"
                          aria-label={`Dispatch deflection taskforce for ${c.title}`}
                        >
                          <Shuffle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Bypass (Reroute)</span>
                        </button>
                      )}

                      {c.status === 'yellow' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleClearCaseResult(c.id); }}
                          className="flex items-center gap-1 py-1.5 px-3 bg-amber-950 hover:bg-amber-900 border border-amber-600 text-amber-300 font-extrabold rounded cursor-pointer transition-all uppercase text-[10px]"
                          aria-label={`Mark incident ${c.title} resolved`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Clear Area</span>
                        </button>
                      )}

                      {c.status === 'green' && (
                        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-900/60 font-semibold cursor-default text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>SECURED & OPTIMAL</span>
                        </div>
                      )}

                    </div>

                  </div>
                );
              })
            )}
          </div>

        </section>

      </div>

      {/* RIGHT COLUMN: Match statistics, deflect tools, details config (4 cols) */}
      <div className="xl:col-span-4 flex flex-col gap-6">
        
        {/* Box 1: Dynamic Match & Ingress Analytics Statistics */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col relative" id="matchday-ingress-stats">
          <div className="absolute right-3 top-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[8px] font-mono px-2 py-0.5 rounded-full uppercase font-bold tracking-widest">
            Telemetry Feed
          </div>
          
          <h3 className="text-xs font-bold font-mono tracking-widest text-slate-450 uppercase flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Match Ingress Statistics</span>
          </h3>

          <div className="mt-4 flex items-baseline justify-between font-mono bg-slate-950 p-3 rounded border border-slate-850">
            <div>
              <span className="text-[10px] text-slate-500 block font-bold">MATCH STATE SCORE</span>
              <span className="text-base font-black text-white">{match.battingTeam} {match.score}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-bold">OVERS IN PLAY</span>
              <span className="text-sm font-bold text-cyan-400">{match.overs} Over</span>
            </div>
          </div>

          <div className="mt-4 space-y-3 font-mono text-[11px] text-slate-400">
            
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
              <span className="text-slate-500">Peak Fluid Velocity</span>
              <span className="text-slate-200 font-bold">280 spectators / min</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
              <span className="text-slate-500">Projected Entry Completion</span>
              <span className="text-teal-400 font-bold">14 Minutes</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
              <span className="text-slate-500">Triage Buffer Overflow</span>
              <span className="text-emerald-450 font-bold">3% (SAFE)</span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-500">Outflow Safety Ratio</span>
              <span className="text-cyan-400 font-bold">1.4 (STANDBY)</span>
            </div>

          </div>
        </section>

        {/* Box 2: Route Deflections Console */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col" id="route-deflections-control">
          <h3 className="text-xs font-bold font-mono tracking-widest text-slate-450 uppercase flex items-center gap-1.5 mb-3">
            <Shuffle className="w-4 h-4 text-cyan-400" />
            <span>Dynamic Route Deflections</span>
          </h3>

          <form onSubmit={handleExecuteDeflect} className="space-y-3 font-mono text-[11px]">
            
            <div className="flex items-center justify-between text-slate-400">
              <span>Primary Surge Bottleneck:</span>
              <select
                id="deflection-select-from"
                value={deflectFrom}
                onChange={(e) => setDeflectFrom(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-1.5 py-1 text-[11px]"
              >
                {gates.map(g => (
                  <option key={g.id} value={g.id}>{g.name.split(' (')[0]}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>Alternate Entry Bypass:</span>
              <select
                id="deflection-select-to"
                value={deflectTo}
                onChange={(e) => setDeflectTo(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-1.5 py-1 text-[11px]"
              >
                {gates.map(g => (
                  <option key={g.id} value={g.id}>{g.name.split(' (')[0]}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500 uppercase">
                <span>Diverted Load Fraction</span>
                <span className="text-cyan-400 font-bold">{deflectPercentage}%</span>
              </div>
              <input
                id="deflection-percentage-slider"
                type="range"
                min="10"
                max="100"
                step="5"
                value={deflectPercentage}
                onChange={(e) => setDeflectPercentage(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={deflectFrom === deflectTo}
              className="w-full py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-black rounded text-center cursor-pointer uppercase transition-all duration-200 tracking-wider disabled:opacity-30 disabled:cursor-not-allowed text-xs shadow-inner"
            >
              Apply Route Deflection
            </button>

          </form>

          {/* Redirection Metrics display */}
          <div className="mt-4 pt-3.5 border-t border-slate-800/80 font-mono text-[9px] text-slate-550 space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Deflected Spectator Load:</span>
              <span className="text-slate-200 font-bold">1,822 Spectators</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Redirection Efficiency:</span>
              <span className="text-emerald-450 font-bold">96.4% Secure</span>
            </div>
          </div>
        </section>

        {/* Box 3: Live Pulse Overrides & Drill Alarm */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4 font-mono text-xs" id="tactical-pulse-drill-commands">
          
          <div className="border-b border-slate-850 pb-2.5">
            <h3 className="text-slate-450 uppercase font-bold text-xs tracking-widest flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Dynamic Pulse Overrides</span>
            </h3>
            <p className="text-[10px] text-slate-550 mt-1 font-sans">Modify map pulse parameters manually.</p>
          </div>

          <div className="space-y-3">
            
            {/* Impact Area Slider */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                <span>IMPACT radius:</span>
                <span className="text-amber-400 font-bold">
                  {activeSelectedCase ? activeSelectedCase.impactAreaMeters : 120}m
                </span>
              </div>
              <input
                id="pulse-impact-area-slider"
                type="range"
                min="20"
                max="300"
                step="10"
                value={activeSelectedCase ? activeSelectedCase.impactAreaMeters : 120}
                onChange={(e) => {
                  if (activeSelectedCase) {
                    handleUpdateImpactRadius(activeSelectedCase.id, Number(e.target.value));
                  }
                }}
                disabled={!activeSelectedCase}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-40"
              />
            </div>

            {/* Change Direction toggle */}
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>PULSE DIRECTIVITY:</span>
              <button
                id="pulse-direction-toggle-btn"
                onClick={() => {
                  if (activeSelectedCase) {
                    handleTogglePulseDirection(activeSelectedCase.id, activeSelectedCase.pulseDirection);
                  }
                }}
                disabled={!activeSelectedCase}
                className="px-2.5 py-1 bg-slate-950 border border-slate-850 rounded hover:border-slate-700 text-amber-300 font-bold font-mono transition-colors text-[10px] uppercase cursor-pointer disabled:opacity-35"
              >
                {activeSelectedCase ? activeSelectedCase.pulseDirection : 'increasing'} ⇋
              </button>
            </div>

          </div>

          {/* Drill Sirens and Sector Sweeps Option */}
          <div className="pt-2 border-t border-slate-800/80 mt-1">
            <button
              id="drill-alarm-siren-trigger"
              onClick={onTriggerDrillAlarm}
              className="w-full py-3 bg-red-950 text-red-200 border-2 border-red-800/80 hover:bg-red-900 font-extrabold text-center cursor-pointer transition-all duration-200 uppercase tracking-widest text-[11px] rounded flex items-center justify-center gap-2 animate-pulse hover:animate-none"
              title="Dispatches global matchday drill sirens and red evacuation overlays"
            >
              <Radio className="w-4 h-4 text-red-400 animate-spin shrink-0" />
              <span>🚨 Trigger Matchday Drill Alarm</span>
            </button>
            <p className="text-[9px] text-slate-500 italic text-center mt-2 font-sans">
              *Instant siren activation, logs security alert checklists, and launches full simulation.
            </p>
          </div>

        </section>

      </div>

    </div>
  );
}
