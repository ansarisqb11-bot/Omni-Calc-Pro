import { useState } from "react";
import { ShoppingCart, Tag, TrendingUp, Package, DollarSign, Truck, CreditCard } from "lucide-react";
import { DesktopToolGrid, InputPanel, ResultPanel, SummaryCard, BreakdownRow, InputField, ModeSelector } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "pricing" | "commission" | "breakeven" | "inventory" | "profit" | "cod" | "subscription";

const CURRENCIES = [
  { code: "INR", symbol: "₹" }, { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" }, { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" }, { code: "CNY", symbol: "¥" },
  { code: "AUD", symbol: "A$" }, { code: "CAD", symbol: "C$" },
  { code: "AED", symbol: "د.إ" }, { code: "SGD", symbol: "S$" },
];
const cs = (code: string) => CURRENCIES.find(c => c.code === code)?.symbol || "₹";
const fmt = (n: number, d = 2) => isFinite(n) && !isNaN(n) ? parseFloat(n.toFixed(d)).toLocaleString() : "—";

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
    <PageWrapper title="E-Commerce Tools" subtitle="Business, sales and platform calculators" accentColor="bg-fuchsia-500" tools={tools} activeTool={activeTool} onToolChange={id => setActiveTool(id as ToolType)}>
      {activeTool === "pricing" && <ProductPricing />}
      {activeTool === "commission" && <Commission />}
      {activeTool === "breakeven" && <BreakEven />}
      {activeTool === "inventory" && <Inventory />}
      {activeTool === "profit" && <ProfitAfterFees />}
      {activeTool === "cod" && <COD />}
      {activeTool === "subscription" && <Subscription />}
    </PageWrapper>
  );
}

function ProductPricing() {
  const [mode, setMode] = useState("forward");
  const [currency, setCurrency] = useState("INR");
  const [cost, setCost] = useState("500"); const [margin, setMargin] = useState("40");
  const [taxRate, setTaxRate] = useState("18"); const [platform, setPlatform] = useState("amazon");
  const [targetPrice, setTargetPrice] = useState("1000");

  const platFees: Record<string, number> = { amazon:15, flipkart:12, shopify:2.9, meesho:1.8, etsy:6.5, ebay:13, shopee:3, custom:0 };
  const c = parseFloat(cost)||0; const m = parseFloat(margin)||0; const t = parseFloat(taxRate)||0;
  const pf = platFees[platform]||0;
  const sellingPrice = c / (1 - m/100);
  const withTax = sellingPrice * (1 + t/100);
  const platFeeAmt = withTax * (pf/100);
  const netProfit = withTax - platFeeAmt - c;
  const effMargin = withTax > 0 ? (netProfit/withTax)*100 : 0;
  const tp = parseFloat(targetPrice)||0;
  const maxCost = tp / (1 + t/100) * (1 - m/100);
  const revPlatFee = tp * (pf/100);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Pricing Parameters" icon={Tag} iconColor="bg-purple-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"forward", label:"Cost → Price" }, { id:"reverse", label:"Price → Max Cost" }]} active={mode} onChange={setMode} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Platform</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(platFees).map(p => (
                <button key={p} onClick={() => setPlatform(p)} data-testid={`platform-${p}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${platform === p ? "bg-purple-500 text-white" : "bg-muted/50 text-muted-foreground border border-border hover:text-foreground"}`}>{p}</button>
              ))}
            </div>
          </div>
          {mode === "forward" ? (
            <>
              <InputField label="Product Cost" value={cost} onChange={setCost} type="number" prefix={cs(currency)} />
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Target Margin (%)" value={margin} onChange={setMargin} type="number" suffix="%" />
                <InputField label="GST/Tax Rate (%)" value={taxRate} onChange={setTaxRate} type="number" suffix="%" />
              </div>
            </>
          ) : (
            <>
              <InputField label="Target Selling Price" value={targetPrice} onChange={setTargetPrice} type="number" prefix={cs(currency)} />
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Required Margin (%)" value={margin} onChange={setMargin} type="number" suffix="%" />
                <InputField label="GST/Tax Rate (%)" value={taxRate} onChange={setTaxRate} type="number" suffix="%" />
              </div>
            </>
          )}
        </InputPanel>
      }
      results={
        mode === "forward" ? (
          <ResultPanel label="Recommended Price"
            primary={`${cs(currency)}${fmt(withTax)}`}
            summaries={<>
              <SummaryCard label="Net Profit" value={`${cs(currency)}${fmt(netProfit)}`} accent={netProfit >= 0 ? "text-emerald-500" : "text-red-500"} />
              <SummaryCard label="Effective Margin" value={`${fmt(effMargin, 1)}%`} />
            </>}
          >
            <BreakdownRow label="Cost" value={`${cs(currency)}${fmt(c)}`} dot="bg-red-400" />
            <BreakdownRow label="Pre-tax Price" value={`${cs(currency)}${fmt(sellingPrice)}`} dot="bg-amber-400" />
            <BreakdownRow label={`Tax (${t}%)`} value={`+${cs(currency)}${fmt(sellingPrice * t/100)}`} dot="bg-orange-400" />
            <BreakdownRow label="Selling Price (with tax)" value={`${cs(currency)}${fmt(withTax)}`} dot="bg-blue-400" bold />
            <BreakdownRow label={`Platform Fee (${pf}%)`} value={`-${cs(currency)}${fmt(platFeeAmt)}`} dot="bg-purple-400" />
            <BreakdownRow label="Net Profit" value={`${cs(currency)}${fmt(netProfit)}`} bold />
          </ResultPanel>
        ) : (
          <ResultPanel label="Maximum Allowable Cost"
            primary={`${cs(currency)}${fmt(maxCost)}`}
            summaries={<>
              <SummaryCard label="Platform Fee" value={`${cs(currency)}${fmt(revPlatFee)}`} />
              <SummaryCard label="Your Net" value={`${cs(currency)}${fmt(tp - maxCost - revPlatFee)}`} accent="text-purple-500" />
            </>}
          >
            <BreakdownRow label="Target Price" value={`${cs(currency)}${fmt(tp)}`} dot="bg-blue-400" />
            <BreakdownRow label="Max Cost Allowed" value={`${cs(currency)}${fmt(maxCost)}`} dot="bg-green-500" bold />
            <BreakdownRow label={`Platform Fee (${pf}%)`} value={`${cs(currency)}${fmt(revPlatFee)}`} dot="bg-purple-400" />
            <BreakdownRow label="Your Net" value={`${cs(currency)}${fmt(tp - maxCost - revPlatFee)}`} bold />
          </ResultPanel>
        )
      }
    />
  );
}

