import { useState } from "react";
import {
  Hammer, PaintBucket, LayoutGrid, Construction, Box, Calculator,
  Home, Layers, ArrowRightLeft, Mountain, TrendingUp, Truck
} from "lucide-react";
import { DesktopToolGrid, InputPanel, ResultPanel, BreakdownRow, SummaryCard, ModeSelector } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType =
  | "cement" | "paint" | "tile" | "brick" | "concrete"
  | "roofing" | "flooring" | "steel" | "plaster" | "excavation"
  | "staircase" | "gravel";

const LENGTH_UNITS = [
  { v: "m",  l: "m",   f: 1 },
  { v: "cm", l: "cm",  f: 0.01 },
  { v: "mm", l: "mm",  f: 0.001 },
  { v: "ft", l: "ft",  f: 0.3048 },
  { v: "in", l: "in",  f: 0.0254 },
];
const VOLUME_UNITS = [
  { v: "m3",  l: "m³",    f: 1 },
  { v: "ft3", l: "ft³",   f: 0.028317 },
  { v: "L",   l: "L",     f: 0.001 },
  { v: "gal", l: "gal",   f: 0.003785 },
];
const MASS_UNITS = [
  { v: "kg", l: "kg", f: 1 },
  { v: "lb", l: "lb", f: 0.453592 },
  { v: "t",  l: "t",  f: 1000 },
];
const AREA_UNITS = [
  { v: "m2",  l: "m²",  f: 1 },
  { v: "ft2", l: "ft²", f: 0.092903 },
  { v: "cm2", l: "cm²", f: 0.0001 },
];
type UnitType = "length" | "volume" | "mass" | "area";
const UNIT_TABLES: Record<UnitType, { v: string; l: string; f: number }[]> = {
  length: LENGTH_UNITS, volume: VOLUME_UNITS, mass: MASS_UNITS, area: AREA_UNITS,
};

function toSI(val: number, unit: string, type: UnitType): number {
  const t = UNIT_TABLES[type];
  const entry = t.find((u) => u.v === unit);
  return val * (entry?.f ?? 1);
}
function fromSI(val: number, unit: string, type: UnitType): number {
  const t = UNIT_TABLES[type];
  const entry = t.find((u) => u.v === unit);
  return val / (entry?.f ?? 1);
}
function convertUnit(val: number, from: string, to: string, type: UnitType): number {
  return fromSI(toSI(val, from, type), to, type);
}

const n2 = (v: number) => (isNaN(v) || !isFinite(v) ? "—" : v.toFixed(2));
const n1 = (v: number) => (isNaN(v) || !isFinite(v) ? "—" : v.toFixed(1));

function UnitField({
  label, value, onChange, unit, onUnitChange, unitType, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  unit: string; onUnitChange: (u: string) => void;
  unitType: UnitType; hint?: string;
}) {
  const opts = UNIT_TABLES[unitType];
  const handleUnitChange = (newUnit: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      const converted = convertUnit(num, unit, newUnit, unitType);
      onChange(parseFloat(converted.toPrecision(5)).toString());
    }
    onUnitChange(newUnit);
  };
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">{label}</label>
      <div className="flex rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/40">
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-muted/50 px-3 py-2.5 text-foreground text-sm focus:outline-none"
          data-testid={`input-${label.toLowerCase().replace(/\s+/g, "-")}`} />
        <select value={unit} onChange={(e) => handleUnitChange(e.target.value)}
          className="bg-muted border-l border-border px-2 py-2.5 text-sm font-bold text-muted-foreground focus:outline-none cursor-pointer"
          data-testid={`unit-${label.toLowerCase().replace(/\s+/g, "-")}`}>
          {opts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </div>
      {hint && <p className="text-xs text-muted-foreground/60 mt-1">{hint}</p>}
    </div>
  );
}

