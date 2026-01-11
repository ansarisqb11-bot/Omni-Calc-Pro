import { useState } from "react";
import { motion } from "framer-motion";
import { Banknote, Percent, TrendingUp, Receipt, PiggyBank, CreditCard, Building2, BadgePercent, LineChart, Coins } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";

type ToolType = "emi" | "compound" | "tip" | "roi" | "gst" | "sip" | "salary" | "discount";

export default function FinanceTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("emi");

  const tools = [
    { id: "emi" as ToolType, label: "Loan EMI", icon: CreditCard },
    { id: "compound" as ToolType, label: "Compound", icon: TrendingUp },
    { id: "sip" as ToolType, label: "SIP", icon: LineChart },
    { id: "gst" as ToolType, label: "GST/VAT", icon: Building2 },
    { id: "tip" as ToolType, label: "Tip", icon: Receipt },
    { id: "roi" as ToolType, label: "ROI", icon: PiggyBank },
    { id: "salary" as ToolType, label: "Salary", icon: Coins },
    { id: "discount" as ToolType, label: "Discount", icon: BadgePercent },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">Finance Tools</h1>
        <p className="text-slate-400 text-sm mt-1">Calculate loans, interest, tips and more</p>
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
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
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
        {activeTool === "emi" && <LoanEMICalculator />}
        {activeTool === "compound" && <CompoundInterestCalculator />}
        {activeTool === "sip" && <SIPCalculator />}
        {activeTool === "gst" && <GSTCalculator />}
        {activeTool === "tip" && <TipCalculator />}
        {activeTool === "roi" && <ROICalculator />}
        {activeTool === "salary" && <SalaryConverter />}
        {activeTool === "discount" && <DiscountCalculator />}
      </div>
    </div>
  );
}

function LoanEMICalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("8.5");
  const [tenure, setTenure] = useState("12");
  const [result, setResult] = useState<{ emi: number; totalInterest: number; totalPayment: number } | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseInt(tenure);
    
    if (p && r && n) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - p;
      setResult({ emi, totalInterest, totalPayment });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Loan EMI Calculator" icon={CreditCard} iconColor="bg-emerald-500">
        <div className="space-y-4">
          <InputField label="Loan Amount" value={principal} onChange={setPrincipal} type="number" suffix="$" />
          <InputField label="Interest Rate (Annual)" value={rate} onChange={setRate} type="number" suffix="%" step={0.1} />
          <InputField label="Loan Tenure (Months)" value={tenure} onChange={setTenure} type="number" />
          <ToolButton onClick={calculate} variant="success">Calculate EMI</ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Results" icon={Banknote} iconColor="bg-blue-500">
            <div className="space-y-3">
              <ResultDisplay label="Monthly EMI" value={`$${result.emi.toFixed(2)}`} highlight color="text-emerald-400" />
              <ResultDisplay label="Total Interest" value={`$${result.totalInterest.toFixed(2)}`} color="text-orange-400" />
              <ResultDisplay label="Total Payment" value={`$${result.totalPayment.toFixed(2)}`} />
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");
  const [frequency, setFrequency] = useState("12");
  const [result, setResult] = useState<{ amount: number; interest: number } | null>(null);

  const calculate = () => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) / 100 || 0;
    const t = parseInt(years) || 0;
    const n = parseInt(frequency) || 1;
    
    if (p > 0 && r > 0 && t > 0 && n > 0) {
      const amount = p * Math.pow(1 + r / n, n * t);
      setResult({ amount, interest: amount - p });
    } else {
      setResult(null);
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Compound Interest" icon={TrendingUp} iconColor="bg-blue-500">
        <div className="space-y-4">
          <InputField label="Principal Amount" value={principal} onChange={setPrincipal} type="number" suffix="$" />
          <InputField label="Interest Rate (Annual)" value={rate} onChange={setRate} type="number" suffix="%" />
          <InputField label="Time Period (Years)" value={years} onChange={setYears} type="number" />
          <div>
            <label className="text-sm font-medium text-slate-400 mb-1.5 block">Compound Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              data-testid="select-frequency"
            >
              <option value="1">Annually</option>
              <option value="2">Semi-Annually</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
              <option value="365">Daily</option>
            </select>
          </div>
          <ToolButton onClick={calculate}>Calculate</ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Results" icon={PiggyBank} iconColor="bg-emerald-500">
            <div className="space-y-3">
              <ResultDisplay label="Final Amount" value={`$${result.amount.toFixed(2)}`} highlight color="text-emerald-400" />
              <ResultDisplay label="Total Interest Earned" value={`$${result.interest.toFixed(2)}`} color="text-blue-400" />
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function TipCalculator() {
  const [billAmount, setBillAmount] = useState("50");
  const [tipPercent, setTipPercent] = useState("15");
  const [people, setPeople] = useState("1");

  const tip = (parseFloat(billAmount) || 0) * (parseFloat(tipPercent) || 0) / 100;
  const total = (parseFloat(billAmount) || 0) + tip;
  const perPerson = total / (parseInt(people) || 1);

  const quickTips = [10, 15, 18, 20, 25];

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Tip Calculator" icon={Receipt} iconColor="bg-orange-500">
        <div className="space-y-4">
          <InputField label="Bill Amount" value={billAmount} onChange={setBillAmount} type="number" suffix="$" />
          
          <div>
            <label className="text-sm font-medium text-slate-400 mb-2 block">Tip Percentage</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {quickTips.map((t) => (
                <button
                  key={t}
                  onClick={() => setTipPercent(t.toString())}
                  data-testid={`button-tip-${t}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    tipPercent === t.toString()
                      ? "bg-orange-500 text-white"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                >
                  {t}%
                </button>
              ))}
            </div>
            <InputField label="" value={tipPercent} onChange={setTipPercent} type="number" suffix="%" />
          </div>

          <InputField label="Split Between" value={people} onChange={setPeople} type="number" min={1} />
        </div>
      </ToolCard>

      <ToolCard title="Summary" icon={Banknote} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Tip Amount" value={`$${tip.toFixed(2)}`} color="text-orange-400" />
          <ResultDisplay label="Total Bill" value={`$${total.toFixed(2)}`} />
          {parseInt(people) > 1 && (
            <ResultDisplay label="Per Person" value={`$${perPerson.toFixed(2)}`} highlight color="text-emerald-400" />
          )}
        </div>
      </ToolCard>
    </div>
  );
}

function ROICalculator() {
  const [investment, setInvestment] = useState("10000");
  const [returns, setReturns] = useState("15000");

  const invested = parseFloat(investment) || 0;
  const returned = parseFloat(returns) || 0;
  const profit = returned - invested;
  const roi = invested > 0 ? (profit / invested) * 100 : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="ROI Calculator" icon={PiggyBank} iconColor="bg-purple-500">
        <div className="space-y-4">
          <InputField label="Initial Investment" value={investment} onChange={setInvestment} type="number" suffix="$" />
          <InputField label="Final Value" value={returns} onChange={setReturns} type="number" suffix="$" />
        </div>
      </ToolCard>

      <ToolCard title="Results" icon={Percent} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Profit/Loss" value={`$${profit.toFixed(2)}`} color={profit >= 0 ? "text-emerald-400" : "text-red-400"} />
          <ResultDisplay label="ROI" value={`${roi.toFixed(2)}%`} highlight color={roi >= 0 ? "text-emerald-400" : "text-red-400"} />
        </div>
      </ToolCard>
    </div>
  );
}

function SIPCalculator() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");

  const m = parseFloat(monthly) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseInt(years) || 0) * 12;
  const invested = m * n;
  const futureValue = r > 0 ? m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : invested;
  const returns = futureValue - invested;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="SIP Calculator" icon={LineChart} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <InputField label="Monthly Investment" value={monthly} onChange={setMonthly} type="number" suffix="$" />
          <InputField label="Expected Return" value={rate} onChange={setRate} type="number" suffix="%" />
          <InputField label="Time Period" value={years} onChange={setYears} type="number" suffix="years" />
        </div>
      </ToolCard>

      <ToolCard title="Projected Growth" icon={TrendingUp} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Total Invested" value={`$${invested.toLocaleString()}`} />
          <ResultDisplay label="Est. Returns" value={`$${returns.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`} color="text-indigo-400" />
          <ResultDisplay label="Future Value" value={`$${futureValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`} highlight color="text-emerald-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function GSTCalculator() {
  const [amount, setAmount] = useState("1000");
  const [gstRate, setGstRate] = useState("18");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const base = parseFloat(amount) || 0;
  const rate = parseFloat(gstRate) || 0;
  
  const gstAmount = mode === "add" ? base * (rate / 100) : base - (base * 100) / (100 + rate);
  const total = mode === "add" ? base + base * (rate / 100) : (base * 100) / (100 + rate);
  const taxPart = mode === "add" ? gstAmount : base - total;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="GST / VAT Calculator" icon={Building2} iconColor="bg-teal-500">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("add")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === "add" ? "bg-teal-500 text-white" : "bg-muted text-muted-foreground"}`}
              data-testid="button-gst-add"
            >
              Add GST
            </button>
            <button
              onClick={() => setMode("remove")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === "remove" ? "bg-teal-500 text-white" : "bg-muted text-muted-foreground"}`}
              data-testid="button-gst-remove"
            >
              Remove GST
            </button>
          </div>
          <InputField label={mode === "add" ? "Amount (excl. GST)" : "Amount (incl. GST)"} value={amount} onChange={setAmount} type="number" suffix="$" />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">GST Rate</label>
            <div className="flex gap-2 flex-wrap">
              {[5, 12, 18, 28].map((r) => (
                <button
                  key={r}
                  onClick={() => setGstRate(r.toString())}
                  className={`px-4 py-2 rounded-lg text-sm ${gstRate === r.toString() ? "bg-teal-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-gst-rate-${r}`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Breakdown" icon={Percent} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label={mode === "add" ? "Base Amount" : "Net Amount"} value={`$${(mode === "add" ? base : total).toFixed(2)}`} />
          <ResultDisplay label="GST Amount" value={`$${taxPart.toFixed(2)}`} color="text-teal-400" />
          <ResultDisplay label={mode === "add" ? "Total (incl. GST)" : "Original Amount"} value={`$${(mode === "add" ? total : base).toFixed(2)}`} highlight color="text-emerald-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function SalaryConverter() {
  const [hourly, setHourly] = useState("25");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");

  const h = parseFloat(hourly) || 0;
  const hpw = parseFloat(hoursPerWeek) || 40;
  
  const daily = h * 8;
  const weekly = h * hpw;
  const monthly = weekly * 4.33;
  const yearly = weekly * 52;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Salary Converter" icon={Coins} iconColor="bg-amber-500">
        <div className="space-y-4">
          <InputField label="Hourly Rate" value={hourly} onChange={setHourly} type="number" suffix="$/hr" />
          <InputField label="Hours per Week" value={hoursPerWeek} onChange={setHoursPerWeek} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Salary Breakdown" icon={Banknote} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Daily (8 hrs)" value={`$${daily.toFixed(2)}`} />
          <ResultDisplay label="Weekly" value={`$${weekly.toFixed(2)}`} color="text-amber-400" />
          <ResultDisplay label="Monthly" value={`$${monthly.toFixed(2)}`} color="text-blue-400" />
          <ResultDisplay label="Yearly" value={`$${yearly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} highlight color="text-emerald-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState("100");
  const [discount1, setDiscount1] = useState("20");
  const [discount2, setDiscount2] = useState("10");

  const original = parseFloat(originalPrice) || 0;
  const d1 = parseFloat(discount1) || 0;
  const d2 = parseFloat(discount2) || 0;

  const afterFirst = original * (1 - d1 / 100);
  const afterSecond = afterFirst * (1 - d2 / 100);
  const totalSaved = original - afterSecond;
  const effectiveDiscount = original > 0 ? (totalSaved / original) * 100 : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Stacked Discount Calculator" icon={BadgePercent} iconColor="bg-rose-500">
        <div className="space-y-4">
          <InputField label="Original Price" value={originalPrice} onChange={setOriginalPrice} type="number" suffix="$" />
          <InputField label="First Discount" value={discount1} onChange={setDiscount1} type="number" suffix="%" />
          <InputField label="Second Discount" value={discount2} onChange={setDiscount2} type="number" suffix="%" />
        </div>
      </ToolCard>

      <ToolCard title="Final Price" icon={Receipt} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="After 1st Discount" value={`$${afterFirst.toFixed(2)}`} />
          <ResultDisplay label="After 2nd Discount" value={`$${afterSecond.toFixed(2)}`} highlight color="text-emerald-400" />
          <ResultDisplay label="Total Saved" value={`$${totalSaved.toFixed(2)}`} color="text-rose-400" />
          <ResultDisplay label="Effective Discount" value={`${effectiveDiscount.toFixed(1)}%`} color="text-blue-400" />
        </div>
      </ToolCard>
    </div>
  );
}
