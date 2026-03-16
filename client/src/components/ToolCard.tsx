import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

/* ── Legacy ToolCard (mobile/basic) ─────────────────────────────────────── */
interface ToolCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  iconColor: string;
  children: ReactNode;
  className?: string;
}
export function ToolCard({ title, description, icon: Icon, iconColor, children, className = "" }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border rounded-2xl p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

/* ── Desktop Two-Column Grid ─────────────────────────────────────────────── */
export function DesktopToolGrid({ inputs, results, wide }: { inputs: ReactNode; results: ReactNode; wide?: boolean }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 items-start ${wide ? "max-w-5xl" : "max-w-4xl"}`}>
      {inputs}
      {results}
    </div>
  );
}

/* ── Input Panel (left card) ─────────────────────────────────────────────── */
export function InputPanel({
  title, icon: Icon, iconColor, children, currency, onCurrencyChange, currencies,
}: {
  title: string; icon: LucideIcon; iconColor: string; children: ReactNode;
  currency?: string; onCurrencyChange?: (v: string) => void;
  currencies?: { code: string; symbol: string }[];
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${iconColor} flex items-center justify-center shrink-0`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
        </div>
        {currency && currencies && onCurrencyChange && (
          <select value={currency} onChange={e => onCurrencyChange(e.target.value)}
            className="text-xs bg-muted/40 border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
            data-testid="select-currency">
            {currencies.map(c => <option key={c.code} value={c.code}>{c.code} {c.symbol}</option>)}
          </select>
        )}
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </motion.div>
  );
}

/* ── Result Panel (right side) ───────────────────────────────────────────── */
export function ResultPanel({
  label, primary, primarySub, children, summaries, tip,
}: {
  label?: string; primary?: string; primarySub?: string;
  children?: ReactNode; summaries?: ReactNode; tip?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-card rounded-2xl border border-border shadow-sm p-6">
        {label && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">{label}</p>
        )}
        {primary && (
          <div className="mb-4">
            <span className="text-4xl md:text-5xl font-black text-foreground tracking-tight break-all">{primary}</span>
            {primarySub && <span className="text-base font-semibold text-muted-foreground ml-2">{primarySub}</span>}
          </div>
        )}
        {children && <div className="space-y-0 divide-y divide-border/40">{children}</div>}
      </motion.div>
      {summaries && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3">
          {summaries}
        </motion.div>
      )}
      {tip && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="bg-primary/5 border border-primary/15 rounded-2xl px-5 py-4 flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-primary text-sm">💡</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
        </motion.div>
      )}
    </div>
  );
}

/* ── Summary Card (bottom pair) ──────────────────────────────────────────── */
export function SummaryCard({ label, value, accent, sub }: { label: string; value: string; accent?: string; sub?: string }) {
  return (
    <div className="bg-primary/5 border border-primary/10 rounded-2xl px-5 py-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-black tracking-tight ${accent || "text-foreground"}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

/* ── Breakdown Row (colored dot + label + value) ─────────────────────────── */
export function BreakdownRow({
  label, value, dot, accent, bold,
}: {
  label: string; value: string; dot?: string; accent?: string; bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2.5">
        {dot && <span className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`} />}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${accent || (bold ? "text-foreground font-bold" : "text-foreground/80")}`}>{value}</span>
    </div>
  );
}

/* ── InputField ──────────────────────────────────────────────────────────── */
interface InputFieldProps {
  label: string; value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date" | "time";
  placeholder?: string; suffix?: string; prefix?: string;
  min?: number; max?: number; step?: number;
}
export function InputField({ label, value, onChange, type = "text", placeholder, suffix, prefix, min, max, step }: InputFieldProps) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">{label}</label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3.5 text-sm font-medium text-muted-foreground select-none">{prefix}</span>
        )}
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} min={min} max={max} step={step}
          className={`w-full bg-muted/30 border border-border rounded-xl py-2.5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all text-sm ${prefix ? "pl-8 pr-4" : "px-4"} ${suffix ? "pr-14" : ""}`}
          data-testid={`input-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        />
        {suffix && (
          <span className="absolute right-3.5 text-xs font-semibold text-muted-foreground select-none">{suffix}</span>
        )}
      </div>
    </div>
  );
}

/* ── Mode Selector Bar ───────────────────────────────────────────────────── */
export function ModeSelector({ modes, active, onChange }: { modes: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-0.5 p-1 bg-muted/40 rounded-xl border border-border/50">
      {modes.map(m => (
        <button key={m.id} onClick={() => onChange(m.id)} data-testid={`mode-${m.id}`}
          className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${active === m.id ? "bg-card text-foreground shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"}`}>
          {m.label}
        </button>
      ))}
    </div>
  );
}

/* ── Legacy components preserved for compatibility ───────────────────────── */
export function ResultDisplay({ label, value, highlight, color }: { label: string; value: string | number; highlight?: boolean; color?: string }) {
  return (
    <div className={`flex justify-between items-center p-3 rounded-xl ${highlight ? "bg-muted/50" : "bg-muted/30"}`}
      data-testid={`result-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-bold ${color || (highlight ? "text-foreground text-xl" : "text-foreground")}`}>{value}</span>
    </div>
  );
}
export function ToolButton({ children, onClick, variant = "primary", disabled, className = "", type = "button", testId }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "success" | "danger"; disabled?: boolean; className?: string; type?: "button" | "submit"; testId?: string }) {
  const v = { primary: "bg-foreground hover:bg-foreground/90 text-background", secondary: "bg-muted hover:bg-muted/80 text-foreground", success: "bg-emerald-500 hover:bg-emerald-600 text-white", danger: "bg-red-500 hover:bg-red-600 text-white" };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 text-sm ${v[variant]} ${className}`} data-testid={testId || "button-tool-action"}>
      {children}
    </button>
  );
}
