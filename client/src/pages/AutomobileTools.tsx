import { useState } from "react";
import { motion } from "framer-motion";
import { Car, Fuel, Gauge, Settings, Zap, Clock, DollarSign, TrendingDown, Shield } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "mileage" | "tyre" | "rpm" | "gear" | "evrange" | "charging" | "toll" | "depreciation" | "insurance";

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
    <PageWrapper
      title="Automobile Tools"
      subtitle="Vehicle calculators"
      accentColor="bg-slate-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
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
  const [distance, setDistance] = useState("500");
  const [mileage, setMileage] = useState("15");
  const [fuelPrice, setFuelPrice] = useState("3.50");

  const d = parseFloat(distance) || 0;
  const m = parseFloat(mileage) || 1;
  const p = parseFloat(fuelPrice) || 0;

  const fuelNeeded = d / m;
  const totalCost = fuelNeeded * p;
  const costPerKm = d > 0 ? totalCost / d : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Mileage Cost" icon={Fuel} iconColor="bg-orange-500">
        <div className="space-y-4">
          <InputField label="Distance (km)" value={distance} onChange={setDistance} type="number" />
          <InputField label="Mileage (km/L)" value={mileage} onChange={setMileage} type="number" />
          <InputField label="Fuel Price ($/L)" value={fuelPrice} onChange={setFuelPrice} type="number" step={0.01} />
        </div>
      </ToolCard>

      <ToolCard title="Cost Estimate" icon={DollarSign} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Fuel Needed" value={`${fuelNeeded.toFixed(2)} L`} />
          <ResultDisplay label="Total Cost" value={`$${totalCost.toFixed(2)}`} highlight color="text-orange-400" />
          <ResultDisplay label="Cost per km" value={`$${costPerKm.toFixed(3)}`} />
        </div>
      </ToolCard>
    </div>
  );
}

function TyreSizeConverter() {
  const [width, setWidth] = useState("225");
  const [aspect, setAspect] = useState("45");
  const [rim, setRim] = useState("17");

  const w = parseFloat(width) || 225;
  const a = parseFloat(aspect) || 45;
  const r = parseFloat(rim) || 17;

  const sidewall = w * (a / 100);
  const diameterMm = sidewall * 2 + r * 25.4;
  const diameterInch = diameterMm / 25.4;
  const circumference = Math.PI * diameterMm;
  const revsPerKm = 1000000 / circumference;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Tyre Size Converter" icon={Settings} iconColor="bg-gray-500">
        <div className="space-y-4">
          <InputField label="Width (mm)" value={width} onChange={setWidth} type="number" />
          <InputField label="Aspect Ratio (%)" value={aspect} onChange={setAspect} type="number" />
          <InputField label="Rim Diameter (inches)" value={rim} onChange={setRim} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Tyre Specs" icon={Car} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Sidewall Height" value={`${sidewall.toFixed(1)} mm`} />
          <ResultDisplay label="Overall Diameter" value={`${diameterInch.toFixed(1)} in (${diameterMm.toFixed(0)} mm)`} highlight />
          <ResultDisplay label="Circumference" value={`${(circumference / 1000).toFixed(2)} m`} />
          <ResultDisplay label="Revs per km" value={Math.round(revsPerKm).toLocaleString()} />
        </div>
      </ToolCard>
    </div>
  );
}

function RPMSpeedCalculator() {
  const [mode, setMode] = useState<"speed" | "rpm">("speed");
  const [rpm, setRpm] = useState("3000");
  const [speed, setSpeed] = useState("100");
  const [gearRatio, setGearRatio] = useState("3.5");
  const [finalDrive, setFinalDrive] = useState("3.73");
  const [tyreDiameter, setTyreDiameter] = useState("26");

  const r = parseFloat(rpm) || 0;
  const s = parseFloat(speed) || 0;
  const gr = parseFloat(gearRatio) || 1;
  const fd = parseFloat(finalDrive) || 1;
  const td = parseFloat(tyreDiameter) || 26;

  const circumference = Math.PI * td * 0.0254;

  const calculateSpeed = () => {
    return (r * circumference * 60) / (gr * fd * 1000);
  };

  const calculateRPM = () => {
    return (s * gr * fd * 1000) / (circumference * 60);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="RPM / Speed Calculator" icon={Gauge} iconColor="bg-red-500">
        <div className="space-y-4">
          <div className="flex gap-2">
            {["speed", "rpm"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as any)}
                className={`flex-1 py-2 rounded-lg text-sm uppercase ${
                  mode === m ? "bg-red-500 text-white" : "bg-muted text-muted-foreground"
                }`}
                data-testid={`button-calc-${m}`}
              >
                Calculate {m}
              </button>
            ))}
          </div>
          {mode === "speed" && <InputField label="Engine RPM" value={rpm} onChange={setRpm} type="number" />}
          {mode === "rpm" && <InputField label="Speed (km/h)" value={speed} onChange={setSpeed} type="number" />}
          <InputField label="Gear Ratio" value={gearRatio} onChange={setGearRatio} type="number" step={0.1} />
          <InputField label="Final Drive Ratio" value={finalDrive} onChange={setFinalDrive} type="number" step={0.01} />
          <InputField label="Tyre Diameter (inches)" value={tyreDiameter} onChange={setTyreDiameter} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Result" icon={Car} iconColor="bg-emerald-500">
        <div className="text-center py-6">
          <div className="text-4xl font-bold text-red-400 mb-2">
            {mode === "speed" ? `${calculateSpeed().toFixed(1)} km/h` : `${Math.round(calculateRPM())} RPM`}
          </div>
          <p className="text-muted-foreground">{mode === "speed" ? "Vehicle Speed" : "Engine RPM"}</p>
        </div>
      </ToolCard>
    </div>
  );
}

