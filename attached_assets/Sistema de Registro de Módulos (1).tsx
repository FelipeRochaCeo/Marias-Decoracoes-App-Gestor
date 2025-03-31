// core/modules/ModuleRegistry.tsx
import React, { createContext, useContext, useReducer } from 'react';

type Module = {
  id: string;
  dependencies: string[];
  permissions: string[];
  active: boolean;
};

type ModuleAction =
  | { type: 'REGISTER_MODULE'; payload: Module }
  | { type: 'TOGGLE_MODULE'; payload: string };

const moduleReducer = (state: Module[], action: ModuleAction) => {
  switch (action.type) {
    case 'REGISTER_MODULE':
      return [...state, action.payload];
    case 'TOGGLE_MODULE':
      return state.map(m => 
        m.id === action.payload ? { ...m, active: !m.active } : m
      );
    default:
      return state;
  }
};

const ModuleContext = createContext<{
  modules: Module[];
  dispatch: React.Dispatch<ModuleAction>;
}>({
  modules: [],
  dispatch: () => null
});

export const ModuleProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [modules, dispatch] = useReducer(moduleReducer, []);
  
  return (
    <ModuleContext.Provider value={{ modules, dispatch }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModuleRegistry = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModuleRegistry must be used within a ModuleProvider');
  }
  return {
    modules: context.modules,
    registerModule: (module: Module) => 
      context.dispatch({ type: 'REGISTER_MODULE', payload: module }),
    toggleModule: (moduleId: string) => 
      context.dispatch({ type: 'TOGGLE_MODULE', payload: moduleId })
  };
};