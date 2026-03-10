import { useState, useMemo } from "react";
import {
  TrendingUp, BarChart2, DollarSign, Users, Briefcase,
  Zap, Package, UserCheck, Globe, Activity
} from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType =
  | "gdp" | "market-size" | "net-worth" | "unemployment"
  | "employment-growth" | "productivity" | "tariff"
  | "per-person-income" | "per-capita" | "inflation-impact";

const tools = [
  { id: "gdp",              label: "GDP",                icon: Globe },
  { id: "market-size",      label: "Market Size",        icon: BarChart2 },
  { id: "net-worth",        label: "Net Worth",          icon: DollarSign },
  { id: "unemployment",     label: "Unemployment Rate",  icon: Users },
  { id: "employment-growth",label: "Employment Growth",  icon: UserCheck },
  { id: "productivity",     label: "Productivity",       icon: Zap },
  { id: "tariff",           label: "Tariff Impact",      icon: Package },
  { id: "per-person-income",label: "Per Person Income",  icon: Briefcase },
  { id: "per-capita",       label: "Per Capita Income",  icon: Activity },
  { id: "inflation-impact", label: "Inflation Impact",   icon: TrendingUp },
];

const CURRENCIES = [
  { symbol: "₹", code: "INR", label: "₹ INR" },
  { symbol: "$", code: "USD", label: "$ USD" },
  { symbol: "€", code: "EUR", label: "€ EUR" },
  { symbol: "£", code: "GBP", label: "£ GBP" },
  { symbol: "¥", code: "JPY", label: "¥ JPY" },
  { symbol: "¥", code: "CNY", label: "¥ CNY" },
  { symbol: "A$", code: "AUD", label: "A$ AUD" },
  { symbol: "C$", code: "CAD", label: "C$ CAD" },
  { symbol: "AED", code: "AED", label: "AED" },
  { symbol: "SGD", code: "SGD", label: "S$ SGD" },
];

export default function BusinessEconomicsTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("gdp");
  return (
    <PageWrapper
      title="Business & Economics"
      subtitle="GDP, market analysis, income, tariff, and economic tools"
      accentColor="bg-cyan-600"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "gdp"               && <GDPCalculator />}
      {activeTool === "market-size"       && <MarketSizeCalculator />}
      {activeTool === "net-worth"         && <NetWorthCalculator />}
      {activeTool === "unemployment"      && <UnemploymentCalculator />}
      {activeTool === "employment-growth" && <EmploymentGrowthTool />}
      {activeTool === "productivity"      && <ProductivityCalculator />}
      {activeTool === "tariff"            && <TariffCalculator />}
      {activeTool === "per-person-income" && <PerPersonIncomeCalculator />}
      {activeTool === "per-capita"        && <PerCapitaIncomeTool />}
      {activeTool === "inflation-impact"  && <InflationImpactCalculator />}
    </PageWrapper>
  );
}

function fmt(n: number, d = 2): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toFixed(d)).toLocaleString("en-IN");
}

function fmtCurrency(n: number, symbol: string, d = 2): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  if (n >= 1e12) return `${symbol}${fmt(n / 1e12, 2)}T`;
  if (n >= 1e9)  return `${symbol}${fmt(n / 1e9, 2)}B`;
  if (n >= 1e7)  return `${symbol}${fmt(n / 1e7, 2)} Cr`;
  if (n >= 1e5)  return `${symbol}${fmt(n / 1e5, 2)} L`;
  return `${symbol}${fmt(n, d)}`;
}

function Input({ label, value, onChange, placeholder, suffix }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; suffix?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          data-testid={`input-${label.toLowerCase().replace(/\s+/g, "-")}`}
          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

function CurrencySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Currency</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="select-currency"
        className="w-full bg-muted border border-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
      </select>
    </div>
  );
}

function ModeToggle({ modes, mode, setMode }: { modes: { id: string; label: string }[]; mode: string; setMode: (m: string) => void }) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-xl mb-4 flex-wrap">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          data-testid={`mode-${m.id}`}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${mode === m.id ? "bg-cyan-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

function Steps({ steps }: { steps: string[] }) {
  if (!steps.length) return null;
  return (
    <div className="bg-muted/20 p-3 rounded-xl border border-border/50 space-y-1.5">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Step-by-step</p>
      {steps.map((s, i) => (
        <p key={i} className="text-xs text-foreground">
          <span className="font-bold text-cyan-500 mr-1">Step {i + 1}:</span>{s}
        </p>
      ))}
    </div>
  );
}

