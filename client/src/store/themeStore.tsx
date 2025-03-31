import { createContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";

export interface ThemeConfig {
  primary: string;
  variant: "professional" | "tint" | "vibrant";
  appearance: "light" | "dark" | "system";
  radius: number;
}

export interface ConfigSnapshot {
  id: string;
  timestamp: Date;
  changes: string[];
  author: string;
  config: ThemeConfig;
  diff?: string;
}

export interface ThemeState {
  theme: ThemeConfig;
  snapshots: ConfigSnapshot[];
  updateTheme: (newTheme: Partial<ThemeConfig>) => void;
  createSnapshot: (snapshot: Omit<ConfigSnapshot, "id" | "timestamp" | "config">) => void;
  restoreSnapshot: (snapshotId: string) => void;
}

// Create the context with a default value that matches the shape
const defaultTheme: ThemeConfig = {
  primary: "hsl(222.2 47.4% 11.2%)",
  variant: "professional",
  appearance: "light",
  radius: 0.5
};

const defaultThemeState: ThemeState = {
  theme: defaultTheme,
  snapshots: [],
  updateTheme: () => {},
  createSnapshot: () => {},
  restoreSnapshot: () => {}
};

export const ThemeContext = createContext<ThemeState>(defaultThemeState);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  
  const [snapshots, setSnapshots] = useState<ConfigSnapshot[]>([]);
  
  // On mount, load theme from server
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // In a real app, we would call the API to get the theme
        // const response = await apiRequest("GET", "/api/config/theme");
        // const themeData = await response.json();
        // setTheme(themeData);
        
        // For demo purposes, just use the default theme
        
      } catch (err) {
        console.error("Failed to load theme:", err);
      }
    };
    
    loadTheme();
  }, []);
  
  const updateTheme = async (newTheme: Partial<ThemeConfig>) => {
    try {
      const updatedTheme = { ...theme, ...newTheme };
      
      // In a real app, we would call the API to update the theme
      // await apiRequest("PUT", "/api/config/theme", updatedTheme);
      
      setTheme(updatedTheme);
      
    } catch (err) {
      console.error("Failed to update theme:", err);
    }
  };
  
  const createSnapshot = (snapshot: Omit<ConfigSnapshot, "id" | "timestamp" | "config">) => {
    const newSnapshot: ConfigSnapshot = {
      ...snapshot,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      config: { ...theme }
    };
    
    setSnapshots([newSnapshot, ...snapshots]);
  };
  
  const restoreSnapshot = (snapshotId: string) => {
    const snapshot = snapshots.find(s => s.id === snapshotId);
    if (snapshot) {
      setTheme(snapshot.config);
    }
  };
  
  const themeState: ThemeState = {
    theme,
    snapshots,
    updateTheme,
    createSnapshot,
    restoreSnapshot
  };
  
  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
};