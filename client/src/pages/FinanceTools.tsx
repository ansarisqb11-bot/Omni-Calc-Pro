import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DollarSign, Percent, Calendar } from "lucide-react";

export default function FinanceTools() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(5);

  // EMI Calculation
  const r = rate / 12 / 100;
  const n = years * 12;
  const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - amount;

  const chartData = [
    { name: "Principal", value: amount, color: "#3b82f6" }, // blue-500
    { name: "Interest", value: totalInterest, color: "#10b981" }, // emerald-500
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-emerald-400">Loan & EMI Calculator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6 bg-card p-6 rounded-3xl border border-border shadow-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Loan Amount
            </label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-lg font-mono focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
            />
            <input 
              type="range" 
              min="1000" 
              max="10000000" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-500" /> Interest Rate (%)
            </label>
            <input 
              type="number" 
              value={rate} 
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-lg font-mono focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
            />
            <input 
              type="range" 
              min="1" 
              max="30" 
              step="0.1"
              value={rate} 
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" /> Duration (Years)
            </label>
            <input 
              type="number" 
              value={years} 
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-lg font-mono focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
            />
             <input 
              type="range" 
              min="1" 
              max="30" 
              value={years} 
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 p-6 rounded-2xl border border-emerald-500/30">
              <p className="text-sm text-emerald-200 mb-1">Monthly EMI</p>
              <p className="text-2xl font-bold text-white font-mono">{emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="bg-card p-6 rounded-2xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
              <p className="text-xl font-bold text-emerald-400 font-mono">{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
          </div>

          <div className="flex-1 bg-card rounded-3xl border border-border p-6 min-h-[300px] flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
             </ResponsiveContainer>
             <div className="flex gap-6 mt-4">
                {chartData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
