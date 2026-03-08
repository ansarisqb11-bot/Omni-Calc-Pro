import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { evaluate } from "mathjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Delete, ChevronRight, ChevronLeft, Bell, X, Settings,
  Wallet, Heart, Ruler, Clock, Binary, Compass, FlaskConical, HardHat,
  Plane, MessageSquare, Hash, GraduationCap, Stethoscope, Home as HomeIcon,
  Car, Leaf, Code, ShoppingCart, Globe, ShoppingBag, Palette, StickyNote, Calculator, Shirt,
  Users, BarChart3, Proportions, Star
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
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

// ── Category card metadata: dark muted banner + vivid icon ──────────────────
const CAT_META: Record<string, {
  banner: string; icon: string; badge: string; pill: string;
}> = {
  finance:          { banner: "from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900",       icon: "text-emerald-700 dark:text-emerald-400", badge: "FINANCE",     pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300" },
  "size-converter": { banner: "from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900",           icon: "text-violet-700 dark:text-violet-400",   badge: "GENERAL",     pill: "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300" },
  health:           { banner: "from-pink-50 to-rose-100 dark:from-pink-950 dark:to-pink-900",                   icon: "text-pink-600 dark:text-pink-400",        badge: "HEALTH",      pill: "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300" },
  science:          { banner: "from-rose-50 to-red-100 dark:from-rose-950 dark:to-rose-900",                    icon: "text-rose-600 dark:text-rose-400",        badge: "SCIENCE",     pill: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300" },
  units:            { banner: "from-amber-50 to-orange-100 dark:from-amber-950 dark:to-amber-900",               icon: "text-amber-600 dark:text-amber-400",      badge: "UNITS",       pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300" },
  "date-time":      { banner: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",            icon: "text-purple-700 dark:text-purple-400",    badge: "UTILITY",     pill: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300" },
  math:             { banner: "from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900",            icon: "text-indigo-700 dark:text-indigo-400",    badge: "MATH",        pill: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300" },
  numbers:          { banner: "from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900",                   icon: "text-teal-700 dark:text-teal-400",        badge: "MATH",        pill: "bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300" },
  geometry:         { banner: "from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900",                   icon: "text-cyan-600 dark:text-cyan-400",        badge: "MATH",        pill: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-300" },
  construction:     { banner: "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",            icon: "text-orange-600 dark:text-orange-400",    badge: "ENGINEERING", pill: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300" },
  travel:           { banner: "from-sky-50 to-sky-100 dark:from-sky-950 dark:to-sky-900",                       icon: "text-sky-600 dark:text-sky-400",          badge: "TRAVEL",      pill: "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300" },
  education:        { banner: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",                   icon: "text-blue-600 dark:text-blue-400",        badge: "EDUCATION",   pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300" },
  medical:          { banner: "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900",                       icon: "text-red-600 dark:text-red-400",          badge: "HEALTH",      pill: "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300" },
  lifestyle:        { banner: "from-lime-50 to-green-100 dark:from-lime-950 dark:to-lime-900",                  icon: "text-lime-600 dark:text-lime-400",        badge: "LIFESTYLE",   pill: "bg-lime-100 text-lime-700 dark:bg-lime-900/60 dark:text-lime-300" },
  automobile:       { banner: "from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950",               icon: "text-slate-600 dark:text-slate-300",      badge: "TRAVEL",      pill: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300" },
  agriculture:      { banner: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",               icon: "text-green-700 dark:text-green-400",      badge: "SCIENCE",     pill: "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300" },
  developer:        { banner: "from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950",                   icon: "text-gray-600 dark:text-gray-300",        badge: "TECH",        pill: "bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300" },
  ecommerce:        { banner: "from-fuchsia-50 to-fuchsia-100 dark:from-fuchsia-950 dark:to-fuchsia-900",        icon: "text-fuchsia-600 dark:text-fuchsia-400",  badge: "COMMERCE",    pill: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/60 dark:text-fuchsia-300" },
  environment:      { banner: "from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900",              icon: "text-emerald-600 dark:text-emerald-300",  badge: "SCIENCE",     pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300" },
  "smart-life":     { banner: "from-indigo-50 to-blue-100 dark:from-indigo-950 dark:to-indigo-900",              icon: "text-indigo-600 dark:text-indigo-300",    badge: "LIFESTYLE",   pill: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300" },
  "color-tools":    { banner: "from-fuchsia-50 to-pink-100 dark:from-fuchsia-950 dark:to-pink-900",              icon: "text-fuchsia-600 dark:text-fuchsia-300",  badge: "DESIGN",      pill: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/60 dark:text-fuchsia-300" },
  population:       { banner: "from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900",                   icon: "text-rose-600 dark:text-rose-300",        badge: "SCIENCE",     pill: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300" },
  development:      { banner: "from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900",              icon: "text-amber-600 dark:text-amber-300",      badge: "FINANCE",     pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300" },
  designer:         { banner: "from-pink-50 to-fuchsia-100 dark:from-pink-950 dark:to-fuchsia-900",              icon: "text-pink-600 dark:text-pink-300",        badge: "DESIGN",      pill: "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300" },
  "ai-tools":       { banner: "from-violet-50 to-purple-100 dark:from-violet-950 dark:to-purple-900",            icon: "text-violet-600 dark:text-violet-400",    badge: "AI",          pill: "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300" },
  notes:            { banner: "from-yellow-50 to-amber-100 dark:from-yellow-950 dark:to-yellow-900",             icon: "text-yellow-600 dark:text-yellow-400",    badge: "NOTES",       pill: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300" },
};

// Filter groups
const FILTERS = [
  { key: "All",            label: "All" },
  { key: "Finance",        label: "Finance" },
  { key: "Mathematics",    label: "Mathematics" },
  { key: "Engineering",    label: "Engineering" },
  { key: "Health & Fitness", label: "Health & Fitness" },
  { key: "Unit Converter", label: "Unit Converter" },
  { key: "Travel",         label: "Travel" },
  { key: "Education",      label: "Education" },
];

const FILTER_IDS: Record<string, string[]> = {
  "Finance":          ["finance", "ecommerce", "development"],
  "Mathematics":      ["math", "numbers", "geometry"],
  "Engineering":      ["construction", "science", "developer", "color-tools", "designer"],
  "Health & Fitness": ["health", "medical"],
  "Unit Converter":   ["units", "size-converter"],
  "Travel":           ["travel", "automobile"],
  "Education":        ["education", "lifestyle", "smart-life", "agriculture", "environment", "population", "date-time", "ai-tools", "notes"],
};

function DesktopHome() {
  const [showSearch, setShowSearch] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [, navigate] = useLocation();
  const { recent, addRecent } = useRecent();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { theme, setTheme } = useTheme();
  const recentRef = useRef<HTMLDivElement>(null);

  const cycleTheme = () => {
    const themes = ["dark", "light", "amoled"] as const;
    const i = themes.indexOf(theme as "dark" | "light" | "amoled");
    setTheme(themes[(i + 1) % 3]);
  };

  const handleCatClick = (cat: typeof allCategories[0]) => {
    addRecent({ id: cat.id, title: cat.title, description: cat.description, href: cat.href, category: cat.title, color: cat.color });
    navigate(cat.href);
  };

  const visibleCats = activeFilter === "All"
    ? allCategories
    : allCategories.filter(c => (FILTER_IDS[activeFilter] ?? []).includes(c.id));

  return (
    <div className="h-full overflow-y-auto bg-background">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border px-6 py-3 flex items-center gap-3">
        <button
          onClick={() => setShowSearch(true)}
          data-testid="button-search-desktop"
          className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors cursor-text"
        >
          <Search className="w-4 h-4 shrink-0 text-muted-foreground/60" />
          <span>Search calculators, tools, or formulas...</span>
        </button>

        <button
          className="p-2.5 hover:bg-card rounded-xl transition-colors border border-transparent hover:border-border"
          data-testid="button-notifications"
          title="Notifications"
        >
          <Bell className="w-[18px] h-[18px] text-muted-foreground" />
        </button>

        <button
          onClick={cycleTheme}
          className="p-2.5 hover:bg-card rounded-xl transition-colors border border-transparent hover:border-border"
          data-testid="button-settings"
          title="Toggle Theme"
        >
          <Settings className="w-[18px] h-[18px] text-muted-foreground" />
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          data-testid="button-live-markets"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
          Live Markets
        </button>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="px-6 py-7 space-y-7">

        {/* Heading */}
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Quick access to your most used computational tools.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              data-testid={`filter-${f.key.toLowerCase().replace(/\s+/g, "-")}`}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                activeFilter === f.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-foreground border-border hover:border-primary/40 hover:text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Tool cards grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleCats.map((cat) => {
            const meta  = CAT_META[cat.id] ?? { banner: "from-primary/10 to-primary/20 dark:from-primary/10 dark:to-primary/5", icon: "text-primary", badge: "TOOL", pill: "bg-primary/10 text-primary" };
            const faved = isFavorite(cat.id);
            return (
              <motion.div
                key={cat.id}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCatClick(cat)}
                data-testid={`card-category-${cat.id}`}
                className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:border-primary/20 transition-all group"
              >
                {/* Dark muted banner with vivid colored icon */}
                <div className={`h-36 bg-gradient-to-br ${meta.banner} flex items-center justify-center relative`}>
                  <cat.icon className={`w-12 h-12 ${meta.icon} drop-shadow-sm`} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite({ id: cat.id, title: cat.title, description: cat.description, href: cat.href, category: cat.title, color: cat.color });
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all ${
                      faved
                        ? "opacity-100 bg-black/10 dark:bg-white/10"
                        : "opacity-0 group-hover:opacity-100 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"
                    }`}
                    data-testid={`button-fav-${cat.id}`}
                  >
                    <Star className={`w-3.5 h-3.5 ${faved ? "fill-yellow-400 text-yellow-400" : "text-foreground/40"}`} />
                  </button>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <p className="font-bold text-sm text-foreground leading-snug">{cat.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 mb-3 leading-relaxed min-h-[2.5rem]">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${meta.pill}`}>
                      {meta.badge}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Recent History ───────────────────────────────────────────────── */}
        {recent.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">Recent History</h2>
              <Link href="/history">
                <span className="text-sm text-primary hover:underline cursor-pointer flex items-center gap-1" data-testid="link-view-history">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
            <div
              ref={recentRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide pb-1"
            >
              {recent.map((item) => {
                const cat = allCategories.find((c) => c.id === item.id);
                const Icon = cat?.icon || Calculator;
                const meta = CAT_META[item.id] ?? { grad: "from-primary to-primary/50", badge: "TOOL" };
                return (
                  <Link key={item.id} href={item.href}>
                    <div
                      data-testid={`card-recent-${item.id}`}
                      className="shrink-0 w-48 bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
                    >
                      <div className={`h-16 bg-gradient-to-br ${meta.grad} flex items-center justify-center`}>
                        <Icon className="w-7 h-7 text-white drop-shadow" />
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-xs text-foreground">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5 italic">{timeAgo(item.visitedAt)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
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
