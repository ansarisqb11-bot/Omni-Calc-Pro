import { useState } from "react";
import { ArrowRightLeft, Ruler, Weight, Thermometer, Droplets, Zap, Square, Gauge, Flame, HardDrive, LucideIcon } from "lucide-react";
import { DesktopToolGrid, InputPanel, ResultPanel, SummaryCard, BreakdownRow, InputField } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

interface UnitDef { name: string; toBase: number; fromBase: number; }

interface Category {
  id: string; name: string; icon: LucideIcon;
  units: UnitDef[];
  convertFn?: (val: number, from: string, to: string) => number;
}

function convertTemperature(val: number, from: string, to: string): number {
  let celsius = val;
  if (from === "Fahrenheit") celsius = (val - 32) * 5 / 9;
  else if (from === "Kelvin") celsius = val - 273.15;

  if (to === "Celsius") return celsius;
  if (to === "Fahrenheit") return celsius * 9 / 5 + 32;
  if (to === "Kelvin") return celsius + 273.15;
  return val;
}

const categories: Category[] = [
  {
    id: "length", name: "Length", icon: Ruler,
    units: [
      { name: "Meters", toBase: 1, fromBase: 1 }, { name: "Kilometers", toBase: 1000, fromBase: 0.001 },
      { name: "Centimeters", toBase: 0.01, fromBase: 100 }, { name: "Millimeters", toBase: 0.001, fromBase: 1000 },
      { name: "Miles", toBase: 1609.34, fromBase: 0.000621371 }, { name: "Yards", toBase: 0.9144, fromBase: 1.09361 },
      { name: "Feet", toBase: 0.3048, fromBase: 3.28084 }, { name: "Inches", toBase: 0.0254, fromBase: 39.3701 },
    ],
  },
  {
    id: "area", name: "Area", icon: Square,
    units: [
      { name: "sq.m", toBase: 1, fromBase: 1 }, { name: "sq.km", toBase: 1000000, fromBase: 0.000001 },
      { name: "sq.ft", toBase: 0.092903, fromBase: 10.7639 }, { name: "sq.yd", toBase: 0.836127, fromBase: 1.19599 },
      { name: "Acres", toBase: 4046.86, fromBase: 0.000247105 }, { name: "Hectares", toBase: 10000, fromBase: 0.0001 },
    ],
  },
  {
    id: "weight", name: "Weight", icon: Weight,
    units: [
      { name: "Kilograms", toBase: 1, fromBase: 1 }, { name: "Grams", toBase: 0.001, fromBase: 1000 },
      { name: "Milligrams", toBase: 0.000001, fromBase: 1000000 }, { name: "Pounds", toBase: 0.453592, fromBase: 2.20462 },
      { name: "Ounces", toBase: 0.0283495, fromBase: 35.274 }, { name: "Tons", toBase: 1000, fromBase: 0.001 },
    ],
  },
  {
    id: "temp", name: "Temp", icon: Thermometer,
    units: [
      { name: "Celsius", toBase: 1, fromBase: 1 },
      { name: "Fahrenheit", toBase: 1, fromBase: 1 },
      { name: "Kelvin", toBase: 1, fromBase: 1 },
    ],
    convertFn: convertTemperature,
  },
  {
    id: "volume", name: "Volume", icon: Droplets,
    units: [
      { name: "Liters", toBase: 1, fromBase: 1 }, { name: "Milliliters", toBase: 0.001, fromBase: 1000 },
      { name: "Gallons (US)", toBase: 3.78541, fromBase: 0.264172 }, { name: "Quarts", toBase: 0.946353, fromBase: 1.05669 },
      { name: "Pints", toBase: 0.473176, fromBase: 2.11338 }, { name: "Cups", toBase: 0.236588, fromBase: 4.22675 },
      { name: "Fluid Oz", toBase: 0.0295735, fromBase: 33.814 },
    ],
  },
  {
    id: "speed", name: "Speed", icon: Zap,
    units: [
      { name: "m/s", toBase: 1, fromBase: 1 }, { name: "km/h", toBase: 0.277778, fromBase: 3.6 },
      { name: "mph", toBase: 0.44704, fromBase: 2.23694 }, { name: "knots", toBase: 0.514444, fromBase: 1.94384 },
      { name: "ft/s", toBase: 0.3048, fromBase: 3.28084 },
    ],
  },
  {
    id: "pressure", name: "Pressure", icon: Gauge,
    units: [
      { name: "Pascal", toBase: 1, fromBase: 1 }, { name: "kPa", toBase: 1000, fromBase: 0.001 },
      { name: "Bar", toBase: 100000, fromBase: 0.00001 }, { name: "PSI", toBase: 6894.76, fromBase: 0.000145038 },
      { name: "atm", toBase: 101325, fromBase: 0.00000986923 },
    ],
  },
  {
    id: "energy", name: "Energy", icon: Flame,
    units: [
      { name: "Joules", toBase: 1, fromBase: 1 }, { name: "kJ", toBase: 1000, fromBase: 0.001 },
      { name: "Calories", toBase: 4.184, fromBase: 0.239006 }, { name: "kcal", toBase: 4184, fromBase: 0.000239006 },
      { name: "Wh", toBase: 3600, fromBase: 0.000277778 }, { name: "kWh", toBase: 3600000, fromBase: 2.77778e-7 },
      { name: "BTU", toBase: 1055.06, fromBase: 0.000947817 },
    ],
  },
  {
    id: "data", name: "Data", icon: HardDrive,
    units: [
      { name: "Bytes", toBase: 1, fromBase: 1 }, { name: "Kilobytes", toBase: 1024, fromBase: 1 / 1024 },
      { name: "Megabytes", toBase: 1048576, fromBase: 1 / 1048576 }, { name: "Gigabytes", toBase: 1073741824, fromBase: 1 / 1073741824 },
      { name: "Terabytes", toBase: 1099511627776, fromBase: 1 / 1099511627776 },
      { name: "Bits", toBase: 0.125, fromBase: 8 }, { name: "Kilobits", toBase: 125, fromBase: 0.008 },
      { name: "Megabits", toBase: 125000, fromBase: 0.000008 },
    ],
  },
];

