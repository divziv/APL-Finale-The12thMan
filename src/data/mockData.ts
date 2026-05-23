import { Zone, Alert, EvacuationRoute, CCTVFeed, NavigationSuggestion, TimeSeriesData } from '../types';

export const initialZones: Zone[] = [
  { id: 'a1', name: 'Section A-1', status: 'safe', currentCount: 245, capacity: 500, x: 50, y: 50, width: 120, height: 100 },
  { id: 'a2', name: 'Section A-2', status: 'moderate', currentCount: 420, capacity: 500, x: 180, y: 50, width: 120, height: 100 },
  { id: 'a3', name: 'Section A-3', status: 'congested', currentCount: 485, capacity: 500, x: 310, y: 50, width: 120, height: 100 },
  { id: 'b1', name: 'Section B-1', status: 'safe', currentCount: 180, capacity: 450, x: 50, y: 170, width: 120, height: 100 },
  { id: 'b2', name: 'Section B-2', status: 'moderate', currentCount: 350, capacity: 450, x: 180, y: 170, width: 120, height: 100 },
  { id: 'b3', name: 'Section B-3', status: 'safe', currentCount: 220, capacity: 450, x: 310, y: 170, width: 120, height: 100 },
  { id: 'c1', name: 'Section C-1', status: 'moderate', currentCount: 380, capacity: 550, x: 50, y: 290, width: 120, height: 100 },
  { id: 'c2', name: 'Section C-2', status: 'congested', currentCount: 530, capacity: 550, x: 180, y: 290, width: 120, height: 100 },
  { id: 'c3', name: 'Section C-3', status: 'critical', currentCount: 540, capacity: 550, x: 310, y: 290, width: 120, height: 100 },
  { id: 'concourse-n', name: 'North Concourse', status: 'safe', currentCount: 150, capacity: 800, x: 140, y: 10, width: 140, height: 30 },
  { id: 'concourse-s', name: 'South Concourse', status: 'moderate', currentCount: 450, capacity: 800, x: 140, y: 400, width: 140, height: 30 },
];

export const alertTemplates: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>[] = [
  { zoneId: 'a3', message: 'Zone A-3 approaching capacity limit', severity: 'warning' },
  { zoneId: 'c3', message: 'Critical overcrowding in Section C-3', severity: 'critical' },
  { zoneId: 'c2', message: 'High density detected in Section C-2', severity: 'warning' },
  { zoneId: 'concourse-s', message: 'South Concourse congestion building', severity: 'info' },
  { message: 'Emergency route activated - Gate 2', severity: 'emergency' },
  { message: 'Medical assistance requested - Section B-2', severity: 'critical' },
  { zoneId: 'b2', message: 'Section B-2 crowd stabilizing', severity: 'info' },
  { message: 'AI detection system calibrated successfully', severity: 'info' },
  { zoneId: 'a1', message: 'Section A-1 now considered safe', severity: 'info' },
  { message: 'Security team dispatched to Section C-3', severity: 'warning' },
];

export const evacuationRoutes: EvacuationRoute[] = [
  { id: 'gate-1', name: 'Gate 1 - North Exit', status: 'active', capacity: 200, currentFlow: 145 },
  { id: 'gate-2', name: 'Gate 2 - East Exit', status: 'active', capacity: 250, currentFlow: 180 },
  { id: 'gate-3', name: 'Gate 3 - South Exit', status: 'standby', capacity: 200, currentFlow: 95 },
  { id: 'gate-4', name: 'Gate 4 - West Exit', status: 'active', capacity: 250, currentFlow: 120 },
  { id: 'emergency-a', name: 'Emergency Exit A', status: 'standby', capacity: 150, currentFlow: 0 },
  { id: 'emergency-b', name: 'Emergency Exit B', status: 'standby', capacity: 150, currentFlow: 0 },
];

export const cctvFeeds: CCTVFeed[] = [
  { id: 'cam-1', name: 'Camera 1', location: 'Section A', status: 'analyzing', peopleCount: 245, aiActive: true },
  { id: 'cam-2', name: 'Camera 2', location: 'Section B', status: 'analyzing', peopleCount: 420, aiActive: true },
  { id: 'cam-3', name: 'Camera 3', location: 'Section C', status: 'analyzing', peopleCount: 530, aiActive: true },
  { id: 'cam-4', name: 'Camera 4', location: 'North Concourse', status: 'online', peopleCount: 150, aiActive: false },
  { id: 'cam-5', name: 'Camera 5', location: 'South Concourse', status: 'online', peopleCount: 450, aiActive: false },
  { id: 'cam-6', name: 'Camera 6', location: 'Main Entrance', status: 'analyzing', peopleCount: 320, aiActive: true },
];

export const navigationSuggestions: NavigationSuggestion[] = [
  { id: '1', message: 'Use Gate 2 for faster exit - 40% less crowded', destination: 'Gate 2', eta: '3 min', crowdLevel: 'safe' },
  { id: '2', message: 'Corridor B is less crowded than Corridor A', destination: 'Corridor B', eta: '5 min', crowdLevel: 'moderate' },
  { id: '3', message: 'Nearest restroom has low queue', destination: 'Restroom C', eta: '2 min', crowdLevel: 'safe' },
  { id: '4', message: 'Food court section D has shortest lines', destination: 'Food Court D', eta: '6 min', crowdLevel: 'moderate' },
];

export function generateTimeSeriesData(hours: number = 4): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const now = new Date();
  const baseCount = 1500;

  for (let i = hours * 60; i >= 0; i -= 5) {
    const time = new Date(now.getTime() - i * 60000);
    const variance = Math.sin((hours * 60 - i) / 60) * 500 + Math.random() * 200;
    const count = Math.max(500, Math.min(5000, baseCount + variance));

    data.push({
      timestamp: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      count: Math.round(count),
    });
  }

  return data;
}

export function generateZoneTimeSeries(zones: Zone[], points: number = 12): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const now = new Date();

  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 300000);
    const entry: TimeSeriesData = {
      timestamp: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      count: 0,
    };

    zones.forEach(zone => {
      const variance = Math.random() * zone.capacity * 0.3;
      entry[zone.name] = Math.max(100, zone.currentCount + variance - zone.currentCount * 0.3);
    });

    data.push(entry);
  }

  return data;
}
