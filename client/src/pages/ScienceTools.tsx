import { useState, useMemo } from "react";
import { Atom, Zap, Thermometer, Scale, FlaskConical, Calculator, Droplets, Car, TestTube2, BookOpen, Search } from "lucide-react";
import { DesktopToolGrid, InputPanel, ResultPanel, SummaryCard, BreakdownRow, InputField, ModeSelector } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

const sFmt = (n: number, d = 2) => (!isFinite(n) || isNaN(n) ? "—" : parseFloat(n.toFixed(d)).toLocaleString());

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
    <PageWrapper title="Science Tools" subtitle="Physics, Chemistry, Periodic Table and more" accentColor="bg-violet-500" tools={tools} activeTool={activeTool} onToolChange={setActiveTool}>
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
  const [sa, setSa] = useState("9.8");
  const [st, setSt] = useState("5");

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
    const comparable = carComparisons.filter(c => Math.abs(c.t - parseFloat(timeSec)) < 2).slice(0, 3);
    return { acc, dist, force, gForce, t060mph: t060mph > 0 ? t060mph : null, comparable };
  }, [v0kmh, v1kmh, timeSec, massTon]);

  const freefallResult = useMemo(() => {
    const h = parseFloat(height) || 0;
    const g = 9.81;
    const t = Math.sqrt((2 * h) / g);
    const vImpact = g * t;
    return { t, vImpact, vImpactKmh: vImpact * 3.6 };
  }, [height]);

  const projectileResult = useMemo(() => {
    const deg = parseFloat(angle) || 45;
    const v0 = parseFloat(speed) || 0;
    const rad = (deg * Math.PI) / 180;
    const g = 9.81;
    const range = (v0 * v0 * Math.sin(2 * rad)) / g;
    const maxH = (v0 * v0 * Math.sin(rad) ** 2) / (2 * g);
    const totalTime = (2 * v0 * Math.sin(rad)) / g;
    return { range, maxH, totalTime, vx: v0 * Math.cos(rad), vy: v0 * Math.sin(rad) };
  }, [angle, speed]);

  const suvatResult = useMemo(() => {
    const u = parseFloat(su) || 0;
    const a = parseFloat(sa) || 0;
    const t = parseFloat(st) || 0;
    const vCalc = u + a * t;
    const sCalc = u * t + 0.5 * a * t * t;
    return { vCalc, sCalc, vSq: vCalc * vCalc };
  }, [su, sa, st]);

  const modeDefs = [{ id: "car", label: "🚗 Car" }, { id: "freefall", label: "🪂 Free Fall" }, { id: "projectile", label: "🏹 Projectile" }, { id: "suvat", label: "📐 SUVAT" }];

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Motion Parameters" icon={Car} iconColor="bg-violet-500">
          <ModeSelector modes={modeDefs} active={mode} onChange={setMode} />
          {mode === "car" && <>
            <div className="grid grid-cols-2 gap-2">
              <InputField label="Start Speed (km/h)" value={v0kmh} onChange={setV0kmh} type="number" />
              <InputField label="End Speed (km/h)" value={v1kmh} onChange={setV1kmh} type="number" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <InputField label="Time (sec)" value={timeSec} onChange={setTimeSec} type="number" suffix="s" />
              <InputField label="Mass (tonnes)" value={massTon} onChange={setMassTon} type="number" suffix="t" />
            </div>
          </>}
          {mode === "freefall" && <InputField label="Drop Height" value={height} onChange={setHeight} type="number" suffix="m" />}
          {mode === "projectile" && <>
            <InputField label="Launch Angle" value={angle} onChange={setAngle} type="number" suffix="°" />
            <InputField label="Launch Speed" value={speed} onChange={setSpeed} type="number" suffix="m/s" />
          </>}
          {mode === "suvat" && <>
            <InputField label="Initial Velocity (u)" value={su} onChange={setSu} type="number" suffix="m/s" />
            <InputField label="Acceleration (a)" value={sa} onChange={setSa} type="number" suffix="m/s²" />
            <InputField label="Time (t)" value={st} onChange={setSt} type="number" suffix="s" />
          </>}
        </InputPanel>
      }
      results={
        mode === "car" ? (
          <ResultPanel label="Acceleration" primary={`${sFmt(carResult.acc, 2)} m/s²`}
            summaries={<>
              <SummaryCard label="Distance" value={`${sFmt(carResult.dist, 1)} m`} accent="text-violet-500" />
              <SummaryCard label="G-Force" value={`${sFmt(carResult.gForce, 2)} g`} />
            </>}
          >
            <BreakdownRow label="Acceleration" value={`${sFmt(carResult.acc, 2)} m/s²`} dot="bg-violet-400" bold />
            <BreakdownRow label="Distance Covered" value={`${sFmt(carResult.dist, 1)} m`} dot="bg-blue-400" />
            <BreakdownRow label="Force Required" value={`${sFmt(carResult.force, 0)} N`} dot="bg-amber-400" />
            <BreakdownRow label="G-Force" value={`${sFmt(carResult.gForce, 3)} g`} dot="bg-red-400" />
            {carResult.t060mph && <BreakdownRow label="0-60 mph time" value={`${sFmt(carResult.t060mph, 2)} s`} dot="bg-green-500" bold />}
            {carResult.comparable.length > 0 && <BreakdownRow label="Similar to" value={carResult.comparable.map(c => c.name).join(", ")} dot="bg-purple-400" />}
          </ResultPanel>
        ) : mode === "freefall" ? (
          <ResultPanel label="Fall Duration" primary={`${sFmt(freefallResult.t, 2)} s`}
            summaries={<>
              <SummaryCard label="Impact Speed" value={`${sFmt(freefallResult.vImpactKmh, 1)} km/h`} accent="text-violet-500" />
              <SummaryCard label="In m/s" value={`${sFmt(freefallResult.vImpact, 2)} m/s`} />
            </>}
          >
            <BreakdownRow label="Drop Height" value={`${height} m`} dot="bg-blue-400" />
            <BreakdownRow label="Fall Time" value={`${sFmt(freefallResult.t, 2)} s`} dot="bg-violet-400" bold />
            <BreakdownRow label="Impact Speed" value={`${sFmt(freefallResult.vImpact, 2)} m/s`} dot="bg-red-400" />
            <BreakdownRow label="Impact Speed" value={`${sFmt(freefallResult.vImpactKmh, 1)} km/h`} dot="bg-amber-400" bold />
          </ResultPanel>
        ) : mode === "projectile" ? (
          <ResultPanel label="Range" primary={`${sFmt(projectileResult.range, 2)} m`}
            summaries={<>
              <SummaryCard label="Max Height" value={`${sFmt(projectileResult.maxH, 2)} m`} accent="text-violet-500" />
              <SummaryCard label="Time" value={`${sFmt(projectileResult.totalTime, 2)} s`} />
            </>}
          >
            <BreakdownRow label="Horizontal Range" value={`${sFmt(projectileResult.range, 2)} m`} dot="bg-violet-400" bold />
            <BreakdownRow label="Max Height" value={`${sFmt(projectileResult.maxH, 2)} m`} dot="bg-blue-400" />
            <BreakdownRow label="Total Time" value={`${sFmt(projectileResult.totalTime, 2)} s`} dot="bg-amber-400" />
            <BreakdownRow label="Horizontal Velocity" value={`${sFmt(projectileResult.vx, 2)} m/s`} dot="bg-green-400" />
            <BreakdownRow label="Vertical Velocity" value={`${sFmt(projectileResult.vy, 2)} m/s`} dot="bg-cyan-400" />
          </ResultPanel>
        ) : (
          <ResultPanel label="Final Velocity" primary={`${sFmt(suvatResult.vCalc, 2)} m/s`}
            summaries={<>
              <SummaryCard label="Distance" value={`${sFmt(suvatResult.sCalc, 2)} m`} accent="text-violet-500" />
              <SummaryCard label="v²" value={`${sFmt(suvatResult.vSq, 2)}`} />
            </>}
          >
            <BreakdownRow label="v = u + at" value={`${sFmt(suvatResult.vCalc, 2)} m/s`} dot="bg-violet-400" bold />
            <BreakdownRow label="s = ut + ½at²" value={`${sFmt(suvatResult.sCalc, 2)} m`} dot="bg-blue-400" bold />
            <BreakdownRow label="v² = u² + 2as" value={`${sFmt(suvatResult.vSq, 2)} m²/s²`} dot="bg-amber-400" />
          </ResultPanel>
        )
      }
    />
  );
}

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

  const mixResult = useMemo(() => {
    const vol1 = parseFloat(v1) || 0; const con1 = parseFloat(c1) || 0;
    const vol2 = parseFloat(v2) || 0; const con2 = parseFloat(c2) || 0;
    const totalVol = vol1 + vol2;
    const pureAmount = (vol1 * con1 / 100) + (vol2 * con2 / 100);
    const finalConc = totalVol > 0 ? (pureAmount / totalVol) * 100 : 0;
    return { totalVol, pureAmount, finalConc };
  }, [v1, c1, v2, c2]);

  const dilResult = useMemo(() => {
    const vol = parseFloat(v1) || 0; const conc = parseFloat(c1) || 0;
    const target = parseFloat(targetConc) || 0;
    if (!target || target >= conc) return null;
    const pureAmount = vol * conc / 100;
    const finalVol = (pureAmount / target) * 100;
    const waterToAdd = finalVol - vol;
    return { finalVol, waterToAdd, pureAmount };
  }, [v1, c1, targetConc]);

  const concResult = useMemo(() => {
    const mass = parseFloat(soluteMass) || 0;
    const vol = parseFloat(solVolume) || 0;
    const mm = parseFloat(solMolarMass) || 0;
    const wv = vol > 0 ? (mass / vol) * 100 : 0;
    const molarity = mm > 0 ? (mass / mm) / (vol / 1000) : 0;
    const ppm = vol > 0 ? (mass / vol) * 1000000 : 0;
    return { wv, molarity, ppm };
  }, [soluteMass, solVolume, solMolarMass]);

  const sanitizerTip = mixResult.finalConc >= 60 && mixResult.finalConc <= 85;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Solution Parameters" icon={TestTube2} iconColor="bg-green-500">
          <ModeSelector modes={[{ id: "mix", label: "🧪 Mix" }, { id: "dilute", label: "💧 Dilute" }, { id: "concentration", label: "📊 Concentration" }]} active={mode} onChange={setMode} />
          {mode === "mix" && <>
            <div className="p-2.5 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-xs font-mono text-green-400">C_final = (V₁C₁ + V₂C₂) / (V₁ + V₂)</p>
            </div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase">Solution 1</p>
            <div className="grid grid-cols-2 gap-2">
              <InputField label="Volume (mL)" value={v1} onChange={setV1} type="number" suffix="mL" />
              <InputField label="Concentration (%)" value={c1} onChange={setC1} type="number" suffix="%" />
            </div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase">Solution 2</p>
            <div className="grid grid-cols-2 gap-2">
              <InputField label="Volume (mL)" value={v2} onChange={setV2} type="number" suffix="mL" />
              <InputField label="Concentration (%)" value={c2} onChange={setC2} type="number" suffix="%" />
            </div>
          </>}
          {mode === "dilute" && <>
            <div className="grid grid-cols-2 gap-2">
              <InputField label="Volume (mL)" value={v1} onChange={setV1} type="number" suffix="mL" />
              <InputField label="Concentration (%)" value={c1} onChange={setC1} type="number" suffix="%" />
            </div>
            <InputField label="Target Concentration (%)" value={targetConc} onChange={setTargetConc} type="number" suffix="%" />
          </>}
          {mode === "concentration" && <>
            <InputField label="Solute Mass (g)" value={soluteMass} onChange={setSoluteMass} type="number" suffix="g" />
            <InputField label="Solution Volume (mL)" value={solVolume} onChange={setSolVolume} type="number" suffix="mL" />
            <InputField label="Molar Mass (g/mol)" value={solMolarMass} onChange={setSolMolarMass} type="number" suffix="g/mol" />
          </>}
        </InputPanel>
      }
      results={
        mode === "mix" ? (
          <ResultPanel label="Final Concentration" primary={`${sFmt(mixResult.finalConc)}%`}
            summaries={<>
              <SummaryCard label="Total Volume" value={`${sFmt(mixResult.totalVol)} mL`} accent="text-green-500" />
              <SummaryCard label="Pure Solute" value={`${sFmt(mixResult.pureAmount)} mL`} />
            </>}
            tip={sanitizerTip ? "✅ Great for Hand Sanitizer! WHO recommends 60–80% alcohol." : undefined}
          >
            <BreakdownRow label="Total Volume" value={`${sFmt(mixResult.totalVol)} mL`} dot="bg-blue-400" bold />
            <BreakdownRow label="Final Concentration" value={`${sFmt(mixResult.finalConc)}%`} dot="bg-green-500" bold />
            <BreakdownRow label="Pure Solute" value={`${sFmt(mixResult.pureAmount)} mL`} dot="bg-cyan-400" />
            {[30, 40, 50].map(target => {
              const fv = (mixResult.pureAmount / target) * 100;
              const w = fv - mixResult.totalVol;
              return w > 0 ? <BreakdownRow key={target} label={`→ add water for ${target}%`} value={`${sFmt(w)} mL`} dot="bg-amber-400" /> : null;
            })}
          </ResultPanel>
        ) : mode === "dilute" ? (
          <ResultPanel label="Water to Add" primary={dilResult ? `${sFmt(dilResult.waterToAdd)} mL` : "—"}
            summaries={<>
              <SummaryCard label="Final Volume" value={dilResult ? `${sFmt(dilResult.finalVol)} mL` : "—"} accent="text-green-500" />
              <SummaryCard label="Target" value={`${targetConc}%`} />
            </>}
            tip={!dilResult ? "Target concentration must be lower than current." : undefined}
          >
            {dilResult ? <>
              <BreakdownRow label="Initial Volume" value={`${v1} mL`} dot="bg-blue-400" />
              <BreakdownRow label="Initial Concentration" value={`${c1}%`} dot="bg-amber-400" />
              <BreakdownRow label="Pure Solute" value={`${sFmt(dilResult.pureAmount)} mL`} dot="bg-cyan-400" />
              <BreakdownRow label="Water to Add" value={`${sFmt(dilResult.waterToAdd)} mL`} dot="bg-green-500" bold />
              <BreakdownRow label="Final Volume" value={`${sFmt(dilResult.finalVol)} mL`} dot="bg-purple-400" />
            </> : <BreakdownRow label="Status" value="Invalid — target ≥ current concentration" dot="bg-red-400" />}
          </ResultPanel>
        ) : (
          <ResultPanel label="Molarity" primary={`${sFmt(concResult.molarity, 4)} M`}
            summaries={<>
              <SummaryCard label="w/v %" value={`${sFmt(concResult.wv, 4)}%`} accent="text-green-500" />
              <SummaryCard label="PPM" value={`${sFmt(concResult.ppm, 2)}`} />
            </>}
          >
            <BreakdownRow label="w/v %" value={`${sFmt(concResult.wv, 4)}%`} dot="bg-blue-400" />
            <BreakdownRow label="Molarity" value={`${sFmt(concResult.molarity, 4)} M`} dot="bg-green-500" bold />
            <BreakdownRow label="PPM" value={`${sFmt(concResult.ppm, 2)} mg/L`} dot="bg-amber-400" />
          </ResultPanel>
        )
      }
    />
  );
}

