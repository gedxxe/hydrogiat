
import React from 'react';
import { ConnectionStatus, TdsReading } from '../types';
import StatusIndicator from './StatusIndicator';
import Shimmer from './Shimmer';

interface CurrentTdsCardProps {
  status: ConnectionStatus;
  latestReading: TdsReading | null;
  brokerUrl: string;
}

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-6 h-full">
    {children}
  </div>
);

const CurrentTdsCard: React.FC<CurrentTdsCardProps> = ({ status, latestReading, brokerUrl }) => {
  const isConnected = status === ConnectionStatus.CONNECTED;

  return (
    <Card>
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <h2 className="text-lg font-semibold text-white/80 mb-4">Current TDS</h2>
          {isConnected && latestReading ? (
            <div className="flex items-baseline">
              <span className="text-7xl font-bold tracking-tight text-white">
                {latestReading.value.toFixed(0)}
              </span>
              <span className="text-2xl text-white/60 ml-2">ppm</span>
            </div>
          ) : (
            <Shimmer />
          )}
        </div>
        <div className="mt-6 border-t border-white/10 pt-4 text-sm text-white/50">
          <div className="flex justify-between items-center mb-2">
            <span>Status</span>
            <div className="flex items-center gap-2">
              <StatusIndicator status={status} />
              <span className="capitalize">{status.toLowerCase()}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>Broker</span>
            <span className="font-mono text-xs truncate">{new URL(brokerUrl).hostname}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CurrentTdsCard;
