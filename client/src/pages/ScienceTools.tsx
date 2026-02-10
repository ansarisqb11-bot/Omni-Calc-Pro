import { useState } from "react";
import { motion } from "framer-motion";
import { Atom, Zap, Thermometer, Scale, FlaskConical, Calculator, Droplets } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

const tools = [
  { id: "ohm", label: "Ohm's Law", icon: Zap },
  { id: "molar", label: "Molar Mass", icon: FlaskConical },
  { id: "physics", label: "Motion", icon: Atom },
  { id: "temperature", label: "Temperature", icon: Thermometer },
  { id: "density", label: "Density", icon: Scale },
  { id: "ph", label: "pH", icon: Droplets },
];

export default function ScienceTools() {
  const [activeTool, setActiveTool] = useState("ohm");

  return (
    <PageWrapper
      title="Science Tools"
      subtitle="Physics, Chemistry, and more"
      accentColor="bg-violet-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id)}
    >
      {activeTool === "ohm" && <OhmsLaw />}
      {activeTool === "molar" && <MolarMass />}
      {activeTool === "physics" && <MotionEquations />}
      {activeTool === "temperature" && <TemperatureConverter />}
      {activeTool === "density" && <DensityCalculator />}
      {activeTool === "ph" && <PHCalculator />}
    </PageWrapper>
  );
}

