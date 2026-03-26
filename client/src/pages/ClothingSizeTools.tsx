import { useState, useMemo } from "react";
import { Shirt, Footprints, Baby, Scissors } from "lucide-react";
import { DesktopToolGrid, InputPanel, ResultDisplay } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "men-clothing" | "women-clothing" | "kids-clothing" | "men-shoes" | "women-shoes" | "kids-shoes" | "slippers";
type MeasurementUnit = "cm" | "inch" | "mm" | "ft";

const MEN_SHIRT_DATA = [
  { alpha: "XS", numeric: 36, chestMin: 86, chestMax: 91, india: "XS", us: "XS", uk: "36", eu: "46", japan: "S", china: "165/84A", canada: "XS", aus: "XS", gulf: "XS" },
  { alpha: "S", numeric: 38, chestMin: 91, chestMax: 96, india: "S", us: "S", uk: "38", eu: "48", japan: "M", china: "170/88A", canada: "S", aus: "S", gulf: "S" },
  { alpha: "M", numeric: 40, chestMin: 96, chestMax: 101, india: "M", us: "M", uk: "40", eu: "50", japan: "L", china: "170/92A", canada: "M", aus: "M", gulf: "M" },
  { alpha: "L", numeric: 42, chestMin: 101, chestMax: 106, india: "L", us: "L", uk: "42", eu: "52", japan: "LL", china: "175/96A", canada: "L", aus: "L", gulf: "L" },
  { alpha: "XL", numeric: 44, chestMin: 106, chestMax: 111, india: "XL", us: "XL", uk: "44", eu: "54", japan: "3L", china: "180/100A", canada: "XL", aus: "XL", gulf: "XL" },
  { alpha: "XXL", numeric: 46, chestMin: 111, chestMax: 117, india: "XXL", us: "XXL", uk: "46", eu: "56", japan: "4L", china: "185/104A", canada: "XXL", aus: "XXL", gulf: "XXL" },
  { alpha: "XXXL", numeric: 48, chestMin: 117, chestMax: 122, india: "XXXL", us: "3XL", uk: "48", eu: "58", japan: "5L", china: "190/108A", canada: "3XL", aus: "3XL", gulf: "3XL" },
  { alpha: "4XL", numeric: 50, chestMin: 122, chestMax: 127, india: "4XL", us: "4XL", uk: "50", eu: "60", japan: "6L", china: "195/112A", canada: "4XL", aus: "4XL", gulf: "4XL" },
];

const MEN_PANTS_DATA = [
  { alpha: "XS", numeric: 28, waistMin: 66, waistMax: 71, india: "28", us: "28", uk: "28", eu: "42", japan: "S", china: "S" },
  { alpha: "S", numeric: 30, waistMin: 71, waistMax: 76, india: "30", us: "30", uk: "30", eu: "44", japan: "M", china: "M" },
  { alpha: "M", numeric: 32, waistMin: 81, waistMax: 86, india: "32", us: "32", uk: "32", eu: "48", japan: "L", china: "L" },
  { alpha: "L", numeric: 34, waistMin: 86, waistMax: 91, india: "34", us: "34", uk: "34", eu: "50", japan: "LL", china: "L" },
  { alpha: "L", numeric: 36, waistMin: 91, waistMax: 96, india: "36", us: "36", uk: "36", eu: "52", japan: "LL", china: "XL" },
  { alpha: "XL", numeric: 38, waistMin: 96, waistMax: 101, india: "38", us: "38", uk: "38", eu: "54", japan: "3L", china: "XL" },
  { alpha: "XL", numeric: 40, waistMin: 101, waistMax: 106, india: "40", us: "40", uk: "40", eu: "56", japan: "3L", china: "XXL" },
  { alpha: "XXL", numeric: 42, waistMin: 106, waistMax: 111, india: "42", us: "42", uk: "42", eu: "58", japan: "4L", china: "XXL" },
  { alpha: "XXL", numeric: 44, waistMin: 111, waistMax: 116, india: "44", us: "44", uk: "44", eu: "60", japan: "4L", china: "3XL" },
];

const MEN_INNERWEAR_DATA = [
  { alpha: "S", numeric: 75, waistMin: 71, waistMax: 76, india: "S / 75-80", us: "S / 28-30", uk: "S", eu: "4 / S" },
  { alpha: "M", numeric: 80, waistMin: 76, waistMax: 81, india: "M / 80-85", us: "M / 30-32", uk: "M", eu: "5 / M" },
  { alpha: "L", numeric: 85, waistMin: 81, waistMax: 91, india: "L / 85-90", us: "L / 32-34", uk: "L", eu: "6 / L" },
  { alpha: "XL", numeric: 90, waistMin: 91, waistMax: 101, india: "XL / 90-95", us: "XL / 36-38", uk: "XL", eu: "7 / XL" },
  { alpha: "XXL", numeric: 95, waistMin: 101, waistMax: 111, india: "XXL / 95-100", us: "XXL / 40-42", uk: "XXL", eu: "8 / XXL" },
  { alpha: "XXXL", numeric: 100, waistMin: 111, waistMax: 121, india: "XXXL / 100-110", us: "3XL / 44-46", uk: "3XL", eu: "9 / 3XL" },
];

const MEN_VEST_DATA = [
  { alpha: "S", chestMin: 86, chestMax: 91, india: "S / 85-90", us: "S / 34-36", uk: "S", eu: "S" },
  { alpha: "M", chestMin: 91, chestMax: 96, india: "M / 90-95", us: "M / 36-38", uk: "M", eu: "M" },
  { alpha: "L", chestMin: 96, chestMax: 101, india: "L / 95-100", us: "L / 38-40", uk: "L", eu: "L" },
  { alpha: "XL", chestMin: 101, chestMax: 106, india: "XL / 100-105", us: "XL / 40-42", uk: "XL", eu: "XL" },
  { alpha: "XXL", chestMin: 106, chestMax: 117, india: "XXL / 105-115", us: "XXL / 42-44", uk: "XXL", eu: "XXL" },
  { alpha: "XXXL", chestMin: 117, chestMax: 127, india: "XXXL / 115-125", us: "3XL / 46-48", uk: "3XL", eu: "3XL" },
];

