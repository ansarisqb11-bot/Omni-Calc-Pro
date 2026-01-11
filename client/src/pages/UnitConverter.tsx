import { useState } from "react";
import { ArrowRightLeft, Ruler, Weight, Thermometer } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { id: "length", name: "Length", icon: Ruler, units: ["Meters", "Feet", "Inches", "Kilometers"] },
  { id: "weight", name: "Weight", icon: Weight, units: ["Kilograms", "Pounds", "Grams", "Ounces"] },
  { id: "temp", name: "Temp", icon: Thermometer, units: ["Celsius", "Fahrenheit", "Kelvin"] },
];

export default function UnitConverter() {
  const [category, setCategory] = useState(categories[0]);
  const [fromUnit, setFromUnit] = useState(categories[0].units[0]);
  const [toUnit, setToUnit] = useState(categories[0].units[1]);
  const [value, setValue] = useState<number | string>("");

  // Placeholder conversion logic
  const convert = (val: number) => {
    // This is just a UI mock, logic would go here
    return (val * 1.5).toFixed(2);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 pb-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-display">Unit Converter</h1>
        <p className="text-muted-foreground mt-2">Convert between common units of measurement</p>
      </div>

      {/* Category Selector */}
      <div className="flex justify-center gap-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setCategory(cat);
              setFromUnit(cat.units[0]);
              setToUnit(cat.units[1]);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 ${
              category.id === cat.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-blue-500/25 ring-2 ring-primary/20"
                : "bg-card text-muted-foreground hover:bg-card/80 border border-border/50"
            }`}
          >
            <cat.icon className="w-4 h-4" />
            <span className="font-medium">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Converter Card */}
      <motion.div 
        layout
        className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-2xl"
      >
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          {/* From */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground ml-1">From</label>
            <input
              type="number"
              placeholder="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full text-4xl font-display font-bold bg-transparent border-none focus:outline-none placeholder:text-muted/20"
            />
            <div className="relative">
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {category.units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button 
              className="p-4 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
              onClick={() => {
                 const temp = fromUnit;
                 setFromUnit(toUnit);
                 setToUnit(temp);
              }}
            >
              <ArrowRightLeft className="w-6 h-6" />
            </button>
          </div>

          {/* To */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground ml-1">To</label>
            <div className="w-full text-4xl font-display font-bold text-primary py-2 truncate">
              {value ? convert(Number(value)) : "0"}
            </div>
            <div className="relative">
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {category.units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
