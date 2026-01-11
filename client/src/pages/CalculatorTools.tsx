import { useState, useRef, useEffect } from "react";
import { evaluate } from "mathjs";
import { CalculatorKeypad } from "@/components/CalculatorKeypad";
import { useAddToHistory } from "@/hooks/use-history";
import { motion, AnimatePresence } from "framer-motion";
import { History, Share2, Maximize2 } from "lucide-react";

export default function CalculatorTools() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [activeTab, setActiveTab] = useState<"Basic" | "Scientific">("Basic");
  const historyMutation = useAddToHistory();
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll display to end
    if (displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [expression, result]);

  const handlePress = (key: string) => {
    if (key === "C") {
      setExpression("");
      setResult("0");
      return;
    }

    if (key === "backspace") {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }

    if (key === "=") {
      try {
        const evalResult = evaluate(expression).toString();
        setResult(evalResult);
        
        // Save to history
        historyMutation.mutate({
          expression,
          result: evalResult,
          category: activeTab
        });
        
        // Prepare for next calculation
        setExpression(evalResult);
      } catch (error) {
        setResult("Error");
      }
      return;
    }

    setExpression((prev) => prev + key);
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header/Tabs */}
      <div className="p-4 flex items-center justify-between border-b border-border/50">
        <div className="flex bg-secondary/50 p-1 rounded-xl">
          {["Basic", "Scientific"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
           <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full">
            <History className="w-5 h-5" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Display */}
      <div 
        ref={displayRef}
        className="flex-1 p-6 flex flex-col items-end justify-end space-y-2 overflow-y-auto min-h-[160px]"
      >
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground text-2xl font-light tracking-wider"
        >
          {expression || "0"}
        </motion.div>
        <motion.div 
          key={result}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-foreground text-6xl font-bold tracking-tight font-display break-all text-right"
        >
          {result}
        </motion.div>
      </div>

      {/* Keypad Area */}
      <div className="bg-card border-t border-border/50 rounded-t-3xl shadow-2xl p-4 md:p-6 pb-20 md:pb-6 z-10">
        <AnimatePresence mode="wait">
          {activeTab === "Basic" ? (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <CalculatorKeypad onPress={handlePress} />
            </motion.div>
          ) : (
             <motion.div
              key="scientific"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 text-center text-muted-foreground"
            >
              Scientific Mode Layout Placeholder
              {/* Add Scientific Keypad here if needed */}
              <div className="mt-4">
                 <CalculatorKeypad onPress={handlePress} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
