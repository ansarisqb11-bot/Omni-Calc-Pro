import { useState } from "react";
import { ArrowRightLeft, Ruler, Weight, Thermometer, Droplets, Zap, Clock, Square, Gauge, Flame, HardDrive, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { ToolCard } from "@/components/ToolCard";
import { LucideIcon } from "lucide-react";

interface UnitCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  units: { name: string; toBase: number; fromBase: number }[];
}

const categories: UnitCategory[] = [
  {
    id: "length",
    name: "Length",
    icon: Ruler,
    units: [
      { name: "Meters", toBase: 1, fromBase: 1 },
      { name: "Kilometers", toBase: 1000, fromBase: 0.001 },
      { name: "Centimeters", toBase: 0.01, fromBase: 100 },
      { name: "Millimeters", toBase: 0.001, fromBase: 1000 },
      { name: "Miles", toBase: 1609.34, fromBase: 0.000621371 },
      { name: "Yards", toBase: 0.9144, fromBase: 1.09361 },
      { name: "Feet", toBase: 0.3048, fromBase: 3.28084 },
      { name: "Inches", toBase: 0.0254, fromBase: 39.3701 },
    ],
  },
  {
    id: "area",
    name: "Area",
    icon: Square,
    units: [
      { name: "sq.m", toBase: 1, fromBase: 1 },
      { name: "sq.km", toBase: 1000000, fromBase: 0.000001 },
      { name: "sq.ft", toBase: 0.092903, fromBase: 10.7639 },
      { name: "sq.yd", toBase: 0.836127, fromBase: 1.19599 },
      { name: "Acres", toBase: 4046.86, fromBase: 0.000247105 },
      { name: "Hectares", toBase: 10000, fromBase: 0.0001 },
    ],
  },
  {
    id: "weight",
    name: "Weight",
    icon: Weight,
    units: [
      { name: "Kilograms", toBase: 1, fromBase: 1 },
      { name: "Grams", toBase: 0.001, fromBase: 1000 },
      { name: "Milligrams", toBase: 0.000001, fromBase: 1000000 },
      { name: "Pounds", toBase: 0.453592, fromBase: 2.20462 },
      { name: "Ounces", toBase: 0.0283495, fromBase: 35.274 },
      { name: "Tons", toBase: 1000, fromBase: 0.001 },
    ],
  },
  {
    id: "temp",
    name: "Temp",
    icon: Thermometer,
    units: [
      { name: "Celsius", toBase: 1, fromBase: 1 },
      { name: "Fahrenheit", toBase: 1, fromBase: 1 },
      { name: "Kelvin", toBase: 1, fromBase: 1 },
    ],
  },
  {
    id: "volume",
    name: "Volume",
    icon: Droplets,
    units: [
      { name: "Liters", toBase: 1, fromBase: 1 },
      { name: "Milliliters", toBase: 0.001, fromBase: 1000 },
      { name: "Gallons (US)", toBase: 3.78541, fromBase: 0.264172 },
      { name: "Quarts", toBase: 0.946353, fromBase: 1.05669 },
      { name: "Pints", toBase: 0.473176, fromBase: 2.11338 },
      { name: "Cups", toBase: 0.236588, fromBase: 4.22675 },
      { name: "Fluid Oz", toBase: 0.0295735, fromBase: 33.814 },
    ],
  },
  {
    id: "speed",
    name: "Speed",
    icon: Zap,
    units: [
      { name: "m/s", toBase: 1, fromBase: 1 },
      { name: "km/h", toBase: 0.277778, fromBase: 3.6 },
      { name: "mph", toBase: 0.44704, fromBase: 2.23694 },
      { name: "knots", toBase: 0.514444, fromBase: 1.94384 },
      { name: "ft/s", toBase: 0.3048, fromBase: 3.28084 },
    ],
  },
  {
    id: "pressure",
    name: "Pressure",
    icon: Gauge,
    units: [
      { name: "Pascal", toBase: 1, fromBase: 1 },
      { name: "kPa", toBase: 1000, fromBase: 0.001 },
      { name: "Bar", toBase: 100000, fromBase: 0.00001 },
      { name: "PSI", toBase: 6894.76, fromBase: 0.000145038 },
      { name: "atm", toBase: 101325, fromBase: 0.00000986923 },
    ],
  },
  {
    id: "energy",
    name: "Energy",
    icon: Flame,
    units: [
      { name: "Joules", toBase: 1, fromBase: 1 },
      { name: "kJ", toBase: 1000, fromBase: 0.001 },
      { name: "Calories", toBase: 4.184, fromBase: 0.239006 },
      { name: "kcal", toBase: 4184, fromBase: 0.000239006 },
      { name: "Wh", toBase: 3600, fromBase: 0.000277778 },
      { name: "kWh", toBase: 3600000, fromBase: 2.77778e-7 },
      { name: "BTU", toBase: 1055.06, fromBase: 0.000947817 },
    ],
  },
  {
    id: "data",
    name: "Data",
    icon: HardDrive,
    units: [
      { name: "Bytes", toBase: 1, fromBase: 1 },
      { name: "KB", toBase: 1024, fromBase: 1/1024 },
      { name: "MB", toBase: 1048576, fromBase: 1/1048576 },
      { name: "GB", toBase: 1073741824, fromBase: 1/1073741824 },
      { name: "TB", toBase: 1099511627776, fromBase: 1/1099511627776 },
    ],
  },
  {
    id: "time",
    name: "Time",
    icon: Clock,
    units: [
      { name: "Seconds", toBase: 1, fromBase: 1 },
      { name: "Minutes", toBase: 60, fromBase: 1 / 60 },
      { name: "Hours", toBase: 3600, fromBase: 1 / 3600 },
      { name: "Days", toBase: 86400, fromBase: 1 / 86400 },
      { name: "Weeks", toBase: 604800, fromBase: 1 / 604800 },
    ],
  },
  {
    id: "frequency",
    name: "Freq",
    icon: Activity,
    units: [
      { name: "Hz", toBase: 1, fromBase: 1 },
      { name: "kHz", toBase: 1000, fromBase: 0.001 },
      { name: "MHz", toBase: 1000000, fromBase: 0.000001 },
      { name: "GHz", toBase: 1000000000, fromBase: 0.000000001 },
    ],
  },
];