function Field({ label, value, onChange, suffix, hint, type = "number" }: {
  label: string; value: string; onChange: (v: string) => void;
  suffix?: string; hint?: string; type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">{label}</label>
      <div className="flex rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/40">
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-muted/50 px-3 py-2.5 text-foreground text-sm focus:outline-none"
          data-testid={`input-${label.toLowerCase().replace(/\s+/g, "-")}`} />
        {suffix && (
          <span className="bg-muted border-l border-border px-3 py-2.5 text-xs font-bold text-muted-foreground flex items-center shrink-0">{suffix}</span>
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
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
        data-testid={`select-${label.toLowerCase().replace(/\s+/g, "-")}`}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export default function ConstructionTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("cement");

  const tools = [
    { id: "cement",     label: "Cement",      icon: Box },
    { id: "paint",      label: "Paint",       icon: PaintBucket },
    { id: "tile",       label: "Tiles",       icon: LayoutGrid },
    { id: "brick",      label: "Brick",       icon: Layers },
    { id: "concrete",   label: "Concrete",    icon: Hammer },
    { id: "plaster",    label: "Plaster",     icon: Layers },
    { id: "roofing",    label: "Roofing",     icon: Home },
    { id: "flooring",   label: "Flooring",    icon: LayoutGrid },
    { id: "steel",      label: "Steel Bar",   icon: Construction },
    { id: "excavation", label: "Excavation",  icon: Mountain },
    { id: "staircase",  label: "Staircase",   icon: TrendingUp },
    { id: "gravel",     label: "Gravel/Fill", icon: Truck },
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
      {activeTool === "cement"     && <CementCalc />}
      {activeTool === "paint"      && <PaintCalc />}
      {activeTool === "tile"       && <TileCalc />}
      {activeTool === "brick"      && <BrickCalc />}
      {activeTool === "concrete"   && <ConcreteCalc />}
      {activeTool === "plaster"    && <PlasterCalc />}
      {activeTool === "roofing"    && <RoofingCalc />}
      {activeTool === "flooring"   && <FlooringCalc />}
      {activeTool === "steel"      && <SteelCalc />}
      {activeTool === "excavation" && <ExcavationCalc />}
      {activeTool === "staircase"  && <StaircaseCalc />}
      {activeTool === "gravel"     && <GravelCalc />}
    </PageWrapper>
  );
}

function CementCalc() {
  const [mode, setMode] = useState<"a" | "b">("a");
  const [len, setLen] = useState("10"); const [lenU, setLenU] = useState("m");
  const [wid, setWid] = useState("10"); const [widU, setWidU] = useState("m");
  const [thi, setThi] = useState("0.15"); const [thiU, setThiU] = useState("m");
  const [ratio, setRatio] = useState("1:2:4");
  const [bags, setBags] = useState("50");

  const volM3 = toSI(parseFloat(len)||0,lenU,"length") * toSI(parseFloat(wid)||0,widU,"length") * toSI(parseFloat(thi)||0,thiU,"length");
  const parts = ratio.split(":").map(Number);
  const total = parts.reduce((a,b)=>a+b,0);
  const dry = volM3 * 1.54;
  const cBags = Math.ceil((dry * (parts[0]/total)) / 0.035);
  const sandM3 = dry * (parts[1]/total);
  const aggM3  = dry * (parts[2]/total);
  const revBags = parseInt(bags)||0;
  const revDry  = (revBags * 0.035) / (parts[0]/total);
  const revWet  = revDry / 1.54;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Cement Calculator" icon={Box} iconColor="bg-amber-500">
          <ModeSelector modes={[{id:"a",label:"Dimensions → Cement"},{id:"b",label:"Bags → Volume"}]} active={mode} onChange={v=>setMode(v as "a"|"b")} />
          {mode === "a" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <UnitField label="Length" value={len} onChange={setLen} unit={lenU} onUnitChange={setLenU} unitType="length" />
                <UnitField label="Width"  value={wid} onChange={setWid} unit={widU} onUnitChange={setWidU} unitType="length" />
              </div>
              <UnitField label="Thickness / Depth" value={thi} onChange={setThi} unit={thiU} onUnitChange={setThiU} unitType="length" hint="Slab: 0.10–0.20 m" />
            </>
          ) : (
            <Field label="Cement Bags (50 kg each)" value={bags} onChange={setBags} suffix="bags" />
          )}
          <SelectField label="Mix Ratio  Cement : Sand : Aggregate" value={ratio} onChange={setRatio}
            options={[
              {value:"1:1.5:3", label:"M20 — 1:1.5:3 (Strong)"},
              {value:"1:2:4",   label:"M15 — 1:2:4 (General)"},
              {value:"1:3:6",   label:"M10 — 1:3:6 (Lean)"},
              {value:"1:4:8",   label:"M7.5 — 1:4:8 (Lean Fill)"},
            ]} />
        </InputPanel>
      }
      results={
        <ResultPanel
          label={mode === "a" ? "Cement Bags (50 kg each)" : "Volume from Bags"}
          primary={mode === "a" ? `${cBags} bags` : `${n2(revWet)} m³`}
        >
          {mode === "a" ? (
            <>
              <BreakdownRow label="Wet Volume"       value={`${n2(volM3)} m³`} />
              <BreakdownRow label="Dry Volume (×1.54)" value={`${n2(dry)} m³`} />
              <BreakdownRow label="Sand"             value={`${n2(sandM3)} m³`} />
              <BreakdownRow label="Aggregate"        value={`${n2(aggM3)} m³`} />
            </>
          ) : (
            <>
              <BreakdownRow label="Dry Volume"  value={`${n2(revDry)} m³`} />
              <BreakdownRow label="Sand"        value={`${n2(revDry*(parts[1]/total))} m³`} />
              <BreakdownRow label="Aggregate"   value={`${n2(revDry*(parts[2]/total))} m³`} />
              <BreakdownRow label="Area @ 15 cm depth" value={`${n1(revWet/0.15)} m²`} accent="text-emerald-400" bold />
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

function PaintCalc() {
  const [mode, setMode] = useState<"a"|"b">("a");
  const [len, setLen] = useState("12"); const [lenU, setLenU] = useState("m");
  const [wid, setWid] = useState("10"); const [widU, setWidU] = useState("m");
  const [hei, setHei] = useState("3");  const [heiU, setHeiU] = useState("m");
  const [doors, setDoors]   = useState("2");
  const [windows, setWindows] = useState("3");
  const [coats, setCoats]   = useState("2");
  const [cov, setCov]       = useState("12"); const [covU, setCovU] = useState("m2");
  const [avail, setAvail]   = useState("20");

  const lM = toSI(parseFloat(len)||0, lenU, "length");
  const wM = toSI(parseFloat(wid)||0, widU, "length");
  const hM = toSI(parseFloat(hei)||0, heiU, "length");
  const covM2 = toSI(parseFloat(cov)||12, covU, "area");
  const c = parseInt(coats)||1;
  const d = parseInt(doors)||0;
  const wn = parseInt(windows)||0;

  const wallArea  = 2*(lM+wM)*hM;
  const openings  = d*1.89 + wn*1.2;
  const paintable = Math.max(0, wallArea - openings);
  const liters    = (paintable * c) / covM2;
  const availL = parseFloat(avail)||0;
  const areaFromAvail = (availL * covM2) / c;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Paint Calculator" icon={PaintBucket} iconColor="bg-pink-500">
          <ModeSelector modes={[{id:"a",label:"Room → Paint"},{id:"b",label:"Paint → Area"}]} active={mode} onChange={v=>setMode(v as "a"|"b")} />
          {mode === "a" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <UnitField label="Length" value={len} onChange={setLen} unit={lenU} onUnitChange={setLenU} unitType="length" />
                <UnitField label="Width"  value={wid} onChange={setWid} unit={widU} onUnitChange={setWidU} unitType="length" />
              </div>
              <UnitField label="Height" value={hei} onChange={setHei} unit={heiU} onUnitChange={setHeiU} unitType="length" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Doors"   value={doors}   onChange={setDoors}   suffix="nos" />
                <Field label="Windows" value={windows} onChange={setWindows} suffix="nos" />
              </div>
            </>
          ) : (
            <Field label="Paint Available" value={avail} onChange={setAvail} suffix="L" />
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Coats" value={coats} onChange={setCoats} suffix="coats" />
            <UnitField label="Coverage / Liter" value={cov} onChange={setCov} unit={covU} onUnitChange={setCovU} unitType="area" hint="~12 m²/L" />
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel
          label={mode === "a" ? `Paint (${coats} coat${c!==1?"s":""})` : `Area (${coats} coat${c!==1?"s":""})`}
          primary={mode === "a" ? `${n1(liters)} L` : `${n1(areaFromAvail)} m²`}
          primarySub={mode === "a" ? `· ${n2(liters*0.264)} gal` : undefined}
        >
          {mode === "a" ? (
            <>
              <BreakdownRow label="Total Wall Area"  value={`${n2(wallArea)} m²`} />
              <BreakdownRow label="Doors + Windows"  value={`−${n2(openings)} m²`} />
              <BreakdownRow label="Paintable Area"   value={`${n2(paintable)} m²`} />
            </>
          ) : (
            <BreakdownRow label="Available" value={`${avail} L`} />
          )}
        </ResultPanel>
      }
    />
  );
}

function TileCalc() {
  const [mode, setMode] = useState<"a"|"b">("a");
  const [rL, setRL] = useState("5"); const [rLU, setRLU] = useState("m");
  const [rW, setRW] = useState("4"); const [rWU, setRWU] = useState("m");
  const [tilePreset, setTilePreset] = useState("0.6x0.6");
  const [tL, setTL] = useState("0.6"); const [tLU, setTLU] = useState("m");
  const [tW, setTW] = useState("0.6"); const [tWU, setTWU] = useState("m");
  const [wastage, setWastage] = useState("10");
  const [onHand, setOnHand] = useState("100");

  const presets = [
    {value:"0.3x0.3",  label:"30×30 cm"},
    {value:"0.45x0.45",label:"45×45 cm"},
    {value:"0.6x0.6",  label:"60×60 cm"},
    {value:"0.6x1.2",  label:"60×120 cm"},
    {value:"0.8x0.8",  label:"80×80 cm"},
    {value:"1.0x1.0",  label:"100×100 cm"},
    {value:"custom",   label:"Custom"},
  ];
  const handlePreset = (v: string) => {
    setTilePreset(v);
    if (v !== "custom") {
      const [pl,pw] = v.split("x");
      setTL(pl); setTLU("m"); setTW(pw); setTWU("m");
    }
  };

  const roomM2   = toSI(parseFloat(rL)||0,rLU,"length") * toSI(parseFloat(rW)||0,rWU,"length");
  const tileM2   = toSI(parseFloat(tL)||0,tLU,"length") * toSI(parseFloat(tW)||0,tWU,"length");
  const exact    = tileM2 > 0 ? roomM2 / tileM2 : 0;
  const withWaste= Math.ceil(exact * (1+(parseFloat(wastage)||0)/100));
  const areaFromHand = tileM2 * (parseInt(onHand)||0);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Tile Calculator" icon={LayoutGrid} iconColor="bg-blue-500">
          <ModeSelector modes={[{id:"a",label:"Room → Tiles"},{id:"b",label:"On Hand → Area"}]} active={mode} onChange={v=>setMode(v as "a"|"b")} />
          {mode === "a" ? (
            <div className="grid grid-cols-2 gap-3">
              <UnitField label="Room Length" value={rL} onChange={setRL} unit={rLU} onUnitChange={setRLU} unitType="length" />
              <UnitField label="Room Width"  value={rW} onChange={setRW} unit={rWU} onUnitChange={setRWU} unitType="length" />
            </div>
          ) : (
            <Field label="Tiles on Hand" value={onHand} onChange={setOnHand} suffix="tiles" />
          )}
          <SelectField label="Tile Size (preset)" value={tilePreset} onChange={handlePreset} options={presets} />
          <div className="grid grid-cols-2 gap-3">
            <UnitField label="Tile Length" value={tL} onChange={setTL} unit={tLU} onUnitChange={setTLU} unitType="length" />
            <UnitField label="Tile Width"  value={tW} onChange={setTW} unit={tWU} onUnitChange={setTWU} unitType="length" />
          </div>
          {mode === "a" && <Field label="Wastage" value={wastage} onChange={setWastage} suffix="%" hint="Recommended 10–15%" />}
        </InputPanel>
      }
      results={
        <ResultPanel
          label={mode === "a" ? `Tiles with ${wastage}% waste` : "Area Coverable"}
          primary={mode === "a" ? `${withWaste} tiles` : `${n2(areaFromHand)} m²`}
        >
          {mode === "a" ? (
            <>
              <BreakdownRow label="Room Area"     value={`${n2(roomM2)} m²`} />
              <BreakdownRow label="Per Tile Area" value={`${n2(tileM2)} m²`} />
              <BreakdownRow label="Tiles (exact)" value={n2(exact)} />
            </>
          ) : (
            <BreakdownRow label="Per Tile Area" value={`${n2(tileM2)} m²`} />
          )}
        </ResultPanel>
      }
    />
  );
}

function BrickCalc() {
  const [mode, setMode] = useState<"a"|"b">("a");
  const [wL, setWL] = useState("10"); const [wLU, setWLU] = useState("m");
  const [wH, setWH] = useState("3");  const [wHU, setWHU] = useState("m");
  const [brickType, setBrickType] = useState("standard");
  const [wastage, setWastage] = useState("5");
  const [onHand, setOnHand] = useState("1000");

  const types: Record<string,{l:number;h:number;name:string}> = {
    standard: {l:0.19, h:0.057, name:"Standard (190×57 mm)"},
    modular:  {l:0.194,h:0.057, name:"Modular (194×57 mm)"},
    jumbo:    {l:0.203,h:0.067, name:"Jumbo (203×67 mm)"},
    wire_cut: {l:0.22, h:0.073, name:"Wire Cut (220×73 mm)"},
  };
  const bt = types[brickType];
  const m = 0.01;
  const bricksPerM2 = 1/((bt.l+m)*(bt.h+m));
  const wallM2  = toSI(parseFloat(wL)||0,wLU,"length") * toSI(parseFloat(wH)||0,wHU,"length");
  const exact   = wallM2 * bricksPerM2;
  const withW   = Math.ceil(exact*(1+(parseFloat(wastage)||0)/100));
  const areaFrB = (parseInt(onHand)||0) / bricksPerM2;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Brick Calculator" icon={Layers} iconColor="bg-red-500">
          <ModeSelector modes={[{id:"a",label:"Wall → Bricks"},{id:"b",label:"On Hand → Area"}]} active={mode} onChange={v=>setMode(v as "a"|"b")} />
          {mode === "a" ? (
            <div className="grid grid-cols-2 gap-3">
              <UnitField label="Wall Length" value={wL} onChange={setWL} unit={wLU} onUnitChange={setWLU} unitType="length" />
              <UnitField label="Wall Height" value={wH} onChange={setWH} unit={wHU} onUnitChange={setWHU} unitType="length" />
            </div>
          ) : (
            <Field label="Bricks on Hand" value={onHand} onChange={setOnHand} suffix="bricks" />
          )}
          <SelectField label="Brick Type" value={brickType} onChange={setBrickType}
            options={Object.entries(types).map(([k,v])=>({value:k,label:v.name}))} />
          {mode === "a" && <Field label="Wastage" value={wastage} onChange={setWastage} suffix="%" />}
        </InputPanel>
      }
      results={
        <ResultPanel
          label={mode === "a" ? `With ${wastage}% wastage` : "Wall Area Possible"}
          primary={mode === "a" ? `${withW} bricks` : `${n2(areaFrB)} m²`}
        >
          {mode === "a" ? (
            <>
              <BreakdownRow label="Wall Area"      value={`${n2(wallM2)} m²`} />
              <BreakdownRow label="Bricks per m²"  value={`≈ ${Math.ceil(bricksPerM2)}`} />
              <BreakdownRow label="Exact"          value={n2(exact)} />
            </>
          ) : (
            <BreakdownRow label="Bricks per m²" value={`≈ ${Math.ceil(bricksPerM2)}`} />
          )}
        </ResultPanel>
      }
    />
  );
}

