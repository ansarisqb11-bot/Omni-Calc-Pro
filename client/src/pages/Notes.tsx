import { useState } from "react";
import { useNotes, useCreateNote, useDeleteNote } from "@/hooks/use-notes";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Search, 
  FileText, 
  Calendar 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function Notes() {
  const { data: notes, isLoading } = useNotes();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "", category: "General" });

  const filteredNotes = notes?.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) || 
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!newNote.title || !newNote.content) return;
    await createNote.mutateAsync(newNote);
    setIsOpen(false);
    setNewNote({ title: "", content: "", category: "General" });
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Notes</h1>
          <p className="text-muted-foreground">Save your calculations and thoughts.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                <Plus className="w-4 h-4" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
                <Textarea
                  placeholder="Write your note here..."
                  className="min-h-[150px]"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
                <Button onClick={handleCreate} disabled={createNote.isPending} className="w-full">
                  {createNote.isPending ? "Creating..." : "Save Note"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted/20 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          <AnimatePresence>
            {filteredNotes?.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-card hover:bg-muted/30 border border-border/50 rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteNote.mutate(note.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <h3 className="text-xl font-bold font-display mb-2 line-clamp-1">{note.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-4 flex-1 mb-4 leading-relaxed">
                  {note.content}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border/30">
                  <Calendar className="w-3 h-3" />
                  {note.createdAt && format(new Date(note.createdAt), 'MMM d, yyyy')}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredNotes?.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              <div className="inline-block p-4 rounded-full bg-muted mb-4">
                <FileText className="w-8 h-8 opacity-50" />
              </div>
              <p>No notes found. Create one to get started!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
