import { useState } from "react";
import { Wheat, Leaf, Droplets, MapPin, Fuel, Calculator, DollarSign } from "lucide-react";
import { DesktopToolGrid, InputPanel, ResultPanel, SummaryCard, BreakdownRow, InputField, ModeSelector } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "yield" | "seed" | "fertilizer" | "land" | "plot" | "irrigation" | "tractor" | "profit";

const CURRENCIES = [
  { code: "INR", symbol: "₹" }, { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" }, { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" }, { code: "CNY", symbol: "¥" },
  { code: "AUD", symbol: "A$" }, { code: "CAD", symbol: "C$" },
  { code: "AED", symbol: "د.إ" }, { code: "SGD", symbol: "S$" },
];
const cs = (code: string) => CURRENCIES.find(c => c.code === code)?.symbol || "₹";
const fmt = (n: number, d = 2) => isFinite(n) && !isNaN(n) ? parseFloat(n.toFixed(d)).toLocaleString() : "—";

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
    <PageWrapper title="Agriculture Tools" subtitle="Farm planning, crop yield and land calculators" accentColor="bg-green-600" tools={tools} activeTool={activeTool} onToolChange={id => setActiveTool(id as ToolType)}>
      {activeTool === "yield" && <CropYield />}
      {activeTool === "seed" && <SeedRate />}
      {activeTool === "fertilizer" && <Fertilizer />}
      {activeTool === "land" && <LandArea />}
      {activeTool === "plot" && <PlotCalc />}
      {activeTool === "irrigation" && <Irrigation />}
      {activeTool === "tractor" && <TractorFuel />}
      {activeTool === "profit" && <FarmProfit />}
    </PageWrapper>
  );
}

function CropYield() {
  const [mode, setMode] = useState("estimate");
  const [currency, setCurrency] = useState("INR");
  const [area, setArea] = useState("10"); const [areaUnit, setAreaUnit] = useState("acre");
  const [yieldVal, setYieldVal] = useState("4"); const [yieldUnit, setYieldUnit] = useState("tons");
  const [price, setPrice] = useState("25000"); const [targetRev, setTargetRev] = useState("500000");

  const aToAcre: Record<string, number> = { acre:1, hectare:2.47105, bigha:0.6198, sqm:0.000247105, gunta:0.025 };
  const yToKg: Record<string, number> = { tons:1000, quintals:100, kg:1, lbs:0.453592, bushels:27.2 };
  const acres = (parseFloat(area)||0) * (aToAcre[areaUnit]||1);
  const kgPerAcre = (parseFloat(yieldVal)||0) * (yToKg[yieldUnit]||1);
  const totalKg = acres * kgPerAcre;
  const revenue = totalKg * ((parseFloat(price)||0) / (yToKg[yieldUnit]||1));
  const rev = parseFloat(targetRev)||0;
  const neededY = (parseFloat(price)||0) > 0 ? rev / (parseFloat(price)||1) : 0;
  const neededArea = kgPerAcre > 0 ? (neededY * (yToKg[yieldUnit]||1)) / kgPerAcre : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Crop Parameters" icon={Wheat} iconColor="bg-amber-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"estimate", label:"Estimate Yield" }, { id:"reverse", label:"Target Revenue" }]} active={mode} onChange={setMode} />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Land Area" value={area} onChange={setArea} type="number" />
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Area Unit</label>
              <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
                {Object.keys(aToAcre).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          {mode === "estimate" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <InputField label={`Yield / ${areaUnit}`} value={yieldVal} onChange={setYieldVal} type="number" />
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Yield Unit</label>
                  <select value={yieldUnit} onChange={e => setYieldUnit(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
                    {Object.keys(yToKg).map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <InputField label={`Price per ${yieldUnit}`} value={price} onChange={setPrice} type="number" prefix={cs(currency)} />
            </>
          ) : (
            <>
              <InputField label="Target Revenue" value={targetRev} onChange={setTargetRev} type="number" prefix={cs(currency)} />
              <div className="grid grid-cols-2 gap-3">
                <InputField label={`Yield / ${areaUnit}`} value={yieldVal} onChange={setYieldVal} type="number" />
                <InputField label={`Market Price/${yieldUnit}`} value={price} onChange={setPrice} type="number" />
              </div>
            </>
          )}
        </InputPanel>
      }
      results={
        mode === "estimate" ? (
          <ResultPanel
            label="Estimated Revenue"
            primary={`${cs(currency)}${fmt(revenue, 0)}`}
            summaries={<>
              <SummaryCard label="Total Yield" value={`${fmt(totalKg/(yToKg[yieldUnit]||1))} ${yieldUnit}`} />
              <SummaryCard label="Total in kg" value={`${fmt(totalKg, 0)} kg`} />
            </>}
            tip="Yield per acre varies by crop variety, soil quality, and irrigation method."
          >
            <BreakdownRow label={`Total Yield (${yieldUnit})`} value={`${fmt(totalKg/(yToKg[yieldUnit]||1), 2)}`} dot="bg-amber-400" />
            <BreakdownRow label="Total in kg" value={`${fmt(totalKg, 0)} kg`} dot="bg-green-500" />
            <BreakdownRow label="Total in quintal" value={`${fmt(totalKg/100, 1)} q`} dot="bg-blue-400" />
            <BreakdownRow label="Area (acres)" value={`${fmt(acres, 2)} ac`} dot="bg-purple-400" />
            <BreakdownRow label="Revenue" value={`${cs(currency)}${fmt(revenue, 0)}`} bold />
          </ResultPanel>
        ) : (
          <ResultPanel
            label="Land Required for Target"
            primary={`${fmt(neededArea, 2)} acres`}
            summaries={<>
              <SummaryCard label={`${yieldUnit} needed`} value={fmt(neededY, 2)} />
              <SummaryCard label="In hectares" value={`${fmt(neededArea/2.47105, 2)} ha`} />
            </>}
          >
            <BreakdownRow label="Target Revenue" value={`${cs(currency)}${fmt(rev, 0)}`} dot="bg-green-500" />
            <BreakdownRow label="Yield per acre" value={`${yieldVal} ${yieldUnit}`} dot="bg-amber-400" />
            <BreakdownRow label="Area needed (acres)" value={`${fmt(neededArea, 2)}`} dot="bg-blue-400" bold />
            <BreakdownRow label="Area needed (bigha)" value={`${fmt(neededArea/0.6198, 2)}`} dot="bg-purple-400" />
          </ResultPanel>
        )
      }
    />
  );
}

