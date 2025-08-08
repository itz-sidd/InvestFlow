import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Accounts from "@/pages/accounts";
import Goals from "@/pages/goals";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/me'],
    queryFn: getCurrentUser,
    retry: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <AuthWrapper>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/accounts" component={Accounts} />
        <Route path="/goals" component={Goals} />
        <Route component={NotFound} />
      </Switch>
    </AuthWrapper>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
