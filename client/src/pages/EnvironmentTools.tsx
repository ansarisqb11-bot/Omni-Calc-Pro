import { useState } from "react";
import { Globe, MapPin, Wind, Thermometer, Leaf, Cloud, Mountain } from "lucide-react";
import { DesktopToolGrid, InputPanel, InputField, ResultDisplay } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "distance" | "scale" | "windchill" | "heatindex" | "carbon" | "aqi" | "altitude";

export default function EnvironmentTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("distance");

  const tools = [
    { id: "distance", label: "Earth Dist", icon: Globe },
    { id: "scale", label: "Map Scale", icon: MapPin },
    { id: "windchill", label: "Wind Chill", icon: Wind },
    { id: "heatindex", label: "Heat Index", icon: Thermometer },
    { id: "carbon", label: "Carbon", icon: Leaf },
    { id: "aqi", label: "AQI", icon: Cloud },
    { id: "altitude", label: "Altitude", icon: Mountain },
  ];

  return (
    <PageWrapper
      title="Environment Tools"
      subtitle="Geography and nature calculators"
      accentColor="bg-emerald-600"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "distance" && <EarthDistanceCalculator />}
      {activeTool === "scale" && <MapScaleConverter />}
      {activeTool === "windchill" && <WindChillCalculator />}
      {activeTool === "heatindex" && <HeatIndexCalculator />}
      {activeTool === "carbon" && <CarbonFootprint />}
      {activeTool === "aqi" && <AQIExplainer />}
      {activeTool === "altitude" && <AltitudeOxygen />}
    </PageWrapper>
  );
}

function EarthDistanceCalculator() {
  const [lat1, setLat1] = useState("40.7128");
  const [lon1, setLon1] = useState("-74.0060");
  const [lat2, setLat2] = useState("51.5074");
  const [lon2, setLon2] = useState("-0.1278");

  const toRad = (deg: number) => deg * (Math.PI / 180);
  const calculateDistance = () => {
    const R = 6371;
    const dLat = toRad(parseFloat(lat2) - parseFloat(lat1));
    const dLon = toRad(parseFloat(lon2) - parseFloat(lon1));
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(parseFloat(lat1))) * Math.cos(toRad(parseFloat(lat2))) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const distance = calculateDistance();
  const miles = distance * 0.621371;
  const flightHours = distance / 850;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Earth Distance" icon={Globe} iconColor="bg-blue-500">
          <p className="text-sm text-muted-foreground">Point 1 (e.g., New York)</p>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Latitude" value={lat1} onChange={setLat1} type="number" step={0.0001} />
            <InputField label="Longitude" value={lon1} onChange={setLon1} type="number" step={0.0001} />
          </div>
          <p className="text-sm text-muted-foreground">Point 2 (e.g., London)</p>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Latitude" value={lat2} onChange={setLat2} type="number" step={0.0001} />
            <InputField label="Longitude" value={lon2} onChange={setLon2} type="number" step={0.0001} />
          </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Distance</p>
          <ResultDisplay label="Kilometers" value={`${distance.toFixed(1)} km`} highlight color="text-blue-400" />
          <ResultDisplay label="Miles" value={`${miles.toFixed(1)} mi`} />
          <ResultDisplay label="Est. Flight Time" value={`~${flightHours.toFixed(1)} hours`} />
        </div>
      }
    />
  );
}

function MapScaleConverter() {
  const [mapDistance, setMapDistance] = useState("5");
  const [scale, setScale] = useState("50000");
  const [unit, setUnit] = useState("cm");

  const map = parseFloat(mapDistance) || 0;
  const s = parseFloat(scale) || 1;
  const multipliers = { cm: 100000, mm: 1000000, inch: 63360 };
  const mult = multipliers[unit as keyof typeof multipliers];
  const realDistance = (map * s) / mult;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Map Scale Converter" icon={MapPin} iconColor="bg-amber-500">
          <InputField label="Map Distance" value={mapDistance} onChange={setMapDistance} type="number" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Unit</label>
            <div className="flex gap-2">
              {["cm", "mm", "inch"].map((u) => (
                <button key={u} onClick={() => setUnit(u)}
                  className={`flex-1 py-2 rounded-lg text-sm ${unit === u ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-unit-${u}`}>
                  {u}
                </button>
              ))}
            </div>
          </div>
          <InputField label="Map Scale (1:)" value={scale} onChange={setScale} type="number" />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Real Distance</p>
          <div className="text-center py-6">
            <div className="text-4xl font-bold text-amber-400 mb-2">{realDistance.toFixed(2)} km</div>
            <p className="text-muted-foreground">{(realDistance * 1000).toFixed(0)} meters</p>
          </div>
        </div>
      }
    />
  );
}

