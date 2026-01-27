import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Tag,
  BadgePercent,
  ChevronRight,
  Leaf,
  Users,
  Wallet,
  Car,
  Fuel,
  Navigation,
  Clock as ClockIcon
} from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "should-i-buy" | "trip-calculator" | "discount-detective" | "garden-planner" | "guest-arranger" | "vacation-budget";

export default function SmartLifeTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("should-i-buy");

  const tools = [
    { id: "should-i-buy", label: "Should I Buy?", icon: ShoppingBag },
    { id: "trip-calculator", label: "Trip Planner", icon: Car },
    { id: "discount-detective", label: "Discount Detective", icon: BadgePercent },
    { id: "vacation-budget", label: "Vacation Budget", icon: Wallet },
    { id: "garden-planner", label: "Garden Planner", icon: Leaf },
    { id: "guest-arranger", label: "Guest Seating", icon: Users },
  ];

  return (
    <PageWrapper
      title="Smart Daily Life"
      subtitle="Make better decisions in your everyday life"
      accentColor="bg-indigo-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "should-i-buy" && <ShouldIBuyCalculator />}
      {activeTool === "trip-calculator" && <TripCalculator />}
      {activeTool === "discount-detective" && <DiscountDetective />}
      {activeTool === "vacation-budget" && <VacationBudgetDivider />}
      {activeTool === "garden-planner" && <GardenPlanner />}
      {activeTool === "guest-arranger" && <GuestArranger />}
    </PageWrapper>
  );
}

