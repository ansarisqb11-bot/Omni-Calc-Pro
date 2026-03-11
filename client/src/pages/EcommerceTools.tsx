import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Tag, TrendingUp, Package, DollarSign, Truck, CreditCard, Store, BarChart3 } from "lucide-react";
import { ToolCard, InputField } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "pricing" | "commission" | "breakeven" | "inventory" | "profit" | "cod" | "subscription";

const CURRENCIES = [
  { code: "INR", symbol: "₹" }, { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" }, { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" }, { code: "CNY", symbol: "¥" },
  { code: "AUD", symbol: "A$" }, { code: "CAD", symbol: "C$" },
  { code: "AED", symbol: "د.إ" }, { code: "SGD", symbol: "S$" },
];
function cs(code: string) { return CURRENCIES.find(c => c.code === code)?.symbol || "₹"; }
function CurrencySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="bg-muted/50 border border-border rounded-lg px-2 py-1.5 text-sm text-foreground focus:outline-none" data-testid="select-currency">
      {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
    </select>
  );
}
function ModeBar({ modes, active, onChange, color = "bg-fuchsia-600" }: { modes: { id: string; label: string }[]; active: string; onChange: (id: string) => void; color?: string }) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-xl mb-4 flex-wrap">
      {modes.map(m => (
        <button key={m.id} onClick={() => onChange(m.id)} data-testid={`mode-${m.id}`}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex-1 ${active === m.id ? `${color} text-white shadow-sm` : "text-muted-foreground hover:text-foreground"}`}>
          {m.label}
        </button>
      ))}
    </div>
  );
}
function Row({ label, value, hi, accent }: { label: string; value: string; hi?: boolean; accent?: string }) {
  return (
    <div className={`flex justify-between items-center p-2.5 rounded-xl ${hi ? "bg-fuchsia-500/15 border border-fuchsia-500/20" : "bg-muted/30"}`}>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold ${hi ? (accent || "text-fuchsia-400") : "text-foreground"}`}>{value}</span>
    </div>
  );
}
function fmt(n: number, d = 2) { if (!isFinite(n) || isNaN(n)) return "—"; return parseFloat(n.toFixed(d)).toLocaleString(); }

