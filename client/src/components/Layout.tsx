import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu, Moon, Sun, X, Monitor,
  LayoutDashboard, Grid3X3, History, Star,
  Wallet, Heart, Ruler, Calendar, MessageSquare, StickyNote, Hash, Triangle,
  FlaskConical, HardHat, Plane, GraduationCap, Stethoscope, Home as HomeIcon,
  Car, Leaf, Code, ShoppingCart, Globe, ShoppingBag, Palette, Shirt,
  Users, BarChart3, Proportions, Calculator, Binary, Compass, ChevronRight
} from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

type Theme = "dark" | "light" | "amoled";

const mainNav = [
  { label: "Home", icon: LayoutDashboard, href: "/" },
  { label: "Categories", icon: Grid3X3, href: "/categories" },
  { label: "History", icon: History, href: "/history" },
  { label: "Favorites", icon: Star, href: "/favorites" },
];

const categoryNav = [
  { label: "Calculator", icon: Calculator, href: "/calculator", color: "text-blue-500" },
  { label: "Finance", icon: Wallet, href: "/finance", color: "text-emerald-500" },
  { label: "Health", icon: Heart, href: "/health", color: "text-pink-500" },
  { label: "Units", icon: Ruler, href: "/units", color: "text-amber-500" },
  { label: "Date & Time", icon: Calendar, href: "/date-time", color: "text-purple-500" },
  { label: "Math", icon: Binary, href: "/math", color: "text-indigo-500" },
  { label: "Numbers", icon: Hash, href: "/numbers", color: "text-teal-500" },
  { label: "Geometry", icon: Compass, href: "/geometry", color: "text-cyan-500" },
  { label: "Science", icon: FlaskConical, href: "/science", color: "text-rose-500" },
  { label: "Construction", icon: HardHat, href: "/construction", color: "text-orange-500" },
  { label: "Travel", icon: Plane, href: "/travel", color: "text-sky-500" },
  { label: "Education", icon: GraduationCap, href: "/education", color: "text-blue-600" },
  { label: "Medical", icon: Stethoscope, href: "/medical", color: "text-red-500" },
  { label: "Lifestyle", icon: HomeIcon, href: "/lifestyle", color: "text-lime-500" },
  { label: "Automobile", icon: Car, href: "/automobile", color: "text-slate-500" },
  { label: "Agriculture", icon: Leaf, href: "/agriculture", color: "text-green-600" },
  { label: "Developer", icon: Code, href: "/developer", color: "text-gray-500" },
  { label: "E-Commerce", icon: ShoppingCart, href: "/ecommerce", color: "text-fuchsia-500" },
  { label: "Environment", icon: Globe, href: "/environment", color: "text-emerald-600" },
  { label: "Smart Life", icon: ShoppingBag, href: "/smart-life", color: "text-indigo-400" },
  { label: "Sizes", icon: Shirt, href: "/size-converter", color: "text-violet-500" },
  { label: "Color Tools", icon: Palette, href: "/color-tools", color: "text-fuchsia-400" },
  { label: "Population", icon: Users, href: "/population", color: "text-rose-400" },
  { label: "Development", icon: BarChart3, href: "/development", color: "text-amber-400" },
  { label: "Designer", icon: Proportions, href: "/designer", color: "text-pink-400" },
  { label: "AI Tools", icon: MessageSquare, href: "/ai-tools", color: "text-violet-500" },
  { label: "Notes", icon: StickyNote, href: "/notes", color: "text-yellow-500" },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "amoled"];
    const currentIndex = themes.indexOf(theme);
    setTheme(themes[(currentIndex + 1) % themes.length]);
  };

  const ThemeIcon = theme === "light" ? Sun : theme === "amoled" ? Monitor : Moon;
  const themeLabel = theme === "light" ? "Light Mode" : theme === "amoled" ? "AMOLED" : "Dark Mode";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-5 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <Calculator className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-bold text-base leading-tight text-foreground">CalcHub</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Professional Utility</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
        {mainNav.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              onClick={onClose}
              data-testid={`nav-${item.label.toLowerCase()}`}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm font-medium",
                location === item.href
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={clsx("w-4 h-4 shrink-0", location === item.href ? "text-primary" : "")} />
              <span>{item.label}</span>
              {item.label === "Favorites" && location === item.href && (
                <Star className="w-3 h-3 ml-auto fill-primary text-primary" />
              )}
            </div>
          </Link>
        ))}

        <div className="pt-3 pb-1 px-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Categories</p>
        </div>

        {categoryNav.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              onClick={onClose}
              data-testid={`nav-cat-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all text-sm",
                location === item.href
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={clsx("w-4 h-4 shrink-0", location === item.href ? "text-primary" : item.color)} />
              <span className="font-medium">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="shrink-0 px-3 pb-4 pt-2 border-t border-border/50">
        <button
          onClick={cycleTheme}
          data-testid="button-toggle-theme-desktop"
          className="flex items-center gap-3 px-3 py-2.5 w-full text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all text-sm font-medium"
        >
          <ThemeIcon className="w-4 h-4 shrink-0" />
          <span>{themeLabel}</span>
        </button>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "amoled"];
    const currentIndex = themes.indexOf(theme);
    setTheme(themes[(currentIndex + 1) % themes.length]);
  };
  const ThemeIcon = theme === "light" ? Sun : theme === "amoled" ? Monitor : Moon;

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-56 shrink-0 h-screen bg-card border-r border-border/60 sticky top-0 overflow-hidden flex flex-col">
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 bg-card/95 backdrop-blur border-b border-border/50 z-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Calculator className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-base text-foreground">CalcHub</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={cycleTheme} className="p-2 hover:bg-muted rounded-xl transition-colors" data-testid="button-toggle-theme">
              <ThemeIcon className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-muted rounded-xl transition-colors" data-testid="button-open-menu">
              <Menu className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </header>
      )}

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 w-64 bg-card z-50 shadow-2xl border-r border-border/50 overflow-hidden"
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={clsx(
        "flex-1 overflow-hidden",
        isMobile ? "h-screen pt-14" : "h-screen"
      )}>
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
