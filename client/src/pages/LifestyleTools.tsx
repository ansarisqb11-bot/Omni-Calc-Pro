import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Zap, Battery, Sun, Droplets, Cloud, ShoppingCart, Wifi, Smartphone } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "gas" | "ac" | "inverter" | "solar" | "tank" | "rainwater" | "expense" | "grocery" | "data" | "battery";

export default function LifestyleTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("gas");

  const tools = [
    { id: "gas", label: "Gas Usage", icon: Zap },
    { id: "ac", label: "AC Power", icon: Home },
    { id: "inverter", label: "Inverter", icon: Battery },
    { id: "solar", label: "Solar", icon: Sun },
    { id: "tank", label: "Tank Vol", icon: Droplets },
    { id: "rainwater", label: "Rainwater", icon: Cloud },
    { id: "expense", label: "Expense", icon: ShoppingCart },
    { id: "data", label: "Data Usage", icon: Wifi },
    { id: "battery", label: "Battery", icon: Smartphone },
  ];

  return (
    <PageWrapper
      title="Home & Lifestyle"
      subtitle="Utility and home calculators"
      accentColor="bg-lime-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
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
  const [cylinderSize, setCylinderSize] = useState("14.2");
  const [dailyUsage, setDailyUsage] = useState("0.5");
  const [gasPrice, setGasPrice] = useState("1100");

  const size = parseFloat(cylinderSize) || 14.2;
  const daily = parseFloat(dailyUsage) || 0.5;
  const price = parseFloat(gasPrice) || 1100;

  const daysRemaining = daily > 0 ? size / daily : 0;
  const monthlyUsage = daily * 30;
  const cylindersPerMonth = monthlyUsage / size;
  const monthlyCost = cylindersPerMonth * price;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Gas Cylinder Usage" icon={Zap} iconColor="bg-orange-500">
        <div className="space-y-4">
          <InputField label="Cylinder Size (kg)" value={cylinderSize} onChange={setCylinderSize} type="number" />
          <InputField label="Daily Usage (kg)" value={dailyUsage} onChange={setDailyUsage} type="number" step={0.1} />
          <InputField label="Cylinder Price" value={gasPrice} onChange={setGasPrice} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Estimate" icon={Home} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Days per Cylinder" value={`${daysRemaining.toFixed(0)} days`} highlight color="text-orange-400" />
          <ResultDisplay label="Cylinders per Month" value={cylindersPerMonth.toFixed(2)} />
          <ResultDisplay label="Monthly Cost" value={`$${monthlyCost.toFixed(0)}`} color="text-emerald-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function ACPowerConsumption() {
  const [tons, setTons] = useState("1.5");
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [daysPerMonth, setDaysPerMonth] = useState("30");
  const [ratePerUnit, setRatePerUnit] = useState("0.12");

  const t = parseFloat(tons) || 1.5;
  const h = parseFloat(hoursPerDay) || 8;
  const d = parseFloat(daysPerMonth) || 30;
  const rate = parseFloat(ratePerUnit) || 0.12;

  const wattsPerTon = 1200;
  const dailyKwh = (t * wattsPerTon * h) / 1000;
  const monthlyKwh = dailyKwh * d;
  const monthlyCost = monthlyKwh * rate;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="AC Power Consumption" icon={Home} iconColor="bg-blue-500">
        <div className="space-y-4">
          <InputField label="AC Capacity (Tons)" value={tons} onChange={setTons} type="number" step={0.5} />
          <InputField label="Hours per Day" value={hoursPerDay} onChange={setHoursPerDay} type="number" />
          <InputField label="Days per Month" value={daysPerMonth} onChange={setDaysPerMonth} type="number" />
          <InputField label="Rate per kWh ($)" value={ratePerUnit} onChange={setRatePerUnit} type="number" step={0.01} />
        </div>
      </ToolCard>

      <ToolCard title="Consumption" icon={Zap} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Daily Usage" value={`${dailyKwh.toFixed(2)} kWh`} />
          <ResultDisplay label="Monthly Usage" value={`${monthlyKwh.toFixed(0)} kWh`} color="text-blue-400" />
          <ResultDisplay label="Monthly Cost" value={`$${monthlyCost.toFixed(2)}`} highlight color="text-emerald-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function InverterCalculator() {
  const [batteryAh, setBatteryAh] = useState("150");
  const [batteryVolt, setBatteryVolt] = useState("12");
  const [loadWatts, setLoadWatts] = useState("300");

  const ah = parseFloat(batteryAh) || 150;
  const v = parseFloat(batteryVolt) || 12;
  const load = parseFloat(loadWatts) || 300;

  const totalWh = ah * v;
  const usableWh = totalWh * 0.8;
  const backupHours = load > 0 ? usableWh / load : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Inverter Backup" icon={Battery} iconColor="bg-yellow-500">
        <div className="space-y-4">
          <InputField label="Battery Capacity (Ah)" value={batteryAh} onChange={setBatteryAh} type="number" />
          <InputField label="Battery Voltage (V)" value={batteryVolt} onChange={setBatteryVolt} type="number" />
          <InputField label="Load (Watts)" value={loadWatts} onChange={setLoadWatts} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Backup Time" icon={Zap} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Battery Capacity" value={`${totalWh.toFixed(0)} Wh`} />
          <ResultDisplay label="Usable (80%)" value={`${usableWh.toFixed(0)} Wh`} />
          <ResultDisplay label="Backup Time" value={`${backupHours.toFixed(1)} hours`} highlight color="text-yellow-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function SolarPanelCalculator() {
  const [dailyUsage, setDailyUsage] = useState("10");
  const [sunHours, setSunHours] = useState("5");
  const [panelWatts, setPanelWatts] = useState("400");

  const usage = parseFloat(dailyUsage) || 10;
  const hours = parseFloat(sunHours) || 5;
  const panel = parseFloat(panelWatts) || 400;

  const systemSize = usage / hours;
  const panelsNeeded = Math.ceil((systemSize * 1000) / panel);
  const yearlyGeneration = systemSize * hours * 365;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Solar Panel Size" icon={Sun} iconColor="bg-amber-500">
        <div className="space-y-4">
          <InputField label="Daily Usage (kWh)" value={dailyUsage} onChange={setDailyUsage} type="number" />
          <InputField label="Peak Sun Hours" value={sunHours} onChange={setSunHours} type="number" />
          <InputField label="Panel Wattage" value={panelWatts} onChange={setPanelWatts} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="System Size" icon={Zap} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Required System" value={`${systemSize.toFixed(2)} kW`} highlight color="text-amber-400" />
          <ResultDisplay label="Panels Needed" value={`${panelsNeeded} panels`} color="text-blue-400" />
          <ResultDisplay label="Yearly Generation" value={`${yearlyGeneration.toFixed(0)} kWh`} />
        </div>
      </ToolCard>
    </div>
  );
}

