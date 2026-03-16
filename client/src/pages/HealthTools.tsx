import { useState } from "react";
import { Heart, Activity, Flame, Scale, Dumbbell, Moon, UtensilsCrossed, Baby, Star } from "lucide-react";
import { DesktopToolGrid, InputPanel, ResultPanel, SummaryCard, BreakdownRow, InputField, ModeSelector } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "bmi" | "bmr" | "calories" | "water" | "bodyfat" | "sleep" | "cooking" | "pregnancy" | "idealweight";

const fmt = (n: number, d = 2) => (isFinite(n) && !isNaN(n) ? parseFloat(n.toFixed(d)).toLocaleString() : "—");

export default function HealthTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("bmi");
  const tools = [
    { id: "bmi", label: "BMI", icon: Scale },
    { id: "bmr", label: "BMR", icon: Flame },
    { id: "calories", label: "Calories", icon: Activity },
    { id: "water", label: "Water", icon: Dumbbell },
    { id: "bodyfat", label: "Body Fat", icon: Heart },
    { id: "pregnancy", label: "Pregnancy", icon: Baby },
    { id: "idealweight", label: "Ideal Weight", icon: Star },
    { id: "sleep", label: "Sleep", icon: Moon },
    { id: "cooking", label: "Cooking", icon: UtensilsCrossed },
  ];
  return (
    <PageWrapper title="Health & Fitness" subtitle="BMI, BMR, Calorie and nutrition calculators" accentColor="bg-pink-500" tools={tools} activeTool={activeTool} onToolChange={id => setActiveTool(id as ToolType)}>
      {activeTool === "bmi" && <BMICalculator />}
      {activeTool === "bmr" && <BMRCalculator />}
      {activeTool === "calories" && <CalorieCalculator />}
      {activeTool === "water" && <WaterIntake />}
      {activeTool === "bodyfat" && <BodyFatCalculator />}
      {activeTool === "pregnancy" && <PregnancyCalculator />}
      {activeTool === "idealweight" && <IdealWeightCalculator />}
      {activeTool === "sleep" && <SleepCycleCalculator />}
      {activeTool === "cooking" && <CookingConverter />}
    </PageWrapper>
  );
}

function BMICalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");

  const w = unit === "metric" ? parseFloat(weight) || 0 : (parseFloat(weight) || 0) * 0.453592;
  const h = unit === "metric" ? (parseFloat(height) || 0) / 100 : (parseFloat(height) || 0) * 0.0254;
  const bmi = h > 0 ? w / (h * h) : 0;
  const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const catColor = bmi < 18.5 ? "text-blue-400" : bmi < 25 ? "text-green-500" : bmi < 30 ? "text-amber-500" : "text-red-500";
  const catDot = bmi < 18.5 ? "bg-blue-400" : bmi < 25 ? "bg-green-500" : bmi < 30 ? "bg-amber-500" : "bg-red-500";
  const idealKg = 22 * h * h;
  const diff = idealKg - w;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Body Measurements" icon={Scale} iconColor="bg-pink-500">
          <ModeSelector modes={[{ id: "metric", label: "Metric (kg/cm)" }, { id: "imperial", label: "Imperial (lbs/in)" }]} active={unit} onChange={v => setUnit(v as "metric" | "imperial")} />
          <InputField label={unit === "metric" ? "Weight (kg)" : "Weight (lbs)"} value={weight} onChange={setWeight} type="number" />
          <InputField label={unit === "metric" ? "Height (cm)" : "Height (inches)"} value={height} onChange={setHeight} type="number" />
        </InputPanel>
      }
      results={
        <ResultPanel label="Your BMI" primary={fmt(bmi, 1)}
          summaries={<>
            <SummaryCard label="Category" value={category} accent={catColor} />
            <SummaryCard label="Ideal Weight" value={`${fmt(idealKg, 1)} kg`} />
          </>}
          tip="BMI ranges: Underweight <18.5 | Normal 18.5–24.9 | Overweight 25–29.9 | Obese ≥30"
        >
          <BreakdownRow label="BMI" value={fmt(bmi, 1)} dot={catDot} bold />
          <BreakdownRow label="Category" value={category} dot={catDot} />
          <BreakdownRow label="Height" value={`${fmt(h * 100, 1)} cm`} dot="bg-blue-400" />
          <BreakdownRow label="Weight" value={`${fmt(w, 1)} kg`} dot="bg-purple-400" />
          <BreakdownRow label="Ideal Weight (BMI 22)" value={`${fmt(idealKg, 1)} kg`} />
          <BreakdownRow label="Weight Change Needed" value={`${diff >= 0 ? "+" : ""}${fmt(diff, 1)} kg`} bold />
        </ResultPanel>
      }
    />
  );
}