function ConcreteCalc() {
  const [mode, setMode] = useState<"a"|"b">("a");
  const [shape, setShape] = useState("slab");
  const [len, setLen] = useState("5");  const [lenU, setLenU] = useState("m");
  const [wid, setWid] = useState("4");  const [widU, setWidU] = useState("m");
  const [dep, setDep] = useState("0.15");const [depU, setDepU] = useState("m");
  const [dia, setDia] = useState("0.5"); const [diaU, setDiaU] = useState("m");
  const [hei, setHei] = useState("1");   const [heiU, setHeiU] = useState("m");
  const [mix, setMix] = useState("1:2:4");
  const [bags, setBags] = useState("20");

  const getVolM3 = () => {
    if (shape==="slab") return toSI(parseFloat(len)||0,lenU,"length")*toSI(parseFloat(wid)||0,widU,"length")*toSI(parseFloat(dep)||0,depU,"length");
    const r = toSI(parseFloat(dia)||0,diaU,"length")/2;
    if (shape==="column") return Math.PI*r*r*toSI(parseFloat(hei)||0,heiU,"length");
    return (4/3)*Math.PI*r*r*r;
  };
  const volM3 = getVolM3();
  const parts = mix.split(":").map(Number);
  const total = parts.reduce((a,b)=>a+b,0);
  const dry = volM3*1.54;
  const cBags = Math.ceil((dry*(parts[0]/total))/0.035);
  const sandM3 = dry*(parts[1]/total);
  const aggM3  = dry*(parts[2]/total);
  const bags2vol = (parseInt(bags)||0)*0.03;
  const depM = toSI(parseFloat(dep)||0.15,depU,"length");
  const areaFrBags = depM>0 ? bags2vol/depM : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Concrete Calculator" icon={Hammer} iconColor="bg-gray-500">
          <ModeSelector modes={[{id:"a",label:"Dimensions → Volume"},{id:"b",label:"Bags → Area"}]} active={mode} onChange={v=>setMode(v as "a"|"b")} />
          <SelectField label="Shape" value={shape} onChange={setShape} options={[
            {value:"slab",   label:"Slab / Footing"},
            {value:"column", label:"Circular Column"},
            {value:"sphere", label:"Sphere"},
          ]} />
          {mode === "a" ? (
            shape==="slab" ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <UnitField label="Length" value={len} onChange={setLen} unit={lenU} onUnitChange={setLenU} unitType="length" />
                  <UnitField label="Width"  value={wid} onChange={setWid} unit={widU} onUnitChange={setWidU} unitType="length" />
                </div>
                <UnitField label="Depth / Thickness" value={dep} onChange={setDep} unit={depU} onUnitChange={setDepU} unitType="length" />
              </>
            ) : (
              <>
                <UnitField label="Diameter" value={dia} onChange={setDia} unit={diaU} onUnitChange={setDiaU} unitType="length" />
                {shape==="column" && <UnitField label="Height" value={hei} onChange={setHei} unit={heiU} onUnitChange={setHeiU} unitType="length" />}
              </>
            )
          ) : (
            <>
              <Field label="Premix Bags (40 kg)" value={bags} onChange={setBags} suffix="bags" />
              <UnitField label="Slab Depth" value={dep} onChange={setDep} unit={depU} onUnitChange={setDepU} unitType="length" />
            </>
          )}
          {mode === "a" && (
            <SelectField label="Mix Ratio" value={mix} onChange={setMix} options={[
              {value:"1:1.5:3",label:"M20 — 1:1.5:3"},
              {value:"1:2:4",  label:"M15 — 1:2:4"},
              {value:"1:3:6",  label:"M10 — 1:3:6"},
            ]} />
          )}
        </InputPanel>
      }
      results={
        <ResultPanel
          label={mode === "a" ? "Total Volume" : "Area Coverable"}
          primary={mode === "a" ? `${n2(volM3)} m³` : `${n2(areaFrBags)} m²`}
        >
          {mode === "a" ? (
            <>
              <BreakdownRow label="Volume (yd³)" value={`${n2(volM3*1.308)} yd³`} />
              <BreakdownRow label="Premix Bags"  value={`${Math.ceil(volM3/0.03)} bags`} />
              <BreakdownRow label="Cement Bags"  value={`${cBags} bags (50 kg)`} />
              <BreakdownRow label="Sand"         value={`${n2(sandM3)} m³`} />
              <BreakdownRow label="Aggregate"    value={`${n2(aggM3)} m³`} />
            </>
          ) : (
            <BreakdownRow label="Volume from Bags" value={`${n2(bags2vol)} m³`} />
          )}
        </ResultPanel>
      }
    />
  );
}

