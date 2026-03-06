import { ArrowLeft, History, Trash2, Calculator } from "lucide-react";
import { motion } from "framer-motion";
import { useHistory, useClearHistory } from "@/hooks/use-history";
import { format } from "date-fns";

export default function HistoryPage() {
  const { data: history = [], isLoading } = useHistory();
  const clearMutation = useClearHistory();

  const grouped = history.reduce((acc: Record<string, typeof history>, item) => {
    const date = item.createdAt
      ? format(new Date(item.createdAt), "MMM d, yyyy")
      : "Today";
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-full bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="font-bold text-lg text-foreground flex items-center gap-2">
              <History className="w-5 h-5 text-muted-foreground" />
              History
            </h1>
            <p className="text-xs text-muted-foreground">{history.length} calculations</p>
          </div>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => clearMutation.mutate()}
            disabled={clearMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            data-testid="button-clear-history"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No history yet</h2>
            <p className="text-muted-foreground">Your calculations will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, items]) => (
              <div key={date}>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{date}</p>
                <div className="space-y-2">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-card border border-border/50 rounded-xl px-4 py-3.5 flex items-center justify-between"
                      data-testid={`history-item-${item.id}`}
                    >
                      <div>
                        <p className="text-sm text-muted-foreground font-mono">{item.expression}</p>
                        <p className="text-base font-bold text-foreground mt-0.5">= {item.result}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-lg font-medium">
                          {item.category || "Calculator"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
