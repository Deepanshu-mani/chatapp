import { useEffect, useRef, useState } from "react";
type MessageType = string;
export function Chat({ name, roomId }: { name: string; roomId: string }) {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
  
    useEffect(() => {
      const ws = new WebSocket("wss://chatapp-backend-2e0h.onrender.com");      ws.onmessage = (event) => {
        setMessages((m) => [...m, event.data]);
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
      <div className="relative h-screen bg-[#111111]">
        <div className="h-[85vh] w-full bg-[#111111] pb-[100px] overflow-y-auto">
          {messages.map((msg, idx) => (
            <div className="pt-6 pl-4" key={idx}>
              <span className="text-white bg-gradient-to-br from-white/10 to-white/5 border border-white/10 w-11/12 mx-auto rounded-4xl px-3 py-2 transition">
                {msg}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 w-full flex justify-center">
          <div className="w-11/12 bg-[#222121] rounded-b-[2rem] rounded-t-[1rem] border border-white/10 flex flex-col-reverse items-end justify-end px-4 py-4 space-y-2 shadow-[0_0_10px_#00000050]">
            <div className="flex w-full items-end justify-between">
              <textarea
                ref={textareaRef}
                className="w-[90%] resize-none text-xl bg-transparent outline-none text-white/80 leading-relaxed scrollbar-hide transition-all duration-200 ease-in-out"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Type a message..."
              />
              <button
                className="text-white px-6 py-2 rounded-full ml-2 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:bg-white/10 transition"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }