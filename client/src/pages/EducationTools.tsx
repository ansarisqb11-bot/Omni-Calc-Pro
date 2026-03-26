import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Star, Calendar, Clock, Table, Zap, Briefcase, TrendingUp } from "lucide-react";
import { DesktopToolGrid, InputPanel, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "gpa" | "marks" | "attendance" | "studytime" | "multiplication" | "speed" | "worktime" | "rank";

export default function EducationTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("gpa");

  const tools = [
    { id: "gpa", label: "GPA", icon: Star },
    { id: "marks", label: "Marks", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "studytime", label: "Study Time", icon: Clock },
    { id: "multiplication", label: "Tables", icon: Table },
    { id: "speed", label: "Speed", icon: Zap },
    { id: "worktime", label: "Work Time", icon: Briefcase },
    { id: "rank", label: "Rank", icon: TrendingUp },
  ];

  return (
    <PageWrapper
      title="Education Tools"
      subtitle="Study smarter with academic calculators"
      accentColor="bg-violet-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "gpa" && <GPACalculator />}
      {activeTool === "marks" && <MarksConverter />}
      {activeTool === "attendance" && <AttendanceCalculator />}
      {activeTool === "studytime" && <StudyTimePlanner />}
      {activeTool === "multiplication" && <MultiplicationTableGenerator />}
      {activeTool === "speed" && <SpeedTimeDistanceCalculator />}
      {activeTool === "worktime" && <WorkTimeCalculator />}
      {activeTool === "rank" && <RankPredictor />}
    </PageWrapper>
  );
}

