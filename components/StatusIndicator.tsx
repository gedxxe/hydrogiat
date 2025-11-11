
import React from 'react';
import { ConnectionStatus } from '../types';

interface StatusIndicatorProps {
  status: ConnectionStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const statusConfig = {
    [ConnectionStatus.CONNECTED]: { color: 'bg-green-500', pulse: true },
    [ConnectionStatus.CONNECTING]: { color: 'bg-yellow-500', pulse: true },
    [ConnectionStatus.RECONNECTING]: { color: 'bg-yellow-500', pulse: true },
    [ConnectionStatus.CLOSED]: { color: 'bg-red-500', pulse: false },
    [ConnectionStatus.ERROR]: { color: 'bg-red-500', pulse: false },
  };

  const { color, pulse } = statusConfig[status] || { color: 'bg-gray-500', pulse: false };

  return (
    <div className={`w-3 h-3 rounded-full ${color} transition-colors duration-300`}>
      {pulse && <div className={`w-3 h-3 rounded-full ${color} animate-ping absolute`}></div>}
    </div>
  );
};

export default StatusIndicator;
