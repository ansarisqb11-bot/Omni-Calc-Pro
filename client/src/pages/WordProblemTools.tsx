import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calculator, 
  ShoppingBag, 
  Weight, 
  Clock, 
  Zap, 
  MoveRight,
  TrendingUp,
  Package,
  HelpCircle
} from "lucide-react";
import { ToolCard, InputField, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type Mode = "price-qty" | "price-weight" | "time-work" | "speed-dist" | "dist-time" | "rate-qty";

export default function WordProblemTools() {
  const [activeMode, setActiveMode] = useState<Mode>("price-qty");

  const modes = [
    { id: "price-qty", label: "Quantity ↔ Price", icon: ShoppingBag },
    { id: "price-weight", label: "Weight ↔ Price", icon: Weight },
    { id: "time-work", label: "Time ↔ Work", icon: Clock },
    { id: "speed-dist", label: "Speed ↔ Distance", icon: Zap },
    { id: "dist-time", label: "Distance ↔ Time", icon: MoveRight },
    { id: "rate-qty", label: "Rate ↔ Quantity", icon: Package },
  ];

  return (
    <PageWrapper
      title="Word Problem Solvers"
      subtitle="Easy math solutions for daily life problems"
      accentColor="bg-orange-500"
      tools={modes}
      activeTool={activeMode}
      onToolChange={(id) => setActiveMode(id as Mode)}
    >
      <WordProblemCalculator mode={activeMode} />
    </PageWrapper>
  );
}

function WordProblemCalculator({ mode }: { mode: Mode }) {
  const [knownQty, setKnownQty] = useState("5");
  const [knownVal, setKnownVal] = useState("40");
  const [targetQty, setTargetQty] = useState("3");
  const [unit, setUnit] = useState(mode === "price-weight" ? "g" : "items");
  const [valUnit, setValUnit] = useState(mode.includes("price") ? "₹" : "units");

  const calculate = () => {
    const kq = parseFloat(knownQty) || 1;
    const kv = parseFloat(knownVal) || 0;
    const tq = parseFloat(targetQty) || 0;

    const unitVal = kv / kq;
    const result = unitVal * tq;

    return { unitVal, result };
  };

  const { unitVal, result } = calculate();

  const labels = {
    "price-qty": { kq: "Known Quantity", kv: "Total Price", tq: "Target Quantity", res: "Final Price" },
    "price-weight": { kq: "Known Weight", kv: "Total Price", tq: "Target Weight", res: "Final Price" },
    "time-work": { kq: "Known Time", kv: "Work Done", tq: "Target Time", res: "Work Expected" },
    "speed-dist": { kq: "Known Speed", kv: "Distance", tq: "Target Speed", res: "Distance Covered" },
    "dist-time": { kq: "Known Distance", kv: "Time Taken", tq: "Target Distance", res: "Time Required" },
    "rate-qty": { kq: "Known Rate", kv: "Total Result", tq: "Target Quantity", res: "Final Result" },
  }[mode];

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title={labels.res} icon={Calculator} iconColor="bg-orange-500">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label={labels.kq} value={knownQty} onChange={setKnownQty} type="number" suffix={unit} />
            <InputField label={labels.kv} value={knownVal} onChange={setKnownVal} type="number" suffix={valUnit} />
          </div>
          
          <div className="pt-2 border-t border-border">
            <InputField label={labels.tq} value={targetQty} onChange={setTargetQty} type="number" suffix={unit} />
          </div>

          <div className="bg-muted/30 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Logic (Step 1):</span>
              <span className="font-mono">1 {unit} = {unitVal.toFixed(4)} {valUnit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Final Result:</span>
              <span className="text-2xl font-bold text-orange-500" data-testid="text-result">
                {valUnit} {result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <HelpCircle className="w-4 h-4" />
            <span>Formula: ({labels.kv} ÷ {labels.kq}) × {labels.tq}</span>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}
