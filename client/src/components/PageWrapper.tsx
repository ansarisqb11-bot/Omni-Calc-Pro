import { ReactNode, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, LucideIcon } from "lucide-react";

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

  useEffect(() => {
    window.scrollTo(0, 0);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTool]);

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
