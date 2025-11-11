import React, { useEffect, useRef } from 'react';
import { DiagnosticLog } from '../types';

interface DiagnosticsCardProps {
  log: DiagnosticLog[];
}

const LogMessage: React.FC<{ entry: DiagnosticLog }> = ({ entry }) => {
  const colorClasses = {
    info: 'text-white/70',
    success: 'text-green-400',
    error: 'text-red-400',
  };

  return (
    <div className={`flex font-mono text-xs ${colorClasses[entry.type]}`}>
      <span className="flex-shrink-0 text-white/40 mr-2">
        [{new Date(entry.time).toLocaleTimeString()}]
      </span>
      <p className="flex-grow break-words">{entry.message}</p>
    </div>
  );
};

const DiagnosticsCard: React.FC<DiagnosticsCardProps> = ({ log }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-6 flex flex-col h-64">
      <h2 className="text-lg font-semibold text-white/80 mb-4 flex-shrink-0">
        Connection Diagnostics
      </h2>
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto space-y-2 pr-2 -mr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        {log.length > 0 ? (
          log.map((entry) => <LogMessage key={entry.time + entry.message} entry={entry} />)
        ) : (
          <p className="text-sm text-white/40 text-center pt-8">
            Waiting for connection events...
          </p>
        )}
      </div>
    </div>
  );
};

export default DiagnosticsCard;
