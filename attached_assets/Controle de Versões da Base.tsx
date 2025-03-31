// core/config/ConfigVersioning.tsx
import { create } from 'zustand';

type ConfigSnapshot = {
  id: string;
  timestamp: Date;
  changes: string[];
  author: string;
  diff: string;
};

interface ConfigState {
  history: ConfigSnapshot[];
  currentConfig: Record<string, any>;
  saveSnapshot: (snapshot: Omit<ConfigSnapshot, 'id' | 'timestamp'>) => void;
  restoreSnapshot: (snapshotId: string) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  history: [],
  currentConfig: {},
  saveSnapshot: (snapshot) => set((state) => ({
    history: [...state.history, {
      ...snapshot,
      id: crypto.randomUUID(),
      timestamp: new Date()
    }]
  })),
  restoreSnapshot: (snapshotId) => set((state) => ({
    currentConfig: state.history.find(s => s.id === snapshotId)?.diff || {}
  }))
}));