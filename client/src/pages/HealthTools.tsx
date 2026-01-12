import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Activity, Flame, Scale, Dumbbell, Footprints, Moon, UtensilsCrossed, Clock } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "bmi" | "bmr" | "calories" | "water" | "bodyfat" | "sleep" | "cooking" | "pregnancy" | "idealweight";

export default function HealthTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("bmi");

  const tools = [
    { id: "bmi", label: "BMI", icon: Scale },
    { id: "bmr", label: "BMR", icon: Flame },
    { id: "calories", label: "Calories", icon: Activity },
    { id: "water", label: "Water", icon: Dumbbell },
    { id: "bodyfat", label: "Body Fat", icon: Footprints },
    { id: "pregnancy", label: "Pregnancy", icon: Heart },
    { id: "idealweight", label: "Ideal Weight", icon: Scale },
    { id: "sleep", label: "Sleep", icon: Moon },
    { id: "cooking", label: "Cooking", icon: UtensilsCrossed },
  ];

  return (
    <PageWrapper
      title="Health & Fitness"
      subtitle="BMI, BMR, Calorie and nutrition calculators"
      accentColor="bg-pink-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
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
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  const calculate = () => {
    let w = parseFloat(weight);
    let h = parseFloat(height);

    if (unit === "imperial") {
      w = w * 0.453592; // lbs to kg
      h = h * 2.54; // inches to cm
    }

    const bmi = w / Math.pow(h / 100, 2);
    
    let category = "";
    let color = "";
    if (bmi < 18.5) { category = "Underweight"; color = "text-blue-400"; }
    else if (bmi < 25) { category = "Normal"; color = "text-emerald-400"; }
    else if (bmi < 30) { category = "Overweight"; color = "text-yellow-400"; }
    else { category = "Obese"; color = "text-red-400"; }

    setResult({ bmi, category, color });
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="BMI Calculator" icon={Scale} iconColor="bg-pink-500">
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            {["metric", "imperial"].map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u as "metric" | "imperial")}
                data-testid={`button-unit-${u}`}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  unit === u ? "bg-pink-500 text-foreground" : "bg-muted/80 text-muted-foreground"
                }`}
              >
                {u === "metric" ? "Metric (kg/cm)" : "Imperial (lbs/in)"}
              </button>
            ))}
          </div>
          <InputField 
            label={unit === "metric" ? "Weight (kg)" : "Weight (lbs)"} 
            value={weight} 
            onChange={setWeight} 
            type="number" 
          />
          <InputField 
            label={unit === "metric" ? "Height (cm)" : "Height (inches)"} 
            value={height} 
            onChange={setHeight} 
            type="number" 
          />
          <ToolButton onClick={calculate} variant="primary" className="bg-pink-500 hover:bg-pink-600">
            Calculate BMI
          </ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Your BMI" icon={Heart} iconColor="bg-pink-500">
            <div className="text-center py-4">
              <div className="text-5xl font-bold text-foreground mb-2">{result.bmi.toFixed(1)}</div>
              <div className={`text-xl font-medium ${result.color}`}>{result.category}</div>
              <div className="mt-6 bg-muted/50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-400">Underweight</span>
                  <span className="text-emerald-400">Normal</span>
                  <span className="text-yellow-400">Overweight</span>
                  <span className="text-red-400">Obese</span>
                </div>
                <div className="h-2 bg-gradient-to-r from-blue-500 via-emerald-500 via-yellow-500 to-red-500 rounded-full relative">
                  <div 
                    className="absolute w-3 h-3 bg-white rounded-full -top-0.5 shadow-lg"
                    style={{ left: `${Math.min(Math.max((result.bmi - 15) / 25 * 100, 0), 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>15</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40</span>
                </div>
              </div>
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function BMRCalculator() {
  const [age, setAge] = useState("25");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    // Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    setResult(Math.round(bmr));
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="BMR Calculator" icon={Flame} iconColor="bg-orange-500">
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            {["male", "female"].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g as "male" | "female")}
                data-testid={`button-gender-${g}`}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  gender === g ? "bg-orange-500 text-foreground" : "bg-muted/80 text-muted-foreground"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <InputField label="Age" value={age} onChange={setAge} type="number" />
          <InputField label="Weight (kg)" value={weight} onChange={setWeight} type="number" />
          <InputField label="Height (cm)" value={height} onChange={setHeight} type="number" />
          <ToolButton onClick={calculate} variant="primary" className="bg-orange-500 hover:bg-orange-600">
            Calculate BMR
          </ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Your BMR" icon={Activity} iconColor="bg-emerald-500">
            <div className="text-center py-4">
              <div className="text-5xl font-bold text-foreground mb-2">
                {result}
                <span className="text-xl text-muted-foreground ml-2">cal/day</span>
              </div>
              <p className="text-muted-foreground text-sm">Calories burned at rest</p>
            </div>
            <div className="space-y-2 mt-4">
              <ResultDisplay label="Sedentary (little exercise)" value={`${Math.round(result * 1.2)} cal`} />
              <ResultDisplay label="Light (1-3 days/week)" value={`${Math.round(result * 1.375)} cal`} />
              <ResultDisplay label="Moderate (3-5 days/week)" value={`${Math.round(result * 1.55)} cal`} />
              <ResultDisplay label="Active (6-7 days/week)" value={`${Math.round(result * 1.725)} cal`} highlight />
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function CalorieCalculator() {
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("30");
  const [weight, setWeight] = useState("70");

  const activities = [
    { name: "Walking", met: 3.5 },
    { name: "Running", met: 8 },
    { name: "Cycling", met: 7 },
    { name: "Swimming", met: 6 },
    { name: "Yoga", met: 2.5 },
    { name: "Weight Training", met: 5 },
    { name: "HIIT", met: 10 },
    { name: "Dancing", met: 4.5 },
  ];

  const selectedActivity = activities.find((a) => a.name === activity);
  const calories = selectedActivity
    ? Math.round((selectedActivity.met * 3.5 * parseFloat(weight)) / 200 * parseInt(duration))
    : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Calorie Burn" icon={Flame} iconColor="bg-red-500">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Activity</label>
            <div className="grid grid-cols-2 gap-2">
              {activities.map((a) => (
                <button
                  key={a.name}
                  onClick={() => setActivity(a.name)}
                  data-testid={`button-activity-${a.name.toLowerCase()}`}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    activity === a.name
                      ? "bg-red-500 text-foreground"
                      : "bg-muted/80 text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>
          <InputField label="Duration (minutes)" value={duration} onChange={setDuration} type="number" />
          <InputField label="Your Weight (kg)" value={weight} onChange={setWeight} type="number" />
        </div>
      </ToolCard>

      {activity && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Calories Burned" icon={Activity} iconColor="bg-emerald-500">
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-red-400 mb-2">
                {calories}
                <span className="text-xl text-muted-foreground ml-2">cal</span>
              </div>
              <p className="text-muted-foreground">
                {activity} for {duration} minutes
              </p>
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function WaterIntake() {
  const [weight, setWeight] = useState("70");
  const [activity, setActivity] = useState<"low" | "moderate" | "high">("moderate");

  const baseWater = parseFloat(weight) * 0.033;
  const activityMultiplier = { low: 1, moderate: 1.2, high: 1.4 };
  const recommended = (baseWater * activityMultiplier[activity]).toFixed(1);
  const glasses = Math.ceil(parseFloat(recommended) / 0.25);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Water Intake" icon={Dumbbell} iconColor="bg-cyan-500">
        <div className="space-y-4">
          <InputField label="Your Weight (kg)" value={weight} onChange={setWeight} type="number" />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Activity Level</label>
            <div className="flex gap-2">
              {(["low", "moderate", "high"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setActivity(level)}
                  data-testid={`button-activity-${level}`}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    activity === level
                      ? "bg-cyan-500 text-foreground"
                      : "bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Daily Recommendation" icon={Activity} iconColor="bg-blue-500">
        <div className="text-center py-6">
          <div className="text-5xl font-bold text-cyan-400 mb-2">
            {recommended}
            <span className="text-xl text-muted-foreground ml-2">L</span>
          </div>
          <p className="text-muted-foreground">
            That's about <span className="text-foreground font-medium">{glasses} glasses</span> of water
          </p>
        </div>
      </ToolCard>
    </div>
  );
}

function BodyFatCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [waist, setWaist] = useState("85");
  const [neck, setNeck] = useState("38");
  const [height, setHeight] = useState("175");
  const [hip, setHip] = useState("95");

  const w = parseFloat(waist) || 0;
  const n = parseFloat(neck) || 0;
  const h = parseFloat(height) || 0;
  const hp = parseFloat(hip) || 0;

  let bodyFat = 0;
  if (gender === "male") {
    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
  } else {
    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450;
  }

  const category = bodyFat < 10 ? "Essential" : bodyFat < 14 ? "Athletes" : bodyFat < 21 ? "Fitness" : bodyFat < 25 ? "Average" : "Obese";

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Body Fat Calculator" icon={Footprints} iconColor="bg-orange-500">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setGender("male")} className={`flex-1 py-2 rounded-lg ${gender === "male" ? "bg-orange-500 text-foreground" : "bg-muted text-muted-foreground"}`} data-testid="button-gender-male">Male</button>
            <button onClick={() => setGender("female")} className={`flex-1 py-2 rounded-lg ${gender === "female" ? "bg-orange-500 text-foreground" : "bg-muted text-muted-foreground"}`} data-testid="button-gender-female">Female</button>
          </div>
          <InputField label="Waist (cm)" value={waist} onChange={setWaist} type="number" />
          <InputField label="Neck (cm)" value={neck} onChange={setNeck} type="number" />
          <InputField label="Height (cm)" value={height} onChange={setHeight} type="number" />
          {gender === "female" && <InputField label="Hip (cm)" value={hip} onChange={setHip} type="number" />}
        </div>
      </ToolCard>

      <ToolCard title="Body Fat Percentage" icon={Activity} iconColor="bg-emerald-500">
        <div className="text-center py-4">
          <div className="text-5xl font-bold text-orange-400">{bodyFat.toFixed(1)}%</div>
          <p className="text-muted-foreground mt-2">Category: <span className="text-foreground font-medium">{category}</span></p>
        </div>
      </ToolCard>
    </div>
  );
}

function PregnancyCalculator() {
  const [lmpDate, setLmpDate] = useState("");
  const [result, setResult] = useState<{ dueDate: string; weeks: number; days: number; trimester: number; progress: number } | null>(null);

  const calculate = () => {
    if (!lmpDate) return;
    const lmp = new Date(lmpDate);
    const now = new Date();
    
    const dueDate = new Date(lmp);
    dueDate.setDate(dueDate.getDate() + 280);
    
    const totalDays = Math.floor((now.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;
    
    let trimester = 1;
    if (weeks >= 13 && weeks < 27) trimester = 2;
    else if (weeks >= 27) trimester = 3;
    
    const progress = Math.min((totalDays / 280) * 100, 100);
    
    setResult({
      dueDate: dueDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      weeks,
      days,
      trimester,
      progress,
    });
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Pregnancy Due Date" icon={Heart} iconColor="bg-pink-500">
        <div className="space-y-4">
          <InputField label="Last Menstrual Period (LMP)" value={lmpDate} onChange={setLmpDate} type="date" />
          <ToolButton onClick={calculate} variant="primary" className="bg-pink-500 hover:bg-pink-600">
            Calculate Due Date
          </ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Pregnancy Progress" icon={Activity} iconColor="bg-emerald-500">
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-pink-400 mb-2">
                {result.weeks} weeks, {result.days} days
              </div>
              <p className="text-muted-foreground">Trimester {result.trimester}</p>
              
              <div className="mt-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{result.progress.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all"
                    style={{ width: `${result.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted/30 rounded-xl">
                <p className="text-sm text-muted-foreground">Estimated Due Date</p>
                <p className="text-lg font-medium text-foreground mt-1">{result.dueDate}</p>
              </div>
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function IdealWeightCalculator() {
  const [height, setHeight] = useState("170");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const h = parseFloat(height) || 0;
  const heightCm = unit === "metric" ? h : h * 2.54;
  const heightInches = heightCm / 2.54;

  const hamwiMale = 48 + 2.7 * (heightInches - 60);
  const hamwiFemale = 45.5 + 2.2 * (heightInches - 60);
  const hamwi = gender === "male" ? hamwiMale : hamwiFemale;

  const devineMale = 50 + 2.3 * (heightInches - 60);
  const devineFemale = 45.5 + 2.3 * (heightInches - 60);
  const devine = gender === "male" ? devineMale : devineFemale;

  const robinsonMale = 52 + 1.9 * (heightInches - 60);
  const robinsonFemale = 49 + 1.7 * (heightInches - 60);
  const robinson = gender === "male" ? robinsonMale : robinsonFemale;

  const millerMale = 56.2 + 1.41 * (heightInches - 60);
  const millerFemale = 53.1 + 1.36 * (heightInches - 60);
  const miller = gender === "male" ? millerMale : millerFemale;

  const average = (hamwi + devine + robinson + miller) / 4;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Ideal Weight Calculator" icon={Scale} iconColor="bg-blue-500">
        <div className="space-y-4">
          <div className="flex gap-2">
            {["metric", "imperial"].map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u as "metric" | "imperial")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  unit === u ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"
                }`}
                data-testid={`button-unit-${u}`}
              >
                {u === "metric" ? "Metric (cm)" : "Imperial (in)"}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {["male", "female"].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g as "male" | "female")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  gender === g ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"
                }`}
                data-testid={`button-gender-${g}`}
              >
                {g}
              </button>
            ))}
          </div>
          <InputField 
            label={unit === "metric" ? "Height (cm)" : "Height (inches)"} 
            value={height} 
            onChange={setHeight} 
            type="number" 
          />
        </div>
      </ToolCard>

      <ToolCard title="Ideal Weight Range" icon={Activity} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <div className="text-center py-4 mb-4">
            <div className="text-4xl font-bold text-blue-400">{average.toFixed(1)} kg</div>
            <p className="text-muted-foreground text-sm">Average Ideal Weight</p>
            <p className="text-foreground text-sm mt-1">{(average * 2.205).toFixed(1)} lbs</p>
          </div>
          <ResultDisplay label="Hamwi Formula" value={`${hamwi.toFixed(1)} kg`} />
          <ResultDisplay label="Devine Formula" value={`${devine.toFixed(1)} kg`} />
          <ResultDisplay label="Robinson Formula" value={`${robinson.toFixed(1)} kg`} />
          <ResultDisplay label="Miller Formula" value={`${miller.toFixed(1)} kg`} />
        </div>
      </ToolCard>
    </div>
  );
}

function SleepCycleCalculator() {
  const [wakeTime, setWakeTime] = useState("07:00");

  const getOptimalSleepTimes = () => {
    const [hours, minutes] = wakeTime.split(":").map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(hours, minutes, 0, 0);
    
    const cycles = [6, 5, 4];
    return cycles.map((c) => {
      const sleepTime = new Date(wakeDate.getTime() - (c * 90 + 15) * 60000);
      return { cycles: c, time: sleepTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), hours: (c * 1.5).toFixed(1) };
    });
  };

  const sleepTimes = getOptimalSleepTimes();

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Sleep Cycle Calculator" icon={Moon} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <InputField label="Wake Up Time" value={wakeTime} onChange={setWakeTime} type="time" />
        </div>
      </ToolCard>

      <ToolCard title="Optimal Bedtimes" icon={Clock} iconColor="bg-emerald-500">
        <div className="space-y-3">
          {sleepTimes.map((s) => (
            <div key={s.cycles} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <div>
                <p className="font-mono text-xl text-indigo-400">{s.time}</p>
                <p className="text-sm text-muted-foreground">{s.cycles} cycles ({s.hours} hours)</p>
              </div>
              {s.cycles === 6 && <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">Recommended</span>}
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-sm mt-4">Each sleep cycle is ~90 minutes. Allow 15 min to fall asleep.</p>
      </ToolCard>
    </div>
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
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Cooking Converter" icon={UtensilsCrossed} iconColor="bg-amber-500">
        <div className="space-y-4">
          <InputField label="Amount" value={amount} onChange={setAmount} type="number" />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">From</label>
            <div className="flex gap-2 flex-wrap">
              {units.map((u) => (
                <button
                  key={u}
                  onClick={() => setFromUnit(u)}
                  className={`px-3 py-2 rounded-lg text-sm ${fromUnit === u ? "bg-amber-500 text-foreground" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-unit-${u}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Conversions" icon={Scale} iconColor="bg-emerald-500">
        <div className="space-y-2">
          {Object.entries(conversions[fromUnit] || {}).map(([unit, factor]) => (
            <div key={unit} className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
              <span className="text-muted-foreground capitalize">{unit}</span>
              <span className="font-mono text-amber-400">{(val * factor).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </ToolCard>
    </div>
  );
}
