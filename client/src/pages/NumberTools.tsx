import { useState } from "react";
import { motion } from "framer-motion";
import { Hash, ArrowRightLeft, DollarSign, IndianRupee, Calculator, Columns3 } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "billion-million" | "crore-lakh" | "us-indian" | "number-words" | "roman";

export default function NumberTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("billion-million");

  const tools = [
    { id: "billion-million", label: "Billion/Million", icon: DollarSign },
    { id: "crore-lakh", label: "Crore/Lakh", icon: IndianRupee },
    { id: "us-indian", label: "US ↔ Indian", icon: ArrowRightLeft },
    { id: "number-words", label: "To Words", icon: Hash },
    { id: "roman", label: "Roman", icon: Columns3 },
  ];

  return (
    <PageWrapper
      title="Number Converter"
      subtitle="Convert between number systems"
      accentColor="bg-teal-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "billion-million" && <BillionMillionConverter />}
      {activeTool === "crore-lakh" && <CroreLakhConverter />}
      {activeTool === "us-indian" && <USIndianConverter />}
      {activeTool === "number-words" && <NumberToWords />}
      {activeTool === "roman" && <RomanNumeralConverter />}
    </PageWrapper>
  );
}

function BillionMillionConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("billion");

  const units = [
    { id: "trillion", label: "Trillion", factor: 1e12 },
    { id: "billion", label: "Billion", factor: 1e9 },
    { id: "million", label: "Million", factor: 1e6 },
    { id: "thousand", label: "Thousand", factor: 1e3 },
    { id: "hundred", label: "Hundred", factor: 100 },
  ];

  const baseValue = (parseFloat(value) || 0) * (units.find(u => u.id === fromUnit)?.factor || 1);

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(4);
    if (num >= 1e9) return (num / 1e9).toFixed(4);
    if (num >= 1e6) return (num / 1e6).toFixed(4);
    if (num >= 1e3) return (num / 1e3).toFixed(4);
    return num.toFixed(2);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Billion/Million Converter" icon={DollarSign} iconColor="bg-teal-500">
        <div className="space-y-4">
          <InputField label="Value" value={value} onChange={setValue} type="number" />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">From</label>
            <div className="flex flex-wrap gap-2">
              {units.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => setFromUnit(unit.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    fromUnit === unit.id
                      ? "bg-teal-500 text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`button-from-${unit.id}`}
                >
                  {unit.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Conversions" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          {units.map((unit) => (
            <ResultDisplay
              key={unit.id}
              label={unit.label}
              value={formatNumber(baseValue / unit.factor)}
              highlight={unit.id === fromUnit}
              color={unit.id === fromUnit ? "text-teal-400" : undefined}
            />
          ))}
          <ResultDisplay label="Full Number" value={baseValue.toLocaleString()} color="text-foreground" />
        </div>
      </ToolCard>
    </div>
  );
}

function CroreLakhConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("crore");

  const units = [
    { id: "arab", label: "Arab", factor: 1e9 },
    { id: "crore", label: "Crore", factor: 1e7 },
    { id: "lakh", label: "Lakh", factor: 1e5 },
    { id: "thousand", label: "Thousand", factor: 1e3 },
    { id: "hundred", label: "Hundred", factor: 100 },
  ];

  const baseValue = (parseFloat(value) || 0) * (units.find(u => u.id === fromUnit)?.factor || 1);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(4);
    if (num >= 1e7) return (num / 1e7).toFixed(4);
    if (num >= 1e5) return (num / 1e5).toFixed(4);
    if (num >= 1e3) return (num / 1e3).toFixed(4);
    return num.toFixed(2);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Crore/Lakh Converter" icon={IndianRupee} iconColor="bg-orange-500">
        <div className="space-y-4">
          <InputField label="Value" value={value} onChange={setValue} type="number" />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">From</label>
            <div className="flex flex-wrap gap-2">
              {units.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => setFromUnit(unit.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    fromUnit === unit.id
                      ? "bg-orange-500 text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`button-from-${unit.id}`}
                >
                  {unit.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Conversions" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          {units.map((unit) => (
            <ResultDisplay
              key={unit.id}
              label={unit.label}
              value={formatNumber(baseValue / unit.factor)}
              highlight={unit.id === fromUnit}
              color={unit.id === fromUnit ? "text-orange-400" : undefined}
            />
          ))}
          <ResultDisplay label="Full Number" value={baseValue.toLocaleString("en-IN")} color="text-foreground" />
        </div>
      </ToolCard>
    </div>
  );
}

