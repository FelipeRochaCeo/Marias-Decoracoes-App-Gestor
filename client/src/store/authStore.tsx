import { createContext, useState, useEffect, ReactNode, useContext } from "react";
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
        // In a real app, we would call the API to check auth status
        // const response = await apiRequest("GET", "/api/auth/me");
        // const userData = await response.json();
        // setUser(userData);
        
        // For demo purposes, set a mock user
        setUser({
          id: 1,
          username: "John Doe",
          role: "Admin"
        });
        
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
      // In a real app, we would call the API to login
      // const response = await apiRequest("POST", "/api/auth/login", {
      //   username,
      //   password
      // });
      // const userData = await response.json();
      // setUser(userData);
      
      // For demo purposes, set a mock user based on username
      setUser({
        id: 1,
        username: username,
        role: username === "admin" ? "Admin" : "Employee"
      });
      
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, we would call the API to logout
      // await apiRequest("POST", "/api/auth/logout");
      
      // Clear user state
      setUser(null);
      
    } catch (err: any) {
      console.error("Logout failed:", err);
      setError(err.message || "Logout failed");
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

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};