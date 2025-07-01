export interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  sender?: string;
  timestamp: Date;
}

export interface WebSocketMessage {
  type: 'join' | 'chat' | 'user_joined' | 'user_left' | 'error';
  payload: {
    roomId?: string;
    name?: string;
    message?: string;
    user?: string;
    error?: string;
  };
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';