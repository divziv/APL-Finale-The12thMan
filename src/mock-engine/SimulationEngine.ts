import { useEffect } from 'react';
import { useEngineStore } from '../stores/useEngineStore';

export function useSimulationEngine() {
  const triggerEvent = useEngineStore(state => state.triggerEvent);
  const updateOccupancy = useEngineStore(state => state.updateOccupancy);

  useEffect(() => {
    const events = [
      { type: 'SIX', message: 'Massive six! Crowd noise spiking in North Stand.', weight: 30 },
      { type: 'WICKET', message: 'Wicket falls! Minor exodus to washrooms detected.', weight: 20 },
      { type: 'QUIET', message: 'Steady play. Concession lines returning to baseline.', weight: 40 },
      { type: 'INNINGS_BREAK', message: 'Innings break started. Extreme congestion expected at all Food Courts.', weight: 10 }
    ] as const;

    // Simulate match events every 15-30 seconds
    const interval = setInterval(() => {
      const rand = Math.random() * 100;
      let cumulative = 0;
      for (const ev of events) {
        cumulative += ev.weight;
        if (rand < cumulative) {
          triggerEvent(ev.type, ev.message);
          
          // Affect occupancy based on event
          if (ev.type === 'INNINGS_BREAK') {
            updateOccupancy(-500); // People leave seats
          } else if (ev.type === 'WICKET') {
            updateOccupancy(-50);
          } else if (ev.type === 'SIX') {
            updateOccupancy(20); // People rushing back in
          }
          break;
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [triggerEvent, updateOccupancy]);
}
