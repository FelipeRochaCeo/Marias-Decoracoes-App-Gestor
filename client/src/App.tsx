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
import { useAuth } from "@/hooks/use-auth";
import WebSocketManager from "@/components/core/WebSocketManager";

// Componente para proteger rotas que requerem autenticação
const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Enquanto verifica o estado de autenticação, mostra uma tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-xl font-medium">Carregando...</p>
          <p className="text-muted-foreground">Verificando sua autenticação</p>
        </div>
      </div>
    );
  }

  // Se o usuário não estiver autenticado, redireciona para o login
  if (!user) {
    setLocation("/login");
    return null;
  }

  // Se estiver autenticado, renderiza o componente
  return <Component {...rest} />;
};

// Componente para rotas públicas que redireciona para o dashboard se já estiver autenticado
const PublicRoute = ({ component: Component, ...rest }: any) => {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Enquanto verifica o estado de autenticação, mostra uma tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-xl font-medium">Carregando...</p>
          <p className="text-muted-foreground">Verificando sua autenticação</p>
        </div>
      </div>
    );
  }

  // Se o usuário já estiver autenticado, redireciona para o dashboard
  if (user) {
    setLocation("/");
    return null;
  }

  // Se não estiver autenticado, renderiza o componente
  return <Component {...rest} />;
};

function Router() {
  const { user } = useAuth();

  // Se o usuário não estiver autenticado, apenas mostra a página de login
  if (!user) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/:rest*">
          {() => <Redirect to="/login" />}
        </Route>
      </Switch>
    );
  }

  // Se estiver autenticado, mostra a aplicação com AppShell
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/chat" component={Chat} />
        <Route path="/feedback" component={Feedback} />
        <Route path="/team" component={Team} />
        <Route path="/configuration" component={Configuration} />
        <Route path="/login">
          {() => <Redirect to="/" />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AppShell>
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
            {/* WebSocket desativado temporariamente */}
            {/* <WebSocketManager /> */}
          </ModuleProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
