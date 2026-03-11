import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Leaf, Wheat, Droplets, MapPin, Fuel, Calculator, DollarSign, Tractor } from "lucide-react";
import { ToolCard, InputField } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "yield" | "seed" | "fertilizer" | "land" | "plot" | "irrigation" | "tractor" | "profit";

const CURRENCIES = [
  { code: "INR", symbol: "₹" }, { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" }, { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" }, { code: "CNY", symbol: "¥" },
  { code: "AUD", symbol: "A$" }, { code: "CAD", symbol: "C$" },
  { code: "AED", symbol: "د.إ" }, { code: "SGD", symbol: "S$" },
];
function cs(code: string) { return CURRENCIES.find(c => c.code === code)?.symbol || "₹"; }
function CurrencySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="bg-muted/50 border border-border rounded-lg px-2 py-1.5 text-sm text-foreground focus:outline-none" data-testid="select-currency">
      {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
    </select>
  );
}
function ModeBar({ modes, active, onChange, color = "bg-green-600" }: { modes: { id: string; label: string }[]; active: string; onChange: (id: string) => void; color?: string }) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-xl mb-4 flex-wrap">
      {modes.map(m => (
        <button key={m.id} onClick={() => onChange(m.id)} data-testid={`mode-${m.id}`}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex-1 ${active === m.id ? `${color} text-white shadow-sm` : "text-muted-foreground hover:text-foreground"}`}>
          {m.label}
        </button>
      ))}
    </div>
  );
}
function Row({ label, value, hi, accent }: { label: string; value: string; hi?: boolean; accent?: string }) {
  return (
    <div className={`flex justify-between items-center p-2.5 rounded-xl ${hi ? "bg-green-500/15 border border-green-500/20" : "bg-muted/30"}`}>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold ${hi ? (accent || "text-green-400") : "text-foreground"}`}>{value}</span>
    </div>
  );
}
function fmt(n: number, d = 2) { if (!isFinite(n) || isNaN(n)) return "—"; return parseFloat(n.toFixed(d)).toLocaleString(); }

export default function AgricultureTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("yield");
  const tools = [
    { id: "yield", label: "Crop Yield", icon: Wheat },
    { id: "seed", label: "Seed Rate", icon: Leaf },
    { id: "fertilizer", label: "Fertilizer", icon: Droplets },
    { id: "land", label: "Land Area", icon: MapPin },
    { id: "plot", label: "Plot Calc", icon: Calculator },
    { id: "irrigation", label: "Irrigation", icon: Droplets },
    { id: "tractor", label: "Tractor", icon: Fuel },
    { id: "profit", label: "Farm Profit", icon: DollarSign },
  ];
  return (
    <PageWrapper title="Agriculture Tools" subtitle="Farm and land calculators" accentColor="bg-green-600" tools={tools} activeTool={activeTool} onToolChange={(id) => setActiveTool(id as ToolType)}>
      {activeTool === "yield" && <CropYieldEstimator />}
      {activeTool === "seed" && <SeedRateCalculator />}
      {activeTool === "fertilizer" && <FertilizerDosage />}
      {activeTool === "land" && <LandAreaConverter />}
      {activeTool === "plot" && <PlotCalculator />}
      {activeTool === "irrigation" && <IrrigationWater />}
      {activeTool === "tractor" && <TractorFuel />}
      {activeTool === "profit" && <FarmProfit />}
    </PageWrapper>
  );
}

