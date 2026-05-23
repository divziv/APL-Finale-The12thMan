/**
 * @file stadiums.ts
 * @description Preset databases for Narendra Modi Stadium, Lord's Cricket Ground, and Melbourne Cricket Ground.
 */

import { StadiumData } from '../types';

export const STADIUMS_PRESETS: StadiumData[] = [
  {
    id: 'stadium_modi',
    name: 'Narendra Modi Stadium',
    location: 'Ahmedabad, India',
    capacity: 132000,
    occupancy: 96400,
    trafficIndex: 'HEAVY',
    averageScanSpeed: 1.8,
    gates: [
      { id: 'g1', name: 'Gate 1 (Astro North Stand)', status: 'optimal', flowRate: 48, scanSpeed: 1.7, capacity: 25000, occupancy: 18200, activeGuards: 12 },
      { id: 'g2', name: 'Gate 2 (East Adani Pavilion)', status: 'moderate', flowRate: 52, scanSpeed: 1.9, capacity: 22000, occupancy: 17400, activeGuards: 10 },
      { id: 'g3', name: 'Gate 3 (VIP President Box)', status: 'optimal', flowRate: 15, scanSpeed: 2.0, capacity: 8000, occupancy: 4200, activeGuards: 16 },
      { id: 'g4', name: 'Gate 4 (South Reliance Stand)', status: 'congested', flowRate: 98, scanSpeed: 3.4, capacity: 32000, occupancy: 24800, activeGuards: 14 },
      { id: 'g5', name: 'Gate 5 (West Club Concourse)', status: 'optimal', flowRate: 40, scanSpeed: 1.8, capacity: 20000, occupancy: 14200, activeGuards: 8 },
      { id: 'g6', name: 'Gate 6 (South-East Upper Deck)', status: 'optimal', flowRate: 45, scanSpeed: 1.7, capacity: 25000, occupancy: 17600, activeGuards: 10 },
    ],
    cameras: [
      { id: 'cam1', location: 'Gate 4 Reliance Turnstiles', status: 'online', aiLabel: 'DENSITY: EXTREME (188 spectators/frame)', peopleCount: 340, highlightThreat: true },
      { id: 'cam2', location: 'East Concourse Walkway A', status: 'online', aiLabel: 'FLOW RATE: SOLID', peopleCount: 75, highlightThreat: false },
      { id: 'cam3', location: 'Adani Plaza Outer Border', status: 'online', aiLabel: 'PATTERNS: STEADY INFLOW', peopleCount: 160, highlightThreat: false },
      { id: 'cam4', location: 'West Club Escapes', status: 'online', aiLabel: 'FLOW RATE: OPTIMAL', peopleCount: 42, highlightThreat: false },
      { id: 'cam5', location: 'VIP President Vault', status: 'online', aiLabel: 'DENSITY: COMFORTABLE', peopleCount: 22, highlightThreat: false },
      { id: 'cam6', location: 'North Astro Sector C', status: 'analyzing', aiLabel: 'ANALYST: NO BOTTLENECKS', peopleCount: 95, highlightThreat: false },
    ],
    match: {
      battingTeam: 'IND',
      bowlingTeam: 'AUS',
      score: '342/6',
      overs: '46.2',
      wickets: 6,
      target: '356',
      runsNeeded: '14 runs from 22 balls',
      recentBalls: ['4', '1', 'Wd', '6', '1', 'W'],
      batsman1: { name: 'Virat Kohli', runs: 112, balls: 94, fours: 9, sixes: 3 },
      batsman2: { name: 'Ravindra Jadeja', runs: 28, balls: 19, fours: 2, sixes: 1 },
      bowler: { name: 'Mitchell Starc', overs: '8.2', maidens: 0, runs: 64, wickets: 3 },
      matchStatus: 'TENSE ENDGAME: India needs 14 runs to secure World Championship.'
    }
  },
  {
    id: 'stadium_lords',
    name: "Lord's Cricket Ground",
    location: 'London, England',
    capacity: 31100,
    occupancy: 27950,
    trafficIndex: 'OPTIMAL',
    averageScanSpeed: 1.5,
    gates: [
      { id: 'g1', name: 'Gate 1 (Grace Gate North)', status: 'optimal', flowRate: 20, scanSpeed: 1.4, capacity: 6005, occupancy: 5200, activeGuards: 8 },
      { id: 'g2', name: 'Gate 2 (Grandstand Way)', status: 'optimal', flowRate: 22, scanSpeed: 1.5, capacity: 5500, occupancy: 4900, activeGuards: 6 },
      { id: 'g3', name: 'Gate 3 (Members Pavilion VIP)', status: 'optimal', flowRate: 8, scanSpeed: 1.6, capacity: 3000, occupancy: 2650, activeGuards: 10 },
      { id: 'g4', name: 'Gate 4 (Murng Stand South)', status: 'moderate', flowRate: 26, scanSpeed: 1.8, capacity: 6595, occupancy: 5900, activeGuards: 8 },
      { id: 'g5', name: 'Gate 5 (Nursery Ground Concourse)', status: 'optimal', flowRate: 18, scanSpeed: 1.4, capacity: 5000, occupancy: 4300, activeGuards: 6 },
      { id: 'g6', name: 'Gate 6 (Wellington Arch Gate)', status: 'optimal', flowRate: 20, scanSpeed: 1.5, capacity: 5000, occupancy: 5000, activeGuards: 8 },
    ],
    cameras: [
      { id: 'cam1', location: 'Grace Gate Access Plaza', status: 'online', aiLabel: 'DENSITY: STEADY', peopleCount: 42, highlightThreat: false },
      { id: 'cam2', location: 'Members Pavilion Entrance', status: 'online', aiLabel: 'DENSITY: STEADY', peopleCount: 15, highlightThreat: false },
      { id: 'cam3', location: 'Grandstand Concourse D', status: 'online', aiLabel: 'PATTERNS: BALANCED FLOW', peopleCount: 28, highlightThreat: false },
      { id: 'cam4', location: 'Nursery Ground Boundary Walk', status: 'online', aiLabel: 'FLOW RATE: FREE', peopleCount: 19, highlightThreat: false },
      { id: 'cam5', location: 'Wellington Arch Standby', status: 'online', aiLabel: 'DENSITY: SOLID', peopleCount: 33, highlightThreat: false },
      { id: 'cam6', location: 'Media Center Deck', status: 'online', aiLabel: 'NO SUSPICIOUS INCIDENTS', peopleCount: 12, highlightThreat: false },
    ],
    match: {
      battingTeam: 'ENG',
      bowlingTeam: 'NZ',
      score: '184/3',
      overs: '24.1',
      wickets: 3,
      target: '312',
      runsNeeded: '128 runs from 155 balls',
      recentBalls: ['1', '0', '4', '1', '0', '2'],
      batsman1: { name: 'Joe Root', runs: 74, balls: 61, fours: 7, sixes: 0 },
      batsman2: { name: 'Harry Brook', runs: 42, balls: 33, fours: 4, sixes: 2 },
      bowler: { name: 'Trent Boult', overs: '5.1', maidens: 1, runs: 32, wickets: 1 },
      matchStatus: 'MID-GAME CONTEST: England solidifying their chase. Brook on aggressive strike.'
    }
  },
  {
    id: 'stadium_mcg',
    name: 'Melbourne Cricket Ground',
    location: 'Melbourne, Australia',
    capacity: 100024,
    occupancy: 81500,
    trafficIndex: 'MODERATE',
    averageScanSpeed: 2.1,
    gates: [
      { id: 'g1', name: 'Gate 1 (Great Southern North)', status: 'optimal', flowRate: 35, scanSpeed: 1.9, capacity: 18000, occupancy: 14200, activeGuards: 12 },
      { id: 'g2', name: 'Gate 2 (Ponsford Stand East)', status: 'optimal', flowRate: 38, scanSpeed: 2.0, capacity: 18000, occupancy: 15100, activeGuards: 10 },
      { id: 'g3', name: 'Gate 3 (MCC Members Reserve)', status: 'optimal', flowRate: 15, scanSpeed: 2.2, capacity: 10024, occupancy: 8200, activeGuards: 15 },
      { id: 'g4', name: 'Gate 4 (Shane Warne Stand South)', status: 'congested', flowRate: 84, scanSpeed: 3.1, capacity: 22000, occupancy: 19500, activeGuards: 14 },
      { id: 'g5', name: 'Gate 5 (Olympic Concourse West)', status: 'optimal', flowRate: 32, scanSpeed: 1.8, capacity: 16000, occupancy: 11900, activeGuards: 8 },
      { id: 'g6', name: 'Gate 6 (Brunton Avenue Portal)', status: 'moderate', flowRate: 40, scanSpeed: 2.1, capacity: 16000, occupancy: 12600, activeGuards: 10 },
    ],
    cameras: [
      { id: 'cam1', location: 'Shane Warne Stand Turnstiles', status: 'online', aiLabel: 'DENSITY: HEAVY (114 spectators/frame)', peopleCount: 220, highlightThreat: true },
      { id: 'cam2', location: 'MCC Members Lawn B', status: 'online', aiLabel: 'DENSITY: MODERATE', peopleCount: 52, highlightThreat: false },
      { id: 'cam3', location: 'Olympic Entrance Boulevard', status: 'online', aiLabel: 'FLOW RATE: CONSTANT', peopleCount: 110, highlightThreat: false },
      { id: 'cam4', location: 'Brunton Road Shuttle Drop', status: 'online', aiLabel: 'DENSITY: HIGH', peopleCount: 88, highlightThreat: false },
      { id: 'cam5', location: 'Ponsford Plaza Walkway', status: 'online', aiLabel: 'DENSITY: STEADY', peopleCount: 45, highlightThreat: false },
      { id: 'cam6', location: 'Great Southern Corridor B', status: 'analyzing', aiLabel: 'FLOWS: STEADY PROGRESS', peopleCount: 62, highlightThreat: false },
    ],
    match: {
      battingTeam: 'AUS',
      bowlingTeam: 'RSA',
      score: '286/8',
      overs: '49.0',
      wickets: 8,
      target: '286',
      runsNeeded: 'Last over! South Africa needs 1 wicket or Australia 1 run.',
      recentBalls: ['W', '1', '0', 'W', '4', '1'],
      batsman1: { name: 'Pat Cummins', runs: 12, balls: 8, fours: 1, sixes: 0 },
      batsman2: { name: 'Josh Hazlewood', runs: 0, balls: 1, fours: 0, sixes: 0 },
      bowler: { name: 'Kagiso Rabada', overs: '9.0', maidens: 1, runs: 48, wickets: 4 },
      matchStatus: 'CRITICAL THRILLER: Scores tied with 1 over remaining. Rabada has 4 wickets.'
    }
  }
];

export function getPresetStadiumById(id: string): StadiumData {
  return STADIUMS_PRESETS.find(s => s.id === id) || STADIUMS_PRESETS[0];
}
