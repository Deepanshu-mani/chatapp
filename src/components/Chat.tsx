import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { ConnectionStatus } from "./ConnectionStatus";
import { MessageBubble } from "./MessageBubble";

export function Chat({ name, roomId }: { name: string; roomId: string }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, connectionStatus, sendMessage, reconnect } = useWebSocket(roomId, name);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === "") return;
    
    const success = sendMessage(input);
    if (success) {
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative h-screen bg-[#111111] flex flex-col">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-white/10">
        <div className="px-4 py-3">
          <h1 className="text-white font-semibold">Room: {roomId}</h1>
          <p className="text-white/60 text-sm">Logged in as {name}</p>
        </div>
        <ConnectionStatus status={connectionStatus} onReconnect={reconnect} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/50 text-center">
              Welcome to room {roomId}!<br />
              Start chatting to see messages here.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.sender === name}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-[#1a1a1a] border-t border-white/10">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 bg-[#2a2a2a] rounded-2xl border border-white/10 px-4 py-3">
            <textarea
              ref={textareaRef}
              className="w-full resize-none bg-transparent outline-none text-white placeholder-white/50 leading-relaxed scrollbar-hide"
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={
                connectionStatus === 'connected' 
                  ? "Type a message..." 
                  : "Connecting..."
              }
              disabled={connectionStatus !== 'connected'}
            />
          </div>
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-2xl font-medium transition-colors"
            onClick={handleSend}
            disabled={connectionStatus !== 'connected' || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}