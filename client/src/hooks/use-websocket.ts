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

// Compatibilidade com diferentes ambientes
const getBaseUrl = () => {
  // Determinar o protocolo (ws ou wss)
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  
  // Se estamos no ambiente Replit, usar a URL completa com o domínio atual
  if (window.location.hostname.includes('replit')) {
    return `${protocol}//${window.location.host}/ws`;
  }
  
  // Para desenvolvimento local, usar localhost
  return `${protocol}//localhost:5000/ws`;
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

  // Função para conectar ao WebSocket
  const connect = useCallback(() => {
    try {
      if (state.socket?.readyState === WebSocket.OPEN) {
        return; // Já está conectado
      }

      setState(prev => ({ ...prev, isConnecting: true, error: null }));

      // Tentamos criar o WebSocket com uma URL válida
      const wsUrl = getBaseUrl();
      console.log('Tentando conectar ao WebSocket:', wsUrl);
      
      let socket: WebSocket;
      try {
        socket = new WebSocket(wsUrl);
      } catch (err) {
        console.error('Erro na criação do WebSocket:', err);
        setState(prev => ({ 
          ...prev, 
          error: new Error(`Erro ao criar WebSocket: ${err}`), 
          isConnecting: false 
        }));
        return undefined;
      }

      socket.onopen = () => {
        console.log('WebSocket conectado com sucesso');
        setState(prev => ({ 
          ...prev, 
          socket, 
          isConnected: true, 
          isConnecting: false 
        }));
        
        if (user) {
          // Autenticar o WebSocket com o ID do usuário se estiver logado
          socket.send(JSON.stringify({
            type: 'auth',
            userId: user.id
          }));
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
        
        // Se a conexão foi fechada inesperadamente e não por um erro
        if (!state.error && event.code !== 1000) {
          console.log('Conexão WebSocket fechada. Reconectando em 5 segundos...');
          setTimeout(() => connect(), 5000);
        }
      };

      socket.onerror = (event) => {
        console.error('Erro na conexão WebSocket:', event);
        const error = new Error('Erro na conexão WebSocket');
        
        setState(prev => ({ 
          ...prev, 
          error, 
          isConnecting: false 
        }));
        
        options.onError?.(event);
      };

      return () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    } catch (err: any) {
      console.error('Erro geral ao criar conexão WebSocket:', err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err : new Error(String(err)), 
        isConnecting: false 
      }));
      
      return undefined;
    }
  }, [user, options, state.socket, state.error]);

  // Enviar mensagem através do WebSocket
  const sendMessage = useCallback((data: any) => {
    if (state.socket?.readyState === WebSocket.OPEN) {
      state.socket.send(JSON.stringify(data));
      return true;
    } else {
      console.warn('WebSocket não está conectado.');
      return false;
    }
  }, [state.socket]);

  // Fechar conexão
  const disconnect = useCallback(() => {
    if (state.socket) {
      state.socket.close();
      setState(prev => ({ 
        ...prev, 
        socket: null, 
        isConnected: false 
      }));
    }
  }, [state.socket]);

  // Conectar automaticamente quando o hook for montado, se autoConnect for true
  useEffect(() => {
    if (options.autoConnect) {
      const cleanup = connect();
      
      return () => {
        if (cleanup) cleanup();
        disconnect();
      };
    }
  }, [connect, disconnect, options.autoConnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage
  };
}