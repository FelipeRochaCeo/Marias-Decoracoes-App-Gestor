import { useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

/**
 * WebSocketManager - Componente para gerenciar conexões WebSocket
 * 
 * Este componente gerencia a conexão WebSocket de forma centralizada, lidando
 * com reconexões e mensagens. Ele não renderiza nada visualmente, apenas
 * gerencia a conexão.
 * 
 * O componente agora é projetado para falhar graciosamente, não bloqueando a aplicação
 * mesmo se não conseguir estabelecer uma conexão.
 */
export function WebSocketManager() {
  const [isReady, setIsReady] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Inicializa o socket sem autoconectar para evitar problemas durante o carregamento inicial
  const { 
    socket, 
    connect, 
    isConnected, 
    error,
    isConnecting
  } = useWebSocket({
    // IMPORTANTE: Nunca conectamos automaticamente
    // para evitar problemas durante o carregamento da aplicação
    autoConnect: false,
    
    onOpen: () => {
      setIsReady(true);
      console.log('WebSocket conectado e pronto para uso');
      
      // Notificação opcional quando conectado com sucesso (desativada por padrão)
      // toast({
      //   title: 'Conectado',
      //   description: 'Conexão em tempo real estabelecida com sucesso.',
      //   variant: 'default',
      // });
    },
    
    onMessage: (data) => {
      try {
        // Processa mensagens recebidas
        console.log('Mensagem WebSocket recebida:', data);
        
        // Processamento de diferentes tipos de mensagens
        if (data.type === 'notification') {
          toast({
            title: data.title || 'Nova notificação',
            description: data.message,
            variant: 'default',
          });
        } 
        // Adicionar outros tipos de mensagens conforme necessário
      } catch (err) {
        console.error('Erro ao processar mensagem:', err);
      }
    },
    
    onClose: () => {
      setIsReady(false);
      console.log('WebSocket desconectado');
    },
    
    onError: (event) => {
      console.error('Erro no WebSocket:', event);
      
      // Não exibir toast para não floodar a interface em caso de erros frequentes
      // Em ambiente de produção, pode ser interessante mostrar apenas o primeiro erro
      // toast({
      //   title: 'Erro de conexão',
      //   description: 'Não foi possível conectar ao servidor em tempo real.',
      //   variant: 'destructive',
      // });
    }
  });
  
  // Podemos tentar conectar manualmente quando o usuário estiver autenticado
  // Mas isso será ativado manualmente quando todas as outras partes da aplicação estiverem funcionando
  useEffect(() => {
    // Comentado para evitar problemas de inicialização da aplicação
    // Em um ambiente de produção estável, podemos descomentar isso
    /* 
    if (user && !isConnected && !isConnecting && !error) {
      // Pequeno atraso para garantir que o resto da aplicação já está carregado
      const timeoutId = setTimeout(() => {
        connect();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
    */
    
    // Por enquanto, não conectamos automaticamente
    
  }, [user, connect, isConnected, isConnecting, error]);
  
  // Este componente não renderiza nada visualmente
  return null;
}

export default WebSocketManager;