import { useState, createContext, useContext } from "react";
import { motion } from "framer-motion";
import { Banknote, Percent, TrendingUp, Receipt, PiggyBank, CreditCard, Building2, BadgePercent, LineChart, Coins, Calculator, TrendingDown, Tag } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "emi" | "compound" | "tip" | "roi" | "gst" | "sip" | "salary" | "discount" | "currency" | "mortgage" | "profit" | "markup" | "margin" | "inflation";

type NumberFormat = "US" | "IN";
const FormatContext = createContext<{ format: NumberFormat; setFormat: (f: NumberFormat) => void }>({ format: "US", setFormat: () => {} });

function formatMoney(num: number, format: NumberFormat): string {
  const symbol = format === "IN" ? "₹" : "$";
  return symbol + num.toLocaleString(format === "IN" ? "en-IN" : "en-US", { maximumFractionDigits: 0 });
}

export default function FinanceTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("emi");
  const [format, setFormat] = useState<NumberFormat>("US");

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
    <FormatContext.Provider value={{ format, setFormat }}>
      <PageWrapper
        title="Finance Tools"
        subtitle="Calculate loans, interest, tips and more"
        accentColor="bg-emerald-500"
        tools={tools}
        activeTool={activeTool}
        onToolChange={(id) => setActiveTool(id as ToolType)}
      >
        <div className="mb-4 max-w-lg mx-auto">
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-xl">
            <span className="text-sm text-muted-foreground px-2">Format:</span>
            <button
              onClick={() => setFormat("US")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${format === "US" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              data-testid="button-format-us"
            >
              USA ($)
            </button>
            <button
              onClick={() => setFormat("IN")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${format === "IN" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              data-testid="button-format-in"
            >
              Indian (₹)
            </button>
          </div>
        </div>
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
    </FormatContext.Provider>
  );
}

function InflationCalculator() {
  const { format } = useContext(FormatContext);
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
          <InputField label={mode === "add" ? "Amount (excl. GST)" : "Amount (incl. GST)"} value={amount} onChange={setAmount} type="number" suffix="$" />
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

function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");

  const exchangeRates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.12,
    JPY: 149.50,
    CAD: 1.36,
    AUD: 1.53,
    CHF: 0.88,
    CNY: 7.24,
    SGD: 1.34,
  };

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  ];

  const convertedAmount = (parseFloat(amount) || 0) / exchangeRates[fromCurrency] * exchangeRates[toCurrency];
  const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
  const toCurrencyData = currencies.find(c => c.code === toCurrency);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Currency Converter" icon={Coins} iconColor="bg-green-500">
        <div className="space-y-4">
          <InputField label="Amount" value={amount} onChange={setAmount} type="number" />
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">From Currency</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              data-testid="select-from-currency"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">To Currency</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              data-testid="select-to-currency"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Converted Amount" icon={Banknote} iconColor="bg-emerald-500">
        <div className="text-center py-6">
          <div className="text-4xl font-bold text-green-400 mb-2">
            {toCurrencyData?.symbol}{convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-muted-foreground">
            {fromCurrencyData?.symbol}{parseFloat(amount).toLocaleString()} {fromCurrency} = {toCurrencyData?.symbol}{convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
          </p>
          <div className="mt-4 p-3 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground">
              Exchange Rate: 1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} {toCurrency}
            </p>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}

function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState("300000");
  const [downPayment, setDownPayment] = useState("60000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");

  const price = parseFloat(homePrice) || 0;
  const down = parseFloat(downPayment) || 0;
  const principal = price - down;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseInt(years) || 0) * 12;
  
  const monthlyPayment = r > 0 && n > 0 
    ? (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    : 0;
  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - principal;
  const downPaymentPercent = price > 0 ? (down / price) * 100 : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Mortgage Calculator" icon={Building2} iconColor="bg-blue-500">
        <div className="space-y-4">
          <InputField label="Home Price" value={homePrice} onChange={setHomePrice} type="number" suffix="$" />
          <InputField label="Down Payment" value={downPayment} onChange={setDownPayment} type="number" suffix="$" />
          <InputField label="Interest Rate (Annual)" value={rate} onChange={setRate} type="number" suffix="%" step={0.1} />
          <InputField label="Loan Term" value={years} onChange={setYears} type="number" suffix="years" />
        </div>
      </ToolCard>

      <ToolCard title="Monthly Payment" icon={Banknote} iconColor="bg-emerald-500">
        <div className="text-center py-4 mb-4">
          <div className="text-4xl font-bold text-blue-400">${monthlyPayment.toFixed(2)}</div>
          <p className="text-muted-foreground text-sm">per month</p>
        </div>
        <div className="space-y-3">
          <ResultDisplay label="Loan Amount" value={`$${principal.toLocaleString()}`} />
          <ResultDisplay label="Down Payment" value={`$${down.toLocaleString()} (${downPaymentPercent.toFixed(1)}%)`} />
          <ResultDisplay label="Total Interest" value={`$${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="text-orange-400" />
          <ResultDisplay label="Total Payment" value={`$${totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} highlight color="text-emerald-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function ProfitLossCalculator() {
  const { format } = useContext(FormatContext);
  const [costPrice, setCostPrice] = useState("1000");
  const [sellingPrice, setSellingPrice] = useState("1200");
  const [result, setResult] = useState<{ diff: number; percent: number; isProfit: boolean } | null>(null);

  const calculate = () => {
    const cp = parseFloat(costPrice) || 0;
    const sp = parseFloat(sellingPrice) || 0;
    if (cp > 0) {
      const diff = sp - cp;
      const percent = (Math.abs(diff) / cp) * 100;
      setResult({ diff, percent, isProfit: diff >= 0 });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Profit & Loss Calculator" icon={TrendingDown} iconColor="bg-purple-500">
        <div className="space-y-4">
          <InputField label="Cost Price" value={costPrice} onChange={setCostPrice} type="number" suffix={format === "IN" ? "₹" : "$"} />
          <InputField label="Selling Price" value={sellingPrice} onChange={setSellingPrice} type="number" suffix={format === "IN" ? "₹" : "$"} />
          <ToolButton onClick={calculate} testId="button-calculate-profit">Calculate</ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Result" icon={result.isProfit ? TrendingUp : TrendingDown} iconColor={result.isProfit ? "bg-emerald-500" : "bg-red-500"}>
            <div className="text-center py-4">
              <div className={`text-3xl font-bold ${result.isProfit ? "text-emerald-400" : "text-red-400"}`}>
                {result.isProfit ? "Profit" : "Loss"}: {formatMoney(Math.abs(result.diff), format)}
              </div>
              <div className="text-xl mt-2 text-muted-foreground">
                ({result.percent.toFixed(2)}%)
              </div>
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function MarkupCalculator() {
  const { format } = useContext(FormatContext);
  const [costPrice, setCostPrice] = useState("1000");
  const [markupPercent, setMarkupPercent] = useState("25");
  const [result, setResult] = useState<{ markup: number; sellingPrice: number } | null>(null);

  const calculate = () => {
    const cp = parseFloat(costPrice) || 0;
    const per = parseFloat(markupPercent) || 0;
    if (cp > 0) {
      const markup = cp * per / 100;
      const sp = cp + markup;
      setResult({ markup, sellingPrice: sp });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Markup Calculator" icon={Tag} iconColor="bg-orange-500">
        <div className="space-y-4">
          <InputField label="Cost Price" value={costPrice} onChange={setCostPrice} type="number" suffix={format === "IN" ? "₹" : "$"} />
          <InputField label="Markup Percentage" value={markupPercent} onChange={setMarkupPercent} type="number" suffix="%" />
          <ToolButton onClick={calculate} testId="button-calculate-markup">Calculate</ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Result" icon={Banknote} iconColor="bg-emerald-500">
            <div className="space-y-3">
              <ResultDisplay label="Markup Amount" value={formatMoney(result.markup, format)} color="text-orange-400" />
              <ResultDisplay label="Selling Price" value={formatMoney(result.sellingPrice, format)} highlight color="text-emerald-400" />
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function MarginCalculator() {
  const { format } = useContext(FormatContext);
  const [costPrice, setCostPrice] = useState("800");
  const [sellingPrice, setSellingPrice] = useState("1000");
  const [result, setResult] = useState<{ margin: number; profit: number } | null>(null);

  const calculate = () => {
    const cp = parseFloat(costPrice) || 0;
    const sp = parseFloat(sellingPrice) || 0;
    if (sp > 0) {
      const profit = sp - cp;
      const margin = (profit / sp) * 100;
      setResult({ margin, profit });
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Margin Calculator" icon={Percent} iconColor="bg-cyan-500">
        <div className="space-y-4">
          <InputField label="Cost Price" value={costPrice} onChange={setCostPrice} type="number" suffix={format === "IN" ? "₹" : "$"} />
          <InputField label="Selling Price" value={sellingPrice} onChange={setSellingPrice} type="number" suffix={format === "IN" ? "₹" : "$"} />
          <ToolButton onClick={calculate} testId="button-calculate-margin">Calculate</ToolButton>
        </div>
      </ToolCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="Result" icon={TrendingUp} iconColor="bg-emerald-500">
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-cyan-400">
                {result.margin.toFixed(2)}%
              </div>
              <div className="text-lg mt-2 text-muted-foreground">
                Profit Margin
              </div>
              <div className="mt-4 p-3 bg-muted/30 rounded-xl">
                <span className="text-muted-foreground">Profit: </span>
                <span className={result.profit >= 0 ? "text-emerald-400 font-medium" : "text-red-400 font-medium"}>
                  {formatMoney(result.profit, format)}
                </span>
              </div>
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}
