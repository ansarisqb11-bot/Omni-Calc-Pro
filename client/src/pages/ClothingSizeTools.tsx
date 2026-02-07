import { useState, useMemo } from "react";
import { Shirt, Footprints, Baby, Users, Ruler, Scissors } from "lucide-react";
import { ToolCard, ResultDisplay } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "men-clothing" | "women-clothing" | "kids-clothing" | "men-shoes" | "women-shoes" | "kids-shoes" | "slippers";

type ClothingType = "shirt" | "jacket" | "pants" | "kurta" | "innerwear" | "dress";
type MeasurementUnit = "cm" | "inch" | "mm" | "ft";

const MEN_CLOTHING_DATA = [
  { alpha: "XS", chestMin: 86, chestMax: 91, india: "XS", us: "XS", uk: "36", eu: "46", japan: "S", china: "165/84A", canada: "XS", aus: "XS" },
  { alpha: "S", chestMin: 91, chestMax: 96, india: "S", us: "S", uk: "38", eu: "48", japan: "M", china: "170/88A", canada: "S", aus: "S" },
  { alpha: "M", chestMin: 96, chestMax: 101, india: "M", us: "M", uk: "40", eu: "50", japan: "L", china: "170/92A", canada: "M", aus: "M" },
  { alpha: "L", chestMin: 101, chestMax: 106, india: "L", us: "L", uk: "42", eu: "52", japan: "LL", china: "175/96A", canada: "L", aus: "L" },
  { alpha: "XL", chestMin: 106, chestMax: 111, india: "XL", us: "XL", uk: "44", eu: "54", japan: "3L", china: "180/100A", canada: "XL", aus: "XL" },
  { alpha: "XXL", chestMin: 111, chestMax: 117, india: "XXL", us: "XXL", uk: "46", eu: "56", japan: "4L", china: "185/104A", canada: "XXL", aus: "XXL" },
  { alpha: "XXXL", chestMin: 117, chestMax: 122, india: "XXXL", us: "3XL", uk: "48", eu: "58", japan: "5L", china: "190/108A", canada: "3XL", aus: "3XL" },
];

const MEN_PANTS_DATA = [
  { alpha: "XS", waistMin: 66, waistMax: 71, india: "26-28", us: "26-28", uk: "26-28", eu: "42", japan: "S", china: "S" },
  { alpha: "S", waistMin: 71, waistMax: 76, india: "28-30", us: "28-30", uk: "28-30", eu: "44", japan: "M", china: "M" },
  { alpha: "M", waistMin: 81, waistMax: 86, india: "32-34", us: "32-34", uk: "32-34", eu: "48", japan: "L", china: "L" },
  { alpha: "L", waistMin: 91, waistMax: 96, india: "36-38", us: "36-38", uk: "36-38", eu: "52", japan: "LL", china: "XL" },
  { alpha: "XL", waistMin: 101, waistMax: 106, india: "40-42", us: "40-42", uk: "40-42", eu: "56", japan: "3L", china: "XXL" },
  { alpha: "XXL", waistMin: 111, waistMax: 116, india: "44-46", us: "44-46", uk: "44-46", eu: "60", japan: "4L", china: "3XL" },
];

const WOMEN_CLOTHING_DATA = [
  { alpha: "XS", bustMin: 78, bustMax: 82, india: "XS", us: "0-2", uk: "6", eu: "34", japan: "S", china: "155/80A", canada: "XS", aus: "4" },
  { alpha: "S", bustMin: 83, bustMax: 87, india: "S", us: "4-6", uk: "8", eu: "36", japan: "M", china: "160/84A", canada: "S", aus: "6-8" },
  { alpha: "M", bustMin: 88, bustMax: 92, india: "M", us: "8-10", uk: "10", eu: "38", japan: "L", china: "165/88A", canada: "M", aus: "10-12" },
  { alpha: "L", bustMin: 93, bustMax: 97, india: "L", us: "12-14", uk: "12", eu: "40", japan: "LL", china: "170/92A", canada: "L", aus: "14" },
  { alpha: "XL", bustMin: 98, bustMax: 102, india: "XL", us: "16", uk: "14", eu: "42", japan: "3L", china: "175/96A", canada: "XL", aus: "16" },
  { alpha: "XXL", bustMin: 103, bustMax: 108, india: "XXL", us: "18", uk: "16", eu: "44", japan: "4L", china: "180/100A", canada: "XXL", aus: "18" },
  { alpha: "XXXL", bustMin: 109, bustMax: 114, india: "XXXL", us: "20", uk: "18", eu: "46", japan: "5L", china: "185/104A", canada: "3XL", aus: "20" },
];

const KIDS_CLOTHING_DATA = [
  { alpha: "XS", heightMin: 92, heightMax: 104, ageRange: "2-3", india: "2-3", us: "2T", uk: "2-3", eu: "92-98", japan: "95", china: "90" },
  { alpha: "S", heightMin: 104, heightMax: 116, ageRange: "4-5", india: "4-5", us: "4-5", uk: "4-5", eu: "104-110", japan: "110", china: "110" },
  { alpha: "M", heightMin: 116, heightMax: 128, ageRange: "6-7", india: "6-7", us: "6-7", uk: "6-7", eu: "116-122", japan: "120", china: "120" },
  { alpha: "L", heightMin: 128, heightMax: 140, ageRange: "8-9", india: "8-9", us: "8-9", uk: "8-9", eu: "128-134", japan: "130", china: "130" },
  { alpha: "XL", heightMin: 140, heightMax: 152, ageRange: "10-11", india: "10-11", us: "10-11", uk: "10-11", eu: "140-146", japan: "140", china: "140" },
  { alpha: "XXL", heightMin: 152, heightMax: 164, ageRange: "12-13", india: "12-13", us: "12-13", uk: "12-13", eu: "152-158", japan: "150", china: "150" },
];

