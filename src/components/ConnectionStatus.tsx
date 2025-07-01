import { ConnectionStatus as Status } from '../types';

interface ConnectionStatusProps {
  status: Status;
  onReconnect: () => void;
}

export function ConnectionStatus({ status, onReconnect }: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          color: 'bg-green-500',
          text: 'Connected',
          showReconnect: false
        };
      case 'connecting':
        return {
          color: 'bg-yellow-500',
          text: 'Connecting...',
          showReconnect: false
        };
      case 'disconnected':
        return {
          color: 'bg-red-500',
          text: 'Disconnected',
          showReconnect: true
        };
      case 'error':
        return {
          color: 'bg-red-500',
          text: 'Connection Error',
          showReconnect: true
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-black/20 border-b border-white/10">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="text-white/70 text-sm">{config.text}</span>
      {config.showReconnect && (
        <button
          onClick={onReconnect}
          className="text-xs text-blue-400 hover:text-blue-300 underline ml-2"
        >
          Reconnect
        </button>
      )}
    </div>
  );
}