function Commission() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("flat");
  const [sale, setSale] = useState("10000"); const [rate, setRate] = useState("10");
  const [threshold, setThreshold] = useState("50000"); const [bonusRate, setBonusRate] = useState("2");
  const [t1Rate, setT1Rate] = useState("5"); const [t1Max, setT1Max] = useState("10000");
  const [t2Rate, setT2Rate] = useState("8"); const [t2Max, setT2Max] = useState("50000");
  const [t3Rate, setT3Rate] = useState("12");

  const saleN = parseFloat(sale)||0; const r = parseFloat(rate)||0;
  const base = saleN * r/100;
  const bonus = saleN >= (parseFloat(threshold)||0) ? saleN * (parseFloat(bonusRate)||0)/100 : 0;
  const t1 = parseFloat(t1Rate)||0; const t1M = parseFloat(t1Max)||0;
  const t2 = parseFloat(t2Rate)||0; const t2M = parseFloat(t2Max)||0; const t3 = parseFloat(t3Rate)||0;
  const tiered = saleN <= t1M ? saleN*t1/100 : saleN <= t2M ? t1M*t1/100+(saleN-t1M)*t2/100 : t1M*t1/100+(t2M-t1M)*t2/100+(saleN-t2M)*t3/100;
  const total = mode === "tiered" ? tiered : base + bonus;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Commission Parameters" icon={DollarSign} iconColor="bg-green-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"flat", label:"Flat Rate" }, { id:"bonus", label:"+ Bonus" }, { id:"tiered", label:"Tiered" }]} active={mode} onChange={setMode} />
          <InputField label="Sale Amount" value={sale} onChange={setSale} type="number" prefix={cs(currency)} />
          {(mode === "flat" || mode === "bonus") && <InputField label="Commission Rate (%)" value={rate} onChange={setRate} type="number" suffix="%" />}
          {mode === "bonus" && (
            <div className="grid grid-cols-2 gap-3">
              <InputField label={`Bonus Threshold`} value={threshold} onChange={setThreshold} type="number" />
              <InputField label="Bonus Rate (%)" value={bonusRate} onChange={setBonusRate} type="number" suffix="%" />
            </div>
          )}
          {mode === "tiered" && (
            <div className="space-y-3">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase">Tier Structure</div>
              <div className="grid grid-cols-2 gap-2">
                <InputField label="Tier 1 Rate (%)" value={t1Rate} onChange={setT1Rate} type="number" />
                <InputField label={`Up to (${cs(currency)})`} value={t1Max} onChange={setT1Max} type="number" />
                <InputField label="Tier 2 Rate (%)" value={t2Rate} onChange={setT2Rate} type="number" />
                <InputField label={`Up to (${cs(currency)})`} value={t2Max} onChange={setT2Max} type="number" />
                <InputField label="Tier 3 Rate (%)" value={t3Rate} onChange={setT3Rate} type="number" />
              </div>
            </div>
          )}
        </InputPanel>
      }
      results={
        <ResultPanel label="Total Commission"
          primary={`${cs(currency)}${fmt(total)}`}
          summaries={<>
            <SummaryCard label="Effective Rate" value={`${saleN > 0 ? fmt(total/saleN*100, 2) : "—"}%`} />
            <SummaryCard label="You Keep" value={`${cs(currency)}${fmt(saleN - total)}`} accent="text-green-500" />
          </>}
        >
          <BreakdownRow label="Sale Amount" value={`${cs(currency)}${fmt(saleN)}`} dot="bg-blue-400" />
          {mode !== "tiered" && <BreakdownRow label="Base Commission" value={`${cs(currency)}${fmt(base)}`} dot="bg-green-500" />}
          {mode === "bonus" && <BreakdownRow label={`Bonus ${saleN >= (parseFloat(threshold)||0) ? "✅" : "(threshold not met)"}`} value={`${cs(currency)}${fmt(bonus)}`} dot="bg-amber-400" />}
          {mode === "tiered" && <BreakdownRow label="Tiered Commission" value={`${cs(currency)}${fmt(tiered)}`} dot="bg-purple-400" bold />}
          <BreakdownRow label="Total Commission" value={`${cs(currency)}${fmt(total)}`} bold />
          <BreakdownRow label="Amount You Keep" value={`${cs(currency)}${fmt(saleN - total)}`} />
        </ResultPanel>
      }
    />
  );
}

