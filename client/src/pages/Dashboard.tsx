import { Link } from "wouter";
import { 
  Calculator, 
  Coins, 
  Ruler, 
  Calendar, 
  BrainCircuit, 
  StickyNote, 
  Activity, 
  Shapes,
  ArrowRight,
  Search
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const TOOLS = [
  { id: "calc", name: "Calculator", desc: "Basic, Scientific, Programmer", icon: Calculator, href: "/calculator", color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "finance", name: "Finance", desc: "Loan, EMI, Currency, ROI", icon: Coins, href: "/finance", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: "units", name: "Converter", desc: "Length, Weight, Volume, Temp", icon: Ruler, href: "/units", color: "text-amber-400", bg: "bg-amber-400/10" },
  { id: "date", name: "Date & Time", desc: "Age, Diff, Stopwatch", icon: Calendar, href: "/date-time", color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: "ai", name: "AI Tools", desc: "Ask questions, get explanations", icon: BrainCircuit, href: "/ai-tools", color: "text-pink-400", bg: "bg-pink-400/10" },
  { id: "notes", name: "Notes", desc: "Save calculations & ideas", icon: StickyNote, href: "/notes", color: "text-yellow-200", bg: "bg-yellow-400/10" },
  { id: "health", name: "Health", desc: "BMI, Calories, Water", icon: Activity, href: "/calculator", color: "text-teal-400", bg: "bg-teal-400/10" },
  { id: "geometry", name: "Geometry", desc: "Area, Volume, Angles", icon: Shapes, href: "/calculator", color: "text-red-400", bg: "bg-red-400/10" },
];

export default function Dashboard() {
  const [search, setSearch] = useState("");

  const filteredTools = TOOLS.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative py-12 px-6 rounded-3xl bg-gradient-to-br from-primary/20 via-background to-background border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
            What do you want to <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-300">calculate</span>?
          </h1>
          <p className="text-muted-foreground text-lg mb-8">Access 300+ professional tools for engineering, finance, and daily life.</p>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text"
              placeholder="Search for tools like 'EMI', 'BMI', or 'Scientific'..."
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-background/50 border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-lg backdrop-blur-md shadow-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTools.map((tool) => (
          <Link key={tool.id} href={tool.href}>
            <motion.div 
              whileHover={{ y: -4 }}
              className="group cursor-pointer p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors shadow-lg shadow-black/5"
            >
              <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <h3 className="text-lg font-bold font-display mb-1 text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
              <p className="text-sm text-muted-foreground">{tool.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Quick Access / Recents */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold">Recommended for you</h2>
          <button className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['GST Calculator', 'Age Calculator', 'Currency Converter', 'Discount'].map((item) => (
            <div key={item} className="p-4 rounded-xl bg-muted/30 border border-white/5 hover:bg-muted/50 transition-colors cursor-pointer">
              <span className="font-medium text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
