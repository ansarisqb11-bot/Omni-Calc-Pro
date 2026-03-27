import { useState } from "react";
import { motion } from "framer-motion";
import { Stethoscope, Pill, Heart, Droplets, Activity, Calculator, Flame, Eye } from "lucide-react";
import { DesktopToolGrid, InputPanel, InputField, ResultPanel, SummaryCard, BreakdownRow, ModeSelector } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "dosage" | "ivdrip" | "heartrate" | "oxygen" | "calories" | "bsa" | "water" | "period" | "vision";

const fmt = (n: number, d = 1) => (isFinite(n) && !isNaN(n) ? parseFloat(n.toFixed(d)).toLocaleString() : "—");

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
  const weeklyDose = dailyDose * 7;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Dosage Calculator" icon={Pill} iconColor="bg-blue-500">
          <InputField label="Patient Weight (kg)" value={weight} onChange={setWeight} type="number" suffix="kg" />
          <InputField label="Dose per kg (mg/kg)" value={dosePerKg} onChange={setDosePerKg} type="number" suffix="mg/kg" />
          <InputField label="Times per Day" value={frequency} onChange={setFrequency} type="number" suffix="×/day" />
        </InputPanel>
      }
      results={
        <ResultPanel
          label="Single Dose"
          primary={`${fmt(singleDose, 1)} mg`}
          summaries={<>
            <SummaryCard label="Daily Total" value={`${fmt(dailyDose, 1)} mg`} accent="text-blue-500" />
            <SummaryCard label="Weekly Total" value={`${fmt(weeklyDose, 0)} mg`} />
          </>}
          tip="Always verify dosages with a licensed pharmacist or healthcare provider before administration."
        >
          <BreakdownRow label="Patient Weight" value={`${w} kg`} dot="bg-blue-400" />
          <BreakdownRow label="Dose per kg" value={`${d} mg/kg`} dot="bg-amber-400" />
          <BreakdownRow label="Frequency" value={`${f}× per day`} dot="bg-purple-400" />
          <BreakdownRow label="Single Dose" value={`${fmt(singleDose, 1)} mg`} dot="bg-green-500" bold />
          <BreakdownRow label="Daily Total" value={`${fmt(dailyDose, 1)} mg`} dot="bg-orange-400" bold />
          <BreakdownRow label="Weekly Total" value={`${fmt(weeklyDose, 0)} mg`} dot="bg-red-400" />
        </ResultPanel>
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
  const mlPerMin = mlPerHour / 60;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="IV Drip Rate" icon={Droplets} iconColor="bg-cyan-500">
          <InputField label="Volume (mL)" value={volume} onChange={setVolume} type="number" suffix="mL" />
          <InputField label="Time (hours)" value={time} onChange={setTime} type="number" suffix="hr" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Drop Factor</label>
            <div className="flex gap-2">
              {["10", "15", "20", "60"].map((df) => (
                <button key={df} onClick={() => setDropFactor(df)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold ${dropFactor === df ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-df-${df}`}>
                  {df}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">gtt/mL</p>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel
          label="Drip Rate"
          primary={`${fmt(dropsPerMin, 0)} gtt/min`}
          summaries={<>
            <SummaryCard label="Flow Rate" value={`${fmt(mlPerHour, 0)} mL/hr`} accent="text-cyan-500" />
            <SummaryCard label="Drop Factor" value={`${dropFactor} gtt/mL`} />
          </>}
          tip={`At ${fmt(dropsPerMin, 0)} drops/min, the ${v} mL bag will infuse in exactly ${t} hour${t !== 1 ? "s" : ""}.`}
        >
          <BreakdownRow label="Total Volume" value={`${v} mL`} dot="bg-cyan-400" />
          <BreakdownRow label="Infusion Time" value={`${t} hour${t !== 1 ? "s" : ""}`} dot="bg-blue-400" />
          <BreakdownRow label="Drop Factor" value={`${dropFactor} gtt/mL`} dot="bg-purple-400" />
          <BreakdownRow label="mL per Minute" value={`${fmt(mlPerMin, 2)} mL/min`} dot="bg-amber-400" />
          <BreakdownRow label="mL per Hour" value={`${fmt(mlPerHour, 1)} mL/hr`} dot="bg-green-500" bold />
          <BreakdownRow label="Drops per Minute" value={`${fmt(dropsPerMin, 0)} gtt/min`} dot="bg-orange-400" bold />
        </ResultPanel>
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
    { name: "Zone 1 — Recovery", min: 0.5, max: 0.6, dot: "bg-gray-400", color: "text-gray-400" },
    { name: "Zone 2 — Fat Burn", min: 0.6, max: 0.7, dot: "bg-blue-400", color: "text-blue-400" },
    { name: "Zone 3 — Cardio", min: 0.7, max: 0.8, dot: "bg-green-400", color: "text-green-400" },
    { name: "Zone 4 — Anaerobic", min: 0.8, max: 0.9, dot: "bg-orange-400", color: "text-orange-400" },
    { name: "Zone 5 — Max", min: 0.9, max: 1.0, dot: "bg-red-500", color: "text-red-400" },
  ];

  const cardioMin = Math.round(rhr + hrr * 0.7);
  const cardioMax = Math.round(rhr + hrr * 0.8);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Heart Rate Zones" icon={Heart} iconColor="bg-red-500">
          <InputField label="Age" value={age} onChange={setAge} type="number" suffix="yrs" />
          <InputField label="Resting Heart Rate" value={restingHR} onChange={setRestingHR} type="number" suffix="bpm" />
        </InputPanel>
      }
      results={
        <ResultPanel
          label="Max Heart Rate"
          primary={`${maxHR} bpm`}
          summaries={<>
            <SummaryCard label="Heart Rate Reserve" value={`${hrr} bpm`} accent="text-red-500" />
            <SummaryCard label="Resting HR" value={`${rhr} bpm`} />
          </>}
          tip={`Your cardio zone is ${cardioMin}–${cardioMax} bpm. Training here improves cardiovascular endurance most efficiently.`}
        >
          {zones.map((zone) => (
            <BreakdownRow
              key={zone.name}
              label={zone.name}
              value={`${Math.round(rhr + hrr * zone.min)}–${Math.round(rhr + hrr * zone.max)} bpm`}
              dot={zone.dot}
              accent={zone.color}
            />
          ))}
        </ResultPanel>
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
  const rawFlow = deviceType === "nasal"
    ? Math.max(1, Math.ceil((targetFiO2 - 21) / 4))
    : Math.ceil((targetFiO2 - 21) / 3);
  const flowRate = Math.min(rawFlow, device.maxFlow);
  const roomAir = 21;
  const oxygenIncrease = targetFiO2 - roomAir;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Oxygen Flow Rate" icon={Activity} iconColor="bg-sky-500">
          <InputField label="Target FiO2 (%)" value={fio2} onChange={setFio2} type="number" suffix="%" min={21} max={100} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Device Type</label>
            <div className="space-y-2">
              {Object.entries(devices).map(([key, val]) => (
                <button key={key} onClick={() => setDeviceType(key)}
                  className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all ${deviceType === key ? "bg-sky-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-device-${key}`}>
                  {val.name}
                </button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel
          label="Recommended Flow"
          primary={`${flowRate} L/min`}
          summaries={<>
            <SummaryCard label="Target FiO₂" value={`${targetFiO2}%`} accent="text-sky-500" />
            <SummaryCard label="Max for Device" value={`${device.maxFlow} L/min`} />
          </>}
          tip={`${device.name} at ${flowRate} L/min delivers approximately ${targetFiO2}% oxygen, increasing FiO₂ by ${oxygenIncrease}% above room air.`}
        >
          <BreakdownRow label="Device" value={device.name} dot="bg-sky-400" />
          <BreakdownRow label="Room Air FiO₂" value={`${roomAir}%`} dot="bg-gray-400" />
          <BreakdownRow label="Target FiO₂" value={`${targetFiO2}%`} dot="bg-blue-400" />
          <BreakdownRow label="FiO₂ Increase" value={`+${oxygenIncrease}%`} dot="bg-amber-400" />
          <BreakdownRow label="Max Device Flow" value={`${device.maxFlow} L/min`} dot="bg-purple-400" />
          <BreakdownRow label="Recommended Flow" value={`${flowRate} L/min`} dot="bg-green-500" bold />
        </ResultPanel>
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
  const calPerMin = calories / d;
  const calPerHour = calPerMin * 60;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Calories Burned" icon={Flame} iconColor="bg-orange-500">
          <InputField label="Weight (kg)" value={weight} onChange={setWeight} type="number" suffix="kg" />
          <InputField label="Duration (minutes)" value={duration} onChange={setDuration} type="number" suffix="min" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Activity</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(activities).map(([key, val]) => (
                <button key={key} onClick={() => setActivity(key)}
                  className={`p-2.5 rounded-xl text-sm font-medium transition-all ${activity === key ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-activity-${key}`}>
                  {val.name}
                </button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel
          label="Calories Burned"
          primary={`${Math.round(calories)} kcal`}
          summaries={<>
            <SummaryCard label="Per Hour" value={`${Math.round(calPerHour)} kcal`} accent="text-orange-500" />
            <SummaryCard label="MET Value" value={`${met}`} sub="Metabolic Equivalent" />
          </>}
          tip={`${activities[activity as keyof typeof activities].name} burns ~${Math.round(calPerMin)} kcal/min for a ${w} kg person. Equivalent to ${fmt(calories / 9, 1)} g of fat.`}
        >
          <BreakdownRow label="Body Weight" value={`${w} kg`} dot="bg-orange-400" />
          <BreakdownRow label="Activity" value={activities[activity as keyof typeof activities].name} dot="bg-amber-400" />
          <BreakdownRow label="MET Value" value={`${met}`} dot="bg-purple-400" />
          <BreakdownRow label="Duration" value={`${d} minutes`} dot="bg-blue-400" />
          <BreakdownRow label="Per Minute" value={`${fmt(calPerMin, 1)} kcal`} dot="bg-green-400" />
          <BreakdownRow label="Total Burned" value={`${Math.round(calories)} kcal`} dot="bg-red-400" bold />
        </ResultPanel>
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
  const bmiApprox = w / Math.pow(h / 100, 2);
  const normalMin = 1.5;
  const normalMax = 2.2;
  const status = bsa < normalMin ? "Below avg" : bsa > normalMax ? "Above avg" : "Normal range";

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Body Surface Area" icon={Calculator} iconColor="bg-purple-500">
          <InputField label="Height (cm)" value={height} onChange={setHeight} type="number" suffix="cm" />
          <InputField label="Weight (kg)" value={weight} onChange={setWeight} type="number" suffix="kg" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Formula</label>
            <div className="flex gap-2">
              {Object.entries(formulas).map(([key, val]) => (
                <button key={key} onClick={() => setFormula(key)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold ${formula === key ? "bg-purple-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-formula-${key}`}>
                  {val.name}
                </button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel
          label="Body Surface Area"
          primary={`${bsa.toFixed(2)} m²`}
          summaries={<>
            <SummaryCard label="Status" value={status} accent={bsa >= normalMin && bsa <= normalMax ? "text-green-500" : "text-amber-500"} />
            <SummaryCard label="BMI (approx)" value={`${bmiApprox.toFixed(1)}`} sub="kg/m²" />
          </>}
          tip={`BSA ${bsa.toFixed(2)} m² using ${formulas[formula].name} formula. Normal adult range is 1.5–2.2 m². Used for drug dosing in oncology.`}
        >
          <BreakdownRow label="Height" value={`${h} cm`} dot="bg-purple-400" />
          <BreakdownRow label="Weight" value={`${w} kg`} dot="bg-blue-400" />
          <BreakdownRow label="Formula" value={formulas[formula].name} dot="bg-amber-400" />
          <BreakdownRow label="Normal Adult Range" value="1.5–2.2 m²" dot="bg-green-400" />
          <BreakdownRow label="BSA Result" value={`${bsa.toFixed(2)} m²`} dot="bg-pink-400" bold />
          <BreakdownRow label="Status" value={status} dot="bg-orange-400" accent={bsa >= normalMin && bsa <= normalMax ? "text-green-400" : "text-amber-400"} />
        </ResultPanel>
      }
    />
  );
}

function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("70");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [climate, setClimate] = useState("temperate");

  const w = parseFloat(weight) || 70;
  const activityFactors: Record<string, number> = { sedentary: 30, moderate: 35, active: 40, intense: 45 };
  const climateFactors: Record<string, number> = { cold: 0.9, temperate: 1.0, hot: 1.2, humid: 1.3 };

  const baseIntake = w * activityFactors[activityLevel];
  const adjustedIntake = baseIntake * climateFactors[climate];
  const glasses = Math.ceil(adjustedIntake / 250);
  const liters = adjustedIntake / 1000;
  const bottles = adjustedIntake / 500;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Water Intake" icon={Droplets} iconColor="bg-blue-500">
          <InputField label="Weight (kg)" value={weight} onChange={setWeight} type="number" suffix="kg" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Activity Level</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(activityFactors).map((level) => (
                <button key={level} onClick={() => setActivityLevel(level)}
                  className={`p-2.5 rounded-xl text-sm font-medium capitalize ${activityLevel === level ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}
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
                  className={`p-2.5 rounded-xl text-sm font-medium capitalize ${climate === c ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-climate-${c}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel
          label="Daily Water Intake"
          primary={`${Math.round(adjustedIntake)} mL`}
          summaries={<>
            <SummaryCard label="Glasses (250 mL)" value={`${glasses} glasses`} accent="text-blue-500" />
            <SummaryCard label="Bottles (500 mL)" value={`${fmt(bottles, 1)} bottles`} />
          </>}
          tip={`A ${activityLevel} ${w} kg person in a ${climate} climate needs ~${liters.toFixed(1)} L/day. Spread intake evenly — aim for a glass every 1–2 hours.`}
        >
          <BreakdownRow label="Body Weight" value={`${w} kg`} dot="bg-blue-400" />
          <BreakdownRow label="Activity Level" value={activityLevel.charAt(0).toUpperCase() + activityLevel.slice(1)} dot="bg-cyan-400" />
          <BreakdownRow label="Climate" value={climate.charAt(0).toUpperCase() + climate.slice(1)} dot="bg-sky-400" />
          <BreakdownRow label="Base Intake" value={`${Math.round(baseIntake)} mL`} dot="bg-amber-400" />
          <BreakdownRow label="Climate Adjustment" value={`×${climateFactors[climate]}`} dot="bg-purple-400" />
          <BreakdownRow label="Recommended" value={`${liters.toFixed(1)} L / ${Math.round(adjustedIntake)} mL`} dot="bg-green-500" bold />
        </ResultPanel>
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
    const pLen = parseInt(periodLength) || 5;

    const nextPeriod = new Date(lmp);
    nextPeriod.setDate(nextPeriod.getDate() + cycle);

    const ovulation = new Date(lmp);
    ovulation.setDate(ovulation.getDate() + cycle - 14);

    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    const periodEnd = new Date(lmp);
    periodEnd.setDate(periodEnd.getDate() + pLen);

    const daysUntilNext = Math.round((nextPeriod.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return { nextPeriod, ovulation, fertileStart, fertileEnd, periodEnd, daysUntilNext, cycle, pLen };
  };

  const dates = calculateDates();
  const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Period Cycle Predictor" icon={Activity} iconColor="bg-pink-500">
          <InputField label="Last Period Start Date" value={lastPeriod} onChange={setLastPeriod} type="date" />
          <InputField label="Cycle Length (days)" value={cycleLength} onChange={setCycleLength} type="number" suffix="days" />
          <InputField label="Period Length (days)" value={periodLength} onChange={setPeriodLength} type="number" suffix="days" />
        </InputPanel>
      }
      results={
        dates ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ResultPanel
              label="Next Period"
              primary={fmtDate(dates.nextPeriod)}
              primarySub={dates.daysUntilNext >= 0 ? `in ${dates.daysUntilNext} days` : `${Math.abs(dates.daysUntilNext)} days ago`}
              summaries={<>
                <SummaryCard label="Ovulation" value={fmtDate(dates.ovulation)} accent="text-pink-500" />
                <SummaryCard label="Cycle Length" value={`${dates.cycle} days`} />
              </>}
              tip="This is an estimate based on average cycle patterns. Consult a healthcare provider for accurate tracking and medical advice."
            >
              <BreakdownRow label="Last Period Start" value={fmtDate(new Date(lastPeriod))} dot="bg-pink-400" />
              <BreakdownRow label="Period End (est.)" value={fmtDate(dates.periodEnd)} dot="bg-rose-400" />
              <BreakdownRow label="Ovulation Day" value={fmtDate(dates.ovulation)} dot="bg-purple-400" bold />
              <BreakdownRow label="Fertile Window Start" value={fmtDate(dates.fertileStart)} dot="bg-amber-400" />
              <BreakdownRow label="Fertile Window End" value={fmtDate(dates.fertileEnd)} dot="bg-orange-400" />
              <BreakdownRow label="Next Period" value={fmtDate(dates.nextPeriod)} dot="bg-green-500" bold />
            </ResultPanel>
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
  const [mode, setMode] = useState<"minus" | "plus">("minus");

  const sphere = parseFloat(sphereOD) || 0;
  const cylinder = parseFloat(cylinderOD) || 0;
  const axis = parseInt(axisOD) || 0;

  const newSphere = sphere + cylinder;
  const newCylinder = -cylinder;
  const newAxis = axis <= 90 ? axis + 90 : axis - 90;

  const fmtD = (n: number) => (n >= 0 ? `+${n.toFixed(2)}` : n.toFixed(2));
  const seLabel = (n: number) => Math.abs(n) < 0.01 ? "Plano" : Math.abs(n) > 6 ? "High" : Math.abs(n) > 3 ? "Moderate" : "Mild";

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Vision Prescription" icon={Eye} iconColor="bg-indigo-500">
          <p className="text-sm text-muted-foreground">Convert between plus and minus cylinder notation</p>
          <ModeSelector
            modes={[{ id: "minus", label: "Minus Cylinder" }, { id: "plus", label: "Plus Cylinder" }]}
            active={mode}
            onChange={v => setMode(v as "minus" | "plus")}
          />
          <InputField label="Sphere (D)" value={sphereOD} onChange={setSphereOD} type="number" step={0.25} suffix="D" />
          <InputField label="Cylinder (D)" value={cylinderOD} onChange={setCylinderOD} type="number" step={0.25} suffix="D" />
          <InputField label="Axis (degrees)" value={axisOD} onChange={setAxisOD} type="number" min={1} max={180} suffix="°" />
        </InputPanel>
      }
      results={
        <ResultPanel
          label="Converted Prescription"
          primary={`${fmtD(newSphere)} / ${fmtD(newCylinder)} × ${newAxis}°`}
          summaries={<>
            <SummaryCard label="New Sphere" value={fmtD(newSphere)} accent="text-indigo-500" />
            <SummaryCard label="New Cylinder" value={fmtD(newCylinder)} />
          </>}
          tip={`Converted to ${mode === "minus" ? "plus" : "minus"} cylinder form. Both notations are optically equivalent — the axis shifts by 90° when transposing.`}
        >
          <BreakdownRow label="Original Sphere" value={fmtD(sphere)} dot="bg-indigo-400" />
          <BreakdownRow label="Original Cylinder" value={fmtD(cylinder)} dot="bg-blue-400" />
          <BreakdownRow label="Original Axis" value={`${axis}°`} dot="bg-purple-400" />
          <BreakdownRow label="Converted Sphere" value={fmtD(newSphere)} dot="bg-green-500" bold />
          <BreakdownRow label="Converted Cylinder" value={fmtD(newCylinder)} dot="bg-amber-400" bold />
          <BreakdownRow label="Converted Axis" value={`${newAxis}°`} dot="bg-orange-400" />
          <BreakdownRow label="Power Severity" value={seLabel(sphere)} dot="bg-pink-400" />
        </ResultPanel>
      }
    />
  );
}
