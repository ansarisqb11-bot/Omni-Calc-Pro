import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu, Moon, Sun, X, Monitor,
  LayoutDashboard, Calculator, Wallet,
  Ruler, Calendar, MessageSquare, StickyNote, Grid3X3, Heart,
  Hash, Triangle, FlaskConical, HardHat, Plane, GraduationCap,
  Stethoscope, Home, Car, Leaf, Code, ShoppingCart, Globe, ShoppingBag
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

  const navItems = [
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
    { label: "AI Assistant", icon: MessageSquare, href: "/ai-tools" },
    { label: "Notes", icon: StickyNote, href: "/notes" },
  ];

  const cycleTheme = () => {
    const themes: Theme[] = ["dark", "light", "amoled"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const ThemeIcon = theme === "light" ? Sun : theme === "amoled" ? Monitor : Moon;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
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

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="hidden md:flex w-64 bg-card/50 border-r border-border flex-col p-4">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">CalcHub</span>
          </div>

          <nav className="flex-1 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer",
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-border">
            <button
              onClick={cycleTheme}
              className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground w-full transition-colors rounded-xl hover:bg-muted"
              data-testid="button-toggle-theme-desktop"
            >
              <ThemeIcon className="w-5 h-5" />
              <span className="font-medium text-sm capitalize">{theme} Mode</span>
            </button>
          </div>
        </aside>
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
                {navItems.map((item) => (
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

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-56px)] md:h-screen overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
