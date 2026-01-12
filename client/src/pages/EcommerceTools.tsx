import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Tag, TrendingUp, Package, DollarSign, Truck, CreditCard } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "pricing" | "commission" | "breakeven" | "inventory" | "profit" | "cod" | "subscription";

export default function EcommerceTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("pricing");

  const tools = [
    { id: "pricing", label: "Pricing", icon: Tag },
    { id: "commission", label: "Commission", icon: DollarSign },
    { id: "breakeven", label: "Break-Even", icon: TrendingUp },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "profit", label: "Profit", icon: ShoppingCart },
    { id: "cod", label: "COD Charges", icon: Truck },
    { id: "subscription", label: "Subscription", icon: CreditCard },
  ];

  return (
    <PageWrapper
      title="E-Commerce Tools"
      subtitle="Business and sales calculators"
      accentColor="bg-fuchsia-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "pricing" && <ProductPricing />}
      {activeTool === "commission" && <CommissionCalculator />}
      {activeTool === "breakeven" && <BreakEvenPoint />}
      {activeTool === "inventory" && <InventoryTurnover />}
      {activeTool === "profit" && <ProfitAfterFees />}
      {activeTool === "cod" && <CODCharges />}
      {activeTool === "subscription" && <SubscriptionOptimizer />}
    </PageWrapper>
  );
}

function ProductPricing() {
  const [cost, setCost] = useState("50");
  const [margin, setMargin] = useState("40");
  const [taxRate, setTaxRate] = useState("18");

  const c = parseFloat(cost) || 0;
  const m = parseFloat(margin) || 0;
  const t = parseFloat(taxRate) || 0;

  const sellingPrice = c / (1 - m / 100);
  const withTax = sellingPrice * (1 + t / 100);
  const profit = sellingPrice - c;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Product Pricing" icon={Tag} iconColor="bg-purple-500">
        <div className="space-y-4">
          <InputField label="Product Cost ($)" value={cost} onChange={setCost} type="number" />
          <InputField label="Desired Margin (%)" value={margin} onChange={setMargin} type="number" />
          <InputField label="Tax Rate (%)" value={taxRate} onChange={setTaxRate} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Pricing Strategy" icon={DollarSign} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Selling Price (Pre-tax)" value={`$${sellingPrice.toFixed(2)}`} />
          <ResultDisplay label="With Tax" value={`$${withTax.toFixed(2)}`} highlight color="text-purple-400" />
          <ResultDisplay label="Profit per Unit" value={`$${profit.toFixed(2)}`} color="text-emerald-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function CommissionCalculator() {
  const [saleAmount, setSaleAmount] = useState("1000");
  const [commissionRate, setCommissionRate] = useState("10");
  const [bonusThreshold, setBonusThreshold] = useState("5000");
  const [bonusRate, setBonusRate] = useState("2");

  const sale = parseFloat(saleAmount) || 0;
  const rate = parseFloat(commissionRate) || 0;
  const threshold = parseFloat(bonusThreshold) || 0;
  const bonus = parseFloat(bonusRate) || 0;

  const baseCommission = sale * (rate / 100);
  const bonusAmount = sale >= threshold ? sale * (bonus / 100) : 0;
  const totalCommission = baseCommission + bonusAmount;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Commission Calculator" icon={DollarSign} iconColor="bg-green-500">
        <div className="space-y-4">
          <InputField label="Sale Amount ($)" value={saleAmount} onChange={setSaleAmount} type="number" />
          <InputField label="Commission Rate (%)" value={commissionRate} onChange={setCommissionRate} type="number" />
          <InputField label="Bonus Threshold ($)" value={bonusThreshold} onChange={setBonusThreshold} type="number" />
          <InputField label="Bonus Rate (%)" value={bonusRate} onChange={setBonusRate} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Commission" icon={TrendingUp} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Base Commission" value={`$${baseCommission.toFixed(2)}`} />
          <ResultDisplay label="Bonus" value={`$${bonusAmount.toFixed(2)}`} color={bonusAmount > 0 ? "text-yellow-400" : ""} />
          <ResultDisplay label="Total Commission" value={`$${totalCommission.toFixed(2)}`} highlight color="text-green-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function BreakEvenPoint() {
  const [fixedCosts, setFixedCosts] = useState("10000");
  const [pricePerUnit, setPricePerUnit] = useState("50");
  const [variableCost, setVariableCost] = useState("30");

  const fixed = parseFloat(fixedCosts) || 0;
  const price = parseFloat(pricePerUnit) || 0;
  const variable = parseFloat(variableCost) || 0;

  const contributionMargin = price - variable;
  const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixed / contributionMargin) : 0;
  const breakEvenRevenue = breakEvenUnits * price;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Break-Even Point" icon={TrendingUp} iconColor="bg-blue-500">
        <div className="space-y-4">
          <InputField label="Fixed Costs ($)" value={fixedCosts} onChange={setFixedCosts} type="number" />
          <InputField label="Price per Unit ($)" value={pricePerUnit} onChange={setPricePerUnit} type="number" />
          <InputField label="Variable Cost per Unit ($)" value={variableCost} onChange={setVariableCost} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Break-Even Analysis" icon={DollarSign} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Contribution Margin" value={`$${contributionMargin.toFixed(2)}`} />
          <ResultDisplay label="Break-Even Units" value={breakEvenUnits.toLocaleString()} highlight color="text-blue-400" />
          <ResultDisplay label="Break-Even Revenue" value={`$${breakEvenRevenue.toLocaleString()}`} color="text-emerald-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function InventoryTurnover() {
  const [cogs, setCogs] = useState("500000");
  const [avgInventory, setAvgInventory] = useState("100000");

  const cogsVal = parseFloat(cogs) || 0;
  const inventory = parseFloat(avgInventory) || 1;

  const turnoverRatio = cogsVal / inventory;
  const daysToSell = 365 / turnoverRatio;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Inventory Turnover" icon={Package} iconColor="bg-amber-500">
        <div className="space-y-4">
          <InputField label="Cost of Goods Sold ($)" value={cogs} onChange={setCogs} type="number" />
          <InputField label="Average Inventory ($)" value={avgInventory} onChange={setAvgInventory} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Turnover Analysis" icon={TrendingUp} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Turnover Ratio" value={`${turnoverRatio.toFixed(2)}x`} highlight color="text-amber-400" />
          <ResultDisplay label="Days to Sell Inventory" value={`${daysToSell.toFixed(0)} days`} />
          <p className="text-xs text-muted-foreground mt-2">
            {turnoverRatio >= 4 ? "Good turnover rate" : "Consider improving inventory management"}
          </p>
        </div>
      </ToolCard>
    </div>
  );
}

