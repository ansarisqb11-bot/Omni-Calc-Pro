import { useState, useRef, useEffect } from "react";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Mic, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiTools() {
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // 1. Fetch active conversation
  const { data: conversation } = useQuery({
    queryKey: ['/api/conversations', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const res = await fetch(`/api/conversations/${conversationId}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!conversationId
  });

  // 2. Create conversation if none
  const createConversation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/conversations', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Calculator Chat' })
      });
      return res.json();
    },
    onSuccess: (data) => setConversationId(data.id)
  });

  useEffect(() => {
    if (!conversationId) createConversation.mutate();
  }, []);

  const { sendMessage, currentStream } = useChatStream(conversationId);

  // Combine historical messages with current stream
  const messages: Message[] = [
    ...(conversation?.messages || []),
    ...(currentStream?.isStreaming || currentStream?.text ? [{ 
      role: 'assistant' as const, 
      content: currentStream.text 
    }] : [])
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;
    
    // Optimistic user update
    const userMsg = input;
    setInput("");
    
    await sendMessage(userMsg);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentStream]);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-accent" />
            AI Assistant
          </h1>
          <p className="text-muted-foreground">Ask anything, solve equations, or get explanations.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-border/50 shadow-xl bg-card/50 backdrop-blur">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 pb-4">
            {messages.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <Sparkles className="w-12 h-12 mb-4" />
                <p>Start a conversation...</p>
              </div>
            )}
            
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed
                      ${msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted rounded-tl-none border border-border/50'
                      }
                    `}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-4 bg-background border-t border-border">
          <form onSubmit={handleSend} className="relative flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask 'What is 25% of 850?' or 'Explain quantum physics'..."
              className="h-14 pl-4 pr-24 rounded-2xl bg-muted/50 border-border shadow-inner text-base"
            />
            <div className="absolute right-2 top-2 flex gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                <Mic className="w-5 h-5" />
              </Button>
              <Button 
                type="submit" 
                disabled={currentStream?.isStreaming || !input.trim()}
                className="h-10 w-10 rounded-xl bg-primary shadow-lg shadow-primary/25 p-0"
              >
                {currentStream?.isStreaming ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 ml-0.5" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
