import { LucideIcon } from "lucide-react";
import { Link } from "wouter";

interface RecentToolCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  href: string;
}

export function RecentToolCard({ title, subtitle, icon: Icon, iconColor, href }: RecentToolCardProps) {
  return (
    <Link href={href}>
      <div className="min-w-[140px] md:min-w-[160px] p-4 rounded-2xl bg-card border border-border/50 hover:border-border transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
        <div className={`w-10 h-10 rounded-full ${iconColor} bg-opacity-20 flex items-center justify-center mb-3`}>
          <Icon className={`w-5 h-5 ${iconColor.replace('bg-', 'text-')}`} />
        </div>
        <h4 className="font-semibold text-foreground text-sm font-display mb-0.5">{title}</h4>
        <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
      </div>
    </Link>
  );
}
