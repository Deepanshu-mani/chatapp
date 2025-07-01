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
      <div className="h-screen flex flex-col justify-center items-center bg-[#0a0a0a] text-white px-4">
        <h1 className="text-3xl font-semibold mb-8 tracking-wide text-white/80">Join a Room</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 w-full max-w-md p-8 bg-[#121212] rounded-xl shadow-lg border border-white/10"
        >
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-md bg-[#1e1e1e] text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
          />
          <input
            type="text"
            placeholder="Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="p-3 rounded-md bg-[#1e1e1e] text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
          />
          <button
            type="submit"
            className="py-3 bg-[#1e1e1e] text-white border border-white/10 rounded-md font-medium hover:bg-[#2a2a2a] transition"
          >
            Enter Room
          </button>
        </form>
      </div>
    );
  }