const MEN_SHOES_DATA = [
  { footLenMin: 22.0, footLenMax: 22.5, india: "4", us: "5", uk: "4", eu: "37", japan: "22.5", china: "37", canada: "5", gulf: "37" },
  { footLenMin: 22.5, footLenMax: 23.0, india: "5", us: "6", uk: "5", eu: "38", japan: "23", china: "38", canada: "6", gulf: "38" },
  { footLenMin: 23.0, footLenMax: 23.5, india: "5", us: "6", uk: "5", eu: "38", japan: "23.5", china: "38", canada: "6", gulf: "38" },
  { footLenMin: 23.5, footLenMax: 24.0, india: "6", us: "7", uk: "6", eu: "39", japan: "24", china: "39", canada: "7", gulf: "39" },
  { footLenMin: 24.0, footLenMax: 24.5, india: "6", us: "7", uk: "6", eu: "40", japan: "24.5", china: "40", canada: "7", gulf: "40" },
  { footLenMin: 24.5, footLenMax: 25.0, india: "7", us: "8", uk: "7", eu: "41", japan: "25", china: "41", canada: "8", gulf: "41" },
  { footLenMin: 25.0, footLenMax: 25.5, india: "7", us: "8", uk: "7", eu: "41", japan: "25.5", china: "41", canada: "8", gulf: "41" },
  { footLenMin: 25.5, footLenMax: 26.0, india: "8", us: "9", uk: "8", eu: "42", japan: "26", china: "42", canada: "9", gulf: "42" },
  { footLenMin: 26.0, footLenMax: 26.5, india: "8", us: "9", uk: "8", eu: "42", japan: "26.5", china: "42", canada: "9", gulf: "42" },
  { footLenMin: 26.5, footLenMax: 27.0, india: "9", us: "10", uk: "9", eu: "43", japan: "27", china: "43", canada: "10", gulf: "43" },
  { footLenMin: 27.0, footLenMax: 27.5, india: "9", us: "10", uk: "9", eu: "43", japan: "27.5", china: "44", canada: "10", gulf: "43" },
  { footLenMin: 27.5, footLenMax: 28.0, india: "10", us: "11", uk: "10", eu: "44", japan: "28", china: "44", canada: "11", gulf: "44" },
  { footLenMin: 28.0, footLenMax: 28.5, india: "10", us: "11", uk: "10", eu: "45", japan: "28.5", china: "45", canada: "11", gulf: "45" },
  { footLenMin: 28.5, footLenMax: 29.0, india: "11", us: "12", uk: "11", eu: "46", japan: "29", china: "46", canada: "12", gulf: "46" },
  { footLenMin: 29.0, footLenMax: 29.5, india: "11", us: "12", uk: "11", eu: "46", japan: "29.5", china: "46", canada: "12", gulf: "46" },
  { footLenMin: 29.5, footLenMax: 30.0, india: "12", us: "13", uk: "12", eu: "47", japan: "30", china: "47", canada: "13", gulf: "47" },
];

const WOMEN_SHOES_DATA = [
  { footLenMin: 21.0, footLenMax: 21.5, india: "3", us: "5", uk: "3", eu: "35", japan: "21.5", china: "35", canada: "5", gulf: "35" },
  { footLenMin: 21.5, footLenMax: 22.0, india: "3.5", us: "5.5", uk: "3.5", eu: "35.5", japan: "22", china: "36", canada: "5.5", gulf: "35.5" },
  { footLenMin: 22.0, footLenMax: 22.5, india: "4", us: "6", uk: "4", eu: "36", japan: "22.5", china: "36", canada: "6", gulf: "36" },
  { footLenMin: 22.5, footLenMax: 23.0, india: "4.5", us: "6.5", uk: "4.5", eu: "37", japan: "23", china: "37", canada: "6.5", gulf: "37" },
  { footLenMin: 23.0, footLenMax: 23.5, india: "5", us: "7", uk: "5", eu: "37.5", japan: "23.5", china: "37", canada: "7", gulf: "37.5" },
  { footLenMin: 23.5, footLenMax: 24.0, india: "5.5", us: "7.5", uk: "5.5", eu: "38", japan: "24", china: "38", canada: "7.5", gulf: "38" },
  { footLenMin: 24.0, footLenMax: 24.5, india: "6", us: "8", uk: "6", eu: "39", japan: "24.5", china: "39", canada: "8", gulf: "39" },
  { footLenMin: 24.5, footLenMax: 25.0, india: "6.5", us: "8.5", uk: "6.5", eu: "39.5", japan: "25", china: "39", canada: "8.5", gulf: "39.5" },
  { footLenMin: 25.0, footLenMax: 25.5, india: "7", us: "9", uk: "7", eu: "40", japan: "25.5", china: "40", canada: "9", gulf: "40" },
  { footLenMin: 25.5, footLenMax: 26.0, india: "7.5", us: "9.5", uk: "7.5", eu: "41", japan: "26", china: "41", canada: "9.5", gulf: "41" },
  { footLenMin: 26.0, footLenMax: 26.5, india: "8", us: "10", uk: "8", eu: "42", japan: "26.5", china: "42", canada: "10", gulf: "42" },
  { footLenMin: 26.5, footLenMax: 27.0, india: "8.5", us: "10.5", uk: "8.5", eu: "42.5", japan: "27", china: "42", canada: "10.5", gulf: "42.5" },
];

