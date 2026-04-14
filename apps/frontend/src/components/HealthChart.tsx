'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface HealthChartProps {
  data: { time: string; pass: number; fail: number }[]
}

export default function HealthChart({ data }: HealthChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-sm">
        No trend data available for the current period.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis 
          dataKey="time" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          hide 
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#111113', border: '1px solid #1e293b', borderRadius: '12px' }}
          itemStyle={{ color: '#f8fafc' }}
        />
        <Area 
          type="monotone" 
          dataKey="pass" 
          stroke="#3b82f6" 
          strokeWidth={3} 
          fillOpacity={1} 
          fill="url(#colorPass)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
