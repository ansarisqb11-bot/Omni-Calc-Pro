import { useState } from "react";
import { motion } from "framer-motion";
import { Stethoscope, Pill, Heart, Droplets, Activity, Calculator, Flame, Eye } from "lucide-react";
import { DesktopToolGrid, InputPanel, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "dosage" | "ivdrip" | "heartrate" | "oxygen" | "calories" | "bsa" | "water" | "period" | "vision";

export default function MedicalTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("dosage");

  const tools = [
    { id: "dosage", label: "Dosage", icon: Pill },
    { id: "ivdrip", label: "IV Drip", icon: Droplets },
    { id: "heartrate", label: "Heart Rate", icon: Heart },
    { id: "oxygen", label: "Oxygen", icon: Activity },
    { id: "calories", label: "Calories", icon: Flame },
    { id: "bsa", label: "BSA", icon: Calculator },
    { id: "water", label: "Water", icon: Droplets },
    { id: "period", label: "Period", icon: Activity },
    { id: "vision", label: "Vision", icon: Eye },
  ];

  return (
    <PageWrapper
      title="Medical Tools"
      subtitle="Health calculators (non-diagnostic)"
      accentColor="bg-red-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "dosage" && <DosageCalculator />}
      {activeTool === "ivdrip" && <IVDripCalculator />}
      {activeTool === "heartrate" && <HeartRateZones />}
      {activeTool === "oxygen" && <OxygenFlowRate />}
      {activeTool === "calories" && <CaloriesBurned />}
      {activeTool === "bsa" && <BSACalculator />}
      {activeTool === "water" && <WaterIntakeCalculator />}
      {activeTool === "period" && <PeriodCyclePredictor />}
      {activeTool === "vision" && <VisionConverter />}
    </PageWrapper>
  );
}

function DosageCalculator() {
  const [weight, setWeight] = useState("70");
  const [dosePerKg, setDosePerKg] = useState("10");
  const [frequency, setFrequency] = useState("3");

  const w = parseFloat(weight) || 0;
  const d = parseFloat(dosePerKg) || 0;
  const f = parseInt(frequency) || 1;
  const singleDose = w * d;
  const dailyDose = singleDose * f;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Dosage Calculator" icon={Pill} iconColor="bg-blue-500">
          <InputField label="Patient Weight (kg)" value={weight} onChange={setWeight} type="number" />
          <InputField label="Dose per kg (mg/kg)" value={dosePerKg} onChange={setDosePerKg} type="number" />
          <InputField label="Times per Day" value={frequency} onChange={setFrequency} type="number" />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Dosage</p>
          <ResultDisplay label="Single Dose" value={`${singleDose.toFixed(1)} mg`} highlight color="text-blue-400" />
          <ResultDisplay label="Daily Total" value={`${dailyDose.toFixed(1)} mg`} color="text-emerald-400" />
          <p className="text-xs text-muted-foreground mt-4">Consult a healthcare provider before administering medication.</p>
        </div>
      }
    />
  );
}

