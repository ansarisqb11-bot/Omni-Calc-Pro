import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu, Moon, Settings, X,
  LayoutDashboard, Calculator, Wallet,
  Ruler, Calendar, MessageSquare, StickyNote
} from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Calculators", icon: Calculator, href: "/calculator" },
    { label: "Finance", icon: Wallet, href: "/finance" },
    { label: "Units", icon: Ruler, href: "/units" },
    { label: "Date & Time", icon: Calendar, href: "/date-time" },
    { label: "AI Assistant", icon: MessageSquare, href: "/ai-tools" },
    { label: "Notes", icon: StickyNote, href: "/notes" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-4 border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight font-display">CalcHub</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <Moon className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar / Mobile Drawer */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />

            {/* Sidebar Content */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={clsx(
                "fixed md:relative inset-y-0 left-0 w-[280px] z-50",
                "bg-card border-r border-border/50 shadow-2xl md:shadow-none",
                "flex flex-col p-6",
                "md:translate-x-0" // Always show on desktop
              )}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold font-display tracking-tight">CalcHub</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden p-2 hover:bg-muted rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      onClick={() => setSidebarOpen(false)}
                      className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                        location === item.href
                          ? "bg-primary text-primary-foreground shadow-lg shadow-blue-500/20"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <item.icon className={clsx("w-5 h-5", location === item.href ? "stroke-[2.5px]" : "stroke-2")} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-border/50">
                <button className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground w-full transition-colors rounded-xl hover:bg-muted/50">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 h-[calc(100vh-64px)] md:h-screen overflow-y-auto bg-background md:p-2">
        <div className="max-w-7xl mx-auto h-full md:rounded-3xl md:border md:border-border/50 md:bg-card/30 md:overflow-hidden md:shadow-2xl md:shadow-black/20 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
