import { useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { evaluate } from "mathjs";
import { motion } from "framer-motion";
import { 
  Search, Grid3X3, ChevronRight,
  Wallet, Heart, Ruler, Clock, Binary, Compass, FlaskConical, HardHat, 
  Plane, MessageSquare, Hash, GraduationCap, Stethoscope, Home as HomeIcon,
  Car, Leaf, Code, ShoppingCart, Globe, ShoppingBag, Palette, StickyNote, Calculator, Shirt,
  Users, BarChart3, Proportions
} from "lucide-react";
import { useAddToHistory } from "@/hooks/use-history";

export default function Home() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [hasCalculated, setHasCalculated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const historyMutation = useAddToHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { title: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Sizes", icon: Shirt, color: "bg-violet-500", href: "/size-converter" },
    { title: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Numbers", icon: Hash, color: "bg-teal-500", href: "/numbers" },
    { title: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "Education", icon: GraduationCap, color: "bg-blue-600", href: "/education" },
    { title: "Medical", icon: Stethoscope, color: "bg-red-500", href: "/medical" },
    { title: "Lifestyle", icon: HomeIcon, color: "bg-lime-500", href: "/lifestyle" },
    { title: "Automobile", icon: Car, color: "bg-slate-500", href: "/automobile" },
    { title: "Agriculture", icon: Leaf, color: "bg-green-600", href: "/agriculture" },
    { title: "Developer", icon: Code, color: "bg-gray-600", href: "/developer" },
    { title: "E-Commerce", icon: ShoppingCart, color: "bg-fuchsia-500", href: "/ecommerce" },
    { title: "Environment", icon: Globe, color: "bg-emerald-600", href: "/environment" },
    { title: "Smart Life", icon: ShoppingBag, color: "bg-indigo-500", href: "/smart-life" },
    { title: "Color Tools", icon: Palette, color: "bg-fuchsia-500", href: "/color-tools" },
    { title: "Population", icon: Users, color: "bg-rose-500", href: "/population" },
    { title: "Development", icon: BarChart3, color: "bg-amber-500", href: "/development" },
    { title: "Designer", icon: Proportions, color: "bg-pink-500", href: "/designer" },
    { title: "AI Tools", icon: MessageSquare, color: "bg-violet-500", href: "/ai-tools" },
    { title: "Notes", icon: StickyNote, color: "bg-yellow-500", href: "/notes" },
  ];

  const formatDisplay = (val: string) => {
    if (!val || val === "Error") return val;
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    if (!Number.isFinite(num)) return val;
    if (val.includes(".") && val.endsWith(".")) return val;
    const parts = val.split(".");
    const intPart = parseInt(parts[0]).toLocaleString("en-US");
    if (parts.length > 1) return intPart + "." + parts[1];
    return intPart;
  };

  const formatExpression = (expr: string) => {
    return expr
      .replace(/\*/g, " \u00D7 ")
      .replace(/\//g, " \u00F7 ")
      .replace(/\+/g, " + ")
      .replace(/(?<=\d)-/g, " - ");
  };

  const liveEvaluate = useCallback((expr: string) => {
    if (!expr) {
      setResult("0");
      return;
    }
    try {
      const evalResult = evaluate(expr).toString();
      setResult(evalResult);
    } catch {
      // don't update result for incomplete expressions
    }
  }, []);

  const handlePress = useCallback((key: string) => {
    if (key === "AC") {
      setExpression("");
      setResult("0");
      setHasCalculated(false);
      return;
    }

    if (key === "C") {
      setExpression((prev) => {
        const next = prev.slice(0, -1);
        if (next.length === 0) {
          setResult("0");
        } else {
          liveEvaluate(next);
        }
        return next;
      });
      setHasCalculated(false);
      return;
    }

    if (key === "%") {
      try {
        const evalResult = evaluate(expression);
        const percentResult = (evalResult / 100).toString();
        setResult(percentResult);
        historyMutation.mutate({
          expression: expression + "%",
          result: percentResult,
          category: "Calculator"
        });
        setExpression(percentResult);
        setHasCalculated(true);
      } catch {
        setResult("Error");
      }
      return;
    }

    if (key === "00") {
      if (!expression) return;
      const newExpr = expression + "00";
      setExpression(newExpr);
      liveEvaluate(newExpr);
      return;
    }

    if (key === "\u00B1") {
      if (expression) {
        if (expression.startsWith("-")) {
          const next = expression.slice(1);
          setExpression(next);
          liveEvaluate(next);
        } else {
          const next = "-" + expression;
          setExpression(next);
          liveEvaluate(next);
        }
      }
      return;
    }

    const operators = ["+", "-", "*", "/"];
    if (hasCalculated && !operators.includes(key)) {
      setExpression(key);
      setResult("0");
      setHasCalculated(false);
      liveEvaluate(key);
      return;
    }

    setHasCalculated(false);
    const newExpr = expression + key;
    setExpression(newExpr);
    liveEvaluate(newExpr);
  }, [expression, historyMutation, hasCalculated, liveEvaluate]);

  const buttons = [
    { label: "AC", value: "AC", variant: "function" },
    { label: "%", value: "%", variant: "function" },
    { label: "C", value: "C", variant: "function" },
    { label: "\u00F7", value: "/", variant: "operator" },
    { label: "7", value: "7", variant: "number" },
    { label: "8", value: "8", variant: "number" },
    { label: "9", value: "9", variant: "number" },
    { label: "\u00D7", value: "*", variant: "operator" },
    { label: "4", value: "4", variant: "number" },
    { label: "5", value: "5", variant: "number" },
    { label: "6", value: "6", variant: "number" },
    { label: "\u2212", value: "-", variant: "operator" },
    { label: "1", value: "1", variant: "number" },
    { label: "2", value: "2", variant: "number" },
    { label: "3", value: "3", variant: "number" },
    { label: "+", value: "+", variant: "operator" },
    { label: "\u00B1", value: "\u00B1", variant: "function" },
    { label: "0", value: "0", variant: "number" },
    { label: ".", value: ".", variant: "number" },
    { label: "00", value: "00", variant: "number" },
  ];

  const getButtonClass = (variant: string) => {
    switch (variant) {
      case "function": 
        return "bg-[#f0f3f8] dark:bg-slate-700 text-red-500 dark:text-red-400 font-bold";
      case "paren":
        return "bg-[#f0f3f8] dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium";
      case "operator": 
        return "bg-[#f0f3f8] dark:bg-slate-700 text-orange-500 dark:text-orange-400 font-bold";
      case "delete":
        return "bg-[#f0f3f8] dark:bg-slate-700 text-slate-400 dark:text-slate-400";
      default: 
        return "bg-[#f0f3f8] dark:bg-slate-700 text-slate-800 dark:text-white font-semibold";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f7fb] dark:bg-background overflow-y-auto">
      <div className="px-4 pt-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 300+ specialist tools..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-card border border-transparent dark:border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm shadow-sm"
            data-testid="input-search-tools"
          />
        </div>

        <Link href="/categories">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-card rounded-2xl px-4 py-3.5 flex items-center justify-between cursor-pointer shadow-sm"
            data-testid="card-all-categories"
          >
            <div className="flex items-center gap-3">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-3 h-3 rounded-sm bg-blue-500" />
                <div className="w-3 h-3 rounded-sm bg-blue-500" />
                <div className="w-3 h-3 rounded-sm bg-blue-500" />
                <div className="w-3 h-3 rounded-sm bg-blue-500" />
              </div>
              <span className="text-base font-bold text-foreground">All Categories</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </Link>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
          {categories.map((cat) => (
            <Link key={cat.title} href={cat.href}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-card rounded-2xl whitespace-nowrap cursor-pointer shadow-sm"
                data-testid={`quick-cat-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`w-7 h-7 rounded-lg ${cat.color} flex items-center justify-center`}>
                  <cat.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground">{cat.title}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 py-3 flex flex-col min-h-0">
        <div className="bg-white dark:bg-card rounded-3xl p-4 flex-1 flex flex-col shadow-sm">
          <div className="text-right pr-2 mb-3 min-h-[70px] flex flex-col justify-end">
            <p className="text-muted-foreground text-sm h-5 overflow-x-auto scrollbar-hide whitespace-nowrap font-mono">
              {expression ? formatExpression(expression) : " "}
            </p>
            <p className={`mt-1 overflow-x-auto scrollbar-hide whitespace-nowrap tracking-tight transition-all text-3xl font-black ${
              hasCalculated 
                ? "text-slate-900 dark:text-white" 
                : "text-slate-800 dark:text-slate-200"
            }`} data-testid="display-result">
              {formatDisplay(result)}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2.5 flex-1">
            {buttons.map((btn, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.92 }}
                onClick={() => handlePress(btn.value)}
                data-testid={`button-calc-${btn.value}`}
                className={`rounded-2xl text-xl flex items-center justify-center transition-all min-h-[52px] ${getButtonClass(btn.variant)}`}
              >
                <span>{btn.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
