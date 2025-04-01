import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  autoConnect?: boolean;
}

interface WebSocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
}

// Função para obter a URL base do WebSocket
const getBaseUrl = () => {
  try {
    // Determinar o protocolo (ws ou wss)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    // Se estamos no ambiente Replit, usar a URL completa com o domínio atual
    if (window.location.hostname.includes('replit')) {
      return `${protocol}//${window.location.host}/ws`;
    }
    
    // Para desenvolvimento local, usar localhost
    return `${protocol}//localhost:5000/ws`;
  } catch (err) {
    console.error("Erro ao gerar URL do WebSocket:", err);
    return null;
  }
};

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<WebSocketState>({
    socket: null,
    isConnected: false,
    isConnecting: false,
    error: null
  });

  // Função para conectar ao WebSocket de forma segura
  const connect = useCallback(() => {
    try {
      // Se já existe um socket conectado, não faz nada
      if (state.socket?.readyState === WebSocket.OPEN) {
        return () => {};
      }

      setState(prev => ({ ...prev, isConnecting: true, error: null }));

      // Tenta obter a URL do WebSocket
      const wsUrl = getBaseUrl();
      
      // Se não conseguiu gerar a URL, já retorna erro
      if (!wsUrl) {
        console.error('Não foi possível determinar a URL do WebSocket');
        setState(prev => ({ 
          ...prev, 
          error: new Error('URL do WebSocket inválida'), 
          isConnecting: false 
        }));
        return () => {};
      }
      
      // Tenta criar o socket dentro de um try-catch seguro
      let socket: WebSocket | null = null;
      
      try {
        console.log('Tentando conectar ao WebSocket:', wsUrl);
        socket = new WebSocket(wsUrl);
      } catch (err) {
        console.error('Erro na criação do WebSocket:', err);
        setState(prev => ({ 
          ...prev, 
          error: new Error(`Erro ao criar WebSocket: ${err}`), 
          isConnecting: false 
        }));
        return () => {};
      }

      // Configura os handlers
      socket.onopen = () => {
        console.log('WebSocket conectado com sucesso');
        setState(prev => ({ 
          ...prev, 
          socket, 
          isConnected: true, 
          isConnecting: false 
        }));
        
        // Só envia autenticação se o usuário estiver logado
        if (user) {
          try {
            socket?.send(JSON.stringify({
              type: 'auth',
              userId: user.id
            }));
          } catch (err) {
            console.error('Erro ao enviar autenticação WebSocket:', err);
          }
        }
        
        options.onOpen?.();
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          options.onMessage?.(data);
        } catch (err) {
          console.error('Erro ao processar mensagem WebSocket:', err);
        }
      };

      socket.onclose = (event) => {
        console.log('WebSocket fechado, código:', event.code);
        setState(prev => ({ 
          ...prev, 
          socket: null, 
          isConnected: false, 
          isConnecting: false
        }));
        
        options.onClose?.();
        
        // Reconecta apenas em caso de fechamento específico
        // Evita ciclos infinitos de reconexão
        if (!state.error && event.code !== 1000 && event.code !== 1001) {
          console.log('Conexão WebSocket fechada. Reconectando em 5 segundos...');
          const timeoutId = setTimeout(() => {
            // Verifica se ainda é necessário reconectar
            if (document.visibilityState !== 'hidden') {
              connect();
            }
          }, 5000);
          
          // Limpa o timeout se o componente desmontar
          return () => clearTimeout(timeoutId);
        }
        
        return () => {};
      };

      socket.onerror = (event) => {
        console.error('Erro na conexão WebSocket:', event);
        
        setState(prev => ({ 
          ...prev, 
          error: new Error('Erro na conexão WebSocket'), 
          isConnecting: false 
        }));
        
        options.onError?.(event);
      };

      // Retorna a função de limpeza
      return () => {
        try {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close(1000, "Fechamento intencional");
          }
        } catch (err) {
          console.error('Erro ao fechar WebSocket:', err);
        }
      };
    } catch (err) {
      console.error('Erro geral no hook do WebSocket:', err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err : new Error(String(err)), 
        isConnecting: false 
      }));
      return () => {};
    }
  }, [user, options]);

  // Enviar mensagem através do WebSocket com verificações de segurança
  const sendMessage = useCallback((data: any) => {
    try {
      if (!state.socket) {
        console.warn('WebSocket não inicializado.');
        return false;
      }
      
      if (state.socket.readyState === WebSocket.OPEN) {
        state.socket.send(JSON.stringify(data));
        return true;
      } else {
        console.warn('WebSocket não está conectado.');
        return false;
      }
    } catch (err) {
      console.error('Erro ao enviar mensagem WebSocket:', err);
      return false;
    }
  }, [state.socket]);

  // Fechar conexão de forma segura
  const disconnect = useCallback(() => {
    try {
      if (state.socket) {
        state.socket.close(1000, "Fechamento intencional");
        setState(prev => ({ 
          ...prev, 
          socket: null, 
          isConnected: false 
        }));
      }
    } catch (err) {
      console.error('Erro ao desconectar WebSocket:', err);
    }
  }, [state.socket]);

  // Conectar automaticamente quando o hook for montado, APENAS se autoConnect for TRUE
  useEffect(() => {
    let cleanup = () => {};
    
    // Só conecta se explicitamente solicitado e o usuário estiver autenticado
    if (options.autoConnect === true && user) {
      const cleanupFn = connect();
      if (typeof cleanupFn === 'function') {
        cleanup = cleanupFn;
      }
    }
    
    return () => {
      cleanup();
      disconnect();
    };
  }, [connect, disconnect, options.autoConnect, user]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage
  };
}