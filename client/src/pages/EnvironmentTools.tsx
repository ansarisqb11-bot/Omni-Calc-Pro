import { useState } from "react";
import { Globe, MapPin, Wind, Thermometer, Leaf, Cloud, Mountain } from "lucide-react";
import { DesktopToolGrid, InputPanel, InputField, ResultPanel, SummaryCard, BreakdownRow } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "distance" | "scale" | "windchill" | "heatindex" | "carbon" | "aqi" | "altitude";

const fmt = (n: number, d = 2) => (isFinite(n) && !isNaN(n) ? parseFloat(n.toFixed(d)).toLocaleString() : "—");

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

// ─── 1. Earth Distance Calculator ─────────────────────────────────────────────
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
  const nauticalMiles = distance * 0.539957;

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
        <ResultPanel
          label="Great-Circle Distance"
          primary={`${fmt(distance, 1)} km`}
          summaries={<>
            <SummaryCard label="In Miles" value={`${fmt(miles, 1)} mi`} accent="text-emerald-500" />
            <SummaryCard label="Est. Flight Time" value={`~${fmt(flightHours, 1)} hrs`} />
          </>}
          tip={`Uses the Haversine formula on Earth's radius (6,371 km). Actual routes may differ due to airspace restrictions.`}
        >
          <BreakdownRow label="Nautical Miles" value={`${fmt(nauticalMiles, 1)} nmi`} />
          <BreakdownRow label="Flight Distance (@ 850 km/h)" value={`${fmt(flightHours, 2)} hours`} />
          <BreakdownRow label="Point 1" value={`${lat1}°N, ${lon1}°E`} />
          <BreakdownRow label="Point 2" value={`${lat2}°N, ${lon2}°E`} />
        </ResultPanel>
      }
    />
  );
}

// ─── 2. Map Scale Converter ────────────────────────────────────────────────────
function MapScaleConverter() {
  const [mapDistance, setMapDistance] = useState("5");
  const [scale, setScale] = useState("50000");
  const [unit, setUnit] = useState("cm");

  const map = parseFloat(mapDistance) || 0;
  const s = parseFloat(scale) || 1;
  const multipliers = { cm: 100000, mm: 1000000, inch: 63360 };
  const mult = multipliers[unit as keyof typeof multipliers];
  const realDistance = (map * s) / mult;
  const realMeters = realDistance * 1000;

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
        <ResultPanel
          label="Real-World Distance"
          primary={`${fmt(realDistance, 3)} km`}
          summaries={<>
            <SummaryCard label="Map Measurement" value={`${mapDistance} ${unit}`} accent="text-emerald-500" />
            <SummaryCard label="Scale Ratio" value={`1 : ${parseInt(scale).toLocaleString()}`} />
          </>}
          tip={`Real distance = map distance × scale ratio. At 1:50,000, 1 cm on map = 500 meters in reality.`}
        >
          <BreakdownRow label="In Meters" value={`${fmt(realMeters, 0)} m`} />
          <BreakdownRow label="In Miles" value={`${fmt(realDistance * 0.621371, 3)} mi`} />
          <BreakdownRow label="In Feet" value={`${fmt(realDistance * 3280.84, 0)} ft`} />
        </ResultPanel>
      }
    />
  );
}

// ─── 3. Wind Chill Calculator ──────────────────────────────────────────────────
function WindChillCalculator() {
  const [temp, setTemp] = useState("0");
  const [windSpeed, setWindSpeed] = useState("20");
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");

  const t = parseFloat(temp) || 0;
  const v = parseFloat(windSpeed) || 0;
  const tempC = tempUnit === "F" ? (t - 32) * 5 / 9 : t;
  const windChill = 13.12 + 0.6215 * tempC - 11.37 * Math.pow(v, 0.16) + 0.3965 * tempC * Math.pow(v, 0.16);
  const feelsLike = tempUnit === "F" ? windChill * 9 / 5 + 32 : windChill;
  const danger = feelsLike < -27 ? "Frostbite Danger" : feelsLike < -10 ? "Very Cold" : feelsLike < 0 ? "Cold" : "Manageable";
  const dangerColor = feelsLike < -27 ? "text-red-400" : feelsLike < -10 ? "text-orange-400" : feelsLike < 0 ? "text-yellow-400" : "text-emerald-400";
  const tempOpposite = tempUnit === "C" ? feelsLike * 9 / 5 + 32 : (feelsLike - 32) * 5 / 9;
  const oppositeUnit = tempUnit === "C" ? "F" : "C";

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
          <InputField label={`Air Temperature (°${tempUnit})`} value={temp} onChange={setTemp} type="number" />
          <InputField label="Wind Speed (km/h)" value={windSpeed} onChange={setWindSpeed} type="number" />
        </InputPanel>
      }
      results={
        <ResultPanel
          label="Feels Like Temperature"
          primary={`${fmt(feelsLike, 1)}°${tempUnit}`}
          summaries={<>
            <SummaryCard label="Actual Temp" value={`${temp}°${tempUnit}`} accent="text-emerald-500" />
            <SummaryCard label="Wind Speed" value={`${windSpeed} km/h`} />
          </>}
          tip={`Wind chill only applies below 10°C with wind > 4.8 km/h. Higher winds strip body heat faster.`}
        >
          <BreakdownRow label={`Feels Like (°${oppositeUnit})`} value={`${fmt(tempOpposite, 1)}°${oppositeUnit}`} />
          <BreakdownRow label="Risk Level" value={<span className={dangerColor}>{danger}</span>} />
          <BreakdownRow label="Formula" value="Environment Canada / NWS standard" />
        </ResultPanel>
      }
    />
  );
}