const fmtResult = (n: number): string => {
  if (!isFinite(n) || isNaN(n)) return "—";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 0.0001 && n !== 0)) return n.toExponential(4);
  const d = Math.abs(n) >= 1000 ? 2 : Math.abs(n) >= 1 ? 4 : 6;
  return parseFloat(n.toFixed(d)).toLocaleString();
};

export default function UnitConverter() {
  const [activeCat, setActiveCat] = useState("length");
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("Meters");
  const [toUnit, setToUnit] = useState("Feet");

  const cat = categories.find(c => c.id === activeCat) || categories[0];

  const doConvert = (val: number, from: string, to: string): number => {
    if (cat.convertFn) return cat.convertFn(val, from, to);
    const fromDef = cat.units.find(u => u.name === from);
    const toDef = cat.units.find(u => u.name === to);
    if (!fromDef || !toDef) return 0;
    return val * fromDef.toBase * toDef.fromBase;
  };

  const v = parseFloat(value) || 0;
  const result = doConvert(v, fromUnit, toUnit);

  const handleCatChange = (id: string) => {
    setActiveCat(id);
    const newCat = categories.find(c => c.id === id)!;
    setFromUnit(newCat.units[0].name);
    setToUnit(newCat.units[1]?.name || newCat.units[0].name);
  };

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit); };

  const tools = categories.map(c => ({ id: c.id, label: c.name, icon: c.icon }));

  return (
    <PageWrapper title="Unit Converter" subtitle="Convert between any units instantly" accentColor="bg-primary" tools={tools} activeTool={activeCat} onToolChange={handleCatChange}>
      <DesktopToolGrid
        inputs={
          <InputPanel title={`${cat.name} Converter`} icon={cat.icon} iconColor="bg-primary">
            <InputField label="Value to Convert" value={value} onChange={setValue} type="number" />
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">From</label>
              <div className="flex gap-1.5 flex-wrap">
                {cat.units.map(u => (
                  <button key={u.name} onClick={() => setFromUnit(u.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${fromUnit === u.name ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground border border-border hover:text-foreground"}`}>
                    {u.name}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={swap} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-all w-full justify-center">
              <ArrowRightLeft className="w-4 h-4" /> Swap Units
            </button>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">To</label>
              <div className="flex gap-1.5 flex-wrap">
                {cat.units.map(u => (
                  <button key={u.name} onClick={() => setToUnit(u.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${toUnit === u.name ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground border border-border hover:text-foreground"}`}>
                    {u.name}
                  </button>
                ))}
              </div>
            </div>
          </InputPanel>
        }
        results={
          <ResultPanel label={`${value} ${fromUnit} =`} primary={fmtResult(result)} primarySub={toUnit}
            summaries={<>
              <SummaryCard label="From" value={fromUnit} accent="text-primary" />
              <SummaryCard label="To" value={toUnit} />
            </>}
            tip={`1 ${fromUnit} = ${fmtResult(doConvert(1, fromUnit, toUnit))} ${toUnit}`}
          >
            <BreakdownRow label="Input" value={`${value} ${fromUnit}`} dot="bg-blue-400" />
            <BreakdownRow label="Result" value={`${fmtResult(result)} ${toUnit}`} dot="bg-primary" bold />
            {cat.units.filter(u => u.name !== fromUnit).map(u => (
              <BreakdownRow key={u.name} label={u.name} value={fmtResult(doConvert(v, fromUnit, u.name))} dot="bg-muted" bold={u.name === toUnit} />
            ))}
          </ResultPanel>
        }
      />
    </PageWrapper>
  );
}
