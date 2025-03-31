// core/modules/ModuleRegistry.tsx
import { create } from 'zustand';

type Module = {
  id: string;
  dependencies: string[];
  permissions: string[];
  active: boolean;
};

interface ModuleState {
  modules: Module[];
  registerModule: (module: Module) => void;
  toggleModule: (moduleId: string) => void;
}

export const useModuleStore = create<ModuleState>((set) => ({
  modules: [],
  registerModule: (module) => set((state) => ({
    modules: [...state.modules, module]
  })),
  toggleModule: (moduleId) => set((state) => ({
    modules: state.modules.map(m => 
      m.id === moduleId ? { ...m, active: !m.active } : m
    )
  }))
}));