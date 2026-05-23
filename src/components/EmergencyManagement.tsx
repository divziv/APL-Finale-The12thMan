/**
 * @file EmergencyManagement.tsx
 * @description Advanced security incident reporting, global alert broadcasting, and synthesize-sound warning board.
 */

import React, { useState, useEffect } from 'react';
import { EmergencyPlan, CommandLog, TurnstileGate } from '../types';
import { EMERGENCY_PLANS } from '../data/seedData';
import { ShieldAlert, Send, Radio, Megaphone, CheckSquare, RefreshCw, Volume2, Users, Cpu, ShieldCheck, Activity } from 'lucide-react';

interface EmergencyManagementProps {
  onAddIncidentLog: (log: Omit<CommandLog, 'id' | 'timestamp'>) => void;
  onDispatchGlobalBroadcast: (alertText: string | null) => void;
  activeBroadcastText: string | null;
  speakEnabled: boolean;
  speakText: (text: string) => void;
  onDispatchProceduralPlan: (planId: string) => void;
  // Automated responses automation states
  gates: TurnstileGate[];
  autoPilotActive: boolean;
  setAutoPilotActive: (active: boolean) => void;
  congestionThreshold: number;
  setCongestionThreshold: (sec: number) => void;
  automatedLogs: string[];
}

