import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Categories from "@/pages/Categories";
import CalculatorTools from "@/pages/CalculatorTools";
import FinanceTools from "@/pages/FinanceTools";
import UnitConverter from "@/pages/UnitConverter";
import DateTimeTools from "@/pages/DateTimeTools";
import AiTools from "@/pages/AiTools";
import Notes from "@/pages/Notes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/categories" component={Categories} />
      <Route path="/calculator" component={CalculatorTools} />
      <Route path="/finance" component={FinanceTools} />
      <Route path="/units" component={UnitConverter} />
      <Route path="/date-time" component={DateTimeTools} />
      <Route path="/ai-tools" component={AiTools} />
      <Route path="/notes" component={Notes} />
      <Route component={NotFound} />
    </Switch>
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
