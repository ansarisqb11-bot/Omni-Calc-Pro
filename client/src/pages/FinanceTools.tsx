import { useState } from "react";
import {
  Banknote, Percent, TrendingUp, Receipt, PiggyBank, CreditCard,
  Building2, BadgePercent, LineChart, Coins, Calculator, TrendingDown, Tag, BarChart2
} from "lucide-react";
import { DesktopToolGrid, InputPanel, ResultPanel, SummaryCard, BreakdownRow, InputField, ModeSelector } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "emi" | "compound" | "tip" | "roi" | "gst" | "sip" | "salary" | "discount" | "currency" | "mortgage" | "profit" | "markup" | "margin" | "inflation" | "stock";
type NumberFormat = "US" | "IN";

const fmt = (n: number, d = 2) => (isFinite(n) && !isNaN(n) ? parseFloat(n.toFixed(d)).toLocaleString() : "—");

function CurrencyInput({ label, value, onChange, format, onFormatChange }: { label: string; value: string; onChange: (v: string) => void; format: NumberFormat; onFormatChange: (v: NumberFormat) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block">{label}</label>
      <div className="flex gap-2">
        <input type="number" value={value} onChange={e => onChange(e.target.value)}
          className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <select value={format} onChange={e => onFormatChange(e.target.value as NumberFormat)}
          className="bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-foreground w-24 focus:outline-none cursor-pointer">
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
    { id: "stock", label: "Stock P/L", icon: BarChart2 },
  ];
  return (
    <PageWrapper title="Finance Tools" subtitle="Calculate loans, interest, tips and more" accentColor="bg-emerald-500" tools={tools} activeTool={activeTool} onToolChange={id => setActiveTool(id as ToolType)}>
      {activeTool === "emi" && <LoanEMI />}
      {activeTool === "compound" && <CompoundInterest />}
      {activeTool === "sip" && <SIPCalculator />}
      {activeTool === "gst" && <GSTCalculator />}
      {activeTool === "tip" && <TipCalculator />}
      {activeTool === "roi" && <ROICalculator />}
      {activeTool === "salary" && <SalaryConverter />}
      {activeTool === "discount" && <DiscountCalculator />}
      {activeTool === "currency" && <CurrencyConverter />}
      {activeTool === "mortgage" && <MortgageCalculator />}
      {activeTool === "profit" && <ProfitLoss />}
      {activeTool === "markup" && <MarkupCalculator />}
      {activeTool === "margin" && <MarginCalculator />}
      {activeTool === "inflation" && <InflationCalculator />}
      {activeTool === "stock" && <StockCalculator />}
    </PageWrapper>
  );
}

function LoanEMI() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("8.5");
  const [tenure, setTenure] = useState("12");

  const sym = format === "IN" ? "₹" : "$";
  const p = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 12 / 100;
  const n = parseInt(tenure) || 0;
  const emi = n > 0 && r > 0 ? (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const total = emi * n;
  const interest = total - p;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Loan Details" icon={CreditCard} iconColor="bg-emerald-500">
          <CurrencyInput label="Loan Amount" value={principal} onChange={setPrincipal} format={format} onFormatChange={setFormat} />
          <InputField label="Interest Rate (Annual %)" value={rate} onChange={setRate} type="number" suffix="%" />
          <InputField label="Loan Tenure (Months)" value={tenure} onChange={setTenure} type="number" suffix="mo" />
        </InputPanel>
      }
      results={
        <ResultPanel label="Monthly EMI" primary={`${sym}${fmt(emi, 0)}`}
          summaries={<>
            <SummaryCard label="Total Interest" value={`${sym}${fmt(interest, 0)}`} accent="text-orange-500" />
            <SummaryCard label="Total Payment" value={`${sym}${fmt(total, 0)}`} />
          </>}
          tip={`You pay ${sym}${fmt(interest, 0)} in interest over ${n} months — ${fmt(interest / p * 100, 1)}% of principal.`}
        >
          <BreakdownRow label="Principal" value={`${sym}${fmt(p, 0)}`} dot="bg-blue-400" />
          <BreakdownRow label="Interest Rate" value={`${rate}% p.a.`} dot="bg-amber-400" />
          <BreakdownRow label="Tenure" value={`${n} months`} dot="bg-purple-400" />
          <BreakdownRow label="Monthly EMI" value={`${sym}${fmt(emi, 0)}`} dot="bg-green-500" bold />
          <BreakdownRow label="Total Interest" value={`${sym}${fmt(interest, 0)}`} dot="bg-orange-400" />
          <BreakdownRow label="Total Payment" value={`${sym}${fmt(total, 0)}`} dot="bg-emerald-400" bold />
        </ResultPanel>
      }
    />
  );
}

