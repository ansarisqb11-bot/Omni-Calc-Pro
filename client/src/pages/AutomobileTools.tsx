import { useState } from "react";
import { Car, Fuel, Gauge, Settings, Zap, Clock, DollarSign, TrendingDown, Shield } from "lucide-react";
import { DesktopToolGrid, InputPanel, ResultPanel, SummaryCard, BreakdownRow, InputField, ModeSelector } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "mileage" | "tyre" | "rpm" | "gear" | "evrange" | "charging" | "toll" | "depreciation" | "insurance";

const CURRENCIES = [
  { code: "INR", symbol: "₹" }, { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" }, { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" }, { code: "CNY", symbol: "¥" },
  { code: "AUD", symbol: "A$" }, { code: "CAD", symbol: "C$" },
  { code: "AED", symbol: "د.إ" }, { code: "SGD", symbol: "S$" },
];
const cs = (code: string) => CURRENCIES.find(c => c.code === code)?.symbol || "₹";
const fmt = (n: number, d = 2) => isFinite(n) && !isNaN(n) ? parseFloat(n.toFixed(d)).toLocaleString() : "—";

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
    <PageWrapper title="Automobile Tools" subtitle="Vehicle, fuel, EV and cost calculators" accentColor="bg-slate-600" tools={tools} activeTool={activeTool} onToolChange={id => setActiveTool(id as ToolType)}>
      {activeTool === "mileage" && <Mileage />}
      {activeTool === "tyre" && <TyreSize />}
      {activeTool === "rpm" && <RPMSpeed />}
      {activeTool === "gear" && <GearRatio />}
      {activeTool === "evrange" && <EVRange />}
      {activeTool === "charging" && <Charging />}
      {activeTool === "toll" && <Toll />}
      {activeTool === "depreciation" && <Depreciation />}
      {activeTool === "insurance" && <Insurance />}
    </PageWrapper>
  );
}

