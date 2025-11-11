export enum ConnectionStatus {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING',
  CLOSED = 'CLOSED',
  ERROR = 'ERROR',
}

export interface TdsReading {
  time: number;
  value: number;
}

export interface DiagnosticLog {
  time: number;
  message: string;
  type: 'info' | 'success' | 'error';
}

export interface MqttOptions {
  brokerUrl: string;
  topic: string;
  username: string;
  password?: string;
}
