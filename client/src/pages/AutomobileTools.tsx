import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Car, Fuel, Gauge, Settings, Zap, Clock, DollarSign, TrendingDown, Shield, RotateCcw } from "lucide-react";
import { ToolCard, InputField } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "mileage" | "tyre" | "rpm" | "gear" | "evrange" | "charging" | "toll" | "depreciation" | "insurance";

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
function ModeBar({ modes, active, onChange, color = "bg-slate-600" }: { modes: { id: string; label: string }[]; active: string; onChange: (id: string) => void; color?: string }) {
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
    <div className={`flex justify-between items-center p-2.5 rounded-xl ${hi ? "bg-slate-500/15 border border-slate-500/20" : "bg-muted/30"}`}>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold ${hi ? (accent || "text-slate-300") : "text-foreground"}`}>{value}</span>
    </div>
  );
}
function fmt(n: number, d = 2) { if (!isFinite(n) || isNaN(n)) return "—"; return parseFloat(n.toFixed(d)).toLocaleString(); }

export default function AutomobileTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("mileage");
  const tools = [
    { id: "mileage", label: "Mileage", icon: Fuel },
    { id: "tyre", label: "Tyre Size", icon: Settings },
    { id: "rpm", label: "RPM/Speed", icon: Gauge },
    { id: "gear", label: "Gear Ratio", icon: Settings },
    { id: "evrange", label: "EV Range", icon: Zap },
    { id: "charging", label: "Charging", icon: Clock },
    { id: "toll", label: "Toll Cost", icon: DollarSign },
    { id: "depreciation", label: "Depreciation", icon: TrendingDown },
    { id: "insurance", label: "Insurance", icon: Shield },
  ];
  return (
    <PageWrapper title="Automobile Tools" subtitle="Vehicle calculators" accentColor="bg-slate-500" tools={tools} activeTool={activeTool} onToolChange={(id) => setActiveTool(id as ToolType)}>
      {activeTool === "mileage" && <MileageCostCalculator />}
      {activeTool === "tyre" && <TyreSizeConverter />}
      {activeTool === "rpm" && <RPMSpeedCalculator />}
      {activeTool === "gear" && <GearRatioCalculator />}
      {activeTool === "evrange" && <EVRangeEstimator />}
      {activeTool === "charging" && <ChargingTimeCalculator />}
      {activeTool === "toll" && <TollCostEstimator />}
      {activeTool === "depreciation" && <DepreciationCalculator />}
      {activeTool === "insurance" && <InsuranceEstimator />}
    </PageWrapper>
  );
}

function MileageCostCalculator() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("trip");
  const [fuelType, setFuelType] = useState("petrol");
  const [distance, setDistance] = useState("500");
  const [distUnit, setDistUnit] = useState("km");
  const [mileage, setMileage] = useState("15");
  const [mileageUnit, setMileageUnit] = useState("kmpl");
  const [fuelPrice, setFuelPrice] = useState("105");
  const [budget, setBudget] = useState("1000");

  const fuelDefaults: Record<string, { price: string; mileage: string }> = {
    petrol: { price: "105", mileage: "15" }, diesel: { price: "92", mileage: "18" },
    cng: { price: "85", mileage: "25" }, ev: { price: "8", mileage: "6" },
  };

  const distKm = distUnit === "km" ? parseFloat(distance)||0 : (parseFloat(distance)||0) * 1.60934;
  const mileageKmpl = mileageUnit === "kmpl" ? parseFloat(mileage)||1
    : mileageUnit === "mpg" ? (parseFloat(mileage)||0) * 0.425144
    : mileageUnit === "l100km" ? 100 / (parseFloat(mileage)||1) : parseFloat(mileage)||1;

  const fuelNeeded = mileageKmpl > 0 ? distKm / mileageKmpl : 0;
  const totalCost = fuelNeeded * (parseFloat(fuelPrice)||0);
  const costPerKm = distKm > 0 ? totalCost / distKm : 0;
  const costPerMile = costPerKm * 1.60934;
  const budgetDist = parseFloat(budget) > 0 && parseFloat(fuelPrice) > 0 && mileageKmpl > 0
    ? (parseFloat(budget) / parseFloat(fuelPrice)) * mileageKmpl : 0;

  const handleFuelType = (ft: string) => {
    setFuelType(ft);
    setFuelPrice(fuelDefaults[ft].price);
    setMileage(fuelDefaults[ft].mileage);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Mileage & Fuel Cost" icon={Fuel} iconColor="bg-orange-500">
        <ModeBar modes={[{ id: "trip", label: "Trip Cost" }, { id: "budget", label: "Budget → Range" }]} active={mode} onChange={setMode} color="bg-orange-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Fuel Type</label>
          <div className="grid grid-cols-4 gap-1.5">
            {Object.keys(fuelDefaults).map(ft => (
              <button key={ft} onClick={() => handleFuelType(ft)} data-testid={`fuel-${ft}`}
                className={`py-2 rounded-lg text-xs font-bold capitalize transition-all ${fuelType === ft ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"}`}>{ft}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1"><InputField label="Distance" value={distance} onChange={setDistance} type="number" /></div>
          <div className="mt-6">
            <select value={distUnit} onChange={e => setDistUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
              {["km", "miles"].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1"><InputField label={fuelType === "ev" ? "Efficiency" : "Mileage"} value={mileage} onChange={setMileage} type="number" /></div>
          <div className="mt-6">
            <select value={mileageUnit} onChange={e => setMileageUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
              {fuelType === "ev" ? ["km/kWh", "mi/kWh", "kWh/100km"].map(u => <option key={u} value={u}>{u}</option>)
                : ["kmpl", "mpg", "l100km"].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <InputField label={`${fuelType === "ev" ? "Electricity" : "Fuel"} Price (${cs(currency)}/${fuelType === "ev" ? "kWh" : "L"})`} value={fuelPrice} onChange={setFuelPrice} type="number" />
        {mode === "budget" && <InputField label={`Your Budget (${cs(currency)})`} value={budget} onChange={setBudget} type="number" />}
        <div className="space-y-2 mt-3">
          {mode === "trip" ? (
            <>
              <Row label={`Distance in km`} value={`${fmt(distKm)} km`} />
              <Row label={`${fuelType === "ev" ? "Energy" : "Fuel"} Needed`} value={`${fmt(fuelNeeded)} ${fuelType === "ev" ? "kWh" : "L"}`} />
              <Row label="Total Cost" value={`${cs(currency)}${fmt(totalCost)}`} hi />
              <Row label="Cost per km" value={`${cs(currency)}${fmt(costPerKm, 3)}/km`} />
              <Row label="Cost per mile" value={`${cs(currency)}${fmt(costPerMile, 3)}/mi`} />
            </>
          ) : (
            <>
              <Row label={`Fuel you can buy`} value={`${fmt((parseFloat(budget)||0) / (parseFloat(fuelPrice)||1))} ${fuelType === "ev" ? "kWh" : "L"}`} />
              <Row label="Max Distance (km)" value={`${fmt(budgetDist)} km`} hi />
              <Row label="Max Distance (miles)" value={`${fmt(budgetDist / 1.60934)} mi`} />
            </>
          )}
        </div>
      </ToolCard>
    </div>
  );
}

function TyreSizeConverter() {
  const [mode, setMode] = useState("info");
  const [width, setWidth] = useState("225");
  const [aspect, setAspect] = useState("45");
  const [rim, setRim] = useState("17");
  const [width2, setWidth2] = useState("235");
  const [aspect2, setAspect2] = useState("45");
  const [rim2, setRim2] = useState("17");

  const calcTyre = (w: string, a: string, r: string) => {
    const wN = parseFloat(w)||225; const aN = parseFloat(a)||45; const rN = parseFloat(r)||17;
    const sidewall = wN * aN / 100;
    const diamMm = sidewall * 2 + rN * 25.4;
    const diamIn = diamMm / 25.4;
    const circ = Math.PI * diamMm;
    const revsKm = 1000000 / circ;
    return { wN, aN, rN, sidewall, diamMm, diamIn, circ, revsKm };
  };

  const t1 = calcTyre(width, aspect, rim);
  const t2 = calcTyre(width2, aspect2, rim2);
  const speedErr = t1.diamMm > 0 ? ((t2.diamMm - t1.diamMm) / t1.diamMm) * 100 : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Tyre Size Calculator" icon={Settings} iconColor="bg-gray-500">
        <ModeBar modes={[{ id: "info", label: "Tyre Info" }, { id: "compare", label: "Compare Sizes" }]} active={mode} onChange={setMode} />
        <div className="p-2 bg-muted/30 rounded-xl text-xs text-muted-foreground mb-3 font-mono">Format: Width/Aspect R Rim — e.g. 225/45 R17</div>
        <div className="grid grid-cols-3 gap-2">
          <InputField label="Width (mm)" value={width} onChange={setWidth} type="number" />
          <InputField label="Aspect (%)" value={aspect} onChange={setAspect} type="number" />
          <InputField label="Rim (in)" value={rim} onChange={setRim} type="number" />
        </div>
        {mode === "compare" && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Tyre 2 (new size)</div>
            <div className="grid grid-cols-3 gap-2">
              <InputField label="Width (mm)" value={width2} onChange={setWidth2} type="number" />
              <InputField label="Aspect (%)" value={aspect2} onChange={setAspect2} type="number" />
              <InputField label="Rim (in)" value={rim2} onChange={setRim2} type="number" />
            </div>
          </div>
        )}
        <div className="space-y-2 mt-3">
          <Row label="Sidewall Height" value={`${fmt(t1.sidewall, 1)} mm`} />
          <Row label="Overall Diameter" value={`${fmt(t1.diamIn, 1)}" (${fmt(t1.diamMm, 0)} mm)`} hi />
          <Row label="Circumference" value={`${fmt(t1.circ / 1000, 3)} m`} />
          <Row label="Revs per km" value={fmt(t1.revsKm, 0)} />
          {mode === "compare" && (
            <>
              <div className="mt-2 text-[10px] font-bold text-muted-foreground uppercase">Tyre 2 Results</div>
              <Row label="T2 Diameter" value={`${fmt(t2.diamIn, 1)}" (${fmt(t2.diamMm, 0)} mm)`} />
              <Row label="T2 Circumference" value={`${fmt(t2.circ / 1000, 3)} m`} />
              <Row label="T2 Revs/km" value={fmt(t2.revsKm, 0)} />
              <Row label="Speedometer Error" value={`${speedErr > 0 ? "+" : ""}${fmt(speedErr, 2)}%`} hi accent={Math.abs(speedErr) > 3 ? "text-red-400" : "text-emerald-400"} />
              <div className="p-2 bg-muted/20 rounded-xl text-xs text-muted-foreground">{Math.abs(speedErr) > 3 ? "⚠️ Large size difference — may affect speedometer accuracy" : "✅ Within acceptable tolerance"}</div>
            </>
          )}
        </div>
      </ToolCard>
    </div>
  );
}

function RPMSpeedCalculator() {
  const [mode, setMode] = useState("speed");
  const [speedUnit, setSpeedUnit] = useState("kmh");
  const [rpm, setRpm] = useState("3000");
  const [speed, setSpeed] = useState("100");
  const [gearRatio, setGearRatio] = useState("3.5");
  const [finalDrive, setFinalDrive] = useState("3.73");
  const [tyreDiameter, setTyreDiameter] = useState("26");

  const r = parseFloat(rpm)||0; const s = parseFloat(speed)||0;
  const gr = parseFloat(gearRatio)||1; const fd = parseFloat(finalDrive)||1;
  const td = parseFloat(tyreDiameter)||26;
  const circ = Math.PI * td * 0.0254;
  const calcSpeed = () => { const kmh = (r * circ * 60) / (gr * fd * 1000); return speedUnit === "kmh" ? kmh : kmh * 0.621371; };
  const calcRPM = () => { const kmh = speedUnit === "kmh" ? s : s * 1.60934; return (kmh * gr * fd * 1000) / (circ * 60); };
  const result = mode === "speed" ? calcSpeed() : calcRPM();
  const resultLabel = mode === "speed" ? (speedUnit === "kmh" ? "km/h" : "mph") : "RPM";

  const gearPresets = [
    { label: "1st", ratio: "3.5" }, { label: "2nd", ratio: "2.0" },
    { label: "3rd", ratio: "1.3" }, { label: "4th", ratio: "1.0" },
    { label: "5th", ratio: "0.8" }, { label: "6th", ratio: "0.65" },
  ];

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="RPM / Speed Calculator" icon={Gauge} iconColor="bg-red-500">
        <ModeBar modes={[{ id: "speed", label: "Find Speed" }, { id: "rpm", label: "Find RPM" }]} active={mode} onChange={setMode} color="bg-red-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Speed Unit</span>
          <div className="flex gap-1.5">
            {["kmh", "mph"].map(u => (
              <button key={u} onClick={() => setSpeedUnit(u)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${speedUnit === u ? "bg-red-500 text-white" : "bg-muted text-muted-foreground"}`}>{u}</button>
            ))}
          </div>
        </div>
        {mode === "speed" ? <InputField label="Engine RPM" value={rpm} onChange={setRpm} type="number" />
          : <InputField label={`Speed (${speedUnit === "kmh" ? "km/h" : "mph"})`} value={speed} onChange={setSpeed} type="number" />}
        <div className="mb-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Gear Ratio Preset</label>
          <div className="flex gap-1.5 flex-wrap">
            {gearPresets.map(g => (
              <button key={g.label} onClick={() => setGearRatio(g.ratio)} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${gearRatio === g.ratio ? "bg-red-500 text-white" : "bg-muted text-muted-foreground"}`}>{g.label}</button>
            ))}
          </div>
        </div>
        <InputField label="Gear Ratio" value={gearRatio} onChange={setGearRatio} type="number" step={0.1} />
        <InputField label="Final Drive Ratio" value={finalDrive} onChange={setFinalDrive} type="number" step={0.01} />
        <InputField label="Tyre Diameter (inches)" value={tyreDiameter} onChange={setTyreDiameter} type="number" />
        <div className="mt-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
          <div className="text-3xl font-black text-red-400 mb-1">{fmt(result, 1)} {resultLabel}</div>
          <div className="text-xs text-muted-foreground">{mode === "speed" ? "Vehicle Speed" : "Engine RPM"}</div>
        </div>
      </ToolCard>
    </div>
  );
}

function GearRatioCalculator() {
  const [mode, setMode] = useState("simple");
  const [drivingTeeth, setDrivingTeeth] = useState("15");
  const [drivenTeeth, setDrivenTeeth] = useState("45");
  const [inputRPM, setInputRPM] = useState("3000");

  const transmissionGears = [
    { gear: "1st", ratio: "3.5" }, { gear: "2nd", ratio: "2.0" },
    { gear: "3rd", ratio: "1.3" }, { gear: "4th", ratio: "1.0" },
    { gear: "5th", ratio: "0.8" }, { gear: "6th", ratio: "0.65" },
  ];

  const driving = parseInt(drivingTeeth)||1;
  const driven = parseInt(drivenTeeth)||1;
  const ratio = driven / driving;
  const inRpm = parseFloat(inputRPM)||3000;
  const outRpm = inRpm / ratio;
  const torqueMultiplier = ratio;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Gear Ratio Calculator" icon={Settings} iconColor="bg-purple-500">
        <ModeBar modes={[{ id: "simple", label: "Simple Ratio" }, { id: "transmission", label: "Transmission" }]} active={mode} onChange={setMode} color="bg-purple-600" />
        {mode === "simple" ? (
          <div className="space-y-3">
            <InputField label="Driving Gear Teeth (input)" value={drivingTeeth} onChange={setDrivingTeeth} type="number" />
            <InputField label="Driven Gear Teeth (output)" value={drivenTeeth} onChange={setDrivenTeeth} type="number" />
            <InputField label="Input RPM" value={inputRPM} onChange={setInputRPM} type="number" />
            <div className="space-y-2 mt-2">
              <Row label="Gear Ratio" value={`${fmt(ratio, 3)}:1`} hi />
              <Row label="Output RPM" value={`${fmt(outRpm, 0)} RPM`} />
              <Row label="Torque Multiplier" value={`${fmt(torqueMultiplier, 3)}×`} />
              <Row label="Type" value={ratio > 1 ? "⬇️ Speed reduction / torque up" : "⬆️ Speed increase / torque down"} />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <InputField label="Engine RPM" value={inputRPM} onChange={setInputRPM} type="number" />
            <div className="space-y-1.5">
              {transmissionGears.map(g => {
                const gRatio = parseFloat(g.ratio);
                const outR = inRpm / gRatio;
                return (
                  <div key={g.gear} className="flex items-center justify-between p-2.5 bg-muted/30 rounded-xl">
                    <span className="text-xs font-bold text-muted-foreground">{g.gear} ({g.ratio}:1)</span>
                    <span className="text-sm font-bold text-purple-400">{fmt(outR, 0)} RPM out</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function EVRangeEstimator() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("range");
  const [batteryCapacity, setBatteryCapacity] = useState("75");
  const [efficiency, setEfficiency] = useState("15");
  const [currentCharge, setCurrentCharge] = useState("80");
  const [drivingMode, setDrivingMode] = useState("mixed");
  const [temperature, setTemperature] = useState("25");
  const [electricityRate, setElectricityRate] = useState("8");

  const efficiencyByMode: Record<string, number> = { city: 12, highway: 18, mixed: 15 };
  const tempFactor = (t: number) => t < 0 ? 0.65 : t < 10 ? 0.8 : t > 35 ? 0.9 : 1.0;

  const capacity = parseFloat(batteryCapacity)||75;
  const eff = parseFloat(efficiency) || efficiencyByMode[drivingMode];
  const charge = parseFloat(currentCharge)||100;
  const temp = parseFloat(temperature)||25;
  const elRate = parseFloat(electricityRate)||8;

  const usableEnergy = capacity * (charge / 100);
  const tFactor = tempFactor(temp);
  const estimatedRange = usableEnergy / (eff / 100) * tFactor;
  const fullChargeCost = capacity * elRate;
  const costPer100km = eff * elRate / 100;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="EV Range Estimator" icon={Zap} iconColor="bg-green-500">
        <ModeBar modes={[{ id: "range", label: "Estimate Range" }, { id: "cost", label: "Charging Cost" }]} active={mode} onChange={setMode} color="bg-green-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <InputField label="Battery Capacity (kWh)" value={batteryCapacity} onChange={setBatteryCapacity} type="number" />
        <InputField label="Current Charge (%)" value={currentCharge} onChange={setCurrentCharge} type="number" max={100} />
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Driving Mode</label>
          <div className="flex gap-1.5">
            {Object.keys(efficiencyByMode).map(m => (
              <button key={m} onClick={() => { setDrivingMode(m); setEfficiency(String(efficiencyByMode[m])); }} data-testid={`drive-${m}`}
                className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${drivingMode === m ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>{m}</button>
            ))}
          </div>
        </div>
        <InputField label="Energy Usage (kWh/100km)" value={efficiency} onChange={setEfficiency} type="number" />
        <InputField label="Ambient Temperature (°C)" value={temperature} onChange={setTemperature} type="number" />
        {mode === "cost" && <InputField label={`Electricity Rate (${cs(currency)}/kWh)`} value={electricityRate} onChange={setElectricityRate} type="number" />}
        <div className="space-y-2 mt-3">
          <Row label="Usable Energy" value={`${fmt(usableEnergy, 1)} kWh`} />
          <Row label={`Temperature Factor (${temp}°C)`} value={`${fmt(tFactor * 100, 0)}%`} />
          <Row label="Estimated Range" value={`${fmt(estimatedRange, 0)} km`} hi accent="text-green-400" />
          <Row label="Range in miles" value={`${fmt(estimatedRange * 0.621371, 0)} mi`} />
          {mode === "cost" && <>
            <Row label="Full Charge Cost" value={`${cs(currency)}${fmt(fullChargeCost)}`} hi />
            <Row label={`Cost per 100km`} value={`${cs(currency)}${fmt(costPer100km, 1)}`} />
          </>}
        </div>
      </ToolCard>
    </div>
  );
}

function ChargingTimeCalculator() {
  const [currency, setCurrency] = useState("INR");
  const [batteryCapacity, setBatteryCapacity] = useState("75");
  const [currentCharge, setCurrentCharge] = useState("20");
  const [targetCharge, setTargetCharge] = useState("80");
  const [chargerType, setChargerType] = useState("custom");
  const [chargerPower, setChargerPower] = useState("11");
  const [electricityRate, setElectricityRate] = useState("8");

  const chargerPresets: Record<string, { power: number; label: string }> = {
    "2pin_home": { power: 1.8, label: "2-Pin Home (1.8kW)" },
    "level2_home": { power: 7.2, label: "Level 2 AC (7.2kW)" },
    "level2_public": { power: 22, label: "Public AC (22kW)" },
    "dc_fast_50": { power: 50, label: "DC Fast (50kW)" },
    "dc_fast_150": { power: 150, label: "DC Superfast (150kW)" },
    "dc_ultra": { power: 350, label: "Ultra Fast (350kW)" },
    custom: { power: parseFloat(chargerPower)||11, label: "Custom" },
  };

  const capacity = parseFloat(batteryCapacity)||75;
  const current = parseFloat(currentCharge)||0;
  const target = parseFloat(targetCharge)||100;
  const power = chargerPresets[chargerType].power;
  const elRate = parseFloat(electricityRate)||8;

  const energyNeeded = capacity * ((target - current) / 100);
  const chargingTime = energyNeeded / power;
  const hours = Math.floor(chargingTime);
  const minutes = Math.round((chargingTime - hours) * 60);
  const chargingCost = energyNeeded * elRate;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="EV Charging Time" icon={Clock} iconColor="bg-blue-500">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Charger Type</label>
          <select value={chargerType} onChange={e => setChargerType(e.target.value)} className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
            {Object.entries(chargerPresets).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        {chargerType === "custom" && <InputField label="Charger Power (kW)" value={chargerPower} onChange={setChargerPower} type="number" />}
        <InputField label="Battery Capacity (kWh)" value={batteryCapacity} onChange={setBatteryCapacity} type="number" />
        <div className="grid grid-cols-2 gap-2">
          <InputField label="Current Charge (%)" value={currentCharge} onChange={setCurrentCharge} type="number" max={100} />
          <InputField label="Target Charge (%)" value={targetCharge} onChange={setTargetCharge} type="number" max={100} />
        </div>
        <InputField label={`Electricity Rate (${cs(currency)}/kWh)`} value={electricityRate} onChange={setElectricityRate} type="number" />
        <div className="space-y-2 mt-3">
          <Row label="Energy to add" value={`${fmt(energyNeeded, 1)} kWh`} />
          <Row label="Charger Power" value={`${power} kW`} />
          <Row label="Charging Time" value={`${hours}h ${minutes}m`} hi accent="text-blue-400" />
          <Row label={`Charging Cost`} value={`${cs(currency)}${fmt(chargingCost, 1)}`} hi />
        </div>
      </ToolCard>
    </div>
  );
}

function TollCostEstimator() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("distance");
  const [distance, setDistance] = useState("200");
  const [distUnit, setDistUnit] = useState("km");
  const [ratePerKm, setRatePerKm] = useState("1.5");
  const [vehicleType, setVehicleType] = useState("car");
  const [numTolls, setNumTolls] = useState("5");
  const [ratePerToll, setRatePerToll] = useState("60");

  const multipliers: Record<string, { mul: number; label: string }> = {
    two_wheeler: { mul: 0.5, label: "2-Wheeler" }, car: { mul: 1, label: "Car/Jeep" },
    lcv: { mul: 1.5, label: "LCV/Mini" }, bus: { mul: 2.5, label: "Bus/Truck" },
    hcv: { mul: 3.5, label: "HCV/Multi-axle" },
  };

  const d = parseFloat(distance)||0;
  const distKm = distUnit === "km" ? d : d * 1.60934;
  const rate = parseFloat(ratePerKm)||0;
  const mul = multipliers[vehicleType].mul;
  const tolls = parseInt(numTolls)||0;
  const perToll = parseFloat(ratePerToll)||0;
  const distanceToll = distKm * rate * mul;
  const fixedToll = tolls * perToll * mul;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Toll Cost Estimator" icon={DollarSign} iconColor="bg-amber-500">
        <ModeBar modes={[{ id: "distance", label: "By Distance" }, { id: "manual", label: "Manual Tolls" }]} active={mode} onChange={setMode} color="bg-amber-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Vehicle Type</label>
          <div className="flex gap-1.5 flex-wrap">
            {Object.entries(multipliers).map(([k, v]) => (
              <button key={k} onClick={() => setVehicleType(k)} data-testid={`vehicle-${k}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${vehicleType === k ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}>{v.label}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1"><InputField label="Distance" value={distance} onChange={setDistance} type="number" /></div>
          <div className="mt-6">
            <select value={distUnit} onChange={e => setDistUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
              {["km", "miles"].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        {mode === "distance" ? (
          <InputField label={`Toll Rate (${cs(currency)}/km)`} value={ratePerKm} onChange={setRatePerKm} type="number" step={0.1} />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <InputField label="Number of Tolls" value={numTolls} onChange={setNumTolls} type="number" />
            <InputField label={`Rate per Toll (${cs(currency)})`} value={ratePerToll} onChange={setRatePerToll} type="number" />
          </div>
        )}
        <div className="space-y-2 mt-3">
          <Row label="Distance (km)" value={`${fmt(distKm)} km`} />
          <Row label={`Vehicle Multiplier`} value={`${mul}×`} />
          <Row label="Estimated Toll" value={`${cs(currency)}${fmt(mode === "distance" ? distanceToll : fixedToll)}`} hi accent="text-amber-400" />
          {mode === "manual" && <Row label="Per Toll Average" value={`${cs(currency)}${fmt(perToll * mul)}`} />}
        </div>
      </ToolCard>
    </div>
  );
}

function DepreciationCalculator() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("reducing");
  const [purchasePrice, setPurchasePrice] = useState("1200000");
  const [age, setAge] = useState("3");
  const [deprecationRate, setDeprecationRate] = useState("15");
  const [residualValue, setResidualValue] = useState("200000");
  const [usefulLife, setUsefulLife] = useState("10");

  const price = parseFloat(purchasePrice)||0;
  const years = parseInt(age)||0;
  const rate = parseFloat(deprecationRate)||15;
  const residual = parseFloat(residualValue)||0;
  const life = parseInt(usefulLife)||10;

  const reducingValue = price * Math.pow(1 - rate / 100, years);
  const straightLineDepr = life > 0 ? (price - residual) / life : 0;
  const straightLineValue = price - straightLineDepr * years;
  const currentValue = mode === "reducing" ? reducingValue : Math.max(residual, straightLineValue);
  const totalLost = price - currentValue;
  const pctLost = price > 0 ? (totalLost / price) * 100 : 0;

  const yearByYear = Array.from({ length: Math.min(years + 2, 8) }, (_, i) => ({
    year: i + 1,
    value: mode === "reducing" ? price * Math.pow(1 - rate / 100, i + 1) : Math.max(residual, price - straightLineDepr * (i + 1)),
  }));

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Car Depreciation" icon={TrendingDown} iconColor="bg-red-500">
        <ModeBar modes={[{ id: "reducing", label: "Reducing Balance" }, { id: "straight", label: "Straight Line" }]} active={mode} onChange={setMode} color="bg-red-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <InputField label={`Purchase Price (${cs(currency)})`} value={purchasePrice} onChange={setPurchasePrice} type="number" />
        <InputField label="Current Age (years)" value={age} onChange={setAge} type="number" />
        {mode === "reducing" ? (
          <InputField label="Annual Depreciation Rate (%)" value={deprecationRate} onChange={setDeprecationRate} type="number" />
        ) : (
          <>
            <InputField label={`Residual Value (${cs(currency)})`} value={residualValue} onChange={setResidualValue} type="number" />
            <InputField label="Useful Life (years)" value={usefulLife} onChange={setUsefulLife} type="number" />
          </>
        )}
        <div className="space-y-2 mt-3">
          <Row label="Purchase Price" value={`${cs(currency)}${fmt(price, 0)}`} />
          <Row label="Current Value" value={`${cs(currency)}${fmt(currentValue, 0)}`} hi accent="text-emerald-400" />
          <Row label="Value Lost" value={`${cs(currency)}${fmt(totalLost, 0)}`} accent="text-red-400" />
          <Row label="Percent Lost" value={`${fmt(pctLost, 1)}%`} />
        </div>
        <div className="mt-3">
          <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Year-by-Year Value</div>
          <div className="space-y-1">
            {yearByYear.map(y => (
              <div key={y.year} className="flex justify-between items-center px-2.5 py-1.5 bg-muted/20 rounded-lg">
                <span className="text-[10px] text-muted-foreground">Year {y.year}</span>
                <span className="text-xs font-bold text-foreground">{cs(currency)}{fmt(y.value, 0)}</span>
              </div>
            ))}
          </div>
        </div>
      </ToolCard>
    </div>
  );
}

function InsuranceEstimator() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("premium");
  const [carValue, setCarValue] = useState("1200000");
  const [driverAge, setDriverAge] = useState("30");
  const [yearsNoClaim, setYearsNoClaim] = useState("3");
  const [coverType, setCoverType] = useState("comprehensive");
  const [addons, setAddons] = useState<string[]>([]);
  const [engineCC, setEngineCC] = useState("1500");

  const toggleAddon = (a: string) => setAddons(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  const addonCosts: Record<string, number> = { "Zero Dep": 0.008, "Engine Protect": 0.005, "Return to Invoice": 0.012, "Roadside Assist": 500, "NCB Protect": 0.006 };

  const value = parseFloat(carValue)||0;
  const age = parseInt(driverAge)||30;
  const ncb = parseInt(yearsNoClaim)||0;
  const cc = parseInt(engineCC)||1500;

  const baseRate = coverType === "comprehensive" ? (cc <= 1000 ? 0.032 : cc <= 1500 ? 0.035 : 0.04) : 0.02;
  const ageMultiplier = age < 25 ? 1.5 : age > 65 ? 1.3 : 1;
  const ncbDiscount = [0, 0.2, 0.25, 0.35, 0.45, 0.5][Math.min(ncb, 5)];
  const basePremium = value * baseRate * ageMultiplier;
  const discountAmt = basePremium * ncbDiscount;
  const addonCostTotal = addons.reduce((sum, a) => sum + (typeof addonCosts[a] === "number" && addonCosts[a] < 1 ? value * addonCosts[a] : addonCosts[a]), 0);
  const finalPremium = basePremium - discountAmt + addonCostTotal;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Insurance Premium Estimator" icon={Shield} iconColor="bg-blue-500">
        <ModeBar modes={[{ id: "premium", label: "Premium Calc" }, { id: "ncb", label: "NCB Calculator" }]} active={mode} onChange={setMode} color="bg-blue-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <InputField label={`Car Value / IDV (${cs(currency)})`} value={carValue} onChange={setCarValue} type="number" />
        <InputField label="Engine Capacity (cc)" value={engineCC} onChange={setEngineCC} type="number" />
        <InputField label="Driver Age (years)" value={driverAge} onChange={setDriverAge} type="number" />
        <InputField label="Claim-Free Years (NCB)" value={yearsNoClaim} onChange={setYearsNoClaim} type="number" />
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Coverage Type</label>
          <div className="flex gap-1.5">
            {["comprehensive", "thirdparty"].map(c => (
              <button key={c} onClick={() => setCoverType(c)} data-testid={`cover-${c}`}
                className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${coverType === c ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}>
                {c === "thirdparty" ? "Third Party" : c}
              </button>
            ))}
          </div>
        </div>
        {mode === "premium" && (
          <div className="mb-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Add-Ons</label>
            <div className="flex gap-1.5 flex-wrap">
              {Object.keys(addonCosts).map(a => (
                <button key={a} onClick={() => toggleAddon(a)} className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${addons.includes(a) ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}>{a}</button>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2 mt-3">
          {mode === "premium" ? (
            <>
              <Row label="Base Premium" value={`${cs(currency)}${fmt(basePremium, 0)}`} />
              <Row label={`NCB Discount (${ncbDiscount * 100}%)`} value={`-${cs(currency)}${fmt(discountAmt, 0)}`} accent="text-green-400" />
              {addons.length > 0 && <Row label="Add-On Cost" value={`+${cs(currency)}${fmt(addonCostTotal, 0)}`} />}
              <Row label="Annual Premium" value={`${cs(currency)}${fmt(finalPremium, 0)}`} hi accent="text-blue-400" />
              <Row label="Monthly (approx)" value={`${cs(currency)}${fmt(finalPremium / 12, 0)}`} />
            </>
          ) : (
            <>
              {[0, 1, 2, 3, 4, 5].map(yr => {
                const disc = [0, 0.2, 0.25, 0.35, 0.45, 0.5][yr];
                return (
                  <div key={yr} className="flex justify-between items-center p-2.5 bg-muted/30 rounded-xl">
                    <span className="text-xs font-semibold text-muted-foreground">{yr} claim-free year{yr !== 1 ? "s" : ""}</span>
                    <span className="text-sm font-bold text-blue-400">{disc * 100}% NCB</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </ToolCard>
    </div>
  );
}