function BreakEven() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("units");
  const [fixedCosts, setFixedCosts] = useState("50000");
  const [price, setPrice] = useState("500"); const [variable, setVariable] = useState("300");
  const [targetProfit, setTargetProfit] = useState("20000"); const [targetMargin, setTargetMargin] = useState("30");

  const f = parseFloat(fixedCosts)||0; const p = parseFloat(price)||0; const v = parseFloat(variable)||0;
  const cm = p - v; const cmRatio = p > 0 ? (cm/p)*100 : 0;
  const beu = cm > 0 ? Math.ceil(f/cm) : 0; const ber = beu * p;
  const tp = parseFloat(targetProfit)||0; const ptu = cm > 0 ? Math.ceil((f+tp)/cm) : 0;
  const tMargin = parseFloat(targetMargin)||30;
  const reqRev = tMargin < 100 ? f / (tMargin/100) : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Cost Structure" icon={TrendingUp} iconColor="bg-blue-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"units", label:"Break-Even" }, { id:"profit", label:"Profit Target" }, { id:"margin", label:"Margin Target" }]} active={mode} onChange={setMode} />
          <InputField label="Fixed Costs" value={fixedCosts} onChange={setFixedCosts} type="number" prefix={cs(currency)} />
          <InputField label="Price per Unit" value={price} onChange={setPrice} type="number" prefix={cs(currency)} />
          <InputField label="Variable Cost per Unit" value={variable} onChange={setVariable} type="number" prefix={cs(currency)} />
          {mode === "profit" && <InputField label="Target Profit" value={targetProfit} onChange={setTargetProfit} type="number" prefix={cs(currency)} />}
          {mode === "margin" && <InputField label="Target Margin (%)" value={targetMargin} onChange={setTargetMargin} type="number" suffix="%" />}
        </InputPanel>
      }
      results={
        mode === "units" ? (
          <ResultPanel label="Break-Even Point" primary={`${beu.toLocaleString()} units`}
            summaries={<>
              <SummaryCard label="Break-Even Revenue" value={`${cs(currency)}${fmt(ber, 0)}`} accent="text-blue-500" />
              <SummaryCard label="CM Ratio" value={`${fmt(cmRatio, 1)}%`} />
            </>}
            tip="At break-even, total revenue equals total costs. Every unit sold beyond this point generates profit."
          >
            <BreakdownRow label="Fixed Costs" value={`${cs(currency)}${fmt(f, 0)}`} dot="bg-red-400" />
            <BreakdownRow label="Contribution Margin/Unit" value={`${cs(currency)}${fmt(cm)}`} dot="bg-green-500" />
            <BreakdownRow label="CM Ratio" value={`${fmt(cmRatio, 1)}%`} dot="bg-blue-400" />
            <BreakdownRow label="Break-Even Units" value={`${beu.toLocaleString()}`} dot="bg-purple-400" bold />
            <BreakdownRow label="Break-Even Revenue" value={`${cs(currency)}${fmt(ber, 0)}`} bold />
          </ResultPanel>
        ) : mode === "profit" ? (
          <ResultPanel label="Units for Target Profit" primary={`${ptu.toLocaleString()} units`}
            summaries={<>
              <SummaryCard label="Revenue Needed" value={`${cs(currency)}${fmt(ptu*p, 0)}`} accent="text-blue-500" />
              <SummaryCard label="Target Profit" value={`${cs(currency)}${fmt(tp, 0)}`} />
            </>}
          >
            <BreakdownRow label="Fixed Costs" value={`${cs(currency)}${fmt(f, 0)}`} dot="bg-red-400" />
            <BreakdownRow label="Target Profit" value={`${cs(currency)}${fmt(tp, 0)}`} dot="bg-green-500" />
            <BreakdownRow label="Units Needed" value={`${ptu.toLocaleString()}`} dot="bg-blue-400" bold />
            <BreakdownRow label="Revenue Needed" value={`${cs(currency)}${fmt(ptu*p, 0)}`} bold />
          </ResultPanel>
        ) : (
          <ResultPanel label={`Revenue for ${tMargin}% Margin`} primary={`${cs(currency)}${fmt(reqRev, 0)}`}
            summaries={<>
              <SummaryCard label="Units Needed" value={`${p > 0 ? Math.ceil(reqRev/p).toLocaleString() : "—"}`} accent="text-blue-500" />
              <SummaryCard label="Break-Even Rev" value={`${cs(currency)}${fmt(ber, 0)}`} />
            </>}
          >
            <BreakdownRow label="Fixed Costs" value={`${cs(currency)}${fmt(f, 0)}`} dot="bg-red-400" />
            <BreakdownRow label="Target Margin" value={`${tMargin}%`} dot="bg-green-500" />
            <BreakdownRow label="Required Revenue" value={`${cs(currency)}${fmt(reqRev, 0)}`} dot="bg-blue-400" bold />
            <BreakdownRow label="Units Needed" value={`${p > 0 ? Math.ceil(reqRev/p).toLocaleString() : "—"}`} bold />
          </ResultPanel>
        )
      }
    />
  );
}

