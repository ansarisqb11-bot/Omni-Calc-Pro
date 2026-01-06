import { Link, useLocation } from "wouter";
import { 
  Calculator, 
  DollarSign, 
  Ruler, 
  Calendar, 
  BrainCircuit, 
  StickyNote, 
  LayoutGrid 
} from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", icon: LayoutGrid, label: "Dashboard" },
  { href: "/calculator", icon: Calculator, label: "Calculator" },
  { href: "/finance", icon: DollarSign, label: "Finance" },
  { href: "/units", icon: Ruler, label: "Converter" },
  { href: "/date-time", icon: Calendar, label: "Date & Time" },
  { href: "/ai-tools", icon: BrainCircuit, label: "AI Tools" },
  { href: "/notes", icon: StickyNote, label: "Notes" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen bg-background border-r border-border p-4 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 px-4 py-6 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20">
          <Calculator className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">CalcHub</h1>
          <p className="text-xs text-muted-foreground font-medium">Pro Tools Suite</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <item.icon
                  className={clsx(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 py-6">
        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-4 border border-indigo-500/20">
          <h4 className="font-semibold text-white mb-1">Pro Features</h4>
          <p className="text-xs text-indigo-200 mb-3">Unlock AI analysis & cloud sync.</p>
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold text-white transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-white/5 pb-safe z-50">
      <div className="flex justify-around items-center p-2">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className="flex flex-col items-center p-2 gap-1 cursor-pointer">
                <div
                  className={clsx(
                    "p-1.5 rounded-xl transition-colors",
                    isActive ? "bg-primary/20 text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                </div>
                <span className={clsx("text-[10px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
