import { useState, useEffect, useRef } from 'react';
import type { MqttClient } from 'mqtt';
import { ConnectionStatus, TdsReading, DiagnosticLog, MqttOptions } from '../types';

const MAX_DATA_POINTS = 50;
const MAX_LOG_ENTRIES = 50;
const CURRENT_TDS_UPDATE_INTERVAL = 2000; // 2 seconds
const HISTORY_UPDATE_INTERVAL = 10000; // 10 seconds

const normalizeUrl = (url: string) => {
  try {
    const u = new URL(url);
    if ((u.protocol === 'wss:' || u.protocol === 'ws:') && (!u.pathname || u.pathname === '/')) {
      u.pathname = '/mqtt';
    }
    return u.toString();
  } catch {
    return url;
  }
};

export const useMqtt = (options: MqttOptions) => {
  const { brokerUrl, topic, username, password } = options;

  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.CONNECTING);
  const [dataHistory, setDataHistory] = useState<TdsReading[]>([]);
  const [latestReading, setLatestReading] = useState<TdsReading | null>(null);
  const [diagnosticsLog, setDiagnosticsLog] = useState<DiagnosticLog[]>([]);

  const clientRef = useRef<MqttClient | null>(null);
  const mostRecentMessageRef = useRef<TdsReading | null>(null);

  useEffect(() => {
    let isMounted = true;

    const addLog = (message: string, type: DiagnosticLog['type'] = 'info') => {
      if (!isMounted) return;
      console.log(`[MQTT ${type}] ${message}`);
      setDiagnosticsLog(prev => [...prev, { time: Date.now(), message, type }].slice(-MAX_LOG_ENTRIES));
    };

    const connectMqtt = async () => {
      addLog('Initializing MQTT client...');
      try {
        const mod: any = await import('mqtt/dist/mqtt.min.js');
        const connect = mod?.connect ?? mod?.default?.connect;
        if (typeof connect !== 'function') throw new Error('mqtt.connect not found (use browser bundle)');

        const url = normalizeUrl(brokerUrl);
        const clientId = `web-tds-${Math.random().toString(16).slice(2)}`;

        const opts = {
          clientId,
          username,
          password,
          protocolVersion: 4,
          clean: true,
          reconnectPeriod: 2000,
          connectTimeout: 30000,
        } as const;

        addLog(`Connecting to ${url} ...`);
        addLog(`ClientID: ${clientId}`);

        const client = connect(url, opts);
        clientRef.current = client as unknown as MqttClient;

        (client as any).on?.('packetsend', (p: any) => addLog(`TX ${p?.cmd || ''}`));
        (client as any).on?.('packetreceive', (p: any) => addLog(`RX ${p?.cmd || ''}`));

        client.on('connect', () => {
          if (!isMounted) return;
          setStatus(ConnectionStatus.CONNECTED);
          addLog('Connected ✓', 'success');
          client.subscribe(topic, { qos: 0 }, (err) => {
            if (err) { addLog(`Subscribe error: ${err.message}`, 'error'); }
            else { addLog(`Subscribed: ${topic}`, 'success'); }
          });
        });

        client.on('message', (t, payload) => {
          if (!isMounted || t !== topic) return;
          const txt = new TextDecoder().decode(payload).trim();
          const v = Number.parseFloat(txt);
          if (Number.isFinite(v)) {
            mostRecentMessageRef.current = { time: Date.now(), value: v };
          } else {
            addLog(`Non-numeric payload: "${txt}"`, 'error');
          }
        });

        client.on('reconnect', () => { if (isMounted) { setStatus(ConnectionStatus.RECONNECTING); addLog('Reconnecting...'); } });
        client.on('close', () => { if (isMounted) { setStatus(ConnectionStatus.CLOSED); addLog('Connection closed', 'error'); } });
        client.on('error', (e) => { if (isMounted) { setStatus(ConnectionStatus.ERROR); addLog(`Client error: ${e?.message || String(e)}`, 'error'); } });
      } catch (e: any) {
        addLog(`Init error: ${e?.message || String(e)}`, 'error');
        setStatus(ConnectionStatus.ERROR);
      }
    };

    connectMqtt();

    const currentTdsTimer = setInterval(() => {
      if (isMounted && mostRecentMessageRef.current) {
        setLatestReading(mostRecentMessageRef.current);
      }
    }, CURRENT_TDS_UPDATE_INTERVAL);

    const historyTimer = setInterval(() => {
      if (isMounted && mostRecentMessageRef.current) {
        setDataHistory(prev => {
          const lastHistoryTime = prev.length > 0 ? prev[prev.length - 1].time : 0;
          if (mostRecentMessageRef.current && mostRecentMessageRef.current.time > lastHistoryTime) {
            return [...prev, mostRecentMessageRef.current].slice(-MAX_DATA_POINTS);
          }
          return prev;
        });
      }
    }, HISTORY_UPDATE_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(currentTdsTimer);
      clearInterval(historyTimer);
      try { clientRef.current?.end(true); } catch {}
      clientRef.current = null;
    };
  }, [brokerUrl, topic, username, password]);

  return { status, latestReading, dataHistory, diagnosticsLog };
};