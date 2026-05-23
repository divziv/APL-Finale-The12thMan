/**
 * @file PlatformMobileSimulator.tsx
 * @description Renders interactive Material-Design Android Guard and iOS Spectator simulations to demonstrate multi-platform mobile scalability.
 */

import React, { useState } from 'react';
import { TurnstileGate, CommandLog } from '../types';
import { Smartphone, Shield, Users, Radio, Compass, MapPin, QrCode, Sparkles, CheckCircle, Flame, Send } from 'lucide-react';

interface PlatformMobileSimulatorProps {
  gates: TurnstileGate[];
  logs: CommandLog[];
  onAddLog: (newLog: Omit<CommandLog, 'id' | 'timestamp'>) => void;
  selectedStadiumName: string;
}

export default function PlatformMobileSimulator({
  gates,
  logs,
  onAddLog,
  selectedStadiumName,
}: PlatformMobileSimulatorProps) {
  // Mobile UI choices: 'android_guard' | 'ios_spectator'
  const [deviceTarget, setDeviceTarget] = useState<'android_guard' | 'ios_spectator'>('android_guard');

  // Android state local
  const [guardIncidentMsg, setGuardIncidentMsg] = useState<string>('');
  const [selectedGateTarget, setSelectedGateTarget] = useState<string>('g4');
  const [scannerLive, setScannerLive] = useState<boolean>(false);
  const [scannedTicketsCount, setScannedTicketsCount] = useState<number>(45);

  // iOS State local
  const [userStand, setUserStand] = useState<string>('South Stand (Gate 4)');
  const [fanRouteActive, setFanRouteActive] = useState<boolean>(false);
  const [accessibilityRequired, setAccessibilityRequired] = useState<boolean>(false);

  /**
   * Dispatches incident from Android Guard device
   */
  const handleGuardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guardIncidentMsg.trim()) return;

    onAddLog({
      type: 'warning',
      source: 'SECURITY',
      message: `[MOBILE_GUARD_DEPLOYED] Gate ${selectedGateTarget.toUpperCase()}: ${guardIncidentMsg.toUpperCase()}`,
      resolved: false,
    });

    setGuardIncidentMsg('');
  };

  /**
   * Simulate barcode scanning
   */
  const triggerSimulatedScan = () => {
    setScannerLive(true);
    setTimeout(() => {
      setScannerLive(false);
      setScannedTicketsCount(prev => prev + 1);
      
      onAddLog({
        type: 'info',
        source: 'SYSTEM',
        message: `[MOBILE_TICKET_SCAN] Guard validated digital guest passes via Android handheld QR terminal. Total: ${scannedTicketsCount + 1}`,
        resolved: true,
      });
    }, 1800);
  };

  // Find least crowded gate to recommend on iOS companion
  const bestAlternativeGate = [...gates].sort((a, b) => a.flowRate - b.flowRate)[0] || gates[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-6" id="mobile-scalability-deck">
      
      {/* 1. Header with description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <Smartphone className="w-4.5 h-4.5 text-cyan-400 animate-bounce" />
            <span>Multi-Platform Scalability Sandbox</span>
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">ANDROID_SDK_EP_78 & iOS_SWIFTUI_V4 CONFIGURATIONS</p>
        </div>

        {/* Device Switcher Toggle */}
        <div className="flex bg-slate-950 p-1.5 rounded-lg border border-slate-850 font-mono text-[10px] self-start md:self-auto shrink-0">
          <button
            onClick={() => setDeviceTarget('android_guard')}
            className={`px-3 py-1.5 rounded-md font-bold tracking-wider uppercase transition-colors mr-1 cursor-pointer ${deviceTarget === 'android_guard' ? 'bg-emerald-500 text-slate-950 shadow-inner' : 'text-slate-400 hover:text-slate-200'}`}
          >
            📱 Android Guard App
          </button>
          
          <button
            onClick={() => setDeviceTarget('ios_spectator')}
            className={`px-3 py-1.5 rounded-md font-bold tracking-wider uppercase transition-colors cursor-pointer ${deviceTarget === 'ios_spectator' ? 'bg-cyan-500 text-slate-950 shadow-inner' : 'text-slate-400 hover:text-slate-200'}`}
          >
            🍏 iOS Fan Companion
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-450 leading-relaxed font-sans">
        Demonstrates the platform's API versatility. The identical backend state manages desktop command modules as well as mobile clients used by on-site crew (Android) and spectator apps (iOS).
      </p>

      {/* 2. Side-by-Side Emulator Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Side: Device Frame Emulator (7 cols) */}
        <div className="lg:col-span-7 flex justify-center bg-slate-950 p-6 rounded-xl border border-slate-850 relative min-h-[500px]">
          
          {/* Subtle phone hardware border representation */}
          <div className="w-[300px] bg-slate-900 rounded-[36px] border-4 border-slate-800 p-3 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Phone notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
              <span className="w-2.5 h-2.5 bg-black rounded-full block mr-1" />
              <span className="w-1.5 h-1.5 bg-slate-950 rounded-full block" />
            </div>

            {/* A: DEVICE RENDER - ANDROID GUARD VIEW */}
            {deviceTarget === 'android_guard' && (
              <div className="flex-1 flex flex-col justify-between pt-6 font-sans text-xs text-slate-350" id="guard-android-screen">
                
                {/* Header status */}
                <div className="flex items-center justify-between border-b border-emerald-900 pb-2.5 mb-3 bg-emerald-950/20 px-2.5 py-1.5 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-wider">GUARD UNIT #047</h4>
                      <p className="text-[8px] font-mono text-emerald-400 font-bold uppercase">LIVE ON SHIFT</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">98% Cell</span>
                </div>

                <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[300px] px-0.5">
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-850 font-mono text-[9px] flex flex-col gap-1">
                    <p className="text-slate-500 font-bold tracking-widest uppercase">Target Sector Status</p>
                    <div className="flex items-center justify-between text-slate-300 mt-1">
                      <span>{selectedStadiumName.split(' ')[0]} G.4:</span>
                      <span className="text-amber-400 font-bold">CONGESTED</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-350">
                      <span>Flow: <b>98 spects/m</b></span>
                      <span>Avg delay: <b>3.4s</b></span>
                    </div>
                  </div>

                  {/* Incident Field Direct Dispatch */}
                  <form onSubmit={handleGuardSubmit} className="bg-slate-950 p-2.5 rounded border border-slate-850 flex flex-col gap-2">
                    <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Quick Report Incident</span>
                    
                    <select
                      value={selectedGateTarget}
                      onChange={(e) => setSelectedGateTarget(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-[10px] text-slate-200 mt-1 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="g4">Gate 4 (South Stand)</option>
                      <option value="g1">Gate 1 (North Stand)</option>
                      <option value="g2">Gate 2 (East Pavilion)</option>
                      <option value="g5">Gate 5 (West Gate)</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Report queue delays, scanner crush..."
                      value={guardIncidentMsg}
                      onChange={(e) => setGuardIncidentMsg(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] text-slate-100 focus:ring-1 focus:ring-emerald-500"
                    />

                    <button
                      type="submit"
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[9.5px] rounded tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-1 uppercase"
                    >
                      <Send className="w-3 h-3 text-slate-950" />
                      <span>Transmit Alert</span>
                    </button>
                  </form>

                  {/* QR Ticket Validation terminal simulator */}
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-850 flex flex-col gap-2 relative">
                    <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Integrated Scanner Hub</span>
                    
                    {scannerLive ? (
                      <div className="bg-emerald-950/20 border border-dashed border-emerald-500 p-3 rounded text-center flex flex-col items-center justify-center h-20 animate-pulse">
                        <QrCode className="w-8 h-8 text-emerald-400" />
                        <span className="text-[9px] text-emerald-400 font-mono font-bold mt-1">CAMERA TERMINAL ENGAGING...</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={triggerSimulatedScan}
                        className="w-full py-2 border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-350 rounded text-[9.5px] font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-4 h-4 text-cyan-400" />
                        <span>Tap to Scan Ticket QR</span>
                      </button>
                    )}

                    <div className="flex items-center justify-between text-[8.5px] text-slate-500 mt-1 font-mono">
                      <span>Total Scans Today:</span>
                      <span className="text-slate-300 font-bold">{scannedTicketsCount} Passes</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-2 mb-1 flex items-center justify-center bg-slate-900 pb-2">
                  <span className="flex items-center gap-1 text-[8.5px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>SECURE CHANNELS SEC-VPN-G28</span>
                  </span>
                </div>

              </div>
            )}

            {/* B: DEVICE RENDER - IOS SPECTATOR VIEW */}
            {deviceTarget === 'ios_spectator' && (
              <div className="flex-1 flex flex-col justify-between pt-6 font-sans text-xs text-slate-350" id="fan-ios-screen">
                
                {/* Custom Cupertino Header */}
                <div className="flex items-center justify-between border-b border-cyan-900 pb-2.5 mb-3 bg-cyan-950/20 px-2.5 py-1.5 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-tight">STADIUM COMPANION</h4>
                      <p className="text-[8px] font-mono text-cyan-400 font-bold uppercase">Fan Assist Active</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">05:32 AM</span>
                </div>

                <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[300px] px-0.5">
                  
                  {/* Dynamic Walking times based on actual active gates statistics */}
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-850">
                    <div className="flex items-center gap-1 text-slate-450 font-mono text-[8px] uppercase tracking-wide">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Smart Routing Engine</span>
                    </div>

                    <h5 className="font-extrabold text-white text-[11px] mt-1.5">Stand: {userStand}</h5>
                    
                    <div className="bg-slate-900 border border-slate-850 p-2 rounded mt-2 text-[9.5px] flex flex-col gap-1 font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Standard Pathway Entry:</span>
                        <span className="text-red-400 font-bold">{bestAlternativeGate.id === 'g4' ? '28 Min line' : "Redirect suggested"}</span>
                      </div>

                      {/* Recommend the optimal speed alternative gate */}
                      <div className="flex items-center justify-between border-t border-slate-800 pt-1 mt-1 font-sans">
                        <span className="text-slate-400 font-mono text-[8.5px]">OPTIMAL ROUTE SUGGESTION:</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                          {bestAlternativeGate.name.split(' ')[0]} G.{bestAlternativeGate.id.toUpperCase()} (2 min)
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFanRouteActive(!fanRouteActive)}
                      className={`w-full mt-2 py-1.5 rounded font-bold text-[9.5px] transition-colors cursor-pointer ${fanRouteActive ? 'bg-cyan-950 border border-cyan-500 text-cyan-300' : 'bg-cyan-500 text-slate-950'}`}
                    >
                      {fanRouteActive ? '🛑 CANCEL NAVIGATION DIRECTIVES' : '🗺️ DEPLOY ACCESS-AWARE STEPS'}
                    </button>
                  </div>

                  {/* Active navigation steps showcase */}
                  {fanRouteActive && (
                    <div className="bg-slate-950 p-2 border border-cyan-800 rounded font-mono text-[8.5px] text-cyan-200 flex flex-col gap-1 animate-fadeIn">
                      <div className="flex items-start gap-1.5">
                        <span className="shrink-0 font-bold text-cyan-400">[1]</span>
                        <span>Walk past concession counter east towards Standby Gate {bestAlternativeGate.id.toUpperCase()}.</span>
                      </div>
                      <div className="flex items-start gap-1.5 border-t border-slate-900 pt-1">
                        <span className="shrink-0 font-bold text-cyan-400">[2]</span>
                        <span>Present digital pass barcode at the automated contactless reader.</span>
                      </div>
                    </div>
                  )}

                  {/* Digital Pass Widget */}
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-slate-500 font-mono font-bold uppercase tracking-wider block">Seat Sector Block</span>
                      <span className="text-slate-200 font-extrabold text-[12px] block">LEVEL 3 - BAY C</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Ind. vs Aus • Match pass</span>
                    </div>

                    <div className="bg-white p-1.5 rounded shadow-lg">
                      {/* Interactive mock QR */}
                      <QrCode className="w-10 h-10 text-slate-950" />
                    </div>
                  </div>

                </div>

                <div className="border-t border-slate-805 pt-2 mb-1 flex items-center justify-between px-2 font-mono text-[8px] text-slate-500 bg-slate-900 py-1 rounded">
                  <span>Accessibility assist: {accessibilityRequired ? "ENABLED" : "OFF"}</span>
                  <button
                    type="button"
                    onClick={() => setAccessibilityRequired(!accessibilityRequired)}
                    className="text-cyan-400 hover:underline font-bold"
                  >
                    TOGGLE_A11Y
                  </button>
                </div>

              </div>
            )}

            {/* Subtle Home Slider Indicator standard on iOS and Android gestures */}
            <div className="w-1/3 h-1 bg-slate-700 mx-auto rounded-full mt-3 shrink-0" />
          </div>

        </div>

        {/* Right Side: Features List & Live Interaction Logs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
            <span className="text-[10px] font-bold text-slate-405 font-mono uppercase tracking-widest block mb-2">Sandbox Instructions</span>
            <div className="flex flex-col gap-3 font-sans text-xs">
              <p className="text-slate-400 leading-normal">
                Click toggles at the top-right to switch between <b>Android Guard</b> and <b>iOS Spectator</b> modes.
              </p>
              
              <div className="border-t border-slate-850 pt-2 flex flex-col gap-2 font-mono text-[10px]">
                <div className="flex items-start gap-1.5 text-emerald-400">
                  <span className="font-bold">✓</span>
                  <span>Dispatch a mobile warning on the Android form to see it stream live into the main tactical response board in real-time.</span>
                </div>
                
                <div className="flex items-start gap-1.5 text-cyan-400 mt-1">
                  <span className="font-bold">✓</span>
                  <span>Simulate hand-held QR validation passes to raise scan counts for on-foot security teams.</span>
                </div>

                <div className="flex items-start gap-1.5 text-amber-405 mt-1">
                  <span className="font-bold">✓</span>
                  <span>Enable access-aware routing inside iOS spectator settings to recalculate steps immediately.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick system check to certify state connection */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest font-bold uppercase block mb-2 flex items-center justify-between">
              <span>Mobile-to-Hub Sync State</span>
              <span className="text-emerald-500 bg-emerald-950 border border-emerald-900 px-1 py-0.2 rounded font-extrabold text-[8px] tracking-normal animate-pulse">VPN_ESTABLISHED</span>
            </span>

            {/* List some related logs */}
            <div className="flex flex-col gap-2 font-mono text-[9px] max-h-[140px] overflow-y-auto">
              {logs.slice(0, 3).map((l, i) => (
                <div key={i} className="flex items-start gap-1.5 bg-slate-900 p-1.5 rounded border border-slate-850 text-slate-400 leading-normal">
                  <span className="font-bold text-slate-500">[{l.timestamp}]</span>
                  <span className="text-slate-350">{l.message}</span>
                </div>
              ))}
              {logs.length === 0 && (
                <span className="text-center text-slate-600 block py-4 bg-slate-900 border border-dashed border-slate-850 rounded">No mobile log files cached.</span>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
