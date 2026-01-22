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

type Mode = "quantity-to-price" | "price-to-quantity";
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
  const [mode, setMode] = useState<Mode>("quantity-to-price");
  const [knownQty, setKnownQty] = useState("1");
  const [knownVal, setKnownVal] = useState("150");
  const [requiredInput, setRequiredInput] = useState("3");
  
  const currentUnits = UNITS[type];
  const [qtyUnit, setQtyUnit] = useState(currentUnits[2] || currentUnits[0]);
  const [valUnit, setValUnit] = useState(UNITS.currency[0]);
  const [targetUnit, setTargetUnit] = useState(currentUnits[1] || currentUnits[0]);

  const calculation = useMemo(() => {
    const kq = parseFloat(knownQty) || 1;
    const kv = parseFloat(knownVal) || 0;
    const ri = parseFloat(requiredInput) || 0;

    // Unit price based on known values
    const unitPricePerBase = kv / (kq * (CONVERSIONS[qtyUnit] || 1));

    if (mode === "quantity-to-price") {
      // Find Price: (Known Value / Known Qty) * Required Qty
      const targetBase = ri * (CONVERSIONS[targetUnit] || 1);
      const result = unitPricePerBase * targetBase;
      return { result, label: "Final Price", unit: valUnit };
    } else {
      // Find Quantity: Given Money / (Known Value / Known Qty)
      const resultBase = ri / unitPricePerBase;
      const result = resultBase / (CONVERSIONS[targetUnit] || 1);
      return { result, label: "Total Quantity", unit: targetUnit };
    }
  }, [mode, knownQty, knownVal, requiredInput, qtyUnit, valUnit, targetUnit]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Problem Solver" icon={Calculator} iconColor="bg-orange-500">
        <div className="space-y-4">
          {/* Mode Selector */}
          <div className="flex gap-2 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setMode("quantity-to-price")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "quantity-to-price" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Find Price
            </button>
            <button
              onClick={() => setMode("price-to-quantity")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "price-to-quantity" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Find Quantity
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Known Quantity</label>
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
              <label className="text-sm font-medium text-muted-foreground">Known Price</label>
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
                  {UNITS.currency.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                {mode === "quantity-to-price" ? "Required Quantity" : "Given Money"}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={requiredInput}
                  onChange={(e) => setRequiredInput(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select 
                  value={mode === "quantity-to-price" ? targetUnit : valUnit} 
                  onChange={(e) => mode === "quantity-to-price" ? setTargetUnit(e.target.value) : setValUnit(e.target.value)}
                  className="bg-muted border border-border rounded-xl px-2 text-xs focus:outline-none"
                  disabled={mode === "price-to-quantity"}
                >
                  {mode === "quantity-to-price" ? (
                    currentUnits.map(u => <option key={u} value={u}>{u}</option>)
                  ) : (
                    UNITS.currency.map(u => <option key={u} value={u}>{u}</option>)
                  )}
                </select>
              </div>
            </div>
            {mode === "price-to-quantity" && (
              <div className="mt-2 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Output Unit</label>
                <select 
                  value={targetUnit} 
                  onChange={(e) => setTargetUnit(e.target.value)}
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  {currentUnits.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="bg-muted/30 p-4 rounded-xl space-y-3 border border-border/50">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Logic (Unit Price):</span>
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
              {mode === "quantity-to-price" 
                ? "Formula: (Price ÷ Qty) × Required Qty" 
                : "Formula: Given Money ÷ (Price ÷ Qty)"}
            </span>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}
