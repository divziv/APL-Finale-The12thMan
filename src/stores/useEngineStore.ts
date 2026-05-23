import { create } from 'zustand';

interface MatchEvent {
  id: string;
  type: 'WICKET' | 'SIX' | 'INNINGS_BREAK' | 'MATCH_END' | 'QUIET';
  message: string;
  timestamp: string;
}

interface EngineState {
  matchEvent: MatchEvent | null;
  globalOccupancy: number;
  triggerEvent: (type: MatchEvent['type'], message: string) => void;
  updateOccupancy: (delta: number) => void;
}

export const useEngineStore = create<EngineState>((set) => ({
  matchEvent: null,
  globalOccupancy: 0,
  triggerEvent: (type, message) => set(() => ({
    matchEvent: {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toISOString()
    }
  })),
  updateOccupancy: (delta) => set((state) => ({
    globalOccupancy: Math.max(0, state.globalOccupancy + delta)
  }))
}));
