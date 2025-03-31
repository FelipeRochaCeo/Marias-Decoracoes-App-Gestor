import { Link, useLocation } from "wouter";
import { 
  Home, 
  ClipboardList, 
  Package, 
  MessageSquare, 
  Users,
  Settings
} from "lucide-react";

const MobileNavigation = () => {
  const [location] = useLocation();

  // Verifica se a rota está ativa
  const isActive = (path: string) => location === path;

  return (
    <div className="md:hidden bg-background border-t">
      <nav className="flex justify-around">
        <Link href="/">
          <div className={`flex flex-col items-center py-2 px-3 ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Início</span>
          </div>
        </Link>
        
        <Link href="/tasks">
          <div className={`flex flex-col items-center py-2 px-3 ${isActive("/tasks") ? "text-primary" : "text-muted-foreground"}`}>
            <ClipboardList className="h-5 w-5" />
            <span className="text-xs mt-1">Tarefas</span>
          </div>
        </Link>
        
        <Link href="/inventory">
          <div className={`flex flex-col items-center py-2 px-3 ${isActive("/inventory") ? "text-primary" : "text-muted-foreground"}`}>
            <Package className="h-5 w-5" />
            <span className="text-xs mt-1">Estoque</span>
          </div>
        </Link>
        
        <Link href="/chat">
          <div className={`flex flex-col items-center py-2 px-3 ${isActive("/chat") ? "text-primary" : "text-muted-foreground"} relative`}>
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs mt-1">Conversas</span>
            {/* Badge de notificação - seria dinâmico em um app real */}
            <span className="absolute top-0 right-0 h-4 w-4 bg-destructive rounded-full text-xs text-destructive-foreground flex items-center justify-center">3</span>
          </div>
        </Link>
        
        <Link href="/team">
          <div className={`flex flex-col items-center py-2 px-3 ${isActive("/team") ? "text-primary" : "text-muted-foreground"}`}>
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Equipe</span>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default MobileNavigation;