function USIndianConverter() {
  const [value, setValue] = useState("1000000000");
  const [mode, setMode] = useState<"us" | "indian">("us");

  const num = parseFloat(value.replace(/,/g, "")) || 0;

  const formatUS = (n: number) => {
    if (n >= 1e12) return `${(n / 1e12).toFixed(2)} Trillion`;
    if (n >= 1e9) return `${(n / 1e9).toFixed(2)} Billion`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(2)} Million`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(2)} Thousand`;
    return n.toString();
  };

  const formatIndian = (n: number) => {
    if (n >= 1e11) return `${(n / 1e9).toFixed(2)} Arab`;
    if (n >= 1e7) return `${(n / 1e7).toFixed(2)} Crore`;
    if (n >= 1e5) return `${(n / 1e5).toFixed(2)} Lakh`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(2)} Thousand`;
    return n.toString();
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="US ↔ Indian Number System" icon={ArrowRightLeft} iconColor="bg-blue-500">
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode("us")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === "us" ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"
              }`}
              data-testid="button-mode-us"
            >
              US System
            </button>
            <button
              onClick={() => setMode("indian")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === "indian" ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"
              }`}
              data-testid="button-mode-indian"
            >
              Indian System
            </button>
          </div>
          <InputField label="Enter Number" value={value} onChange={setValue} type="text" />
        </div>
      </ToolCard>

      <ToolCard title="Conversions" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">US System</p>
            <p className="text-2xl font-bold text-blue-400">{formatUS(num)}</p>
            <p className="text-sm text-muted-foreground mt-1">{num.toLocaleString("en-US")}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Indian System</p>
            <p className="text-2xl font-bold text-orange-400">{formatIndian(num)}</p>
            <p className="text-sm text-muted-foreground mt-1">{num.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Quick Reference" icon={Hash} iconColor="bg-purple-500">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground">1 Million</span>
            <span className="text-foreground">= 10 Lakh</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground">1 Billion</span>
            <span className="text-foreground">= 100 Crore</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground">1 Trillion</span>
            <span className="text-foreground">= 1 Lakh Crore</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground">1 Crore</span>
            <span className="text-foreground">= 10 Million</span>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}

function NumberToWords() {
  const [value, setValue] = useState("12345");
  const [system, setSystem] = useState<"us" | "indian">("us");

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const convertToWordsUS = (n: number): string => {
    if (n === 0) return "Zero";
    if (n < 0) return "Minus " + convertToWordsUS(-n);
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertToWordsUS(n % 100) : "");
    if (n < 1e6) return convertToWordsUS(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convertToWordsUS(n % 1000) : "");
    if (n < 1e9) return convertToWordsUS(Math.floor(n / 1e6)) + " Million" + (n % 1e6 ? " " + convertToWordsUS(n % 1e6) : "");
    if (n < 1e12) return convertToWordsUS(Math.floor(n / 1e9)) + " Billion" + (n % 1e9 ? " " + convertToWordsUS(n % 1e9) : "");
    return convertToWordsUS(Math.floor(n / 1e12)) + " Trillion" + (n % 1e12 ? " " + convertToWordsUS(n % 1e12) : "");
  };

  const convertToWordsIndian = (n: number): string => {
    if (n === 0) return "Zero";
    if (n < 0) return "Minus " + convertToWordsIndian(-n);
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertToWordsIndian(n % 100) : "");
    if (n < 1e5) return convertToWordsIndian(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convertToWordsIndian(n % 1000) : "");
    if (n < 1e7) return convertToWordsIndian(Math.floor(n / 1e5)) + " Lakh" + (n % 1e5 ? " " + convertToWordsIndian(n % 1e5) : "");
    if (n < 1e9) return convertToWordsIndian(Math.floor(n / 1e7)) + " Crore" + (n % 1e7 ? " " + convertToWordsIndian(n % 1e7) : "");
    return convertToWordsIndian(Math.floor(n / 1e9)) + " Arab" + (n % 1e9 ? " " + convertToWordsIndian(n % 1e9) : "");
  };

  const num = parseInt(value.replace(/,/g, "")) || 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Number to Words" icon={Hash} iconColor="bg-purple-500">
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSystem("us")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                system === "us" ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"
              }`}
              data-testid="button-system-us"
            >
              US System
            </button>
            <button
              onClick={() => setSystem("indian")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                system === "indian" ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"
              }`}
              data-testid="button-system-indian"
            >
              Indian System
            </button>
          </div>
          <InputField label="Enter Number" value={value} onChange={setValue} type="text" />
        </div>
      </ToolCard>

      <ToolCard title="In Words" icon={Calculator} iconColor="bg-emerald-500">
        <div className="p-4 bg-muted/30 rounded-xl">
          <p className="text-lg text-foreground leading-relaxed">
            {system === "us" ? convertToWordsUS(num) : convertToWordsIndian(num)}
          </p>
        </div>
        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Numeric: <span className="text-foreground font-mono">
              {system === "us" ? num.toLocaleString("en-US") : num.toLocaleString("en-IN")}
            </span>
          </p>
        </div>
      </ToolCard>
    </div>
  );
}

function RomanNumeralConverter() {
  const [mode, setMode] = useState<"to-roman" | "to-number">("to-roman");
  const [numberInput, setNumberInput] = useState("2024");
  const [romanInput, setRomanInput] = useState("MMXXIV");

  const romanNumerals: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];

  const toRoman = (num: number): { result: string; steps: string[] } => {
    if (num <= 0 || num > 3999 || !Number.isInteger(num)) {
      return { result: "Invalid (1\u20133999)", steps: ["Input must be an integer between 1 and 3999"] };
    }
    let remaining = num;
    let result = "";
    const steps: string[] = [`Starting with ${num}`];
    for (const [value, symbol] of romanNumerals) {
      while (remaining >= value) {
        result += symbol;
        remaining -= value;
        steps.push(`Subtract ${value} (${symbol}) \u2192 remaining: ${remaining}, result: ${result}`);
      }
    }
    return { result, steps };
  };

  const fromRoman = (str: string): { result: number; steps: string[] } => {
    const romanMap: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    const upper = str.toUpperCase().trim();
    if (!/^[IVXLCDM]+$/.test(upper)) {
      return { result: 0, steps: ["Invalid roman numeral. Use I, V, X, L, C, D, M only."] };
    }
    let total = 0;
    const steps: string[] = [`Parsing: ${upper}`];
    for (let i = 0; i < upper.length; i++) {
      const current = romanMap[upper[i]];
      const next = i + 1 < upper.length ? romanMap[upper[i + 1]] : 0;
      if (current < next) {
        total -= current;
        steps.push(`${upper[i]} (${current}) < ${upper[i + 1]} (${next}) \u2192 subtract ${current}, total: ${total}`);
      } else {
        total += current;
        steps.push(`${upper[i]} (${current}) \u2192 add ${current}, total: ${total}`);
      }
    }
    return { result: total, steps };
  };

  const commonExamples = [
    { num: 1, roman: "I" }, { num: 4, roman: "IV" }, { num: 5, roman: "V" },
    { num: 9, roman: "IX" }, { num: 10, roman: "X" }, { num: 40, roman: "XL" },
    { num: 50, roman: "L" }, { num: 90, roman: "XC" }, { num: 100, roman: "C" },
    { num: 400, roman: "CD" }, { num: 500, roman: "D" }, { num: 900, roman: "CM" },
    { num: 1000, roman: "M" }, { num: 2024, roman: "MMXXIV" },
  ];

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Roman Numerals Converter" icon={Columns3} iconColor="bg-teal-500">
        <div className="flex gap-2 p-1 bg-muted rounded-xl mb-4">
          <button onClick={() => setMode("to-roman")} data-testid="mode-to-roman"
            className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${mode === "to-roman" ? "bg-teal-500 text-white shadow-sm" : "text-muted-foreground"}`}>
            Number \u2192 Roman
          </button>
          <button onClick={() => setMode("to-number")} data-testid="mode-to-number"
            className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${mode === "to-number" ? "bg-teal-500 text-white shadow-sm" : "text-muted-foreground"}`}>
            Roman \u2192 Number
          </button>
        </div>

        {mode === "to-roman" ? (
          <>
            <InputField label="Enter Number (1\u20133999)" value={numberInput} onChange={setNumberInput} type="number" placeholder="2024" />
            {(() => {
              const num = parseInt(numberInput) || 0;
              const { result, steps } = toRoman(num);
              return (
                <div className="mt-4 space-y-3">
                  <div className="bg-muted/20 p-3 rounded-xl border border-border/50 space-y-1.5">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Step-by-step</p>
                    {steps.map((s, i) => (
                      <p key={i} className="text-xs text-foreground"><span className="font-bold text-teal-500 mr-1">Step {i + 1}:</span> {s}</p>
                    ))}
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                    <span className="text-sm font-semibold text-muted-foreground">Roman Numeral</span>
                    <span className="text-xl font-bold text-teal-500" data-testid="result-roman">{result}</span>
                  </div>
                </div>
              );
            })()}
          </>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Enter Roman Numeral</label>
              <input type="text" value={romanInput} onChange={(e) => setRomanInput(e.target.value.toUpperCase())} placeholder="MMXXIV"
                data-testid="input-roman"
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono tracking-widest text-lg" />
            </div>
            {(() => {
              const { result, steps } = fromRoman(romanInput);
              return (
                <div className="mt-4 space-y-3">
                  <div className="bg-muted/20 p-3 rounded-xl border border-border/50 space-y-1.5">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Step-by-step</p>
                    {steps.map((s, i) => (
                      <p key={i} className="text-xs text-foreground"><span className="font-bold text-teal-500 mr-1">Step {i + 1}:</span> {s}</p>
                    ))}
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                    <span className="text-sm font-semibold text-muted-foreground">Decimal Number</span>
                    <span className="text-xl font-bold text-teal-500" data-testid="result-number">{result.toLocaleString()}</span>
                  </div>
                </div>
              );
            })()}
          </>
        )}

        <div className="mt-4">
          <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Reference Chart</p>
          <div className="grid grid-cols-2 gap-1.5">
            {commonExamples.map((ex) => (
              <div key={ex.num} className="flex justify-between items-center px-3 py-1.5 bg-muted/20 rounded-lg">
                <span className="text-xs text-muted-foreground">{ex.num}</span>
                <span className="text-xs font-bold text-teal-500 font-mono">{ex.roman}</span>
              </div>
            ))}
          </div>
        </div>
      </ToolCard>
    </div>
  );
}
