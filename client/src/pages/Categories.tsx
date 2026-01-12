import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Search, ArrowLeft, Wallet, Calculator, Heart, Compass,
  Clock, Ruler, MessageSquare, StickyNote, Binary, FlaskConical,
  HardHat, Plane, Grid3X3, ChevronRight, Hash
} from "lucide-react";

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allTools = [
    { title: "EMI Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Mortgage Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Compound Interest", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Tip Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "ROI Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "SIP Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "GST Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Salary Converter", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Discount Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Currency Converter", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Tax Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Loan Amortization", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Basic Calculator", category: "Calculator", icon: Calculator, color: "bg-blue-500", href: "/calculator" },
    { title: "Scientific Calculator", category: "Calculator", icon: Calculator, color: "bg-blue-500", href: "/calculator" },
    { title: "Percentage Calculator", category: "Calculator", icon: Calculator, color: "bg-blue-500", href: "/calculator" },
    { title: "Programmer Calculator", category: "Calculator", icon: Calculator, color: "bg-blue-500", href: "/calculator" },
    { title: "Billion/Million Converter", category: "Numbers", icon: Hash, color: "bg-teal-500", href: "/numbers" },
    { title: "Crore/Lakh Converter", category: "Numbers", icon: Hash, color: "bg-teal-500", href: "/numbers" },
    { title: "US to Indian Numbers", category: "Numbers", icon: Hash, color: "bg-teal-500", href: "/numbers" },
    { title: "Number to Words", category: "Numbers", icon: Hash, color: "bg-teal-500", href: "/numbers" },
    { title: "BMI Calculator", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "BMR Calculator", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Calorie Calculator", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Water Intake", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Body Fat Calculator", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Sleep Cycle", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Cooking Converter", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Pregnancy Calculator", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Ideal Weight", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Length Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Weight Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Temperature Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Volume Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Area Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Speed Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Pressure Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Energy Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Data Storage Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Time Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Frequency Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Fuel Economy", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Age Calculator", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Date Difference", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Stopwatch", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Countdown Timer", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "World Clock", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Time Zone Converter", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Pomodoro Timer", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Work Days Calculator", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Prime Checker", category: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "LCM/HCF Calculator", category: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Random Generator", category: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Factorial Calculator", category: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Percentage Change", category: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Fibonacci Generator", category: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Quadratic Solver", category: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Circle Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Rectangle Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Triangle Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Cube Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Cylinder Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Sphere Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Cone Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Pythagorean Theorem", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Ohm's Law Calculator", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Molar Mass Calculator", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Motion Equations", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Temperature Converter", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Density Calculator", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Force Calculator", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Power Calculator", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Wavelength Calculator", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Cement Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Paint Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Tile Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Steel Bar Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Concrete Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Brick Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Flooring Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Roofing Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Fuel Cost Calculator", category: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "Flight Time Calculator", category: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "Mileage Calculator", category: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "Clothing Size Converter", category: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "Shoe Size Converter", category: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "Tip Calculator", category: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "Currency Converter", category: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "AI Calculator", category: "AI Tools", icon: MessageSquare, color: "bg-violet-500", href: "/ai-tools" },
    { title: "AI Image Generator", category: "AI Tools", icon: MessageSquare, color: "bg-violet-500", href: "/ai-tools" },
    { title: "AI Chat Assistant", category: "AI Tools", icon: MessageSquare, color: "bg-violet-500", href: "/ai-tools" },
  ];

  const categories = [
    { title: "All Tools", icon: Grid3X3, color: "bg-primary", count: allTools.length },
    { title: "Finance", icon: Wallet, color: "bg-emerald-500", count: allTools.filter(t => t.category === "Finance").length, href: "/finance" },
    { title: "Calculator", icon: Calculator, color: "bg-blue-500", count: allTools.filter(t => t.category === "Calculator").length, href: "/calculator" },
    { title: "Numbers", icon: Hash, color: "bg-teal-500", count: allTools.filter(t => t.category === "Numbers").length, href: "/numbers" },
    { title: "Health", icon: Heart, color: "bg-pink-500", count: allTools.filter(t => t.category === "Health").length, href: "/health" },
    { title: "Units", icon: Ruler, color: "bg-amber-500", count: allTools.filter(t => t.category === "Units").length, href: "/units" },
    { title: "Date/Time", icon: Clock, color: "bg-purple-500", count: allTools.filter(t => t.category === "Date/Time").length, href: "/date-time" },
    { title: "Math", icon: Binary, color: "bg-indigo-500", count: allTools.filter(t => t.category === "Math").length, href: "/math" },
    { title: "Geometry", icon: Compass, color: "bg-cyan-500", count: allTools.filter(t => t.category === "Geometry").length, href: "/geometry" },
    { title: "Science", icon: FlaskConical, color: "bg-rose-500", count: allTools.filter(t => t.category === "Science").length, href: "/science" },
    { title: "Construction", icon: HardHat, color: "bg-orange-500", count: allTools.filter(t => t.category === "Construction").length, href: "/construction" },
    { title: "Travel", icon: Plane, color: "bg-sky-500", count: allTools.filter(t => t.category === "Travel").length, href: "/travel" },
    { title: "AI Tools", icon: MessageSquare, color: "bg-violet-500", count: allTools.filter(t => t.category === "AI Tools").length, href: "/ai-tools" },
    { title: "Notes", icon: StickyNote, color: "bg-yellow-500", count: 0, href: "/notes" },
  ];

  const filteredTools = allTools.filter((tool) => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || activeCategory === "All Tools" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-background sticky top-0 z-10">
        <Link href="/">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors" data-testid="button-back">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Grid3X3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">All Categories</h1>
            <p className="text-xs text-muted-foreground">{allTools.length}+ tools available</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all tools..."
            className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            data-testid="input-search-categories"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat.title}
              onClick={() => setActiveCategory(cat.title === activeCategory ? null : cat.title)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                activeCategory === cat.title
                  ? `${cat.color} text-white`
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`filter-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.title}
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                activeCategory === cat.title ? "bg-white/20" : "bg-background"
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tools List */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="space-y-2">
          {filteredTools.map((tool, i) => (
            <Link key={`${tool.title}-${i}`} href={tool.href}>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.01 }}
                className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:bg-muted transition-all flex items-center justify-between group"
                data-testid={`tool-${tool.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${tool.color} flex items-center justify-center`}>
                    <tool.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">{tool.title}</h3>
                    <p className="text-xs text-muted-foreground">{tool.category}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </motion.div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No tools found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