function SeedRate() {
  const [mode, setMode] = useState("area");
  const [currency, setCurrency] = useState("INR");
  const [area, setArea] = useState("5"); const [areaUnit, setAreaUnit] = useState("acre");
  const [seedRate, setSeedRate] = useState("25"); const [seedUnit, setSeedUnit] = useState("kg");
  const [seedPrice, setSeedPrice] = useState("80"); const [cropType, setCropType] = useState("wheat");

  const aToAcre: Record<string, number> = { acre:1, hectare:2.47105, bigha:0.6198, gunta:0.025 };
  const wToKg: Record<string, number> = { kg:1, grams:0.001, lbs:0.453592, quintal:100 };
  const cropPresets: Record<string, { rate:string; unit:string }> = {
    wheat:{ rate:"100", unit:"kg" }, rice:{ rate:"30", unit:"kg" }, maize:{ rate:"25", unit:"kg" },
    cotton:{ rate:"5", unit:"kg" }, soybean:{ rate:"40", unit:"kg" }, custom:{ rate:seedRate, unit:seedUnit },
  };
  const handleCrop = (c: string) => { setCropType(c); if (c !== "custom") { setSeedRate(cropPresets[c].rate); setSeedUnit(cropPresets[c].unit); } };

  const acres = (parseFloat(area)||0) * (aToAcre[areaUnit]||1);
  const rateKg = (parseFloat(seedRate)||0) * (wToKg[seedUnit]||1);
  const totalKg = acres * rateKg;
  const totalCost = totalKg * (parseFloat(seedPrice)||0);
  const available = parseFloat(area)||0;
  const coverage = rateKg > 0 ? available / rateKg : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Seed Parameters" icon={Leaf} iconColor="bg-green-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"area", label:"Seeds for Area" }, { id:"coverage", label:"Area Coverage" }]} active={mode} onChange={setMode} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Crop Type</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(cropPresets).map(c => (
                <button key={c} onClick={() => handleCrop(c)} data-testid={`crop-${c}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${cropType === c ? "bg-green-500 text-white" : "bg-muted/50 text-muted-foreground hover:text-foreground border border-border"}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label={mode === "area" ? "Land Area" : "Available Seed (kg)"} value={area} onChange={setArea} type="number" />
            {mode === "area" && (
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Area Unit</label>
                <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
                  {Object.keys(aToAcre).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label={`Rate / ${mode === "area" ? areaUnit : "acre"}`} value={seedRate} onChange={v => { setSeedRate(v); setCropType("custom"); }} type="number" />
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Unit</label>
              <select value={seedUnit} onChange={e => { setSeedUnit(e.target.value); setCropType("custom"); }} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
                {Object.keys(wToKg).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <InputField label={`Seed Price (${cs(currency)}/kg)`} value={seedPrice} onChange={setSeedPrice} type="number" prefix={cs(currency)} />
        </InputPanel>
      }
      results={
        mode === "area" ? (
          <ResultPanel label="Seed Requirement" primary={`${fmt(totalKg, 1)} kg`}
            summaries={<>
              <SummaryCard label="Total Cost" value={`${cs(currency)}${fmt(totalCost, 0)}`} accent="text-green-500" />
              <SummaryCard label="In Quintal" value={`${fmt(totalKg/100, 3)} q`} />
            </>}
          >
            <BreakdownRow label={`Land (${areaUnit})`} value={`${fmt(acres, 2)} ${areaUnit}`} dot="bg-green-500" />
            <BreakdownRow label="Rate per acre (kg)" value={`${fmt(rateKg, 2)}`} dot="bg-amber-400" />
            <BreakdownRow label="Total Seed (kg)" value={`${fmt(totalKg, 1)}`} dot="bg-blue-400" bold />
            <BreakdownRow label="In lbs" value={`${fmt(totalKg*2.20462, 1)}`} dot="bg-purple-400" />
            <BreakdownRow label="Total Cost" value={`${cs(currency)}${fmt(totalCost, 0)}`} bold />
          </ResultPanel>
        ) : (
          <ResultPanel label="Area Coverage" primary={`${fmt(coverage, 2)} acres`}
            summaries={<>
              <SummaryCard label="In Hectares" value={`${fmt(coverage/2.47105, 2)} ha`} />
              <SummaryCard label="In Bigha" value={`${fmt(coverage/0.6198, 2)} bigha`} />
            </>}
          >
            <BreakdownRow label="Available Seed" value={`${available} kg`} dot="bg-green-500" />
            <BreakdownRow label="Rate per acre" value={`${rateKg} kg`} dot="bg-amber-400" />
            <BreakdownRow label="Coverage (acres)" value={`${fmt(coverage, 2)}`} dot="bg-blue-400" bold />
            <BreakdownRow label="Coverage (hectares)" value={`${fmt(coverage/2.47105, 3)}`} dot="bg-purple-400" />
          </ResultPanel>
        )
      }
    />
  );
}

function Fertilizer() {
  const [currency, setCurrency] = useState("INR");
  const [area, setArea] = useState("5"); const [areaUnit, setAreaUnit] = useState("acre");
  const [fertType, setFertType] = useState("urea");
  const [nRequired, setNRequired] = useState("120");
  const [bagSize, setBagSize] = useState("50");
  const [fertPrice, setFertPrice] = useState("270");

  const aToAcre: Record<string, number> = { acre:1, hectare:2.47105, bigha:0.6198, gunta:0.025 };
  const ferts: Record<string, { name:string; n:number; p:number; k:number }> = {
    urea:{ name:"Urea (46-0-0)", n:46, p:0, k:0 }, dap:{ name:"DAP (18-46-0)", n:18, p:46, k:0 },
    npk_10:{ name:"NPK 10-26-26", n:10, p:26, k:26 }, npk_12:{ name:"NPK 12-32-16", n:12, p:32, k:16 },
    mop:{ name:"MOP (0-0-60)", n:0, p:0, k:60 }, ssp:{ name:"SSP (0-16-0)", n:0, p:16, k:0 },
  };
  const f = ferts[fertType]; const acres = (parseFloat(area)||0) * (aToAcre[areaUnit]||1);
  const nContent = f.n > 0 ? f.n : 1;
  const fertKg = acres * (parseFloat(nRequired)||0) / (nContent/100);
  const bags = fertKg / (parseFloat(bagSize)||50);
  const totalCost = Math.ceil(bags) * (parseFloat(fertPrice)||0);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Fertilizer Parameters" icon={Droplets} iconColor="bg-blue-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Fertilizer Type</label>
            <select value={fertType} onChange={e => setFertType(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
              {Object.entries(ferts).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}
            </select>
          </div>
          <div className="text-xs text-muted-foreground px-3 py-2 bg-muted/20 rounded-lg">NPK: N={f.n}% P={f.p}% K={f.k}%</div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Land Area" value={area} onChange={setArea} type="number" />
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Area Unit</label>
              <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
                {Object.keys(aToAcre).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <InputField label={`N Required (kg/${areaUnit})`} value={nRequired} onChange={setNRequired} type="number" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Bag Size (kg)" value={bagSize} onChange={setBagSize} type="number" />
            <InputField label="Price / Bag" value={fertPrice} onChange={setFertPrice} type="number" prefix={cs(currency)} />
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Fertilizer Needed" primary={`${fmt(fertKg, 1)} kg`}
          summaries={<>
            <SummaryCard label="Bags to Buy" value={`${Math.ceil(bags)} bags`} accent="text-blue-500" />
            <SummaryCard label="Total Cost" value={`${cs(currency)}${fmt(totalCost, 0)}`} />
          </>}
          tip="For best results, split fertilizer applications: half at sowing, half at top-dressing."
        >
          <BreakdownRow label="Land (acres)" value={`${fmt(acres, 2)}`} dot="bg-blue-400" />
          <BreakdownRow label="N Required Total" value={`${fmt(acres*(parseFloat(nRequired)||0), 0)} kg N`} dot="bg-green-500" />
          <BreakdownRow label="Fertilizer (kg)" value={`${fmt(fertKg, 1)}`} dot="bg-amber-400" bold />
          <BreakdownRow label="Bags (exact)" value={`${fmt(bags, 2)}`} dot="bg-purple-400" />
          <BreakdownRow label="Bags (rounded up)" value={`${Math.ceil(bags)}`} bold />
          <BreakdownRow label="Total Cost" value={`${cs(currency)}${fmt(totalCost, 0)}`} bold />
        </ResultPanel>
      }
    />
  );
}

function LandArea() {
  const [value, setValue] = useState("1"); const [fromUnit, setFromUnit] = useState("acre");
  const conv: Record<string, number> = {
    acre:1, hectare:2.47105, sqft:0.0000229568, sqm:0.000247105, sqyard:0.000206612,
    sqmile:640, sqkm:247.105, bigha:0.6198, biswa:0.03099, gunta:0.025, cent:0.01,
    marla:0.00625, kanal:0.125, ground:0.05506, vigha:0.6198, jerib:0.494, feddan:1.038,
  };
  const labels: Record<string, string> = {
    acre:"Acre", hectare:"Hectare", sqft:"Sq. Feet", sqm:"Sq. Meter", sqyard:"Sq. Yard",
    sqmile:"Sq. Mile", sqkm:"Sq. KM", bigha:"Bigha", biswa:"Biswa", gunta:"Gunta",
    cent:"Cent", marla:"Marla", kanal:"Kanal", ground:"Ground", vigha:"Vigha", jerib:"Jerib", feddan:"Feddan",
  };
  const cats = [
    { label:"Global", units:["acre","hectare","sqft","sqm","sqyard","sqmile","sqkm"] },
    { label:"Indian", units:["bigha","biswa","gunta","cent","marla","kanal","ground","vigha"] },
    { label:"Other", units:["jerib","feddan"] },
  ];
  const inAcres = (parseFloat(value)||0) * (conv[fromUnit]||1);
  const topResults = ["acre","hectare","sqm","sqft","bigha","cent","marla","sqyard"];

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Land Area Converter" icon={MapPin} iconColor="bg-amber-600">
          <InputField label="Value" value={value} onChange={setValue} type="number" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">From Unit</label>
            <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
              {cats.map(cat => (
                <optgroup key={cat.label} label={`── ${cat.label} Units`}>
                  {cat.units.map(u => <option key={u} value={u}>{labels[u]}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-xl leading-relaxed">
            Convert between all major global and Indian land area units instantly.
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Conversion Results" primary={`${fmt(inAcres, 4)} acres`}>
          {topResults.filter(u => u !== fromUnit).map(u => (
            <BreakdownRow key={u} label={labels[u]} value={(inAcres/(conv[u]||1)).toLocaleString(undefined, { maximumFractionDigits: u === "sqft"||u === "sqm" ? 0 : 4 })} dot="bg-amber-400" />
          ))}
          {cats.map(cat => cat.units.filter(u => u !== fromUnit && !topResults.includes(u)).map(u => (
            <BreakdownRow key={u} label={labels[u]} value={(inAcres/(conv[u]||1)).toLocaleString(undefined, { maximumFractionDigits: 4 })} />
          )))}
        </ResultPanel>
      }
    />
  );
}

function PlotCalc() {
  const [mode, setMode] = useState("dims");
  const [currency, setCurrency] = useState("INR");
  const [length, setLength] = useState("60"); const [width, setWidth] = useState("40");
  const [dimUnit, setDimUnit] = useState("ft"); const [totalVal, setTotalVal] = useState("1");
  const [inputUnit, setInputUnit] = useState("acre"); const [rate, setRate] = useState("2000");

  const conv: Record<string, number> = { acre:1, hectare:2.47105, sqft:0.0000229568, sqm:0.000247105, sqyard:0.000206612, bigha:0.6198, cent:0.01, marla:0.00625 };
  const dimToSqFt = (v: string, u: string) => { const n = parseFloat(v)||0; const f = ({ft:1, m:10.7639, yard:9, cm:0.00107639, inch:0.00694444} as any)[u]||1; return n * n * 0 + n; }; // just a scalar
  const ftMul: Record<string, number> = { ft:1, m:3.28084, yard:3, cm:0.0328084, inch:0.0833333 };
  const l = (parseFloat(length)||0) * (ftMul[dimUnit]||1);
  const w = (parseFloat(width)||0) * (ftMul[dimUnit]||1);
  const areaInAcres = mode === "dims" ? l * w * conv.sqft : (parseFloat(totalVal)||0) * (conv[inputUnit]||1);
  const areaSqFt = areaInAcres / conv.sqft;
  const landValue = areaSqFt * (parseFloat(rate)||0);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Plot Calculator" icon={Calculator} iconColor="bg-green-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"dims", label:"By Dimensions" }, { id:"area", label:"By Area" }]} active={mode} onChange={setMode} />
          {mode === "dims" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Length" value={length} onChange={setLength} type="number" />
                <InputField label="Width" value={width} onChange={setWidth} type="number" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Dimension Unit</label>
                <div className="flex gap-1.5">
                  {["ft","m","yard","cm","inch"].map(u => (
                    <button key={u} onClick={() => setDimUnit(u)} className={`flex-1 py-2 rounded-lg text-xs font-bold ${dimUnit === u ? "bg-green-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{u}</button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <InputField label="Total Area" value={totalVal} onChange={setTotalVal} type="number" />
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Input Unit</label>
                <select value={inputUnit} onChange={e => setInputUnit(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
                  {Object.keys(conv).map(u => <option key={u} value={u} className="capitalize">{u}</option>)}
                </select>
              </div>
            </>
          )}
          <InputField label={`Land Rate (${cs(currency)}/sq.ft)`} value={rate} onChange={setRate} type="number" prefix={cs(currency)} />
        </InputPanel>
      }
      results={
        <ResultPanel label="Plot Area Breakdown" primary={`${fmt(areaSqFt, 0)} sq.ft`}
          summaries={<>
            <SummaryCard label="Land Value" value={`${cs(currency)}${fmt(landValue, 0)}`} accent="text-green-500" />
            <SummaryCard label="In Sq. Meter" value={`${fmt(areaInAcres/conv.sqm, 0)}`} />
          </>}
        >
          <BreakdownRow label="Sq. Feet" value={`${fmt(areaSqFt, 0)}`} dot="bg-green-500" bold />
          <BreakdownRow label="Sq. Meters" value={`${fmt(areaInAcres/conv.sqm, 0)}`} dot="bg-blue-400" />
          <BreakdownRow label="Sq. Yards" value={`${fmt(areaInAcres/conv.sqyard, 0)}`} dot="bg-purple-400" />
          <BreakdownRow label="Cent" value={`${fmt(areaInAcres/conv.cent, 2)}`} dot="bg-amber-400" />
          <BreakdownRow label="Acre" value={`${fmt(areaInAcres, 4)}`} dot="bg-red-400" />
          <BreakdownRow label="Bigha" value={`${fmt(areaInAcres/conv.bigha, 3)}`} dot="bg-cyan-400" />
          <BreakdownRow label="Marla" value={`${fmt(areaInAcres/conv.marla, 2)}`} />
        </ResultPanel>
      }
    />
  );
}

function Irrigation() {
  const [mode, setMode] = useState("water");
  const [area, setArea] = useState("5"); const [areaUnit, setAreaUnit] = useState("acre");
  const [cropWater, setCropWater] = useState("500"); const [efficiency, setEfficiency] = useState("90");
  const [irrigType, setIrrigType] = useState("drip");
  const [pumpFlow, setPumpFlow] = useState("10000"); const [flowUnit, setFlowUnit] = useState("lph");

  const aToAcre: Record<string, number> = { acre:1, hectare:2.47105, bigha:0.6198 };
  const typeEff: Record<string, number> = { drip:90, sprinkler:75, flood:55, furrow:60 };
  const acres = (parseFloat(area)||0) * (aToAcre[areaUnit]||1);
  const eff = parseFloat(efficiency)||typeEff[irrigType];
  const totalMM = acres * (parseFloat(cropWater)||0);
  const actualMM = totalMM / (eff/100);
  const volL = actualMM * acres * 4046.86 / 1000;
  const flowLph = flowUnit === "lph" ? parseFloat(pumpFlow)||0 : flowUnit === "lpm" ? (parseFloat(pumpFlow)||0)*60 : (parseFloat(pumpFlow)||0)*227.124;
  const hrs = flowLph > 0 ? volL / flowLph : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Irrigation Parameters" icon={Droplets} iconColor="bg-cyan-500">
          <ModeSelector modes={[{ id:"water", label:"Water Need" }, { id:"pump", label:"Pump Time" }]} active={mode} onChange={setMode} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Irrigation Type</label>
            <div className="grid grid-cols-4 gap-1.5">
              {Object.keys(typeEff).map(t => (
                <button key={t} onClick={() => { setIrrigType(t); setEfficiency(String(typeEff[t])); }} data-testid={`irrig-${t}`}
                  className={`py-2 rounded-lg text-xs font-bold capitalize ${irrigType === t ? "bg-cyan-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Land Area" value={area} onChange={setArea} type="number" />
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Unit</label>
              <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
                {Object.keys(aToAcre).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <InputField label="Crop Water Need (mm/season)" value={cropWater} onChange={setCropWater} type="number" />
          <InputField label={`Efficiency (%) — ${irrigType}: ${typeEff[irrigType]}%`} value={efficiency} onChange={setEfficiency} type="number" />
          {mode === "pump" && (
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Pump Flow Rate" value={pumpFlow} onChange={setPumpFlow} type="number" />
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Unit</label>
                <select value={flowUnit} onChange={e => setFlowUnit(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
                  {["lph","lpm","gpm"].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          )}
        </InputPanel>
      }
      results={
        <ResultPanel label="Water Requirement" primary={`${fmt(volL, 0)} L`}
          summaries={<>
            <SummaryCard label="In Cubic Meters" value={`${fmt(volL/1000, 1)} m³`} accent="text-cyan-500" />
            <SummaryCard label="In Gallons" value={`${fmt(volL*0.264172, 0)} gal`} />
          </>}
        >
          <BreakdownRow label="Gross Water Need" value={`${fmt(actualMM, 0)} mm`} dot="bg-cyan-400" bold />
          <BreakdownRow label="Volume (Liters)" value={`${fmt(volL, 0)} L`} dot="bg-blue-400" />
          <BreakdownRow label="Volume (m³)" value={`${fmt(volL/1000, 1)}`} dot="bg-green-400" />
          <BreakdownRow label="Volume (Gallons)" value={`${fmt(volL*0.264172, 0)}`} dot="bg-purple-400" />
          {mode === "pump" && <BreakdownRow label="Pump Hours Needed" value={`${fmt(hrs, 1)} hrs`} bold />}
        </ResultPanel>
      }
    />
  );
}

function TractorFuel() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("cost");
  const [fuelType, setFuelType] = useState("diesel");
  const [hours, setHours] = useState("8"); const [fuelRate, setFuelRate] = useState("8");
  const [fuelPrice, setFuelPrice] = useState("90"); const [hp, setHp] = useState("50");
  const [area, setArea] = useState("2");
  const typeRates: Record<string, number> = { diesel:0.15, petrol:0.18, cng:0.12 };
  const h = parseFloat(hours)||0; const rate = parseFloat(fuelRate)||0;
  const price = parseFloat(fuelPrice)||0; const hpN = parseFloat(hp)||50;
  const estRate = hpN * typeRates[fuelType];
  const fuelUsed = h * rate; const dailyCost = fuelUsed * price;
  const estCost = estRate * h * price; const areaVal = parseFloat(area)||1;
  const costPerAcre = areaVal > 0 ? dailyCost / areaVal : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Tractor Parameters" icon={Fuel} iconColor="bg-orange-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"cost", label:"Fuel Cost" }, { id:"estimate", label:"HP Estimator" }]} active={mode} onChange={setMode} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Fuel Type</label>
            <div className="flex gap-1.5">
              {Object.keys(typeRates).map(t => (
                <button key={t} onClick={() => setFuelType(t)} className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize ${fuelType === t ? "bg-orange-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{t}</button>
              ))}
            </div>
          </div>
          <InputField label="Operating Hours" value={hours} onChange={setHours} type="number" />
          {mode === "cost" ? (
            <>
              <InputField label="Fuel Rate (L/hr)" value={fuelRate} onChange={setFuelRate} type="number" />
              <InputField label={`Fuel Price (${cs(currency)}/L)`} value={fuelPrice} onChange={setFuelPrice} type="number" prefix={cs(currency)} />
              <InputField label="Area Covered (acres)" value={area} onChange={setArea} type="number" />
            </>
          ) : (
            <>
              <InputField label="Tractor HP Rating" value={hp} onChange={setHp} type="number" />
              <InputField label={`Fuel Price (${cs(currency)}/L)`} value={fuelPrice} onChange={setFuelPrice} type="number" prefix={cs(currency)} />
            </>
          )}
        </InputPanel>
      }
      results={
        mode === "cost" ? (
          <ResultPanel label="Fuel Cost Analysis" primary={`${cs(currency)}${fmt(dailyCost, 0)}`} primarySub="daily"
            summaries={<>
              <SummaryCard label="Monthly (26 days)" value={`${cs(currency)}${fmt(dailyCost*26, 0)}`} accent="text-orange-500" />
              <SummaryCard label="Cost per Acre" value={`${cs(currency)}${fmt(costPerAcre, 0)}`} />
            </>}
          >
            <BreakdownRow label="Fuel Used (L)" value={`${fmt(fuelUsed, 1)} L`} dot="bg-orange-400" />
            <BreakdownRow label="Daily Cost" value={`${cs(currency)}${fmt(dailyCost, 0)}`} dot="bg-red-400" bold />
            <BreakdownRow label="Monthly Cost" value={`${cs(currency)}${fmt(dailyCost*26, 0)}`} dot="bg-purple-400" />
            <BreakdownRow label="Annual Cost" value={`${cs(currency)}${fmt(dailyCost*26*12, 0)}`} dot="bg-blue-400" />
            <BreakdownRow label="Cost per Acre" value={`${cs(currency)}${fmt(costPerAcre, 0)}`} />
          </ResultPanel>
        ) : (
          <ResultPanel label="HP-Based Estimate" primary={`${fmt(estRate, 1)} L/hr`}
            summaries={<>
              <SummaryCard label="Est. Fuel (total)" value={`${fmt(estRate*h, 1)} L`} accent="text-orange-500" />
              <SummaryCard label="Est. Cost" value={`${cs(currency)}${fmt(estCost, 0)}`} />
            </>}
            tip={`Based on ${fuelType} consumption of ~${typeRates[fuelType]} L/HP/hr.`}
          >
            <BreakdownRow label="Estimated Rate" value={`${fmt(estRate, 2)} L/hr`} dot="bg-orange-400" bold />
            <BreakdownRow label={`Fuel for ${hours}hrs`} value={`${fmt(estRate*h, 1)} L`} dot="bg-amber-400" />
            <BreakdownRow label="Estimated Cost" value={`${cs(currency)}${fmt(estCost, 0)}`} dot="bg-red-400" bold />
          </ResultPanel>
        )
      }
    />
  );
}

function FarmProfit() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("profit");
  const [revenue, setRevenue] = useState("150000");
  const [seedCost, setSeedCost] = useState("8000"); const [fertCost, setFertCost] = useState("12000");
  const [laborCost, setLaborCost] = useState("20000"); const [irrigCost, setIrrigCost] = useState("5000");
  const [machineCost, setMachineCost] = useState("8000"); const [otherCost, setOtherCost] = useState("5000");
  const [targetMargin, setTargetMargin] = useState("30");

  const rev = parseFloat(revenue)||0;
  const costs = [parseFloat(seedCost)||0, parseFloat(fertCost)||0, parseFloat(laborCost)||0, parseFloat(irrigCost)||0, parseFloat(machineCost)||0, parseFloat(otherCost)||0];
  const totalCost = costs.reduce((a,b) => a+b, 0);
  const profit = rev - totalCost; const margin = rev > 0 ? (profit/rev)*100 : 0;
  const roi = totalCost > 0 ? (profit/totalCost)*100 : 0;
  const tMargin = parseFloat(targetMargin)||30;
  const reqRev = tMargin < 100 ? totalCost / (1-tMargin/100) : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Farm Financial Data" icon={DollarSign} iconColor="bg-emerald-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"profit", label:"Profit Analysis" }, { id:"plan", label:"Revenue Target" }]} active={mode} onChange={setMode} />
          <InputField label="Total Revenue" value={revenue} onChange={setRevenue} type="number" prefix={cs(currency)} />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Seed Cost" value={seedCost} onChange={setSeedCost} type="number" />
            <InputField label="Fertilizer Cost" value={fertCost} onChange={setFertCost} type="number" />
            <InputField label="Labor Cost" value={laborCost} onChange={setLaborCost} type="number" />
            <InputField label="Irrigation Cost" value={irrigCost} onChange={setIrrigCost} type="number" />
            <InputField label="Machinery Cost" value={machineCost} onChange={setMachineCost} type="number" />
            <InputField label="Other Costs" value={otherCost} onChange={setOtherCost} type="number" />
          </div>
          {mode === "plan" && <InputField label="Target Profit Margin (%)" value={targetMargin} onChange={setTargetMargin} type="number" suffix="%" />}
        </InputPanel>
      }
      results={
        mode === "profit" ? (
          <ResultPanel label="Net Farm Profit"
            primary={`${cs(currency)}${fmt(profit, 0)}`}
            summaries={<>
              <SummaryCard label="Profit Margin" value={`${fmt(margin, 1)}%`} accent={margin >= 0 ? "text-emerald-500" : "text-red-500"} />
              <SummaryCard label="ROI" value={`${fmt(roi, 1)}%`} />
            </>}
          >
            <BreakdownRow label="Total Revenue" value={`${cs(currency)}${fmt(rev, 0)}`} dot="bg-green-500" />
            <BreakdownRow label="Total Costs" value={`${cs(currency)}${fmt(totalCost, 0)}`} dot="bg-red-400" />
            <BreakdownRow label="Seed (% of rev)" value={`${rev > 0 ? fmt(costs[0]/rev*100, 1) : "—"}%`} dot="bg-amber-400" />
            <BreakdownRow label="Labor (% of rev)" value={`${rev > 0 ? fmt(costs[2]/rev*100, 1) : "—"}%`} dot="bg-purple-400" />
            <BreakdownRow label="Net Profit" value={`${cs(currency)}${fmt(profit, 0)}`} bold />
          </ResultPanel>
        ) : (
          <ResultPanel label="Revenue Planning"
            primary={`${cs(currency)}${fmt(reqRev, 0)}`} primarySub="needed"
            summaries={<>
              <SummaryCard label="Total Costs" value={`${cs(currency)}${fmt(totalCost, 0)}`} />
              <SummaryCard label="Gap to Target" value={`${cs(currency)}${fmt(Math.max(0, reqRev-rev), 0)}`} accent="text-amber-500" />
            </>}
          >
            <BreakdownRow label="Total Costs" value={`${cs(currency)}${fmt(totalCost, 0)}`} dot="bg-red-400" />
            <BreakdownRow label={`Rev for ${tMargin}% margin`} value={`${cs(currency)}${fmt(reqRev, 0)}`} dot="bg-green-500" bold />
            <BreakdownRow label="Break-Even Revenue" value={`${cs(currency)}${fmt(totalCost, 0)}`} dot="bg-blue-400" />
            <BreakdownRow label="Revenue Gap" value={`${cs(currency)}${fmt(Math.max(0, reqRev-rev), 0)}`} bold />
          </ResultPanel>
        )
      }
    />
  );
}
