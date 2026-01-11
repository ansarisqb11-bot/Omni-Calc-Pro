import { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, Clock, Timer, Hourglass, Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { differenceInDays, differenceInYears, differenceInMonths, differenceInHours, differenceInMinutes, addDays, format } from "date-fns";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";

type ToolType = "age" | "difference" | "stopwatch" | "countdown";

export default function DateTimeTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("age");

  const tools = [
    { id: "age" as ToolType, label: "Age Calc", icon: CalendarIcon },
    { id: "difference" as ToolType, label: "Date Diff", icon: Hourglass },
    { id: "stopwatch" as ToolType, label: "Stopwatch", icon: Clock },
    { id: "countdown" as ToolType, label: "Countdown", icon: Timer },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">Date & Time</h1>
        <p className="text-slate-400 text-sm mt-1">Age calculator, timers, and date tools</p>
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
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
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
        {activeTool === "age" && <AgeCalculator />}
        {activeTool === "difference" && <DateDifference />}
        {activeTool === "stopwatch" && <Stopwatch />}
        {activeTool === "countdown" && <CountdownTimer />}
      </div>
    </div>
  );
}

function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalDays: number } | null>(null);

  const calculate = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const now = new Date();
    
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    
    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    setResult({
      years,
      months,
      days,
      totalDays: differenceInDays(now, birth),
    });
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Age Calculator" icon={CalendarIcon} iconColor="bg-purple-500">
        <div className="space-y-4">
          <InputField label="Date of Birth" value={birthDate} onChange={setBirthDate} type="date" />
          <ToolButton onClick={calculate} variant="primary" className="bg-purple-500 hover:bg-purple-600">
            Calculate Age
          </ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Your Age" icon={Clock} iconColor="bg-blue-500">
            <div className="text-center py-4">
              <div className="text-5xl font-bold text-white mb-2">
                {result.years}
                <span className="text-xl text-slate-400 ml-2">years</span>
              </div>
              <div className="text-xl text-purple-400">
                {result.months} months, {result.days} days
              </div>
              <div className="text-slate-500 mt-4">
                That's <span className="text-white font-medium">{result.totalDays.toLocaleString()}</span> days!
              </div>
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function DateDifference() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState<{ days: number; weeks: number; months: number; years: number } | null>(null);

  const calculate = () => {
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const days = Math.abs(differenceInDays(end, start));
    setResult({
      days,
      weeks: Math.floor(days / 7),
      months: Math.abs(differenceInMonths(end, start)),
      years: Math.abs(differenceInYears(end, start)),
    });
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Date Difference" icon={Hourglass} iconColor="bg-orange-500">
        <div className="space-y-4">
          <InputField label="Start Date" value={startDate} onChange={setStartDate} type="date" />
          <InputField label="End Date" value={endDate} onChange={setEndDate} type="date" />
          <ToolButton onClick={calculate} variant="primary" className="bg-orange-500 hover:bg-orange-600">
            Calculate Difference
          </ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Difference" icon={Clock} iconColor="bg-blue-500">
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Days" value={result.days.toLocaleString()} highlight />
              <ResultDisplay label="Weeks" value={result.weeks.toLocaleString()} />
              <ResultDisplay label="Months" value={result.months} />
              <ResultDisplay label="Years" value={result.years} />
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((t) => t + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const reset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  const addLap = () => {
    setLaps((prev) => [...prev, time]);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Stopwatch" icon={Clock} iconColor="bg-cyan-500">
        <div className="text-center py-8">
          <div className="text-6xl font-mono font-bold text-white mb-8">
            {formatTime(time)}
          </div>
          <div className="flex justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRunning(!isRunning)}
              data-testid="button-start-stop"
              className={`p-4 rounded-full ${isRunning ? "bg-red-500" : "bg-emerald-500"} text-white shadow-lg`}
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              data-testid="button-reset"
              className="p-4 rounded-full bg-slate-700 text-white"
            >
              <RotateCcw className="w-6 h-6" />
            </motion.button>
            {isRunning && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={addLap}
                data-testid="button-lap"
                className="p-4 rounded-full bg-blue-500 text-white"
              >
                Lap
              </motion.button>
            )}
          </div>
        </div>

        {laps.length > 0 && (
          <div className="mt-6 border-t border-slate-700/50 pt-4">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Laps</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {laps.map((lap, i) => (
                <div key={i} className="flex justify-between text-sm bg-slate-900/50 px-3 py-2 rounded-lg">
                  <span className="text-slate-400">Lap {i + 1}</span>
                  <span className="text-white font-mono">{formatTime(lap)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function CountdownTimer() {
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("5");
  const [seconds, setSeconds] = useState("0");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1000) {
            setIsRunning(false);
            return 0;
          }
          return t - 1000;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    const total = (parseInt(hours) || 0) * 3600000 + (parseInt(minutes) || 0) * 60000 + (parseInt(seconds) || 0) * 1000;
    setTimeLeft(total);
    setIsRunning(true);
  };

  const formatTime = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const reset = () => {
    setTimeLeft(0);
    setIsRunning(false);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Countdown Timer" icon={Timer} iconColor="bg-rose-500">
        {!isRunning && timeLeft === 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <InputField label="Hours" value={hours} onChange={setHours} type="number" min={0} />
              <InputField label="Minutes" value={minutes} onChange={setMinutes} type="number" min={0} max={59} />
              <InputField label="Seconds" value={seconds} onChange={setSeconds} type="number" min={0} max={59} />
            </div>
            <ToolButton onClick={startTimer} variant="primary" className="bg-rose-500 hover:bg-rose-600">
              Start Countdown
            </ToolButton>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className={`text-6xl font-mono font-bold mb-8 ${timeLeft === 0 ? "text-rose-500 animate-pulse" : "text-white"}`}>
              {formatTime(timeLeft)}
            </div>
            {timeLeft === 0 && (
              <div className="text-rose-400 mb-4 text-xl">Time's up!</div>
            )}
            <div className="flex justify-center gap-4">
              {timeLeft > 0 && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsRunning(!isRunning)}
                  data-testid="button-pause-resume"
                  className={`p-4 rounded-full ${isRunning ? "bg-yellow-500" : "bg-emerald-500"} text-white shadow-lg`}
                >
                  {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                data-testid="button-reset-countdown"
                className="p-4 rounded-full bg-slate-700 text-white"
              >
                <RotateCcw className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}
