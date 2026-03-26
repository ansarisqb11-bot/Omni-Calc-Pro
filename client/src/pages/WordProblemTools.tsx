import { useState, useMemo } from "react";
import {
  Calculator,
  ShoppingCart,
  Scale,
  Gauge,
  Users,
  Percent,
  TrendingUp,
  Clock,
  BarChart3,
  FlaskConical,
  Zap,
  Ruler,
  Droplets,
  Weight,
} from "lucide-react";
import { DesktopToolGrid, InputPanel } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "unit-price" | "ratio" | "speed" | "age" | "percentage" | "profit-loss" | "time-work" | "average" | "mixture" | "rate" | "basic" | "volume" | "length" | "weight";

const tools = [
  { id: "unit-price", label: "Unit Price", icon: ShoppingCart },
  { id: "ratio", label: "Ratio", icon: Scale },
  { id: "speed", label: "Speed", icon: Gauge },
  { id: "age", label: "Age", icon: Users },
  { id: "percentage", label: "Percentage", icon: Percent },
  { id: "profit-loss", label: "Profit/Loss", icon: TrendingUp },
  { id: "time-work", label: "Time & Work", icon: Clock },
  { id: "average", label: "Average", icon: BarChart3 },
  { id: "mixture", label: "Mixture", icon: FlaskConical },
  { id: "rate", label: "Rate", icon: Zap },
  { id: "basic", label: "Basic", icon: Calculator },
  { id: "volume", label: "Volume", icon: Droplets },
  { id: "length", label: "Length", icon: Ruler },
  { id: "weight", label: "Weight", icon: Weight },
];