export default function EmergencyManagement({
  onAddIncidentLog,
  onDispatchGlobalBroadcast,
  activeBroadcastText,
  speakEnabled,
  speakText,
  onDispatchProceduralPlan,
  gates,
  autoPilotActive,
  setAutoPilotActive,
  congestionThreshold,
  setCongestionThreshold,
  automatedLogs,
}: EmergencyManagementProps) {

  // Local state for the custom incident builder form
  const [reportSector, setReportSector] = useState<string>('g4');
  const [reportSeverity, setReportSeverity] = useState<'info' | 'warning' | 'critical'>('warning');
  const [reportMessage, setReportMessage] = useState<string>('');

  // Local state for the broadcast builder
  const [customBroadcast, setCustomBroadcast] = useState<string>('TICKET SCANNERS: COMMENCE ONE-TOUCH SWIPES FOR MATCH LAUNCH CONGESTION');

  // Local state for the active plan dashboard
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_weather');

  // Sound sirens trigger using native AudioContext (no external mp3 file issues)
  const [sirenPlaying, setSirenPlaying] = useState<boolean>(false);
  const [sirenIntervalId, setSirenIntervalId] = useState<any>(null);

  /**
   * Sound effect synthesiser: creates a retro periodic alarm beep using Web Audio API!
   */
  const playSirenBeep = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      // Dual tone sweep representation of a rapid siren
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(580, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn("AudioContext failed to start due to browser interactions restrictions:", e);
    }
  };

  // Toggle siren repetitive beeper loop
  const handleToggleSiren = () => {
    if (sirenPlaying) {
      if (sirenIntervalId) clearInterval(sirenIntervalId);
      setSirenIntervalId(null);
      setSirenPlaying(false);
    } else {
      setSirenPlaying(true);
      playSirenBeep();
      const interval = setInterval(() => {
        playSirenBeep();
      }, 800);
      setSirenIntervalId(interval);
    }
  };

  useEffect(() => {
    return () => {
      if (sirenIntervalId) clearInterval(sirenIntervalId);
    };
  }, [sirenIntervalId]);

  /**
   * Handles user custom incident submission.
   */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportMessage.trim()) return;

    // Dispatch incident
    onAddIncidentLog({
      type: reportSeverity,
      source: 'SECURITY',
      message: `[SECTOR FOCUS: ${reportSector.toUpperCase()}] ${reportMessage.toUpperCase()}`,
      resolved: false,
    });

    // Speak alert if DEI synthesizer is optimized
    if (speakEnabled) {
      speakText(`Alert: ${reportSeverity} incident reported at sector ${reportSector.toUpperCase()}. ${reportMessage}`);
    }

    // Reset message
    setReportMessage('');
  };

  /**
   * Handles procedural dispatch trigger.
   */
  const triggerProceduralPlan = (plan: EmergencyPlan) => {
    onDispatchProceduralPlan(plan.id);

    // Speak plan deployment
    if (speakEnabled) {
      speakText(`Enforcing system-wide tactical procedure: ${plan.title}. Setting access points configuration.`);
    }
  };

  // Safe fetch selected draft
  const activePlanDraft = EMERGENCY_PLANS.find(p => p.id === selectedPlanId) || EMERGENCY_PLANS[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-6" id="emergency-operations-deck">
      
      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          <span>Incident Command & Fast Mobilization Board</span>
        </h2>
        <p className="text-xs text-slate-500 font-mono mt-0.5">CRIT_INCIDENT_STREAM: REDIRECT_READY</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. Log Custom Incident Form */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-855 flex flex-col gap-3">
          <h3 className="text-xs font-bold font-mono text-slate-200 uppercase flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>Fast Incident Dispatch Node</span>
          </h3>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="report-sector" className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Target Gate/Area</label>
              <select
                id="report-sector"
                value={reportSector}
                onChange={(e) => setReportSector(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="g1">Gate 1 (North Stand)</option>
                <option value="g2">Gate 2 (East Concourse)</option>
                <option value="g3">Gate 3 (VIP & Media)</option>
                <option value="g4">Gate 4 (South Stand)</option>
                <option value="g5">Gate 5 (West Concourse)</option>
                <option value="g6">Gate 6 (South-East Deck)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="report-severity" className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Severity Level</label>
                <select
                  id="report-severity"
                  value={reportSeverity}
                  onChange={(e) => setReportSeverity(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="info">Info / Low</option>
                  <option value="warning">Warning / Mid</option>
                  <option value="critical">Critical / High</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Audio Beacon</label>
                <button
                  type="button"
                  id="btn-toggle-beacon"
                  onClick={handleToggleSiren}
                  className={`w-full text-xs font-mono py-1.5 px-2 rounded border flex items-center justify-center gap-1.5 cursor-pointer ${sirenPlaying ? 'bg-red-950 border-red-500 text-red-300 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{sirenPlaying ? '🚨 BEACON_ON' : '🔇 MOCK_SOUND'}</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="report-message" className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Symptom Description</label>
              <input
                id="report-message"
                type="text"
                placeholder="Ex. Queue backing up past shuttle lane..."
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <button
              id="btn-submit-incident"
              type="submit"
              className="mt-2 w-full py-2 bg-gradient-to-r from-red-650 to-red-600 hover:from-red-600 hover:to-red-500 active:scale-98 text-white font-bold text-xs rounded shadow-lg transition-transform cursor-pointer"
            >
              BROADCAST WARNING INCIDENT
            </button>
          </form>
        </div>

        {/* 2. Global PA Address and Broadcast Trigger */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-855 flex flex-col gap-3">
          <h3 className="text-xs font-bold font-mono text-slate-200 uppercase flex items-center gap-1.5">
            <Megaphone className="w-4 h-4 text-cyan-400" />
            <span>Emergency PA Marquee Broadcaster</span>
          </h3>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
              Dispatch dynamic ticker alerts that render as high-visibility emergency bands across the stadium's operator board.
            </p>

            <textarea
              id="txt-broadcast"
              rows={2}
              value={customBroadcast}
              onChange={(e) => setCustomBroadcast(e.target.value)}
              placeholder="Type urgent public or staff ticker here..."
              className="mt-1 w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:ring-1 focus:ring-cyan-500 font-sans"
            />

            <div className="flex gap-2 mt-1">
              <button
                id="btn-deploy-broadcast"
                onClick={() => onDispatchGlobalBroadcast(customBroadcast)}
                className="flex-1 py-1.5 bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 font-mono text-[10px] rounded transition-all cursor-pointer text-center"
              >
                📡 LAUNCH PA BANNER
              </button>
              {activeBroadcastText && (
                <button
                  id="btn-clear-broadcast"
                  onClick={() => onDispatchGlobalBroadcast(null)}
                  className="px-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 font-mono text-[10px] rounded transition-all cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-slate-850 pt-2.5 mt-auto">
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Active State Ticker:</p>
            <div className="mt-1 bg-slate-900 p-1.5 rounded text-[10px] font-mono border border-slate-850 text-slate-300 truncate">
              {activeBroadcastText ? (
                <span className="text-amber-400 font-bold animate-pulse">📢 ACTIVE: "{activeBroadcastText}"</span>
              ) : (
                <span className="text-slate-500">SYSTEM CLEAR: No active broadcast banners.</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 3. Preset Tactical Evacuation Draft plans checklist */}
      <div className="bg-slate-950/20 p-4 rounded-xl border border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold font-mono text-slate-200 uppercase">Preset Tactical Operation Plans</h3>
          </div>

          <select
            id="plan-selector"
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded text-xs focus:ring-1 focus:ring-cyan-500 font-mono"
          >
            {EMERGENCY_PLANS.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        {/* Selected Plan Details layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950/40 p-4 rounded-lg border border-slate-800/60 font-mono">
          <div className="md:col-span-5 flex flex-col gap-2 font-sans">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">{activePlanDraft.title}</span>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase border ${activePlanDraft.severity === 'high' ? 'text-red-400 bg-red-950/60 border-red-900' : 'text-amber-400 bg-amber-950/60 border-amber-900'}`}>
                {activePlanDraft.severity.toUpperCase()} ALERT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 pb-2 leading-relaxed">{activePlanDraft.description}</p>

            <button
              id={`btn-enforce-plan-${activePlanDraft.id}`}
              onClick={() => triggerProceduralPlan(activePlanDraft)}
              className="mt-auto py-2 bg-gradient-to-r from-red-800 to-red-950 hover:from-red-700 hover:to-slate-900 hover:text-white border border-red-500/55 text-red-100 font-bold text-xs rounded tracking-widest transition-transform duration-200 uppercase cursor-pointer"
            >
              DEPLOY PROCEDURALS NOW
            </button>
          </div>

          {/* Plan checklist steps list */}
          <div className="md:col-span-7 flex flex-col gap-2.5 text-[11px] font-mono border-l border-slate-800 md:pl-5">
            <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider mb-1 flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Execution Checklist sequences:</span>
            </span>
            {activePlanDraft.steps.map((st, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-slate-950/80 p-2 rounded border border-slate-900">
                <span className="shrink-0 w-5 h-5 rounded-full bg-slate-900 text-cyan-400 font-bold border border-slate-800 flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span className="text-slate-300 leading-relaxed pt-0.5">{st}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Automated Emergency Autononics Control Center */}
      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-805" id="autonomic-response-deck">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-850 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1 px-1.5 bg-rose-955 border border-rose-800 text-rose-400 rounded flex items-center justify-center animate-pulse">
              <Cpu className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold font-mono text-slate-205 uppercase tracking-wide flex items-center gap-1.5">
                <span>Autonomic Security Sentinel AI Core</span>
                <span className="font-light text-[8px] tracking-normal text-slate-500 font-mono">Ver 4.0.1</span>
              </h3>
              <p className="text-[10px] text-slate-450 font-mono">AUTOMATED_ALGORITHM_STATE: {autoPilotActive ? '🟩 ON_PATROL' : '🟥 OFF_LINE'}</p>
            </div>
          </div>

          {/* Autononics Core Switch Toggle */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 font-mono text-[10px] items-center shrink-0">
            <span className="px-2 text-slate-500 font-bold uppercase text-[9px] mr-1">Autopilot:</span>
            <button
              type="button"
              onClick={() => {
                setAutoPilotActive(true);
                if (speakEnabled) speakText("VIRTUAL SECURITY AUTOPILOT DEPLOYED. STANDBY TO AUTONOMICALLY ROUTE INCIDENTS AND CONGESTIONS.");
              }}
              className={`px-3 py-1 rounded font-bold tracking-wider uppercase transition-colors mr-1 cursor-pointer ${autoPilotActive ? 'bg-rose-500 text-slate-95 w-16' : 'text-slate-450 hover:text-slate-200'}`}
            >
              ENABLE
            </button>
            <button
              type="button"
              onClick={() => {
                setAutoPilotActive(false);
                if (speakEnabled) speakText("SECURITY AUTOPILOT OFFLINE. PASSING MANUAL COMMAND CONTROLS TO HUMAN DISPATCHER.");
              }}
              className={`px-3 py-1 rounded font-bold tracking-wider uppercase transition-colors cursor-pointer ${!autoPilotActive ? 'bg-slate-700 text-slate-200 w-16' : 'text-slate-450 hover:text-slate-200'}`}
            >
              DISABLE
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs">
          
          {/* Rule Card 1: Gate Queue auto redirect rule */}
          <div className={`p-3 rounded-lg border transition-all ${autoPilotActive ? 'bg-slate-900 border-rose-900/60' : 'bg-slate-900/40 border-slate-850'}`}>
            <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-2">
              <span className="font-extrabold text-rose-450 text-[10px] uppercase">Rule #1: Flow Bottleneck Redirection</span>
              <Activity className={`w-3.5 h-3.5 ${autoPilotActive ? 'text-rose-400 animate-pulse' : 'text-slate-600'}`} />
            </div>
            
            <p className="text-[10px] text-slate-400 leading-normal mb-3 font-sans">
              Monitors average check-in latency. If a gate's validation queue latency exceeds the specified threshold, automatically redirect incoming fans to the least loaded alternative gate.
            </p>

            <div className="flex flex-col gap-1.5 p-2 bg-slate-950 rounded border border-slate-850">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-slate-400">Trigger Threshold:</span>
                <span className="text-cyan-400 font-extrabold">{congestionThreshold} seconds</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="5.0"
                step="0.5"
                value={congestionThreshold}
                onChange={(e) => setCongestionThreshold(Number(e.target.value))}
                className="w-full text-cyan-400 accent-rose-550 bg-slate-900 cursor-pointer"
                disabled={!autoPilotActive}
              />
            </div>

            <div className="mt-2.5 flex justify-between items-center text-[9px] text-slate-500">
              <span>CRITERIA EVALUATION:</span>
              <span className={autoPilotActive ? 'text-emerald-400' : 'text-slate-400'}>
                {autoPilotActive ? '● MONITORING_LIVE' : 'IDLE'}
              </span>
            </div>
          </div>

          {/* Rule Card 2: AI CCTV Threat Lock */}
          <div className={`p-3 rounded-lg border transition-all ${autoPilotActive ? 'bg-slate-950/60 border-rose-900/60' : 'bg-slate-900/40 border-slate-850'}`}>
            <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-2">
              <span className="font-extrabold text-rose-450 text-[10px] uppercase">Rule #2: CV Camera Threat Auto-Isolation</span>
              <ShieldCheck className={`w-3.5 h-3.5 ${autoPilotActive ? 'text-emerald-400 animate-bounce' : 'text-slate-600'}`} />
            </div>
            
            <p className="text-[10px] text-slate-400 leading-normal mb-3 font-sans">
              If computer vision analytics flag a high-density crowd anomaly or unauthorized zone intrusion, automatically dispatch tactical guards and raise audio beacons instantly.
            </p>

            <div className="bg-slate-900 p-2 rounded border border-slate-850 text-[9.5px] leading-relaxed text-slate-350">
              <div className="flex justify-between items-center text-[8.5px] text-slate-500 mb-1">
                <span>DETECTOR TARGET:</span>
                <span className="text-rose-400">CAM_AI_SURGE_90_PCT</span>
              </div>
              <span>AUTO ACTIONS: Alert dispatcher, synthesize dual-tone alarm, lock downstream turnstiles.</span>
            </div>

            <div className="mt-2.5 flex justify-between items-center text-[9px] text-slate-500">
              <span>SCANNER HARNESS:</span>
              <span className={autoPilotActive ? 'text-emerald-400' : 'text-slate-400'}>
                {autoPilotActive ? '● HEARTBEAT_OK_20ms' : 'PAUSED'}
              </span>
            </div>
          </div>

          {/* Autonomic logs feed */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col justify-between">
            <div>
              <span className="text-[9.5px] font-bold text-slate-450 uppercase block border-b border-slate-900 pb-1.5 mb-2">
                Autopilot Dispatch Audit Log
              </span>
              
              <div className="flex flex-col gap-1.5 max-h-[110px] overflow-y-auto pr-1">
                {automatedLogs.map((lg, idx) => (
                  <div key={idx} className="text-[9px] leading-normal bg-rose-950/20 border border-rose-950 text-rose-305 p-1.5 rounded font-mono">
                    {lg}
                  </div>
                ))}
                {automatedLogs.length === 0 && (
                  <span className="text-[9px] text-slate-600 text-center block py-6 bg-slate-900/40 border border-dashed border-slate-850 rounded">
                    {autoPilotActive ? 'Rule evaluation silent... No incidents require autonomic overrides currently' : 'Autopilot is offline. Enable to trigger automated safety routines.'}
                  </span>
                )}
              </div>
            </div>

            <span className="text-[8px] text-slate-500 text-right mt-2 font-mono">
              ENGINE_STATE: SYNC_256_BIT_AES
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
