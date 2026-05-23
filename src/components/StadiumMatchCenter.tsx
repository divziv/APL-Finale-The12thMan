/**
 * @file StadiumMatchCenter.tsx
 * @description Immersive Match Center card displaying live cricket scores, batting stats, and enabling stadium preset switching.
 */

import React from 'react';
import { StadiumData } from '../types';
import { Trophy, Compass, MapPin, Users, Flame, ChevronRight, Activity, TrendingUp, Volume2 } from 'lucide-react';

interface StadiumMatchCenterProps {
  stadiums: StadiumData[];
  activeStadium: StadiumData;
  onStadiumChange: (stadiumId: string) => void;
}

export default function StadiumMatchCenter({
  stadiums,
  activeStadium,
  onStadiumChange,
}: StadiumMatchCenterProps) {
  const { match, capacity, gates } = activeStadium;
  
  // Calculate total active occupancy dynamically from actual gates state
  const liveOccupancy = gates.reduce((acc, g) => acc + g.occupancy, 0);
  const fillPercentage = Math.round((liveOccupancy / capacity) * 100);

  // Translate traffic index colors
  const getTrafficColor = (index: StadiumData['trafficIndex']) => {
    switch (index) {
      case 'OPTIMAL': return 'text-emerald-400 bg-emerald-950/70 border-emerald-800';
      case 'MODERATE': return 'text-amber-400 bg-amber-950/70 border-amber-800';
      case 'HEAVY': return 'text-rose-450 bg-rose-955/70 border-rose-800 animate-pulse';
      case 'CONGESTED': return 'text-red-400 bg-red-950/70 border-red-900 animate-pulse';
      case 'CRITICAL': return 'text-purple-400 bg-purple-950/70 border-purple-900 animate-pulse';
      default: return 'text-slate-400 bg-slate-950/70 border-slate-800';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-5 relative overflow-hidden" id="match-center-container">
      {/* Background design glow */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-450">Match Day Operations Feed</span>
          </div>
          <h2 className="text-sm font-semibold tracking-wider text-slate-300 uppercase mt-1">
            Stadium Commander & Live Scoreboard
          </h2>
        </div>

        {/* Stadium Fast Selector Switcher */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <label htmlFor="stadium-selector-dropdown" className="text-slate-400 font-bold shrink-0">Command Sector:</label>
          <select
            id="stadium-selector-dropdown"
            value={activeStadium.id}
            onChange={(e) => onStadiumChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-100 font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer text-xs"
            aria-label="Switch active cricket stadium operations"
          >
            {stadiums.map((s) => (
              <option key={s.id} value={s.id}>
                🏏 {s.name} ({s.location.split(',')[0]})
              </option>
          </select>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const msg = new SpeechSynthesisUtterance(`Welcome to ${activeStadium.name}. We are currently at ${fillPercentage} percent capacity. The match is ${match.battingTeam} versus ${match.bowlingTeam}. Score is ${match.score}.`);
                msg.rate = 0.95;
                window.speechSynthesis.speak(msg);
              }
            }}
            className="bg-cyan-950 border border-cyan-800 rounded p-1.5 text-cyan-400 hover:bg-cyan-900 transition-colors cursor-pointer"
            title="Read Stadium Info Aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Box: Selected Ground Details (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950/40 border border-slate-850 p-4 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase font-semibold">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Telemetry Coordinates</span>
            </div>
            
            <h3 className="text-base font-extrabold text-white font-sans mt-2 tracking-tight">
              {activeStadium.name}
            </h3>
            
            <p className="text-xs text-slate-450 flex items-center gap-1.5 mt-1 font-sans">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{activeStadium.location}</span>
            </p>

            {/* Stadium Fill Capacity Progress Bar */}
            <div className="mt-5 bg-slate-950 p-3 rounded border border-slate-850/60 font-mono">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-slate-400 uppercase font-semibold">Gate Entry Attendance</span>
                <span className="text-cyan-400 font-bold">{fillPercentage}% Registered</span>
              </div>
              
              <div className="h-2.5 w-full bg-slate-900 border border-slate-800 rounded overflow-hidden">
                <div
                  style={{ width: `${fillPercentage}%` }}
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded transition-all duration-700 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                ></div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                <span>Checked-in: <b className="text-slate-300 font-bold">{liveOccupancy.toLocaleString()}</b></span>
                <span>Max Capacity: <b className="text-slate-300 font-bold">{capacity.toLocaleString()}</b></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-950 p-2.5 rounded border border-slate-850 text-center font-mono">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Average Scan</span>
              <span className="text-sm font-bold text-teal-400">{activeStadium.averageScanSpeed}s</span>
            </div>
            
            <div className={`p-2.5 rounded border text-center font-mono flex flex-col justify-center ${getTrafficColor(activeStadium.trafficIndex)}`}>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Outflow Density</span>
              <span className="text-xs font-bold uppercase tracking-wider">{activeStadium.trafficIndex}</span>
            </div>
          </div>
        </div>

        {/* Right Box: Cricket Match Live Scoreboard (7 cols) */}
        <div className="lg:col-span-7 bg-indigo-950/20 border border-indigo-900/40 p-4 rounded-lg flex flex-col relative" id="scoreboard-sub-container">
          <div className="absolute right-3 top-3 flex items-center gap-1.5 text-[9px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full animate-pulse">
            <Flame className="w-3 h-3 text-amber-500" />
            <span>LIVE COMM EVENT</span>
          </div>

          <p className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            Match Center Display
          </p>

          {/* Actual match scorecard figures */}
          <div className="flex items-baseline justify-between mt-3 font-sans pb-3 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <span className="bg-slate-900/90 text-sm font-extrabold text-white border border-slate-800 px-2.5 py-1 rounded">
                {match.battingTeam}
              </span>
              <span className="text-slate-450 text-xs">vs</span>
              <span className="bg-slate-950/65 text-sm font-medium text-slate-400 border border-slate-900 px-2 py-0.5 rounded">
                {match.bowlingTeam}
              </span>
            </div>

            <div className="text-right flex flex-col">
              <span className="text-2xl font-black text-rose-450 font-mono tracking-tight text-white">
                {match.score}
              </span>
              <span className="text-[10px] font-mono text-slate-450 mt-0.5">
                OVERS: <b className="text-slate-350">{match.overs}</b>
              </span>
            </div>
          </div>

          {/* Batsmen & Bowler Mini Live Stats Layout */}
          <div className="grid grid-cols-2 gap-4 mt-3 flex-1 font-mono text-[10px]">
            {/* Batsmen side */}
            <div className="flex flex-col gap-1 text-slate-400 border-r border-slate-800/80 pr-2">
              <span className="text-slate-550 uppercase tracking-wider font-extrabold text-[8px] pb-1 border-b border-slate-850/60 block">BATTERS ON STRIKE</span>
              <div className="flex items-center justify-between mt-1 text-slate-200">
                <span className="font-semibold truncate max-w-[95px]">🏏 {match.batsman1.name}</span>
                <span className="font-bold text-white">{match.batsman1.runs}* <span className="text-[9px] text-slate-500">({match.batsman1.balls})</span></span>
              </div>
              <div className="flex items-center justify-between text-slate-350 mt-1">
                <span className="truncate max-w-[95px] pl-3">{match.batsman2.name}</span>
                <span>{match.batsman2.runs} <span className="text-[9px] text-slate-500">({match.batsman2.balls})</span></span>
              </div>
            </div>

            {/* Bowler & recent balls */}
            <div className="flex flex-col gap-1 text-slate-400 pl-1">
              <span className="text-slate-555 uppercase tracking-wider font-extrabold text-[8px] pb-1 border-b border-slate-850/60 block">ACTIVE BOWLER</span>
              <div className="flex items-center justify-between mt-1 text-slate-200">
                <span className="font-semibold truncate max-w-[95px]">⚾ {match.bowler.name}</span>
                <span className="font-bold text-white">{match.bowler.wickets}/{match.bowler.runs}</span>
              </div>
              <div className="text-[9px] text-slate-500 mt-1.5 flex items-center justify-between">
                <span>RECENT OVERS:</span>
                <div className="flex gap-1">
                  {match.recentBalls.map((b, i) => (
                    <span
                      key={i}
                      className={`px-1.5 py-0.2 rounded-sm text-[8px] font-bold ${
                        b === 'W' ? 'bg-red-950 border border-red-800 text-red-300' :
                        b === '6' || b === '4' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' :
                        'bg-slate-950 border border-slate-850 text-slate-400'
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Game Context bottom ticker */}
          <div className="mt-4 pt-2.5 border-t border-slate-800/80 text-[10px] font-mono text-cyan-300 bg-slate-950/65 px-3 py-2 rounded border border-slate-850 flex items-center justify-between">
            <span className="flex items-center gap-1.5 truncate max-w-[80%]">
              <Activity className="w-3.5 h-3.5 animate-pulse text-amber-400 shrink-0" />
              <span>{match.matchStatus}</span>
            </span>
            <span className="text-slate-500 shrink-0 font-bold">{match.runsNeeded ? "TARGET: " + match.target : "PLAYING"}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
