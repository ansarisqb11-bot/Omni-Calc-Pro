import { useState } from "react";
import { motion } from "framer-motion";
import { Hash, Percent, Shuffle, Calculator, Divide, Search } from "lucide-react";
import { DesktopToolGrid, InputPanel, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

const tools = [
  { id: "prime", label: "Prime Check", icon: Hash },
  { id: "lcmhcf", label: "LCM & HCF", icon: Divide },
  { id: "random", label: "Random", icon: Shuffle },
  { id: "factorial", label: "Factorial", icon: Calculator },
  { id: "percent", label: "% Change", icon: Percent },
];

export default function MathTools() {
  const [activeTool, setActiveTool] = useState("prime");

  return (
    <PageWrapper
      title="Math Tools"
      subtitle="Prime numbers, LCM, HCF, and more"
      accentColor="bg-indigo-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id)}
    >
      {activeTool === "prime" && <PrimeChecker />}
      {activeTool === "lcmhcf" && <LcmHcfCalculator />}
      {activeTool === "random" && <RandomGenerator />}
      {activeTool === "factorial" && <FactorialCalculator />}
      {activeTool === "percent" && <PercentChangeCalculator />}
    </PageWrapper>
  );
}

function PrimeChecker() {
  const [number, setNumber] = useState("17");
  const [result, setResult] = useState<{ isPrime: boolean; factors: number[] } | null>(null);

  const checkPrime = () => {
    const n = parseInt(number);
    if (n < 2) { setResult({ isPrime: false, factors: [] }); return; }
    const factors: number[] = [];
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) { factors.push(i); if (i !== n / i) factors.push(n / i); }
    }
    setResult({ isPrime: factors.length === 0, factors: factors.sort((a, b) => a - b) });
  };

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Prime Number Checker" icon={Hash} iconColor="bg-orange-500">
          <InputField label="Enter Number" value={number} onChange={setNumber} type="number" />
          <ToolButton onClick={checkPrime} className="bg-orange-500 hover:bg-orange-600">Check</ToolButton>
        </InputPanel>
      }
      results={
        result ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border shadow-sm p-5">
            <div className="text-center py-4">
              <div className={`text-4xl font-bold ${result.isPrime ? "text-emerald-400" : "text-red-400"}`}>
                {result.isPrime ? "Prime" : "Not Prime"}
              </div>
              {!result.isPrime && result.factors.length > 0 && (
                <p className="text-muted-foreground mt-3">Factors: {result.factors.join(", ")}</p>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground text-sm text-center">Enter a number and click Check</p>
          </div>
        )
      }
    />
  );
}

function LcmHcfCalculator() {
  const [num1, setNum1] = useState("12");
  const [num2, setNum2] = useState("18");
  const [result, setResult] = useState<{ lcm: number; hcf: number } | null>(null);

  const calculate = () => {
    const a = parseInt(num1) || 0;
    const b = parseInt(num2) || 0;
    if (a <= 0 || b <= 0) return;
    const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
    const hcf = gcd(a, b);
    setResult({ lcm: (a * b) / hcf, hcf });
  };

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="LCM & HCF Calculator" icon={Divide} iconColor="bg-blue-500">
          <InputField label="First Number" value={num1} onChange={setNum1} type="number" />
          <InputField label="Second Number" value={num2} onChange={setNum2} type="number" />
          <ToolButton onClick={calculate}>Calculate</ToolButton>
        </InputPanel>
      }
      results={
        result ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
            <ResultDisplay label="LCM (Least Common Multiple)" value={result.lcm.toLocaleString()} highlight color="text-blue-400" />
            <ResultDisplay label="HCF (Highest Common Factor)" value={result.hcf.toLocaleString()} color="text-emerald-400" />
          </motion.div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground text-sm text-center">Enter two numbers and click Calculate</p>
          </div>
        )
      }
    />
  );
}

function RandomGenerator() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [results, setResults] = useState<number[]>([]);

  const generate = () => {
    const minVal = parseInt(min) || 0;
    const maxVal = parseInt(max) || 100;
    const countVal = Math.min(parseInt(count) || 1, 50);
    const nums: number[] = [];
    for (let i = 0; i < countVal; i++) {
      nums.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
    }
    setResults(nums);
  };

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Random Number Generator" icon={Shuffle} iconColor="bg-purple-500">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Min" value={min} onChange={setMin} type="number" />
            <InputField label="Max" value={max} onChange={setMax} type="number" />
          </div>
          <InputField label="How Many" value={count} onChange={setCount} type="number" />
          <ToolButton onClick={generate} className="bg-purple-500 hover:bg-purple-600">Generate</ToolButton>
        </InputPanel>
      }
      results={
        results.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border shadow-sm p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Random Numbers</p>
            <div className="flex flex-wrap gap-2">
              {results.map((n, i) => (
                <span key={i} className="px-3 py-2 bg-muted rounded-lg font-mono text-lg">{n}</span>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground text-sm text-center">Set range and click Generate</p>
          </div>
        )
      }
    />
  );
}

function FactorialCalculator() {
  const [number, setNumber] = useState("5");
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const n = parseInt(number) || 0;
    if (n < 0 || n > 170) { setResult("Number must be 0-170"); return; }
    let fact = BigInt(1);
    for (let i = BigInt(2); i <= BigInt(n); i = i + BigInt(1)) fact = fact * i;
    setResult(fact.toString());
  };

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Factorial Calculator" icon={Calculator} iconColor="bg-amber-500">
          <InputField label="Enter Number (n)" value={number} onChange={setNumber} type="number" />
          <ToolButton onClick={calculate} className="bg-amber-500 hover:bg-amber-600">Calculate n!</ToolButton>
        </InputPanel>
      }
      results={
        result ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border shadow-sm p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Result</p>
            <p className="text-sm text-muted-foreground mb-2">{number}! =</p>
            <p className="text-lg font-mono text-emerald-400 break-all">{result}</p>
          </motion.div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground text-sm text-center">Enter a number and click Calculate</p>
          </div>
        )
      }
    />
  );
}

function PercentChangeCalculator() {
  const [oldValue, setOldValue] = useState("100");
  const [newValue, setNewValue] = useState("125");

  const old = parseFloat(oldValue) || 0;
  const current = parseFloat(newValue) || 0;
  const change = old !== 0 ? ((current - old) / old) * 100 : 0;
  const isIncrease = change >= 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Percentage Change" icon={Percent} iconColor="bg-pink-500">
          <InputField label="Original Value" value={oldValue} onChange={setOldValue} type="number" />
          <InputField label="New Value" value={newValue} onChange={setNewValue} type="number" />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Change</p>
          <div className="text-center py-4">
            <div className={`text-4xl font-bold ${isIncrease ? "text-emerald-400" : "text-red-400"}`}>
              {isIncrease ? "+" : ""}{change.toFixed(2)}%
            </div>
            <p className="text-muted-foreground mt-2">
              {isIncrease ? "Increase" : "Decrease"} of {Math.abs(current - old).toFixed(2)}
            </p>
          </div>
        </div>
      }
    />
  );
}