function PlasterCalc() {
  const [mode, setMode] = useState<"a"|"b">("a");
  const [wL, setWL] = useState("5"); const [wLU, setWLU] = useState("m");
  const [wH, setWH] = useState("3"); const [wHU, setWHU] = useState("m");
  const [thi, setThi] = useState("12"); const [thiU, setThiU] = useState("mm");
  const [ratio, setRatio] = useState("1:4");
  const [bags, setBags] = useState("10");

  const wallM2  = toSI(parseFloat(wL)||0,wLU,"length")*toSI(parseFloat(wH)||0,wHU,"length");
  const thiM    = toSI(parseFloat(thi)||0,thiU,"length");
  const volM3   = wallM2*thiM;
  const dry     = volM3*1.3;
  const parts   = ratio.split(":").map(Number);
  const total   = parts.reduce((a,b)=>a+b,0);
  const cBags   = Math.ceil((dry*(parts[0]/total))/0.035);
  const sandM3  = dry*(parts[1]/total);
  const revBags  = parseInt(bags)||0;
  const revDry   = (revBags*0.035)/(parts[0]/total);
  const revWet   = revDry/1.3;
  const revArea  = thiM>0 ? revWet/thiM : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Plaster Calculator" icon={Layers} iconColor="bg-yellow-500">
          <ModeSelector modes={[{id:"a",label:"Wall → Materials"},{id:"b",label:"Bags → Wall Area"}]} active={mode} onChange={v=>setMode(v as "a"|"b")} />
          {mode === "a" ? (
            <div className="grid grid-cols-2 gap-3">
              <UnitField label="Wall Length" value={wL} onChange={setWL} unit={wLU} onUnitChange={setWLU} unitType="length" />
              <UnitField label="Wall Height" value={wH} onChange={setWH} unit={wHU} onUnitChange={setWHU} unitType="length" />
            </div>
          ) : (
            <Field label="Cement Bags (50 kg)" value={bags} onChange={setBags} suffix="bags" />
          )}
          <UnitField label="Plaster Thickness" value={thi} onChange={setThi} unit={thiU} onUnitChange={setThiU} unitType="length" hint="Inner wall: 12 mm · Outer: 20 mm" />
          <SelectField label="Cement : Sand Ratio" value={ratio} onChange={setRatio} options={[
            {value:"1:3",label:"1:3 (Inner wall)"},
            {value:"1:4",label:"1:4 (Standard)"},
            {value:"1:5",label:"1:5 (Exterior)"},
            {value:"1:6",label:"1:6 (Rough)"},
          ]} />
        </InputPanel>
      }
      results={
        <ResultPanel
          label={mode === "a" ? "Cement Bags (50 kg)" : "Wall Area Coverable"}
          primary={mode === "a" ? `${cBags} bags` : `${n1(revArea)} m²`}
        >
          {mode === "a" ? (
            <>
              <BreakdownRow label="Wall Area"      value={`${n2(wallM2)} m²`} />
              <BreakdownRow label="Plaster Volume" value={`${n2(volM3)} m³`} />
              <BreakdownRow label="Sand"           value={`${n2(sandM3)} m³`} />
            </>
          ) : (
            <>
              <BreakdownRow label="Dry Volume" value={`${n2(revDry)} m³`} />
              <BreakdownRow label="Sand"       value={`${n2(revDry*(parts[1]/total))} m³`} />
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

function RoofingCalc() {
  const [mode, setMode] = useState<"a"|"b">("a");
  const [len, setLen] = useState("12"); const [lenU, setLenU] = useState("m");
  const [wid, setWid] = useState("8");  const [widU, setWidU] = useState("m");
  const [pitch, setPitch] = useState("4");
  const [roofType, setRoofType] = useState("shingles");
  const [onHand, setOnHand] = useState("50");

  const pitchF = Math.sqrt(1+Math.pow((parseFloat(pitch)||0)/12,2));
  const baseM2 = toSI(parseFloat(len)||0,lenU,"length")*toSI(parseFloat(wid)||0,widU,"length");
  const roofM2 = baseM2*pitchF;

  type RoofMat = {name:string;unit:string;calc:(a:number)=>number;rev:(q:number)=>number};
  const materials: Record<string,RoofMat> = {
    shingles:      {name:"Shingles",            unit:"bundles",calc:(a)=>Math.ceil((a/9.29)*3),  rev:(q)=>(q/3)*9.29},
    metal:         {name:"Metal Panels",        unit:"panels", calc:(a)=>Math.ceil(a/2.79),      rev:(q)=>q*2.79},
    tiles:         {name:"Roof Tiles",          unit:"tiles",  calc:(a)=>Math.ceil(a*10),        rev:(q)=>q/10},
    polycarbonate: {name:"Polycarbonate Sheets",unit:"sheets", calc:(a)=>Math.ceil(a/1.8),       rev:(q)=>q*1.8},
  };
  const sel = materials[roofType];
  const qty = sel.calc(roofM2);
  const areaFromMat = sel.rev(parseInt(onHand)||0);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Roofing Calculator" icon={Home} iconColor="bg-slate-500">
          <ModeSelector modes={[{id:"a",label:"Roof → Materials"},{id:"b",label:"Materials → Area"}]} active={mode} onChange={v=>setMode(v as "a"|"b")} />
          {mode === "a" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <UnitField label="Roof Length" value={len} onChange={setLen} unit={lenU} onUnitChange={setLenU} unitType="length" />
                <UnitField label="Roof Width"  value={wid} onChange={setWid} unit={widU} onUnitChange={setWidU} unitType="length" />
              </div>
              <Field label="Pitch (rise per 12 run)" value={pitch} onChange={setPitch} hint="Flat=0 · Low=2–4 · Med=5–8 · Steep=9+" />
            </>
          ) : (
            <Field label={`${sel.name} on Hand`} value={onHand} onChange={setOnHand} suffix={sel.unit} />
          )}
          <SelectField label="Material Type" value={roofType} onChange={setRoofType}
            options={Object.entries(materials).map(([k,v])=>({value:k,label:v.name}))} />
        </InputPanel>
      }
      results={
        <ResultPanel
          label={mode === "a" ? sel.name : "Roof Area Coverable"}
          primary={mode === "a" ? `${qty} ${sel.unit}` : `${n2(areaFromMat)} m²`}
        >
          {mode === "a" ? (
            <>
              <BreakdownRow label="Base Area"       value={`${n2(baseM2)} m²`} />
              <BreakdownRow label="Pitch Factor"    value={`× ${pitchF.toFixed(3)}`} />
              <BreakdownRow label="Actual Roof Area" value={`${n2(roofM2)} m²`} />
            </>
          ) : (
            <BreakdownRow label={sel.name} value={`${onHand} ${sel.unit}`} />
          )}
        </ResultPanel>
      }
    />
  );
}