function BMRCalculator() {
  const [age, setAge] = useState("25");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [gender, setGender] = useState<"male" | "female">("male");

  const w = parseFloat(weight) || 0;
  const h = parseFloat(height) || 0;
  const a = parseInt(age) || 0;
  const bmr = gender === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
  const levels = [
    { label: "Sedentary (desk job)", mul: 1.2 },
    { label: "Light (1-3 days/wk)", mul: 1.375 },
    { label: "Moderate (3-5 days/wk)", mul: 1.55 },
    { label: "Active (6-7 days/wk)", mul: 1.725 },
  ];

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Physical Profile" icon={Flame} iconColor="bg-orange-500">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Gender</label>
            <div className="flex gap-1.5">
              {["male", "female"].map(g => (
                <button key={g} onClick={() => setGender(g as "male" | "female")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize ${gender === g ? "bg-orange-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <InputField label="Age" value={age} onChange={setAge} type="number" />
            <InputField label="Weight (kg)" value={weight} onChange={setWeight} type="number" />
            <InputField label="Height (cm)" value={height} onChange={setHeight} type="number" />
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Basal Metabolic Rate" primary={`${Math.round(bmr)}`} primarySub="kcal/day"
          summaries={<>
            <SummaryCard label="TDEE (Moderate)" value={`${Math.round(bmr * 1.55)} kcal`} accent="text-orange-500" />
            <SummaryCard label="Per week" value={`${Math.round(bmr * 1.55 * 7)} kcal`} />
          </>}
          tip="To lose weight: eat 500 kcal below TDEE. To gain: eat 300–500 above."
        >
          <BreakdownRow label="BMR (Mifflin-St Jeor)" value={`${Math.round(bmr)} kcal/day`} dot="bg-orange-400" bold />
          {levels.map(l => (
            <BreakdownRow key={l.label} label={l.label} value={`${Math.round(bmr * l.mul)} kcal/day`} dot="bg-blue-400" />
          ))}
        </ResultPanel>
      }
    />
  );
}

function CalorieCalculator() {
  const [activity, setActivity] = useState("Running");
  const [duration, setDuration] = useState("30");
  const [weight, setWeight] = useState("70");

  const activities = [
    { name: "Walking", met: 3.5 }, { name: "Running", met: 8 },
    { name: "Cycling", met: 7 }, { name: "Swimming", met: 6 },
    { name: "Yoga", met: 2.5 }, { name: "Weight Training", met: 5 },
    { name: "HIIT", met: 10 }, { name: "Dancing", met: 4.5 },
  ];
  const sel = activities.find(a => a.name === activity);
  const dur = parseFloat(duration) || 30;
  const calories = sel ? Math.round((sel.met * 3.5 * (parseFloat(weight) || 0)) / 200 * dur) : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Activity Details" icon={Activity} iconColor="bg-red-500">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Activity</label>
            <div className="grid grid-cols-2 gap-1.5">
              {activities.map(a => (
                <button key={a.name} onClick={() => setActivity(a.name)}
                  data-testid={`button-activity-${a.name.toLowerCase()}`}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold ${activity === a.name ? "bg-red-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>
                  {a.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Duration (min)" value={duration} onChange={setDuration} type="number" />
            <InputField label="Weight (kg)" value={weight} onChange={setWeight} type="number" />
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Calories Burned" primary={`${calories}`} primarySub="kcal"
          summaries={<>
            <SummaryCard label="Per minute" value={`${fmt(calories / dur, 1)} kcal`} accent="text-red-500" />
            <SummaryCard label="MET Value" value={`${sel?.met || 0}`} />
          </>}
          tip={`At ${sel?.met || 0} MET, ${activity} burns ~${fmt(calories / dur, 1)} kcal/min. To burn 1 kg fat: ~7700 kcal.`}
        >
          <BreakdownRow label="Activity" value={activity} dot="bg-red-400" bold />
          <BreakdownRow label="MET value" value={`${sel?.met}`} dot="bg-blue-400" />
          <BreakdownRow label="Duration" value={`${duration} min`} dot="bg-purple-400" />
          <BreakdownRow label="Calories Burned" value={`${calories} kcal`} dot="bg-green-500" bold />
          <BreakdownRow label="Sessions for 1 kg fat" value={`${fmt(7700 / (calories || 1), 1)}`} />
        </ResultPanel>
      }
    />
  );
}

function WaterIntake() {
  const [weight, setWeight] = useState("70");
  const [activity, setActivity] = useState<"low" | "moderate" | "high">("moderate");

  const base = (parseFloat(weight) || 0) * 0.033;
  const muls: Record<string, number> = { low: 1, moderate: 1.2, high: 1.4 };
  const recommended = base * muls[activity];
  const glasses = Math.ceil(recommended / 0.25);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Hydration Profile" icon={Dumbbell} iconColor="bg-cyan-500">
          <InputField label="Body Weight (kg)" value={weight} onChange={setWeight} type="number" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Activity Level</label>
            <div className="flex gap-1.5">
              {["low", "moderate", "high"].map(a => (
                <button key={a} onClick={() => setActivity(a as "low" | "moderate" | "high")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize ${activity === a ? "bg-cyan-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Daily Water Need" primary={`${fmt(recommended, 1)} L`}
          summaries={<>
            <SummaryCard label="Glasses (250ml)" value={`${glasses}`} accent="text-cyan-500" />
            <SummaryCard label="Milliliters" value={`${Math.round(recommended * 1000)} ml`} />
          </>}
          tip="Drink water throughout the day. Thirst is a late signal of dehydration."
        >
          <BreakdownRow label="Base Need" value={`${fmt(base, 2)} L`} dot="bg-cyan-400" />
          <BreakdownRow label="Activity Multiplier" value={`${muls[activity]}×`} dot="bg-blue-400" />
          <BreakdownRow label="Total Needed" value={`${fmt(recommended, 2)} L`} dot="bg-green-500" bold />
          <BreakdownRow label="250 ml Glasses" value={`${glasses} glasses`} dot="bg-purple-400" />
          <BreakdownRow label="500 ml Bottles" value={`${Math.ceil(recommended / 0.5)} bottles`} />
        </ResultPanel>
      }
    />
  );
}

function BodyFatCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("80");
  const [height, setHeight] = useState("175");
  const [neck, setNeck] = useState("37");
  const [waist, setWaist] = useState("85");
  const [hip, setHip] = useState("95");

  const wKg = parseFloat(weight) || 80;
  const hCm = parseFloat(height) || 175;
  const neckCm = parseFloat(neck) || 37;
  const waistCm = parseFloat(waist) || 85;
  const hipCm = parseFloat(hip) || 95;

  const navy = gender === "male"
    ? 86.010 * Math.log10(waistCm - neckCm) - 70.041 * Math.log10(hCm) + 36.76
    : 163.205 * Math.log10(waistCm + hipCm - neckCm) - 97.684 * Math.log10(hCm) - 78.387;
  const bf = Math.max(0, navy);
  const fat = wKg * (bf / 100);
  const lean = wKg - fat;
  const ideal = gender === "male" ? 17 : 24;
  const bfColor = bf <= ideal ? "text-green-500" : bf <= ideal + 10 ? "text-amber-500" : "text-red-500";
  const bfDot = bf <= ideal ? "bg-green-500" : bf <= ideal + 10 ? "bg-amber-500" : "bg-red-500";
  const catLabel = gender === "male"
    ? (bf < 6 ? "Essential" : bf < 14 ? "Athlete" : bf < 18 ? "Fitness" : bf < 25 ? "Average" : "Obese")
    : (bf < 14 ? "Essential" : bf < 21 ? "Athlete" : bf < 25 ? "Fitness" : bf < 32 ? "Average" : "Obese");

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Body Measurements" icon={Heart} iconColor="bg-rose-500">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Gender</label>
            <div className="flex gap-1.5">
              {["male", "female"].map(g => (
                <button key={g} onClick={() => setGender(g as "male" | "female")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize ${gender === g ? "bg-rose-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Weight (kg)" value={weight} onChange={setWeight} type="number" />
            <InputField label="Height (cm)" value={height} onChange={setHeight} type="number" />
          </div>
          <div className={`grid ${gender === "female" ? "grid-cols-3" : "grid-cols-2"} gap-2`}>
            <InputField label="Neck (cm)" value={neck} onChange={setNeck} type="number" />
            <InputField label="Waist (cm)" value={waist} onChange={setWaist} type="number" />
            {gender === "female" && <InputField label="Hip (cm)" value={hip} onChange={setHip} type="number" />}
          </div>
          <p className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-xl">US Navy method. Measure waist at navel, neck below larynx, hip at widest point.</p>
        </InputPanel>
      }
      results={
        <ResultPanel label="Body Fat %" primary={`${fmt(bf, 1)}%`}
          summaries={<>
            <SummaryCard label="Category" value={catLabel} accent={bfColor} />
            <SummaryCard label="Fat Mass" value={`${fmt(fat, 1)} kg`} />
          </>}
          tip={`Ideal body fat: Men 14–17%, Women 21–24%. To lose 1 kg fat ≈ 7700 kcal deficit.`}
        >
          <BreakdownRow label="Body Fat %" value={`${fmt(bf, 1)}%`} dot={bfDot} bold />
          <BreakdownRow label="Category" value={catLabel} dot="bg-purple-400" />
          <BreakdownRow label="Fat Mass" value={`${fmt(fat, 1)} kg`} dot="bg-red-400" />
          <BreakdownRow label="Lean Mass" value={`${fmt(lean, 1)} kg`} dot="bg-green-400" />
          <BreakdownRow label="Ideal Fat %" value={`${ideal}%`} dot="bg-blue-400" />
        </ResultPanel>
      }
    />
  );
}

function PregnancyCalculator() {
  const [mode, setMode] = useState("lmp");
  const [lmpDate, setLmpDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 70);
    return d.toISOString().split("T")[0];
  });
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 210);
    return d.toISOString().split("T")[0];
  });

  const today = new Date();
  const lmp = new Date(lmpDate);
  const due = mode === "lmp" ? new Date(lmp.getTime() + 280 * 86400000) : new Date(dueDate);
  const conception = new Date(lmp.getTime() + 14 * 86400000);
  const daysPreg = Math.floor((today.getTime() - lmp.getTime()) / 86400000);
  const weeksPreg = Math.floor(daysPreg / 7);
  const daysRem = daysPreg % 7;
  const daysLeft = Math.max(0, Math.floor((due.getTime() - today.getTime()) / 86400000));
  const trimester = weeksPreg < 13 ? "1st Trimester" : weeksPreg < 27 ? "2nd Trimester" : "3rd Trimester";
  const progress = Math.min(100, Math.max(0, (daysPreg / 280) * 100));

  const fmtDate = (d: Date) => d.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" });

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Pregnancy Details" icon={Baby} iconColor="bg-pink-500">
          <ModeSelector modes={[{ id: "lmp", label: "From LMP Date" }, { id: "due", label: "From Due Date" }]} active={mode} onChange={setMode} />
          {mode === "lmp" ? (
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Last Menstrual Period (LMP)</label>
              <input type="date" value={lmpDate} onChange={e => setLmpDate(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          ) : (
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Expected Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          )}
          <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20">
            <p className="text-xs text-pink-400 font-medium">Naegele's Rule: LMP + 280 days (40 weeks). Based on a 28-day cycle.</p>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Weeks Pregnant" primary={`${weeksPreg}w ${daysRem}d`}
          summaries={<>
            <SummaryCard label="Trimester" value={trimester} accent="text-pink-500" />
            <SummaryCard label="Days Left" value={`${daysLeft} days`} />
          </>}
        >
          <BreakdownRow label="LMP Date" value={fmtDate(lmp)} dot="bg-pink-400" />
          <BreakdownRow label="Conception (est.)" value={fmtDate(conception)} dot="bg-purple-400" />
          <BreakdownRow label="Due Date" value={fmtDate(due)} dot="bg-blue-400" bold />
          <BreakdownRow label="Weeks Pregnant" value={`${weeksPreg}w ${daysRem}d`} dot="bg-green-500" bold />
          <BreakdownRow label="Days Remaining" value={`${daysLeft} days`} dot="bg-amber-400" />
          <BreakdownRow label="Progress" value={`${fmt(progress, 1)}%`} />
        </ResultPanel>
      }
    />
  );
}

function IdealWeightCalculator() {
  const [height, setHeight] = useState("170");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const h = parseFloat(height) || 0;
  const hCm = unit === "metric" ? h : h * 2.54;
  const hIn = hCm / 2.54;
  const hamwi = gender === "male" ? 48 + 2.7 * (hIn - 60) : 45.5 + 2.2 * (hIn - 60);
  const devine = gender === "male" ? 50 + 2.3 * (hIn - 60) : 45.5 + 2.3 * (hIn - 60);
  const robinson = gender === "male" ? 52 + 1.9 * (hIn - 60) : 49 + 1.7 * (hIn - 60);
  const miller = gender === "male" ? 56.2 + 1.41 * (hIn - 60) : 53.1 + 1.36 * (hIn - 60);
  const average = (hamwi + devine + robinson + miller) / 4;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Physical Profile" icon={Star} iconColor="bg-blue-500">
          <ModeSelector modes={[{ id: "metric", label: "Metric (cm)" }, { id: "imperial", label: "Imperial (in)" }]} active={unit} onChange={v => setUnit(v as "metric" | "imperial")} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Gender</label>
            <div className="flex gap-1.5">
              {["male", "female"].map(g => (
                <button key={g} onClick={() => setGender(g as "male" | "female")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize ${gender === g ? "bg-blue-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <InputField label={unit === "metric" ? "Height (cm)" : "Height (inches)"} value={height} onChange={setHeight} type="number" />
        </InputPanel>
      }
      results={
        <ResultPanel label="Ideal Weight (avg)" primary={`${fmt(average, 1)} kg`}
          summaries={<>
            <SummaryCard label="In lbs" value={`${fmt(average * 2.205, 1)} lbs`} accent="text-blue-500" />
            <SummaryCard label="Height" value={`${fmt(hCm, 0)} cm`} />
          </>}
          tip="These are statistical guidelines, not absolute targets. Healthy weight varies by body composition."
        >
          <BreakdownRow label="Hamwi Formula" value={`${fmt(hamwi, 1)} kg / ${fmt(hamwi * 2.205, 1)} lbs`} dot="bg-blue-400" />
          <BreakdownRow label="Devine Formula" value={`${fmt(devine, 1)} kg / ${fmt(devine * 2.205, 1)} lbs`} dot="bg-green-400" />
          <BreakdownRow label="Robinson Formula" value={`${fmt(robinson, 1)} kg / ${fmt(robinson * 2.205, 1)} lbs`} dot="bg-purple-400" />
          <BreakdownRow label="Miller Formula" value={`${fmt(miller, 1)} kg / ${fmt(miller * 2.205, 1)} lbs`} dot="bg-amber-400" />
          <BreakdownRow label="Average" value={`${fmt(average, 1)} kg`} dot="bg-pink-500" bold />
        </ResultPanel>
      }
    />
  );
}

function SleepCycleCalculator() {
  const [mode, setMode] = useState("wake");
  const [wakeTime, setWakeTime] = useState("06:30");
  const [bedTime, setBedTime] = useState("22:30");

  const toMins = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + (m || 0); };
  const addMins = (t: string, m: number) => {
    let total = (toMins(t) + m) % 1440;
    if (total < 0) total += 1440;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  };

  const cycleTimes = Array.from({ length: 6 }, (_, i) => {
    const mins = (i + 1) * 90 + 14;
    return mode === "wake" ? addMins(wakeTime, -mins) : addMins(bedTime, mins);
  });

  let sleepHrs = 0;
  if (mode === "analyze") {
    let diff = toMins(wakeTime) - toMins(bedTime);
    if (diff < 0) diff += 1440;
    sleepHrs = diff / 60;
  }

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Sleep Parameters" icon={Moon} iconColor="bg-indigo-500">
          <ModeSelector modes={[{ id: "wake", label: "By Wake Time" }, { id: "bed", label: "By Bedtime" }, { id: "analyze", label: "Analyze" }]} active={mode} onChange={setMode} />
          {mode === "wake" && <InputField label="Wake Up Time" value={wakeTime} onChange={setWakeTime} type="time" />}
          {mode === "bed" && <InputField label="Bedtime" value={bedTime} onChange={setBedTime} type="time" />}
          {mode === "analyze" && (
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Bedtime" value={bedTime} onChange={setBedTime} type="time" />
              <InputField label="Wake Time" value={wakeTime} onChange={setWakeTime} type="time" />
            </div>
          )}
          <p className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-xl">Each sleep cycle = 90 min. 14 min to fall asleep is factored in.</p>
        </InputPanel>
      }
      results={
        mode === "analyze" ? (
          <ResultPanel label="Sleep Duration" primary={`${fmt(sleepHrs, 1)} hrs`} primarySub={`${Math.round(sleepHrs / 1.5)} cycles`}
            summaries={<>
              <SummaryCard label="Recommended" value="7–9 hrs" accent="text-indigo-500" />
              <SummaryCard label="Quality" value={sleepHrs >= 7 ? "✅ Good" : "⚠️ Low"} />
            </>}
          >
            <BreakdownRow label="Bedtime" value={bedTime} dot="bg-indigo-400" />
            <BreakdownRow label="Wake Time" value={wakeTime} dot="bg-blue-400" />
            <BreakdownRow label="Total Sleep" value={`${fmt(sleepHrs, 1)} hrs`} dot="bg-green-500" bold />
            <BreakdownRow label="Complete Cycles" value={`${Math.round(sleepHrs / 1.5)}`} dot="bg-purple-400" />
          </ResultPanel>
        ) : (
          <ResultPanel label={mode === "wake" ? "Ideal Bedtimes" : "Wake Up Times"} primary={cycleTimes[4]} primarySub="for 5 cycles (best)">
            {cycleTimes.map((t, i) => (
              <BreakdownRow key={i} label={`${i + 1} cycle${i > 0 ? "s" : ""} — ${((i + 1) * 1.5).toFixed(1)} hrs`} value={t} dot={i === 4 ? "bg-indigo-500" : "bg-muted"} bold={i === 4} />
            ))}
          </ResultPanel>
        )
      }
    />
  );
}

function CookingConverter() {
  const [amount, setAmount] = useState("1");
  const [fromUnit, setFromUnit] = useState("cup");

  const conversions: Record<string, Record<string, number>> = {
    cup: { tbsp: 16, tsp: 48, ml: 237, oz: 8, g: 128 },
    tbsp: { cup: 0.0625, tsp: 3, ml: 14.79, oz: 0.5, g: 8 },
    tsp: { cup: 0.0208, tbsp: 0.333, ml: 4.93, oz: 0.167, g: 2.67 },
    ml: { cup: 0.00422, tbsp: 0.0676, tsp: 0.203, oz: 0.0338, g: 0.54 },
    oz: { cup: 0.125, tbsp: 2, tsp: 6, ml: 29.57, g: 16 },
  };
  const val = parseFloat(amount) || 0;
  const units = Object.keys(conversions);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Cooking Unit Input" icon={UtensilsCrossed} iconColor="bg-amber-500">
          <InputField label="Amount" value={amount} onChange={setAmount} type="number" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">From Unit</label>
            <div className="flex gap-1.5 flex-wrap">
              {units.map(u => (
                <button key={u} onClick={() => setFromUnit(u)} data-testid={`button-unit-${u}`}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold ${fromUnit === u ? "bg-amber-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>
                  {u}
                </button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Conversions" primary={`${val} ${fromUnit}`}>
          {Object.entries(conversions[fromUnit] || {}).map(([unit, factor]) => (
            <BreakdownRow key={unit} label={unit.toUpperCase()} value={fmt(val * factor, 2)} dot="bg-amber-400" bold={unit === "ml"} />
          ))}
        </ResultPanel>
      }
    />
  );
}
