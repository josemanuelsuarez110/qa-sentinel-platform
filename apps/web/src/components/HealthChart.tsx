'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const data = [
  { time: '00:00', pass: 95, fail: 5 },
  { time: '04:00', pass: 98, fail: 2 },
  { time: '08:00', pass: 92, fail: 8 },
  { time: '12:00', pass: 99, fail: 1 },
  { time: '16:00', pass: 97, fail: 3 },
  { time: '20:00', pass: 96, fail: 4 },
  { time: '23:59', pass: 100, fail: 0 },
]

export default function HealthChart() {
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
