import { useState, useMemo } from "react";
import { Users, Baby, Skull, Plane, Briefcase, PieChart, User, TrendingUp } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "growth" | "density" | "birth" | "death" | "migration" | "working" | "dependency" | "youth";

const tools = [
  { id: "growth", label: "Growth", icon: TrendingUp },
  { id: "density", label: "Density", icon: Users },
  { id: "birth", label: "Birth Rate", icon: Baby },
  { id: "death", label: "Death Rate", icon: Skull },
  { id: "migration", label: "Migration", icon: Plane },
  { id: "working", label: "Working Pop.", icon: Briefcase },
  { id: "dependency", label: "Dependency", icon: PieChart },
  { id: "youth", label: "Youth Pop.", icon: User },
];

export default function PopulationTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("growth");

  const renderTool = () => {
    switch (activeTool) {
      case "growth": return <PopulationGrowth />;
      case "density": return <PopulationDensity />;
      case "birth": return <BirthRate />;
      case "death": return <DeathRate />;
      case "migration": return <MigrationRate />;
      case "working": return <WorkingPopulation />;
      case "dependency": return <DependencyRatio />;
      case "youth": return <YouthPopulation />;
      default: return null;
    }
  };

  return (
    <PageWrapper
      title="Population & Demography"
      subtitle="Growth, density, birth/death rates & more"
      accentColor="bg-rose-500"
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
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${mode === m.id ? "bg-rose-500 text-white shadow-sm" : "text-muted-foreground"}`}>
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
          <span className="font-bold text-rose-500 mr-1">Step {i + 1}:</span> {s}
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
          <span className="text-sm font-bold text-rose-500" data-testid={`result-${i}`}>{r.value}</span>
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

const AREA_UNITS = [
  { value: "km2", label: "km\u00B2", factor: 1 },
  { value: "mi2", label: "sq mi", factor: 2.58999 },
  { value: "ha", label: "Hectare", factor: 0.01 },
  { value: "ac", label: "Acre", factor: 0.00404686 },
  { value: "m2", label: "m\u00B2", factor: 0.000001 },
  { value: "bigha", label: "Bigha (India)", factor: 0.00252929 },
];

const CURRENCY_OPTIONS = [
  { value: "inr", label: "\u20B9 INR (Indian Rupee)" },
  { value: "usd", label: "$ USD (US Dollar)" },
];

function PopulationGrowth() {
  const [mode, setMode] = useState("exponential");
  const [initPop, setInitPop] = useState("1400000000");
  const [growthRate, setGrowthRate] = useState("0.97");
  const [years, setYears] = useState("10");
  const [finalPop, setFinalPop] = useState("1500000000");
  const [births, setBirths] = useState("20000000");
  const [deaths, setDeaths] = useState("10000000");
  const [immigrants, setImmigrants] = useState("500000");
  const [emigrants, setEmigrants] = useState("300000");

  const result = useMemo(() => {
    const p0 = parseFloat(initPop) || 0;
    const r = parseFloat(growthRate) || 0;
    const t = parseFloat(years) || 0;
    const pf = parseFloat(finalPop) || 0;

    switch (mode) {
      case "exponential": {
        const rDecimal = r / 100;
        const futureP = p0 * Math.exp(rDecimal * t);
        const doublingTime = r > 0 ? 70 / r : Infinity;
        return {
          results: [
            { label: "Future Population", value: fmtPop(futureP) },
            { label: "Population Change", value: fmtPop(futureP - p0) },
            { label: "Growth Factor", value: fmt(futureP / p0, 4) },
            { label: "Doubling Time", value: `${fmt(doublingTime, 1)} years` },
          ],
          steps: [
            `Initial population P\u2080 = ${fmtPop(p0)}`,
            `Growth rate r = ${r}% per year`,
            `Time period t = ${t} years`,
            `P(t) = P\u2080 \u00D7 e^(rt) = ${fmtPop(p0)} \u00D7 e^(${fmt(rDecimal, 4)} \u00D7 ${t})`,
            `P(t) = ${fmtPop(futureP)}`,
            `Doubling time \u2248 70 / r = 70 / ${r} = ${fmt(doublingTime, 1)} years (Rule of 70)`,
          ],
        };
      }
      case "arithmetic": {
        const annualGrowth = (pf - p0) / (t || 1);
        const midPop = (p0 + pf) / 2;
        const agr = t > 0 ? ((pf - p0) / p0) * 100 : 0;
        return {
          results: [
            { label: "Annual Growth", value: fmtPop(annualGrowth) },
            { label: "Total Change", value: fmtPop(pf - p0) },
            { label: "Average Population", value: fmtPop(midPop) },
            { label: "Growth %", value: `${fmt(agr)}%` },
          ],
          steps: [
            `Initial P\u2080 = ${fmtPop(p0)}, Final P = ${fmtPop(pf)}`,
            `Time = ${t} years`,
            `Annual growth = (P - P\u2080) / t = (${fmtPop(pf)} - ${fmtPop(p0)}) / ${t} = ${fmtPop(annualGrowth)}/year`,
            `Total change = ${fmtPop(pf - p0)}`,
            `Growth % = ((P - P\u2080) / P\u2080) \u00D7 100 = ${fmt(agr)}%`,
          ],
        };
      }
      case "components": {
        const b = parseFloat(births) || 0;
        const d = parseFloat(deaths) || 0;
        const imm = parseFloat(immigrants) || 0;
        const em = parseFloat(emigrants) || 0;
        const naturalIncrease = b - d;
        const netMigration = imm - em;
        const totalChange = naturalIncrease + netMigration;
        const newPop = p0 + totalChange;
        const growthPct = p0 > 0 ? (totalChange / p0) * 100 : 0;
        return {
          results: [
            { label: "Natural Increase", value: fmtPop(naturalIncrease) },
            { label: "Net Migration", value: fmtPop(netMigration) },
            { label: "Total Change", value: fmtPop(totalChange) },
            { label: "New Population", value: fmtPop(newPop) },
            { label: "Growth Rate", value: `${fmt(growthPct, 3)}%` },
          ],
          steps: [
            `Initial population = ${fmtPop(p0)}`,
            `Births = ${fmtPop(b)}, Deaths = ${fmtPop(d)}`,
            `Natural increase = Births - Deaths = ${fmtPop(b)} - ${fmtPop(d)} = ${fmtPop(naturalIncrease)}`,
            `Immigrants = ${fmtPop(imm)}, Emigrants = ${fmtPop(em)}`,
            `Net migration = ${fmtPop(imm)} - ${fmtPop(em)} = ${fmtPop(netMigration)}`,
            `Total change = ${fmtPop(naturalIncrease)} + ${fmtPop(netMigration)} = ${fmtPop(totalChange)}`,
            `New population = ${fmtPop(p0)} + ${fmtPop(totalChange)} = ${fmtPop(newPop)}`,
            `Growth rate = (${fmtPop(totalChange)} / ${fmtPop(p0)}) \u00D7 100 = ${fmt(growthPct, 3)}%`,
          ],
        };
      }
      case "cagr": {
        if (p0 <= 0 || pf <= 0 || t <= 0) return { results: [{ label: "Error", value: "Enter valid positive values" }], steps: [] };
        const cagr = (Math.pow(pf / p0, 1 / t) - 1) * 100;
        const doublingTime = cagr > 0 ? 70 / cagr : Infinity;
        return {
          results: [
            { label: "CAGR", value: `${fmt(cagr, 3)}%` },
            { label: "Doubling Time", value: `${fmt(doublingTime, 1)} years` },
            { label: "Total Growth", value: `${fmt(((pf - p0) / p0) * 100)}%` },
          ],
          steps: [
            `P\u2080 = ${fmtPop(p0)}, P(t) = ${fmtPop(pf)}, t = ${t} years`,
            `CAGR = (P(t)/P\u2080)^(1/t) - 1`,
            `= (${fmtPop(pf)} / ${fmtPop(p0)})^(1/${t}) - 1`,
            `= ${fmt(pf / p0, 6)}^${fmt(1 / t, 6)} - 1 = ${fmt(cagr, 3)}%`,
            `Doubling time \u2248 70 / CAGR = ${fmt(doublingTime, 1)} years`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, initPop, growthRate, years, finalPop, births, deaths, immigrants, emigrants]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Population Growth Calculator" icon={TrendingUp} iconColor="bg-rose-500">
        <ModeToggle modes={[
          { id: "exponential", label: "Exponential" },
          { id: "arithmetic", label: "Arithmetic" },
          { id: "components", label: "Components" },
          { id: "cagr", label: "CAGR" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <SolverInput label="Initial Population" value={initPop} onChange={setInitPop} placeholder="e.g. 1400000000" />
          {(mode === "exponential") && (
            <>
              <SolverInput label="Annual Growth Rate (%)" value={growthRate} onChange={setGrowthRate} />
              <SolverInput label="Years" value={years} onChange={setYears} />
            </>
          )}
          {(mode === "arithmetic" || mode === "cagr") && (
            <>
              <SolverInput label="Final Population" value={finalPop} onChange={setFinalPop} />
              <SolverInput label="Time Period (years)" value={years} onChange={setYears} />
            </>
          )}
          {mode === "components" && (
            <>
              <SolverInput label="Annual Births" value={births} onChange={setBirths} />
              <SolverInput label="Annual Deaths" value={deaths} onChange={setDeaths} />
              <SolverInput label="Immigrants" value={immigrants} onChange={setImmigrants} />
              <SolverInput label="Emigrants" value={emigrants} onChange={setEmigrants} />
            </>
          )}
        </div>
        <div className="mt-4 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      </ToolCard>
    </div>
  );
}

function PopulationDensity() {
  const [mode, setMode] = useState("basic");
  const [population, setPopulation] = useState("1400000000");
  const [area, setArea] = useState("3287263");
  const [areaUnit, setAreaUnit] = useState("km2");
  const [urbanPop, setUrbanPop] = useState("500000000");
  const [urbanArea, setUrbanArea] = useState("100000");
  const [ruralPop, setRuralPop] = useState("900000000");
  const [ruralArea, setRuralArea] = useState("3187263");
  const [arableLand, setArableLand] = useState("1600000");

  const areaOpts = AREA_UNITS.map(u => ({ value: u.value, label: u.label }));
  const getAreaKm2 = (v: string) => (parseFloat(v) || 0) * (AREA_UNITS.find(u => u.value === areaUnit)?.factor || 1);
  const unitLbl = AREA_UNITS.find(u => u.value === areaUnit)?.label || "km\u00B2";

  const result = useMemo(() => {
    const pop = parseFloat(population) || 0;
    const a = getAreaKm2(area);

    switch (mode) {
      case "basic": {
        const density = a > 0 ? pop / a : 0;
        const perSqMi = density * 2.58999;
        const landPerPerson = a > 0 ? (a * 1e6) / pop : 0;
        return {
          results: [
            { label: "Population Density", value: `${fmt(density)} per km\u00B2` },
            { label: "Per sq mile", value: `${fmt(perSqMi)} per mi\u00B2` },
            { label: "Land per Person", value: `${fmt(landPerPerson)} m\u00B2` },
          ],
          steps: [
            `Population = ${fmtPop(pop)}`,
            `Area = ${area} ${unitLbl} = ${fmt(a)} km\u00B2`,
            `Density = Population / Area = ${fmtPop(pop)} / ${fmt(a)} km\u00B2 = ${fmt(density)} per km\u00B2`,
            `= ${fmt(perSqMi)} per sq mile`,
            `Land per person = ${fmt(a)} km\u00B2 \u00D7 10\u2076 / ${fmtPop(pop)} = ${fmt(landPerPerson)} m\u00B2`,
          ],
        };
      }
      case "urban-rural": {
        const up = parseFloat(urbanPop) || 0;
        const ua = getAreaKm2(urbanArea);
        const rp = parseFloat(ruralPop) || 0;
        const ra = getAreaKm2(ruralArea);
        const urbanDensity = ua > 0 ? up / ua : 0;
        const ruralDensity = ra > 0 ? rp / ra : 0;
        const totalPop = up + rp;
        const urbanPct = totalPop > 0 ? (up / totalPop) * 100 : 0;
        return {
          results: [
            { label: "Urban Density", value: `${fmt(urbanDensity)} per km\u00B2` },
            { label: "Rural Density", value: `${fmt(ruralDensity)} per km\u00B2` },
            { label: "Density Ratio", value: `${fmt(ruralDensity > 0 ? urbanDensity / ruralDensity : 0)}x` },
            { label: "Urban %", value: `${fmt(urbanPct)}%` },
          ],
          steps: [
            `Urban: ${fmtPop(up)} in ${urbanArea} ${unitLbl} = ${fmt(urbanDensity)} per km\u00B2`,
            `Rural: ${fmtPop(rp)} in ${ruralArea} ${unitLbl} = ${fmt(ruralDensity)} per km\u00B2`,
            `Urban density is ${fmt(ruralDensity > 0 ? urbanDensity / ruralDensity : 0)}x rural density`,
            `Urbanization = ${fmtPop(up)} / ${fmtPop(totalPop)} \u00D7 100 = ${fmt(urbanPct)}%`,
          ],
        };
      }
      case "agricultural": {
        const pop = parseFloat(population) || 0;
        const al = getAreaKm2(arableLand);
        const agrDensity = al > 0 ? pop / al : 0;
        const totalA = getAreaKm2(area);
        const arablePct = totalA > 0 ? (al / totalA) * 100 : 0;
        const haPerPerson = al > 0 ? (al * 100) / pop : 0;
        return {
          results: [
            { label: "Agricultural Density", value: `${fmt(agrDensity)} per km\u00B2` },
            { label: "Arable Land %", value: `${fmt(arablePct)}%` },
            { label: "Hectares per Person", value: `${fmt(haPerPerson, 4)} ha` },
          ],
          steps: [
            `Population = ${fmtPop(pop)}`,
            `Arable land = ${arableLand} ${unitLbl} = ${fmt(al)} km\u00B2`,
            `Agricultural density = ${fmtPop(pop)} / ${fmt(al)} = ${fmt(agrDensity)} per km\u00B2`,
            `Arable % of total = (${fmt(al)} / ${fmt(totalA)}) \u00D7 100 = ${fmt(arablePct)}%`,
            `Hectares per person = (${fmt(al)} \u00D7 100) / ${fmtPop(pop)} = ${fmt(haPerPerson, 4)} ha`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, population, area, areaUnit, urbanPop, urbanArea, ruralPop, ruralArea, arableLand]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Population Density Tool" icon={Users} iconColor="bg-rose-500">
        <ModeToggle modes={[
          { id: "basic", label: "Basic Density" },
          { id: "urban-rural", label: "Urban vs Rural" },
          { id: "agricultural", label: "Agricultural" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <SolverSelect label="Area Unit" value={areaUnit} onChange={setAreaUnit} options={areaOpts} />
          {mode === "basic" && (
            <>
              <SolverInput label="Total Population" value={population} onChange={setPopulation} />
              <SolverInput label={`Total Area (${unitLbl})`} value={area} onChange={setArea} />
            </>
          )}
          {mode === "urban-rural" && (
            <>
              <SolverInput label="Urban Population" value={urbanPop} onChange={setUrbanPop} />
              <SolverInput label={`Urban Area (${unitLbl})`} value={urbanArea} onChange={setUrbanArea} />
              <SolverInput label="Rural Population" value={ruralPop} onChange={setRuralPop} />
              <SolverInput label={`Rural Area (${unitLbl})`} value={ruralArea} onChange={setRuralArea} />
            </>
          )}
          {mode === "agricultural" && (
            <>
              <SolverInput label="Total Population" value={population} onChange={setPopulation} />
              <SolverInput label={`Total Area (${unitLbl})`} value={area} onChange={setArea} />
              <SolverInput label={`Arable Land (${unitLbl})`} value={arableLand} onChange={setArableLand} />
            </>
          )}
        </div>
        <div className="mt-4 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      </ToolCard>
    </div>
  );
}

function BirthRate() {
  const [mode, setMode] = useState("crude");
  const [births, setBirths] = useState("20000000");
  const [population, setPopulation] = useState("1400000000");
  const [women1549, setWomen1549] = useState("350000000");
  const [livebirths, setLivebirths] = useState("20000000");
  const [infantDeaths, setInfantDeaths] = useState("500000");
  const [neonatalDeaths, setNeonatalDeaths] = useState("200000");
  const [years, setYears] = useState("5");
  const [prevRate, setPrevRate] = useState("22");

  const result = useMemo(() => {
    const b = parseFloat(births) || 0;
    const p = parseFloat(population) || 0;
    const w = parseFloat(women1549) || 0;
    const lb = parseFloat(livebirths) || 0;
    const id = parseFloat(infantDeaths) || 0;
    const nd = parseFloat(neonatalDeaths) || 0;

    switch (mode) {
      case "crude": {
        const cbr = p > 0 ? (b / p) * 1000 : 0;
        const level = cbr < 10 ? "Very Low" : cbr < 15 ? "Low" : cbr < 25 ? "Moderate" : cbr < 35 ? "High" : "Very High";
        return {
          results: [
            { label: "Crude Birth Rate (CBR)", value: `${fmt(cbr)} per 1,000` },
            { label: "Level", value: level },
            { label: "Annual Births", value: fmtPop(b) },
          ],
          steps: [
            `CBR = (Births / Mid-year Population) \u00D7 1,000`,
            `= (${fmtPop(b)} / ${fmtPop(p)}) \u00D7 1,000`,
            `= ${fmt(cbr)} per 1,000 population`,
            `Classification: ${level}`,
          ],
        };
      }
      case "fertility": {
        const gfr = w > 0 ? (b / w) * 1000 : 0;
        const tfr = gfr * 35 / 1000;
        const replacement = tfr >= 2.1 ? "Above replacement" : "Below replacement";
        return {
          results: [
            { label: "General Fertility Rate", value: `${fmt(gfr)} per 1,000` },
            { label: "Est. Total Fertility Rate", value: fmt(tfr, 2) },
            { label: "Replacement Status", value: replacement },
          ],
          steps: [
            `GFR = (Births / Women aged 15-49) \u00D7 1,000`,
            `= (${fmtPop(b)} / ${fmtPop(w)}) \u00D7 1,000 = ${fmt(gfr)} per 1,000`,
            `Estimated TFR \u2248 GFR \u00D7 35 / 1000 = ${fmt(tfr, 2)}`,
            `Replacement level = 2.1 children per woman`,
            `Status: ${replacement}`,
          ],
        };
      }
      case "infant-mortality": {
        const imr = lb > 0 ? (id / lb) * 1000 : 0;
        const nmr = lb > 0 ? (nd / lb) * 1000 : 0;
        const pnmr = imr - nmr;
        const level = imr < 5 ? "Very Low" : imr < 15 ? "Low" : imr < 30 ? "Moderate" : imr < 50 ? "High" : "Very High";
        return {
          results: [
            { label: "Infant Mortality Rate", value: `${fmt(imr)} per 1,000` },
            { label: "Neonatal Mortality Rate", value: `${fmt(nmr)} per 1,000` },
            { label: "Post-neonatal Rate", value: `${fmt(pnmr)} per 1,000` },
            { label: "Level", value: level },
          ],
          steps: [
            `IMR = (Infant deaths / Live births) \u00D7 1,000`,
            `= (${fmtPop(id)} / ${fmtPop(lb)}) \u00D7 1,000 = ${fmt(imr)} per 1,000`,
            `NMR = (${fmtPop(nd)} / ${fmtPop(lb)}) \u00D7 1,000 = ${fmt(nmr)} per 1,000`,
            `Post-neonatal = IMR - NMR = ${fmt(pnmr)} per 1,000`,
          ],
        };
      }
      case "trend": {
        const currentRate = p > 0 ? (b / p) * 1000 : 0;
        const prev = parseFloat(prevRate) || 0;
        const t = parseFloat(years) || 1;
        const change = currentRate - prev;
        const pctChange = prev > 0 ? (change / prev) * 100 : 0;
        const annualChange = change / t;
        return {
          results: [
            { label: "Current CBR", value: `${fmt(currentRate)} per 1,000` },
            { label: "Previous CBR", value: `${fmt(prev)} per 1,000` },
            { label: "Change", value: `${fmt(change)} (${fmt(pctChange)}%)` },
            { label: "Annual Change", value: `${fmt(annualChange, 3)} per year` },
          ],
          steps: [
            `Current CBR = ${fmt(currentRate)} per 1,000`,
            `Previous CBR = ${fmt(prev)} per 1,000 (${t} years ago)`,
            `Change = ${fmt(currentRate)} - ${fmt(prev)} = ${fmt(change)}`,
            `% change = (${fmt(change)} / ${fmt(prev)}) \u00D7 100 = ${fmt(pctChange)}%`,
            `Annual change = ${fmt(change)} / ${t} = ${fmt(annualChange, 3)} per year`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, births, population, women1549, livebirths, infantDeaths, neonatalDeaths, years, prevRate]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Birth Rate Calculator" icon={Baby} iconColor="bg-rose-500">
        <ModeToggle modes={[
          { id: "crude", label: "Crude Birth Rate" },
          { id: "fertility", label: "Fertility Rate" },
          { id: "infant-mortality", label: "Infant Mortality" },
          { id: "trend", label: "Trend Analysis" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          {mode === "crude" && (
            <>
              <SolverInput label="Annual Births" value={births} onChange={setBirths} />
              <SolverInput label="Mid-year Population" value={population} onChange={setPopulation} />
            </>
          )}
          {mode === "fertility" && (
            <>
              <SolverInput label="Annual Births" value={births} onChange={setBirths} />
              <SolverInput label="Women aged 15-49" value={women1549} onChange={setWomen1549} />
            </>
          )}
          {mode === "infant-mortality" && (
            <>
              <SolverInput label="Live Births" value={livebirths} onChange={setLivebirths} />
              <SolverInput label="Infant Deaths (under 1)" value={infantDeaths} onChange={setInfantDeaths} />
              <SolverInput label="Neonatal Deaths (under 28 days)" value={neonatalDeaths} onChange={setNeonatalDeaths} />
            </>
          )}
          {mode === "trend" && (
            <>
              <SolverInput label="Annual Births" value={births} onChange={setBirths} />
              <SolverInput label="Mid-year Population" value={population} onChange={setPopulation} />
              <SolverInput label="Previous CBR (per 1,000)" value={prevRate} onChange={setPrevRate} />
              <SolverInput label="Years Between" value={years} onChange={setYears} />
            </>
          )}
        </div>
        <div className="mt-4 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      </ToolCard>
    </div>
  );
}

function DeathRate() {
  const [mode, setMode] = useState("crude");
  const [deaths, setDeaths] = useState("10000000");
  const [population, setPopulation] = useState("1400000000");
  const [ageDeaths, setAgeDeaths] = useState("5000");
  const [agePop, setAgePop] = useState("50000000");
  const [ageGroup, setAgeGroup] = useState("65+");
  const [maternalDeaths, setMaternalDeaths] = useState("35000");
  const [liveBirths, setLiveBirths] = useState("20000000");
  const [under5Deaths, setUnder5Deaths] = useState("800000");

  const result = useMemo(() => {
    const d = parseFloat(deaths) || 0;
    const p = parseFloat(population) || 0;

    switch (mode) {
      case "crude": {
        const cdr = p > 0 ? (d / p) * 1000 : 0;
        const level = cdr < 5 ? "Very Low" : cdr < 8 ? "Low" : cdr < 12 ? "Moderate" : cdr < 18 ? "High" : "Very High";
        const lifeExpEst = cdr > 0 ? 1000 / cdr : 0;
        return {
          results: [
            { label: "Crude Death Rate", value: `${fmt(cdr)} per 1,000` },
            { label: "Level", value: level },
            { label: "Est. Life Expectancy", value: `~${fmt(lifeExpEst, 0)} years` },
          ],
          steps: [
            `CDR = (Deaths / Mid-year Population) \u00D7 1,000`,
            `= (${fmtPop(d)} / ${fmtPop(p)}) \u00D7 1,000 = ${fmt(cdr)} per 1,000`,
            `Rough life expectancy estimate = 1000 / CDR \u2248 ${fmt(lifeExpEst, 0)} years`,
          ],
        };
      }
      case "age-specific": {
        const ad = parseFloat(ageDeaths) || 0;
        const ap = parseFloat(agePop) || 0;
        const asdr = ap > 0 ? (ad / ap) * 1000 : 0;
        return {
          results: [
            { label: `ASDR (${ageGroup})`, value: `${fmt(asdr)} per 1,000` },
            { label: "Deaths in Group", value: fmtPop(ad) },
            { label: "Population in Group", value: fmtPop(ap) },
          ],
          steps: [
            `Age group: ${ageGroup}`,
            `ASDR = (Deaths in age group / Population in age group) \u00D7 1,000`,
            `= (${fmtPop(ad)} / ${fmtPop(ap)}) \u00D7 1,000 = ${fmt(asdr)} per 1,000`,
          ],
        };
      }
      case "maternal": {
        const md = parseFloat(maternalDeaths) || 0;
        const lb = parseFloat(liveBirths) || 0;
        const mmr = lb > 0 ? (md / lb) * 100000 : 0;
        const level = mmr < 20 ? "Very Low" : mmr < 100 ? "Low" : mmr < 300 ? "Moderate" : "High";
        return {
          results: [
            { label: "Maternal Mortality Ratio", value: `${fmt(mmr)} per 100,000` },
            { label: "Level", value: level },
          ],
          steps: [
            `MMR = (Maternal Deaths / Live Births) \u00D7 100,000`,
            `= (${fmtPop(md)} / ${fmtPop(lb)}) \u00D7 100,000 = ${fmt(mmr)} per 100,000 live births`,
            `Classification: ${level}`,
          ],
        };
      }
      case "under5": {
        const u5 = parseFloat(under5Deaths) || 0;
        const lb = parseFloat(liveBirths) || 0;
        const u5mr = lb > 0 ? (u5 / lb) * 1000 : 0;
        const level = u5mr < 5 ? "Very Low" : u5mr < 15 ? "Low" : u5mr < 40 ? "Moderate" : u5mr < 70 ? "High" : "Very High";
        return {
          results: [
            { label: "Under-5 Mortality Rate", value: `${fmt(u5mr)} per 1,000` },
            { label: "Level", value: level },
            { label: "Survival Rate", value: `${fmt(1000 - u5mr)} per 1,000` },
          ],
          steps: [
            `U5MR = (Under-5 deaths / Live births) \u00D7 1,000`,
            `= (${fmtPop(u5)} / ${fmtPop(lb)}) \u00D7 1,000 = ${fmt(u5mr)} per 1,000`,
            `Survival rate = 1000 - ${fmt(u5mr)} = ${fmt(1000 - u5mr)} per 1,000`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, deaths, population, ageDeaths, agePop, ageGroup, maternalDeaths, liveBirths, under5Deaths]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Death Rate Calculator" icon={Skull} iconColor="bg-rose-500">
        <ModeToggle modes={[
          { id: "crude", label: "Crude Death Rate" },
          { id: "age-specific", label: "Age-Specific" },
          { id: "maternal", label: "Maternal" },
          { id: "under5", label: "Under-5" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          {mode === "crude" && (
            <>
              <SolverInput label="Annual Deaths" value={deaths} onChange={setDeaths} />
              <SolverInput label="Mid-year Population" value={population} onChange={setPopulation} />
            </>
          )}
          {mode === "age-specific" && (
            <>
              <SolverSelect label="Age Group" value={ageGroup} onChange={setAgeGroup} options={[
                { value: "0-4", label: "0-4 years" }, { value: "5-14", label: "5-14 years" },
                { value: "15-24", label: "15-24 years" }, { value: "25-44", label: "25-44 years" },
                { value: "45-64", label: "45-64 years" }, { value: "65+", label: "65+ years" },
              ]} />
              <SolverInput label="Deaths in Age Group" value={ageDeaths} onChange={setAgeDeaths} />
              <SolverInput label="Population in Age Group" value={agePop} onChange={setAgePop} />
            </>
          )}
          {mode === "maternal" && (
            <>
              <SolverInput label="Maternal Deaths" value={maternalDeaths} onChange={setMaternalDeaths} />
              <SolverInput label="Live Births" value={liveBirths} onChange={setLiveBirths} />
            </>
          )}
          {mode === "under5" && (
            <>
              <SolverInput label="Under-5 Deaths" value={under5Deaths} onChange={setUnder5Deaths} />
              <SolverInput label="Live Births" value={liveBirths} onChange={setLiveBirths} />
            </>
          )}
        </div>
        <div className="mt-4 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      </ToolCard>
    </div>
  );
}

function MigrationRate() {
  const [mode, setMode] = useState("net");
  const [immigrants, setImmigrants] = useState("500000");
  const [emigrants, setEmigrants] = useState("300000");
  const [population, setPopulation] = useState("1400000000");
  const [popStart, setPopStart] = useState("1380000000");
  const [popEnd, setPopEnd] = useState("1400000000");
  const [births, setBirths] = useState("20000000");
  const [deaths, setDeaths] = useState("10000000");

  const result = useMemo(() => {
    const imm = parseFloat(immigrants) || 0;
    const em = parseFloat(emigrants) || 0;
    const p = parseFloat(population) || 0;

    switch (mode) {
      case "net": {
        const net = imm - em;
        const nmr = p > 0 ? (net / p) * 1000 : 0;
        const immRate = p > 0 ? (imm / p) * 1000 : 0;
        const emRate = p > 0 ? (em / p) * 1000 : 0;
        return {
          results: [
            { label: "Net Migration", value: fmtPop(net) },
            { label: "Net Migration Rate", value: `${fmt(nmr)} per 1,000` },
            { label: "Immigration Rate", value: `${fmt(immRate)} per 1,000` },
            { label: "Emigration Rate", value: `${fmt(emRate)} per 1,000` },
          ],
          steps: [
            `Net migration = Immigrants - Emigrants = ${fmtPop(imm)} - ${fmtPop(em)} = ${fmtPop(net)}`,
            `NMR = (Net migration / Population) \u00D7 1,000 = ${fmt(nmr)} per 1,000`,
            `Immigration rate = (${fmtPop(imm)} / ${fmtPop(p)}) \u00D7 1,000 = ${fmt(immRate)} per 1,000`,
            `Emigration rate = (${fmtPop(em)} / ${fmtPop(p)}) \u00D7 1,000 = ${fmt(emRate)} per 1,000`,
          ],
        };
      }
      case "residual": {
        const ps = parseFloat(popStart) || 0;
        const pe = parseFloat(popEnd) || 0;
        const b = parseFloat(births) || 0;
        const d = parseFloat(deaths) || 0;
        const naturalIncrease = b - d;
        const totalChange = pe - ps;
        const netMig = totalChange - naturalIncrease;
        const nmr = ps > 0 ? (netMig / ps) * 1000 : 0;
        return {
          results: [
            { label: "Estimated Net Migration", value: fmtPop(netMig) },
            { label: "Net Migration Rate", value: `${fmt(nmr)} per 1,000` },
            { label: "Natural Increase", value: fmtPop(naturalIncrease) },
            { label: "Total Pop. Change", value: fmtPop(totalChange) },
          ],
          steps: [
            `Population: Start = ${fmtPop(ps)}, End = ${fmtPop(pe)}`,
            `Total change = ${fmtPop(pe)} - ${fmtPop(ps)} = ${fmtPop(totalChange)}`,
            `Natural increase = Births - Deaths = ${fmtPop(b)} - ${fmtPop(d)} = ${fmtPop(naturalIncrease)}`,
            `Net migration = Total change - Natural increase = ${fmtPop(totalChange)} - ${fmtPop(naturalIncrease)} = ${fmtPop(netMig)}`,
            `NMR = (${fmtPop(netMig)} / ${fmtPop(ps)}) \u00D7 1,000 = ${fmt(nmr)} per 1,000`,
          ],
        };
      }
      case "effectiveness": {
        const total = imm + em;
        const net = Math.abs(imm - em);
        const eff = total > 0 ? (net / total) * 100 : 0;
        const direction = imm > em ? "Net inflow" : imm < em ? "Net outflow" : "Balanced";
        return {
          results: [
            { label: "Migration Effectiveness", value: `${fmt(eff)}%` },
            { label: "Direction", value: direction },
            { label: "Total Movement", value: fmtPop(total) },
            { label: "Net Flow", value: fmtPop(imm - em) },
          ],
          steps: [
            `Total migration = Immigrants + Emigrants = ${fmtPop(imm)} + ${fmtPop(em)} = ${fmtPop(total)}`,
            `Net = |Immigrants - Emigrants| = ${fmtPop(net)}`,
            `Effectiveness = (Net / Total) \u00D7 100 = (${fmtPop(net)} / ${fmtPop(total)}) \u00D7 100 = ${fmt(eff)}%`,
            `100% = one-directional, 0% = equal in/out`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, immigrants, emigrants, population, popStart, popEnd, births, deaths]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Migration Rate Tool" icon={Plane} iconColor="bg-rose-500">
        <ModeToggle modes={[
          { id: "net", label: "Net Migration" },
          { id: "residual", label: "Residual Method" },
          { id: "effectiveness", label: "Effectiveness" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          {mode === "net" && (
            <>
              <SolverInput label="Immigrants" value={immigrants} onChange={setImmigrants} />
              <SolverInput label="Emigrants" value={emigrants} onChange={setEmigrants} />
              <SolverInput label="Mid-year Population" value={population} onChange={setPopulation} />
            </>
          )}
          {mode === "residual" && (
            <>
              <SolverInput label="Population (Start)" value={popStart} onChange={setPopStart} />
              <SolverInput label="Population (End)" value={popEnd} onChange={setPopEnd} />
              <SolverInput label="Births in Period" value={births} onChange={setBirths} />
              <SolverInput label="Deaths in Period" value={deaths} onChange={setDeaths} />
            </>
          )}
          {mode === "effectiveness" && (
            <>
              <SolverInput label="Immigrants" value={immigrants} onChange={setImmigrants} />
              <SolverInput label="Emigrants" value={emigrants} onChange={setEmigrants} />
            </>
          )}
        </div>
        <div className="mt-4 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      </ToolCard>
    </div>
  );
}

function WorkingPopulation() {
  const [mode, setMode] = useState("labor");
  const [totalPop, setTotalPop] = useState("1400000000");
  const [workingAge, setWorkingAge] = useState("950000000");
  const [employed, setEmployed] = useState("500000000");
  const [unemployed, setUnemployed] = useState("30000000");
  const [laborForce, setLaborForce] = useState("530000000");
  const [sectorPrimary, setSectorPrimary] = useState("42");
  const [sectorSecondary, setSectorSecondary] = useState("26");
  const [sectorTertiary, setSectorTertiary] = useState("32");

  const result = useMemo(() => {
    const total = parseFloat(totalPop) || 0;
    const wa = parseFloat(workingAge) || 0;
    const emp = parseFloat(employed) || 0;
    const unemp = parseFloat(unemployed) || 0;
    const lf = parseFloat(laborForce) || 0;

    switch (mode) {
      case "labor": {
        const lfpr = wa > 0 ? (lf / wa) * 100 : 0;
        const empRate = lf > 0 ? (emp / lf) * 100 : 0;
        const unempRate = lf > 0 ? (unemp / lf) * 100 : 0;
        const waPct = total > 0 ? (wa / total) * 100 : 0;
        return {
          results: [
            { label: "Labor Force Participation", value: `${fmt(lfpr)}%` },
            { label: "Employment Rate", value: `${fmt(empRate)}%` },
            { label: "Unemployment Rate", value: `${fmt(unempRate)}%` },
            { label: "Working-age % of Total", value: `${fmt(waPct)}%` },
          ],
          steps: [
            `Total population = ${fmtPop(total)}`,
            `Working-age (15-64) = ${fmtPop(wa)} (${fmt(waPct)}% of total)`,
            `Labor force = ${fmtPop(lf)}`,
            `LFPR = (Labor force / Working-age) \u00D7 100 = ${fmt(lfpr)}%`,
            `Employment rate = (Employed / Labor force) \u00D7 100 = ${fmt(empRate)}%`,
            `Unemployment rate = (Unemployed / Labor force) \u00D7 100 = ${fmt(unempRate)}%`,
          ],
        };
      }
      case "sector": {
        const p = parseFloat(sectorPrimary) || 0;
        const s = parseFloat(sectorSecondary) || 0;
        const t = parseFloat(sectorTertiary) || 0;
        const sum = p + s + t;
        const primW = emp * p / 100;
        const secW = emp * s / 100;
        const terW = emp * t / 100;
        return {
          results: [
            { label: "Primary (Agriculture)", value: `${fmt(p)}% (${fmtPop(primW)})` },
            { label: "Secondary (Industry)", value: `${fmt(s)}% (${fmtPop(secW)})` },
            { label: "Tertiary (Services)", value: `${fmt(t)}% (${fmtPop(terW)})` },
            { label: "Total Check", value: `${fmt(sum)}%` },
          ],
          steps: [
            `Total employed = ${fmtPop(emp)}`,
            `Primary sector: ${fmt(p)}% = ${fmtPop(primW)} workers`,
            `Secondary sector: ${fmt(s)}% = ${fmtPop(secW)} workers`,
            `Tertiary sector: ${fmt(t)}% = ${fmtPop(terW)} workers`,
            sum !== 100 ? `Warning: Sectors sum to ${fmt(sum)}%, should be 100%` : `Sectors sum to 100% \u2713`,
          ],
        };
      }
      case "productivity": {
        const gdp = wa * 0.1;
        const perWorker = emp > 0 ? (total * 2500) / emp : 0;
        const perCapita = total > 0 ? (total * 2500) / total : 2500;
        const ratio = perCapita > 0 ? perWorker / perCapita : 0;
        return {
          results: [
            { label: "Workers per 1,000 Pop.", value: fmt(total > 0 ? (emp / total) * 1000 : 0) },
            { label: "Employment-to-Pop. Ratio", value: `${fmt(total > 0 ? (emp / total) * 100 : 0)}%` },
            { label: "Non-working per Worker", value: fmt(emp > 0 ? (total - emp) / emp : 0) },
          ],
          steps: [
            `Employed = ${fmtPop(emp)}, Total = ${fmtPop(total)}`,
            `Workers per 1,000 = (${fmtPop(emp)} / ${fmtPop(total)}) \u00D7 1,000 = ${fmt(total > 0 ? (emp / total) * 1000 : 0)}`,
            `Employment ratio = ${fmt(total > 0 ? (emp / total) * 100 : 0)}%`,
            `Each worker supports ${fmt(emp > 0 ? (total - emp) / emp : 0)} non-workers`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, totalPop, workingAge, employed, unemployed, laborForce, sectorPrimary, sectorSecondary, sectorTertiary]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Working Population Estimator" icon={Briefcase} iconColor="bg-rose-500">
        <ModeToggle modes={[
          { id: "labor", label: "Labor Force" },
          { id: "sector", label: "By Sector" },
          { id: "productivity", label: "Productivity" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          {(mode === "labor" || mode === "productivity") && (
            <>
              <SolverInput label="Total Population" value={totalPop} onChange={setTotalPop} />
              <SolverInput label="Working-age (15-64)" value={workingAge} onChange={setWorkingAge} />
              <SolverInput label="Employed" value={employed} onChange={setEmployed} />
            </>
          )}
          {mode === "labor" && (
            <>
              <SolverInput label="Unemployed" value={unemployed} onChange={setUnemployed} />
              <SolverInput label="Labor Force" value={laborForce} onChange={setLaborForce} />
            </>
          )}
          {mode === "sector" && (
            <>
              <SolverInput label="Total Employed" value={employed} onChange={setEmployed} />
              <SolverInput label="Primary Sector (%)" value={sectorPrimary} onChange={setSectorPrimary} placeholder="e.g. 42" />
              <SolverInput label="Secondary Sector (%)" value={sectorSecondary} onChange={setSectorSecondary} placeholder="e.g. 26" />
              <SolverInput label="Tertiary Sector (%)" value={sectorTertiary} onChange={setSectorTertiary} placeholder="e.g. 32" />
            </>
          )}
        </div>
        <div className="mt-4 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      </ToolCard>
    </div>
  );
}

function DependencyRatio() {
  const [mode, setMode] = useState("total");
  const [pop0_14, setPop0_14] = useState("350000000");
  const [pop15_64, setPop15_64] = useState("950000000");
  const [pop65plus, setPop65plus] = useState("100000000");
  const [totalPop, setTotalPop] = useState("1400000000");

  const result = useMemo(() => {
    const young = parseFloat(pop0_14) || 0;
    const working = parseFloat(pop15_64) || 0;
    const old = parseFloat(pop65plus) || 0;
    const total = parseFloat(totalPop) || 0;

    switch (mode) {
      case "total": {
        const dependent = young + old;
        const tdr = working > 0 ? (dependent / working) * 100 : 0;
        const ydr = working > 0 ? (young / working) * 100 : 0;
        const odr = working > 0 ? (old / working) * 100 : 0;
        const supportRatio = dependent > 0 ? working / dependent : 0;
        return {
          results: [
            { label: "Total Dependency Ratio", value: `${fmt(tdr)}` },
            { label: "Youth Dependency", value: `${fmt(ydr)}` },
            { label: "Old-age Dependency", value: `${fmt(odr)}` },
            { label: "Support Ratio", value: `${fmt(supportRatio, 1)} workers per dependent` },
          ],
          steps: [
            `Youth (0-14) = ${fmtPop(young)}`,
            `Working-age (15-64) = ${fmtPop(working)}`,
            `Old-age (65+) = ${fmtPop(old)}`,
            `Total dependents = ${fmtPop(young)} + ${fmtPop(old)} = ${fmtPop(dependent)}`,
            `TDR = (Dependents / Working-age) \u00D7 100 = ${fmt(tdr)}`,
            `Youth DR = (${fmtPop(young)} / ${fmtPop(working)}) \u00D7 100 = ${fmt(ydr)}`,
            `Old-age DR = (${fmtPop(old)} / ${fmtPop(working)}) \u00D7 100 = ${fmt(odr)}`,
            `Support ratio = ${fmtPop(working)} / ${fmtPop(dependent)} = ${fmt(supportRatio, 1)}`,
          ],
        };
      }
      case "aging-index": {
        const agingIndex = young > 0 ? (old / young) * 100 : 0;
        const medianAgeEst = total > 0 ? 20 + (old / total) * 80 : 0;
        const youngPct = total > 0 ? (young / total) * 100 : 0;
        const oldPct = total > 0 ? (old / total) * 100 : 0;
        const classification = agingIndex < 30 ? "Young population" : agingIndex < 50 ? "Transitioning" : agingIndex < 100 ? "Aging" : "Aged population";
        return {
          results: [
            { label: "Aging Index", value: fmt(agingIndex) },
            { label: "Classification", value: classification },
            { label: "Youth %", value: `${fmt(youngPct)}%` },
            { label: "Elderly %", value: `${fmt(oldPct)}%` },
          ],
          steps: [
            `Aging Index = (65+ / 0-14) \u00D7 100`,
            `= (${fmtPop(old)} / ${fmtPop(young)}) \u00D7 100 = ${fmt(agingIndex)}`,
            `< 30 = Young, 30-50 = Transitioning, 50-100 = Aging, > 100 = Aged`,
            `Youth share = ${fmt(youngPct)}%, Elderly share = ${fmt(oldPct)}%`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, pop0_14, pop15_64, pop65plus, totalPop]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Dependency Ratio Calculator" icon={PieChart} iconColor="bg-rose-500">
        <ModeToggle modes={[
          { id: "total", label: "Dependency Ratios" },
          { id: "aging-index", label: "Aging Index" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <SolverInput label="Population 0-14 (Youth)" value={pop0_14} onChange={setPop0_14} />
          <SolverInput label="Population 15-64 (Working)" value={pop15_64} onChange={setPop15_64} />
          <SolverInput label="Population 65+ (Elderly)" value={pop65plus} onChange={setPop65plus} />
          {mode === "aging-index" && <SolverInput label="Total Population" value={totalPop} onChange={setTotalPop} />}
        </div>
        <div className="mt-4 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      </ToolCard>
    </div>
  );
}

function YouthPopulation() {
  const [mode, setMode] = useState("analysis");
  const [totalPop, setTotalPop] = useState("1400000000");
  const [youth15_24, setYouth15_24] = useState("250000000");
  const [youth15_29, setYouth15_29] = useState("370000000");
  const [youthEmployed, setYouthEmployed] = useState("80000000");
  const [youthLabor, setYouthLabor] = useState("120000000");
  const [youthLiterate, setYouthLiterate] = useState("230000000");
  const [enrolled, setEnrolled] = useState("180000000");
  const [neetCount, setNeetCount] = useState("50000000");

  const result = useMemo(() => {
    const total = parseFloat(totalPop) || 0;
    const y24 = parseFloat(youth15_24) || 0;
    const y29 = parseFloat(youth15_29) || 0;
    const ye = parseFloat(youthEmployed) || 0;
    const yl = parseFloat(youthLabor) || 0;
    const ylit = parseFloat(youthLiterate) || 0;
    const enr = parseFloat(enrolled) || 0;
    const neet = parseFloat(neetCount) || 0;

    switch (mode) {
      case "analysis": {
        const youthPct = total > 0 ? (y24 / total) * 100 : 0;
        const youthBulge = youthPct > 20;
        const youthPct29 = total > 0 ? (y29 / total) * 100 : 0;
        const demographicDiv = youthPct > 15 ? "Potential demographic dividend" : "Past demographic dividend window";
        return {
          results: [
            { label: "Youth (15-24) Share", value: `${fmt(youthPct)}%` },
            { label: "Youth (15-29) Share", value: `${fmt(youthPct29)}%` },
            { label: "Youth Bulge?", value: youthBulge ? "Yes" : "No" },
            { label: "Demographic Dividend", value: demographicDiv },
          ],
          steps: [
            `Total population = ${fmtPop(total)}`,
            `Youth (15-24) = ${fmtPop(y24)}, share = ${fmt(youthPct)}%`,
            `Youth (15-29) = ${fmtPop(y29)}, share = ${fmt(youthPct29)}%`,
            `Youth bulge = share > 20% \u2192 ${youthBulge ? "Yes" : "No"}`,
            `Demographic dividend: ${demographicDiv}`,
          ],
        };
      }
      case "employment": {
        const youthUnempRate = yl > 0 ? ((yl - ye) / yl) * 100 : 0;
        const youthEmpRate = yl > 0 ? (ye / yl) * 100 : 0;
        const lfpr = y24 > 0 ? (yl / y24) * 100 : 0;
        const neetRate = y24 > 0 ? (neet / y24) * 100 : 0;
        return {
          results: [
            { label: "Youth Unemployment Rate", value: `${fmt(youthUnempRate)}%` },
            { label: "Youth Employment Rate", value: `${fmt(youthEmpRate)}%` },
            { label: "Youth LFPR", value: `${fmt(lfpr)}%` },
            { label: "NEET Rate", value: `${fmt(neetRate)}%` },
          ],
          steps: [
            `Youth labor force = ${fmtPop(yl)}`,
            `Youth employed = ${fmtPop(ye)}`,
            `Youth unemployment = (${fmtPop(yl)} - ${fmtPop(ye)}) / ${fmtPop(yl)} \u00D7 100 = ${fmt(youthUnempRate)}%`,
            `Youth LFPR = ${fmtPop(yl)} / ${fmtPop(y24)} \u00D7 100 = ${fmt(lfpr)}%`,
            `NEET (Not in Education/Employment/Training) = ${fmtPop(neet)}`,
            `NEET rate = ${fmtPop(neet)} / ${fmtPop(y24)} \u00D7 100 = ${fmt(neetRate)}%`,
          ],
        };
      }
      case "education": {
        const litRate = y24 > 0 ? (ylit / y24) * 100 : 0;
        const enrollRate = y24 > 0 ? (enr / y24) * 100 : 0;
        const outOfSchool = y24 - enr;
        const outPct = y24 > 0 ? (outOfSchool / y24) * 100 : 0;
        return {
          results: [
            { label: "Youth Literacy Rate", value: `${fmt(litRate)}%` },
            { label: "Enrollment Rate", value: `${fmt(enrollRate)}%` },
            { label: "Out of School", value: fmtPop(Math.max(0, outOfSchool)) },
            { label: "Out of School %", value: `${fmt(Math.max(0, outPct))}%` },
          ],
          steps: [
            `Youth (15-24) = ${fmtPop(y24)}`,
            `Literate youth = ${fmtPop(ylit)}`,
            `Literacy rate = (${fmtPop(ylit)} / ${fmtPop(y24)}) \u00D7 100 = ${fmt(litRate)}%`,
            `Enrolled = ${fmtPop(enr)}`,
            `Enrollment rate = (${fmtPop(enr)} / ${fmtPop(y24)}) \u00D7 100 = ${fmt(enrollRate)}%`,
            `Out of school = ${fmtPop(y24)} - ${fmtPop(enr)} = ${fmtPop(Math.max(0, outOfSchool))}`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, totalPop, youth15_24, youth15_29, youthEmployed, youthLabor, youthLiterate, enrolled, neetCount]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Youth Population Tool" icon={User} iconColor="bg-rose-500">
        <ModeToggle modes={[
          { id: "analysis", label: "Youth Analysis" },
          { id: "employment", label: "Employment" },
          { id: "education", label: "Education" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          {mode === "analysis" && (
            <>
              <SolverInput label="Total Population" value={totalPop} onChange={setTotalPop} />
              <SolverInput label="Youth (15-24)" value={youth15_24} onChange={setYouth15_24} />
              <SolverInput label="Youth (15-29)" value={youth15_29} onChange={setYouth15_29} />
            </>
          )}
          {mode === "employment" && (
            <>
              <SolverInput label="Youth (15-24)" value={youth15_24} onChange={setYouth15_24} />
              <SolverInput label="Youth Labor Force" value={youthLabor} onChange={setYouthLabor} />
              <SolverInput label="Youth Employed" value={youthEmployed} onChange={setYouthEmployed} />
              <SolverInput label="NEET Count" value={neetCount} onChange={setNeetCount} />
            </>
          )}
          {mode === "education" && (
            <>
              <SolverInput label="Youth (15-24)" value={youth15_24} onChange={setYouth15_24} />
              <SolverInput label="Literate Youth" value={youthLiterate} onChange={setYouthLiterate} />
              <SolverInput label="Enrolled in Education" value={enrolled} onChange={setEnrolled} />
            </>
          )}
        </div>
        <div className="mt-4 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      </ToolCard>
    </div>
  );
}
