import { clsx } from "clsx";
import { motion } from "framer-motion";

interface KeypadProps {
  onPress: (key: string) => void;
}

export function CalculatorKeypad({ onPress }: KeypadProps) {
  const keys = [
    { label: "C", type: "action" },
    { label: "(", type: "operator" },
    { label: ")", type: "operator" },
    { label: "÷", value: "/", type: "operator" },
    { label: "7", type: "number" },
    { label: "8", type: "number" },
    { label: "9", type: "number" },
    { label: "×", value: "*", type: "operator" },
    { label: "4", type: "number" },
    { label: "5", type: "number" },
    { label: "6", type: "number" },
    { label: "-", type: "operator" },
    { label: "1", type: "number" },
    { label: "2", type: "number" },
    { label: "3", type: "number" },
    { label: "+", type: "operator" },
    { label: "0", type: "number", width: "col-span-1" },
    { label: ".", type: "number" },
    { label: "⌫", value: "backspace", type: "action" },
    { label: "=", type: "submit" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 md:gap-4 p-4 md:p-0">
      {keys.map((key) => (
        <motion.button
          key={key.label}
          whileTap={{ scale: 0.9 }}
          onClick={() => onPress(key.value || key.label)}
          className={clsx(
            "h-16 md:h-20 rounded-2xl text-2xl font-medium transition-colors shadow-sm",
            key.width || "col-span-1",
            key.type === "number" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            key.type === "operator" && "bg-card text-primary hover:bg-card/80 font-bold",
            key.type === "action" && "bg-card text-destructive hover:bg-destructive/10",
            key.type === "submit" && "bg-green-500 text-white hover:bg-green-600 shadow-green-500/20 shadow-lg"
          )}
        >
          {key.label}
        </motion.button>
      ))}
    </div>
  );
}
