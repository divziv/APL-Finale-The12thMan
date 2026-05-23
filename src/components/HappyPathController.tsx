/**
 * @file HappyPathController.tsx
 * @description Presentational timeline that lets judges step through structured Matchday simulation scripts securely.
 */

import React from 'react';
import { SimulatorScenario, ScenarioStep } from '../types';
import { Play, RotateCcw, AlertOctagon, HelpCircle, FastForward, CheckCircle } from 'lucide-react';

interface HappyPathControllerProps {
  scenarios: SimulatorScenario[];
  activeScenarioId: string;
  activeStepIndex: number;
  onSelectScenario: (scenarioId: string) => void;
  onSelectStep: (stepIndex: number) => void;
}

export default function HappyPathController({
  scenarios,
  activeScenarioId,
  activeStepIndex,
  onSelectScenario,
  onSelectStep,
}: HappyPathControllerProps) {
  const selectedScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];
  const activeStep = selectedScenario.steps[activeStepIndex] || selectedScenario.steps[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative" id="happy-path-container">
      {/* Decorative top tab to distinguish is as presentation tool */}
      <div className="absolute top-0 left-6 -translate-y-1/2 bg-cyan-600 font-bold font-mono text-[9px] uppercase text-slate-950 px-2.5 py-0.5 rounded-full tracking-widest border border-cyan-400">
        Presentation Pitch Tool
      </div>

      <div className="flex flex-col gap-4">
        {/* Step Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-sm font-semibold tracking-wider text-slate-300 flex items-center gap-2">
              <Play className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Interactive Happy Path Simulator</span>
            </h2>
            <p className="text-xs text-slate-400">Step through a scripted cricket match emergency response demo</p>
          </div>

          {/* Scenario Selectors */}
          <div className="flex flex-wrap gap-2">
            {scenarios.map((sc) => {
              const bActive = sc.id === activeScenarioId;
              return (
                <button
                  key={sc.id}
                  onClick={() => onSelectScenario(sc.id)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold tracking-tight transition-all duration-200 border cursor-pointer ${
                    bActive
                      ? 'bg-cyan-950 text-cyan-400 border-cyan-700 font-bold shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800/65'
                  }`}
                >
                  {sc.title.split(':')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Scenario Playbook details */}
        <div className="bg-slate-950/80 rounded-lg p-4 border border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 border-r border-slate-800/60 pr-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-slate-200 uppercase font-mono tracking-wider mb-1">
                {selectedScenario.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {selectedScenario.description}
              </p>
            </div>
            
            {/* Quick stats on scenario walkthrough */}
            <div className="bg-slate-900/60 px-3 py-2 rounded border border-slate-800 text-[10px] text-slate-400 font-mono flex flex-col gap-1">
              <p className="flex justify-between">
                <span>SCEN_STATE:</span>
                <span className="text-cyan-400 font-bold">READY_TO_RUN</span>
              </p>
              <p className="flex justify-between">
                <span>EST_IMPACT:</span>
                <span className="text-rose-400">HIGH_FLOW_RISK</span>
              </p>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col justify-between pl-0 md:pl-2">
            {/* Steps Navigation Dots Timeline */}
            <div className="mb-4">
              <span className="text-[10px] text-slate-500 font-mono tracking-widest font-bold uppercase block mb-2">
                Scenario Step Sequence
              </span>
              <div className="grid grid-cols-3 gap-2">
                {selectedScenario.steps.map((st, idx) => {
                  const bCurrent = idx === activeStepIndex;
                  const bPassed = idx < activeStepIndex;

                  return (
                    <button
                      key={idx}
                      onClick={() => onSelectStep(idx)}
                      className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all duration-300 relative cursor-pointer ${
                        bCurrent
                          ? 'bg-slate-800 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-white'
                          : bPassed
                          ? 'bg-slate-950 border-emerald-800/80 text-slate-300'
                          : 'bg-slate-950 border-slate-800/50 text-slate-500'
                      }`}
                    >
                      <span className="text-[9px] font-mono flex items-center gap-1 font-bold">
                        {bPassed ? (
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <span className={`w-3 h-3 text-center border rounded-full text-[8px] flex items-center justify-center ${bCurrent ? 'border-cyan-400 text-cyan-400' : 'border-slate-600'}`}>{idx + 1}</span>
                        )}
                        {st.name.split(':')[0]}
                      </span>
                      <span className="text-[10px] font-semibold truncate leading-none">
                        {st.name.split(':')[1] || st.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scenario Step Outcome / Explanation */}
            <div className="bg-slate-900/60 border border-slate-800 rounded p-3 text-xs leading-relaxed flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="p-0.5 bg-amber-900/50 text-amber-400 border border-amber-800 rounded text-[9px] font-bold font-mono tracking-wide">STATE_DESCRIPTION</span>
                <span className="text-[10px] text-slate-400 font-mono ml-auto">Map Code: {activeStep.mapOverlayType.toUpperCase()}</span>
              </div>
              <p className="text-slate-300 text-xs">
                {activeStep.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
