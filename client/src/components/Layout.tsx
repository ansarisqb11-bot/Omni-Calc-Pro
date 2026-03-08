import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu, Moon, Sun, X, Monitor,
  Calculator, Wallet,
  Ruler, Calendar, MessageSquare, StickyNote, Grid3X3, Heart,
  Hash, Triangle, FlaskConical, HardHat, Plane, GraduationCap,
  Stethoscope, Home, Car, Leaf, Code, ShoppingCart, Globe, ShoppingBag,
  History, Star, LayoutDashboard, Sparkles
} from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

type Theme = "dark" | "light" | "amoled";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const allNavItems = [
    { label: "Home", icon: LayoutDashboard, href: "/" },
    { label: "Categories", icon: Grid3X3, href: "/categories" },
    { label: "Calculator", icon: Calculator, href: "/calculator" },
    { label: "Finance", icon: Wallet, href: "/finance" },
    { label: "Health", icon: Heart, href: "/health" },
    { label: "Units", icon: Ruler, href: "/units" },
    { label: "Date & Time", icon: Calendar, href: "/date-time" },
    { label: "Math", icon: Hash, href: "/math" },
    { label: "Numbers", icon: Hash, href: "/numbers" },
    { label: "Geometry", icon: Triangle, href: "/geometry" },
    { label: "Science", icon: FlaskConical, href: "/science" },
    { label: "Construction", icon: HardHat, href: "/construction" },
    { label: "Travel", icon: Plane, href: "/travel" },
    { label: "Education", icon: GraduationCap, href: "/education" },
    { label: "Medical", icon: Stethoscope, href: "/medical" },
    { label: "Lifestyle", icon: Home, href: "/lifestyle" },
    { label: "Automobile", icon: Car, href: "/automobile" },
    { label: "Agriculture", icon: Leaf, href: "/agriculture" },
    { label: "Developer", icon: Code, href: "/developer" },
    { label: "E-Commerce", icon: ShoppingCart, href: "/ecommerce" },
    { label: "Environment", icon: Globe, href: "/environment" },
    { label: "Smart Daily Life", icon: ShoppingBag, href: "/smart-life" },
    { label: "Word Problems", icon: Calculator, href: "/word-problems" },
    { label: "History", icon: History, href: "/history" },
    { label: "Favorites", icon: Star, href: "/favorites" },
    { label: "AI Assistant", icon: MessageSquare, href: "/ai-tools" },
    { label: "Notes", icon: StickyNote, href: "/notes" },
  ];

  const desktopMainNav = [
    { label: "Home",       icon: LayoutDashboard, href: "/" },
    { label: "Categories", icon: Grid3X3,          href: "/categories" },
    { label: "History",    icon: History,           href: "/history" },
    { label: "Favorites",  icon: Star,              href: "/favorites" },
  ];

  const cycleTheme = () => {
    const themes: Theme[] = ["dark", "light", "amoled"];
    const currentIndex = themes.indexOf(theme);
    setTheme(themes[(currentIndex + 1) % themes.length]);
  };

  const ThemeIcon = theme === "light" ? Sun : theme === "amoled" ? Monitor : Moon;
  const themeSubtitle = theme === "light" ? "LIGHT MODE" : theme === "amoled" ? "AMOLED BLACK" : "DARK FOCUS";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden">

      {/* ── Mobile Header — UNCHANGED ───────────────────────────────────────── */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-background border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">CalcHub</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cycleTheme}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            data-testid="button-toggle-theme"
          >
            <ThemeIcon className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            data-testid="button-open-menu"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* ── Desktop Sidebar ──────────────────────────────────────────────────── */}
      {!isMobile && (
        <aside className="hidden md:flex w-56 bg-card border-r border-border flex-col shrink-0 h-screen sticky top-0">

          {/* Logo */}
          <div className="flex items-center gap-3 px-5 pt-6 pb-5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm shrink-0">
              <div className="grid grid-cols-2 gap-[3px] p-1.5">
                <div className="w-full aspect-square rounded-[2px] bg-primary-foreground" />
                <div className="w-full aspect-square rounded-[2px] bg-primary-foreground" />
                <div className="w-full aspect-square rounded-[2px] bg-primary-foreground" />
                <div className="w-full aspect-square rounded-[2px] bg-primary-foreground" />
              </div>
            </div>
            <div>
              <p className="font-bold text-sm leading-tight text-foreground tracking-tight">CalcHub</p>
              <p className="text-[10px] font-semibold tracking-widest text-primary leading-tight opacity-70">
                {themeSubtitle}
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 pt-1">
            {desktopMainNav.map((item) => {
              const active = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer",
                      active
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Premium promo */}
          <div className="px-3 pb-3 shrink-0">
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-bold text-primary uppercase tracking-wide">Premium</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unlock all 50+ advanced financial tools.
              </p>
              <button
                className="w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
                data-testid="button-go-pro"
              >
                Go Pro
              </button>
            </div>
          </div>

          {/* Theme toggle */}
          <div className="shrink-0 px-3 pb-4 pt-1 border-t border-border">
            <button
              onClick={cycleTheme}
              className="flex items-center gap-3 px-3 py-2.5 w-full text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all text-sm font-medium"
              data-testid="button-toggle-theme-desktop"
            >
              <ThemeIcon className="w-4 h-4 shrink-0" />
              <span>{theme === "light" ? "Light" : theme === "amoled" ? "AMOLED" : "Dark"} Mode</span>
            </button>
          </div>
        </aside>
      )}

      {/* ── Mobile Drawer — UNCHANGED ────────────────────────────────────────── */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-72 bg-card z-50 flex flex-col p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold">CalcHub</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-muted rounded-full"
                  data-testid="button-close-menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-0.5 overflow-y-auto">
                {allNavItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      onClick={() => setSidebarOpen(false)}
                      className={clsx(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer",
                        location === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-4 border-t border-border">
                <button
                  onClick={cycleTheme}
                  className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground w-full transition-colors rounded-xl hover:bg-muted"
                >
                  <ThemeIcon className="w-5 h-5" />
                  <span className="font-medium capitalize">{theme} Mode</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 h-[calc(100vh-56px)] md:h-screen overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