const WOMEN_TOP_DATA = [
  { alpha: "XS", numeric: 6, bustMin: 78, bustMax: 82, india: "XS", us: "0-2", uk: "6", eu: "34", japan: "S", china: "155/80A", canada: "XS", aus: "4" },
  { alpha: "S", numeric: 8, bustMin: 83, bustMax: 87, india: "S", us: "4-6", uk: "8", eu: "36", japan: "M", china: "160/84A", canada: "S", aus: "6-8" },
  { alpha: "M", numeric: 10, bustMin: 88, bustMax: 92, india: "M", us: "8-10", uk: "10", eu: "38", japan: "L", china: "165/88A", canada: "M", aus: "10-12" },
  { alpha: "L", numeric: 12, bustMin: 93, bustMax: 97, india: "L", us: "12-14", uk: "12", eu: "40", japan: "LL", china: "170/92A", canada: "L", aus: "14" },
  { alpha: "XL", numeric: 14, bustMin: 98, bustMax: 102, india: "XL", us: "16", uk: "14", eu: "42", japan: "3L", china: "175/96A", canada: "XL", aus: "16" },
  { alpha: "XXL", numeric: 16, bustMin: 103, bustMax: 108, india: "XXL", us: "18", uk: "16", eu: "44", japan: "4L", china: "180/100A", canada: "XXL", aus: "18" },
  { alpha: "XXXL", numeric: 18, bustMin: 109, bustMax: 114, india: "XXXL", us: "20", uk: "18", eu: "46", japan: "5L", china: "185/104A", canada: "3XL", aus: "20" },
];

const WOMEN_BRA_DATA = [
  { band: 28, bandCm: 63, bustA: 76, bustB: 78, bustC: 80, bustD: 83, india: "28", us: "28", uk: "28", eu: "60" },
  { band: 30, bandCm: 68, bustA: 79, bustB: 81, bustC: 83, bustD: 86, india: "30", us: "30", uk: "30", eu: "65" },
  { band: 32, bandCm: 73, bustA: 84, bustB: 86, bustC: 88, bustD: 91, india: "32", us: "32", uk: "32", eu: "70" },
  { band: 34, bandCm: 78, bustA: 89, bustB: 91, bustC: 93, bustD: 96, india: "34", us: "34", uk: "34", eu: "75" },
  { band: 36, bandCm: 83, bustA: 94, bustB: 96, bustC: 98, bustD: 101, india: "36", us: "36", uk: "36", eu: "80" },
  { band: 38, bandCm: 88, bustA: 99, bustB: 101, bustC: 103, bustD: 106, india: "38", us: "38", uk: "38", eu: "85" },
  { band: 40, bandCm: 93, bustA: 104, bustB: 106, bustC: 108, bustD: 111, india: "40", us: "40", uk: "40", eu: "90" },
];

const WOMEN_PANTY_DATA = [
  { alpha: "XS", hipMin: 81, hipMax: 86, india: "XS", us: "XS / 4", uk: "6", eu: "34" },
  { alpha: "S", hipMin: 86, hipMax: 91, india: "S", us: "S / 6", uk: "8", eu: "36" },
  { alpha: "M", hipMin: 91, hipMax: 97, india: "M", us: "M / 8", uk: "10", eu: "38" },
  { alpha: "L", hipMin: 97, hipMax: 102, india: "L", us: "L / 10", uk: "12", eu: "40" },
  { alpha: "XL", hipMin: 102, hipMax: 107, india: "XL", us: "XL / 12", uk: "14", eu: "42" },
  { alpha: "XXL", hipMin: 107, hipMax: 112, india: "XXL", us: "XXL / 14", uk: "16", eu: "44" },
  { alpha: "XXXL", hipMin: 112, hipMax: 120, india: "XXXL", us: "3XL / 16", uk: "18", eu: "46" },
];

const KIDS_CLOTHING_DATA = [
  { alpha: "2T", ageMin: 1, ageMax: 2, heightMin: 84, heightMax: 92, chestMin: 51, chestMax: 53, india: "2T", us: "2T", uk: "2-3", eu: "86-92", japan: "90", china: "90" },
  { alpha: "3T", ageMin: 2, ageMax: 3, heightMin: 92, heightMax: 98, chestMin: 53, chestMax: 55, india: "3T", us: "3T", uk: "3-4", eu: "92-98", japan: "95", china: "95" },
  { alpha: "4", ageMin: 3, ageMax: 4, heightMin: 98, heightMax: 104, chestMin: 55, chestMax: 57, india: "4", us: "4", uk: "4-5", eu: "98-104", japan: "100", china: "100" },
  { alpha: "5-6", ageMin: 4, ageMax: 6, heightMin: 104, heightMax: 116, chestMin: 57, chestMax: 61, india: "5-6", us: "5-6", uk: "5-6", eu: "104-116", japan: "110", china: "110" },
  { alpha: "7-8", ageMin: 6, ageMax: 8, heightMin: 116, heightMax: 128, chestMin: 61, chestMax: 66, india: "7-8", us: "7-8", uk: "7-8", eu: "116-128", japan: "120", china: "120" },
  { alpha: "9-10", ageMin: 8, ageMax: 10, heightMin: 128, heightMax: 140, chestMin: 66, chestMax: 72, india: "9-10", us: "9-10", uk: "9-10", eu: "128-140", japan: "130", china: "130" },
  { alpha: "11-12", ageMin: 10, ageMax: 12, heightMin: 140, heightMax: 152, chestMin: 72, chestMax: 78, india: "11-12", us: "11-12", uk: "11-12", eu: "140-152", japan: "140", china: "140" },
  { alpha: "13-14", ageMin: 12, ageMax: 14, heightMin: 152, heightMax: 164, chestMin: 78, chestMax: 84, india: "13-14", us: "13-14", uk: "13-14", eu: "152-164", japan: "150", china: "150" },
];

const MEN_SHOES_DATA = [
  { footLenMin: 22.0, footLenMax: 22.5, india: "4", us: "5", uk: "4", eu: "37", japan: "22.5", china: "37", canada: "5", gulf: "37" },
  { footLenMin: 22.5, footLenMax: 23.0, india: "5", us: "5.5", uk: "4.5", eu: "37.5", japan: "23", china: "38", canada: "5.5", gulf: "37.5" },
  { footLenMin: 23.0, footLenMax: 23.5, india: "5.5", us: "6", uk: "5", eu: "38", japan: "23.5", china: "38", canada: "6", gulf: "38" },
  { footLenMin: 23.5, footLenMax: 24.0, india: "6", us: "7", uk: "6", eu: "39", japan: "24", china: "39", canada: "7", gulf: "39" },
  { footLenMin: 24.0, footLenMax: 24.5, india: "6.5", us: "7.5", uk: "6.5", eu: "40", japan: "24.5", china: "40", canada: "7.5", gulf: "40" },
  { footLenMin: 24.5, footLenMax: 25.0, india: "7", us: "8", uk: "7", eu: "41", japan: "25", china: "41", canada: "8", gulf: "41" },
  { footLenMin: 25.0, footLenMax: 25.5, india: "7.5", us: "8.5", uk: "7.5", eu: "41", japan: "25.5", china: "41", canada: "8.5", gulf: "41" },
  { footLenMin: 25.5, footLenMax: 26.0, india: "8", us: "9", uk: "8", eu: "42", japan: "26", china: "42", canada: "9", gulf: "42" },
  { footLenMin: 26.0, footLenMax: 26.5, india: "8.5", us: "9.5", uk: "8.5", eu: "42.5", japan: "26.5", china: "42", canada: "9.5", gulf: "42.5" },
  { footLenMin: 26.5, footLenMax: 27.0, india: "9", us: "10", uk: "9", eu: "43", japan: "27", china: "43", canada: "10", gulf: "43" },
  { footLenMin: 27.0, footLenMax: 27.5, india: "9.5", us: "10.5", uk: "9.5", eu: "43.5", japan: "27.5", china: "44", canada: "10.5", gulf: "43.5" },
  { footLenMin: 27.5, footLenMax: 28.0, india: "10", us: "11", uk: "10", eu: "44", japan: "28", china: "44", canada: "11", gulf: "44" },
  { footLenMin: 28.0, footLenMax: 28.5, india: "10.5", us: "11.5", uk: "10.5", eu: "45", japan: "28.5", china: "45", canada: "11.5", gulf: "45" },
  { footLenMin: 28.5, footLenMax: 29.0, india: "11", us: "12", uk: "11", eu: "46", japan: "29", china: "46", canada: "12", gulf: "46" },
  { footLenMin: 29.0, footLenMax: 29.5, india: "11.5", us: "12.5", uk: "11.5", eu: "46.5", japan: "29.5", china: "46", canada: "12.5", gulf: "46.5" },
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
  { footLenMin: 26.5, footLenMax: 27.0, india: "8.5", us: "10.5", uk: "8.5", eu: "42.5", japan: "27", china: "43", canada: "10.5", gulf: "42.5" },
];