export default function EcommerceTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("pricing");
  const tools = [
    { id: "pricing", label: "Pricing", icon: Tag },
    { id: "commission", label: "Commission", icon: DollarSign },
    { id: "breakeven", label: "Break-Even", icon: TrendingUp },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "profit", label: "Profit", icon: ShoppingCart },
    { id: "cod", label: "COD", icon: Truck },
    { id: "subscription", label: "Subscription", icon: CreditCard },
  ];
  return (
    <PageWrapper title="E-Commerce Tools" subtitle="Business and sales calculators" accentColor="bg-fuchsia-500" tools={tools} activeTool={activeTool} onToolChange={(id) => setActiveTool(id as ToolType)}>
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
  const [mode, setMode] = useState("forward");
  const [currency, setCurrency] = useState("INR");
  const [cost, setCost] = useState("500");
  const [margin, setMargin] = useState("40");
  const [taxRate, setTaxRate] = useState("18");
  const [platform, setPlatform] = useState("custom");
  const [targetPrice, setTargetPrice] = useState("1000");

  const platformFees: Record<string, { fee: number; label: string }> = {
    amazon: { fee: 15, label: "Amazon (15%)" }, flipkart: { fee: 12, label: "Flipkart (12%)" },
    shopify: { fee: 2.9, label: "Shopify (2.9%)" }, meesho: { fee: 1.8, label: "Meesho (1.8%)" },
    etsy: { fee: 6.5, label: "Etsy (6.5%)" }, ebay: { fee: 13, label: "eBay (13%)" },
    lazada: { fee: 2, label: "Lazada (2%)" }, shopee: { fee: 3, label: "Shopee (3%)" },
    daraz: { fee: 5, label: "Daraz (5%)" }, custom: { fee: 0, label: "Custom" },
  };

  const c = parseFloat(cost) || 0;
  const m = parseFloat(margin) || 0;
  const t = parseFloat(taxRate) || 0;
  const platFee = platformFees[platform].fee;

  const sellingPrice = c / (1 - m / 100);
  const withTax = sellingPrice * (1 + t / 100);
  const platFeeAmt = withTax * (platFee / 100);
  const netAfterFees = withTax - platFeeAmt - c;
  const effectiveMargin = withTax > 0 ? (netAfterFees / withTax) * 100 : 0;

  const tPrice = parseFloat(targetPrice) || 0;
  const reverseProfit = tPrice / (1 + t / 100);
  const maxCost = reverseProfit * (1 - m / 100);
  const revPlatFee = tPrice * (platFee / 100);
  const revNet = tPrice - maxCost - tPrice * t / 100 / (1 + t / 100) - revPlatFee;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Product Pricing" icon={Tag} iconColor="bg-purple-500">
        <ModeBar modes={[{ id: "forward", label: "Cost → Price" }, { id: "reverse", label: "Price → Max Cost" }]} active={mode} onChange={setMode} />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Platform</label>
          <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
            {Object.entries(platformFees).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        {mode === "forward" ? (
          <div className="space-y-3">
            <InputField label={`Product Cost (${cs(currency)})`} value={cost} onChange={setCost} type="number" />
            <InputField label="Desired Margin (%)" value={margin} onChange={setMargin} type="number" />
            <InputField label="Tax/GST Rate (%)" value={taxRate} onChange={setTaxRate} type="number" />
            <div className="space-y-2 mt-1">
              <Row label={`Selling Price (pre-tax)`} value={`${cs(currency)}${fmt(sellingPrice)}`} />
              <Row label={`Price with ${taxRate}% Tax`} value={`${cs(currency)}${fmt(withTax)}`} hi />
              <Row label={`Platform Fee (${platFee}%)`} value={`-${cs(currency)}${fmt(platFeeAmt)}`} />
              <Row label="Net Profit" value={`${cs(currency)}${fmt(netAfterFees)}`} hi accent={netAfterFees >= 0 ? "text-emerald-400" : "text-red-400"} />
              <Row label="Effective Margin" value={`${fmt(effectiveMargin, 1)}%`} />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <InputField label={`Target Selling Price (${cs(currency)})`} value={targetPrice} onChange={setTargetPrice} type="number" />
            <InputField label="Required Margin (%)" value={margin} onChange={setMargin} type="number" />
            <InputField label="Tax/GST Rate (%)" value={taxRate} onChange={setTaxRate} type="number" />
            <div className="space-y-2 mt-1">
              <Row label="Max. Allowable Cost" value={`${cs(currency)}${fmt(maxCost)}`} hi />
              <Row label={`Platform Fee (${platFee}%)`} value={`${cs(currency)}${fmt(revPlatFee)}`} />
              <Row label="Your Net Revenue" value={`${cs(currency)}${fmt(revNet)}`} hi accent="text-purple-400" />
            </div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function CommissionCalculator() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("basic");
  const [saleAmount, setSaleAmount] = useState("10000");
  const [commissionRate, setCommissionRate] = useState("10");
  const [bonusThreshold, setBonusThreshold] = useState("50000");
  const [bonusRate, setBonusRate] = useState("2");
  const [tier1, setTier1] = useState("5");
  const [tier1Max, setTier1Max] = useState("10000");
  const [tier2, setTier2] = useState("8");
  const [tier2Max, setTier2Max] = useState("50000");
  const [tier3, setTier3] = useState("12");

  const sale = parseFloat(saleAmount) || 0;
  const rate = parseFloat(commissionRate) || 0;
  const threshold = parseFloat(bonusThreshold) || 0;
  const bonus = parseFloat(bonusRate) || 0;
  const baseCommission = sale * (rate / 100);
  const bonusAmount = sale >= threshold ? sale * (bonus / 100) : 0;
  const totalCommission = baseCommission + bonusAmount;

  const t1 = parseFloat(tier1) || 0; const t1Max = parseFloat(tier1Max) || 0;
  const t2 = parseFloat(tier2) || 0; const t2Max = parseFloat(tier2Max) || 0;
  const t3 = parseFloat(tier3) || 0;
  const tieredComm = sale <= t1Max ? sale * t1 / 100
    : sale <= t2Max ? t1Max * t1 / 100 + (sale - t1Max) * t2 / 100
    : t1Max * t1 / 100 + (t2Max - t1Max) * t2 / 100 + (sale - t2Max) * t3 / 100;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Commission Calculator" icon={DollarSign} iconColor="bg-green-500">
        <ModeBar modes={[{ id: "basic", label: "Flat Rate" }, { id: "bonus", label: "+ Bonus" }, { id: "tiered", label: "Tiered" }]} active={mode} onChange={setMode} color="bg-green-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <InputField label={`Sale Amount (${cs(currency)})`} value={saleAmount} onChange={setSaleAmount} type="number" />
        {(mode === "basic" || mode === "bonus") && (
          <InputField label="Commission Rate (%)" value={commissionRate} onChange={setCommissionRate} type="number" />
        )}
        {mode === "bonus" && (
          <>
            <InputField label={`Bonus Threshold (${cs(currency)})`} value={bonusThreshold} onChange={setBonusThreshold} type="number" />
            <InputField label="Bonus Rate (%)" value={bonusRate} onChange={setBonusRate} type="number" />
          </>
        )}
        {mode === "tiered" && (
          <div className="space-y-2">
            <div className="p-2.5 bg-muted/20 rounded-xl text-xs text-muted-foreground">Define commission tiers based on sale amount</div>
            <div className="grid grid-cols-2 gap-2">
              <InputField label="Tier 1 Rate (%)" value={tier1} onChange={setTier1} type="number" />
              <InputField label={`Up to (${cs(currency)})`} value={tier1Max} onChange={setTier1Max} type="number" />
              <InputField label="Tier 2 Rate (%)" value={tier2} onChange={setTier2} type="number" />
              <InputField label={`Up to (${cs(currency)})`} value={tier2Max} onChange={setTier2Max} type="number" />
              <InputField label="Tier 3 Rate (%)" value={tier3} onChange={setTier3} type="number" />
              <div className="flex items-end pb-1 text-xs text-muted-foreground">Above tier 2</div>
            </div>
          </div>
        )}
        <div className="space-y-2 mt-3">
          {mode === "tiered" ? (
            <>
              <Row label="Sale Amount" value={`${cs(currency)}${fmt(sale)}`} />
              <Row label="Tiered Commission" value={`${cs(currency)}${fmt(tieredComm)}`} hi />
              <Row label="Effective Rate" value={`${sale > 0 ? fmt(tieredComm / sale * 100, 2) : "—"}%`} />
            </>
          ) : (
            <>
              <Row label="Base Commission" value={`${cs(currency)}${fmt(baseCommission)}`} />
              {mode === "bonus" && <Row label={`Bonus ${sale >= threshold ? "✅" : "(threshold not met)"}`} value={`${cs(currency)}${fmt(bonusAmount)}`} accent="text-yellow-400" />}
              <Row label="Total Commission" value={`${cs(currency)}${fmt(totalCommission)}`} hi />
              <Row label="You Keep" value={`${cs(currency)}${fmt(sale - totalCommission)}`} />
            </>
          )}
        </div>
      </ToolCard>
    </div>
  );
}

function BreakEvenPoint() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("units");
  const [fixedCosts, setFixedCosts] = useState("50000");
  const [pricePerUnit, setPricePerUnit] = useState("500");
  const [variableCost, setVariableCost] = useState("300");
  const [targetProfit, setTargetProfit] = useState("20000");
  const [revenue, setRevenue] = useState("200000");
  const [targetMargin, setTargetMargin] = useState("30");

  const fixed = parseFloat(fixedCosts) || 0;
  const price = parseFloat(pricePerUnit) || 0;
  const variable = parseFloat(variableCost) || 0;
  const tProfit = parseFloat(targetProfit) || 0;
  const rev = parseFloat(revenue) || 0;
  const tMargin = parseFloat(targetMargin) || 30;

  const cm = price - variable;
  const cmRatio = price > 0 ? (cm / price) * 100 : 0;
  const breakEvenUnits = cm > 0 ? Math.ceil(fixed / cm) : 0;
  const breakEvenRevenue = breakEvenUnits * price;
  const profitTargetUnits = cm > 0 ? Math.ceil((fixed + tProfit) / cm) : 0;
  const profitTargetRevenue = profitTargetUnits * price;
  const reqRevenue = tMargin < 100 ? fixed / (tMargin / 100) : 0;
  const reqUnits = price > 0 ? Math.ceil(reqRevenue / price) : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Break-Even Analysis" icon={TrendingUp} iconColor="bg-blue-500">
        <ModeBar modes={[{ id: "units", label: "By Units" }, { id: "profit", label: "Profit Target" }, { id: "margin", label: "Margin Target" }]} active={mode} onChange={setMode} color="bg-blue-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <InputField label={`Fixed Costs (${cs(currency)})`} value={fixedCosts} onChange={setFixedCosts} type="number" />
        <InputField label={`Price per Unit (${cs(currency)})`} value={pricePerUnit} onChange={setPricePerUnit} type="number" />
        <InputField label={`Variable Cost per Unit (${cs(currency)})`} value={variableCost} onChange={setVariableCost} type="number" />
        {mode === "profit" && <InputField label={`Target Profit (${cs(currency)})`} value={targetProfit} onChange={setTargetProfit} type="number" />}
        {mode === "margin" && <InputField label="Target Margin (%)" value={targetMargin} onChange={setTargetMargin} type="number" />}
        <div className="space-y-2 mt-3">
          <Row label="Contribution Margin/Unit" value={`${cs(currency)}${fmt(cm)}`} />
          <Row label="CM Ratio" value={`${fmt(cmRatio, 1)}%`} />
          <Row label="Break-Even Units" value={`${breakEvenUnits.toLocaleString()} units`} hi />
          <Row label="Break-Even Revenue" value={`${cs(currency)}${fmt(breakEvenRevenue, 0)}`} hi accent="text-blue-400" />
          {mode === "profit" && <>
            <Row label={`Units for ${cs(currency)}${tProfit} profit`} value={`${profitTargetUnits.toLocaleString()} units`} hi />
            <Row label="Revenue for target profit" value={`${cs(currency)}${fmt(profitTargetRevenue, 0)}`} />
          </>}
          {mode === "margin" && <>
            <Row label={`Revenue for ${tMargin}% margin`} value={`${cs(currency)}${fmt(reqRevenue, 0)}`} hi />
            <Row label="Units needed" value={`${reqUnits.toLocaleString()} units`} />
          </>}
        </div>
      </ToolCard>
    </div>
  );
}

