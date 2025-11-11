
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ConnectionStatus, TdsReading } from '../types';

interface TdsChartProps {
  data: TdsReading[];
  status: ConnectionStatus;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/50 backdrop-blur-sm p-2 border border-white/20 rounded-md shadow-lg">
        <p className="label text-white/80">{`${new Date(label).toLocaleTimeString()}`}</p>
        <p className="intro text-white">{`TDS: ${payload[0].value.toFixed(2)} ppm`}</p>
      </div>
    );
  }
  return null;
};


const TdsChart: React.FC<TdsChartProps> = React.memo(({ data, status }) => {
  const isConnected = status === ConnectionStatus.CONNECTED;

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-4 h-96 lg:h-full flex flex-col">
      <h2 className="text-lg font-semibold text-white/80 mb-4 px-2">History (Last 50 Readings)</h2>
      <div className="flex-grow">
        {status !== ConnectionStatus.CONNECTING && data.length === 0 ? (
           <div className="flex items-center justify-center h-full text-white/40">
                {isConnected ? 'Waiting for data...' : 'Connect to the broker to see the chart.'}
           </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis
                dataKey="time"
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={12}
                tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}
                tickCount={5}
                dy={5}
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={12}
                domain={['dataMin - 10', 'dataMax + 10']}
                allowDataOverflow={true}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
});

export default TdsChart;