type Element = {
  symbol: string; name: string; atomic: number; mass: number;
  electrons: string; density: string; meltPt: string; boilPt: string;
  group: string; category: string; uses: string[];
};

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
  { symbol:"Ca", name:"Calcium",     atomic:20,  mass:40.078,  electrons:"2,8,8,2", density:"1.55 g/cm³",   meltPt:"842°C",    boilPt:"1484°C",   group:"2",  category:"Alkaline earth", uses:["Bones & teeth","Cement","Antacids","Steel production"] },
  { symbol:"Fe", name:"Iron",        atomic:26,  mass:55.845,  electrons:"2,8,14,2",density:"7.874 g/cm³",  meltPt:"1538°C",   boilPt:"2861°C",   group:"8",  category:"Transition",     uses:["Steel (buildings)","Magnets","Blood hemoglobin","Cast iron"] },
  { symbol:"Cu", name:"Copper",      atomic:29,  mass:63.546,  electrons:"2,8,18,1",density:"8.96 g/cm³",   meltPt:"1085°C",   boilPt:"2562°C",   group:"11", category:"Transition",     uses:["Electrical wiring","Plumbing","Currency coins","Brass alloys"] },
  { symbol:"Zn", name:"Zinc",        atomic:30,  mass:65.38,   electrons:"2,8,18,2",density:"7.133 g/cm³",  meltPt:"419.5°C",  boilPt:"907°C",    group:"12", category:"Transition",     uses:["Galvanizing steel","Batteries","Sunscreen","Dietary supplement"] },
  { symbol:"Br", name:"Bromine",     atomic:35,  mass:79.904,  electrons:"2,8,18,7",density:"3.122 g/cm³",  meltPt:"-7.2°C",   boilPt:"58.8°C",   group:"17", category:"Halogen",        uses:["Flame retardants","Photography","Medicines","Fumigants"] },
  { symbol:"Ag", name:"Silver",      atomic:47,  mass:107.868, electrons:"2,8,18,18,1",density:"10.49 g/cm³",meltPt:"961.8°C",boilPt:"2162°C",  group:"11", category:"Transition",     uses:["Jewelry","Photography","Electronics","Antibacterial coatings"] },
  { symbol:"I",  name:"Iodine",      atomic:53,  mass:126.904, electrons:"2,8,18,18,7",density:"4.933 g/cm³",meltPt:"113.7°C",boilPt:"184.3°C",  group:"17", category:"Halogen",        uses:["Thyroid health","Antiseptic","Photography","Table salt additive"] },
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
  { symbol:"Sr", name:"Strontium",   atomic:38,  mass:87.62,   electrons:"2,8,18,8,2",density:"2.64 g/cm³", meltPt:"777°C",    boilPt:"1382°C",   group:"2",  category:"Alkaline earth", uses:["Fireworks (red)","Bone density studies","TV tubes (old)"] },
  { symbol:"Mo", name:"Molybdenum",  atomic:42,  mass:95.96,   electrons:"2,8,18,13,1",density:"10.22 g/cm³",meltPt:"2623°C",  boilPt:"4639°C",   group:"6",  category:"Transition",     uses:["High-strength steels","Lubricants","Catalysts","Electronics"] },
  { symbol:"Pd", name:"Palladium",   atomic:46,  mass:106.42,  electrons:"2,8,18,18,0",density:"12.023 g/cm³",meltPt:"1554.9°C",boilPt:"2963°C",  group:"10", category:"Transition",     uses:["Catalytic converters","Hydrogen storage","Electronics","Jewelry"] },
  { symbol:"W",  name:"Tungsten",    atomic:74,  mass:183.84,  electrons:"2,8,18,32,12,2",density:"19.3 g/cm³",meltPt:"3422°C", boilPt:"5555°C",   group:"6",  category:"Transition",     uses:["Light bulb filaments","Cutting tools","X-ray tubes","Military"] },
  { symbol:"Bi", name:"Bismuth",     atomic:83,  mass:208.98,  electrons:"2,8,18,32,18,5",density:"9.807 g/cm³",meltPt:"271.4°C",boilPt:"1564°C",  group:"15", category:"Post-transition",uses:["Cosmetics","Pepto-Bismol","Low-melt alloys","Fire sprinklers"] },
  { symbol:"Xe", name:"Xenon",       atomic:54,  mass:131.293, electrons:"2,8,18,18,8",density:"5.894 g/L",  meltPt:"-111.8°C", boilPt:"-108.1°C", group:"18", category:"Noble gas",      uses:["Flash lamps","Ion propulsion","Anaesthesia","Headlights (HID)"] },
  { symbol:"Kr", name:"Krypton",     atomic:36,  mass:83.798,  electrons:"2,8,18,8",  density:"3.749 g/L",  meltPt:"-157.4°C", boilPt:"-153.4°C", group:"18", category:"Noble gas",      uses:["Photography flash","Laser eye surgery","Fluorescent lamps"] },
  { symbol:"Ra", name:"Radium",      atomic:88,  mass:226,     electrons:"2,8,18,32,18,8,2",density:"5.5 g/cm³",meltPt:"700°C", boilPt:"1737°C",   group:"2",  category:"Alkaline earth", uses:["Historical cancer treatment","Radium watches (historical)","Research"] },
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
    <DesktopToolGrid
      inputs={
        <InputPanel title="Periodic Table Search" icon={BookOpen} iconColor="bg-indigo-500">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search element, symbol or number..."
              data-testid="input-element-search"
              className="w-full pl-9 pr-4 py-2.5 bg-muted/30 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {categories.slice(0, 6).map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                className={`px-2 py-1 text-[10px] font-semibold rounded-lg transition-all border ${filterCat === cat ? "bg-indigo-500 text-white border-indigo-500" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1 max-h-52 overflow-y-auto">
            {filtered.map(el => (
              <button key={el.symbol} onClick={() => setSelected(el)} data-testid={`element-${el.symbol}`}
                className={`p-2 rounded-xl border text-center transition-all hover:border-indigo-500/40 ${selected?.symbol === el.symbol ? "bg-indigo-500/20 border-indigo-500/40" : "bg-muted/30 border-border/50"}`}>
                <div className="text-xs font-bold text-foreground">{el.symbol}</div>
                <div className="text-[9px] text-muted-foreground">{el.atomic}</div>
              </button>
            ))}
          </div>
        </InputPanel>
      }
      results={
        selected ? (
          <ResultPanel label={selected.name} primary={selected.symbol} primarySub={`Z = ${selected.atomic}`}
            summaries={<>
              <SummaryCard label="Category" value={selected.category} />
              <SummaryCard label="Molar Mass" value={`${selected.mass} g/mol`} accent="text-indigo-500" />
            </>}
          >
            <BreakdownRow label="Symbol" value={selected.symbol} dot="bg-indigo-400" bold />
            <BreakdownRow label="Atomic Number" value={`${selected.atomic}`} dot="bg-blue-400" />
            <BreakdownRow label="Molar Mass" value={`${selected.mass} g/mol`} dot="bg-green-400" />
            <BreakdownRow label="Electrons" value={selected.electrons} dot="bg-amber-400" />
            <BreakdownRow label="Density" value={selected.density} dot="bg-purple-400" />
            <BreakdownRow label="Melting Pt." value={selected.meltPt} dot="bg-orange-400" />
            <BreakdownRow label="Boiling Pt." value={selected.boilPt} dot="bg-red-400" />
            <BreakdownRow label="Group" value={selected.group} dot="bg-cyan-400" />
            <BreakdownRow label="Uses" value={selected.uses.slice(0, 2).join(", ")} dot="bg-pink-400" />
          </ResultPanel>
        ) : (
          <ResultPanel label="Element" primary="Select an element" />
        )
      }
    />
  );
}

