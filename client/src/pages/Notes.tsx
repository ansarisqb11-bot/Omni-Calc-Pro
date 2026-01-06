import { useNotes } from "@/hooks/use-notes";
import { Plus, Trash2, StickyNote } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

export default function Notes() {
  const { notes, createNote, deleteNote, isCreating } = useNotes();
  const [isOpen, setIsOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "", category: "General" });

  const handleCreate = () => {
    createNote(newNote, {
      onSuccess: () => {
        setIsOpen(false);
        setNewNote({ title: "", content: "", category: "General" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-display font-bold text-yellow-200">My Notes</h1>
           <p className="text-muted-foreground">Save calculations and important data.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-xl font-semibold hover:bg-yellow-400 transition-colors">
              <Plus className="w-5 h-5" /> New Note
            </button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <input
                placeholder="Title"
                className="w-full bg-muted border border-border rounded-lg p-3 outline-none focus:border-yellow-500"
                value={newNote.title}
                onChange={e => setNewNote({...newNote, title: e.target.value})}
              />
              <textarea
                placeholder="Content..."
                className="w-full bg-muted border border-border rounded-lg p-3 min-h-[150px] outline-none focus:border-yellow-500"
                value={newNote.content}
                onChange={e => setNewNote({...newNote, content: e.target.value})}
              />
              <button 
                onClick={handleCreate}
                disabled={isCreating}
                className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 disabled:opacity-50"
              >
                {isCreating ? "Saving..." : "Save Note"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div key={note.id} className="group bg-card border border-border rounded-2xl p-6 hover:border-yellow-500/50 transition-all shadow-lg hover:shadow-yellow-500/5 relative">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => deleteNote(note.id)}
                className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg text-muted-foreground"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
               <StickyNote className="w-5 h-5 text-yellow-500" />
               <span className="text-xs font-medium px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-md uppercase tracking-wider">
                 {note.category}
               </span>
            </div>
            <h3 className="text-lg font-bold font-display mb-2 truncate pr-8">{note.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{note.content}</p>
            <div className="text-xs text-muted-foreground border-t border-white/5 pt-4">
              {note.createdAt && format(new Date(note.createdAt), "PPP")}
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/10 rounded-3xl border border-dashed border-white/10">
            <StickyNote className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No notes yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
