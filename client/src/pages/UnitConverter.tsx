import { useState } from "react";
import { motion } from "framer-motion";
import { create, all } from "mathjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft } from "lucide-react";

const math = create(all);

const UNITS = {
  Length: ["meter", "inch", "foot", "yard", "mile", "kilometer", "centimeter"],
  Weight: ["gram", "ounce", "pound", "kilogram", "tonne"],
  Volume: ["liter", "gallon", "milliliter", "cup", "teaspoon", "tablespoon"],
  Temperature: ["degC", "degF", "kelvin"],
};

export default function UnitConverter() {
  const [category, setCategory] = useState<keyof typeof UNITS>("Length");
  const [fromUnit, setFromUnit] = useState(UNITS.Length[0]);
  const [toUnit, setToUnit] = useState(UNITS.Length[1]);
  const [value, setValue] = useState<string>("1");

  let result = "---";
  try {
    if (value) {
      result = math.unit(Number(value), fromUnit).to(toUnit).format({ precision: 4 });
    }
  } catch (e) {
    result = "Error";
  }

  const handleCategoryChange = (val: string) => {
    const newCat = val as keyof typeof UNITS;
    setCategory(newCat);
    setFromUnit(UNITS[newCat][0]);
    setToUnit(UNITS[newCat][1]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-display font-bold mb-2">Unit Converter</h1>
        <p className="text-muted-foreground">Convert between measurements easily.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 shadow-xl rounded-3xl p-8"
      >
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="h-12 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(UNITS).map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <div className="space-y-2">
              <Label>From</Label>
              <Input 
                type="number" 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                className="h-14 text-2xl font-mono text-center mb-2"
              />
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {UNITS[category].map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-8 text-muted-foreground">
              <ArrowRightLeft className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <div className="h-14 flex items-center justify-center text-2xl font-mono font-bold text-primary bg-primary/5 rounded-xl border border-primary/10 mb-2">
                {result.split(" ")[0]}
              </div>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {UNITS[category].map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
