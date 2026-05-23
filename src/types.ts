/**
 * @file types.ts
 * @description Types, interfaces, and enums for Crowdflow Stadium Command.
 */

export interface TurnstileGate {
  id: string;
  name: string;
  status: 'optimal' | 'moderate' | 'congested' | 'emergency_redirect' | 'closed';
  flowRate: number; // people per minute entered
  scanSpeed: number; // average scan time in seconds
  capacity: number; // maximum limit
  occupancy: number; // current count of people entered
  redirectionTarget?: string; // Redirecting crowd to this gate ID
  activeGuards: number;
}

export interface SecurityCamera {
  id: string;
  location: string;
  status: 'online' | 'analyzing' | 'alert' | 'offline';
  aiLabel: string;
  peopleCount: number;
  highlightThreat: boolean;
}

export interface CommandLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'critical' | 'action_dispatched';
  source: 'SYSTEM' | 'AI_AGENT' | 'SECURITY' | 'TICKETING';
  message: string;
  resolved: boolean;
}

export interface EmergencyPlan {
  id: string;
  title: string;
  type: 'weather' | 'security' | 'medical' | 'exodus';
  severity: 'low' | 'medium' | 'high';
  description: string;
  steps: string[];
}

export interface ScenarioStep {
  name: string;
  description: string;
  mapOverlayType: 'heatmap_gate4' | 'heatmap_security_c' | 'heatmap_exodus' | 'normal';
  gatesStatus: Record<string, Partial<TurnstileGate>>;
  activeThreatId?: string;
  aiSuggestedAction: string;
  systemLogsAdded: Omit<CommandLog, 'id' | 'timestamp'>[];
}

export interface SimulatorScenario {
  id: string;
  title: string;
  icon: string;
  description: string;
  steps: ScenarioStep[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  text: string;
  isAiThinking?: boolean;
}

export interface CricketMatch {
  battingTeam: string;
  bowlingTeam: string;
  score: string;
  overs: string;
  wickets: number;
  target?: string;
  runsNeeded?: string;
  recentBalls: string[];
  batsman1: { name: string; runs: number; balls: number; fours: number; sixes: number };
  batsman2: { name: string; runs: number; balls: number; fours: number; sixes: number };
  bowler: { name: string; overs: string; maidens: number; runs: number; wickets: number };
  matchStatus: string;
}

export interface StadiumData {
  id: string;
  name: string;
  location: string;
  capacity: number;
  occupancy: number; // calculated as sum of gate occupancies
  gates: TurnstileGate[];
  cameras: SecurityCamera[];
  match: CricketMatch;
  trafficIndex: 'OPTIMAL' | 'MODERATE' | 'HEAVY' | 'CONGESTED' | 'CRITICAL';
  averageScanSpeed: number;
}

export type UserRole = 'admin' | 'ops' | 'security' | 'volunteer' | 'manager' | 'sponsor';

export interface BookedTicket {
  id: string;
  holderName: string;
  phone: string;
  section: string;
  seatsCount: number;
  price: number;
  gateId: string;
  qrCode: string;
  status: 'pending' | 'verified';
  timestamp: string;
}

export interface SwagItem {
  id: string;
  name: string;
  totalDistributed: number;
  stockRemaining: number;
}

export interface TriageCase {
  id: string;
  gateId: string;
  title: string;
  severity: 'critical' | 'alert' | 'info';
  status: 'red' | 'yellow' | 'green'; // red = active/unacknowledged, yellow = managed/rerouted, green = resolved/cleared
  impactAreaMeters: number;
  pulseDirection: 'increasing' | 'decreasing' | 'stable';
  timestamp: string;
  description: string;
  actionTaken: string;
}


