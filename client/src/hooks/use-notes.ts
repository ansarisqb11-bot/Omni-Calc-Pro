import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertNote, type Note } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useNotes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: [api.notes.list.path],
    queryFn: async () => {
      const res = await fetch(api.notes.list.path);
      if (!res.ok) throw new Error("Failed to fetch notes");
      return api.notes.list.responses[200].parse(await res.json());
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertNote) => {
      const res = await fetch(api.notes.create.path, {
        method: api.notes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create note");
      return api.notes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
      toast({ title: "Note Created", description: "Your note has been saved." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.notes.delete.path, { id });
      const res = await fetch(url, {
        method: api.notes.delete.method,
      });
      if (!res.ok) throw new Error("Failed to delete note");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
      toast({ title: "Note Deleted", description: "The note has been removed." });
    },
  });

  return {
    notes: query.data ?? [],
    isLoading: query.isLoading,
    createNote: createMutation.mutate,
    isCreating: createMutation.isPending,
    deleteNote: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