function ProfitAfterFees() {
  const [sellingPrice, setSellingPrice] = useState("100");
  const [productCost, setProductCost] = useState("40");
  const [platformFee, setPlatformFee] = useState("15");
  const [paymentFee, setPaymentFee] = useState("2.9");
  const [shippingCost, setShippingCost] = useState("8");

  const price = parseFloat(sellingPrice) || 0;
  const cost = parseFloat(productCost) || 0;
  const platform = parseFloat(platformFee) || 0;
  const payment = parseFloat(paymentFee) || 0;
  const shipping = parseFloat(shippingCost) || 0;

  const platformFeeAmount = price * (platform / 100);
  const paymentFeeAmount = price * (payment / 100);
  const totalFees = platformFeeAmount + paymentFeeAmount + shipping;
  const netProfit = price - cost - totalFees;
  const profitMargin = price > 0 ? (netProfit / price) * 100 : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Profit After Fees" icon={ShoppingCart} iconColor="bg-orange-500">
        <div className="space-y-4">
          <InputField label="Selling Price ($)" value={sellingPrice} onChange={setSellingPrice} type="number" />
          <InputField label="Product Cost ($)" value={productCost} onChange={setProductCost} type="number" />
          <InputField label="Platform Fee (%)" value={platformFee} onChange={setPlatformFee} type="number" />
          <InputField label="Payment Fee (%)" value={paymentFee} onChange={setPaymentFee} type="number" step={0.1} />
          <InputField label="Shipping Cost ($)" value={shippingCost} onChange={setShippingCost} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Profit Breakdown" icon={DollarSign} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Platform Fee" value={`-$${platformFeeAmount.toFixed(2)}`} />
          <ResultDisplay label="Payment Fee" value={`-$${paymentFeeAmount.toFixed(2)}`} />
          <ResultDisplay label="Shipping" value={`-$${shipping.toFixed(2)}`} />
          <ResultDisplay label="Net Profit" value={`$${netProfit.toFixed(2)}`} highlight color={netProfit >= 0 ? "text-emerald-400" : "text-red-400"} />
          <ResultDisplay label="Profit Margin" value={`${profitMargin.toFixed(1)}%`} />
        </div>
      </ToolCard>
    </div>
  );
}

