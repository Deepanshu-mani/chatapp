import { useEffect, useRef, useState } from "react";

type MessageType = {
  sender: string;
  text: string;
};

export function Chat({ name, roomId }: { name: string; roomId: string }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://chatapp-backend-2e0h.onrender.com");
    ws.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        setMessages((m) => [...m, messageData]);
      } catch (error) {
        // Fallback for plain text messages
        setMessages((m) => [...m, { sender: "Unknown", text: event.data }]);
      }
    };

    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId,
            name,
          },
        })
      );
    };

    return () => {
      ws.close();
    };
  }, [roomId, name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === "") return;
    if (wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: { message: input },
        })
      );
    }
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getInitials = (senderName: string) => {
    return senderName.charAt(0).toUpperCase();
  };

  const isMyMessage = (sender: string) => {
    return sender === name;
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 px-4 py-3 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {roomId.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-white font-medium">{roomId}</h2>
            <p className="text-gray-400 text-sm">Room Chat</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {messages.map((msg, idx) => {
          const isMe = isMyMessage(msg.sender);
          return (
            <div
              key={idx}
              className={`flex items-end space-x-2 ${
                isMe ? "justify-end" : "justify-start"
              } mb-4`}
            >
              {/* Avatar for others */}
              {!isMe && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                  <span className="text-white text-xs font-medium">
                    {getInitials(msg.sender)}
                  </span>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[75%] ${
                  isMe
                    ? "bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-100"
                } rounded-lg px-3 py-2 shadow-sm`}
              >
                {/* Sender name for others */}
                {!isMe && (
                  <div className="text-gray-300 text-xs font-medium mb-1">
                    {msg.sender}
                  </div>
                )}
                
                {/* Message text */}
                <div className="text-sm leading-relaxed break-words">
                  {msg.text}
                </div>
                
                {/* Timestamp placeholder */}
                <div className={`text-xs mt-1 ${
                  isMe ? "text-gray-400" : "text-gray-500"
                } text-right`}>
                  {new Date().toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>

              {/* Avatar for me */}
              {isMe && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                  <span className="text-white text-xs font-medium">
                    {getInitials(msg.sender)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-900 px-4 py-3 border-t border-gray-800">
        <div className="flex items-end space-x-3">
          <div className="flex-1 bg-gray-800 rounded-lg px-4 py-2 min-h-[44px] flex items-center">
            <textarea
              ref={textareaRef}
              className="w-full resize-none bg-transparent outline-none text-gray-100 placeholder-gray-400 text-sm leading-relaxed scrollbar-hide"
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type a message"
            />
          </div>
          
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors duration-200 flex items-center justify-center min-w-[44px] h-[44px]"
            onClick={handleSend}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}