function TripCalculator() {
  const [mode, setMode] = useState<"planner" | "reverse">("planner");
  const [currency, setCurrency] = useState("₹");
  const [route, setRoute] = useState({ from: "Delhi", to: "Jaipur" });
  const [distance, setDistance] = useState("280");
  const [vehicle, setVehicle] = useState("SUV");
  const [mileage, setMileage] = useState("12");
  const [fuelPrice, setFuelPrice] = useState("95");
  const [passengers, setPassengers] = useState("4");
  const [foodPerPerson, setFoodPerPerson] = useState("500");
  const [tolls, setTolls] = useState("450");
  const [misc, setMisc] = useState("500");
  const [departTime, setDepartTime] = useState("06:00");
  const [avgSpeed, setAvgSpeed] = useState("50");
  
  // Reverse mode states
  const [budget, setBudget] = useState("5000");

  const calculate = () => {
    const dist = parseFloat(distance) || 0;
    const mil = parseFloat(mileage) || 1;
    const fp = parseFloat(fuelPrice) || 0;
    const pass = parseInt(passengers) || 1;
    const food = parseFloat(foodPerPerson) || 0;
    const toll = parseFloat(tolls) || 0;
    const ms = parseFloat(misc) || 0;
    const speed = parseFloat(avgSpeed) || 50;

    const fuelCost = (dist / mil) * fp;
    const foodTotal = pass * food;
    const subtotal = fuelCost + foodTotal + toll + ms;
    const buffer = subtotal * 0.04;
    const totalCost = subtotal + buffer;

    const timeHours = dist / speed;
    const hours = Math.floor(timeHours);
    const mins = Math.round((timeHours - hours) * 60);

    const [dHours, dMins] = departTime.split(":").map(Number);
    const arrivalDate = new Date();
    arrivalDate.setHours(dHours, dMins + Math.round(timeHours * 60));
    const arriveTime = arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    return {
      fuel: fuelCost,
      food: foodTotal,
      tolls: toll,
      misc: ms,
      buffer: buffer,
      total: totalCost,
      perPerson: totalCost / pass,
      duration: `${hours} hours ${mins} mins`,
      arrive: arriveTime
    };
  };

  const res = calculate();

  return (
    <div className="space-y-4 max-w-lg mx-auto pb-10">
      <ToolCard title="Road Trip Planner" icon={Car} iconColor="bg-sky-500">
        <div className="space-y-4">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setMode("planner")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === "planner" ? "bg-sky-500 text-white" : "bg-muted text-muted-foreground"}`}
            >
              PLAN TRIP
            </button>
            <button
              onClick={() => setMode("reverse")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === "reverse" ? "bg-sky-500 text-white" : "bg-muted text-muted-foreground"}`}
            >
              BUDGET MODE
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <InputField label="From" value={route.from} onChange={(v) => setRoute({...route, from: v})} />
            </div>
            <div className="flex-1">
              <InputField label="To" value={route.to} onChange={(v) => setRoute({...route, to: v})} />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <InputField label="Distance (km)" value={distance} onChange={setDistance} type="number" />
            </div>
            <div className="w-24">
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl px-3 py-3 text-foreground text-sm"
              >
                <option value="₹">₹ INR</option>
                <option value="$">$ USD</option>
              </select>
            </div>
          </div>

          {mode === "reverse" && (
            <InputField label="Total Trip Budget" value={budget} onChange={setBudget} type="number" suffix={currency} />
          )}

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Mileage (km/L)" value={mileage} onChange={setMileage} type="number" />
            <InputField label="Fuel Price" value={fuelPrice} onChange={setFuelPrice} type="number" suffix={`${currency}/L`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Passengers" value={passengers} onChange={setPassengers} type="number" />
            <InputField label="Food/Person" value={foodPerPerson} onChange={setFoodPerPerson} type="number" suffix={currency} />
          </div>

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <InputField label="Departure Time" value={departTime} onChange={setDepartTime} type="time" />
            </div>
            <div className="flex-1">
              <InputField label="Avg Speed (km/h)" value={avgSpeed} onChange={setAvgSpeed} type="number" />
            </div>
          </div>
        </div>
      </ToolCard>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Navigation className="w-24 h-24" />
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Estimated Total Cost</div>
              <div className="text-4xl font-black text-primary">
                {currency}{res.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-sm font-bold text-sky-400 mt-1">Per Person: {currency}{res.perPerson.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>

            <div className="space-y-3 bg-muted/30 p-4 rounded-xl">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2"><Fuel className="w-3.5 h-3.5" /> Fuel</span>
                <span className="font-bold">{currency}{res.fuel.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2"><Navigation className="w-3.5 h-3.5" /> Tolls</span>
                <span className="font-bold">{currency}{res.tolls.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">🍛 Food</span>
                <span className="font-bold">{currency}{res.food.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">📦 Misc</span>
                <span className="font-bold">{currency}{res.misc.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-border/50 italic">
                <span className="text-muted-foreground">Safety Buffer (4%)</span>
                <span className="text-muted-foreground">{currency}{res.buffer.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                <div className="text-[9px] font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1"><ClockIcon className="w-3 h-3" /> Duration</div>
                <div className="text-sm font-black">{res.duration}</div>
              </div>
              <div className="p-3 bg-sky-500/5 rounded-xl border border-sky-500/10">
                <div className="text-[9px] font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1">🏁 Arrival</div>
                <div className="text-sm font-black">{res.arrive}</div>
              </div>
            </div>

            {mode === "reverse" && (
              <div className={`p-3 rounded-xl border text-center text-xs font-bold ${parseFloat(budget) >= res.total ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
                {parseFloat(budget) >= res.total 
                  ? `✓ Within Budget (${currency}${(parseFloat(budget) - res.total).toLocaleString(undefined, { maximumFractionDigits: 0 })} Left)`
                  : `✕ Exceeds Budget by ${currency}${(res.total - parseFloat(budget)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function VacationBudgetDivider() {
  const [totalBudget, setTotalBudget] = useState("50000");
  const [days, setDays] = useState("5");
  const [currency, setCurrency] = useState("₹");

  const budgetNum = parseFloat(totalBudget) || 0;
  const daysNum = parseInt(days) || 1;

  const breakdown = [
    { label: "Travel", percent: 30, color: "bg-blue-500" },
    { label: "Hotel", percent: 40, color: "bg-purple-500" },
    { label: "Food", percent: 20, color: "bg-orange-500" },
    { label: "Shopping", percent: 10, color: "bg-pink-500" },
  ];

  const dailyAllowance = budgetNum / daysNum;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Vacation Budget Divider" icon={Wallet} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <InputField 
                label="Total Budget" 
                value={totalBudget} 
                onChange={setTotalBudget} 
                type="number" 
                suffix={currency}
              />
            </div>
            <div className="w-24">
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl px-3 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              >
                <option value="₹">Rupees (₹)</option>
                <option value="$">USD ($)</option>
                <option value="%">Percent (%)</option>
              </select>
            </div>
          </div>
          <InputField label="Number of Days" value={days} onChange={setDays} type="number" />

          <div className="space-y-4 pt-2">
            <div className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Breakdown</div>
            <div className="space-y-3">
              {breakdown.map((item) => {
                const amount = (budgetNum * item.percent) / 100;
                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{item.label}</span>
                      <span className="text-primary font-bold">
                        {currency === "%" ? `${item.percent}%` : `${currency}${amount.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-center">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Daily Allowance</div>
            <div className="text-2xl font-black text-indigo-500">
              {currency === "%" ? `${(100 / daysNum).toFixed(1)}%` : `${currency}${dailyAllowance.toLocaleString()}`}/day
            </div>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}

function GardenPlanner() {
  const [width, setWidth] = useState("10");
  const [height, setHeight] = useState("8");
  const [plants, setPlants] = useState([
    { name: "Tomatoes", count: 2, spacing: 3 },
    { name: "Chillies", count: 5, spacing: 1 },
  ]);

  const grid = [];
  const w = parseInt(width) || 0;
  const h = parseInt(height) || 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Garden Space Planner" icon={Leaf} iconColor="bg-green-500">
        <div className="space-y-4">
          <div className="flex gap-4">
            <InputField label="Width (ft)" value={width} onChange={setWidth} type="number" />
            <InputField label="Height (ft)" value={height} onChange={setHeight} type="number" />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Plants to Grow</label>
            {plants.map((p, i) => (
              <div key={i} className="flex gap-2 items-end bg-muted/30 p-3 rounded-xl">
                <div className="flex-1">
                  <InputField label="Plant Name" value={p.name} onChange={(v) => {
                    const newPlants = [...plants];
                    newPlants[i].name = v;
                    setPlants(newPlants);
                  }} />
                </div>
                <div className="w-20">
                  <InputField label="Qty" value={p.count.toString()} type="number" onChange={(v) => {
                    const newPlants = [...plants];
                    newPlants[i].count = parseInt(v) || 0;
                    setPlants(newPlants);
                  }} />
                </div>
                <div className="w-24">
                  <InputField label="Spacing (ft)" value={p.spacing.toString()} type="number" onChange={(v) => {
                    const newPlants = [...plants];
                    newPlants[i].spacing = parseInt(v) || 0;
                    setPlants(newPlants);
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 p-4 rounded-xl border border-dashed border-border">
            <div className="text-xs font-bold uppercase text-muted-foreground mb-4 flex justify-between">
              <span>Visual Layout ({w}x{h} ft)</span>
              <span className="text-green-500">Border Flowers Included</span>
            </div>
            <div 
              className="grid gap-1 bg-background/50 p-2 rounded border border-border overflow-auto"
              style={{ 
                gridTemplateColumns: `repeat(${Math.min(w, 15)}, 1fr)`,
                aspectRatio: `${w}/${h}`
              }}
            >
              {Array.from({ length: Math.min(w * h, 100) }).map((_, i) => {
                const x = i % w;
                const y = Math.floor(i / w);
                const isBorder = x === 0 || x === w - 1 || y === 0 || y === h - 1;
                
                return (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-sm flex items-center justify-center text-[8px] ${
                      isBorder ? "bg-pink-500/20 text-pink-500" : "bg-muted"
                    }`}
                  >
                    {isBorder ? "✿" : ""}
                    {!isBorder && i % 7 === 0 && <span className="text-red-500">●</span>}
                    {!isBorder && i % 11 === 0 && <span className="text-green-500">▲</span>}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex gap-4 text-[10px] text-muted-foreground justify-center">
              <div className="flex items-center gap-1"><span className="text-pink-500">✿</span> Border</div>
              <div className="flex items-center gap-1"><span className="text-red-500">●</span> Tomatoes</div>
              <div className="flex items-center gap-1"><span className="text-green-500">▲</span> Chillies</div>
            </div>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}

function GuestArranger() {
  const [guests, setGuests] = useState("50");
  const [tableSize, setTableSize] = useState("10");
  const [result, setResult] = useState<any[] | null>(null);

  const arrange = () => {
    const total = parseInt(guests) || 0;
    const size = parseInt(tableSize) || 1;
    const tableCount = Math.ceil(total / size);
    
    const arrangements = [];
    const familyNames = ["Family A", "Family B", "Family C", "Family D", "Family E", "Friends", "Colleagues"];
    
    for (let i = 0; i < tableCount; i++) {
      const remaining = total - (i * size);
      const currentSize = Math.min(size, remaining);
      const groups = familyNames.slice(i % 4, (i % 4) + 2);
      arrangements.push({
        id: i + 1,
        count: currentSize,
        groups: groups.join(", ") + " group"
      });
    }
    setResult(arrangements);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Guest Seating Arranger" icon={Users} iconColor="bg-blue-500">
        <div className="space-y-4">
          <div className="flex gap-4">
            <InputField label="Total Guests" value={guests} onChange={setGuests} type="number" />
            <InputField label="Seats per Table" value={tableSize} onChange={setTableSize} type="number" />
          </div>
          <ToolButton onClick={arrange}>Auto-Arrange Seating</ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {result.map((table) => (
            <div key={table.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">Table {table.id}</div>
                <div className="text-xs text-muted-foreground">{table.groups}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">{table.count}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Guests</div>
              </div>
            </div>
          ))}
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <p className="text-xs text-emerald-400">All guests seated with known family or friend groups.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ShouldIBuyCalculator() {
  const [price, setPrice] = useState("5000");
  const [frequency, setFrequency] = useState("Daily");
  const [durationValue, setDurationValue] = useState("1");
  const [durationUnit, setDurationUnit] = useState("Years");
  const [result, setResult] = useState<{ costPerUse: number; verdict: string; message: string; color: string } | null>(null);

  const calculate = () => {
    const p = parseFloat(price) || 0;
    const dv = parseFloat(durationValue) || 0;
    
    if (p > 0 && dv > 0) {
      // Calculate total uses
      let daysPerYear = 365;
      let totalDays = durationUnit === "Years" ? dv * daysPerYear : dv * 30;
      
      let multiplier = 1;
      if (frequency === "Daily") multiplier = 1;
      else if (frequency === "Weekly") multiplier = 1/7;
      else if (frequency === "Monthly") multiplier = 1/30;
      else if (frequency === "Yearly") multiplier = 1/365;

      const totalUses = Math.max(1, totalDays * multiplier);
      const costPerUse = p / totalUses;

      let verdict = "";
      let message = "";
      let color = "";

      if (costPerUse < p * 0.01) {
        verdict = "Good Buy";
        message = "The cost per use is very low. This item provides great value over time!";
        color = "text-emerald-400";
      } else if (costPerUse < p * 0.05) {
        verdict = "Decent Value";
        message = "Reasonable cost per use. If you need it, it's a fair purchase.";
        color = "text-blue-400";
      } else {
        verdict = "Think Twice";
        message = "The cost per use is quite high. Consider if you really need this or if there's a better alternative.";
        color = "text-orange-400";
      }

      setResult({ costPerUse, verdict, message, color });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title='"Should I Buy?" Calculator' icon={ShoppingBag} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <InputField label="Item Price" value={price} onChange={setPrice} type="number" suffix="₹" />
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">How often will you use it?</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              data-testid="select-frequency"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <InputField label="Lifespan Value" value={durationValue} onChange={setDurationValue} type="number" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Unit</label>
              <select
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                data-testid="select-duration-unit"
              >
                <option value="Months">Months</option>
                <option value="Years">Years</option>
              </select>
            </div>
          </div>

          <ToolButton onClick={calculate}>Analyze Purchase</ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Verdict" icon={HelpCircle} iconColor="bg-emerald-500">
            <div className="text-center py-4">
              <div className="text-sm text-muted-foreground mb-1">Cost Per Use</div>
              <div className="text-3xl font-bold text-foreground mb-4">₹{result.costPerUse.toFixed(2)}</div>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 font-bold ${result.color} mb-4`}>
                {result.verdict === "Good Buy" ? <CheckCircle2 className="w-5 h-5" /> : 
                 result.verdict === "Think Twice" ? <AlertCircle className="w-5 h-5" /> : 
                 <HelpCircle className="w-5 h-5" />}
                {result.verdict}
              </div>
              
              <p className="text-sm text-muted-foreground px-4 italic leading-relaxed">
                "{result.message}"
              </p>
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function DiscountDetective() {
  const [optionA, setOptionA] = useState({ price: "1000", discount: "30" });
  const [optionB, setOptionB] = useState({ buy: "2", get: "1", pricePerItem: "1000" });
  const [optionC, setOptionC] = useState({ price: "1200", cashback: "400" });

  const valA = parseFloat(optionA.price) * (1 - parseFloat(optionA.discount) / 100) || 0;
  const valB = (parseFloat(optionB.pricePerItem) * parseFloat(optionB.buy)) / (parseFloat(optionB.buy) + parseFloat(optionB.get)) || 0;
  const valC = parseFloat(optionC.price) - parseFloat(optionC.cashback) || 0;

  const results = [
    { label: "Option A", price: valA, description: "Direct Discount" },
    { label: "Option B", price: valB, description: "BOGOF / Bundle" },
    { label: "Option C", price: valC, description: "Cashback Offer" },
  ];

  const bestPrice = Math.min(...results.filter(r => r.price > 0).map(r => r.price));

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Which is the REAL deal?" icon={BadgePercent} iconColor="bg-amber-500">
        <div className="space-y-6">
          {/* Option A */}
          <div className="p-4 bg-muted/30 rounded-xl space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">A</div>
              <span className="text-sm font-semibold">Direct Discount</span>
            </div>
            <div className="flex gap-3">
              <InputField label="Original Price" value={optionA.price} onChange={(v) => setOptionA({...optionA, price: v})} type="number" suffix="₹" />
              <InputField label="Discount %" value={optionA.discount} onChange={(v) => setOptionA({...optionA, discount: v})} type="number" suffix="%" />
            </div>
          </div>

          {/* Option B */}
          <div className="p-4 bg-muted/30 rounded-xl space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">B</div>
              <span className="text-sm font-semibold">Buy X Get Y</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputField label="Buy" value={optionB.buy} onChange={(v) => setOptionB({...optionB, buy: v})} type="number" />
              <InputField label="Get Free" value={optionB.get} onChange={(v) => setOptionB({...optionB, get: v})} type="number" />
              <InputField label="Item Price" value={optionB.pricePerItem} onChange={(v) => setOptionB({...optionB, pricePerItem: v})} type="number" suffix="₹" />
            </div>
          </div>

          {/* Option C */}
          <div className="p-4 bg-muted/30 rounded-xl space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white">C</div>
              <span className="text-sm font-semibold">Cashback Offer</span>
            </div>
            <div className="flex gap-3">
              <InputField label="Price" value={optionC.price} onChange={(v) => setOptionC({...optionC, price: v})} type="number" suffix="₹" />
              <InputField label="Cashback" value={optionC.cashback} onChange={(v) => setOptionC({...optionC, cashback: v})} type="number" suffix="₹" />
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="The Verdict" icon={CheckCircle2} iconColor="bg-emerald-500">
        <div className="space-y-3">
          {results.map((r, i) => (
            <div 
              key={i}
              className={`flex justify-between items-center p-3 rounded-xl border ${
                r.price === bestPrice 
                  ? "bg-emerald-500/10 border-emerald-500/30" 
                  : "bg-muted/30 border-transparent"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{r.label}</span>
                  {r.price === bestPrice && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-white uppercase font-bold">Best Deal</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{r.description}</div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${r.price === bestPrice ? "text-emerald-400 text-lg" : "text-foreground"}`}>
                  ₹{r.price.toFixed(0)}
                </div>
                <div className="text-[10px] text-muted-foreground">Effective Price</div>
              </div>
            </div>
          ))}
        </div>
      </ToolCard>
    </div>
  );
}
