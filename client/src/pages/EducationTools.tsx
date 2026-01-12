import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Calculator, Percent, Clock, BookOpen, Target, Table, Zap, Trophy } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "gpa" | "marks" | "attendance" | "studytime" | "tables" | "speed" | "worktime" | "rank";

export default function EducationTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("gpa");

  const tools = [
    { id: "gpa", label: "GPA/CGPA", icon: GraduationCap },
    { id: "marks", label: "Marks", icon: Percent },
    { id: "attendance", label: "Attendance", icon: Target },
    { id: "studytime", label: "Study Time", icon: Clock },
    { id: "tables", label: "Tables", icon: Table },
    { id: "speed", label: "Speed/Time", icon: Zap },
    { id: "worktime", label: "Work/Time", icon: BookOpen },
    { id: "rank", label: "Rank", icon: Trophy },
  ];

  return (
    <PageWrapper
      title="Education Tools"
      subtitle="Student calculators & planners"
      accentColor="bg-blue-600"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "gpa" && <GPACalculator />}
      {activeTool === "marks" && <MarksConverter />}
      {activeTool === "attendance" && <AttendanceCalculator />}
      {activeTool === "studytime" && <StudyTimePlanner />}
      {activeTool === "tables" && <TableGenerator />}
      {activeTool === "speed" && <SpeedTimeDistance />}
      {activeTool === "worktime" && <WorkTimeCalculator />}
      {activeTool === "rank" && <RankPredictor />}
    </PageWrapper>
  );
}