// ─── 4. Heat Index Calculator ──────────────────────────────────────────────────
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
  const heatIndexF = tempUnit === "C" ? hi : heatIndex;
  const oppositeUnit = tempUnit === "C" ? "F" : "C";
  const heatIndexOpposite = tempUnit === "C" ? hi : (hi - 32) * 5 / 9;

  const getWarning = (hiF: number) => {
    if (hiF >= 130) return { level: "Extreme Danger", color: "text-red-600", tip: "Heat stroke is imminent. Stay indoors with AC." };
    if (hiF >= 105) return { level: "Danger", color: "text-red-500", tip: "Heat cramps and exhaustion likely. Limit outdoor activity." };
    if (hiF >= 90) return { level: "Extreme Caution", color: "text-orange-400", tip: "Heat exhaustion possible. Drink water frequently." };
    if (hiF >= 80) return { level: "Caution", color: "text-yellow-400", tip: "Fatigue possible with prolonged exposure. Stay hydrated." };
    return { level: "Safe", color: "text-emerald-400", tip: "Conditions are comfortable for most people." };
  };
  const warning = getWarning(heatIndexF);

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
          <InputField label={`Temperature (°${tempUnit})`} value={temp} onChange={setTemp} type="number" />
          <InputField label="Relative Humidity (%)" value={humidity} onChange={setHumidity} type="number" />
        </InputPanel>
      }
      results={
        <ResultPanel
          label="Heat Index (Feels Like)"
          primary={`${fmt(heatIndex, 1)}°${tempUnit}`}
          summaries={<>
            <SummaryCard label="Risk Level" value={warning.level} accent="text-emerald-500" />
            <SummaryCard label="Humidity" value={`${humidity}%`} />
          </>}
          tip={warning.tip}
        >
          <BreakdownRow label={`Heat Index (°${oppositeUnit})`} value={`${fmt(heatIndexOpposite, 1)}°${oppositeUnit}`} />
          <BreakdownRow label="Actual Temperature" value={`${temp}°${tempUnit}`} />
          <BreakdownRow label="Danger Zone" value={<span className={warning.color}>{warning.level}</span>} />
        </ResultPanel>
      }
    />
  );
}

// ─── 5. Carbon Footprint ───────────────────────────────────────────────────────
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
  const worldAvg = 4700;
  const vsAvg = ((totalCO2 - worldAvg) / worldAvg * 100);

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
        <ResultPanel
          label="Annual CO₂ Emissions"
          primary={`${fmt(totalCO2 / 1000, 2)} t CO₂`}
          summaries={<>
            <SummaryCard label="Trees to Offset" value={`${Math.ceil(trees)} trees`} accent="text-emerald-500" />
            <SummaryCard label="vs World Avg" value={vsAvg >= 0 ? `+${fmt(vsAvg, 1)}%` : `${fmt(vsAvg, 1)}%`} />
          </>}
          tip={`World avg is ~4.7 t CO₂/person/year. Planting trees, switching to renewables, and flying less are the biggest levers.`}
        >
          <BreakdownRow label="Driving" value={`${fmt(carCO2 / 1000, 2)} t CO₂`} />
          <BreakdownRow label="Electricity" value={`${fmt(elecCO2 / 1000, 2)} t CO₂`} />
          <BreakdownRow label="Flights" value={`${fmt(flightCO2 / 1000, 2)} t CO₂`} />
          <BreakdownRow label="In Kg" value={`${fmt(totalCO2, 0)} kg`} />
        </ResultPanel>
      }
    />
  );
}

