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

      // Criação da URL do WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
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
        const error = new Error('Erro na conexão WebSocket');
        
        setState(prev => ({ 
          ...prev, 
          error, 
          isConnecting: false 
        }));
        
        options.onError?.(event);
        
        // Erro silencioso - não exibe toast para o usuário
        console.error('Erro na conexão WebSocket:', event);
      };

      return () => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        error: err, 
        isConnecting: false 
      }));
      
      console.error('Erro ao criar conexão WebSocket:', err);
      return undefined;
    }
  }, [user, options, state.socket]);

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