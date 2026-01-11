import { useState } from "react";
import { motion } from "framer-motion";
import { Banknote, Percent, TrendingUp, Receipt, PiggyBank, CreditCard } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";

type ToolType = "emi" | "compound" | "tip" | "roi";

export default function FinanceTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("emi");

  const tools = [
    { id: "emi" as ToolType, label: "Loan EMI", icon: CreditCard },
    { id: "compound" as ToolType, label: "Compound", icon: TrendingUp },
    { id: "tip" as ToolType, label: "Tip Calc", icon: Receipt },
    { id: "roi" as ToolType, label: "ROI", icon: PiggyBank },
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
        {activeTool === "tip" && <TipCalculator />}
        {activeTool === "roi" && <ROICalculator />}
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
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseInt(years);
    const n = parseInt(frequency);
    
    if (p && r && t && n) {
      const amount = p * Math.pow(1 + r / n, n * t);
      setResult({ amount, interest: amount - p });
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
