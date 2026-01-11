import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Activity, Flame, Scale, Dumbbell } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";

type ToolType = "bmi" | "bmr" | "calories" | "water";

export default function HealthTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("bmi");

  const tools = [
    { id: "bmi" as ToolType, label: "BMI", icon: Scale },
    { id: "bmr" as ToolType, label: "BMR", icon: Flame },
    { id: "calories" as ToolType, label: "Calories", icon: Activity },
    { id: "water" as ToolType, label: "Water", icon: Dumbbell },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">Health & Fitness</h1>
        <p className="text-slate-400 text-sm mt-1">BMI, BMR, Calorie and nutrition calculators</p>
      </div>

      {/* Tool Tabs */}
      <div className="px-4 py-3 border-b border-slate-800/50">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              data-testid={`tab-${tool.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTool === tool.id
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                  : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <tool.icon className="w-4 h-4" />
              {tool.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tool Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        {activeTool === "bmi" && <BMICalculator />}
        {activeTool === "bmr" && <BMRCalculator />}
        {activeTool === "calories" && <CalorieCalculator />}
        {activeTool === "water" && <WaterIntake />}
      </div>
    </div>
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
                  unit === u ? "bg-pink-500 text-white" : "bg-slate-700/50 text-slate-400"
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
              <div className="text-5xl font-bold text-white mb-2">{result.bmi.toFixed(1)}</div>
              <div className={`text-xl font-medium ${result.color}`}>{result.category}</div>
              <div className="mt-6 bg-slate-900/50 rounded-xl p-4">
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
                <div className="flex justify-between text-xs text-slate-500 mt-1">
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
                  gender === g ? "bg-orange-500 text-white" : "bg-slate-700/50 text-slate-400"
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
              <div className="text-5xl font-bold text-white mb-2">
                {result}
                <span className="text-xl text-slate-400 ml-2">cal/day</span>
              </div>
              <p className="text-slate-400 text-sm">Calories burned at rest</p>
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
            <label className="text-sm font-medium text-slate-400 mb-2 block">Activity</label>
            <div className="grid grid-cols-2 gap-2">
              {activities.map((a) => (
                <button
                  key={a.name}
                  onClick={() => setActivity(a.name)}
                  data-testid={`button-activity-${a.name.toLowerCase()}`}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    activity === a.name
                      ? "bg-red-500 text-white"
                      : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
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
                <span className="text-xl text-slate-400 ml-2">cal</span>
              </div>
              <p className="text-slate-400">
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
            <label className="text-sm font-medium text-slate-400 mb-2 block">Activity Level</label>
            <div className="flex gap-2">
              {(["low", "moderate", "high"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setActivity(level)}
                  data-testid={`button-activity-${level}`}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    activity === level
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-700/50 text-slate-400"
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
            <span className="text-xl text-slate-400 ml-2">L</span>
          </div>
          <p className="text-slate-400">
            That's about <span className="text-white font-medium">{glasses} glasses</span> of water
          </p>
        </div>
      </ToolCard>
    </div>
  );
}
