import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { apiRequest } from "@/lib/queryClient";

export interface User {
  id: number;
  username: string;
  role: string;
  fullName?: string;
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

// Dados do usuário administrador pré-configurado
const ADMIN_USERNAME = "FelipeRochaCeo";
const ADMIN_PASSWORD = "#F3l1p3#Ceo";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Ao montar, verifica se o usuário já está logado através de um token no localStorage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Falha na verificação de autenticação:", err);
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
      // Verifica se é o administrador pré-configurado
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const adminUser = {
          id: 1,
          username: ADMIN_USERNAME,
          role: "Administrador",
          fullName: "Felipe Rocha"
        };
        
        setUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return;
      }
      
      // Verificações para outros usuários - simulado por enquanto
      if (username.length > 0 && password.length > 0) {
        const regularUser = {
          id: Date.now(), // Gera um ID único
          username: username,
          role: "Funcionário",
          fullName: username // Usa o username como nome completo por enquanto
        };
        
        setUser(regularUser);
        localStorage.setItem('currentUser', JSON.stringify(regularUser));
      } else {
        throw new Error("Nome de usuário e senha são obrigatórios");
      }
      
    } catch (err: any) {
      console.error("Falha no login:", err);
      setError(err.message || "Falha no login. Verifique suas credenciais.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Limpa o localStorage e o estado do usuário
      localStorage.removeItem('currentUser');
      setUser(null);
      
    } catch (err: any) {
      console.error("Falha no logout:", err);
      setError(err.message || "Falha ao sair do sistema");
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

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  }
  return context;
};