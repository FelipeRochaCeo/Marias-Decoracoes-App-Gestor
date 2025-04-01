import { createContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with a default value that matches the shape
const defaultAuthState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: async () => {}
};

export const AuthContext = createContext<AuthState>(defaultAuthState);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // On mount, check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/me");
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // If response is not ok (like 401), user is not logged in
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        username,
        password
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha no login");
      }
      
      const userData = await response.json();
      setUser(userData);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Falha no login");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await apiRequest("POST", "/api/auth/logout");
      setUser(null);
    } catch (err: any) {
      console.error("Logout failed:", err);
      setError(err.message || "Falha ao sair");
      // Even if the API call fails, clear the user from the state
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const authState: AuthState = {
    user,
    isLoading,
    error,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};