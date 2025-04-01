import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  // Check if the route is active
  const isActive = (path: string) => location === path;

  return (
    <aside 
      id="sidebar" 
      className={`${isOpen ? 'fixed inset-y-0 left-0 z-30 w-64' : 'hidden'} md:flex md:flex-col md:w-64 bg-white border-r border-gray-200`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-semibold">MD</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-800">Marias Decorações</h1>
        </div>
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-700 font-medium">
              {user?.username.substring(0, 2).toUpperCase() || 'JD'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{user?.username || 'John Doe'}</p>
            <div className="flex items-center space-x-1">
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                {user?.role || 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="p-2 flex-1 overflow-y-auto">
        <div className="space-y-1">
          <Link href="/">
            <div className={`block px-3 py-2 rounded-md ${isActive('/') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'} font-medium`}>
              <div className="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Painel</span>
              </div>
            </div>
          </Link>
          
          <Link href="/team">
            <div className={`block px-3 py-2 rounded-md ${isActive('/team') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'} font-medium`}>
              <div className="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span>Equipe</span>
              </div>
            </div>
          </Link>
          
          <Link href="/chat">
            <div className={`block px-3 py-2 rounded-md ${isActive('/chat') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'} font-medium`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                  </svg>
                  <span>Conversa</span>
                </div>
                <span className="bg-accent text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium">3</span>
              </div>
            </div>
          </Link>
          
          <Link href="/inventory">
            <div className={`block px-3 py-2 rounded-md ${isActive('/inventory') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'} font-medium`}>
              <div className="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                <span>Estoque</span>
              </div>
            </div>
          </Link>
          
          <Link href="/tasks">
            <div className={`block px-3 py-2 rounded-md ${isActive('/tasks') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'} font-medium`}>
              <div className="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
                </svg>
                <span>Tarefas</span>
              </div>
            </div>
          </Link>
          
          <Link href="/feedback">
            <div className={`block px-3 py-2 rounded-md ${isActive('/feedback') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'} font-medium`}>
              <div className="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                <span>Avaliações</span>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="mt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sistema</h3>
          <div className="mt-2 space-y-1">
            <Link href="/configuration">
              <div className={`block px-3 py-2 rounded-md ${isActive('/configuration') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'} font-medium`}>
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span>Configuração</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
