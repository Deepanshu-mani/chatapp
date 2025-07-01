import { useState } from "react";

export function JoinRoom({ onJoin }: { onJoin: (name: string, roomId: string) => void }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && room) {
      onJoin(name, room);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#0b141a] text-white px-4">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-[#00a884] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </div>
        <h1 className="text-3xl font-light mb-2 text-[#e9edef]">Welcome to Chat</h1>
        <p className="text-[#8696a0] text-sm">Enter your details to join a room</p>
      </div>
      
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm p-6 bg-[#202c33] rounded-2xl shadow-xl border border-[#2a3942]"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[#e9edef] text-sm font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] border border-[#3b4a54] focus:outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884] transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-[#e9edef] text-sm font-medium mb-2">
              Room ID
            </label>
            <input
              type="text"
              placeholder="Enter room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] border border-[#3b4a54] focus:outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884] transition-colors"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-3 bg-[#00a884] hover:bg-[#00916a] text-white rounded-lg font-medium transition-colors duration-200 mt-2"
        >
          Join Room
        </button>
      </form>
    </div>
  );
}