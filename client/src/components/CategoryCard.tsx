import { LucideIcon } from "lucide-react";
import { Link } from "wouter";

interface CategoryCardProps {
  title: string;
  subtitle: string;
  count: number;
  icon: LucideIcon;
  colorClass: string; // e.g., "bg-emerald-500"
  href: string;
}

export function CategoryCard({ title, subtitle, count, icon: Icon, colorClass, href }: CategoryCardProps) {
  return (
    <Link href={href}>
      <div className="group relative bg-card hover:bg-card/80 border border-border/50 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 active:scale-95 active:shadow-none overflow-hidden">
        {/* Hover Gradient Overlay */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${colorClass.replace('bg-', 'bg-gradient-to-br from-')} to-transparent`} />

        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-xl ${colorClass} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            {/* The icon itself takes the color text class based on the background */}
            <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
          </div>
          <span className="bg-background/50 border border-white/5 text-xs font-semibold px-2.5 py-1 rounded-full text-muted-foreground group-hover:text-foreground transition-colors">
            {count}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-foreground mb-1 font-display group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}
