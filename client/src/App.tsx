import { Switch, Route } from "wouter";
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
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "./store/themeStore";
import { AuthProvider } from "./store/authStore";
import { ModuleProvider } from "./store/moduleStore";

function Router() {
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
          </ModuleProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
