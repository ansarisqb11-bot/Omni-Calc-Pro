import { useHistory, useClearHistory } from "@/hooks/use-history";
import { History, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export function HistorySidebar() {
  const { data: history, isLoading } = useHistory();
  const clearHistory = useClearHistory();

  return (
    <div className="w-80 h-screen border-l border-border bg-card flex flex-col fixed right-0 top-0 hidden xl:flex z-40">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <h2 className="font-display font-bold text-lg">History</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => clearHistory.mutate()}
          className="hover:bg-destructive/10 hover:text-destructive"
          title="Clear History"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : history?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Clock className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm">No calculations yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {history?.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-background border border-border/50 rounded-xl p-3 hover:border-primary/30 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {item.createdAt && format(new Date(item.createdAt), 'HH:mm')}
                    </span>
                  </div>
                  <div className="text-sm font-mono text-muted-foreground mb-1 truncate" title={item.expression}>
                    {item.expression}
                  </div>
                  <div className="text-lg font-bold font-mono text-primary truncate" title={item.result}>
                    = {item.result}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