const KIDS_SHOES_DATA = [
  { footLenMin: 10.0, footLenMax: 10.5, india: "1C", us: "2C", uk: "1", eu: "16", japan: "10.5", china: "16", ageRange: "0-6 mo" },
  { footLenMin: 11.0, footLenMax: 11.5, india: "2C", us: "3C", uk: "2", eu: "18", japan: "11.5", china: "18", ageRange: "6-12 mo" },
  { footLenMin: 12.0, footLenMax: 12.5, india: "3", us: "4", uk: "3", eu: "19", japan: "12.5", china: "20", ageRange: "12-18 mo" },
  { footLenMin: 13.0, footLenMax: 13.5, india: "4", us: "5", uk: "4", eu: "21", japan: "13.5", china: "22", ageRange: "2 yr" },
  { footLenMin: 14.0, footLenMax: 14.5, india: "5", us: "6", uk: "5", eu: "23", japan: "14.5", china: "24", ageRange: "3 yr" },
  { footLenMin: 15.0, footLenMax: 15.5, india: "6", us: "7", uk: "6", eu: "25", japan: "15.5", china: "26", ageRange: "4 yr" },
  { footLenMin: 16.0, footLenMax: 16.5, india: "7", us: "8", uk: "7", eu: "27", japan: "16.5", china: "28", ageRange: "5 yr" },
  { footLenMin: 17.0, footLenMax: 17.5, india: "8", us: "9", uk: "8", eu: "29", japan: "17.5", china: "30", ageRange: "6 yr" },
  { footLenMin: 18.0, footLenMax: 18.5, india: "9", us: "10", uk: "9", eu: "31", japan: "18.5", china: "32", ageRange: "7 yr" },
  { footLenMin: 19.0, footLenMax: 19.5, india: "10", us: "11", uk: "10", eu: "33", japan: "19.5", china: "34", ageRange: "8 yr" },
  { footLenMin: 20.0, footLenMax: 20.5, india: "11", us: "12", uk: "11", eu: "35", japan: "20.5", china: "36", ageRange: "9 yr" },
  { footLenMin: 21.0, footLenMax: 21.5, india: "12", us: "13", uk: "12", eu: "36", japan: "21.5", china: "37", ageRange: "10 yr" },
  { footLenMin: 22.0, footLenMax: 22.5, india: "13", us: "1Y", uk: "13", eu: "37", japan: "22.5", china: "38", ageRange: "11 yr" },
  { footLenMin: 23.0, footLenMax: 23.5, india: "1Y", us: "2Y", uk: "1Y", eu: "38", japan: "23", china: "39", ageRange: "12 yr" },
];

const SLIPPERS_DATA = [
  { footLenMin: 22.0, footLenMax: 22.5, india: "4", usMen: "5", usWomen: "6", uk: "4", eu: "37", japan: "22.5", china: "37" },
  { footLenMin: 23.0, footLenMax: 23.5, india: "5", usMen: "6", usWomen: "7", uk: "5", eu: "38", japan: "23.5", china: "38" },
  { footLenMin: 24.0, footLenMax: 24.5, india: "6", usMen: "7", usWomen: "8", uk: "6", eu: "39", japan: "24.5", china: "39" },
  { footLenMin: 25.0, footLenMax: 25.5, india: "7", usMen: "8", usWomen: "9", uk: "7", eu: "40", japan: "25.5", china: "41" },
  { footLenMin: 25.5, footLenMax: 26.0, india: "8", usMen: "9", usWomen: "10", uk: "8", eu: "42", japan: "26", china: "42" },
  { footLenMin: 26.5, footLenMax: 27.0, india: "9", usMen: "10", usWomen: "11", uk: "9", eu: "43", japan: "27", china: "43" },
  { footLenMin: 27.5, footLenMax: 28.0, india: "10", usMen: "11", usWomen: "12", uk: "10", eu: "44", japan: "28", china: "45" },
  { footLenMin: 28.5, footLenMax: 29.0, india: "11", usMen: "12", usWomen: "13", uk: "11", eu: "45", japan: "29", china: "46" },
  { footLenMin: 29.5, footLenMax: 30.0, india: "12", usMen: "13", usWomen: "14", uk: "12", eu: "46", japan: "30", china: "47" },
];

function convertToCm(value: number, unit: MeasurementUnit): number {
  switch (unit) {
    case "inch": return value * 2.54;
    case "mm": return value / 10;
    case "ft": return value * 30.48;
    default: return value;
  }
}

function cmToDisplay(cm: number): string { return `${cm.toFixed(1)} cm / ${(cm / 2.54).toFixed(1)} in`; }

function SelectField({ label, value, onChange, options, testId }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; testId?: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
        data-testid={testId || `select-${label.toLowerCase().replace(/\s+/g, "-")}`}>
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

function NumberInput({ label, value, onChange, placeholder, testId }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; testId?: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">{label}</label>
      <input type="number" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter value"}
        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        data-testid={testId || "input-number"} />
    </div>
  );
}

function ResultsPanel({ results }: { results: { label: string; value: string }[] }) {
  if (results.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-sm p-5 flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground text-sm text-center">Enter your size details to see conversions</p>
      </div>
    );
  }
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Size Conversions</p>
      <div className="space-y-2">
        {results.map((r, i) => (
          <ResultDisplay key={i} label={r.label} value={r.value} highlight={i === 0} />
        ))}
      </div>
    </div>
  );
}

