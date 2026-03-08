import { ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronRight, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  if (isDesktop) {
    return (
      <div className="flex flex-col h-full bg-background overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2 text-sm">
          <Link href="/">
            <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors" data-testid="breadcrumb-home">Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
          <span className="text-foreground font-medium">{title}</span>
        </div>

        <div className="px-6 pt-5 pb-4">
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>

        {tools && tools.length > 0 && onToolChange && (
          <div className="px-6 pb-4">
            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
              {tools.map((tool) => {
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => onToolChange(tool.id)}
                    data-testid={`tab-${tool.id}`}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                      isActive
                        ? `${accentColor} text-white`
                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
                    }`}
                  >
                    <tool.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 pb-8">
          <div className="max-w-3xl">
            {children}
          </div>
        </div>
      </div>
    );
  }

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
