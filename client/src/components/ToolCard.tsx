import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

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
      className={`bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 shadow-lg ${className}`}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl ${iconColor} bg-opacity-20 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor.replace("bg-", "text-")}`} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description && <p className="text-sm text-slate-400">{description}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date";
  placeholder?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function InputField({ label, value, onChange, type = "text", placeholder, suffix, min, max, step }: InputFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-400 mb-1.5 block">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          data-testid={`input-${label.toLowerCase().replace(/\s+/g, "-")}`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">{suffix}</span>
        )}
      </div>
    </div>
  );
}

interface ResultDisplayProps {
  label: string;
  value: string | number;
  highlight?: boolean;
  color?: string;
}

export function ResultDisplay({ label, value, highlight, color }: ResultDisplayProps) {
  return (
    <div className={`flex justify-between items-center p-3 rounded-xl ${highlight ? "bg-slate-700/50" : "bg-slate-900/30"}`}>
      <span className="text-slate-400">{label}</span>
      <span className={`font-bold ${color || (highlight ? "text-white text-xl" : "text-white")}`}>
        {value}
      </span>
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

export function ToolButton({ children, onClick, variant = "primary", disabled, className = "", type = "button" }: ButtonProps) {
  const variantClasses = {
    primary: "bg-primary hover:bg-primary/90 text-white",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
