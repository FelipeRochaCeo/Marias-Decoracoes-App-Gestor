import { createContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";

export interface Module {
  id: string;
  name: string;
  dependencies: string[];
  permissions: string[];
  active: boolean;
}

export interface ModuleState {
  modules: Module[];
  isLoading: boolean;
  error: string | null;
  registerModule: (module: Module) => void;
  toggleModule: (moduleId: string) => void;
}

// Create the context with a default value that matches the shape
const defaultModuleState: ModuleState = {
  modules: [],
  isLoading: false,
  error: null,
  registerModule: () => {},
  toggleModule: () => {}
};

export const ModuleContext = createContext<ModuleState>(defaultModuleState);

interface ModuleProviderProps {
  children: ReactNode;
}

export const ModuleProvider = ({ children }: ModuleProviderProps) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // On mount, load registered modules
  useEffect(() => {
    const loadModules = async () => {
      try {
        // In a real app, we would call the API to get all registered modules
        // const response = await apiRequest("GET", "/api/modules");
        // const modulesData = await response.json();
        // setModules(modulesData);
        
        // For demo purposes, set some initial modules
        setModules([
          {
            id: "core-dashboard",
            name: "Dashboard",
            dependencies: [] as string[],
            permissions: ["dashboard"],
            active: true
          },
          {
            id: "core-inventory",
            name: "Inventory Management",
            dependencies: [] as string[],
            permissions: ["inventory"],
            active: true
          },
          {
            id: "core-tasks",
            name: "Task Management",
            dependencies: [] as string[],
            permissions: ["tasks"],
            active: true
          }
        ]);
        
      } catch (err: any) {
        console.error("Failed to load modules:", err);
        setError(err.message || "Failed to load modules");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadModules();
  }, []);
  
  const registerModule = async (module: Module) => {
    try {
      // In a real app, we would call the API to register the module
      // const response = await apiRequest("POST", "/api/modules", module);
      // const registeredModule = await response.json();
      
      // Make sure dependencies is a string array
      const sanitizedModule = {
        ...module,
        dependencies: module.dependencies || [] as string[]
      };
      
      setModules([...modules, sanitizedModule]);
      
    } catch (err: any) {
      console.error("Failed to register module:", err);
      setError(err.message || "Failed to register module");
    }
  };
  
  const toggleModule = async (moduleId: string) => {
    try {
      const moduleIndex = modules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1) return;
      
      const updatedModule = {
        ...modules[moduleIndex],
        active: !modules[moduleIndex].active
      };
      
      // In a real app, we would call the API to toggle the module
      // await apiRequest("PATCH", `/api/modules/${moduleId}`, {
      //   active: updatedModule.active
      // });
      
      setModules([
        ...modules.slice(0, moduleIndex),
        updatedModule,
        ...modules.slice(moduleIndex + 1)
      ]);
      
    } catch (err: any) {
      console.error("Failed to toggle module:", err);
      setError(err.message || "Failed to toggle module");
    }
  };
  
  const moduleState: ModuleState = {
    modules,
    isLoading,
    error,
    registerModule,
    toggleModule
  };
  
  return (
    <ModuleContext.Provider value={moduleState}>
      {children}
    </ModuleContext.Provider>
  );
};