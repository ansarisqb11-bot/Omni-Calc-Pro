import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertHistory, type HistoryItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useHistory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: [api.history.list.path],
    queryFn: async () => {
      const res = await fetch(api.history.list.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.history.list.responses[200].parse(await res.json());
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertHistory) => {
      const res = await fetch(api.history.create.path, {
        method: api.history.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save history");
      return api.history.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.history.list.path] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(api.history.clear.path, {
        method: api.history.clear.method,
      });
      if (!res.ok) throw new Error("Failed to clear history");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.history.list.path] });
      toast({ title: "History Cleared", description: "All calculations have been removed." });
    },
  });

  return {
    history: query.data ?? [],
    isLoading: query.isLoading,
    addHistory: createMutation.mutate,
    clearHistory: clearMutation.mutate,
  };
}
