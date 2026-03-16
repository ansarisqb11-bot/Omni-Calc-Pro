import { useState } from "react";
import { Battery, Sun, Droplets, Cloud, ShoppingCart, Wifi, Smartphone, Flame, Wind } from "lucide-react";
import { DesktopToolGrid, InputPanel, ResultPanel, SummaryCard, BreakdownRow, InputField, ModeSelector } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "gas" | "ac" | "inverter" | "solar" | "tank" | "rainwater" | "expense" | "data" | "battery";

const CURRENCIES = [
  { code: "INR", symbol: "₹" }, { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" }, { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" }, { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" }, { code: "AED", symbol: "د.إ" },
  { code: "SGD", symbol: "S$" }, { code: "CHF", symbol: "CHF" },
];
const cs = (code: string) => CURRENCIES.find(c => c.code === code)?.symbol || "₹";
const fmt = (n: number, d = 2) => isFinite(n) && !isNaN(n) ? parseFloat(n.toFixed(d)).toLocaleString() : "—";

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
    <PageWrapper title="Home & Lifestyle" subtitle="Utility and home calculators" accentColor="bg-lime-500" tools={tools} activeTool={activeTool} onToolChange={id => setActiveTool(id as ToolType)}>
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
  const size = parseFloat(cylinderSize) || 14.2;
  const daily = parseFloat(dailyUsage) || 0.5;
  const price = parseFloat(gasPrice) || 950;
  const daysRemaining = daily > 0 ? size / daily : 0;
  const monthlyUsage = daily * 30;
  const cylindersPerMonth = monthlyUsage / size;
  const monthlyCost = cylindersPerMonth * price;

  const cngPrice = parseFloat(cngPricePerKg) || 85;
  const cngMileageNum = parseFloat(cngMileage) || 25;
  const cngPerKm = cngMileageNum > 0 ? 1 / cngMileageNum : 0;
  const cngCostPer100 = cngPerKm * 100 * cngPrice;
  const cngMonthly = cngPerKm * parseFloat(dailyUsage || "0") * cngPrice;

  const pngRateNum = parseFloat(pngRate) || 55;
  const pngUsageNum = parseFloat(pngUsage) || 30;
  const pngMonthly = pngRateNum * pngUsageNum;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Gas Parameters" icon={Flame} iconColor="bg-orange-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id: "lpg", label: "LPG Cylinder" }, { id: "cng", label: "CNG Vehicle" }, { id: "png", label: "PNG (Piped)" }]} active={mode} onChange={setMode} />
          {mode === "lpg" && (
            <>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Cylinder Size (kg)</label>
                <div className="flex gap-1.5 flex-wrap">
                  {cylinderSizes.map(s => (
                    <button key={s} onClick={() => setCylinderSize(s)} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${cylinderSize === s ? "bg-orange-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{s}kg</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Daily Usage" value={dailyUsage} onChange={setDailyUsage} type="number" />
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Unit</label>
                  <div className="flex gap-1.5">
                    {["kg", "lbs"].map(u => <button key={u} onClick={() => setGasUnit(u)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${gasUnit === u ? "bg-orange-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{u}/day</button>)}
                  </div>
                </div>
              </div>
              <InputField label={`Price per Cylinder (${cs(currency)})`} value={gasPrice} onChange={setGasPrice} type="number" prefix={cs(currency)} />
            </>
          )}
          {mode === "cng" && (
            <>
              <InputField label={`CNG Price (${cs(currency)}/kg)`} value={cngPricePerKg} onChange={setCngPricePerKg} type="number" prefix={cs(currency)} />
              <InputField label="Mileage (km/kg)" value={cngMileage} onChange={setCngMileage} type="number" />
              <InputField label="Monthly Distance (km)" value={dailyUsage} onChange={setDailyUsage} type="number" />
            </>
          )}
          {mode === "png" && (
            <>
              <InputField label={`PNG Rate (${cs(currency)}/SCM)`} value={pngRate} onChange={setPngRate} type="number" prefix={cs(currency)} />
              <InputField label="Monthly Usage (SCM)" value={pngUsage} onChange={setPngUsage} type="number" />
            </>
          )}
        </InputPanel>
      }
      results={
        mode === "lpg" ? (
          <ResultPanel label="Days per Cylinder" primary={`${fmt(daysRemaining, 0)} days`}
            summaries={<>
              <SummaryCard label="Monthly Cost" value={`${cs(currency)}${fmt(monthlyCost, 0)}`} accent="text-orange-500" />
              <SummaryCard label="Cylinders/Month" value={`${fmt(cylindersPerMonth, 2)}`} />
            </>}
            tip="A 14.2 kg LPG cylinder lasts ~30–45 days for a family of 4 using it only for cooking."
          >
            <BreakdownRow label="Cylinder Size" value={`${cylinderSize} kg`} dot="bg-orange-400" />
            <BreakdownRow label="Daily Usage" value={`${dailyUsage} ${gasUnit}`} dot="bg-blue-400" />
            <BreakdownRow label="Days per Cylinder" value={`${fmt(daysRemaining, 0)} days`} dot="bg-green-500" bold />
            <BreakdownRow label="Monthly Usage" value={`${fmt(monthlyUsage, 2)} kg`} dot="bg-purple-400" />
            <BreakdownRow label="Cylinders/Month" value={`${fmt(cylindersPerMonth, 2)}`} />
            <BreakdownRow label="Monthly Cost" value={`${cs(currency)}${fmt(monthlyCost, 0)}`} bold />
            <BreakdownRow label="Annual Cost" value={`${cs(currency)}${fmt(monthlyCost * 12, 0)}`} />
          </ResultPanel>
        ) : mode === "cng" ? (
          <ResultPanel label="CNG Cost/100km" primary={`${cs(currency)}${fmt(cngCostPer100, 0)}`}
            summaries={<>
              <SummaryCard label="Monthly Cost" value={`${cs(currency)}${fmt(cngMonthly, 0)}`} accent="text-orange-500" />
              <SummaryCard label="CNG per 100km" value={`${fmt(cngPerKm * 100, 2)} kg`} />
            </>}
          >
            <BreakdownRow label="Price/kg" value={`${cs(currency)}${cngPrice}`} dot="bg-orange-400" />
            <BreakdownRow label="Mileage" value={`${cngMileage} km/kg`} dot="bg-blue-400" />
            <BreakdownRow label="CNG per 100 km" value={`${fmt(cngPerKm * 100, 2)} kg`} dot="bg-purple-400" />
            <BreakdownRow label="Cost per 100 km" value={`${cs(currency)}${fmt(cngCostPer100, 0)}`} dot="bg-green-500" bold />
            <BreakdownRow label="Monthly Cost" value={`${cs(currency)}${fmt(cngMonthly, 0)}`} bold />
            <BreakdownRow label="Annual Cost" value={`${cs(currency)}${fmt(cngMonthly * 12, 0)}`} />
          </ResultPanel>
        ) : (
          <ResultPanel label="Monthly PNG Bill" primary={`${cs(currency)}${fmt(pngMonthly, 0)}`}
            summaries={<>
              <SummaryCard label="Annual Cost" value={`${cs(currency)}${fmt(pngMonthly * 12, 0)}`} accent="text-orange-500" />
              <SummaryCard label="Rate/SCM" value={`${cs(currency)}${pngRate}`} />
            </>}
          >
            <BreakdownRow label="PNG Rate" value={`${cs(currency)}${pngRate}/SCM`} dot="bg-orange-400" />
            <BreakdownRow label="Monthly Usage" value={`${pngUsage} SCM`} dot="bg-blue-400" />
            <BreakdownRow label="Monthly Bill" value={`${cs(currency)}${fmt(pngMonthly, 0)}`} dot="bg-green-500" bold />
            <BreakdownRow label="Annual Bill" value={`${cs(currency)}${fmt(pngMonthly * 12, 0)}`} bold />
          </ResultPanel>
        )
      }
    />
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

  const t = parseFloat(tons) || 1.5;
  const star = parseInt(starRating) || 3;
  const eff = acType === "inverter" ? 0.85 + star * 0.03 : 0.7 + star * 0.02;
  const kw = (t * 3.517) / eff;
  const tonToBTU = t * 12000;
  const tonToKW = t * 3.517;
  const dailyKwh = kw * (parseFloat(hoursPerDay) || 8);
  const monthlyKwh = dailyKwh * (parseFloat(daysPerMonth) || 30) * (parseInt(numACs) || 1);
  const monthlyCost = monthlyKwh * (parseFloat(ratePerUnit) || 8);

  const roomGuide = [
    { area: "Up to 10 sqm (110 sqft)", size: "0.8 Ton" },
    { area: "10–15 sqm (150 sqft)", size: "1.0 Ton" },
    { area: "15–20 sqm (215 sqft)", size: "1.5 Ton" },
    { area: "20–30 sqm (320 sqft)", size: "2.0 Ton" },
    { area: "30–45 sqm (485 sqft)", size: "2.5 Ton" },
    { area: "45+ sqm", size: "3+ Ton" },
  ];

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="AC Parameters" icon={Wind} iconColor="bg-blue-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id: "unit", label: "Monthly Bill" }, { id: "size", label: "Room Guide" }]} active={mode} onChange={setMode} />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Capacity (Tons)" value={tons} onChange={setTons} type="number" />
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">AC Type</label>
              <select value={acType} onChange={e => setAcType(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
                {["inverter", "non-inverter", "window"].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Star Rating (BEE)</label>
            <div className="flex gap-1.5">
              {["1", "2", "3", "4", "5"].map(s => (
                <button key={s} onClick={() => setStarRating(s)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${starRating === s ? "bg-blue-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{s}★</button>
              ))}
            </div>
          </div>
          {mode === "unit" && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <InputField label="Hours/Day" value={hoursPerDay} onChange={setHoursPerDay} type="number" />
                <InputField label="Days/Month" value={daysPerMonth} onChange={setDaysPerMonth} type="number" />
                <InputField label="No. of ACs" value={numACs} onChange={setNumACs} type="number" />
              </div>
              <InputField label={`Rate per Unit (${cs(currency)}/kWh)`} value={ratePerUnit} onChange={setRatePerUnit} type="number" prefix={cs(currency)} />
            </>
          )}
        </InputPanel>
      }
      results={
        mode === "unit" ? (
          <ResultPanel label="Monthly Bill" primary={`${cs(currency)}${fmt(monthlyCost, 0)}`}
            summaries={<>
              <SummaryCard label="Monthly Units" value={`${fmt(monthlyKwh, 0)} kWh`} accent="text-blue-500" />
              <SummaryCard label="Annual Bill" value={`${cs(currency)}${fmt(monthlyCost * 12, 0)}`} />
            </>}
            tip={`Inverter ACs save 30–40% over non-inverter. A ${star}★ ${t}T AC draws ~${fmt(kw, 2)} kW.`}
          >
            <BreakdownRow label="Power Draw" value={`${fmt(kw * 1000, 0)} W = ${fmt(kw, 3)} kW`} dot="bg-blue-400" />
            <BreakdownRow label="Daily Usage" value={`${fmt(dailyKwh, 2)} kWh`} dot="bg-purple-400" />
            <BreakdownRow label="Monthly Units" value={`${fmt(monthlyKwh, 0)} kWh`} dot="bg-amber-400" bold />
            <BreakdownRow label="Monthly Bill" value={`${cs(currency)}${fmt(monthlyCost, 0)}`} dot="bg-green-500" bold />
            <BreakdownRow label="Annual Bill" value={`${cs(currency)}${fmt(monthlyCost * 12, 0)}`} />
          </ResultPanel>
        ) : (
          <ResultPanel label="Your AC" primary={`${t}T = ${fmt(tonToBTU, 0)} BTU`} primarySub={`${fmt(tonToKW, 2)} kW`}
            summaries={<>
              <SummaryCard label="Watts" value={`${fmt(tonToKW * 1000, 0)} W`} accent="text-blue-500" />
              <SummaryCard label="BTU" value={`${fmt(tonToBTU, 0)}`} />
            </>}
          >
            {roomGuide.map((r, i) => (
              <BreakdownRow key={i} label={r.area} value={r.size} dot="bg-blue-400" />
            ))}
          </ResultPanel>
        )
      }
    />
  );
}

function InverterCalculator() {
  const [mode, setMode] = useState("backup");
  const [numBatteries, setNumBatteries] = useState("1");
  const [batteryAh, setBatteryAh] = useState("150");
  const [batteryVolt, setBatteryVolt] = useState("12");
  const [loadWatts, setLoadWatts] = useState("300");
  const [depth, setDepth] = useState("80");
  const [chargeHours, setChargeHours] = useState("8");
  const [inverterEff, setInverterEff] = useState("85");

  const nb = parseInt(numBatteries) || 1;
  const ah = parseFloat(batteryAh) || 150;
  const v = parseFloat(batteryVolt) || 12;
  const load = parseFloat(loadWatts) || 300;
  const dod = parseFloat(depth) || 80;
  const eff = parseFloat(inverterEff) || 85;

  const totalWh = nb * ah * v;
  const usableWh = totalWh * (dod / 100) * (eff / 100);
  const backupHours = load > 0 ? usableWh / load : 0;
  const chargingCurrent = totalWh / (parseFloat(chargeHours) || 8) / v;
  const inverterVA = load / (eff / 100);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Inverter / Battery" icon={Battery} iconColor="bg-yellow-500">
          <ModeSelector modes={[{ id: "backup", label: "Backup Time" }, { id: "size", label: "Inverter Sizing" }]} active={mode} onChange={setMode} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Batteries in Parallel</label>
            <div className="flex gap-1.5">
              {["1", "2", "3", "4"].map(n => (
                <button key={n} onClick={() => setNumBatteries(n)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${numBatteries === n ? "bg-yellow-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{n}×</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Battery (Ah)" value={batteryAh} onChange={setBatteryAh} type="number" />
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Voltage</label>
              <select value={batteryVolt} onChange={e => setBatteryVolt(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
                {["6", "12", "24", "48"].map(vv => <option key={vv} value={vv}>{vv}V</option>)}
              </select>
            </div>
          </div>
          <InputField label="Load (Watts)" value={loadWatts} onChange={setLoadWatts} type="number" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Depth of Discharge (%)" value={depth} onChange={setDepth} type="number" />
            <InputField label="Inverter Efficiency (%)" value={inverterEff} onChange={setInverterEff} type="number" />
          </div>
          {mode === "size" && <InputField label="Charging Time (hrs)" value={chargeHours} onChange={setChargeHours} type="number" />}
        </InputPanel>
      }
      results={
        <ResultPanel label="Backup Time" primary={`${fmt(backupHours, 1)} hrs`} primarySub={`${fmt(backupHours * 60, 0)} min`}
          summaries={<>
            <SummaryCard label="Usable Wh" value={`${fmt(usableWh, 0)} Wh`} accent="text-yellow-500" />
            <SummaryCard label="Total Wh" value={`${fmt(totalWh, 0)} Wh`} />
          </>}
          tip="Tip: Inverter efficiency of 85–90% is typical. Lead-acid batteries use 80% DoD max to preserve life."
        >
          <BreakdownRow label={`Battery (${nb}×${ah}Ah×${v}V)`} value={`${fmt(totalWh, 0)} Wh total`} dot="bg-yellow-400" />
          <BreakdownRow label="Usable Capacity" value={`${fmt(usableWh, 0)} Wh`} dot="bg-green-500" />
          <BreakdownRow label="Load" value={`${load} W`} dot="bg-blue-400" />
          <BreakdownRow label="Backup Time" value={`${fmt(backupHours, 1)} hrs`} dot="bg-amber-400" bold />
          {mode === "size" && (
            <>
              <BreakdownRow label="Required Inverter" value={`${fmt(inverterVA, 0)} VA`} dot="bg-purple-400" bold />
              <BreakdownRow label="Charging Current" value={`${fmt(chargingCurrent, 1)} A`} />
            </>
          )}
        </ResultPanel>
      }
    />
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

  const usage = parseFloat(dailyUsage) || 10;
  const hours = parseFloat(sunHours) || 5;
  const panel = parseFloat(panelWatts) || 400;
  const rate = parseFloat(ratePerUnit) || 8;
  const cost = parseFloat(systemCost) || 150000;

  const systemSizeKW = usage / hours;
  const panelsNeeded = Math.ceil((systemSizeKW * 1000) / panel);
  const yearlyGen = systemSizeKW * hours * 365;
  const annualSavings = yearlyGen * rate;
  const paybackYears = annualSavings > 0 ? cost / annualSavings : 0;
  const co2SavedKg = yearlyGen * 0.82;

  const sunPresets: Record<string, string> = {
    Mumbai: "5.5", Delhi: "5.3", Chennai: "5.8", Bangalore: "5.1",
    London: "2.8", NYC: "4.2", Dubai: "5.9", Sydney: "5.2",
  };

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Solar Parameters" icon={Sun} iconColor="bg-amber-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id: "size", label: "System Size" }, { id: "savings", label: "Savings & ROI" }]} active={mode} onChange={setMode} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">City Sun Hours Preset</label>
            <div className="flex gap-1.5 flex-wrap">
              {Object.entries(sunPresets).map(([city, h]) => (
                <button key={city} onClick={() => setSunHours(h)} className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${sunHours === h ? "bg-amber-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{city}</button>
              ))}
            </div>
          </div>
          <InputField label="Daily Usage (kWh)" value={dailyUsage} onChange={setDailyUsage} type="number" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Peak Sun Hours/day" value={sunHours} onChange={setSunHours} type="number" />
            <InputField label="Panel Wattage (W)" value={panelWatts} onChange={setPanelWatts} type="number" />
          </div>
          {mode === "savings" && (
            <>
              <InputField label={`Electricity Rate (${cs(currency)}/kWh)`} value={ratePerUnit} onChange={setRatePerUnit} type="number" prefix={cs(currency)} />
              <InputField label={`System Cost (${cs(currency)})`} value={systemCost} onChange={setSystemCost} type="number" prefix={cs(currency)} />
            </>
          )}
        </InputPanel>
      }
      results={
        <ResultPanel label="System Size Needed" primary={`${fmt(systemSizeKW, 2)} kWp`}
          summaries={<>
            <SummaryCard label="Panels Needed" value={`${panelsNeeded} × ${panel}W`} accent="text-amber-500" />
            <SummaryCard label="Annual Gen" value={`${fmt(yearlyGen, 0)} kWh`} />
          </>}
          tip={`Payback period is typically 4–7 years. CO₂ saved: ~${fmt(co2SavedKg, 0)} kg/year.`}
        >
          <BreakdownRow label="System Size" value={`${fmt(systemSizeKW, 2)} kWp`} dot="bg-amber-400" bold />
          <BreakdownRow label="Panels Needed" value={`${panelsNeeded} × ${panel}W`} dot="bg-yellow-400" />
          <BreakdownRow label="Annual Generation" value={`${fmt(yearlyGen, 0)} kWh`} dot="bg-green-500" />
          <BreakdownRow label="CO₂ Saved" value={`${fmt(co2SavedKg, 0)} kg/year`} dot="bg-teal-400" />
          {mode === "savings" && (
            <>
              <BreakdownRow label="Annual Savings" value={`${cs(currency)}${fmt(annualSavings, 0)}`} dot="bg-blue-400" bold />
              <BreakdownRow label="Payback Period" value={`${fmt(paybackYears, 1)} years`} dot="bg-purple-400" bold />
              <BreakdownRow label="25-yr Savings" value={`${cs(currency)}${fmt(annualSavings * 25 - cost, 0)}`} />
            </>
          )}
        </ResultPanel>
      }
    />
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

  const l = parseFloat(length) || 2;
  const w = parseFloat(width) || 1.5;
  const h = parseFloat(height) || 1;
  const d = parseFloat(diameter) || 1.5;

  const volM3 = shape === "rectangular" ? l * w * h : Math.PI * (d / 2) ** 2 * h;
  const volLiters = unitSys === "metric" ? volM3 * 1000 : volM3 * 28.3168;
  const volGallons = volLiters * 0.264172;
  const volKg = volLiters;
  const rate = parseFloat(waterRate) || 5;
  const costPerFill = (volLiters / 1000) * rate;
  const familyDays = volLiters / 135;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Tank Dimensions" icon={Droplets} iconColor="bg-cyan-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Shape</label>
              <div className="flex gap-1.5">
                {[{ k: "rectangular", l: "Rect" }, { k: "cylindrical", l: "Cyl" }].map(s => (
                  <button key={s.k} onClick={() => setShape(s.k)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${shape === s.k ? "bg-cyan-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{s.l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Unit System</label>
              <div className="flex gap-1.5">
                {[{ k: "metric", l: "m" }, { k: "imperial", l: "ft" }].map(u => (
                  <button key={u.k} onClick={() => setUnitSys(u.k)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${unitSys === u.k ? "bg-cyan-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{u.l}</button>
                ))}
              </div>
            </div>
          </div>
          {shape === "rectangular" ? (
            <div className="grid grid-cols-3 gap-2">
              <InputField label={`Length (${unitSys === "metric" ? "m" : "ft"})`} value={length} onChange={setLength} type="number" />
              <InputField label={`Width (${unitSys === "metric" ? "m" : "ft"})`} value={width} onChange={setWidth} type="number" />
              <InputField label={`Height (${unitSys === "metric" ? "m" : "ft"})`} value={height} onChange={setHeight} type="number" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <InputField label={`Diameter (${unitSys === "metric" ? "m" : "ft"})`} value={diameter} onChange={setDiameter} type="number" />
              <InputField label={`Height (${unitSys === "metric" ? "m" : "ft"})`} value={height} onChange={setHeight} type="number" />
            </div>
          )}
          <InputField label={`Water Rate (${cs(currency)}/1000L)`} value={waterRate} onChange={setWaterRate} type="number" prefix={cs(currency)} />
        </InputPanel>
      }
      results={
        <ResultPanel label="Tank Volume" primary={`${fmt(volLiters, 0)} L`}
          summaries={<>
            <SummaryCard label="Gallons" value={`${fmt(volGallons, 0)}`} accent="text-cyan-500" />
            <SummaryCard label="Fill Cost" value={`${cs(currency)}${fmt(costPerFill, 0)}`} />
          </>}
          tip={`Average family of 4 uses ~135L/day — this tank lasts ~${fmt(familyDays, 1)} days.`}
        >
          <BreakdownRow label="Volume (m³)" value={`${fmt(volM3, 3)} m³`} dot="bg-cyan-400" />
          <BreakdownRow label="Volume (Litres)" value={`${fmt(volLiters, 0)} L`} dot="bg-blue-400" bold />
          <BreakdownRow label="Volume (Gallons)" value={`${fmt(volGallons, 0)} gal`} dot="bg-purple-400" />
          <BreakdownRow label="Weight (full)" value={`${fmt(volKg, 0)} kg`} dot="bg-amber-400" />
          <BreakdownRow label="Cost per Fill" value={`${cs(currency)}${fmt(costPerFill, 0)}`} />
          <BreakdownRow label="Family Days (4 pax)" value={`${fmt(familyDays, 1)} days`} bold />
        </ResultPanel>
      }
    />
  );
}

function RainwaterHarvest() {
  const [currency, setCurrency] = useState("INR");
  const [roofArea, setRoofArea] = useState("100");
  const [areaUnit, setAreaUnit] = useState("sqm");
  const [annualRainfall, setAnnualRainfall] = useState("800");
  const [efficiency, setEfficiency] = useState("80");
  const [waterRate, setWaterRate] = useState("5");

  const areaSqm = areaUnit === "sqm" ? parseFloat(roofArea) || 100 : (parseFloat(roofArea) || 100) * 0.0929;
  const rainfall = parseFloat(annualRainfall) || 800;
  const eff = (parseFloat(efficiency) || 80) / 100;
  const rate = parseFloat(waterRate) || 5;

  const annualLiters = areaSqm * (rainfall / 1000) * eff * 1000;
  const monthlyLiters = annualLiters / 12;
  const annualSavings = (annualLiters / 1000) * rate;
  const familyDays = annualLiters / (135 * 4);

  const cityRainfall: Record<string, string> = {
    Mumbai: "2400", Delhi: "800", Chennai: "1400", Bangalore: "970",
    London: "600", NYC: "1170", Dubai: "75", Sydney: "1200",
  };

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Rainwater Harvesting" icon={Cloud} iconColor="bg-teal-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">City Rainfall Preset (mm/year)</label>
            <div className="flex gap-1.5 flex-wrap">
              {Object.entries(cityRainfall).map(([city, mm]) => (
                <button key={city} onClick={() => setAnnualRainfall(mm)} className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${annualRainfall === mm ? "bg-teal-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{city}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Roof Area" value={roofArea} onChange={setRoofArea} type="number" />
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Unit</label>
              <div className="flex gap-1.5">
                {["sqm", "sqft"].map(u => <button key={u} onClick={() => setAreaUnit(u)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${areaUnit === u ? "bg-teal-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{u}</button>)}
              </div>
            </div>
          </div>
          <InputField label="Annual Rainfall (mm)" value={annualRainfall} onChange={setAnnualRainfall} type="number" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Efficiency (%)" value={efficiency} onChange={setEfficiency} type="number" />
            <InputField label={`Water Rate (${cs(currency)}/1000L)`} value={waterRate} onChange={setWaterRate} type="number" prefix={cs(currency)} />
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Annual Harvest" primary={`${fmt(annualLiters, 0)} L`}
          summaries={<>
            <SummaryCard label="Monthly" value={`${fmt(monthlyLiters, 0)} L`} accent="text-teal-500" />
            <SummaryCard label="Annual Savings" value={`${cs(currency)}${fmt(annualSavings, 0)}`} />
          </>}
          tip="A 100m² roof in Mumbai (2400mm rainfall) can harvest ~192,000 L/year — enough for 1 family."
        >
          <BreakdownRow label="Roof Area" value={`${fmt(areaSqm, 1)} m²`} dot="bg-teal-400" />
          <BreakdownRow label="Annual Rainfall" value={`${rainfall} mm`} dot="bg-blue-400" />
          <BreakdownRow label="Efficiency" value={`${efficiency}%`} dot="bg-purple-400" />
          <BreakdownRow label="Annual Harvest" value={`${fmt(annualLiters, 0)} L`} dot="bg-green-500" bold />
          <BreakdownRow label="Monthly Harvest" value={`${fmt(monthlyLiters, 0)} L`} />
          <BreakdownRow label="Annual Savings" value={`${cs(currency)}${fmt(annualSavings, 0)}`} bold />
          <BreakdownRow label="Family Days (4 pax)" value={`${fmt(familyDays, 0)} days`} />
        </ResultPanel>
      }
    />
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

  const total = parseFloat(totalAmount) || 2000;
  const n = parseInt(people) || 4;
  const tip = parseFloat(tipPercent) || 0;
  const tipAmt = total * (tip / 100);
  const grandTotal = total + tipAmt;

  const shares = [parseFloat(person1), parseFloat(person2), parseFloat(person3), parseFloat(person4)].slice(0, n);
  const shareSum = shares.reduce((a, b) => a + b, 0);
  const perPerson = grandTotal / n;
  const perPersonByShare = shares.map(s => (s / shareSum) * grandTotal);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Expense Details" icon={ShoppingCart} iconColor="bg-lime-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id: "equal", label: "Split Equally" }, { id: "percent", label: "By % Share" }]} active={mode} onChange={setMode} />
          <InputField label={`Total Amount (${cs(currency)})`} value={totalAmount} onChange={setTotalAmount} type="number" prefix={cs(currency)} />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Number of People" value={people} onChange={setPeople} type="number" />
            <InputField label="Tip %" value={tipPercent} onChange={setTipPercent} type="number" />
          </div>
          {mode === "percent" && (
            <>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block">Individual Shares (%)</label>
              <div className="grid grid-cols-2 gap-2">
                {[{ v: person1, s: setPerson1, l: "Person 1" }, { v: person2, s: setPerson2, l: "Person 2" }, { v: person3, s: setPerson3, l: "Person 3" }, { v: person4, s: setPerson4, l: "Person 4" }].slice(0, n).map((p, i) => (
                  <InputField key={i} label={p.l} value={p.v} onChange={p.s} type="number" />
                ))}
              </div>
            </>
          )}
        </InputPanel>
      }
      results={
        <ResultPanel label={mode === "equal" ? "Per Person" : "Split Summary"}
          primary={mode === "equal" ? `${cs(currency)}${fmt(perPerson, 2)}` : `${cs(currency)}${fmt(grandTotal, 2)}`}
          summaries={<>
            <SummaryCard label="Tip Amount" value={`${cs(currency)}${fmt(tipAmt, 0)}`} />
            <SummaryCard label="Grand Total" value={`${cs(currency)}${fmt(grandTotal, 0)}`} accent="text-lime-500" />
          </>}
        >
          <BreakdownRow label="Bill Amount" value={`${cs(currency)}${fmt(total, 2)}`} dot="bg-lime-400" />
          <BreakdownRow label={`Tip (${tip}%)`} value={`${cs(currency)}${fmt(tipAmt, 2)}`} dot="bg-amber-400" />
          <BreakdownRow label="Grand Total" value={`${cs(currency)}${fmt(grandTotal, 2)}`} dot="bg-green-500" bold />
          {mode === "equal" ? (
            <>
              <BreakdownRow label={`Per Person (${n})`} value={`${cs(currency)}${fmt(perPerson, 2)}`} dot="bg-blue-400" bold />
            </>
          ) : (
            perPersonByShare.map((amt, i) => (
              <BreakdownRow key={i} label={`Person ${i + 1} (${shares[i]}%)`} value={`${cs(currency)}${fmt(amt, 2)}`} dot="bg-blue-400" />
            ))
          )}
        </ResultPanel>
      }
    />
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
  const [plan, setPlan] = useState("1.5");
  const [planCost, setPlanCost] = useState("299");

  const qualityRates: Record<string, number> = { sd: 0.7, hd: 3, fhd: 7, "4k": 25 };
  const vRate = qualityRates[videoQuality] || 3;

  const dailyGB =
    parseFloat(videoHours) * vRate / 1024 * 1024 / 1024 +
    parseFloat(musicHours) * 0.075 +
    parseFloat(browsingHours) * 0.05 +
    parseFloat(socialHours) * 0.3 +
    parseFloat(gamingHours) * 0.1;

  const monthlyGB = dailyGB * 30;
  const planGB = parseFloat(plan) * 30;
  const surplus = planGB - monthlyGB;
  const costPerGB = monthlyGB > 0 ? parseFloat(planCost) / monthlyGB : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Daily Usage Estimate" icon={Wifi} iconColor="bg-purple-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Video Quality</label>
            <div className="flex gap-1.5">
              {Object.keys(qualityRates).map(q => (
                <button key={q} onClick={() => setVideoQuality(q)} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase ${videoQuality === q ? "bg-purple-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{q}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <InputField label="Video (hrs/day)" value={videoHours} onChange={setVideoHours} type="number" />
            <InputField label="Music (hrs/day)" value={musicHours} onChange={setMusicHours} type="number" />
            <InputField label="Browsing (hrs/day)" value={browsingHours} onChange={setBrowsingHours} type="number" />
            <InputField label="Social Media (hrs)" value={socialHours} onChange={setSocialHours} type="number" />
            <InputField label="Gaming (hrs/day)" value={gamingHours} onChange={setGamingHours} type="number" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Plan (GB/day)" value={plan} onChange={setPlan} type="number" />
            <InputField label={`Plan Cost (${cs(currency)}/mo)`} value={planCost} onChange={setPlanCost} type="number" prefix={cs(currency)} />
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Daily Usage" primary={`${fmt(dailyGB, 2)} GB`} primarySub="/day"
          summaries={<>
            <SummaryCard label="Monthly" value={`${fmt(monthlyGB, 1)} GB`} accent="text-purple-500" />
            <SummaryCard label={surplus >= 0 ? "Surplus" : "Shortfall"} value={`${fmt(Math.abs(surplus), 1)} GB`} accent={surplus >= 0 ? "text-green-500" : "text-red-500"} />
          </>}
          tip={`At ${videoQuality.toUpperCase()} quality, video uses ~${vRate} GB/hr. Consider SD streaming to save data.`}
        >
          <BreakdownRow label={`Video (${videoQuality.toUpperCase()})`} value={`${fmt(parseFloat(videoHours) * vRate / 1024 * 1024 / 1024, 2)} GB/day`} dot="bg-red-400" />
          <BreakdownRow label="Music" value={`${fmt(parseFloat(musicHours) * 0.075, 2)} GB/day`} dot="bg-green-400" />
          <BreakdownRow label="Browsing" value={`${fmt(parseFloat(browsingHours) * 0.05, 2)} GB/day`} dot="bg-blue-400" />
          <BreakdownRow label="Social Media" value={`${fmt(parseFloat(socialHours) * 0.3, 2)} GB/day`} dot="bg-pink-400" />
          <BreakdownRow label="Gaming" value={`${fmt(parseFloat(gamingHours) * 0.1, 2)} GB/day`} dot="bg-amber-400" />
          <BreakdownRow label="Total Daily" value={`${fmt(dailyGB, 2)} GB`} dot="bg-purple-400" bold />
          <BreakdownRow label="Monthly" value={`${fmt(monthlyGB, 1)} GB / ${fmt(planGB, 0)} GB plan`} bold />
          <BreakdownRow label="Cost per GB" value={`${cs(currency)}${fmt(costPerGB, 2)}`} />
        </ResultPanel>
      }
    />
  );
}

function BatteryHealthEstimator() {
  const [mode, setMode] = useState("health");
  const [devicePreset, setDevicePreset] = useState("android");
  const [originalCapacity, setOriginalCapacity] = useState("4000");
  const [currentCapacity, setCurrentCapacity] = useState("3600");
  const [cycleCount, setCycleCount] = useState("120");
  const [dailyCharges, setDailyCharges] = useState("1");

  const devicePresets: Record<string, { label: string; capacity: string; cycles: string }> = {
    android: { label: "Android", capacity: "4000", cycles: "120" },
    iphone: { label: "iPhone", capacity: "3095", cycles: "150" },
    laptop: { label: "Laptop", capacity: "5000", cycles: "80" },
    ipad: { label: "iPad", capacity: "8827", cycles: "60" },
    custom: { label: "Custom", capacity: "4000", cycles: "100" },
  };

  const handlePreset = (p: string) => {
    setDevicePreset(p);
    if (p !== "custom") { setOriginalCapacity(devicePresets[p].capacity); setCycleCount(devicePresets[p].cycles); }
  };

  const original = parseFloat(originalCapacity) || 4000;
  const current = parseFloat(currentCapacity) || 3600;
  const cycles = parseInt(cycleCount) || 0;
  const daily = parseFloat(dailyCharges) || 1;

  const healthPct = (current / original) * 100;
  const maxCycles = 500;
  const cyclesRemaining = Math.max(0, maxCycles - cycles);
  const daysRemaining = daily > 0 ? cyclesRemaining / daily : 0;
  const status = healthPct >= 80 ? "Good" : healthPct >= 60 ? "Fair" : "Poor — Replace Soon";
  const statusColor = healthPct >= 80 ? "text-green-500" : healthPct >= 60 ? "text-yellow-500" : "text-red-500";
  const statusDot = healthPct >= 80 ? "bg-green-500" : healthPct >= 60 ? "bg-yellow-400" : "bg-red-500";
  const estMonthsRemaining = daily > 0 ? cyclesRemaining / (daily * 30) : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Battery Details" icon={Smartphone} iconColor="bg-green-500">
          <ModeSelector modes={[{ id: "health", label: "Health Check" }, { id: "lifetime", label: "Lifetime" }]} active={mode} onChange={setMode} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Device Preset</label>
            <div className="flex gap-1.5 flex-wrap">
              {Object.entries(devicePresets).map(([k, v]) => (
                <button key={k} onClick={() => handlePreset(k)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${devicePreset === k ? "bg-green-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{v.label}</button>
              ))}
            </div>
          </div>
          <InputField label="Original Capacity (mAh)" value={originalCapacity} onChange={setOriginalCapacity} type="number" />
          <InputField label="Current Capacity (mAh)" value={currentCapacity} onChange={setCurrentCapacity} type="number" />
          <InputField label="Charge Cycles Completed" value={cycleCount} onChange={setCycleCount} type="number" />
          {mode === "lifetime" && <InputField label="Daily Charges" value={dailyCharges} onChange={setDailyCharges} type="number" />}
        </InputPanel>
      }
      results={
        <ResultPanel label="Battery Health" primary={`${fmt(healthPct, 1)}%`}
          summaries={<>
            <SummaryCard label="Status" value={status} accent={statusColor} />
            <SummaryCard label="Capacity Lost" value={`${fmt(original - current, 0)} mAh`} />
          </>}
          tip="Most batteries need replacement when health drops below 80%. Avoid charging to 100% or draining to 0% to extend life."
        >
          <BreakdownRow label="Original Capacity" value={`${fmt(original, 0)} mAh`} dot="bg-blue-400" />
          <BreakdownRow label="Current Capacity" value={`${fmt(current, 0)} mAh`} dot="bg-green-400" />
          <BreakdownRow label="Health" value={`${fmt(healthPct, 1)}%`} dot={statusDot} bold />
          <BreakdownRow label="Capacity Lost" value={`${fmt(original - current, 0)} mAh (${fmt(100 - healthPct, 1)}%)`} dot="bg-red-400" />
          <BreakdownRow label="Cycles" value={`${cycles} / ~${maxCycles}`} dot="bg-purple-400" />
          {mode === "lifetime" && (
            <>
              <BreakdownRow label="Cycles Remaining" value={`~${cyclesRemaining}`} dot="bg-amber-400" bold />
              <BreakdownRow label="Days Remaining" value={`~${fmt(daysRemaining, 0)} days`} />
              <BreakdownRow label="Months Remaining" value={`~${fmt(estMonthsRemaining, 1)} months`} />
            </>
          )}
        </ResultPanel>
      }
    />
  );
}