const KIDS_SHOES_DATA = [
  { footLenMin: 12.0, footLenMax: 12.5, india: "3", us: "4", uk: "3", eu: "19", japan: "12.5", china: "20", age: "1" },
  { footLenMin: 13.0, footLenMax: 13.5, india: "4", us: "5", uk: "4", eu: "21", japan: "13.5", china: "22", age: "2" },
  { footLenMin: 14.0, footLenMax: 14.5, india: "5", us: "6", uk: "5", eu: "23", japan: "14.5", china: "24", age: "3" },
  { footLenMin: 15.0, footLenMax: 15.5, india: "6", us: "7", uk: "6", eu: "25", japan: "15.5", china: "26", age: "4" },
  { footLenMin: 16.0, footLenMax: 16.5, india: "7", us: "8", uk: "7", eu: "27", japan: "16.5", china: "28", age: "5" },
  { footLenMin: 17.0, footLenMax: 17.5, india: "8", us: "9", uk: "8", eu: "29", japan: "17.5", china: "30", age: "6" },
  { footLenMin: 18.0, footLenMax: 18.5, india: "9", us: "10", uk: "9", eu: "31", japan: "18.5", china: "32", age: "7" },
  { footLenMin: 19.0, footLenMax: 19.5, india: "10", us: "11", uk: "10", eu: "33", japan: "19.5", china: "34", age: "8" },
  { footLenMin: 20.0, footLenMax: 20.5, india: "11", us: "12", uk: "11", eu: "35", japan: "20.5", china: "36", age: "9" },
  { footLenMin: 21.0, footLenMax: 21.5, india: "12", us: "13", uk: "12", eu: "36", japan: "21.5", china: "37", age: "10" },
  { footLenMin: 22.0, footLenMax: 22.5, india: "13", us: "1Y", uk: "13", eu: "37", japan: "22.5", china: "38", age: "11" },
  { footLenMin: 23.0, footLenMax: 23.5, india: "1Y", us: "2Y", uk: "1Y", eu: "38", japan: "23", china: "39", age: "12" },
];

const SLIPPERS_ADULT_DATA = [
  { footLenMin: 23.5, footLenMax: 24.0, india: "5", usMen: "6", usWomen: "7", uk: "5", eu: "38", japan: "24", china: "38" },
  { footLenMin: 24.0, footLenMax: 24.5, india: "6", usMen: "7", usWomen: "8", uk: "6", eu: "39", japan: "24.5", china: "39" },
  { footLenMin: 24.5, footLenMax: 25.0, india: "6", usMen: "7", usWomen: "8", uk: "6", eu: "39", japan: "25", china: "40" },
  { footLenMin: 25.0, footLenMax: 25.5, india: "7", usMen: "8", usWomen: "9", uk: "7", eu: "40", japan: "25.5", china: "41" },
  { footLenMin: 25.5, footLenMax: 26.0, india: "8", usMen: "9", usWomen: "10", uk: "8", eu: "42", japan: "26", china: "42" },
  { footLenMin: 26.0, footLenMax: 26.5, india: "8", usMen: "9", usWomen: "10", uk: "8", eu: "42", japan: "26.5", china: "43" },
  { footLenMin: 26.5, footLenMax: 27.0, india: "9", usMen: "10", usWomen: "11", uk: "9", eu: "43", japan: "27", china: "43" },
  { footLenMin: 27.0, footLenMax: 27.5, india: "10", usMen: "11", usWomen: "12", uk: "10", eu: "44", japan: "27.5", china: "44" },
  { footLenMin: 27.5, footLenMax: 28.0, india: "10", usMen: "11", usWomen: "12", uk: "10", eu: "44", japan: "28", china: "45" },
  { footLenMin: 28.0, footLenMax: 28.5, india: "11", usMen: "12", usWomen: "13", uk: "11", eu: "45", japan: "28.5", china: "46" },
  { footLenMin: 28.5, footLenMax: 29.0, india: "12", usMen: "13", usWomen: "14", uk: "12", eu: "46", japan: "29", china: "47" },
];

const ALPHA_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const ALPHA_WORD_MAP: Record<string, string> = {
  "extra small": "XS", "small": "S", "medium": "M", "large": "L",
  "extra large": "XL", "extra-large": "XL", "double extra large": "XXL",
  "double extra-large": "XXL", "triple extra large": "XXXL", "triple extra-large": "XXXL",
  "2xl": "XXL", "3xl": "XXXL", "2x": "XXL", "3x": "XXXL",
};

function parseAlphaSize(input: string): string | null {
  const trimmed = input.trim().toUpperCase();
  if (ALPHA_SIZES.includes(trimmed)) return trimmed;
  const lower = input.trim().toLowerCase();
  if (ALPHA_WORD_MAP[lower]) return ALPHA_WORD_MAP[lower];
  return null;
}

function parseMeasurement(input: string): { value: number; unit: MeasurementUnit } | null {
  const clean = input.trim().toLowerCase();
  const match = clean.match(/^([\d.]+)\s*(cm|inch|inches|in|mm|ft|feet)?$/);
  if (!match) return null;
  const val = parseFloat(match[1]);
  if (isNaN(val)) return null;
  let unit: MeasurementUnit = "cm";
  const u = match[2] || "";
  if (u === "inch" || u === "inches" || u === "in") unit = "inch";
  else if (u === "mm") unit = "mm";
  else if (u === "ft" || u === "feet") unit = "ft";
  else unit = "cm";
  return { value: val, unit };
}