function InventoryTurnover() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("turnover");
  const [cogs, setCogs] = useState("500000");
  const [avgInventory, setAvgInventory] = useState("100000");
  const [leadTime, setLeadTime] = useState("14");
  const [dailySales, setDailySales] = useState("2000");
  const [safetyStock, setSafetyStock] = useState("5000");
  const [orderCost, setOrderCost] = useState("500");
  const [holdingCostRate, setHoldingCostRate] = useState("20");

  const cogsVal = parseFloat(cogs) || 0;
  const inventory = parseFloat(avgInventory) || 1;
  const turnoverRatio = cogsVal / inventory;
  const daysToSell = 365 / turnoverRatio;
  const lt = parseFloat(leadTime) || 0;
  const ds = parseFloat(dailySales) || 0;
  const ss = parseFloat(safetyStock) || 0;
  const reorderPoint = ds * lt + ss;
  const oc = parseFloat(orderCost) || 0;
  const hcr = parseFloat(holdingCostRate) || 20;
  const eoq = oc > 0 && hcr > 0 ? Math.sqrt((2 * cogsVal * oc) / (inventory * hcr / 100)) : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Inventory Management" icon={Package} iconColor="bg-amber-500">
        <ModeBar modes={[{ id: "turnover", label: "Turnover Ratio" }, { id: "reorder", label: "Reorder Point" }, { id: "eoq", label: "EOQ" }]} active={mode} onChange={setMode} color="bg-amber-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        {mode === "turnover" && (
          <>
            <InputField label={`Annual COGS (${cs(currency)})`} value={cogs} onChange={setCogs} type="number" />
            <InputField label={`Average Inventory Value (${cs(currency)})`} value={avgInventory} onChange={setAvgInventory} type="number" />
            <div className="space-y-2 mt-3">
              <Row label="Turnover Ratio" value={`${fmt(turnoverRatio, 2)}×`} hi />
              <Row label="Days to Sell Inventory" value={`${fmt(daysToSell, 0)} days`} />
              <Row label="Inventory per day sold" value={`${cs(currency)}${fmt(cogsVal / 365, 0)}`} />
              <div className="p-2.5 bg-muted/20 rounded-xl text-xs text-muted-foreground mt-1">
                {turnoverRatio >= 8 ? "🟢 Excellent — fast-moving inventory" : turnoverRatio >= 4 ? "🟡 Good turnover rate" : "🔴 Slow — review inventory management"}
              </div>
            </div>
          </>
        )}
        {mode === "reorder" && (
          <>
            <InputField label="Daily Sales (units)" value={dailySales} onChange={setDailySales} type="number" />
            <InputField label="Lead Time (days)" value={leadTime} onChange={setLeadTime} type="number" />
            <InputField label="Safety Stock (units)" value={safetyStock} onChange={setSafetyStock} type="number" />
            <div className="space-y-2 mt-3">
              <Row label="Demand During Lead Time" value={`${fmt(ds * lt, 0)} units`} />
              <Row label="Reorder Point" value={`${fmt(reorderPoint, 0)} units`} hi />
              <Row label="When to order" value={`When stock hits ${fmt(reorderPoint, 0)}`} />
            </div>
          </>
        )}
        {mode === "eoq" && (
          <>
            <InputField label={`Annual Demand (${cs(currency)})`} value={cogs} onChange={setCogs} type="number" />
            <InputField label={`Order Cost per order (${cs(currency)})`} value={orderCost} onChange={setOrderCost} type="number" />
            <InputField label="Annual Holding Cost (%)" value={holdingCostRate} onChange={setHoldingCostRate} type="number" />
            <InputField label={`Unit Cost (${cs(currency)})`} value={avgInventory} onChange={setAvgInventory} type="number" />
            <div className="space-y-2 mt-3">
              <Row label="Economic Order Quantity" value={`${fmt(eoq, 0)} units`} hi />
              <Row label="Orders per Year" value={`${eoq > 0 ? fmt(cogsVal / eoq / (parseFloat(avgInventory)||1), 1) : "—"}`} />
            </div>
          </>
        )}
      </ToolCard>
    </div>
  );
}

