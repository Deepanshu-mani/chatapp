import { useState } from "react";

export function JoinRoom({ onJoin }: { onJoin: (name: string, roomId: string) => void }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [errors, setErrors] = useState<{ name?: string; room?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; room?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!room.trim()) {
      newErrors.room = "Room ID is required";
    } else if (room.trim().length < 3) {
      newErrors.room = "Room ID must be at least 3 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onJoin(name.trim(), room.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Chat App
          </h1>
          <p className="text-white/60">Join a room to start chatting</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-8 bg-[#121212] rounded-2xl shadow-2xl border border-white/10"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
              }}
              className={`w-full p-4 rounded-xl bg-[#1e1e1e] text-white placeholder-white/40 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-white/10'
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="room" className="block text-sm font-medium text-white/80 mb-2">
              Room ID
            </label>
            <input
              id="room"
              type="text"
              placeholder="Enter room ID"
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
                if (errors.room) setErrors(prev => ({ ...prev, room: undefined }));
              }}
              className={`w-full p-4 rounded-xl bg-[#1e1e1e] text-white placeholder-white/40 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.room ? 'border-red-500' : 'border-white/10'
              }`}
            />
            {errors.room && (
              <p className="text-red-400 text-sm mt-1">{errors.room}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Join Room
          </button>
        </form>

        <div className="text-center mt-6 text-white/50 text-sm">
          <p>Create or join any room by entering a room ID</p>
        </div>
      </div>
    </div>
  );
}