function WindChillCalculator() {
  const [temp, setTemp] = useState("0");
  const [windSpeed, setWindSpeed] = useState("20");
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");

  const t = parseFloat(temp) || 0;
  const v = parseFloat(windSpeed) || 0;
  const tempC = tempUnit === "F" ? (t - 32) * 5 / 9 : t;
  const windChill = 13.12 + 0.6215 * tempC - 11.37 * Math.pow(v, 0.16) + 0.3965 * tempC * Math.pow(v, 0.16);
  const feelsLike = tempUnit === "F" ? windChill * 9 / 5 + 32 : windChill;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Wind Chill Calculator" icon={Wind} iconColor="bg-cyan-500">
          <div className="flex gap-2">
            {(["C", "F"] as const).map((u) => (
              <button key={u} onClick={() => setTempUnit(u)}
                className={`flex-1 py-2 rounded-lg text-sm ${tempUnit === u ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"}`}
                data-testid={`button-temp-${u}`}>
                {u === "C" ? "Celsius" : "Fahrenheit"}
              </button>
            ))}
          </div>
          <InputField label={`Temperature (${tempUnit})`} value={temp} onChange={setTemp} type="number" />
          <InputField label="Wind Speed (km/h)" value={windSpeed} onChange={setWindSpeed} type="number" />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Wind Chill</p>
          <div className="text-center py-6">
            <div className="text-4xl font-bold text-cyan-400 mb-2">{feelsLike.toFixed(1)}{tempUnit}</div>
            <p className="text-muted-foreground">Feels Like</p>
            {feelsLike < -27 && <p className="text-red-400 text-sm mt-2">Warning: Frostbite danger!</p>}
          </div>
        </div>
      }
    />
  );
}

function HeatIndexCalculator() {
  const [temp, setTemp] = useState("35");
  const [humidity, setHumidity] = useState("60");
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");

  const t = parseFloat(temp) || 0;
  const h = parseFloat(humidity) || 0;
  const tempF = tempUnit === "C" ? t * 9 / 5 + 32 : t;
  const hi = -42.379 + 2.04901523 * tempF + 10.14333127 * h
    - 0.22475541 * tempF * h - 0.00683783 * tempF * tempF
    - 0.05481717 * h * h + 0.00122874 * tempF * tempF * h
    + 0.00085282 * tempF * h * h - 0.00000199 * tempF * tempF * h * h;
  const heatIndex = tempUnit === "C" ? (hi - 32) * 5 / 9 : hi;

  const getWarning = (hi: number) => {
    const hiF = tempUnit === "C" ? hi * 9 / 5 + 32 : hi;
    if (hiF >= 130) return { level: "Extreme Danger", color: "text-red-600" };
    if (hiF >= 105) return { level: "Danger", color: "text-red-500" };
    if (hiF >= 90) return { level: "Extreme Caution", color: "text-orange-400" };
    if (hiF >= 80) return { level: "Caution", color: "text-yellow-400" };
    return { level: "Safe", color: "text-green-400" };
  };
  const warning = getWarning(heatIndex);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Heat Index Calculator" icon={Thermometer} iconColor="bg-orange-500">
          <div className="flex gap-2">
            {(["C", "F"] as const).map((u) => (
              <button key={u} onClick={() => setTempUnit(u)}
                className={`flex-1 py-2 rounded-lg text-sm ${tempUnit === u ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"}`}
                data-testid={`button-temp-${u}`}>
                {u === "C" ? "Celsius" : "Fahrenheit"}
              </button>
            ))}
          </div>
          <InputField label={`Temperature (${tempUnit})`} value={temp} onChange={setTemp} type="number" />
          <InputField label="Humidity (%)" value={humidity} onChange={setHumidity} type="number" />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Heat Index</p>
          <div className="text-center py-6">
            <div className="text-4xl font-bold text-orange-400 mb-2">{heatIndex.toFixed(1)}{tempUnit}</div>
            <p className={`font-medium ${warning.color}`}>{warning.level}</p>
          </div>
        </div>
      }
    />
  );
}

function CarbonFootprint() {
  const [carKm, setCarKm] = useState("50");
  const [electricity, setElectricity] = useState("300");
  const [flights, setFlights] = useState("2");

  const car = parseFloat(carKm) || 0;
  const elec = parseFloat(electricity) || 0;
  const fly = parseInt(flights) || 0;
  const carCO2 = car * 30 * 0.21;
  const elecCO2 = elec * 12 * 0.5;
  const flightCO2 = fly * 1000;
  const totalCO2 = carCO2 + elecCO2 + flightCO2;
  const trees = totalCO2 / 21;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Carbon Footprint" icon={Leaf} iconColor="bg-green-500">
          <InputField label="Daily Car Travel (km)" value={carKm} onChange={setCarKm} type="number" />
          <InputField label="Monthly Electricity (kWh)" value={electricity} onChange={setElectricity} type="number" />
          <InputField label="Flights per Year" value={flights} onChange={setFlights} type="number" />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Annual CO2 Emissions</p>
          <div className="text-center py-4 mb-2">
            <div className="text-4xl font-bold text-green-400 mb-1">{(totalCO2 / 1000).toFixed(2)}</div>
            <p className="text-muted-foreground text-sm">Tonnes CO2 per year</p>
          </div>
          <ResultDisplay label="Driving" value={`${(carCO2 / 1000).toFixed(2)} t`} />
          <ResultDisplay label="Electricity" value={`${(elecCO2 / 1000).toFixed(2)} t`} />
          <ResultDisplay label="Flights" value={`${(flightCO2 / 1000).toFixed(2)} t`} />
          <ResultDisplay label="Trees to Offset" value={`${Math.ceil(trees)} trees`} color="text-green-400" />
        </div>
      }
    />
  );
}

