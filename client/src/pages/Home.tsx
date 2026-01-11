import { useState } from "react";
import { Link } from "wouter";
import { evaluate } from "mathjs";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid3X3, Calculator, FlaskConical, Percent, ArrowRight, Delete, Divide, X, Minus, Plus, Equal } from "lucide-react";
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

  const basicButtons = [
    { label: "C", value: "C", className: "bg-slate-700 text-white" },
    { label: <Delete className="w-5 h-5" />, value: "backspace", className: "bg-slate-700 text-white" },
    { label: <Divide className="w-5 h-5" />, value: "/", className: "bg-slate-700 text-white" },
    { label: "7", value: "7", className: "bg-slate-600 text-white" },
    { label: "8", value: "8", className: "bg-slate-600 text-white" },
    { label: "9", value: "9", className: "bg-slate-600 text-white" },
    { label: <X className="w-5 h-5" />, value: "*", className: "bg-slate-700 text-white" },
    { label: "4", value: "4", className: "bg-slate-600 text-white" },
    { label: "5", value: "5", className: "bg-slate-600 text-white" },
    { label: "6", value: "6", className: "bg-slate-600 text-white" },
    { label: <Minus className="w-5 h-5" />, value: "-", className: "bg-slate-700 text-white" },
    { label: "1", value: "1", className: "bg-slate-600 text-white" },
    { label: "2", value: "2", className: "bg-slate-600 text-white" },
    { label: "3", value: "3", className: "bg-slate-600 text-white" },
    { label: <Plus className="w-5 h-5" />, value: "+", className: "bg-slate-700 text-white" },
    { label: "0", value: "0", className: "bg-slate-600 text-white col-span-1" },
    { label: ".", value: ".", className: "bg-slate-600 text-white" },
    { label: <Equal className="w-5 h-5" />, value: "=", className: "bg-emerald-500 text-white" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-hidden">
      {/* Search Bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 300+ tools..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            data-testid="input-search-tools"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`tab-${tab.id.toLowerCase()}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calculator Display */}
      <div className="flex-1 flex flex-col justify-end px-6 py-4 min-h-[120px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={expression + result}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-right"
          >
            {expression && (
              <div className="text-slate-500 text-lg mb-1 font-mono truncate">
                {expression}
              </div>
            )}
            <div className="text-white text-5xl md:text-6xl font-bold font-mono tracking-tight">
              {result}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Keypad */}
      <div className="bg-slate-900/50 rounded-t-3xl p-4 pb-6">
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {basicButtons.map((btn, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePress(btn.value)}
              data-testid={`button-calc-${btn.value}`}
              className={`${btn.className} h-16 rounded-2xl text-xl font-semibold flex items-center justify-center transition-all hover:brightness-110 active:brightness-90 shadow-lg shadow-black/20`}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* All Categories Button */}
      <Link href="/categories">
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="mx-4 mb-4 p-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-slate-700/80 transition-all group"
          data-testid="link-all-categories"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Grid3X3 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg">All Categories</h3>
            <p className="text-slate-400 text-sm">Browse 300+ tools</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </motion.div>
      </Link>
    </div>
  );
}