function ProfitAfterFees() {
  const [currency, setCurrency] = useState("INR");
  const [platform, setPlatform] = useState("amazon");
  const [sellingPrice, setSellingPrice] = useState("1000");
  const [productCost, setProductCost] = useState("400");
  const [shippingCost, setShippingCost] = useState("80");
  const [customFee, setCustomFee] = useState("15");
  const [customPayFee, setCustomPayFee] = useState("2.9");

  const platformData: Record<string, { platFee: number; payFee: number; label: string }> = {
    amazon:   { platFee: 15,  payFee: 2.0, label: "Amazon" },
    flipkart: { platFee: 12,  payFee: 2.5, label: "Flipkart" },
    shopify:  { platFee: 0,   payFee: 2.9, label: "Shopify" },
    meesho:   { platFee: 1.8, payFee: 0,   label: "Meesho" },
    etsy:     { platFee: 6.5, payFee: 3.0, label: "Etsy" },
    ebay:     { platFee: 13,  payFee: 2.9, label: "eBay" },
    shopee:   { platFee: 3.0, payFee: 2.0, label: "Shopee" },
    lazada:   { platFee: 2.0, payFee: 1.5, label: "Lazada" },
    daraz:    { platFee: 5.0, payFee: 2.5, label: "Daraz" },
    custom:   { platFee: parseFloat(customFee)||0, payFee: parseFloat(customPayFee)||0, label: "Custom" },
  };

  const plat = platformData[platform];
  const price = parseFloat(sellingPrice) || 0;
  const cost = parseFloat(productCost) || 0;
  const shipping = parseFloat(shippingCost) || 0;
  const platFeeAmt = price * (plat.platFee / 100);
  const payFeeAmt = price * (plat.payFee / 100);
  const totalFees = platFeeAmt + payFeeAmt + shipping;
  const netProfit = price - cost - totalFees;
  const profitMargin = price > 0 ? (netProfit / price) * 100 : 0;
  const roi = cost > 0 ? (netProfit / cost) * 100 : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Profit After Fees" icon={ShoppingCart} iconColor="bg-orange-500">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Platform</label>
          <div className="flex gap-1.5 flex-wrap">
            {Object.entries(platformData).map(([k, v]) => (
              <button key={k} onClick={() => setPlatform(k)} data-testid={`platform-${k}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${platform === k ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {v.label}
              </button>
            ))}
          </div>
        </div>
        {platform === "custom" && (
          <div className="grid grid-cols-2 gap-2 mb-2">
            <InputField label="Platform Fee (%)" value={customFee} onChange={setCustomFee} type="number" />
            <InputField label="Payment Fee (%)" value={customPayFee} onChange={setCustomPayFee} type="number" />
          </div>
        )}
        <InputField label={`Selling Price (${cs(currency)})`} value={sellingPrice} onChange={setSellingPrice} type="number" />
        <InputField label={`Product Cost (${cs(currency)})`} value={productCost} onChange={setProductCost} type="number" />
        <InputField label={`Shipping Cost (${cs(currency)})`} value={shippingCost} onChange={setShippingCost} type="number" />
        <div className="space-y-2 mt-3">
          <Row label={`Platform Fee (${plat.platFee}%)`} value={`-${cs(currency)}${fmt(platFeeAmt)}`} />
          <Row label={`Payment Fee (${plat.payFee}%)`} value={`-${cs(currency)}${fmt(payFeeAmt)}`} />
          <Row label="Shipping" value={`-${cs(currency)}${fmt(shipping)}`} />
          <Row label="Total Fees" value={`-${cs(currency)}${fmt(totalFees)}`} />
          <Row label="Net Profit" value={`${cs(currency)}${fmt(netProfit)}`} hi accent={netProfit >= 0 ? "text-emerald-400" : "text-red-400"} />
          <Row label="Profit Margin" value={`${fmt(profitMargin, 1)}%`} />
          <Row label="ROI" value={`${fmt(roi, 1)}%`} />
        </div>
      </ToolCard>
    </div>
  );
}

function CODCharges() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("order");
  const [orderValue, setOrderValue] = useState("500");
  const [codFeePercent, setCodFeePercent] = useState("2");
  const [fixedCharge, setFixedCharge] = useState("25");
  const [rtoRate, setRtoRate] = useState("10");
  const [shippingFwd, setShippingFwd] = useState("60");
  const [shippingRTO, setShippingRTO] = useState("50");
  const [provider, setProvider] = useState("custom");

  const providers: Record<string, { cod: number; fixed: number; fwdShip: number; rtoShip: number; rto: number }> = {
    shiprocket: { cod: 2, fixed: 25, fwdShip: 55, rtoShip: 45, rto: 12 },
    delhivery:  { cod: 2.5, fixed: 20, fwdShip: 50, rtoShip: 40, rto: 15 },
    amazon:     { cod: 2, fixed: 0, fwdShip: 0, rtoShip: 0, rto: 8 },
    bluedart:   { cod: 1.5, fixed: 30, fwdShip: 80, rtoShip: 60, rto: 5 },
    custom:     { cod: parseFloat(codFeePercent)||2, fixed: parseFloat(fixedCharge)||25, fwdShip: parseFloat(shippingFwd)||60, rtoShip: parseFloat(shippingRTO)||50, rto: parseFloat(rtoRate)||10 },
  };

  const prov = providers[provider];
  const order = parseFloat(orderValue) || 0;
  const codFee = (order * prov.cod / 100) + prov.fixed;
  const successCost = codFee + prov.fwdShip;
  const rtoCost = prov.rtoShip;
  const rtoProb = prov.rto / 100;
  const avgCostPerOrder = successCost * (1 - rtoProb) + rtoCost * rtoProb;
  const netReceivable = order - successCost;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="COD Charges Calculator" icon={Truck} iconColor="bg-indigo-500">
        <ModeBar modes={[{ id: "order", label: "Per Order" }, { id: "bulk", label: "RTO Analysis" }]} active={mode} onChange={setMode} color="bg-indigo-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Logistics Provider</label>
          <div className="flex gap-1.5 flex-wrap">
            {Object.keys(providers).map(p => (
              <button key={p} onClick={() => setProvider(p)} className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${provider === p ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground"}`}>{p}</button>
            ))}
          </div>
        </div>
        <InputField label={`Order Value (${cs(currency)})`} value={orderValue} onChange={setOrderValue} type="number" />
        {provider === "custom" && (
          <div className="grid grid-cols-2 gap-2">
            <InputField label="COD Fee (%)" value={codFeePercent} onChange={setCodFeePercent} type="number" />
            <InputField label={`Fixed COD (${cs(currency)})`} value={fixedCharge} onChange={setFixedCharge} type="number" />
            <InputField label={`Fwd Shipping (${cs(currency)})`} value={shippingFwd} onChange={setShippingFwd} type="number" />
            <InputField label={`RTO Shipping (${cs(currency)})`} value={shippingRTO} onChange={setShippingRTO} type="number" />
            <InputField label="RTO Rate (%)" value={rtoRate} onChange={setRtoRate} type="number" />
          </div>
        )}
        <div className="space-y-2 mt-3">
          <Row label={`COD Fee (${prov.cod}% + ${cs(currency)}${prov.fixed})`} value={`${cs(currency)}${fmt(codFee)}`} />
          <Row label={`Forward Shipping`} value={`${cs(currency)}${fmt(prov.fwdShip)}`} />
          <Row label="Net Receivable (if delivered)" value={`${cs(currency)}${fmt(netReceivable)}`} hi />
          {mode === "bulk" && <>
            <Row label="RTO Shipping Cost" value={`${cs(currency)}${fmt(rtoCost)}`} />
            <Row label={`RTO Rate (${prov.rto}%)`} value={`${prov.rto}% chance of return`} />
            <Row label="Avg. Cost per Order" value={`${cs(currency)}${fmt(avgCostPerOrder)}`} hi accent="text-indigo-400" />
            <Row label="Avg. Net per Order" value={`${cs(currency)}${fmt(order - avgCostPerOrder)}`} />
          </>}
        </div>
      </ToolCard>
    </div>
  );
}