function FlooringCalc() {
  const [mode, setMode] = useState<"a"|"b">("a");
  const [len, setLen] = useState("5"); const [lenU, setLenU] = useState("m");
  const [wid, setWid] = useState("4"); const [widU, setWidU] = useState("m");
  const [floorType, setFloorType] = useState("laminate");
  const [wastage, setWastage] = useState("10");
  const [budget, setBudget] = useState("500");
  const [currency, setCurrency] = useState("$");

  const costs: Record<string,{price:number;name:string}> = {
    hardwood: {price:80,  name:"Hardwood"},
    laminate: {price:40,  name:"Laminate"},
    vinyl:    {price:30,  name:"Vinyl Plank (LVP)"},
    carpet:   {price:25,  name:"Carpet"},
    tile:     {price:60,  name:"Ceramic Tile"},
    marble:   {price:120, name:"Marble"},
  };
  const sel = costs[floorType];
  const roomM2  = toSI(parseFloat(len)||0,lenU,"length")*toSI(parseFloat(wid)||0,widU,"length");
  const totalM2 = roomM2*(1+(parseFloat(wastage)||0)/100);
  const cost    = totalM2*sel.price;
  const areaFrB = (parseFloat(budget)||0)/sel.price;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Flooring Calculator" icon={LayoutGrid} iconColor="bg-amber-600">
          <ModeSelector modes={[{id:"a",label:"Room → Cost"},{id:"b",label:"Budget → Area"}]} active={mode} onChange={v=>setMode(v as "a"|"b")} />
          {mode === "a" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <UnitField label="Length" value={len} onChange={setLen} unit={lenU} onUnitChange={setLenU} unitType="length" />
                <UnitField label="Width"  value={wid} onChange={setWid} unit={widU} onUnitChange={setWidU} unitType="length" />
              </div>
              <Field label="Wastage" value={wastage} onChange={setWastage} suffix="%" />
            </>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <Field label="Currency" value={currency} onChange={setCurrency} type="text" />
              <div className="col-span-2">
                <Field label="Budget" value={budget} onChange={setBudget} />
              </div>
            </div>
          )}
          <SelectField label="Floor Material" value={floorType} onChange={setFloorType}
            options={Object.entries(costs).map(([k,v])=>({value:k,label:`${v.name}  (~${currency}${v.price}/m²)`}))} />
        </InputPanel>
      }
      results={
        <ResultPanel
          label={mode === "a" ? "Estimated Cost" : "Area You Can Cover"}
          primary={mode === "a" ? `${currency}${Math.ceil(cost)}` : `${n2(areaFrB)} m²`}
        >
          {mode === "a" ? (
            <>
              <BreakdownRow label="Room Area"         value={`${n2(roomM2)} m²`} />
              <BreakdownRow label={`With ${wastage}% waste`} value={`${n2(totalM2)} m²`} />
              <BreakdownRow label={`Rate (${currency}/m²)`}  value={`${currency}${sel.price}`} />
            </>
          ) : (
            <BreakdownRow label={`Rate (${currency}/m²)`} value={`${currency}${sel.price}`} />
          )}
        </ResultPanel>
      }
    />
  );
}

