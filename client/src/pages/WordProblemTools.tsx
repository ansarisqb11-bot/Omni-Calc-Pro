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
  Droplets,
  Ruler
} from "lucide-react";
import { ToolCard, InputField, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type Mode = "price-qty" | "price-weight" | "time-work" | "speed-dist" | "dist-time" | "rate-qty" | "money-to-qty" | "qty-to-money" | "unit-price";

const UNITS = {
  qty: ["piece", "dozen", "pack"],
  weight: ["mg", "g", "kg", "oz", "lb"],
  volume: ["ml", "liter", "gallon"],
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
  // Volume to ml
  ml: 1, liter: 1000, gallon: 3785.41,
  // Time to minutes
  second: 1/60, minute: 1, hour: 60, day: 1440,
  // Speed to km/h
  "km/h": 1, mph: 1.60934,
  // Qty to piece
  piece: 1, dozen: 12, pack: 24
};

export default function WordProblemTools() {
  const [activeMode, setActiveMode] = useState<Mode>("qty-to-money");

  const modes = [
    { id: "qty-to-money", label: "Quantity → Money", icon: ShoppingBag },
    { id: "money-to-qty", label: "Money → Quantity", icon: TrendingUp },
    { id: "unit-price", label: "Unit Price Finder", icon: Calculator },
    { id: "price-weight", label: "Weight ↔ Price", icon: Weight },
    { id: "speed-dist", label: "Speed ↔ Distance", icon: Zap },
    { id: "dist-time", label: "Distance ↔ Time", icon: MoveRight },
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
  const [val1, setVal1] = useState("1");
  const [val2, setVal2] = useState("100");
  const [val3, setVal3] = useState("0.75");
  
  const [measurementType, setMeasurementType] = useState<"weight" | "volume" | "length" | "piece">("weight");
  
  const currentUnits = useMemo(() => {
    if (measurementType === "weight") return UNITS.weight;
    if (measurementType === "volume") return UNITS.volume;
    if (measurementType === "length") return UNITS.distance;
    return UNITS.qty;
  }, [measurementType]);

  const [u1, setU1] = useState(currentUnits[2] || currentUnits[0]); // Default to kg/piece etc
  const [u2, setU2] = useState(UNITS.currency[0]);
  const [u3, setU3] = useState(currentUnits[1] || currentUnits[0]); // Default to g etc

  const calculate = () => {
    const v1 = parseFloat(val1) || 1;
    const v2 = parseFloat(val2) || 0;
    const v3 = parseFloat(val3) || 0;

    if (mode === "qty-to-money") {
      // Formula: Total Price = Quantity * Rate
      // Rate is v2 per v1 u1.
      const ratePerBase = v2 / (v1 * (CONVERSIONS[u1] || 1));
      const targetBase = v3 * (CONVERSIONS[u3] || 1);
      const result = targetBase * ratePerBase;
      return { result, label: "Total Price", unit: u2 };
    }
    
    if (mode === "money-to-qty") {
      // Formula: Quantity = Money / Rate
      // Rate is v2 per v1 u1
      const ratePerBase = v2 / (v1 * (CONVERSIONS[u1] || 1));
      const resultBase = v3 / ratePerBase;
      const result = resultBase / (CONVERSIONS[u3] || 1);
      return { result, label: "Quantity", unit: u3 };
    }

    if (mode === "unit-price") {
      // Formula: Unit Price = Price / Quantity
      // v2 price for v1 u1. Find price for 1 u3.
      const pricePerBase = v2 / (v1 * (CONVERSIONS[u1] || 1));
      const result = pricePerBase * (CONVERSIONS[u3] || 1);
      return { result, label: "Unit Price", unit: `${u2} per ${u3}` };
    }

    // Fallback for legacy modes
    const kq = parseFloat(val1) || 1;
    const kv = parseFloat(val2) || 0;
    const tq = parseFloat(val3) || 0;
    const result = (kv / kq) * tq;
    return { result, label: "Result", unit: "" };
  };

  const { result, label, unit } = calculate();

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title={label} icon={Calculator} iconColor="bg-orange-500">
        <div className="space-y-4">
          {/* Measurement Type Selector */}
          <div className="flex gap-2 p-1 bg-muted rounded-xl">
            {(["weight", "volume", "length", "piece"] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setMeasurementType(type);
                  const units = type === "weight" ? UNITS.weight : type === "volume" ? UNITS.volume : type === "length" ? UNITS.distance : UNITS.qty;
                  setU1(units[2] || units[0]);
                  setU3(units[1] || units[0]);
                }}
                className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${
                  measurementType === type ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Known Quantity</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={val1}
                  onChange={(e) => setVal1(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select 
                  value={u1} 
                  onChange={(e) => setU1(e.target.value)}
                  className="bg-muted border border-border rounded-xl px-2 text-xs focus:outline-none"
                >
                  {currentUnits.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Price/Rate</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={val2}
                  onChange={(e) => setVal2(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select 
                  value={u2} 
                  onChange={(e) => setU2(e.target.value)}
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
                {mode === "money-to-qty" ? "Available Money" : "Required Quantity"}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={val3}
                  onChange={(e) => setVal3(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select 
                  value={mode === "money-to-qty" ? u2 : u3} 
                  onChange={(e) => mode === "money-to-qty" ? setU2(e.target.value) : setU3(e.target.value)}
                  className="bg-muted border border-border rounded-xl px-2 text-xs focus:outline-none"
                  disabled={mode === "money-to-qty"}
                >
                  {mode === "money-to-qty" ? (
                    UNITS.currency.map(u => <option key={u} value={u}>{u}</option>)
                  ) : (
                    currentUnits.map(u => <option key={u} value={u}>{u}</option>)
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-xl space-y-3 border border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">{label}:</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-orange-500" data-testid="text-result">
                  {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </span>
                <span className="ml-1 text-xs font-medium text-muted-foreground">{unit}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-orange-500/5 p-3 rounded-lg border border-orange-500/10">
            <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
            <span className="italic uppercase tracking-wider font-semibold">
              {mode === "money-to-qty" ? "Formula: Quantity = Money ÷ Rate" : 
               mode === "qty-to-money" ? "Formula: Total Price = Quantity × Rate" : 
               "Formula: Unit Price = Price ÷ Quantity"}
            </span>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}
