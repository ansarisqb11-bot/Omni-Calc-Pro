import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CalculatorButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "accent";
  size?: "default" | "lg";
}

export function CalculatorButton({ 
  className, 
  variant = "default", 
  size = "default",
  children, 
  ...props 
}: CalculatorButtonProps) {
  const variants = {
    default: "bg-background border border-border/50 hover:bg-muted text-foreground shadow-sm",
    primary: "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    accent: "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20",
  };

  const sizes = {
    default: "h-14 text-lg",
    lg: "h-20 text-xl font-medium",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "rounded-2xl font-medium transition-colors flex items-center justify-center select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
