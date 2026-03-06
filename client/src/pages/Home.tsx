import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { evaluate } from "mathjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Delete, ChevronRight, ChevronLeft, Bell, X,
  Wallet, Heart, Ruler, Clock, Binary, Compass, FlaskConical, HardHat,
  Plane, MessageSquare, Hash, GraduationCap, Stethoscope, Home as HomeIcon,
  Car, Leaf, Code, ShoppingCart, Globe, ShoppingBag, Palette, StickyNote, Calculator, Shirt,
  Users, BarChart3, Proportions, Star
} from "lucide-react";
import { useAddToHistory } from "@/hooks/use-history";
import { useFavorites, useRecent } from "@/hooks/use-favorites";

const allCategories = [
  { id: "finance", title: "Finance", description: "EMI, SIP, loans & budgeting", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
  { id: "size-converter", title: "Sizes", description: "Clothing, shoes, international sizes", icon: Shirt, color: "bg-violet-500", href: "/size-converter" },
  { id: "health", title: "Health", description: "BMI, calories & fitness tools", icon: Heart, color: "bg-pink-500", href: "/health" },
  { id: "science", title: "Science", description: "Physics, chemistry, conversions", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
  { id: "units", title: "Units", description: "Length, weight, temperature & more", icon: Ruler, color: "bg-amber-500", href: "/units" },
  { id: "date-time", title: "Date/Time", description: "Age, days between, countdowns", icon: Clock, color: "bg-purple-500", href: "/date-time" },
  { id: "math", title: "Math", description: "Algebra, statistics, fractions", icon: Binary, color: "bg-indigo-500", href: "/math" },
  { id: "numbers", title: "Numbers", description: "Crore, lakh, roman, fibonacci", icon: Hash, color: "bg-teal-500", href: "/numbers" },
  { id: "geometry", title: "Geometry", description: "Area, volume, perimeter", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
  { id: "construction", title: "Construction", description: "Paint, cement, tiles, steel", icon: HardHat, color: "bg-orange-500", href: "/construction" },
  { id: "travel", title: "Travel", description: "Distance, fuel, currency, time zones", icon: Plane, color: "bg-sky-500", href: "/travel" },
  { id: "education", title: "Education", description: "GPA, grades, percentages", icon: GraduationCap, color: "bg-blue-600", href: "/education" },
  { id: "medical", title: "Medical", description: "Dosage, BMR, health metrics", icon: Stethoscope, color: "bg-red-500", href: "/medical" },
  { id: "lifestyle", title: "Lifestyle", description: "Food, home, daily life tools", icon: HomeIcon, color: "bg-lime-500", href: "/lifestyle" },
  { id: "automobile", title: "Automobile", description: "Fuel, mileage, EMI for cars", icon: Car, color: "bg-slate-500", href: "/automobile" },
  { id: "agriculture", title: "Agriculture", description: "Crop yield, area, irrigation", icon: Leaf, color: "bg-green-600", href: "/agriculture" },
  { id: "developer", title: "Developer", description: "Base, binary, color codes", icon: Code, color: "bg-gray-600", href: "/developer" },
  { id: "ecommerce", title: "E-Commerce", description: "Discount, profit, tax, GST", icon: ShoppingCart, color: "bg-fuchsia-500", href: "/ecommerce" },
  { id: "environment", title: "Environment", description: "Carbon footprint, energy usage", icon: Globe, color: "bg-emerald-600", href: "/environment" },
  { id: "smart-life", title: "Smart Life", description: "Sleep, productivity, budget", icon: ShoppingBag, color: "bg-indigo-500", href: "/smart-life" },
  { id: "color-tools", title: "Color Tools", description: "HEX, RGB, HSL converters", icon: Palette, color: "bg-fuchsia-500", href: "/color-tools" },
  { id: "population", title: "Population", description: "Demographics, world statistics", icon: Users, color: "bg-rose-500", href: "/population" },
  { id: "development", title: "Development", description: "Project, finance, growth metrics", icon: BarChart3, color: "bg-amber-500", href: "/development" },
  { id: "designer", title: "Designer", description: "Ratios, typography, layout tools", icon: Proportions, color: "bg-pink-500", href: "/designer" },
  { id: "ai-tools", title: "AI Tools", description: "Smart calculations & advice", icon: MessageSquare, color: "bg-violet-500", href: "/ai-tools" },
  { id: "notes", title: "Notes", description: "Quick notes & reminders", icon: StickyNote, color: "bg-yellow-500", href: "/notes" },
];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [, navigate] = useLocation();
  const { addRecent } = useRecent();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = q.trim()
    ? allCategories.filter((c) =>
        c.title.toLowerCase().includes(q.toLowerCase()) ||
        c.description.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  const handleSelect = (cat: typeof allCategories[0]) => {
    addRecent({ id: cat.id, title: cat.title, description: cat.description, href: cat.href, category: cat.title, color: cat.color });
    navigate(cat.href);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-16 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -16, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for a tool (e.g., Mortgage, BMI, Tip...)"
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
            data-testid="input-search-overlay"
          />
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {q.trim() === "" ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              <Search className="w-7 h-7 mx-auto mb-2 opacity-30" />
              <p>Type to search 200+ tools</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">No results found for "{q}"</div>
          ) : (
            filtered.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
              >
                <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center shrink-0`}>
                  <cat.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{cat.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{cat.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function DesktopHome() {
  const [showSearch, setShowSearch] = useState(false);
  const [, navigate] = useLocation();
  const { recent, addRecent } = useRecent();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const recentRef = useRef<HTMLDivElement>(null);

  const scrollRecent = (dir: "left" | "right") => {
    recentRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  const handleCatClick = (cat: typeof allCategories[0]) => {
    addRecent({ id: cat.id, title: cat.title, description: cat.description, href: cat.href, category: cat.title, color: cat.color });
    navigate(cat.href);
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/50 px-8 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => setShowSearch(true)}
            data-testid="button-search-desktop"
            className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-card hover:bg-muted rounded-xl text-sm text-muted-foreground transition-colors cursor-text border border-border"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>Search for a tool (e.g., Mortgage, BMI, Tip...)</span>
          </button>
          <button className="p-2.5 hover:bg-muted rounded-xl transition-colors" data-testid="button-notifications">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8 space-y-10">
        {/* Welcome */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-foreground">Welcome to CalcHub.</h1>
            <p className="text-muted-foreground mt-1">What are we calculating today?</p>
          </div>
          <div className="w-28 h-20 rounded-2xl overflow-hidden opacity-80 shrink-0 hidden lg:block">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-emerald-400/20 to-blue-400/20 flex items-center justify-center">
              <Calculator className="w-10 h-10 text-primary/40" />
            </div>
          </div>
        </div>

        {/* Recently Used */}
        {recent.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <h2 className="font-bold text-foreground">Recently Used</h2>
              </div>
              <div className="flex gap-1">
                <button onClick={() => scrollRecent("left")} className="p-1.5 hover:bg-muted rounded-lg transition-colors border border-border" data-testid="button-recent-left">
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => scrollRecent("right")} className="p-1.5 hover:bg-muted rounded-lg transition-colors border border-border" data-testid="button-recent-right">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div ref={recentRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
              {recent.map((item) => {
                const cat = allCategories.find((c) => c.id === item.id);
                const Icon = cat?.icon || Calculator;
                return (
                  <Link key={item.id} href={item.href}>
                    <div
                      data-testid={`card-recent-${item.id}`}
                      className="shrink-0 w-56 bg-card border border-border rounded-2xl p-5 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
                    >
                      <div className={`w-10 h-10 rounded-xl ${cat?.color || "bg-primary"} flex items-center justify-center mb-4`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="font-bold text-sm text-foreground mb-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                      <p className="text-xs text-muted-foreground/60 italic">{timeAgo(item.visitedAt)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Pinned Favorites */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <h2 className="font-bold text-foreground">Pinned Favorites</h2>
            </div>
            <Link href="/favorites">
              <span className="text-sm text-primary hover:underline cursor-pointer" data-testid="link-manage-favorites">
                Manage Favorites
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((item) => {
              const cat = allCategories.find((c) => c.id === item.id);
              const Icon = cat?.icon || Calculator;
              return (
                <div key={item.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${cat?.color || "bg-primary"} flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground leading-tight">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.category} Tool</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(item)}
                      className="p-1 hover:bg-muted rounded-lg transition-colors shrink-0"
                      data-testid={`button-unfav-${item.id}`}
                    >
                      <Star className="w-4 h-4 fill-primary text-primary" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                  <Link href={item.href}>
                    <button
                      className="w-full py-2 text-sm font-semibold text-foreground border border-border rounded-xl hover:bg-muted transition-colors"
                      data-testid={`button-open-fav-${item.id}`}
                    >
                      Open Tool
                    </button>
                  </Link>
                </div>
              );
            })}
            <button
              onClick={() => setShowSearch(true)}
              className="bg-muted/30 border border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors min-h-[160px]"
              data-testid="button-add-favorite"
            >
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-2xl font-light leading-none">+</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium text-center">Pin more tools to your favorites</p>
              <p className="text-xs text-muted-foreground/60 text-center">Quickly access the calculators you use the most</p>
            </button>
          </div>
        </section>

        {/* All Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground">All Categories</h2>
            <Link href="/categories">
              <span className="text-sm text-primary hover:underline cursor-pointer flex items-center gap-1" data-testid="link-all-categories">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {allCategories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCatClick(cat)}
                data-testid={`card-category-${cat.id}`}
                className="bg-card border border-border rounded-2xl p-4 text-left hover:shadow-md hover:border-primary/20 transition-all group flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl ${cat.color} flex items-center justify-center`}>
                    <cat.icon className="w-4 h-4 text-white" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite({ id: cat.id, title: cat.title, description: cat.description, href: cat.href, category: cat.title, color: cat.color });
                    }}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    data-testid={`button-fav-${cat.id}`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFavorite(cat.id) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{cat.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{cat.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [hasCalculated, setHasCalculated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const historyMutation = useAddToHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { title: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Sizes", icon: Shirt, color: "bg-violet-500", href: "/size-converter" },
    { title: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Numbers", icon: Hash, color: "bg-teal-500", href: "/numbers" },
    { title: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "Education", icon: GraduationCap, color: "bg-blue-600", href: "/education" },
    { title: "Medical", icon: Stethoscope, color: "bg-red-500", href: "/medical" },
    { title: "Lifestyle", icon: HomeIcon, color: "bg-lime-500", href: "/lifestyle" },
    { title: "Automobile", icon: Car, color: "bg-slate-500", href: "/automobile" },
    { title: "Agriculture", icon: Leaf, color: "bg-green-600", href: "/agriculture" },
    { title: "Developer", icon: Code, color: "bg-gray-600", href: "/developer" },
    { title: "E-Commerce", icon: ShoppingCart, color: "bg-fuchsia-500", href: "/ecommerce" },
    { title: "Environment", icon: Globe, color: "bg-emerald-600", href: "/environment" },
    { title: "Smart Life", icon: ShoppingBag, color: "bg-indigo-500", href: "/smart-life" },
    { title: "Color Tools", icon: Palette, color: "bg-fuchsia-500", href: "/color-tools" },
    { title: "Population", icon: Users, color: "bg-rose-500", href: "/population" },
    { title: "Development", icon: BarChart3, color: "bg-amber-500", href: "/development" },
    { title: "Designer", icon: Proportions, color: "bg-pink-500", href: "/designer" },
    { title: "AI Tools", icon: MessageSquare, color: "bg-violet-500", href: "/ai-tools" },
    { title: "Notes", icon: StickyNote, color: "bg-yellow-500", href: "/notes" },
  ];

  const formatDisplay = (val: string) => {
    if (!val || val === "Error") return val;
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    if (!Number.isFinite(num)) return val;
    if (val.includes(".") && val.endsWith(".")) return val;
    const parts = val.split(".");
    const intPart = parseInt(parts[0]).toLocaleString("en-US");
    if (parts.length > 1) return intPart + "." + parts[1];
    return intPart;
  };

  const formatExpression = (expr: string) => {
    return expr
      .replace(/\*/g, " \u00D7 ")
      .replace(/\//g, " \u00F7 ")
      .replace(/\+/g, " + ")
      .replace(/(?<=\d)-/g, " - ");
  };

  const liveEvaluate = useCallback((expr: string) => {
    if (!expr) {
      setResult("0");
      return;
    }
    try {
      const evalResult = evaluate(expr).toString();
      setResult(evalResult);
    } catch {
    }
  }, []);

  const handlePress = useCallback((key: string) => {
    if (key === "AC") {
      setExpression("");
      setResult("0");
      setHasCalculated(false);
      return;
    }

    if (key === "C") {
      setExpression((prev) => {
        const next = prev.slice(0, -1);
        if (next.length === 0) {
          setResult("0");
        } else {
          liveEvaluate(next);
        }
        return next;
      });
      setHasCalculated(false);
      return;
    }

    if (key === "00") {
      if (!expression) return;
      const newExpr = expression + "00";
      setExpression(newExpr);
      liveEvaluate(newExpr);
      setHasCalculated(false);
      return;
    }

    const operators = ["+", "-", "*", "/"];

    if (operators.includes(key) && expression) {
      try {
        const evalResult = evaluate(expression).toString();
        setResult(evalResult);
        setHasCalculated(false);
        historyMutation.mutate({
          expression,
          result: evalResult,
          category: "Calculator"
        });
      } catch {
      }
      const newExpr = expression + key;
      setExpression(newExpr);
      return;
    }

    if (hasCalculated && !operators.includes(key)) {
      setExpression(key);
      setResult("0");
      setHasCalculated(false);
      liveEvaluate(key);
      return;
    }

    setHasCalculated(false);
    const newExpr = expression + key;
    setExpression(newExpr);
    liveEvaluate(newExpr);
  }, [expression, historyMutation, hasCalculated, liveEvaluate]);

  const buttons = [
    { label: "AC", value: "AC", variant: "function" },
    { label: "(", value: "(", variant: "paren" },
    { label: ")", value: ")", variant: "paren" },
    { label: "\u00F7", value: "/", variant: "operator" },
    { label: "7", value: "7", variant: "number" },
    { label: "8", value: "8", variant: "number" },
    { label: "9", value: "9", variant: "number" },
    { label: "\u00D7", value: "*", variant: "operator" },
    { label: "4", value: "4", variant: "number" },
    { label: "5", value: "5", variant: "number" },
    { label: "6", value: "6", variant: "number" },
    { label: "\u2212", value: "-", variant: "operator" },
    { label: "1", value: "1", variant: "number" },
    { label: "2", value: "2", variant: "number" },
    { label: "3", value: "3", variant: "number" },
    { label: "+", value: "+", variant: "operator" },
    { label: "0", value: "0", variant: "number" },
    { label: ".", value: ".", variant: "number" },
    { label: "DEL", value: "C", variant: "delete" },
    { label: "00", value: "00", variant: "number" },
  ];

  const getButtonClass = (variant: string) => {
    switch (variant) {
      case "function":
        return "bg-[#f0f3f8] dark:bg-slate-700 text-red-500 dark:text-red-400 font-bold";
      case "paren":
        return "bg-[#f0f3f8] dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium";
      case "operator":
        return "bg-[#f0f3f8] dark:bg-slate-700 text-orange-500 dark:text-orange-400 font-bold";
      case "delete":
        return "bg-[#f0f3f8] dark:bg-slate-700 text-slate-500 dark:text-slate-400";
      default:
        return "bg-[#f0f3f8] dark:bg-slate-700 text-slate-800 dark:text-white font-semibold";
    }
  };

  const filteredCategories = searchQuery.trim()
    ? categories.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  return (
    <>
      {/* Desktop view — only shown on md+ */}
      <div className="hidden md:block h-full">
        <DesktopHome />
      </div>

      {/* Mobile view — completely unchanged, only shown below md */}
      <div className="flex flex-col h-full bg-[#f5f7fb] dark:bg-background overflow-y-auto md:hidden">
        <div className="px-4 pt-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 300+ specialist tools..."
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-card border border-transparent dark:border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm shadow-sm"
              data-testid="input-search-tools"
            />
          </div>

          <Link href="/categories">
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-card rounded-2xl px-4 py-3.5 flex items-center justify-between cursor-pointer shadow-sm"
              data-testid="card-all-categories"
            >
              <div className="flex items-center gap-3">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-3 h-3 rounded-sm bg-blue-500" />
                  <div className="w-3 h-3 rounded-sm bg-blue-500" />
                  <div className="w-3 h-3 rounded-sm bg-blue-500" />
                  <div className="w-3 h-3 rounded-sm bg-blue-500" />
                </div>
                <span className="text-base font-bold text-foreground">All Categories</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </Link>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
            {filteredCategories.map((cat) => (
              <Link key={cat.title} href={cat.href}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-card rounded-2xl whitespace-nowrap cursor-pointer shadow-sm"
                  data-testid={`quick-cat-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className={`w-7 h-7 rounded-lg ${cat.color} flex items-center justify-center`}>
                    <cat.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{cat.title}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex-1 px-4 py-3 flex flex-col">
          <div className="bg-white dark:bg-card rounded-3xl p-5 flex-1 flex flex-col shadow-sm">
            <div className="text-right pr-2 flex flex-col justify-end mb-3" style={{ minHeight: "78px" }}>
              <p className="text-3xl font-black text-slate-800 dark:text-white overflow-x-auto scrollbar-hide whitespace-nowrap tracking-tight" data-testid="display-result">
                {expression ? formatExpression(expression) : "0"}
              </p>
              <p className="text-base text-blue-500 dark:text-blue-400 mt-1.5 font-semibold h-6">
                {(result !== "0" && expression) ? `= ${formatDisplay(result)}` : ""}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {buttons.map((btn, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handlePress(btn.value)}
                  data-testid={`button-calc-${btn.value}`}
                  className={`rounded-2xl text-xl flex items-center justify-center transition-all aspect-[1.35/1] ${getButtonClass(btn.variant)}`}
                >
                  {btn.variant === "delete" ? (
                    <Delete className="w-5 h-5" />
                  ) : (
                    <span>{btn.label}</span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