function WaterTankVolume() {
  const [shape, setShape] = useState<"rectangular" | "cylindrical">("rectangular");
  const [length, setLength] = useState("2");
  const [width, setWidth] = useState("1.5");
  const [height, setHeight] = useState("1");
  const [diameter, setDiameter] = useState("1.5");

  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  const d = parseFloat(diameter) || 0;

  const volume = shape === "rectangular" 
    ? l * w * h * 1000 
    : Math.PI * Math.pow(d / 2, 2) * h * 1000;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Water Tank Volume" icon={Droplets} iconColor="bg-cyan-500">
        <div className="space-y-4">
          <div className="flex gap-2">
            {["rectangular", "cylindrical"].map((s) => (
              <button
                key={s}
                onClick={() => setShape(s as any)}
                className={`flex-1 py-2 rounded-lg text-sm capitalize ${
                  shape === s ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"
                }`}
                data-testid={`button-shape-${s}`}
              >
                {s}
              </button>
            ))}
          </div>
          {shape === "rectangular" ? (
            <>
              <InputField label="Length (m)" value={length} onChange={setLength} type="number" />
              <InputField label="Width (m)" value={width} onChange={setWidth} type="number" />
            </>
          ) : (
            <InputField label="Diameter (m)" value={diameter} onChange={setDiameter} type="number" />
          )}
          <InputField label="Height (m)" value={height} onChange={setHeight} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Capacity" icon={Home} iconColor="bg-emerald-500">
        <div className="text-center py-6">
          <div className="text-4xl font-bold text-cyan-400 mb-2">{volume.toFixed(0)} L</div>
          <p className="text-muted-foreground">{(volume / 1000).toFixed(2)} m³</p>
        </div>
      </ToolCard>
    </div>
  );
}

function RainwaterHarvest() {
  const [roofArea, setRoofArea] = useState("100");
  const [annualRainfall, setAnnualRainfall] = useState("1000");
  const [efficiency, setEfficiency] = useState("80");

  const area = parseFloat(roofArea) || 100;
  const rainfall = parseFloat(annualRainfall) || 1000;
  const eff = parseFloat(efficiency) || 80;

  const totalHarvest = area * (rainfall / 1000) * (eff / 100) * 1000;
  const monthlyAverage = totalHarvest / 12;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Rainwater Harvest" icon={Cloud} iconColor="bg-blue-500">
        <div className="space-y-4">
          <InputField label="Roof Area (sq.m)" value={roofArea} onChange={setRoofArea} type="number" />
          <InputField label="Annual Rainfall (mm)" value={annualRainfall} onChange={setAnnualRainfall} type="number" />
          <InputField label="Collection Efficiency (%)" value={efficiency} onChange={setEfficiency} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Harvest Potential" icon={Droplets} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Annual Harvest" value={`${totalHarvest.toLocaleString()} L`} highlight color="text-blue-400" />
          <ResultDisplay label="Monthly Average" value={`${monthlyAverage.toFixed(0)} L`} />
          <ResultDisplay label="Cubic Meters" value={`${(totalHarvest / 1000).toFixed(1)} m³`} />
        </div>
      </ToolCard>
    </div>
  );
}

