import { useState, useMemo } from "react";
import { Calendar, HelpCircle, CalendarDays, Search } from "lucide-react";
import { DesktopToolGrid, InputPanel, InputField } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";
import { format, addYears } from "date-fns";

type Mode = "day-finder" | "birthday-predictor";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DayFinderTools() {
  const [activeMode, setActiveMode] = useState<Mode>("day-finder");

  const modes = [
    { id: "day-finder", label: "Day Finder", icon: Calendar },
    { id: "birthday-predictor", label: "Birthday Predictor", icon: CalendarDays },
  ];

  return (
    <PageWrapper
      title="Day Finder"
      subtitle="Discover which day of the week a date falls on"
      accentColor="bg-sky-500"
      tools={modes}
      activeTool={activeMode}
      onToolChange={(id) => setActiveMode(id as Mode)}
    >
      <DayCalculator mode={activeMode} />
    </PageWrapper>
  );
}

function DayCalculator({ mode }: { mode: Mode }) {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const result = useMemo(() => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    if (mode === "day-finder") {
      return DAYS[d.getDay()];
    } else {
      const predictions = [];
      for (let i = 1; i <= 10; i++) {
        const nextDate = addYears(d, i);
        predictions.push({ year: nextDate.getFullYear(), day: DAYS[nextDate.getDay()] });
      }
      return predictions;
    }
  }, [mode, date]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel
          title={mode === "day-finder" ? "Find the Day" : "Birthday Predictor"}
          icon={mode === "day-finder" ? Calendar : CalendarDays}
          iconColor="bg-sky-500"
        >
          <InputField
            label={mode === "day-finder" ? "Select Date" : "Your Birthday (Date & Month)"}
            value={date}
            onChange={setDate}
            type="date"
          />
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-sky-500/5 p-3 rounded-lg border border-sky-500/10">
            <HelpCircle className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>Calculation is based on the universal Gregorian calendar.</span>
          </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase text-muted-foreground">
            <Search className="w-3.5 h-3.5" />
            {mode === "day-finder" ? "Result" : "Next 10 Years"}
          </div>
          {mode === "day-finder" ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-4xl font-bold text-sky-400">{result as string || "Invalid Date"}</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {(result as any[])?.map((p) => (
                <div key={p.year} className="flex justify-between p-2 bg-muted/50 rounded-lg border border-border text-sm">
                  <span className="text-muted-foreground font-medium">{p.year}</span>
                  <span className="text-sky-400 font-bold">{p.day}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      }
    />
  );
}