function MenClothingConverter() {
  const [clothingType, setClothingType] = useState("shirt");
  const [inputMethod, setInputMethod] = useState("size");
  const [sizeSelect, setSizeSelect] = useState("");
  const [numericInput, setNumericInput] = useState("");
  const [measureValue, setMeasureValue] = useState("");
  const [measureUnit, setMeasureUnit] = useState<MeasurementUnit>("cm");

  const sizeOptions = useMemo(() => {
    if (clothingType === "pants") return MEN_PANTS_DATA.map(r => ({ value: r.alpha + "-" + r.numeric, label: `${r.alpha} (Waist ${r.numeric})` }));
    if (clothingType === "innerwear") return MEN_INNERWEAR_DATA.map(r => ({ value: r.alpha, label: `${r.alpha} (Waist ${r.waistMin}-${r.waistMax} cm)` }));
    if (clothingType === "vest") return MEN_VEST_DATA.map(r => ({ value: r.alpha, label: `${r.alpha} (Chest ${r.chestMin}-${r.chestMax} cm)` }));
    return MEN_SHIRT_DATA.map(r => ({ value: r.alpha, label: `${r.alpha} (Chest ${r.chestMin}-${r.chestMax} cm)` }));
  }, [clothingType]);

  const results = useMemo(() => {
    if (inputMethod === "size" && !sizeSelect) return [];
    if (inputMethod === "number" && !numericInput) return [];
    if (inputMethod === "measurement" && !measureValue) return [];

    if (clothingType === "innerwear") {
      if (inputMethod === "size") { const row = MEN_INNERWEAR_DATA.find(r => r.alpha === sizeSelect); if (!row) return []; return [{ label: "Size", value: row.alpha }, { label: "Waist (cm)", value: `${row.waistMin}-${row.waistMax} cm` }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }]; }
      if (inputMethod === "number") { const num = parseFloat(numericInput); if (isNaN(num)) return []; const row = MEN_INNERWEAR_DATA.find(r => num >= r.waistMin && num <= r.waistMax); if (!row) return [{ label: "Status", value: "No match. Waist range: 71-121 cm" }]; return [{ label: "Recommended", value: row.alpha }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }]; }
      if (inputMethod === "measurement") { const val = parseFloat(measureValue); if (isNaN(val)) return []; const cm = convertToCm(val, measureUnit); const row = MEN_INNERWEAR_DATA.find(r => cm >= r.waistMin && cm <= r.waistMax); if (!row) return [{ label: "Status", value: `No match for ${cm.toFixed(1)} cm waist` }]; return [{ label: "Recommended", value: row.alpha }, { label: "Your Waist", value: cmToDisplay(cm) }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }]; }
    }
    if (clothingType === "vest") {
      if (inputMethod === "size") { const row = MEN_VEST_DATA.find(r => r.alpha === sizeSelect); if (!row) return []; return [{ label: "Size", value: row.alpha }, { label: "Chest (cm)", value: `${row.chestMin}-${row.chestMax} cm` }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }]; }
      if (inputMethod === "measurement") { const val = parseFloat(measureValue); if (isNaN(val)) return []; const cm = convertToCm(val, measureUnit); const row = MEN_VEST_DATA.find(r => cm >= r.chestMin && cm <= r.chestMax); if (!row) return [{ label: "Status", value: `No match for ${cm.toFixed(1)} cm chest` }]; return [{ label: "Recommended", value: row.alpha }, { label: "Your Chest", value: cmToDisplay(cm) }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }]; }
    }
    if (clothingType === "pants") {
      const data = MEN_PANTS_DATA;
      if (inputMethod === "size") { const parts = sizeSelect.split("-"); const numeric = parseInt(parts[1] || parts[0]); const row = data.find(r => r.numeric === numeric) || data.find(r => r.alpha === parts[0]); if (!row) return []; return [{ label: "Size", value: `${row.alpha} / ${row.numeric}` }, { label: "Waist (cm)", value: `${row.waistMin}-${row.waistMax} cm` }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }, { label: "Japan", value: row.japan }, { label: "China", value: row.china }]; }
      if (inputMethod === "number") { const num = parseInt(numericInput); if (isNaN(num)) return []; const row = data.find(r => r.numeric === num); if (!row) return [{ label: "Status", value: "Try: 28, 30, 32, 34, 36, 38, 40, 42, 44" }]; return [{ label: "Size", value: `${row.alpha} / ${row.numeric}` }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }]; }
      if (inputMethod === "measurement") { const val = parseFloat(measureValue); if (isNaN(val)) return []; const cm = convertToCm(val, measureUnit); const row = data.find(r => cm >= r.waistMin && cm <= r.waistMax); if (!row) return [{ label: "Status", value: `No match for ${cm.toFixed(1)} cm waist` }]; return [{ label: "Recommended", value: `${row.alpha} / ${row.numeric}` }, { label: "Your Waist", value: cmToDisplay(cm) }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }]; }
    }
    const data = MEN_SHIRT_DATA;
    if (inputMethod === "size") { const row = data.find(r => r.alpha === sizeSelect); if (!row) return []; return [{ label: "Size", value: `${row.alpha} / ${row.numeric}` }, { label: "Chest (cm)", value: `${row.chestMin}-${row.chestMax} cm` }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }, { label: "Japan", value: row.japan }, { label: "China", value: row.china }, { label: "Canada", value: row.canada }, { label: "Australia", value: row.aus }, { label: "Gulf", value: row.gulf }]; }
    if (inputMethod === "number") { const num = parseInt(numericInput); if (isNaN(num)) return []; const row = data.find(r => r.numeric === num); if (!row) return [{ label: "Status", value: "Try: 36, 38, 40, 42, 44, 46, 48, 50" }]; return [{ label: "Size", value: `${row.alpha} / ${row.numeric}` }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }, { label: "Japan", value: row.japan }, { label: "China", value: row.china }]; }
    if (inputMethod === "measurement") { const val = parseFloat(measureValue); if (isNaN(val)) return []; const cm = convertToCm(val, measureUnit); const row = data.find(r => cm >= r.chestMin && cm <= r.chestMax); if (!row) return [{ label: "Status", value: `No match for ${cm.toFixed(1)} cm chest` }]; return [{ label: "Recommended", value: `${row.alpha} / ${row.numeric}` }, { label: "Your Chest", value: cmToDisplay(cm) }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }, { label: "Japan", value: row.japan }, { label: "China", value: row.china }]; }
    return [];
  }, [clothingType, inputMethod, sizeSelect, numericInput, measureValue, measureUnit]);

  const resetInputs = () => { setSizeSelect(""); setNumericInput(""); setMeasureValue(""); };

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Men's Clothing" icon={Shirt} iconColor="bg-blue-500">
          <SelectField label="Clothing Type" value={clothingType} onChange={(v) => { setClothingType(v); resetInputs(); }} options={[
            { value: "shirt", label: "Shirt / T-Shirt / Jacket" },
            { value: "pants", label: "Pants / Jeans / Trousers" },
            { value: "kurta", label: "Kurta / Ethnic Wear" },
            { value: "innerwear", label: "Briefs / Boxers / Trunks" },
            { value: "vest", label: "Vest / Undershirt / Banian" },
          ]} testId="select-men-clothing-type" />
          <SelectField label="How do you want to enter size?" value={inputMethod} onChange={(v) => { setInputMethod(v); resetInputs(); }} options={[
            { value: "size", label: "Select Size (S, M, L, XL...)" },
            { value: "number", label: "Enter Size Number (36, 38, 40...)" },
            { value: "measurement", label: "Enter Body Measurement" },
          ]} testId="select-men-input-method" />
          {inputMethod === "size" && <SelectField label="Select Your Size" value={sizeSelect} onChange={setSizeSelect} options={[{ value: "", label: "-- Choose Size --" }, ...sizeOptions]} testId="select-men-size" />}
          {inputMethod === "number" && <NumberInput label={clothingType === "pants" ? "Waist Size Number" : "Shirt Number (UK/India)"} value={numericInput} onChange={setNumericInput} placeholder={clothingType === "pants" ? "e.g. 32, 34, 36" : "e.g. 38, 40, 42"} testId="input-men-number" />}
          {inputMethod === "measurement" && (
            <div className="space-y-3">
              <SelectField label="Measurement Unit" value={measureUnit} onChange={(v) => setMeasureUnit(v as MeasurementUnit)} options={[{ value: "cm", label: "Centimeters (cm)" }, { value: "inch", label: "Inches (inch)" }, { value: "mm", label: "Millimeters (mm)" }, { value: "ft", label: "Feet (ft)" }]} testId="select-men-unit" />
              <NumberInput label={clothingType === "pants" || clothingType === "innerwear" ? `Waist Size (${measureUnit})` : `Chest Size (${measureUnit})`} value={measureValue} onChange={setMeasureValue} placeholder={`Enter value in ${measureUnit}`} testId="input-men-measurement" />
            </div>
          )}
        </InputPanel>
      }
      results={<ResultsPanel results={results} />}
    />
  );
}