function CompoundInterest() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");
  const [freq, setFreq] = useState("12");

  const sym = format === "IN" ? "₹" : "$";
  const p = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  const t = parseInt(years) || 0;
  const n = parseInt(freq) || 1;
  const amount = p * Math.pow(1 + r / n, n * t);
  const interest = amount - p;
  const freqLabel: Record<string, string> = { "1": "Annually", "4": "Quarterly", "12": "Monthly", "365": "Daily" };

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Investment Details" icon={TrendingUp} iconColor="bg-blue-500">
          <CurrencyInput label="Principal Amount" value={principal} onChange={setPrincipal} format={format} onFormatChange={setFormat} />
          <InputField label="Annual Interest Rate" value={rate} onChange={setRate} type="number" suffix="%" />
          <InputField label="Time Period (Years)" value={years} onChange={setYears} type="number" suffix="yrs" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Compound Frequency</label>
            <div className="flex gap-1.5">
              {[["1", "Yearly"], ["4", "Quarterly"], ["12", "Monthly"], ["365", "Daily"]].map(([v, l]) => (
                <button key={v} onClick={() => setFreq(v)} className={`flex-1 py-2 rounded-xl text-xs font-bold ${freq === v ? "bg-blue-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{l}</button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Total Amount" primary={`${sym}${fmt(amount, 0)}`}
          summaries={<>
            <SummaryCard label="Interest Earned" value={`${sym}${fmt(interest, 0)}`} accent="text-blue-500" />
            <SummaryCard label="Return" value={`${fmt(interest / p * 100, 1)}%`} />
          </>}
          tip={`Compounding ${freqLabel[freq] || freq}x. Rule of 72: at ${rate}%, money doubles in ~${fmt(72 / (parseFloat(rate) || 1), 1)} years.`}
        >
          <BreakdownRow label="Principal" value={`${sym}${fmt(p, 0)}`} dot="bg-blue-400" />
          <BreakdownRow label="Rate" value={`${rate}% p.a.`} dot="bg-amber-400" />
          <BreakdownRow label="Period" value={`${years} years`} dot="bg-purple-400" />
          <BreakdownRow label="Compounding" value={freqLabel[freq] || `${freq}x/yr`} dot="bg-cyan-400" />
          <BreakdownRow label="Interest Earned" value={`${sym}${fmt(interest, 0)}`} dot="bg-orange-400" />
          <BreakdownRow label="Final Amount" value={`${sym}${fmt(amount, 0)}`} dot="bg-green-500" bold />
        </ResultPanel>
      }
    />
  );
}

function SIPCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");
  const [mode, setMode] = useState<"sip" | "lumpsum">("sip");

  const sym = format === "IN" ? "₹" : "$";
  const m = parseFloat(monthly) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseInt(years) || 0) * 12;
  const invested = mode === "sip" ? m * n : m;
  const futureValue = mode === "sip"
    ? (r > 0 ? m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : invested)
    : m * Math.pow(1 + (r * 12), parseInt(years) || 0);
  const returns = futureValue - invested;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Investment Plan" icon={LineChart} iconColor="bg-indigo-500">
          <ModeSelector modes={[{ id: "sip", label: "SIP (Monthly)" }, { id: "lumpsum", label: "Lumpsum" }]} active={mode} onChange={v => setMode(v as "sip" | "lumpsum")} />
          <CurrencyInput label={mode === "sip" ? "Monthly Investment" : "One-time Investment"} value={monthly} onChange={setMonthly} format={format} onFormatChange={setFormat} />
          <InputField label="Expected Annual Return" value={rate} onChange={setRate} type="number" suffix="%" />
          <InputField label="Time Period" value={years} onChange={setYears} type="number" suffix="yrs" />
        </InputPanel>
      }
      results={
        <ResultPanel label="Future Value" primary={`${sym}${fmt(futureValue, 0)}`}
          summaries={<>
            <SummaryCard label="Est. Returns" value={`${sym}${fmt(returns, 0)}`} accent="text-indigo-500" />
            <SummaryCard label="Return %" value={`${fmt(returns / invested * 100, 1)}%`} />
          </>}
          tip={`Your money grows ${fmt(futureValue / invested, 2)}× over ${years} years at ${rate}% annual return.`}
        >
          <BreakdownRow label="Investment Type" value={mode === "sip" ? "SIP" : "Lumpsum"} dot="bg-indigo-400" />
          <BreakdownRow label={mode === "sip" ? "Monthly Amount" : "One-time Amount"} value={`${sym}${fmt(m, 0)}`} dot="bg-blue-400" />
          <BreakdownRow label="Total Invested" value={`${sym}${fmt(invested, 0)}`} dot="bg-purple-400" />
          <BreakdownRow label="Estimated Returns" value={`${sym}${fmt(returns, 0)}`} dot="bg-amber-400" />
          <BreakdownRow label="Future Value" value={`${sym}${fmt(futureValue, 0)}`} dot="bg-green-500" bold />
        </ResultPanel>
      }
    />
  );
}

function GSTCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [amount, setAmount] = useState("1000");
  const [gstRate, setGstRate] = useState("18");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const sym = format === "IN" ? "₹" : "$";
  const base = parseFloat(amount) || 0;
  const rate = parseFloat(gstRate) || 0;
  const taxPart = mode === "add" ? base * (rate / 100) : base - (base * 100) / (100 + rate);
  const total = mode === "add" ? base + taxPart : (base * 100) / (100 + rate);
  const baseAmt = mode === "add" ? base : total;
  const totalAmt = mode === "add" ? base + taxPart : base;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Tax Details" icon={Building2} iconColor="bg-teal-500">
          <ModeSelector modes={[{ id: "add", label: "Add GST" }, { id: "remove", label: "Remove GST" }]} active={mode} onChange={v => setMode(v as "add" | "remove")} />
          <CurrencyInput label={mode === "add" ? "Amount (excl. GST)" : "Amount (incl. GST)"} value={amount} onChange={setAmount} format={format} onFormatChange={setFormat} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">GST Rate</label>
            <div className="flex gap-1.5">
              {[5, 12, 18, 28].map(r => (
                <button key={r} onClick={() => setGstRate(r.toString())} data-testid={`button-gst-rate-${r}`}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold ${gstRate === r.toString() ? "bg-teal-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>
                  {r}%
                </button>
              ))}
            </div>
          </div>
          <InputField label="Custom Rate" value={gstRate} onChange={setGstRate} type="number" suffix="%" />
        </InputPanel>
      }
      results={
        <ResultPanel label={mode === "add" ? "Total (incl. GST)" : "Base Amount"} primary={`${sym}${fmt(totalAmt, 0)}`}
          summaries={<>
            <SummaryCard label="GST Amount" value={`${sym}${fmt(taxPart, 0)}`} accent="text-teal-500" />
            <SummaryCard label="Rate Applied" value={`${gstRate}%`} />
          </>}
          tip={`GST rate: ${gstRate}%. ${mode === "add" ? "Adding" : "Extracting"} tax on ${sym}${fmt(base, 0)}.`}
        >
          <BreakdownRow label="Base Amount" value={`${sym}${fmt(baseAmt, 2)}`} dot="bg-blue-400" />
          <BreakdownRow label="GST Rate" value={`${gstRate}%`} dot="bg-amber-400" />
          <BreakdownRow label="GST Amount" value={`${sym}${fmt(taxPart, 2)}`} dot="bg-teal-400" />
          <BreakdownRow label="Total Amount" value={`${sym}${fmt(totalAmt, 2)}`} dot="bg-green-500" bold />
        </ResultPanel>
      }
    />
  );
}

function TipCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [bill, setBill] = useState("50");
  const [tipPercent, setTipPercent] = useState("15");
  const [people, setPeople] = useState("2");

  const sym = format === "IN" ? "₹" : "$";
  const b = parseFloat(bill) || 0;
  const tip = b * (parseFloat(tipPercent) || 0) / 100;
  const total = b + tip;
  const n = parseInt(people) || 1;
  const perPerson = total / n;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Bill Details" icon={Receipt} iconColor="bg-orange-500">
          <CurrencyInput label="Bill Amount" value={bill} onChange={setBill} format={format} onFormatChange={setFormat} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Tip %</label>
            <div className="flex gap-1.5 mb-2">
              {[10, 15, 18, 20, 25].map(t => (
                <button key={t} onClick={() => setTipPercent(t.toString())}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold ${tipPercent === t.toString() ? "bg-orange-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>
                  {t}%
                </button>
              ))}
            </div>
            <InputField label="" value={tipPercent} onChange={setTipPercent} type="number" suffix="%" />
          </div>
          <InputField label="Split Between" value={people} onChange={setPeople} type="number" min={1} />
        </InputPanel>
      }
      results={
        <ResultPanel label="Per Person" primary={n > 1 ? `${sym}${fmt(perPerson, 2)}` : `${sym}${fmt(total, 2)}`}
          summaries={<>
            <SummaryCard label="Tip Amount" value={`${sym}${fmt(tip, 2)}`} accent="text-orange-500" />
            <SummaryCard label="Total Bill" value={`${sym}${fmt(total, 2)}`} />
          </>}
          tip={`${tipPercent}% tip on ${sym}${fmt(b, 2)} split ${n > 1 ? `among ${n} people` : "alone"}.`}
        >
          <BreakdownRow label="Bill Amount" value={`${sym}${fmt(b, 2)}`} dot="bg-blue-400" />
          <BreakdownRow label="Tip Rate" value={`${tipPercent}%`} dot="bg-amber-400" />
          <BreakdownRow label="Tip Amount" value={`${sym}${fmt(tip, 2)}`} dot="bg-orange-400" />
          <BreakdownRow label="Total Bill" value={`${sym}${fmt(total, 2)}`} dot="bg-purple-400" />
          {n > 1 && <BreakdownRow label="Per Person" value={`${sym}${fmt(perPerson, 2)}`} dot="bg-green-500" bold />}
        </ResultPanel>
      }
    />
  );
}

function ROICalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [investment, setInvestment] = useState("10000");
  const [returns, setReturns] = useState("15000");

  const sym = format === "IN" ? "₹" : "$";
  const invested = parseFloat(investment) || 0;
  const returned = parseFloat(returns) || 0;
  const profit = returned - invested;
  const roi = invested > 0 ? (profit / invested) * 100 : 0;
  const isProfit = profit >= 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Investment Details" icon={PiggyBank} iconColor="bg-purple-500">
          <CurrencyInput label="Initial Investment" value={investment} onChange={setInvestment} format={format} onFormatChange={setFormat} />
          <InputField label="Final Value / Returns" value={returns} onChange={setReturns} type="number" suffix={sym} />
        </InputPanel>
      }
      results={
        <ResultPanel label="ROI" primary={`${roi.toFixed(2)}%`}
          summaries={<>
            <SummaryCard label={isProfit ? "Profit" : "Loss"} value={`${sym}${fmt(Math.abs(profit), 0)}`} accent={isProfit ? "text-green-500" : "text-red-500"} />
            <SummaryCard label="Growth" value={`${fmt(returned / invested, 2)}×`} />
          </>}
          tip={isProfit ? `You made ${fmt(roi, 2)}% ROI — a ${sym}${fmt(profit, 0)} profit.` : `You lost ${sym}${fmt(Math.abs(profit), 0)} — a ${fmt(Math.abs(roi), 2)}% loss.`}
        >
          <BreakdownRow label="Initial Investment" value={`${sym}${fmt(invested, 0)}`} dot="bg-blue-400" />
          <BreakdownRow label="Final Value" value={`${sym}${fmt(returned, 0)}`} dot="bg-purple-400" />
          <BreakdownRow label={isProfit ? "Profit" : "Loss"} value={`${isProfit ? "+" : "-"}${sym}${fmt(Math.abs(profit), 0)}`} dot={isProfit ? "bg-green-500" : "bg-red-500"} />
          <BreakdownRow label="ROI" value={`${roi.toFixed(2)}%`} dot={isProfit ? "bg-emerald-400" : "bg-red-400"} bold />
          <BreakdownRow label="Growth Multiple" value={`${fmt(returned / invested, 2)}×`} />
        </ResultPanel>
      }
    />
  );
}

function SalaryConverter() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [hourly, setHourly] = useState("25");
  const [hpw, setHpw] = useState("40");

  const sym = format === "IN" ? "₹" : "$";
  const h = parseFloat(hourly) || 0;
  const hoursPerWeek = parseFloat(hpw) || 40;
  const daily = h * 8;
  const weekly = h * hoursPerWeek;
  const monthly = weekly * 4.33;
  const yearly = weekly * 52;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Hourly Rate" icon={Coins} iconColor="bg-amber-500">
          <CurrencyInput label="Hourly Rate" value={hourly} onChange={setHourly} format={format} onFormatChange={setFormat} />
          <InputField label="Hours per Week" value={hpw} onChange={setHpw} type="number" />
        </InputPanel>
      }
      results={
        <ResultPanel label="Annual Salary" primary={`${sym}${fmt(yearly, 0)}`}
          summaries={<>
            <SummaryCard label="Monthly" value={`${sym}${fmt(monthly, 0)}`} accent="text-amber-500" />
            <SummaryCard label="Weekly" value={`${sym}${fmt(weekly, 0)}`} />
          </>}
          tip={`Based on ${hoursPerWeek} hrs/week and ${hourly} ${sym}/hr. Monthly = weekly × 4.33.`}
        >
          <BreakdownRow label="Hourly" value={`${sym}${fmt(h, 2)}`} dot="bg-amber-400" />
          <BreakdownRow label="Daily (8 hrs)" value={`${sym}${fmt(daily, 0)}`} dot="bg-blue-400" />
          <BreakdownRow label="Weekly" value={`${sym}${fmt(weekly, 0)}`} dot="bg-purple-400" />
          <BreakdownRow label="Monthly" value={`${sym}${fmt(monthly, 0)}`} dot="bg-cyan-400" />
          <BreakdownRow label="Yearly" value={`${sym}${fmt(yearly, 0)}`} dot="bg-green-500" bold />
        </ResultPanel>
      }
    />
  );
}

function DiscountCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [originalPrice, setOriginalPrice] = useState("100");
  const [discount1, setDiscount1] = useState("20");
  const [discount2, setDiscount2] = useState("10");

  const sym = format === "IN" ? "₹" : "$";
  const original = parseFloat(originalPrice) || 0;
  const d1 = parseFloat(discount1) || 0;
  const d2 = parseFloat(discount2) || 0;
  const afterFirst = original * (1 - d1 / 100);
  const afterSecond = afterFirst * (1 - d2 / 100);
  const totalSaved = original - afterSecond;
  const effective = original > 0 ? (totalSaved / original) * 100 : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Pricing Details" icon={BadgePercent} iconColor="bg-rose-500">
          <CurrencyInput label="Original Price" value={originalPrice} onChange={setOriginalPrice} format={format} onFormatChange={setFormat} />
          <InputField label="First Discount" value={discount1} onChange={setDiscount1} type="number" suffix="%" />
          <InputField label="Second Discount (optional)" value={discount2} onChange={setDiscount2} type="number" suffix="%" />
        </InputPanel>
      }
      results={
        <ResultPanel label="Final Price" primary={`${sym}${fmt(afterSecond, 2)}`}
          summaries={<>
            <SummaryCard label="You Save" value={`${sym}${fmt(totalSaved, 0)}`} accent="text-rose-500" />
            <SummaryCard label="Effective Disc." value={`${fmt(effective, 1)}%`} />
          </>}
          tip={`Stacked discounts of ${d1}% + ${d2}% = effective ${fmt(effective, 1)}% off (not ${d1 + d2}%).`}
        >
          <BreakdownRow label="Original Price" value={`${sym}${fmt(original, 2)}`} dot="bg-blue-400" />
          <BreakdownRow label={`After ${d1}% Discount`} value={`${sym}${fmt(afterFirst, 2)}`} dot="bg-amber-400" />
          <BreakdownRow label={`After ${d2}% Discount`} value={`${sym}${fmt(afterSecond, 2)}`} dot="bg-rose-400" bold />
          <BreakdownRow label="Total Saved" value={`${sym}${fmt(totalSaved, 2)}`} dot="bg-green-500" />
          <BreakdownRow label="Effective Discount" value={`${fmt(effective, 1)}%`} dot="bg-purple-400" />
        </ResultPanel>
      }
    />
  );
}

function InflationCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [mode, setMode] = useState<"historical" | "future">("historical");
  const [amount, setAmount] = useState("1000");
  const [year, setYear] = useState("2010");
  const [inflationRate, setInflationRate] = useState("2.5");

  const sym = format === "IN" ? "₹" : "$";
  const currentYear = new Date().getFullYear();
  const amt = parseFloat(amount) || 0;
  const rate = parseFloat(inflationRate) || 0;
  const targetYear = parseInt(year) || 2010;
  const yearsDiff = mode === "historical" ? currentYear - targetYear : targetYear - currentYear;
  const multiplier = Math.pow(1 + rate / 100, yearsDiff);
  const resultValue = mode === "historical" ? amt * multiplier : amt / multiplier;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Inflation Parameters" icon={TrendingDown} iconColor="bg-red-500">
          <ModeSelector modes={[{ id: "historical", label: "Purchasing Power" }, { id: "future", label: "Future Value" }]} active={mode} onChange={v => setMode(v as "historical" | "future")} />
          <CurrencyInput label="Amount" value={amount} onChange={setAmount} format={format} onFormatChange={setFormat} />
          <InputField label={mode === "historical" ? "Past Year" : "Future Year"} value={year} onChange={setYear} type="number" />
          <InputField label="Inflation Rate" value={inflationRate} onChange={setInflationRate} type="number" suffix="%" />
        </InputPanel>
      }
      results={
        <ResultPanel label={mode === "historical" ? "Today's Equivalent" : "Past Equivalent"} primary={`${sym}${fmt(resultValue, 0)}`}
          summaries={<>
            <SummaryCard label="Years" value={`${Math.abs(yearsDiff)} yrs`} accent="text-red-500" />
            <SummaryCard label="Multiplier" value={`${fmt(multiplier, 2)}×`} />
          </>}
          tip={mode === "historical" ? `${sym}${fmt(amt, 0)} in ${targetYear} ≈ ${sym}${fmt(resultValue, 0)} today at ${inflationRate}% inflation.` : `${sym}${fmt(amt, 0)} today will be worth ${sym}${fmt(resultValue, 0)} in ${targetYear}.`}
        >
          <BreakdownRow label="Original Amount" value={`${sym}${fmt(amt, 0)}`} dot="bg-blue-400" />
          <BreakdownRow label="Inflation Rate" value={`${inflationRate}% p.a.`} dot="bg-red-400" />
          <BreakdownRow label="Years" value={`${Math.abs(yearsDiff)} years`} dot="bg-amber-400" />
          <BreakdownRow label="Multiplier" value={`${fmt(multiplier, 3)}×`} dot="bg-purple-400" />
          <BreakdownRow label="Result" value={`${sym}${fmt(resultValue, 0)}`} dot="bg-green-500" bold />
        </ResultPanel>
      }
    />
  );
}

function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");

  const rates: Record<string, number> = {
    USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, INR: 83.12, CAD: 1.36,
    AUD: 1.53, CHF: 0.89, CNY: 7.24, SGD: 1.34, AED: 3.67, MXN: 17.15,
    BRL: 4.97, KRW: 1325, SEK: 10.4, NOK: 10.6, DKK: 6.88,
  };
  const amt = parseFloat(amount) || 0;
  const result = (amt / rates[from]) * rates[to];
  const rate = rates[to] / rates[from];

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Currency Details" icon={Coins} iconColor="bg-blue-500">
          <InputField label="Amount" value={amount} onChange={setAmount} type="number" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">From</label>
              <select value={from} onChange={e => setFrom(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
                {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">To</label>
              <select value={to} onChange={e => setTo(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
                {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label={`${amount} ${from}`} primary={`${fmt(result, 2)} ${to}`}
          summaries={<>
            <SummaryCard label="Exchange Rate" value={`1 ${from} = ${fmt(rate, 4)} ${to}`} accent="text-blue-500" />
            <SummaryCard label="Inverse" value={`1 ${to} = ${fmt(1 / rate, 4)} ${from}`} />
          </>}
          tip="Rates are approximate and indicative only."
        >
          <BreakdownRow label="Amount" value={`${amt} ${from}`} dot="bg-blue-400" />
          <BreakdownRow label="Rate" value={`1 ${from} = ${fmt(rate, 4)} ${to}`} dot="bg-amber-400" />
          <BreakdownRow label="Result" value={`${fmt(result, 2)} ${to}`} dot="bg-green-500" bold />
          <BreakdownRow label="Inverse Rate" value={`1 ${to} = ${fmt(1 / rate, 6)} ${from}`} dot="bg-purple-400" />
        </ResultPanel>
      }
    />
  );
}

function MortgageCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [price, setPrice] = useState("300000");
  const [down, setDown] = useState("20");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");

  const sym = format === "IN" ? "₹" : "$";
  const p = parseFloat(price) || 0;
  const d = parseFloat(down) || 0;
  const loan = p * (1 - d / 100);
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseInt(years) || 0) * 12;
  const payment = r > 0 && n > 0 ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const totalPaid = payment * n;
  const totalInterest = totalPaid - loan;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Mortgage Details" icon={Building2} iconColor="bg-blue-600">
          <CurrencyInput label="Home Price" value={price} onChange={setPrice} format={format} onFormatChange={setFormat} />
          <InputField label="Down Payment" value={down} onChange={setDown} type="number" suffix="%" />
          <InputField label="Interest Rate" value={rate} onChange={setRate} type="number" suffix="%" />
          <InputField label="Loan Term" value={years} onChange={setYears} type="number" suffix="yrs" />
        </InputPanel>
      }
      results={
        <ResultPanel label="Monthly Payment" primary={`${sym}${fmt(payment, 0)}`}
          summaries={<>
            <SummaryCard label="Total Interest" value={`${sym}${fmt(totalInterest, 0)}`} accent="text-blue-500" />
            <SummaryCard label="Loan Amount" value={`${sym}${fmt(loan, 0)}`} />
          </>}
          tip={`Over ${years} years, you pay ${sym}${fmt(totalInterest, 0)} in interest — ${fmt(totalInterest / loan * 100, 0)}% of loan value.`}
        >
          <BreakdownRow label="Home Price" value={`${sym}${fmt(p, 0)}`} dot="bg-blue-400" />
          <BreakdownRow label={`Down Payment (${down}%)`} value={`${sym}${fmt(p * d / 100, 0)}`} dot="bg-amber-400" />
          <BreakdownRow label="Loan Amount" value={`${sym}${fmt(loan, 0)}`} dot="bg-purple-400" />
          <BreakdownRow label="Monthly Payment" value={`${sym}${fmt(payment, 0)}`} dot="bg-green-500" bold />
          <BreakdownRow label="Total Interest" value={`${sym}${fmt(totalInterest, 0)}`} dot="bg-orange-400" />
          <BreakdownRow label="Total Paid" value={`${sym}${fmt(totalPaid, 0)}`} dot="bg-cyan-400" bold />
        </ResultPanel>
      }
    />
  );
}

function ProfitLoss() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [cp, setCp] = useState("100");
  const [sp, setSp] = useState("120");

  const sym = format === "IN" ? "₹" : "$";
  const cost = parseFloat(cp) || 0;
  const sell = parseFloat(sp) || 0;
  const profit = sell - cost;
  const percent = cost > 0 ? (profit / cost) * 100 : 0;
  const isProfit = profit >= 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Trade Details" icon={TrendingUp} iconColor="bg-emerald-500">
          <CurrencyInput label="Cost Price" value={cp} onChange={setCp} format={format} onFormatChange={setFormat} />
          <InputField label="Selling Price" value={sp} onChange={setSp} type="number" suffix={sym} />
        </InputPanel>
      }
      results={
        <ResultPanel label={isProfit ? "Profit" : "Loss"} primary={`${sym}${fmt(Math.abs(profit), 2)}`}
          summaries={<>
            <SummaryCard label={`${isProfit ? "Profit" : "Loss"} %`} value={`${fmt(Math.abs(percent), 2)}%`} accent={isProfit ? "text-green-500" : "text-red-500"} />
            <SummaryCard label="Multiple" value={`${fmt(sell / cost, 2)}×`} />
          </>}
          tip={isProfit ? `Selling at ${fmt(percent, 2)}% profit on cost price.` : `Selling at ${fmt(Math.abs(percent), 2)}% loss on cost price.`}
        >
          <BreakdownRow label="Cost Price" value={`${sym}${fmt(cost, 2)}`} dot="bg-blue-400" />
          <BreakdownRow label="Selling Price" value={`${sym}${fmt(sell, 2)}`} dot="bg-purple-400" />
          <BreakdownRow label={isProfit ? "Profit" : "Loss"} value={`${isProfit ? "+" : "-"}${sym}${fmt(Math.abs(profit), 2)}`} dot={isProfit ? "bg-green-500" : "bg-red-500"} bold />
          <BreakdownRow label="Percentage" value={`${fmt(Math.abs(percent), 2)}%`} dot={isProfit ? "bg-emerald-400" : "bg-red-400"} />
        </ResultPanel>
      }
    />
  );
}

function MarkupCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [cost, setCost] = useState("100");
  const [markup, setMarkup] = useState("25");

  const sym = format === "IN" ? "₹" : "$";
  const c = parseFloat(cost) || 0;
  const m = parseFloat(markup) || 0;
  const sell = c * (1 + m / 100);
  const profit = sell - c;
  const margin = sell > 0 ? (profit / sell) * 100 : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Pricing Details" icon={Tag} iconColor="bg-orange-500">
          <CurrencyInput label="Cost Price" value={cost} onChange={setCost} format={format} onFormatChange={setFormat} />
          <InputField label="Markup %" value={markup} onChange={setMarkup} type="number" suffix="%" />
        </InputPanel>
      }
      results={
        <ResultPanel label="Selling Price" primary={`${sym}${fmt(sell, 2)}`}
          summaries={<>
            <SummaryCard label="Gross Profit" value={`${sym}${fmt(profit, 2)}`} accent="text-orange-500" />
            <SummaryCard label="Margin" value={`${fmt(margin, 2)}%`} />
          </>}
          tip={`Markup ${m}% → Gross Margin ${fmt(margin, 2)}%. Markup is on cost; margin is on selling price.`}
        >
          <BreakdownRow label="Cost Price" value={`${sym}${fmt(c, 2)}`} dot="bg-blue-400" />
          <BreakdownRow label="Markup" value={`${m}%`} dot="bg-amber-400" />
          <BreakdownRow label="Selling Price" value={`${sym}${fmt(sell, 2)}`} dot="bg-orange-400" bold />
          <BreakdownRow label="Gross Profit" value={`${sym}${fmt(profit, 2)}`} dot="bg-green-500" />
          <BreakdownRow label="Gross Margin" value={`${fmt(margin, 2)}%`} dot="bg-purple-400" />
        </ResultPanel>
      }
    />
  );
}

function MarginCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [cost, setCost] = useState("100");
  const [marginPct, setMarginPct] = useState("30");
  const [mode, setMode] = useState<"margin" | "markup">("margin");

  const sym = format === "IN" ? "₹" : "$";
  const c = parseFloat(cost) || 0;
  const pct = parseFloat(marginPct) || 0;
  const sell = mode === "margin" ? c / (1 - pct / 100) : c * (1 + pct / 100);
  const profit = sell - c;
  const other = mode === "margin" ? (profit / c) * 100 : (profit / sell) * 100;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Margin Details" icon={Percent} iconColor="bg-violet-500">
          <ModeSelector modes={[{ id: "margin", label: "Gross Margin" }, { id: "markup", label: "Markup" }]} active={mode} onChange={v => setMode(v as "margin" | "markup")} />
          <CurrencyInput label="Cost" value={cost} onChange={setCost} format={format} onFormatChange={setFormat} />
          <InputField label={mode === "margin" ? "Gross Margin (%)" : "Markup (%)"} value={marginPct} onChange={setMarginPct} type="number" suffix="%" />
        </InputPanel>
      }
      results={
        <ResultPanel label="Selling Price" primary={`${sym}${fmt(sell, 2)}`}
          summaries={<>
            <SummaryCard label="Gross Profit" value={`${sym}${fmt(profit, 2)}`} accent="text-violet-500" />
            <SummaryCard label={mode === "margin" ? "Markup" : "Margin"} value={`${fmt(other, 2)}%`} />
          </>}
          tip={`${mode === "margin" ? `Margin ${pct}% → Markup ${fmt(other, 2)}%` : `Markup ${pct}% → Margin ${fmt(other, 2)}%`}. At ${pct}% ${mode}.`}
        >
          <BreakdownRow label="Cost" value={`${sym}${fmt(c, 2)}`} dot="bg-blue-400" />
          <BreakdownRow label={mode === "margin" ? "Gross Margin" : "Markup"} value={`${pct}%`} dot="bg-violet-400" />
          <BreakdownRow label="Selling Price" value={`${sym}${fmt(sell, 2)}`} dot="bg-green-500" bold />
          <BreakdownRow label="Gross Profit" value={`${sym}${fmt(profit, 2)}`} dot="bg-amber-400" />
          <BreakdownRow label={mode === "margin" ? "Markup" : "Margin"} value={`${fmt(other, 2)}%`} dot="bg-purple-400" />
        </ResultPanel>
      }
    />
  );
}

function StockCalculator() {
  const [format, setFormat] = useState<NumberFormat>("US");
  const [mode, setMode] = useState<"profit-loss" | "breakeven" | "avg-cost">("profit-loss");
  const [buyPrice, setBuyPrice] = useState("150");
  const [sellPrice, setSellPrice] = useState("180");
  const [shares, setShares] = useState("100");
  const [buyComm, setBuyComm] = useState("0");
  const [sellComm, setSellComm] = useState("0");
  const [sttRate, setSttRate] = useState("0.025");
  const [targetProfit, setTargetProfit] = useState("5000");
  const [buy1Price, setBuy1Price] = useState("100");
  const [buy1Qty, setBuy1Qty] = useState("50");
  const [buy2Price, setBuy2Price] = useState("120");
  const [buy2Qty, setBuy2Qty] = useState("30");
  const [buy3Price, setBuy3Price] = useState("90");
  const [buy3Qty, setBuy3Qty] = useState("20");

  const sym = format === "US" ? "$" : "₹";
  const f = (n: number) => isFinite(n) && !isNaN(n) ? n.toLocaleString(format === "US" ? "en-US" : "en-IN", { maximumFractionDigits: 2 }) : "—";

  const renderResult = () => {
    if (mode === "profit-loss") {
      const bp = parseFloat(buyPrice) || 0; const sp = parseFloat(sellPrice) || 0;
      const qty = parseFloat(shares) || 0; const bC = parseFloat(buyComm) || 0;
      const sC = parseFloat(sellComm) || 0; const stt = parseFloat(sttRate) || 0;
      const totalBuy = bp * qty; const totalSell = sp * qty;
      const sttAmt = (totalSell * stt) / 100;
      const totalCost = totalBuy + bC + sC + sttAmt;
      const netPL = totalSell - totalCost;
      const returnPct = totalBuy > 0 ? (netPL / totalBuy) * 100 : 0;
      const isP = netPL >= 0;
      return { rows: [
        { label: "Total Investment", value: `${sym}${f(totalBuy)}` },
        { label: "Total Sale Value", value: `${sym}${f(totalSell)}` },
        { label: "Gross P/L", value: `${sym}${f(totalSell - totalBuy)}` },
        { label: "Total Charges", value: `${sym}${f(bC + sC + sttAmt)}` },
        { label: "Net Profit/Loss", value: `${isP ? "+" : ""}${sym}${f(netPL)}`, bold: true, color: isP ? "text-green-500" : "text-red-500" },
        { label: "Return %", value: `${returnPct.toFixed(2)}%`, bold: true, color: isP ? "text-green-500" : "text-red-500" },
      ], primary: `${sym}${f(netPL)}`, label: "Net P/L", accent: isP ? "text-green-500" : "text-red-500" };
    } else if (mode === "breakeven") {
      const bp = parseFloat(buyPrice) || 0; const qty = parseFloat(shares) || 0;
      const bC = parseFloat(buyComm) || 0; const sC = parseFloat(sellComm) || 0;
      const stt = parseFloat(sttRate) || 0; const tp = parseFloat(targetProfit) || 0;
      const totalCost = bp * qty + bC;
      const avgCost = qty > 0 ? totalCost / qty : 0;
      const beNumerator = totalCost + sC;
      const beDenominator = qty * (1 - stt / 100);
      const bePrice = beDenominator > 0 ? beNumerator / beDenominator : 0;
      const targetSell = beDenominator > 0 ? (beNumerator + tp) / beDenominator : 0;
      return { rows: [
        { label: "Total Cost", value: `${sym}${f(totalCost)}` },
        { label: "Avg Cost/Share", value: `${sym}${f(avgCost)}` },
        { label: "Break-even Price", value: `${sym}${f(bePrice)}`, bold: true },
        { label: "Target Sell Price", value: `${sym}${f(targetSell)}`, bold: true, color: "text-green-500" },
      ], primary: `${sym}${f(bePrice)}`, label: "Break-even", accent: "text-amber-500" };
    } else {
      const p1 = parseFloat(buy1Price) || 0; const q1 = parseFloat(buy1Qty) || 0;
      const p2 = parseFloat(buy2Price) || 0; const q2 = parseFloat(buy2Qty) || 0;
      const p3 = parseFloat(buy3Price) || 0; const q3 = parseFloat(buy3Qty) || 0;
      const sp = parseFloat(sellPrice) || 0;
      const totalQty = q1 + q2 + q3;
      const totalCost = p1 * q1 + p2 * q2 + p3 * q3;
      const avgCost = totalQty > 0 ? totalCost / totalQty : 0;
      const totalSell = sp * totalQty;
      const pnl = totalSell - totalCost;
      const pct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
      return { rows: [
        { label: "Total Quantity", value: `${f(totalQty)} shares` },
        { label: "Total Cost", value: `${sym}${f(totalCost)}` },
        { label: "Avg Cost/Share", value: `${sym}${f(avgCost)}`, bold: true },
        { label: "Current Value", value: `${sym}${f(totalSell)}` },
        { label: "P/L", value: `${pnl >= 0 ? "+" : ""}${sym}${f(pnl)}`, bold: true, color: pnl >= 0 ? "text-green-500" : "text-red-500" },
        { label: "Return %", value: `${pct.toFixed(2)}%`, color: pnl >= 0 ? "text-green-500" : "text-red-500" },
      ], primary: `${sym}${f(avgCost)}`, label: "Avg Cost/Share", accent: "text-amber-500" };
    }
  };

  const res = renderResult();

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Stock Details" icon={BarChart2} iconColor="bg-teal-500">
          <ModeSelector modes={[{ id: "profit-loss", label: "Profit/Loss" }, { id: "breakeven", label: "Break-even" }, { id: "avg-cost", label: "Avg Cost" }]} active={mode} onChange={v => setMode(v as "profit-loss" | "breakeven" | "avg-cost")} />
          {mode === "profit-loss" && <>
            <CurrencyInput label="Buy Price" value={buyPrice} onChange={setBuyPrice} format={format} onFormatChange={setFormat} />
            <InputField label="Sell Price" value={sellPrice} onChange={setSellPrice} type="number" suffix={sym} />
            <InputField label="Number of Shares" value={shares} onChange={setShares} type="number" />
            <div className="grid grid-cols-3 gap-2">
              <InputField label="Buy Comm." value={buyComm} onChange={setBuyComm} type="number" suffix={sym} />
              <InputField label="Sell Comm." value={sellComm} onChange={setSellComm} type="number" suffix={sym} />
              <InputField label="STT %" value={sttRate} onChange={setSttRate} type="number" suffix="%" />
            </div>
          </>}
          {mode === "breakeven" && <>
            <CurrencyInput label="Buy Price" value={buyPrice} onChange={setBuyPrice} format={format} onFormatChange={setFormat} />
            <InputField label="Number of Shares" value={shares} onChange={setShares} type="number" />
            <div className="grid grid-cols-3 gap-2">
              <InputField label="Buy Comm." value={buyComm} onChange={setBuyComm} type="number" suffix={sym} />
              <InputField label="Sell Comm." value={sellComm} onChange={setSellComm} type="number" suffix={sym} />
              <InputField label="STT %" value={sttRate} onChange={setSttRate} type="number" suffix="%" />
            </div>
            <InputField label="Target Profit" value={targetProfit} onChange={setTargetProfit} type="number" suffix={sym} />
          </>}
          {mode === "avg-cost" && <>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Buy Lot 1</p>
            <div className="grid grid-cols-2 gap-2">
              <CurrencyInput label="Price" value={buy1Price} onChange={setBuy1Price} format={format} onFormatChange={setFormat} />
              <InputField label="Quantity" value={buy1Qty} onChange={setBuy1Qty} type="number" />
            </div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mt-1">Buy Lot 2</p>
            <div className="grid grid-cols-2 gap-2">
              <InputField label="Price" value={buy2Price} onChange={setBuy2Price} type="number" suffix={sym} />
              <InputField label="Quantity" value={buy2Qty} onChange={setBuy2Qty} type="number" />
            </div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mt-1">Buy Lot 3</p>
            <div className="grid grid-cols-2 gap-2">
              <InputField label="Price" value={buy3Price} onChange={setBuy3Price} type="number" suffix={sym} />
              <InputField label="Quantity" value={buy3Qty} onChange={setBuy3Qty} type="number" />
            </div>
            <InputField label="Current/Sell Price" value={sellPrice} onChange={setSellPrice} type="number" suffix={sym} />
          </>}
        </InputPanel>
      }
      results={
        <ResultPanel label={res.label} primary={res.primary}
          summaries={<>
            <SummaryCard label="Currency" value={format === "US" ? "USD $" : "INR ₹"} accent={res.accent} />
            <SummaryCard label="Mode" value={mode === "profit-loss" ? "P/L" : mode === "breakeven" ? "B/E" : "Avg"} />
          </>}
        >
          {res.rows.map((row, i) => (
            <BreakdownRow key={i} label={row.label} value={row.value} bold={row.bold} dot={row.color?.includes("green") ? "bg-green-500" : row.color?.includes("red") ? "bg-red-500" : row.color?.includes("amber") ? "bg-amber-500" : "bg-blue-400"} />
          ))}
        </ResultPanel>
      }
    />
  );
}
