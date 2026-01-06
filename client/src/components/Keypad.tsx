import clsx from "clsx";
import { Delete } from "lucide-react";

interface KeypadProps {
  onInput: (val: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onEvaluate: () => void;
  mode?: "basic" | "scientific" | "programmer";
}

export function Keypad({ onInput, onClear, onDelete, onEvaluate, mode = "basic" }: KeypadProps) {
  const basicKeys = [
    { label: "C", type: "accent", action: onClear },
    { label: "( )", value: "()" },
    { label: "%", value: "%" },
    { label: "÷", value: "/", type: "operator" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "×", value: "*", type: "operator" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "-", value: "-", type: "operator" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "+", value: "+", type: "operator" },
    { label: "0", value: "0", span: 2 },
    { label: ".", value: "." },
    { label: "=", type: "primary", action: onEvaluate },
  ];

  const scientificExtras = [
    { label: "sin", value: "sin(" },
    { label: "cos", value: "cos(" },
    { label: "tan", value: "tan(" },
    { label: "log", value: "log(" },
    { label: "ln", value: "log(" }, // mathjs log(x) is natural log by default or log(x, base)
    { label: "√", value: "sqrt(" },
    { label: "^", value: "^" },
    { label: "π", value: "pi" },
    { label: "e", value: "e" },
    { label: "!", value: "!" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 p-4 bg-card/50 backdrop-blur-sm rounded-3xl border border-white/5">
      {mode === "scientific" && (
        <div className="col-span-4 grid grid-cols-5 gap-2 mb-2 pb-4 border-b border-white/5">
          {scientificExtras.map((k) => (
            <button
              key={k.label}
              onClick={() => onInput(k.value)}
              className="h-10 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
            >
              {k.label}
            </button>
          ))}
        </div>
      )}

      {basicKeys.map((k, i) => (
        <button
          key={i}
          onClick={k.action || (() => onInput(k.value!))}
          className={clsx(
            "calculator-btn h-16 text-2xl active:scale-95",
            k.span && `col-span-${k.span}`,
            k.type === "primary" ? "calculator-btn-primary" :
            k.type === "accent" ? "calculator-btn-accent" :
            k.type === "operator" ? "bg-primary/10 text-primary hover:bg-primary/20" :
            "calculator-btn-secondary"
          )}
          style={{ gridColumn: k.span ? `span ${k.span} / span ${k.span}` : undefined }}
        >
          {k.label}
        </button>
      ))}
      <button 
        onClick={onDelete} 
        className="absolute top-4 right-4 text-muted-foreground hover:text-white p-2" 
        style={{ display: 'none' }} /* Handling Delete separately usually or integrating into grid */
      />
    </div>
  );
}
