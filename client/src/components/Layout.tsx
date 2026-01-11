import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu, Moon, Sun, X,
  LayoutDashboard, Calculator, Wallet,
  Ruler, Calendar, MessageSquare, StickyNote, Grid3X3, Heart
} from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
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
    { label: "AI Assistant", icon: MessageSquare, href: "/ai-tools" },
    { label: "Notes", icon: StickyNote, href: "/notes" },
  ];

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">CalcHub</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            data-testid="button-toggle-theme"
          >
            {isDark ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
          </button>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            data-testid="button-open-menu"
          >
            <Menu className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="hidden md:flex w-64 bg-slate-900/50 border-r border-slate-800 flex-col p-4">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">CalcHub</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer",
                    location === item.href
                      ? "bg-primary text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-slate-800">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white w-full transition-colors rounded-xl hover:bg-slate-800"
              data-testid="button-toggle-theme-desktop"
            >
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="font-medium text-sm">{isDark ? "Dark Mode" : "Light Mode"}</span>
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
              className="fixed inset-y-0 left-0 w-72 bg-slate-900 z-50 flex flex-col p-4 shadow-2xl"
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
                  className="p-2 hover:bg-slate-800 rounded-full"
                  data-testid="button-close-menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      onClick={() => setSidebarOpen(false)}
                      className={clsx(
                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer",
                        location === item.href
                          ? "bg-primary text-white"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </nav>
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