export default function UnitConverter() {
  const [category, setCategory] = useState(categories[0]);
  const [fromUnit, setFromUnit] = useState(categories[0].units[0].name);
  const [toUnit, setToUnit] = useState(categories[0].units[1].name);
  const [value, setValue] = useState("");

  const convertTemperature = (val: number, from: string, to: string): number => {
    let celsius: number;
    if (from === "Celsius") celsius = val;
    else if (from === "Fahrenheit") celsius = (val - 32) * 5 / 9;
    else celsius = val - 273.15;

    if (to === "Celsius") return celsius;
    else if (to === "Fahrenheit") return celsius * 9 / 5 + 32;
    else return celsius + 273.15;
  };

  const convert = (val: number): string => {
    if (!val || isNaN(val)) return "0";

    if (category.id === "temp") {
      return convertTemperature(val, fromUnit, toUnit).toFixed(4);
    }

    const fromUnitData = category.units.find((u) => u.name === fromUnit);
    const toUnitData = category.units.find((u) => u.name === toUnit);

    if (!fromUnitData || !toUnitData) return "0";

    const baseValue = val * fromUnitData.toBase;
    const result = baseValue * toUnitData.fromBase;
    return result.toFixed(6).replace(/\.?0+$/, "");
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    setFromUnit(cat.units[0].name);
    setToUnit(cat.units[1].name);
    setValue("");
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">Unit Converter</h1>
        <p className="text-slate-400 text-sm mt-1">Convert between common units of measurement</p>
      </div>

      {/* Category Tabs */}
      <div className="px-4 py-3 border-b border-slate-800/50">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat)}
              data-testid={`tab-${cat.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                category.id === cat.id
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Converter */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto space-y-4">
          <ToolCard title={`${category.name} Converter`} icon={category.icon} iconColor="bg-blue-500">
            <div className="space-y-5">
              {/* From Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">From</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter value"
                  className="w-full text-3xl font-bold bg-transparent border-none text-white placeholder:text-slate-600 focus:outline-none"
                  data-testid="input-from-value"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  data-testid="select-from-unit"
                >
                  {category.units.map((u) => (
                    <option key={u.name} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <motion.button
                  whileTap={{ scale: 0.95, rotate: 180 }}
                  onClick={handleSwap}
                  className="p-4 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 transition-colors"
                  data-testid="button-swap"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </motion.button>
              </div>

              {/* To Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">To</label>
                <div className="text-3xl font-bold text-primary py-2">
                  {convert(parseFloat(value) || 0)}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  data-testid="select-to-unit"
                >
                  {category.units.map((u) => (
                    <option key={u.name} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </ToolCard>

          {/* Quick Reference */}
          <ToolCard title="Quick Reference" icon={Ruler} iconColor="bg-slate-500">
            <div className="space-y-2 text-sm">
              {category.units.slice(0, 5).map((unit) => (
                <div key={unit.name} className="flex justify-between text-slate-400">
                  <span>1 {fromUnit}</span>
                  <span className="text-white">
                    {category.id === "temp"
                      ? convertTemperature(1, fromUnit, unit.name).toFixed(2)
                      : (
                          (category.units.find((u) => u.name === fromUnit)?.toBase || 1) *
                          unit.fromBase
                        ).toFixed(4)}{" "}
                    {unit.name}
                  </span>
                </div>
              ))}
            </div>
          </ToolCard>
        </div>
      </div>
    </div>
  );
}