function GPACalculator() {
  const [mode, setMode] = useState<"gpa" | "cgpa">("gpa");
  const [subjects, setSubjects] = useState([
    { name: "Subject 1", grade: "A", credits: "3" },
    { name: "Subject 2", grade: "B", credits: "3" },
    { name: "Subject 3", grade: "A", credits: "4" },
  ]);

  const gradePoints: Record<string, number> = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "F": 0.0,
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    subjects.forEach((s) => {
      const credits = parseFloat(s.credits) || 0;
      const points = gradePoints[s.grade] || 0;
      totalPoints += points * credits;
      totalCredits += credits;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: `Subject ${subjects.length + 1}`, grade: "A", credits: "3" }]);
  };

  const updateSubject = (index: number, field: string, value: string) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    setSubjects(updated);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="GPA/CGPA Calculator" icon={GraduationCap} iconColor="bg-blue-600">
        <div className="space-y-4">
          <div className="flex gap-2">
            {["gpa", "cgpa"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as "gpa" | "cgpa")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium uppercase transition-all ${
                  mode === m ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"
                }`}
                data-testid={`button-mode-${m}`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {subjects.map((subject, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select
                  value={subject.grade}
                  onChange={(e) => updateSubject(i, "grade", e.target.value)}
                  className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                  data-testid={`select-grade-${i}`}
                >
                  {Object.keys(gradePoints).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={subject.credits}
                  onChange={(e) => updateSubject(i, "credits", e.target.value)}
                  className="w-20 bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder="Credits"
                  data-testid={`input-credits-${i}`}
                />
              </div>
            ))}
          </div>

          <button
            onClick={addSubject}
            className="w-full py-2 border border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-add-subject"
          >
            + Add Subject
          </button>
        </div>
      </ToolCard>

      <ToolCard title="Your GPA" icon={Calculator} iconColor="bg-emerald-500">
        <div className="text-center py-6">
          <div className="text-5xl font-bold text-blue-500 mb-2">{calculateGPA()}</div>
          <p className="text-muted-foreground">out of 4.0</p>
        </div>
      </ToolCard>
    </div>
  );
}

function MarksConverter() {
  const [marks, setMarks] = useState("85");
  const [totalMarks, setTotalMarks] = useState("100");

  const percentage = (parseFloat(marks) / parseFloat(totalMarks)) * 100 || 0;
  
  const getGrade = (p: number) => {
    if (p >= 90) return { grade: "A+", gpa: "4.0" };
    if (p >= 80) return { grade: "A", gpa: "4.0" };
    if (p >= 70) return { grade: "B", gpa: "3.0" };
    if (p >= 60) return { grade: "C", gpa: "2.0" };
    if (p >= 50) return { grade: "D", gpa: "1.0" };
    return { grade: "F", gpa: "0.0" };
  };

  const { grade, gpa } = getGrade(percentage);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Marks to Grade" icon={Percent} iconColor="bg-purple-500">
        <div className="space-y-4">
          <InputField label="Marks Obtained" value={marks} onChange={setMarks} type="number" />
          <InputField label="Total Marks" value={totalMarks} onChange={setTotalMarks} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Result" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Percentage" value={`${percentage.toFixed(2)}%`} highlight color="text-purple-400" />
          <ResultDisplay label="Grade" value={grade} color="text-blue-400" />
          <ResultDisplay label="GPA Equivalent" value={gpa} />
        </div>
      </ToolCard>
    </div>
  );
}

function AttendanceCalculator() {
  const [attended, setAttended] = useState("45");
  const [total, setTotal] = useState("50");
  const [target, setTarget] = useState("75");

  const currentPercentage = (parseFloat(attended) / parseFloat(total)) * 100 || 0;
  const targetPercentage = parseFloat(target) || 75;
  
  const classesNeeded = () => {
    const att = parseFloat(attended) || 0;
    const tot = parseFloat(total) || 0;
    if (currentPercentage >= targetPercentage) return 0;
    return Math.ceil((targetPercentage * tot - 100 * att) / (100 - targetPercentage));
  };

  const canSkip = () => {
    const att = parseFloat(attended) || 0;
    const tot = parseFloat(total) || 0;
    return Math.floor((100 * att - targetPercentage * tot) / targetPercentage);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Attendance Calculator" icon={Target} iconColor="bg-orange-500">
        <div className="space-y-4">
          <InputField label="Classes Attended" value={attended} onChange={setAttended} type="number" />
          <InputField label="Total Classes" value={total} onChange={setTotal} type="number" />
          <InputField label="Target Attendance %" value={target} onChange={setTarget} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Analysis" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Current Attendance" value={`${currentPercentage.toFixed(1)}%`} highlight color={currentPercentage >= targetPercentage ? "text-emerald-400" : "text-red-400"} />
          {currentPercentage < targetPercentage ? (
            <ResultDisplay label="Classes Needed" value={`${classesNeeded()} more`} color="text-orange-400" />
          ) : (
            <ResultDisplay label="Can Skip" value={`${canSkip()} classes`} color="text-blue-400" />
          )}
        </div>
      </ToolCard>
    </div>
  );
}

function StudyTimePlanner() {
  const [subjects, setSubjects] = useState("5");
  const [hoursPerDay, setHoursPerDay] = useState("6");
  const [daysUntilExam, setDaysUntilExam] = useState("14");

  const totalHours = (parseFloat(hoursPerDay) || 0) * (parseFloat(daysUntilExam) || 0);
  const hoursPerSubject = totalHours / (parseFloat(subjects) || 1);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Study Time Planner" icon={Clock} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <InputField label="Number of Subjects" value={subjects} onChange={setSubjects} type="number" />
          <InputField label="Study Hours per Day" value={hoursPerDay} onChange={setHoursPerDay} type="number" />
          <InputField label="Days Until Exam" value={daysUntilExam} onChange={setDaysUntilExam} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Study Plan" icon={BookOpen} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Total Study Hours" value={`${totalHours} hours`} highlight color="text-indigo-400" />
          <ResultDisplay label="Hours per Subject" value={`${hoursPerSubject.toFixed(1)} hours`} color="text-blue-400" />
          <ResultDisplay label="Daily per Subject" value={`${(hoursPerSubject / parseFloat(daysUntilExam || "1")).toFixed(1)} hours`} />
        </div>
      </ToolCard>
    </div>
  );
}

function TableGenerator() {
  const [number, setNumber] = useState("7");
  const [range, setRange] = useState("12");
  const [tableType, setTableType] = useState<"multiplication" | "square" | "cube">("multiplication");

  const num = parseInt(number) || 1;
  const r = parseInt(range) || 10;

  const generateTable = () => {
    const rows = [];
    for (let i = 1; i <= r; i++) {
      if (tableType === "multiplication") {
        rows.push({ left: `${num} x ${i}`, right: num * i });
      } else if (tableType === "square") {
        rows.push({ left: `${i}²`, right: i * i });
      } else {
        rows.push({ left: `${i}³`, right: i * i * i });
      }
    }
    return rows;
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Table Generator" icon={Table} iconColor="bg-cyan-500">
        <div className="space-y-4">
          <div className="flex gap-2">
            {[
              { id: "multiplication", label: "Multiply" },
              { id: "square", label: "Square" },
              { id: "cube", label: "Cube" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTableType(t.id as any)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  tableType === t.id ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"
                }`}
                data-testid={`button-table-${t.id}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tableType === "multiplication" && (
            <InputField label="Number" value={number} onChange={setNumber} type="number" />
          )}
          <InputField label="Range (1 to)" value={range} onChange={setRange} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Table" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {generateTable().map((row, i) => (
            <div key={i} className="flex justify-between p-2 bg-muted/30 rounded-lg text-sm">
              <span className="text-muted-foreground">{row.left}</span>
              <span className="font-mono text-cyan-400">= {row.right.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </ToolCard>
    </div>
  );
}

function SpeedTimeDistance() {
  const [mode, setMode] = useState<"speed" | "time" | "distance">("distance");
  const [speed, setSpeed] = useState("60");
  const [time, setTime] = useState("2");
  const [distance, setDistance] = useState("120");

  const calculate = () => {
    const s = parseFloat(speed) || 0;
    const t = parseFloat(time) || 0;
    const d = parseFloat(distance) || 0;

    if (mode === "distance") return { result: s * t, unit: "km", label: "Distance" };
    if (mode === "speed") return { result: t > 0 ? d / t : 0, unit: "km/h", label: "Speed" };
    return { result: s > 0 ? d / s : 0, unit: "hours", label: "Time" };
  };

  const result = calculate();

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Speed-Time-Distance" icon={Zap} iconColor="bg-yellow-500">
        <div className="space-y-4">
          <div className="flex gap-2">
            {["distance", "speed", "time"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as any)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  mode === m ? "bg-yellow-500 text-white" : "bg-muted text-muted-foreground"
                }`}
                data-testid={`button-find-${m}`}
              >
                Find {m}
              </button>
            ))}
          </div>
          {mode !== "speed" && <InputField label="Speed (km/h)" value={speed} onChange={setSpeed} type="number" />}
          {mode !== "time" && <InputField label="Time (hours)" value={time} onChange={setTime} type="number" />}
          {mode !== "distance" && <InputField label="Distance (km)" value={distance} onChange={setDistance} type="number" />}
        </div>
      </ToolCard>

      <ToolCard title="Result" icon={Calculator} iconColor="bg-emerald-500">
        <div className="text-center py-6">
          <div className="text-4xl font-bold text-yellow-400 mb-2">
            {result.result.toFixed(2)} {result.unit}
          </div>
          <p className="text-muted-foreground">{result.label}</p>
        </div>
      </ToolCard>
    </div>
  );
}

