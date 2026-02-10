import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Car, Fuel, Shirt, Footprints, Calculator } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

const tools = [
  { id: "fuel", label: "Fuel Cost", icon: Fuel },
  { id: "flight", label: "Flight Time", icon: Plane },
  { id: "mileage", label: "Mileage", icon: Car },
  { id: "clothing", label: "Clothing Size", icon: Shirt },
  { id: "shoe", label: "Shoe Size", icon: Footprints },
];

export default function TravelTools() {
  const [activeTool, setActiveTool] = useState("fuel");

  return (
    <PageWrapper
      title="Travel Tools"
      subtitle="Trip planning and size converters"
      accentColor="bg-sky-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id)}
    >
      {activeTool === "fuel" && <FuelCostCalculator />}
      {activeTool === "flight" && <FlightTimeEstimator />}
      {activeTool === "mileage" && <MileageCalculator />}
      {activeTool === "clothing" && <ClothingSizeConverter />}
      {activeTool === "shoe" && <ShoeSizeConverter />}
    </PageWrapper>
  );
}

function FuelCostCalculator() {
  const [distance, setDistance] = useState("500");
  const [mileage, setMileage] = useState("12");
  const [price, setPrice] = useState("1.50");

  const d = parseFloat(distance) || 0;
  const m = parseFloat(mileage) || 1;
  const p = parseFloat(price) || 0;

  const fuelNeeded = d / m;
  const totalCost = fuelNeeded * p;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Fuel Cost Calculator" icon={Fuel} iconColor="bg-orange-500">
        <div className="space-y-4">
          <InputField label="Distance" value={distance} onChange={setDistance} type="number" suffix="km" />
          <InputField label="Mileage" value={mileage} onChange={setMileage} type="number" suffix="km/L" />
          <InputField label="Fuel Price" value={price} onChange={setPrice} type="number" suffix="$/L" />
        </div>
      </ToolCard>

      <ToolCard title="Trip Cost" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Fuel Needed" value={`${fuelNeeded.toFixed(1)} liters`} />
          <ResultDisplay label="Total Cost" value={`$${totalCost.toFixed(2)}`} highlight color="text-orange-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function FlightTimeEstimator() {
  const [distance, setDistance] = useState("5000");
  const [speed, setSpeed] = useState("850");

  const d = parseFloat(distance) || 0;
  const s = parseFloat(speed) || 850;
  const hours = d / s;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Flight Time Estimator" icon={Plane} iconColor="bg-sky-500">
        <div className="space-y-4">
          <InputField label="Distance" value={distance} onChange={setDistance} type="number" suffix="km" />
          <InputField label="Average Speed" value={speed} onChange={setSpeed} type="number" suffix="km/h" />
        </div>
      </ToolCard>

      <ToolCard title="Estimated Flight Time" icon={Calculator} iconColor="bg-emerald-500">
        <div className="text-center py-4">
          <p className="text-4xl font-bold text-sky-400">{h}h {m}m</p>
          <p className="text-muted-foreground mt-2">Direct flight time</p>
        </div>
      </ToolCard>
    </div>
  );
}

function MileageCalculator() {
  const [distance, setDistance] = useState("450");
  const [fuel, setFuel] = useState("35");

  const d = parseFloat(distance) || 0;
  const f = parseFloat(fuel) || 1;
  const kmpl = d / f;
  const mpg = kmpl * 2.352;
  const l100km = (f / d) * 100;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Mileage Calculator" icon={Car} iconColor="bg-green-500">
        <div className="space-y-4">
          <InputField label="Distance Traveled" value={distance} onChange={setDistance} type="number" suffix="km" />
          <InputField label="Fuel Used" value={fuel} onChange={setFuel} type="number" suffix="liters" />
        </div>
      </ToolCard>

      <ToolCard title="Fuel Efficiency" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Kilometers per Liter" value={`${kmpl.toFixed(2)} km/L`} highlight color="text-green-400" />
          <ResultDisplay label="Miles per Gallon (US)" value={`${mpg.toFixed(2)} mpg`} color="text-blue-400" />
          <ResultDisplay label="Liters per 100km" value={`${l100km.toFixed(2)} L/100km`} />
        </div>
      </ToolCard>
    </div>
  );
}

function ClothingSizeConverter() {
  const [usSize, setUsSize] = useState("M");

  const sizeChart: Record<string, { uk: string; eu: string; india: string }> = {
    XS: { uk: "6", eu: "32-34", india: "XS" },
    S: { uk: "8-10", eu: "36-38", india: "S" },
    M: { uk: "12-14", eu: "40-42", india: "M" },
    L: { uk: "16-18", eu: "44-46", india: "L" },
    XL: { uk: "20-22", eu: "48-50", india: "XL" },
    XXL: { uk: "24-26", eu: "52-54", india: "XXL" },
  };

  const converted = sizeChart[usSize] || { uk: "-", eu: "-", india: "-" };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Clothing Size Converter" icon={Shirt} iconColor="bg-purple-500">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">US Size</label>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(sizeChart).map((size) => (
                <button
                  key={size}
                  onClick={() => setUsSize(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    usSize === size
                      ? "bg-purple-500 text-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  data-testid={`button-size-${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Converted Sizes" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="UK Size" value={converted.uk} />
          <ResultDisplay label="EU Size" value={converted.eu} highlight color="text-purple-400" />
          <ResultDisplay label="India Size" value={converted.india} />
        </div>
      </ToolCard>
    </div>
  );
}

function ShoeSizeConverter() {
  const [usSize, setUsSize] = useState("9");

  const us = parseFloat(usSize) || 9;
  const uk = us - 0.5;
  const eu = us + 33;
  const cm = (us + 18) * 0.846667;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Shoe Size Converter" icon={Footprints} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <InputField label="US Size (Men's)" value={usSize} onChange={setUsSize} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Converted Sizes" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="UK Size" value={uk.toFixed(1)} />
          <ResultDisplay label="EU Size" value={eu.toFixed(0)} highlight color="text-indigo-400" />
          <ResultDisplay label="CM" value={`${cm.toFixed(1)} cm`} />
        </div>
      </ToolCard>
    </div>
  );
}