function WomenClothingConverter() {
  const [clothingType, setClothingType] = useState("top");
  const [inputMethod, setInputMethod] = useState("size");
  const [sizeSelect, setSizeSelect] = useState("");
  const [numericInput, setNumericInput] = useState("");
  const [measureValue, setMeasureValue] = useState("");
  const [measureUnit, setMeasureUnit] = useState<MeasurementUnit>("cm");
  const [braBand, setBraBand] = useState("");
  const [braCup, setBraCup] = useState("B");

  const sizeOptions = useMemo(() => {
    if (clothingType === "panty") return WOMEN_PANTY_DATA.map(r => ({ value: r.alpha, label: `${r.alpha} (Hip ${r.hipMin}-${r.hipMax} cm)` }));
    return WOMEN_TOP_DATA.map(r => ({ value: r.alpha, label: `${r.alpha} (Bust ${r.bustMin}-${r.bustMax} cm)` }));
  }, [clothingType]);

  const results = useMemo(() => {
    if (clothingType === "bra") {
      if (!braBand) return [];
      const row = WOMEN_BRA_DATA.find(r => r.band === parseInt(braBand));
      if (!row) return [];
      const cupKey = `bust${braCup}` as keyof typeof row;
      const bustVal = row[cupKey] as number;
      return [{ label: "Your Size", value: `${row.band}${braCup}` }, { label: "Band", value: `${row.bandCm} cm` }, { label: "Bust", value: `${bustVal} cm` }, { label: "India", value: `${row.india}${braCup}` }, { label: "US", value: `${row.us}${braCup}` }, { label: "UK", value: `${row.uk}${braCup}` }, { label: "EU", value: `${row.eu}${braCup}` }];
    }
    if (clothingType === "panty") {
      if (inputMethod === "size" && !sizeSelect) return [];
      if (inputMethod === "measurement" && !measureValue) return [];
      if (inputMethod === "size") { const row = WOMEN_PANTY_DATA.find(r => r.alpha === sizeSelect); if (!row) return []; return [{ label: "Size", value: row.alpha }, { label: "Hip (cm)", value: `${row.hipMin}-${row.hipMax} cm` }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }]; }
      if (inputMethod === "measurement") { const val = parseFloat(measureValue); if (isNaN(val)) return []; const cm = convertToCm(val, measureUnit); const row = WOMEN_PANTY_DATA.find(r => cm >= r.hipMin && cm <= r.hipMax); if (!row) return [{ label: "Status", value: `No match for ${cm.toFixed(1)} cm hip` }]; return [{ label: "Recommended", value: row.alpha }, { label: "Your Hip", value: cmToDisplay(cm) }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }]; }
      return [];
    }
    if (inputMethod === "size" && !sizeSelect) return [];
    if (inputMethod === "number" && !numericInput) return [];
    if (inputMethod === "measurement" && !measureValue) return [];
    const data = WOMEN_TOP_DATA;
    if (inputMethod === "size") { const row = data.find(r => r.alpha === sizeSelect); if (!row) return []; return [{ label: "Size", value: `${row.alpha} / UK ${row.numeric}` }, { label: "Bust (cm)", value: `${row.bustMin}-${row.bustMax} cm` }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }, { label: "Japan", value: row.japan }, { label: "China", value: row.china }, { label: "Canada", value: row.canada }, { label: "Australia", value: row.aus }]; }
    if (inputMethod === "number") { const num = parseInt(numericInput); if (isNaN(num)) return []; const row = data.find(r => r.numeric === num); if (!row) return [{ label: "Status", value: "Try: 6, 8, 10, 12, 14, 16, 18" }]; return [{ label: "Size", value: `${row.alpha} / UK ${row.numeric}` }, { label: "Bust (cm)", value: `${row.bustMin}-${row.bustMax} cm` }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }, { label: "Japan", value: row.japan }]; }
    if (inputMethod === "measurement") { const val = parseFloat(measureValue); if (isNaN(val)) return []; const cm = convertToCm(val, measureUnit); const row = data.find(r => cm >= r.bustMin && cm <= r.bustMax); if (!row) return [{ label: "Status", value: `No match for ${cm.toFixed(1)} cm bust` }]; return [{ label: "Recommended", value: `${row.alpha} / UK ${row.numeric}` }, { label: "Your Bust", value: cmToDisplay(cm) }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }, { label: "Japan", value: row.japan }, { label: "China", value: row.china }]; }
    return [];
  }, [clothingType, inputMethod, sizeSelect, numericInput, measureValue, measureUnit, braBand, braCup]);

  const resetInputs = () => { setSizeSelect(""); setNumericInput(""); setMeasureValue(""); setBraBand(""); };

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Women's Clothing" icon={Scissors} iconColor="bg-pink-500">
          <SelectField label="Clothing Type" value={clothingType} onChange={(v) => { setClothingType(v); resetInputs(); }} options={[
            { value: "top", label: "Top / Blouse / T-Shirt" },
            { value: "dress", label: "Dress / Gown / Kurti" },
            { value: "jacket", label: "Jacket / Coat" },
            { value: "bra", label: "Bra / Sports Bra" },
            { value: "panty", label: "Panty / Briefs / Hipster" },
          ]} testId="select-women-clothing-type" />
          {clothingType === "bra" ? (
            <>
              <SelectField label="Band Size (Underbust)" value={braBand} onChange={setBraBand} options={[{ value: "", label: "-- Select Band --" }, ...WOMEN_BRA_DATA.map(r => ({ value: String(r.band), label: `${r.band} (${r.bandCm} cm / ${(r.bandCm / 2.54).toFixed(0)} in)` }))]} testId="select-bra-band" />
              <SelectField label="Cup Size" value={braCup} onChange={setBraCup} options={[{ value: "A", label: "A Cup" }, { value: "B", label: "B Cup" }, { value: "C", label: "C Cup" }, { value: "D", label: "D Cup" }]} testId="select-bra-cup" />
            </>
          ) : (
            <>
              <SelectField label="How do you want to enter size?" value={inputMethod} onChange={(v) => { setInputMethod(v); resetInputs(); }} options={[{ value: "size", label: "Select Size (XS, S, M, L...)" }, { value: "number", label: "Enter Size Number (6, 8, 10...)" }, { value: "measurement", label: "Enter Body Measurement" }]} testId="select-women-input-method" />
              {inputMethod === "size" && <SelectField label="Select Your Size" value={sizeSelect} onChange={setSizeSelect} options={[{ value: "", label: "-- Choose Size --" }, ...sizeOptions]} testId="select-women-size" />}
              {inputMethod === "number" && <NumberInput label="UK / Number Size" value={numericInput} onChange={setNumericInput} placeholder="e.g. 8, 10, 12" testId="input-women-number" />}
              {inputMethod === "measurement" && (
                <div className="space-y-3">
                  <SelectField label="Measurement Unit" value={measureUnit} onChange={(v) => setMeasureUnit(v as MeasurementUnit)} options={[{ value: "cm", label: "Centimeters (cm)" }, { value: "inch", label: "Inches (inch)" }, { value: "mm", label: "Millimeters (mm)" }, { value: "ft", label: "Feet (ft)" }]} testId="select-women-unit" />
                  <NumberInput label={clothingType === "panty" ? `Hip Size (${measureUnit})` : `Bust Size (${measureUnit})`} value={measureValue} onChange={setMeasureValue} placeholder={`Enter value in ${measureUnit}`} testId="input-women-measurement" />
                </div>
              )}
            </>
          )}
        </InputPanel>
      }
      results={<ResultsPanel results={results} />}
    />
  );
}

