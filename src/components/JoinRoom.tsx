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
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white px-4">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </div>
        <h1 className="text-3xl font-light mb-2 text-gray-100">Welcome to Chat</h1>
        <p className="text-gray-400 text-sm">Enter your details to join a room</p>
      </div>
      
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm p-6 bg-gray-900 rounded-2xl shadow-xl border border-gray-800"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-100 text-sm font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-100 text-sm font-medium mb-2">
              Room ID
            </label>
            <input
              type="text"
              placeholder="Enter room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 mt-2"
        >
          Join Room
        </button>
      </form>
    </div>
  );
}