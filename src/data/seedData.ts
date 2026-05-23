/**
 * @file seedData.ts
 * @description Provides initial mock stadium states, gates, cameras, and presentation scenarios.
 */

import { TurnstileGate, SecurityCamera, CommandLog, EmergencyPlan, SimulatorScenario } from '../types';

/**
 * Generates initial turnstile gate data.
 * @returns {TurnstileGate[]} Array of pre-loaded stadium access points
 */
export function getInitialGates(): TurnstileGate[] {
  return [
    {
      id: 'g1',
      name: 'Gate 1 (North Stand)',
      status: 'optimal',
      flowRate: 32,
      scanSpeed: 1.8,
      capacity: 12000,
      occupancy: 4200,
      activeGuards: 8,
    },
    {
      id: 'g2',
      name: 'Gate 2 (East Concourse)',
      status: 'optimal',
      flowRate: 28,
      scanSpeed: 1.9,
      capacity: 10000,
      occupancy: 3800,
      activeGuards: 6,
    },
    {
      id: 'g3',
      name: 'Gate 3 (VIP & Media)',
      status: 'optimal',
      flowRate: 12,
      scanSpeed: 2.1,
      capacity: 3000,
      occupancy: 950,
      activeGuards: 12,
    },
    {
      id: 'g4',
      name: 'Gate 4 (South Stand)',
      status: 'optimal',
      flowRate: 45,
      scanSpeed: 1.7,
      capacity: 15000,
      occupancy: 6100,
      activeGuards: 10,
    },
    {
      id: 'g5',
      name: 'Gate 5 (West Concourse)',
      status: 'optimal',
      flowRate: 30,
      scanSpeed: 2.0,
      capacity: 11000,
      occupancy: 4500,
      activeGuards: 6,
    },
    {
      id: 'g6',
      name: 'Gate 6 (South-East Deck)',
      status: 'optimal',
      flowRate: 35,
      scanSpeed: 1.8,
      capacity: 12000,
      occupancy: 5200,
      activeGuards: 8,
    },
  ];
}

/**
 * Generates initial CCTV cameras with status and computer vision outputs.
 * @returns {SecurityCamera[]} Set of cameras monitoring key stadium segments
 */
export function getInitialCameras(): SecurityCamera[] {
  return [
    {
      id: 'cam1',
      location: 'South Turnstiles (Gate 4)',
      status: 'online',
      aiLabel: 'DENSITY: NORMAL (54 people/frame)',
      peopleCount: 120,
      highlightThreat: false,
    },
    {
      id: 'cam2',
      location: 'Concourse Walkway B',
      status: 'online',
      aiLabel: 'FLOW RATE: OPTIMAL',
      peopleCount: 45,
      highlightThreat: false,
    },
    {
      id: 'cam3',
      location: 'East Outer Plaza',
      status: 'online',
      aiLabel: 'PATTERNS: NO SURGES',
      peopleCount: 88,
      highlightThreat: false,
    },
    {
      id: 'cam4',
      location: 'West Access Ramp',
      status: 'online',
      aiLabel: 'FLOW RATE: OPTIMAL',
      peopleCount: 30,
      highlightThreat: false,
    },
    {
      id: 'cam5',
      location: 'VIP Portal Exit',
      status: 'online',
      aiLabel: 'DENSITY: LOW',
      peopleCount: 12,
      highlightThreat: false,
    },
    {
      id: 'cam6',
      location: 'North Concourse Sector C',
      status: 'online',
      aiLabel: 'NO BLOCKAGES DETECTED',
      peopleCount: 60,
      highlightThreat: false,
    },
  ];
}

/**
 * Standard emergency procedures to deploy on manual triggers.
 */
export const EMERGENCY_PLANS: EmergencyPlan[] = [
  {
    id: 'plan_weather',
    title: 'Severe Thunderstorm & Lightning Action Draft',
    type: 'weather',
    severity: 'high',
    description: 'Suspend roof structures, pull personnel off sky decks, and clear high exposable structures.',
    steps: [
      'Trigger flash announcement sirens.',
      'Broadcast concourse sheltering directions.',
      'Configure turnstiles as open-access shelters (one-way entry).',
      'Mobilize Sector B/C quick-guides to shelter gateways.'
    ]
  },
  {
    id: 'plan_security',
    title: 'Suspicious Object / sector Block Protocol',
    type: 'security',
    severity: 'high',
    description: 'Quick-isolates an area where security or luggage breach is detected while keeping other sectors normal.',
    steps: [
      'Lock-out immediate turnstile zones in proximity.',
      'Establish a 50m cordoned perimeter.',
      'Auto-dispatch tactical response squad.',
      'Open backup exit gates on opposite side to ease immediate pressure.'
    ]
  },
  {
    id: 'plan_exodus',
    title: 'Post-Match High Outflow Plan',
    type: 'exodus',
    severity: 'medium',
    description: 'Turns stadium systems into outbound-flush mode supporting fast rail/metro integration.',
    steps: [
      'Switch all turnstiles to outbound exit-only.',
      'Synchronize public transit timing alerts on big screens.',
      'Open double fire-barriers to double egress paths.',
      'Deploy volunteer monitors to direct travelers to Metro shuttles.'
    ]
  }
];