function CropYieldEstimator() {
  const [mode, setMode] = useState("estimate");
  const [currency, setCurrency] = useState("INR");
  const [area, setArea] = useState("10");
  const [areaUnit, setAreaUnit] = useState("acre");
  const [yieldVal, setYieldVal] = useState("4");
  const [yieldUnit, setYieldUnit] = useState("tons");
  const [price, setPrice] = useState("25000");
  const [targetRevenue, setTargetRevenue] = useState("500000");

  const areaToAcre: Record<string, number> = { acre: 1, hectare: 2.47105, bigha: 0.6198, sqm: 0.000247105, gunta: 0.025 };
  const yieldToKg: Record<string, number> = { tons: 1000, quintals: 100, kg: 1, lbs: 0.453592, bushels: 27.2 };

  const areaAcres = (parseFloat(area) || 0) * areaToAcre[areaUnit];
  const yieldKgPerAcre = (parseFloat(yieldVal) || 0) * yieldToKg[yieldUnit];
  const priceNum = parseFloat(price) || 0;

  const totalYieldKg = areaAcres * yieldKgPerAcre;
  const revenue = totalYieldKg * (priceNum / yieldToKg[yieldUnit]);

  const revTarget = parseFloat(targetRevenue) || 0;
  const neededYield = priceNum > 0 ? revTarget / priceNum : 0;
  const neededArea = yieldKgPerAcre > 0 ? (neededYield * yieldToKg[yieldUnit]) / yieldKgPerAcre : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Crop Yield Estimator" icon={Wheat} iconColor="bg-amber-500">
        <ModeBar modes={[{ id: "estimate", label: "Estimate Yield" }, { id: "reverse", label: "Target Revenue" }]} active={mode} onChange={setMode} />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        {mode === "estimate" ? (
          <div className="space-y-3">
            <div className="p-2 bg-muted/30 rounded-xl text-xs text-muted-foreground font-mono">Revenue = Area × Yield × Price</div>
            <div className="flex gap-2">
              <div className="flex-1"><InputField label="Land Area" value={area} onChange={setArea} type="number" /></div>
              <div className="mt-6">
                <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
                  {Object.keys(areaToAcre).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1"><InputField label={`Yield per ${areaUnit}`} value={yieldVal} onChange={setYieldVal} type="number" /></div>
              <div className="mt-6">
                <select value={yieldUnit} onChange={e => setYieldUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
                  {Object.keys(yieldToKg).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <InputField label={`Price per ${yieldUnit} (${cs(currency)})`} value={price} onChange={setPrice} type="number" />
            <div className="space-y-2 mt-2">
              <Row label={`Total Yield (${yieldUnit})`} value={`${fmt(totalYieldKg / yieldToKg[yieldUnit])} ${yieldUnit}`} hi />
              <Row label="Total in kg" value={`${fmt(totalYieldKg)} kg`} />
              <Row label="Total in quintal" value={`${fmt(totalYieldKg / 100)} q`} />
              <Row label={`Expected Revenue`} value={`${cs(currency)}${fmt(revenue, 0)}`} hi accent="text-amber-400" />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-2 bg-muted/30 rounded-xl text-xs text-muted-foreground font-mono">Find area/yield needed for target revenue</div>
            <InputField label={`Target Revenue (${cs(currency)})`} value={targetRevenue} onChange={setTargetRevenue} type="number" />
            <div className="flex gap-2">
              <div className="flex-1"><InputField label={`Yield per ${areaUnit}`} value={yieldVal} onChange={setYieldVal} type="number" /></div>
              <div className="mt-6">
                <select value={yieldUnit} onChange={e => setYieldUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
                  {Object.keys(yieldToKg).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <InputField label={`Market Price per ${yieldUnit} (${cs(currency)})`} value={price} onChange={setPrice} type="number" />
            <div className="space-y-2 mt-2">
              <Row label={`Total ${yieldUnit} Needed`} value={`${fmt(neededYield)} ${yieldUnit}`} hi />
              <Row label="Land Required (acres)" value={`${fmt(neededArea)} acres`} />
              <Row label="Land Required (hectares)" value={`${fmt(neededArea / 2.47105)} ha`} />
              <Row label="Land Required (bigha)" value={`${fmt(neededArea / 0.6198)} bigha`} hi accent="text-amber-400" />
            </div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function SeedRateCalculator() {
  const [mode, setMode] = useState("area");
  const [currency, setCurrency] = useState("INR");
  const [area, setArea] = useState("5");
  const [areaUnit, setAreaUnit] = useState("acre");
  const [seedRate, setSeedRate] = useState("25");
  const [seedUnit, setSeedUnit] = useState("kg");
  const [seedPrice, setSeedPrice] = useState("80");
  const [cropType, setCropType] = useState("custom");

  const areaToAcre: Record<string, number> = { acre: 1, hectare: 2.47105, bigha: 0.6198, gunta: 0.025, sqm: 0.000247105 };
  const weightToKg: Record<string, number> = { kg: 1, grams: 0.001, lbs: 0.453592, quintal: 100 };

  const cropPresets: Record<string, { rate: string; unit: string }> = {
    wheat: { rate: "100", unit: "kg" }, rice: { rate: "30", unit: "kg" },
    maize: { rate: "25", unit: "kg" }, cotton: { rate: "5", unit: "kg" },
    soybean: { rate: "40", unit: "kg" }, sugarcane: { rate: "4000", unit: "kg" },
    custom: { rate: seedRate, unit: seedUnit },
  };

  const areaAcres = (parseFloat(area) || 0) * areaToAcre[areaUnit];
  const rateKgPerAcre = (parseFloat(seedRate) || 0) * weightToKg[seedUnit];
  const pricePerKg = parseFloat(seedPrice) || 0;
  const totalKg = areaAcres * rateKgPerAcre;
  const totalCost = totalKg * pricePerKg;

  const handleCropChange = (crop: string) => {
    setCropType(crop);
    if (crop !== "custom") { setSeedRate(cropPresets[crop].rate); setSeedUnit(cropPresets[crop].unit); }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Seed Rate Calculator" icon={Leaf} iconColor="bg-green-500">
        <ModeBar modes={[{ id: "area", label: "Calculate Seeds" }, { id: "coverage", label: "Area Coverage" }]} active={mode} onChange={setMode} />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Crop Type (Preset)</label>
          <div className="flex gap-1.5 flex-wrap">
            {Object.keys(cropPresets).map(crop => (
              <button key={crop} onClick={() => handleCropChange(crop)} data-testid={`crop-${crop}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${cropType === crop ? "bg-green-600 text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {crop}
              </button>
            ))}
          </div>
        </div>
        {mode === "area" ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1"><InputField label="Land Area" value={area} onChange={setArea} type="number" /></div>
              <div className="mt-6">
                <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
                  {Object.keys(areaToAcre).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1"><InputField label={`Seed Rate per ${areaUnit}`} value={seedRate} onChange={v => { setSeedRate(v); setCropType("custom"); }} type="number" /></div>
              <div className="mt-6">
                <select value={seedUnit} onChange={e => { setSeedUnit(e.target.value); setCropType("custom"); }} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
                  {Object.keys(weightToKg).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <InputField label={`Seed Price (${cs(currency)}/kg)`} value={seedPrice} onChange={setSeedPrice} type="number" />
            <div className="space-y-2 mt-2">
              <Row label="Total Seed (kg)" value={`${fmt(totalKg)} kg`} hi />
              <Row label="Total Seed (quintal)" value={`${fmt(totalKg / 100)} quintal`} />
              <Row label="Total Seed (lbs)" value={`${fmt(totalKg * 2.20462)} lbs`} />
              <Row label={`Total Seed Cost`} value={`${cs(currency)}${fmt(totalCost, 0)}`} hi accent="text-green-400" />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <InputField label="Available Seed (kg)" value={area} onChange={setArea} type="number" />
            <div className="flex gap-2">
              <div className="flex-1"><InputField label="Seed Rate per acre" value={seedRate} onChange={setSeedRate} type="number" /></div>
              <div className="mt-6">
                <select value={seedUnit} onChange={e => setSeedUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
                  {Object.keys(weightToKg).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2 mt-2">
              <Row label="Coverage (acres)" value={`${fmt(totalKg > 0 ? parseFloat(area) / rateKgPerAcre : 0)} acres`} hi />
              <Row label="Coverage (hectares)" value={`${fmt(totalKg > 0 ? parseFloat(area) / rateKgPerAcre / 2.47105 : 0)} ha`} />
              <Row label="Coverage (bigha)" value={`${fmt(totalKg > 0 ? parseFloat(area) / rateKgPerAcre / 0.6198 : 0)} bigha`} />
            </div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function FertilizerDosage() {
  const [mode, setMode] = useState("npk");
  const [currency, setCurrency] = useState("INR");
  const [area, setArea] = useState("5");
  const [areaUnit, setAreaUnit] = useState("acre");
  const [fertType, setFertType] = useState("urea");
  const [nRequired, setNRequired] = useState("120");
  const [customN, setCustomN] = useState("46");
  const [bagSize, setBagSize] = useState("50");
  const [fertPrice, setFertPrice] = useState("270");

  const areaToAcre: Record<string, number> = { acre: 1, hectare: 2.47105, bigha: 0.6198, gunta: 0.025 };
  const fertPresets: Record<string, { name: string; n: number; p: number; k: number }> = {
    urea: { name: "Urea (46-0-0)", n: 46, p: 0, k: 0 },
    dap: { name: "DAP (18-46-0)", n: 18, p: 46, k: 0 },
    npk_10_26: { name: "NPK 10-26-26", n: 10, p: 26, k: 26 },
    npk_12_32: { name: "NPK 12-32-16", n: 12, p: 32, k: 16 },
    mos: { name: "MOP (0-0-60)", n: 0, p: 0, k: 60 },
    ssp: { name: "SSP (0-16-0)", n: 0, p: 16, k: 0 },
    custom: { name: "Custom", n: parseFloat(customN) || 0, p: 0, k: 0 },
  };

  const fert = fertPresets[fertType] || fertPresets.urea;
  const nContent = fertType === "custom" ? (parseFloat(customN) || 1) : fert.n;
  const areaAcres = (parseFloat(area) || 0) * areaToAcre[areaUnit];
  const totalN = areaAcres * (parseFloat(nRequired) || 0);
  const fertKg = nContent > 0 ? totalN / (nContent / 100) : 0;
  const bags = fertKg / (parseFloat(bagSize) || 50);
  const totalCost = bags * (parseFloat(fertPrice) || 0);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Fertilizer Dosage" icon={Droplets} iconColor="bg-blue-500">
        <ModeBar modes={[{ id: "npk", label: "By Nutrient (N)" }, { id: "bags", label: "By Bags" }]} active={mode} onChange={setMode} color="bg-blue-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Fertilizer Type</label>
          <select value={fertType} onChange={e => setFertType(e.target.value)} className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
            {Object.entries(fertPresets).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
          </select>
        </div>
        {fertType === "custom" && <InputField label="Nitrogen Content (%)" value={customN} onChange={setCustomN} type="number" />}
        <div className="flex gap-2">
          <div className="flex-1"><InputField label="Land Area" value={area} onChange={setArea} type="number" /></div>
          <div className="mt-6">
            <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
              {Object.keys(areaToAcre).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <InputField label={`Nitrogen Required (kg/${areaUnit})`} value={nRequired} onChange={setNRequired} type="number" />
        <div className="flex gap-2 mt-1">
          <div className="flex-1"><InputField label={`Bag Size (kg)`} value={bagSize} onChange={setBagSize} type="number" /></div>
          <div className="flex-1"><InputField label={`Price per Bag (${cs(currency)})`} value={fertPrice} onChange={setFertPrice} type="number" /></div>
        </div>
        <div className="space-y-2 mt-3">
          <Row label={`Total Fertilizer`} value={`${fmt(fertKg)} kg`} hi />
          <Row label={`Bags Needed (${bagSize}kg)`} value={`${fmt(bags, 1)} bags`} />
          <Row label={`Full bags to buy`} value={`${Math.ceil(bags)} bags`} />
          <Row label={`Total Cost`} value={`${cs(currency)}${fmt(totalCost, 0)}`} hi accent="text-blue-400" />
          {fertType !== "custom" && <div className="p-2 bg-muted/20 rounded-xl text-[10px] text-muted-foreground">NPK: N={fert.n}% P={fert.p}% K={fert.k}%</div>}
        </div>
      </ToolCard>
    </div>
  );
}

function LandAreaConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("acre");
  const conversions: Record<string, number> = {
    acre: 1, hectare: 2.47105, sqft: 0.0000229568, sqm: 0.000247105,
    sqyard: 0.000206612, sqmile: 640, sqkm: 247.105,
    bigha: 0.6198, biswa: 0.03099, gunta: 0.025, cent: 0.01,
    marla: 0.00625, kanal: 0.125, ground: 0.05506, guntha: 0.025,
    vigha: 0.6198, jerib: 0.494, feddan: 1.038,
  };
  const labels: Record<string, string> = {
    acre:"Acre", hectare:"Hectare", sqft:"Sq. Feet", sqm:"Sq. Meter", sqyard:"Sq. Yard",
    sqmile:"Sq. Mile", sqkm:"Sq. KM", bigha:"Bigha (IN)", biswa:"Biswa (IN)",
    gunta:"Gunta/Guntha", cent:"Cent (S.India)", marla:"Marla (PK/IN)", kanal:"Kanal (PK/IN)",
    ground:"Ground (TN)", guntha:"Guntha (MH)", vigha:"Vigha (GJ)", jerib:"Jerib (AF/IR)",
    feddan:"Feddan (EG)",
  };
  const cats = [
    { label: "🌍 Global Units", units: ["acre","hectare","sqft","sqm","sqyard","sqmile","sqkm"] },
    { label: "🇮🇳 Indian Units", units: ["bigha","biswa","gunta","cent","marla","kanal","ground","guntha","vigha"] },
    { label: "🌏 Other Regional", units: ["jerib","feddan"] },
  ];
  const inAcres = (parseFloat(value) || 0) * conversions[fromUnit];
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Land Area Converter" icon={MapPin} iconColor="bg-amber-600">
        <InputField label="Value" value={value} onChange={setValue} type="number" />
        <div className="mt-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">From Unit</label>
          <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            {cats.map(cat => (
              <optgroup key={cat.label} label={cat.label}>
                {cat.units.map(u => <option key={u} value={u}>{labels[u] || u}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
      </ToolCard>
      <ToolCard title="All Conversions" icon={Calculator} iconColor="bg-emerald-500">
        {cats.map(cat => (
          <div key={cat.label} className="mb-4">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{cat.label}</div>
            <div className="space-y-1">
              {cat.units.filter(u => u !== fromUnit).map(unit => (
                <div key={unit} className="flex justify-between items-center p-2.5 bg-muted/30 rounded-xl">
                  <span className="text-xs font-medium text-muted-foreground">{labels[unit] || unit}</span>
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {(inAcres / conversions[unit]).toLocaleString(undefined, { maximumFractionDigits: unit === "sqft" || unit === "sqm" ? 0 : 4 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </ToolCard>
    </div>
  );
}

function PlotCalculator() {
  const [mode, setMode] = useState("dimensions");
  const [currency, setCurrency] = useState("INR");
  const [length, setLength] = useState("60");
  const [width, setWidth] = useState("40");
  const [dimUnit, setDimUnit] = useState("ft");
  const [totalValue, setTotalValue] = useState("1");
  const [inputUnit, setInputUnit] = useState("acre");
  const [pricePerSqft, setPricePerSqft] = useState("2000");

  const conversions: Record<string, number> = {
    acre:1, hectare:2.47105, sqft:0.0000229568, sqm:0.000247105,
    sqyard:0.000206612, bigha:0.6198, biswa:0.03099, gunta:0.025, cent:0.01, marla:0.00625, kanal:0.125,
  };
  const dimToSqFt = (val: number, unit: string) => ({ ft:1, m:10.7639, yard:9, cm:0.00107639, inch:0.00694444 }[unit] || 1) * val;

  const areaInAcres = mode === "dimensions"
    ? dimToSqFt(parseFloat(length)||0, dimUnit) * dimToSqFt(parseFloat(width)||0, dimUnit) * conversions.sqft
    : (parseFloat(totalValue)||0) * conversions[inputUnit];

  const areaSqFt = areaInAcres / conversions.sqft;
  const landValue = areaSqFt * (parseFloat(pricePerSqft) || 0);

  const results = [
    { label: "Sq. Feet", unit: "sqft" }, { label: "Sq. Meters", unit: "sqm" },
    { label: "Sq. Yards", unit: "sqyard" }, { label: "Cent", unit: "cent" },
    { label: "Acre", unit: "acre" }, { label: "Hectare", unit: "hectare" },
    { label: "Bigha", unit: "bigha" }, { label: "Marla", unit: "marla" },
    { label: "Kanal", unit: "kanal" }, { label: "Gunta", unit: "gunta" },
  ];

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Plot Calculator" icon={Calculator} iconColor="bg-green-500">
        <ModeBar modes={[{ id: "dimensions", label: "By Dimensions" }, { id: "reverse", label: "By Area" }]} active={mode} onChange={setMode} />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        {mode === "dimensions" ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Length" value={length} onChange={setLength} type="number" />
              <InputField label="Width" value={width} onChange={setWidth} type="number" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Unit</label>
              <div className="flex gap-1.5">
                {["ft", "m", "yard", "cm", "inch"].map(u => (
                  <button key={u} onClick={() => setDimUnit(u)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${dimUnit === u ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}`}>{u}</button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <InputField label="Total Area" value={totalValue} onChange={setTotalValue} type="number" />
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Input Unit</label>
            <select value={inputUnit} onChange={e => setInputUnit(e.target.value)} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground">
              {Object.keys(conversions).map(u => <option key={u} value={u} className="capitalize">{u}</option>)}
            </select>
          </div>
        )}
        <div className="mt-3">
          <InputField label={`Land Rate (${cs(currency)}/sq.ft)`} value={pricePerSqft} onChange={setPricePerSqft} type="number" />
          <div className="mt-2 p-2.5 bg-green-500/15 border border-green-500/20 rounded-xl flex justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Estimated Land Value</span>
            <span className="text-sm font-bold text-green-400">{cs(currency)}{fmt(landValue, 0)}</span>
          </div>
        </div>
      </ToolCard>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 border-b border-border pb-2">Area Breakdown</div>
          <div className="grid grid-cols-2 gap-2">
            {results.map(res => (
              <div key={res.unit} className="p-2.5 bg-muted/30 rounded-xl">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">{res.label}</div>
                <div className="text-base font-black text-green-500 mt-0.5">
                  {(areaInAcres / conversions[res.unit]).toLocaleString(undefined, { maximumFractionDigits: res.unit === "sqft" || res.unit === "sqm" ? 0 : 3 })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function IrrigationWater() {
  const [mode, setMode] = useState("water");
  const [irrigType, setIrrigType] = useState("drip");
  const [area, setArea] = useState("5");
  const [areaUnit, setAreaUnit] = useState("acre");
  const [cropWater, setCropWater] = useState("500");
  const [efficiency, setEfficiency] = useState("90");
  const [pumpFlow, setPumpFlow] = useState("10000");
  const [flowUnit, setFlowUnit] = useState("lph");

  const areaToAcre: Record<string, number> = { acre: 1, hectare: 2.47105, bigha: 0.6198 };
  const typeEff: Record<string, number> = { drip: 90, sprinkler: 75, flood: 55, furrow: 60 };

  const eff = parseFloat(efficiency) || typeEff[irrigType];
  const areaAcres = (parseFloat(area) || 0) * areaToAcre[areaUnit];
  const totalWaterMM = areaAcres * (parseFloat(cropWater) || 0);
  const actualWaterMM = totalWaterMM / (eff / 100);
  const volLiters = actualWaterMM * areaAcres * 4046.86 / 1000;
  const volGallons = volLiters * 0.264172;
  const volM3 = volLiters / 1000;

  const flowLph = flowUnit === "lph" ? parseFloat(pumpFlow) || 0
    : flowUnit === "lpm" ? (parseFloat(pumpFlow) || 0) * 60
    : flowUnit === "gpm" ? (parseFloat(pumpFlow) || 0) * 227.124 : 0;
  const hoursNeeded = flowLph > 0 ? volLiters / flowLph : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Irrigation Water" icon={Droplets} iconColor="bg-cyan-500">
        <ModeBar modes={[{ id: "water", label: "Water Requirement" }, { id: "pump", label: "Pump Time" }]} active={mode} onChange={setMode} color="bg-cyan-600" />
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Irrigation Type</label>
          <div className="grid grid-cols-4 gap-1.5">
            {Object.keys(typeEff).map(t => (
              <button key={t} onClick={() => { setIrrigType(t); setEfficiency(String(typeEff[t])); }} data-testid={`irrig-${t}`}
                className={`py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all ${irrigType === t ? "bg-cyan-600 text-white" : "bg-muted text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1"><InputField label="Land Area" value={area} onChange={setArea} type="number" /></div>
          <div className="mt-6">
            <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
              {Object.keys(areaToAcre).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <InputField label="Crop Water Need (mm/season)" value={cropWater} onChange={setCropWater} type="number" />
        <InputField label={`Efficiency (%) — ${irrigType}: ${typeEff[irrigType]}%`} value={efficiency} onChange={setEfficiency} type="number" />
        {mode === "pump" && (
          <div className="flex gap-2">
            <div className="flex-1"><InputField label="Pump Flow Rate" value={pumpFlow} onChange={setPumpFlow} type="number" /></div>
            <div className="mt-6">
              <select value={flowUnit} onChange={e => setFlowUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
                {["lph", "lpm", "gpm"].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        )}
        <div className="space-y-2 mt-3">
          <Row label="Water Needed (gross)" value={`${fmt(actualWaterMM, 0)} mm`} hi />
          <Row label="Volume in Liters" value={`${fmt(volLiters, 0)} L`} />
          <Row label="Volume in m³" value={`${fmt(volM3, 1)} m³`} />
          <Row label="Volume in Gallons" value={`${fmt(volGallons, 0)} gal`} />
          {mode === "pump" && <Row label="Pump Hours Needed" value={`${fmt(hoursNeeded, 1)} hrs`} hi accent="text-cyan-400" />}
        </div>
      </ToolCard>
    </div>
  );
}

function TractorFuel() {
  const [mode, setMode] = useState("cost");
  const [currency, setCurrency] = useState("INR");
  const [fuelType, setFuelType] = useState("diesel");
  const [hours, setHours] = useState("8");
  const [fuelRate, setFuelRate] = useState("8");
  const [fuelPrice, setFuelPrice] = useState("90");
  const [fuelUnit, setFuelUnit] = useState("L");
  const [hpRating, setHpRating] = useState("50");
  const [area, setArea] = useState("2");

  const fuelTypeRates: Record<string, number> = { diesel: 0.15, petrol: 0.18, cng: 0.12 };
  const unitToLiter: Record<string, number> = { L: 1, gallon: 3.78541, USgal: 3.78541 };

  const h = parseFloat(hours) || 0;
  const rate = parseFloat(fuelRate) || 0;
  const price = parseFloat(fuelPrice) || 0;
  const hp = parseFloat(hpRating) || 50;
  const areaVal = parseFloat(area) || 0;

  const estRate = hp * fuelTypeRates[fuelType];
  const fuelUsedL = h * rate;
  const fuelUsedUnit = fuelUsedL / unitToLiter[fuelUnit];
  const dailyCost = fuelUsedL * price;
  const monthlyCost = dailyCost * 26;
  const costPerAcre = areaVal > 0 ? dailyCost / areaVal : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Tractor Fuel Calculator" icon={Fuel} iconColor="bg-orange-500">
        <ModeBar modes={[{ id: "cost", label: "Fuel Cost" }, { id: "estimate", label: "HP Estimator" }]} active={mode} onChange={setMode} color="bg-orange-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Fuel Type</label>
          <div className="flex gap-1.5">
            {Object.keys(fuelTypeRates).map(t => (
              <button key={t} onClick={() => setFuelType(t)} className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${fuelType === t ? "bg-orange-600 text-white" : "bg-muted text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
        </div>
        {mode === "cost" ? (
          <div className="space-y-3">
            <InputField label="Operating Hours" value={hours} onChange={setHours} type="number" />
            <div className="flex gap-2">
              <div className="flex-1"><InputField label={`Fuel Rate (per hr)`} value={fuelRate} onChange={setFuelRate} type="number" /></div>
              <div className="mt-6">
                <select value={fuelUnit} onChange={e => setFuelUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
                  {["L", "gallon", "USgal"].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <InputField label={`Fuel Price (${cs(currency)}/${fuelUnit})`} value={fuelPrice} onChange={setFuelPrice} type="number" />
            <InputField label="Area Covered Today (acres)" value={area} onChange={setArea} type="number" />
            <div className="space-y-2 mt-2">
              <Row label={`Fuel Used (${fuelUnit})`} value={`${fmt(fuelUsedUnit)} ${fuelUnit}`} hi />
              <Row label="Fuel Used (Liters)" value={`${fmt(fuelUsedL)} L`} />
              <Row label={`Daily Cost`} value={`${cs(currency)}${fmt(dailyCost, 0)}`} hi accent="text-orange-400" />
              <Row label="Monthly Cost (26 days)" value={`${cs(currency)}${fmt(monthlyCost, 0)}`} />
              <Row label="Cost per Acre" value={`${cs(currency)}${fmt(costPerAcre, 0)}`} />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <InputField label="Tractor HP Rating" value={hpRating} onChange={setHpRating} type="number" />
            <InputField label="Operating Hours" value={hours} onChange={setHours} type="number" />
            <InputField label={`Fuel Price (${cs(currency)}/L)`} value={fuelPrice} onChange={setFuelPrice} type="number" />
            <div className="space-y-2 mt-2">
              <Row label="Est. Fuel Rate (L/hr)" value={`${fmt(estRate, 1)} L/hr`} hi />
              <Row label="Est. Fuel for ${hours}hrs" value={`${fmt(estRate * h, 1)} L`} />
              <Row label={`Est. Cost`} value={`${cs(currency)}${fmt(estRate * h * parseFloat(fuelPrice), 0)}`} hi accent="text-orange-400" />
              <div className="p-2 bg-muted/20 rounded-xl text-[10px] text-muted-foreground">Based on {fuelType} consumption rate of ~{fuelTypeRates[fuelType]} L/HP/hr</div>
            </div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function FarmProfit() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("profit");
  const [revenue, setRevenue] = useState("150000");
  const [seedCost, setSeedCost] = useState("8000");
  const [fertilizerCost, setFertilizerCost] = useState("12000");
  const [laborCost, setLaborCost] = useState("20000");
  const [irrigCost, setIrrigCost] = useState("5000");
  const [machineCost, setMachineCost] = useState("8000");
  const [otherCost, setOtherCost] = useState("5000");
  const [targetMargin, setTargetMargin] = useState("30");

  const rev = parseFloat(revenue) || 0;
  const costs = [parseFloat(seedCost)||0, parseFloat(fertilizerCost)||0, parseFloat(laborCost)||0, parseFloat(irrigCost)||0, parseFloat(machineCost)||0, parseFloat(otherCost)||0];
  const totalCost = costs.reduce((a, b) => a + b, 0);
  const profit = rev - totalCost;
  const margin = rev > 0 ? (profit / rev) * 100 : 0;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  const tMargin = parseFloat(targetMargin) || 30;
  const requiredRevenue = totalCost / (1 - tMargin / 100);
  const breakEvenUnits = rev > 0 ? totalCost : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Farm Profit Calculator" icon={DollarSign} iconColor="bg-emerald-500">
        <ModeBar modes={[{ id: "profit", label: "Profit Analysis" }, { id: "planning", label: "Revenue Target" }]} active={mode} onChange={setMode} color="bg-emerald-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <InputField label={`Total Revenue (${cs(currency)})`} value={revenue} onChange={setRevenue} type="number" />
        <div className="mt-3 p-2.5 bg-muted/20 rounded-xl border border-border/50">
          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Cost Breakdown</p>
          <div className="grid grid-cols-2 gap-2">
            <InputField label={`Seed (${cs(currency)})`} value={seedCost} onChange={setSeedCost} type="number" />
            <InputField label={`Fertilizer (${cs(currency)})`} value={fertilizerCost} onChange={setFertilizerCost} type="number" />
            <InputField label={`Labor (${cs(currency)})`} value={laborCost} onChange={setLaborCost} type="number" />
            <InputField label={`Irrigation (${cs(currency)})`} value={irrigCost} onChange={setIrrigCost} type="number" />
            <InputField label={`Machine (${cs(currency)})`} value={machineCost} onChange={setMachineCost} type="number" />
            <InputField label={`Other (${cs(currency)})`} value={otherCost} onChange={setOtherCost} type="number" />
          </div>
        </div>
        {mode === "planning" && <InputField label="Target Profit Margin (%)" value={targetMargin} onChange={setTargetMargin} type="number" />}
        <div className="space-y-2 mt-3">
          <Row label="Total Costs" value={`${cs(currency)}${fmt(totalCost, 0)}`} />
          {mode === "profit" ? (
            <>
              <Row label="Net Profit" value={`${cs(currency)}${fmt(profit, 0)}`} hi accent={profit >= 0 ? "text-emerald-400" : "text-red-400"} />
              <Row label="Profit Margin" value={`${fmt(margin, 1)}%`} />
              <Row label="ROI" value={`${fmt(roi, 1)}%`} />
              {[{ l: "Seed", v: costs[0] }, { l: "Fertilizer", v: costs[1] }, { l: "Labor", v: costs[2] }].map((r, i) => (
                <div key={i} className="flex justify-between items-center px-2.5 py-1.5 rounded-lg bg-muted/20">
                  <span className="text-[10px] text-muted-foreground">{r.l}</span>
                  <span className="text-[10px] font-bold text-foreground">{rev > 0 ? fmt(r.v / rev * 100, 1) : "—"}% of revenue</span>
                </div>
              ))}
            </>
          ) : (
            <>
              <Row label={`Min. Revenue for ${tMargin}% margin`} value={`${cs(currency)}${fmt(requiredRevenue, 0)}`} hi accent="text-emerald-400" />
              <Row label="Break-Even Revenue" value={`${cs(currency)}${fmt(totalCost, 0)}`} />
              <Row label="Revenue Gap" value={`${cs(currency)}${fmt(Math.max(0, requiredRevenue - rev), 0)}`} />
            </>
          )}
        </div>
      </ToolCard>
    </div>
  );
}