function ExpenseSplitter() {
  const [totalAmount, setTotalAmount] = useState("500");
  const [people, setPeople] = useState("4");
  const [tipPercent, setTipPercent] = useState("15");

  const total = parseFloat(totalAmount) || 0;
  const numPeople = parseInt(people) || 1;
  const tip = parseFloat(tipPercent) || 0;

  const tipAmount = total * (tip / 100);
  const grandTotal = total + tipAmount;
  const perPerson = grandTotal / numPeople;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Expense Splitter" icon={ShoppingCart} iconColor="bg-purple-500">
        <div className="space-y-4">
          <InputField label="Total Amount ($)" value={totalAmount} onChange={setTotalAmount} type="number" />
          <InputField label="Number of People" value={people} onChange={setPeople} type="number" />
          <InputField label="Tip (%)" value={tipPercent} onChange={setTipPercent} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Split" icon={Home} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Tip Amount" value={`$${tipAmount.toFixed(2)}`} />
          <ResultDisplay label="Grand Total" value={`$${grandTotal.toFixed(2)}`} />
          <ResultDisplay label="Per Person" value={`$${perPerson.toFixed(2)}`} highlight color="text-purple-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function DataUsageEstimator() {
  const [videoHours, setVideoHours] = useState("2");
  const [musicHours, setMusicHours] = useState("3");
  const [browsingHours, setBrowsingHours] = useState("2");
  const [videoQuality, setVideoQuality] = useState("hd");

  const qualities = { sd: 0.7, hd: 3, fhd: 7, "4k": 15 };
  const musicGbPerHour = 0.15;
  const browsingGbPerHour = 0.06;

  const video = parseFloat(videoHours) || 0;
  const music = parseFloat(musicHours) || 0;
  const browsing = parseFloat(browsingHours) || 0;

  const dailyVideo = video * qualities[videoQuality as keyof typeof qualities];
  const dailyMusic = music * musicGbPerHour;
  const dailyBrowsing = browsing * browsingGbPerHour;
  const dailyTotal = dailyVideo + dailyMusic + dailyBrowsing;
  const monthlyTotal = dailyTotal * 30;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Data Usage" icon={Wifi} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <InputField label="Video Streaming (hrs/day)" value={videoHours} onChange={setVideoHours} type="number" />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Video Quality</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(qualities).map((q) => (
                <button
                  key={q}
                  onClick={() => setVideoQuality(q)}
                  className={`p-2 rounded-lg text-sm uppercase ${
                    videoQuality === q ? "bg-indigo-500 text-white" : "bg-muted text-muted-foreground"
                  }`}
                  data-testid={`button-quality-${q}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <InputField label="Music Streaming (hrs/day)" value={musicHours} onChange={setMusicHours} type="number" />
          <InputField label="Web Browsing (hrs/day)" value={browsingHours} onChange={setBrowsingHours} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Usage Estimate" icon={Home} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Daily Usage" value={`${dailyTotal.toFixed(2)} GB`} color="text-indigo-400" />
          <ResultDisplay label="Monthly Usage" value={`${monthlyTotal.toFixed(0)} GB`} highlight color="text-emerald-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function BatteryHealthEstimator() {
  const [originalCapacity, setOriginalCapacity] = useState("4000");
  const [currentCapacity, setCurrentCapacity] = useState("3600");
  const [cycleCount, setCycleCount] = useState("350");

  const original = parseFloat(originalCapacity) || 4000;
  const current = parseFloat(currentCapacity) || 3600;
  const cycles = parseInt(cycleCount) || 0;

  const healthPercent = (current / original) * 100;
  const estimatedCyclesRemaining = Math.max(0, 500 - cycles);
  const status = healthPercent >= 80 ? "Good" : healthPercent >= 60 ? "Fair" : "Poor";

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Battery Health" icon={Smartphone} iconColor="bg-green-500">
        <div className="space-y-4">
          <InputField label="Original Capacity (mAh)" value={originalCapacity} onChange={setOriginalCapacity} type="number" />
          <InputField label="Current Capacity (mAh)" value={currentCapacity} onChange={setCurrentCapacity} type="number" />
          <InputField label="Charge Cycles" value={cycleCount} onChange={setCycleCount} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Health Status" icon={Battery} iconColor="bg-emerald-500">
        <div className="text-center py-4 mb-4">
          <div className={`text-4xl font-bold mb-2 ${healthPercent >= 80 ? "text-green-400" : healthPercent >= 60 ? "text-yellow-400" : "text-red-400"}`}>
            {healthPercent.toFixed(1)}%
          </div>
          <p className={`${healthPercent >= 80 ? "text-green-400" : healthPercent >= 60 ? "text-yellow-400" : "text-red-400"}`}>
            {status} Condition
          </p>
        </div>
        <div className="space-y-3">
          <ResultDisplay label="Capacity Lost" value={`${(100 - healthPercent).toFixed(1)}%`} />
          <ResultDisplay label="Est. Cycles Remaining" value={`~${estimatedCyclesRemaining}`} />
        </div>
      </ToolCard>
    </div>
  );
}