function OhmsLaw() {
  const [voltage, setVoltage] = useState("12");
  const [current, setCurrent] = useState("2");
  const [resistance, setResistance] = useState("");

  const v = parseFloat(voltage) || 0;
  const i = parseFloat(current) || 0;
  const r = parseFloat(resistance) || 0;

  let resType = "", resValue = 0, resUnit = "";
  let power = 0;
  if (voltage && current && !resistance) {
    resType = "Resistance"; resValue = v / i; resUnit = "Ω";
    power = v * i;
  } else if (voltage && resistance && !current) {
    resType = "Current"; resValue = v / r; resUnit = "A";
    power = v * (v / r);
  } else if (current && resistance && !voltage) {
    resType = "Voltage"; resValue = i * r; resUnit = "V";
    power = i * i * r;
  }

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Ohm's Law (V = I × R)" icon={Zap} iconColor="bg-yellow-500">
          <p className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-xl">Enter any two values to calculate the third.</p>
          <InputField label="Voltage (V)" value={voltage} onChange={setVoltage} type="number" suffix="V" />
          <InputField label="Current (I)" value={current} onChange={setCurrent} type="number" suffix="A" />
          <InputField label="Resistance (R)" value={resistance} onChange={setResistance} type="number" suffix="Ω" />
        </InputPanel>
      }
      results={
        <ResultPanel label={resType || "Result"} primary={resType ? `${sFmt(resValue, 4)} ${resUnit}` : "Enter two values"}
          summaries={<>
            <SummaryCard label="Power" value={`${sFmt(power, 2)} W`} accent="text-yellow-500" />
            <SummaryCard label="Formula" value="V = I × R" />
          </>}
          tip="Power = V × I = I² × R = V² / R"
        >
          {resType && <>
            <BreakdownRow label={resType} value={`${sFmt(resValue, 4)} ${resUnit}`} dot="bg-yellow-400" bold />
            {voltage && <BreakdownRow label="Voltage" value={`${voltage} V`} dot="bg-blue-400" />}
            {current && <BreakdownRow label="Current" value={`${current} A`} dot="bg-green-400" />}
            {resistance && <BreakdownRow label="Resistance" value={`${resistance} Ω`} dot="bg-amber-400" />}
            <BreakdownRow label="Power" value={`${sFmt(power, 4)} W`} dot="bg-red-400" bold />
          </>}
        </ResultPanel>
      }
    />
  );
}

