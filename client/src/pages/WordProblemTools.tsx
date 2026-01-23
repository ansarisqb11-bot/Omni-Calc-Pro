import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Calculator, 
  ShoppingBag, 
  Weight, 
  Clock, 
  Zap, 
  MoveRight,
  Package,
  HelpCircle,
  TrendingUp,
  ArrowRightLeft
} from "lucide-react";
import { ToolCard, InputField, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type Mode = "to-value" | "to-quantity";
type MeasurementType = "weight" | "volume" | "length" | "piece" | "time" | "speed";

const UNITS: Record<string, string[]> = {
  weight: ["mg", "g", "kg", "oz", "lb"],
  volume: ["ml", "liter", "gallon"],
  length: ["cm", "m", "km", "inch", "feet", "mile"],
  piece: ["piece", "dozen", "pack"],
  time: ["second", "minute", "hour", "day"],
  speed: ["km/h", "mph"],
  currency: ["INR (₹)", "USD ($)", "EUR (€)", "AED", "GBP (£)"]
};

const CONVERSIONS: Record<string, number> = {
  mg: 0.001, g: 1, kg: 1000, oz: 28.3495, lb: 453.592,
  cm: 0.01, m: 1, km: 1000, inch: 0.0254, feet: 0.3048, mile: 1609.34,
  ml: 1, liter: 1000, gallon: 3785.41,
  second: 1/60, minute: 1, hour: 60, day: 1440,
  "km/h": 1, mph: 1.60934,
  piece: 1, dozen: 12, pack: 24
};

export default function WordProblemTools() {
  const [activeType, setActiveType] = useState<MeasurementType>("weight");

  const types = [
    { id: "weight", label: "Weight", icon: Weight },
    { id: "volume", label: "Volume", icon: Package },
    { id: "length", label: "Length", icon: MoveRight },
    { id: "piece", label: "Quantity", icon: ShoppingBag },
    { id: "time", label: "Time", icon: Clock },
    { id: "speed", label: "Speed", icon: Zap },
  ];

  return (
    <PageWrapper
      title="Smart Word Problem Solvers"
      subtitle="Universal math logic for daily problems (India, USA & Global)"
      accentColor="bg-orange-500"
      tools={types}
      activeTool={activeType}
      onToolChange={(id) => setActiveType(id as MeasurementType)}
    >
      <UniversalWordProblemCalculator type={activeType} />
    </PageWrapper>
  );
}

function UniversalWordProblemCalculator({ type }: { type: MeasurementType }) {
  const [mode, setMode] = useState<Mode>("to-value");
  const [knownQty, setKnownQty] = useState("1");
  const [knownVal, setKnownVal] = useState(type === "speed" ? "60" : type === "time" ? "10" : "150");
  const [requiredInput, setRequiredInput] = useState("3");
  
  const currentUnits = UNITS[type];
  const [qtyUnit, setQtyUnit] = useState(currentUnits[2] || currentUnits[0]);
  
  // Dynamic value unit based on type
  const [valUnit, setValUnit] = useState(() => {
    if (type === "speed") return "km";
    if (type === "time") return "tasks";
    if (type === "length") return "meters";
    if (type === "volume") return "liters";
    return UNITS.currency[0];
  });

  const [targetUnit, setTargetUnit] = useState(currentUnits[1] || currentUnits[0]);

  const config = useMemo(() => {
    const map: Record<MeasurementType, any> = {
      weight: { valLabel: "Price", resLabel: "Final Price", valUnits: UNITS.currency, secondary: "Price" },
      volume: { valLabel: "Total Val", resLabel: "Final Value", valUnits: ["liters", "ml", ...UNITS.currency], secondary: "Value" },
      length: { valLabel: "Total Dist", resLabel: "Final Distance", valUnits: UNITS.length, secondary: "Distance" },
      piece: { valLabel: "Price", resLabel: "Final Price", valUnits: UNITS.currency, secondary: "Price" },
      time: { valLabel: "Work/Dist", resLabel: "Final Result", valUnits: ["tasks", "items", "km", "miles"], secondary: "Result" },
      speed: { valLabel: "Distance", resLabel: "Distance Covered", valUnits: UNITS.length, secondary: "Distance" }
    };
    return map[type];
  }, [type]);

  const calculation = useMemo(() => {
    const kq = parseFloat(knownQty) || 1;
    const kv = parseFloat(knownVal) || 0;
    const ri = parseFloat(requiredInput) || 0;

    const unitValPerBase = kv / (kq * (CONVERSIONS[qtyUnit] || 1));

    if (mode === "to-value") {
      const targetBase = ri * (CONVERSIONS[targetUnit] || 1);
      const result = unitValPerBase * targetBase;
      return { result, label: config.resLabel, unit: valUnit };
    } else {
      const resultBase = ri / unitValPerBase;
      const result = resultBase / (CONVERSIONS[targetUnit] || 1);
      return { result, label: "Total Quantity", unit: targetUnit };
    }
  }, [mode, knownQty, knownVal, requiredInput, qtyUnit, valUnit, targetUnit, config]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title={`${type.charAt(0).toUpperCase() + type.slice(1)} Solver`} icon={Calculator} iconColor="bg-orange-500">
        <div className="space-y-4">
          <div className="flex gap-2 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setMode("to-value")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "to-value" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Find {config.secondary}
            </button>
            <button
              onClick={() => setMode("to-quantity")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "to-quantity" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Find Quantity
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Known {type === "speed" ? "Speed" : "Quantity"}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={knownQty}
                  onChange={(e) => setKnownQty(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select 
                  value={qtyUnit} 
                  onChange={(e) => setQtyUnit(e.target.value)}
                  className="bg-muted border border-border rounded-xl px-2 text-xs focus:outline-none"
                >
                  {currentUnits.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">{config.valLabel}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={knownVal}
                  onChange={(e) => setKnownVal(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select 
                  value={valUnit} 
                  onChange={(e) => setValUnit(e.target.value)}
                  className="bg-muted border border-border rounded-xl px-2 text-xs focus:outline-none"
                >
                  {config.valUnits.map((u: string) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                {mode === "to-value" ? `Required ${type === "speed" ? "Speed" : "Quantity"}` : `Given ${config.secondary}`}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={requiredInput}
                  onChange={(e) => setRequiredInput(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select 
                  value={mode === "to-value" ? targetUnit : valUnit} 
                  onChange={(e) => mode === "to-value" ? setTargetUnit(e.target.value) : setValUnit(e.target.value)}
                  className="bg-muted border border-border rounded-xl px-2 text-xs focus:outline-none"
                  disabled={mode === "to-quantity"}
                >
                  {mode === "to-value" ? (
                    currentUnits.map(u => <option key={u} value={u}>{u}</option>)
                  ) : (
                    config.valUnits.map((u: string) => <option key={u} value={u}>{u}</option>)
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-xl space-y-3 border border-border/50">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Unit Ratio:</span>
              <span className="font-mono bg-background px-2 py-0.5 rounded border border-border">
                1 {qtyUnit} = {(parseFloat(knownVal)/(parseFloat(knownQty)||1)).toFixed(2)} {valUnit}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">{calculation.label}:</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-orange-500" data-testid="text-result">
                  {calculation.result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </span>
                <span className="ml-1 text-xs font-medium text-muted-foreground">{calculation.unit}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-orange-500/5 p-3 rounded-lg border border-orange-500/10">
            <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
            <span className="italic uppercase tracking-wider font-semibold">
              {mode === "to-value" 
                ? `Formula: (${config.valLabel} ÷ Qty) × Required Qty` 
                : `Formula: Given ${config.secondary} ÷ (${config.valLabel} ÷ Qty)`}
            </span>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}