function KidsClothingConverter() {
  const [inputMethod, setInputMethod] = useState("age");
  const [ageInput, setAgeInput] = useState("");
  const [sizeSelect, setSizeSelect] = useState("");
  const [measureValue, setMeasureValue] = useState("");
  const [measureUnit, setMeasureUnit] = useState<MeasurementUnit>("cm");

  const results = useMemo(() => {
    if (inputMethod === "age") { const age = parseFloat(ageInput); if (isNaN(age)) return []; const row = KIDS_CLOTHING_DATA.find(r => age >= r.ageMin && age <= r.ageMax); if (!row) return [{ label: "Status", value: "No match. Age range: 1-14 years" }]; return [{ label: "Recommended Size", value: row.alpha }, { label: "Age Range", value: `${row.ageMin}-${row.ageMax} years` }, { label: "Height", value: `${row.heightMin}-${row.heightMax} cm` }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }, { label: "Japan", value: row.japan }, { label: "China", value: row.china }]; }
    if (inputMethod === "size") { if (!sizeSelect) return []; const row = KIDS_CLOTHING_DATA.find(r => r.alpha === sizeSelect); if (!row) return []; return [{ label: "Size", value: row.alpha }, { label: "Age Range", value: `${row.ageMin}-${row.ageMax} years` }, { label: "Height", value: `${row.heightMin}-${row.heightMax} cm` }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }, { label: "Japan", value: row.japan }, { label: "China", value: row.china }]; }
    if (inputMethod === "height" || inputMethod === "chest") { const val = parseFloat(measureValue); if (isNaN(val)) return []; const cm = convertToCm(val, measureUnit); const row = inputMethod === "height" ? KIDS_CLOTHING_DATA.find(r => cm >= r.heightMin && cm <= r.heightMax) : KIDS_CLOTHING_DATA.find(r => cm >= r.chestMin && cm <= r.chestMax); if (!row) return [{ label: "Status", value: `No match for ${cm.toFixed(0)} cm` }]; return [{ label: "Recommended Size", value: row.alpha }, { label: "Age Range", value: `${row.ageMin}-${row.ageMax} years` }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }, { label: "Japan", value: row.japan }]; }
    return [];
  }, [inputMethod, ageInput, sizeSelect, measureValue, measureUnit]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Kids Clothing" icon={Baby} iconColor="bg-amber-500">
          <SelectField label="How do you want to find size?" value={inputMethod} onChange={(v) => { setInputMethod(v); setAgeInput(""); setSizeSelect(""); setMeasureValue(""); }} options={[{ value: "age", label: "Enter Age (years)" }, { value: "size", label: "Select Size" }, { value: "height", label: "Enter Height" }, { value: "chest", label: "Enter Chest Measurement" }]} testId="select-kids-input-method" />
          {inputMethod === "age" && <NumberInput label="Child's Age (years)" value={ageInput} onChange={setAgeInput} placeholder="e.g. 3, 5, 8, 10" testId="input-kids-age" />}
          {inputMethod === "size" && <SelectField label="Select Size" value={sizeSelect} onChange={setSizeSelect} options={[{ value: "", label: "-- Choose Size --" }, ...KIDS_CLOTHING_DATA.map(r => ({ value: r.alpha, label: `${r.alpha} (Age ${r.ageMin}-${r.ageMax}, Ht ${r.heightMin}-${r.heightMax} cm)` }))]} testId="select-kids-size" />}
          {(inputMethod === "height" || inputMethod === "chest") && (
            <div className="space-y-3">
              <SelectField label="Measurement Unit" value={measureUnit} onChange={(v) => setMeasureUnit(v as MeasurementUnit)} options={[{ value: "cm", label: "Centimeters (cm)" }, { value: "inch", label: "Inches (inch)" }, { value: "mm", label: "Millimeters (mm)" }, { value: "ft", label: "Feet (ft)" }]} testId="select-kids-unit" />
              <NumberInput label={inputMethod === "height" ? `Height (${measureUnit})` : `Chest (${measureUnit})`} value={measureValue} onChange={setMeasureValue} placeholder={`Enter value in ${measureUnit}`} testId="input-kids-measurement" />
            </div>
          )}
        </InputPanel>
      }
      results={<ResultsPanel results={results} />}
    />
  );
}

