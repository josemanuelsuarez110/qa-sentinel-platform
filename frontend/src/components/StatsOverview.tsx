import { CheckCircle2, AlertTriangle, Clock, Landmark, DollarSign, TrendingUp, ShieldAlert } from 'lucide-react'

export type Stats = {
  totalRuns: number
  passRate: number
  totalAmount?: number
  inconsistencies?: number
  riskLevel?: string
  vulnerabilities?: number
  pagesMapped?: number
  lastRunAt?: string
}

interface StatsOverviewProps {
  stats: Stats
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const displayStats = [
    { 
      label: 'Financial Audited', 
      value: stats?.totalAmount ? `$${stats.totalAmount.toLocaleString()}` : '$0', 
      icon: DollarSign, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10',
      trend: stats?.totalAmount ? '+12% vs last month' : null
    },
    { 
      label: 'Security Issues', 
      value: (stats?.vulnerabilities ?? 0).toString(), 
      icon: ShieldAlert, 
      color: stats?.vulnerabilities && stats.vulnerabilities > 0 ? 'text-amber-400' : 'text-emerald-400', 
      bg: 'bg-amber-500/10' 
    },
    { 
      label: 'Site Topology', 
      value: `${stats?.pagesMapped ?? 0} Pages`, 
      icon: Landmark, 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10' 
    },
    { 
      label: 'Business Inconsistencies', 
      value: (stats?.inconsistencies ?? 0).toString(), 
      icon: AlertTriangle, 
      color: stats?.inconsistencies && stats.inconsistencies > 0 ? 'text-rose-400' : 'text-emerald-400', 
      bg: 'bg-rose-500/10' 
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat) => (
          <div key={stat.label} className="glass p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              </div>
            </div>
            {stat.trend && (
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                {stat.trend}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Global Risk Indicator Bar */}
      <div className="glass p-4 rounded-2xl flex items-center justify-between border-l-4 border-rose-500">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-sm font-bold uppercase tracking-widest text-slate-300">Global Risk Assessment</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Severity Level</span>
            <span className={`text-sm font-black uppercase ${stats?.riskLevel === 'High' ? 'text-rose-500' : 'text-emerald-500'}`}>
              {stats?.riskLevel || 'Low'}
            </span>
          </div>
          <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${stats?.riskLevel === 'High' ? 'w-[85%] bg-rose-500' : 'w-[10%] bg-emerald-500'}`} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
