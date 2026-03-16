import { useState } from "react";
import { Heart, Scale, Utensils, Activity, Moon, Coffee, Dumbbell, Wind } from "lucide-react";
import { DesktopToolGrid, InputPanel, ResultPanel, SummaryCard, BreakdownRow, InputField, ModeSelector } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "bmi" | "bmr" | "calories" | "water" | "sleep" | "caffeine" | "bodyFat" | "heartRate" | "breath";

const CURRENCIES = [
  { code: "INR", symbol: "₹" }, { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" }, { code: "GBP", symbol: "£" },
  { code: "AUD", symbol: "A$" }, { code: "CAD", symbol: "C$" },
  { code: "AED", symbol: "د.إ" }, { code: "SGD", symbol: "S$" },
  { code: "JPY", symbol: "¥" }, { code: "CHF", symbol: "CHF" },
];
const cs = (code: string) => CURRENCIES.find(c => c.code === code)?.symbol || "₹";
const fmt = (n: number, d = 2) => isFinite(n) && !isNaN(n) ? parseFloat(n.toFixed(d)).toLocaleString() : "—";

export default function LifestyleTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("bmi");
  const tools = [
    { id: "bmi", label: "BMI", icon: Scale },
    { id: "bmr", label: "BMR", icon: Activity },
    { id: "calories", label: "Calories", icon: Utensils },
    { id: "water", label: "Water", icon: Heart },
    { id: "sleep", label: "Sleep", icon: Moon },
    { id: "caffeine", label: "Caffeine", icon: Coffee },
    { id: "bodyFat", label: "Body Fat", icon: Dumbbell },
    { id: "heartRate", label: "Heart Rate", icon: Heart },
    { id: "breath", label: "Breathing", icon: Wind },
  ];
  return (
    <PageWrapper title="Lifestyle Tools" subtitle="Health, wellness and fitness calculators" accentColor="bg-rose-500" tools={tools} activeTool={activeTool} onToolChange={id => setActiveTool(id as ToolType)}>
      {activeTool === "bmi" && <BMI />}
      {activeTool === "bmr" && <BMR />}
      {activeTool === "calories" && <CalorieBurn />}
      {activeTool === "water" && <WaterIntake />}
      {activeTool === "sleep" && <SleepCalc />}
      {activeTool === "caffeine" && <Caffeine />}
      {activeTool === "bodyFat" && <BodyFat />}
      {activeTool === "heartRate" && <HeartRate />}
      {activeTool === "breath" && <Breath />}
    </PageWrapper>
  );
}

