'use client'

import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts'
import { Activity, ShieldAlert, BadgeDollarSign, Filter } from 'lucide-react'

// Mock Data
const executionTrends = [
  { time: '10:00', passRate: 85, duration: 4.2 },
  { time: '11:00', passRate: 88, duration: 3.8 },
  { time: '12:00', passRate: 75, duration: 5.1 }, // Anomaly
  { time: '13:00', passRate: 92, duration: 4.0 },
  { time: '14:00', passRate: 95, duration: 3.9 },
  { time: '15:00', passRate: 98, duration: 3.7 },
  { time: '16:00', passRate: 100, duration: 3.5 },
]

const vulnerabilityData = [
  { name: 'XSS', value: 3 },
  { name: 'CSRF', value: 1 },
  { name: 'Headers', value: 5 },
  { name: 'Auth', value: 0 },
]

const COLORS = ['#f43f5e', '#f59e0b', '#3b82f6', '#10b981']

export default function ProDashboard() {
  const [timeRange, setTimeRange] = useState('Today')

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
             <Activity className="text-emerald-400 w-6 h-6" />
             Real-Time Analytics
           </h2>
           <p className="text-slate-400 text-sm mt-1">Cross-engine performance and risk telemetry.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Filter className="w-4 h-4 text-emerald-400" />
          {timeRange}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Trend Line (Spans 2 cols) */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl group border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300">
               Engine Stability Trend
             </h3>
             <span className="text-emerald-400 font-bold text-xs bg-emerald-400/10 px-2 py-0.5 rounded-full">LIVE</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={executionTrends} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPassRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0b', borderColor: '#ffffff20', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="passRate" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPassRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="space-y-6">
          {/* Vulnerability Bar Chart */}
          <div className="glass p-6 rounded-2xl h-[calc(50%-12px)] flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Threat Topology
            </h3>
            <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={vulnerabilityData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" hide />
                   <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ backgroundColor: '#0a0a0b', borderColor: '#ffffff20', borderRadius: '8px', fontSize: '12px' }}
                   />
                   <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                     {vulnerabilityData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 mt-2">
               <span>Highest Risk: Headers</span>
               <span className="text-white">9 Total</span>
            </div>
          </div>

          {/* Financial Metrics Mini-Card */}
          <div className="glass p-6 rounded-2xl h-[calc(50%-12px)] bg-gradient-to-br from-emerald-900/40 to-transparent border-t border-emerald-500/20 relative overflow-hidden">
             <div className="absolute -right-6 -bottom-6 opacity-10">
               <BadgeDollarSign className="w-32 h-32" />
             </div>
             <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2 relative">
               <BadgeDollarSign className="w-4 h-4" />
               Financial Velocity
             </h3>
             <div className="relative space-y-4">
                <div>
                  <p className="text-slate-400 text-xs font-medium">Reconciled Volume</p>
                  <p className="text-3xl font-black tracking-tighter text-white drop-shadow-sm">$842.5K</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium">Anomaly Detection Rate</p>
                  <p className="text-emerald-400 text-lg font-bold">100%</p>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
