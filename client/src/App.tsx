import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import AppShell from "@/components/layouts/AppShell";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Tasks from "@/pages/tasks";
import Chat from "@/pages/chat";
import Feedback from "@/pages/feedback";
import Team from "@/pages/team";
import Configuration from "@/pages/configuration";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "./store/themeStore";
import { AuthProvider } from "./store/authStore";
import { ModuleProvider } from "./store/moduleStore";
import { useAuth } from "./hooks/use-auth";

// Protected route component
const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // If auth is still loading, show nothing (or optionally a loading spinner)
  if (isLoading) return <div className="flex h-screen w-full items-center justify-center">Carregando...</div>;
  
  // If user is not authenticated, redirect to login
  if (!user) {
    setLocation("/login");
    return null;
  }
  
  // User is authenticated, render the component
  return <Component {...rest} />;
};

function Router() {
  const { user } = useAuth();
  const [location] = useLocation();

  // Redirecionar para login se não estiver na página de login e não estiver autenticado
  if (!user && location !== "/login") {
    return <Redirect to="/login" />;
  }

  // Redirecionar para dashboard se estiver na raiz e estiver autenticado
  if (user && location === "/") {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Switch>
      <Route path="/login">
        {user ? <Redirect to="/dashboard" /> : <Login />}
      </Route>
      <Route path="/">
        {!user ? <Redirect to="/login" /> : (
          <AppShell>
            <Switch>
              <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
              <Route path="/inventory" component={() => <ProtectedRoute component={Inventory} />} />
              <Route path="/tasks" component={() => <ProtectedRoute component={Tasks} />} />
              <Route path="/chat" component={() => <ProtectedRoute component={Chat} />} />
              <Route path="/feedback" component={() => <ProtectedRoute component={Feedback} />} />
              <Route path="/team" component={() => <ProtectedRoute component={Team} />} />
              <Route path="/configuration" component={() => <ProtectedRoute component={Configuration} />} />
              <Route component={NotFound} />
            </Switch>
          </AppShell>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ModuleProvider>
            <Router />
            <Toaster />
          </ModuleProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