function IVDripCalculator() {
  const [volume, setVolume] = useState("1000");
  const [time, setTime] = useState("8");
  const [dropFactor, setDropFactor] = useState("20");

  const v = parseFloat(volume) || 0;
  const t = parseFloat(time) || 1;
  const df = parseFloat(dropFactor) || 20;
  const dropsPerMin = (v * df) / (t * 60);
  const mlPerHour = v / t;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="IV Drip Rate" icon={Droplets} iconColor="bg-cyan-500">
          <InputField label="Volume (mL)" value={volume} onChange={setVolume} type="number" />
          <InputField label="Time (hours)" value={time} onChange={setTime} type="number" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Drop Factor</label>
            <div className="flex gap-2">
              {["10", "15", "20", "60"].map((df) => (
                <button key={df} onClick={() => setDropFactor(df)}
                  className={`flex-1 py-2 rounded-lg text-sm ${dropFactor === df ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-df-${df}`}>
                  {df} gtt/mL
                </button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Flow Rate</p>
          <ResultDisplay label="Drops per Minute" value={`${dropsPerMin.toFixed(1)} gtt/min`} highlight color="text-cyan-400" />
          <ResultDisplay label="mL per Hour" value={`${mlPerHour.toFixed(1)} mL/hr`} color="text-blue-400" />
        </div>
      }
    />
  );
}

function HeartRateZones() {
  const [age, setAge] = useState("30");
  const [restingHR, setRestingHR] = useState("60");

  const a = parseInt(age) || 30;
  const rhr = parseInt(restingHR) || 60;
  const maxHR = 220 - a;
  const hrr = maxHR - rhr;

  const zones = [
    { name: "Zone 1 (Recovery)", min: 0.5, max: 0.6, color: "text-gray-400" },
    { name: "Zone 2 (Fat Burn)", min: 0.6, max: 0.7, color: "text-blue-400" },
    { name: "Zone 3 (Cardio)", min: 0.7, max: 0.8, color: "text-green-400" },
    { name: "Zone 4 (Anaerobic)", min: 0.8, max: 0.9, color: "text-orange-400" },
    { name: "Zone 5 (Max)", min: 0.9, max: 1.0, color: "text-red-400" },
  ];

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Heart Rate Zones" icon={Heart} iconColor="bg-red-500">
          <InputField label="Age" value={age} onChange={setAge} type="number" />
          <InputField label="Resting Heart Rate (bpm)" value={restingHR} onChange={setRestingHR} type="number" />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Training Zones</p>
          <div className="flex justify-between p-2 bg-muted/30 rounded-lg mb-3">
            <span className="text-muted-foreground">Max Heart Rate</span>
            <span className="font-bold text-red-400">{maxHR} bpm</span>
          </div>
          <div className="space-y-2">
            {zones.map((zone) => (
              <div key={zone.name} className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
                <span className={`text-sm ${zone.color}`}>{zone.name}</span>
                <span className="font-mono text-sm">
                  {Math.round(rhr + hrr * zone.min)} – {Math.round(rhr + hrr * zone.max)} bpm
                </span>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}

function OxygenFlowRate() {
  const [fio2, setFio2] = useState("40");
  const [deviceType, setDeviceType] = useState("nasal");

  const devices = {
    nasal: { name: "Nasal Cannula", factor: 4, maxFlow: 6 },
    simpleMask: { name: "Simple Mask", factor: 6, maxFlow: 10 },
    venturi: { name: "Venturi Mask", factor: 0, maxFlow: 15 },
    nonRebreather: { name: "Non-Rebreather", factor: 10, maxFlow: 15 },
  };

  const device = devices[deviceType as keyof typeof devices];
  const targetFiO2 = parseFloat(fio2) || 21;
  const flowRate = deviceType === "nasal"
    ? Math.max(1, Math.ceil((targetFiO2 - 21) / 4))
    : Math.ceil((targetFiO2 - 21) / 3);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Oxygen Flow Rate" icon={Activity} iconColor="bg-sky-500">
          <InputField label="Target FiO2 (%)" value={fio2} onChange={setFio2} type="number" min={21} max={100} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Device Type</label>
            <div className="space-y-2">
              {Object.entries(devices).map(([key, val]) => (
                <button key={key} onClick={() => setDeviceType(key)}
                  className={`w-full text-left p-3 rounded-xl text-sm transition-all ${deviceType === key ? "bg-sky-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-device-${key}`}>
                  {val.name}
                </button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Flow Rate</p>
          <div className="text-center py-6">
            <div className="text-5xl font-bold text-sky-400 mb-2">{Math.min(flowRate, device.maxFlow)} L/min</div>
            <p className="text-muted-foreground">Recommended for {device.name}</p>
            <p className="text-xs text-muted-foreground mt-2">Max: {device.maxFlow} L/min</p>
          </div>
        </div>
      }
    />
  );
}

function CaloriesBurned() {
  const [weight, setWeight] = useState("70");
  const [duration, setDuration] = useState("30");
  const [activity, setActivity] = useState("running");

  const activities = {
    running: { name: "Running", met: 9.8 },
    walking: { name: "Walking", met: 3.5 },
    cycling: { name: "Cycling", met: 7.5 },
    swimming: { name: "Swimming", met: 8.0 },
    yoga: { name: "Yoga", met: 2.5 },
    weightlifting: { name: "Weight Lifting", met: 6.0 },
  };

  const w = parseFloat(weight) || 70;
  const d = parseFloat(duration) || 30;
  const met = activities[activity as keyof typeof activities].met;
  const calories = (met * w * d) / 60;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Calories Burned" icon={Flame} iconColor="bg-orange-500">
          <InputField label="Weight (kg)" value={weight} onChange={setWeight} type="number" />
          <InputField label="Duration (minutes)" value={duration} onChange={setDuration} type="number" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Activity</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(activities).map(([key, val]) => (
                <button key={key} onClick={() => setActivity(key)}
                  className={`p-2 rounded-lg text-sm transition-all ${activity === key ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-activity-${key}`}>
                  {val.name}
                </button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Result</p>
          <div className="text-center py-6">
            <div className="text-5xl font-bold text-orange-400 mb-2">{Math.round(calories)}</div>
            <p className="text-muted-foreground">Calories Burned</p>
          </div>
        </div>
      }
    />
  );
}

function BSACalculator() {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");
  const [formula, setFormula] = useState("mosteller");

  const h = parseFloat(height) || 170;
  const w = parseFloat(weight) || 70;

  const formulas: Record<string, { calc: () => number; name: string }> = {
    mosteller: { calc: () => Math.sqrt((h * w) / 3600), name: "Mosteller" },
    dubois: { calc: () => 0.007184 * Math.pow(h, 0.725) * Math.pow(w, 0.425), name: "Du Bois" },
    haycock: { calc: () => 0.024265 * Math.pow(h, 0.3964) * Math.pow(w, 0.5378), name: "Haycock" },
  };

  const bsa = formulas[formula].calc();

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Body Surface Area" icon={Calculator} iconColor="bg-purple-500">
          <InputField label="Height (cm)" value={height} onChange={setHeight} type="number" />
          <InputField label="Weight (kg)" value={weight} onChange={setWeight} type="number" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Formula</label>
            <div className="flex gap-2">
              {Object.entries(formulas).map(([key, val]) => (
                <button key={key} onClick={() => setFormula(key)}
                  className={`flex-1 py-2 rounded-lg text-sm ${formula === key ? "bg-purple-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-formula-${key}`}>
                  {val.name}
                </button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">BSA</p>
          <div className="text-center py-6">
            <div className="text-5xl font-bold text-purple-400 mb-2">{bsa.toFixed(2)} m²</div>
            <p className="text-muted-foreground">Body Surface Area</p>
          </div>
        </div>
      }
    />
  );
}

function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("70");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [climate, setClimate] = useState("temperate");

  const w = parseFloat(weight) || 70;
  const activityFactors = { sedentary: 30, moderate: 35, active: 40, intense: 45 };
  const climateFactors = { cold: 0.9, temperate: 1.0, hot: 1.2, humid: 1.3 };

  const baseIntake = w * activityFactors[activityLevel as keyof typeof activityFactors];
  const adjustedIntake = baseIntake * climateFactors[climate as keyof typeof climateFactors];
  const glasses = Math.ceil(adjustedIntake / 250);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Water Intake" icon={Droplets} iconColor="bg-blue-500">
          <InputField label="Weight (kg)" value={weight} onChange={setWeight} type="number" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Activity Level</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(activityFactors).map((level) => (
                <button key={level} onClick={() => setActivityLevel(level)}
                  className={`p-2 rounded-lg text-sm capitalize ${activityLevel === level ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-activity-${level}`}>
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Climate</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(climateFactors).map((c) => (
                <button key={c} onClick={() => setClimate(c)}
                  className={`p-2 rounded-lg text-sm capitalize ${climate === c ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-climate-${c}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Daily Intake</p>
          <ResultDisplay label="Recommended" value={`${Math.round(adjustedIntake)} mL`} highlight color="text-blue-400" />
          <ResultDisplay label="Glasses (250 mL each)" value={`${glasses} glasses`} />
          <ResultDisplay label="Liters" value={`${(adjustedIntake / 1000).toFixed(1)} L`} />
        </div>
      }
    />
  );
}

function PeriodCyclePredictor() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [periodLength, setPeriodLength] = useState("5");

  const calculateDates = () => {
    if (!lastPeriod) return null;
    const lmp = new Date(lastPeriod);
    const cycle = parseInt(cycleLength) || 28;

    const nextPeriod = new Date(lmp);
    nextPeriod.setDate(nextPeriod.getDate() + cycle);

    const ovulation = new Date(lmp);
    ovulation.setDate(ovulation.getDate() + cycle - 14);

    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    return { nextPeriod, ovulation, fertileStart, fertileEnd };
  };

  const dates = calculateDates();

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Period Cycle Predictor" icon={Activity} iconColor="bg-pink-500">
          <InputField label="Last Period Start" value={lastPeriod} onChange={setLastPeriod} type="date" />
          <InputField label="Cycle Length (days)" value={cycleLength} onChange={setCycleLength} type="number" />
          <InputField label="Period Length (days)" value={periodLength} onChange={setPeriodLength} type="number" />
        </InputPanel>
      }
      results={
        dates ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Predictions</p>
            <ResultDisplay label="Next Period" value={dates.nextPeriod.toLocaleDateString()} highlight color="text-pink-400" />
            <ResultDisplay label="Ovulation" value={dates.ovulation.toLocaleDateString()} color="text-purple-400" />
            <ResultDisplay label="Fertile Window" value={`${dates.fertileStart.toLocaleDateString()} – ${dates.fertileEnd.toLocaleDateString()}`} />
            <p className="text-xs text-muted-foreground mt-4">This is an estimate. Consult a healthcare provider for accurate tracking.</p>
          </motion.div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground text-sm text-center">Enter your last period start date to see predictions</p>
          </div>
        )
      }
    />
  );
}

function VisionConverter() {
  const [sphereOD, setSphereOD] = useState("-2.00");
  const [cylinderOD, setCylinderOD] = useState("-0.50");
  const [axisOD, setAxisOD] = useState("180");

  const sphere = parseFloat(sphereOD) || 0;
  const cylinder = parseFloat(cylinderOD) || 0;
  const axis = parseInt(axisOD) || 0;

  const newSphere = sphere + cylinder;
  const newCylinder = -cylinder;
  const newAxis = axis <= 90 ? axis + 90 : axis - 90;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Vision Prescription" icon={Eye} iconColor="bg-indigo-500">
          <p className="text-sm text-muted-foreground">Convert between plus and minus cylinder notation</p>
          <InputField label="Sphere (D)" value={sphereOD} onChange={setSphereOD} type="number" step={0.25} />
          <InputField label="Cylinder (D)" value={cylinderOD} onChange={setCylinderOD} type="number" step={0.25} />
          <InputField label="Axis (degrees)" value={axisOD} onChange={setAxisOD} type="number" min={1} max={180} />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Converted</p>
          <ResultDisplay label="Sphere" value={newSphere >= 0 ? `+${newSphere.toFixed(2)}` : newSphere.toFixed(2)} highlight color="text-indigo-400" />
          <ResultDisplay label="Cylinder" value={newCylinder >= 0 ? `+${newCylinder.toFixed(2)}` : newCylinder.toFixed(2)} />
          <ResultDisplay label="Axis" value={`${newAxis}°`} />
        </div>
      }
    />
  );
}
