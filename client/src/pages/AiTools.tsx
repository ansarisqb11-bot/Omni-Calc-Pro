import { useState, useRef, useEffect } from "react";
import { Send, BrainCircuit, Bot, User } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";

export default function AiTools() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch conversation - hardcoded ID 1 for MVP single chat feel
  const { data: conversation, refetch } = useQuery({
    queryKey: ['/api/conversations/1'],
    queryFn: async () => {
       // Ensure conversation exists first
       try {
         const res = await fetch('/api/conversations/1');
         if (res.ok) return await res.json();
         // Create if not found
         await fetch('/api/conversations', { 
           method: 'POST', 
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify({ title: 'General Chat' })
         });
         return { messages: [] };
       } catch (e) {
         return { messages: [] };
       }
    }
  });

  const sendMessage = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch('/api/conversations/1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
      // In a real app we'd handle the SSE stream here
      // For this MVP we just wait for the response to finish (handled by backend buffer) 
      // or we assume backend handles updates. 
      // Ideally use the SSE hook but standard refetch works for non-streaming feel.
      return res;
    },
    onSuccess: () => {
      refetch();
      setInput("");
    }
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage.mutate(input);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-500">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold font-display">AI Assistant</h2>
          <p className="text-xs text-muted-foreground">Ask anything about math, science, or finance.</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-950/50" ref={scrollRef}>
        {conversation?.messages?.length === 0 && (
           <div className="text-center text-muted-foreground mt-20">
             <BrainCircuit className="w-16 h-16 mx-auto mb-4 text-muted/30" />
             <p>No messages yet. Ask me to solve a complex equation!</p>
           </div>
        )}
        
        {conversation?.messages?.map((msg: any) => (
          <div key={msg.id} className={clsx("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
             <div className={clsx(
               "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
               msg.role === 'user' ? "bg-primary/20 text-primary" : "bg-pink-500/20 text-pink-500"
             )}>
               {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
             </div>
             <div className={clsx(
               "p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed",
               msg.role === 'user' 
                 ? "bg-primary text-primary-foreground rounded-tr-none" 
                 : "bg-muted text-foreground rounded-tl-none border border-white/5"
             )}>
               {msg.content}
             </div>
          </div>
        ))}
        {sendMessage.isPending && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center">
               <Bot className="w-4 h-4" />
             </div>
             <div className="bg-muted p-4 rounded-2xl rounded-tl-none border border-white/5">
               <div className="flex gap-1">
                 <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
                 <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100" />
                 <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200" />
               </div>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-card border-t border-border">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full bg-muted/50 border border-border rounded-xl pl-4 pr-12 py-4 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all"
            disabled={sendMessage.isPending}
          />
          <button 
            type="submit"
            disabled={sendMessage.isPending || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
