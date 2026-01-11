import { useState } from "react";
import { motion } from "framer-motion";
import { Atom, Zap, Thermometer, Scale, FlaskConical, Calculator } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";

const tools = [
  { id: "ohm", label: "Ohm's Law", icon: Zap },
  { id: "molar", label: "Molar Mass", icon: FlaskConical },
  { id: "physics", label: "Motion", icon: Atom },
  { id: "temperature", label: "Temperature", icon: Thermometer },
  { id: "density", label: "Density", icon: Scale },
];

export default function ScienceTools() {
  const [activeTool, setActiveTool] = useState("ohm");

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="px-4 py-4 border-b border-border">
        <h1 className="text-2xl font-bold">Science Tools</h1>
        <p className="text-muted-foreground text-sm mt-1">Physics, Chemistry, and more</p>
      </div>

      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              data-testid={`tab-${tool.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTool === tool.id
                  ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <tool.icon className="w-4 h-4" />
              {tool.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-8">
        {activeTool === "ohm" && <OhmsLaw />}
        {activeTool === "molar" && <MolarMass />}
        {activeTool === "physics" && <MotionEquations />}
        {activeTool === "temperature" && <TemperatureConverter />}
        {activeTool === "density" && <DensityCalculator />}
      </div>
    </div>
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
