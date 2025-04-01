/**
 * Este arquivo desativa as tentativas do Vite de estabelecer
 * conexões WebSocket para Hot Module Replacement (HMR)
 * em ambiente de desenvolvimento no Replit.
 */

// Intercepta as conexões WebSocket do Vite que estão causando os erros
export function disableViteHMR() {
  // Desativa as conexões de HMR do Vite diretamente através de uma propriedade global
  // que o Vite verifica antes de fazer conexões WebSocket
  if (typeof window !== 'undefined') {
    // Adiciona variáveis para desativar o HMR
    (window as any).__HMR_DISABLED__ = true;
    (window as any).__VITE_HMR_TIMEOUT__ = 0;
    
    // Intercepta a criação de WebSockets para bloquear os problemáticos
    const originalWebSocket = window.WebSocket;
    
    // @ts-ignore
    window.WebSocket = function(url: string, protocols?: string | string[]) {
      // Bloqueia seletivamente conexões WebSocket associadas ao Vite
      if (typeof url === 'string' && 
         (url.includes('localhost:undefined') || 
          url.includes('?token=') || 
          url.includes('vite'))) {
        
        console.log('[HMR] Conexão WebSocket do Vite bloqueada:', url);
        
        // Retorna um mock simples do WebSocket para evitar erros
        // @ts-ignore - Usamos any para ignorar os problemas de tipagem
        return {
          addEventListener: () => {},
          removeEventListener: () => {},
          send: () => {},
          close: () => {},
        } as any;
      }
      
      // Para conexões WebSocket legítimas da aplicação, passa normalmente
      return new originalWebSocket(url, protocols);
    };
    
    // Mantém os métodos estáticos
    Object.assign(window.WebSocket, originalWebSocket);
  }
}