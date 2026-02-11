import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Banknote, Percent, TrendingUp, Receipt, PiggyBank, CreditCard, 
  Building2, BadgePercent, LineChart, Coins, Calculator, TrendingDown, Tag 
} from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "emi" | "compound" | "tip" | "roi" | "gst" | "sip" | "salary" | "discount" | "currency" | "mortgage" | "profit" | "markup" | "margin" | "inflation" | "stock";

type NumberFormat = "US" | "IN";

function CurrencySelector({ value, onChange }: { value: NumberFormat; onChange: (v: NumberFormat) => void }) {
  return null;
}

function InputFieldWithCurrency({ label, value, onChange, currency, onCurrencyChange, step }: { label: string; value: string; onChange: (v: string) => void; currency: NumberFormat; onCurrencyChange: (v: NumberFormat) => void; step?: number }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground block">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            step={step}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value as NumberFormat)}
          className="bg-muted/50 border border-border rounded-xl px-3 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer w-24"
        >
          <option value="US">$ USD</option>
          <option value="IN">₹ INR</option>
        </select>
      </div>
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
    { id: "stock", label: "Stock P/L", icon: LineChart },
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
      {activeTool === "stock" && <StockCalculator />}
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
      <ToolCard title="Loan EMI Calculator" icon={CreditCard} iconColor="bg-emerald-500">
        <div className="space-y-4">
          <InputFieldWithCurrency 
            label="Loan Amount" 
            value={principal} 
            onChange={setPrincipal} 
            currency={format} 
            onCurrencyChange={setFormat} 
          />
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
      <ToolCard title="Compound Interest" icon={TrendingUp} iconColor="bg-blue-500">
        <div className="space-y-4">
          <InputFieldWithCurrency 
            label="Principal Amount" 
            value={principal} 
            onChange={setPrincipal} 
            currency={format} 
            onCurrencyChange={setFormat} 
          />
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
      <ToolCard title="ROI Calculator" icon={PiggyBank} iconColor="bg-purple-500">
        <div className="space-y-4">
          <InputFieldWithCurrency 
            label="Initial Investment" 
            value={investment} 
            onChange={setInvestment} 
            currency={format} 
            onCurrencyChange={setFormat} 
          />
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
  const [mode, setMode] = useState<"sip" | "lumpsum">("sip");

  const symbol = format === "IN" ? "₹" : "$";
  const m = parseFloat(monthly) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseInt(years) || 0) * 12;
  const invested = mode === "sip" ? m * n : m;
  
  const futureValue = mode === "sip" 
    ? (r > 0 ? m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : invested)
    : m * Math.pow(1 + (r * 12), parseInt(years) || 0);
    
  const returns = futureValue - invested;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="SIP / Lumpsum Calculator" icon={LineChart} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setMode("sip")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === "sip" ? "bg-indigo-500 text-white" : "bg-muted text-muted-foreground"}`}
            >
              SIP
            </button>
            <button
              onClick={() => setMode("lumpsum")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === "lumpsum" ? "bg-indigo-500 text-white" : "bg-muted text-muted-foreground"}`}
            >
              Lumpsum
            </button>
          </div>
          <InputFieldWithCurrency 
            label={mode === "sip" ? "Monthly Investment" : "One-time Investment"} 
            value={monthly} 
            onChange={setMonthly} 
            currency={format} 
            onCurrencyChange={setFormat} 
          />
          <InputField label="Expected Return (Annual)" value={rate} onChange={setRate} type="number" suffix="%" />
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
          <InputFieldWithCurrency 
            label={mode === "add" ? "Amount (excl. GST)" : "Amount (incl. GST)"} 
            value={amount} 
            onChange={setAmount} 
            currency={format} 
            onCurrencyChange={setFormat} 
          />
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
          <ResultDisplay label="Base Amount" value={`${symbol}${ (mode === "add" ? base : total).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
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
      <ToolCard title="Salary Converter" icon={Coins} iconColor="bg-amber-500">
        <div className="space-y-4">
          <InputFieldWithCurrency 
            label="Hourly Rate" 
            value={hourly} 
            onChange={setHourly} 
            currency={format} 
            onCurrencyChange={setFormat} 
          />
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
      <ToolCard title="Stacked Discount Calculator" icon={BadgePercent} iconColor="bg-rose-500">
        <div className="space-y-4">
          <InputFieldWithCurrency 
            label="Original Price" 
            value={originalPrice} 
            onChange={setOriginalPrice} 
            currency={format} 
            onCurrencyChange={setFormat} 
          />
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

          <InputFieldWithCurrency 
            label={mode === "historical" ? `Amount in ${year}` : "Current Amount"} 
            value={amount} 
            onChange={setAmount} 
            currency={format} 
            onCurrencyChange={setFormat} 
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
      <ToolCard title="Mortgage Calculator" icon={Building2} iconColor="bg-blue-600">
        <div className="space-y-4">
          <InputFieldWithCurrency 
            label="Home Price" 
            value={price} 
            onChange={setPrice} 
            currency={format} 
            onCurrencyChange={setFormat} 
          />
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
      <ToolCard title="Profit & Loss" icon={TrendingUp} iconColor="bg-emerald-500">
        <div className="space-y-4">
          <InputFieldWithCurrency 
            label="Cost Price" 
            value={cp} 
            onChange={setCp} 
            currency={format} 
            onCurrencyChange={setFormat} 
          />
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
      <ToolCard title="Markup Calculator" icon={Tag} iconColor="bg-orange-500">
        <div className="space-y-4">
          <InputFieldWithCurrency 
            label="Cost" 
            value={cost} 
            onChange={setCost} 
            currency={format} 
            onCurrencyChange={setFormat} 
          />
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
  const [mode, setMode] = useState<"margin" | "markup">("margin");

  const symbol = format === "IN" ? "₹" : "$";
  const c = parseFloat(cost) || 0;
  const m = parseFloat(margin) || 0;
  
  let sell = 0;
  let profit = 0;
  let other = 0;

  if (mode === "margin") {
    sell = m < 100 ? c / (1 - m / 100) : 0;
    profit = sell - c;
    other = c > 0 ? (profit / c) * 100 : 0;
  } else {
    sell = c * (1 + m / 100);
    profit = sell - c;
    other = sell > 0 ? (profit / sell) * 100 : 0;
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Margin / Markup Calculator" icon={Percent} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setMode("margin")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === "margin" ? "bg-indigo-500 text-white" : "bg-muted text-muted-foreground"}`}
            >
              Margin
            </button>
            <button
              onClick={() => setMode("markup")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === "markup" ? "bg-indigo-500 text-white" : "bg-muted text-muted-foreground"}`}
            >
              Markup
            </button>
          </div>
          <InputFieldWithCurrency 
            label="Cost" 
            value={cost} 
            onChange={setCost} 
            currency={format} 
            onCurrencyChange={setFormat} 
          />
          <InputField label={mode === "margin" ? "Gross Margin (%)" : "Markup (%)"} value={margin} onChange={setMargin} type="number" suffix="%" />
        </div>
      </ToolCard>

      <ToolCard title="Pricing" icon={Banknote} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Selling Price" value={`${symbol}${sell.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} highlight color="text-emerald-400" />
          <ResultDisplay label="Gross Profit" value={`${symbol}${profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
          <ResultDisplay label={mode === "margin" ? "Markup" : "Margin"} value={`${other.toFixed(2)}%`} />
        </div>
      </ToolCard>
    </div>
  );
}

function StockCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [mode, setMode] = useState<"profit-loss" | "breakeven" | "avg-cost">("profit-loss");
  const [buyPrice, setBuyPrice] = useState("150");
  const [sellPrice, setSellPrice] = useState("180");
  const [shares, setShares] = useState("100");
  const [buyCommission, setBuyCommission] = useState("0");
  const [sellCommission, setSellCommission] = useState("0");
  const [sttRate, setSttRate] = useState("0.025");
  const [targetProfit, setTargetProfit] = useState("5000");
  const [buy1Price, setBuy1Price] = useState("100");
  const [buy1Qty, setBuy1Qty] = useState("50");
  const [buy2Price, setBuy2Price] = useState("120");
  const [buy2Qty, setBuy2Qty] = useState("30");
  const [buy3Price, setBuy3Price] = useState("90");
  const [buy3Qty, setBuy3Qty] = useState("20");

  const symbol = format === "US" ? "$" : "\u20B9";
  const fmt = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return "\u2014";
    return format === "US"
      ? n.toLocaleString("en-US", { maximumFractionDigits: 2 })
      : n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  };

  const modes = [
    { id: "profit-loss", label: "Profit/Loss" },
    { id: "breakeven", label: "Break-even" },
    { id: "avg-cost", label: "Avg Cost" },
  ];

  const renderResult = () => {
    switch (mode) {
      case "profit-loss": {
        const bp = parseFloat(buyPrice) || 0;
        const sp = parseFloat(sellPrice) || 0;
        const qty = parseFloat(shares) || 0;
        const bComm = parseFloat(buyCommission) || 0;
        const sComm = parseFloat(sellCommission) || 0;
        const stt = parseFloat(sttRate) || 0;

        const totalBuy = bp * qty;
        const totalSell = sp * qty;
        const buyFees = bComm;
        const sellFees = sComm;
        const sttAmount = (totalSell * stt) / 100;
        const totalCost = totalBuy + buyFees + sellFees + sttAmount;
        const grossPL = totalSell - totalBuy;
        const netPL = totalSell - totalCost;
        const returnPct = totalBuy > 0 ? (netPL / totalBuy) * 100 : 0;
        const isProfit = netPL >= 0;

        return (
          <div className="mt-4 space-y-3">
            <div className="bg-muted/20 p-3 rounded-xl border border-border/50 space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Step-by-step</p>
              <p className="text-xs text-foreground"><span className="font-bold text-emerald-500 mr-1">Step 1:</span> Buy: {fmt(qty)} shares \u00D7 {symbol}{fmt(bp)} = {symbol}{fmt(totalBuy)}</p>
              <p className="text-xs text-foreground"><span className="font-bold text-emerald-500 mr-1">Step 2:</span> Sell: {fmt(qty)} shares \u00D7 {symbol}{fmt(sp)} = {symbol}{fmt(totalSell)}</p>
              <p className="text-xs text-foreground"><span className="font-bold text-emerald-500 mr-1">Step 3:</span> Fees: Buy {symbol}{fmt(buyFees)} + Sell {symbol}{fmt(sellFees)} + STT {symbol}{fmt(sttAmount)} = {symbol}{fmt(buyFees + sellFees + sttAmount)}</p>
              <p className="text-xs text-foreground"><span className="font-bold text-emerald-500 mr-1">Step 4:</span> Net P/L = {symbol}{fmt(totalSell)} - {symbol}{fmt(totalCost)} = {symbol}{fmt(netPL)}</p>
              <p className="text-xs text-foreground"><span className="font-bold text-emerald-500 mr-1">Step 5:</span> Return = {fmt(netPL)} / {fmt(totalBuy)} \u00D7 100 = {fmt(returnPct)}%</p>
            </div>
            <div className="space-y-2">
              {[
                { label: "Total Investment", value: `${symbol}${fmt(totalBuy)}` },
                { label: "Total Sale Value", value: `${symbol}${fmt(totalSell)}` },
                { label: "Gross P/L", value: `${symbol}${fmt(grossPL)}` },
                { label: "Total Charges", value: `${symbol}${fmt(buyFees + sellFees + sttAmount)}` },
                { label: "Net Profit/Loss", value: `${isProfit ? "+" : ""}${symbol}${fmt(netPL)}` },
                { label: "Return %", value: `${isProfit ? "+" : ""}${fmt(returnPct)}%` },
                { label: "P/L per Share", value: `${symbol}${fmt(netPL / qty)}` },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 bg-muted/30 rounded-xl">
                  <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                  <span className={`text-sm font-bold ${i >= 4 ? (isProfit ? "text-emerald-500" : "text-red-500") : "text-foreground"}`} data-testid={`result-${i}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "breakeven": {
        const bp = parseFloat(buyPrice) || 0;
        const qty = parseFloat(shares) || 0;
        const bComm = parseFloat(buyCommission) || 0;
        const sComm = parseFloat(sellCommission) || 0;
        const stt = parseFloat(sttRate) || 0;
        const tp = parseFloat(targetProfit) || 0;

        const totalBuy = bp * qty;
        const totalFees = bComm + sComm;
        const bePrice = qty > 0 ? (totalBuy + totalFees) / (qty * (1 - stt / 100)) : 0;
        const targetSellPrice = qty > 0 ? (totalBuy + totalFees + tp) / (qty * (1 - stt / 100)) : 0;
        const targetPct = bp > 0 ? ((targetSellPrice - bp) / bp) * 100 : 0;

        return (
          <div className="mt-4 space-y-3">
            <div className="bg-muted/20 p-3 rounded-xl border border-border/50 space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Step-by-step</p>
              <p className="text-xs text-foreground"><span className="font-bold text-emerald-500 mr-1">Step 1:</span> Total buy cost = {symbol}{fmt(totalBuy)} + {symbol}{fmt(totalFees)} fees = {symbol}{fmt(totalBuy + totalFees)}</p>
              <p className="text-xs text-foreground"><span className="font-bold text-emerald-500 mr-1">Step 2:</span> Break-even price = {symbol}{fmt(totalBuy + totalFees)} / ({fmt(qty)} \u00D7 (1 - {stt}%)) = {symbol}{fmt(bePrice)}</p>
              <p className="text-xs text-foreground"><span className="font-bold text-emerald-500 mr-1">Step 3:</span> For {symbol}{fmt(tp)} profit, sell at {symbol}{fmt(targetSellPrice)} ({fmt(targetPct)}% gain)</p>
            </div>
            <div className="space-y-2">
              {[
                { label: "Buy Price", value: `${symbol}${fmt(bp)}` },
                { label: "Break-even Price", value: `${symbol}${fmt(bePrice)}` },
                { label: "Price Difference", value: `${symbol}${fmt(bePrice - bp)}` },
                { label: `Target (${symbol}${fmt(tp)} profit)`, value: `${symbol}${fmt(targetSellPrice)}` },
                { label: "Gain Needed", value: `${fmt(targetPct)}%` },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 bg-muted/30 rounded-xl">
                  <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                  <span className="text-sm font-bold text-emerald-500" data-testid={`result-${i}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "avg-cost": {
        const lots = [
          { price: parseFloat(buy1Price) || 0, qty: parseFloat(buy1Qty) || 0 },
          { price: parseFloat(buy2Price) || 0, qty: parseFloat(buy2Qty) || 0 },
          { price: parseFloat(buy3Price) || 0, qty: parseFloat(buy3Qty) || 0 },
        ].filter(l => l.price > 0 && l.qty > 0);

        const totalQty = lots.reduce((s, l) => s + l.qty, 0);
        const totalCost = lots.reduce((s, l) => s + l.price * l.qty, 0);
        const avgCost = totalQty > 0 ? totalCost / totalQty : 0;
        const sp = parseFloat(sellPrice) || 0;
        const currentValue = sp * totalQty;
        const unrealizedPL = currentValue - totalCost;
        const returnPct = totalCost > 0 ? (unrealizedPL / totalCost) * 100 : 0;

        return (
          <div className="mt-4 space-y-3">
            <div className="bg-muted/20 p-3 rounded-xl border border-border/50 space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Step-by-step</p>
              {lots.map((l, i) => (
                <p key={i} className="text-xs text-foreground"><span className="font-bold text-emerald-500 mr-1">Lot {i + 1}:</span> {fmt(l.qty)} shares \u00D7 {symbol}{fmt(l.price)} = {symbol}{fmt(l.price * l.qty)}</p>
              ))}
              <p className="text-xs text-foreground"><span className="font-bold text-emerald-500 mr-1">Total:</span> {fmt(totalQty)} shares, {symbol}{fmt(totalCost)} invested</p>
              <p className="text-xs text-foreground"><span className="font-bold text-emerald-500 mr-1">Avg:</span> {symbol}{fmt(totalCost)} / {fmt(totalQty)} = {symbol}{fmt(avgCost)} per share</p>
            </div>
            <div className="space-y-2">
              {[
                { label: "Average Cost/Share", value: `${symbol}${fmt(avgCost)}` },
                { label: "Total Shares", value: fmt(totalQty) },
                { label: "Total Invested", value: `${symbol}${fmt(totalCost)}` },
                { label: `Current Value (at ${symbol}${fmt(sp)})`, value: `${symbol}${fmt(currentValue)}` },
                { label: "Unrealized P/L", value: `${unrealizedPL >= 0 ? "+" : ""}${symbol}${fmt(unrealizedPL)}` },
                { label: "Return", value: `${unrealizedPL >= 0 ? "+" : ""}${fmt(returnPct)}%` },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 bg-muted/30 rounded-xl">
                  <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                  <span className={`text-sm font-bold ${i >= 4 ? (unrealizedPL >= 0 ? "text-emerald-500" : "text-red-500") : "text-foreground"}`} data-testid={`result-${i}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Stock Profit/Loss & Break-even" icon={LineChart} iconColor="bg-emerald-500">
        <div className="flex gap-2 p-1 bg-muted rounded-xl mb-4 flex-wrap">
          {modes.map((m) => (
            <button key={m.id} onClick={() => setMode(m.id as typeof mode)} data-testid={`mode-${m.id}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${mode === m.id ? "bg-emerald-500 text-white shadow-sm" : "text-muted-foreground"}`}>
              {m.label}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {mode === "profit-loss" && (
            <>
              <InputFieldWithCurrency 
                label="Buy Price" 
                value={buyPrice} 
                onChange={setBuyPrice} 
                currency={format} 
                onCurrencyChange={setFormat} 
              />
              <InputField label="Sell Price" value={sellPrice} onChange={setSellPrice} type="number" suffix={symbol} />
              <InputField label="Number of Shares" value={shares} onChange={setShares} type="number" />
              <InputField label="Buy Commission" value={buyCommission} onChange={setBuyCommission} type="number" suffix={symbol} />
              <InputField label="Sell Commission" value={sellCommission} onChange={setSellCommission} type="number" suffix={symbol} />
              <InputField label="STT / Tax Rate (%)" value={sttRate} onChange={setSttRate} type="number" suffix="%" />
            </>
          )}
          {mode === "breakeven" && (
            <>
              <InputFieldWithCurrency 
                label="Buy Price" 
                value={buyPrice} 
                onChange={setBuyPrice} 
                currency={format} 
                onCurrencyChange={setFormat} 
              />
              <InputField label="Number of Shares" value={shares} onChange={setShares} type="number" />
              <InputField label="Buy Commission" value={buyCommission} onChange={setBuyCommission} type="number" suffix={symbol} />
              <InputField label="Sell Commission" value={sellCommission} onChange={setSellCommission} type="number" suffix={symbol} />
              <InputField label="STT / Tax Rate (%)" value={sttRate} onChange={setSttRate} type="number" suffix="%" />
              <InputField label="Target Profit" value={targetProfit} onChange={setTargetProfit} type="number" suffix={symbol} />
            </>
          )}
          {mode === "avg-cost" && (
            <>
              <p className="text-xs font-bold text-muted-foreground uppercase">Buy Lot 1</p>
              <InputFieldWithCurrency 
                label="Price" 
                value={buy1Price} 
                onChange={setBuy1Price} 
                currency={format} 
                onCurrencyChange={setFormat} 
              />
              <InputField label="Quantity" value={buy1Qty} onChange={setBuy1Qty} type="number" />
              <p className="text-xs font-bold text-muted-foreground uppercase mt-2">Buy Lot 2</p>
              <InputField label="Price" value={buy2Price} onChange={setBuy2Price} type="number" suffix={symbol} />
              <InputField label="Quantity" value={buy2Qty} onChange={setBuy2Qty} type="number" />
              <p className="text-xs font-bold text-muted-foreground uppercase mt-2">Buy Lot 3</p>
              <InputField label="Price" value={buy3Price} onChange={setBuy3Price} type="number" suffix={symbol} />
              <InputField label="Quantity" value={buy3Qty} onChange={setBuy3Qty} type="number" />
              <InputField label="Current/Sell Price" value={sellPrice} onChange={setSellPrice} type="number" suffix={symbol} />
            </>
          )}
        </div>
        {renderResult()}
      </ToolCard>
    </div>
  );
}