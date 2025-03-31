import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";

// Dados simulados para o chat
const mockChatData = {
  channels: [
    { id: 1, name: "Geral", unread: 0 },
    { id: 2, name: "Equipe", unread: 3 },
    { id: 3, name: "Projeto-A", unread: 0 }
  ],
  directMessages: [
    { id: 4, name: "Felipe Rocha", status: "online", unread: 0 },
    { id: 5, name: "Maria Silva", status: "offline", unread: 1 },
    { id: 6, name: "Roberto Alves", status: "online", unread: 0 }
  ],
  messages: {
    1: [
      { id: 101, sender: "Felipe Rocha", senderInitials: "FR", content: "Bom dia a todos!", timestamp: "2023-05-17T08:30:00Z", isAdmin: true },
      { id: 102, sender: "Maria Silva", senderInitials: "MS", content: "Bom dia! Alguém tem atualizações sobre o inventário?", timestamp: "2023-05-17T08:45:00Z", isAdmin: false },
      { id: 103, sender: "Roberto Alves", senderInitials: "RA", content: "Vou terminá-lo hoje.", timestamp: "2023-05-17T08:47:00Z", isAdmin: false },
      { id: 104, sender: "Felipe Rocha", senderInitials: "FR", content: "Ótimo! Vamos revisar na reunião.", timestamp: "2023-05-17T08:50:00Z", isAdmin: true }
    ],
    2: [
      { id: 201, sender: "Felipe Rocha", senderInitials: "FR", content: "Reunião de equipe às 14h hoje", timestamp: "2023-05-17T09:30:00Z", isAdmin: true },
      { id: 202, sender: "Maria Silva", senderInitials: "MS", content: "Vamos discutir o novo módulo?", timestamp: "2023-05-17T09:32:00Z", isAdmin: false },
      { id: 203, sender: "Felipe Rocha", senderInitials: "FR", content: "Sim, e as metas trimestrais", timestamp: "2023-05-17T09:33:00Z", isAdmin: true },
      { id: 204, sender: "Roberto Alves", senderInitials: "RA", content: "@Felipe Rocha podemos também discutir o novo sistema de estoque?", timestamp: "2023-05-17T09:40:00Z", isAdmin: false, mentions: ["Felipe Rocha"] }
    ]
  }
};

// Defina um tipo para uma mensagem de chat
interface ChatMessage {
  id: number;
  sender: string;
  senderInitials: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
  mentions?: string[];
}

// Tipo para os mensagens nos canais
interface MessagesByChannelId {
  [key: number]: ChatMessage[];
}

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { showNotification } = useNotifications();
  const [activeChannel, setActiveChannel] = useState<number>(1);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize WebSocket connection and setup connection for real application
  useEffect(() => {
    // Para demonstração, carregamos dados simulados
    const messages = mockChatData.messages as MessagesByChannelId;
    setChatMessages(messages[activeChannel] || []);
    
    // WebSocket é manipulado por um hook separado para evitar erros na conexão
    // Não tentamos conectar ao WebSocket diretamente aqui para evitar
    // erros quando o WebSocket não estiver disponível
    
    // Quando a função de chat em tempo real estiver completamente implementada,
    // esse código será ativado em um hook específico para WebSocket
  }, [activeChannel]);
  
  // Rolagem para o final do chat quando as mensagens mudam
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Em um app real, enviaríamos isso via WebSocket
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: user?.fullName || user?.username || 'Você',
      senderInitials: (user?.fullName || user?.username || 'Você').substring(0, 2).toUpperCase(),
      content: message,
      timestamp: new Date().toISOString(),
      isAdmin: user?.role === 'Administrador'
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessage("");
    
    // Verificar menções na mensagem
    const mentionRegex = /@(\w+)/g;
    const mentions = message.match(mentionRegex);
    
    if (mentions) {
      mentions.forEach(mention => {
        const username = mention.substring(1); // Remove o símbolo @
        // Em um app real, verificaríamos se este usuário existe e enviaríamos uma notificação
        toast({
          title: "Menção Enviada",
          description: `Você mencionou ${username} na sua mensagem.`,
        });
      });
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleShowNotification = () => {
    showNotification({
      title: "Nova Mensagem",
      body: "Maria mencionou você no chat da Equipe",
      onClick: () => setActiveChannel(2)
    });
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <h2 className="text-xl font-semibold mb-4">Chat da Equipe</h2>
      
      <div className="flex flex-col md:flex-row gap-4 flex-1 overflow-hidden">
        {/* Barra lateral do Chat */}
        <Card className="w-full md:w-64 flex-shrink-0">
          <Tabs defaultValue="channels">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="channels">Canais</TabsTrigger>
              <TabsTrigger value="direct">Direto</TabsTrigger>
            </TabsList>
            
            <TabsContent value="channels" className="space-y-2 p-2">
              {mockChatData.channels.map((channel) => (
                <div 
                  key={channel.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
                    activeChannel === channel.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => setActiveChannel(channel.id)}
                >
                  <span># {channel.name}</span>
                  {channel.unread > 0 && (
                    <span className="bg-destructive text-destructive-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                      {channel.unread}
                    </span>
                  )}
                </div>
              ))}
              
              <Button variant="ghost" className="w-full justify-start pl-3" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Adicionar Canal
              </Button>
            </TabsContent>
            
            <TabsContent value="direct" className="space-y-2 p-2">
              {mockChatData.directMessages.map((dm) => (
                <div 
                  key={dm.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
                    activeChannel === dm.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => setActiveChannel(dm.id)}
                >
                  <div className="flex items-center">
                    <span className={`h-2 w-2 rounded-full mr-2 ${
                      dm.status === 'online' ? 'bg-secondary' : 'bg-muted'
                    }`} />
                    <span>{dm.name}</span>
                  </div>
                  {dm.unread > 0 && (
                    <span className="bg-destructive text-destructive-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                      {dm.unread}
                    </span>
                  )}
                </div>
              ))}
              
              <Button variant="ghost" className="w-full justify-start pl-3" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nova Mensagem
              </Button>
            </TabsContent>
          </Tabs>
        </Card>
        
        {/* Conteúdo do Chat */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {activeChannel <= 3 ? `# ${mockChatData.channels.find(c => c.id === activeChannel)?.name}` : 
                  mockChatData.directMessages.find(d => d.id === activeChannel)?.name}
              </CardTitle>
              
              {/* Botão de demonstração de notificação - seria acionado por eventos reais em produção */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShowNotification}
                className="text-xs"
              >
                Demonstrar Notificação
              </Button>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className={msg.isAdmin ? "bg-primary text-primary-foreground" : ""}>
                      {msg.senderInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${msg.isAdmin ? "text-primary" : ""}`}>
                        {msg.sender}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <CardContent className="p-4 border-t mt-auto">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Enviar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
