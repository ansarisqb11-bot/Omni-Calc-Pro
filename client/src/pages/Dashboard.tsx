import { Search, Wallet, Calculator, Heart, Compass, Activity, Banknote, Percent } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { RecentToolCard } from "@/components/RecentToolCard";
import { motion } from "framer-motion";

export default function Dashboard() {
  const categories = [
    { title: "Finance", subtitle: "Loans, Interest, ROI", count: 42, icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Math & Algebra", subtitle: "Algebra, Geometry", count: 38, icon: Calculator, color: "bg-orange-500", href: "/calculator" },
    { title: "Health & Fitness", subtitle: "BMI, BMR, Macros", count: 15, icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Engineering", subtitle: "Concrete, Tiles, Beam", count: 27, icon: Compass, color: "bg-amber-500", href: "/units" },
    { title: "Date & Time", subtitle: "Age, Duration, Zones", count: 12, icon: Activity, color: "bg-purple-500", href: "/date-time" },
    { title: "Unit Converters", subtitle: "Length, Mass, Speed", count: 54, icon: Ruler, color: "bg-blue-500", href: "/units" },
  ];

  const recentTools = [
    { title: "BMI Calc", subtitle: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Loan EMI", subtitle: "Finance", icon: Banknote, color: "bg-emerald-500", href: "/finance" },
    { title: "Tip Calc", subtitle: "Everyday", icon: Percent, color: "bg-orange-500", href: "/calculator" },
    { title: "Age Calc", subtitle: "Date", icon: Activity, color: "bg-purple-500", href: "/date-time" },
  ];

  return (
    <div className="flex flex-col h-full bg-background md:bg-transparent">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
        <div className="p-6 space-y-8 max-w-5xl mx-auto w-full">
          
          {/* Header Section */}
          <section className="space-y-6 pt-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Good Morning, User
              </h1>
              <p className="text-muted-foreground text-lg">
                What would you like to calculate today?
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm group-hover:shadow-md"
                placeholder="Search 300+ calculators..."
              />
            </div>
          </section>

          {/* Recently Used */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recently Used</h2>
              <button className="text-sm text-primary hover:text-primary/80 font-medium">Clear</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
              {recentTools.map((tool, i) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <RecentToolCard {...tool} iconColor={tool.color} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* All Categories */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">All Categories</h2>
              <button className="text-sm text-primary hover:text-primary/80 font-medium">Sort A-Z</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CategoryCard colorClass={cat.color} {...cat} />
                </motion.div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// Icon import helper
import { Ruler } from "lucide-react";
