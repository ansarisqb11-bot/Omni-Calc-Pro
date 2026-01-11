import { useState, useRef, useEffect } from "react";
import { evaluate } from "mathjs";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, FlaskConical, Percent, History, Delete, Divide, X, Minus, Plus, Equal, Pi, Binary } from "lucide-react";
import { useAddToHistory } from "@/hooks/use-history";

type TabType = "Basic" | "Scientific" | "Percentage" | "Programmer";

export default function CalculatorTools() {
  const [activeTab, setActiveTab] = useState<TabType>("Basic");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [programmerBase, setProgrammerBase] = useState<"DEC" | "HEX" | "BIN" | "OCT">("DEC");
  const [programmerValue, setProgrammerValue] = useState(0);
  const historyMutation = useAddToHistory();
  const displayRef = useRef<HTMLDivElement>(null);
  
  const parseNumber = (str: string, base: "DEC" | "HEX" | "BIN" | "OCT") => {
    const radix = base === "DEC" ? 10 : base === "HEX" ? 16 : base === "BIN" ? 2 : 8;
    return parseInt(str.trim(), radix);
  };
  
  const formatInBaseHelper = (num: number, base: "DEC" | "HEX" | "BIN" | "OCT") => {
    if (isNaN(num)) return "0";
    switch (base) {
      case "HEX": return num.toString(16).toUpperCase();
      case "BIN": return num.toString(2);
      case "OCT": return num.toString(8);
      default: return num.toString(10);
    }
  };
  
  const handleBaseChange = (newBase: "DEC" | "HEX" | "BIN" | "OCT") => {
    if (expression) {
      const hadTrailingSpace = expression.endsWith(" ");
      const tokens = expression.split(/\s+/).filter(t => t.length > 0);
      const convertedTokens = tokens.map((token) => {
        if (["AND", "OR", "XOR", "NOT", "<<", ">>"].includes(token)) {
          return token;
        }
        const num = parseNumber(token, programmerBase);
        return isNaN(num) ? token : formatInBaseHelper(num, newBase);
      });
      let newExpr = convertedTokens.join(" ");
      if (hadTrailingSpace) {
        newExpr += " ";
      }
      setExpression(newExpr);
    }
    setProgrammerBase(newBase);
  };
  
  const isValidKeyForBase = (key: string, base: "DEC" | "HEX" | "BIN" | "OCT") => {
    if (["CLR", "backspace", "=", "AND", "OR", "XOR", "NOT", "<<", ">>"].includes(key)) return true;
    switch (base) {
      case "BIN": return ["0", "1"].includes(key);
      case "OCT": return ["0", "1", "2", "3", "4", "5", "6", "7"].includes(key);
      case "DEC": return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(key);
      case "HEX": return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"].includes(key);
      default: return true;
    }
  };

  const tabs: { id: TabType; label: string; icon: typeof Calculator }[] = [
    { id: "Basic", label: "Basic", icon: Calculator },
    { id: "Scientific", label: "Scientific", icon: FlaskConical },
    { id: "Percentage", label: "Percent", icon: Percent },
    { id: "Programmer", label: "Programmer", icon: Binary },
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

  const handleProgrammerPress = (key: string) => {
    if (!isValidKeyForBase(key, programmerBase) && !["CLR", "backspace", "=", "AND", "OR", "XOR", "NOT", "<<", ">>"].includes(key)) {
      return;
    }
    
    if (key === "CLR") {
      setExpression("");
      setResult("0");
      setProgrammerValue(0);
      return;
    }

    if (key === "backspace") {
      setExpression((prev) => prev.slice(0, -1));
      if (expression.length <= 1) {
        setResult("0");
        setProgrammerValue(0);
      }
      return;
    }

    if (key === "=") {
      try {
        const parts = expression.split(/\s+/).filter(p => p.length > 0);
        let computedValue = 0;
        
        if (parts.length === 1) {
          computedValue = parseNumber(parts[0], programmerBase);
        } else if (parts.length >= 3) {
          computedValue = parseNumber(parts[0], programmerBase);
          for (let i = 1; i < parts.length; i += 2) {
            const op = parts[i];
            const right = parseNumber(parts[i + 1] || "0", programmerBase);
            switch (op) {
              case "AND": computedValue = computedValue & right; break;
              case "OR": computedValue = computedValue | right; break;
              case "XOR": computedValue = computedValue ^ right; break;
              case "<<": computedValue = computedValue << right; break;
              case ">>": computedValue = computedValue >> right; break;
            }
          }
        } else if (parts.length === 2 && parts[0] === "NOT") {
          computedValue = ~parseNumber(parts[1], programmerBase) >>> 0;
        }
        
        if (isNaN(computedValue)) {
          setResult("Error");
          setProgrammerValue(0);
        } else {
          setResult(computedValue.toString());
          setProgrammerValue(computedValue);
          const formattedForBase = formatInBaseHelper(computedValue, programmerBase);
          setExpression(formattedForBase);
        }
      } catch {
        setResult("Error");
        setProgrammerValue(0);
      }
      return;
    }

    if (key === "NOT") {
      try {
        const num = parseNumber(expression || "0", programmerBase);
        const notResult = (~num >>> 0);
        setResult(notResult.toString());
        setProgrammerValue(notResult);
        setExpression(formatInBaseHelper(notResult, programmerBase));
      } catch {
        setResult("Error");
        setProgrammerValue(0);
      }
      return;
    }

    if (["AND", "OR", "XOR", "<<", ">>"].includes(key)) {
      const currentNum = parseNumber(expression || "0", programmerBase);
      if (!isNaN(currentNum)) {
        setProgrammerValue(currentNum);
        setResult(currentNum.toString());
      }
      setExpression((prev) => prev + " " + key + " ");
      return;
    }

    const newExpr = expression + key;
    setExpression(newExpr);
    const lastToken = newExpr.split(/\s+/).pop() || "0";
    const parsed = parseNumber(lastToken, programmerBase);
    if (!isNaN(parsed)) {
      setProgrammerValue(parsed);
      setResult(parsed.toString());
    }
  };

  const getConversions = () => {
    try {
      const numStr = result !== "0" && result !== "Error" ? result : "0";
      const num = parseInt(numStr, 10);
      
      if (isNaN(num)) {
        return { DEC: "0", HEX: "0", BIN: "0", OCT: "0" };
      }
      
      return {
        DEC: num.toString(10),
        HEX: num.toString(16).toUpperCase(),
        BIN: num.toString(2),
        OCT: num.toString(8),
      };
    } catch {
      return { DEC: "0", HEX: "0", BIN: "0", OCT: "0" };
    }
  };
  
  const formatResultForBase = (decimalValue: string, base: "DEC" | "HEX" | "BIN" | "OCT") => {
    const num = parseInt(decimalValue, 10);
    if (isNaN(num)) return "0";
    switch (base) {
      case "HEX": return num.toString(16).toUpperCase();
      case "BIN": return num.toString(2);
      case "OCT": return num.toString(8);
      default: return num.toString(10);
    }
  };

  const basicButtons = [
    { label: "C", value: "C", variant: "function" },
    { label: <Delete className="w-5 h-5" />, value: "backspace", variant: "function" },
    { label: "%", value: "%", variant: "function" },
    { label: <Divide className="w-5 h-5" />, value: "÷", variant: "operator" },
    { label: "7", value: "7", variant: "number" },
    { label: "8", value: "8", variant: "number" },
    { label: "9", value: "9", variant: "number" },
    { label: <X className="w-5 h-5" />, value: "×", variant: "operator" },
    { label: "4", value: "4", variant: "number" },
    { label: "5", value: "5", variant: "number" },
    { label: "6", value: "6", variant: "number" },
    { label: <Minus className="w-5 h-5" />, value: "-", variant: "operator" },
    { label: "1", value: "1", variant: "number" },
    { label: "2", value: "2", variant: "number" },
    { label: "3", value: "3", variant: "number" },
    { label: <Plus className="w-5 h-5" />, value: "+", variant: "operator" },
    { label: "±", value: "±", variant: "number" },
    { label: "0", value: "0", variant: "number" },
    { label: ".", value: ".", variant: "number" },
    { label: <Equal className="w-5 h-5" />, value: "=", variant: "equals" },
  ];

  const scientificButtons = [
    { label: "sin", value: "sin(", variant: "function" },
    { label: "cos", value: "cos(", variant: "function" },
    { label: "tan", value: "tan(", variant: "function" },
    { label: "log", value: "log10(", variant: "function" },
    { label: "ln", value: "log(", variant: "function" },
    { label: "(", value: "(", variant: "function" },
    { label: ")", value: ")", variant: "function" },
    { label: "^", value: "^", variant: "function" },
    { label: <Pi className="w-4 h-4" />, value: "π", variant: "function" },
    { label: "√", value: "√(", variant: "function" },
    ...basicButtons,
  ];

  const programmerButtons = [
    { label: "CLR", value: "CLR", variant: "function" },
    { label: <Delete className="w-5 h-5" />, value: "backspace", variant: "function" },
    { label: "A", value: "A", variant: "hex" },
    { label: "B", value: "B", variant: "hex" },
    { label: "C", value: "C", variant: "hex" },
    { label: "D", value: "D", variant: "hex" },
    { label: "E", value: "E", variant: "hex" },
    { label: "F", value: "F", variant: "hex" },
    { label: "7", value: "7", variant: "number" },
    { label: "8", value: "8", variant: "number" },
    { label: "9", value: "9", variant: "number" },
    { label: "AND", value: "AND", variant: "operator" },
    { label: "4", value: "4", variant: "number" },
    { label: "5", value: "5", variant: "number" },
    { label: "6", value: "6", variant: "number" },
    { label: "OR", value: "OR", variant: "operator" },
    { label: "1", value: "1", variant: "number" },
    { label: "2", value: "2", variant: "number" },
    { label: "3", value: "3", variant: "number" },
    { label: "XOR", value: "XOR", variant: "operator" },
    { label: "NOT", value: "NOT", variant: "function" },
    { label: "0", value: "0", variant: "number" },
    { label: "<<", value: "<<", variant: "operator" },
    { label: ">>", value: ">>", variant: "operator" },
    { label: <Equal className="w-5 h-5" />, value: "=", variant: "equals" },
  ];

  const getButtons = () => {
    switch (activeTab) {
      case "Scientific":
        return scientificButtons;
      case "Programmer":
        return programmerButtons;
      default:
        return basicButtons;
    }
  };

  const getVariantClass = (variant: string) => {
    switch (variant) {
      case "function": return "bg-muted text-foreground";
      case "operator": return "bg-primary/20 text-primary";
      case "equals": return "bg-primary text-primary-foreground";
      case "hex": return "bg-indigo-500/20 text-indigo-400";
      default: return "bg-card text-foreground";
    }
  };

  const gridCols = activeTab === "Scientific" ? "grid-cols-5" : "grid-cols-4";
  const conversions = getConversions();

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header with Tabs */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-testid={`tab-${tab.id.toLowerCase()}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
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
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-lg transition-all ${showHistory ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            data-testid="button-toggle-history"
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Programmer Base Selector */}
      {activeTab === "Programmer" && (
        <div className="px-4 py-2 border-b border-border/50">
          <div className="flex gap-2">
            {(["DEC", "HEX", "BIN", "OCT"] as const).map((base) => (
              <button
                key={base}
                onClick={() => handleBaseChange(base)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                  programmerBase === base
                    ? "bg-indigo-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
                data-testid={`button-base-${base.toLowerCase()}`}
              >
                {base}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-muted/50 border-b border-border/50 overflow-hidden"
          >
            <div className="p-4 max-h-40 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center">No history yet</p>
              ) : (
                <div className="space-y-2">
                  {history.slice().reverse().map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setExpression(item.result);
                        setResult(item.result);
                      }}
                      className="flex justify-between text-sm bg-card px-3 py-2 rounded-lg cursor-pointer hover:bg-muted"
                    >
                      <span className="text-muted-foreground truncate">{item.expr}</span>
                      <span className="text-foreground font-mono">{item.result}</span>
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
              <div className="text-muted-foreground text-lg mb-1 font-mono truncate">
                {expression}
              </div>
            )}
            <div className="text-foreground text-5xl md:text-6xl font-bold font-mono tracking-tight">
              {activeTab === "Programmer" ? conversions[programmerBase] : result}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Programmer Conversions */}
        {activeTab === "Programmer" && expression && (
          <div className="mt-4 space-y-1 text-sm">
            {(["DEC", "HEX", "BIN", "OCT"] as const).map((base) => (
              <div key={base} className="flex justify-between text-muted-foreground">
                <span>{base}</span>
                <span className={`font-mono ${programmerBase === base ? "text-primary" : "text-foreground"}`}>
                  {conversions[base]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Keypad */}
      <div className="bg-muted/30 rounded-t-3xl p-4 pb-6">
        <div className={`grid ${gridCols} gap-2 max-w-md mx-auto`}>
          {getButtons().map((btn, index) => {
            const isDisabled = activeTab === "Programmer" && !isValidKeyForBase(btn.value, programmerBase);
            return (
              <motion.button
                key={index}
                whileTap={isDisabled ? {} : { scale: 0.95 }}
                onClick={() => !isDisabled && (activeTab === "Programmer" ? handleProgrammerPress(btn.value) : handlePress(btn.value))}
                data-testid={`button-calc-${btn.value}`}
                disabled={isDisabled}
                className={`${getVariantClass(btn.variant)} h-14 rounded-xl text-lg font-semibold flex items-center justify-center transition-all ${isDisabled ? "opacity-30 cursor-not-allowed" : "hover:brightness-110 active:brightness-90"}`}
              >
                {btn.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
