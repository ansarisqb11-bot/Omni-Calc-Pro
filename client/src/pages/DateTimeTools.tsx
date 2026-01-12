import { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, Clock, Timer, Hourglass, Play, Pause, RotateCcw, Globe, Target, Briefcase, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";
import { differenceInDays, differenceInYears, differenceInMonths, addDays, format } from "date-fns";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "age" | "difference" | "stopwatch" | "countdown" | "worldclock" | "timezone" | "pomodoro" | "workdays";

export default function DateTimeTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("age");

  const tools = [
    { id: "age", label: "Age Calc", icon: CalendarIcon },
    { id: "difference", label: "Date Diff", icon: Hourglass },
    { id: "stopwatch", label: "Stopwatch", icon: Clock },
    { id: "countdown", label: "Countdown", icon: Timer },
    { id: "worldclock", label: "World Clock", icon: Globe },
    { id: "timezone", label: "Time Zone", icon: ArrowRightLeft },
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
      {activeTool === "timezone" && <TimeZoneConverter />}
      {activeTool === "pomodoro" && <PomodoroTimer />}
      {activeTool === "workdays" && <WorkDaysCalculator />}
    </PageWrapper>
  );
}

function AgeCalculator() {
  const [mode, setMode] = useState<"birthdate" | "birthyear">("birthdate");
  const [birthDate, setBirthDate] = useState("");
  const [birthYear, setBirthYear] = useState("1990");
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalDays: number; nextBirthday: string } | null>(null);

  const calculate = () => {
    const now = new Date();
    let birth: Date;

    if (mode === "birthdate") {
      if (!birthDate) return;
      birth = new Date(birthDate);
    } else {
      const year = parseInt(birthYear);
      if (!year || year > now.getFullYear()) return;
      birth = new Date(year, 0, 1);
    }
    
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

    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < now) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const daysUntilBirthday = differenceInDays(nextBirthday, now);
    
    setResult({
      years,
      months,
      days,
      totalDays: differenceInDays(now, birth),
      nextBirthday: daysUntilBirthday === 0 ? "Today!" : `${daysUntilBirthday} days`,
    });
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Age Calculator" icon={CalendarIcon} iconColor="bg-purple-500">
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode("birthdate")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === "birthdate" ? "bg-purple-500 text-white" : "bg-muted text-muted-foreground"
              }`}
              data-testid="button-mode-birthdate"
            >
              Date of Birth
            </button>
            <button
              onClick={() => setMode("birthyear")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === "birthyear" ? "bg-purple-500 text-white" : "bg-muted text-muted-foreground"
              }`}
              data-testid="button-mode-birthyear"
            >
              Year of Birth
            </button>
          </div>
          
          {mode === "birthdate" ? (
            <InputField label="Date of Birth" value={birthDate} onChange={setBirthDate} type="date" />
          ) : (
            <InputField label="Year of Birth" value={birthYear} onChange={setBirthYear} type="number" min={1900} max={new Date().getFullYear()} />
          )}
          
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
              {mode === "birthdate" && (
                <div className="text-xl text-purple-400">
                  {result.months} months, {result.days} days
                </div>
              )}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between p-3 bg-muted/30 rounded-xl">
                  <span className="text-muted-foreground">Total Days Lived</span>
                  <span className="text-foreground font-medium">{result.totalDays.toLocaleString()}</span>
                </div>
                {mode === "birthdate" && (
                  <div className="flex justify-between p-3 bg-muted/30 rounded-xl">
                    <span className="text-muted-foreground">Next Birthday</span>
                    <span className="text-purple-400 font-medium">{result.nextBirthday}</span>
                  </div>
                )}
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
              <ResultDisplay label="Months" value={result.months.toString()} />
              <ResultDisplay label="Years" value={result.years.toString()} />
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
              className={`p-4 rounded-full ${isRunning ? "bg-red-500" : "bg-emerald-500"} text-white shadow-lg`}
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
                className="p-4 rounded-full bg-blue-500 text-white"
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
                  className={`p-4 rounded-full ${isRunning ? "bg-yellow-500" : "bg-emerald-500"} text-white shadow-lg`}
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
    { name: "Los Angeles", offset: -8, country: "USA" },
    { name: "London", offset: 0, country: "UK" },
    { name: "Paris", offset: 1, country: "France" },
    { name: "Dubai", offset: 4, country: "UAE" },
    { name: "Mumbai", offset: 5.5, country: "India" },
    { name: "Delhi", offset: 5.5, country: "India" },
    { name: "Singapore", offset: 8, country: "Singapore" },
    { name: "Tokyo", offset: 9, country: "Japan" },
    { name: "Sydney", offset: 11, country: "Australia" },
  ];

  const getTimeInZone = (offset: number) => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const cityTime = new Date(utc + offset * 3600000);
    return {
      time: cityTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      date: cityTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    };
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="World Clock" icon={Globe} iconColor="bg-sky-500">
        <div className="space-y-2">
          {cities.map((city) => {
            const { time, date } = getTimeInZone(city.offset);
            return (
              <div key={city.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl" data-testid={`clock-${city.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <div>
                  <p className="font-medium text-foreground">{city.name}</p>
                  <p className="text-xs text-muted-foreground">{city.country} - {date}</p>
                </div>
                <p className="font-mono text-lg text-sky-400">{time}</p>
              </div>
            );
          })}
        </div>
      </ToolCard>
    </div>
  );
}