function MolarMass() {
  const [formula, setFormula] = useState("H2O");

  const masses: Record<string, number> = {
    H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.81, C: 12.01, N: 14.01, O: 16.00,
    F: 19.00, Ne: 20.18, Na: 22.99, Mg: 24.31, Al: 26.98, Si: 28.09, P: 30.97, S: 32.07,
    Cl: 35.45, Ar: 39.95, K: 39.10, Ca: 40.08, Fe: 55.85, Cu: 63.55, Zn: 65.38, Br: 79.90, I: 126.9
  };

  const breakdown = useMemo(() => {
    const result: { element: string; count: number; mass: number }[] = [];
    let total = 0;
    const regex = /([A-Z][a-z]?)(\d*)/g;
    let match;
    while ((match = regex.exec(formula)) !== null) {
      const el = match[1]; const count = parseInt(match[2]) || 1;
      if (masses[el]) {
        total += masses[el] * count;
        result.push({ element: el, count, mass: masses[el] * count });
      }
    }
    return { result, total };
  }, [formula]);

  const examples = ["H2O", "NaCl", "C6H12O6", "H2SO4", "CH4", "CO2", "NH3"];

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Molar Mass Calculator" icon={FlaskConical} iconColor="bg-green-500">
          <InputField label="Chemical Formula" value={formula} onChange={setFormula} placeholder="e.g., H2O" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Quick Examples</label>
            <div className="flex gap-1.5 flex-wrap">
              {examples.map(ex => (
                <button key={ex} onClick={() => setFormula(ex)} className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${formula === ex ? "bg-green-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{ex}</button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Molar Mass" primary={`${breakdown.total.toFixed(3)} g/mol`}
          summaries={<>
            <SummaryCard label="Formula" value={formula} accent="text-green-500" />
            <SummaryCard label="Elements" value={`${breakdown.result.length}`} />
          </>}
          tip="Molar mass = sum of atomic masses × count for each element in the formula."
        >
          {breakdown.result.map((r, i) => (
            <BreakdownRow key={i} label={`${r.element} × ${r.count}`} value={`${r.mass.toFixed(3)} g/mol`} dot="bg-green-400" bold={r.count > 1} />
          ))}
          <BreakdownRow label="Total" value={`${breakdown.total.toFixed(3)} g/mol`} dot="bg-emerald-500" bold />
        </ResultPanel>
      }
    />
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
  const vSq = initial * initial + 2 * accel * s;
  const avgV = (initial + v) / 2;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="SUVAT Parameters" icon={Atom} iconColor="bg-purple-500">
          <InputField label="Initial Velocity (u)" value={u} onChange={setU} type="number" suffix="m/s" />
          <InputField label="Acceleration (a)" value={a} onChange={setA} type="number" suffix="m/s²" />
          <InputField label="Time (t)" value={t} onChange={setT} type="number" suffix="s" />
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-400 font-mono space-y-1">
            <p>v = u + at</p>
            <p>s = ut + ½at²</p>
            <p>v² = u² + 2as</p>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Final Velocity" primary={`${v.toFixed(2)} m/s`}
          summaries={<>
            <SummaryCard label="Distance" value={`${s.toFixed(2)} m`} accent="text-purple-500" />
            <SummaryCard label="Avg Velocity" value={`${avgV.toFixed(2)} m/s`} />
          </>}
        >
          <BreakdownRow label="v = u + at" value={`${v.toFixed(2)} m/s`} dot="bg-purple-400" bold />
          <BreakdownRow label="s = ut + ½at²" value={`${s.toFixed(2)} m`} dot="bg-blue-400" bold />
          <BreakdownRow label="v² = u² + 2as" value={`${vSq.toFixed(2)} m²/s²`} dot="bg-amber-400" />
          <BreakdownRow label="Average Velocity" value={`${avgV.toFixed(2)} m/s`} dot="bg-cyan-400" />
        </ResultPanel>
      }
    />
  );
}

function TemperatureConverter() {
  const [celsius, setCelsius] = useState("25");

  const c = parseFloat(celsius) || 0;
  const f = (c * 9 / 5) + 32;
  const k = c + 273.15;
  const r = f + 459.67;
  const tempDesc = c < 0 ? "Below freezing" : c < 20 ? "Cold" : c < 30 ? "Comfortable" : c < 40 ? "Hot" : "Very Hot";

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Temperature Input" icon={Thermometer} iconColor="bg-red-500">
          <InputField label="Temperature in Celsius" value={celsius} onChange={setCelsius} type="number" suffix="°C" />
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 space-y-1">
            <p>0°C = 32°F = 273.15K (Water freezes)</p>
            <p>100°C = 212°F = 373.15K (Water boils)</p>
            <p>37°C = 98.6°F = 310.15K (Body temp)</p>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Fahrenheit" primary={`${f.toFixed(2)} °F`}
          summaries={<>
            <SummaryCard label="Kelvin" value={`${k.toFixed(2)} K`} accent="text-red-500" />
            <SummaryCard label="Feel" value={tempDesc} />
          </>}
        >
          <BreakdownRow label="Celsius" value={`${c} °C`} dot="bg-blue-400" />
          <BreakdownRow label="Fahrenheit" value={`${f.toFixed(2)} °F`} dot="bg-red-400" bold />
          <BreakdownRow label="Kelvin" value={`${k.toFixed(2)} K`} dot="bg-purple-400" bold />
          <BreakdownRow label="Rankine" value={`${r.toFixed(2)} °R`} dot="bg-amber-400" />
        </ResultPanel>
      }
    />
  );
}