function GPACalculator() {
  const [grades, setGrades] = useState([
    { subject: "Mathematics", grade: "A", credits: "3" },
    { subject: "Physics", grade: "B+", credits: "3" },
    { subject: "English", grade: "A-", credits: "2" },
  ]);

  const gradePoints: Record<string, number> = {
    "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0,
  };

  const totalCredits = grades.reduce((sum, g) => sum + (parseFloat(g.credits) || 0), 0);
  const weightedPoints = grades.reduce((sum, g) => sum + ((gradePoints[g.grade] || 0) * (parseFloat(g.credits) || 0)), 0);
  const gpa = totalCredits > 0 ? weightedPoints / totalCredits : 0;

  const addGrade = () => setGrades([...grades, { subject: "", grade: "A", credits: "3" }]);
  const updateGrade = (i: number, field: string, val: string) => {
    const updated = [...grades];
    updated[i] = { ...updated[i], [field]: val };
    setGrades(updated);
  };
  const removeGrade = (i: number) => setGrades(grades.filter((_, idx) => idx !== i));

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="GPA Calculator" icon={Star} iconColor="bg-amber-500">
          <div className="space-y-3">
            {grades.map((g, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <InputField label={i === 0 ? "Subject" : ""} value={g.subject} onChange={(v) => updateGrade(i, "subject", v)} />
                </div>
                <div className="col-span-3">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">{i === 0 ? "Grade" : ""}</label>
                  <select value={g.grade} onChange={(e) => updateGrade(i, "grade", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-xl px-2 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    data-testid={`select-grade-${i}`}>
                    {Object.keys(gradePoints).map((gr) => (
                      <option key={gr} value={gr}>{gr}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3">
                  <InputField label={i === 0 ? "Credits" : ""} value={g.credits} onChange={(v) => updateGrade(i, "credits", v)} type="number" />
                </div>
                <div className="col-span-1 pb-1">
                  <button onClick={() => removeGrade(i)} className="w-full py-3 text-muted-foreground hover:text-red-400" data-testid={`button-remove-${i}`}>×</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addGrade}
            className="w-full py-2 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            data-testid="button-add-subject">
            + Add Subject
          </button>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">GPA Result</p>
          <div className="text-center py-4 mb-2">
            <div className="text-5xl font-bold text-amber-400 mb-2">{gpa.toFixed(2)}</div>
            <p className="text-muted-foreground">out of 4.00</p>
          </div>
          <ResultDisplay label="Total Credits" value={totalCredits.toString()} />
          <ResultDisplay label="Weighted Points" value={weightedPoints.toFixed(2)} />
          <ResultDisplay label="Percentage (est.)" value={`${(gpa / 4 * 100).toFixed(1)}%`} highlight color="text-amber-400" />
        </div>
      }
    />
  );
}

function MarksConverter() {
  const [marks, setMarks] = useState("75");
  const [maxMarks, setMaxMarks] = useState("100");

  const m = parseFloat(marks) || 0;
  const max = parseFloat(maxMarks) || 100;
  const pct = max > 0 ? (m / max) * 100 : 0;

  const getGrade = (p: number) => {
    if (p >= 90) return { grade: "A+", gpa: "4.0", cls: "text-emerald-400" };
    if (p >= 80) return { grade: "A", gpa: "4.0", cls: "text-green-400" };
    if (p >= 70) return { grade: "B+", gpa: "3.3", cls: "text-blue-400" };
    if (p >= 60) return { grade: "B", gpa: "3.0", cls: "text-blue-300" };
    if (p >= 50) return { grade: "C+", gpa: "2.3", cls: "text-yellow-400" };
    if (p >= 40) return { grade: "C", gpa: "2.0", cls: "text-yellow-300" };
    return { grade: "F", gpa: "0.0", cls: "text-red-400" };
  };
  const info = getGrade(pct);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Marks to Grade Converter" icon={BookOpen} iconColor="bg-blue-500">
          <InputField label="Marks Obtained" value={marks} onChange={setMarks} type="number" />
          <InputField label="Maximum Marks" value={maxMarks} onChange={setMaxMarks} type="number" />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Result</p>
          <div className="text-center py-4 mb-2">
            <div className={`text-5xl font-bold mb-1 ${info.cls}`}>{info.grade}</div>
            <p className="text-muted-foreground">{pct.toFixed(2)}%</p>
          </div>
          <ResultDisplay label="Percentage" value={`${pct.toFixed(2)}%`} highlight color={info.cls} />
          <ResultDisplay label="GPA Equivalent" value={info.gpa} />
          <ResultDisplay label="Marks" value={`${m} / ${max}`} />
        </div>
      }
    />
  );
}

function AttendanceCalculator() {
  const [attended, setAttended] = useState("60");
  const [total, setTotal] = useState("80");
  const [required, setRequired] = useState("75");

  const att = parseInt(attended) || 0;
  const tot = parseInt(total) || 0;
  const req = parseFloat(required) || 75;
  const currentPct = tot > 0 ? (att / tot) * 100 : 0;
  const neededForReq = tot > 0 ? Math.max(0, Math.ceil((req * tot - 100 * att) / (100 - req))) : 0;
  const canSkip = currentPct >= req ? Math.floor((100 * att - req * tot) / req) : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Attendance Calculator" icon={Calendar} iconColor="bg-green-500">
          <InputField label="Classes Attended" value={attended} onChange={setAttended} type="number" />
          <InputField label="Total Classes" value={total} onChange={setTotal} type="number" />
          <InputField label="Required Attendance (%)" value={required} onChange={setRequired} type="number" />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Status</p>
          <div className="text-center py-3 mb-2">
            <div className={`text-5xl font-bold mb-1 ${currentPct >= req ? "text-emerald-400" : "text-red-400"}`}>
              {currentPct.toFixed(1)}%
            </div>
            <p className={`text-sm ${currentPct >= req ? "text-emerald-400" : "text-red-400"}`}>
              {currentPct >= req ? "Attendance OK" : "Below Required"}
            </p>
          </div>
          <ResultDisplay label="Classes to Attend" value={neededForReq > 0 ? `${neededForReq} more` : "On track!"} color={neededForReq > 0 ? "text-red-400" : "text-emerald-400"} />
          <ResultDisplay label="Can Skip" value={canSkip > 0 ? `${canSkip} classes` : "None"} color={canSkip > 0 ? "text-amber-400" : "text-muted-foreground"} />
        </div>
      }
    />
  );
}

function StudyTimePlanner() {
  const [examDate, setExamDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [dailyHours, setDailyHours] = useState("4");
  const [subjects, setSubjects] = useState("5");

  const today = new Date();
  const exam = new Date(examDate);
  const daysLeft = Math.max(0, Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const totalHours = daysLeft * (parseFloat(dailyHours) || 0);
  const hoursPerSubject = parseInt(subjects) > 0 ? totalHours / parseInt(subjects) : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Study Time Planner" icon={Clock} iconColor="bg-purple-500">
          <InputField label="Exam Date" value={examDate} onChange={setExamDate} type="date" />
          <InputField label="Daily Study Hours" value={dailyHours} onChange={setDailyHours} type="number" />
          <InputField label="Number of Subjects" value={subjects} onChange={setSubjects} type="number" />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Study Plan</p>
          <div className="text-center py-3 mb-2">
            <div className="text-5xl font-bold text-purple-400 mb-1">{daysLeft}</div>
            <p className="text-muted-foreground">Days Until Exam</p>
          </div>
          <ResultDisplay label="Total Study Hours" value={`${totalHours.toFixed(0)} hrs`} highlight color="text-purple-400" />
          <ResultDisplay label="Hours per Subject" value={`${hoursPerSubject.toFixed(1)} hrs`} />
        </div>
      }
    />
  );
}

function MultiplicationTableGenerator() {
  const [number, setNumber] = useState("12");
  const [upTo, setUpTo] = useState("12");

  const n = parseInt(number) || 1;
  const limit = Math.min(parseInt(upTo) || 12, 20);
  const table = Array.from({ length: limit }, (_, i) => ({ multiplier: i + 1, result: n * (i + 1) }));

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Multiplication Table" icon={Table} iconColor="bg-cyan-500">
          <InputField label="Number" value={number} onChange={setNumber} type="number" />
          <InputField label="Up To" value={upTo} onChange={setUpTo} type="number" />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Table of {n}</p>
          <div className="space-y-1.5">
            {table.map(({ multiplier, result }) => (
              <div key={multiplier} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground text-sm">{n} × {multiplier}</span>
                <span className="font-bold text-cyan-400">{result}</span>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}

function SpeedTimeDistanceCalculator() {
  const [speed, setSpeed] = useState("60");
  const [time, setTime] = useState("2");
  const [distance, setDistance] = useState("120");
  const [solveFor, setSolveFor] = useState("distance");
  const [result, setResult] = useState<{ label: string; value: string } | null>(null);

  const calculate = () => {
    const s = parseFloat(speed) || 0;
    const t = parseFloat(time) || 0;
    const d = parseFloat(distance) || 0;
    if (solveFor === "distance") setResult({ label: "Distance", value: `${(s * t).toFixed(2)} km` });
    else if (solveFor === "speed") setResult({ label: "Speed", value: `${t > 0 ? (d / t).toFixed(2) : "0"} km/h` });
    else setResult({ label: "Time", value: `${s > 0 ? (d / s).toFixed(2) : "0"} hours` });
  };

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Speed Time Distance" icon={Zap} iconColor="bg-yellow-500">
          <div className="grid grid-cols-3 gap-2">
            {["distance", "speed", "time"].map((opt) => (
              <button key={opt} onClick={() => setSolveFor(opt)}
                className={`py-2 rounded-lg text-sm capitalize ${solveFor === opt ? "bg-yellow-500 text-white" : "bg-muted text-muted-foreground"}`}
                data-testid={`button-solve-${opt}`}>
                {opt}
              </button>
            ))}
          </div>
          {solveFor !== "speed" && <InputField label="Speed (km/h)" value={speed} onChange={setSpeed} type="number" />}
          {solveFor !== "time" && <InputField label="Time (hours)" value={time} onChange={setTime} type="number" />}
          {solveFor !== "distance" && <InputField label="Distance (km)" value={distance} onChange={setDistance} type="number" />}
          <ToolButton onClick={calculate} className="bg-yellow-500 hover:bg-yellow-600">Calculate</ToolButton>
        </InputPanel>
      }
      results={
        result ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border shadow-sm p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Result</p>
            <div className="text-center py-6">
              <div className="text-4xl font-bold text-yellow-400">{result.value}</div>
              <p className="text-muted-foreground mt-2">{result.label}</p>
            </div>
          </motion.div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground text-sm text-center">Select what to solve for and click Calculate</p>
          </div>
        )
      }
    />
  );
}

function WorkTimeCalculator() {
  const [rate, setRate] = useState("500");
  const [hours, setHours] = useState("8");
  const [daysWorked, setDaysWorked] = useState("22");
  const [result, setResult] = useState<{ daily: number; weekly: number; monthly: number } | null>(null);

  const calculate = () => {
    const r = parseFloat(rate) || 0;
    const h = parseFloat(hours) || 0;
    const d = parseFloat(daysWorked) || 0;
    setResult({ daily: r * h, weekly: r * h * 5, monthly: r * h * d });
  };

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Work Time Calculator" icon={Briefcase} iconColor="bg-emerald-500">
          <InputField label="Hourly Rate (₹)" value={rate} onChange={setRate} type="number" />
          <InputField label="Hours per Day" value={hours} onChange={setHours} type="number" />
          <InputField label="Working Days / Month" value={daysWorked} onChange={setDaysWorked} type="number" />
          <ToolButton onClick={calculate} className="bg-emerald-500 hover:bg-emerald-600">Calculate</ToolButton>
        </InputPanel>
      }
      results={
        result ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Earnings</p>
            <ResultDisplay label="Daily" value={`₹${result.daily.toLocaleString("en-IN")}`} />
            <ResultDisplay label="Weekly" value={`₹${result.weekly.toLocaleString("en-IN")}`} />
            <ResultDisplay label="Monthly" value={`₹${result.monthly.toLocaleString("en-IN")}`} highlight color="text-emerald-400" />
          </motion.div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground text-sm text-center">Enter your rate and hours to calculate</p>
          </div>
        )
      }
    />
  );
}

