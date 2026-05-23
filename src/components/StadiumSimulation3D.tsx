/**
 * @file StadiumSimulation3D.tsx
 * @description Immersive 2.5D/Particle crowd simulator using HTML5 Canvas to model flows, queue bottlenecks, and dynamic reroutings.
 */

import React, { useRef, useEffect, useState } from 'react';
import { TurnstileGate } from '../types';
import { Play, Pause, ChevronRight, Zap, RefreshCw, Layers } from 'lucide-react';

interface StadiumSimulation3DProps {
  gates: TurnstileGate[];
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  color: string;
  gateId: string;
  size: number;
  state: 'arriving' | 'scanning' | 'passed';
  scanTimer: number;
  currentPathIndex: number;
}

export default function StadiumSimulation3D({ gates }: StadiumSimulation3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation controls state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [spawnSpeed, setSpawnSpeed] = useState<'low' | 'normal' | 'rush'>('normal');
  const [simHeatmap, setSimHeatmap] = useState<boolean>(true);
  const [blockedGateId, setBlockedGateId] = useState<string | null>('g4');

  // Local particles list
  const particlesRef = useRef<Particle[]>([]);

  // Dimensions
  const mapCenter = { x: 250, y: 220 };
  const stadiumRadius = 140;

  // Spawning coordinates outside
  const spawnPoints = [
    { x: 250, y: 460, gateId: 'g4' }, // South
    { x: 250, y: 30, gateId: 'g1' },  // North
    { x: 440, y: 170, gateId: 'g2' }, // East
    { x: 440, y: 300, gateId: 'g3' }, // East VIP
    { x: 60, y: 300, gateId: 'g5' },  // West
    { x: 60, y: 170, gateId: 'g6' },  // West SE
  ];

  /**
   * Helper to derive gate coordinate positions matching our map layout.
   */
  const getGatePos = (id: string) => {
    switch (id) {
      case 'g1': return { x: 250, y: 70 };
      case 'g2': return { x: 410, y: 170 };
      case 'g3': return { x: 410, y: 300 };
      case 'g4': return { x: 250, y: 410 };
      case 'g5': return { x: 90, y: 300 };
      case 'g6': return { x: 90, y: 170 };
      default: return { x: 250, y: 220 };
    }
  };

  /**
   * Reset simulation particles.
   */
  const handleResetSim = () => {
    particlesRef.current = [];
  };

  /**
   * Spawn speed ticker
   */
  const getSpawnChance = () => {
    switch (spawnSpeed) {
      case 'low': return 0.04;
      case 'normal': return 0.12;
      case 'rush': return 0.32;
    }
  };

  // Safe game loop run
  useEffect(() => {
    if (!isPlaying) return;

    let animFrame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tick = () => {
      // 1. Spawning spectator particles from random spawns
      if (Math.random() < getSpawnChance()) {
        const randomSpawn = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
        
        // Handle blocked gate deflection rules
        let assignedGateId = randomSpawn.gateId;
        if (assignedGateId === blockedGateId) {
          // Divert to alternative gate (Gate 6 or nearest)
          assignedGateId = blockedGateId === 'g4' ? 'g6' : 'g1';
        }

        const gatePos = getGatePos(assignedGateId);
        
        particlesRef.current.push({
          x: randomSpawn.x + (Math.random() * 16 - 8),
          y: randomSpawn.y + (Math.random() * 16 - 8),
          targetX: gatePos.x,
          targetY: gatePos.y,
          speed: 1.1 + Math.random() * 0.9,
          color: randomSpawn.gateId === 'g4' ? '#67e8f9' : '#06b6d4',
          gateId: assignedGateId,
          size: 3 + Math.random() * 2,
          state: 'arriving',
          scanTimer: 0,
          currentPathIndex: 0,
        });
      }

      // 2. Clear canvas
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 500, 480);

      // Draw grid backing
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 500; i += 25) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 480);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(500, i);
        ctx.stroke();
      }

      // Draw Stadium Boundary
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(mapCenter.x, mapCenter.y, stadiumRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Stadium Inner Ring (concourse)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(mapCenter.x, mapCenter.y, stadiumRadius - 38, 0, Math.PI * 2);
      ctx.stroke();

      // Pitch Center Green
      ctx.fillStyle = '#14532d';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(mapCenter.x, mapCenter.y, 25, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 3. Draw Gate indicators
      gates.forEach(g => {
        const coords = getGatePos(g.id);
        const isBlocked = g.id === blockedGateId;
        
        // Ring
        ctx.fillStyle = isBlocked ? '#be123c' : '#020617';
        ctx.strokeStyle = isBlocked ? '#ef4444' : '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner status dot
        ctx.fillStyle = isBlocked ? '#ef4444' : g.status === 'optimal' ? '#10b981' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(g.name.split(' ')[0], coords.x, coords.y - 15);
      });

      // 4. Heatmap Glow Pass (draw radial heat blooms if toggled)
      if (simHeatmap) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        // Find cluster patterns (ex. at blocked gate lines or active areas)
        const densityCounts: Record<string, number> = {};
        particlesRef.current.forEach(p => {
          const gridKey = `${Math.round(p.x / 40) * 40},${Math.round(p.y / 40) * 40}`;
          densityCounts[gridKey] = (densityCounts[gridKey] || 0) + 1;
        });

        Object.keys(densityCounts).forEach(key => {
          const [kx, ky] = key.split(',').map(Number);
          const count = densityCounts[key];
          if (count > 2) {
            const radGrad = ctx.createRadialGradient(kx, ky, 2, kx, ky, count * 7);
            radGrad.addColorStop(0, `rgba(239, 68, 68, ${Math.min(count * 0.08, 0.45)})`);
            radGrad.addColorStop(0.5, `rgba(245, 158, 11, ${Math.min(count * 0.04, 0.2)})`);
            radGrad.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = radGrad;
            ctx.beginPath();
            ctx.arc(kx, ky, count * 7, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.restore();
      }

      // 5. Update & draw particles
      particlesRef.current.forEach((p, idx) => {
        // State Machine
        if (p.state === 'arriving') {
          // Move towards designated Gate
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 12) {
            p.state = 'scanning';
          } else {
            p.x += (dx / dist) * p.speed;
            p.y += (dy / dist) * p.speed;
          }
        } else if (p.state === 'scanning') {
          // Stay standing at gate queue lines
          p.scanTimer += 1;
          
          // Scanning speeds relative to gate congestions
          const matchingGate = gates.find(g => g.id === p.gateId);
          const scanTimeThreshold = matchingGate ? matchingGate.scanSpeed * 22 : 35;

          if (p.scanTimer >= scanTimeThreshold) {
            p.state = 'passed';
            // Move inside stadium bowl concourse ring
            const angle = Math.random() * Math.PI * 2;
            p.targetX = mapCenter.x + (stadiumRadius - 55) * Math.cos(angle);
            p.targetY = mapCenter.y + (stadiumRadius - 50) * Math.sin(angle);
          }
        } else if (p.state === 'passed') {
          // Wander towards bowl
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 4) {
            p.x += (dx / dist) * (p.speed * 0.8);
            p.y += (dy / dist) * (p.speed * 0.8);
          }
        }

        // Color relative to current state
        let color = '#06b6d4'; // Cyan
        if (p.state === 'scanning') {
          color = '#f59e0b'; // Amber
        } else if (p.state === 'passed') {
          color = '#10b981'; // Green
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Filter out particles that have arrived inside and fully dispersed to conserve memory limits
      particlesRef.current = particlesRef.current.filter(p => {
        const dx = p.x - p.targetX;
        const dy = p.y - p.targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return !(p.state === 'passed' && dist <= 5);
      });

      // Continuous loop
      animFrame = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [isPlaying, spawnSpeed, simHeatmap, blockedGateId, gates]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-5 h-full" id="crowd-simulator-deck">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-cyan-400" />
            <span>Interactive Crowd Flow Simulator</span>
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">MATH_ENGINE: RUNNING (2.5D_RENDERER)</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[10px]">
          <button
            id="btn-play-pause-sim"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-2.5 py-1.5 border rounded flex items-center gap-1.5 transition-all text-xs font-semibold cursor-pointer ${isPlaying ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-850 text-slate-400'}`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSE_SIM</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>RESUME_SIM</span>
              </>
            )}
          </button>

          <button
            id="btn-reset-sim"
            onClick={handleResetSim}
            className="p-1.5 px-3 border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 transition-colors rounded hover:border-slate-700 cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Canvas visual columns */}
        <div className="xl:col-span-7 flex items-center justify-center bg-slate-950 border border-slate-850 rounded-xl overflow-hidden relative p-1">
          <canvas
            ref={canvasRef}
            width={500}
            height={480}
            className="w-full h-auto max-w-[450px] aspect-square rounded-lg"
          />

          {/* Glowing bottom tag */}
          <div className="absolute top-3 left-3 bg-slate-950/90 py-1 px-2.5 rounded border border-slate-800 font-mono text-[9px] text-slate-400 flex flex-col gap-0.5">
            <span className="text-cyan-400 font-bold">◉ SIMULATION LIVE CORE</span>
            <span>Occupants Waiting: {particlesRef.current.filter(p => p.state === 'arriving').length}</span>
            <span>Processing: {particlesRef.current.filter(p => p.state === 'scanning').length}</span>
          </div>
        </div>

        {/* Configurations column */}
        <div className="xl:col-span-5 flex flex-col gap-4 font-sans text-xs">
          
          {/* 1. Spawn Speed */}
          <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-855 flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Spectator Arrival Speed</label>
            <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
              <button
                id="sim-speed-low"
                onClick={() => setSpawnSpeed('low')}
                className={`py-1.5 rounded border text-center transition-all ${spawnSpeed === 'low' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-850 text-slate-400'}`}
              >
                SLOW
              </button>
              <button
                id="sim-speed-norm"
                onClick={() => setSpawnSpeed('normal')}
                className={`py-1.5 rounded border text-center transition-all ${spawnSpeed === 'normal' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-850 text-slate-400'}`}
              >
                NORMAL
              </button>
              <button
                id="sim-speed-rush"
                onClick={() => setSpawnSpeed('rush')}
                className={`py-1.5 rounded border text-center transition-all ${spawnSpeed === 'rush' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-851 text-slate-400'}`}
              >
                RUSH_FLOW
              </button>
            </div>
            <p className="text-[9px] text-slate-500 leading-normal">
              Changes the frequency of newly generated fan particles spawning on the outer plaza boundaries.
            </p>
          </div>

          {/* 2. Manual Block Trigger */}
          <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850 flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Simulation Reader crash (Blocked Gate)</label>
            <select
              id="block-gate-select"
              value={blockedGateId || 'none'}
              onChange={(e) => setBlockedGateId(e.target.value === 'none' ? null : e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 p-2 rounded text-xs focus:ring-1 focus:ring-cyan-500 font-mono"
            >
              <option value="none">◉ No Blockages (Optimal flow)</option>
              <option value="g1">Gate 1 (North Stand) - Blocked</option>
              <option value="g2">Gate 2 (East Concourse) - Blocked</option>
              <option value="g4">Gate 4 (South Stand) - Blocked</option>
              <option value="g5">Gate 5 (West Concourse) - Blocked</option>
              <option value="g6">Gate 6 (South-East Deck) - Blocked</option>
            </select>
            <p className="text-[9px] text-slate-500 leading-normal">
              Artificially disables ticket scanners at the chosen gate. Incoming spectator particles will automatically compute a deflection flow vector and redirect to alternate open portals.
            </p>
          </div>

          {/* 3. Heatmap Overlay Toggle */}
          <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-slate-300">Cluster Heatmap Overlays</span>
              <span className="text-[9px] text-slate-500 font-mono">RENDER_COMPOSITING: ENHANCED</span>
            </div>

            <button
              id="toggle-sim-heatmap"
              onClick={() => setSimHeatmap(!simHeatmap)}
              className={`w-11 h-6 rounded-full transition-colors relative ${simHeatmap ? 'bg-cyan-500' : 'bg-slate-800'}`}
            >
              <span className={`block w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${simHeatmap ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* 4. Legend descriptor */}
          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 grid grid-cols-3 gap-2 text-[10px] font-mono text-center">
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block mb-1 shadow-[0_0_6px_#22d3ee]"></span>
              <span className="text-slate-400">Arriving Fan</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-450 inline-block mb-1 shadow-[0_0_6px_#f59e0b]"></span>
              <span className="text-slate-400">Queue Scan</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mb-1 shadow-[0_0_6px_#10b981]"></span>
              <span className="text-slate-400">Dispersed Seated</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
