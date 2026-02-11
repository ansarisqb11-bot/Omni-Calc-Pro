import { useState } from "react";
import { motion } from "framer-motion";
import { Hash, ArrowRightLeft, DollarSign, IndianRupee, Calculator, Columns3 } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "billion-million" | "crore-lakh" | "us-indian" | "number-words" | "roman" | "fibonacci" | "factors";

export default function NumberTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("billion-million");

  const tools = [
    { id: "billion-million", label: "Billion/Million", icon: DollarSign },
    { id: "crore-lakh", label: "Crore/Lakh", icon: IndianRupee },
    { id: "us-indian", label: "US ↔ Indian", icon: ArrowRightLeft },
    { id: "number-words", label: "To Words", icon: Hash },
    { id: "roman", label: "Roman", icon: Columns3 },
    { id: "fibonacci", label: "Fibonacci", icon: Calculator },
    { id: "factors", label: "Factors", icon: Hash },
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
      {activeTool === "fibonacci" && <FibonacciGenerator />}
      {activeTool === "factors" && <FactorFinder />}
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
    if (num >= 1e12) return (num / 1e12).toLocaleString(undefined, { maximumFractionDigits: 4 });
    if (num >= 1e9) return (num / 1e9).toLocaleString(undefined, { maximumFractionDigits: 4 });
    if (num >= 1e6) return (num / 1e6).toLocaleString(undefined, { maximumFractionDigits: 4 });
    if (num >= 1e3) return (num / 1e3).toLocaleString(undefined, { maximumFractionDigits: 4 });
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
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
    { id: "kharab", label: "Kharab (100 Arab)", factor: 1e11 },
    { id: "arab", label: "Arab (100 Crore)", factor: 1e9 },
    { id: "crore", label: "Crore (100 Lakh)", factor: 1e7 },
    { id: "lakh", label: "Lakh (100 Thousand)", factor: 1e5 },
    { id: "thousand", label: "Thousand", factor: 1e3 },
    { id: "hundred", label: "Hundred", factor: 100 },
  ];

  const baseValue = (parseFloat(value) || 0) * (units.find(u => u.id === fromUnit)?.factor || 1);

  const formatNumber = (num: number) => {
    if (num >= 1e11) return (num / 1e11).toLocaleString("en-IN", { maximumFractionDigits: 4 });
    if (num >= 1e9) return (num / 1e9).toLocaleString("en-IN", { maximumFractionDigits: 4 });
    if (num >= 1e7) return (num / 1e7).toLocaleString("en-IN", { maximumFractionDigits: 4 });
    if (num >= 1e5) return (num / 1e5).toLocaleString("en-IN", { maximumFractionDigits: 4 });
    if (num >= 1e3) return (num / 1e3).toLocaleString("en-IN", { maximumFractionDigits: 4 });
    return num.toLocaleString("en-IN", { maximumFractionDigits: 2 });
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

function FibonacciGenerator() {
  const [count, setCount] = useState("10");

  const generateFibonacci = (n: number) => {
    if (n <= 0) return [];
    if (n === 1) return [0];
    const sequence: number[] = [0, 1];
    for (let i = 2; i < n; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
  };

  const n = parseInt(count) || 0;
  const sequence = generateFibonacci(Math.min(n, 100));

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Fibonacci Generator" icon={Calculator} iconColor="bg-teal-500">
        <div className="space-y-4">
          <InputField label="Number of Terms (Max 100)" value={count} onChange={setCount} type="number" min={1} max={100} />
          <div className="bg-muted/30 p-4 rounded-xl space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Sequence:</p>
            <div className="flex flex-wrap gap-2">
              {sequence.map((num, i) => (
                <div key={i} className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-teal-400 font-mono font-bold">
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Explanation" icon={Hash} iconColor="bg-emerald-500">
        <div className="text-sm text-muted-foreground leading-relaxed">
          The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1.
          <p className="mt-2 font-mono text-foreground bg-muted/20 p-2 rounded">F(n) = F(n-1) + F(n-2)</p>
        </div>
      </ToolCard>
    </div>
  );
}

function FactorFinder() {
  const [value, setValue] = useState("24");

  const findFactors = (n: number) => {
    const factors = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        factors.push(i);
        if (i !== n / i) factors.push(n / i);
      }
    }
    return factors.sort((a, b) => a - b);
  };

  const n = parseInt(value) || 0;
  const factors = n > 0 ? findFactors(n) : [];
  const isPrime = n > 1 && factors.length === 2;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Factor Finder" icon={Hash} iconColor="bg-teal-500">
        <div className="space-y-4">
          <InputField label="Enter a Number" value={value} onChange={setValue} type="number" min={1} />
          <div className="bg-muted/30 p-4 rounded-xl space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Factors of {n}:</p>
              <div className="flex flex-wrap gap-2">
                {factors.map((f, i) => (
                  <div key={i} className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-teal-400 font-mono font-bold">
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Total Factors</span>
              <span className="text-lg font-bold text-teal-400">{factors.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Number Type</span>
              <span className={`text-lg font-bold ${isPrime ? "text-emerald-400" : "text-amber-400"}`}>
                {isPrime ? "Prime Number" : "Composite Number"}
              </span>
            </div>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}

function FibonacciGenerator() {
  const [count, setCount] = useState("10");

  const generateFibonacci = (n: number) => {
    if (n <= 0) return [];
    if (n === 1) return [0];
    const sequence = [0, 1];
    for (let i = 2; i < n; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
  };

  const n = parseInt(count) || 0;
  const sequence = generateFibonacci(Math.min(n, 100));

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Fibonacci Generator" icon={Calculator} iconColor="bg-teal-500">
        <div className="space-y-4">
          <InputField label="Number of Terms (Max 100)" value={count} onChange={setCount} type="number" min={1} max={100} />
          <div className="bg-muted/30 p-4 rounded-xl space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Sequence:</p>
            <div className="flex flex-wrap gap-2">
              {sequence.map((num, i) => (
                <div key={i} className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-teal-400 font-mono font-bold">
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Explanation" icon={Hash} iconColor="bg-emerald-500">
        <div className="text-sm text-muted-foreground leading-relaxed">
          The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1.
          <p className="mt-2 font-mono text-foreground bg-muted/20 p-2 rounded">F(n) = F(n-1) + F(n-2)</p>
        </div>
      </ToolCard>
    </div>
  );
}

function FactorFinder() {
  const [value, setValue] = useState("24");

  const findFactors = (n: number) => {
    const factors = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        factors.push(i);
        if (i !== n / i) factors.push(n / i);
      }
    }
    return factors.sort((a, b) => a - b);
  };

  const n = parseInt(value) || 0;
  const factors = n > 0 ? findFactors(n) : [];
  const isPrime = n > 1 && factors.length === 2;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Factor Finder" icon={Hash} iconColor="bg-teal-500">
        <div className="space-y-4">
          <InputField label="Enter a Number" value={value} onChange={setValue} type="number" min={1} />
          <div className="bg-muted/30 p-4 rounded-xl space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Factors of {n}:</p>
              <div className="flex flex-wrap gap-2">
                {factors.map((f, i) => (
                  <div key={i} className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-teal-400 font-mono font-bold">
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Total Factors</span>
              <span className="text-lg font-bold text-teal-400">{factors.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Number Type</span>
              <span className={`text-lg font-bold ${isPrime ? "text-emerald-400" : "text-amber-400"}`}>
                {isPrime ? "Prime Number" : "Composite Number"}
              </span>
            </div>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}