function Inventory() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("turnover");
  const [cogs, setCogs] = useState("500000"); const [avgInv, setAvgInv] = useState("100000");
  const [leadTime, setLeadTime] = useState("14"); const [dailySales, setDailySales] = useState("2000");
  const [safetyStock, setSafetyStock] = useState("5000");
  const [orderCost, setOrderCost] = useState("500"); const [holdRate, setHoldRate] = useState("20");

  const c = parseFloat(cogs)||0; const inv = parseFloat(avgInv)||1;
  const ratio = c / inv; const days = 365 / ratio;
  const lt = parseFloat(leadTime)||0; const ds = parseFloat(dailySales)||0;
  const ss = parseFloat(safetyStock)||0; const rop = ds * lt + ss;
  const oc = parseFloat(orderCost)||0; const hr = parseFloat(holdRate)||20;
  const eoq = oc > 0 && hr > 0 && inv > 0 ? Math.sqrt((2 * c * oc) / (inv * hr/100)) : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Inventory Parameters" icon={Package} iconColor="bg-amber-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"turnover", label:"Turnover" }, { id:"reorder", label:"Reorder Point" }, { id:"eoq", label:"EOQ" }]} active={mode} onChange={setMode} />
          {mode === "turnover" && (
            <>
              <InputField label="Annual COGS" value={cogs} onChange={setCogs} type="number" prefix={cs(currency)} />
              <InputField label="Average Inventory Value" value={avgInv} onChange={setAvgInv} type="number" prefix={cs(currency)} />
            </>
          )}
          {mode === "reorder" && (
            <>
              <InputField label="Daily Sales (units)" value={dailySales} onChange={setDailySales} type="number" />
              <InputField label="Lead Time (days)" value={leadTime} onChange={setLeadTime} type="number" />
              <InputField label="Safety Stock (units)" value={safetyStock} onChange={setSafetyStock} type="number" />
            </>
          )}
          {mode === "eoq" && (
            <>
              <InputField label="Annual Demand" value={cogs} onChange={setCogs} type="number" prefix={cs(currency)} />
              <InputField label="Order Cost per Order" value={orderCost} onChange={setOrderCost} type="number" prefix={cs(currency)} />
              <InputField label="Annual Holding Cost (%)" value={holdRate} onChange={setHoldRate} type="number" suffix="%" />
              <InputField label="Unit Cost" value={avgInv} onChange={setAvgInv} type="number" prefix={cs(currency)} />
            </>
          )}
        </InputPanel>
      }
      results={
        mode === "turnover" ? (
          <ResultPanel label="Inventory Turnover" primary={`${fmt(ratio, 2)}×`}
            summaries={<>
              <SummaryCard label="Days to Sell" value={`${fmt(days, 0)} days`} accent="text-amber-500" />
              <SummaryCard label="Daily COGS" value={`${cs(currency)}${fmt(c/365, 0)}`} />
            </>}
            tip={ratio >= 8 ? "🟢 Excellent — fast-moving inventory." : ratio >= 4 ? "🟡 Good turnover. Monitor for slow items." : "🔴 Slow — consider reducing excess stock."}
          >
            <BreakdownRow label="Annual COGS" value={`${cs(currency)}${fmt(c, 0)}`} dot="bg-amber-400" />
            <BreakdownRow label="Avg Inventory" value={`${cs(currency)}${fmt(inv, 0)}`} dot="bg-blue-400" />
            <BreakdownRow label="Turnover Ratio" value={`${fmt(ratio, 2)}×`} dot="bg-green-500" bold />
            <BreakdownRow label="Days to Sell" value={`${fmt(days, 0)} days`} dot="bg-purple-400" />
          </ResultPanel>
        ) : mode === "reorder" ? (
          <ResultPanel label="Reorder Point" primary={`${fmt(rop, 0)} units`}
            summaries={<>
              <SummaryCard label="Lead Time Demand" value={`${fmt(ds*lt, 0)} units`} accent="text-amber-500" />
              <SummaryCard label="Safety Stock" value={`${fmt(ss, 0)} units`} />
            </>}
          >
            <BreakdownRow label="Daily Sales" value={`${fmt(ds, 0)} units/day`} dot="bg-amber-400" />
            <BreakdownRow label="Lead Time" value={`${lt} days`} dot="bg-blue-400" />
            <BreakdownRow label="Lead Time Demand" value={`${fmt(ds*lt, 0)} units`} dot="bg-green-500" />
            <BreakdownRow label="Safety Stock" value={`${fmt(ss, 0)} units`} dot="bg-purple-400" />
            <BreakdownRow label="Reorder Point" value={`${fmt(rop, 0)} units`} bold />
          </ResultPanel>
        ) : (
          <ResultPanel label="Economic Order Quantity" primary={`${fmt(eoq, 0)} units`}
            summaries={<>
              <SummaryCard label="Orders/Year" value={`${eoq > 0 ? fmt(c / (eoq*(parseFloat(avgInv)||1)), 1) : "—"}`} accent="text-amber-500" />
              <SummaryCard label="Order Cost" value={`${cs(currency)}${fmt(oc, 0)}`} />
            </>}
          >
            <BreakdownRow label="Annual Demand" value={`${cs(currency)}${fmt(c, 0)}`} dot="bg-amber-400" />
            <BreakdownRow label="Order Cost" value={`${cs(currency)}${fmt(oc)}`} dot="bg-blue-400" />
            <BreakdownRow label="Holding Rate" value={`${holdRate}%`} dot="bg-green-500" />
            <BreakdownRow label="EOQ" value={`${fmt(eoq, 0)} units`} dot="bg-purple-400" bold />
          </ResultPanel>
        )
      }
    />
  );
}

