import { useState } from "react";
import { format, differenceInDays, differenceInYears, addDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, Hourglass } from "lucide-react";
import { motion } from "framer-motion";

export default function DateTimeTools() {
  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState<{ years: number, days: number } | null>(null);

  const calculateAge = () => {
    if (!birthDate) return;
    const start = new Date(birthDate);
    const now = new Date();
    setAge({
      years: differenceInYears(now, start),
      days: differenceInDays(now, start) % 365,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-display">Date & Time</h1>
        <p className="text-muted-foreground mt-2">Age Calculator, Date Differences, and Timers</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Age Calculator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-xl font-semibold">Age Calculator</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Date of Birth</label>
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <button 
              onClick={calculateAge}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Calculate Age
            </button>
            
            {age && (
              <div className="mt-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 text-center">
                <p className="text-sm text-muted-foreground">You are</p>
                <div className="text-3xl font-bold text-foreground my-1">
                  {age.years} <span className="text-lg font-normal text-muted-foreground">years</span>
                </div>
                <div className="text-xl font-semibold text-purple-400">
                  & {age.days} days old
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stopwatch Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/50 rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full border-4 border-muted flex items-center justify-center relative">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Stopwatch</h3>
            <p className="text-muted-foreground text-sm mt-1">Simple timer functionality coming soon</p>
          </div>
          <button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-2 rounded-full font-medium transition-colors">
            Start Timer
          </button>
        </motion.div>
      </div>
    </div>
  );
}