function convertToCm(value: number, unit: MeasurementUnit): number {
  switch (unit) {
    case "inch": return value * 2.54;
    case "mm": return value / 10;
    case "ft": return value * 30.48;
    default: return value;
  }
}

function cmToInch(cm: number): number {
  return cm / 2.54;
}

function parseShoeInput(input: string): { footLenCm: number } | null {
  const clean = input.trim().toLowerCase();
  const prefixMatch = clean.match(/^(uk|us|eu|india|japan|china|gulf|canada)\s*([\d.]+)$/);
  if (prefixMatch) {
    const system = prefixMatch[1];
    const size = parseFloat(prefixMatch[2]);
    return shoeSystemToFootLength(system, size);
  }
  const suffixMatch = clean.match(/^([\d.]+)\s*(uk|us|eu|india|japan|china|gulf|canada)$/);
  if (suffixMatch) {
    const size = parseFloat(suffixMatch[1]);
    const system = suffixMatch[2];
    return shoeSystemToFootLength(system, size);
  }
  const measurement = parseMeasurement(input);
  if (measurement) {
    return { footLenCm: convertToCm(measurement.value, measurement.unit) };
  }
  const numMatch = clean.match(/^([\d.]+)$/);
  if (numMatch) {
    const val = parseFloat(numMatch[1]);
    if (val >= 3 && val <= 15) return shoeSystemToFootLength("india", val);
    if (val >= 15 && val <= 35) return { footLenCm: val };
    return null;
  }
  return null;
}

function shoeSystemToFootLength(system: string, size: number): { footLenCm: number } | null {
  const allData = [...MEN_SHOES_DATA, ...WOMEN_SHOES_DATA];
  for (const row of allData) {
    const sysKey = system as keyof typeof row;
    if (sysKey in row) {
      const rowVal = parseFloat(String(row[sysKey]));
      if (!isNaN(rowVal) && Math.abs(rowVal - size) < 0.6) {
        return { footLenCm: (row.footLenMin + row.footLenMax) / 2 };
      }
    }
  }
  let baseCm = 0;
  switch (system) {
    case "uk": case "india": baseCm = size * 0.847 + 18.5; break;
    case "us": baseCm = (size - 1) * 0.847 + 18.5; break;
    case "eu": baseCm = (size + 2) * 0.667; break;
    case "japan": baseCm = size; break;
    case "china": baseCm = (size + 2) * 0.667; break;
    case "canada": baseCm = (size - 1) * 0.847 + 18.5; break;
    case "gulf": baseCm = (size + 2) * 0.667; break;
    default: return null;
  }
  return baseCm > 0 ? { footLenCm: baseCm } : null;
}

