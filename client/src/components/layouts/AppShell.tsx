import { useState, useEffect, ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";
import { useAuth } from "@/hooks/use-auth";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

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

  if (!user) {
    // We can show a login screen here when auth is fully implemented
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Business Manager</h1>
          <p className="text-gray-600 mb-4">Please log in to access the application.</p>
          {/* Login form would go here */}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 flex justify-between items-center md:hidden">
        <button 
          id="mobile-menu-button"
          className="text-gray-500"
          onClick={toggleMobileMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Business Manager</h1>
        <button className="text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden" 
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar isOpen={mobileMenuOpen} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
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
