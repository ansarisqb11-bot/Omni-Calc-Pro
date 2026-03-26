import { useState, useMemo } from "react";
import { BarChart3, TrendingDown, BookOpen, HeartPulse, Building2, Wifi, Zap } from "lucide-react";
import { DesktopToolGrid, InputPanel } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "hdi" | "poverty" | "literacy" | "health" | "infrastructure" | "digital" | "energy";

const tools = [
  { id: "hdi", label: "HDI", icon: BarChart3 },
  { id: "poverty", label: "Poverty", icon: TrendingDown },
  { id: "literacy", label: "Literacy", icon: BookOpen },
  { id: "health", label: "Health Index", icon: HeartPulse },
  { id: "infrastructure", label: "Infrastructure", icon: Building2 },
  { id: "digital", label: "Digital Economy", icon: Wifi },
  { id: "energy", label: "Energy / Capita", icon: Zap },
];

export default function DevelopmentTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("hdi");

  const renderTool = () => {
    switch (activeTool) {
      case "hdi": return <HDICalculator />;
      case "poverty": return <PovertyRate />;
      case "literacy": return <LiteracyRate />;
      case "health": return <HealthIndex />;
      case "infrastructure": return <InfrastructureIndex />;
      case "digital": return <DigitalEconomy />;
      case "energy": return <EnergyConsumption />;
      default: return null;
    }
  };

  return (
    <PageWrapper
      title="Development & Living Standards"
      subtitle="HDI, poverty, literacy, health & more"
      accentColor="bg-amber-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {renderTool()}
    </PageWrapper>
  );
}