function TimeZoneConverter() {
  const [time, setTime] = useState("12:00");
  const [fromZone, setFromZone] = useState("America/New_York");
  const [toZone, setToZone] = useState("Asia/Kolkata");

  const timeZones = [
    { id: "America/New_York", label: "New York (EST)", offset: -5 },
    { id: "America/Los_Angeles", label: "Los Angeles (PST)", offset: -8 },
    { id: "America/Chicago", label: "Chicago (CST)", offset: -6 },
    { id: "Europe/London", label: "London (GMT)", offset: 0 },
    { id: "Europe/Paris", label: "Paris (CET)", offset: 1 },
    { id: "Asia/Dubai", label: "Dubai (GST)", offset: 4 },
    { id: "Asia/Kolkata", label: "India (IST)", offset: 5.5 },
    { id: "Asia/Singapore", label: "Singapore (SGT)", offset: 8 },
    { id: "Asia/Tokyo", label: "Tokyo (JST)", offset: 9 },
    { id: "Australia/Sydney", label: "Sydney (AEST)", offset: 11 },
  ];

  const convertTime = () => {
    const [hours, minutes] = time.split(":").map(Number);
    const fromOffset = timeZones.find(z => z.id === fromZone)?.offset || 0;
    const toOffset = timeZones.find(z => z.id === toZone)?.offset || 0;
    
    const totalMinutes = hours * 60 + minutes;
    const utcMinutes = totalMinutes - fromOffset * 60;
    let convertedMinutes = utcMinutes + toOffset * 60;
    
    if (convertedMinutes < 0) convertedMinutes += 24 * 60;
    if (convertedMinutes >= 24 * 60) convertedMinutes -= 24 * 60;
    
    const convertedHours = Math.floor(convertedMinutes / 60);
    const convertedMins = Math.floor(convertedMinutes % 60);
    
    return `${convertedHours.toString().padStart(2, "0")}:${convertedMins.toString().padStart(2, "0")}`;
  };

  const getDayDiff = () => {
    const [hours] = time.split(":").map(Number);
    const fromOffset = timeZones.find(z => z.id === fromZone)?.offset || 0;
    const toOffset = timeZones.find(z => z.id === toZone)?.offset || 0;
    
    const totalMinutes = hours * 60;
    const utcMinutes = totalMinutes - fromOffset * 60;
    const convertedMinutes = utcMinutes + toOffset * 60;
    
    if (convertedMinutes < 0) return "Previous day";
    if (convertedMinutes >= 24 * 60) return "Next day";
    return "Same day";
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Time Zone Converter" icon={ArrowRightLeft} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <InputField label="Time" value={time} onChange={setTime} type="time" />
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">From Time Zone</label>
            <select
              value={fromZone}
              onChange={(e) => setFromZone(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              data-testid="select-from-zone"
            >
              {timeZones.map((zone) => (
                <option key={zone.id} value={zone.id}>{zone.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">To Time Zone</label>
            <select
              value={toZone}
              onChange={(e) => setToZone(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              data-testid="select-to-zone"
            >
              {timeZones.map((zone) => (
                <option key={zone.id} value={zone.id}>{zone.label}</option>
              ))}
            </select>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Converted Time" icon={Clock} iconColor="bg-emerald-500">
        <div className="text-center py-6">
          <div className="text-5xl font-mono font-bold text-indigo-400 mb-2">
            {convertTime()}
          </div>
          <p className="text-muted-foreground">{getDayDiff()}</p>
          <div className="mt-4 p-3 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground">
              {time} in {timeZones.find(z => z.id === fromZone)?.label} is {convertTime()} in {timeZones.find(z => z.id === toZone)?.label}
            </p>
          </div>
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
              className={`p-4 rounded-full ${isRunning ? "bg-yellow-500" : "bg-emerald-500"} text-white shadow-lg`}
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