function ProfitAfterFees() {
  const [currency, setCurrency] = useState("INR");
  const [platform, setPlatform] = useState("amazon");
  const [sellingPrice, setSellingPrice] = useState("1000");
  const [productCost, setProductCost] = useState("400"); const [shipping, setShipping] = useState("80");

  const platData: Record<string, { platFee:number; payFee:number; label:string }> = {
    amazon:{ platFee:15, payFee:2, label:"Amazon" }, flipkart:{ platFee:12, payFee:2.5, label:"Flipkart" },
    shopify:{ platFee:0, payFee:2.9, label:"Shopify" }, meesho:{ platFee:1.8, payFee:0, label:"Meesho" },
    etsy:{ platFee:6.5, payFee:3, label:"Etsy" }, ebay:{ platFee:13, payFee:2.9, label:"eBay" },
    shopee:{ platFee:3, payFee:2, label:"Shopee" }, custom:{ platFee:0, payFee:0, label:"Custom" },
  };
  const pl = platData[platform]; const sp = parseFloat(sellingPrice)||0;
  const pc = parseFloat(productCost)||0; const sh = parseFloat(shipping)||0;
  const platFeeAmt = sp * (pl.platFee/100); const payFeeAmt = sp * (pl.payFee/100);
  const totalFees = platFeeAmt + payFeeAmt + sh;
  const netProfit = sp - pc - totalFees;
  const profitMargin = sp > 0 ? (netProfit/sp)*100 : 0;
  const roi = pc > 0 ? (netProfit/pc)*100 : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Sale Parameters" icon={ShoppingCart} iconColor="bg-orange-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Platform</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(platData).map(([k,v]) => (
                <button key={k} onClick={() => setPlatform(k)} data-testid={`platform-${k}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${platform === k ? "bg-orange-500 text-white" : "bg-muted/50 text-muted-foreground border border-border hover:text-foreground"}`}>{v.label}</button>
              ))}
            </div>
          </div>
          <div className="text-xs text-muted-foreground p-2.5 bg-muted/20 rounded-lg">
            Platform fee: {pl.platFee}% | Payment fee: {pl.payFee}%
          </div>
          <InputField label="Selling Price" value={sellingPrice} onChange={setSellingPrice} type="number" prefix={cs(currency)} />
          <InputField label="Product Cost (COGS)" value={productCost} onChange={setProductCost} type="number" prefix={cs(currency)} />
          <InputField label="Shipping Cost" value={shipping} onChange={setShipping} type="number" prefix={cs(currency)} />
        </InputPanel>
      }
      results={
        <ResultPanel label="Net Profit"
          primary={`${cs(currency)}${fmt(netProfit)}`}
          summaries={<>
            <SummaryCard label="Profit Margin" value={`${fmt(profitMargin, 1)}%`} accent={netProfit >= 0 ? "text-emerald-500" : "text-red-500"} />
            <SummaryCard label="ROI" value={`${fmt(roi, 1)}%`} />
          </>}
        >
          <BreakdownRow label="Selling Price" value={`${cs(currency)}${fmt(sp)}`} dot="bg-blue-400" />
          <BreakdownRow label="Product Cost" value={`-${cs(currency)}${fmt(pc)}`} dot="bg-red-400" />
          <BreakdownRow label={`Platform Fee (${pl.platFee}%)`} value={`-${cs(currency)}${fmt(platFeeAmt)}`} dot="bg-orange-400" />
          <BreakdownRow label={`Payment Fee (${pl.payFee}%)`} value={`-${cs(currency)}${fmt(payFeeAmt)}`} dot="bg-purple-400" />
          <BreakdownRow label="Shipping" value={`-${cs(currency)}${fmt(sh)}`} dot="bg-amber-400" />
          <BreakdownRow label="Net Profit" value={`${cs(currency)}${fmt(netProfit)}`} bold />
        </ResultPanel>
      }
    />
  );
}