function GearRatioCalculator() {
  const [drivingTeeth, setDrivingTeeth] = useState("15");
  const [drivenTeeth, setDrivenTeeth] = useState("45");

  const driving = parseInt(drivingTeeth) || 1;
  const driven = parseInt(drivenTeeth) || 1;

  const ratio = driven / driving;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Gear Ratio" icon={Settings} iconColor="bg-purple-500">
        <div className="space-y-4">
          <InputField label="Driving Gear Teeth" value={drivingTeeth} onChange={setDrivingTeeth} type="number" />
          <InputField label="Driven Gear Teeth" value={drivenTeeth} onChange={setDrivenTeeth} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Ratio" icon={Gauge} iconColor="bg-emerald-500">
        <div className="text-center py-6">
          <div className="text-4xl font-bold text-purple-400 mb-2">{ratio.toFixed(2)}:1</div>
          <p className="text-muted-foreground">Gear Ratio</p>
          <p className="text-sm text-muted-foreground mt-2">
            {ratio > 1 ? "Torque multiplication" : "Speed multiplication"}
          </p>
        </div>
      </ToolCard>
    </div>
  );
}

function EVRangeEstimator() {
  const [batteryCapacity, setBatteryCapacity] = useState("75");
  const [efficiency, setEfficiency] = useState("15");
  const [currentCharge, setCurrentCharge] = useState("80");

  const capacity = parseFloat(batteryCapacity) || 75;
  const eff = parseFloat(efficiency) || 15;
  const charge = parseFloat(currentCharge) || 100;

  const usableEnergy = capacity * (charge / 100);
  const estimatedRange = usableEnergy / (eff / 100);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="EV Range Estimator" icon={Zap} iconColor="bg-green-500">
        <div className="space-y-4">
          <InputField label="Battery Capacity (kWh)" value={batteryCapacity} onChange={setBatteryCapacity} type="number" />
          <InputField label="Energy Usage (kWh/100km)" value={efficiency} onChange={setEfficiency} type="number" />
          <InputField label="Current Charge (%)" value={currentCharge} onChange={setCurrentCharge} type="number" max={100} />
        </div>
      </ToolCard>

      <ToolCard title="Range Estimate" icon={Car} iconColor="bg-emerald-500">
        <div className="text-center py-6">
          <div className="text-4xl font-bold text-green-400 mb-2">{estimatedRange.toFixed(0)} km</div>
          <p className="text-muted-foreground">Estimated Range</p>
          <p className="text-sm text-muted-foreground mt-2">Based on {usableEnergy.toFixed(1)} kWh usable</p>
        </div>
      </ToolCard>
    </div>
  );
}

function ChargingTimeCalculator() {
  const [batteryCapacity, setBatteryCapacity] = useState("75");
  const [currentCharge, setCurrentCharge] = useState("20");
  const [targetCharge, setTargetCharge] = useState("80");
  const [chargerPower, setChargerPower] = useState("11");

  const capacity = parseFloat(batteryCapacity) || 75;
  const current = parseFloat(currentCharge) || 0;
  const target = parseFloat(targetCharge) || 100;
  const power = parseFloat(chargerPower) || 11;

  const energyNeeded = capacity * ((target - current) / 100);
  const chargingTime = energyNeeded / power;
  const hours = Math.floor(chargingTime);
  const minutes = Math.round((chargingTime - hours) * 60);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Charging Time" icon={Clock} iconColor="bg-blue-500">
        <div className="space-y-4">
          <InputField label="Battery Capacity (kWh)" value={batteryCapacity} onChange={setBatteryCapacity} type="number" />
          <InputField label="Current Charge (%)" value={currentCharge} onChange={setCurrentCharge} type="number" max={100} />
          <InputField label="Target Charge (%)" value={targetCharge} onChange={setTargetCharge} type="number" max={100} />
          <InputField label="Charger Power (kW)" value={chargerPower} onChange={setChargerPower} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Time Estimate" icon={Zap} iconColor="bg-emerald-500">
        <div className="text-center py-6">
          <div className="text-4xl font-bold text-blue-400 mb-2">{hours}h {minutes}m</div>
          <p className="text-muted-foreground">Charging Time</p>
          <p className="text-sm text-muted-foreground mt-2">To add {energyNeeded.toFixed(1)} kWh</p>
        </div>
      </ToolCard>
    </div>
  );
}

