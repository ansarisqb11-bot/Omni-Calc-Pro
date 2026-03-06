import { useState } from "react";
import { motion } from "framer-motion";
import {
  Hammer, PaintBucket, LayoutGrid, Construction, Box, Calculator,
  Home, Layers, ArrowRightLeft, Mountain, TrendingUp, Truck
} from "lucide-react";
import { ToolCard, ResultDisplay } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type UnitSystem = "metric" | "imperial";
type ToolType =
  | "cement" | "paint" | "tile" | "brick" | "concrete"
  | "roofing" | "flooring" | "steel" | "plaster" | "excavation"
  | "staircase" | "gravel";

const FT = 0.3048;
const toM = (val: number, u: UnitSystem) => u === "imperial" ? val * FT : val;
const fromM = (val: number, u: UnitSystem) => u === "imperial" ? val / FT : val;
const toM2 = (val: number, u: UnitSystem) => u === "imperial" ? val * FT * FT : val;
const fromM2 = (val: number, u: UnitSystem) => u === "imperial" ? val / (FT * FT) : val;
const toM3 = (val: number, u: UnitSystem) => u === "imperial" ? val * FT * FT * FT : val;
const fromM3 = (val: number, u: UnitSystem) => u === "imperial" ? val / (FT * FT * FT) : val;
const toKg = (val: number, u: UnitSystem) => u === "imperial" ? val * 0.4536 : val;
const fromKg = (val: number, u: UnitSystem) => u === "imperial" ? val / 0.4536 : val;
const lenLabel = (u: UnitSystem) => u === "metric" ? "m" : "ft";
const areaLabel = (u: UnitSystem) => u === "metric" ? "sq.m" : "sq.ft";
const volLabel = (u: UnitSystem) => u === "metric" ? "m³" : "ft³";
const wtLabel = (u: UnitSystem) => u === "metric" ? "kg" : "lb";
const n2 = (v: number) => isNaN(v) || !isFinite(v) ? "—" : v.toFixed(2);
const n1 = (v: number) => isNaN(v) || !isFinite(v) ? "—" : v.toFixed(1);
const n0 = (v: number) => isNaN(v) || !isFinite(v) ? "—" : Math.ceil(v).toString();