function Mileage() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("trip");
  const [fuelType, setFuelType] = useState("petrol");
  const [distance, setDistance] = useState("500"); const [distUnit, setDistUnit] = useState("km");
  const [mileage, setMileage] = useState("15"); const [mileageUnit, setMileageUnit] = useState("kmpl");
  const [fuelPrice, setFuelPrice] = useState("105"); const [budget, setBudget] = useState("1000");

  const ftDefaults: Record<string, { price:string; mileage:string }> = {
    petrol:{ price:"105", mileage:"15" }, diesel:{ price:"92", mileage:"18" },
    cng:{ price:"85", mileage:"25" }, ev:{ price:"8", mileage:"6" },
  };
  const distKm = distUnit === "km" ? parseFloat(distance)||0 : (parseFloat(distance)||0)*1.60934;
  const mKmpl = mileageUnit === "kmpl" ? parseFloat(mileage)||1 : mileageUnit === "mpg" ? (parseFloat(mileage)||0)*0.425144 : 100/(parseFloat(mileage)||1);
  const fuelNeeded = mKmpl > 0 ? distKm/mKmpl : 0;
  const totalCost = fuelNeeded * (parseFloat(fuelPrice)||0);
  const costPerKm = distKm > 0 ? totalCost/distKm : 0;
  const budgetDist = parseFloat(budget) > 0 && parseFloat(fuelPrice) > 0 && mKmpl > 0 ? (parseFloat(budget)/parseFloat(fuelPrice))*mKmpl : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Fuel & Distance" icon={Fuel} iconColor="bg-orange-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"trip", label:"Trip Cost" }, { id:"budget", label:"Budget Range" }]} active={mode} onChange={setMode} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Fuel Type</label>
            <div className="grid grid-cols-4 gap-1.5">
              {Object.keys(ftDefaults).map(ft => (
                <button key={ft} onClick={() => { setFuelType(ft); setFuelPrice(ftDefaults[ft].price); setMileage(ftDefaults[ft].mileage); }} data-testid={`fuel-${ft}`}
                  className={`py-2 rounded-lg text-xs font-bold capitalize ${fuelType === ft ? "bg-orange-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{ft}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Distance" value={distance} onChange={setDistance} type="number" />
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Unit</label>
              <div className="flex gap-1.5">
                {["km","miles"].map(u => <button key={u} onClick={() => setDistUnit(u)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${distUnit === u ? "bg-orange-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{u}</button>)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Mileage" value={mileage} onChange={setMileage} type="number" />
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Unit</label>
              <select value={mileageUnit} onChange={e => setMileageUnit(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
                {(fuelType === "ev" ? ["km/kWh","mi/kWh"] : ["kmpl","mpg","l100km"]).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <InputField label={`${fuelType === "ev" ? "Electricity" : "Fuel"} Price (${cs(currency)}/L)`} value={fuelPrice} onChange={setFuelPrice} type="number" prefix={cs(currency)} />
          {mode === "budget" && <InputField label="Your Budget" value={budget} onChange={setBudget} type="number" prefix={cs(currency)} />}
        </InputPanel>
      }
      results={
        mode === "trip" ? (
          <ResultPanel label="Trip Fuel Cost"
            primary={`${cs(currency)}${fmt(totalCost)}`}
            summaries={<>
              <SummaryCard label="Fuel Needed" value={`${fmt(fuelNeeded, 1)} ${fuelType === "ev" ? "kWh" : "L"}`} accent="text-orange-500" />
              <SummaryCard label="Cost per km" value={`${cs(currency)}${fmt(costPerKm, 3)}`} />
            </>}
          >
            <BreakdownRow label={`Distance (km)`} value={`${fmt(distKm)} km`} dot="bg-blue-400" />
            <BreakdownRow label="Fuel / Energy Needed" value={`${fmt(fuelNeeded, 1)} ${fuelType === "ev" ? "kWh" : "L"}`} dot="bg-orange-400" />
            <BreakdownRow label="Total Cost" value={`${cs(currency)}${fmt(totalCost)}`} dot="bg-green-500" bold />
            <BreakdownRow label="Cost per km" value={`${cs(currency)}${fmt(costPerKm, 3)}/km`} dot="bg-purple-400" />
            <BreakdownRow label="Cost per mile" value={`${cs(currency)}${fmt(costPerKm*1.60934, 3)}/mi`} />
          </ResultPanel>
        ) : (
          <ResultPanel label="Maximum Range"
            primary={`${fmt(budgetDist)} km`}
            summaries={<>
              <SummaryCard label="In Miles" value={`${fmt(budgetDist/1.60934)} mi`} accent="text-orange-500" />
              <SummaryCard label="Fuel Buyable" value={`${fmt((parseFloat(budget)||0)/(parseFloat(fuelPrice)||1), 1)} ${fuelType === "ev" ? "kWh" : "L"}`} />
            </>}
          >
            <BreakdownRow label="Budget" value={`${cs(currency)}${fmt(parseFloat(budget)||0)}`} dot="bg-blue-400" />
            <BreakdownRow label="Fuel Price" value={`${cs(currency)}${fmt(parseFloat(fuelPrice)||0)}/L`} dot="bg-orange-400" />
            <BreakdownRow label="Mileage" value={`${fmt(mKmpl, 1)} km/L`} dot="bg-green-500" />
            <BreakdownRow label="Max Range (km)" value={`${fmt(budgetDist)} km`} bold />
          </ResultPanel>
        )
      }
    />
  );
}

function TyreSize() {
  const [mode, setMode] = useState("info");
  const [w1, setW1] = useState("225"); const [a1, setA1] = useState("45"); const [r1, setR1] = useState("17");
  const [w2, setW2] = useState("235"); const [a2, setA2] = useState("45"); const [r2, setR2] = useState("17");

  const calc = (w: string, a: string, r: string) => {
    const wN = parseFloat(w)||225; const aN = parseFloat(a)||45; const rN = parseFloat(r)||17;
    const sw = wN * aN/100; const diamMm = sw*2 + rN*25.4;
    return { sw, diamMm, diamIn: diamMm/25.4, circ: Math.PI*diamMm, revKm: 1000000/(Math.PI*diamMm) };
  };
  const t1 = calc(w1,a1,r1); const t2 = calc(w2,a2,r2);
  const speedErr = t1.diamMm > 0 ? ((t2.diamMm-t1.diamMm)/t1.diamMm)*100 : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Tyre Dimensions" icon={Settings} iconColor="bg-gray-600">
          <ModeSelector modes={[{ id:"info", label:"Tyre Info" }, { id:"compare", label:"Compare Sizes" }]} active={mode} onChange={setMode} />
          <div className="text-xs text-muted-foreground p-2.5 bg-muted/20 rounded-lg">Format: Width/Aspect R Rim — e.g. 225/45 R17</div>
          <div className="grid grid-cols-3 gap-2">
            <InputField label="Width (mm)" value={w1} onChange={setW1} type="number" />
            <InputField label="Aspect (%)" value={a1} onChange={setA1} type="number" />
            <InputField label="Rim (in)" value={r1} onChange={setR1} type="number" />
          </div>
          {mode === "compare" && (
            <>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide pt-2">New / Replacement Tyre</div>
              <div className="grid grid-cols-3 gap-2">
                <InputField label="Width (mm)" value={w2} onChange={setW2} type="number" />
                <InputField label="Aspect (%)" value={a2} onChange={setA2} type="number" />
                <InputField label="Rim (in)" value={r2} onChange={setR2} type="number" />
              </div>
            </>
          )}
        </InputPanel>
      }
      results={
        <ResultPanel label="Tyre Specifications"
          primary={`${fmt(t1.diamIn, 1)}"`}
          primarySub={`(${fmt(t1.diamMm, 0)} mm)`}
          summaries={<>
            <SummaryCard label="Circumference" value={`${fmt(t1.circ/1000, 3)} m`} />
            <SummaryCard label="Revs per km" value={`${fmt(t1.revKm, 0)}`} />
          </>}
        >
          <BreakdownRow label="Sidewall Height" value={`${fmt(t1.sw, 1)} mm`} dot="bg-blue-400" />
          <BreakdownRow label="Overall Diameter" value={`${fmt(t1.diamIn, 2)}" / ${fmt(t1.diamMm, 1)} mm`} dot="bg-green-500" bold />
          <BreakdownRow label="Circumference" value={`${fmt(t1.circ/1000, 3)} m`} dot="bg-purple-400" />
          <BreakdownRow label="Revs per km" value={`${fmt(t1.revKm, 0)}`} dot="bg-amber-400" />
          {mode === "compare" && (
            <>
              <BreakdownRow label="T2 Diameter" value={`${fmt(t2.diamIn, 2)}" / ${fmt(t2.diamMm, 1)} mm`} />
              <BreakdownRow label="T2 Revs/km" value={`${fmt(t2.revKm, 0)}`} />
              <BreakdownRow label="Speedometer Error" value={`${speedErr > 0 ? "+" : ""}${fmt(speedErr, 2)}%`} bold />
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

function RPMSpeed() {
  const [mode, setMode] = useState("speed");
  const [rpm, setRpm] = useState("3000"); const [speed, setSpeed] = useState("100");
  const [gearRatio, setGearRatio] = useState("3.5"); const [finalDrive, setFinalDrive] = useState("3.73");
  const [tyreDiam, setTyreDiam] = useState("26"); const [speedUnit, setSpeedUnit] = useState("kmh");

  const circ = Math.PI * (parseFloat(tyreDiam)||26) * 0.0254;
  const gr = parseFloat(gearRatio)||1; const fd = parseFloat(finalDrive)||1;
  const rpmN = parseFloat(rpm)||0;
  const calcSpeed = () => { const k = (rpmN * circ * 60) / (gr * fd * 1000); return speedUnit === "kmh" ? k : k*0.621371; };
  const calcRPM = () => { const kmh = speedUnit === "kmh" ? parseFloat(speed)||0 : (parseFloat(speed)||0)*1.60934; return (kmh * gr * fd * 1000) / (circ * 60); };
  const result = mode === "speed" ? calcSpeed() : calcRPM();

  const gearPresets = [{ l:"1st",r:"3.5" },{ l:"2nd",r:"2.0" },{ l:"3rd",r:"1.3" },{ l:"4th",r:"1.0" },{ l:"5th",r:"0.8" },{ l:"6th",r:"0.65" }];

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="RPM / Speed Parameters" icon={Gauge} iconColor="bg-red-500">
          <ModeSelector modes={[{ id:"speed", label:"Find Speed" }, { id:"rpm", label:"Find RPM" }]} active={mode} onChange={setMode} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Speed Unit</label>
            <div className="flex gap-1.5">
              {["kmh","mph"].map(u => <button key={u} onClick={() => setSpeedUnit(u)} className={`flex-1 py-2 rounded-lg text-xs font-bold ${speedUnit === u ? "bg-red-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{u}</button>)}
            </div>
          </div>
          {mode === "speed" ? <InputField label="Engine RPM" value={rpm} onChange={setRpm} type="number" />
            : <InputField label={`Speed (${speedUnit === "kmh" ? "km/h" : "mph"})`} value={speed} onChange={setSpeed} type="number" />}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Gear Preset</label>
            <div className="flex gap-1.5 flex-wrap">
              {gearPresets.map(g => <button key={g.l} onClick={() => setGearRatio(g.r)} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${gearRatio === g.r ? "bg-red-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{g.l}</button>)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Gear Ratio" value={gearRatio} onChange={setGearRatio} type="number" />
            <InputField label="Final Drive" value={finalDrive} onChange={setFinalDrive} type="number" />
          </div>
          <InputField label="Tyre Diameter (inches)" value={tyreDiam} onChange={setTyreDiam} type="number" />
        </InputPanel>
      }
      results={
        <ResultPanel label={mode === "speed" ? "Vehicle Speed" : "Engine RPM"}
          primary={`${fmt(result, 1)} ${mode === "speed" ? (speedUnit === "kmh" ? "km/h" : "mph") : "RPM"}`}
          summaries={<>
            <SummaryCard label="Gear Ratio" value={`${gearRatio}:1`} />
            <SummaryCard label="Final Drive" value={`${finalDrive}:1`} />
          </>}
        >
          <BreakdownRow label="Tyre Circumference" value={`${fmt(circ, 3)} m`} dot="bg-blue-400" />
          <BreakdownRow label="Gear Ratio" value={`${gearRatio}:1`} dot="bg-green-500" />
          <BreakdownRow label="Final Drive" value={`${finalDrive}:1`} dot="bg-purple-400" />
          {mode === "speed"
            ? <BreakdownRow label="Input RPM" value={`${rpmN.toLocaleString()}`} dot="bg-amber-400" />
            : <BreakdownRow label={`Input Speed`} value={`${speed} ${speedUnit === "kmh" ? "km/h" : "mph"}`} dot="bg-amber-400" />}
          <BreakdownRow label={mode === "speed" ? "Speed" : "RPM"} value={`${fmt(result, 1)}`} bold />
        </ResultPanel>
      }
    />
  );
}

function GearRatio() {
  const [driving, setDriving] = useState("15"); const [driven, setDriven] = useState("45");
  const [inputRPM, setInputRPM] = useState("3000"); const [mode, setMode] = useState("simple");
  const ratio = (parseInt(driven)||1) / (parseInt(driving)||1);
  const inR = parseFloat(inputRPM)||3000; const outR = inR / ratio;
  const gears = [{ g:"1st",r:3.5 },{ g:"2nd",r:2.0 },{ g:"3rd",r:1.3 },{ g:"4th",r:1.0 },{ g:"5th",r:0.8 },{ g:"6th",r:0.65 }];

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Gear Parameters" icon={Settings} iconColor="bg-purple-500">
          <ModeSelector modes={[{ id:"simple", label:"Simple Ratio" }, { id:"transmission", label:"Transmission" }]} active={mode} onChange={setMode} />
          {mode === "simple" ? (
            <>
              <InputField label="Driving Gear Teeth" value={driving} onChange={setDriving} type="number" />
              <InputField label="Driven Gear Teeth" value={driven} onChange={setDriven} type="number" />
              <InputField label="Input RPM" value={inputRPM} onChange={setInputRPM} type="number" />
            </>
          ) : (
            <InputField label="Engine RPM" value={inputRPM} onChange={setInputRPM} type="number" />
          )}
        </InputPanel>
      }
      results={
        mode === "simple" ? (
          <ResultPanel label="Gear Ratio" primary={`${fmt(ratio, 3)}:1`}
            summaries={<>
              <SummaryCard label="Output RPM" value={`${fmt(outR, 0)}`} accent="text-purple-500" />
              <SummaryCard label="Torque ×" value={`${fmt(ratio, 2)}×`} />
            </>}
          >
            <BreakdownRow label="Driving Teeth" value={driving} dot="bg-purple-400" />
            <BreakdownRow label="Driven Teeth" value={driven} dot="bg-blue-400" />
            <BreakdownRow label="Gear Ratio" value={`${fmt(ratio, 3)}:1`} dot="bg-green-500" bold />
            <BreakdownRow label="Output RPM" value={`${fmt(outR, 0)}`} dot="bg-amber-400" />
            <BreakdownRow label="Type" value={ratio > 1 ? "Speed ↓ Torque ↑" : "Speed ↑ Torque ↓"} />
          </ResultPanel>
        ) : (
          <ResultPanel label="Transmission Output RPMs" primary={`${fmt(inR, 0)} RPM`} primarySub="input">
            {gears.map(g => (
              <BreakdownRow key={g.g} label={`${g.g} (${g.r}:1)`} value={`${fmt(inR/g.r, 0)} RPM out`} dot="bg-purple-400" />
            ))}
          </ResultPanel>
        )
      }
    />
  );
}

function EVRange() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("range");
  const [capacity, setCapacity] = useState("75");
  const [charge, setCharge] = useState("80"); const [efficiency, setEfficiency] = useState("15");
  const [driveMode, setDriveMode] = useState("mixed"); const [temp, setTemp] = useState("25");
  const [elRate, setElRate] = useState("8");

  const effByMode: Record<string, number> = { city:12, highway:18, mixed:15 };
  const tempFactor = (t: number) => t < 0 ? 0.65 : t < 10 ? 0.8 : t > 35 ? 0.9 : 1.0;
  const cap = parseFloat(capacity)||75; const chargeN = parseFloat(charge)||100;
  const eff = parseFloat(efficiency)||effByMode[driveMode]; const tempN = parseFloat(temp)||25;
  const usable = cap * (chargeN/100);
  const tf = tempFactor(tempN); const range = usable / (eff/100) * tf;
  const fullChargeCost = cap * (parseFloat(elRate)||0);
  const costPer100 = eff * (parseFloat(elRate)||0) / 100;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="EV Parameters" icon={Zap} iconColor="bg-green-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"range", label:"Estimate Range" }, { id:"cost", label:"Charging Cost" }]} active={mode} onChange={setMode} />
          <InputField label="Battery Capacity (kWh)" value={capacity} onChange={setCapacity} type="number" />
          <InputField label="Current Charge (%)" value={charge} onChange={setCharge} type="number" suffix="%" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Driving Mode</label>
            <div className="flex gap-1.5">
              {Object.keys(effByMode).map(m => (
                <button key={m} onClick={() => { setDriveMode(m); setEfficiency(String(effByMode[m])); }} data-testid={`drive-${m}`}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize ${driveMode === m ? "bg-green-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{m}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Usage (kWh/100km)" value={efficiency} onChange={setEfficiency} type="number" />
            <InputField label="Temperature (°C)" value={temp} onChange={setTemp} type="number" />
          </div>
          {mode === "cost" && <InputField label={`Electricity Rate (${cs(currency)}/kWh)`} value={elRate} onChange={setElRate} type="number" prefix={cs(currency)} />}
        </InputPanel>
      }
      results={
        <ResultPanel label="Estimated Range"
          primary={`${fmt(range, 0)} km`}
          primarySub={`${fmt(range*0.621371, 0)} mi`}
          summaries={<>
            <SummaryCard label="Usable Energy" value={`${fmt(usable, 1)} kWh`} accent="text-green-500" />
            {mode === "cost" ? <SummaryCard label="Full Charge Cost" value={`${cs(currency)}${fmt(fullChargeCost)}`} /> : <SummaryCard label="Temp Factor" value={`${fmt(tf*100, 0)}%`} />}
          </>}
          tip={`Temperature (${tempN}°C) affects range. Below 0°C you lose ~35% range.`}
        >
          <BreakdownRow label="Usable Energy" value={`${fmt(usable, 1)} kWh`} dot="bg-green-500" />
          <BreakdownRow label="Temperature Factor" value={`${fmt(tf*100, 0)}%`} dot="bg-blue-400" />
          <BreakdownRow label="Range (km)" value={`${fmt(range, 0)} km`} dot="bg-emerald-400" bold />
          <BreakdownRow label="Range (miles)" value={`${fmt(range*0.621371, 0)} mi`} dot="bg-purple-400" />
          {mode === "cost" && (
            <>
              <BreakdownRow label="Full Charge Cost" value={`${cs(currency)}${fmt(fullChargeCost)}`} dot="bg-amber-400" bold />
              <BreakdownRow label={`Cost per 100km`} value={`${cs(currency)}${fmt(costPer100, 1)}`} />
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

function Charging() {
  const [currency, setCurrency] = useState("INR");
  const [chargerType, setChargerType] = useState("level2_home");
  const [capacity, setCapacity] = useState("75");
  const [currentCharge, setCurrentCharge] = useState("20"); const [targetCharge, setTargetCharge] = useState("80");
  const [elRate, setElRate] = useState("8"); const [customPower, setCustomPower] = useState("11");

  const chargerPresets: Record<string, { power:number; label:string }> = {
    "2pin_home":{ power:1.8, label:"2-Pin Home (1.8kW)" },
    "level2_home":{ power:7.2, label:"Level 2 AC (7.2kW)" },
    "level2_public":{ power:22, label:"Public AC (22kW)" },
    "dc_fast_50":{ power:50, label:"DC Fast (50kW)" },
    "dc_fast_150":{ power:150, label:"DC Fast (150kW)" },
    "dc_ultra":{ power:350, label:"Ultra Fast (350kW)" },
    custom:{ power:parseFloat(customPower)||11, label:"Custom" },
  };
  const pwr = chargerPresets[chargerType].power;
  const cap = parseFloat(capacity)||75;
  const cur = parseFloat(currentCharge)||0; const tgt = parseFloat(targetCharge)||100;
  const energy = cap * ((tgt-cur)/100);
  const timeHrs = energy/pwr;
  const hrs = Math.floor(timeHrs); const mins = Math.round((timeHrs-hrs)*60);
  const cost = energy * (parseFloat(elRate)||0);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Charging Parameters" icon={Clock} iconColor="bg-blue-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Charger Type</label>
            <select value={chargerType} onChange={e => setChargerType(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
              {Object.entries(chargerPresets).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          {chargerType === "custom" && <InputField label="Charger Power (kW)" value={customPower} onChange={setCustomPower} type="number" />}
          <InputField label="Battery Capacity (kWh)" value={capacity} onChange={setCapacity} type="number" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Current Charge (%)" value={currentCharge} onChange={setCurrentCharge} type="number" suffix="%" />
            <InputField label="Target Charge (%)" value={targetCharge} onChange={setTargetCharge} type="number" suffix="%" />
          </div>
          <InputField label={`Electricity Rate (${cs(currency)}/kWh)`} value={elRate} onChange={setElRate} type="number" prefix={cs(currency)} />
        </InputPanel>
      }
      results={
        <ResultPanel label="Charging Time"
          primary={`${hrs}h ${mins}m`}
          summaries={<>
            <SummaryCard label="Energy to Add" value={`${fmt(energy, 1)} kWh`} accent="text-blue-500" />
            <SummaryCard label="Charging Cost" value={`${cs(currency)}${fmt(cost, 1)}`} />
          </>}
          tip="Charging speed slows above 80% to protect battery. Plan DC fast charging up to 80% for best speed."
        >
          <BreakdownRow label="Charger Power" value={`${pwr} kW`} dot="bg-blue-400" />
          <BreakdownRow label="Energy to Add" value={`${fmt(energy, 1)} kWh`} dot="bg-green-500" />
          <BreakdownRow label="Charging Time" value={`${hrs}h ${mins}m`} dot="bg-purple-400" bold />
          <BreakdownRow label="Charging Cost" value={`${cs(currency)}${fmt(cost, 1)}`} dot="bg-amber-400" bold />
        </ResultPanel>
      }
    />
  );
}

function Toll() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("distance");
  const [distance, setDistance] = useState("200"); const [distUnit, setDistUnit] = useState("km");
  const [ratePerKm, setRatePerKm] = useState("1.5"); const [vehicleType, setVehicleType] = useState("car");
  const [numTolls, setNumTolls] = useState("5"); const [ratePerToll, setRatePerToll] = useState("60");

  const muls: Record<string, { mul:number; label:string }> = {
    two_wheeler:{ mul:0.5, label:"2-Wheeler" }, car:{ mul:1, label:"Car/Jeep" },
    lcv:{ mul:1.5, label:"LCV" }, bus:{ mul:2.5, label:"Bus/Truck" }, hcv:{ mul:3.5, label:"HCV" },
  };
  const distKm = distUnit === "km" ? parseFloat(distance)||0 : (parseFloat(distance)||0)*1.60934;
  const mul = muls[vehicleType].mul;
  const total = mode === "distance" ? distKm * (parseFloat(ratePerKm)||0) * mul : (parseInt(numTolls)||0) * (parseFloat(ratePerToll)||0) * mul;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Toll Parameters" icon={DollarSign} iconColor="bg-amber-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"distance", label:"By Distance" }, { id:"manual", label:"Manual Tolls" }]} active={mode} onChange={setMode} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Vehicle Type</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(muls).map(([k,v]) => (
                <button key={k} onClick={() => setVehicleType(k)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${vehicleType === k ? "bg-amber-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{v.label}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Distance" value={distance} onChange={setDistance} type="number" />
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Unit</label>
              <div className="flex gap-1.5">
                {["km","miles"].map(u => <button key={u} onClick={() => setDistUnit(u)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${distUnit === u ? "bg-amber-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{u}</button>)}
              </div>
            </div>
          </div>
          {mode === "distance" ? <InputField label={`Toll Rate (${cs(currency)}/km)`} value={ratePerKm} onChange={setRatePerKm} type="number" /> :
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Number of Tolls" value={numTolls} onChange={setNumTolls} type="number" />
              <InputField label={`Rate per Toll`} value={ratePerToll} onChange={setRatePerToll} type="number" prefix={cs(currency)} />
            </div>
          }
        </InputPanel>
      }
      results={
        <ResultPanel label="Estimated Toll Cost"
          primary={`${cs(currency)}${fmt(total)}`}
          summaries={<>
            <SummaryCard label="Distance (km)" value={`${fmt(distKm)} km`} />
            <SummaryCard label="Vehicle Multiplier" value={`${mul}×`} accent="text-amber-500" />
          </>}
        >
          <BreakdownRow label="Distance" value={`${fmt(distKm)} km / ${fmt(distKm/1.60934, 0)} mi`} dot="bg-blue-400" />
          <BreakdownRow label="Vehicle Type" value={muls[vehicleType].label} dot="bg-amber-400" />
          <BreakdownRow label="Multiplier" value={`${mul}×`} dot="bg-purple-400" />
          {mode === "distance" && <BreakdownRow label="Rate per km" value={`${cs(currency)}${ratePerKm}`} dot="bg-green-500" />}
          {mode === "manual" && <BreakdownRow label="Toll Booths" value={`${numTolls} × ${cs(currency)}${ratePerToll}`} dot="bg-green-500" />}
          <BreakdownRow label="Total Toll" value={`${cs(currency)}${fmt(total)}`} bold />
        </ResultPanel>
      }
    />
  );
}

function Depreciation() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("reducing");
  const [purchasePrice, setPurchasePrice] = useState("1200000");
  const [age, setAge] = useState("3"); const [deprRate, setDeprRate] = useState("15");
  const [residual, setResidual] = useState("200000"); const [usefulLife, setUsefulLife] = useState("10");

  const price = parseFloat(purchasePrice)||0; const years = parseInt(age)||0;
  const rate = parseFloat(deprRate)||15;
  const resid = parseFloat(residual)||0; const life = parseInt(usefulLife)||10;
  const reducingVal = price * Math.pow(1-rate/100, years);
  const slDepr = life > 0 ? (price-resid)/life : 0;
  const slVal = Math.max(resid, price - slDepr*years);
  const curVal = mode === "reducing" ? reducingVal : slVal;
  const lost = price - curVal; const pctLost = price > 0 ? (lost/price)*100 : 0;
  const yearByYear = Array.from({ length: Math.min(years+1, 6) }, (_, i) => ({
    y: i+1,
    v: mode === "reducing" ? price*Math.pow(1-rate/100, i+1) : Math.max(resid, price-slDepr*(i+1)),
  }));

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Vehicle Details" icon={TrendingDown} iconColor="bg-red-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"reducing", label:"Reducing Balance" }, { id:"straight", label:"Straight Line" }]} active={mode} onChange={setMode} />
          <InputField label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} type="number" prefix={cs(currency)} />
          <InputField label="Current Age (years)" value={age} onChange={setAge} type="number" />
          {mode === "reducing" ? <InputField label="Annual Depreciation Rate (%)" value={deprRate} onChange={setDeprRate} type="number" suffix="%" /> :
            <div className="grid grid-cols-2 gap-3">
              <InputField label={`Residual Value`} value={residual} onChange={setResidual} type="number" />
              <InputField label="Useful Life (yrs)" value={usefulLife} onChange={setUsefulLife} type="number" />
            </div>
          }
        </InputPanel>
      }
      results={
        <ResultPanel label="Current Market Value"
          primary={`${cs(currency)}${fmt(curVal, 0)}`}
          summaries={<>
            <SummaryCard label="Value Lost" value={`${cs(currency)}${fmt(lost, 0)}`} accent="text-red-500" />
            <SummaryCard label="Lost %" value={`${fmt(pctLost, 1)}%`} />
          </>}
          tip={`${mode === "reducing" ? `Reducing balance: ${deprRate}% depreciation each year.` : `Straight line: ${cs(currency)}${fmt(slDepr, 0)}/year.`}`}
        >
          <BreakdownRow label="Purchase Price" value={`${cs(currency)}${fmt(price, 0)}`} dot="bg-blue-400" />
          <BreakdownRow label="After Depreciation" value={`${cs(currency)}${fmt(curVal, 0)}`} dot="bg-green-500" bold />
          <BreakdownRow label="Total Lost" value={`${cs(currency)}${fmt(lost, 0)}`} dot="bg-red-400" />
          <BreakdownRow label="Lost %" value={`${fmt(pctLost, 1)}%`} dot="bg-purple-400" />
          {yearByYear.map(({ y, v }) => <BreakdownRow key={y} label={`Year ${y}`} value={`${cs(currency)}${fmt(v, 0)}`} />)}
        </ResultPanel>
      }
    />
  );
}

function Insurance() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("premium");
  const [carValue, setCarValue] = useState("1200000");
  const [driverAge, setDriverAge] = useState("30"); const [ncb, setNcb] = useState("3");
  const [coverType, setCoverType] = useState("comprehensive"); const [cc, setCC] = useState("1500");
  const [addons, setAddons] = useState<string[]>([]);

  const toggleAddon = (a: string) => setAddons(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  const addonCosts: Record<string, number> = { "Zero Dep":0.008, "Engine Protect":0.005, "RTI":0.012, "Roadside Assist":500, "NCB Protect":0.006 };
  const value = parseFloat(carValue)||0; const age = parseInt(driverAge)||30; const ncbN = Math.min(parseInt(ncb)||0, 5);
  const ccN = parseInt(cc)||1500;
  const baseRate = coverType === "comprehensive" ? (ccN <= 1000 ? 0.032 : ccN <= 1500 ? 0.035 : 0.04) : 0.02;
  const ageMul = age < 25 ? 1.5 : age > 65 ? 1.3 : 1;
  const ncbDiscount = [0, 0.2, 0.25, 0.35, 0.45, 0.5][ncbN];
  const basePremium = value * baseRate * ageMul;
  const discountAmt = basePremium * ncbDiscount;
  const addonTotal = addons.reduce((sum, a) => sum + (addonCosts[a] < 1 ? value*addonCosts[a] : addonCosts[a]), 0);
  const finalPremium = basePremium - discountAmt + addonTotal;
  const ncbTiers = [{ y:0, d:0 },{ y:1, d:20 },{ y:2, d:25 },{ y:3, d:35 },{ y:4, d:45 },{ y:5, d:50 }];

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Vehicle & Policy Details" icon={Shield} iconColor="bg-blue-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"premium", label:"Premium Calc" }, { id:"ncb", label:"NCB Table" }]} active={mode} onChange={setMode} />
          <InputField label="Vehicle Value / IDV" value={carValue} onChange={setCarValue} type="number" prefix={cs(currency)} />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Engine (cc)" value={cc} onChange={setCC} type="number" />
            <InputField label="Driver Age" value={driverAge} onChange={setDriverAge} type="number" />
          </div>
          <InputField label="Claim-Free Years (NCB)" value={ncb} onChange={setNcb} type="number" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Coverage</label>
            <div className="flex gap-1.5">
              {[{ k:"comprehensive", l:"Comprehensive" },{ k:"thirdparty", l:"Third Party" }].map(c => (
                <button key={c.k} onClick={() => setCoverType(c.k)} className={`flex-1 py-2 rounded-lg text-xs font-bold ${coverType === c.k ? "bg-blue-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{c.l}</button>
              ))}
            </div>
          </div>
          {mode === "premium" && (
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Add-Ons</label>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(addonCosts).map(a => (
                  <button key={a} onClick={() => toggleAddon(a)} className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${addons.includes(a) ? "bg-blue-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{a}</button>
                ))}
              </div>
            </div>
          )}
        </InputPanel>
      }
      results={
        mode === "premium" ? (
          <ResultPanel label="Annual Premium"
            primary={`${cs(currency)}${fmt(finalPremium, 0)}`}
            summaries={<>
              <SummaryCard label="NCB Discount" value={`${ncbDiscount*100}%`} accent="text-green-500" />
              <SummaryCard label="Monthly" value={`${cs(currency)}${fmt(finalPremium/12, 0)}`} />
            </>}
            tip="NCB (No Claim Bonus) gives up to 50% discount for 5 consecutive claim-free years."
          >
            <BreakdownRow label="Base Premium" value={`${cs(currency)}${fmt(basePremium, 0)}`} dot="bg-blue-400" />
            <BreakdownRow label={`NCB Discount (${ncbDiscount*100}%)`} value={`-${cs(currency)}${fmt(discountAmt, 0)}`} dot="bg-green-500" />
            {addons.length > 0 && <BreakdownRow label="Add-Ons" value={`+${cs(currency)}${fmt(addonTotal, 0)}`} dot="bg-amber-400" />}
            <BreakdownRow label="Annual Premium" value={`${cs(currency)}${fmt(finalPremium, 0)}`} bold />
            <BreakdownRow label="Monthly (approx)" value={`${cs(currency)}${fmt(finalPremium/12, 0)}`} />
          </ResultPanel>
        ) : (
          <ResultPanel label="NCB Discount Table" primary={`${ncbTiers[ncbN].d}%`} primarySub="your NCB">
            {ncbTiers.map(t => (
              <BreakdownRow key={t.y} label={`${t.y} claim-free year${t.y !== 1 ? "s" : ""}`} value={`${t.d}%`} dot={t.y === ncbN ? "bg-green-500" : "bg-muted"} bold={t.y === ncbN} />
            ))}
          </ResultPanel>
        )
      }
    />
  );
}
