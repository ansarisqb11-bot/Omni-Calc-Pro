import { useState, useEffect } from "react";
import { format, differenceInDays, differenceInYears, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, Hourglass } from "lucide-react";

export default function DateTimeTools() {
  const [now, setNow] = useState(new Date());
  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState<{ years: number; days: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateAge = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const years = differenceInYears(new Date(), birth);
    const days = differenceInDays(new Date(), addDays(birth, years * 365)); // rough estimate for days
    setAge({ years, days: Math.abs(days % 365) });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-primary to-accent border-0 text-primary-foreground shadow-xl">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
            <Clock className="w-8 h-8 mb-4 opacity-80" />
            <div className="text-6xl font-mono font-bold tracking-tight mb-2">
              {format(now, "HH:mm:ss")}
            </div>
            <div className="text-xl opacity-80 font-medium">
              {format(now, "EEEE, MMMM do, yyyy")}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hourglass className="w-5 h-5 text-primary" />
              Age Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input 
                type="date" 
                value={birthDate} 
                onChange={(e) => setBirthDate(e.target.value)}
                className="h-12"
              />
            </div>
            <Button onClick={calculateAge} className="w-full">Calculate Age</Button>
            
            {age && (
              <div className="p-4 bg-secondary/50 rounded-xl text-center mt-4">
                <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">You are</div>
                <div className="text-3xl font-bold text-foreground">
                  {age.years} <span className="text-base font-normal text-muted-foreground">years</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  & {age.days} days old
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timer" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-border/50 rounded-none h-auto p-0 mb-6">
          <TabsTrigger 
            value="timer" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            Stopwatch
          </TabsTrigger>
          <TabsTrigger 
            value="world" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            World Clock
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timer">
           <Stopwatch />
        </TabsContent>
        <TabsContent value="world">
           <WorldClock />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setTime((prev) => prev + 10), 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-card border border-border/50 rounded-3xl shadow-sm">
      <div className="text-7xl font-mono font-bold text-primary mb-8 tracking-wider">
        {formatTime(time)}
      </div>
      <div className="flex gap-4">
        <Button 
          size="lg" 
          variant={isRunning ? "destructive" : "default"}
          onClick={() => setIsRunning(!isRunning)}
          className="w-32 h-14 text-lg"
        >
          {isRunning ? "Stop" : "Start"}
        </Button>
        <Button 
          size="lg" 
          variant="outline"
          onClick={() => { setIsRunning(false); setTime(0); }}
          className="w-32 h-14 text-lg"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

function WorldClock() {
  const zones = [
    { city: "New York", zone: "America/New_York" },
    { city: "London", zone: "Europe/London" },
    { city: "Tokyo", zone: "Asia/Tokyo" },
    { city: "Sydney", zone: "Australia/Sydney" },
  ];

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {zones.map((z) => (
        <Card key={z.city} className="bg-card border-border/50">
          <CardContent className="p-6 text-center">
            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">{z.city}</div>
            <div className="text-2xl font-mono font-bold">
              {now.toLocaleTimeString("en-US", { timeZone: z.zone, hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {now.toLocaleDateString("en-US", { timeZone: z.zone, weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