function RankPredictor() {
  const [yourScore, setYourScore] = useState("720");
  const [totalStudents, setTotalStudents] = useState("1000000");
  const [percentile, setPercentile] = useState("95");

  const score = parseFloat(yourScore) || 0;
  const students = parseInt(totalStudents) || 0;
  const pct = parseFloat(percentile) || 0;
  const estimatedRank = Math.ceil(students * (1 - pct / 100));

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Rank Predictor" icon={TrendingUp} iconColor="bg-rose-500">
          <InputField label="Your Score" value={yourScore} onChange={setYourScore} type="number" />
          <InputField label="Total Students" value={totalStudents} onChange={setTotalStudents} type="number" />
          <InputField label="Percentile" value={percentile} onChange={setPercentile} type="number" />
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Rank Estimate</p>
          <div className="text-center py-4 mb-2">
            <div className="text-5xl font-bold text-rose-400 mb-1">{estimatedRank.toLocaleString("en-IN")}</div>
            <p className="text-muted-foreground">Estimated Rank</p>
          </div>
          <ResultDisplay label="Score" value={score.toString()} />
          <ResultDisplay label="Percentile" value={`${pct}%`} highlight color="text-rose-400" />
          <ResultDisplay label="Students Ahead of You" value={(students - estimatedRank).toLocaleString("en-IN")} />
        </div>
      }
    />
  );
}
