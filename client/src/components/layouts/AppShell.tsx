import { useState, useEffect, ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LogOut, Menu, User } from "lucide-react";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('#sidebar') && !target.closest('#mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [mobileMenuOpen]);

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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <div className="p-8 bg-card rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Marias Decorações</h1>
          <p className="text-muted-foreground mb-4">Por favor, faça login para acessar o sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <header className="bg-background border-b py-3 px-4 flex justify-between items-center md:hidden">
        <button 
          id="mobile-menu-button"
          className="text-muted-foreground"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">Marias Decorações</h1>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{user.fullName || user.username}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                {user.role}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="text-destructive flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 z-20 md:hidden" 
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar isOpen={mobileMenuOpen} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop header */}
        <header className="bg-background border-b py-3 px-6 hidden md:flex justify-between items-center">
          <h1 className="text-xl font-semibold">Marias Decorações</h1>
          
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.fullName || user.username}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user.username}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                    {user.role}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main content scrollable area */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
        
        {/* Mobile Bottom Navigation */}
        <MobileNavigation />
      </main>
    </div>
  );
};

export default AppShell;
