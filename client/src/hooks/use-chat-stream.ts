import { useState, useEffect } from "react";

interface ChatState {
  chunks: string[];
  text: string;
  isStreaming: boolean;
  error: string | null;
}

export function useChatStream(conversationId: number | null) {
  const [streamState, setStreamState] = useState<Record<number, ChatState>>({});

  const sendMessage = async (content: string) => {
    if (!conversationId) throw new Error("No active conversation");

    const messageId = Date.now(); // Temp ID for tracking this specific request locally if needed

    setStreamState(prev => ({
      ...prev,
      [conversationId]: { 
        chunks: [], 
        text: "", 
        isStreaming: true, 
        error: null 
      }
    }));

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                setStreamState(prev => ({
                  ...prev,
                  [conversationId]: { ...prev[conversationId], error: data.error, isStreaming: false }
                }));
              } else if (data.done) {
                setStreamState(prev => ({
                  ...prev,
                  [conversationId]: { ...prev[conversationId], isStreaming: false }
                }));
              } else if (data.content) {
                setStreamState(prev => {
                  const current = prev[conversationId] || { chunks: [], text: "", isStreaming: true, error: null };
                  return {
                    ...prev,
                    [conversationId]: {
                      ...current,
                      chunks: [...current.chunks, data.content],
                      text: current.text + data.content,
                    }
                  };
                });
              }
            } catch (e) {
              console.error("Error parsing SSE chunk", e);
            }
          }
        }
      }
    } catch (err: any) {
      setStreamState(prev => ({
        ...prev,
        [conversationId]: { ...prev[conversationId], error: err.message, isStreaming: false }
      }));
    }
  };

  return { 
    sendMessage, 
    currentStream: conversationId ? streamState[conversationId] : undefined 
  };
}