/**
 * Standard simulated logs to demonstrate live feed on load.
 * @returns {CommandLog[]} Initial logs
 */
export function getInitialLogs(): CommandLog[] {
  return [
    {
      id: 'log-1',
      timestamp: '05:01',
      type: 'info',
      source: 'SYSTEM',
      message: 'Stadium Command operations successfully initialized for Matchday #3.',
      resolved: true,
    },
    {
      id: 'log-2',
      timestamp: '05:03',
      type: 'info',
      source: 'TICKETING',
      message: 'E-Ticket turnstile synchronization online. 6/6 entry hubs ready.',
      resolved: true,
    },
    {
      id: 'log-3',
      timestamp: '05:05',
      type: 'info',
      source: 'AI_AGENT',
      message: 'Crowdflow AI began continuous monitoring. Initial crowd metrics normal.',
      resolved: true,
    },
    {
      id: 'log-4',
      timestamp: '05:09',
      type: 'info',
      source: 'SECURITY',
      message: 'Guard stations 1-12 reporting active deployment on outer rings.',
      resolved: true,
    },
  ];
}

/**
 * Presentation scenario timeline that maps the Happy Path for judges.
 */
export const PRESENTATION_SCENARIOS: SimulatorScenario[] = [
  {
    id: 'scen_gate4_congestion',
    title: 'Scenario 1: Gate 4 pre-match bottleneck',
    icon: 'AlertTriangle',
    description: 'A sudden arrival surge at Gate 4 causes pre-match queue bottlenecks, threatening flow collapse before kickoff.',
    steps: [
      {
        name: 'Step 1: Surge Detected',
        description: 'AI vision triggers a WARNING alert. Over 180 people waiting. Flow rate drops. Scanning speeds drop to 3.8s per ticket due to a localized reader crash.',
        mapOverlayType: 'heatmap_gate4',
        gatesStatus: {
          g4: { status: 'congested', flowRate: 98, scanSpeed: 3.8 },
        },
        activeThreatId: 'g4',
        aiSuggestedAction: 'Initiate Gate 4 queue diversion. Redirect South Stand fans to alternative Gate 6 (South-East). Open standby manual tickets.',
        systemLogsAdded: [
          {
            type: 'warning',
            source: 'AI_AGENT',
            message: 'CRITICAL CONGESTION DETECTED at Gate 4. Crowd count exceeded safety threshold. Recommending immediate rerouting sequence to Gate 6.',
            resolved: false,
          }
        ]
      },
      {
        name: 'Step 2: Command Dispatched',
        description: 'Command triggers the routing action: Digital boards switch directions; Gate 6 increases hand-held scanner guards from 8 to 14. Turnstiles at Gate 4 are re-allocated.',
        mapOverlayType: 'heatmap_gate4',
        gatesStatus: {
          g4: { status: 'emergency_redirect', flowRate: 50, scanSpeed: 2.1, redirectionTarget: 'g6' },
          g6: { activeGuards: 14, status: 'moderate', flowRate: 65, scanSpeed: 1.6 },
        },
        activeThreatId: 'g4',
        aiSuggestedAction: 'Wait 30s as fans adjust to physical redirection signage and guards complete deployment at Gate 6.',
        systemLogsAdded: [
          {
            type: 'action_dispatched',
            source: 'SYSTEM',
            message: 'DISPATCHED: Dynamic digital boards set South Stand redirects to Gate 6. Guard taskforce deployed.',
            resolved: true,
          }
        ]
      },
      {
        name: 'Step 3: State Re-Normalized',
        description: 'Crowd movement successfully split. Gate 4 occupancy loads fall below alert level. Normal ticketing speed returns. Gate 6 safely absorbs surplus flow.',
        mapOverlayType: 'normal',
        gatesStatus: {
          g4: { status: 'optimal', flowRate: 35, scanSpeed: 1.8, redirectionTarget: undefined },
          g6: { status: 'optimal', activeGuards: 10, flowRate: 42, scanSpeed: 1.8 },
        },
        aiSuggestedAction: 'Bottleneck resolved. Re-arming monitoring triggers for Gates 1-6.',
        systemLogsAdded: [
          {
            type: 'info',
            source: 'AI_AGENT',
            message: 'RESOLVED: South Stand bottleneck neutralized. Turnstile metrics returned to optimal parameters.',
            resolved: true,
          }
        ]
      }
    ]
  },
  {
    id: 'scen_concourse_incident',
    title: 'Scenario 2: Unattended Package Sector C',
    icon: 'Shield',
    description: 'An unattended bag is flagged near Northern Concourse Sector C during continuous AI CCTV object analysis.',
    steps: [
      {
        name: 'Step 1: Bag Flagged',
        description: 'CCTV-6 analytics software flags an UNIDENTIFIED station-bound asset. Highlights threat red to command.',
        mapOverlayType: 'heatmap_security_c',
        gatesStatus: {
          g1: { status: 'moderate' },
        },
        activeThreatId: 'cam6',
        aiSuggestedAction: 'Deploy local security squad to inspect. Lock Turnstiles 1-3 near Gate 1 (North Stand) to avoid backflows in current sector.',
        systemLogsAdded: [
          {
            type: 'critical',
            source: 'AI_AGENT',
            message: 'SUSPICIOUS OBJECT ALERT: CCTV Cam-6 flags unattended package (Sector C Concourse). Redirection of crowd stream isolated.',
            resolved: false,
          }
        ]
      },
      {
        name: 'Step 2: Sector Isolation',
        description: 'Rangers arrive on location in 45 seconds. Perimeter cordoned off. Public audio systems direct Sector C occupants to Sector B/North lawn exits.',
        mapOverlayType: 'heatmap_security_c',
        gatesStatus: {
          g1: { status: 'closed' },
        },
        activeThreatId: 'cam6',
        aiSuggestedAction: 'Monitor CCTV-6. Support rapid bomb squad and security perimeter clearances.',
        systemLogsAdded: [
          {
            type: 'action_dispatched',
            source: 'SECURITY',
            message: 'DISPATCHED: Sector C perimeter secured. Turnstiles at Gate 1 CLOSED temporarily.',
            resolved: true,
          }
        ]
      },
      {
        name: 'Step 3: Cleared & reopened',
        description: 'Package identified as forgotten photography gear from press personnel. Cordon lifted. Gate 1 restored to optimal parameters.',
        mapOverlayType: 'normal',
        gatesStatus: {
          g1: { status: 'optimal' },
        },
        aiSuggestedAction: 'Threat cleared. Gate 1 turnstiles re-opened. State healthy.',
        systemLogsAdded: [
          {
            type: 'info',
            source: 'SECURITY',
            message: 'RESOLVED: Cordon lifted. Suspicious package confirmed safe (belonged to credentialed journalist). Sector C restored.',
            resolved: true,
          }
        ]
      }
    ]
  },
  {
    id: 'scen_postmatch_exodus',
    title: 'Scenario 3: Post-Match egress surge',
    icon: 'LogOut',
    description: '50,000 fans flooding concourses simultaneously post-match. Transit hubs backing up, risking platform bottlenecks outside stadium boundaries.',
    steps: [
      {
        name: 'Step 1: Massive Egress Surge',
        description: 'Final whistle blown. 15,000 doors head towards Gates 1 & 4. Concourse pathways reaching extreme high density levels.',
        mapOverlayType: 'heatmap_exodus',
        gatesStatus: {
          g1: { status: 'congested', flowRate: 150 },
          g4: { status: 'congested', flowRate: 180 },
        },
        aiSuggestedAction: 'Initiate High Outflow protocol. Open major stadium bypass gates, switch all stadium turnstiles to checkout egress mode, trigger Metro synchronizer.',
        systemLogsAdded: [
          {
            type: 'warning',
            source: 'AI_AGENT',
            message: 'WARNING: Sudden egress surge at main south/north plazas. Initiating coordinated exit synchronization.',
            resolved: false,
          }
        ]
      },
      {
        name: 'Step 2: Transit Control Active',
        description: 'Gates converted to exit-only. Digital boards show real-time wait times for Metro lines. VIP exits open to public stream to double flow surface.',
        mapOverlayType: 'heatmap_exodus',
        gatesStatus: {
          g1: { status: 'optimal', flowRate: 180 },
          g2: { status: 'optimal', flowRate: 140 },
          g4: { status: 'optimal', flowRate: 210 },
          g6: { status: 'optimal', flowRate: 150 },
        },
        aiSuggestedAction: 'Keep outbound pathways clear. Stream live transit timetables.',
        systemLogsAdded: [
          {
            type: 'action_dispatched',
            source: 'SYSTEM',
            message: 'DISPATCHED: Set 54 turnstiles to OUTBOUND exit-only. VIP/Press emergency paths unlocked for public egress.',
            resolved: true,
          }
        ]
      },
      {
        name: 'Step 3: Safe Stadium Clearance',
        description: 'Egress completed in record-breaking 28 minutes (down from 42m). No bottlenecks or trampling incidents reported. Clear state achieved.',
        mapOverlayType: 'normal',
        gatesStatus: {
          g1: { status: 'optimal', flowRate: 0, occupancy: 0 },
          g2: { status: 'optimal', flowRate: 0, occupancy: 0 },
          g3: { status: 'optimal', flowRate: 0, occupancy: 0 },
          g4: { status: 'optimal', flowRate: 0, occupancy: 0 },
          g5: { status: 'optimal', flowRate: 0, occupancy: 0 },
          g6: { status: 'optimal', flowRate: 0, occupancy: 0 },
        },
        aiSuggestedAction: 'Evacuation successful. Closing down Matchday Operations Mode.',
        systemLogsAdded: [
          {
            type: 'info',
            source: 'AI_AGENT',
            message: 'RESOLVED: Evacuation completed safely. All sectors reporting zero active occupancy.',
            resolved: true,
          }
        ]
      }
    ]
  }
];