function DensityCalculator() {
  const [mass, setMass] = useState("100");
  const [volume, setVolume] = useState("10");
  const [mode, setMode] = useState("density");

  const m = parseFloat(mass) || 0;
  const v = parseFloat(volume) || 0;
  const density = v > 0 ? m / v : 0;

  const knownDensities = [
    { name: "Water", d: 1.0 }, { name: "Ice", d: 0.92 }, { name: "Iron", d: 7.87 },
    { name: "Aluminum", d: 2.7 }, { name: "Gold", d: 19.3 }, { name: "Wood (oak)", d: 0.8 },
  ];

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Density Inputs" icon={Scale} iconColor="bg-teal-500">
          <InputField label="Mass" value={mass} onChange={setMass} type="number" suffix="g" />
          <InputField label="Volume" value={volume} onChange={setVolume} type="number" suffix="cm³" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Reference Densities</label>
            <div className="grid grid-cols-2 gap-1.5">
              {knownDensities.map(k => (
                <div key={k.name} className="flex justify-between p-2 bg-muted/30 rounded-lg">
                  <span className="text-xs text-muted-foreground">{k.name}</span>
                  <span className="text-xs font-mono text-teal-400">{k.d} g/cm³</span>
                </div>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Density" primary={`${density.toFixed(4)} g/cm³`}
          summaries={<>
            <SummaryCard label="Formula" value="ρ = m / V" accent="text-teal-500" />
            <SummaryCard label="vs Water" value={density < 1 ? "Floats" : "Sinks"} />
          </>}
          tip={`Density = ${m} g ÷ ${v} cm³ = ${density.toFixed(4)} g/cm³. ${density < 1 ? "Less dense than water — it floats!" : "Denser than water — it sinks."}`}
        >
          <BreakdownRow label="Mass" value={`${m} g`} dot="bg-blue-400" />
          <BreakdownRow label="Volume" value={`${v} cm³`} dot="bg-amber-400" />
          <BreakdownRow label="Density" value={`${density.toFixed(4)} g/cm³`} dot="bg-teal-400" bold />
          <BreakdownRow label="kg/m³" value={`${(density * 1000).toFixed(1)} kg/m³`} dot="bg-purple-400" />
          <BreakdownRow label="vs Water" value={density < 1 ? "Floats ✓" : "Sinks"} dot={density < 1 ? "bg-green-500" : "bg-red-500"} />
        </ResultPanel>
      }
    />
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

  const f = (n: number, d = 4) => (isNaN(n) || !isFinite(n) ? "—" : parseFloat(n.toFixed(d)).toString());

  const getCategory = (ph: number) => ph < 3 ? "Strongly Acidic" : ph < 6 ? "Weakly Acidic" : ph <= 7.5 ? "Neutral" : ph <= 11 ? "Weakly Basic" : "Strongly Basic";
  const getExamples = (ph: number) => ph < 2.5 ? "Stomach acid, lemon juice" : ph < 4 ? "Vinegar, coffee" : ph < 6.5 ? "Milk, rain water" : ph <= 7.5 ? "Pure water, blood" : ph <= 8.5 ? "Sea water, baking soda" : ph <= 12 ? "Ammonia, soapy water" : "Bleach, drain cleaner";

  const getResult = () => {
    if (mode === "ph-to-h") {
      const ph = parseFloat(phValue) || 0;
      const h = Math.pow(10, -ph); const oh = Math.pow(10, -(14 - ph)); const poh = 14 - ph;
      return { primary: ph.toFixed(2), label: "pH", rows: [
        { label: "[H⁺] Concentration", value: `${h.toExponential(4)} M` },
        { label: "[OH⁻] Concentration", value: `${oh.toExponential(4)} M` },
        { label: "pOH", value: f(poh, 2) },
        { label: "Nature", value: getCategory(ph) },
        { label: "Example", value: getExamples(ph) },
      ], phVal: ph };
    } else if (mode === "h-to-ph") {
      const hC = parseFloat(hConc) || 0;
      const ph = hC > 0 ? -Math.log10(hC) : 0;
      const poh = 14 - ph; const oh = Math.pow(10, -poh);
      return { primary: f(ph, 4), label: "pH", rows: [
        { label: "pH", value: f(ph, 4) }, { label: "pOH", value: f(poh, 4) },
        { label: "[OH⁻]", value: `${oh.toExponential(4)} M` },
        { label: "Nature", value: getCategory(ph) },
      ], phVal: ph };
    } else if (mode === "dilution") {
      const ci = parseFloat(c1) || 0; const vi = parseFloat(v1) || 0; const vf = parseFloat(v2) || 0;
      const cf = vf > 0 ? (ci * vi) / vf : 0;
      const pf = cf > 0 ? -Math.log10(cf) : 0;
      return { primary: f(pf, 4), label: "Final pH", rows: [
        { label: "C₁" , value: `${ci} M` }, { label: "V₁", value: `${vi} mL` },
        { label: "V₂", value: `${vf} mL` },
        { label: "C₂ = C₁V₁/V₂", value: `${cf.toExponential(4)} M` },
        { label: "Final pH", value: f(pf, 4) },
      ], phVal: pf };
    } else {
      const pH = parseFloat(pka) + Math.log10((parseFloat(baseConc) || 0) / (parseFloat(acidConc) || 1));
      return { primary: f(pH, 4), label: "Buffer pH", rows: [
        { label: "pKa", value: pka }, { label: "[Base]", value: `${baseConc} M` },
        { label: "[Acid]", value: `${acidConc} M` },
        { label: "Buffer pH (H-H)", value: f(pH, 4) },
        { label: "Nature", value: getCategory(pH) },
      ], phVal: pH };
    }
  };

  const res = getResult();

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="pH Calculator" icon={Droplets} iconColor="bg-violet-500">
          <ModeSelector modes={[{ id: "ph-to-h", label: "pH → [H⁺]" }, { id: "h-to-ph", label: "[H⁺] → pH" }, { id: "dilution", label: "Dilution" }, { id: "buffer", label: "Buffer pH" }]} active={mode} onChange={v => setMode(v as typeof mode)} />
          {mode === "ph-to-h" && <InputField label="pH Value" value={phValue} onChange={setPhValue} type="number" placeholder="7" />}
          {mode === "h-to-ph" && <InputField label="[H⁺] Concentration (M)" value={hConc} onChange={setHConc} type="number" placeholder="0.001" />}
          {mode === "dilution" && <>
            <InputField label="Initial Concentration (M)" value={c1} onChange={setC1} type="number" />
            <InputField label="Initial Volume (mL)" value={v1} onChange={setV1} type="number" />
            <InputField label="Final Volume (mL)" value={v2} onChange={setV2} type="number" />
          </>}
          {mode === "buffer" && <>
            <InputField label="pKa of Acid" value={pka} onChange={setPka} type="number" placeholder="4.76" />
            <InputField label="[Acid] (M)" value={acidConc} onChange={setAcidConc} type="number" />
            <InputField label="[Conjugate Base] (M)" value={baseConc} onChange={setBaseConc} type="number" />
          </>}
          <div className="relative h-5 rounded-full overflow-hidden" style={{ background: "linear-gradient(to right,#ff0000,#ff6600,#ffcc00,#66cc00,#00aa00,#0066cc,#0000ff,#6600cc)" }}>
            <div className="absolute top-0 h-full w-0.5 bg-white shadow" style={{ left: `${Math.min(100, Math.max(0, ((res.phVal || 7) / 14) * 100))}%` }} />
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label={res.label} primary={res.primary}
          summaries={<>
            <SummaryCard label="Nature" value={getCategory(res.phVal || 7)} accent="text-violet-500" />
            <SummaryCard label="Example" value={getExamples(res.phVal || 7)} />
          </>}
        >
          {res.rows.map((r, i) => (
            <BreakdownRow key={i} label={r.label} value={r.value} dot="bg-violet-400" bold={i === 0} />
          ))}
        </ResultPanel>
      }
    />
  );
}
