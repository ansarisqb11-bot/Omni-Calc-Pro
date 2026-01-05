import { useState } from "react";
import { motion } from "framer-motion";
import { useAddHistory } from "@/hooks/use-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Percent, PiggyBank, Briefcase } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function FinanceTools() {
  const [amount, setAmount] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [tenure, setTenure] = useState<number>(0);
  const [result, setResult] = useState<number | null>(null);
  
  const addHistory = useAddHistory();

  const calculateLoan = () => {
    // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
    const r = rate / 12 / 100;
    const n = tenure * 12; // tenure in years
    const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    setResult(emi);
    addHistory.mutate({
      expression: `Loan: ${amount} @ ${rate}% for ${tenure}y`,
      result: emi.toFixed(2),
      category: "Finance"
    });
  };

  const calculateGST = () => {
    const gst = (amount * rate) / 100;
    setResult(amount + gst);
    addHistory.mutate({
      expression: `GST: ${amount} + ${rate}%`,
      result: (amount + gst).toFixed(2),
      category: "Finance"
    });
  };

  const chartData = result && amount ? [
    { name: 'Principal', value: amount },
    { name: 'Interest', value: (result * tenure * 12) - amount }
  ] : [];

  const COLORS = ['var(--primary)', 'var(--accent)'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Financial Tools</h1>
        <p className="text-muted-foreground">Calculate loans, taxes, and investments with precision.</p>
      </div>

      <Tabs defaultValue="loan" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px] mb-8 bg-card border border-border/50 p-1 rounded-2xl h-auto">
          <TabsTrigger value="loan" className="rounded-xl py-2">Loan</TabsTrigger>
          <TabsTrigger value="gst" className="rounded-xl py-2">GST</TabsTrigger>
          <TabsTrigger value="investment" className="rounded-xl py-2">Invest</TabsTrigger>
          <TabsTrigger value="discount" className="rounded-xl py-2">Discount</TabsTrigger>
        </TabsList>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <TabsContent value="loan" className="mt-0">
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Loan EMI Calculator
                  </CardTitle>
                  <CardDescription>Calculate your monthly mortgage or loan payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Loan Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        className="pl-9 h-12 bg-muted/30" 
                        value={amount || ""} 
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="e.g. 50000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Interest Rate (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        className="pl-9 h-12 bg-muted/30" 
                        value={rate || ""} 
                        onChange={(e) => setRate(Number(e.target.value))}
                        placeholder="e.g. 8.5"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tenure (Years)</Label>
                    <Input 
                      type="number" 
                      className="h-12 bg-muted/30" 
                      value={tenure || ""} 
                      onChange={(e) => setTenure(Number(e.target.value))}
                      placeholder="e.g. 15"
                    />
                  </div>
                  <Button onClick={calculateLoan} className="w-full h-12 text-lg font-medium bg-gradient-to-r from-primary to-primary/80">
                    Calculate EMI
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gst" className="mt-0">
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    GST / Tax Calculator
                  </CardTitle>
                  <CardDescription>Calculate inclusive or exclusive tax amounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Base Amount</Label>
                    <Input 
                      type="number" 
                      className="h-12 bg-muted/30" 
                      value={amount || ""} 
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Rate (%)</Label>
                    <Input 
                      type="number" 
                      className="h-12 bg-muted/30" 
                      value={rate || ""} 
                      onChange={(e) => setRate(Number(e.target.value))}
                    />
                  </div>
                  <Button onClick={calculateGST} className="w-full h-12 text-lg font-medium">
                    Calculate Total
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Add more tabs content as needed */}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {result !== null && (
              <Card className="bg-primary/5 border-primary/20 shadow-xl overflow-hidden">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Calculated Result
                  </p>
                  <div className="text-5xl font-bold font-mono text-primary mb-2">
                    {result.toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Amount
                  </p>

                  {chartData.length > 0 && (
                     <div className="h-64 mt-6">
                       <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                           <Pie
                             data={chartData}
                             cx="50%"
                             cy="50%"
                             innerRadius={60}
                             outerRadius={80}
                             paddingAngle={5}
                             dataKey="value"
                           >
                             {chartData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                             ))}
                           </Pie>
                           <Tooltip 
                             contentStyle={{ 
                               backgroundColor: 'hsl(var(--card))', 
                               borderColor: 'hsl(var(--border))', 
                               borderRadius: '0.5rem' 
                             }} 
                           />
                           <Legend verticalAlign="bottom" height={36}/>
                         </PieChart>
                       </ResponsiveContainer>
                     </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {!result && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border rounded-3xl bg-muted/5">
                <PiggyBank className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">Ready to calculate</h3>
                <p className="text-sm text-muted-foreground/70">Enter details to see the breakdown</p>
              </div>
            )}
          </motion.div>
        </div>
      </Tabs>
    </div>
  );
}
