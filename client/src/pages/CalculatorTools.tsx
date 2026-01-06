import { useState } from "react";
import { Keypad } from "@/components/Keypad";
import { useCalculator } from "@/hooks/use-calculator";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { History } from "lucide-react";
import { useHistory } from "@/hooks/use-history";

const TABS = [
  { id: "basic", label: "Basic" },
  { id: "scientific", label: "Scientific" },
  { id: "programmer", label: "Programmer" },
];

export default function CalculatorTools() {
  const [activeTab, setActiveTab] = useState<"basic" | "scientific" | "programmer">("basic");
  const { expression, result, handleInput, clear, backspace, evaluate } = useCalculator(activeTab);
  const { history } = useHistory();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Calculator Main */}
      <div className="flex-1 flex flex-col bg-card rounded-3xl border border-border shadow-2xl overflow-hidden relative">
        {/* Tabs */}
        <div className="flex items-center p-2 gap-2 bg-muted/30 m-4 rounded-xl border border-white/5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Display */}
        <div className="flex-1 p-8 flex flex-col items-end justify-end gap-2 bg-gradient-to-b from-transparent to-black/20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground text-xl md:text-2xl font-mono tracking-wider"
          >
            {expression || "0"}
          </motion.div>
          <motion.div 
            key={result}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl md:text-6xl font-bold font-mono text-foreground tracking-tight break-all text-right"
          >
            {result || (expression ? "" : "0")}
          </motion.div>
        </div>

        {/* History Toggle for Mobile */}
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="md:hidden absolute top-20 right-4 p-2 text-muted-foreground hover:text-white"
        >
          <History className="w-6 h-6" />
        </button>

        {/* Keypad */}
        <Keypad 
          onInput={handleInput} 
          onClear={clear} 
          onDelete={backspace} 
          onEvaluate={evaluate} 
          mode={activeTab} 
        />
      </div>

      {/* History Sidebar */}
      <AnimatePresence>
        {(showHistory || window.innerWidth >= 768) && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden md:flex flex-col bg-card/50 backdrop-blur-md rounded-3xl border border-border overflow-hidden"
          >
            <div className="p-4 border-b border-border bg-muted/20">
              <h3 className="font-semibold font-display flex items-center gap-2">
                <History className="w-4 h-4 text-primary" /> History
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {history?.map((item, idx) => (
                <div key={item.id} className="p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors border border-transparent hover:border-primary/20 cursor-pointer group">
                  <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-mono">{item.expression}</div>
                  <div className="text-xl font-bold text-primary font-mono">= {item.result}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{item.category}</div>
                </div>
              ))}
              {history?.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No calculations yet.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