// ─── 6. AQI Explainer ─────────────────────────────────────────────────────────
function AQIExplainer() {
  const [aqi, setAqi] = useState("75");

  const aqiVal = parseInt(aqi) || 0;
  const getAQIInfo = (val: number) => {
    if (val <= 50) return { level: "Good", color: "text-green-400", desc: "Air quality is satisfactory.", tip: "Great conditions for outdoor activities." };
    if (val <= 100) return { level: "Moderate", color: "text-yellow-400", desc: "Acceptable; may concern sensitive groups.", tip: "Sensitive individuals should consider limiting prolonged outdoor exertion." };
    if (val <= 150) return { level: "Unhealthy (Sensitive)", color: "text-orange-400", desc: "Sensitive groups may experience effects.", tip: "People with asthma or heart disease should reduce outdoor activity." };
    if (val <= 200) return { level: "Unhealthy", color: "text-red-400", desc: "Everyone may experience health effects.", tip: "Avoid prolonged outdoor exertion. Wear an N95 mask if going out." };
    if (val <= 300) return { level: "Very Unhealthy", color: "text-purple-400", desc: "Serious health effects possible.", tip: "Health alert. Avoid outdoor activities entirely if possible." };
    return { level: "Hazardous", color: "text-red-600", desc: "Emergency conditions. Everyone at risk.", tip: "Stay indoors. Seal windows and use air purifiers." };
  };
  const info = getAQIInfo(aqiVal);
  const pct = Math.min(100, (aqiVal / 500) * 100);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="AQI Explainer" icon={Cloud} iconColor="bg-sky-500">
          <InputField label="AQI Value (0–500)" value={aqi} onChange={setAqi} type="number" min={0} max={500} />
          <div className="mt-2 space-y-1">
            {[
              { range: "0–50", label: "Good", color: "bg-green-400" },
              { range: "51–100", label: "Moderate", color: "bg-yellow-400" },
              { range: "101–150", label: "Unhealthy (Sensitive)", color: "bg-orange-400" },
              { range: "151–200", label: "Unhealthy", color: "bg-red-400" },
              { range: "201–300", label: "Very Unhealthy", color: "bg-purple-400" },
              { range: "301+", label: "Hazardous", color: "bg-red-600" },
            ].map((r) => (
              <div key={r.range} className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${r.color}`} />
                <span className="text-muted-foreground w-16">{r.range}</span>
                <span>{r.label}</span>
              </div>
            ))}
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel
          label="Air Quality Index"
          primary={`${aqiVal} — ${info.level}`}
          summaries={<>
            <SummaryCard label="Category" value={info.level} accent="text-emerald-500" />
            <SummaryCard label="Hazard %" value={`${fmt(pct, 1)}% of max`} />
          </>}
          tip={info.tip}
        >
          <BreakdownRow label="Status" value={<span className={info.color}>{info.desc}</span>} />
          <BreakdownRow label="Good Range" value="0 – 50" />
          <BreakdownRow label="Hazardous At" value="> 300" />
          <BreakdownRow label="Recommended Mask" value={aqiVal > 150 ? "N95 / KN95" : "Not required"} />
        </ResultPanel>
      }
    />
  );
}

// ─── 7. Altitude vs Oxygen ────────────────────────────────────────────────────
function AltitudeOxygen() {
  const [altitude, setAltitude] = useState("3000");
  const [unit, setUnit] = useState<"m" | "ft">("m");

  const alt = parseFloat(altitude) || 0;
  const altMeters = unit === "ft" ? alt * 0.3048 : alt;
  const altFeet = unit === "m" ? alt / 0.3048 : alt;
  const seaLevelO2 = 20.9;
  const pressure = 101325 * Math.pow(1 - 2.25577e-5 * altMeters, 5.25588);
  const effectiveO2 = seaLevelO2 * (pressure / 101325);
  const spo2Estimate = Math.max(70, 98 - (altMeters / 500));
  const pressureKpa = pressure / 1000;
  const risk = altMeters > 5500 ? "Extreme — supplemental O₂ needed" : altMeters > 3500 ? "High — acclimatisation required" : altMeters > 2500 ? "Moderate — AMS risk" : "Low — generally safe";
  const riskColor = altMeters > 5500 ? "text-red-500" : altMeters > 3500 ? "text-orange-400" : altMeters > 2500 ? "text-yellow-400" : "text-emerald-400";

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
        <ResultPanel
          label="Effective Oxygen Level"
          primary={`${fmt(effectiveO2, 1)}% O₂`}
          summaries={<>
            <SummaryCard label="Est. SpO₂" value={`~${fmt(spo2Estimate, 0)}%`} accent="text-emerald-500" />
            <SummaryCard label="Air Pressure" value={`${fmt(pressureKpa, 1)} kPa`} />
          </>}
          tip={altMeters > 2500 ? `Above 2,500 m altitude sickness (AMS) risk rises. Acclimatise gradually — ascend no more than 300–500 m/day.` : `Below 2,500 m, oxygen levels are sufficient for most healthy adults without supplemental aid.`}
        >
          <BreakdownRow label="Altitude" value={`${fmt(altMeters, 0)} m / ${fmt(altFeet, 0)} ft`} />
          <BreakdownRow label="Sea-Level O₂" value="20.9%" />
          <BreakdownRow label="O₂ Reduction" value={`−${fmt(seaLevelO2 - effectiveO2, 1)}%`} />
          <BreakdownRow label="Risk Level" value={<span className={riskColor}>{risk}</span>} />
        </ResultPanel>
      }
    />
  );
}