function SubscriptionOptimizer() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("metrics");
  const [monthlyPrice, setMonthlyPrice] = useState("299");
  const [annualDiscount, setAnnualDiscount] = useState("20");
  const [expectedChurn, setExpectedChurn] = useState("5");
  const [subscribers, setSubscribers] = useState("1000");
  const [acqCost, setAcqCost] = useState("500");

  const monthly = parseFloat(monthlyPrice) || 0;
  const discount = parseFloat(annualDiscount) || 0;
  const churn = parseFloat(expectedChurn) || 1;
  const subs = parseInt(subscribers) || 0;
  const cac = parseFloat(acqCost) || 0;

  const annualMonthly = monthly * 12;
  const annualPrice = annualMonthly * (1 - discount / 100);
  const mrr = subs * monthly;
  const arr = mrr * 12;
  const churnLoss = mrr * (churn / 100);
  const avgLifetime = churn > 0 ? 1 / (churn / 100) : 0;
  const ltv = monthly * avgLifetime;
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  const paybackMonths = monthly > 0 ? cac / monthly : 0;
  const netRevRetention = mrr > 0 ? ((mrr - churnLoss) / mrr) * 100 : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Subscription Optimizer" icon={CreditCard} iconColor="bg-rose-500">
        <ModeBar modes={[{ id: "metrics", label: "MRR / ARR" }, { id: "ltv", label: "LTV & CAC" }]} active={mode} onChange={setMode} color="bg-rose-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <InputField label={`Monthly Price (${cs(currency)})`} value={monthlyPrice} onChange={setMonthlyPrice} type="number" />
        <InputField label="Annual Discount (%)" value={annualDiscount} onChange={setAnnualDiscount} type="number" />
        <InputField label="Monthly Churn Rate (%)" value={expectedChurn} onChange={setExpectedChurn} type="number" />
        <InputField label="Current Subscribers" value={subscribers} onChange={setSubscribers} type="number" />
        {mode === "ltv" && <InputField label={`Customer Acquisition Cost (${cs(currency)})`} value={acqCost} onChange={setAcqCost} type="number" />}
        <div className="space-y-2 mt-3">
          {mode === "metrics" ? (
            <>
              <Row label={`Annual Price (${discount}% off)`} value={`${cs(currency)}${fmt(annualPrice)}/yr`} />
              <Row label="Customer Saves" value={`${cs(currency)}${fmt(annualMonthly - annualPrice)}/yr`} accent="text-green-400" />
              <Row label="MRR" value={`${cs(currency)}${fmt(mrr, 0)}`} hi />
              <Row label="ARR" value={`${cs(currency)}${fmt(arr, 0)}`} />
              <Row label="Monthly Churn Loss" value={`-${cs(currency)}${fmt(churnLoss, 0)}`} accent="text-red-400" />
              <Row label="Net Revenue Retention" value={`${fmt(netRevRetention, 1)}%`} />
            </>
          ) : (
            <>
              <Row label="Avg. Customer Lifetime" value={`${fmt(avgLifetime, 1)} months`} />
              <Row label="LTV (Lifetime Value)" value={`${cs(currency)}${fmt(ltv, 0)}`} hi />
              <Row label="CAC" value={`${cs(currency)}${fmt(cac, 0)}`} />
              <Row label="LTV:CAC Ratio" value={`${fmt(ltvCacRatio, 1)}×`} hi accent={ltvCacRatio >= 3 ? "text-emerald-400" : "text-red-400"} />
              <Row label="Payback Period" value={`${fmt(paybackMonths, 1)} months`} />
              <div className="p-2 bg-muted/20 rounded-xl text-xs text-muted-foreground">{ltvCacRatio >= 3 ? "🟢 Healthy — LTV:CAC ≥ 3:1" : ltvCacRatio >= 1 ? "🟡 Break-even — improve retention" : "🔴 Unprofitable — reduce CAC or improve LTV"}</div>
            </>
          )}
        </div>
      </ToolCard>
    </div>
  );
}