function ShoeConverter({ gender }: { gender: "men" | "women" | "kids" }) {
  const [inputMethod, setInputMethod] = useState("footlength");
  const [measureValue, setMeasureValue] = useState("");
  const [measureUnit, setMeasureUnit] = useState<MeasurementUnit>("cm");
  const [sizeSystem, setSizeSystem] = useState("india");
  const [sizeNumber, setSizeNumber] = useState("");
  const [kidsAge, setKidsAge] = useState("");

  const data = gender === "kids" ? KIDS_SHOES_DATA : gender === "women" ? WOMEN_SHOES_DATA : MEN_SHOES_DATA;
  const titles = { men: { title: "Men's Shoes", icon: Footprints, color: "bg-blue-500" }, women: { title: "Women's Shoes", icon: Footprints, color: "bg-pink-500" }, kids: { title: "Kids' Shoes", icon: Baby, color: "bg-amber-500" } };

  const results = useMemo(() => {
    if (inputMethod === "footlength") {
      const val = parseFloat(measureValue); if (isNaN(val)) return [];
      const cm = convertToCm(val, measureUnit);
      const row = data.find(r => cm >= r.footLenMin && cm <= r.footLenMax);
      if (!row) {
        const closest = data.reduce((prev, curr) => { const pd = Math.min(Math.abs(cm - prev.footLenMin), Math.abs(cm - prev.footLenMax)); const cd = Math.min(Math.abs(cm - curr.footLenMin), Math.abs(cm - curr.footLenMax)); return cd < pd ? curr : prev; });
        const res = [{ label: "Closest Match", value: `~${cm.toFixed(1)} cm` }, { label: "India", value: closest.india }, { label: "US", value: closest.us }, { label: "UK", value: closest.uk }, { label: "EU", value: closest.eu }];
        if ("ageRange" in closest) res.push({ label: "Age", value: (closest as any).ageRange });
        return res;
      }
      const res = [{ label: "Foot Length", value: cmToDisplay(cm) }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }, { label: "Japan", value: row.japan }, { label: "China", value: row.china }];
      if ("canada" in row) res.push({ label: "Canada", value: (row as any).canada });
      if ("gulf" in row) res.push({ label: "Gulf", value: (row as any).gulf });
      if ("ageRange" in row) res.push({ label: "Age", value: (row as any).ageRange });
      return res;
    }
    if (inputMethod === "sizenumber") {
      const num = parseFloat(sizeNumber); if (isNaN(num)) return [];
      const sysKey = sizeSystem as keyof (typeof data)[0];
      const row = data.find(r => { if (sysKey in r) { const rowVal = parseFloat(String(r[sysKey])); return !isNaN(rowVal) && Math.abs(rowVal - num) < 0.6; } return false; });
      if (!row) return [{ label: "Status", value: `No match for ${sizeSystem.toUpperCase()} ${num}` }];
      const res = [{ label: "Matched", value: `${sizeSystem.toUpperCase()} ${num}` }, { label: "Foot Length", value: `${row.footLenMin}-${row.footLenMax} cm` }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }, { label: "Japan", value: row.japan }, { label: "China", value: row.china }];
      if ("canada" in row) res.push({ label: "Canada", value: (row as any).canada });
      if ("gulf" in row) res.push({ label: "Gulf", value: (row as any).gulf });
      if ("ageRange" in row) res.push({ label: "Age", value: (row as any).ageRange });
      return res;
    }
    if (inputMethod === "age" && gender === "kids") {
      const age = parseFloat(kidsAge); if (isNaN(age)) return [];
      const row = KIDS_SHOES_DATA.find(r => { const ageStr = r.ageRange; if (ageStr.includes("mo")) return age < 1; const ageNum = parseInt(ageStr); return !isNaN(ageNum) && Math.abs(ageNum - age) <= 0.5; });
      if (!row) return [{ label: "Status", value: "No match. Age range: 0-12 years" }];
      return [{ label: "Age", value: row.ageRange }, { label: "Foot Length", value: `${row.footLenMin}-${row.footLenMax} cm` }, { label: "India", value: row.india }, { label: "US", value: row.us }, { label: "UK", value: row.uk }, { label: "EU", value: row.eu }, { label: "Japan", value: row.japan }, { label: "China", value: row.china }];
    }
    return [];
  }, [inputMethod, measureValue, measureUnit, sizeSystem, sizeNumber, kidsAge, data, gender]);

  const inputOptions = [{ value: "footlength", label: "Enter Foot Length (Measured)" }, { value: "sizenumber", label: "Enter Size Number (UK/US/EU...)" }];
  if (gender === "kids") inputOptions.push({ value: "age", label: "Enter Age (years)" });

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title={titles[gender].title} icon={titles[gender].icon} iconColor={titles[gender].color}>
          <SelectField label="How do you want to find size?" value={inputMethod} onChange={(v) => { setInputMethod(v); setMeasureValue(""); setSizeNumber(""); setKidsAge(""); }} options={inputOptions} testId={`select-${gender}-shoe-input`} />
          {inputMethod === "footlength" && (
            <div className="space-y-3">
              <SelectField label="Measurement Unit" value={measureUnit} onChange={(v) => setMeasureUnit(v as MeasurementUnit)} options={[{ value: "cm", label: "Centimeters (cm)" }, { value: "inch", label: "Inches (inch)" }, { value: "mm", label: "Millimeters (mm)" }, { value: "ft", label: "Feet (ft)" }]} testId={`select-${gender}-shoe-unit`} />
              <NumberInput label={`Foot Length (${measureUnit})`} value={measureValue} onChange={setMeasureValue} placeholder={measureUnit === "cm" ? "e.g. 25.5" : "e.g. 10.0"} testId={`input-${gender}-shoe-length`} />
              <div className="bg-muted/30 rounded-xl p-3"><p className="text-xs text-muted-foreground">Stand on paper, mark heel to longest toe, then measure.</p></div>
            </div>
          )}
          {inputMethod === "sizenumber" && (
            <div className="space-y-3">
              <SelectField label="Size System / Country" value={sizeSystem} onChange={setSizeSystem} options={[{ value: "india", label: "India" }, { value: "us", label: "US / USA" }, { value: "uk", label: "UK" }, { value: "eu", label: "EU / Europe" }, { value: "japan", label: "Japan" }, { value: "china", label: "China" }, ...(gender !== "kids" ? [{ value: "canada", label: "Canada" }, { value: "gulf", label: "Gulf / Middle East" }] : [])]} testId={`select-${gender}-shoe-system`} />
              <NumberInput label={`${sizeSystem.toUpperCase()} Size Number`} value={sizeNumber} onChange={setSizeNumber} placeholder="e.g. 8, 9, 42" testId={`input-${gender}-shoe-number`} />
            </div>
          )}
          {inputMethod === "age" && gender === "kids" && <NumberInput label="Child's Age (years)" value={kidsAge} onChange={setKidsAge} placeholder="e.g. 3, 5, 8" testId="input-kids-shoe-age" />}
        </InputPanel>
      }
      results={<ResultsPanel results={results} />}
    />
  );
}

