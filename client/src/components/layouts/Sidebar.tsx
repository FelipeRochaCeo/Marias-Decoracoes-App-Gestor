import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart3,
  Home,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  Star,
  Users,
  ClipboardList
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  // Verifica se a rota está ativa
  const isActive = (path: string) => location === path;

  // Lógica para iniciais do avatar
  const getInitials = () => {
    if (!user) return "?";
    if (user.fullName) {
      return user.fullName
        .split(" ")
        .map(name => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <aside 
      id="sidebar" 
      className={`${isOpen ? 'fixed inset-y-0 left-0 z-30 w-64' : 'hidden'} md:flex md:flex-col md:w-64 bg-background border-r`}
    >
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-semibold">MD</span>
          </div>
          <h1 className="text-lg font-semibold">Marias Decorações</h1>
        </div>
      </div>
      
      {/* Perfil do Usuário */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user?.fullName || user?.username}</p>
            <div className="flex items-center space-x-1">
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu de Navegação */}
      <nav className="p-2 flex-1 overflow-y-auto">
        <div className="space-y-1">
          <Link href="/">
            <div className={`block px-3 py-2 rounded-md ${isActive('/') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'} font-medium`}>
              <div className="flex items-center space-x-3">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </div>
            </div>
          </Link>
          
          <Link href="/team">
            <div className={`block px-3 py-2 rounded-md ${isActive('/team') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'} font-medium`}>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5" />
                <span>Equipe</span>
              </div>
            </div>
          </Link>
          
          <Link href="/chat">
            <div className={`block px-3 py-2 rounded-md ${isActive('/chat') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'} font-medium`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5" />
                  <span>Conversas</span>
                </div>
                <span className="bg-destructive text-destructive-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium">3</span>
              </div>
            </div>
          </Link>
          
          <Link href="/inventory">
            <div className={`block px-3 py-2 rounded-md ${isActive('/inventory') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'} font-medium`}>
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5" />
                <span>Estoque</span>
              </div>
            </div>
          </Link>
          
          <Link href="/tasks">
            <div className={`block px-3 py-2 rounded-md ${isActive('/tasks') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'} font-medium`}>
              <div className="flex items-center space-x-3">
                <ClipboardList className="h-5 w-5" />
                <span>Tarefas</span>
              </div>
            </div>
          </Link>
          
          <Link href="/feedback">
            <div className={`block px-3 py-2 rounded-md ${isActive('/feedback') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'} font-medium`}>
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5" />
                <span>Feedback</span>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="mt-6">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sistema</h3>
          <div className="mt-2 space-y-1">
            <Link href="/configuration">
              <div className={`block px-3 py-2 rounded-md ${isActive('/configuration') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'} font-medium`}>
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </div>
              </div>
            </Link>
            {/* Somente o administrador pode ver a página de análises */}
            {user?.role === "Administrador" && (
              <Link href="/analytics">
                <div className={`block px-3 py-2 rounded-md ${isActive('/analytics') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'} font-medium`}>
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-5 w-5" />
                    <span>Análises</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t">
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 border rounded-md shadow-sm bg-background text-sm font-medium hover:bg-accent"
        >
          <LogOut className="h-5 w-5 mr-2 text-muted-foreground" />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
