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
  TrendingUp
} from "lucide-react";
import { ToolCard, InputField, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type Mode = "price-qty" | "price-weight" | "time-work" | "speed-dist" | "dist-time" | "rate-qty";

const UNITS = {
  qty: ["piece", "dozen", "box"],
  weight: ["mg", "g", "kg", "oz", "lb"],
  distance: ["cm", "m", "km", "inch", "feet", "mile"],
  time: ["second", "minute", "hour", "day"],
  speed: ["km/h", "mph"],
  currency: ["INR (₹)", "USD ($)", "EUR (€)", "AED", "GBP (£)"]
};

const CONVERSIONS: Record<string, number> = {
  // Weight to g
  mg: 0.001, g: 1, kg: 1000, oz: 28.3495, lb: 453.592,
  // Distance to m
  cm: 0.01, m: 1, km: 1000, inch: 0.0254, feet: 0.3048, mile: 1609.34,
  // Time to minutes
  second: 1/60, minute: 1, hour: 60, day: 1440,
  // Speed to km/h
  "km/h": 1, mph: 1.60934,
  // Qty to piece
  piece: 1, dozen: 12, box: 24
};

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
      title="Smart Word Problem Solvers"
      subtitle="Universal math logic for daily problems (India, USA & Global)"
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
  
  const [qtyUnit, setQtyUnit] = useState(() => {
    if (mode === "price-weight") return "kg";
    if (mode === "speed-dist" || mode === "dist-time") return "km";
    if (mode === "time-work") return "hour";
    return "piece";
  });
  
  const [valUnit, setValUnit] = useState(() => {
    if (mode.includes("price")) return "INR (₹)";
    if (mode === "time-work") return "units";
    if (mode === "speed-dist") return "km/h";
    if (mode === "dist-time") return "minute";
    return "units";
  });

  const config = useMemo(() => {
    const map = {
      "price-qty": { kq: "Known Qty", kv: "Price", tq: "Required Qty", res: "Final Price", units: UNITS.qty, valUnits: UNITS.currency },
      "price-weight": { kq: "Known Weight", kv: "Price", tq: "Required Weight", res: "Final Price", units: UNITS.weight, valUnits: UNITS.currency },
      "time-work": { kq: "Known Time", kv: "Work Done", tq: "Required Time", res: "Work Expected", units: UNITS.time, valUnits: ["units"] },
      "speed-dist": { kq: "Known Speed", kv: "Distance", tq: "Required Speed", res: "Distance Covered", units: UNITS.speed, valUnits: UNITS.distance },
      "dist-time": { kq: "Known Distance", kv: "Time Taken", tq: "Required Distance", res: "Time Required", units: UNITS.distance, valUnits: UNITS.time },
      "rate-qty": { kq: "Known Rate", kv: "Total", tq: "Required Qty", res: "Final Total", units: ["rate"], valUnits: ["total"] },
    };
    return map[mode];
  }, [mode]);

  const calculate = () => {
    const kq = parseFloat(knownQty) || 1;
    const kv = parseFloat(knownVal) || 0;
    const tq = parseFloat(targetQty) || 0;

    // Convert to base units for calculation if supported
    const kqBase = (CONVERSIONS[qtyUnit] || 1) * kq;
    const tqBase = (CONVERSIONS[qtyUnit] || 1) * tq;

    // Core Logic: (Value / Qty) * TargetQty
    // Note: We use base units to handle cross-unit math correctly if needed, 
    // but the ratio stays same if units are identical.
    const unitVal = kv / kq; 
    const result = unitVal * tq;

    return { unitVal, result };
  };

  const { unitVal, result } = calculate();

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title={config.res} icon={Calculator} iconColor="bg-orange-500">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">{config.kq}</label>
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
                  {config.units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">{config.kv}</label>
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
                  {config.valUnits.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">{config.tq}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={targetQty}
                  onChange={(e) => setTargetQty(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <div className="flex items-center px-3 bg-muted rounded-xl text-xs text-muted-foreground">
                  {qtyUnit}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-xl space-y-3 border border-border/50">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Unit Rate:</span>
              <span className="font-mono bg-background px-2 py-0.5 rounded border border-border">
                1 {qtyUnit} = {unitVal.toFixed(4)} {valUnit}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Final Result:</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-orange-500" data-testid="text-result">
                  {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </span>
                <span className="ml-1 text-xs font-medium text-muted-foreground">{valUnit}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-orange-500/5 p-3 rounded-lg border border-orange-500/10">
            <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
            <span className="italic uppercase tracking-wider font-semibold">Formula: (Known Value ÷ Known Qty) × Required Qty</span>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}