function Results({ results }: { results: { label: string; value: string; highlight?: boolean }[] }) {
  return (
    <div className="space-y-2">
      {results.map((r, i) => (
        <div key={i} className={`flex justify-between items-center p-2.5 rounded-xl ${r.highlight ? "bg-cyan-500/10 border border-cyan-500/20" : "bg-muted/30"}`}>
          <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
          <span className={`text-sm font-bold ${r.highlight ? "text-cyan-400" : "text-foreground"}`}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function CalcButton({ onClick, label = "Calculate" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      data-testid="button-calculate"
      className="w-full py-3 rounded-xl font-semibold bg-cyan-600 hover:bg-cyan-700 text-white transition-all mt-2"
    >
      {label}
    </button>
  );
}

function FormulaBox({ text }: { text: string }) {
  return (
    <div className="mb-3 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
      <p className="text-xs font-semibold text-cyan-500 mb-1">Formula</p>
      <p className="text-xs text-muted-foreground font-mono">{text}</p>
    </div>
  );
}

function useCurrency(defaultCode = "INR") {
  const [code, setCode] = useState(defaultCode);
  const sym = CURRENCIES.find(c => c.code === code)?.symbol || "₹";
  return { code, setCode, sym };
}

/* ───────────────────────────── 1. GDP CALCULATOR ──────────────────────── */
function GDPCalculator() {
  const [mode, setMode] = useState("expenditure");
  const cur = useCurrency("INR");

  const [C, setC] = useState(""); // Consumption
  const [I, setI] = useState(""); // Investment
  const [G, setG] = useState(""); // Govt Spending
  const [X, setX] = useState(""); // Exports
  const [M, setM] = useState(""); // Imports
  const [population, setPopulation] = useState("");
  const [prevGDP, setPrevGDP] = useState("");
  const [currGDP, setCurrGDP] = useState("");
  const [unknownComp, setUnknownComp] = useState("C");
  const [gdpTarget, setGdpTarget] = useState("");

  const [result, setResult] = useState<{ results: { label: string; value: string; highlight?: boolean }[]; steps: string[] } | null>(null);

  const calculate = () => {
    const s = cur.sym;
    if (mode === "expenditure") {
      const c = parseFloat(C) || 0;
      const i = parseFloat(I) || 0;
      const g = parseFloat(G) || 0;
      const x = parseFloat(X) || 0;
      const m = parseFloat(M) || 0;
      const netExports = x - m;
      const gdp = c + i + g + netExports;
      const pop = parseFloat(population) || 0;
      setResult({
        results: [
          { label: "GDP", value: fmtCurrency(gdp, s), highlight: true },
          { label: "Consumption (C)", value: fmtCurrency(c, s) },
          { label: "Investment (I)", value: fmtCurrency(i, s) },
          { label: "Govt Spending (G)", value: fmtCurrency(g, s) },
          { label: "Net Exports (X−M)", value: fmtCurrency(netExports, s) },
          ...(pop > 0 ? [{ label: "GDP per Capita", value: fmtCurrency(gdp / pop, s) }] : []),
        ],
        steps: [
          `GDP = C + I + G + (X − M)`,
          `= ${fmtCurrency(c, s)} + ${fmtCurrency(i, s)} + ${fmtCurrency(g, s)} + (${fmtCurrency(x, s)} − ${fmtCurrency(m, s)})`,
          `Net Exports = ${fmtCurrency(netExports, s)}`,
          `GDP = ${fmtCurrency(gdp, s)}`,
          ...(pop > 0 ? [`GDP per capita = ${fmtCurrency(gdp, s)} ÷ ${fmt(pop, 0)} = ${fmtCurrency(gdp / pop, s)}`] : []),
        ],
      });
    } else if (mode === "growth") {
      const prev = parseFloat(prevGDP) || 0;
      const curr = parseFloat(currGDP) || 0;
      if (!prev || !curr) return;
      const growthRate = ((curr - prev) / prev) * 100;
      const change = curr - prev;
      setResult({
        results: [
          { label: "GDP Growth Rate", value: `${fmt(growthRate, 2)}%`, highlight: true },
          { label: "Previous GDP", value: fmtCurrency(prev, s) },
          { label: "Current GDP", value: fmtCurrency(curr, s) },
          { label: "Absolute Change", value: fmtCurrency(change, s) },
        ],
        steps: [
          `Growth Rate = ((Current − Previous) / Previous) × 100`,
          `= ((${fmtCurrency(curr, s)} − ${fmtCurrency(prev, s)}) / ${fmtCurrency(prev, s)}) × 100`,
          `= (${fmtCurrency(change, s)} / ${fmtCurrency(prev, s)}) × 100`,
          `= ${fmt(growthRate, 2)}%`,
        ],
      });
    } else if (mode === "reverse") {
      const gdp = parseFloat(gdpTarget) || 0;
      const c = parseFloat(C) || 0;
      const i = parseFloat(I) || 0;
      const g = parseFloat(G) || 0;
      const x = parseFloat(X) || 0;
      const m = parseFloat(M) || 0;
      let unknown = 0;
      let label = unknownComp;
      if (unknownComp === "C") { unknown = gdp - i - g - (x - m); label = "Consumption (C)"; }
      else if (unknownComp === "I") { unknown = gdp - c - g - (x - m); label = "Investment (I)"; }
      else if (unknownComp === "G") { unknown = gdp - c - i - (x - m); label = "Govt Spending (G)"; }
      else if (unknownComp === "X") { unknown = gdp - c - i - g + m; label = "Exports (X)"; }
      setResult({
        results: [
          { label, value: fmtCurrency(unknown, s), highlight: true },
          { label: "Target GDP", value: fmtCurrency(gdp, s) },
        ],
        steps: [
          `GDP = C + I + G + (X − M) = ${fmtCurrency(gdp, s)}`,
          `Solving for ${label}:`,
          `${label} = ${fmtCurrency(unknown, s)}`,
        ],
      });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="GDP Calculator" icon={Globe} iconColor="bg-cyan-600">
        <ModeToggle modes={[
          { id: "expenditure", label: "GDP (Expenditure)" },
          { id: "growth", label: "Growth Rate" },
          { id: "reverse", label: "Reverse (Find Component)" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <CurrencySelect value={cur.code} onChange={cur.setCode} />
          {mode === "expenditure" && (
            <>
              <FormulaBox text="GDP = C + I + G + (X − M)" />
              <Input label="Consumption (C)" value={C} onChange={setC} placeholder="50000000" suffix={cur.sym} />
              <Input label="Investment (I)" value={I} onChange={setI} placeholder="20000000" suffix={cur.sym} />
              <Input label="Govt Spending (G)" value={G} onChange={setG} placeholder="15000000" suffix={cur.sym} />
              <Input label="Exports (X)" value={X} onChange={setX} placeholder="8000000" suffix={cur.sym} />
              <Input label="Imports (M)" value={M} onChange={setM} placeholder="6000000" suffix={cur.sym} />
              <Input label="Population (optional)" value={population} onChange={setPopulation} placeholder="1400000000" />
            </>
          )}
          {mode === "growth" && (
            <>
              <FormulaBox text="Growth Rate = ((Current − Previous) / Previous) × 100" />
              <Input label="Previous GDP" value={prevGDP} onChange={setPrevGDP} placeholder="100000000" suffix={cur.sym} />
              <Input label="Current GDP" value={currGDP} onChange={setCurrGDP} placeholder="108000000" suffix={cur.sym} />
            </>
          )}
          {mode === "reverse" && (
            <>
              <FormulaBox text="Find missing component: GDP = C + I + G + (X − M)" />
              <Input label="Target GDP" value={gdpTarget} onChange={setGdpTarget} placeholder="200000000" suffix={cur.sym} />
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Find which component?</label>
                <select value={unknownComp} onChange={(e) => setUnknownComp(e.target.value)}
                  className="w-full bg-muted border border-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="C">Consumption (C)</option>
                  <option value="I">Investment (I)</option>
                  <option value="G">Govt Spending (G)</option>
                  <option value="X">Exports (X)</option>
                </select>
              </div>
              {unknownComp !== "C" && <Input label="Consumption (C)" value={C} onChange={setC} placeholder="0" suffix={cur.sym} />}
              {unknownComp !== "I" && <Input label="Investment (I)" value={I} onChange={setI} placeholder="0" suffix={cur.sym} />}
              {unknownComp !== "G" && <Input label="Govt Spending (G)" value={G} onChange={setG} placeholder="0" suffix={cur.sym} />}
              {unknownComp !== "X" && <Input label="Exports (X)" value={X} onChange={setX} placeholder="0" suffix={cur.sym} />}
              <Input label="Imports (M)" value={M} onChange={setM} placeholder="0" suffix={cur.sym} />
            </>
          )}
          <CalcButton onClick={calculate} />
        </div>
        {result && <div className="mt-4 space-y-3"><Steps steps={result.steps} /><Results results={result.results} /></div>}
      </ToolCard>
    </div>
  );
}

/* ─────────────────────── 2. MARKET SIZE CALCULATOR ────────────────────── */
function MarketSizeCalculator() {
  const [mode, setMode] = useState("tam");
  const cur = useCurrency("INR");
  const [customers, setCustomers] = useState("");
  const [avgRevenue, setAvgRevenue] = useState("");
  const [penetration, setPenetration] = useState("10");
  const [som, setSom] = useState("5");
  const [growthRate, setGrowthRate] = useState("12");
  const [years, setYears] = useState("5");
  const [targetRevenue, setTargetRevenue] = useState("");
  const [result, setResult] = useState<{ results: { label: string; value: string; highlight?: boolean }[]; steps: string[] } | null>(null);

  const calculate = () => {
    const s = cur.sym;
    if (mode === "tam") {
      const cust = parseFloat(customers) || 0;
      const rev = parseFloat(avgRevenue) || 0;
      const pen = parseFloat(penetration) / 100 || 0;
      const som_ = parseFloat(som) / 100 || 0;
      const tam = cust * rev;
      const sam = tam * pen;
      const somVal = tam * som_;
      setResult({
        results: [
          { label: "TAM (Total Available Market)", value: fmtCurrency(tam, s), highlight: true },
          { label: "SAM (Serviceable Available Market)", value: fmtCurrency(sam, s) },
          { label: "SOM (Serviceable Obtainable Market)", value: fmtCurrency(somVal, s) },
          { label: "Customers", value: fmt(cust, 0) },
          { label: "Avg Revenue per Customer", value: fmtCurrency(rev, s) },
        ],
        steps: [
          `TAM = Total Customers × Avg Revenue per Customer`,
          `TAM = ${fmt(cust, 0)} × ${fmtCurrency(rev, s)} = ${fmtCurrency(tam, s)}`,
          `SAM = TAM × Market Penetration (${penetration}%)`,
          `SAM = ${fmtCurrency(tam, s)} × ${penetration}% = ${fmtCurrency(sam, s)}`,
          `SOM = TAM × Obtainable Share (${som}%) = ${fmtCurrency(somVal, s)}`,
        ],
      });
    } else if (mode === "growth") {
      const tam = parseFloat(customers) || 0;
      const g = parseFloat(growthRate) / 100 || 0;
      const y = parseFloat(years) || 0;
      const future = tam * Math.pow(1 + g, y);
      const cagr = (Math.pow(future / tam, 1 / y) - 1) * 100;
      setResult({
        results: [
          { label: "Future Market Size", value: fmtCurrency(future, s), highlight: true },
          { label: "Current Market Size", value: fmtCurrency(tam, s) },
          { label: "CAGR", value: `${fmt(cagr, 2)}%` },
          { label: "Years", value: fmt(y, 0) },
          { label: "Total Growth", value: `${fmt(((future - tam) / tam) * 100, 1)}%` },
        ],
        steps: [
          `Future Value = Present × (1 + Growth Rate)^Years`,
          `= ${fmtCurrency(tam, s)} × (1 + ${growthRate}%)^${y}`,
          `= ${fmtCurrency(tam, s)} × ${fmt(Math.pow(1 + g, y), 4)}`,
          `= ${fmtCurrency(future, s)}`,
        ],
      });
    } else if (mode === "reverse") {
      const target = parseFloat(targetRevenue) || 0;
      const rev = parseFloat(avgRevenue) || 0;
      if (!rev || !target) return;
      const needed = target / rev;
      const pen = parseFloat(penetration) / 100 || 0.1;
      const totalMarket = needed / pen;
      setResult({
        results: [
          { label: "Customers Needed", value: fmt(needed, 0), highlight: true },
          { label: "Total Market Required", value: fmt(totalMarket, 0) },
          { label: "Target Revenue", value: fmtCurrency(target, s) },
          { label: "Revenue per Customer", value: fmtCurrency(rev, s) },
        ],
        steps: [
          `Customers Needed = Target Revenue ÷ Revenue per Customer`,
          `= ${fmtCurrency(target, s)} ÷ ${fmtCurrency(rev, s)} = ${fmt(needed, 0)}`,
          `At ${penetration}% penetration, total market = ${fmt(totalMarket, 0)} customers`,
        ],
      });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Market Size Calculator" icon={BarChart2} iconColor="bg-cyan-600">
        <ModeToggle modes={[
          { id: "tam", label: "TAM / SAM / SOM" },
          { id: "growth", label: "Market Growth" },
          { id: "reverse", label: "Reverse (Customers Needed)" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <CurrencySelect value={cur.code} onChange={cur.setCode} />
          {mode === "tam" && (
            <>
              <FormulaBox text="TAM = Total Customers × Avg Revenue" />
              <Input label="Total Potential Customers" value={customers} onChange={setCustomers} placeholder="1000000" />
              <Input label="Avg Revenue per Customer / year" value={avgRevenue} onChange={setAvgRevenue} placeholder="5000" suffix={cur.sym} />
              <Input label="Market Penetration %" value={penetration} onChange={setPenetration} placeholder="10" suffix="%" />
              <Input label="Obtainable Market Share %" value={som} onChange={setSom} placeholder="5" suffix="%" />
            </>
          )}
          {mode === "growth" && (
            <>
              <FormulaBox text="Future Size = Current × (1 + Growth%)^Years" />
              <Input label="Current Market Size" value={customers} onChange={setCustomers} placeholder="5000000000" suffix={cur.sym} />
              <Input label="Annual Growth Rate %" value={growthRate} onChange={setGrowthRate} placeholder="12" suffix="%" />
              <Input label="Years" value={years} onChange={setYears} placeholder="5" />
            </>
          )}
          {mode === "reverse" && (
            <>
              <FormulaBox text="Customers Needed = Target Revenue ÷ Avg Revenue" />
              <Input label="Target Revenue" value={targetRevenue} onChange={setTargetRevenue} placeholder="10000000" suffix={cur.sym} />
              <Input label="Avg Revenue per Customer" value={avgRevenue} onChange={setAvgRevenue} placeholder="5000" suffix={cur.sym} />
              <Input label="Expected Market Penetration %" value={penetration} onChange={setPenetration} placeholder="10" suffix="%" />
            </>
          )}
          <CalcButton onClick={calculate} />
        </div>
        {result && <div className="mt-4 space-y-3"><Steps steps={result.steps} /><Results results={result.results} /></div>}
      </ToolCard>
    </div>
  );
}

/* ──────────────────────── 3. NET WORTH CALCULATOR ─────────────────────── */
function NetWorthCalculator() {
  const [mode, setMode] = useState("calculate");
  const cur = useCurrency("INR");
  const [cash, setCash] = useState("");
  const [investments, setInvestments] = useState("");
  const [realEstate, setRealEstate] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [otherAssets, setOtherAssets] = useState("");
  const [loans, setLoans] = useState("");
  const [creditCard, setCreditCard] = useState("");
  const [otherLiabilities, setOtherLiabilities] = useState("");
  const [age, setAge] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [targetNetWorth, setTargetNetWorth] = useState("");
  const [currentNetWorth, setCurrentNetWorth] = useState("");
  const [months, setMonths] = useState("60");
  const [result, setResult] = useState<{ results: { label: string; value: string; highlight?: boolean }[]; steps: string[] } | null>(null);

  const calculate = () => {
    const s = cur.sym;
    if (mode === "calculate") {
      const totalAssets = (parseFloat(cash) || 0) + (parseFloat(investments) || 0) +
        (parseFloat(realEstate) || 0) + (parseFloat(vehicle) || 0) + (parseFloat(otherAssets) || 0);
      const totalLiab = (parseFloat(loans) || 0) + (parseFloat(creditCard) || 0) + (parseFloat(otherLiabilities) || 0);
      const netWorth = totalAssets - totalLiab;
      setResult({
        results: [
          { label: "Net Worth", value: fmtCurrency(netWorth, s), highlight: true },
          { label: "Total Assets", value: fmtCurrency(totalAssets, s) },
          { label: "Total Liabilities", value: fmtCurrency(totalLiab, s) },
          { label: "Debt-to-Asset Ratio", value: totalAssets > 0 ? `${fmt((totalLiab / totalAssets) * 100, 1)}%` : "—" },
        ],
        steps: [
          `Total Assets = Cash + Investments + Real Estate + Vehicle + Other`,
          `= ${fmtCurrency(totalAssets, s)}`,
          `Total Liabilities = Loans + Credit Card + Other`,
          `= ${fmtCurrency(totalLiab, s)}`,
          `Net Worth = ${fmtCurrency(totalAssets, s)} − ${fmtCurrency(totalLiab, s)} = ${fmtCurrency(netWorth, s)}`,
        ],
      });
    } else if (mode === "target") {
      const a = parseFloat(age) || 0;
      const inc = parseFloat(annualIncome) || 0;
      const target = (a * inc) / 10;
      setResult({
        results: [
          { label: "Target Net Worth", value: fmtCurrency(target, s), highlight: true },
          { label: "Your Age", value: fmt(a, 0) },
          { label: "Annual Income", value: fmtCurrency(inc, s) },
          { label: "Formula Used", value: "(Age × Annual Income) ÷ 10" },
        ],
        steps: [
          `Target Net Worth = (Age × Annual Income) ÷ 10`,
          `= (${a} × ${fmtCurrency(inc, s)}) ÷ 10`,
          `= ${fmtCurrency(target, s)}`,
        ],
      });
    } else if (mode === "reverse") {
      const target = parseFloat(targetNetWorth) || 0;
      const current = parseFloat(currentNetWorth) || 0;
      const m = parseFloat(months) || 1;
      const gap = target - current;
      const monthly = gap / m;
      setResult({
        results: [
          { label: "Monthly Savings Needed", value: fmtCurrency(monthly, s), highlight: true },
          { label: "Gap to Fill", value: fmtCurrency(gap, s) },
          { label: "Target Net Worth", value: fmtCurrency(target, s) },
          { label: "Current Net Worth", value: fmtCurrency(current, s) },
          { label: "Timeline", value: `${fmt(m, 0)} months` },
        ],
        steps: [
          `Gap = Target − Current = ${fmtCurrency(target, s)} − ${fmtCurrency(current, s)} = ${fmtCurrency(gap, s)}`,
          `Monthly Savings = Gap ÷ Months`,
          `= ${fmtCurrency(gap, s)} ÷ ${m} = ${fmtCurrency(monthly, s)} / month`,
        ],
      });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Net Worth Calculator" icon={DollarSign} iconColor="bg-cyan-600">
        <ModeToggle modes={[
          { id: "calculate", label: "Calculate Net Worth" },
          { id: "target", label: "Target Net Worth" },
          { id: "reverse", label: "Monthly Savings Needed" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <CurrencySelect value={cur.code} onChange={cur.setCode} />
          {mode === "calculate" && (
            <>
              <FormulaBox text="Net Worth = Total Assets − Total Liabilities" />
              <p className="text-xs font-bold text-muted-foreground uppercase">Assets</p>
              <Input label="Cash & Bank Savings" value={cash} onChange={setCash} placeholder="200000" suffix={cur.sym} />
              <Input label="Investments (Stocks/MF/FD)" value={investments} onChange={setInvestments} placeholder="500000" suffix={cur.sym} />
              <Input label="Real Estate Value" value={realEstate} onChange={setRealEstate} placeholder="3000000" suffix={cur.sym} />
              <Input label="Vehicle Value" value={vehicle} onChange={setVehicle} placeholder="400000" suffix={cur.sym} />
              <Input label="Other Assets" value={otherAssets} onChange={setOtherAssets} placeholder="0" suffix={cur.sym} />
              <p className="text-xs font-bold text-muted-foreground uppercase pt-2">Liabilities</p>
              <Input label="Loans (Home/Car/Personal)" value={loans} onChange={setLoans} placeholder="1500000" suffix={cur.sym} />
              <Input label="Credit Card Outstanding" value={creditCard} onChange={setCreditCard} placeholder="50000" suffix={cur.sym} />
              <Input label="Other Liabilities" value={otherLiabilities} onChange={setOtherLiabilities} placeholder="0" suffix={cur.sym} />
            </>
          )}
          {mode === "target" && (
            <>
              <FormulaBox text="Target Net Worth = (Age × Annual Income) ÷ 10" />
              <Input label="Your Age" value={age} onChange={setAge} placeholder="30" suffix="yrs" />
              <Input label="Annual Income" value={annualIncome} onChange={setAnnualIncome} placeholder="800000" suffix={cur.sym} />
            </>
          )}
          {mode === "reverse" && (
            <>
              <FormulaBox text="Monthly Savings = (Target − Current) ÷ Months" />
              <Input label="Target Net Worth" value={targetNetWorth} onChange={setTargetNetWorth} placeholder="10000000" suffix={cur.sym} />
              <Input label="Current Net Worth" value={currentNetWorth} onChange={setCurrentNetWorth} placeholder="2000000" suffix={cur.sym} />
              <Input label="Timeline (months)" value={months} onChange={setMonths} placeholder="60" suffix="mo" />
            </>
          )}
          <CalcButton onClick={calculate} />
        </div>
        {result && <div className="mt-4 space-y-3"><Steps steps={result.steps} /><Results results={result.results} /></div>}
      </ToolCard>
    </div>
  );
}

/* ─────────────────── 4. UNEMPLOYMENT RATE CALCULATOR ──────────────────── */
function UnemploymentCalculator() {
  const [mode, setMode] = useState("rate");
  const [employed, setEmployed] = useState("");
  const [unemployed, setUnemployed] = useState("");
  const [rate, setRate] = useState("5");
  const [laborForce, setLaborForce] = useState("");
  const [result, setResult] = useState<{ results: { label: string; value: string; highlight?: boolean }[]; steps: string[] } | null>(null);

  const calculate = () => {
    if (mode === "rate") {
      const e = parseFloat(employed) || 0;
      const u = parseFloat(unemployed) || 0;
      const lf = e + u;
      if (!lf) return;
      const r = (u / lf) * 100;
      const employment_rate = (e / lf) * 100;
      setResult({
        results: [
          { label: "Unemployment Rate", value: `${fmt(r, 2)}%`, highlight: true },
          { label: "Employment Rate", value: `${fmt(employment_rate, 2)}%` },
          { label: "Labor Force", value: fmt(lf, 0) },
          { label: "Employed", value: fmt(e, 0) },
          { label: "Unemployed", value: fmt(u, 0) },
        ],
        steps: [
          `Labor Force = Employed + Unemployed = ${fmt(e, 0)} + ${fmt(u, 0)} = ${fmt(lf, 0)}`,
          `Unemployment Rate = (Unemployed / Labor Force) × 100`,
          `= (${fmt(u, 0)} / ${fmt(lf, 0)}) × 100`,
          `= ${fmt(r, 2)}%`,
        ],
      });
    } else if (mode === "reverse") {
      const r = parseFloat(rate) / 100 || 0;
      const lf = parseFloat(laborForce) || 0;
      if (!lf || !r) return;
      const u = lf * r;
      const e = lf - u;
      setResult({
        results: [
          { label: "Unemployed People", value: fmt(u, 0), highlight: true },
          { label: "Employed People", value: fmt(e, 0) },
          { label: "Labor Force", value: fmt(lf, 0) },
          { label: "Unemployment Rate", value: `${rate}%` },
        ],
        steps: [
          `Unemployed = Labor Force × Rate`,
          `= ${fmt(lf, 0)} × ${rate}%`,
          `= ${fmt(u, 0)} people`,
          `Employed = ${fmt(lf, 0)} − ${fmt(u, 0)} = ${fmt(e, 0)}`,
        ],
      });
    } else if (mode === "natural") {
      const e = parseFloat(employed) || 0;
      const u = parseFloat(unemployed) || 0;
      const lf = e + u;
      const r = (u / lf) * 100;
      const frictional = r * 0.4;
      const structural = r * 0.35;
      const cyclical = r * 0.25;
      setResult({
        results: [
          { label: "Overall Unemployment Rate", value: `${fmt(r, 2)}%`, highlight: true },
          { label: "Frictional Unemployment (~40%)", value: `${fmt(frictional, 2)}%` },
          { label: "Structural Unemployment (~35%)", value: `${fmt(structural, 2)}%` },
          { label: "Cyclical Unemployment (~25%)", value: `${fmt(cyclical, 2)}%` },
          { label: "Natural Rate (Frictional + Structural)", value: `${fmt(frictional + structural, 2)}%` },
        ],
        steps: [
          `Total Rate = ${fmt(r, 2)}%`,
          `Frictional (job seekers between jobs) ≈ ${fmt(frictional, 2)}%`,
          `Structural (skills mismatch) ≈ ${fmt(structural, 2)}%`,
          `Cyclical (economic downturn) ≈ ${fmt(cyclical, 2)}%`,
          `Natural Rate = Frictional + Structural ≈ ${fmt(frictional + structural, 2)}%`,
        ],
      });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Unemployment Rate Calculator" icon={Users} iconColor="bg-cyan-600">
        <ModeToggle modes={[
          { id: "rate", label: "Calculate Rate" },
          { id: "reverse", label: "Find Unemployed" },
          { id: "natural", label: "Natural Rate" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          {(mode === "rate" || mode === "natural") && (
            <>
              <FormulaBox text="Rate = (Unemployed / Labor Force) × 100" />
              <Input label="Number of Employed People" value={employed} onChange={setEmployed} placeholder="450000000" />
              <Input label="Number of Unemployed People" value={unemployed} onChange={setUnemployed} placeholder="25000000" />
            </>
          )}
          {mode === "reverse" && (
            <>
              <FormulaBox text="Unemployed = Labor Force × Rate / 100" />
              <Input label="Total Labor Force" value={laborForce} onChange={setLaborForce} placeholder="500000000" />
              <Input label="Unemployment Rate" value={rate} onChange={setRate} placeholder="5" suffix="%" />
            </>
          )}
          <CalcButton onClick={calculate} />
        </div>
        {result && <div className="mt-4 space-y-3"><Steps steps={result.steps} /><Results results={result.results} /></div>}
      </ToolCard>
    </div>
  );
}

/* ─────────────────── 5. EMPLOYMENT GROWTH TOOL ────────────────────────── */
function EmploymentGrowthTool() {
  const [mode, setMode] = useState("growth");
  const [oldJobs, setOldJobs] = useState("");
  const [newJobs, setNewJobs] = useState("");
  const [currentJobs, setCurrentJobs] = useState("");
  const [targetGrowth, setTargetGrowth] = useState("10");
  const [result, setResult] = useState<{ results: { label: string; value: string; highlight?: boolean }[]; steps: string[] } | null>(null);

  const calculate = () => {
    if (mode === "growth") {
      const o = parseFloat(oldJobs) || 0;
      const n = parseFloat(newJobs) || 0;
      if (!o) return;
      const g = ((n - o) / o) * 100;
      const diff = n - o;
      setResult({
        results: [
          { label: "Employment Growth Rate", value: `${fmt(g, 2)}%`, highlight: true },
          { label: diff >= 0 ? "Jobs Created" : "Jobs Lost", value: fmt(Math.abs(diff), 0) },
          { label: "Previous Employment", value: fmt(o, 0) },
          { label: "Current Employment", value: fmt(n, 0) },
        ],
        steps: [
          `Growth Rate = ((New − Old) / Old) × 100`,
          `= ((${fmt(n, 0)} − ${fmt(o, 0)}) / ${fmt(o, 0)}) × 100`,
          `= (${fmt(diff, 0)} / ${fmt(o, 0)}) × 100`,
          `= ${fmt(g, 2)}%`,
        ],
      });
    } else if (mode === "reverse") {
      const curr = parseFloat(currentJobs) || 0;
      const g = parseFloat(targetGrowth) / 100 || 0;
      const needed = Math.round(curr * (1 + g));
      const newJ = needed - curr;
      setResult({
        results: [
          { label: "Target Employment", value: fmt(needed, 0), highlight: true },
          { label: "New Jobs to Create", value: fmt(newJ, 0) },
          { label: "Current Jobs", value: fmt(curr, 0) },
          { label: "Target Growth Rate", value: `${targetGrowth}%` },
        ],
        steps: [
          `Target = Current × (1 + Growth Rate)`,
          `= ${fmt(curr, 0)} × (1 + ${targetGrowth}%)`,
          `= ${fmt(curr, 0)} × ${fmt(1 + parseFloat(targetGrowth) / 100, 4)}`,
          `= ${fmt(needed, 0)}`,
          `New jobs needed: ${fmt(needed, 0)} − ${fmt(curr, 0)} = ${fmt(newJ, 0)}`,
        ],
      });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Employment Growth Tool" icon={UserCheck} iconColor="bg-cyan-600">
        <ModeToggle modes={[
          { id: "growth", label: "Growth Rate" },
          { id: "reverse", label: "Jobs Needed (Reverse)" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          {mode === "growth" && (
            <>
              <FormulaBox text="Growth = ((New − Old) / Old) × 100" />
              <Input label="Previous Period Employment" value={oldJobs} onChange={setOldJobs} placeholder="450000000" />
              <Input label="Current Period Employment" value={newJobs} onChange={setNewJobs} placeholder="465000000" />
            </>
          )}
          {mode === "reverse" && (
            <>
              <FormulaBox text="Target Jobs = Current × (1 + Growth%)" />
              <Input label="Current Employment" value={currentJobs} onChange={setCurrentJobs} placeholder="450000000" />
              <Input label="Target Growth Rate %" value={targetGrowth} onChange={setTargetGrowth} placeholder="10" suffix="%" />
            </>
          )}
          <CalcButton onClick={calculate} />
        </div>
        {result && <div className="mt-4 space-y-3"><Steps steps={result.steps} /><Results results={result.results} /></div>}
      </ToolCard>
    </div>
  );
}

/* ─────────────────── 6. PRODUCTIVITY CALCULATOR ───────────────────────── */
function ProductivityCalculator() {
  const [mode, setMode] = useState("labor");
  const cur = useCurrency("INR");
  const [output, setOutput] = useState("");
  const [hours, setHours] = useState("");
  const [workers, setWorkers] = useState("");
  const [capital, setCapital] = useState("");
  const [targetProductivity, setTargetProductivity] = useState("");
  const [result, setResult] = useState<{ results: { label: string; value: string; highlight?: boolean }[]; steps: string[] } | null>(null);

  const calculate = () => {
    const s = cur.sym;
    if (mode === "labor") {
      const o = parseFloat(output) || 0;
      const h = parseFloat(hours) || 0;
      const w = parseFloat(workers) || 0;
      const totalHours = h * (w || 1);
      const productivity = o / (totalHours || 1);
      setResult({
        results: [
          { label: "Labor Productivity", value: `${s}${fmt(productivity, 2)} / hour`, highlight: true },
          { label: "Total Output", value: fmtCurrency(o, s) },
          { label: "Total Hours Worked", value: fmt(totalHours, 0) },
          { label: `Per Worker (${fmt(h, 0)} hrs)`, value: `${s}${fmt(o / (w || 1), 2)}` },
        ],
        steps: [
          `Labor Productivity = Output ÷ Total Labor Hours`,
          `Total Hours = ${fmt(h, 0)} hrs × ${fmt(w || 1, 0)} workers = ${fmt(totalHours, 0)} hrs`,
          `= ${fmtCurrency(o, s)} ÷ ${fmt(totalHours, 0)} hours`,
          `= ${s}${fmt(productivity, 2)} per hour`,
        ],
      });
    } else if (mode === "capital") {
      const o = parseFloat(output) || 0;
      const c = parseFloat(capital) || 0;
      if (!c) return;
      const cp = o / c;
      setResult({
        results: [
          { label: "Capital Productivity", value: `${fmt(cp, 4)} (output per unit capital)`, highlight: true },
          { label: "Output", value: fmtCurrency(o, s) },
          { label: "Capital Invested", value: fmtCurrency(c, s) },
          { label: "Capital Efficiency", value: `${fmt(cp * 100, 2)}%` },
        ],
        steps: [
          `Capital Productivity = Output ÷ Capital`,
          `= ${fmtCurrency(o, s)} ÷ ${fmtCurrency(c, s)}`,
          `= ${fmt(cp, 4)}`,
        ],
      });
    } else if (mode === "reverse") {
      const target = parseFloat(targetProductivity) || 0;
      const h = parseFloat(hours) || 0;
      const w = parseFloat(workers) || 0;
      const totalHours = h * (w || 1);
      const requiredOutput = target * totalHours;
      setResult({
        results: [
          { label: "Required Output", value: fmtCurrency(requiredOutput, s), highlight: true },
          { label: "Target Productivity", value: `${s}${target} / hr` },
          { label: "Total Labor Hours", value: fmt(totalHours, 0) },
          { label: "Per Worker Output", value: fmtCurrency(requiredOutput / (w || 1), s) },
        ],
        steps: [
          `Required Output = Target Productivity × Total Hours`,
          `= ${s}${target}/hr × ${fmt(totalHours, 0)} hrs`,
          `= ${fmtCurrency(requiredOutput, s)}`,
        ],
      });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Productivity Calculator" icon={Zap} iconColor="bg-cyan-600">
        <ModeToggle modes={[
          { id: "labor", label: "Labor Productivity" },
          { id: "capital", label: "Capital Productivity" },
          { id: "reverse", label: "Required Output (Reverse)" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <CurrencySelect value={cur.code} onChange={cur.setCode} />
          {(mode === "labor" || mode === "reverse") && (
            <>
              {mode === "labor" && <FormulaBox text="Productivity = Output ÷ (Workers × Hours)" />}
              {mode === "reverse" && <FormulaBox text="Required Output = Target Productivity × Total Hours" />}
              {mode === "labor" && <Input label="Total Output Value" value={output} onChange={setOutput} placeholder="1000000" suffix={cur.sym} />}
              <Input label="Hours Worked per Worker" value={hours} onChange={setHours} placeholder="160" suffix="hrs" />
              <Input label="Number of Workers" value={workers} onChange={setWorkers} placeholder="100" />
              {mode === "reverse" && <Input label="Target Productivity (per hr)" value={targetProductivity} onChange={setTargetProductivity} placeholder="500" suffix={cur.sym} />}
            </>
          )}
          {mode === "capital" && (
            <>
              <FormulaBox text="Capital Productivity = Output ÷ Capital Invested" />
              <Input label="Total Output Value" value={output} onChange={setOutput} placeholder="2000000" suffix={cur.sym} />
              <Input label="Capital Invested" value={capital} onChange={setCapital} placeholder="1000000" suffix={cur.sym} />
            </>
          )}
          <CalcButton onClick={calculate} />
        </div>
        {result && <div className="mt-4 space-y-3"><Steps steps={result.steps} /><Results results={result.results} /></div>}
      </ToolCard>
    </div>
  );
}

/* ─────────────────── 7. TARIFF IMPACT CALCULATOR ──────────────────────── */
function TariffCalculator() {
  const [mode, setMode] = useState("cost");
  const cur = useCurrency("INR");
  const [importValue, setImportValue] = useState("");
  const [tariffRate, setTariffRate] = useState("10");
  const [quantity, setQuantity] = useState("");
  const [postTariffPrice, setPostTariffPrice] = useState("");
  const [result, setResult] = useState<{ results: { label: string; value: string; highlight?: boolean }[]; steps: string[] } | null>(null);

  const calculate = () => {
    const s = cur.sym;
    if (mode === "cost") {
      const v = parseFloat(importValue) || 0;
      const r = parseFloat(tariffRate) / 100 || 0;
      const q = parseFloat(quantity) || 1;
      const tariffCost = v * r;
      const totalCost = v + tariffCost;
      const totalAll = totalCost * q;
      setResult({
        results: [
          { label: "Price after Tariff (per unit)", value: fmtCurrency(totalCost, s), highlight: true },
          { label: "Tariff Amount (per unit)", value: fmtCurrency(tariffCost, s) },
          { label: "Original Import Price", value: fmtCurrency(v, s) },
          { label: "Tariff Rate", value: `${tariffRate}%` },
          ...(q > 1 ? [{ label: `Total Cost (×${fmt(q, 0)} units)`, value: fmtCurrency(totalAll, s) }] : []),
        ],
        steps: [
          `Tariff Amount = Import Value × Tariff Rate`,
          `= ${fmtCurrency(v, s)} × ${tariffRate}% = ${fmtCurrency(tariffCost, s)}`,
          `Price after Tariff = ${fmtCurrency(v, s)} + ${fmtCurrency(tariffCost, s)} = ${fmtCurrency(totalCost, s)}`,
          ...(q > 1 ? [`Total for ${fmt(q, 0)} units = ${fmtCurrency(totalCost, s)} × ${q} = ${fmtCurrency(totalAll, s)}`] : []),
        ],
      });
    } else if (mode === "revenue") {
      const v = parseFloat(importValue) || 0;
      const r = parseFloat(tariffRate) / 100 || 0;
      const q = parseFloat(quantity) || 1;
      const revenuePerUnit = v * r;
      const totalRevenue = revenuePerUnit * q;
      setResult({
        results: [
          { label: "Govt Revenue per Unit", value: fmtCurrency(revenuePerUnit, s), highlight: true },
          { label: `Total Govt Revenue (${fmt(q, 0)} units)`, value: fmtCurrency(totalRevenue, s) },
          { label: "Import Value per Unit", value: fmtCurrency(v, s) },
          { label: "Tariff Rate", value: `${tariffRate}%` },
        ],
        steps: [
          `Revenue per unit = Import Value × Tariff Rate`,
          `= ${fmtCurrency(v, s)} × ${tariffRate}% = ${fmtCurrency(revenuePerUnit, s)}`,
          `Total Revenue = ${fmtCurrency(revenuePerUnit, s)} × ${fmt(q, 0)} = ${fmtCurrency(totalRevenue, s)}`,
        ],
      });
    } else if (mode === "reverse") {
      const post = parseFloat(postTariffPrice) || 0;
      const r = parseFloat(tariffRate) / 100 || 0;
      const original = post / (1 + r);
      const tariffPaid = post - original;
      setResult({
        results: [
          { label: "Original Import Price", value: fmtCurrency(original, s), highlight: true },
          { label: "Tariff Paid", value: fmtCurrency(tariffPaid, s) },
          { label: "Post-Tariff Price", value: fmtCurrency(post, s) },
          { label: "Tariff Rate", value: `${tariffRate}%` },
        ],
        steps: [
          `Post-Tariff Price = Original × (1 + Rate)`,
          `Original = Post-Tariff Price ÷ (1 + Rate)`,
          `= ${fmtCurrency(post, s)} ÷ (1 + ${tariffRate}%)`,
          `= ${fmtCurrency(post, s)} ÷ ${fmt(1 + r, 4)}`,
          `= ${fmtCurrency(original, s)}`,
          `Tariff Paid = ${fmtCurrency(post, s)} − ${fmtCurrency(original, s)} = ${fmtCurrency(tariffPaid, s)}`,
        ],
      });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Tariff Impact Calculator" icon={Package} iconColor="bg-cyan-600">
        <ModeToggle modes={[
          { id: "cost", label: "Price after Tariff" },
          { id: "revenue", label: "Govt Revenue" },
          { id: "reverse", label: "Original Price (Reverse)" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <CurrencySelect value={cur.code} onChange={cur.setCode} />
          {(mode === "cost" || mode === "revenue") && (
            <>
              <FormulaBox text={mode === "cost" ? "Post-Tariff Price = Price × (1 + Tariff%)" : "Govt Revenue = Import Value × Tariff Rate × Quantity"} />
              <Input label="Import Value / Price per Unit" value={importValue} onChange={setImportValue} placeholder="1000" suffix={cur.sym} />
              <Input label="Tariff Rate %" value={tariffRate} onChange={setTariffRate} placeholder="10" suffix="%" />
              <Input label="Quantity (optional)" value={quantity} onChange={setQuantity} placeholder="1" />
            </>
          )}
          {mode === "reverse" && (
            <>
              <FormulaBox text="Original Price = Post-Tariff Price ÷ (1 + Tariff%)" />
              <Input label="Post-Tariff Price" value={postTariffPrice} onChange={setPostTariffPrice} placeholder="1100" suffix={cur.sym} />
              <Input label="Tariff Rate %" value={tariffRate} onChange={setTariffRate} placeholder="10" suffix="%" />
            </>
          )}
          <CalcButton onClick={calculate} />
        </div>
        {result && <div className="mt-4 space-y-3"><Steps steps={result.steps} /><Results results={result.results} /></div>}
      </ToolCard>
    </div>
  );
}

/* ─────────────────── 8. PER PERSON INCOME CALCULATOR ──────────────────── */
function PerPersonIncomeCalculator() {
  const [mode, setMode] = useState("calculate");
  const cur = useCurrency("INR");
  const [totalIncome, setTotalIncome] = useState("");
  const [population, setPopulation] = useState("");
  const [perPersonIncome, setPerPersonIncome] = useState("");
  const [result, setResult] = useState<{ results: { label: string; value: string; highlight?: boolean }[]; steps: string[] } | null>(null);

  const calculate = () => {
    const s = cur.sym;
    if (mode === "calculate") {
      const total = parseFloat(totalIncome) || 0;
      const pop = parseFloat(population) || 0;
      if (!total || !pop) return;
      const perPerson = total / pop;
      const monthly = perPerson / 12;
      const daily = perPerson / 365;
      setResult({
        results: [
          { label: "Per Person Income (Annual)", value: fmtCurrency(perPerson, s), highlight: true },
          { label: "Per Person Income (Monthly)", value: fmtCurrency(monthly, s) },
          { label: "Per Person Income (Daily)", value: fmtCurrency(daily, s) },
          { label: "Total Income", value: fmtCurrency(total, s) },
          { label: "Population", value: fmt(pop, 0) },
        ],
        steps: [
          `Per Person Income = Total Income ÷ Population`,
          `= ${fmtCurrency(total, s)} ÷ ${fmt(pop, 0)}`,
          `= ${fmtCurrency(perPerson, s)} per year`,
          `Monthly = ${fmtCurrency(perPerson, s)} ÷ 12 = ${fmtCurrency(monthly, s)}`,
          `Daily = ${fmtCurrency(perPerson, s)} ÷ 365 = ${fmtCurrency(daily, s)}`,
        ],
      });
    } else if (mode === "reverse") {
      const ppi = parseFloat(perPersonIncome) || 0;
      const pop = parseFloat(population) || 0;
      if (!ppi || !pop) return;
      const total = ppi * pop;
      setResult({
        results: [
          { label: "Total Income Required", value: fmtCurrency(total, s), highlight: true },
          { label: "Per Person Target", value: fmtCurrency(ppi, s) },
          { label: "Population", value: fmt(pop, 0) },
          { label: "Monthly Total", value: fmtCurrency(total / 12, s) },
        ],
        steps: [
          `Total Income = Per Person Income × Population`,
          `= ${fmtCurrency(ppi, s)} × ${fmt(pop, 0)}`,
          `= ${fmtCurrency(total, s)}`,
        ],
      });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Per Person Income Calculator" icon={Briefcase} iconColor="bg-cyan-600">
        <ModeToggle modes={[
          { id: "calculate", label: "Calculate Per Person" },
          { id: "reverse", label: "Find Total Income (Reverse)" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <CurrencySelect value={cur.code} onChange={cur.setCode} />
          {mode === "calculate" && (
            <>
              <FormulaBox text="Per Person Income = Total Income ÷ Population" />
              <Input label="Total National / Regional Income" value={totalIncome} onChange={setTotalIncome} placeholder="300000000000000" suffix={cur.sym} />
              <Input label="Population" value={population} onChange={setPopulation} placeholder="1400000000" />
            </>
          )}
          {mode === "reverse" && (
            <>
              <FormulaBox text="Total Income = Per Person Income × Population" />
              <Input label="Target Per Person Income" value={perPersonIncome} onChange={setPerPersonIncome} placeholder="200000" suffix={cur.sym} />
              <Input label="Population" value={population} onChange={setPopulation} placeholder="1400000000" />
            </>
          )}
          <CalcButton onClick={calculate} />
        </div>
        {result && <div className="mt-4 space-y-3"><Steps steps={result.steps} /><Results results={result.results} /></div>}
      </ToolCard>
    </div>
  );
}

/* ─────────────────── 9. PER CAPITA INCOME TOOL ────────────────────────── */
function PerCapitaIncomeTool() {
  const [mode, setMode] = useState("calculate");
  const cur = useCurrency("INR");
  const [gdp, setGdp] = useState("");
  const [population, setPopulation] = useState("");
  const [pci, setPci] = useState("");
  const [result, setResult] = useState<{ results: { label: string; value: string; highlight?: boolean }[]; steps: string[] } | null>(null);

  const globalBenchmarks = [
    { country: "India (2024)", pci: 250000, curr: "₹" },
    { country: "USA (2024)", pci: 80000, curr: "$" },
    { country: "China", pci: 14000, curr: "$" },
    { country: "Global Average", pci: 13000, curr: "$" },
  ];

  const calculate = () => {
    const s = cur.sym;
    if (mode === "calculate") {
      const g = parseFloat(gdp) || 0;
      const pop = parseFloat(population) || 0;
      if (!g || !pop) return;
      const pcIncome = g / pop;
      setResult({
        results: [
          { label: "Per Capita Income", value: fmtCurrency(pcIncome, s), highlight: true },
          { label: "GDP", value: fmtCurrency(g, s) },
          { label: "Population", value: fmt(pop, 0) },
          { label: "Monthly Per Capita", value: fmtCurrency(pcIncome / 12, s) },
          { label: "Daily Per Capita", value: fmtCurrency(pcIncome / 365, s) },
        ],
        steps: [
          `Per Capita Income = GDP ÷ Population`,
          `= ${fmtCurrency(g, s)} ÷ ${fmt(pop, 0)}`,
          `= ${fmtCurrency(pcIncome, s)} per year`,
          `Monthly = ${fmtCurrency(pcIncome / 12, s)}`,
        ],
      });
    } else if (mode === "reverse") {
      const pc = parseFloat(pci) || 0;
      const pop = parseFloat(population) || 0;
      if (!pc || !pop) return;
      const totalGDP = pc * pop;
      setResult({
        results: [
          { label: "Implied GDP", value: fmtCurrency(totalGDP, s), highlight: true },
          { label: "Per Capita Income", value: fmtCurrency(pc, s) },
          { label: "Population", value: fmt(pop, 0) },
        ],
        steps: [
          `GDP = Per Capita Income × Population`,
          `= ${fmtCurrency(pc, s)} × ${fmt(pop, 0)}`,
          `= ${fmtCurrency(totalGDP, s)}`,
        ],
      });
    } else if (mode === "compare") {
      return setResult({
        results: globalBenchmarks.map(b => ({
          label: b.country,
          value: `${b.curr}${fmt(b.pci, 0)} / year`,
        })),
        steps: [
          "Benchmark data for approximate reference (nominal, 2024)",
          "India: ~₹2.5L/year (~$3,000 USD)",
          "USA: ~$80,000/year",
          "Global Average: ~$13,000/year",
        ],
      });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Per Capita Income Tool" icon={Activity} iconColor="bg-cyan-600">
        <ModeToggle modes={[
          { id: "calculate", label: "Calculate PCI" },
          { id: "reverse", label: "Find GDP (Reverse)" },
          { id: "compare", label: "Global Benchmarks" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <CurrencySelect value={cur.code} onChange={cur.setCode} />
          {mode === "calculate" && (
            <>
              <FormulaBox text="Per Capita Income = GDP ÷ Population" />
              <Input label="GDP (Gross Domestic Product)" value={gdp} onChange={setGdp} placeholder="300000000000000" suffix={cur.sym} />
              <Input label="Population" value={population} onChange={setPopulation} placeholder="1400000000" />
            </>
          )}
          {mode === "reverse" && (
            <>
              <FormulaBox text="GDP = Per Capita Income × Population" />
              <Input label="Target Per Capita Income" value={pci} onChange={setPci} placeholder="250000" suffix={cur.sym} />
              <Input label="Population" value={population} onChange={setPopulation} placeholder="1400000000" />
            </>
          )}
          {mode === "compare" && (
            <p className="text-xs text-muted-foreground">Click Calculate to see global per capita income benchmarks.</p>
          )}
          <CalcButton onClick={calculate} />
        </div>
        {result && <div className="mt-4 space-y-3"><Steps steps={result.steps} /><Results results={result.results} /></div>}
      </ToolCard>
    </div>
  );
}

/* ─────────────────── 10. INFLATION IMPACT CALCULATOR ──────────────────── */
function InflationImpactCalculator() {
  const [mode, setMode] = useState("future");
  const cur = useCurrency("INR");
  const [presentValue, setPresentValue] = useState("");
  const [inflationRate, setInflationRate] = useState("6");
  const [years, setYears] = useState("10");
  const [futureValue, setFutureValue] = useState("");
  const [price1, setPrice1] = useState("");
  const [price2, setPrice2] = useState("");
  const [currentSalary, setCurrentSalary] = useState("");
  const [result, setResult] = useState<{ results: { label: string; value: string; highlight?: boolean }[]; steps: string[] } | null>(null);

  const calculate = () => {
    const s = cur.sym;
    const r = parseFloat(inflationRate) / 100 || 0;
    const y = parseFloat(years) || 0;

    if (mode === "future") {
      const pv = parseFloat(presentValue) || 0;
      if (!pv) return;
      const fv = pv * Math.pow(1 + r, y);
      const purchasing = pv / Math.pow(1 + r, y);
      setResult({
        results: [
          { label: `Cost in ${y} years`, value: fmtCurrency(fv, s), highlight: true },
          { label: "Today's Value", value: fmtCurrency(pv, s) },
          { label: `Purchasing Power of ${s}${fmt(pv)} today (in ${y}y)`, value: fmtCurrency(purchasing, s) },
          { label: "Value Lost to Inflation", value: fmtCurrency(fv - pv, s) },
          { label: "Inflation Rate", value: `${inflationRate}%/yr` },
        ],
        steps: [
          `Future Cost = Present Value × (1 + Inflation Rate)^Years`,
          `= ${fmtCurrency(pv, s)} × (1 + ${inflationRate}%)^${y}`,
          `= ${fmtCurrency(pv, s)} × ${fmt(Math.pow(1 + r, y), 4)}`,
          `= ${fmtCurrency(fv, s)}`,
          `Purchasing power erosion: ${fmt(((fv - pv) / pv) * 100, 1)}% increase in price`,
        ],
      });
    } else if (mode === "real") {
      const fv = parseFloat(futureValue) || 0;
      if (!fv) return;
      const pv = fv / Math.pow(1 + r, y);
      setResult({
        results: [
          { label: "Real Value Today", value: fmtCurrency(pv, s), highlight: true },
          { label: "Nominal Future Amount", value: fmtCurrency(fv, s) },
          { label: "Inflation Rate", value: `${inflationRate}%/yr` },
          { label: "Years", value: fmt(y, 0) },
          { label: "Purchasing Power Lost", value: `${fmt(((fv - pv) / fv) * 100, 1)}%` },
        ],
        steps: [
          `Real Value = Future Amount ÷ (1 + Inflation)^Years`,
          `= ${fmtCurrency(fv, s)} ÷ (1 + ${inflationRate}%)^${y}`,
          `= ${fmtCurrency(fv, s)} ÷ ${fmt(Math.pow(1 + r, y), 4)}`,
          `= ${fmtCurrency(pv, s)}`,
        ],
      });
    } else if (mode === "rate") {
      const p1 = parseFloat(price1) || 0;
      const p2 = parseFloat(price2) || 0;
      if (!p1 || !p2) return;
      const rate = ((p2 - p1) / p1) * 100;
      const annualRate = y > 0 ? (Math.pow(p2 / p1, 1 / y) - 1) * 100 : rate;
      setResult({
        results: [
          { label: "Total Inflation Rate", value: `${fmt(rate, 2)}%`, highlight: true },
          { label: y > 0 ? `Annual Rate (CAGR over ${y}y)` : "Annual Rate", value: `${fmt(annualRate, 2)}%` },
          { label: "Old Price", value: fmtCurrency(p1, s) },
          { label: "New Price", value: fmtCurrency(p2, s) },
          { label: "Price Increase", value: fmtCurrency(p2 - p1, s) },
        ],
        steps: [
          `Inflation Rate = ((New Price − Old Price) / Old Price) × 100`,
          `= ((${fmtCurrency(p2, s)} − ${fmtCurrency(p1, s)}) / ${fmtCurrency(p1, s)}) × 100`,
          `= (${fmtCurrency(p2 - p1, s)} / ${fmtCurrency(p1, s)}) × 100`,
          `= ${fmt(rate, 2)}%`,
          ...(y > 0 ? [`Annual CAGR = (${fmt(p2, 2)}/${fmt(p1, 2)})^(1/${y}) − 1 = ${fmt(annualRate, 2)}%`] : []),
        ],
      });
    } else if (mode === "salary") {
      const sal = parseFloat(currentSalary) || 0;
      if (!sal) return;
      const neededSalary = sal * Math.pow(1 + r, y);
      const yearlyHike = ((Math.pow(1 + r, 1)) - 1) * 100;
      setResult({
        results: [
          { label: `Salary Needed in ${y} years`, value: fmtCurrency(neededSalary, s), highlight: true },
          { label: "Current Salary", value: fmtCurrency(sal, s) },
          { label: "Annual Raise Needed", value: `${fmt(yearlyHike, 2)}%` },
          { label: "Total Raise Amount", value: fmtCurrency(neededSalary - sal, s) },
          { label: "Inflation Rate", value: `${inflationRate}%/yr` },
        ],
        steps: [
          `To maintain purchasing power, salary must grow with inflation`,
          `Needed Salary = Current × (1 + Inflation)^Years`,
          `= ${fmtCurrency(sal, s)} × (1 + ${inflationRate}%)^${y}`,
          `= ${fmtCurrency(neededSalary, s)}`,
          `Minimum annual raise = ${fmt(yearlyHike, 2)}% per year`,
        ],
      });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Inflation Impact Calculator" icon={TrendingUp} iconColor="bg-cyan-600">
        <ModeToggle modes={[
          { id: "future", label: "Future Cost" },
          { id: "real", label: "Real Value (Reverse)" },
          { id: "rate", label: "Find Inflation Rate" },
          { id: "salary", label: "Salary Adjustment" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <CurrencySelect value={cur.code} onChange={cur.setCode} />
          {mode === "future" && (
            <>
              <FormulaBox text="Future Cost = Present × (1 + Inflation%)^Years" />
              <Input label="Present Value / Price" value={presentValue} onChange={setPresentValue} placeholder="100000" suffix={cur.sym} />
              <Input label="Inflation Rate %" value={inflationRate} onChange={setInflationRate} placeholder="6" suffix="%" />
              <Input label="Number of Years" value={years} onChange={setYears} placeholder="10" suffix="yrs" />
            </>
          )}
          {mode === "real" && (
            <>
              <FormulaBox text="Real Value = Future Amount ÷ (1 + Inflation%)^Years" />
              <Input label="Future Amount" value={futureValue} onChange={setFutureValue} placeholder="200000" suffix={cur.sym} />
              <Input label="Inflation Rate %" value={inflationRate} onChange={setInflationRate} placeholder="6" suffix="%" />
              <Input label="Number of Years" value={years} onChange={setYears} placeholder="10" suffix="yrs" />
            </>
          )}
          {mode === "rate" && (
            <>
              <FormulaBox text="Rate = ((New − Old) / Old) × 100" />
              <Input label="Old Price" value={price1} onChange={setPrice1} placeholder="50" suffix={cur.sym} />
              <Input label="New Price" value={price2} onChange={setPrice2} placeholder="75" suffix={cur.sym} />
              <Input label="Years between prices (optional)" value={years} onChange={setYears} placeholder="5" suffix="yrs" />
            </>
          )}
          {mode === "salary" && (
            <>
              <FormulaBox text="Required Salary = Current × (1 + Inflation%)^Years" />
              <Input label="Current Annual Salary" value={currentSalary} onChange={setCurrentSalary} placeholder="600000" suffix={cur.sym} />
              <Input label="Inflation Rate %" value={inflationRate} onChange={setInflationRate} placeholder="6" suffix="%" />
              <Input label="Years" value={years} onChange={setYears} placeholder="10" suffix="yrs" />
            </>
          )}
          <CalcButton onClick={calculate} />
        </div>
        {result && <div className="mt-4 space-y-3"><Steps steps={result.steps} /><Results results={result.results} /></div>}
      </ToolCard>
    </div>
  );
}
