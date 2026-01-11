import { useState } from "react";
import { Link } from "wouter";
import { evaluate } from "mathjs";
import { motion } from "framer-motion";
import { 
  Search, Grid3X3, Calculator, Wallet, Heart, Ruler, Clock, 
  FlaskConical, Compass, HardHat, Plane, MessageSquare, Binary,
  Delete, Divide, X, Minus, Plus, Equal, Percent,
  ArrowRight, Sparkles, TrendingUp, Scale, Zap
} from "lucide-react";
import { useAddToHistory } from "@/hooks/use-history";

type TabType = "Basic" | "Scientific" | "Percentage";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("Basic");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const historyMutation = useAddToHistory();

  const tabs: { id: TabType; label: string; icon: typeof Calculator }[] = [
    { id: "Basic", label: "Basic", icon: Calculator },
    { id: "Scientific", label: "Scientific", icon: FlaskConical },
    { id: "Percentage", label: "Percentage", icon: Percent },
  ];

  const handlePress = (key: string) => {
    if (key === "C") {
      setExpression("");
      setResult("0");
      return;
    }

    if (key === "backspace") {
      setExpression((prev) => prev.slice(0, -1));
      if (expression.length <= 1) {
        setResult("0");
      }
      return;
    }

    if (key === "=") {
      try {
        const evalResult = evaluate(expression).toString();
        setResult(evalResult);
        historyMutation.mutate({
          expression,
          result: evalResult,
          category: activeTab
        });
        setExpression(evalResult);
      } catch {
        setResult("Error");
      }
      return;
    }

    if (key === "%") {
      try {
        const evalResult = (evaluate(expression) / 100).toString();
        setResult(evalResult);
        setExpression(evalResult);
      } catch {
        setResult("Error");
      }
      return;
    }

    setExpression((prev) => prev + key);
  };

  const categories = [
    { title: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance", count: 8 },
    { title: "Calculator", icon: Calculator, color: "bg-blue-500", href: "/calculator", count: 4 },
    { title: "Health", icon: Heart, color: "bg-pink-500", href: "/health", count: 7 },
    { title: "Units", icon: Ruler, color: "bg-amber-500", href: "/units", count: 11 },
    { title: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time", count: 7 },
    { title: "Math", icon: Binary, color: "bg-indigo-500", href: "/math", count: 5 },
    { title: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry", count: 5 },
    { title: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science", count: 5 },
    { title: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction", count: 5 },
    { title: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel", count: 5 },
    { title: "AI Tools", icon: MessageSquare, color: "bg-violet-500", href: "/ai-tools", count: 2 },
  ];

  const quickTools = [
    { title: "BMI Calculator", icon: Scale, color: "bg-pink-500", href: "/health" },
    { title: "Loan EMI", icon: TrendingUp, color: "bg-emerald-500", href: "/finance" },
    { title: "Unit Converter", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Age Calculator", icon: Clock, color: "bg-purple-500", href: "/date-time" },
  ];

  const basicButtons = [
    { label: "C", value: "C", variant: "function" },
    { label: <Delete className="w-5 h-5" />, value: "backspace", variant: "function" },
    { label: "%", value: "%", variant: "function" },
    { label: <Divide className="w-5 h-5" />, value: "/", variant: "operator" },
    { label: "7", value: "7", variant: "number" },
    { label: "8", value: "8", variant: "number" },
    { label: "9", value: "9", variant: "number" },
    { label: <X className="w-5 h-5" />, value: "*", variant: "operator" },
    { label: "4", value: "4", variant: "number" },
    { label: "5", value: "5", variant: "number" },
    { label: "6", value: "6", variant: "number" },
    { label: <Minus className="w-5 h-5" />, value: "-", variant: "operator" },
    { label: "1", value: "1", variant: "number" },
    { label: "2", value: "2", variant: "number" },
    { label: "3", value: "3", variant: "number" },
    { label: <Plus className="w-5 h-5" />, value: "+", variant: "operator" },
    { label: "00", value: "00", variant: "number" },
    { label: "0", value: "0", variant: "number" },
    { label: ".", value: ".", variant: "number" },
    { label: <Equal className="w-5 h-5" />, value: "=", variant: "equals" },
  ];

  const getButtonClass = (variant: string) => {
    switch (variant) {
      case "function": return "bg-muted hover:bg-muted/80 text-foreground";
      case "operator": return "bg-primary/20 hover:bg-primary/30 text-primary";
      case "equals": return "bg-primary hover:bg-primary/90 text-primary-foreground";
      default: return "bg-card hover:bg-muted text-foreground";
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Search Bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 200+ tools..."
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            data-testid="input-search-tools"
          />
        </div>
      </div>

      {/* All Categories Card */}
      <div className="px-4 py-3">
        <Link href="/categories">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-4 flex items-center justify-between cursor-pointer"
            data-testid="card-all-categories"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Grid3X3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">All Categories</h2>
                <p className="text-sm text-muted-foreground">Browse 200+ tools across 12 categories</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-primary" />
          </motion.div>
        </Link>
      </div>

      {/* Quick Tools */}
      <div className="px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {quickTools.map((tool) => (
            <Link key={tool.title} href={tool.href}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl whitespace-nowrap cursor-pointer hover:bg-muted transition-colors"
                data-testid={`quick-tool-${tool.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`w-6 h-6 rounded-md ${tool.color} bg-opacity-20 flex items-center justify-center`}>
                  <tool.icon className={`w-3.5 h-3.5 ${tool.color.replace("bg-", "text-")}`} />
                </div>
                <span className="text-sm text-foreground">{tool.title}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`tab-${tab.id.toLowerCase()}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calculator Display */}
      <div className="px-4 py-3">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="text-right">
            <p className="text-muted-foreground text-sm h-6 overflow-x-auto scrollbar-hide">
              {expression || "0"}
            </p>
            <p className="text-4xl font-bold text-foreground mt-1 overflow-x-auto scrollbar-hide">
              {result}
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Buttons */}
      <div className="flex-1 px-4 pb-4">
        <div className="grid grid-cols-4 gap-2 h-full">
          {basicButtons.map((btn, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePress(btn.value)}
              data-testid={`button-calc-${btn.value}`}
              className={`rounded-xl font-medium text-lg flex items-center justify-center transition-all ${getButtonClass(btn.variant)}`}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Category Grid - Bottom */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Categories</h3>
        <div className="grid grid-cols-4 gap-2">
          {categories.slice(0, 8).map((cat) => (
            <Link key={cat.title} href={cat.href}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1.5 p-2 bg-card border border-border rounded-xl cursor-pointer hover:bg-muted transition-colors"
                data-testid={`category-${cat.title.toLowerCase()}`}
              >
                <div className={`w-8 h-8 rounded-lg ${cat.color} bg-opacity-20 flex items-center justify-center`}>
                  <cat.icon className={`w-4 h-4 ${cat.color.replace("bg-", "text-")}`} />
                </div>
                <span className="text-xs text-foreground text-center">{cat.title}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
