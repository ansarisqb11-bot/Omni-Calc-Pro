import { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, Clock, Timer, Hourglass, Play, Pause, RotateCcw, Globe, Target, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { differenceInDays, differenceInYears, differenceInMonths, differenceInHours, differenceInMinutes, addDays, format } from "date-fns";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "age" | "difference" | "stopwatch" | "countdown" | "worldclock" | "pomodoro" | "workdays";

export default function DateTimeTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("age");

  const tools = [
    { id: "age", label: "Age Calc", icon: CalendarIcon },
    { id: "difference", label: "Date Diff", icon: Hourglass },
    { id: "stopwatch", label: "Stopwatch", icon: Clock },
    { id: "countdown", label: "Countdown", icon: Timer },
    { id: "worldclock", label: "World Clock", icon: Globe },
    { id: "pomodoro", label: "Pomodoro", icon: Target },
    { id: "workdays", label: "Work Days", icon: Briefcase },
  ];

  return (
    <PageWrapper
      title="Date & Time"
      subtitle="Age calculator, timers, and date tools"
      accentColor="bg-purple-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "age" && <AgeCalculator />}
      {activeTool === "difference" && <DateDifference />}
      {activeTool === "stopwatch" && <Stopwatch />}
      {activeTool === "countdown" && <CountdownTimer />}
      {activeTool === "worldclock" && <WorldClock />}
      {activeTool === "pomodoro" && <PomodoroTimer />}
      {activeTool === "workdays" && <WorkDaysCalculator />}
    </PageWrapper>
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
              <div className="text-5xl font-bold text-foreground mb-2">
                {result.years}
                <span className="text-xl text-muted-foreground ml-2">years</span>
              </div>
              <div className="text-xl text-purple-400">
                {result.months} months, {result.days} days
              </div>
              <div className="text-muted-foreground mt-4">
                That's <span className="text-foreground font-medium">{result.totalDays.toLocaleString()}</span> days!
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
          <div className="text-6xl font-mono font-bold text-foreground mb-8">
            {formatTime(time)}
          </div>
          <div className="flex justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRunning(!isRunning)}
              data-testid="button-start-stop"
              className={`p-4 rounded-full ${isRunning ? "bg-red-500" : "bg-emerald-500"} text-foreground shadow-lg`}
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              data-testid="button-reset"
              className="p-4 rounded-full bg-muted text-foreground"
            >
              <RotateCcw className="w-6 h-6" />
            </motion.button>
            {isRunning && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={addLap}
                data-testid="button-lap"
                className="p-4 rounded-full bg-blue-500 text-foreground"
              >
                Lap
              </motion.button>
            )}
          </div>
        </div>

        {laps.length > 0 && (
          <div className="mt-6 border-t border-border pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Laps</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {laps.map((lap, i) => (
                <div key={i} className="flex justify-between text-sm bg-muted/50 px-3 py-2 rounded-lg">
                  <span className="text-muted-foreground">Lap {i + 1}</span>
                  <span className="text-foreground font-mono">{formatTime(lap)}</span>
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
            <div className={`text-6xl font-mono font-bold mb-8 ${timeLeft === 0 ? "text-rose-500 animate-pulse" : "text-foreground"}`}>
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
                  className={`p-4 rounded-full ${isRunning ? "bg-yellow-500" : "bg-emerald-500"} text-foreground shadow-lg`}
                >
                  {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                data-testid="button-reset-countdown"
                className="p-4 rounded-full bg-muted text-foreground"
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

function WorldClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = [
    { name: "New York", offset: -5, country: "USA" },
    { name: "London", offset: 0, country: "UK" },
    { name: "Paris", offset: 1, country: "France" },
    { name: "Dubai", offset: 4, country: "UAE" },
    { name: "Mumbai", offset: 5.5, country: "India" },
    { name: "Tokyo", offset: 9, country: "Japan" },
    { name: "Sydney", offset: 11, country: "Australia" },
  ];

  const getTimeInZone = (offset: number) => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const cityTime = new Date(utc + offset * 3600000);
    return cityTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="World Clock" icon={Globe} iconColor="bg-sky-500">
        <div className="space-y-3">
          {cities.map((city) => (
            <div key={city.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <div>
                <p className="font-medium">{city.name}</p>
                <p className="text-sm text-muted-foreground">{city.country}</p>
              </div>
              <p className="font-mono text-lg text-sky-400">{getTimeInZone(city.offset)}</p>
            </div>
          ))}
        </div>
      </ToolCard>
    </div>
  );
}

function PomodoroTimer() {
  const [mode, setMode] = useState<"work" | "break">("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === "work") {
        setSessions((s) => s + 1);
        setMode("break");
        setTimeLeft(5 * 60);
      } else {
        setMode("work");
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const reset = () => {
    setIsRunning(false);
    setMode("work");
    setTimeLeft(25 * 60);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Pomodoro Timer" icon={Target} iconColor={mode === "work" ? "bg-red-500" : "bg-emerald-500"}>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-2 capitalize">{mode} Session</p>
          <div className={`text-7xl font-mono font-bold mb-6 ${mode === "work" ? "text-red-400" : "text-emerald-400"}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="flex justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRunning(!isRunning)}
              data-testid="button-pomodoro-toggle"
              className={`p-4 rounded-full ${isRunning ? "bg-yellow-500" : "bg-emerald-500"} text-foreground shadow-lg`}
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              data-testid="button-pomodoro-reset"
              className="p-4 rounded-full bg-muted text-foreground"
            >
              <RotateCcw className="w-6 h-6" />
            </motion.button>
          </div>
          <p className="mt-6 text-muted-foreground">Sessions completed: <span className="text-foreground font-bold">{sessions}</span></p>
        </div>
      </ToolCard>
    </div>
  );
}

function WorkDaysCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState<{ workdays: number; weekends: number; total: number } | null>(null);

  const calculate = () => {
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    let workdays = 0;
    let weekends = 0;
    const current = new Date(start);
    
    while (current <= end) {
      const day = current.getDay();
      if (day === 0 || day === 6) weekends++;
      else workdays++;
      current.setDate(current.getDate() + 1);
    }
    
    setResult({ workdays, weekends, total: workdays + weekends });
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Work Days Calculator" icon={Briefcase} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <InputField label="Start Date" value={startDate} onChange={setStartDate} type="date" />
          <InputField label="End Date" value={endDate} onChange={setEndDate} type="date" />
          <ToolButton onClick={calculate} className="bg-indigo-500 hover:bg-indigo-600">Calculate</ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Results" icon={CalendarIcon} iconColor="bg-emerald-500">
            <div className="space-y-3">
              <ResultDisplay label="Work Days (Mon-Fri)" value={result.workdays.toString()} highlight color="text-indigo-400" />
              <ResultDisplay label="Weekend Days" value={result.weekends.toString()} color="text-yellow-400" />
              <ResultDisplay label="Total Days" value={result.total.toString()} />
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}