function CODCharges() {
  const [orderValue, setOrderValue] = useState("500");
  const [codFeePercent, setCodFeePercent] = useState("2");
  const [fixedCharge, setFixedCharge] = useState("25");
  const [rtoRate, setRtoRate] = useState("5");

  const order = parseFloat(orderValue) || 0;
  const codPercent = parseFloat(codFeePercent) || 0;
  const fixed = parseFloat(fixedCharge) || 0;
  const rto = parseFloat(rtoRate) || 0;

  const codFee = (order * codPercent / 100) + fixed;
  const rtoLoss = order * (rto / 100);
  const effectiveCost = codFee + rtoLoss;
  const netReceivable = order - effectiveCost;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="COD Charges Calculator" icon={Truck} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <InputField label="Order Value ($)" value={orderValue} onChange={setOrderValue} type="number" />
          <InputField label="COD Fee (%)" value={codFeePercent} onChange={setCodFeePercent} type="number" />
          <InputField label="Fixed COD Charge ($)" value={fixedCharge} onChange={setFixedCharge} type="number" />
          <InputField label="RTO Rate (%)" value={rtoRate} onChange={setRtoRate} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="COD Analysis" icon={DollarSign} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="COD Fee" value={`$${codFee.toFixed(2)}`} />
          <ResultDisplay label="Est. RTO Loss" value={`$${rtoLoss.toFixed(2)}`} color="text-red-400" />
          <ResultDisplay label="Effective Cost" value={`$${effectiveCost.toFixed(2)}`} />
          <ResultDisplay label="Net Receivable" value={`$${netReceivable.toFixed(2)}`} highlight color="text-indigo-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function SubscriptionOptimizer() {
  const [monthlyPrice, setMonthlyPrice] = useState("29");
  const [annualDiscount, setAnnualDiscount] = useState("20");
  const [expectedChurn, setExpectedChurn] = useState("5");
  const [subscribers, setSubscribers] = useState("1000");

  const monthly = parseFloat(monthlyPrice) || 0;
  const discount = parseFloat(annualDiscount) || 0;
  const churn = parseFloat(expectedChurn) || 0;
  const subs = parseInt(subscribers) || 0;

  const annualMonthly = monthly * 12;
  const annualPrice = annualMonthly * (1 - discount / 100);
  const monthlySavings = annualMonthly - annualPrice;
  const mrr = subs * monthly;
  const arr = mrr * 12;
  const churnLoss = mrr * (churn / 100);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Subscription Optimizer" icon={CreditCard} iconColor="bg-rose-500">
        <div className="space-y-4">
          <InputField label="Monthly Price ($)" value={monthlyPrice} onChange={setMonthlyPrice} type="number" />
          <InputField label="Annual Discount (%)" value={annualDiscount} onChange={setAnnualDiscount} type="number" />
          <InputField label="Monthly Churn Rate (%)" value={expectedChurn} onChange={setExpectedChurn} type="number" />
          <InputField label="Current Subscribers" value={subscribers} onChange={setSubscribers} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Subscription Metrics" icon={TrendingUp} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Annual Price" value={`$${annualPrice.toFixed(2)}/year`} />
          <ResultDisplay label="Customer Saves" value={`$${monthlySavings.toFixed(2)}/year`} color="text-green-400" />
          <ResultDisplay label="MRR" value={`$${mrr.toLocaleString()}`} highlight color="text-rose-400" />
          <ResultDisplay label="ARR" value={`$${arr.toLocaleString()}`} />
          <ResultDisplay label="Monthly Churn Loss" value={`$${churnLoss.toFixed(0)}`} color="text-red-400" />
        </div>
      </ToolCard>
    </div>
  );
}