function ModeToggle({ modes, mode, setMode }: { modes: { id: string; label: string }[]; mode: string; setMode: (m: string) => void }) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-xl mb-4 flex-wrap">
      {modes.map((m) => (
        <button key={m.id} onClick={() => setMode(m.id)} data-testid={`mode-${m.id}`}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${mode === m.id ? "bg-amber-500 text-white shadow-sm" : "text-muted-foreground"}`}>
          {m.label}
        </button>
      ))}
    </div>
  );
}

function SolverInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <input type="number" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        data-testid={`input-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
    </div>
  );
}

function SolverSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        data-testid={`select-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="w-full bg-muted border border-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function StepsDisplay({ steps }: { steps: string[] }) {
  if (steps.length === 0) return null;
  return (
    <div className="bg-muted/20 p-3 rounded-xl border border-border/50 space-y-1.5">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Step-by-step</p>
      {steps.map((s, i) => (
        <p key={i} className="text-xs text-foreground" data-testid={`step-${i + 1}`}>
          <span className="font-bold text-amber-500 mr-1">Step {i + 1}:</span> {s}
        </p>
      ))}
    </div>
  );
}

function MultiResult({ results }: { results: { label: string; value: string }[] }) {
  return (
    <div className="space-y-2">
      {results.map((r, i) => (
        <div key={i} className="flex justify-between items-center p-2.5 bg-muted/30 rounded-xl">
          <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
          <span className="text-sm font-bold text-amber-500" data-testid={`result-${i}`}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function fmt(n: number, d = 2): string {
  if (Number.isNaN(n) || !Number.isFinite(n)) return "\u2014";
  return parseFloat(n.toFixed(d)).toLocaleString();
}

function fmtPop(n: number): string {
  if (Number.isNaN(n) || !Number.isFinite(n)) return "\u2014";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e7) return `${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `${(n / 1e5).toFixed(2)} Lakh`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return fmt(n, 0);
}

function clamp01(v: number): number { return Math.max(0, Math.min(1, v)); }

function HDICalculator() {
  const [mode, setMode] = useState("full");
  const [lifeExp, setLifeExp] = useState("69.7");
  const [expSchool, setExpSchool] = useState("12.2");
  const [meanSchool, setMeanSchool] = useState("6.7");
  const [gniPerCapita, setGniPerCapita] = useState("6590");
  const [currency, setCurrency] = useState("usd");
  const convRate = currency === "inr" ? 83 : 1;

  const result = useMemo(() => {
    const le = parseFloat(lifeExp) || 0;
    const es = parseFloat(expSchool) || 0;
    const ms = parseFloat(meanSchool) || 0;
    const gniRaw = parseFloat(gniPerCapita) || 0;
    const gni = gniRaw / convRate;

    switch (mode) {
      case "full": {
        const leIndex = clamp01((le - 20) / (85 - 20));
        const esIndex = clamp01(es / 18);
        const msIndex = clamp01(ms / 15);
        const eduIndex = clamp01((esIndex + msIndex) / 2);
        const gniIndex = gni > 0 ? clamp01((Math.log(gni) - Math.log(100)) / (Math.log(75000) - Math.log(100))) : 0;
        const hdi = Math.pow(leIndex * eduIndex * gniIndex, 1 / 3);
        const category = hdi >= 0.8 ? "Very High" : hdi >= 0.7 ? "High" : hdi >= 0.55 ? "Medium" : "Low";
        return {
          results: [
            { label: "HDI Value", value: fmt(hdi, 3) },
            { label: "Category", value: category },
            { label: "Life Exp. Index", value: fmt(leIndex, 3) },
            { label: "Education Index", value: fmt(eduIndex, 3) },
            { label: "Income Index", value: fmt(gniIndex, 3) },
          ],
          steps: [
            `Life Expectancy = ${le} years`,
            `Life Exp. Index = (${le} - 20) / (85 - 20) = ${fmt(leIndex, 4)}`,
            `Expected Schooling Index = ${es} / 18 = ${fmt(esIndex, 4)}`,
            `Mean Schooling Index = ${ms} / 15 = ${fmt(msIndex, 4)}`,
            `Education Index = (${fmt(esIndex, 4)} + ${fmt(msIndex, 4)}) / 2 = ${fmt(eduIndex, 4)}`,
            `GNI per capita (PPP $) = $${fmt(gni, 0)}`,
            `Income Index = (ln(${fmt(gni, 0)}) - ln(100)) / (ln(75000) - ln(100)) = ${fmt(gniIndex, 4)}`,
            `HDI = (${fmt(leIndex, 4)} \u00D7 ${fmt(eduIndex, 4)} \u00D7 ${fmt(gniIndex, 4)})^(1/3) = ${fmt(hdi, 3)}`,
            `Category: ${category} (>0.8 Very High, 0.7-0.8 High, 0.55-0.7 Medium, <0.55 Low)`,
          ],
        };
      }
      case "compare": {
        const leIndex = clamp01((le - 20) / (85 - 20));
        const esIndex = clamp01(es / 18);
        const msIndex = clamp01(ms / 15);
        const eduIndex = clamp01((esIndex + msIndex) / 2);
        const gniIndex = gni > 0 ? clamp01((Math.log(gni) - Math.log(100)) / (Math.log(75000) - Math.log(100))) : 0;
        const hdi = Math.pow(leIndex * eduIndex * gniIndex, 1 / 3);

        const benchmarks = [
          { name: "Norway", hdi: 0.961 }, { name: "Switzerland", hdi: 0.962 },
          { name: "USA", hdi: 0.921 }, { name: "China", hdi: 0.768 },
          { name: "India", hdi: 0.644 }, { name: "Bangladesh", hdi: 0.614 },
          { name: "World Average", hdi: 0.732 },
        ];
        const closest = benchmarks.reduce((a, b) => Math.abs(b.hdi - hdi) < Math.abs(a.hdi - hdi) ? b : a);
        return {
          results: [
            { label: "Your HDI", value: fmt(hdi, 3) },
            { label: "Closest Country", value: `${closest.name} (${closest.hdi})` },
            { label: "vs World Average", value: `${hdi > 0.732 ? "+" : ""}${fmt((hdi - 0.732) * 1000, 1)} points` },
            ...benchmarks.map(b => ({ label: b.name, value: `${b.hdi}` })),
          ],
          steps: [
            `Calculated HDI = ${fmt(hdi, 3)}`,
            `Closest benchmark: ${closest.name} (${closest.hdi})`,
            `Difference from world average (0.732): ${fmt((hdi - 0.732), 3)}`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, lifeExp, expSchool, meanSchool, gniPerCapita, currency, convRate]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="HDI Calculator" icon={BarChart3} iconColor="bg-amber-500">
        <ModeToggle modes={[
          { id: "full", label: "Calculate HDI" },
          { id: "compare", label: "Compare" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <SolverSelect label="Currency" value={currency} onChange={setCurrency} options={[
            { value: "usd", label: "$ USD" }, { value: "inr", label: "\u20B9 INR" },
          ]} />
          <SolverInput label="Life Expectancy (years)" value={lifeExp} onChange={setLifeExp} placeholder="e.g. 69.7" />
          <SolverInput label="Expected Years of Schooling" value={expSchool} onChange={setExpSchool} placeholder="e.g. 12.2" />
          <SolverInput label="Mean Years of Schooling" value={meanSchool} onChange={setMeanSchool} placeholder="e.g. 6.7" />
          <SolverInput label={`GNI per Capita (${currency === "inr" ? "\u20B9" : "$"})`} value={gniPerCapita} onChange={setGniPerCapita} placeholder="e.g. 6590" />
        </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      }
    />
  );
}

function PovertyRate() {
  const [mode, setMode] = useState("headcount");
  const [totalPop, setTotalPop] = useState("1400000000");
  const [belowLine, setBelowLine] = useState("230000000");
  const [povertyLine, setPovertyLine] = useState("2.15");
  const [currency, setCurrency] = useState("usd");
  const [avgIncomePoor, setAvgIncomePoor] = useState("1.50");
  const [incomes, setIncomes] = useState("1.0,1.2,1.5,1.8,2.0");
  const [prevRate, setPrevRate] = useState("21.9");
  const [currentRate, setCurrentRate] = useState("16.4");
  const [years, setYears] = useState("5");
  const sym = currency === "inr" ? "\u20B9" : "$";
  const convRate = currency === "inr" ? 83 : 1;

  const result = useMemo(() => {
    const pop = parseFloat(totalPop) || 0;
    const below = parseFloat(belowLine) || 0;
    const line = (parseFloat(povertyLine) || 0);
    const avgInc = (parseFloat(avgIncomePoor) || 0);

    switch (mode) {
      case "headcount": {
        const hcr = pop > 0 ? (below / pop) * 100 : 0;
        const aboveLine = pop - below;
        return {
          results: [
            { label: "Headcount Ratio", value: `${fmt(hcr)}%` },
            { label: "Below Poverty Line", value: fmtPop(below) },
            { label: "Above Poverty Line", value: fmtPop(aboveLine) },
            { label: `Poverty Line`, value: `${sym}${fmt(line * convRate)}/day` },
          ],
          steps: [
            `Total population = ${fmtPop(pop)}`,
            `Below poverty line = ${fmtPop(below)}`,
            `Poverty line = ${sym}${fmt(line * convRate)}/day ($${fmt(line)}/day PPP)`,
            `HCR = (Below line / Total) \u00D7 100 = (${fmtPop(below)} / ${fmtPop(pop)}) \u00D7 100 = ${fmt(hcr)}%`,
          ],
        };
      }
      case "gap": {
        const gap = line > 0 ? (line - avgInc) / line : 0;
        const povertyGapIndex = pop > 0 ? (below / pop) * gap * 100 : 0;
        const totalDeficit = below * (line - avgInc) * 365;
        return {
          results: [
            { label: "Poverty Gap Ratio", value: `${fmt(gap * 100)}%` },
            { label: "Poverty Gap Index", value: fmt(povertyGapIndex, 2) },
            { label: "Average Shortfall", value: `$${fmt(line - avgInc)}/day` },
            { label: "Annual Deficit", value: `$${fmtPop(totalDeficit)}` },
          ],
          steps: [
            `Poverty line = $${fmt(line)}/day, Avg income of poor = $${fmt(avgInc)}/day`,
            `Shortfall per person = $${fmt(line)} - $${fmt(avgInc)} = $${fmt(line - avgInc)}/day`,
            `Poverty gap ratio = Shortfall / Line = ${fmt(gap * 100)}%`,
            `Poverty gap index = HCR \u00D7 Gap = (${fmtPop(below)}/${fmtPop(pop)}) \u00D7 ${fmt(gap)} \u00D7 100 = ${fmt(povertyGapIndex, 2)}`,
            `Annual deficit = ${fmtPop(below)} \u00D7 $${fmt(line - avgInc)} \u00D7 365 = $${fmtPop(totalDeficit)}`,
          ],
        };
      }
      case "mpi": {
        const vals = incomes.split(",").map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
        const deprived = vals.filter(v => v < line);
        const headcount = vals.length > 0 ? (deprived.length / vals.length) * 100 : 0;
        const avgDeprivation = deprived.length > 0
          ? deprived.reduce((s, v) => s + (line - v) / line, 0) / deprived.length * 100 : 0;
        const mpi = (headcount / 100) * (avgDeprivation / 100);
        return {
          results: [
            { label: "Headcount (H)", value: `${fmt(headcount)}%` },
            { label: "Avg Deprivation (A)", value: `${fmt(avgDeprivation)}%` },
            { label: "MPI (H \u00D7 A)", value: fmt(mpi, 4) },
            { label: "Sample Size", value: `${vals.length}` },
          ],
          steps: [
            `Poverty line = $${fmt(line)}/day`,
            `Sample incomes: [${vals.map(v => `$${v}`).join(", ")}]`,
            `Deprived count = ${deprived.length} of ${vals.length}`,
            `H = ${deprived.length} / ${vals.length} = ${fmt(headcount)}%`,
            `Average deprivation intensity = ${fmt(avgDeprivation)}%`,
            `MPI = H \u00D7 A = ${fmt(headcount / 100, 4)} \u00D7 ${fmt(avgDeprivation / 100, 4)} = ${fmt(mpi, 4)}`,
          ],
        };
      }
      case "trend": {
        const prev = parseFloat(prevRate) || 0;
        const curr = parseFloat(currentRate) || 0;
        const yrs = parseFloat(years) || 1;
        const change = curr - prev;
        const pctChange = prev > 0 ? (change / prev) * 100 : 0;
        const annualChange = change / yrs;
        const yearsToZero = annualChange < 0 ? curr / Math.abs(annualChange) : Infinity;
        return {
          results: [
            { label: "Change", value: `${fmt(change)} pp` },
            { label: "% Change", value: `${fmt(pctChange)}%` },
            { label: "Annual Change", value: `${fmt(annualChange, 2)} pp/year` },
            { label: "Years to Zero (at this rate)", value: yearsToZero < 1000 ? `~${fmt(yearsToZero, 0)} years` : "N/A" },
          ],
          steps: [
            `Previous poverty rate = ${fmt(prev)}%`,
            `Current poverty rate = ${fmt(curr)}%`,
            `Change = ${fmt(curr)} - ${fmt(prev)} = ${fmt(change)} percentage points`,
            `Over ${yrs} years: annual change = ${fmt(annualChange, 2)} pp/year`,
            annualChange < 0 ? `At this rate, poverty reaches 0 in ~${fmt(yearsToZero, 0)} years` : `Poverty is increasing; no elimination timeline`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, totalPop, belowLine, povertyLine, currency, avgIncomePoor, incomes, prevRate, currentRate, years, sym, convRate]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Poverty Rate Tool" icon={TrendingDown} iconColor="bg-amber-500">
        <ModeToggle modes={[
          { id: "headcount", label: "Headcount" },
          { id: "gap", label: "Poverty Gap" },
          { id: "mpi", label: "MPI" },
          { id: "trend", label: "Trend" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <SolverSelect label="Currency" value={currency} onChange={setCurrency} options={[
            { value: "usd", label: "$ USD" }, { value: "inr", label: "\u20B9 INR" },
          ]} />
          {mode === "headcount" && (
            <>
              <SolverInput label="Total Population" value={totalPop} onChange={setTotalPop} />
              <SolverInput label="Below Poverty Line" value={belowLine} onChange={setBelowLine} />
              <SolverInput label="Poverty Line ($/day PPP)" value={povertyLine} onChange={setPovertyLine} />
            </>
          )}
          {mode === "gap" && (
            <>
              <SolverInput label="Total Population" value={totalPop} onChange={setTotalPop} />
              <SolverInput label="Below Poverty Line" value={belowLine} onChange={setBelowLine} />
              <SolverInput label="Poverty Line ($/day)" value={povertyLine} onChange={setPovertyLine} />
              <SolverInput label="Avg Income of Poor ($/day)" value={avgIncomePoor} onChange={setAvgIncomePoor} />
            </>
          )}
          {mode === "mpi" && (
            <>
              <SolverInput label="Poverty Line ($/day)" value={povertyLine} onChange={setPovertyLine} />
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Sample Incomes (comma-separated)</label>
                <input type="text" value={incomes} onChange={(e) => setIncomes(e.target.value)} placeholder="1.0,1.2,1.5,1.8,2.0"
                  data-testid="input-sample-incomes"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
            </>
          )}
          {mode === "trend" && (
            <>
              <SolverInput label="Previous Poverty Rate (%)" value={prevRate} onChange={setPrevRate} />
              <SolverInput label="Current Poverty Rate (%)" value={currentRate} onChange={setCurrentRate} />
              <SolverInput label="Years Between" value={years} onChange={setYears} />
            </>
          )}
        </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      }
    />
  );
}

function LiteracyRate() {
  const [mode, setMode] = useState("basic");
  const [totalPop, setTotalPop] = useState("1400000000");
  const [literate, setLiterate] = useState("1050000000");
  const [pop7plus, setPop7plus] = useState("1200000000");
  const [maleLit, setMaleLit] = useState("600000000");
  const [maleTotal, setMaleTotal] = useState("700000000");
  const [femaleLit, setFemaleLit] = useState("450000000");
  const [femaleTotal, setFemaleTotal] = useState("650000000");
  const [urbanLit, setUrbanLit] = useState("400000000");
  const [urbanTotal, setUrbanTotal] = useState("450000000");
  const [ruralLit, setRuralLit] = useState("650000000");
  const [ruralTotal, setRuralTotal] = useState("750000000");
  const [prevRate, setPrevRate] = useState("74");
  const [currentRate, setCurrentRate] = useState("77.7");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    switch (mode) {
      case "basic": {
        const lit = parseFloat(literate) || 0;
        const p7 = parseFloat(pop7plus) || 0;
        const rate = p7 > 0 ? (lit / p7) * 100 : 0;
        const illiterate = p7 - lit;
        const level = rate >= 95 ? "Very High" : rate >= 80 ? "High" : rate >= 60 ? "Medium" : "Low";
        return {
          results: [
            { label: "Literacy Rate", value: `${fmt(rate)}%` },
            { label: "Level", value: level },
            { label: "Literate Population", value: fmtPop(lit) },
            { label: "Illiterate Population", value: fmtPop(illiterate) },
          ],
          steps: [
            `Population (7+) = ${fmtPop(p7)}`,
            `Literate = ${fmtPop(lit)}`,
            `Rate = (${fmtPop(lit)} / ${fmtPop(p7)}) \u00D7 100 = ${fmt(rate)}%`,
            `Classification: ${level}`,
          ],
        };
      }
      case "gender": {
        const ml = parseFloat(maleLit) || 0;
        const mt = parseFloat(maleTotal) || 0;
        const fl = parseFloat(femaleLit) || 0;
        const ft = parseFloat(femaleTotal) || 0;
        const mRate = mt > 0 ? (ml / mt) * 100 : 0;
        const fRate = ft > 0 ? (fl / ft) * 100 : 0;
        const gap = mRate - fRate;
        const gpi = mRate > 0 ? fRate / mRate : 0;
        return {
          results: [
            { label: "Male Literacy", value: `${fmt(mRate)}%` },
            { label: "Female Literacy", value: `${fmt(fRate)}%` },
            { label: "Gender Gap", value: `${fmt(gap)} pp` },
            { label: "Gender Parity Index", value: fmt(gpi, 3) },
          ],
          steps: [
            `Male: ${fmtPop(ml)} / ${fmtPop(mt)} = ${fmt(mRate)}%`,
            `Female: ${fmtPop(fl)} / ${fmtPop(ft)} = ${fmt(fRate)}%`,
            `Gender gap = ${fmt(mRate)} - ${fmt(fRate)} = ${fmt(gap)} percentage points`,
            `GPI = Female rate / Male rate = ${fmt(fRate)} / ${fmt(mRate)} = ${fmt(gpi, 3)}`,
            `GPI = 1 means parity, < 1 means female disadvantage`,
          ],
        };
      }
      case "urban-rural": {
        const ul = parseFloat(urbanLit) || 0;
        const ut = parseFloat(urbanTotal) || 0;
        const rl = parseFloat(ruralLit) || 0;
        const rt = parseFloat(ruralTotal) || 0;
        const uRate = ut > 0 ? (ul / ut) * 100 : 0;
        const rRate = rt > 0 ? (rl / rt) * 100 : 0;
        const gap = uRate - rRate;
        const totalLit = ul + rl;
        const totalPop = ut + rt;
        const overall = totalPop > 0 ? (totalLit / totalPop) * 100 : 0;
        return {
          results: [
            { label: "Urban Literacy", value: `${fmt(uRate)}%` },
            { label: "Rural Literacy", value: `${fmt(rRate)}%` },
            { label: "Urban-Rural Gap", value: `${fmt(gap)} pp` },
            { label: "Overall Rate", value: `${fmt(overall)}%` },
          ],
          steps: [
            `Urban: ${fmtPop(ul)} / ${fmtPop(ut)} = ${fmt(uRate)}%`,
            `Rural: ${fmtPop(rl)} / ${fmtPop(rt)} = ${fmt(rRate)}%`,
            `Gap = ${fmt(uRate)} - ${fmt(rRate)} = ${fmt(gap)} percentage points`,
            `Overall = (${fmtPop(totalLit)} / ${fmtPop(totalPop)}) \u00D7 100 = ${fmt(overall)}%`,
          ],
        };
      }
      case "trend": {
        const prev = parseFloat(prevRate) || 0;
        const curr = parseFloat(currentRate) || 0;
        const yrs = parseFloat(years) || 1;
        const change = curr - prev;
        const annual = change / yrs;
        const toFull = annual > 0 ? (100 - curr) / annual : Infinity;
        return {
          results: [
            { label: "Change", value: `${fmt(change)} pp` },
            { label: "Annual Improvement", value: `${fmt(annual, 2)} pp/year` },
            { label: "Years to 100%", value: toFull < 500 ? `~${fmt(toFull, 0)} years` : "N/A" },
          ],
          steps: [
            `Previous rate = ${fmt(prev)}%, Current = ${fmt(curr)}%`,
            `Change over ${yrs} years = ${fmt(change)} pp`,
            `Annual improvement = ${fmt(annual, 2)} pp/year`,
            annual > 0 ? `Projected years to 100% = (100 - ${fmt(curr)}) / ${fmt(annual, 2)} = ~${fmt(toFull, 0)} years` : `Rate not improving`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, literate, pop7plus, maleLit, maleTotal, femaleLit, femaleTotal, urbanLit, urbanTotal, ruralLit, ruralTotal, prevRate, currentRate, years]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Literacy Rate Tool" icon={BookOpen} iconColor="bg-amber-500">
        <ModeToggle modes={[
          { id: "basic", label: "Basic" },
          { id: "gender", label: "Gender" },
          { id: "urban-rural", label: "Urban/Rural" },
          { id: "trend", label: "Trend" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          {mode === "basic" && (
            <>
              <SolverInput label="Population (7+)" value={pop7plus} onChange={setPop7plus} />
              <SolverInput label="Literate Population" value={literate} onChange={setLiterate} />
            </>
          )}
          {mode === "gender" && (
            <>
              <SolverInput label="Male Literate" value={maleLit} onChange={setMaleLit} />
              <SolverInput label="Male Total (7+)" value={maleTotal} onChange={setMaleTotal} />
              <SolverInput label="Female Literate" value={femaleLit} onChange={setFemaleLit} />
              <SolverInput label="Female Total (7+)" value={femaleTotal} onChange={setFemaleTotal} />
            </>
          )}
          {mode === "urban-rural" && (
            <>
              <SolverInput label="Urban Literate" value={urbanLit} onChange={setUrbanLit} />
              <SolverInput label="Urban Total" value={urbanTotal} onChange={setUrbanTotal} />
              <SolverInput label="Rural Literate" value={ruralLit} onChange={setRuralLit} />
              <SolverInput label="Rural Total" value={ruralTotal} onChange={setRuralTotal} />
            </>
          )}
          {mode === "trend" && (
            <>
              <SolverInput label="Previous Literacy Rate (%)" value={prevRate} onChange={setPrevRate} />
              <SolverInput label="Current Literacy Rate (%)" value={currentRate} onChange={setCurrentRate} />
              <SolverInput label="Years Between" value={years} onChange={setYears} />
            </>
          )}
        </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      }
    />
  );
}

function HealthIndex() {
  const [mode, setMode] = useState("composite");
  const [lifeExp, setLifeExp] = useState("69.7");
  const [imr, setImr] = useState("28");
  const [mmr, setMmr] = useState("103");
  const [u5mr, setU5mr] = useState("32");
  const [bedsPer1000, setBedsPer1000] = useState("0.5");
  const [doctorsPer1000, setDoctorsPer1000] = useState("0.7");
  const [healthSpend, setHealthSpend] = useState("3.5");
  const [gdpPerCapita, setGdpPerCapita] = useState("2500");
  const [vaccRate, setVaccRate] = useState("85");
  const [waterAccess, setWaterAccess] = useState("90");
  const [sanitationAccess, setSanitationAccess] = useState("72");

  const result = useMemo(() => {
    switch (mode) {
      case "composite": {
        const le = parseFloat(lifeExp) || 0;
        const infant = parseFloat(imr) || 0;
        const maternal = parseFloat(mmr) || 0;
        const under5 = parseFloat(u5mr) || 0;

        const leScore = clamp01((le - 40) / (85 - 40));
        const imrScore = clamp01(1 - infant / 100);
        const mmrScore = clamp01(1 - maternal / 1000);
        const u5Score = clamp01(1 - under5 / 100);
        const composite = (leScore * 0.3 + imrScore * 0.25 + mmrScore * 0.2 + u5Score * 0.25);
        const level = composite >= 0.8 ? "Excellent" : composite >= 0.6 ? "Good" : composite >= 0.4 ? "Fair" : "Poor";
        return {
          results: [
            { label: "Health Index", value: fmt(composite, 3) },
            { label: "Level", value: level },
            { label: "Life Exp. Score", value: fmt(leScore, 3) },
            { label: "IMR Score", value: fmt(imrScore, 3) },
            { label: "MMR Score", value: fmt(mmrScore, 3) },
            { label: "U5MR Score", value: fmt(u5Score, 3) },
          ],
          steps: [
            `Life Expectancy = ${le} \u2192 Score = (${le}-40)/(85-40) = ${fmt(leScore, 3)} (weight 30%)`,
            `IMR = ${infant}/1000 \u2192 Score = 1 - ${infant}/100 = ${fmt(imrScore, 3)} (weight 25%)`,
            `MMR = ${maternal}/100K \u2192 Score = 1 - ${maternal}/1000 = ${fmt(mmrScore, 3)} (weight 20%)`,
            `U5MR = ${under5}/1000 \u2192 Score = 1 - ${under5}/100 = ${fmt(u5Score, 3)} (weight 25%)`,
            `Health Index = 0.3\u00D7${fmt(leScore, 3)} + 0.25\u00D7${fmt(imrScore, 3)} + 0.2\u00D7${fmt(mmrScore, 3)} + 0.25\u00D7${fmt(u5Score, 3)} = ${fmt(composite, 3)}`,
          ],
        };
      }
      case "infrastructure": {
        const beds = parseFloat(bedsPer1000) || 0;
        const docs = parseFloat(doctorsPer1000) || 0;
        const spend = parseFloat(healthSpend) || 0;
        const gdp = parseFloat(gdpPerCapita) || 0;
        const healthPerCapita = gdp * spend / 100;
        const bedsScore = clamp01(beds / 5);
        const docsScore = clamp01(docs / 3);
        const spendScore = clamp01(spend / 10);
        const infraScore = (bedsScore + docsScore + spendScore) / 3;
        const level = infraScore >= 0.7 ? "Well-resourced" : infraScore >= 0.4 ? "Moderate" : "Under-resourced";
        return {
          results: [
            { label: "Health Infra Score", value: fmt(infraScore, 3) },
            { label: "Level", value: level },
            { label: "Health Spend/Capita", value: `$${fmt(healthPerCapita)}` },
            { label: "Beds Score", value: fmt(bedsScore, 3) },
            { label: "Doctors Score", value: fmt(docsScore, 3) },
          ],
          steps: [
            `Hospital beds = ${beds} per 1,000 \u2192 Score = ${beds}/5 = ${fmt(bedsScore, 3)}`,
            `Doctors = ${docs} per 1,000 \u2192 Score = ${docs}/3 = ${fmt(docsScore, 3)}`,
            `Health expenditure = ${spend}% of GDP \u2192 Score = ${spend}/10 = ${fmt(spendScore, 3)}`,
            `Infrastructure score = average = ${fmt(infraScore, 3)}`,
            `Per capita health spending = $${fmt(gdp)} \u00D7 ${spend}% = $${fmt(healthPerCapita)}`,
          ],
        };
      }
      case "access": {
        const vacc = parseFloat(vaccRate) || 0;
        const water = parseFloat(waterAccess) || 0;
        const sanit = parseFloat(sanitationAccess) || 0;
        const accessScore = (vacc + water + sanit) / 3;
        const level = accessScore >= 90 ? "Universal" : accessScore >= 70 ? "Good" : accessScore >= 50 ? "Limited" : "Poor";
        return {
          results: [
            { label: "Access Score", value: `${fmt(accessScore)}%` },
            { label: "Level", value: level },
            { label: "Vaccination Coverage", value: `${fmt(vacc)}%` },
            { label: "Clean Water Access", value: `${fmt(water)}%` },
            { label: "Sanitation Access", value: `${fmt(sanit)}%` },
          ],
          steps: [
            `Vaccination coverage = ${fmt(vacc)}%`,
            `Clean water access = ${fmt(water)}%`,
            `Sanitation access = ${fmt(sanit)}%`,
            `Average access score = (${fmt(vacc)} + ${fmt(water)} + ${fmt(sanit)}) / 3 = ${fmt(accessScore)}%`,
            `Classification: ${level}`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, lifeExp, imr, mmr, u5mr, bedsPer1000, doctorsPer1000, healthSpend, gdpPerCapita, vaccRate, waterAccess, sanitationAccess]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Health Index Tool" icon={HeartPulse} iconColor="bg-amber-500">
        <ModeToggle modes={[
          { id: "composite", label: "Composite" },
          { id: "infrastructure", label: "Infrastructure" },
          { id: "access", label: "Access" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          {mode === "composite" && (
            <>
              <SolverInput label="Life Expectancy (years)" value={lifeExp} onChange={setLifeExp} />
              <SolverInput label="Infant Mortality Rate (per 1,000)" value={imr} onChange={setImr} />
              <SolverInput label="Maternal Mortality (per 100,000)" value={mmr} onChange={setMmr} />
              <SolverInput label="Under-5 Mortality (per 1,000)" value={u5mr} onChange={setU5mr} />
            </>
          )}
          {mode === "infrastructure" && (
            <>
              <SolverInput label="Hospital Beds per 1,000" value={bedsPer1000} onChange={setBedsPer1000} />
              <SolverInput label="Doctors per 1,000" value={doctorsPer1000} onChange={setDoctorsPer1000} />
              <SolverInput label="Health Expenditure (% GDP)" value={healthSpend} onChange={setHealthSpend} />
              <SolverInput label="GDP per Capita ($)" value={gdpPerCapita} onChange={setGdpPerCapita} />
            </>
          )}
          {mode === "access" && (
            <>
              <SolverInput label="Vaccination Coverage (%)" value={vaccRate} onChange={setVaccRate} />
              <SolverInput label="Clean Water Access (%)" value={waterAccess} onChange={setWaterAccess} />
              <SolverInput label="Sanitation Access (%)" value={sanitationAccess} onChange={setSanitationAccess} />
            </>
          )}
        </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      }
    />
  );
}

function InfrastructureIndex() {
  const [mode, setMode] = useState("composite");
  const [roadDensity, setRoadDensity] = useState("1.66");
  const [railDensity, setRailDensity] = useState("0.02");
  const [electrification, setElectrification] = useState("99.5");
  const [urbanization, setUrbanization] = useState("35");
  const [internetPenetration, setInternetPenetration] = useState("47");
  const [mobileSubscribers, setMobileSubscribers] = useState("84");
  const [airportsPer1M, setAirportsPer1M] = useState("0.35");
  const [portCapacity, setPortCapacity] = useState("75");
  const [pipelineKm, setPipelineKm] = useState("35000");
  const [totalArea, setTotalArea] = useState("3287263");

  const result = useMemo(() => {
    switch (mode) {
      case "composite": {
        const road = parseFloat(roadDensity) || 0;
        const rail = parseFloat(railDensity) || 0;
        const elec = parseFloat(electrification) || 0;
        const urban = parseFloat(urbanization) || 0;
        const internet = parseFloat(internetPenetration) || 0;

        const roadScore = clamp01(road / 5);
        const railScore = clamp01(rail / 0.1);
        const elecScore = clamp01(elec / 100);
        const urbanScore = clamp01(urban / 80);
        const netScore = clamp01(internet / 100);

        const composite = (roadScore * 0.25 + railScore * 0.15 + elecScore * 0.25 + urbanScore * 0.15 + netScore * 0.2);
        const level = composite >= 0.8 ? "Advanced" : composite >= 0.6 ? "Developing" : composite >= 0.4 ? "Emerging" : "Basic";
        return {
          results: [
            { label: "Infrastructure Index", value: fmt(composite, 3) },
            { label: "Level", value: level },
            { label: "Transport Score", value: fmt((roadScore * 0.25 + railScore * 0.15) / 0.4, 3) },
            { label: "Energy Score", value: fmt(elecScore, 3) },
            { label: "Digital Score", value: fmt(netScore, 3) },
          ],
          steps: [
            `Road density: ${road} km/km\u00B2 \u2192 Score = ${fmt(roadScore, 3)} (25%)`,
            `Rail density: ${rail} km/km\u00B2 \u2192 Score = ${fmt(railScore, 3)} (15%)`,
            `Electrification: ${elec}% \u2192 Score = ${fmt(elecScore, 3)} (25%)`,
            `Urbanization: ${urban}% \u2192 Score = ${fmt(urbanScore, 3)} (15%)`,
            `Internet: ${internet}% \u2192 Score = ${fmt(netScore, 3)} (20%)`,
            `Composite = weighted average = ${fmt(composite, 3)}`,
            `Classification: ${level}`,
          ],
        };
      }
      case "transport": {
        const road = parseFloat(roadDensity) || 0;
        const rail = parseFloat(railDensity) || 0;
        const airports = parseFloat(airportsPer1M) || 0;
        const port = parseFloat(portCapacity) || 0;
        const pipeline = parseFloat(pipelineKm) || 0;
        const area = parseFloat(totalArea) || 1;
        const pipelineDensity = pipeline / area;

        const transportScore = (clamp01(road / 5) * 0.3 + clamp01(rail / 0.1) * 0.25 + clamp01(airports / 2) * 0.15 + clamp01(port / 100) * 0.15 + clamp01(pipelineDensity / 0.05) * 0.15);
        return {
          results: [
            { label: "Transport Score", value: fmt(transportScore, 3) },
            { label: "Road Density", value: `${road} km/km\u00B2` },
            { label: "Rail Density", value: `${rail} km/km\u00B2` },
            { label: "Airports per 1M", value: fmt(airports) },
            { label: "Pipeline Density", value: `${fmt(pipelineDensity, 4)} km/km\u00B2` },
          ],
          steps: [
            `Road density = ${road} km/km\u00B2 (score: ${fmt(clamp01(road / 5), 3)})`,
            `Rail density = ${rail} km/km\u00B2 (score: ${fmt(clamp01(rail / 0.1), 3)})`,
            `Airports = ${airports} per million (score: ${fmt(clamp01(airports / 2), 3)})`,
            `Port utilization = ${port}% (score: ${fmt(clamp01(port / 100), 3)})`,
            `Pipeline = ${fmtPop(pipeline)} km over ${fmtPop(area)} km\u00B2 = ${fmt(pipelineDensity, 4)} km/km\u00B2`,
            `Transport score = weighted average = ${fmt(transportScore, 3)}`,
          ],
        };
      }
      case "connectivity": {
        const internet = parseFloat(internetPenetration) || 0;
        const mobile = parseFloat(mobileSubscribers) || 0;
        const elec = parseFloat(electrification) || 0;
        const connScore = (internet * 0.4 + mobile * 0.3 + elec * 0.3) / 100;
        const digitalReady = internet >= 80 && mobile >= 100 && elec >= 99;
        return {
          results: [
            { label: "Connectivity Score", value: fmt(connScore, 3) },
            { label: "Internet Penetration", value: `${fmt(internet)}%` },
            { label: "Mobile Subscribers", value: `${fmt(mobile)} per 100` },
            { label: "Electrification", value: `${fmt(elec)}%` },
            { label: "Digital Ready?", value: digitalReady ? "Yes" : "Not yet" },
          ],
          steps: [
            `Internet = ${internet}% (weight 40%)`,
            `Mobile = ${mobile} per 100 people (weight 30%)`,
            `Electrification = ${elec}% (weight 30%)`,
            `Connectivity = (${internet}\u00D70.4 + ${mobile}\u00D70.3 + ${elec}\u00D70.3) / 100 = ${fmt(connScore, 3)}`,
            `Digital ready = Internet\u226580% AND Mobile\u2265100 AND Elec\u226599% \u2192 ${digitalReady ? "Yes" : "No"}`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, roadDensity, railDensity, electrification, urbanization, internetPenetration, mobileSubscribers, airportsPer1M, portCapacity, pipelineKm, totalArea]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Infrastructure Index" icon={Building2} iconColor="bg-amber-500">
        <ModeToggle modes={[
          { id: "composite", label: "Composite" },
          { id: "transport", label: "Transport" },
          { id: "connectivity", label: "Connectivity" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          {mode === "composite" && (
            <>
              <SolverInput label="Road Density (km/km\u00B2)" value={roadDensity} onChange={setRoadDensity} />
              <SolverInput label="Rail Density (km/km\u00B2)" value={railDensity} onChange={setRailDensity} />
              <SolverInput label="Electrification (%)" value={electrification} onChange={setElectrification} />
              <SolverInput label="Urbanization (%)" value={urbanization} onChange={setUrbanization} />
              <SolverInput label="Internet Penetration (%)" value={internetPenetration} onChange={setInternetPenetration} />
            </>
          )}
          {mode === "transport" && (
            <>
              <SolverInput label="Road Density (km/km\u00B2)" value={roadDensity} onChange={setRoadDensity} />
              <SolverInput label="Rail Density (km/km\u00B2)" value={railDensity} onChange={setRailDensity} />
              <SolverInput label="Airports per 1 Million" value={airportsPer1M} onChange={setAirportsPer1M} />
              <SolverInput label="Port Capacity Utilization (%)" value={portCapacity} onChange={setPortCapacity} />
              <SolverInput label="Pipeline Length (km)" value={pipelineKm} onChange={setPipelineKm} />
              <SolverInput label="Total Area (km\u00B2)" value={totalArea} onChange={setTotalArea} />
            </>
          )}
          {mode === "connectivity" && (
            <>
              <SolverInput label="Internet Penetration (%)" value={internetPenetration} onChange={setInternetPenetration} />
              <SolverInput label="Mobile Subscribers (per 100)" value={mobileSubscribers} onChange={setMobileSubscribers} />
              <SolverInput label="Electrification (%)" value={electrification} onChange={setElectrification} />
            </>
          )}
        </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      }
    />
  );
}

function DigitalEconomy() {
  const [mode, setMode] = useState("readiness");
  const [internetUsers, setInternetUsers] = useState("700000000");
  const [totalPop, setTotalPop] = useState("1400000000");
  const [ecommerceRev, setEcommerceRev] = useState("80");
  const [gdp, setGdp] = useState("3500");
  const [mobilePayUsers, setMobilePayUsers] = useState("350000000");
  const [digitalLitRate, setDigitalLitRate] = useState("38");
  const [broadbandSubs, setBroadbandSubs] = useState("22");
  const [itExports, setItExports] = useState("194");
  const [totalExports, setTotalExports] = useState("770");
  const [startups, setStartups] = useState("100000");
  const [unicorns, setUnicorns] = useState("108");
  const [techWorkers, setTechWorkers] = useState("5000000");
  const [currency, setCurrency] = useState("usd");
  const sym = currency === "inr" ? "\u20B9" : "$";

  const result = useMemo(() => {
    const netUsers = parseFloat(internetUsers) || 0;
    const pop = parseFloat(totalPop) || 0;
    const ecom = parseFloat(ecommerceRev) || 0;
    const gdpVal = parseFloat(gdp) || 0;

    switch (mode) {
      case "readiness": {
        const penetration = pop > 0 ? (netUsers / pop) * 100 : 0;
        const digLit = parseFloat(digitalLitRate) || 0;
        const broadband = parseFloat(broadbandSubs) || 0;
        const mobilePay = parseFloat(mobilePayUsers) || 0;
        const mobilePayPct = pop > 0 ? (mobilePay / pop) * 100 : 0;

        const readinessScore = (clamp01(penetration / 100) * 0.3 + clamp01(digLit / 100) * 0.25 + clamp01(broadband / 50) * 0.25 + clamp01(mobilePayPct / 80) * 0.2);
        const level = readinessScore >= 0.8 ? "Advanced" : readinessScore >= 0.6 ? "Ready" : readinessScore >= 0.4 ? "Emerging" : "Early stage";
        return {
          results: [
            { label: "Digital Readiness", value: fmt(readinessScore, 3) },
            { label: "Level", value: level },
            { label: "Internet Penetration", value: `${fmt(penetration)}%` },
            { label: "Digital Literacy", value: `${fmt(digLit)}%` },
            { label: "Mobile Payment Users", value: `${fmt(mobilePayPct)}%` },
          ],
          steps: [
            `Internet users = ${fmtPop(netUsers)} / ${fmtPop(pop)} = ${fmt(penetration)}% (30%)`,
            `Digital literacy = ${fmt(digLit)}% (25%)`,
            `Broadband = ${broadband} per 100 (25%)`,
            `Mobile payments = ${fmtPop(mobilePay)} = ${fmt(mobilePayPct)}% of pop (20%)`,
            `Score = ${fmt(readinessScore, 3)} \u2192 ${level}`,
          ],
        };
      }
      case "ecommerce": {
        const ecomGdpPct = gdpVal > 0 ? (ecom / gdpVal) * 100 : 0;
        const ecomPerCapita = pop > 0 ? (ecom * 1e9) / pop : 0;
        const itExp = parseFloat(itExports) || 0;
        const totExp = parseFloat(totalExports) || 0;
        const itShare = totExp > 0 ? (itExp / totExp) * 100 : 0;
        return {
          results: [
            { label: "E-commerce Revenue", value: `${sym}${fmt(ecom)}B` },
            { label: "E-commerce % of GDP", value: `${fmt(ecomGdpPct)}%` },
            { label: "E-commerce per Capita", value: `${sym}${fmt(ecomPerCapita)}` },
            { label: "IT Exports Share", value: `${fmt(itShare)}%` },
          ],
          steps: [
            `E-commerce revenue = ${sym}${fmt(ecom)} billion`,
            `GDP = ${sym}${fmt(gdpVal)} billion`,
            `E-com % of GDP = (${fmt(ecom)} / ${fmt(gdpVal)}) \u00D7 100 = ${fmt(ecomGdpPct)}%`,
            `Per capita = ${sym}${fmt(ecom)}B / ${fmtPop(pop)} = ${sym}${fmt(ecomPerCapita)}`,
            `IT exports: ${sym}${fmt(itExp)}B of ${sym}${fmt(totExp)}B = ${fmt(itShare)}%`,
          ],
        };
      }
      case "ecosystem": {
        const su = parseFloat(startups) || 0;
        const uni = parseFloat(unicorns) || 0;
        const tw = parseFloat(techWorkers) || 0;
        const startupsPerMillion = pop > 0 ? (su / pop) * 1e6 : 0;
        const techWorkersPct = pop > 0 ? (tw / pop) * 100 : 0;
        const unicornDensity = pop > 0 ? (uni / pop) * 1e9 : 0;
        return {
          results: [
            { label: "Startups", value: fmtPop(su) },
            { label: "Startups per Million", value: fmt(startupsPerMillion) },
            { label: "Unicorns", value: fmt(uni, 0) },
            { label: "Unicorns per Billion", value: fmt(unicornDensity) },
            { label: "Tech Workforce %", value: `${fmt(techWorkersPct, 2)}%` },
          ],
          steps: [
            `Total startups = ${fmtPop(su)}`,
            `Startups per million = ${fmtPop(su)} / ${fmtPop(pop)} \u00D7 10\u2076 = ${fmt(startupsPerMillion)}`,
            `Unicorns = ${fmt(uni, 0)}, per billion pop = ${fmt(unicornDensity)}`,
            `Tech workers = ${fmtPop(tw)} = ${fmt(techWorkersPct, 2)}% of population`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, internetUsers, totalPop, ecommerceRev, gdp, mobilePayUsers, digitalLitRate, broadbandSubs, itExports, totalExports, startups, unicorns, techWorkers, currency, sym]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Digital Economy Tool" icon={Wifi} iconColor="bg-amber-500">
        <ModeToggle modes={[
          { id: "readiness", label: "Readiness" },
          { id: "ecommerce", label: "E-commerce" },
          { id: "ecosystem", label: "Tech Ecosystem" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <SolverSelect label="Currency" value={currency} onChange={setCurrency} options={[
            { value: "usd", label: "$ USD" }, { value: "inr", label: "\u20B9 INR" },
          ]} />
          {mode === "readiness" && (
            <>
              <SolverInput label="Internet Users" value={internetUsers} onChange={setInternetUsers} />
              <SolverInput label="Total Population" value={totalPop} onChange={setTotalPop} />
              <SolverInput label="Digital Literacy Rate (%)" value={digitalLitRate} onChange={setDigitalLitRate} />
              <SolverInput label="Broadband per 100" value={broadbandSubs} onChange={setBroadbandSubs} />
              <SolverInput label="Mobile Payment Users" value={mobilePayUsers} onChange={setMobilePayUsers} />
            </>
          )}
          {mode === "ecommerce" && (
            <>
              <SolverInput label="Total Population" value={totalPop} onChange={setTotalPop} />
              <SolverInput label={`E-commerce Revenue (${sym}B)`} value={ecommerceRev} onChange={setEcommerceRev} />
              <SolverInput label={`GDP (${sym}B)`} value={gdp} onChange={setGdp} />
              <SolverInput label={`IT Exports (${sym}B)`} value={itExports} onChange={setItExports} />
              <SolverInput label={`Total Exports (${sym}B)`} value={totalExports} onChange={setTotalExports} />
            </>
          )}
          {mode === "ecosystem" && (
            <>
              <SolverInput label="Total Population" value={totalPop} onChange={setTotalPop} />
              <SolverInput label="Total Startups" value={startups} onChange={setStartups} />
              <SolverInput label="Unicorns" value={unicorns} onChange={setUnicorns} />
              <SolverInput label="Tech Workers" value={techWorkers} onChange={setTechWorkers} />
            </>
          )}
        </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      }
    />
  );
}

function EnergyConsumption() {
  const [mode, setMode] = useState("per-capita");
  const [totalEnergy, setTotalEnergy] = useState("900");
  const [population, setPopulation] = useState("1400000000");
  const [energyUnit, setEnergyUnit] = useState("mtoe");
  const [gdpBillion, setGdpBillion] = useState("3500");
  const [renewableShare, setRenewableShare] = useState("22");
  const [coalShare, setCoalShare] = useState("44");
  const [oilShare, setOilShare] = useState("25");
  const [gasShare, setGasShare] = useState("6");
  const [nuclearShare, setNuclearShare] = useState("1.2");
  const [hydroShare, setHydroShare] = useState("4");
  const [co2Emissions, setCo2Emissions] = useState("2700");
  const [prevEnergy, setPrevEnergy] = useState("800");
  const [years, setYears] = useState("5");
  const [currency, setCurrency] = useState("usd");
  const sym = currency === "inr" ? "\u20B9" : "$";

  const energyUnits: Record<string, { label: string; toMtoe: number }> = {
    mtoe: { label: "Mtoe", toMtoe: 1 },
    twh: { label: "TWh", toMtoe: 0.0859845 },
    ej: { label: "EJ", toMtoe: 23.8846 },
    quad: { label: "Quad BTU", toMtoe: 25.1996 },
  };

  const result = useMemo(() => {
    const totalRaw = parseFloat(totalEnergy) || 0;
    const toMtoe = energyUnits[energyUnit]?.toMtoe || 1;
    const total = totalRaw * toMtoe;
    const pop = parseFloat(population) || 0;
    const gdp = parseFloat(gdpBillion) || 0;

    switch (mode) {
      case "per-capita": {
        const perCapitaToe = pop > 0 ? (total * 1e6) / pop : 0;
        const perCapitaKwh = perCapitaToe * 11630;
        const perCapitaGJ = perCapitaToe * 41.868;
        const worldAvg = 1.9;
        const level = perCapitaToe >= 4 ? "High consumption" : perCapitaToe >= 1.5 ? "Moderate" : "Low consumption";
        return {
          results: [
            { label: "Per Capita", value: `${fmt(perCapitaToe, 3)} toe` },
            { label: "Per Capita (kWh)", value: `${fmt(perCapitaKwh)} kWh` },
            { label: "Per Capita (GJ)", value: `${fmt(perCapitaGJ)} GJ` },
            { label: "vs World Average", value: `${fmt((perCapitaToe / worldAvg) * 100)}%` },
            { label: "Level", value: level },
          ],
          steps: [
            `Total energy = ${totalRaw} ${energyUnits[energyUnit]?.label} = ${fmt(total)} Mtoe`,
            `Population = ${fmtPop(pop)}`,
            `Per capita = ${fmt(total)} \u00D7 10\u2076 / ${fmtPop(pop)} = ${fmt(perCapitaToe, 3)} toe`,
            `= ${fmt(perCapitaKwh)} kWh = ${fmt(perCapitaGJ)} GJ`,
            `World average = ${worldAvg} toe; yours is ${fmt((perCapitaToe / worldAvg) * 100)}% of average`,
          ],
        };
      }
      case "intensity": {
        const intensity = gdp > 0 ? total / gdp : 0;
        const intensityPPP = intensity * 0.3;
        const co2 = parseFloat(co2Emissions) || 0;
        const co2PerCapita = pop > 0 ? (co2 * 1e6) / pop : 0;
        const co2Intensity = gdp > 0 ? co2 / gdp : 0;
        return {
          results: [
            { label: "Energy Intensity", value: `${fmt(intensity, 4)} Mtoe/${sym}B` },
            { label: "CO\u2082 Emissions", value: `${fmt(co2)} Mt` },
            { label: "CO\u2082 per Capita", value: `${fmt(co2PerCapita / 1000, 2)} tonnes` },
            { label: "CO\u2082 Intensity", value: `${fmt(co2Intensity, 3)} Mt/${sym}B` },
          ],
          steps: [
            `Total energy = ${fmt(total)} Mtoe, GDP = ${sym}${fmt(gdp)}B`,
            `Energy intensity = ${fmt(total)} / ${fmt(gdp)} = ${fmt(intensity, 4)} Mtoe per ${sym}B GDP`,
            `CO\u2082 = ${fmt(co2)} Mt`,
            `CO\u2082 per capita = ${fmt(co2)} Mt / ${fmtPop(pop)} = ${fmt(co2PerCapita / 1000, 2)} tonnes`,
            `CO\u2082 intensity = ${fmt(co2)} / ${fmt(gdp)} = ${fmt(co2Intensity, 3)} Mt/${sym}B`,
          ],
        };
      }
      case "mix": {
        const coal = parseFloat(coalShare) || 0;
        const oil = parseFloat(oilShare) || 0;
        const gas = parseFloat(gasShare) || 0;
        const nuclear = parseFloat(nuclearShare) || 0;
        const hydro = parseFloat(hydroShare) || 0;
        const renew = parseFloat(renewableShare) || 0;
        const fossil = coal + oil + gas;
        const clean = nuclear + hydro + renew;
        const sum = fossil + clean;
        return {
          results: [
            { label: "Fossil Fuel Share", value: `${fmt(fossil)}%` },
            { label: "Clean Energy Share", value: `${fmt(clean)}%` },
            { label: "Coal", value: `${fmt(coal)}% (${fmt(total * coal / 100)} Mtoe)` },
            { label: "Oil", value: `${fmt(oil)}% (${fmt(total * oil / 100)} Mtoe)` },
            { label: "Natural Gas", value: `${fmt(gas)}% (${fmt(total * gas / 100)} Mtoe)` },
            { label: "Nuclear", value: `${fmt(nuclear)}%` },
            { label: "Hydro", value: `${fmt(hydro)}%` },
            { label: "Renewables", value: `${fmt(renew)}%` },
          ],
          steps: [
            `Total energy = ${fmt(total)} Mtoe`,
            `Fossil fuels: Coal ${coal}% + Oil ${oil}% + Gas ${gas}% = ${fmt(fossil)}%`,
            `Clean: Nuclear ${nuclear}% + Hydro ${hydro}% + Renewables ${renew}% = ${fmt(clean)}%`,
            sum !== 100 ? `Warning: Total = ${fmt(sum)}%, should be ~100%` : `Total = 100% \u2713`,
          ],
        };
      }
      case "trend": {
        const prev = parseFloat(prevEnergy) || 0;
        const prevMtoe = prev * toMtoe;
        const yrs = parseFloat(years) || 1;
        const change = total - prevMtoe;
        const pctChange = prevMtoe > 0 ? (change / prevMtoe) * 100 : 0;
        const annual = change / yrs;
        const cagr = prevMtoe > 0 && yrs > 0 ? (Math.pow(total / prevMtoe, 1 / yrs) - 1) * 100 : 0;
        const perCapitaCurr = pop > 0 ? (total * 1e6) / pop : 0;
        return {
          results: [
            { label: "Change", value: `${fmt(change)} Mtoe` },
            { label: "% Change", value: `${fmt(pctChange)}%` },
            { label: "CAGR", value: `${fmt(cagr, 2)}%` },
            { label: "Annual Change", value: `${fmt(annual)} Mtoe/year` },
          ],
          steps: [
            `Previous = ${fmt(prevMtoe)} Mtoe, Current = ${fmt(total)} Mtoe`,
            `Change = ${fmt(change)} Mtoe (${fmt(pctChange)}%)`,
            `Over ${yrs} years: annual change = ${fmt(annual)} Mtoe/year`,
            `CAGR = (${fmt(total)}/${fmt(prevMtoe)})^(1/${yrs}) - 1 = ${fmt(cagr, 2)}%`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, totalEnergy, population, energyUnit, gdpBillion, renewableShare, coalShare, oilShare, gasShare, nuclearShare, hydroShare, co2Emissions, prevEnergy, years, currency, sym]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Energy Consumption per Capita" icon={Zap} iconColor="bg-amber-500">
        <ModeToggle modes={[
          { id: "per-capita", label: "Per Capita" },
          { id: "intensity", label: "Intensity" },
          { id: "mix", label: "Energy Mix" },
          { id: "trend", label: "Trend" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <SolverSelect label="Energy Unit" value={energyUnit} onChange={setEnergyUnit} options={[
            { value: "mtoe", label: "Mtoe (Million tonnes oil equiv.)" },
            { value: "twh", label: "TWh (Terawatt-hours)" },
            { value: "ej", label: "EJ (Exajoules)" },
            { value: "quad", label: "Quad BTU" },
          ]} />
          {mode === "per-capita" && (
            <>
              <SolverInput label="Total Energy Consumption" value={totalEnergy} onChange={setTotalEnergy} />
              <SolverInput label="Population" value={population} onChange={setPopulation} />
            </>
          )}
          {mode === "intensity" && (
            <>
              <SolverSelect label="Currency" value={currency} onChange={setCurrency} options={[
                { value: "usd", label: "$ USD" }, { value: "inr", label: "\u20B9 INR" },
              ]} />
              <SolverInput label="Total Energy (in selected unit)" value={totalEnergy} onChange={setTotalEnergy} />
              <SolverInput label="Population" value={population} onChange={setPopulation} />
              <SolverInput label={`GDP (${sym} Billion)`} value={gdpBillion} onChange={setGdpBillion} />
              <SolverInput label="CO\u2082 Emissions (Mt)" value={co2Emissions} onChange={setCo2Emissions} />
            </>
          )}
          {mode === "mix" && (
            <>
              <SolverInput label="Total Energy (in selected unit)" value={totalEnergy} onChange={setTotalEnergy} />
              <SolverInput label="Coal (%)" value={coalShare} onChange={setCoalShare} />
              <SolverInput label="Oil (%)" value={oilShare} onChange={setOilShare} />
              <SolverInput label="Natural Gas (%)" value={gasShare} onChange={setGasShare} />
              <SolverInput label="Nuclear (%)" value={nuclearShare} onChange={setNuclearShare} />
              <SolverInput label="Hydro (%)" value={hydroShare} onChange={setHydroShare} />
              <SolverInput label="Renewables (%)" value={renewableShare} onChange={setRenewableShare} />
            </>
          )}
          {mode === "trend" && (
            <>
              <SolverInput label="Previous Energy Consumption" value={prevEnergy} onChange={setPrevEnergy} />
              <SolverInput label="Current Energy Consumption" value={totalEnergy} onChange={setTotalEnergy} />
              <SolverInput label="Population" value={population} onChange={setPopulation} />
              <SolverInput label="Years Between" value={years} onChange={setYears} />
            </>
          )}
        </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      }
    />
  );
}
