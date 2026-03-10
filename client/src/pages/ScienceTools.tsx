import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Atom, Zap, Thermometer, Scale, FlaskConical, Calculator, Droplets, Car, TestTube2, BookOpen, Search } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

const tools = [
  { id: "motion-master", label: "Motion Master", icon: Car },
  { id: "solution-mixer", label: "Solution Mixer", icon: TestTube2 },
  { id: "periodic-table", label: "Periodic Table", icon: BookOpen },
  { id: "ohm", label: "Ohm's Law", icon: Zap },
  { id: "molar", label: "Molar Mass", icon: FlaskConical },
  { id: "physics", label: "Motion (SUVAT)", icon: Atom },
  { id: "temperature", label: "Temperature", icon: Thermometer },
  { id: "density", label: "Density", icon: Scale },
  { id: "ph", label: "pH", icon: Droplets },
];

export default function ScienceTools() {
  const [activeTool, setActiveTool] = useState("motion-master");

  return (
    <PageWrapper
      title="Science Tools"
      subtitle="Physics, Chemistry, Periodic Table and more"
      accentColor="bg-violet-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id)}
    >
      {activeTool === "motion-master"  && <MotionMaster />}
      {activeTool === "solution-mixer" && <SolutionMixer />}
      {activeTool === "periodic-table" && <PeriodicTableTool />}
      {activeTool === "ohm"            && <OhmsLaw />}
      {activeTool === "molar"          && <MolarMass />}
      {activeTool === "physics"        && <MotionEquations />}
      {activeTool === "temperature"    && <TemperatureConverter />}
      {activeTool === "density"        && <DensityCalculator />}
      {activeTool === "ph"             && <PHCalculator />}
    </PageWrapper>
  );
}

