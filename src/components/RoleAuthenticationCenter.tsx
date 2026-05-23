/**
 * @file RoleAuthenticationCenter.tsx
 * @description Highly polished interactive multi-role gateway with simulation capabilities for Admin, Ops, Security, Volunteers, Team Managers, and Sponsors.
 */

import React, { useState } from 'react';
import { UserRole, TurnstileGate, CommandLog } from '../types';
import { Shield, ShieldAlert, Users, Award, Eye, Key, Lock, RefreshCw, Radio, Check, Trophy, Heart, Coins, ArrowRight, Sparkles, Coffee } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

interface RoleAuthenticationCenterProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  gates: TurnstileGate[];
  logs: CommandLog[];
  onAddLog: (newLog: Omit<CommandLog, 'id' | 'timestamp'>) => void;
  onResetSystem: () => void;
  onTriggerPA: (text: string) => void;
  activeStadiumName: string;
}

export default function RoleAuthenticationCenter({
  activeRole,
  onRoleChange,
  gates,
  logs,
  onAddLog,
  onResetSystem,
  onTriggerPA,
  activeStadiumName,
}: RoleAuthenticationCenterProps) {
  // Simulator UI state
  const [showPassKey, setShowPassKey] = useState<boolean>(false);
  const [typedPass, setTypedPass] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Cricket Team Manager Local State
  const [staminaFactor, setStaminaFactor] = useState<number>(88);
  const [activeDrinksLog, setActiveDrinksLog] = useState<string>('Ready to dispatch Hydration carts.');

  // Sponsor Branding Local State
  const [sponsorBrand, setSponsorBrand] = useState<'Adani Solar' | 'Reliance Jio' | 'Tata Group' | 'PepsiCo'>('Adani Solar');
  const [roiImpressions, setRoiImpressions] = useState<number>(184500);

  // Hardcoded Passwords for simulated secure logins
  const rolePassKeys: Record<UserRole, string> = {
    admin: 'admin123',
    ops: 'ops456',
    security: 'sec789',
    volunteer: 'vol100',
    manager: 'team111',
    sponsor: 'brand999',
    fan: 'fan123',
  };

  const handleRoleSelection = (role: UserRole) => {
    // Simulated credential pre-fill
    setTypedPass(rolePassKeys[role]);
    onRoleChange(role);
    setAuthError(null);

    onAddLog({
      type: 'info',
      source: 'SYSTEM',
      message: `[SECURITY ACCESS] Modified privileged session role to: ${role.toUpperCase()}. Loaded localized toolbox widgets.`,
      resolved: true,
    });
  };

  const handleFakeUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedPass === rolePassKeys[activeRole]) {
      setIsLocked(false);
      setAuthError(null);
      onAddLog({
        type: 'info',
        source: 'SYSTEM',
        message: `[CREDENTIALS GRANTED] User authenticated successfully as: ${activeRole.toUpperCase()}. Permissions unlocked.`,
        resolved: true,
      });
    } else {
      setAuthError('❌ INVALID DECRYPT KEY FOR SELECTED PRIVILEGED BLOCK.');
      onAddLog({
        type: 'critical',
        source: 'SECURITY',
        message: `[FAILED LOGIN ATTEMPT] Unauthorized passphrase entered for role: ${activeRole.toUpperCase()}.`,
        resolved: false,
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-6" id="roles-auth-deck">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold px-2 py-0.5 rounded font-mono uppercase">
            Privileged Identity Access Core
          </span>
          <h2 className="text-base font-bold text-white mt-1 uppercase font-sans tracking-wide flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <span>Operational Console Roles Portal</span>
          </h2>
        </div>

        {/* Locked status banner */}
        <div className={`p-1 px-2.5 rounded font-mono text-[10px] font-bold ${isLocked ? 'bg-red-950 border border-red-800 text-red-400' : 'bg-emerald-955 border border-emerald-800 text-emerald-400'}`}>
          {isLocked ? '🔒 SECURITY SHIELD: ENFORCED' : '🔓 LIVE SESSION: UNLOCKED'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Role Grid Switcher (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <p className="text-xs text-slate-450 leading-relaxed font-sans text-slate-400">
            Select an operational role profile to switch between custom UI viewports, restricted logs dashboards, and specialized sector tools.
          </p>

          <div className="grid grid-cols-2 gap-2 mt-1">
            {/* 1. Admin */}
            <button
              onClick={() => handleRoleSelection('admin')}
              className={`p-3 rounded-lg border text-left flex flex-col gap-1 cursor-pointer transition-all ${activeRole === 'admin' ? 'bg-cyan-950 border-cyan-500' : 'bg-slate-950 border-slate-850 hover:border-slate-800'}`}
            >
              <div className="flex items-center justify-between">
                <Shield className="w-4 h-4 text-cyan-400" />
                {activeRole === 'admin' && <Check className="w-3.5 h-3.5 text-cyan-400 bg-cyan-900 rounded-full p-0.5" />}
              </div>
              <span className="text-xs font-bold text-white mt-1 font-mono uppercase">Master Admin</span>
              <span className="text-[9px] text-slate-500 font-mono">Full Override Security</span>
            </button>

            {/* 2. Ops Team */}
            <button
              onClick={() => handleRoleSelection('ops')}
              className={`p-3 rounded-lg border text-left flex flex-col gap-1 cursor-pointer transition-all ${activeRole === 'ops' ? 'bg-cyan-950 border-cyan-500' : 'bg-slate-950 border-slate-850 hover:border-slate-800'}`}
            >
              <div className="flex items-center justify-between">
                <Radio className="w-4 h-4 text-emerald-400" />
                {activeRole === 'ops' && <Check className="w-3.5 h-3.5 text-emerald-400 bg-emerald-900 rounded-full p-0.5" />}
              </div>
              <span className="text-xs font-bold text-white mt-1 font-mono uppercase">Operations</span>
              <span className="text-[9px] text-slate-500 font-mono">Grid Controls & PA</span>
            </button>

            {/* 3. Security Team */}
            <button
              onClick={() => handleRoleSelection('security')}
              className={`p-3 rounded-lg border text-left flex flex-col gap-1 cursor-pointer transition-all ${activeRole === 'security' ? 'bg-cyan-950 border-cyan-500' : 'bg-slate-950 border-slate-850 hover:border-slate-800'}`}
            >
              <div className="flex items-center justify-between">
                <ShieldAlert className="w-4 h-4 text-rose-450" />
                {activeRole === 'security' && <Check className="w-3.5 h-3.5 text-rose-400 bg-rose-950 rounded-full p-0.5" />}
              </div>
              <span className="text-xs font-bold text-white mt-1 font-mono uppercase">Security Crew</span>
              <span className="text-[9px] text-slate-500 font-mono">Alert Decouplers</span>
            </button>

            {/* 4. Volunteers */}
            <button
              onClick={() => handleRoleSelection('volunteer')}
              className={`p-3 rounded-lg border text-left flex flex-col gap-1 cursor-pointer transition-all ${activeRole === 'volunteer' ? 'bg-cyan-950 border-cyan-500' : 'bg-slate-950 border-slate-850 hover:border-slate-800'}`}
            >
              <div className="flex items-center justify-between">
                <Users className="w-4 h-4 text-amber-400" />
                {activeRole === 'volunteer' && <Check className="w-3.5 h-3.5 text-amber-400 bg-amber-900 rounded-full p-0.5" />}
              </div>
              <span className="text-xs font-bold text-white mt-1 font-mono uppercase">Volunteers</span>
              <span className="text-[9px] text-slate-500 font-mono">Scan Desk & Kits</span>
            </button>

            {/* 5. Team Managers */}
            <button
              onClick={() => handleRoleSelection('manager')}
              className={`p-3 rounded-lg border text-left flex flex-col gap-1 cursor-pointer transition-all ${activeRole === 'manager' ? 'bg-cyan-950 border-cyan-500' : 'bg-slate-950 border-slate-850 hover:border-slate-800'}`}
            >
              <div className="flex items-center justify-between">
                <Trophy className="w-4 h-4 text-yellow-500" />
                {activeRole === 'manager' && <Check className="w-3.5 h-3.5 text-yellow-500 bg-yellow-950 rounded-full p-0.5" />}
              </div>
              <span className="text-xs font-bold text-white mt-1 font-mono uppercase">Team Manager</span>
              <span className="text-[9px] text-slate-500 font-mono">Field Playbook & Kits</span>
            </button>

            {/* 6. Sponsors */}
            <button
              onClick={() => handleRoleSelection('sponsor')}
              className={`p-3 rounded-lg border text-left flex flex-col gap-1 cursor-pointer transition-all ${activeRole === 'sponsor' ? 'bg-cyan-950 border-cyan-500' : 'bg-slate-950 border-slate-850 hover:border-slate-800'}`}
            >
              <div className="flex items-center justify-between">
                <Coins className="w-4 h-4 text-violet-400" />
                {activeRole === 'sponsor' && <Check className="w-3.5 h-3.5 text-violet-400 bg-violet-955 rounded-full p-0.5" />}
              </div>
              <span className="text-xs font-bold text-white mt-1 font-mono uppercase">Brand Sponsor</span>
              <span className="text-[9px] text-slate-500 font-mono">ADS placements ROI</span>
            </button>

            {/* 7. Fan / Audience */}
            <button
              onClick={() => handleRoleSelection('fan')}
              className={`p-3 rounded-lg border text-left flex flex-col gap-1 cursor-pointer transition-all col-span-2 ${activeRole === 'fan' ? 'bg-cyan-950 border-cyan-500' : 'bg-slate-950 border-slate-850 hover:border-slate-800'}`}
            >
              <div className="flex items-center justify-between">
                <Heart className="w-4 h-4 text-pink-400" />
                {activeRole === 'fan' && <Check className="w-3.5 h-3.5 text-pink-400 bg-pink-955 rounded-full p-0.5" />}
              </div>
              <span className="text-xs font-bold text-white mt-1 font-mono uppercase">Fan / Audience</span>
              <span className="text-[9px] text-slate-500 font-mono">Verified Alerts & Requests</span>
            </button>
          </div>

          {/* Secure lock form */}
          <form onSubmit={handleFakeUnlock} className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col gap-2 mt-2">
            <span className="text-[9px] text-slate-450 font-mono uppercase block font-bold">Simulated Multi-Factor Authentication</span>
            
            <div className="flex gap-2">
              <input
                type={showPassKey ? 'text' : 'password'}
                placeholder={`Enter security pass for ${activeRole.toUpperCase()}`}
                value={typedPass}
                onChange={(e) => setTypedPass(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-[11px] text-slate-200 p-2 rounded flex-1 focus:border-cyan-500 outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassKey(!showPassKey)}
                className="px-2 bg-slate-900 rounded border border-slate-800 text-slate-400 hover:text-slate-200 text-[10px]"
              >
                {showPassKey ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono text-[9px] cursor-pointer"
            >
              EXECUTE SECURE HANDSHAKE LOGIN
            </button>

            {authError && (
              <span className="text-[8px] text-red-400 font-bold font-mono mt-1 block">{authError}</span>
            )}
          </form>
        </div>

        {/* Right Column: Privileged Sandbox Console Actions (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-4 border border-slate-850 rounded-lg flex flex-col justify-between">
          
          {isLocked ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10 font-mono text-xs">
              <Lock className="w-10 h-10 text-rose-500 animate-pulse mb-3" />
              <span className="text-rose-400 font-extrabold uppercase tracking-wide">Privileged Sandbox Console Locked</span>
              <p className="text-[10px] text-slate-500 leading-normal max-w-[320px] mt-1.5 font-sans">
                Authenticating safeguards user-level logs integrity. Submit valid hashcredentials above (`{activeRole === 'admin' ? 'admin123' : 'vol100'}`) to activate this sandbox terminal dynamically!
              </p>

              <button
                type="button"
                onClick={() => setIsLocked(false)}
                className="mt-4 px-4 py-1.5 bg-rose-950 text-rose-300 font-bold rounded border border-rose-800 hover:bg-rose-900 text-[10px] cursor-pointer"
              >
                Skip Auth Safeguard
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-between gap-4">
              
              {/* Dynamic Toolbox Header */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                  <span className="text-[10px] text-slate-400 font-mono tracking-widest font-bold uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>Privileged Command Console Actions</span>
                  </span>
                  
                  <span className="bg-cyan-950 text-cyan-400 border border-cyan-850 px-2 py-0.5 rounded text-[8px] font-mono tracking-normal font-bold uppercase">
                    ROLE: {activeRole.toUpperCase()}
                  </span>
                </div>

                {/* A. WORKBOARD FOR ROLE: ADMIN */}
                {activeRole === 'admin' && (
                  <div className="flex flex-col gap-3 font-mono text-xs animate-fadeIn">
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Admin possesses master cryptographic overrides. You can instantly reset all checking checkpoints, clear logs, and simulate a full-scale systems reset.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onResetSystem();
                          onAddLog({
                            type: 'info',
                            source: 'SYSTEM',
                            message: `[ADMIN OVERRIDE] Operator successfully initialized master telemetry grid wipe. Checked-in occupancy reset.`,
                            resolved: true,
                          });
                        }}
                        className="py-2.5 bg-rose-950 hover:bg-rose-900 text-rose-300 font-bold rounded border border-rose-800 transition-colors cursor-pointer text-center flex items-center justify-center gap-1 uppercase text-[10px]"
                      >
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Reset All Checkpoints</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onTriggerPA('📢 ALL OPERATORS: SYSTEM INTEGRITY CHECK IS COMPLETED BY NATIONAL SECURITY ADMIN.');
                        }}
                        className="py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-250 font-bold rounded border border-slate-800 transition-colors cursor-pointer text-center flex items-center justify-center gap-1 uppercase text-[10px]"
                      >
                        <Radio className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Force Safety Log</span>
                      </button>
                    </div>

                    <div className="bg-slate-900 p-2.5 border border-slate-800 rounded mt-1 text-[10px] text-slate-450 leading-relaxed font-sans">
                      ⚔️ <b>ROOT PRIVILEGES:</b> <code>ALL_STATIONS_STREAMS_OK</code>
                    </div>
                  </div>
                )}

                {/* B. WORKBOARD FOR ROLE: OPERATIONS */}
                {activeRole === 'ops' && (
                  <div className="flex flex-col gap-3 font-mono text-xs animate-fadeIn">
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Operations team manages stadium settings, handles PA announcements, and coordinates logistics and crowd diversion lines.
                    </p>

                    <div className="flex flex-col gap-2 mt-1">
                      <button
                        onClick={() => {
                          onTriggerPA(`🚨 DE-CONGESTION BRIEFING: ALL NORTH AND EAST GATES SECTOR NOW DEPLOYING REDIRECT OVERRIDES.`);
                        }}
                        className="py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 font-extrabold rounded text-[10px] cursor-pointer"
                      >
                        📡 BROADCAST MASS DECONGESTION ADVISORY
                      </button>

                      <p className="text-[10px] text-slate-500 mt-1">
                        Active stadium: <b className="text-slate-300">{activeStadiumName}</b>. Use the Match Center to switch sectors instantly.
                      </p>
                    </div>
                  </div>
                )}

                {/* C. WORKBOARD FOR ROLE: SECURITY */}
                {activeRole === 'security' && (
                  <div className="flex flex-col gap-3 font-mono text-xs animate-fadeIn">
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Security crew decouples camera warnings, logs physical incidents, and dispatches crowd containment squads.
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => {
                          onAddLog({
                            type: 'warning',
                            source: 'SECURITY',
                            message: `[SECURITY TEST DRILL] Simulated security inspection drill launched. Staff checking protocols in order.`,
                            resolved: false,
                          });
                        }}
                        className="py-2 bg-slate-900 hover:bg-slate-855 text-slate-300 border border-slate-800 rounded text-[10px] text-center"
                      >
                        🏁 Trigger System Drill
                      </button>

                      <button
                        onClick={() => {
                          onAddLog({
                            type: 'critical',
                            source: 'SECURITY',
                            message: `[LOCKDOWN OVERRIDE] Physical barricade triggers activated on western perimeters G.5.`,
                            resolved: false,
                          });
                        }}
                        className="py-2 bg-rose-955 border border-rose-800 hover:bg-rose-900 font-bold text-rose-300 rounded text-[10px] text-center"
                      >
                        ⚠️ Simulate Emergency Lockdown
                      </button>
                    </div>
                  </div>
                )}

                {/* D. WORKBOARD FOR ROLE: VOLUNTEER */}
                {activeRole === 'volunteer' && (
                  <div className="flex flex-col gap-2.5 font-mono text-xs animate-fadeIn">
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Volunteers operate ticket validation machines and distribute team souvenirs and kits to spectators checking in.
                    </p>

                    <div className="p-3 bg-slate-900 border border-slate-850 rounded flex flex-col gap-1.5">
                      <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">Scan Assist Diagnostics</span>
                      <div className="flex justify-between text-slate-300">
                        <span>Check-In Counters Status:</span>
                        <span className="text-emerald-400 font-bold">ALL STATIONS UNLOCKED</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-450 border-t border-slate-950 pt-1">
                        <span>Staff Assigned: <b>140 Crew</b></span>
                        <span>Shift ID: <b>DAY-SECTOR-B</b></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* E. WORKBOARD FOR ROLE: TEAM MANAGER */}
                {activeRole === 'manager' && (
                  <div className="flex flex-col gap-3 font-mono text-xs animate-fadeIn">
                    <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                      Coordinate team playbook, check athlete stamina factors, design match kits, and dispatch boundary hydration carts.
                    </p>

                    {/* Scoreboard Preview */}
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded font-mono flex justify-between items-center text-[11px] text-slate-350">
                      <div>
                        <span className="text-[8px] text-slate-500 font-bold block">IND vs AUS MATCH SCORE</span>
                        <span className="font-extrabold text-white">IND 288/4 (45.3 Overs)</span>
                      </div>
                      <span className="bg-amber-950 border border-amber-800 text-amber-400 text-[9px] font-bold px-1.5 rounded animate-pulse">LIVE PLAY</span>
                    </div>

                    {/* Interactive stamina slide */}
                    <div className="bg-slate-900 p-2.5 rounded border border-slate-850 flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Squad Stamina Average:</span>
                        <span className="text-yellow-450 font-extrabold">{staminaFactor}% Stamina</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={staminaFactor}
                        onChange={(e) => setStaminaFactor(Number(e.target.value))}
                        className="accent-yellow-500 bg-slate-950"
                      />
                    </div>

                    <div className="flex justify-between items-center gap-3">
                      <span className="text-[9.5px] text-slate-500 truncate">{activeDrinksLog}</span>
                      <button
                        onClick={() => {
                          setActiveDrinksLog('🥤 Beverages dispatched to boundary...');
                          onAddLog({
                            type: 'info',
                            source: 'SYSTEM',
                            message: `[TEAM OPERATIONS]: Dispatcher successfully mobilised hydration assistants to boundary Rope Sector 4.`,
                            resolved: true,
                          });
                          setTimeout(() => setActiveDrinksLog('Drinks cart returned to station.'), 4000);
                        }}
                        className="px-2.5 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded text-[9.5px] shrink-0 uppercase cursor-pointer flex items-center gap-1"
                      >
                        <Coffee className="w-3.5 h-3.5" />
                        <span>Dispatch Drinks</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* F. WORKBOARD FOR ROLE: SPONSORS */}
                {activeRole === 'sponsor' && (
                  <div className="flex flex-col gap-3 font-mono text-xs animate-fadeIn">
                    <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                      Track virtual billboard impressions, manage active promotional campaigns, and check reach conversion analytics.
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-850 flex flex-col gap-1">
                        <span className="text-[8px] text-slate-500 uppercase block">Active Board Banner</span>
                        <select
                          value={sponsorBrand}
                          onChange={(e) => {
                            setSponsorBrand(e.target.value as any);
                            setRoiImpressions(prev => prev + 12400);
                            onAddLog({
                              type: 'info',
                              source: 'TICKETING',
                              message: `[BRAND SYNC] Digital boundary screen updated to showcase: ${e.target.value.toUpperCase()}.`,
                              resolved: true,
                            });
                          }}
                          className="bg-slate-950 text-white rounded p-1 text-[10px] cursor-pointer"
                        >
                          <option value="Adani Solar">Adani Solar</option>
                          <option value="Reliance Jio">Reliance Jio</option>
                          <option value="Tata Group">Tata Group</option>
                          <option value="PepsiCo">PepsiCo</option>
                        </select>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded border border-slate-850 flex flex-col justify-center">
                        <span className="text-[8px] text-slate-500 uppercase">Sponsor Reach (ROI)</span>
                        <span className="font-bold text-violet-400 text-sm mt-0.5">
                          {roiImpressions.toLocaleString()}+ Viewers
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-850 p-2 rounded text-[10px] text-slate-400 leading-normal font-sans">
                      🎯 Brand <b>{sponsorBrand}</b> is currently locked as primary partner across <b>{activeStadiumName.toUpperCase()}</b> boundary ledboards.
                    </div>
                  </div>
                )}

                {/* G. WORKBOARD FOR ROLE: FAN / AUDIENCE */}
                {activeRole === 'fan' && (
                  <div className="flex flex-col gap-3 font-mono text-xs animate-fadeIn">
                    <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                      Raise a verified alert to reach out to the nearest security room.
                    </p>

                    <div className="bg-slate-900 p-3 rounded border border-slate-850 flex flex-col gap-2 items-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block border-b border-slate-800 pb-1 w-full text-center">Verify Identity First</span>
                      <p className="text-[9.5px] text-slate-400 text-center mb-2">You must authenticate via Google to access emergency fan dispatch features to prevent spam.</p>
                      
                      <div className="scale-90">
                        <GoogleLogin
                          onSuccess={credentialResponse => {
                            console.log('Fan Auth Success:', credentialResponse);
                            // Set local state to unlocked for this role or proceed with action
                            setIsLocked(false);
                            onAddLog({
                              type: 'info',
                              source: 'SYSTEM',
                              message: 'Fan authenticated securely via Google OAuth.',
                              resolved: true,
                            });
                          }}
                          onError={() => {
                            console.log('Login Failed');
                          }}
                        />
                      </div>

                      {!isLocked && (
                        <button
                          onClick={() => {
                            onAddLog({
                              type: 'critical',
                              source: 'SECURITY',
                              message: `[FAN_ALERT] Verified user raised an incident alarm from the stands. Dispatching nearest steward to location.`,
                              resolved: false,
                            });
                          }}
                          className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded mt-2 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 uppercase tracking-wide shadow-lg shadow-rose-900/50 w-full"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>Raise Verified Alert</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Reset to lock section */}
              <div className="border-t border-slate-900 pt-3 mt-4 flex items-center justify-between font-mono text-[9px] text-slate-500 flex-wrap gap-2">
                <span>ACTIVE_PERM_HASH: <code>SHA256:VOL-100-STMT</code></span>
                <button
                  type="button"
                  onClick={() => setIsLocked(true)}
                  className="text-red-400 hover:underline font-bold"
                >
                  🔒 INSTANT LOCK SCREEN CONTROL
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