function SteelCalc() {
  const [mode, setMode] = useState<"a"|"b">("a");
  const [dia, setDia] = useState("12");
  const [len, setLen] = useState("12"); const [lenU, setLenU] = useState("m");
  const [qty, setQty] = useState("10");
  const [targetW, setTargetW] = useState("100"); const [targetWU, setTargetWU] = useState("kg");

  const dMm  = parseFloat(dia)||0;
  const lM   = toSI(parseFloat(len)||0,lenU,"length");
  const wtPerM = (dMm*dMm)/162;
  const wtPerBar = wtPerM * lM;
  const totalKg  = wtPerBar * (parseInt(qty)||0);
  const twKg  = toSI(parseFloat(targetW)||0,targetWU,"mass");
  const totalLenM = twKg / wtPerM;
  const barsNeeded = Math.ceil(totalLenM / lM);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Steel Bar Calculator" icon={Construction} iconColor="bg-slate-500">
          <ModeSelector modes={[{id:"a",label:"Bars → Weight"},{id:"b",label:"Weight → Bars"}]} active={mode} onChange={v=>setMode(v as "a"|"b")} />
          <SelectField label="Bar Diameter" value={dia} onChange={setDia} options={[
            {value:"8", label:"8 mm"},
            {value:"10",label:"10 mm"},
            {value:"12",label:"12 mm (common)"},
            {value:"16",label:"16 mm"},
            {value:"20",label:"20 mm"},
            {value:"25",label:"25 mm"},
            {value:"32",label:"32 mm"},
          ]} />
          <UnitField label="Bar Length" value={len} onChange={setLen} unit={lenU} onUnitChange={setLenU} unitType="length" hint="Standard: 12 m" />
          {mode === "a" ? (
            <Field label="Quantity (bars)" value={qty} onChange={setQty} suffix="bars" />
          ) : (
            <UnitField label="Target Weight" value={targetW} onChange={setTargetW} unit={targetWU} onUnitChange={setTargetWU} unitType="mass" />
          )}
        </InputPanel>
      }
      results={
        <ResultPanel
          label={mode === "a" ? `Total (${qty} bars)` : "Bars Required"}
          primary={mode === "a" ? `${n2(totalKg)} kg` : `${barsNeeded} bars`}
          primarySub={mode === "a" ? `· ${n2(totalKg*2.205)} lb` : undefined}
        >
          {mode === "a" ? (
            <>
              <BreakdownRow label="Formula"      value="d² ÷ 162 kg/m" />
              <BreakdownRow label="Weight/metre" value={`${wtPerM.toFixed(4)} kg/m`} />
              <BreakdownRow label="Weight/bar"   value={`${n2(wtPerBar)} kg`} />
            </>
          ) : (
            <>
              <BreakdownRow label="Weight per bar"      value={`${n2(wtPerBar)} kg`} />
              <BreakdownRow label="Total length needed"  value={`${n2(totalLenM)} m`} />
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

function ExcavationCalc() {
  const [shape, setShape] = useState("rectangular");
  const [len, setLen] = useState("10"); const [lenU, setLenU] = useState("m");
  const [wid, setWid] = useState("5");  const [widU, setWidU] = useState("m");
  const [dep, setDep] = useState("2");  const [depU, setDepU] = useState("m");
  const [soilType, setSoilType] = useState("normal");
  const [truckCap, setTruckCap] = useState("5"); const [truckU, setTruckU] = useState("m3");

  const swells: Record<string,number> = {normal:1.25,sandy:1.12,clay:1.40,rock:1.60};
  const sw = swells[soilType];
  const lM = toSI(parseFloat(len)||0,lenU,"length");
  const wM = toSI(parseFloat(wid)||0,widU,"length");
  const dM = toSI(parseFloat(dep)||0,depU,"length");
  const volM3 = shape==="rectangular" ? lM*wM*dM : Math.PI*(wM/2)*(wM/2)*dM;
  const swollenM3 = volM3*sw;
  const capM3 = toSI(parseFloat(truckCap)||5,truckU,"volume");
  const trucks = capM3>0 ? Math.ceil(swollenM3/capM3) : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Excavation Calculator" icon={Mountain} iconColor="bg-amber-800">
          <SelectField label="Shape" value={shape} onChange={setShape} options={[
            {value:"rectangular",label:"Rectangular / Trench"},
            {value:"circular",   label:"Circular Pit"},
          ]} />
          {shape==="rectangular" ? (
            <div className="grid grid-cols-2 gap-3">
              <UnitField label="Length" value={len} onChange={setLen} unit={lenU} onUnitChange={setLenU} unitType="length" />
              <UnitField label="Width"  value={wid} onChange={setWid} unit={widU} onUnitChange={setWidU} unitType="length" />
            </div>
          ) : (
            <UnitField label="Diameter" value={wid} onChange={setWid} unit={widU} onUnitChange={setWidU} unitType="length" />
          )}
          <UnitField label="Depth" value={dep} onChange={setDep} unit={depU} onUnitChange={setDepU} unitType="length" />
          <SelectField label="Soil Type (swell factor)" value={soilType} onChange={setSoilType} options={[
            {value:"normal",label:"Normal soil (×1.25)"},
            {value:"sandy", label:"Sandy soil (×1.12)"},
            {value:"clay",  label:"Clay (×1.40)"},
            {value:"rock",  label:"Rock (×1.60)"},
          ]} />
          <UnitField label="Truck Capacity" value={truckCap} onChange={setTruckCap} unit={truckU} onUnitChange={setTruckU} unitType="volume" />
        </InputPanel>
      }
      results={
        <ResultPanel label="Truck Loads" primary={`${trucks} trucks`}>
          <BreakdownRow label="In-situ Volume" value={`${n2(volM3)} m³`} />
          <BreakdownRow label="Swell Factor"   value={`× ${sw}  (${soilType})`} />
          <BreakdownRow label="Swollen Volume" value={`${n2(swollenM3)} m³`} />
        </ResultPanel>
      }
    />
  );
}

function StaircaseCalc() {
  const [flh, setFlh] = useState("3");   const [flhU, setFlhU] = useState("m");
  const [ris, setRis] = useState("175"); const [risU, setRisU] = useState("mm");
  const [tre, setTre] = useState("250"); const [treU, setTreU] = useState("mm");
  const [sw,  setSw]  = useState("1.2"); const [swU,  setSwU]  = useState("m");

  const fhM = toSI(parseFloat(flh)||0,flhU,"length");
  const rhM = toSI(parseFloat(ris)||0,risU,"length");
  const tdM = toSI(parseFloat(tre)||0,treU,"length");
  const wM  = toSI(parseFloat(sw)||0, swU, "length");

  const steps = rhM>0 ? Math.round(fhM/rhM) : 0;
  const actualRiser = steps>0 ? fhM/steps : 0;
  const going = steps>0 ? (steps-1)*tdM : 0;
  const angle = going>0 ? Math.atan2(fhM,going)*(180/Math.PI) : 0;
  const concreteM3 = steps>0 ? 0.5*actualRiser*tdM*wM*steps : 0;
  const ok = actualRiser>=0.15&&actualRiser<=0.19&&tdM>=0.23&&tdM<=0.30;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Staircase Designer" icon={TrendingUp} iconColor="bg-indigo-500">
          <UnitField label="Floor-to-Floor Height" value={flh} onChange={setFlh} unit={flhU} onUnitChange={setFlhU} unitType="length" hint="Typical: 2.8–3.2 m" />
          <div className="grid grid-cols-2 gap-3">
            <UnitField label="Riser Height" value={ris} onChange={setRis} unit={risU} onUnitChange={setRisU} unitType="length" hint="Ideal: 150–190 mm" />
            <UnitField label="Tread Depth"  value={tre} onChange={setTre} unit={treU} onUnitChange={setTreU} unitType="length" hint="Ideal: 230–300 mm" />
          </div>
          <UnitField label="Stair Width" value={sw} onChange={setSw} unit={swU} onUnitChange={setSwU} unitType="length" hint="Min: 900 mm" />
        </InputPanel>
      }
      results={
        <ResultPanel
          label="Number of Steps"
          primary={`${steps}`}
          tip={ok ? "✓ Comfortable & code-compliant" : "⚠ Adjust riser or tread for comfort"}
        >
          <BreakdownRow label="Actual Riser"      value={`${(actualRiser*1000).toFixed(1)} mm`} />
          <BreakdownRow label="Total Going (run)"  value={`${n2(going)} m`} />
          <BreakdownRow label="Slope Angle"        value={`${angle.toFixed(1)}°`} />
          <BreakdownRow label="Concrete Approx."   value={`${n2(concreteM3)} m³`} />
        </ResultPanel>
      }
    />
  );
}