/* ══════════════════════════════════════════════════════════════
   MOTION MASTER
══════════════════════════════════════════════════════════════ */
function MotionMaster() {
  const [mode, setMode] = useState("car");
  const [v0kmh, setV0kmh] = useState("0");
  const [v1kmh, setV1kmh] = useState("100");
  const [timeSec, setTimeSec] = useState("8");
  const [massTon, setMassTon] = useState("1");
  const [height, setHeight] = useState("20");
  const [angle, setAngle] = useState("45");
  const [speed, setSpeed] = useState("30");
  const [su, setSu] = useState("0");
  const [sv, setSv] = useState("");
  const [sa, setSa] = useState("9.8");
  const [st, setSt] = useState("5");
  const [ss, setSs] = useState("");

  function fmt(n: number, d = 2) {
    if (!isFinite(n) || isNaN(n)) return "—";
    return parseFloat(n.toFixed(d)).toLocaleString();
  }

  const carComparisons = [
    { name: "Honda City", t: 10.8 }, { name: "Maruti Swift", t: 11.5 },
    { name: "Hyundai Creta", t: 10.2 }, { name: "Toyota Innova", t: 13.5 },
    { name: "Tata Nexon EV", t: 8.9 }, { name: "BMW 3 Series", t: 6.1 },
    { name: "Maruti Baleno", t: 11.9 }, { name: "Kia Seltos", t: 10.5 },
    { name: "Honda Civic", t: 8.2 }, { name: "Mahindra Thar", t: 12.3 },
    { name: "Ford Mustang", t: 4.6 }, { name: "Lamborghini", t: 2.9 },
    { name: "Royal Enfield (0-80)", t: 9.1 }, { name: "Suzuki Gixxer", t: 7.2 },
  ];

  const carResult = useMemo(() => {
    const u = (parseFloat(v0kmh) || 0) / 3.6;
    const v = (parseFloat(v1kmh) || 0) / 3.6;
    const t = parseFloat(timeSec) || 1;
    const mass = (parseFloat(massTon) || 1) * 1000;
    const acc = (v - u) / t;
    const dist = u * t + 0.5 * acc * t * t;
    const force = mass * acc;
    const gForce = acc / 9.81;
    const t060mph = (60 * 1.60934 / 3.6 - u) / acc;
    const tgt = parseFloat(v1kmh);
    const comparable = carComparisons.filter(c => Math.abs(c.t - parseFloat(timeSec)) < 2).slice(0, 3);
    return { u, v, t, mass, acc, dist, force, gForce, t060mph: t060mph > 0 ? t060mph : null, comparable };
  }, [v0kmh, v1kmh, timeSec, massTon]);

  const freefallResult = useMemo(() => {
    const h = parseFloat(height) || 0;
    const g = 9.81;
    const t = Math.sqrt((2 * h) / g);
    const vImpact = g * t;
    const vImpactKmh = vImpact * 3.6;
    return { t, vImpact, vImpactKmh, h };
  }, [height]);

  const projectileResult = useMemo(() => {
    const deg = parseFloat(angle) || 45;
    const v0 = parseFloat(speed) || 0;
    const rad = (deg * Math.PI) / 180;
    const g = 9.81;
    const range = (v0 * v0 * Math.sin(2 * rad)) / g;
    const maxH = (v0 * v0 * Math.sin(rad) ** 2) / (2 * g);
    const totalTime = (2 * v0 * Math.sin(rad)) / g;
    const vx = v0 * Math.cos(rad);
    const vy = v0 * Math.sin(rad);
    return { range, maxH, totalTime, vx, vy };
  }, [angle, speed]);

  const suvatResult = useMemo(() => {
    const u = parseFloat(su) || 0;
    const v = sv !== "" ? parseFloat(sv) : null;
    const a = sa !== "" ? parseFloat(sa) : null;
    const t = parseFloat(st) || 0;
    const s = ss !== "" ? parseFloat(ss) : null;
    // Given u, a, t → find v and s
    if (a !== null && t) {
      const vCalc = u + a * t;
      const sCalc = u * t + 0.5 * a * t * t;
      return [
        { label: "Final velocity (v = u + at)", value: `${fmt(vCalc)} m/s` },
        { label: "Distance (s = ut + ½at²)", value: `${fmt(sCalc)} m` },
        { label: "v² (v² = u² + 2as)", value: `${fmt(vCalc * vCalc)} m²/s²` },
      ];
    }
    return [];
  }, [su, sv, sa, st, ss]);

  const modes = [
    { id: "car", label: "🚗 Car Mode" },
    { id: "freefall", label: "🪂 Free Fall" },
    { id: "projectile", label: "🏹 Projectile" },
    { id: "suvat", label: "📐 SUVAT Solver" },
  ];

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Motion Master" icon={Car} iconColor="bg-violet-500">
        <div className="flex gap-2 p-1 bg-muted rounded-xl mb-4 flex-wrap">
          {modes.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} data-testid={`mode-${m.id}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${mode === m.id ? "bg-violet-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {m.label}
            </button>
          ))}
        </div>

        {mode === "car" && (
          <div className="space-y-3">
            <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl mb-1">
              <p className="text-xs font-mono text-violet-400">a = (v−u)/t &nbsp; | &nbsp; s = ut + ½at² &nbsp; | &nbsp; F = ma</p>
            </div>
            <InputField label="Initial Speed (km/h)" value={v0kmh} onChange={setV0kmh} type="number" placeholder="0" suffix="km/h" />
            <InputField label="Final Speed (km/h)" value={v1kmh} onChange={setV1kmh} type="number" placeholder="100" suffix="km/h" />
            <InputField label="Time (seconds)" value={timeSec} onChange={setTimeSec} type="number" placeholder="8" suffix="s" />
            <InputField label="Vehicle Mass (tonnes)" value={massTon} onChange={setMassTon} type="number" placeholder="1" suffix="t" />
            <div className="mt-4 space-y-2">
              {[
                { label: "⚡ Acceleration", value: `${fmt(carResult.acc)} m/s²`, hi: true },
                { label: "📏 Distance Covered", value: `${fmt(carResult.dist)} m (${fmt(carResult.dist / 1000, 3)} km)` },
                { label: "💥 Engine Force", value: `${fmt(carResult.force)} N (${fmt(carResult.force / 1000, 2)} kN)` },
                { label: "🌀 G-Force", value: `${fmt(carResult.gForce, 3)} g` },
                ...(carResult.t060mph !== null ? [{ label: "🏁 0→60 mph time", value: `${fmt(carResult.t060mph)} s` }] : []),
              ].map((r, i) => (
                <div key={i} className={`flex justify-between items-center p-2.5 rounded-xl ${r.hi ? "bg-violet-500/15 border border-violet-500/20" : "bg-muted/30"}`}>
                  <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                  <span className={`text-sm font-bold ${r.hi ? "text-violet-400" : "text-foreground"}`}>{r.value}</span>
                </div>
              ))}
            </div>
            {carResult.comparable.length > 0 && (
              <div className="mt-3 p-3 bg-muted/20 rounded-xl border border-border/50">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2">🏎️ Similar Cars (0-100 km/h)</p>
                {carResult.comparable.map((c, i) => (
                  <p key={i} className="text-xs text-foreground">• {c.name} — {c.t}s</p>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === "freefall" && (
          <div className="space-y-3">
            <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl">
              <p className="text-xs font-mono text-violet-400">t = √(2h/g) &nbsp;|&nbsp; v = gt &nbsp;|&nbsp; g = 9.81 m/s²</p>
            </div>
            <InputField label="Drop Height (meters)" value={height} onChange={setHeight} type="number" placeholder="20" suffix="m" />
            <div className="mt-3 space-y-2">
              {[
                { label: "⏱️ Time to Fall", value: `${fmt(freefallResult.t)} s`, hi: true },
                { label: "💥 Impact Velocity", value: `${fmt(freefallResult.vImpact)} m/s` },
                { label: "🚀 Impact Speed (km/h)", value: `${fmt(freefallResult.vImpactKmh)} km/h` },
                { label: "⚡ g acceleration", value: "9.81 m/s²" },
              ].map((r, i) => (
                <div key={i} className={`flex justify-between items-center p-2.5 rounded-xl ${r.hi ? "bg-violet-500/15 border border-violet-500/20" : "bg-muted/30"}`}>
                  <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                  <span className={`text-sm font-bold ${r.hi ? "text-violet-400" : "text-foreground"}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 p-3 bg-muted/20 rounded-xl border border-border/50">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1.5">Real-world reference</p>
              <p className="text-xs text-muted-foreground">• 20m = 6-storey building | 45m = 15 floors | 100m = Qutub Minar base</p>
              <p className="text-xs text-muted-foreground">• Human terminal velocity ≈ 195 km/h (spread eagle)</p>
            </div>
          </div>
        )}

        {mode === "projectile" && (
          <div className="space-y-3">
            <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl">
              <p className="text-xs font-mono text-violet-400">Range = v²sin(2θ)/g &nbsp;|&nbsp; H = v²sin²(θ)/2g</p>
            </div>
            <InputField label="Launch Speed (m/s)" value={speed} onChange={setSpeed} type="number" placeholder="30" suffix="m/s" />
            <InputField label="Launch Angle (degrees)" value={angle} onChange={setAngle} type="number" placeholder="45" suffix="°" />
            <div className="mt-3 space-y-2">
              {[
                { label: "📏 Horizontal Range", value: `${fmt(projectileResult.range)} m`, hi: true },
                { label: "📐 Max Height", value: `${fmt(projectileResult.maxH)} m` },
                { label: "⏱️ Total Flight Time", value: `${fmt(projectileResult.totalTime)} s` },
                { label: "➡️ Horizontal velocity (Vx)", value: `${fmt(projectileResult.vx)} m/s` },
                { label: "⬆️ Vertical velocity (Vy)", value: `${fmt(projectileResult.vy)} m/s` },
              ].map((r, i) => (
                <div key={i} className={`flex justify-between items-center p-2.5 rounded-xl ${r.hi ? "bg-violet-500/15 border border-violet-500/20" : "bg-muted/30"}`}>
                  <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                  <span className={`text-sm font-bold ${r.hi ? "text-violet-400" : "text-foreground"}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">💡 Maximum range is always at 45°. Complementary angles (e.g. 30° & 60°) give the same range.</p>
          </div>
        )}

        {mode === "suvat" && (
          <div className="space-y-3">
            <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl">
              <p className="text-xs font-mono text-violet-400">s=ut+½at² &nbsp;|&nbsp; v=u+at &nbsp;|&nbsp; v²=u²+2as</p>
            </div>
            <p className="text-xs text-muted-foreground">Enter u, a, t → get v and s</p>
            <InputField label="u — Initial Velocity (m/s)" value={su} onChange={setSu} type="number" placeholder="0" suffix="m/s" />
            <InputField label="a — Acceleration (m/s²)" value={sa} onChange={setSa} type="number" placeholder="9.8" suffix="m/s²" />
            <InputField label="t — Time (s)" value={st} onChange={setSt} type="number" placeholder="5" suffix="s" />
            <div className="mt-3 space-y-2">
              {suvatResult.map((r, i) => (
                <div key={i} className={`flex justify-between items-center p-2.5 rounded-xl ${i === 0 ? "bg-violet-500/15 border border-violet-500/20" : "bg-muted/30"}`}>
                  <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                  <span className={`text-sm font-bold ${i === 0 ? "text-violet-400" : "text-foreground"}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SOLUTION MIXER
══════════════════════════════════════════════════════════════ */
function SolutionMixer() {
  const [mode, setMode] = useState("mix");
  const [v1, setV1] = useState("500");
  const [c1, setC1] = useState("40");
  const [v2, setV2] = useState("300");
  const [c2, setC2] = useState("60");
  const [targetConc, setTargetConc] = useState("70");
  const [soluteMass, setSoluteMass] = useState("58.5");
  const [solVolume, setSolVolume] = useState("1000");
  const [solMolarMass, setSolMolarMass] = useState("58.5");

  function fmt(n: number, d = 2) {
    if (!isFinite(n) || isNaN(n)) return "—";
    return parseFloat(n.toFixed(d)).toLocaleString();
  }

  const mixResult = useMemo(() => {
    const vol1 = parseFloat(v1) || 0;
    const con1 = parseFloat(c1) || 0;
    const vol2 = parseFloat(v2) || 0;
    const con2 = parseFloat(c2) || 0;
    const totalVol = vol1 + vol2;
    const pureAmount = (vol1 * con1 / 100) + (vol2 * con2 / 100);
    const finalConc = (pureAmount / totalVol) * 100;
    return { totalVol, pureAmount, finalConc, vol1, con1, vol2, con2 };
  }, [v1, c1, v2, c2]);

  const dilutionResult = useMemo(() => {
    const vol = parseFloat(v1) || 0;
    const conc = parseFloat(c1) || 0;
    const target = parseFloat(targetConc) || 0;
    if (!target || target >= conc) return null;
    const pureAmount = vol * conc / 100;
    const finalVol = (pureAmount / target) * 100;
    const waterToAdd = finalVol - vol;
    const steps = [
      { water: 50, newConc: (pureAmount / (vol + 50)) * 100 },
      { water: 100, newConc: (pureAmount / (vol + 100)) * 100 },
      { water: 200, newConc: (pureAmount / (vol + 200)) * 100 },
    ];
    return { finalVol, waterToAdd, steps, pureAmount, finalConc: target };
  }, [v1, c1, targetConc]);

  const concResult = useMemo(() => {
    const mass = parseFloat(soluteMass) || 0;
    const vol = parseFloat(solVolume) || 0;
    const mm = parseFloat(solMolarMass) || 0;
    const wv = (mass / vol) * 100;
    const molarity = mm > 0 ? (mass / mm) / (vol / 1000) : 0;
    const ppm = (mass / vol) * 1000000;
    return { wv, molarity, ppm };
  }, [soluteMass, solVolume, solMolarMass]);

  const modes = [
    { id: "mix", label: "🧪 Mix Two Solutions" },
    { id: "dilute", label: "💧 Dilution Guide" },
    { id: "concentration", label: "📊 Find Concentration" },
  ];

  const sanitizerTip = mixResult.finalConc >= 60 && mixResult.finalConc <= 85;
  const isAlcohol = c1 === "40" || c1 === "60" || c1 === "70";

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Chemistry Solution Mixer" icon={TestTube2} iconColor="bg-green-500">
        <div className="flex gap-2 p-1 bg-muted rounded-xl mb-4 flex-wrap">
          {modes.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} data-testid={`mode-${m.id}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${mode === m.id ? "bg-green-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {m.label}
            </button>
          ))}
        </div>

        {mode === "mix" && (
          <div className="space-y-3">
            <div className="p-2.5 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-xs font-mono text-green-400">C_final = (V₁C₁ + V₂C₂) / (V₁ + V₂)</p>
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase">Solution 1</p>
            <InputField label="Volume (mL)" value={v1} onChange={setV1} type="number" placeholder="500" suffix="mL" />
            <InputField label="Concentration (%)" value={c1} onChange={setC1} type="number" placeholder="40" suffix="%" />
            <p className="text-xs font-bold text-muted-foreground uppercase pt-1">Solution 2</p>
            <InputField label="Volume (mL)" value={v2} onChange={setV2} type="number" placeholder="300" suffix="mL" />
            <InputField label="Concentration (%)" value={c2} onChange={setC2} type="number" placeholder="60" suffix="%" />
            <div className="mt-3 space-y-2">
              {[
                { label: "🧪 Total Volume", value: `${fmt(mixResult.totalVol)} mL`, hi: true },
                { label: "📊 Final Concentration", value: `${fmt(mixResult.finalConc)}%`, hi: true },
                { label: "💧 Pure Solute Amount", value: `${fmt(mixResult.pureAmount)} mL` },
              ].map((r, i) => (
                <div key={i} className={`flex justify-between items-center p-2.5 rounded-xl ${r.hi ? "bg-green-500/15 border border-green-500/20" : "bg-muted/30"}`}>
                  <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                  <span className={`text-sm font-bold ${r.hi ? "text-green-400" : "text-foreground"}`}>{r.value}</span>
                </div>
              ))}
            </div>
            {sanitizerTip && (
              <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-xs font-bold text-green-400 mb-1">✅ Great for Hand Sanitizer!</p>
                <p className="text-xs text-muted-foreground">WHO recommends 60-80% alcohol. Add aloe vera gel for skin-friendly sanitizer.</p>
              </div>
            )}
            <div className="mt-2 p-3 bg-muted/20 rounded-xl border border-border/50">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1.5">Dilution Guide — add water to achieve</p>
              {[30, 40, 50].map(target => {
                const pure = mixResult.pureAmount;
                const tv = mixResult.totalVol;
                const fv = (pure / target) * 100;
                const w = fv - tv;
                return w > 0 ? (
                  <p key={target} className="text-xs text-muted-foreground">➕ Add {fmt(w)} mL water → {target}%</p>
                ) : null;
              })}
            </div>
          </div>
        )}

        {mode === "dilute" && (
          <div className="space-y-3">
            <div className="p-2.5 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-xs font-mono text-green-400">V_final = (V × C_initial) / C_target</p>
            </div>
            <InputField label="Solution Volume (mL)" value={v1} onChange={setV1} type="number" placeholder="500" suffix="mL" />
            <InputField label="Current Concentration (%)" value={c1} onChange={setC1} type="number" placeholder="70" suffix="%" />
            <InputField label="Target Concentration (%)" value={targetConc} onChange={setTargetConc} type="number" placeholder="40" suffix="%" />
            {dilutionResult && (
              <div className="mt-3 space-y-2">
                {[
                  { label: "💧 Water to Add", value: `${fmt(dilutionResult.waterToAdd)} mL`, hi: true },
                  { label: "🧪 Final Volume", value: `${fmt(dilutionResult.finalVol)} mL` },
                  { label: "📊 Final Concentration", value: `${targetConc}%` },
                  { label: "💧 Pure Solute", value: `${fmt(dilutionResult.pureAmount)} mL` },
                ].map((r, i) => (
                  <div key={i} className={`flex justify-between items-center p-2.5 rounded-xl ${r.hi ? "bg-green-500/15 border border-green-500/20" : "bg-muted/30"}`}>
                    <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                    <span className={`text-sm font-bold ${r.hi ? "text-green-400" : "text-foreground"}`}>{r.value}</span>
                  </div>
                ))}
                <div className="mt-2 p-3 bg-muted/20 rounded-xl border border-border/50">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1.5">Other options (adding water):</p>
                  {dilutionResult.steps.map((s, i) => (
                    <p key={i} className="text-xs text-muted-foreground">➕ Add {s.water} mL water → {fmt(s.newConc)}%</p>
                  ))}
                </div>
              </div>
            )}
            {!dilutionResult && <p className="text-xs text-orange-400 mt-2">⚠️ Target must be lower than current concentration</p>}
          </div>
        )}

        {mode === "concentration" && (
          <div className="space-y-3">
            <div className="p-2.5 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-xs font-mono text-green-400">%(w/v) = (mass/vol)×100 &nbsp;|&nbsp; M = n/V(L)</p>
            </div>
            <InputField label="Solute Mass (g)" value={soluteMass} onChange={setSoluteMass} type="number" placeholder="58.5" suffix="g" />
            <InputField label="Solution Volume (mL)" value={solVolume} onChange={setSolVolume} type="number" placeholder="1000" suffix="mL" />
            <InputField label="Molar Mass of Solute (g/mol)" value={solMolarMass} onChange={setSolMolarMass} type="number" placeholder="58.5" suffix="g/mol" />
            <div className="mt-3 space-y-2">
              {[
                { label: "% (w/v) Concentration", value: `${fmt(concResult.wv)}%`, hi: true },
                { label: "Molarity (M)", value: `${fmt(concResult.molarity, 4)} mol/L` },
                { label: "ppm (mg/L)", value: `${fmt(concResult.ppm, 0)} ppm` },
              ].map((r, i) => (
                <div key={i} className={`flex justify-between items-center p-2.5 rounded-xl ${r.hi ? "bg-green-500/15 border border-green-500/20" : "bg-muted/30"}`}>
                  <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                  <span className={`text-sm font-bold ${r.hi ? "text-green-400" : "text-foreground"}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PERIODIC TABLE ASSISTANT
══════════════════════════════════════════════════════════════ */
interface Element {
  symbol: string; name: string; atomic: number; mass: number;
  electrons: string; density: string; meltPt: string; boilPt: string;
  group: string; category: string; uses: string[];
}

const ELEMENTS: Element[] = [
  { symbol:"H",  name:"Hydrogen",    atomic:1,   mass:1.008,   electrons:"1",       density:"0.0899 g/L",   meltPt:"-259.1°C", boilPt:"-252.9°C", group:"1",  category:"Non-metal",     uses:["Fuel cells","Ammonia production","Petroleum refining"] },
  { symbol:"He", name:"Helium",      atomic:2,   mass:4.003,   electrons:"2",       density:"0.1786 g/L",   meltPt:"−272.2°C", boilPt:"−268.9°C", group:"18", category:"Noble gas",      uses:["Balloons","MRI machines","Cryogenics","Diving tanks"] },
  { symbol:"Li", name:"Lithium",     atomic:3,   mass:6.941,   electrons:"2,1",     density:"0.534 g/cm³",  meltPt:"180.5°C",  boilPt:"1342°C",   group:"1",  category:"Alkali metal",   uses:["Batteries (Li-ion)","Psychiatric medicine","Ceramics"] },
  { symbol:"C",  name:"Carbon",      atomic:6,   mass:12.011,  electrons:"2,4",     density:"2.267 g/cm³",  meltPt:"3550°C",   boilPt:"4827°C",   group:"14", category:"Non-metal",     uses:["Diamonds","Graphite","Organic chemistry","Steel"] },
  { symbol:"N",  name:"Nitrogen",    atomic:7,   mass:14.007,  electrons:"2,5",     density:"1.251 g/L",    meltPt:"-210°C",   boilPt:"-196°C",   group:"15", category:"Non-metal",     uses:["Fertilizers","Air (78%)","Liquid nitrogen cooling"] },
  { symbol:"O",  name:"Oxygen",      atomic:8,   mass:15.999,  electrons:"2,6",     density:"1.429 g/L",    meltPt:"-218.8°C", boilPt:"-183°C",   group:"16", category:"Non-metal",     uses:["Air 21%","Medical 90%+ purity","Welding 99.5%","Combustion"] },
  { symbol:"F",  name:"Fluorine",    atomic:9,   mass:18.998,  electrons:"2,7",     density:"1.696 g/L",    meltPt:"-219.6°C", boilPt:"-188.1°C", group:"17", category:"Halogen",        uses:["Toothpaste","Refrigerants (Freon)","Teflon"] },
  { symbol:"Ne", name:"Neon",        atomic:10,  mass:20.180,  electrons:"2,8",     density:"0.9002 g/L",   meltPt:"-248.6°C", boilPt:"-246.1°C", group:"18", category:"Noble gas",      uses:["Neon signs","Lasers","Cryogenics"] },
  { symbol:"Na", name:"Sodium",      atomic:11,  mass:22.990,  electrons:"2,8,1",   density:"0.968 g/cm³",  meltPt:"97.8°C",   boilPt:"883°C",    group:"1",  category:"Alkali metal",   uses:["Table salt (NaCl)","Street lights","Soap production","Baking soda"] },
  { symbol:"Mg", name:"Magnesium",   atomic:12,  mass:24.305,  electrons:"2,8,2",   density:"1.738 g/cm³",  meltPt:"650°C",    boilPt:"1091°C",   group:"2",  category:"Alkaline earth", uses:["Alloys (aircraft)","Antacids","Fertilizers","Fireworks"] },
  { symbol:"Al", name:"Aluminium",   atomic:13,  mass:26.982,  electrons:"2,8,3",   density:"2.702 g/cm³",  meltPt:"660.3°C",  boilPt:"2519°C",   group:"13", category:"Post-transition",uses:["Packaging","Aircraft","Construction","Electrical cables"] },
  { symbol:"Si", name:"Silicon",     atomic:14,  mass:28.086,  electrons:"2,8,4",   density:"2.329 g/cm³",  meltPt:"1414°C",   boilPt:"3265°C",   group:"14", category:"Metalloid",      uses:["Semiconductors","Computer chips","Solar cells","Glass"] },
  { symbol:"P",  name:"Phosphorus",  atomic:15,  mass:30.974,  electrons:"2,8,5",   density:"1.823 g/cm³",  meltPt:"44.2°C",   boilPt:"280.5°C",  group:"15", category:"Non-metal",     uses:["Fertilizers","Matchsticks","DNA & ATP structure"] },
  { symbol:"S",  name:"Sulfur",      atomic:16,  mass:32.065,  electrons:"2,8,6",   density:"2.067 g/cm³",  meltPt:"115.2°C",  boilPt:"444.6°C",  group:"16", category:"Non-metal",     uses:["Sulfuric acid","Gunpowder","Rubber vulcanization","Fertilizers"] },
  { symbol:"Cl", name:"Chlorine",    atomic:17,  mass:35.453,  electrons:"2,8,7",   density:"3.214 g/L",    meltPt:"-101.5°C", boilPt:"-34.1°C",  group:"17", category:"Halogen",        uses:["Water purification","PVC plastic","Bleaching agents","Disinfectants"] },
  { symbol:"Ar", name:"Argon",       atomic:18,  mass:39.948,  electrons:"2,8,8",   density:"1.784 g/L",    meltPt:"-189.4°C", boilPt:"-185.9°C", group:"18", category:"Noble gas",      uses:["Welding shield gas","Incandescent bulbs","Wine preservation"] },
  { symbol:"K",  name:"Potassium",   atomic:19,  mass:39.098,  electrons:"2,8,8,1", density:"0.862 g/cm³",  meltPt:"63.4°C",   boilPt:"759°C",    group:"1",  category:"Alkali metal",   uses:["Fertilizers","Banana nutrition","Gunpowder","Soap"] },
  { symbol:"Ca", name:"Calcium",     atomic:20,  mass:40.078,  electrons:"2,8,8,2", density:"1.55 g/cm³",   meltPt:"842°C",    boilPt:"1484°C",   group:"2",  category:"Alkaline earth", uses:["Bones & teeth","Cement","Limestone","Calcium supplements"] },
  { symbol:"Fe", name:"Iron",        atomic:26,  mass:55.845,  electrons:"2,8,14,2",density:"7.874 g/cm³",  meltPt:"1538°C",   boilPt:"2861°C",   group:"8",  category:"Transition",     uses:["Steel","Cast iron","Hemoglobin (blood)","Magnets"] },
  { symbol:"Co", name:"Cobalt",      atomic:27,  mass:58.933,  electrons:"2,8,15,2",density:"8.9 g/cm³",    meltPt:"1495°C",   boilPt:"2927°C",   group:"9",  category:"Transition",     uses:["Li-ion batteries","Superalloys","Blue pigment","Vitamin B12"] },
  { symbol:"Ni", name:"Nickel",      atomic:28,  mass:58.693,  electrons:"2,8,16,2",density:"8.908 g/cm³",  meltPt:"1455°C",   boilPt:"2913°C",   group:"10", category:"Transition",     uses:["Stainless steel","Coins","EV batteries","Electroplating"] },
  { symbol:"Cu", name:"Copper",      atomic:29,  mass:63.546,  electrons:"2,8,18,1",density:"8.96 g/cm³",   meltPt:"1084.6°C", boilPt:"2562°C",   group:"11", category:"Transition",     uses:["Electrical wires","Plumbing","Coins","Alloys (brass,bronze)"] },
  { symbol:"Zn", name:"Zinc",        atomic:30,  mass:65.38,   electrons:"2,8,18,2",density:"7.134 g/cm³",  meltPt:"419.5°C",  boilPt:"907°C",    group:"12", category:"Transition",     uses:["Galvanizing steel","Supplements","Brass","Die casting"] },
  { symbol:"Br", name:"Bromine",     atomic:35,  mass:79.904,  electrons:"2,8,18,7",density:"3.122 g/cm³",  meltPt:"-7.3°C",   boilPt:"58.8°C",   group:"17", category:"Halogen",        uses:["Fire retardants","Photography","Pesticides","Pool treatment"] },
  { symbol:"Ag", name:"Silver",      atomic:47,  mass:107.868, electrons:"2,8,18,18,1",density:"10.49 g/cm³",meltPt:"961.8°C", boilPt:"2162°C",   group:"11", category:"Transition",     uses:["Jewelry","Mirrors","Antibacterial coatings","Photography"] },
  { symbol:"Sn", name:"Tin",         atomic:50,  mass:118.71,  electrons:"2,8,18,18,4",density:"7.287 g/cm³",meltPt:"231.9°C", boilPt:"2602°C",   group:"14", category:"Post-transition",uses:["Tin cans","Solder","Bronze alloy","Pewter"] },
  { symbol:"I",  name:"Iodine",      atomic:53,  mass:126.904, electrons:"2,8,18,18,7",density:"4.933 g/cm³",meltPt:"113.7°C", boilPt:"184.4°C",  group:"17", category:"Halogen",        uses:["Iodised salt","Antiseptics","Thyroid medicine","Photography"] },
  { symbol:"Ba", name:"Barium",      atomic:56,  mass:137.327, electrons:"2,8,18,18,8,2",density:"3.5 g/cm³",meltPt:"727°C",  boilPt:"1897°C",   group:"2",  category:"Alkaline earth", uses:["Fireworks (green)","X-ray contrast","Barium sulfate paint"] },
  { symbol:"Au", name:"Gold",        atomic:79,  mass:196.967, electrons:"2,8,18,32,18,1",density:"19.32 g/cm³",meltPt:"1064.2°C",boilPt:"2856°C",group:"11",category:"Transition",     uses:["Jewelry","Electronics","Currency standard","Dentistry"] },
  { symbol:"Hg", name:"Mercury",     atomic:80,  mass:200.59,  electrons:"2,8,18,32,18,2",density:"13.534 g/cm³",meltPt:"-38.8°C",boilPt:"356.7°C",group:"12",category:"Transition",    uses:["Thermometers (old)","Fluorescent lamps","Dental fillings (old)"] },
  { symbol:"Pb", name:"Lead",        atomic:82,  mass:207.2,   electrons:"2,8,18,32,18,4",density:"11.34 g/cm³",meltPt:"327.5°C",boilPt:"1749°C", group:"14", category:"Post-transition",uses:["Car batteries","Radiation shielding","Soldering","Bullets"] },
  { symbol:"U",  name:"Uranium",     atomic:92,  mass:238.029, electrons:"2,8,18,32,21,9,2",density:"19.1 g/cm³",meltPt:"1132°C",boilPt:"4131°C", group:"actinide",category:"Actinide",  uses:["Nuclear power plants","Nuclear weapons","Medical imaging"] },
  { symbol:"Pt", name:"Platinum",    atomic:78,  mass:195.084, electrons:"2,8,18,32,17,1",density:"21.45 g/cm³",meltPt:"1768.4°C",boilPt:"3825°C",group:"10",category:"Transition",     uses:["Catalytic converters","Jewelry","Chemotherapy drugs","Fuel cells"] },
  { symbol:"Ti", name:"Titanium",    atomic:22,  mass:47.867,  electrons:"2,8,10,2",density:"4.507 g/cm³",  meltPt:"1668°C",   boilPt:"3287°C",   group:"4",  category:"Transition",     uses:["Aircraft (lightweight)","Medical implants","Paints (TiO₂)"] },
  { symbol:"Cr", name:"Chromium",    atomic:24,  mass:51.996,  electrons:"2,8,13,1",density:"7.19 g/cm³",   meltPt:"1907°C",   boilPt:"2671°C",   group:"6",  category:"Transition",     uses:["Stainless steel","Chrome plating","Pigments","Tanning leather"] },
  { symbol:"Mn", name:"Manganese",   atomic:25,  mass:54.938,  electrons:"2,8,13,2",density:"7.21 g/cm³",   meltPt:"1246°C",   boilPt:"2061°C",   group:"7",  category:"Transition",     uses:["Steel alloys","Batteries","Fertilizer","Disinfectants"] },
  { symbol:"Ga", name:"Gallium",     atomic:31,  mass:69.723,  electrons:"2,8,18,3",density:"5.904 g/cm³",  meltPt:"29.8°C",   boilPt:"2229°C",   group:"13", category:"Post-transition",uses:["LEDs (GaN)","Solar cells","Semiconductors","Thermometers"] },
  { symbol:"Ge", name:"Germanium",   atomic:32,  mass:72.631,  electrons:"2,8,18,4",density:"5.323 g/cm³",  meltPt:"938.4°C",  boilPt:"2833°C",   group:"14", category:"Metalloid",      uses:["Fiber optics","Semiconductors","Solar panels","Night vision"] },
  { symbol:"As", name:"Arsenic",     atomic:33,  mass:74.922,  electrons:"2,8,18,5",density:"5.776 g/cm³",  meltPt:"814°C",    boilPt:"615°C",    group:"15", category:"Metalloid",      uses:["Wood preservation","Pesticides","Semiconductors (GaAs)"] },
  { symbol:"Sr", name:"Strontium",   atomic:38,  mass:87.62,   electrons:"2,8,18,8,2",density:"2.64 g/cm³", meltPt:"777°C",    boilPt:"1382°C",   group:"2",  category:"Alkaline earth", uses:["Fireworks (red)","Bone density studies","TV tubes (old)"] },
  { symbol:"Rb", name:"Rubidium",    atomic:37,  mass:85.468,  electrons:"2,8,18,8,1",density:"1.532 g/cm³",meltPt:"39.3°C",   boilPt:"688°C",    group:"1",  category:"Alkali metal",   uses:["Atomic clocks","Research","Vacuum tubes"] },
  { symbol:"Mo", name:"Molybdenum",  atomic:42,  mass:95.96,   electrons:"2,8,18,13,1",density:"10.22 g/cm³",meltPt:"2623°C",  boilPt:"4639°C",   group:"6",  category:"Transition",     uses:["High-strength steels","Lubricants","Catalysts","Electronics"] },
  { symbol:"Pd", name:"Palladium",   atomic:46,  mass:106.42,  electrons:"2,8,18,18,0",density:"12.023 g/cm³",meltPt:"1554.9°C",boilPt:"2963°C",  group:"10", category:"Transition",     uses:["Catalytic converters","Hydrogen storage","Electronics","Jewelry"] },
  { symbol:"W",  name:"Tungsten",    atomic:74,  mass:183.84,  electrons:"2,8,18,32,12,2",density:"19.3 g/cm³",meltPt:"3422°C", boilPt:"5555°C",   group:"6",  category:"Transition",     uses:["Light bulb filaments","Cutting tools","X-ray tubes","Military"] },
  { symbol:"Bi", name:"Bismuth",     atomic:83,  mass:208.98,  electrons:"2,8,18,32,18,5",density:"9.807 g/cm³",meltPt:"271.4°C",boilPt:"1564°C",  group:"15", category:"Post-transition",uses:["Cosmetics","Pepto-Bismol","Low-melt alloys","Fire sprinklers"] },
  { symbol:"Ra", name:"Radium",      atomic:88,  mass:226,     electrons:"2,8,18,32,18,8,2",density:"5.5 g/cm³",meltPt:"700°C", boilPt:"1737°C",   group:"2",  category:"Alkaline earth", uses:["Historical cancer treatment","Radium watches (historical)","Research"] },
  { symbol:"Xe", name:"Xenon",       atomic:54,  mass:131.293, electrons:"2,8,18,18,8",density:"5.894 g/L",  meltPt:"-111.8°C", boilPt:"-108.1°C", group:"18", category:"Noble gas",      uses:["Flash lamps","Ion propulsion","Anaesthesia","Headlights (HID)"] },
  { symbol:"Kr", name:"Krypton",     atomic:36,  mass:83.798,  electrons:"2,8,18,8",  density:"3.749 g/L",  meltPt:"-157.4°C", boilPt:"-153.4°C", group:"18", category:"Noble gas",      uses:["Photography flash","Laser eye surgery","Fluorescent lamps"] },
  { symbol:"Rn", name:"Radon",       atomic:86,  mass:222,     electrons:"2,8,18,32,18,8",density:"9.73 g/L",meltPt:"-71.1°C",  boilPt:"-61.8°C",  group:"18", category:"Noble gas",      uses:["Cancer treatment (radon therapy)","Earthquake prediction research"] },
];

const categoryColors: Record<string, string> = {
  "Non-metal": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Noble gas": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Alkali metal": "bg-red-500/20 text-red-400 border-red-500/30",
  "Alkaline earth": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Transition": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Post-transition": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Metalloid": "bg-green-500/20 text-green-400 border-green-500/30",
  "Halogen": "bg-lime-500/20 text-lime-400 border-lime-500/30",
  "Actinide": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

function PeriodicTableTool() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Element | null>(ELEMENTS.find(e => e.name === "Oxygen") || null);
  const [filterCat, setFilterCat] = useState("All");

  const categories = ["All", "Non-metal", "Noble gas", "Alkali metal", "Alkaline earth", "Transition", "Metalloid", "Halogen", "Post-transition", "Actinide"];

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ELEMENTS.filter(el => {
      const matchQ = !q || el.name.toLowerCase().includes(q) || el.symbol.toLowerCase().includes(q) || String(el.atomic).includes(q);
      const matchCat = filterCat === "All" || el.category === filterCat;
      return matchQ && matchCat;
    });
  }, [query, filterCat]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Periodic Table Assistant" icon={BookOpen} iconColor="bg-indigo-500">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search element name, symbol or atomic number..."
            className="w-full pl-9 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            data-testid="input-element-search"
          />
        </div>

        <div className="flex gap-1.5 flex-wrap mb-3">
          {categories.slice(0, 6).map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`px-2 py-1 text-[10px] font-semibold rounded-lg transition-all border ${filterCat === cat ? "bg-indigo-500 text-white border-indigo-500" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto mb-3">
          {filtered.map(el => (
            <button
              key={el.symbol}
              onClick={() => setSelected(el)}
              data-testid={`element-${el.symbol}`}
              className={`p-2 rounded-xl border text-center transition-all hover:border-indigo-500/40 ${selected?.symbol === el.symbol ? "bg-indigo-500/20 border-indigo-500/40" : "bg-muted/30 border-border/50"}`}
            >
              <div className="text-xs font-bold text-foreground">{el.symbol}</div>
              <div className="text-[9px] text-muted-foreground">{el.atomic}</div>
            </button>
          ))}
        </div>

        {selected && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={selected.symbol} className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
              <div className="text-center">
                <div className="text-4xl font-black text-indigo-400">{selected.symbol}</div>
                <div className="text-[10px] text-muted-foreground">{selected.atomic}</div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{selected.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${categoryColors[selected.category] || "bg-muted text-muted-foreground border-border"}`}>
                  {selected.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "⚛️ Atomic Number", value: selected.atomic },
                { label: "⚖️ Atomic Mass", value: `${selected.mass} u` },
                { label: "🔬 Electron Config.", value: selected.electrons },
                { label: "🔢 Group", value: selected.group },
                { label: "💨 Density", value: selected.density },
                { label: "🌡️ Melting Point", value: selected.meltPt },
                { label: "🔥 Boiling Point", value: selected.boilPt },
              ].map((r, i) => (
                <div key={i} className="flex flex-col p-2.5 bg-muted/30 rounded-xl">
                  <span className="text-[10px] font-semibold text-muted-foreground">{r.label}</span>
                  <span className="text-sm font-bold text-foreground mt-0.5">{r.value}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-muted/20 rounded-xl border border-border/50">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">💡 Common Uses</p>
              <div className="space-y-1">
                {selected.uses.map((use, i) => (
                  <p key={i} className="text-xs text-foreground">• {use}</p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </ToolCard>
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
