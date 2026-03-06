import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { evaluate } from "mathjs";
import { motion } from "framer-motion";
import {
  Search, Delete, ChevronRight, ChevronLeft, Star, Clock,
  Wallet, Heart, Ruler, Calendar, MessageSquare, StickyNote, Hash,
  FlaskConical, HardHat, Plane, GraduationCap, Stethoscope, Home as HomeIcon,
  Car, Leaf, Code, ShoppingCart, Globe, ShoppingBag, Palette, Shirt,
  Users, BarChart3, Proportions, Calculator, Binary, Compass, Bell, X
} from "lucide-react";
import { useAddToHistory } from "@/hooks/use-history";
import { useFavorites, useRecent, type FavoriteItem } from "@/hooks/use-favorites";

const categories = [
  { id: "calculator", title: "Calculator", description: "Basic & scientific calculations", icon: Calculator, color: "bg-blue-500", href: "/calculator" },
  { id: "finance", title: "Finance", description: "EMI, SIP, loans & budgeting", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
  { id: "health", title: "Health", description: "BMI, calories & fitness tools", icon: Heart, color: "bg-pink-500", href: "/health" },
  { id: "units", title: "Unit Converter", description: "Length, weight, temperature & more", icon: Ruler, color: "bg-amber-500", href: "/units" },
  { id: "date-time", title: "Date & Time", description: "Age, days between, countdowns", icon: Calendar, color: "bg-purple-500", href: "/date-time" },
  { id: "math", title: "Math Tools", description: "Algebra, statistics, fractions", icon: Binary, color: "bg-indigo-500", href: "/math" },
  { id: "numbers", title: "Number Converter", description: "Crore, lakh, roman, fibonacci", icon: Hash, color: "bg-teal-500", href: "/numbers" },
  { id: "geometry", title: "Geometry", description: "Area, volume, perimeter", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
  { id: "science", title: "Science", description: "Physics, chemistry, conversions", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
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
  { id: "smart-life", title: "Smart Life", description: "Sleep, productivity, budget", icon: ShoppingBag, color: "bg-indigo-400", href: "/smart-life" },
  { id: "size-converter", title: "Sizes", description: "Clothing, shoes, international sizes", icon: Shirt, color: "bg-violet-500", href: "/size-converter" },
  { id: "color-tools", title: "Color Tools", description: "HEX, RGB, HSL converters", icon: Palette, color: "bg-fuchsia-400", href: "/color-tools" },
  { id: "population", title: "Population", description: "Demographics, world statistics", icon: Users, color: "bg-rose-400", href: "/population" },
  { id: "development", title: "Development", description: "Project, finance, growth metrics", icon: BarChart3, color: "bg-amber-400", href: "/development" },
  { id: "designer", title: "Designer", description: "Ratios, typography, layout tools", icon: Proportions, color: "bg-pink-500", href: "/designer" },
  { id: "ai-tools", title: "AI Assistant", description: "Smart calculations & advice", icon: MessageSquare, color: "bg-violet-500", href: "/ai-tools" },
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
    ? categories.filter((c) =>
        c.title.toLowerCase().includes(q.toLowerCase()) ||
        c.description.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  const handleSelect = (cat: typeof categories[0]) => {
    addRecent({ id: cat.id, title: cat.title, description: cat.description, href: cat.href, category: cat.title, color: cat.color });
    navigate(cat.href);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tools, calculators..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
            data-testid="input-search-overlay"
          />
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {q.trim() === "" ? (
            <div className="py-10 text-center text-muted-foreground text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Type to search 200+ tools</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-sm">No results found for "{q}"</div>
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
                <div>
                  <p className="font-medium text-sm text-foreground">{cat.title}</p>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
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
  const recentScrollRef = useRef<HTMLDivElement>(null);

  const scrollRecent = (dir: "left" | "right") => {
    if (recentScrollRef.current) {
      recentScrollRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
    }
  };

  const handleCategoryClick = (cat: typeof categories[0]) => {
    addRecent({ id: cat.id, title: cat.title, description: cat.description, href: cat.href, category: cat.title, color: cat.color });
    navigate(cat.href);
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/50 px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => setShowSearch(true)}
            data-testid="button-search-open"
            className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-muted/60 hover:bg-muted rounded-xl text-sm text-muted-foreground transition-colors cursor-text border border-border/50"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>Search for a tool (e.g., EMI, BMI, Paint...)</span>
          </button>
          <button className="p-2.5 hover:bg-muted rounded-xl transition-colors relative" data-testid="button-notifications">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8 space-y-10">
        {/* Welcome */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome to CalcHub.</h1>
            <p className="text-muted-foreground mt-1">What are we calculating today?</p>
          </div>
          <div className="hidden lg:block w-24 h-20 opacity-30">
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-blue-500/20 rounded-2xl" />
          </div>
        </div>

        {/* Recently Used */}
        {recent.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h2 className="font-bold text-foreground">Recently Used</h2>
              </div>
              <div className="flex gap-1">
                <button onClick={() => scrollRecent("left")} className="p-1.5 hover:bg-muted rounded-lg transition-colors" data-testid="button-recent-left">
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => scrollRecent("right")} className="p-1.5 hover:bg-muted rounded-lg transition-colors" data-testid="button-recent-right">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div ref={recentScrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
              {recent.map((item) => {
                const cat = categories.find((c) => c.id === item.id);
                const Icon = cat?.icon || Calculator;
                return (
                  <Link key={item.id} href={item.href}>
                    <div
                      data-testid={`card-recent-${item.id}`}
                      className="shrink-0 w-52 bg-card border border-border/60 rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className={`w-10 h-10 rounded-xl ${cat?.color || "bg-primary"} flex items-center justify-center mb-4`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="font-semibold text-sm text-foreground mb-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                      <p className="text-xs text-muted-foreground/60 italic">{timeAgo(item.visitedAt)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Pinned Favorites */}
        {favorites.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <h2 className="font-bold text-foreground">Pinned Favorites</h2>
              </div>
              <Link href="/favorites">
                <span className="text-sm text-primary hover:underline cursor-pointer" data-testid="link-manage-favorites">Manage Favorites</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((item) => {
                const cat = categories.find((c) => c.id === item.id);
                const Icon = cat?.icon || Calculator;
                return (
                  <div key={item.id} className="bg-card border border-border/60 rounded-2xl p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl ${cat?.color || "bg-primary"} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <button
                        onClick={() => toggleFavorite(item)}
                        className="p-1 hover:bg-muted rounded-lg transition-colors"
                        data-testid={`button-unfav-${item.id}`}
                      >
                        <Star className="w-4 h-4 fill-primary text-primary" />
                      </button>
                    </div>
                    <p className="font-semibold text-sm text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 mb-4 line-clamp-2">{item.description}</p>
                    <Link href={item.href}>
                      <button
                        className="w-full text-center py-2 text-sm font-semibold text-foreground border border-border/60 rounded-xl hover:bg-muted transition-colors"
                        data-testid={`button-open-fav-${item.id}`}
                      >
                        Open Tool
                      </button>
                    </Link>
                  </div>
                );
              })}
              {favorites.length < 6 && (
                <button
                  onClick={() => setShowSearch(true)}
                  className="bg-muted/30 border border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer min-h-[140px]"
                  data-testid="button-add-favorite"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-xl font-light">+</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium text-center">Pin more tools to your favorites</p>
                </button>
              )}
            </div>
          </section>
        )}

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
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(cat)}
                data-testid={`card-category-${cat.id}`}
                className="bg-card border border-border/60 rounded-2xl p-4 text-left hover:border-primary/30 hover:shadow-md transition-all group flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center`}>
                    <cat.icon className="w-5 h-5 text-white" />
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

      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
    </div>
  );
}

function MobileHome() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const historyMutation = useAddToHistory();
  const { recent, addRecent } = useRecent();
  const [, navigate] = useLocation();

  const liveEvaluate = useCallback((expr: string) => {
    if (!expr) { setResult("0"); return; }
    try {
      setResult(evaluate(expr).toString());
    } catch { }
  }, []);

  const formatExpression = (expr: string) =>
    expr.replace(/\*/g, " × ").replace(/\//g, " ÷ ").replace(/\+/g, " + ").replace(/(?<=\d)-/g, " - ");

  const handlePress = useCallback((key: string) => {
    if (key === "AC") { setExpression(""); setResult("0"); setHasCalculated(false); return; }
    if (key === "C") {
      setExpression((prev) => {
        const next = prev.slice(0, -1);
        if (!next) setResult("0"); else liveEvaluate(next);
        return next;
      });
      setHasCalculated(false); return;
    }
    if (key === "=") {
      if (!expression) return;
      try {
        const r = evaluate(expression).toString();
        setResult(r);
        setHasCalculated(true);
        historyMutation.mutate({ expression, result: r, category: "Calculator" });
      } catch { setResult("Error"); setHasCalculated(true); }
      return;
    }
    const operators = ["+", "-", "*", "/"];
    if (operators.includes(key) && expression) {
      try {
        const r = evaluate(expression).toString();
        setResult(r);
        historyMutation.mutate({ expression, result: r, category: "Calculator" });
      } catch { }
      setExpression(expression + key); setHasCalculated(false); return;
    }
    if (hasCalculated && !operators.includes(key)) {
      setExpression(key); setResult("0"); setHasCalculated(false); liveEvaluate(key); return;
    }
    const newExpr = expression + key;
    setExpression(newExpr); liveEvaluate(newExpr); setHasCalculated(false);
  }, [expression, historyMutation, hasCalculated, liveEvaluate]);

  const buttons = [
    { label: "AC", value: "AC", cls: "text-red-500 font-bold" },
    { label: "(", value: "(", cls: "text-slate-500" },
    { label: ")", value: ")", cls: "text-slate-500" },
    { label: "÷", value: "/", cls: "text-orange-500 font-bold" },
    { label: "7", value: "7", cls: "font-semibold" },
    { label: "8", value: "8", cls: "font-semibold" },
    { label: "9", value: "9", cls: "font-semibold" },
    { label: "×", value: "*", cls: "text-orange-500 font-bold" },
    { label: "4", value: "4", cls: "font-semibold" },
    { label: "5", value: "5", cls: "font-semibold" },
    { label: "6", value: "6", cls: "font-semibold" },
    { label: "−", value: "-", cls: "text-orange-500 font-bold" },
    { label: "1", value: "1", cls: "font-semibold" },
    { label: "2", value: "2", cls: "font-semibold" },
    { label: "3", value: "3", cls: "font-semibold" },
    { label: "+", value: "+", cls: "text-orange-500 font-bold" },
    { label: "0", value: "0", cls: "font-semibold" },
    { label: ".", value: ".", cls: "" },
    { label: "DEL", value: "C", cls: "text-slate-500", isIcon: true },
    { label: "=", value: "=", cls: "bg-primary text-primary-foreground font-bold" },
  ];

  const handleCatClick = (cat: typeof categories[0]) => {
    addRecent({ id: cat.id, title: cat.title, description: cat.description, href: cat.href, category: cat.title, color: cat.color });
    navigate(cat.href);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="px-4 pt-4 pb-2 space-y-3">
        <button
          onClick={() => setShowSearch(true)}
          data-testid="button-search-mobile"
          className="w-full flex items-center gap-3 px-4 py-3 bg-card border border-border/60 rounded-2xl text-muted-foreground text-sm hover:border-primary/30 transition-colors"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span>Search 200+ tools...</span>
        </button>

        {recent.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Recently Used
            </p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
              {recent.slice(0, 5).map((item) => {
                const cat = categories.find((c) => c.id === item.id);
                const Icon = cat?.icon || Calculator;
                return (
                  <Link key={item.id} href={item.href}>
                    <div className="shrink-0 flex items-center gap-2 px-3 py-2 bg-card border border-border/50 rounded-xl">
                      <div className={`w-6 h-6 rounded-lg ${cat?.color || "bg-primary"} flex items-center justify-center`}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-foreground whitespace-nowrap">{item.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
          <Link href="/categories">
            <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-2xl cursor-pointer">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 rounded-sm bg-primary-foreground/60" />
                <div className="w-2 h-2 rounded-sm bg-primary-foreground/60" />
                <div className="w-2 h-2 rounded-sm bg-primary-foreground/60" />
                <div className="w-2 h-2 rounded-sm bg-primary-foreground/60" />
              </div>
              <span className="text-sm font-bold whitespace-nowrap">All Categories</span>
            </div>
          </Link>
          {categories.slice(0, 12).map((cat) => (
            <button key={cat.id} onClick={() => handleCatClick(cat)} data-testid={`quick-cat-${cat.id}`}
              className="shrink-0 flex items-center gap-2 px-3 py-2.5 bg-card border border-border/50 rounded-2xl">
              <div className={`w-6 h-6 rounded-lg ${cat.color} flex items-center justify-center`}>
                <cat.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground whitespace-nowrap">{cat.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pb-4">
        <div className="bg-card border border-border/60 rounded-3xl p-5 h-full flex flex-col">
          <div className="text-right mb-4 min-h-[72px] flex flex-col justify-end">
            <p className="text-3xl font-black text-foreground overflow-x-auto scrollbar-hide whitespace-nowrap">
              {expression ? formatExpression(expression) : "0"}
            </p>
            <p className="text-base text-primary mt-1 font-semibold h-6">
              {result !== "0" && expression ? `= ${result}` : ""}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {buttons.map((btn, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePress(btn.value)}
                data-testid={`button-calc-${btn.value}`}
                className={`rounded-2xl text-xl flex items-center justify-center aspect-[1.3/1] bg-muted transition-all ${btn.cls}`}
              >
                {btn.isIcon ? <Delete className="w-5 h-5" /> : <span>{btn.label}</span>}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
    </div>
  );
}

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile ? <MobileHome /> : <DesktopHome />;
}