function OhmsLaw() {
  const [voltage, setVoltage] = useState("");
  const [current, setCurrent] = useState("");
  const [resistance, setResistance] = useState("");
  const [result, setResult] = useState<{ type: string; value: number; unit: string } | null>(null);

  const calculate = () => {
    const v = parseFloat(voltage) || 0;
    const i = parseFloat(current) || 0;
    const r = parseFloat(resistance) || 0;

    if (v && i && !r) {
      setResult({ type: "Resistance", value: v / i, unit: "Ohms" });
    } else if (v && r && !i) {
      setResult({ type: "Current", value: v / r, unit: "Amps" });
    } else if (i && r && !v) {
      setResult({ type: "Voltage", value: i * r, unit: "Volts" });
    } else {
      setResult(null);
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Ohm's Law (V = I x R)" icon={Zap} iconColor="bg-yellow-500">
        <p className="text-muted-foreground text-sm mb-4">Enter any two values to calculate the third</p>
        <div className="space-y-4">
          <InputField label="Voltage (V)" value={voltage} onChange={setVoltage} type="number" suffix="V" />
          <InputField label="Current (I)" value={current} onChange={setCurrent} type="number" suffix="A" />
          <InputField label="Resistance (R)" value={resistance} onChange={setResistance} type="number" suffix="Ohm" />
          <ToolButton onClick={calculate} className="bg-yellow-500 hover:bg-yellow-600 text-black">Calculate</ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Result" icon={Calculator} iconColor="bg-emerald-500">
            <div className="text-center py-4">
              <p className="text-muted-foreground">{result.type}</p>
              <p className="text-4xl font-bold text-yellow-400">{result.value.toFixed(4)} {result.unit}</p>
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function MolarMass() {
  const [element, setElement] = useState("H2O");
  const [result, setResult] = useState<number | null>(null);

  const masses: Record<string, number> = {
    H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.81, C: 12.01, N: 14.01, O: 16.00,
    F: 19.00, Ne: 20.18, Na: 22.99, Mg: 24.31, Al: 26.98, Si: 28.09, P: 30.97, S: 32.07,
    Cl: 35.45, Ar: 39.95, K: 39.10, Ca: 40.08, Fe: 55.85, Cu: 63.55, Zn: 65.38, Br: 79.90, I: 126.9
  };

  const calculate = () => {
    let total = 0;
    const regex = /([A-Z][a-z]?)(\d*)/g;
    let match;
    while ((match = regex.exec(element)) !== null) {
      const el = match[1];
      const count = parseInt(match[2]) || 1;
      if (masses[el]) total += masses[el] * count;
    }
    setResult(total);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Molar Mass Calculator" icon={FlaskConical} iconColor="bg-green-500">
        <div className="space-y-4">
          <InputField label="Chemical Formula" value={element} onChange={setElement} placeholder="e.g., H2O, NaCl, C6H12O6" />
          <ToolButton onClick={calculate} className="bg-green-500 hover:bg-green-600">Calculate</ToolButton>
        </div>
      </ToolCard>

      {result !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Molar Mass" icon={Scale} iconColor="bg-emerald-500">
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-green-400">{result.toFixed(3)} g/mol</p>
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function MotionEquations() {
  const [u, setU] = useState("0");
  const [a, setA] = useState("10");
  const [t, setT] = useState("5");

  const initial = parseFloat(u) || 0;
  const accel = parseFloat(a) || 0;
  const time = parseFloat(t) || 0;

  const v = initial + accel * time;
  const s = initial * time + 0.5 * accel * time * time;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Motion Equations" icon={Atom} iconColor="bg-purple-500">
        <div className="space-y-4">
          <InputField label="Initial Velocity (u)" value={u} onChange={setU} type="number" suffix="m/s" />
          <InputField label="Acceleration (a)" value={a} onChange={setA} type="number" suffix="m/s2" />
          <InputField label="Time (t)" value={t} onChange={setT} type="number" suffix="s" />
        </div>
      </ToolCard>

      <ToolCard title="Results" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Final Velocity (v = u + at)" value={`${v.toFixed(2)} m/s`} highlight color="text-purple-400" />
          <ResultDisplay label="Distance (s = ut + 0.5at2)" value={`${s.toFixed(2)} m`} color="text-blue-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function TemperatureConverter() {
  const [celsius, setCelsius] = useState("25");

  const c = parseFloat(celsius) || 0;
  const f = (c * 9/5) + 32;
  const k = c + 273.15;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Temperature Converter" icon={Thermometer} iconColor="bg-red-500">
        <div className="space-y-4">
          <InputField label="Celsius" value={celsius} onChange={setCelsius} type="number" suffix="C" />
        </div>
      </ToolCard>

      <ToolCard title="Conversions" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Fahrenheit" value={`${f.toFixed(2)} F`} highlight color="text-red-400" />
          <ResultDisplay label="Kelvin" value={`${k.toFixed(2)} K`} color="text-blue-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function DensityCalculator() {
  const [mass, setMass] = useState("100");
  const [volume, setVolume] = useState("10");

  const m = parseFloat(mass) || 0;
  const v = parseFloat(volume) || 1;
  const density = m / v;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Density Calculator" icon={Scale} iconColor="bg-teal-500">
        <div className="space-y-4">
          <InputField label="Mass" value={mass} onChange={setMass} type="number" suffix="g" />
          <InputField label="Volume" value={volume} onChange={setVolume} type="number" suffix="cm3" />
        </div>
      </ToolCard>

      <ToolCard title="Result" icon={Calculator} iconColor="bg-emerald-500">
        <div className="text-center py-4">
          <p className="text-muted-foreground">Density = Mass / Volume</p>
          <p className="text-4xl font-bold text-teal-400">{density.toFixed(4)} g/cm3</p>
        </div>
      </ToolCard>
    </div>
  );
}

function PHCalculator() {
  const [mode, setMode] = useState<"ph-to-h" | "h-to-ph" | "dilution" | "buffer">("ph-to-h");
  const [phValue, setPhValue] = useState("7");
  const [hConc, setHConc] = useState("0.001");
  const [c1, setC1] = useState("0.1");
  const [v1, setV1] = useState("50");
  const [v2, setV2] = useState("500");
  const [pka, setPka] = useState("4.76");
  const [acidConc, setAcidConc] = useState("0.1");
  const [baseConc, setBaseConc] = useState("0.15");

  const modes = [
    { id: "ph-to-h", label: "pH \u2192 [H\u207A]" },
    { id: "h-to-ph", label: "[H\u207A] \u2192 pH" },
    { id: "dilution", label: "Dilution" },
    { id: "buffer", label: "Buffer pH" },
  ];

  const fmt = (n: number, d = 4) => {
    if (isNaN(n) || !isFinite(n)) return "\u2014";
    return parseFloat(n.toFixed(d)).toString();
  };

  const getCategory = (ph: number) => {
    if (ph < 3) return "Strongly Acidic";
    if (ph < 6) return "Weakly Acidic";
    if (ph < 6.5) return "Slightly Acidic";
    if (ph <= 7.5) return "Neutral";
    if (ph <= 8) return "Slightly Basic";
    if (ph <= 11) return "Weakly Basic";
    return "Strongly Basic";
  };

  const getExamples = (ph: number) => {
    if (ph < 1) return "Battery acid";
    if (ph < 2.5) return "Stomach acid, lemon juice";
    if (ph < 4) return "Vinegar, orange juice";
    if (ph < 5.5) return "Coffee, beer";
    if (ph < 6.5) return "Milk, rain water";
    if (ph <= 7.5) return "Pure water, blood";
    if (ph <= 8.5) return "Sea water, baking soda";
    if (ph <= 10) return "Milk of magnesia";
    if (ph <= 12) return "Ammonia, soapy water";
    return "Bleach, drain cleaner";
  };

  const renderResult = () => {
    switch (mode) {
      case "ph-to-h": {
        const ph = parseFloat(phValue) || 0;
        const h = Math.pow(10, -ph);
        const oh = Math.pow(10, -(14 - ph));
        const poh = 14 - ph;
        return (
          <div className="space-y-3 mt-4">
            <div className="bg-muted/20 p-3 rounded-xl border border-border/50 space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Step-by-step</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 1:</span> pH = {fmt(ph, 2)}</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 2:</span> [H\u207A] = 10^(-pH) = 10^(-{fmt(ph, 2)}) = {h.toExponential(4)} M</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 3:</span> pOH = 14 - pH = 14 - {fmt(ph, 2)} = {fmt(poh, 2)}</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 4:</span> [OH\u207B] = 10^(-pOH) = {oh.toExponential(4)} M</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 5:</span> Category: {getCategory(ph)} (e.g., {getExamples(ph)})</p>
            </div>
            <div className="space-y-2">
              {[
                { label: "[H\u207A] Concentration", value: `${h.toExponential(4)} M` },
                { label: "[OH\u207B] Concentration", value: `${oh.toExponential(4)} M` },
                { label: "pOH", value: fmt(poh, 2) },
                { label: "Nature", value: getCategory(ph) },
                { label: "Example", value: getExamples(ph) },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 bg-muted/30 rounded-xl">
                  <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                  <span className="text-sm font-bold text-violet-400" data-testid={`result-${i}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">pH Scale</p>
              <div className="relative h-6 rounded-full overflow-hidden" style={{ background: "linear-gradient(to right, #ff0000, #ff6600, #ffcc00, #66cc00, #00aa00, #0066cc, #0000ff, #6600cc)" }}>
                <div className="absolute top-0 h-full w-0.5 bg-white shadow" style={{ left: `${(ph / 14) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>0 (Acid)</span><span>7 (Neutral)</span><span>14 (Base)</span>
              </div>
            </div>
          </div>
        );
      }
      case "h-to-ph": {
        const h = parseFloat(hConc) || 0;
        if (h <= 0) return null;
        const ph = -Math.log10(h);
        const poh = 14 - ph;
        const oh = Math.pow(10, -poh);
        return (
          <div className="space-y-3 mt-4">
            <div className="bg-muted/20 p-3 rounded-xl border border-border/50 space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Step-by-step</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 1:</span> [H\u207A] = {h.toExponential(4)} M</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 2:</span> pH = -log\u2081\u2080({h.toExponential(4)}) = {fmt(ph, 4)}</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 3:</span> pOH = 14 - {fmt(ph, 2)} = {fmt(poh, 2)}</p>
            </div>
            <div className="space-y-2">
              {[
                { label: "pH", value: fmt(ph, 4) },
                { label: "pOH", value: fmt(poh, 4) },
                { label: "[OH\u207B]", value: `${oh.toExponential(4)} M` },
                { label: "Nature", value: getCategory(ph) },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 bg-muted/30 rounded-xl">
                  <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                  <span className="text-sm font-bold text-violet-400" data-testid={`result-${i}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "dilution": {
        const conc1 = parseFloat(c1) || 0;
        const vol1 = parseFloat(v1) || 0;
        const vol2 = parseFloat(v2) || 0;
        if (vol2 <= 0) return null;
        const c2 = (conc1 * vol1) / vol2;
        const ph1 = conc1 > 0 ? -Math.log10(conc1) : 0;
        const ph2 = c2 > 0 ? -Math.log10(c2) : 0;
        return (
          <div className="space-y-3 mt-4">
            <div className="bg-muted/20 p-3 rounded-xl border border-border/50 space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Step-by-step</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 1:</span> C\u2081V\u2081 = C\u2082V\u2082 (dilution formula)</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 2:</span> {fmt(conc1)} \u00D7 {fmt(vol1, 0)} = C\u2082 \u00D7 {fmt(vol2, 0)}</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 3:</span> C\u2082 = {fmt(conc1 * vol1)} / {fmt(vol2, 0)} = {c2.toExponential(4)} M</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 4:</span> pH changes: {fmt(ph1, 2)} \u2192 {fmt(ph2, 2)}</p>
            </div>
            <div className="space-y-2">
              {[
                { label: "New Concentration", value: `${c2.toExponential(4)} M` },
                { label: "Dilution Factor", value: `${fmt(vol2 / vol1, 1)}\u00D7` },
                { label: "pH Before", value: fmt(ph1, 2) },
                { label: "pH After", value: fmt(ph2, 2) },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 bg-muted/30 rounded-xl">
                  <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                  <span className="text-sm font-bold text-violet-400" data-testid={`result-${i}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "buffer": {
        const pkaVal = parseFloat(pka) || 0;
        const acid = parseFloat(acidConc) || 0;
        const base = parseFloat(baseConc) || 0;
        if (acid <= 0) return null;
        const ratio = base / acid;
        const ph = pkaVal + Math.log10(ratio);
        return (
          <div className="space-y-3 mt-4">
            <div className="bg-muted/20 p-3 rounded-xl border border-border/50 space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Henderson-Hasselbalch</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 1:</span> pH = pKa + log([A\u207B]/[HA])</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 2:</span> pH = {fmt(pkaVal, 2)} + log({fmt(base)}/{fmt(acid)})</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 3:</span> pH = {fmt(pkaVal, 2)} + log({fmt(ratio, 4)})</p>
              <p className="text-xs text-foreground"><span className="font-bold text-violet-400 mr-1">Step 4:</span> pH = {fmt(pkaVal, 2)} + {fmt(Math.log10(ratio), 4)} = {fmt(ph, 4)}</p>
            </div>
            <div className="space-y-2">
              {[
                { label: "Buffer pH", value: fmt(ph, 4) },
                { label: "pKa", value: fmt(pkaVal, 2) },
                { label: "[Base]/[Acid] Ratio", value: fmt(ratio, 4) },
                { label: "Nature", value: getCategory(ph) },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 bg-muted/30 rounded-xl">
                  <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                  <span className="text-sm font-bold text-violet-400" data-testid={`result-${i}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="pH Calculator" icon={Droplets} iconColor="bg-violet-500">
        <div className="flex gap-2 p-1 bg-muted rounded-xl mb-4 flex-wrap">
          {modes.map((m) => (
            <button key={m.id} onClick={() => setMode(m.id as typeof mode)} data-testid={`mode-${m.id}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${mode === m.id ? "bg-violet-500 text-white shadow-sm" : "text-muted-foreground"}`}>
              {m.label}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {mode === "ph-to-h" && (
            <InputField label="pH Value" value={phValue} onChange={setPhValue} type="number" placeholder="7" />
          )}
          {mode === "h-to-ph" && (
            <InputField label="[H\u207A] Concentration (M)" value={hConc} onChange={setHConc} type="number" placeholder="0.001" />
          )}
          {mode === "dilution" && (
            <>
              <InputField label="Initial Concentration (M)" value={c1} onChange={setC1} type="number" placeholder="0.1" />
              <InputField label="Initial Volume (mL)" value={v1} onChange={setV1} type="number" placeholder="50" />
              <InputField label="Final Volume (mL)" value={v2} onChange={setV2} type="number" placeholder="500" />
            </>
          )}
          {mode === "buffer" && (
            <>
              <InputField label="pKa of Acid" value={pka} onChange={setPka} type="number" placeholder="4.76" />
              <InputField label="[Acid] Concentration (M)" value={acidConc} onChange={setAcidConc} type="number" placeholder="0.1" />
              <InputField label="[Conjugate Base] (M)" value={baseConc} onChange={setBaseConc} type="number" placeholder="0.15" />
            </>
          )}
        </div>
        {renderResult()}
      </ToolCard>
    </div>
  );
}