function GravelCalc() {
  const [mode, setMode] = useState<"a"|"b">("a");
  const [len, setLen] = useState("10"); const [lenU, setLenU] = useState("m");
  const [wid, setWid] = useState("5");  const [widU, setWidU] = useState("m");
  const [dep, setDep] = useState("100");const [depU, setDepU] = useState("mm");
  const [mat, setMat] = useState("gravel");
  const [woh, setWoh] = useState("1000"); const [wohU, setWohU] = useState("kg");

  const densities: Record<string,{d:number;name:string}> = {
    gravel:   {d:1680, name:"Gravel (Crushed)"},
    sand:     {d:1600, name:"Sand (Dry)"},
    topsoil:  {d:950,  name:"Topsoil"},
    mulch:    {d:400,  name:"Mulch"},
    concrete: {d:2300, name:"Crushed Concrete"},
  };
  const sel = densities[mat];
  const lM = toSI(parseFloat(len)||0,lenU,"length");
  const wM = toSI(parseFloat(wid)||0,widU,"length");
  const dM = toSI(parseFloat(dep)||0,depU,"length");
  const volM3   = lM*wM*dM;
  const weightKg= volM3*sel.d;
  const tonnes  = weightKg/1000;
  const wKg  = toSI(parseFloat(woh)||0,wohU,"mass");
  const areaFr = dM>0 ? wKg/(sel.d*dM) : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Gravel / Fill Calculator" icon={Truck} iconColor="bg-stone-500">
          <ModeSelector modes={[{id:"a",label:"Area → Quantity"},{id:"b",label:"Quantity → Area"}]} active={mode} onChange={v=>setMode(v as "a"|"b")} />
          {mode === "a" ? (
            <div className="grid grid-cols-2 gap-3">
              <UnitField label="Length" value={len} onChange={setLen} unit={lenU} onUnitChange={setLenU} unitType="length" />
              <UnitField label="Width"  value={wid} onChange={setWid} unit={widU} onUnitChange={setWidU} unitType="length" />
            </div>
          ) : (
            <UnitField label="Material on Hand" value={woh} onChange={setWoh} unit={wohU} onUnitChange={setWohU} unitType="mass" />
          )}
          <UnitField label="Depth" value={dep} onChange={setDep} unit={depU} onUnitChange={setDepU} unitType="length" hint="Driveway: 100 mm · Path: 50 mm" />
          <SelectField label="Material" value={mat} onChange={setMat}
            options={Object.entries(densities).map(([k,v])=>({value:k,label:v.name}))} />
        </InputPanel>
      }
      results={
        <ResultPanel
          label={mode === "a" ? "Metric Tonnes" : "Area Coverable"}
          primary={mode === "a" ? `${tonnes.toFixed(2)} t` : `${n2(areaFr)} m²`}
          summaries={mode === "a" ? (
            <>
              <SummaryCard label="Volume" value={`${n2(volM3)} m³`} />
              <SummaryCard label="Weight" value={`${n2(weightKg)} kg`} />
            </>
          ) : undefined}
        >
          {mode === "b" && (
            <BreakdownRow label="Material" value={`${woh} ${wohU}`} />
          )}
        </ResultPanel>
      }
    />
  );
}