function ModeToggle({ mode, onChange, labelA = "Normal Mode", labelB = "Reverse Mode", color = "bg-orange-500" }: {
  mode: "a" | "b"; onChange: (m: "a" | "b") => void;
  labelA?: string; labelB?: string; color?: string;
}) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-xl mb-4">
      {[{ key: "a" as const, label: labelA }, { key: "b" as const, label: labelB }].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${mode === key ? `${color} text-white` : "text-muted-foreground"}`}
          data-testid={`mode-${key}`}
        >
          {key === "b" && <ArrowRightLeft className="w-3.5 h-3.5" />}
          {label}
        </button>
      ))}
    </div>
  );
}

function Field({ label, value, onChange, unit, suffix, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  unit?: string; suffix?: string; hint?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">{label}</label>
      <div className="flex">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all"
          data-testid={`input-${label.toLowerCase().replace(/\s+/g, "-")}`}
        />
        {(unit || suffix) && (
          <span className="ml-2 px-3 py-2.5 bg-muted border border-border rounded-xl text-xs font-bold text-muted-foreground whitespace-nowrap shrink-0">
            {unit || suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground/60 mt-1">{hint}</p>}
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all"
        data-testid={`select-${label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Step({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
      <div>
        <span className="text-sm text-muted-foreground">{label}</span>
        {sub && <p className="text-xs text-muted-foreground/60">{sub}</p>}
      </div>
      <span className="font-bold text-foreground text-sm ml-4 text-right">{value}</span>
    </div>
  );
}

function Highlight({ label, value, color = "text-orange-400" }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-muted/60 rounded-xl p-4 text-center mt-3">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

export default function ConstructionTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("cement");
  const [unit, setUnit] = useState<UnitSystem>("metric");

  const tools = [
    { id: "cement", label: "Cement", icon: Box },
    { id: "paint", label: "Paint", icon: PaintBucket },
    { id: "tile", label: "Tiles", icon: LayoutGrid },
    { id: "brick", label: "Brick", icon: Layers },
    { id: "concrete", label: "Concrete", icon: Hammer },
    { id: "plaster", label: "Plaster", icon: Layers },
    { id: "roofing", label: "Roofing", icon: Home },
    { id: "flooring", label: "Flooring", icon: LayoutGrid },
    { id: "steel", label: "Steel Bar", icon: Construction },
    { id: "excavation", label: "Excavation", icon: Mountain },
    { id: "staircase", label: "Staircase", icon: TrendingUp },
    { id: "gravel", label: "Gravel/Fill", icon: Truck },
  ];

  return (
    <PageWrapper
      title="Construction Tools"
      subtitle="Building materials estimators"
      accentColor="bg-orange-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {/* Global unit toggle */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl mb-4 max-w-xs mx-auto">
        {(["metric", "imperial"] as UnitSystem[]).map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${unit === u ? "bg-orange-500 text-white" : "text-muted-foreground"}`}
            data-testid={`unit-${u}`}
          >
            {u === "metric" ? "Metric (m/kg)" : "Imperial (ft/lb)"}
          </button>
        ))}
      </div>

      {activeTool === "cement" && <CementCalc unit={unit} />}
      {activeTool === "paint" && <PaintCalc unit={unit} />}
      {activeTool === "tile" && <TileCalc unit={unit} />}
      {activeTool === "brick" && <BrickCalc unit={unit} />}
      {activeTool === "concrete" && <ConcreteCalc unit={unit} />}
      {activeTool === "plaster" && <PlasterCalc unit={unit} />}
      {activeTool === "roofing" && <RoofingCalc unit={unit} />}
      {activeTool === "flooring" && <FlooringCalc unit={unit} />}
      {activeTool === "steel" && <SteelCalc unit={unit} />}
      {activeTool === "excavation" && <ExcavationCalc unit={unit} />}
      {activeTool === "staircase" && <StaircaseCalc unit={unit} />}
      {activeTool === "gravel" && <GravelCalc unit={unit} />}
    </PageWrapper>
  );
}

function CementCalc({ unit }: { unit: UnitSystem }) {
  const [mode, setMode] = useState<"a" | "b">("a");
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("10");
  const [thickness, setThickness] = useState(unit === "metric" ? "0.15" : "0.5");
  const [ratio, setRatio] = useState("1:2:4");
  const [bags, setBags] = useState("50");

  const ll = lenLabel(unit);

  const calcForward = () => {
    const l = toM(parseFloat(length) || 0, unit);
    const w = toM(parseFloat(width) || 0, unit);
    const t = toM(parseFloat(thickness) || 0, unit);
    const vol = l * w * t;
    const dry = vol * 1.54;
    const parts = ratio.split(":").map(Number);
    const total = parts.reduce((a, b) => a + b, 0);
    const cementBags = (dry * (parts[0] / total)) / 0.035;
    const sand = dry * (parts[1] / total);
    const agg = dry * (parts[2] / total);
    return { vol, dry, cementBags, sand: fromM3(sand, unit), agg: fromM3(agg, unit) };
  };

  const calcReverse = () => {
    const b = parseFloat(bags) || 0;
    const parts = ratio.split(":").map(Number);
    const total = parts.reduce((a, b) => a + b, 0);
    const cPart = parts[0] / total;
    const dry = (b * 0.035) / cPart;
    const wet = dry / 1.54;
    const areaAt15cm = wet / 0.15;
    return { dry, wet, area: fromM2(areaAt15cm, unit), sand: fromM3(dry * (parts[1] / total), unit), agg: fromM3(dry * (parts[2] / total), unit) };
  };

  const r = mode === "a" ? calcForward() : null;
  const rb = mode === "b" ? calcReverse() : null;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} labelA="Area → Cement" labelB="Cement → Area" />
      <ToolCard title="Cement Calculator" icon={Box} iconColor="bg-amber-500">
        <div className="space-y-4">
          {mode === "a" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Length (${ll})`} value={length} onChange={setLength} />
                <Field label={`Width (${ll})`} value={width} onChange={setWidth} />
              </div>
              <Field label={`Thickness (${ll})`} value={thickness} onChange={setThickness} hint="Typical slab: 0.1–0.2m / 4–8in" />
            </>
          ) : (
            <Field label="Cement Bags (50 kg)" value={bags} onChange={setBags} unit="bags" />
          )}
          <SelectField
            label="Mix Ratio (Cement:Sand:Aggregate)"
            value={ratio}
            onChange={setRatio}
            options={[
              { value: "1:1.5:3", label: "M20 — 1:1.5:3 (Strong)" },
              { value: "1:2:4", label: "M15 — 1:2:4 (General)" },
              { value: "1:3:6", label: "M10 — 1:3:6 (Lean)" },
              { value: "1:4:8", label: "M7.5 — 1:4:8 (Lean Fill)" },
            ]}
          />
        </div>
      </ToolCard>
      <ToolCard title="Materials Required" icon={Calculator} iconColor="bg-emerald-500">
        {mode === "a" && r ? (
          <div className="space-y-1">
            <Step label="Wet Volume" value={`${n2(r.vol)} m³`} />
            <Step label="Dry Volume (×1.54)" value={`${n2(r.dry)} m³`} />
            <Step label={`Sand`} value={`${n2(r.sand)} ${unit === "metric" ? "m³" : "ft³"}`} />
            <Step label={`Aggregate`} value={`${n2(r.agg)} ${unit === "metric" ? "m³" : "ft³"}`} />
            <Highlight label="Cement Bags (50 kg each)" value={`${n0(r.cementBags)} bags`} color="text-amber-400" />
          </div>
        ) : rb ? (
          <div className="space-y-1">
            <Step label="Cement Bags Used" value={`${bags} bags`} />
            <Step label="Dry Volume" value={`${n2(rb.dry)} m³`} />
            <Step label="Wet Volume" value={`${n2(rb.wet)} m³`} />
            <Step label="Sand Needed" value={`${n2(rb.sand)} ${unit === "metric" ? "m³" : "ft³"}`} />
            <Step label="Aggregate Needed" value={`${n2(rb.agg)} ${unit === "metric" ? "m³" : "ft³"}`} />
            <Highlight label={`Area Coverable @ 15cm depth`} value={`${n1(rb.area)} ${areaLabel(unit)}`} color="text-emerald-400" />
          </div>
        ) : null}
      </ToolCard>
    </div>
  );
}

