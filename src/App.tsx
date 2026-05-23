/**
 * @file App.tsx
 * @description Integrated multi-tab ticket checkpoint, CCTV heatmaps, 2.5D crowd flows simulator, and DEI settings board.
 */

import React, { useState, useEffect } from 'react';
import { TurnstileGate, SecurityCamera, CommandLog, UserRole, BookedTicket, SwagItem, TriageCase } from './types';
import {
  getInitialGates,
  getInitialCameras,
  getInitialLogs,
  PRESENTATION_SCENARIOS,
  EMERGENCY_PLANS,
} from './data/seedData';
import { STADIUMS_PRESETS } from './data/stadiums';

import StadiumControlMap from './components/StadiumControlMap';
import StadiumCCTV from './components/StadiumCCTV';
import HappyPathController from './components/HappyPathController';
import CheckpointStats from './components/CheckpointStats';
import AgenticActionConsole from './components/AgenticActionConsole';
import AccessibilityControls from './components/AccessibilityControls';
import AnalyticsCharts from './components/AnalyticsCharts';
import EmergencyManagement from './components/EmergencyManagement';
import StadiumSimulation3D from './components/StadiumSimulation3D';
import StadiumMatchCenter from './components/StadiumMatchCenter';
import TrafficAndIncidents from './components/TrafficAndIncidents';
import PlatformMobileSimulator from './components/PlatformMobileSimulator';
import StadiumTicketingAndSwags from './components/StadiumTicketingAndSwags';
import RoleAuthenticationCenter from './components/RoleAuthenticationCenter';
import StadiumTriageOperations from './components/StadiumTriageOperations';
import { useSimulationEngine } from './mock-engine/SimulationEngine';
import Stadium3DView from './features/stadium/Stadium3DView';
import SmartRouter from './features/routing/SmartRouter';
import CrowdTrends from './features/analytics/CrowdTrends';
import { iplThemes } from './themes/iplThemes';

import {
  Clock,
  ShieldAlert,
  Wifi,
  Flame,
  Trophy,
  MapPin,
  Layers,
  Server,
  LayoutDashboard,
  BarChart3,
  Waves,
  AlertTriangle,
  Sparkles,
  Volume2,
  Megaphone,
  Ticket,
  Lock,
  Shield
} from 'lucide-react';

