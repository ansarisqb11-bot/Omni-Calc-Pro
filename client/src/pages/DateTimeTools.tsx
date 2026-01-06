import { useState, useEffect } from "react";
import { Clock, CalendarDays, Timer } from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";

export default function DateTimeTools() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-display font-bold text-purple-400">Date & Time Tools</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* World Clock Card */}
        <div className="bg-card rounded-3xl p-8 border border-border shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-all" />
          
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold">Current Time</h2>
          </div>

          <div className="text-5xl md:text-7xl font-mono font-bold text-foreground tracking-tight">
            {format(now, "HH:mm")}
            <span className="text-2xl text-muted-foreground ml-2">{format(now, "ss")}</span>
          </div>
          <div className="text-lg text-purple-300 mt-2 font-medium">
            {format(now, "EEEE, MMMM do, yyyy")}
          </div>
        </div>

        {/* Date Diff */}
        <div className="bg-card rounded-3xl p-8 border border-border shadow-lg">
           <div className="flex items-center gap-3 mb-6">
            <CalendarDays className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold">Date Difference</h2>
          </div>
          
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-xs text-muted-foreground uppercase mb-1 block">Start Date</label>
                 <input type="date" className="w-full bg-muted border border-border rounded-xl p-3 text-sm" />
               </div>
               <div>
                 <label className="text-xs text-muted-foreground uppercase mb-1 block">End Date</label>
                 <input type="date" className="w-full bg-muted border border-border rounded-xl p-3 text-sm" />
               </div>
             </div>
             <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 text-center">
               <span className="text-sm text-purple-300">Difference</span>
               <div className="text-2xl font-bold text-white">0 Days</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