export default function WordProblemTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("unit-price");

  const renderTool = () => {
    switch (activeTool) {
      case "unit-price": return <UnitPriceSolver />;
      case "ratio": return <RatioSolver />;
      case "speed": return <SpeedSolver />;
      case "age": return <AgeSolver />;
      case "percentage": return <PercentageSolver />;
      case "profit-loss": return <ProfitLossSolver />;
      case "time-work": return <TimeWorkSolver />;
      case "average": return <AverageSolver />;
      case "mixture": return <MixtureSolver />;
      case "rate": return <RateSolver />;
      case "basic": return <BasicSolver />;
      case "volume": return <VolumeSolver />;
      case "length": return <LengthSolver />;
      case "weight": return <WeightSolver />;
      default: return null;
    }
  };

  return (
    <PageWrapper
      title="Smart Word Problem Solvers"
      subtitle="Step-by-step solutions for common math problems"
      accentColor="bg-orange-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {renderTool()}
    </PageWrapper>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
function ModeToggle({ modes, mode, setMode }: { modes: { id: string; label: string }[]; mode: string; setMode: (m: string) => void }) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-xl mb-4 flex-wrap">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          data-testid={`mode-${m.id}`}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all min-w-[80px] ${
            mode === m.id ? "bg-background text-primary shadow-sm" : "text-muted-foreground"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

function CurrencySelector({ currency, setCurrency }: { currency: string; setCurrency: (c: string) => void }) {
  return (
    <div className="flex gap-1 p-0.5 bg-muted rounded-lg">
      {["₹", "$"].map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          data-testid={`currency-${c}`}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
            currency === c ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

function SolverInput({ label, value, onChange, type = "number", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <input
        type={type}
        inputMode={type === "number" ? "decimal" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={`input-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
    </div>
  );
}

function SolverSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`select-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="w-full bg-muted border border-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function StepsDisplay({ steps }: { steps: string[] }) {
  if (steps.length === 0) return null;
  return (
    <div className="bg-muted/20 p-3 rounded-xl border border-border/50 space-y-1.5">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Step-by-step</p>
      {steps.map((s, i) => (
        <p key={i} className="text-xs text-foreground" data-testid={`step-${i + 1}`}>
          <span className="font-bold text-orange-500 mr-1">Step {i + 1}:</span> {s}
        </p>
      ))}
    </div>
  );
}

function ResultBox({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
      <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className="text-2xl font-bold text-orange-500" data-testid="text-result">{value}</span>
        {unit && <span className="ml-1 text-xs font-medium text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

function fmt(n: number, decimals = 2): string {
  if (Number.isNaN(n) || !Number.isFinite(n)) return "—";
  return parseFloat(n.toFixed(decimals)).toLocaleString();
}

function SolverCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Solution</p>
      {children}
    </div>
  );
}

// ─── Unit Tables ──────────────────────────────────────────────────────────────
const VOLUME_UNITS = [
  { value: "ml", label: "Milliliter (ml)", factor: 0.001 },
  { value: "l", label: "Liter (L)", factor: 1 },
  { value: "cl", label: "Centiliter (cl)", factor: 0.01 },
  { value: "dl", label: "Deciliter (dl)", factor: 0.1 },
  { value: "kl", label: "Kiloliter (kL)", factor: 1000 },
  { value: "gal_us", label: "US Gallon", factor: 3.78541 },
  { value: "gal_uk", label: "UK Gallon", factor: 4.54609 },
  { value: "qt", label: "Quart (US)", factor: 0.946353 },
  { value: "pt", label: "Pint (US)", factor: 0.473176 },
  { value: "cup", label: "Cup (US)", factor: 0.236588 },
  { value: "fl_oz", label: "Fluid Ounce (US)", factor: 0.0295735 },
  { value: "tbsp", label: "Tablespoon", factor: 0.0147868 },
  { value: "tsp", label: "Teaspoon", factor: 0.00492892 },
  { value: "m3", label: "Cubic Meter (m³)", factor: 1000 },
  { value: "cm3", label: "Cubic cm (cm³)", factor: 0.001 },
  { value: "ft3", label: "Cubic Foot (ft³)", factor: 28.3168 },
  { value: "in3", label: "Cubic Inch (in³)", factor: 0.0163871 },
];

const LENGTH_UNITS = [
  { value: "mm", label: "Millimeter (mm)", factor: 0.001 },
  { value: "cm", label: "Centimeter (cm)", factor: 0.01 },
  { value: "m", label: "Meter (m)", factor: 1 },
  { value: "km", label: "Kilometer (km)", factor: 1000 },
  { value: "in", label: "Inch (in)", factor: 0.0254 },
  { value: "ft", label: "Foot (ft)", factor: 0.3048 },
  { value: "yd", label: "Yard (yd)", factor: 0.9144 },
  { value: "mi", label: "Mile (mi)", factor: 1609.34 },
  { value: "nm", label: "Nautical Mile", factor: 1852 },
  { value: "dm", label: "Decimeter (dm)", factor: 0.1 },
  { value: "µm", label: "Micrometer (µm)", factor: 0.000001 },
  { value: "ly", label: "Light Year", factor: 9.461e15 },
];

const WEIGHT_UNITS = [
  { value: "mg", label: "Milligram (mg)", factor: 0.000001 },
  { value: "g", label: "Gram (g)", factor: 0.001 },
  { value: "kg", label: "Kilogram (kg)", factor: 1 },
  { value: "quintal", label: "Quintal", factor: 100 },
  { value: "ton_m", label: "Metric Ton", factor: 1000 },
  { value: "oz", label: "Ounce (oz)", factor: 0.0283495 },
  { value: "lb", label: "Pound (lb)", factor: 0.453592 },
  { value: "st", label: "Stone (st)", factor: 6.35029 },
  { value: "ton_us", label: "US Ton (short)", factor: 907.185 },
  { value: "ton_uk", label: "UK Ton (long)", factor: 1016.05 },
  { value: "ct", label: "Carat (ct)", factor: 0.0002 },
  { value: "tola", label: "Tola (India)", factor: 0.01166 },
];

// ─── 1. Unit Price Solver ─────────────────────────────────────────────────────
function UnitPriceSolver() {
  const [mode, setMode] = useState("find-price");
  const [currency, setCurrency] = useState("₹");
  const [qty, setQty] = useState("5");
  const [price, setPrice] = useState("40");
  const [requiredQty, setRequiredQty] = useState("8");
  const [budget, setBudget] = useState("100");
  const [unit, setUnit] = useState("pieces");

  const result = useMemo(() => {
    const q = parseFloat(qty) || 0;
    const p = parseFloat(price) || 0;
    const rq = parseFloat(requiredQty) || 0;
    const b = parseFloat(budget) || 0;
    if (q === 0) return { value: "—", steps: [] };

    const unitPrice = p / q;

    if (mode === "find-price") {
      const total = unitPrice * rq;
      return {
        value: `${currency}${fmt(total)}`,
        steps: [
          `Unit price = ${currency}${fmt(p)} ÷ ${fmt(q)} ${unit} = ${currency}${fmt(unitPrice)} per ${unit.replace(/s$/, "")}`,
          `Total cost = ${currency}${fmt(unitPrice)} × ${fmt(rq)} = ${currency}${fmt(total)}`,
        ],
      };
    } else {
      const canBuy = b / unitPrice;
      return {
        value: `${fmt(canBuy)} ${unit}`,
        steps: [
          `Unit price = ${currency}${fmt(p)} ÷ ${fmt(q)} ${unit} = ${currency}${fmt(unitPrice)} per ${unit.replace(/s$/, "")}`,
          `Quantity = ${currency}${fmt(b)} ÷ ${currency}${fmt(unitPrice)} = ${fmt(canBuy)} ${unit}`,
        ],
      };
    }
  }, [mode, qty, price, requiredQty, budget, unit, currency]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Unit Price & Quantity Solver" icon={ShoppingCart} iconColor="bg-orange-500">
          <ModeToggle
            modes={[{ id: "find-price", label: "Find Price" }, { id: "find-quantity", label: "Find Quantity" }]}
            mode={mode} setMode={setMode}
          />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Currency</span>
            <CurrencySelector currency={currency} setCurrency={setCurrency} />
          </div>
          <div className="space-y-3">
            <SolverSelect label="Unit Type" value={unit} onChange={setUnit} options={[
              { value: "pieces", label: "Pieces" }, { value: "kg", label: "Kilograms" },
              { value: "g", label: "Grams" }, { value: "liter", label: "Liters" },
              { value: "ml", label: "Milliliters" }, { value: "dozen", label: "Dozen" },
              { value: "pack", label: "Pack" },
            ]} />
            <div className="grid grid-cols-2 gap-3">
              <SolverInput label="Known Quantity" value={qty} onChange={setQty} placeholder="e.g. 5" />
              <SolverInput label={`Price (${currency})`} value={price} onChange={setPrice} placeholder="e.g. 40" />
            </div>
            {mode === "find-price" ? (
              <SolverInput label="Required Quantity" value={requiredQty} onChange={setRequiredQty} placeholder="e.g. 8" />
            ) : (
              <SolverInput label={`Budget (${currency})`} value={budget} onChange={setBudget} placeholder="e.g. 100" />
            )}
          </div>
        </InputPanel>
      }
      results={
        <SolverCard>
          <StepsDisplay steps={result.steps} />
          <ResultBox label={mode === "find-price" ? "Total Cost" : "You Can Buy"} value={result.value} />
        </SolverCard>
      }
    />
  );
}

// ─── 2. Ratio Solver ──────────────────────────────────────────────────────────
function RatioSolver() {
  const [mode, setMode] = useState("divide");
  const [currency, setCurrency] = useState("₹");
  const [ratioA, setRatioA] = useState("2");
  const [ratioB, setRatioB] = useState("3");
  const [total, setTotal] = useState("500");
  const [knownPart, setKnownPart] = useState("200");
  const [workers1, setWorkers1] = useState("6");
  const [days1, setDays1] = useState("10");
  const [workers2, setWorkers2] = useState("4");

  const result = useMemo(() => {
    const a = parseFloat(ratioA) || 0;
    const b = parseFloat(ratioB) || 0;
    const t = parseFloat(total) || 0;
    const kp = parseFloat(knownPart) || 0;
    const w1 = parseFloat(workers1) || 0;
    const d1 = parseFloat(days1) || 0;
    const w2 = parseFloat(workers2) || 0;

    if (mode === "divide") {
      const sum = a + b;
      if (sum === 0) return { value: "—", steps: [] };
      const p1 = (t * a) / sum;
      const p2 = (t * b) / sum;
      return {
        value: `${currency}${fmt(p1)} : ${currency}${fmt(p2)}`,
        steps: [
          `Ratio = ${a}:${b}, Sum of parts = ${a} + ${b} = ${sum}`,
          `Part 1 = ${currency}${fmt(t)} × ${a}/${sum} = ${currency}${fmt(p1)}`,
          `Part 2 = ${currency}${fmt(t)} × ${b}/${sum} = ${currency}${fmt(p2)}`,
        ],
      };
    } else if (mode === "find-part") {
      if (a === 0) return { value: "—", steps: [] };
      const otherPart = (kp * b) / a;
      return {
        value: `${currency}${fmt(otherPart)}`,
        steps: [
          `Ratio = ${a}:${b}`,
          `If Part A = ${currency}${fmt(kp)}, then 1 part = ${currency}${fmt(kp)} ÷ ${a} = ${currency}${fmt(kp / a)}`,
          `Part B = ${currency}${fmt(kp / a)} × ${b} = ${currency}${fmt(otherPart)}`,
        ],
      };
    } else {
      if (w2 === 0) return { value: "—", steps: [] };
      const totalWork = w1 * d1;
      const d2 = totalWork / w2;
      return {
        value: `${fmt(d2)} days`,
        steps: [
          `Total work = ${w1} workers × ${d1} days = ${totalWork} worker-days`,
          `With ${w2} workers: ${totalWork} ÷ ${w2} = ${fmt(d2)} days`,
          `(Inverse proportion: more workers = fewer days)`,
        ],
      };
    }
  }, [mode, ratioA, ratioB, total, knownPart, workers1, days1, workers2, currency]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Ratio & Proportion Solver" icon={Scale} iconColor="bg-orange-500">
          <ModeToggle
            modes={[
              { id: "divide", label: "Divide Amount" },
              { id: "find-part", label: "Find Part" },
              { id: "workers", label: "Workers/Days" },
            ]}
            mode={mode} setMode={setMode}
          />
          {mode !== "workers" && (
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Currency</span>
              <CurrencySelector currency={currency} setCurrency={setCurrency} />
            </div>
          )}
          <div className="space-y-3">
            {mode === "workers" ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <SolverInput label="Workers (Group 1)" value={workers1} onChange={setWorkers1} />
                  <SolverInput label="Days (Group 1)" value={days1} onChange={setDays1} />
                </div>
                <SolverInput label="Workers (Group 2)" value={workers2} onChange={setWorkers2} />
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <SolverInput label="Ratio A" value={ratioA} onChange={setRatioA} placeholder="2" />
                  <SolverInput label="Ratio B" value={ratioB} onChange={setRatioB} placeholder="3" />
                </div>
                {mode === "divide" ? (
                  <SolverInput label={`Total Amount (${currency})`} value={total} onChange={setTotal} placeholder="500" />
                ) : (
                  <SolverInput label={`Known Part A (${currency})`} value={knownPart} onChange={setKnownPart} placeholder="200" />
                )}
              </>
            )}
          </div>
        </InputPanel>
      }
      results={
        <SolverCard>
          <StepsDisplay steps={result.steps} />
          <ResultBox label="Result" value={result.value} />
        </SolverCard>
      }
    />
  );
}

// ─── 3. Speed Solver ──────────────────────────────────────────────────────────
function SpeedSolver() {
  const [mode, setMode] = useState("find-distance");
  const [speed, setSpeed] = useState("60");
  const [time, setTime] = useState("2");
  const [distance, setDistance] = useState("120");
  const [speedUnit, setSpeedUnit] = useState("km/h");
  const [distUnit, setDistUnit] = useState("km");
  const [timeUnit, setTimeUnit] = useState("hours");
  const [speed2, setSpeed2] = useState("40");
  const [trainLength, setTrainLength] = useState("200");
  const [streamSpeed, setStreamSpeed] = useState("5");

  const speedOpts = [
    { value: "km/h", label: "km/h" }, { value: "mph", label: "mph" }, { value: "m/s", label: "m/s" },
  ];
  const distOpts = [
    { value: "km", label: "km" }, { value: "miles", label: "miles" }, { value: "m", label: "m" },
  ];
  const timeOpts = [
    { value: "hours", label: "Hours" }, { value: "minutes", label: "Minutes" }, { value: "seconds", label: "Seconds" },
  ];

  const result = useMemo(() => {
    const s = parseFloat(speed) || 0;
    const t = parseFloat(time) || 0;
    const d = parseFloat(distance) || 0;
    const s2 = parseFloat(speed2) || 0;
    const tl = parseFloat(trainLength) || 0;
    const ss = parseFloat(streamSpeed) || 0;

    switch (mode) {
      case "find-distance": {
        const res = s * t;
        return {
          value: `${fmt(res)} ${distUnit}`,
          steps: [
            `Formula: Distance = Speed × Time`,
            `Distance = ${fmt(s)} ${speedUnit} × ${fmt(t)} ${timeUnit} = ${fmt(res)} ${distUnit}`,
          ],
        };
      }
      case "find-speed": {
        if (t === 0) return { value: "—", steps: [] };
        const res = d / t;
        return {
          value: `${fmt(res)} ${speedUnit}`,
          steps: [
            `Formula: Speed = Distance ÷ Time`,
            `Speed = ${fmt(d)} ${distUnit} ÷ ${fmt(t)} ${timeUnit} = ${fmt(res)} ${speedUnit}`,
          ],
        };
      }
      case "find-time": {
        if (s === 0) return { value: "—", steps: [] };
        const res = d / s;
        return {
          value: `${fmt(res)} ${timeUnit}`,
          steps: [
            `Formula: Time = Distance ÷ Speed`,
            `Time = ${fmt(d)} ${distUnit} ÷ ${fmt(s)} ${speedUnit} = ${fmt(res)} ${timeUnit}`,
          ],
        };
      }
      case "relative": {
        const same = s + s2;
        const opp = Math.abs(s - s2);
        return {
          value: `Same: ${fmt(same)}, Opposite: ${fmt(opp)}`,
          steps: [
            `Speed A = ${fmt(s)} ${speedUnit}, Speed B = ${fmt(s2)} ${speedUnit}`,
            `Same direction: |${fmt(s)} - ${fmt(s2)}| = ${fmt(opp)} ${speedUnit}`,
            `Opposite direction: ${fmt(s)} + ${fmt(s2)} = ${fmt(same)} ${speedUnit}`,
          ],
        };
      }
      case "average-speed": {
        const totalDist = d + (parseFloat(time) || 0);
        if (s === 0 || s2 === 0) return { value: "—", steps: [] };
        const t1 = d / s;
        const t2 = (parseFloat(time) || 0) / s2;
        const totalTime = t1 + t2;
        if (totalTime === 0) return { value: "—", steps: [] };
        const avg = totalDist / totalTime;
        return {
          value: `${fmt(avg)} ${speedUnit}`,
          steps: [
            `Distance 1 = ${fmt(d)} ${distUnit} at ${fmt(s)} ${speedUnit}`,
            `Distance 2 = ${fmt(parseFloat(time) || 0)} ${distUnit} at ${fmt(s2)} ${speedUnit}`,
            `Time 1 = ${fmt(d)}/${fmt(s)} = ${fmt(t1)} hrs, Time 2 = ${fmt(parseFloat(time) || 0)}/${fmt(s2)} = ${fmt(t2)} hrs`,
            `Average Speed = ${fmt(totalDist)} ÷ ${fmt(totalTime)} = ${fmt(avg)} ${speedUnit}`,
          ],
        };
      }
      case "train": {
        if (s === 0) return { value: "—", steps: [] };
        let speedMps = s;
        if (speedUnit === "km/h") speedMps = s * (5 / 18);
        else if (speedUnit === "mph") speedMps = s * 0.44704;
        const timeSec = tl / speedMps;
        return {
          value: `${fmt(timeSec)} seconds`,
          steps: [
            `Train length = ${fmt(tl)} m`,
            `Speed = ${fmt(s)} ${speedUnit} = ${fmt(speedMps, 4)} m/s`,
            `Time to cross = ${fmt(tl)} ÷ ${fmt(speedMps, 4)} = ${fmt(timeSec)} seconds`,
          ],
        };
      }
      case "boat": {
        const down = s + ss;
        const up = s - ss;
        return {
          value: `Down: ${fmt(down)}, Up: ${fmt(up)}`,
          steps: [
            `Speed in still water = ${fmt(s)} ${speedUnit}`,
            `Stream speed = ${fmt(ss)} ${speedUnit}`,
            `Downstream = ${fmt(s)} + ${fmt(ss)} = ${fmt(down)} ${speedUnit}`,
            `Upstream = ${fmt(s)} - ${fmt(ss)} = ${fmt(up)} ${speedUnit}`,
          ],
        };
      }
      default:
        return { value: "—", steps: [] };
    }
  }, [mode, speed, time, distance, speedUnit, distUnit, timeUnit, speed2, trainLength, streamSpeed]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Speed-Time-Distance Solver" icon={Gauge} iconColor="bg-orange-500">
          <ModeToggle
            modes={[
              { id: "find-distance", label: "Distance" },
              { id: "find-speed", label: "Speed" },
              { id: "find-time", label: "Time" },
              { id: "relative", label: "Relative" },
              { id: "average-speed", label: "Avg Speed" },
              { id: "train", label: "Train" },
              { id: "boat", label: "Boat" },
            ]}
            mode={mode} setMode={setMode}
          />
          <div className="space-y-3">
            {mode === "find-distance" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <SolverInput label="Speed" value={speed} onChange={setSpeed} />
                  <SolverSelect label="Speed Unit" value={speedUnit} onChange={setSpeedUnit} options={speedOpts} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <SolverInput label="Time" value={time} onChange={setTime} />
                  <SolverSelect label="Time Unit" value={timeUnit} onChange={setTimeUnit} options={timeOpts} />
                </div>
              </>
            )}
            {mode === "find-speed" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <SolverInput label="Distance" value={distance} onChange={setDistance} />
                  <SolverSelect label="Dist Unit" value={distUnit} onChange={setDistUnit} options={distOpts} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <SolverInput label="Time" value={time} onChange={setTime} />
                  <SolverSelect label="Time Unit" value={timeUnit} onChange={setTimeUnit} options={timeOpts} />
                </div>
              </>
            )}
            {mode === "find-time" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <SolverInput label="Distance" value={distance} onChange={setDistance} />
                  <SolverSelect label="Dist Unit" value={distUnit} onChange={setDistUnit} options={distOpts} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <SolverInput label="Speed" value={speed} onChange={setSpeed} />
                  <SolverSelect label="Speed Unit" value={speedUnit} onChange={setSpeedUnit} options={speedOpts} />
                </div>
              </>
            )}
            {mode === "relative" && (
              <>
                <SolverInput label="Speed A" value={speed} onChange={setSpeed} />
                <SolverInput label="Speed B" value={speed2} onChange={setSpeed2} />
                <SolverSelect label="Speed Unit" value={speedUnit} onChange={setSpeedUnit} options={speedOpts} />
              </>
            )}
            {mode === "average-speed" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <SolverInput label="Distance 1" value={distance} onChange={setDistance} />
                  <SolverInput label="Speed 1" value={speed} onChange={setSpeed} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <SolverInput label="Distance 2" value={time} onChange={setTime} />
                  <SolverInput label="Speed 2" value={speed2} onChange={setSpeed2} />
                </div>
                <SolverSelect label="Speed Unit" value={speedUnit} onChange={setSpeedUnit} options={speedOpts} />
              </>
            )}
            {mode === "train" && (
              <>
                <SolverInput label="Train Length (m)" value={trainLength} onChange={setTrainLength} />
                <div className="grid grid-cols-2 gap-3">
                  <SolverInput label="Speed" value={speed} onChange={setSpeed} />
                  <SolverSelect label="Speed Unit" value={speedUnit} onChange={setSpeedUnit} options={speedOpts} />
                </div>
              </>
            )}
            {mode === "boat" && (
              <>
                <SolverInput label="Speed in Still Water" value={speed} onChange={setSpeed} />
                <SolverInput label="Stream Speed" value={streamSpeed} onChange={setStreamSpeed} />
                <SolverSelect label="Speed Unit" value={speedUnit} onChange={setSpeedUnit} options={speedOpts} />
              </>
            )}
          </div>
        </InputPanel>
      }
      results={
        <SolverCard>
          <StepsDisplay steps={result.steps} />
          <ResultBox label="Result" value={result.value} />
        </SolverCard>
      }
    />
  );
}