function WorkTimeCalculator() {
  const [mode, setMode] = useState<"time" | "work" | "rate">("time");
  const [workers, setWorkers] = useState("5");
  const [days, setDays] = useState("10");
  const [work, setWork] = useState("50");

  const calculate = () => {
    const w = parseFloat(workers) || 0;
    const d = parseFloat(days) || 0;
    const wk = parseFloat(work) || 0;

    if (mode === "work") return { result: w * d, label: "Total Work (man-days)" };
    if (mode === "time") return { result: w > 0 ? wk / w : 0, label: "Days Required" };
    return { result: d > 0 ? wk / d : 0, label: "Workers Needed" };
  };

  const result = calculate();

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Work-Time Calculator" icon={BookOpen} iconColor="bg-rose-500">
        <div className="space-y-4">
          <div className="flex gap-2">
            {["time", "work", "rate"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as any)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  mode === m ? "bg-rose-500 text-white" : "bg-muted text-muted-foreground"
                }`}
                data-testid={`button-calc-${m}`}
              >
                {m === "rate" ? "Workers" : m}
              </button>
            ))}
          </div>
          {mode !== "rate" && <InputField label="Workers" value={workers} onChange={setWorkers} type="number" />}
          {mode !== "time" && <InputField label="Days" value={days} onChange={setDays} type="number" />}
          {mode !== "work" && <InputField label="Work (man-days)" value={work} onChange={setWork} type="number" />}
        </div>
      </ToolCard>

      <ToolCard title="Result" icon={Calculator} iconColor="bg-emerald-500">
        <div className="text-center py-6">
          <div className="text-4xl font-bold text-rose-400 mb-2">{result.result.toFixed(1)}</div>
          <p className="text-muted-foreground">{result.label}</p>
        </div>
      </ToolCard>
    </div>
  );
}

function RankPredictor() {
  const [score, setScore] = useState("150");
  const [maxScore, setMaxScore] = useState("200");
  const [totalCandidates, setTotalCandidates] = useState("100000");

  const percentage = ((parseFloat(score) || 0) / (parseFloat(maxScore) || 1)) * 100;
  const percentile = Math.min(99.99, percentage + (100 - percentage) * 0.3);
  const estimatedRank = Math.max(1, Math.round((100 - percentile) / 100 * (parseFloat(totalCandidates) || 1)));

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Rank Predictor" icon={Trophy} iconColor="bg-amber-500">
        <div className="space-y-4">
          <InputField label="Your Score" value={score} onChange={setScore} type="number" />
          <InputField label="Maximum Score" value={maxScore} onChange={setMaxScore} type="number" />
          <InputField label="Total Candidates" value={totalCandidates} onChange={setTotalCandidates} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Prediction" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Your Percentage" value={`${percentage.toFixed(2)}%`} />
          <ResultDisplay label="Estimated Percentile" value={`${percentile.toFixed(2)}`} color="text-amber-400" />
          <ResultDisplay label="Estimated Rank" value={estimatedRank.toLocaleString()} highlight color="text-emerald-400" />
        </div>
        <p className="text-xs text-muted-foreground mt-4">Note: This is an estimate based on normal distribution.</p>
      </ToolCard>
    </div>
  );
}
