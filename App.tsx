import React from 'react';
import { useMqtt } from './hooks/useMqtt';
import { ConnectionStatus } from './types';
import CurrentTdsCard from './components/CurrentTdsCard';
import TdsChart from './components/TdsChart';
import StatusIndicator from './components/StatusIndicator';
import DiagnosticsCard from './components/DiagnosticsCard';

const ConfigError: React.FC<{ missingVars: string[] }> = ({ missingVars }) => (
  <div className="min-h-screen text-white flex flex-col items-center justify-center text-center p-8">
    <div className="bg-red-900/50 border border-red-500 rounded-2xl p-8 max-w-lg">
      <h1 className="text-3xl font-bold text-red-300 mb-4">Configuration Error</h1>
      <p className="text-white/80 mb-6">
        The application cannot start because the following required environment variables are missing. Please configure them to proceed.
      </p>
      <div className="bg-black/30 p-4 rounded-lg text-left">
        <ul className="list-disc list-inside text-red-300 font-mono text-sm">
          {missingVars.map(v => <li key={v}>{v}</li>)}
        </ul>
      </div>
       <p className="text-xs text-white/50 mt-6">
        This is a fail-safe to prevent insecure operation and protect credentials. The app will not attempt to connect until all variables are set.
      </p>
    </div>
  </div>
);

const App: React.FC = () => {
  // Vite exposes only variables prefixed with VITE_ at build-time
  const brokerUrl = (import.meta as any).env?.VITE_MQTT_URL as string | undefined;
  const topic = (import.meta as any).env?.VITE_MQTT_TOPIC as string | undefined;
  const username = (import.meta as any).env?.VITE_MQTT_USERNAME as string | undefined;
  const password = (import.meta as any).env?.VITE_MQTT_PASSWORD as string | undefined;

  const missingVars = [
    !brokerUrl && 'VITE_MQTT_URL',
    !topic && 'VITE_MQTT_TOPIC',
    !username && 'VITE_MQTT_USERNAME',
    !password && 'VITE_MQTT_PASSWORD',
  ].filter(Boolean) as string[];

  if (missingVars.length > 0) {
    return <ConfigError missingVars={missingVars} />;
  }

  const { status, latestReading, dataHistory, diagnosticsLog } = useMqtt({
    brokerUrl: brokerUrl!,
    topic: topic!,
    username: username!,
    password: password!,
  });

  const getStatusText = (s: ConnectionStatus): string => {
    switch (s) {
      case ConnectionStatus.CONNECTED:
        return 'Connected';
      case ConnectionStatus.CONNECTING:
        return 'Connecting...';
      case ConnectionStatus.RECONNECTING:
        return 'Reconnecting...';
      case ConnectionStatus.CLOSED:
        return 'Disconnected';
      case ConnectionStatus.ERROR:
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/90 font-mono">
              Realtime EC/TDS Monitor
            </h1>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="text-right text-xs text-white/70">
              <p className="font-semibold">Program KKN UNNES GIAT Angkatan 13</p>
              <p className="text-white/50">created with ❤️ by gedxxe</p>
            </div>
            <img src="/GIAT 13 UNNES.png" alt="GIAT 13 UNNES Logo" className="h-12 w-12 rounded-full bg-white/10 p-1 object-cover" />
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <CurrentTdsCard
              status={status}
              latestReading={latestReading}
              brokerUrl={brokerUrl!}
            />
            <DiagnosticsCard log={diagnosticsLog} />
          </div>
          <div className="lg:col-span-2">
            <TdsChart data={dataHistory} status={status} />
          </div>
        </main>

        <section className="mt-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-white/80 mb-3">About This Project</h2>
                <p className="text-sm text-white/60 leading-relaxed">
                    This project is part of a community service program (KKN) located in Gunungpati Village, Gunungpati District, Semarang City, running from October 30 to November 30, 2025.
                </p>
                <p className="text-sm text-white/60 mt-2">
                    Programmer: <span className="font-semibold text-white/80">I Gede Bagus Jayendra</span>
                </p>
            </div>
        </section>

        <footer className="mt-8 py-4 text-center text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <StatusIndicator status={status} />
            <span className="text-sm">{getStatusText(status)}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;