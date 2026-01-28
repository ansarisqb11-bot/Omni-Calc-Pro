import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Wheat, Droplets, MapPin, Fuel, Calculator, DollarSign } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "yield" | "seed" | "fertilizer" | "land" | "irrigation" | "tractor" | "profit";

export default function AgricultureTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("yield");

  const tools = [
    { id: "yield", label: "Crop Yield", icon: Wheat },
    { id: "seed", label: "Seed Rate", icon: Leaf },
    { id: "fertilizer", label: "Fertilizer", icon: Droplets },
    { id: "land", label: "Land Area", icon: MapPin },
    { id: "irrigation", label: "Irrigation", icon: Droplets },
    { id: "tractor", label: "Tractor Fuel", icon: Fuel },
    { id: "profit", label: "Farm Profit", icon: DollarSign },
  ];

  return (
    <PageWrapper
      title="Agriculture Tools"
      subtitle="Farm and land calculators"
      accentColor="bg-green-600"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "yield" && <CropYieldEstimator />}
      {activeTool === "seed" && <SeedRateCalculator />}
      {activeTool === "fertilizer" && <FertilizerDosage />}
      {activeTool === "land" && <LandAreaConverter />}
      {activeTool === "irrigation" && <IrrigationWater />}
      {activeTool === "tractor" && <TractorFuel />}
      {activeTool === "profit" && <FarmProfit />}
    </PageWrapper>
  );
}

function CropYieldEstimator() {
  const [area, setArea] = useState("10");
  const [expectedYield, setExpectedYield] = useState("4");
  const [pricePerUnit, setPricePerUnit] = useState("250");

  const a = parseFloat(area) || 0;
  const y = parseFloat(expectedYield) || 0;
  const p = parseFloat(pricePerUnit) || 0;

  const totalYield = a * y;
  const revenue = totalYield * p;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Crop Yield Estimator" icon={Wheat} iconColor="bg-amber-500">
        <div className="space-y-4">
          <InputField label="Land Area (acres)" value={area} onChange={setArea} type="number" />
          <InputField label="Expected Yield (tons/acre)" value={expectedYield} onChange={setExpectedYield} type="number" step={0.1} />
          <InputField label="Price per Ton ($)" value={pricePerUnit} onChange={setPricePerUnit} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Estimate" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Total Yield" value={`${totalYield.toFixed(1)} tons`} highlight color="text-amber-400" />
          <ResultDisplay label="Expected Revenue" value={`$${revenue.toLocaleString()}`} color="text-emerald-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function SeedRateCalculator() {
  const [area, setArea] = useState("5");
  const [seedRate, setSeedRate] = useState("25");
  const [seedPrice, setSeedPrice] = useState("50");

  const a = parseFloat(area) || 0;
  const rate = parseFloat(seedRate) || 0;
  const price = parseFloat(seedPrice) || 0;

  const totalSeed = a * rate;
  const totalCost = totalSeed * price;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Seed Rate Calculator" icon={Leaf} iconColor="bg-green-500">
        <div className="space-y-4">
          <InputField label="Land Area (acres)" value={area} onChange={setArea} type="number" />
          <InputField label="Seed Rate (kg/acre)" value={seedRate} onChange={setSeedRate} type="number" />
          <InputField label="Seed Price ($/kg)" value={seedPrice} onChange={setSeedPrice} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Seed Requirement" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Total Seed Needed" value={`${totalSeed.toFixed(1)} kg`} highlight color="text-green-400" />
          <ResultDisplay label="Total Cost" value={`$${totalCost.toFixed(0)}`} />
        </div>
      </ToolCard>
    </div>
  );
}

function FertilizerDosage() {
  const [area, setArea] = useState("5");
  const [nRequired, setNRequired] = useState("120");
  const [fertilizerN, setFertilizerN] = useState("46");

  const a = parseFloat(area) || 0;
  const nReq = parseFloat(nRequired) || 0;
  const fertN = parseFloat(fertilizerN) || 1;

  const totalN = a * nReq;
  const fertilizerNeeded = totalN / (fertN / 100);
  const bags = fertilizerNeeded / 50;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Fertilizer Dosage" icon={Droplets} iconColor="bg-blue-500">
        <div className="space-y-4">
          <InputField label="Land Area (acres)" value={area} onChange={setArea} type="number" />
          <InputField label="N Required (kg/acre)" value={nRequired} onChange={setNRequired} type="number" />
          <InputField label="Fertilizer N Content (%)" value={fertilizerN} onChange={setFertilizerN} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Fertilizer Needed" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Total Fertilizer" value={`${fertilizerNeeded.toFixed(1)} kg`} highlight color="text-blue-400" />
          <ResultDisplay label="Bags (50kg)" value={`${bags.toFixed(1)} bags`} />
        </div>
      </ToolCard>
    </div>
  );
}

function LandAreaConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("acre");

  const conversions: Record<string, number> = {
    // Global Units (Acre as base)
    acre: 1,
    hectare: 2.47105,
    sqft: 0.0000229568,
    sqm: 0.000247105,
    sqyard: 0.000206612,
    sqmile: 640,
    sqkm: 247.105,
    
    // Indian Units
    bigha: 0.625, // Varies by region, but 1.6 bigha per acre is common in many parts
    biswa: 0.03125, // 1/20 of a Bigha
    gunta: 0.025, // 40 gunta = 1 acre
    cent: 0.01, // 100 cents = 1 acre
    marla: 0.00625, // 160 marla = 1 acre
    kanal: 0.125, // 8 kanal = 1 acre
  };

  const val = parseFloat(value) || 0;
  const inAcres = val * conversions[fromUnit];

  const categories = [
    {
      label: "Global Units",
      units: ["acre", "hectare", "sqft", "sqm", "sqyard", "sqmile", "sqkm"]
    },
    {
      label: "Indian Units",
      units: ["bigha", "biswa", "gunta", "cent", "marla", "kanal"]
    }
  ];

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Land Area Converter" icon={MapPin} iconColor="bg-amber-600">
        <div className="space-y-4">
          <InputField label="Value" value={value} onChange={setValue} type="number" />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">From Unit</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {categories.map((cat) => (
                <optgroup key={cat.label} label={cat.label}>
                  {cat.units.map((u) => (
                    <option key={u} value={u} className="capitalize">{u}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Conversions" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.label} className="space-y-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">{cat.label}</div>
              <div className="grid grid-cols-1 gap-1">
                {cat.units.filter(u => u !== fromUnit).map((unit) => (
                  <div key={unit} className="flex justify-between items-center p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                    <span className="capitalize text-sm font-medium text-muted-foreground">{unit}</span>
                    <span className="font-mono text-sm font-bold text-amber-400">
                      {(inAcres / conversions[unit]).toLocaleString(undefined, { 
                        maximumFractionDigits: unit === "sqft" || unit === "sqm" ? 0 : 4 
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ToolCard>
    </div>
  );
}

function IrrigationWater() {
  const [area, setArea] = useState("5");
  const [cropWater, setCropWater] = useState("500");
  const [efficiency, setEfficiency] = useState("70");

  const a = parseFloat(area) || 0;
  const water = parseFloat(cropWater) || 0;
  const eff = parseFloat(efficiency) || 70;

  const totalWater = a * water;
  const actualWater = totalWater / (eff / 100);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Irrigation Water" icon={Droplets} iconColor="bg-cyan-500">
        <div className="space-y-4">
          <InputField label="Land Area (acres)" value={area} onChange={setArea} type="number" />
          <InputField label="Crop Water Need (mm/season)" value={cropWater} onChange={setCropWater} type="number" />
          <InputField label="Irrigation Efficiency (%)" value={efficiency} onChange={setEfficiency} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Water Requirement" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Crop Water Need" value={`${totalWater.toFixed(0)} mm`} />
          <ResultDisplay label="Actual Water Needed" value={`${actualWater.toFixed(0)} mm`} highlight color="text-cyan-400" />
          <ResultDisplay label="In Liters" value={`${(actualWater * a * 4046.86).toLocaleString()} L`} />
        </div>
      </ToolCard>
    </div>
  );
}

function TractorFuel() {
  const [hours, setHours] = useState("8");
  const [fuelRate, setFuelRate] = useState("8");
  const [fuelPrice, setFuelPrice] = useState("1.20");

  const h = parseFloat(hours) || 0;
  const rate = parseFloat(fuelRate) || 0;
  const price = parseFloat(fuelPrice) || 0;

  const fuelUsed = h * rate;
  const dailyCost = fuelUsed * price;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Tractor Fuel Consumption" icon={Fuel} iconColor="bg-orange-500">
        <div className="space-y-4">
          <InputField label="Operating Hours" value={hours} onChange={setHours} type="number" />
          <InputField label="Fuel Rate (L/hour)" value={fuelRate} onChange={setFuelRate} type="number" />
          <InputField label="Fuel Price ($/L)" value={fuelPrice} onChange={setFuelPrice} type="number" step={0.01} />
        </div>
      </ToolCard>

      <ToolCard title="Fuel Cost" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Fuel Used" value={`${fuelUsed.toFixed(1)} L`} />
          <ResultDisplay label="Daily Cost" value={`$${dailyCost.toFixed(2)}`} highlight color="text-orange-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function FarmProfit() {
  const [revenue, setRevenue] = useState("50000");
  const [seedCost, setSeedCost] = useState("5000");
  const [fertilizerCost, setFertilizerCost] = useState("8000");
  const [laborCost, setLaborCost] = useState("10000");
  const [otherCost, setOtherCost] = useState("5000");

  const rev = parseFloat(revenue) || 0;
  const seed = parseFloat(seedCost) || 0;
  const fert = parseFloat(fertilizerCost) || 0;
  const labor = parseFloat(laborCost) || 0;
  const other = parseFloat(otherCost) || 0;

  const totalCost = seed + fert + labor + other;
  const profit = rev - totalCost;
  const margin = rev > 0 ? (profit / rev) * 100 : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Farm Profit Calculator" icon={DollarSign} iconColor="bg-emerald-500">
        <div className="space-y-4">
          <InputField label="Total Revenue ($)" value={revenue} onChange={setRevenue} type="number" />
          <InputField label="Seed Cost ($)" value={seedCost} onChange={setSeedCost} type="number" />
          <InputField label="Fertilizer Cost ($)" value={fertilizerCost} onChange={setFertilizerCost} type="number" />
          <InputField label="Labor Cost ($)" value={laborCost} onChange={setLaborCost} type="number" />
          <InputField label="Other Costs ($)" value={otherCost} onChange={setOtherCost} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Profit Analysis" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Total Costs" value={`$${totalCost.toLocaleString()}`} />
          <ResultDisplay label="Net Profit" value={`$${profit.toLocaleString()}`} highlight color={profit >= 0 ? "text-emerald-400" : "text-red-400"} />
          <ResultDisplay label="Profit Margin" value={`${margin.toFixed(1)}%`} />
        </div>
      </ToolCard>
    </div>
  );
}
