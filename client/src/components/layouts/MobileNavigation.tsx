import { Link, useLocation } from "wouter";

const MobileNavigation = () => {
  const [location] = useLocation();

  // Check if the route is active
  const isActive = (path: string) => location === path;

  return (
    <div className="md:hidden bg-white border-t border-gray-200">
      <nav className="flex justify-around">
        <Link href="/">
          <div className={`flex flex-col items-center py-2 px-3 ${isActive("/") ? "text-primary" : "text-gray-600"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs mt-1">Início</span>
          </div>
        </Link>
        
        <Link href="/tasks">
          <div className={`flex flex-col items-center py-2 px-3 ${isActive("/tasks") ? "text-primary" : "text-gray-600"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="text-xs mt-1">Tarefas</span>
          </div>
        </Link>
        
        <Link href="/inventory">
          <div className={`flex flex-col items-center py-2 px-3 ${isActive("/inventory") ? "text-primary" : "text-gray-600"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <span className="text-xs mt-1">Estoque</span>
          </div>
        </Link>
        
        <Link href="/chat">
          <div className={`flex flex-col items-center py-2 px-3 ${isActive("/chat") ? "text-primary" : "text-gray-600"} relative`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-xs mt-1">Conversa</span>
            {/* Notification badge - would be dynamic in real app */}
            <span className="absolute top-1 right-0 h-4 w-4 bg-accent rounded-full text-xs text-white flex items-center justify-center">3</span>
          </div>
        </Link>
        
        <Link href="/team">
          <div className={`flex flex-col items-center py-2 px-3 ${isActive("/team") ? "text-primary" : "text-gray-600"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">Equipe</span>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default MobileNavigation;