// ─── 4. Age Solver ────────────────────────────────────────────────────────────
function AgeSolver() {
  const [mode, setMode] = useState("find-age");
  const [age, setAge] = useState("8");
  const [multiplier, setMultiplier] = useState("4");
  const [difference, setDifference] = useState("25");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const a = parseFloat(age) || 0;
    const m = parseFloat(multiplier) || 0;
    const d = parseFloat(difference) || 0;
    const y = parseFloat(years) || 0;

    switch (mode) {
      case "find-age": {
        const other = a * m;
        return {
          value: `${fmt(other)} years`,
          steps: [
            `Given: One person's age = ${fmt(a)} years`,
            `Multiplier = ${fmt(m)} times`,
            `Other person's age = ${fmt(a)} × ${fmt(m)} = ${fmt(other)} years`,
          ],
        };
      }
      case "age-diff": {
        const other = a + d;
        return {
          value: `${fmt(other)} years`,
          steps: [
            `Given age = ${fmt(a)} years`,
            `Age difference = ${fmt(d)} years`,
            `Other person's age = ${fmt(a)} + ${fmt(d)} = ${fmt(other)} years`,
          ],
        };
      }
      case "after-years": {
        const future = a + y;
        const otherNow = a * m;
        const otherFuture = otherNow + y;
        return {
          value: `${fmt(future)} & ${fmt(otherFuture)} years`,
          steps: [
            `Current age = ${fmt(a)} years, Other = ${fmt(a)} × ${fmt(m)} = ${fmt(otherNow)} years`,
            `After ${fmt(y)} years:`,
            `Person 1: ${fmt(a)} + ${fmt(y)} = ${fmt(future)} years`,
            `Person 2: ${fmt(otherNow)} + ${fmt(y)} = ${fmt(otherFuture)} years`,
            `New ratio = ${fmt(future)} : ${fmt(otherFuture)}`,
          ],
        };
      }
      case "find-ratio": {
        const other = a + d;
        if (a === 0) return { value: "—", steps: [] };
        const r = other / a;
        return {
          value: `1 : ${fmt(r)}`,
          steps: [
            `Person A = ${fmt(a)} years`,
            `Person B = ${fmt(a)} + ${fmt(d)} = ${fmt(other)} years`,
            `Ratio A:B = ${fmt(a)}:${fmt(other)} = 1:${fmt(r)}`,
          ],
        };
      }
      default:
        return { value: "—", steps: [] };
    }
  }, [mode, age, multiplier, difference, years]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Age Word Problems Solver" icon={Users} iconColor="bg-orange-500">
          <ModeToggle
            modes={[
              { id: "find-age", label: "Find Age" },
              { id: "age-diff", label: "Difference" },
              { id: "after-years", label: "After N Years" },
              { id: "find-ratio", label: "Find Ratio" },
            ]}
            mode={mode} setMode={setMode}
          />
          <div className="space-y-3">
            <SolverInput label="Known Age" value={age} onChange={setAge} placeholder="e.g. 8" />
            {(mode === "find-age" || mode === "after-years") && (
              <SolverInput label="Multiplier" value={multiplier} onChange={setMultiplier} placeholder="e.g. 4" />
            )}
            {(mode === "age-diff" || mode === "find-ratio") && (
              <SolverInput label="Age Difference" value={difference} onChange={setDifference} placeholder="e.g. 25" />
            )}
            {mode === "after-years" && (
              <SolverInput label="Years Ahead" value={years} onChange={setYears} placeholder="e.g. 5" />
            )}
          </div>
        </InputPanel>
      }
      results={
        <SolverCard>
          <StepsDisplay steps={result.steps} />
          <ResultBox label="Result" value={result.value} />
        </SolverCard>
      }
    />
  );
}

// ─── 5. Percentage Solver ─────────────────────────────────────────────────────
function PercentageSolver() {
  const [mode, setMode] = useState("find-pct");
  const [value, setValue] = useState("250");
  const [percentage, setPercentage] = useState("20");
  const [finalValue, setFinalValue] = useState("300");
  const [currency, setCurrency] = useState("₹");

  const result = useMemo(() => {
    const v = parseFloat(value) || 0;
    const p = parseFloat(percentage) || 0;
    const fv = parseFloat(finalValue) || 0;

    switch (mode) {
      case "find-pct": {
        const res = (p / 100) * v;
        return {
          value: `${currency}${fmt(res)}`,
          steps: [
            `Formula: (Percentage / 100) × Value`,
            `= (${fmt(p)} / 100) × ${fmt(v)}`,
            `= ${fmt(p / 100, 4)} × ${fmt(v)} = ${currency}${fmt(res)}`,
          ],
        };
      }
      case "increase": {
        const inc = (p / 100) * v;
        const res = v + inc;
        return {
          value: `${currency}${fmt(res)}`,
          steps: [
            `Original value = ${currency}${fmt(v)}`,
            `Increase = ${fmt(p)}% of ${fmt(v)} = ${currency}${fmt(inc)}`,
            `New value = ${currency}${fmt(v)} + ${currency}${fmt(inc)} = ${currency}${fmt(res)}`,
          ],
        };
      }
      case "decrease": {
        const dec = (p / 100) * v;
        const res = v - dec;
        return {
          value: `${currency}${fmt(res)}`,
          steps: [
            `Original value = ${currency}${fmt(v)}`,
            `Decrease = ${fmt(p)}% of ${fmt(v)} = ${currency}${fmt(dec)}`,
            `New value = ${currency}${fmt(v)} - ${currency}${fmt(dec)} = ${currency}${fmt(res)}`,
          ],
        };
      }
      case "find-original": {
        const factor = 1 + p / 100;
        if (factor === 0) return { value: "—", steps: [] };
        const orig = fv / factor;
        return {
          value: `${currency}${fmt(orig)}`,
          steps: [
            `Final value after ${fmt(p)}% increase = ${currency}${fmt(fv)}`,
            `Final = Original × (1 + ${fmt(p)}/100) = Original × ${fmt(factor, 4)}`,
            `Original = ${currency}${fmt(fv)} ÷ ${fmt(factor, 4)} = ${currency}${fmt(orig)}`,
          ],
        };
      }
      default:
        return { value: "—", steps: [] };
    }
  }, [mode, value, percentage, finalValue, currency]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Percentage Problems Solver" icon={Percent} iconColor="bg-orange-500">
          <ModeToggle
            modes={[
              { id: "find-pct", label: "X% of Y" },
              { id: "increase", label: "Increase %" },
              { id: "decrease", label: "Decrease %" },
              { id: "find-original", label: "Find Original" },
            ]}
            mode={mode} setMode={setMode}
          />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Currency</span>
            <CurrencySelector currency={currency} setCurrency={setCurrency} />
          </div>
          <div className="space-y-3">
            {mode === "find-original" ? (
              <>
                <SolverInput label={`Final Value (${currency})`} value={finalValue} onChange={setFinalValue} />
                <SolverInput label="Percentage (%)" value={percentage} onChange={setPercentage} />
              </>
            ) : (
              <>
                <SolverInput label={`Value (${currency})`} value={value} onChange={setValue} />
                <SolverInput label="Percentage (%)" value={percentage} onChange={setPercentage} />
              </>
            )}
          </div>
        </InputPanel>
      }
      results={
        <SolverCard>
          <StepsDisplay steps={result.steps} />
          <ResultBox label="Result" value={result.value} />
        </SolverCard>
      }
    />
  );
}