function BMI() {
  const [mode, setMode] = useState("metric");
  const [weight, setWeight] = useState("70"); const [height, setHeight] = useState("175");
  const [weightLbs, setWeightLbs] = useState("154"); const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9"); const [targetBMI, setTargetBMI] = useState("22");

  const wKg = mode === "metric" ? parseFloat(weight)||0 : (parseFloat(weightLbs)||0)*0.453592;
  const hM = mode === "metric" ? (parseFloat(height)||0)/100 : ((parseFloat(heightFt)||0)*12+(parseFloat(heightIn)||0))*0.0254;
  const bmi = hM > 0 ? wKg/(hM*hM) : 0;
  const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const catColor = bmi < 18.5 ? "text-blue-400" : bmi < 25 ? "text-green-500" : bmi < 30 ? "text-amber-500" : "text-red-500";
  const catDot = bmi < 18.5 ? "bg-blue-400" : bmi < 25 ? "bg-green-500" : bmi < 30 ? "bg-amber-500" : "bg-red-500";
  const tBMI = parseFloat(targetBMI)||22;
  const idealKg = tBMI * hM * hM;
  const weightChangeKg = idealKg - wKg;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Body Measurements" icon={Scale} iconColor="bg-rose-500">
          <ModeSelector modes={[{ id:"metric", label:"Metric (kg/cm)" }, { id:"imperial", label:"Imperial (lbs/ft)" }]} active={mode} onChange={setMode} />
          {mode === "metric" ? (
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Weight (kg)" value={weight} onChange={setWeight} type="number" />
              <InputField label="Height (cm)" value={height} onChange={setHeight} type="number" />
            </div>
          ) : (
            <>
              <InputField label="Weight (lbs)" value={weightLbs} onChange={setWeightLbs} type="number" />
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Height (ft)" value={heightFt} onChange={setHeightFt} type="number" />
                <InputField label="Height (in)" value={heightIn} onChange={setHeightIn} type="number" />
              </div>
            </>
          )}
          <InputField label="Target BMI" value={targetBMI} onChange={setTargetBMI} type="number" />
        </InputPanel>
      }
      results={
        <ResultPanel label="Your BMI" primary={fmt(bmi, 1)}
          summaries={<>
            <SummaryCard label="Category" value={category} accent={catColor} />
            <SummaryCard label="Ideal Weight" value={`${fmt(idealKg, 1)} kg`} />
          </>}
          tip="BMI ranges: Underweight < 18.5 | Normal 18.5–24.9 | Overweight 25–29.9 | Obese ≥ 30"
        >
          <BreakdownRow label="BMI" value={fmt(bmi, 1)} dot={catDot} bold />
          <BreakdownRow label="Category" value={category} dot={catDot} />
          <BreakdownRow label="Weight" value={`${fmt(wKg, 1)} kg / ${fmt(wKg*2.20462, 1)} lbs`} dot="bg-blue-400" />
          <BreakdownRow label="Height" value={`${fmt(hM*100, 1)} cm / ${fmt(hM*3.28084, 2)} ft`} dot="bg-purple-400" />
          <BreakdownRow label={`For BMI ${tBMI}`} value={`${fmt(idealKg, 1)} kg / ${fmt(idealKg*2.20462, 1)} lbs`} />
          <BreakdownRow label="Weight to change" value={`${weightChangeKg >= 0 ? "+" : ""}${fmt(weightChangeKg, 1)} kg`} bold />
        </ResultPanel>
      }
    />
  );
}

