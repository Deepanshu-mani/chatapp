import { useEffect, useRef, useState, useCallback } from 'react';
import { Message, WebSocketMessage, ConnectionStatus } from '../types';

export function useWebSocket(roomId: string, name: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnectionStatus('connecting');
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.onopen = () => {
      setConnectionStatus('connected');
      reconnectAttemptsRef.current = 0;
      
      ws.send(JSON.stringify({
        type: 'join',
        payload: { roomId, name }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        
        switch (data.type) {
          case 'chat':
            addMessage({
              id: Date.now().toString(),
              type: 'user',
              content: data.payload.message || '',
              sender: data.payload.name,
              timestamp: new Date()
            });
            break;
          
          case 'user_joined':
            addMessage({
              id: Date.now().toString(),
              type: 'system',
              content: `${data.payload.user} joined the room`,
              timestamp: new Date()
            });
            break;
          
          case 'user_left':
            addMessage({
              id: Date.now().toString(),
              type: 'system',
              content: `${data.payload.user} left the room`,
              timestamp: new Date()
            });
            break;
          
          case 'error':
            addMessage({
              id: Date.now().toString(),
              type: 'system',
              content: `Error: ${data.payload.error}`,
              timestamp: new Date()
            });
            break;
        }
      } catch (error) {
        // Fallback for plain text messages
        addMessage({
          id: Date.now().toString(),
          type: 'user',
          content: event.data,
          timestamp: new Date()
        });
      }
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
      
      // Attempt to reconnect with exponential backoff
      if (reconnectAttemptsRef.current < 5) {
        const delay = Math.pow(2, reconnectAttemptsRef.current) * 1000;
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++;
          connect();
        }, delay);
      }
    };

    ws.onerror = () => {
      setConnectionStatus('error');
    };

    wsRef.current = ws;
  }, [roomId, name, addMessage]);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && message.trim()) {
      wsRef.current.send(JSON.stringify({
        type: 'chat',
        payload: { message: message.trim() }
      }));
      return true;
    }
    return false;
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    messages,
    connectionStatus,
    onlineUsers,
    sendMessage,
    reconnect: connect
  };
}