// ─── 6. Profit & Loss Solver ──────────────────────────────────────────────────
function ProfitLossSolver() {
  const [mode, setMode] = useState("find-pl");
  const [currency, setCurrency] = useState("₹");
  const [cp, setCp] = useState("500");
  const [sp, setSp] = useState("600");
  const [plPercent, setPlPercent] = useState("20");
  const [plType, setPlType] = useState("profit");

  const result = useMemo(() => {
    const costPrice = parseFloat(cp) || 0;
    const sellPrice = parseFloat(sp) || 0;
    const pct = parseFloat(plPercent) || 0;

    switch (mode) {
      case "find-pl": {
        if (costPrice === 0) return { value: "—", steps: [] };
        const diff = sellPrice - costPrice;
        const pctVal = (Math.abs(diff) / costPrice) * 100;
        const isProfit = diff >= 0;
        return {
          value: `${isProfit ? "Profit" : "Loss"}: ${currency}${fmt(Math.abs(diff))} (${fmt(pctVal)}%)`,
          steps: [
            `Cost Price (CP) = ${currency}${fmt(costPrice)}`,
            `Selling Price (SP) = ${currency}${fmt(sellPrice)}`,
            `Difference = SP - CP = ${currency}${fmt(sellPrice)} - ${currency}${fmt(costPrice)} = ${currency}${fmt(diff)}`,
            `${isProfit ? "Profit" : "Loss"} % = (${fmt(Math.abs(diff))} / ${fmt(costPrice)}) × 100 = ${fmt(pctVal)}%`,
          ],
        };
      }
      case "find-sp": {
        const factor = plType === "profit" ? (1 + pct / 100) : (1 - pct / 100);
        const res = costPrice * factor;
        return {
          value: `${currency}${fmt(res)}`,
          steps: [
            `Cost Price = ${currency}${fmt(costPrice)}`,
            `${plType === "profit" ? "Profit" : "Loss"} % = ${fmt(pct)}%`,
            `SP = CP × (1 ${plType === "profit" ? "+" : "-"} ${fmt(pct)}/100)`,
            `SP = ${currency}${fmt(costPrice)} × ${fmt(factor, 4)} = ${currency}${fmt(res)}`,
          ],
        };
      }
      case "find-cp": {
        const factor = plType === "profit" ? (1 + pct / 100) : (1 - pct / 100);
        if (factor === 0) return { value: "—", steps: [] };
        const res = sellPrice / factor;
        return {
          value: `${currency}${fmt(res)}`,
          steps: [
            `Selling Price = ${currency}${fmt(sellPrice)}`,
            `${plType === "profit" ? "Profit" : "Loss"} % = ${fmt(pct)}%`,
            `CP = SP ÷ (1 ${plType === "profit" ? "+" : "-"} ${fmt(pct)}/100)`,
            `CP = ${currency}${fmt(sellPrice)} ÷ ${fmt(factor, 4)} = ${currency}${fmt(res)}`,
          ],
        };
      }
      default:
        return { value: "—", steps: [] };
    }
  }, [mode, cp, sp, plPercent, plType, currency]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Profit & Loss Solver" icon={TrendingUp} iconColor="bg-orange-500">
          <ModeToggle
            modes={[
              { id: "find-pl", label: "Find P/L" },
              { id: "find-sp", label: "Find SP" },
              { id: "find-cp", label: "Find CP" },
            ]}
            mode={mode} setMode={setMode}
          />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Currency</span>
            <CurrencySelector currency={currency} setCurrency={setCurrency} />
          </div>
          <div className="space-y-3">
            {mode === "find-pl" && (
              <>
                <SolverInput label={`Cost Price (${currency})`} value={cp} onChange={setCp} />
                <SolverInput label={`Selling Price (${currency})`} value={sp} onChange={setSp} />
              </>
            )}
            {mode === "find-sp" && (
              <>
                <SolverInput label={`Cost Price (${currency})`} value={cp} onChange={setCp} />
                <SolverSelect label="Type" value={plType} onChange={setPlType} options={[
                  { value: "profit", label: "Profit %" }, { value: "loss", label: "Loss %" },
                ]} />
                <SolverInput label="Percentage (%)" value={plPercent} onChange={setPlPercent} />
              </>
            )}
            {mode === "find-cp" && (
              <>
                <SolverInput label={`Selling Price (${currency})`} value={sp} onChange={setSp} />
                <SolverSelect label="Type" value={plType} onChange={setPlType} options={[
                  { value: "profit", label: "Profit %" }, { value: "loss", label: "Loss %" },
                ]} />
                <SolverInput label="Percentage (%)" value={plPercent} onChange={setPlPercent} />
              </>
            )}
          </div>
        </InputPanel>
      }
      results={
        <SolverCard>
          <StepsDisplay steps={result.steps} />
          <ResultBox label="Result" value={result.value} />
        </SolverCard>
      }
    />
  );
}

// ─── 7. Time & Work Solver ────────────────────────────────────────────────────
function TimeWorkSolver() {
  const [mode, setMode] = useState("combined");
  const [daysA, setDaysA] = useState("10");
  const [daysB, setDaysB] = useState("15");
  const [togetherDays, setTogetherDays] = useState("6");
  const [fillTime, setFillTime] = useState("12");
  const [leakTime, setLeakTime] = useState("20");

  const result = useMemo(() => {
    const a = parseFloat(daysA) || 0;
    const b = parseFloat(daysB) || 0;
    const tog = parseFloat(togetherDays) || 0;
    const ft = parseFloat(fillTime) || 0;
    const lt = parseFloat(leakTime) || 0;

    switch (mode) {
      case "combined": {
        if (a === 0 || b === 0) return { value: "—", steps: [] };
        const rateA = 1 / a;
        const rateB = 1 / b;
        const combined = rateA + rateB;
        const totalDays = 1 / combined;
        return {
          value: `${fmt(totalDays)} days`,
          steps: [
            `A's rate = 1/${fmt(a)} = ${fmt(rateA, 4)} work/day`,
            `B's rate = 1/${fmt(b)} = ${fmt(rateB, 4)} work/day`,
            `Combined rate = ${fmt(rateA, 4)} + ${fmt(rateB, 4)} = ${fmt(combined, 4)} work/day`,
            `Total days = 1 ÷ ${fmt(combined, 4)} = ${fmt(totalDays)} days`,
          ],
        };
      }
      case "find-individual": {
        if (tog === 0 || a === 0) return { value: "—", steps: [] };
        const rateTogether = 1 / tog;
        const rateA = 1 / a;
        const rateB = rateTogether - rateA;
        if (rateB <= 0) return { value: "Invalid input", steps: ["B's rate would be zero or negative"] };
        const daysForB = 1 / rateB;
        return {
          value: `${fmt(daysForB)} days`,
          steps: [
            `Together they finish in ${fmt(tog)} days → rate = 1/${fmt(tog)} = ${fmt(rateTogether, 4)}/day`,
            `A alone takes ${fmt(a)} days → rate = 1/${fmt(a)} = ${fmt(rateA, 4)}/day`,
            `B's rate = ${fmt(rateTogether, 4)} - ${fmt(rateA, 4)} = ${fmt(rateB, 4)}/day`,
            `B alone = 1 ÷ ${fmt(rateB, 4)} = ${fmt(daysForB)} days`,
          ],
        };
      }
      case "pipes": {
        if (ft === 0) return { value: "—", steps: [] };
        const fillRate = 1 / ft;
        const leakRate = lt > 0 ? 1 / lt : 0;
        const net = fillRate - leakRate;
        if (net <= 0) return { value: "Tank will never fill", steps: [`Fill rate (${fmt(fillRate, 4)}) <= Leak rate (${fmt(leakRate, 4)})`] };
        const totalTime = 1 / net;
        return {
          value: `${fmt(totalTime)} hours`,
          steps: [
            `Fill pipe rate = 1/${fmt(ft)} = ${fmt(fillRate, 4)} tank/hour`,
            `Leak rate = 1/${fmt(lt)} = ${fmt(leakRate, 4)} tank/hour`,
            `Net rate = ${fmt(fillRate, 4)} - ${fmt(leakRate, 4)} = ${fmt(net, 4)} tank/hour`,
            `Time to fill = 1 ÷ ${fmt(net, 4)} = ${fmt(totalTime)} hours`,
          ],
        };
      }
      default:
        return { value: "—", steps: [] };
    }
  }, [mode, daysA, daysB, togetherDays, fillTime, leakTime]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Time & Work / Pipes Solver" icon={Clock} iconColor="bg-orange-500">
          <ModeToggle
            modes={[
              { id: "combined", label: "Combined Work" },
              { id: "find-individual", label: "Find Individual" },
              { id: "pipes", label: "Pipes & Cistern" },
            ]}
            mode={mode} setMode={setMode}
          />
          <div className="space-y-3">
            {mode === "combined" && (
              <>
                <SolverInput label="A completes in (days)" value={daysA} onChange={setDaysA} />
                <SolverInput label="B completes in (days)" value={daysB} onChange={setDaysB} />
              </>
            )}
            {mode === "find-individual" && (
              <>
                <SolverInput label="Together in (days)" value={togetherDays} onChange={setTogetherDays} />
                <SolverInput label="A alone in (days)" value={daysA} onChange={setDaysA} />
              </>
            )}
            {mode === "pipes" && (
              <>
                <SolverInput label="Fill pipe time (hours)" value={fillTime} onChange={setFillTime} />
                <SolverInput label="Leak/empty time (hours)" value={leakTime} onChange={setLeakTime} />
              </>
            )}
          </div>
        </InputPanel>
      }
      results={
        <SolverCard>
          <StepsDisplay steps={result.steps} />
          <ResultBox label="Result" value={result.value} />
        </SolverCard>
      }
    />
  );
}

