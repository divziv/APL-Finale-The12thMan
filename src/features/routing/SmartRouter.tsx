import React from 'react';
import { useEngineStore } from '../../stores/useEngineStore';
import { ArrowRight, AlertTriangle, Clock } from 'lucide-react';

export default function SmartRouter() {
  const matchEvent = useEngineStore(state => state.matchEvent);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
      <h3 className="text-cyan-400 font-mono text-xs font-bold uppercase mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        Active Smart Routing Intelligence
      </h3>

      <div className="flex flex-col gap-4">
        {matchEvent?.type === 'INNINGS_BREAK' ? (
          <div className="bg-rose-950/30 border border-rose-900 p-3 rounded-lg flex flex-col gap-2">
            <span className="text-rose-400 font-bold text-xs uppercase flex items-center gap-1">
              <Clock className="w-3 h-3" /> Food Court A Waiting Time: 18 min
            </span>
            <div className="flex items-center gap-2 text-[10px] text-slate-300 font-mono bg-slate-950 p-2 rounded">
              <span>Redirecting Traffic</span>
              <ArrowRight className="w-3 h-3 text-cyan-500" />
              <span className="text-emerald-400 font-bold">Food Court C (Wait: 4 min)</span>
            </div>
            <p className="text-[9px] text-slate-400 mt-1">Digital signages updated automatically.</p>
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex flex-col gap-2">
            <span className="text-amber-400 font-bold text-xs uppercase flex items-center gap-1">
              <Clock className="w-3 h-3" /> Gate 2 Pressure Rising
            </span>
            <div className="flex items-center gap-2 text-[10px] text-slate-300 font-mono bg-slate-900 p-2 rounded">
              <span>Suggested Redirection</span>
              <ArrowRight className="w-3 h-3 text-cyan-500" />
              <span className="text-emerald-400 font-bold">Gate 5 (Optimal Flow)</span>
            </div>
            <button className="bg-cyan-900 hover:bg-cyan-800 text-cyan-100 text-[10px] py-1 rounded transition-colors w-full mt-1">
              Execute Redirection Protocol
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
