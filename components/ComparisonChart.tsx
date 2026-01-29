import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { TaxResult } from '../types.ts';

interface ComparisonChartProps {
  data: TaxResult;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => {
  const chartData = [
    {
      name: 'Gelir Vergisi',
      amount: data.incomeTaxAmount,
      color: '#3b82f6', // blue-500
    },
    {
      name: 'Kurumlar Vergisi',
      amount: data.corporateTaxAmount,
      color: '#64748b', // slate-500
    },
  ];

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M ₺`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}B ₺`;
    return `${value} ₺`;
  };

  return (
    <div className="h-80 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#475569', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={formatYAxis} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            formatter={(value: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value)}
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={80}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList dataKey="amount" position="top" formatter={(value: number) => formatYAxis(value)} fill="#64748b" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;