function PaintCalc({ unit }: { unit: UnitSystem }) {
  const [mode, setMode] = useState<"a" | "b">("a");
  const [length, setLength] = useState("12");
  const [width, setWidth] = useState("10");
  const [height, setHeight] = useState(unit === "metric" ? "3" : "10");
  const [doors, setDoors] = useState("2");
  const [windows, setWindows] = useState("3");
  const [coats, setCoats] = useState("2");
  const [coverage, setCoverage] = useState(unit === "metric" ? "12" : "130");
  const [availPaint, setAvailPaint] = useState("20");

  const ll = lenLabel(unit);
  const al = areaLabel(unit);

  const calcA = () => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const d = parseInt(doors) || 0;
    const wn = parseInt(windows) || 0;
    const c = parseInt(coats) || 1;
    const cov = parseFloat(coverage) || (unit === "metric" ? 12 : 130);
    const dA = unit === "metric" ? 2.1 * 0.9 * 10.764 : 22.5;
    const wA = unit === "metric" ? 1.2 * 1.0 * 10.764 : 12.9;
    const wallArea = 2 * (l + w) * h;
    const openings = d * (unit === "metric" ? 1.89 : 20.3) + wn * (unit === "metric" ? 1.2 : 12.9);
    const paintable = Math.max(0, wallArea - openings);
    const liters = (paintable * c) / cov;
    return { wallArea, openings, paintable, liters, gallons: liters * 0.2642 };
  };

  const calcB = () => {
    const avail = parseFloat(availPaint) || 0;
    const c = parseInt(coats) || 1;
    const cov = parseFloat(coverage) || (unit === "metric" ? 12 : 130);
    const area = (avail * cov) / c;
    return { area, gallons: avail * 0.2642 };
  };

  const rA = calcA();
  const rB = calcB();

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} labelA="Room → Paint Needed" labelB="Paint → Area Covered" color="bg-pink-500" />
      <ToolCard title="Paint Calculator" icon={PaintBucket} iconColor="bg-pink-500">
        <div className="space-y-4">
          {mode === "a" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Length (${ll})`} value={length} onChange={setLength} />
                <Field label={`Width (${ll})`} value={width} onChange={setWidth} />
              </div>
              <Field label={`Height (${ll})`} value={height} onChange={setHeight} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Doors" value={doors} onChange={setDoors} unit="nos" />
                <Field label="Windows" value={windows} onChange={setWindows} unit="nos" />
              </div>
            </>
          ) : (
            <Field label="Paint Available (Liters)" value={availPaint} onChange={setAvailPaint} unit="L" />
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="No. of Coats" value={coats} onChange={setCoats} unit="coats" />
            <Field label={`Coverage (${al}/L)`} value={coverage} onChange={setCoverage} hint={unit === "metric" ? "~12 sq.m/L" : "~130 sq.ft/L"} />
          </div>
        </div>
      </ToolCard>
      <ToolCard title="Results" icon={Calculator} iconColor="bg-emerald-500">
        {mode === "a" ? (
          <div className="space-y-1">
            <Step label="Total Wall Area" value={`${n1(rA.wallArea)} ${al}`} />
            <Step label="Deduction (Doors + Windows)" value={`${n1(rA.openings)} ${al}`} />
            <Step label="Paintable Area" value={`${n1(rA.paintable)} ${al}`} />
            <Highlight label={`Paint Needed (${coats} coat${coats !== "1" ? "s" : ""})`} value={`${n1(rA.liters)} L  /  ${n2(rA.gallons)} gal`} color="text-pink-400" />
          </div>
        ) : (
          <div className="space-y-1">
            <Step label="Paint Available" value={`${availPaint} L (${n2(rB.gallons)} gal)`} />
            <Highlight label={`Area Coverable (${coats} coat${coats !== "1" ? "s" : ""})`} value={`${n1(rB.area)} ${al}`} color="text-pink-400" />
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function TileCalc({ unit }: { unit: UnitSystem }) {
  const [mode, setMode] = useState<"a" | "b">("a");
  const [rL, setRL] = useState("5");
  const [rW, setRW] = useState("4");
  const [tileSize, setTileSize] = useState("0.6x0.6");
  const [wastage, setWastage] = useState("10");
  const [tilesOnHand, setTilesOnHand] = useState("100");

  const ll = lenLabel(unit);
  const al = areaLabel(unit);

  const tileSizes = [
    { value: "0.3x0.3", label: unit === "metric" ? "30×30 cm" : "12×12 in" },
    { value: "0.45x0.45", label: unit === "metric" ? "45×45 cm" : "18×18 in" },
    { value: "0.6x0.6", label: unit === "metric" ? "60×60 cm" : "24×24 in" },
    { value: "0.6x1.2", label: unit === "metric" ? "60×120 cm" : "24×48 in" },
    { value: "0.8x0.8", label: unit === "metric" ? "80×80 cm" : "32×32 in" },
    { value: "1.0x1.0", label: unit === "metric" ? "100×100 cm" : "40×40 in" },
    { value: "custom", label: "Custom Size" },
  ];
  const [customL, setCustomL] = useState("0.5");
  const [customW, setCustomW] = useState("0.5");

  const getTileM2 = () => {
    if (tileSize === "custom") {
      const tl = toM(parseFloat(customL) || 0, unit);
      const tw = toM(parseFloat(customW) || 0, unit);
      return tl * tw;
    }
    const [tl, tw] = tileSize.split("x").map(Number);
    return tl * tw;
  };

  const roomAreaM2 = toM2((parseFloat(rL) || 0) * (parseFloat(rW) || 0), unit);
  const tileAreaM2 = getTileM2();
  const tilesExact = tileAreaM2 > 0 ? roomAreaM2 / tileAreaM2 : 0;
  const tilesWithWaste = Math.ceil(tilesExact * (1 + (parseFloat(wastage) || 0) / 100));

  const areaFromTiles = () => {
    const t = parseInt(tilesOnHand) || 0;
    return fromM2(t * tileAreaM2, unit);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} labelA="Room → Tiles Needed" labelB="Tiles on Hand → Area" color="bg-blue-500" />
      <ToolCard title="Tile Calculator" icon={LayoutGrid} iconColor="bg-blue-500">
        <div className="space-y-4">
          {mode === "a" ? (
            <>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Room Dimensions</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Length (${ll})`} value={rL} onChange={setRL} />
                <Field label={`Width (${ll})`} value={rW} onChange={setRW} />
              </div>
            </>
          ) : (
            <Field label="Tiles on Hand" value={tilesOnHand} onChange={setTilesOnHand} unit="tiles" />
          )}
          <SelectField label="Tile Size" value={tileSize} onChange={setTileSize} options={tileSizes} />
          {tileSize === "custom" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label={`Tile Length (${ll})`} value={customL} onChange={setCustomL} />
              <Field label={`Tile Width (${ll})`} value={customW} onChange={setCustomW} />
            </div>
          )}
          {mode === "a" && <Field label="Wastage %" value={wastage} onChange={setWastage} unit="%" hint="Recommended: 10–15%" />}
        </div>
      </ToolCard>
      <ToolCard title="Tiles Required" icon={Calculator} iconColor="bg-emerald-500">
        {mode === "a" ? (
          <div className="space-y-1">
            <Step label="Room Area" value={`${n2(fromM2(roomAreaM2, unit))} ${al}`} />
            <Step label="Each Tile Area" value={`${n2(fromM2(tileAreaM2, unit))} ${al}`} />
            <Step label="Tiles (exact)" value={n2(tilesExact)} />
            <Highlight label={`Tiles with ${wastage}% wastage`} value={`${tilesWithWaste} tiles`} color="text-blue-400" />
          </div>
        ) : (
          <div className="space-y-1">
            <Step label="Tiles Available" value={`${tilesOnHand} tiles`} />
            <Step label="Each Tile Area" value={`${n2(fromM2(tileAreaM2, unit))} ${al}`} />
            <Highlight label="Area Coverable" value={`${n2(areaFromTiles())} ${al}`} color="text-blue-400" />
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function BrickCalc({ unit }: { unit: UnitSystem }) {
  const [mode, setMode] = useState<"a" | "b">("a");
  const [wL, setWL] = useState("10");
  const [wH, setWH] = useState("3");
  const [brickType, setBrickType] = useState("standard");
  const [wastage, setWastage] = useState("5");
  const [bricksOnHand, setBricksOnHand] = useState("1000");

  const ll = lenLabel(unit);
  const al = areaLabel(unit);

  const brickSizes: Record<string, { l: number; h: number; name: string }> = {
    standard: { l: 0.19, h: 0.057, name: "Standard (190×57mm)" },
    modular: { l: 0.194, h: 0.057, name: "Modular (194×57mm)" },
    jumbo: { l: 0.203, h: 0.067, name: "Jumbo (203×67mm)" },
    wire_cut: { l: 0.22, h: 0.073, name: "Wire Cut (220×73mm)" },
  };

  const mortar = 0.01;
  const b = brickSizes[brickType];
  const bricksPerM2 = 1 / ((b.l + mortar) * (b.h + mortar));
  const wallAreaM2 = toM2((parseFloat(wL) || 0) * (parseFloat(wH) || 0), unit);
  const exact = wallAreaM2 * bricksPerM2;
  const withWaste = Math.ceil(exact * (1 + (parseFloat(wastage) || 0) / 100));
  const areaFromBricks = fromM2((parseInt(bricksOnHand) || 0) / bricksPerM2, unit);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} labelA="Wall → Bricks Needed" labelB="Bricks on Hand → Wall Area" color="bg-red-500" />
      <ToolCard title="Brick Calculator" icon={Layers} iconColor="bg-red-500">
        <div className="space-y-4">
          {mode === "a" ? (
            <div className="grid grid-cols-2 gap-3">
              <Field label={`Wall Length (${ll})`} value={wL} onChange={setWL} />
              <Field label={`Wall Height (${ll})`} value={wH} onChange={setWH} />
            </div>
          ) : (
            <Field label="Bricks on Hand" value={bricksOnHand} onChange={setBricksOnHand} unit="bricks" />
          )}
          <SelectField label="Brick Type" value={brickType} onChange={setBrickType}
            options={Object.entries(brickSizes).map(([k, v]) => ({ value: k, label: v.name }))} />
          {mode === "a" && <Field label="Wastage %" value={wastage} onChange={setWastage} unit="%" />}
        </div>
      </ToolCard>
      <ToolCard title="Results" icon={Calculator} iconColor="bg-emerald-500">
        {mode === "a" ? (
          <div className="space-y-1">
            <Step label="Wall Area" value={`${n2(fromM2(wallAreaM2, unit))} ${al}`} />
            <Step label="Bricks per sq.m" value={`~${Math.ceil(bricksPerM2)}`} />
            <Step label="Exact Bricks" value={n0(exact)} />
            <Highlight label={`With ${wastage}% Wastage`} value={`${withWaste} bricks`} color="text-red-400" />
          </div>
        ) : (
          <div className="space-y-1">
            <Step label="Bricks Available" value={`${bricksOnHand}`} />
            <Step label="Bricks per sq.m" value={`~${Math.ceil(bricksPerM2)}`} />
            <Highlight label="Wall Area Coverable" value={`${n2(areaFromBricks)} ${al}`} color="text-red-400" />
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function ConcreteCalc({ unit }: { unit: UnitSystem }) {
  const [mode, setMode] = useState<"a" | "b">("a");
  const [length, setLength] = useState("5");
  const [width, setWidth] = useState("4");
  const [depth, setDepth] = useState(unit === "metric" ? "0.15" : "0.5");
  const [shape, setShape] = useState("slab");
  const [diameter, setDiameter] = useState("0.5");
  const [circleH, setCircleH] = useState("1");
  const [bags, setBags] = useState("20");
  const [mixRatio, setMixRatio] = useState("1:2:4");

  const ll = lenLabel(unit);
  const vl = volLabel(unit);

  const getVolumeM3 = () => {
    if (shape === "slab") {
      return toM3((parseFloat(length) || 0) * (parseFloat(width) || 0) * (parseFloat(depth) || 0), unit);
    } else if (shape === "column") {
      const r = toM(parseFloat(diameter) || 0, unit) / 2;
      const h = toM(parseFloat(circleH) || 0, unit);
      return Math.PI * r * r * h;
    } else {
      const r = toM(parseFloat(diameter) || 0, unit) / 2;
      return (4 / 3) * Math.PI * r * r * r;
    }
  };

  const volM3 = getVolumeM3();
  const bagsNeeded = Math.ceil(volM3 / 0.03);
  const cubicYards = volM3 * 1.308;
  const volFromBags = (parseInt(bags) || 0) * 0.03;
  const areaFromBags = fromM2(volFromBags / toM(parseFloat(depth) || 0.15, unit), unit);

  const parts = mixRatio.split(":").map(Number);
  const total = parts.reduce((a, b) => a + b, 0);
  const dry = volM3 * 1.54;
  const cBags = Math.ceil((dry * (parts[0] / total)) / 0.035);
  const sand = fromM3(dry * (parts[1] / total), unit);
  const agg = fromM3(dry * (parts[2] / total), unit);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} labelA="Dimensions → Volume" labelB="Bags → Area/Volume" />
      <ToolCard title="Concrete Calculator" icon={Hammer} iconColor="bg-gray-500">
        <div className="space-y-4">
          <SelectField label="Shape" value={shape} onChange={setShape} options={[
            { value: "slab", label: "Slab / Footing" },
            { value: "column", label: "Circular Column" },
            { value: "sphere", label: "Sphere" },
          ]} />
          {mode === "a" ? (
            shape === "slab" ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={`Length (${ll})`} value={length} onChange={setLength} />
                  <Field label={`Width (${ll})`} value={width} onChange={setWidth} />
                </div>
                <Field label={`Depth/Thickness (${ll})`} value={depth} onChange={setDepth} />
              </>
            ) : (
              <>
                <Field label={`Diameter (${ll})`} value={diameter} onChange={setDiameter} />
                {shape === "column" && <Field label={`Height (${ll})`} value={circleH} onChange={setCircleH} />}
              </>
            )
          ) : (
            <>
              <Field label="Bags (80lb/40kg premix)" value={bags} onChange={setBags} unit="bags" />
              <Field label={`Slab Depth (${ll})`} value={depth} onChange={setDepth} />
            </>
          )}
          {mode === "a" && (
            <SelectField label="Mix Ratio" value={mixRatio} onChange={setMixRatio} options={[
              { value: "1:1.5:3", label: "M20 — 1:1.5:3" },
              { value: "1:2:4", label: "M15 — 1:2:4" },
              { value: "1:3:6", label: "M10 — 1:3:6" },
            ]} />
          )}
        </div>
      </ToolCard>
      <ToolCard title="Results" icon={Calculator} iconColor="bg-emerald-500">
        {mode === "a" ? (
          <div className="space-y-1">
            <Step label={`Volume (${vl})`} value={n2(fromM3(volM3, unit))} />
            <Step label="Cubic Yards" value={n2(cubicYards)} />
            <Step label="Premix Bags needed" value={`${bagsNeeded} bags`} />
            <Step label="Cement Bags (50kg)" value={`${cBags} bags`} />
            <Step label={`Sand`} value={`${n2(sand)} ${volLabel(unit)}`} />
            <Step label={`Aggregate`} value={`${n2(agg)} ${volLabel(unit)}`} />
            <Highlight label="Total Volume" value={`${n2(fromM3(volM3, unit))} ${vl}`} />
          </div>
        ) : (
          <div className="space-y-1">
            <Step label="Bags Available" value={`${bags} bags`} />
            <Step label={`Volume Available`} value={`${n2(fromM3(volFromBags, unit))} ${vl}`} />
            <Highlight label="Area Coverable" value={`${n2(areaFromBags)} ${areaLabel(unit)}`} color="text-emerald-400" />
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function PlasterCalc({ unit }: { unit: UnitSystem }) {
  const [mode, setMode] = useState<"a" | "b">("a");
  const [wL, setWL] = useState("5");
  const [wH, setWH] = useState("3");
  const [thickness, setThickness] = useState("0.012");
  const [ratio, setRatio] = useState("1:4");
  const [bags, setBags] = useState("10");

  const ll = lenLabel(unit);
  const al = areaLabel(unit);

  const wallAreaM2 = toM2((parseFloat(wL) || 0) * (parseFloat(wH) || 0), unit);
  const thicknessM = toM(parseFloat(thickness) || 0, unit);
  const volM3 = wallAreaM2 * thicknessM;
  const dry = volM3 * 1.3;
  const parts = ratio.split(":").map(Number);
  const total = parts.reduce((a, b) => a + b, 0);
  const cBags = Math.ceil((dry * (parts[0] / total)) / 0.035);
  const sand = fromM3(dry * (parts[1] / total), unit);

  const bagToArea = () => {
    const b = parseInt(bags) || 0;
    const cPart = parts[0] / total;
    const d = (b * 0.035) / cPart;
    const w = d / 1.3;
    return fromM2(w / thicknessM, unit);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} labelA="Wall → Plaster Material" labelB="Bags → Wall Area" color="bg-yellow-500" />
      <ToolCard title="Plaster Calculator" icon={Layers} iconColor="bg-yellow-500">
        <div className="space-y-4">
          {mode === "a" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Wall Length (${ll})`} value={wL} onChange={setWL} />
                <Field label={`Wall Height (${ll})`} value={wH} onChange={setWH} />
              </div>
              <Field label={`Plaster Thickness (${ll})`} value={thickness} onChange={setThickness} hint="12mm inner / 20mm outer" />
            </>
          ) : (
            <>
              <Field label="Cement Bags (50kg)" value={bags} onChange={setBags} unit="bags" />
              <Field label={`Plaster Thickness (${ll})`} value={thickness} onChange={setThickness} />
            </>
          )}
          <SelectField label="Cement:Sand Mix Ratio" value={ratio} onChange={setRatio} options={[
            { value: "1:3", label: "1:3 (Inner Wall)" },
            { value: "1:4", label: "1:4 (Standard)" },
            { value: "1:5", label: "1:5 (Exterior)" },
            { value: "1:6", label: "1:6 (Rough)" },
          ]} />
        </div>
      </ToolCard>
      <ToolCard title="Materials Required" icon={Calculator} iconColor="bg-emerald-500">
        {mode === "a" ? (
          <div className="space-y-1">
            <Step label="Wall Area" value={`${n2(fromM2(wallAreaM2, unit))} ${al}`} />
            <Step label="Plaster Volume" value={`${n2(fromM3(volM3, unit))} ${volLabel(unit)}`} />
            <Step label="Sand Required" value={`${n2(sand)} ${volLabel(unit)}`} />
            <Highlight label="Cement Bags (50kg)" value={`${cBags} bags`} color="text-yellow-400" />
          </div>
        ) : (
          <div className="space-y-1">
            <Step label="Cement Bags Used" value={`${bags} bags`} />
            <Highlight label="Wall Area Coverable" value={`${n2(bagToArea())} ${al}`} color="text-yellow-400" />
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function RoofingCalc({ unit }: { unit: UnitSystem }) {
  const [mode, setMode] = useState<"a" | "b">("a");
  const [length, setLength] = useState("12");
  const [width, setWidth] = useState("8");
  const [pitch, setPitch] = useState("4");
  const [roofType, setRoofType] = useState("shingles");
  const [materialOnHand, setMaterialOnHand] = useState("50");

  const ll = lenLabel(unit);
  const al = areaLabel(unit);

  const pitchVal = parseFloat(pitch) || 0;
  const pitchFactor = Math.sqrt(1 + Math.pow(pitchVal / 12, 2));
  const baseAreaM2 = toM2((parseFloat(length) || 0) * (parseFloat(width) || 0), unit);
  const roofAreaM2 = baseAreaM2 * pitchFactor;

  const materials: Record<string, { calc: (a: number) => number; unit: string; name: string; reverse: (q: number) => number }> = {
    shingles: {
      name: "Shingles", unit: "bundles",
      calc: (a) => Math.ceil((a / 9.29) * 3),
      reverse: (q) => fromM2((q / 3) * 9.29, unit),
    },
    metal: {
      name: "Metal Panels", unit: "panels",
      calc: (a) => Math.ceil(a / 2.79),
      reverse: (q) => fromM2(q * 2.79, unit),
    },
    tiles: {
      name: "Roof Tiles", unit: "tiles",
      calc: (a) => Math.ceil(a * 10),
      reverse: (q) => fromM2(q / 10, unit),
    },
    polycarbonate: {
      name: "Polycarbonate Sheets", unit: "sheets",
      calc: (a) => Math.ceil(a / 1.8),
      reverse: (q) => fromM2(q * 1.8, unit),
    },
  };

  const sel = materials[roofType];
  const qty = sel.calc(roofAreaM2);
  const areaFromMat = sel.reverse(parseInt(materialOnHand) || 0);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} labelA="Roof → Materials Needed" labelB="Materials on Hand → Area" color="bg-slate-500" />
      <ToolCard title="Roofing Calculator" icon={Home} iconColor="bg-slate-500">
        <div className="space-y-4">
          {mode === "a" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Roof Length (${ll})`} value={length} onChange={setLength} />
                <Field label={`Roof Width (${ll})`} value={width} onChange={setWidth} />
              </div>
              <Field label="Roof Pitch (rise per 12)" value={pitch} onChange={setPitch} hint="Flat=0, Low=2-4, Medium=5-8, Steep=9+" />
            </>
          ) : (
            <Field label={`Material on Hand (${sel.unit})`} value={materialOnHand} onChange={setMaterialOnHand} unit={sel.unit} />
          )}
          <SelectField label="Material Type" value={roofType} onChange={setRoofType}
            options={Object.entries(materials).map(([k, v]) => ({ value: k, label: v.name }))} />
        </div>
      </ToolCard>
      <ToolCard title="Roofing Materials" icon={Calculator} iconColor="bg-emerald-500">
        {mode === "a" ? (
          <div className="space-y-1">
            <Step label="Base Area" value={`${n2(fromM2(baseAreaM2, unit))} ${al}`} />
            <Step label="Pitch Factor" value={`×${pitchFactor.toFixed(3)}`} />
            <Step label="Actual Roof Area" value={`${n2(fromM2(roofAreaM2, unit))} ${al}`} />
            <Highlight label={`${sel.name} Needed`} value={`${qty} ${sel.unit}`} color="text-slate-300" />
          </div>
        ) : (
          <div className="space-y-1">
            <Step label={`${sel.name} Available`} value={`${materialOnHand} ${sel.unit}`} />
            <Highlight label="Roof Area Coverable" value={`${n2(areaFromMat)} ${al}`} color="text-slate-300" />
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function FlooringCalc({ unit }: { unit: UnitSystem }) {
  const [mode, setMode] = useState<"a" | "b">("a");
  const [length, setLength] = useState("5");
  const [width, setWidth] = useState("4");
  const [floorType, setFloorType] = useState("laminate");
  const [wastage, setWastage] = useState("10");
  const [budget, setBudget] = useState("500");
  const [currency, setCurrency] = useState("$");

  const ll = lenLabel(unit);
  const al = areaLabel(unit);

  const costs: Record<string, { price: number; name: string; priceLabel: string }> = {
    hardwood: { price: 80, name: "Hardwood", priceLabel: unit === "metric" ? "80/sq.m" : "7.5/sq.ft" },
    laminate: { price: 40, name: "Laminate", priceLabel: unit === "metric" ? "40/sq.m" : "3.7/sq.ft" },
    vinyl: { price: 30, name: "Vinyl Plank (LVP)", priceLabel: unit === "metric" ? "30/sq.m" : "2.8/sq.ft" },
    carpet: { price: 25, name: "Carpet", priceLabel: unit === "metric" ? "25/sq.m" : "2.3/sq.ft" },
    tile: { price: 60, name: "Ceramic Tile", priceLabel: unit === "metric" ? "60/sq.m" : "5.6/sq.ft" },
    marble: { price: 120, name: "Marble", priceLabel: unit === "metric" ? "120/sq.m" : "11/sq.ft" },
  };

  const sel = costs[floorType];
  const roomAreaM2 = toM2((parseFloat(length) || 0) * (parseFloat(width) || 0), unit);
  const totalAreaM2 = roomAreaM2 * (1 + (parseFloat(wastage) || 0) / 100);
  const costPerM2 = sel.price;
  const totalCost = fromM2(totalAreaM2, unit) * (unit === "metric" ? costPerM2 : costPerM2 / 10.764);
  const areaFromBudget = (parseFloat(budget) || 0) / (unit === "metric" ? costPerM2 : costPerM2 / 10.764);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} labelA="Room → Area & Cost" labelB="Budget → Area" color="bg-amber-600" />
      <ToolCard title="Flooring Calculator" icon={LayoutGrid} iconColor="bg-amber-600">
        <div className="space-y-4">
          {mode === "a" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Length (${ll})`} value={length} onChange={setLength} />
                <Field label={`Width (${ll})`} value={width} onChange={setWidth} />
              </div>
              <Field label="Wastage %" value={wastage} onChange={setWastage} unit="%" />
            </>
          ) : (
            <div className="flex gap-2 items-end">
              <div className="w-20">
                <Field label="Currency" value={currency} onChange={setCurrency} />
              </div>
              <div className="flex-1">
                <Field label="Total Budget" value={budget} onChange={setBudget} />
              </div>
            </div>
          )}
          <SelectField label="Floor Material" value={floorType} onChange={setFloorType}
            options={Object.entries(costs).map(([k, v]) => ({ value: k, label: `${v.name} (~${currency}${v.priceLabel})` }))} />
        </div>
      </ToolCard>
      <ToolCard title="Flooring Estimate" icon={Calculator} iconColor="bg-emerald-500">
        {mode === "a" ? (
          <div className="space-y-1">
            <Step label="Room Area" value={`${n2(fromM2(roomAreaM2, unit))} ${al}`} />
            <Step label={`With ${wastage}% Wastage`} value={`${n2(fromM2(totalAreaM2, unit))} ${al}`} />
            <Step label="Rate per sq" value={`${currency}${unit === "metric" ? costPerM2 : (costPerM2 / 10.764).toFixed(1)}/${unit === "metric" ? "sq.m" : "sq.ft"}`} />
            <Highlight label="Total Cost" value={`${currency}${totalCost.toFixed(0)}`} color="text-amber-400" />
          </div>
        ) : (
          <div className="space-y-1">
            <Step label="Budget" value={`${currency}${budget}`} />
            <Step label="Rate per sq" value={`${currency}${(unit === "metric" ? costPerM2 : costPerM2 / 10.764).toFixed(1)}/${unit === "metric" ? "sq.m" : "sq.ft"}`} />
            <Highlight label="Area You Can Cover" value={`${n2(areaFromBudget)} ${al}`} color="text-amber-400" />
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function SteelCalc({ unit }: { unit: UnitSystem }) {
  const [mode, setMode] = useState<"a" | "b">("a");
  const [diameter, setDiameter] = useState("12");
  const [length, setLength] = useState("12");
  const [quantity, setQuantity] = useState("10");
  const [targetWeight, setTargetWeight] = useState("100");

  const ll = lenLabel(unit);
  const wl = wtLabel(unit);

  const dPresets = [
    { value: "8", label: "8mm" }, { value: "10", label: "10mm" },
    { value: "12", label: "12mm (Common)" }, { value: "16", label: "16mm" },
    { value: "20", label: "20mm" }, { value: "25", label: "25mm" },
    { value: "32", label: "32mm" },
  ];

  const d = parseFloat(diameter) || 0;
  const l = toM(parseFloat(length) || 0, unit);
  const q = parseInt(quantity) || 0;
  const wtKgPerM = (d * d) / 162;
  const totalKg = wtKgPerM * l * q;
  const totalWeight = fromKg(totalKg, unit);
  const wtPerBar = fromKg(wtKgPerM * l, unit);

  const calcReverse = () => {
    const tw = toKg(parseFloat(targetWeight) || 0, unit);
    const totalM = tw / wtKgPerM;
    const bars = totalM / l;
    return { totalLength: fromM(totalM, unit), bars: Math.ceil(bars) };
  };

  const rb = calcReverse();

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} labelA="Bars → Weight" labelB="Weight → Bars Needed" color="bg-slate-500" />
      <ToolCard title="Steel Bar Calculator" icon={Construction} iconColor="bg-slate-500">
        <div className="space-y-4">
          <SelectField label="Bar Diameter" value={diameter} onChange={setDiameter} options={dPresets} />
          <Field label={`Bar Length (${ll})`} value={length} onChange={setLength} hint="Standard length: 12m" />
          {mode === "a" ? (
            <Field label="Quantity (bars)" value={quantity} onChange={setQuantity} unit="bars" />
          ) : (
            <Field label={`Target Weight (${wl})`} value={targetWeight} onChange={setTargetWeight} unit={wl} />
          )}
        </div>
      </ToolCard>
      <ToolCard title="Weight Results" icon={Calculator} iconColor="bg-emerald-500">
        {mode === "a" ? (
          <div className="space-y-1">
            <Step label="Formula" value={`d²/162 kg/m`} sub="where d = diameter in mm" />
            <Step label="Weight per meter" value={`${wtKgPerM.toFixed(4)} kg/m`} />
            <Step label="Weight per bar" value={`${n2(wtPerBar)} ${wl}`} />
            <Highlight label={`Total Weight (${q} bars)`} value={`${n2(totalWeight)} ${wl}`} color="text-slate-300" />
          </div>
        ) : (
          <div className="space-y-1">
            <Step label="Target Weight" value={`${targetWeight} ${wl}`} />
            <Step label="Weight per bar" value={`${n2(wtPerBar)} ${wl}`} />
            <Step label="Total Length Needed" value={`${n2(rb.totalLength)} ${ll}`} />
            <Highlight label="Bars Required" value={`${rb.bars} bars`} color="text-slate-300" />
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function ExcavationCalc({ unit }: { unit: UnitSystem }) {
  const [shape, setShape] = useState("rectangular");
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("5");
  const [depth, setDepth] = useState("2");
  const [truckCapacity, setTruckCapacity] = useState("5");
  const [soilType, setSoilType] = useState("normal");

  const ll = lenLabel(unit);
  const vl = volLabel(unit);

  const swellFactors: Record<string, number> = {
    normal: 1.25, sandy: 1.12, clay: 1.40, rock: 1.60
  };
  const swell = swellFactors[soilType];

  const getVolM3 = () => {
    if (shape === "rectangular") {
      return toM3((parseFloat(length) || 0) * (parseFloat(width) || 0) * (parseFloat(depth) || 0), unit);
    } else {
      const r = toM(parseFloat(width) || 0, unit) / 2;
      return Math.PI * r * r * toM(parseFloat(depth) || 0, unit);
    }
  };

  const volM3 = getVolM3();
  const swollenM3 = volM3 * swell;
  const trucks = Math.ceil(fromM3(swollenM3, unit) / (parseFloat(truckCapacity) || 5));

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Excavation Calculator" icon={Mountain} iconColor="bg-amber-800">
        <div className="space-y-4">
          <SelectField label="Excavation Shape" value={shape} onChange={setShape} options={[
            { value: "rectangular", label: "Rectangular / Trench" },
            { value: "circular", label: "Circular Pit" },
          ]} />
          {shape === "rectangular" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Length (${ll})`} value={length} onChange={setLength} />
                <Field label={`Width (${ll})`} value={width} onChange={setWidth} />
              </div>
            </>
          ) : (
            <Field label={`Diameter (${ll})`} value={width} onChange={setWidth} />
          )}
          <Field label={`Depth (${ll})`} value={depth} onChange={setDepth} />
          <SelectField label="Soil Type (Swell Factor)" value={soilType} onChange={setSoilType} options={[
            { value: "normal", label: "Normal Soil (×1.25)" },
            { value: "sandy", label: "Sandy Soil (×1.12)" },
            { value: "clay", label: "Clay (×1.40)" },
            { value: "rock", label: "Rock (×1.60)" },
          ]} />
          <Field label={`Truck Capacity (${vl})`} value={truckCapacity} onChange={setTruckCapacity} unit={vl} />
        </div>
      </ToolCard>
      <ToolCard title="Excavation Results" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-1">
          <Step label={`In-situ Volume`} value={`${n2(fromM3(volM3, unit))} ${vl}`} />
          <Step label={`Swell Factor`} value={`×${swell} (${soilType})`} />
          <Step label={`Swollen Volume`} value={`${n2(fromM3(swollenM3, unit))} ${vl}`} />
          <Highlight label={`Truck Loads Needed`} value={`${trucks} trucks`} color="text-amber-700" />
        </div>
      </ToolCard>
    </div>
  );
}

function StaircaseCalc({ unit }: { unit: UnitSystem }) {
  const [floorHeight, setFloorHeight] = useState(unit === "metric" ? "3" : "10");
  const [riserHeight, setRiserHeight] = useState(unit === "metric" ? "0.175" : "7");
  const [treadDepth, setTreadDepth] = useState(unit === "metric" ? "0.25" : "10");
  const [stairWidth, setStairWidth] = useState(unit === "metric" ? "1.2" : "4");

  const ll = lenLabel(unit);
  const al = areaLabel(unit);

  const fhM = toM(parseFloat(floorHeight) || 0, unit);
  const rhM = toM(parseFloat(riserHeight) || 0, unit);
  const tdM = toM(parseFloat(treadDepth) || 0, unit);
  const swM = toM(parseFloat(stairWidth) || 0, unit);

  const steps = rhM > 0 ? Math.round(fhM / rhM) : 0;
  const actualRiser = steps > 0 ? fhM / steps : 0;
  const goingM = steps > 0 ? (steps - 1) * tdM : 0;
  const slopeAngle = Math.atan2(fhM, goingM) * (180 / Math.PI);
  const concreteVolM3 = steps > 0 ? 0.5 * (fromM(actualRiser, "metric")) * tdM * swM * steps : 0;
  const comfortable = actualRiser >= 0.15 && actualRiser <= 0.19 && tdM >= 0.23 && tdM <= 0.30;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Staircase Designer" icon={TrendingUp} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <Field label={`Floor-to-Floor Height (${ll})`} value={floorHeight} onChange={setFloorHeight} hint={unit === "metric" ? "Typical: 2.8–3.2m" : "Typical: 9–11ft"} />
          <div className="grid grid-cols-2 gap-3">
            <Field label={`Riser Height (${ll})`} value={riserHeight} onChange={setRiserHeight} hint={unit === "metric" ? "Ideal: 0.15–0.19m" : "Ideal: 6–7.5in"} />
            <Field label={`Tread Depth (${ll})`} value={treadDepth} onChange={setTreadDepth} hint={unit === "metric" ? "Ideal: 0.23–0.30m" : "Ideal: 9–12in"} />
          </div>
          <Field label={`Stair Width (${ll})`} value={stairWidth} onChange={setStairWidth} hint={unit === "metric" ? "Min: 0.9m" : "Min: 3ft"} />
        </div>
      </ToolCard>
      <ToolCard title="Staircase Design" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-1">
          <Step label="Number of Steps" value={`${steps} steps`} />
          <Step label="Actual Riser Height" value={`${fromM(actualRiser, unit).toFixed(3)} ${ll}`} />
          <Step label="Total Going (run)" value={`${n2(fromM(goingM, unit))} ${ll}`} />
          <Step label="Slope Angle" value={`${slopeAngle.toFixed(1)}°`} />
          <Step label="Concrete Approx" value={`${n2(fromM3(concreteVolM3, unit))} ${volLabel(unit)}`} />
          <div className={`mt-3 px-4 py-2 rounded-xl text-sm font-medium text-center ${comfortable ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
            {comfortable ? "✓ Comfortable & Code-Compliant" : "⚠ Adjust riser/tread for comfort"}
          </div>
        </div>
      </ToolCard>
    </div>
  );
}

function GravelCalc({ unit }: { unit: UnitSystem }) {
  const [mode, setMode] = useState<"a" | "b">("a");
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("5");
  const [depth, setDepth] = useState(unit === "metric" ? "0.1" : "4");
  const [material, setMaterial] = useState("gravel");
  const [weightOnHand, setWeightOnHand] = useState("1000");

  const ll = lenLabel(unit);
  const al = areaLabel(unit);
  const wl = wtLabel(unit);

  const densities: Record<string, { density: number; name: string }> = {
    gravel: { density: 1680, name: "Gravel (Pea/Crushed)" },
    sand: { density: 1600, name: "Sand (Dry)" },
    topsoil: { density: 950, name: "Topsoil" },
    mulch: { density: 400, name: "Mulch" },
    concrete: { density: 2300, name: "Crushed Concrete" },
  };

  const sel = densities[material];
  const volM3 = toM3((parseFloat(length) || 0) * (parseFloat(width) || 0) * (parseFloat(depth) || 0), unit);
  const weightKg = volM3 * sel.density;
  const tonnes = weightKg / 1000;
  const displayWeight = fromKg(weightKg, unit);

  const areaFromWeight = () => {
    const wKg = toKg(parseFloat(weightOnHand) || 0, unit);
    const v = wKg / sel.density;
    const depthM = toM(parseFloat(depth) || 0.1, unit);
    return fromM2(v / depthM, unit);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} labelA="Area → Quantity" labelB="Quantity → Area" color="bg-stone-500" />
      <ToolCard title="Gravel / Fill Calculator" icon={Truck} iconColor="bg-stone-500">
        <div className="space-y-4">
          {mode === "a" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Length (${ll})`} value={length} onChange={setLength} />
                <Field label={`Width (${ll})`} value={width} onChange={setWidth} />
              </div>
            </>
          ) : (
            <Field label={`Material on Hand (${wl})`} value={weightOnHand} onChange={setWeightOnHand} unit={wl} />
          )}
          <Field label={`Depth (${ll})`} value={depth} onChange={setDepth} hint={unit === "metric" ? "Driveway: 0.1m / Path: 0.05m" : "Driveway: 4in / Path: 2in"} />
          <SelectField label="Material Type" value={material} onChange={setMaterial}
            options={Object.entries(densities).map(([k, v]) => ({ value: k, label: v.name }))} />
        </div>
      </ToolCard>
      <ToolCard title="Material Required" icon={Calculator} iconColor="bg-emerald-500">
        {mode === "a" ? (
          <div className="space-y-1">
            <Step label="Area" value={`${n2(fromM2(volM3 / toM(parseFloat(depth) || 0.1, unit), unit))} ${al}`} />
            <Step label="Volume" value={`${n2(fromM3(volM3, unit))} ${volLabel(unit)}`} />
            <Step label={`Weight (${wl})`} value={`${n2(displayWeight)} ${wl}`} />
            <Highlight label="Metric Tonnes" value={`${tonnes.toFixed(2)} t`} color="text-stone-400" />
          </div>
        ) : (
          <div className="space-y-1">
            <Step label={`Material Available`} value={`${weightOnHand} ${wl}`} />
            <Step label={`Depth`} value={`${depth} ${ll}`} />
            <Highlight label="Area Coverable" value={`${n2(areaFromWeight())} ${al}`} color="text-stone-400" />
          </div>
        )}
      </ToolCard>
    </div>
  );
}
