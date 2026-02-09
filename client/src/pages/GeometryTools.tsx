import { useState, useMemo } from "react";
import {
  Circle,
  Square,
  Triangle,
  Box,
  Hexagon,
  Calculator,
  Compass,
  Move,
  TrendingUp,
  Pentagon,
  Diamond,
  Cone,
} from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "2d-shapes" | "3d-shapes" | "distance" | "slope";

const tools = [
  { id: "2d-shapes", label: "2D Shapes", icon: Pentagon },
  { id: "3d-shapes", label: "3D Shapes", icon: Box },
  { id: "distance", label: "Distance", icon: Move },
  { id: "slope", label: "Slope", icon: TrendingUp },
];

export default function GeometryTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("2d-shapes");

  const renderTool = () => {
    switch (activeTool) {
      case "2d-shapes": return <Shapes2D />;
      case "3d-shapes": return <Shapes3D />;
      case "distance": return <DistanceCalculator />;
      case "slope": return <SlopeCalculator />;
      default: return null;
    }
  };

  return (
    <PageWrapper
      title="Geometry Tools"
      subtitle="2D/3D shapes, distance, slope with global units"
      accentColor="bg-cyan-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {renderTool()}
    </PageWrapper>
  );
}

function ModeToggle({ modes, mode, setMode }: { modes: { id: string; label: string }[]; mode: string; setMode: (m: string) => void }) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-xl mb-4 flex-wrap">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          data-testid={`mode-${m.id}`}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === m.id ? "bg-cyan-500 text-white shadow-sm" : "text-muted-foreground"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

function SolverInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <input
        type="number"
        inputMode="decimal"
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
          <span className="font-bold text-cyan-500 mr-1">Step {i + 1}:</span> {s}
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
        <span className="text-2xl font-bold text-cyan-500" data-testid="text-result">{value}</span>
        {unit && <span className="ml-1 text-xs font-medium text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

function MultiResult({ results }: { results: { label: string; value: string }[] }) {
  return (
    <div className="space-y-2">
      {results.map((r, i) => (
        <div key={i} className="flex justify-between items-center p-2.5 bg-muted/30 rounded-xl">
          <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
          <span className="text-sm font-bold text-cyan-500" data-testid={`result-${i}`}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function fmt(n: number, decimals = 4): string {
  if (Number.isNaN(n) || !Number.isFinite(n)) return "\u2014";
  return parseFloat(n.toFixed(decimals)).toLocaleString();
}

const LENGTH_UNITS = [
  { value: "mm", label: "Millimeter (mm)", factor: 0.001 },
  { value: "cm", label: "Centimeter (cm)", factor: 0.01 },
  { value: "m", label: "Meter (m)", factor: 1 },
  { value: "km", label: "Kilometer (km)", factor: 1000 },
  { value: "in", label: "Inch (in)", factor: 0.0254 },
  { value: "ft", label: "Foot (ft)", factor: 0.3048 },
  { value: "yd", label: "Yard (yd)", factor: 0.9144 },
  { value: "mi", label: "Mile (mi)", factor: 1609.34 },
];

const AREA_UNITS = [
  { value: "mm2", label: "mm\u00B2", factor: 0.000001 },
  { value: "cm2", label: "cm\u00B2", factor: 0.0001 },
  { value: "m2", label: "m\u00B2", factor: 1 },
  { value: "km2", label: "km\u00B2", factor: 1000000 },
  { value: "in2", label: "in\u00B2", factor: 0.00064516 },
  { value: "ft2", label: "ft\u00B2", factor: 0.092903 },
  { value: "yd2", label: "yd\u00B2", factor: 0.836127 },
  { value: "ac", label: "Acre", factor: 4046.86 },
  { value: "ha", label: "Hectare", factor: 10000 },
  { value: "bigha", label: "Bigha (India)", factor: 2529.29 },
  { value: "gunta", label: "Guntha (India)", factor: 101.17 },
  { value: "cent", label: "Cent (India)", factor: 40.4686 },
];

const VOLUME_UNITS = [
  { value: "mm3", label: "mm\u00B3", factor: 0.000000001 },
  { value: "cm3", label: "cm\u00B3", factor: 0.000001 },
  { value: "m3", label: "m\u00B3", factor: 1 },
  { value: "in3", label: "in\u00B3", factor: 0.0000163871 },
  { value: "ft3", label: "ft\u00B3", factor: 0.0283168 },
  { value: "l", label: "Liter (L)", factor: 0.001 },
  { value: "ml", label: "Milliliter (mL)", factor: 0.000001 },
  { value: "gal_us", label: "US Gallon", factor: 0.00378541 },
  { value: "gal_uk", label: "UK Gallon", factor: 0.00454609 },
];

const getF = (units: typeof LENGTH_UNITS, u: string) => units.find(x => x.value === u)?.factor || 1;
const getLbl = (units: typeof LENGTH_UNITS, u: string) => units.find(x => x.value === u)?.label || u;
const lenOpts = LENGTH_UNITS.map(u => ({ value: u.value, label: u.label }));
const areaOpts = AREA_UNITS.map(u => ({ value: u.value, label: u.label }));
const volOpts = VOLUME_UNITS.map(u => ({ value: u.value, label: u.label }));

function Shapes2D() {
  const [shape, setShape] = useState("circle");
  const [inputUnit, setInputUnit] = useState("cm");
  const [areaUnit, setAreaUnit] = useState("cm2");
  const [perimUnit, setPerimUnit] = useState("cm");

  const [radius, setRadius] = useState("5");
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("6");
  const [sideA, setSideA] = useState("3");
  const [sideB, setSideB] = useState("4");
  const [sideC, setSideC] = useState("5");
  const [triBase, setTriBase] = useState("6");
  const [triHeight, setTriHeight] = useState("4");
  const [side, setSide] = useState("5");
  const [sides, setSides] = useState("6");
  const [d1, setD1] = useState("10");
  const [d2, setD2] = useState("8");
  const [pBase, setPBase] = useState("8");
  const [pTop, setPTop] = useState("5");
  const [pHeight, setPHeight] = useState("4");
  const [pSide1, setPSide1] = useState("5");
  const [pSide2, setPSide2] = useState("5");
  const [semiMajor, setSemiMajor] = useState("6");
  const [semiMinor, setSemiMinor] = useState("4");
  const [arcRadius, setArcRadius] = useState("5");
  const [arcAngle, setArcAngle] = useState("90");

  const inM = (v: string) => (parseFloat(v) || 0) * getF(LENGTH_UNITS, inputUnit);
  const toArea = (sqm: number) => sqm / getF(AREA_UNITS, areaUnit);
  const toLen = (m: number) => m / getF(LENGTH_UNITS, perimUnit);

  const result = useMemo(() => {
    const iF = getF(LENGTH_UNITS, inputUnit);
    const iLbl = getLbl(LENGTH_UNITS, inputUnit);
    const aLbl = getLbl(AREA_UNITS, areaUnit);
    const pLbl = getLbl(LENGTH_UNITS, perimUnit);

    switch (shape) {
      case "circle": {
        const r = inM(radius);
        const area = Math.PI * r * r;
        const circ = 2 * Math.PI * r;
        const diam = 2 * r;
        return {
          results: [
            { label: "Area", value: `${fmt(toArea(area))} ${aLbl}` },
            { label: "Circumference", value: `${fmt(toLen(circ))} ${pLbl}` },
            { label: "Diameter", value: `${fmt(toLen(diam))} ${pLbl}` },
          ],
          steps: [
            `Radius = ${radius} ${iLbl} = ${fmt(r)} m`,
            `Area = \u03C0 \u00D7 r\u00B2 = \u03C0 \u00D7 ${fmt(r)}\u00B2 = ${fmt(area)} m\u00B2 = ${fmt(toArea(area))} ${aLbl}`,
            `Circumference = 2\u03C0r = 2 \u00D7 \u03C0 \u00D7 ${fmt(r)} = ${fmt(circ)} m = ${fmt(toLen(circ))} ${pLbl}`,
            `Diameter = 2r = ${fmt(diam)} m = ${fmt(toLen(diam))} ${pLbl}`,
          ],
        };
      }
      case "rectangle": {
        const l = inM(length);
        const w = inM(width);
        const area = l * w;
        const perim = 2 * (l + w);
        const diag = Math.sqrt(l * l + w * w);
        return {
          results: [
            { label: "Area", value: `${fmt(toArea(area))} ${aLbl}` },
            { label: "Perimeter", value: `${fmt(toLen(perim))} ${pLbl}` },
            { label: "Diagonal", value: `${fmt(toLen(diag))} ${pLbl}` },
          ],
          steps: [
            `Length = ${length} ${iLbl}, Width = ${width} ${iLbl}`,
            `Area = L \u00D7 W = ${fmt(l)} \u00D7 ${fmt(w)} = ${fmt(area)} m\u00B2 = ${fmt(toArea(area))} ${aLbl}`,
            `Perimeter = 2(L + W) = 2(${fmt(l)} + ${fmt(w)}) = ${fmt(perim)} m = ${fmt(toLen(perim))} ${pLbl}`,
            `Diagonal = \u221A(L\u00B2 + W\u00B2) = ${fmt(diag)} m = ${fmt(toLen(diag))} ${pLbl}`,
          ],
        };
      }
      case "square": {
        const s = inM(side);
        const area = s * s;
        const perim = 4 * s;
        const diag = s * Math.sqrt(2);
        return {
          results: [
            { label: "Area", value: `${fmt(toArea(area))} ${aLbl}` },
            { label: "Perimeter", value: `${fmt(toLen(perim))} ${pLbl}` },
            { label: "Diagonal", value: `${fmt(toLen(diag))} ${pLbl}` },
          ],
          steps: [
            `Side = ${side} ${iLbl} = ${fmt(s)} m`,
            `Area = s\u00B2 = ${fmt(s)}\u00B2 = ${fmt(area)} m\u00B2 = ${fmt(toArea(area))} ${aLbl}`,
            `Perimeter = 4s = 4 \u00D7 ${fmt(s)} = ${fmt(perim)} m = ${fmt(toLen(perim))} ${pLbl}`,
            `Diagonal = s\u221A2 = ${fmt(diag)} m = ${fmt(toLen(diag))} ${pLbl}`,
          ],
        };
      }
      case "triangle-sides": {
        const a = inM(sideA), b = inM(sideB), c = inM(sideC);
        const valid = a + b > c && b + c > a && a + c > b;
        if (!valid) return { results: [{ label: "Error", value: "Invalid triangle sides" }], steps: ["The sum of any two sides must be greater than the third side"] };
        const sp = (a + b + c) / 2;
        const area = Math.sqrt(sp * (sp - a) * (sp - b) * (sp - c));
        const perim = a + b + c;
        return {
          results: [
            { label: "Area (Heron's)", value: `${fmt(toArea(area))} ${aLbl}` },
            { label: "Perimeter", value: `${fmt(toLen(perim))} ${pLbl}` },
            { label: "Semi-perimeter", value: `${fmt(toLen(sp))} ${pLbl}` },
          ],
          steps: [
            `Sides: a=${sideA}, b=${sideB}, c=${sideC} ${iLbl}`,
            `s = (a+b+c)/2 = ${fmt(sp)} m`,
            `Area = \u221A[s(s-a)(s-b)(s-c)] = \u221A[${fmt(sp)}\u00D7${fmt(sp - a)}\u00D7${fmt(sp - b)}\u00D7${fmt(sp - c)}] = ${fmt(area)} m\u00B2 = ${fmt(toArea(area))} ${aLbl}`,
            `Perimeter = a+b+c = ${fmt(perim)} m = ${fmt(toLen(perim))} ${pLbl}`,
          ],
        };
      }
      case "triangle-bh": {
        const b = inM(triBase), h = inM(triHeight);
        const area = 0.5 * b * h;
        return {
          results: [
            { label: "Area", value: `${fmt(toArea(area))} ${aLbl}` },
          ],
          steps: [
            `Base = ${triBase} ${iLbl} = ${fmt(b)} m, Height = ${triHeight} ${iLbl} = ${fmt(h)} m`,
            `Area = \u00BD \u00D7 base \u00D7 height = 0.5 \u00D7 ${fmt(b)} \u00D7 ${fmt(h)} = ${fmt(area)} m\u00B2 = ${fmt(toArea(area))} ${aLbl}`,
          ],
        };
      }
      case "polygon": {
        const s = inM(side);
        const n = parseInt(sides) || 3;
        const area = (n * s * s) / (4 * Math.tan(Math.PI / n));
        const perim = n * s;
        const apothem = s / (2 * Math.tan(Math.PI / n));
        return {
          results: [
            { label: "Area", value: `${fmt(toArea(area))} ${aLbl}` },
            { label: "Perimeter", value: `${fmt(toLen(perim))} ${pLbl}` },
            { label: "Apothem", value: `${fmt(toLen(apothem))} ${pLbl}` },
          ],
          steps: [
            `Regular polygon: ${n} sides, each = ${side} ${iLbl} = ${fmt(s)} m`,
            `Perimeter = n \u00D7 s = ${n} \u00D7 ${fmt(s)} = ${fmt(perim)} m = ${fmt(toLen(perim))} ${pLbl}`,
            `Apothem = s / (2 \u00D7 tan(\u03C0/n)) = ${fmt(apothem)} m`,
            `Area = (n \u00D7 s\u00B2) / (4 \u00D7 tan(\u03C0/n)) = ${fmt(area)} m\u00B2 = ${fmt(toArea(area))} ${aLbl}`,
          ],
        };
      }
      case "rhombus": {
        const da = inM(d1), db = inM(d2);
        const area = 0.5 * da * db;
        const halfSide = Math.sqrt((da / 2) ** 2 + (db / 2) ** 2);
        const perim = 4 * halfSide;
        return {
          results: [
            { label: "Area", value: `${fmt(toArea(area))} ${aLbl}` },
            { label: "Perimeter", value: `${fmt(toLen(perim))} ${pLbl}` },
            { label: "Side", value: `${fmt(toLen(halfSide))} ${pLbl}` },
          ],
          steps: [
            `Diagonals: d1=${d1}, d2=${d2} ${iLbl}`,
            `Area = \u00BD \u00D7 d1 \u00D7 d2 = 0.5 \u00D7 ${fmt(da)} \u00D7 ${fmt(db)} = ${fmt(area)} m\u00B2 = ${fmt(toArea(area))} ${aLbl}`,
            `Side = \u221A((d1/2)\u00B2 + (d2/2)\u00B2) = ${fmt(halfSide)} m`,
            `Perimeter = 4 \u00D7 side = ${fmt(perim)} m = ${fmt(toLen(perim))} ${pLbl}`,
          ],
        };
      }
      case "trapezoid": {
        const a = inM(pBase), b = inM(pTop), h = inM(pHeight);
        const s1 = inM(pSide1), s2 = inM(pSide2);
        const area = 0.5 * (a + b) * h;
        const perim = a + b + s1 + s2;
        return {
          results: [
            { label: "Area", value: `${fmt(toArea(area))} ${aLbl}` },
            { label: "Perimeter", value: `${fmt(toLen(perim))} ${pLbl}` },
          ],
          steps: [
            `Base = ${pBase}, Top = ${pTop}, Height = ${pHeight} ${iLbl}`,
            `Sides: ${pSide1}, ${pSide2} ${iLbl}`,
            `Area = \u00BD \u00D7 (a+b) \u00D7 h = 0.5 \u00D7 (${fmt(a)}+${fmt(b)}) \u00D7 ${fmt(h)} = ${fmt(area)} m\u00B2 = ${fmt(toArea(area))} ${aLbl}`,
            `Perimeter = a+b+s1+s2 = ${fmt(perim)} m = ${fmt(toLen(perim))} ${pLbl}`,
          ],
        };
      }
      case "ellipse": {
        const a = inM(semiMajor), b = inM(semiMinor);
        const area = Math.PI * a * b;
        const perimApprox = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
        return {
          results: [
            { label: "Area", value: `${fmt(toArea(area))} ${aLbl}` },
            { label: "Perimeter (approx)", value: `${fmt(toLen(perimApprox))} ${pLbl}` },
          ],
          steps: [
            `Semi-major axis a = ${semiMajor} ${iLbl} = ${fmt(a)} m`,
            `Semi-minor axis b = ${semiMinor} ${iLbl} = ${fmt(b)} m`,
            `Area = \u03C0ab = \u03C0 \u00D7 ${fmt(a)} \u00D7 ${fmt(b)} = ${fmt(area)} m\u00B2 = ${fmt(toArea(area))} ${aLbl}`,
            `Perimeter \u2248 \u03C0[3(a+b) - \u221A((3a+b)(a+3b))] = ${fmt(perimApprox)} m = ${fmt(toLen(perimApprox))} ${pLbl}`,
          ],
        };
      }
      case "sector": {
        const r = inM(arcRadius);
        const angle = parseFloat(arcAngle) || 0;
        const rad = (angle * Math.PI) / 180;
        const area = 0.5 * r * r * rad;
        const arcLen = r * rad;
        const perim = 2 * r + arcLen;
        return {
          results: [
            { label: "Sector Area", value: `${fmt(toArea(area))} ${aLbl}` },
            { label: "Arc Length", value: `${fmt(toLen(arcLen))} ${pLbl}` },
            { label: "Perimeter", value: `${fmt(toLen(perim))} ${pLbl}` },
          ],
          steps: [
            `Radius = ${arcRadius} ${iLbl} = ${fmt(r)} m, Angle = ${arcAngle}\u00B0`,
            `Angle in radians = ${arcAngle} \u00D7 \u03C0/180 = ${fmt(rad)} rad`,
            `Area = \u00BDr\u00B2\u03B8 = 0.5 \u00D7 ${fmt(r)}\u00B2 \u00D7 ${fmt(rad)} = ${fmt(area)} m\u00B2 = ${fmt(toArea(area))} ${aLbl}`,
            `Arc length = r\u03B8 = ${fmt(r)} \u00D7 ${fmt(rad)} = ${fmt(arcLen)} m = ${fmt(toLen(arcLen))} ${pLbl}`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [shape, inputUnit, areaUnit, perimUnit, radius, length, width, sideA, sideB, sideC, triBase, triHeight, side, sides, d1, d2, pBase, pTop, pHeight, pSide1, pSide2, semiMajor, semiMinor, arcRadius, arcAngle]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="2D Shapes \u2014 Area & Perimeter" icon={Pentagon} iconColor="bg-cyan-500">
        <ModeToggle
          modes={[
            { id: "circle", label: "Circle" },
            { id: "rectangle", label: "Rectangle" },
            { id: "square", label: "Square" },
            { id: "triangle-sides", label: "Triangle (Sides)" },
            { id: "triangle-bh", label: "Triangle (B\u00D7H)" },
            { id: "polygon", label: "Polygon" },
            { id: "rhombus", label: "Rhombus" },
            { id: "trapezoid", label: "Trapezoid" },
            { id: "ellipse", label: "Ellipse" },
            { id: "sector", label: "Sector" },
          ]}
          mode={shape} setMode={setShape}
        />
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <SolverSelect label="Input Unit" value={inputUnit} onChange={setInputUnit} options={lenOpts} />
            <SolverSelect label="Area Unit" value={areaUnit} onChange={setAreaUnit} options={areaOpts} />
            <SolverSelect label="Length Unit" value={perimUnit} onChange={setPerimUnit} options={lenOpts} />
          </div>

          {shape === "circle" && <SolverInput label="Radius" value={radius} onChange={setRadius} />}
          {shape === "rectangle" && (
            <>
              <SolverInput label="Length" value={length} onChange={setLength} />
              <SolverInput label="Width" value={width} onChange={setWidth} />
            </>
          )}
          {shape === "square" && <SolverInput label="Side" value={side} onChange={setSide} />}
          {shape === "triangle-sides" && (
            <div className="grid grid-cols-3 gap-2">
              <SolverInput label="Side A" value={sideA} onChange={setSideA} />
              <SolverInput label="Side B" value={sideB} onChange={setSideB} />
              <SolverInput label="Side C" value={sideC} onChange={setSideC} />
            </div>
          )}
          {shape === "triangle-bh" && (
            <>
              <SolverInput label="Base" value={triBase} onChange={setTriBase} />
              <SolverInput label="Height" value={triHeight} onChange={setTriHeight} />
            </>
          )}
          {shape === "polygon" && (
            <>
              <SolverInput label="Number of Sides" value={sides} onChange={setSides} />
              <SolverInput label="Side Length" value={side} onChange={setSide} />
            </>
          )}
          {shape === "rhombus" && (
            <>
              <SolverInput label="Diagonal 1" value={d1} onChange={setD1} />
              <SolverInput label="Diagonal 2" value={d2} onChange={setD2} />
            </>
          )}
          {shape === "trapezoid" && (
            <>
              <SolverInput label="Bottom Base" value={pBase} onChange={setPBase} />
              <SolverInput label="Top Base" value={pTop} onChange={setPTop} />
              <SolverInput label="Height" value={pHeight} onChange={setPHeight} />
              <div className="grid grid-cols-2 gap-2">
                <SolverInput label="Left Side" value={pSide1} onChange={setPSide1} />
                <SolverInput label="Right Side" value={pSide2} onChange={setPSide2} />
              </div>
            </>
          )}
          {shape === "ellipse" && (
            <>
              <SolverInput label="Semi-major Axis (a)" value={semiMajor} onChange={setSemiMajor} />
              <SolverInput label="Semi-minor Axis (b)" value={semiMinor} onChange={setSemiMinor} />
            </>
          )}
          {shape === "sector" && (
            <>
              <SolverInput label="Radius" value={arcRadius} onChange={setArcRadius} />
              <SolverInput label="Angle (degrees)" value={arcAngle} onChange={setArcAngle} />
            </>
          )}
        </div>
        <div className="mt-4 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      </ToolCard>
    </div>
  );
}

function Shapes3D() {
  const [shape, setShape] = useState("cube");
  const [inputUnit, setInputUnit] = useState("cm");
  const [saUnit, setSaUnit] = useState("cm2");
  const [volUnit, setVolUnit] = useState("cm3");

  const [side, setSide] = useState("5");
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("6");
  const [height, setHeight] = useState("4");
  const [radius, setRadius] = useState("5");
  const [radius2, setRadius2] = useState("3");
  const [slant, setSlant] = useState("7");
  const [semiA, setSemiA] = useState("6");
  const [semiB, setSemiB] = useState("4");
  const [semiC, setSemiC] = useState("3");
  const [baseEdge, setBaseEdge] = useState("5");
  const [pyrHeight, setPyrHeight] = useState("8");

  const inM = (v: string) => (parseFloat(v) || 0) * getF(LENGTH_UNITS, inputUnit);
  const toSA = (sqm: number) => sqm / getF(AREA_UNITS, saUnit);
  const toVol = (cbm: number) => cbm / getF(VOLUME_UNITS, volUnit);

  const result = useMemo(() => {
    const iLbl = getLbl(LENGTH_UNITS, inputUnit);
    const sLbl = getLbl(AREA_UNITS, saUnit);
    const vLbl = getLbl(VOLUME_UNITS, volUnit);

    switch (shape) {
      case "cube": {
        const s = inM(side);
        const vol = s ** 3;
        const sa = 6 * s ** 2;
        const diag = s * Math.sqrt(3);
        return {
          results: [
            { label: "Volume", value: `${fmt(toVol(vol))} ${vLbl}` },
            { label: "Surface Area", value: `${fmt(toSA(sa))} ${sLbl}` },
            { label: "Space Diagonal", value: `${fmt(diag / getF(LENGTH_UNITS, inputUnit))} ${iLbl}` },
          ],
          steps: [
            `Side = ${side} ${iLbl} = ${fmt(s)} m`,
            `Volume = s\u00B3 = ${fmt(s)}\u00B3 = ${fmt(vol)} m\u00B3 = ${fmt(toVol(vol))} ${vLbl}`,
            `Surface Area = 6s\u00B2 = 6 \u00D7 ${fmt(s)}\u00B2 = ${fmt(sa)} m\u00B2 = ${fmt(toSA(sa))} ${sLbl}`,
            `Diagonal = s\u221A3 = ${fmt(diag)} m`,
          ],
        };
      }
      case "cuboid": {
        const l = inM(length), w = inM(width), h = inM(height);
        const vol = l * w * h;
        const sa = 2 * (l * w + w * h + l * h);
        const diag = Math.sqrt(l ** 2 + w ** 2 + h ** 2);
        return {
          results: [
            { label: "Volume", value: `${fmt(toVol(vol))} ${vLbl}` },
            { label: "Surface Area", value: `${fmt(toSA(sa))} ${sLbl}` },
            { label: "Space Diagonal", value: `${fmt(diag / getF(LENGTH_UNITS, inputUnit))} ${iLbl}` },
          ],
          steps: [
            `L=${length}, W=${width}, H=${height} ${iLbl}`,
            `Volume = L\u00D7W\u00D7H = ${fmt(l)}\u00D7${fmt(w)}\u00D7${fmt(h)} = ${fmt(vol)} m\u00B3 = ${fmt(toVol(vol))} ${vLbl}`,
            `SA = 2(LW+WH+LH) = ${fmt(sa)} m\u00B2 = ${fmt(toSA(sa))} ${sLbl}`,
            `Diagonal = \u221A(L\u00B2+W\u00B2+H\u00B2) = ${fmt(diag)} m`,
          ],
        };
      }
      case "sphere": {
        const r = inM(radius);
        const vol = (4 / 3) * Math.PI * r ** 3;
        const sa = 4 * Math.PI * r ** 2;
        return {
          results: [
            { label: "Volume", value: `${fmt(toVol(vol))} ${vLbl}` },
            { label: "Surface Area", value: `${fmt(toSA(sa))} ${sLbl}` },
          ],
          steps: [
            `Radius = ${radius} ${iLbl} = ${fmt(r)} m`,
            `Volume = (4/3)\u03C0r\u00B3 = (4/3) \u00D7 \u03C0 \u00D7 ${fmt(r)}\u00B3 = ${fmt(vol)} m\u00B3 = ${fmt(toVol(vol))} ${vLbl}`,
            `Surface Area = 4\u03C0r\u00B2 = 4 \u00D7 \u03C0 \u00D7 ${fmt(r)}\u00B2 = ${fmt(sa)} m\u00B2 = ${fmt(toSA(sa))} ${sLbl}`,
          ],
        };
      }
      case "hemisphere": {
        const r = inM(radius);
        const vol = (2 / 3) * Math.PI * r ** 3;
        const curved = 2 * Math.PI * r ** 2;
        const total = 3 * Math.PI * r ** 2;
        return {
          results: [
            { label: "Volume", value: `${fmt(toVol(vol))} ${vLbl}` },
            { label: "Curved SA", value: `${fmt(toSA(curved))} ${sLbl}` },
            { label: "Total SA", value: `${fmt(toSA(total))} ${sLbl}` },
          ],
          steps: [
            `Radius = ${radius} ${iLbl} = ${fmt(r)} m`,
            `Volume = (2/3)\u03C0r\u00B3 = ${fmt(vol)} m\u00B3 = ${fmt(toVol(vol))} ${vLbl}`,
            `Curved SA = 2\u03C0r\u00B2 = ${fmt(curved)} m\u00B2`,
            `Total SA = 3\u03C0r\u00B2 = ${fmt(total)} m\u00B2 = ${fmt(toSA(total))} ${sLbl}`,
          ],
        };
      }
      case "cylinder": {
        const r = inM(radius), h = inM(height);
        const vol = Math.PI * r ** 2 * h;
        const lateral = 2 * Math.PI * r * h;
        const total = 2 * Math.PI * r * (r + h);
        return {
          results: [
            { label: "Volume", value: `${fmt(toVol(vol))} ${vLbl}` },
            { label: "Lateral SA", value: `${fmt(toSA(lateral))} ${sLbl}` },
            { label: "Total SA", value: `${fmt(toSA(total))} ${sLbl}` },
          ],
          steps: [
            `Radius = ${radius} ${iLbl}, Height = ${height} ${iLbl}`,
            `Volume = \u03C0r\u00B2h = \u03C0 \u00D7 ${fmt(r)}\u00B2 \u00D7 ${fmt(h)} = ${fmt(vol)} m\u00B3 = ${fmt(toVol(vol))} ${vLbl}`,
            `Lateral SA = 2\u03C0rh = ${fmt(lateral)} m\u00B2`,
            `Total SA = 2\u03C0r(r+h) = ${fmt(total)} m\u00B2 = ${fmt(toSA(total))} ${sLbl}`,
          ],
        };
      }
      case "cone": {
        const r = inM(radius), h = inM(height);
        const sl = Math.sqrt(r ** 2 + h ** 2);
        const vol = (1 / 3) * Math.PI * r ** 2 * h;
        const lateral = Math.PI * r * sl;
        const total = Math.PI * r * (r + sl);
        return {
          results: [
            { label: "Volume", value: `${fmt(toVol(vol))} ${vLbl}` },
            { label: "Slant Height", value: `${fmt(sl / getF(LENGTH_UNITS, inputUnit))} ${iLbl}` },
            { label: "Lateral SA", value: `${fmt(toSA(lateral))} ${sLbl}` },
            { label: "Total SA", value: `${fmt(toSA(total))} ${sLbl}` },
          ],
          steps: [
            `Radius = ${radius} ${iLbl}, Height = ${height} ${iLbl}`,
            `Slant height = \u221A(r\u00B2+h\u00B2) = ${fmt(sl)} m`,
            `Volume = (1/3)\u03C0r\u00B2h = ${fmt(vol)} m\u00B3 = ${fmt(toVol(vol))} ${vLbl}`,
            `Lateral SA = \u03C0r\u00D7slant = ${fmt(lateral)} m\u00B2`,
            `Total SA = \u03C0r(r+slant) = ${fmt(total)} m\u00B2 = ${fmt(toSA(total))} ${sLbl}`,
          ],
        };
      }
      case "frustum": {
        const R = inM(radius), r = inM(radius2), h = inM(height);
        const sl = Math.sqrt(h ** 2 + (R - r) ** 2);
        const vol = (Math.PI * h / 3) * (R ** 2 + r ** 2 + R * r);
        const lateral = Math.PI * (R + r) * sl;
        const total = lateral + Math.PI * R ** 2 + Math.PI * r ** 2;
        return {
          results: [
            { label: "Volume", value: `${fmt(toVol(vol))} ${vLbl}` },
            { label: "Slant Height", value: `${fmt(sl / getF(LENGTH_UNITS, inputUnit))} ${iLbl}` },
            { label: "Lateral SA", value: `${fmt(toSA(lateral))} ${sLbl}` },
            { label: "Total SA", value: `${fmt(toSA(total))} ${sLbl}` },
          ],
          steps: [
            `R=${radius}, r=${radius2}, H=${height} ${iLbl}`,
            `Slant = \u221A(h\u00B2+(R-r)\u00B2) = ${fmt(sl)} m`,
            `Volume = (\u03C0h/3)(R\u00B2+r\u00B2+Rr) = ${fmt(vol)} m\u00B3 = ${fmt(toVol(vol))} ${vLbl}`,
            `Lateral SA = \u03C0(R+r)\u00D7slant = ${fmt(lateral)} m\u00B2`,
            `Total SA = Lateral + \u03C0R\u00B2 + \u03C0r\u00B2 = ${fmt(total)} m\u00B2 = ${fmt(toSA(total))} ${sLbl}`,
          ],
        };
      }
      case "pyramid": {
        const a = inM(baseEdge), h = inM(pyrHeight);
        const vol = (1 / 3) * a ** 2 * h;
        const slantH = Math.sqrt(h ** 2 + (a / 2) ** 2);
        const baseArea = a ** 2;
        const lateralSA = 2 * a * slantH;
        const totalSA = baseArea + lateralSA;
        return {
          results: [
            { label: "Volume", value: `${fmt(toVol(vol))} ${vLbl}` },
            { label: "Slant Height", value: `${fmt(slantH / getF(LENGTH_UNITS, inputUnit))} ${iLbl}` },
            { label: "Lateral SA", value: `${fmt(toSA(lateralSA))} ${sLbl}` },
            { label: "Total SA", value: `${fmt(toSA(totalSA))} ${sLbl}` },
          ],
          steps: [
            `Base edge = ${baseEdge} ${iLbl}, Height = ${pyrHeight} ${iLbl}`,
            `Volume = (1/3) \u00D7 a\u00B2 \u00D7 h = ${fmt(vol)} m\u00B3 = ${fmt(toVol(vol))} ${vLbl}`,
            `Slant height = \u221A(h\u00B2+(a/2)\u00B2) = ${fmt(slantH)} m`,
            `Lateral SA = 2 \u00D7 a \u00D7 slant = ${fmt(lateralSA)} m\u00B2`,
            `Total SA = base + lateral = ${fmt(totalSA)} m\u00B2 = ${fmt(toSA(totalSA))} ${sLbl}`,
          ],
        };
      }
      case "torus": {
        const R = inM(radius), r = inM(radius2);
        const vol = 2 * Math.PI ** 2 * R * r ** 2;
        const sa = 4 * Math.PI ** 2 * R * r;
        return {
          results: [
            { label: "Volume", value: `${fmt(toVol(vol))} ${vLbl}` },
            { label: "Surface Area", value: `${fmt(toSA(sa))} ${sLbl}` },
          ],
          steps: [
            `Major radius R = ${radius} ${iLbl}, Minor radius r = ${radius2} ${iLbl}`,
            `Volume = 2\u03C0\u00B2Rr\u00B2 = ${fmt(vol)} m\u00B3 = ${fmt(toVol(vol))} ${vLbl}`,
            `SA = 4\u03C0\u00B2Rr = ${fmt(sa)} m\u00B2 = ${fmt(toSA(sa))} ${sLbl}`,
          ],
        };
      }
      case "ellipsoid": {
        const a = inM(semiA), b = inM(semiB), c = inM(semiC);
        const vol = (4 / 3) * Math.PI * a * b * c;
        const p = 1.6075;
        const saApprox = 4 * Math.PI * ((a ** p * b ** p + a ** p * c ** p + b ** p * c ** p) / 3) ** (1 / p);
        return {
          results: [
            { label: "Volume", value: `${fmt(toVol(vol))} ${vLbl}` },
            { label: "Surface Area (approx)", value: `${fmt(toSA(saApprox))} ${sLbl}` },
          ],
          steps: [
            `Semi-axes: a=${semiA}, b=${semiB}, c=${semiC} ${iLbl}`,
            `Volume = (4/3)\u03C0abc = ${fmt(vol)} m\u00B3 = ${fmt(toVol(vol))} ${vLbl}`,
            `SA \u2248 Knud Thomsen formula = ${fmt(saApprox)} m\u00B2 = ${fmt(toSA(saApprox))} ${sLbl}`,
          ],
        };
      }
      case "prism": {
        const b = inM(baseEdge), h = inM(pyrHeight), w = inM(width);
        const baseArea = (Math.sqrt(3) / 4) * b ** 2;
        const vol = baseArea * h;
        const lateralSA = 3 * b * h;
        const totalSA = 2 * baseArea + lateralSA;
        return {
          results: [
            { label: "Volume", value: `${fmt(toVol(vol))} ${vLbl}` },
            { label: "Base Area", value: `${fmt(toSA(baseArea))} ${sLbl}` },
            { label: "Total SA", value: `${fmt(toSA(totalSA))} ${sLbl}` },
          ],
          steps: [
            `Triangular prism: base edge = ${baseEdge} ${iLbl}, length = ${pyrHeight} ${iLbl}`,
            `Base area = (\u221A3/4) \u00D7 b\u00B2 = ${fmt(baseArea)} m\u00B2`,
            `Volume = base area \u00D7 length = ${fmt(vol)} m\u00B3 = ${fmt(toVol(vol))} ${vLbl}`,
            `Total SA = 2\u00D7base + 3\u00D7b\u00D7h = ${fmt(totalSA)} m\u00B2 = ${fmt(toSA(totalSA))} ${sLbl}`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [shape, inputUnit, saUnit, volUnit, side, length, width, height, radius, radius2, slant, semiA, semiB, semiC, baseEdge, pyrHeight]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="3D Shapes \u2014 Volume & Surface Area" icon={Box} iconColor="bg-cyan-500">
        <ModeToggle
          modes={[
            { id: "cube", label: "Cube" },
            { id: "cuboid", label: "Cuboid" },
            { id: "sphere", label: "Sphere" },
            { id: "hemisphere", label: "Hemisphere" },
            { id: "cylinder", label: "Cylinder" },
            { id: "cone", label: "Cone" },
            { id: "frustum", label: "Frustum" },
            { id: "pyramid", label: "Pyramid" },
            { id: "torus", label: "Torus" },
            { id: "ellipsoid", label: "Ellipsoid" },
            { id: "prism", label: "Tri. Prism" },
          ]}
          mode={shape} setMode={setShape}
        />
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <SolverSelect label="Input Unit" value={inputUnit} onChange={setInputUnit} options={lenOpts} />
            <SolverSelect label="Area Unit" value={saUnit} onChange={setSaUnit} options={areaOpts} />
            <SolverSelect label="Volume Unit" value={volUnit} onChange={setVolUnit} options={volOpts} />
          </div>

          {shape === "cube" && <SolverInput label="Side" value={side} onChange={setSide} />}
          {shape === "cuboid" && (
            <>
              <SolverInput label="Length" value={length} onChange={setLength} />
              <SolverInput label="Width" value={width} onChange={setWidth} />
              <SolverInput label="Height" value={height} onChange={setHeight} />
            </>
          )}
          {(shape === "sphere" || shape === "hemisphere") && <SolverInput label="Radius" value={radius} onChange={setRadius} />}
          {shape === "cylinder" && (
            <>
              <SolverInput label="Radius" value={radius} onChange={setRadius} />
              <SolverInput label="Height" value={height} onChange={setHeight} />
            </>
          )}
          {shape === "cone" && (
            <>
              <SolverInput label="Base Radius" value={radius} onChange={setRadius} />
              <SolverInput label="Height" value={height} onChange={setHeight} />
            </>
          )}
          {shape === "frustum" && (
            <>
              <SolverInput label="Top Radius (R)" value={radius} onChange={setRadius} />
              <SolverInput label="Bottom Radius (r)" value={radius2} onChange={setRadius2} />
              <SolverInput label="Height" value={height} onChange={setHeight} />
            </>
          )}
          {shape === "pyramid" && (
            <>
              <SolverInput label="Base Edge" value={baseEdge} onChange={setBaseEdge} />
              <SolverInput label="Height" value={pyrHeight} onChange={setPyrHeight} />
            </>
          )}
          {shape === "torus" && (
            <>
              <SolverInput label="Major Radius (R)" value={radius} onChange={setRadius} />
              <SolverInput label="Minor Radius (r)" value={radius2} onChange={setRadius2} />
            </>
          )}
          {shape === "ellipsoid" && (
            <>
              <SolverInput label="Semi-axis a" value={semiA} onChange={setSemiA} />
              <SolverInput label="Semi-axis b" value={semiB} onChange={setSemiB} />
              <SolverInput label="Semi-axis c" value={semiC} onChange={setSemiC} />
            </>
          )}
          {shape === "prism" && (
            <>
              <SolverInput label="Base Edge" value={baseEdge} onChange={setBaseEdge} />
              <SolverInput label="Prism Length" value={pyrHeight} onChange={setPyrHeight} />
            </>
          )}
        </div>
        <div className="mt-4 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      </ToolCard>
    </div>
  );
}

function DistanceCalculator() {
  const [mode, setMode] = useState("2d");
  const [unit, setUnit] = useState("m");
  const [resultUnit, setResultUnit] = useState("m");

  const [x1, setX1] = useState("1");
  const [y1, setY1] = useState("2");
  const [x2, setX2] = useState("4");
  const [y2, setY2] = useState("6");
  const [z1, setZ1] = useState("0");
  const [z2, setZ2] = useState("3");

  const [lat1, setLat1] = useState("28.6139");
  const [lon1, setLon1] = useState("77.2090");
  const [lat2, setLat2] = useState("40.7128");
  const [lon2, setLon2] = useState("-74.0060");

  const result = useMemo(() => {
    const uF = getF(LENGTH_UNITS, unit);
    const rF = getF(LENGTH_UNITS, resultUnit);
    const uLbl = getLbl(LENGTH_UNITS, unit);
    const rLbl = getLbl(LENGTH_UNITS, resultUnit);

    switch (mode) {
      case "2d": {
        const a = parseFloat(x1) || 0, b = parseFloat(y1) || 0;
        const c = parseFloat(x2) || 0, d = parseFloat(y2) || 0;
        const dx = (c - a) * uF, dy = (d - b) * uF;
        const dist = Math.sqrt(dx ** 2 + dy ** 2);
        const converted = dist / rF;
        const midX = (a + c) / 2, midY = (b + d) / 2;
        return {
          results: [
            { label: "Distance", value: `${fmt(converted)} ${rLbl}` },
            { label: "Midpoint", value: `(${fmt(midX)}, ${fmt(midY)})` },
            { label: "\u0394x", value: `${fmt((c - a))} ${uLbl}` },
            { label: "\u0394y", value: `${fmt((d - b))} ${uLbl}` },
          ],
          steps: [
            `Points: (${x1}, ${y1}) and (${x2}, ${y2}) in ${uLbl}`,
            `\u0394x = ${x2} - ${x1} = ${fmt(c - a)}, \u0394y = ${y2} - ${y1} = ${fmt(d - b)}`,
            `Distance = \u221A(\u0394x\u00B2 + \u0394y\u00B2) = \u221A(${fmt((c - a) ** 2)} + ${fmt((d - b) ** 2)})`,
            `= \u221A(${fmt((c - a) ** 2 + (d - b) ** 2)}) = ${fmt(Math.sqrt((c - a) ** 2 + (d - b) ** 2))} ${uLbl}`,
            `= ${fmt(converted)} ${rLbl}`,
            `Midpoint = ((${x1}+${x2})/2, (${y1}+${y2})/2) = (${fmt(midX)}, ${fmt(midY)})`,
          ],
        };
      }
      case "3d": {
        const a = parseFloat(x1) || 0, b = parseFloat(y1) || 0, e = parseFloat(z1) || 0;
        const c = parseFloat(x2) || 0, d = parseFloat(y2) || 0, f = parseFloat(z2) || 0;
        const dx = (c - a) * uF, dy = (d - b) * uF, dz = (f - e) * uF;
        const dist = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
        const converted = dist / rF;
        const midX = (a + c) / 2, midY = (b + d) / 2, midZ = (e + f) / 2;
        return {
          results: [
            { label: "Distance", value: `${fmt(converted)} ${rLbl}` },
            { label: "Midpoint", value: `(${fmt(midX)}, ${fmt(midY)}, ${fmt(midZ)})` },
          ],
          steps: [
            `Points: (${x1}, ${y1}, ${z1}) and (${x2}, ${y2}, ${z2}) in ${uLbl}`,
            `\u0394x=${fmt(c - a)}, \u0394y=${fmt(d - b)}, \u0394z=${fmt(f - e)}`,
            `Distance = \u221A(\u0394x\u00B2+\u0394y\u00B2+\u0394z\u00B2) = ${fmt(Math.sqrt((c - a) ** 2 + (d - b) ** 2 + (f - e) ** 2))} ${uLbl} = ${fmt(converted)} ${rLbl}`,
            `Midpoint = (${fmt(midX)}, ${fmt(midY)}, ${fmt(midZ)})`,
          ],
        };
      }
      case "geo": {
        const la1 = parseFloat(lat1) || 0, lo1 = parseFloat(lon1) || 0;
        const la2 = parseFloat(lat2) || 0, lo2 = parseFloat(lon2) || 0;
        const R = 6371000;
        const toRad = (d: number) => (d * Math.PI) / 180;
        const dLat = toRad(la2 - la1);
        const dLon = toRad(lo2 - lo1);
        const aa = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(la1)) * Math.cos(toRad(la2)) * Math.sin(dLon / 2) ** 2;
        const cc = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
        const distM = R * cc;
        const distKm = distM / 1000;
        const distMi = distM / 1609.34;
        return {
          results: [
            { label: "Distance (km)", value: `${fmt(distKm, 2)} km` },
            { label: "Distance (mi)", value: `${fmt(distMi, 2)} mi` },
            { label: "Distance (m)", value: `${fmt(distM, 0)} m` },
          ],
          steps: [
            `From: (${lat1}\u00B0, ${lon1}\u00B0) To: (${lat2}\u00B0, ${lon2}\u00B0)`,
            `Using Haversine formula with Earth radius = 6,371 km`,
            `\u0394lat = ${fmt(la2 - la1, 4)}\u00B0, \u0394lon = ${fmt(lo2 - lo1, 4)}\u00B0`,
            `a = sin\u00B2(\u0394lat/2) + cos(lat1)\u00D7cos(lat2)\u00D7sin\u00B2(\u0394lon/2)`,
            `c = 2 \u00D7 atan2(\u221Aa, \u221A(1-a)) = ${fmt(cc, 6)} rad`,
            `Distance = R \u00D7 c = ${fmt(distKm, 2)} km = ${fmt(distMi, 2)} mi`,
          ],
        };
      }
      case "manhattan": {
        const a = parseFloat(x1) || 0, b = parseFloat(y1) || 0;
        const c = parseFloat(x2) || 0, d = parseFloat(y2) || 0;
        const dx = Math.abs(c - a), dy = Math.abs(d - b);
        const distInput = dx + dy;
        const distM = distInput * uF;
        const converted = distM / rF;
        return {
          results: [
            { label: "Manhattan Distance", value: `${fmt(converted)} ${rLbl}` },
            { label: "Euclidean Distance", value: `${fmt(Math.sqrt(dx ** 2 + dy ** 2) * uF / rF)} ${rLbl}` },
          ],
          steps: [
            `Points: (${x1}, ${y1}) and (${x2}, ${y2}) in ${uLbl}`,
            `|x2-x1| = ${fmt(dx)}, |y2-y1| = ${fmt(dy)}`,
            `Manhattan = |x2-x1| + |y2-y1| = ${fmt(dx)} + ${fmt(dy)} = ${fmt(distInput)} ${uLbl} = ${fmt(converted)} ${rLbl}`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, unit, resultUnit, x1, y1, x2, y2, z1, z2, lat1, lon1, lat2, lon2]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Coordinate Distance Calculator" icon={Move} iconColor="bg-cyan-500">
        <ModeToggle
          modes={[
            { id: "2d", label: "2D Distance" },
            { id: "3d", label: "3D Distance" },
            { id: "geo", label: "Lat/Long (GPS)" },
            { id: "manhattan", label: "Manhattan" },
          ]}
          mode={mode} setMode={setMode}
        />
        <div className="space-y-3">
          {mode !== "geo" && (
            <div className="grid grid-cols-2 gap-2">
              <SolverSelect label="Input Unit" value={unit} onChange={setUnit} options={lenOpts} />
              <SolverSelect label="Result Unit" value={resultUnit} onChange={setResultUnit} options={lenOpts} />
            </div>
          )}
          {(mode === "2d" || mode === "manhattan") && (
            <>
              <p className="text-xs font-semibold text-muted-foreground">Point 1</p>
              <div className="grid grid-cols-2 gap-2">
                <SolverInput label="x\u2081" value={x1} onChange={setX1} />
                <SolverInput label="y\u2081" value={y1} onChange={setY1} />
              </div>
              <p className="text-xs font-semibold text-muted-foreground">Point 2</p>
              <div className="grid grid-cols-2 gap-2">
                <SolverInput label="x\u2082" value={x2} onChange={setX2} />
                <SolverInput label="y\u2082" value={y2} onChange={setY2} />
              </div>
            </>
          )}
          {mode === "3d" && (
            <>
              <p className="text-xs font-semibold text-muted-foreground">Point 1</p>
              <div className="grid grid-cols-3 gap-2">
                <SolverInput label="x\u2081" value={x1} onChange={setX1} />
                <SolverInput label="y\u2081" value={y1} onChange={setY1} />
                <SolverInput label="z\u2081" value={z1} onChange={setZ1} />
              </div>
              <p className="text-xs font-semibold text-muted-foreground">Point 2</p>
              <div className="grid grid-cols-3 gap-2">
                <SolverInput label="x\u2082" value={x2} onChange={setX2} />
                <SolverInput label="y\u2082" value={y2} onChange={setY2} />
                <SolverInput label="z\u2082" value={z2} onChange={setZ2} />
              </div>
            </>
          )}
          {mode === "geo" && (
            <>
              <p className="text-xs font-semibold text-muted-foreground">Location 1 (e.g. Delhi)</p>
              <div className="grid grid-cols-2 gap-2">
                <SolverInput label="Latitude" value={lat1} onChange={setLat1} />
                <SolverInput label="Longitude" value={lon1} onChange={setLon1} />
              </div>
              <p className="text-xs font-semibold text-muted-foreground">Location 2 (e.g. New York)</p>
              <div className="grid grid-cols-2 gap-2">
                <SolverInput label="Latitude" value={lat2} onChange={setLat2} />
                <SolverInput label="Longitude" value={lon2} onChange={setLon2} />
              </div>
            </>
          )}
        </div>
        <div className="mt-4 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      </ToolCard>
    </div>
  );
}

function SlopeCalculator() {
  const [mode, setMode] = useState("two-points");
  const [unit, setUnit] = useState("m");

  const [x1, setX1] = useState("1");
  const [y1, setY1] = useState("2");
  const [x2, setX2] = useState("5");
  const [y2, setY2] = useState("10");

  const [slopeVal, setSlopeVal] = useState("2");
  const [xPt, setXPt] = useState("3");
  const [yPt, setYPt] = useState("5");

  const [rise, setRise] = useState("6");
  const [run, setRun] = useState("3");

  const [angleVal, setAngleVal] = useState("45");

  const result = useMemo(() => {
    const uLbl = getLbl(LENGTH_UNITS, unit);

    switch (mode) {
      case "two-points": {
        const a = parseFloat(x1) || 0, b = parseFloat(y1) || 0;
        const c = parseFloat(x2) || 0, d = parseFloat(y2) || 0;
        if (c === a) return { results: [{ label: "Slope", value: "Undefined (vertical line)" }], steps: [`x1 = x2, so the line is vertical and slope is undefined`] };
        const m = (d - b) / (c - a);
        const angleDeg = Math.atan(m) * (180 / Math.PI);
        const perpSlope = m !== 0 ? -1 / m : Infinity;
        const yInt = b - m * a;
        const type = m > 0 ? "Positive (rising)" : m < 0 ? "Negative (falling)" : "Zero (horizontal)";
        return {
          results: [
            { label: "Slope (m)", value: fmt(m) },
            { label: "Angle", value: `${fmt(angleDeg, 2)}\u00B0` },
            { label: "Y-intercept", value: fmt(yInt) },
            { label: "Perpendicular Slope", value: Number.isFinite(perpSlope) ? fmt(perpSlope) : "0 (horizontal)" },
            { label: "Equation", value: `y = ${fmt(m)}x + ${fmt(yInt)}` },
            { label: "Type", value: type },
          ],
          steps: [
            `Points: (${x1}, ${y1}) and (${x2}, ${y2})`,
            `Slope m = (y\u2082-y\u2081)/(x\u2082-x\u2081) = (${y2}-${y1})/(${x2}-${x1}) = ${fmt(d - b)}/${fmt(c - a)} = ${fmt(m)}`,
            `Angle = arctan(m) = arctan(${fmt(m)}) = ${fmt(angleDeg, 2)}\u00B0`,
            `Y-intercept: b = y\u2081 - m\u00D7x\u2081 = ${y1} - ${fmt(m)}\u00D7${x1} = ${fmt(yInt)}`,
            `Equation: y = ${fmt(m)}x + ${fmt(yInt)}`,
            `Perpendicular slope = -1/m = ${Number.isFinite(perpSlope) ? fmt(perpSlope) : "0"}`,
          ],
        };
      }
      case "slope-point": {
        const m = parseFloat(slopeVal) || 0;
        const xp = parseFloat(xPt) || 0, yp = parseFloat(yPt) || 0;
        const yInt = yp - m * xp;
        const angleDeg = Math.atan(m) * (180 / Math.PI);
        const perpSlope = m !== 0 ? -1 / m : Infinity;
        return {
          results: [
            { label: "Equation", value: `y = ${fmt(m)}x + ${fmt(yInt)}` },
            { label: "Y-intercept", value: fmt(yInt) },
            { label: "Angle", value: `${fmt(angleDeg, 2)}\u00B0` },
            { label: "Perpendicular Slope", value: Number.isFinite(perpSlope) ? fmt(perpSlope) : "0" },
          ],
          steps: [
            `Slope m = ${slopeVal}, Point (${xPt}, ${yPt})`,
            `Point-slope form: y - y\u2081 = m(x - x\u2081)`,
            `y - ${yPt} = ${fmt(m)}(x - ${xPt})`,
            `y = ${fmt(m)}x - ${fmt(m * xp)} + ${yPt}`,
            `y = ${fmt(m)}x + ${fmt(yInt)}`,
            `Angle = arctan(${fmt(m)}) = ${fmt(angleDeg, 2)}\u00B0`,
          ],
        };
      }
      case "rise-run": {
        const rs = parseFloat(rise) || 0, rn = parseFloat(run) || 0;
        if (rn === 0) return { results: [{ label: "Slope", value: "Undefined" }], steps: ["Run is 0, slope is undefined (vertical)"] };
        const m = rs / rn;
        const angleDeg = Math.atan(m) * (180 / Math.PI);
        const grade = m * 100;
        return {
          results: [
            { label: "Slope (m)", value: fmt(m) },
            { label: "Angle", value: `${fmt(angleDeg, 2)}\u00B0` },
            { label: "Grade/Gradient", value: `${fmt(grade, 2)}%` },
            { label: "Ratio", value: `${fmt(rs)} : ${fmt(rn)}` },
          ],
          steps: [
            `Rise = ${rise} ${uLbl}, Run = ${run} ${uLbl}`,
            `Slope = Rise/Run = ${rise}/${run} = ${fmt(m)}`,
            `Angle = arctan(${fmt(m)}) = ${fmt(angleDeg, 2)}\u00B0`,
            `Grade = slope \u00D7 100 = ${fmt(grade, 2)}%`,
          ],
        };
      }
      case "angle": {
        const angle = parseFloat(angleVal) || 0;
        const rad = (angle * Math.PI) / 180;
        const m = Math.tan(rad);
        const grade = m * 100;
        const perpSlope = m !== 0 ? -1 / m : Infinity;
        return {
          results: [
            { label: "Slope (m)", value: fmt(m) },
            { label: "Grade/Gradient", value: `${fmt(grade, 2)}%` },
            { label: "Perpendicular Slope", value: Number.isFinite(perpSlope) ? fmt(perpSlope) : "0" },
          ],
          steps: [
            `Angle = ${angleVal}\u00B0`,
            `Radians = ${angleVal} \u00D7 \u03C0/180 = ${fmt(rad, 6)} rad`,
            `Slope = tan(${angleVal}\u00B0) = ${fmt(m)}`,
            `Grade = ${fmt(grade, 2)}%`,
            `Perpendicular slope = -1/m = ${Number.isFinite(perpSlope) ? fmt(perpSlope) : "0"}`,
          ],
        };
      }
      case "parallel-perp": {
        const m = parseFloat(slopeVal) || 0;
        const perpSlope = m !== 0 ? -1 / m : Infinity;
        const anglePar = Math.atan(m) * (180 / Math.PI);
        const anglePerp = Math.atan(Number.isFinite(perpSlope) ? perpSlope : 0) * (180 / Math.PI);
        return {
          results: [
            { label: "Parallel Slope", value: fmt(m) },
            { label: "Perpendicular Slope", value: Number.isFinite(perpSlope) ? fmt(perpSlope) : "Undefined (vertical)" },
            { label: "Parallel Angle", value: `${fmt(anglePar, 2)}\u00B0` },
            { label: "Perpendicular Angle", value: `${fmt(anglePerp, 2)}\u00B0` },
          ],
          steps: [
            `Given slope m = ${slopeVal}`,
            `Parallel lines have the same slope = ${fmt(m)}`,
            `Perpendicular slope = -1/m = ${Number.isFinite(perpSlope) ? fmt(perpSlope) : "undefined"}`,
            `m\u2081 \u00D7 m\u2082 = ${fmt(m)} \u00D7 ${Number.isFinite(perpSlope) ? fmt(perpSlope) : "undefined"} = -1`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, unit, x1, y1, x2, y2, slopeVal, xPt, yPt, rise, run, angleVal]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Slope Calculator" icon={TrendingUp} iconColor="bg-cyan-500">
        <ModeToggle
          modes={[
            { id: "two-points", label: "Two Points" },
            { id: "slope-point", label: "Slope + Point" },
            { id: "rise-run", label: "Rise/Run" },
            { id: "angle", label: "Angle" },
            { id: "parallel-perp", label: "Parallel/Perp" },
          ]}
          mode={mode} setMode={setMode}
        />
        <div className="space-y-3">
          {mode === "rise-run" && (
            <SolverSelect label="Unit" value={unit} onChange={setUnit} options={lenOpts} />
          )}
          {mode === "two-points" && (
            <>
              <p className="text-xs font-semibold text-muted-foreground">Point 1</p>
              <div className="grid grid-cols-2 gap-2">
                <SolverInput label="x\u2081" value={x1} onChange={setX1} />
                <SolverInput label="y\u2081" value={y1} onChange={setY1} />
              </div>
              <p className="text-xs font-semibold text-muted-foreground">Point 2</p>
              <div className="grid grid-cols-2 gap-2">
                <SolverInput label="x\u2082" value={x2} onChange={setX2} />
                <SolverInput label="y\u2082" value={y2} onChange={setY2} />
              </div>
            </>
          )}
          {mode === "slope-point" && (
            <>
              <SolverInput label="Slope (m)" value={slopeVal} onChange={setSlopeVal} />
              <div className="grid grid-cols-2 gap-2">
                <SolverInput label="x" value={xPt} onChange={setXPt} />
                <SolverInput label="y" value={yPt} onChange={setYPt} />
              </div>
            </>
          )}
          {mode === "rise-run" && (
            <>
              <SolverInput label="Rise (vertical change)" value={rise} onChange={setRise} />
              <SolverInput label="Run (horizontal change)" value={run} onChange={setRun} />
            </>
          )}
          {mode === "angle" && <SolverInput label="Angle (degrees)" value={angleVal} onChange={setAngleVal} />}
          {mode === "parallel-perp" && <SolverInput label="Given Slope (m)" value={slopeVal} onChange={setSlopeVal} />}
        </div>
        <div className="mt-4 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      </ToolCard>
    </div>
  );
}