// ─── 8. Average Solver ────────────────────────────────────────────────────────
function AverageSolver() {
  const [mode, setMode] = useState("find-avg");
  const [numbers, setNumbers] = useState("10, 20, 30, 40, 50");
  const [average, setAverage] = useState("30");
  const [count, setCount] = useState("5");
  const [newNumber, setNewNumber] = useState("60");
  const [total, setTotal] = useState("150");

  const result = useMemo(() => {
    const avg = parseFloat(average) || 0;
    const cnt = parseFloat(count) || 0;
    const nn = parseFloat(newNumber) || 0;
    const tot = parseFloat(total) || 0;

    switch (mode) {
      case "find-avg": {
        const nums = numbers.split(",").map((n) => parseFloat(n.trim())).filter((n) => !isNaN(n));
        if (nums.length === 0) return { value: "—", steps: [] };
        const sum = nums.reduce((a, b) => a + b, 0);
        const res = sum / nums.length;
        return {
          value: fmt(res),
          steps: [
            `Numbers: ${nums.join(", ")}`,
            `Sum = ${nums.join(" + ")} = ${fmt(sum)}`,
            `Count = ${nums.length}`,
            `Average = ${fmt(sum)} ÷ ${nums.length} = ${fmt(res)}`,
          ],
        };
      }
      case "find-missing": {
        const nums = numbers.split(",").map((n) => parseFloat(n.trim())).filter((n) => !isNaN(n));
        const knownSum = nums.reduce((a, b) => a + b, 0);
        const totalCount = nums.length + 1;
        const requiredSum = avg * totalCount;
        const missing = requiredSum - knownSum;
        return {
          value: fmt(missing),
          steps: [
            `Known numbers: ${nums.join(", ")}`,
            `Known sum = ${fmt(knownSum)}`,
            `Required average = ${fmt(avg)} for ${totalCount} numbers`,
            `Required sum = ${fmt(avg)} × ${totalCount} = ${fmt(requiredSum)}`,
            `Missing number = ${fmt(requiredSum)} - ${fmt(knownSum)} = ${fmt(missing)}`,
          ],
        };
      }
      case "new-avg": {
        const nums = numbers.split(",").map((n) => parseFloat(n.trim())).filter((n) => !isNaN(n));
        const sum = nums.reduce((a, b) => a + b, 0);
        const newSum = sum + nn;
        const newCount = nums.length + 1;
        const res = newSum / newCount;
        return {
          value: fmt(res),
          steps: [
            `Original numbers: ${nums.join(", ")}`,
            `Original sum = ${fmt(sum)}, count = ${nums.length}`,
            `Adding ${fmt(nn)}: new sum = ${fmt(sum)} + ${fmt(nn)} = ${fmt(newSum)}`,
            `New count = ${newCount}`,
            `New average = ${fmt(newSum)} ÷ ${newCount} = ${fmt(res)}`,
          ],
        };
      }
      case "find-count": {
        if (avg === 0) return { value: "—", steps: [] };
        const res = tot / avg;
        return {
          value: fmt(res),
          steps: [
            `Total sum = ${fmt(tot)}`,
            `Average = ${fmt(avg)}`,
            `Count = Total ÷ Average = ${fmt(tot)} ÷ ${fmt(avg)} = ${fmt(res)}`,
          ],
        };
      }
      default:
        return { value: "—", steps: [] };
    }
  }, [mode, numbers, average, count, newNumber, total]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Average Problems Solver" icon={BarChart3} iconColor="bg-orange-500">
          <ModeToggle
            modes={[
              { id: "find-avg", label: "Find Average" },
              { id: "find-missing", label: "Missing No." },
              { id: "new-avg", label: "New Average" },
              { id: "find-count", label: "Find Count" },
            ]}
            mode={mode} setMode={setMode}
          />
          <div className="space-y-3">
            {(mode === "find-avg" || mode === "find-missing" || mode === "new-avg") && (
              <SolverInput label="Numbers (comma-separated)" value={numbers} onChange={setNumbers} type="text" placeholder="10, 20, 30, 40, 50" />
            )}
            {mode === "find-missing" && (
              <SolverInput label="Target Average" value={average} onChange={setAverage} />
            )}
            {mode === "new-avg" && (
              <SolverInput label="New Number to Add" value={newNumber} onChange={setNewNumber} />
            )}
            {mode === "find-count" && (
              <>
                <SolverInput label="Total Sum" value={total} onChange={setTotal} />
                <SolverInput label="Average" value={average} onChange={setAverage} />
              </>
            )}
          </div>
        </InputPanel>
      }
      results={
        <SolverCard>
          <StepsDisplay steps={result.steps} />
          <ResultBox label="Result" value={result.value} />
        </SolverCard>
      }
    />
  );
}

// ─── 9. Mixture Solver ────────────────────────────────────────────────────────
function MixtureSolver() {
  const [mode, setMode] = useState("find-mix-price");
  const [currency, setCurrency] = useState("₹");
  const [priceA, setPriceA] = useState("60");
  const [priceB, setPriceB] = useState("80");
  const [qtyA, setQtyA] = useState("3");
  const [qtyB, setQtyB] = useState("2");
  const [mixPrice, setMixPrice] = useState("68");

  const result = useMemo(() => {
    const pA = parseFloat(priceA) || 0;
    const pB = parseFloat(priceB) || 0;
    const qA = parseFloat(qtyA) || 0;
    const qB = parseFloat(qtyB) || 0;
    const mp = parseFloat(mixPrice) || 0;

    switch (mode) {
      case "find-mix-price": {
        const totalQty = qA + qB;
        if (totalQty === 0) return { value: "—", steps: [] };
        const totalCost = pA * qA + pB * qB;
        const res = totalCost / totalQty;
        return {
          value: `${currency}${fmt(res)} per unit`,
          steps: [
            `Item A: ${currency}${fmt(pA)}/unit × ${fmt(qA)} = ${currency}${fmt(pA * qA)}`,
            `Item B: ${currency}${fmt(pB)}/unit × ${fmt(qB)} = ${currency}${fmt(pB * qB)}`,
            `Total cost = ${currency}${fmt(pA * qA)} + ${currency}${fmt(pB * qB)} = ${currency}${fmt(totalCost)}`,
            `Total quantity = ${fmt(qA)} + ${fmt(qB)} = ${fmt(totalQty)}`,
            `Mixture price = ${currency}${fmt(totalCost)} ÷ ${fmt(totalQty)} = ${currency}${fmt(res)} per unit`,
          ],
        };
      }
      case "find-ratio": {
        const diffB = Math.abs(pB - mp);
        const diffA = Math.abs(mp - pA);
        if (diffA === 0 && diffB === 0) return { value: "—", steps: [] };
        return {
          value: `${fmt(diffB)} : ${fmt(diffA)}`,
          steps: [
            `Price of A = ${currency}${fmt(pA)}, Price of B = ${currency}${fmt(pB)}`,
            `Mixture price = ${currency}${fmt(mp)}`,
            `Alligation cross method:`,
            `Ratio of A : B = |${currency}${fmt(pB)} - ${currency}${fmt(mp)}| : |${currency}${fmt(mp)} - ${currency}${fmt(pA)}|`,
            `= ${fmt(diffB)} : ${fmt(diffA)}`,
          ],
        };
      }
      case "dilution": {
        const totalQty = qA + qB;
        if (totalQty === 0) return { value: "—", steps: [] };
        const totalCost = pA * qA;
        const res = totalCost / totalQty;
        return {
          value: `${currency}${fmt(res)} per unit`,
          steps: [
            `Item: ${currency}${fmt(pA)}/unit × ${fmt(qA)} units = ${currency}${fmt(pA * qA)}`,
            `Water/free item: ${fmt(qB)} units at ${currency}0`,
            `Total mixture = ${fmt(qA)} + ${fmt(qB)} = ${fmt(totalQty)} units`,
            `New price = ${currency}${fmt(totalCost)} ÷ ${fmt(totalQty)} = ${currency}${fmt(res)} per unit`,
          ],
        };
      }
      default:
        return { value: "—", steps: [] };
    }
  }, [mode, priceA, priceB, qtyA, qtyB, mixPrice, currency]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Mixture & Alligation Solver" icon={FlaskConical} iconColor="bg-orange-500">
          <ModeToggle
            modes={[
              { id: "find-mix-price", label: "Mix Price" },
              { id: "find-ratio", label: "Find Ratio" },
              { id: "dilution", label: "Dilution" },
            ]}
            mode={mode} setMode={setMode}
          />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Currency</span>
            <CurrencySelector currency={currency} setCurrency={setCurrency} />
          </div>
          <div className="space-y-3">
            {mode === "find-mix-price" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <SolverInput label={`Price A (${currency})`} value={priceA} onChange={setPriceA} />
                  <SolverInput label="Qty A" value={qtyA} onChange={setQtyA} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <SolverInput label={`Price B (${currency})`} value={priceB} onChange={setPriceB} />
                  <SolverInput label="Qty B" value={qtyB} onChange={setQtyB} />
                </div>
              </>
            )}
            {mode === "find-ratio" && (
              <>
                <SolverInput label={`Price A (${currency})`} value={priceA} onChange={setPriceA} />
                <SolverInput label={`Price B (${currency})`} value={priceB} onChange={setPriceB} />
                <SolverInput label={`Mixture Price (${currency})`} value={mixPrice} onChange={setMixPrice} />
              </>
            )}
            {mode === "dilution" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <SolverInput label={`Item Price (${currency})`} value={priceA} onChange={setPriceA} />
                  <SolverInput label="Item Qty" value={qtyA} onChange={setQtyA} />
                </div>
                <SolverInput label="Water/Free Qty" value={qtyB} onChange={setQtyB} />
              </>
            )}
          </div>
        </InputPanel>
      }
      results={
        <SolverCard>
          <StepsDisplay steps={result.steps} />
          <ResultBox label="Result" value={result.value} />
        </SolverCard>
      }
    />
  );
}

// ─── 10. Rate Solver ──────────────────────────────────────────────────────────
function RateSolver() {
  const [mode, setMode] = useState("find-rate");
  const [totalVal, setTotalVal] = useState("500");
  const [timeQty, setTimeQty] = useState("5");
  const [rate, setRate] = useState("100");
  const [unitLabel, setUnitLabel] = useState("₹/hour");

  const unitOpts = [
    { value: "₹/hour", label: "₹/hour" }, { value: "$/hour", label: "$/hour" },
    { value: "items/day", label: "items/day" }, { value: "km/liter", label: "km/liter" },
    { value: "pages/hour", label: "pages/hour" }, { value: "units/min", label: "units/min" },
  ];

  const result = useMemo(() => {
    const t = parseFloat(totalVal) || 0;
    const tq = parseFloat(timeQty) || 0;
    const r = parseFloat(rate) || 0;

    switch (mode) {
      case "find-rate": {
        if (tq === 0) return { value: "—", steps: [] };
        const res = t / tq;
        return {
          value: `${fmt(res)} ${unitLabel}`,
          steps: [
            `Formula: Rate = Total ÷ Time/Quantity`,
            `Rate = ${fmt(t)} ÷ ${fmt(tq)} = ${fmt(res)} ${unitLabel}`,
          ],
        };
      }
      case "find-total": {
        const res = r * tq;
        return {
          value: fmt(res),
          steps: [
            `Formula: Total = Rate × Time/Quantity`,
            `Total = ${fmt(r)} × ${fmt(tq)} = ${fmt(res)}`,
          ],
        };
      }
      case "find-time": {
        if (r === 0) return { value: "—", steps: [] };
        const res = t / r;
        return {
          value: fmt(res),
          steps: [
            `Formula: Time/Qty = Total ÷ Rate`,
            `= ${fmt(t)} ÷ ${fmt(r)} = ${fmt(res)}`,
          ],
        };
      }
      default:
        return { value: "—", steps: [] };
    }
  }, [mode, totalVal, timeQty, rate, unitLabel]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Rate Solver (General)" icon={Zap} iconColor="bg-orange-500">
          <ModeToggle
            modes={[
              { id: "find-rate", label: "Find Rate" },
              { id: "find-total", label: "Find Total" },
              { id: "find-time", label: "Find Time/Qty" },
            ]}
            mode={mode} setMode={setMode}
          />
          <div className="space-y-3">
            <SolverSelect label="Unit Label" value={unitLabel} onChange={setUnitLabel} options={unitOpts} />
            {mode === "find-rate" && (
              <>
                <SolverInput label="Total" value={totalVal} onChange={setTotalVal} />
                <SolverInput label="Time / Quantity" value={timeQty} onChange={setTimeQty} />
              </>
            )}
            {mode === "find-total" && (
              <>
                <SolverInput label="Rate" value={rate} onChange={setRate} />
                <SolverInput label="Time / Quantity" value={timeQty} onChange={setTimeQty} />
              </>
            )}
            {mode === "find-time" && (
              <>
                <SolverInput label="Total" value={totalVal} onChange={setTotalVal} />
                <SolverInput label="Rate" value={rate} onChange={setRate} />
              </>
            )}
          </div>
        </InputPanel>
      }
      results={
        <SolverCard>
          <StepsDisplay steps={result.steps} />
          <ResultBox label="Result" value={result.value} />
        </SolverCard>
      }
    />
  );
}

