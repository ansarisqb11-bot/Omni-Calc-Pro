import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Calculator, Banknote, Activity, Lightbulb } from "lucide-react";
import { useAiChat } from "@/hooks/use-ai";
import { motion, AnimatePresence } from "framer-motion";

const quickPrompts = [
  { icon: Calculator, text: "Calculate compound interest on $5000 at 7% for 10 years", color: "bg-blue-500" },
  { icon: Banknote, text: "What's the monthly payment on a $200,000 loan at 6.5% for 30 years?", color: "bg-emerald-500" },
  { icon: Activity, text: "How many calories do I burn running 5km?", color: "bg-pink-500" },
  { icon: Lightbulb, text: "Convert 100 Fahrenheit to Celsius", color: "bg-amber-500" },
];

export default function AiTools() {
  const [input, setInput] = useState("");
  const conversationId = 1;
  const { sendMessage, messages, isStreaming } = useAiChat(conversationId);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleQuickPrompt = (text: string) => {
    if (isStreaming) return;
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-violet-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Calculator</h1>
          <p className="text-sm text-slate-400">Ask anything about math, finance, or conversions</p>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-violet-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">How can I help?</h2>
              <p className="text-slate-400 text-sm max-w-sm">
                I can help with calculations, unit conversions, financial formulas, and more.
              </p>
            </div>

            <div className="w-full max-w-md space-y-3">
              <p className="text-sm text-slate-500 text-center mb-3">Try asking:</p>
              {quickPrompts.map((prompt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleQuickPrompt(prompt.text)}
                  data-testid={`quick-prompt-${i}`}
                  className="w-full flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-left hover:bg-slate-700/50 transition-all group"
                >
                  <div className={`w-8 h-8 rounded-lg ${prompt.color} bg-opacity-20 flex items-center justify-center`}>
                    <prompt.icon className={`w-4 h-4 ${prompt.color.replace("bg-", "text-")}`} />
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors flex-1">
                    {prompt.text}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user" ? "bg-primary" : "bg-violet-500/20"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-violet-400" />
                )}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-slate-800/50 border border-slate-700/50 rounded-tl-none"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content || (isStreaming && idx === messages.length - 1 ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </span>
                  ) : "")}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-4 pl-5 pr-14 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
            data-testid="input-ai-message"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 top-2 p-2.5 bg-violet-500 text-white rounded-lg hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            data-testid="button-send-message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
