import "./App.css";
import { Chat } from "./components/Chat";
import { JoinRoom } from "./components/JoinRoom";
import { useState} from "react";



function App() {
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleJoin = (username: string, room: string) => {
    setName(username);
    setRoomId(room);
    setJoined(true);
  };

  return joined ? <Chat name={name} roomId={roomId} /> : <JoinRoom onJoin={handleJoin} />;
}

export default App;