function SelectField({ label, value, onChange, options, testId }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; testId?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
        data-testid={testId || `select-${label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function SizeInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Enter Size (Any Format)</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        data-testid="input-size"
      />
      <p className="text-xs text-muted-foreground mt-1.5">{placeholder}</p>
    </div>
  );
}

function ResultsGrid({ results }: { results: { label: string; value: string }[] }) {
  if (results.length === 0) return null;
  return (
    <div className="space-y-2 mt-4">
      {results.map((r, i) => (
        <ResultDisplay key={i} label={r.label} value={r.value} highlight={i === 0} />
      ))}
    </div>
  );
}

function MenClothingConverter() {
  const [clothingType, setClothingType] = useState<ClothingType>("shirt");
  const [sizeInput, setSizeInput] = useState("");

  const results = useMemo(() => {
    if (!sizeInput.trim()) return [];
    const data = clothingType === "pants" ? MEN_PANTS_DATA : MEN_CLOTHING_DATA;
    const measureKey = clothingType === "pants" ? "waist" : "chest";

    const alpha = parseAlphaSize(sizeInput);
    if (alpha) {
      const row = data.find(r => r.alpha === alpha);
      if (!row) return [{ label: "Status", value: "Size not found" }];
      const minVal = Number((row as any)[`${measureKey}Min`]);
      const maxVal = Number((row as any)[`${measureKey}Max`]);
      return [
        { label: `${measureKey === "chest" ? "Chest" : "Waist"} (cm)`, value: `${minVal}-${maxVal} cm` },
        { label: `${measureKey === "chest" ? "Chest" : "Waist"} (inch)`, value: `${cmToInch(minVal).toFixed(1)}-${cmToInch(maxVal).toFixed(1)} in` },
        { label: "India", value: row.india },
        { label: "US", value: row.us },
        { label: "UK", value: row.uk },
        { label: "EU", value: row.eu },
        { label: "Japan", value: row.japan },
        { label: "China", value: row.china },
      ];
    }

    const measurement = parseMeasurement(sizeInput);
    if (measurement) {
      const cm = convertToCm(measurement.value, measurement.unit);
      const row = data.find(r => {
        return cm >= Number((r as any)[`${measureKey}Min`]) && cm <= Number((r as any)[`${measureKey}Max`]);
      });
      if (!row) return [{ label: "Status", value: `No match for ${cm.toFixed(1)} cm` }];
      return [
        { label: "Detected Size", value: row.alpha },
        { label: `${measureKey === "chest" ? "Chest" : "Waist"} (cm)`, value: `${cm.toFixed(1)} cm` },
        { label: `${measureKey === "chest" ? "Chest" : "Waist"} (inch)`, value: `${cmToInch(cm).toFixed(1)} in` },
        { label: "India", value: row.india },
        { label: "US", value: row.us },
        { label: "UK", value: row.uk },
        { label: "EU", value: row.eu },
        { label: "Japan", value: row.japan },
        { label: "China", value: row.china },
      ];
    }

    const numMatch = sizeInput.trim().match(/^(\d+)$/);
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      if (clothingType === "shirt" || clothingType === "jacket" || clothingType === "kurta") {
        const ukRow = MEN_CLOTHING_DATA.find(r => r.uk === String(num));
        if (ukRow) {
          return [
            { label: "Detected", value: `UK ${num} = ${ukRow.alpha}` },
            { label: "Chest (cm)", value: `${ukRow.chestMin}-${ukRow.chestMax} cm` },
            { label: "India", value: ukRow.india },
            { label: "US", value: ukRow.us },
            { label: "EU", value: ukRow.eu },
            { label: "Japan", value: ukRow.japan },
            { label: "China", value: ukRow.china },
          ];
        }
        const euRow = MEN_CLOTHING_DATA.find(r => r.eu === String(num));
        if (euRow) {
          return [
            { label: "Detected", value: `EU ${num} = ${euRow.alpha}` },
            { label: "Chest (cm)", value: `${euRow.chestMin}-${euRow.chestMax} cm` },
            { label: "India", value: euRow.india },
            { label: "US", value: euRow.us },
            { label: "UK", value: euRow.uk },
            { label: "Japan", value: euRow.japan },
            { label: "China", value: euRow.china },
          ];
        }
      }
      const cmVal = num;
      const row = data.find(r => {
        return cmVal >= Number((r as any)[`${measureKey}Min`]) && cmVal <= Number((r as any)[`${measureKey}Max`]);
      });
      if (row) {
        return [
          { label: "Detected", value: `${cmVal} cm ${measureKey} = ${row.alpha}` },
          { label: "India", value: row.india },
          { label: "US", value: row.us },
          { label: "UK", value: row.uk },
          { label: "EU", value: row.eu },
          { label: "Japan", value: row.japan },
          { label: "China", value: row.china },
        ];
      }
    }

    return [{ label: "Status", value: "Could not detect size. Try: S, M, L, XL, 40, 100 cm" }];
  }, [sizeInput, clothingType]);

  return (
    <ToolCard title="Men's Clothing" description="Shirt, Jacket, Pants & more" icon={Shirt} iconColor="bg-blue-500">
      <div className="space-y-4">
        <SelectField label="Clothing Type" value={clothingType} onChange={(v) => { setClothingType(v as ClothingType); setSizeInput(""); }} options={[
          { value: "shirt", label: "Shirt / T-Shirt" },
          { value: "jacket", label: "Jacket / Coat" },
          { value: "pants", label: "Pants / Jeans" },
          { value: "kurta", label: "Kurta / Ethnic Wear" },
          { value: "innerwear", label: "Innerwear" },
        ]} testId="select-clothing-type" />
        <SizeInput value={sizeInput} onChange={setSizeInput} placeholder={clothingType === "pants" ? "e.g. M, 32, 82 cm, 34 inch" : "e.g. M, XL, 40, 100 cm, Large"} />
        <ResultsGrid results={results} />
      </div>
    </ToolCard>
  );
}

function WomenClothingConverter() {
  const [clothingType, setClothingType] = useState<ClothingType>("shirt");
  const [sizeInput, setSizeInput] = useState("");

  const results = useMemo(() => {
    if (!sizeInput.trim()) return [];

    const alpha = parseAlphaSize(sizeInput);
    if (alpha) {
      const row = WOMEN_CLOTHING_DATA.find(r => r.alpha === alpha);
      if (!row) return [{ label: "Status", value: "Size not found" }];
      return [
        { label: "Bust (cm)", value: `${row.bustMin}-${row.bustMax} cm` },
        { label: "Bust (inch)", value: `${cmToInch(row.bustMin).toFixed(1)}-${cmToInch(row.bustMax).toFixed(1)} in` },
        { label: "India", value: row.india },
        { label: "US", value: row.us },
        { label: "UK", value: row.uk },
        { label: "EU", value: row.eu },
        { label: "Japan", value: row.japan },
        { label: "China", value: row.china },
        { label: "Canada", value: row.canada },
        { label: "Australia", value: row.aus },
      ];
    }

    const measurement = parseMeasurement(sizeInput);
    if (measurement) {
      const cm = convertToCm(measurement.value, measurement.unit);
      const row = WOMEN_CLOTHING_DATA.find(r => cm >= r.bustMin && cm <= r.bustMax);
      if (!row) return [{ label: "Status", value: `No match for ${cm.toFixed(1)} cm bust` }];
      return [
        { label: "Detected Size", value: row.alpha },
        { label: "Bust (cm)", value: `${cm.toFixed(1)} cm` },
        { label: "Bust (inch)", value: `${cmToInch(cm).toFixed(1)} in` },
        { label: "India", value: row.india },
        { label: "US", value: row.us },
        { label: "UK", value: row.uk },
        { label: "EU", value: row.eu },
        { label: "Japan", value: row.japan },
        { label: "China", value: row.china },
        { label: "Canada", value: row.canada },
        { label: "Australia", value: row.aus },
      ];
    }

    const numMatch = sizeInput.trim().match(/^(\d+)$/);
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      const ukRow = WOMEN_CLOTHING_DATA.find(r => r.uk === String(num));
      if (ukRow) {
        return [
          { label: "Detected", value: `UK ${num} = ${ukRow.alpha}` },
          { label: "Bust (cm)", value: `${ukRow.bustMin}-${ukRow.bustMax} cm` },
          { label: "India", value: ukRow.india },
          { label: "US", value: ukRow.us },
          { label: "EU", value: ukRow.eu },
          { label: "Japan", value: ukRow.japan },
          { label: "China", value: ukRow.china },
        ];
      }
      const euRow = WOMEN_CLOTHING_DATA.find(r => r.eu === String(num));
      if (euRow) {
        return [
          { label: "Detected", value: `EU ${num} = ${euRow.alpha}` },
          { label: "Bust (cm)", value: `${euRow.bustMin}-${euRow.bustMax} cm` },
          { label: "India", value: euRow.india },
          { label: "US", value: euRow.us },
          { label: "UK", value: euRow.uk },
          { label: "Japan", value: euRow.japan },
        ];
      }
      const cm = num;
      const row = WOMEN_CLOTHING_DATA.find(r => cm >= r.bustMin && cm <= r.bustMax);
      if (row) {
        return [
          { label: "Detected", value: `${cm} cm bust = ${row.alpha}` },
          { label: "India", value: row.india },
          { label: "US", value: row.us },
          { label: "UK", value: row.uk },
          { label: "EU", value: row.eu },
          { label: "Japan", value: row.japan },
          { label: "China", value: row.china },
        ];
      }
    }

    return [{ label: "Status", value: "Could not detect size. Try: S, M, L, 10, 88 cm" }];
  }, [sizeInput, clothingType]);

  return (
    <ToolCard title="Women's Clothing" description="Top, Dress, Gown & more" icon={Scissors} iconColor="bg-pink-500">
      <div className="space-y-4">
        <SelectField label="Clothing Type" value={clothingType} onChange={(v) => { setClothingType(v as ClothingType); setSizeInput(""); }} options={[
          { value: "shirt", label: "Top / Blouse" },
          { value: "dress", label: "Dress / Gown" },
          { value: "jacket", label: "Jacket / Coat" },
          { value: "kurta", label: "Kurti / Ethnic Wear" },
          { value: "innerwear", label: "Lingerie / Innerwear" },
        ]} testId="select-women-clothing-type" />
        <SizeInput value={sizeInput} onChange={setSizeInput} placeholder="e.g. M, XL, 10, 88 cm, Large" />
        <ResultsGrid results={results} />
      </div>
    </ToolCard>
  );
}

function KidsClothingConverter() {
  const [inputMode, setInputMode] = useState<"alpha" | "age" | "height">("alpha");
  const [sizeInput, setSizeInput] = useState("");

  const results = useMemo(() => {
    if (!sizeInput.trim()) return [];

    if (inputMode === "alpha") {
      const alpha = parseAlphaSize(sizeInput);
      if (alpha) {
        const row = KIDS_CLOTHING_DATA.find(r => r.alpha === alpha);
        if (!row) return [{ label: "Status", value: "Size not found" }];
        return [
          { label: "Age Range", value: `${row.ageRange} years` },
          { label: "Height (cm)", value: `${row.heightMin}-${row.heightMax} cm` },
          { label: "India", value: row.india },
          { label: "US", value: row.us },
          { label: "UK", value: row.uk },
          { label: "EU", value: row.eu },
          { label: "Japan", value: row.japan },
          { label: "China", value: row.china },
        ];
      }
    }

    if (inputMode === "age") {
      const age = parseFloat(sizeInput);
      if (!isNaN(age)) {
        const row = KIDS_CLOTHING_DATA.find(r => {
          const [minAge, maxAge] = r.ageRange.split("-").map(Number);
          return age >= minAge && age <= maxAge;
        });
        if (row) {
          return [
            { label: "Recommended Size", value: row.alpha },
            { label: "Age Range", value: `${row.ageRange} years` },
            { label: "Height (cm)", value: `${row.heightMin}-${row.heightMax} cm` },
            { label: "India", value: row.india },
            { label: "US", value: row.us },
            { label: "UK", value: row.uk },
            { label: "EU", value: row.eu },
            { label: "Japan", value: row.japan },
            { label: "China", value: row.china },
          ];
        }
      }
    }

    if (inputMode === "height") {
      const measurement = parseMeasurement(sizeInput);
      const cm = measurement ? convertToCm(measurement.value, measurement.unit) : parseFloat(sizeInput);
      if (!isNaN(cm)) {
        const row = KIDS_CLOTHING_DATA.find(r => cm >= r.heightMin && cm <= r.heightMax);
        if (row) {
          return [
            { label: "Recommended Size", value: row.alpha },
            { label: "Age Range", value: `${row.ageRange} years` },
            { label: "Height Match", value: `${cm.toFixed(1)} cm` },
            { label: "India", value: row.india },
            { label: "US", value: row.us },
            { label: "UK", value: row.uk },
            { label: "EU", value: row.eu },
            { label: "Japan", value: row.japan },
            { label: "China", value: row.china },
          ];
        }
      }
    }

    return [{ label: "Status", value: "No match found. Try another value." }];
  }, [sizeInput, inputMode]);

  return (
    <ToolCard title="Kids Clothing" description="Baby, Toddler, Kids & Teens" icon={Baby} iconColor="bg-amber-500">
      <div className="space-y-4">
        <SelectField label="Input Mode" value={inputMode} onChange={(v) => { setInputMode(v as any); setSizeInput(""); }} options={[
          { value: "alpha", label: "Size (S, M, L, XL)" },
          { value: "age", label: "Age (years)" },
          { value: "height", label: "Height (cm / inch)" },
        ]} testId="select-kids-input-mode" />
        <SizeInput value={sizeInput} onChange={setSizeInput} placeholder={
          inputMode === "alpha" ? "e.g. S, M, L, XL" :
          inputMode === "age" ? "e.g. 5, 8, 12" :
          "e.g. 120 cm, 48 inch"
        } />
        <ResultsGrid results={results} />
      </div>
    </ToolCard>
  );
}

function ShoeConverter({ gender }: { gender: "men" | "women" | "kids" }) {
  const [sizeInput, setSizeInput] = useState("");

  const data = gender === "kids" ? KIDS_SHOES_DATA : gender === "women" ? WOMEN_SHOES_DATA : MEN_SHOES_DATA;
  const titles: Record<string, { title: string; desc: string }> = {
    men: { title: "Men's Shoes", desc: "All shoe types - Formal, Sports, Casual" },
    women: { title: "Women's Shoes", desc: "Heels, Flats, Sneakers & more" },
    kids: { title: "Kids' Shoes", desc: "Baby, Toddler & Kids shoes" },
  };

  const results = useMemo(() => {
    if (!sizeInput.trim()) return [];

    const alpha = parseAlphaSize(sizeInput);
    if (alpha) {
      const alphaShoeMap: Record<string, number> = { "S": 24.5, "M": 25.5, "L": 26.5, "XL": 27.5, "XXL": 28.5 };
      const footLen = alphaShoeMap[alpha];
      if (footLen) {
        const row = data.find(r => footLen >= r.footLenMin && footLen <= r.footLenMax);
        if (row) {
          const res = [
            { label: "Foot Length", value: `${footLen} cm / ${cmToInch(footLen).toFixed(1)} in` },
            { label: "India", value: row.india },
            { label: "US", value: row.us },
            { label: "UK", value: row.uk },
            { label: "EU", value: row.eu },
            { label: "Japan", value: row.japan },
            { label: "China", value: row.china },
          ];
          if ("canada" in row) res.push({ label: "Canada", value: (row as any).canada });
          if ("gulf" in row) res.push({ label: "Gulf", value: (row as any).gulf });
          if ("age" in row) res.push({ label: "Approx Age", value: `${(row as any).age} years` });
          return res;
        }
      }
    }

    const parsed = parseShoeInput(sizeInput);
    if (parsed) {
      const { footLenCm } = parsed;
      const row = data.find(r => footLenCm >= r.footLenMin && footLenCm <= r.footLenMax);
      if (!row) {
        const closest = data.reduce((prev, curr) => {
          const prevDist = Math.min(Math.abs(footLenCm - prev.footLenMin), Math.abs(footLenCm - prev.footLenMax));
          const currDist = Math.min(Math.abs(footLenCm - curr.footLenMin), Math.abs(footLenCm - curr.footLenMax));
          return currDist < prevDist ? curr : prev;
        });
        const res = [
          { label: "Closest Match", value: `~${footLenCm.toFixed(1)} cm foot` },
          { label: "India", value: closest.india },
          { label: "US", value: closest.us },
          { label: "UK", value: closest.uk },
          { label: "EU", value: closest.eu },
          { label: "Japan", value: closest.japan },
          { label: "China", value: closest.china },
        ];
        if ("canada" in closest) res.push({ label: "Canada", value: (closest as any).canada });
        if ("age" in closest) res.push({ label: "Approx Age", value: `${(closest as any).age} years` });
        return res;
      }
      const res = [
        { label: "Foot Length", value: `${footLenCm.toFixed(1)} cm / ${cmToInch(footLenCm).toFixed(1)} in` },
        { label: "India", value: row.india },
        { label: "US", value: row.us },
        { label: "UK", value: row.uk },
        { label: "EU", value: row.eu },
        { label: "Japan", value: row.japan },
        { label: "China", value: row.china },
      ];
      if ("canada" in row) res.push({ label: "Canada", value: (row as any).canada });
      if ("gulf" in row) res.push({ label: "Gulf", value: (row as any).gulf });
      if ("age" in row) res.push({ label: "Approx Age", value: `${(row as any).age} years` });
      return res;
    }

    return [{ label: "Status", value: "Try: UK 8, US 9, EU 42, 26.5 cm, 10.4 inch" }];
  }, [sizeInput, data]);

  const iconMap = { men: Footprints, women: Footprints, kids: Baby };
  const colorMap = { men: "bg-blue-500", women: "bg-pink-500", kids: "bg-amber-500" };

  return (
    <ToolCard title={titles[gender].title} description={titles[gender].desc} icon={iconMap[gender]} iconColor={colorMap[gender]}>
      <div className="space-y-4">
        <SizeInput value={sizeInput} onChange={setSizeInput} placeholder="e.g. UK 8, US 9, EU 42, India 7, 26.5 cm, 10.4 inch" />
        <div className="bg-muted/30 rounded-xl p-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Stand on paper, mark heel & longest toe, measure the distance in cm or inches.
          </p>
        </div>
        <ResultsGrid results={results} />
      </div>
    </ToolCard>
  );
}

function SlippersConverter() {
  const [userType, setUserType] = useState<"adult" | "kids">("adult");
  const [sizeInput, setSizeInput] = useState("");

  const results = useMemo(() => {
    if (!sizeInput.trim()) return [];

    if (userType === "kids") {
      const parsed = parseShoeInput(sizeInput);
      if (parsed) {
        const { footLenCm } = parsed;
        const row = KIDS_SHOES_DATA.find(r => footLenCm >= r.footLenMin && footLenCm <= r.footLenMax);
        if (row) {
          return [
            { label: "Foot Length", value: `${footLenCm.toFixed(1)} cm / ${cmToInch(footLenCm).toFixed(1)} in` },
            { label: "India", value: row.india },
            { label: "US", value: row.us },
            { label: "UK", value: row.uk },
            { label: "EU", value: row.eu },
            { label: "Japan", value: row.japan },
            { label: "China", value: row.china },
            { label: "Approx Age", value: `${row.age} years` },
          ];
        }
        const closest = KIDS_SHOES_DATA.reduce((prev, curr) => {
          const pd = Math.min(Math.abs(footLenCm - prev.footLenMin), Math.abs(footLenCm - prev.footLenMax));
          const cd = Math.min(Math.abs(footLenCm - curr.footLenMin), Math.abs(footLenCm - curr.footLenMax));
          return cd < pd ? curr : prev;
        });
        return [
          { label: "Closest Match", value: `~${footLenCm.toFixed(1)} cm` },
          { label: "India", value: closest.india },
          { label: "US", value: closest.us },
          { label: "UK", value: closest.uk },
          { label: "EU", value: closest.eu },
          { label: "Age", value: `${closest.age} years` },
        ];
      }
    } else {
      const parsed = parseShoeInput(sizeInput);
      if (parsed) {
        const { footLenCm } = parsed;
        const row = SLIPPERS_ADULT_DATA.find(r => footLenCm >= r.footLenMin && footLenCm <= r.footLenMax);
        if (row) {
          return [
            { label: "Foot Length", value: `${footLenCm.toFixed(1)} cm / ${cmToInch(footLenCm).toFixed(1)} in` },
            { label: "India", value: row.india },
            { label: "US (Men)", value: row.usMen },
            { label: "US (Women)", value: row.usWomen },
            { label: "UK", value: row.uk },
            { label: "EU", value: row.eu },
            { label: "Japan", value: row.japan },
            { label: "China", value: row.china },
          ];
        }
        const closest = SLIPPERS_ADULT_DATA.reduce((prev, curr) => {
          const pd = Math.min(Math.abs(footLenCm - prev.footLenMin), Math.abs(footLenCm - prev.footLenMax));
          const cd = Math.min(Math.abs(footLenCm - curr.footLenMin), Math.abs(footLenCm - curr.footLenMax));
          return cd < pd ? curr : prev;
        });
        return [
          { label: "Closest Match", value: `~${footLenCm.toFixed(1)} cm` },
          { label: "India", value: closest.india },
          { label: "US (Men)", value: closest.usMen },
          { label: "US (Women)", value: closest.usWomen },
          { label: "UK", value: closest.uk },
          { label: "EU", value: closest.eu },
        ];
      }
    }

    return [{ label: "Status", value: "Try: UK 8, US 9, 26.5 cm, India 7" }];
  }, [sizeInput, userType]);

  return (
    <ToolCard title="Slippers / Sandals" description="Universal slipper size guide" icon={Footprints} iconColor="bg-teal-500">
      <div className="space-y-4">
        <SelectField label="User Type" value={userType} onChange={(v) => { setUserType(v as any); setSizeInput(""); }} options={[
          { value: "adult", label: "Adult (Men & Women)" },
          { value: "kids", label: "Kids (0-12 years)" },
        ]} testId="select-slipper-user-type" />
        <SizeInput value={sizeInput} onChange={setSizeInput} placeholder="e.g. UK 8, India 7, 26.5 cm, 10.4 inch" />
        <div className="bg-muted/30 rounded-xl p-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Stand on paper, mark heel & toe, measure in cm, then enter above.
          </p>
        </div>
        <ResultsGrid results={results} />
      </div>
    </ToolCard>
  );
}

export default function ClothingSizeTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("men-clothing");

  const tools = [
    { id: "men-clothing", label: "Men", icon: Shirt },
    { id: "women-clothing", label: "Women", icon: Scissors },
    { id: "kids-clothing", label: "Kids", icon: Baby },
    { id: "men-shoes", label: "Men Shoes", icon: Footprints },
    { id: "women-shoes", label: "Women Shoes", icon: Footprints },
    { id: "kids-shoes", label: "Kids Shoes", icon: Baby },
    { id: "slippers", label: "Slippers", icon: Footprints },
  ];

  return (
    <PageWrapper
      title="Size Converter"
      subtitle="Clothing & shoes - India & Global"
      accentColor="bg-violet-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "men-clothing" && <MenClothingConverter />}
      {activeTool === "women-clothing" && <WomenClothingConverter />}
      {activeTool === "kids-clothing" && <KidsClothingConverter />}
      {activeTool === "men-shoes" && <ShoeConverter gender="men" />}
      {activeTool === "women-shoes" && <ShoeConverter gender="women" />}
      {activeTool === "kids-shoes" && <ShoeConverter gender="kids" />}
      {activeTool === "slippers" && <SlippersConverter />}
    </PageWrapper>
  );
}
