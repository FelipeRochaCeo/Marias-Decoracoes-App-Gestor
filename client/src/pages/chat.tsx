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

// Mock data for chat
const mockChatData = {
  channels: [
    { id: 1, name: "General", unread: 0 },
    { id: 2, name: "Team", unread: 3 },
    { id: 3, name: "Project-A", unread: 0 }
  ],
  directMessages: [
    { id: 4, name: "John Doe", status: "online", unread: 0 },
    { id: 5, name: "Maria Benson", status: "offline", unread: 1 },
    { id: 6, name: "Robert Thompson", status: "online", unread: 0 }
  ],
  messages: {
    1: [
      { id: 101, sender: "John Doe", senderInitials: "JD", content: "Good morning everyone!", timestamp: "2023-05-17T08:30:00Z", isAdmin: true },
      { id: 102, sender: "Maria Benson", senderInitials: "MB", content: "Morning! Anyone have updates on the inventory count?", timestamp: "2023-05-17T08:45:00Z", isAdmin: false },
      { id: 103, sender: "Robert Thompson", senderInitials: "RT", content: "I'll be finishing it today.", timestamp: "2023-05-17T08:47:00Z", isAdmin: false },
      { id: 104, sender: "John Doe", senderInitials: "JD", content: "Great! Let's review it in the meeting.", timestamp: "2023-05-17T08:50:00Z", isAdmin: true }
    ],
    2: [
      { id: 201, sender: "John Doe", senderInitials: "JD", content: "Team meeting at 2pm today", timestamp: "2023-05-17T09:30:00Z", isAdmin: true },
      { id: 202, sender: "Maria Benson", senderInitials: "MB", content: "Will we be discussing the new module?", timestamp: "2023-05-17T09:32:00Z", isAdmin: false },
      { id: 203, sender: "John Doe", senderInitials: "JD", content: "Yes, and the quarterly goals", timestamp: "2023-05-17T09:33:00Z", isAdmin: true },
      { id: 204, sender: "Robert Thompson", senderInitials: "RT", content: "@John Doe can we also discuss the new inventory system?", timestamp: "2023-05-17T09:40:00Z", isAdmin: false, mentions: ["John Doe"] }
    ]
  }
};

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { showNotification } = useNotifications();
  const [activeChannel, setActiveChannel] = useState<number>(1);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize WebSocket connection and setup connection for real application
  // This is a placeholder for demonstration
  useEffect(() => {
    // For demo, we'll just load mock data
    setChatMessages(mockChatData.messages[activeChannel]);
    
    // In real application:
    // const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    // const wsUrl = `${protocol}//${window.location.host}/ws`;
    // const socket = new WebSocket(wsUrl);
    
    // socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   // Handle incoming messages, notifications, etc.
    // };
    
    // return () => {
    //   socket.close();
    // };
  }, [activeChannel]);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // In a real app, we would send this via WebSocket
    const newMessage = {
      id: Date.now(),
      sender: user?.username || 'You',
      senderInitials: user?.username?.substring(0, 2).toUpperCase() || 'YO',
      content: message,
      timestamp: new Date().toISOString(),
      isAdmin: user?.role === 'Admin'
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessage("");
    
    // Check for mentions in message
    const mentionRegex = /@(\w+)/g;
    const mentions = message.match(mentionRegex);
    
    if (mentions) {
      mentions.forEach(mention => {
        const username = mention.substring(1); // Remove the @ symbol
        // In a real app, we would check if this user exists and send them a notification
        toast({
          title: "Mention Sent",
          description: `You mentioned ${username} in your message.`,
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
      title: "New Chat Message",
      body: "Maria mentioned you in the Team chat",
      onClick: () => setActiveChannel(2)
    });
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Chat</h2>
      
      <div className="flex flex-col md:flex-row gap-4 flex-1 overflow-hidden">
        {/* Chat Sidebar */}
        <Card className="w-full md:w-64 flex-shrink-0">
          <Tabs defaultValue="channels">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="direct">Direct</TabsTrigger>
            </TabsList>
            
            <TabsContent value="channels" className="space-y-2 p-2">
              {mockChatData.channels.map((channel) => (
                <div 
                  key={channel.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
                    activeChannel === channel.id 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveChannel(channel.id)}
                >
                  <span># {channel.name}</span>
                  {channel.unread > 0 && (
                    <span className="bg-accent text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {channel.unread}
                    </span>
                  )}
                </div>
              ))}
              
              <Button variant="ghost" className="w-full justify-start pl-3" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Channel
              </Button>
            </TabsContent>
            
            <TabsContent value="direct" className="space-y-2 p-2">
              {mockChatData.directMessages.map((dm) => (
                <div 
                  key={dm.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
                    activeChannel === dm.id 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveChannel(dm.id)}
                >
                  <div className="flex items-center">
                    <span className={`h-2 w-2 rounded-full mr-2 ${
                      dm.status === 'online' ? 'bg-secondary' : 'bg-gray-300'
                    }`} />
                    <span>{dm.name}</span>
                  </div>
                  {dm.unread > 0 && (
                    <span className="bg-accent text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {dm.unread}
                    </span>
                  )}
                </div>
              ))}
              
              <Button variant="ghost" className="w-full justify-start pl-3" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Message
              </Button>
            </TabsContent>
          </Tabs>
        </Card>
        
        {/* Chat Content */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {activeChannel <= 3 ? `# ${mockChatData.channels.find(c => c.id === activeChannel)?.name}` : 
                  mockChatData.directMessages.find(d => d.id === activeChannel)?.name}
              </CardTitle>
              
              {/* Demo notification button - would be triggered by real events in production */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShowNotification}
                className="text-xs"
              >
                Demo Notification
              </Button>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className={msg.isAdmin ? "bg-primary text-white" : "bg-gray-200"}>
                      {msg.senderInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${msg.isAdmin ? "text-primary" : "text-gray-900"}`}>
                        {msg.sender}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <CardContent className="p-4 border-t mt-auto">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Send</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