function SlippersConverter() {
  const [userType, setUserType] = useState("adult");
  const [inputMethod, setInputMethod] = useState("footlength");
  const [measureValue, setMeasureValue] = useState("");
  const [measureUnit, setMeasureUnit] = useState<MeasurementUnit>("cm");
  const [sizeSystem, setSizeSystem] = useState("india");
  const [sizeNumber, setSizeNumber] = useState("");

  const results = useMemo(() => {
    const data = userType === "kids" ? KIDS_SHOES_DATA : SLIPPERS_DATA;
    if (inputMethod === "footlength") {
      const val = parseFloat(measureValue); if (isNaN(val)) return [];
      const cm = convertToCm(val, measureUnit);
      const row = data.find(r => cm >= r.footLenMin && cm <= r.footLenMax);
      if (!row) {
        const closest = data.reduce((prev, curr) => { const pd = Math.min(Math.abs(cm - prev.footLenMin), Math.abs(cm - prev.footLenMax)); const cd = Math.min(Math.abs(cm - curr.footLenMin), Math.abs(cm - curr.footLenMax)); return cd < pd ? curr : prev; });
        const res = [{ label: "Closest Match", value: `~${cm.toFixed(1)} cm` }, { label: "India", value: closest.india }];
        if ("usMen" in closest) { res.push({ label: "US (Men)", value: (closest as any).usMen }); res.push({ label: "US (Women)", value: (closest as any).usWomen }); } else { res.push({ label: "US", value: (closest as any).us }); }
        res.push({ label: "UK", value: closest.uk }); res.push({ label: "EU", value: closest.eu });
        if ("ageRange" in closest) res.push({ label: "Age", value: (closest as any).ageRange });
        return res;
      }
      const res = [{ label: "Foot Length", value: cmToDisplay(cm) }, { label: "India", value: row.india }];
      if ("usMen" in row) { res.push({ label: "US (Men)", value: (row as any).usMen }); res.push({ label: "US (Women)", value: (row as any).usWomen }); } else { res.push({ label: "US", value: (row as any).us }); }
      res.push({ label: "UK", value: row.uk }); res.push({ label: "EU", value: row.eu }); res.push({ label: "Japan", value: row.japan }); res.push({ label: "China", value: row.china });
      if ("ageRange" in row) res.push({ label: "Age", value: (row as any).ageRange });
      return res;
    }
    if (inputMethod === "sizenumber") {
      const num = parseFloat(sizeNumber); if (isNaN(num)) return [];
      const sysKey = sizeSystem as keyof (typeof data)[0];
      const row = data.find(r => { if (sysKey in r) { const rowVal = parseFloat(String(r[sysKey])); return !isNaN(rowVal) && Math.abs(rowVal - num) < 0.6; } return false; });
      if (!row) return [{ label: "Status", value: `No match for ${sizeSystem.toUpperCase()} ${num}` }];
      const res = [{ label: "Matched", value: `${sizeSystem.toUpperCase()} ${num}` }, { label: "India", value: row.india }];
      if ("usMen" in row) { res.push({ label: "US (Men)", value: (row as any).usMen }); res.push({ label: "US (Women)", value: (row as any).usWomen }); } else { res.push({ label: "US", value: (row as any).us }); }
      res.push({ label: "UK", value: row.uk }); res.push({ label: "EU", value: row.eu });
      if ("ageRange" in row) res.push({ label: "Age", value: (row as any).ageRange });
      return res;
    }
    return [];
  }, [userType, inputMethod, measureValue, measureUnit, sizeSystem, sizeNumber]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Slippers / Sandals" icon={Footprints} iconColor="bg-teal-500">
          <SelectField label="For Whom?" value={userType} onChange={(v) => { setUserType(v); setMeasureValue(""); setSizeNumber(""); }} options={[{ value: "adult", label: "Adult (Men & Women)" }, { value: "kids", label: "Kids (0-12 years)" }]} testId="select-slipper-user" />
          <SelectField label="How do you want to find size?" value={inputMethod} onChange={(v) => { setInputMethod(v); setMeasureValue(""); setSizeNumber(""); }} options={[{ value: "footlength", label: "Enter Foot Length (Measured)" }, { value: "sizenumber", label: "Enter Size Number (India/UK/US...)" }]} testId="select-slipper-input" />
          {inputMethod === "footlength" && (
            <div className="space-y-3">
              <SelectField label="Measurement Unit" value={measureUnit} onChange={(v) => setMeasureUnit(v as MeasurementUnit)} options={[{ value: "cm", label: "Centimeters (cm)" }, { value: "inch", label: "Inches (inch)" }, { value: "mm", label: "Millimeters (mm)" }, { value: "ft", label: "Feet (ft)" }]} testId="select-slipper-unit" />
              <NumberInput label={`Foot Length (${measureUnit})`} value={measureValue} onChange={setMeasureValue} placeholder={measureUnit === "cm" ? "e.g. 26.0" : "e.g. 10.2"} testId="input-slipper-length" />
            </div>
          )}
          {inputMethod === "sizenumber" && (
            <div className="space-y-3">
              <SelectField label="Size System / Country" value={sizeSystem} onChange={setSizeSystem} options={[{ value: "india", label: "India" }, ...(userType === "adult" ? [{ value: "usMen", label: "US (Men)" }, { value: "usWomen", label: "US (Women)" }] : [{ value: "us", label: "US" }]), { value: "uk", label: "UK" }, { value: "eu", label: "EU / Europe" }, { value: "japan", label: "Japan" }, { value: "china", label: "China" }]} testId="select-slipper-system" />
              <NumberInput label={`${sizeSystem.toUpperCase()} Size Number`} value={sizeNumber} onChange={setSizeNumber} placeholder="e.g. 7, 8, 42" testId="input-slipper-number" />
            </div>
          )}
        </InputPanel>
      }
      results={<ResultsPanel results={results} />}
    />
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
      subtitle="Clothing & Shoes - India & Global"
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