function COD() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("order");
  const [orderValue, setOrderValue] = useState("500");
  const [provider, setProvider] = useState("shiprocket");
  const [codFee, setCodFee] = useState("2"); const [fixedCharge, setFixedCharge] = useState("25");
  const [fwdShip, setFwdShip] = useState("60"); const [rtoShip, setRtoShip] = useState("50");
  const [rtoRate, setRtoRate] = useState("10");

  const providers: Record<string, { cod:number; fixed:number; fwd:number; rto:number; rtoR:number }> = {
    shiprocket:{ cod:2, fixed:25, fwd:55, rto:45, rtoR:12 },
    delhivery:{ cod:2.5, fixed:20, fwd:50, rto:40, rtoR:15 },
    amazon:{ cod:2, fixed:0, fwd:0, rto:0, rtoR:8 },
    bluedart:{ cod:1.5, fixed:30, fwd:80, rto:60, rtoR:5 },
    custom:{ cod:parseFloat(codFee)||2, fixed:parseFloat(fixedCharge)||25, fwd:parseFloat(fwdShip)||60, rto:parseFloat(rtoShip)||50, rtoR:parseFloat(rtoRate)||10 },
  };
  const prov = providers[provider];
  const ov = parseFloat(orderValue)||0;
  const fee = ov * prov.cod/100 + prov.fixed;
  const successCost = fee + prov.fwd; const netRec = ov - successCost;
  const rtoProb = prov.rtoR/100;
  const avgCost = successCost*(1-rtoProb) + prov.rto*rtoProb;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="COD Parameters" icon={Truck} iconColor="bg-indigo-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"order", label:"Per Order" }, { id:"rto", label:"RTO Analysis" }]} active={mode} onChange={setMode} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Provider</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(providers).map(p => (
                <button key={p} onClick={() => setProvider(p)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${provider === p ? "bg-indigo-500 text-white" : "bg-muted/50 text-muted-foreground border border-border hover:text-foreground"}`}>{p}</button>
              ))}
            </div>
          </div>
          <InputField label="Order Value" value={orderValue} onChange={setOrderValue} type="number" prefix={cs(currency)} />
          {provider === "custom" && (
            <div className="grid grid-cols-2 gap-2">
              <InputField label="COD Fee (%)" value={codFee} onChange={setCodFee} type="number" />
              <InputField label="Fixed Charge" value={fixedCharge} onChange={setFixedCharge} type="number" />
              <InputField label="Fwd Shipping" value={fwdShip} onChange={setFwdShip} type="number" />
              <InputField label="RTO Shipping" value={rtoShip} onChange={setRtoShip} type="number" />
              <InputField label="RTO Rate (%)" value={rtoRate} onChange={setRtoRate} type="number" />
            </div>
          )}
        </InputPanel>
      }
      results={
        <ResultPanel label="Net Receivable"
          primary={`${cs(currency)}${fmt(netRec)}`}
          summaries={<>
            <SummaryCard label="COD Fee" value={`${cs(currency)}${fmt(fee)}`} />
            {mode === "rto" && <SummaryCard label="Avg Cost/Order" value={`${cs(currency)}${fmt(avgCost)}`} accent="text-indigo-500" />}
          </>}
        >
          <BreakdownRow label="Order Value" value={`${cs(currency)}${fmt(ov)}`} dot="bg-blue-400" />
          <BreakdownRow label={`COD Fee (${prov.cod}% + ${cs(currency)}${prov.fixed})`} value={`${cs(currency)}${fmt(fee)}`} dot="bg-orange-400" />
          <BreakdownRow label="Forward Shipping" value={`${cs(currency)}${fmt(prov.fwd)}`} dot="bg-purple-400" />
          <BreakdownRow label="Net Receivable" value={`${cs(currency)}${fmt(netRec)}`} dot="bg-green-500" bold />
          {mode === "rto" && (
            <>
              <BreakdownRow label="RTO Rate" value={`${prov.rtoR}%`} dot="bg-red-400" />
              <BreakdownRow label="RTO Shipping Cost" value={`${cs(currency)}${fmt(prov.rto)}`} dot="bg-red-300" />
              <BreakdownRow label="Avg Cost per Order" value={`${cs(currency)}${fmt(avgCost)}`} bold />
              <BreakdownRow label="Avg Net per Order" value={`${cs(currency)}${fmt(ov - avgCost)}`} bold />
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

function Subscription() {
  const [currency, setCurrency] = useState("INR");
  const [mode, setMode] = useState("mrr");
  const [monthlyPrice, setMonthlyPrice] = useState("299");
  const [annualDiscount, setAnnualDiscount] = useState("20");
  const [churn, setChurn] = useState("5"); const [subs, setSubs] = useState("1000");
  const [cac, setCac] = useState("500");

  const mp = parseFloat(monthlyPrice)||0; const disc = parseFloat(annualDiscount)||0;
  const ch = parseFloat(churn)||1; const subsN = parseInt(subs)||0; const cacN = parseFloat(cac)||0;
  const annualPrice = mp * 12 * (1 - disc/100);
  const mrr = subsN * mp; const arr = mrr * 12;
  const churnLoss = mrr * (ch/100);
  const avgLife = ch > 0 ? 1/(ch/100) : 0;
  const ltv = mp * avgLife; const ltvCac = cacN > 0 ? ltv/cacN : 0;
  const payback = mp > 0 ? cacN/mp : 0;
  const nrr = mrr > 0 ? ((mrr - churnLoss)/mrr)*100 : 0;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Subscription Metrics" icon={CreditCard} iconColor="bg-rose-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"mrr", label:"MRR / ARR" }, { id:"ltv", label:"LTV & CAC" }]} active={mode} onChange={setMode} />
          <InputField label="Monthly Price" value={monthlyPrice} onChange={setMonthlyPrice} type="number" prefix={cs(currency)} />
          <InputField label="Annual Discount (%)" value={annualDiscount} onChange={setAnnualDiscount} type="number" suffix="%" />
          <InputField label="Monthly Churn Rate (%)" value={churn} onChange={setChurn} type="number" suffix="%" />
          <InputField label="Current Subscribers" value={subs} onChange={setSubs} type="number" />
          {mode === "ltv" && <InputField label="Customer Acquisition Cost" value={cac} onChange={setCac} type="number" prefix={cs(currency)} />}
        </InputPanel>
      }
      results={
        mode === "mrr" ? (
          <ResultPanel label="Monthly Recurring Revenue"
            primary={`${cs(currency)}${fmt(mrr, 0)}`}
            summaries={<>
              <SummaryCard label="ARR" value={`${cs(currency)}${fmt(arr, 0)}`} accent="text-rose-500" />
              <SummaryCard label="Net Revenue Retention" value={`${fmt(nrr, 1)}%`} />
            </>}
          >
            <BreakdownRow label={`Annual Price (${disc}% off)`} value={`${cs(currency)}${fmt(annualPrice)}/yr`} dot="bg-blue-400" />
            <BreakdownRow label="Customer Saves" value={`${cs(currency)}${fmt(mp*12 - annualPrice)}/yr`} dot="bg-green-500" />
            <BreakdownRow label="MRR" value={`${cs(currency)}${fmt(mrr, 0)}`} dot="bg-rose-400" bold />
            <BreakdownRow label="ARR" value={`${cs(currency)}${fmt(arr, 0)}`} dot="bg-purple-400" />
            <BreakdownRow label="Monthly Churn Loss" value={`-${cs(currency)}${fmt(churnLoss, 0)}`} />
            <BreakdownRow label="Net Revenue Retention" value={`${fmt(nrr, 1)}%`} bold />
          </ResultPanel>
        ) : (
          <ResultPanel label="Lifetime Value"
            primary={`${cs(currency)}${fmt(ltv, 0)}`}
            summaries={<>
              <SummaryCard label="LTV:CAC Ratio" value={`${fmt(ltvCac, 1)}×`} accent={ltvCac >= 3 ? "text-emerald-500" : "text-red-500"} />
              <SummaryCard label="Payback Period" value={`${fmt(payback, 1)} mo`} />
            </>}
            tip={ltvCac >= 3 ? "🟢 Healthy LTV:CAC ≥ 3:1 — great unit economics!" : ltvCac >= 1 ? "🟡 Near break-even. Improve retention or reduce CAC." : "🔴 Unprofitable — reduce CAC or increase LTV."}
          >
            <BreakdownRow label="Avg Customer Lifetime" value={`${fmt(avgLife, 1)} months`} dot="bg-blue-400" />
            <BreakdownRow label="LTV (Lifetime Value)" value={`${cs(currency)}${fmt(ltv, 0)}`} dot="bg-rose-400" bold />
            <BreakdownRow label="CAC" value={`${cs(currency)}${fmt(cacN, 0)}`} dot="bg-red-400" />
            <BreakdownRow label="LTV:CAC" value={`${fmt(ltvCac, 1)}×`} dot="bg-green-500" bold />
            <BreakdownRow label="Payback Period" value={`${fmt(payback, 1)} months`} />
          </ResultPanel>
        )
      }
    />
  );
}
