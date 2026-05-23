export type ZoneStatus = 'safe' | 'moderate' | 'congested' | 'critical';

export type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';

export interface Zone {
  id: string;
  name: string;
  status: ZoneStatus;
  currentCount: number;
  capacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Alert {
  id: string;
  zoneId?: string;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
  acknowledged: boolean;
}

export interface CrowdMetrics {
  totalCount: number;
  activeAlerts: number;
  safeZones: number;
  congestedZones: number;
  emergencyMode: boolean;
}

export interface TimeSeriesData {
  timestamp: string;
  count: number;
  zone?: string;
  [key: string]: string | number | undefined;
}

export interface AIResponse {
  frameCount: number;
  peopleCount: number;
  confidence: number;
  timestamp: Date;
}

export interface EvacuationRoute {
  id: string;
  name: string;
  status: 'active' | 'standby' | 'blocked';
  capacity: number;
  currentFlow: number;
}

export interface CCTVFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'analyzing';
  peopleCount: number;
  aiActive: boolean;
}

export interface NavigationSuggestion {
  id: string;
  message: string;
  destination: string;
  eta: string;
  crowdLevel: ZoneStatus;
}

export interface UserLocation {
  zoneId: string;
  zoneName: string;
  nearbyExits: string[];
}
