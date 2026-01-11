import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Banknote, Percent, TrendingUp } from "lucide-react";

export default function FinanceTools() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(3);

  const calculateInterest = () => {
    const interest = (amount * rate * years) / 100;
    return {
      principal: amount,
      interest: interest,
      total: amount + interest,
    };
  };

  const data = [
    { name: "Principal", value: amount, color: "#3b82f6" }, // blue-500
    { name: "Interest", value: calculateInterest().interest, color: "#10b981" }, // emerald-500
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-24">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold font-display text-foreground">Finance Tools</h1>
        <p className="text-muted-foreground mt-2">Simple Interest, EMI, and Loan Calculators</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 p-6 rounded-2xl shadow-lg space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-emerald-500" />
            </div>
            <h2 className="text-xl font-semibold">Simple Interest</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Principal Amount ($)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Interest Rate (% per year)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Time Period (Years)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
              <input 
                type="range" 
                min="1" max="30" 
                value={years} 
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full mt-2 accent-emerald-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Result Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/50 p-6 rounded-2xl shadow-lg flex flex-col"
        >
          <h2 className="text-xl font-semibold mb-6">Breakdown</h2>
          
          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4 mt-auto">
            <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Principal</span>
              </div>
              <span className="font-bold">${amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Total Interest</span>
              </div>
              <span className="font-bold text-emerald-500">+${calculateInterest().interest.toLocaleString()}</span>
            </div>
            <div className="pt-4 border-t border-border/50 flex justify-between items-center">
              <span className="text-lg font-semibold">Total Payable</span>
              <span className="text-2xl font-bold font-display">${calculateInterest().total.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
