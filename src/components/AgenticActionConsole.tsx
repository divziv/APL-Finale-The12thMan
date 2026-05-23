/**
 * @file AgenticActionConsole.tsx
 * @description The tactical AI Agent control hub, displaying automated safety alerts, quick manual dispatch keys, and real-time coordinator chat via Gemini.
 */

import React, { useState, useRef, useEffect } from 'react';
import { CommandLog, TurnstileGate, ChatMessage } from '../types';
import { Bot, Send, Terminal, ShieldAlert, Sparkles, AlertTriangle, CheckSquare, AudioLines, RefreshCw } from 'lucide-react';

interface AgenticActionConsoleProps {
  logs: CommandLog[];
  gates: TurnstileGate[];
  onDispatchAction: (actionName: string) => void;
  onClearLogs: () => void;
  onManualRedirect: (fromGateId: string, toGateId: string) => void;
  onToggleLogResolution: (logId: string) => void;
}

export default function AgenticActionConsole({
  logs,
  gates,
  onDispatchAction,
  onClearLogs,
  onManualRedirect,
  onToggleLogResolution,
}: AgenticActionConsoleProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'agent',
      timestamp: '05:10',
      text: "Stadium Safety Artificial Intelligence Coordinator active. Send an inquiry or select a presentation step relative to your scenario to establish tactical crowd directives.",
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Redirection selects
  const [redirectFrom, setRedirectFrom] = useState<string>('g4');
  const [redirectTo, setRedirectTo] = useState<string>('g6');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest chat responses
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  /**
   * Dispatches questions to the server-side Gemini proxy `/api/ai/coordinate`.
   * Displays conversational recommendations on turnstile surges and medical/security evacuations.
   * @param {React.FormEvent} e Form event
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }),
      text: inputText,
    };

    setMessages(prev => [...prev, userMsg]);
    const promptToSend = inputText;
    setInputText('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/ai/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: promptToSend,
          gateMetrics: gates,
          activeIncidents: logs.filter(l => !l.resolved),
          chatHistory: messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', text: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error('Server responded with HTTP error status ' + response.status);
      }

      const data = await response.json();
      const aiResponseText = data.text || 'Direct command connection established.';

      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }),
          text: aiResponseText,
        },
      ]);
    } catch (err: any) {
      console.error(err);
      // Fallback response for offline or transient network drops
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }),
          text: `[REST CLIENT DIRECTIVE]\n\nUnable to reach server. Falling back to internal safety engine instructions:\n\n* **Critical Guideline**: To prevent congestion, immediately set digital dynamic displays to direct crowd overflow to adjacent corridors.\n* **Physical Redirection**: Dispatch standby marshals to guide fans using megaphone alerts.\n* **Gate Throttle**: If densities remain above 2.4 spectators/m², initiate momentary gate throttling rules.`,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  /**
   * Helper to execute manual routing bypass.
   */
  const executeManualBypass = () => {
    if (redirectFrom === redirectTo) return;
    onManualRedirect(redirectFrom, redirectTo);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5" id="agentic-action-console-grid">
      
      {/* Col 1: Live Event Logs / Decisional Feed (1/3 width) */}
      <div className="xl:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col min-h-[400px]">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Automated Log Dispatch</h2>
            <p className="text-xs text-slate-500 font-mono">SENSOR_INTERPRETER_STREAM: LIVE</p>
          </div>
          <button
            onClick={onClearLogs}
            className="text-[10px] font-mono text-slate-500 hover:text-red-400 border border-slate-800 hover:border-red-950 px-2 py-1 rounded transition-colors"
          >
            Clear Feeds
          </button>
        </div>

        {/* List of active warnings */}
        <div className="flex-1 overflow-y-auto max-h-[320px] flex flex-col gap-2.5 pr-1 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="text-slate-600 text-center py-12 text-xs">
              No telemetry alerts currently in stack buffer.
            </div>
          ) : (
            logs.map((l) => {
              const borderCol = 
                l.type === 'critical' ? 'border-red-700 bg-red-950/25 text-red-300' :
                l.type === 'warning' ? 'border-amber-700 bg-amber-950/25 text-amber-300' :
                l.type === 'action_dispatched' ? 'border-cyan-700 bg-cyan-950/25 text-cyan-200' :
                'border-slate-850 bg-slate-950/60 text-slate-300';
              
              return (
                <div
                  key={l.id}
                  onClick={() => onToggleLogResolution(l.id)}
                  className={`p-2.5 rounded-lg border flex flex-col gap-1 transition-all cursor-pointer relative group ${borderCol} ${
                    l.resolved ? 'opacity-40 line-through scale-98 border-slate-900 bg-transparent' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-extrabold uppercase bg-black/40 px-1 py-0.2 rounded-sm text-[9px] tracking-wide">
                      {l.source}
                    </span>
                    <span className="text-slate-500">{l.timestamp}</span>
                  </div>
                  <p className="leading-relaxed leading-tight text-[11px]">{l.message}</p>
                  
                  {/* Resolution quick prompt */}
                  {!l.resolved && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-1.5 py-0.5 rounded text-[8px] text-slate-400 flex items-center gap-1">
                      <CheckSquare className="w-3 h-3 text-emerald-400" />
                      <span>Resolve</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Col 2 & 3: Chat Assistant & Quick Dispatch Panel (2/3 width) */}
      <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Sub-Col A: Interactive Coordinator Chat (2/3 width of this container) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col justify-between h-[400px]">
          <div className="flex items-center gap-2 mb-3 border-b border-slate-800/80 pb-3">
            <Bot className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <span>Dynamic Operations Advisor</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h2>
              <p className="text-xs text-slate-500 font-mono">ENGINE: ROUTING_CONTROLLER_V4</p>
            </div>
          </div>

          {/* Messages window */}
          <div className="flex-1 overflow-y-auto mb-4 bg-slate-950/80 rounded-lg p-3.5 border border-slate-950/60 max-h-[250px] flex flex-col gap-3">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[85%] ${isUser ? 'align-end ml-auto' : 'align-start mr-auto'}`}
                >
                  <p className="text-[9px] font-mono text-slate-500 mb-0.5 px-1">{isUser ? 'OPERATOR' : 'SAFETY_ADVISOR'}</p>
                  <div
                    className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                      isUser
                        ? 'bg-cyan-900/60 text-cyan-100 border border-cyan-800 rounded-tr-none'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-wrap'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex flex-col max-w-[85%] mr-auto items-start">
                <p className="text-[9px] font-mono text-slate-500 mb-0.5">SAFETY_ADVISOR</p>
                <div className="bg-slate-900 text-slate-400 border border-slate-850 p-2.5 rounded-lg rounded-tl-none text-xs flex items-center gap-2 font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>Advisor calculating routing patterns and gate capacities...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="flex gap-2 font-mono">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., recommend evacuation route, query threat coordinates..."
              className="flex-1 bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 select-all"
            />
            <button
              type="submit"
              disabled={isThinking}
              className="px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-slate-950 rounded cursor-pointer font-extrabold flex items-center justify-center transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4 text-slate-100" />
            </button>
          </form>
        </div>

        {/* Sub-Col B: Manual Direct Actions Bypass Deck (1/3 width of this container) */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col justify-between h-[400px]">
          <div className="border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 font-mono">
              <Terminal className="w-4 h-4 text-amber-500" />
              <span>Safety Bypass</span>
            </h2>
            <p className="text-xs text-slate-500 font-mono">LEVEL_1_OVERRIDE_KEYS</p>
          </div>

          {/* Quick Manual Dispatch buttons */}
          <div className="flex flex-col gap-2 mt-4 flex-1 justify-center">
            <button
              onClick={() => onDispatchAction('Switch Gates to egress post-match')}
              className="w-full py-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-800 rounded text-xs font-semibold text-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Trigger High Exodus Flush</span>
            </button>

            <button
              onClick={() => onDispatchAction('Broadcast general storm warning')}
              className="w-full py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 rounded text-xs font-semibold text-rose-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <AudioLines className="w-3.5 h-3.5 shrink-0" />
              <span>Broadcast Alarm Intercom</span>
            </button>
          </div>

          {/* Custom Route Diversion controls */}
          <div className="border-t border-slate-800/80 pt-4 mt-2 bg-slate-950/40 p-2.5 rounded border border-slate-850">
            <span className="text-[10px] text-slate-400 font-mono tracking-widest font-bold uppercase block mb-1.5">
              Force Manual Redirection
            </span>
            <div className="flex flex-col gap-2 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">From:</span>
                <select
                  value={redirectFrom}
                  onChange={(e) => setRedirectFrom(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-300 w-full"
                >
                  {gates.map(g => (
                    <option key={g.id} value={g.id}>{g.name.split(' ')[0] + ' ' + g.name.split(' ')[1]}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">To Bypass:</span>
                <select
                  value={redirectTo}
                  onChange={(e) => setRedirectTo(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-200 w-full"
                >
                  {gates.map(g => (
                    <option key={g.id} value={g.id}>{g.name.split(' ')[0] + ' ' + g.name.split(' ')[1]}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={executeManualBypass}
                className="w-full py-1.5 mt-1 text-slate-950 bg-cyan-500 hover:bg-cyan-400 text-xs font-extrabold rounded text-center cursor-pointer transition-colors"
              >
                Apply Bypass Path
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
