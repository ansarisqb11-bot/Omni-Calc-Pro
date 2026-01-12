import { useState } from "react";
import { Link } from "wouter";
import { evaluate } from "mathjs";
import { motion } from "framer-motion";
import { 
  Search, Grid3X3, Delete, Divide, X, Minus, Plus, Equal, ArrowRight,
  Wallet, Heart, Ruler, Clock, Binary, Compass, FlaskConical, HardHat, 
  Plane, MessageSquare, Hash, Percent
} from "lucide-react";
import { useAddToHistory } from "@/hooks/use-history";

export default function Home() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const historyMutation = useAddToHistory();

  const categories = [
    { title: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Numbers", icon: Hash, color: "bg-teal-500", href: "/numbers" },
    { title: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "AI Tools", icon: MessageSquare, color: "bg-violet-500", href: "/ai-tools" },
  ];

  const handlePress = (key: string) => {
    if (key === "AC") {
      setExpression("");
      setResult("0");
      return;
    }

    if (key === "C") {
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
          category: "Calculator"
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

    if (key === "±") {
      if (expression) {
        if (expression.startsWith("-")) {
          setExpression(expression.slice(1));
        } else {
          setExpression("-" + expression);
        }
      }
      return;
    }

    setExpression((prev) => prev + key);
  };

  const buttons = [
    { label: "AC", value: "AC", variant: "function" },
    { label: "(", value: "(", variant: "function" },
    { label: ")", value: ")", variant: "function" },
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
    { label: "0", value: "0", variant: "number" },
    { label: ".", value: ".", variant: "number" },
    { label: <Delete className="w-5 h-5" />, value: "C", variant: "function" },
    { label: <Equal className="w-5 h-5" />, value: "=", variant: "equals" },
  ];

  const getButtonClass = (variant: string) => {
    switch (variant) {
      case "function": 
        return "bg-slate-600 hover:bg-slate-500 text-white";
      case "operator": 
        return "bg-amber-600 hover:bg-amber-500 text-white";
      case "equals": 
        return "bg-emerald-500 hover:bg-emerald-400 text-white";
      default: 
        return "bg-slate-700 hover:bg-slate-600 text-white";
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Search Bar */}
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 300+ tools..."
            className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
            data-testid="input-search-tools"
          />
        </div>
      </div>

      {/* Categories Bar - Horizontal Scroll */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <Link key={cat.title} href={cat.href}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl whitespace-nowrap cursor-pointer hover:bg-muted transition-colors"
                data-testid={`quick-cat-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`w-6 h-6 rounded-md ${cat.color} flex items-center justify-center`}>
                  <cat.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm text-foreground">{cat.title}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Calculator Card - Always Dark Theme */}
      <div className="flex-1 px-4 pb-4 flex flex-col min-h-0">
        <div className="bg-slate-800 rounded-2xl p-4 flex-1 flex flex-col">
          {/* Display */}
          <div className="bg-slate-900/60 rounded-xl p-4 mb-4">
            <div className="text-right min-h-[70px] flex flex-col justify-end">
              <p className="text-slate-400 text-sm h-5 overflow-x-auto scrollbar-hide">
                {expression || " "}
              </p>
              <p className="text-4xl font-light text-white mt-1 overflow-x-auto scrollbar-hide">
                {result}
              </p>
            </div>
          </div>

          {/* Keypad - 4x5 Grid */}
          <div className="grid grid-cols-4 gap-2 flex-1">
            {buttons.map((btn, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePress(btn.value)}
                data-testid={`button-calc-${btn.value}`}
                className={`rounded-xl font-medium text-xl flex items-center justify-center transition-all min-h-[52px] ${getButtonClass(btn.variant)}`}
              >
                {btn.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* All Categories Button */}
      <div className="px-4 pb-4">
        <Link href="/categories">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="bg-slate-800 rounded-2xl p-4 flex items-center justify-between cursor-pointer"
            data-testid="card-all-categories"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Grid3X3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-white">All Categories</h2>
                <p className="text-sm text-slate-400">Browse 300+ tools</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
