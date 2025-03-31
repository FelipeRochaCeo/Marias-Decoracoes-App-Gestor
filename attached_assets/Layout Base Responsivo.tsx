// shared/layouts/AdaptiveLayout.tsx
import { useBreakpoint } from '@/hooks/useBreakpoint';

export const AdaptiveLayout = ({ children }: { children: React.ReactNode }) => {
  const breakpoint = useBreakpoint();
  
  return (
    <div className={`min-h-screen ${breakpoint === 'mobile' ? 
      'px-2 grid grid-cols-1' : 
      'px-4 grid grid-cols-[240px_1fr]'}`}>
      
      <NavigationDrawer />
      <main className="overflow-auto max-h-screen p-4">
        {children}
      </main>
    </div>
  );
};