// ─── 11. Basic Solver ─────────────────────────────────────────────────────────
function BasicSolver() {
  const [mode, setMode] = useState("grouping");
  const [total, setTotal] = useState("48");
  const [groupSize, setGroupSize] = useState("6");
  const [numGroups, setNumGroups] = useState("8");
  const [perGroup, setPerGroup] = useState("5");
  const [resultVal, setResultVal] = useState("40");
  const [factor, setFactor] = useState("8");

  const result = useMemo(() => {
    const t = parseFloat(total) || 0;
    const gs = parseFloat(groupSize) || 0;
    const ng = parseFloat(numGroups) || 0;
    const pg = parseFloat(perGroup) || 0;
    const rv = parseFloat(resultVal) || 0;
    const f = parseFloat(factor) || 0;

    switch (mode) {
      case "grouping": {
        if (gs === 0) return { value: "—", steps: [] };
        const groups = t / gs;
        const remainder = t % gs;
        return {
          value: `${fmt(Math.floor(groups))} groups${remainder > 0 ? ` (${fmt(remainder)} remaining)` : ""}`,
          steps: [
            `Total items = ${fmt(t)}`,
            `Group size = ${fmt(gs)}`,
            `Number of groups = ${fmt(t)} ÷ ${fmt(gs)} = ${fmt(groups)}`,
            ...(remainder > 0 ? [`Remainder = ${fmt(remainder)}`] : []),
          ],
        };
      }
      case "sharing": {
        if (gs === 0) return { value: "—", steps: [] };
        const each = t / gs;
        return {
          value: `${fmt(each)} each`,
          steps: [
            `Total = ${fmt(t)}`,
            `Number of people = ${fmt(gs)}`,
            `Each gets = ${fmt(t)} ÷ ${fmt(gs)} = ${fmt(each)}`,
          ],
        };
      }
      case "multiplication": {
        const res = ng * pg;
        return {
          value: fmt(res),
          steps: [
            `Number of groups = ${fmt(ng)}`,
            `Items per group = ${fmt(pg)}`,
            `Total = ${fmt(ng)} × ${fmt(pg)} = ${fmt(res)}`,
          ],
        };
      }
      case "reverse": {
        if (f === 0) return { value: "—", steps: [] };
        const other = rv / f;
        return {
          value: fmt(other),
          steps: [
            `Result = ${fmt(rv)}`,
            `Known factor = ${fmt(f)}`,
            `Other factor = ${fmt(rv)} ÷ ${fmt(f)} = ${fmt(other)}`,
          ],
        };
      }
      default:
        return { value: "—", steps: [] };
    }
  }, [mode, total, groupSize, numGroups, perGroup, resultVal, factor]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Basic Word Problems (Level 1)" icon={Calculator} iconColor="bg-orange-500">
          <ModeToggle
            modes={[
              { id: "grouping", label: "Grouping" },
              { id: "sharing", label: "Sharing" },
              { id: "multiplication", label: "Multiply" },
              { id: "reverse", label: "Reverse" },
            ]}
            mode={mode} setMode={setMode}
          />
          <div className="space-y-3">
            {mode === "grouping" && (
              <>
                <SolverInput label="Total Items" value={total} onChange={setTotal} />
                <SolverInput label="Group Size" value={groupSize} onChange={setGroupSize} />
              </>
            )}
            {mode === "sharing" && (
              <>
                <SolverInput label="Total to Share" value={total} onChange={setTotal} />
                <SolverInput label="Number of People" value={groupSize} onChange={setGroupSize} />
              </>
            )}
            {mode === "multiplication" && (
              <>
                <SolverInput label="Number of Groups" value={numGroups} onChange={setNumGroups} />
                <SolverInput label="Items per Group" value={perGroup} onChange={setPerGroup} />
              </>
            )}
            {mode === "reverse" && (
              <>
                <SolverInput label="Result" value={resultVal} onChange={setResultVal} />
                <SolverInput label="Known Factor" value={factor} onChange={setFactor} />
              </>
            )}
          </div>
        </InputPanel>
      }
      results={
        <SolverCard>
          <StepsDisplay steps={result.steps} />
          <ResultBox label="Answer" value={result.value} />
        </SolverCard>
      }
    />
  );
}

// ─── 12. Volume Solver ────────────────────────────────────────────────────────
function VolumeSolver() {
  const [mode, setMode] = useState("convert");
  const [currency, setCurrency] = useState("₹");
  const [fromUnit, setFromUnit] = useState("l");
  const [toUnit, setToUnit] = useState("ml");
  const [value, setValue] = useState("5");
  const [totalVol, setTotalVol] = useState("10");
  const [totalPrice, setTotalPrice] = useState("200");
  const [reqVol, setReqVol] = useState("3");
  const [budget, setBudget] = useState("500");
  const [containerVol, setContainerVol] = useState("2");
  const [containerUnit, setContainerUnit] = useState("l");
  const [fillVol, setFillVol] = useState("15");
  const [fillUnit, setFillUnit] = useState("l");
  const [mixQtyA, setMixQtyA] = useState("3");
  const [mixUnitA, setMixUnitA] = useState("l");
  const [mixQtyB, setMixQtyB] = useState("2");
  const [mixUnitB, setMixUnitB] = useState("l");
  const [resultUnit, setResultUnit] = useState("l");

  const getF = (u: string) => VOLUME_UNITS.find(x => x.value === u)?.factor || 1;
  const getLabel = (u: string) => VOLUME_UNITS.find(x => x.value === u)?.label || u;

  const result = useMemo(() => {
    switch (mode) {
      case "convert": {
        const v = parseFloat(value) || 0;
        const liters = v * getF(fromUnit);
        const converted = liters / getF(toUnit);
        return {
          value: `${fmt(converted)} ${toUnit}`,
          steps: [
            `Input: ${fmt(v)} ${getLabel(fromUnit)}`,
            `Convert to liters: ${fmt(v)} × ${getF(fromUnit)} = ${fmt(liters)} L`,
            `Convert to ${getLabel(toUnit)}: ${fmt(liters)} ÷ ${getF(toUnit)} = ${fmt(converted)}`,
          ],
        };
      }
      case "price-per-vol": {
        const tv = parseFloat(totalVol) || 0;
        const tp = parseFloat(totalPrice) || 0;
        const rq = parseFloat(reqVol) || 0;
        if (tv === 0) return { value: "—", steps: [] };
        const pricePerUnit = tp / tv;
        const reqPrice = pricePerUnit * rq;
        return {
          value: `${currency}${fmt(reqPrice)}`,
          steps: [
            `Total volume: ${fmt(tv)} ${fromUnit}`,
            `Total price: ${currency}${fmt(tp)}`,
            `Price per ${fromUnit}: ${currency}${fmt(tp)} ÷ ${fmt(tv)} = ${currency}${fmt(pricePerUnit)}`,
            `Cost for ${fmt(rq)} ${fromUnit}: ${currency}${fmt(pricePerUnit)} × ${fmt(rq)} = ${currency}${fmt(reqPrice)}`,
          ],
        };
      }
      case "reverse-vol": {
        const tp = parseFloat(totalPrice) || 0;
        const tv = parseFloat(totalVol) || 0;
        const bd = parseFloat(budget) || 0;
        if (tv === 0 || tp === 0) return { value: "—", steps: [] };
        const pricePerUnit = tp / tv;
        const canBuy = bd / pricePerUnit;
        return {
          value: `${fmt(canBuy)} ${fromUnit}`,
          steps: [
            `Price for ${fmt(tv)} ${fromUnit} = ${currency}${fmt(tp)}`,
            `Price per ${fromUnit}: ${currency}${fmt(tp)} ÷ ${fmt(tv)} = ${currency}${fmt(pricePerUnit)}`,
            `Budget: ${currency}${fmt(bd)}`,
            `Volume you can get: ${currency}${fmt(bd)} ÷ ${currency}${fmt(pricePerUnit)} = ${fmt(canBuy)} ${fromUnit}`,
          ],
        };
      }
      case "containers": {
        const cv = parseFloat(containerVol) || 0;
        const fv = parseFloat(fillVol) || 0;
        if (cv === 0) return { value: "—", steps: [] };
        const cvLiters = cv * getF(containerUnit);
        const fvLiters = fv * getF(fillUnit);
        const containers = fvLiters / cvLiters;
        const remainder = fvLiters % cvLiters;
        const remConverted = remainder / getF(containerUnit);
        return {
          value: `${Math.floor(containers)} containers${remainder > 0.001 ? ` + ${fmt(remConverted)} ${containerUnit} left` : ""}`,
          steps: [
            `Container size: ${fmt(cv)} ${getLabel(containerUnit)} = ${fmt(cvLiters)} L`,
            `Total to fill: ${fmt(fv)} ${getLabel(fillUnit)} = ${fmt(fvLiters)} L`,
            `Containers needed: ${fmt(fvLiters)} ÷ ${fmt(cvLiters)} = ${fmt(containers)}`,
            ...(remainder > 0.001 ? [`Remaining: ${fmt(remConverted)} ${containerUnit}`] : []),
          ],
        };
      }
      case "mix": {
        const qa = parseFloat(mixQtyA) || 0;
        const qb = parseFloat(mixQtyB) || 0;
        const aLiters = qa * getF(mixUnitA);
        const bLiters = qb * getF(mixUnitB);
        const totalLiters = aLiters + bLiters;
        const converted = totalLiters / getF(resultUnit);
        const ratioA = aLiters / (totalLiters || 1);
        const ratioB = bLiters / (totalLiters || 1);
        return {
          value: `${fmt(converted)} ${resultUnit}`,
          steps: [
            `Liquid A: ${fmt(qa)} ${getLabel(mixUnitA)} = ${fmt(aLiters)} L`,
            `Liquid B: ${fmt(qb)} ${getLabel(mixUnitB)} = ${fmt(bLiters)} L`,
            `Total: ${fmt(aLiters)} + ${fmt(bLiters)} = ${fmt(totalLiters)} L`,
            `In ${getLabel(resultUnit)}: ${fmt(converted)}`,
            `Ratio A:B = ${fmt(ratioA * 100)}% : ${fmt(ratioB * 100)}%`,
          ],
        };
      }
      default: return { value: "—", steps: [] };
    }
  }, [mode, value, fromUnit, toUnit, totalVol, totalPrice, reqVol, budget, currency, containerVol, containerUnit, fillVol, fillUnit, mixQtyA, mixUnitA, mixQtyB, mixUnitB, resultUnit]);

  const unitOptions = VOLUME_UNITS.map(u => ({ value: u.value, label: u.label }));

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Volume Word Problem Solver" icon={Droplets} iconColor="bg-orange-500">
          <ModeToggle
            modes={[
              { id: "convert", label: "Convert" },
              { id: "price-per-vol", label: "Price/Vol" },
              { id: "reverse-vol", label: "Reverse" },
              { id: "containers", label: "Containers" },
              { id: "mix", label: "Mix Liquids" },
            ]}
            mode={mode} setMode={setMode}
          />
          <div className="space-y-3">
            {mode === "convert" && (
              <>
                <SolverInput label="Value" value={value} onChange={setValue} />
                <SolverSelect label="From Unit" value={fromUnit} onChange={setFromUnit} options={unitOptions} />
                <SolverSelect label="To Unit" value={toUnit} onChange={setToUnit} options={unitOptions} />
              </>
            )}
            {mode === "price-per-vol" && (
              <>
                <div className="flex justify-end"><CurrencySelector currency={currency} setCurrency={setCurrency} /></div>
                <SolverInput label="Total Volume" value={totalVol} onChange={setTotalVol} />
                <SolverSelect label="Volume Unit" value={fromUnit} onChange={setFromUnit} options={unitOptions} />
                <SolverInput label={`Total Price (${currency})`} value={totalPrice} onChange={setTotalPrice} />
                <SolverInput label={`Required Volume (${fromUnit})`} value={reqVol} onChange={setReqVol} />
              </>
            )}
            {mode === "reverse-vol" && (
              <>
                <div className="flex justify-end"><CurrencySelector currency={currency} setCurrency={setCurrency} /></div>
                <SolverInput label="Total Volume" value={totalVol} onChange={setTotalVol} />
                <SolverSelect label="Volume Unit" value={fromUnit} onChange={setFromUnit} options={unitOptions} />
                <SolverInput label={`Total Price (${currency})`} value={totalPrice} onChange={setTotalPrice} />
                <SolverInput label={`Your Budget (${currency})`} value={budget} onChange={setBudget} />
              </>
            )}
            {mode === "containers" && (
              <>
                <SolverInput label="Container Size" value={containerVol} onChange={setContainerVol} />
                <SolverSelect label="Container Unit" value={containerUnit} onChange={setContainerUnit} options={unitOptions} />
                <SolverInput label="Total Volume to Fill" value={fillVol} onChange={setFillVol} />
                <SolverSelect label="Fill Unit" value={fillUnit} onChange={setFillUnit} options={unitOptions} />
              </>
            )}
            {mode === "mix" && (
              <>
                <SolverInput label="Liquid A Quantity" value={mixQtyA} onChange={setMixQtyA} />
                <SolverSelect label="Liquid A Unit" value={mixUnitA} onChange={setMixUnitA} options={unitOptions} />
                <SolverInput label="Liquid B Quantity" value={mixQtyB} onChange={setMixQtyB} />
                <SolverSelect label="Liquid B Unit" value={mixUnitB} onChange={setMixUnitB} options={unitOptions} />
                <SolverSelect label="Result Unit" value={resultUnit} onChange={setResultUnit} options={unitOptions} />
              </>
            )}
          </div>
        </InputPanel>
      }
      results={
        <SolverCard>
          <StepsDisplay steps={result.steps} />
          <ResultBox label="Answer" value={result.value} />
        </SolverCard>
      }
    />
  );
}