function AQIExplainer() {
  const [aqi, setAqi] = useState("75");

  const aqiVal = parseInt(aqi) || 0;
  const getAQIInfo = (val: number) => {
    if (val <= 50) return { level: "Good", color: "text-green-400", desc: "Air quality is satisfactory." };
    if (val <= 100) return { level: "Moderate", color: "text-yellow-400", desc: "Acceptable; may be a concern for sensitive groups." };
    if (val <= 150) return { level: "Unhealthy for Sensitive", color: "text-orange-400", desc: "Sensitive groups may experience effects." };
    if (val <= 200) return { level: "Unhealthy", color: "text-red-400", desc: "Everyone may experience health effects." };
    if (val <= 300) return { level: "Very Unhealthy", color: "text-purple-400", desc: "Health alert: serious effects possible." };
    return { level: "Hazardous", color: "text-red-600", desc: "Emergency conditions." };
  };
  const info = getAQIInfo(aqiVal);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="AQI Explainer" icon={Cloud} iconColor="bg-sky-500">
          <InputField label="AQI Value" value={aqi} onChange={setAqi} type="number" min={0} max={500} />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Air Quality</p>
          <div className="text-center py-4 mb-4">
            <div className={`text-4xl font-bold mb-2 ${info.color}`}>{aqiVal}</div>
            <p className={`font-medium ${info.color}`}>{info.level}</p>
            <p className="text-muted-foreground text-sm mt-2">{info.desc}</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs p-1"><span className="text-green-400">0–50</span><span>Good</span></div>
            <div className="flex justify-between text-xs p-1"><span className="text-yellow-400">51–100</span><span>Moderate</span></div>
            <div className="flex justify-between text-xs p-1"><span className="text-orange-400">101–150</span><span>Unhealthy (Sensitive)</span></div>
            <div className="flex justify-between text-xs p-1"><span className="text-red-400">151–200</span><span>Unhealthy</span></div>
            <div className="flex justify-between text-xs p-1"><span className="text-purple-400">201–300</span><span>Very Unhealthy</span></div>
            <div className="flex justify-between text-xs p-1"><span className="text-red-600">301+</span><span>Hazardous</span></div>
          </div>
        </div>
      }
    />
  );
}

function AltitudeOxygen() {
  const [altitude, setAltitude] = useState("3000");
  const [unit, setUnit] = useState<"m" | "ft">("m");

  const alt = parseFloat(altitude) || 0;
  const altMeters = unit === "ft" ? alt * 0.3048 : alt;
  const seaLevelO2 = 20.9;
  const pressure = 101325 * Math.pow(1 - 2.25577e-5 * altMeters, 5.25588);
  const effectiveO2 = seaLevelO2 * (pressure / 101325);
  const spo2Estimate = Math.max(70, 98 - (altMeters / 500));

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Altitude vs Oxygen" icon={Mountain} iconColor="bg-indigo-500">
          <div className="flex gap-2">
            {(["m", "ft"] as const).map((u) => (
              <button key={u} onClick={() => setUnit(u)}
                className={`flex-1 py-2 rounded-lg text-sm ${unit === u ? "bg-indigo-500 text-white" : "bg-muted text-muted-foreground"}`}
                data-testid={`button-alt-${u}`}>
                {u === "m" ? "Meters" : "Feet"}
              </button>
            ))}
          </div>
          <InputField label={`Altitude (${unit})`} value={altitude} onChange={setAltitude} type="number" />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Oxygen Levels</p>
          <ResultDisplay label="Altitude" value={`${altMeters.toFixed(0)} m / ${(altMeters / 0.3048).toFixed(0)} ft`} />
          <ResultDisplay label="Air Pressure" value={`${(pressure / 1000).toFixed(1)} kPa`} />
          <ResultDisplay label="Effective O2" value={`${effectiveO2.toFixed(1)}%`} highlight color="text-indigo-400" />
          <ResultDisplay label="Est. SpO2" value={`~${spo2Estimate.toFixed(0)}%`} color={spo2Estimate < 90 ? "text-red-400" : "text-green-400"} />
          {altMeters > 2500 && (
            <p className="text-yellow-400 text-xs mt-3">Warning: Risk of altitude sickness above 2500m</p>
          )}
        </div>
      }
    />
  );
}
