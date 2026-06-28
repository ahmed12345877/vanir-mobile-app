'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { RevenueDataPoint } from '@/lib/types';
import { useState } from 'react';

const MOCK_DATA: RevenueDataPoint[] = [
  { month: 'Jan', hotels: 420, flights: 180, cars: 90, experiences: 140 },
  { month: 'Feb', hotels: 380, flights: 220, cars: 80, experiences: 165 },
  { month: 'Mar', hotels: 510, flights: 260, cars: 110, experiences: 190 },
  { month: 'Apr', hotels: 580, flights: 295, cars: 130, experiences: 210 },
  { month: 'May', hotels: 620, flights: 310, cars: 145, experiences: 250 },
  { month: 'Jun', hotels: 710, flights: 340, cars: 160, experiences: 290 },
  { month: 'Jul', hotels: 890, flights: 410, cars: 200, experiences: 340 },
  { month: 'Aug', hotels: 960, flights: 450, cars: 220, experiences: 380 },
  { month: 'Sep', hotels: 820, flights: 390, cars: 185, experiences: 320 },
  { month: 'Oct', hotels: 740, flights: 360, cars: 170, experiences: 295 },
  { month: 'Nov', hotels: 680, flights: 320, cars: 150, experiences: 270 },
  { month: 'Dec', hotels: 950, flights: 480, cars: 240, experiences: 420 },
];

const COLORS = {
  hotels: '#c9a84c',
  flights: '#7eb3ff',
  cars: '#3fb98f',
  experiences: '#a97fff',
};

type ChartType = 'area' | 'bar';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: any) => s + (p.value ?? 0), 0);
  return (
    <div className="bg-[#14141f] border border-[rgba(201,168,76,0.2)] rounded-xl p-3 shadow-2xl min-w-40">
      <p className="text-[#c9a84c] text-xs font-bold tracking-wider mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[#a8a099] text-xs capitalize">{entry.name}</span>
          </div>
          <span className="text-[#f5f0e8] text-xs font-semibold">${entry.value}K</span>
        </div>
      ))}
      <div className="border-t border-white/[0.06] mt-2 pt-2 flex justify-between">
        <span className="text-[#5a5560] text-xs">Total</span>
        <span className="text-[#c9a84c] text-xs font-bold">${total}K</span>
      </div>
    </div>
  );
}

export function RevenueChart() {
  const [chartType, setChartType] = useState<ChartType>('area');

  return (
    <div className="bg-[#0f0f1a] border border-white/[0.06] rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-[#f5f0e8] font-bold text-base">Revenue Breakdown</h3>
          <p className="text-[#5a5560] text-xs mt-0.5">Monthly revenue by category (USD thousands)</p>
        </div>
        <div className="flex gap-1 bg-[#14141f] rounded-lg p-0.5 border border-white/[0.06]">
          {(['area', 'bar'] as ChartType[]).map(t => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={`
                px-3 py-1.5 rounded-md text-xs font-semibold transition-all
                ${chartType === t
                  ? 'bg-[rgba(201,168,76,0.15)] text-[#c9a84c]'
                  : 'text-[#5a5560] hover:text-[#a8a099]'
                }
              `}>
              {t === 'area' ? '∿ Area' : '▭ Bar'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        {chartType === 'area' ? (
          <AreaChart data={MOCK_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              {Object.entries(COLORS).map(([key, color]) => (
                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#5a5560', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#5a5560', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {Object.entries(COLORS).map(([key, color]) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${key})`}
                dot={false}
                activeDot={{ r: 4, fill: color, stroke: '#080810', strokeWidth: 2 }}
              />
            ))}
          </AreaChart>
        ) : (
          <BarChart data={MOCK_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#5a5560', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#5a5560', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {Object.entries(COLORS).map(([key, color]) => (
              <Bar key={key} dataKey={key} fill={color} radius={[3, 3, 0, 0]} opacity={0.85} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {Object.entries(COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[#a8a099] text-xs capitalize">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