// ─── 13. Length Solver ────────────────────────────────────────────────────────
function LengthSolver() {
  const [mode, setMode] = useState("convert");
  const [currency, setCurrency] = useState("₹");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [value, setValue] = useState("10");
  const [totalLen, setTotalLen] = useState("100");
  const [totalPrice, setTotalPrice] = useState("500");
  const [reqLen, setReqLen] = useState("25");
  const [budget, setBudget] = useState("1000");
  const [pieceLen, setPieceLen] = useState("2.5");
  const [pieceUnit, setPieceUnit] = useState("m");
  const [totalRod, setTotalRod] = useState("20");
  const [rodUnit, setRodUnit] = useState("m");
  const [perimSides, setPerimSides] = useState("4");
  const [perimLen, setPerimLen] = useState("10");
  const [perimUnit, setPerimUnit] = useState("m");
  const [resultPUnit, setResultPUnit] = useState("m");

  const getF = (u: string) => LENGTH_UNITS.find(x => x.value === u)?.factor || 1;
  const getLabel = (u: string) => LENGTH_UNITS.find(x => x.value === u)?.label || u;

  const result = useMemo(() => {
    switch (mode) {
      case "convert": {
        const v = parseFloat(value) || 0;
        const meters = v * getF(fromUnit);
        const converted = meters / getF(toUnit);
        return {
          value: `${fmt(converted)} ${toUnit}`,
          steps: [
            `Input: ${fmt(v)} ${getLabel(fromUnit)}`,
            `Convert to meters: ${fmt(v)} × ${getF(fromUnit)} = ${fmt(meters)} m`,
            `Convert to ${getLabel(toUnit)}: ${fmt(meters)} ÷ ${getF(toUnit)} = ${fmt(converted)}`,
          ],
        };
      }
      case "price-per-len": {
        const tl = parseFloat(totalLen) || 0;
        const tp = parseFloat(totalPrice) || 0;
        const rq = parseFloat(reqLen) || 0;
        if (tl === 0) return { value: "—", steps: [] };
        const pricePerUnit = tp / tl;
        const reqPrice = pricePerUnit * rq;
        return {
          value: `${currency}${fmt(reqPrice)}`,
          steps: [
            `Total length: ${fmt(tl)} ${fromUnit}`,
            `Total price: ${currency}${fmt(tp)}`,
            `Price per ${fromUnit}: ${currency}${fmt(tp)} ÷ ${fmt(tl)} = ${currency}${fmt(pricePerUnit)}`,
            `Cost for ${fmt(rq)} ${fromUnit}: ${currency}${fmt(pricePerUnit)} × ${fmt(rq)} = ${currency}${fmt(reqPrice)}`,
          ],
        };
      }
      case "reverse-len": {
        const tp = parseFloat(totalPrice) || 0;
        const tl = parseFloat(totalLen) || 0;
        const bd = parseFloat(budget) || 0;
        if (tl === 0 || tp === 0) return { value: "—", steps: [] };
        const pricePerUnit = tp / tl;
        const canBuy = bd / pricePerUnit;
        return {
          value: `${fmt(canBuy)} ${fromUnit}`,
          steps: [
            `Price for ${fmt(tl)} ${fromUnit} = ${currency}${fmt(tp)}`,
            `Price per ${fromUnit}: ${currency}${fmt(tp)} ÷ ${fmt(tl)} = ${currency}${fmt(pricePerUnit)}`,
            `Budget: ${currency}${fmt(bd)}`,
            `Length you can buy: ${currency}${fmt(bd)} ÷ ${currency}${fmt(pricePerUnit)} = ${fmt(canBuy)} ${fromUnit}`,
          ],
        };
      }
      case "cut-pieces": {
        const pl = parseFloat(pieceLen) || 0;
        const tr = parseFloat(totalRod) || 0;
        if (pl === 0) return { value: "—", steps: [] };
        const plMeters = pl * getF(pieceUnit);
        const trMeters = tr * getF(rodUnit);
        const pieces = trMeters / plMeters;
        const remainder = trMeters % plMeters;
        const remDisplay = remainder / getF(pieceUnit);
        return {
          value: `${Math.floor(pieces)} pieces${remainder > 0.0001 ? ` + ${fmt(remDisplay)} ${pieceUnit} leftover` : ""}`,
          steps: [
            `Total material: ${fmt(tr)} ${getLabel(rodUnit)} = ${fmt(trMeters)} m`,
            `Each piece: ${fmt(pl)} ${getLabel(pieceUnit)} = ${fmt(plMeters)} m`,
            `Pieces = ${fmt(trMeters)} ÷ ${fmt(plMeters)} = ${fmt(pieces)}`,
            ...(remainder > 0.0001 ? [`Leftover = ${fmt(remDisplay)} ${pieceUnit}`] : []),
          ],
        };
      }
      case "perimeter": {
        const sides = parseInt(perimSides) || 0;
        const sideLen = parseFloat(perimLen) || 0;
        const sideLenM = sideLen * getF(perimUnit);
        const perimM = sides * sideLenM;
        const perimResult = perimM / getF(resultPUnit);
        return {
          value: `${fmt(perimResult)} ${resultPUnit}`,
          steps: [
            `Number of sides: ${sides}`,
            `Each side: ${fmt(sideLen)} ${getLabel(perimUnit)} = ${fmt(sideLenM)} m`,
            `Perimeter = ${sides} × ${fmt(sideLenM)} = ${fmt(perimM)} m`,
            `In ${getLabel(resultPUnit)}: ${fmt(perimResult)}`,
          ],
        };
      }
      default: return { value: "—", steps: [] };
    }
  }, [mode, value, fromUnit, toUnit, totalLen, totalPrice, reqLen, budget, currency, pieceLen, pieceUnit, totalRod, rodUnit, perimSides, perimLen, perimUnit, resultPUnit]);

  const unitOptions = LENGTH_UNITS.map(u => ({ value: u.value, label: u.label }));

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Length Word Problem Solver" icon={Ruler} iconColor="bg-orange-500">
          <ModeToggle
            modes={[
              { id: "convert", label: "Convert" },
              { id: "price-per-len", label: "Price/Len" },
              { id: "reverse-len", label: "Reverse" },
              { id: "cut-pieces", label: "Cut Pieces" },
              { id: "perimeter", label: "Perimeter" },
            ]}
            mode={mode} setMode={setMode}
          />
          <div className="space-y-3">
            {mode === "convert" && (
              <>
                <SolverInput label="Value" value={value} onChange={setValue} />
                <SolverSelect label="From Unit" value={fromUnit} onChange={setFromUnit} options={unitOptions} />
                <SolverSelect label="To Unit" value={toUnit} onChange={setToUnit} options={unitOptions} />
              </>
            )}
            {mode === "price-per-len" && (
              <>
                <div className="flex justify-end"><CurrencySelector currency={currency} setCurrency={setCurrency} /></div>
                <SolverInput label="Total Length" value={totalLen} onChange={setTotalLen} />
                <SolverSelect label="Length Unit" value={fromUnit} onChange={setFromUnit} options={unitOptions} />
                <SolverInput label={`Total Price (${currency})`} value={totalPrice} onChange={setTotalPrice} />
                <SolverInput label={`Required Length (${fromUnit})`} value={reqLen} onChange={setReqLen} />
              </>
            )}
            {mode === "reverse-len" && (
              <>
                <div className="flex justify-end"><CurrencySelector currency={currency} setCurrency={setCurrency} /></div>
                <SolverInput label="Total Length" value={totalLen} onChange={setTotalLen} />
                <SolverSelect label="Length Unit" value={fromUnit} onChange={setFromUnit} options={unitOptions} />
                <SolverInput label={`Total Price (${currency})`} value={totalPrice} onChange={setTotalPrice} />
                <SolverInput label={`Your Budget (${currency})`} value={budget} onChange={setBudget} />
              </>
            )}
            {mode === "cut-pieces" && (
              <>
                <SolverInput label="Total Material Length" value={totalRod} onChange={setTotalRod} />
                <SolverSelect label="Material Unit" value={rodUnit} onChange={setRodUnit} options={unitOptions} />
                <SolverInput label="Each Piece Length" value={pieceLen} onChange={setPieceLen} />
                <SolverSelect label="Piece Unit" value={pieceUnit} onChange={setPieceUnit} options={unitOptions} />
              </>
            )}
            {mode === "perimeter" && (
              <>
                <SolverInput label="Number of Sides" value={perimSides} onChange={setPerimSides} />
                <SolverInput label="Side Length" value={perimLen} onChange={setPerimLen} />
                <SolverSelect label="Side Unit" value={perimUnit} onChange={setPerimUnit} options={unitOptions} />
                <SolverSelect label="Result Unit" value={resultPUnit} onChange={setResultPUnit} options={unitOptions} />
              </>
            )}
          </div>
        </InputPanel>
      }
      results={
        <SolverCard>
          <StepsDisplay steps={result.steps} />
          <ResultBox label="Answer" value={result.value} />
        </SolverCard>
      }
    />
  );
}

