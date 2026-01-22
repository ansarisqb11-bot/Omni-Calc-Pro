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
  ChevronRight
} from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "should-i-buy" | "discount-detective";

export default function SmartLifeTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("should-i-buy");

  const tools = [
    { id: "should-i-buy", label: "Should I Buy?", icon: ShoppingBag },
    { id: "discount-detective", label: "Discount Detective", icon: BadgePercent },
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
      {activeTool === "discount-detective" && <DiscountDetective />}
    </PageWrapper>
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
