import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useAiChat } from "@/hooks/use-ai";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AiTools() {
  const [input, setInput] = useState("");
  // Hardcoded conversation ID for demo - in real app, create/select convo
  const conversationId = 1;
  const { sendMessage, messages, isStreaming } = useAiChat(conversationId);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Create a conversation on mount if not exists (simulated)
  const queryClient = useQueryClient();
  const createConvo = useMutation({
    mutationFn: async () => {
      await fetch('/api/conversations', {
         method: 'POST', 
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({ title: 'General Help' })
      });
    }
  });

  useEffect(() => {
    // createConvo.mutate(); // Uncomment to actually create on load
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full relative bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-violet-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold">AI Assistant</h1>
          <p className="text-xs text-muted-foreground">Ask anything about math, physics, or finance</p>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pb-24"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <Bot className="w-16 h-16 text-muted-foreground" />
            <p className="text-lg font-medium">How can I help you calculate today?</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-primary' : 'bg-secondary'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-primary-foreground" /> : <Bot className="w-4 h-4 text-secondary-foreground" />}
              </div>
              
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-card border border-border/50 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content || (isStreaming && idx === messages.length - 1 ? "Thinking..." : "")}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border/50 absolute bottom-0 left-0 right-0">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="w-full bg-card border border-border rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-lg"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 top-2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
