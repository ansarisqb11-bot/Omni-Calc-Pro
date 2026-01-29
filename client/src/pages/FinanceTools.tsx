import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Banknote, Percent, TrendingUp, Receipt, PiggyBank, CreditCard, 
  Building2, BadgePercent, LineChart, Coins, Calculator, TrendingDown, Tag 
} from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "emi" | "compound" | "tip" | "roi" | "gst" | "sip" | "salary" | "discount" | "currency" | "mortgage" | "profit" | "markup" | "margin" | "inflation";

type NumberFormat = "US" | "IN";

function CurrencySelector({ value, onChange }: { value: NumberFormat; onChange: (v: NumberFormat) => void }) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-xl mb-4">
      <button
        onClick={() => onChange("US")}
        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${value === "US" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}
      >
        USA ($)
      </button>
      <button
        onClick={() => onChange("IN")}
        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${value === "IN" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}
      >
        INDIAN (₹)
      </button>
    </div>
  );
}

export default function FinanceTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("emi");

  const tools = [
    { id: "emi", label: "Loan EMI", icon: CreditCard },
    { id: "mortgage", label: "Mortgage", icon: Building2 },
    { id: "compound", label: "Compound", icon: TrendingUp },
    { id: "sip", label: "SIP", icon: LineChart },
    { id: "inflation", label: "Inflation", icon: TrendingDown },
    { id: "currency", label: "Currency", icon: Coins },
    { id: "gst", label: "GST/VAT", icon: Building2 },
    { id: "tip", label: "Tip", icon: Receipt },
    { id: "roi", label: "ROI", icon: PiggyBank },
    { id: "salary", label: "Salary", icon: Coins },
    { id: "discount", label: "Discount", icon: BadgePercent },
    { id: "profit", label: "Profit/Loss", icon: TrendingDown },
    { id: "markup", label: "Markup", icon: Tag },
    { id: "margin", label: "Margin", icon: Percent },
  ];

  return (
    <PageWrapper
      title="Finance Tools"
      subtitle="Calculate loans, interest, tips and more"
      accentColor="bg-emerald-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "emi" && <LoanEMICalculator />}
      {activeTool === "compound" && <CompoundInterestCalculator />}
      {activeTool === "sip" && <SIPCalculator />}
      {activeTool === "gst" && <GSTCalculator />}
      {activeTool === "tip" && <TipCalculator />}
      {activeTool === "roi" && <ROICalculator />}
      {activeTool === "salary" && <SalaryConverter />}
      {activeTool === "discount" && <DiscountCalculator />}
      {activeTool === "currency" && <CurrencyConverter />}
      {activeTool === "mortgage" && <MortgageCalculator />}
      {activeTool === "profit" && <ProfitLossCalculator />}
      {activeTool === "markup" && <MarkupCalculator />}
      {activeTool === "margin" && <MarginCalculator />}
      {activeTool === "inflation" && <InflationCalculator />}
    </PageWrapper>
  );
}

function LoanEMICalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("8.5");
  const [tenure, setTenure] = useState("12");
  const [result, setResult] = useState<{ emi: number; totalInterest: number; totalPayment: number } | null>(null);

  const symbol = format === "IN" ? "₹" : "$";

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
      <CurrencySelector value={format} onChange={setFormat} />
      <ToolCard title="Loan EMI Calculator" icon={CreditCard} iconColor="bg-emerald-500">
        <div className="space-y-4">
          <InputField label="Loan Amount" value={principal} onChange={setPrincipal} type="number" suffix={symbol} />
          <InputField label="Interest Rate (Annual)" value={rate} onChange={setRate} type="number" suffix="%" step={0.1} />
          <InputField label="Loan Tenure (Months)" value={tenure} onChange={setTenure} type="number" />
          <ToolButton onClick={calculate} variant="success">Calculate EMI</ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Results" icon={Banknote} iconColor="bg-blue-500">
            <div className="space-y-3">
              <ResultDisplay label="Monthly EMI" value={`${symbol}${result.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} highlight color="text-emerald-400" />
              <ResultDisplay label="Total Interest" value={`${symbol}${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="text-orange-400" />
              <ResultDisplay label="Total Payment" value={`${symbol}${result.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function CompoundInterestCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");
  const [frequency, setFrequency] = useState("12");
  const [result, setResult] = useState<{ amount: number; interest: number } | null>(null);

  const symbol = format === "IN" ? "₹" : "$";

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
      <CurrencySelector value={format} onChange={setFormat} />
      <ToolCard title="Compound Interest" icon={TrendingUp} iconColor="bg-blue-500">
        <div className="space-y-4">
          <InputField label="Principal Amount" value={principal} onChange={setPrincipal} type="number" suffix={symbol} />
          <InputField label="Interest Rate (Annual)" value={rate} onChange={setRate} type="number" suffix="%" />
          <InputField label="Time Period (Years)" value={years} onChange={setYears} type="number" />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Compound Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
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
              <ResultDisplay label="Final Amount" value={`${symbol}${result.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} highlight color="text-emerald-400" />
              <ResultDisplay label="Total Interest Earned" value={`${symbol}${result.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="text-blue-400" />
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function TipCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [billAmount, setBillAmount] = useState("50");
  const [tipPercent, setTipPercent] = useState("15");
  const [people, setPeople] = useState("1");

  const symbol = format === "IN" ? "₹" : "$";
  const tip = (parseFloat(billAmount) || 0) * (parseFloat(tipPercent) || 0) / 100;
  const total = (parseFloat(billAmount) || 0) + tip;
  const perPerson = total / (parseInt(people) || 1);

  const quickTips = [10, 15, 18, 20, 25];

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <CurrencySelector value={format} onChange={setFormat} />
      <ToolCard title="Tip Calculator" icon={Receipt} iconColor="bg-orange-500">
        <div className="space-y-4">
          <InputField label="Bill Amount" value={billAmount} onChange={setBillAmount} type="number" suffix={symbol} />
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Tip Percentage</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {quickTips.map((t) => (
                <button
                  key={t}
                  onClick={() => setTipPercent(t.toString())}
                  data-testid={`button-tip-${t}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    tipPercent === t.toString()
                      ? "bg-orange-500 text-foreground"
                      : "bg-muted/80 text-foreground hover:bg-muted/70"
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
          <ResultDisplay label="Tip Amount" value={`${symbol}${tip.toFixed(2)}`} color="text-orange-400" />
          <ResultDisplay label="Total Bill" value={`${symbol}${total.toFixed(2)}`} />
          {parseInt(people) > 1 && (
            <ResultDisplay label="Per Person" value={`${symbol}${perPerson.toFixed(2)}`} highlight color="text-emerald-400" />
          )}
        </div>
      </ToolCard>
    </div>
  );
}

function ROICalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [investment, setInvestment] = useState("10000");
  const [returns, setReturns] = useState("15000");

  const symbol = format === "IN" ? "₹" : "$";
  const invested = parseFloat(investment) || 0;
  const returned = parseFloat(returns) || 0;
  const profit = returned - invested;
  const roi = invested > 0 ? (profit / invested) * 100 : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <CurrencySelector value={format} onChange={setFormat} />
      <ToolCard title="ROI Calculator" icon={PiggyBank} iconColor="bg-purple-500">
        <div className="space-y-4">
          <InputField label="Initial Investment" value={investment} onChange={setInvestment} type="number" suffix={symbol} />
          <InputField label="Final Value" value={returns} onChange={setReturns} type="number" suffix={symbol} />
        </div>
      </ToolCard>

      <ToolCard title="Results" icon={Percent} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Profit/Loss" value={`${symbol}${profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color={profit >= 0 ? "text-emerald-400" : "text-red-400"} />
          <ResultDisplay label="ROI" value={`${roi.toFixed(2)}%`} highlight color={roi >= 0 ? "text-emerald-400" : "text-red-400"} />
        </div>
      </ToolCard>
    </div>
  );
}

function SIPCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");

  const symbol = format === "IN" ? "₹" : "$";
  const m = parseFloat(monthly) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseInt(years) || 0) * 12;
  const invested = m * n;
  const futureValue = r > 0 ? m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : invested;
  const returns = futureValue - invested;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <CurrencySelector value={format} onChange={setFormat} />
      <ToolCard title="SIP Calculator" icon={LineChart} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <InputField label="Monthly Investment" value={monthly} onChange={setMonthly} type="number" suffix={symbol} />
          <InputField label="Expected Return" value={rate} onChange={setRate} type="number" suffix="%" />
          <InputField label="Time Period" value={years} onChange={setYears} type="number" suffix="years" />
        </div>
      </ToolCard>

      <ToolCard title="Projected Growth" icon={TrendingUp} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Total Invested" value={`${symbol}${invested.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          <ResultDisplay label="Est. Returns" value={`${symbol}${returns.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="text-indigo-400" />
          <ResultDisplay label="Future Value" value={`${symbol}${futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} highlight color="text-emerald-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function GSTCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [amount, setAmount] = useState("1000");
  const [gstRate, setGstRate] = useState("18");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const symbol = format === "IN" ? "₹" : "$";
  const base = parseFloat(amount) || 0;
  const rate = parseFloat(gstRate) || 0;
  
  const gstAmount = mode === "add" ? base * (rate / 100) : base - (base * 100) / (100 + rate);
  const total = mode === "add" ? base + base * (rate / 100) : (base * 100) / (100 + rate);
  const taxPart = mode === "add" ? gstAmount : base - total;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <CurrencySelector value={format} onChange={setFormat} />
      <ToolCard title="GST / VAT Calculator" icon={Building2} iconColor="bg-teal-500">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("add")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === "add" ? "bg-teal-500 text-foreground" : "bg-muted text-muted-foreground"}`}
              data-testid="button-gst-add"
            >
              Add GST
            </button>
            <button
              onClick={() => setMode("remove")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === "remove" ? "bg-teal-500 text-foreground" : "bg-muted text-muted-foreground"}`}
              data-testid="button-gst-remove"
            >
              Remove GST
            </button>
          </div>
          <InputField label={mode === "add" ? "Amount (excl. GST)" : "Amount (incl. GST)"} value={amount} onChange={setAmount} type="number" suffix={symbol} />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">GST Rate</label>
            <div className="flex gap-2 flex-wrap">
              {[5, 12, 18, 28].map((r) => (
                <button
                  key={r}
                  onClick={() => setGstRate(r.toString())}
                  className={`px-4 py-2 rounded-lg text-sm ${gstRate === r.toString() ? "bg-teal-500 text-foreground" : "bg-muted text-muted-foreground"}`}
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
          <ResultDisplay label={mode === "add" ? "Base Amount" : "Net Amount"} value={`${symbol}${ (mode === "add" ? base : total).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          <ResultDisplay label="GST Amount" value={`${symbol}${taxPart.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="text-teal-400" />
          <ResultDisplay label={mode === "add" ? "Total (incl. GST)" : "Original Amount"} value={`${symbol}${ (mode === "add" ? total : base).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} highlight color="text-emerald-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function SalaryConverter() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [hourly, setHourly] = useState("25");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");

  const symbol = format === "IN" ? "₹" : "$";
  const h = parseFloat(hourly) || 0;
  const hpw = parseFloat(hoursPerWeek) || 40;
  
  const daily = h * 8;
  const weekly = h * hpw;
  const monthly = weekly * 4.33;
  const yearly = weekly * 52;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <CurrencySelector value={format} onChange={setFormat} />
      <ToolCard title="Salary Converter" icon={Coins} iconColor="bg-amber-500">
        <div className="space-y-4">
          <InputField label="Hourly Rate" value={hourly} onChange={setHourly} type="number" suffix={`${symbol}/hr`} />
          <InputField label="Hours per Week" value={hoursPerWeek} onChange={setHoursPerWeek} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Salary Breakdown" icon={Banknote} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Daily (8 hrs)" value={`${symbol}${daily.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          <ResultDisplay label="Weekly" value={`${symbol}${weekly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="text-amber-400" />
          <ResultDisplay label="Monthly" value={`${symbol}${monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="text-blue-400" />
          <ResultDisplay label="Yearly" value={`${symbol}${yearly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} highlight color="text-emerald-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function DiscountCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [originalPrice, setOriginalPrice] = useState("100");
  const [discount1, setDiscount1] = useState("20");
  const [discount2, setDiscount2] = useState("10");

  const symbol = format === "IN" ? "₹" : "$";
  const original = parseFloat(originalPrice) || 0;
  const d1 = parseFloat(discount1) || 0;
  const d2 = parseFloat(discount2) || 0;

  const afterFirst = original * (1 - d1 / 100);
  const afterSecond = afterFirst * (1 - d2 / 100);
  const totalSaved = original - afterSecond;
  const effectiveDiscount = original > 0 ? (totalSaved / original) * 100 : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <CurrencySelector value={format} onChange={setFormat} />
      <ToolCard title="Stacked Discount Calculator" icon={BadgePercent} iconColor="bg-rose-500">
        <div className="space-y-4">
          <InputField label="Original Price" value={originalPrice} onChange={setOriginalPrice} type="number" suffix={symbol} />
          <InputField label="First Discount" value={discount1} onChange={setDiscount1} type="number" suffix="%" />
          <InputField label="Second Discount" value={discount2} onChange={setDiscount2} type="number" suffix="%" />
        </div>
      </ToolCard>

      <ToolCard title="Final Price" icon={Receipt} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="After 1st Discount" value={`${symbol}${afterFirst.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          <ResultDisplay label="After 2nd Discount" value={`${symbol}${afterSecond.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} highlight color="text-emerald-400" />
          <ResultDisplay label="Total Saved" value={`${symbol}${totalSaved.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="text-rose-400" />
          <ResultDisplay label="Effective Discount" value={`${effectiveDiscount.toFixed(1)}%`} color="text-blue-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function InflationCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [mode, setMode] = useState<"historical" | "future">("historical");
  const [amount, setAmount] = useState("1000");
  const [year, setYear] = useState("2010");
  const [inflationRate, setInflationRate] = useState(format === "IN" ? "6.0" : "2.5");

  const currentYear = new Date().getFullYear();
  const amt = parseFloat(amount) || 0;
  const rate = parseFloat(inflationRate) || 0;
  const targetYear = parseInt(year) || 2010;

  const yearsDiff = mode === "historical" ? currentYear - targetYear : targetYear - currentYear;
  const multiplier = Math.pow(1 + rate / 100, yearsDiff);
  const resultValue = mode === "historical" ? amt * multiplier : amt / multiplier;

  const symbol = format === "IN" ? "₹" : "$";

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <CurrencySelector value={format} onChange={setFormat} />
      <ToolCard title="Inflation Calculator" icon={TrendingDown} iconColor="bg-red-500">
        <div className="space-y-4">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => {
                setMode("historical");
                setYear("2010");
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === "historical" ? "bg-red-600 text-white" : "bg-muted text-muted-foreground"}`}
            >
              PURCHASING POWER
            </button>
            <button
              onClick={() => {
                setMode("future");
                setYear("2030");
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === "future" ? "bg-red-600 text-white" : "bg-muted text-muted-foreground"}`}
            >
              FUTURE VALUE
            </button>
          </div>

          <InputField 
            label={mode === "historical" ? `Amount in ${year}` : "Current Amount"} 
            value={amount} 
            onChange={setAmount} 
            type="number" 
            suffix={symbol}
          />
          <InputField 
            label={mode === "historical" ? "Starting Year" : "Target Future Year"} 
            value={year} 
            onChange={setYear} 
            type="number" 
          />
          <InputField 
            label="Avg. Annual Inflation Rate (%)" 
            value={inflationRate} 
            onChange={setInflationRate} 
            type="number" 
            step={0.1}
          />
        </div>
      </ToolCard>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <ToolCard title="Analysis" icon={Calculator} iconColor="bg-emerald-500">
          <div className="space-y-6">
            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <div className="text-sm text-muted-foreground mb-1">
                {mode === "historical" 
                  ? `${symbol}${amt.toLocaleString()} in ${year} is worth` 
                  : `${symbol}${amt.toLocaleString()} today will buy`}
              </div>
              <div className="text-3xl font-black text-emerald-400">
                {symbol}{resultValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-muted-foreground mt-2 font-medium">
                {mode === "historical" 
                  ? `Equivalent purchasing power in ${currentYear}`
                  : `worth of goods in year ${year}`}
              </div>
            </div>

            <div className="space-y-3">
              <ResultDisplay 
                label="Total Change" 
                value={`${((multiplier - 1) * 100).toFixed(1)}%`} 
                color="text-red-400"
              />
              <ResultDisplay 
                label="Cumulative Multiplier" 
                value={`${multiplier.toFixed(2)}x`} 
              />
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <p className="text-[10px] text-red-200 leading-relaxed italic">
                  *This calculation assumes a constant annual inflation rate over {Math.abs(yearsDiff)} years. 
                  Actual purchasing power varies by country and economic conditions.
                </p>
              </div>
            </div>
          </div>
        </ToolCard>
      </motion.div>
    </div>
  );
}

function CurrencyConverter() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState(format === "IN" ? "INR" : "USD");
  const [to, setTo] = useState(format === "IN" ? "USD" : "INR");

  const rates: Record<string, number> = {
    USD: 1,
    INR: 83.5,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 156.4,
    CAD: 1.36,
    AUD: 1.51
  };

  const amt = parseFloat(amount) || 0;
  const result = (amt / rates[from]) * rates[to];

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <CurrencySelector value={format} onChange={setFormat} />
      <ToolCard title="Currency Converter" icon={Coins} iconColor="bg-blue-500">
        <div className="space-y-4">
          <InputField label="Amount" value={amount} onChange={setAmount} type="number" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">From</label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3"
              >
                {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">To</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3"
              >
                {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Result" icon={Calculator} iconColor="bg-emerald-500">
        <div className="text-center p-4">
          <div className="text-sm text-muted-foreground mb-1">{amount} {from} =</div>
          <div className="text-3xl font-black text-emerald-400">{result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}</div>
        </div>
      </ToolCard>
    </div>
  );
}

function MortgageCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [price, setPrice] = useState("300000");
  const [down, setDown] = useState("20");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");

  const symbol = format === "IN" ? "₹" : "$";
  const p = parseFloat(price) || 0;
  const d = parseFloat(down) || 0;
  const loanAmount = p * (1 - d / 100);
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseInt(years) || 0) * 12;

  const payment = r > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmount / n;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <CurrencySelector value={format} onChange={setFormat} />
      <ToolCard title="Mortgage Calculator" icon={Building2} iconColor="bg-blue-600">
        <div className="space-y-4">
          <InputField label="Home Price" value={price} onChange={setPrice} type="number" suffix={symbol} />
          <InputField label="Down Payment (%)" value={down} onChange={setDown} type="number" suffix="%" />
          <InputField label="Interest Rate" value={rate} onChange={setRate} type="number" suffix="%" step={0.1} />
          <InputField label="Loan Term" value={years} onChange={setYears} type="number" suffix="years" />
        </div>
      </ToolCard>

      <ToolCard title="Monthly Payment" icon={Banknote} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Loan Amount" value={`${symbol}${loanAmount.toLocaleString()}`} />
          <ResultDisplay label="Monthly Payment" value={`${symbol}${payment.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} highlight color="text-emerald-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function ProfitLossCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [cp, setCp] = useState("100");
  const [sp, setSp] = useState("120");

  const symbol = format === "IN" ? "₹" : "$";
  const cost = parseFloat(cp) || 0;
  const sell = parseFloat(sp) || 0;
  const profit = sell - cost;
  const percent = cost > 0 ? (profit / cost) * 100 : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <CurrencySelector value={format} onChange={setFormat} />
      <ToolCard title="Profit & Loss" icon={TrendingUp} iconColor="bg-emerald-500">
        <div className="space-y-4">
          <InputField label="Cost Price" value={cp} onChange={setCp} type="number" suffix={symbol} />
          <InputField label="Selling Price" value={sp} onChange={setSp} type="number" suffix={symbol} />
        </div>
      </ToolCard>

      <ToolCard title="Analysis" icon={Calculator} iconColor="bg-blue-500">
        <div className="space-y-3">
          <ResultDisplay label={profit >= 0 ? "Profit" : "Loss"} value={`${symbol}${Math.abs(profit).toLocaleString()}`} color={profit >= 0 ? "text-emerald-400" : "text-red-400"} />
          <ResultDisplay label="Percentage" value={`${percent.toFixed(2)}%`} highlight color={profit >= 0 ? "text-emerald-400" : "text-red-400"} />
        </div>
      </ToolCard>
    </div>
  );
}

function MarkupCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [cost, setCost] = useState("100");
  const [markup, setMarkup] = useState("25");

  const symbol = format === "IN" ? "₹" : "$";
  const c = parseFloat(cost) || 0;
  const m = parseFloat(markup) || 0;
  const sell = c * (1 + m / 100);
  const profit = sell - c;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <CurrencySelector value={format} onChange={setFormat} />
      <ToolCard title="Markup Calculator" icon={Tag} iconColor="bg-orange-500">
        <div className="space-y-4">
          <InputField label="Cost" value={cost} onChange={setCost} type="number" suffix={symbol} />
          <InputField label="Markup (%)" value={markup} onChange={setMarkup} type="number" suffix="%" />
        </div>
      </ToolCard>

      <ToolCard title="Pricing" icon={Banknote} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Selling Price" value={`${symbol}${sell.toLocaleString()}`} highlight color="text-emerald-400" />
          <ResultDisplay label="Gross Profit" value={`${symbol}${profit.toLocaleString()}`} />
        </div>
      </ToolCard>
    </div>
  );
}

function MarginCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [cost, setCost] = useState("100");
  const [margin, setMargin] = useState("20");

  const symbol = format === "IN" ? "₹" : "$";
  const c = parseFloat(cost) || 0;
  const m = parseFloat(margin) || 0;
  const sell = m < 100 ? c / (1 - m / 100) : 0;
  const profit = sell - c;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <CurrencySelector value={format} onChange={setFormat} />
      <ToolCard title="Margin Calculator" icon={Percent} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <InputField label="Cost" value={cost} onChange={setCost} type="number" suffix={symbol} />
          <InputField label="Gross Margin (%)" value={margin} onChange={setMargin} type="number" suffix="%" />
        </div>
      </ToolCard>

      <ToolCard title="Pricing" icon={Banknote} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Selling Price" value={`${symbol}${sell.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} highlight color="text-emerald-400" />
          <ResultDisplay label="Gross Profit" value={`${symbol}${profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
        </div>
      </ToolCard>
    </div>
  );
}