function BMR() {
  const [gender, setGender] = useState("male"); const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("70"); const [height, setHeight] = useState("175");
  const [age, setAge] = useState("30"); const [activityLevel, setActivityLevel] = useState("moderate");

  const wKg = unit === "metric" ? parseFloat(weight)||0 : (parseFloat(weight)||0)*0.453592;
  const hCm = unit === "metric" ? parseFloat(height)||0 : (parseFloat(height)||0)*2.54;
  const ageN = parseFloat(age)||30;
  const bmr = gender === "male" ? 10*wKg + 6.25*hCm - 5*ageN + 5 : 10*wKg + 6.25*hCm - 5*ageN - 161;
  const actMuls: Record<string, { mul:number; label:string }> = {
    sedentary:{ mul:1.2, label:"Sedentary (desk job)" }, light:{ mul:1.375, label:"Light (1-3 days/wk)" },
    moderate:{ mul:1.55, label:"Moderate (3-5 days/wk)" }, active:{ mul:1.725, label:"Active (6-7 days/wk)" },
    very_active:{ mul:1.9, label:"Very Active (2× day)" },
  };
  const tdee = bmr * (actMuls[activityLevel]?.mul || 1.55);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Physical Profile" icon={Activity} iconColor="bg-orange-500">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Gender</label>
              <div className="flex gap-1.5">
                {["male","female"].map(g => <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize ${gender === g ? "bg-orange-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{g}</button>)}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Unit</label>
              <div className="flex gap-1.5">
                {[{ k:"metric", l:"kg/cm" },{ k:"imperial", l:"lbs/in" }].map(u => <button key={u.k} onClick={() => setUnit(u.k)} className={`flex-1 py-2 rounded-lg text-xs font-bold ${unit === u.k ? "bg-orange-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{u.l}</button>)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <InputField label={`Weight (${unit === "metric" ? "kg" : "lbs"})`} value={weight} onChange={setWeight} type="number" />
            <InputField label={`Height (${unit === "metric" ? "cm" : "in"})`} value={height} onChange={setHeight} type="number" />
            <InputField label="Age" value={age} onChange={setAge} type="number" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Activity Level</label>
            <select value={activityLevel} onChange={e => setActivityLevel(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
              {Object.entries(actMuls).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Basal Metabolic Rate" primary={`${fmt(bmr, 0)} kcal`} primarySub="/day"
          summaries={<>
            <SummaryCard label="TDEE" value={`${fmt(tdee, 0)} kcal`} accent="text-orange-500" />
            <SummaryCard label="Per week" value={`${fmt(tdee*7, 0)} kcal`} />
          </>}
          tip="To lose weight: eat ~500 kcal below TDEE. To gain: eat ~300–500 kcal above TDEE."
        >
          <BreakdownRow label="BMR (Mifflin-St Jeor)" value={`${fmt(bmr, 0)} kcal/day`} dot="bg-orange-400" bold />
          <BreakdownRow label="TDEE" value={`${fmt(tdee, 0)} kcal/day`} dot="bg-green-500" bold />
          <BreakdownRow label="Weight Loss (–500)" value={`${fmt(tdee-500, 0)} kcal/day`} dot="bg-blue-400" />
          <BreakdownRow label="Weight Gain (+400)" value={`${fmt(tdee+400, 0)} kcal/day`} dot="bg-amber-400" />
          <BreakdownRow label="Carbs (50%)" value={`${fmt(tdee*0.5/4, 0)} g/day`} />
          <BreakdownRow label="Protein (25%)" value={`${fmt(tdee*0.25/4, 0)} g/day`} />
          <BreakdownRow label="Fat (25%)" value={`${fmt(tdee*0.25/9, 0)} g/day`} />
        </ResultPanel>
      }
    />
  );
}

function CalorieBurn() {
  const [weight, setWeight] = useState("70");
  const [activity, setActivity] = useState("running");
  const [duration, setDuration] = useState("30"); const [intensity, setIntensity] = useState("moderate");

  const mets: Record<string, { low:number; moderate:number; high:number; label:string }> = {
    running:{ low:8, moderate:11.5, high:16, label:"🏃 Running" },
    cycling:{ low:4, moderate:8, high:12, label:"🚴 Cycling" },
    swimming:{ low:5, moderate:7, high:10, label:"🏊 Swimming" },
    walking:{ low:2.5, moderate:3.5, high:5, label:"🚶 Walking" },
    yoga:{ low:2, moderate:3, high:4, label:"🧘 Yoga" },
    hiit:{ low:7, moderate:10, high:14, label:"🔥 HIIT" },
    weights:{ low:3, moderate:5, high:6, label:"🏋️ Weights" },
    basketball:{ low:6, moderate:8, high:10, label:"🏀 Basketball" },
    dancing:{ low:3, moderate:5, high:7.5, label:"💃 Dancing" },
    rowing:{ low:4.5, moderate:7, high:10, label:"🚣 Rowing" },
  };
  const wKg = parseFloat(weight)||70; const dur = parseFloat(duration)||30;
  const met = (mets[activity] as any)?.[intensity] || 7;
  const kcal = (met * wKg * dur) / 60;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Activity Details" icon={Utensils} iconColor="bg-green-500">
          <InputField label="Body Weight (kg)" value={weight} onChange={setWeight} type="number" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Activity</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(mets).map(([k,v]) => (
                <button key={k} onClick={() => setActivity(k)} className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${activity === k ? "bg-green-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{v.label}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Duration (min)" value={duration} onChange={setDuration} type="number" />
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Intensity</label>
              <div className="flex flex-col gap-1">
                {["low","moderate","high"].map(i => <button key={i} onClick={() => setIntensity(i)} className={`w-full py-1.5 rounded-lg text-xs font-bold capitalize ${intensity === i ? "bg-green-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{i}</button>)}
              </div>
            </div>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Calories Burned" primary={`${fmt(kcal, 0)} kcal`}
          summaries={<>
            <SummaryCard label="Per Minute" value={`${fmt(kcal/(dur||1), 1)} kcal`} accent="text-green-500" />
            <SummaryCard label="MET Value" value={`${met}`} />
          </>}
          tip={`To burn 1 kg of fat you need ~7700 kcal deficit. At ${fmt(kcal, 0)} kcal/session that's ~${fmt(7700/kcal, 1)} sessions.`}
        >
          <BreakdownRow label="MET Value" value={`${met}`} dot="bg-blue-400" />
          <BreakdownRow label="Duration" value={`${duration} min`} dot="bg-purple-400" />
          <BreakdownRow label="Calories Burned" value={`${fmt(kcal, 0)} kcal`} dot="bg-green-500" bold />
          <BreakdownRow label="Per minute" value={`${fmt(kcal/(dur||1), 2)} kcal/min`} dot="bg-amber-400" />
          <BreakdownRow label="Sessions for 1kg fat" value={`${fmt(7700/kcal, 1)} sessions`} />
        </ResultPanel>
      }
    />
  );
}

function WaterIntake() {
  const [weight, setWeight] = useState("70"); const [weightUnit, setWeightUnit] = useState("kg");
  const [activity, setActivity] = useState("moderate"); const [climate, setClimate] = useState("temperate");
  const [currency, setCurrency] = useState("INR");
  const [waterPrice, setWaterPrice] = useState("20"); const [bottleSize, setBottleSize] = useState("1");

  const wKg = weightUnit === "kg" ? parseFloat(weight)||70 : (parseFloat(weight)||0)*0.453592;
  const baseL = wKg * 0.033;
  const actAdd: Record<string, number> = { low:0, moderate:0.5, high:1.0, very_high:1.5 };
  const climAdd: Record<string, number> = { cool:0, temperate:0, warm:0.25, hot:0.5, very_hot:0.75 };
  const totalL = baseL + (actAdd[activity]||0) + (climAdd[climate]||0);
  const bottles = totalL / (parseFloat(bottleSize)||1);
  const glasses = totalL / 0.25;
  const dailyCost = bottles * (parseFloat(waterPrice)||0);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Hydration Profile" icon={Heart} iconColor="bg-cyan-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Body Weight" value={weight} onChange={setWeight} type="number" />
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Unit</label>
              <div className="flex gap-1.5">
                {["kg","lbs"].map(u => <button key={u} onClick={() => setWeightUnit(u)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${weightUnit === u ? "bg-cyan-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{u}</button>)}
              </div>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Activity Level</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(actAdd).map(a => <button key={a} onClick={() => setActivity(a)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${activity === a ? "bg-cyan-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{a.replace("_"," ")}</button>)}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Climate</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(climAdd).map(c => <button key={c} onClick={() => setClimate(c)} className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize ${climate === c ? "bg-cyan-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{c.replace("_"," ")}</button>)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Bottle Size (L)" value={bottleSize} onChange={setBottleSize} type="number" />
            <InputField label="Bottle Price" value={waterPrice} onChange={setWaterPrice} type="number" prefix={cs(currency)} />
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Daily Water Intake" primary={`${fmt(totalL, 2)} L`}
          summaries={<>
            <SummaryCard label="Glasses (250ml)" value={`${Math.ceil(glasses)}`} accent="text-cyan-500" />
            <SummaryCard label="Bottles Needed" value={`${fmt(bottles, 1)}`} />
          </>}
          tip="Drink water regularly throughout the day. Thirst is a late signal of dehydration."
        >
          <BreakdownRow label="Base Need" value={`${fmt(baseL, 2)} L`} dot="bg-cyan-400" />
          <BreakdownRow label="Activity Extra" value={`+${fmt(actAdd[activity]||0, 1)} L`} dot="bg-green-500" />
          <BreakdownRow label="Climate Extra" value={`+${fmt(climAdd[climate]||0, 2)} L`} dot="bg-amber-400" />
          <BreakdownRow label="Total Needed" value={`${fmt(totalL, 2)} L`} dot="bg-blue-400" bold />
          <BreakdownRow label={`${bottleSize}L Bottles`} value={`${fmt(bottles, 1)}`} />
          <BreakdownRow label="Daily Cost" value={`${cs(currency)}${fmt(dailyCost, 1)}`} />
          <BreakdownRow label="Monthly Cost" value={`${cs(currency)}${fmt(dailyCost*30, 1)}`} />
        </ResultPanel>
      }
    />
  );
}

function SleepCalc() {
  const [mode, setMode] = useState("wake");
  const [wakeTime, setWakeTime] = useState("06:30"); const [bedTime, setBedTime] = useState("22:30");
  const [targetCycles, setTargetCycles] = useState("5"); const [age, setAge] = useState("30");

  const toMins = (t: string) => { const [h, m] = t.split(":").map(Number); return h*60+(m||0); };
  const addMins = (t: string, m: number) => {
    let total = (toMins(t)+m) % 1440; if (total < 0) total += 1440;
    return `${String(Math.floor(total/60)).padStart(2,"0")}:${String(total%60).padStart(2,"0")}`;
  };
  const ageN = parseInt(age)||30;
  const ageGroup = ageN < 18 ? "teen" : ageN < 26 ? "young" : ageN < 65 ? "adult" : "senior";
  const ageRec: Record<string, number> = { teen:9, young:8, adult:7.5, senior:7.5 };

  const cycleTimes = Array.from({ length: 6 }, (_, i) => {
    const mins = (i+1)*90 + 14;
    return mode === "wake" ? addMins(wakeTime, -mins) : addMins(bedTime, mins);
  });
  let sleepHrs = 0;
  if (mode === "analyze") {
    let diff = toMins(wakeTime) - toMins(bedTime); if (diff < 0) diff += 1440; sleepHrs = diff/60;
  }
  const cycles = Math.round(sleepHrs/1.5);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Sleep Parameters" icon={Moon} iconColor="bg-indigo-500">
          <ModeSelector modes={[{ id:"wake", label:"By Wake Time" }, { id:"bed", label:"By Bedtime" }, { id:"analyze", label:"Analyze" }]} active={mode} onChange={setMode} />
          <InputField label="Age" value={age} onChange={setAge} type="number" />
          {mode === "wake" && <InputField label="Wake Up Time" value={wakeTime} onChange={setWakeTime} type="time" />}
          {mode === "bed" && <InputField label="Bedtime" value={bedTime} onChange={setBedTime} type="time" />}
          {mode === "analyze" && (
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Bedtime" value={bedTime} onChange={setBedTime} type="time" />
              <InputField label="Wake Time" value={wakeTime} onChange={setWakeTime} type="time" />
            </div>
          )}
          {mode !== "analyze" && <InputField label="Target Cycles (1.5hr each)" value={targetCycles} onChange={setTargetCycles} type="number" />}
        </InputPanel>
      }
      results={
        mode === "analyze" ? (
          <ResultPanel label="Sleep Duration" primary={`${fmt(sleepHrs, 1)} hrs`} primarySub={`${cycles} cycles`}
            summaries={<>
              <SummaryCard label="Recommended" value={`${ageRec[ageGroup]} hrs`} accent="text-indigo-500" />
              <SummaryCard label="Quality" value={sleepHrs >= ageRec[ageGroup] ? "✅ Good" : "⚠️ Low"} />
            </>}
          >
            <BreakdownRow label="Bedtime" value={bedTime} dot="bg-indigo-400" />
            <BreakdownRow label="Wake Time" value={wakeTime} dot="bg-blue-400" />
            <BreakdownRow label="Total Sleep" value={`${fmt(sleepHrs, 1)} hrs`} dot="bg-green-500" bold />
            <BreakdownRow label="Complete Cycles" value={`${cycles}`} dot="bg-purple-400" />
            <BreakdownRow label="Recommended" value={`${ageRec[ageGroup]} hrs`} />
          </ResultPanel>
        ) : (
          <ResultPanel label={mode === "wake" ? "Ideal Bedtimes" : "Wake Up Times"}
            primary={cycleTimes[Math.max(0,(parseInt(targetCycles)||5)-1)] || cycleTimes[4]}
            primarySub={`for ${targetCycles} cycles`}
          >
            {cycleTimes.map((t, i) => (
              <BreakdownRow key={i} label={`${i+1} cycles — ${((i+1)*1.5).toFixed(1)} hrs`} value={t}
                dot={i+1 === parseInt(targetCycles) ? "bg-indigo-500" : "bg-muted"} bold={i+1 === parseInt(targetCycles)} />
            ))}
            <BreakdownRow label="Recommended" value={`${ageRec[ageGroup]} hrs`} />
          </ResultPanel>
        )
      }
    />
  );
}

function Caffeine() {
  const [weight, setWeight] = useState("70"); const [mode, setMode] = useState("limit");
  const [drinks, setDrinks] = useState<Record<string, number>>({ espresso:0, coffee:1, tea:0, cola:0, energyDrink:0 });
  const [sensitivity, setSensitivity] = useState("moderate");

  const caffMg: Record<string, { mg:number; label:string }> = {
    espresso:{ mg:64, label:"☕ Espresso" }, coffee:{ mg:95, label:"☕ Coffee" },
    tea:{ mg:47, label:"🍵 Tea" }, cola:{ mg:34, label:"🥤 Cola" }, energyDrink:{ mg:80, label:"⚡ Energy Drink" },
  };
  const limits: Record<string, number> = { low:200, moderate:400, high:600 };
  const totalMg = Object.entries(drinks).reduce((sum, [k,v]) => sum + v*(caffMg[k]?.mg||0), 0);
  const limit = limits[sensitivity]; const remaining = Math.max(0, limit - totalMg);
  const adj = (key: string, d: number) => setDrinks(prev => ({ ...prev, [key]: Math.max(0, (prev[key]||0)+d) }));

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Caffeine Intake" icon={Coffee} iconColor="bg-amber-600">
          <ModeSelector modes={[{ id:"limit", label:"Daily Limit" }, { id:"timing", label:"Safe Timing" }]} active={mode} onChange={setMode} />
          <InputField label="Body Weight (kg)" value={weight} onChange={setWeight} type="number" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Sensitivity</label>
            <div className="flex gap-1.5">
              {["low","moderate","high"].map(s => <button key={s} onClick={() => setSensitivity(s)} className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize ${sensitivity === s ? "bg-amber-600 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{s}</button>)}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block">Today's Drinks</label>
            {Object.entries(caffMg).map(([k,v]) => (
              <div key={k} className="flex items-center justify-between px-3 py-2 bg-muted/20 rounded-xl">
                <div><p className="text-sm font-medium text-foreground">{v.label}</p><p className="text-xs text-muted-foreground">{v.mg}mg each</p></div>
                <div className="flex items-center gap-2">
                  <button onClick={() => adj(k, -1)} className="w-7 h-7 rounded-full bg-muted text-foreground font-bold text-sm flex items-center justify-center">−</button>
                  <span className="w-5 text-center text-sm font-bold">{drinks[k]}</span>
                  <button onClick={() => adj(k, 1)} className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center">+</button>
                </div>
              </div>
            ))}
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Total Caffeine" primary={`${totalMg} mg`}
          summaries={<>
            <SummaryCard label="Daily Limit" value={`${limit} mg`} />
            <SummaryCard label="Status" value={totalMg <= limit ? "✅ Safe" : "⚠️ Over"} accent={totalMg <= limit ? "text-green-500" : "text-red-500"} />
          </>}
          tip="Caffeine half-life ~5 hours. A 3pm coffee still has ~50% caffeine at 8pm."
        >
          {Object.entries(drinks).filter(([,v]) => v > 0).map(([k,v]) => (
            <BreakdownRow key={k} label={`${v}× ${caffMg[k]?.label}`} value={`${v*(caffMg[k]?.mg||0)} mg`} dot="bg-amber-400" />
          ))}
          <BreakdownRow label="Total Intake" value={`${totalMg} mg`} dot={totalMg <= limit ? "bg-green-500" : "bg-red-500"} bold />
          <BreakdownRow label={`Limit (${sensitivity})`} value={`${limit} mg`} dot="bg-blue-400" />
          <BreakdownRow label="Remaining Safe" value={`${remaining} mg`} bold />
          {mode === "timing" && (
            <>
              <BreakdownRow label="50% gone after" value="+5 hrs" dot="bg-purple-400" />
              <BreakdownRow label="75% gone after" value="+10 hrs" dot="bg-purple-300" />
              <BreakdownRow label="Best cutoff (10pm sleep)" value="Before 2pm" />
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

function BodyFat() {
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("80"); const [height, setHeight] = useState("175");
  const [neck, setNeck] = useState("37"); const [waist, setWaist] = useState("85"); const [hip, setHip] = useState("95");

  const wKg = parseFloat(weight)||80; const hCm = parseFloat(height)||175;
  const neckCm = parseFloat(neck)||37; const waistCm = parseFloat(waist)||85; const hipCm = parseFloat(hip)||95;
  const navy = gender === "male"
    ? 86.010*Math.log10(waistCm-neckCm) - 70.041*Math.log10(hCm) + 36.76
    : 163.205*Math.log10(waistCm+hipCm-neckCm) - 97.684*Math.log10(hCm) - 78.387;
  const bf = Math.max(0, navy); const fat = wKg*(bf/100); const ffm = wKg - fat;
  const ideal = gender === "male" ? 17 : 24;
  const idealFat = wKg*(ideal/100); const fatToLose = Math.max(0, fat - idealFat);

  const catLabel = () => {
    if (gender === "male") return bf < 6 ? "Essential" : bf < 14 ? "Athlete" : bf < 18 ? "Fitness" : bf < 25 ? "Average" : "Obese";
    return bf < 14 ? "Essential" : bf < 21 ? "Athlete" : bf < 25 ? "Fitness" : bf < 32 ? "Average" : "Obese";
  };

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Body Measurements" icon={Dumbbell} iconColor="bg-violet-500">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Gender</label>
            <div className="flex gap-1.5">
              {["male","female"].map(g => <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize ${gender === g ? "bg-violet-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{g}</button>)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Weight (kg)" value={weight} onChange={setWeight} type="number" />
            <InputField label="Height (cm)" value={height} onChange={setHeight} type="number" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <InputField label="Neck (cm)" value={neck} onChange={setNeck} type="number" />
            <InputField label="Waist (cm)" value={waist} onChange={setWaist} type="number" />
            {gender === "female" && <InputField label="Hip (cm)" value={hip} onChange={setHip} type="number" />}
          </div>
          <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-xl">US Navy method — measure at navel (waist), widest point (hip), and below larynx (neck).</div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Body Fat %" primary={`${fmt(bf, 1)}%`}
          summaries={<>
            <SummaryCard label="Category" value={catLabel()} accent={bf <= ideal ? "text-green-500" : "text-amber-500"} />
            <SummaryCard label="Fat Mass" value={`${fmt(fat, 1)} kg`} />
          </>}
          tip="Ideal body fat: Men 14–17% | Women 21–24%. To lose 1 kg fat requires ~7700 kcal deficit."
        >
          <BreakdownRow label="Body Fat %" value={`${fmt(bf, 1)}%`} dot={bf <= ideal ? "bg-green-500" : "bg-amber-500"} bold />
          <BreakdownRow label="Category" value={catLabel()} dot="bg-purple-400" />
          <BreakdownRow label="Fat Mass" value={`${fmt(fat, 1)} kg`} dot="bg-red-400" />
          <BreakdownRow label="Lean Mass" value={`${fmt(ffm, 1)} kg`} dot="bg-green-400" />
          <BreakdownRow label="Ideal Fat %" value={`${ideal}%`} dot="bg-blue-400" />
          <BreakdownRow label="Fat to Lose" value={`${fmt(fatToLose, 1)} kg`} bold />
        </ResultPanel>
      }
    />
  );
}

function HeartRate() {
  const [age, setAge] = useState("30"); const [gender, setGender] = useState("male");
  const [restingHR, setRestingHR] = useState("70"); const [mode, setMode] = useState("zones");

  const ageN = parseFloat(age)||30; const rhr = parseFloat(restingHR)||70;
  const maxHR = gender === "male" ? 220 - ageN : 226 - ageN;
  const hrr = maxHR - rhr;
  const zones = [
    { z:"Zone 1 – Recovery", min:0.5, max:0.6, color:"bg-blue-400" },
    { z:"Zone 2 – Fat Burn", min:0.6, max:0.7, color:"bg-green-500" },
    { z:"Zone 3 – Aerobic", min:0.7, max:0.8, color:"bg-yellow-400" },
    { z:"Zone 4 – Threshold", min:0.8, max:0.9, color:"bg-orange-500" },
    { z:"Zone 5 – Max", min:0.9, max:1.0, color:"bg-red-500" },
  ];

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Heart Rate Data" icon={Heart} iconColor="bg-red-500">
          <ModeSelector modes={[{ id:"zones", label:"Training Zones" }, { id:"karvonen", label:"Karvonen" }]} active={mode} onChange={setMode} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Gender</label>
            <div className="flex gap-1.5">
              {["male","female"].map(g => <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize ${gender === g ? "bg-red-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{g}</button>)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Age" value={age} onChange={setAge} type="number" />
            <InputField label="Resting HR (bpm)" value={restingHR} onChange={setRestingHR} type="number" />
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Max Heart Rate" primary={`${maxHR} bpm`}
          summaries={<>
            <SummaryCard label="HRR" value={`${hrr} bpm`} accent="text-red-500" />
            <SummaryCard label="Resting HR" value={`${restingHR} bpm`} />
          </>}
        >
          <BreakdownRow label="Max HR (formula)" value={`${gender === "male" ? "220" : "226"} − ${ageN} = ${maxHR}`} dot="bg-red-400" bold />
          <BreakdownRow label="HRR (Heart Rate Reserve)" value={`${hrr} bpm`} dot="bg-purple-400" />
          {(mode === "zones" ? zones.map(z => (
            <BreakdownRow key={z.z} label={z.z} value={`${Math.round(maxHR*z.min)}–${Math.round(maxHR*z.max)} bpm`} dot={z.color} />
          )) : zones.map(z => (
            <BreakdownRow key={z.z} label={z.z} value={`${Math.round(rhr+hrr*z.min)}–${Math.round(rhr+hrr*z.max)} bpm`} dot={z.color} />
          )))}
        </ResultPanel>
      }
    />
  );
}

function Breath() {
  const [age, setAge] = useState("30"); const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("175"); const [weight, setWeight] = useState("70");
  const [mode, setMode] = useState("fev");

  const ageN = parseFloat(age)||30; const hCm = parseFloat(height)||175; const wKg = parseFloat(weight)||70;
  const hIn = hCm / 2.54;
  const fvc = gender === "male" ? 0.0576*hIn - 0.0269*ageN - 4.34 : 0.0443*hIn - 0.026*ageN - 2.89;
  const fev1 = gender === "male" ? 0.0666*hIn - 0.0292*ageN - 4.31 : 0.0342*hIn - 0.0255*ageN - 1.578;
  const ratio = fvc > 0 ? fev1/fvc*100 : 0;
  const rv = 0.0217*ageN + 0.0671*hIn - 3.477;
  const bsa = Math.sqrt(hCm * wKg / 3600);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Pulmonary Data" icon={Wind} iconColor="bg-sky-500">
          <ModeSelector modes={[{ id:"fev", label:"FEV Analysis" }, { id:"lung", label:"Lung Volume" }]} active={mode} onChange={setMode} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Gender</label>
            <div className="flex gap-1.5">
              {["male","female"].map(g => <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize ${gender === g ? "bg-sky-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{g}</button>)}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <InputField label="Age" value={age} onChange={setAge} type="number" />
            <InputField label="Height (cm)" value={height} onChange={setHeight} type="number" />
            <InputField label="Weight (kg)" value={weight} onChange={setWeight} type="number" />
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Predicted FVC" primary={`${fmt(fvc, 2)} L`}
          summaries={<>
            <SummaryCard label="FEV1" value={`${fmt(fev1, 2)} L`} accent="text-sky-500" />
            <SummaryCard label="FEV1/FVC" value={`${fmt(ratio, 1)}%`} />
          </>}
          tip="FEV1/FVC < 70% may indicate airway obstruction (COPD, asthma). Consult a doctor for diagnosis."
        >
          <BreakdownRow label="FVC (Forced Vital Cap)" value={`${fmt(fvc, 2)} L`} dot="bg-sky-400" bold />
          <BreakdownRow label="FEV1 (1-sec forced)" value={`${fmt(fev1, 2)} L`} dot="bg-blue-400" bold />
          <BreakdownRow label="FEV1/FVC Ratio" value={`${fmt(ratio, 1)}%`} dot={ratio >= 70 ? "bg-green-500" : "bg-amber-400"} />
          {mode === "lung" && (
            <>
              <BreakdownRow label="BSA" value={`${fmt(bsa, 2)} m²`} dot="bg-purple-400" />
              <BreakdownRow label="Residual Volume" value={`${fmt(rv, 2)} L`} dot="bg-amber-400" />
              <BreakdownRow label="TLC (approx)" value={`${fmt(fvc+rv, 2)} L`} dot="bg-green-400" />
            </>
          )}
        </ResultPanel>
      }
    />
  );
}
