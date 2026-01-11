import { useState, useRef, useEffect } from "react";
import { evaluate } from "mathjs";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, FlaskConical, Percent, History, Delete, Divide, X, Minus, Plus, Equal, Pi, SquareRoot, Parentheses } from "lucide-react";
import { useAddToHistory } from "@/hooks/use-history";

type TabType = "Basic" | "Scientific" | "Percentage";

export default function CalculatorTools() {
  const [activeTab, setActiveTab] = useState<TabType>("Basic");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const historyMutation = useAddToHistory();
  const displayRef = useRef<HTMLDivElement>(null);

  const tabs: { id: TabType; label: string; icon: typeof Calculator }[] = [
    { id: "Basic", label: "Basic", icon: Calculator },
    { id: "Scientific", label: "Scientific", icon: FlaskConical },
    { id: "Percentage", label: "Percentage", icon: Percent },
  ];

  useEffect(() => {
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

    if (key === "CE") {
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
        let expr = expression;
        expr = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/π/g, "pi").replace(/√/g, "sqrt");
        const evalResult = evaluate(expr).toString();
        setResult(evalResult);
        setHistory((prev) => [...prev.slice(-9), { expr: expression, result: evalResult }]);
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
      if (!expression || expression === "0") {
        return;
      }
      try {
        let expr = expression.replace(/×/g, "*").replace(/÷/g, "/");
        const evalResult = (evaluate(expr) / 100).toString();
        setResult(evalResult);
        setExpression(evalResult);
      } catch {
        setResult("Error");
      }
      return;
    }

    if (key === "±") {
      if (expression.startsWith("-")) {
        setExpression(expression.slice(1));
      } else if (expression) {
        setExpression("-" + expression);
      }
      return;
    }

    setExpression((prev) => prev + key);
  };

  const basicButtons = [
    { label: "C", value: "C", className: "bg-slate-700" },
    { label: <Delete className="w-5 h-5" />, value: "backspace", className: "bg-slate-700" },
    { label: "%", value: "%", className: "bg-slate-700" },
    { label: <Divide className="w-5 h-5" />, value: "÷", className: "bg-amber-600" },
    { label: "7", value: "7", className: "bg-slate-600" },
    { label: "8", value: "8", className: "bg-slate-600" },
    { label: "9", value: "9", className: "bg-slate-600" },
    { label: <X className="w-5 h-5" />, value: "×", className: "bg-amber-600" },
    { label: "4", value: "4", className: "bg-slate-600" },
    { label: "5", value: "5", className: "bg-slate-600" },
    { label: "6", value: "6", className: "bg-slate-600" },
    { label: <Minus className="w-5 h-5" />, value: "-", className: "bg-amber-600" },
    { label: "1", value: "1", className: "bg-slate-600" },
    { label: "2", value: "2", className: "bg-slate-600" },
    { label: "3", value: "3", className: "bg-slate-600" },
    { label: <Plus className="w-5 h-5" />, value: "+", className: "bg-amber-600" },
    { label: "±", value: "±", className: "bg-slate-600" },
    { label: "0", value: "0", className: "bg-slate-600" },
    { label: ".", value: ".", className: "bg-slate-600" },
    { label: <Equal className="w-5 h-5" />, value: "=", className: "bg-emerald-500" },
  ];

  const scientificButtons = [
    { label: "sin", value: "sin(", className: "bg-slate-700 text-sm" },
    { label: "cos", value: "cos(", className: "bg-slate-700 text-sm" },
    { label: "tan", value: "tan(", className: "bg-slate-700 text-sm" },
    { label: "log", value: "log10(", className: "bg-slate-700 text-sm" },
    { label: "ln", value: "log(", className: "bg-slate-700 text-sm" },
    { label: "(", value: "(", className: "bg-slate-700" },
    { label: ")", value: ")", className: "bg-slate-700" },
    { label: "^", value: "^", className: "bg-slate-700" },
    { label: <Pi className="w-4 h-4" />, value: "π", className: "bg-slate-700" },
    { label: "√", value: "√(", className: "bg-slate-700" },
    ...basicButtons,
  ];

  const percentageButtons = basicButtons;

  const getButtons = () => {
    switch (activeTab) {
      case "Scientific":
        return scientificButtons;
      case "Percentage":
        return percentageButtons;
      default:
        return basicButtons;
    }
  };

  const gridCols = activeTab === "Scientific" ? "grid-cols-5" : "grid-cols-4";

  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-hidden">
      {/* Header with Tabs */}
      <div className="px-4 py-3 border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-testid={`tab-${tab.id.toLowerCase()}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
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
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-lg transition-all ${showHistory ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-800"}`}
            data-testid="button-toggle-history"
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-900/50 border-b border-slate-800/50 overflow-hidden"
          >
            <div className="p-4 max-h-40 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-slate-500 text-sm text-center">No history yet</p>
              ) : (
                <div className="space-y-2">
                  {history.slice().reverse().map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setExpression(item.result);
                        setResult(item.result);
                      }}
                      className="flex justify-between text-sm bg-slate-800/50 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-700/50"
                    >
                      <span className="text-slate-400 truncate">{item.expr}</span>
                      <span className="text-white font-mono">{item.result}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Display */}
      <div ref={displayRef} className="flex-1 flex flex-col justify-end px-6 py-4 min-h-[120px]">
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
        <div className={`grid ${gridCols} gap-2 max-w-md mx-auto`}>
          {getButtons().map((btn, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePress(btn.value)}
              data-testid={`button-calc-${btn.value}`}
              className={`${btn.className} h-14 rounded-xl text-lg font-semibold text-white flex items-center justify-center transition-all hover:brightness-110 active:brightness-90 shadow-lg shadow-black/20`}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