function TollCostEstimator() {
  const [distance, setDistance] = useState("200");
  const [ratePerKm, setRatePerKm] = useState("0.15");
  const [vehicleType, setVehicleType] = useState("car");

  const d = parseFloat(distance) || 0;
  const rate = parseFloat(ratePerKm) || 0;

  const multipliers = { car: 1, suv: 1.5, truck: 2.5, bus: 3 };
  const multiplier = multipliers[vehicleType as keyof typeof multipliers];
  const tollCost = d * rate * multiplier;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Toll Cost Estimator" icon={DollarSign} iconColor="bg-amber-500">
        <div className="space-y-4">
          <InputField label="Distance (km)" value={distance} onChange={setDistance} type="number" />
          <InputField label="Base Rate ($/km)" value={ratePerKm} onChange={setRatePerKm} type="number" step={0.01} />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Vehicle Type</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(multipliers).map((v) => (
                <button
                  key={v}
                  onClick={() => setVehicleType(v)}
                  className={`p-2 rounded-lg text-sm capitalize ${
                    vehicleType === v ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                  }`}
                  data-testid={`button-vehicle-${v}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Toll Estimate" icon={Car} iconColor="bg-emerald-500">
        <div className="text-center py-6">
          <div className="text-4xl font-bold text-amber-400 mb-2">${tollCost.toFixed(2)}</div>
          <p className="text-muted-foreground">Estimated Toll</p>
        </div>
      </ToolCard>
    </div>
  );
}

function DepreciationCalculator() {
  const [purchasePrice, setPurchasePrice] = useState("30000");
  const [age, setAge] = useState("3");
  const [deprecationRate, setDeprecationRate] = useState("15");

  const price = parseFloat(purchasePrice) || 0;
  const years = parseInt(age) || 0;
  const rate = parseFloat(deprecationRate) || 15;

  const currentValue = price * Math.pow(1 - rate / 100, years);
  const totalDepreciation = price - currentValue;
  const percentLost = price > 0 ? (totalDepreciation / price) * 100 : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Car Depreciation" icon={TrendingDown} iconColor="bg-red-500">
        <div className="space-y-4">
          <InputField label="Purchase Price ($)" value={purchasePrice} onChange={setPurchasePrice} type="number" />
          <InputField label="Age (years)" value={age} onChange={setAge} type="number" />
          <InputField label="Annual Depreciation (%)" value={deprecationRate} onChange={setDeprecationRate} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Current Value" icon={DollarSign} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Current Value" value={`$${currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} highlight color="text-emerald-400" />
          <ResultDisplay label="Value Lost" value={`$${totalDepreciation.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="text-red-400" />
          <ResultDisplay label="Percent Lost" value={`${percentLost.toFixed(1)}%`} />
        </div>
      </ToolCard>
    </div>
  );
}

function InsuranceEstimator() {
  const [carValue, setCarValue] = useState("25000");
  const [age, setAge] = useState("30");
  const [yearsNoClaim, setYearsNoClaim] = useState("3");
  const [coverType, setCoverType] = useState("comprehensive");

  const value = parseFloat(carValue) || 25000;
  const driverAge = parseInt(age) || 30;
  const ncb = parseInt(yearsNoClaim) || 0;

  const baseRate = coverType === "comprehensive" ? 0.04 : 0.025;
  const ageMultiplier = driverAge < 25 ? 1.5 : driverAge > 65 ? 1.3 : 1;
  const ncbDiscount = Math.min(ncb * 5, 25) / 100;

  const basePremium = value * baseRate * ageMultiplier;
  const discount = basePremium * ncbDiscount;
  const finalPremium = basePremium - discount;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Insurance Estimator" icon={Shield} iconColor="bg-blue-500">
        <div className="space-y-4">
          <InputField label="Car Value ($)" value={carValue} onChange={setCarValue} type="number" />
          <InputField label="Driver Age" value={age} onChange={setAge} type="number" />
          <InputField label="Years No Claim" value={yearsNoClaim} onChange={setYearsNoClaim} type="number" />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Coverage Type</label>
            <div className="flex gap-2">
              {["comprehensive", "thirdparty"].map((c) => (
                <button
                  key={c}
                  onClick={() => setCoverType(c)}
                  className={`flex-1 py-2 rounded-lg text-sm capitalize ${
                    coverType === c ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"
                  }`}
                  data-testid={`button-cover-${c}`}
                >
                  {c === "thirdparty" ? "Third Party" : c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Premium Estimate" icon={DollarSign} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Base Premium" value={`$${basePremium.toFixed(0)}`} />
          <ResultDisplay label="NCB Discount" value={`-$${discount.toFixed(0)}`} color="text-green-400" />
          <ResultDisplay label="Annual Premium" value={`$${finalPremium.toFixed(0)}`} highlight color="text-blue-400" />
        </div>
      </ToolCard>
    </div>
  );
}
