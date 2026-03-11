import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Home, Zap, Battery, Sun, Droplets, Cloud, ShoppingCart, Wifi, Smartphone, Flame, Wind } from "lucide-react";
import { ToolCard, InputField } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "gas" | "ac" | "inverter" | "solar" | "tank" | "rainwater" | "expense" | "data" | "battery";

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
function ModeBar({ modes, active, onChange, color = "bg-lime-600" }: { modes: { id: string; label: string }[]; active: string; onChange: (id: string) => void; color?: string }) {
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
    <div className={`flex justify-between items-center p-2.5 rounded-xl ${hi ? "bg-lime-500/15 border border-lime-500/20" : "bg-muted/30"}`}>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold ${hi ? (accent || "text-lime-400") : "text-foreground"}`}>{value}</span>
    </div>
  );
}
function fmt(n: number, d = 2) { if (!isFinite(n) || isNaN(n)) return "—"; return parseFloat(n.toFixed(d)).toLocaleString(); }

export default function LifestyleTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("gas");
  const tools = [
    { id: "gas", label: "Gas Usage", icon: Flame },
    { id: "ac", label: "AC Power", icon: Wind },
    { id: "inverter", label: "Inverter", icon: Battery },
    { id: "solar", label: "Solar", icon: Sun },
    { id: "tank", label: "Tank Vol", icon: Droplets },
    { id: "rainwater", label: "Rainwater", icon: Cloud },
    { id: "expense", label: "Expense", icon: ShoppingCart },
    { id: "data", label: "Data Usage", icon: Wifi },
    { id: "battery", label: "Battery", icon: Smartphone },
  ];
  return (
    <PageWrapper title="Home & Lifestyle" subtitle="Utility and home calculators" accentColor="bg-lime-500" tools={tools} activeTool={activeTool} onToolChange={(id) => setActiveTool(id as ToolType)}>
      {activeTool === "gas" && <GasUsageEstimator />}
      {activeTool === "ac" && <ACPowerConsumption />}
      {activeTool === "inverter" && <InverterCalculator />}
      {activeTool === "solar" && <SolarPanelCalculator />}
      {activeTool === "tank" && <WaterTankVolume />}
      {activeTool === "rainwater" && <RainwaterHarvest />}
      {activeTool === "expense" && <ExpenseSplitter />}
      {activeTool === "data" && <DataUsageEstimator />}
      {activeTool === "battery" && <BatteryHealthEstimator />}
    </PageWrapper>
  );
}

function GasUsageEstimator() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("lpg");
  const [cylinderSize, setCylinderSize] = useState("14.2");
  const [dailyUsage, setDailyUsage] = useState("0.5");
  const [gasPrice, setGasPrice] = useState("950");
  const [gasUnit, setGasUnit] = useState("kg");
  const [cngPricePerKg, setCngPricePerKg] = useState("85");
  const [cngMileage, setCngMileage] = useState("25");
  const [pngRate, setPngRate] = useState("55");
  const [pngUsage, setPngUsage] = useState("30");

  const cylinderSizes = ["5", "12", "14.2", "19", "22", "37", "47.5"];
  const size = parseFloat(cylinderSize)||14.2;
  const daily = parseFloat(dailyUsage)||0.5;
  const price = parseFloat(gasPrice)||950;
  const daysRemaining = daily > 0 ? size / daily : 0;
  const monthlyUsage = daily * 30;
  const cylindersPerMonth = monthlyUsage / size;
  const monthlyCost = cylindersPerMonth * price;

  const cngPrice = parseFloat(cngPricePerKg)||85;
  const cngMileageNum = parseFloat(cngMileage)||25;
  const cngPerKm = cngMileageNum > 0 ? 1 / cngMileageNum : 0;
  const cngCostPer100 = cngPerKm * 100 * cngPrice;

  const pngRateNum = parseFloat(pngRate)||55;
  const pngUsageNum = parseFloat(pngUsage)||30;
  const pngMonthly = pngRateNum * pngUsageNum;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Gas Usage Calculator" icon={Flame} iconColor="bg-orange-500">
        <ModeBar modes={[{ id: "lpg", label: "LPG Cylinder" }, { id: "cng", label: "CNG Vehicle" }, { id: "png", label: "PNG (Piped)" }]} active={mode} onChange={setMode} color="bg-orange-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        {mode === "lpg" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Cylinder Size (kg)</label>
              <div className="flex gap-1.5 flex-wrap">
                {cylinderSizes.map(s => (
                  <button key={s} onClick={() => setCylinderSize(s)} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${cylinderSize === s ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"}`}>{s}kg</button>
                ))}
              </div>
            </div>
            <InputField label="Custom Cylinder Size (kg)" value={cylinderSize} onChange={setCylinderSize} type="number" step={0.1} />
            <div className="flex gap-2">
              <div className="flex-1"><InputField label="Daily Usage" value={dailyUsage} onChange={setDailyUsage} type="number" step={0.1} /></div>
              <div className="mt-6">
                <select value={gasUnit} onChange={e => setGasUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
                  {["kg", "lbs"].map(u => <option key={u} value={u}>{u}/day</option>)}
                </select>
              </div>
            </div>
            <InputField label={`Price per Cylinder (${cs(currency)})`} value={gasPrice} onChange={setGasPrice} type="number" />
            <div className="space-y-2 mt-2">
              <Row label="Days per Cylinder" value={`${fmt(daysRemaining, 0)} days`} hi />
              <Row label="Cylinders per Month" value={`${fmt(cylindersPerMonth, 2)}`} />
              <Row label="Monthly Cost" value={`${cs(currency)}${fmt(monthlyCost, 0)}`} hi accent="text-orange-400" />
              <Row label="Annual Cost" value={`${cs(currency)}${fmt(monthlyCost * 12, 0)}`} />
            </div>
          </div>
        )}
        {mode === "cng" && (
          <div className="space-y-3">
            <InputField label={`CNG Price (${cs(currency)}/kg)`} value={cngPricePerKg} onChange={setCngPricePerKg} type="number" />
            <InputField label="Mileage (km/kg)" value={cngMileage} onChange={setCngMileage} type="number" />
            <InputField label="Monthly Distance (km)" value={dailyUsage} onChange={setDailyUsage} type="number" />
            <div className="space-y-2 mt-2">
              <Row label="CNG per 100 km" value={`${fmt(cngPerKm * 100, 2)} kg`} hi />
              <Row label={`Cost per 100 km`} value={`${cs(currency)}${fmt(cngCostPer100, 0)}`} />
              <Row label={`Monthly CNG Cost`} value={`${cs(currency)}${fmt(cngPerKm * parseFloat(dailyUsage) * cngPrice, 0)}`} hi accent="text-orange-400" />
              <Row label="Annual CNG Cost" value={`${cs(currency)}${fmt(cngPerKm * parseFloat(dailyUsage) * cngPrice * 12, 0)}`} />
            </div>
          </div>
        )}
        {mode === "png" && (
          <div className="space-y-3">
            <InputField label={`PNG Rate (${cs(currency)}/SCM or unit)`} value={pngRate} onChange={setPngRate} type="number" />
            <InputField label="Monthly Usage (units/SCM)" value={pngUsage} onChange={setPngUsage} type="number" />
            <div className="space-y-2 mt-2">
              <Row label="Monthly Units" value={`${fmt(pngUsageNum)} SCM`} />
              <Row label="Monthly Bill" value={`${cs(currency)}${fmt(pngMonthly, 0)}`} hi accent="text-orange-400" />
              <Row label="Annual Bill" value={`${cs(currency)}${fmt(pngMonthly * 12, 0)}`} />
              <Row label="Daily Cost" value={`${cs(currency)}${fmt(pngMonthly / 30, 1)}`} />
            </div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function ACPowerConsumption() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("unit");
  const [tons, setTons] = useState("1.5");
  const [starRating, setStarRating] = useState("3");
  const [acType, setAcType] = useState("inverter");
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [daysPerMonth, setDaysPerMonth] = useState("30");
  const [ratePerUnit, setRatePerUnit] = useState("8");
  const [numACs, setNumACs] = useState("1");

  const starEER: Record<string, number> = { "1": 2.5, "2": 2.7, "3": 2.9, "4": 3.1, "5": 3.5 };
  const acTypeMul: Record<string, number> = { inverter: 0.75, "non-inverter": 1.0, window: 0.95 };
  const t = parseFloat(tons)||1.5; const h = parseFloat(hoursPerDay)||8;
  const d = parseFloat(daysPerMonth)||30; const rate = parseFloat(ratePerUnit)||8;
  const count = parseInt(numACs)||1;

  const btuPerTon = 12000; const btuPerHour = t * btuPerTon;
  const eer = starEER[starRating] || 2.9;
  const kw = (btuPerHour / (eer * 3412)) * acTypeMul[acType];
  const dailyKwh = kw * h * count;
  const monthlyKwh = dailyKwh * d;
  const monthlyCost = monthlyKwh * rate;

  const tonToBTU = t * 12000;
  const tonToKW = t * 3.516;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="AC Power Consumption" icon={Wind} iconColor="bg-blue-500">
        <ModeBar modes={[{ id: "unit", label: "Monthly Bill" }, { id: "size", label: "Room Size Guide" }]} active={mode} onChange={setMode} color="bg-blue-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="flex gap-2">
          <div className="flex-1"><InputField label="AC Capacity (Tons)" value={tons} onChange={setTons} type="number" step={0.5} /></div>
          <div className="mt-6">
            <select value={acType} onChange={e => setAcType(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
              {["inverter", "non-inverter", "window"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Star Rating (BEE)</label>
          <div className="flex gap-1.5">
            {["1","2","3","4","5"].map(s => (
              <button key={s} onClick={() => setStarRating(s)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${starRating === s ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}>{"⭐".repeat(parseInt(s) > 3 ? 3 : parseInt(s))}{s}★</button>
            ))}
          </div>
        </div>
        {mode === "unit" && (
          <>
            <InputField label="Hours per Day" value={hoursPerDay} onChange={setHoursPerDay} type="number" />
            <div className="grid grid-cols-2 gap-2">
              <InputField label="Days per Month" value={daysPerMonth} onChange={setDaysPerMonth} type="number" />
              <InputField label="Number of ACs" value={numACs} onChange={setNumACs} type="number" />
            </div>
            <InputField label={`Rate per Unit/kWh (${cs(currency)})`} value={ratePerUnit} onChange={setRatePerUnit} type="number" step={0.5} />
            <div className="space-y-2 mt-3">
              <Row label="Power Draw" value={`${fmt(kw * 1000, 0)} W (${fmt(kw, 3)} kW)`} />
              <Row label="Daily Usage" value={`${fmt(dailyKwh, 2)} kWh`} />
              <Row label="Monthly Usage" value={`${fmt(monthlyKwh, 0)} kWh (units)`} hi />
              <Row label="Monthly Bill" value={`${cs(currency)}${fmt(monthlyCost, 0)}`} hi accent="text-blue-400" />
              <Row label="Annual Bill" value={`${cs(currency)}${fmt(monthlyCost * 12, 0)}`} />
            </div>
          </>
        )}
        {mode === "size" && (
          <div className="space-y-2 mt-3">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-400">Your AC: {t} Ton = {fmt(tonToBTU, 0)} BTU = {fmt(tonToKW, 2)} kW</div>
            {[{ area: "Up to 10 sqm (110 sqft)", size: "0.8 Ton" }, { area: "10–15 sqm (150 sqft)", size: "1.0 Ton" }, { area: "15–20 sqm (215 sqft)", size: "1.5 Ton" }, { area: "20–30 sqm (320 sqft)", size: "2.0 Ton" }, { area: "30–45 sqm (485 sqft)", size: "2.5 Ton" }, { area: "45+ sqm (485+ sqft)", size: "3+ Ton" }].map((r, i) => (
              <div key={i} className="flex justify-between items-center p-2 bg-muted/30 rounded-xl">
                <span className="text-xs text-muted-foreground">{r.area}</span>
                <span className="text-xs font-bold text-blue-400">{r.size}</span>
              </div>
            ))}
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function InverterCalculator() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("backup");
  const [numBatteries, setNumBatteries] = useState("1");
  const [batteryAh, setBatteryAh] = useState("150");
  const [batteryVolt, setBatteryVolt] = useState("12");
  const [loadWatts, setLoadWatts] = useState("300");
  const [depth, setDepth] = useState("80");
  const [chargeHours, setChargeHours] = useState("8");
  const [inverterEff, setInverterEff] = useState("85");

  const nb = parseInt(numBatteries)||1; const ah = parseFloat(batteryAh)||150;
  const v = parseFloat(batteryVolt)||12; const load = parseFloat(loadWatts)||300;
  const dod = parseFloat(depth)||80; const eff = parseFloat(inverterEff)||85;

  const totalWh = nb * ah * v;
  const usableWh = totalWh * (dod / 100) * (eff / 100);
  const backupHours = load > 0 ? usableWh / load : 0;
  const chargingCurrent = totalWh / (parseFloat(chargeHours)||8) / v;
  const inverterVA = load / (eff / 100);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Inverter/Battery Calculator" icon={Battery} iconColor="bg-yellow-500">
        <ModeBar modes={[{ id: "backup", label: "Backup Time" }, { id: "size", label: "Inverter Sizing" }]} active={mode} onChange={setMode} color="bg-yellow-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Batteries in parallel</span>
          <div className="flex gap-1.5">
            {["1","2","3","4"].map(n => (
              <button key={n} onClick={() => setNumBatteries(n)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${numBatteries === n ? "bg-yellow-500 text-white" : "bg-muted text-muted-foreground"}`}>{n}×</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <InputField label="Battery (Ah)" value={batteryAh} onChange={setBatteryAh} type="number" />
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Voltage</label>
            <select value={batteryVolt} onChange={e => setBatteryVolt(e.target.value)} className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
              {["6","12","24","48"].map(v => <option key={v} value={v}>{v}V</option>)}
            </select>
          </div>
        </div>
        <InputField label="Load (Watts)" value={loadWatts} onChange={setLoadWatts} type="number" />
        <InputField label="Depth of Discharge (%)" value={depth} onChange={setDepth} type="number" />
        <InputField label="Inverter Efficiency (%)" value={inverterEff} onChange={setInverterEff} type="number" />
        {mode === "size" && <InputField label="Charging Time Available (hrs)" value={chargeHours} onChange={setChargeHours} type="number" />}
        <div className="space-y-2 mt-3">
          <Row label={`Total Capacity (${nb} × ${ah}Ah × ${v}V)`} value={`${fmt(totalWh, 0)} Wh`} />
          <Row label="Usable Capacity" value={`${fmt(usableWh, 0)} Wh`} />
          <Row label="Backup Time" value={`${fmt(backupHours, 1)} hours`} hi accent="text-yellow-400" />
          <Row label="Backup Time (min)" value={`${fmt(backupHours * 60, 0)} min`} />
          {mode === "size" && <>
            <Row label="Required Inverter Size" value={`${fmt(inverterVA, 0)} VA`} hi />
            <Row label="Charging Current Needed" value={`${fmt(chargingCurrent, 1)} A`} />
          </>}
        </div>
      </ToolCard>
    </div>
  );
}

function SolarPanelCalculator() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("size");
  const [dailyUsage, setDailyUsage] = useState("10");
  const [sunHours, setSunHours] = useState("5");
  const [panelWatts, setPanelWatts] = useState("400");
  const [ratePerUnit, setRatePerUnit] = useState("8");
  const [systemCost, setSystemCost] = useState("150000");

  const usage = parseFloat(dailyUsage)||10; const hours = parseFloat(sunHours)||5;
  const panel = parseFloat(panelWatts)||400; const rate = parseFloat(ratePerUnit)||8;
  const cost = parseFloat(systemCost)||150000;

  const systemSizeKW = usage / hours;
  const panelsNeeded = Math.ceil((systemSizeKW * 1000) / panel);
  const yearlyGen = systemSizeKW * hours * 365;
  const annualSavings = yearlyGen * rate;
  const paybackYears = annualSavings > 0 ? cost / annualSavings : 0;
  const co2SavedKg = yearlyGen * 0.82;

  const sunPresets: Record<string, string> = { Mumbai: "5.5", Delhi: "5.3", Chennai: "5.8", Bangalore: "5.1", London: "2.8", NYC: "4.2", Dubai: "5.9", Sydney: "5.2" };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Solar Panel Calculator" icon={Sun} iconColor="bg-amber-500">
        <ModeBar modes={[{ id: "size", label: "System Size" }, { id: "savings", label: "Savings & ROI" }]} active={mode} onChange={setMode} color="bg-amber-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">City Sun Hours Preset</label>
          <div className="flex gap-1.5 flex-wrap">
            {Object.entries(sunPresets).map(([city, h]) => (
              <button key={city} onClick={() => setSunHours(h)} className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${sunHours === h ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}>{city}</button>
            ))}
          </div>
        </div>
        <InputField label="Daily Usage (kWh)" value={dailyUsage} onChange={setDailyUsage} type="number" />
        <InputField label="Peak Sun Hours/day" value={sunHours} onChange={setSunHours} type="number" step={0.1} />
        <InputField label="Panel Wattage (W)" value={panelWatts} onChange={setPanelWatts} type="number" />
        {mode === "savings" && (
          <>
            <InputField label={`Electricity Rate (${cs(currency)}/kWh)`} value={ratePerUnit} onChange={setRatePerUnit} type="number" />
            <InputField label={`System Cost (${cs(currency)})`} value={systemCost} onChange={setSystemCost} type="number" />
          </>
        )}
        <div className="space-y-2 mt-3">
          <Row label="System Size Needed" value={`${fmt(systemSizeKW, 2)} kWp`} hi />
          <Row label="Panels Needed" value={`${panelsNeeded} × ${panel}W`} />
          <Row label="Annual Generation" value={`${fmt(yearlyGen, 0)} kWh`} />
          {mode === "savings" && (
            <>
              <Row label="Annual Savings" value={`${cs(currency)}${fmt(annualSavings, 0)}`} hi accent="text-amber-400" />
              <Row label="Payback Period" value={`${fmt(paybackYears, 1)} years`} />
              <Row label="CO₂ Saved/Year" value={`${fmt(co2SavedKg, 0)} kg`} accent="text-green-400" />
              <Row label="25yr Total Savings" value={`${cs(currency)}${fmt(annualSavings * 25 - cost, 0)}`} />
            </>
          )}
        </div>
      </ToolCard>
    </div>
  );
}

function WaterTankVolume() {
  const [currency, setCurrency] = useState("INR");
  const [shape, setShape] = useState("rectangular");
  const [unitSys, setUnitSys] = useState("metric");
  const [length, setLength] = useState("2");
  const [width, setWidth] = useState("1.5");
  const [height, setHeight] = useState("1");
  const [diameter, setDiameter] = useState("1.5");
  const [waterRate, setWaterRate] = useState("5");

  const toM = (v: string) => { const n = parseFloat(v)||0; return unitSys === "metric" ? n : n * 0.3048; };
  const l = toM(length); const w = toM(width); const h = toM(height); const d = toM(diameter);

  const volumeM3 = shape === "rectangular" ? l * w * h : Math.PI * Math.pow(d / 2, 2) * h;
  const volLiters = volumeM3 * 1000;
  const volGallons = volLiters * 0.264172;
  const waterCost = volLiters * (parseFloat(waterRate)||0) / 1000;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Water Tank Volume" icon={Droplets} iconColor="bg-cyan-500">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="flex gap-2 mb-3">
          {["rectangular", "cylindrical"].map(s => (
            <button key={s} onClick={() => setShape(s)} className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${shape === s ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"}`} data-testid={`shape-${s}`}>{s}</button>
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          {["metric", "imperial"].map(u => (
            <button key={u} onClick={() => setUnitSys(u)} className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${unitSys === u ? "bg-cyan-600 text-white" : "bg-muted text-muted-foreground"}`}>{u}</button>
          ))}
        </div>
        {shape === "rectangular" ? (
          <div className="space-y-2">
            <InputField label={`Length (${unitSys === "metric" ? "m" : "ft"})`} value={length} onChange={setLength} type="number" />
            <InputField label={`Width (${unitSys === "metric" ? "m" : "ft"})`} value={width} onChange={setWidth} type="number" />
          </div>
        ) : (
          <InputField label={`Diameter (${unitSys === "metric" ? "m" : "ft"})`} value={diameter} onChange={setDiameter} type="number" />
        )}
        <InputField label={`Height (${unitSys === "metric" ? "m" : "ft"})`} value={height} onChange={setHeight} type="number" />
        <InputField label={`Water Rate (${cs(currency)}/1000L)`} value={waterRate} onChange={setWaterRate} type="number" />
        <div className="space-y-2 mt-3">
          <Row label="Volume (m³)" value={`${fmt(volumeM3, 3)} m³`} />
          <Row label="Volume (Liters)" value={`${fmt(volLiters, 0)} L`} hi accent="text-cyan-400" />
          <Row label="Volume (Gallons)" value={`${fmt(volGallons, 0)} gal`} />
          <Row label="Volume (Cu.ft)" value={`${fmt(volumeM3 * 35.3147, 2)} ft³`} />
          <Row label="Water Cost to Fill" value={`${cs(currency)}${fmt(waterCost, 2)}`} hi />
        </div>
      </ToolCard>
    </div>
  );
}

function RainwaterHarvest() {
  const [currency, setCurrency] = useState("INR");
  const [roofArea, setRoofArea] = useState("100");
  const [areaUnit, setAreaUnit] = useState("sqm");
  const [annualRainfall, setAnnualRainfall] = useState("800");
  const [efficiency, setEfficiency] = useState("80");
  const [waterRate, setWaterRate] = useState("5");

  const cityRainfall: Record<string, string> = { Mumbai: "2167", Chennai: "1400", Delhi: "800", Kolkata: "1800", Bengaluru: "970", London: "601", NYC: "1142", Dubai: "100", Singapore: "2340", Sydney: "1200" };
  const areaToSqM: Record<string, number> = { sqm: 1, sqft: 0.0929, sqyard: 0.836 };

  const areaSqm = (parseFloat(roofArea)||0) * (areaToSqM[areaUnit]||1);
  const rainfall = parseFloat(annualRainfall)||0;
  const eff = parseFloat(efficiency)||80;
  const rate = parseFloat(waterRate)||5;

  const totalHarvest = areaSqm * (rainfall / 1000) * (eff / 100) * 1000;
  const monthly = totalHarvest / 12;
  const savings = totalHarvest * rate / 1000;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Rainwater Harvesting" icon={Cloud} iconColor="bg-blue-500">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">City Rainfall Preset</label>
          <div className="flex gap-1 flex-wrap">
            {Object.entries(cityRainfall).map(([city, mm]) => (
              <button key={city} onClick={() => setAnnualRainfall(mm)} className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${annualRainfall === mm ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}>{city}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1"><InputField label="Roof/Catchment Area" value={roofArea} onChange={setRoofArea} type="number" /></div>
          <div className="mt-6">
            <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
              {Object.keys(areaToSqM).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <InputField label="Annual Rainfall (mm)" value={annualRainfall} onChange={setAnnualRainfall} type="number" />
        <InputField label="Collection Efficiency (%)" value={efficiency} onChange={setEfficiency} type="number" />
        <InputField label={`Water Rate (${cs(currency)}/1000L)`} value={waterRate} onChange={setWaterRate} type="number" />
        <div className="space-y-2 mt-3">
          <Row label="Annual Harvest" value={`${fmt(totalHarvest, 0)} L`} hi accent="text-blue-400" />
          <Row label="Monthly Average" value={`${fmt(monthly, 0)} L`} />
          <Row label="In Cubic Meters" value={`${fmt(totalHarvest / 1000, 2)} m³`} />
          <Row label="In Gallons" value={`${fmt(totalHarvest * 0.264172, 0)} gal`} />
          <Row label="Annual Water Bill Savings" value={`${cs(currency)}${fmt(savings, 0)}`} hi />
        </div>
      </ToolCard>
    </div>
  );
}

function ExpenseSplitter() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("equal");
  const [totalAmount, setTotalAmount] = useState("2000");
  const [people, setPeople] = useState("4");
  const [tipPercent, setTipPercent] = useState("10");
  const [person1, setPerson1] = useState("30");
  const [person2, setPerson2] = useState("25");
  const [person3, setPerson3] = useState("25");
  const [person4, setPerson4] = useState("20");

  const total = parseFloat(totalAmount)||0;
  const numPeople = parseInt(people)||1;
  const tip = parseFloat(tipPercent)||0;
  const tipAmount = total * (tip / 100);
  const grandTotal = total + tipAmount;
  const perPerson = grandTotal / numPeople;

  const shares = [parseFloat(person1)||0, parseFloat(person2)||0, parseFloat(person3)||0, parseFloat(person4)||0];
  const totalShares = shares.slice(0, numPeople).reduce((a, b) => a + b, 0);
  const unequalSplits = shares.slice(0, numPeople).map(s => totalShares > 0 ? grandTotal * (s / totalShares) : 0);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Expense Splitter" icon={ShoppingCart} iconColor="bg-purple-500">
        <ModeBar modes={[{ id: "equal", label: "Equal Split" }, { id: "custom", label: "Custom %" }, { id: "tip", label: "Bill + Tip" }]} active={mode} onChange={setMode} color="bg-purple-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <InputField label={`Total Amount (${cs(currency)})`} value={totalAmount} onChange={setTotalAmount} type="number" />
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Number of People</label>
          <div className="flex gap-1.5">
            {["2","3","4","5","6","8","10"].map(n => (
              <button key={n} onClick={() => setPeople(n)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${people === n ? "bg-purple-500 text-white" : "bg-muted text-muted-foreground"}`}>{n}</button>
            ))}
          </div>
        </div>
        {(mode === "tip" || mode === "equal") && <InputField label="Tip/Service Charge (%)" value={tipPercent} onChange={setTipPercent} type="number" />}
        {mode === "custom" && (
          <div className="grid grid-cols-2 gap-2">
            {[{ val: person1, set: setPerson1, label: "Person 1 (%)" }, { val: person2, set: setPerson2, label: "Person 2 (%)" }, { val: person3, set: setPerson3, label: "Person 3 (%)" }, { val: person4, set: setPerson4, label: "Person 4 (%)" }].slice(0, numPeople).map((p, i) => (
              <InputField key={i} label={p.label} value={p.val} onChange={p.set} type="number" />
            ))}
          </div>
        )}
        <div className="space-y-2 mt-3">
          <Row label="Bill Total" value={`${cs(currency)}${fmt(total)}`} />
          {(mode === "tip" || mode === "equal") && <Row label="Tip Amount" value={`${cs(currency)}${fmt(tipAmount)}`} />}
          <Row label="Grand Total" value={`${cs(currency)}${fmt(grandTotal)}`} />
          {mode === "custom" ? (
            unequalSplits.map((amt, i) => (
              <Row key={i} label={`Person ${i + 1} (${shares[i]}%)`} value={`${cs(currency)}${fmt(amt)}`} hi={i === 0} />
            ))
          ) : (
            <Row label="Per Person" value={`${cs(currency)}${fmt(perPerson)}`} hi accent="text-purple-400" />
          )}
        </div>
      </ToolCard>
    </div>
  );
}

function DataUsageEstimator() {
  const [currency, setCurrency] = useState("INR");
  const [videoHours, setVideoHours] = useState("2");
  const [musicHours, setMusicHours] = useState("2");
  const [browsingHours, setBrowsingHours] = useState("2");
  const [socialHours, setSocialHours] = useState("1");
  const [gamingHours, setGamingHours] = useState("1");
  const [videoQuality, setVideoQuality] = useState("hd");
  const [planCost, setPlanCost] = useState("499");
  const [planData, setPlanData] = useState("2");

  const qualities: Record<string, number> = { "480p": 0.5, "720p (HD)": 1.5, "1080p": 3, "4K": 7.5 };
  const socialGB = 0.3; const browsingGB = 0.06; const musicGB = 0.15; const gamingGB = 0.08;

  const qKey = videoQuality;
  const dailyVideo = parseFloat(videoHours)||0;
  const dailyMusic = parseFloat(musicHours)||0;
  const dailyBrowsing = parseFloat(browsingHours)||0;
  const dailySocial = parseFloat(socialHours)||0;
  const dailyGaming = parseFloat(gamingHours)||0;

  const videoGB = dailyVideo * (qualities[qKey] || 3);
  const musicGBTotal = dailyMusic * musicGB;
  const browsingGBTotal = dailyBrowsing * browsingGB;
  const socialGBTotal = dailySocial * socialGB;
  const gamingGBTotal = dailyGaming * gamingGB;
  const dailyTotal = videoGB + musicGBTotal + browsingGBTotal + socialGBTotal + gamingGBTotal;
  const monthlyTotal = dailyTotal * 30;
  const planDataGB = parseFloat(planData)||2;
  const costPerGB = planDataGB > 0 ? parseFloat(planCost) / planDataGB : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Data Usage Estimator" icon={Wifi} iconColor="bg-indigo-500">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Video Quality</label>
          <div className="flex gap-1.5 flex-wrap">
            {Object.keys(qualities).map(q => (
              <button key={q} onClick={() => setVideoQuality(q)} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${videoQuality === q ? "bg-indigo-500 text-white" : "bg-muted text-muted-foreground"}`}>{q}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <InputField label="Video (hrs/day)" value={videoHours} onChange={setVideoHours} type="number" />
          <InputField label="Music (hrs/day)" value={musicHours} onChange={setMusicHours} type="number" />
          <InputField label="Browsing (hrs/day)" value={browsingHours} onChange={setBrowsingHours} type="number" />
          <InputField label="Social Media (hrs/day)" value={socialHours} onChange={setSocialHours} type="number" />
          <InputField label="Gaming (hrs/day)" value={gamingHours} onChange={setGamingHours} type="number" />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <InputField label={`Plan Cost (${cs(currency)})`} value={planCost} onChange={setPlanCost} type="number" />
          <InputField label="Plan Data (GB/day)" value={planData} onChange={setPlanData} type="number" step={0.5} />
        </div>
        <div className="space-y-2 mt-3">
          {[{ l: "📺 Video", v: videoGB }, { l: "🎵 Music", v: musicGBTotal }, { l: "🌐 Browsing", v: browsingGBTotal }, { l: "📱 Social", v: socialGBTotal }, { l: "🎮 Gaming", v: gamingGBTotal }].map((r, i) => (
            <div key={i} className="flex justify-between items-center px-2 py-1.5 bg-muted/20 rounded-lg">
              <span className="text-[10px] text-muted-foreground">{r.l}</span>
              <span className="text-[10px] font-bold text-foreground">{fmt(r.v, 2)} GB/day</span>
            </div>
          ))}
          <Row label="Daily Total" value={`${fmt(dailyTotal, 2)} GB`} hi />
          <Row label="Monthly Total" value={`${fmt(monthlyTotal, 1)} GB`} hi accent="text-indigo-400" />
          <Row label={`Plan: ${planData}GB/day — ${fmt(planDataGB * 30, 0)}GB/month`} value={monthlyTotal > planDataGB * 30 ? `⚠️ Over by ${fmt(monthlyTotal - planDataGB * 30, 1)}GB` : "✅ Within plan"} />
          <Row label={`Cost per GB`} value={`${cs(currency)}${fmt(costPerGB, 1)}`} />
        </div>
      </ToolCard>
    </div>
  );
}

function BatteryHealthEstimator() {
  const [mode, setMode] = useState("health");
  const [devicePreset, setDevicePreset] = useState("custom");
  const [originalCapacity, setOriginalCapacity] = useState("4000");
  const [currentCapacity, setCurrentCapacity] = useState("3600");
  const [cycleCount, setCycleCount] = useState("350");
  const [dailyCharges, setDailyCharges] = useState("1");

  const devicePresets: Record<string, { capacity: string; label: string; cycles: string }> = {
    "iPhone 15": { capacity: "3349", label: "iPhone 15", cycles: "500" },
    "iPhone 14": { capacity: "3279", label: "iPhone 14", cycles: "500" },
    "Samsung S24": { capacity: "4000", label: "Samsung S24", cycles: "500" },
    "OnePlus 12": { capacity: "5400", label: "OnePlus 12", cycles: "800" },
    "Pixel 8": { capacity: "4575", label: "Pixel 8", cycles: "500" },
    MacBook: { capacity: "99900", label: "MacBook Pro", cycles: "1000" },
    custom: { capacity: originalCapacity, label: "Custom", cycles: cycleCount },
  };

  const handlePreset = (p: string) => {
    setDevicePreset(p);
    if (p !== "custom") { setOriginalCapacity(devicePresets[p].capacity); setCycleCount(devicePresets[p].cycles); }
  };

  const original = parseFloat(originalCapacity)||4000;
  const current = parseFloat(currentCapacity)||3600;
  const cycles = parseInt(cycleCount)||0;
  const daily = parseFloat(dailyCharges)||1;

  const healthPct = (current / original) * 100;
  const maxCycles = 500;
  const cyclesRemaining = Math.max(0, maxCycles - cycles);
  const daysRemaining = daily > 0 ? cyclesRemaining / daily : 0;
  const status = healthPct >= 80 ? "Good" : healthPct >= 60 ? "Fair" : "Poor — Replace Soon";
  const estMonthsRemaining = daily > 0 ? cyclesRemaining / (daily * 30) : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Battery Health Estimator" icon={Smartphone} iconColor="bg-green-500">
        <ModeBar modes={[{ id: "health", label: "Health Check" }, { id: "lifetime", label: "Lifetime" }]} active={mode} onChange={setMode} color="bg-green-600" />
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Device Preset</label>
          <div className="flex gap-1.5 flex-wrap">
            {Object.entries(devicePresets).map(([k, v]) => (
              <button key={k} onClick={() => handlePreset(k)} className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${devicePreset === k ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>{v.label}</button>
            ))}
          </div>
        </div>
        <InputField label="Original Capacity (mAh)" value={originalCapacity} onChange={setOriginalCapacity} type="number" />
        <InputField label="Current Capacity (mAh)" value={currentCapacity} onChange={setCurrentCapacity} type="number" />
        <InputField label="Charge Cycles Completed" value={cycleCount} onChange={setCycleCount} type="number" />
        {mode === "lifetime" && <InputField label="Daily Charges" value={dailyCharges} onChange={setDailyCharges} type="number" step={0.5} />}
        <div className="mt-3 p-4 text-center rounded-2xl" style={{ background: healthPct >= 80 ? "rgba(74,222,128,0.1)" : healthPct >= 60 ? "rgba(251,191,36,0.1)" : "rgba(248,113,113,0.1)" }}>
          <div className={`text-4xl font-black mb-1 ${healthPct >= 80 ? "text-green-400" : healthPct >= 60 ? "text-yellow-400" : "text-red-400"}`}>{fmt(healthPct, 1)}%</div>
          <div className={`text-sm font-semibold ${healthPct >= 80 ? "text-green-400" : healthPct >= 60 ? "text-yellow-400" : "text-red-400"}`}>{status}</div>
        </div>
        <div className="space-y-2 mt-2">
          <Row label="Capacity Lost" value={`${fmt(original - current, 0)} mAh (${fmt(100 - healthPct, 1)}%)`} />
          <Row label="Cycles Completed" value={`${cycles} / ~${maxCycles}`} />
          {mode === "lifetime" && <>
            <Row label="Est. Cycles Remaining" value={`~${cyclesRemaining}`} hi accent="text-green-400" />
            <Row label="Est. Days Remaining" value={`~${fmt(daysRemaining, 0)} days`} />
            <Row label="Est. Months Remaining" value={`~${fmt(estMonthsRemaining, 1)} months`} />
          </>}
        </div>
      </ToolCard>
    </div>
  );
}
