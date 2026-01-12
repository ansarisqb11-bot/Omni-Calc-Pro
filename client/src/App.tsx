import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Categories from "@/pages/Categories";
import CalculatorTools from "@/pages/CalculatorTools";
import FinanceTools from "@/pages/FinanceTools";
import UnitConverter from "@/pages/UnitConverter";
import DateTimeTools from "@/pages/DateTimeTools";
import HealthTools from "@/pages/HealthTools";
import MathTools from "@/pages/MathTools";
import GeometryTools from "@/pages/GeometryTools";
import ScienceTools from "@/pages/ScienceTools";
import ConstructionTools from "@/pages/ConstructionTools";
import TravelTools from "@/pages/TravelTools";
import AiTools from "@/pages/AiTools";
import Notes from "@/pages/Notes";
import NumberTools from "@/pages/NumberTools";
import EducationTools from "@/pages/EducationTools";
import MedicalTools from "@/pages/MedicalTools";
import LifestyleTools from "@/pages/LifestyleTools";
import AutomobileTools from "@/pages/AutomobileTools";
import AgricultureTools from "@/pages/AgricultureTools";
import DeveloperTools from "@/pages/DeveloperTools";
import EcommerceTools from "@/pages/EcommerceTools";
import EnvironmentTools from "@/pages/EnvironmentTools";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/categories" component={Categories} />
      <Route path="/calculator" component={CalculatorTools} />
      <Route path="/finance" component={FinanceTools} />
      <Route path="/units" component={UnitConverter} />
      <Route path="/date-time" component={DateTimeTools} />
      <Route path="/health" component={HealthTools} />
      <Route path="/math" component={MathTools} />
      <Route path="/geometry" component={GeometryTools} />
      <Route path="/science" component={ScienceTools} />
      <Route path="/construction" component={ConstructionTools} />
      <Route path="/travel" component={TravelTools} />
      <Route path="/ai-tools" component={AiTools} />
      <Route path="/notes" component={Notes} />
      <Route path="/numbers" component={NumberTools} />
      <Route path="/education" component={EducationTools} />
      <Route path="/medical" component={MedicalTools} />
      <Route path="/lifestyle" component={LifestyleTools} />
      <Route path="/automobile" component={AutomobileTools} />
      <Route path="/agriculture" component={AgricultureTools} />
      <Route path="/developer" component={DeveloperTools} />
      <Route path="/ecommerce" component={EcommerceTools} />
      <Route path="/environment" component={EnvironmentTools} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