export default function App() {
  useSimulationEngine();
  
  // 1. Core tactical states
  const [activeStadiumId, setActiveStadiumId] = useState<string>('stadium_modi');
  const [gates, setGates] = useState<TurnstileGate[]>(STADIUMS_PRESETS[0].gates);
  const [cameras, setCameras] = useState<SecurityCamera[]>(STADIUMS_PRESETS[0].cameras);
  const [logs, setLogs] = useState<CommandLog[]>([]);

  // 1X. Interactive Triage and Evacuation Drill state
  const [isDrillAlarmActive, setIsDrillAlarmActive] = useState<boolean>(false);
  const [triageCases, setTriageCases] = useState<TriageCase[]>([
    {
      id: 'tc_g4_surge',
      gateId: 'g4',
      title: 'Gate 4 Influx Bottleneck Surge',
      severity: 'critical',
      status: 'red',
      impactAreaMeters: 140,
      pulseDirection: 'increasing',
      timestamp: '05:10 AM',
      description: 'Localized ticket barcode reader fault is leading to extreme queue accumulation at the South Stand.',
      actionTaken: '',
    },
    {
      id: 'tc_c3_baggage',
      gateId: 'g1',
      title: 'Sector C North Walkway Object',
      severity: 'alert',
      status: 'red',
      impactAreaMeters: 70,
      pulseDirection: 'decreasing',
      timestamp: '05:07 AM',
      description: 'CCTV Camera 6 flagged an unattended backpack near the food stall zone boundary.',
      actionTaken: '',
    },
    {
      id: 'tc_g5_med',
      gateId: 'g5',
      title: 'West Plaza Medical Request Escalation',
      severity: 'info',
      status: 'yellow',
      impactAreaMeters: 40,
      pulseDirection: 'stable',
      timestamp: '05:05 AM',
      description: 'Operator dispatched wheelchair standby team to assist an elderly patron displaying warm dehydration fatigue.',
      actionTaken: 'Operator dispatched dynamic EMT taskforce and provided fresh hydration.',
    }
  ]);

  // 1Y. DEI parameters
  const [wheelchairAssist, setWheelchairAssist] = useState<boolean>(false);
  const [sensoryQuietMode, setSensoryQuietMode] = useState<boolean>(false);
  const [signLanguageTicker, setSignLanguageTicker] = useState<boolean>(false);
  const [familyRestroomGuides, setFamilyRestroomGuides] = useState<boolean>(false);
  const [socioEconomicSubsidy, setSocioEconomicSubsidy] = useState<boolean>(false);

  // 2. Multi-tab navigation state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'simulation' | 'emergency' | 'settings' | 'ticketing'>('dashboard');

  // 1A. Multi-role access control state
  const [activeRole, setActiveRole] = useState<UserRole>('ops');

  // 1B. Booked Tickets list
  const [bookedTickets, setBookedTickets] = useState<BookedTicket[]>([
    {
      id: 'ticket_pre_1',
      holderName: 'Aravind Swaminathan',
      phone: '+91 91524 81092',
      section: 'Astro North Stand [STANDARD]',
      seatsCount: 2,
      price: 30,
      gateId: 'g1',
      qrCode: 'MOCK_QR_CODE_1',
      status: 'pending',
      timestamp: '05:01 AM',
    },
    {
      id: 'ticket_pre_2',
      holderName: 'Sarah Jenkins',
      phone: '+61 40220 XXX',
      section: 'VIP President Vault [VIP]',
      seatsCount: 1,
      price: 140,
      gateId: 'g3',
      qrCode: 'MOCK_QR_CODE_2',
      status: 'pending',
      timestamp: '05:08 AM',
    }
  ]);

  // 1C. Swag items configuration
  const [swags, setSwags] = useState<SwagItem[]>([
    { id: 'sw_flags', name: '🚩 Tricolor Fan Cheer Flags', totalDistributed: 420, stockRemaining: 180 },
    { id: 'sw_caps', name: '🧢 Official Team Basecaps', totalDistributed: 310, stockRemaining: 290 },
    { id: 'sw_combos', name: '🍿 Crunch Popcorn & Soda Combos', totalDistributed: 512, stockRemaining: 88 },
    { id: 'sw_jerseys', name: '👕 Breathable Athlete Jersey Kits', totalDistributed: 65, stockRemaining: 135 },
  ]);

  // 1D. Automated emergency autopilot settings
  const [autoPilotActive, setAutoPilotActive] = useState<boolean>(true);
  const [congestionThreshold, setCongestionThreshold] = useState<number>(2.5); // seconds limit
  const [automatedLogs, setAutomatedLogs] = useState<string[]>([]);

  // 3. Presentation scenarios controllers
  const [activeScenarioId, setActiveScenarioId] = useState<string>('scen_gate4_congestion');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // 4. Focus selections
  const [selectedGateId, setSelectedGateId] = useState<string | null>('g4');

  // 5. Simulated tickers
  const [matchMinutes, setMatchMinutes] = useState<number>(42);
  const [systemTime, setSystemTime] = useState<string>('05:12:00 AM');

  // 6. Global Broadcast announcement ticker (pa address banner)
  const [activeBroadcastText, setActiveBroadcastText] = useState<string | null>(
    '🚨 WELCOME TO THE STADIUM NODE: ALL SPECTATOR CHECKPOINTS ARE REPORTING OPTIMAL TELEMETRY. EMERGENCY CONTACTS IN INDIA: POLICE (100), FIRE (101), AMBULANCE (102).'
  );

  // 7. DEI & Accessibility states (saved to localStorage for persistent configurations)
  const [colorBlindMode, setColorBlindMode] = useState<'normal' | 'deuteranopia' | 'protanopia' | 'achromatopsia'>('normal');
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
  const [flashingEnabled, setFlashingEnabled] = useState<boolean>(true);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // 10. Load configurations and logs from localStorage on mount
  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem('crowdflow_logs');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      } else {
        setLogs(getInitialLogs());
      }

      const savedBroadcast = localStorage.getItem('crowdflow_broadcast');
      if (savedBroadcast !== null) {
        setActiveBroadcastText(savedBroadcast === 'null' ? null : savedBroadcast);
      }

      const savedColorBlind = localStorage.getItem('crowdflow_color_blind');
      if (savedColorBlind) setColorBlindMode(savedColorBlind as any);

      const savedTextScale = localStorage.getItem('crowdflow_text_scale');
      if (savedTextScale) setTextSize(savedTextScale as any);

      const savedTts = localStorage.getItem('crowdflow_tts');
      if (savedTts !== null) setTtsEnabled(savedTts === 'true');

      const savedFlashing = localStorage.getItem('crowdflow_sirens_flash');
      if (savedFlashing !== null) setFlashingEnabled(savedFlashing === 'true');
    } catch (e) {
      console.error("Local storage initialization failure:", e);
      setLogs(getInitialLogs());
    }
  }, []);

  // 11. Write core configurations and state shifts into localStorage
  useEffect(() => {
    try {
      if (logs.length > 0) {
        localStorage.setItem('crowdflow_logs', JSON.stringify(logs));
      }
    } catch (e) {
      console.warn("Logs save blocked:", e);
    }
  }, [logs]);

  // Synchronize dynamic scenario steps on presentation clicks
  useEffect(() => {
    applyScenarioStep(activeScenarioId, activeStepIndex);
  }, [activeScenarioId, activeStepIndex]);

  // Periodic match clock increment tracker
  useEffect(() => {
    const timer = setInterval(() => {
      setMatchMinutes(prev => (prev < 90 ? prev + 1 : 1));
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Autonomic Autopilot Safety Core
  useEffect(() => {
    if (!autoPilotActive) return;

    const timer = setInterval(() => {
      // Find a gate whose check-in delay is slow (exceeds threshold) with no active redirection
      const slowGate = gates.find(g => (g.status === 'congested' || g.scanSpeed > congestionThreshold) && g.status !== 'emergency_redirect' && g.status !== 'closed');
      if (slowGate) {
        // Find cleanest alternate gates
        const alternativeGate = gates.find(g => g.id !== slowGate.id && g.status === 'optimal') || gates.find(g => g.id !== slowGate.id && g.status === 'moderate') || gates[0];
        
        if (alternativeGate && alternativeGate.id !== slowGate.id) {
          // Set redirection
          setGates(prevGates => prevGates.map(g => {
            if (g.id === slowGate.id) {
              return {
                ...g,
                status: 'emergency_redirect' as const,
                redirectionTarget: alternativeGate.id,
                flowRate: Math.max(5, Math.round(g.flowRate / 3)),
              };
            }
            if (g.id === alternativeGate.id) {
              return {
                ...g,
                status: 'moderate' as const,
                flowRate: g.flowRate + 32,
              };
            }
            return g;
          }));

          const stamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
          const autoMsg = `🤖 [SENTINEL SYSTEM] Diverted bottleneck from ${slowGate.name.split(' (')[0].toUpperCase()} to ${alternativeGate.name.split(' (')[0].toUpperCase()} (${slowGate.scanSpeed}s limit exceed)`;
          
          setAutomatedLogs(prev => [autoMsg, ...prev].slice(0, 10));

          // Log in system logs
          const autoLogObj: CommandLog = {
            id: `auto-redirect-${Date.now()}`,
            timestamp: stamp.substring(0, 5),
            type: 'action_dispatched',
            source: 'SYSTEM',
            message: `[AI AUTOPILOT MITIGATION] Auto-diverted bottleneck crowd from slow gate ${slowGate.id.toUpperCase()} to ${alternativeGate.id.toUpperCase()} safely.`,
            resolved: true,
          };
          setLogs(prev => [autoLogObj, ...prev]);

          speakText(`Autopilot system engaged congestion safety rule. Re routing incoming queue from slow zone ${slowGate.id.toUpperCase()} to alternate gate ${alternativeGate.id.toUpperCase()}.`);
        }
      }

      // Explicit Density Check
      const highDensityGate = gates.find(g => g.occupancy > g.capacity * 0.95 && g.status !== 'closed');
      if (highDensityGate) {
        const stamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        // Prevent spamming the same log by checking if we recently logged it
        setLogs(prev => {
          if (prev.some(l => l.message.includes(`HIGH DENSITY ALERT at ${highDensityGate.id.toUpperCase()}`) && !l.resolved)) return prev;
          speakText(`CRITICAL ALERT: Crowd density at ${highDensityGate.name} is approaching maximum capacity. Please dispatch groundsmaster immediately.`);
          return [{
            id: `density-alert-${Date.now()}`,
            timestamp: stamp.substring(0, 5),
            type: 'critical',
            source: 'SYSTEM',
            message: `[HIGH DENSITY ALERT at ${highDensityGate.id.toUpperCase()}] Sector is at ${Math.round((highDensityGate.occupancy / highDensityGate.capacity) * 100)}% capacity. Immediate containment action required!`,
            resolved: false,
          }, ...prev];
        });
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPilotActive, gates, congestionThreshold]);

  /**
   * Browser Text-to-Speech Vocal synthesizer wrapper
   * @param {string} text Voice notification script
   */
  const speakText = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS block by browser frame:", e);
    }
  };

  /**
   * Translates the scenario timeline steps cleanly into live gates flow telemetry
   */
  const applyScenarioStep = (scenarioId: string, stepIndex: number) => {
    const currentScenario = PRESENTATION_SCENARIOS.find(s => s.id === scenarioId) || PRESENTATION_SCENARIOS[0];
    const step = currentScenario.steps[stepIndex] || currentScenario.steps[0];

    // Merge custom overrides
    const defaultGates = getInitialGates();
    const updatedGates = defaultGates.map(g => {
      const override = step.gatesStatus[g.id];
      if (override) {
        return { ...g, ...override };
      }
      return g;
    });
    setGates(updatedGates);

    // Filter and update camera views
    const baseCctv = getInitialCameras();
    const updatedCameras = baseCctv.map(c => {
      if (step.activeThreatId === c.id) {
        return {
          ...c,
          status: 'alert' as const,
          aiLabel: 'SURGE THREAT: CROWD COUNT REACHES HIGHEST THRESHOLD',
          peopleCount: c.peopleCount * 3,
        };
      }
      return c;
    });
    setCameras(updatedCameras);

    // Synthesize logs
    const baseNewLogs = step.systemLogsAdded.map((newLog, i) => {
      const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      return {
        id: `scen-log-${scenarioId}-${stepIndex}-${i}-${Date.now()}`,
        timestamp,
        ...newLog,
      };
    });

    setLogs(prev => {
      const filteredPrev = prev.filter(l => !l.id.includes(`scen-log-${scenarioId}`));
      return [...baseNewLogs, ...filteredPrev];
    });

    // Speak recommendation
    speakText(`Scenario updated to ${step.name}. AI recommendation: ${step.aiSuggestedAction}`);

    if (step.activeThreatId && typeof step.activeThreatId === 'string' && step.activeThreatId.startsWith('g')) {
      setSelectedGateId(step.activeThreatId);
    }
  };

  /**
   * Intercom or dispatcher manual keys dispatch handler
   */
  const handleDispatchAction = (actionName: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const dispatchedLog: CommandLog = {
      id: `action-${Date.now()}`,
      timestamp,
      type: 'action_dispatched',
      source: 'SYSTEM',
      message: `DISPATCHED ACTION OVERRIDE: ${actionName.toUpperCase()}. Applied parameters across entry zones.`,
      resolved: true,
    };

    setLogs(prev => [dispatchedLog, ...prev]);
    speakText(`Operator triggered action: ${actionName}`);

    // Switch gates outbound
    if (actionName.toLowerCase().includes('egress') || actionName.toLowerCase().includes('exodus')) {
      const egressGates = gates.map(g => ({
        ...g,
        status: 'optimal' as const,
        flowRate: g.flowRate * 2.5,
        scanSpeed: 0.8,
      }));
      setGates(egressGates);
    }
  };

  /**
   * Custom Emergency incident report triggered from the fast node builder
   */
  const handleAddCustomIncidentLog = (newLogBody: Omit<CommandLog, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const fullLog: CommandLog = {
      id: `custom-incident-${Date.now()}`,
      timestamp,
      ...newLogBody,
    };

    setLogs(prev => [fullLog, ...prev]);

    // Handle flow rates impacts
    if (newLogBody.type === 'critical') {
      const updatedGates = gates.map(g => {
        if (g.id === 'g4') {
          return { ...g, status: 'congested' as const, scanSpeed: 3.5, flowRate: 98 };
        }
        return g;
      });
      setGates(updatedGates);
    }
  };

  /**
   * Enforces strategic emergency procedure protocols
   */
  const handleDispatchProceduralPlan = (planId: string) => {
    const targetPlan = EMERGENCY_PLANS.find(p => p.id === planId) || EMERGENCY_PLANS[0];
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const procedLog: CommandLog = {
      id: `procedural-plan-${planId}-${Date.now()}`,
      timestamp,
      type: 'critical',
      source: 'SECURITY',
      message: `TACTICAL DEPLOYMENT SUCCESS: Mobilized "${targetPlan.title}". All stations synchronization active.`,
      resolved: false,
    };

    setLogs(prev => [procedLog, ...prev]);

    // Apply procedural limits
    if (planId === 'plan_weather') {
      // Setup sheltering speed rates
      const shelteredGates = gates.map(g => ({
        ...g,
        status: 'moderate' as const,
        flowRate: g.flowRate + 25,
      }));
      setGates(shelteredGates);
    } else if (planId === 'plan_security') {
      const securedGates = gates.map(g => (
        g.id === 'g1' ? { ...g, status: 'closed' as const, flowRate: 0 } : g
      ));
      setGates(securedGates);
    } else if (planId === 'plan_exodus') {
      const exitGates = gates.map(g => ({
        ...g,
        status: 'optimal' as const,
        flowRate: 150,
        scanSpeed: 0.5,
      }));
      setGates(exitGates);
    }
  };

  /**
   * PA Banner broadcaster modifier
   */
  const handleDispatchGlobalBroadcast = (alertText: string | null) => {
    setActiveBroadcastText(alertText);
    try {
      localStorage.setItem('crowdflow_broadcast', alertText === null ? 'null' : alertText);
    } catch(e){}

    if (alertText) {
      speakText(`New Stadium PA Address Broadcasted: ${alertText}`);
    }
  };

  /**
   * Handle manual redirects across check points
   */
  const handleManualRedirect = (fromGateId: string, toGateId: string) => {
    const adjustedGates = gates.map(g => {
      if (g.id === fromGateId) {
        return {
          ...g,
          status: 'emergency_redirect' as const,
          redirectionTarget: toGateId,
          flowRate: Math.round(g.flowRate / 3),
        };
      }
      if (g.id === toGateId) {
        return {
          ...g,
          status: 'moderate' as const,
          flowRate: g.flowRate + 45,
        };
      }
      return g;
    });
    setGates(adjustedGates);

    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const redirectLog: CommandLog = {
      id: `redirect-override-${Date.now()}`,
      timestamp,
      type: 'action_dispatched',
      source: 'SECURITY',
      message: `MANUAL DIRECTIVES: Diverting flow from ${fromGateId.toUpperCase()} to ${toGateId.toUpperCase()}`,
      resolved: false,
    };
    setLogs(prev => [redirectLog, ...prev]);
    speakText(`Attention: Entry flow diverted from ${gates.find(g => g.id === fromGateId)?.name} to alternative portal ${gates.find(g => g.id === toGateId)?.name}.`);
  };

  /**
   * Toggles the computer vision analytical outline highlights of the selected camera feed
   */
  const handleCctvHighlightToggle = (camId: string) => {
    const updatedCameras = cameras.map(c => {
      if (c.id === camId) {
        return { ...c, highlightThreat: !c.highlightThreat };
      }
      return c;
    });
    setCameras(updatedCameras);

    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const toggleLog: CommandLog = {
      id: `cctv-toggle-${Date.now()}`,
      timestamp,
      type: 'info',
      source: 'SECURITY',
      message: `CCTV FEED AMENDMENT: Operator toggled inspection highlights on unit ${camId.toUpperCase()}.`,
      resolved: true,
    };
    setLogs(prev => [toggleLog, ...prev]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleToggleLogResolution = (logId: string) => {
    setLogs(prev =>
      prev.map(l => (l.id === logId ? { ...l, resolved: !l.resolved } : l))
    );
  };

  /**
   * Online Ticketing - Book a new digital ticket
   */
  const handleBookTicket = (ticket: Omit<BookedTicket, 'id' | 'timestamp' | 'qrCode' | 'status'>) => {
    const timestampStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    const newT: BookedTicket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      qrCode: `QR-CODE-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'pending',
      timestamp: timestampStr,
    };

    setBookedTickets(prev => [newT, ...prev]);

    // Dispatch logging
    const bookLog: CommandLog = {
      id: `book-log-${Date.now()}`,
      timestamp: timestampStr.substring(0, 5),
      type: 'info',
      source: 'TICKETING',
      message: `[ONLINE TICKET ISSUED] Attendee "${ticket.holderName}" registered for ${ticket.seatsCount} seats (${ticket.section}). assigned entry: GATE ${ticket.gateId.toUpperCase()}.`,
      resolved: true,
    };
    setLogs(prev => [bookLog, ...prev]);

    speakText(`Ticket generated for attendee ${ticket.holderName}. Zone: gate ${ticket.gateId.toUpperCase()}.`);
  };

  /**
   * Online Ticketing - Scan and Check-in validation
   * Moves to verified and updates Gate occupancy
   */
  const handleVerifyTicket = (ticketId: string, destGateId: string, occupancyIncrease: number) => {
    // 1. Mark ticket verified
    setBookedTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'verified' } : t));

    // 2. Increase matching gate's occupancy
    setGates(prevGates => prevGates.map(g => {
      if (g.id === destGateId) {
        const nextOccupancy = Math.min(g.capacity, g.occupancy + occupancyIncrease);
        return {
          ...g,
          occupancy: nextOccupancy,
          flowRate: g.flowRate + 4, // simulation impact
        };
      }
      return g;
    }));

    // Find ticket info
    const ticket = bookedTickets.find(t => t.id === ticketId);
    const holder = ticket ? ticket.holderName : "Attendee";

    const timestampStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    // 3. Dispatch logging
    const checkinLog: CommandLog = {
      id: `checkin-log-${Date.now()}`,
      timestamp: timestampStr.substring(0, 5),
      type: 'info',
      source: 'TICKETING',
      message: `[QR INTEGRATION GATEWAY] Scanned & verified ticket ${ticketId.substring(0, 8).toUpperCase()}. Checked-in ${occupancyIncrease} guest(s) at Gate ${destGateId.toUpperCase()} ("${holder}").`,
      resolved: true,
    };
    setLogs(prev => [checkinLog, ...prev]);

    speakText(`Scan complete. Access granted for ${holder} at Gate ${destGateId.toUpperCase()}. Welcome to stadium.`);
  };

  /**
   * Swag items allocation - Disburses kits or swags
   */
  const handleDistributeSwag = (swagId: string, amount: number) => {
    setSwags(prevSwags => prevSwags.map(sw => {
      if (sw.id === swagId) {
        const qtyToSent = Math.min(sw.stockRemaining, amount);
        return {
          ...sw,
          totalDistributed: sw.totalDistributed + qtyToSent,
          stockRemaining: Math.max(0, sw.stockRemaining - qtyToSent),
        };
      }
      return sw;
    }));

    const selectedSwag = swags.find(sw => sw.id === swagId);
    const label = selectedSwag ? selectedSwag.name : 'swags';

    const timestampStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    const swagLog: CommandLog = {
      id: `swag-dist-${Date.now()}`,
      timestamp: timestampStr.substring(0, 5),
      type: 'info',
      source: 'TICKETING',
      message: `[KIT LOGISTICS DEPLOY] Disbursed bulk unit quota (${amount}x) of "${label}" to active gate distribution hubs.`,
      resolved: true,
    };
    setLogs(prev => [swagLog, ...prev]);

    speakText(`Disbursed ${amount} units of ${label.split('Fan ')[0]} to checked-in queues.`);
  };

  /**
   * Restore all swags and tickets to baseline seed
   */
  const handleResetInventory = () => {
    setSwags([
      { id: 'sw_flags', name: '🚩 Tricolor Fan Cheer Flags', totalDistributed: 420, stockRemaining: 180 },
      { id: 'sw_caps', name: '🧢 Official Team Basecaps', totalDistributed: 310, stockRemaining: 290 },
      { id: 'sw_combos', name: '🍿 Crunch Popcorn & Soda Combos', totalDistributed: 512, stockRemaining: 88 },
      { id: 'sw_jerseys', name: '👕 Breathable Athlete Jersey Kits', totalDistributed: 65, stockRemaining: 135 },
    ]);
    setBookedTickets([]);
    speakText("Swag inventory counts and booked tickets have been restored to baseline.");
  };

  /**
   * Extended master system reset for admins
   */
  const handleResetTelemetryGrid = () => {
    const freshPreset = STADIUMS_PRESETS.find(s => s.id === activeStadiumId) || STADIUMS_PRESETS[0];
    setGates(freshPreset.gates);
    setCameras(freshPreset.cameras);
    setBookedTickets([]);
    setLogs([]);
    speakText("Master telemetry checkout and tactical gates occupancy have been fully reset.");
  };

  /**
   * Log helper to create operations command feed records
   */
  const logCommand = (message: string, type: 'info' | 'warning' | 'action_dispatched' | 'critical' = 'info') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const logVal: CommandLog = {
      id: `triage-op-${Date.now()}-${Math.random()}`,
      timestamp,
      type,
      source: 'SECURITY',
      message,
      resolved: type === 'info',
    };
    setLogs((prev) => [logVal, ...prev]);
  };

  /**
   * Interactive triage handlers for visual progression and alerts scaling
   */
  const handleUpdateTriageCase = (caseId: string, updatedFields: Partial<TriageCase>) => {
    setTriageCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const updated = { ...c, ...updatedFields };
          // Visual progression log and speech alerts when critical status moves red -> yellow -> green
          if (updatedFields.status && updatedFields.status !== c.status) {
            let messageText = `Triage progression: "${c.title}" changed status from ${c.status.toUpperCase()} to ${updatedFields.status.toUpperCase()}.`;
            let logType: 'info' | 'warning' | 'action_dispatched' | 'critical' = 'info';

            if (updatedFields.status === 'green') {
              messageText = `SUCCESS: Area secured and resolved for "${c.title}". Target sector is now managed.`;
              logType = 'info';
            } else if (updatedFields.status === 'yellow') {
              messageText = `ALERT CLARIFICATION: Area queue and security risks for "${c.title}" updated to Moderate warning.`;
              logType = 'warning';
            } else if (updatedFields.status === 'red') {
              messageText = `CRITICAL ALERT: Security/crowd congestion at "${c.title}" escalated to RED alarm state.`;
              logType = 'critical';
            }

            logCommand(messageText, logType);
            if (ttsEnabled) {
              speakText(messageText);
            }
          }
          if (updatedFields.pulseDirection && updatedFields.pulseDirection !== c.pulseDirection) {
            logCommand(`[PULSE VECTOR] Alert "${c.title}" modified pulse to ${updatedFields.pulseDirection.toUpperCase()}.`, 'info');
          }
          if (updatedFields.impactAreaMeters && updatedFields.impactAreaMeters !== c.impactAreaMeters) {
            logCommand(`[SECTOR EXTENT] "${c.title}" incident radius adjusted to ${updatedFields.impactAreaMeters} meters.`, 'info');
          }
          return updated;
        }
        return c;
      })
    );
  };

  const handleClearAllResolved = () => {
    setTriageCases((prev) => prev.filter((c) => c.status !== 'green'));
    logCommand('Triage operations: Cleaned all resolved (green) incident logs from live queue.', 'info');
    speakText("Security logs optimized. Cleaned resolved triage incidents.");
  };

  const handleTriggerDeflection = (fromId: string, toId: string) => {
    setGates((prev) =>
      prev.map((gt) => {
        if (gt.id === fromId) {
          return {
            ...gt,
            status: 'emergency_redirect',
            redirectionTarget: toId,
          };
        }
        return gt;
      })
    );
    const sourceGate = STADIUMS_PRESETS[0].gates.find(g => g.id === fromId) || { name: `Gate ${fromId.toUpperCase()}` };
    const targetGate = STADIUMS_PRESETS[0].gates.find(g => g.id === toId) || { name: `Gate ${toId.toUpperCase()}` };
    const message = `Diverting flow: Turnstile ${sourceGate.name} ingress redirected to alternate pathway ${targetGate.name}.`;
    logCommand(`[DEFLECTION RULE] Override active: ${message}`, 'warning');
    speakText(`Override. Ingress deflected from ${sourceGate.name} to ${targetGate.name}. High-volume sensors synced.`);
  };

  const handleTriggerDrillAlarm = () => {
    const nextDrillState = !isDrillAlarmActive;
    setIsDrillAlarmActive(nextDrillState);
    if (nextDrillState) {
      logCommand('🚨 [DRILL INITIATION] Simulated emergency drill active. Concentric radar sweep and sound warnings broadcast.', 'critical');
      speakText('Attention! A physical crowd evacuation drill has been activated. Please follow the safety wayfinders and walk coolly toward your nearest gate.');
      setActiveBroadcastText('🚨 IMMERSIVE EVACUATION DRILL ACTIVE: REMAIN CALM AND PROCEED TO THE NEAREST RAMP RIDGE');
    } else {
      logCommand('✔️ [DRILL DEACTIVATION] Simulated security drill terminated. Operational parameters normalized.', 'info');
      speakText('Operations drill complete. Restoring normal stadium telemetry.');
      setActiveBroadcastText('🚨 ALL SPECTATOR CHECKPOINTS REPORTING NORMAL WORKFLOWS');
    }
  };

  const handleResetTriageToBaseline = () => {
    setTriageCases([
      {
        id: 'tc_g4_surge',
        gateId: 'g4',
        title: 'Gate 4 Influx Bottleneck Surge',
        severity: 'critical',
        status: 'red',
        impactAreaMeters: 140,
        pulseDirection: 'increasing',
        timestamp: '05:10 AM',
        description: 'Localized ticket barcode reader fault is leading to extreme queue accumulation at the South Stand.',
        actionTaken: '',
      },
      {
        id: 'tc_c3_baggage',
        gateId: 'g1',
        title: 'Sector C North Walkway Object',
        severity: 'alert',
        status: 'red',
        impactAreaMeters: 70,
        pulseDirection: 'decreasing',
        timestamp: '05:07 AM',
        description: 'CCTV Camera 6 flagged an unattended backpack near the food stall zone boundary.',
        actionTaken: '',
      },
      {
        id: 'tc_g5_med',
        gateId: 'g5',
        title: 'West Plaza Medical Request Escalation',
        severity: 'info',
        status: 'yellow',
        impactAreaMeters: 40,
        pulseDirection: 'stable',
        timestamp: '05:05 AM',
        description: 'Operator dispatched wheelchair standby team to assist an elderly patron displaying warm dehydration fatigue.',
        actionTaken: 'Operator dispatched dynamic EMT taskforce and provided fresh hydration.',
      }
    ]);
    setIsDrillAlarmActive(false);
    logCommand('[TELEMETRY_SYNC] baseline triage indices and drill vectors restored to factory state.', 'info');
    speakText("Completed reset of triage dashboard data.");
  };

  const handleStadiumChange = (stadiumId: string) => {
    setActiveStadiumId(stadiumId);
    const preset = STADIUMS_PRESETS.find(s => s.id === stadiumId) || STADIUMS_PRESETS[0];
    setGates(preset.gates);
    setCameras(preset.cameras);
    setSelectedGateId('g4'); // Default focusing stand-by

    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const logMsg: CommandLog = {
      id: `stadium-shift-${Date.now()}`,
      timestamp,
      type: 'info',
      source: 'SYSTEM',
      message: `Switched command sector to ${preset.name.toUpperCase()} (${preset.location.toUpperCase()}). Loaded tactical nodes.`,
      resolved: true,
    };
    setLogs(prev => [logMsg, ...prev]);
    speakText(`Switched active command stadium to ${preset.name}`);
  };

  // Derive active preset stadium
  const activeStadium = STADIUMS_PRESETS.find(s => s.id === activeStadiumId) || STADIUMS_PRESETS[0];

  // Derive global capacity metrics
  const totalOccupancyValue = gates.reduce((sum, current) => sum + current.occupancy, 0);

  const currentScenario = PRESENTATION_SCENARIOS.find(s => s.id === activeScenarioId) || PRESENTATION_SCENARIOS[0];
  const currentStep = currentScenario.steps[activeStepIndex] || currentScenario.steps[0];
  const activeThreatId = currentStep.activeThreatId || null;

  // Custom text-scaler classes mapper
  const textScaleClass = 
    textSize === 'large' ? 'text-[1.1rem] leading-relaxed' :
    textSize === 'extra-large' ? 'text-[1.25rem] leading-loose' : 'text-sm';

  const activeTheme = iplThemes[activeStadium.match.battingTeam] || iplThemes.RCB;

  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 p-4 md:p-6 transition-colors duration-1000" 
      id="crowdflow-app-root"
      style={{ 
        backgroundColor: activeTheme.secondary,
        fontSize: textSize === 'large' ? '108%' : textSize === 'extra-large' ? '120%' : '100%',
        filter: colorBlindMode !== 'normal' ? `url(#${colorBlindMode}-filter)` : undefined
      }}
    >
      
      {/* 1. Tactical Command Header */}
      <header className="mb-4 flex flex-col xl:flex-row items-center xl:items-stretch justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-2xl relative" id="stadium-header">
        
        {/* Project Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.25)] shrink-0">
            <Flame className="w-6 h-6 text-cyan-400 rotate-12" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white uppercase select-none">
                Crowdflow AI Stadium Command
              </h1>
              <span className="bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold text-[8px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded-sm">
                Unified Ops
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
              <span>Matchday Operations Hub: Agentic Cricket Stadium Crowd Suite</span>
            </p>
          </div>
        </div>

        {/* Live HUD Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/80 px-4 py-2 border border-slate-800/80 rounded-lg font-mono text-[10px] text-slate-400 w-full xl:w-auto">
          <div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Total Entry Scans</p>
            <p className="text-lg font-bold text-slate-200 mt-0.5">{totalOccupancyValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Avg Gate Delay</p>
            <p className="text-lg font-bold text-teal-400 mt-0.5">17 Sec (Normal)</p>
          </div>
          <div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Match Overs</p>
            <p className="text-lg font-bold text-amber-400 mt-0.5">Time: {Math.floor(matchMinutes / 6)}.{matchMinutes % 6}</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
            <div className="text-right">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px]">Local Time</p>
              <p className="text-slate-200 font-semibold text-xs tabular-nums">{systemTime}</p>
            </div>
          </div>
        </div>

        {/* Sync Status Ticker Button */}
        <div className="flex items-center gap-3 text-xs bg-slate-950/40 px-3 py-1 bg-black/35 rounded border border-slate-850/80 self-center">
          <div className="relative flex h-2 w-2 shrink-0">
            <span className={`${flashingEnabled ? 'animate-ping' : ''} absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75`}></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </div>
          <span className="font-mono text-[10px] text-slate-400 select-all">GRIDSTREAM: SECURE</span>
        </div>
      </header>

      {/* 2. Global Marquee Alert / Ticker (Highly visible tactile notification address) */}
      {activeBroadcastText && (
        <div 
          className="mb-4 bg-amber-950/90 border-y border-amber-500 text-amber-300 py-1.5 px-4 overflow-hidden relative shadow-lg flex items-center shrink-0"
          id="stadium-marquee-banner"
        >
          <Megaphone className="w-4.5 h-4.5 text-amber-400 shrink-0 mr-3 animate-bounce" />
          <div className="flex-1 overflow-hidden relative h-5">
            <div className="absolute whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:pause text-xs font-mono font-extrabold uppercase tracking-wide">
              {activeBroadcastText}
            </div>
          </div>
        </div>
      )}

      {/* 3. Multi-Tab Navigation Deck (Fully Accessible, Keyboard Friendly, large hoverable elements) */}
      <nav className="mb-4 bg-slate-900 border border-slate-800 p-1.5 rounded-xl flex flex-wrap gap-1 shadow-md" id="stadium-nav-tabs">
        <button
          id="nav-tab-dashboard"
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'dashboard' ? 'bg-cyan-500 text-slate-950 shadow-inner' : 'bg-transparent text-slate-400 hover:text-slate-250 hover:bg-slate-850'}`}
          aria-label="Navigate to Live Dashboard overview"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          id="nav-tab-analytics"
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'analytics' ? 'bg-cyan-500 text-slate-950 shadow-inner' : 'bg-transparent text-slate-400 hover:text-slate-250 hover:bg-slate-850'}`}
          aria-label="Navigate to Ingress Analytics Charts"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics Charts</span>
        </button>

        <button
          id="nav-tab-simulation"
          onClick={() => setActiveTab('simulation')}
          className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'simulation' ? 'bg-cyan-500 text-slate-950 shadow-inner' : 'bg-transparent text-slate-400 hover:text-slate-250 hover:bg-slate-850'}`}
          aria-label="Navigate to Interactive 2D Crowd Flow Simulator"
        >
          <Waves className="w-4 h-4" />
          <span>3D Simulation</span>
        </button>

        <button
          id="nav-tab-emergency"
          onClick={() => setActiveTab('emergency')}
          className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg flex items-center justify-center gap-1.5 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'emergency' ? 'bg-cyan-500 text-slate-950 shadow-inner' : 'bg-transparent text-slate-400 hover:text-slate-250 hover:bg-slate-850'}`}
          aria-label="Navigate to Emergency Operations deck"
        >
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <span className="text-red-500">Emergency Deck</span>
        </button>

        <button
          id="nav-tab-ticketing"
          onClick={() => setActiveTab('ticketing')}
          className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'ticketing' ? 'bg-cyan-500 text-slate-950 shadow-inner' : 'bg-transparent text-slate-400 hover:text-slate-250 hover:bg-slate-850'}`}
          aria-label="Navigate to Ticket booking and Swag counter"
        >
          <Ticket className="w-4 h-4 text-cyan-400" />
          <span>Tickets & Swags</span>
        </button>

        <button
          id="nav-tab-settings"
          onClick={() => setActiveTab('settings')}
          className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'settings' ? 'bg-cyan-500 text-slate-950 shadow-inner' : 'bg-transparent text-slate-400 hover:text-slate-250 hover:bg-slate-850'}`}
          aria-label="Navigate to DEI Accessibility config board"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>DEI Settings</span>
        </button>
      </nav>

      {/* 4. Tab Core Routing Container */}
      <main className="flex-1 flex flex-col mb-4">
        
        {/* TAB 1: Live dashboard core */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-6" id="dashboard-view">
            
            {/* Multi-role Secure Gateway Portal */}
            <RoleAuthenticationCenter
              activeRole={activeRole}
              onRoleChange={setActiveRole}
              gates={gates}
              logs={logs}
              onAddLog={handleAddCustomIncidentLog}
              onResetSystem={handleResetTelemetryGrid}
              onTriggerPA={handleDispatchGlobalBroadcast}
              activeStadiumName={activeStadium.name}
            />

            {/* Scenario Timeline trigger deck */}
            <section id="scenario-timeline-section">
              <HappyPathController
                scenarios={PRESENTATION_SCENARIOS}
                activeScenarioId={activeScenarioId}
                activeStepIndex={activeStepIndex}
                onSelectScenario={(id) => {
                  setActiveScenarioId(id);
                  setActiveStepIndex(0);
                }}
                onSelectStep={(idx) => {
                  setActiveStepIndex(idx);
                }}
              />
            </section>

            {/* Stadium Match Center Display */}
            <StadiumMatchCenter
              stadiums={STADIUMS_PRESETS}
              activeStadium={activeStadium}
              onStadiumChange={handleStadiumChange}
            />

            {/* Live Triage Operations, Match Scores, and Route Deflection Matrix */}
            <StadiumTriageOperations
              gates={gates}
              match={activeStadium.match}
              triageCases={triageCases}
              onUpdateTriageCase={handleUpdateTriageCase}
              onClearAllResolved={handleClearAllResolved}
              onTriggerDeflection={handleTriggerDeflection}
              onTriggerDrillAlarm={handleTriggerDrillAlarm}
              onResetTriageToBaseline={handleResetTriageToBaseline}
              speakText={speakText}
            />

            {/* Main Interactive Grid map and CCTV columns */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="dashboard-core-grid">
              
              {/* Core interactive SVG-blueprint */}
              <div className="xl:col-span-2 flex flex-col gap-6">
                <StadiumControlMap
                  gates={gates}
                  activeThreatId={activeThreatId}
                  mapOverlayType={currentStep.mapOverlayType}
                  selectedGateId={selectedGateId}
                  triageCases={triageCases}
                  isDrillAlarmActive={isDrillAlarmActive}
                  onSelectGate={(id) => {
                    setSelectedGateId(id);
                  }}
                />

                <CheckpointStats gates={gates} />
              </div>

              {/* CCTV Video feed and Focus statistics card */}
              <div className="xl:col-span-1 flex flex-col h-full gap-6">
                <StadiumCCTV
                  cameras={cameras}
                  onToggleHighlight={handleCctvHighlightToggle}
                  activeThreatId={activeThreatId}
                />
                
                <SmartRouter />
                <CrowdTrends />

                {selectedGateId && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl mt-6 font-mono text-xs flex flex-col gap-2.5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5 uppercase">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        <span>Focus: {gates.find(g => g.id === selectedGateId)?.name}</span>
                      </span>
                      <span className="bg-slate-950 px-2 py-0.5 rounded text-[10px] text-slate-400 border border-slate-850">
                        {gates.find(g => g.id === selectedGateId)?.id.toUpperCase()}
                      </span>
                    </div>

                    {(() => {
                      const g = gates.find(g => g.id === selectedGateId);
                      if (!g) return null;
                      const statusColor = 
                        g.status === 'optimal' ? 'text-emerald-400 bg-emerald-950/60 border-emerald-900/60' :
                        g.status === 'congested' ? 'text-rose-400 bg-rose-950/60 border-rose-900/60' :
                        g.status === 'emergency_redirect' ? 'text-cyan-400 bg-cyan-950/60 border-cyan-900/60' : 'text-amber-400';

                      return (
                        <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                          <div className="bg-slate-950/40 p-2 rounded border border-slate-850">
                            <p className="text-slate-500 uppercase font-bold text-[9px] mb-0.5">Status telemetry</p>
                            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${statusColor}`}>{g.status.toUpperCase()}</span>
                          </div>

                          <div className="bg-slate-950/40 p-2 rounded border border-slate-850">
                            <p className="text-slate-500 uppercase font-bold text-[9px] mb-0.5">Tickets speed</p>
                            <span className="text-slate-200 font-bold">{g.scanSpeed}s avg / guest</span>
                          </div>

                          <div className="bg-slate-950/40 p-2 rounded border border-slate-850">
                            <p className="text-slate-500 uppercase font-bold text-[9px] mb-0.5">Flow rate velocity</p>
                            <span className="text-slate-200 font-bold">{g.flowRate} fans / min</span>
                          </div>

                          <div className="bg-slate-950/40 p-2 rounded border border-slate-850">
                            <p className="text-slate-500 uppercase font-bold text-[9px] mb-0.5">Tactical duty guards</p>
                            <span className="text-slate-200 font-bold">{g.activeGuards} stationed</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Traffic Flow Analysis & Active Security Incidents response feed */}
            <TrafficAndIncidents
              gates={gates}
              logs={logs}
              onToggleResolve={handleToggleLogResolution}
              onQuickBypass={handleManualRedirect}
              onAddCustomIncident={(type, source, msg) => {
                handleAddCustomIncidentLog({
                  type,
                  source,
                  message: msg,
                  resolved: false
                });
              }}
            />

            {/* Platform Mobile Simulator (Android & iOS Scalability) */}
            <PlatformMobileSimulator
              gates={gates}
              logs={logs}
              onAddLog={handleAddCustomIncidentLog}
              selectedStadiumName={activeStadium.name}
            />

            {/* Tactical Console Command Logs log feed and actions triggers */}
            <section id="tactical-logs-console">
              <AgenticActionConsole
                logs={logs}
                gates={gates}
                onDispatchAction={handleDispatchAction}
                onClearLogs={handleClearLogs}
                onManualRedirect={handleManualRedirect}
                onToggleLogResolution={handleToggleLogResolution}
              />
            </section>
          </div>
        )}

        {/* TAB 2: Dynamic Analytics and Charts */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-6" id="analytics-view">
            <AnalyticsCharts gates={gates} />
            <CheckpointStats gates={gates} />
          </div>
        )}

        {/* TAB 3: Interactive Crowd Flow Particle particles simulator */}
        {activeTab === 'simulation' && (
          <div className="flex flex-col gap-6" id="simulation-view">
            <h2 className="text-xl font-bold text-cyan-400 border-b border-slate-800 pb-2">Stadium 3D Digital Twin</h2>
            <Stadium3DView />
            
            {/* Provide happy path stepping so judges can see dynamic changes in flow live */}
            <HappyPathController
              scenarios={PRESENTATION_SCENARIOS}
              activeScenarioId={activeScenarioId}
              activeStepIndex={activeStepIndex}
              onSelectScenario={(id) => {
                setActiveScenarioId(id);
                setActiveStepIndex(0);
              }}
              onSelectStep={(idx) => {
                setActiveStepIndex(idx);
              }}
            />
            <StadiumSimulation3D gates={gates} />
          </div>
        )}

        {/* TAB 4: Emergency Incident and Broadcast PA Systems */}
        {activeTab === 'emergency' && (
          <div className="flex flex-col gap-6" id="emergency-view">
            <EmergencyManagement
              onAddIncidentLog={handleAddCustomIncidentLog}
              onDispatchGlobalBroadcast={handleDispatchGlobalBroadcast}
              activeBroadcastText={activeBroadcastText}
              speakEnabled={ttsEnabled}
              speakText={speakText}
              onDispatchProceduralPlan={handleDispatchProceduralPlan}
              gates={gates}
              autoPilotActive={autoPilotActive}
              setAutoPilotActive={setAutoPilotActive}
              congestionThreshold={congestionThreshold}
              setCongestionThreshold={setCongestionThreshold}
              automatedLogs={automatedLogs}
            />
          </div>
        )}

        {/* TAB 6: Online Ticketing and Merchandise Distribution */}
        {activeTab === 'ticketing' && (
          <div className="flex flex-col gap-6" id="ticketing-view">
            <StadiumTicketingAndSwags
              gates={gates}
              bookedTickets={bookedTickets}
              onBookTicket={handleBookTicket}
              onVerifyTicket={handleVerifyTicket}
              swags={swags}
              onDistributeSwag={handleDistributeSwag}
              onResetInventory={handleResetInventory}
              isVolunteerLoggedIn={activeRole === 'volunteer'}
              activeRole={activeRole}
            />
          </div>
        )}

        {/* TAB 5: Accessible DEI configuration parameters */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-6" id="settings-view">
            <AccessibilityControls
              colorBlindMode={colorBlindMode}
              setColorBlindMode={(mode) => {
                setColorBlindMode(mode);
                try { localStorage.setItem('crowdflow_color_blind', mode); } catch (e) {}
                speakText(`Color blindness mode set to ${mode}`);
              }}
              textSize={textSize}
              setTextSize={(size) => {
                setTextSize(size);
                try { localStorage.setItem('crowdflow_text_scale', size); } catch (e) {}
                speakText(`Text scale size set to ${size}`);
              }}
              ttsEnabled={ttsEnabled}
              setTtsEnabled={(enabled) => {
                setTtsEnabled(enabled);
                try { localStorage.setItem('crowdflow_tts', String(enabled)); } catch (e) {}
              }}
              flashingEnabled={flashingEnabled}
              setFlashingEnabled={(enabled) => {
                setFlashingEnabled(enabled);
                try { localStorage.setItem('crowdflow_sirens_flash', String(enabled)); } catch (e) {}
                speakText(`Sensory flickering and flashes ${enabled ? 'enabled' : 'disabled'}`);
              }}
              highContrast={highContrast}
              setHighContrast={(val) => {
                setHighContrast(val);
                speakText(`Contrast toggled`);
              }}
              speakText={speakText}
              activeStadiumId={activeStadiumId}
              wheelchairAssist={wheelchairAssist}
              setWheelchairAssist={setWheelchairAssist}
              sensoryQuietMode={sensoryQuietMode}
              setSensoryQuietMode={setSensoryQuietMode}
              signLanguageTicker={signLanguageTicker}
              setSignLanguageTicker={setSignLanguageTicker}
              familyRestroomGuides={familyRestroomGuides}
              setFamilyRestroomGuides={setFamilyRestroomGuides}
              socioEconomicSubsidy={socioEconomicSubsidy}
              setSocioEconomicSubsidy={setSocioEconomicSubsidy}
            />
          </div>
        )}

      </main>

      {/* 5. Production Footer with live host metadata */}
      <footer className="mt-auto border-t border-slate-800/85 pt-4 text-center text-[10px] text-slate-500 font-mono flex flex-col md:flex-row items-center justify-between gap-2" id="command-footer">
        <p>© 2026 Crowdflow Stadium Command. Unified Matchday Security Infrastructure.</p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Server className="w-3.5 h-3.5 text-cyan-500" />
            <span>CLOUD RUN SANDBOX GRID INGRESS</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1 text-emerald-500 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60 font-bold text-[9px]">
            <Wifi className="w-3 h-3 animate-pulse" />
            <span>STADIUM SECURE CHANNEL: ACTIVE</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
