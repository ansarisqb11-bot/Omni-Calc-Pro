import { useState } from "react";
import { create, all } from "mathjs";
import { CalculatorButton } from "@/components/CalculatorButton";
import { useAddHistory } from "@/hooks/use-history";
import { motion } from "framer-motion";

const math = create(all);

export default function CoreCalculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const addHistory = useAddHistory();

  const handlePress = (val: string) => {
    if (display === "0" && !"+-*/%".includes(val)) {
      setDisplay(val);
    } else {
      setDisplay(prev => prev + val);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
  };

  const handleCalculate = () => {
    try {
      const result = math.evaluate(display).toString();
      addHistory.mutate({
        expression: display,
        result: result,
        category: "Core"
      });
      setEquation(display + " =");
      setDisplay(result);
    } catch (error) {
      setDisplay("Error");
    }
  };

  const buttons = [
    { label: "C", action: handleClear, variant: "secondary" as const },
    { label: "(", action: () => handlePress("("), variant: "secondary" as const },
    { label: ")", action: () => handlePress(")"), variant: "secondary" as const },
    { label: "÷", action: () => handlePress("/"), variant: "accent" as const },
    { label: "7", action: () => handlePress("7") },
    { label: "8", action: () => handlePress("8") },
    { label: "9", action: () => handlePress("9") },
    { label: "×", action: () => handlePress("*"), variant: "accent" as const },
    { label: "4", action: () => handlePress("4") },
    { label: "5", action: () => handlePress("5") },
    { label: "6", action: () => handlePress("6") },
    { label: "-", action: () => handlePress("-"), variant: "accent" as const },
    { label: "1", action: () => handlePress("1") },
    { label: "2", action: () => handlePress("2") },
    { label: "3", action: () => handlePress("3") },
    { label: "+", action: () => handlePress("+"), variant: "accent" as const },
    { label: "0", action: () => handlePress("0"), className: "col-span-2" },
    { label: ".", action: () => handlePress(".") },
    { label: "=", action: handleCalculate, variant: "primary" as const },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl p-6 shadow-xl border border-border/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <div className="w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
        </div>
        
        <div className="h-32 flex flex-col items-end justify-end mb-6 font-mono">
          <div className="text-muted-foreground text-lg mb-2">{equation}</div>
          <div className="text-5xl font-bold text-foreground tracking-tight break-all text-right">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, i) => (
            <CalculatorButton
              key={i}
              onClick={btn.action}
              variant={btn.variant}
              className={btn.className}
            >
              {btn.label}
            </CalculatorButton>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {["sin", "cos", "tan", "log", "sqrt", "pi", "^", "!"].map(op => (
          <CalculatorButton 
            key={op}
            onClick={() => handlePress(op === "pi" ? "pi" : op === "sqrt" ? "sqrt(" : op + "(")}
            variant="secondary"
            className="text-sm h-12"
          >
            {op}
          </CalculatorButton>
        ))}
      </div>
    </div>
  );
}
