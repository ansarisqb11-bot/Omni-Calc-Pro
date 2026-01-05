import { Link, useLocation } from "wouter";
import { 
  Calculator, 
  DollarSign, 
  Ruler, 
  Calendar, 
  Sigma, 
  Shapes, 
  Activity, 
  Sparkles, 
  History,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: Calculator, label: "Core", href: "/" },
  { icon: DollarSign, label: "Finance", href: "/finance" },
  { icon: Ruler, label: "Units", href: "/units" },
  { icon: Calendar, label: "Date & Time", href: "/date-time" },
  { icon: Sigma, label: "Math", href: "/math" },
  { icon: Shapes, label: "Geometry", href: "/geometry" },
  { icon: Activity, label: "Everyday", href: "/everyday" },
  { icon: Sparkles, label: "AI Tools", href: "/ai-tools" },
  { icon: FileText, label: "Notes", href: "/notes" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-20 lg:w-64 h-screen border-r border-border flex flex-col bg-card shrink-0 fixed top-0 left-0 z-50">
      <div className="p-4 lg:p-6 flex items-center justify-center lg:justify-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <Calculator className="text-white w-6 h-6" />
        </div>
        <h1 className="hidden lg:block font-display font-bold text-xl tracking-tight text-foreground">
          OmniCalc
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 lg:px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium shadow-sm" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-6 h-6 shrink-0 transition-transform duration-200", isActive && "scale-110")} />
                <span className="hidden lg:block truncate">{item.label}</span>
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full" />
                )}
              </button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl p-4 hidden lg:block border border-primary/10">
          <p className="text-xs font-medium text-foreground mb-1">Pro Tip</p>
          <p className="text-xs text-muted-foreground">Press '/' to quickly access AI tools.</p>
        </div>
      </div>
    </div>
  );
}
