import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Search, ArrowLeft, Wallet, Calculator, Heart, Compass,
  Clock, Ruler, MessageSquare, StickyNote, Banknote, Percent, Scale, Flame
} from "lucide-react";

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState("");

  const recentTools = [
    { title: "BMI", subtitle: "Health", icon: Scale, color: "bg-pink-500", href: "/health" },
    { title: "Loan EMI", subtitle: "Finance", icon: Banknote, color: "bg-emerald-500", href: "/finance" },
    { title: "Tip Calc", subtitle: "Everyday", icon: Percent, color: "bg-orange-500", href: "/finance" },
    { title: "Stopwatch", subtitle: "Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
  ];

  const categories = [
    { 
      title: "Finance", 
      subtitle: "EMI, Interest, Tips, ROI", 
      count: 12, 
      icon: Wallet, 
      color: "bg-emerald-500", 
      href: "/finance" 
    },
    { 
      title: "Calculator", 
      subtitle: "Basic, Scientific, Percentage", 
      count: 8, 
      icon: Calculator, 
      color: "bg-blue-500", 
      href: "/calculator" 
    },
    { 
      title: "Health & Fitness", 
      subtitle: "BMI, BMR, Calories, Water", 
      count: 10, 
      icon: Heart, 
      color: "bg-pink-500", 
      href: "/health" 
    },
    { 
      title: "Unit Converter", 
      subtitle: "Length, Weight, Temp, Speed", 
      count: 30, 
      icon: Ruler, 
      color: "bg-amber-500", 
      href: "/units" 
    },
    { 
      title: "Date & Time", 
      subtitle: "Age, Stopwatch, Countdown", 
      count: 8, 
      icon: Clock, 
      color: "bg-purple-500", 
      href: "/date-time" 
    },
    { 
      title: "AI Assistant", 
      subtitle: "Smart calculations", 
      count: 1, 
      icon: MessageSquare, 
      color: "bg-violet-500", 
      href: "/ai-tools" 
    },
    { 
      title: "Notes", 
      subtitle: "Save your calculations", 
      count: 0, 
      icon: StickyNote, 
      color: "bg-yellow-500", 
      href: "/notes" 
    },
  ];

  const filteredCategories = categories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800">
        <Link href="/">
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors" data-testid="button-back">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
        </Link>
        <h1 className="text-xl font-bold text-white">All Tools</h1>
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            data-testid="input-search-categories"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {/* Recently Used */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            Recently Used
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {recentTools.map((tool, i) => (
              <Link key={tool.title} href={tool.href}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex-shrink-0 w-24 p-4 bg-slate-800/50 border border-slate-700/30 rounded-2xl flex flex-col items-center gap-2 cursor-pointer hover:bg-slate-700/50 transition-all"
                  data-testid={`recent-tool-${tool.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className={`w-12 h-12 rounded-xl ${tool.color} bg-opacity-20 flex items-center justify-center`}>
                    <tool.icon className={`w-6 h-6 ${tool.color.replace("bg-", "text-")}`} />
                  </div>
                  <div className="text-center">
                    <div className="text-white text-sm font-medium">{tool.title}</div>
                    <div className="text-slate-500 text-xs">{tool.subtitle}</div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* All Categories */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              All Categories
            </h2>
            <span className="text-xs text-slate-500">{filteredCategories.length} categories</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredCategories.map((cat, i) => (
              <Link key={cat.title} href={cat.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 bg-slate-800/50 border border-slate-700/30 rounded-2xl cursor-pointer hover:bg-slate-700/50 hover:border-slate-600/50 transition-all group"
                  data-testid={`category-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${cat.color} bg-opacity-20 flex items-center justify-center shrink-0`}>
                      <cat.icon className={`w-6 h-6 ${cat.color.replace("bg-", "text-")}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-white font-semibold group-hover:text-primary transition-colors truncate">
                          {cat.title}
                        </h3>
                        <span className="text-xs font-medium text-slate-500 bg-slate-900/50 px-2 py-1 rounded-full shrink-0">
                          {cat.count}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm mt-0.5 truncate">{cat.subtitle}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
