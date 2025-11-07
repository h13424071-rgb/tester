import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../constants';
import type { WeatherMetric } from '../types';

type ChartData = Array<{
  date: string;
  [key: string]: string | number | null;
}>;

interface WeatherChartProps {
  data: ChartData;
  regions: string[];
  metric: WeatherMetric | undefined;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ data, regions, metric }) => {
  if (!data || data.length === 0 || regions.length === 0) {
    return (
        <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <p>분석할 데이터를 선택해주세요.</p>
        </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
        <XAxis dataKey="date" tickFormatter={formatDate} dy={5} tick={{ fill: '#64748b' }} style={{ fontSize: '0.8rem' }} />
        <YAxis tick={{ fill: '#64748b' }} unit={metric?.unit} style={{ fontSize: '0.8rem' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
          wrapperClassName="dark:[&_.recharts-tooltip-wrapper]:!bg-slate-800/90 dark:[&_.recharts-tooltip-label]:!text-slate-200 dark:[&_.recharts-tooltip-item]:!text-slate-300 dark:[&_.recharts-tooltip-wrapper]:!border-slate-600"
        />
        <Legend />
        {regions.map((region, index) => (
          <Line 
            key={region} 
            type="monotone" 
            dataKey={region} 
            name={region}
            stroke={CHART_COLORS[index % CHART_COLORS.length]} 
            strokeWidth={2} 
            dot={{ r: 3 }} 
            activeDot={{ r: 6 }} 
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;