// ─── 14. Weight Solver ────────────────────────────────────────────────────────
function WeightSolver() {
  const [mode, setMode] = useState("convert");
  const [currency, setCurrency] = useState("₹");
  const [fromUnit, setFromUnit] = useState("kg");
  const [toUnit, setToUnit] = useState("lb");
  const [value, setValue] = useState("5");
  const [totalWt, setTotalWt] = useState("10");
  const [totalPrice, setTotalPrice] = useState("500");
  const [reqWt, setReqWt] = useState("3");
  const [budget, setBudget] = useState("1000");
  const [numItems, setNumItems] = useState("6");
  const [perItemWt, setPerItemWt] = useState("250");
  const [perItemUnit, setPerItemUnit] = useState("g");
  const [resultWtUnit, setResultWtUnit] = useState("kg");
  const [packWt, setPackWt] = useState("50");
  const [packUnit, setPackUnit] = useState("kg");
  const [totalBulk, setTotalBulk] = useState("500");
  const [bulkUnit, setBulkUnit] = useState("kg");

  const getF = (u: string) => WEIGHT_UNITS.find(x => x.value === u)?.factor || 1;
  const getLabel = (u: string) => WEIGHT_UNITS.find(x => x.value === u)?.label || u;

  const result = useMemo(() => {
    switch (mode) {
      case "convert": {
        const v = parseFloat(value) || 0;
        const kg = v * getF(fromUnit);
        const converted = kg / getF(toUnit);
        return {
          value: `${fmt(converted)} ${toUnit}`,
          steps: [
            `Input: ${fmt(v)} ${getLabel(fromUnit)}`,
            `Convert to kg: ${fmt(v)} × ${getF(fromUnit)} = ${fmt(kg)} kg`,
            `Convert to ${getLabel(toUnit)}: ${fmt(kg)} ÷ ${getF(toUnit)} = ${fmt(converted)}`,
          ],
        };
      }
      case "price-per-wt": {
        const tw = parseFloat(totalWt) || 0;
        const tp = parseFloat(totalPrice) || 0;
        const rq = parseFloat(reqWt) || 0;
        if (tw === 0) return { value: "—", steps: [] };
        const pricePerUnit = tp / tw;
        const reqPrice = pricePerUnit * rq;
        return {
          value: `${currency}${fmt(reqPrice)}`,
          steps: [
            `Total weight: ${fmt(tw)} ${fromUnit}`,
            `Total price: ${currency}${fmt(tp)}`,
            `Price per ${fromUnit}: ${currency}${fmt(tp)} ÷ ${fmt(tw)} = ${currency}${fmt(pricePerUnit)}`,
            `Cost for ${fmt(rq)} ${fromUnit}: ${currency}${fmt(pricePerUnit)} × ${fmt(rq)} = ${currency}${fmt(reqPrice)}`,
          ],
        };
      }
      case "reverse-wt": {
        const tp = parseFloat(totalPrice) || 0;
        const tw = parseFloat(totalWt) || 0;
        const bd = parseFloat(budget) || 0;
        if (tw === 0 || tp === 0) return { value: "—", steps: [] };
        const pricePerUnit = tp / tw;
        const canBuy = bd / pricePerUnit;
        return {
          value: `${fmt(canBuy)} ${fromUnit}`,
          steps: [
            `Price for ${fmt(tw)} ${fromUnit} = ${currency}${fmt(tp)}`,
            `Price per ${fromUnit}: ${currency}${fmt(tp)} ÷ ${fmt(tw)} = ${currency}${fmt(pricePerUnit)}`,
            `Budget: ${currency}${fmt(bd)}`,
            `Weight you can buy: ${currency}${fmt(bd)} ÷ ${currency}${fmt(pricePerUnit)} = ${fmt(canBuy)} ${fromUnit}`,
          ],
        };
      }
      case "total-weight": {
        const ni = parseFloat(numItems) || 0;
        const pw = parseFloat(perItemWt) || 0;
        const totalKg = ni * pw * getF(perItemUnit);
        const converted = totalKg / getF(resultWtUnit);
        return {
          value: `${fmt(converted)} ${resultWtUnit}`,
          steps: [
            `Number of items: ${fmt(ni)}`,
            `Weight per item: ${fmt(pw)} ${getLabel(perItemUnit)}`,
            `Total weight = ${fmt(ni)} × ${fmt(pw)} ${perItemUnit} = ${fmt(ni * pw)} ${perItemUnit}`,
            `Convert to ${getLabel(resultWtUnit)}: ${fmt(totalKg)} kg ÷ ${getF(resultWtUnit)} = ${fmt(converted)} ${resultWtUnit}`,
          ],
        };
      }
      case "packing": {
        const pw = parseFloat(packWt) || 0;
        const tb = parseFloat(totalBulk) || 0;
        if (pw === 0) return { value: "—", steps: [] };
        const packKg = pw * getF(packUnit);
        const bulkKg = tb * getF(bulkUnit);
        const packs = bulkKg / packKg;
        const remainder = bulkKg % packKg;
        const remDisplay = remainder / getF(packUnit);
        return {
          value: `${Math.floor(packs)} packs${remainder > 0.0001 ? ` + ${fmt(remDisplay)} ${packUnit} left` : ""}`,
          steps: [
            `Each pack: ${fmt(pw)} ${getLabel(packUnit)} = ${fmt(packKg)} kg`,
            `Total bulk: ${fmt(tb)} ${getLabel(bulkUnit)} = ${fmt(bulkKg)} kg`,
            `Packs = ${fmt(bulkKg)} ÷ ${fmt(packKg)} = ${fmt(packs)}`,
            ...(remainder > 0.0001 ? [`Leftover = ${fmt(remDisplay)} ${packUnit}`] : []),
          ],
        };
      }
      default: return { value: "—", steps: [] };
    }
  }, [mode, value, fromUnit, toUnit, totalWt, totalPrice, reqWt, budget, currency, numItems, perItemWt, perItemUnit, resultWtUnit, packWt, packUnit, totalBulk, bulkUnit]);

  const unitOptions = WEIGHT_UNITS.map(u => ({ value: u.value, label: u.label }));

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Weight Word Problem Solver" icon={Weight} iconColor="bg-orange-500">
          <ModeToggle
            modes={[
              { id: "convert", label: "Convert" },
              { id: "price-per-wt", label: "Price/Wt" },
              { id: "reverse-wt", label: "Reverse" },
              { id: "total-weight", label: "Total Wt" },
              { id: "packing", label: "Packing" },
            ]}
            mode={mode} setMode={setMode}
          />
          <div className="space-y-3">
            {mode === "convert" && (
              <>
                <SolverInput label="Value" value={value} onChange={setValue} />
                <SolverSelect label="From Unit" value={fromUnit} onChange={setFromUnit} options={unitOptions} />
                <SolverSelect label="To Unit" value={toUnit} onChange={setToUnit} options={unitOptions} />
              </>
            )}
            {mode === "price-per-wt" && (
              <>
                <div className="flex justify-end"><CurrencySelector currency={currency} setCurrency={setCurrency} /></div>
                <SolverInput label="Total Weight" value={totalWt} onChange={setTotalWt} />
                <SolverSelect label="Weight Unit" value={fromUnit} onChange={setFromUnit} options={unitOptions} />
                <SolverInput label={`Total Price (${currency})`} value={totalPrice} onChange={setTotalPrice} />
                <SolverInput label={`Required Weight (${fromUnit})`} value={reqWt} onChange={setReqWt} />
              </>
            )}
            {mode === "reverse-wt" && (
              <>
                <div className="flex justify-end"><CurrencySelector currency={currency} setCurrency={setCurrency} /></div>
                <SolverInput label="Total Weight" value={totalWt} onChange={setTotalWt} />
                <SolverSelect label="Weight Unit" value={fromUnit} onChange={setFromUnit} options={unitOptions} />
                <SolverInput label={`Total Price (${currency})`} value={totalPrice} onChange={setTotalPrice} />
                <SolverInput label={`Your Budget (${currency})`} value={budget} onChange={setBudget} />
              </>
            )}
            {mode === "total-weight" && (
              <>
                <SolverInput label="Number of Items" value={numItems} onChange={setNumItems} />
                <SolverInput label="Weight per Item" value={perItemWt} onChange={setPerItemWt} />
                <SolverSelect label="Per Item Unit" value={perItemUnit} onChange={setPerItemUnit} options={unitOptions} />
                <SolverSelect label="Result Unit" value={resultWtUnit} onChange={setResultWtUnit} options={unitOptions} />
              </>
            )}
            {mode === "packing" && (
              <>
                <SolverInput label="Pack Size" value={packWt} onChange={setPackWt} />
                <SolverSelect label="Pack Unit" value={packUnit} onChange={setPackUnit} options={unitOptions} />
                <SolverInput label="Total Bulk Weight" value={totalBulk} onChange={setTotalBulk} />
                <SolverSelect label="Bulk Unit" value={bulkUnit} onChange={setBulkUnit} options={unitOptions} />
              </>
            )}
          </div>
        </InputPanel>
      }
      results={
        <SolverCard>
          <StepsDisplay steps={result.steps} />
          <ResultBox label="Answer" value={result.value} />
        </SolverCard>
      }
    />
  );
}
