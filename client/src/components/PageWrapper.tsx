import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ChevronRight, LucideIcon, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PageWrapperProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  backHref?: string;
  accentColor?: string;
  tools?: { id: string; label: string; icon: LucideIcon }[];
  activeTool?: string;
  onToolChange?: (id: string) => void;
}

function DesktopSearch({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  useEffect(() => { inputRef.current?.focus(); }, []);

  const allCategories = [
    { title: "Finance", href: "/finance" },
    { title: "Health", href: "/health" },
    { title: "Math", href: "/math" },
    { title: "Units", href: "/units" },
    { title: "Construction", href: "/construction" },
    { title: "Travel", href: "/travel" },
    { title: "Education", href: "/education" },
    { title: "Medical", href: "/medical" },
    { title: "Science", href: "/science" },
    { title: "Geometry", href: "/geometry" },
    { title: "Developer", href: "/developer" },
    { title: "E-Commerce", href: "/ecommerce" },
    { title: "Agriculture", href: "/agriculture" },
    { title: "AI Tools", href: "/ai-tools" },
  ];

  const filtered = q.trim()
    ? allCategories.filter(c => c.title.toLowerCase().includes(q.toLowerCase()))
    : allCategories;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -12, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tools..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
            data-testid="input-search-tools"
          />
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filtered.map((cat) => (
            <button
              key={cat.href}
              onClick={() => { navigate(cat.href); onClose(); }}
              className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors text-sm text-foreground"
            >
              {cat.title}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function PageWrapper({
  title,
  subtitle,
  children,
  backHref = "/",
  accentColor = "bg-primary",
  tools,
  activeTool,
  onToolChange,
}: PageWrapperProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activeTool]);

  if (isDesktop) {
    return (
      <div className="flex flex-col h-full bg-background overflow-hidden">

        {/* ── Top bar: breadcrumb + search ─────────────────────────────── */}
        <div className="shrink-0 px-6 py-3 border-b border-border flex items-center justify-between gap-4 bg-background">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/">
              <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors" data-testid="breadcrumb-home">Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span className="text-foreground font-medium">{title}</span>
          </div>
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-muted/60 hover:bg-muted border border-border rounded-lg text-sm text-muted-foreground transition-colors min-w-[160px]"
            data-testid="button-search-tools"
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span>Search tools...</span>
          </button>
        </div>

        {/* ── Title + subtitle ──────────────────────────────────────────── */}
        <div className="shrink-0 px-6 pt-5 pb-3">
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">{subtitle}</p>
        </div>

        {/* ── Horizontal underline tabs ─────────────────────────────────── */}
        {tools && tools.length > 0 && onToolChange && (
          <div className="shrink-0 border-b border-border px-6">
            <div ref={tabsRef} className="flex gap-1 overflow-x-auto scrollbar-hide">
              {tools.map((tool) => {
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => onToolChange(tool.id)}
                    data-testid={`tab-${tool.id}`}
                    className={`flex items-center gap-2 px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                      isActive
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    <tool.icon className="w-4 h-4 shrink-0" />
                    <span>{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Scrollable content ────────────────────────────────────────── */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-6 pb-10">
          {children}
        </div>

        <AnimatePresence>
          {showSearch && <DesktopSearch onClose={() => setShowSearch(false)} />}
        </AnimatePresence>
      </div>
    );
  }

  /* ── Mobile layout — 100% UNCHANGED ──────────────────────────────────── */
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {tools && tools.length > 0 && onToolChange && (
        <div className="px-4 py-3 border-b border-border/50">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onToolChange(tool.id)}
                data-testid={`tab-${tool.id}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTool === tool.id
                    ? `${accentColor} text-white shadow-lg`
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <tool.icon className="w-4 h-4" />
                {tool.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={contentRef} className="flex-1 overflow-y-auto p-4 pb-8">
        {children}
      </div>
    </div>
  );
}
