import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import { HistorySidebar } from "@/components/HistorySidebar";
import NotFound from "@/pages/not-found";

// Page Imports
import CoreCalculator from "@/pages/CoreCalculator";
import FinanceTools from "@/pages/FinanceTools";
import UnitConverter from "@/pages/UnitConverter";
import DateTimeTools from "@/pages/DateTimeTools";
import AiTools from "@/pages/AiTools";
import Notes from "@/pages/Notes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CoreCalculator} />
      <Route path="/finance" component={FinanceTools} />
      <Route path="/units" component={UnitConverter} />
      <Route path="/date-time" component={DateTimeTools} />
      <Route path="/ai-tools" component={AiTools} />
      <Route path="/notes" component={Notes} />
      {/* Placeholders for other routes */}
      <Route path="/math" component={() => <div className="p-8 text-center text-muted-foreground">Math Tools Coming Soon</div>} />
      <Route path="/geometry" component={() => <div className="p-8 text-center text-muted-foreground">Geometry Tools Coming Soon</div>} />
      <Route path="/everyday" component={() => <div className="p-8 text-center text-muted-foreground">Everyday Tools Coming Soon</div>} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  // Check if current path needs full width (like AI Tools) or standard layout
  const [location] = useLocation();
  const showHistory = !['/ai-tools', '/notes'].includes(location);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-body">
      <Sidebar />
      <main className={`flex-1 overflow-y-auto ml-20 lg:ml-64 ${showHistory ? 'xl:mr-80' : ''}`}>
        <div className="container mx-auto p-4 md:p-8 lg:p-12 max-w-7xl">
          {children}
        </div>
      </main>
      {showHistory && <HistorySidebar />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
